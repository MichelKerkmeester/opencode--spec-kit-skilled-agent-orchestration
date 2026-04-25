---
title: "Feature Specification: Resource Map Template [system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/spec]"
description: "Introduce a reusable resource-map template, wire it into every level discovery surface, restore local-owner deep-loop artifact placement, and auto-emit filled resource maps at deep-loop convergence."
trigger_phrases:
  - "011-resource-map-template"
  - "resource map template packet"
  - "resource map template and deep loop integration"
  - "reverse parent folders resource map"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-resource-map-template"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "claude-sonnet-4-6"
    recent_action: "Created packet-root Level 3 spec docs synthesizing all three sub-phases"
    next_safe_action: "Run validate.sh --strict to verify all new root docs"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/spec.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/plan.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/tasks.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/implementation-summary.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/checklist.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/decision-record.md"
    session_dedup:
      fingerprint: "sha256:011-resource-map-template-root-spec"
      session_id: "011-resource-map-template-root-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 001 is complete — local-owner artifact placement restored."
      - "Phase 002 is in-progress (85%) — template and discovery surfaces wired."
      - "Phase 003 is complete — convergence-time resource-map emission shipped."
---
# Feature Specification: Resource Map Template

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The 011-resource-map-template packet introduces a lean, level-agnostic `resource-map.md` template that catalogs every file path a spec folder touches, restores the local-owner deep-loop artifact contract broken by an earlier centralized placement policy, and wires automatic resource-map emission into both `sk-deep-research` and `sk-deep-review` at convergence.

**Key Decisions**: Local-owner deep-loop artifact placement (root specs stay root-local; child phases own their own packet folders); resource-map template is optional at every level (no hard block in validate.sh).

**Critical Dependencies**: Phase 001 rollback must complete before Phase 003 can emit resource maps beside the correct resolved paths.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-24 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Reviewers and successor phases had no quick way to answer "what files did this packet touch" without reading `implementation-summary.md` end-to-end or diffing git. Simultaneously, the centralized parent-root deep-loop placement policy had scattered child-phase research and review artifacts away from their owning spec, and there was no automation to fill a path catalog from data that the deep loops already capture per iteration.

### Purpose

Create a first-class, reusable `resource-map.md` template discoverable across all levels, restore the correct local-owner artifact placement policy for deep loops, and make autonomous deep-loop runs auto-emit a filled resource map at convergence with zero additional scan cost.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Phase 001 (001-reverse-parent-research-review-folders)**: Roll back `review-research-paths.cjs` to local-owner resolution; repo-wide migration of misplaced child packets; path-policy tests and docs.
- **Phase 002 (002-resource-map-template-creation)**: New `resource-map.md` template at the templates root; wiring into all five level READMEs, SKILL.md, references, feature catalog, manual testing playbook, CLAUDE.md; `spec-doc-paths.ts` constant update.
- **Phase 003 (003-resource-map-deep-loop-integration)**: Shared extractor `extract-from-evidence.cjs`; integration into both `reduce-state.cjs` scripts at convergence; YAML workflow updates; SKILL.md and command-doc updates; vitest coverage.

### Out of Scope

- Changing convergence math, severity weighting, or iteration budget semantics.
- Making `resource-map.md` mandatory at any spec level (stays optional).
- Backfilling existing spec folders with the template.
- Interim (per-iteration) resource-map emission (P2 defer).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs` | Modify | Local-owner path resolution (Phase 001) |
| `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` | Modify | Convergence-time resource-map emission (Phase 003) |
| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | Modify | Convergence-time resource-map emission (Phase 003) |
| `.opencode/skill/system-spec-kit/templates/resource-map.md` | Create | New cross-cutting template (Phase 002) |
| `.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts` | Modify | Add filename to SPEC_DOCUMENT_FILENAMES (Phase 002) |
| `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs` | Create | Shared evidence extractor (Phase 003) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Local-owner artifact placement restored for deep loops | Child phases resolve packet dirs inside their own `research/` or `review/` folder; root specs stay root-local |
| REQ-002 | `resource-map.md` template exists with ten category sections | File present at templates root with correct frontmatter and SPECKIT_TEMPLATE_SOURCE marker |
| REQ-003 | Shared evidence extractor handles both review and research delta shapes | `extract-from-evidence.cjs` exports `emitResourceMap()` and vitest covers both shapes |
| REQ-004 | Convergence emits `resource-map.md` beside resolved local-owner packet artifacts | Both deep-review and deep-research runs produce `resource-map.md` in the correct local-owner folder |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | All five level READMEs and SKILL.md list the template as optional | Each README mentions the template path and purpose |
| REQ-006 | Opt-out works cleanly for resource-map emission | `--no-resource-map` or `emit: false` skips emission without partial writes |
| REQ-007 | Repo-wide migration moves every misplaced child packet to its owner | No orphaned child packets remain under ancestor/root research or review folders |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Child-phase and sub-phase deep loops write only to local-owner packet folders.
- **SC-002**: Operators can copy `resource-map.md` into any packet and fill path rows grouped by category.
- **SC-003**: Autonomous `/spec_kit:deep-review :auto` and `/spec_kit:deep-research :auto` runs produce a `resource-map.md` with zero extra configuration.
- **SC-004**: `validate.sh --strict` on all three sub-phases exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Phase 003 emitting to wrong paths if Phase 001 rollback is incomplete | High | Phase 003 explicitly depends on Phase 001; blocked until local-owner contract is confirmed |
| Risk | Evidence extraction misclassifies paths from different executor shapes | Medium | Single normalized evidence shape in extractor; per-executor adapters inside reduce-state.cjs |
| Risk | Migration accidentally moves root-owned packets | High | Derive ownership from `specFolder` in config before moving anything |
| Dependency | Phase 001 completion required for Phase 003 | High | Phase 003 spec lists Phase 001 as explicit predecessor |
| Dependency | Phase 002 `resource-map.md` template shape is stable | High | Phase 012 shape locked; Phase 003 extractor output stays backward compatible |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Path resolution stays filesystem-local; no extra repo scans during loop execution.
- **NFR-P02**: Convergence emission adds less than 100ms wall-clock on a 10-iteration run.

### Security
- **NFR-S01**: Extractor is pure string/JSON — no network, no shell-outs, no untrusted data execution.

### Reliability
- **NFR-R01**: Path resolution is deterministic for root, child, nested, and rerun cases.
- **NFR-R02**: If delta files are malformed, convergence continues and logs a `degraded` marker.

---

## 8. EDGE CASES

### Data Boundaries
- Root spec with no ancestor spec: returns root-local `research/` or `review/` directly.
- Zero iterations (loop aborted): emission is skipped and logged.
- Single-iteration loop: resource map is emitted with one row set, still valid.

### Error Scenarios
- Packet missing config but having JSONL state: derive ownership from first parseable JSONL record.
- Conflicting destination during migration: skip move, record conflict, preserve both paths for manual review.
- `resource-map.md` already exists at target: overwrite with new generation.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | 3 sub-phases, 20+ files across scripts, templates, docs, YAMLs |
| Risk | 16/25 | Path-policy rollback, repo-wide migration, convergence plumbing |
| Research | 10/20 | Historical tracing through closure docs; delta shape analysis |
| Multi-Agent | 6/15 | Parallel sub-phase execution |
| Coordination | 8/15 | Phase 001 → Phase 003 sequencing dependency |
| **Total** | **58/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Phase 003 emits to parent-root path if Phase 001 incomplete | H | L | Hard dependency gate in Phase 003 plan |
| R-002 | Migration moves root-owned packets | H | L | Ownership derived from stored `specFolder` before any move |
| R-003 | Evidence extractor misclassifies executor-specific delta shapes | M | M | Normalized input shape; per-executor adapters upstream |
| R-004 | Template docs drift after initial wiring | M | L | Re-grep discovery surfaces for new filename post-merge |

---

## 11. USER STORIES

### US-001: Reviewer needs a flat path catalog (Priority: P1)

**As a** reviewer or successor phase author, **I want** a scannable `resource-map.md` beside the narrative output, **so that** I can answer "what files did this loop touch" without reading every iteration file.

**Acceptance Criteria**:
1. Given a completed deep-review or deep-research run, When I look in the resolved local-owner packet folder, Then `resource-map.md` exists with at least one populated category.

---

### US-002: Deep-loop runs land beside the right spec (Priority: P0)

**As a** operator running `/spec_kit:deep-review` on a child phase, **I want** all artifacts to land in the child phase's own `review/` folder, **so that** history stays beside the owning spec and not an ancestor root.

**Acceptance Criteria**:
1. Given a deep-review run targeting a child phase, When convergence completes, Then `review-report.md` and `resource-map.md` exist inside the child phase's local packet folder.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None blocking. T035 validator deferred on pre-existing out-of-scope packet-doc drift; tracked in Phase 003 tasks.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Sub-phase 001**: See `001-reverse-parent-research-review-folders/spec.md`
- **Sub-phase 002**: See `002-resource-map-template-creation/spec.md`
- **Sub-phase 003**: See `003-resource-map-deep-loop-integration/spec.md`
