---
title: "027/001 — Tasks"
description: "Task breakdown for daemon + freshness foundation."
importance_tier: "high"
contextType: "implementation"
---
# 027/001 Tasks

## T001 — Scaffold packet
- [x] Packet files written (spec/plan/tasks/checklist/impl-summary/description.json/graph-metadata.json)

## T002 — Read research + pattern reference
- [ ] Read `research.md` §4 Track A + §13.2 Track E + Y1 coherence
- [ ] Read `lib/code-graph/freshness.ts` for generation-tag pattern
- [ ] Read iteration files 001-008, 041-044, 056

## T003 — Chokidar watcher (P0)
- [ ] Add chokidar dep to mcp_server/package.json (if missing)
- [ ] Implement `lib/daemon/watcher.ts` — narrow scope + workspace keying
- [ ] Debounce 2s + 1s stable-write
- [ ] Unit tests: editor atomic-rename + ENOENT + debounce

## T004 — Lease + lifecycle (P0)
- [ ] Implement `lib/daemon/lease.ts` — file lock + PID fingerprint + heartbeat
- [ ] Implement `lib/daemon/lifecycle.ts` — start/graceful-shutdown
- [ ] Unit tests: multi-daemon contention + stale-lease takeover

## T005 — Freshness module (P0)
- [ ] Implement `lib/freshness/trust-state.ts` — enum + transitions
- [ ] Implement `lib/freshness/generation.ts` — post-commit publication
- [ ] Implement `lib/freshness/rebuild-from-source.ts` — corruption recovery
- [ ] Unit tests: post-commit ordering + corruption recovery

## T006 — Hash-aware scan wiring (P0)
- [ ] Wire watcher → existing content-hash SQLite indexer
- [ ] Integration test: SKILL.md edit → targeted invalidate → generation bump < 10s

## T007 — Failure-mode contract (P1)
- [ ] `SQLITE_BUSY` backoff + bounded retry
- [ ] Descriptor pressure detector + warning
- [ ] Integration tests

## T008 — Benchmark harness (P0)
- [ ] Implement `bench/watcher-benchmark.ts`
- [ ] Baseline capture on current skill set
- [ ] Assert ≤1% idle CPU, <20MB RSS, debounce 2s+1s

## T009 — Verify
- [ ] Focused vitest suite green
- [ ] Benchmark passes
- [ ] TS build clean
- [ ] Mark checklist.md [x] with evidence
- [ ] Update parent 027 implementation-summary.md Children Convergence Log

## T010 — Commit + push
- [ ] Single commit with all changes
- [ ] Push to origin/main
