// TEST: Alignment Drift Fixture Preservation
// Keeps intentionally malformed archived JSON fixtures invalid while allowing narrow verifier exceptions
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const SKILL_ROOT = path.resolve(__dirname, '..', '..');
const WORKSPACE_ROOT = path.resolve(SKILL_ROOT, '..', '..', '..');
const VERIFIER_PATH = path.join(
  WORKSPACE_ROOT,
  '.opencode',
  'skill',
  'sk-code--opencode',
  'scripts',
  'verify_alignment_drift.py',
);
const FIXTURE_DIR = path.join(
  WORKSPACE_ROOT,
  '.opencode',
  'specs',
  '02--system-spec-kit',
  'z_archive',
  '001-fix-command-dispatch',
  'z_archive',
  '044-speckit-test-suite',
  'scratch',
  '001-test-agent-08',
);
const MALFORMED_FIXTURE_PATH = path.join(FIXTURE_DIR, 'malformed.json');

describe('alignment drift malformed fixture preservation', () => {
  it('keeps the archived malformed fixture invalid JSON', () => {
    const fixtureContent = fs.readFileSync(MALFORMED_FIXTURE_PATH, 'utf-8');

    expect(() => JSON.parse(fixtureContent)).toThrow();
    expect(fixtureContent).toContain('This JSON is malformed');
  });

  it('allows the verifier to pass for the fixture directory without masking other JSON files', () => {
    const result = spawnSync(
      'python3',
      [VERIFIER_PATH, '--root', FIXTURE_DIR],
      {
        encoding: 'utf-8',
        cwd: WORKSPACE_ROOT,
      },
    );

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('[alignment-drift] PASS');
    expect(result.stdout).not.toContain('JSON-PARSE');
    expect(result.stdout).not.toContain('malformed.json');
  });
});
