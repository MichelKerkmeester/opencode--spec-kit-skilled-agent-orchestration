---
title: "Feature Specification: ESM Module Compliance"
description: "Decision-complete packet for the pending @spec-kit/shared plus @spec-kit/mcp-server native ESM migration, with @spec-kit/scripts preserved as CommonJS and standards-doc work deferred until runtime proof passes."
trigger_phrases:
  - "esm module compliance"
  - "mcp_server esm refactor"
  - "system-spec-kit esm migration"
importance_tier: "standard"
contextType: "architecture"
---
# Feature Specification: ESM Module Compliance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

### Executive Summary

The finished 20-iteration research in `research/research.md` confirms that this packet is not a docs-only cleanup and not a one-package flag flip. The implementation target is a coordinated native ESM migration for `@spec-kit/shared` and `@spec-kit/mcp-server`, while `@spec-kit/scripts` stays a CommonJS package and crosses the boundary through explicit dynamic-import interoperability helpers. Dual-build or conditional-exports is rejected for the first pass and becomes fallback-only if the bounded scripts-side interop refactor proves too invasive.

**Key Decisions**: move `shared` and `mcp-server` together to package-local native ESM, keep `scripts` on CommonJS as a package, scope scripts-side interop refactors into this migration, and defer standards-doc updates outside this packet until the runtime verification matrix passes.

**Critical Dependencies**: package-local metadata and compiler changes in `shared` and `mcp_server`, scripts-side interoperability helpers, CommonJS-assumption test rewrites, and the exact verification matrix plus highest-risk recent-surface retests captured in `research/research.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
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
Lock a decision-complete implementation packet that follows the finished research conclusions without overstating progress. This packet should tell the implementer exactly what the first migration pass is, what is explicitly rejected, what must be proven at runtime, and what documentation work remains blocked until that runtime proof exists.

### Rationale
Without this truth-sync, the packet would keep mixing documentation conclusions, runtime goals, and rejected fallback options. The research is now complete enough to freeze the strategy, ordered phases, verification matrix, and defer rules clearly before runtime code changes begin.
<!-- /ANCHOR:problem -->

---

### Research-Locked Current State

| Artifact Area | Research Conclusion | Implementation Meaning |
|---------------|---------------------|------------------------|
| `@spec-kit/shared` | Must migrate with `@spec-kit/mcp-server`, not later | Shared package metadata, tsconfig, and relative imports are part of the first pass |
| `@spec-kit/mcp-server` | Must become truthful native ESM from emitted `dist/*.js` | Package metadata, package-local NodeNext settings, import rewrites, and CommonJS-global cleanup are required |
| `@spec-kit/scripts` | Must remain `"type": "commonjs"` | Scripts package conversion is out of scope, but scripts-side runtime interoperability work is in scope |
| Dual-build / conditional exports | Rejected as the first pass | Only reconsider if scripts interop becomes materially too invasive after bounded implementation work |
| Standards docs outside 023 | Not yet eligible to update | Keep `sk-code--opencode` and other standards surfaces deferred until runtime verification passes |

---

<!-- ANCHOR:scope -->
## 4. SCOPE

### In Scope
- Truth-sync this packet to the completed research conclusions in `research/research.md`
- Migrate `@spec-kit/shared` and `@spec-kit/mcp-server` together to package-local native ESM
- Update package metadata and package-local TypeScript settings for both packages to Node-aware native ESM
- Rewrite relative imports and re-exports across `shared/**/*.ts` and `mcp_server/**/*.ts` to runtime-valid ESM specifiers
- Replace CommonJS-only runtime assumptions inside `mcp_server`, including CommonJS globals, `require(...)` sites, and cross-package relative hops
- Keep `@spec-kit/scripts` on CommonJS and refactor scripts-side runtime consumers to explicit dynamic-import interoperability boundaries
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
| `specs/02--system-spec-kit/023-esm-module-compliance/spec.md` | Update | Lock the finished research conclusions into the packet narrative |
| `specs/02--system-spec-kit/023-esm-module-compliance/plan.md` | Update | Order the pending runtime work exactly as the research recommends |
| `specs/02--system-spec-kit/023-esm-module-compliance/tasks.md` | Update | Track pending work by subsystem and verification boundary |
| `specs/02--system-spec-kit/023-esm-module-compliance/checklist.md` | Update | Record strategy locks, pending runtime gates, and defer rules from research |
| `specs/02--system-spec-kit/023-esm-module-compliance/implementation-summary.md` | Update | Replace the stale spec-refresh-only story with the finished research sync state |
| `.opencode/skill/system-spec-kit/shared/**` | Pending runtime work | Package metadata, tsconfig, import rewrite, and export-surface alignment |
| `.opencode/skill/system-spec-kit/mcp_server/**` | Pending runtime work | Package metadata, tsconfig, import rewrite, CommonJS-global cleanup, and boundary repairs |
| `.opencode/skill/system-spec-kit/scripts/**` | Pending runtime work | CommonJS-to-ESM interoperability helpers and scripts-side runtime call-site refactors |
| Standards docs outside `023` | Deferred follow-on | Update only after runtime proof passes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `@spec-kit/shared` and `@spec-kit/mcp-server` migrate together to package-local native ESM | Both packages declare native ESM package metadata, use package-local NodeNext settings, and emit truthful ESM output |
| REQ-002 | `@spec-kit/scripts` stays CommonJS as a package | `scripts/package.json` remains CommonJS and runtime scripts consumption of `shared` or `mcp-server/api*` crosses explicit interoperability boundaries rather than direct CommonJS `require()` of ESM |
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
2. **Given** `scripts` must remain CommonJS, **when** sibling packages flip to ESM, **then** scripts-owned runtime consumers should use explicit dynamic-import interoperability helpers instead of direct `require()` of ESM packages.
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
- This packet must stay implementation-pending until runtime code changes and verification actually land

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- No strategy question remains open. `research/research.md` locks the first-pass decision.
- The only explicit fallback trigger is this: if the bounded scripts-side interoperability refactor proves materially too invasive, revisit dual-build then, not before.
- Standards-doc updates outside 023 remain intentionally deferred until runtime verification passes.
<!-- /ANCHOR:questions -->

---

### Related Documents

- **Research Source of Truth**: See `research/research.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
