// ---------------------------------------------------------------
// MODULE: Task Enrichment
// Shared helpers for memory task title enrichment decisions
// ---------------------------------------------------------------

import { isGenericContentTask } from './slug-utils';

function hasJsonDataFile(dataFilePath: string | null | undefined): boolean {
  return typeof dataFilePath === 'string' && dataFilePath.trim().length > 0;
}

export function shouldEnrichTaskFromSpecTitle(
  task: string,
  source: unknown,
  dataFilePath: string | null | undefined
): boolean {
  if (source === 'file' || hasJsonDataFile(dataFilePath)) {
    return false;
  }
  return isGenericContentTask(task);
}
