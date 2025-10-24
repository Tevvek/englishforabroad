/**
 * Utility function that wraps async operations and returns a tuple with data and error
 * Usage: const [data, error] = await tryCatch(someAsyncOperation())
 */
export async function tryCatch<T>(
  promise: Promise<T>
): Promise<[T, null] | [null, Error]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}

/**
 * Synchronous version of tryCatch
 * Usage: const [data, error] = tryCatchSync(() => { ... })
 */
export function tryCatchSync<T>(fn: () => T): [T, null] | [null, Error] {
  try {
    const data = fn();
    return [data, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}
