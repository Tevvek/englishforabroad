export async function to<T>(
  promise: Promise<T>
): Promise<[Error | null, T | null]> {
  try {
    const result = await promise;
    return [null, result];
  } catch (err) {
    return [err instanceof Error ? err : new Error(String(err)), null];
  }
}

export function toSync<T>(arg: T): [T, null] | [null, Error] {
  try {
    return [arg, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}
