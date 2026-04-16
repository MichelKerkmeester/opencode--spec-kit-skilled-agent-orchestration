<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | level2-verify | compact -->
---
title: "Improve Graph Metadata Entity Quality - Checklist"
status: complete
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements"
    last_updated_at: "2026-04-13T14:24:00Z"
    last_updated_by: "codex"
    recent_action: "Marked entity-quality verification complete with parser, test, and corpus evidence"
    next_safe_action: "Reuse this checklist if entity cap or scope regressions return"
---
# Verification Checklist
## Protocol <!-- ANCHOR:protocol -->Treat leak closure, focused tests, and cap behavior as the blocking closure signals.<!-- /ANCHOR:protocol -->
## Pre-Impl <!-- ANCHOR:pre-impl -->- [x] Confirm the current entity leak count and cap behavior before changing `deriveEntities()`. Evidence: packet research baseline recorded `9` true cross-spec canonical-doc leaks, average `16.00` entities per active folder, `365 / 365` cap hits at `16`, and `1` suspicious runtime name (`python`).<!-- /ANCHOR:pre-impl -->
## Code Quality <!-- ANCHOR:code-quality -->- [x] Keep the fix limited to `deriveEntities()` helpers and focused tests. Evidence: runtime edits stayed in `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`, with focused graph-metadata coverage in `mcp_server/tests/graph-metadata-schema.vitest.ts`.<!-- /ANCHOR:code-quality -->
## Testing <!-- ANCHOR:testing -->- [x] `npx tsc --noEmit` and focused graph-metadata Vitest suites pass. Evidence: `mcp_server` typecheck passed and the focused graph-metadata suite passed `24` tests.<!-- /ANCHOR:testing -->
## Security <!-- ANCHOR:security -->- [x] The scope guard rejects out-of-scope paths without breaking valid canonical local docs. Evidence: focused tests cover current-folder canonical preference, external canonical-doc rejection, and sibling-path exclusion; the final active-corpus scan reports `0` true scope leaks.<!-- /ANCHOR:security -->
## Docs <!-- ANCHOR:docs -->- [x] Verification notes capture the before/after leak counts and cap behavior. Evidence: this phase summary records the `9`-leak baseline, the new `24`-entity cap, the post-refresh `23.89` average, and the final `0`-leak result.<!-- /ANCHOR:docs -->
## File Org <!-- ANCHOR:file-org -->- [x] Runtime and test edits stay within the parser and named graph-metadata suites. Evidence: touched runtime/test code stayed within the requested parser module and the named graph-metadata tests; packet-local docs capture closure.<!-- /ANCHOR:file-org -->
## Summary <!-- ANCHOR:summary -->- [x] Closure evidence proves the new cap, scope guard, and runtime-name rejection all landed. Evidence: active-corpus verification now reports `0` true scope leaks, `0` runtime-name entities, and a shifted entity distribution with average `23.89` per active folder.<!-- /ANCHOR:summary -->
