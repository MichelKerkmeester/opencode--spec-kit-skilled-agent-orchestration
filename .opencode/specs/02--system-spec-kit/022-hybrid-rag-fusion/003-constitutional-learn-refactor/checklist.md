---
title: "Verification Checklist"
---
<!-- SPECKIT_TEMPLATE_SOURCE: .opencode/skill/system-spec-kit/templates/checklist.md -->
---
title: "Constitutional Learn Refactor Checklist"
status: complete
level: 2
created: 2025-12-01
updated: 2026-03-14
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- ANCHOR:checklist -->
# Verification Checklist

## P0 — Must Pass
- [x] learn.md rewritten with constitutional focus [EVIDENCE: learn command document is 550 lines, all sections reference constitutional memory management]
- [x] Old learning types (pattern, mistake, insight, optimization, constraint) removed [EVIDENCE: grep confirms 0 matches except "constraint" in a qualification question (safe context)]
- [x] Old subcommands (correct, undo, history) removed [EVIDENCE: grep confirms 0 matches]
- [x] New subcommands (list, edit, remove, budget) present [EVIDENCE: Sections 7-10 in the learn command document]
- [x] CREATE workflow includes budget check [EVIDENCE: Section 5, Step 4: Budget Check]
- [x] Contradictory qualification gate text removed in learn.md [EVIDENCE: "Self-check (do NOT prompt user unless one or more answers are \"no\")" now matches the `IF any no` branch]
- [x] Dead critical-save branch removed from learn.md [EVIDENCE: choice text now uses `[s] use /memory:save instead`; no "save as critical instead" branch remains]
- [x] Constitutional directory path correct [EVIDENCE: .opencode/skill/system-spec-kit/constitutional/ used in Sections 2, 5, 6, 7, 8, 9, 10, 11, 14]
- [x] Uses Write tool (not generate-context.js) for file creation [EVIDENCE: Section 11 Tool Signatures: Write("<path>")]
- [x] Uses memory_save() for indexing [EVIDENCE: Section 11 Tool Signatures: memory_save({ filePath, force: true })]
- [x] Token budget ~2000 referenced [EVIDENCE: Sections 4, 5 (Step 4), 6, 7, 10]
- [x] Active stale `/memory:learn` references were remediated across command/workspace/agent surfaces [EVIDENCE: updated in `.opencode/command/README.txt`, `.opencode/command/memory/context.md`, `.opencode/command/spec_kit/debug.md`, `.opencode/command/spec_kit/complete.md`, `README.md`, `.opencode/README.md`, `.opencode/agent/speckit.md`, `.opencode/agent/chatgpt/speckit.md`]
- [x] Regression test added for command/doc alignment drift [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/tests/memory-learn-command-docs.vitest.ts` (2 tests)]

## P1 — Should Pass
- [x] README.txt updated with new description [EVIDENCE: line 50: learn command, lines 68-74: subcommands table, lines 116-122: examples]
- [x] CLAUDE.md Quick Reference updated [EVIDENCE: line 53: constitutional memory workflow]
- [x] system-spec-kit README.md updated [EVIDENCE: line 542: constitutional memory manager description]
- [x] No stale references remain in active command/workspace/agent docs [EVIDENCE: grep on active files returns no matches for "Capture learnings and corrections", "Explicit learning", "Save explicit correction or preference", "learning from mistakes", or "correct subcommand"]
- [x] Examples show constitutional memory creation [EVIDENCE: Section 13: Examples 1-3]
- [x] Feature catalog documentation added for this command refactor [EVIDENCE: `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/13-constitutional-memory-manager-command.md` and `../../../../skill/system-spec-kit/feature_catalog/feature_catalog.md` section "Constitutional memory manager command"]
- [x] Manual testing coverage added for this command refactor [EVIDENCE: `../../../../skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` includes NEW-147 and cross-reference mapping to feature catalog]
- [x] Verification command evidence captured [EVIDENCE: `npm run typecheck` PASS in `.opencode/skill/system-spec-kit`; vitest doc regression PASS 2/2; targeted MCP suite PASS 581/581]
<!-- /ANCHOR:checklist -->
