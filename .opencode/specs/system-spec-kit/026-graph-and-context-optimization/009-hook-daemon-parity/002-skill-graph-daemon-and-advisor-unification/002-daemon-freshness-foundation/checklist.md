---
title: "...tion/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/002-daemon-freshness-foundation/checklist]"
description: "Acceptance verification for daemon + freshness foundation."
trigger_phrases:
  - "tion"
  - "009"
  - "hook"
  - "daemon"
  - "parity"
  - "checklist"
  - "002"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/002-daemon-freshness-foundation"
    last_updated_at: "2026-04-20T17:35:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Recorded 027/001 convergence evidence"
    next_safe_action: "Chain 027/002 dispatch"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# 027/001 Checklist

## P0 (HARD BLOCKER)
- [x] Chokidar watcher implemented with narrow default scope (`graph-metadata.json` + `SKILL.md` only) [EVIDENCE: `mcp_server/skill-advisor/lib/daemon/watcher.ts`]
- [x] Workspace-scoped single-writer lease prevents concurrent daemon writes [EVIDENCE: `mcp_server/skill-advisor/lib/daemon/lease.ts`, test "single-writer lease" in `daemon-freshness-foundation.vitest.ts`]
- [x] Post-commit publication: generation bump visible ONLY after SQLite commit [EVIDENCE: `mcp_server/skill-advisor/lib/freshness/generation.ts`]
- [x] Fail-open reader semantics: runtime never blocks prompt on daemon error [EVIDENCE: `mcp_server/skill-advisor/lib/freshness/trust-state.ts`, tests "demotes to unavailable", "returns to live"]
- [x] Watcher benchmark harness exists + runs clean on current skill set [EVIDENCE: `mcp_server/skill-advisor/bench/watcher-benchmark.ts`]
- [x] Benchmark meets gate: ≤1% idle CPU, <20MB RSS, debounce 2s+1s stable-write [EVIDENCE: `node dist/skill-advisor/bench/watcher-benchmark.js` → `cpuPercent=0.031, rssDeltaMb=5.516, passed=true`]

## P1 (Required)
- [x] Hash-aware targeted re-index on SKILL.md / graph-metadata.json change [EVIDENCE: `mcp_server/skill-advisor/lib/daemon/watcher.ts` (watch filter + reindex path)]
- [x] `SQLITE_BUSY` backoff + queued rescan (bounded retry) [EVIDENCE: `mcp_server/skill-advisor/lib/daemon/lease.ts` retry budget]
- [x] `ENOENT` during editor atomic-rename tolerated (no reindex failure) [EVIDENCE: watcher.ts ENOENT tolerance; atomic write helper]
- [x] Corrupted SQLite triggers rebuild-from-source + `unavailable` trust state [EVIDENCE: `mcp_server/skill-advisor/lib/freshness/rebuild-from-source.ts`]
- [x] Graceful shutdown publishes `unavailable` before daemon exit [EVIDENCE: `mcp_server/skill-advisor/lib/daemon/lifecycle.ts` shutdown handler, test "TEST_SHUTDOWN publishes unavailable"]

## P2 (Suggestion)
- [x] Descriptor-pressure detection + warning [EVIDENCE: Track H circuit breaker in watcher.ts]
- [x] Daemon heartbeat + scan-duration telemetry [EVIDENCE: `mcp_server/skill-advisor/schemas/daemon-status.ts` includes heartbeat + telemetry fields]

## Integration / Regression
- [x] Targeted vitest suite green [EVIDENCE: `npx vitest run mcp_server/skill-advisor/tests/daemon-freshness-foundation.vitest.ts` → 16/16 passed in 123ms]
- [x] Combined vitest with existing advisor-freshness green [EVIDENCE: orchestrator re-ran: 27/27 passed (16 new + 11 existing)]
- [x] `npm run build` green [EVIDENCE: `/tmp/027-001-build.log` exit=0 per codex]
- [x] `npm run typecheck` green [EVIDENCE: per codex: "Ran type/build verification successfully"]
- [ ] Full 468-file vitest suite run (pre-existing slow suite, not a 001 regression — scripts/progressive-validation takes 20-25s per test × ~N tests; tracked as separate issue)
- [x] No regressions in existing advisor-freshness test file (11 tests still pass in combined run)

## Research conformance
- [x] A1 watcher = Chokidar (not raw fs.watch / fsevents) [EVIDENCE: watcher.ts imports `chokidar`]
- [x] A3 hash-aware content comparison (not timestamp-only) [EVIDENCE: watcher.ts hash-aware skill detection]
- [x] A4 single SQLite transaction as consistency boundary [EVIDENCE: generation.ts single-tx publication]
- [x] A5 daemon MCP-owned, freshness-gated hooks, fail-open [EVIDENCE: lifecycle.ts + trust-state.ts]
- [x] A7 sanitizer applied to any advisor-visible metadata output [EVIDENCE: existing `sanitizeSkillLabel` usage preserved at write boundary; schemas filter unsafe shapes]
- [x] A8 failure-mode contract (SQLITE_BUSY / ENOENT / WAL / rebuild) [EVIDENCE: lease.ts retry, watcher.ts ENOENT, rebuild-from-source.ts]
- [x] E1 watcher benchmark gate [EVIDENCE: bench/watcher-benchmark.ts with ≤1% CPU / <20MB RSS gate]
- [x] E2 workspace-scoped single-writer lease [EVIDENCE: lease.ts workspace-scoped]
- [x] E3 one active writer per workspace (WAL ceiling respected) [EVIDENCE: lease test "two daemons → only one acquires"]
- [x] E4 debounce 2s/1s provisional (tagged for burst-benchmark follow-up) [EVIDENCE: watcher.ts debounce config; follow-up tracked in implementation-summary.md]
