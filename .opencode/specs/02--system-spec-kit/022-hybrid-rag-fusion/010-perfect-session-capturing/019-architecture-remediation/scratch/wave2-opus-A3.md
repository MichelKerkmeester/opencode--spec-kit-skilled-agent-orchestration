# Wave 2 - OPUS-A3: Phase Tree & Metadata Consistency
Date: 2026-03-21

## Phase Inventory

### Top-Level Phases (000-019 under 010-perfect-session-capturing)

| Phase ID | Title | desc.json status | spec.md status | Denominator in spec.md | Issues |
|----------|-------|------------------|----------------|----------------------|--------|
| 000 | Dynamic Capture Deprecation | in-progress | In Progress | N/A (consolidation) | -- |
| 001 | Quality Scorer Unification | complete | Complete | "Phase 1" (no denominator) | -- |
| 002 | Contamination Detection | NOT SET | Complete | "Phase 2" (no denominator) | STATUS_MISMATCH |
| 003 | Data Fidelity | NOT SET | Complete | "Phase 3" (no denominator) | STATUS_MISMATCH |
| 004 | Type Consolidation | NOT SET | Complete | "Phase 4" (no denominator) | STATUS_MISMATCH |
| 005 | Confidence Calibration | NOT SET | Complete | "Phase 5" (no denominator) | STATUS_MISMATCH |
| 006 | Description Enrichment | NOT SET | Complete | "Phase 6" (no denominator) | STATUS_MISMATCH |
| 007 | Phase Classification | complete | Complete | "Phase 7" (no denominator) | -- |
| 008 | Signal Extraction | NOT SET | Complete | "Phase 8" (no denominator) | STATUS_MISMATCH |
| 009 | Embedding Optimization | NOT SET | Complete | "Phase 9" (no denominator) | STATUS_MISMATCH |
| 010 | Integration Testing | NOT SET | Complete | "Phase 10" (no denominator) | STATUS_MISMATCH |
| 011 | Template Compliance | NOT SET | Complete | "Phase 12" (WRONG NUMBER) | STATUS_MISMATCH, DENOMINATOR |
| 012 | Auto-Detection Fixes | NOT SET | Complete | "Phase 13" (WRONG NUMBER) | STATUS_MISMATCH, DENOMINATOR |
| 013 | Spec Descriptions | NOT SET | Complete | "Phase 14" (WRONG NUMBER) | STATUS_MISMATCH, DENOMINATOR |
| 014 | Stateless Quality Gates | NOT SET | Complete | "Phase 17" (WRONG NUMBER) | STATUS_MISMATCH, DENOMINATOR |
| 015 | Runtime Contract & Indexability | complete | Complete | (none) | -- |
| 016 | JSON Mode Hybrid Enrichment | NOT SET | Complete | (none) | STATUS_MISMATCH |
| 017 | JSON-Primary Deprecation | NOT SET | Complete | (none) | STATUS_MISMATCH |
| 018 | Memory Save Quality Fixes | complete | Complete | (none) | -- |
| 019 | Architecture Remediation | NOT SET | In Progress | (none) | STATUS_MISMATCH, MISSING_FROM_INDEX |

### Sub-Children under 000-dynamic-capture-deprecation

| Phase ID | Title | desc.json status | spec.md status | Denominator | Issues |
|----------|-------|------------------|----------------|-------------|--------|
| 000/001 | Session Source Validation | NOT SET | Complete | "1 of 3" (should be "of 5") | STATUS_MISMATCH, DENOMINATOR |
| 000/002 | Outsourced Agent Handback | NOT SET | Complete | "2 of 3" (should be "of 5") | STATUS_MISMATCH, DENOMINATOR |
| 000/003 | Multi-CLI Parity | NOT SET | Complete | "3 of 3" (should be "of 5") | STATUS_MISMATCH, DENOMINATOR |
| 000/004 | Source Capabilities & Structured Preference | NOT SET | Complete | (none) | STATUS_MISMATCH |
| 000/005 | Live Proof & Parity Hardening | NOT SET | In Progress | (none) | STATUS_MISMATCH |

---

## Findings

### STATUS_MISMATCH: Missing `status` field in description.json (15 phases)

FINDING-OPUS-A3-001 | HIGH | STATUS_MISMATCH | Multiple files | 15 out of 20 top-level description.json files and all 5 sub-children are missing the `status` field entirely, while their corresponding spec.md files declare explicit status (Complete or In Progress). Only 5 phases have the status field set: 000 (in-progress), 001 (complete), 007 (complete), 015 (complete), 018 (complete). | Evidence: `grep -c '"status"' */description.json` returns 5 hits out of 20 | Recommended fix: Backfill `status` field in all 15 missing description.json files to match their spec.md status. Phases confirmed complete in spec.md: 002-006, 008-014, 016-017 (all "complete"). Phase 019 should be "in-progress". Sub-children 000/001-004 should be "complete", 000/005 should be "in-progress".

### DENOMINATOR: Phase numbering drift in spec.md (4 top-level phases)

FINDING-OPUS-A3-002 | MEDIUM | DENOMINATOR | 011-template-compliance/spec.md, 012-auto-detection-fixes/spec.md, 013-spec-descriptions/spec.md, 014-stateless-quality-gates/spec.md | Four phases use logical phase numbers that do not match their folder IDs. Folder 011 claims "Phase 12", 012 claims "Phase 13", 013 claims "Phase 14", and 014 claims "Phase 17". This numbering appears to be a legacy artifact from when the original phases 011-016 were renumbered or consolidated. The gap from "Phase 14" (folder 013) to "Phase 17" (folder 014) suggests intermediate phases were removed or merged without updating references. | Evidence: `grep "Phase.*of" 011-*/spec.md` returns "Phase 12"; `grep "Phase.*of" 014-*/spec.md` returns "Phase 17" | Recommended fix: Either (a) renumber all "Phase X" labels to match folder IDs (011="Phase 11", 012="Phase 12", etc.) or (b) remove the "Phase X" self-reference lines entirely since the folder numbering is canonical.

### DENOMINATOR: Sub-children 000/001-003 say "of 3" but there are 5 sub-children

FINDING-OPUS-A3-003 | MEDIUM | DENOMINATOR | 000-dynamic-capture-deprecation/001-session-source-validation/spec.md, .../002-outsourced-agent-handback/spec.md, .../003-multi-cli-parity/spec.md | The first three sub-children of 000 claim "Phase X of 3 (000-dynamic-capture-deprecation branch)" but the branch now contains 5 sub-children (001-005). Phases 004 and 005 were added later (as consolidation targets) but the original three were never updated. | Evidence: `grep "of 3" 000-dynamic-capture-deprecation/001-*/spec.md` returns "1 of 3"; there are 5 subdirectories (001-005). | Recommended fix: Update denominator to "of 5" in 001, 002, 003 spec.md files, or remove denominator entirely.

### MISSING_FILE: 019-architecture-remediation absent from descriptions.json index

FINDING-OPUS-A3-004 | HIGH | MISSING_FILE | .opencode/specs/descriptions.json | The root index file `descriptions.json` lists 25 entries under `010-perfect-session-capturing` (parent + 000-018 + 000 sub-children) but does not include `019-architecture-remediation`. This means the phase is invisible to any tooling that reads the centralized index for routing or search. | Evidence: `grep "019-architecture-remediation" descriptions.json` returns no matches; local `019-architecture-remediation/description.json` exists on disk. | Recommended fix: Regenerate `descriptions.json` or manually add the 019 entry to the `folders` array.

### METADATA: specId and folderSlug use full folder name for 019

FINDING-OPUS-A3-005 | LOW | METADATA | 019-architecture-remediation/description.json | The `specId` field is `"019-architecture-remediation"` instead of the conventional `"019"`, and `folderSlug` is `"019-architecture-remediation"` instead of `"architecture-remediation"`. All other 19 sibling phases use the numeric-only specId (e.g., `"001"`, `"018"`) and strip the numeric prefix from folderSlug. | Evidence: Phase 018 has `specId: "018"` and `folderSlug: "memory-save-quality-fixes"`; phase 019 has `specId: "019-architecture-remediation"` and `folderSlug: "019-architecture-remediation"`. | Recommended fix: Set `specId` to `"019"` and `folderSlug` to `"architecture-remediation"`.

### METADATA: memorySequence values are non-unique across sibling phases

FINDING-OPUS-A3-006 | LOW | METADATA | Multiple description.json files | The `memorySequence` field is heavily duplicated across siblings. There are only 4 distinct values (0, 1, 2, 3) spread across 20 phases. Six phases share `memorySequence=0`, seven share `memorySequence=2`, five share `memorySequence=3`, and two share `memorySequence=1`. | Evidence: Phases 000, 012, 014, 015, 017, 018 all have `memorySequence=0`; phases 002, 004, 009, 010, 011, 016, 019 all have `memorySequence=2`. | Recommended fix: This appears to track the count of memory files (length of `memoryNameHistory`) rather than a sequential ordering. If so, the field name is misleading but the values are correct-by-design. If sequential ordering was intended, all 20 values need reassignment to 0-19. Clarify the field's semantic contract.

### METADATA: 000-dynamic-capture-deprecation status says "in-progress" but 4/5 sub-children complete

FINDING-OPUS-A3-007 | LOW | METADATA | 000-dynamic-capture-deprecation/description.json | The parent consolidation phase claims `"status": "in-progress"` and spec.md says "In Progress", which is technically correct since sub-child 005-live-proof-and-parity-hardening is still in progress. However, this is worth noting for tracking: only 1 of 5 sub-children remains incomplete. | Evidence: 000/001-004 spec.md all say "Complete"; 000/005 says "In Progress". | Recommended fix: No immediate fix needed; status will resolve when 005 completes. Informational only.

### METADATA: Keywords are generic on most phases

FINDING-OPUS-A3-008 | LOW | METADATA | Multiple description.json files | Most phases have keywords of the form `["feature", "specification", "<phase-name-words>"]`. While technically correct, the repeated "feature" and "specification" keywords provide no discriminating value for search. Only 000 and 019 have meaningfully differentiated keywords (e.g., "consolidation", "deprecation", "architecture", "remediation"). | Evidence: 15 of 20 phases start with `["feature", "specification", ...]` | Recommended fix: Consider adding domain-specific keywords (e.g., "quality-scorer", "dual-scorer", "memory-indexer" for 001; "lexical-scrubber", "contamination-filter" for 002) to improve semantic search discrimination.

### METADATA: Parent spec.md lastUpdated (2026-03-18) predates description.json lastUpdated (2026-03-20)

FINDING-OPUS-A3-009 | LOW | METADATA | 010-perfect-session-capturing/spec.md vs description.json | The parent spec.md metadata table says `Updated: 2026-03-18` but the parent description.json says `lastUpdated: 2026-03-20T23:00:00.000Z`. The spec.md was updated on 2026-03-20 as part of the architecture audit batch, but the internal `Updated` field was not bumped. | Evidence: `spec.md` line 41: `| **Updated** | 2026-03-18 |`; `description.json` line: `"lastUpdated": "2026-03-20T23:00:00.000Z"` | Recommended fix: Update the spec.md `Updated` field to `2026-03-20` or current date.

---

## Summary Statistics

| Category | Count | Severity Breakdown |
|----------|-------|--------------------|
| STATUS_MISMATCH (missing status field) | 20 phases | 1 HIGH (systemic across 15+5 files) |
| DENOMINATOR (wrong phase number) | 7 instances | 2 MEDIUM (4 top-level + 3 sub-children) |
| MISSING_FILE (index gap) | 1 | 1 HIGH |
| METADATA (specId/folderSlug) | 1 | 1 LOW |
| METADATA (memorySequence) | 20 phases | 1 LOW (design question) |
| METADATA (keywords) | 15 phases | 1 LOW |
| METADATA (date drift) | 1 | 1 LOW |
| METADATA (parent status) | 1 | 1 LOW (informational) |
| **Total findings** | **9** | **2 HIGH, 2 MEDIUM, 5 LOW** |

## Priority Remediation Order

1. **FINDING-OPUS-A3-004** (HIGH): Add 019-architecture-remediation to descriptions.json -- blocks tooling visibility
2. **FINDING-OPUS-A3-001** (HIGH): Backfill `status` field in 20 description.json files -- systematic gap
3. **FINDING-OPUS-A3-002** (MEDIUM): Fix phase number labels in 011-014 spec.md files
4. **FINDING-OPUS-A3-003** (MEDIUM): Fix denominator "of 3" to "of 5" in 000/001-003 spec.md files
5. **FINDING-OPUS-A3-005** (LOW): Normalize specId and folderSlug for 019
6. Remaining LOW findings: address opportunistically
