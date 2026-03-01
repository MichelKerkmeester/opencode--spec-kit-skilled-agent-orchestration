# Bug Inventory: Complete List

> Comprehensive inventory of all bugs discovered in the 15-agent audit, organized by file.

---

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P0 - Critical | 7 | Workflow-breaking bugs |
| P1 - High | 8 | Significant functionality issues |
| P2 - Medium | 12 | Documentation/consistency issues |
| P3 - Low | 8 | Minor cosmetic issues |
| **Total** | **35** | |

---

## By File

### `.opencode/skill/system-spec-kit/README.md`

| Bug ID | Priority | Line(s) | Issue |
|--------|----------|---------|-------|
| BUG-001a | P0 | 421 | ANCHOR format uses `ANCHOR_END` instead of `/ANCHOR:` |
| BUG-001b | P0 | 696 | Troubleshooting text mentions wrong ANCHOR format |
| BUG-012a | P1 | 196 | complete command shows 12 steps (should be 14) |
| BUG-012b | P1 | 198 | implement command shows 8 steps (should be 9) |
| BUG-765 | P2 | 765 | Commands path says `.opencode/command/` (should be `.claude/commands/`) |

### `.claude/commands/memory/save.md`

| Bug ID | Priority | Line(s) | Issue |
|--------|----------|---------|-------|
| BUG-027 | P3 | 58 | Uses short tool name `memory_stats()` |

### `.claude/commands/memory/manage.md`

| Bug ID | Priority | Line(s) | Issue |
|--------|----------|---------|-------|
| BUG-028 | P3 | 17 | "stats" listed but no keyword mode |

### `.claude/commands/memory/learn.md`

| Bug ID | Priority | Line(s) | Issue |
|--------|----------|---------|-------|
| BUG-016a | P2 | 43 | Section reference 13 → 17 |
| BUG-016b | P2 | 48 | Section reference 14 → 18 |
| BUG-016c | P2 | 53 | Section reference 15 → 19 |

### `.claude/commands/memory/continue.md`

| Bug ID | Priority | Line(s) | Issue |
|--------|----------|---------|-------|
| BUG-017 | P2 | 283-289 | Wrong tool for sortBy parameter |
| BUG-018 | P2 | 123-127 | Short tool names in MCP Matrix |
| BUG-656 | P3 | 656 | Related command description mismatch |

### `.claude/commands/memory/context.md`

| Bug ID | Priority | Line(s) | Issue |
|--------|----------|---------|-------|
| BUG-025 | P3 | 470 | Outdated "DRIFT CONTEXT" label |
| BUG-026 | P3 | 540-542 | Incomplete Related Commands |

### `.claude/commands/spec_kit/debug.md`

| Bug ID | Priority | Line(s) | Issue |
|--------|----------|---------|-------|
| BUG-002a | P0 | 345-346 | YAML path mismatch |
| BUG-019 | P2 | 57 | Fictional model name |

### `.claude/commands/spec_kit/research.md`

| Bug ID | Priority | Line(s) | Issue |
|--------|----------|---------|-------|
| BUG-002b | P0 | 420-422 | YAML path mismatch |
| BUG-008 | P1 | 4 | Phantom WebSearch tool |
| BUG-030 | P3 | 4 | Tool name capitalization |

### `.claude/commands/spec_kit/complete.md`

| Bug ID | Priority | Line(s) | Issue |
|--------|----------|---------|-------|
| BUG-002c | P0 | 604-605 | YAML path mismatch |
| BUG-003 | P0 | YAML | Missing Steps 11 and 14 |
| BUG-006 | P0 | YAML | Step number misalignment |
| BUG-056 | P2 | 56, 60 | Duplicate step "6." |
| BUG-271 | P2 | 271 | Confidence checkpoint mismatch |

### `.claude/commands/spec_kit/implement.md`

| Bug ID | Priority | Line(s) | Issue |
|--------|----------|---------|-------|
| BUG-002d | P0 | 340-342 | YAML path mismatch |
| BUG-004 | P0 | YAML | Missing PREFLIGHT/POSTFLIGHT |
| BUG-013 | P1 | 440 | Reference to non-existent Step 11 |
| BUG-014 | P1 | 74, 76 | Duplicate step number |
| BUG-023 | P2 | YAML | Termination message wrong step |
| BUG-024 | P2 | YAML | Five Checks not in quality_gates |

### `.claude/commands/spec_kit/plan.md`

| Bug ID | Priority | Line(s) | Issue |
|--------|----------|---------|-------|
| BUG-002e | P0 | 309-310 | YAML path mismatch |
| BUG-020 | P2 | YAML 211 | Step comment wrong |
| BUG-021 | P2 | 237 | Question range Q0-Q5 (should be Q0-Q6) |

### `.claude/commands/spec_kit/resume.md`

| Bug ID | Priority | Line(s) | Issue |
|--------|----------|---------|-------|
| BUG-002f | P0 | 250-251 | YAML path mismatch |
| BUG-007 | P0 | YAML 96 | Invalid confidence steps [1,3,5] |
| BUG-009 | P1 | YAML | Session detection 4-tier vs 2-tier |
| BUG-022 | P2 | YAML | Context loading 4 vs 2 sources |
| BUG-029 | P3 | YAML | CONTINUE_SESSION.md not documented |

### `.claude/commands/spec_kit/handover.md`

| Bug ID | Priority | Line(s) | Issue |
|--------|----------|---------|-------|
| BUG-002g | P0 | 550 | YAML path mismatch |
| BUG-005 | P0 | 398-401, 475 | Invalid Task `model` parameter |
| BUG-010 | P1 | 258 vs 550 | YAML contradiction |
| BUG-011 | P1 | YAML 34-89 | Section mismatch 7 vs 5 |

### `.opencode/agent/speckit.md`

| Bug ID | Priority | Line(s) | Issue |
|--------|----------|---------|-------|
| BUG-015 | P1 | 419-420 | Orphaned references to deleted commands |

### `.opencode/agent/handover.md`

| Bug ID | Priority | Line(s) | Issue |
|--------|----------|---------|-------|
| BUG-005b | P1 | 51-59 | Invalid Task `model` parameter |

---

## YAML Files Summary

### spec_kit_complete_*.yaml

| Issue | Status |
|-------|--------|
| Missing step_11_checklist_verify | TO FIX |
| Missing step_14_handover_check | TO FIX |
| step_11 should be step_12 | TO FIX |
| step_12 should be step_13 | TO FIX |

### spec_kit_implement_*.yaml

| Issue | Status |
|-------|--------|
| Missing step_5_5_preflight | TO FIX |
| Missing step_7_5_postflight | TO FIX |
| Termination says "step 8" (should be 9) | TO FIX |
| Five Checks not in quality_gates | TO FIX |

### spec_kit_resume_*.yaml

| Issue | Status |
|-------|--------|
| key_steps includes non-existent step 5 | TO FIX |
| Only 2-tier session detection (should be 4) | TO FIX |
| Only 2 context sources (should be 4) | TO FIX |

### spec_kit_plan_*.yaml

| Issue | Status |
|-------|--------|
| Comment says "Step 6" (should be 5) | TO FIX |

### spec_kit_handover_full.yaml

| Issue | Status |
|-------|--------|
| 7 sections (should be 5) | TO FIX |

---

## Fix Groupings

### Group A: YAML Path Fixes (7 files)
All can be fixed with single search-and-replace:
`.opencode/command/spec_kit/assets/` → `.claude/commands/spec_kit/assets/`

### Group B: complete.md YAML Additions (2 files)
Add step_11_checklist_verify and step_14_handover_check, renumber steps

### Group C: implement.md YAML Additions (2 files)
Add step_5_5_preflight and step_7_5_postflight

### Group D: Tool Name Standardization (4 files)
Use full `spec_kit_memory_*` prefix consistently

### Group E: Step Numbering (6 files)
Correct all step references to match actual step counts

### Group F: Documentation Updates (2 files)
Update README.md with correct step counts and ANCHOR format
