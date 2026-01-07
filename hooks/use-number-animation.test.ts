import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useNumberAnimation } from "./use-number-animation";

describe("useNumberAnimation", () => {
	let rafCallbacks: Array<(time: number) => void> = [];
	let rafId = 0;
	let mockNow = 0;

	beforeEach(() => {
		rafCallbacks = [];
		rafId = 0;
		mockNow = 0;

		vi.spyOn(performance, "now").mockImplementation(() => mockNow);

		vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
			rafCallbacks.push(cb);
			return ++rafId;
		});

		vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {
			// Cancel by removing callback (simplified)
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	function advanceAnimation(ms: number) {
		mockNow += ms;
		const callbacks = [...rafCallbacks];
		rafCallbacks = [];
		act(() => {
			for (const cb of callbacks) {
				cb(mockNow);
			}
		});
	}

	it("starts at 0", () => {
		const { result } = renderHook(() => useNumberAnimation(100));
		expect(result.current).toBe(0);
	});

	it("animates to target value over duration", () => {
		const { result } = renderHook(() => useNumberAnimation(100, 1000));

		advanceAnimation(500);
		expect(result.current).toBeGreaterThan(0);
		expect(result.current).toBeLessThan(100);

		advanceAnimation(500);
		expect(result.current).toBe(100);
	});

	it("reaches exact target at end of animation", () => {
		const { result } = renderHook(() => useNumberAnimation(1000, 1500));

		advanceAnimation(1500);
		expect(result.current).toBe(1000);
	});

	it("uses linear easing", () => {
		const { result } = renderHook(() => useNumberAnimation(100, 1000));

		advanceAnimation(500);
		const midpoint = result.current;

		// Linear at 50% progress = 50
		expect(midpoint).toBe(50);
	});

	it("handles zero target", () => {
		const { result } = renderHook(() => useNumberAnimation(0, 1000));

		advanceAnimation(1000);
		expect(result.current).toBe(0);
	});

	it("handles large numbers", () => {
		const { result } = renderHook(() => useNumberAnimation(10000, 1000));

		advanceAnimation(1000);
		expect(result.current).toBe(10000);
	});

	it("uses default duration of 1500ms", () => {
		const { result } = renderHook(() => useNumberAnimation(100));

		advanceAnimation(750);
		expect(result.current).toBeLessThan(100);

		advanceAnimation(750);
		expect(result.current).toBe(100);
	});

	it("cancels animation on unmount", () => {
		const cancelSpy = vi.spyOn(window, "cancelAnimationFrame");
		const { unmount } = renderHook(() => useNumberAnimation(100, 1000));

		unmount();

		expect(cancelSpy).toHaveBeenCalled();
	});

	it("restarts animation when target changes", () => {
		const { result, rerender } = renderHook(
			({ target }) => useNumberAnimation(target, 1000),
			{ initialProps: { target: 100 } },
		);

		advanceAnimation(1000);
		expect(result.current).toBe(100);

		rerender({ target: 200 });
		advanceAnimation(1000);
		expect(result.current).toBe(200);
	});
});
