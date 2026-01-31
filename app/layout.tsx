import "./globals.css";
import { ColorThemeProvider } from "@/components/color-theme-provider";
import { ThemeScript } from "@/components/theme-script";
import { THEMES, DEFAULT_THEME, BASE_COLORS, DEFAULT_BASE_COLOR } from "@/lib/themes";
import { DevTools } from "@/components/dev-tools";

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
                    <DevTools />
                </ColorThemeProvider>
            </body>
        </html>
    );
}