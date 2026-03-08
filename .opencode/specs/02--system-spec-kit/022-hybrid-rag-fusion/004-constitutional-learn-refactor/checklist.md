---
title: "Constitutional Learn Refactor Checklist"
status: "complete"
level: 2
created: "2025-12-01"
updated: "2026-03-08"
---
<!-- SPECKIT_TEMPLATE_SOURCE: .opencode/skill/system-spec-kit/templates/checklist.md -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- ANCHOR:checklist -->
# Verification Checklist

## P0 — Must Pass
- [x] learn.md rewritten with constitutional focus [EVIDENCE: learn command document is 550 lines, all sections reference constitutional memory management]
- [x] Old learning types (pattern, mistake, insight, optimization, constraint) removed [EVIDENCE: grep confirms 0 matches except "constraint" in a qualification question (safe context)]
- [x] Old subcommands (correct, undo, history) removed [EVIDENCE: grep confirms 0 matches]
- [x] New subcommands (list, edit, remove, budget) present [EVIDENCE: Sections 7-10 in the learn command document]
- [x] CREATE workflow includes budget check [EVIDENCE: Section 5, Step 4: Budget Check]
- [x] Constitutional directory path correct [EVIDENCE: .opencode/skill/system-spec-kit/constitutional/ used in Sections 2, 5, 6, 7, 8, 9, 10, 11, 14]
- [x] Uses Write tool (not generate-context.js) for file creation [EVIDENCE: Section 11 Tool Signatures: Write("<path>")]
- [x] Uses memory_save() for indexing [EVIDENCE: Section 11 Tool Signatures: memory_save({ filePath, force: true })]
- [x] Token budget ~2000 referenced [EVIDENCE: Sections 4, 5 (Step 4), 6, 7, 10]

## P1 — Should Pass
- [x] README.txt updated with new description [EVIDENCE: line 50: learn command, lines 68-74: subcommands table, lines 116-122: examples]
- [x] CLAUDE.md Quick Reference updated [EVIDENCE: line 53: constitutional memory workflow]
- [x] system-spec-kit README.md updated [EVIDENCE: line 542: constitutional memory manager description]
- [x] No stale references to old learning types [EVIDENCE: grep confirms clean across the learn command document, README.txt, and CLAUDE.md]
- [x] Examples show constitutional memory creation [EVIDENCE: Section 13: Examples 1-3]
<!-- /ANCHOR:checklist -->
