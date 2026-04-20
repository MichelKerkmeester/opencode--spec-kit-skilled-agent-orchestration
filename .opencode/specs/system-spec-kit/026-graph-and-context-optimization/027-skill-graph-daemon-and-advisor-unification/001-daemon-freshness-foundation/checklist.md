---
title: "027/001 — Checklist"
description: "Acceptance verification for daemon + freshness foundation."
importance_tier: "high"
contextType: "implementation"
---
# 027/001 Checklist

## P0 (HARD BLOCKER)
- [ ] Chokidar watcher implemented with narrow default scope (`graph-metadata.json` + `SKILL.md` only)
- [ ] Workspace-scoped single-writer lease prevents concurrent daemon writes
- [ ] Post-commit publication: generation bump visible ONLY after SQLite commit
- [ ] Fail-open reader semantics: runtime never blocks prompt on daemon error
- [ ] Watcher benchmark harness exists + runs clean on current skill set
- [ ] Benchmark meets gate: **≤1% idle CPU, <20MB RSS, debounce 2s+1s stable-write**

## P1 (Required)
- [ ] Hash-aware targeted re-index on SKILL.md / graph-metadata.json change
- [ ] `SQLITE_BUSY` backoff + queued rescan (bounded retry)
- [ ] `ENOENT` during editor atomic-rename tolerated (no reindex failure)
- [ ] Corrupted SQLite triggers rebuild-from-source + `unavailable` trust state
- [ ] Graceful shutdown publishes `unavailable` before daemon exit

## P2 (Suggestion)
- [ ] Descriptor-pressure detection + warning
- [ ] Daemon heartbeat + scan-duration telemetry

## Integration / Regression
- [ ] `npx vitest run mcp_server/skill-advisor/tests/daemon/** mcp_server/skill-advisor/tests/freshness/**` — all pass
- [ ] `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build` — OK
- [ ] No regressions in existing advisor suite (Phase 025 baseline 65 tests)
- [ ] No regressions in existing code-graph freshness patterns
- [ ] 200-prompt corpus parity maintained (if advisor hook runs in parallel)

## Research conformance
- [ ] A1 watcher = Chokidar (not raw fs.watch / fsevents)
- [ ] A3 hash-aware content comparison (not timestamp-only)
- [ ] A4 single SQLite transaction as consistency boundary
- [ ] A5 daemon MCP-owned, freshness-gated hooks, fail-open
- [ ] A7 sanitizer applied to any advisor-visible metadata output
- [ ] A8 failure-mode contract (SQLITE_BUSY / ENOENT / WAL / rebuild)
- [ ] E1 watcher benchmark gate
- [ ] E2 workspace-scoped single-writer lease
- [ ] E3 one active writer per workspace (WAL ceiling respected)
- [ ] E4 debounce 2s/1s provisional (tagged for burst-benchmark follow-up)
