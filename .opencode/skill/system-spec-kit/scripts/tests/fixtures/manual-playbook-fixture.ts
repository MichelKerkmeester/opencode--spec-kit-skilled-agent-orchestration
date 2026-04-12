import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type IndexedMemory = {
  id: number;
  title: string;
  filePath: string;
  specFolder: string;
};

export type FixtureToolContext = {
  rootDir: string;
  dbDir: string;
  dbPath: string;
  reportDir: string;
  targetSpecSlug: string;
  sandboxSpecSlug: string;
  targetSpecFolder: string;
  sandboxSpecFolder: string;
  targetSpecAbsolute: string;
  sandboxSpecAbsolute: string;
  defaultCheckpointName: string;
  baselineCheckpointName: string;
  adminUserId: string;
  seededMemories: IndexedMemory[];
  primaryMemoryId: number | null;
  secondaryMemoryId: number | null;
  tertiaryMemoryId: number | null;
  edgeId: number | null;
  continuityFile: string;
  routedSaveFile: string;
  ingestFiles: string[];
  placeholders: Record<string, string>;
  reset: () => Promise<void>;
  cleanup: () => void;
};

const FIXTURE_PREFIX = 'gate-i-manual-playbook-';
const TARGET_SPEC_SLUG = '001-manual-fixture-auth-resume';
const SANDBOX_SPEC_SLUG = '002-test-sandbox';
const ADMIN_USER_ID = 'gate-i-admin-user';
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(SCRIPT_DIR, '..', '..');
const REPO_ROOT = path.resolve(SKILL_ROOT, '..', '..', '..', '..');

type ContinuitySeed = {
  packetPointer: string;
  recentAction: string;
  nextSafeAction: string;
  completionPct: number;
  keyFiles: string[];
};

type IndexMemoryFileFn = (
  filePath: string,
  options: { force: boolean; asyncEmbedding: boolean; qualityGateMode?: 'enforce' | 'warn-only' },
) => Promise<{ id?: number; status?: string } | null | undefined>;

type VectorIndexModule = {
  closeDb: () => void;
  initializeDb: (dbPath: string) => void;
  getDb: () => unknown;
  vectorSearch?: (embedding: Float32Array | number[], options: Record<string, unknown>) => Array<Record<string, unknown>>;
};

type InitDbStateFn = (deps: {
  graphSearchFn?: null;
  vectorIndex?: VectorIndexModule;
  checkpoints?: { init: (database: unknown) => void };
  accessTracker?: { init: (database: unknown) => void };
  hybridSearch?: {
    init: (
      database: unknown,
      vectorSearch: VectorIndexModule['vectorSearch'],
      graphSearch?: null,
    ) => void;
  };
  sessionManager?: { init: (database: unknown) => { success: boolean; error?: string } };
  dbConsumers?: Array<{ init: (database: unknown) => unknown }>;
}) => void;

type UpsertThinContinuityFn = (
  markdown: string,
  payload: {
    packet_pointer: string;
    last_updated_at: string;
    last_updated_by: string;
    recent_action: string;
    next_safe_action: string;
    blockers: string[];
    key_files: string[];
    completion_pct: number;
    open_questions: string[];
    answered_questions: string[];
  },
) => { ok?: boolean; markdown?: string };

function writeFile(filePath: string, content: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function makeFrontmatter(title: string, description: string, contextType: string = 'implementation'): string[] {
  return [
    '---',
    `title: "${title}"`,
    `description: "${description}"`,
    'trigger_phrases:',
    `  - "${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}"`,
    'importance_tier: "normal"',
    `contextType: "${contextType}"`,
    '---',
    '',
  ];
}

function buildSpecDoc(
  title: string,
  description: string,
  bodySections: Array<{ anchorId?: string; heading: string; body: string }>,
  continuity?: ContinuitySeed,
  upsertThinContinuityInMarkdown?: UpsertThinContinuityFn,
): string {
  const base = [
    ...makeFrontmatter(title, description, 'implementation'),
    `# ${title}`,
    '',
    ...bodySections.flatMap((section) => {
      const lines: string[] = [];
      if (section.anchorId) {
        lines.push(`<!-- ANCHOR:${section.anchorId} -->`);
      }
      lines.push(section.heading, '', section.body);
      if (section.anchorId) {
        lines.push(`<!-- /ANCHOR:${section.anchorId} -->`);
      }
      lines.push('');
      return lines;
    }),
  ].join('\n');

  if (!continuity) {
    return base;
  }

  if (!upsertThinContinuityInMarkdown) {
    throw new Error(`Missing continuity helper for "${title}"`);
  }

  const updated = upsertThinContinuityInMarkdown(base, {
    packet_pointer: continuity.packetPointer,
    last_updated_at: '2026-04-12T08:00:00Z',
    last_updated_by: 'gate-i-runner',
    recent_action: continuity.recentAction,
    next_safe_action: continuity.nextSafeAction,
    blockers: ['none'],
    key_files: continuity.keyFiles,
    completion_pct: continuity.completionPct,
    open_questions: ['Q1'],
    answered_questions: ['Q2'],
  });

  if (!updated.ok || !updated.markdown) {
    throw new Error(`Failed to build continuity fixture for "${title}"`);
  }

  return updated.markdown;
}

function buildMemoryDoc(title: string, description: string, lines: string[]): string {
  return [
    ...makeFrontmatter(title, description, 'implementation'),
    `# ${title}`,
    '',
    '## SESSION SUMMARY',
    '',
    '| **Meta Data** | **Value** |',
    '|:--------------|:----------|',
    '| Scenario | Gate I manual playbook fixture |',
    '',
    '<!-- ANCHOR:continue-session -->',
    '',
    '## CONTINUE SESSION',
    '',
    'Continue from the last stable checkpoint while validating retrieval, save, checkpoint, and governance workflows.',
    '',
    '<!-- /ANCHOR:continue-session -->',
    '',
    '<!-- ANCHOR:overview -->',
    '',
    '## OVERVIEW',
    '',
    ...lines,
    '',
    '<!-- /ANCHOR:overview -->',
    '',
    '<!-- ANCHOR:recovery-hints -->',
    '',
    '## RECOVERY HINTS',
    '',
    '- Re-run the runner with a fresh disposable DB.',
    '- Confirm the seeded spec doc and continuity anchors still exist.',
    '',
    '<!-- /ANCHOR:recovery-hints -->',
    '',
    '<!-- ANCHOR:metadata -->',
    '',
    '## MEMORY METADATA',
    '',
    '```yaml',
    'session_id: "gate-i-fixture"',
    'fixture: true',
    '```',
    '',
    '<!-- /ANCHOR:metadata -->',
    '',
  ].join('\n');
}

async function indexSeed(
  filePath: string,
  title: string,
  specFolder: string,
  indexMemoryFile: IndexMemoryFileFn,
): Promise<IndexedMemory> {
  const result = await indexMemoryFile(filePath, {
    force: true,
    asyncEmbedding: false,
    qualityGateMode: 'warn-only',
  });
  if (!result || typeof result.id !== 'number' || result.id <= 0) {
    throw new Error(`Failed to seed memory for ${filePath}`);
  }
  return {
    id: result.id,
    title,
    filePath,
    specFolder,
  };
}

function applyFixtureEnv(rootDir: string, dbDir: string, dbPath: string): void {
  const rootRealDir = fs.realpathSync.native(rootDir);
  const tempRealDir = fs.realpathSync.native(os.tmpdir());
  const allowedRoots = new Set<string>([
    rootDir,
    rootRealDir,
    tempRealDir,
    path.join(rootDir, '.opencode'),
    path.join(rootRealDir, '.opencode'),
    path.join(rootDir, 'specs'),
    path.join(rootRealDir, 'specs'),
  ]);
  const allowed = Array.from(allowedRoots).join(path.delimiter);

  process.env.MEMORY_ALLOWED_PATHS = allowed;
  process.env.MEMORY_BASE_PATH = tempRealDir;
  process.env.SPEC_KIT_DB_DIR = dbDir;
  process.env.SPECKIT_DB_DIR = dbDir;
  process.env.MEMORY_DB_PATH = dbPath;
  process.env.SPECKIT_ABLATION = 'true';
  process.env.EMBEDDINGS_PROVIDER = 'hf-local';
  delete process.env.VOYAGE_API_KEY;
  delete process.env.OPENAI_API_KEY;
}

function initializeHandlerRuntime(
  database: unknown,
  vectorIndex: VectorIndexModule,
  initDbState: InitDbStateFn,
  checkpoints: { init: (db: unknown) => void },
  accessTracker: { init: (db: unknown) => void },
  hybridSearch: {
    init: (db: unknown, vectorSearch: VectorIndexModule['vectorSearch'], graphSearch?: null) => void;
  },
  sessionBoost: { init: (db: unknown) => void },
  causalBoost: { init: (db: unknown) => void },
  workingMemory: { init: (db: unknown) => void },
  attentionDecay: { init: (db: unknown) => void },
  coActivation: { init: (db: unknown) => void },
  sessionManager: { init: (db: unknown) => { success: boolean; error?: string } },
): void {
  checkpoints.init(database);
  accessTracker.init(database);
  hybridSearch.init(database, vectorIndex.vectorSearch, null);
  initDbState({
    graphSearchFn: null,
    vectorIndex,
    checkpoints,
    accessTracker,
    hybridSearch,
    sessionManager,
    dbConsumers: [sessionBoost, causalBoost, workingMemory, attentionDecay, coActivation],
  });
  sessionBoost.init(database);
  causalBoost.init(database);
  workingMemory.init(database);
  attentionDecay.init(database);
  coActivation.init(database);
  const sessionInit = sessionManager.init(database);
  if (!sessionInit.success) {
    throw new Error(sessionInit.error ?? 'Failed to initialize session manager for manual playbook fixture');
  }
}

export async function createManualPlaybookFixture(specFolder: string): Promise<FixtureToolContext> {
  const tempBaseDir = path.join(SKILL_ROOT, '.tmp');
  fs.mkdirSync(tempBaseDir, { recursive: true });
  const rootDir = fs.mkdtempSync(path.join(tempBaseDir, FIXTURE_PREFIX));
  const dbDir = path.join(rootDir, 'db');
  const dbPath = path.join(dbDir, 'context-index.sqlite');
  const baselineDbPath = path.join(dbDir, 'context-index.baseline.sqlite');
  const reportDir = path.join(
    REPO_ROOT,
    '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/scratch/gate-i-execution-report',
  );

  const targetSpecFolder = `specs/${TARGET_SPEC_SLUG}`;
  const sandboxSpecFolder = `specs/${SANDBOX_SPEC_SLUG}`;
  const targetSpecAbsolute = path.join(rootDir, targetSpecFolder);
  const sandboxSpecAbsolute = path.join(rootDir, sandboxSpecFolder);
  const continuityFile = path.join(targetSpecAbsolute, 'implementation-summary.md');
  const routedSaveFile = path.join(targetSpecAbsolute, 'decision-record.md');
  const sandboxSpecDoc = path.join(sandboxSpecAbsolute, 'spec.md');
  const sandboxFile = path.join(sandboxSpecAbsolute, 'memory', 'sandbox-extra.md');
  const thinSandboxFile = path.join(sandboxSpecAbsolute, 'memory', 'thin-sandbox.md');
  const richSandboxFile = path.join(sandboxSpecAbsolute, 'memory', 'rich-sandbox.md');
  const ingestFiles = [
    path.join(sandboxSpecAbsolute, 'memory', 'ingest-alpha.md'),
    path.join(sandboxSpecAbsolute, 'memory', 'ingest-beta.md'),
  ];

  fs.mkdirSync(dbDir, { recursive: true });
  applyFixtureEnv(rootDir, dbDir, dbPath);
  const { indexMemoryFile } = await import('../../../mcp_server/dist/handlers/memory-save.js');
  const {
    handleCheckpointCreate,
    handleMemoryCausalLink,
    setEmbeddingModelReady,
  } = await import('../../../mcp_server/dist/handlers/index.js');
  const vectorIndex = await import('../../../mcp_server/dist/lib/search/vector-index.js') as VectorIndexModule;
  const { init: initDbState } = await import('../../../mcp_server/dist/core/index.js') as { init: InitDbStateFn };
  const checkpoints = await import('../../../mcp_server/dist/lib/storage/checkpoints.js') as { init: (db: unknown) => void };
  const accessTracker = await import('../../../mcp_server/dist/lib/storage/access-tracker.js') as { init: (db: unknown) => void };
  const hybridSearch = await import('../../../mcp_server/dist/lib/search/hybrid-search.js') as {
    init: (db: unknown, vectorSearch: VectorIndexModule['vectorSearch'], graphSearch?: null) => void;
  };
  const sessionBoost = await import('../../../mcp_server/dist/lib/search/session-boost.js') as { init: (db: unknown) => void };
  const causalBoost = await import('../../../mcp_server/dist/lib/search/causal-boost.js') as { init: (db: unknown) => void };
  const workingMemory = await import('../../../mcp_server/dist/lib/cognitive/working-memory.js') as { init: (db: unknown) => void };
  const attentionDecay = await import('../../../mcp_server/dist/lib/cognitive/attention-decay.js') as { init: (db: unknown) => void };
  const coActivation = await import('../../../mcp_server/dist/lib/cognitive/co-activation.js') as { init: (db: unknown) => void };
  const sessionManager = await import('../../../mcp_server/dist/lib/session/session-manager.js') as {
    init: (db: unknown) => { success: boolean; error?: string };
    shutdown?: () => void;
  };
  const { upsertThinContinuityInMarkdown } = await import('../../../mcp_server/dist/lib/continuity/thin-continuity-record.js');

  vectorIndex.closeDb();
  vectorIndex.initializeDb(dbPath);
  const database = vectorIndex.getDb();
  if (!database) {
    throw new Error('Fixture database did not initialize');
  }
  initializeHandlerRuntime(
    database,
    vectorIndex,
    initDbState,
    checkpoints,
    accessTracker,
    hybridSearch,
    sessionBoost,
    causalBoost,
    workingMemory,
    attentionDecay,
    coActivation,
    sessionManager,
  );
  await setEmbeddingModelReady(true);

  const packetPointer = 'system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor';
  writeFile(
    path.join(targetSpecAbsolute, 'handover.md'),
    buildSpecDoc(
      'Gate I Fixture Handover',
      'Fixture handover for canonical resume tests.',
      [
        {
          heading: '## STATE',
          body: 'Resume from the handover first. The index scan retry fix lives in the auth resume packet.',
        },
        {
          heading: '## NEXT STEPS',
          body: 'Run session resume, then inspect checkpoint rollback and graph diagnostics.',
        },
      ],
      {
        packetPointer,
        recentAction: 'Prepared resume handover',
        nextSafeAction: 'Run /spec_kit:resume for the target spec',
        completionPct: 72,
        keyFiles: ['handover.md', 'implementation-summary.md'],
      },
      upsertThinContinuityInMarkdown,
    ),
  );

  writeFile(
    path.join(targetSpecAbsolute, 'spec.md'),
    buildSpecDoc(
      'Auth Resume Spec',
      'Target spec for Gate I retrieval and save scenarios.',
      [
        {
          anchorId: 'state',
          heading: '## STATE',
          body: 'The auth resume packet tracks flaky index scan retry logic, checkpoint rollback semantics, and focused recovery guidance.',
        },
        {
          anchorId: 'next-steps',
          heading: '## NEXT STEPS',
          body: 'Verify memory_context resume mode, then confirm memory_search and checkpoint flows remain stable.',
        },
      ],
      {
        packetPointer,
        recentAction: 'Documented auth resume plan',
        nextSafeAction: 'Verify memory_context and memory_search',
        completionPct: 58,
        keyFiles: ['spec.md', 'tasks.md'],
      },
      upsertThinContinuityInMarkdown,
    ),
  );

  writeFile(
    path.join(targetSpecAbsolute, 'plan.md'),
    buildSpecDoc(
      'Auth Resume Plan',
      'Execution plan for auth resume fixture.',
      [
        {
          heading: '## PLAN',
          body: '1. Recover context. 2. Run checkpoint rollback validation. 3. Verify graph diagnostics and feature-flag explanations.',
        },
      ],
      {
        packetPointer,
        recentAction: 'Planned auth resume verification',
        nextSafeAction: 'Run checkpoint create and restore',
        completionPct: 61,
        keyFiles: ['plan.md'],
      },
      upsertThinContinuityInMarkdown,
    ),
  );

  writeFile(
    path.join(targetSpecAbsolute, 'tasks.md'),
    buildSpecDoc(
      'Auth Resume Tasks',
      'Task tracker for the Gate I fixture packet.',
      [
        {
          heading: '## TASKS',
          body: '- [ ] Fix flaky index scan retry logic\n- [ ] Verify checkpoint restore clearExisting rollback\n- [ ] Explain graph rollout diagnostics',
        },
      ],
      {
        packetPointer,
        recentAction: 'Queued checkpoint tasks',
        nextSafeAction: 'Run focused memory_context after resume',
        completionPct: 49,
        keyFiles: ['tasks.md'],
      },
      upsertThinContinuityInMarkdown,
    ),
  );

  writeFile(
    continuityFile,
    buildSpecDoc(
      'Auth Resume Implementation Summary',
      'Implementation summary with canonical continuity block.',
      [
        {
          anchorId: '_memory.continuity',
          heading: '## _MEMORY.CONTINUITY',
          body: 'Thin continuity record preserved for canonical resume readback.',
        },
        {
          heading: '## SUMMARY',
          body: 'Checkpoint restore uses transaction rollback guarantees. Graph rollout diagnostics remain stable. Governance relies on tenant and actor identity.',
        },
      ],
      {
        packetPointer,
        recentAction: 'Saved continuity state',
        nextSafeAction: 'Verify resume ladder reads handover then continuity',
        completionPct: 76,
        keyFiles: ['implementation-summary.md', 'decision-record.md'],
      },
      upsertThinContinuityInMarkdown,
    ),
  );

  writeFile(
    routedSaveFile,
    buildSpecDoc(
      'Auth Resume Decision Record',
      'Decision record used as a routed save target.',
      [
        {
          anchorId: 'decisions',
          heading: '## DECISIONS',
          body: 'Save routed content into the decision record when the session chunk contains durable architectural choices about checkpoint rollback or graph rollout diagnostics.',
        },
      ],
      {
        packetPointer,
        recentAction: 'Prepared routed save anchor',
        nextSafeAction: 'Run routed continuity save through memory_save',
        completionPct: 64,
        keyFiles: ['decision-record.md'],
      },
      upsertThinContinuityInMarkdown,
    ),
  );

  writeFile(
    sandboxSpecDoc,
    buildSpecDoc('Sandbox Spec', 'Disposable sandbox spec for destructive scenarios.', [
      {
        heading: '## OVERVIEW',
        body: 'This disposable sandbox is safe for delete, bulk-delete, checkpoint, and ingest scenarios.',
      },
    ]),
  );

  writeFile(
    path.join(sandboxSpecAbsolute, 'plan.md'),
    buildSpecDoc('Sandbox Plan', 'Disposable sandbox plan.', [
      {
        heading: '## PLAN',
        body: 'Create checkpoints first, then run destructive scenarios, then inspect rollback health.',
      },
    ]),
  );

  writeFile(
    path.join(sandboxSpecAbsolute, 'tasks.md'),
    buildSpecDoc('Sandbox Tasks', 'Disposable sandbox tasks.', [
      {
        heading: '## TASKS',
        body: '- [ ] Create checkpoint\n- [ ] Delete a seeded memory\n- [ ] Restore if needed',
      },
    ]),
  );

  const memoryDocs: Array<{ title: string; filePath: string; specFolder: string; content: string }> = [
    {
      title: 'Checkpoint Rollback Runbook',
      filePath: path.join(targetSpecAbsolute, 'memory', 'checkpoint-rollback.md'),
      specFolder: targetSpecFolder,
      content: buildMemoryDoc('Checkpoint Rollback Runbook', 'Checkpoint restore and rollback guidance.', [
        'Checkpoint restore uses clearExisting transaction rollback semantics.',
        'When rollback fails, inspect checkpoint list and memory health diagnostics.',
      ]),
    },
    {
      title: 'Graph Rollout Diagnostics',
      filePath: path.join(targetSpecAbsolute, 'memory', 'graph-rollout-diagnostics.md'),
      specFolder: targetSpecFolder,
      content: buildMemoryDoc('Graph Rollout Diagnostics', 'Graph rollout trace and diagnostics.', [
        'Graph diagnostics stable ordering relies on bounded graph walk contributions and trace metadata.',
        'Result explainability includes graphContribution fields when trace is enabled.',
      ]),
    },
    {
      title: 'Governed Memory Notes',
      filePath: path.join(targetSpecAbsolute, 'memory', 'governed-memory-notes.md'),
      specFolder: targetSpecFolder,
      content: buildMemoryDoc('Governed Memory Notes', 'Governed memory behavior.', [
        'Actor identity and tenant scoping are required for governed memory operations.',
        'Resume and save flows stay inside the caller-provided tenant and actor scope.',
      ]),
    },
    {
      title: 'Feature Flag DB Path Precedence',
      filePath: path.join(targetSpecAbsolute, 'memory', 'feature-flag-db-path.md'),
      specFolder: targetSpecFolder,
      content: buildMemoryDoc('Feature Flag DB Path Precedence', 'Database path precedence notes.', [
        'SPEC_KIT_DB_DIR and SPECKIT_DB_DIR override default database discovery.',
        'MEMORY_DB_PATH points directly to context-index.sqlite for disposable fixtures.',
      ]),
    },
    {
      title: 'Index Scan Retry Stability',
      filePath: path.join(targetSpecAbsolute, 'memory', 'index-scan-retry.md'),
      specFolder: targetSpecFolder,
      content: buildMemoryDoc('Index Scan Retry Stability', 'Index scan retry stability notes.', [
        'Fix flaky index scan retry logic by checking resume context before broad search.',
        'memory_context focused mode should fill only the missing gaps.',
      ]),
    },
    {
      title: 'Sandbox Temporary Memory A',
      filePath: path.join(sandboxSpecAbsolute, 'memory', 'temporary-a.md'),
      specFolder: sandboxSpecFolder,
      content: buildMemoryDoc('Sandbox Temporary Memory A', 'Temporary sandbox memory for deletion.', [
        'Temporary sandbox record A used for checkpoint and delete coverage.',
      ]),
    },
    {
      title: 'Sandbox Temporary Memory B',
      filePath: path.join(sandboxSpecAbsolute, 'memory', 'temporary-b.md'),
      specFolder: sandboxSpecFolder,
      content: buildMemoryDoc('Sandbox Temporary Memory B', 'Temporary sandbox memory for bulk delete.', [
        'Temporary sandbox record B used for bulk delete coverage.',
      ]),
    },
    {
      title: 'Anchored Retrieval Reference',
      filePath: path.join(targetSpecAbsolute, 'memory', 'anchored-retrieval.md'),
      specFolder: targetSpecFolder,
      content: buildMemoryDoc('Anchored Retrieval Reference', 'Anchored retrieval reference memory.', [
        'Anchored retrieval should preserve state and next-steps sections.',
        'This memory intentionally includes auth and checkpoint phrases for fuzzy retrieval.',
      ]),
    },
    {
      title: 'Anchored Decision Trail',
      filePath: path.join(targetSpecAbsolute, 'memory', 'anchored-decision-trail.md'),
      specFolder: targetSpecFolder,
      content: buildMemoryDoc('Anchored Decision Trail', 'Anchored decision trail memory.', [
        'Decision trail references checkpoint rollback and graph diagnostics together.',
        'Used as the causal-link source in fixture setup.',
      ]),
    },
    {
      title: 'Ingest Alpha',
      filePath: ingestFiles[0],
      specFolder: sandboxSpecFolder,
      content: buildMemoryDoc('Ingest Alpha', 'Ingest fixture alpha.', [
        'Async ingest alpha file for lifecycle coverage.',
      ]),
    },
    {
      title: 'Ingest Beta',
      filePath: ingestFiles[1],
      specFolder: sandboxSpecFolder,
      content: buildMemoryDoc('Ingest Beta', 'Ingest fixture beta.', [
        'Async ingest beta file for lifecycle coverage.',
      ]),
    },
    {
      title: 'Sandbox Extra',
      filePath: sandboxFile,
      specFolder: sandboxSpecFolder,
      content: buildMemoryDoc('Sandbox Extra', 'Additional sandbox file for manual playbook placeholders.', [
        'Unique sandbox phrase for retrieval checks and force-save coverage.',
      ]),
    },
    {
      title: 'Thin Sandbox Memory',
      filePath: thinSandboxFile,
      specFolder: sandboxSpecFolder,
      content: buildMemoryDoc('Thin Sandbox Memory', 'Minimal sandbox memory file.', [
        'Thin sandbox content for dry-run and preflight checks.',
      ]),
    },
    {
      title: 'Rich Sandbox Memory',
      filePath: richSandboxFile,
      specFolder: sandboxSpecFolder,
      content: buildMemoryDoc('Rich Sandbox Memory', 'Rich sandbox memory file.', [
        'Rich sandbox content includes continuity, evidence, and retrieval vocabulary.',
      ]),
    },
  ];

  const seededMemories: IndexedMemory[] = [];
  for (const doc of memoryDocs) {
    writeFile(doc.filePath, doc.content);
    seededMemories.push(await indexSeed(doc.filePath, doc.title, doc.specFolder, indexMemoryFile));
  }

  const primaryMemoryId = seededMemories.find((row) => row.title === 'Checkpoint Rollback Runbook')?.id ?? null;
  const secondaryMemoryId = seededMemories.find((row) => row.title === 'Graph Rollout Diagnostics')?.id ?? null;
  const tertiaryMemoryId = seededMemories.find((row) => row.title === 'Shared Memory Governance Notes')?.id ?? null;

  let edgeId: number | null = null;
  if (primaryMemoryId && secondaryMemoryId) {
    const linkResponse = await handleMemoryCausalLink({
      sourceId: String(primaryMemoryId),
      targetId: String(secondaryMemoryId),
      relation: 'supports',
      strength: 0.8,
    });
    try {
      const parsed = JSON.parse(linkResponse.content[0]?.text ?? '{}') as { data?: { edgeId?: number } };
      if (typeof parsed.data?.edgeId === 'number') {
        edgeId = parsed.data.edgeId;
      }
    } catch {
      edgeId = null;
    }
  }

  const placeholders: Record<string, string> = {
    '<target-spec>': TARGET_SPEC_SLUG,
    '<sandbox-spec>': SANDBOX_SPEC_SLUG,
    '<spec-folder>': targetSpecFolder,
    '<target-spec-folder>': targetSpecFolder,
    '<known-spec>': targetSpecFolder,
    '<checkpoint-name>': 'gate-i-checkpoint',
    '<memory-id>': String(primaryMemoryId ?? 1),
    '<memory-id-a>': String(primaryMemoryId ?? 1),
    '<memory-id-b>': String(secondaryMemoryId ?? 2),
    '<edge-id>': String(edgeId ?? 1),
    '<job-id>': 'job_pending',
    '<target-spec-path>': targetSpecFolder,
    '<sandbox-spec-doc>': sandboxSpecDoc,
    '<sandbox-file>': sandboxFile,
    '<thin-sandbox-file>': thinSandboxFile,
    '<rich-sandbox-file>': richSandboxFile,
    '<thin title>': 'Thin Sandbox Memory',
    '<unique phrase from sandbox spec doc>': 'Disposable sandbox is safe for delete, bulk-delete, checkpoint, and ingest scenarios.',
    '<decision rationale>': 'checkpoint restore clearExisting rollback',
    '<specific decision>': 'checkpoint restore rollback',
    '<key term from agent session>': 'checkpoint rollback',
    '<semantic query>': 'checkpoint rollback stability',
    '<title of saved memory>': 'Checkpoint Rollback Runbook',
    '<feature>': 'checkpoint rollback',
    '<phase-parent>': targetSpecFolder,
    '<project-hash>': 'gate-i-project-hash',
    '<session-id>': 'gate-i-session-id',
    '<payload>': '{"specFolder":"specs/001-manual-fixture-auth-resume","sessionSummary":"Gate I fixture payload"}',
    '<json-data-file>': path.join(rootDir, 'payload.json'),
  };

  writeFile(placeholders['<json-data-file>'], placeholders['<payload>']);

  const baselineCheckpointName = 'gate-i-fixture-baseline';
  const defaultCheckpointResult = await handleCheckpointCreate({ name: 'gate-i-checkpoint' });
  const defaultCheckpointSummary = typeof defaultCheckpointResult?.content?.[0]?.text === 'string'
    ? defaultCheckpointResult.content[0].text
    : '';
  if (!/"success"\s*:\s*true/.test(defaultCheckpointSummary)) {
    throw new Error(`Failed to create default checkpoint: ${defaultCheckpointSummary || 'no response body'}`);
  }
  const baselineCheckpoint = await handleCheckpointCreate({ name: baselineCheckpointName });
  const baselineSummary = typeof baselineCheckpoint?.content?.[0]?.text === 'string'
    ? baselineCheckpoint.content[0].text
    : '';
  if (!/"success"\s*:\s*true/.test(baselineSummary)) {
    throw new Error(`Failed to create baseline checkpoint: ${baselineSummary || 'no response body'}`);
  }
  fs.copyFileSync(dbPath, baselineDbPath);

  const reset = async (): Promise<void> => {
    sessionManager.shutdown?.();
    vectorIndex.closeDb();
    fs.copyFileSync(baselineDbPath, dbPath);
    vectorIndex.initializeDb(dbPath);
    const databaseAfterReset = vectorIndex.getDb();
    if (!databaseAfterReset) {
      throw new Error('Fixture database did not reinitialize during reset');
    }
    initializeHandlerRuntime(
      databaseAfterReset,
      vectorIndex,
      initDbState,
      checkpoints,
      accessTracker,
      hybridSearch,
      sessionBoost,
      causalBoost,
      workingMemory,
      attentionDecay,
      coActivation,
      sessionManager,
    );
    await setEmbeddingModelReady(true);
  };

  const cleanup = (): void => {
    try {
      sessionManager.shutdown?.();
    } catch {
      // Ignore cleanup errors for disposable fixtures.
    }
    try {
      vectorIndex.closeDb();
    } catch {
      // Ignore cleanup errors for disposable fixtures.
    }
    fs.rmSync(rootDir, { recursive: true, force: true });
  };

  return {
    rootDir,
    dbDir,
    dbPath,
    reportDir,
    targetSpecSlug: TARGET_SPEC_SLUG,
    sandboxSpecSlug: SANDBOX_SPEC_SLUG,
    targetSpecFolder,
    sandboxSpecFolder,
    targetSpecAbsolute,
    sandboxSpecAbsolute,
    defaultCheckpointName: 'gate-i-checkpoint',
    baselineCheckpointName,
    adminUserId: ADMIN_USER_ID,
    seededMemories,
    primaryMemoryId,
    secondaryMemoryId,
    tertiaryMemoryId,
    edgeId,
    continuityFile,
    routedSaveFile,
    ingestFiles,
    placeholders,
    reset,
    cleanup,
  };
}
