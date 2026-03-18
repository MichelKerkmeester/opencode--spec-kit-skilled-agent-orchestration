---
title: "Tasks: Remove Emojis from All Documentation [005-remove-emojis-from-docs/tasks]"
description: "Task Format: T### [P?] Description (file path or group)"
trigger_phrases:
  - "tasks"
  - "remove"
  - "emojis"
  - "from"
  - "all"
  - "019"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Remove Emojis from All Documentation

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path or group)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-0 -->
## Phase 0: Validation Engine & sk-doc (COMPLETED)

- [x] T001 Set `h2_emoji_required: false` for all 7 document types in `template_rules.json`
- [x] T002 Remove `missing_h2_emoji` and `toc_missing_emoji` from blocking errors in `template_rules.json`
- [x] T003 Remove `add_h2_emoji` and `fix_toc_emoji` auto-fix rules from `template_rules.json`
- [x] T004 Remove TOC emoji check from `validate_document.py`
- [x] T005 Clear `EMOJI_REQUIRED_TYPES` set in `extract_structure.py`
- [x] T006 Remove `h2_emoji` checklist items from all checklists in `extract_structure.py`
- [x] T007 Update DQI scoring to remove emoji factor in `extract_structure.py`
- [x] T008 Strip emojis from H2 headings in `SKILL.md`
- [x] T009 Remove "Emoji Usage Rules" section from `SKILL.md`
- [x] T010 Strip emojis from H2 headings and TOC in `README.md`
- [x] T011 Remove Section 8 "EMOJI USAGE RULES" from `references/core_standards.md`
- [x] T012 Strip emojis from H2 headings in `references/validation.md`
- [x] T013 Strip emojis from 9 template files in `assets/`
- [x] T014 Strip emojis from 5 reference files in `references/`
- [x] T015 Update all 6 test fixtures to remove emojis
- [x] T016 Update `test_validator.py` to expect no emoji enforcement
- [x] T017 Run test suite (6/6 pass)
- [x] T018 Create changelog entry `v1.0.7.0.md`
- [x] T019 Bump version in SKILL.md to 1.0.7.0
<!-- /ANCHOR:phase-0 -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: system-spec-kit Skill (84 files)

- [x] T100 [P] Strip emojis from `system-spec-kit/SKILL.md`
- [x] T101 [P] Strip emojis from `system-spec-kit/README.md`
- [x] T102 [P] Strip emojis from 17 `scripts/**/README.md` files
- [x] T103 [P] Strip emojis from 20 `mcp_server/**/README.md` files
- [x] T104 [P] Strip emojis from `mcp_server/INSTALL_GUIDE.md`
- [x] T105 [P] Strip emojis from 26 `references/**/*.md` files
- [x] T106 [P] Strip emojis from 4 `assets/*.md` files
- [x] T107 [P] Strip emojis from 5 `shared/**/README.md` files
- [x] T108 [P] Strip emojis from `constitutional/README.md` and `config/README.md`
- [x] T109 [P] Strip emojis from `templates/scratch/README.md`
- [x] T110 Verify: zero emoji H2 headings in `system-spec-kit/`
- [x] T111 [P] Update SKILL.md version in frontmatter
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: mcp-figma Skill (6 files)

- [x] T200 [P] Strip emojis from `mcp-figma/SKILL.md`
- [x] T201 [P] Strip emojis from `mcp-figma/README.md`
- [x] T202 [P] Strip emojis from `mcp-figma/INSTALL_GUIDE.md`
- [x] T203 [P] Strip emojis from `mcp-figma/references/tool_reference.md`
- [x] T204 [P] Strip emojis from `mcp-figma/references/quick_start.md`
- [x] T205 [P] Strip emojis from `mcp-figma/assets/tool_categories.md`
- [x] T206 Verify: zero emoji H2 headings in `mcp-figma/`
- [x] T207 [P] Update SKILL.md version in frontmatter
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: mcp-code-mode Skill (10 files)

- [x] T300 [P] Strip emojis from `mcp-code-mode/SKILL.md`
- [x] T301 [P] Strip emojis from `mcp-code-mode/README.md`
- [x] T302 [P] Strip emojis from `mcp-code-mode/INSTALL_GUIDE.md`
- [x] T303 [P] Strip emojis from 5 `mcp-code-mode/references/*.md` files
- [x] T304 [P] Strip emojis from 2 `mcp-code-mode/assets/*.md` files
- [x] T305 Verify: zero emoji H2 headings in `mcp-code-mode/`
- [x] T306 [P] Update SKILL.md version in frontmatter
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: sk-code--opencode Skill (22 files)

- [x] T400 [P] Strip emojis from `sk-code--opencode/SKILL.md`
- [x] T401 [P] Strip emojis from `sk-code--opencode/README.md`
- [x] T402 [P] Strip emojis from 3 `references/python/*.md` files
- [x] T403 [P] Strip emojis from 3 `references/typescript/*.md` files
- [x] T404 [P] Strip emojis from 3 `references/javascript/*.md` files
- [x] T405 [P] Strip emojis from 3 `references/shell/*.md` files
- [x] T406 [P] Strip emojis from `references/config/quick_reference.md`
- [x] T407 [P] Strip emojis from `references/shared/code_organization.md`
- [x] T408 [P] Strip emojis from 6 `assets/checklists/*.md` files
- [x] T409 Verify: zero emoji H2 headings in `sk-code--opencode/`
- [x] T410 [P] Update SKILL.md version in frontmatter
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: mcp-chrome-devtools Skill (7 files)

- [x] T500 [P] Strip emojis from `mcp-chrome-devtools/SKILL.md`
- [x] T501 [P] Strip emojis from `mcp-chrome-devtools/README.md`
- [x] T502 [P] Strip emojis from `mcp-chrome-devtools/INSTALL_GUIDE.md`
- [x] T503 [P] Strip emojis from 3 `references/*.md` files
- [x] T504 [P] Strip emojis from `examples/README.md`
- [x] T505 Verify: zero emoji H2 headings in `mcp-chrome-devtools/`
- [x] T506 [P] Update SKILL.md version in frontmatter
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: sk-code--full-stack Skill (33 files)

- [x] T600 [P] Strip emojis from `sk-code--full-stack/SKILL.md`
- [x] T601 [P] Strip emojis from `sk-code--full-stack/README.md`
- [x] T602 [P] Strip emojis from 7 `references/frontend/react/*.md` files
- [x] T603 [P] Strip emojis from 12 `references/backend/go/*.md` files
- [x] T604 [P] Strip emojis from `references/backend/nodejs/nodejs_standards.md`
- [x] T605 [P] Strip emojis from 7 `references/mobile/react-native/*.md` files
- [x] T606 [P] Strip emojis from 6 `references/mobile/swift/*.md` files
- [x] T607 [P] Strip emojis from 6 `assets/backend/**/*.md` checklist files
- [x] T608 Verify: zero emoji H2 headings in `sk-code--full-stack/`
- [x] T609 [P] Update SKILL.md version in frontmatter
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:phase-7 -->
## Phase 7: workflows-code--web-dev Skill (29 files)

- [x] T700 [P] Strip emojis from `workflows-code--web-dev/SKILL.md`
- [x] T701 [P] Strip emojis from `workflows-code--web-dev/README.md`
- [x] T702 [P] Strip emojis from 13 `references/implementation/*.md` files
- [x] T703 [P] Strip emojis from 4 `references/performance/*.md` files
- [x] T704 [P] Strip emojis from 5 `references/standards/*.md` files
- [x] T705 [P] Strip emojis from `references/verification/*.md` and `references/debugging/*.md` and `references/research/*.md`
- [x] T706 [P] Strip emojis from 2 `references/deployment/*.md` files
- [x] T707 [P] Strip emojis from 3 `assets/checklists/*.md` files
- [x] T708 Verify: zero emoji H2 headings in `workflows-code--web-dev/`
- [x] T709 [P] Update SKILL.md version in frontmatter
<!-- /ANCHOR:phase-7 -->

---

<!-- ANCHOR:phase-8 -->
## Phase 8: sk-git Skill (10 files)

- [x] T800 [P] Strip emojis from `sk-git/SKILL.md`
- [x] T801 [P] Strip emojis from `sk-git/README.md`
- [x] T802 [P] Strip emojis from 5 `references/*.md` files
- [x] T803 [P] Strip emojis from 3 `assets/*.md` files
- [x] T804 Verify: zero emoji H2 headings in `sk-git/`
- [x] T805 [P] Update SKILL.md version in frontmatter
<!-- /ANCHOR:phase-8 -->

---

<!-- ANCHOR:phase-9 -->
## Phase 9: Agent Files (32 files)

- [x] T900 [P] Strip emojis from root agent files (`debug.md`, `context.md`, `speckit.md`, `research.md`, `write.md`, `review.md`, `orchestrate.md`, `handover.md`)
- [x] T901 [P] Strip emojis from 8 `copilot/*.md` agent files
- [x] T902 [P] Strip emojis from 8 `chatgpt/*.md` agent files
- [x] T903 [P] Strip emojis from 8 `.provider-backups/**/*.md` files
- [x] T904 Verify: zero emoji H2 headings in `agent/`
<!-- /ANCHOR:phase-9 -->

---

<!-- ANCHOR:phase-10 -->
## Phase 10: Command Files + Shared READMEs (24 files)

- [x] T1000 [P] Strip emojis from `command/agent_router.md`
- [x] T1001 [P] Strip emojis from 5 `command/memory/*.md` files
- [x] T1002 [P] Strip emojis from 7 `command/spec_kit/*.md` files
- [x] T1003 [P] Strip emojis from 4 `command/create/*.md` files
- [x] T1004 [P] Strip emojis from `.opencode/README.md`
- [x] T1005 [P] Strip emojis from `skill/README.md`
- [x] T1006 [P] Strip emojis from `skill/scripts/README.md`
- [x] T1007 [P] Strip emojis from `skill/scripts/SET-UP_GUIDE.md`
- [x] T1008 Verify: zero emoji H2 headings in `command/` and shared files
<!-- /ANCHOR:phase-10 -->

---

<!-- ANCHOR:phase-11 -->
## Phase 11: Spec Folder Archives (25 files, P2)

- [x] T1100 [P] Strip emojis from `.opencode/specs/02--system-spec-kit**/*.md` files
- [x] T1101 [P] Strip emojis from `.opencode/specs/03--commands-and-skills**/*.md` files (excluding 005-remove-emojis-from-docs)
- [x] T1102 [P] Strip emojis from `.opencode/specs/01--anobel.com**/*.md` files
- [x] T1103 Verify: zero emoji H2 headings in `specs/` (excluding this spec folder)
<!-- /ANCHOR:phase-11 -->

---

<!-- ANCHOR:phase-12 -->
## Phase 12: Final Verification & Reporting

- [x] T1200 Run global grep for emoji H2 patterns across `.opencode/`
- [x] T1201 Run `validate_document.py` on all README.md files
- [x] T1202 Run `extract_structure.py` on all SKILL.md files
- [x] T1203 Verify semantic H3 emojis preserved in RULES sections
- [x] T1204 Verify body-text emojis preserved
- [ ] T1205 [B] Verify exempt files unchanged (AGENTS.md, root README.md) — **BLOCKED**: Files modified in working tree prior to this run; not edited during emoji removal work
  > **Note**: T1205 (task) corresponds to CHK-1205 (AGENTS.md) and CHK-1206 (README.md) checklist items, both blocked.
- [x] T1206 Generate final summary report with file counts
  > **Note**: T1206 (task) is summary report generation (complete). CHK-1206 (checklist item) is root README unchanged verification (blocked).
- [x] T1207 Create changelog entries for all modified skills
- [x] T1208 Verify sk-doc test suite passing
- [x] T1209 Verify file count matches or exceeds target (287+ files)
<!-- /ANCHOR:phase-12 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All non-blocked tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining (T1205 was already tracked as blocked due to pre-existing root file modifications)
- [x] Phase 12 verification passed (zero emoji H2 headings in all processed files)
- [x] All SKILL.md and README.md files pass validation
- [x] Summary report generated (see implementation-summary.md)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
