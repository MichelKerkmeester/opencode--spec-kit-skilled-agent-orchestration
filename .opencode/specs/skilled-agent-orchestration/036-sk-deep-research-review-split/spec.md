---
title: "Feature Specification: Split sk-deep-research [skilled-agent-orchestration/036-sk-deep-research-review-split/spec]"
description: "The original sk-deep-research skill mixed iterative investigation and iterative code review in one command and one skill package. That overlap made routing, documentation, and runtime wrappers harder to maintain."
trigger_phrases:
  - "deep research review split"
  - "sk-deep-review split"
  - "deep-review command"
  - "split review mode from deep research"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/036-sk-deep-research-review-split"
    last_updated_at: "2026-04-13T10:38:46Z"
    last_updated_by: "copilot"
    recent_action: "Applied follow-up advisor evidence calibration and sibling-edge cleanup"
    next_safe_action: "Keep packet docs synced with any future deep-review or advisor adjustments"
    blockers: []
    key_files:
      - ".opencode/skill/skill-advisor/scripts/skill_advisor.py"
      - ".opencode/skill/sk-deep-review/graph-metadata.json"
      - ".opencode/skill/sk-deep-research/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:036-sk-deep-research-review-split"
      session_id: "036-sk-deep-research-review-split"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Advisor evidence calibration now separates graph-heavy matches and deep sibling edges were removed."
template_source_header: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: Split sk-deep-research Review Mode into sk-deep-review

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Review |
| **Created** | 2026-03-29 |
| **Branch** | `036-sk-deep-research-review-split` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`sk-deep-research` previously handled both investigation workflows and iterative review-mode auditing. The combined skill created naming overlap, mixed trigger phrases, and duplicated review guidance across commands, skill docs, YAML workflows, and runtime wrappers.

That coupling also made it harder to route users correctly. Review requests and research requests shared one command family even though the workflows, artifacts, and success criteria were different.

### Purpose

Separate the review-mode experience into a dedicated `sk-deep-review` skill and `/spec_kit:deep-review` command while keeping `sk-deep-research` focused on iterative investigation only.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Create a standalone `sk-deep-review` skill package with its own command, references, assets, and manual testing playbook
- Remove review-mode behavior and references from `sk-deep-research` so it becomes research-only
- Update routing, runtime wrappers, and top-level documentation so review requests point to the new skill

### Out of Scope

- Building the deferred `render-review-contract` automation script - noted as follow-up work in handover artifacts
- Building deterministic replay harnesses for convergence regression testing - follow-up work, not part of this split

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-deep-review/` | Create | New dedicated review skill package |
| `.opencode/command/spec_kit/deep-review.md` | Create | New review command entrypoint |
| `.opencode/skill/sk-deep-research/` | Modify | Remove review-mode content and keep research-only guidance |
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Modify | Route review keywords to `sk-deep-review` |
| `.agents/commands/spec_kit/deep-review.toml` | Create | Add runtime wrapper for the new command |
| `AGENTS.md`, `CLAUDE.md`, `README.md` | Modify | Update top-level references to the split command/skill structure |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Review mode must move into a dedicated `sk-deep-review` skill package | A separate `.opencode/skill/sk-deep-review/` package exists with review-specific docs and assets |
| REQ-002 | A dedicated `/spec_kit:deep-review` command must replace the old review suffix flow | Users can invoke `/spec_kit:deep-review` instead of `/spec_kit:deep-research:review` |
| REQ-003 | `sk-deep-research` must remove review-mode guidance and remain focused on investigation | Review triggers, references, and command suffix guidance are removed from the research skill |
| REQ-004 | Review routing must point to the new skill in advisor logic and runtime wrappers | Review keywords and runtime command wrappers resolve to `sk-deep-review` |
| REQ-005 | Documentation must reflect the split across command, skill, and top-level reference docs | Root and skill-level docs mention deep-research and deep-review as separate capabilities |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | YAML workflow assets must use the new deep-review naming | Review auto/confirm workflow files are renamed or updated to deep-review naming |
| REQ-007 | Review-mode references must remain internally consistent after the split | Quick reference, convergence, loop protocol, and state format docs point to the correct skill and contract |
| REQ-008 | Changelog and upgrade guidance must explain the breaking command rename | Published release notes tell users to replace `/spec_kit:deep-research:review` with `/spec_kit:deep-review` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A dedicated `sk-deep-review` skill package exists and is referenced as the review entrypoint
- **SC-002**: `/spec_kit:deep-review` replaces `/spec_kit:deep-research:review` in command and documentation surfaces
- **SC-003**: `sk-deep-research` no longer describes review-mode behavior as part of its primary workflow
- **SC-004**: Runtime wrappers and routing docs separate research triggers from review triggers without ambiguity
- **SC-005**: Release notes document the split and call out the command rename as a breaking change

### Acceptance Scenarios

**Given** a user asks for iterative code review, **when** the skill advisor evaluates the request, **then** the request routes to `sk-deep-review` instead of `sk-deep-research`.

**Given** a user runs `/spec_kit:deep-review`, **when** the command loads its runtime wrapper and references, **then** it uses the standalone review skill package rather than the research skill.

**Given** a user opens `sk-deep-research` documentation after the split, **when** they read the usage guidance, **then** they see research-only workflows and cross-references to `sk-deep-review` for auditing.

**Given** a user previously used `/spec_kit:deep-research:review`, **when** they read the changelog or upgrade guidance, **then** they are told to switch to `/spec_kit:deep-review`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Partial split leaves review references inside `sk-deep-research` | Users receive mixed guidance and routing remains ambiguous | Audit command docs, skill references, and wrappers together as one change set |
| Risk | Runtime wrapper and documentation drift | Different runtimes expose different command names or behaviors | Update OpenCode, Claude, Codex, Gemini/Agents wrappers together |
| Dependency | Existing review-mode contract artifacts | Split can regress review guidance if the contract is not preserved | Keep the review contract and related reference set inside the new skill package |
| Dependency | Top-level docs and release notes | Users may miss the rename if only skill-local docs change | Publish changelog and upgrade guidance with the breaking-command note |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The split must not add extra routing hops beyond the normal skill-advisor and command-wrapper selection flow
- **NFR-P02**: Review-mode asset loading remains documentation-driven and file-based, with no new runtime services introduced

### Security
- **NFR-S01**: No credentials, tokens, or environment secrets are introduced by the split
- **NFR-S02**: Command routing remains explicit so users cannot accidentally invoke review flows through deprecated aliases without clear guidance

### Reliability
- **NFR-R01**: Review references and command wrappers must stay consistent across supported runtimes
- **NFR-R02**: Existing research workflows must remain usable after review content is removed from `sk-deep-research`
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Legacy command strings still present in docs or examples: replace or cross-reference them so the rename is discoverable
- Mixed runtime support: ensure wrapper files in each runtime reference the same command and skill names
- Large documentation surface: update both package-local and root-level docs so no stale entrypoints remain

### Error Scenarios
- Review docs moved but command wrapper unchanged: users hit the wrong skill despite correct documentation
- Command renamed but changelog missing: users do not understand the breaking change
- Advisor routing updated in one repo only: public and paired repos diverge in behavior

### State Transitions
- Before split: one skill serves research and review
- After split: `sk-deep-research` serves research, `sk-deep-review` serves review, and docs point between them where needed
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | New skill package, new command, wrapper changes, and broad documentation updates |
| Risk | 14/25 | Breaking command rename and multi-runtime routing consistency matter |
| Research | 8/20 | Existing review contract and handover artifacts reduced uncertainty |
| **Total** | **40/70** | **Level 2 - verification-heavy cross-file split with breaking rename** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the deferred `render-review-contract` automation be tracked in a separate follow-up spec rather than the split workstream?
- Should deterministic replay validation for review convergence be documented as a dedicated follow-up verification spec?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
