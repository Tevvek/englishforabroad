import type { StorageValue } from "unstorage";

import {
  deleteCachedItem,
  getCachedJson,
  getCachedNumber,
  setCachedJson,
  setCachedNumber,
} from "./upstash-kv";

const CACHE_KEY_PREFIX = "v1";

function buildStorageKey(key: string) {
  return `${CACHE_KEY_PREFIX}:${key}`;
}

interface WithCachedNumberOptions {
  key: string;
  ttlSeconds: number;
  load: () => Promise<number>;
}

export async function withCachedNumber({
  key,
  ttlSeconds,
  load,
}: WithCachedNumberOptions) {
  const storageKey = buildStorageKey(key);
  const cachedValue = await getCachedNumber(storageKey);

  if (cachedValue !== null) {
    return cachedValue;
  }

  const freshValue = await load();

  await setCachedNumber(storageKey, freshValue, ttlSeconds);

  return freshValue;
}

interface WithCachedJsonOptions<T extends StorageValue> {
  key: string;
  ttlSeconds: number;
  load: () => Promise<T>;
  isValid?: (value: unknown) => value is T;
}

export async function withCachedJson<T extends StorageValue>({
  key,
  ttlSeconds,
  load,
  isValid,
}: WithCachedJsonOptions<T>) {
  const storageKey = buildStorageKey(key);
  const cachedValue = await getCachedJson<unknown>(storageKey);

  if (cachedValue !== null) {
    if (!isValid || isValid(cachedValue)) {
      return cachedValue as T;
    }
  }

  const freshValue = await load();

  await setCachedJson(storageKey, freshValue, ttlSeconds);

  return freshValue;
}

export async function deleteCachedKey(key: string) {
  await deleteCachedItem(buildStorageKey(key));
}
