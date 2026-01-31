"use client"

import { useEffect, useState } from "react"
import { BaseColorSwitcher } from "@/components/base-color-switcher"
import { ThemeColorSwitcher } from "@/components/theme-color-switcher"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Settings2, RotateCcw } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useColorTheme } from "@/components/color-theme-provider"
import { useTheme } from "next-themes"
import { DEFAULT_BASE_COLOR, DEFAULT_THEME } from "@/lib/themes"

export function DevTools() {
    const [mounted, setMounted] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [showIndicator, setShowIndicator] = useState(false)
    const { setColorTheme, setBaseColor } = useColorTheme()
    const { setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
        const hasSeenIndicator = sessionStorage.getItem("dev-tools-indicator-seen")
        if (!hasSeenIndicator) {
            setShowIndicator(true)
        }
    }, [])

    const handleToggle = () => {
        setIsOpen(!isOpen)
        if (showIndicator) {
            setShowIndicator(false)
            sessionStorage.setItem("dev-tools-indicator-seen", "true")
        }
    }

    const handleReset = () => {
        setColorTheme(DEFAULT_THEME)
        setBaseColor(DEFAULT_BASE_COLOR)
        setTheme("system")
    }

    if (!mounted) return null

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2 text-foreground">
            <div className="relative">
                {showIndicator && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                )}
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10 shadow-md bg-background hover:bg-muted relative"
                    onClick={handleToggle}
                >
                    <Settings2 className="h-5 w-5" />
                    <span className="sr-only">Toggle DevTools</span>
                </Button>
            </div>

            {isOpen && (
                <div className="flex flex-col gap-2 p-3 rounded-lg border bg-popover/95 backdrop-blur shadow-xl animate-in fade-in slide-in-from-top-2 origin-top-right min-w-62.5">
                    <div className="flex items-center justify-between gap-2 px-1">
                        <span className="text-sm font-semibold text-muted-foreground">DevTools</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={handleReset}
                            title="Reset to defaults"
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            <span className="sr-only">Reset</span>
                        </Button>
                    </div>
                    <Separator className="my-1" />
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium">Mode</span>
                            <ModeToggle />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium">Theme</span>
                            <ThemeColorSwitcher />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium">Base</span>
                            <BaseColorSwitcher />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
