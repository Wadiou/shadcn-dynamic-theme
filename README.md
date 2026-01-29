# Shadcn Dynamic Theme Switcher

A dynamic theme and color switcher for [shadcn/ui](https://ui.shadcn.com), built with `next-themes` and CSS variables.

## Features

- **Dynamic Color Switching**: Change your app's primary color (and chart/sidebar colors) at runtime.
- **Configurable**: Pass your own list of themes.
- **Dark Mode Support**: Seamless integration with `next-themes`.
- **No Hardcoded Bundles**: You control the CSS and the theme definitions.

## Prerequisites

This component assumes you have a **Shadcn UI** project already set up (specifically with `components.json` and a global CSS file).

## Installation

Run the following command to add the component and its dependencies to your project:

```bash
npx shadcn@latest add https://shadcn-dynamic-theme.vercel.app/r/color-switcher.json
# or
pnpm dlx shadcn@latest add https://shadcn-dynamic-theme.vercel.app/r/color-switcher.json
# or
bunx shadcn@latest add https://shadcn-dynamic-theme.vercel.app/r/color-switcher.json
# or
yarn dlx shadcn@latest add https://shadcn-dynamic-theme.vercel.app/r/color-switcher.json
```

This will:

- Install required dependencies.
- Add `color-switcher.tsx` and `color-theme-provider.tsx` to your components.
- Add `theme-script.tsx` to your components.
- Add generators (`generate-themes.js` and `themes.json`) to your scripts.

## Setup & Configuration

Once installed, **you do not need to manually edit your CSS**. We provide a script to handle it for you.

### 1. Generate Themes

The installer adds a `generate-themes.js` script to your `scripts/` folder. This script reads `scripts/themes.json` and updates your `globals.css` (or equivalent) with the correct CSS variables.

Run it interactively:

```bash
node scripts/generate-themes.js
# or if executable (chmod +x scripts/generate-themes.js)
./scripts/generate-themes.js
```

### 2. Advanced Usage (CLI Flags)

The script supports flags, which is useful for automation or for AI agents.

```bash
# See all options
node scripts/generate-themes.js --help

# Set default theme to 'blue' and generate only specific auxiliary themes
node scripts/generate-themes.js --default=blue --themes=orange,green
```

### 3. Add the Provider

Wrap your application in the `ColorThemeProvider`.

```tsx
import "./globals.css";
import { ColorThemeProvider } from "@/components/color-theme-provider";
import { ThemeScript } from "@/components/theme-script";
import { THEMES, DEFAULT_THEME } from "@/lib/themes";

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
				>
					{children}
				</ColorThemeProvider>
			</body>
		</html>
	);
}
```

### 4. Use the Component

Place the `ColorSwitcher` anywhere in your UI.

```tsx
import { ColorSwitcher } from "@/components/color-switcher";

export default function Header() {
	return <ColorSwitcher />;
}
```

## Development

If you are contributing to this project, here is how to set up your environment.

### Testing Locally

You can run the registry server locally to test your changes in another project.

1.  **Build the Registry**:

    ```bash
    npm run registry:build
    # or
    npm run build
    ```

    This generates the registry files in `public/r`.

2.  **Start the Local Server**:
    Serve the `public` directory:

    ```bash
    cd public
    python3 -m http.server 8080
    ```

    Your registry will be available at `http://localhost:8080`.

3.  **Test in a Target Project**:
    In your target project (e.g., a fresh Next.js app), run:
    ```bash
    npx shadcn@latest add http://localhost:8080/r/color-switcher.json
    ```
