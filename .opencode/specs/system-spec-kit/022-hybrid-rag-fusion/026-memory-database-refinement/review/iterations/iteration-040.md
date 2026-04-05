# Iteration 040 — Maintainability: Cross-Reference Consistency Audit (FINAL)

**Dimension:** Maintainability — Cross-references + documentation quality
**Focus:** `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `review/review-report.md`, `checklist.md` — count consistency, task cross-refs, sprint grouping, known-limitations accuracy, DoD vs checklist alignment, file-path validity, template compliance, ANCHOR pairing, and frontmatter validity
**Status:** complete
**Reviewed by:** Maintainability Review Agent (iteration 10, FINAL)
**Date:** 2026-03-28

---

## 1. Pre-flight Checks

### 1a. Frontmatter Validity

All five core documents parsed without error:

| Document | YAML parses | Notes |
|----------|-------------|-------|
| `spec.md` | PASS | |
| `plan.md` | PASS | |
| `tasks.md` | PASS | |
| `implementation-summary.md` | PASS | |
| `checklist.md` | PASS | |

### 1b. ANCHOR Tag Pairing

All opening `<!-- ANCHOR:x -->` tags have a matching `<!-- /ANCHOR:x -->` close across all five documents. No orphaned or mismatched tags were found.

| Document | Opens | Closes | Balanced |
|----------|-------|--------|----------|
| `spec.md` | 10 | 10 | YES |
| `plan.md` | 9 | 9 | YES |
| `tasks.md` | 16 | 16 | YES |
| `implementation-summary.md` | 6 | 6 | YES |
| `checklist.md` | 6 | 6 | YES |

`review/review-report.md` contains no ANCHOR tags — not applicable, not a violation.

### 1c. Placeholder Text

No `[placeholder]`, `[TODO]`, `[TBD]`, `[FILL]`, or `[INSERT]` markers found in any of the five documents. `plan.md` does use `iteration-NNN.md` in two locations as an architectural notation (not an unfilled template slot — see Finding P1-003).

### 1d. File Path Validity (5 sample paths from spec.md)

All five sample paths verified to exist on the filesystem:

| Path | Exists |
|------|--------|
| `handlers/memory-save.ts` | YES |
| `lib/storage/causal-edges.ts` | YES |
| `lib/search/hybrid-search.ts` | YES |
| `lib/providers/embeddings.ts` | YES |
| `lib/parsing/memory-parser.ts` | YES |

Base: `.opencode/skill/system-spec-kit/mcp_server/`

---

## 2. Cross-Reference Table

The table below maps each primary claim across all documents and marks agreement or discrepancy.

| Claim | spec.md | plan.md | tasks.md | impl-summary.md | review-report.md | checklist.md | Status |
|-------|---------|---------|----------|-----------------|------------------|--------------|--------|
| Total findings | 121 | — | 121 | 121 | 121 (exec summary + dim table) | 121 | CONSISTENT |
| P0 count | 5 | — | 5 | 5 | 5 (exec, dim, flat table) | 5 | CONSISTENT |
| P1 count | 75 | — | 75 | 75 | 75 (exec, dim) but 50 (flat table) | 75 | DISCREPANCY in flat table |
| P2 count | 41 | — | 41 | 41 | 41 (exec, dim) but 27 (flat table) | 41 | DISCREPANCY in flat table |
| Review iteration count | 30 (REQ rows) / 20 (SC-001, risks) | 20 (DoD, arch) | 30 | 30 | 30 | 30 | DISCREPANCY in spec/plan |
| P2 deferred count | 16 | — | Phase 9: 16 / Phase 10: 15 | 41 all deferred (stale) | — | — | DISCREPANCY |
| P2 rejected count | 3 | — | 3 (claimed) / triage math yields 5 | — | — | — | DISCREPANCY |
| Test count (final) | 8771 | — | 8771 (completion) / 8748 (T096/T107) | 8718+ | — | 8771 | MINOR DISCREPANCY |
| Phase 10 completion | — | — | Tasks done / checklist unchecked | Known Limitations stale | — | Not in checklist | DISCREPANCY |
| Phase 11 completion | — | — | Tasks pending | Not reflected | — | Not in checklist | CONSISTENT (both show pending) |
| Sprint grouping | 4 sprints (problem statement) | 3 phases | 6 phases + 5 extra phases | 4 sprints (narrative) | Sprint plan | Not enumerated | STRUCTURED DIFFERENTLY (not a defect) |

---

## 3. Findings

### P1-001 — `spec.md` and `plan.md` retain 20-iteration scope against a 30-iteration completion state

**Severity:** P1
**Files:** `spec.md` (lines 109, 126, 133, 146, 147), `plan.md` (DoD, architecture, phases sections)

The packet completed a 30-iteration review, but `spec.md` defines its own success criteria (`SC-001`) and acceptance scenario language around 20 iterations. `plan.md` is fully anchored to a 20-iteration model — the Definition of Done, iteration-to-dimension mapping table (exactly 20 rows), configuration table (`"Iterations": 20`), effort estimate, and execution command section all reference 20 iterations. The `spec.md` requirements section (REQ-001 through REQ-003) correctly reflects the 30-iteration reality, creating an internal split within the same document.

This is a maintainability risk: a reader following `spec.md` SC-001 as the acceptance test would conclude the packet is non-conformant, while a reader following the requirements table would conclude it is complete.

**Evidence:**
- `spec.md:109` — REQ-003 acceptance criteria says `30 iterations complete`.
- `spec.md:126` — SC-001 says `20 review iterations complete`.
- `spec.md:133` — Acceptance scenario says `all 20 iterations complete`.
- `spec.md:146` — Risk table says `20 iterations may not cover all dimensions equally`.
- `plan.md` Definition of Done: `All 20 iterations complete`.
- `plan.md` architecture table: `Iterations: 20`.
- `plan.md` effort estimate: `Execute Review (20 iterations)`.

**Fix recommendation:** Update `spec.md` SC-001, SC-004 acceptance scenario, and risk table to reference 30 iterations. Update `plan.md` Definition of Done, architecture table, iteration-to-dimension mapping, effort estimate, and execution command section to reflect the completed 30-iteration run.

---

### P1-002 — `review/review-report.md` flat finding tables enumerate only 50 P1 and 27 P2 rows against claimed totals of 75 and 41

**Severity:** P1
**File:** `review/review-report.md` (lines 40-127)

The executive summary table and the per-dimension findings table both correctly reflect `5 P0 + 75 P1 + 41 P2 = 121`. The per-dimension table sums to exactly those values when tallied by column. However, the flat enumerated P1 findings table lists only 50 numbered rows (1–50), and the flat P2 findings table lists only 27 numbered rows (1–27). The 25 P1 findings from iterations 021–030 and the 14 P2 findings from iterations 021–030 were added to the dimension table but never appended as rows to the flat finding tables.

Any downstream consumer that reads the flat tables as the canonical finding list will see a 58% P1 coverage gap and a 66% P2 coverage gap, while the dimension table and all other documents assert 100% coverage.

**Evidence:**
- `review/review-report.md:19-24` — executive summary: P0=5, P1=75, P2=41, Total=121.
- `review/review-report.md:40-93` — P1 flat table: exactly 50 rows, highest row number 50.
- `review/review-report.md:101-127` — P2 flat table: exactly 27 rows, highest row number 27.
- `review/review-report.md:133-165` — dimension table: P0 column sums to 5, P1 to 75, P2 to 41, Total to 121.
- `checklist.md:44` — asserts `121 findings total — 5 P0, 75 P1, 41 P2 — all classified in review/review-report.md`.

**Fix recommendation:** Append the 25 missing P1 rows (from iterations 021–030) and the 14 missing P2 rows (from iterations 021–030) to the flat finding tables in `review-report.md`. Each row needs only the minimal columns already present: a sequential number, a one-line description, a dimension reference, and a file.

---

### P1-003 — `plan.md` references a non-existent state file and uses a wrong artifact filename

**Severity:** P1
**File:** `plan.md` (lines 59, 61, 113)

`plan.md` section 3 (Architecture) names the review strategy file as `review/deep-research-strategy.md`. The actual file on disk is `review/deep-review-strategy.md`. Any agent or process that follows the `plan.md` reference to load the strategy document will get a file-not-found error.

Additionally, `plan.md` section 3 describes the state file as `review/deep-research-state.jsonl`. No such file exists in the `review/` directory. The review ran via a different mechanism and the JSONL state file either was never created or was cleaned up.

`plan.md` section 2 (Quality Gates) and section 4 (Phases) also reference `review/iterations/iteration-NNN.md` as an artifact path. While this reads as an architectural pattern rather than a broken link, it is not consistent with the specific `iteration-001.md` through `iteration-030.md` naming already present and cited in other documents.

**Evidence:**
- `plan.md:59` — `review/deep-research-strategy.md` (does not exist).
- Actual file: `review/deep-review-strategy.md` (confirmed on filesystem).
- `plan.md:61` — `review/deep-research-state.jsonl` (does not exist in `review/`).
- `plan.md:113` — `review/iterations/iteration-NNN.md` notation.

**Fix recommendation:** In `plan.md`, correct `deep-research-strategy.md` to `deep-review-strategy.md`. Note the JSONL state file as absent. Replace `iteration-NNN.md` pattern references with the actual range `iteration-001.md` through `iteration-030.md`.

---

### P1-004 — `implementation-summary.md` Known Limitations are stale by three completed phases

**Severity:** P1
**File:** `implementation-summary.md` (lines 155–162)

The Known Limitations section describes the state of the work as it existed at the end of Sprint 4, before Phases 8, 9, and 10 ran. All three limitations listed have since been resolved:

1. Limitation 1 says "50 integration test failures pending reconciliation" — `checklist.md` CHK-067 marks this complete (4 parallel agents fixed all 24 failures across 9 files). Note: the summary says "50 failures" while the checklist records "24 failures". This is an additional count discrepancy within the stale limitation text.
2. Limitation 2 says "41 P2 findings deferred" — `checklist.md` CHK-066 marks all 41 triaged (22 fixed, 16 deferred with reasons, 3 rejected) and `tasks.md` Phase 10 marks all 15 remaining deferred findings fixed.
3. Limitation 3 says "T097 ablation benchmark rerun deferred" — `tasks.md:149` marks T097 complete with evidence of 53/53 ablation tests passing.

The implementation summary is the canonical closeout artifact for this spec. Leaving three resolved limitations listed as open makes it untrustworthy as a handover document.

**Evidence:**
- `implementation-summary.md:155` — says 50 integration test failures pending.
- `checklist.md:67` — CHK-067 marked `[x]`, 24 (not 50) failures fixed.
- `implementation-summary.md:157` — says 41 P2 findings deferred.
- `checklist.md:66` — CHK-066 marked `[x]`, triage complete.
- `tasks.md:200-214` — T130-T144 all marked `[x]`, deferred P2s fixed.
- `implementation-summary.md:161` — says T097 not completed.
- `tasks.md:149` — T097 marked `[x]`, 53/53 ablation tests pass.

**Fix recommendation:** Update the Known Limitations section to reflect current state: remove or revise the three resolved limitations. Add a note that the current open item is Phase 11 (documentation alignment audit), which remains pending per `tasks.md`.

---

### P2-001 — Phase 10 task completion and checklist/completion-criteria rows are out of sync

**Severity:** P2
**File:** `tasks.md` (Phase 10 checklist at lines 241–243, completion criteria at line 270)

All 15 Phase 10 task rows (T130–T144) are marked `[x]`. However, the Phase 10 checklist items CHK-070 and CHK-071 remain `[ ]` (unchecked), and the completion criteria row "All 15 deferred P2 findings fixed (Phase 10)" is also unchecked. The task execution is complete but the verification acknowledgment rows were not updated.

**Evidence:**
- `tasks.md:200-214` — T130 through T144 all `[x]`.
- `tasks.md:241` — CHK-070 `[ ] All 15 deferred P2 findings fixed with passing tests`.
- `tasks.md:242` — CHK-071 `[ ] Build and typecheck clean after all fixes`.
- `tasks.md:270` — `[ ] All 15 deferred P2 findings fixed (Phase 10)`.

**Fix recommendation:** Mark CHK-070, CHK-071, and the Phase 10 completion row as `[x]` with evidence from T130–T144 task entries.

---

### P2-002 — P2 deferred/rejected tally in Phase 9 evidence lines does not match summary claims

**Severity:** P2
**File:** `tasks.md` (Phase 9 task evidence, lines 179–190)

The Phase 9 completion summary claims `22 FIXED, 16 DEFERRED, 3 REJECTED`. Tallying the explicit evidence from T110–T120 (items with individual P2-NNN citations) yields 9 FIX, 6 DEFER, 2 REJECT; T121 batch claims 13 FIX, 8 DEFER, 3 REJECT. The combined total is FIX=22, DEFER=14, REJECT=5 — matching on FIX but off by 2 on DEFER and REJECT. The combined total still sums to 41, so no P2 finding is missing, but the DEFER/REJECT split does not reconcile with the summary. This means either the T121 batch evidence line is wrong or the summary is wrong.

Separately, Phase 10 fixes 15 deferred P2 findings but Phase 9 claims 16 were deferred. One deferred finding was absorbed without explicit documentation.

**Evidence:**
- `tasks.md:177` — summary says 16 DEFERRED, 3 REJECTED.
- `tasks.md:179-190` — per-task evidence yields DEFER=14, REJECT=5 by direct tally.
- `tasks.md:196` — Phase 10 title: "Fix All 15 Deferred P2 Findings".
- `tasks.md:200-214` — exactly 15 tasks (T130-T144) in Phase 10.

**Fix recommendation:** Reconcile T121 evidence text with the Phase 9 summary line so DEFER and REJECT counts match. Document the fate of the 16th deferred finding (whether it was quietly fixed as part of another task or reclassified as rejected).

---

### P2-003 — test count inconsistency across documents (8718+ vs 8748 vs 8771)

**Severity:** P2
**Files:** `implementation-summary.md:3` (frontmatter), `tasks.md:149` (T096), `tasks.md:169` (T107), `checklist.md:68` (CHK-068)

Three different test counts appear across documents representing what is claimed to be the same final state:

- `implementation-summary.md` frontmatter: `8718+ tests` (a floor estimate).
- `tasks.md:149` (T096) and `tasks.md:169` (T107): `8748 passed`.
- `tasks.md` completion criteria and `checklist.md` CHK-068: `8771 passed`.

The 8771 figure is the most recent and should be the authoritative final count, but `implementation-summary.md` and the T096/T107 evidence lines still show earlier sprint-gate counts. The discrepancy does not indicate a test failure, but it creates confusion about what the "final" verified state was.

**Evidence:**
- `implementation-summary.md:3` — `8718+ tests`.
- `tasks.md:149` — T096 evidence: `8748 tests pass`.
- `tasks.md:169` — T107 evidence: `8748 passed`.
- `tasks.md:272` — completion criteria: `8771 pass`.
- `checklist.md:68` — CHK-068: `8771 passed`.

**Fix recommendation:** Update `implementation-summary.md` frontmatter description and the verification table (line 144) to reflect `8771` as the final passing test count. T096 and T107 evidence can remain as sprint-gate snapshots but should note that the final count is 8771.

---

## 4. Summary Table

| ID | Severity | Artifact(s) | Claim | Finding |
|----|----------|-------------|-------|---------|
| P1-001 | P1 | `spec.md`, `plan.md` | 30 iterations completed | SC-001, DoD, arch table, and effort estimate still say 20 |
| P1-002 | P1 | `review/review-report.md` | 75 P1 + 41 P2 = 121 findings | Flat tables list only 50 P1 + 27 P2 = 82 rows |
| P1-003 | P1 | `plan.md` | Strategy file `deep-research-strategy.md` | Actual file is `deep-review-strategy.md`; JSONL state file absent |
| P1-004 | P1 | `implementation-summary.md` | Known Limitations accurate | All 3 listed limitations resolved by Phase 8/9/10 |
| P2-001 | P2 | `tasks.md` | Phase 10 tasks complete | CHK-070, CHK-071, completion row still unchecked |
| P2-002 | P2 | `tasks.md` | 16 deferred, 3 rejected in Phase 9 | Direct tally: 14 deferred, 5 rejected; Phase 10 fixes 15 (not 16) |
| P2-003 | P2 | `impl-summary.md`, `tasks.md`, `checklist.md` | Final test count | Three different values: 8718+, 8748, 8771 across documents |

---

## 5. Checks Passed (No Findings)

The following checks found no issues:

- **Frontmatter YAML:** All 5 documents parse cleanly.
- **ANCHOR tag pairing:** All 5 documents are balanced.
- **Placeholder text:** No unfilled `[placeholder]`, `[TBD]`, or `[FILL]` markers in any document.
- **File paths:** All 5 sample paths from `spec.md` resolve on the filesystem.
- **Iteration file integrity:** All 30 core review iteration files (001–030) exist on disk. Additional iterations 031–039 exist as supplemental passes and are not referenced in the core spec documents, which is expected.
- **Finding total arithmetic:** `5 + 75 + 41 = 121` is consistent across every document that states a total. The per-dimension table sums correctly to 5/75/41/121.
- **P2 total arithmetic:** `22 fixed + 16 deferred + 3 rejected = 41` total P2 (claimed). Sum is internally consistent even though the DEFER/REJECT split has a reconciliation gap.
- **Sprint grouping coherence:** `plan.md` uses 3 phases (review-only), `tasks.md` uses 11 phases (full lifecycle), `implementation-summary.md` uses 4 sprints (fix narrative). These are different views of the same work, not contradictions. No sprint in one document contradicts a sprint in another.

---

## 6. Conclusion

Four P1 findings and three P2 findings were identified. No P0 findings. All pre-flight structural checks passed cleanly.

The root cause of every finding is the same: the spec packet was extended across multiple phases (Phases 8–11) after `implementation-summary.md` and parts of `spec.md`/`plan.md` were already written, and those earlier documents were not updated to reflect the completed state. The most consequential issue is P1-002: the flat finding tables in `review/review-report.md` enumerate only 68% of the claimed findings, which breaks traceability for the 33 P1/P2 findings from iterations 021–030.

The doc-alignment audit in Phase 11 (tasks T150–T159) is the correct vehicle for all four P1 fixes and the three P2 fixes identified here. `tasks.md` is the most current and most accurate document in the packet and should serve as the ground-truth baseline for all alignment work.
