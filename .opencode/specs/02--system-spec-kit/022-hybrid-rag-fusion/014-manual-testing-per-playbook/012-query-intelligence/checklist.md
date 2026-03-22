---
title: "Verification Checklist: query-intelligence manual testing [template:level_2/checklist.md]"
description: "Verification checklist for Phase 012 query-intelligence manual tests covering all 10 scenarios: 033, 034, 035, 036, 037, 038, 161, 162, 163, 173."
trigger_phrases:
  - "phase 012 checklist"
  - "query intelligence verification checklist"
  - "query intelligence checklist"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: query-intelligence manual testing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Playbook loaded and all 10 Phase 012 scenario rows identified with exact prompts and command sequences
- [ ] CHK-002 [P0] Review protocol loaded and PASS/PARTIAL/FAIL criteria confirmed for all 10 scenarios
- [ ] CHK-003 [P0] MCP runtime available: `memory_search` with `includeTrace: true` confirmed working
- [ ] CHK-004 [P0] Feature flag support confirmed for 161, 162, 163, 173 in the active runtime
- [ ] CHK-005 [P1] Baseline feature flag state recorded for 033 and 037 fallback tests
- [ ] CHK-006 [P1] Feature catalog links for all 10 test IDs verified against `12--query-intelligence/` files
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] 033 (Query complexity router R15) executed: simple/moderate/complex queries confirmed channel scaling; flag-disabled fallback verified; evidence captured
- [ ] CHK-011 [P0] 034 (RSF shadow mode R14/N1) executed: live ranking confirmed as RRF; no runtime RSF branch affects returned results; evidence captured
- [ ] CHK-012 [P0] 035 (Channel min-representation R2) executed: all active channels have >=1 representative in top-k; quality floor prevents sub-threshold entries; evidence captured
- [ ] CHK-013 [P0] 036 (Confidence-based result truncation R15-ext) executed: results cut at confidence cliff; >=min-count results always returned; threshold metadata visible; evidence captured
- [ ] CHK-014 [P0] 037 (Dynamic token budget allocation FUT-7) executed: budget proportional to complexity tier confirmed or future-capability status documented; flag-disabled fallback verified; evidence captured
- [ ] CHK-015 [P0] 038 (Query expansion R12) executed: complex query generates >=2 expansion variants; results deduplicated; simple query bypasses expansion; evidence captured
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] 161 (LLM Reformulation): flag ON pass — deep-mode query produces reformulated query visible in trace, non-deep queries bypass; flag OFF pass — no reformulation occurs; flags restored; evidence captured
- [ ] CHK-021 [P0] 162 (HyDE Shadow): flag ON pass — hypothetical document generated in shadow output, live ranking unaffected; flag OFF pass — no hypothetical document generation; flags restored; evidence captured
- [ ] CHK-022 [P0] 163 (Query Surrogates): flag ON pass — memory save generates surrogates, retrieval using surrogate terms returns the record; flag OFF pass — no surrogates generated; disposable test record cleaned up; flags restored; evidence captured
- [ ] CHK-023 [P0] 173 (Query Decomposition): flag ON pass — deep-mode multi-faceted query decomposed into <=3 rule-based sub-queries, trace shows derived sub-queries, original query unchanged; flag OFF pass — no decomposition; flags restored; evidence captured

### Verdict Assignment

- [ ] CHK-030 [P0] All 10 scenarios have a verdict (PASS, PARTIAL, or FAIL) with explicit rationale referencing review protocol acceptance rules
- [ ] CHK-031 [P0] Coverage reported as 10/10 scenarios with no skipped test IDs
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No secrets, API keys, or credentials appear in any Phase 012 document or evidence artifact
- [ ] CHK-041 [P1] Feature flags restored to default (OFF) after each flag-toggle test pass for 161, 162, 163, 173
- [ ] CHK-042 [P1] Disposable test memory record created for 163 is deleted after the scenario; index state confirmed clean
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P0] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` contain no template placeholder text
- [ ] CHK-051 [P0] All 10 scenarios documented with exact prompts and feature catalog relative paths under `../../feature_catalog/12--query-intelligence/`
- [ ] CHK-052 [P1] `implementation-summary.md` completed with verdict summary table after execution is done
- [ ] CHK-053 [P1] Evidence artifacts retained in `scratch/` for reviewer audit
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] Only required phase documents present in `012-query-intelligence/`: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, `scratch/`
- [ ] CHK-061 [P2] Memory save triggered after phase execution to make query-intelligence context available for future sessions
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 7 | 0/7 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not Started
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
