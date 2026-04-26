export function debounce<TArgs extends unknown[]>(fn: (...args: TArgs) => void, wait: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return (...args: TArgs) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => fn(...args), wait);
  };
}

export function throttle<TArgs extends unknown[]>(fn: (...args: TArgs) => void, wait: number) {
  let lastRun = 0;

  return (...args: TArgs) => {
    const now = Date.now();
    if (now - lastRun >= wait) {
      lastRun = now;
      fn(...args);
    }
  };
}

export function deepClone<T>(value: T, cache = new WeakMap<object, unknown>()): T {
  if (typeof value !== "object" || value === null) {
    return value;
  }

  if (cache.has(value)) {
    return cache.get(value) as T;
  }

  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }

  if (Array.isArray(value)) {
    const result: unknown[] = [];
    cache.set(value, result);
    for (const item of value) {
      result.push(deepClone(item, cache));
    }
    return result as T;
  }

  const result = {} as Record<PropertyKey, unknown>;
  cache.set(value, result);
  for (const key of Reflect.ownKeys(value)) {
    result[key] = deepClone((value as Record<PropertyKey, unknown>)[key], cache);
  }
  return result as T;
}

export function promiseAll<TValues extends readonly unknown[]>(
  values: TValues,
): Promise<{ [K in keyof TValues]: Awaited<TValues[K]> }> {
  return new Promise((resolve, reject) => {
    if (values.length === 0) {
      resolve([] as unknown as { [K in keyof TValues]: Awaited<TValues[K]> });
      return;
    }

    const results: unknown[] = [];
    let completed = 0;

    values.forEach((value, index) => {
      Promise.resolve(value)
        .then((resolvedValue) => {
          results[index] = resolvedValue;
          completed += 1;
          if (completed === values.length) {
            resolve(results as { [K in keyof TValues]: Awaited<TValues[K]> });
          }
        })
        .catch(reject);
    });
  });
}

export function promiseRace<TValues extends readonly unknown[]>(
  values: TValues,
): Promise<Awaited<TValues[number]>> {
  return new Promise((resolve, reject) => {
    for (const value of values) {
      Promise.resolve(value).then((resolvedValue) => {
        resolve(resolvedValue as Awaited<TValues[number]>);
      }, reject);
    }
  });
}

type SettledResults<TValues extends readonly unknown[]> = {
  [K in keyof TValues]:
    | { status: "fulfilled"; value: Awaited<TValues[K]> }
    | { status: "rejected"; reason: unknown };
};

export function promiseAllSettled<TValues extends readonly unknown[]>(
  values: TValues,
): Promise<SettledResults<TValues>> {
  return new Promise((resolve) => {
    if (values.length === 0) {
      resolve([] as unknown as SettledResults<TValues>);
      return;
    }

    const results: unknown[] = [];
    let completed = 0;

    values.forEach((value, index) => {
      Promise.resolve(value)
        .then((resolvedValue) => {
          results[index] = { status: "fulfilled", value: resolvedValue };
        })
        .catch((reason) => {
          results[index] = { status: "rejected", reason };
        })
        .finally(() => {
          completed += 1;
          if (completed === values.length) {
            resolve(results as unknown as SettledResults<TValues>);
          }
        });
    });
  });
}

export function promiseAny<TValues extends readonly unknown[]>(
  values: TValues,
): Promise<Awaited<TValues[number]>> {
  return new Promise((resolve, reject) => {
    if (values.length === 0) {
      reject(new Error("All promises were rejected"));
      return;
    }

    const errors: unknown[] = [];
    let rejectedCount = 0;

    values.forEach((value, index) => {
      Promise.resolve(value)
        .then((resolvedValue) => {
          resolve(resolvedValue as Awaited<TValues[number]>);
        })
        .catch((error) => {
          errors[index] = error;
          rejectedCount += 1;
          if (rejectedCount === values.length) {
            const aggregateError = new Error("All promises were rejected");
            reject(Object.assign(aggregateError, { errors }));
          }
        });
    });
  });
}

export async function limitConcurrency<T>(
  tasks: Array<() => Promise<T>>,
  limit: number,
): Promise<T[]> {
  if (limit <= 0) {
    throw new Error("limit must be greater than 0");
  }

  const results: T[] = [];
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < tasks.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await tasks[currentIndex]();
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker));
  return results;
}

export async function retry<T>(task: () => Promise<T>, times: number): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= times; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

export function withTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Promise timed out")), timeout);

    promise.then(resolve, reject).finally(() => {
      clearTimeout(timer);
    });
  });
}

type ConstructorLike = { prototype: object };

export function myInstanceof(value: unknown, target: ConstructorLike) {
  if ((typeof value !== "object" && typeof value !== "function") || value === null) {
    return false;
  }

  let prototype = Object.getPrototypeOf(value);
  while (prototype) {
    if (prototype === target.prototype) {
      return true;
    }
    prototype = Object.getPrototypeOf(prototype);
  }
  return false;
}

type CallableConstructor<TInstance extends object> = {
  prototype: TInstance;
  apply(thisArg: TInstance, args: unknown[]): object | undefined;
};

export function myNew<TInstance extends object>(
  Constructor: CallableConstructor<TInstance>,
  ...args: unknown[]
): TInstance {
  const instance = Object.create(Constructor.prototype);
  const result = Constructor.apply(instance, args);
  return (typeof result === "object" && result !== null ? result : instance) as TInstance;
}

export function myBind<TThis, TArgs extends unknown[], TReturn>(
  fn: (this: TThis, ...args: TArgs) => TReturn,
  thisArg: TThis,
  ...presetArgs: Partial<TArgs>
) {
  return (...laterArgs: unknown[]) => fn.apply(thisArg, [...presetArgs, ...laterArgs] as TArgs);
}

export function flatten<T>(items: ReadonlyArray<T | ReadonlyArray<T>>, depth = 1): T[] {
  const result: T[] = [];

  for (const item of items) {
    if (Array.isArray(item) && depth > 0) {
      result.push(...flatten(item, depth - 1));
    } else {
      result.push(item as T);
    }
  }

  return result;
}

export function groupBy<T, TKey extends PropertyKey>(
  items: readonly T[],
  getKey: (item: T) => TKey,
): Record<TKey, T[]> {
  return items.reduce(
    (result, item) => {
      const key = getKey(item);
      result[key] ??= [];
      result[key].push(item);
      return result;
    },
    {} as Record<TKey, T[]>,
  );
}
