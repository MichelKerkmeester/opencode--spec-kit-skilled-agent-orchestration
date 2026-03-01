# All New Things — system-spec-kit Ecosystem

> Everything that needs to be created, added, or built from scratch. Gaps, missing content, new sections, new documents, and structural additions.

---

## MISSING CONTENT IN EXISTING FILES

### SKILL.md — Missing Documentation

| # | What's Missing | Where to Add | Detail |
|---|---------------|-------------|--------|
| N-01 | `complexity_decision_matrix.md` in asset inventory | `SKILL.md:233-239` | File exists in `assets/` but not listed in the assets table |
| N-02 | `templates/examples/` directory documentation | `SKILL.md` Section 2 or 3 | Complete worked examples for levels 1-3+ exist but are undocumented |
| N-03 | `templates/research.md` utility template | `SKILL.md:870` | Root-level template exists but not documented (only `handover.md` and `debug-delegation.md` mentioned) |
| N-04 | `templates/context_template.md` utility template | `SKILL.md:870` | Root-level template exists but not documented |
| N-05 | `scripts/setup/check-prerequisites.sh` documentation | `SKILL.md:192-202` | Script exists but not in Key Scripts table |
| N-06 | `scripts/memory/cleanup-orphaned-vectors.js` documentation | `SKILL.md` | Script exists but not mentioned |
| N-07 | `scripts/memory/rank-memories.js` documentation | `SKILL.md` | Script exists but not mentioned |
| N-08 | L1-L7 layer definitions explanation | `SKILL.md:457` | "22 tools across 7 layers" listed but layer purpose/hierarchy never explained |
| N-09 | Quick Start / TL;DR section | `SKILL.md` top | 881-line doc has no summary for experienced users reloading the skill |
| N-10 | Database path configurability note | `SKILL.md:876` | Hardcoded path doesn't mention `SPEC_KIT_DB_DIR` env var override |

### Assets — Missing Content

| # | What's Missing | Where to Add | Detail |
|---|---------------|-------------|--------|
| N-11 | Level 3+ in progressive enhancement | `assets/template_mapping.md` Section 3 | Copy commands and diagram only cover Levels 1-3. Level 3+ entirely absent |
| N-12 | Level 3+ folder structure example | `assets/template_mapping.md` Section 5 | Shows L1, L2, L3 examples but no L3+ |
| N-13 | Level 3+ copy commands | `assets/template_mapping.md` Section 3 | No `cp` commands for Level 3+ template files |
| N-14 | Scoring formula for complexity | `assets/complexity_decision_matrix.md` | Has dimension signals and weights but no formula to combine them into 0-100 score |
| N-15 | `implementation-summary.md` in Level 1 folder diagrams | `assets/level_decision_matrix.md:144-150`, `assets/template_mapping.md:144-150` | Level 1 diagrams omit this required file |
| N-16 | Migration table file lists | `assets/level_decision_matrix.md:248-254` | "Files to Add" column is empty for all level migrations |

### Agents — Missing Sections

| # | What's Missing | Where to Add | Detail |
|---|---------------|-------------|--------|
| N-17 | Section 0: Model Preference | `agent/orchestrate.md` | Template marks this as MANDATORY — orchestrate is the only agent missing it |
| N-18 | Intro paragraph | `agent/review.md:23-24` | Blank line between H1 and CRITICAL. Template requires 1-2 sentence description |
| N-19 | @handover in Agent Capability Map | `agent/orchestrate.md` Section 3 | Agent exists in directory but not in orchestrate's dispatch map |
| N-20 | @handover in Agent Selection Matrix | `agent/orchestrate.md` Section 4 | Same — missing from selection criteria |
| N-21 | Summary section | `agent/write.md` | All other agents have one. Template marks it as "RECOMMENDED" |
| N-22 | Escalation protocol | `agent/handover.md` | Other agents (research, debug) have it; handover doesn't |

### MCP Server — Missing Schema

| # | What's Missing | Where to Add | Detail |
|---|---------------|-------------|--------|
| N-23 | `bypassCache` in memory_search tool schema | `mcp_server/context-server.js:92` | Handler accepts it but schema doesn't declare it — clients can't discover it |

---

## NEW DOCUMENTS

### Reference Documents (Don't Exist Yet)

| # | Document | Purpose | Priority |
|---|----------|---------|----------|
| N-24 | MCP Tool Comprehensive Reference | Single doc covering all 22 tools with parameters, return types, usage examples | HIGH — SKILL.md says 22, memory_system.md covers 14. No complete reference exists |
| N-25 | Deprecated Features Migration Guide | How to move from COMPLEXITY_GATE markers, detect-complexity.js, expand-template.js to new patterns | MEDIUM — Multiple deprecated features documented but no migration path |
| N-26 | Cross-Reference Index | Map of which reference files link to which other files. Maintenance aid | LOW — 22 reference files with 13+ broken links suggest this would prevent drift |
| N-27 | Architecture Decision Records Guide | When and how to write ADRs, what makes a good one. Template exists but no guidance doc | LOW — decision-record.md template exists but no reference on writing ADRs |

### Pre-analysis 081 — Archive Documents

| # | Document | Purpose | Priority |
|---|----------|---------|----------|
| N-28 | SUPERSEDED header on all 8 files | Mark 081 as historical record | MEDIUM — Currently looks active when every recommendation is already implemented |
| N-29 | Implementation mapping document | Table mapping each 081 recommendation → implementing file in current codebase | MEDIUM — Validates that enhancement work was completed |
| N-30 | Consolidated analysis (optional) | Merge 4 analysis files (90%+ overlap) into 1 | LOW — Reduces redundancy from 4×15 pages to 1×25 pages |
| N-31 | Consolidated recommendations (optional) | Merge 4 recommendation files (conflicting priorities) into 1 | LOW — Single authoritative priority list |

---

## NEW SCRIPTS / TOOLS

| # | Script | Purpose | Priority |
|---|--------|---------|----------|
| N-32 | Cross-reference link validator | Bash/JS script that checks all markdown links in `references/` resolve to real files | MEDIUM — Would have caught all 13 broken links automatically |
| N-33 | Config validation on startup | Script that validates config file values match code expectations | LOW — Would catch config drift like the timezone mismatch |

---

## NEW CODE / FUNCTIONALITY

| # | Feature | File(s) | Detail |
|---|---------|---------|--------|
| N-34 | `escapeLikePattern()` utility function | New in `mcp_server/lib/utils/` or inline | Helper to escape `%` and `_` in LIKE queries. Required by F-03 fix |
| N-35 | `loadComplexityConfig()` function | `scripts/core/config.js` | README claims it exists but it doesn't. Either create it or remove the claim (F-39) |
| N-36 | `loadFilterConfig()` function | `scripts/core/config.js` | Same as above — README claims existence |

---

## STRUCTURAL REORGANIZATIONS

| # | Change | Current State | Proposed State |
|---|--------|--------------|----------------|
| N-37 | Split SKILL.md Section 3 | 421 lines, 14 subsections in one section | Break into: (a) Gate Integration, (b) Template System, (c) Memory System, (d) Utility Workflows, (e) Validation |
| N-38 | Reorder orchestrate.md Summary | Summary at Section 23, then 7 more sections follow | Move Summary to actual last section |
| N-39 | Reorder speckit.md sections | Output Verification (§13) after Summary (§11) | Move Output Verification before Anti-Patterns per template convention |
| N-40 | Standardize agent section ordering | Each agent has different section order | Align all to template: §0 Model → §1 Workflow → §2 Capability → ... → N-2 Verification → N-1 Anti-Patterns → N Resources → Summary |
| N-41 | Add version field to agent frontmatter | No version tracking | Add `version:` field so staleness is detectable |
| N-42 | Add Iron Law pattern to all agents | Only in write, review, orchestrate | "NEVER CLAIM COMPLETION WITHOUT VERIFICATION EVIDENCE" in all agents |

---

## Summary

| Category | Count |
|----------|-------|
| **Missing content in existing files** | 23 |
| **New documents** | 8 |
| **New scripts/tools** | 2 |
| **New code/functionality** | 3 |
| **Structural reorganizations** | 6 |
| **Total** | **42** |

---

## Priority Distribution

| Priority | Items | Examples |
|----------|-------|---------|
| **HIGH** | 8 | MCP tool reference, Level 3+ in template_mapping, orchestrate Section 0, escapeLikePattern |
| **MEDIUM** | 16 | 081 archive, link validator, scoring formula, missing SKILL.md docs, agent capability map |
| **LOW** | 18 | Cross-ref index, ADR guide, consolidated 081 files, config validation, structural reorgs |
