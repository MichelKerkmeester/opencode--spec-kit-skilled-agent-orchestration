---
title: "Feature Specification: Scripts Interop Refactor"
description: "Refactor @spec-kit/scripts to use explicit dynamic-import interoperability with ESM siblings while remaining CommonJS."
trigger_phrases:
  - "scripts interop refactor"
  - "scripts esm interop"
  - "023 phase 3"
importance_tier: "standard"
contextType: "architecture"
---
# Feature Specification: Scripts Interop Refactor

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 3** of the ESM Module Compliance specification.

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 3 of 4 |
| **Predecessor** | 002-mcp-server-esm-migration |
| **Successor** | 004-verification-and-standards |
| **Handoff Criteria** | Scripts interop helpers work, all scripts-side consumers cross explicit `import()` boundaries |

**Scope Boundary**: Scripts-side interoperability work only. `scripts/package.json` stays CommonJS. No further changes to `shared` or `mcp_server` package configs. Also includes test rewrites for old CommonJS-emit assumptions.

**Dependencies**:
- Phase 2 complete: `mcp_server` emits native ESM
- Phase 1 complete: `shared` emits native ESM

**Deliverables**:
- Explicit dynamic-import interoperability helpers in `scripts/`
- All scripts-side consumers refactored to use interop boundaries
- Module-sensitive tests rewritten for ESM runtime truth
- Scripts interop tests added or updated
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Pending |
| **Created** | 2026-03-29 |
| **Branch** | `main` |
| **Parent Spec** | 023-esm-module-compliance |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`@spec-kit/scripts` is intentionally pinned to CommonJS (`"type": "commonjs"`) and owns 20 files that consume `@spec-kit/shared` and `@spec-kit/mcp-server`. After Phases 1-2, those sibling packages emit native ESM, so direct `require()` of them will fail. The scripts-side call sites must be adapted to use explicit `import()` interoperability helpers. Additionally, existing tests that assert CommonJS emit details must be rewritten.

### Purpose
Prove that `@spec-kit/scripts` can remain CommonJS while safely consuming ESM siblings through explicit dynamic-import boundaries, and that the test suite reflects runtime truth rather than old CJS-emit assumptions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Keep `scripts/package.json` as CommonJS
- Create explicit dynamic-import interoperability helpers for crossing the CJS->ESM boundary
- Refactor all scripts-side consumers of `@spec-kit/shared` and `@spec-kit/mcp-server/api*` to use the interop helpers
- Rewrite module-sensitive tests that assert old CommonJS output details
- Add or update scripts interop tests
- If this phase proves materially too invasive, escalate to dual-build fallback decision
- **Memory save pipeline hardening** (discovered during Phase 1-2 execution):
  - Decouple `workflow.ts` from direct mcp-server runtime imports (P0 — blocks generate-context.js during migration)
  - Fix V8 foreign-spec detection for child phase folders (P0 — blocks saving memory for phased specs)
  - Add manual-fallback save mode with deferred indexing (P1 — zero fallback when generate-context.js breaks)
  - Expand primary evidence parser for manually-written files (P1)
  - Add `related_specs` allowlist for cross-spec research (P1)
  - Freeze canonical JSON v2 schema for generate-context input (P1)

### Out of Scope
- Converting `scripts` itself to ESM
- Further changes to `shared` or `mcp_server` package configs
- Standards docs outside 023

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/**/*.ts` | Modify | Replace `require()` of ESM siblings with `import()` interop |
| `scripts/lib/esm-interop.ts` | Create | Explicit dynamic-import helper module |
| `scripts/core/workflow.ts` | Modify | Decouple from direct mcp-server runtime imports (P0) |
| `scripts/lib/validate-memory-quality.ts` | Modify | Fix V8 descendant phase detection + related_specs allowlist |
| `shared/parsing/memory-sufficiency.ts` | Modify | Expand primary evidence recognition for manual files |
| `mcp_server/handlers/save/markdown-evidence-builder.ts` | Modify | Parse primary evidence from standard anchor sections |
| `scripts/tests/**/*.ts` | Modify | Rewrite tests asserting CJS output to ESM-truth assertions |
| Module-sensitive Vitest suites | Modify | Update `modularization.vitest.ts`, `trigger-config-extended.vitest.ts`, etc. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `scripts/package.json` stays CommonJS | `"type": "commonjs"` remains, no package-level ESM flip |
| REQ-002 | Scripts-side consumers use interop helpers | No direct `require()` of `@spec-kit/shared` or `@spec-kit/mcp-server` ESM packages |
| REQ-003 | `node scripts/dist/memory/generate-context.js --help` works | Primary CLI surface proof under new interop |
| REQ-004 | Module-sensitive tests are rewritten | Tests assert ESM runtime truth, not old CJS emit details |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Scripts interop tests exist | Dedicated tests exercise the interop helpers and failing paths |
| REQ-006 | Dual-build fallback decision is documented if needed | If interop proves too invasive, escalate with evidence |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scripts` remains CommonJS while consuming ESM siblings through explicit `import()` boundaries
- **SC-002**: `node scripts/dist/memory/generate-context.js --help` passes
- **SC-003**: Scripts interop tests pass (`node scripts/tests/test-scripts-modules.js`, `node scripts/tests/test-export-contracts.js`)
- **SC-004**: Module-sensitive Vitest suites pass with ESM-truth assertions
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 1-2 complete (both siblings emit ESM) | Blocker | Cannot test interop until ESM packages exist |
| Risk | 20 scripts files need interop changes | High | Bounded audit first; if too invasive, escalate to dual-build |
| Risk | Dynamic `import()` from CJS is async (returns Promise) | Medium | Interop helper wraps async loading; test call sites for correct `await` usage |
| Risk | Tests hide real breakage by asserting old CJS patterns | High | Rewrite tests before claiming interop is proven |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- If the interop refactor proves materially too invasive (>50% of scripts files need deep restructuring), the fallback is dual-build for `shared` and `mcp_server`. This decision gate is explicit per parent research.
<!-- /ANCHOR:questions -->
