---
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
title: "Tasks: CocoIndex seed telemetry passthrough [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/015-cocoindex-seed-telemetry-passthrough/tasks]"
description: "Per-REQ work units for code_graph_context CocoIndex telemetry passthrough — schema, handler, types, tests, validation."
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
trigger_phrases:
  - "cocoindex seed telemetry tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/015-cocoindex-seed-telemetry-passthrough"
    last_updated_at: "2026-04-27T19:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Decomposed work units"
    next_safe_action: "Memory save + commit"
    blockers: []
    key_files: ["tasks.md"]
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: CocoIndex seed telemetry passthrough

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Read research.md §6 (Q-OPP) end-to-end and confirm scope frozen
- [x] T002 [P] Read `mcp_server/code_graph/handlers/context.ts:16-31`, `:166-180`, `:245-256`
- [x] T003 [P] Read `mcp_server/code_graph/lib/seed-resolver.ts:20-110`
- [x] T004 [P] Read `mcp_server/schemas/tool-input-schemas.ts:464-482`
- [x] T005 Extend `codeGraphSeedSchema` with optional `rawScore`, `raw_score`, `pathClass`, `path_class`, `rankingSignals` (snake_case + camelCase pairs)
- [x] T006 Extend `ContextHandlerArgs.seeds` Array shape with same 5 optional fields
- [x] T007 Extend `CocoIndexSeed` interface with `rawScore?`, `pathClass?`, `rankingSignals?`
- [x] T008 Extend `ArtifactRef` interface with same 3 optional fields
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T101 In CocoIndex seed branch (`context.ts:166-180`) — normalize `raw_score` → `rawScore`, `path_class` → `pathClass`. Prefer camelCase if both present.
- [x] T102 Conditionally attach `rawScore`, `pathClass`, `rankingSignals` to the constructed CocoIndex seed object — only if defined. NEVER emit null placeholders.
- [x] T103 In `resolveCocoIndexSeed` (`seed-resolver.ts:96-122`) — spread telemetry from input seed to resolved `ArtifactRef`. Use type-narrowed checks (`typeof === 'number' / 'string'`, `Array.isArray`).
- [x] T104 In handler anchor emission (`context.ts:245-256`) — conditionally emit `rawScore`, `pathClass`, `rankingSignals` on the JSON envelope only when the resolved ArtifactRef carries them. Use object-literal building (not spread) to avoid undefined-key serialization.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T201 Create `mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts`
- [x] T202 Test A: snake_case wire schema acceptance via `validateToolArgs('code_graph_context', ...)`
- [x] T203 Test B: camelCase internal schema acceptance + mixed snake+camel acceptance
- [x] T204 Test C: handler emits `rawScore`/`pathClass`/`rankingSignals` next to `score`/`snippet`/`range` for both wire shapes
- [x] T205 Test D: seeds without telemetry → anchor MUST NOT have those keys (backward compat); manual seeds ignore telemetry silently
- [x] T206 Test E: byte-equality on score/confidence/resolution/ordering pre-patch vs post-patch with telemetry stripped
- [x] T207 Test E2: `anchor.score === seed.score` (NOT `seed.raw_score`) — explicit invariant
- [x] T208 Test F: `mcp_server/lib/search/hybrid-search.ts` and `search-utils.ts` do NOT reference fork tokens (`path_class`, `pathClass`, `raw_score`, `rankingSignals`)
- [x] T209 Run vitest: `./node_modules/.bin/vitest run tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` — 12/12 green
- [x] T210 Run sibling regression: `./node_modules/.bin/vitest run tests/code-graph-*.vitest.ts` — confirm no NEW regressions (pre-existing 013 sweep failure exempted)
- [x] T211 Run `npx tsc --noEmit` from `mcp_server/` — clean
- [ ] T212 Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet-path> --strict` — PASS
- [x] T213 Update `implementation-summary.md`
- [ ] T214 Commit (deferred to user — packet contract per task instructions)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 1-2 tasks `[x]`
- [x] Phase 3 T201-T211, T213 `[x]`
- [ ] T212 (validator) green
- [x] REQ-001-006 PASSED in vitest
- [x] Anchor envelope byte-equal pre vs post on fixture corpus (with telemetry stripped)
- [x] hybrid-search rank order unchanged (static grep — no fork-token references in lib/search)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: spec.md
- **Plan**: plan.md
- **Sources**:
  - `../011-post-stress-followup-research/research/research.md` §6 (Q-OPP) — primary source of truth
  - `../010-stress-test-rerun-v1-0-2/findings.md` Novel Finding #5 — v1.0.2 evidence
  - `../004-cocoindex-overfetch-dedup/spec.md` — fork extension (cocoindex_code 0.2.3+spec-kit-fork.0.2.0)
- **Related siblings**: `../003-memory-context-truncation-contract` (indirect — separate response-envelope concern)
<!-- /ANCHOR:cross-refs -->
