---
title: "Feature Specification: 027/004 — MCP Advisor Surface"
description: "Expose native advisor as MCP tools (advisor_recommend, advisor_status, advisor_validate) under self-contained mcp_server/skill-advisor/tools/ + handlers/. Zod schemas, dispatcher registration, cache/freshness integration. Consumes 027/003 normalized scorer output."
trigger_phrases:
  - "027/004"
  - "mcp advisor surface"
  - "advisor_recommend"
  - "advisor_status"
  - "advisor_validate"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface"
    last_updated_at: "2026-04-20T14:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Scaffolded 027/004 packet"
    next_safe_action: "Land 027/003 first, then dispatch /spec_kit:implement :auto 027/004"
    blockers: ["027/003 native core must land"]
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/tools/"
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/"
      - ".opencode/skill/system-spec-kit/mcp_server/tools/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-004-scaffold-r01"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: 027/004 — MCP Advisor Surface

<!-- SPECKIT_LEVEL: 2 -->

## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-20 |
| **Parent** | `../` |
| **Predecessor** | `../003-native-advisor-core/` |
| **Research source** | `research.md` §7 Track D (D3, D5, D6); iterations 026, 028-029 |

## 2. PROBLEM & PURPOSE

### Problem
After 027/003 lands the native scorer in TypeScript, external callers (runtime hooks, OpenCode plugin, scripted checks, CI) still need a stable invocation surface. The memory MCP server already exposes tools via Zod schemas + dispatcher registration; the advisor should join that surface rather than stay behind a Python subprocess.

### Purpose
Expose the native advisor as three MCP tools under the system-spec-kit MCP server (not a new MCP server): `advisor_recommend`, `advisor_status`, `advisor_validate`. Strict Zod schemas, dispatcher registration, cache/freshness integration with 027/001 trust states.

## 3. SCOPE

### In Scope
- `mcp_server/skill-advisor/tools/advisor-recommend.ts` — tool definition with Zod request/response schemas.
- `mcp_server/skill-advisor/tools/advisor-status.ts` — freshness + generation + trust state.
- `mcp_server/skill-advisor/tools/advisor-validate.ts` — corpus regression runner per-skill or all.
- `mcp_server/skill-advisor/handlers/*.ts` — MCP tool handlers calling into 027/003 scorer.
- Dispatcher registration inside existing system-spec-kit MCP server (no new MCP server).
- Cache/freshness integration — reuse post-025 HMAC prompt cache wrapper; source-signature invalidation; privacy contracts preserved.
- Handler tests under `mcp_server/skill-advisor/tests/handlers/`.
- Tool schema docs emitted for MCP introspection.

### Out of Scope
- Compat shims + plugin bridge migration (027/005).
- Shadow-cycle promotion machinery (027/006).
- Adding a new MCP server registration (advisor is a module inside existing system-spec-kit MCP).

## 4. REQUIREMENTS

### 4.1 P0 (Blocker)
1. Three tools exposed with strict Zod request/response schemas: `advisor_recommend`, `advisor_status`, `advisor_validate`.
2. Handlers live under `mcp_server/skill-advisor/handlers/`; tools under `mcp_server/skill-advisor/tools/`.
3. Dispatcher registration integrates with existing system-spec-kit MCP server (no new MCP server).
4. `advisor_recommend` returns: recommendations array, confidence, freshness trust state, lane attribution, generated_at.
5. `advisor_status` returns: daemon freshness, generation, trust state, skill count, last scan time.
6. `advisor_validate` returns: per-skill corpus-match results (pass / fail / skipped), overall accuracy.

### 4.2 P1 (Required)
1. Cache integration: `advisor_recommend` reuses post-025 HMAC prompt cache with source-signature invalidation.
2. Privacy contracts preserved from post-025: no raw prompts in diagnostics / cache keys / envelope.
3. Handler tests: happy-path + fail-open + stale-freshness + cache-hit + cache-miss per tool.
4. Tool schema introspection docs generated.

### 4.3 P2 (Suggestion)
1. `advisor_recommend` supports `trace: true` parameter for debug attribution.
2. `advisor_validate` supports `--limit N` for partial corpus runs.

## 5. ACCEPTANCE SCENARIOS

1. **AC-1** `advisor_recommend({prompt: "...", workspaceRoot: "..."})` returns recommendations with attribution.
2. **AC-2** `advisor_status({workspaceRoot})` returns current freshness + generation after a daemon scan.
3. **AC-3** `advisor_validate({skillSlug: "sk-git"})` returns pass/fail against corpus subset matching that skill.
4. **AC-4** Cache hit path: same prompt + source signature → instant return (cache-hit p95 ≤50ms gate from 027/003).
5. **AC-5** Stale freshness: daemon marks stale; `advisor_recommend` returns with `trust: "stale"` and no blocking error.
6. **AC-6** Fail-open: daemon absent; `advisor_recommend` returns `trust: "unavailable"` + `brief: null`.
7. **AC-7** Zod schema rejects malformed input with clear error (schema validation test).
8. **AC-8** Privacy test: no raw prompt in response diagnostics or cache key.

## 6. FILES TO CHANGE

### New (under `mcp_server/skill-advisor/`)
- `tools/{advisor-recommend,advisor-status,advisor-validate}.ts`
- `handlers/{advisor-recommend,advisor-status,advisor-validate}.ts`
- `schemas/advisor-tool-schemas.ts` — Zod request/response
- `tests/handlers/*.vitest.ts`
- `tests/tools/*.vitest.ts` (schema validation)

### Modified
- `mcp_server/tools/` index or dispatcher — register new tools
- `mcp_server/core/` — MCP dispatcher wiring (if needed)
