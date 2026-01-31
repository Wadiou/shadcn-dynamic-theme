"use client"

import { SUPPORTED_THEMES, SUPPORTED_BASE_COLORS, DEFAULT_THEME, DEFAULT_BASE_COLOR } from "@/lib/themes"

export function ThemeScript() {
    return (
        <script
            dangerouslySetInnerHTML={{
                __html: `
          (function() {
            try {
              var theme = localStorage.getItem("color-theme");
              var base = localStorage.getItem("base-color");
              var supportThemes = ${JSON.stringify(SUPPORTED_THEMES)};
              var supportBases = ${JSON.stringify(SUPPORTED_BASE_COLORS)};
              var defaultTheme ="${DEFAULT_THEME}";
              var defaultBase = "${DEFAULT_BASE_COLOR}";

              // Validate/Fallback Base
              if (!base || !supportBases.includes(base)) {
                  base = defaultBase;
              }

              // Validate/Fallback Theme
              if (!theme || !supportThemes.includes(theme)) {
                  theme = defaultTheme;
              }

              // Specific Validation: If theme matches a base name, it must equal the current base
              if (supportBases.includes(theme) && theme !== base) {
                  theme = base;
                  localStorage.setItem("color-theme", theme);
              }

              document.documentElement.classList.add("theme-" + theme);
              document.documentElement.classList.add("base-" + base);
            } catch (e) {}
          })()
        `,
            }}
        />
    )
}
