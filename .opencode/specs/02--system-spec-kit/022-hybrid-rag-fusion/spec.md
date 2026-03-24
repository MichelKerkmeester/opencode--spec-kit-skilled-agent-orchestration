---
title: "Feature Specification: 022-hybrid-rag-fusion"
description: "Root Level 3+ coordination packet for the Hybrid RAG Fusion program, tracking the live 19-phase tree, 397 total directories under the 022 subtree, and 21 top-level directories at the root."
trigger_phrases:
  - "022 hybrid rag fusion"
  - "hybrid rag fusion root packet"
  - "root packet normalization"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: 022-hybrid-rag-fusion

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## EXECUTIVE SUMMARY

This root packet is the coordination layer for the Hybrid RAG Fusion program. It records the live 19 direct phases under `022`, the current 397 total directories on disk beneath the 022 subtree, the 21 top-level directories visible at the root, and the remaining subtree normalization work without overstating completion.

**Key Decisions**: treat the on-disk tree as the authority for counts and status, use the live `find` totals as the canonical directory counts, and keep the root packet concise while deeper subtree rewrites remain outstanding.

**Critical Dependencies**: direct child packet truth, the already-updated feature catalog and manual testing playbook, and follow-on normalization inside the `001`, `009`, and `015` subtree families.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2025-12-01 |
| **Updated** | 2026-03-24 |
| **Branch** | `main` |
| **Directory Totals** | `397` total directories under `022`; `21` top-level directories from `find ... -maxdepth 1 -type d` |
| **Key Numbered Child Counts** | `001=12`, `007=22`, `008=6`, `009=20`, `011=1`, `015=22` |
| **Feature Catalog Count** | 222 feature files |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 022 root packet had drifted away from the current tree. It mixed current facts with stale synthesized counts, omitted required companion docs, and left multiple direct-child packets without validator-friendly phase navigation.

### Purpose

Provide a concise root packet that records the current 022 tree truth, anchors the 19 direct phases, and makes remaining subtree normalization explicit.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root packet coordination docs for `022-hybrid-rag-fusion`
- Direct-child navigation normalization for phases `002` through `019`
- Current-truth status recording for the 19 direct phases
- Honest recording of residual subtree drift

### Out of Scope
- Runtime code changes
- Deep subtree rewrites beyond the root-facing layer
- Edits under `memory/` or `scratch/`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/spec.md` | Modify | Replace stale synthesis prose with a concise root packet |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/plan.md` | Modify | Keep the root implementation plan aligned with live normalization work |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/tasks.md` | Modify | Track root normalization and subtree follow-up tasks |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/checklist.md` | Modify | Capture validator-backed verification evidence |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/decision-record.md` | Modify | Preserve root-level ADRs for packet truth and scope |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/implementation-summary.md` | Modify | Summarize the current normalization pass truthfully |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-*/spec.md` through `019-*/spec.md` | Modify | Keep direct-child navigation aligned with the live root tree |
<!-- /ANCHOR:scope -->

---

## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-hybrid-rag-fusion-epic/` | Epic sprint family | In Progress |
| 002 | `002-indexing-normalization/` | Indexing and normalization remediation | Complete |
| 003 | `003-constitutional-learn-refactor/` | Constitutional learn refactor | Complete |
| 004 | `004-ux-hooks-automation/` | UX hooks and automation alignment | Complete |
| 005 | `005-architecture-audit/` | Architecture audit | Complete |
| 006 | `006-feature-catalog/` | Feature catalog sync | In Progress |
| 007 | `007-code-audit-per-feature-catalog/` | Feature-catalog code audit umbrella | Complete |
| 008 | `008-hydra-db-based-features/` | Hydra DB and related features | Complete |
| 009 | `009-perfect-session-capturing/` | Session-capturing packet family | Complete |
| 010 | `010-template-compliance-enforcement/` | Template compliance enforcement | Draft |
| 011 | `011-skill-alignment/` | Skill alignment | Complete |
| 012 | `012-command-alignment/` | Command alignment | Complete |
| 013 | `013-agents-alignment/` | Agent alignment | Complete |
| 014 | `014-agents-md-alignment/` | AGENTS.md alignment | Complete |
| 015 | `015-manual-testing-per-playbook/` | Manual testing playbook umbrella | In Progress |
| 016 | `016-rewrite-memory-mcp-readme/` | README rewrite | Complete |
| 017 | `017-update-install-guide/` | Install guide update | Complete |
| 018 | `018-rewrite-system-speckit-readme/` | System Spec Kit README rewrite | Complete |
| 019 | `019-rewrite-repo-readme/` | Repository README rewrite | Complete |

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Root packet includes the required companion docs for Level 3+ work | `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` exist under the 022 root |
| REQ-002 | Root status claims use verified current tree counts | Root docs state `397` total directories under `022`, `21` top-level directories at the root, and numbered child counts `001=12`, `007=22`, `008=6`, `009=20`, `011=1`, `015=22` |
| REQ-003 | Root packet preserves the current truth of phases `009` and `015` | Root docs state that phase `009` has 20 numbered child directories and phase `015` remains in progress because 18 of its 22 numbered child specs are still `Not Started` |
| REQ-004 | Direct child phase refs use validator-friendly forms | Direct child packet specs use a parent link plus explicit neighboring phase references |
| REQ-005 | Root packet includes a live direct-phase map | `PHASE DOCUMENTATION MAP` lists all 19 direct phases with truthful status values |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Root packet records known validation caveats honestly | `spec_validate_local.out` is described as a failed local snapshot, not a clean pass artifact |
| REQ-007 | Root packet stays concise and coordination-focused | Root `spec.md` no longer duplicates deep child implementation history |
| REQ-008 | Root packet includes explicit acceptance-scenario coverage | Root packet contains at least 6 acceptance scenarios for validator coverage |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The 022 root packet acts as a valid coordination layer with the required companion docs.
- **SC-002**: Root docs consistently use the verified `397` / `21` directory totals and the current numbered child counts.
- **SC-003**: Direct child packets `002-019` keep explicit root-facing phase navigation entries.
- **SC-004**: The root packet clearly distinguishes clean facts from unresolved subtree debt.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Direct child packet metadata | Root status can drift again if child packets change silently | Treat child packet docs as the source of truth for status |
| Dependency | Nested subtree cleanup still outstanding | Root-only edits cannot make the entire packet family green | Keep residual debt explicit and bounded |
| Risk | Historical synthesis prose gets mistaken for current truth | Readers may trust stale totals or statuses | Replace prose with concise current-state tables |
| Risk | Direct child packets regress to old names or paths | Phase-link validation will drift again | Standardize one navigation form across the direct-child layer |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Documentation Integrity
- **NFR-D01**: Root packet facts must be derived from the live tree, not historical synthesis prose.
- **NFR-D02**: Root packet wording must separate current truth from unresolved normalization debt.

### Navigation Reliability
- **NFR-N01**: Direct child packets must point to the live parent packet from their own folder context.
- **NFR-N02**: Direct child packets must identify explicit neighboring phases wherever they exist.

### Scope Control
- **NFR-S01**: Root normalization must not mutate nested packet-family content outside the direct-child layer unless the user broadens scope.

---

## 8. EDGE CASES

### Structural Edge Cases
- Phase `001` remains a special case because it owns a nested sprint subtree and needs a deeper normalization pass than the other direct children.
- Phase `015` is not complete despite its umbrella spec metadata: the live subtree has 22 numbered child directories, with 4 `Complete` child specs and 18 `Not Started` child specs.

### Evidence Edge Cases
- `spec_validate_local.out` remains useful as historical debugging context, but not as pass evidence.
- Headline counts intentionally exclude archived and quarantine folders unless called out explicitly.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 21/25 | Root packet rewrite plus 18 direct child navigation edits |
| Risk | 16/25 | High chance of documentation drift if counts or statuses are wrong |
| Research | 14/20 | Requires reconciliation against the on-disk tree and child packets |
| Multi-Agent | 12/15 | Root packet and multiple subtree families need separate passes |
| Coordination | 12/15 | Root truth must stay aligned with runtime docs, catalog, and playbook |
| **Total** | **75/100** | **Level 3+ coordination work** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Root facts drift from child packet reality | High | Medium | Use direct child docs as the authority |
| R-002 | Readers assume root-only cleanup means the full tree is normalized | High | Medium | State residual nested-packet debt explicitly |
| R-003 | Direct child phase links regress again in future edits | Medium | Medium | Preserve one shared navigation contract |

---

## 11. USER STORIES

### US-001: Navigate The Root Packet (Priority: P0)

**As a** maintainer, **I want** the 022 root packet to show the current phase map and counts, **so that** I can trust it as the entry point to the packet family.

**Acceptance Criteria**:
1. Given the root packet, when I open it, then I see the current 19 direct phases plus the live `397` total-directory and `21` top-level-directory counts.

### US-002: Follow Phase Links Reliably (Priority: P0)

**As a** reviewer, **I want** each direct child packet to point back to the root and to its neighboring phases, **so that** phase-link validation can reason about the direct-child layer.

**Acceptance Criteria**:
1. Given any direct child packet from `002` to `019`, when I open it, then it contains consistent parent and neighboring-phase rows.

### US-003: Keep Validation Truthful (Priority: P1)

**As a** future editor, **I want** the root packet to distinguish clean facts from unresolved subtree debt, **so that** I do not over-claim validation health.

**Acceptance Criteria**:
1. Given the root packet, when I read the verification or limitation notes, then failed local snapshots are not presented as success artifacts.

---

### Acceptance Scenarios

1. **Given** the root packet is opened, **When** the metadata table is reviewed, **Then** it reports `397` total directories, `21` top-level directories, and the verified numbered child counts.
2. **Given** the direct phase map is opened, **When** the user scans phases `001` through `019`, **Then** every live direct child appears exactly once with a truthful status.
3. **Given** a reader checks phase `009`, **When** they read the root packet, **Then** they can see that the session-capturing subtree currently has 20 children.
4. **Given** a reader checks phase `015`, **When** they read the root packet, **Then** they see that the umbrella remains `In Progress` because 18 of 22 numbered child specs are still `Not Started`.
5. **Given** a validator inspects the root packet, **When** it evaluates phase-documentation coverage, **Then** the packet includes the expected phase map and acceptance-scenario sections.
6. **Given** a maintainer reads the root verification notes, **When** they encounter `spec_validate_local.out`, **Then** it is clearly described as a failed local snapshot rather than pass evidence.

---

## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Root packet truth review | Maintainer | Pending | 2026-03-21 |
| Direct-child navigation review | Maintainer | Pending | 2026-03-21 |
| Full subtree normalization review | Deferred | Pending | TBD |

---

## 13. COMPLIANCE CHECKPOINTS

### Documentation Compliance
- [ ] Root packet facts match the live 022 tree
- [ ] Direct child packets use normalized phase navigation
- [ ] Root docs do not claim nested subtree completion

### Scope Compliance
- [ ] Only root docs and direct-child packet specs were edited in this pass
- [ ] No runtime code claims were changed without corresponding verified evidence elsewhere

### Pre-Task Checklist
- Read the root packet and any touched direct child packet before editing.
- Preserve the verified counts and status facts already established.
- Keep scope limited to root docs and direct-child phase navigation for this layer.

### Execution Rules
| Rule | Requirement |
|------|-------------|
| ROOT-001 | Root docs stay concise and coordination-focused |
| ROOT-002 | Direct child phase refs use explicit relative paths from the child packet context |
| ROOT-003 | Deeper subtree cleanup is recorded honestly when it remains unresolved |

### Status Reporting Format
- `DONE`: requested root doc or child navigation block landed
- `PARTIAL`: root truth synced but deeper packet-family drift still exists
- `BLOCKED`: subtree-level rewrite needed outside the current pass

### Blocked Task Protocol
1. Record the blocker in `tasks.md`.
2. Keep the root packet truthful about the unresolved area.
3. Defer deeper cleanup to the relevant child packet family.

---

## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Spec maintainers | Packet owners | High | Root packet docs |
| Future reviewers | Validation consumers | High | Root verification notes |
| Runtime maintainers | Downstream implementers | Medium | Child packet links |

---

## 15. CHANGE LOG

### v1.1 (2026-03-21)
Root packet normalized to current tree truth, with explicit phase map, acceptance scenarios, and validator-friendly coordination content.

---

<!-- ANCHOR:questions -->
## 16. OPEN QUESTIONS

- Which nested subtree should be normalized first after the root-facing layer: `001`, `009`, or `015`?
- Should the root packet stay Level 3+ after subtree normalization, or should some governance content move into child packets?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
