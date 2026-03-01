---
title: "Verification Checklist: sk-code--review Promotion [014-code-review-skill/checklist]"
description: "Level 2 verification matrix for promoting sk-code--review and wiring baseline+overlay review contract across skill, agents, commands, and routing."
SPECKIT_TEMPLATE_SOURCE: "checklist | v2.2"
trigger_phrases:
  - "verification"
  - "checklist"
  - "sk-code--review"
  - "041"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 2 -->
# Verification Checklist: sk-code--review Promotion

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

## 1. OVERVIEW

Verification matrix for completion evidence across rename, contract wiring, routing behavior, and spec closure.
---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Required for implementation closure |
| **[P1]** | Required | Must complete OR be documented with explicit rationale |
| **[P2]** | Optional | May defer with justification |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Scope and file list established in `spec.md` [Evidence: see verification notes]
- [x] CHK-002 [P0] Phase plan captured in `plan.md` [Evidence: see verification notes]
- [x] CHK-003 [P1] Execution tasks captured in `tasks.md` [Evidence: see verification notes]
<!-- /ANCHOR:pre-impl -->

---

## P0 Requirement Evidence

- [x] CHK-100 [P0] REQ-001 hard rename completed [Evidence: see verification notes]  
  Evidence: `ls -la .opencode/skill | rg "sk-code--review"` -> `sk-code--review` present; root artifact removed (`legacy-single-hyphen-review.zip` deleted).

- [x] CHK-101 [P0] REQ-002 router rebuilt to standards parity [Evidence: see verification notes]  
  Evidence: `rg -n "Resource Domains|Resource Loading Levels|Smart Router Pseudocode|Precedence Matrix|Unknown Fallback Checklist|RELATED RESOURCES" .opencode/skill/sk-code--review/SKILL.md`.

- [x] CHK-102 [P0] REQ-003 runtime contract updated in agents/orchestrators [Evidence: see verification notes]  
  Evidence: `rg -n "sk-code--review|baseline\+overlay|overlay" .opencode/agent/review.md .opencode/agent/chatgpt/review.md .opencode/agent/orchestrate.md .opencode/agent/chatgpt/orchestrate.md .gemini/agents/review.md .gemini/agents/orchestrate.md .claude/agents/review.md .claude/agents/orchestrate.md .codex/agents/review.toml .codex/agents/orchestrate.toml`.

- [x] CHK-103 [P0] REQ-004 all 18 command YAML review dispatch blocks updated [Evidence: see verification notes]  
  Evidence: `rg -n "standards_contract|baseline: \"sk-code--review\""` across all 18 listed YAML assets returned matches for each file.

- [x] CHK-104 [P0] REQ-005 review-intent routing updated [Evidence: see verification notes]  
  Evidence:
  - `python3 .opencode/skill/scripts/skill_advisor.py "review this PR for race conditions and auth bugs" --threshold 0.8` -> top `sk-code--review`.
  - `python3 .opencode/skill/scripts/skill_advisor.py "help me rebase and split commits" --threshold 0.8` -> top `sk-git`.
  - `python3 .opencode/skill/scripts/skill_advisor.py "visual review of architecture diff" --threshold 0.8` -> top `sk-doc-visual` with `sk-code--review` as secondary contender.

---

## P1 Requirement Evidence

- [x] CHK-110 [P1] REQ-006 skill indexes updated [Evidence: see verification notes]  
  Evidence: `.opencode/skill/README.md` and `.opencode/README.md` now include `sk-code--review` and 11-skill counts.

- [x] CHK-111 [P1] REQ-007 spec docs synchronized [Evidence: see verification notes]  
  Evidence: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` updated for implemented scope and results.

- [x] CHK-112 [P1] REQ-008 validation outcomes captured [Evidence: see verification notes]  
  Evidence:
  - `quick_validate.py` -> FAIL (`Name 'sk-code--review' cannot contain consecutive hyphens`).
  - `package_skill.py` -> FAIL (same validator rule).
  - Existing same failure reproduced against `.opencode/skill/sk-code--web`, confirming validator mismatch with established `sk-code--*` naming convention.

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Scope discipline maintained (scoped files only) [Evidence: see verification notes]
- [x] CHK-011 [P0] `SKILL.md` section order and anchors align with skill standards [Evidence: see verification notes]
- [x] CHK-012 [P1] Command YAML edits remain schema-safe and localized [Evidence: see verification notes]
- [x] CHK-013 [P1] Naming conventions updated to `sk-code--review` [Evidence: see verification notes]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Advisor routing scenarios executed and validated [Evidence: see verification notes]
- [x] CHK-021 [P0] Command contract grep checks executed [Evidence: see verification notes]
- [x] CHK-022 [P1] Skill validator commands executed and documented (known mismatch) [Evidence: see verification notes]
- [x] CHK-023 [P1] Spec validator run recorded (`validate.sh` -> exit 0, RESULT: PASSED) [Evidence: see verification notes]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets introduced in updated skill/agent/command docs [Evidence: see verification notes]
- [x] CHK-031 [P0] Baseline security/correctness minimums explicitly preserved in precedence rules [Evidence: see verification notes]
- [x] CHK-032 [P1] Security-focused review routing remains high-signal (`race conditions`, `auth bugs` test) [Evidence: see verification notes]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md` synchronized [Evidence: see verification notes]
- [x] CHK-041 [P1] `implementation-summary.md` created [Evidence: see verification notes]
- [x] CHK-042 [P2] Catalog docs updated (`.opencode/skill/README.md`, `.opencode/README.md`) [Evidence: see verification notes]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] All changes remain within approved scope list [Evidence: see verification notes]
- [x] CHK-051 [P1] No temporary artifacts left in spec root [Evidence: see verification notes]
- [x] CHK-052 [P2] Context source under `context/` preserved [Evidence: see verification notes]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 10 | 10/10 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-02-22
<!-- /ANCHOR:summary -->
