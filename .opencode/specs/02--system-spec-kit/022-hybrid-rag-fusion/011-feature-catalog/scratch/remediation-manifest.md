# Feature Catalog Remediation Manifest

> **Date:** 2026-03-08 historical baseline + 2026-03-16 current-state addendum
> **Source:** 30-agent audit (20 verification + 10 gap investigation) + omitted-snippet addendum audit (14 current snippets)
> **Historical remediation base (2026-03-08):** 202 (173 existing features + 29 new features)
> **Addendum follow-up items (2026-03-16):** 2
> **Current combined actionable total:** 204

---

## Priority Legend

| Priority | Action Category | Trigger |
|----------|----------------|---------|
| **P0** | PATH-VALIDATE | File path doesn't exist on disk |
| **P1** | DESC-UPDATE | Description inaccurate or incomplete |
| **P1** | PATH-ADD | Missing source file paths |
| **P1** | PATH-REMOVE | Invalid/incorrect paths |
| **P1** | PATH-NORMALIZE | Non-canonical source references that require normalization |
| **P1** | REWRITE | Feature needs complete rewrite |
| **P1** | NEW-FEATURE (high-sig) | New feature entry needed |
| **P2** | NEW-FEATURE (med/low) | New feature entry needed |
| **P2** | CATEGORY-MOVE | Feature in wrong category |

---

## 2026-03-16 Addendum: Omitted Current Snippets (14)

These 14 snippets were outside executed March 8 verification ranges and therefore were not part of the 180-feature historical coverage claim. Addendum classification:

### No Immediate Remediation (12)

- `09--evaluation-and-measurement/15-memory-roadmap-baseline-snapshot.md`
- `09--evaluation-and-measurement/16-int8-quantization-evaluation.md`
- `10--graph-signal-activation/12-unified-graph-retrieval-deterministic-ranking-explainability-and-rollback.md`
- `11--scoring-and-calibration/18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md`
- `13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md`
- `13--memory-quality-and-indexing/18-stateless-enrichment-and-alignment-guards.md`
- `14--pipeline-architecture/22-lineage-state-active-projection-and-asof-resolution.md`
- `16--tooling-and-scripts/09-migration-checkpoint-scripts.md`
- `16--tooling-and-scripts/10-schema-compatibility-validation.md`
- `16--tooling-and-scripts/12-session-capturing-pipeline-quality.md`
- `17--governance/03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md`
- `17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md`

### Addendum Follow-up Required (2)

#### AD-001: `16--tooling-and-scripts/11-feature-catalog-code-references.md` — PATH-NORMALIZE (P1)
- **Issue:** `## SOURCE FILES` uses broad glob entries (`mcp_server/**/*.ts`, `shared/**/*.ts`, `scripts/**/*.ts`) and an external verifier alias path (`sk-code--opencode/scripts/verify_alignment_drift.py`) instead of canonical repo-resolved references.
- **Fix:** Normalize source references to canonical, resolvable repo-relative paths and explicit verification references.

#### AD-002: `16--tooling-and-scripts/13-constitutional-memory-manager-command.md` — PATH-REMOVE/PATH-CORRECT (P1)
- **Issue:** Lists `command/memory/context.md`, which is not present at `.opencode/command/memory/context.md`.
- **Fix:** Remove or replace with the valid command documentation path(s).

---

## P0: PATH-VALIDATE (Batch-Fixable)

These are invalid file paths that must be corrected across all affected snippets.

### PV-001: `mcp_server/tests/retry.vitest.ts` → `mcp_server/tests/retry-manager.vitest.ts`
- **Affected snippets:** 52 files across categories 01-07, 11-15, 18
- **Fix:** Global find-and-replace in all snippet files
- **Effort:** Scriptable (1 command)

### PV-002: `mcp_server/lib/parsing/slug-utils.ts` → REMOVE
- **Affected snippets:** 13-memory-quality/04, 13-memory-quality/11
- **Fix:** Remove from Source Files tables
- **Effort:** 2 file edits

### PV-003: `mcp_server/lib/architecture/check-architecture-boundaries.ts` → REMOVE
- **Affected snippets:** 16-tooling/02
- **Fix:** Remove from Source Files table
- **Effort:** 1 file edit

---

## P1: REWRITE (18 Features)

Features requiring complete description rewrite due to material inaccuracy.

| # | Category | Feature | Agent | Key Issue |
|---|----------|---------|-------|-----------|
| 1 | 02-mutation | 07-namespace-management-crud-tools | C02 | Description doesn't match code |
| 2 | 02-mutation | 10-per-memory-history-log | C02 | Description outdated |
| 3 | 08-bug-fixes | 08-mathmax-min-stack-overflow-elimination | C06 | Count/scope claims wrong |
| 4 | 09-eval | 14-cross-ai-validation-fixes | C08 | Entirely stale |
| 5 | 10-graph | 08-graph-and-cognitive-memory-fixes | C10 | Description misaligned |
| 6 | 11-scoring | 07-double-intent-weighting-investigation | C11 | Investigation resolved differently |
| 7 | 11-scoring | 17-temporal-structural-coherence-scoring | C12 | Implementation changed |
| 8 | 12-query | 02-relative-score-fusion-in-shadow-mode | C13 | RSF no longer active |
| 9 | 13-quality | 16-dry-run-preflight-for-memory-save | C15 | Implementation differs |
| 10 | 14-pipeline | 02-mpab-chunk-to-memory-aggregation | C16 | Significant changes |
| 11 | 14-pipeline | 08-performance-improvements | C16 | Stale collection of fixes |
| 12 | 14-pipeline | 10-legacy-v1-pipeline-removal | C16 | Status claims outdated |
| 13 | 14-pipeline | 16-backend-storage-adapter-abstraction | C17 | Implementation changed |
| 14 | 14-pipeline | 18-atomic-write-then-index-api | C17 | Significant refactor |
| 15 | 14-pipeline | 21-atomic-pending-file-recovery | C17 | Moved/restructured |
| 16 | 17-governance | 02-feature-flag-sunset-audit | C19 | Entirely stale |
| 17 | 20-flags | 01-1-search-pipeline-features-speckit | C20 | Flag table outdated |
| 18 | 20-flags | 05-5-embedding-and-api | C20 | Flag table outdated |

---

## P1: BOTH (Description + Paths) (63 Features)

Features needing both description updates and path corrections.

| Category | Count | Features |
|----------|-------|----------|
| 01-retrieval | 5 | 02, 03, 05, 08, 09 |
| 02-mutation | 3 | 04, 05, 06, 08 |
| 03-discovery | 3 | 01, 02, 03 |
| 05-lifecycle | 1 | 02, 07 |
| 06-analysis | 2 | 02, 07 |
| 07-evaluation | 1 | 02 |
| 08-bug-fixes | 1 | 05 |
| 09-eval | 8 | 03, 05, 06, 07, 08, 09, 11, 12 |
| 10-graph | 4 | 01, 02, 05, 06, 07 |
| 11-scoring | 5 | 01, 06, 10, 14, 16 |
| 12-query | 4 | 01, 04, 05, 06 |
| 13-quality | 7 | 01, 02, 04, 06, 09, 11, 12, 15 |
| 14-pipeline | 3 | 01, 06, 12 |
| 15-retrieval-enh | 2 | 04, 05 |
| 16-tooling | 6 | 02, 04, 05, 06, 07, 08 |
| 19-decisions | 0 | — |
| 20-flags | 2 | 04, 06 |

---

## P1: UPDATE_PATHS Only (81 Features)

Features with accurate descriptions but stale/incomplete source file paths.

Most of these are due to the batch-fixable `retry.vitest.ts` rename (PV-001). After the P0 batch fix, many of these will reduce to minor additions of newly added source files.

---

## P1: UPDATE_DESCRIPTION Only (11 Features)

Features with correct paths but slightly inaccurate descriptions.

| Category | Feature | Agent |
|----------|---------|-------|
| 02-mutation | 09-correction-tracking-with-undo | C02 |
| 04-maintenance | 02-startup-runtime-compatibility-guards | C03 |
| 05-lifecycle | 06-startup-pending-file-recovery | C03 |
| 07-eval | 02-core-metric-computation | C07 |
| 07-eval | 04-full-context-ceiling-evaluation | C07 |
| 10-graph | 10-causal-neighbor-boost-and-injection | C10 |
| 10-graph | 11-temporal-contiguity-layer | C10 |
| 11-scoring | 02-cold-start-novelty-boost | C10 |
| 11-scoring | 08-rrf-k-value-sensitivity-analysis | C11 |
| 19-decisions | 01-int8-quantization-evaluation | C20 |
| 20-flags | 07-7-ci-and-build-informational | C20 |

---

## P1: NEW-FEATURE (High Significance — 0)

No high-significance new gaps were discovered beyond those already confirmed from the original scan.

---

## P2: NEW-FEATURE (Medium/Low Significance — 29)

New undocumented capabilities discovered during gap investigation.

### Medium Significance (19)

| # | Feature | Source | Suggested Category |
|---|---------|--------|-------------------|
| 1 | Startup API-Key Preflight Gate | X01 | 04-maintenance |
| 2 | Dynamic MCP Server Instructions from Live Stats | X01 | 14-pipeline |
| 3 | Deterministic Graceful Shutdown | X01 | 14-pipeline |
| 4 | Spec-Doc Indexing Kill Switch | X03 | 04-maintenance |
| 5 | Multi-Strategy Causal Reference Resolution | X03 | 06-analysis |
| 6 | sqlite-vec Capability Fallback | X03 | 14-pipeline |
| 7 | Rerank Score Provenance Discriminator | X04 | 11-scoring |
| 8 | Confidence-Scored Artifact Query Classification | X04 | 12-query-intelligence |
| 9 | Co-Activation Related-Memory Cache | X05 | 10-graph-signal |
| 10 | Wraparound-Safe Event Counter Clock | X05 | 10-graph-signal |
| 11 | Relative BM25-vs-Hybrid Contingency Mode | X06 | 09-eval-measurement |
| 12 | Multi-Metric Ablation Diagnostics | X06 | 09-eval-measurement |
| 13 | Sampled Scoring Observability Store | X06 | 09-eval-measurement |
| 14 | Optimistic State-Transition Conflict Guard | X07 | 14-pipeline |
| 15 | Schema-Adaptive Canonical-Path Query Fallback | X08 | 14-pipeline |
| 16 | Shutdown-Safe Access Accumulator Drain | X08 | 14-pipeline |
| 17 | Extraction Rule Regex Safety Validation | X08 | 13-memory-quality |
| 18 | Intent Disambiguation Guardrails | X09 | 12-query-intelligence |
| 19 | Deterministic Provider-Free Centroid Classifier | X09 | 12-query-intelligence |

### Low Significance (10)

| # | Feature | Source | Suggested Category |
|---|---------|--------|-------------------|
| 1 | Durable Archival Stats Persistence | X05 | 05-lifecycle |
| 2 | Consumption Pattern Mining | X06 | 09-eval-measurement |
| 3 | Regex-Based Tool Cache Invalidation | X07 | 11-scoring |
| 4 | Layer Prefix/Documentation Rendering Utilities | X07 | 16-tooling |
| 5 | Spec-Folder-Scoped History Aggregation | X08 | 13-memory-quality |
| 6 | Redaction-Ratio Abort Gate | X08 | 13-memory-quality |
| 7 | Stage 2 Post-Signal Score Reconciliation Guard | X09 | 14-pipeline |
| 8 | Persistent Embedding Cache Hit/Miss Path | X10 | 11-scoring |
| 9 | Age-Filtered Retention Deletion | X10 | 02-mutation |
| 10 | Alias Reconcile Candidate Expansion | X10 | 13-memory-quality |

---

## Remediation Execution Plan

### Phase 0: Addendum Follow-up (P1)
1. Normalize source-path style in `16--tooling-and-scripts/11-feature-catalog-code-references.md`
2. Correct/remove invalid `command/memory/context.md` entry in `16--tooling-and-scripts/13-constitutional-memory-manager-command.md`

### Phase 1: Batch Fixes (P0) — Scriptable
1. Global replace `retry.vitest.ts` → `retry-manager.vitest.ts` across all 52 affected snippets
2. Remove `slug-utils.ts` reference from 2 snippets
3. Remove `check-architecture-boundaries.ts` reference from 1 snippet
4. Run `replace-monolith-source-files.mjs` to sync monolith

### Phase 2: Rewrites (P1-REWRITE) — 18 features
Each needs full description rewrite based on current source code.

### Phase 3: Description + Path Updates (P1-BOTH) — 63 features
Update descriptions for accuracy and add/remove source file paths.

### Phase 4: Path-Only Updates (P1-UPDATE_PATHS) — 81 features
After Phase 1 batch fix, verify remaining path issues.

### Phase 5: Description-Only Updates (P1-UPDATE_DESC) — 11 features
Minor description corrections.

### Phase 6: New Features (P2) — 29 new entries
Create new snippet files using gap investigation draft descriptions.

### Phase 7: Monolith Sync
Run `replace-monolith-source-files.mjs` to update `feature_catalog.md`.

---

## Estimated Effort

| Phase | Items | Approach | Effort |
|-------|-------|----------|--------|
| Phase 1 | 3 batch fixes | Script | ~5 min |
| Phase 2 | 18 rewrites | Agent-assisted | ~2 hours |
| Phase 3 | 63 updates | Agent-assisted | ~3 hours |
| Phase 4 | 81 path fixes | Semi-automated | ~1 hour |
| Phase 5 | 11 desc fixes | Manual | ~30 min |
| Phase 6 | 29 new features | Agent-assisted | ~2 hours |
| Phase 7 | 1 sync | Script | ~5 min |
| Addendum follow-up | 2 items | Manual | ~20-30 min |
| **Total** | | | **~9.5 hours** |
