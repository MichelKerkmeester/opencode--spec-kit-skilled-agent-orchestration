// ───────────────────────────────────────────────────────────────
// TEST: resolveProjectPhase — explicit override + inferred detection
// Phase 002 CHK-028, CHK-029: projectPhase frontmatter propagation.
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import {
  buildProjectStateSnapshot,
  detectSessionCharacteristics,
  resolveProjectPhase,
} from '../extractors/session-extractor';

/* ───────────────────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────────────────────── */

interface ToolCounts {
  Read: number;
  Edit: number;
  Write: number;
  Bash: number;
  Grep: number;
  Glob: number;
  [key: string]: number;
}

interface Observation {
  type?: string;
  title: string;
  narrative: string;
  facts: string[];
  [key: string]: unknown;
}

function makeToolCounts(overrides: Partial<ToolCounts> = {}): ToolCounts {
  return {
    Read: 0,
    Edit: 0,
    Write: 0,
    Bash: 0,
    Grep: 0,
    Glob: 0,
    ...overrides,
  };
}

function makeObservation(overrides: Partial<Observation> = {}): Observation {
  return {
    type: 'implementation',
    title: 'Test observation',
    narrative: 'Tested a code path.',
    facts: [],
    ...overrides,
  };
}

/* ───────────────────────────────────────────────────────────────
   EXPLICIT OVERRIDE TESTS (CHK-028)
──────────────────────────────────────────────────────────────── */

describe('resolveProjectPhase', () => {

  describe('explicit override (CHK-028)', () => {

    it('returns explicit IMPLEMENTATION when caller provides "IMPLEMENTATION"', () => {
      const result = resolveProjectPhase(
        makeToolCounts(),
        [],
        10,
        'IMPLEMENTATION'
      );
      expect(result).toBe('IMPLEMENTATION');
    });

    it('normalizes lowercase to uppercase', () => {
      const result = resolveProjectPhase(
        makeToolCounts(),
        [],
        10,
        'debugging'
      );
      expect(result).toBe('DEBUGGING');
    });

    it('trims whitespace from explicit value', () => {
      const result = resolveProjectPhase(
        makeToolCounts(),
        [],
        10,
        '  REVIEW  '
      );
      expect(result).toBe('REVIEW');
    });

    it('accepts all valid phases', () => {
      const validPhases = ['RESEARCH', 'PLANNING', 'IMPLEMENTATION', 'DEBUGGING', 'REVIEW'];
      for (const phase of validPhases) {
        const result = resolveProjectPhase(makeToolCounts(), [], 10, phase);
        expect(result).toBe(phase);
      }
    });
  });

  /* ───────────────────────────────────────────────────────────────
     FALLBACK DETECTION (CHK-029)
  ──────────────────────────────────────────────────────────────── */

  describe('fallback detection when explicit is null/invalid (CHK-029)', () => {

    it('falls back to detection when explicit is null', () => {
      const result = resolveProjectPhase(
        makeToolCounts({ Read: 10 }),
        [],
        10,
        null
      );
      // With all reads and no writes, should detect RESEARCH
      expect(result).toBe('RESEARCH');
    });

    it('falls back to detection when explicit is invalid string', () => {
      const result = resolveProjectPhase(
        makeToolCounts({ Read: 10 }),
        [],
        10,
        'BANANA'
      );
      expect(result).toBe('RESEARCH');
    });

    it('falls back to detection when explicit is undefined', () => {
      const result = resolveProjectPhase(
        makeToolCounts({ Read: 10 }),
        [],
        10
      );
      expect(result).toBe('RESEARCH');
    });

    it('detects RESEARCH for read-heavy tool counts', () => {
      const result = resolveProjectPhase(
        makeToolCounts({ Read: 15, Grep: 5, Glob: 3 }),
        [],
        10
      );
      expect(result).toBe('RESEARCH');
    });

    it('detects IMPLEMENTATION for write-heavy tool counts', () => {
      const result = resolveProjectPhase(
        makeToolCounts({ Read: 3, Write: 5, Edit: 5, Bash: 2 }),
        [makeObservation()],
        10
      );
      expect(result).toBe('IMPLEMENTATION');
    });

    it('detects PLANNING for decision observations with read-heavy counts', () => {
      const result = resolveProjectPhase(
        makeToolCounts({ Read: 10, Grep: 5, Write: 1 }),
        [makeObservation({ type: 'decision' })],
        10
      );
      expect(result).toBe('PLANNING');
    });

    it('defaults to RESEARCH when all tool counts are zero', () => {
      const result = resolveProjectPhase(
        makeToolCounts(),
        [],
        10
      );
      expect(result).toBe('RESEARCH');
    });
  });

  describe('project state snapshot integration', () => {
    it('honors explicit projectPhase overrides when building the snapshot', () => {
      const snapshot = buildProjectStateSnapshot({
        toolCounts: makeToolCounts({ Read: 10, Grep: 4 }),
        observations: [makeObservation({ type: 'decision' })],
        messageCount: 12,
        FILES: [{ FILE_PATH: 'src/feature.ts', DESCRIPTION: 'Feature work' }],
        SPEC_FILES: [],
        specFolderPath: null,
        explicitProjectPhase: 'IMPLEMENTATION',
      });

      expect(snapshot.projectPhase).toBe('IMPLEMENTATION');
    });
  });

  describe('explicit contextType passthrough', () => {
    it('honors all documented valid contextType overrides', () => {
      const validContextTypes = [
        'implementation',
        'research',
        'debugging',
        'review',
        'planning',
        'decision',
        'architecture',
        'configuration',
        'documentation',
        'general',
      ];

      for (const contextType of validContextTypes) {
        const characteristics = detectSessionCharacteristics(
          [],
          [],
          [],
          null,
          contextType
        );

        expect(characteristics.contextType).toBe(contextType);
      }
    });
  });
});
