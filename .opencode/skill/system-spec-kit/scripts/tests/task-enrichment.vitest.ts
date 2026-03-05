// ---------------------------------------------------------------
// TEST: Task Enrichment Guardrails
// Ensures stateless-only enrichment for generic task labels
// ---------------------------------------------------------------

import { describe, it, expect } from 'vitest';
import { generateContentSlug, isGenericContentTask } from '../utils/slug-utils';
import { shouldEnrichTaskFromSpecTitle } from '../utils/task-enrichment';

describe('isGenericContentTask', () => {
  it('marks known generic task labels as generic', () => {
    const genericTasks = [
      'Development session',
      'Session summary',
      'Session context',
      'Session',
      'Context',
      'Implementation',
      'Work session',
      'Implementation and updates',
    ];

    for (const task of genericTasks) {
      expect(isGenericContentTask(task)).toBe(true);
    }
  });

  it('does not mark specific tasks as generic', () => {
    expect(isGenericContentTask('Generic memory filename fix in stateless mode')).toBe(false);
    expect(isGenericContentTask('Architecture boundary remediation')).toBe(false);
  });
});

describe('shouldEnrichTaskFromSpecTitle', () => {
  it('blocks enrichment in JSON data mode', () => {
    expect(shouldEnrichTaskFromSpecTitle('Development session', 'file', null)).toBe(false);
    expect(shouldEnrichTaskFromSpecTitle('Development session', 'opencode-capture', '/tmp/context.json')).toBe(false);
  });

  it('allows enrichment in stateless mode for generic tasks', () => {
    expect(shouldEnrichTaskFromSpecTitle('Development session', 'opencode-capture', null)).toBe(true);
    expect(shouldEnrichTaskFromSpecTitle('Session context', 'simulation', null)).toBe(true);
  });

  it('skips enrichment for specific tasks even in stateless mode', () => {
    expect(shouldEnrichTaskFromSpecTitle('Architecture boundary remediation', 'opencode-capture', null)).toBe(false);
  });
});

describe('slug outcome guardrail', () => {
  const folderBase = 'hybrid-rag-fusion';
  const genericTask = 'Development session';
  const specTitle = 'Generic Memory Filename Fix in Stateless Mode';

  it('keeps JSON mode behavior unchanged', () => {
    const taskForSlug = shouldEnrichTaskFromSpecTitle(genericTask, 'file', '/tmp/context.json')
      ? specTitle
      : genericTask;
    expect(generateContentSlug(taskForSlug, folderBase)).toBe('hybrid-rag-fusion');
  });

  it('uses spec-derived task in stateless mode', () => {
    const taskForSlug = shouldEnrichTaskFromSpecTitle(genericTask, 'opencode-capture', null)
      ? specTitle
      : genericTask;
    expect(generateContentSlug(taskForSlug, folderBase)).toBe('generic-memory-filename-fix-in-stateless-mode');
  });
});
