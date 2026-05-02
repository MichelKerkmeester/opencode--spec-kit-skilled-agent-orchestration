---
title: "Verification Checklist: Upgrade [skilled-agent-orchestration/038-cmd-create-changelog-and-releases/checklist]"
description: "Verification checklist for 038-cmd-create-changelog-and-releases — P0/P1/P2 items covering pre-implementation, code quality, testing, security, documentation, and file organization."
trigger_phrases:
  - "changelog release checklist"
  - "038 verification"
  - "create changelog verification"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/038-cmd-create-changelog-and-releases"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["checklist.md"]
---
# Verification Checklist: Upgrade create:changelog with GitHub Release Creation

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

- [ ] CHK-001 [P0] Requirements documented in spec.md with REQ-001 through REQ-008 filled
- [ ] CHK-002 [P0] Technical approach defined in plan.md with Phases R1–R4 described
- [ ] CHK-003 [P0] All three target files read in full before any edits (`.opencode/command/create/changelog.md`, `changelog.toml`, `.opencode/skill/sk-git/references/finish_workflows.md`)
- [ ] CHK-004 [P1] PUBLIC_RELEASE.md Section 7 format confirmed and inline in Phase R2 instructions
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No placeholder text in `.opencode/command/create/changelog.md` — all sections completed with real content
- [ ] CHK-011 [P0] No placeholder text in `changelog.toml` — prompt field contains actual instruction content
- [ ] CHK-012 [P0] No placeholder text in `.opencode/skill/sk-git/references/finish_workflows.md` — cross-reference paragraph complete
- [ ] CHK-013 [P0] Release phases follow a clear sequential gate structure: R1 → R2 → R3 → R4, each phase output feeding the next
- [ ] CHK-014 [P1] Wrapper-line strip rules are explicit and tested against a real changelog sample: strips `# v...`, `> Part of ...`, `## [**...**]`; does NOT strip real content lines
- [ ] CHK-015 [P1] `:release` suffix detection added to Setup Phase alongside existing `:auto`/`:confirm` detection
- [ ] CHK-016 [P1] Phase R3 uses `git tag -a` (annotated), not lightweight tags
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria in spec.md verified: SC-001 through SC-005
- [ ] CHK-021 [P0] `changelog.toml` prompt field confirmed to match `.opencode/command/create/changelog.md` instruction body (diff check on key sections: RELEASE PHASE section, Setup Phase mode detection, INSTRUCTIONS block)
- [ ] CHK-022 [P0] `.opencode/skill/sk-git/references/finish_workflows.md` Step 6 cross-reference present and reads naturally — does not interrupt the existing release workflow narrative
- [ ] CHK-023 [P1] Error scenario paths verified in `.opencode/command/create/changelog.md`: (1) tag already exists, (2) `gh` not installed, (3) `gh auth` fails, (4) `gh release create` fails after tag push
- [ ] CHK-024 [P1] Rollback instruction for dangling tag present: `git tag -d vX.X.X.X && git push origin --delete vX.X.X.X`
- [ ] CHK-025 [P2] Plain-English release notes example in Phase R4 matches PUBLIC_RELEASE.md §7 template with "what was broken / what we did / why it matters" structure
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded credentials, tokens, or repository URLs in any modified file
- [ ] CHK-031 [P0] Release phase pre-checks `gh auth status` before any git or GitHub operations
- [ ] CHK-032 [P1] `git tag -a` (annotated) used — not `git tag` (lightweight) — to preserve author, date, and message metadata in the tag object
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md, tasks.md, and checklist.md are internally consistent — scope, requirements, and tasks all reference the same three target files
- [ ] CHK-041 [P1] `.opencode/command/create/changelog.md` RELATED RESOURCES section updated if new resources are referenced by the release phase
- [ ] CHK-042 [P2] Cross-reference from `.opencode/skill/sk-git/references/finish_workflows.md` Step 6 is bidirectional — `.opencode/command/create/changelog.md` RELATED RESOURCES or COMMAND CHAIN references `.opencode/skill/sk-git/references/finish_workflows.md`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Only three target files modified — no YAML asset files touched (`create_changelog_auto.yaml`, `create_changelog_confirm.yaml`)
- [ ] CHK-051 [P1] No temp or scratch files left uncommitted
- [ ] CHK-052 [P2] Findings and decisions saved to `memory/` using `generate-context.js` after implementation completes
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 0/10 |
| P1 Items | 10 | 0/10 |
| P2 Items | 3 | 0/3 |

**Verification Date**: 2026-03-31
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
