---
title: "Feature Specification: Graph Metadata Enrichment"
description: "Close the packet around the already-completed schema v2 enrichment of all 21 per-skill graph-metadata.json files and align the packet docs with live corpus reality."
trigger_phrases:
  - "004-graph-metadata-enrichment"
  - "graph metadata enrichment"
  - "schema v2 derived metadata"
  - "skill metadata closeout"
importance_tier: "important"
contextType: "implementation"
status: complete
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/004-graph-metadata-enrichment"
    last_updated_at: "2026-04-13T14:05:00Z"
    last_updated_by: "gpt-5.4"
    recent_action: "Reframed the packet around the completed schema v2 enrichment and restored the Level 3 scaffold"
    next_safe_action: "Run strict packet validation plus compiler validation to confirm the closeout evidence"
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md", "graph-metadata.json"]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Graph Metadata Enrichment

---

## EXECUTIVE SUMMARY

Phase 004 no longer describes future implementation work. The enrichment already shipped in the live skill corpus: all 21 `.opencode/skill/*/graph-metadata.json` files are on schema version 2, every file contains a populated `derived` block, and the compiler validation command already passes against that corpus.

This packet now documents what was delivered, closes the stale forward-looking language, corrects the corpus count from 20 to 21, updates the example schema to match the live `sk-deep-review` metadata, and records the packet-local decisions that made the rollout backwards-compatible.

**Key Decisions**: Treat this packet as closeout documentation for completed work, keep the schema example aligned to live `sk-deep-review` metadata, and preserve backwards compatibility by keeping the compiler valid for both v1 and v2 metadata.

**Critical Dependencies**: `review/deep-review-findings.md`, `../../../../../skill/sk-deep-review/graph-metadata.json`, `../../../../../skill/skill-advisor/graph-metadata.json`, `../../../../../skill/skill-advisor/scripts/skill_graph_compiler.py`

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-13 |
| **Updated** | 2026-04-13 |
| **Branch** | `026-graph-and-context-optimization` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `001-research-findings-fixes` |
| **Evidence Review** | `review/deep-review-findings.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The implementation work described by this packet was already complete in the repository, but the packet itself still described enrichment as planned future work. That stale framing created five concrete documentation defects: it understated the live corpus at 20 files instead of 21, showed an outdated barebones-v1 current state, used the wrong timestamp field name in the schema example, referenced dead `sk-deep-review` example paths, and omitted the Level 3 decision record while leaving packet metadata malformed.

### Purpose

Record the shipped schema v2 enrichment accurately, restore the active Level 3 packet structure, and make the packet usable as a truthful closeout artifact for the already-enriched 21-file skill metadata corpus.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Reframe packet docs from planned enrichment to completed enrichment.
- Update every packet reference from 20 files to 21 files.
- Correct the `spec.md` schema example to match live `sk-deep-review` metadata, including `last_updated_at`, real `source_docs`, and real `key_files`.
- Add `decision-record.md` with the two rollout ADRs requested by review.
- Normalize packet `graph-metadata.json` so it uses concrete file paths and the validator-required packet schema.
- Mark packet tasks and checklist items complete with evidence tied to live repo state or command output.

### Out of Scope

- Editing any of the live skill `graph-metadata.json` files. They are already correct.
- Changing the shipped schema v2 data model outside packet documentation.
- Reworking the compiled skill graph format beyond documenting the additive enrichment that already shipped.
- Modifying advisor scoring behavior beyond the validation coverage already in place.

### Files in This Packet

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Reframe the packet as completed work and fix the schema example |
| `plan.md` | Modify | Turn the plan into an evidence-backed closeout plan |
| `tasks.md` | Modify | Mark the already-shipped work complete with evidence |
| `checklist.md` | Modify | Convert validation gates into evidence-backed completion checks |
| `decision-record.md` | Create | Record the schema and compiler compatibility decisions |
| `graph-metadata.json` | Modify | Replace the malformed glob-based packet metadata |
| `description.json` | Modify | Reflect completed 21-file enrichment instead of planned 20-file work |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The packet must describe graph metadata enrichment as completed work, not future work | `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` all use complete-state language |
| REQ-002 | The packet must reflect the live 21-file corpus | All packet references to the enrichment target say 21 files, including task and checklist coverage |
| REQ-003 | The canonical schema example must match live `sk-deep-review` metadata | The example uses `last_updated_at`, live `source_docs`, and live `key_files` from `../../../../../skill/sk-deep-review/graph-metadata.json` |
| REQ-004 | Packet metadata must satisfy the packet graph schema and use concrete paths | `graph-metadata.json` contains the required top-level fields plus concrete `derived.key_files` paths, not a glob |
| REQ-005 | The packet must include a Level 3 decision record | `decision-record.md` exists and includes ADR-001 and ADR-002 |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Tasks must show the work as done with evidence | `tasks.md` marks each task `[x]` and cites live repo files or commands |
| REQ-007 | Checklist items must show the work as done with evidence | `checklist.md` marks each checklist item `[x]` and cites live repo files or commands |
| REQ-008 | The packet must use the active Level 3 scaffold | Strict validation no longer fails for missing anchors, missing headers, or missing decision record |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- SC-001: The packet truthfully states that the schema v2 enrichment already exists across 21 live skill metadata files.
- SC-002: The `spec.md` schema example matches the live `sk-deep-review` metadata shape and file references.
- SC-003: `decision-record.md` exists and records the backwards-compatible schema and compiler-validation decisions.
- SC-004: `python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only` passes after the packet rewrite.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `review/deep-review-findings.md` is the review baseline for the stale-packet findings | If the packet diverges from review evidence, the findings remain unresolved | Keep packet changes anchored to the review statements and live corpus reads |
| Dependency | Live `sk-deep-review` metadata remains the canonical example source | If the example diverges again, future packet readers will copy stale paths or fields | Copy the current `source_docs`, `key_files`, and timestamp naming directly from the live file |
| Risk | Packet tasks or checklist items could claim completion without reproducible proof | The packet would look closed while remaining unverifiable | Cite direct file evidence and command invocations for all completed items |
| Risk | A future 22nd skill file could make the fixed 21 count stale again | The packet could become historically correct but operationally outdated | State clearly that 21 is the delivered corpus size for this packet closeout date |
<!-- /ANCHOR:risks -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability

- NFR-M01: Packet docs must use the active Level 3 section headers and anchors so structured retrieval works.
- NFR-M02: The schema example must stay tied to a live source file, not an invented illustrative path set.

### Reliability

- NFR-R01: Completed-state claims must be reproducible from repo reads and command output.
- NFR-R02: Packet metadata must satisfy the validator's packet graph contract every time strict validation runs.

### Traceability

- NFR-T01: Packet docs must point to the review file, the live example metadata file, and the compiler validation entrypoint.

## 8. EDGE CASES

- If a future packet reader compares this packet against a newer corpus with more than 21 skill metadata files, this packet still remains correct for the 2026-04-13 closeout point-in-time.
- If a consumer still reads schema v1-only metadata, the additive `derived` block cannot break that consumer because the original top-level fields remain intact.
- If an operator copies the packet example into new skill metadata, the example must retain `last_updated_at` rather than inventing `last_save_at`.
- If `sk-deep-review` later adds new reference files, packet example paths should be refreshed from the live file rather than amended by hand from memory.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 17/25 | Seven packet artifacts changed, but live runtime files stay untouched |
| Risk | 18/25 | The packet can easily drift from live repo truth if examples or counts are copied inaccurately |
| Research | 7/20 | Review findings and one live metadata example provide the needed evidence |
| Multi-Agent | 5/15 | The work is packet-local and intentionally single-writer |
| Coordination | 9/15 | Packet docs, packet metadata, and validator behavior all need to align |
| **Total** | **56/100** | **Level 3** |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The packet still reads as planned work in one of the packet docs | High | Medium | Rewrite all packet docs together and validate them as a set |
| R-002 | The example schema drifts from live `sk-deep-review` metadata again | Medium | Medium | Use the live file as the only example source |
| R-003 | Packet metadata remains malformed because it keeps the old glob path | High | Low | Replace it with the full packet graph contract and explicit file paths |

## 11. USER STORIES

### US-001: Packet Reader Gets Current Reality

As a future maintainer, I want this packet to describe the enrichment as already delivered, so I do not reopen work that is already complete in the live corpus.

### US-002: Packet Reader Gets a Trustworthy Example

As an operator, I want the schema example to mirror the live `sk-deep-review` metadata, so I can reuse the example without copying dead paths or wrong field names.

### US-003: Reviewer Gets a Closed Level 3 Packet

As a reviewer, I want this packet to include the required decision record and valid packet metadata, so strict validation and session recovery can trust it.

### Acceptance Scenarios

1. **Given** the live corpus already contains 21 schema v2 metadata files, **when** the packet is read, **then** it describes the enrichment in the past tense and marks the packet complete.
2. **Given** the earlier packet counted 20 files, **when** the packet is updated, **then** all task and checklist references now say 21.
3. **Given** the old example used `last_save_at`, **when** the example is refreshed from live `sk-deep-review` metadata, **then** it uses `last_updated_at` and matching `source_docs`.
4. **Given** the old example cited dead protocol reference paths, **when** the packet is updated, **then** those paths are replaced with the live loop_protocol, convergence, and state_format references from the sk-deep-review skill folder.
5. **Given** the Level 3 packet was missing `decision-record.md`, **when** the packet is rewritten, **then** ADR-001 and ADR-002 exist and explain the shipped rollout decisions.
6. **Given** packet metadata previously used a glob path, **when** `graph-metadata.json` is normalized, **then** it contains specific file paths plus the validator-required packet fields.

### AI Execution Protocol

### Pre-Task Checklist

- Read the review findings and every packet doc before editing the packet.
- Treat the live skill metadata files as evidence sources, not edit targets.
- Keep edits limited to this packet's markdown and JSON artifacts.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-SCOPE-004 | Edit only packet docs and packet JSON inside `004-graph-metadata-enrichment/` | Prevents unrelated repo churn |
| AI-TRUTH-004 | Mark completion only from live repo evidence or command output | Prevents false closure claims |
| AI-EXAMPLE-004 | Refresh schema examples from live metadata, not memory | Keeps paths and field names current |
| AI-VALIDATE-004 | End with strict packet validation and compiler validation | Confirms the packet is both structurally and factually closed |

### Status Reporting Format

- Start state: stale planned-state packet, wrong file count, wrong schema example, missing decision record, malformed packet metadata.
- Work state: packet docs rewritten, counts corrected, schema example refreshed, decision record added, packet metadata normalized.
- End state: strict validator result, compiler validation result, and changed-file summary.

### Blocked Task Protocol

1. Stop if a completion claim depends on a live file or command that has not been checked.
2. Leave the related task or checklist item open until evidence exists.
3. Record the gap in packet docs instead of inventing the result.

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None inside packet scope. The remaining work is packet closeout verification, not design discovery.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Review Findings**: `review/deep-review-findings.md`
- **Live Example Metadata**: `../../../../../skill/sk-deep-review/graph-metadata.json`
- **Compiler Validation Entry Point**: `../../../../../skill/skill-advisor/scripts/skill_graph_compiler.py`
