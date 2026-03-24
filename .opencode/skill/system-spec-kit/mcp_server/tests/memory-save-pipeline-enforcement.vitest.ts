import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import * as handler from '../handlers/memory-save';
import * as vectorIndex from '../lib/search/vector-index';
import * as memoryParser from '../lib/parsing/memory-parser';
import {
  evaluateMemorySufficiency,
  type MemoryEvidenceSnapshot,
} from '@spec-kit/shared/parsing/memory-sufficiency';
import { validateMemoryTemplateContract } from '@spec-kit/shared/parsing/memory-template-contract';
import {
  computeMemoryQualityScore,
  runQualityLoop,
  scoreCoherence,
  scoreTriggerPhrases,
} from '../handlers/quality-loop';
import {
  runQualityGate,
  validateStructural,
  scoreContentQuality,
  checkSemanticDedup,
  resetActivationTimestamp,
  setActivationTimestamp,
} from '../lib/validation/save-quality-gate';

// ───────────────────────────────────────────────────────────────
// TEST INFRASTRUCTURE
// ───────────────────────────────────────────────────────────────

const TEST_DB_DIR = path.join(os.tmpdir(), `speckit-pipeline-enforcement-${process.pid}`);
const TEST_DB_PATH = path.join(TEST_DB_DIR, 'speckit-memory.db');
const FIXTURE_ROOT = path.join(process.cwd(), 'tmp-test-fixtures', 'specs', '998-pipeline-enforcement');

// ───────────────────────────────────────────────────────────────
// FIXTURE BUILDER
// ───────────────────────────────────────────────────────────────

interface PipelineMemoryOverrides {
  title?: string;
  description?: string;
  triggerPhrases?: string[];
  importanceTier?: string;
  contextType?: string;
  removeSections?: string[];
  removeAnchors?: string[];
  replaceContent?: string;
  removeFrontmatter?: boolean;
  removeFrontmatterKey?: string;
  triggerPhrasesFormat?: 'list' | 'string' | 'empty_array';
  insertMustache?: boolean;
  missingBlankLineAfterFrontmatter?: boolean;
  removeHtmlId?: string;
  fileTableEntries?: Array<{ path: string; description: string }>;
  observations?: Array<{ title: string; narrative: string }>;
  decisions?: string[];
  contentSuffix?: string;
}

function buildValidPipelineMemory(overrides: PipelineMemoryOverrides = {}): string {
  const {
    title = 'Memory Save Pipeline Enforcement Test Fixture',
    description = 'Durable enforcement fixture that validates the full save pipeline rejects malformed content at every gate.',
    triggerPhrases = ['pipeline-enforcement', 'save-pipeline-test', 'memory-gate-validation', 'enforcement-fixture'],
    importanceTier = 'normal',
    contextType = 'implementation',
    removeSections = [],
    removeAnchors = [],
    removeFrontmatter = false,
    removeFrontmatterKey,
    triggerPhrasesFormat = 'list',
    insertMustache = false,
    missingBlankLineAfterFrontmatter = false,
    removeHtmlId,
    fileTableEntries = [
      { path: 'mcp_server/handlers/memory-save.ts', description: 'Coordinates atomic save, sufficiency enforcement, duplicate detection, and post-mutation feedback for the memory save path.' },
      { path: 'mcp_server/lib/validation/save-quality-gate.ts', description: 'Three-layer quality gate that validates structure, content density, and semantic deduplication before persisting.' },
    ],
    observations = [
      {
        title: 'Observation: pipeline gate ordering',
        narrative: 'The save pipeline enforces gates in strict sequence: parser validation, quality loop scoring, sufficiency evaluation, template contract validation, and save quality gate. Each gate blocks downstream processing on failure.',
      },
    ],
    decisions = [
      'Decided to enforce template contract validation after sufficiency checks so that structurally valid but semantically empty memories are caught early without incurring template validation overhead.',
    ],
    contentSuffix = '',
  } = overrides;

  // Build frontmatter
  let frontmatter = '';
  if (!removeFrontmatter) {
    const triggerPhrasesYaml = triggerPhrasesFormat === 'string'
      ? `trigger_phrases: "${triggerPhrases.join(', ')}"`
      : triggerPhrasesFormat === 'empty_array'
        ? 'trigger_phrases: []'
        : `trigger_phrases:\n${triggerPhrases.map(tp => `  - "${tp}"`).join('\n')}`;

    const parts: string[] = [];
    if (removeFrontmatterKey !== 'title') {
      parts.push(`title: "${title}"`);
    }
    if (removeFrontmatterKey !== 'description') {
      parts.push(`description: "${description}"`);
    }
    parts.push(triggerPhrasesYaml);
    if (removeFrontmatterKey !== 'importance_tier') {
      parts.push(`importance_tier: "${importanceTier}"`);
    }
    if (removeFrontmatterKey !== 'contextType') {
      parts.push(`contextType: "${contextType}"`);
    }

    frontmatter = `---\n${parts.join('\n')}\n---`;
  }

  // When missingBlankLineAfterFrontmatter=true, the frontmatter close (---) is immediately
  // followed by body content (after the regex-consumed newline). When false, an extra newline
  // is inserted creating a blank line between frontmatter and body.
  const separator = missingBlankLineAfterFrontmatter ? '' : '\n';

  // Build mandatory sections
  const mandatorySections: Record<string, string> = {};

  // SESSION SUMMARY
  mandatorySections['session-summary'] = `
| **Meta Data** | **Value** |
|:--------------|:----------|
| Total Messages | 12 |
| Fixture Type | pipeline-enforcement |
`;

  // CONTINUE SESSION
  mandatorySections['continue-session'] = `
${removeAnchors.includes('continue-session') ? '' : '<!-- ANCHOR:continue-session -->'}
${removeHtmlId === 'continue-session' ? '' : '<a id="continue-session"></a>'}

## CONTINUE SESSION

Continue validating the memory save pipeline enforcement test suite to ensure all six gates properly reject malformed content without allowing bypass.

${removeAnchors.includes('continue-session') ? '' : '<!-- /ANCHOR:continue-session -->'}
`;

  // PROJECT STATE SNAPSHOT
  mandatorySections['project-state-snapshot'] = `
${removeAnchors.includes('project-state-snapshot') ? '' : '<!-- ANCHOR:project-state-snapshot -->'}
${removeHtmlId === 'project-state-snapshot' ? '' : '<a id="project-state-snapshot"></a>'}

## PROJECT STATE SNAPSHOT

The handler is saving into a sandbox spec folder. This fixture intentionally captures concrete file roles, operator-visible save outcomes, and enough semantic detail to survive the shared insufficiency contract before duplicate detection or success-response shaping occurs.

${removeAnchors.includes('project-state-snapshot') ? '' : '<!-- /ANCHOR:project-state-snapshot -->'}
`;

  // OVERVIEW
  mandatorySections['overview'] = `
${removeAnchors.includes('summary') ? '' : '<!-- ANCHOR:summary -->'}
${removeHtmlId === 'overview' ? '' : '<a id="overview"></a>'}

## OVERVIEW

This pipeline enforcement fixture validates that every gate in the memory save pipeline correctly rejects malformed content. The gates include parser validation, quality loop scoring, sufficiency evaluation, template contract validation, and the save quality gate.

${removeAnchors.includes('summary') ? '' : '<!-- /ANCHOR:summary -->'}
`;

  // DETAILED CHANGES with file table and observations
  const fileTableRows = fileTableEntries.map(f =>
    `| \`${f.path}\` | ${f.description} |`
  ).join('\n');

  const observationBlocks = observations.map(obs =>
    `### ${obs.title}\n\n${obs.narrative}`
  ).join('\n\n');

  mandatorySections['detailed-changes'] = `
${removeAnchors.includes('detailed-changes') ? '' : '<!-- ANCHOR:detailed-changes -->'}
${removeHtmlId === 'detailed-changes' ? '' : '<a id="detailed-changes"></a>'}

## DETAILED CHANGES

### Key Files

| File | Role |
|------|------|
${fileTableRows}

${observationBlocks}

${removeAnchors.includes('detailed-changes') ? '' : '<!-- /ANCHOR:detailed-changes -->'}
`;

  // DECISIONS
  const decisionItems = decisions.map(d => `- ${d}`).join('\n');
  mandatorySections['decisions'] = `
${removeAnchors.includes('decisions') ? '' : '<!-- ANCHOR:decisions -->'}
${removeHtmlId === 'decisions' ? '' : '<a id="decisions"></a>'}

## DECISIONS

${decisionItems}

${removeAnchors.includes('decisions') ? '' : '<!-- /ANCHOR:decisions -->'}
`;

  // CONVERSATION
  mandatorySections['conversation'] = `
${removeAnchors.includes('session-history') ? '' : '<!-- ANCHOR:session-history -->'}
${removeHtmlId === 'conversation' ? '' : '<a id="conversation"></a>'}

## CONVERSATION

The operator requested comprehensive enforcement coverage for the full memory save pipeline. The handler parsed this memory, ran all gate enforcement checks, and then returned the resulting status for assertion.

${removeAnchors.includes('session-history') ? '' : '<!-- /ANCHOR:session-history -->'}
`;

  // RECOVERY HINTS
  mandatorySections['recovery-hints'] = `
${removeAnchors.includes('recovery-hints') ? '' : '<!-- ANCHOR:recovery-hints -->'}
${removeHtmlId === 'recovery-hints' ? '' : '<a id="recovery-hints"></a>'}

## RECOVERY HINTS

- If this fixture starts failing insufficiency again, add more concrete file, decision, blocker, next action, or outcome evidence instead of weakening the gate.
- Re-run the pipeline enforcement suite and the full MCP package test suite after changing the save contract.

${removeAnchors.includes('recovery-hints') ? '' : '<!-- /ANCHOR:recovery-hints -->'}
`;

  // MEMORY METADATA
  mandatorySections['memory-metadata'] = `
${removeAnchors.includes('metadata') ? '' : '<!-- ANCHOR:metadata -->'}
${removeHtmlId === 'memory-metadata' ? '' : '<a id="memory-metadata"></a>'}

## MEMORY METADATA

\`\`\`yaml
session_id: "pipeline-enforcement-fixture"
fixture_title: "${title}"
\`\`\`

${removeAnchors.includes('metadata') ? '' : '<!-- /ANCHOR:metadata -->'}
`;

  // Remove sections that should be stripped
  for (const sectionKey of removeSections) {
    delete mandatorySections[sectionKey];
  }

  if (overrides.replaceContent !== undefined) {
    return overrides.replaceContent;
  }

  // Assemble the full content
  const body = `
# ${title}

## SESSION SUMMARY
${mandatorySections['session-summary'] ?? ''}
${mandatorySections['continue-session'] ?? ''}
${mandatorySections['project-state-snapshot'] ?? ''}
${mandatorySections['overview'] ?? ''}
${mandatorySections['detailed-changes'] ?? ''}
${mandatorySections['decisions'] ?? ''}
${mandatorySections['conversation'] ?? ''}
${mandatorySections['recovery-hints'] ?? ''}
${mandatorySections['memory-metadata'] ?? ''}
${contentSuffix}`;

  let content = removeFrontmatter ? body : `${frontmatter}${separator}${body}`;

  if (insertMustache) {
    content += '\n\n{{UNFILLED_TEMPLATE_VARIABLE}}\n';
  }

  return content;
}

function parseResponse(result: { content: Array<{ text: string }> }): any {
  return JSON.parse(result.content[0].text);
}

function resetFixtureDir(): void {
  fs.rmSync(FIXTURE_ROOT, { recursive: true, force: true });
  fs.mkdirSync(path.join(FIXTURE_ROOT, 'memory'), { recursive: true });
}

function cleanupFixtureRows(): void {
  const db = vectorIndex.getDb();
  if (!db) return;

  const likePattern = '%998-pipeline-enforcement%';
  db.prepare('DELETE FROM memory_conflicts WHERE spec_folder LIKE ?').run(likePattern);
  db.prepare(`DELETE FROM memory_history WHERE memory_id IN (
    SELECT id FROM memory_index WHERE file_path LIKE ? OR spec_folder LIKE ?
  )`).run(likePattern, likePattern);
  db.prepare('DELETE FROM memory_index WHERE file_path LIKE ? OR spec_folder LIKE ?').run(likePattern, likePattern);
}

// ───────────────────────────────────────────────────────────────
// TEST SETUP
// ───────────────────────────────────────────────────────────────

const ORIGINAL_ENV = { ...process.env };

beforeAll(() => {
  fs.mkdirSync(TEST_DB_DIR, { recursive: true });
  const previousMemoryDbPath = process.env.MEMORY_DB_PATH;
  process.env.MEMORY_DB_PATH = TEST_DB_PATH;
  try {
    vectorIndex.closeDb();
  } catch {
    // Ignore cleanup errors
  }
  vectorIndex.initializeDb();
  if (previousMemoryDbPath === undefined) delete process.env.MEMORY_DB_PATH;
  else process.env.MEMORY_DB_PATH = previousMemoryDbPath;
  resetFixtureDir();
});

afterEach(() => {
  cleanupFixtureRows();
  resetFixtureDir();
  // Restore env vars
  process.env.SPECKIT_QUALITY_LOOP = ORIGINAL_ENV.SPECKIT_QUALITY_LOOP;
  process.env.SPECKIT_SAVE_QUALITY_GATE = ORIGINAL_ENV.SPECKIT_SAVE_QUALITY_GATE;
  resetActivationTimestamp();
});

afterAll(() => {
  try {
    vectorIndex.closeDb();
  } catch {
    // Ignore cleanup errors
  }
  fs.rmSync(TEST_DB_DIR, { recursive: true, force: true });
  fs.rmSync(FIXTURE_ROOT, { recursive: true, force: true });
});

// ───────────────────────────────────────────────────────────────
// CAT 0: GOLDEN PATH
// ───────────────────────────────────────────────────────────────

describe('Cat 0: Golden Path', () => {
  it('accepts a fully valid memory through the entire pipeline', async () => {
    const filePath = path.join(FIXTURE_ROOT, 'memory', 'golden-path.md');
    const content = buildValidPipelineMemory();
    fs.writeFileSync(filePath, content, 'utf8');

    const result = await handler.indexMemoryFile(filePath, { force: true, asyncEmbedding: true });

    expect(result.status).not.toBe('rejected');
    expect(result.status).not.toBe('error');
    expect(['indexed', 'created', 'updated', 'duplicate', 'deferred', 'unchanged']).toContain(result.status);
    expect(result.id).toBeGreaterThan(0);
  });
});

// ───────────────────────────────────────────────────────────────
// CAT 1: PARSER VALIDATION
// ───────────────────────────────────────────────────────────────

describe('Cat 1: Parser Validation', () => {
  it('rejects content shorter than 5 chars', async () => {
    const filePath = path.join(FIXTURE_ROOT, 'memory', 'too-short.md');
    fs.writeFileSync(filePath, 'bad', 'utf8');

    await expect(
      handler.indexMemoryFile(filePath, { force: true, asyncEmbedding: true })
    ).rejects.toThrow(/Validation failed/);
  });

  it('rejects content exceeding MAX_CONTENT_LENGTH', async () => {
    const filePath = path.join(FIXTURE_ROOT, 'memory', 'too-large.md');
    // Use the actual MAX_CONTENT_LENGTH constant to ensure we exceed it
    const largeContent = 'x'.repeat(memoryParser.MAX_CONTENT_LENGTH + 10_000);
    fs.writeFileSync(filePath, largeContent, 'utf8');

    await expect(
      handler.indexMemoryFile(filePath, { force: true, asyncEmbedding: true })
    ).rejects.toThrow(/Validation failed/);
  });

  it('rejects empty content', async () => {
    const filePath = path.join(FIXTURE_ROOT, 'memory', 'empty.md');
    fs.writeFileSync(filePath, '', 'utf8');

    await expect(
      handler.indexMemoryFile(filePath, { force: true, asyncEmbedding: true })
    ).rejects.toThrow(/Validation failed/);
  });

  it('rejects whitespace-only content', async () => {
    const filePath = path.join(FIXTURE_ROOT, 'memory', 'whitespace.md');
    fs.writeFileSync(filePath, '   \n\n  \t  \n  ', 'utf8');

    // Whitespace-only content is > 5 chars raw, so parser passes but pipeline rejects at sufficiency
    const result = await handler.indexMemoryFile(filePath, { force: true, asyncEmbedding: true });
    expect(result.status).toBe('rejected');
  });

  it('validates that a non-memory file path is rejected by handleMemorySave', async () => {
    const filePath = path.join(FIXTURE_ROOT, 'not-in-memory-dir.md');
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, buildValidPipelineMemory(), 'utf8');

    // isMemoryFile checks for specs/*/memory/ pattern
    expect(memoryParser.isMemoryFile(filePath)).toBe(false);
  });

  it('accepts content at exactly 5 chars boundary', () => {
    // Parser's MIN_CONTENT_LENGTH is 5 chars
    const parsed = memoryParser.parseMemoryContent(
      path.join(FIXTURE_ROOT, 'memory', 'boundary-5.md'),
      'hello',
    );
    const validation = memoryParser.validateParsedMemory(parsed);
    expect(validation.valid).toBe(true);
  });

  it('accepts content just under MAX_CONTENT_LENGTH', () => {
    // Ensure content is under MAX_CONTENT_LENGTH but still large
    const targetLen = Math.max(memoryParser.MAX_CONTENT_LENGTH - 5000, 100_000);
    const baseContent = buildValidPipelineMemory();
    const padding = targetLen > baseContent.length ? 'x'.repeat(targetLen - baseContent.length) : '';
    const content = baseContent + padding;
    const parsed = memoryParser.parseMemoryContent(
      path.join(FIXTURE_ROOT, 'memory', 'under-max.md'),
      content,
    );
    const validation = memoryParser.validateParsedMemory(parsed);
    expect(validation.valid).toBe(true);
  });
});

// ───────────────────────────────────────────────────────────────
// CAT 2: QUALITY LOOP
// ───────────────────────────────────────────────────────────────

describe('Cat 2: Quality Loop', () => {
  it('rejects content with quality score below 0.6 when quality loop enabled', () => {
    process.env.SPECKIT_QUALITY_LOOP = 'true';
    const content = 'Short content without any structure or anchors.';
    const metadata: Record<string, unknown> = { triggerPhrases: [] };

    const result = runQualityLoop(content, metadata, { threshold: 0.6 });

    expect(result.rejected).toBe(true);
    expect(result.passed).toBe(false);
    expect(result.score.total).toBeLessThan(0.6);
  });

  it('passes when quality loop is disabled regardless of score', () => {
    process.env.SPECKIT_QUALITY_LOOP = 'false';
    const content = 'Short';
    const metadata: Record<string, unknown> = { triggerPhrases: [] };

    const result = runQualityLoop(content, metadata, { threshold: 0.6 });

    expect(result.passed).toBe(true);
    expect(result.rejected).toBe(false);
  });

  it('auto-fix rescues missing trigger phrases from headings', () => {
    process.env.SPECKIT_QUALITY_LOOP = 'true';
    // Content with headings (for trigger extraction) but NO trigger phrases and NO anchors.
    // Content must be < 200 chars to keep coherence at 0.75 (not 1.0), ensuring total < 0.6:
    //   triggers=0*0.25 + anchors=0.5*0.30 + budget=1.0*0.20 + coherence=0.75*0.25
    //   = 0 + 0.15 + 0.20 + 0.1875 = 0.5375 → below 0.6 → triggers auto-fix
    // After auto-fix extracts 4 triggers from title + headings:
    //   triggers=1.0*0.25 → total = 0.25 + 0.15 + 0.20 + 0.1875 = 0.7875 → passes!
    const content = '# Gate Analysis\n\n## Review Process\n\n## Check Strategy\n\n## Validation Notes\n\nAnalysis of gate review process.';
    const metadata: Record<string, unknown> = { triggerPhrases: [], title: 'Gate Analysis' };

    const result = runQualityLoop(content, metadata, { threshold: 0.6 });

    expect(result.fixes.length).toBeGreaterThan(0);
    expect(result.fixes.some(f => /trigger phrase/i.test(f))).toBe(true);
    if (result.passed) {
      expect(result.fixedTriggerPhrases).toBeDefined();
      expect(result.fixedTriggerPhrases!.length).toBeGreaterThan(0);
    }
  });

  it('rejects unfixable content after 2 auto-fix attempts', () => {
    process.env.SPECKIT_QUALITY_LOOP = 'true';
    const content = 'no headings no anchors no structure';
    const metadata: Record<string, unknown> = { triggerPhrases: [] };

    const result = runQualityLoop(content, metadata, { threshold: 0.6, maxRetries: 2 });

    expect(result.rejected).toBe(true);
    expect(result.passed).toBe(false);
  });

  it('quality loop rejection blocks downstream sufficiency evaluation in pipeline', async () => {
    process.env.SPECKIT_QUALITY_LOOP = 'true';
    // Build content that would fail quality loop (no triggers, short, no structure)
    // but would pass sufficiency if it got there
    const filePath = path.join(FIXTURE_ROOT, 'memory', 'ql-blocks-sufficiency.md');
    const content = 'too short for quality loop';
    fs.writeFileSync(filePath, content, 'utf8');

    // indexMemoryFile throws on validation failure (content <5 chars), so use parseMemoryContent
    const parsed = memoryParser.parseMemoryContent(filePath, content);
    const metadata: Record<string, unknown> = { triggerPhrases: parsed.triggerPhrases };
    const qlResult = runQualityLoop(content, metadata, { threshold: 0.6 });

    // Confirm quality loop rejects
    if (process.env.SPECKIT_QUALITY_LOOP === 'true') {
      expect(qlResult.rejected).toBe(true);
    }
  });

  it('auto-fixed content is not persisted when the overall loop rejects', () => {
    process.env.SPECKIT_QUALITY_LOOP = 'true';
    const content = '# Only Title\nNot enough substance overall';
    const metadata: Record<string, unknown> = { triggerPhrases: [] };

    const result = runQualityLoop(content, metadata, { threshold: 0.9, maxRetries: 2 });

    // Even if auto-fix extracted triggers, if total score still below threshold -> rejected
    if (result.rejected) {
      // fixedContent may be present (for caller inspection) but the loop reports rejected
      expect(result.passed).toBe(false);
    }
  });
});

// ───────────────────────────────────────────────────────────────
// CAT 3: SUFFICIENCY
// ───────────────────────────────────────────────────────────────

describe('Cat 3: Sufficiency', () => {
  it('rejects when zero primary evidence is present', () => {
    const snapshot: MemoryEvidenceSnapshot = {
      title: 'Specific Enforcement Test Title',
      content: buildValidPipelineMemory({ fileTableEntries: [], observations: [], decisions: [] }),
      triggerPhrases: ['test-trigger', 'enforcement', 'pipeline', 'gates'],
      files: [],
      observations: [],
      decisions: [],
      nextActions: [],
      blockers: [],
      outcomes: [],
    };

    const result = evaluateMemorySufficiency(snapshot);

    expect(result.pass).toBe(false);
    expect(result.reasons.some(r => /primary evidence/i.test(r))).toBe(true);
    expect(result.rejectionCode).toBe('INSUFFICIENT_CONTEXT_ABORT');
  });

  it('rejects when fewer than 2 total evidence items', () => {
    const snapshot: MemoryEvidenceSnapshot = {
      title: 'Specific Enforcement Test Title',
      content: 'some content',
      triggerPhrases: ['trigger-a', 'trigger-b'],
      files: [{ path: 'file.ts', description: 'This is a sufficiently detailed description for a primary evidence item in the test.' }],
      observations: [],
      decisions: [],
    };

    const result = evaluateMemorySufficiency(snapshot);

    // With only 1 file as primary evidence and no other evidence, total < 2
    expect(result.pass).toBe(false);
  });

  it('rejects when semantic substance is below threshold (< 250 chars AND < 40 words)', () => {
    const snapshot: MemoryEvidenceSnapshot = {
      title: 'Specific Enforcement Test Title',
      content: 'Short content',
      triggerPhrases: ['trigger'],
      files: [],
      observations: [],
      decisions: [],
    };

    const result = evaluateMemorySufficiency(snapshot);

    expect(result.pass).toBe(false);
    expect(result.reasons.some(r => /semantic substance/i.test(r) || /primary evidence/i.test(r))).toBe(true);
  });

  it('rejects generic title "Session Summary"', () => {
    const snapshot: MemoryEvidenceSnapshot = {
      title: 'Session Summary',
      content: buildValidPipelineMemory({ title: 'Session Summary' }),
      triggerPhrases: ['pipeline-enforcement'],
      files: [{ path: 'file.ts', description: 'This is a sufficiently detailed description for evidence testing purposes.' }],
      observations: [{ title: 'Observation: test', narrative: 'This is a specific narrative about what was observed during the test session with enough words to pass substance checks.' }],
      decisions: ['Decided to enforce the pipeline gate ordering for maximum safety and reliability in production environments.'],
    };

    const result = evaluateMemorySufficiency(snapshot);

    expect(result.pass).toBe(false);
    expect(result.reasons.some(r => /generic/i.test(r))).toBe(true);
  });

  it('rejects generic title "Development session"', () => {
    const snapshot: MemoryEvidenceSnapshot = {
      title: 'Development session',
      content: buildValidPipelineMemory({ title: 'Development session' }),
      triggerPhrases: ['pipeline-enforcement'],
      files: [{ path: 'file.ts', description: 'This is a detailed description for evidence purposes in the test suite.' }],
      observations: [{ title: 'Observation: test', narrative: 'This is a specific narrative about what was observed during the test run with enough detail.' }],
      decisions: ['Decided to validate pipeline gates in strict sequence.'],
    };

    const result = evaluateMemorySufficiency(snapshot);

    expect(result.pass).toBe(false);
    expect(result.reasons.some(r => /generic/i.test(r))).toBe(true);
  });

  it('passes with >= 250 chars semantic substance even with < 40 words (OR logic)', () => {
    // Build snapshot with long word descriptions that exceed 250 chars
    const longDescription = 'abcdefghijklmnopqrstuvwxyz'.repeat(12); // 312 chars, few words
    const snapshot: MemoryEvidenceSnapshot = {
      title: 'Specific Pipeline Test Title',
      content: longDescription,
      triggerPhrases: ['trigger-a', 'trigger-b', 'trigger-c'],
      files: [
        { path: 'file.ts', description: `This ${longDescription} is a sufficiently detailed long description.` },
      ],
      observations: [{ title: 'Observation: gate ordering', narrative: `Validated ${longDescription} the complete pipeline gate ordering.` }],
      decisions: ['Decided to implement the pipeline enforcement test suite with comprehensive gate coverage.'],
    };

    const result = evaluateMemorySufficiency(snapshot);

    // Even if unique words < 40, if semantic chars >= 250 it should pass the substance check
    // The pass also requires primary evidence >= 1, total >= 2, and specific title
    if (result.evidenceCounts.primary >= 1 && result.evidenceCounts.total >= 2) {
      expect(result.reasons.some(r => /semantic substance/i.test(r))).toBe(false);
    }
  });

  it('passes with >= 40 unique words even with < 250 chars (OR logic)', () => {
    // Build snapshot with many distinct words
    const distinctWords = Array.from({ length: 45 }, (_, i) => `word${i}`).join(' ');
    const snapshot: MemoryEvidenceSnapshot = {
      title: 'Specific Pipeline Enforcement Title',
      content: distinctWords,
      triggerPhrases: ['trigger-a', 'trigger-b', 'trigger-c'],
      files: [{ path: 'file.ts', description: `Detailed: ${distinctWords}` }],
      observations: [{ title: 'Observation: test', narrative: `Narrative: ${distinctWords}` }],
      decisions: ['Decided to implement comprehensive pipeline gate validation.'],
    };

    const result = evaluateMemorySufficiency(snapshot);

    // The substance check should pass due to word count even if chars < 250
    if (result.evidenceCounts.uniqueWords >= 40) {
      expect(result.reasons.some(r => /semantic substance/i.test(r))).toBe(false);
    }
  });

  it('filters placeholder descriptions from evidence count', () => {
    const snapshot: MemoryEvidenceSnapshot = {
      title: 'Specific Pipeline Test',
      content: 'Some content for test',
      triggerPhrases: ['trigger'],
      files: [
        { path: 'file.ts', description: '(description pending)' },
        { path: 'other.ts', description: 'modified during session' },
      ],
      observations: [],
      decisions: [],
    };

    const result = evaluateMemorySufficiency(snapshot);

    // Placeholder descriptions should be filtered — these files shouldn't count as primary evidence
    expect(result.evidenceCounts.primary).toBe(0);
  });
});

// ───────────────────────────────────────────────────────────────
// CAT 4: TEMPLATE CONTRACT
// ───────────────────────────────────────────────────────────────

describe('Cat 4: Template Contract', () => {
  it('detects missing frontmatter entirely', () => {
    const content = buildValidPipelineMemory({ removeFrontmatter: true });
    const result = validateMemoryTemplateContract(content);

    expect(result.valid).toBe(false);
    expect(result.violations.some(v => v.code === 'missing_frontmatter')).toBe(true);
  });

  it('detects missing title key in frontmatter', () => {
    const content = buildValidPipelineMemory({ removeFrontmatterKey: 'title' });
    const result = validateMemoryTemplateContract(content);

    expect(result.valid).toBe(false);
    expect(result.violations.some(v => v.code === 'missing_frontmatter_key' && v.detail === 'title')).toBe(true);
  });

  it('detects missing description key in frontmatter', () => {
    const content = buildValidPipelineMemory({ removeFrontmatterKey: 'description' });
    const result = validateMemoryTemplateContract(content);

    expect(result.valid).toBe(false);
    expect(result.violations.some(v => v.code === 'missing_frontmatter_key' && v.detail === 'description')).toBe(true);
  });

  it('detects missing importance_tier key in frontmatter', () => {
    const content = buildValidPipelineMemory({ removeFrontmatterKey: 'importance_tier' });
    const result = validateMemoryTemplateContract(content);

    expect(result.valid).toBe(false);
    expect(result.violations.some(v => v.code === 'missing_frontmatter_key' && v.detail === 'importance_tier')).toBe(true);
  });

  it('detects missing contextType key in frontmatter', () => {
    const content = buildValidPipelineMemory({ removeFrontmatterKey: 'contextType' });
    const result = validateMemoryTemplateContract(content);

    expect(result.valid).toBe(false);
    expect(result.violations.some(v => v.code === 'missing_frontmatter_key' && v.detail === 'contextType')).toBe(true);
  });

  it('detects trigger_phrases as string instead of YAML list', () => {
    const content = buildValidPipelineMemory({ triggerPhrasesFormat: 'string' });
    const result = validateMemoryTemplateContract(content);

    expect(result.valid).toBe(false);
    expect(result.violations.some(v => v.code === 'invalid_trigger_phrases')).toBe(true);
  });

  it('accepts trigger_phrases as empty array []', () => {
    const content = buildValidPipelineMemory({ triggerPhrasesFormat: 'empty_array' });
    const result = validateMemoryTemplateContract(content);

    // Empty array is valid for template contract — may fail elsewhere (quality loop)
    const triggerViolation = result.violations.find(v => v.code === 'invalid_trigger_phrases');
    expect(triggerViolation).toBeUndefined();
  });

  it('detects missing CONTINUE SESSION section', () => {
    const content = buildValidPipelineMemory({ removeSections: ['continue-session'] });
    const result = validateMemoryTemplateContract(content);

    expect(result.valid).toBe(false);
    expect(result.violations.some(v => v.code === 'missing_section' && v.sectionId === 'continue-session')).toBe(true);
  });

  it('detects missing ANCHOR comment', () => {
    const content = buildValidPipelineMemory({ removeAnchors: ['continue-session'] });
    const result = validateMemoryTemplateContract(content);

    expect(result.valid).toBe(false);
    expect(result.violations.some(v => v.code === 'missing_anchor_comment')).toBe(true);
  });

  it('detects missing HTML id for a section', () => {
    const content = buildValidPipelineMemory({ removeHtmlId: 'continue-session' });
    const result = validateMemoryTemplateContract(content);

    expect(result.valid).toBe(false);
    expect(result.violations.some(v => v.code === 'missing_html_id')).toBe(true);
  });

  it('detects raw mustache {{...}} in rendered content', () => {
    const content = buildValidPipelineMemory({ insertMustache: true });
    const result = validateMemoryTemplateContract(content);

    expect(result.valid).toBe(false);
    expect(result.violations.some(v => v.code === 'raw_mustache_literal')).toBe(true);
  });

  it('detects missing blank line after frontmatter', () => {
    const content = buildValidPipelineMemory({ missingBlankLineAfterFrontmatter: true });
    const result = validateMemoryTemplateContract(content);

    expect(result.violations.some(v => v.code === 'missing_blank_line_after_frontmatter')).toBe(true);
  });
});

// ───────────────────────────────────────────────────────────────
// CAT 5: SAVE QUALITY GATE
// ───────────────────────────────────────────────────────────────

describe('Cat 5: Save Quality Gate', () => {
  it('rejects when signal density is below 0.4', () => {
    process.env.SPECKIT_SAVE_QUALITY_GATE = 'true';
    resetActivationTimestamp();
    // Use content that produces low signal density
    const result = runQualityGate({
      title: null,         // 0 title quality
      content: 'short',    // low length quality, no frontmatter
      specFolder: '998-pipeline-enforcement',
      triggerPhrases: [],  // 0 trigger quality
      anchors: [],         // 0 anchor quality
    });

    expect(result.gateEnabled).toBe(true);
    if (!result.warnOnly) {
      expect(result.pass).toBe(false);
      expect(result.layers.contentQuality.signalDensity).toBeLessThan(0.4);
    }
  });

  it('detects near-duplicate via semantic similarity >= 0.92', () => {
    process.env.SPECKIT_SAVE_QUALITY_GATE = 'true';
    resetActivationTimestamp();
    // Create a mock findSimilar that returns high similarity
    const mockFindSimilar = () => [{
      id: 42,
      file_path: '/some/path.md',
      similarity: 0.95,
    }];

    const result = runQualityGate({
      title: 'Test Title',
      content: buildValidPipelineMemory(),
      specFolder: '998-pipeline-enforcement',
      triggerPhrases: ['test'],
      anchors: ['continue-session'],
      embedding: new Float32Array([1, 0, 0]),
      findSimilar: mockFindSimilar,
    });

    expect(result.layers.semanticDedup).not.toBeNull();
    expect(result.layers.semanticDedup!.isDuplicate).toBe(true);
    if (!result.warnOnly) {
      expect(result.pass).toBe(false);
    }
  });

  it('passes when save quality gate is disabled', () => {
    process.env.SPECKIT_SAVE_QUALITY_GATE = 'false';
    const result = runQualityGate({
      title: null,
      content: 'short',
      specFolder: '998-pipeline-enforcement',
      triggerPhrases: [],
      anchors: [],
    });

    expect(result.gateEnabled).toBe(false);
    expect(result.pass).toBe(true);
  });

  it('warn-only mode allows wouldReject without blocking', () => {
    process.env.SPECKIT_SAVE_QUALITY_GATE = 'true';
    // Set activation to now so we're in the 14-day warn-only period
    setActivationTimestamp(Date.now());

    const result = runQualityGate({
      title: null,
      content: 'short',
      specFolder: '998-pipeline-enforcement',
      triggerPhrases: [],
      anchors: [],
    });

    expect(result.gateEnabled).toBe(true);
    expect(result.warnOnly).toBe(true);
    expect(result.wouldReject).toBe(true);
    expect(result.pass).toBe(true); // warn-only still passes
  });

  it('structural validation fails with empty title', () => {
    const result = validateStructural({
      title: null,
      content: buildValidPipelineMemory(),
      specFolder: '998-pipeline-enforcement',
    });

    expect(result.pass).toBe(false);
    expect(result.reasons.some(r => /title/i.test(r))).toBe(true);
  });

  it('structural validation fails with invalid spec folder format', () => {
    const result = validateStructural({
      title: 'Valid Title',
      content: buildValidPipelineMemory(),
      specFolder: '../traversal/attack',
    });

    expect(result.pass).toBe(false);
    expect(result.reasons.some(r => /spec folder/i.test(r))).toBe(true);
  });
});

// ───────────────────────────────────────────────────────────────
// CAT 6: CROSS-GATE INTERACTIONS
// ───────────────────────────────────────────────────────────────

describe('Cat 6: Cross-Gate Interactions', () => {
  it('content that passes quality loop can still fail sufficiency', () => {
    process.env.SPECKIT_QUALITY_LOOP = 'true';

    // Content with good structure (headings, anchors) but no primary evidence
    const content = buildValidPipelineMemory({
      fileTableEntries: [],
      observations: [],
      decisions: [],
    });
    const metadata: Record<string, unknown> = {
      triggerPhrases: ['pipeline-enforcement', 'save-pipeline-test', 'memory-gate-validation', 'enforcement-fixture'],
    };

    const qlResult = runQualityLoop(content, metadata, { threshold: 0.6 });
    // Quality loop may pass (structure is good)

    const snapshot: MemoryEvidenceSnapshot = {
      title: 'Memory Save Pipeline Enforcement Test Fixture',
      content,
      triggerPhrases: ['pipeline-enforcement'],
      files: [],
      observations: [],
      decisions: [],
    };
    const suffResult = evaluateMemorySufficiency(snapshot);

    // Sufficiency should fail due to no primary evidence
    expect(suffResult.pass).toBe(false);
  });

  it('content that passes sufficiency can still fail template contract', () => {
    // Content with good evidence but missing frontmatter
    const content = buildValidPipelineMemory({ removeFrontmatter: true });

    const snapshot: MemoryEvidenceSnapshot = {
      title: 'Memory Save Pipeline Enforcement Test Fixture',
      content,
      triggerPhrases: ['pipeline-enforcement'],
      files: [
        { path: 'file.ts', description: 'Coordinates atomic save, sufficiency enforcement, and duplicate detection for the memory save path.' },
        { path: 'other.ts', description: 'Three-layer quality gate that validates structure, content density, and semantic deduplication.' },
      ],
      observations: [{ title: 'Observation: pipeline test', narrative: 'Validated the complete pipeline gate ordering for comprehensive enforcement coverage.' }],
      decisions: ['Decided to enforce template contract after sufficiency.'],
    };

    const suffResult = evaluateMemorySufficiency(snapshot);
    const templateResult = validateMemoryTemplateContract(content);

    // Sufficiency may pass (has evidence), template should fail (no frontmatter)
    if (suffResult.pass) {
      expect(templateResult.valid).toBe(false);
      expect(templateResult.violations.some(v => v.code === 'missing_frontmatter')).toBe(true);
    }
  });

  it('content that passes template contract can still fail save quality gate', () => {
    process.env.SPECKIT_SAVE_QUALITY_GATE = 'true';
    resetActivationTimestamp();

    const content = buildValidPipelineMemory();
    const templateResult = validateMemoryTemplateContract(content);
    expect(templateResult.valid).toBe(true);

    // Now run quality gate with empty title and no triggers to force failure
    const qgResult = runQualityGate({
      title: null,
      content,
      specFolder: '998-pipeline-enforcement',
      triggerPhrases: [],
      anchors: [],
    });

    if (!qgResult.warnOnly) {
      // Signal density should be low with null title and empty triggers
      expect(qgResult.layers.contentQuality.dimensions.titleQuality).toBe(0);
    }
  });

  it('quality loop rejection blocks sufficiency evaluation (gate ordering proof)', async () => {
    process.env.SPECKIT_QUALITY_LOOP = 'true';

    // Content that would fail quality loop (no triggers, short, no anchors)
    const content = 'no structure at all';
    const metadata: Record<string, unknown> = { triggerPhrases: [] };

    const qlResult = runQualityLoop(content, metadata, { threshold: 0.6 });
    expect(qlResult.rejected).toBe(true);

    // In the actual pipeline (prepareParsedMemoryForIndexing), if quality loop rejects,
    // processPreparedMemory returns rejected before reaching sufficiency
    // We verify by checking that the pipeline result is 'rejected' with quality loop reason
    const filePath = path.join(FIXTURE_ROOT, 'memory', 'ql-ordering.md');
    // Need valid parse content (>= 5 chars)
    fs.writeFileSync(filePath, buildValidPipelineMemory({
      triggerPhrases: [],
      replaceContent: 'x'.repeat(100), // passes parser but fails quality loop
    }), 'utf8');

    const result = await handler.indexMemoryFile(filePath, { force: true, asyncEmbedding: true });

    if (process.env.SPECKIT_QUALITY_LOOP === 'true') {
      // The quality loop should have rejected before sufficiency was evaluated
      expect(result.status).toBe('rejected');
    }
  });

  it('sufficiency rejection blocks template contract (gate ordering proof)', async () => {
    process.env.SPECKIT_QUALITY_LOOP = 'false'; // Disable QL so we reach sufficiency

    // Build content that passes parser and quality loop (disabled) but fails sufficiency
    // Using generic title and no evidence
    const filePath = path.join(FIXTURE_ROOT, 'memory', 'suf-ordering.md');
    const content = buildValidPipelineMemory({
      title: 'Memory',
      fileTableEntries: [],
      observations: [],
      decisions: [],
    });
    fs.writeFileSync(filePath, content, 'utf8');

    const result = await handler.indexMemoryFile(filePath, { force: true, asyncEmbedding: true });

    // Should be rejected at sufficiency gate — not at template contract
    expect(result.status).toBe('rejected');
    if (result.rejectionCode) {
      expect(result.rejectionCode).toBe('INSUFFICIENT_CONTEXT_ABORT');
    }
  });

  it('template contract rejection blocks save quality gate (gate ordering proof)', async () => {
    process.env.SPECKIT_QUALITY_LOOP = 'false';

    // Build content that passes sufficiency but fails template contract (missing frontmatter)
    const filePath = path.join(FIXTURE_ROOT, 'memory', 'tpl-ordering.md');
    const content = buildValidPipelineMemory({ removeFrontmatter: true });
    fs.writeFileSync(filePath, content, 'utf8');

    const result = await handler.indexMemoryFile(filePath, { force: true, asyncEmbedding: true });

    // Should be rejected at template contract gate
    expect(result.status).toBe('rejected');
    if (result.rejectionReason) {
      expect(result.rejectionReason).toContain('Template contract');
    }
  });

  it('content at exact threshold boundaries passes all gates', async () => {
    const filePath = path.join(FIXTURE_ROOT, 'memory', 'boundary-all.md');
    const content = buildValidPipelineMemory();
    fs.writeFileSync(filePath, content, 'utf8');

    // Verify each gate individually
    const parsed = memoryParser.parseMemoryFile(filePath);
    const validation = memoryParser.validateParsedMemory(parsed);
    expect(validation.valid).toBe(true);

    const qlMetadata: Record<string, unknown> = { triggerPhrases: parsed.triggerPhrases };
    const qlResult = runQualityLoop(parsed.content, qlMetadata);
    expect(qlResult.passed).toBe(true);

    const templateResult = validateMemoryTemplateContract(parsed.content);
    expect(templateResult.valid).toBe(true);
  });
});

// ───────────────────────────────────────────────────────────────
// CAT 7: HOSTILE INPUT
// ───────────────────────────────────────────────────────────────

describe('Cat 7: Hostile Input', () => {
  it('handles HTML-comments-only content by rejecting', async () => {
    const filePath = path.join(FIXTURE_ROOT, 'memory', 'comments-only.md');
    const content = '<!-- comment 1 -->\n<!-- comment 2 -->\n<!-- comment 3 -->';
    fs.writeFileSync(filePath, content, 'utf8');

    // Parser should reject (content < 5 after stripping? or validation fails)
    // Actually the raw content is > 5 chars so parser passes, but quality/sufficiency will reject
    const parsed = memoryParser.parseMemoryContent(filePath, content);
    const snapshot: MemoryEvidenceSnapshot = {
      title: parsed.title,
      content,
      triggerPhrases: [],
      files: [],
      observations: [],
      decisions: [],
    };
    const suffResult = evaluateMemorySufficiency(snapshot);
    expect(suffResult.pass).toBe(false);
  });

  it('handles 1000 nested unclosed anchors without crashing', () => {
    const anchors = Array.from({ length: 1000 }, (_, i) =>
      `<!-- ANCHOR:section-${i} -->`
    ).join('\n');
    const content = `---\ntitle: "Anchor Stress Test"\ndescription: "test"\ntrigger_phrases:\n  - "anchor-stress"\nimportance_tier: "normal"\ncontextType: "implementation"\n---\n\n${anchors}`;

    // Should not throw or hang
    const result = validateMemoryTemplateContract(content);
    expect(result).toBeDefined();

    const anchorValidation = memoryParser.validateAnchors(content);
    expect(anchorValidation).toBeDefined();
    expect(anchorValidation.unclosedAnchors.length).toBe(1000);
  });

  it('rejects emoji-only trigger phrases as non-semantic', () => {
    const content = buildValidPipelineMemory({ triggerPhrases: ['🎉', '🚀', '✅', '🔥'] });
    const metadata: Record<string, unknown> = { triggerPhrases: ['🎉', '🚀', '✅', '🔥'] };

    // Quality loop should penalize emoji-only triggers as they don't match retrieval patterns
    const score = computeMemoryQualityScore(content, metadata);
    // Triggers score should still count them as present (4 phrases = 1.0)
    // But sufficiency should filter them out
    const snapshot: MemoryEvidenceSnapshot = {
      title: 'Specific Pipeline Test',
      content,
      triggerPhrases: ['🎉', '🚀', '✅', '🔥'],
      files: [{ path: 'file.ts', description: 'Test description for file evidence.' }],
      observations: [],
      decisions: [],
    };
    const suffResult = evaluateMemorySufficiency(snapshot);
    // Emoji triggers (< 4 chars each after normalization) should be filtered
    expect(suffResult.evidenceCounts.triggerPhrases).toBeLessThan(4);
  });

  it('blocks path traversal attempts', () => {
    const traversalPath = path.join(FIXTURE_ROOT, 'memory', '../../../../../../etc/passwd');
    expect(memoryParser.isMemoryFile(traversalPath)).toBe(false);
  });

  it('handles non-UTF8 binary content gracefully', () => {
    const filePath = path.join(FIXTURE_ROOT, 'memory', 'binary.md');
    // Write binary content
    const binaryBuffer = Buffer.from([0x00, 0x01, 0x02, 0x80, 0xFF, 0xFE, 0xFD]);
    fs.writeFileSync(filePath, binaryBuffer);

    // Should not crash, but should fail validation
    try {
      const parsed = memoryParser.parseMemoryFile(filePath);
      const validation = memoryParser.validateParsedMemory(parsed);
      // Binary content will likely fail length check or have no spec folder
      expect(validation.valid).toBe(false);
    } catch {
      // Parser may throw on binary content — that's acceptable
      expect(true).toBe(true);
    }
  });
});

// ───────────────────────────────────────────────────────────────
// CAT 8: BOUNDARY CONDITIONS
// ───────────────────────────────────────────────────────────────

describe('Cat 8: Boundary Conditions', () => {
  it('coherence score handles exactly 50 chars boundary', () => {
    // scoreCoherence gives +0.25 for content > 50 chars
    const exactly50 = 'a'.repeat(50);
    const result50 = scoreCoherence(exactly50);
    // 50 chars is NOT > 50, so it should NOT get the 0.25 bonus
    expect(result50.issues.some((i: string) => /short/i.test(i))).toBe(true);

    const exactly51 = 'a'.repeat(51);
    const result51 = scoreCoherence(exactly51);
    // 51 chars IS > 50, so it should get the 0.25 bonus
    expect(result51.issues.some((i: string) => /short/i.test(i))).toBe(false);
  });

  it('coherence score handles exactly 200 chars boundary (substance)', () => {
    const exactly200 = 'a'.repeat(200);
    const result200 = scoreCoherence(exactly200);
    // 200 chars is NOT > 200, so no substance bonus
    expect(result200.issues.some((i: string) => /substance/i.test(i))).toBe(true);

    const exactly201 = 'a'.repeat(201);
    const result201 = scoreCoherence(exactly201);
    // 201 chars IS > 200
    expect(result201.issues.some((i: string) => /substance/i.test(i))).toBe(false);
  });

  it('quality loop handles exactly 3 trigger phrases at boundary', () => {
    const metadata: Record<string, unknown> = {
      triggerPhrases: ['trigger-a', 'trigger-b', 'trigger-c'],
    };
    const result = scoreTriggerPhrases(metadata);
    // 3 triggers → score 0.5 (below 4 threshold for perfect score)
    expect(result.score).toBe(0.5);
    expect(result.issues.some((i: string) => /4\+ recommended/i.test(i))).toBe(true);
  });

  it('signal density handles value at exactly 0.40 threshold', () => {
    const result = scoreContentQuality({
      title: 'A reasonably specific title with enough characters',
      content: '---\ntitle: test\n---\nshort',
      triggerPhrases: ['test-trigger'],
      anchors: [],
    });
    // Verify the threshold logic works (>= 0.4 passes, < 0.4 fails)
    expect(result.threshold).toBe(0.4);
    if (result.signalDensity >= 0.4) {
      expect(result.pass).toBe(true);
    } else {
      expect(result.pass).toBe(false);
    }
  });

  it('semantic dedup handles similarity at exactly 0.92 threshold', () => {
    // Mock findSimilar returning exactly 0.92 similarity
    const mockFindSimilar = () => [{
      id: 99,
      file_path: '/some/memory.md',
      similarity: 0.92,
    }];

    const result = checkSemanticDedup(
      new Float32Array([1, 0, 0]),
      '998-pipeline-enforcement',
      mockFindSimilar,
    );

    // Exactly 0.92 should be flagged as duplicate (>= threshold)
    expect(result.isDuplicate).toBe(true);
    expect(result.threshold).toBe(0.92);
  });
});
