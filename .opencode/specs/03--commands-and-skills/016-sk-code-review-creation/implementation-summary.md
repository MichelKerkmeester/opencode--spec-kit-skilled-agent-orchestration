---
title: "Implementation Summary: sk-code--review Promotion [014-code-review-skill/implementation-summary]"
description: "Completion summary for promoting sk-code--review to first-class review baseline with baseline+overlay contract wiring across skill, agents, commands, advisor, and docs."
SPECKIT_TEMPLATE_SOURCE: "impl-summary-core | v2.2"
trigger_phrases:
  - "implementation summary"
  - "sk-code--review"
  - "baseline overlay"
  - "041"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `03--commands-and-skills/016-code-review-skill` |
| **Completed** | Yes (2026-02-22) |
| **Level** | 2 |
| **Current State** | Implemented with documented validator mismatch caveat |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Delivered Changes

- Hard rename completed: `.opencode/skill/legacy-single-hyphen-review/` -> `.opencode/skill/sk-code--review/`.
- Rebuilt `SKILL.md` as stack-agnostic review baseline with:
  - sk-doc-style smart routing structure,
  - weighted intent scoring,
  - ambiguity handling,
  - unknown fallback checklist,
  - baseline+overlay precedence matrix,
  - related resources section.
- Updated `@review` runtime docs across all runtime profiles (`.opencode`, `.opencode/chatgpt`, `.gemini`, `.claude`) to explicit standards-loading order:
  1. load `sk-code--review` baseline,
  2. detect stack,
  3. load one overlay (`sk-code--opencode` / `sk-code--web` / `sk-code--full-stack`),
  4. apply precedence rules.
- Updated orchestrators in all runtime profiles (`.opencode`, `.opencode/chatgpt`, `.gemini`, `.claude`) to document `@review` as baseline+overlay instead of generic `sk-code--*` only.
- Updated `.codex/agents/review.toml` and `.codex/agents/orchestrate.toml` so Codex runtime wrappers explicitly enforce the same baseline+overlay review contract while pointing to canonical chatgpt playbooks.
- Updated all 18 review-dispatch YAML assets with `standards_contract` and consistent dispatch wording.
- Updated `skill_advisor.py` review routing to prioritize `sk-code--review` for review intents while preserving git behavior and removing stale visual-skill claims from live docs.
- Updated skill catalogs (`.opencode/skill/README.md`, `.opencode/README.md`) for new skill and 11-skill counts.
- Finalized Level 2 spec docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. Read all scoped files.
2. Performed hard rename and removed stale archive artifact.
3. Rebuilt skill router and contract docs.
4. Applied contract wiring across agents, orchestrators, and all listed command assets.
5. Updated advisor intent boosts and validated with target prompts.
6. Captured verification outcomes and synchronized spec documentation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Hard rename with no compatibility alias | Required by approved plan; keeps canonical identity clear |
| Baseline+overlay precedence model | Preserves stack-specific standards while enforcing universal security/correctness minimums |
| Add `standards_contract` in each review-dispatch block | Makes command behavior explicit and consistent across workflows |
| Keep validator mismatch as documented caveat | Out-of-scope validator rule conflicts with existing `sk-code--*` naming convention |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `python3 .opencode/skill/sk-doc/scripts/quick_validate.py .opencode/skill/sk-code--review --json` | FAIL: `Name 'sk-code--review' cannot contain consecutive hyphens` |
| `python3 .opencode/skill/sk-doc/scripts/package_skill.py .opencode/skill/sk-code--review` | FAIL: same validator rule |
| `python3 .opencode/skill/sk-doc/scripts/quick_validate.py .opencode/skill/sk-code--web --json` | FAIL (same rule), confirming existing validator mismatch with established `sk-code--*` naming |
| `python3 .opencode/skill/scripts/skill_advisor.py "review this PR for race conditions and auth bugs" --threshold 0.8` | PASS: top `sk-code--review` |
| `python3 .opencode/skill/scripts/skill_advisor.py "help me rebase and split commits" --threshold 0.8` | PASS: top `sk-git` |
| Live-doc visual-skill claim cleanup in scoped spec files | PASS: removed stale target assertions from completion evidence |
| `rg -n "sk-code--review|baseline\+overlay|overlay"` across `.opencode/agent/*.md`, `.opencode/agent/chatgpt/*.md`, `.gemini/agents/*.md`, `.claude/agents/*.md`, `.codex/agents/{review,orchestrate}.toml` | PASS: baseline+overlay contract present in all runtime agent locations |
| `rg -n "standards_contract|baseline: \"sk-code--review\""` across 18 YAML assets | PASS: all target files matched |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/03--commands-and-skills/016-code-review-skill` | PASS (exit 0): all rules passed, no warnings |
<!-- /ANCHOR:verification -->

---

## Completion Criteria Status

1. Skill rename and identity migration: complete.
2. Router standards parity with baseline+overlay logic: complete.
3. Review runtime docs wiring (agents + orchestrators): complete.
4. Command review-dispatch contract sweep (18 assets): complete.
5. Advisor routing behavior for review/git prompts and live-doc visual-skill cleanup: complete.
6. Spec closure docs and evidence: complete.
7. Packaging validator pass: not achieved due known existing validator/name rule mismatch; documented with reproducible evidence.

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Current `sk-doc` validators reject consecutive hyphens in skill `name`, which conflicts with established `sk-code--*` skill naming used in this repository.
2. Because validator updates were not part of this scoped implementation, validation pass remains a documented caveat rather than a fixed item.
<!-- /ANCHOR:limitations -->
