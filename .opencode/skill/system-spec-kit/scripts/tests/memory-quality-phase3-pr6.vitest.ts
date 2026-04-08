import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { extractDecisions } from '../extractors/decision-extractor';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_DIR = path.join(TEST_DIR, 'fixtures', 'memory-quality');

interface DecisionFixture {
  specFolder: string;
  sessionSummary?: string;
  keyDecisions?: Array<string | Record<string, unknown>>;
  observations?: Array<{
    type?: string;
    title?: string;
    narrative?: string;
    facts?: unknown[];
  }>;
  userPrompts?: Array<{
    prompt: string;
    timestamp?: string;
  }>;
}

function readFixture(name: string): DecisionFixture {
  return JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, name), 'utf8')) as DecisionFixture;
}

describe('Phase 3 PR-6 decision precedence gate', () => {
  it('F-AC2: preserves authored raw keyDecisions and emits no lexical placeholder titles', async () => {
    const fixture = readFixture('F-AC2-authored-decisions.json');

    const result = await extractDecisions({
      SPEC_FOLDER: fixture.specFolder,
      keyDecisions: fixture.keyDecisions as Array<Record<string, unknown>>,
      observations: fixture.observations ?? [],
      userPrompts: fixture.userPrompts ?? [],
    });

    const titles = result.DECISIONS.map((decision) => decision.TITLE);
    const rationales = result.DECISIONS.map((decision) => decision.RATIONALE);

    expect(result.DECISION_COUNT).toBe(2);
    expect(titles).toEqual([
      'Adopt strict TypeScript config',
      'Use Voyage-4 embeddings',
    ]);
    expect(rationales).toEqual([
      'It keeps the remediation packet compiler-clean while tightening the extractor contract.',
      'It preserves the retrieval-quality target already approved for the packet.',
    ]);
    expect(titles.join('\n')).not.toMatch(/(?:observation|user) decision \d+/i);
  });

  it('preserves existing normalized/manual decision behavior when no raw keyDecisions exist', async () => {
    const result = await extractDecisions({
      SPEC_FOLDER: '003-sanitization-precedence',
      _manualDecisions: [
        {
          decision: 'Keep lexical fallback for degraded payloads',
          rationale: 'Malformed or decision-less inputs still need a non-empty DECISIONS section.',
        },
      ],
      observations: [],
      userPrompts: [
        {
          prompt: 'We decided to keep lexical fallback for degraded payloads.',
        },
      ],
    });

    expect(result.DECISION_COUNT).toBe(1);
    expect(result.DECISIONS[0]?.TITLE).toBe('Keep lexical fallback for degraded payloads');
    expect(result.DECISIONS[0]?.RATIONALE).toBe('Malformed or decision-less inputs still need a non-empty DECISIONS section.');
    expect(result.DECISIONS[0]?.TITLE).not.toMatch(/(?:observation|user) decision \d+/i);
  });

  it('keeps degraded lexical fallback alive when authored decisions are absent', async () => {
    const fixture = readFixture('F-AC2-degraded-fallback.json');

    const result = await extractDecisions({
      SPEC_FOLDER: fixture.specFolder,
      observations: fixture.observations ?? [],
      userPrompts: fixture.userPrompts ?? [],
    });

    const titles = result.DECISIONS.map((decision) => decision.TITLE);

    expect(result.DECISION_COUNT).toBeGreaterThan(0);
    expect(titles).toEqual(
      expect.arrayContaining([
        'observation decision 1',
        'user decision 1',
      ])
    );
  });
});
