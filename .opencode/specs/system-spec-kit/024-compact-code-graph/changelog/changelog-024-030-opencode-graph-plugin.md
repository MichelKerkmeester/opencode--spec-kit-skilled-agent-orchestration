# Changelog: 024/030-opencode-graph-plugin

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 030-opencode-graph-plugin — 2026-04-04

Packet 030 turned the late packet-024 startup and structural-recovery work into a real runtime extension instead of leaving it as research and follow-up notes. The result is a transport-oriented OpenCode plugin surface, a shared payload/provenance contract, a graph-operations hardening layer, freshness-aware startup parity across the repo-managed CLIs, bounded inline selective reindex on structural read paths, and the final repo-local Copilot startup-hook wiring fix.

> Spec folder: `.opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/`

---

## New Features (4)

### Shared startup, resume, and compaction payload contracts

**Problem:** Startup, resume, health, bootstrap, and compaction surfaces were all shaping their own payloads, which made transport reuse and provenance tracking fragile.

**Fix:** Phase 001 created a shared payload/provenance layer used across startup, recovery, health, bootstrap, and compaction. Later packet-030 phases consume that one contract instead of inventing parallel payload shapes.

### Real OpenCode transport layer

**Problem:** OpenCode-specific startup and compaction parity was still only a design target. There was no live transport/plugin layer consuming the shared recovery contract.

**Fix:** Phase 002 added a real OpenCode transport formatter plus a live plugin shell. OpenCode startup digests, current-turn context transforms, and compaction surfaces now consume the shared contract, and the transport digest carries the same explicit startup-snapshot note as the shared startup banner.

### Freshness-aware startup parity and bounded structural reads

**Problem:** Startup banners could still overstate graph health from counts alone, and structural reads needed parity with CocoIndex-style first-use freshness without allowing unbounded inline rescans.

**Fix:** Phases 004 and 005 made startup surfaces freshness-aware, aligned Claude/Gemini/Codex/OpenCode startup wording around the shared startup brief, and added bounded `selective_reindex` support to structural reads. Small stale sets can self-heal inline; empty or broad stale states still report `full_scan` readiness and stay on the explicit `code_graph_scan` path.

### Repo-local Copilot startup wiring

**Problem:** Copilot had working startup-hook code, but the tracked repo hook JSON still routed `sessionStart` through the Superset notifier path instead of the shared startup banner wrapper. That meant the code existed without a truthful repo-wired delivery path.

**Fix:** Phase 031 rewired the tracked `.github/hooks/*.json` path through repo-local wrappers, preserved best-effort Superset forwarding, and updated runtime detection so Copilot is only reported as hook-enabled when the repo actually exposes `sessionStart`.

---

## Architecture (2)

### Transport stays thin; graph logic stays below it

**Problem:** It would have been easy for OpenCode startup parity work to grow into a second backend or a second recovery model.

**Fix:** Packet 030 kept the transport shell thin. Retrieval logic, graph freshness detection, and readiness decisions still live in packet-024 handlers and helpers. Packet 030 only shapes and delivers those bounded surfaces into runtime-specific startup/bootstrap paths.

### Startup surfaces are honest but non-mutating

**Problem:** A startup digest that says `healthy` or `fresh` without explaining its snapshot nature can look wrong the moment the first structural read sees drift.

**Fix:** Packet 030 moved startup status to the same freshness-aware model used by structural reads and appended the explicit snapshot note: later structural reads may differ if the repo state changed. Repair still happens on structural reads or explicit scans, not silently inside startup banners.

---

## Verification (1)

### Runtime and packet closeout passed

**Problem:** Packet 030 touched shared payloads, runtime startup surfaces, transport formatters, readiness logic, and repo-local hook wiring. A changelog entry would be misleading without proof that those layers actually converged.

**Fix:** The packet closed with targeted TypeScript, Vitest, shell-smoke, and strict spec validation evidence across all six child phases. The final retests confirmed the OpenCode startup digest now carries the snapshot note, bounded structural reads return `readiness` metadata with selective inline repair, and the repo-local Copilot wrapper emits the shared startup banner when wired.

---

<details>
<summary>Representative Files Changed</summary>

| File | What changed |
|------|-------------|
| `mcp_server/lib/context/shared-payload.ts` | Shared payload/provenance envelope for startup, resume, health, bootstrap, and compaction |
| `mcp_server/lib/context/opencode-transport.ts` | OpenCode transport formatter for startup, message, and compaction surfaces |
| `.opencode/plugins/spec-kit-compact-code-graph.js` | Live OpenCode plugin layer |
| `mcp_server/lib/code-graph/ops-hardening.ts` | Reusable readiness/doctor/preview hardening contract |
| `mcp_server/lib/code-graph/startup-brief.ts` | Shared startup banner plus startup-snapshot framing |
| `mcp_server/lib/code-graph/ensure-ready.ts` | Bounded structural-read freshness and selective inline reindex behavior |
| `mcp_server/handlers/code-graph/query.ts` | Read-path readiness with `allowInlineFullScan: false` |
| `.github/hooks/superset-notify.json` | Repo-local Copilot `sessionStart` wiring through wrappers |
| `.github/hooks/scripts/session-start.sh` | Copilot startup banner wrapper |
| `.github/hooks/scripts/superset-notify.sh` | Best-effort JSON-safe Superset forwarding wrapper |

</details>

---

## Upgrade

No migration is required. Packet 030 is additive: it extends packet-024 startup, recovery, and graph-readiness surfaces without replacing the existing memory or graph backends.
