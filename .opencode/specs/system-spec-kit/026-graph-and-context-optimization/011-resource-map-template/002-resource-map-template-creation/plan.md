---
title: "I [system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/002-resource-map-template-creation/plan]"
description: "Author the new template at the templates root and wire it through every discovery surface, with one constant edit in the MCP spec-doc classifier."
trigger_phrases:
  - "026/012 resource map plan"
  - "resource map plan"
  - "template wiring plan"
importance_tier: "normal"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/002-resource-map-template-creation"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 2 plan"
    next_safe_action: "Rerun validator"
    blockers: []
    completion_pct: 90
    open_questions: []
    answered_questions: []
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->"
---
# Implementation Plan: Resource Map Template

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + TypeScript (one constant edit) |
| **Framework** | system-spec-kit template architecture v2.2 |
| **Storage** | File system only |
| **Testing** | validate.sh --strict, npm run typecheck, grep audit |

### Overview
Author the new template at the templates root and apply coordinated edits across ~12 discovery surfaces so the template is referenced consistently. One line in the MCP spec-doc classifier changes so memory indexing recognizes the new filename.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in spec.md
- [x] Success criteria measurable (SC-001 through SC-004)
- [x] Dependencies identified (MCP typecheck, validate.sh, template precedent)

### Definition of Done
- [ ] All P0 acceptance criteria met
- [ ] validate.sh --strict on this packet exits 0
- [ ] npm run typecheck inside mcp_server exits 0
- [ ] Discovery-surface grep audit confirms references in every target file
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Cross-cutting template peer (alongside handover, research, debug-delegation) at the templates root, not under level_N.

### Key Components
- **Template file**: lives at the templates root; level-agnostic.
- **Discovery surfaces**: templates README, each level README, SKILL.md, skill README, references guide, feature catalog entry, manual testing playbook entry, CLAUDE.md.
- **Classifier integration**: one additional entry in the SPEC_DOCUMENT_FILENAMES Set so memory-save and discovery treat it as a canonical spec doc.

### Data Flow
Operator copies the template into a packet, fills path rows grouped by category, commits. Memory-save classifies the new file as a spec doc and indexes it. Reviewers open the file for a flat blast-radius view.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Inventory existing cross-cutting templates (handover, research, debug-delegation) for the file-location precedent.
- [x] Confirm Level 2 packet template structure for this phase's own docs.
- [x] Read the 005/009 path-references-audit artifact to lock in the category model.

### Phase 2: Core Implementation
- [x] Author the template at the templates root with frontmatter and ten category sections.
- [x] Append the new filename to SPEC_DOCUMENT_FILENAMES in the MCP classifier.
- [x] Update every level README and the main templates README to list the template.
- [x] Update SKILL.md, the skill README, and references/templates/level_specifications.md.
- [x] Create the feature catalog and manual testing playbook entries.
- [x] Update CLAUDE.md Documentation Levels block.

### Phase 3: Verification
- [ ] Run validate.sh --strict on this packet and capture exit 0.
- [ ] Run npm run typecheck inside mcp_server and capture exit 0.
- [ ] Grep every target surface and confirm the new filename appears.
- [ ] Finalize implementation-summary.md with Files Changed + Verification tables.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Validator | This phase packet | validate.sh --strict |
| Unit/Typecheck | MCP server spec-doc-paths Set | npm run typecheck |
| Manual | Discovery surface coverage | grep audit |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| mcp_server tsc | Internal | Green | Cannot land the classifier edit; template work still proceeds |
| validate.sh | Internal | Green | Required to confirm P0 exit 0 |
| cli-codex (with cli-copilot fallback) | External executor | Green | Surface-wiring pass cannot run autonomously; manual edits still possible |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: typecheck fails, validator does not pass, or a downstream consumer breaks on the new SPEC_DOCUMENT_FILENAMES entry.
- **Procedure**: git restore the template, README edits, references edits, classifier edit, feature catalog and playbook entries, and CLAUDE.md. Remove the phase folder if the packet is being abandoned.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 min |
| Core Implementation | Medium | 2-3 hours (coordinated across ~12 surfaces) |
| Verification | Low | 30 min |
| **Total** | | **~3-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup not required (file-system-only change).
- [ ] No feature flag (content addition, additive classifier entry).
- [ ] No monitoring changes needed.

### Rollback Procedure
1. git restore changes to templates/, SKILL.md, skill README, references/, feature_catalog/, manual_testing_playbook/, and the mcp_server classifier file.
2. git restore CLAUDE.md.
3. Remove the phase folder if abandoning the packet.
4. No smoke test required; no user-facing behavior changes.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
