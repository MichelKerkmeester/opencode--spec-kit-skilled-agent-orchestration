---
title: "...t/024-compact-code-graph/030-opencode-graph-plugin/004-cross-runtime-startup-surfacing-parity/implementation-summary]"
description: "Phase 004 implemented the shared startup-status surface across the repo-managed CLI runtimes without reopening phases 001-003."
trigger_phrases:
  - "phase 4 implementation summary"
  - "startup surfacing parity summary"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/004-cross-runtime-startup-surfacing-parity"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["implementation-summary.md"]
---
# Implementation Summary: Cross-Runtime Startup Surfacing Parity

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-cross-runtime-startup-surfacing-parity |
| **Completed** | 2026-04-03 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 004 moved from planning into implementation. The runtime now builds one shared startup-status block and reuses it across the hook-capable CLIs, while Codex adopts the same startup shape through its `context-prime` bootstrap output.

The startup surfaces were later refined to become freshness-aware instead of count-only. Startup digest/status lines now use the shared non-mutating graph freshness checker, so they can report `stale` when the first structural read would immediately detect stale graph state.

### Runtime Deliverables

- `startup-brief.ts` now emits a shared `startupSurface` string alongside the existing structural startup brief data.
- `startup-brief.ts` now derives startup graph state from the same freshness checker used by structural read paths, so startup summaries can say `stale` instead of overstating `healthy`.
- The shared startup banner now explicitly says it is a startup snapshot, so later structural reads can disagree without looking like a contradiction.
- OpenCode system-transform startup digests now carry that same startup-snapshot note instead of leaving the framing only in hook-capable runtime banners.
- The final OpenCode rebuild-and-retest pass confirmed the transport-layer digest now carries the snapshot note in the live runtime, not just in source or tests.
- Claude and Gemini SessionStart hooks now lead with the same `Session context received. Current state:` block before the deeper recovery and structural sections.
- Copilot now has a repo-local session-start banner hook at `mcp_server/hooks/copilot/session-prime.ts`.
- Codex `context-prime.toml` now defines the same startup surface shape for its first-turn bootstrap output.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts` | Modified | Define the shared startup-status surface |
| `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts` | Modified | Align structural startup/resume freshness with the shared readiness engine |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` | Modified | Emit freshness-aware graph status in the OpenCode startup digest source |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` | Modified | Lead Claude startup injection with the shared startup surface |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts` | Modified | Lead Gemini startup injection with the shared startup surface |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts` | Created | Add the Copilot session-start banner hook |
| `.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts` | Modified | Verify the shared startup-status output |
| `.codex/agents/context-prime.toml` | Modified | Align Codex bootstrap output with the same startup surface |
| `.github/hooks/superset-notify.json` | Modified in Phase 031 | Repo-local Copilot hook config now routes `sessionStart` through the tracked startup wrapper |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation kept the original packet-030 boundary intact:

1. Reuse the existing startup brief as the single source of truth.
2. Render one shared startup-status surface instead of duplicating per-runtime strings.
3. Reuse existing Claude and Gemini SessionStart entry points.
4. Add a small Copilot session-start hook instead of inventing a second runtime stack.
5. Keep Codex hookless and align its first-turn bootstrap output through `context-prime`.
6. Replace the old scan-age/count-only startup heuristic with the shared freshness engine so startup status stays honest when the graph is stale.
7. Rebuild the MCP server after the OpenCode transport note change so the compiled `dist/` runtime stops lagging the TypeScript source.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep startup parity centered on `startup-brief.ts` | One formatter keeps runtime wording and status lines aligned |
| Treat Codex as hookless in this phase | The repo already uses `context-prime` as the Codex bootstrap surface |
| Add Copilot as a banner hook, not a second retrieval path | The goal was startup surfacing parity, not a new memory backend |
| Preserve phases 001-003 as closed prerequisites | Startup parity extends packet 030 without rewriting the earlier runtime delivery |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit` | PASS |
| `cd .opencode/skill/system-spec-kit/mcp_server && npm run build` | PASS |
| `cd .opencode/skill/system-spec-kit/mcp_server && TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp npx vitest run tests/session-resume.vitest.ts tests/startup-brief.vitest.ts tests/structural-contract.vitest.ts tests/hook-session-start.vitest.ts` | PASS |
| `python3.11` TOML parse of `.codex/agents/context-prime.toml` | PASS |
| `jq empty .github/hooks/superset-notify.json` | PASS |
| `printf '{\"sessionId\":\"demo\"}\\n' \| node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/session-prime.js` | PASS - emitted the shared startup banner |
| `printf '{\"session_id\":\"demo\",\"source\":\"startup\"}\\n' \| node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-prime.js` | PASS - emitted the shared startup block plus recovery/structural sections |
| `printf '{\"session_id\":\"demo\",\"source\":\"startup\"}\\n' \| node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/gemini/session-prime.js` | PASS - emitted Gemini JSON with the shared startup block in `additionalContext` |
| `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --build --verbose` | PASS - rebuilt stale OpenCode transport output so the snapshot note reached the live runtime |
| Fresh OpenCode session retest of startup digest + `session_resume({ minimal: true })` + structural reads | PASS - startup digest, resume payload, and readiness contract all agreed and the digest included the explicit startup-snapshot note |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin --recursive --strict` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Phase 004 delivered the hook code; Phase 031 closes the repo wiring gap.** The Copilot banner hook lives in `mcp_server/hooks/copilot/session-prime.ts`, and packet 030 now also tracks the repo-local `.github/hooks/*.json` wrapper path that actually surfaces it in live Copilot sessions.
2. **Codex parity is bootstrap-based, not a native hook.** This phase aligns Codex startup messaging through `context-prime`, not through a new SessionStart runtime hook.
3. **Structural details remain runtime-specific after the shared banner.** Claude and Gemini still carry their own hook output envelopes after the common startup block, which is intentional.
4. **Freshness-aware startup status is still non-mutating.** Startup surfaces now reflect stale graph state more honestly, but they still do not auto-index; the first structural read or explicit `code_graph_scan` remains the repair path.
5. **OpenCode startup parity depends on rebuilt transport artifacts.** The startup snapshot note now lands in live OpenCode, but only after the MCP server `dist/` output is rebuilt when the transport formatter changes.
<!-- /ANCHOR:limitations -->
