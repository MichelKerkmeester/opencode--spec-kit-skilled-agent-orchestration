---
title: "Implementation Summary [03--commands-and-skills/036-sk-deep-research-review-split/implementation-summary]"
description: "Repository artifacts show that review mode was split out of sk-deep-research into a dedicated sk-deep-review skill and command."
trigger_phrases:
  - "036 implementation summary"
  - "deep-review split summary"
  - "review mode split shipped"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
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
| Repository changelog entry | PASS - `.opencode/changelog/00--opencode-environment/v3.0.1.1.md` documents the split, created files, and breaking rename |
| Session handover evidence | PASS - `.opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/handover.md` records the phased implementation and follow-up verification work |
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
