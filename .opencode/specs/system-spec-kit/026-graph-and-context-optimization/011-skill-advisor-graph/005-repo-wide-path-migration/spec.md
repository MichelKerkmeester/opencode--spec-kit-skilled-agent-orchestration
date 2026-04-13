---
title: "Feature Specification: Repo-Wide Path Migration"
description: "Close the packet for the migrated skill-advisor runtime layout, remove stale legacy path wording from active 007 docs, and align packet evidence with the already-shipped repo updates."
trigger_phrases:
  - "005-repo-wide-path-migration"
  - "repo-wide path migration"
  - "skill advisor path cleanup"
  - "packet validation closure"
importance_tier: "important"
contextType: "implementation"
status: complete
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/005-repo-wide-path-migration"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "gpt-5"
    recent_action: "Rebuilt the packet on the active Level 3 scaffold and aligned it with shipped repo state"
    next_safe_action: "Run final strict validation and attach the closeout evidence in implementation-summary.md"
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md", "implementation-summary.md"]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Repo-Wide Path Migration

---

## EXECUTIVE SUMMARY

Phase 005 exists to close the documentation gap left after the skill-advisor path migration already shipped in the repo. The runtime, playbooks, READMEs, changelog note, packet metadata, and validation commands now use the live `skill-advisor/scripts/*` layout, but this packet still described the migration with outdated structure and stale literal legacy path tokens.

This closeout pass restores the packet to the active Level 3 scaffold, adds the missing closeout files, records evidence-backed completion status, and rephrases historical notes inside the broader `011-skill-advisor-graph/` tree so the forbidden legacy literals no longer appear anywhere under that root.

**Key Decisions**: Keep packet edits limited to spec docs and packet JSON, preserve migration history without preserving forbidden literals, and mark completion only from direct repo evidence.

**Critical Dependencies**: `../../../../../skill/skill-advisor/README.md`, `../../../../../skill/README.md`, `../../../../../skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md`, `../../../../../skill/skill-advisor/graph-metadata.json`

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-04-13 |
| **Updated** | 2026-04-13 |
| **Branch** | `026-graph-and-context-optimization` |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Predecessor** | `../003-skill-advisor-packaging/decision-record.md` |
| **Supporting Packet** | `../004-graph-metadata-enrichment/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The repo-wide migration work for the skill-advisor package is already implemented outside this packet, but the packet itself remained structurally invalid and still embedded literal references to the retired layout. That created two real problems: strict packet validation failed, and a grep across `011-skill-advisor-graph/` still surfaced legacy path strings that the user explicitly wanted removed.

### Purpose

Finish Phase 005 by making the packet truthfully describe the shipped migration, restoring template compliance, and removing the forbidden literal legacy tokens from the full `011-skill-advisor-graph/` root without erasing the migration narrative.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite this packet's `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` onto the active Level 3 scaffold.
- Add packet-local `decision-record.md` and `implementation-summary.md`.
- Normalize `graph-metadata.json` to the packet schema expected by strict validation.
- Update packet-local completion tracking so already-shipped work is marked complete only when supported by current repo state.
- Rephrase historical notes inside `../003-skill-advisor-packaging/` so the forbidden legacy literals disappear from the broader `011-skill-advisor-graph/` tree.

### Out of Scope

- Editing any non-spec code, README, playbook, changelog, or runtime file outside the packet-doc and packet-JSON surface.
- Touching `z_archive/` or `z_future/`.
- Reverting the shipped skill-advisor path migration.
- Inventing completion evidence that is not backed by current repo state or direct command output.

### Files in This Packet

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Restore Level 3 structure and current packet truth |
| `plan.md` | Modify | Describe the closeout strategy and evidence flow |
| `tasks.md` | Modify | Mark the shipped work complete with packet-local evidence |
| `checklist.md` | Modify | Convert validation gates into evidence-backed completion checks |
| `decision-record.md` | Create | Record the packet-closeout decisions |
| `implementation-summary.md` | Create | Capture final evidence and remaining limitations |
| `graph-metadata.json` | Modify | Bring packet metadata onto the required schema |
| `description.json` | Modify | Remove forbidden legacy literals from the packet description |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The packet must pass strict validation without error status | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --strict` exits `0` or `1`, never `2` |
| REQ-002 | The packet must contain the full Level 3 document set | `decision-record.md` and `implementation-summary.md` exist and participate in packet metadata |
| REQ-003 | The required template headers and anchors must be restored | `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` include the validator-required headers and ANCHOR pairs |
| REQ-004 | The broader `011-skill-advisor-graph/` tree must not contain the forbidden literal legacy path strings | Scoped grep over `011-skill-advisor-graph/` for the two forbidden patterns returns zero matches |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Packet completion state must reflect the already-shipped repo work accurately | Tasks and checklist items for READMEs, playbooks, changelog note, graph metadata, and runtime verification are marked complete only with current evidence |
| REQ-006 | Historical meaning must be preserved without repeating the forbidden literals | Historical notes describe the retired layout in prose instead of embedding the literal legacy strings |
| REQ-007 | Packet metadata must match the current schema | `graph-metadata.json` includes packet identity fields, manual arrays, and derived trigger/key/source arrays |
| REQ-008 | Packet cross-references must resolve correctly | Packet docs reference sibling packet files or repo files only through valid relative paths or plain-language labels |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- SC-001: Strict validation for `005-repo-wide-path-migration/` exits with warnings at worst.
- SC-002: Grep across `011-skill-advisor-graph/` returns zero matches for both forbidden legacy path patterns.
- SC-003: This packet contains six valid closeout artifacts: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md`.
- SC-004: Completion tracking in `tasks.md` and `checklist.md` matches the shipped repo state for playbooks, READMEs, changelog note, packet metadata, and runtime verification.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `../../../../../skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md` and the playbook snippets must already use the migrated runtime paths | If playbook work was not actually shipped, this packet would overstate completion | Verify current repo state before marking the relevant tasks and checklist items complete |
| Dependency | `../../../../../skill/skill-advisor/README.md` and `../../../../../skill/README.md` must already describe the current layout | If either README still points at the retired layout, packet closeout is not truthful | Use direct repo reads and path checks as evidence |
| Risk | A historical note could reintroduce the forbidden literals inside another 007 packet doc | Grep-zero requirement would still fail | Rephrase legacy references in prose and re-run scoped grep before closeout |
| Risk | Packet docs could claim completion without real validator or runtime proof | The phase would appear closed when it is not | Attach command-backed evidence in checklist and implementation summary only after running the checks |
| Risk | Cross-reference cleanup could break strict packet integrity checks | Validation would remain blocked even after content rewrites | Prefer existing sibling files and correct relative paths, or replace fragile file references with prose |
<!-- /ANCHOR:risks -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability

- NFR-M01: Packet docs must use the active template structure so future closeout passes can rely on standard anchors and section headers.
- NFR-M02: Historical context must remain readable without depending on the retired literal path strings.

### Reliability

- NFR-R01: Packet completion claims must be reproducible through strict validation, scoped grep, and runtime command output.

### Traceability

- NFR-T01: `graph-metadata.json` must list the packet documents and the repo files that anchor the closeout evidence.

## 8. EDGE CASES

- If strict validation still reports warnings after structural repair, the packet may close only if the exit code is `1` and no errors remain.
- If a sibling 007 packet still contains a forbidden literal in a historical note, Phase 005 is not done even if the packet-local validator passes.
- If runtime verification succeeds but README or playbook evidence is missing, the packet remains incomplete because the migration was repo-wide, not packet-local only.
- If the packet needs to mention the retired layout again later, it must use descriptive prose rather than the forbidden literal strings.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Six packet artifacts plus cross-packet historical cleanup under `007/` |
| Risk | 19/25 | Validation, packet integrity, and grep-zero requirements all gate closeout |
| Research | 8/20 | The repo state is already known; this phase is mainly closure and evidence |
| Multi-Agent | 6/15 | Work is packet-local and intentionally single-writer |
| Coordination | 10/15 | Packet docs must match repo changes completed elsewhere |
| **Total** | **61/100** | **Level 3** |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Forbidden legacy literals survive in a sibling 007 packet | High | Medium | Re-run scoped grep across the full 007 root before closeout |
| R-002 | Template restoration misses required anchors or headers | High | Medium | Rewrite on the canonical Level 3 scaffold and validate after each document update |
| R-003 | Packet marks external work complete without evidence | High | Low | Use current repo reads plus runtime command output only |

## 11. USER STORIES

### US-001: Packet Consumer Gets a Valid Closeout Packet

As a future agent, I want this packet to validate cleanly, so I can resume Phase 005 from a trustworthy packet surface.

### US-002: Operator Gets Honest Migration Evidence

As an operator, I want the packet checklist and implementation summary to reflect the shipped repo state, so I can trust the closeout evidence without rereading the whole repository.

### US-003: Historian Keeps the Story Without the Forbidden Literals

As a maintainer, I want historical references to the retired layout preserved in prose, so the migration story survives without breaking the grep-zero requirement.

### Acceptance Scenarios

1. **Given** the packet previously failed strict validation, **when** the Level 3 scaffold is restored, **then** the validator exits without errors.
2. **Given** the repo-wide migration was already shipped, **when** tasks and checklist items are updated, **then** they mark the playbook, README, changelog, metadata, and runtime work complete with evidence.
3. **Given** the packet was missing closeout files, **when** `decision-record.md` and `implementation-summary.md` are added, **then** the Level 3 file set is complete.
4. **Given** historical notes in `011-skill-advisor-graph/` still referred to the retired layout literally, **when** those notes are rephrased, **then** scoped grep returns zero forbidden matches.
5. **Given** packet integrity checks validate file references, **when** packet docs cross-link to sibling artifacts, **then** they use valid relative paths or prose labels only.
6. **Given** runtime verification is part of the completion evidence, **when** the health, compiler validation, and regression commands run, **then** the packet records those checks as passed.

### AI Execution Protocol

### Pre-Task Checklist

- Confirm edits stay inside `011-skill-advisor-graph/` spec docs and packet JSON only.
- Treat runtime, README, playbook, and changelog files as evidence sources, not edit targets.
- Rephrase legacy history without reproducing the forbidden literal path tokens.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-SCOPE-005 | Edit only packet markdown or packet JSON under `011-skill-advisor-graph/` | Prevents repo churn outside the requested scope |
| AI-VALIDATE-005 | Validate after each major spec-doc update | Keeps template drift from accumulating |
| AI-EVIDENCE-005 | Mark completion only from current repo evidence or command output | Prevents false closeout claims |
| AI-GREP-005 | End with zero forbidden matches under the full `011-skill-advisor-graph/` root | Satisfies the explicit user requirement |

### Status Reporting Format

- Start state: packet validation failures, missing files, and known forbidden matches.
- Work state: document rewrites, historical rephrasing, metadata normalization, and validator progress.
- End state: final strict validator result, scoped grep result, and changed-file summary.

### Blocked Task Protocol

1. Stop if a completion claim depends on repo evidence that has not been verified.
2. Leave the related task or checklist item open until proof exists.
3. Record the missing evidence in `implementation-summary.md` instead of guessing.

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None inside packet scope. The remaining work is execution proof, not packet design.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`
- **Parent Packet Summary**: `../implementation-summary.md`
- **Parent Handover**: `../handover.md`
