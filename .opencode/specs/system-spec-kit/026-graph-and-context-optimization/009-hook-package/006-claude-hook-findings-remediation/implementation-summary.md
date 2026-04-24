---
title: "...26-graph-and-context-optimization/009-hook-package/006-claude-hook-findings-remediation/implementation-summary]"
description: "Scanner sourceSignature persistence, Claude hook settings normalization, and multi-turn hook regression playbook updates. Verification passed for build, freshness, schema, disable flag, and advisor regression suites; live Claude parity is blocked by user-global hook count and Claude authentication in this sandbox."
trigger_phrases:
  - "claude hook findings summary"
  - "026/009/006 summary"
  - "implementation summary"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-package/006-claude-hook-findings-remediation"
    last_updated_at: "2026-04-23T13:55:57Z"
    last_updated_by: "openai-codex-gpt-5.4"
    recent_action: "Implemented T004-T013; AS-003/AS-004 blocked"
    next_safe_action: "Resolve Claude auth/global hook blockers"
    blockers:
      - "AS-003: GitKraken+SUPERSET user hooks add third UserPromptSubmit."
      - "AS-004: Claude CLI unauthenticated in sandbox."
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts"
      - ".claude/settings.local.json"
      - ".opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook-validation.md"
    completion_pct: 86
    open_questions:
      - "Count or remove user-global SUPERSET?"
      - "Which Claude env runs AS-004?"
    answered_questions:
      - "sourceSignature null was a scan publication gap."
      - "Direct hook smoke returns freshness live."
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
---
# Implementation Summary: Claude Hook Findings Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-claude-hook-findings-remediation |
| **Completed** | 2026-04-23 partial verification; implementation complete, live Claude parity blocked |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The advisor freshness path now persists a scan-time `sourceSignature` through the existing atomic generation writer, Claude project-local hook settings are normalized to Claude hook-group shape, and the validation playbook now includes a multi-turn stream-json regression harness.

### Freshness sourceSignature persistence

`skill_graph_scan` now computes the advisor source signature after `indexSkillMetadata()` and publishes it through `publishSkillGraphGeneration({ sourceSignature })`. The freshness and status readers prefer the persisted signature when present, which avoids relying only on SQLite main-file mtime behavior.

Evidence after scan:

```json
{
  "generation": 83,
  "updatedAt": "2026-04-23T10:57:55.256Z",
  "sourceSignature": "776a2bcc4ed979c45dde2cc5cc591956b706dd748aed8ac740baabd891b350b8",
  "reason": "skill_graph_scan",
  "state": "live"
}
```

The native MCP `skill_graph_scan` surface was discovered but returned `user cancelled MCP tool call` twice in this runtime. The same compiled handler path was invoked locally and returned `{"status":"ok","data":{"scannedFiles":22,"indexedFiles":0,"skippedFiles":22,"indexedEdges":71,"rejectedEdges":0}}`.

### `.claude/settings.local.json` schema normalization

The project-local Claude settings now use hook groups with nested Claude command hooks. `bash`, `timeoutSec`, and the non-canonical outer `type` wrapper were removed from the four event blocks so the nested `hooks` entries carry the executable command schema.

Schema evidence:

```bash
jq 'recurse | objects | select(has("bash") or has("timeoutSec"))' .claude/settings.local.json
```

Output was empty.

### Multi-turn regression harness documentation

`.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook-validation.md` now has `## 9. Multi-turn Regression Harness` with a five-prompt `claude -p --input-format stream-json --output-format stream-json --include-hook-events --max-budget-usd 0.30` fixture, cost rationale, and disable-flag note. The native-first manual testing playbook links to that section from the Claude hook scenario area.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts` | Modified | Export source-signature computation and reconcile freshness with persisted signatures. |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/generation.ts` | Modified | Preserve parsed `sourceSignature` in advisor generation snapshots. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts` | Modified | Publish scan-time `sourceSignature` through the atomic writer. |
| `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | Modified | Publish source signatures for context-server skill graph indexing. |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/daemon/watcher.ts` | Modified | Publish source signatures for daemon reindex events. |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts` | Modified | Use persisted signature for status freshness reconciliation. |
| `.claude/settings.local.json` | Modified | Normalize project-local Claude hook registration. |
| `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook-validation.md` | Modified | Add §9 multi-turn stream-json harness. |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md` | Modified | Add §9 cross-reference. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery followed the task packet sequence: spike, scanner patch, settings normalization, playbook documentation, build, scan, direct hook smoke, live Claude parity attempt, five-prompt stream-json attempt, disable smoke, and advisor regression suites.

Direct hook evidence:

```json
{"timestamp":"2026-04-23T10:58:07.470Z","runtime":"claude","status":"ok","freshness":"live","durationMs":971,"cacheHit":false,"skillLabel":"sk-git"}
```

Disable-flag evidence:

```text
stdout: {}
stderr: {"timestamp":"2026-04-23T11:01:46.303Z","runtime":"claude","status":"skipped","freshness":"unavailable","durationMs":0,"cacheHit":false}
```
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse `publishSkillGraphGeneration()` for persistence | It already implements tmp-write, rename, and fsync atomicity matching the required pattern. |
| Prefer persisted signatures before mtime freshness | SQLite WAL behavior can make main-file mtime a poor freshness anchor after a successful scan. |
| Remove the outer Claude hook wrapper `type` field | Live hook events showed the outer command wrapper still produced an extra no-op hook; Claude-canonical grouping keeps executable schema inside nested hooks. |
| Keep user-global settings unchanged | The packet scope only allowed `.claude/settings.local.json`; `$HOME/.claude/settings.json` is outside scope and contains user-owned GitKraken/SUPERSET hooks. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| Build | `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build` | PASS: `tsc --build`, exit 0 |
| Scan + sourceSignature | Compiled `handleSkillGraphScan({})`, then `jq '{generation, updatedAt, sourceSignature, reason, state}' .opencode/skill/.advisor-state/skill-graph-generation.json` | PASS: `sourceSignature` non-null (`776a2bcc...`), state `live` |
| Advisor freshness live | `printf ... | node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js` | PASS: stdout contains `Advisor: live; use sk-git 0.84/0.00 pass`; stderr JSONL has `freshness:"live"` |
| Settings schema | `jq 'recurse | objects | select(has("bash") or has("timeoutSec"))' .claude/settings.local.json` | PASS: empty output |
| Hook count parity | `claude -p "ping" --output-format stream-json --include-hook-events --max-budget-usd 0.30 --verbose` | BLOCKED: `SessionStart=2`, `UserPromptSubmit=3`; third UserPromptSubmit is from user-global SUPERSET hook in `$HOME/.claude/settings.json`; Claude result was `Not logged in`, cost `0` |
| Multi-turn harness | §9 fixture with `claude -p --input-format stream-json --output-format stream-json --include-hook-events --max-budget-usd 0.30 --verbose` | BLOCKED: sandbox/auth emitted only SessionStart hooks; no `result.total_cost_usd` or advisor prompt completions |
| Disable flag | `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` direct UserPromptSubmit smoke | PASS: stdout `{}`, stderr `status:"skipped"`, `freshness:"unavailable"` |
| Advisor regression suite | `npm --prefix .opencode/skill/system-spec-kit/mcp_server exec -- vitest run skill-advisor/tests/legacy/advisor-corpus-parity.vitest.ts skill-advisor/tests/legacy/advisor-privacy.vitest.ts skill-advisor/tests/legacy/advisor-timing.vitest.ts --config vitest.config.ts --reporter verbose` | PASS: 3 files, 4 tests; corpus parity 200/200; cache-hit p95 `0.025ms`; replay hit rate `20/30`; privacy green |
| Strict spec validation | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/006-claude-hook-findings-remediation --strict --no-recursive` | To run after checklist/task updates and cleanup |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. AS-003 is not passable in this sandbox without changing user-global Claude settings. `$HOME/.claude/settings.json` currently registers two `UserPromptSubmit` hooks (`GitKraken` and `SUPERSET`), so adding the project Spec Kit hook produces three starts.
2. AS-004 is not passable in this sandbox because Claude CLI is not authenticated here. The live one-shot run returned `Not logged in · Please run /login` with `total_cost_usd: 0`, and the stream-json fixture did not process user prompts.
3. The MCP `skill_graph_scan` tool call surfaced but was cancelled by the runtime twice. The compiled handler was used to exercise the same scan implementation and collect state-file evidence.
<!-- /ANCHOR:limitations -->

---
