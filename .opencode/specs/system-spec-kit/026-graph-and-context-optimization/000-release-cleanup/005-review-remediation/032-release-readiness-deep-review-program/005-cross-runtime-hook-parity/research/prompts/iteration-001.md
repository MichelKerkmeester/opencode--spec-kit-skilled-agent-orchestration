## Packet 045/005: cross-runtime-hook-parity — Deep-review angle 5 (release-readiness)

### CRITICAL: Spec folder path

The packet folder for THIS audit is: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/005-cross-runtime-hook-parity/` — write ALL packet files (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, description.json, graph-metadata.json, review-report.md) under that path. Do NOT ask for the spec folder; use this exact path.

READ-ONLY deep-review audit. Output: `review-report.md` with severity-classified P0/P1/P2 findings.

### Target surface

- `.opencode/skill/system-spec-kit/mcp_server/hooks/{claude,codex,copilot,gemini}/` (per-runtime hook source)
- `.opencode/plugins/spec-kit-skill-advisor.js` (OpenCode plugin bridge)
- `.opencode/skill/system-spec-kit/references/config/hook_system.md` (the contract)
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`
- `.claude/settings.local.json`, `.codex/settings.json`, `.gemini/settings.json` (per-runtime configs)
- 035 findings.md + 043 findings.md + 044 amendment

### Audit dimensions + parity-specific questions

For correctness: each runtime's hook produces the documented signal (additionalContext / managed-instructions / transform). Fallback chain when hook fails is operator-actionable.

For security: hook timeout fallback (Codex) doesn't silently use stale context without marking it; per-runtime auth is correctly scoped.

For traceability: each runtime's hook is observable (logs, status). Documentation matches runtime behavior runtime-by-runtime.

For maintainability: per-runtime hook structure is consistent; shared logic is extracted (no copy-paste across runtimes).

### Specific questions

- After 031's hook contract docs fix, are Copilot + Codex hook configs actually in sync with the docs?
- Does Copilot's "next-prompt freshness" (vs in-turn) produce the same TYPE of advisor brief as Claude's `additionalContext`, just on a different timing?
- After 044's sandbox-fix to 043, what's the actual live verdict per runtime when run from a normal shell? (operator should run `npm run hook-tests` — review the most recent run-output)
- For each runtime, is the fallback documented in `hook_system.md`? Does the actual fallback match what the doc says?
- Are there any silent bypass paths where a hook output is dropped without operator notification?
- The 5-runtime feature parity table in AGENTS.md / SKILL.md — does it accurately reflect runtime behavior?

### Read also

- 035 RQ5 per-runtime hook reality
- 013 F5.CopilotDocs + F5.CodexConfig P1 verdicts (RECLASSIFIED)
- 034 Copilot freshness wording + Codex cold-start smoke check
- 043 + 044 hook+plugin live test methodology
- `mcp_server/hooks/{claude,codex,copilot,gemini}/README.md` per-runtime hook docs

### Output

Same 9-section review-report.md format. Severity rubric: P0=silent feature gap (operator switches runtime, loses functionality without warning), P1=contract drift, P2=parity polish.

### Packet structure (Level 2)

Same 7-file structure. Deps include 045 phase parent + 035 + 043 + 044.

**Trigger phrases**: `["045-005-cross-runtime-hook-parity","hook parity audit","5-runtime hook review","cross-runtime feature parity"]`.

**Causal summary**: `"Deep-review angle 5: cross-runtime hook + plugin parity — Claude/Codex/Copilot/Gemini/OpenCode-plugin equivalence; fallback chains; per-runtime feature gaps; doc/runtime alignment."`.

### Constraints

READ-ONLY. Strict validator must exit 0. Cite file:line. DO NOT commit. Evergreen-doc rule.

When done, last action: strict validator passing + review-report.md complete.
