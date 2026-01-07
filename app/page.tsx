import { NetworkMapBackground } from "@/components/network-map-background";
import { DeviceMockup } from "@/components/device-mockup";
import { EcosystemStats } from "@/components/ecosystem-stats";
import { Sponsors } from "@/components/sponsors";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import {
	ArrowRight,
	Download,
	FileText,
	Smartphone,
	Globe,
	Terminal,
	Heart,
	LinkIcon,
	GithubIcon,
} from "lucide-react";
import { SocialSidebar } from "@/components/social-sidebar";
import links from "@/data/links.json" with { type: "json" };

export default function HomePage() {

	return (
		<div className="relative min-h-screen overflow-hidden pb-20 lg:pb-0">
			<div aria-hidden="true">
				<NetworkMapBackground />
			</div>

			<aside aria-label="Social links">
				<SocialSidebar />
			</aside>

			<div className="relative z-10">
				<header className="border-b border-border/50 bg-overlay backdrop-blur-md">
					<nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
						<div className="flex items-center gap-2">
							<img
								src="/logo.svg"
								alt="Meshtastic"
								className="h-11 rounded-lg w-auto dark:invert-0 invert"
							/>
							<h1 className="font-semibold text-lg font-mono">Meshtastic</h1>
						</div>
						<div className="hidden items-center gap-8 md:flex">
							<Link
								href={links.docs}
							>
								Documentation
							</Link>
							<Link
								href={links.downloads}
							>
								Downloads
							</Link>
							<Link
								href={links.webFlasher}
								className="flex items-center gap-2"
							>
								<LinkIcon className="h-4 w-4" />
								Web Flasher
							</Link>
						</div>
						<div className="flex items-center gap-3">
							<Button
								variant="default"
								size="sm"
								className="border-primary/50 bg-primary/15 p-5 text-primary hover:opacity-80 transition-opacity"
								asChild
							>
								<Link href={links.donate}>
									<Heart className="mr-2 h-4 w-4" />
									Donate
								</Link>
							</Button>
							<Button
								variant="default"
								size="sm"
								className="border-primary/50 bg-primary/15 p-5 text-primary hover:opacity-80 transition-opacity"
								asChild
							>
								<Link href={links.github}>
									<GithubIcon className="mr-2 h-4 w-4" />
									GitHub
								</Link>
							</Button>
						</div>
					</nav>
				</header>
				<main className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
					<div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
						<div className="text-center lg:text-left">
							<h2 className="text-balance font-mono text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
								Off-Grid
								<br />
								<span className="text-primary">Communication</span>
								<br />
								For Everyone
							</h2>

							<div className="mt-6 rounded-xl border border-border/50 bg-card/60 p-6 backdrop-blur-xl">
								<p className="max-w-lg text-lg m-auto text-center lg:text-left text-foreground lg:max-w-none">
									An open source, off-grid, decentralized mesh network built to
									run on affordable, low-power devices. No cell towers. No
									internet. Just pure peer-to-peer connectivity.
								</p>
							</div>

							<div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
								<Link href={links.getStarted}>
									<Button
										size="lg"
										variant={"default"}
										className="w-full bg-primary hover:opacity-80 p-5 font-mono text-base sm:w-auto transition-opacity"
									>
										<Download className="mr-2 size-6" />
										Get Started
										<ArrowRight className="ml-2 size-6" />
									</Button>
								</Link>
								<Button
									size="lg"
									variant="ghost"
									className="w-full hover:bg-muted p-5 font-mono border-2 border-slate-400/50 text-base transition-colors sm:w-auto"
								>
									<FileText className="mr-2 size-6" />
									Read Docs
								</Button>
							</div>

							<div className="mt-12">
								<EcosystemStats />
							</div>
						</div>

						<div className="hidden lg:flex lg:justify-end">
							<DeviceMockup />
						</div>
					</div>
					<section aria-label="Features" className="mt-16">
						<h2 className="sr-only">Key Features</h2>
						<div className="grid gap-6 md:grid-cols-3">
							{[
								{
									title: "Long Range",
									description:
										"LoRa technology enables communication over several kilometers",
								},
								{
									title: "Encrypted",
									description:
										"AES-256 encryption keeps your messages private and secure",
								},
								{
									title: "No Infrastructure",
									description:
										"Works without cell towers, WiFi, or internet connectivity",
								},
							].map((feature) => (
								<div
									key={feature.title}
									className="rounded-xl border-2 border-border/50 bg-card/90 p-6 shadow-lg shadow-foreground/5 backdrop-blur-md hover:border-primary/30 hover:opacity-90 transition-all"
								>
									<h3 className="font-mono text-lg font-bold text-foreground">
										{feature.title}
									</h3>
									<p className="mt-2 text-base text-muted-foreground">
										{feature.description}
									</p>
								</div>
							))}
						</div>
					</section>

					<section aria-label="Download clients" className="mt-16">
						<div className="text-left mb-12">
							<h2 className="text-balance font-mono text-3xl font-bold text-foreground md:text-4xl">
								Get Connected
							</h2>
							<p className="mt-4 text-lg text-muted-foreground max-w-3xl">
								Connect and control your Meshtastic devices through various
								platforms. Choose the client that best fits your needs and
								device ecosystem.
							</p>
						</div>

						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							<div className="group rounded-2xl border border-border/50 bg-card/60 p-8 backdrop-blur-sm transition-all hover:border-primary/30 hover:opacity-90">
								<div className="flex items-start justify-between mb-4">
									<h3 className="font-mono text-2xl font-bold text-foreground">
										iOS App
									</h3>
									<div className="rounded-lg border-2 border-primary/50 bg-primary/10 p-3">
										<Smartphone className="size-6 text-primary" />
									</div>
								</div>
								<p className="text-muted-foreground leading-relaxed mb-6">
									Manage your Meshtastic network on-the-go with our iOS
									application.
								</p>
								<Link
									href={links.ios}
									className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium group-hover:gap-3"
								>
									Try it out
									<ArrowRight className="size-6" />
								</Link>
							</div>

							<div className="group rounded-2xl border border-border/50 bg-card/60 p-8 backdrop-blur-sm transition-all hover:border-primary/30 hover:opacity-90">
								<div className="flex items-start justify-between mb-4">
									<h3 className="font-mono text-2xl font-bold text-foreground">
										Android App
									</h3>
									<div className="rounded-lg border-2 border-primary/50 bg-primary/10 p-3">
										<Smartphone className="size-6 text-primary" />
									</div>
								</div>
								<p className="text-muted-foreground leading-relaxed mb-6">
									Connect and control your Meshtastic devices using our Android
									application.
								</p>
								<Link
									href={links.android}
									className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium group-hover:gap-3"
								>
									Try it out
									<ArrowRight className="h-4 w-4" />
								</Link>
							</div>

							<div className="group rounded-2xl border border-border/50 bg-card/60 p-8 backdrop-blur-sm transition-all hover:border-primary/30 hover:opacity-90">
								<div className="flex items-start justify-between mb-4">
									<h3 className="font-mono text-2xl font-bold text-foreground">
										Web Client
									</h3>
									<div className="rounded-lg border-2 border-primary/50 bg-primary/10 p-3">
										<Globe className="size-6 text-primary" />
									</div>
								</div>
								<p className="text-muted-foreground leading-relaxed mb-6">
									Access your Meshtastic network from any device with our
									web-based client.
								</p>
								<a
									href="https://client.meshtastic.org/"
									className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium group-hover:gap-3"
								>
									Try it out
									<ArrowRight className="h-4 w-4" />
								</a>
							</div>

							<div className="group rounded-2xl border border-border/50 bg-card/60 p-8 backdrop-blur-sm transition-all hover:border-primary/30 hover:opacity-90">
								<div className="flex items-start justify-between mb-4">
									<h3 className="font-mono text-2xl font-bold text-foreground">
										Python CLI/SDK
									</h3>
									<div className="rounded-lg border-2 border-primary/50 bg-primary/10 p-3">
										<Terminal className="size-6 text-primary" />
									</div>
								</div>
								<p className="text-muted-foreground leading-relaxed mb-6">
									Command-line interface and SDK for Python developers.
								</p>
								<a
									href="https://meshtastic.org/docs/software/python/cli/"
									className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium group-hover:gap-3"
								>
									Try it out
									<ArrowRight className="h-4 w-4" />
								</a>
							</div>
						</div>
					</section>

					<section aria-label="Sponsors" className="mt-16">
						<Sponsors />
					</section>
				</main>

				<footer className="border-t border-border/50 bg-card/40 backdrop-blur-sm">
					<div className="mx-auto max-w-7xl px-6 py-6">
						<div className="flex flex-col items-center justify-center gap-2 text-center text-base text-muted-foreground md:flex-row md:gap-1">
							<Link href={links.vercel} className="flex items-center gap-2">
								Powered by
								<span className="inline-flex items-center gap-1 font-semibold text-foreground">
									<svg
										className="h-4 w-4"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<title>Vercel Logo</title>
										<path d="M12 0L24 24H0L12 0z" />
									</svg>
									Vercel
								</span>
							</Link>
							<span className="hidden md:inline">|</span>
							<span>
								Meshtastic® is a registered trademark of Meshtastic LLC.
							</span>
							<span className="hidden md:inline">|</span>
							<Link
								href={links.legal}
								className="text-muted-foreground hover:opacity-80 transition-opacity"
							>
								Legal Information
							</Link>
						</div>
					</div>
				</footer>
			</div>
		</div>
	);
}
