// ---------------------------------------------------------------
// TEST: Stateless Enrichment Guardrails
// Covers spec-folder extraction, git scoping, relevance filtering, and barrel exports
// ---------------------------------------------------------------

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import * as extractors from '../extractors';
import { extractGitContext } from '../extractors/git-context-extractor';
import { buildProjectStateSnapshot } from '../extractors/session-extractor';
import { extractSpecFolderContext } from '../extractors/spec-folder-extractor';
import { transformOpencodeCapture } from '../utils/input-normalizer';

const tempRoots: string[] = [];

function makeTempRoot(prefix: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempRoots.push(root);
  return root;
}

afterEach(() => {
  while (tempRoots.length > 0) {
    fs.rmSync(tempRoots.pop()!, { recursive: true, force: true });
  }
});

describe('stateless enrichment guardrails', () => {
  it('keeps natural-language prompts and responses that match hyphenated spec slugs', () => {
    const transformed = transformOpencodeCapture({
      exchanges: [
        {
          userInput: 'Perfect session capturing hardening for stateless mode',
          assistantResponse: 'Improved perfect session capturing alignment and enrichment safeguards.',
          timestamp: '2026-03-09T10:00:00Z',
        },
      ],
      toolCalls: [],
      metadata: {},
      sessionTitle: 'Perfect Session Capturing',
      sessionId: 'session-test',
      capturedAt: '2026-03-09T10:01:00Z',
    }, '02--system-spec-kit/022-hybrid-rag-fusion/011-perfect-session-capturing');

    expect(transformed.userPrompts).toHaveLength(1);
    expect(transformed.observations).toHaveLength(1);
    expect(transformed.recentContext).toHaveLength(1);
  });

  it('filters out unrelated prompts while keeping only spec-relevant stateless content', () => {
    const transformed = transformOpencodeCapture({
      exchanges: [
        {
          userInput: 'Perfect session capturing hardening for stateless mode',
          assistantResponse: 'Improved perfect session capturing alignment and enrichment safeguards.',
          timestamp: '2026-03-09T10:00:00Z',
        },
        {
          userInput: 'Refactor outsourced agent memory capture docs',
          assistantResponse: 'Updated outsourced agent docs and notes.',
          timestamp: '2026-03-09T10:05:00Z',
        },
      ],
      toolCalls: [],
      metadata: {},
      sessionTitle: 'Perfect Session Capturing',
      sessionId: 'session-test',
      capturedAt: '2026-03-09T10:06:00Z',
    }, '02--system-spec-kit/022-hybrid-rag-fusion/011-perfect-session-capturing');

    expect(transformed.userPrompts).toHaveLength(1);
    expect(transformed.userPrompts[0]?.prompt).toContain('Perfect session capturing');
    expect(transformed.observations).toHaveLength(1);
    expect(transformed.recentContext).toHaveLength(1);
  });

  it('extracts trigger phrases from merged specs that embed a second frontmatter block', async () => {
    const specRoot = makeTempRoot('speckit-spec-folder-');
    fs.writeFileSync(path.join(specRoot, 'description.json'), JSON.stringify({
      title: 'Generate-Context Pipeline Quality',
      status: 'in-progress',
    }), 'utf-8');
    fs.writeFileSync(
      path.join(specRoot, 'spec.md'),
      [
        '# Part I',
        '',
        '---',
        'title: "Feature Specification: Improve Stateless Mode Quality"',
        'trigger_phrases:',
        '  - "stateless mode"',
        '  - "improve stateless"',
        '---',
        '',
        '## 3. SCOPE',
        '',
        '### Files to Change',
        '',
        '| File Path | Change Type | Description |',
        '|-----------|-------------|-------------|',
        '| `scripts/core/workflow.ts` | Modify | Insert enrichment after alignment guards |',
      ].join('\n'),
      'utf-8'
    );
    fs.writeFileSync(path.join(specRoot, 'plan.md'), '# Plan\n\n## 1. SUMMARY\n\nTesting stateless enrichment.\n', 'utf-8');
    fs.writeFileSync(path.join(specRoot, 'tasks.md'), '- [x] done\n- [ ] pending\n', 'utf-8');
    fs.writeFileSync(path.join(specRoot, 'checklist.md'), '## P0\n- [x] built\n', 'utf-8');
    fs.writeFileSync(path.join(specRoot, 'decision-record.md'), '## DR-001\n\n**Decision:** Keep provenance markers.\n', 'utf-8');

    const extracted = await extractSpecFolderContext(specRoot);

    expect(extracted.triggerPhrases).toEqual(expect.arrayContaining(['stateless mode', 'improve stateless']));
    expect(extracted.FILES).toEqual(expect.arrayContaining([
      expect.objectContaining({ FILE_PATH: 'scripts/core/workflow.ts' }),
    ]));
  });

  it('extracts task progress and decisions from spec-folder docs without crashing on sparse inputs', async () => {
    const specRoot = makeTempRoot('speckit-spec-folder-sparse-');
    fs.writeFileSync(path.join(specRoot, 'description.json'), JSON.stringify({
      id: '011-perfect-session-capturing',
      title: 'Perfect Session Capturing',
      status: 'in-progress',
      level: 3,
    }), 'utf-8');
    fs.writeFileSync(
      path.join(specRoot, 'spec.md'),
      [
        '---',
        'title: "Perfect Session Capturing"',
        'trigger_phrases:',
        '  - "perfect session capturing"',
        '---',
        '',
        '## 3. SCOPE',
        '',
        '### Files to Change',
        '',
        '| File Path | Change Type | Description |',
        '|-----------|-------------|-------------|',
        '| `scripts/core/workflow.ts` | Modify | Insert enrichment after alignment guards |',
      ].join('\n'),
      'utf-8'
    );
    fs.writeFileSync(path.join(specRoot, 'plan.md'), '# Plan\n\n## 1. SUMMARY\n\nStateless enrichment testing.\n', 'utf-8');
    fs.writeFileSync(path.join(specRoot, 'tasks.md'), '- [x] implemented\n- [ ] verify runtime\n', 'utf-8');
    fs.writeFileSync(path.join(specRoot, 'checklist.md'), '## P0\n- [x] built\n', 'utf-8');
    fs.writeFileSync(
      path.join(specRoot, 'decision-record.md'),
      [
        '## DR-001 Keep alignment guard scope narrow',
        '',
        '**Context:** Shared implementation files should still align to the target spec.',
        '',
        '**Decision:** Scope git and alignment checks to spec-declared files.',
      ].join('\n'),
      'utf-8'
    );

    const extracted = await extractSpecFolderContext(specRoot);
    const sparseRoot = makeTempRoot('speckit-spec-folder-empty-');
    fs.writeFileSync(path.join(sparseRoot, 'description.json'), JSON.stringify({
      title: 'Sparse Spec Folder',
      status: 'draft',
    }), 'utf-8');
    const sparseExtracted = await extractSpecFolderContext(sparseRoot);

    expect(extracted.observations).toEqual(expect.arrayContaining([
      expect.objectContaining({
        title: 'Task completion status',
        facts: expect.arrayContaining(['checked=1', 'unchecked=1', 'completion=50%']),
      }),
    ]));
    expect(extracted.decisions).toEqual(expect.arrayContaining([
      expect.objectContaining({
        title: 'DR-001 Keep alignment guard scope narrow',
        chosen: 'Scope git and alignment checks to spec-declared files.',
      }),
    ]));
    expect(sparseExtracted.summary).toContain('Sparse Spec Folder');
    expect(sparseExtracted.observations).toEqual(expect.arrayContaining([
      expect.objectContaining({ title: 'Spec folder metadata' }),
    ]));
  });

  it('uses spec-declared file targets to scope git context beyond the spec folder path itself', async () => {
    const repoRoot = makeTempRoot('speckit-git-context-');
    const specFolderPath = path.join(repoRoot, '.opencode', 'specs', '02--system-spec-kit', '022-hybrid-rag-fusion', '011-perfect-session-capturing');
    const workflowPath = path.join(repoRoot, '.opencode', 'skill', 'system-spec-kit', 'scripts', 'core', 'workflow.ts');

    fs.mkdirSync(specFolderPath, { recursive: true });
    fs.mkdirSync(path.dirname(workflowPath), { recursive: true });
    fs.writeFileSync(
      path.join(specFolderPath, 'spec.md'),
      [
        '# Spec',
        '',
        '## 3. SCOPE',
        '',
        '### Files to Change',
        '',
        '| File Path | Change Type | Description |',
        '|-----------|-------------|-------------|',
        '| `scripts/core/workflow.ts` | Modify | Insert enrichment after alignment guards |',
      ].join('\n'),
      'utf-8'
    );
    fs.writeFileSync(path.join(specFolderPath, 'plan.md'), '# Plan\n\n## 1. SUMMARY\n\nGit scoping test.\n', 'utf-8');
    fs.writeFileSync(path.join(specFolderPath, 'tasks.md'), '- [ ] pending\n', 'utf-8');
    fs.writeFileSync(path.join(specFolderPath, 'checklist.md'), '## P0\n- [ ] pending\n', 'utf-8');
    fs.writeFileSync(path.join(specFolderPath, 'decision-record.md'), '## DR-001\n\n**Decision:** Track workflow changes.\n', 'utf-8');
    fs.writeFileSync(workflowPath, 'export const workflowVersion = 1;\n', 'utf-8');

    execFileSync('git', ['init'], { cwd: repoRoot, stdio: 'ignore' });
    execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd: repoRoot, stdio: 'ignore' });
    execFileSync('git', ['config', 'user.name', 'Spec Kit Tests'], { cwd: repoRoot, stdio: 'ignore' });
    execFileSync('git', ['add', '-f', '.'], { cwd: repoRoot, stdio: 'ignore' });
    execFileSync('git', ['commit', '-m', 'feat: add workflow alignment fix'], { cwd: repoRoot, stdio: 'ignore' });

    const gitContext = await extractGitContext(repoRoot, specFolderPath);

    expect(gitContext.commitCount).toBe(1);
    expect(gitContext.FILES).toEqual(expect.arrayContaining([
      expect.objectContaining({
        FILE_PATH: '.opencode/skill/system-spec-kit/scripts/core/workflow.ts',
      }),
    ]));
    expect(gitContext.observations).toEqual(expect.arrayContaining([
      expect.objectContaining({
        title: 'feat: add workflow alignment fix',
        files: expect.arrayContaining(['.opencode/skill/system-spec-kit/scripts/core/workflow.ts']),
      }),
    ]));
  });

  it('degrades cleanly when git context is unavailable and on single-commit repositories', async () => {
    const noGitRoot = makeTempRoot('speckit-no-git-');
    const noGitContext = await extractGitContext(noGitRoot);

    expect(noGitContext).toEqual({
      observations: [],
      FILES: [],
      summary: '',
      commitCount: 0,
      uncommittedCount: 0,
    });
  });

  it('prefers live observations over synthetic enrichment for project state snapshots', () => {
    const snapshot = buildProjectStateSnapshot({
      toolCounts: { Read: 0, Edit: 1, Write: 0, Bash: 0, Grep: 0, Glob: 0, Task: 0, WebFetch: 0, WebSearch: 0, Skill: 0 },
      observations: [
        {
          type: 'feature',
          title: 'Adjusted workflow alignment logic',
          narrative: 'Updated the live workflow guard for stateless mode.',
          files: ['scripts/core/workflow.ts'],
        },
        {
          type: 'feature',
          title: 'feat: add workflow alignment fix',
          narrative: '',
          files: ['.opencode/skill/system-spec-kit/scripts/core/workflow.ts'],
          _provenance: 'git',
          _synthetic: true,
        },
      ],
      messageCount: 1,
      FILES: [{ FILE_PATH: 'scripts/core/workflow.ts' }],
      SPEC_FILES: [],
      specFolderPath: null,
      recentContext: [],
    });

    expect(snapshot.activeFile).toBe('scripts/core/workflow.ts');
    expect(snapshot.lastAction).toBe('Adjusted workflow alignment logic');
  });

  it('re-exports stateless enrichment extractors through the barrel surface', () => {
    expect(typeof extractors.extractSpecFolderContext).toBe('function');
    expect(typeof extractors.extractGitContext).toBe('function');
  });
});
