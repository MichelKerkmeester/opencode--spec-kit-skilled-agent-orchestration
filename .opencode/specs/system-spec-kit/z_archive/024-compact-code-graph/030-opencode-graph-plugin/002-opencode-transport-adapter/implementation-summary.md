---
title: "...stem-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/002-opencode-transport-adapter/implementation-summary]"
description: "Phase 2 delivered a real OpenCode plugin hook layer backed by the shared transport contract and wired it into session resume/bootstrap outputs without introducing a second retrieval backend."
trigger_phrases:
  - "phase 2 implementation summary"
  - "opencode transport adapter implementation"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/002-opencode-transport-adapter"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["implementation-summary.md"]
---
# Implementation Summary: OpenCode Transport Adapter

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-opencode-transport-adapter |
| **Completed** | 2026-04-03 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 2 is now implemented in runtime code. Packet 030 has a dedicated OpenCode transport contract in `.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts`, a live plugin at `.opencode/plugins/spec-kit-compact-code-graph.js`, and an `opencode.json` registration entry that enables the plugin with `[["spec-kit-compact-code-graph", { "cacheTtlMs": 5000 }]]`.

### Transport Boundary

The new plugin layer stays transport-only in responsibility even though it is now live. It accepts already-shaped shared payload envelopes and turns them into:

- `event` tracking metadata
- `experimental.chat.system.transform` startup digest content
- `experimental.chat.messages.transform` bounded current-turn context blocks
- `experimental.session.compacting` continuity-note content

The plugin also exposes a diagnostic tool named `spec_kit_compact_code_graph_status`.

### Runtime Wiring

`session_resume` now emits an `opencodeTransport` contract derived from the resume payload contract. `session_bootstrap` now emits a richer `opencodeTransport` contract that composes bootstrap, resume, and health payload contracts together for startup and current-turn use. The live plugin consumes that contract and registers the real OpenCode hooks instead of stopping at contract-only transport output.

The transport layer was later refined so the OpenCode `systemTransform` startup digest also appends the explicit startup-snapshot note that already existed in the shared startup banner path. After that source change, the packet also required a real MCP-server rebuild so the compiled `dist/lib/context/opencode-transport.js` artifact matched the updated TypeScript source and the note actually appeared in live OpenCode sessions.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts` | Created | Shared transport contract that maps payloads into OpenCode lifecycle blocks |
| `.opencode/skill/system-spec-kit/mcp_server/dist/lib/context/opencode-transport.js` | Rebuilt | Refresh compiled transport output so the live OpenCode runtime carries the startup-snapshot note |
| `.opencode/plugins/spec-kit-compact-code-graph.js` | Created | Real `@opencode-ai/plugin` hook layer for event, system transform, messages transform, compacting, and diagnostics |
| `opencode.json` | Modified | Register the plugin with `cacheTtlMs` configuration |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` | Modified | Emit transport contract data for resume surfaces |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | Modified | Emit transport contract data for bootstrap surfaces |
| `.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts` | Created | Verify transport contract behavior |
| `.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts` | Created | Verify the live plugin hook behavior and diagnostics |
| `.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts` | Modified | Verify resume output includes transport contract data |
| `.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts` | Modified | Verify bootstrap output includes startup-digest transport data |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation stayed inside the Phase 2 boundary. Payload construction still belongs to Phase 1 contracts, while graph durability and integrity logic stay in Phase 3. This phase only shapes bounded delivery plans for OpenCode lifecycle hooks and wires those plans into the session-facing handler outputs.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One transport contract feeds all four hook blocks | This keeps OpenCode transport logic in one place while still separating startup, message, and compaction content |
| The plugin is live but still does not own retrieval policy | Packet 030 needed real hook registration without creating a second backend |
| `session_resume` and `session_bootstrap` are the primary transport surfaces | They already aggregate the right packet-024 context without requiring a new runtime backend |
| The OpenCode startup digest must carry the same snapshot framing as the shared startup banner | The final live retest showed freshness-aware status alone was not enough unless OpenCode also explained that later structural reads may differ |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build` | PASS |
| `npm run typecheck` | PASS |
| `npx vitest run tests/opencode-transport.vitest.ts tests/code-graph-ops-hardening.vitest.ts tests/session-resume.vitest.ts tests/session-bootstrap.vitest.ts tests/opencode-plugin.vitest.ts` | PASS |
| `cd .opencode/skill/system-spec-kit/mcp_server && TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp npx vitest run tests/opencode-transport.vitest.ts tests/startup-brief.vitest.ts tests/hook-session-start.vitest.ts` | PASS |
| `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --build --verbose` | PASS - rebuilt stale `dist/` transport output so live OpenCode picked up the snapshot-note fix |
| `node --check .opencode/plugins/spec-kit-compact-code-graph.js` | PASS |
| `jq empty opencode.json` | PASS |
| Fresh OpenCode session retest of the startup digest after rebuild | PASS - digest now includes `Note: this is a startup snapshot; later structural reads may differ if the repo state changed.` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Shared payload dependency** The plugin and transport contract assume Phase 1 payload envelopes are already present and valid.
2. **Memory durability stays outside this phase** The Phase 2 plugin is live, but long-term memory/archive durability remains explicitly outside packet 030.
3. **OpenCode transport changes require rebuilt `dist/` artifacts** Source-only edits inside `lib/context/` are not enough for live runtime parity until the MCP server is rebuilt.
<!-- /ANCHOR:limitations -->
