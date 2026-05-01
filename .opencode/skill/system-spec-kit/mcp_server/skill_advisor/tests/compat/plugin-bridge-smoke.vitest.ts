// ───────────────────────────────────────────────────────────────
// MODULE: Plugin Bridge Smoke Tests
// ───────────────────────────────────────────────────────────────
// F-020-D5-04: minimal smoke tests for the MJS plugin bridge at
// mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs. Asserts the
// bridge subprocess contract that the OpenCode plugin relies on:
//   - File exists on disk at the expected path
//   - Subprocess accepts stdin JSON, returns one stdout JSON line, exits 0
//   - Response shape conforms to the compat-contract envelope
//     ({ status, brief, metadata }) regardless of advisor availability
//   - Bridge fails open (status='fail_open') when given malformed input
//
// These tests guard the source-of-truth status of the .mjs file and detect
// breakage when someone moves/renames the bridge or changes its contract.
// Functional advisor behavior (route selection, brief content) is covered
// by plugin-bridge.vitest.ts; this file focuses on the file-existence and
// envelope-shape smoke surface.

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..', '..', '..', '..', '..', '..');
const bridgePath = resolve(
  repoRoot,
  '.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs',
);

function runBridge(input: string): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync('node', [bridgePath], {
    cwd: repoRoot,
    input,
    encoding: 'utf8',
    env: process.env,
  });
  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

describe('spec-kit skill advisor plugin bridge smoke (F-020-D5-04)', () => {
  it('exists at the canonical source-of-truth path', () => {
    expect(existsSync(bridgePath)).toBe(true);
  });

  it('emits a JSON envelope with status/brief/metadata for a valid prompt', () => {
    const payload = JSON.stringify({
      prompt: 'save the current context to memory',
      workspaceRoot: repoRoot,
      maxTokens: 80,
      thresholdConfidence: 0.8,
    });
    const result = runBridge(payload);
    expect(result.status).toBe(0);
    expect(result.stdout.trim().length).toBeGreaterThan(0);
    const parsed = JSON.parse(result.stdout.trim());
    expect(parsed).toHaveProperty('status');
    expect(parsed).toHaveProperty('brief');
    expect(parsed).toHaveProperty('metadata');
    expect(['ok', 'skipped', 'degraded', 'fail_open']).toContain(parsed.status);
    expect(typeof parsed.metadata).toBe('object');
    expect(parsed.metadata).not.toBeNull();
  });

  it('fails open with stable envelope when stdin is empty', () => {
    const result = runBridge('');
    expect(result.status).toBe(0);
    const parsed = JSON.parse(result.stdout.trim());
    expect(parsed.status).toBe('fail_open');
    expect(parsed.brief).toBeNull();
    expect(parsed.error).toBeDefined();
  });

  it('fails open with stable envelope when stdin JSON is missing required fields', () => {
    const result = runBridge(JSON.stringify({ prompt: 'no workspace root' }));
    expect(result.status).toBe(0);
    const parsed = JSON.parse(result.stdout.trim());
    expect(parsed.status).toBe('fail_open');
    expect(parsed.error).toBe('MISSING_WORKSPACE_ROOT');
    expect(parsed.brief).toBeNull();
  });

  it('fails open with stable envelope when stdin is not valid JSON', () => {
    const result = runBridge('this is not json {');
    expect(result.status).toBe(0);
    const parsed = JSON.parse(result.stdout.trim());
    expect(parsed.status).toBe('fail_open');
    expect(parsed.brief).toBeNull();
    expect(parsed.error).toBeDefined();
  });
});
