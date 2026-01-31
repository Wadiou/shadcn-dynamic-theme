"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useColorTheme } from "./color-theme-provider"

export const ThemeColorSwitcher = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
    const { colorTheme, setColorTheme, colorThemes, baseColor, baseColors, mounted } = useColorTheme()
    const { resolvedTheme } = useTheme()
    const themeKey = resolvedTheme === 'dark' ? 'darkColor' : 'color'

    if (!mounted) {
        return (
            <div className={className} ref={ref} {...props}>
                <Button variant="outline" className="w-35 justify-between cursor-not-allowed">
                    <div className="flex items-center gap-2">
                        <div className="size-4 rounded-full border bg-muted" />
                        <span className="capitalize">Theme</span>
                    </div>
                    <ChevronsUpDown className="ml-2 size-4 opacity-50" />
                </Button>
            </div>
        )
    }

    // Filter themes:
    // 1. Keep if it DOES NOT match any base color name.
    // 2. OR if it matches the CURRENT ACTIVE base color.
    const filteredThemes = colorThemes.filter(theme => {
        const isBaseColor = baseColors.some(base => base.name === theme.name);
        if (!isBaseColor) return true;
        return theme.name === baseColor;
    }).sort((a, b) => {
        if (a.name === baseColor) return -1;
        if (b.name === baseColor) return 1;
        return 0;
    });

    return (
        <div className={cn("cursor-pointer", className)} ref={ref} {...props}>
            <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="outline" className="w-35 justify-between" />}><div className="flex items-center gap-2">
                    <div
                        className={cn("size-4 rounded-full")}
                        style={{
                            backgroundColor:
                                colorThemes.find((t) => t.name === colorTheme)?.[themeKey] ??
                                colorThemes.find((t) => t.name === colorTheme)?.color,
                        }}
                    />
                    <span className="capitalize">{colorTheme}</span>
                </div><ChevronsUpDown className="ml-2 size-4 opacity-50" /></DropdownMenuTrigger>
                <DropdownMenuContent className="w-50 max-h-125 overflow-y-auto">
                    {filteredThemes.map((theme) => {
                        const isMatchBase = theme.name === baseColor;
                        return (
                            <React.Fragment key={theme.name}>
                                <DropdownMenuItem
                                    onClick={() => {
                                        setColorTheme(theme.name)
                                    }}
                                    className="flex justify-between items-center"
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={cn("size-4 rounded-full")}
                                            style={{ backgroundColor: theme[themeKey] }}
                                        />
                                        <div className="flex flex-col">
                                            <span className="capitalize">{theme.name}</span>
                                            {isMatchBase && (
                                                <span className="text-[10px] text-muted-foreground leading-none">Match base color</span>
                                            )}
                                        </div>
                                    </div>
                                    {colorTheme === theme.name && (
                                        <Check className="size-4" />
                                    )}
                                </DropdownMenuItem>
                                {isMatchBase && <DropdownMenuSeparator />}
                            </React.Fragment>
                        )
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
})
ThemeColorSwitcher.displayName = "ThemeColorSwitcher"
