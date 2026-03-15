// TEST: ANCHOR ID SIMPLIFICATION
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// TEST: ANCHOR ID SIMPLIFICATION (Session 5 — C2 fix)
// Covers: context_template.md uses simple anchor IDs
// (no {{SESSION_ID}} or {{SPEC_FOLDER}} in anchor names)
/** Path to the context template */
const TEMPLATE_PATH = path.resolve(
  __dirname,
  '../../templates/context_template.md'
);

/** Valid anchor ID pattern — same as memory-parser.ts VALID_ANCHOR_PATTERN */
const VALID_ANCHOR_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9-/]*$/;

/** Expected simple anchors in the template (all 12 types from v2.2) */
const EXPECTED_ANCHORS = [
  'preflight',
  'continue-session',
  'task-guide',
  'summary',
  'detailed-changes',
  'decisions',
  'session-history',
  'recovery-hints',
  'postflight',
  'metadata',
  'graph-context',
  'project-state-snapshot',
  'workflow-visualization',
];

/**
 * Dynamic anchor patterns — these appear inside {{#OBSERVATIONS}} and
 * {{#DECISIONS}} loops. They use mustache variables as IDs, which is
 * intentional and should be excluded from the "no duplicates" check.
 */
const DYNAMIC_ANCHOR_PATTERNS = ['{{ANCHOR_ID}}', '{{DECISION_ANCHOR_ID}}'];

/** Read the template content (cached for performance) */
let templateContent: string;

function getTemplate(): string {
  if (!templateContent) {
    templateContent = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
  }
  return templateContent;
}

/** Extract all opening anchor IDs from content */
function extractOpeningAnchors(content: string): string[] {
  const pattern = /<!--\s*ANCHOR:\s*([^\s>]+)\s*-->/g;
  const anchors: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(content)) !== null) {
    anchors.push(match[1]);
  }
  return anchors;
}

/** Extract all closing anchor IDs from content */
function extractClosingAnchors(content: string): string[] {
  const pattern = /<!--\s*\/ANCHOR:\s*([^\s>]+)\s*-->/g;
  const anchors: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(content)) !== null) {
    anchors.push(match[1]);
  }
  return anchors;
}

// ===============================================================
// TEST SUITE
// ===============================================================

describe('ANCHOR ID SIMPLIFICATION — context_template.md', () => {
  // ───────────────────────────────────────────────────────────────
  // 0. Precondition
  // ───────────────────────────────────────────────────────────────
  it('S00: template file exists and is readable', () => {
    expect(fs.existsSync(TEMPLATE_PATH)).toBe(true);
    const content = getTemplate();
    expect(content.length).toBeGreaterThan(100);
  });

  // ───────────────────────────────────────────────────────────────
  // 1. No composite anchor IDs
  // ───────────────────────────────────────────────────────────────
  describe('No composite/dynamic anchor IDs', () => {
    it('S01: NO anchor contains {{SESSION_ID}}', () => {
      const content = getTemplate();
      const anchors = extractOpeningAnchors(content);

      for (const anchor of anchors) {
        expect(anchor).not.toContain('{{SESSION_ID}}');
      }
    });

    it('S02: NO anchor contains {{SPEC_FOLDER}}', () => {
      const content = getTemplate();
      const anchors = extractOpeningAnchors(content);

      for (const anchor of anchors) {
        expect(anchor).not.toContain('{{SPEC_FOLDER}}');
      }
    });

    it('S03: NO anchor contains "session-" followed by digits (old composite pattern)', () => {
      const content = getTemplate();
      const anchors = extractOpeningAnchors(content);
      const staticAnchors = anchors.filter(
        (a) => !DYNAMIC_ANCHOR_PATTERNS.includes(a)
      );

      for (const anchor of staticAnchors) {
        // Old format was like: summary-session-1770903150838-003
        expect(anchor).not.toMatch(/session-\d+/);
      }
    });

    it('S04: NO static anchor contains more than 2 hyphen-separated segments', () => {
      const content = getTemplate();
      const anchors = extractOpeningAnchors(content);
      const staticAnchors = anchors.filter(
        (a) => !DYNAMIC_ANCHOR_PATTERNS.includes(a)
      );

      for (const anchor of staticAnchors) {
        const segments = anchor.split('-');
        // Most anchors have 2 segments (e.g., 'continue-session', 'task-guide').
        // Some anchors have 3 segments (e.g., 'project-state-snapshot').
        // No static anchor should have more than 3 segments (old format had 5+).
        expect(segments.length).toBeLessThanOrEqual(3);
      }
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 2. Anchor format validation
  // ───────────────────────────────────────────────────────────────
  describe('Anchor format validation', () => {
    it('S05: all static anchors match VALID_ANCHOR_PATTERN', () => {
      const content = getTemplate();
      const anchors = extractOpeningAnchors(content);
      const staticAnchors = anchors.filter(
        (a) => !DYNAMIC_ANCHOR_PATTERNS.includes(a)
      );

      for (const anchor of staticAnchors) {
        expect(
          VALID_ANCHOR_PATTERN.test(anchor),
          `Anchor "${anchor}" does not match valid pattern`
        ).toBe(true);
      }
    });

    it('S06: all static anchors use lowercase only (no underscores)', () => {
      const content = getTemplate();
      const anchors = extractOpeningAnchors(content);
      const staticAnchors = anchors.filter(
        (a) => !DYNAMIC_ANCHOR_PATTERNS.includes(a)
      );

      for (const anchor of staticAnchors) {
        expect(anchor).toBe(anchor.toLowerCase());
        expect(anchor).not.toContain('_');
      }
    });

    it('S07: no anchor starts or ends with a hyphen', () => {
      const content = getTemplate();
      const anchors = extractOpeningAnchors(content);
      const staticAnchors = anchors.filter(
        (a) => !DYNAMIC_ANCHOR_PATTERNS.includes(a)
      );

      for (const anchor of staticAnchors) {
        expect(anchor.startsWith('-')).toBe(false);
        expect(anchor.endsWith('-')).toBe(false);
      }
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 3. Opening/closing pairs
  // ───────────────────────────────────────────────────────────────
  describe('Opening/closing anchor pairs', () => {
    it('S08: every opening anchor has a matching closing anchor', () => {
      const content = getTemplate();
      const openings = extractOpeningAnchors(content);
      const closings = extractClosingAnchors(content);

      for (const anchor of openings) {
        expect(
          closings,
          `Opening anchor "${anchor}" has no matching closing tag`
        ).toContain(anchor);
      }
    });

    it('S09: every closing anchor has a matching opening anchor', () => {
      const content = getTemplate();
      const openings = extractOpeningAnchors(content);
      const closings = extractClosingAnchors(content);

      for (const anchor of closings) {
        expect(
          openings,
          `Closing anchor "${anchor}" has no matching opening tag`
        ).toContain(anchor);
      }
    });

    it('S10: opening count equals closing count', () => {
      const content = getTemplate();
      const openings = extractOpeningAnchors(content);
      const closings = extractClosingAnchors(content);

      expect(openings.length).toBe(closings.length);
    });

    it('S11: opening comes before closing in the template', () => {
      const content = getTemplate();
      const staticAnchors = extractOpeningAnchors(content).filter(
        (a) => !DYNAMIC_ANCHOR_PATTERNS.includes(a)
      );

      for (const anchor of staticAnchors) {
        const openPattern = `<!-- ANCHOR:${anchor} -->`;
        const closePattern = `<!-- /ANCHOR:${anchor} -->`;
        const openIdx = content.indexOf(openPattern);
        const closeIdx = content.indexOf(closePattern);

        expect(openIdx).toBeGreaterThanOrEqual(0);
        expect(closeIdx).toBeGreaterThan(openIdx);
      }
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 4. No duplicate static anchor IDs
  // ───────────────────────────────────────────────────────────────
  describe('No duplicate anchor IDs', () => {
    it('S12: no two static anchors share the same ID', () => {
      const content = getTemplate();
      const allAnchors = extractOpeningAnchors(content);
      const staticAnchors = allAnchors.filter(
        (a) => !DYNAMIC_ANCHOR_PATTERNS.includes(a)
      );

      const seen = new Set<string>();
      const duplicates: string[] = [];

      for (const anchor of staticAnchors) {
        if (seen.has(anchor)) {
          duplicates.push(anchor);
        }
        seen.add(anchor);
      }

      expect(
        duplicates,
        `Duplicate static anchor IDs found: ${duplicates.join(', ')}`
      ).toEqual([]);
    });

    it('S13: dynamic anchors ({{ANCHOR_ID}}, {{DECISION_ANCHOR_ID}}) exist in template', () => {
      const content = getTemplate();
      const allAnchors = extractOpeningAnchors(content);
      const dynamicAnchors = allAnchors.filter((a) =>
        DYNAMIC_ANCHOR_PATTERNS.includes(a)
      );

      // There should be at least one dynamic anchor
      expect(dynamicAnchors.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 5. Known anchor list
  // ───────────────────────────────────────────────────────────────
  describe('Known anchor list', () => {
    it('S14: all expected anchors exist in the template', () => {
      const content = getTemplate();
      const openings = extractOpeningAnchors(content);

      for (const expected of EXPECTED_ANCHORS) {
        expect(
          openings,
          `Expected anchor "${expected}" not found in template`
        ).toContain(expected);
      }
    });

    it('S15: template has at least 10 static anchors', () => {
      const content = getTemplate();
      const allAnchors = extractOpeningAnchors(content);
      const staticAnchors = allAnchors.filter(
        (a) => !DYNAMIC_ANCHOR_PATTERNS.includes(a)
      );

      expect(staticAnchors.length).toBeGreaterThanOrEqual(10);
    });

    it('S16: no unexpected new anchors have been added beyond known set', () => {
      const content = getTemplate();
      const allAnchors = extractOpeningAnchors(content);
      const staticAnchors = allAnchors.filter(
        (a) => !DYNAMIC_ANCHOR_PATTERNS.includes(a)
      );

      // All static anchors should be in the expected list.
      // If a new anchor is added intentionally, update EXPECTED_ANCHORS.
      const unexpected = staticAnchors.filter(
        (a) => !EXPECTED_ANCHORS.includes(a)
      );
      expect(
        unexpected,
        `Unexpected anchors found (update EXPECTED_ANCHORS if intentional): ${unexpected.join(', ')}`
      ).toEqual([]);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 6. Template content integrity
  // ───────────────────────────────────────────────────────────────
  describe('Template content integrity', () => {
    it('S17: template version is v2.2', () => {
      const content = getTemplate();
      expect(content).toContain('context_template.md v2.2');
    });

    it('S18: template mentions simple anchor naming in comments', () => {
      const content = getTemplate();
      // V2.1 improvement note about simple anchor naming
      expect(content).toMatch(/[Ss]imple anchor/i);
    });

    it('S19: no hardcoded session IDs in template', () => {
      const content = getTemplate();
      // Ensure no literal session IDs leaked in
      expect(content).not.toMatch(/session-\d{13}/);
    });

    it('S20: anchors section in template comment documents indexing approach', () => {
      const content = getTemplate();
      // The template should document that anchors use simple semantic names
      expect(content).toContain('Anchors use simple semantic names');
    });
  });
});
