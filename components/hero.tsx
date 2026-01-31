"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

import { Github, Star } from "lucide-react"
import Link from "next/link"

export function Hero({ stars = 0 }: { stars?: number }) {
    const container = useRef<HTMLDivElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)
    const subTitleRef = useRef<HTMLParagraphElement>(null)
    const buttonsRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

        tl.fromTo(titleRef.current, {
            y: 50,
            opacity: 0,
        }, {
            y: 0,
            opacity: 1,
            duration: 1,
        })
            .fromTo(subTitleRef.current, {
                y: 50,
                opacity: 0,
            }, {
                y: 0,
                opacity: 1,
                duration: 1,
            }, "-=0.6")
            .fromTo(buttonsRef.current, {
                y: 50,
                opacity: 0,
            }, {
                y: 0,
                opacity: 1,
                duration: 0.8,
            }, "-=0.6")

    }, { scope: container })

    return (
        <section ref={container} className="container flex flex-col items-center justify-center gap-6 mt-8 md:mt-12 text-center  ">
            <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4">
                <h1 ref={titleRef} className="opacity-0 text-balance text-3xl font-bold leading-tight tracking-tighter sm:text-4xl  lg:text-5xl lg:leading-[1.3]">
                    <span className="text-primary">Dynamic Theming</span>
                    <br className="hidden sm:inline" />
                    {" "}Built for Shadcn UI
                </h1>
                <p ref={subTitleRef} className="opacity-0 max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl leading-relaxed">
                    Switch themes and base colors at runtime. No page reloads. Fully compatible with Next.js (TanStack Start) & Vite.
                </p>
            </div>
            <div ref={buttonsRef} className="opacity-0 flex gap-4">
                <Link
                    target="_blank"
                    rel="noreferrer"
                    href="https://github.com/Wadiou/shadcn-dynamic-theme"
                    className="inline-flex h-10 w-40 items-center justify-between rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                    <div className="flex items-center gap-2">
                        <Github className="h-4 w-4" />
                        GitHub
                    </div>
                    {stars > 0 && (
                        <span className="ml-2 flex items-center justify-center rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">
                            <Star className="mr-1 h-3 w-3 fill-current text-yellow-500" />
                            {new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(stars)}
                        </span>
                    )}
                </Link>
            </div>
        </section>
    )
}
