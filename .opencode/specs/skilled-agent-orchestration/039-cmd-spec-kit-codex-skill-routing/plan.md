---
title: "Implementation Plan: Codex command discoverability routing update [03--commands-and-skills/039-cmd-spec-kit-codex-skill-routing/plan]"
description: "This plan updates the existing Level 1 packet so it preserves the original four-command recommendation while recording the approved expanded all-commands quick-reference direction and downstream docs scope."
trigger_phrases:
  - "codex shortlist plan"
  - "quick reference plan"
  - "system-spec-kit discoverability plan"
  - "039 plan"
importance_tier: "normal"
contextType: "research"
---
# Implementation Plan: Codex command discoverability routing update

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation in `.opencode/specs/` and `.opencode/skill/` |
| **Framework** | OpenCode spec-folder workflow and skill reference docs |
| **Storage** | None |
| **Testing** | `validate.sh --strict` plus manual content review |

### Overview
The research work is already done in the packet research document. This plan updates the Level 1 docs so the packet keeps the original four-command recommendation visible, records the explicit user override to include all commands in the short list, and points the downstream work at the quick reference as the primary surface with `.opencode/skill/system-spec-kit/SKILL.md` as a pointer only.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research packet exists and is complete under `research/`
- [x] Scope is limited to this spec folder
- [x] Level 1 template files were read before writing
- [x] User override is explicit: "add all commands though in short list"

### Definition of Done
- [ ] `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, and `research/research.md` are updated where needed
- [ ] Each relevant file distinguishes the original research recommendation from the chosen implementation direction
- [ ] The exact four-command shortlist is documented as the minimal recommendation
- [ ] The exact 12-command surface is documented as the approved implementation direction
- [ ] The quick reference is named as the primary target and `.opencode/skill/system-spec-kit/SKILL.md` as pointer only
- [ ] Spec validation returns exit code 0 or 1
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Packet documentation refresh for a completed research workflow with downstream docs-update scope recorded.

### Key Components
- **`research/research.md`**: Source of truth for the investigation, findings, and recommendation.
- **`spec.md`**: Records the problem, scope, override, and success criteria for this packet update.
- **`plan.md`**: Describes how the packet is updated and how downstream docs changes should be framed.
- **`tasks.md`**: Tracks the scoped packet refresh work.
- **`implementation-summary.md`**: States what the packet now records and what still belongs downstream.
- **Downstream target files**: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md` as the primary surface and `.opencode/skill/system-spec-kit/SKILL.md` as pointer only.

### Data Flow
`research/research.md` provides the original conclusion and recommendation. The Level 1 docs summarize that result, record the user's override, and hand a future implementer a concrete downstream docs change: expand the quick-reference short list to include all 12 commands while keeping `.opencode/skill/system-spec-kit/SKILL.md` non-duplicative.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Source Review
- [x] Read the existing research packet
- [x] Read the current Level 1 templates
- [x] Read the existing Level 1 packet docs in this folder
- [x] Confirm the target folder stays the only packet in scope

### Phase 2: Packet Update
- [ ] Update `spec.md` with the original research recommendation and the approved expanded direction
- [ ] Update `plan.md` with the downstream quick-reference and skill-pointer rules
- [ ] Update `tasks.md` to track the refreshed packet scope
- [ ] Update `implementation-summary.md` to describe this packet update honestly
- [ ] Update `research/research.md` to note the user override without rewriting the original conclusion

### Phase 3: Verification
- [ ] Run spec validation on the folder
- [ ] Confirm no placeholder text remains
- [ ] Confirm wording matches the research conclusion, the user override, and current repo state
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Validation | Required Level 1 files exist and match template structure | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` |
| Content review | Research conclusion, override, expanded command surface, and downstream docs scope are stated clearly | Read tool |
| Scope review | No files outside this spec folder are modified | Git status and file paths |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `research/research.md` | Internal | Green | The packet cannot be summarized accurately without it |
| `.opencode/skill/system-spec-kit/templates/level_1/` | Internal | Green | The docs must follow current template structure |
| User override decision | Internal | Green | The packet would misstate the chosen implementation direction without it |
| `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Internal | Green | Completion cannot be claimed without validation evidence |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Validation reveals structural issues or the packet content misstates either the original research finding or the later override.
- **Procedure**: Update only the touched packet docs in this folder, then re-run validation. No downstream skill files need rollback because they are not changed in this phase.
<!-- /ANCHOR:rollback -->

---
