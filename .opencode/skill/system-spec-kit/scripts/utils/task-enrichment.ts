// ---------------------------------------------------------------
// MODULE: Task Enrichment
// Shared helpers for memory task title enrichment decisions
// ---------------------------------------------------------------

import { isContaminatedMemoryName, isGenericContentTask, normalizeMemoryNameCandidate, pickBestContentName } from './slug-utils';

function hasJsonDataFile(dataFilePath: string | null | undefined): boolean {
  return typeof dataFilePath === 'string' && dataFilePath.trim().length > 0;
}

export function normalizeSpecTitleForMemory(title: string): string {
  return normalizeMemoryNameCandidate(title);
}

export function shouldEnrichTaskFromSpecTitle(
  task: string,
  source: unknown,
  dataFilePath: string | null | undefined
): boolean {
  if (source === 'file' || hasJsonDataFile(dataFilePath)) {
    return false;
  }

  const normalizedTask = normalizeMemoryNameCandidate(task);
  return isGenericContentTask(normalizedTask) || isContaminatedMemoryName(normalizedTask);
}

export function pickPreferredMemoryTask(
  task: string,
  specTitle: string,
  folderBase: string,
  sessionCandidates: readonly string[] = [],
  allowSpecTitleFallback: boolean = true
): string {
  const candidates = allowSpecTitleFallback
    ? [task, specTitle, ...sessionCandidates, folderBase]
    : [task, ...sessionCandidates, folderBase];

  return pickBestContentName(candidates)
    || normalizeMemoryNameCandidate(folderBase);
}
