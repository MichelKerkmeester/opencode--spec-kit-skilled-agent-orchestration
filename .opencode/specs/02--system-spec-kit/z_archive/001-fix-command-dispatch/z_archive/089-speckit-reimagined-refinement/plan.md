---
title: "Plan: system-spec-kit Reimagined Refinement [089-speckit-reimagined-refinement/plan]"
description: "title: \"Plan: system-spec-kit Reimagined Refinement\""
trigger_phrases:
  - "plan"
  - "system"
  - "spec"
  - "kit"
  - "reimagined"
  - "089"
  - "speckit"
importance_tier: "important"
contextType: "decision"
estimated-effort: "3-5 sessions"
phases: 4
spec: "089"
---
# Plan: system-spec-kit Reimagined Refinement

> Phased remediation plan addressing ~120+ findings across the entire system-spec-kit ecosystem.

---

## Phase 1: CRITICAL Bug Fixes (P0)

**Goal:** Eliminate all CRITICAL severity bugs that affect runtime behavior or agent decision-making.

### 1.1 Config: filters.jsonc Path Resolution (REQ-004, REQ-005)

**File:** `mcp_server/tools/memory-save.js` → `content-filter.js`

- Fix `path.join(__dirname, '..', '..', 'filters.jsonc')` → correct to `path.join(__dirname, '..', '..', '..', 'config', 'filters.jsonc')`
- Align property naming: either convert config keys to snake_case OR convert code lookups to camelCase
- Add fallback/default if config file not found (defensive)

### 1.2 MCP Server: LIKE Injection Fix (REQ-006)

**File:** `mcp_server/tools/memory-save.js`

- Escape `%` and `_` characters in user input before LIKE queries
- Add helper function: `escapeLikePattern(str)` → replaces `%` with `\%`, `_` with `\_`
- Apply to `resolve_memory_reference()` function

### 1.3 Documentation: LOC Count Reconciliation (REQ-002)

**Files:** `SKILL.md`, `references/templates/level_specifications.md`, `references/templates/level_selection_guide.md`

- Count actual LOC in each template level folder using `wc -l`
- Update all three documents to use identical, verified numbers
- Designate `level_specifications.md` as single source of truth for LOC counts

### 1.4 Documentation: Voyage Model Version (REQ-003)

**Files:** `references/memory/embedding_resilience.md`, `references/config/environment_variables.md`

- Check actual implementation: `mcp_server/lib/` for Voyage model reference
- Align both documents to match implementation

---

## Phase 2: HIGH Priority Fixes (P1)

**Goal:** Fix security issues, broken references, and logic bugs.

### 2.1 Scripts: validate.sh Security Fix (REQ-007)

**File:** `scripts/spec/validate.sh`

- Replace `eval`-based `get_rule_severity` with case statement or associative array lookup
- Test validation still works for all rule types

### 2.2 Scripts: create.sh Level 3+ Fix (REQ-009)

**File:** `scripts/spec/create.sh`

- Replace `printf '%d'` with string handling that preserves "3+" literal
- Test spec folder creation for all levels (1, 2, 3, 3+)

### 2.3 SKILL.md Corrections (REQ-008, REQ-011)

**File:** `SKILL.md`

- Replace 6x "AGENTS.md" references with "CLAUDE.md" where gates are documented
- Fix command file format: ".yaml" → ".md" (command files are markdown)
- Fix validate-spec.sh → validate.sh
- Fix generate-context.js line count: 142 → 277
- Fix Level range: "1-3" → "1-3+"
- Fix template architecture version: align v2.0/v2.2 references

### 2.4 References: Fix 13 Broken Cross-References (REQ-001)

**Files:** Multiple across references/ directory

| Bug | File | Fix |
|-----|------|-----|
| BUG-01 | path_scoped_rules.md (x2), template_style_guide.md | `validate-spec.sh` → `spec/validate.sh` |
| BUG-02 | template_style_guide.md | Remove references to non-existent `scripts/rules/` |
| BUG-03 | environment_variables.md | `../workflows/memory_system.md` → `../memory/memory_system.md` |
| BUG-04 | five-checks.md | `../../templates/checklist.md` → `../../templates/level_2/checklist.md` |
| BUG-05 | five-checks.md | `../../templates/decision-record.md` → `../../templates/level_3/decision-record.md` |
| BUG-06 | level_specifications.md | `./complexity_guide.md` → `./level_selection_guide.md` |
| BUG-07 | decision-format.md | Fix AGENTS.md relative path depth (4 → 6 levels) |
| BUG-08 | troubleshooting.md | Fix README.md reference (doesn't exist at skill root) |
| BUG-09 | five-checks.md | Fix vague SKILL.md section reference |
| BUG-10 | template_guide.md | Fix "Section 3.4" (SKILL.md uses whole numbers) |

### 2.5 Assets: Fix Broken References (partial REQ-001)

**Files:** `assets/level_decision_matrix.md`, `assets/parallel_dispatch_config.md`, `assets/template_mapping.md`

- Fix broken `spec.md` references (2 files reference non-existent spec.md)
- Fix broken `template_guide.md` link → `../references/templates/template_guide.md`
- Fix validate-spec.sh naming → validate.sh
- Add Level 3+ to template_mapping.md progressive enhancement section

### 2.6 Agents: Frontmatter & Section Fixes (REQ-010)

**Files:** Multiple across `.opencode/agent/`

- `orchestrate.md`: Change `mode: primary` → `mode: agent`; add Section 0 (Model Preference)
- `write.md`: Change `mode: all` → `mode: agent`; add `task` to allowed-tools
- `review.md`: Add missing intro paragraph
- `orchestrate.md`: Add @handover to Agent Capability Map
- All agents: Update Opus 4.5 → Opus 4.6; review GPT-5.2-Codex defaults
- `speckit.md`: Remove project-specific "Spec 082" reference

---

## Phase 3: MEDIUM Priority Fixes (P2)

**Goal:** Clean up dead code, deprecated content, and inconsistencies.

### 3.1 Config Cleanup (REQ-012)

- Document which config.jsonc sections are active vs dead
- Either wire dead sections into runtime code OR remove them
- Add deprecation notice to complexity-config.jsonc OR delete it
- Fix config/README.md to reflect actual function availability

### 3.2 Scripts Registry Cleanup (REQ-013)

- Remove phantom entries from scripts-registry.json (check-completion.sh, setup.sh)
- Verify all registry entries point to existing scripts

### 3.3 References: Deprecated Content (REQ-014)

- Consolidate deprecated content in level_selection_guide.md to a single appendix
- Remove or archive COMPLEXITY_GATE marker documentation (~70 lines)

### 3.4 Archive Pre-analysis 081 (REQ-015)

- Add SUPERSEDED header to all 8 files in 081-speckit-reimagined-pre-analysis
- Add implementation-summary.md mapping each recommendation to implementing file
- Consider consolidating 4 analysis + 4 recommendation files into 2 summary docs

---

## Phase 4: LOW Priority & Improvements

**Goal:** Address minor issues and improvement opportunities.

### 4.1 MCP Server Minor Fixes

- Fix indentation error in memory-search.js multi-concept validation
- Resolve duplicate ALLOWED_BASE_PATHS across 3 files → single import
- Address missing migration versions 10-11
- Consolidate triple constitutional cache into single TTL strategy

### 4.2 Scripts Minor Fixes

- Fix extractKeyTopics minimum word length (3 misses "db", "ui")
- Add block comment support to JSONC parser
- Review BigInt conversion in cleanup-orphaned-vectors.js

### 4.3 Documentation Improvements

- Reconcile MCP tool counts (22 in SKILL.md vs 14 in memory_system.md)
- Standardize memory file date format (ISO vs DD-MM-YY_HH-MM)
- Create cross-reference validation script for references/ directory
- Add version stamps to reference file headers

---

## Execution Strategy

| Phase | Priority | Estimated Effort | Approach |
|-------|----------|-----------------|----------|
| Phase 1 | P0 CRITICAL | 1 session | Direct fixes, test immediately |
| Phase 2 | P1 HIGH | 1-2 sessions | Systematic file-by-file |
| Phase 3 | P2 MEDIUM | 1 session | Cleanup batch |
| Phase 4 | LOW | Optional | As time permits |

**Risk:** All edits go to Public repo via symlink. Changes affect all projects using the framework.

**Mitigation:** Git branch per phase, test in anobel.com project, then merge.
