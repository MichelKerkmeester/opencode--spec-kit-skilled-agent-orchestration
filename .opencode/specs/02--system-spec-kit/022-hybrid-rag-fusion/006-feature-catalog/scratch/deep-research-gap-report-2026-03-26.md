# Deep Research Gap Report: Feature Catalog & Code Audit Completeness

**Date:** 2026-03-26
**Method:** 7-agent parallel research via GPT-5.4 (5 high + 2 xhigh)
**Scope:** 006-feature-catalog + 007-code-audit-per-feature-catalog

---

## EXECUTIVE SUMMARY

Seven GPT-5.4 agents systematically cross-referenced the Spec Kit Memory MCP server source code against the feature catalog (222 snippets across 21 categories) and the code audit (22 phase folders). The MCP tool surface (33 tools) is fully cataloged, but significant gaps exist in internal subsystems, scripts, configuration, and newer features.

### Key Metrics

| Dimension | Current | Gaps Found |
|-----------|---------|------------|
| MCP tools registered | 33 | 0 completely unmapped (4 PARTIAL) |
| Feature catalog snippets | 222 | ~72 source-level gaps across all categories |
| Code audit coverage | 217/222 snippets | 5 unaudited snippets |
| SKILL.md documented features | 43 grouped | 14 unmapped to catalog |
| BOTH_MISSING (no catalog + no audit) | - | 13 capabilities |
| Phantom tools in catalog | 1 | `read_spec_section` (planned, not live) |

---

## 1. MCP TOOL SURFACE (Agent 1)

**Status: GOOD** -- All 33 registered tools have catalog coverage.

### Tools with PARTIAL coverage (grouped docs, not dedicated snippets)

| Tool | Current Catalog Entry | Issue |
|------|----------------------|-------|
| `shared_space_upsert` | 02/07 (grouped) | Shared-memory admin tools bundled in one doc |
| `shared_space_membership_set` | 02/07 (grouped) | Same |
| `shared_memory_status` | 02/07 (grouped) | Same |
| `shared_memory_enable` | 02/07 (grouped) | Same |
| `memory_ingest_start` | 05/05 (grouped) | Async ingest tools bundled in one lifecycle doc |
| `memory_ingest_status` | 05/05 (grouped) | Same |
| `memory_ingest_cancel` | 05/05 (grouped) | Same |

### Phantom Tool

- `read_spec_section(filePath, heading)` -- documented in `01/07` and `FEATURE_CATALOG.md` but NOT in the live MCP tool registry (`tool-schemas.ts`). **Action:** Mark as planned/deferred or remove.

---

## 2. FEATURE CATALOG GAPS BY CATEGORY (Agents 3 + 4)

### Categories 01-11 (Agent 3): 30 gaps

| Category | Snippets | Valid Paths | Accurate | Gaps |
|----------|----------|-------------|----------|------|
| 01--retrieval | 11 | 10/11 | 11/11 | 3 |
| 02--mutation | 10 | 10/10 | 10/10 | 3 |
| 03--discovery | 3 | 3/3 | 3/3 | 2 |
| 04--maintenance | 2 | 2/2 | 2/2 | 3 |
| 05--lifecycle | 7 | 7/7 | 7/7 | 2 |
| 06--analysis | 7 | 7/7 | 7/7 | 0 |
| 07--evaluation | 2 | 2/2 | 2/2 | 3 |
| 08--bug-fixes | 11 | 11/11 | 11/11 | 4 |
| 09--eval-measurement | 14 | 13/14 | 14/14 | 4 |
| 10--graph-signal | 16 | 16/16 | 16/16 | 3 |
| 11--scoring-calibration | 22 | 22/22 | 22/22 | 3 |

**Highest-gap areas (01-11):**
- **01 Retrieval:** query-intelligence stack (query-router, classifier, decomposer, expander, HyDE, surrogates), UX/confidence layers (progressive-disclosure, result-explainability, confidence-scoring/truncation), session recovery
- **02 Mutation:** shared-memory governance, post-mutation hooks/feedback, save-time extraction/redaction
- **07/09 Evaluation:** shadow/holdout evaluation, K-value analysis, ground-truth feedback, edge-density
- **08 Bug Fixes:** redaction gate, preflight/save-quality safety, schema/lineage integrity, mutex/transaction recovery

### Categories 12-21 (Agent 4): 42 gaps

| Category | Snippets | Valid Paths | Accurate | Gaps |
|----------|----------|-------------|----------|------|
| 12--query-intelligence | 11 | 11/11 | 11/11 | 2 |
| 13--memory-quality | 24 | 24/24 | 24/24 | 3 |
| 14--pipeline-arch | 22 | 22/22 | 22/22 | 3 |
| 15--retrieval-enhancements | 9 | 9/9 | 9/9 | 3 |
| 16--tooling-scripts | 18 | 18/18 | 18/18 | 4 |
| 17--governance | 4 | 2/4 | 2/4 | 4 |
| 18--ux-hooks | 19 | 19/19 | 19/19 | 2 |
| 19--feature-flag-ref | 8 | 8/8 | 5/8 | 11 |
| 20--remediation | 1 | 1/1 | 0/1 | 6 |
| 21--deprecated-features | 1 | 1/1 | 0/1 | 4 |

**Highest-gap areas (12-21):**
- **19 Feature Flags (11 gaps):** 11 undocumented `SPECKIT_*` env knobs including `SPECKIT_CALIBRATION_PROFILE_NAME`, `SPECKIT_GRAPH_LOCAL_THRESHOLD`, `SPECKIT_HYDE_LOG`, `SPECKIT_LEARNED_STAGE2_MODEL`, `SPECKIT_MEMORY_ADAPTIVE_MODE`, `SPECKIT_RECENCY_DECAY_DAYS`, `SPECKIT_RERANKER_TIMEOUT_MS`, `SPECKIT_RESULT_EXPLAIN_DEBUG`, `SPECKIT_SHADOW_LEARNING`, `SPECKIT_SHARED_MEMORY_ADMIN_USER_ID`, `SPECKIT_SHARED_MEMORY_ADMIN_AGENT_ID`
- **17 Governance (4 gaps):** 2 invalid source paths, under-sourced governance backing, missing admin-identity governance
- **20-21 Stubs (10 gaps combined):** 0/1 accurate descriptions; incomplete against live code
- **16 Tooling (4 gaps):** spec lifecycle scripts (create.sh, validate.sh, check-completion.sh, archive.sh, recommend-level.sh), template compose, memory tooling, core scripts

---

## 3. SKILL.md DOCUMENTATION vs CATALOG (Agent 2)

**14 out of 43 grouped capabilities are unmapped:**

| Feature | Source | Severity |
|---------|--------|----------|
| Spec-folder activation triggers and exemptions | SKILL.md | MEDIUM |
| @speckit exclusivity and utility-template trigger rules | SKILL.md | LOW |
| Smart routing/resource-domain loader | SKILL.md | LOW |
| Gate 3 A/B/C/D/E spec-folder workflow | SKILL.md | MEDIUM |
| Complexity detection and level recommendation | SKILL.md | MEDIUM |
| Documentation levels and CORE+ADDENDUM template composition | SKILL.md + README | MEDIUM |
| Checklist verification/evidence protocol | SKILL.md | MEDIUM |
| Folder naming and sub-folder versioning | SKILL.md | LOW |
| Phase-decomposition spec-folder workflow | README | MEDIUM |
| `/spec_kit:*` command suite and mode suffixes | README | MEDIUM |
| Special template suite and pre-merged level templates | README | LOW |
| Broader spec-folder lifecycle script suite | README | MEDIUM |
| Architecture test-placement rule | ARCHITECTURE.md | LOW |
| Shared-memory conflict resolution and `shared_space_conflicts` | SHARED_MEMORY_DATABASE.md | **HIGH** |

**Largest gap cluster:** Spec-folder/documentation workflow surface (not cataloged as features).
**Highest-severity runtime gap:** Shared-memory conflict handling.

---

## 4. CODE AUDIT COVERAGE (Agent 5)

**217/222 snippets covered.** 5 unaudited:

| # | Feature | Category | Catalog Path |
|---|---------|----------|-------------|
| 1 | Session recovery (`memory_continue`) | Retrieval | `01/11` |
| 2 | Template compliance contract enforcement | Tooling | `16/18` |
| 3 | Audit phase 020 mapping note | Feature Flags | `19/08` |
| 4 | Category stub | Remediation | `20/01` |
| 5 | Category stub | Deprecated Features | `21/01` |

**Stale metadata:** Umbrella spec says 218 features; actual count is 222. Phases 019/021/022 are mapping/meta packets, not feature packets.

---

## 5. CROSS-SYSTEM GAP MATRIX (Agent 6 - XHIGH)

### BOTH_MISSING (not in catalog AND not in audit) -- 13 items

| Capability | Source Location |
|------------|----------------|
| Programmatic indexing API | `mcp_server/api/indexing.ts` |
| Programmatic search API | `mcp_server/api/search.ts` |
| Programmatic provider API | `mcp_server/api/providers.ts` |
| Programmatic storage API | `mcp_server/api/storage.ts` |
| Aggregated public API barrel | `mcp_server/api/index.ts` |
| API documentation surface | `mcp_server/api/README.md` |
| Completion-verification shell workflow | `scripts/spec/check-completion.sh` |
| Ops healing/runbook workflow | `scripts/ops/runbook.sh` |
| Eval runner CLI | `scripts/evals/run-ablation.ts` |
| Runtime config contract | `config/config.jsonc` |
| Filter config contract | `config/filters.jsonc` |
| Constitutional gate-enforcement rule pack | `constitutional/gate-enforcement.md` |
| Phase-system knowledge node | `nodes/phase-system.md` |

### AUDIT_MISSING (in catalog but not audited) -- 2 items

| Capability | Source Location |
|------------|----------------|
| Spec creation shell workflow | `scripts/spec/create.sh` |
| Spec validation shell workflow | `scripts/spec/validate.sh` |

### Key Insight
> "Tool surface is no longer the problem. Parallel non-MCP surfaces are the main blind spot."

---

## 6. NEWER/ADVANCED FEATURES (Agent 7 - XHIGH)

### Critical Gaps

1. **`SPECKIT_MEMORY_ADAPTIVE_MODE`** -- live in code and tests, missing from feature-flag reference
2. **`SPECKIT_ADAPTIVE_FUSION`** -- runtime/docs drift: still implemented but sunset audit says graduated/retired
3. **Constitutional-core behavior fragmented** -- no single catalog entry for always-surface injection + `includeConstitutional` + cache TTL + token budgets
4. **Shared-memory source discovery misleading** -- `mcp_server/shared/` empty, `mcp_server/shared-spaces/` README-only; real code in handler/lib files
5. **Scripts ecosystem under-cataloged** -- 178 first-party files vs 18 docs in `16--tooling-and-scripts`; gaps for `ops/`, `setup/`, `kpi/`, registry helpers, maintenance CLIs

### Uncataloged Script Subsystems

| Script Area | Purpose | In Catalog |
|-------------|---------|------------|
| `ops/*.sh` | Self-healing / runbook drills | NO |
| `setup/*.sh`, `install.sh` | Environment readiness | NO |
| `kpi/quality-kpi.sh` | Quality KPI scan | NO |
| `registry-loader.sh`, `scripts-registry.json` | Script registry metadata | NO |

---

## 7. PRIORITIZED REMEDIATION RECOMMENDATIONS

### P0 -- CRITICAL (must address)

1. **Add 13 BOTH_MISSING capabilities** to feature catalog (especially `mcp_server/api/` public surface)
2. **Document 11 undocumented `SPECKIT_*` env knobs** in `19--feature-flag-reference`
3. **Resolve `SPECKIT_ADAPTIVE_FUSION` drift** -- either re-add to flag reference or remove runtime code
4. **Add `SPECKIT_MEMORY_ADAPTIVE_MODE`** to feature-flag reference
5. **Create constitutional-core unified catalog entry** covering injection, cache, budgets, invalidation
6. **Fix 2 invalid source paths** in `17--governance` snippets
7. **Mark `read_spec_section` as planned/deferred** or remove from catalog

### P1 -- REQUIRED

8. **Audit 5 unaudited catalog snippets** (session recovery, template compliance, 3 stubs)
9. **Expand `16--tooling-and-scripts`** with spec lifecycle scripts, memory tooling, core scripts
10. **Create individual catalog entries** for shared-memory tools (currently grouped in one doc)
11. **Update umbrella spec feature count** from 218 to 222
12. **Flesh out stubs in categories 20 and 21** -- currently 0/1 accurate descriptions
13. **Formally audit `create.sh` and `validate.sh`** (AUDIT_MISSING)

### P2 -- RECOMMENDED

14. **Add catalog entries for `ops/`, `setup/`, `kpi/` script subsystems**
15. **Document shared-memory source discovery** (point audits to correct handler/lib files)
16. **Reclassify phases 019/021/022** as mapping/meta packets vs feature packets
17. **Add shared-memory conflict resolution** catalog entry (documented in SHARED_MEMORY_DATABASE.md but not cataloged)
18. **Address description accuracy issues** in categories 17 (2/4), 19 (5/8), 20 (0/1), 21 (0/1)

---

## AGENT EXECUTION LOG

| Agent | Model | Effort | Tokens | Focus |
|-------|-------|--------|--------|-------|
| 1 | GPT-5.4 | high | ~100k | MCP tool enumeration + catalog mapping |
| 2 | GPT-5.4 | high | ~100k | SKILL.md features vs catalog |
| 3 | GPT-5.4 | high | ~181k | Feature catalog 01-11 completeness |
| 4 | GPT-5.4 | high | ~505k | Feature catalog 12-21 completeness |
| 5 | GPT-5.4 | high | ~101k | Code audit coverage verification |
| 6 | GPT-5.4 | xhigh | ~200k | Cross-system gap analysis |
| 7 | GPT-5.4 | xhigh | ~300k | Newer features deep scan |
