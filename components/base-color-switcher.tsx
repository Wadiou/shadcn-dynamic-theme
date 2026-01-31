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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useColorTheme } from "./color-theme-provider"

export const BaseColorSwitcher = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
    const { baseColor, setBaseColor, baseColors, mounted, colorTheme, setColorTheme } = useColorTheme()
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

    return (
        <div className={cn("cursor-pointer", className)} ref={ref} {...props}>
            <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="outline" className="w-35 justify-between" />}><div className="flex items-center gap-2">
                    <div
                        className={cn("size-4 rounded-full")}
                        style={{
                            backgroundColor:
                                baseColors.find((t) => t.name === baseColor)?.[themeKey] ??
                                baseColors.find((t) => t.name === baseColor)?.color,
                        }}
                    />
                    <span className="capitalize">{baseColor}</span>
                </div><ChevronsUpDown className="ml-2 size-4 opacity-50" /></DropdownMenuTrigger>
                <DropdownMenuContent className="w-35">
                    {baseColors.map((theme) => (
                        <DropdownMenuItem
                            key={theme.name}
                            onClick={() => {
                                if (colorTheme === baseColor) {
                                    setColorTheme(theme.name)
                                }
                                setBaseColor(theme.name)
                            }}
                            className="gap-2"
                        >
                            <div
                                className={cn("size-4 rounded-full")}
                                style={{ backgroundColor: theme[themeKey] }}
                            />
                            <span className="capitalize">{theme.name}</span>
                            {baseColor === theme.name && (
                                <Check className="ml-auto size-4" />
                            )}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
})
BaseColorSwitcher.displayName = "BaseColorSwitcher"
