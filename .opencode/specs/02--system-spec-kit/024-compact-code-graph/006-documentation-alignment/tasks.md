---
title: "Tasks: Documentation Alignment [024/006]"
description: "Task tracking for documentation updates covering hooks, feature catalog, playbook, and cross-references."
---
# Tasks: Phase 006 — Documentation Alignment

## Completed

- [x] Create feature catalog entries for PreCompact Hook, SessionStart Priming, Stop Token Tracking, Cross-Runtime Fallback, Runtime Detection, CocoIndex Integration — entries in `.opencode/skill/system-spec-kit/feature_catalog/`
- [x] Create manual testing playbook scenarios for each hook type and cross-runtime fallback — 11 playbook files in category 22 enhanced with prereqs, sub-scenarios, pass/fail criteria; dedicated cross-runtime consistency playbook remains a future gap
- [x] Update SKILL.md with Hook System section — lifecycle, registration (`.claude/settings.local.json`), script locations, design principle (hooks = transport)
- [x] Update SKILL.md with Code Graph section — CocoIndex (semantic) + Code Graph (structural) + Memory (session) complementary architecture
- [x] Update ARCHITECTURE.md with hook architecture diagram — Mermaid diagram section added covering PreCompact -> cache -> SessionStart -> inject lifecycle
- [x] Update ARCHITECTURE.md with token tracking data flow — current wording should use `session-stop.ts`, `pendingStopSave`, and JSON hook-state files; dedicated runtime adapter docs remain a future gap
- [x] Capture root `README.md` context preservation status accurately — not delivered in Phase 006 and tracked as a future gap
- [x] Update `.opencode/skill/system-spec-kit/README.md` with hook features in feature list
- [x] Update `.opencode/skill/README.md` with revised system-spec-kit description
- [x] Update `AGENTS.md` to reflect Phase 005 agent definition changes
- [x] Update `AGENTS_example_fs_enterprises.md` where relevant
- [x] All feature catalog entries follow existing format conventions
- [x] All playbook scenarios include prerequisites, steps, and expected results
- [x] Consistent terminology across all documentation (hooks, context injection, runtime detection)
- [x] Capture reference-doc status accurately — no spec-local evidence that an additional follow-up reference doc was created in this phase, so it is marked as not created
- [x] Capture asset-template status accurately — no spec-local evidence that an additional prompt/template asset was created in this phase, so it is marked as not created
- [x] All updated docs pass sk-doc DQI quality standards — proper frontmatter, anchors, and sections
- [x] Cross-references between feature catalog, playbook, SKILL.md, and ARCHITECTURE.md verified consistent
- [x] Record future documentation gaps explicitly — dedicated cross-runtime consistency playbook, fuller ARCHITECTURE.md runtime adapter docs, and root README context preservation mention remain follow-up work
- [x] No stale references to pre-hook compaction approach remain in updated files
