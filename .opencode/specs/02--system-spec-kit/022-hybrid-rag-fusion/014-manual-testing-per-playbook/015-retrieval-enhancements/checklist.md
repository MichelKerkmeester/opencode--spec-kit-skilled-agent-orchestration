---
title: "Verification Checklist: manual-testing-per-playbook retrieval-enhancements phase [template:level_2/checklist.md]"
description: "Verification checklist for Phase 015 retrieval-enhancements manual test packet covering NEW-055, NEW-056, NEW-057, NEW-058, NEW-059, NEW-060, NEW-077, NEW-096, and NEW-145."
trigger_phrases:
  - "retrieval enhancements checklist"
  - "phase 015 verification checklist"
  - "manual testing retrieval enhancements checks"
  - "new-055 new-056 new-057 verification"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook retrieval-enhancements phase

<!-- SPECKIT_LEVEL: 1 -->
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

- [ ] CHK-001 [P0] Requirements documented in spec.md — all 9 test IDs mapped with exact prompts, command sequences, feature links, and acceptance criteria
- [ ] CHK-002 [P0] Technical approach defined in plan.md — execution phases, quality gates, testing strategy table, and rollback procedure captured
- [ ] CHK-003 [P1] Dependencies identified and available — playbook, review protocol, feature catalog links, MCP runtime, sandbox corpus, and env var snapshot all confirmed
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No placeholder or template text remains in spec.md, plan.md, tasks.md, or checklist.md
- [ ] CHK-011 [P0] All feature catalog links in the scope table resolve to existing files in `../../feature_catalog/15--retrieval-enhancements/`
- [ ] CHK-012 [P1] Scenario descriptions match the exact playbook wording — no paraphrasing of prompts or command sequences
- [ ] CHK-013 [P1] Execution type (manual vs MCP) correctly assigned for each of the 9 scenarios in plan.md testing strategy table
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All 9 retrieval-enhancements scenarios have execution evidence tied to the exact documented prompt and command sequence
- [ ] CHK-021 [P0] Every scenario has a verdict (PASS / PARTIAL / FAIL) with rationale per the review protocol acceptance rules
- [ ] CHK-022 [P0] Coverage reported as 9/9 scenarios for Phase 015 with no skipped test IDs
- [ ] CHK-023 [P1] NEW-055 auto-surface hook evidence captures both lifecycle points: non-memory-aware tool dispatch and compaction event
- [ ] CHK-024 [P1] NEW-056 evidence shows directive metadata fields present in retrieval results with constitutional tier classification confirmed
- [ ] CHK-025 [P1] NEW-057 evidence shows folder hierarchy ranking with self > parent > sibling score ordering verified
- [ ] CHK-026 [P1] NEW-058 evidence captures all three consolidation sub-outputs: contradiction detection, Hebbian edge strengthening, and staleness decay
- [ ] CHK-027 [P1] NEW-059 evidence captures corpus size count and confirms summary channel is active above and inert below the 5,000-memory threshold
- [ ] CHK-028 [P1] NEW-060 evidence shows supports-edges created between cross-document entities and density guard metrics recorded
- [ ] CHK-029 [P1] NEW-077 evidence shows `forceAllChannels=true` in tier-2 fallback options and multi-channel contribution in results
- [ ] CHK-030 [P0] NEW-096 evidence covers all four sub-steps: includeTrace=true, no includeTrace with env unset, env override active, and all 7 score sub-fields verified
- [ ] CHK-031 [P0] NEW-145 evidence covers both flag states: header-injected results with `[parent > child — desc]` format truncated at 100 chars, and suppressed results with no headers
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No hardcoded secrets, tokens, or credentials in any phase 015 document
- [ ] CHK-041 [P0] Sandbox corpus used for NEW-058 and NEW-060 does not contain real production memory data
- [ ] CHK-042 [P1] Env var changes for NEW-096 and NEW-145 are restored to baseline values after evidence capture
- [ ] CHK-043 [P1] NEW-060 entity linker density guard prevents runaway edge creation — density metrics captured and within configured threshold
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] spec.md, plan.md, tasks.md, and checklist.md are synchronized — no contradictions between test IDs, scenario names, or feature links across documents
- [ ] CHK-051 [P1] All ANCHOR blocks present and correctly named in all four files
- [ ] CHK-052 [P1] YAML frontmatter complete in all four files — title, description, trigger_phrases (4 each), importance_tier, and contextType fields present
- [ ] CHK-053 [P2] Findings and execution evidence saved to `memory/` via `generate-context.js` after phase completion
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] Target folder `015-retrieval-enhancements/` contains only the four spec-kit files — no stray artifacts or temp files at root level
- [ ] CHK-061 [P1] Any scratch or temp content placed in `scratch/` subdirectory only
- [ ] CHK-062 [P2] Phase 015 folder registered or referenced in the parent `014-manual-testing-per-playbook/` index if one exists
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 13 | 0/13 |
| P2 Items | 2 | 0/2 |

**Verification Date**: (pending execution)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
