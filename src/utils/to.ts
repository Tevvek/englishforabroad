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
