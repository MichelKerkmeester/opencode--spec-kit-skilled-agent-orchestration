---
title: "Feature Catalog Comprehensive Audit & Remediation"
status: "in-progress"
level: 3
created: "2025-12-01"
updated: "2026-03-08"
---
# Feature Catalog Comprehensive Audit & Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The Spec Kit Memory MCP server's feature catalog (~180 snippet files across 20 categories) has accumulated documentation drift: inaccurate descriptions, invalid code paths, and 55 undocumented capabilities discovered by a prior 10-agent scan. This spec covers the full audit and remediation: verifying every existing feature against source code, investigating all gaps, and producing corrected documentation.

**Key Decisions**: 30-agent partitioned research (20 verification + 10 gap investigation), 3-tier significance classification

**Critical Dependencies**: MCP server source code (`mcp_server/`), existing feature catalog snippets

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2025-12-01 |
| **Branch** | `main` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
The feature catalog documents ~180 features but a 10-agent scan found 55 genuine undocumented gaps (17 high, 25 medium, 13 low significance). Existing entries may have stale descriptions or invalid file paths due to ongoing MCP server development. There is no systematic verification that catalog descriptions match actual source code behavior.

### Purpose
Achieve a fully verified, accurate feature catalog where every feature has correct descriptions matching source code behavior, valid file paths resolving to existing files, and complete coverage of all MCP server capabilities.

---

## 3. SCOPE

### In Scope
- Verify all ~180 existing feature snippet files against source code
- Validate all `## Source Files` paths exist on disk
- Investigate and document all 55 known undocumented gaps
- Discover any new gaps not found in the prior scan
- Produce remediation manifest with prioritized action items

### Out of Scope
- Actual remediation edits to snippet files (separate follow-up phase)
- Restructuring the 20-category taxonomy
- Changes to MCP server source code
- Updating the monolithic `feature_catalog.md` (done after snippet remediation)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `011-feature-catalog/spec.md` | Modify | Rewrite for L3 audit scope |
| `011-feature-catalog/tasks.md` | Modify | New task breakdown |
| `011-feature-catalog/plan.md` | Create | L3 implementation plan |
| `011-feature-catalog/checklist.md` | Create | Audit verification checks |
| `011-feature-catalog/decision-record.md` | Create | 3 ADRs |
| `011-feature-catalog/description.json` | Modify | Update level to 3 |
| `011-feature-catalog/scratch/verification-C*.md` | Create | 20 agent outputs |
| `011-feature-catalog/scratch/investigation-X*.md` | Create | 10 agent outputs |
| `011-feature-catalog/scratch/remediation-manifest.md` | Create | Synthesis output |
| `011-feature-catalog/scratch/analysis-summary.md` | Create | Statistics |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every snippet file verified by at least one agent | 20 verification reports covering all 20 categories |
| REQ-002 | All `## Source Files` paths validated | Zero paths pointing to non-existent files |
| REQ-003 | All 55 known gaps investigated | Each gap classified as CONFIRMED_GAP, NEW_GAP, or FALSE_POSITIVE |
| REQ-004 | Remediation manifest produced | Prioritized action items with P0/P1/P2 classification |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Description accuracy >95% | <10 features with materially inaccurate descriptions |
| REQ-006 | Cross-validation between verification and gap streams | Overlapping findings reconciled |
| REQ-007 | Analysis summary with aggregate statistics | Category-level pass/fail counts |

---

## 5. SUCCESS CRITERIA

- **SC-001**: All 180 feature snippets have been read and verified against source code
- **SC-002**: All 55 gaps have a confirmed status (gap/false-positive) with evidence
- **SC-003**: Remediation manifest exists with zero unclassified findings
- **SC-004**: All file paths in existing snippets resolve to real files on disk

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | MCP server source (`mcp_server/`) | Verification impossible without source | Source tree exists and is stable |
| Risk | Agent rate limiting (30 concurrent) | Partial results | Stagger launches 3-5s apart |
| Risk | Source files moved since last annotation | False invalid paths | Agents report both invalid and new paths |
| Risk | Context window overflow in agents | Incomplete verification | Partition into manageable chunks per agent |

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Accuracy
- **NFR-A01**: Description accuracy target >95% across all verified features
- **NFR-A02**: 100% of file paths must resolve to existing files

### Coverage
- **NFR-C01**: All 20 categories verified by at least one agent
- **NFR-C02**: All 55 known gaps addressed (no gap left uninvestigated)

### Completeness
- **NFR-X01**: Each verification report follows the structured output format
- **NFR-X02**: Remediation manifest covers every finding from both streams

---

## 8. EDGE CASES

### Data Boundaries
- Features with no source files (governance, decisions, flags): Verify special-case markers are correct
- Features with 20+ transitive dependencies: Verify only direct implementation files are relevant

### Error Scenarios
- Agent fails mid-verification: Report covers partial results, remaining features flagged as unverified
- Source file deleted since annotation: Flagged as PATH-VALIDATE P0 in manifest

### State Transitions
- Gap confirmed as already documented: Mark as FALSE_POSITIVE with evidence pointer
- Verification finds new gap not in 55-list: Add as NEW_GAP with full details

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | 180 snippet files, ~216 source files, 20 categories |
| Risk | 10/25 | No code changes, documentation-only, reversible |
| Research | 18/20 | Deep source code verification across entire codebase |
| Multi-Agent | 15/15 | 30 concurrent agents in 2 streams |
| Coordination | 12/15 | Cross-stream validation, manifest synthesis |
| **Total** | **75/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Rate limits block agent launches | M | M | Stagger 3-5s apart |
| R-002 | Source code changed during audit | L | L | Snapshot-based verification |
| R-003 | Agent produces incomplete report | M | M | Structured output format enforced |
| R-004 | False positives inflate gap count | L | M | Cross-stream validation in Phase C |

---

## 11. USER STORIES

### US-001: Complete Feature Verification (Priority: P0)

**As a** catalog maintainer, **I want** every feature snippet verified against actual source code, **so that** I can trust the catalog descriptions are accurate.

**Acceptance Criteria**:
1. Given a feature snippet, When an agent reads both the snippet and its source files, Then it produces a structured accuracy report

### US-002: Gap Documentation (Priority: P0)

**As a** catalog maintainer, **I want** all 55 undocumented gaps investigated with draft descriptions, **so that** I can add them to the catalog.

**Acceptance Criteria**:
1. Given a gap from the scan, When an agent reads the source files, Then it produces a confirmed status and draft description

### US-003: Remediation Roadmap (Priority: P1)

**As a** catalog maintainer, **I want** a prioritized remediation manifest, **so that** I can fix issues in order of importance.

**Acceptance Criteria**:
1. Given all agent reports, When findings are synthesized, Then each finding has an action category and priority

---

## 12. OPEN QUESTIONS

- None currently — the 10-agent scan provided sufficient baseline data

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Prior Scan Results**: See `undocumented-features-scan.md`
