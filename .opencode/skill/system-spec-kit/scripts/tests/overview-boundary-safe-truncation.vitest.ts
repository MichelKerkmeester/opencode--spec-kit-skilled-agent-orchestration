import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { reviewPostSaveQuality } from '../core/post-save-review';
import { collectSessionData } from '../extractors/collect-session-data';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const COLLECT_SESSION_DATA_PATH = path.join(TEST_DIR, '..', 'extractors', 'collect-session-data.ts');

describe('overview boundary-safe truncation', () => {
  it('keeps moderately long authored session summaries intact instead of forcing an ellipsis', async () => {
    const sessionSummary = 'Shipped the 014 code graph upgrades runtime lane across detector provenance, blast-radius correctness, hot-file breadcrumbs, edge evidence, and a frozen regression floor. The runtime adds a DetectorProvenance taxonomy to shared-payload, enforces blast-radius depth-cap at BFS traversal time with explicit multi-file unionMode, emits advisory hotFileBreadcrumb entries with low-authority wording, carries edgeEvidenceClass and numericConfidence additively on existing owner payloads without replacing the StructuralTrust envelope, and locks the provenance plus depth expectations behind a scripts-side frozen fixture floor. Strict packet validation passes.';
    const sessionData = await collectSessionData({
      _source: 'file',
      sessionSummary,
      contextType: 'implementation',
    } as never, 'test-packet');

    expect(sessionSummary.length).toBeGreaterThan(500);
    expect(sessionSummary.length).toBeLessThan(800);
    expect(sessionData.SUMMARY).toBe(sessionSummary);
    expect(sessionData.SUMMARY.endsWith('…')).toBe(false);
    expect(sessionData.SUMMARY.endsWith('.')).toBe(true);
  });

  it('falls back to the shared boundary-safe helper for very long summaries', async () => {
    const longSummary = `${'boundary safe overview rendering keeps whole words and avoids broken ellipsis handling. '.repeat(20)}Final sentence stays outside the bounded preview.`;
    const sessionData = await collectSessionData({
      _source: 'file',
      sessionSummary: longSummary,
      contextType: 'implementation',
    } as never, 'test-packet');
    const source = fs.readFileSync(COLLECT_SESSION_DATA_PATH, 'utf8');
    const summary = sessionData.SUMMARY;
    const keptText = summary.slice(0, -1);
    const nextChar = longSummary.charAt(keptText.length);

    expect(longSummary.length).toBeGreaterThan(800);
    expect(source).toContain('renderOverviewSummary(data.sessionSummary, truncateOnWordBoundary(data.sessionSummary, 500))');
    expect(summary.endsWith('…')).toBe(true);
    expect(summary).not.toContain('.…');
    expect(summary).not.toContain('....…');
    expect(longSummary.startsWith(keptText)).toBe(true);
    expect(/\s/.test(nextChar)).toBe(true);
  });

  it('does not raise the D1 reviewer check when the saved overview matches the full payload summary', () => {
    const sessionSummary = 'Shipped the 014 code graph upgrades runtime lane across detector provenance, blast-radius correctness, hot-file breadcrumbs, edge evidence, and a frozen regression floor. The runtime adds a DetectorProvenance taxonomy to shared-payload, enforces blast-radius depth-cap at BFS traversal time with explicit multi-file unionMode, emits advisory hotFileBreadcrumb entries with low-authority wording, carries edgeEvidenceClass and numericConfidence additively on existing owner payloads without replacing the StructuralTrust envelope, and locks the provenance plus depth expectations behind a scripts-side frozen fixture floor. Strict packet validation passes.';
    const rendered = `---
title: "Shipped The 014 Code Graph Upgrades Runtime Lane"
render_quality_score: 1.00
---

## OVERVIEW

${sessionSummary}

<!-- /ANCHOR:overview -->

## DISTINGUISHING EVIDENCE

- Evidence bullet
`;

    const result = reviewPostSaveQuality({
      savedFilePath: path.join(TEST_DIR, 'fixtures', 'post-save-render', 'test-packet', 'memory', 'placeholder.md'),
      content: rendered,
      collectedData: {
        _source: 'file',
        saveMode: 'json',
        sessionSummary,
        renderQualityScore: 1,
        inputCompletenessScore: 0,
      },
      inputMode: 'structured',
    });

    expect(result.issues.some((issue) => issue.checkId === 'D1')).toBe(false);
  });
});
