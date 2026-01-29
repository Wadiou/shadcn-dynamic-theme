"use client"

import * as React from "react"
import { CheckIcon, CaretSortIcon } from "@radix-ui/react-icons"
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

export const ColorSwitcher = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
    const { colorTheme, setColorTheme, colorThemes, mounted } = useColorTheme()
    const { resolvedTheme } = useTheme()
    const themeKey = resolvedTheme === 'dark' ? 'darkColor' : 'color'

    if (!mounted) {
        return (
            <div className={className} ref={ref} {...props}>
                <Button variant="outline" className="w-[140px] justify-between cursor-not-allowed">
                    <div className="flex items-center gap-2">
                        <div className="size-4 rounded-full border bg-muted" />
                        <span className="capitalize">Theme</span>
                    </div>
                    <CaretSortIcon className="ml-2 size-4 opacity-50" />
                </Button>
            </div>
        )
    }

    return (
        <div className={cn("cursor-pointer", className)} ref={ref} {...props}>
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={<Button variant="outline" className="w-[140px] justify-between" />}
                >
                    <div className="flex items-center gap-2">
                        <div
                            className={cn("size-4 rounded-full")}
                            style={{
                                backgroundColor:
                                    colorThemes.find((t) => t.name === colorTheme)?.[themeKey] ??
                                    colorThemes.find((t) => t.name === colorTheme)?.color,
                            }}
                        />
                        <span className="capitalize">{colorTheme}</span>
                    </div>
                    <CaretSortIcon className="ml-2 size-4 opacity-50" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[140px]">
                    {colorThemes.map((theme) => (
                        <DropdownMenuItem
                            key={theme.name}
                            onClick={() => {
                                setColorTheme(theme.name)
                            }}
                            className="gap-2"
                        >
                            <div
                                className={cn("size-4 rounded-full")}
                                style={{ backgroundColor: theme[themeKey] }}
                            />
                            <span className="capitalize">{theme.name}</span>
                            {colorTheme === theme.name && (
                                <CheckIcon className="ml-auto size-4" />
                            )}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
})
ColorSwitcher.displayName = "ColorSwitcher"

