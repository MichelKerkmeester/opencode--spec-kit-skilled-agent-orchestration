import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import { detectRelatedDocs } from '../extractors/session-extractor';
import { deriveCanonicalDocPointers } from '../extractors/collect-session-data';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_DIR = path.join(TEST_DIR, 'fixtures', 'post-save-render', 'test-packet');
const TEMP_DIRS: string[] = [];

afterEach(async () => {
  await Promise.all(TEMP_DIRS.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe('canonical sources auto-discovery', () => {
  it('discovers canonical packet docs with relative links and role labels', async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'speckit-canonical-sources-'));
    TEMP_DIRS.push(tempRoot);
    const specFolderPath = path.join(tempRoot, 'test-packet');
    await fs.cp(FIXTURE_DIR, specFolderPath, { recursive: true });

    const docs = await detectRelatedDocs(specFolderPath);
    const canonicalDocs = deriveCanonicalDocPointers(docs as never, {
      contextType: 'implementation',
      preferDecisionRecord: true,
      preferImplementationSummary: true,
      preferReviewReport: true,
      preferResearchReport: false,
    }) as Record<string, unknown>;
    const entries = canonicalDocs.CANONICAL_SOURCE_ENTRIES as Array<Record<string, string>>;

    expect(entries.map((entry) => entry.FILE_NAME)).toEqual([
      'review-report.md',
      'decision-record.md',
      'implementation-summary.md',
      'spec.md',
      'plan.md',
    ]);
    expect(entries.map((entry) => entry.FILE_PATH)).toEqual([
      './review/review-report.md',
      './decision-record.md',
      './implementation-summary.md',
      './spec.md',
      './plan.md',
    ]);
  });
});
