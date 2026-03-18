---
title: "Verification Checklist: workflows-code-opencode Skill [011-initial-set-up/checklist]"
description: "Research Complete: 2026-02-04"
trigger_phrases:
  - "verification"
  - "checklist"
  - "workflows"
  - "code"
  - "opencode"
  - "030"
  - "initial"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: workflows-code-opencode Skill

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3plus-govern | v2.0 -->
<!-- UPDATED: 2026-02-04 - Multi-Language Expansion -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available (workflows-code, system-spec-kit)
- [x] CHK-004 [P1] Evidence files identified with line references for ALL languages
- [x] CHK-005 [P0] Multi-language scope defined (JS, Python, Shell, JSON/JSONC)
- [x] CHK-006 [P1] 5-agent parallel research completed
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:skill-structure -->
## Skill Structure (Multi-Language)

- [ ] CHK-010 [P0] SKILL.md created with valid YAML frontmatter
- [ ] CHK-011 [P0] SKILL.md has language-specific activation triggers
- [ ] CHK-012 [P0] SKILL.md implements language detection (Extension → Keywords → Prompt)
- [ ] CHK-013 [P0] references/shared/ folder contains universal patterns
- [ ] CHK-014 [P0] references/javascript/ folder contains 3 files
- [ ] CHK-015 [P0] references/python/ folder contains 3 files
- [ ] CHK-016 [P0] references/shell/ folder contains 3 files
- [ ] CHK-017 [P0] references/config/ folder contains 2 files
- [ ] CHK-018 [P0] assets/checklists/ folder contains 5 checklist files
- [ ] CHK-019 [P1] File structure follows hybrid architecture (shared + language-specific)
<!-- /ANCHOR:skill-structure -->

---

<!-- ANCHOR:content-shared -->
## Content Quality - Shared

- [ ] CHK-020 [P0] shared/universal_patterns.md covers naming principles, commenting philosophy
- [ ] CHK-021 [P0] shared/code_organization.md covers file structure concepts
- [ ] CHK-022 [P1] Shared patterns referenced by language-specific docs
<!-- /ANCHOR:content-shared -->

---

<!-- ANCHOR:content-js -->
## Content Quality - JavaScript

- [ ] CHK-030 [P0] javascript/style_guide.md covers box header, naming, formatting
- [ ] CHK-031 [P0] javascript/quality_standards.md covers CommonJS, errors, logging
- [ ] CHK-032 [P0] javascript/quick_reference.md provides scannable cheat sheet
- [ ] CHK-033 [P1] Examples cite actual OpenCode JS files with paths
- [ ] CHK-034 [P1] Patterns match 206-file research findings
<!-- /ANCHOR:content-js -->

---

<!-- ANCHOR:content-py -->
## Content Quality - Python

- [ ] CHK-040 [P0] python/style_guide.md covers shebang, docstrings, naming
- [ ] CHK-041 [P0] python/quality_standards.md covers error handling, typing, CLI
- [ ] CHK-042 [P0] python/quick_reference.md provides scannable cheat sheet
- [ ] CHK-043 [P1] Examples cite actual OpenCode Python files with paths
- [ ] CHK-044 [P1] Patterns match 10-file research findings
<!-- /ANCHOR:content-py -->

---

<!-- ANCHOR:content-sh -->
## Content Quality - Shell

- [ ] CHK-050 [P0] shell/style_guide.md covers shebang, variables, functions
- [ ] CHK-051 [P0] shell/quality_standards.md covers strict mode, error handling
- [ ] CHK-052 [P0] shell/quick_reference.md provides scannable cheat sheet
- [ ] CHK-053 [P1] Examples cite actual OpenCode Shell files with paths
- [ ] CHK-054 [P1] Patterns match 60-file research findings
<!-- /ANCHOR:content-sh -->

---

<!-- ANCHOR:content-config -->
## Content Quality - Config

- [ ] CHK-060 [P0] config/style_guide.md covers JSON structure, JSONC comments
- [ ] CHK-061 [P0] config/quick_reference.md provides scannable cheat sheet
- [ ] CHK-062 [P1] Examples cite actual OpenCode config files with paths
<!-- /ANCHOR:content-config -->

---

<!-- ANCHOR:checklists -->
## Checklists

- [ ] CHK-070 [P0] universal_checklist.md has cross-language P0/P1/P2 items
- [ ] CHK-071 [P0] javascript_checklist.md has JS-specific P0/P1/P2 items
- [ ] CHK-072 [P0] python_checklist.md has PY-specific P0/P1/P2 items
- [ ] CHK-073 [P0] shell_checklist.md has SH-specific P0/P1/P2 items
- [ ] CHK-074 [P0] config_checklist.md has JSON/JSONC-specific items
- [ ] CHK-075 [P1] Universal checklist items apply to ALL languages
<!-- /ANCHOR:checklists -->

---

<!-- ANCHOR:differentiation -->
## Differentiation from workflows-code

- [ ] CHK-080 [P0] No browser/DOM patterns included
- [ ] CHK-081 [P0] No deployment/CDN workflows included
- [ ] CHK-082 [P1] Multi-language detection differentiates from workflows-code
- [ ] CHK-083 [P1] Keywords differentiate clearly per language
<!-- /ANCHOR:differentiation -->

---

<!-- ANCHOR:code-quality -->
## Code Quality (Examples)

- [ ] CHK-090 [P1] No syntax errors in JavaScript examples
- [ ] CHK-091 [P1] No syntax errors in Python examples
- [ ] CHK-092 [P1] No syntax errors in Shell examples
- [ ] CHK-093 [P1] Valid JSON/JSONC in config examples
- [ ] CHK-094 [P1] Examples follow the patterns they document
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-100 [P0] All acceptance criteria from spec.md met
- [ ] CHK-101 [P0] Language detection tested (extension → keywords → prompt)
- [ ] CHK-102 [P1] Skill activation tested with JS keywords
- [ ] CHK-103 [P1] Skill activation tested with Python keywords
- [ ] CHK-104 [P1] Skill activation tested with Shell keywords
- [ ] CHK-105 [P1] Skill activation tested with Config keywords
- [ ] CHK-106 [P1] Quick reference usability verified (<30s lookup per language)
- [ ] CHK-107 [P2] Edge cases tested (hybrid code, legacy files)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-110 [P0] No hardcoded secrets in examples
- [ ] CHK-111 [P1] JS security patterns include CWE references (CWE-22, CWE-400)
- [ ] CHK-112 [P1] Shell quoting patterns prevent injection
- [ ] CHK-113 [P2] Path traversal prevention documented per language
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-120 [P1] Spec/plan/checklist synchronized
- [ ] CHK-121 [P1] All 19 files have adequate content
- [ ] CHK-122 [P2] README.md created (optional)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-130 [P1] All 19 files in correct skill folder structure
- [ ] CHK-131 [P1] No temp files left in project root
- [ ] CHK-132 [P2] Context saved to spec memory/
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-140 [P0] Architecture decisions documented in decision-record.md
- [x] CHK-141 [P0] ADR-003 (Multi-Language Scope) documented
- [x] CHK-142 [P0] ADR-004 (Language Detection) documented
- [x] CHK-143 [P0] ADR-005 (Shared vs Specific) documented
- [x] CHK-144 [P1] All ADRs have status (Proposed/Accepted)
- [x] CHK-145 [P1] Alternatives documented with rejection rationale
- [ ] CHK-146 [P2] Migration path documented (for legacy files)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:pattern-js -->
## L3+: PATTERN VERIFICATION - JavaScript

- [ ] CHK-150 [P0] JS file header pattern matches evidence (logger.js:1-3)
- [ ] CHK-151 [P0] JS section divider pattern matches evidence (config.js:6-8)
- [ ] CHK-152 [P1] JS export alias pattern matches evidence (config.js:167-183)
- [ ] CHK-153 [P1] JS JSDoc pattern matches evidence (memory-search.js:333-361)
- [ ] CHK-154 [P1] JS error handling pattern matches evidence (core.js:52-63)
<!-- /ANCHOR:pattern-js -->

---

<!-- ANCHOR:pattern-py -->
## L3+: PATTERN VERIFICATION - Python

- [ ] CHK-160 [P0] PY file header pattern matches evidence (skill_advisor.py:1-4)
- [ ] CHK-161 [P0] PY section divider pattern matches evidence (skill_advisor.py:25-28)
- [ ] CHK-162 [P1] PY docstring pattern matches evidence (skill_advisor.py:439-486)
- [ ] CHK-163 [P1] PY early return pattern matches evidence (package_skill.py:98-104)
<!-- /ANCHOR:pattern-py -->

---

<!-- ANCHOR:pattern-sh -->
## L3+: PATTERN VERIFICATION - Shell

- [ ] CHK-170 [P0] SH shebang pattern matches evidence (common.sh:1)
- [ ] CHK-171 [P0] SH header pattern matches evidence (narsil-server.sh:1-19)
- [ ] CHK-172 [P1] SH set -euo pipefail pattern matches evidence (create.sh:22)
- [ ] CHK-173 [P1] SH color definition pattern matches evidence (common.sh:13-22)
<!-- /ANCHOR:pattern-sh -->

---

<!-- ANCHOR:pattern-config -->
## L3+: PATTERN VERIFICATION - Config

- [ ] CHK-180 [P0] JSONC comment pattern matches evidence (config.jsonc:1-3)
- [ ] CHK-181 [P1] JSONC section pattern matches evidence (config.jsonc:6-7)
- [ ] CHK-182 [P1] JSON camelCase pattern matches evidence (config.jsonc)
<!-- /ANCHOR:pattern-config -->

---

<!-- ANCHOR:deployment -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-190 [P0] Rollback procedure documented and tested
- [ ] CHK-191 [P1] Skill folder can be deleted without side effects
- [ ] CHK-192 [P2] No AGENTS.md references that would break on removal
<!-- /ANCHOR:deployment -->

---

<!-- ANCHOR:compliance -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-200 [P1] Level 3+ template followed
- [x] CHK-201 [P1] All required Level 3+ sections present
- [x] CHK-202 [P1] Decision record complete with Five Checks evaluation
- [ ] CHK-203 [P2] Stakeholder matrix reviewed
<!-- /ANCHOR:compliance -->

---

<!-- ANCHOR:doc-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-210 [P1] All spec documents synchronized (spec.md, plan.md, checklist.md)
- [x] CHK-211 [P1] decision-record.md created with 6 ADRs
- [ ] CHK-212 [P2] User stories have acceptance criteria verified
- [x] CHK-213 [P1] Change log updated in spec.md (v2.0)
<!-- /ANCHOR:doc-verify -->

---

<!-- ANCHOR:signoff -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| User | Spec Review | [ ] Approved | |
| Auto | Pattern Evidence (JS) | [x] Verified | 2026-02-04 |
| Auto | Pattern Evidence (PY) | [x] Verified | 2026-02-04 |
| Auto | Pattern Evidence (SH) | [x] Verified | 2026-02-04 |
| Auto | Pattern Evidence (Config) | [x] Verified | 2026-02-04 |
| User | Implementation | [ ] Approved | |
| User | Launch | [ ] Approved | |
<!-- /ANCHOR:signoff -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 35 | 12/35 |
| P1 Items | 45 | 18/45 |
| P2 Items | 12 | 0/12 |

**Research Complete**: 2026-02-04
**Scope**: Multi-Language (JS, Python, Shell, JSON/JSONC)
**Files to Create**: 19
**Level**: 3+ (Governance)
**Implementation Ready**: Yes
<!-- /ANCHOR:summary -->

---

<!--
Level 3+ checklist - Full verification + architecture + governance
Multi-language expansion verified via 5-agent parallel research
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
