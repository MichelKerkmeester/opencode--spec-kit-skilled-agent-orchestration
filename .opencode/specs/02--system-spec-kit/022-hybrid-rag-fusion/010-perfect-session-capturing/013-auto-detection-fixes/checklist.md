---
title: "Verification Checklist: Auto-Detection Fixes [template:level_2/checklist.md]"
---
# Verification Checklist: Auto-Detection Fixes

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
- [ ] CHK-004 [P1] R-11 (session source validation) status assessed; proceed independently if not yet landed
- [ ] CHK-005 [P1] Existing detection cascade priority levels reviewed (Priority 1 through 3) in `folder-detector.ts`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Git-status Priority 2.7 signal correctly filters `git status --porcelain` to spec paths and ranks by file count (REQ-001)
- [ ] CHK-011 [P0] Parent folder with 24 untracked files receives highest git-status score over child folders (SC-001)
- [ ] CHK-012 [P0] Decision dedup guard: `decisionObservations = []` when `processedManualDecisions.length > 0` at `decision-extractor.ts:260-261` (REQ-002)
- [ ] CHK-013 [P0] 4 manual decisions produce exactly 4 decision records in rendered output, not 8 (SC-002)
- [ ] CHK-014 [P0] Tree-thinning uses actual file content instead of `f.DESCRIPTION` for clustering (REQ-003)
- [ ] CHK-015 [P0] `key_files` filesystem fallback lists `*.md/*.json` from spec folder when post-thinning is empty (REQ-003, SC-003)
- [ ] CHK-016 [P1] `SessionActivitySignal` interface created with correct fields: `toolCallPaths`, `gitChangedFiles`, `transcriptMentions`, `confidenceBoost` (REQ-004)
- [ ] CHK-017 [P1] `buildSessionActivitySignal()` applies correct boosts: `0.1/mention`, `0.2/Read`, `0.3/Edit|Write`, `0.25/git-changed-file` (REQ-004)
- [ ] CHK-018 [P1] Parent-affinity boost activates only when parent has >3 children with recent mtime (REQ-005)
- [ ] CHK-019 [P1] Blocker validation rejects markdown headers, code fragments, and quote transition artifacts (REQ-006, SC-004)
- [ ] CHK-020 [P1] `memory_classification`, `session_dedup`, `causal_links` wired from extractors into template output (REQ-007)
- [ ] CHK-021 [P1] Git-status output cached per detection run to avoid repeated shell calls
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-025 [P0] Unit test: git-status signal file count ranking, spec path filtering, caching (Vitest)
- [ ] CHK-026 [P0] Unit test: decision dedup -- 4 manual decisions in, exactly 4 records out (Vitest)
- [ ] CHK-027 [P0] Unit test: `key_files` non-empty with real file content tree-thinning + filesystem fallback (Vitest)
- [ ] CHK-028 [P1] Unit test: session activity signal confidence boost calculation per signal type (Vitest)
- [ ] CHK-029 [P1] Unit test: blocker validation rejects structural artifacts, preserves valid blockers (Vitest)
- [ ] CHK-030 [P1] Integration test: end-to-end detection on parent/child structure selects parent correctly (Vitest)
- [ ] CHK-031 [P1] Integration test: full pipeline render includes `memory_classification`, `session_dedup`, `causal_links` (Vitest)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-035 [P2] `git status --porcelain` execution does not expose sensitive file paths beyond spec directories
- [ ] CHK-036 [P2] File content read for tree-thinning limited to first ~500 chars, not full file contents
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md reflects final implementation scope
- [ ] CHK-041 [P1] plan.md updated with any deviations from original approach
- [ ] CHK-042 [P2] implementation-summary.md created after implementation completes
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P2] Findings saved to memory/
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | [ ]/9 |
| P1 Items | 16 | [ ]/16 |
| P2 Items | 4 | [ ]/4 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->
