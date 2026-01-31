const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// --- Bootstrapping: Auto-install dependencies ---
const REQUIRED_PACKAGES = ["commander", "prompts", "picocolors", "postcss"];

function installDependencies() {
	console.log("Checking dependencies...");
	const missing = [];
	for (const pkg of REQUIRED_PACKAGES) {
		try {
			require.resolve(pkg);
		} catch (e) {
			missing.push(pkg);
		}
	}

	if (missing.length > 0) {
		console.log(
			`Installing missing dependencies: ${missing.join(", ")}...`,
		);
		try {
			execSync(`npm install --no-save ${missing.join(" ")}`, {
				stdio: "inherit",
			});
			console.log("Dependencies installed successfully.\n");
		} catch (e) {
			console.error("Failed to install dependencies automatically.");
			console.error(
				"Please run: npm install commander prompts picocolors",
			);
			process.exit(1);
		}
	}
}

installDependencies();

// --- Import Dependencies ---
const { Command } = require("commander");
const prompts = require("prompts");
const pc = require("picocolors");
const postcss = require("postcss");

// --- Constants ---
const MARKER_START = "/* @shadcn-dynamic-theme-start */";
const MARKER_END = "/* @shadcn-dynamic-theme-end */";

// --- Config Manager ---
class ConfigManager {
	static findProjectConfig() {
		try {
			const componentsJsonPath = path.resolve("components.json");
			if (fs.existsSync(componentsJsonPath)) {
				const componentsConfig = JSON.parse(
					fs.readFileSync(componentsJsonPath, "utf-8"),
				);
				const cssPath =
					componentsConfig.tailwind?.css ||
					componentsConfig.css ||
					componentsConfig.globalCss;
				if (cssPath) {
					return { cssPath: path.resolve(cssPath) };
				}
			}
		} catch (e) {
			console.warn(pc.yellow("Warning: Could not read components.json."));
		}
		return null;
	}

	static loadThemes() {
		const themesPath = path.join(__dirname, "themes.json");
		if (!fs.existsSync(themesPath)) {
			console.error(
				pc.red(`Error: themes.json not found at ${themesPath}`),
			);
			process.exit(1);
		}
		return JSON.parse(fs.readFileSync(themesPath, "utf-8"));
	}
}

// --- Theme Generator ---
class ThemeGenerator {
	constructor(allData, cssPath) {
		this.baseColors = allData.base;
		this.themeColors = allData.theme;
		this.cssPath = cssPath;
		this.themesPath = path.join(path.dirname(cssPath), "themes.css");
	}

	sortVariables(cssString) {
		return cssString
			.split("\n")
			.map((l) => l.trim())
			.filter((l) => l)
			.sort()
			.map((l) => "  " + l)
			.join("\n");
	}

	// Returns: { mainCss: string, auxCss: string }
	generateBlocks(defaultBase, auxBases, defaultTheme, auxThemes) {
		// Helper to merge CSS string provided in JSON
		const mergeCss = (baseCss, themeCss) => {
			return this.sortVariables(baseCss + "\n" + themeCss);
		};

		// 1. Main CSS (for globals.css) - Contains Default Selection (:root, .dark)
		let mainCss = `${MARKER_START}\n`;
		mainCss += `
:root {
  /* Default Radius */
  --radius: 0.625rem;
${mergeCss(defaultBase.css.light, defaultTheme.css.light)}
}
.dark {
${mergeCss(defaultBase.css.dark, defaultTheme.css.dark)}
}
`;
		mainCss += `${MARKER_END}\n`;

		// 2. Aux CSS (for themes.css) - Contains Switchable Options
		let auxCss = ``;

		auxBases.forEach((base) => {
			//			if (base.name === defaultBase.name) return;
			auxCss += `
:root.base-${base.name} {
${this.sortVariables(base.css.light)}
}
.dark.base-${base.name} {
${this.sortVariables(base.css.dark)}
}
`;
		});

		auxThemes.forEach((theme) => {
			//			if (theme.name === defaultTheme.name) return;
			auxCss += `
:root.theme-${theme.name} {
${this.sortVariables(theme.css.light)}
}
.dark.theme-${theme.name} {
${this.sortVariables(theme.css.dark)}
}
`;
		});

		return { mainCss, auxCss };
	}

	getAllManagedVariables() {
		const vars = new Set(["--radius"]);
		const collectVars = (cssStr) => {
			if (!cssStr) return;
			cssStr.split(";").forEach((decl) => {
				const prop = decl.split(":")[0]?.trim();
				if (prop && prop.startsWith("--")) vars.add(prop);
			});
		};

		[...this.baseColors, ...this.themeColors].forEach((item) => {
			collectVars(item.css.light);
			collectVars(item.css.dark);
		});
		return vars;
	}

	cleanExistingThemeVars(cssContent) {
		const managedVars = this.getAllManagedVariables();

		try {
			const removeThemeVarsPlugin = () => {
				return {
					postcssPlugin: "remove-theme-vars",
					Once(root) {
						root.walkRules((rule) => {
							if (
								rule.parent.type === "root" &&
								(rule.selector === ":root" ||
									rule.selector === ".dark")
							) {
								rule.walkDecls((decl) => {
									if (managedVars.has(decl.prop)) {
										decl.remove();
									}
								});
								// Remove rule if empty
								if (rule.nodes.length === 0) {
									rule.remove();
								}
							}
						});
					},
				};
			};
			removeThemeVarsPlugin.postcss = true;

			const result = postcss([removeThemeVarsPlugin()]).process(
				cssContent,
				{ from: undefined },
			);
			return result.css;
		} catch (e) {
			console.error(pc.red("Error processing CSS with PostCSS:"), e);
			return cssContent;
		}
	}

	generate(
		defaultBaseName,
		selectedBaseNames,
		defaultThemeName,
		selectedThemeNames,
	) {
		if (!fs.existsSync(this.cssPath)) {
			console.error(
				pc.red(`Error: CSS file not found at ${this.cssPath}`),
			);
			return;
		}

		let cssContent = fs.readFileSync(this.cssPath, "utf-8");

		// Resolve objects
		const defaultBase = this.baseColors.find(
			(b) => b.name === defaultBaseName,
		);
		const defaultTheme = this.themeColors.find(
			(t) => t.name === defaultThemeName,
		);

		if (!defaultBase) {
			console.error(pc.red(`Base '${defaultBaseName}' not found`));
			return;
		}
		if (!defaultTheme) {
			console.error(pc.red(`Theme '${defaultThemeName}' not found`));
			return;
		}

		const auxBases = this.baseColors.filter(
			(b) =>
				selectedBaseNames.includes(b.name) &&
				b.name !== defaultBaseName,
		);
		const auxThemes = this.themeColors.filter(
			(t) =>
				selectedThemeNames.includes(t.name) &&
				t.name !== defaultThemeName,
		);

		const { mainCss, auxCss } = this.generateBlocks(
			defaultBase,
			auxBases,
			defaultTheme,
			auxThemes,
		);

		// --- Update Main CSS (globals.css) ---

		// 1. Ensure Import
		if (!cssContent.includes('@import "./themes.css"')) {
			// Try to insert after other imports
			const lastImportIdx = cssContent.lastIndexOf("@import");
			if (lastImportIdx !== -1) {
				const endOfLine = cssContent.indexOf("\n", lastImportIdx);
				const before = cssContent.substring(0, endOfLine + 1);
				const after = cssContent.substring(endOfLine + 1);
				cssContent = before + `@import "./themes.css";\n` + after;
			} else {
				cssContent = `@import "./themes.css";\n` + cssContent;
			}
		}

		// 2. Remove Old Block
		const startIndex = cssContent.indexOf(MARKER_START);
		const endIndex = cssContent.indexOf(MARKER_END);

		if (startIndex !== -1 && endIndex !== -1) {
			const before = cssContent.substring(0, startIndex);
			const after = cssContent.substring(endIndex + MARKER_END.length);
			cssContent = before + after;
		}

		// 3. Clean Existing Variables
		console.log(
			pc.blue(`ℹ Cleaning up managed variables in :root and .dark...`),
		);
		cssContent = this.cleanExistingThemeVars(cssContent);

		// 4. Append New Block (Default Variables)
		// We insert it at the end, or where the old block was (but we just removed it)
		// Typically, Shadcn vars go after base styles. We'll append for safety if marker not found.
		// Actually, let's keep it simple: append the new mainCss block.

		console.log(pc.blue(`ℹ Writing default variables to globals.css...`));
		cssContent = cssContent.trim() + "\n\n" + mainCss;

		// Creating backup of globals.css
		try {
			fs.writeFileSync(
				`${this.cssPath}.bak`,
				fs.readFileSync(this.cssPath),
			);
		} catch (e) {}

		fs.writeFileSync(this.cssPath, cssContent);

		// --- Update Aux CSS (themes.css) ---

		console.log(pc.blue(`ℹ Writing auxiliary themes to themes.css...`));
		fs.writeFileSync(this.themesPath, auxCss);

		console.log(pc.green(`✔ Themes generated successfully!`));
	}
}

// --- Interaction Manager ---
class InteractionManager {
	static async promptSelection(allData) {
		// --- Base Color Selection ---
		const baseChoices = allData.base.map((t) => ({
			title: t.name,
			value: t.name,
		}));
		const defaultBaseRes = await prompts({
			type: "select",
			name: "defaultBase",
			message: "Select your DEFAULT BASE color (background/foreground):",
			choices: baseChoices,
			initial: 0,
		});
		if (!defaultBaseRes.defaultBase) return null;

		const remainingBaseChoices = baseChoices.filter(
			(c) => c.value !== defaultBaseRes.defaultBase,
		);
		let auxBases = [];
		if (remainingBaseChoices.length > 0) {
			const auxBaseRes = await prompts({
				type: "multiselect",
				name: "bases",
				message: "Select ADDITIONAL BASE colors (optional):",
				choices: remainingBaseChoices.map((c) => ({
					...c,
					selected: false,
				})),
				hint: "- Space to select. ⏎ Return to submit",
				instructions: false,
			});
			auxBases = auxBaseRes.bases || [];
		}

		// --- Theme Color Selection ---
		// Filter criteria:
		// 1. If a theme has same name as a SELECTED base (default or aux) -> Keep it & Label "(match base color)"
		// 2. If a theme has same name as an UNSELECTED base -> Remove it
		// 3. Otherwise -> Keep it

		const allBaseNames = allData.base.map((b) => b.name);
		const selectedBaseNames = [
			defaultBaseRes.defaultBase,
			...(auxBases || []),
		];

		const themeChoices = allData.theme
			.filter((t) => {
				const isBaseName = allBaseNames.includes(t.name);
				if (isBaseName) {
					// Only keep if it's one of the selected bases
					return selectedBaseNames.includes(t.name);
				}
				return true;
			})
			.map((t) => {
				const isMatchingBase = selectedBaseNames.includes(t.name);
				return {
					title: isMatchingBase
						? `${t.name} (match base color)`
						: t.name,
					value: t.name,
				};
			});

		const defaultThemeRes = await prompts({
			type: "select",
			name: "defaultTheme",
			message: "Select your DEFAULT THEME color (primary):",
			choices: themeChoices,
			initial: 0,
		});
		if (!defaultThemeRes.defaultTheme) return null;

		const remainingThemeChoices = themeChoices.filter(
			(c) => c.value !== defaultThemeRes.defaultTheme,
		);
		let auxThemes = [];
		if (remainingThemeChoices.length > 0) {
			const auxThemeRes = await prompts({
				type: "multiselect",
				name: "themes",
				message: "Select ADDITIONAL THEME colors (optional):",
				choices: remainingThemeChoices.map((c) => ({
					...c,
					selected: false,
				})),
				hint: "- Space to select. ⏎ Return to submit",
				instructions: false,
			});
			auxThemes = auxThemeRes.themes || [];
		}

		return {
			defaultBase: defaultBaseRes.defaultBase,
			auxBases,
			defaultTheme: defaultThemeRes.defaultTheme,
			auxThemes,
		};
	}
}

// --- Themes TS Manager ---
class ThemesTsManager {
	constructor(themesPath) {
		this.themesPath = themesPath;
	}

	extractVariable(cssContent, varName) {
		let value;
		try {
			const root = postcss.parse(cssContent);
			root.walkDecls((decl) => {
				if (decl.prop === varName) {
					value = decl.value;
				}
			});
		} catch (e) {
			console.error(`Error parsing CSS for ${varName}:`, e);
		}
		return value;
	}

	generateTsContent(
		allData,
		defaultBaseName,
		auxBaseNames,
		defaultThemeName,
		auxThemeNames,
	) {
		const selectedBaseNames = [defaultBaseName, ...auxBaseNames];
		const selectedThemeNames = [defaultThemeName, ...auxThemeNames];

		// Process Bases
		const availableBasesStruct = allData.base.map((b) => {
			return {
				name: b.name,
				color: this.extractVariable(b.css.light, "--ring"),
				darkColor: this.extractVariable(b.css.dark, "--ring"),
			};
		});
		const selectedBasesStruct = availableBasesStruct.filter((b) =>
			selectedBaseNames.includes(b.name),
		);
		const defaultBaseStruct = availableBasesStruct.find(
			(b) => b.name === defaultBaseName,
		);

		// Process Themes
		const availableThemesStruct = allData.theme.map((t) => ({
			name: t.name,
			color: this.extractVariable(t.css.light, "--primary"),
			darkColor: this.extractVariable(t.css.dark, "--primary"),
		}));
		const selectedThemesStruct = availableThemesStruct.filter((t) =>
			selectedThemeNames.includes(t.name),
		);
		const defaultThemeStruct = availableThemesStruct.find(
			(t) => t.name === defaultThemeName,
		);

		return `
export const BASE_COLORS = ${JSON.stringify(selectedBasesStruct, null, 4)} as const;
export const SUPPORTED_BASE_COLORS = BASE_COLORS.map((t) => t.name);
export type BaseColor = (typeof SUPPORTED_BASE_COLORS)[number];
export const DEFAULT_BASE_COLOR: BaseColor = "${defaultBaseName}";
export const DEFAULT_BASE_VAR = ${JSON.stringify({ color: defaultBaseStruct.color, darkColor: defaultBaseStruct.darkColor })};

export const THEMES = ${JSON.stringify(selectedThemesStruct, null, 4)} as const;
export const SUPPORTED_THEMES = THEMES.map((theme) => theme.name);
export type ColorTheme = (typeof SUPPORTED_THEMES)[number];
export const DEFAULT_THEME: ColorTheme = "${defaultThemeName}";
export const DEFAULT_THEME_COLOR = ${JSON.stringify({ color: defaultThemeStruct.color, darkColor: defaultThemeStruct.darkColor })};
`;
	}

	update(
		allData,
		defaultBaseName,
		auxBaseNames,
		defaultThemeName,
		auxThemeNames,
	) {
		const tsContent = this.generateTsContent(
			allData,
			defaultBaseName,
			auxBaseNames,
			defaultThemeName,
			auxThemeNames,
		);
		const MARKER_START = "// @shadcn-dynamic-theme-start";
		const MARKER_END = "// @shadcn-dynamic-theme-end";

		let content = "";
		if (fs.existsSync(this.themesPath)) {
			content = fs.readFileSync(this.themesPath, "utf-8");
		} else {
			content = `${MARKER_START}\n${MARKER_END}\n`;
		}

		console.log(pc.blue(`ℹ Updating lib/themes.ts...`));

		const regex = new RegExp(`${MARKER_START}[\\s\\S]*?${MARKER_END}`, "m");
		const newBlock = `${MARKER_START}\n${tsContent}\n${MARKER_END}`;

		if (regex.test(content)) {
			content = content.replace(regex, newBlock);
		} else {
			content += `\n${newBlock}`;
		}

		fs.writeFileSync(this.themesPath, content, "utf-8");
		console.log(pc.green(`✔ lib/themes.ts updated successfully!`));
	}
}

// --- Main ---
async function main() {
	const program = new Command();
	const allData = ConfigManager.loadThemes();
	const projectConfig = ConfigManager.findProjectConfig();

	if (!projectConfig) {
		console.error(pc.red("Error: Could not find components.json."));
		process.exit(1);
	}

	const allBaseNames = allData.base.map((b) => b.name).join(", ");
	const allThemeNames = allData.theme.map((t) => t.name).join(", ");

	program
		.name("generate-themes")
		.description(
			`Generates CSS variables for Shadcn Dynamic Themes.\n\nAvailable Base Colors: ${allBaseNames}\nAvailable Themes: ${allThemeNames}`,
		)
		.option("--default-base <name>", "Default base color")
		.option("--bases <names>", "Comma-separated additional base colors")
		.option("--default-theme <name>", "Default theme color")
		.option("--themes <names>", "Comma-separated additional theme colors")
		.option("--all", "Generate all available bases and themes")
		.action(async (options) => {
			let selection;

			if (options.all) {
				const allBaseNames = allData.base.map((b) => b.name);
				const allThemeNames = allData.theme.map((t) => t.name);

				// Defaults if not specified, otherwise 'zinc'/'blue'
				const defaultBase = options.defaultBase || "zinc";
				const defaultTheme = options.defaultTheme || "zinc";

				selection = {
					defaultBase,
					auxBases: allBaseNames,
					defaultTheme,
					auxThemes: allThemeNames,
				};
				// Log moved to the end
			} else if (options.defaultBase && options.defaultTheme) {
				// CLI Mode
				const auxBases = options.bases
					? options.bases.split(",").map((s) => s.trim())
					: [];
				const auxThemes = options.themes
					? options.themes.split(",").map((s) => s.trim())
					: [];

				// Basic validation could be added here (e.g., check if names exist in allData)
				selection = {
					defaultBase: options.defaultBase,
					auxBases: auxBases,
					defaultTheme: options.defaultTheme,
					auxThemes: auxThemes,
				};
			} else {
				// Interactive Mode
				console.log(pc.cyan(`\nShadcn Dynamic Theme Generator\n`));
				selection = await InteractionManager.promptSelection(allData);
			}

			if (!selection) {
				console.log(pc.yellow("Cancelled."));
				process.exit(0);
			}

			const defaultBaseName = selection.defaultBase;
			const auxBaseNames = selection.auxBases || [];
			const defaultThemeName = selection.defaultTheme;
			const auxThemeNames = selection.auxThemes || [];

			// Ensure selection object is updated for downstream usages
			selection.auxBases = auxBaseNames;
			selection.auxThemes = auxThemeNames;

			// Validation
			const validThemeNames = allData.theme.map((t) => t.name);
			const validBaseNames = allData.base.map((b) => b.name);
			if (!validThemeNames.includes(defaultThemeName)) {
				console.error(
					pc.red(
						`Error: Invalid default theme '${defaultThemeName}'. Available: ${validThemeNames.join(", ")}`,
					),
				);
				process.exit(1);
			}

			if (!validBaseNames.includes(defaultBaseName)) {
				console.error(
					pc.red(
						`Error: Invalid default base '${defaultBaseName}'. Available: ${validBaseNames.join(", ")}`,
					),
				);
				process.exit(1);
			}
			const invalidThemeNames = auxThemeNames.filter(
				(name) => !validThemeNames.includes(name),
			);
			const invalidBaseNames = auxBaseNames.filter(
				(name) => !validBaseNames.includes(name),
			);

			if (invalidThemeNames.length > 0) {
				console.error(
					pc.red(
						`Error: Invalid themes specified: ${invalidThemeNames.join(", ")}`,
					),
				);
				process.exit(1);
			}

			if (invalidBaseNames.length > 0) {
				console.error(
					pc.red(
						`Error: Invalid bases specified: ${invalidBaseNames.join(", ")}`,
					),
				);
				process.exit(1);
			}

			// 1. Update CSS
			const generator = new ThemeGenerator(
				allData,
				projectConfig.cssPath,
			);
			generator.generate(
				selection.defaultBase,
				selection.auxBases,
				selection.defaultTheme,
				selection.auxThemes,
			);

			const themesTsPath = path.resolve("lib/themes.ts");
			const tsManager = new ThemesTsManager(themesTsPath);
			tsManager.update(
				allData,
				selection.defaultBase,
				selection.auxBases,
				selection.defaultTheme,
				selection.auxThemes,
			);

			if (options.all) {
				console.log(
					pc.white(
						"ℹ You can modify default base color and color theme in",
					),
					pc.underline(pc.cyan("lib/themes.ts")),
				);
			}
		});

	program.parse();
}

main().catch((err) => {
	console.error(pc.red("Unexpected error:"), err);
	process.exit(1);
});
