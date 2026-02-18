export function getCreditBalanceCacheKey(userId: string) {
  return `credits:balance:${userId}`;
}

export function getCreditsPageCacheKey(userId: string) {
  return `credits:page:${userId}`;
}
