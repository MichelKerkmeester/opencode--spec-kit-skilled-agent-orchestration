---
title: "027/001 — Plan"
description: "Phased implementation plan for the daemon + freshness foundation child."
importance_tier: "high"
contextType: "implementation"
---
# Plan: 027/001

## Phases

1. **Contract** — read `research.md` §4 Track A (iters 001-008) + §13.2 Track E (iters 041-044) + `iteration-056.md` (Y1 coherence). Confirm SQLite transaction-boundary + lease semantics against `lib/code-graph/freshness.ts` pattern reference. No code yet.
2. **Watcher substrate** — implement `lib/daemon/watcher.ts` (Chokidar, narrow scope, workspace-keyed). Unit tests covering editor atomic-rename + ENOENT tolerance + debounce.
3. **Lease + lifecycle** — implement `lib/daemon/lease.ts` (file lock + PID fingerprint + heartbeat) and `lib/daemon/lifecycle.ts` (start/graceful-shutdown). Unit tests covering multi-daemon contention + stale-lease takeover.
4. **Freshness module** — implement `lib/freshness/generation.ts`, `trust-state.ts`, `rebuild-from-source.ts`. Unit tests covering post-commit ordering + corruption recovery.
5. **Hash-aware scan wiring** — wire daemon watcher into the existing TS content-hash SQLite indexer. Integration test covering SKILL.md edit → targeted row invalidate → generation bump.
6. **Failure-mode contract** — implement `SQLITE_BUSY` backoff + requeue, descriptor pressure detector. Integration tests.
7. **Benchmark harness** — `bench/watcher-benchmark.ts`. Baseline capture on current skill set. Assert ≤1% idle CPU, <20MB RSS, debounce 2s+1s.
8. **Verify** — full focused suite passes; benchmark passes; parent `implementation-summary.md` Children Convergence Log row updated.

## Dispatch

Single `/spec_kit:implement :auto` on `../` with explicit `:spec-folder=.../027/002-daemon-freshness-foundation/`. Executor: cli-codex gpt-5.4 high fast, foreground.

## Verification

- Unit suite: `npx vitest run mcp_server/skill-advisor/tests/daemon/** mcp_server/skill-advisor/tests/freshness/**`
- Integration: SKILL.md edit → reindex under 10s
- Benchmark: `npx tsx mcp_server/skill-advisor/bench/watcher-benchmark.ts` reports pass
- TS build: `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`

## Risk mitigations from research §10

- **R1** narrow default scope + debounce + stable-write tolerance
- **R2** one SQLite transaction + commit-before-publish + scan lease
- **R8** reader-side fail-open + disable flag preserved
