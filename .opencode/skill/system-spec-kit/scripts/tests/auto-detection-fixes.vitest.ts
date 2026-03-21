import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { buildSessionActivitySignal } from '../lib/session-activity-signal';
import { extractDecisions } from '../extractors/decision-extractor';
import { extractBlockers } from '../extractors/session-extractor';
import { TEST_HELPERS } from '../spec-folder/folder-detector';
import { buildRichSessionData } from './fixtures/session-data-factory';

const TEMPLATE_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'templates',
);

const tempRoots = new Set<string>();
const originalCwd = process.cwd();
const originalEnv = {
  MEMORY_DB_PATH: process.env.MEMORY_DB_PATH,
  SPEC_KIT_DB_DIR: process.env.SPEC_KIT_DB_DIR,
  MEMORY_ALLOWED_PATHS: process.env.MEMORY_ALLOWED_PATHS,
};

function createTempRoot(prefix: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempRoots.add(root);
  return root;
}

function writeFile(filePath: string, content: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function writeJson(filePath: string, value: unknown): void {
  writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function initGitRepo(root: string): void {
  execFileSync('git', ['init'], { cwd: root, stdio: 'ignore' });
  execFileSync('git', ['config', 'user.email', 'spec-kit@example.com'], { cwd: root, stdio: 'ignore' });
  execFileSync('git', ['config', 'user.name', 'Spec Kit Tests'], { cwd: root, stdio: 'ignore' });
}

function createDetectorRepo(): {
  root: string;
  specsDir: string;
  parentPath: string;
  childPaths: string[];
} {
  const root = createTempRoot('speckit-auto-detect-');
  const specsDir = path.join(root, '.opencode', 'specs');
  const parentPath = path.join(
    specsDir,
    '02--system-spec-kit',
    '022-hybrid-rag-fusion',
    '010-perfect-session-capturing',
  );
  const childPaths = [
    '001-quality-scorer-unification',
    '002-contamination-detection',
    '003-data-fidelity',
    '013-auto-detection-fixes',
  ].map((child) => path.join(parentPath, child));

  for (const folder of [parentPath, ...childPaths]) {
    fs.mkdirSync(folder, { recursive: true });
    writeFile(path.join(folder, 'spec.md'), `# ${path.basename(folder)}\n`);
  }

  initGitRepo(root);
  return { root, specsDir, parentPath, childPaths };
}

function createWorkflowHarness(): {
  root: string;
  specRelativePath: string;
  specFolderPath: string;
  contextDir: string;
  dataDir: string;
  dbDir: string;
  dataFile: string;
} {
  const root = createTempRoot('speckit-phase-013-workflow-');
  const specRelativePath = '02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/013-auto-detection-fixes';
  const specFolderPath = path.join(root, '.opencode', 'specs', specRelativePath);
  const contextDir = path.join(specFolderPath, 'memory');
  const dataDir = path.join(root, '.tmp-data');
  const dbDir = path.join(root, '.tmp-db');

  fs.mkdirSync(contextDir, { recursive: true });
  fs.mkdirSync(dataDir, { recursive: true });
  fs.mkdirSync(dbDir, { recursive: true });

  const longSpecBody = Array.from({ length: 40 }, (_, index) => (
    `This section explains the auto-detection fix ${index + 1} with enough detail to keep tree thinning from collapsing the spec into a synthetic placeholder row.`
  )).join('\n');

  writeFile(
    path.join(specFolderPath, 'spec.md'),
    [
      '---',
      'title: "Auto-Detection Fixes"',
      '---',
      '',
      '# Auto-Detection Fixes',
      '',
      longSpecBody,
      '',
      '## Files',
      '',
      '| File | Notes |',
      '|------|-------|',
      '| `spec.md` | Canonical phase spec |',
      '| `plan.md` | Implementation plan |',
      '| `tasks.md` | Task breakdown |',
    ].join('\n'),
  );
  writeFile(path.join(specFolderPath, 'plan.md'), '# Plan\n\nDetailed plan content for phase 013.\n');
  writeFile(path.join(specFolderPath, 'tasks.md'), '# Tasks\n\n- [ ] Verify detector signals\n');
  writeFile(path.join(specFolderPath, 'checklist.md'), '# Checklist\n\n- [ ] Confirm workflow render\n');
  writeJson(path.join(specFolderPath, 'description.json'), {
    specFolder: specRelativePath,
    description: 'Phase 013 workflow harness',
    keywords: ['auto detection', 'key files'],
    specId: '013',
    folderSlug: 'auto-detection-fixes',
    parentChain: ['02--system-spec-kit', '022-hybrid-rag-fusion', '010-perfect-session-capturing'],
    memorySequence: 0,
    memoryNameHistory: [],
  });

  const dataFile = path.join(dataDir, 'phase-013.json');
  writeJson(dataFile, {
    spec_folder: specRelativePath,
    session_summary: 'Implemented the phase 013 fixes and verified the rendered workflow metadata.',
    user_prompts: [
      {
        prompt: 'Implement the auto-detection fixes and verify the rendered memory metadata.',
        timestamp: '2026-03-16T12:00:00.000Z',
      },
    ],
    observations: [
      {
        type: 'implementation',
        title: 'Phase 013 workflow coverage',
        narrative: 'Validated the rendered memory metadata and key file selection for the auto-detection fixes phase.',
        facts: [
          'Tool: Read File: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/013-auto-detection-fixes/spec.md',
        ],
        files: ['spec.md', 'plan.md'],
        timestamp: '2026-03-16T12:05:00.000Z',
      },
    ],
    memory_classification: {
      memory_type: 'semantic',
      half_life_days: 120,
      decay_factors: {
        base_decay_rate: 0.91,
        access_boost_factor: 0.2,
        recency_weight: 0.7,
        importance_multiplier: 1.5,
      },
    },
    session_dedup: {
      memories_surfaced: 3,
      dedup_savings_tokens: 144,
      fingerprint_hash: 'phase-013-fingerprint',
      similar_memories: [
        { id: 'memory-101', similarity: 0.88 },
      ],
    },
    causal_links: {
      caused_by: ['memory-001'],
      supersedes: ['memory-002'],
      derived_from: ['memory-003'],
      blocks: ['memory-004'],
      related_to: ['memory-005'],
    },
  });

  return { root, specRelativePath, specFolderPath, contextDir, dataDir, dbDir, dataFile };
}

async function configureProjectRoot(root: string): Promise<void> {
  const coreModule = await import('../core');
  coreModule.CONFIG.PROJECT_ROOT = root;
  coreModule.CONFIG.TEMPLATE_DIR = TEMPLATE_DIR;
  coreModule.CONFIG.DATA_FILE = null;
  coreModule.CONFIG.SPEC_FOLDER_ARG = null;
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();

  if (originalEnv.MEMORY_DB_PATH === undefined) {
    delete process.env.MEMORY_DB_PATH;
  } else {
    process.env.MEMORY_DB_PATH = originalEnv.MEMORY_DB_PATH;
  }

  if (originalEnv.SPEC_KIT_DB_DIR === undefined) {
    delete process.env.SPEC_KIT_DB_DIR;
  } else {
    process.env.SPEC_KIT_DB_DIR = originalEnv.SPEC_KIT_DB_DIR;
  }

  if (originalEnv.MEMORY_ALLOWED_PATHS === undefined) {
    delete process.env.MEMORY_ALLOWED_PATHS;
  } else {
    process.env.MEMORY_ALLOWED_PATHS = originalEnv.MEMORY_ALLOWED_PATHS;
  }

  process.chdir(originalCwd);

  for (const root of tempRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  tempRoots.clear();
});

describe.sequential('phase 013 auto-detection fixes', () => {
  it('builds a session activity signal with tool, git, and transcript boosts', () => {
    const signal = buildSessionActivitySignal(
      {
        userPrompts: [
          {
            prompt: 'Review the 013-auto-detection-fixes phase before implementing the final detector changes.',
            timestamp: '2026-03-16T09:00:00.000Z',
          },
        ],
        observations: [
          {
            title: 'Read phase spec',
            narrative: 'Inspected the 013 auto detection fixes scope before coding.',
            facts: [
              'Tool: Read File: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/013-auto-detection-fixes/spec.md',
            ],
          },
          {
            title: 'Patch phase tasks',
            narrative: 'Updated the phase tasks after reviewing the detector.',
            facts: [
              'Tool: Edit File: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/013-auto-detection-fixes/tasks.md',
            ],
          },
        ],
        filesModified: [
          {
            path: '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/013-auto-detection-fixes/checklist.md',
          },
        ],
      },
      '02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/013-auto-detection-fixes',
    );

    expect(signal.toolCallPaths).toHaveLength(2);
    expect(signal.gitChangedFiles).toHaveLength(1);
    expect(signal.transcriptMentions).toHaveLength(2);
    // Derivation: Read(0.2) + Edit(0.3) + gitChanged(0.25) + transcriptMentions(2 × 0.1) = 0.95
    expect(signal.confidenceBoost).toBeCloseTo(0.95, 3);
  });

  // Covers: F-12 (Return empty decisions for null input; merge manual + observation decisions)
  it('suppresses observation-derived decision duplicates when manual decisions exist (SC-002: 4+4 → 4)', async () => {
    const manualTitles = [
      'Use git-status as a ranking signal for auto-detection.',
      'Narrow TOOL_READ_SET to exclude bash/task.',
      'Add parent-affinity boost for >3 active children.',
      'Use filesystem fallback when tree-thinning is empty.',
    ];
    const result = await extractDecisions({
      SPEC_FOLDER: '013-auto-detection-fixes',
      _manualDecisions: manualTitles,
      observations: manualTitles.map((title) => ({
        type: 'decision' as const,
        title,
        narrative: `Observation duplicate of: ${title}`,
        facts: ['Option A: chosen', 'Rationale: auto-extracted duplicate'],
      })),
      userPrompts: [],
    });

    // SC-002: 4 manual decisions produce exactly 4 records, not 8
    expect(result.DECISION_COUNT).toBe(4);
    expect(result.DECISIONS).toHaveLength(4);
  });

  // Covers: F-12 (Merge manual decisions with observation-extracted decisions)
  it('preserves observation decisions when no manual decisions exist', async () => {
    const result = await extractDecisions({
      SPEC_FOLDER: '013-auto-detection-fixes',
      _manualDecisions: [],
      observations: [
        {
          type: 'decision' as const,
          title: 'Use in-memory cache for git status.',
          narrative: 'Chose caching to avoid repeated shell calls.',
          facts: ['Option A: in-memory cache', 'Rationale: avoids repeated shell calls'],
        },
        {
          type: 'decision' as const,
          title: 'Narrow TOOL_READ_SET scope.',
          narrative: 'Decided to remove bash/task from read-equivalent set.',
          facts: ['Option A: narrow set', 'Rationale: spec says 0.2 for Read only'],
        },
      ],
      userPrompts: [],
    });

    // No manual decisions → observation decisions are preserved
    expect(result.DECISION_COUNT).toBe(2);
    expect(result.DECISIONS).toHaveLength(2);
  });

  it('rejects structural blocker artifacts and keeps real blocker text', () => {
    const blocker = extractBlockers([
      {
        narrative: "## 3. SCOPE blocked parsing\nWe are blocked by the API rate limit issue while saving the phase output.",
      },
    ]);

    expect(blocker).toContain('API rate limit issue');
    expect(blocker).not.toContain('## 3. SCOPE');
  });

  it('prefers the parent spec folder when git-status shows the highest activity there', async () => {
    const { root, parentPath } = createDetectorRepo();
    process.chdir(root);
    await configureProjectRoot(root);

    for (let index = 0; index < 24; index += 1) {
      writeFile(path.join(parentPath, `draft-${index + 1}.md`), `draft ${index + 1}\n`);
    }

    const { detectSpecFolder } = await import('../spec-folder/folder-detector');
    const detected = await detectSpecFolder(null);

    expect(detected).toBe(parentPath);
  });

  it('promotes the parent folder when many children are recently active', async () => {
    const { root, parentPath, childPaths } = createDetectorRepo();
    process.chdir(root);
    await configureProjectRoot(root);

    const now = Date.now() / 1000;
    fs.utimesSync(parentPath, now - 60, now - 60);
    childPaths.forEach((childPath, index) => {
      const childTime = now - (index + 1) * 30;
      fs.utimesSync(childPath, childTime, childTime);
    });

    const { detectSpecFolder } = await import('../spec-folder/folder-detector');
    const detected = await detectSpecFolder(null);

    expect(detected).toBe(parentPath);
  });

  it('renders filesystem-backed key_files and phase metadata into the saved memory', async () => {
    const harness = createWorkflowHarness();
    process.chdir(harness.root);
    process.env.MEMORY_DB_PATH = path.join(harness.dbDir, 'context-index.sqlite');
    process.env.SPEC_KIT_DB_DIR = harness.dbDir;
    process.env.MEMORY_ALLOWED_PATHS = [harness.root, harness.specFolderPath, harness.contextDir].join(path.delimiter);

    await configureProjectRoot(harness.root);
    const workflowModule = await import('../core/workflow');

    const result = await workflowModule.runWorkflow({
      dataFile: harness.dataFile,
      specFolderArg: harness.specFolderPath,
      collectSessionDataFn: async (_collectedData, specFolderName) => buildRichSessionData(specFolderName || harness.specRelativePath, {
        FILES: [
          { FILE_PATH: 'spec.md', DESCRIPTION: 'Spec' },
          { FILE_PATH: 'plan.md', DESCRIPTION: 'Plan' },
          { FILE_PATH: 'tasks.md', DESCRIPTION: 'Tasks' },
        ],
        FILE_COUNT: 3,
        HAS_FILES: true,
      }),
      silent: true,
    });

    const memoryPath = path.join(result.contextDir, result.contextFilename);
    const content = fs.readFileSync(memoryPath, 'utf8');

    expect(content).toContain('key_files:');
    expect(content).toContain('  - "spec.md"');
    expect(content).toContain('memory_classification:');
    expect(content).toContain('memory_type: "semantic"');
    expect(content).toContain('session_dedup:');
    expect(content).toContain('dedup_savings_tokens: 144');
    expect(content).toContain('fingerprint_hash: "phase-013-fingerprint"');
    expect(content).toContain('causal_links:');
    expect(content).toContain('  caused_by:');
    expect(content).toContain('    - "memory-001"');
  }, 30_000);

  it('marks tied git-status candidates as low confidence (Priority 2.7 fall-through guard)', () => {
    const now = Date.now();
    const confidence = TEST_HELPERS.assessGitStatusConfidence([
      { path: '/specs/02--system/022-rag/010-capturing/001-child-a', mtimeMs: now, gitStatusCount: 5 },
      { path: '/specs/02--system/022-rag/010-capturing/002-child-b', mtimeMs: now, gitStatusCount: 5 },
    ]);

    expect(confidence.lowConfidence).toBe(true);
    expect(confidence.reason).toContain('tie');
  });

  it('allows clear git-status winner through Priority 2.7 without falling through', () => {
    const now = Date.now();
    const confidence = TEST_HELPERS.assessGitStatusConfidence([
      { path: '/specs/02--system/022-rag/010-capturing/001-winner', mtimeMs: now, gitStatusCount: 10 },
      { path: '/specs/02--system/022-rag/010-capturing/002-loser', mtimeMs: now, gitStatusCount: 2 },
    ]);

    expect(confidence.lowConfidence).toBe(false);
    expect(confidence.reason).toContain('clear');
  });

  it('marks tied session-activity candidates as low confidence (Priority 3.5 fall-through guard)', () => {
    const now = Date.now();
    const confidence = TEST_HELPERS.assessSessionActivityConfidence([
      { path: '/specs/02--system/022-rag/010-capturing/001-child-a', mtimeMs: now, sessionActivityBoost: 0.8, sessionActivitySignalCount: 4 },
      { path: '/specs/02--system/022-rag/010-capturing/002-child-b', mtimeMs: now, sessionActivityBoost: 0.8, sessionActivitySignalCount: 4 },
    ]);

    expect(confidence.lowConfidence).toBe(true);
    expect(confidence.reason).toContain('tie');
  });

  it('allows clear session-activity winner through Priority 3.5 without falling through', () => {
    const now = Date.now();
    const confidence = TEST_HELPERS.assessSessionActivityConfidence([
      { path: '/specs/02--system/022-rag/010-capturing/001-winner', mtimeMs: now, sessionActivityBoost: 0.9, sessionActivitySignalCount: 6 },
      { path: '/specs/02--system/022-rag/010-capturing/002-loser', mtimeMs: now, sessionActivityBoost: 0.3, sessionActivitySignalCount: 2 },
    ]);

    expect(confidence.lowConfidence).toBe(false);
    expect(confidence.reason).toContain('clear');
  });

  it('resolves a full .opencode/specs/category/parent/child path via CLI argument', async () => {
    const { root, childPaths } = createDetectorRepo();
    process.chdir(root);
    await configureProjectRoot(root);

    const targetChild = childPaths[2]; // 003-data-fidelity
    const fullRelativePath = '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/003-data-fidelity';

    const { detectSpecFolder } = await import('../spec-folder/folder-detector');
    const detected = await detectSpecFolder(null, { specFolderArg: fullRelativePath });

    expect(detected).toBe(targetChild);
  });

  it('resolves a multi-segment child path without prefix via basename fallback', async () => {
    const { root, childPaths } = createDetectorRepo();
    process.chdir(root);
    await configureProjectRoot(root);

    const targetChild = childPaths[2]; // 003-data-fidelity
    // Multi-segment path without .opencode/specs/ prefix -- skips category prefix
    const multiSegmentPath = '022-hybrid-rag-fusion/010-perfect-session-capturing/003-data-fidelity';

    const { detectSpecFolder } = await import('../spec-folder/folder-detector');
    const detected = await detectSpecFolder(null, { specFolderArg: multiSegmentPath });

    expect(detected).toBe(targetChild);
  });

  it('resolves a bare child folder name via CLI argument child search', async () => {
    const { root, childPaths } = createDetectorRepo();
    process.chdir(root);
    await configureProjectRoot(root);

    const targetChild = childPaths[0]; // 001-quality-scorer-unification

    const { detectSpecFolder } = await import('../spec-folder/folder-detector');
    const detected = await detectSpecFolder(null, { specFolderArg: '001-quality-scorer-unification' });

    expect(detected).toBe(targetChild);
  });
});
