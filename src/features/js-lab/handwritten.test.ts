import { describe, expect, it, vi } from "vitest";
import {
  debounce,
  deepClone,
  flatten,
  groupBy,
  limitConcurrency,
  myBind,
  myInstanceof,
  myNew,
  promiseAll,
  promiseAllSettled,
  promiseAny,
  promiseRace,
  retry,
  throttle,
  withTimeout,
} from "./handwritten";

describe("handwritten utilities", () => {
  it("deepClone keeps nested objects independent", () => {
    const original = { user: { name: "React" }, tags: ["hooks"] };
    const cloned = deepClone(original);

    cloned.user.name = "Next";

    expect(original.user.name).toBe("React");
    expect(cloned.tags).toEqual(["hooks"]);
  });

  it("promiseAll preserves result order", async () => {
    await expect(promiseAll([Promise.resolve("a"), 2] as const)).resolves.toEqual(["a", 2]);
  });

  it("promiseRace resolves with the first settled promise", async () => {
    vi.useFakeTimers();
    const fast = new Promise((resolve) => setTimeout(() => resolve("fast"), 10));
    const slow = new Promise((resolve) => setTimeout(() => resolve("slow"), 30));
    const result = promiseRace([slow, fast] as const);

    await vi.advanceTimersByTimeAsync(10);

    await expect(result).resolves.toBe("fast");
    vi.useRealTimers();
  });

  it("promiseAllSettled keeps fulfilled and rejected results", async () => {
    await expect(
      promiseAllSettled([Promise.resolve("ok"), Promise.reject("bad")] as const),
    ).resolves.toEqual([
      { status: "fulfilled", value: "ok" },
      { status: "rejected", reason: "bad" },
    ]);
  });

  it("promiseAny resolves with the first fulfilled value", async () => {
    await expect(promiseAny([Promise.reject("bad"), Promise.resolve("ok")] as const)).resolves.toBe(
      "ok",
    );
  });

  it("myInstanceof follows the prototype chain", () => {
    expect(myInstanceof([], Array)).toBe(true);
    expect(myInstanceof({}, Array)).toBe(false);
  });

  it("myNew creates an instance with the constructor prototype", () => {
    function Person(this: { name: string }, name: string) {
      this.name = name;
    }

    const person = myNew<{ name: string }>(Person, "Ada");

    expect(person).toBeInstanceOf(Person);
    expect(person.name).toBe("Ada");
  });

  it("myBind binds this and preset arguments", () => {
    function greet(this: { prefix: string }, name: string) {
      return `${this.prefix} ${name}`;
    }

    const bound = myBind(greet, { prefix: "Hi" });

    expect(bound("React")).toBe("Hi React");
  });

  it("debounce runs only the last call", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced("first");
    debounced("second");
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledOnce();
    expect(fn).toHaveBeenCalledWith("second");
    vi.useRealTimers();
  });

  it("throttle limits calls inside the wait window", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled("first");
    throttled("second");
    vi.advanceTimersByTime(100);
    throttled("third");

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith("third");
    vi.useRealTimers();
  });

  it("limitConcurrency preserves result order", async () => {
    const running: number[] = [];
    const maxRunning: number[] = [];
    const tasks = [1, 2, 3].map((value) => async () => {
      running.push(value);
      maxRunning.push(running.length);
      await Promise.resolve();
      running.pop();
      return value;
    });

    await expect(limitConcurrency(tasks, 2)).resolves.toEqual([1, 2, 3]);
    expect(Math.max(...maxRunning)).toBeLessThanOrEqual(2);
  });

  it("retry reruns a failing task", async () => {
    const task = vi.fn().mockRejectedValueOnce(new Error("first")).mockResolvedValueOnce("success");

    await expect(retry(task, 1)).resolves.toBe("success");
    expect(task).toHaveBeenCalledTimes(2);
  });

  it("withTimeout rejects when the promise is too slow", async () => {
    vi.useFakeTimers();
    const result = withTimeout(new Promise(() => undefined), 100);
    const expectation = expect(result).rejects.toThrow("Promise timed out");

    await vi.advanceTimersByTimeAsync(100);

    await expectation;
    vi.useRealTimers();
  });

  it("flatten flattens arrays to a specific depth", () => {
    expect(flatten([1, [2, [3] as unknown as number]] as const, 1)).toEqual([1, 2, [3]]);
  });

  it("groupBy groups items by key", () => {
    const result = groupBy(
      [
        { type: "js", name: "Promise" },
        { type: "react", name: "Hooks" },
        { type: "js", name: "Closure" },
      ],
      (item) => item.type,
    );

    expect(result.js.map((item) => item.name)).toEqual(["Promise", "Closure"]);
  });
});
