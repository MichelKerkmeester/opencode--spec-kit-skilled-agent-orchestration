// ───────────────────────────────────────────────────────────────
// TEST: V13, V14, V12 Validation Rules (lib/validate-memory-quality.ts)
// Phase 003 CHK-027 through CHK-033: YAML syntax, content density,
// status/percentage contradiction, and topical coherence path normalization.
// ───────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { validateMemoryQualityContent } from '../memory/validate-memory-quality';

/* ───────────────────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────────────────────── */

/** Build a minimal valid memory document with real body content. */
function makeMemory(opts: {
  title?: string;
  status?: string;
  percentage?: number;
  specFolder?: string;
  triggerPhrases?: string[];
  extraFrontmatter?: string;
  body?: string;
}): string {
  const lines: string[] = ['---'];
  lines.push(`title: "${opts.title ?? 'Test Memory Document'}"`);
  if (opts.status) lines.push(`status: ${opts.status}`);
  if (opts.percentage !== undefined) lines.push(`percentage: ${opts.percentage}`);
  if (opts.specFolder) lines.push(`spec_folder: ${opts.specFolder}`);
  if (opts.triggerPhrases && opts.triggerPhrases.length > 0) {
    lines.push('trigger_phrases:');
    for (const tp of opts.triggerPhrases) {
      lines.push(`  - "${tp}"`);
    }
  }
  if (opts.extraFrontmatter) lines.push(opts.extraFrontmatter);
  lines.push('---');
  lines.push('');
  lines.push(opts.body ?? 'This is a sufficiently long body text that contains more than fifty non-whitespace characters to pass the content density check easily.');
  return lines.join('\n');
}

/** Build memory with raw frontmatter (for testing malformed YAML). */
function makeRawMemory(frontmatter: string, body: string): string {
  return `---\n${frontmatter}\n---\n\n${body}`;
}

function getRule(result: ReturnType<typeof validateMemoryQualityContent>, ruleId: string) {
  return result.ruleResults.find(r => r.ruleId === ruleId);
}

const LONG_BODY = 'This body text is definitely long enough to pass the content density check because it contains well over fifty non-whitespace characters in the rendered output.';
const SHORT_BODY = '# Hi';

/* ───────────────────────────────────────────────────────────────
   V12 TEMP DIR MANAGEMENT
──────────────────────────────────────────────────────────────── */

const tempDirs: string[] = [];

function createTempSpecFolder(triggerPhrases: string[]): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'v12-test-'));
  tempDirs.push(dir);

  const specContent = [
    '---',
    'title: "Test Spec"',
    'trigger_phrases:',
    ...triggerPhrases.map(tp => `  - "${tp}"`),
    '---',
    '',
    '# Test Spec',
    '',
    'This is a test spec for V12 validation.',
  ].join('\n');

  fs.writeFileSync(path.join(dir, 'spec.md'), specContent, 'utf8');
  return dir;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) fs.rmSync(dir, { recursive: true, force: true });
  }
});

/* ───────────────────────────────────────────────────────────────
   V13: FRONTMATTER YAML INTEGRITY AND CONTENT DENSITY
──────────────────────────────────────────────────────────────── */

describe('V13: frontmatter YAML integrity and content density', () => {

  describe('YAML syntax validation (CHK-027, CHK-028)', () => {

    it('unclosed single-quoted string triggers V13 failure', () => {
      const content = makeRawMemory("title: 'unclosed value", LONG_BODY);
      const result = validateMemoryQualityContent(content);
      const v13 = getRule(result, 'V13');
      expect(v13).toBeDefined();
      expect(v13!.passed).toBe(false);
      expect(v13!.message).toContain('malformed frontmatter');
    });

    it('unclosed double-quoted string triggers V13 failure', () => {
      const content = makeRawMemory('title: "unclosed value', LONG_BODY);
      const result = validateMemoryQualityContent(content);
      const v13 = getRule(result, 'V13');
      expect(v13).toBeDefined();
      expect(v13!.passed).toBe(false);
      expect(v13!.message).toContain('malformed frontmatter');
    });

    it('well-formed frontmatter passes V13', () => {
      const content = makeMemory({ body: LONG_BODY });
      const result = validateMemoryQualityContent(content);
      const v13 = getRule(result, 'V13');
      expect(v13).toBeDefined();
      expect(v13!.passed).toBe(true);
    });
  });

  describe('content density validation (CHK-029, CHK-030)', () => {

    it('body with fewer than 50 non-whitespace chars triggers V13 failure', () => {
      const content = makeMemory({ body: SHORT_BODY });
      const result = validateMemoryQualityContent(content);
      const v13 = getRule(result, 'V13');
      expect(v13).toBeDefined();
      expect(v13!.passed).toBe(false);
      expect(v13!.message).toContain('content density');
    });

    it('body with more than 50 non-whitespace chars passes V13', () => {
      const content = makeMemory({ body: LONG_BODY });
      const result = validateMemoryQualityContent(content);
      const v13 = getRule(result, 'V13');
      expect(v13).toBeDefined();
      expect(v13!.passed).toBe(true);
    });

    it('frontmatter characters do not count toward content density', () => {
      // Large frontmatter but trivially short body
      const hugeFrontmatter = Array.from({ length: 20 }, (_, i) =>
        `field_${i}: "value that is quite long and has lots of characters"`
      ).join('\n');
      const content = makeRawMemory(
        `title: "Big FM"\n${hugeFrontmatter}`,
        SHORT_BODY
      );
      const result = validateMemoryQualityContent(content);
      const v13 = getRule(result, 'V13');
      expect(v13).toBeDefined();
      expect(v13!.passed).toBe(false);
      expect(v13!.message).toContain('content density');
    });
  });
});

/* ───────────────────────────────────────────────────────────────
   V14: STATUS/PERCENTAGE CONTRADICTION
──────────────────────────────────────────────────────────────── */

describe('V14: status/percentage contradiction (CHK-033)', () => {

  it('status=complete + percentage=40 triggers V14 failure', () => {
    const content = makeMemory({ status: 'complete', percentage: 40, body: LONG_BODY });
    const result = validateMemoryQualityContent(content);
    const v14 = getRule(result, 'V14');
    expect(v14).toBeDefined();
    expect(v14!.passed).toBe(false);
    expect(v14!.message).toContain('contradiction');
    expect(v14!.message).toContain('percentage=40');
  });

  it('status=complete + percentage=100 passes V14', () => {
    const content = makeMemory({ status: 'complete', percentage: 100, body: LONG_BODY });
    const result = validateMemoryQualityContent(content);
    const v14 = getRule(result, 'V14');
    expect(v14).toBeDefined();
    expect(v14!.passed).toBe(true);
  });

  it('status=in-progress + percentage=40 passes V14 (no contradiction)', () => {
    const content = makeMemory({ status: 'in-progress', percentage: 40, body: LONG_BODY });
    const result = validateMemoryQualityContent(content);
    const v14 = getRule(result, 'V14');
    expect(v14).toBeDefined();
    expect(v14!.passed).toBe(true);
  });

  it('status=complete without percentage passes V14', () => {
    const content = makeMemory({ status: 'complete', body: LONG_BODY });
    const result = validateMemoryQualityContent(content);
    const v14 = getRule(result, 'V14');
    expect(v14).toBeDefined();
    expect(v14!.passed).toBe(true);
  });
});

/* ───────────────────────────────────────────────────────────────
   V12: TOPICAL COHERENCE WITH PATH NORMALIZATION
──────────────────────────────────────────────────────────────── */

describe('V12: topical coherence with spec_folder path normalization (CHK-031, CHK-032)', () => {

  it('relative spec_folder resolves correctly and finds overlap', () => {
    const specDir = createTempSpecFolder(['widget factory', 'production pipeline']);
    const relativePath = path.relative(process.cwd(), specDir);
    const content = makeMemory({
      specFolder: relativePath,
      triggerPhrases: ['widget factory'],
      body: 'This memory documents the widget factory implementation with detailed notes about production pipeline optimizations.',
    });
    const result = validateMemoryQualityContent(content);
    const v12 = getRule(result, 'V12');
    expect(v12).toBeDefined();
    expect(v12!.passed).toBe(true);
  });

  it('relative spec_folder with zero overlap triggers V12 failure', () => {
    const specDir = createTempSpecFolder(['widget factory', 'production pipeline']);
    const relativePath = path.relative(process.cwd(), specDir);
    const content = makeMemory({
      specFolder: relativePath,
      triggerPhrases: ['unrelated topic'],
      body: 'This memory is about something completely different that has no mention of widgets or pipelines whatsoever.',
    });
    const result = validateMemoryQualityContent(content);
    const v12 = getRule(result, 'V12');
    expect(v12).toBeDefined();
    expect(v12!.passed).toBe(false);
    expect(v12!.message).toContain('V12_TOPICAL_MISMATCH');
  });

  it('absolute spec_folder path works identically', () => {
    const specDir = createTempSpecFolder(['widget factory', 'production pipeline']);
    const content = makeMemory({
      specFolder: specDir, // already absolute
      triggerPhrases: ['widget factory'],
      body: 'This memory documents the widget factory implementation with detailed notes about production pipeline optimizations.',
    });
    const result = validateMemoryQualityContent(content);
    const v12 = getRule(result, 'V12');
    expect(v12).toBeDefined();
    expect(v12!.passed).toBe(true);
  });
});
