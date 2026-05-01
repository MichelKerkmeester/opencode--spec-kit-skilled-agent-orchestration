// -------------------------------------------------------------------
// TEST: Workflow Invariance
// -------------------------------------------------------------------

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const SKILL_ROOT = path.resolve(__dirname, '../..');
const WORKSPACE_ROOT = path.resolve(SKILL_ROOT, '../../..');
const BANNED = /\b(preset|capabilit(?:y|ies)|kind|manifest)\b/iu;

interface SurfaceHit {
  surface: string;
  line: number;
  text: string;
}

function pathExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

function walk(startPath: string, predicate: (filePath: string) => boolean, results: string[] = []): string[] {
  if (!pathExists(startPath)) return results;
  const stat = fs.statSync(startPath);
  if (stat.isFile()) {
    if (predicate(startPath)) results.push(startPath);
    return results;
  }
  for (const entry of fs.readdirSync(startPath)) {
    walk(path.join(startPath, entry), predicate, results);
  }
  return results;
}

function isTextSurface(filePath: string): boolean {
  return /\.(md|yaml|yml|json|txt)$/iu.test(filePath);
}

function relative(filePath: string): string {
  return path.relative(WORKSPACE_ROOT, filePath).replace(/\\/gu, '/');
}

function collectDefaultSurfaces(): string[] {
  const roots = [
    path.join(SKILL_ROOT, 'scripts/tests/fixtures'),
    path.join(SKILL_ROOT, 'templates'),
    path.join(WORKSPACE_ROOT, '.opencode/command'),
    path.join(WORKSPACE_ROOT, '.opencode/agent'),
    path.join(SKILL_ROOT, 'feature_catalog'),
    path.join(SKILL_ROOT, 'manual_testing_playbook'),
  ];
  const files = roots.flatMap((root) => walk(root, isTextSurface));
  for (const name of ['CLAUDE.md', 'AGENTS.md', 'AGENTS_Barter.md', 'AGENTS_example_fs_enterprises.md']) {
    const filePath = path.join(WORKSPACE_ROOT, name);
    if (pathExists(filePath)) files.push(filePath);
  }
  files.push(path.join(SKILL_ROOT, 'SKILL.md'));
  return files;
}

function collectExtraSurfaces(): string[] {
  return (process.env.WORKFLOW_INVARIANCE_EXTRA_PATHS ?? '')
    .split(path.delimiter)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => path.resolve(entry));
}

function isLegacyPhaseCleanupDebt(filePath: string): boolean {
  const rel = relative(filePath);
  return [
    'AGENTS.md',
    'AGENTS_Barter.md',
    'CLAUDE.md',
    '.opencode/agent/',
    '.opencode/command/',
    '.opencode/skill/system-spec-kit/SKILL.md',
    '.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/',
  ].some((prefix) => rel === prefix || rel.startsWith(prefix));
}

function isAllowedHit(hit: SurfaceHit, filePath: string, isExtra: boolean): boolean {
  const rel = relative(filePath);
  if (rel.includes('.opencode/specs/')) return true;
  if (rel.endsWith('.opencode/skill/system-spec-kit/templates/manifest/README.md')) return true;
  if (rel.endsWith('.opencode/skill/system-spec-kit/templates/manifest/EXTENSION_GUIDE.md')) return true;
  if (rel.endsWith('.opencode/skill/system-spec-kit/templates/manifest/MIGRATION.md')) return true;
  if (rel.endsWith('.opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json')) return true;
  if (rel.endsWith('.opencode/skill/system-spec-kit/templates/README.md')) return true;
  if (/mcp_server\/lib\/config\/capability-flags\.ts|lib\/config\/capability-flags\.ts|\bcapability-flags\.ts\b|from ['"][^'"]*capability-flags['"]|require\(['"][^'"]*capability-flags(?:\.js)?['"]\)/iu.test(hit.text)) return true;
  if (!isExtra && isLegacyPhaseCleanupDebt(filePath)) return true;
  return false;
}

function scanContent(surface: string, content: string): SurfaceHit[] {
  return content
    .split(/\r?\n/u)
    .flatMap((text, index) => (BANNED.test(text) ? [{ surface, line: index + 1, text }] : []));
}

function liveOutputSurfaces(): SurfaceHit[] {
  const commands: Array<[string, string[]]> = [
    ['bash', ['scripts/spec/create.sh', '--help']],
    ['bash', ['scripts/spec/validate.sh', '--help']],
    ['bash', ['scripts/spec/scaffold-debug-delegation.sh', '--help']],
  ];
  return commands.flatMap(([command, args]) => {
    try {
      const output = execFileSync(command, args, { cwd: SKILL_ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      return scanContent(`live:${command} ${args.join(' ')}`, output);
    } catch (error) {
      const stderr = error instanceof Error && 'stderr' in error ? (error as { stderr?: Buffer }).stderr : undefined;
      return scanContent(`live:${command} ${args.join(' ')}`, stderr?.toString('utf8') ?? '');
    }
  });
}

describe('workflow vocabulary invariance', () => {
  it('keeps public surfaces free from new private taxonomy leaks', () => {
    const fileHits = [
      ...collectDefaultSurfaces().map((filePath) => ({ filePath, isExtra: false })),
      ...collectExtraSurfaces().map((filePath) => ({ filePath, isExtra: true })),
    ].flatMap(({ filePath, isExtra }) => {
      if (!pathExists(filePath)) return [];
      return scanContent(relative(filePath), fs.readFileSync(filePath, 'utf8'))
        .filter((hit) => !isAllowedHit(hit, filePath, isExtra));
    });

    const liveHits = liveOutputSurfaces();
    expect([...fileHits, ...liveHits]).toEqual([]);
  });

  it('reports leaks from extra-path sentinels', () => {
    const tempDir = fs.mkdtempSync(path.join(process.cwd(), 'workflow-invariance-'));
    try {
      const sentinel = path.join(tempDir, 'sentinel.md');
      fs.writeFileSync(sentinel, 'This public surface leaks preset vocabulary.\n', 'utf8');
      const hits = scanContent(relative(sentinel), fs.readFileSync(sentinel, 'utf8'))
        .filter((hit) => !isAllowedHit(hit, sentinel, true));

      expect(hits).toHaveLength(1);
      expect(hits[0].text).toContain('preset');
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
