---
title: "Changelog: Codex command discoverability routing update [039]"
description: "Chronological changelog for Packet 039 covering the patch-level documentation update to the Codex command discoverability routing packet."
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

## 2026-04-03

### Changed
- The packet documentation was updated to preserve the original four-command research recommendation while separately recording the approved all-commands short-list override.
- The packet now states the downstream implementation target clearly: update `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md` first and keep `.opencode/skill/system-spec-kit/SKILL.md` as a pointer-only surface.
- This is a patch-level documentation update for the Packet 039 record only. It does not claim that the downstream quick-reference or skill-file edits have already shipped.

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/specs/03--commands-and-skills/039-cmd-spec-kit-codex-skill-routing/spec.md` | Updated the packet scope, requirements, and success criteria so the original research finding and the later user override are both recorded accurately. |
| `.opencode/specs/03--commands-and-skills/039-cmd-spec-kit-codex-skill-routing/plan.md` | Updated the plan to frame the packet refresh and point future implementation toward the quick reference as the primary downstream target. |
| `.opencode/specs/03--commands-and-skills/039-cmd-spec-kit-codex-skill-routing/tasks.md` | Updated the task list to track the packet refresh and verification work inside the 039 folder. |
| `.opencode/specs/03--commands-and-skills/039-cmd-spec-kit-codex-skill-routing/implementation-summary.md` | Updated the implementation summary to describe what changed in the packet and what still remains downstream. |
| `.opencode/specs/03--commands-and-skills/039-cmd-spec-kit-codex-skill-routing/research/research.md` | Updated the research record to keep the four-command recommendation intact while noting the approved expanded implementation direction. |

### Verification
- Spec packet reviewed against `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, and `research/research.md` before changelog creation.
- Packet scope check confirms this changelog only reflects the five files actually changed inside Packet 039.
