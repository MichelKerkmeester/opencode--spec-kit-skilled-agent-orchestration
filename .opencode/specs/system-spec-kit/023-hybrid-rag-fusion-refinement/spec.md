---
title: "Feature Specification: ESM Module Compliance [system-spec-kit/023-hybrid-rag-fusion-refinement/spec]"
description: "Root packet for the shipped @spec-kit/shared plus @spec-kit/mcp-server native ESM migration, with @spec-kit/scripts preserved as CommonJS and post-migration follow-on work tracked in child phases."
trigger_phrases:
  - "esm module compliance"
  - "mcp_server esm refactor"
  - "system-spec-kit esm migration"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/023-hybrid-rag-fusion-refinement"
    last_updated_at: "2026-04-24T14:55:00Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Backfilled memory block"
    next_safe_action: "Revalidate packet docs"
    key_files: ["spec.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

# Feature Specification: ESM Module Compliance

---

### Executive Summary

The finished 20-iteration research in `research/research.md` locked the migration strategy that this packet now records as shipped. The delivered implementation migrated `@spec-kit/shared` and `@spec-kit/mcp-server` to native ESM, kept `@spec-kit/scripts` as CommonJS, and used explicit package-boundary async loading plus scripts-owned bridge code where CommonJS had to cross into ESM. Dual-build or conditional exports remained a fallback option only and were not needed for the shipped path.

**Key Decisions**: move `shared` and `mcp-server` together to package-local native ESM, keep `scripts` on CommonJS as a package, scope scripts-side interop refactors into this migration, and defer standards-doc updates outside this packet until the runtime verification matrix passes.

**Critical Dependencies**: package-local metadata and compiler changes in `shared` and `mcp_server`, scripts-side interoperability boundaries, CommonJS-assumption test rewrites, and the exact verification matrix plus highest-risk recent-surface retests captured in `research/research.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Completed — phases 001-013 recorded, root packet truth-synced after review remediation |
| **Created** | 2026-03-23 |
| **Branch** | `main` |
| **Parent Spec** | None (top-level spec folder) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The earlier packet scope was too small. The research run now shows that `@spec-kit/mcp-server` still depends on CommonJS-shaped compiler output, package metadata, emitted artifacts, and sibling-package assumptions, and that `@spec-kit/shared` cannot be left behind as CommonJS if the server becomes truthful native ESM. At the same time, `@spec-kit/scripts` is intentionally pinned to CommonJS and still owns required CLI and workflow surfaces, so the migration has to repair that boundary rather than flatten the whole workspace into one module mode.

### Purpose
Record the shipped migration truthfully and keep the parent packet aligned with the runtime and child-phase record. This root packet now serves as the durable source of truth for what the first ESM migration pass delivered, what remained explicitly out of scope, and how later child phases extended the post-migration work without reopening the core module-boundary decision.

### Rationale
Without this truth-sync, the parent packet would keep mixing historical planning language, shipped runtime behavior, and later follow-on work. The root packet now reflects the verified migration result and leaves child phases to track later maintenance or retrieval work separately.
<!-- /ANCHOR:problem -->

---

### Research-Locked Current State

| Artifact Area | Research Conclusion | Implementation Meaning |
|---------------|---------------------|------------------------|
| `@spec-kit/shared` | Must migrate with `@spec-kit/mcp-server`, not later | Shared package metadata, tsconfig, and relative imports are part of the first pass |
| `@spec-kit/mcp-server` | Must become truthful native ESM from emitted `dist/*.js` | Package metadata, package-local NodeNext settings, import rewrites, and CommonJS-global cleanup are required |
| `@spec-kit/scripts` | Must remain `"type": "commonjs"` | Scripts package conversion stays out of scope, but scripts-side runtime interoperability work and explicit package-boundary async loading are in scope |
| Dual-build / conditional exports | Rejected as the first pass | Only reconsider if scripts interop becomes materially too invasive after bounded implementation work |
| Standards docs outside 023 | Not yet eligible to update | Keep `sk-code-opencode` and other standards surfaces deferred until runtime verification passes |

---

<!-- ANCHOR:scope -->
## 4. SCOPE

### In Scope
- Truth-sync this packet to the completed research conclusions in `research/research.md`
- Migrate `@spec-kit/shared` and `@spec-kit/mcp-server` together to package-local native ESM
- Update package metadata and package-local TypeScript settings for both packages to Node-aware native ESM
- Rewrite relative imports and re-exports across `shared/**/*.ts` and `mcp_server/**/*.ts` to runtime-valid ESM specifiers
- Replace CommonJS-only runtime assumptions inside `mcp_server`, including CommonJS globals, `require(...)` sites, and cross-package relative hops
- Keep `@spec-kit/scripts` on CommonJS and refactor scripts-side runtime consumers to explicit async ESM package-boundary loading
- Rewrite tests that currently assert CommonJS emit details or otherwise depend on the old module boundary
- Re-test the highest-risk recent runtime surfaces first as part of the migration safety sequence
- Update this packet’s summary and verification state as runtime work progresses

### Out of Scope
- Converting `@spec-kit/scripts` itself to ESM in this first pass
- Starting with dual-build or conditional exports for `shared` or `mcp_server`
- Claiming runtime migration is complete before the exact verification matrix passes
- Updating standards docs outside 023 before runtime verification passes
- Broad standards refreshes or architectural wording changes outside this packet while runtime truth is still unproven

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `./spec.md` | Updated | Finalized packet narrative aligned to completed migration and closure phases |
| `./plan.md` | Updated | Completed implementation plan with closed gates and evidence |
| `./tasks.md` | Updated | Completed subsystem task tracking with evidence references |
| `./checklist.md` | Updated | Verification gates recorded with completion evidence |
| `./implementation-summary.md` | Updated | Final runtime and deep-review remediation summary |
| `.opencode/skill/system-spec-kit/shared/**` | Completed runtime work | ESM metadata/config/import migration complete |
| `.opencode/skill/system-spec-kit/mcp_server/**` | Completed runtime work | ESM metadata/config/import migration and boundary hardening complete |
| `.opencode/skill/system-spec-kit/scripts/**` | Completed runtime work | CommonJS interop boundary refactor and verification complete |
| Standards docs outside `023` | Completed follow-on | Updated after runtime verification evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `@spec-kit/shared` and `@spec-kit/mcp-server` migrate together to package-local native ESM | Both packages declare native ESM package metadata, use package-local NodeNext settings, and emit truthful ESM output |
| REQ-002 | `@spec-kit/scripts` stays CommonJS as a package | `scripts/package.json` remains CommonJS and runtime scripts consumption of `shared` or `mcp-server/api*` crosses explicit async package-boundary loading rather than direct CommonJS `require()` of ESM |
| REQ-003 | Runtime verification proves the migration, not just source syntax | The exact verification matrix in `research/research.md` passes, including root commands, targeted tests, and direct runtime smokes |
| REQ-004 | Highest-risk recent surfaces are re-tested first | The migration sequence re-tests the hot recent surfaces called out by research before standards docs outside 023 are updated |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Dual-build/conditional-exports is rejected for the first pass | The packet treats dual-build as fallback-only and revisits it only if scripts interop proves too invasive |
| REQ-006 | Test rewrites cover CommonJS-emit assumptions | Module-sensitive tests stop asserting old CommonJS emit details and instead verify the new runtime boundary truthfully |
| REQ-007 | Standards docs outside 023 stay deferred until runtime proof passes | No standards-doc update is treated as complete until the runtime verification matrix succeeds |
| REQ-008 | Packet docs stay synchronized with `research/research.md` | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` reflect the finished research while keeping runtime implementation pending |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- **SC-001**: `shared` and `mcp_server` build to native ESM entrypoints instead of CommonJS wrappers
- **SC-002**: `scripts` remains a CommonJS package but proves scripts-side interoperability with the migrated ESM sibling packages
- **SC-003**: The exact verification matrix from `research/research.md` passes with the required root commands and targeted smokes
- **SC-004**: The highest-risk recent surfaces are re-tested first and remain stable after the module migration
- **SC-005**: Standards docs outside 023 remain deferred until the runtime proof exists, then update from the verified implementation rather than from speculation

### Acceptance Scenarios

1. **Given** `shared` and `mcp_server` are still CommonJS-shaped today, **when** the first implementation pass lands, **then** both packages should move together to truthful native ESM rather than splitting the boundary.
2. **Given** `scripts` must remain CommonJS, **when** sibling packages flip to ESM, **then** scripts-owned runtime consumers should use explicit async package-boundary loading and bridge code instead of direct `require()` of ESM packages.
3. **Given** dual-build is not the first-pass strategy, **when** interop work begins, **then** the bounded scripts interop refactor should be attempted before any fallback to dual-build is considered.
4. **Given** recent runtime surfaces are already hot, **when** verification begins, **then** the first re-tests should cover the highest-risk recent surfaces called out by research.
5. **Given** runtime verification is still pending, **when** standards docs outside 023 are reviewed, **then** they should stay deferred until the runtime matrix passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Scripts-side interoperability work is larger than expected | High | Attempt the bounded explicit-loader refactor first and consider dual-build only if that path proves materially too invasive |
| Risk | `shared` and `mcp_server` drift if migrated separately | High | Treat them as one package-boundary change set and keep the sequence locked |
| Risk | Recent hot runtime areas regress under new ESM path semantics | High | Re-test the highest-risk recent surfaces first, especially the areas touched by `f10fb98`, `ca15faf`, `85078af`, and `6da69a9` |
| Risk | Tests keep asserting CommonJS emit details and hide true runtime issues | Medium | Rewrite module-sensitive tests to runtime-truth assertions and add the targeted strengthened gates from research |
| Dependency | `research/research.md` sections 4-9 | Green | Source of truth for strategy, rejected options, ordered phases, verification matrix, and retest priorities |
| Dependency | `@spec-kit/scripts` package boundary | Yellow | The package must stay CommonJS even while sibling packages move to native ESM |

### Highest-Risk Recent Surfaces To Re-Test First

- `mcp_server/handlers/memory-save.ts`
- `mcp_server/handlers/memory-index.ts`
- `mcp_server/handlers/shared-memory.ts`
- `mcp_server/lib/search/vector-index-store.ts`
- `mcp_server/lib/session/session-manager.ts`
- `scripts/memory/generate-context.ts`
- `scripts/core/workflow.ts`
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Module Boundary
- `mcp_server` cannot safely flip alone while `shared` stays CommonJS-shaped
- `scripts` must not silently fall back to direct CommonJS `require()` of ESM siblings
- Cross-package relative hops, especially from `mcp_server` into `shared`, need package or subpath boundaries instead of CommonJS-friendly sibling resolution

### Runtime Assumptions
- CommonJS globals in `mcp_server` must be replaced with native ESM-safe equivalents
- Dist-sensitive bridge files and scripts-owned runtime entrypoints need explicit scrutiny under emitted ESM output
- Tests that currently assert CommonJS output shape need rewrites before they can be trusted as migration proof

### Documentation Boundary
- Standards docs outside 023 should not be updated early just because the research is complete
- This packet should describe shipped runtime behavior, not stay frozen in an implementation-pending state after verification lands
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- No strategy question remains open. `research/research.md` locks the first-pass decision.
- The only explicit fallback trigger remains historical: if the bounded scripts-side interoperability refactor had proved materially too invasive, dual-build would have been revisited then, not before.
- Standards-doc updates outside 023 remain intentionally deferred until runtime verification passes.
<!-- /ANCHOR:questions -->

---

### Related Documents

- **Research Source of Truth**: See `research/research.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

<!-- SPECKIT_ADDENDUM: Phase - Parent Section -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder.

| Phase | Folder | Focus | Deps | Status |
|-------|--------|-------|------|--------|
| 1 | 001-shared-esm-migration/ | Package metadata, tsconfig, import rewrites for `@spec-kit/shared` | None | Complete |
| 2 | 002-mcp-server-esm-migration/ | Package metadata, tsconfig, import rewrites, CJS cleanup for `@spec-kit/mcp-server` | Phase 1 | Complete |
| 3 | 003-scripts-interop-refactor/ | CJS-to-ESM interop, memory save hardening, workflow decoupling | Phase 2 | Complete |
| 4 | 004-verification-and-standards/ | ESM test updates, deep review, code standards, README alignment | Phase 3 | Complete |
| 5 | 005-test-and-scenario-remediation/ | Fix pre-existing test failures, playbook scenario gaps, final test report | Phase 4 | Complete |
| 6 | 006-review-remediation/ | Fix all 18 findings (14 P1 + 4 P2) from 10-iteration GPT-5.4 deep review | Phase 5 | Complete |

| 7 | 007-hybrid-search-null-db-fix/ | Hybrid search pipeline null DB fix | Phase 6 | Complete |
| 8 | 008-spec-memory-compliance-audit/ | Spec and memory compliance audit, database rebuild from zero | Phase 7 | Complete |
| 9 | 009-reindex-validator-false-positives/ | Reindex validator false-positive cleanup | Phase 8 | Complete |
| 10 | 010-search-retrieval-quality-fixes/ | Search and retrieval quality fixes | Phase 9 | Complete |
| 11 | 011-indexing-and-adaptive-fusion/ | Indexing, adaptive fusion, and retrieval follow-through | Phase 10 | Complete |
| 12 | 012-memory-save-quality-pipeline/ | Memory-save quality pipeline hardening | Phase 11 | Complete |
| 13 | 013-fts5-fix-and-search-dashboard/ | FTS5 repair and search dashboard follow-through | Phase 12 | Complete |
### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-shared-esm-migration | 002-mcp-server-esm-migration | `shared` emits native ESM, `shared/package.json` has `"type": "module"`, all relative imports use `.js` specifiers | `npm run build --workspace=@spec-kit/shared` passes; emitted `dist/` contains ESM output |
| 002-mcp-server-esm-migration | 003-scripts-interop-refactor | `mcp_server` emits native ESM, CJS globals removed, `node dist/context-server.js` starts | `npm run build --workspace=@spec-kit/mcp-server` passes; `node dist/context-server.js` smoke passes |
| 003-scripts-interop-refactor | 004-verification-and-standards | Scripts interop helpers work, all scripts-side consumers cross explicit `import()` boundaries | `node scripts/dist/memory/generate-context.js --help` passes; scripts interop tests pass |
| 004-verification-and-standards | 005-test-and-scenario-remediation | Deep review complete, all P1/P2 resolved, ESM-caused test failures fixed | 30-iteration review 0 open P0/P1; 3 ESM test files fixed |
| 005-test-and-scenario-remediation | 006-review-remediation | All tests green, test sweep complete | 9480/9480 passing, 0 failures, 0 skipped |
| 006-review-remediation | 007-hybrid-search-null-db-fix | All 18 review findings (14 P1 + 4 P2) resolved | Validation passes, review dashboard clean |
| 007-hybrid-search-null-db-fix | 008-spec-memory-compliance-audit | memory_search returns >0 results for queries matching existing memories | memory_search("ESM migration") returns results |
| 008-spec-memory-compliance-audit | 009-reindex-validator-false-positives | Recursive validation distinguishes real errors from stale reindex warnings | validate.sh reports the expected clean packet state |
| 009-reindex-validator-false-positives | 010-search-retrieval-quality-fixes | Retrieval quality fixes land without reopening the ESM migration contract | targeted retrieval checks and packet validation pass |
| 010-search-retrieval-quality-fixes | 011-indexing-and-adaptive-fusion | Search pipeline stability is restored | indexing and retrieval packet checks pass |
| 011-indexing-and-adaptive-fusion | 012-memory-save-quality-pipeline | Memory-save pipeline follows current runtime contracts | save pipeline packet checks pass |
| 012-memory-save-quality-pipeline | 013-fts5-fix-and-search-dashboard | Search-index repair and dashboard work build on the hardened save path | FTS5 repair and dashboard packet checks pass |
<!-- /ANCHOR:phase-map -->
