---
title: "Implementation Summary [03--commands-and-skills/036-sk-deep-research-review-split/implementation-summary]"
description: "Repository artifacts show that review mode was split out of sk-deep-research into a dedicated sk-deep-review skill and command."
template_source_header: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
trigger_phrases:
  - "036 implementation summary"
  - "deep-review split summary"
  - "review mode split shipped"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/036-sk-deep-research-review-split"
    last_updated_at: "2026-04-13T10:38:46Z"
    last_updated_by: "copilot"
    recent_action: "Synced implementation evidence links and packet continuity metadata"
    next_safe_action: "Sync evidence if docs change"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/036-sk-deep-research-review-split/implementation-summary.md"
      - ".opencode/skill/skill-advisor/scripts/skill_advisor.py"
      - ".opencode/skill/sk-deep-review/graph-metadata.json"
      - ".opencode/skill/sk-deep-research/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:036-sk-deep-research-review-split"
      session_id: "036-sk-deep-research-review-split"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Advisor evidence calibration now separates graph-heavy matches and deep sibling edges were removed."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 036-sk-deep-research-review-split |
| **Completed** | 2026-03-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Repository changelog and handover artifacts show that the unified review-mode half of `sk-deep-research` was split into a dedicated `sk-deep-review` skill and command. The result is a clearer separation between investigation workflows and iterative code auditing.

### Dedicated review skill and command

`sk-deep-review` was created as a standalone package with its own command entrypoint, references, assets, and testing playbook. That replaced the older `/spec_kit:deep-research:review` path with `/spec_kit:deep-review`.

### Research-only deep-research package

`sk-deep-research` was reduced to investigation-oriented behavior. Review triggers, review architecture guidance, and review-specific examples were removed so the skill no longer tries to serve both purposes at once.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/sk-deep-review/` | Created | Introduce the dedicated review skill package |
| `.opencode/command/spec_kit/deep-review.md` | Created | Add the new review command |
| `.opencode/skill/sk-deep-research/` | Modified | Remove review-mode content and keep research-focused guidance |
| `.agents/commands/spec_kit/deep-review.toml` | Created | Add runtime wrapper support for the new command |
| `AGENTS.md`, `CLAUDE.md`, `README.md` | Modified | Update top-level documentation for the split |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation was delivered as coordinated documentation, wrapper, and routing updates. The repository changelog records the shipped outcome, and the session handover notes that foundation work plus the remaining implementation phases were completed through parallel agent-driven edits across command docs, review references, YAML workflows, and runtime definitions.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Create `sk-deep-review` instead of keeping a review suffix under `sk-deep-research` | Review and research are different workflows with different triggers, artifacts, and success criteria |
| Keep `sk-deep-research` research-only after the split | A narrower skill is easier to route, explain, and maintain |
| Document the rename as a breaking change | Existing users needed a direct migration path from `/spec_kit:deep-research:review` to `/spec_kit:deep-review` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Repository changelog entry | PASS - `.opencode/changelog/13--sk-deep-review/v1.0.0.0.md` documents the split, created files, and breaking rename |
| Session handover evidence | PASS - `.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/handover.md` records the phased implementation and follow-up verification work |
| Compliance repair accuracy | PASS - This repair reconstructed the missing spec docs from existing repository artifacts without inventing new implementation claims |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Reconstructed planning docs** The original planning files were missing from this spec folder, so the spec, plan, tasks, and checklist were recreated from surviving changelog and handover evidence.
2. **Deferred follow-up work** The handover still lists automation and replay-harness follow-ups that were outside the split itself.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
