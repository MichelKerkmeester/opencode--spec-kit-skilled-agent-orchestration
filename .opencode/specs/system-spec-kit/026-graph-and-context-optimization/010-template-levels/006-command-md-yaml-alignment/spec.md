---
title: "Feature Specification: command-md-yaml-alignment"
description: "Audit spec_kit command Markdown and YAML workflow assets for stale template-system references, banned public vocabulary leaks, and missing current feature notes."
trigger_phrases:
  - "command md yaml alignment"
  - "spec kit command audit"
  - "workflow yaml audit"
  - "template levels packet 006"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/006-command-md-yaml-alignment"
    last_updated_at: "2026-05-02T06:53:47Z"
    last_updated_by: "codex"
    recent_action: "Initialized Level 3 packet docs for command Markdown and YAML alignment audit"
    next_safe_action: "Run inventory grep across .opencode/command/spec_kit and patch stale command/YAML prose"
    blockers: []
    key_files:
      - ".opencode/command/spec_kit/complete.md"
      - ".opencode/command/spec_kit/deep-research.md"
      - ".opencode/command/spec_kit/deep-review.md"
      - ".opencode/command/spec_kit/implement.md"
      - ".opencode/command/spec_kit/plan.md"
      - ".opencode/command/spec_kit/resume.md"
    session_dedup:
      fingerprint: "sha256:0060060060060060060060060060060060060060060060060060060060060060"
      session_id: "2026-05-02-006-command-md-yaml-alignment"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "Gate 3 answered by user: create new Level 3 spec folder at this packet path"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: command-md-yaml-alignment

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

This packet audits the AI-facing command surfaces for `/spec_kit` after the template-level refactor. The command Markdown files and YAML workflow assets must describe the current manifest-backed Level contract, current validation semantics, and current hardening behavior without preserving deleted script or folder references.

**Key Decisions**: keep the audit boundary identical to packet 005 for stale public vocabulary, and validate every YAML edit before treating the command pipeline as safe.

**Critical Dependencies**: the command files under `.opencode/command/spec_kit/`, the YAML workflow assets under `.opencode/command/spec_kit/assets/`, the workflow-invariance vitest, and strict spec validation.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-02 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The slash-command entry docs and their YAML workflow assets may still mention deleted artifacts such as `compose.sh`, `wrap-all-templates`, legacy template folders, or the old architecture label. They may also miss current command behavior, including `SPECKIT_POST_VALIDATE`, validation exit codes, path traversal rejection, parallel-save locking, fast strict validation, and phase syntax.

YAML files are the higher-risk surface because they drive runtime command behavior. Wrong instructions there propagate across every command invocation instead of staying inside static documentation.

### Purpose
Align the 18 in-scope command assets with the current system so users and AI runtimes receive accurate, parseable, and verification-backed instructions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit and patch 6 command Markdown files under `.opencode/command/spec_kit/`.
- Audit and patch 12 command YAML workflow assets under `.opencode/command/spec_kit/assets/`.
- Remove or rewrite stale references to deleted scripts, deleted folders, and the old architecture label.
- Add current feature notes only where they affect command behavior.
- Validate workflow invariance, YAML parseability, and packet documentation.

### Out of Scope
- Agents, because Phase 4B and Round 3 already cleaned them.
- `AGENTS.md` and `CLAUDE.md`, because they are already cleaned.
- `SKILL.md`, `references/`, and non-command skill assets, because packet 005 just covered them.
- Historical spec folders under `.opencode/specs/`, because they are archived artifacts.
- Private template internals under `templates/manifest/`, except literal directory references when already legitimate.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/spec_kit/complete.md` | Audit/Modify | Remove stale references and add current completion validation behavior where relevant. |
| `.opencode/command/spec_kit/deep-research.md` | Audit/Modify | Remove stale references and align validation/performance notes where natural. |
| `.opencode/command/spec_kit/deep-review.md` | Audit/Modify | Remove stale references and align workflow wording. |
| `.opencode/command/spec_kit/implement.md` | Audit/Modify | Remove stale references and align validation exit semantics where relevant. |
| `.opencode/command/spec_kit/plan.md` | Audit/Modify | Remove stale references and align phase syntax/path-hardening notes where relevant. |
| `.opencode/command/spec_kit/resume.md` | Audit/Modify | Remove stale references and align continuity-save locking notes where relevant. |
| `.opencode/command/spec_kit/assets/spec_kit_*_{auto,confirm}.yaml` | Audit/Modify | Preserve IDs and ordering while correcting stale workflow prose or command strings. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/graph-metadata.json` | Modify | Add this child packet and set it as the last active child. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Remove stale deleted-artifact references from in-scope command assets. | Gate A grep returns zero hits for the stale-pattern expression across `.opencode/command/spec_kit/`. |
| REQ-002 | Preserve YAML workflow structure while editing. | Every edited YAML file parses with `python3 -c "import yaml,sys; yaml.safe_load(open(sys.argv[1]))" <file>`. |
| REQ-003 | Keep runtime workflow semantics stable. | `workflow-invariance.vitest.ts` passes after edits. |
| REQ-004 | Keep the 006 packet valid. | `validate.sh "$PACKET" --strict` exits successfully. |
| REQ-005 | Keep prior sibling packets valid. | Strict validation for 003, 004, and 005 reports zero errors. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Audit all 6 command Markdown files. | Each file is inventoried and either modified or recorded as clean in implementation summary. |
| REQ-007 | Audit all 6 `_auto.yaml` assets. | Each auto YAML is parsed and either modified or recorded as clean in implementation summary. |
| REQ-008 | Audit all 6 `_confirm.yaml` assets. | Each confirm YAML is parsed and either modified or recorded as clean in implementation summary. |
| REQ-009 | Add current feature mentions only where natural. | Implementation summary lists the added mentions and their files, or explains why a feature was not forced. |
| REQ-010 | Document legitimate exemptions. | Runtime workflow manifest usages or literal `templates/manifest/` directory references are recorded as legitimate exemptions if encountered. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero stale-pattern hits remain in `.opencode/command/spec_kit/`.
- **SC-002**: Zero banned public vocabulary leaks remain in user-facing command prose, except allowed literal `templates/manifest/` directory usage and non-template runtime terms.
- **SC-003**: YAML workflow steps reference current commands and paths without changing step IDs or ordering.
- **SC-004**: Newly relevant behavior is mentioned in the command surfaces that naturally need it.
- **SC-005**: `workflow-invariance.vitest.ts` is green.
- **SC-006**: All 12 in-scope YAML files parse cleanly.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | YAML syntax regression | High | Parse each edited YAML file immediately and run full YAML parse gate. |
| Risk | Workflow semantic drift | High | Preserve step IDs, ordering, and structure; run workflow-invariance vitest. |
| Risk | Over-forcing feature mentions | Medium | Add notes only where command behavior is affected. |
| Risk | Misclassifying runtime workflow manifest terms | Medium | Distinguish YAML runtime metadata from spec-kit template manifest references and document exemptions. |
| Dependency | Existing command/YAML assets | High | Read context around every hit before editing. |
| Dependency | Validation scripts and vitest dependencies | High | Retry gates up to 5 times before reporting a critical blocker. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The audit must not introduce slower command workflows; validation references should describe existing fast validation rather than add new loops.

### Security
- **NFR-S01**: Any command docs that show arbitrary `--path` usage should acknowledge traversal rejection when that behavior is relevant.

### Reliability
- **NFR-R01**: YAML assets must stay parseable and structurally stable after prose updates.

---

## 8. EDGE CASES

### Data Boundaries
- Empty grep output: Treat as a pass only after running the command over the full `.opencode/command/spec_kit/` scope.
- Runtime workflow terminology: Classify as legitimate when it refers to YAML command execution metadata rather than spec-kit template internals.

### Error Scenarios
- YAML parse failure: Revert or repair the specific edit before continuing.
- Workflow-invariance failure: Retry with focused fixes up to 5 times, then report `BLOCKED:` only if exhausted.
- Validation warning in strict mode: Treat as a completion blocker and patch documentation evidence.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 19/25 | 18 command assets plus packet docs and parent metadata. |
| Risk | 18/25 | YAML workflows can break command runtime behavior. |
| Research | 13/20 | Requires per-hit classification against current system behavior. |
| Multi-Agent | 0/15 | Single-agent bounded audit. |
| Coordination | 9/15 | Must preserve sibling packet validity and parent metadata. |
| **Total** | **59/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A YAML prose edit changes structure or quoting. | H | M | Validate each edited YAML and all YAML at the end. |
| R-002 | A stale reference is legitimate historical context. | M | M | Read surrounding lines before deleting; classify each hit. |
| R-003 | Banned vocabulary scan flags runtime workflow terms. | M | H | Record runtime-manifest distinctions in implementation summary. |
| R-004 | New-feature notes bloat command docs. | M | M | Add only behavior-affecting notes. |

---

## 11. USER STORIES

### US-001: Command user sees current behavior (Priority: P0)

**As a** spec-kit command user, **I want** command docs to match current scripts and validation behavior, **so that** I can trust slash-command instructions.

**Acceptance Criteria**:
1. **Given** the command docs are audited, **When** stale-pattern grep runs, **Then** it returns zero command-scope hits.
2. **Given** completion/plan/implement docs discuss validation, **When** I read them, **Then** exit semantics are accurate for current `validate.sh`.

---

### US-002: Runtime workflows stay stable (Priority: P0)

**As a** command runtime, **I want** YAML assets to keep structure and parseability, **so that** command invocation pipelines do not break.

**Acceptance Criteria**:
1. **Given** a YAML file is edited, **When** PyYAML parses it, **Then** parsing exits 0.
2. **Given** all command YAML assets are audited, **When** workflow invariance tests run, **Then** the suite passes.

---

### US-003: Future auditor understands exemptions (Priority: P1)

**As a** future maintainer, **I want** legitimate runtime terminology exemptions documented, **so that** later audits do not repeatedly flag the same safe terms.

**Acceptance Criteria**:
1. **Given** a runtime workflow manifest usage is encountered, **When** implementation summary is completed, **Then** the distinction is recorded.
2. **Given** literal `templates/manifest/` is encountered, **When** implementation summary is completed, **Then** the allowed concrete directory usage is recorded.

---

### US-004: Parent packet points to active child (Priority: P1)

**As a** resumed session, **I want** parent graph metadata to point to 006, **so that** continuation starts on the current packet.

**Acceptance Criteria**:
1. **Given** final docs are complete, **When** parent `graph-metadata.json` is read, **Then** `children_ids` includes `006-command-md-yaml-alignment`.
2. **Given** final docs are complete, **When** parent `graph-metadata.json` is read, **Then** `derived.last_active_child_id` is `006-command-md-yaml-alignment`.

---

## 12. OPEN QUESTIONS

- None. The user supplied Gate 3 selection, scope, target path, verification gates, and final reporting format.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
