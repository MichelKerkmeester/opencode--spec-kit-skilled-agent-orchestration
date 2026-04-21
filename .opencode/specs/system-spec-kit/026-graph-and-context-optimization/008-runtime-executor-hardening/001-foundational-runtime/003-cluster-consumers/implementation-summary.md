---
title: "Implementation Summary: Wave B — Cluster Consumers"
description: "Phase 017 Wave B complete: 10 commits on main across 4 parallel lanes. Lane B1 canonical-save consumers, Lane B2 Cluster D+E (code-graph 6-sibling readiness + Copilot compact-cache parity), Lane B3 Cluster A lint + C NFKC + retry budget, Lane B4a AsyncLocalStorage + Lane B4b session-resume auth binding."
trigger_phrases: ["017 wave b summary", "wave b implementation", "cluster consumers summary", "copilot compact cache", "mcp caller context"]
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/001-foundational-runtime/003-cluster-consumers"
    last_updated_at: "2026-04-17T18:10:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Wave B complete: 10 commits across 4 parallel lanes closing 9 Wave-B tasks + AsyncLocalStorage transport integration"
    next_safe_action: "Wave B unblocked C (rollout) + enabled session-resume auth. See parent 017/implementation-summary.md for full Phase 017 narrative."
    blockers: []
    completion_pct: 100
---
# Implementation Summary: Wave B — Cluster Consumers

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

> **Status: COMPLETE.** 10 commits landed on `main` on 2026-04-17 across 4 parallel lanes (B1/B2/B3 concurrent + B4a parallel + B4b sequential after B4a). Consumes Wave A infrastructure primitives and lands two new clusters (D code-graph asymmetry, E Copilot observability gap).

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Wave** | B (Cluster Consumers, 4 parallel lanes) |
| **Parent** | `016-foundational-runtime/` |
| **Completed** | 2026-04-17 |
| **Tasks Closed** | 10 (9 primary + AsyncLocalStorage infrastructure) |
| **Commits** | 10 |
| **Lanes** | B1 (canonical consumers), B2 (Cluster D+E), B3 (Cluster A lint + C + retry), B4a (AsyncLocalStorage), B4b (auth binding) |
| **Effort Budget** | 30h planned, ~45 min wall-clock via parallel cli-copilot gpt-5.4 high (3 concurrent + sequential B4b) |
| **Executor** | cli-copilot gpt-5.4 --effort high |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Lane B1 — Canonical save consumers (4 commits)

**T-CNS-02 — Research folder backfill** (commit `88063287b`)
New `scripts/memory/backfill-research-metadata.ts` walks `research/NNN-*/iterations/` subtrees and auto-creates `description.json` + `graph-metadata.json` for any directory missing them. Integrates into `scripts/core/workflow.ts` as a post-save step when target has `research/` children. Resolves R3-P1-002, R56-P1-NEW-003.

**T-W1-CNS-05 — Continuity freshness validator** (commit `32a180bba`)
New `scripts/validation/continuity-freshness.ts` parses `implementation-summary.md` frontmatter `_memory.continuity`. Warns (exits 1 in strict) when `last_updated_at` lags `graph-metadata.derived.last_save_at` by >10 minutes. Wired into `validate.sh --strict` mode. Tests: 6 cases (fresh/stale/missing-continuity/missing-graph-metadata/clock-drift/warn-vs-fail). Resolves R51-P1-003.

**T-CGC-02 — context.ts explicit error branch** (commit `db36c3194`)
`handlers/code-graph/context.ts:96-105` silent catch replaced with explicit error state emitting `reason: 'readiness_check_crashed'` + crashError string. Downstream readiness-contract emits `trustState: 'unavailable'` for crashed readiness. Partial R6-P1-001 mitigation (full readiness parity landed in T-W1-CGC-03).

**T-RBD-03 — Design-intent comments** (commit `f42c5d3b6`)
3-5 line comment blocks added at `handlers/save/post-insert.ts:344-369` + `handlers/save/response-builder.ts:136-201` documenting the intentional rollup divergence: post-insert.ts executionStatus tracks failure-with-recovery granularity; response-builder.ts postInsertEnrichment surfaces coarser status to MCP clients. Cites T-RBD-01 (commit `709727e98`) as original consumer contract. Resolves R6-P2-001.

### Lane B2 — Cluster D + Cluster E (2 commits)

**T-W1-CGC-03 — 5-sibling code-graph readiness propagation** (commit `f253194bf`, Cluster D NEW)
All 6 code-graph handlers (`scan.ts`, `status.ts`, `context.ts`, `ccc-status.ts`, `ccc-reindex.ts`, `ccc-feedback.ts`) consume `lib/code-graph/readiness-contract.ts` (Wave A). Emit `canonicalReadiness` + `trustState` + `lastPersistedAt` via the shared contract.

CCC trio stub rollout: `ccc-status.ts` + `ccc-reindex.ts` + `ccc-feedback.ts` emit `trustState: 'unavailable'` + `reason: 'readiness_not_applicable'` where full-readiness semantics don't apply to the handler's operation. Documented in commit message.

Tests: `mcp_server/tests/code-graph-siblings-readiness.vitest.ts` — asserts all 6 siblings emit the 3 fields with the 4-state subset of `SharedPayloadTrustState`. Resolves R52-P1-001 (Cluster D).

**T-W1-HOK-01 — Copilot compact-cache + session-prime** (commit `5923737c7`, Cluster E NEW)
New `hooks/copilot/compact-cache.ts` mirrors Gemini's shape. Imports `wrapRecoveredCompactPayload` from `hooks/shared-provenance.ts` (Wave A extract). Writes `trustState: 'cached'` on compact payload caching.

`hooks/copilot/session-prime.ts` extended to read `payloadContract?.provenance.trustState` at session-prime entry, matching Claude `session-prime.ts:70` and Gemini `session-prime.ts:77` patterns.

Tests: `mcp_server/tests/copilot-compact-cycle.vitest.ts` — 5/5 parallel to Claude + Gemini compact-cycle patterns. 98/98 full hook regression sweep green. Resolves R52-P1-002 (Cluster E) + R56-P1-NEW-002 (H-56-4 compound).

### Lane B3 — Cluster A lint + Cluster C + retry (3 commits)

**T-SCP-02 — Normalizer lint rule** (commit `ded5ece07`)
Lint rule rejects new local `normalizeScope*` / `getOptionalString` function declarations outside `lib/governance/scope-governance.ts`. Wired into `validate.sh --strict` via grep-based rule runner. Resolves R4-P1-001 prevention.

**T-SAN-01 + T-SAN-02 + T-SAN-03 — NFKC unicode sanitization** (commit `1bd7856a9`, atomic-shipped)
- `shared/gate-3-classifier.ts:normalizePrompt`: added `.normalize('NFKC')` + strip `[\u00AD\u200B-\u200F\uFEFF]` before `.toLowerCase()`
- `hooks/shared-provenance.ts:sanitizeRecoveredPayload` (moved from Claude in Wave A): mirror NFKC pass in `RECOVERED_TRANSCRIPT_STRIP_PATTERNS` regex preprocessing
- New `scripts/tests/gate-3-classifier.vitest.ts` — 5+ unicode cases (Cyrillic `е`, soft hyphen, zero-width space, Greek `Ε`, combined homoglyph+zero-width)
- Renamed `p0-a-cross-runtime-tempdir-poisoning.vitest.ts` `it()` block to "Claude and Gemini consumers" with inline comment noting OpenCode schema-share inheritance

Resolves R2-P1-002, R2-P2-001, R3-P2-003, R5-P2-001.

**T-PIN-RET-01 — Retry-exhaustion budget** (commit `61f93c9bf`)
New `mcp_server/lib/enrichment/retry-budget.ts` with `shouldRetry(memoryId, step, reason)` + `recordFailure` + `clearBudget` + `getBudgetSize`. Keyed on `(memoryId, step, reason)` tuples. Skip after N=3 retries.

`handlers/save/post-insert.ts:159-173` + `post-insert.ts:347-365` wire retry check before `runEnrichmentBackfill` scheduling on `partial_causal_link_unresolved` path. Structured warning log on exhaustion. `clearBudget(memoryId)` on successful completion.

Tests: `mcp_server/tests/retry-budget.vitest.ts` — 8+ cases (1st-3rd attempts allowed, 4th rejected, key isolation, clearBudget scoping). Resolves R1-P1-002.

### Lane B4a — MCP transport caller context (1 commit)

**T-SRS-BND-01 prep — AsyncLocalStorage caller-context** (commit `debb5d7a8`)
New `mcp_server/lib/context/caller-context.ts`:
- `runWithCallerContext<T>(ctx: MCPCallerContext, fn: () => T): T`
- `getCallerContext(): MCPCallerContext | null`
- `requireCallerContext(): MCPCallerContext` (throws outside a run)

`MCPCallerContext` carries `sessionId | null`, `transport: 'stdio' | 'sse' | 'ws' | 'unknown'`, `connectedAt`, `callerPid?`, `metadata: Record<string, unknown>`. All readonly.

Wired into `context-server.ts` via `buildCallerContext(extra)` helper that the MCP `CallToolRequestSchema` handler passes to `runWithCallerContext`. Zero handler signature churn — consumers call `getCallerContext()` at the boundary.

Tests: `mcp_server/tests/caller-context.vitest.ts` — 12 cases covering AsyncLocalStorage propagation across `await` + `setTimeout` + `Promise.all`, nested runs, readonly immutability, null defaults.

### Lane B4b — Session-resume auth binding (1 commit, sequential after B4a)

**T-SRS-BND-01 — session-resume auth** (commit `87636d923`)
`handlers/session-resume.ts` reads `callerCtx.sessionId` via `getCallerContext()` at `handleSessionResume` entry. Rejects mismatched `args.sessionId` with error. `MCP_SESSION_RESUME_AUTH_MODE=permissive` env flag logs warning instead of rejecting (for canary rollout). Default = strict.

Tests: `mcp_server/tests/session-resume-auth.vitest.ts` — 8 cases (match/mismatch/null-context/missing-args/permissive/strict/non-string/empty-string). 8/8 + 29/29 regression slice (session-resume + session-bootstrap + caller-context + auth) green.

Resolves R2-P1-001 (cross-session cached-summary leakage).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

### Parallel dispatch model

Per `feedback_copilot_concurrency_override.md`: cli-copilot gpt-5.4 `--effort high` capped at 3 concurrent agents. Wave B used 4 lanes but B4b was sequential after B4a merged (depends on caller-context module).

**Cohort 1 (3 concurrent cli-copilot agents)**: Lane B1 + Lane B2 + Lane B3
**Cohort 2 (2 concurrent)**: Lane B4a + Lane B1 cleanup (initial B1 agent left 3/4 tasks uncommitted; cleanup agent verified state + reported work already complete after original B1 finished during overlap window)
**Cohort 3 (sequential after B4a)**: Lane B4b

### Parallel-lane file isolation

Wave B avoided merge conflicts across 4 concurrent lanes by file-level disjointness:
- Lane B1: `scripts/memory/`, `scripts/validation/`, `handlers/code-graph/context.ts`, `handlers/save/post-insert.ts` + `response-builder.ts` (comments only, lines 344-369 / 136-201)
- Lane B2: `handlers/code-graph/{scan,status,ccc-*}.ts`, `hooks/copilot/`
- Lane B3: `shared/gate-3-classifier.ts`, `hooks/claude/shared.ts`, `handlers/save/post-insert.ts` (retry-budget integration in `partial_causal_link_unresolved` path — different lines than B1's comments)
- Lane B4a: new `lib/context/caller-context.ts`, `context-server.ts`
- Lane B4b (sequential): `handlers/session-resume.ts`

### Wave B gate

Smoke-test approach: per-commit targeted vitest + broader cross-lane sweep after merge. Lane-specific regression sweeps:
- Lane B1: 6/6 continuity-freshness + existing handler-context tests
- Lane B2: 5/5 code-graph-siblings-readiness + Copilot compact-cycle + 98/98 hook regression
- Lane B3: 8+ retry-budget tests + existing gate-3 + sanitize-recovered-payload tests
- Lane B4a: 12/12 caller-context propagation tests + full mcp_server sweep
- Lane B4b: 8/8 auth binding + 29/29 regression slice
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

1. **CCC trio stub rollout**: `ccc-status.ts`, `ccc-reindex.ts`, `ccc-feedback.ts` don't have readiness semantics in the same shape as `query.ts` (they operate on CocoIndex context, not code-graph index). Rather than forcing full readiness, emit `trustState: 'unavailable'` + `reason: 'readiness_not_applicable'` stub. Backward-compat preserved; consumers keyed on `trustState !== undefined` don't conclude the handler failed.

2. **Lane B4 split (B4a parallel + B4b sequential)**: Plan agent critique flagged potential merge conflicts between B2 handler-signature changes and B4 caller-context threading if both ran fully parallel. Split to B4a (transport + module only, parallel) + B4b (session-resume handler, sequential after B2+B4a merge). Collapsed B4b scope significantly via AsyncLocalStorage (zero handler signature churn).

3. **AsyncLocalStorage vs signature propagation**: Explicit argument threading would have touched ~30 handler files. AsyncLocalStorage requires only the transport wrap + module export. Works across async boundaries (await, setTimeout, Promise.all).

4. **Permissive canary mode for auth binding**: `MCP_SESSION_RESUME_AUTH_MODE=permissive` allows staged rollout to production MCP deployments. Default = strict for new deployments. If a deployment has sessions with mismatched sessionId expectations, operator flips the flag, verifies canary behavior, then flips back to strict.

5. **atomic-ship T-SAN-01 + T-SAN-02 + T-SAN-03**: NFKC code changes + unicode test cases in same commit. Splitting would leave test file failing until code lands (red build window).
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `tsc --noEmit`: clean across all 10 Wave B commits
- Broad mcp_server test sweep post-merge: 145/145 green (code-graph + hook + handler-save slice)
- No Phase 017 regressions surfaced. Pre-existing `handler-memory-save.vitest.ts` `qualityFlags is not iterable` bug at `memory-save.ts:368` (from v3.4.0.1 P0-B commit `104f534bd`) remained unchanged — orthogonal to Phase 017 scope.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Limitations

- **T-SRS-BND-01 canary**: Default strict mode + permissive flag available but hasn't been canary-verified on a live production MCP session. Recommend verifying with a test session before rolling out broadly.
- **CCC trio stub**: Stubs `trustState: 'unavailable'` are functional but future CCC handler work may benefit from a CCC-specific readiness vocabulary if the index-health semantics diverge meaningfully from code-graph.
- **Retry budget is in-memory**: `lib/enrichment/retry-budget.ts` uses an in-memory Map. Budget resets on process restart. For longer-lived retry tracking across deploys, a persistent store would be needed (Phase 018+ if observed).
- **Copilot autonomous execution**: T-W1-HOK-01 landed parity but Copilot-primary autonomous iteration (Phase 018 plan) hasn't been exercised end-to-end under this new surface. Smoke-gate passed; production-load verification pending.
<!-- /ANCHOR:limitations -->
