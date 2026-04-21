---
title: "Feature Specification: 027/001 — Daemon + Freshness Foundation"
description: "Chokidar narrow metadata watcher, workspace-scoped single-writer lease, hash-aware scan wiring, post-commit generation + cache invalidation, fail-open freshness semantics, and watcher benchmark release gate (≤1% CPU / <20MB RSS)."
trigger_phrases:
  - "027/001"
  - "daemon foundation"
  - "skill-graph watcher"
  - "single-writer lease"
  - "watcher benchmark"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/002-daemon-freshness-foundation"
    last_updated_at: "2026-04-20T14:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Scaffolded 027/001 packet"
    next_safe_action: "Dispatch /spec_kit:implement :auto on 027/001"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/daemon/"
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/code-graph/freshness.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-001-scaffold-r01"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: 027/001 — Daemon + Freshness Foundation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-20 |
| **Parent** | `../` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../001-validator-esm-fix/spec.md` |
| **Successor** | `../003-lifecycle-and-derived-metadata/spec.md` |
| **Research source** | `../../research/027-skill-graph-daemon-and-advisor-unification-pt-01/research.md` §4 Track A + §13.2 Track E + §13.6 delta row `027/001`; iterations 001-008 + 041-044 + 056 (Y1) |

## 2. PROBLEM & PURPOSE

### Problem
The skill-graph + per-skill `graph-metadata.json` files are regenerated via explicit scripts (`skill_graph_compiler.py`, `generate-context.js`). Authors who edit a SKILL.md must remember to run a script or the advisor's match index goes stale. Without a freshness contract the runtime cannot tell stale data from live data, and concurrent writers would race the SQLite graph.

### Purpose
Stand up the workspace-scoped daemon foundation: narrow Chokidar watcher, hash-aware SQLite scan wiring, single-writer lease, post-commit generation + cache invalidation, fail-open freshness states (`live`/`stale`/`absent`/`unavailable`), and a release-gate watcher benchmark enforcing the ≤1% CPU / <20MB RSS budget.

## 3. SCOPE

### In Scope
- `mcp_server/skill-advisor/lib/daemon/` — Chokidar watcher module keyed on workspace root. Narrow defaults: watch only `.opencode/skill/**/graph-metadata.json` + `.opencode/skill/**/SKILL.md`. Broad-scope watching is gated behind the benchmark.
- `mcp_server/skill-advisor/lib/freshness/` — generation-tagged freshness snapshots, trust-state enum (`live`/`stale`/`absent`/`unavailable`), post-commit publication API.
- Workspace-scoped single-writer lease (file lock + process PID fingerprint + heartbeat). Readers stay concurrent.
- Hash-aware SQLite scan wiring — reuse existing TS content-hash indexer; targeted invalidation for changed rows, full re-index reserved for recovery/schema.
- Post-commit ordering — generation bump + cache invalidation published ONLY after SQLite `COMMIT` succeeds.
- Failure-mode contract — `SQLITE_BUSY` backoff + scan requeue, `ENOENT` during editor atomic-rename tolerated, corrupted SQLite triggers rebuild-from-source, descriptor-pressure detection for broad-watch opt-in.
- **Track H inline hardening (deferred Track I excluded):**
  - **H1 Reindex-storm back-pressure:** rate-limit + exponential backoff + circuit breaker if > N reindex events in < T ms (e.g. > 20 in 10s). After circuit opens, coalesce events + resume on cooldown.
  - **H2 Malformed SKILL.md handling:** quarantine (log + skip + mark skill `unavailable`), not hard-fail. Daemon continues serving other skills.
  - **H4 Partial-write resilience:** tolerate mid-save editor crash (atomic rename detection, temp-file filter, retry on next stable-write event).
  - **H5 Operator alerting:** health metric exposes daemon state (`live`/`degraded`/`quarantined`/`unavailable`) via `advisor_status` for scraping + playbook alerting hook in 005.
- **A7 sanitizer boundary:** if the daemon itself ever emits advisor-visible metadata (e.g. via `advisor_status` brief), it must pass through the `mcp_server/skill-advisor/lib/sanitizer.ts` module (owned by 027/002). The daemon does NOT store its own metadata strings to SQLite — all storage goes through 027/002 pipelines which are already sanitized. This item is a defensive note: daemon diagnostics must not leak raw paths/names to the envelope.
- Watcher benchmark harness as release gate — measures CPU idle %, RSS, FD count, debounce behavior on current + 2x + 5x skill set. Acceptance: ≤1% idle CPU, <20MB RSS, debounce 2s + 1s stable-write (provisional pending E4 burst benchmark).
- Graceful shutdown + restart semantics (daemon crash → runtime hook marks advisor `unavailable`, fails open).

### Out of Scope
- Derived keyword extraction / schema-v2 `derived` block (027/002).
- Advisor scoring / fusion / Python→TS port (027/003).
- MCP tool surface (`advisor_recommend` etc. → 027/004).
- Plugin bridge rewiring (027/005).
- Shadow-cycle promotion machinery (027/006).
- Broad-scope watching as default (only enabled after benchmark passes with specific skill-set size).

## 4. REQUIREMENTS

### 4.1 P0 (Blocker)
1. Chokidar watcher substrate installed + keyed on workspace root + narrow default scope.
2. Single-writer lease prevents concurrent daemon writes on same workspace (verified under simulated multi-session start).
3. Post-commit publication order: generation bump visible to readers ONLY after SQLite commit.
4. Fail-open semantics: reader surfaces `stale`/`unavailable` trust state; runtime hook never blocks prompt on daemon error.
5. Watcher benchmark harness exists + runs clean on current skill set (baseline capture).

### 4.2 P1 (Required)
1. Hash-aware targeted re-index on SKILL.md / graph-metadata.json change.
2. `SQLITE_BUSY` backoff + queued rescan (bounded retry count).
3. `ENOENT` during atomic rename tolerated without reindex failure.
4. Corrupted SQLite triggers rebuild-from-source path + `unavailable` trust state.
5. Watcher benchmark meets acceptance: ≤1% idle CPU, <20MB RSS at current skill set.
6. Graceful shutdown publishes `unavailable` state before daemon exit.

### 4.3 P2 (Suggestion)
1. Descriptor-pressure detection + warning when approaching broad-watch ceiling.
2. Telemetry hook: daemon heartbeat + scan duration metrics.
3. Debounce calibration placeholder for E4 follow-up.

## 5. ACCEPTANCE SCENARIOS

1. **AC-1** Start daemon; edit a SKILL.md; within ≤10s the affected skill's `graph-metadata.json` row is invalidated + re-indexed + generation bumped.
2. **AC-2** Start two daemons in same workspace; second acquires no lease, exits cleanly with clear log message.
3. **AC-3** Trigger `SQLITE_BUSY` via concurrent reader; daemon retries with backoff, eventually commits, no corruption.
4. **AC-4** Kill daemon mid-write; restart; daemon detects stale lease, takes over, publishes `unavailable` during takeover then returns to `live`.
5. **AC-5** Watcher benchmark on current skill set produces CPU ≤1%, RSS <20MB report.
6. **AC-6** Runtime hook fails open when daemon absent; advisor returns `unavailable` trust state + `brief: null`.
7. **AC-7** Atomic editor-rename (Vim swap, VS Code save) produces exactly one re-index event per final filename (no duplicates, no ENOENT propagation).
8. **AC-8** Rebuild-from-source: simulate corrupted SQLite; daemon detects + rebuilds from on-disk SKILL.md + graph-metadata.json sources.

## 6. FILES TO CHANGE

### New (under `mcp_server/skill-advisor/`)
- `lib/daemon/watcher.ts` — Chokidar substrate
- `lib/daemon/lease.ts` — workspace-scoped single-writer lease
- `lib/daemon/lifecycle.ts` — start/shutdown orchestration
- `lib/freshness/generation.ts` — generation tag + post-commit publication
- `lib/freshness/trust-state.ts` — live/stale/absent/unavailable enum + transitions
- `lib/freshness/rebuild-from-source.ts` — corruption recovery
- `bench/watcher-benchmark.ts` — release-gate benchmark harness
- `tests/daemon/watcher.vitest.ts`
- `tests/daemon/lease.vitest.ts`
- `tests/freshness/generation.vitest.ts`
- `tests/freshness/trust-state.vitest.ts`

### Modified
- `lib/code-graph/freshness.ts` — pattern reference only (read, don't edit)
- `mcp_server/package.json` — chokidar dependency (if not already present)
- `mcp_server/tsconfig.json` — if new path aliases needed
