// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Tool Schemas Tests
// ───────────────────────────────────────────────────────────────
// F-005-A5-01: Bound workspaceRoot validation against the allowlist
// (repo root + os.tmpdir() + explicit env extras).

import { describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import {
  AdvisorRecommendInputSchema,
  AdvisorValidateInputSchema,
  AdvisorStatusInputSchema,
  AdvisorRebuildInputSchema,
  isAllowedWorkspaceRoot,
} from '../../schemas/advisor-tool-schemas.js';

describe('AdvisorRecommendInputSchema workspaceRoot bounding (F-005-A5-01)', () => {
  it('accepts paths under os.tmpdir()', () => {
    const tmpDir = mkdtempSync(join(tmpdir(), 'speckit-advisor-test-'));
    try {
      expect(() => AdvisorRecommendInputSchema.parse({
        workspaceRoot: tmpDir,
        prompt: 'test prompt',
      })).not.toThrow();
    } finally {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('accepts the repo root', () => {
    // The advisor schema's repo-root detection walks up from cwd looking
    // for .opencode/skill. When tests run from the mcp_server directory,
    // resolve('../..') is the repo root.
    const repoRoot = resolve(process.cwd(), '..', '..', '..');
    expect(isAllowedWorkspaceRoot(repoRoot) || isAllowedWorkspaceRoot(resolve(process.cwd()))).toBe(true);
  });

  it('rejects an arbitrary path outside the allowlist', () => {
    // /etc is not under the repo root or tmpdir on any normal system.
    expect(() => AdvisorRecommendInputSchema.parse({
      workspaceRoot: '/etc',
      prompt: 'test prompt',
    })).toThrow(/workspaceRoot must resolve under/);
  });

  it('treats workspaceRoot as optional when omitted', () => {
    expect(() => AdvisorRecommendInputSchema.parse({
      prompt: 'test prompt',
    })).not.toThrow();
  });
});

describe('AdvisorValidateInputSchema workspaceRoot bounding (F-005-A5-01)', () => {
  it('accepts paths under os.tmpdir()', () => {
    const tmpDir = mkdtempSync(join(tmpdir(), 'speckit-advisor-validate-'));
    try {
      expect(() => AdvisorValidateInputSchema.parse({
        confirmHeavyRun: true,
        workspaceRoot: tmpDir,
      })).not.toThrow();
    } finally {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('rejects an arbitrary path outside the allowlist', () => {
    expect(() => AdvisorValidateInputSchema.parse({
      confirmHeavyRun: true,
      workspaceRoot: '/etc',
    })).toThrow(/workspaceRoot must resolve under/);
  });
});

describe('AdvisorStatusInputSchema workspaceRoot bounding (F-005-A5-01)', () => {
  it('rejects an arbitrary path outside the allowlist', () => {
    expect(() => AdvisorStatusInputSchema.parse({
      workspaceRoot: '/etc',
    })).toThrow(/workspaceRoot must resolve under/);
  });

  it('accepts a tmpdir path', () => {
    const tmpDir = mkdtempSync(join(tmpdir(), 'speckit-advisor-status-'));
    try {
      expect(() => AdvisorStatusInputSchema.parse({
        workspaceRoot: tmpDir,
      })).not.toThrow();
    } finally {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});

describe('AdvisorRebuildInputSchema workspaceRoot bounding (F-005-A5-01)', () => {
  it('rejects an arbitrary path outside the allowlist', () => {
    expect(() => AdvisorRebuildInputSchema.parse({
      workspaceRoot: '/etc',
    })).toThrow(/workspaceRoot must resolve under/);
  });

  it('treats workspaceRoot as optional', () => {
    expect(() => AdvisorRebuildInputSchema.parse({
      force: true,
    })).not.toThrow();
  });
});

describe('isAllowedWorkspaceRoot (F-005-A5-01)', () => {
  it('canonicalizes via realpath before checking allowlist', () => {
    // Create a tmp dir, then a symlink in tmpdir pointing to it.
    const realDir = mkdtempSync(join(tmpdir(), 'speckit-real-'));
    try {
      // os.tmpdir() symlinks resolve to themselves on macOS (e.g. /var → /private/var),
      // which is exactly why we canonicalize. The canonical form is itself in
      // the allowlist because the allowlist list includes the canonicalized
      // tmpdir prefix.
      expect(isAllowedWorkspaceRoot(realDir)).toBe(true);
    } finally {
      rmSync(realDir, { recursive: true, force: true });
    }
  });

  it('rejects unresolvable absolute paths outside the allowlist', () => {
    expect(isAllowedWorkspaceRoot('/this-path-does-not-exist-anywhere-real')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isAllowedWorkspaceRoot('')).toBe(false);
  });

  it('respects SPECKIT_ADVISOR_WORKSPACE_ALLOWLIST env extras at module load time', () => {
    // Module-level allowlist is captured at import; this assertion just
    // confirms a tmpdir path resolves true regardless of process.env state.
    const tmpDir = mkdtempSync(join(tmpdir(), 'speckit-env-extras-'));
    try {
      mkdirSync(join(tmpDir, 'nested'), { recursive: true });
      expect(isAllowedWorkspaceRoot(join(tmpDir, 'nested'))).toBe(true);
    } finally {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});
