import { existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const OPENCODE_ROOT = resolve(TEST_DIR, '..', '..', '..', '..', '..');
const DOCTOR_COMMAND = join(OPENCODE_ROOT, 'command', 'doctor', 'code-graph.md');
const DOCTOR_AUTO_YAML = join(OPENCODE_ROOT, 'command', 'doctor', 'assets', 'doctor_code-graph_auto.yaml');
const DOCTOR_APPLY_YAML = join(OPENCODE_ROOT, 'command', 'doctor', 'assets', 'doctor_code-graph_apply.yaml');
const tempDirs: string[] = [];

function createTempRoot(): string {
  const tempRoot = mkdtempSync(join(tmpdir(), 'cg-doctor-apply-'));
  tempDirs.push(tempRoot);
  return tempRoot;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir && existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true });
    }
  }
});

describe('cg-017 — doctor apply mode', () => {
  it('cg-017 keeps diagnostic command modes read-only and apply modes explicitly config-scoped', () => {
    const command = readFileSync(DOCTOR_COMMAND, 'utf-8');
    const autoYaml = readFileSync(DOCTOR_AUTO_YAML, 'utf-8');
    const applyYaml = readFileSync(DOCTOR_APPLY_YAML, 'utf-8');

    expect(command).toContain('DIAGNOSTIC MODE (:auto, :confirm) IS READ-ONLY');
    expect(command).toContain('APPLY MODE (:apply, :apply-confirm) MUTATES `.opencode/code-graph.config.json`');
    expect(autoYaml).toContain('allowed_targets: []');
    expect(autoYaml).toContain('invoke_code_graph_scan_in_phase_a');
    expect(applyYaml).toContain('.opencode/code-graph.config.json');
    expect(applyYaml).toContain('<packet_scratch>/apply-snapshot-<timestamp>.json');
    expect(applyYaml).toContain('Atomic write');
    expect(applyYaml).toContain('rollback');
  });

  it('cg-017 simulates apply and rollback writes entirely inside a temp workspace', () => {
    const tempRoot = createTempRoot();
    const configPath = join(tempRoot, '.opencode', 'code-graph.config.json');
    const snapshotPath = join(tempRoot, 'scratch', 'apply-snapshot.json');
    const reportPath = join(tempRoot, 'scratch', 'apply-report.md');
    const tmpConfigPath = `${configPath}.tmp`;

    mkdirSync(dirname(configPath), { recursive: true });
    mkdirSync(dirname(snapshotPath), { recursive: true });
    writeFileSync(configPath, JSON.stringify({ excludes: { high_tier: ['node_modules/'] } }, null, 2), 'utf-8');
    writeFileSync(snapshotPath, readFileSync(configPath, 'utf-8'), 'utf-8');

    const nextConfig = {
      excludes: {
        high_tier: ['node_modules/', '.venv/', '__pycache__/'],
      },
    };
    writeFileSync(tmpConfigPath, JSON.stringify(nextConfig, null, 2), 'utf-8');
    renameSync(tmpConfigPath, configPath);
    writeFileSync(reportPath, '# Apply report\n\nSTATUS=APPLIED\n', 'utf-8');

    expect(JSON.parse(readFileSync(configPath, 'utf-8'))).toEqual(nextConfig);
    expect(readFileSync(reportPath, 'utf-8')).toContain('STATUS=APPLIED');

    writeFileSync(tmpConfigPath, readFileSync(snapshotPath, 'utf-8'), 'utf-8');
    renameSync(tmpConfigPath, configPath);
    writeFileSync(reportPath, `${readFileSync(reportPath, 'utf-8')}\nSTATUS=ROLLED_BACK\n`, 'utf-8');

    expect(JSON.parse(readFileSync(configPath, 'utf-8'))).toEqual({
      excludes: { high_tier: ['node_modules/'] },
    });
    expect(readFileSync(reportPath, 'utf-8')).toContain('STATUS=ROLLED_BACK');
    expect(configPath.startsWith(tempRoot)).toBe(true);
    expect(snapshotPath.startsWith(tempRoot)).toBe(true);
    expect(reportPath.startsWith(tempRoot)).toBe(true);
  });
});
