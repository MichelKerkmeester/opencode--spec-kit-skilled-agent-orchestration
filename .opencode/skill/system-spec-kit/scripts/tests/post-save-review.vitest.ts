import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { computeReviewScorePenalty, reviewPostSaveQuality } from '../core/post-save-review';

const tempFiles: string[] = [];

afterEach(async () => {
  await Promise.all(tempFiles.splice(0).map((filePath) => fs.rm(filePath, { force: true })));
});

async function writeTempMemoryFile(content: string): Promise<string> {
  const filePath = path.join(os.tmpdir(), `post-save-review-${Date.now()}-${Math.random().toString(16).slice(2)}.md`);
  await fs.writeFile(filePath, content, 'utf8');
  tempFiles.push(filePath);
  return filePath;
}

describe('reviewPostSaveQuality', () => {
  it('passes when saved frontmatter matches the structured payload', async () => {
    const savedFilePath = await writeTempMemoryFile(`---
title: Meaningful implementation session
description: Meaningful implementation session
importance_tier: important
context_type: implementation
trigger_phrases:
  - auth refactor
  - token refresh
---

# Meaningful implementation session

## MEMORY METADATA

\`\`\`yaml
decision_count: 2
\`\`\`
`);

    const result = reviewPostSaveQuality({
      savedFilePath,
      inputMode: 'file',
      collectedData: {
        _source: 'file',
        sessionSummary: 'Meaningful implementation session',
        _manualTriggerPhrases: ['auth refactor', 'token refresh'],
        importanceTier: 'important',
        contextType: 'implementation',
        keyDecisions: ['Decision A', 'Decision B'],
      },
    });

    expect(result).toEqual({ status: 'PASSED', issues: [] });
  });
});

describe('computeReviewScorePenalty', () => {
  it('caps accumulated penalties at -0.30', () => {
    expect(computeReviewScorePenalty([
      { severity: 'HIGH', field: 'title', message: 'bad', fix: 'fix' },
      { severity: 'HIGH', field: 'trigger_phrases', message: 'bad', fix: 'fix' },
      { severity: 'HIGH', field: 'decision_count', message: 'bad', fix: 'fix' },
      { severity: 'MEDIUM', field: 'importance_tier', message: 'bad', fix: 'fix' },
    ])).toBe(-0.3);
  });
});
