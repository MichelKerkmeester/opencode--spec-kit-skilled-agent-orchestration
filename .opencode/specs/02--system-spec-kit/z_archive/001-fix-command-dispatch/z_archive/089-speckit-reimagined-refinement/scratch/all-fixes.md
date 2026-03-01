# All Fixes — system-spec-kit Ecosystem

> Every broken, incorrect, or misaligned item that needs correction. Organized by area.

---

## CRITICAL (P0) — Runtime Impact

| # | Area | Fix | File(s) | Detail |
|---|------|-----|---------|--------|
| F-01 | Config | Fix filters.jsonc path resolution | `scripts/lib/content-filter.js:44` | `path.join(__dirname, '..', '..')` resolves to skill-root, but file is in `config/`. Needs `'..', '..', '..', 'config'` |
| F-02 | Config | Fix camelCase/snake_case mismatch | `config/filters.jsonc` + `scripts/lib/content-filter.js` | Config uses `minContentLength`, code reads `min_content_length`. Values never load even with correct path |
| F-03 | MCP Server | Fix LIKE injection in resolve_memory_reference | `mcp_server/handlers/memory-save.js:364-398` | User input with `%` and `_` not escaped before LIKE queries. Add `escapeLikePattern()` helper |
| F-04 | Docs | Reconcile LOC counts across 3 documents | `SKILL.md:185-188`, `level_specifications.md:31-34`, `level_selection_guide.md:123-126` | SKILL.md says L2=~890, level_specs says L2=~390. Difference up to 128%. Count actual LOC and align all 3 |
| F-05 | Docs | Fix Voyage model version contradiction | `embedding_resilience.md:75`, `environment_variables.md:49` | One says `voyage-3`, other says `voyage-4`. Check actual implementation and align |

---

## HIGH (P1) — Broken References & Security

### Scripts

| # | Fix | File | Detail |
|---|-----|------|--------|
| F-06 | Replace `eval` in get_rule_severity | `scripts/spec/validate.sh:234` | `eval "echo \"\${$v:-error}\""` — use case statement or associative array instead |
| F-07 | Fix `%d` format truncating "3+" | `scripts/spec/create.sh:446` | `printf '%d'` outputs `3` for "3+". Use `%s` for DOC_LEVEL in subfolder JSON output |

### SKILL.md

| # | Fix | Location | Detail |
|---|-----|----------|--------|
| F-08 | Change 6x "AGENTS.md" → "CLAUDE.md" | Lines 12, 257, 426, 775, 776, 873 | Gates live in CLAUDE.md, not AGENTS.md |
| F-09 | Fix command format ".yaml" → ".md" | Line 635 | Command files are `.md`, not `.yaml`. YAML files are supplementary assets |
| F-10 | Fix "validate-spec.sh" → "validate.sh" | Line 655 | Script was renamed. Actual path: `scripts/spec/validate.sh` |
| F-11 | Fix generate-context.js line count | Line 247 | Says "142-line CLI", actually 277 lines |
| F-12 | Fix level range "1-3" → "1-3+" | Line 12 | Missing Level 3+ from description |
| F-13 | Fix template version inconsistency | Line 3 vs 181 vs 303 | Frontmatter says v2.2, body says v2.0. Pick one |

### References — Broken Cross-References (13 links)

| # | Fix | File | Broken Link | Correct Link |
|---|-----|------|-------------|--------------|
| F-14 | Fix validate script path (×3) | `path_scoped_rules.md:101,162`, `template_style_guide.md:267` | `scripts/validate-spec.sh` | `scripts/spec/validate.sh` |
| F-15 | Remove non-existent scripts/rules/ refs | `template_style_guide.md:268-270` | `scripts/rules/check-*.sh` | Directory doesn't exist; rules are in validate.sh |
| F-16 | Fix memory_system.md subdirectory | `environment_variables.md:199` | `../workflows/memory_system.md` | `../memory/memory_system.md` |
| F-17 | Fix checklist template path | `five-checks.md:317` | `../../templates/checklist.md` | `../../templates/level_2/checklist.md` |
| F-18 | Fix decision-record template path | `five-checks.md:319` | `../../templates/decision-record.md` | `../../templates/level_3/decision-record.md` |
| F-19 | Fix complexity_guide rename | `level_specifications.md:713` | `./complexity_guide.md` | `./level_selection_guide.md` |
| F-20 | Fix AGENTS.md path depth | `decision-format.md:358` | `../../../../AGENTS.md` (4 levels) | `../../../../../../AGENTS.md` (6 levels) |
| F-21 | Fix non-existent README.md ref | `troubleshooting.md:455` | `../../README.md` | Skill root has SKILL.md, not README.md |
| F-22 | Fix vague SKILL.md section ref | `five-checks.md:318` | "SKILL.md - Validation Section" | Section doesn't exist by that name |
| F-23 | Fix decimal section reference | `template_guide.md:859` | "Section 3.4 of SKILL.md" | SKILL.md uses whole numbers only |

### Assets — Broken References

| # | Fix | File | Detail |
|---|-----|------|--------|
| F-24 | Fix broken spec.md reference | `assets/level_decision_matrix.md:319` | References non-existent `spec.md` at skill root |
| F-25 | Fix broken spec.md reference | `assets/parallel_dispatch_config.md` | Same — references non-existent `spec.md` |
| F-26 | Fix broken template_guide.md link | `assets/template_mapping.md:368` | `../references/template_guide.md` → `../references/templates/template_guide.md` |
| F-27 | Fix validate-spec.sh naming | `assets/level_decision_matrix.md:192` | `validate-spec.sh` → `validate.sh` |

### Agents — Frontmatter & Structure

| # | Fix | File | Detail |
|---|-----|------|--------|
| F-28 | Fix mode: primary → agent | `agent/orchestrate.md:4` | `primary` not in valid set (`subagent`, `agent`, `all`) |
| F-29 | Fix mode: all → agent | `agent/write.md:5` | Contradicts orchestrate.md description as "secondary" |
| F-30 | Add missing `task: deny` | `agent/write.md` frontmatter | All other subagents have explicit `task: deny` |
| F-31 | Remove project-specific Spec 082 ref | `agent/speckit.md:481` | Framework file should not reference project-specific specs |
| F-32 | Fix mermaid diagram logic | `agent/orchestrate.md:47-69` | QUALITY gate → HANDLE FAILURES on pass (should → SYNTHESIZE) |
| F-33 | Fix step count in summary | `agent/handover.md` Section 8 | Says "6 steps" but workflow has 7 |
| F-34 | Fix "mode: secondary" terminology | `agent/orchestrate.md` Section 3 | `secondary` is not a valid mode value; should be `subagent` |

### MCP Server

| # | Fix | File | Detail |
|---|-----|------|--------|
| F-35 | Fix indentation in multi-concept search | `mcp_server/handlers/memory-search.js:502-506` | Closing braces at wrong indentation level |
| F-36 | Fix memory_conflicts DDL inconsistency | `mcp_server/handlers/memory-save.js:270-292` | Column names differ between migration v4 and v12 |

---

## MEDIUM (P2) — Dead Code, Inconsistencies, Deprecated Content

### Config Dead Code

| # | Fix | File | Detail |
|---|-----|------|--------|
| F-37 | Document or remove dead config sections 2-11 | `config/config.jsonc` | Never read at runtime. Add "DOCUMENTATION ONLY" headers or delete |
| F-38 | Deprecate or delete complexity-config.jsonc | `config/complexity-config.jsonc` | Entirely unused — no code reads it. No `loadComplexityConfig()` exists |
| F-39 | Fix README false function claims | `config/README.md:109` | Claims `loadComplexityConfig` and `loadFilterConfig` — neither exists |
| F-40 | Fix timezoneOffsetHours mismatch | `config/config.jsonc:14` vs `scripts/core/config.js:28` | Config=1 (CET), fallback=0 (UTC). Should match |

### Scripts

| # | Fix | File | Detail |
|---|-----|------|--------|
| F-41 | Remove phantom registry entries | `scripts/scripts-registry.json` | `check-completion.sh` and `setup.sh` referenced but don't exist |

### References — Deprecated Content

| # | Fix | File | Detail |
|---|-----|------|--------|
| F-42 | Consolidate deprecated COMPLEXITY_GATE content | `references/templates/level_selection_guide.md:132-200+` | ~70 lines of deprecated content. Move to appendix or delete |
| F-43 | Remove deprecated flag references | `references/templates/level_specifications.md:481-486` | `--complexity` and `--expand` flags deprecated |

### MCP Server — Consistency

| # | Fix | File | Detail |
|---|-----|------|--------|
| F-44 | Consolidate ALLOWED_BASE_PATHS | 3 files: `core/config.js`, `vector-index.js`, `search-results.js` | Different security boundaries across modules. Use single import |
| F-45 | Consolidate constitutional cache | `vector-index.js`, `memory-surface.js`, `db-state.js` | 3 separate caches with TTLs of 5min, 1min, manual. Should be unified |
| F-46 | Document missing migration versions 10-11 | `mcp_server/lib/search/vector-index.js` | Migrations jump 9→12. Add no-op entries or document why |

### References — Inconsistencies

| # | Fix | File | Detail |
|---|-----|------|--------|
| F-47 | Standardize memory file date format | `folder_structure.md:217` vs `save_workflow.md` | ISO format vs DD-MM-YY_HH-MM format |
| F-48 | Fix duplicate skill listing | `sub_folder_versioning.md:163-164` | `system-spec-kit` listed twice with different descriptions |

---

## LOW (P3) — Minor Issues

| # | Fix | File | Detail |
|---|-----|------|--------|
| F-49 | Fix extractKeyTopics min word length | `scripts/core/workflow.js:88` | Regex `{2,}` misses 2-char terms like "db", "ui", "js" |
| F-50 | Add block comment support to JSONC parser | `scripts/core/config.js:36-89` | Only handles `//` comments, not `/* */` |
| F-51 | Review BigInt conversion | `scripts/maintenance/cleanup-orphaned-vectors.js:84` | `BigInt(row.rowid)` may be unnecessary or cause type mismatch |
| F-52 | Update agent model versions | All agent `.md` files | Opus 4.5 → 4.6, review GPT-5.2-Codex defaults |
| F-53 | Reconcile MCP tool count | `SKILL.md` vs `memory_system.md` | 22 tools vs 14 tools |
| F-54 | Fix inconsistent import patterns | Multiple MCP handler files | Mix of relative paths and `path.join(LIB_DIR, ...)` |
| F-55 | Remove redundant migrate_confidence_columns | `mcp_server/lib/search/vector-index.js:807-968` | Runs ~15 ALTER statements every startup; columns already exist from migrations |
| F-56 | Fix per-call CREATE TABLE IF NOT EXISTS | `mcp_server/core/db-state.js:105-136` | Config table creation should happen once at init, not every call |

---

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| **CRITICAL (P0)** | 5 | Runtime bugs, data contradictions |
| **HIGH (P1)** | 31 | Broken references, security, naming errors |
| **MEDIUM (P2)** | 12 | Dead code, deprecated content, inconsistencies |
| **LOW (P3)** | 8 | Minor improvements |
| **Total** | **56** | |
