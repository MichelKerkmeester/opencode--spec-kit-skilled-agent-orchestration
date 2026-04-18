<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
---
title: "Implementation Summary: Move changelog_template.md into sk-doc [045]"
description: "The canonical changelog and release-notes template now lives next to every other documentation template in sk-doc. Smart Routing exposes it on changelog or release-notes intents, the changelog command surfaces resolve to the new path, and the spec-kit nested-changelog reference points at sk-doc instead of the deleted create-command asset path."
trigger_phrases:
  - "045 implementation summary"
  - "sk-doc-changelog-template summary"
  - "changelog template move done"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/045-sk-doc-changelog-template"
    last_updated_at: "2026-04-18T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Completed template relocation, reference updates, and sk-doc Smart Router wire-up"
    next_safe_action: "Commit the packet on the active branch when the user is ready"
    blockers: []
    key_files:
      - ".opencode/skill/sk-doc/assets/documentation/changelog_template.md"
      - ".opencode/skill/sk-doc/SKILL.md"
      - ".opencode/command/create/assets/create_changelog_auto.yaml"
      - ".opencode/command/create/assets/create_changelog_confirm.yaml"
      - ".opencode/command/create/changelog.md"
      - ".opencode/skill/system-spec-kit/references/workflows/nested_changelog.md"
    session_dedup:
      fingerprint: "sha256:045-sk-doc-changelog-template"
      session_id: "045-sk-doc-changelog-template"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Target location is sk-doc/assets/documentation/changelog_template.md (confirmed by file siblings)"
      - "sk-git changelog references stay command-pointing, so no sk-git source changes were needed"
      - "Old slash-command surface /create:assets:changelog_template goes away with the move (verified absent in skill list mid-run)"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/global/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 045-sk-doc-changelog-template |
| **Completed** | 2026-04-18 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The canonical changelog and release-notes template now sits next to every other documentation template inside sk-doc. Authors no longer have to remember that one template lives in the create-command asset folder while the rest live in sk-doc, and the sk-doc Smart Router can surface it on changelog or release-notes intents alongside README, install-guide, and llms.txt templates.

### Template relocation

The 7,718-byte template was copied verbatim to [.opencode/skill/sk-doc/assets/documentation/changelog_template.md](../../../skill/sk-doc/assets/documentation/changelog_template.md) and the original was deleted. File parity was confirmed by size and by reading the new file end-to-end before the delete. No content was edited during the move.

### Reference updates

Both `/create:changelog` YAMLs (auto and confirm), the user-facing changelog command markdown, and the spec-kit nested-changelog reference now resolve to the sk-doc path. A grep for the old path under `.opencode/command/` and `.opencode/skill/` returns zero hits in live source files. The only remaining matches are this packet's own docs (intentional), a frozen historical changelog at `.opencode/changelog/04--commands/v3.0.1.4` documenting the original creation, and frozen research and review iteration logs.

### sk-doc Smart Router wire-up

A new CHANGELOG intent was added to `INTENT_SIGNALS` (weight 4, keywords include "changelog", "release notes", "changelog template", "release template", "create changelog", "github release"), a matching `RESOURCE_MAP` entry returns the new template path, the resource-domain bullet for `assets/documentation/` was extended to mention changelog and release-notes templates, the `WHEN TO USE` section gained a Changelog & Release Notes use case, and the Templates list under Section 5 now links to the moved file.

### sk-git impact

sk-git references the `/create:changelog` command surface (in finish_workflows reference and elsewhere), not the template path itself. A grep for `changelog_template` under `.opencode/skill/sk-git/` returns zero hits, so no sk-git source files were modified. The user-facing slash command `/create:changelog` continues to work without behavioural change.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| .opencode/skill/sk-doc/assets/documentation/changelog_template.md | Created | Canonical changelog and release-notes template, moved from the create-command asset folder |
| .opencode/command/create/assets/changelog_template.md | Deleted | Old location removed |
| .opencode/command/create/assets/create_changelog_auto.yaml | Modified | Five path references repointed at sk-doc |
| .opencode/command/create/assets/create_changelog_confirm.yaml | Modified | Five path references repointed at sk-doc |
| .opencode/command/create/changelog.md | Modified | Section 3 canonical-template reference repointed at sk-doc |
| .opencode/skill/system-spec-kit/references/workflows/nested_changelog.md | Modified | "Do not reuse global template" pointer repointed at sk-doc |
| .opencode/skill/sk-doc/SKILL.md | Modified | Added CHANGELOG intent, RESOURCE_MAP entry, use-case mention, references-list entry, and updated assets/documentation domain bullet |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work was a single-pass refactor: copy + delete + repoint references + wire the Smart Router. Every change was verified by grep (zero stale references in live source) and by `validate_document.py` on the modified sk-doc SKILL document (zero issues, document type skill). The spec folder validator was run after each round of edits until it reached PASSED.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Place the template under `assets/documentation/` rather than `assets/skill/` or `assets/agents/` | The siblings (README, install guide, llms.txt, frontmatter, feature catalog, manual playbook) all live in `assets/documentation/`. Putting changelog there makes the documentation-template surface fully discoverable. |
| Leave sk-git alone | sk-git references the `/create:changelog` command, not the template path. Adding a sk-git edit would expand scope without changing behaviour. |
| Add a dedicated `CHANGELOG` intent at weight 4 instead of folding the keywords into `DOC_QUALITY` | Matches the weight already used for other template-bearing intents (README_CREATION, AGENT_COMMAND, PLAYBOOK, FEATURE_CATALOG) and keeps Smart Router scoring consistent. |
| Skip historical-artifact cleanup (frozen changelog and research logs that mention the old path) | The user explicitly scoped this to live commands and sk-git; rewriting historical artifacts adds churn without value and breaks audit trails. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| validate_document.py on sk-doc/SKILL (`python3 .opencode/skill/sk-doc/scripts/validate_document.py` against the modified skill document) | PASS, 0 issues |
| Grep for `command/create/assets/changelog_template` under `.opencode/command/` and `.opencode/skill/` | PASS, zero hits in live source files (only matches in this packet's own docs and frozen historical artifacts) |
| File parity check on the moved template | PASS, 7,718 bytes both before and after the move |
| Skill list mid-run shows `/create:assets:changelog_template` is gone | PASS, the old slash command surface is no longer registered |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh` on the new spec folder | PASS after fixing template-source headers, acceptance scenarios, prose paths, and adding `description.json` and `graph-metadata.json` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Frozen historical references** The frozen changelog at `.opencode/changelog/04--commands/v3.0.1.4` and several research/review iteration logs still cite the old path. These are audit artifacts and were intentionally left untouched.
<!-- /ANCHOR:limitations -->
