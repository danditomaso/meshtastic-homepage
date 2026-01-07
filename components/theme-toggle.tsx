"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
	const { theme, setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	const toggleTheme = () => {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	};

	if (!mounted) {
		return (
			<Button
				variant="outline"
				size="icon"
				className="border-border/50 bg-transparent"
				disabled
			>
				<span className="h-4 w-4" />
				<span className="sr-only">Toggle theme</span>
			</Button>
		);
	}

	return (
		<Button
			variant="outline"
			size="icon"
			onClick={toggleTheme}
			className="border-border/50 bg-transparent hover:bg-muted"
			title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
		>
			{resolvedTheme === "dark" ? (
				<Sun className="h-4 w-4 text-foreground" />
			) : (
				<Moon className="h-4 w-4 text-foreground" />
			)}
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
