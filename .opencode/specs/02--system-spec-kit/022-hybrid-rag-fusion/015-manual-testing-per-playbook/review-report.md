# Deep Review Report — Feature Catalog ↔ Playbook ↔ Spec Phase Traceability

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Verdict** | **CONDITIONAL** |
| **hasAdvisories** | true |
| **P0 (Critical)** | 1 finding (29 true-gap features — revised from 54 after rounds 2-6) |
| **P1 (Major)** | 5 findings (was 4; +1 for 25 covered-but-unlinked features) |
| **P2 (Minor)** | 3 findings |
| **Review Scope** | 222 feature catalog entries, 230 playbook scenarios, 22 spec phases |
| **Iterations** | 6 (round 1: 7 parallel GPT-5.4 agents; rounds 2-6: 5 focused GPT-5.4 agents) |
| **Stop Reason** | Convergence — rounds 2-6 refined P0 from 54→29 true gaps |
| **Dimensions** | correctness, traceability, maintainability (security N/A) |

**29 of 222 feature catalog entries (13.1%) have no playbook scenario at all** (true gaps). An additional **25 features have playbook scenarios but lack the formal `Feature catalog:` back-reference link** (covered but unlinked — reclassified from P0 to P1). Additionally, 40 playbook scenarios lack back-references to their feature catalog entries, and most spec phase folders lack Scenario Registry tables.

---

## 2. Planning Trigger

`/spec_kit:plan` is recommended to create playbook scenarios for the 29 true-gap features and add back-references to the 25+40 unlinked scenarios.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": {
    "P0": 1,
    "P1": 5,
    "P2": 3
  },
  "remediationWorkstreams": [
    "Create 29 missing playbook scenario files (true gaps)",
    "Add Feature catalog back-references to 25 covered-but-unlinked scenarios",
    "Add Feature catalog back-references to 40 other orphan playbook scenarios",
    "Add 4 missing Section 12 cross-reference entries",
    "Add Scenario Registry tables to 17 spec phases"
  ],
  "specSeed": "specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook",
  "planSeed": "Remediate feature catalog ↔ playbook traceability gaps across 21 categories"
}
```

---

## 3. Active Finding Registry

### P0-001: 29 Feature Catalog Entries Have No Playbook Scenario (True Gaps)

| Field | Value |
|-------|-------|
| **Severity** | P0 |
| **Dimension** | traceability |
| **Impact** | 13.1% of features lack manual test coverage entirely |
| **Evidence** | Programmatic cross-reference + rounds 2-6 content-based verification |
| **Disposition** | Active — requires remediation |
| **Revised** | Round 1 found 54; rounds 2-6 verified 25 have coverage via feature-flag-gated scenarios lacking back-refs (reclassified to P1-005) |

**Affected categories (revised true-gap counts):**

| Category | True Gaps | Total | Gap % |
|----------|-----------|-------|-------|
| 18-UX Hooks | 8 | 19 | 42% |
| 14-Pipeline Architecture | 5 | 22 | 23% |
| 16-Tooling & Scripts | 3 | 18 | 17% |
| 11-Scoring & Calibration | 3 | 22 | 14% |
| 10-Graph Signal | 3 | 16 | 19% |
| 01-Retrieval | 3 | 11 | 27% |
| 13-Memory Quality | 2 | 24 | 8% |
| 02-Mutation | 2 | 10 | 20% |

**29 true-gap features (no playbook scenario exists):**
- 01: AST-level section retrieval tool, Tool-result extraction to working memory, Session recovery via /memory:continue
- 02: Namespace management CRUD tools, Correction tracking with undo
- 10: ANCHOR tags as graph nodes, Causal neighbor boost and injection, Temporal contiguity layer
- 11: Tool-level TTL cache, Access-driven popularity scoring, Temporal-structural coherence scoring
- 13: Content-aware memory filename generation, Generation-time duplicate and empty content prevention
- 14: Warm server/daemon mode, Backend storage adapter abstraction, Atomic write-then-index API, Embedding retry orchestrator, 7-layer tool architecture metadata
- 16: Architecture boundary enforcement, Watcher delete/rename cleanup, Template compliance contract enforcement
- 18: Shared post-mutation hook wiring, Memory health autoRepair metadata, Schema and type contract synchronization, Mutation hook result contract expansion, Mutation response UX payload exposure, Atomic-save parity and partial-indexing hints, Final token metadata recomputation, End-to-end success-envelope verification

**Fix:** Create a playbook scenario file for each true-gap feature.

---

### P1-001: 4 Features Missing from Section 12 Cross-Reference Index

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Dimension** | traceability |
| **Evidence** | Section 12 has 219 entries vs 222 catalog entries |
| **Disposition** | Active |

**Missing entries:**
1. `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-memory-continue.md` — Session recovery via /memory:continue
2. `.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/08-audit-phase-020-mapping-note.md` — Audit phase mapping note
3. `.opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/01-category-stub.md` — Category stub
4. `.opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/01-category-stub.md` — Category stub

**Fix:** Add rows to Section 12 table in MANUAL_TESTING_PLAYBOOK.md.

---

### P1-002: 40 Playbook Scenarios Lack Feature Catalog Back-Reference

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Dimension** | traceability |
| **Evidence** | 40 of 230 scenarios have no `- Feature catalog:` link in Section 4 REFERENCES |
| **Disposition** | Active |

These include newer scenarios (IDs 156-187), dedicated memory/spec-kit scenarios (M-001 through M-011), and PHASE-prefixed scenarios. Many of these represent feature-flag-gated features that have corresponding catalog entries but lack the bidirectional link.

**Fix:** Add `- Feature catalog: [category/file](../../feature_catalog/category/file)` to each scenario's Section 4.

---

### P1-003: 17 of 22 Spec Phases Lack Scenario Registry Tables

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Dimension** | maintainability |
| **Evidence** | Only phases 001, 002, 006, 007, 013 have `### Scenario Registry` sections |
| **Disposition** | Active |

The Scenario Registry provides a quick lookup mapping scenario IDs to feature catalog entries within each spec phase. Without it, navigating from a spec phase to its corresponding features requires reading the full spec.md.

**Fix:** Add `### Scenario Registry` table to each of the 17 missing spec phase spec.md files, following the format used in 006-analysis/spec.md.

---

### P1-004: Inconsistent Feature Catalog Ref Patterns in Spec Phases

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Dimension** | maintainability |
| **Evidence** | Some spec phases (010, 011, 012, 017, 018, 019) embed inline catalog refs; most use no refs at all |
| **Disposition** | Active |

**Fix:** Standardize spec phase documentation to use Scenario Registry tables (preferred) rather than scattered inline refs.

---

### P1-005: 25 Features Have Playbook Scenarios But Lack Formal Back-References

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Dimension** | traceability |
| **Evidence** | Round 2-6 content-based matching confirmed coverage exists via feature-flag-gated scenarios (IDs 156-180) |
| **Disposition** | Active |

These 25 features were originally counted as P0 (no coverage) but rounds 2-6 verified that playbook scenarios DO exist — they just lack the `- Feature catalog:` back-reference link. The mappings are via feature-flag-gated scenario files (e.g., `166-result-explain-v1` → `.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/14-result-explainability.md`).

**Affected categories:** 18-UX Hooks (6), 10-Graph Signal (4), 11-Scoring (4), 12-Query Intel (5), 13-Memory Quality (5), 01-Retrieval (1)

**Fix:** Add `- Feature catalog:` back-reference links to each of the 25 playbook scenarios' Section 4 REFERENCES.

---

### P2-001: Section 12 Links All Valid

| Field | Value |
|-------|-------|
| **Severity** | P2 (advisory) |
| **Dimension** | correctness |
| **Evidence** | All 214 links in Section 12 resolve to existing files |
| **Disposition** | Advisory — no action needed |

---

### P2-002: Spec Phase 020 Duplicates 019 Name

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Dimension** | maintainability |
| **Evidence** | Both `019-feature-flag-reference/` and `020-feature-flag-reference/` exist as spec phases |
| **Disposition** | Advisory — appears intentional for audit phase mapping per FEATURE_CATALOG.md |

---

### P2-003: Category Count Mismatches Expected

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Dimension** | correctness |
| **Evidence** | Playbook has more scenarios than catalog entries in some categories (e.g., 16-Tooling: FC=18, PB=33) due to sub-IDs and compound scenarios |
| **Disposition** | Advisory — by design (sub-scenario expansion) |

---

## 4. Remediation Workstreams

### Workstream 1 (P0): Create Missing Playbook Scenarios
- **Priority:** Highest
- **Scope:** 29 new scenario files across 8 categories (revised from 54 after rounds 2-6)
- **Approach:** Use `create:testing-playbook` skill to generate scenarios from feature catalog entries
- **Dependency:** None

### Workstream 2 (P1): Add Feature Catalog Back-References
- **Priority:** High
- **Scope:** 25 covered-but-unlinked scenarios + 40 other orphan scenarios = 65 total
- **Approach:** Add `- Feature catalog:` line to Section 4 REFERENCES in each scenario
- **Dependency:** Workstream 1 (new scenarios should include back-refs from creation)

### Workstream 3 (P1): Complete Section 12 Cross-Reference Index
- **Priority:** High
- **Scope:** 4 missing entries + 29 new entries from Workstream 1 = 33 total
- **Approach:** Append rows to Section 12 table in MANUAL_TESTING_PLAYBOOK.md
- **Dependency:** Workstream 1

### Workstream 4 (P1): Add Scenario Registry Tables
- **Priority:** Medium
- **Scope:** 17 spec phase spec.md files
- **Approach:** Add `### Scenario Registry` table following 006-analysis/spec.md format
- **Dependency:** Workstreams 1-3 (registry should reflect final state)

---

## 5. Spec Seed

- Create new spec folder for playbook scenario creation: `specs/02--system-spec-kit/022-hybrid-rag-fusion/023-playbook-coverage-remediation/`
- Scope: 54 new scenario files, 40 back-reference fixes, 4 Section 12 additions, 17 Scenario Registry tables
- Level: 2 (100+ LOC changes across multiple files)

---

## 6. Plan Seed

1. Generate 54 playbook scenario files using `create:testing-playbook` for each unmatched feature catalog entry
2. Add `- Feature catalog:` back-references to 40 existing scenarios
3. Add 4 + 54 = 58 rows to Section 12 cross-reference index
4. Add Scenario Registry tables to 17 spec phase spec.md files
5. Run cross-check validation to confirm 0 gaps remaining
6. Update parent spec.md counts (current: 231 files, 272 IDs → new totals)

---

## 7. Traceability Status

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core | PARTIAL | Spec phases reference scenarios but most lack structured Scenario Registry |
| `checklist_evidence` | core | PASS | Checklist exists with verification items |
| `feature_catalog_code` | overlay | CONDITIONAL | 29/222 features (13.1%) true gaps; 25 more covered but unlinked |
| `playbook_capability` | overlay | PARTIAL | 65/230 scenarios (28.3%) lack feature catalog back-references |

---

## 8. Deferred Items

- **Category 20-21 stub handling:** These are intentionally stub entries in the feature catalog. Consider whether they should have dedicated playbook scenarios or remain as cross-category references only.
- **Sub-scenario ID expansion:** The 230 playbook files expand to 265+ exact IDs via sub-scenarios (M-005a-c, M-006a-c, M-007a-q, 153-A through 153-O, 155-F). A future review should verify sub-ID ↔ feature catalog traceability.
- **Gemini overlay scenario packs (Section 13):** Not audited in this review.

---

## 9. Audit Appendix

### Convergence Summary
- Iterations: 6 total (round 1: 7 parallel GPT-5.4 agents; rounds 2-6: 5 focused GPT-5.4 agents)
- Stop reason: Convergence — rounds 2-6 refined P0 from 54→29 true gaps, no new findings in final rounds
- Round 2: False-negative verification → 25 features reclassified from P0 to P1
- Round 3: Orphan scenario mapping → confirmed 25 feature-flag-gated mappings
- Round 4: Spec phase reference audit → confirmed 17/22 lack Scenario Registry
- Round 5: Root document completeness check
- Round 6: Naming consistency and link validation

### Coverage Summary
| Dimension | Status |
|-----------|--------|
| Correctness | Reviewed — 0 broken links in Section 12 |
| Security | N/A — documentation traceability review |
| Traceability | Reviewed — P0 finding (24.3% feature gap) |
| Maintainability | Reviewed — P1 findings (missing registries/back-refs) |

### Cross-Reference Appendix

**Core Protocols:**
- `spec_code`: Spec phase files exist for all 22 phases. 5/22 have Scenario Registry tables.
- `checklist_evidence`: Parent checklist.md exists with quality gates.

**Overlay Protocols:**
- `feature_catalog_code`: 168/222 features mapped to playbook scenarios (75.7%). 54 features unmapped.
- `playbook_capability`: 190/230 scenarios have feature catalog back-references (82.6%). 40 scenarios missing back-refs.

### Sources Reviewed
- `.opencode/skill/system-spec-kit/feature_catalog/` — 222 entries across 21 categories
- `.opencode/skill/system-spec-kit/manual_testing_playbook/` — 230 scenarios across 19 categories + root
- `specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/` — 22 spec phases + root docs
- Section 12 of MANUAL_TESTING_PLAYBOOK.md — 219 cross-reference entries, 214 links verified
