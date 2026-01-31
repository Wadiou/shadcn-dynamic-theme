# Shadcn Dynamic Theme Switcher

A dynamic theme and color switcher for [shadcn/ui](https://ui.shadcn.com), built with `next-themes` and CSS variables.

> **Check out the component in the website:** [shadcn-dynamic-theme.vercel.app](https://shadcn-dynamic-theme.vercel.app)

## Features

- **Dynamic Color Switching**: Change your app's primary color (and chart/sidebar colors) at runtime.
- **Configurable**: Pass your own list of themes.
- **Dark Mode Support**: Seamless integration with `next-themes`.
- **No Hardcoded Bundles**: You control the CSS and the theme definitions.
- **Framework Agnostic**: Fully compatible with Next.js (TanStack Start) and Vite.

## Prerequisites

This component assumes you have a **Shadcn UI** project already set up (specifically with `components.json` and a global CSS file).

## Installation

Run the following command to add the component and its dependencies to your project.

### Default Installation (Base UI)

Use this if you are using the **Base UI** version of this project (using `render` props).

```bash
npx shadcn@latest add https://shadcn-dynamic-theme.vercel.app/color-switcher.json
# or
pnpm dlx shadcn@latest add https://shadcn-dynamic-theme.vercel.app/color-switcher.json
# or
bunx shadcn@latest add https://shadcn-dynamic-theme.vercel.app/color-switcher.json
# or
yarn dlx shadcn@latest add https://shadcn-dynamic-theme.vercel.app/color-switcher.json
```

### Classic Installation (Radix UI / Standard Shadcn)

Use this if you are using the **Standard Shadcn UI** (Radix UI).

```bash
npx shadcn@latest add https://shadcn-dynamic-theme.vercel.app/color-switcher-classic.json
# or
pnpm dlx shadcn@latest add https://shadcn-dynamic-theme.vercel.app/color-switcher-classic.json
# or
bunx shadcn@latest add https://shadcn-dynamic-theme.vercel.app/color-switcher-classic.json
# or
yarn dlx shadcn@latest add https://shadcn-dynamic-theme.vercel.app/color-switcher-classic.json
```

This will:

- Install required dependencies.
- Add `base-color-switcher.tsx`, `theme-color-switcher.tsx`, `color-theme-provider.tsx` and `theme-script.tsx` to your components.
- Add generators (`generate-themes.js` and `themes.json`) to your scripts.

## Setup & Configuration

Once installed, **you do not need to manually edit your CSS**. We provide a script to handle it for you.

### 1. Generate Themes

The installer adds a `generate-themes.js` script to your `scripts/` folder. This script reads `scripts/themes.json` and updates your `globals.css` (or equivalent) with the correct CSS variables.

Run it interactively:

```bash
node scripts/generate-themes.js
# or
bun scripts/generate-themes.js
```

### 2. Advanced Usage (CLI Flags)

The script supports flags, which is useful for automation or for AI agents.

```bash
# See all options
node scripts/generate-themes.js --help

# Generate all themes and bases
node scripts/generate-themes.js --all

# Generate all themes and bases with default theme 'blue' and default base 'zinc'
node scripts/generate-themes.js --all --default-theme=cyan --default-base=gray

# Set default theme to 'blue' and generate specific themes
node scripts/generate-themes.js --default-theme=blue --themes=orange,green --default-base=zinc --bases=slate
```

### 3. Add the Provider

Wrap your application in the `ColorThemeProvider`.

```tsx
import "./globals.css";
import { ColorThemeProvider } from "@/components/color-theme-provider";
import { ThemeScript } from "@/components/theme-script";
import {
	THEMES,
	DEFAULT_THEME,
	BASE_COLORS,
	DEFAULT_BASE_COLOR,
} from "@/lib/themes";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<ThemeScript />
			</head>
			<body>
				<ColorThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					colorThemes={THEMES}
					defaultColor={DEFAULT_THEME}
					baseColors={BASE_COLORS}
					defaultBaseColor={DEFAULT_BASE_COLOR}
				>
					{children}
				</ColorThemeProvider>
			</body>
		</html>
	);
}
```

### 4. Use the Component

Place the `ThemeColorSwitcher` and `BaseColorSwitcher` anywhere in your UI.

```tsx
import { ThemeColorSwitcher } from "@/components/theme-color-switcher";
import { BaseColorSwitcher } from "@/components/base-color-switcher";

export default function Header() {
	return (
		<div className="flex gap-2">
			<ThemeColorSwitcher />
			<BaseColorSwitcher />
		</div>
	);
}
```

## Development

If you are contributing to this project, here is how to set up your environment.

### Testing Locally

You can run the registry server locally to test your changes in another project.

1.  **Build and Serve the Registry**:

    This command builds the registry and starts a local Python HTTP server on port 8080.
    **Note:** You must have `python3` installed.

    ```bash
    npm run build:local
    # or
    bun run build:local
    ```

    Your registry will be available at `http://localhost:8080`.

2.  **Test in a Target Project**:

    In your target project (e.g., a fresh Next.js app), run:

    ```bash
    # For Base UI Style
    npx shadcn@latest add http://localhost:8080/color-switcher.json

    # For Radix UI Style
    npx shadcn@latest add http://localhost:8080/color-switcher-classic.json
    ```
