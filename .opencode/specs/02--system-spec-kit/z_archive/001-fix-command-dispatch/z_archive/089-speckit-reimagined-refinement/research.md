---
title: "Research: system-spec-kit Ecosystem Audit [089-speckit-reimagined-refinement/research]"
description: "title: \"Research: system-spec-kit Ecosystem Audit\""
trigger_phrases:
  - "research"
  - "system"
  - "spec"
  - "kit"
  - "ecosystem"
  - "089"
  - "speckit"
importance_tier: "normal"
contextType: "research"
methodology: "10 parallel Opus 4.6 research agents"
spec: "089"
total-findings: "~120+"
---
# Research: system-spec-kit Ecosystem Audit

> Complete findings from 10 parallel research agents analyzing the entire system-spec-kit skill ecosystem.

---

## 1. SKILL.md Analysis (Agent a8664c7)

**Score: 7/10 | 15 issues identified**

### Critical Findings

| # | Issue | Location | Severity |
|---|-------|----------|----------|
| 1 | LOC estimates wrong — Level 3 says ~890, actually ~1090 | Lines 185-188 | HIGH |
| 2 | 6x references to "AGENTS.md" — gates live in CLAUDE.md | Throughout | HIGH |
| 3 | Template version inconsistency: v2.0 vs v2.2 mixed | Multiple sections | MEDIUM |
| 4 | Command file format wrong: says .yaml, actually .md | Section 3 | MEDIUM |
| 5 | validate-spec.sh naming wrong (actual: validate.sh) | Section 4 | MEDIUM |
| 6 | generate-context.js line count: says 142, actually 277 | Section 3 | MEDIUM |
| 7 | Level range says "1-3" but should be "1-3+" | Section 2 | MEDIUM |
| 8 | Section 3 overloaded at 421 lines | Architecture | LOW |
| 9-15 | Missing documentation for complexity-config.jsonc, complexity_decision_matrix.md, templates/examples/, etc. | Asset inventory | LOW |

---

## 2. References Directory (Agent ae26762)

**22 files analyzed | 26 issues (2 CRITICAL, 11 HIGH, 8 MEDIUM, 5 LOW)**

### Cross-References: 4/10 | Consistency: 5/10 | Content Quality: 8/10

### CRITICAL Issues

**BUG-11: LOC Count Contradiction** (SKILL.md vs level_specifications.md)

| Level | SKILL.md | level_specifications.md | Delta |
|-------|----------|------------------------|-------|
| Level 1 | ~450 | ~270 | 67% higher |
| Level 2 | ~890 | ~390 | 128% higher |
| Level 3 | ~890 | ~540 | 65% higher |
| Level 3+ | ~1080 | ~640 | 69% higher |

**BUG-12: Voyage Model Version** — `embedding_resilience.md` says `voyage-3`, `environment_variables.md` says `voyage-4`

### 13 Broken Cross-References

| Bug | File | Broken Link | Correct Link |
|-----|------|-------------|--------------|
| 01 | path_scoped_rules.md (x2), template_style_guide.md | `scripts/validate-spec.sh` | `scripts/spec/validate.sh` |
| 02 | template_style_guide.md | `scripts/rules/*.sh` | Directory doesn't exist |
| 03 | environment_variables.md | `../workflows/memory_system.md` | `../memory/memory_system.md` |
| 04 | five-checks.md | `../../templates/checklist.md` | `../../templates/level_2/checklist.md` |
| 05 | five-checks.md | `../../templates/decision-record.md` | `../../templates/level_3/decision-record.md` |
| 06 | level_specifications.md | `./complexity_guide.md` | `./level_selection_guide.md` |
| 07 | decision-format.md | `../../../../AGENTS.md` | Needs 6 levels up, not 4 |
| 08 | troubleshooting.md | `../../README.md` | No README.md at skill root |
| 09 | five-checks.md | `SKILL.md - Validation Section` | Section doesn't exist by that name |
| 10 | template_guide.md | `Section 3.4 of SKILL.md` | SKILL.md uses whole numbers |

### Redundancy Issues

- Gate system documented in 5+ files
- Level definitions in 4 files (with conflicting numbers)
- MCP tools listed as 22 in SKILL.md, 14 in memory_system.md

---

## 3. Assets Directory (Agent a99f983)

**4 files analyzed | 18 findings (5 critical bugs)**

### Critical Bugs

| # | File | Issue |
|---|------|-------|
| 1 | level_decision_matrix.md | References non-existent `spec.md` |
| 2 | parallel_dispatch_config.md | References non-existent `spec.md` |
| 3 | template_mapping.md | Broken `template_guide.md` link |
| 4 | template_mapping.md | Level 3+ entirely absent from progressive enhancement |
| 5 | Multiple | validate-spec.sh naming wrong |

### Additional

- complexity_decision_matrix.md not listed in SKILL.md asset inventory
- No scoring formula in complexity_decision_matrix.md
- Level 1 folder diagrams missing implementation-summary.md

---

## 4. Scripts Directory (Agent aff37cb)

**~50 files analyzed | 12 significant issues | Grade: B+**

### Security Issues

| # | Issue | File | Severity |
|---|-------|------|----------|
| BUG-01 | Unsafe `eval` in get_rule_severity | `scripts/spec/validate.sh` | HIGH |
| BUG-02 | Rule scripts sourced without isolation | `scripts/spec/validate.sh` | MEDIUM |

### Logic Bugs

| # | Issue | File | Severity |
|---|-------|------|----------|
| BUG-03 | extractKeyTopics min word length 3 misses "db", "ui" | `scripts/memory/generate-context.js` | LOW |
| BUG-04 | JSONC parser doesn't handle `/* */` block comments | `scripts/utils/parse-jsonc.js` | LOW |
| BUG-05 | BigInt conversion may be incorrect | `scripts/maintenance/cleanup-orphaned-vectors.js` | LOW |
| LOGIC-04 | create.sh `%d` format truncates "3+" to "3" | `scripts/spec/create.sh` | HIGH |

### Data Integrity

- scripts-registry.json has phantom entries for non-existent scripts (check-completion.sh, setup.sh)
- sqlite-vec alpha version dependency (stability risk)

---

## 5. Config Directory (Agent a63cb7a)

**4 files analyzed | 19 findings (2 CRITICAL)**

### CRITICAL Bugs

**CRITICAL-1: filters.jsonc path resolution**
- `content-filter.js` line 44: `path.join(__dirname, '..', '..', 'filters.jsonc')`
- Resolves to: `skill-root/filters.jsonc` (WRONG)
- Actual location: `skill-root/config/filters.jsonc`

**CRITICAL-2: camelCase vs snake_case mismatch**
- Config keys: `minContentLength` (camelCase)
- Code lookups: `min_content_length` (snake_case)
- Even fixing the path, values would never load

### Dead Code

| Config Section | Status |
|---------------|--------|
| config.jsonc sections 2-11 | Never read at runtime |
| complexity-config.jsonc (entire file) | No code reads it |
| config/README.md | Claims non-existent functions |

### Additional

- timezoneOffsetHours mismatch: config says 1, fallback says 0
- embeddingModel in config is decorative (never read)
- confidenceTracking feature not implemented
- Two separate config ecosystems (config/ vs mcp_server/configs/) that don't communicate

---

## 6. MCP Server (Agent a72c1aa)

**Score: 8/10 overall | Strong architecture**

### Bugs

| # | Issue | Severity | File |
|---|-------|----------|------|
| BUG-C | LIKE injection in resolve_memory_reference | MEDIUM-HIGH | memory-save.js |
| BUG-A | Indentation error in multi-concept search | MEDIUM | memory-search.js |
| BUG-B | Duplicate ALLOWED_BASE_PATHS with different boundaries | MEDIUM | 3 files |
| BUG-D | Missing schema migration versions 10 and 11 | LOW | migrations |
| BUG-E | Triple constitutional cache with inconsistent TTLs | LOW | cache layer |

### Performance

- Redundant migrate_confidence_columns on every startup
- CREATE TABLE IF NOT EXISTS on every rate-limit call
- Sequential file processing at startup

### Strengths

- Good security posture (path traversal prevention, parameterized queries)
- Strong error handling and traceability
- Well-structured 7-layer architecture (L1-L7)
- 22 tools across 7 layers

---

## 7. Commands Directory (Agent a4c8601)

**19 .md files + 13 .yaml assets | Score: 10/10**

**FULLY COMPLIANT — Zero issues detected.**

- All YAML assets referenced and present
- All agent references validated
- Consistent naming conventions
- Complete frontmatter
- Proper Gate 3 enforcement

---

## 8. Agents Directory (Agent a948f7b)

**7 agents analyzed | Architecture: 8.5/10 | Template compliance: 7/10**

### Frontmatter/Structure Bugs

| # | Agent | Issue | Severity |
|---|-------|-------|----------|
| 1 | orchestrate.md | `mode: primary` not in valid set | HIGH |
| 2 | write.md | `mode: all` contradicts docs | HIGH |
| 3 | write.md | Missing `task` permission | HIGH |
| 4 | review.md | Missing intro paragraph | MEDIUM |
| 5 | orchestrate.md | Missing Section 0 (Model Preference) | MEDIUM |
| 6 | orchestrate.md | @handover missing from capability map | MEDIUM |

### Consistency Issues

- Model version staleness: Opus 4.5 referenced (4.6 exists)
- GPT-5.2-Codex defaults in debug/review agents
- Terminology drift: primary/secondary/subagent used inconsistently
- Project-specific "Spec 082" reference in framework file speckit.md

---

## 9. Pre-analysis 081 (Agent abf1403)

**8 files analyzed | Content: B- | Actionability: F**

### Key Finding: ENTIRELY OBSOLETE

Every single recommendation from the pre-analysis has already been implemented:

| Recommendation | Current Implementation |
|---------------|----------------------|
| RRF Search Fusion | `lib/search/rrf-fusion.js` EXISTS |
| BM25 Hybrid Search | `lib/search/bm25-index.js` EXISTS |
| Intent-Aware Retrieval | `lib/search/intent-classifier.js` EXISTS |
| Cross-Encoder Reranking | `lib/search/cross-encoder.js` EXISTS |
| Session Deduplication | `lib/session/session-manager.js` EXISTS |
| Tool Output Caching | `lib/cache/tool-cache.js` EXISTS |
| Causal Memory Graph | `lib/storage/causal-edges.js` EXISTS |
| Recovery Hints | `lib/errors/recovery-hints.js` EXISTS |
| Type-Specific Half-Lives | `lib/config/memory-types.js` EXISTS |
| Learning from Corrections | `lib/learning/corrections.js` EXISTS |
| Standardized Response | `lib/response/envelope.js` EXISTS |
| Layered Architecture | `lib/architecture/layer-definitions.js` EXISTS |

### Structural Issues

- 4 analysis files are 90%+ overlapping (parallel agents, never consolidated)
- 4 recommendation files have conflicting priority schemes
- Missing all Level 3+ spec artifacts (spec.md, plan.md, checklist.md, etc.)

---

## 10. Ecosystem-Wide Cross-Cutting Issues

### Naming Drift

The name "AGENTS.md" appears in SKILL.md (6x), decision-format.md, and agent files, but the mandatory gates actually live in `CLAUDE.md`. This causes confusion about which file to consult.

### Version Inconsistency

- Template architecture: "v2.0" in some files, "v2.2" in others
- Model versions: Opus 4.5, Opus 4.6, GPT-5.2-Codex referenced inconsistently
- Voyage model: v3 vs v4

### Dead Infrastructure

- Config directory is ~80% dead code (never read at runtime)
- complexity-config.jsonc is 100% unused
- scripts-registry.json has phantom entries

### Documentation ↔ Code Divergence

The documentation layer has drifted significantly from the code layer:
- Script names changed but docs not updated (validate-spec.sh → validate.sh)
- Files moved but paths not updated (13 broken cross-references)
- Features implemented but pre-analysis not updated (081 obsolete)
- Config evolved but README not updated (claims non-existent functions)

### Security Surface

Two identified security concerns:
1. `eval` in validate.sh (shell injection if rule names are user-influenced)
2. LIKE injection in MCP server (user input reaches LIKE without escaping)

Both are exploitable only in specific circumstances but should be fixed as a matter of hygiene.
