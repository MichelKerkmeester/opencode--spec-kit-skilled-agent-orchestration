import { expect } from 'vitest';

interface TextPayloadResult {
  content: Array<{ text: string }>;
}

export function expectReturnedCountMatchesPayload(
  result: TextPayloadResult,
  returnedResultCount: number,
): void {
  const parsed = JSON.parse(result.content[0].text) as { data?: { results?: unknown[] } };
  expect(parsed.data?.results?.length ?? 0).toBe(returnedResultCount);
}
