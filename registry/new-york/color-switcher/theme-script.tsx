"use client"

import { SUPPORTED_THEMES } from "@/lib/themes"

export function ThemeScript() {
    return (
        <script
            dangerouslySetInnerHTML={{
                __html: `
          (function() {
            try {
              var theme = localStorage.getItem("color-theme");
              var supportThemes = ${JSON.stringify(SUPPORTED_THEMES)};
              if (theme && supportThemes.includes(theme)) {
                  document.documentElement.classList.add("theme-" + theme);
              } else {
                  document.documentElement.classList.add("theme-blue");
              }
            } catch (e) {}
          })()
        `,
            }}
        />
    )
}
