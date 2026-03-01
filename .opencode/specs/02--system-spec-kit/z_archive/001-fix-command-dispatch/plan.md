---
title: "Implementation Plan: Fix Command Dispatch Vulnerability [118-fix-command-dispatch/plan]"
description: "This plan addresses a command dispatch vulnerability where OpenCode's runtime injects phantom dispatch text based on structural patterns in command .md files. The approach is: (..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "fix"
  - "command"
  - "dispatch"
  - "118"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Fix Command Dispatch Vulnerability

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML (OpenCode command system) |
| **Framework** | OpenCode CLI runtime |
| **Storage** | None (file-based configuration) |
| **Testing** | Manual command execution testing |

### Overview
This plan addresses a command dispatch vulnerability where OpenCode's runtime injects phantom dispatch text based on structural patterns in command `.md` files. The approach is: (1) audit all files against 6 vulnerability patterns, (2) apply structural fixes to eliminate injection triggers, (3) verify each command executes its intended workflow.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 through REQ-006)
- [ ] Each command tested manually post-fix
- [ ] Docs updated (spec/plan/tasks/checklist)

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
File-based command system (Markdown frontmatter + content body + YAML workflow assets)

### Key Components
- **Command Files (.md)**: 7 files defining spec_kit slash commands with frontmatter, execution instructions, and dispatch templates
- **YAML Workflow Files**: 13 files in `assets/` defining multi-step workflows referenced by command files
- **OpenCode Runtime**: Parses command files and (undocumented) may inject dispatch text based on structural cues

### Data Flow
```
User runs /spec_kit:complete
  -> OpenCode loads complete.md
  -> Runtime parses frontmatter (allowed-tools, agent refs)
  -> Runtime scans content body (detects @agent patterns?)
  -> [VULNERABILITY] Runtime injects phantom dispatch text
  -> AI receives command content + injected text
  -> AI follows injected text instead of YAML workflow
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Universal Fixes (A+B) — All 7 .md files
- [x] Add imperative guardrail after frontmatter (Fix A)
- [x] Move INSTRUCTIONS section (load YAML) to first 15 lines (Fix B)
- [ ] Validate each file preserves frontmatter integrity

### Phase 2: Targeted Fixes (C+D) — 4 .md files
- [ ] Fence unfenced dispatch templates in complete.md (6 unfenced) (Fix C)
- [ ] Fence unfenced dispatch templates in debug.md (3 unfenced) (Fix C)
- [ ] Fence unfenced dispatch templates in research.md (2 unfenced) (Fix C)
- [ ] Fence unfenced dispatch templates in plan.md (2 unfenced) (Fix C)
- [ ] Reduce @agent refs in complete.md (19 → <10) (Fix D)
- [ ] Reduce @agent refs in debug.md (13 → <8) (Fix D)

### Phase 3: YAML Fixes (E) — 13 .yaml files
- [ ] Add REFERENCE comments before agent_routing sections in all 13 YAML files (Fix E)
- [ ] Validate YAML syntax after modifications

### Phase 4: Verification
- [ ] Test each command individually
- [ ] Verify no phantom dispatch text appears
- [ ] Cross-reference check (section numbers still valid)
- [ ] Document patterns for future command creation

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Execute each `/spec_kit:*` command and observe behavior | OpenCode CLI |
| Structural | Verify file structure matches fix pattern | Manual review / grep |
| Regression | Confirm YAML workflows still load and execute correctly | OpenCode CLI |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| OpenCode runtime | Internal | Green | Cannot test commands without it |
| Existing command files | Internal | Green | Must read before modifying |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any command stops functioning after structural fix
- **Procedure**: `git checkout -- .opencode/command/spec_kit/` to restore all files from last commit

<!-- /ANCHOR:rollback -->

---

## VULNERABILITY PATTERN CATALOG

### Complete Audit Matrix

| File | V1: @refs | V2: Exec Line | V3: Templates | V4: Guard | V6: Risk | Severity | Priority |
|------|-----------|---------------|---------------|-----------|----------|----------|----------|
| complete.md | 19 | L140 | 6 unfenced | MISSING | HIGH | CRITICAL | 1 |
| debug.md | 13 | L174 | 3 unfenced | MISSING | MEDIUM | MEDIUM | 2 |
| implement.md | 12 | L171 | 2 fenced | MISSING | MEDIUM | MEDIUM | 3 |
| research.md | 7 | L145 | 2 unfenced | MISSING | MEDIUM | MEDIUM | 4 |
| plan.md | 5 | L143 | 2 unfenced | MISSING | LOW | MEDIUM | 5 |
| handover.md | 5 | L140 | 2 fenced | MISSING | LOW | LOW | 6 |
| resume.md | 0 | L183 | 0 | MISSING | LOW | LOW | 7 |

### Universal Findings (ALL 7 files)
- **V2**: ALL files bury the "load YAML" instruction (range L140-L183). Zero files have it in first 20 lines.
- **V4**: ALL files missing imperative guardrail. No file has "DO NOT dispatch agents directly".
- **V5**: YAML routing always clear in logic but buried at 40-60% through document.

### 5 Specific Fixes

**Fix A** (all 7): Add imperative guardrail after frontmatter:
> ⚠️ EXECUTION PROTOCOL: This command runs a structured YAML workflow. Do NOT dispatch agents directly. First determine execution mode, then load the corresponding YAML file.

**Fix B** (all 7): Move INSTRUCTIONS section (load YAML) to just after guardrail — within first 15 lines of content.

**Fix C** (complete, debug, research, plan): Fence unfenced dispatch templates with REFERENCE ONLY markers.

**Fix D** (complete, debug): Reduce @agent reference density. Replace prose @agent mentions with generic terms. Keep @agent syntax only in routing tables.

**Fix E** (13 YAMLs): Add REFERENCE comments before agent_routing sections in YAML files.

### Pattern Descriptions

### V1: Phantom Dispatch Triggers
- **Detection**: @agent references (e.g., `@debug`, `@review`) combined with `allowed-tools: Task` in frontmatter
- **Fix**: Remove or fence @agent references; ensure execution instructions precede any dispatch templates

### V2: Buried Execution Instructions
- **Detection**: The actual "what to do" instructions appear after dispatch templates or deep in the file
- **Fix**: Move imperative execution block to immediately after frontmatter

### V3: Prominent Unfenced Dispatch Templates
- **Detection**: Dispatch template text (e.g., "call the task tool with subagent") appears as regular prose
- **Fix**: Wrap in clearly labeled code blocks with "TEMPLATE - DO NOT EXECUTE DIRECTLY" markers

### V4: Missing Imperative Guardrails
- **Detection**: No explicit "DO NOT dispatch" or "EXECUTE THIS WORKFLOW" instruction
- **Fix**: Add clear imperative at top: "YOU MUST follow the workflow below. DO NOT dispatch to other agents."

### V5: Unclear YAML Routing
- **Detection**: YAML files with ambiguous step descriptions that could be interpreted as agent dispatch
- **Fix**: Make routing explicit with clear step-by-step instructions

### V6: Agent Reference Density
- **Detection**: High density of @agent mentions throughout file body (increases injection probability)
- **Fix**: Consolidate agent references to a single clearly-fenced section; use descriptive names instead of @mentions where possible

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Audit (COMPLETED) ──► Phase 1 (Universal) ──► Phase 2 (Targeted) ──► Phase 4 (Verify)
                                                        │
                                              Phase 3 (YAML) ────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Audit | None | All phases (COMPLETED) |
| Phase 1 (Universal) | Audit | Phase 2, Phase 4 |
| Phase 2 (Targeted) | Phase 1 | Phase 4 |
| Phase 3 (YAML) | Audit | Phase 4 |
| Phase 4 (Verify) | Phase 1, 2, 3 | None |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Audit (7 .md + 13 YAML) | Medium | 1-2 hours (COMPLETED) |
| Phase 1: Universal Fixes (A+B) | Low | 0.5-1 hour |
| Phase 2: Targeted Fixes (C+D) | Medium | 1-2 hours |
| Phase 3: YAML Fixes (E) | Low | 0.5-1 hour |
| Phase 4: Verification | Medium | 1-2 hours |
| **Total** | | **3.5-6 hours** |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Git branch created (001-2-fix-command-dispatch)
- [ ] All original files committed before changes
- [ ] Each file tested individually after modification

### Rollback Procedure
1. Identify broken command from test results
2. `git diff .opencode/command/spec_kit/<file>` to see changes
3. `git checkout -- .opencode/command/spec_kit/<file>` to revert specific file
4. If widespread: `git checkout -- .opencode/command/spec_kit/` to revert all

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - all changes are to configuration files tracked in git

<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:ai-execution -->
## AI EXECUTION FRAMEWORK

**3-Tier Execution Model:**

- **Tier 1 (Sequential):** Audit each command file → identify vulnerability patterns → document findings per file
- **Tier 2 (Parallel):** Apply Fix A (phantom text) + Fix B (guardrails) to all 7 files simultaneously (up to 7 parallel agents)
- **Tier 3 (Integration):** Verify cross-references between .md and YAML, run each command, validate output

<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:workstreams -->
## WORKSTREAM COORDINATION

| Workstream | Scope | Fixes Applied | Files |
|-----------|-------|--------------|-------|
| WS-1 | Command .md files | Fix A, B, C, D | 7 command files |
| WS-2 | YAML config files | Fix E | 13 YAML files |
| WS-3 | Verification | Cross-cutting | All 20 files |

**Sync Points:**
1. After WS-1 Phase 1 (audit complete) → Review findings before fixes
2. After WS-2 (YAML validation) → Confirm .md/.yaml alignment
3. Final verification → All commands tested end-to-end

<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:communication -->
## COMMUNICATION PLAN

- **Progress Updates:** After each phase completion
- **Escalation Path:** If phantom text persists after fixes → file OpenCode GitHub issue
- **Final Report:** Implementation summary with before/after metrics (phantom text count, guardrail coverage %)

<!-- /ANCHOR:communication -->

---

<!--
LEVEL 3+ PLAN - Upgraded from Level 2 with AI execution framework
Multi-tier execution model, workstream coordination, communication plan added
4-phase approach: Audit -> Fix Commands -> Fix YAML -> Verify
-->
