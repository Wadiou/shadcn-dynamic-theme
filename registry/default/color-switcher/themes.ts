// @shadcn-dynamic-theme-start
export const AVAILABLE_THEMES = [
    { name: 'blue', color: 'oklch(0.488 0.243 264.376)', darkColor: 'oklch(0.488 0.243 264.376)' },
    { name: 'green', color: 'oklch(0.648 0.2 131.684)', darkColor: 'oklch(0.648 0.2 131.684)' },
    { name: 'orange', color: 'oklch(0.646 0.222 41.116)', darkColor: 'oklch(0.705 0.213 47.604)' },
    { name: 'red', color: 'oklch(0.577 0.245 27.325)', darkColor: 'oklch(0.637 0.237 25.331)' },
    { name: 'rose', color: 'oklch(0.586 0.253 17.585)', darkColor: 'oklch(0.645 0.246 16.439)' },
    { name: 'violet', color: 'oklch(0.541 0.281 293.009)', darkColor: 'oklch(0.606 0.25 292.717)' },
    { name: 'yellow', color: 'oklch(0.852 0.199 91.936)', darkColor: 'oklch(0.795 0.184 86.047)' },
    { name: 'neutral', color: 'oklch(0.205 0 0)', darkColor: 'oklch(0.922 0 0)' },
    { name: 'stone', color: 'oklch(0.216 0.006 56.043)', darkColor: 'oklch(0.923 0.003 48.717)' },
    { name: 'zinc', color: 'oklch(0.21 0.006 285.885)', darkColor: 'oklch(0.92 0.004 286.32)' },
    { name: 'gray', color: 'oklch(0.21 0.034 264.665)', darkColor: 'oklch(0.928 0.006 264.531)' },
    { name: 'slate', color: 'oklch(0.208 0.042 265.755)', darkColor: 'oklch(0.929 0.013 255.508)' },
] as const;

export const THEMES = AVAILABLE_THEMES;

export const SUPPORTED_THEMES = THEMES.map((theme) => theme.name);
export type ColorTheme = (typeof SUPPORTED_THEMES)[number];

export const DEFAULT_THEME: ColorTheme = THEMES[0].name;
export const DEFAULT_THEME_COLOR = { color: THEMES[0].color, darkColor: THEMES[0].darkColor };
// @shadcn-dynamic-theme-end
