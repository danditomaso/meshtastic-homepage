"use client";

import { type ReactNode, useState, useEffect } from "react";
import BQConsulting from "@/public/sponsors/BQ Consulting";
import Heltec from "@/public/sponsors/Heltec";
import RAKWireless from "@/public/sponsors/RAK Wireless";
import SeeedStudio from "@/public/sponsors/SeeedStudio";
import Elecrow from "@/public/sponsors/Elecrow";
import LilyGo from "@/public/sponsors/LilyGo";
import M5Stack from "@/public/sponsors/M5Stack";
import MuziWorks from "@/public/sponsors/MuziWorks";
import NomadStar from "@/public/sponsors/NomadStar";
import Hexaspot from "@/public/sponsors/Hexaspot";
// import Rokland from "@/public/sponsors/Rokland";
import OpenCollective from "@/public/sponsors/OpenCollective";
import Vercel from "@/public/sponsors/Vercel";
import Datadog from "@/public/sponsors/Datadog";
import sponsorsData from "@/data/sponsors.json" with { type: "json" };
import { shuffle } from "@/lib/utils";

const logoComponents: Record<string, React.FC> = {
	"BQ Consulting": BQConsulting,
	"Heltec": Heltec,
	"RAK Wireless": RAKWireless,
	"Seeed Studio": SeeedStudio,
	"Elecrow": Elecrow,
	"LilyGo": LilyGo,
	"M5Stack": M5Stack,
	"MuziWorks": MuziWorks,
	"NomadStar": NomadStar,
	"Hexaspot": Hexaspot,
	// "Rokland": Rokland,
	"Open Collective": OpenCollective,
	"Vercel": Vercel,
	"Datadog": Datadog,

};

interface Sponsor {
	component: React.FC;
	name: string;
	url: string;
}

const initialSupporters: Sponsor[] = sponsorsData.supporters.map((s) => ({
	component: logoComponents[s.name],
	name: s.name,
	url: s.url,
}));

const sponsors: Sponsor[] = sponsorsData.sponsors.map((s) => ({
	component: logoComponents[s.name],
	name: s.name,
	url: s.url,
}));

interface MarqueeProps {
	children: ReactNode;
	reverse?: boolean;
}

function Marquee({ children, reverse }: MarqueeProps) {
	return (
		<div className="relative mt-8 overflow-hidden py-8">
			<div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-linear-to-r from-card to-transparent" />
			<div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-linear-to-l from-card to-transparent" />

			<div
				className="marquee-track flex w-max items-center text-muted-foreground"
				style={{ "--duration": "35s" } as React.CSSProperties}
				data-reverse={reverse || undefined}
			>
				{children}
				{children}
			</div>
		</div>
	);
}

export function Sponsors() {
	const [supporters, setSupporters] = useState(initialSupporters);

	useEffect(() => {
		setSupporters(shuffle(initialSupporters));
	}, []);

	return (
		<div className="relative rounded-2xl border border-border/50 bg-card/40 p-8 backdrop-blur-sm">
			<div>
				<h4 className="text-balance font-mono text-3xl font-bold text-foreground md:text-4xl">
					Supported By
				</h4>

				<Marquee>
					{supporters.map((supporter) => {
						const Logo = supporter.component;
						return (
							<a
								key={supporter.name}
								href={supporter.url}
								target="_blank"
								rel="noopener noreferrer"
								className="flex h-12 shrink-0 items-center px-8 last:px-0 transition-transform hover:scale-110"
							>
								<Logo />
							</a>
						);
					})}
				</Marquee>
			</div>

			<div className="my-4 border-t border-border/30" />

			<div>
				<h4 className="text-balance font-mono text-3xl font-bold text-foreground md:text-4xl">
					Sponsored By
				</h4>

				<Marquee reverse>
					{sponsors.map((sponsor) => {
						const Logo = sponsor.component;
						return (
							<a
								key={sponsor.name}
								href={sponsor.url}
								target="_blank"
								rel="noopener noreferrer"
								className="flex h-10 shrink-0 items-center px-12 last:px-0 transition-transform hover:scale-110"
							>
								<Logo />
							</a>
						);
					})}
				</Marquee>
			</div>
		</div>
	);
}
