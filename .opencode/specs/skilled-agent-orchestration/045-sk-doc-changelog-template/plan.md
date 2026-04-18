<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
---
title: "Implementation Plan: Move changelog_template.md into sk-doc [045]"
description: "Path-only relocation of the canonical changelog template plus updates to the four downstream references and a sk-doc Smart Router wire-up."
trigger_phrases:
  - "045 plan"
  - "sk-doc-changelog-template plan"
  - "changelog template move plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/045-sk-doc-changelog-template"
    last_updated_at: "2026-04-18T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted Level 1 plan for changelog template relocation"
    next_safe_action: "Execute Phase 2 file moves and reference updates"
    blockers: []
    key_files:
      - ".opencode/skill/sk-doc/assets/documentation/changelog_template.md"
    session_dedup:
      fingerprint: "sha256:045-sk-doc-changelog-template"
      session_id: "045-sk-doc-changelog-template"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Move changelog_template.md into sk-doc

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML configuration |
| **Framework** | OpenCode skills + commands |
| **Storage** | Filesystem only |
| **Testing** | Manual grep verification + sk-doc Smart Router walkthrough |

### Overview
Move one markdown asset from the create-command asset folder into the sk-doc documentation asset folder, then repoint every live downstream reference. Add a CHANGELOG intent to the sk-doc Smart Router so the template surfaces through the same skill that owns every other documentation template.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Target path agreed: `.opencode/skill/sk-doc/assets/documentation/changelog_template.md`
- [x] Reference inventory complete (2 YAMLs + 1 command md + 1 spec-kit reference + sk-doc SKILL.md)
- [x] sk-git impact ruled out (commands not template path)

### Definition of Done
- [ ] Template lives under sk-doc and old path is gone
- [ ] `grep -r "command/create/assets/changelog_template" .opencode/command .opencode/skill` returns zero hits
- [ ] sk-doc Smart Router includes a CHANGELOG intent and resource map entry
- [ ] Implementation summary written with verification table
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-file relocation with a Smart Router wire-up.

### Key Components
- **changelog_template.md**: canonical changelog and release-notes template
- **create_changelog_{auto,confirm}.yaml**: structured workflows that read the template at Step 4
- **changelog.md (command)**: user-facing slash command surface
- **nested_changelog.md (spec-kit reference)**: tells authors not to reuse the global template for packet-local output
- **sk-doc SKILL.md**: Smart Router that decides which docs/templates to load per intent

### Data Flow
User invokes `/create:changelog` -> command markdown runs Setup Phase -> selects auto or confirm YAML -> Step 4 reads the template at the sk-doc path -> generated changelog written to `.opencode/changelog/{component}/v{version}.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm sk-doc/assets/documentation exists
- [x] Confirm Level 1 spec templates apply
- [x] Inventory all references via grep

### Phase 2: Core Implementation
- [ ] Copy template body into the new sk-doc path
- [ ] Delete the original file at the old command-asset path
- [ ] Replace every live reference (5 occurrences in auto YAML, 5 in confirm YAML, 1 in changelog.md, 1 in nested_changelog.md)
- [ ] Add CHANGELOG intent + RESOURCE_MAP entry + use-case mention + references entry in sk-doc SKILL.md

### Phase 3: Verification
- [ ] grep verification: zero hits for the old path under `.opencode/command/` and `.opencode/skill/`
- [ ] Read-back the moved template to confirm content parity
- [ ] Read-back sk-doc SKILL.md to confirm router wiring
- [ ] Author implementation-summary.md with the Files Changed table and verification block
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | grep for stale path references | Grep |
| Manual | content parity between old and new template | Read |
| Manual | sk-doc Smart Router resource map sanity | Read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc/assets/documentation directory | Internal | Green | None - exists today |
| `/create:changelog` command surface | Internal | Green | None - we update it in this packet |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A downstream consumer breaks because of the path change
- **Procedure**: `git revert` the packet commit. The template body is unchanged, so reverting restores the old path verbatim.
<!-- /ANCHOR:rollback -->
