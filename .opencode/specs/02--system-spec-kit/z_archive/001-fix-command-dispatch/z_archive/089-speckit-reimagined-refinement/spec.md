---
title: "Spec 089: system-spec-kit Reimagined Refinement [089-speckit-reimagined-refinement/spec]"
description: "title: \"Spec 089: system-spec-kit Reimagined Refinement\""
trigger_phrases:
  - "spec"
  - "089"
  - "system"
  - "kit"
  - "speckit"
importance_tier: "important"
contextType: "decision"
complexity: "High (85+)"
created: "2026-02-06"
estimated-loc: ">500"
level: "3+"
scope: "system-spec-kit ecosystem audit and remediation"
status: "Active"
---
# Spec 089: system-spec-kit Reimagined Refinement

> Comprehensive audit and remediation plan for the entire system-spec-kit skill ecosystem, covering SKILL.md, references, assets, scripts, config, MCP server, agents, and commands.

---

## 1. SCOPE

### In Scope

- **SKILL.md**: Fix 15 identified documentation errors (LOC estimates, naming, cross-references)
- **References directory** (22 files): Fix 13 broken cross-references, 3 data inconsistencies
- **Assets directory** (4 files): Fix 5 critical bugs (broken refs, missing Level 3+ coverage)
- **Scripts directory** (~50 files): Address 12 issues including security (eval in validate.sh), logic bugs
- **Config directory** (4 files): Fix 2 CRITICAL bugs (filters.jsonc path + naming mismatch), remove dead config
- **MCP Server**: Fix MEDIUM-HIGH LIKE injection, indentation bug, duplicate security boundaries
- **Agents directory** (7 files): Fix mode/permission frontmatter errors, missing sections, model staleness
- **Pre-analysis 081**: Archive as superseded (all recommendations already implemented)

### Out of Scope

- Commands directory (audit found 0 issues - fully compliant)
- New feature development (RRF, BM25, cross-encoder, etc. already implemented per 081 findings)
- MCP server architecture changes (architecture scored 8/10)
- Template content changes (only cross-reference fixes)

### Dependencies

- Public repo symlink: `.opencode/` -> `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode`
- All edits affect the Public repo (framework-level changes)

---

## 2. REQUIREMENTS

### Functional Requirements

| ID | Requirement | Priority | Source |
|----|------------|----------|--------|
| REQ-001 | Fix all 13 broken cross-references in references/ | P0 | References audit |
| REQ-002 | Fix CRITICAL LOC count contradiction (SKILL.md vs level_specifications.md) | P0 | References audit BUG-11 |
| REQ-003 | Fix CRITICAL Voyage model version contradiction (voyage-3 vs voyage-4) | P0 | References audit BUG-12 |
| REQ-004 | Fix CRITICAL filters.jsonc path resolution bug in content-filter.js | P0 | Config audit |
| REQ-005 | Fix CRITICAL camelCase vs snake_case mismatch in filters config | P0 | Config audit |
| REQ-006 | Fix MEDIUM-HIGH LIKE injection in memory-save.js resolve_memory_reference | P0 | MCP Server audit |
| REQ-007 | Fix validate.sh unsafe eval in get_rule_severity | P1 | Scripts audit BUG-01 |
| REQ-008 | Fix AGENTS.md vs CLAUDE.md naming confusion in SKILL.md (6 references) | P1 | SKILL.md audit |
| REQ-009 | Fix create.sh DOC_LEVEL "3+" truncation by %d format | P1 | Scripts audit LOGIC-04 |
| REQ-010 | Fix agent frontmatter errors (mode, permissions) | P1 | Agents audit |
| REQ-011 | Fix SKILL.md LOC estimates, line counts, version references | P1 | SKILL.md audit |
| REQ-012 | Remove/consolidate dead config (config.jsonc sections 2-11, complexity-config.jsonc) | P2 | Config audit |
| REQ-013 | Fix scripts-registry.json phantom entries | P2 | Scripts audit |
| REQ-014 | Remove deprecated content from level_selection_guide.md | P2 | References audit |
| REQ-015 | Archive 081 pre-analysis as SUPERSEDED | P2 | Pre-analysis audit |

### Non-Functional Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| NFR-001 | All fixes must maintain backward compatibility with existing spec folders | P0 |
| NFR-002 | No changes to MCP server tool signatures (would break callers) | P0 |
| NFR-003 | All documentation fixes must use correct relative paths verified by file existence | P1 |

---

## 3. ACCEPTANCE CRITERIA

- [ ] All 13 broken cross-references resolve to existing files
- [ ] LOC counts are consistent across SKILL.md, level_specifications.md, and level_selection_guide.md
- [ ] Voyage model version is consistent across all documentation
- [ ] filters.jsonc path resolves correctly from content-filter.js
- [ ] Property naming (camelCase/snake_case) is consistent between config and code
- [ ] LIKE patterns in memory-save.js properly escape user input
- [ ] validate.sh does not use eval for severity lookup
- [ ] All SKILL.md cross-references point to correct file names
- [ ] create.sh handles "3+" level without truncation
- [ ] Agent frontmatter mode values are from valid set
- [ ] Zero validation warnings from validate.sh on updated files

---

## 4. EVIDENCE BASE

### Audit Sources (10 parallel Opus 4.6 agents)

| Agent | Area | Findings | Score |
|-------|------|----------|-------|
| a8664c7 | SKILL.md | 15 issues | 7/10 |
| ae26762 | References (22 files) | 26 issues (2 CRITICAL, 11 HIGH) | Cross-refs: 4/10 |
| a99f983 | Assets (4 files) | 18 findings (5 critical) | — |
| aff37cb | Scripts (~50 files) | 12 issues (1 security) | B+ code quality |
| a63cb7a | Config (4 files) | 19 findings (2 CRITICAL) | — |
| a72c1aa | MCP Server | 5 bugs (1 MEDIUM-HIGH) | 8/10 |
| a4c8601 | Commands (19+13 files) | 0 issues | Fully compliant |
| a948f7b | Agents (7 files) | 25+ findings | 8.5/10 arch, 7/10 compliance |
| abf1403 | Pre-analysis 081 | Entirely obsolete | F actionability |
| a255880 | Target 089 | Empty (needs population) | — |

### Total Issues Identified: ~120+

| Severity | Count | Description |
|----------|-------|-------------|
| CRITICAL | 6 | Path resolution, data contradictions, injection |
| HIGH | 15+ | Broken links, security (eval), logic bugs |
| MEDIUM | 30+ | Inconsistencies, deprecated content, redundancy |
| LOW | 20+ | Style, formatting, minor gaps |
| INFO | 50+ | Observations, improvement opportunities |
