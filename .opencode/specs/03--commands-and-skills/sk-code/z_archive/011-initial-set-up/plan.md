---
title: "Implementation Plan: workflows-code-opencode Skill [011-initial-set-up/plan]"
description: "Create a comprehensive multi-language code standards skill for OpenCode system code. The skill provides code style guides for JavaScript (Node.js scripts, MCP servers), Python (..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "workflows"
  - "code"
  - "opencode"
  - "030"
  - "initial"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: workflows-code-opencode Skill

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch + level3plus-govern | v2.0 -->
<!-- UPDATED: 2026-02-04 - Multi-Language Expansion -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (skill definition), JS/Python/Shell/JSON examples |
| **Framework** | OpenCode skill system |
| **Storage** | None (static documentation) |
| **Testing** | Manual validation against existing codebase |
| **Languages Covered** | JavaScript, Python, Shell, JSON/JSONC |

### Overview
Create a comprehensive **multi-language** code standards skill for OpenCode system code. The skill provides code style guides for **JavaScript** (Node.js scripts, MCP servers), **Python** (validators, advisors), **Shell** (automation scripts), and **JSON/JSONC** (configurations) - distinct from the web-focused workflows-code skill. Implementation involves creating **19 markdown files** with patterns extracted from 5-agent parallel research across all language categories.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] Pattern research completed (5-agent parallel exploration - ALL languages)
- [x] Evidence files identified with line references for JS, Python, Shell, JSON

### Definition of Done
- [ ] All 19 files created with correct structure
- [ ] SKILL.md activates on language-specific keywords
- [ ] Multi-language detection routes correctly (Extension → Keywords → Prompt)
- [ ] Code examples cite real OpenCode files for each language
- [ ] Universal checklist applies to all languages
- [ ] Language-specific checklists have distinct P0/P1/P2 items
- [ ] All ADRs documented in decision-record.md (ADR-001 through ADR-006)

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Static skill with **multi-language routing** and reference documentation (no phase routing)

### Key Components
- **SKILL.md**: Multi-language orchestrator with detection routing (no phase routing)
- **references/shared/**: Universal patterns applicable to all languages
- **references/{language}/**: Language-specific documentation (style guide, quality standards, quick reference)
- **assets/checklists/**: Universal + language-specific validation checklists

### Data Flow
```
User query → Language Detection → SKILL.md routing → Load shared + language refs → Apply standards
              ↓
    Extension → Keywords → User Prompt (fallback)
```

### Component Interaction
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SKILL.md (Multi-Language Orchestrator)               │
│  - Language detection (Extension → Keywords → Prompt)                        │
│  - Resource routing per language                                             │
│  - Universal rules (ALWAYS/NEVER)                                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
        ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
        │ shared/           │  │ {language}/       │  │ assets/checklists/│
        │                   │  │                   │  │                   │
        │ universal_        │  │ style_guide.md    │  │ universal_        │
        │ patterns.md       │  │ quality_          │  │ checklist.md      │
        │ code_             │  │ standards.md      │  │ {lang}_           │
        │ organization.md   │  │ quick_            │  │ checklist.md      │
        │                   │  │ reference.md      │  │                   │
        └───────────────────┘  └───────────────────┘  └───────────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
        ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
        │ javascript/       │  │ python/           │  │ shell/            │
        │ - style_guide     │  │ - style_guide     │  │ - style_guide     │
        │ - quality_std     │  │ - quality_std     │  │ - quality_std     │
        │ - quick_ref       │  │ - quick_ref       │  │ - quick_ref       │
        └───────────────────┘  └───────────────────┘  └───────────────────┘
                                        │
                                        ▼
                            ┌───────────────────┐
                            │ config/           │
                            │ - style_guide     │
                            │ - quick_ref       │
                            └───────────────────┘
```

### Language Detection Algorithm
```
detect_language(context):
  1. IF file_path exists:
       extension = get_extension(file_path)
       IF extension in {.js, .mjs, .cjs} → return "javascript"
       IF extension == .py → return "python"
       IF extension in {.sh, .bash} → return "shell"
       IF extension in {.json, .jsonc} → return "config"

  2. FOR keyword in query:
       IF keyword in {"node", "npm", "commonjs"} → return "javascript"
       IF keyword in {"python", "pip", "pytest"} → return "python"
       IF keyword in {"bash", "shell", "shebang"} → return "shell"
       IF keyword in {"json", "jsonc", "config"} → return "config"

  3. PROMPT user: "Which language? (js/py/sh/json)"
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (Folder Structure)
- [ ] Create skill folder: `.opencode/skill/workflows-code-opencode/`
- [ ] Create `references/shared/` subfolder
- [ ] Create `references/javascript/` subfolder
- [ ] Create `references/python/` subfolder
- [ ] Create `references/shell/` subfolder
- [ ] Create `references/config/` subfolder
- [ ] Create `assets/checklists/` subfolder

### Phase 2: Orchestrator

#### 2.1 SKILL.md (Multi-Language Orchestrator)
- [ ] YAML frontmatter (name, description, allowed-tools, version)
- [ ] Section 1: WHEN TO USE (language-specific activation triggers)
- [ ] Section 2: LANGUAGE ROUTING (detection algorithm)
- [ ] Section 3: HOW IT WORKS (single-phase overview, no 0-3 phases)
- [ ] Section 4: RULES (universal ALWAYS/NEVER + language-specific links)
- [ ] Section 5: SUCCESS CRITERIA
- [ ] Section 6: RELATED RESOURCES
- [ ] Section 7: QUICK REFERENCE (language detection decision tree)

**Key differentiator**: Multi-language routing, no phase routing (0-3), no browser verification

### Phase 3: Shared References

#### 3.1 shared/universal_patterns.md
- [ ] Naming principles (descriptive, avoid abbreviations, consistency)
- [ ] Commenting philosophy (WHY not WHAT)
- [ ] Reference comment patterns (T001, BUG-001, REQ-001, SEC-001)
- [ ] File organization concepts

#### 3.2 shared/code_organization.md
- [ ] File structure principles
- [ ] Module organization concepts
- [ ] Import/export philosophy

### Phase 4: JavaScript References

#### 4.1 javascript/style_guide.md
- [ ] File header format (three-line box-drawing)
- [ ] Section organization (numbered dividers)
- [ ] 'use strict' directive requirement
- [ ] Naming conventions (snake_case functions, UPPER_SNAKE_CASE constants)
- [ ] Formatting rules (2-space indent, K&R braces, semicolons, single quotes)
- [ ] Commenting rules (reference comments, JSDoc)

#### 4.2 javascript/quality_standards.md
- [ ] Module organization (CommonJS, barrel exports, re-export wrappers)
- [ ] Error handling (guard clauses, try-catch, MemoryError class)
- [ ] Console logging (bracketed module prefix `[module-name]`)
- [ ] JSDoc documentation (@param, @returns, @throws, @typedef)
- [ ] Security patterns (path traversal CWE-22, input limits CWE-400)
- [ ] Testing patterns (assert module, test runners)

#### 4.3 javascript/quick_reference.md
- [ ] Complete file template
- [ ] Naming cheat sheet (table format)
- [ ] Section ordering guide
- [ ] Export pattern template (with aliases)
- [ ] JSDoc template
- [ ] Common patterns (guard clause, try-catch, logging)

### Phase 5: Python References

#### 5.1 python/style_guide.md
- [ ] File header format (shebang + box-drawing)
- [ ] Section organization (numbered dividers)
- [ ] Naming conventions (snake_case functions, PascalCase classes, UPPER_SNAKE constants)
- [ ] Docstring format (Google-style with Args, Returns)
- [ ] Import organization (stdlib, third-party, local)

#### 5.2 python/quality_standards.md
- [ ] Error handling (try-except, early return tuple pattern)
- [ ] Logging (print with emoji, stderr for errors)
- [ ] Type hints (basic types, typing module)
- [ ] CLI patterns (argparse, sys.argv)
- [ ] Testing patterns (pytest, fixtures, assertions)

#### 5.3 python/quick_reference.md
- [ ] Complete file template
- [ ] Naming cheat sheet
- [ ] Docstring template
- [ ] Common patterns (early return, argument parsing)

### Phase 6: Shell References

#### 6.1 shell/style_guide.md
- [ ] Shebang convention (`#!/usr/bin/env bash`)
- [ ] File header format (box-drawing with COMPONENT)
- [ ] Section organization (numbered dividers)
- [ ] Variable naming (UPPERCASE globals, lowercase locals)
- [ ] Function naming (snake_case, underscore prefix for private)
- [ ] Quoting rules (double-quote all expansions)

#### 6.2 shell/quality_standards.md
- [ ] Strict mode (`set -euo pipefail`)
- [ ] Error handling (exit codes, error messages to stderr)
- [ ] Color definitions (ANSI codes with TTY detection)
- [ ] Logging functions (log_pass, log_warn, log_error)
- [ ] Argument parsing (while-case pattern)
- [ ] Process management (PID files, graceful shutdown)

#### 6.3 shell/quick_reference.md
- [ ] Complete file template
- [ ] Naming cheat sheet
- [ ] Common patterns (argument parsing, color logging)
- [ ] Exit code conventions (0=success, 1=warning, 2=error)

### Phase 7: Config References

#### 7.1 config/style_guide.md
- [ ] JSON structure (camelCase keys, nesting depth)
- [ ] JSONC comment patterns (section headers, inline docs)
- [ ] Schema references ($schema)
- [ ] Environment variable interpolation (${VAR})

#### 7.2 config/quick_reference.md
- [ ] JSON template
- [ ] JSONC template with comments
- [ ] Common patterns (feature flags, thresholds, keyword lists)

### Phase 8: Checklists

#### 8.1 universal_checklist.md
- [ ] P0 items (file header, no commented code, WHY comments)
- [ ] P1 items (consistent naming, TODO with tickets)
- [ ] P2 items (comment density)

#### 8.2 javascript_checklist.md
- [ ] P0 items (box header, IIFE wrapper, snake_case, 'use strict')
- [ ] P1 items (CommonJS exports, guard clauses, bracketed logging)
- [ ] P2 items (JSDoc for public functions)

#### 8.3 python_checklist.md
- [ ] P0 items (shebang, docstring, snake_case)
- [ ] P1 items (type hints, specific exceptions)
- [ ] P2 items (import ordering)

#### 8.4 shell_checklist.md
- [ ] P0 items (shebang, set -euo pipefail, double-quoted vars)
- [ ] P1 items (function naming, exit codes documented)
- [ ] P2 items (POSIX portability)

#### 8.5 config_checklist.md
- [ ] P0 items (valid syntax)
- [ ] P1 items ($schema reference, JSONC comments)
- [ ] P2 items (logical key ordering)

### Phase 9: Verification
- [ ] Validate SKILL.md structure against workflows-code
- [ ] Test language detection (extension, keywords, fallback)
- [ ] Verify all cited evidence files exist for each language
- [ ] Check examples compile (syntax valid for each language)
- [ ] Cross-reference with actual OpenCode code patterns
- [ ] Verify universal checklist items apply to all languages

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Skill activation keywords | Claude Code invocation |
| Manual | Pattern accuracy | Compare against cited files |
| Manual | Checklist applicability | Apply to sample OpenCode file |
| Manual | Quick reference usability | Time to find pattern (<30s target) |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| workflows-code skill | Internal | Green | Reference for structure/format |
| system-spec-kit code | Internal | Green | Pattern source (already analyzed) |
| OpenCode skill system | Internal | Green | Required for skill registration |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Skill causes conflicts with existing workflows
- **Procedure**: Delete `.opencode/skill/workflows-code-opencode/` folder
- **Verification**: `ls .opencode/skill/ | grep opencode` returns empty

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Orchestrator) ──► Phase 3-7 (References) ──► Phase 8 (Checklists) ──► Phase 9 (Verify)
                          │                            │
                          │                    ┌───────┼───────┬───────────┐
                          │                    ▼       ▼       ▼           ▼
                          │             Phase 3   Phase 4   Phase 5   Phase 6   Phase 7
                          │             (Shared)  (JS)      (Python)  (Shell)   (Config)
                          │                    │       │       │           │
                          │                    └───────┴───────┴───────────┘
                          │                              ▼
                          │                     Phase 8 (Checklists)
                          │                              ▼
                          └────────────────────► Phase 9 (Verification)
```

| Phase | Depends On | Blocks | Parallelizable |
|-------|------------|--------|----------------|
| 1. Setup | None | All others | No |
| 2. Orchestrator | Setup | Verification | No |
| 3. Shared | Setup | Checklists | Yes (with 4-7) |
| 4. JavaScript | Setup | Checklists | Yes (with 3, 5-7) |
| 5. Python | Setup | Checklists | Yes (with 3-4, 6-7) |
| 6. Shell | Setup | Checklists | Yes (with 3-5, 7) |
| 7. Config | Setup | Checklists | Yes (with 3-6) |
| 8. Checklists | Phases 3-7 | Verification | No |
| 9. Verify | All above | None | No |

**Parallel Opportunity**: Phases 3-7 (Shared + all 4 languages) can run simultaneously.

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated LOC | Notes |
|-------|------------|---------------|-------|
| 1. Setup | Low | 0 | Folder creation only |
| 2. Orchestrator | Medium | ~200 | Multi-language routing logic |
| 3. Shared | Low | ~180 | Universal patterns + organization |
| 4. JavaScript | Medium | ~370 | Style + quality + quick ref |
| 5. Python | Medium | ~300 | Style + quality + quick ref |
| 6. Shell | Medium | ~240 | Style + quality + quick ref |
| 7. Config | Low | ~100 | Style + quick ref (no quality) |
| 8. Checklists | Medium | ~270 | Universal + 4 language-specific |
| 9. Verification | Low | 0 | Testing and validation |
| **Total** | | **~1,660 LOC** | **Medium-High complexity** |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [x] Backup not needed (new files only)
- [x] No feature flags required
- [x] No monitoring needed (static docs)

### Rollback Procedure
1. Delete skill folder: `rm -rf .opencode/skill/workflows-code-opencode/`
2. Remove any AGENTS.md references (if added)
3. Verify removal: `ls .opencode/skill/ | grep opencode`

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A

<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    RESEARCH (COMPLETED - 5 AGENTS)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │    Spec     │  │ JavaScript  │  │   Python    │  │Shell/Config │    │
│  │ Enhancement │  │  Patterns   │  │  Patterns   │  │  Patterns   │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │
│         │                │                │                │            │
│         └────────────────┼────────────────┼────────────────┘            │
│                          ▼                ▼                              │
│            ┌─────────────────────────────────────────────┐              │
│            │         Multi-Language Architecture          │              │
│            │         (Agent 5: Design Synthesis)          │              │
│            └─────────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         PHASE 1: SETUP                                   │
│                 Create multi-language folder structure                   │
└─────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      PHASE 2: ORCHESTRATOR                               │
│                    SKILL.md with language routing                        │
└─────────────────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│  PHASE 3:     │       │  PHASE 4:     │       │  PHASE 5:     │
│  SHARED       │       │  JAVASCRIPT   │       │  PYTHON       │
│               │       │               │       │               │
│ universal_    │       │ style_guide   │       │ style_guide   │
│ patterns.md   │       │ quality_std   │       │ quality_std   │
│ code_org.md   │       │ quick_ref     │       │ quick_ref     │
└───────────────┘       └───────────────┘       └───────────────┘
        │                       │                       │
        │               ┌───────┴───────┐               │
        │               ▼               ▼               │
        │       ┌───────────────┐ ┌───────────────┐     │
        │       │  PHASE 6:     │ │  PHASE 7:     │     │
        │       │  SHELL        │ │  CONFIG       │     │
        │       │               │ │               │     │
        │       │ style_guide   │ │ style_guide   │     │
        │       │ quality_std   │ │ quick_ref     │     │
        │       │ quick_ref     │ │               │     │
        │       └───────────────┘ └───────────────┘     │
        │               │               │               │
        └───────────────┴───────┬───────┴───────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        PHASE 8: CHECKLISTS                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  universal  │  │ javascript  │  │   python    │  │   shell     │    │
│  │ _checklist  │  │ _checklist  │  │ _checklist  │  │ _checklist  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
│                          │                                               │
│                          ▼                                               │
│               ┌─────────────────────┐                                    │
│               │   config_checklist  │                                    │
│               └─────────────────────┘                                    │
└─────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       PHASE 9: VERIFICATION                              │
│  Cross-reference, validate, test language detection, verify evidence    │
└─────────────────────────────────────────────────────────────────────────┘
```

### Dependency Matrix (Updated for Multi-Language)

| Component | Depends On | Produces | Blocks | Parallel With |
|-----------|------------|----------|--------|---------------|
| Research | None | Multi-language patterns | All docs | - |
| Phase 1 Setup | Research | Folder structure | All phases | - |
| Phase 2 SKILL.md | Setup | Orchestrator | Verification | - |
| Phase 3 Shared | Setup | Universal patterns | Checklists | Phases 4-7 |
| Phase 4 JavaScript | Setup | JS patterns | Checklists | Phases 3, 5-7 |
| Phase 5 Python | Setup | PY patterns | Checklists | Phases 3-4, 6-7 |
| Phase 6 Shell | Setup | SH patterns | Checklists | Phases 3-5, 7 |
| Phase 7 Config | Setup | JSON patterns | Checklists | Phases 3-6 |
| Phase 8 Checklists | Phases 3-7 | Validation items | Verification | - |
| Phase 9 Verification | All above | Validated skill | None | - |

<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 Setup** - Minimal - CRITICAL (blocks all others)
2. **Phase 2 SKILL.md** - Required for routing - CRITICAL
3. **Phase 3 Shared** - Universal patterns - CRITICAL (used by all languages)
4. **Phase 4-7 Language Refs** - Can parallelize - AT LEAST ONE CRITICAL
5. **Phase 8 Checklists** - Validation gate - CRITICAL
6. **Phase 9 Verification** - Quality assurance - CRITICAL

**Critical Path**: Setup → SKILL.md → (Shared || Languages) → Checklists → Verification

**Parallel Opportunities** (MAJOR):
- Phases 3-7 (Shared + all 4 languages) can run simultaneously with 5 parallel agents
- Within each language: style_guide, quality_standards, quick_reference can parallelize

**Estimated Sequential Time** (if no parallelization): 9 phases
**Estimated Parallel Time** (with 5 agents): 5 effective phases (Setup → Orchestrator → Refs → Checklists → Verify)

<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target Phase |
|-----------|-------------|------------------|--------------|
| M1 | Setup Complete | All 7 folders created | Phase 1 |
| M2 | Orchestrator Ready | SKILL.md with routing logic | Phase 2 |
| M3 | Shared Patterns Done | universal_patterns.md + code_organization.md | Phase 3 |
| M4 | JavaScript Done | All 3 JS files created | Phase 4 |
| M5 | Python Done | All 3 PY files created | Phase 5 |
| M6 | Shell Done | All 3 SH files created | Phase 6 |
| M7 | Config Done | Both config files created | Phase 7 |
| M8 | Checklists Done | All 5 checklist files created | Phase 8 |
| M9 | Validated | Language detection works, evidence verified | Phase 9 |
| M10 | Release Ready | Skill activates correctly for all languages | Post-Phase 9 |

<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Simplified Structure (No Phase Routing)

**Status**: Accepted

**Context**: workflows-code has complex 4-phase routing (Research → Implementation → Debugging → Verification). This skill is standards-only, not a development lifecycle orchestrator.

**Decision**: Remove all phase routing, create a flat reference-based structure.

**Consequences**:
- Simpler skill (~7 files vs ~50)
- Faster activation (no phase detection)
- Clear purpose differentiation from workflows-code
- Cannot handle development lifecycle (by design)

**Alternatives Rejected**:
- Full phase routing: Overkill for standards-only use case

### ADR-002: Naming Convention (snake_case + camelCase Aliases)

**Status**: Accepted

**Context**: Existing codebase has mixed naming (transitioning from camelCase to snake_case). Breaking backward compatibility would cause churn.

**Decision**: Document snake_case as primary convention with camelCase aliases for backward compatibility.

**Consequences**:
- New code uses snake_case
- Existing code continues to work via aliases
- Clear migration path documented
- Slightly larger export blocks (dual naming)

**Alternatives Rejected**:
- Pure snake_case (breaks existing code)
- Pure camelCase (inconsistent with transition direction)

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation
**Files**: spec.md, plan.md, decision-record.md (already complete/updated)
**Agent**: Primary (orchestrator)

### Tier 2: Parallel Execution (Multi-Language)
| Agent | Focus | Files | LOC |
|-------|-------|-------|-----|
| Agent 1 | Orchestrator + Shared | SKILL.md, shared/*.md | ~380 |
| Agent 2 | JavaScript | javascript/*.md | ~370 |
| Agent 3 | Python | python/*.md | ~300 |
| Agent 4 | Shell | shell/*.md | ~240 |
| Agent 5 | Config + Checklists | config/*.md, checklists/*.md | ~370 |

**Duration**: Parallel execution maximizes throughput

### Tier 3: Integration
**Agent**: Primary (orchestrator)
**Task**: Merge outputs, verify language detection, cross-reference validation
**Output**: Complete validated multi-language skill

<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:workstreams -->
## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | Orchestrator | Agent 1 | SKILL.md, shared/universal_patterns.md, shared/code_organization.md | Pending |
| W-B | JavaScript | Agent 2 | javascript/style_guide.md, javascript/quality_standards.md, javascript/quick_reference.md | Pending |
| W-C | Python | Agent 3 | python/style_guide.md, python/quality_standards.md, python/quick_reference.md | Pending |
| W-D | Shell | Agent 4 | shell/style_guide.md, shell/quality_standards.md, shell/quick_reference.md | Pending |
| W-E | Config/Checklists | Agent 5 | config/*.md, assets/checklists/*.md | Pending |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | W-A complete | All | Orchestrator ready for routing |
| SYNC-002 | W-B, W-C, W-D complete | All | Language references ready |
| SYNC-003 | W-E complete | All | Checklists ready for validation |
| SYNC-004 | All workstreams complete | All | Final verification and integration |

### File Ownership Rules
- Each file owned by ONE workstream (see table above)
- Cross-language patterns reference shared/universal_patterns.md
- Language-specific files are self-contained where possible
- Checklist items reference corresponding style/quality docs
- Conflicts resolved at SYNC points

<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:communication -->
## L3+: COMMUNICATION PLAN

### Checkpoints
- **Per File**: Verify against template structure
- **Per Phase**: Review complete before proceeding
- **Blockers**: Escalate if pattern conflicts found

### Escalation Path
1. Pattern conflicts → Check evidence files
2. Scope questions → Reference spec.md Out of Scope
3. Structure questions → Compare workflows-code

<!-- /ANCHOR:communication -->

---

## EVIDENCE SUMMARY

### JavaScript Patterns (206 files analyzed)

| Pattern | Source File | Line Reference |
|---------|-------------|----------------|
| File header | `scripts/utils/logger.js` | Lines 1-3 |
| Section dividers | `scripts/core/config.js` | Lines 6-8, 16-18 |
| Export with aliases | `scripts/core/config.js` | Lines 167-183 |
| JSDoc documentation | `mcp_server/handlers/memory-search.js` | Lines 333-361 |
| Error handling | `mcp_server/lib/errors/core.js` | Lines 52-63 |
| Guard clauses | `mcp_server/handlers/memory-search.js` | Lines 55-69 |
| Console logging | `mcp_server/context-server.js` | Line 204 |
| Reference comments | `mcp_server/context-server.js` | Lines 35, 42, 61, 67 |
| Test structure | `mcp_server/tests/attention-decay.test.js` | Lines 26-49 |
| Error codes | `mcp_server/lib/errors/core.js` | Lines 26-46 |
| Path resolution | `mcp_server/handlers/memory-search.js` | Lines 10-24 |

### Python Patterns (10 files analyzed)

| Pattern | Source File | Line Reference |
|---------|-------------|----------------|
| Shebang + header | `skill_advisor.py` | Lines 1-4 |
| Section dividers | `skill_advisor.py` | Lines 25-28, 375-377 |
| Docstring format | `skill_advisor.py` | Lines 6-16, 439-486 |
| Naming (snake_case) | `skill_advisor.py` | Lines 379, 439 |
| Constants (UPPER) | `skill_advisor.py` | Lines 31-34, 37-49 |
| Early return tuple | `package_skill.py` | Lines 98-104 |
| Type hints | `validate_config.py` | Lines 26, 53-54 |
| CLI argparse | `skill_advisor.py` | Lines 688-710 |
| Exit codes | `validate_document.py` | Lines 18-21 |
| Pytest patterns | `test_dual_threshold.py` | Lines 33-68 |

### Shell Patterns (60+ files analyzed)

| Pattern | Source File | Line Reference |
|---------|-------------|----------------|
| Shebang | `lib/common.sh` | Line 1 |
| Box header | `narsil-server.sh` | Lines 1-19 |
| Section dividers | `spec/validate.sh` | Throughout |
| set -euo pipefail | `spec/create.sh` | Line 22 |
| Color definitions | `lib/common.sh` | Lines 13-22 |
| Function naming | `lib/common.sh` | Lines 37-107 |
| Argument parsing | `spec/validate.sh` | Lines 81-98 |
| Exit code pattern | `lib/output.sh` | Lines 84-90 |
| Logging functions | `lib/common.sh` | Lines 47-55 |
| Process management | `narsil-server.sh` | Lines 55-163 |

### JSON/JSONC Patterns (3+ files analyzed)

| Pattern | Source File | Line Reference |
|---------|-------------|----------------|
| Box comment header | `config/config.jsonc` | Lines 1-3 |
| Section comments | `config/config.jsonc` | Lines 6-7, 16-17 |
| camelCase keys | `config/config.jsonc` | Throughout |
| Inline documentation | `config/config.jsonc` | Lines 42-43 |
| $schema reference | `opencode.json` | Line 2 |
| Environment vars | `opencode.json` | Lines 27-36 |
| Feature flags | `filters.jsonc` | Lines 8-29 |
| Weight configs | `complexity-config.jsonc` | Lines 13-22 |

---

<!--
NEXT STEP: Run /spec_kit:implement to create the 19 skill files
Parallel execution recommended: 5 agents for workstreams W-A through W-E
-->
