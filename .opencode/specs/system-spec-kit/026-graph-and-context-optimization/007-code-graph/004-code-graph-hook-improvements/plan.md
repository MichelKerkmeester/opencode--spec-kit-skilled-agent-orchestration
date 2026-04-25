---
title: "Implem [system-spec-kit/026-graph-and-context-optimization/007-code-graph/004-code-graph-hook-improvements/plan]"
description: "Implements the code-graph query, scan, startup, and context contract fixes defined by packet 013 research. The plan sequences zero-calls remediation, blocked-read handling, metadata lifecycle cleanup, and startup/context parity work using the existing code-graph and hook surfaces."
trigger_phrases:
  - "implementation plan"
  - "code-graph hook improvements"
  - "013"
  - "hook daemon parity"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/004-code-graph-hook-improvements"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Created Level 2 implementation plan from pt-02 findings and merged Bucket A synthesis"
    next_safe_action: "Execute plan tasks starting with resolver and blocked-read regression baselines"
    blockers:
      - "checklist.md is still missing for this Level 2 packet"
      - "spec.md still lacks required anchor/template markers"
    key_files:
      - "plan.md"
      - "tasks.md"
      - "spec.md"
    completion_pct: 35
    open_questions:
      - "Whether packet execution will propagate structured startup payloads or remove the builder-level contract for 013-F-005"
    answered_questions:
      - "Bucket A findings and zero-calls remediation must both be represented in the implementation plan"
template_source_marker: "plan-core | v2.2"
---
# Implementation Plan: Code-Graph Hook Improvements

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Markdown |
| **Framework** | System Spec Kit MCP server, code-graph handlers, runtime startup hooks |
| **Storage** | SQLite-backed code-graph metadata plus packet docs under `.opencode/specs/**` |
| **Testing** | Vitest handler/runtime suites, packet validator, targeted `rg` contract checks |

### Overview
This plan turns the `013-code-graph-hook-improvements` research outputs into an implementation sequence that stays inside the current code-graph and hook architecture. The highest-priority work fixes resolver correctness and blocked-read behavior for CALLS queries, then closes the remaining metadata lifecycle, startup transport, and bounded-context contract gaps identified in pt-02 research and the merged Bucket A synthesis.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Scope is anchored to `spec.md` Section 3 and excludes storage-engine rewrites, broad memory work, and reopened CF-009/CF-010/CF-014 remediation
- [x] Packet inputs reviewed: pt-02 `research.md`, pt-02 `findings-registry.json`, merged Bucket A synthesis, merged findings JSON, and packet-local zero-calls investigation
- [x] Every planned phase and deliverable maps to explicit finding IDs: `013-ZC-F-001` through `013-ZC-F-004` and `013-F-001` through `013-F-006`

### Definition of Done
- [ ] `013-ZC-F-001`, `013-ZC-F-002`, `013-ZC-F-003`, `013-F-001`, `013-F-002`, and `013-F-003` ship with regression coverage on their listed target files
- [ ] `013-ZC-F-004`, `013-F-004`, `013-F-005`, and `013-F-006` either ship or are explicitly deferred with packet-local rationale before closeout
- [ ] Query, context, scan, status, and startup surfaces expose the intended blocked/degraded, selected-candidate, graph-quality, and partial-output contracts without drifting from the research recommendations
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Contract-hardening remediation inside the existing code-graph query, scan, and startup pipeline, with parity tests enforcing the intended runtime transport and observability behavior.

### Key Components
- **CALLS resolver and query handlers**: `query.ts` plus query-handler tests absorb `013-ZC-F-001`, `013-ZC-F-002`, `013-ZC-F-003`, `013-ZC-F-004`, and the query side of `013-F-001`.
- **Context seed and bounded-work path**: `seed-resolver.ts`, `context.ts`, `code-graph-context.ts`, and context-handler tests absorb `013-F-001`, `013-F-002`, and `013-F-006`.
- **Scan metadata lifecycle and status readers**: `scan.ts`, `code-graph-db.ts`, `status.ts`, `startup-brief.ts`, and scan/status coverage absorb `013-F-003` and `013-F-004`.
- **Runtime startup adapters**: `startup-brief.ts`, Claude/Gemini/Copilot/Codex startup hooks, and adapter tests absorb `013-F-005` and the startup-facing portion of `013-F-004`.

### Data Flow
CALLS-oriented queries first resolve a subject node in `query.ts`, then execute graph reads that must either return implementation-focused results or an explicit blocked/degraded contract when readiness demands a full scan (`013-ZC-F-001`, `013-F-001`). Context requests carry richer CocoIndex seed metadata and bounded-work deadline state through `seed-resolver.ts` and `code-graph-context.ts` (`013-F-002`, `013-F-006`), while scans persist metadata that status/startup readers can surface without leaving stale summaries behind (`013-F-003`, `013-F-004`, `013-F-005`).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Build the regression matrix for ambiguous CALLS subject selection and suppressed `full_scan` handling using `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts` and `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts` (`013-ZC-F-001`, `013-ZC-F-003`, `013-F-001`).
- [ ] Capture the current semantic-seed, graph-quality-summary, and bounded-context gaps across `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/seed-resolver.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts`, and `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts` (`013-F-002`, `013-F-003`, `013-F-004`, `013-F-006`).
- [ ] Decide the startup transport direction called for by Bucket A CG-T4 so runtime hooks and tests can implement one consistent contract in `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts`, and `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts` (`013-F-005`).

### Phase 2: Core Implementation
- [ ] `CG-T1` Resolver correctness and blocked-read contract: make CALLS subject resolution operation-aware in `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts`, replace first-candidate ambiguity expectations in `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`, and return explicit blocked/degraded read contracts from `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts` plus `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts` (`013-ZC-F-001`, `013-ZC-F-003`, `013-F-001`).
- [ ] `CG-T2` Query/result observability: surface selected-candidate metadata in `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts`, preserve semantic score/snippet/range fidelity through `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/seed-resolver.ts` and `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts`, and align query/context handler tests with the new ranking contract (`013-ZC-F-002`, `013-ZC-F-004`, `013-F-002`).
- [ ] `CG-T3` Scan metadata lifecycle: allow null-summary scans to clear persisted enrichment state in `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts` and `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts`, then expose graph-quality summary state through `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/status.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts`, and `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` (`013-F-003`, `013-F-004`).
- [ ] `CG-T4` Startup/context contract parity: implement the chosen startup payload contract in `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts` plus all runtime adapters, and make bounded-work deadlines and partial-output markers real in `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts` and `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts` (`013-F-005`, `013-F-006`).

### Phase 3: Verification
- [ ] Run targeted Vitest suites for query/context behavior, scan metadata clearing, and startup transport parity across `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-scan.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts`, and `.opencode/skill/system-spec-kit/mcp_server/tests/codex-session-start-hook.vitest.ts` (`013-ZC-F-001`, `013-ZC-F-002`, `013-ZC-F-003`, `013-ZC-F-004`, `013-F-001`, `013-F-002`, `013-F-003`, `013-F-005`, `013-F-006`).
- [ ] Run cross-consistency greps for `full_scan`, selected-candidate metadata, graph-quality summary readers, `sharedPayload`, `deadlineMs`, and partial-output markers so all handler and adapter surfaces expose the same contract vocabulary (`013-ZC-F-002`, `013-F-004`, `013-F-005`, `013-F-006`).
- [ ] Re-run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/004-code-graph-hook-improvements --strict` before closeout so packet docs and implementation evidence stay aligned to the spec boundary (`013-ZC-F-001`, `013-F-001`, `013-F-003`, `013-F-005`).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Resolver ranking, ambiguity metadata, full-scan blocking, seed fidelity, deadline/partial-output helpers in `query.ts`, `context.ts`, `seed-resolver.ts`, and `code-graph-context.ts` | Focused Vitest suites under `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/` |
| Integration | Scan-to-status/startup summary propagation and runtime startup adapter parity across `scan.ts`, `code-graph-db.ts`, `status.ts`, `startup-brief.ts`, and hook adapters | Vitest suites under `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/` and `.opencode/skill/system-spec-kit/mcp_server/tests/` |
| Regression | Packet validator plus `rg` contract checks for `013-ZC-F-001` through `013-F-006` target files, including `ENV_REFERENCE.md` wording | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ... --strict`, `rg`, and targeted file review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Closed `CF-009` staged-persistence remediation in `007-deep-review-remediation/006-integrity-parity-closure/` | Internal upstream | Green | `013-F-003` and `013-F-004` risk reintroducing stale-write behavior if metadata lifecycle assumptions drift |
| Closed `CF-010` trust/readiness unification in `007-deep-review-remediation/006-integrity-parity-closure/` | Internal upstream | Green | `013-F-001` must extend the existing readiness contract rather than fork a new blocked-read vocabulary |
| Closed `CF-014` artifact-root correction in `007-deep-review-remediation/006-integrity-parity-closure/` | Internal upstream | Green | Validation and packet evidence paths used by this plan assume the corrected packet-local artifact layout |
| Bucket A merged synthesis for packet `013` | Internal upstream | Green | The plan would lose required zero-calls fold-in and cross-contract ordering if the merged synthesis were ignored |
| Future packet-013 implementation execution and closeout docs | Internal downstream | Planned | This plan is the sequencing input for the later code changes, checklist updates, and implementation-summary evidence |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: CALLS queries regress to wrapper-node results, read paths over-block or silently degrade, graph-quality summaries become misleading, or startup/context transports diverge from the chosen contract.
- **Procedure**: Revert Phase 2 in reverse dependency order: undo startup/context parity changes (`013-F-005`, `013-F-006`), revert status/scan metadata lifecycle changes (`013-F-003`, `013-F-004`), then revert resolver and blocked-read changes together with their paired tests (`013-ZC-F-001` through `013-ZC-F-004`, `013-F-001`, `013-F-002`) so the query/context surfaces return to the last known-good contract.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup baselines) ──► Phase 2 (Resolver + scan + startup/context fixes) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup baselines | None | Core implementation, verification |
| Core implementation | Setup baselines | Verification |
| Verification | Setup baselines, core implementation | Packet closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup baselines | Medium (~40-80 LOC of regression/test scaffolding and contract notes) | 1-2 hours |
| Core implementation | High (~220-360 LOC across handlers, libs, hooks, tests, and `ENV_REFERENCE.md`) | 5-8 hours |
| Verification | Medium (~20-40 LOC of follow-up test/doc fixes if parity gaps surface) | 1-2 hours |
| **Total** | | **7-12 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Resolver ambiguity regressions cover wrapper/export/function competition before shipping `013-ZC-F-001` and `013-ZC-F-003`
- [ ] Startup adapter tests reflect the chosen `013-F-005` transport contract before runtime hooks change
- [ ] Status/startup surfaces show current graph-quality summary state and null-summary clearing behavior before closing `013-F-003` and `013-F-004`

### Rollback Procedure
1. Revert startup/context parity edits in `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts`, and `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts`.
2. Revert graph-quality summary lifecycle edits in `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/status.ts`, and `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`.
3. Revert resolver, ambiguity metadata, and blocked-read edits in `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/seed-resolver.ts`, and their paired Vitest suites.
4. Re-run the targeted Vitest suites plus `validate.sh --strict` to confirm the packet returned to the previous stable state.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: If rollback follows a scan that persisted new graph-quality summary metadata, run one clean code-graph scan on the reverted code so persisted summary fields match the restored handler/database contract.
<!-- /ANCHOR:enhanced-rollback -->

---
