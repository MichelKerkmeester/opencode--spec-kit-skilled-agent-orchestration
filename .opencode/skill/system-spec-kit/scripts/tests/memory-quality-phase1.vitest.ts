import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { extractDecisions } from '../extractors/decision-extractor';
import { truncateOnWordBoundary } from '../lib/truncate-on-word-boundary';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_DIR = path.join(TEST_DIR, 'fixtures', 'memory-quality');
const COLLECT_SESSION_DATA_PATH = path.join(TEST_DIR, '..', 'extractors', 'collect-session-data.ts');
const TEMPLATE_PATH = path.join(TEST_DIR, '..', '..', 'templates', 'context_template.md');

interface MemoryQualityFixture {
  specFolder: string;
  sessionSummary: string;
}

function readFixture(name: string): MemoryQualityFixture {
  return JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, name), 'utf8')) as MemoryQualityFixture;
}

describe('F-AC1 — OVERVIEW truncation', () => {
  it('uses the shared helper contract and preserves a clean boundary with a Unicode ellipsis', () => {
    const fixture = readFixture('F-AC1-truncation.json');
    const result = truncateOnWordBoundary(fixture.sessionSummary, 500);
    const keptText = result.slice(0, -1);
    const nextChar = fixture.sessionSummary.charAt(keptText.length);
    const collectSessionDataSource = fs.readFileSync(COLLECT_SESSION_DATA_PATH, 'utf8');

    expect(fixture.sessionSummary.length).toBeGreaterThan(600);
    expect(result.endsWith('…')).toBe(true);
    expect(result.length).toBeLessThanOrEqual(501);
    expect(fixture.sessionSummary.startsWith(keptText)).toBe(true);
    expect(/\s/.test(nextChar)).toBe(true);
    expect(collectSessionDataSource).toContain('truncateOnWordBoundary(data.sessionSummary, 500)');
  });

  it('applies the shared truncation helper to decision-extractor fallback surfaces', async () => {
    const longNarrative = 'The shared helper keeps the decision narrative readable while preserving word boundaries throughout the saved memory output. '
      .repeat(6)
      .trim();
    const expectedSnippet = truncateOnWordBoundary(longNarrative, 200);

    const result = await extractDecisions({
      SPEC_FOLDER: '003-memory-quality-issues',
      observations: [
        {
          type: 'decision',
          title: 'Use the shared truncation helper',
          narrative: longNarrative,
          facts: [],
        },
      ],
      userPrompts: [],
    });

    expect(result.DECISIONS[0]?.OPTIONS[0]?.DESCRIPTION).toBe(expectedSnippet);
    expect(result.DECISIONS[0]?.RATIONALE).toBe(expectedSnippet);
  });
});

describe('F-AC7 — OVERVIEW anchor consistency', () => {
  it('keeps the TOC fragment and OVERVIEW anchor marker aligned on overview without legacy HTML ids', () => {
    const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
    const overviewBlockMatch = template.match(/<!-- ANCHOR:overview -->[\s\S]*?##\s+OVERVIEW[\s\S]*?<!-- \/ANCHOR:overview -->/);

    expect(template).toContain('<!-- ANCHOR:overview -->');
    expect(template).not.toContain('<a id="overview"></a>');
    expect(template).toContain('[OVERVIEW](#overview)');
    expect(overviewBlockMatch).not.toBeNull();
    expect(overviewBlockMatch?.[0]).not.toContain('<!-- ANCHOR:summary -->');
    expect(overviewBlockMatch?.[0]).not.toContain('<!-- /ANCHOR:summary -->');
  });
});
