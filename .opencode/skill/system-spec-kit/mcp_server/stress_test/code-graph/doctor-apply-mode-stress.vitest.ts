import { existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const OPENCODE_ROOT = resolve(TEST_DIR, '..', '..', '..', '..', '..');
const DOCTOR_COMMAND = join(OPENCODE_ROOT, 'command', 'doctor', 'code-graph.md');
const DOCTOR_AUTO_YAML = join(OPENCODE_ROOT, 'command', 'doctor', 'assets', 'doctor_code-graph_auto.yaml');
const DOCTOR_CONFIRM_YAML = join(OPENCODE_ROOT, 'command', 'doctor', 'assets', 'doctor_code-graph_confirm.yaml');
const DOCTOR_APPLY_YAML = join(OPENCODE_ROOT, 'command', 'doctor', 'assets', 'doctor_code-graph_apply.yaml');
const DOCTOR_APPLY_CONFIRM_YAML = join(OPENCODE_ROOT, 'command', 'doctor', 'assets', 'doctor_code-graph_apply-confirm.yaml');
const tempDirs: string[] = [];

type IncludedSkills = 'all' | 'none' | string[];

interface DoctorActiveScopePolicy {
  status: 'active' | 'needs_full_scan';
  includedSkills: IncludedSkills;
  includeAgents: boolean;
  includeCommands: boolean;
  includeSpecs: boolean;
  includePlugins: boolean;
}

type DetectorMode = 'stale' | 'missed' | 'bloat';

const DEFAULT_ACTIVE_SCOPE: DoctorActiveScopePolicy = {
  status: 'active',
  includedSkills: 'none',
  includeAgents: false,
  includeCommands: false,
  includeSpecs: false,
  includePlugins: false,
};

const DEFAULT_EXCLUDED_FIXTURES = [
  { label: 'skills', modeFlag: 'includedSkills', path: '.opencode/skill/sk-doc/SKILL.md' },
  { label: 'agents', modeFlag: 'includeAgents', path: '.opencode/agent/context.md' },
  { label: 'commands', modeFlag: 'includeCommands', path: '.opencode/command/doctor/code-graph.md' },
  { label: 'specs', modeFlag: 'includeSpecs', path: '.opencode/specs/example/spec.md' },
  { label: 'plugins', modeFlag: 'includePlugins', path: '.opencode/plugins/example/plugin.json' },
] as const;

function parseDoctorActiveScopeFingerprint(fingerprint: string | null): DoctorActiveScopePolicy {
  if (!fingerprint?.startsWith('code-graph-scope:v2:')) {
    return { ...DEFAULT_ACTIVE_SCOPE, status: 'needs_full_scan' };
  }

  const values = new Map<string, string>();
  for (const segment of fingerprint.split(':').slice(2)) {
    const [key, value] = segment.split('=');
    if (!key || value === undefined) {
      return { ...DEFAULT_ACTIVE_SCOPE, status: 'needs_full_scan' };
    }
    values.set(key, value);
  }

  const skillsValue = values.get('skills');
  let includedSkills: IncludedSkills = 'none';
  if (skillsValue === 'all') {
    includedSkills = 'all';
  } else if (skillsValue?.startsWith('list[') && skillsValue.endsWith(']')) {
    const list = skillsValue.slice('list['.length, -1);
    includedSkills = list.length > 0 ? list.split(',').sort() : 'none';
  }

  return {
    status: values.get('mcp-coco-index') === 'excluded' ? 'active' : 'needs_full_scan',
    includedSkills,
    includeAgents: values.get('agents') === 'all',
    includeCommands: values.get('commands') === 'all',
    includeSpecs: values.get('specs') === 'all',
    includePlugins: values.get('plugins') === 'all',
  };
}

function isIncludedByDoctorScope(path: string, policy: DoctorActiveScopePolicy): boolean {
  if (policy.status !== 'active') return false;
  if (path.startsWith('.opencode/agent/')) return policy.includeAgents;
  if (path.startsWith('.opencode/command/')) return policy.includeCommands;
  if (path.startsWith('.opencode/specs/')) return policy.includeSpecs;
  if (path.startsWith('.opencode/plugins/')) return policy.includePlugins;
  if (!path.startsWith('.opencode/skill/')) return true;
  if (policy.includedSkills === 'all') return true;
  if (policy.includedSkills === 'none') return false;
  return policy.includedSkills.some(skill => path.startsWith(`.opencode/skill/${skill}/`));
}

function doctorDetectorFindings(input: {
  mode: DetectorMode;
  filesOnDisk: string[];
  indexedFiles: string[];
  staleFiles: string[];
  bloatFiles: string[];
  policy: DoctorActiveScopePolicy;
}): string[] {
  const indexed = new Set(input.indexedFiles);
  const source = input.mode === 'stale'
    ? input.staleFiles
    : input.mode === 'bloat'
      ? input.bloatFiles
      : input.filesOnDisk.filter(path => !indexed.has(path));
  return source.filter(path => isIncludedByDoctorScope(path, input.policy)).sort();
}

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
    const confirmYaml = readFileSync(DOCTOR_CONFIRM_YAML, 'utf-8');
    const applyYaml = readFileSync(DOCTOR_APPLY_YAML, 'utf-8');
    const applyConfirmYaml = readFileSync(DOCTOR_APPLY_CONFIRM_YAML, 'utf-8');

    expect(command).toContain('DIAGNOSTIC MODE (:auto, :confirm) IS READ-ONLY');
    expect(command).toContain('APPLY MODE (:apply, :apply-confirm) MUTATES `.opencode/code-graph.config.json`');
    expect(autoYaml).toContain('allowed_targets: []');
    expect(autoYaml).toContain('invoke_code_graph_scan_in_phase_a');
    expect(confirmYaml).toContain('allowed_targets: []');
    expect(confirmYaml).toContain('invoke_code_graph_scan_in_phase_a');
    expect(applyYaml).toContain('.opencode/code-graph.config.json');
    expect(applyYaml).toContain('<packet_scratch>/apply-snapshot-<timestamp>.json');
    expect(applyYaml).toContain('Atomic write');
    expect(applyYaml).toContain('rollback');
    expect(applyConfirmYaml).toContain('.opencode/code-graph.config.json');
    expect(applyConfirmYaml).toContain('ROLLBACK');
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

  it('cg-017 documents activeScope, granular includeSkills, and default-exclude rejection across doctor assets', () => {
    const command = readFileSync(DOCTOR_COMMAND, 'utf-8');
    const autoYaml = readFileSync(DOCTOR_AUTO_YAML, 'utf-8');
    const confirmYaml = readFileSync(DOCTOR_CONFIRM_YAML, 'utf-8');
    const applyYaml = readFileSync(DOCTOR_APPLY_YAML, 'utf-8');
    const applyConfirmYaml = readFileSync(DOCTOR_APPLY_CONFIRM_YAML, 'utf-8');

    expect(command).toContain('011 Scope Awareness');
    expect(command).toContain('includeSkills');
    expect(autoYaml).toContain('code_graph_status({}).activeScope');
    expect(autoYaml).toContain('NEEDS_FULL_SCAN');
    expect(confirmYaml).toContain('policy-included files-on-disk-not-in-index');
    expect(confirmYaml).toContain('granular includeSkills lists');
    expect(applyYaml).toContain("011's 5 default-excluded roots");
    expect(applyYaml).toContain('.opencode/agent/**');
    expect(applyYaml).toContain('.opencode/command/**');
    expect(applyYaml).toContain('.opencode/specs/**');
    expect(applyYaml).toContain('.opencode/plugins/**');
    expect(applyConfirmYaml).toContain("011's 5 default-excluded roots");
  });

  it('cg-017 treats v2 activeScope as parseable and v1 scope as a full-scan requirement', () => {
    expect(parseDoctorActiveScopeFingerprint(
      'code-graph-scope:v2:skills=list[sk-code-review,sk-doc]:agents=all:commands=none:specs=all:plugins=none:mcp-coco-index=excluded',
    )).toEqual({
      status: 'active',
      includedSkills: ['sk-code-review', 'sk-doc'],
      includeAgents: true,
      includeCommands: false,
      includeSpecs: true,
      includePlugins: false,
    });

    expect(parseDoctorActiveScopeFingerprint(
      'code-graph-scope:v1:skills=included:mcp-coco-index=excluded',
    )).toMatchObject({
      status: 'needs_full_scan',
    });
  });

  it.each(DEFAULT_EXCLUDED_FIXTURES.flatMap(fixture => (
    (['stale', 'missed', 'bloat'] as DetectorMode[]).map(mode => ({ ...fixture, mode }))
  )))('cg-017 excludes default $label paths from $mode findings unless activeScope opts in', ({ mode, path }) => {
    const findings = doctorDetectorFindings({
      mode,
      filesOnDisk: [path],
      indexedFiles: [],
      staleFiles: [path],
      bloatFiles: [path],
      policy: DEFAULT_ACTIVE_SCOPE,
    });

    expect(findings).toEqual([]);
  });

  it('cg-017 changes missed findings for the same filesystem when activeScope opts roots in', () => {
    const filesOnDisk = DEFAULT_EXCLUDED_FIXTURES.map(fixture => fixture.path);
    const defaultFindings = doctorDetectorFindings({
      mode: 'missed',
      filesOnDisk,
      indexedFiles: [],
      staleFiles: filesOnDisk,
      bloatFiles: filesOnDisk,
      policy: DEFAULT_ACTIVE_SCOPE,
    });
    const optedInFindings = doctorDetectorFindings({
      mode: 'missed',
      filesOnDisk,
      indexedFiles: [],
      staleFiles: filesOnDisk,
      bloatFiles: filesOnDisk,
      policy: {
        status: 'active',
        includedSkills: 'all',
        includeAgents: true,
        includeCommands: true,
        includeSpecs: true,
        includePlugins: true,
      },
    });

    expect(defaultFindings).toEqual([]);
    expect(optedInFindings).toEqual([...filesOnDisk].sort());
  });

  it('cg-017 applies granular includeSkills only to listed skill folders during missed-file diagnosis', () => {
    const filesOnDisk = [
      '.opencode/skill/sk-code-review/SKILL.md',
      '.opencode/skill/sk-doc/SKILL.md',
      '.opencode/skill/sk-code/SKILL.md',
    ];

    expect(doctorDetectorFindings({
      mode: 'missed',
      filesOnDisk,
      indexedFiles: [],
      staleFiles: filesOnDisk,
      bloatFiles: filesOnDisk,
      policy: {
        ...DEFAULT_ACTIVE_SCOPE,
        includedSkills: ['sk-code-review', 'sk-doc'],
      },
    })).toEqual([
      '.opencode/skill/sk-code-review/SKILL.md',
      '.opencode/skill/sk-doc/SKILL.md',
    ]);
  });
});
