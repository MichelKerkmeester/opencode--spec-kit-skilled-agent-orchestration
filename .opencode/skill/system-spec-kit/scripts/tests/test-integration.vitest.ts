// ───────────────────────────────────────────────────────────────
// MODULE: Integration Tests
// ───────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

/* ───────────────────────────────────────────────────────────────
   1. CONSTANTS
──────────────────────────────────────────────────────────────── */

// CJS require bridge: dist files are CommonJS, Vitest runs ESM
const require = createRequire(import.meta.url);
const SKILL_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const SCRIPTS_DIR = path.join(SKILL_ROOT, 'scripts');
const MCP_SERVER_DIR = path.join(SKILL_ROOT, 'mcp_server');
const TEMPLATES_DIR = path.join(SKILL_ROOT, 'templates');
const createdTempRoots = new Set<string>();

/* ───────────────────────────────────────────────────────────────
   2. HELPERS
──────────────────────────────────────────────────────────────── */

function makeTempWorkspace(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-integration-'));
  createdTempRoots.add(root);
  return root;
}

function copyTemplateFiles(sourceDir: string, destDir: string): void {
  for (const entry of fs.readdirSync(sourceDir)) {
    if (!entry.endsWith('.md')) {
      continue;
    }
    fs.copyFileSync(path.join(sourceDir, entry), path.join(destDir, entry));
  }
}

function createTestSpecFolder(workspaceRoot: string, name: string, level: number): string {
  const specsDir = path.join(workspaceRoot, 'specs');
  const specPath = path.join(specsDir, name);
  const templateDir = path.join(TEMPLATES_DIR, `level_${level}`);

  fs.mkdirSync(path.join(specPath, 'memory'), { recursive: true });
  fs.mkdirSync(path.join(specPath, 'scratch'), { recursive: true });

  if (fs.existsSync(templateDir)) {
    copyTemplateFiles(templateDir, specPath);
  } else {
    fs.writeFileSync(path.join(specPath, 'spec.md'), `# ${name}\n\n| **Level** | ${level} |\n`, 'utf-8');
    fs.writeFileSync(path.join(specPath, 'plan.md'), '# Plan\n', 'utf-8');
    fs.writeFileSync(path.join(specPath, 'tasks.md'), '# Tasks\n', 'utf-8');
    if (level >= 2) {
      fs.writeFileSync(path.join(specPath, 'checklist.md'), '# Checklist\n', 'utf-8');
    }
    if (level >= 3) {
      fs.writeFileSync(path.join(specPath, 'decision-record.md'), '# Decision Record\n', 'utf-8');
    }
  }

  fs.writeFileSync(path.join(specPath, 'memory', '.gitkeep'), '', 'utf-8');
  fs.writeFileSync(path.join(specPath, 'scratch', '.gitkeep'), '', 'utf-8');
  return specPath;
}

function runBashScript(workspaceRoot: string, scriptRelativePath: string, args: string[] = []): {
  exitCode: number;
  stdout: string;
  stderr: string;
} {
  const dbPath = path.join(workspaceRoot, 'test-context-index.sqlite');
  const result = spawnSync('bash', [path.join(SCRIPTS_DIR, scriptRelativePath), ...args], {
    cwd: workspaceRoot,
    encoding: 'utf-8',
    env: {
      ...process.env,
      MEMORY_DB_PATH: dbPath,
      SPECKIT_SPECS_DIR: path.join(workspaceRoot, 'specs'),
    },
  });

  return {
    exitCode: result.status ?? 1,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

function parseValidationJson(stdout: string): { results?: Array<{ rule?: string; status?: string }> } | null {
  const match = stdout.match(/\{[\s\S]*\}/);
  if (!match) {
    return null;
  }

  try {
    return JSON.parse(match[0]) as { results?: Array<{ rule?: string; status?: string }> };
  } catch {
    return null;
  }
}

/* ───────────────────────────────────────────────────────────────
   3. TEARDOWN
──────────────────────────────────────────────────────────────── */

afterEach(() => {
  for (const root of createdTempRoots) {
    try {
      fs.rmSync(root, { recursive: true, force: true });
    } catch (err) {
      console.warn(`[test-integration] cleanup failed for ${root}: ${(err as Error).message}`);
    }
  }
  createdTempRoots.clear();
});

/* ───────────────────────────────────────────────────────────────
   4. TESTS
──────────────────────────────────────────────────────────────── */

describe('validation pipeline integration', () => {
  it('returns structured diagnostics for valid and invalid spec-folder states', () => {
    const workspaceRoot = makeTempWorkspace();
    const specPath = createTestSpecFolder(workspaceRoot, '002-validation-test', 2);
    const specFile = path.join(specPath, 'spec.md');
    const filledSpec = fs.readFileSync(specFile, 'utf-8')
      .replace(/\[YOUR_VALUE_HERE:[^\]]*\]/g, 'Test Value')
      .replace(/\{\{[^}]+\}\}/g, 'Filled Value')
      .replace(/\[NEEDS CLARIFICATION:[^\]]*\]/g, 'Clarified');
    fs.writeFileSync(specFile, filledSpec, 'utf-8');

    const validResult = runBashScript(workspaceRoot, 'spec/validate.sh', [specPath, '--json']);
    const validJson = parseValidationJson(validResult.stdout);
    expect([0, 1, 2]).toContain(validResult.exitCode);
    expect(validJson?.results?.some((result) => result.rule === 'FILE_EXISTS')).toBe(true);

    fs.writeFileSync(specFile, `${filledSpec}\n\n[YOUR_VALUE_HERE: Missing value]\n`, 'utf-8');
    const placeholderResult = runBashScript(workspaceRoot, 'spec/validate.sh', [specPath, '--json']);
    const placeholderJson = parseValidationJson(placeholderResult.stdout);
    const placeholderRule = placeholderJson?.results?.find((result) => result.rule === 'PLACEHOLDER_FILLED');
    expect(placeholderResult.exitCode).toBeGreaterThanOrEqual(1);
    expect(placeholderRule?.status).not.toBe('pass');

    const checklistPath = path.join(specPath, 'checklist.md');
    const checklistBackup = fs.readFileSync(checklistPath, 'utf-8');
    fs.unlinkSync(checklistPath);
    const missingFileResult = runBashScript(workspaceRoot, 'spec/validate.sh', [specPath, '--json']);
    const missingFileJson = parseValidationJson(missingFileResult.stdout);
    const missingFileRule = missingFileJson?.results?.find((result) => result.rule === 'FILE_EXISTS');
    fs.writeFileSync(checklistPath, checklistBackup, 'utf-8');

    expect(missingFileResult.exitCode).toBeGreaterThanOrEqual(1);
    expect(missingFileRule?.status).not.toBe('pass');
    expect(fs.existsSync(path.join(SCRIPTS_DIR, 'rules', 'check-files.sh'))).toBe(true);
    expect(fs.existsSync(path.join(SCRIPTS_DIR, 'rules', 'check-placeholders.sh'))).toBe(true);
    expect(fs.existsSync(path.join(SCRIPTS_DIR, 'rules', 'check-sections.sh'))).toBe(true);
    expect(fs.existsSync(path.join(SCRIPTS_DIR, 'rules', 'check-level.sh'))).toBe(true);
  });
});

describe('cognitive memory export parity', () => {
  it('keeps the working-memory and attention-decay export contracts intact', () => {
    const workingMemoryPath = path.join(MCP_SERVER_DIR, 'dist', 'lib', 'cognitive', 'working-memory.js');
    const attentionDecayPath = path.join(MCP_SERVER_DIR, 'dist', 'lib', 'cognitive', 'attention-decay.js');
    const coActivationPath = path.join(MCP_SERVER_DIR, 'dist', 'lib', 'cognitive', 'co-activation.js');

    expect(fs.existsSync(workingMemoryPath)).toBe(true);
    expect(fs.existsSync(attentionDecayPath)).toBe(true);
    expect(fs.existsSync(coActivationPath)).toBe(true);

    const workingMemory = require(workingMemoryPath);
    const attentionDecay = require(attentionDecayPath);

    expect(typeof workingMemory.init).toBe('function');
    expect(typeof workingMemory.setAttentionScore).toBe('function');
    expect(typeof workingMemory.getSessionMemories).toBe('function');
    expect(typeof attentionDecay.init).toBe('function');
    expect(typeof attentionDecay.calculateRetrievabilityDecay).toBe('function');
    expect(typeof attentionDecay.getDecayRate).toBe('function');
    expect(typeof attentionDecay.applyCompositeDecay).toBe('function');

    expect(workingMemory.calculateTier(0.9)).toBe('focused');
    expect(workingMemory.calculateTier(0.5)).toBe('active');
    expect(workingMemory.calculateTier(0.1)).toBe('fading');
    expect(attentionDecay.calculateRetrievabilityDecay(10, 0)).toBe(1);
    expect(attentionDecay.calculateRetrievabilityDecay(10, 5)).toBeGreaterThan(0);
    expect(attentionDecay.calculateRetrievabilityDecay(10, 5)).toBeLessThan(1);
    expect(attentionDecay.getDecayRate('constitutional')).toBe(1);
    expect(attentionDecay.getDecayRate('normal')).toBeLessThan(1);
    expect(attentionDecay.getDecayRate('temporary')).toBeLessThan(attentionDecay.getDecayRate('normal'));
  });
});

describe('spec-folder creation and template parity', () => {
  it('keeps template levels and required files available', () => {
    expect(fs.existsSync(path.join(SCRIPTS_DIR, 'spec', 'create.sh'))).toBe(true);
    expect(fs.existsSync(path.join(TEMPLATES_DIR, 'level_1'))).toBe(true);
    expect(fs.existsSync(path.join(TEMPLATES_DIR, 'level_2'))).toBe(true);
    expect(fs.existsSync(path.join(TEMPLATES_DIR, 'level_3'))).toBe(true);

    const workspaceRoot = makeTempWorkspace();
    const specPath = createTestSpecFolder(workspaceRoot, '004-creation-test', 3);

    expect(fs.existsSync(path.join(TEMPLATES_DIR, 'level_2', 'spec.md'))).toBe(true);
    expect(fs.existsSync(path.join(TEMPLATES_DIR, 'level_2', 'plan.md'))).toBe(true);
    expect(fs.existsSync(path.join(TEMPLATES_DIR, 'level_2', 'tasks.md'))).toBe(true);
    expect(fs.existsSync(path.join(TEMPLATES_DIR, 'level_2', 'checklist.md'))).toBe(true);
    expect(fs.existsSync(path.join(TEMPLATES_DIR, 'level_3', 'decision-record.md'))).toBe(true);

    expect(fs.existsSync(path.join(specPath, 'spec.md'))).toBe(true);
    expect(fs.existsSync(path.join(specPath, 'plan.md'))).toBe(true);
    expect(fs.existsSync(path.join(specPath, 'tasks.md'))).toBe(true);
    expect(fs.existsSync(path.join(specPath, 'memory'))).toBe(true);
    expect(fs.existsSync(path.join(specPath, 'scratch'))).toBe(true);

    const specTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'level_2', 'spec.md'), 'utf-8');
    const hasTableFormat = specTemplate.includes('| **Level**');
    const hasPlaceholders = specTemplate.includes('[') || specTemplate.includes('{{');
    expect(hasTableFormat || hasPlaceholders).toBe(true);
  });
});

describe('checkpoint integration parity', () => {
  it('preserves checkpoint exports, schema validation, and compression signals', () => {
    const checkpointsPath = path.join(MCP_SERVER_DIR, 'dist', 'lib', 'storage', 'checkpoints.js');
    const handlersPath = path.join(MCP_SERVER_DIR, 'dist', 'handlers', 'checkpoints.js');
    const checkpoints = require(checkpointsPath);
    const handlers = require(handlersPath);
    const checkpointsSource = fs.readFileSync(checkpointsPath, 'utf-8');

    expect(typeof checkpoints.createCheckpoint).toBe('function');
    expect(typeof checkpoints.listCheckpoints).toBe('function');
    expect(typeof checkpoints.restoreCheckpoint).toBe('function');
    expect(typeof checkpoints.deleteCheckpoint).toBe('function');
    expect(typeof checkpoints.getCheckpoint).toBe('function');
    expect(typeof handlers.handleCheckpointCreate).toBe('function');
    expect(typeof handlers.handleCheckpointRestore).toBe('function');
    expect(typeof handlers.handleCheckpointDelete).toBe('function');

    if (typeof checkpoints.getGitBranch === 'function') {
      const branch = checkpoints.getGitBranch();
      expect(branch === null || typeof branch === 'string').toBe(true);
    }

    expect(typeof checkpoints.validateMemoryRow).toBe('function');
    checkpoints.validateMemoryRow({
      id: 1,
      file_path: '/tmp/test.md',
      spec_folder: '001-test',
      title: 'Test Memory',
      importance_weight: 0.5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      importance_tier: 'normal',
    }, 0);
    expect(() => checkpoints.validateMemoryRow({ id: 'invalid' }, 1)).toThrow();

    expect(checkpointsSource.includes('zlib')).toBe(true);
    expect(checkpointsSource.includes('gzipSync')).toBe(true);
    expect(typeof checkpoints.MAX_CHECKPOINTS).toBe('number');
    expect(checkpoints.MAX_CHECKPOINTS).toBeGreaterThan(0);
    expect(checkpointsSource.includes('MAX_CHECKPOINTS')).toBe(true);
  });
});

describe('cross-cutting export surface parity', () => {
  it('keeps the key scripts and MCP export surfaces available', () => {
    const core = require(path.join(SCRIPTS_DIR, 'dist', 'core', 'index.js'));
    const extractors = require(path.join(SCRIPTS_DIR, 'dist', 'extractors', 'index.js'));
    const specFolder = require(path.join(SCRIPTS_DIR, 'dist', 'spec-folder', 'index.js'));
    const mcpCore = require(path.join(MCP_SERVER_DIR, 'dist', 'core', 'index.js'));
    const vectorIndex = require(path.join(MCP_SERVER_DIR, 'dist', 'lib', 'search', 'vector-index.js'));
    const errors = require(path.join(MCP_SERVER_DIR, 'dist', 'lib', 'errors.js'));

    expect(core.CONFIG).toBeDefined();
    expect(typeof core.findActiveSpecsDir).toBe('function');
    expect(typeof extractors.extractConversations).toBe('function');
    expect(typeof extractors.extractDecisions).toBe('function');
    expect(typeof extractors.extractDiagrams).toBe('function');
    expect(typeof specFolder.detectSpecFolder).toBe('function');
    expect(typeof specFolder.setupContextDirectory).toBe('function');
    expect(mcpCore.LIB_DIR).toBeDefined();
    expect(typeof mcpCore.checkDatabaseUpdated).toBe('function');
    expect(typeof vectorIndex.EMBEDDING_DIM).toBe('number');
    expect(
      typeof vectorIndex.indexMemory === 'function' ||
      typeof vectorIndex.indexMemoryDeferred === 'function',
    ).toBe(true);
    expect(
      typeof vectorIndex.vectorSearch === 'function' ||
      typeof vectorIndex.enhancedSearch === 'function' ||
      typeof vectorIndex.cachedSearch === 'function',
    ).toBe(true);
    expect(errors.ErrorCodes).toBeDefined();
    expect(typeof errors.ErrorCodes).toBe('object');
  });
});

describe('memory save workflow parity', () => {
  it('preserves valid anchor comments through workflow HTML cleanup', () => {
    // W1-T5 parity: stripWorkflowHtmlOutsideCodeFences keeps ANCHOR pairs intact
    const workflow = require(path.join(SCRIPTS_DIR, 'dist', 'core', 'workflow.js'));
    const testContent = '<!-- ANCHOR:test -->content<!-- /ANCHOR:test -->';
    const cleaned = workflow.stripWorkflowHtmlOutsideCodeFences(testContent);

    expect(cleaned).toContain('<!-- ANCHOR:test -->');
    expect(cleaned).toContain('<!-- /ANCHOR:test -->');
  });

  it('preserves unclosed anchor openers for downstream validation', () => {
    // W1-T6 parity: unclosed opener survives cleanup so validators can flag it
    const workflow = require(path.join(SCRIPTS_DIR, 'dist', 'core', 'workflow.js'));
    const badContent = '<!-- ANCHOR:unclosed -->content';
    const cleaned = workflow.stripWorkflowHtmlOutsideCodeFences(badContent);

    expect(cleaned).toContain('<!-- ANCHOR:unclosed -->');
    expect(cleaned).not.toContain('<!-- /ANCHOR:unclosed -->');
  });

  it('confirms generate-context.js compiled entrypoint exists', () => {
    // W1-T3 parity: compiled generate-context must be present for CLI invocation
    const generateContextPath = path.join(SCRIPTS_DIR, 'dist', 'memory', 'generate-context.js');
    expect(fs.existsSync(generateContextPath)).toBe(true);
  });
});
