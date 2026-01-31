import { Hero } from "@/components/hero";
import { ComponentExample } from "@/components/component-example";

async function getGitHubStars(): Promise<number> {
    try {
        const response = await fetch("https://api.github.com/repos/Wadiou/shadcn-dynamic-theme", {
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            return 0;
        }

        const data = await response.json();
        return data.stargazers_count;
    } catch (error) {
        return 0;
    }
}

export default async function Page() {
    const stars = await getGitHubStars();

    return (
        <main className="flex min-h-screen flex-col items-center justify-start gap-0">
            <Hero stars={stars} />
            <ComponentExample />
        </main>
    )
}