---
title: "Feature Specification: Template Greenfield Implementation — C+F Hybrid Manifest-Driven (4 Phases)"
description: "Execute the C+F hybrid manifest-driven greenfield template system per packet 002's converged recommendation. 4 phases (manifest+resolver+renderer+test → scaffolder → validators → delete legacy). Workflow-invariance preserved: Level 1/2/3/3+ vocabulary stays the SOLE public/AI-facing surface; preset/capability/kind names are STRICTLY private."
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2"
trigger_phrases:
  - "template greenfield impl"
  - "manifest-driven implementation"
  - "level-contract resolver"
  - "kill level dirs"
importance_tier: "high"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-template-levels/003-template-greenfield-impl"
    last_updated_at: "2026-05-01T14:10:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded packet; resource-map.md authored first per user request"
    next_safe_action: "Begin Phase 1 implementation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-01-14-10-template-impl"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Feature Specification: Template Greenfield Implementation — C+F Hybrid Manifest-Driven (4 Phases)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Sibling packet `002-template-greenfield-redesign/` ran a 14-iteration deep-research loop and converged on a chosen design (C+F hybrid manifest-driven greenfield) with 5 ADRs covering the architectural decisions and the workflow-invariance constraint. This packet **executes** the implementation across 4 gated phases: ADD private manifest+resolver+renderer+CI-test, MODIFY scaffolder, MODIFY validators, DELETE legacy. The full file-by-file blast radius lives in `resource-map.md` (~85 file references; 20 created / 18 modified / 51 deleted / many intentionally untouched).

**Key invariants (per ADR-005)**: AI behavior + user conversation flow stays byte-identical to today. `--level N` flag stays the sole public CLI surface. `<!-- SPECKIT_LEVEL: N -->` markers preserved. Validator error messages stay level-only. Workflow-invariance CI test (`workflow-invariance.vitest.ts`) fails the build if banned vocabulary (preset/capability/kind/manifest) leaks to any public surface.

**Critical Dependencies**: 011's `research/research.md` (51.4 KB synthesis), `decision-record.md` (ADR-001 through ADR-005), `plan.md` (4-phase blueprint). `resource-map.md` (this packet) is the authoritative file-by-file ledger; reviewers read it before any code review.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-01 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Today's spec-kit template system has 86 files / ~13K LOC split across `core/`, `addendum/{level2-verify, level3-arch, level3-plus-govern, phase}/`, four materialized `level_N/` outputs, `phase_parent/`, plus a build-time composer (`compose.sh`) and an anchor wrapper (`wrap-all-templates.ts`). Two surfaces of truth (scaffolder + validators) encode the level→files matrix independently, allowing silent drift. Addon docs (`handover.md`, `debug-delegation.md`, `research.md`) get scaffolded as empty stubs nobody touches, even though they're written exclusively by automation.

Packet 002 designed the replacement (C+F hybrid manifest-driven). This packet **builds it**.

### Purpose
Execute the 4-phase implementation plan from packet 002, with explicit gates between phases. Verify the workflow-invariance CI test stays green throughout. Final state: 86 → ~13 source files in `templates/manifest/`, single-manifest source of truth for both scaffolder and validators, no stale empty addon stubs in fresh packets, public `--level N` API and AI conversation flow byte-identical to today.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (this packet)
- Phase 1: ADD `templates/manifest/spec-kit-docs.json` + 12 `.md.tmpl` files + `level-contract-resolver.ts` + `inline-gate-renderer.ts` + `template-utils.sh::resolve_level_contract` + 4 vitest cases (workflow-invariance, resolver, renderer, golden snapshots)
- Phase 1: FIX 2 leaks identified iter 12 (`[capability]` placeholder text, "Sub-phase manifest" wording)
- Phase 2: MODIFY `create.sh` (~30-line diff), `template-utils.sh::copy_template`, `scaffold-debug-delegation.sh`, `recommend-level.sh`, `upgrade-level.sh`
- Phase 3: MODIFY validators (`check-files.sh`, `check-sections.sh`, `check-template-headers.sh`, `check-section-counts.sh`, `check-level.sh`, `check-level-match.sh`, `check-template-source.sh`, `check-template-staleness.sh`), `template-structure.js`, `mcp_server/lib/validation/spec-doc-structure.ts`
- Phase 4: DELETE `templates/{level_1,level_2,level_3,level_3+,core,addendum,phase_parent}/` + composer (`compose.sh`, `wrap-all-templates.{ts,sh}`) + obsolete tests (`test-template-system.js`, `test-template-comprehensive.js`)
- Phase 4: UPDATE `SKILL.md`, `CLAUDE.md`, `AGENTS.md`, `AGENTS_Barter.md` (remove file-path references to deleted dirs; KEEP level vocabulary)

### Out of Scope (this packet)
- `templates/changelog/`, `templates/examples/`, `templates/scratch/`, `templates/stress_test/` — preserved per 011 spec
- 868 existing spec folders — immutable git history, no migration script (per ADR-001 + ADR-005)
- New skill capabilities beyond level taxonomy — out of scope; if needed, add to manifest in a separate packet

### Authoritative file ledger
**See `resource-map.md`** for the comprehensive file-by-file blast radius (every ADD / MODIFY / DELETE / UNTOUCHED path with reasoning). All other docs in this packet defer to `resource-map.md` for file-level questions.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Phase 1 ships without modifying any production-path files | All 21 added files exist; the only existing-file changes are (a) `template-utils.sh` adds a new function (no existing function altered), (b) 2 test fixture dirs rewritten (test-only, not production paths). All production scaffolder + validator + template files remain byte-identical at end of Phase 1. |
| REQ-002 | Workflow-invariance CI test in place at end of Phase 1 | `workflow-invariance.vitest.ts` exists and fails on test fixture containing `preset`/`capability`/`kind`/`manifest` in a public surface |
| REQ-003 | Phase 2 produces identical scaffold output | Scaffold-comparison test (old vs new for each level 1/2/3/3+/phase-parent) shows identical file lists; only frontmatter cleanups differ |
| REQ-004 | Phase 3 zero validator regressions | `validate.sh --strict` against all 868 existing spec folders shows zero new errors (warnings may differ) |
| REQ-005 | Phase 4 deletion gated on green CI | `rg "templates/level_"` returns zero hits outside historical fixtures; workflow-invariance test green; one-commit `git revert` rollback verified |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Generated `description.json` + `graph-metadata.json` keep `level: N` field | grep on freshly-scaffolded packet shows `level: N`; no `preset`/`capability`/`manifestVersion` in AI-readable metadata |
| REQ-007 | All ADRs from packet 002 honored in implementation | Code review confirms ADR-001 (C+F hybrid), ADR-002 (manifestVersion exact match), ADR-003 (template-contract on spec.md only), ADR-004 (phase-parent scaffolds parent only), ADR-005 (workflow-invariant) all reflected in code |
| REQ-008 | All implementation work landed via the same single commit (or atomic PR) | Single rollback point; phases land in sequence but each phase commits cleanly |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 4 phases land with each phase's gate green
- **SC-002**: Source surface drops from 86 files to ~13 in `templates/manifest/` (per resource-map §6 totals)
- **SC-003**: Workflow-invariance CI test green throughout (no banned vocabulary in any public surface)
- **SC-004**: Scaffold-comparison test passes for all 5 levels (1/2/3/3+/phase-parent)
- **SC-005**: Existing 868 spec folders continue to validate (zero new errors)
- **SC-006**: AI conversation flow + Gate 3 classifier behavior + `--level N` flag behavior byte-identical to today
- **SC-007**: Single-commit rollback verified manually
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Workflow-invariance CI test misses a leak in a less-obvious surface | High | Iter 12 audited 11 surfaces; iter 13 dry-ran 5 conversation scenarios; if a leak surfaces post-impl, add the surface to the test allowlist+regex |
| Risk | Scaffold-comparison test reveals subtle byte differences (e.g., extra blank line) | Medium | Allowlist the cleanups identified iter 9 (deletion of stale stubs is INTENDED); fail on anything else |
| Risk | `template-structure.js` refactor (largest single-file change) introduces regressions | High | Phase 3 gate requires zero validator regressions against 868 existing folders |
| Risk | `compose.sh` deletion in Phase 4 misses a hidden caller | Medium | Phase 4 verification: `rg "compose\.sh"` returns zero hits before deletion |
| Risk | Documentation drift between `SKILL.md`, `CLAUDE.md`, `AGENTS.md` | Low | Single-commit rule (REQ-008) keeps all docs synchronized |
| Dependency | Packet 002 synthesis | Critical | `002/research/research.md` is the authoritative design source; this packet doesn't redesign |
| Dependency | `resource-map.md` (this packet) | Critical | Authoritative file ledger; updated atomically with any scope change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `create.sh --level N` end-to-end ≤500ms (carryover from 011 NFR-P01; verified iter 7)

### Maintainability
- **NFR-M01**: Adding a new capability to the manifest requires changes in ≤2 files (manifest + 1 template)
- **NFR-M02**: Source surface ≤30 files in `templates/manifest/` (target: 13)

### Reliability
- **NFR-R01**: Single manifest is source of truth; scaffolder and validator structurally cannot drift
- **NFR-R02**: Workflow-invariance CI test fails build on any banned-vocabulary leak

---

## 8. EDGE CASES

### Phase ordering
- Phase 1 is purely additive — must complete before Phase 2 begins
- Phase 2 + 3 land in either order (independent), but BOTH must complete before Phase 4
- Phase 4 deletion is the single one-commit-rollback point

### Existing 868 spec folders
- Their `<!-- SPECKIT_TEMPLATE_SOURCE -->` markers remain valid as descriptive comments
- Their `<!-- SPECKIT_LEVEL: N -->` markers remain valid (level vocabulary preserved)
- No migration script needed (per ADR-001 + ADR-005)

### Cross-cutting templates (handover, debug-delegation, research, resource-map, context-index)
- Already in scope: their `.md.tmpl` source files move from `templates/*.md` to `templates/manifest/*.md.tmpl`
- Lifecycle ownership preserved: handover via `/memory:save`, debug-delegation via `@debug`, research via `/spec_kit:deep-research`, resource-map mixed, context-index author

### Phase-parent
- `kind=phase-parent` in manifest produces lean trio (spec.md + description.json + graph-metadata.json)
- Children scaffold via `create.sh --subfolder` separately (per ADR-004)

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | 51 deletions + 18 modifications + 20 additions across templates/scripts/mcp_server/docs |
| Risk | 22/25 | Touches every future spec-folder creation; parser regression = silent corruption; level-vocabulary leak = AI-facing breakage |
| Research | 5/20 | Design fully converged in 011; this packet is mechanical execution |
| Multi-Agent | 5/15 | Single implementation packet; no parallel workstreams |
| Coordination | 12/15 | Multi-phase with gates; doc + code synchronization required |
| **Total** | **66/100** | **Level 3 confirmed (architectural)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Workflow-invariance test misses a leak | H | M | Iter-12 audit covered 11 surfaces; iter-13 covered 5 scenarios; allowlist + regex updated post-impl as needed |
| R-002 | Scaffold-comparison test fails on intended cleanups | M | H | Allowlist for INTENDED diffs (deletion of stale stubs); fail on anything else |
| R-003 | `template-structure.js` refactor regression | H | M | Phase 3 gate: zero validator regressions against 868 packets |
| R-004 | Hidden `compose.sh` caller surfaces in Phase 4 | M | L | `rg` + `grep` audit before deletion |
| R-005 | `--preset` vocabulary leaks via internal log | M | L | CI test catches it |

---

## 11. USER STORIES

### US-001: Maintainer ships Phase 1 without disrupting existing workflow (Priority: P0)

**As a** spec-kit maintainer, **I want** Phase 1 to be additive (zero changes to existing files), **so that** I can land it via PR and immediately verify the workflow-invariance CI test catches leaks before any production code path runs through the new resolver.

**Acceptance Criteria**:
1. **Given** Phase 1 is merged, **When** I run today's `validate.sh --strict` against any existing packet, **Then** it produces identical exit code as before Phase 1
2. **Given** Phase 1 is complete, **When** I inspect production-path scaffolder and validator files, **Then** no existing production-path logic has changed

### US-002: AI continues calling create.sh --level N exactly as today (Priority: P0)

**As a** developer talking to AI about a new feature, **I want** the AI to detect spec-folder need (Gate 3), pick a level, and run `create.sh --level N` exactly as today — without any visible difference in conversation flow, **so that** the implementation is invisible to me as a user.

**Acceptance Criteria**:
1. **Given** the implementation is complete, **When** I have a typical "let's add feature X" conversation with AI, **Then** the AI's responses + actions match pre-implementation conversations byte-identically (modulo the absence of stale empty addon stubs in the resulting packet)
2. **Given** a fresh packet is scaffolded, **When** I inspect generated packet metadata, **Then** it preserves the public Level field and hides private implementation taxonomy

### US-003: Validator error messages stay level-only (Priority: P0)

**As a** developer running `validate.sh` on a Level 3 packet missing `decision-record.md`, **I want** the error to say "Level 3 packet missing required file: decision-record.md" — exactly today's message, **so that** my mental model of the spec-kit doesn't shift.

**Acceptance Criteria**:
1. **Given** a packet missing a required file, **When** `check-files.sh` runs, **Then** the error message contains "Level N" and NEVER mentions "capability" or "preset"
2. **Given** validator rules consume the resolved contract internally, **When** validation fails, **Then** remediation text remains level-only or taxonomy-neutral

### US-004: Phase 4 rollback is one commit (Priority: P0)

**As a** maintainer who needs to revert the entire implementation, **I want** a single `git revert` to restore all 51 deleted files + revert all 18 modified files + remove all 20 added files, **so that** rollback is trivial and risk-free.

**Acceptance Criteria**:
1. **Given** the implementation landed atomically, **When** I run `git revert <impl-commit>`, **Then** the entire system returns to pre-implementation state

---

## 12. OPEN QUESTIONS

- Should Phase 1 ship as a single PR or split into "infra" (resolver + renderer + manifest) and "tests" (4 vitest files + leak fixes)? Tentatively single PR for atomicity.
- Should the workflow-invariance test allowlist be a separate JSON file or inline in the test? Tentatively inline for simplicity; revisit if allowlist grows beyond 10 entries.
- Should we batch-delete the obsolete tests (`test-template-system.js`, `test-template-comprehensive.js`) in Phase 1 (they fail anyway against the new templates) or wait for Phase 4? Tentatively Phase 4 to keep Phase 1 purely additive.

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Resource Map (authoritative file ledger)**: See `resource-map.md`
- **Implementation Plan (phase-by-phase)**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Source design**: `../002-template-greenfield-redesign/research/research.md` (51.4 KB, 17 sections + §18 addendum)
- **ADRs**: `../002-template-greenfield-redesign/decision-record.md` (ADR-001 through ADR-005)
- **Parent Spec**: `../spec.md` (026 graph + context optimization)
