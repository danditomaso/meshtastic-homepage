import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
	useDeviceMockup,
	delay,
	timelineGenerator,
	INITIAL_MESSAGE_COUNT,
	MAX_VISIBLE_MESSAGES,
	FIRST_MESSAGE_DELAY_MS,
	MIN_MESSAGE_INTERVAL_MS,
	MESSAGE_INTERVAL_VARIANCE_MS,
} from "./use-device-mockup";
import type { BuiltMessage, User } from "@/types/conversation.types";

vi.useFakeTimers();

const mockUsers: User[] = [
	{ id: "user1", shortName: "Alex", longName: "Alex Node", rssi: -100 },
	{ id: "user2", shortName: "🦊", longName: "Fox Station", hops: 2 },
];

const createMockTimeline = (count: number): BuiltMessage[] =>
	Array.from({ length: count }, (_, i) => ({
		id: i + 1,
		text: `Message ${i + 1}`,
		shortName: mockUsers[i % 2].shortName,
		longName: mockUsers[i % 2].longName,
		time: "12:00",
		rssi: i % 2 === 0 ? -100 : 0,
		hops: i % 2 === 1 ? 2 : undefined,
	}));

const mockAutoResponses = ["Got it", "Thanks", "Copy"];

describe("useDeviceMockup", () => {
	beforeEach(() => {
		vi.clearAllTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.useFakeTimers();
	});

	it("initializes with first N messages from timeline", () => {
		const mockTimeline = createMockTimeline(20);
		const { result } = renderHook(() =>
			useDeviceMockup({
				timeline: mockTimeline,
				autoResponses: mockAutoResponses,
				users: mockUsers,
			}),
		);

		expect(result.current.messages).toHaveLength(INITIAL_MESSAGE_COUNT);
		expect(result.current.messages[0].text).toBe("Message 5");
		expect(result.current.messages[4].text).toBe("Message 1");
	});

	it("handles empty timeline gracefully", () => {
		const { result } = renderHook(() =>
			useDeviceMockup({
				timeline: [],
				autoResponses: mockAutoResponses,
				users: mockUsers,
			}),
		);

		expect(result.current.messages).toHaveLength(0);
	});

	it("advances through timeline on interval", async () => {
		const mockTimeline = createMockTimeline(20);
		const { result } = renderHook(() =>
			useDeviceMockup({
				timeline: mockTimeline,
				autoResponses: mockAutoResponses,
				users: mockUsers,
			}),
		);

		expect(result.current.messages).toHaveLength(INITIAL_MESSAGE_COUNT);

		await act(async () => {
			await vi.advanceTimersByTimeAsync(3000);
		});

		expect(result.current.messages).toHaveLength(INITIAL_MESSAGE_COUNT + 1);
		expect(result.current.messages[0].text).toBe("Message 6");
	});

	it("loops back to beginning when timeline exhausted", async () => {
		const shortTimeline = createMockTimeline(7);

		const { result } = renderHook(() =>
			useDeviceMockup({
				timeline: shortTimeline,
				autoResponses: mockAutoResponses,
				users: mockUsers,
			}),
		);

		await act(async () => {
			await vi.advanceTimersByTimeAsync(3000);
		});
		await act(async () => {
			await vi.advanceTimersByTimeAsync(10000);
		});
		await act(async () => {
			await vi.advanceTimersByTimeAsync(10000);
		});

		expect(result.current.messages[0].text).toBe("Message 1");
	});

	it("handles user input - send message", () => {
		const mockTimeline = createMockTimeline(20);
		const { result } = renderHook(() =>
			useDeviceMockup({
				timeline: mockTimeline,
				autoResponses: mockAutoResponses,
				users: mockUsers,
			}),
		);

		act(() => {
			result.current.setInputValue("Hello mesh!");
		});

		act(() => {
			result.current.handleSendMessage();
		});

		const newestMessage = result.current.messages[0];
		expect(newestMessage.text).toBe("Hello mesh!");
		expect(newestMessage.isOutgoing).toBe(true);
		expect(newestMessage.shortName).toBe("You");
	});

	it("clears input after sending", () => {
		const mockTimeline = createMockTimeline(20);
		const { result } = renderHook(() =>
			useDeviceMockup({
				timeline: mockTimeline,
				autoResponses: mockAutoResponses,
				users: mockUsers,
			}),
		);

		act(() => {
			result.current.setInputValue("Test message");
		});

		act(() => {
			result.current.handleSendMessage();
		});

		expect(result.current.inputValue).toBe("");
	});

	it("does not send empty messages", () => {
		const mockTimeline = createMockTimeline(20);
		const { result } = renderHook(() =>
			useDeviceMockup({
				timeline: mockTimeline,
				autoResponses: mockAutoResponses,
				users: mockUsers,
			}),
		);

		const initialLength = result.current.messages.length;

		act(() => {
			result.current.setInputValue("   ");
			result.current.handleSendMessage();
		});

		expect(result.current.messages.length).toBe(initialLength);
	});

	it("handles keyboard input - regular keys", () => {
		const mockTimeline = createMockTimeline(20);
		const { result } = renderHook(() =>
			useDeviceMockup({
				timeline: mockTimeline,
				autoResponses: mockAutoResponses,
				users: mockUsers,
			}),
		);

		act(() => {
			result.current.handleKeyPress("h");
			result.current.handleKeyPress("i");
		});

		expect(result.current.inputValue).toBe("hi");
	});

	it("handles keyboard input - backspace", () => {
		const mockTimeline = createMockTimeline(20);
		const { result } = renderHook(() =>
			useDeviceMockup({
				timeline: mockTimeline,
				autoResponses: mockAutoResponses,
				users: mockUsers,
			}),
		);

		act(() => {
			result.current.handleKeyPress("h");
			result.current.handleKeyPress("i");
			result.current.handleKeyPress("⌫");
		});

		expect(result.current.inputValue).toBe("h");
	});

	it("handles keyboard input - space", () => {
		const mockTimeline = createMockTimeline(20);
		const { result } = renderHook(() =>
			useDeviceMockup({
				timeline: mockTimeline,
				autoResponses: mockAutoResponses,
				users: mockUsers,
			}),
		);

		act(() => {
			result.current.handleKeyPress("h");
			result.current.handleKeyPress("space");
		});

		expect(result.current.inputValue).toBe("h ");
	});

	it("toggles reactions on messages", () => {
		const mockTimeline = createMockTimeline(20);
		const { result } = renderHook(() =>
			useDeviceMockup({
				timeline: mockTimeline,
				autoResponses: mockAutoResponses,
				users: mockUsers,
			}),
		);

		const messageId = result.current.messages[0].id;

		act(() => {
			result.current.toggleReaction(messageId, "👍");
		});

		expect(result.current.messages[0].reactions).toContain("👍");

		act(() => {
			result.current.toggleReaction(messageId, "👍");
		});

		expect(result.current.messages[0].reactions).not.toContain("👍");
	});

	it("current time is in HH:MM format", () => {
		const mockTimeline = createMockTimeline(20);
		const { result } = renderHook(() =>
			useDeviceMockup({
				timeline: mockTimeline,
				autoResponses: mockAutoResponses,
				users: mockUsers,
			}),
		);

		expect(result.current.currentTime).toMatch(/^\d{2}:\d{2}$/);
	});

	it("maintains max visible messages window", () => {
		const mockTimeline = createMockTimeline(20);
		const { result } = renderHook(() =>
			useDeviceMockup({
				timeline: mockTimeline,
				autoResponses: mockAutoResponses,
				users: mockUsers,
			}),
		);

		for (let i = 0; i < 10; i++) {
			act(() => {
				result.current.setInputValue(`Message ${i}`);
				result.current.handleSendMessage();
			});
		}

		expect(result.current.messages.length).toBeLessThanOrEqual(
			MAX_VISIBLE_MESSAGES,
		);
	});

	it("handleReply sets input with @mention", () => {
		const mockTimeline = createMockTimeline(20);
		const { result } = renderHook(() =>
			useDeviceMockup({
				timeline: mockTimeline,
				autoResponses: mockAutoResponses,
				users: mockUsers,
			}),
		);

		const message = result.current.messages[0];

		act(() => {
			result.current.handleReply(message);
		});

		expect(result.current.inputValue).toBe(`@${message.shortName} `);
	});

	it("addEmojiToInput adds emoji to input", () => {
		const mockTimeline = createMockTimeline(20);
		const { result } = renderHook(() =>
			useDeviceMockup({
				timeline: mockTimeline,
				autoResponses: mockAutoResponses,
				users: mockUsers,
			}),
		);

		act(() => {
			result.current.setInputValue("Hello ");
			result.current.addEmojiToInput("👍");
		});

		expect(result.current.inputValue).toBe("Hello 👍");
	});

	it("addReactionToMessage adds reaction to a message", () => {
		const mockTimeline = createMockTimeline(20);
		const { result } = renderHook(() =>
			useDeviceMockup({
				timeline: mockTimeline,
				autoResponses: mockAutoResponses,
				users: mockUsers,
			}),
		);

		act(() => {
			vi.advanceTimersByTime(100);
		});

		const messageId = result.current.messages[0].id;

		act(() => {
			result.current.addReactionToMessage(messageId, "👍");
		});

		expect(result.current.messages[0].reactions).toContain("👍");
	});
});

describe("delay", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("resolves after specified milliseconds", async () => {
		const controller = new AbortController();
		const promise = delay(1000, controller.signal);

		vi.advanceTimersByTime(999);

		vi.advanceTimersByTime(1);
		await expect(promise).resolves.toBeUndefined();
	});

	it("rejects with AbortError when signal is aborted", async () => {
		const controller = new AbortController();
		const promise = delay(1000, controller.signal);

		controller.abort();

		await expect(promise).rejects.toThrow(DOMException);
		await expect(promise).rejects.toMatchObject({
			name: "AbortError",
		});
	});

	it("clears timeout when aborted", async () => {
		const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");
		const controller = new AbortController();

		const promise = delay(1000, controller.signal);
		controller.abort();

		try {
			await promise;
		} catch {}

		expect(clearTimeoutSpy).toHaveBeenCalled();
		clearTimeoutSpy.mockRestore();
	});
});

describe("timelineGenerator", () => {
	const createGeneratorTimeline = (count: number): BuiltMessage[] =>
		Array.from({ length: count }, (_, i) => ({
			id: i,
			text: `Message ${i}`,
			shortName: `U${i}`,
			longName: `User ${i}`,
			time: "12:00",
			rssi: -50,
		}));

	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("yields messages from timeline starting at startIndex", async () => {
		const timeline = createGeneratorTimeline(10);
		const controller = new AbortController();
		const generator = timelineGenerator(timeline, 5, controller.signal);

		const firstPromise = generator.next();
		await vi.advanceTimersByTimeAsync(FIRST_MESSAGE_DELAY_MS);
		const first = await firstPromise;

		expect(first.value).toMatchObject({
			text: "Message 5",
			shortName: "U5",
		});

		controller.abort();
	});

	it("uses shorter delay for first message", async () => {
		const timeline = createGeneratorTimeline(5);
		const controller = new AbortController();
		const generator = timelineGenerator(timeline, 0, controller.signal);

		const promise = generator.next();

		vi.advanceTimersByTime(FIRST_MESSAGE_DELAY_MS - 1);
		expect(vi.getTimerCount()).toBe(1);

		await vi.advanceTimersByTimeAsync(1);
		const result = await promise;
		expect(result.done).toBe(false);

		controller.abort();
	});

	it("uses longer delay for subsequent messages", async () => {
		const timeline = createGeneratorTimeline(5);
		const controller = new AbortController();
		const generator = timelineGenerator(timeline, 0, controller.signal);

		const firstPromise = generator.next();
		await vi.advanceTimersByTimeAsync(FIRST_MESSAGE_DELAY_MS);
		await firstPromise;

		const secondPromise = generator.next();

		vi.advanceTimersByTime(MIN_MESSAGE_INTERVAL_MS - 1);
		expect(vi.getTimerCount()).toBe(1);

		await vi.advanceTimersByTimeAsync(MESSAGE_INTERVAL_VARIANCE_MS + 1);
		const result = await secondPromise;
		expect(result.done).toBe(false);

		controller.abort();
	});

	it("loops back to index 0 when timeline exhausted", async () => {
		const timeline = createGeneratorTimeline(3);
		const controller = new AbortController();
		const generator = timelineGenerator(timeline, 2, controller.signal);

		const firstPromise = generator.next();
		await vi.advanceTimersByTimeAsync(FIRST_MESSAGE_DELAY_MS);
		const first = await firstPromise;
		expect(first.value).toMatchObject({ text: "Message 2" });

		const secondPromise = generator.next();
		await vi.advanceTimersByTimeAsync(
			MIN_MESSAGE_INTERVAL_MS + MESSAGE_INTERVAL_VARIANCE_MS,
		);
		const second = await secondPromise;
		expect(second.value).toMatchObject({ text: "Message 0" });

		controller.abort();
	});

	it("stops yielding when signal is aborted", async () => {
		const timeline = createGeneratorTimeline(5);
		const controller = new AbortController();
		const generator = timelineGenerator(timeline, 0, controller.signal);

		const firstPromise = generator.next();
		await vi.advanceTimersByTimeAsync(FIRST_MESSAGE_DELAY_MS);
		await firstPromise;

		const secondPromise = generator.next();

		controller.abort();

		await expect(secondPromise).rejects.toThrow(DOMException);
	});

	it("assigns fresh id and current time to yielded messages", async () => {
		const timeline = createGeneratorTimeline(1);
		const controller = new AbortController();

		const now = new Date("2024-01-15T10:30:00");
		vi.setSystemTime(now);

		const generator = timelineGenerator(timeline, 0, controller.signal);

		const promise = generator.next();
		await vi.advanceTimersByTimeAsync(FIRST_MESSAGE_DELAY_MS);
		const result = await promise;

		expect(result.value?.id).toBe(now.getTime() + FIRST_MESSAGE_DELAY_MS);
		expect(result.value?.time).toMatch(/^\d{2}:\d{2}$/);

		controller.abort();
	});
});
