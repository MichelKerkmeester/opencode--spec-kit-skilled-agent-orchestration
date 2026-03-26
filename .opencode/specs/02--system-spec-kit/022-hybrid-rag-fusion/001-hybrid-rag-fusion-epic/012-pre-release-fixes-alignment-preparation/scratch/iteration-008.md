# Iteration 008: Feature Catalog 15-21 vs Code

## Findings

- **F1 (Traceability drift):** The master catalog section numbering no longer aligns with folder numbering. In current `FEATURE_CATALOG.md`, section **16** is "Retrieval Enhancements" and section **21** is "Feature Flag Reference"; category folders `20--...` and `21--...` are stubs instead of per-feature snippets. This creates section↔folder mismatch for strict 15-21 mapping.

  - Evidence: `FEATURE_CATALOG.md:3366` (`## 16. RETRIEVAL ENHANCEMENTS`), `FEATURE_CATALOG.md:4368` (`## 21. FEATURE FLAG REFERENCE`), `20--remediation-revalidation/01-category-stub.md`, `21--implement-and-remove-deprecated-features/01-category-stub.md`.

- **F2 (Missing snippet links for claimed features):** 4 claimed features in master section 20 have no snippet link entry in the master section body (they use direct shell-script references only), so check (1) and strict check (2) fail for those claims.

  - `Phase detection and scoring (recommend-level.sh --recommend-phases)` (`FEATURE_CATALOG.md:4304`)
  - `Phase folder creation (create.sh --phase)` (`FEATURE_CATALOG.md:4320`)
  - `Recursive phase validation (validate.sh --recursive)` (`FEATURE_CATALOG.md:4336`)
  - `Phase link validation (check-phase-links.sh)` (`FEATURE_CATALOG.md:4352`)

- **F3 (Title mismatch):** 1 linked feature has a title mismatch between master and snippet heading.

  - Master: `### 1. Search Pipeline Features (SPECKIT_*)` (`FEATURE_CATALOG.md:4376`)

  - Snippet: `# Search Pipeline Features (SPECKIT_*)` (`19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:6`)

- **F4 (Unlinked snippets in target folders):** 4 snippet files exist under category folders 15-21 but are not referenced by master sections 15-21 links.

  - `16--tooling-and-scripts/18-template-compliance-contract-enforcement.md`
  - `19--feature-flag-reference/08-audit-phase-020-mapping-note.md`
  - `20--remediation-revalidation/01-category-stub.md`
  - `21--implement-and-remove-deprecated-features/01-category-stub.md`

- **F5 (Implementation status vs code reality):** No mismatches detected. For all 82 claimed features in master sections 15-21, cited source paths resolve to existing code/docs or are explicitly marked deleted in snippet tables (no unresolved path references).

### Per-feature verification matrix (sections 15-21)

Legend: C1=snippet exists, C2=snippet matches master (title + CR parity), C3=status matches code reality

#### Section 15: PIPELINE ARCHITECTURE

| Feature | Snippet | C1 | C2 | C3 |
|---|---|---|---|---|
| 4-stage pipeline refactor | `14--pipeline-architecture/01-4-stage-pipeline-refactor.md` | PASS | PASS | PASS |
| MPAB chunk-to-memory aggregation | `14--pipeline-architecture/02-mpab-chunk-to-memory-aggregation.md` | PASS | PASS | PASS |
| Chunk ordering preservation | `14--pipeline-architecture/03-chunk-ordering-preservation.md` | PASS | PASS | PASS |
| Template anchor optimization | `14--pipeline-architecture/04-template-anchor-optimization.md` | PASS | PASS | PASS |
| Validation signals as retrieval metadata | `14--pipeline-architecture/05-validation-signals-as-retrieval-metadata.md` | PASS | PASS | PASS |
| Learned relevance feedback | `14--pipeline-architecture/06-learned-relevance-feedback.md` | PASS | PASS | PASS |
| Search pipeline safety | `14--pipeline-architecture/07-search-pipeline-safety.md` | PASS | PASS | PASS |
| Performance improvements | `14--pipeline-architecture/08-performance-improvements.md` | PASS | PASS | PASS |
| Activation window persistence | `14--pipeline-architecture/09-activation-window-persistence.md` | PASS | PASS | PASS |
| Legacy V1 pipeline removal | `14--pipeline-architecture/10-legacy-v1-pipeline-removal.md` | PASS | FAIL | PASS |
| Pipeline and mutation hardening | `14--pipeline-architecture/11-pipeline-and-mutation-hardening.md` | PASS | PASS | PASS |
| DB_PATH extraction and import standardization | `14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md` | PASS | PASS | PASS |
| Strict Zod schema validation | `14--pipeline-architecture/13-strict-zod-schema-validation.md` | PASS | PASS | PASS |
| Dynamic server instructions at MCP initialization | `14--pipeline-architecture/14-dynamic-server-instructions-at-mcp-initialization.md` | PASS | PASS | PASS |
| Warm server / daemon mode | `14--pipeline-architecture/15-warm-server-daemon-mode.md` | PASS | PASS | PASS |
| Backend storage adapter abstraction | `14--pipeline-architecture/16-backend-storage-adapter-abstraction.md` | PASS | PASS | PASS |
| Cross-process DB hot rebinding | `14--pipeline-architecture/17-cross-process-db-hot-rebinding.md` | PASS | PASS | PASS |
| Atomic write-then-index API | `14--pipeline-architecture/18-atomic-write-then-index-api.md` | PASS | FAIL | PASS |
| Embedding retry orchestrator | `14--pipeline-architecture/19-embedding-retry-orchestrator.md` | PASS | PASS | PASS |
| 7-layer tool architecture metadata | `14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md` | PASS | PASS | PASS |
| Atomic pending-file recovery | `14--pipeline-architecture/21-atomic-pending-file-recovery.md` | PASS | PASS | PASS |
| Lineage state active projection and asOf resolution | `14--pipeline-architecture/22-lineage-state-active-projection-and-asof-resolution.md` | PASS | PASS | PASS |

#### Section 16: RETRIEVAL ENHANCEMENTS

| Feature | Snippet | C1 | C2 | C3 |
|---|---|---|---|---|
| Dual-scope memory auto-surface | `15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md` | PASS | PASS | PASS |
| Constitutional memory as expert knowledge injection | `15--retrieval-enhancements/02-constitutional-memory-as-expert-knowledge-injection.md` | PASS | PASS | PASS |
| Spec folder hierarchy as retrieval structure | `15--retrieval-enhancements/03-spec-folder-hierarchy-as-retrieval-structure.md` | PASS | PASS | PASS |
| Lightweight consolidation | `15--retrieval-enhancements/04-lightweight-consolidation.md` | PASS | PASS | PASS |
| Memory summary search channel | `15--retrieval-enhancements/05-memory-summary-search-channel.md` | PASS | PASS | PASS |
| Cross-document entity linking | `15--retrieval-enhancements/06-cross-document-entity-linking.md` | PASS | PASS | PASS |
| Tier-2 fallback channel forcing | `15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md` | PASS | PASS | PASS |
| Provenance-rich response envelopes | `15--retrieval-enhancements/08-provenance-rich-response-envelopes.md` | PASS | PASS | PASS |
| Contextual tree injection | `15--retrieval-enhancements/09-contextual-tree-injection.md` | PASS | PASS | PASS |

#### Section 17: TOOLING AND SCRIPTS

| Feature | Snippet | C1 | C2 | C3 |
|---|---|---|---|---|
| Tree thinning for spec folder consolidation | `16--tooling-and-scripts/01-tree-thinning-for-spec-folder-consolidation.md` | PASS | PASS | PASS |
| Architecture boundary enforcement | `16--tooling-and-scripts/02-architecture-boundary-enforcement.md` | PASS | PASS | PASS |
| Progressive validation for spec documents | `16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md` | PASS | PASS | PASS |
| Dead code removal | `16--tooling-and-scripts/04-dead-code-removal.md` | PASS | FAIL | PASS |
| Code standards alignment | `16--tooling-and-scripts/05-code-standards-alignment.md` | PASS | PASS | PASS |
| Real-time filesystem watching with chokidar | `16--tooling-and-scripts/06-real-time-filesystem-watching-with-chokidar.md` | PASS | PASS | PASS |
| Standalone admin CLI | `16--tooling-and-scripts/07-standalone-admin-cli.md` | PASS | PASS | PASS |
| Constitutional memory manager command | `16--tooling-and-scripts/13-constitutional-memory-manager-command.md` | PASS | FAIL | PASS |
| Source-dist alignment enforcement | `16--tooling-and-scripts/14-source-dist-alignment-enforcement.md` | PASS | PASS | PASS |
| Module boundary map | `16--tooling-and-scripts/15-module-boundary-map.md` | PASS | FAIL | PASS |
| JSON mode structured summary hardening | `16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md` | PASS | PASS | PASS |
| JSON-primary deprecation posture | `16--tooling-and-scripts/17-json-primary-deprecation-posture.md` | PASS | PASS | PASS |
| Migration checkpoint scripts | `16--tooling-and-scripts/09-migration-checkpoint-scripts.md` | PASS | PASS | PASS |
| Schema compatibility validation | `16--tooling-and-scripts/10-schema-compatibility-validation.md` | PASS | PASS | PASS |
| Watcher delete/rename cleanup | `16--tooling-and-scripts/08-watcher-delete-rename-cleanup.md` | PASS | PASS | PASS |
| Feature catalog code references | `16--tooling-and-scripts/11-feature-catalog-code-references.md` | PASS | PASS | PASS |
| Session capturing pipeline quality | `16--tooling-and-scripts/12-session-capturing-pipeline-quality.md` | PASS | PASS | PASS |

#### Section 18: GOVERNANCE

| Feature | Snippet | C1 | C2 | C3 |
|---|---|---|---|---|
| Feature flag governance | `17--governance/01-feature-flag-governance.md` | PASS | PASS | PASS |
| Feature flag sunset audit | `17--governance/02-feature-flag-sunset-audit.md` | PASS | PASS | PASS |
| Hierarchical scope governance, governed ingest, retention, and audit | `17--governance/03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md` | PASS | PASS | PASS |
| Shared-memory rollout, deny-by-default membership, and kill switch | `17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md` | PASS | PASS | PASS |

#### Section 19: UX HOOKS

| Feature | Snippet | C1 | C2 | C3 |
|---|---|---|---|---|
| Shared post-mutation hook wiring | `18--ux-hooks/01-shared-post-mutation-hook-wiring.md` | PASS | PASS | PASS |
| Memory health autoRepair metadata | `18--ux-hooks/02-memory-health-autorepair-metadata.md` | PASS | PASS | PASS |
| Checkpoint delete confirmName safety | `18--ux-hooks/03-checkpoint-delete-confirmname-safety.md` | PASS | PASS | PASS |
| Schema and type contract synchronization | `18--ux-hooks/04-schema-and-type-contract-synchronization.md` | PASS | PASS | PASS |
| Dedicated UX hook modules | `18--ux-hooks/05-dedicated-ux-hook-modules.md` | PASS | PASS | PASS |
| Mutation hook result contract expansion | `18--ux-hooks/06-mutation-hook-result-contract-expansion.md` | PASS | PASS | PASS |
| Mutation response UX payload exposure | `18--ux-hooks/07-mutation-response-ux-payload-exposure.md` | PASS | PASS | PASS |
| Context-server success-path hint append | `18--ux-hooks/08-context-server-success-hint-append.md` | PASS | PASS | PASS |
| Duplicate-save no-op feedback hardening | `18--ux-hooks/09-duplicate-save-no-op-feedback-hardening.md` | PASS | PASS | PASS |
| Atomic-save parity and partial-indexing hints | `18--ux-hooks/10-atomic-save-parity-and-partial-indexing-hints.md` | PASS | PASS | PASS |
| Final token metadata recomputation | `18--ux-hooks/11-final-token-metadata-recomputation.md` | PASS | PASS | PASS |
| Hooks README and export alignment | `18--ux-hooks/12-hooks-readme-and-export-alignment.md` | PASS | PASS | PASS |
| End-to-end success-envelope verification | `18--ux-hooks/13-end-to-end-success-envelope-verification.md` | PASS | PASS | PASS |
| Empty result recovery | `18--ux-hooks/18-empty-result-recovery.md` | PASS | PASS | PASS |
| Result confidence scoring | `18--ux-hooks/19-result-confidence.md` | PASS | PASS | PASS |
| Two-tier result explainability | `18--ux-hooks/14-result-explainability.md` | PASS | FAIL | PASS |
| Mode-aware response profiles | `18--ux-hooks/15-mode-aware-response-profiles.md` | PASS | PASS | PASS |
| Progressive disclosure with cursor pagination | `18--ux-hooks/16-progressive-disclosure.md` | PASS | PASS | PASS |
| Retrieval session state | `18--ux-hooks/17-retrieval-session-state.md` | PASS | PASS | PASS |

#### Section 20: SPEC KIT PHASE WORKFLOWS

| Feature | Snippet | C1 | C2 | C3 |
|---|---|---|---|---|
| Phase detection and scoring (recommend-level.sh --recommend-phases) | `N/A (no link in master)` | FAIL | FAIL | PASS |
| Phase folder creation (create.sh --phase) | `N/A (no link in master)` | FAIL | FAIL | PASS |
| Recursive phase validation (validate.sh --recursive) | `N/A (no link in master)` | FAIL | FAIL | PASS |
| Phase link validation (check-phase-links.sh) | `N/A (no link in master)` | FAIL | FAIL | PASS |

#### Section 21: FEATURE FLAG REFERENCE

| Feature | Snippet | C1 | C2 | C3 |
|---|---|---|---|---|
| 1. Search Pipeline Features (SPECKIT_*) | `19--feature-flag-reference/01-1-search-pipeline-features-speckit.md` | PASS | FAIL | PASS |
| 2. Session and Cache | `19--feature-flag-reference/02-2-session-and-cache.md` | PASS | PASS | PASS |
| 3. MCP Configuration | `19--feature-flag-reference/03-3-mcp-configuration.md` | PASS | PASS | PASS |
| 4. Memory and Storage | `19--feature-flag-reference/04-4-memory-and-storage.md` | PASS | PASS | PASS |
| 5. Embedding and API | `19--feature-flag-reference/05-5-embedding-and-api.md` | PASS | PASS | PASS |
| 6. Debug and Telemetry | `19--feature-flag-reference/06-6-debug-and-telemetry.md` | PASS | PASS | PASS |
| 7. CI and Build (informational) | `19--feature-flag-reference/07-7-ci-and-build-informational.md` | PASS | PASS | PASS |

## Summary

- Features claimed in master sections 15-21: **82**
- C1 (snippet exists): **78 PASS / 4 FAIL**
- C2 (snippet matches master): **71 PASS / 11 FAIL**
- C3 (implementation status matches code reality): **82 PASS / 0 FAIL**
- Primary issue class: **traceability alignment drift** (section numbering, category numbering, and stub-category usage).
- Code reality status: **no missing implementation references detected** in claimed features.

## JSONL

{"type": "iteration", "run": 8, "mode": "review", "dimensions": ["traceability"], "scope": {"master_sections": [15, 16, 17, 18, 19, 20, 21], "category_folders": ["15--retrieval-enhancements", "16--tooling-and-scripts", "17--governance", "18--ux-hooks", "19--feature-flag-reference", "20--remediation-revalidation", "21--implement-and-remove-deprecated-features"]}, "counts": {"features_claimed": 82, "check1_snippet_exists": {"pass": 78, "fail": 4}, "check2_snippet_matches_master": {"pass": 71, "fail": 11}, "check3_status_matches_code": {"pass": 82, "fail": 0}}, "key_findings": ["Section/category numbering drift (retrieval starts at section 16, not 15).", "Section 20 has 4 claimed features without snippet links.", "One title mismatch in section 21 feature-flag heading prefix.", "No implementation-status mismatches against referenced code paths."], "timestamp_utc": "2026-03-25T09:00:03.213Z"}
