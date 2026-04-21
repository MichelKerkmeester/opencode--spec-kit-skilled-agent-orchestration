---
SPECKIT_TEMPLATE_SOURCE: "spec-core | v2.2"
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
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-mcp-advisor-surface"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-20 |
| **Parent** | `../` |
| **Predecessor** | `../004-native-advisor-core/` |
| **Research source** | Track D §7 (D3, D5, D6); iterations 026, 028-029 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After 027/003 lands the native scorer in TypeScript, external callers (runtime hooks, OpenCode plugin, scripted checks, CI) still need a stable invocation surface. The memory MCP server already exposes tools via Zod schemas + dispatcher registration; the advisor should join that surface rather than stay behind a Python subprocess.

### Purpose
Expose the native advisor as three MCP tools under the system-spec-kit MCP server (not a new MCP server): `advisor_recommend`, `advisor_status`, `advisor_validate`. Strict Zod schemas, dispatcher registration, cache/freshness integration with 027/001 trust states.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
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
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### 4.1 P0 (Blocker)
1. REQ-004-P0-001: Three tools exposed with strict Zod request/response schemas: `advisor_recommend`, `advisor_status`, `advisor_validate`.
2. REQ-004-P0-002: Handlers live under `mcp_server/skill-advisor/handlers/`; tools under `mcp_server/skill-advisor/tools/`.
3. REQ-004-P0-003: Dispatcher registration integrates with existing system-spec-kit MCP server (no new MCP server).
4. REQ-004-P0-004: `advisor_recommend` returns: recommendations array, confidence, freshness trust state, lane attribution, generated_at.
5. REQ-004-P0-005: `advisor_status` returns: daemon freshness, generation, trust state, skill count, last scan time.
6. REQ-004-P0-006: `advisor_validate` returns: per-skill corpus-match results (pass / fail / skipped), overall accuracy, PLUS per-slice metrics from research.md §11:
   - `full_corpus_top1` (percentage + count + threshold ≥70%)
   - `holdout_top1` (percentage + count + threshold ≥70%)
   - `unknown_count` (target ≤10)
   - `gold_none_false_fire_count` (baseline delta)
   - `explicit_skill_top1_regression` (boolean + list)
   - `ambiguity_slice_stable` (boolean + top-2-within-0.05 fixture result)
   - `derived_lane_attribution_complete` (boolean)
   - `adversarial_stuffing_blocked` (boolean + fixture count)
   - `regression_suite_status` (P0 pass rate + failed count + command-bridge FP rate)

### 4.2 P1 (Required)
1. REQ-004-P1-001: Cache integration: `advisor_recommend` reuses post-025 HMAC prompt cache with source-signature invalidation.
2. REQ-004-P1-002: Privacy contracts preserved from post-025: no raw prompts in diagnostics / cache keys / envelope.
3. REQ-004-P1-003: Handler tests: happy-path + fail-open + stale-freshness + cache-hit + cache-miss per tool.
4. REQ-004-P1-004: Tool schema introspection docs generated.

### 4.3 P2 (Suggestion)
1. REQ-004-P2-001: `advisor_recommend` supports `trace: true` parameter for debug attribution.
2. REQ-004-P2-002: `advisor_validate` supports `--limit N` for partial corpus runs.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. ACCEPTANCE SCENARIOS

1. **AC-1** **Given** a valid prompt, **When** `advisor_recommend` runs, **Then** it returns recommendations with attribution.
2. **AC-2** **Given** a workspace root, **When** `advisor_status` runs, **Then** it returns current freshness and generation state.
3. **AC-3** **Given** a skill slug, **When** `advisor_validate` runs, **Then** it returns pass/fail slice results for that skill or all skills.
4. **AC-4** **Given** the same prompt and source signature, **When** `advisor_recommend` runs twice, **Then** the second result reports a cache hit.
5. **AC-5** **Given** stale daemon freshness, **When** `advisor_recommend` runs, **Then** it returns stale trust metadata without a blocking error.
6. **AC-6** **Given** absent daemon state, **When** `advisor_recommend` runs, **Then** it returns unavailable freshness with an empty fail-open recommendation set.
7. **AC-7** **Given** malformed input, **When** any advisor tool input schema parses it, **Then** Zod rejects it with a clear error.
8. **AC-8** **Given** prompt text containing sensitive content, **When** status or validate output is inspected, **Then** no raw prompt appears in diagnostics, cache metadata, or response envelopes.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:files -->
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
<!-- /ANCHOR:files -->

<!-- ANCHOR:open-questions -->
## 7. OPEN QUESTIONS

No open implementation questions remain. P2 trace and partial-validation limit support are explicitly deferred.
<!-- /ANCHOR:open-questions -->
