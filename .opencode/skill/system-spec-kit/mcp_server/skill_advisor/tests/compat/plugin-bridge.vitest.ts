// ───────────────────────────────────────────────────────────────
// MODULE: Plugin Bridge Tests
// ───────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..', '..', '..', '..', '..', '..');
const bridgePath = resolve(repoRoot, '.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs');

function runBridge(payload: Record<string, unknown>, env: NodeJS.ProcessEnv = {}) {
  return spawnSync('node', [bridgePath], {
    cwd: repoRoot,
    input: JSON.stringify({
      workspaceRoot: repoRoot,
      maxTokens: 80,
      thresholdConfidence: 0.8,
      ...payload,
    }),
    encoding: 'utf8',
    env: {
      ...process.env,
      ...env,
    },
  });
}

function parseBridge(stdout: string): { status: string; brief: string | null; metadata: Record<string, unknown> } {
  return JSON.parse(stdout.trim());
}

describe('spec-kit skill advisor plugin bridge compat path', () => {
  it('publishes one effective-threshold contract for whichever bridge route is active', () => {
    const result = runBridge({ prompt: 'save this conversation context to memory' });
    expect(result.status).toBe(0);
    const parsed = parseBridge(result.stdout);
    expect(parsed.status).toBe('ok');
    expect(parsed.brief).toContain('Advisor:');
    expect(parsed.brief).toContain('system-spec-kit');
    expect(parsed.brief).toMatch(/\d+\.\d{2}\/\d+\.\d{2} pass\./);
    expect(['native', 'python']).toContain(parsed.metadata.route);
    expect(parsed.metadata.workspaceRoot).toBe(repoRoot);
    expect(parsed.metadata.effectiveThresholds).toEqual({
      confidenceThreshold: 0.8,
      uncertaintyThreshold: 0.35,
      confidenceOnly: false,
    });
  });

  it('defaults omitted thresholdConfidence to the live 014 threshold pair', () => {
    const result = runBridge({
      prompt: 'save this conversation context to memory',
      thresholdConfidence: undefined,
    });
    expect(result.status).toBe(0);
    const parsed = parseBridge(result.stdout);
    expect(parsed.status).toBe('ok');
    expect(parsed.metadata.effectiveThresholds).toEqual({
      confidenceThreshold: 0.8,
      uncertaintyThreshold: 0.35,
      confidenceOnly: false,
    });
  });

  it('renders native uncertainty from the recommendation instead of a literal zero', () => {
    const source = readFileSync(bridgePath, 'utf8');

    // The bridge sources its defaults from compat-contract.json (deep-review remediation
    // commit 8c8c3fcc42). Assert the import + assignment + contract values rather than
    // inline numeric literals, so the test stays stable under contract refactors.
    const contractPath = resolve(repoRoot, '.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/compat-contract.json');
    const contract = JSON.parse(readFileSync(contractPath, 'utf8'));
    expect(contract.defaults.confidenceThreshold).toBe(0.8);
    expect(contract.defaults.uncertaintyThreshold).toBe(0.35);
    expect(source).toContain('const DEFAULT_CONFIDENCE_THRESHOLD = COMPAT_CONTRACT.defaults.confidenceThreshold;');
    expect(source).toContain('const DEFAULT_UNCERTAINTY_THRESHOLD = COMPAT_CONTRACT.defaults.uncertaintyThreshold;');
    // F-006-B1-03: The dead `renderNativeBrief()` was removed; bridge output now
    // flows exclusively through `renderAdvisorBrief()` loaded via
    // `loadNativeAdvisorModules()`. The original literal-zero regression guard
    // (against `${formatScore(top.confidence)}/0.00 pass.`) is preserved here
    // since `renderAdvisorBrief()` in `lib/render.ts` is the live renderer.
    expect(source).toContain('renderAdvisorBrief');
    expect(source).not.toContain('${formatScore(top.confidence)}/0.00 pass.');
  });

  it('falls back to the Python-backed brief producer when native is forced local', () => {
    const result = runBridge({ prompt: 'help me commit my changes', forceLocal: true }, {
      SPECKIT_SKILL_ADVISOR_FORCE_LOCAL: '1',
    });
    expect(result.status).toBe(0);
    const parsed = parseBridge(result.stdout);
    expect(parsed.status).toBe('ok');
    expect(parsed.metadata.route).toBe('python');
    expect(parsed.metadata.effectiveThresholds).toEqual({
      confidenceThreshold: 0.8,
      uncertaintyThreshold: 0.35,
      confidenceOnly: false,
    });
  });

  it('returns a prompt-safe silent fail-open for the shared disabled flag', () => {
    // F-006-B1-02: Disabled mode now silently fails open (brief is null), aligning
    // OpenCode with every other runtime (Codex, Claude, Copilot, Gemini). Callers
    // still detect the disabled state via metadata.route === 'disabled'. Privacy
    // guard preserved: prompt content must not leak to stdout.
    const result = runBridge({ prompt: 'private@example.com should not appear' }, {
      SPECKIT_SKILL_ADVISOR_HOOK_DISABLED: '1',
    });
    expect(result.status).toBe(0);
    const parsed = parseBridge(result.stdout);
    expect(parsed.status).toBe('skipped');
    expect(parsed.brief).toBeNull();
    expect(parsed.metadata.route).toBe('disabled');
    expect(parsed.metadata.freshness).toBe('unavailable');
    expect(parsed.metadata.recommendationCount).toBe(0);
    expect(result.stdout).not.toContain('private@example.com');
  });
});
