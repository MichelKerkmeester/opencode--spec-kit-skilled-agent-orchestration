---
title: "Feature Specification: Skill Rename - sk-improve-agent and sk-improve-prompt [042.007]"
description: "Close the rename follow-through for the two improver skills by keeping folder names, changelog paths, and all active references aligned with the shipped command namespace."
trigger_phrases:
  - "042.007"
  - "skill rename"
  - "sk-improve-agent"
  - "sk-improve-prompt"
  - "rename closeout"
importance_tier: "normal"
contextType: "planning"
---
# Feature Specification: Skill Rename - sk-improve-agent and sk-improve-prompt

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

This phase closes the documentation gap around a skill-folder rename that had already shipped in the repo. The two improver skills are now canonically named `sk-improve-agent` and `sk-improve-prompt`, their changelog directories were moved to `14--sk-improve-prompt/` and `15--sk-improve-agent/`, and the live runtime-agent files already use the `improve-agent` naming convention. The packet records that truth so future maintainers can trust the renamed paths without reconstructing the rename from git history.

**Key Decisions**: Canonical `sk-improve-*` skill naming (ADR-001), runtime-agent filename boundary left at `improve-agent` (ADR-002), historical spec-folder slugs preserved as archival identity (ADR-003)

**Critical Dependencies**: Live renamed skill folders at `.opencode/skill/sk-improve-agent/` and `.opencode/skill/sk-improve-prompt/`; renamed changelog directories; live `improve-agent` runtime-agent files across `.opencode/`, `.claude/`, `.gemini/`, and `.codex/`

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-11 |
| **Branch** | `system-speckit/026-graph-and-context-optimization` |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Phase** | 7 of 8 |
| **Predecessor** | `../006-graph-testing-and-playbook-alignment/spec.md` |
| **Successor** | `../008-further-deep-loop-improvements/spec.md` |
| **Handoff Criteria** | Active repo references use the new skill names, renamed folders exist, and Phase 008 can build on the renamed surfaces without alias cleanup work. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The two improver skills were renamed from `sk-agent-improver` and `sk-prompt-improver` to `sk-improve-agent` and `sk-improve-prompt`, but the closeout docs still carried stale metadata, old runtime-agent references, and missing template markers. That left the phase folder out of alignment with the current template contract even though the rename work itself was already complete.

### Purpose
Capture the completed rename as a clean Level 3 phase packet so the phase validates strictly, the renamed paths stay discoverable, and downstream phases can rely on the new canonical skill names without ambiguity.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Document the completed rename of `.opencode/skill/sk-agent-improver/` to `.opencode/skill/sk-improve-agent/`.
- Document the completed rename of `.opencode/skill/sk-prompt-improver/` to `.opencode/skill/sk-improve-prompt/`.
- Document the completed changelog-folder renames for the two skills.
- Verify that active references in commands, agents, README files, descriptions, and advisor routing now use the new names.
- Bring the phase packet itself into current Level 3 template alignment.

### Out of Scope
- Renaming runtime agent filenames such as `.opencode/agent/improve-agent.md` or `.codex/agents/improve-agent.toml` - those already use the current runtime naming convention (see ADR-002).
- Changing behavior in the improver skills - this phase is documentation and rename closeout only.
- Renaming historical spec-folder slugs - historical packet identities stay stable (see ADR-003).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Align the phase specification with the Level 3 contract and completed-state metadata. |
| `plan.md` | Modify | Reflect the delivered rename sequence and verification path using the current template. |
| `tasks.md` | Modify | Record the rename work as completed tasks with evidence. |
| `checklist.md` | Modify | Mark verification items complete with concrete evidence references. |
| `implementation-summary.md` | Modify | Fix metadata, path references, and verification narrative. |
| `decision-record.md` | Create | Record why the new skill names remain canonical and why runtime-agent filenames were left alone. |
| `README.md` | Modify | Repair template-reference links so the packet documentation resolves cleanly. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The packet must describe the shipped skill-folder renames using the new canonical names. | `spec.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` point to `sk-improve-agent` and `sk-improve-prompt` rather than the retired folder names. |
| REQ-002 | The packet must describe the shipped changelog-folder renames. | The documentation names `.opencode/changelog/14--sk-improve-prompt/` and `.opencode/changelog/15--sk-improve-agent/` as the canonical changelog locations. |
| REQ-003 | Runtime-agent references must point to current files. | The phase references `.opencode/agent/improve-agent.md`, `.claude/agents/improve-agent.md`, `.gemini/agents/improve-agent.md`, and `.codex/agents/improve-agent.toml` instead of missing `agent-improver` paths. |
| REQ-004 | The phase packet must satisfy the current Level 3 template contract. | All required template markers, anchors, and section headers exist and validate under `validate.sh --strict`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Verification evidence must show the rename actually landed. | The packet cites concrete evidence for zero old-name residuals, renamed skill directories, renamed changelog directories, and updated advisor or description surfaces. |
| REQ-006 | The phase README must point to live template references. | `README.md` resolves its system-spec-kit template and validation links cleanly. |
| REQ-007 | The rename rationale must be preserved as a decision artifact. | `decision-record.md` captures ADR-001 (canonical naming), ADR-002 (runtime-agent boundary), and ADR-003 (historical slug preservation). |
| REQ-008 | The closeout packet must scope-lock work to the phase folder. | No files outside `007-skill-rename-improve-agent-prompt/` are modified during closeout; `memory/` subfolder remains untouched. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The phase packet validates cleanly as a Level 3 child phase under `validate.sh --strict`.
- **SC-002**: The packet records `sk-improve-agent` and `sk-improve-prompt` as the only active skill names.
- **SC-003**: Runtime-agent references in the phase docs point at the live `improve-agent` files.
- **SC-004**: The rename story is traceable through completed tasks, checklist evidence, and the implementation summary.

### Acceptance Scenarios

1. **Given** a reader opens Phase 007 to understand the rename, **when** they inspect the packet, **then** they see the new skill names and the correct renamed changelog folders throughout the docs.
2. **Given** a maintainer checks runtime-agent references, **when** they review the phase docs, **then** they are pointed at the live `improve-agent` files rather than missing `agent-improver` paths.
3. **Given** strict validation is run on the phase folder, **when** the packet is checked against the Level 3 template, **then** all required sections, anchors, and template-source markers are present.
4. **Given** a future rename audit needs evidence, **when** the maintainer reads `tasks.md`, `checklist.md`, and `implementation-summary.md`, **then** the packet shows the rename counts, residual grep result, and renamed-path verification in one place.
5. **Given** a phase owner opens `decision-record.md`, **when** they scan the ADRs, **then** ADR-001, ADR-002, and ADR-003 each present context, alternatives with scores, consequences, and a Five Checks evaluation.
6. **Given** the scope lock rule for this phase, **when** an auditor greps the git diff for out-of-scope edits, **then** no file outside `007-skill-rename-improve-agent-prompt/` was modified during the closeout and `memory/` is untouched.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The underlying repo rename must remain the source of truth. | High | Keep this packet documentation-only and ground every claim in the existing renamed paths. |
| Risk | Stale references to retired `agent-improver` paths confuse follow-on work. | Medium | Point the phase docs at the live `improve-agent` runtime files only. |
| Risk | The phase packet falls behind current template rules even though the rename itself is done. | Medium | Rebuild the phase docs around the current Level 3 contract and verify with strict validation. |
| Risk | Historical folder slugs may be mistaken for active path requirements. | Low | State explicitly in ADR-003 and in edge cases that historical spec-folder names stay unchanged while active runtime paths use the new names. |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Phase validation remains documentation-only and does not introduce runtime work.
- **NFR-P02**: Reference verification should stay grep-driven and fast enough for packet closeout.

### Security
- **NFR-S01**: The phase must not introduce new secrets or credential-bearing paths into documentation.
- **NFR-S02**: All evidence should reference public repo files or validation commands only.

### Reliability
- **NFR-R01**: The packet should be sufficient for future maintainers to re-check rename correctness without rediscovering the repo history.
- **NFR-R02**: Runtime-agent and skill-path references must stay stable across future closeout passes.

---

## 8. EDGE CASES

### Data Boundaries
- Historical packet folder names still include the retired skill names. The docs must distinguish those historical slugs from active runtime paths (ADR-003).
- The phase folder itself intentionally contains old-name strings because it documents the rename from old to new.

### Error Scenarios
- If a future audit finds old names in active repo files, Phase 007 can no longer be treated as fully complete.
- If runtime-agent references change again, this packet must be updated to avoid sending readers to missing files.

### State Transitions
- If a future packet introduces a second rename, this packet remains the evidence of the 2026-04-11 rename baseline.
- If changelog folders move again, the evidence in this phase must be updated to the new canonical locations.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: 7 (packet-local), LOC: documentation-only, Systems: 1 (phase packet) |
| Risk | 10/25 | Auth: N, API: N, Breaking: N, but reference drift can cascade to downstream audits |
| Research | 6/20 | Rename already shipped; investigation is grep-driven verification only |
| Multi-Agent | 4/15 | Workstreams: 1 (single documentation closeout pass) |
| Coordination | 6/15 | Dependencies: 3 (renamed skill folders, renamed changelog folders, live runtime-agent files) |
| **Total** | **38/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Stale `agent-improver` paths leak back into active packet text | M | L | Strict validation plus direct grep evidence in checklist |
| R-002 | Runtime-agent reference drift across the four runtime directories | M | L | ADR-002 locks the boundary; tasks verify all four runtime paths |
| R-003 | Historical folder slugs misread as active path requirements | L | M | ADR-003 and spec edge cases make the archival-identity rule explicit |
| R-004 | Future rename bypasses this packet and breaks the 2026-04-11 baseline | L | L | Implementation summary and decision record are the update target for any future rename |

---

## 11. USER STORIES

### US-001: Future maintainer audits the rename (Priority: P0)

**As a** future maintainer auditing the improver-skill rename, **I want** the phase packet to document every renamed path in one place, **so that** I do not need to reconstruct the rename from git history.

**Acceptance Criteria**:
1. Given the rename packet, when I open `spec.md` and `implementation-summary.md`, then I see both renamed skill folders and both renamed changelog directories listed as canonical paths.
2. Given the rename packet, when I scan the packet for retired `agent-improver` strings in active path references, then I find none.
3. Given the rename packet, when I read the decision record, then ADR-001, ADR-002, and ADR-003 explain the naming boundaries.

### US-002: Downstream phase owner relies on renamed surfaces (Priority: P0)

**As a** downstream phase owner building on the renamed skills, **I want** the packet to confirm that the four-runtime mirror and the changelog directories already use the new names, **so that** my phase does not re-do the rename work.

**Acceptance Criteria**:
1. Given the packet, when I look at runtime-agent references, then all four runtime files are cited with `improve-agent` naming.
2. Given the packet, when I check the changelog directories, then the packet confirms `14--sk-improve-prompt/` and `15--sk-improve-agent/` as the shipped locations.
3. Given the packet, when I start my downstream phase, then I have no alias cleanup work to do first.

### US-003: Strict validation gate (Priority: P1)

**As a** packet validator, **I want** the phase folder to pass `validate.sh --strict` at Level 3, **so that** the closeout status can be trusted without manual re-inspection.

**Acceptance Criteria**:
1. Given the packet, when strict validation runs, then all anchors, template markers, and section headers are present.
2. Given the packet, when the checklist is inspected, then every completed P0 and P1 item carries concrete evidence.
3. Given the packet, when the validator reports, then the Level 3 contract is fully satisfied.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None. The rename work is complete and this packet only captures the completed-state truth.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`

---

<!--
LEVEL 3 SPEC
- Core + L2 + L3 addendums
- Executive summary, risk matrix, user stories, 5-dim complexity
- ADR-001/002/003 captured in decision-record.md
-->
