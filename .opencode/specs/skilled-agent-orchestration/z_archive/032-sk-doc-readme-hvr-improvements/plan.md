---
title: "Implementation Plan: sk-doc README and HVR [skilled-agent-orchestration/032-sk-doc-readme-hvr-improvements/plan]"
description: "Four-phase plan for upgrading sk-doc HVR rules, the README template, and the README creation reference."
trigger_phrases:
  - "hvr plan"
  - "readme upgrade plan"
  - "sk-doc improvement plan"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/032-sk-doc-readme-hvr-improvements"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Implementation Plan: sk-doc README and HVR Improvements

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | sk-doc reference and asset files |
| **Storage** | Git-tracked markdown files |
| **Testing** | Manual review and spec validation |

### Overview
This work upgraded three sk-doc documentation surfaces: `.opencode/skill/sk-doc/references/global/hvr_rules.md`, `.opencode/skill/sk-doc/assets/documentation/readme_template.md`, and `.opencode/skill/sk-doc/references/specific/readme_creation.md`. The packet records the research, drafting, review, and verification flow needed to land those changes without drifting from the committed repo layout.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement and scope documented in `spec.md`
- [x] Target sk-doc files identified
- [x] Exemplar READMEs and template sources inspected
- [x] Repair constrained to documentation-only changes

### Definition of Done
- [ ] All three target files reflect the intended standards upgrade
- [ ] Packet docs align with the committed repo paths
- [ ] Validator exits with no hard errors for this spec folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation standards upgrade with one core rules file, one reusable template, and one workflow reference.

### Key Components
- **Rules surface**: `.opencode/skill/sk-doc/references/global/hvr_rules.md`
- **Template surface**: `.opencode/skill/sk-doc/assets/documentation/readme_template.md`
- **Workflow surface**: `.opencode/skill/sk-doc/references/specific/readme_creation.md`
- **Supporting references**: `.opencode/skill/sk-doc/assets/skill/skill_reference_template.md`, `.opencode/skill/sk-doc/references/specific/install_guide_creation.md`, `.opencode/skill/cli-codex/SKILL.md`, and `.opencode/skill/cli-codex/assets/prompt_templates.md`

### Data Flow
The exemplars under `.opencode/skill/system-spec-kit/README.md`, `.opencode/skill/system-spec-kit/mcp_server/README.md`, and `.opencode/skill/system-spec-kit/SHARED_MEMORY_DATABASE.md` informed the pattern extraction. Those patterns then flowed into the HVR rules, the README template, and the new README creation guide.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Inspect exemplar READMEs and the sk-doc template sources
- [x] Define the HVR, template, and creation-reference upgrade goals

### Phase 2: Core Implementation
- [x] Expand `.opencode/skill/sk-doc/references/global/hvr_rules.md`
- [x] Update `.opencode/skill/sk-doc/assets/documentation/readme_template.md`
- [x] Create `.opencode/skill/sk-doc/references/specific/readme_creation.md`
- [x] Sync related routing guidance in `.opencode/skill/sk-doc/SKILL.md`
- [x] Record the cli-codex flag warning in `.opencode/skill/cli-codex/SKILL.md` and `.opencode/skill/cli-codex/assets/prompt_templates.md`

### Phase 3: Verification
- [ ] Re-run the spec validator after packet repairs
- [ ] Re-check that packet references resolve to committed repo files
- [ ] Confirm the final packet headers and anchors match the Level 2 template
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Structure verification | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Template header and anchor review plus spec validator |
| Reference verification | sk-doc and cli-codex file paths cited in this packet | Manual path check against committed repo files |
| Content sanity | HVR rules, README template, and README creation narrative | Manual comparison against the upgraded files |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skill/sk-doc/assets/skill/skill_reference_template.md` | Internal | Green | Format expectations become ambiguous |
| `.opencode/skill/sk-doc/references/specific/install_guide_creation.md` | Internal | Green | README-creation modeling loses its closest analogue |
| `.opencode/skill/system-spec-kit/README.md` | Internal | Green | README exemplar quality target becomes weaker |
| `.opencode/skill/cli-codex/SKILL.md` | Internal | Green | The routing and flag-warning follow-up loses traceability |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The packet repair misstates the landed documentation changes or points to the wrong repo files.
- **Procedure**: Revert the packet docs, then rebuild them from the committed sk-doc and cli-codex files.

<!-- ANCHOR:phase-deps -->
### L2: PHASE DEPENDENCIES
Setup feeds the standards upgrade, the standards upgrade feeds the packet summary, and the packet summary feeds validation.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
### L2: EFFORT ESTIMATION
The repair effort is moderate because the target files already landed and this pass only needs to make the packet template-safe and path-accurate.
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
### L2: ENHANCED ROLLBACK
If rollback is needed, keep the committed sk-doc and cli-codex file changes as the source of truth and roll back only the packet docs until they are rewritten accurately.
<!-- /ANCHOR:enhanced-rollback -->
<!-- /ANCHOR:rollback -->

---
