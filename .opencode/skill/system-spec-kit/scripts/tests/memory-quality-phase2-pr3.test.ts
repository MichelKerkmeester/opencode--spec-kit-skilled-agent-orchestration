import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import { reviewPostSaveQuality } from '../core/post-save-review';
import { collectSessionData } from '../extractors/collect-session-data';
import { buildFrontmatterContent } from '../lib/frontmatter-migration';
import { normalizeInputData } from '../utils/input-normalizer';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(TEST_DIR, '..', '..', '..', '..', '..');
const FIXTURE_DIR = path.join(TEST_DIR, 'fixtures', 'memory-quality');
const TEMPLATES_ROOT = path.join(TEST_DIR, '..', '..', 'templates');
const tempFiles: string[] = [];

interface MemoryQualityFixture {
  specFolder: string;
  sessionSummary: string;
  importance_tier?: string;
  filesModified?: unknown[];
  keyDecisions?: unknown[];
  triggerPhrases?: string[];
  nextSteps?: string[];
}

function readFixture(name: string): MemoryQualityFixture {
  return JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, name), 'utf8')) as MemoryQualityFixture;
}

function extractFrontmatterImportanceTier(content: string): string | null {
  const match = content.match(/^importance_tier:\s*"?(.*?)"?$/m);
  return match?.[1] ?? null;
}

function extractMetadataImportanceTier(content: string): string | null {
  const match = content.match(/## MEMORY METADATA[\s\S]*?```yaml[\s\S]*?^importance_tier:\s*"?(.*?)"?$/m);
  return match?.[1] ?? null;
}

function buildMemoryWithTierDrift(frontmatterTier: string, metadataTier: string, contextType: string = 'implementation'): string {
  return [
    '---',
    'title: "Phase 2 PR-3 drift fixture"',
    'description: "Fixture that forces frontmatter and metadata tier disagreement."',
    'trigger_phrases:',
    '  - "phase 2 pr3 drift"',
    `importance_tier: "${frontmatterTier}"`,
    `contextType: "${contextType}"`,
    '---',
    '',
    '# Phase 2 PR-3 drift fixture',
    '',
    '## SESSION SUMMARY',
    '',
    'Managed-frontmatter parity proof.',
    '',
    '## MEMORY METADATA',
    '',
    '```yaml',
    'session_id: "phase2-pr3-test"',
    `importance_tier: "${metadataTier}"`,
    `context_type: "${contextType}"`,
    'decision_count: 1',
    '```',
    '',
  ].join('\n');
}

async function writeTempMemoryFile(content: string): Promise<string> {
  const filePath = path.join(
    os.tmpdir(),
    `memory-quality-phase2-pr3-${Date.now()}-${Math.random().toString(16).slice(2)}.md`
  );
  await fsp.writeFile(filePath, content, 'utf8');
  tempFiles.push(filePath);
  return filePath;
}

afterEach(async () => {
  await Promise.all(tempFiles.splice(0).map((filePath) => fsp.rm(filePath, { force: true })));
});

describe('Phase 2 PR-3 importance-tier SSOT', () => {
  it('keeps both serialized importance_tier locations aligned after the managed-frontmatter rewrite', () => {
    const input = buildMemoryWithTierDrift('normal', 'important');
    const result = buildFrontmatterContent(
      input,
      { templatesRoot: TEMPLATES_ROOT },
      path.join(
        REPO_ROOT,
        '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/002-single-owner-metadata/memory/f-ac4-managed-rewrite.md'
      )
    );

    expect(result.changed).toBe(true);
    expect(extractFrontmatterImportanceTier(result.content)).toBe('important');
    expect(extractMetadataImportanceTier(result.content)).toBe('important');
  });

  it('raises a HIGH-severity issue when frontmatter and MEMORY METADATA tiers drift apart', async () => {
    const savedFilePath = await writeTempMemoryFile(buildMemoryWithTierDrift('important', 'normal'));

    const result = reviewPostSaveQuality({
      savedFilePath,
      inputMode: 'file',
      collectedData: {
        _source: 'file',
        sessionSummary: 'Importance-tier drift should be detected after save.',
        importanceTier: 'important',
      },
    });

    expect(result.status).toBe('ISSUES_FOUND');
    expect(result.issues).toContainEqual(expect.objectContaining({
      severity: 'HIGH',
      field: 'importance_tier',
      message: expect.stringContaining('MEMORY METADATA'),
    }));
  });

  it('ignores the template inline comment when the rendered tiers already match', async () => {
    const savedFilePath = await writeTempMemoryFile([
      '---',
      'title: "Phase 2 PR-3 parity fixture"',
      'description: "Equal tiers should not trip the drift assertion."',
      'importance_tier: "important"',
      'contextType: "implementation"',
      '---',
      '',
      '# Phase 2 PR-3 parity fixture',
      '',
      '## MEMORY METADATA',
      '',
      '```yaml',
      'importance_tier: "important"  # constitutional|critical|important|normal|temporary|deprecated',
      '```',
      '',
    ].join('\n'));

    const result = reviewPostSaveQuality({
      savedFilePath,
      inputMode: 'file',
      collectedData: {
        _source: 'file',
        sessionSummary: 'Matching tiers with inline comments should still pass.',
        importanceTier: 'important',
      },
    });

    expect(result.issues.some((issue) => issue.field === 'importance_tier')).toBe(false);
  });

  it('keeps the F-AC1 truncation fixture on a single resolved tier after Phase 2 lands', async () => {
    const fixture = readFixture('F-AC1-truncation.json');
    const normalized = normalizeInputData(fixture as never);
    const sessionData = await collectSessionData(normalized as never, fixture.specFolder);
    const input = buildMemoryWithTierDrift('normal', sessionData.IMPORTANCE_TIER, sessionData.CONTEXT_TYPE);
    const result = buildFrontmatterContent(
      input,
      { templatesRoot: TEMPLATES_ROOT },
      path.join(REPO_ROOT, fixture.specFolder, 'memory', 'f-ac1-phase2-regression.md')
    );

    expect(extractFrontmatterImportanceTier(result.content)).toBe(sessionData.IMPORTANCE_TIER);
    expect(extractMetadataImportanceTier(result.content)).toBe(sessionData.IMPORTANCE_TIER);
  });
});
