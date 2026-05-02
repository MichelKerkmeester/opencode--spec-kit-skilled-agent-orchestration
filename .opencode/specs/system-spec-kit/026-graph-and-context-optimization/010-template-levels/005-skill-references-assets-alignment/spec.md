---
title: "Feature Specification: skill references assets alignment [template:level_3/spec.md]"
description: "Audit the AI-facing system-spec-kit skill documentation surface after the 003 and 004 template and validation packets."
trigger_phrases:
  - "skill references assets alignment"
  - "round 5 skill docs audit"
  - "005 skill refs assets alignment"
importance_tier: "important"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "scaffold/005-skill-references-assets-alignment"
    last_updated_at: "2026-05-02T06:36:10Z"
    last_updated_by: "codex"
    recent_action: "Defined audit scope"
    next_safe_action: "Run inventory and stale-reference sweep"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/SKILL.md"
      - ".opencode/skill/system-spec-kit/references/"
      - ".opencode/skill/system-spec-kit/assets/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-skill-references-assets-alignment"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "Gate 3 answered B with the new packet path in the user prompt"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: skill references assets alignment

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Round 5 audits the remaining AI-facing system-spec-kit documentation surface that earlier cleanup rounds did not cover thoroughly. The packet aligns `SKILL.md`, `references/`, and Markdown assets with the current manifest-backed template and validation system shipped in packets 003 and 004.

**Key Decisions**: stale architecture references are deleted or rewritten; concrete references to the live manifest directory remain allowed.

**Critical Dependencies**: the 004 validation orchestrator and ADRs are treated as current reality.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-02 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Earlier rounds cleaned `.opencode/agent/`, `.opencode/command/spec_kit/`, `AGENTS.md`, `CLAUDE.md`, and three top-level READMEs. The canonical skill entry doc, recursive references, and Markdown assets may still carry stale references to deleted scripts, old template folder names, and the retired architecture label, or may omit newly shipped validation and workflow features.

### Purpose
Bring the remaining AI-facing system-spec-kit docs into alignment with the current Level contract, validation orchestrator, secure scaffold path handling, save locking, and inline rendering workflows.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.opencode/skill/system-spec-kit/SKILL.md`
- `.opencode/skill/system-spec-kit/references/` including hooks, structure, templates, validation, workflows, and root Markdown files
- `.opencode/skill/system-spec-kit/assets/` Markdown files

### Out of Scope
- `.opencode/agent/`, `.opencode/command/spec_kit/`, `AGENTS.md`, and `CLAUDE.md` because Phase 4B and the Round 3 sweep already covered them
- `.opencode/specs/` historical artifacts outside this packet
- `.opencode/skill/system-spec-kit/templates/manifest/` because it is private implementation documentation and explicitly allowlisted

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/SKILL.md` | Modify if needed | Remove stale references and add brief current-feature notes where natural |
| `.opencode/skill/system-spec-kit/references/` | Modify if needed | Align command, validation, template, structure, and workflow docs |
| `.opencode/skill/system-spec-kit/assets/` | Modify if needed | Align Markdown assets with current template and validation reality |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/graph-metadata.json` | Modify | Register the 005 packet as the active child |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Inventory all in-scope Markdown files | Inventory count recorded in implementation summary |
| REQ-002 | Remove or rewrite stale references in scope | Stale-pattern grep returns zero hits in in-scope files |
| REQ-003 | Keep legitimate concrete terms | Allowlisted references are preserved with rationale when ambiguous |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Add current-feature mentions where natural | Relevant references document `SPECKIT_POST_VALIDATE=1`, exit codes, path hardening, validation performance, save locking, batch inline rendering, or phase-mode syntax |
| REQ-005 | Verify workflow invariance | `workflow-invariance.vitest.ts` passes |
| REQ-006 | Validate 005 and regression packets | 005, 003, 004, and sentinel packet validation results recorded |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero stale references to deleted paths or scripts remain in in-scope files.
- **SC-002**: Zero ADR-005 banned-vocabulary leaks remain in user-facing prose, excluding concrete allowlisted directory names and real semantic uses.
- **SC-003**: Newly relevant features are mentioned in the right workflow, validation, template, or asset docs without bloating unrelated pages.
- **SC-004**: Workflow-invariance vitest remains green.
- **SC-005**: All in-scope files remain readable Markdown.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 004 validation ADRs | Current-feature mentions must match shipped behavior | Verify against actual docs and tests before editing |
| Risk | Over-aggressive deletion | Could remove legitimate concrete references such as the live manifest directory | Triage each hit from surrounding context |
| Risk | Documentation bloat | New-feature mentions could make concise workflow docs noisy | Add brief notes only where the feature naturally belongs |
<!-- /ANCHOR:risks -->

---
<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Audit and verification should fit the requested 60 minute wall-clock budget where possible.

### Security
- **NFR-S01**: Docs that mention `create.sh --path` should reflect traversal hardening without implying unsafe path usage.

### Reliability
- **NFR-R01**: Verification evidence must come from actual local commands, not assumed pass states.

---

## 8. EDGE CASES

### Data Boundaries
- Legitimate `templates/manifest/` references must remain when they describe the real directory or `spec-kit-docs.json`.
- The terms `kind` and `capability` may remain when they describe actual MCP, agent, or schema concepts rather than retired template architecture naming.

### Error Scenarios
- If workflow-invariance fails after five retries, report `BLOCKED:` with the failure evidence.
- If another validation gate fails, record the failure and apply the narrowest in-scope fix before retrying.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Recursive documentation audit across skill docs, references, and assets |
| Risk | 14/25 | User-facing agent instructions can silently drift if stale |
| Research | 16/20 | Requires triage of every stale and banned-vocab hit |
| Multi-Agent | 0/15 | Single-agent execution |
| Coordination | 8/15 | Must preserve prior 003 and 004 packet behavior |
| **Total** | **58/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Stale references survive in a low-traffic reference file | M | M | Run recursive grep across all in-scope directories |
| R-002 | Valid concrete terminology gets removed | M | M | Use ADR-001 boundary and record ambiguous decisions |
| R-003 | Validation docs diverge from actual exit codes | H | L | Compare against 004 decision record and local validation commands |

---

## 11. USER STORIES

### US-001: Accurate Skill Entry (Priority: P0)

**As a** runtime agent, **I want** `SKILL.md` to describe the current system-spec-kit workflow, **so that** skill routing leads to valid commands and references.

**Acceptance Criteria**:
1. Given `SKILL.md`, When stale-pattern grep runs, Then no stale deleted-path or retired-architecture references remain.

---

### US-002: Reliable Reference Docs (Priority: P0)

**As a** maintainer, **I want** references to describe the current validation, template, and workflow behavior, **so that** future packets inherit correct operational guidance.

**Acceptance Criteria**:
1. Given `references/`, When the audit grep and manual triage run, Then stale references are removed or rewritten and current features are mentioned where natural.

---

### US-003: Aligned Assets (Priority: P1)

**As a** documentation author, **I want** Markdown assets to match the current template model, **so that** matrices and mappings do not teach deleted folder structures.

**Acceptance Criteria**:
1. Given `assets/`, When the audit completes, Then Markdown assets contain no stale deleted-path references.

---

## 12. OPEN QUESTIONS

- None. The user supplied the packet path, scope, constraints, and verification gates.
<!-- /ANCHOR:questions -->

---

## 13. RELATED DOCUMENTS

- `plan.md` - Three-phase audit plan
- `tasks.md` - File and area task breakdown
- `decision-record.md` - Audit-boundary ADR
- `checklist.md` - Verification gates
- `implementation-summary.md` - Final audit evidence
