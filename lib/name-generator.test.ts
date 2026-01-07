import { describe, it, expect } from "vitest";
import {
	generateLongName,
	generateNodeName,
	generateNodeNames,
	isValidShortName,
	isValidLongName,
	toShortName,
	EMOJI_CHANCE,
	HEX_CHANCE,
} from "./name-generator";
import emojisData from "@/data/emojis.json";

describe("generateLongName", () => {
	it("returns a non-empty string", () => {
		const name = generateLongName();
		expect(name.length).toBeGreaterThan(0);
	});

	it("meshtastic style includes Meshtastic prefix", () => {
		for (let i = 0; i < 10; i++) {
			const name = generateLongName("meshtastic");
			expect(name).toMatch(/^Meshtastic [A-Z0-9]{4}$/);
		}
	});

	it("prefixed style includes colon separator", () => {
		for (let i = 0; i < 20; i++) {
			const name = generateLongName("prefixed");
			expect(name).toContain(": ");
		}
	});

	it("creative style combines adjective and noun", () => {
		for (let i = 0; i < 20; i++) {
			const name = generateLongName("creative");
			// Should have at least two words (adjective + noun, possibly + number)
			expect(name.split(" ").length).toBeGreaterThanOrEqual(2);
		}
	});

	it("combo style has prefix-letter format", () => {
		for (let i = 0; i < 20; i++) {
			const name = generateLongName("combo");
			// Format: "ABC-D Noun"
			expect(name).toMatch(/^[A-Z0-9]{3}-[A-Z0-9] \w+$/);
		}
	});

	it("custom style generates various patterns", () => {
		const names = new Set<string>();
		for (let i = 0; i < 50; i++) {
			names.add(generateLongName("custom"));
		}
		// Should generate variety
		expect(names.size).toBeGreaterThan(10);
	});
});

describe("toShortName", () => {
	it("returns name as-is if 4 or fewer characters", () => {
		expect(toShortName("ab")).toBe("ab");
		expect(toShortName("abcd")).toBe("abcd");
	});

	it("creates acronym from 4+ word names", () => {
		expect(toShortName("Alpha Beta Gamma Delta")).toBe("ABGD");
		expect(toShortName("One Two Three Four Five")).toBe("OTTF");
	});

	it("truncates single long words", () => {
		expect(toShortName("Meshtastic")).toBe("Mesh");
		expect(toShortName("Station")).toBe("Stat");
	});

	it("handles two-word names", () => {
		const result = toShortName("Swift Fox");
		expect(result.length).toBeLessThanOrEqual(4);
		expect(result).toBe("SwFo");
	});

	it("handles three-word names", () => {
		const result = toShortName("Big Red Dog");
		expect(result.length).toBeLessThanOrEqual(4);
	});

	it("handles names with colons and hyphens", () => {
		const result = toShortName("MeshNet: Base-01");
		expect(result.length).toBeLessThanOrEqual(4);
		// Should split on : and - (4 words: MeshNet, Base, 01 -> acronym)
		expect(result).toBe("MB0");
	});

	it("always returns max 4 characters", () => {
		const testNames = [
			"Very Long Name Here",
			"Short",
			"A B C D E F",
			"MeshNet: Mobile-99",
			"theNodeStation",
		];
		for (const name of testNames) {
			const short = toShortName(name);
			expect(short.length).toBeLessThanOrEqual(4);
			expect(short.length).toBeGreaterThan(0);
		}
	});
});



describe("generateNodeName", () => {
	it("returns object with shortName and longName", () => {
		const result = generateNodeName();
		expect(result).toHaveProperty("shortName");
		expect(result).toHaveProperty("longName");
		expect(typeof result.shortName).toBe("string");
		expect(typeof result.longName).toBe("string");
	});

	it("both names are non-empty", () => {
		for (let i = 0; i < 50; i++) {
			const { shortName, longName } = generateNodeName();
			expect(shortName.length).toBeGreaterThan(0);
			expect(longName.length).toBeGreaterThan(0);
		}
	});

	it("shortName is max 4 characters or an emoji", () => {
		const avatarSet = new Set(emojisData.avatars);

		for (let i = 0; i < 100; i++) {
			const { shortName } = generateNodeName();
			const isEmoji = avatarSet.has(shortName);
			if (!isEmoji) {
				expect(shortName.length).toBeLessThanOrEqual(4);
			}
		}
	});

	it("generates emoji short names approximately 20% of the time", () => {
		const iterations = 500;
		let emojiCount = 0;
		const avatarSet = new Set(emojisData.avatars);

		for (let i = 0; i < iterations; i++) {
			const { shortName } = generateNodeName();
			if (avatarSet.has(shortName)) {
				emojiCount++;
			}
		}

		const rate = emojiCount / iterations;
		// Allow variance: expect between 15% and 25%
		expect(rate).toBeGreaterThan(EMOJI_CHANCE - 0.05);
		expect(rate).toBeLessThan(EMOJI_CHANCE + 0.05);
	});

	it("generates hex short names approximately 30% of the time", () => {
		const iterations = 500;
		let hexCount = 0;
		const avatarSet = new Set(emojisData.avatars);
		const hexPattern = /^[0-9a-f]{4}$/;

		for (let i = 0; i < iterations; i++) {
			const { shortName } = generateNodeName();
			// Not emoji and matches hex pattern
			if (!avatarSet.has(shortName) && hexPattern.test(shortName)) {
				hexCount++;
			}
		}

		const rate = hexCount / iterations;
		// Allow variance: expect between 25% and 35%
		expect(rate).toBeGreaterThan(HEX_CHANCE - 0.05);
		expect(rate).toBeLessThan(HEX_CHANCE + 0.05);
	});

	it("non-emoji, non-hex short names are derived from long name", () => {
		const avatarSet = new Set(emojisData.avatars);
		const hexPattern = /^[0-9a-f]{4}$/;

		for (let i = 0; i < 100; i++) {
			const { shortName, longName } = generateNodeName();
			const isEmoji = avatarSet.has(shortName);
			const isHex = hexPattern.test(shortName);

			if (!isEmoji && !isHex) {
				// Short name should be derivable from long name
				const expectedShort = toShortName(longName);
				expect(shortName).toBe(expectedShort);
			}
		}
	});

	it("respects longStyle parameter", () => {
		for (let i = 0; i < 10; i++) {
			const result = generateNodeName("meshtastic");
			expect(result.longName).toMatch(/^Meshtastic [A-Z0-9]{4}$/);
		}
	});
});

describe("generateNodeNames", () => {
	it("returns requested count of names", () => {
		const names = generateNodeNames(5);
		expect(names).toHaveLength(5);
	});

	it("each result has shortName and longName", () => {
		const names = generateNodeNames(10);
		for (const name of names) {
			expect(name).toHaveProperty("shortName");
			expect(name).toHaveProperty("longName");
		}
	});

	it("returns empty array for count of 0", () => {
		const names = generateNodeNames(0);
		expect(names).toHaveLength(0);
	});

	it("respects longStyle parameter", () => {
		const names = generateNodeNames(10, "creative");
		for (const { longName } of names) {
			// Creative style has at least 2 words
			expect(longName.split(" ").length).toBeGreaterThanOrEqual(2);
		}
	});
});

describe("isValidShortName", () => {
	it("returns true for valid short names", () => {
		expect(isValidShortName("a")).toBe(true);
		expect(isValidShortName("ab")).toBe(true);
		expect(isValidShortName("abc")).toBe(true);
		expect(isValidShortName("abcd")).toBe(true);
	});

	it("returns false for empty string", () => {
		expect(isValidShortName("")).toBe(false);
	});

	it("returns false for names longer than 4 characters", () => {
		expect(isValidShortName("abcde")).toBe(false);
		expect(isValidShortName("longer")).toBe(false);
	});

	it("returns true for emoji short names", () => {
		expect(isValidShortName("🦊")).toBe(true);
		expect(isValidShortName("⭐")).toBe(true);
	});
});

describe("isValidLongName", () => {
	it("returns true for valid long names", () => {
		expect(isValidLongName("a")).toBe(true);
		expect(isValidLongName("Meshtastic Node")).toBe(true);
		expect(isValidLongName("A".repeat(40))).toBe(true);
	});

	it("returns false for empty string", () => {
		expect(isValidLongName("")).toBe(false);
	});

	it("returns false for names longer than 40 characters", () => {
		expect(isValidLongName("A".repeat(41))).toBe(false);
	});
});
