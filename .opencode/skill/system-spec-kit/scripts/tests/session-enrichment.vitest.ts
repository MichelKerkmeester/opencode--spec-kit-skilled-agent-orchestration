// TEST: Stateless Enrichment Guardrails
// Covers spec-folder extraction, git scoping, relevance filtering, and barrel exports
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { CONFIG } from '../core';
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

function initializeGitRepo(repoRoot: string, branchName = 'test-main'): void {
  execFileSync('git', ['init'], { cwd: repoRoot, stdio: 'ignore' });
  execFileSync('git', ['checkout', '-b', branchName], { cwd: repoRoot, stdio: 'ignore' });
  execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd: repoRoot, stdio: 'ignore' });
  execFileSync('git', ['config', 'user.name', 'Spec Kit Tests'], { cwd: repoRoot, stdio: 'ignore' });
}

function readShortHead(repoRoot: string): string {
  return execFileSync('git', ['rev-parse', '--short=12', 'HEAD'], {
    cwd: repoRoot,
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'ignore'],
  }).trim();
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
    }, '02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing');

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
    }, '02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing');

    expect(transformed.userPrompts).toHaveLength(1);
    expect(transformed.userPrompts[0]?.prompt).toContain('Perfect session capturing');
    expect(transformed.observations).toHaveLength(1);
    expect(transformed.recentContext).toHaveLength(1);
  });

  it('does not fall back to foreign-spec prompts when relevance filtering finds no safe match', () => {
    const transformed = transformOpencodeCapture({
      exchanges: [
        {
          userInput: 'Investigate 031-memory-search-state-filter-fix regressions.',
          assistantResponse: 'Updated 031-memory-search-state-filter-fix notes and findings.',
          timestamp: '2026-03-09T10:10:00Z',
        },
      ],
      toolCalls: [],
      metadata: {},
      sessionTitle: 'Foreign Spec Session',
      sessionId: 'foreign-session',
      capturedAt: '2026-03-09T10:11:00Z',
    }, '02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing');

    expect(transformed.userPrompts).toEqual([]);
    expect(transformed.observations).toEqual([]);
    expect(transformed.recentContext).toEqual([]);
  });

  it('keeps Codex tool evidence when command/output reference target spec files without direct filePath fields', () => {
    const transformed = transformOpencodeCapture({
      exchanges: [
        {
          userInput: 'Perfect session capturing hardening for stateless mode',
          assistantResponse: 'Validated the stateless alignment guard for perfect session capturing.',
          timestamp: '2026-03-15T12:00:00Z',
        },
      ],
      toolCalls: [
        {
          tool: 'bash',
          status: 'completed',
          timestamp: '2026-03-15T12:00:10Z',
          input: {
            command: "sed -n '680,760p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts",
          },
          output: 'Confirmed scripts/core/workflow.ts still blocks mis-scoped 009-perfect-session-capturing saves.',
        },
      ],
      metadata: {},
      sessionTitle: 'Codex stateless evidence preservation',
      sessionId: 'codex-evidence',
      capturedAt: '2026-03-15T12:00:30Z',
    }, '02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing', 'codex-cli-capture');

    expect(transformed._toolCallCount).toBe(1);
    expect(transformed.observations).toEqual(expect.arrayContaining([
      expect.objectContaining({
        title: expect.stringMatching(/bash|workflow\.ts|sed -n/i),
        facts: expect.arrayContaining([
          expect.stringContaining('Tool: bash'),
          expect.stringContaining('Result: Confirmed scripts/core/workflow.ts'),
        ]),
      }),
    ]));
  });

  it('drops generic same-workspace infrastructure tool evidence when no target-spec anchor exists', () => {
    const transformed = transformOpencodeCapture({
      exchanges: [
        {
          userInput: 'Route to the media editor and convert images to webp.',
          assistantResponse: 'Prepared the media editor conversion workflow.',
          timestamp: '2026-03-15T12:10:00Z',
        },
      ],
      toolCalls: [
        {
          tool: 'bash',
          status: 'completed',
          timestamp: '2026-03-15T12:10:10Z',
          input: {
            command: "node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js .opencode/specs/01--anobel.com/036-hero-contact-success",
          },
          output: 'Prepared unrelated image conversion follow-up.',
        },
      ],
      metadata: {},
      sessionTitle: 'Generic infrastructure session',
      sessionId: 'generic-infra',
      capturedAt: '2026-03-15T12:10:30Z',
    }, '02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing');

    expect(transformed._toolCallCount).toBe(0);
    expect(transformed.observations).toEqual([]);
    expect(transformed.recentContext).toEqual([]);
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
      id: '009-perfect-session-capturing',
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

  it('keeps only project-confined file targets when spec docs list absolute paths', async () => {
    const specRoot = makeTempRoot('speckit-spec-folder-absolute-paths-');
    const projectAbsolutePath = path.join(
      CONFIG.PROJECT_ROOT,
      '.opencode',
      'skill',
      'system-spec-kit',
      'scripts',
      'core',
      'workflow.ts',
    );
    const externalAbsolutePath = path.join(path.sep, 'tmp', 'foreign-spec-folder.md');

    fs.writeFileSync(path.join(specRoot, 'description.json'), JSON.stringify({
      title: 'Absolute Path Guardrails',
      status: 'in-progress',
    }), 'utf-8');
    fs.writeFileSync(
      path.join(specRoot, 'spec.md'),
      [
        '# Spec',
        '',
        '## 3. SCOPE',
        '',
        '### Files to Change',
        '',
        '| File Path | Change Type | Description |',
        '|-----------|-------------|-------------|',
        `| \`${projectAbsolutePath}\` | Modify | Keep project-confined absolute paths |`,
        `| \`${externalAbsolutePath}\` | Modify | Drop out-of-project absolute paths |`,
      ].join('\n'),
      'utf-8'
    );
    fs.writeFileSync(path.join(specRoot, 'plan.md'), '# Plan\n\n## 1. SUMMARY\n\nAbsolute path normalization.\n', 'utf-8');
    fs.writeFileSync(path.join(specRoot, 'tasks.md'), '- [x] added regression\n', 'utf-8');
    fs.writeFileSync(path.join(specRoot, 'checklist.md'), '## P0\n- [x] added guardrail\n', 'utf-8');
    fs.writeFileSync(path.join(specRoot, 'decision-record.md'), '## DR-001\n\n**Decision:** Reject out-of-project paths.\n', 'utf-8');

    const extracted = await extractSpecFolderContext(specRoot);

    expect(extracted.FILES).toEqual(expect.arrayContaining([
      expect.objectContaining({
        FILE_PATH: '.opencode/skill/system-spec-kit/scripts/core/workflow.ts',
      }),
    ]));
    expect(extracted.FILES).toEqual(expect.not.arrayContaining([
      expect.objectContaining({
        FILE_PATH: expect.stringContaining('foreign-spec-folder.md'),
      }),
      expect.objectContaining({
        FILE_PATH: expect.stringMatching(/^\.\./),
      }),
    ]));
  });

  it('uses spec-declared file targets to scope git context beyond the spec folder path itself', async () => {
    const repoRoot = makeTempRoot('speckit-git-context-');
    const specFolderPath = path.join(repoRoot, '.opencode', 'specs', '02--system-spec-kit', '022-hybrid-rag-fusion', '009-perfect-session-capturing');
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

    initializeGitRepo(repoRoot);
    execFileSync('git', ['add', '-f', '.'], { cwd: repoRoot, stdio: 'ignore' });
    execFileSync('git', ['commit', '-m', 'feat: add workflow alignment fix'], { cwd: repoRoot, stdio: 'ignore' });

    const gitContext = await extractGitContext(repoRoot, specFolderPath);
    const commitRef = readShortHead(repoRoot);

    expect(gitContext).toMatchObject({
      commitCount: 1,
      uncommittedCount: 0,
      headRef: 'test-main',
      commitRef,
      repositoryState: 'clean',
      isDetachedHead: false,
    });
    expect(gitContext.FILES).toEqual(expect.arrayContaining([
      expect.objectContaining({
        FILE_PATH: '.opencode/skill/system-spec-kit/scripts/core/workflow.ts',
        MODIFICATION_MAGNITUDE: expect.any(String),
      }),
    ]));
    expect(gitContext.observations).toEqual(expect.arrayContaining([
      expect.objectContaining({
        title: 'feat: add workflow alignment fix',
        files: expect.arrayContaining(['.opencode/skill/system-spec-kit/scripts/core/workflow.ts']),
      }),
    ]));
  });

  it('degrades cleanly when git context is unavailable', async () => {
    const noGitRoot = makeTempRoot('speckit-no-git-');
    const noGitContext = await extractGitContext(noGitRoot);

    expect(noGitContext).toEqual({
      observations: [],
      FILES: [],
      summary: '',
      commitCount: 0,
      uncommittedCount: 0,
      headRef: null,
      commitRef: null,
      repositoryState: 'unavailable',
      isDetachedHead: false,
    });
  });

  it('keeps uncommitted file context in repositories that do not have a HEAD commit yet', async () => {
    const repoRoot = makeTempRoot('speckit-unborn-head-');
    const trackedFile = path.join(repoRoot, 'scripts', 'core', 'workflow.ts');

    fs.mkdirSync(path.dirname(trackedFile), { recursive: true });
    fs.writeFileSync(trackedFile, 'export const workflowVersion = 1;\n', 'utf-8');

    initializeGitRepo(repoRoot, 'scratch-branch');

    const gitContext = await extractGitContext(repoRoot);

    expect(gitContext).toMatchObject({
      commitCount: 0,
      uncommittedCount: 1,
      headRef: 'scratch-branch',
      commitRef: null,
      repositoryState: 'dirty',
      isDetachedHead: false,
    });
    expect(gitContext.FILES).toEqual(expect.arrayContaining([
      expect.objectContaining({
        FILE_PATH: 'scripts/core/workflow.ts',
        ACTION: 'add',
        MODIFICATION_MAGNITUDE: expect.any(String),
      }),
    ]));
    expect(gitContext.summary).toContain('head scratch-branch');
    expect(gitContext.summary).toContain('state dirty');
    expect(gitContext.observations).toEqual(expect.arrayContaining([
      expect.objectContaining({
        title: 'Uncommitted add: scripts/core/workflow.ts',
        files: ['scripts/core/workflow.ts'],
      }),
    ]));
  });

  it('reports detached HEAD metadata without losing commit context', async () => {
    const repoRoot = makeTempRoot('speckit-detached-head-');
    const trackedFile = path.join(repoRoot, 'scripts', 'core', 'workflow.ts');

    fs.mkdirSync(path.dirname(trackedFile), { recursive: true });
    fs.writeFileSync(trackedFile, 'export const workflowVersion = 1;\n', 'utf-8');

    initializeGitRepo(repoRoot);
    execFileSync('git', ['add', '.'], { cwd: repoRoot, stdio: 'ignore' });
    execFileSync('git', ['commit', '-m', 'feat: add workflow seed'], { cwd: repoRoot, stdio: 'ignore' });
    const commitRef = readShortHead(repoRoot);
    execFileSync('git', ['checkout', '--detach'], { cwd: repoRoot, stdio: 'ignore' });

    const gitContext = await extractGitContext(repoRoot);

    expect(gitContext).toMatchObject({
      commitCount: 1,
      uncommittedCount: 0,
      headRef: 'HEAD',
      commitRef,
      repositoryState: 'clean',
      isDetachedHead: true,
    });
    expect(gitContext.summary).toContain('detached HEAD');
  });

  it('keeps the full capped diff window when history exceeds the recent-commit limit', async () => {
    const repoRoot = makeTempRoot('speckit-git-window-');
    const targetSpecFolder = path.join(repoRoot, '.opencode', 'specs', '02--system-spec-kit', '022-hybrid-rag-fusion', '009-perfect-session-capturing');

    fs.mkdirSync(targetSpecFolder, { recursive: true });
    fs.writeFileSync(path.join(targetSpecFolder, 'spec.md'), '# Spec\n', 'utf-8');

    initializeGitRepo(repoRoot);

    for (let index = 1; index <= 6; index += 1) {
      const fileName = `note-${index}.md`;
      fs.writeFileSync(path.join(targetSpecFolder, fileName), `Commit ${index}\n`, 'utf-8');
      execFileSync('git', ['add', '-f', '.'], { cwd: repoRoot, stdio: 'ignore' });
      execFileSync('git', ['commit', '-m', `docs: add note ${index}`], { cwd: repoRoot, stdio: 'ignore' });
    }

    const gitContext = await extractGitContext(repoRoot, targetSpecFolder);

    expect(gitContext.commitCount).toBe(6);
    expect(gitContext.FILES).toHaveLength(5);
    expect(gitContext.FILES).toEqual(expect.arrayContaining([
      expect.objectContaining({
        FILE_PATH: '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/note-2.md',
      }),
      expect.objectContaining({
        FILE_PATH: '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/note-6.md',
      }),
    ]));
    expect(gitContext.FILES).toEqual(expect.not.arrayContaining([
      expect.objectContaining({
        FILE_PATH: '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/note-1.md',
      }),
    ]));
  });

  it('does not over-match similarly named spec folders when file targets do not overlap', async () => {
    const repoRoot = makeTempRoot('speckit-git-boundary-');
    const targetSpecFolder = path.join(repoRoot, '.opencode', 'specs', '02--system-spec-kit', '022-hybrid-rag-fusion', '009-perfect-session-capturing');
    const foreignSpecFolder = `${targetSpecFolder}-archive`;

    fs.mkdirSync(targetSpecFolder, { recursive: true });
    fs.mkdirSync(foreignSpecFolder, { recursive: true });
    fs.writeFileSync(path.join(targetSpecFolder, 'spec.md'), '# Spec\n', 'utf-8');

    initializeGitRepo(repoRoot);
    execFileSync('git', ['add', '-f', '.'], { cwd: repoRoot, stdio: 'ignore' });
    execFileSync('git', ['commit', '-m', 'docs: add target spec shell'], { cwd: repoRoot, stdio: 'ignore' });

    fs.writeFileSync(path.join(foreignSpecFolder, 'notes.md'), 'Foreign spec note\n', 'utf-8');
    execFileSync('git', ['add', '-f', '.'], { cwd: repoRoot, stdio: 'ignore' });
    execFileSync('git', ['commit', '-m', 'docs: add foreign spec note'], { cwd: repoRoot, stdio: 'ignore' });

    const gitContext = await extractGitContext(repoRoot, targetSpecFolder);

    expect(gitContext.commitCount).toBe(1);
    expect(gitContext.FILES).toEqual(expect.arrayContaining([
      expect.objectContaining({
        FILE_PATH: '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/spec.md',
      }),
    ]));
    expect(gitContext.observations).toEqual(expect.arrayContaining([
      expect.objectContaining({
        title: 'docs: add target spec shell',
        files: ['.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/spec.md'],
      }),
    ]));
    expect(gitContext.FILES).toEqual(expect.not.arrayContaining([
      expect.objectContaining({
        FILE_PATH: '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing-archive/notes.md',
      }),
    ]));
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
