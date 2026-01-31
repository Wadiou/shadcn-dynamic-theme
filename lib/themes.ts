
// @shadcn-dynamic-theme-start

export const BASE_COLORS = [
    {
        "name": "gray",
        "color": "oklch(0.707 0.022 261.325)",
        "darkColor": "oklch(0.551 0.027 264.364)"
    },
    {
        "name": "neutral",
        "color": "oklch(0.708 0 0)",
        "darkColor": "oklch(0.556 0 0)"
    },
    {
        "name": "stone",
        "color": "oklch(0.709 0.01 56.259)",
        "darkColor": "oklch(0.553 0.013 58.071)"
    },
    {
        "name": "zinc",
        "color": "oklch(0.705 0.015 286.067)",
        "darkColor": "oklch(0.552 0.016 285.938)"
    }
] as const;
export const SUPPORTED_BASE_COLORS = BASE_COLORS.map((t) => t.name);
export type BaseColor = (typeof SUPPORTED_BASE_COLORS)[number];
export const DEFAULT_BASE_COLOR: BaseColor = "gray";
export const DEFAULT_BASE_VAR = {"color":"oklch(0.707 0.022 261.325)","darkColor":"oklch(0.551 0.027 264.364)"};

export const THEMES = [
    {
        "name": "amber",
        "color": "oklch(0.67 0.16 58)",
        "darkColor": "oklch(0.77 0.16 70)"
    },
    {
        "name": "blue",
        "color": "oklch(0.488 0.243 264.376)",
        "darkColor": "oklch(0.42 0.18 266)"
    },
    {
        "name": "cyan",
        "color": "oklch(0.61 0.11 222)",
        "darkColor": "oklch(0.71 0.13 215)"
    },
    {
        "name": "emerald",
        "color": "oklch(0.60 0.13 163)",
        "darkColor": "oklch(0.70 0.15 162)"
    },
    {
        "name": "fuchsia",
        "color": "oklch(0.59 0.26 323)",
        "darkColor": "oklch(0.67 0.26 322)"
    },
    {
        "name": "green",
        "color": "oklch(0.648 0.2 131.684)",
        "darkColor": "oklch(0.648 0.2 131.684)"
    },
    {
        "name": "indigo",
        "color": "oklch(0.51 0.23 277)",
        "darkColor": "oklch(0.59 0.20 277)"
    },
    {
        "name": "lime",
        "color": "oklch(0.65 0.18 132)",
        "darkColor": "oklch(0.77 0.20 131)"
    },
    {
        "name": "orange",
        "color": "oklch(0.646 0.222 41.116)",
        "darkColor": "oklch(0.705 0.213 47.604)"
    },
    {
        "name": "pink",
        "color": "oklch(0.59 0.22 1)",
        "darkColor": "oklch(0.66 0.21 354)"
    },
    {
        "name": "gray",
        "color": "oklch(0.21 0.034 264.665)",
        "darkColor": "oklch(0.928 0.006 264.531)"
    },
    {
        "name": "neutral",
        "color": "oklch(0.205 0 0)",
        "darkColor": "oklch(0.87 0.00 0)"
    },
    {
        "name": "stone",
        "color": "oklch(0.216 0.006 56.043)",
        "darkColor": "oklch(0.923 0.003 48.717)"
    },
    {
        "name": "zinc",
        "color": "oklch(0.21 0.006 285.885)",
        "darkColor": "oklch(0.92 0.004 286.32)"
    }
] as const;
export const SUPPORTED_THEMES = THEMES.map((theme) => theme.name);
export type ColorTheme = (typeof SUPPORTED_THEMES)[number];
export const DEFAULT_THEME: ColorTheme = "cyan";
export const DEFAULT_THEME_COLOR = {"color":"oklch(0.61 0.11 222)","darkColor":"oklch(0.71 0.13 215)"};

// @shadcn-dynamic-theme-end