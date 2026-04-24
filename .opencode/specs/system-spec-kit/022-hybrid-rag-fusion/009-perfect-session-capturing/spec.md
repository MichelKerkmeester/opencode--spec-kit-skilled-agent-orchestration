---
title: "Feature Specification: Perfect Session [system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/spec]"
description: "Authoritative phase-tree alignment for the current parent pack, including the archived dynamic-capture branch, the shipped/current 011-018 continuation, and the analysis-only architecture audit at 019."
trigger_phrases:
  - "perfect session capturing"
  - "spec 009"
  - "truth reconciliation"
  - "roadmap phases 000 018"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
# Feature Specification: Perfect Session Capturing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

This parent pack now carries one stable audit baseline and one repaired direct-child phase map.

1. Direct child folders under `009-perfect-session-capturing` are the canonical navigation layer for this pack.
2. The retired dynamic-capture follow-up phases now live under `000-dynamic-capture-deprecation/001` through `/005` and need to stay reachable through current parent/child references.
3. The active root continuation after the audit baseline is `011` through `018`, with phases `017` and `018` acting as the live contract/output baseline, `016` retained as historical research context, and `019` reserved for analysis-only architecture work.

**Key Decisions**: Treat the on-disk folder layout as canonical, keep the parent pack audit-first, preserve provenance-heavy `memory/` and `scratch/` artifacts, and repair only authoritative docs plus reusable research guidance.

**Critical Dependencies**: Recursive spec-pack validation, current child-phase metadata, and the direct-child branch layout under `009-perfect-session-capturing`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete (documentation pass) |
| **Created** | 2026-03-08 |
| **Updated** | 2026-03-18 |
| **Branch** | `022-hybrid-rag-fusion/009-perfect-session-capturing` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | [008-hydra-db-based-features](../008-hydra-db-based-features/spec.md) |
| **Successor** | [010-template-compliance-enforcement](../010-template-compliance-enforcement/spec.md) |

---

<!-- ANCHOR:problem -->
<!-- /ANCHOR:metadata -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The parent `009-perfect-session-capturing` pack had already been reconciled through phase `017`, but the recommendation follow-through after that audit needed both implementation work and spec-pack follow-through. The runtime now includes explicit write/index dispositions and typed source capabilities, yet the parent pack still needs to distinguish the current `017`/`018` baseline from archival research context (`016`), archived navigation history (`000`), and still-open retained live-proof work.

### Purpose

Extend the pack truthfully through phase `018`, with `019` serving as an architecture remediation audit only. The parent pack should tell readers what is already reconciled, what is now shipped in runtime, which artifacts are archival context only, and why universal "flawless across every CLI" language is still blocked on retained live proof.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Keep the existing feature/audit content intact while repairing stale current-navigation references.
- Reconcile the six parent Level 3 docs to the actual direct-child layout under `009-perfect-session-capturing/`.
- Add a minimal parent pack for `000-dynamic-capture-deprecation/` so its authoritative child phases have a real recursive-validation parent.
- Update active child metadata and relative links where they still point at removed or moved folders.
- Update reusable research guidance only if it presents stale current-navigation paths.
- Revalidate the parent pack recursively after the documentation repair settles.

### Out of Scope
- Editing `memory/**` or `scratch/**` provenance artifacts.
- Rewriting evidence-heavy research subfolders that are not live navigation docs.
- Reclassifying runtime completion, live-proof closure, or historical implementation truth beyond what the current folder layout already proves.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/spec.md` | Modify | Extend the parent roadmap through `018`, with `019` as an architecture audit |
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/plan.md` | Modify | Align the parent plan to the shipped runtime follow-up and open proof work |
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/tasks.md` | Modify | Track shipped `018` work and `019` architecture audit |
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/checklist.md` | Modify | Record runtime, doc, and validation evidence for the roadmap extension |
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/decision-record.md` | Modify | Record the shipped/open roadmap decision |
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/implementation-summary.md` | Modify | Summarize the shipped follow-up truthfully |
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/{spec,plan,tasks}.md` | Create | Add the missing parent spec docs for the archived dynamic-capture branch |
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/011-template-compliance/*.md` | Modify | Align predecessor/successor references to the current root phase chain |
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/012-auto-detection-fixes/*.md` | Modify | Align predecessor/successor references to the current root phase chain |
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/013-spec-descriptions/*.md` | Modify | Align predecessor/successor references to the current root phase chain |
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/014-stateless-quality-gates/*.md` | Modify | Replace stale `017-*` identity references and dead validation paths |
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-runtime-contract-and-indexability/*.md` | Modify | Replace stale `018-*` identity references with the current phase path |
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/{spec,research}.md` | Modify | Restore current spec-folder identity and parent back-references |
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/017-json-primary-deprecation/*.md` | Modify | Add current parent/predecessor/successor metadata |
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/018-memory-save-quality-fixes/*.md` | Modify | Renumber the merged remediation successor from `022` to `018` and align current-navigation metadata |
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/001-005/*.md` | Modify | Align moved child-phase identity fields and current-navigation references |
<!-- /ANCHOR:scope -->

---

## 4. PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder.

| Phase | Folder | Theme | Current State | Recommendation |
|-------|--------|-------|---------------|----------------|
| 000 | `000-dynamic-capture-deprecation/` | Archived dynamic-capture follow-up branch | Active parent branch for moved phases `001` through `005` | `keep` |

**Note:** Phase 000 contains its own child phases (001-session-source-validation through 005-live-proof-and-parity-hardening) which are distinct from root-level phases 001-005.

| 001 | `001-quality-scorer-unification/` | Quality score normalization and scorer ownership | Shipped and retained in audit history | `keep` |
| 002 | `002-contamination-detection/` | Contamination detection and scoring penalties | Shipped and retained in audit history | `keep` |
| 003 | `003-data-fidelity/` | Normalization and data-loss visibility | Shipped and retained in audit history | `keep` |
| 004 | `004-type-consolidation/` | Canonical shared types | Shipped and retained in audit history | `keep` |
| 005 | `005-confidence-calibration/` | Confidence extraction and calibration | Shipped and retained in audit history | `keep` |
| 006 | `006-description-enrichment/` | Description quality and enrichment | Shipped, with heuristic quality limits still noted in the audit | `keep` |
| 007 | `007-phase-classification/` | Phase classification and routing | Shipped and retained in audit history | `keep` |
| 008 | `008-signal-extraction/` | Signal extraction and evidence quality | Shipped and retained in audit history | `keep` |
| 009 | `009-embedding-optimization/` | Embedding prep and retrieval weighting | Shipped and retained in audit history | `keep` |
| 010 | `010-integration-testing/` | End-to-end workflow integration | Shipped and retained in audit history | `keep` |
| 011 | `011-template-compliance/` | Template and validator compliance | Shipped, but compliance can regress when docs drift | `add verification` |
| 012 | `012-auto-detection-fixes/` | Auto-detection corrections | Shipped and retained in audit history | `keep` |
| 013 | `013-spec-descriptions/` | Description infrastructure and filename/indexability | Shipped, with parity and collision proof still worth refreshing | `add verification` |
| 014 | `014-stateless-quality-gates/` | Stateless quality gates and structured-input parity | Runtime shipped and current docs retained | `keep` |
| 015 | `015-runtime-contract-and-indexability/` | Validation rule metadata and write/index disposition policy | Runtime shipped and phase docs reconciled | `keep` |
| 016 | `016-json-mode-hybrid-enrichment/` | JSON-mode hybrid enrichment | Runtime phase shipped; `research/research.md` is archival context, not the live contract baseline | `keep` |
| 017 | `017-json-primary-deprecation/` | JSON-primary deprecation and dynamic-capture recovery posture | Runtime shipped; current contract baseline | `keep` |
| 018 | `018-memory-save-quality-fixes/` | Research-remediation merged Wave 1 + Wave 2 | Runtime shipped; current output baseline | `keep` |
| 019 | `019-architecture-remediation/` | Architecture remediation audit (analysis-only) | Active architecture audit | `keep` |

### Phase Transition Rules

- The parent pack remains the integrated roadmap and audit entry point.
- Shipped runtime claims belong only to phases with direct code, test, and documentation evidence.
- `000-dynamic-capture-deprecation/` groups the moved child phases that no longer live as direct children of the parent pack.
- All phases 000-019 are direct children of this parent pack. The historical audit chain covers 001-010. The active continuation chain covers 011-018. Phase 019 is an architecture audit only.
- Recursive validation proves structural integrity of the spec tree, not universal live parity across all CLIs.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| 010 | 011 | Integration testing complete, template compliance needed | Validation passes |
| 013 | 014 | Spec descriptions settled, quality gates needed | Description infrastructure validated |
| 014 | 015 | The stateless quality-gate hardening now feeds the explicit write/index contract phase | Runtime tests and phase docs agree on the current root-phase boundary |
| 015 | 016 | JSON-mode enrichment builds on the shipped runtime-contract phase | Runtime tests and phase docs agree on the current root-phase boundary |
| 016 | 017 | JSON-mode hybrid enrichment shipped, deprecation needed | Runtime tests pass |
| 017 | 018 | The merged research-remediation successor continues after the JSON-primary deprecation baseline settles | Parent and child docs agree on the merged remediation boundary |

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The parent phase map must reflect the actual direct-child folder layout | `spec.md` names `000`, `001`-`018`, and the archived branch with truthful status language |
| REQ-002 | The archived dynamic-capture branch must have a valid parent pack | `000-dynamic-capture-deprecation/` contains template-compliant `spec.md`, `plan.md`, and `tasks.md` |
| REQ-003 | Active child specs must resolve current identity and navigation fields | In-scope child docs use the current `Spec Folder`, `Branch`, predecessor/successor, and parent references |
| REQ-004 | Reusable research guidance must avoid stale current-navigation paths | Top-level research guidance is either already current or updated selectively |
| REQ-005 | Recursive strict validation must pass for the full parent pack | `validate.sh --strict --recursive` passes after the documentation updates |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The six parent Level 3 docs must reference the current phase tree consistently | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` tell the same navigation story |
| REQ-007 | Live-proof claims must remain intentionally conservative | The docs do not overclaim parity closure while the archived branch and retained proof remain historical |
| REQ-008 | Existing audit truth must remain intact | Earlier phases still read as reconciled history rather than being rewritten as new implementation work |
| REQ-009 | The parent pack must point readers toward the correct direct-child and branch-parent docs | Root docs link readers to the current root phases and the `000-dynamic-capture-deprecation/` parent |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- **SC-001**: Given a maintainer opens the parent pack, they see the actual direct-child tree through `018`, with `019` as an architecture audit.
- **SC-002**: Given a maintainer opens `000-dynamic-capture-deprecation/`, they can navigate to the moved child phases through a valid branch parent.
- **SC-003**: Given a reviewer opens any updated child spec, its identity fields and parent/predecessor/successor references match the on-disk layout.
- **SC-004**: Given a reviewer asks whether multi-CLI proof is fully closed, the docs still answer conservatively.
- **SC-005**: Given recursive strict validation is rerun, the parent pack validates cleanly.
- **SC-006**: Given a stale-reference sweep is rerun on in-scope docs, only intentional historical mentions remain.
- **SC-007**: Given future work resumes, maintainers can tell which direct child or archived branch phase owns the next relevant document trail.

### Acceptance Scenarios

1. **Given** the parent pack after this pass, **when** a maintainer reads the phase map, **then** the direct-child folders shown in `spec.md` exist on disk.
2. **Given** the updated root docs, **when** a reviewer compares their claims, **then** they describe the same current branch/root navigation story.
3. **Given** `000-dynamic-capture-deprecation/`, **when** a reviewer opens its parent docs, **then** the moved child phases resolve under a valid parent.
4. **Given** an updated child phase doc, **when** a reviewer checks identity metadata and adjacent links, **then** they point to existing current docs.
5. **Given** reusable research guidance, **when** a reviewer opens it, **then** it does not present stale current-navigation paths.
6. **Given** the updated parent pack, **when** recursive strict validation runs, **then** the tree passes without dead current-navigation references or missing branch-parent docs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing audit narrative and `research/research.md` | High | Treat them as the preserved truth baseline while extending the phase map |
| Dependency | Focused session-capturing tests and build | High | Use them as the evidence base for phase `018` |
| Risk | Parent docs flatten implemented and open work into one status | High | Keep `018` as the last implementation phase. Phase `019` is an architecture audit. |
| Risk | Child folders exist but parent docs stay inconsistent | High | Reconcile all six root markdown files in the same pass |
| Risk | Validation passes while wording still implies universal parity closure | Medium | Keep live-proof caveats explicit in parent docs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:requirements -->
## 8. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: This pass must not introduce unsupported runtime performance claims.

### Security
- **NFR-S01**: The shipped runtime and doc changes must not weaken published contamination, save-path, or foreign-spec safety language.

### Reliability
- **NFR-R01**: Every implementation-status statement for phase `018` must be traceable to shipped code, tests, or retained-proof evidence and must remain conservative about live proof. Phase `019` is analysis-only.

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

### Data Boundaries
- A child phase can document shipped runtime work without implying retained live proof is closed.
- Recursive validation is necessary for structural truth but does not replace retained live proof.
- The parent pack must preserve prior audit truth while still adding new forward-looking proof work.

### Error Scenarios
- The parent phase map could extend beyond `018` while one or more child docs still contain contradictory shipped/open status language.
- The roadmap could quietly slip back into all-planned or all-complete language if the parent docs are only partially reconciled.
- Live proof could still be missing even if all documentation validates cleanly.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Technical complexity | 4/5 | Runtime, tests, operator docs, and parent-pack reconciliation |
| Verification complexity | 4/5 | Requires focused Vitest proof, build, and recursive validation |
| Coordination complexity | 4/5 | Runtime, operator docs, and three child phases must stay aligned |
| Operational risk | 4/5 | Overclaiming live-proof closure would mislead future implementation work |

<!-- /ANCHOR:complexity -->
---

## 11. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Parent docs blur the difference between shipped runtime work and open proof work | H | M | Keep `018` as the last implementation phase; `019` is an architecture audit |
| R-002 | Child docs are created but parent roadmap still ends at `017` in some files | H | M | Update all six root markdown files together |
| R-003 | Validator passes while live-proof wording becomes too strong | M | M | Keep proof closure limited to retained artifacts |
| R-004 | New roadmap phases obscure the previous audit baseline | M | L | Preserve `001` through `017` as the reconciled history in the phase map |

---

## 12. USER STORIES

### US-001: See The Full Roadmap (Priority: P0)

**As a** maintainer, **I want** one parent pack that runs from phase `001` through `018`, **so that** I can see both the audited history and the shipped follow-up work in one place, with `019` as the architecture audit.

**Acceptance Criteria**:
1. Given the parent pack, when reviewed, then phases through `018` appear in the phase map with truthful shipped status, and `019` is documented as an architecture audit.

### US-002: Trust The Phase Status (Priority: P0)

**As a** maintainer, **I want** runtime and proof work to be labeled accurately, **so that** I do not mistake shipped automation work for retained live-proof closure.

**Acceptance Criteria**:
1. Given phase `018`, when opened, then it is clearly documented as the last implemented runtime follow-up.
2. Given phase `019`, when opened, then it is clearly documented as an architecture remediation audit (analysis-only, not implementation).

### US-003: Keep Proof Claims Honest (Priority: P1)

**As a** reviewer, **I want** live-proof language to remain conservative, **so that** validation-clean docs do not overstate multi-CLI parity.

**Acceptance Criteria**:
1. Given the parent pack, when reviewed, then live retained proof is still described as an open requirement for universal CLI claims.

---

<!-- ANCHOR:questions -->
## 13. OPEN QUESTIONS

- Should future parent-pack updates require a retained-artifact refresh before any phase that touches CLI parity can be marked complete?
- Should future retained live-proof work split artifacts into one artifact per CLI and mode instead of one shared proof bundle?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research Synthesis**: `research/research.md`
- **Archived Branch Parent**: `000-dynamic-capture-deprecation/spec.md`
- **Phase 014**: `014-stateless-quality-gates/spec.md`
- **Phase 015**: `015-runtime-contract-and-indexability/spec.md`
- **Phase 016**: `016-json-mode-hybrid-enrichment/spec.md`
- **Phase 017**: `017-json-primary-deprecation/spec.md`
- **Phase 018**: `018-memory-save-quality-fixes/spec.md`
- **Phase 019**: `019-architecture-remediation/spec.md`

---

### Phase Navigation

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Previous Phase** | ../008-hydra-db-based-features/spec.md |
| **Next Phase** | ../010-template-compliance-enforcement/spec.md |
