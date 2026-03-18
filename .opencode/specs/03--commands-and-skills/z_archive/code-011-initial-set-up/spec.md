---
title: "Feature Specification: workflows-code-opencode Skill [011-initial-set-up/spec]"
description: "Create a comprehensive multi-language code standards skill for OpenCode system code covering JavaScript (Node.js), Python, Shell scripts, and JSON/JSONC configuration. This skil..."
trigger_phrases:
  - "feature"
  - "specification"
  - "workflows"
  - "code"
  - "opencode"
  - "spec"
  - "030"
  - "initial"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: workflows-code-opencode Skill

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.0 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Create a comprehensive **multi-language** code standards skill for OpenCode system code covering **JavaScript (Node.js)**, **Python**, **Shell scripts**, and **JSON/JSONC configuration**. This skill provides naming conventions, formatting rules, and quality patterns distinct from the web-focused workflows-code skill, filling a gap where internal tooling development across multiple languages lacks formalized code style guidance.

**Key Decisions**:
- Simplified structure (no phase routing)
- snake_case as primary naming with camelCase aliases for backward compatibility
- **Hybrid architecture**: Shared universal patterns + language-specific references
- **Multi-language detection**: Extension → Keywords → User prompt

**Critical Dependencies**: Pattern extraction from existing OpenCode codebase (completed via 5-agent parallel research covering JS, Python, Shell, JSON/JSONC)

<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P1 |
| **Status** | Research Complete - Scope Expanded |
| **Created** | 2026-02-03 |
| **Updated** | 2026-02-04 |
| **Languages** | JavaScript, Python, Shell, JSON/JSONC |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The OpenCode development environment contains extensive **multi-language** code:
- **206+ JavaScript files** (MCP servers, scripts, utilities)
- **10+ Python files** (validators, advisors, test utilities)
- **60+ Shell scripts** (automation, validation, server management)
- **Multiple JSON/JSONC configs** (settings, tool configurations)

Currently, developers must infer patterns from existing code, leading to:
- Inconsistent naming conventions (mix of camelCase and snake_case in JS)
- Variable commenting styles across languages
- Module organization patterns that differ between languages
- No centralized reference for cross-language consistency

### Purpose
Create a comprehensive **multi-language** skill (`workflows-code-opencode`) that provides code style standards for ALL OpenCode system code:
- **JavaScript/Node.js**: MCP servers, scripts, ES modules
- **Python**: Automation scripts, validators, test utilities
- **Shell/Bash**: Build scripts, validation runners, setup utilities
- **JSON/JSONC**: Configuration files, package manifests

This enables consistent and maintainable internal tooling development across the entire OpenCode ecosystem.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Languages Covered:**
- **JavaScript/Node.js** (.js, .mjs, .cjs) - MCP servers, utility scripts, ES modules
- **Python** (.py) - Automation scripts, validators, test utilities
- **Shell/Bash** (.sh, .bash) - Build scripts, validation runners, setup utilities
- **JSON/JSONC** (.json, .jsonc) - Configuration files, package manifests

**Deliverables:**
- SKILL.md orchestrator (simplified, multi-language routing, no phase routing)
- **Shared references** (universal patterns, code organization principles)
- **JavaScript references** (style guide, quality standards, quick reference)
- **Python references** (style guide, quality standards, quick reference)
- **Shell references** (style guide, quality standards, quick reference)
- **Config references** (JSON/JSONC style guide, quick reference)
- **Checklists** (universal + language-specific P0/P1/P2 validation)

### Out of Scope
- Web/frontend development patterns - [covered by workflows-code]
- Browser-specific patterns (DOM, observers, animations) - [covered by workflows-code]
- Deployment/CDN workflows - [covered by workflows-code]
- MCP tool implementation guides - [separate skill if needed]
- Full development lifecycle (research/debug/verify phases) - [this is standards-only]
- **TypeScript** - Not currently used in OpenCode system code
- **Other languages** (Rust, Go) - Outside current codebase

### Files to Create (19 files)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| **Orchestrator** | | |
| `.opencode/skill/workflows-code-opencode/SKILL.md` | Create | Multi-language orchestrator with detection routing |
| **Shared References** | | |
| `.../references/shared/universal_patterns.md` | Create | Cross-language naming principles, commenting philosophy |
| `.../references/shared/code_organization.md` | Create | File structure, module organization concepts |
| **JavaScript References** | | |
| `.../references/javascript/style_guide.md` | Create | JS naming, formatting, headers, comments |
| `.../references/javascript/quality_standards.md` | Create | JS error handling, logging, modules, patterns |
| `.../references/javascript/quick_reference.md` | Create | JS cheat sheet, templates, one-liners |
| **Python References** | | |
| `.../references/python/style_guide.md` | Create | PY naming, formatting, docstrings |
| `.../references/python/quality_standards.md` | Create | PY error handling, logging, typing |
| `.../references/python/quick_reference.md` | Create | PY cheat sheet, templates |
| **Shell References** | | |
| `.../references/shell/style_guide.md` | Create | SH naming, formatting, shebang, quoting |
| `.../references/shell/quality_standards.md` | Create | SH error handling, exit codes, portability |
| `.../references/shell/quick_reference.md` | Create | SH cheat sheet, common patterns |
| **Config References** | | |
| `.../references/config/style_guide.md` | Create | JSON/JSONC structure, comments, schema refs |
| `.../references/config/quick_reference.md` | Create | JSON/JSONC patterns, validation |
| **Checklists** | | |
| `.../assets/checklists/universal_checklist.md` | Create | Cross-language P0 items (apply to ALL) |
| `.../assets/checklists/javascript_checklist.md` | Create | JS-specific P0/P1/P2 items |
| `.../assets/checklists/python_checklist.md` | Create | PY-specific P0/P1/P2 items |
| `.../assets/checklists/shell_checklist.md` | Create | SH-specific P0/P1/P2 items |
| `.../assets/checklists/config_checklist.md` | Create | JSON/JSONC-specific items |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

#### Universal Requirements (All Languages)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-U01 | Universal file header format | Language-appropriate box-drawing header pattern |
| REQ-U02 | Universal section organization | Numbered section dividers with standard ordering |
| REQ-U03 | Universal naming principles | Documented principles applicable across languages |
| REQ-U04 | Universal P0 checklist | Cross-language blocking validation items |
| REQ-U05 | Multi-language detection | SKILL.md routes to correct language reference |

#### JavaScript Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-JS01 | JS file header format | Three-line box-drawing `// ─── MODULE_TYPE: NAME ───` |
| REQ-JS02 | JS naming conventions | snake_case functions, UPPER_SNAKE_CASE constants |
| REQ-JS03 | JS module patterns | CommonJS exports, barrel files, 'use strict' |
| REQ-JS04 | JS error handling | Guard clauses, try-catch, custom MemoryError class |
| REQ-JS05 | JS checklist defined | JS-specific P0/P1/P2 items |

#### Python Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-PY01 | PY file header format | Shebang + box-drawing `# ─── COMPONENT: NAME ───` |
| REQ-PY02 | PY naming conventions | snake_case functions, PascalCase classes, UPPER_SNAKE constants |
| REQ-PY03 | PY docstring format | Google-style with Args, Returns sections |
| REQ-PY04 | PY error handling | try-except, early return tuple `(bool, str, list)` |
| REQ-PY05 | PY checklist defined | PY-specific P0/P1/P2 items |

#### Shell Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-SH01 | SH file header format | Shebang + box-drawing header |
| REQ-SH02 | SH strict mode | `set -euo pipefail` documented |
| REQ-SH03 | SH variable conventions | UPPERCASE globals, lowercase locals |
| REQ-SH04 | SH function conventions | snake_case, underscore prefix for private |
| REQ-SH05 | SH checklist defined | SH-specific P0/P1/P2 items |

#### JSON/JSONC Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-CF01 | JSON structure documented | camelCase keys, nesting depth conventions |
| REQ-CF02 | JSONC comment patterns | Section comments, inline documentation |
| REQ-CF03 | Config checklist defined | JSON/JSONC-specific items |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | JSDoc documentation patterns | Standard JSDoc format with @param, @returns, @throws |
| REQ-007 | Error handling patterns | Per-language error handling documented |
| REQ-008 | Console logging standards | Per-language logging conventions (JS: `[module]`, PY: print, SH: log_*) |
| REQ-009 | Reference comment patterns | Task (T001), Bug (BUG-001), Security (SEC-001), Requirement (REQ-001) |
| REQ-010 | Test file conventions | Per-language test naming, structure, assertion patterns |
| REQ-011 | Quick references complete | Each language has scannable cheat sheet (<30s lookup) |
| REQ-012 | Evidence citations | All patterns cite actual OpenCode file:line sources |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: SKILL.md activates on language-specific keywords:
  - JavaScript: "opencode style", "script standards", "mcp code quality", "node code style"
  - Python: "python style", "py standards", "python script"
  - Shell: "bash style", "shell script", "sh standards"
  - Config: "json format", "jsonc config", "json standards"
- **SC-002**: All 19 files created with correct structure (hybrid architecture)
- **SC-003**: Universal checklist applies to ALL languages; language-specific checklists have distinct P0/P1/P2 items
- **SC-004**: References cite actual examples from OpenCode codebase:
  - JavaScript: `system-spec-kit/scripts/`, `mcp_server/`
  - Python: `skill_advisor.py`, `validate_*.py`
  - Shell: `lib/common.sh`, `spec/validate.sh`
  - Config: `config.jsonc`, `.utcp_config.json`
- **SC-005**: Language detection routes to correct reference within 1 step
- **SC-006**: Quick references enable <30s pattern lookup for each language

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | workflows-code skill | Reference patterns need alignment | Mirror folder structure and format |
| Dependency | Existing OpenCode code | Patterns must match actual usage | Extract from real files (completed via 5-agent research) |
| Dependency | Multi-language codebase | All 4 language categories need coverage | Research completed for JS, PY, SH, JSON |
| Risk | Naming convention transition | JS codebase has mixed camelCase/snake_case | Document backward-compatible alias pattern (ADR-002) |
| Risk | Scope creep to MCP implementation | Could expand beyond code style | Keep focus on style/quality only |
| Risk | Language detection ambiguity | Some files may be unclear | Extension-first, keywords-second, ask-user fallback (ADR-004) |
| Risk | Cross-language consistency | Same principle, different syntax | Shared/ folder for universal patterns (ADR-005) |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Skill loads in <2 seconds (minimal file count)
- **NFR-P02**: Quick reference fits on single page (scannable in <30 seconds)

### Usability
- **NFR-U01**: Clear activation triggers differentiate from workflows-code
- **NFR-U02**: Examples cite real files from OpenCode codebase

### Maintainability
- **NFR-M01**: Structure mirrors workflows-code for consistency
- **NFR-M02**: Patterns extracted from actual code (evidence-based)

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Hybrid code**: Some scripts may have both Node.js and browser code - document which standards apply where
- **Legacy files**: Files predating standards should note transition path (add aliases, don't break)
- **Python/Shell interop**: Scripts that call Python from Shell or vice versa - apply standards to each language portion
- **JSON vs JSONC**: Pure JSON (no comments allowed) vs JSONC (comments allowed) - detect and route appropriately

### Error Scenarios
- **Conflicting patterns**: If OpenCode pattern differs from workflows-code, document which takes precedence (OpenCode wins for system code)
- **Missing evidence**: If cited file doesn't exist, fall back to general best practice with notation
- **Language detection ambiguity**: When file extension is unclear or missing, prompt user for clarification
- **Cross-language naming conflicts**: e.g., JS uses camelCase in some places while Python always uses snake_case - document the distinction

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: 19, LOC: ~1,660, Systems: 1 (skill system), Languages: 4 |
| Risk | 8/25 | Auth: N, API: N, Breaking: N |
| Research | 20/20 | 5-agent parallel exploration completed, all languages covered |
| Multi-Agent | 12/15 | Workstreams: 4 (one per language category) |
| Coordination | 8/15 | Dependencies: 2 (workflows-code, system-spec-kit), cross-language consistency |
| **Total** | **66/100** | **Level 3+ (governance for multi-language thoroughness)** |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Naming convention inconsistency | M | H | Document snake_case + camelCase alias pattern |
| R-002 | Scope creep to MCP guides | M | M | Strict scope boundary in spec |
| R-003 | Pattern drift from actual code | L | M | Cite specific file:line evidence |
| R-004 | Confusion with workflows-code | M | L | Distinct keywords, clear differentiation section |

<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Code Style Reference (Priority: P0)

**As a** developer writing OpenCode scripts, **I want** a code style guide, **so that** my code follows consistent patterns.

**Acceptance Criteria**:
1. Given I'm writing a new script, When I invoke the skill, Then I see naming conventions
2. Given I have a function, When I check the guide, Then I know to use snake_case
3. Given I need a header, When I check the guide, Then I see the three-line format

### US-002: Quality Validation (Priority: P1)

**As a** code reviewer, **I want** a validation checklist, **so that** I can verify code meets standards.

**Acceptance Criteria**:
1. Given a pull request, When I load the checklist, Then I see P0/P1/P2 items
2. Given a P0 violation, When identified, Then it blocks completion
3. Given all P0 pass, When P1 items checked, Then code can proceed with deferrals

### US-003: Quick Reference (Priority: P1)

**As a** developer under time pressure, **I want** a one-page cheat sheet, **so that** I can quickly look up patterns.

**Acceptance Criteria**:
1. Given limited time, When I load quick reference, Then I find key patterns in <30 seconds
2. Given a common pattern, When I search the cheat sheet, Then I find a copy-paste template

<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:approval-workflow -->
## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | User | Pending | |
| Pattern Validation | Auto (evidence check) | Passed | 2026-02-03 |
| Implementation Review | User | Pending | |
| Launch Approval | User | Pending | |

<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance -->
## 13. COMPLIANCE CHECKPOINTS

### Code Quality Compliance
- [x] Patterns extracted from actual codebase (evidence-based)
- [x] Naming conventions align with existing code
- [x] Structure mirrors established skill pattern (workflows-code)

### Documentation Compliance
- [x] Level 3+ template followed
- [x] All required sections present
- [ ] Decision record maintained (see decision-record.md)

<!-- /ANCHOR:compliance -->

---

<!-- ANCHOR:stakeholders -->
## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Developer (OpenCode) | Primary User | High | Skill invocation |
| Code Reviewer | Quality Gate | High | Checklist usage |
| Skill Maintainer | Owner | Medium | Updates/improvements |

<!-- /ANCHOR:stakeholders -->

---

<!-- ANCHOR:changelog -->
## 15. CHANGE LOG

### v1.0 (2026-02-03)
**Initial specification**
- Created from 3-agent multi-agent research phase
- Extracted patterns from system-spec-kit codebase
- Defined 5-file skill structure

### v1.1 (2026-02-03)
**Upgraded to Level 3+**
- Added governance sections
- Enhanced risk matrix
- Added user stories
- Added compliance checkpoints

### v2.0 (2026-02-04)
**MAJOR: Multi-Language Scope Expansion**
- Expanded from JavaScript-only to 4 languages: JavaScript, Python, Shell, JSON/JSONC
- Completed 5-agent parallel research covering all language categories
- Adopted hybrid architecture: shared patterns + language-specific references
- Expanded from 5 files to 19 files
- Increased LOC estimate from ~500 to ~1,660
- Added new requirements: REQ-U01-U05, REQ-JS01-JS05, REQ-PY01-PY05, REQ-SH01-SH05, REQ-CF01-CF03
- Added new ADRs: ADR-003 (Multi-Language Scope), ADR-004 (Language Detection), ADR-005 (Shared vs Specific)
- Updated complexity score from 50 to 66

<!-- /ANCHOR:changelog -->

---

<!-- ANCHOR:questions -->
## 16. OPEN QUESTIONS

- [RESOLVED] Naming convention: Use snake_case as primary with camelCase aliases for backward compatibility
- [RESOLVED] Scope: Focus on code style/quality only, not MCP implementation guides
- [RESOLVED] Multi-language scope: Expand to JS, Python, Shell, JSON/JSONC (per 5-agent research)
- [RESOLVED] Architecture: Hybrid approach (shared patterns + language-specific references)
- [OPEN] Test pattern detail level: How detailed should test file conventions be per language?
- [OPEN] TypeScript: Should we add TypeScript support in future iteration?

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
EVIDENCE SOURCES (5-Agent Parallel Research - 2026-02-04):

## Agent 1: Spec Enhancement Analysis
- Gap analysis, scope expansion recommendations
- 10 improvements identified, 3 new ADRs proposed

## Agent 2: JavaScript Pattern Extraction (206 files)
- .opencode/skill/system-spec-kit/scripts/utils/logger.js (file header)
- .opencode/skill/system-spec-kit/scripts/core/config.js (sections, exports, aliases)
- .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.js (JSDoc, naming)
- .opencode/skill/system-spec-kit/mcp_server/lib/errors/core.js (error handling, MemoryError)
- .opencode/skill/system-spec-kit/mcp_server/context-server.js (logging, security)
- .opencode/skill/system-spec-kit/mcp_server/lib/utils/retry.js (patterns, error classification)
- .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.js (atomic operations)

## Agent 3: Python Pattern Extraction (10 files)
- .opencode/scripts/skill_advisor.py (header, sections, docstrings, naming)
- .opencode/skill/mcp-code-mode/scripts/validate_config.py (validation patterns)
- .opencode/skill/sk-doc/scripts/validate_document.py (CLI, error handling)
- .opencode/skill/system-spec-kit/scripts/tests/test_dual_threshold.py (pytest patterns)

## Agent 4: Shell/Config Pattern Extraction (60+ scripts, 3 JSONC files)
- .opencode/skill/system-spec-kit/scripts/lib/common.sh (colors, functions, logging)
- .opencode/skill/system-spec-kit/scripts/spec/validate.sh (argument parsing, exit codes)
- .opencode/skill/mcp-narsil/scripts/narsil-server.sh (process management)
- .opencode/skill/system-spec-kit/config/config.jsonc (JSONC structure, sections)
- .opencode/skill/system-spec-kit/config/complexity-config.jsonc (weights, thresholds)

## Agent 5: Multi-Language Architecture
- Hybrid structure design (shared + language-specific)
- 19-file architecture proposal
- Two-tier validation model (universal + language-specific checklists)
-->
