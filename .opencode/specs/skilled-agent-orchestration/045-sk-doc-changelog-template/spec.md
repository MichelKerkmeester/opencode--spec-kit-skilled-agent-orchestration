<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
---
title: "Feature Specification: Move changelog_template.md into sk-doc [045]"
description: "Relocate the canonical changelog & release notes template from the create-command asset folder into sk-doc, where every other documentation template already lives. Update the changelog command YAMLs, the changelog command markdown, and the spec-kit nested-changelog reference to point at the new location."
trigger_phrases:
  - "045"
  - "sk-doc-changelog-template"
  - "changelog template move"
  - "sk-doc changelog asset"
  - "create:changelog template path"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/045-sk-doc-changelog-template"
    last_updated_at: "2026-04-18T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Initialize packet for changelog template relocation"
    next_safe_action: "Move template, update references, wire into sk-doc routing"
    blockers: []
    key_files:
      - ".opencode/skill/sk-doc/assets/documentation/changelog_template.md"
      - ".opencode/command/create/assets/create_changelog_auto.yaml"
      - ".opencode/command/create/assets/create_changelog_confirm.yaml"
      - ".opencode/command/create/changelog.md"
      - ".opencode/skill/system-spec-kit/references/workflows/nested_changelog.md"
      - ".opencode/skill/sk-doc/SKILL.md"
    session_dedup:
      fingerprint: "sha256:045-sk-doc-changelog-template"
      session_id: "045-sk-doc-changelog-template"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Target location is .opencode/skill/sk-doc/assets/documentation/changelog_template.md (matches readme/install/llmstxt/frontmatter siblings)"
      - "sk-git references the /create:changelog command surface, not the template path, so no sk-git source changes are required"
---
# Feature Specification: Move changelog_template.md into sk-doc

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-18 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The canonical changelog and release-notes template previously lived at the create-command asset path (`.opencode/command/create/assets/changelog_template`). Every other documentation template (README, install guide, llms.txt, frontmatter, feature catalog, manual playbook) lives under `.opencode/skill/sk-doc/assets/documentation/`. The mismatch hid the template from sk-doc Smart Routing and made the path inconsistent with the rest of the documentation template surface.

### Purpose
Move the template into `sk-doc/assets/documentation/`, repoint the changelog command YAMLs and the user-facing changelog command markdown at the new path, fix the spec-kit nested-changelog reference, and wire a CHANGELOG intent into the sk-doc Smart Router so the template is discoverable from the same skill that owns every other documentation template.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move the changelog template to [.opencode/skill/sk-doc/assets/documentation/changelog_template.md](../../../skill/sk-doc/assets/documentation/changelog_template.md)
- Delete the original at the former create-command asset path (`.opencode/command/create/assets/changelog_template`)
- Update `create_changelog_auto.yaml` and `create_changelog_confirm.yaml` to reference the new path
- Update [.opencode/command/create/changelog.md](../../../command/create/changelog.md) (Section 3 + Related Resources references)
- Update [.opencode/skill/system-spec-kit/references/workflows/nested_changelog.md](../../../skill/system-spec-kit/references/workflows/nested_changelog.md) (the "do not reuse global template" pointer)
- Add CHANGELOG intent + RESOURCE_MAP entry + use-case mention + references-list entry in [.opencode/skill/sk-doc/SKILL.md](../../../skill/sk-doc/SKILL.md)

### Out of Scope
- Editing the template's content. The move is path-only; the file body is preserved verbatim.
- Modifying sk-git references. sk-git points at the `/create:changelog` command surface, not at the template path, so no sk-git source changes are needed.
- Touching nested packet-local changelog templates under `.opencode/skill/system-spec-kit/templates/changelog/`. Those stay where they are.
- Re-indexing historical research/iteration logs that captured the old path. Those are frozen artifacts.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skill/sk-doc/assets/documentation/changelog_template.md | Create | Verbatim copy of the moved template |
| .opencode/command/create/assets/changelog_template.md | Delete | Removed from old location |
| .opencode/command/create/assets/create_changelog_auto.yaml | Modify | Point all references at the sk-doc path |
| .opencode/command/create/assets/create_changelog_confirm.yaml | Modify | Point all references at the sk-doc path |
| .opencode/command/create/changelog.md | Modify | Update Section 3 and Related Resources |
| .opencode/skill/system-spec-kit/references/workflows/nested_changelog.md | Modify | Update the global-template pointer |
| .opencode/skill/sk-doc/SKILL.md | Modify | Add CHANGELOG intent, RESOURCE_MAP, use-case bullet, references-list entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template lives under sk-doc | `.opencode/skill/sk-doc/assets/documentation/changelog_template.md` exists with the original body |
| REQ-002 | Old location is removed | The former create-command asset path (.opencode/command/create/assets/changelog_template) no longer exists |
| REQ-003 | Changelog command surfaces resolve to the new path | grep across `.opencode/command/create/` returns zero hits for the old path |
| REQ-004 | spec-kit nested-changelog reference resolves to the new path | grep across `.opencode/skill/system-spec-kit/` (excluding archived research artifacts) returns zero hits for the old path |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Smart Routing exposes the template | sk-doc SKILL.md has a CHANGELOG intent with weighted keywords and a RESOURCE_MAP entry pointing at the new asset |
| REQ-006 | sk-doc references list includes the template | The new path appears in the Templates list under Section 5 of SKILL.md |

### Acceptance Scenarios

1. **Given** an author runs `/create:changelog .opencode/specs/foo/042-bar :auto`, **when** the auto YAML hits Step 4 (content generation), **then** it reads the template from the sk-doc path and produces a properly formatted changelog without prompting for the template location.
2. **Given** a maintainer asks the sk-doc Smart Router about "release notes" or "changelog template", **when** intent scoring runs, **then** the CHANGELOG intent fires with weight 4 and the loader returns the new sk-doc template path (assets/documentation/changelog_template, full path under the sk-doc skill root).
3. **Given** a contributor reads the spec-kit nested-changelog reference, **when** they look for the "do not reuse the global template" pointer, **then** it resolves to the new sk-doc path rather than the deleted create-command asset path.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `/create:changelog` and `/create:changelog --release` continue to find the template at the new path with no behavioural change for the user.
- **SC-002**: A skill_advisor query containing "changelog template" or "release notes" routes through sk-doc and surfaces the new template path.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Stale references in archived research/iteration logs still cite the old path | Low | Those are frozen artifacts and out of scope; live command and skill paths are the only authoritative surfaces |
| Risk | An external script or fork hardcodes the old path | Low | The old slash command surface (`/create:assets:changelog_template`) goes away with the move; release notes will document the path change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The destination path, scope, and sk-git decision were settled in the user request.
<!-- /ANCHOR:questions -->
