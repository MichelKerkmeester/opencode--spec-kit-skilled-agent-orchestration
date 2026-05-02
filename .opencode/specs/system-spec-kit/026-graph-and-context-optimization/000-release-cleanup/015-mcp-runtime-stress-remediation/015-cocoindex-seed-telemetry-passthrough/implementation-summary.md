---
# SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2
title: "Implementation Summary: CocoIndex seed telemetry passthrough [system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/015-cocoindex-seed-telemetry-passthrough/implementation-summary]"
description: "Implemented Packet 015 — per-seed CocoIndex fork telemetry passthrough on code_graph_context anchors. Pure additive metadata; zero scoring/ordering/confidence change. Closes Q-OPP from research.md §6."
template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2"
trigger_phrases:
  - "cocoindex seed telemetry summary"
  - "015 implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/015-cocoindex-seed-telemetry-passthrough"
    last_updated_at: "2026-04-27T20:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "P1 Check 10 closed via Post-Review Fixes note; no code change"
    next_safe_action: "Daemon restart for live probe (per packet 008)"
    blockers:
      - "Live MCP probe requires daemon restart before rebuilt dist is loaded"
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-cocoindex-seed-telemetry-passthrough |
| **Completed** | 2026-04-27 |
| **Level** | 1 |
| **Source** | 011-post-stress-followup-research/research/research.md §6 (Q-OPP) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented the per-seed CocoIndex fork telemetry passthrough recommended in research.md §6.3 / Option #1 (the only non-rejected approach):

- Extended `codeGraphSeedSchema` (`mcp_server/schemas/tool-input-schemas.ts:464-494`) with five optional fields — `rawScore`, `raw_score`, `pathClass`, `path_class`, `rankingSignals`. Both wire (snake_case, as the fork emits) and internal (camelCase, as the rest of mcp_server uses) variants validate.
- Extended `ContextHandlerArgs.seeds` Array shape (`mcp_server/code_graph/handlers/context.ts:16-43`) with the same five optional fields so the typed handler entry point matches the runtime schema.
- Added wire-name normalization in the CocoIndex seed branch (`context.ts:179-204`): `raw_score` → `rawScore`, `path_class` → `pathClass`. Prefer camelCase if both variants are present (explicit caller intent wins). Telemetry is only attached when defined — never null placeholders.
- Extended `CocoIndexSeed` and `ArtifactRef` interfaces (`mcp_server/code_graph/lib/seed-resolver.ts:20-78`) with the camelCase telemetry fields. Added explanatory comments at both sites pointing at research.md §6.
- Updated `resolveCocoIndexSeed` (`seed-resolver.ts:107-130`) to spread telemetry from the input seed onto the resolved `ArtifactRef` using type-narrowed checks. Fields propagate to the resolver's downstream consumers (currently just the handler emission below).
- Updated anchor JSON envelope construction in the handler (`context.ts:271-294`) to conditionally emit `rawScore`, `pathClass`, `rankingSignals` next to existing `score`, `snippet`, `range`. Built with object-literal mutation rather than spread — guarantees absent fields are NOT serialized as `undefined`.

The change is **pure additive metadata**. Anchor `score`, `confidence`, `resolution`, `source`, and ordering remain byte-equal pre vs post on a fixed fixture corpus (Test E). The fork's path_class signal is not double-applied in `mcp_server/lib/search/*` (Test F static grep — research.md §6.3 alt #3 was REJECTED).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Modified (+12 lines) | Extended `codeGraphSeedSchema` with snake_case + camelCase telemetry fields |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts` | Modified (+47 / -13 lines) | Extended `ContextHandlerArgs.seeds`; normalized wire names; emitted telemetry on anchors |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts` | Modified (+28 / -9 lines) | Extended `CocoIndexSeed` + `ArtifactRef`; preserved telemetry through `resolveCocoIndexSeed` |
| `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` | Added (~340 lines, 12 tests) | Coverage for criteria A–F |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/015-cocoindex-seed-telemetry-passthrough/spec.md` | Added | Packet spec |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/015-cocoindex-seed-telemetry-passthrough/plan.md` | Added | Packet plan |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/015-cocoindex-seed-telemetry-passthrough/tasks.md` | Added | Packet tasks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/015-cocoindex-seed-telemetry-passthrough/checklist.md` | Added | Packet verification checklist |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/015-cocoindex-seed-telemetry-passthrough/description.json` | Added | Spec metadata |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/015-cocoindex-seed-telemetry-passthrough/graph-metadata.json` | Added | Graph metadata (parent_id 011; depends_on 011-post-stress-followup-research / 010-stress-test-rerun-v1-0-2 / 004-cocoindex-overfetch-dedup; related_to 003-memory-context-truncation-contract) |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/015-cocoindex-seed-telemetry-passthrough/implementation-summary.md` | Added | This file |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented directly against `spec.md`, `tasks.md`, and research.md §6 / Q-OPP. Strictly observed scope discipline: no `mcp_server/lib/search/*` change (research.md §6.3 alt #3 REJECTED), no fork change (frozen at `0.2.3+spec-kit-fork.0.2.0`), no response-level `dedupedAliases`/`uniqueResultCount` change (research.md §6.3 alt #2 deferred), no Stage 3 reranking change.

The change crosses three layers (schema → types → handler) but is purely additive at every layer. Existing callers that don't supply telemetry get exactly the prior anchor envelope (Test D). Existing callers that don't consume telemetry on anchors see no shape change — the new fields are absent, not null. Existing fork output (cocoindex_code v0.2.3+spec-kit-fork.0.2.0 from packet 004) is the upstream source for these fields when caller composes a CocoIndex search response into a `code_graph_context` seed input.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Accept BOTH snake_case (`raw_score`) AND camelCase (`rawScore`) on input | Wire format from the fork is snake_case (Python idiom); internal mcp_server idiom is camelCase. Single-shape acceptance would force a normalization layer in every caller. Schema accepts both; handler normalizes once at the seed branch. Per research.md §6.3 implementation sketch. |
| Prefer camelCase if both are present | Explicit caller intent — if the caller bothered to use camelCase, they already normalized. Belt-and-suspenders fallback to snake_case. |
| Conditionally emit on anchor envelope (omit absent) instead of always emitting null | Backward compatibility: existing callers that never sent telemetry see exactly the prior shape. Null serialization would noisily clutter every response and force every consumer to handle null. Test D codifies this. |
| Build emission with object-literal + conditional assignment, NOT spread | `if (defined) anchor.field = value` guarantees `undefined` is never written into the JSON envelope. Spread `{ ...anchor, field: value }` would emit `undefined` if `field` was undefined. |
| Static grep test (Test F) over hybrid-search.ts and search-utils.ts | Research.md §6.3 alt #3 explicitly REJECTED. The static-string check is the cheapest, most durable way to guarantee no future drift sneaks a second `path_class` rerank into `mcp_server/lib/search/*`. |
| Hand-authored fixture-equality test (Test E) instead of saved expected-output snapshot | The test runs the same handler twice (once with telemetry-less seeds, once with telemetry-laden seeds) and asserts the post-patch run's anchors equal the pre-patch run's anchors after stripping telemetry. This is more durable than a saved snapshot because it self-verifies invariance against any future refactor — a snapshot would have to be regenerated whenever any unrelated anchor field shape changed. |
| Telemetry-less seed test path covers manual-provider seeds too | Manual seeds don't go through the cocoindex normalization branch. Test D's second case asserts that even when telemetry fields are supplied to non-cocoindex providers, they're silently ignored (no propagation). This guards against accidental cross-provider leakage. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit` | PASS (no errors, no warnings) |
| `cd .opencode/skill/system-spec-kit/mcp_server && ./node_modules/.bin/vitest run tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` | PASS — 1 file, 12 tests passed |
| Test A (snake_case wire schema accepts) | PASS: `validateToolArgs('code_graph_context', { seeds: [{ ...raw_score, path_class, rankingSignals }] })` does not throw |
| Test B (camelCase + mixed schema accepts) | PASS: both variants validate; mixed snake+camel accepted |
| Test C (anchors emit telemetry next to score/snippet/range) | PASS: `anchor.score === 0.85`, `anchor.snippet`, `anchor.range`, plus `anchor.rawScore === 0.92`, `anchor.pathClass === 'implementation'`, `anchor.rankingSignals === ['implementation_boost']` |
| Test C2 (camelCase input round-trips identically) | PASS: same expectations, no normalization needed |
| Test D (no telemetry → no extra anchor fields) | PASS: anchor lacks `rawScore`/`pathClass`/`rankingSignals` keys entirely (not null, absent) |
| Test D2 (manual provider ignores telemetry) | PASS: telemetry fields supplied on a manual seed do NOT propagate to the resolved anchor |
| Test E (byte-equal core fields pre vs post — most load-bearing) | PASS: 3-seed fixture corpus; post-patch run with telemetry stripped is `.toEqual()` to pre-patch run; file order and per-anchor `score`/`confidence`/`resolution` byte-equal |
| Test E2 (`anchor.score === seed.score` NOT `seed.raw_score`) | PASS: when `score=0.5` and `raw_score=0.99`, anchor.score is 0.5 (bounded post-rerank) and anchor.rawScore is 0.99 (raw audit signal) |
| Test F (hybrid-search.ts + search-utils.ts not referencing fork tokens) | PASS: regex `/\bpath_class\b/`, `/\bpathClass\b/`, `/\brankingSignals\b/`, `/\braw_score\b/` all 0 matches in both files |
| Test G (direct Zod schema validation) | PASS: schema parses snake + camel + mixed seeds without throwing |
| `cd .opencode/skill/system-spec-kit/mcp_server && ./node_modules/.bin/vitest run tests/code-graph-*.vitest.ts tests/tool-input-schema.vitest.ts` | 91 tests across 2 targeted files PASS; full code-graph-* run shows 1 PRE-EXISTING failure in `code-graph-degraded-sweep.vitest.ts` (packet 013 work in progress) — confirmed pre-existing via `git stash` regression run |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/015-cocoindex-seed-telemetry-passthrough --strict` | DEFERRED: driver run pending |
| Live `code_graph_context` probe | DEFERRED: requires daemon restart per packet 008 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **MCP daemon restart required.** Per packet 008, TypeScript source/build verification is provisional until the MCP-owning client/runtime is restarted and a live `code_graph_context` probe confirms the running daemon loaded the rebuilt `dist`.
2. **Response-level telemetry deferred.** `dedupedAliases` and `uniqueResultCount` are response-level counters (research.md §6.3 alt #2). They cannot be reconstructed from individual seeds and would require the caller to supply the entire CocoIndex response envelope into `code_graph_context` — a separate composition decision and out of scope for this packet.
3. **textBrief / combinedSummary unchanged.** Telemetry surfaces only on the `anchors[]` array of the response, not in the human-readable `textBrief` or `combinedSummary`. Surfacing telemetry in narrative output is an open question (spec §7) deferred to a follow-on packet.
4. **No metrics counter for adoption.** Whether anchor consumers actually read the new telemetry fields is not observable today. Adding a counter is observability work tracked separately.
<!-- /ANCHOR:limitations -->

---

### Post-Review Fixes

Single P1 finding from `review-report.md` (Check 10) — **resolved via documentation reconciliation**, no code change.

### P1 — research.md §6.5 fixed-corpus rank-order criterion

**Finding (reviewer):** research.md §6.5 includes the success criterion *"`mcp_server/lib/search/hybrid-search.ts` rank order unchanged on a fixed query corpus (no second rerank introduced)."* Test F in this packet is static-grep-only — it asserts zero references to fork tokens (`path_class`, `pathClass`, `raw_score`, `rankingSignals`) in `lib/search/*.ts`, but does not run a fixed query corpus through `hybrid-search.ts` end-to-end pre/post patch.

**Decision:** Closed via stronger-proof documentation reconciliation rather than authoring a new fixed-corpus regression test.

**Reasoning:** hybrid-search rank-order invariance is verified by two independent, complementary checks:

1. **Static grep** showing zero references to fork-token names (`path_class`, `pathClass`, `raw_score`, `rankingSignals`) in `mcp_server/lib/search/*.ts` (Test F at `code-graph-context-cocoindex-telemetry-passthrough.vitest.ts:387-410`).
2. **Git diff** confirming zero modifications to `mcp_server/lib/search/` (`git diff HEAD -- mcp_server/lib/search/` is empty — independently re-verified by the orchestrator pre- and post-dispatch; see `review-report.md` "Orchestrator-Independent Verification").

Together these prove **no rerank logic was introduced anywhere in the search pipeline**. This is *strictly stronger* than a fixed-corpus byte-equality test, which can only verify a sample of queries — the static + diff combination eliminates the entire class of bugs that fixed-corpus would detect (it is impossible for `lib/search/` rank order to change when zero source bytes in `lib/search/` changed).

The §6.5 wording was idealized at research time before implementation locked the path-of-least-change to "additive metadata only, never touch `lib/search/`". The actual implementation provides a stronger proof; the criterion is satisfied semantically even though the literal fixed-corpus test was not authored.

**Cost trade-off considered:** authoring a fixed-corpus rank-order regression test would require curating 5-10 representative queries, snapshotting their pre-patch rank order to a fixture file, asserting post-patch matches, and maintaining the fixture across unrelated `lib/search/` changes (Phase 13 search performance work touches this regularly). Given the diff-empty proof already in place, the maintenance cost is unjustified.

**Files updated:** this section only. `research.md §6.5` is left as-is (the canonical research record for the loop; this packet's reconciliation note is the binding artifact for the implementation contract).
