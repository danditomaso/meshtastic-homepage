import { describe, it, expect, beforeEach } from "vitest";
import {
	hydrateUsers,
	buildTimeline,
	DEFAULT_MESSAGE_COUNT,
} from "./build-timeline";
import type {
	UserConfig,
	User,
	ConversationData,
} from "@/types/conversation.types";

const mockUserConfigs: UserConfig[] = [
	{ id: "user1", rssi: -100 },
	{ id: "user2", hops: 2 },
	{ id: "user3", rssi: -110 },
	{ id: "user4", hops: 4 },
];

const mockConversationData: ConversationData = {
	conversationThreads: [
		{
			messages: [
				{ text: "Hello", userId: "user1" },
				{ text: "Hi there", userId: "user2" },
				{ text: "How are you?", userId: "user1" },
			],
		},
		{
			messages: [
				{ text: "Testing", userId: "user3" },
				{ text: "Copy that", userId: "user4" },
			],
		},
	],
	standaloneMessages: ["Beacon", "Status update", "All clear"],
	autoResponses: ["Got it", "Thanks"],
};

describe("hydrateUsers", () => {
	it("preserves user id and signal config", () => {
		const users = hydrateUsers(mockUserConfigs);

		expect(users).toHaveLength(4);
		expect(users[0].id).toBe("user1");
		expect(users[0].rssi).toBe(-100);
		expect(users[1].id).toBe("user2");
		expect(users[1].hops).toBe(2);
	});

	it("generates shortName and longName for each user", () => {
		const users = hydrateUsers(mockUserConfigs);

		for (const user of users) {
			expect(user.shortName).toBeDefined();
			expect(user.longName).toBeDefined();
			expect(user.shortName.length).toBeGreaterThan(0);
			expect(user.longName.length).toBeGreaterThan(0);
		}
	});

	it("returns empty array for empty input", () => {
		const users = hydrateUsers([]);
		expect(users).toHaveLength(0);
	});

	it("each user gets unique names (high probability)", () => {
		const users = hydrateUsers(mockUserConfigs);
		const longNames = users.map((u) => u.longName);
		const uniqueLongNames = new Set(longNames);

		// High probability all are unique (not guaranteed but very likely with 4 users)
		expect(uniqueLongNames.size).toBe(longNames.length);
	});
});

describe("buildTimeline", () => {
	let users: User[];

	beforeEach(() => {
		users = hydrateUsers(mockUserConfigs);
	});

	it("returns requested number of messages", () => {
		const timeline = buildTimeline(users, mockConversationData, 20);
		expect(timeline).toHaveLength(20);
	});

	it("uses default message count when not specified", () => {
		const timeline = buildTimeline(users, mockConversationData);
		expect(timeline.length).toBe(DEFAULT_MESSAGE_COUNT);
	});

	it("each message has required fields", () => {
		const timeline = buildTimeline(users, mockConversationData, 10);

		for (const msg of timeline) {
			expect(msg).toHaveProperty("id");
			expect(msg).toHaveProperty("text");
			expect(msg).toHaveProperty("shortName");
			expect(msg).toHaveProperty("longName");
			expect(msg).toHaveProperty("time");
			expect(msg).toHaveProperty("rssi");
			expect(typeof msg.id).toBe("number");
			expect(typeof msg.text).toBe("string");
			expect(typeof msg.shortName).toBe("string");
			expect(typeof msg.longName).toBe("string");
			expect(typeof msg.time).toBe("string");
			expect(typeof msg.rssi).toBe("number");
		}
	});

	it("messages have unique incrementing ids", () => {
		const timeline = buildTimeline(users, mockConversationData, 30);
		const ids = timeline.map((m) => m.id);

		for (let i = 1; i < ids.length; i++) {
			expect(ids[i]).toBeGreaterThan(ids[i - 1]);
		}
	});

	it("messages have signal values based on user config", () => {
		const timeline = buildTimeline(users, mockConversationData, 30);

		for (const msg of timeline) {
			// Each message should have either rssi != 0 or hops defined
			const hasRssi = msg.rssi !== 0;
			const hasHops = msg.hops !== undefined;
			expect(hasRssi || hasHops).toBe(true);
		}
	});

	it("signal values match the user config", () => {
		const timeline = buildTimeline(users, mockConversationData, 30);
		const userMap = new Map(users.map((u) => [u.shortName, u]));

		for (const msg of timeline) {
			const user = userMap.get(msg.shortName);
			if (user) {
				if (user.rssi !== undefined) {
					expect(msg.rssi).toBe(user.rssi);
				}
				if (user.hops !== undefined) {
					expect(msg.hops).toBe(user.hops);
				}
			}
		}
	});

	it("includes messages from multiple threads (interleaved)", () => {
		const timeline = buildTimeline(users, mockConversationData, 20);
		const texts = new Set(timeline.map((m) => m.text));

		// Should include messages from both threads
		const hasThread1 =
			texts.has("Hello") || texts.has("Hi there") || texts.has("How are you?");
		const hasThread2 = texts.has("Testing") || texts.has("Copy that");

		expect(hasThread1).toBe(true);
		expect(hasThread2).toBe(true);
	});

	it("includes standalone messages when threads exhausted", () => {
		const timeline = buildTimeline(users, mockConversationData, 50);
		const texts = timeline.map((m) => m.text);

		const hasStandalone = mockConversationData.standaloneMessages.some(
			(standalone) => texts.includes(standalone),
		);
		expect(hasStandalone).toBe(true);
	});

	it("times are in valid HH:MM format", () => {
		const timeline = buildTimeline(users, mockConversationData, 20);
		const timeRegex = /^\d{2}:\d{2}$/;

		for (const msg of timeline) {
			expect(msg.time).toMatch(timeRegex);
		}
	});

	it("times progress forward through the timeline", () => {
		const timeline = buildTimeline(users, mockConversationData, 10);

		// Parse times and ensure they're sequential (earlier messages have earlier times)
		for (let i = 1; i < timeline.length; i++) {
			const prevTime = timeline[i - 1].time;
			const currTime = timeline[i].time;

			// Convert to minutes for comparison (handling day wrap)
			const prevMinutes =
				Number.parseInt(prevTime.split(":")[0]) * 60 +
				Number.parseInt(prevTime.split(":")[1]);
			const currMinutes =
				Number.parseInt(currTime.split(":")[0]) * 60 +
				Number.parseInt(currTime.split(":")[1]);

			// Current time should be >= previous time (or wrapped around midnight)
			const wrapped = currMinutes < prevMinutes && prevMinutes > 1380; // 23:00+
			expect(currMinutes >= prevMinutes || wrapped).toBe(true);
		}
	});

	it("handles empty conversation threads gracefully", () => {
		const emptyData: ConversationData = {
			conversationThreads: [],
			standaloneMessages: ["Beacon"],
			autoResponses: ["Got it"],
		};

		const timeline = buildTimeline(users, emptyData, 10);
		expect(timeline).toHaveLength(10);

		// All messages should be standalone
		for (const msg of timeline) {
			expect(msg.text).toBe("Beacon");
		}
	});

	it("can build timeline larger than total thread messages", () => {
		// Total thread messages: 5 (3 + 2)
		// Request 30 messages - should fill with standalone
		const timeline = buildTimeline(users, mockConversationData, 30);
		expect(timeline).toHaveLength(30);
	});
});
