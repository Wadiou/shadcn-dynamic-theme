"use client"

import * as React from "react"
import { useEffect, useState, createContext, useContext } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export type ThemeColors = {
    readonly name: string
    readonly color: string
    readonly darkColor: string
}

type ColorThemeContextType = {
    colorTheme: string
    setColorTheme: (theme: string) => void
    colorThemes: readonly ThemeColors[]
    mounted: boolean
}

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(undefined)

export function ColorThemeProvider({
    colorThemes,
    children,
    defaultColor,
    ...props
}: {
    colorThemes: readonly ThemeColors[]
    children: React.ReactNode
    defaultColor: string
} & React.ComponentProps<typeof NextThemesProvider>) {
    const initialTheme = defaultColor;
    const [colorTheme, setColorTheme] = useState<string>(initialTheme)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const savedTheme = localStorage.getItem("color-theme")
        if (savedTheme && colorThemes.some(t => t.name === savedTheme)) {
            setColorTheme(savedTheme)
        }
    }, [colorThemes])

    useEffect(() => {
        if (!mounted) return

        const root = document.documentElement
        colorThemes.forEach(t => root.classList.remove(`theme-${t.name}`))
        root.classList.add(`theme-${colorTheme}`)
        localStorage.setItem("color-theme", colorTheme)
    }, [colorTheme, mounted, colorThemes])

    return (
        <ColorThemeContext.Provider value={{
            colorTheme,
            setColorTheme,
            colorThemes,
            mounted
        }}>
            <NextThemesProvider {...props}>{children}</NextThemesProvider>
        </ColorThemeContext.Provider>
    )
}

export const useColorTheme = () => {
    const context = useContext(ColorThemeContext)
    if (context === undefined) {
        throw new Error("useColorTheme must be used within a ColorThemeProvider")
    }
    return context
}
