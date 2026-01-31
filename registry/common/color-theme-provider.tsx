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
    baseColor: string
    setBaseColor: (base: string) => void
    colorThemes: readonly ThemeColors[]
    baseColors: readonly ThemeColors[]
    mounted: boolean
}

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(undefined)

export function ColorThemeProvider({
    colorThemes,
    baseColors,
    children,
    defaultColor,
    defaultBaseColor,
    ...props
}: {
    colorThemes: readonly ThemeColors[]
    baseColors: readonly ThemeColors[]
    children: React.ReactNode
    defaultColor: string
    defaultBaseColor: string
} & React.ComponentProps<typeof NextThemesProvider>) {
    const [colorTheme, setColorTheme] = useState<string>(defaultColor)
    const [baseColor, setBaseColor] = useState<string>(defaultBaseColor)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const savedTheme = localStorage.getItem("color-theme")
        const savedBase = localStorage.getItem("base-color")
        if (savedTheme && colorThemes.some(t => t.name === savedTheme)) {
            setColorTheme(savedTheme)
        }
        if (savedBase && baseColors.some(b => b.name === savedBase)) {
            setBaseColor(savedBase)
        }
    }, [colorThemes, baseColors])

    useEffect(() => {
        const root = document.documentElement
        root.classList.add(`theme-${colorTheme}`)
        localStorage.setItem("color-theme", colorTheme)

        return () => {
            root.classList.remove(`theme-${colorTheme}`)
        }
    }, [colorTheme])

    useEffect(() => {
        const root = document.documentElement
        root.classList.add(`base-${baseColor}`)
        localStorage.setItem("base-color", baseColor)

        return () => {
            root.classList.remove(`base-${baseColor}`)
        }
    }, [baseColor])

    return (
        <ColorThemeContext.Provider value={{
            colorTheme,
            setColorTheme,
            baseColor,
            setBaseColor,
            colorThemes,
            baseColors,
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
