import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const memorySearchSpy = vi.hoisted(() => vi.fn(async () => {
  throw new Error('resume mode should not call handleMemorySearch');
}));

vi.mock('../core/db-state', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    checkDatabaseUpdated: vi.fn(async () => false),
  };
});

vi.mock('../core', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    checkDatabaseUpdated: vi.fn(async () => false),
  };
});

vi.mock('../handlers/memory-search', () => ({
  handleMemorySearch: memorySearchSpy,
}));

import { handleMemoryContext } from '../handlers/memory-context';
import { upsertThinContinuityInMarkdown } from '../lib/continuity/thin-continuity-record';

/**
 * Create a temp workspace containing a nested spec folder under
 * `.opencode/specs/...`. The resume-ladder security hardening requires
 * spec paths to resolve inside `.opencode/specs` or `specs` relative to
 * the resolved workspace, so tests need to chdir into a structured root.
 * Uses realpathSync to avoid macOS /tmp → /private/tmp symlink drift.
 */
function makeTempSpecFolder(): string {
  const rawRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'memory-context-resume-'));
  const workspaceRoot = fs.realpathSync(rawRoot);
  const specFolder = path.join(workspaceRoot, '.opencode', 'specs', 'test-packet', '001-resume-fixture');
  fs.mkdirSync(specFolder, { recursive: true });
  process.chdir(workspaceRoot);
  return specFolder;
}

function writeMarkdown(filePath: string, content: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function buildBaseMarkdown(title: string, body: string): string {
  return [
    '---',
    `title: "${title}"`,
    'description: "fixture"',
    '---',
    '',
    body,
    '',
  ].join('\n');
}

function buildContinuityMarkdown(title: string, body: string): string {
  const base = buildBaseMarkdown(title, body);
  const writeResult = upsertThinContinuityInMarkdown(base, {
    packet_pointer: 'system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/004-gate-d-reader-ready',
    last_updated_at: '2026-04-11T12:00:00Z',
    last_updated_by: 'resume-test',
    recent_action: 'Refined canonical resume flow',
    next_safe_action: 'Run Gate D resume verification',
    blockers: ['none'],
    key_files: ['implementation-summary.md'],
    completion_pct: 75,
    open_questions: ['Q101'],
    answered_questions: ['Q102'],
  });

  if (!writeResult.ok || !writeResult.markdown) {
    throw new Error('Failed to build continuity fixture');
  }

  return writeResult.markdown;
}

function parseResumeEnvelope(result: Awaited<ReturnType<typeof handleMemoryContext>>): Record<string, unknown> {
  const outer = JSON.parse(result.content[0].text) as Record<string, unknown>;
  const outerData = outer.data as Record<string, unknown>;
  const nestedContent = outerData.content as Array<{ text: string }>;
  return JSON.parse(nestedContent[0].text) as Record<string, unknown>;
}

describe('Gate D resume ladder in memory-context', () => {
  const tempFolders: string[] = [];
  const originalCwd = process.cwd();

  beforeEach(() => {
    memorySearchSpy.mockClear();
  });

  afterEach(() => {
    process.chdir(originalCwd);
    while (tempFolders.length > 0) {
      const folder = tempFolders.pop();
      if (folder) {
        // folder is the nested spec folder; clean up the workspace root (3 levels up)
        const workspaceRoot = path.resolve(folder, '..', '..', '..');
        fs.rmSync(workspaceRoot, { recursive: true, force: true });
      }
    }
  });

  // Deep-review regression coverage for the Gate D resume ladder temp-fixture path.
  it('prefers handover.md over continuity and spec docs', async () => {
    const specFolder = makeTempSpecFolder();
    tempFolders.push(specFolder);

    writeMarkdown(
      path.join(specFolder, 'handover.md'),
      buildBaseMarkdown('Handover', '# Latest Handover\nResume from the handover first.'),
    );
    writeMarkdown(
      path.join(specFolder, 'implementation-summary.md'),
      buildContinuityMarkdown('Implementation Summary', '# Summary\nContinuity exists but should be secondary.'),
    );
    writeMarkdown(
      path.join(specFolder, 'spec.md'),
      buildBaseMarkdown('Spec', '# Spec\nSpec doc fallback should not win.'),
    );

    const response = await handleMemoryContext({
      input: 'resume previous work',
      mode: 'resume',
      specFolder,
    });

    const nested = parseResumeEnvelope(response);
    const data = nested.data as Record<string, unknown>;
    const results = data.results as Array<Record<string, unknown>>;
    const resumeLadder = data.resumeLadder as Record<string, unknown>;

    expect(resumeLadder.source).toBe('handover');
    expect(resumeLadder.levels).toEqual(['handover', 'continuity', 'spec_docs']);
    expect(resumeLadder.archivedTierEnabled).toBe(false);
    expect(resumeLadder.legacyMemoryFallback).toBe(false);
    expect(results).toHaveLength(1);
    expect(results[0].documentType).toBe('handover');
    expect(results[0].filePath).toContain('handover.md');
    expect(memorySearchSpy).not.toHaveBeenCalled();
  });

  // Deep-review regression coverage for continuity fallback in temp spec fixtures.
  it('falls back to _memory.continuity when handover is absent', async () => {
    const specFolder = makeTempSpecFolder();
    tempFolders.push(specFolder);

    writeMarkdown(
      path.join(specFolder, 'implementation-summary.md'),
      buildContinuityMarkdown('Implementation Summary', '# Summary\nContinuity should drive resume.'),
    );
    writeMarkdown(
      path.join(specFolder, 'spec.md'),
      buildBaseMarkdown('Spec', '# Spec\nSpec doc fallback exists.'),
    );

    const response = await handleMemoryContext({
      input: 'resume previous work',
      mode: 'resume',
      specFolder,
    });

    const nested = parseResumeEnvelope(response);
    const data = nested.data as Record<string, unknown>;
    const results = data.results as Array<Record<string, unknown>>;
    const resumeLadder = data.resumeLadder as Record<string, unknown>;

    expect(resumeLadder.source).toBe('continuity');
    expect(results).toHaveLength(1);
    expect(results[0].documentType).toBe('continuity');
    expect(results[0].content).toContain('Recent action: Refined canonical resume flow');
    expect(results[0].content).toContain('Next safe action: Run Gate D resume verification');
    expect(memorySearchSpy).not.toHaveBeenCalled();
  });

  it('still prefers handover when implementation-summary.md is missing entirely', async () => {
    const specFolder = makeTempSpecFolder();
    tempFolders.push(specFolder);

    writeMarkdown(
      path.join(specFolder, 'handover.md'),
      buildBaseMarkdown('Handover', '# Latest Handover\nResume from the handover when continuity is unavailable.'),
    );
    writeMarkdown(
      path.join(specFolder, 'tasks.md'),
      buildBaseMarkdown('Tasks', '# Tasks\n- [ ] Gate D should still resume from handover.'),
    );

    const response = await handleMemoryContext({
      input: 'resume previous work',
      mode: 'resume',
      specFolder,
    });

    const nested = parseResumeEnvelope(response);
    const data = nested.data as Record<string, unknown>;
    const results = data.results as Array<Record<string, unknown>>;
    const resumeLadder = data.resumeLadder as Record<string, unknown>;

    expect(resumeLadder.source).toBe('handover');
    expect(results).toHaveLength(1);
    expect(results[0].documentType).toBe('handover');
    expect(results[0].filePath).toContain('handover.md');
    expect(memorySearchSpy).not.toHaveBeenCalled();
  });

  // Deep-review regression coverage for spec-doc fallback when continuity is malformed.
  it('falls back to spec docs when continuity is malformed', async () => {
    const specFolder = makeTempSpecFolder();
    tempFolders.push(specFolder);

    writeMarkdown(
      path.join(specFolder, 'implementation-summary.md'),
      [
        '---',
        'title: "Implementation Summary"',
        '_memory:',
        '  continuity:',
        '    recent_action: "missing required continuity fields"',
        '---',
        '',
        '# Summary',
        'Malformed continuity should not block spec-doc fallback.',
        '',
      ].join('\n'),
    );
    writeMarkdown(
      path.join(specFolder, 'spec.md'),
      buildBaseMarkdown('Spec', '# Spec\nFallback to canonical spec docs.'),
    );
    writeMarkdown(
      path.join(specFolder, 'tasks.md'),
      buildBaseMarkdown('Tasks', '# Tasks\n- [ ] Verify Gate D ladder.'),
    );

    const response = await handleMemoryContext({
      input: 'resume previous work',
      mode: 'resume',
      specFolder,
    });

    const nested = parseResumeEnvelope(response);
    const data = nested.data as Record<string, unknown>;
    const results = data.results as Array<Record<string, unknown>>;
    const resumeLadder = data.resumeLadder as Record<string, unknown>;

    expect(resumeLadder.source).toBe('spec_docs');
    expect(results.length).toBeGreaterThanOrEqual(2);
    expect(results.every((row) => row.documentType === 'spec_doc')).toBe(true);
    expect(results.some((row) => String(row.filePath).includes('spec.md'))).toBe(true);
    expect(results.some((row) => String(row.filePath).includes('tasks.md'))).toBe(true);
    expect((resumeLadder.warnings as string[]).length).toBeGreaterThan(0);
    expect(memorySearchSpy).not.toHaveBeenCalled();
  });

  it('falls back to other canonical spec docs when implementation-summary.md is absent', async () => {
    const specFolder = makeTempSpecFolder();
    tempFolders.push(specFolder);

    writeMarkdown(
      path.join(specFolder, 'spec.md'),
      buildBaseMarkdown('Spec', '# Spec\nFallback to canonical spec docs when continuity is missing.'),
    );
    writeMarkdown(
      path.join(specFolder, 'decision-record.md'),
      buildBaseMarkdown('Decision Record', '# Decision\nKeep resume readable from spec docs alone.'),
    );
    writeMarkdown(
      path.join(specFolder, 'checklist.md'),
      buildBaseMarkdown('Checklist', '# Checklist\n- [ ] Confirm Gate D spec-doc fallback.'),
    );

    const response = await handleMemoryContext({
      input: 'resume previous work',
      mode: 'resume',
      specFolder,
    });

    const nested = parseResumeEnvelope(response);
    const data = nested.data as Record<string, unknown>;
    const results = data.results as Array<Record<string, unknown>>;
    const resumeLadder = data.resumeLadder as Record<string, unknown>;

    expect(resumeLadder.source).toBe('spec_docs');
    expect(results.length).toBeGreaterThanOrEqual(3);
    expect(results.every((row) => row.documentType === 'spec_doc')).toBe(true);
    expect(results.some((row) => String(row.filePath).includes('spec.md'))).toBe(true);
    expect(results.some((row) => String(row.filePath).includes('decision-record.md'))).toBe(true);
    expect(results.some((row) => String(row.filePath).includes('checklist.md'))).toBe(true);
    expect(memorySearchSpy).not.toHaveBeenCalled();
  });
});
