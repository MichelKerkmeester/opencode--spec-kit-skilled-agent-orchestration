---
title: "Checklist: Refactor /memory:learn"
---
# Verification Checklist

## P0 — Must Pass
- [x] learn.md rewritten with constitutional focus — `learn.md` is 550 lines, all sections reference constitutional memory management
- [x] Old learning types (pattern, mistake, insight, optimization, constraint) removed — grep confirms 0 matches except "constraint" in a qualification question (safe context)
- [x] Old subcommands (correct, undo, history) removed — grep confirms 0 matches
- [x] New subcommands (list, edit, remove, budget) present — Sections 7-10 in learn.md
- [x] CREATE workflow includes budget check — Section 5, Step 4: Budget Check
- [x] Constitutional directory path correct: `.opencode/skill/system-spec-kit/constitutional/` — used in Sections 2, 5, 6, 7, 8, 9, 10, 11, 14
- [x] Uses Write tool (not generate-context.js) for file creation — Section 11 Tool Signatures: `Write("<path>")`
- [x] Uses memory_save() for indexing — Section 11 Tool Signatures: `memory_save({ filePath, force: true })`
- [x] Token budget ~2000 referenced — Sections 4, 5 (Step 4), 6, 7, 10

## P1 — Should Pass
- [x] README.txt updated with new description — line 50: learn command, lines 68-74: subcommands table, lines 116-122: examples
- [x] CLAUDE.md Quick Reference updated — line 53: constitutional memory workflow
- [x] system-spec-kit README.md updated — line 542: constitutional memory manager description
- [x] No stale references to old learning types — grep confirms clean across learn.md, README.txt, CLAUDE.md
- [x] Examples show constitutional memory creation — Section 13: Examples 1-3
