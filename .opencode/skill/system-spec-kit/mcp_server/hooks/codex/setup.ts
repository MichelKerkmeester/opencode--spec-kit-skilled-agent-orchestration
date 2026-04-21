#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Codex Hook Setup — Policy Bootstrap
// ───────────────────────────────────────────────────────────────
// This setup entrypoint creates the optional repo-local policy file. Runtime
// hooks remain read-only and use in-memory defaults when the file is absent.

import {
  existsSync,
  mkdirSync,
  writeFileSync,
} from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_CODEX_BASH_DENYLIST,
  defaultCodexPolicyPath,
  type CodexPolicyFile,
} from './pre-tool-use.js';

const IS_CLI_ENTRY = process.argv[1]
  ? resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

// Setup writes policy at the repo-root `.codex/policy.json` regardless of cwd.
// Runtime hooks still read via defaultCodexPolicyPath() which resolves against
// the live process.cwd(), matching Codex CLI's own path semantics.
function repoRootPolicyPath(): string {
  try {
    const root = execSync('git rev-parse --show-toplevel', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (root) return resolve(root, '.codex', 'policy.json');
  } catch {
    /* fall through to cwd-based default */
  }
  return defaultCodexPolicyPath();
}

export function defaultPolicyBootstrap(): CodexPolicyFile {
  return {
    version: 1,
    notes: 'Conservative starter Bash denylist for Codex PreToolUse enforcement. Full-word match required per .opencode/skill/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts. Dual key aliases (`bashDenylist` and `bash_denylist`) are emitted for compatibility.',
    bashDenylist: DEFAULT_CODEX_BASH_DENYLIST,
    bash_denylist: DEFAULT_CODEX_BASH_DENYLIST,
  };
}

export function ensurePolicyBootstrap(policyPath = repoRootPolicyPath()): { readonly created: boolean; readonly policyPath: string } {
  if (existsSync(policyPath)) {
    return { created: false, policyPath };
  }
  mkdirSync(dirname(policyPath), { recursive: true });
  writeFileSync(policyPath, `${JSON.stringify(defaultPolicyBootstrap(), null, 2)}\n`, 'utf8');
  return { created: true, policyPath };
}

if (IS_CLI_ENTRY) {
  const result = ensurePolicyBootstrap();
  process.stderr.write(`${JSON.stringify({
    status: result.created ? 'created' : 'exists',
    policyPath: result.policyPath,
  })}\n`);
}
