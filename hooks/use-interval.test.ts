import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useInterval } from "./use-interval";

describe("useInterval", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("calls callback at specified interval", () => {
		const callback = vi.fn();
		renderHook(() => useInterval(callback, 1000));

		expect(callback).not.toHaveBeenCalled();

		vi.advanceTimersByTime(1000);
		expect(callback).toHaveBeenCalledTimes(1);

		vi.advanceTimersByTime(1000);
		expect(callback).toHaveBeenCalledTimes(2);

		vi.advanceTimersByTime(1000);
		expect(callback).toHaveBeenCalledTimes(3);
	});

	it("clears timeout on unmount", () => {
		const callback = vi.fn();
		const { unmount } = renderHook(() => useInterval(callback, 1000));

		vi.advanceTimersByTime(1000);
		expect(callback).toHaveBeenCalledTimes(1);

		unmount();

		vi.advanceTimersByTime(5000);
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it("supports dynamic timeout via function", () => {
		const callback = vi.fn();
		const getInterval = vi.fn(() => 1000);

		renderHook(() => useInterval(callback, getInterval));

		expect(getInterval).toHaveBeenCalled();

		vi.advanceTimersByTime(1000);
		expect(callback).toHaveBeenCalledTimes(1);

		const callCountAfterFirstTick = getInterval.mock.calls.length;
		expect(callCountAfterFirstTick).toBeGreaterThan(1);
	});

	it("passes tick count to callback", () => {
		const callback = vi.fn();
		renderHook(() => useInterval(callback, 1000));

		vi.advanceTimersByTime(1000);
		expect(callback).toHaveBeenCalledWith(1);

		vi.advanceTimersByTime(1000);
		expect(callback).toHaveBeenCalledWith(2);

		vi.advanceTimersByTime(1000);
		expect(callback).toHaveBeenCalledWith(3);
	});

	it("uses default timeout of 1000ms when not specified", () => {
		const callback = vi.fn();
		renderHook(() => useInterval(callback));

		vi.advanceTimersByTime(999);
		expect(callback).not.toHaveBeenCalled();

		vi.advanceTimersByTime(1);
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it("does not fire callback before first interval", () => {
		const callback = vi.fn();
		renderHook(() => useInterval(callback, 1000));

		vi.advanceTimersByTime(999);
		expect(callback).not.toHaveBeenCalled();
	});

	it("continues working after callback throws", () => {
		const callback = vi.fn().mockImplementation((tick: number) => {
			if (tick === 2) throw new Error("Test error");
		});

		renderHook(() => useInterval(callback, 1000));

		vi.advanceTimersByTime(1000);
		expect(callback).toHaveBeenCalledTimes(1);

		expect(() => vi.advanceTimersByTime(1000)).toThrow("Test error");
		expect(callback).toHaveBeenCalledTimes(2);
	});
});
