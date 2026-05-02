# Research-to-Spec-Doc Reconciliation: Master Synthesis

> **Generated**: 2026-03-16 | **Method**: 4 parallel cli-copilot agents (GPT-5.4, high reasoning)
> **Total cost**: 4 Premium requests | **Wall time**: ~4m 46s (parallel)

---

## Executive Summary

4 agents reviewed 4 spec documents against `research/research-pipeline-improvements.md` (R-01–R-13). Combined output: **19 recommendations** across the 4 documents. No conflicts between agents.

| Agent | Document | Recommendations | Key Additions |
|-------|----------|-----------------|---------------|
| 1 | spec.md | 4 | R-11 risk row, deferred limitations, future work (7 themes), research links |
| 2 | decision-record.md | 5 | DR-015–DR-019 deferral decisions for R-11, R-01, R-03, R-12, R-13 |
| 3 | checklist.md | 6 | CHK-601–CHK-606 research documentation completeness section |
| 4 | implementation-summary.md | 4 | R-12 code changes, Phase 6 CG/SE fixes, research findings section |

---

## Application Order

Apply in this sequence to avoid cross-reference inconsistencies:

### Phase 1: Implementation Summary (Agent 4) — establishes what was done

1. **Add R-12 Template Compliance code changes** (after line 139, before `<!-- /ANCHOR:code -->`)
   - New subsection documenting: `check-template-headers.sh`, extended `check-anchors.sh`, `validate.sh` registration, 14+ checklist file fixes

2. **Add Phase 6 Content Generation + speckit-enforce code changes** (same insertion point)
   - CG-01 through CG-08: diagram dedup, word-boundary truncation, completion detection, stopword filtering, file extraction, tree-thinning descriptions, medium-quality warning, agent file classification
   - SE-01 through SE-05: unrecognized rules warning, YAML comment handling, mode validation, date format validation, bullet-metadata Level

3. **Add "7. Research Phase Findings" section** (before current §7 Remediation, which becomes §8)
   - 7 cross-cutting themes listed
   - R-12 as only implemented research item
   - Reference to research doc for priority matrix and phases
   - Note: Agent 4 flagged that priority matrix has **25 rows** (P0:9, P1:8, P2:8), not 21 — use actual counts

4. **Add research document to §6 Documentation Updated**
   - Single bullet: `research/research-pipeline-improvements.md`

### Phase 2: Decision Record (Agent 2) — documents deferral decisions

5. **DR-015**: Defer session-identity validation (R-11 P0) — mtime transcript selection risk
6. **DR-016**: Defer quality scorer unification (R-01 P0) — dual 0-1/0-100 scales
7. **DR-017**: Defer lossless metadata preservation (R-03 P0) — ACTION, _provenance dropped
8. **DR-018**: Defer template compliance hardening beyond implemented rules (R-12) — fingerprinting, inline content, strict post-agent validation deferred
9. **DR-019**: Defer auto-detection cascade expansion (R-13 P0) — git-status, session activity, parent affinity

### Phase 3: Spec.md (Agent 1) — acknowledges risks and future work

10. **Add R-11 risk row** to §6 Risks table (after line 236)
    - Same-spec transcript selection → wrong session → quality 1.0 → indexed as valid

11. **Add "Deferred Known Limitations" subsection** to §6 (before `<!-- /ANCHOR:risks -->`)
    - R-13 auto-detection fragility, decision dedup bug, key_files pipeline weakness

12. **Add research links** to §12 Related Documents (after line 360)
    - `research/research-pipeline-improvements.md` and `research/`

13. **Add "Identified Future Work" subsection** to §12 (after line 362)
    - 7 themes with brief descriptions and R-item citations
    - Reference to priority matrix and implementation sequence

### Phase 4: Checklist (Agent 3) — verifies documentation completeness

14. **Add "§6. Research Documentation Completeness" section** (after §5 Remediation)
    - CHK-601: Research synthesis exists and is complete (R-01–R-13, 7 themes, 5 major sections)
    - CHK-602: spec.md acknowledges research backlog (risks, future work, related docs)
    - CHK-603: decision-record.md has deferral DRs (R-11, R-01, R-13, R-03)
    - CHK-604: implementation-summary.md documents R-12 + Phase 6
    - CHK-605: research/ directory organized with README index
    - CHK-606: Closure evidence reflects R-12 template-compliance hardening

---

## Conflicts & Overlaps

**None found.** All 4 agents target different documents with complementary recommendations. Cross-references are consistent:
- Agent 3 (checklist) verifies that Agent 1 (spec.md), Agent 2 (decision-record), and Agent 4 (impl-summary) changes are present
- This creates a dependency: apply Phases 1-3 before Phase 4's checklist items can be marked `[x]`

## Notable Flags

1. **Priority matrix count**: Agent 4 flagged that the research doc's matrix has **25 rows** (P0:9, P1:8, P2:8), not 21 as stated in some places. The count increased when R-13 added items. Use actual count when referencing.

2. **Remediation renumbering**: Agent 4's recommendation 3 inserts a new §7 "Research Phase Findings" before the current §7 "Remediation Pass", which should become §8. Update the section number.

3. **Agent 2 scope judgment**: Agent 2 deliberately chose NOT to create DRs for R-04, R-05, R-06, R-07, R-08, R-09, or R-10, reasoning these are "future consolidation, enrichment, scoring, and test-depth work" better tracked as backlog than as formal deferral decisions. This is a reasonable judgment call.

---

## Source Files

| Output | Lines | Tokens (est) |
|--------|-------|-------------|
| `research-reconciliation-spec.md` | 217 | 328k in, 9.4k out |
| `research-reconciliation-decisions.md` | 202 | 556k in, 9.5k out |
| `research-reconciliation-checklist.md` | 267 | 507k in, 13.7k out |
| `research-reconciliation-impl-summary.md` | 358 | 915k in, 15.9k out |
| **This file** | — | Conductor synthesis |
