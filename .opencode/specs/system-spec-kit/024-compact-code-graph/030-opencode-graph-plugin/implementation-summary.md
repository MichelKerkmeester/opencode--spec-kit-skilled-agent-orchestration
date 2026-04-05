---
title: "Implementation Summary: OpenCode Graph Plugin Phased Execution [030/024]"
description: "Packet 030 now includes six completed phases: shared payloads, OpenCode transport, graph hardening, startup parity, bounded auto-reindex parity, and Copilot startup-hook wiring repair."
trigger_phrases:
  - "packet 030 implementation summary"
  - "opencode graph plugin closeout"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Summary: OpenCode Graph Plugin Phased Execution

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 030-opencode-graph-plugin |
| **Completed** | 2026-04-03 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Packet 030 completed its original three-phase runtime delivery, then closed the startup-parity follow-on in Phase 004, the bounded code graph auto-reindex parity pass in Phase 005, and now closes Phase 031 as the Copilot repo-local startup-hook wiring repair. All six phases are now implemented and packet-local.

### Phase 1

Shared payload and provenance contracts now exist across startup, resume, health, bootstrap, and compaction surfaces.

### Phase 2

OpenCode transport now exists as a real OpenCode plugin hook layer. Packet 030 ships `.opencode/plugins/spec-kit-compact-code-graph.js` as a live `@opencode-ai/plugin` integration that uses `event`, `experimental.chat.system.transform`, `experimental.chat.messages.transform`, and `experimental.session.compacting`, while still sourcing its payloads from the packet-024 shared contract and runtime handlers.

### Phase 3

Graph operations hardening now exists as a reusable runtime contract that standardizes readiness, doctor guidance, portability boundaries, and metadata-only previews.

### Phase 4

Cross-runtime startup surfacing parity now exists across the other repo-managed CLI surfaces:
- Claude and Gemini SessionStart hooks now start with the shared `Session context received. Current state:` block.
- Copilot now has a repo-local session-start banner hook.
- Codex `context-prime` now uses the same startup surface shape for its first-turn bootstrap output.
- Startup status is now freshness-aware instead of count-only, so OpenCode resume digests and the shared startup banner can say `stale` when the first structural read would immediately detect stale graph state.
- OpenCode startup digests now also append the explicit startup-snapshot note in the live runtime, so the first-turn banner clearly explains that later structural reads may differ if the repo state changed.

### Phase 5

Code graph structural reads now behave more like CocoIndex on first use:
- small stale sets refresh inline automatically
- small post-commit HEAD drift can still self-heal inline when the tracked stale set remains small
- large stale/full-scan states stay bounded and report readiness instead of forcing inline rescans
- `code_graph_query` and `code_graph_context` now both return readiness metadata

### Phase 031

Copilot startup parity is now wired through the tracked repo hook config instead of stopping at hook code alone:
- `.github/hooks/superset-notify.json` now routes `sessionStart` through a repo-local wrapper that emits the shared startup banner
- best-effort Superset notifications still fan out through a repo-local wrapper instead of hardcoded hook commands in the JSON
- `runtime-detection.ts` now reports `copilot-cli` as hook-enabled when a repo `.github/hooks/*.json` file exposes `sessionStart`, and falls back to `disabled_by_scope` when that wiring is absent
- Copilot-specific tests now prove both the hook wiring and the dynamic detection split

### Packet Synchronization

The parent packet and all six child phases now have synchronized packet-local documentation. The parent checklist is evidence-backed, all six phases are complete, and memory archive durability still stays out of scope exactly as the research required.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work followed the locked research order from packet 030:

1. Shared payload/provenance first.
2. OpenCode transport adapter second.
3. Graph operations hardening third.
4. Parent packet closeout last.
5. Add phase 004 as the runtime/config parity pass for the other CLI startup surfaces.
6. Add phase 005 as the bounded code graph auto-reindex parity pass for structural read paths.
7. Rebuild the MCP server after the final OpenCode transport note change so the compiled runtime matched the packet documentation and live-session retests.
8. Repair the Copilot repo-level `sessionStart` wiring so the startup banner actually reaches live Copilot sessions instead of being swallowed by the Superset notifier path.

That sequencing kept transport logic thin, kept graph operations beneath the transport shell, and prevented the packet from drifting into a second memory backend.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep OpenCode transport as a hook layer, not a backend | Research showed the real value is delivery timing, not replacing packet-024 retrieval/storage |
| Ship the adapter as a real `@opencode-ai/plugin` layer | Packet 030 needed to match the external reference pattern instead of stopping at contract-only transport data |
| Emit graph hardening as a reusable contract | This improves session surfaces immediately without forcing a new operational tool surface inside packet 030 |
| Implement startup parity as phase 004 instead of retroactively expanding phases 001-003 | The repo now extends packet 030 cleanly without rewriting the evidence for the original runtime phases |
| Implement auto-reindex parity as phase 005 instead of reopening Phase 3 | The freshness UX gap was new follow-on work and needed its own bounded verification trail |
| Keep memory archive durability out of packet 030 | Research consistently placed that work in a separate follow-on track |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build` in `.opencode/skill/system-spec-kit/mcp_server` | PASS |
| `npm run typecheck` in `.opencode/skill/system-spec-kit/mcp_server` | PASS |
| `npx vitest run tests/opencode-transport.vitest.ts tests/code-graph-ops-hardening.vitest.ts tests/session-resume.vitest.ts tests/session-bootstrap.vitest.ts tests/opencode-plugin.vitest.ts` | PASS |
| `TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp npx vitest run tests/session-resume.vitest.ts tests/startup-brief.vitest.ts tests/structural-contract.vitest.ts tests/hook-session-start.vitest.ts` | PASS |
| `TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp npx vitest run tests/ensure-ready.vitest.ts tests/code-graph-query-handler.vitest.ts tests/code-graph-context-handler.vitest.ts` | PASS |
| `TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp npx vitest run tests/runtime-detection.vitest.ts tests/cross-runtime-fallback.vitest.ts tests/copilot-hook-wiring.vitest.ts` | PASS |
| `TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp npx vitest run tests/opencode-transport.vitest.ts tests/startup-brief.vitest.ts tests/hook-session-start.vitest.ts` | PASS |
| `npx tsc --build --verbose` in `.opencode/skill/system-spec-kit/mcp_server` | PASS - rebuilt stale OpenCode transport output so the snapshot note reached live startup digests |
| `node --check .opencode/plugins/spec-kit-compact-code-graph.js` | PASS |
| `jq empty opencode.json` | PASS |
| `python3.11` TOML parse of `.codex/agents/context-prime.toml` | PASS |
| `jq empty .github/hooks/superset-notify.json` | PASS |
| `./.github/hooks/scripts/session-start.sh` smoke run | PASS - emitted the shared startup banner plus the startup-snapshot note |
| Dist-hook smoke runs for Copilot, Claude, and Gemini startup surfaces | PASS |
| Fresh OpenCode live retest of startup digest, `session_resume({ minimal: true })`, and structural readiness | PASS - startup digest includes the startup-snapshot note and matches the freshness-aware runtime surfaces |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin --recursive --strict` | PASS after Phase 5 runtime and doc truth-sync |
| `jq empty` on all packet `description.json` files | PASS |
| Parallel review lane | Surfaced the final parent-doc mismatch and that mismatch was corrected before closeout |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Copilot parity is repo-local, not cross-repo global.** This workspace now tracks a repo-local `.github/hooks/*.json` sessionStart registration and wrapper scripts, but other repositories still need their own Copilot hook wiring if they want the same banner behavior.
2. **Codex parity is bootstrap-based.** Codex now matches the startup surface through `context-prime`, not through a native SessionStart hook.
3. **Inline full scans remain intentionally manual.** Phase 5 improves first-use freshness for small stale deltas, including safe post-commit drift, but large branch-change or empty-graph cases still rely on explicit `code_graph_scan`.
4. **Memory durability remains out of packet 030.** The packet now includes a live OpenCode plugin hook layer, cross-runtime startup surfacing, and bounded code graph auto-refresh, but long-term archive durability, import/export depth, and broader memory storage upgrades still belong to a separate follow-on track outside packet 030.
5. **OpenCode startup parity still depends on build hygiene.** The packet now truthfully documents the startup-snapshot note in live OpenCode, but transport-layer formatter changes still require rebuilding the MCP server `dist/` output before runtime behavior matches source.
<!-- /ANCHOR:limitations -->
