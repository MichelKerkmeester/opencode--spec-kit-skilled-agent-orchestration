<!-- SPECKIT_TEMPLATE_SOURCE: .opencode/skill/system-spec-kit/templates/tasks.md -->
---
title: "Tasks: Refactor /memory:learn"
status: done
level: 2
created: 2025-12-01
updated: 2026-03-14
---
<!-- ANCHOR:tasks -->
# Tasks

## T1: Rewrite learn.md [P0] — COMPLETE
- [x] Write new frontmatter with constitutional focus — lines 1-5
- [x] Write subcommand routing (create, list, edit, remove, budget) — Section 3, lines 70-86
- [x] Write CREATE workflow (extract → qualify → structure → budget → write+index) — Section 5, lines 107-241
- [x] Write LIST subcommand — Section 7, lines 280-320
- [x] Write EDIT subcommand — Section 8, lines 324-373
- [x] Write REMOVE subcommand — Section 9, lines 377-430
- [x] Write BUDGET subcommand — Section 10, lines 434-471
- [x] Write MCP enforcement matrix — Section 11, lines 475-486
- [x] Write examples and error handling — Sections 12-13, lines 489-540
- [x] Write quick reference — Section 14, lines 543-550

## T2: Update README.txt [P1] — COMPLETE
- [x] Update learn command description — line 50
- [x] Replace learn subcommands table — lines 68-74
- [x] Update usage examples — lines 116-122

## T3: Update CLAUDE.md [P1] — COMPLETE
- [x] Update Quick Reference table entry — line 53: constitutional memory workflow
- [x] Verify no other stale references — confirmed clean

## T4: Update system-spec-kit README.md [P1] — COMPLETE
- [x] Update /memory:learn description — line 542

## T5: Verify [P0] — COMPLETE
- [x] No broken cross-references — all links verified
- [x] Constitutional directory path correct — `.opencode/skill/system-spec-kit/constitutional/` consistent
- [x] Token budget constant correct (~2000) — referenced in Sections 4, 5, 6, 7, 10

## T6: Post-Verification Remediation and Scope-Complete Alignment [P0] — COMPLETE
- [x] Fix stale active `/memory:learn` references in command/workspace/agent docs
  - `.opencode/command/README.txt`
  - `.opencode/command/memory/context.md`
  - `.opencode/command/spec_kit/debug.md`
  - `.opencode/command/spec_kit/complete.md`
  - `README.md`
  - `.opencode/README.md`
  - `.opencode/agent/speckit.md`
  - `.opencode/agent/chatgpt/speckit.md`
- [x] Resolve learn.md contract drift
  - Contradictory qualification text fixed to match branch behavior
  - Dead "save as critical instead" option removed and replaced with `/memory:save` path
- [x] Add documentation artifacts for verified closure
  - Feature catalog entry: `../../../../skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/13-constitutional-memory-manager-command.md`
  - Manual playbook scenario: `NEW-147`
- [x] Add regression test for command/doc alignment
  - `.opencode/skill/system-spec-kit/scripts/tests/memory-learn-command-docs.vitest.ts`
- [x] Re-run verification after remediation
  - `npm run typecheck` in `.opencode/skill/system-spec-kit` — PASS
  - `memory-learn-command-docs.vitest.ts` — PASS (2/2)
  - Targeted MCP suite — PASS (581/581)
<!-- /ANCHOR:tasks -->
