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

export function defaultPolicyBootstrap(): CodexPolicyFile {
  return {
    version: 1,
    notes: 'Conservative starter Bash denylist for Codex PreToolUse enforcement. Full-word match required per .opencode/skill/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts. Dual key aliases (`bashDenylist` and `bash_denylist`) are emitted for compatibility.',
    bashDenylist: DEFAULT_CODEX_BASH_DENYLIST,
    bash_denylist: DEFAULT_CODEX_BASH_DENYLIST,
  };
}

export function ensurePolicyBootstrap(policyPath = defaultCodexPolicyPath()): { readonly created: boolean; readonly policyPath: string } {
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
