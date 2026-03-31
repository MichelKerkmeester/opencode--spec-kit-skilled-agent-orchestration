---
title: "Implementation Plan: sk-code--review Promotion [03--commands-and-skills/016-sk-code-review-creation/plan]"
description: "Level 2 implementation plan for promoting sk-code--review to first-class review baseline with baseline+overlay runtime contract across skills, agents, commands, and routing."
trigger_phrases:
  - "implementation plan"
  - "sk-code--review"
  - "baseline overlay"
  - "041"
importance_tier: "important"
contextType: "implementation"
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
---
<!-- SPECKIT_LEVEL: 2 -->
# Implementation Plan: sk-code--review Promotion

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

### Overview

Implementation plan for hard-renaming the review skill package, rebuilding router logic to standards parity, wiring review runtime contracts, and closing with command-backed evidence.
---

<!-- ANCHOR:summary -->
## 2. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML + Python script updates |
| **Framework** | OpenCode skills/agents/commands + SpecKit Level 2 docs |
| **Storage** | Repo file system |
| **Testing** | `quick_validate.py`, `package_skill.py`, `skill_advisor.py`, `rg` contract checks, `validate.sh` |

### Overview

Execution is organized into six phases:
1. Rename and normalize the skill package.
2. Rebuild SKILL.md smart router + baseline/overlay precedence model.
3. Update review agents and orchestrators.
4. Sweep all review-dispatch command YAML assets.
5. Update advisor and catalog docs.
6. Run validations and finalize spec evidence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 3. QUALITY GATES

### Definition of Ready
- [x] Spec folder selected: `014-code-review-skill`.
- [x] User approved hard rename + full command sweep + baseline+overlay precedence model.
- [x] Scope list for files A-E is explicit.

### Definition of Done
- [x] `sk-code--review` package exists with updated routing contract.
- [x] Review agents + orchestrators across all runtime profiles document baseline+overlay model.
- [x] All 18 listed review-dispatch YAMLs include standards contract.
- [x] `skill_advisor.py` routes review intents correctly for targeted prompts.
- [x] Spec docs reflect actual changes and evidence.
- [x] Validation commands executed and outcomes recorded (including known validator constraint).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 4. ARCHITECTURE

### Pattern
Review baseline + stack overlay contract.

### Key Components
- **Baseline skill**: `.opencode/skill/sk-code--review/`
- **Overlay skills**: `sk-code--opencode`, `sk-code--web`, `sk-code--full-stack`
- **Review runtimes**: `.opencode/agent/review.md`, .opencode/agent/chatgpt/review.md, `.gemini/agents/review.md`, `.claude/agents/review.md`
- **Orchestration docs**: `.opencode/agent/orchestrate.md`, .opencode/agent/chatgpt/orchestrate.md, `.gemini/agents/orchestrate.md`, `.claude/agents/orchestrate.md`
- **Codex wrappers**: `.codex/agents/review.toml`, `.codex/agents/orchestrate.toml`
- **Workflow dispatch**: 18 YAMLs under `spec_kit/assets` and `create/assets`
- **Routing engine**: `.opencode/skill/scripts/skill_advisor.py`

### Data Flow
1. Review request arrives.
2. Advisor detects review intent and selects `sk-code--review`.
3. Review agent loads baseline, then one overlay from stack/codebase signals.
4. Command dispatch docs and orchestrators enforce the same contract.
5. Findings output remains findings-first, with precedence rules applied.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1: Rename + package normalization
- [x] Rename folder to `.opencode/skill/sk-code--review/`.
- [x] Remove root artifact `legacy-single-hyphen-review.zip`.
- [x] Update frontmatter/name and README package references.

### Phase 2: Router rebuild
- [x] Rebuild SKILL.md with standards-parity smart routing structure.
- [x] Add baseline+overlay logic and precedence matrix.
- [x] Add `RELATED RESOURCES` section.

### Phase 3: Runtime wiring
- [x] Update review agents across `.opencode`, `.opencode/chatgpt`, `.gemini`, and `.claude` with explicit ordered standards load contract.
- [x] Update orchestrators across `.opencode`, `.opencode/chatgpt`, `.gemini`, and `.claude` to document `@review` as baseline+overlay.
- [x] Update `.codex` wrapper agent configs so review dispatch explicitly enforces baseline+overlay.

### Phase 4: Command sweep
- [x] Update all 6 `spec_kit` review-dispatch blocks with `standards_contract`.
- [x] Update all 12 `create` review-dispatch blocks with `standards_contract` and consistent dispatch wording.

### Phase 5: Advisor + catalog updates
- [x] Update `skill_advisor.py` boosters for review/git/visual intents.
- [x] Update `.opencode/skill/README.md` skill counts and entries.
- [x] Update `.opencode/README.md` skill counts and overview row.

### Phase 6: Validation + closure docs
- [x] Run planned command checks.
- [x] Capture outcomes (including validator mismatch caveat).
- [x] Synchronize `tasks.md`, `checklist.md`, `implementation-summary.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

| Test Type | Scope | Tool/Command |
|-----------|-------|--------------|
| Skill structural validation | `sk-code--review` package | `python3 .opencode/skill/sk-doc/scripts/quick_validate.py .opencode/skill/sk-code--review --json` |
| Skill packaging | `sk-code--review` package | `python3 .opencode/skill/sk-doc/scripts/package_skill.py .opencode/skill/sk-code--review` |
| Advisor routing scenarios | review/git/visual prompts | `python3 .opencode/skill/scripts/skill_advisor.py "..." --threshold 0.8` |
| Contract consistency | command/agent docs across all runtimes | `rg -n "standards_contract|sk-code--review|baseline\+overlay" ...` |
| Spec validation | Level 2 docs | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/03--commands-and-skills/016-code-review-skill` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sk-doc` validator scripts | Internal | Known mismatch | Reported command failure for double-hyphen skill names |
| `system-spec-kit` spec validator | Internal | Pending final run | Required for completion evidence |
| Existing `sk-code--*` skills | Internal | Available | Overlay model depends on them |
| YAML command assets | Internal | Updated | Contract consistency required across all review dispatch steps |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

- **Trigger**: Routing regressions, invalid YAML, or review contract inconsistencies.
- **Procedure**:
  1. Revert changed files in scoped groups.
  2. Re-run advisor/grep/spec validations.
  3. Re-apply only proven-safe updates.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (rename) -> Phase 2 (router) -> Phase 3 (runtime docs)
                              \-> Phase 4 (commands)
Phase 3 + Phase 4 + Phase 5 -> Phase 6 (validation + closure)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | All downstream phases |
| Phase 2 | Phase 1 | Runtime wiring, command sweep |
| Phase 3 | Phase 2 | Validation/closure |
| Phase 4 | Phase 2 | Validation/closure |
| Phase 5 | Phase 2 | Validation/closure |
| Phase 6 | Phase 3 + 4 + 5 | Final completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Rename + router rebuild | Medium | 60-120 min |
| Agent/orchestrator + command sweep | Medium | 90-150 min |
| Advisor/catalog + spec closure | Medium | 60-120 min |
| **Total** | | **3-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Scope-limited file list established.
- [x] Existing files read before edits.
- [x] Contract wording standardized before final validation.

### Rollback Procedure
1. Revert scoped groups in reverse order (spec docs -> advisor/catalog -> commands -> agents -> skill package).
2. Re-run command checks.
3. Re-apply by phase with evidence capture.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: File-level revert only.
<!-- /ANCHOR:enhanced-rollback -->
