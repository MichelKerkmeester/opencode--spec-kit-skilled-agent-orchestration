---
title: "Verification Checklist: Phase 008 — Rename workflows-code to sk-code in [008-sk-code-from-barter-repo/checklist]"
description: "Verification Date: —"
trigger_phrases:
  - "verification"
  - "checklist"
  - "phase"
  - "008"
  - "rename"
  - "code"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Phase 008 — Rename `workflows-code` to `sk-code` in Barter repo

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
- [ ] CHK-003 [P1] Phase 7 predecessor marked completed and non-blocking for this phase
- [ ] CHK-004 [P1] Deferred cross-skill refs (SKILL.md L46-47, L752-757) and out-of-scope suffixed variants confirmed and excluded from scope
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:filesystem -->
## Filesystem Rename

- [ ] CHK-010 [P0] `workflows-code/` skill folder renamed to `sk-code/` in Barter repo (Evidence: `test -d .opencode/skill/sk-code` = present)
- [ ] CHK-011 [P0] No `workflows-code/` folder alias remains under `.opencode/skill/` in Barter repo (Evidence: `test -d .opencode/skill/workflows-code` = missing)
- [ ] CHK-012 [P0] All ~88 internal files present in new `sk-code/` folder (Evidence: `find .opencode/skill/sk-code -type f | wc -l` ≈ 88)
<!-- /ANCHOR:filesystem -->

---

<!-- ANCHOR:internal-content -->
## Internal Content Updates (4 files, 6 lines)

- [ ] CHK-020 [P0] SKILL.md L2 updated — `name: workflows-code` → `name: sk-code` (Evidence: bare-token scan in `sk-code/` returns 0 matches)
- [ ] CHK-021 [P0] SKILL.md L10 updated — keywords comment updated (Evidence: bare-token scan in `sk-code/` returns 0 matches)
- [ ] CHK-022 [P0] SKILL.md L653 updated — directory tree reference updated (Evidence: bare-token scan in `sk-code/` returns 0 matches)
- [ ] CHK-023 [P1] references/stack_detection.md L21 updated — prose skill name updated (Evidence: bare-token scan in `sk-code/references/` returns 0 matches)
- [ ] CHK-024 [P1] assets/debugging_checklist.md L242 updated — link label updated (Evidence: bare-token scan in `sk-code/assets/` returns 0 matches)
- [ ] CHK-025 [P1] assets/verification_checklist.md L225 updated — link label updated (Evidence: bare-token scan in `sk-code/assets/` returns 0 matches)
<!-- /ANCHOR:internal-content -->

---

<!-- ANCHOR:external-refs -->
## External Reference Updates (8 files, ~35 lines)

### skill_advisor.py (27 bare `workflows-code` entries)

- [ ] CHK-030 [P0] skill_advisor.py INTENT_BOOSTERS updated (L256-277, 17 entries) — `workflows-code` → `sk-code` (Evidence: `python3 .opencode/skill/scripts/skill_advisor.py "code standards"` routes to `sk-code`)
- [ ] CHK-031 [P0] skill_advisor.py MULTI_SKILL_BOOSTERS updated (L302-315, 10 entries) — `workflows-code` → `sk-code` (Evidence: same smoke output passes threshold for `sk-code`)

### system-spec-kit SKILL.md (2 lines)

- [ ] CHK-032 [P1] system-spec-kit/SKILL.md L699 updated — routing chain uses `sk-code` (Evidence: bare-token scan in `system-spec-kit/SKILL.md` returns 0 `workflows-code` matches)
- [ ] CHK-033 [P1] system-spec-kit/SKILL.md L725 updated — skill table uses `sk-code` (Evidence: bare-token scan in `system-spec-kit/SKILL.md` returns 0 `workflows-code` matches)

### system-spec-kit references/ (5 files, 1 line each)

- [ ] CHK-034 [P1] system-spec-kit/references/validation/phase_checklists.md L192 updated (Evidence: bare-token scan returns 0 `workflows-code` matches)
- [ ] CHK-035 [P1] system-spec-kit/references/workflows/quick_reference.md L688 updated (Evidence: bare-token scan returns 0 `workflows-code` matches)
- [ ] CHK-036 [P1] system-spec-kit/references/memory/epistemic-vectors.md L410 updated (Evidence: bare-token scan returns 0 `workflows-code` matches)
- [ ] CHK-037 [P1] system-spec-kit/references/templates/level_specifications.md L817 updated (Evidence: bare-token scan returns 0 `workflows-code` matches)
- [ ] CHK-038 [P1] system-spec-kit/references/templates/template_guide.md L1133 updated (Evidence: bare-token scan returns 0 `workflows-code` matches)

### system-spec-kit assets/ (1 file, 1 line)

- [ ] CHK-039 [P1] system-spec-kit/assets/level_decision_matrix.md L363 updated (Evidence: bare-token scan returns 0 `workflows-code` matches)
<!-- /ANCHOR:external-refs -->

---

<!-- ANCHOR:changelog -->
## Changelog & Version Bump

- [ ] CHK-040 [P1] CHANGELOG entry `## 2026-02-21` added to `sk-code/SKILL.md` with rename description (Evidence: SKILL.md contains `## 2026-02-21` section with `### Updated` subsection)
- [ ] CHK-041 [P1] Version bumped from 6.0.0 in `sk-code/SKILL.md` (Evidence: version field > 6.0.0)
<!-- /ANCHOR:changelog -->

---

<!-- ANCHOR:deferred -->
## Deferred Items Confirmation

- [ ] CHK-045 [P1] SKILL.md L46-47 — refs to `workflows-git/documentation` paths are unchanged (confirmed deferred) (Evidence: spot-check shows lines unmodified)
- [ ] CHK-046 [P1] SKILL.md L752-757 — Related Skills table refs to `workflows-documentation`, `workflows-git`, `workflows-chrome-devtools` are unchanged (confirmed deferred) (Evidence: spot-check shows lines unmodified)
- [ ] CHK-047 [P2] Out-of-scope `README.md` and `config.jsonc` suffixed variants (`workflows-code--full-stack`, `workflows-code--web-dev`, `workflows-code--opencode`) are unchanged (Evidence: bare scan confirms no modification to these files under this phase)
<!-- /ANCHOR:deferred -->

---

<!-- ANCHOR:verification -->
## Verification

- [ ] CHK-050 [P0] Bare-token scan across active-path Barter target set returns 0 `workflows-code` matches (Evidence: `rg` over `.opencode/skill/` in Barter repo returns no matches; exit code 1)
- [ ] CHK-051 [P0] `python3 .opencode/skill/scripts/skill_advisor.py "code standards"` returns `sk-code` (Evidence: confidence pass, `passes_threshold: true`)
- [ ] CHK-052 [P0] Folder `.opencode/skill/sk-code/` exists in Barter repo with ~88 files (Evidence: `find .opencode/skill/sk-code -type f | wc -l` ≈ 88)
- [ ] CHK-053 [P1] Original `workflows-code/` folder is absent in Barter repo `.opencode/skill/` (Evidence: `test -d .opencode/skill/workflows-code` = missing)
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-060 [P1] Spec/plan/tasks synchronized for active-path scope (Evidence: tasks/checklist completion aligned to verification commands in plan/spec)
- [ ] CHK-061 [P2] Scope preserved — no cross-skill or suffixed-variant cleanup added beyond documented scope (Evidence: verification claims limited to phase active-path Barter target set)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 19 | 0/19 |
| P2 Items | 2 | 0/2 |

**Verification Date**: —
<!-- /ANCHOR:summary -->
