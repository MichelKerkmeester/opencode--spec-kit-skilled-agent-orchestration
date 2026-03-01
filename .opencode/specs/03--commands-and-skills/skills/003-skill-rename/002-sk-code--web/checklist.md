---
title: "Verification Checklist: Phase 002 — Rename workflows-code--web-dev to sk-code--web [002-sk-code--web/checklist]"
description: "Verification Date: 2026-02-21"
trigger_phrases:
  - "verification"
  - "checklist"
  - "phase"
  - "002"
  - "rename"
  - "code"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Phase 002 — Rename workflows-code--web-dev to sk-code--web

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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified: Phases 1 and 3 must complete first
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:filesystem -->
## Filesystem Rename

- [x] CHK-010 [P0] `workflows-code--web-dev` folder renamed to `sk-code--web` (Evidence: canonical folder `.opencode/skill/sk-code--web` present)
- [x] CHK-011 [P0] No `workflows-code--web-dev` folder remains (Evidence: active-target full-name grep returns exit `1`)
- [x] CHK-012 [P0] All 51 internal files present in new folder (Evidence: `rg --files .opencode/skill/sk-code--web | wc -l` -> `51`)
<!-- /ANCHOR:filesystem -->

---

<!-- ANCHOR:internal-content -->
## Internal Content Updates (51 files)

- [x] CHK-020 [P0] SKILL.md updated — name, title, self-references (Evidence: old-name grep closure in active targets)
- [x] CHK-021 [P0] index.md updated — name, description (Evidence: old-name grep closure in active targets)
- [x] CHK-022 [P0] nodes/*.md updated (~8 files) — cross-refs, self-refs (Evidence: old-name grep closure in active targets)
- [x] CHK-023 [P1] references/*.md updated (~8 files) — hard-coded paths (Evidence: old-name grep closure in active targets)
- [x] CHK-024 [P1] assets/*.md updated (~25 files) — template paths, examples (Evidence: old-name grep closure in active targets)
- [x] CHK-025 [P1] scripts/*.{sh,mjs} updated (~5 files) — paths (Evidence: old-name grep closure in active targets)
<!-- /ANCHOR:internal-content -->

---

<!-- ANCHOR:external-refs -->
## External Reference Updates (17 files)

- [x] CHK-030 [P0] skill_advisor.py INTENT_BOOSTERS updated (25 lines) (Evidence: `implement feature` smoke routes to `sk-code--web` at threshold `0.8`)
- [x] CHK-031 [P0] skill_advisor.py MULTI_SKILL_BOOSTERS updated (Evidence: full-name and bare-name legacy scans return exit `1`)
- [x] CHK-032 [P0] Agent orchestrate.md files updated (4 runtimes) (Evidence: active-target legacy scans return exit `1`)
- [x] CHK-033 [P0] Agent review.md files updated (4 runtimes) (Evidence: active-target legacy scans return exit `1`)
- [x] CHK-034 [P1] Install guides updated (2 files) (Evidence: active-target legacy scans return exit `1`)
- [x] CHK-035 [P1] Root docs updated (CLAUDE.md, .opencode/README.md) (Evidence: root-doc legacy scans return exit `1`)
<!-- /ANCHOR:external-refs -->

---

<!-- ANCHOR:bare-refs -->
## Bare Reference Resolution

- [x] CHK-040 [P0] All bare `workflows-code` references resolved to `sk-code--web` or `sk-code--*` (Evidence: `rg -nP "\\bworkflows-code\\b(?!--)"` exit `1`)
- [x] CHK-041 [P1] No stale `workflows-code/` path references remain (Evidence: active-target legacy path scans return exit `1`)
<!-- /ANCHOR:bare-refs -->

---

<!-- ANCHOR:cross-refs -->
## Cross-Skill References

- [x] CHK-045 [P1] References to `workflows-code--web-dev` in other skill folders updated (Evidence: active-target full-name scan returns exit `1`)
- [x] CHK-046 [P1] Changelog directory renamed: `08--sk-code--web` (Evidence: phase completion artifacts reflect renamed changelog path)
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:verification -->
## Verification

- [x] CHK-050 [P0] grep verification: 0 matches for `workflows-code--web-dev` in active files (Evidence: full-name scan exit `1`)
- [x] CHK-051 [P0] grep verification: 0 bare `workflows-code` references (Evidence: bare-name scan exit `1`)
- [x] CHK-052 [P0] skill_advisor.py returns `sk-code--web` for test queries (Evidence: `implement feature` -> `sk-code--web`, confidence `0.80`)
- [x] CHK-053 [P0] Folder `.opencode/skill/sk-code--web/` exists with complete contents (Evidence: 51 files counted)
- [x] CHK-054 [P1] No broken relative paths (Evidence: no stale legacy references in active-target scans)
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-060 [P1] Spec/plan/tasks synchronized (Evidence: completion status and verification date aligned on 2026-02-21)
- [x] CHK-061 [P2] Findings saved to memory/ (Evidence: phase 002 included in `generate-context.js` indexed batch `#87-#93`)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 17/17 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-02-21
<!-- /ANCHOR:summary -->
