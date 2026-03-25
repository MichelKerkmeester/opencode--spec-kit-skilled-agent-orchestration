---
title: "Verification Checklist: Feature Catalog Audit & Remediation"
---
# Verification Checklist: Feature Catalog Audit & Remediation

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] CHK-001 [P0] Requirements documented in spec.md — [Evidence: spec.md rewritten with 12 sections for L3]
- [x] CHK-002 [P0] Technical approach defined in plan.md — [Evidence: plan.md created with 4-phase approach]
- [x] CHK-003 [P1] Dependencies identified and available — [Evidence: MCP source exists, codex CLI v0.111.0 available]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-CQ1 [P0] Audit methodology follows consistent classification [Evidence: MATCH/PARTIAL/NO used uniformly]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-TST1 [P0] All 30 agent reports validated [Evidence: 20 verification + 10 investigation reports in scratch/]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-SEC1 [P0] No secrets in audit outputs [Evidence: scratch files contain code analysis only]
<!-- /ANCHOR:security -->

---

**Agent Research Completeness**

- [x] CHK-010 [P0] All 20 verification agents (C01-C20) produced reports — [Evidence: 20 files, 44-139KB each]
- [x] CHK-011 [P0] All 10 investigation agents (X01-X10) produced reports — [Evidence: 10 files, 39-110KB each]
- [x] CHK-012 [P0] All 30 scratch files are non-empty and follow structured format — [Evidence: all contain FEATURE/GAP blocks after "tokens used"]
- [x] CHK-013 [P1] Each verification report covers all assigned historical-snapshot snippet files — [Evidence: 180 FEATURE entries extracted across 20 reports]
- [x] CHK-014 [P1] Each investigation report addresses all assigned gaps — [Evidence: 55 gaps + 29 new gaps reported]

---

**Data Integrity**

- [x] CHK-020 [P0] All file paths in existing snippets validated — [Evidence: 3 invalid paths found out of 393 unique (0.76%), documented in manifest PV-001/002/003]
- [x] CHK-021 [P0] All 55 known gaps have a classification — [Evidence: 48 CONFIRMED_GAP, 7 FALSE_POSITIVE]
- [ ] CHK-022 [P1] Description accuracy verified >95% — [FINDING: 49.4% YES, 43.3% PARTIAL, 7.2% NO — target NOT met, remediation needed]
- [x] CHK-023 [P1] No duplicate features across categories — [Evidence: 7 false positives were overlaps with existing entries]
- [ ] CHK-024 [P2] Source file coverage — [DEFERRED: requires separate coverage analysis]

---

**Synthesis Quality**

- [x] CHK-030 [P0] Remediation manifest exists with all findings classified — [Evidence: scratch/remediation-manifest.md, 202 items]
- [x] CHK-031 [P0] Every finding has an action category — [Evidence: P0 (3 batch), P1 (173 updates), P2 (29 new)]
- [x] CHK-032 [P1] Cross-stream validation completed — [Evidence: 7 false positives identified where Stream 2 gaps matched Stream 1 existing entries]
- [x] CHK-033 [P1] Analysis summary includes per-category statistics — [Evidence: scratch/analysis-summary.md has 20-category table]
- [ ] CHK-034 [P2] Remediation items have effort estimates — [Evidence: total ~9 hours estimated in manifest]
- [x] CHK-035 [P0] 2026-03-16 omitted current snippets explicitly listed and classified — [Evidence: 14-item addendum table in analysis-summary.md and remediation-manifest.md]
- [x] CHK-036 [P1] Addendum follow-up remediation completed for source-path issues — [Evidence: post-addendum cleanup completed in the two affected catalog snippets; 11-feature-catalog-code-references.md and 13-constitutional-memory-manager-command.md both now resolve 0 missing backticked markdown-path references]

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with actual findings — [Evidence: all updated in Phase D]
- [x] CHK-041 [P1] tasks.md updated with concrete remediation work items — [Evidence: Phase E tasks T100-T171 added]
- [x] CHK-042 [P2] Monolithic catalog sync noted in remediation plan — [Evidence: Phase E7 in manifest]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] All agent outputs in scratch/ only — [Evidence: 32 files in scratch/]
- [x] CHK-051 [P1] Scratch files named consistently — [Evidence: verification-C[01-20].md, investigation-X[01-10].md]
- [ ] CHK-052 [P2] Findings summarized for potential memory save — [DEFERRED: to be done after remediation]
<!-- /ANCHOR:file-org -->

---

## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md — [Evidence: 3 ADRs (partitioning, classification, catalog structure)]
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) — [Evidence: all 3 are Accepted]
- [x] CHK-102 [P1] Alternatives documented with rejection rationale — [Evidence: each ADR has 3+ alternatives with scores]
- [x] CHK-103 [P2] Agent partitioning validated against historical snapshot feature distribution — [Evidence: all 180 snapshot features covered by C01-C20]

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 12 | 11/12 |
| P2 Items | 4 | 2/4 |

**P1 gap:** CHK-022 (description accuracy 49.4% vs 95% target) — this is a finding, not a process failure. The audit correctly identified the accuracy gap, which remediation Phase F will address.

**Verification Date**: 2026-03-08
<!-- /ANCHOR:summary -->

---

**Phase G: Normalization & Phase 016/017 Coverage (2026-03-21)**

- [x] CHK-200 [P0] All `NEW-NNN` markers removed from feature catalog files — [Evidence: grep returns 0 matches excluding G-NEW- proper nouns, verified by E1 agent]
- [x] CHK-201 [P0] All `NEW-NNN` markers removed from playbook files — [Evidence: grep returns 0 matches excluding G-NEW- proper nouns, verified by E2 agent]
- [x] CHK-202 [P0] Feature catalog index cleaned and consistent — [Evidence: E1 agent confirmed 194 files indexed, 0 NEW- markers, both new entries present at lines 3370 and 3388]
- [x] CHK-203 [P0] Playbook index cleaned and consistent — [Evidence: E2 agent confirmed 200 files indexed, 0 NEW- markers, entries 153/154 in section body and cross-reference table]
- [x] CHK-204 [P1] Phase 016 catalog entry created with proper frontmatter — [Evidence: 16-json-mode-hybrid-enrichment.md with title and description fields]
- [x] CHK-205 [P1] Phase 017 catalog entry created with proper frontmatter — [Evidence: 17-json-primary-deprecation-posture.md with title and description fields]
- [x] CHK-206 [P1] Phase 016 playbook entry created with test scenarios — [Evidence: 153-json-mode-hybrid-enrichment.md with test execution table]
- [x] CHK-207 [P1] Phase 017 playbook entry created with test scenarios — [Evidence: 154-json-primary-deprecation-posture.md with test execution table]
- [x] CHK-208 [P1] G-NEW-* proper nouns preserved — [Evidence: 25 occurrences of G-NEW-1/2/3 remain intact across catalog and playbook]
- [x] CHK-209 [P1] Playbook section renamed "8. NEW FEATURES" → "8. FEATURES" — [Evidence: E2 agent confirmed "NEW FEATURES" returns 0 matches, "FEATURES" at line 735]
- [x] CHK-210 [P2] Spot-check verification of previously-marked files — [Evidence: E3 agent confirmed 028, 023, 109, 010 files all clean]

---

**Merged Section: 016-feature-catalog-code-references Checklist**

> **Merge note (2026-03-14)**: Originally the 016 checklist document in the prior folder layout.

# Checklist: 016-Feature Catalog Code References
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

**P0 - Blockers**

- [x] **CHK-001 [P0]**: Zero inline comments reference `Sprint \d+` in non-test `.ts` files [Evidence: Non-test source grep for stale refs returned no matches]
- [x] **CHK-002 [P0]**: Zero inline comments reference `Phase \d+` in non-test `.ts` files [Evidence: Non-test source grep for stale refs returned no matches]
- [x] **CHK-003 [P0]**: Zero inline comments reference specific spec folder numbers (e.g., `spec 013`, `specs/NNN`) [Evidence: Non-test source grep for stale refs returned no matches]
- [x] **CHK-004 [P0]**: All handler files have at least one `// Feature catalog: <name>` reference [Evidence: 40 handler `.ts` files and 40 handler files containing a `// Feature catalog:` comment]
- [x] **CHK-005 [P0]**: All `Feature catalog:` references use feature name only, no folder numbers [Evidence: Stable name-based wording + zero numbered-history comment matches]

**P1 - Required**

- [x] **CHK-006 [P1]**: Core lib modules in `lib/search/`, `lib/scoring/`, `lib/cognitive/` have feature catalog references [Evidence: Additional mapped files in `mcp_server` received feature catalog comments where mapping was strong]
- [x] **CHK-007 [P1]**: Shared algorithm modules have feature catalog references [Evidence: Additional mapped files in `shared` received feature catalog comments where mapping was strong]
- [x] **CHK-008 [P1]**: No existing general-purpose comments were removed [Evidence: Comment-only diff audit for `mcp_server` + `shared` returned `{"comment_only": true}`]
- [x] **CHK-009 [P1]**: References follow the `// Feature catalog: <name>` format consistently [Evidence: Implementation used stable `// Feature catalog: <feature-name>` references]

**P2 - Quality**

- [x] **CHK-010 [P2]**: TypeScript compiles cleanly (`tsc --noEmit`) [Evidence: `npm run typecheck` in `.opencode/skill/system-spec-kit` exited 0]
- [x] **CHK-011 [P2]**: Comments are concise (single line where possible) [Evidence: Stable single-line `// Feature catalog: <feature-name>` format applied]
- [x] **CHK-012 [P2]**: Files implementing multiple features list all applicable catalog entries [Evidence: 91 additional annotations added across lib/cognitive, lib/search, lib/eval, lib/telemetry, lib/storage, shared/, and other modules. Cross-validation confirmed 124 unique annotation names, 0 invalid (all match catalog H3 headings)]
- [x] **CHK-013 [P2]**: No feature catalog references point to non-existent feature names [Evidence: Exact-name validation against feature catalog H1 headings passed with zero invalid names]
