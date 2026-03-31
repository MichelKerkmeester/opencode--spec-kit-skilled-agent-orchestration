---
title: "Tasks: Feature Catalog Audit & Remediation [02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/tasks]"
description: "title: \"Tasks: Feature Catalog Audit & Remediation\""
trigger_phrases:
  - "tasks"
  - "feature"
  - "catalog"
  - "audit"
  - "remediation"
  - "006"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Feature Catalog Audit & Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
<!-- phase-alias: Phase 1: Setup = Phase A: Spec Folder Upgrade -->
## Phase 1: Setup

### Phase A: Spec Folder Upgrade (L1 → L3)

- [x] T001 Run upgrade-level.sh --to 3
- [x] T002 Update description.json level to 3
- [x] T003 Rewrite spec.md for L3 audit scope (spec.md)
- [x] T004 Create plan.md with technical approach (plan.md)
- [x] T005 Rewrite tasks.md with new breakdown (tasks.md)
- [x] T006 Create decision-record.md with 3 ADRs (decision-record.md)
- [x] T007 Create checklist.md with audit checks (checklist.md)

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
<!-- phase-alias: Phase 2: Implementation = Phase B-G: Research, Analysis, Remediation -->
## Phase 2: Implementation

### Phase B: Research Delegation (30 Agents) — COMPLETE

> **Historical snapshot boundary (2026-03-08):** Phase B reflects the executed 180-feature audit baseline, not the later 189-snippet live tree.

### Stream 1: Feature Verification (20 Codex Agents, GPT-5.4)

- [x] T010 [P] C01: Verify 01-retrieval — 9 files (scratch/verification-C01.md)
- [x] T011 [P] C02: Verify 02-mutation — 10 files (scratch/verification-C02.md)
- [x] T012 [P] C03: Verify 03-discovery + 04-maint + 05-lifecycle — 12 files (scratch/verification-C03.md)
- [x] T013 [P] C04: Verify 06-analysis + 07-evaluation — 9 files (scratch/verification-C04.md)
- [x] T014 [P] C05: Verify 08-bug-fixes (1-6) — 6 files (scratch/verification-C05.md)
- [x] T015 [P] C06: Verify 08-bug-fixes (7-11) — 5 files (scratch/verification-C06.md)
- [x] T016 [P] C07: Verify 09-eval-measurement (1-8) — 8 files (scratch/verification-C07.md)
- [x] T017 [P] C08: Verify 09-eval-measurement (9-14) — 6 files (scratch/verification-C08.md)
- [x] T018 [P] C09: Verify 10-graph-signal (1-5) — 5 files (scratch/verification-C09.md)
- [x] T019 [P] C10: Verify 10-graph-signal (6-11) + 11-scoring (1-4) — 10 files (scratch/verification-C10.md)
- [x] T020 [P] C11: Verify 11-scoring (5-10) — 6 files (scratch/verification-C11.md)
- [x] T021 [P] C12: Verify 11-scoring (11-17) — 7 files (scratch/verification-C12.md)
- [x] T022 [P] C13: Verify 12-query-intelligence — 6 files (scratch/verification-C13.md)
- [x] T023 [P] C14: Verify 13-memory-quality (1-9) — 9 files (scratch/verification-C14.md)
- [x] T024 [P] C15: Verify 13-memory-quality (10-16) — 7 files (scratch/verification-C15.md)
- [x] T025 [P] C16: Verify 14-pipeline (1-12) — 12 files (scratch/verification-C16.md)
- [x] T026 [P] C17: Verify 14-pipeline (13-21) — 9 files (scratch/verification-C17.md)
- [x] T027 [P] C18: Verify 15-retrieval-enhancements — 9 files (scratch/verification-C18.md)
- [x] T028 [P] C19: Verify 16-tooling + 17-governance — 10 files (scratch/verification-C19.md)
- [x] T029 [P] C20: Verify 18-ux-hooks + 19-decisions + 20-flags — 25 files (scratch/verification-C20.md)

### Stream 2: Gap Investigation (10 Codex Agents, GPT-5.3-Codex)

- [x] T030 [P] X01: Gaps #1-4 — Server & Ops — 4 confirmed, 3 new (scratch/investigation-X01.md)
- [x] T031 [P] X02: Gaps #5-9 — Save Path — 5 confirmed (scratch/investigation-X02.md)
- [x] T032 [P] X03: Gaps #10-13 — Discovery — 4 confirmed, 3 new (scratch/investigation-X03.md)
- [x] T033 [P] X04: Gaps #14-17 — Search — 2 confirmed, 2 false pos, 2 new (scratch/investigation-X04.md)
- [x] T034 [P] X05: Gaps #18-23 — Cognitive — 4 confirmed, 2 false pos, 3 new (scratch/investigation-X05.md)
- [x] T035 [P] X06: Gaps #24-31 — Scoring — 8 confirmed, 4 new (scratch/investigation-X06.md)
- [x] T036 [P] X07: Gaps #32-37 — Infra — 3 confirmed, 3 false pos, 3 new (scratch/investigation-X07.md)
- [x] T037 [P] X08: Gaps #38-42 — Storage — 5 confirmed, 5 new (scratch/investigation-X08.md)
- [x] T038 [P] X09: Gaps #43-48 — Search internals — 6 confirmed, 3 new (scratch/investigation-X09.md)
- [x] T039 [P] X10: Gaps #49-55 — Handlers — 7 confirmed, 3 new (scratch/investigation-X10.md)

---

**Phase C: Analysis & Synthesis — COMPLETE**

- [x] T040 Parse all 30 scratch files and extract structured findings
- [x] T041 Create remediation-manifest.md (scratch/remediation-manifest.md)
- [x] T042 Cross-validate Stream 1 and Stream 2 findings (7 false positives identified)
- [x] T043 Create analysis-summary.md (scratch/analysis-summary.md)

**Key findings:**
- 180 historical-snapshot features verified, 7 pass (3.9%), 173 need remediation
- 48/55 original gaps confirmed, 7 false positives, 29 new gaps discovered
- 3 invalid file paths affecting 55 snippet files (batch-fixable)
- 18 features need complete rewrite
- 49.4% description accuracy (below 95% target)

---

**Phase D: Documentation Update — COMPLETE**

- [x] T050 Update tasks.md with concrete remediation items (this file)
- [x] T051 Update checklist.md with verification results
- [x] T052 Update plan.md with Phase C findings

---

**Phase E: Current-State Addendum (2026-03-16) — COMPLETE**

- [x] T172 Reconcile snapshot vs live-tree counts (180 historical vs 189 current)
- [x] T173 Audit 14 omitted current snippets and classify remediation status
- [x] T174 Mark 12/14 omitted snippets as structurally current, no immediate remediation
- [x] T175 Add source-path normalization follow-up for `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md`
- [x] T176 Add source-path correction/removal follow-up for invalid command/memory/context.md reference in `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/13-constitutional-memory-manager-command.md`
- [x] T177 Clarify tooling narrative drift (plan said Copilot; execution artifacts are Codex)
- [x] T178 Clarify taxonomy drift (`19-decisions`/`20-flags` historical labels vs current monolith sections 20/21/22)

---

**Phase G: Normalization & Phase 016/017 Coverage (2026-03-21) — COMPLETE**

- [x] T180 Remove all `NEW-NNN` markers from individual feature catalog files (194 files across 19 categories)
- [x] T181 Remove all `NEW-NNN` markers from individual playbook files (200 files across 19 categories)
- [x] T182 Clean feature\_catalog.md index: remove `[NEW-NNN]` playbook references, add 016/017 entries
- [x] T183 Clean manual\_testing\_playbook.md index: remove ~458 `NEW-` prefixes, rename section header, add 153/154 entries + cross-reference table rows
- [x] T184 Create `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md` (phase 016 coverage)
- [x] T185 Create `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md` (phase 017 coverage)
- [x] T186 Create `.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md` (phase 016 test scenarios)
- [x] T187 Create `.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/154-json-primary-deprecation-posture.md` (phase 017 test scenarios)
- [x] T188 Verification: E1 — catalog file-to-index consistency (194 files, 0 NEW- markers)
- [x] T189 Verification: E2 — playbook file-to-index consistency (200 files, 0 NEW- markers)
- [x] T190 Verification: E3 — spot-check targeted files for marker remnants (all clean)

**Phase H: Deep Research Remediation (2026-03-26) — NEW**

> Source: 12-agent deep research (7 round 1 + 5 round 2, ~3.3M tokens GPT-5.4 via Codex CLI).
> Full findings: `research/deep-research-gap-report-2026-03-26.md`, `research/deep-research-round2-2026-03-26.md`.

### H1: P0 Critical — BOTH_MISSING Capabilities (13 items)

- [x] T200 Create catalog entry: MCP Server Public API Barrel — `.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/22-mcp-server-public-api-barrel.md` (6.9KB, 16 source files)
- [x] T201 Create catalog entry: Evaluation API Surface — `.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/15-evaluation-api-surface.md` (3.6KB)
- [x] T202 Create catalog entry: Indexing Runtime Bootstrap API — `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/25-indexing-runtime-bootstrap-api.md` (4.8KB)
- [x] T203 Create catalog entry: Search API Surface — `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/12-search-api-surface.md` (4.4KB)
- [x] T204 Create catalog entry: Embeddings and Retry API — `.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/23-embeddings-and-retry-api.md` (5.0KB)
- [x] T205 Create catalog entry: Completion-verification workflow — `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/19-completion-verification-workflow.md` (3.6KB)
- [x] T206 Create catalog entry: Ops self-healing runbooks — `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/20-ops-self-healing-runbooks.md` (5.6KB)
- [x] T207 Create catalog entry: Eval runner CLI — `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/21-eval-runner-cli.md` (3.9KB)
- [x] T208 Create catalog entry: Runtime config contract — `.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/09-runtime-config-contract.md` (4.6KB)
- [x] T209 Create catalog entry: Filter config contract — `.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/10-filter-config-contract.md` (4.3KB)
- [x] T210 Create catalog entry: Constitutional gate-enforcement rule pack — `.opencode/skill/system-spec-kit/feature_catalog/17--governance/05-constitutional-gate-enforcement-rule-pack.md` (3.8KB)
- [x] T211 Create catalog entry: Phase-system knowledge node — `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/22-phase-system-knowledge-node.md` (4.3KB)
- [x] T212 Note `api/storage.ts` as DEAD_CODE — documented in `.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/22-mcp-server-public-api-barrel.md` SOURCE FILES table

### H2: P0 Critical — Undocumented Feature Flags (28 flags)

- [x] T213 Add 5 HIGH-severity SPECKIT_* flags to cat 19/01 — `SPECKIT_ADAPTIVE_FUSION` (with drift note), `SPECKIT_SHARED_MEMORY_ADMIN_USER_ID`, `SPECKIT_SHARED_MEMORY_ADMIN_AGENT_ID`, `SPECKIT_SKIP_VALIDATION`, `SPECKIT_VALIDATION` added
- [x] T214 Add 18 MEDIUM-severity SPECKIT_* flags to cat 19/01-06 — graph calibration, adaptive mode, search params, script control rows added
- [x] T215 Add 5 LOW-severity SPECKIT_* flags — `HYDE_LOG`, `RESULT_EXPLAIN_DEBUG` added to 19/06; `JSON`, `VALIDATE_LINKS`, `VERBOSE` documented
- [x] T216 Remove stale `SPECKIT_RSF_FUSION` from cat 19/01 — removed, replaced with `SPECKIT_ADAPTIVE_FUSION` drift note

### H3: P0 Critical — Unified Subsystem Entries

- [x] T217 Create unified catalog entry: Constitutional memory end-to-end lifecycle — `.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/08-constitutional-memory-end-to-end-lifecycle.md` (10.2KB, 10 source files)
- [x] T218 Create unified catalog entry: Shared memory end-to-end architecture — `.opencode/skill/system-spec-kit/feature_catalog/02--mutation/11-shared-memory-end-to-end-architecture.md` (9.8KB, 9 source files)

### H4: P0 Critical — Fixes and Drift

- [x] T219 Fix ARCHITECTURE.md:291 — removed nonexistent `searchMemories` reference
- [x] T220 Fix ARCHITECTURE.md:326 — removed nonexistent `api/scoring` reference
- [x] T221 Mark `read_spec_section` phantom tool as PLANNED/DEFERRED in `01/07` and `.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md`

### H5: P1 Required — Category Snippet Fixes

- [x] T222 Fix cat 17/01 — added `rollout-policy.ts`, `capability-flags.ts` source paths
- [x] T223 Rewrite cat 17/02 — rewritten with live source citations (sunset audit)
- [x] T224 Fix cat 17/03 — replaced deleted `retention.ts` with `scope-governance.ts` + 5 correct paths
- [x] T225 Fix cat 19/01 — added `SPECKIT_MEMORY_ADAPTIVE_MODE` row + `SPECKIT_ADAPTIVE_FUSION` drift note
- [x] T226 Fix cat 19/05 — added `SPECKIT_RERANKER_MODEL` + `SPECKIT_RERANKER_TIMEOUT_MS` rows
- [x] T227 Fix cat 19/06 — added `SPECKIT_RESULT_EXPLAIN_DEBUG` + `SPECKIT_HYDE_LOG` rows

### H6: P1 Required — Replace Stubs

- [x] T228 Replace cat 20/01 stub — replaced with real remediation content (7.7KB, 7 source files)
- [x] T229 Create cat 20/02 — `.opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/02-memory-health-auto-repair.md` (4.0KB)
- [x] T230 Create cat 20/03 — `.opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/03-feedback-driven-revalidation.md` (5.4KB)
- [x] T231 Replace cat 21/01 stub — replaced with retired runtime shims content (4.3KB, 5 source files)
- [x] T232 Create cat 21/02 — `.opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/02-lazy-loading-migration-and-warmup-compatibility.md` (2.9KB)
- [x] T233 Create cat 21/03 — `.opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/03-shadow-scoring-retirement.md` (2.6KB)
- [x] T234 Create cat 21/05 — `.opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/05-adaptive-fusion-flag-drift.md` (2.7KB)

### H7: P1 Required — Scripts Ecosystem (12 new entries)

- [x] T235 Create cat 16 entry: Spec Lifecycle Automation — `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/23-spec-lifecycle-automation.md` (6.4KB)
- [x] T236 Create cat 16 entry: Spec Validation Rule Engine — `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/24-spec-validation-rule-engine.md` (7.8KB)
- [x] T237 Create cat 16 entry: Memory Maintenance and Migration CLIs — `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/25-memory-maintenance-and-migration-clis.md` (6.0KB)
- [x] T238 Create cat 16 entry: Core Workflow Infrastructure — `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/26-core-workflow-infrastructure.md` (6.9KB)
- [x] T239 Create cat 16 entry: Session Extraction and Enrichment — `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/27-session-extraction-and-enrichment.md` (5.7KB)
- [x] T240 Create cat 16 entry: Spec-Folder Detection and Description — `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/28-spec-folder-detection-and-description.md` (6.8KB)
- [x] T241 Create cat 16 entry: Ops Self-Healing Runbooks — `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/29-setup-native-module-health-and-mcp-installation.md` (5.7KB)
- [x] T242 Create cat 16 entry: Setup, Native Module Health, MCP Installation — `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/29-setup-native-module-health-and-mcp-installation.md` (5.7KB)
- [x] T243 Create cat 16 entry: Template Composition System — `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/30-template-composition-system.md` (5.9KB)
- [x] T244 Create cat 16 entry: Evaluation, Benchmark, Import-Policy Tooling — `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/31-evaluation-benchmark-and-import-policy-tooling.md` (5.9KB)
- [x] T245 Create cat 16 entry: Shared Script Libraries and Utilities — `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/32-shared-script-libraries-and-utilities.md` (10.9KB)
- [x] T246 Create cat 16 entry: Memory Quality KPI Reporting — `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/33-memory-quality-kpi-reporting.md` (4.1KB)

### H8: P1 Required — Misc

- [x] T247 Create cat 17/05 — `.opencode/skill/system-spec-kit/feature_catalog/17--governance/06-shared-memory-admin-identity-governance.md` (5.1KB)
- [x] T248 Create cat 17/06 — `.opencode/skill/system-spec-kit/feature_catalog/17--governance/07-governance-audit-review-and-rollout-metrics.md` (4.6KB)
- [x] T249 Add cross-link to cat 17/04 for admin-identity governance — added
- [x] T250 Update shared-spaces README with implementation pointer note — added
- [x] T251 Reclassify cat 19/08 as meta note — reclassified, excluded from feature-accuracy scoring
- [x] T252 Create cat 21/04 — `.opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/04-inert-scoring-flags-and-compatibility-shims.md` (3.8KB)
- [x] T253 Update umbrella spec feature count 218 → 222 — updated in spec.md, plan.md, checklist.md
- [x] T254 Investigate constitutional cache invalidation mismatch — documented in `scratch/constitutional-cache-investigation.md` (2.6KB)
- [x] T255 Document config.jsonc/filters.jsonc toggles — covered by T208 (.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/09-runtime-config-contract.md) and T209 (.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/10-filter-config-contract.md)

### H9: Playbook Scenario Coverage (16 new scenarios)

> Playbook counterparts for Phase H catalog entries that lacked test scenarios. Created via 4 parallel GPT-5.4 agents.

- [x] T256 Create playbook 217 — `.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/15-evaluation-api-surface.md` (4.3KB)
- [x] T257 Create playbook 218 — `.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/22-mcp-server-public-api-barrel.md` (4.4KB)
- [x] T258 Create playbook 219 — `.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/23-embeddings-and-retry-api.md` (5.3KB)
- [x] T259 Create playbook 220 — `.opencode/skill/system-spec-kit/feature_catalog/17--governance/05-constitutional-gate-enforcement-rule-pack.md` (5.1KB)
- [x] T260 Create playbook 221 — `.opencode/skill/system-spec-kit/feature_catalog/17--governance/06-shared-memory-admin-identity-governance.md` (4.8KB)
- [x] T261 Create playbook 222 — `.opencode/skill/system-spec-kit/feature_catalog/17--governance/07-governance-audit-review-and-rollout-metrics.md` (5.1KB)
- [x] T262 Create playbook 223 — `.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/09-runtime-config-contract.md` (5.0KB)
- [x] T263 Create playbook 224 — `.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/10-filter-config-contract.md` (4.7KB)
- [x] T264 Create playbook 225 — `.opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/01-category-stub.md` (4.8KB)
- [x] T265 Create playbook 226 — `.opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/02-memory-health-auto-repair.md` (4.5KB)
- [x] T266 Create playbook 227 — `.opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/03-feedback-driven-revalidation.md` (4.8KB)
- [x] T267 Create playbook 228 — `.opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/01-category-stub.md` (4.4KB)
- [x] T268 Create playbook 229 — `.opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/02-lazy-loading-migration-and-warmup-compatibility.md` (3.9KB)
- [x] T269 Create playbook 230 — `.opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/03-shadow-scoring-retirement.md` (3.8KB)
- [x] T270 Create playbook 231 — `.opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/04-inert-scoring-flags-and-compatibility-shims.md` (4.1KB)
- [x] T271 Create playbook 232 — `.opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/05-adaptive-fusion-flag-drift.md` (3.9KB)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
<!-- phase-alias: Phase 3: Verification = Phase F: Remediation Execution -->
## Phase 3: Verification

### Phase F: Remediation Execution (FUTURE — from manifest)

### E1: Batch Fixes (P0 — Scriptable)
- [x] T100 Global replace `retry.vitest.ts` → `retry-manager.vitest.ts` (52 snippets)
- [ ] T101 Remove `slug-utils.ts` reference (2 snippets: 13-memory-quality/04, 11)
- [ ] T102 Remove `check-architecture-boundaries.ts` reference (1 snippet: 16-tooling/02)
- [ ] T103 Run `replace-monolith-source-files.mjs` to sync monolith

### E2: Feature Rewrites (P1 — 18 features)
- [ ] T110 [P] Rewrite 02-mutation/07-namespace-management-crud-tools
- [ ] T111 [P] Rewrite 02-mutation/10-per-memory-history-log
- [ ] T112 [P] Rewrite 08-bug-fixes/08-mathmax-min-stack-overflow-elimination
- [ ] T113 [P] Rewrite 09-eval/14-cross-ai-validation-fixes
- [ ] T114 [P] Rewrite 10-graph/08-graph-and-cognitive-memory-fixes
- [ ] T115 [P] Rewrite 11-scoring/07-double-intent-weighting-investigation
- [ ] T116 [P] Rewrite 11-scoring/17-temporal-structural-coherence-scoring
- [ ] T117 [P] Rewrite 12-query/02-relative-score-fusion-in-shadow-mode
- [ ] T118 [P] Rewrite 13-quality/16-dry-run-preflight-for-memory-save
- [ ] T119 [P] Rewrite 14-pipeline/02-mpab-chunk-to-memory-aggregation
- [ ] T120 [P] Rewrite 14-pipeline/08-performance-improvements
- [ ] T121 [P] Rewrite 14-pipeline/10-legacy-v1-pipeline-removal
- [ ] T122 [P] Rewrite 14-pipeline/16-backend-storage-adapter-abstraction
- [ ] T123 [P] Rewrite 14-pipeline/18-atomic-write-then-index-api
- [ ] T124 [P] Rewrite 14-pipeline/21-atomic-pending-file-recovery
- [ ] T125 [P] Rewrite 17-governance/02-feature-flag-sunset-audit
- [ ] T126 [P] Rewrite 20-flags/01-1-search-pipeline-features-speckit
- [ ] T127 [P] Rewrite 20-flags/05-5-embedding-and-api
- [x] T128 [P] Normalize SOURCE FILES path style in `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md` (replace broad globs/external verifier alias with canonical repo-resolved references) [Evidence: broad-glob SOURCE FILES entries and verifier alias path were replaced with canonical repo-resolved references; backticked markdown-path resolution check now returns 0 unresolved references]
- [x] T129 [P] Correct/remove invalid command/memory/context.md SOURCE FILES entry in `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/13-constitutional-memory-manager-command.md` [Evidence: invalid command/memory/context.md entry removed, command/agent doc references normalized to `.opencode/...` paths including CURRENT REALITY text, and backticked markdown-path resolution check now returns 0 unresolved references]

### E3: Description + Path Updates (P1 — 63 features)
- [ ] T130 [P] Update BOTH features across all 20 categories (per manifest)

### E4: Path-Only Updates (P1 — 81 features, post-batch)
- [ ] T140 [P] Verify remaining path issues after P0 batch fix

### E5: Description-Only Updates (P1 — 11 features)
- [ ] T150 [P] Update descriptions for 11 features (per manifest)

### E6: New Feature Entries (P2 — 48 confirmed + 29 new = 77 entries)
- [ ] T160 [P] Create snippet files for 48 confirmed original gaps
- [ ] T161 [P] Create snippet files for 29 newly discovered gaps

### F7: Final Sync
- [ ] T170 Run `replace-monolith-source-files.mjs` to sync monolith
- [ ] T171 Run file path validation: all paths must resolve

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase A tasks `[x]`
- [x] All 30 agent reports exist and are non-empty
- [x] Remediation manifest produced
- [x] Phase E addendum completed for 14 omitted current snippets
- [x] No `[B]` blocked tasks remaining
- [ ] Phase F remediation executed (separate workflow)
- [x] Phase H deep research remediation tasks addressed (T200-T255) — all 56 tasks complete: 13 BOTH_MISSING entries created, 28 flags documented, 2 unified entries, 3 drift fixes, 6 snippet fixes, 7 stub replacements, 12 scripts entries, 9 misc tasks
- [x] Phase H9 playbook scenario coverage (T256-T271) — 16 playbook scenarios created for new catalog entries across categories 09, 14, 17, 19, 20, 21
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Analysis Summary**: See `scratch/analysis-summary.md`
- **Remediation Manifest**: See `scratch/remediation-manifest.md`
<!-- /ANCHOR:cross-refs -->

---

**Merged Section: 016-feature-catalog-code-references Tasks**

> **Merge note (2026-03-14)**: Originally the 016 tasks document in the prior folder layout.

# Tasks: 016-Feature Catalog Code References
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

**Phase A: Cleanup Stale References**

- [x] **T-A1**: Scan all `.ts` source files for sprint number references in comments [Evidence: Non-test source grep for stale refs returned no matches]
- [x] **T-A2**: Scan all `.ts` source files for phase number references in comments [Evidence: Non-test source grep for stale refs returned no matches]
- [x] **T-A3**: Scan all `.ts` source files for spec folder number references in comments [Evidence: Non-test source grep for stale refs returned no matches]
- [x] **T-A4**: Review and categorize each stale reference (remove vs rewrite) [Evidence: Stale project-history references in non-test source comments were removed or reworded]
- [x] **T-A5**: Remove or rewrite all stale references [Evidence: Stale project-history references in non-test source comments were removed or reworded]
- [x] **T-A6**: Verify zero stale references remain [Evidence: Non-test source grep for stale refs returned no matches]

**Phase B: Add Feature Catalog References**

- [x] **T-B1**: Build file-to-feature catalog mapping from SOURCE FILES tables [Evidence: Mapping used for handler-wide and strong-match module annotations]
- [x] **T-B2**: Annotate handler files with `// Feature catalog: <name>` comments [Evidence: 40 handler `.ts` files and 40 handler files containing a `// Feature catalog:` comment]
- [x] **T-B3**: Annotate core lib modules with feature catalog references [Evidence: Additional mapped files in `mcp_server` received feature catalog comments where mapping was strong]
- [x] **T-B4**: Annotate shared algorithm modules with feature catalog references [Evidence: Additional mapped files in `shared` received feature catalog comments where mapping was strong]
- [x] **T-B5**: Annotate script modules with feature catalog references [Evidence: `mcp_server/scripts` coverage check passed (3 TypeScript scripts, all 3 annotated with `// Feature catalog:`)]
- [x] **T-B6**: Verify all references use name-only format (no numbers) [Evidence: Exact-name validation against feature catalog H1 headings passed with zero invalid names]
- [x] **T-B7**: TypeScript compile check (`tsc --noEmit`) [Evidence: `npm run typecheck` in `.opencode/skill/system-spec-kit` exited 0]

**Verification**

- [x] **T-V1**: Grep confirms zero sprint/phase/spec-number references in comments [Evidence: Non-test source grep for stale refs returned no matches]
- [x] **T-V2**: Grep confirms all `Feature catalog:` references use name-only format [Evidence: Exact-name validation against feature catalog H1 headings passed with zero invalid names]
- [x] **T-V3**: No runtime behavior changes (comment-only diff) [Evidence: Comment-only diff audit for `mcp_server` + `shared` returned `{"comment_only": true}`]

**Phase C: CHK-012 Resolution, MODULE: Alignment, and Documentation**

- [x] **T-C1**: Transform `// 1. NAME` headers to `// MODULE: Name` in all 228 non-test mcp_server .ts files [Evidence: Python batch transform applied; verify_alignment_drift.py returns 0 TS-MODULE-HEADER findings]
- [x] **T-C2**: Add `// MODULE: Name` headers to 82 scripts/ .ts files [Evidence: Headers added; verify_alignment_drift.py PASS]
- [x] **T-C3**: Add `// MODULE: Name` headers to 2 headerless files (session-transition.ts, ranking-contract.ts) [Evidence: Headers added manually]
- [x] **T-C4**: Add missing `// Feature catalog:` annotations to 91 unannotated files across lib/cognitive, lib/search, lib/eval, lib/telemetry, lib/storage, lib/scoring, lib/graph, shared/ [Evidence: Cross-validation: 124 unique annotations, 0 invalid names]
- [x] **T-C5**: Create feature catalog snippet `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md` [Evidence: File created with OVERVIEW, CURRENT REALITY, SOURCE FILES, METADATA, PLAYBOOK sections]
- [x] **T-C6**: Add H3 entry in main `.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md` under Tooling section [Evidence: Entry added with Description, Current Reality, Source Files]
- [x] **T-C7**: Add manual testing playbook scenarios NEW-135..NEW-138 [Evidence: 4 scenarios added with grep traceability, name validity, multi-feature coverage, MODULE: compliance]
- [x] **T-C8**: Update playbook TOC range to NEW-001..NEW-138 and add coverage mappings [Evidence: TOC and section heading updated, 4 coverage mapping rows added]
- [x] **T-C9**: Add Code Conventions section to mcp_server/README.md [Evidence: MODULE: header and Feature catalog annotation conventions documented]
- [x] **T-C10**: Add traceability mention to system-spec-kit/README.md [Evidence: Brief mention added in MCP Server component description]
- [x] **T-C11**: Mark CHK-012 as complete in checklist.md [Evidence: CHK-012 marked [x] with 91 annotations and 0 invalid names evidence]
- [x] **T-C12**: TypeScript compile check (`tsc --noEmit`) [Evidence: `npx tsc --noEmit` in system-spec-kit exited 0]
