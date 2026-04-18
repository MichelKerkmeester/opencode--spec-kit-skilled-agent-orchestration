import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CAPABILITY_ENV,
  getMemoryRoadmapCapabilityFlags,
  getMemoryRoadmapDefaults,
  getMemoryRoadmapPhase,
} from '../lib/config/capability-flags';

const FLAG_NAMES = [
  'SPECKIT_MEMORY_ROADMAP_PHASE',
  'SPECKIT_MEMORY_LINEAGE_STATE',
  'SPECKIT_MEMORY_GRAPH_UNIFIED',
  'SPECKIT_MEMORY_ADAPTIVE_RANKING',
  'SPEC_KIT_DB_DIR',
  'SPECKIT_DB_DIR',
  'MEMORY_DB_PATH',
  'SPECKIT_GRAPH_UNIFIED',
  'SPECKIT_ROLLOUT_PERCENT',
] as const;

const ORIGINAL_ENV: Partial<Record<typeof FLAG_NAMES[number], string | undefined>> = {};
const ORIGINAL_CWD = process.cwd();
const TEMP_DIRS: string[] = [];

function clearFlags(): void {
  for (const flag of FLAG_NAMES) {
    delete process.env[flag];
  }
}

describe('Memory roadmap flags', () => {
  beforeEach(() => {
    for (const flag of FLAG_NAMES) {
      ORIGINAL_ENV[flag] = process.env[flag];
    }
    clearFlags();
  });

  afterEach(() => {
    process.chdir(ORIGINAL_CWD);
    for (const flag of FLAG_NAMES) {
      if (ORIGINAL_ENV[flag] === undefined) {
        delete process.env[flag];
      } else {
        process.env[flag] = ORIGINAL_ENV[flag];
      }
    }
    while (TEMP_DIRS.length > 0) {
      const tempDir = TEMP_DIRS.pop();
      if (tempDir) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    }
  });

  it('defaults to the scope-governance phase with adaptive ranking dormant by default', () => {
    expect(getMemoryRoadmapPhase()).toBe('scope-governance');
    expect(getMemoryRoadmapCapabilityFlags()).toEqual({
      lineageState: true,
      graphUnified: true,
      adaptiveRanking: false,
    });
  });

  it('uses memory-roadmap env vars independently from existing runtime flags', () => {
    process.env.SPECKIT_GRAPH_UNIFIED = 'false';
    process.env.SPECKIT_ROLLOUT_PERCENT = '100';

    expect(getMemoryRoadmapCapabilityFlags().graphUnified).toBe(true);

    process.env[CAPABILITY_ENV.graphUnified] = 'false';
    expect(getMemoryRoadmapCapabilityFlags().graphUnified).toBe(false);
  });

  it('lets adaptive ranking opt in explicitly while leaving the roadmap phase metadata intact', () => {
    process.env.SPECKIT_MEMORY_ROADMAP_PHASE = 'adaptive';
    process.env.SPECKIT_ROLLOUT_PERCENT = '100';

    const dormant = getMemoryRoadmapDefaults('roadmap-session-1');
    expect(dormant.phase).toBe('adaptive');
    expect(dormant.capabilities.adaptiveRanking).toBe(false);

    process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'true';
    const enabled = getMemoryRoadmapDefaults('roadmap-session-1');
    expect(enabled.capabilities.adaptiveRanking).toBe(true);

    process.env.SPECKIT_ROLLOUT_PERCENT = '0';
    const stillEnabled = getMemoryRoadmapDefaults('roadmap-session-1');
    expect(stillEnabled.capabilities.adaptiveRanking).toBe(true);

    process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'false';
    const disabled = getMemoryRoadmapDefaults('roadmap-session-1');
    expect(disabled.capabilities.adaptiveRanking).toBe(false);
  });

  it('tracks the four active scope dimensions in roadmap defaults', () => {
    expect(getMemoryRoadmapDefaults().scopeDimensionsTracked).toBe(4);
  });

  it('uses the shared database directory resolver when db-dir env vars are unset', async () => {
    delete process.env.SPEC_KIT_DB_DIR;
    delete process.env.SPECKIT_DB_DIR;
    vi.resetModules();

    const [{ resolveDatabasePaths }, { DB_PATH }] = await Promise.all([
      import('../core/config'),
      import('../../shared/paths'),
    ]);

    expect(resolveDatabasePaths().databaseDir).toBe(path.dirname(DB_PATH));
  });

  it('rejects repo-local database symlinks that realpath outside allowed roots', async () => {
    const workspaceDir = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-db-boundary-'));
    TEMP_DIRS.push(workspaceDir);
    const linkPath = path.join(workspaceDir, 'db-link');
    fs.symlinkSync('/etc', linkPath, 'dir');
    process.chdir(workspaceDir);
    process.env.SPEC_KIT_DB_DIR = 'db-link';
    vi.resetModules();

    await expect(import('../core/config')).rejects.toThrow(/outside the allowed/);
  });

  it('refreshes exported database path bindings when env overrides arrive after import', async () => {
    const workspaceDir = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-db-refresh-'));
    const databaseDir = path.join(workspaceDir, 'runtime-db');
    TEMP_DIRS.push(workspaceDir);
    fs.mkdirSync(databaseDir, { recursive: true });
    process.chdir(workspaceDir);
    vi.resetModules();

    const [config, sharedPaths] = await Promise.all([
      import('../core/config'),
      import('../../shared/paths'),
    ]);
    const initialDir = config.DATABASE_DIR;

    process.env.SPEC_KIT_DB_DIR = databaseDir;
    const resolved = config.resolveDatabasePaths();

    expect(resolved.databaseDir).toBe(fs.realpathSync(databaseDir));
    expect(config.DATABASE_DIR).toBe(fs.realpathSync(databaseDir));
    expect(config.DATABASE_PATH).toBe(path.join(fs.realpathSync(databaseDir), path.basename(sharedPaths.DB_PATH)));
    expect(config.DATABASE_DIR).not.toBe(initialDir);
  });

  it('falls back to scope-governance for unknown phase labels', () => {
    process.env.SPECKIT_MEMORY_ROADMAP_PHASE = 'future-phase';
    expect(getMemoryRoadmapPhase()).toBe('scope-governance');
  });
});
