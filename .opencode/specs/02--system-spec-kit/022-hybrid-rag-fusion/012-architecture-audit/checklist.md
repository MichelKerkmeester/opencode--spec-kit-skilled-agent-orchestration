---
title: "Verification Checklist: Scripts vs mcp_server Architecture Refinement + Boundary Remediation [template:level_3/checklist.md]"
description: "Verification checklist for concern separation, boundary clarity, dependency direction, remediation carry-over, and discoverability improvements."
SPECKIT_TEMPLATE_SOURCE: "checklist | v2.2"
trigger_phrases:
  - "phase 8 checklist"
  - "architecture verification"
  - "boundary checks"
importance_tier: "critical"
contextType: "architecture"
---
# Verification Checklist: Scripts vs mcp_server Architecture Refinement + Boundary Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

## Verification Protocol
<!-- ANCHOR:protocol -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Full tree and source inventories captured in this spec folder `scratch/`. [EVIDENCE: `scratch/agent3-root-source-inventory.md`, `scratch/agent4-mcp-source-inventory.md`]
- [x] CHK-002 [P0] 6-criterion architecture evaluation completed with evidence paths. [EVIDENCE: `scratch/architecture-audit-report.md` Phase 2 table with per-criterion file paths]
- [x] CHK-003 [P1] Recommendations documented with effort/risk/developer-impact fields. [EVIDENCE: `scratch/architecture-audit-report.md` Phase 3 recommendations table]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Architecture Boundary Quality

- [x] CHK-010 [P0] Runtime-vs-CLI boundary contract documented at canonical path. [EVIDENCE: `.opencode/skill/system-spec-kit/ARCHITECTURE_BOUNDARIES.md` created with ownership matrix, dependency directions, exception governance]
- [x] CHK-011 [P0] Public API consumer policy documented for `mcp_server/api/*`. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/api/README.md` created with consumer policy, migration guide]
- [x] CHK-012 [P0] Forbidden `scripts -> @spec-kit/mcp-server/lib/*` imports are guarded by automated check. [EVIDENCE: `scripts/evals/check-no-mcp-lib-imports.ts` + `import-policy-allowlist.json` created; `npm run check` passes]
- [x] CHK-013 [P0] Documented handler cycle no longer present. [EVIDENCE: `escapeLikePattern` moved from memory-save.ts to handler-utils.ts; `detectSpecLevelFromParsed` moved from causal-links-processor.ts to handler-utils.ts; causal-links-processor no longer imports from memory-save]
- [x] CHK-014 [P1] Compatibility wrapper scope is explicit in `.opencode/skill/system-spec-kit/mcp_server/scripts/README.md`. [EVIDENCE: heading changed to "Compatibility Wrappers", explicit first paragraph added, Canonical Locations section added]
- [x] CHK-015 [P1] Reindex runbook has single canonical owner doc with pointer docs elsewhere. [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/memory/README.md` has Canonical Runbook section; `.opencode/skill/system-spec-kit/mcp_server/database/README.md` and `.opencode/skill/system-spec-kit/mcp_server/scripts/README.md` point to it]
- [x] CHK-016 [P1] Duplicate helper concerns consolidated with shared ownership. [EVIDENCE: `shared/utils/token-estimate.ts` and `shared/parsing/quality-extractors.ts` created; 4 consumer files migrated to use shared implementations]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Import-policy check runs in default lint/check workflow. [EVIDENCE: `scripts/package.json` check script = `npm run lint && npx tsx evals/check-no-mcp-lib-imports.ts`; `npm run check` passes]
- [x] CHK-021 [P1] Helper consolidation parity tests pass. [EVIDENCE: `tsc --noEmit` passes in scripts/ and mcp_server/ workspaces; re-exports preserve backward compatibility]
- [x] CHK-022 [P1] Reindex compatibility path remains operational. [EVIDENCE: `mcp_server/scripts/reindex-embeddings.ts` wrapper unchanged; allowlist covers `scripts/memory/reindex-embeddings.ts` lib imports]
- [x] CHK-023 [P2] Lint/check runtime overhead increase remains within target. [EVIDENCE: fresh timed `npm run check --workspace=scripts` run captured in `scratch/verification-log-2026-03-04.md` (`real 1.73s`)]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Level 3 docs exist in this folder: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`. [EVIDENCE: all 5 files present in `012-architecture-audit/` directory listing]
- [x] CHK-041 [P1] Cross-links from READMEs to boundary contract and API policy complete. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/api/README.md`, `.opencode/skill/system-spec-kit/scripts/evals/README.md`, `.opencode/skill/system-spec-kit/shared/README.md` all reference `.opencode/skill/system-spec-kit/ARCHITECTURE_BOUNDARIES.md`]
- [x] CHK-042 [P2] Deprecation/removal criteria documented for compatibility wrappers and allowlist entries. [EVIDENCE: T037 completed; `.opencode/skill/system-spec-kit/ARCHITECTURE_BOUNDARIES.md` includes "Wrapper Removal Criteria" and "Allowlist Removal Criteria" sections]
- [x] CHK-043 [P1] `.opencode/skill/system-spec-kit/scripts/evals/README.md` created with import policy (T003). [EVIDENCE: file exists with import policy table and exception process section]
- [x] CHK-044 [P1] `.opencode/skill/system-spec-kit/mcp_server/database/README.md` updated with canonical runbook pointer (T006). [EVIDENCE: pointer to `.opencode/skill/system-spec-kit/scripts/memory/README.md` present, duplicate procedural detail replaced]
- [x] CHK-433 [P1] Stale `retry-manager` references removed or explicitly marked moved in `.opencode/skill/system-spec-kit/scripts/lib/README.md` and `scripts/scripts-registry.json` (T018). [EVIDENCE: T018 marked done in `tasks.md`; `.opencode/skill/system-spec-kit/scripts/lib/README.md` reflects moved status and registry entry removed]
- [x] CHK-434 [P1] `.opencode/skill/system-spec-kit/shared/README.md` documents boundary/ownership expectations for shared modules (T019). [EVIDENCE: T019 marked done in `tasks.md`; `.opencode/skill/system-spec-kit/shared/README.md` includes boundary policy and consumer expectations]
- [x] CHK-435 [P1] Embeddings shim consolidation is documented with canonical import guidance (T020). [EVIDENCE: T020 marked done in `tasks.md`; `.opencode/skill/system-spec-kit/shared/README.md` includes embeddings shim consolidation guidance]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] ADRs capture boundary, compatibility strategy, and helper consolidation. [EVIDENCE: `decision-record.md` ADR-001 (boundary), ADR-002 (compatibility), ADR-003 (consolidation)]
- [x] CHK-101 [P1] Alternatives and rejection rationale reflect current code evidence. [EVIDENCE: ADR-001 through ADR-003 in decision-record.md document alternatives with code-path evidence]
- [x] CHK-102 [P1] Migration path includes rollback and exception governance. [EVIDENCE: `import-policy-allowlist.json` defines exception governance; shared modules re-export for backward compatibility]
- [x] CHK-103 [P2] Architecture docs remain synchronized with enforcement scripts. [EVIDENCE: T048 and T049 completed; `.opencode/skill/system-spec-kit/ARCHITECTURE_BOUNDARIES.md` enforcement table and `.opencode/skill/system-spec-kit/scripts/evals/README.md` inventory both include `check-architecture-boundaries.ts`]
<!-- /ANCHOR:arch-verify -->

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-110 [P1] All README cross-links between boundary contract and consumer docs are bidirectional. [EVIDENCE: .opencode/skill/system-spec-kit/ARCHITECTURE_BOUNDARIES.md → .opencode/skill/system-spec-kit/scripts/evals/README.md, .opencode/skill/system-spec-kit/mcp_server/api/README.md; reverse links present in both READMEs]
- [x] CHK-111 [P1] Canonical runbook location is consistent across all pointer docs. [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/memory/README.md` = canonical; `.opencode/skill/system-spec-kit/mcp_server/scripts/README.md` and `.opencode/skill/system-spec-kit/mcp_server/database/README.md` point to it]
- [x] CHK-112 [P2] Spec folder docs pass recursive validation (`validate.sh --recursive`). [EVIDENCE: T038 completed; `validate.sh --recursive 012-architecture-audit` passed with 0 errors and 0 warnings]
<!-- /ANCHOR:docs-verify -->

<!-- ANCHOR:review-remediation -->
## Phase 4: Review Remediation Verification

Items added from triple ultra-think cross-AI review (2026-03-04).

### P0 Blockers (must resolve before phase completion)

- [x] CHK-200 [P0] `check-api-boundary.sh` integrated into `npm run check` pipeline. [EVIDENCE: `scripts/package.json` check = `npm run lint && npx tsx evals/check-no-mcp-lib-imports.ts && bash check-api-boundary.sh`; `npm run check` passes all 3 stages]
- [x] CHK-201 [P0] `.opencode/skill/system-spec-kit/ARCHITECTURE_BOUNDARIES.md` exception table matches `import-policy-allowlist.json` exactly. [EVIDENCE: `reindex-embeddings.ts` row added; 6 exceptions in table match 6 entries in allowlist JSON]
- [x] CHK-202 [P0] `PROHIBITED_PATTERNS` covers `@spec-kit/mcp-server/core/*` in addition to `lib/*`. [EVIDENCE: 2 package-form + 2 relative-form `core/` patterns added; `npm run check` passes with existing `core/config` allowlisted]
- [x] CHK-203 [P0] `escapeLikePattern` in `handler-utils.ts` escapes backslash before `%`/`_`. [EVIDENCE: `.replace(/\\\\/g, '\\\\\\\\')` prepended; backslash escaped first in chain]

### P1 Should-Fix (must complete or get user-approved deferral)

- [x] CHK-210 [P1] Dynamic `import()` expressions detected by enforcement script. [EVIDENCE: 2 dynamic `import()` patterns added for lib/ and core/ package-form]
- [x] CHK-211 [P1] Relative path variants at all depth levels detected. [EVIDENCE: variable-depth `\.\.(?:\/\.\.)*` patterns cover import/from, require, for both lib/ and core/]
- [x] CHK-212 [P1] `.opencode/skill/system-spec-kit/shared/README.md` structure tree includes `utils/token-estimate.ts` and `parsing/quality-extractors.ts`. [EVIDENCE: both entries added to structure tree and Key Files table in .opencode/skill/system-spec-kit/shared/README.md]
- [x] CHK-213 [P1] Allowlist entries include governance fields (`createdAt`, `lastReviewedAt`, `expiresAt`). [EVIDENCE: AllowlistException interface updated; all 6 entries have `createdAt` and `lastReviewedAt`]
- [x] CHK-214 [P1] No wildcard exceptions without expiry date or explicit module list. [EVIDENCE: 3 wildcard entries given `expiresAt: 2026-06-04` (90-day sunset)]
- [x] CHK-215 [P1] `.opencode/skill/system-spec-kit/scripts/evals/README.md` documents all eval-scope exceptions. [EVIDENCE: both `run-performance-benchmarks.ts` and `run-chk210-quality-backfill.ts` listed]
- [x] CHK-216 [P1] Quality extraction (`extractQualityScore`/`extractQualityFlags`) scoped to YAML frontmatter boundaries. [EVIDENCE: `extractFrontmatter()` helper extracts `---` block; both functions search within frontmatter, fallback to full content]
- [x] CHK-217 [P1] Causal reference resolution uses deterministic ordering (ORDER BY, exact-match precedence). [EVIDENCE: `ORDER BY id DESC LIMIT 1` added to all 3 LIKE queries in resolveMemoryReference]
- [x] CHK-218 [P1] Chunking fallback metadata updater uses SQL column allowlist guard. [EVIDENCE: ALLOWED_METADATA_COLUMNS Set (18 columns); entries filtered before SQL construction in applyPostInsertMetadataFallback]
- [x] CHK-219 [P1] Empty `retainedChunks` set handled explicitly in chunking-orchestrator. [EVIDENCE: early return with `status: 'warning'` when `retainedChunks.length === 0`]
- [x] CHK-230 [P1] `similarity / 100` in pe-gating has finite guard (NaN/Infinity → safe default). [EVIDENCE: typeof check + Number.isFinite guard in findSimilarMemories; non-finite defaults to 0]
- [x] CHK-231 [P1] Relative `require()` paths to `mcp_server/lib/` detected by enforcement script. [EVIDENCE: 2 variable-depth relative require patterns added for lib/ and core/]

### P2 Nice-to-Have (can defer with documented reason)

- [x] CHK-220 [P2] Block comments (`/* */`) excluded from import violation scanning. [EVIDENCE: block comment state machine added to scanFile() in check-no-mcp-lib-imports.ts; implemented as Wave 2 bonus]
- [x] CHK-221 [P2] Behavioral parity tests exist for `quality-extractors.ts` edge cases. [EVIDENCE: T031 completed; `quality-extractors.test.ts` added with edge-case behavioral assertions]
- [x] CHK-222 [P2] Bidirectional cross-links verified between boundary doc and consumer READMEs. [EVIDENCE: T032 completed; .opencode/skill/system-spec-kit/ARCHITECTURE_BOUNDARIES.md Related Documentation links to consumer READMEs with reverse links present]
- [x] CHK-223 [P2] `handler-utils.ts` has documented growth policy. [EVIDENCE: T033 completed; module header comment defines add-vs-split growth policy]
- [x] CHK-224 [P2] AST-based enforcement upgrade evaluated. [EVIDENCE: T034 completed; `scratch/ast-parsing-evaluation.md` documents options, tradeoffs, and effort]
- [x] CHK-225 [P2] Transitive re-export boundary violations detectable. [EVIDENCE: T035 completed; transitive re-export detection added to `check-no-mcp-lib-imports.ts`]
- [x] CHK-436 [P2] ADR-003 Five Checks explicitly cover both token estimation and quality extractor consolidation (T036). [EVIDENCE: T036 marked done in `tasks.md`; `decision-record.md` ADR-003 updated accordingly]
<!-- /ANCHOR:review-remediation -->

<!-- ANCHOR:phase-5-enforcement -->
## Phase 5: Architecture Enforcement Gaps

- [x] CHK-300 [P0] `check-architecture-boundaries.ts` detects prohibited imports in shared/. [EVIDENCE: T046 completed; checker enforces GAP A shared/ neutrality violations]
- [x] CHK-301 [P0] `check-architecture-boundaries.ts` detects non-wrapper files in mcp_server/scripts/. [EVIDENCE: T046 completed; checker enforces GAP B wrapper-only violations]
- [x] CHK-302 [P0] `npm run check` pipeline includes architecture boundary checker (4 stages). [EVIDENCE: T047 completed; `scripts/package.json` check script includes `npx tsx evals/check-architecture-boundaries.ts` as stage 4]
- [x] CHK-303 [P1] `.opencode/skill/system-spec-kit/ARCHITECTURE_BOUNDARIES.md` enforcement table lists new checker. [EVIDENCE: T048 completed; enforcement table row added for `check-architecture-boundaries.ts`]
- [x] CHK-304 [P1] `.opencode/skill/system-spec-kit/scripts/evals/README.md` inventory includes new checker. [EVIDENCE: T049 completed; script inventory row added for `check-architecture-boundaries.ts`]
<!-- /ANCHOR:phase-5-enforcement -->

<!-- ANCHOR:phase-6-parity -->
## Phase 6: Feature Catalog Parity Verification

Validates implementation-vs-documentation parity for feature catalog groups 01-18.

### P0 Blockers (must resolve)

- [x] CHK-400 [P0] `memory_match_triggers` never returns more than requested `limit` in cognitive mode. [EVIDENCE: `tests/handler-memory-triggers.vitest.ts` ("enforces caller limit on cognitive path responses"), combined run passed on 2026-03-04]
- [x] CHK-401 [P0] Ablation run survives single-channel failure with partial results and explicit channel error reporting. [EVIDENCE: `tests/ablation-framework.vitest.ts` includes per-channel failure isolation coverage, combined run passed on 2026-03-04]
- [x] CHK-402 [P0] Learned-feedback shadow period is log-only end-to-end (no write/apply path effects). [EVIDENCE: `tests/learned-feedback.vitest.ts` shadow-mode write-path tests, combined run passed on 2026-03-04]
- [x] CHK-403 [P0] Incremental `memory_index_scan` consumes `toDelete` and removes stale index records. [EVIDENCE: `tests/incremental-index-v2.vitest.ts` + `tests/handler-memory-index-cooldown.vitest.ts`, combined run passed on 2026-03-04]
- [x] CHK-404 [P0] Auto-promotion threshold semantics are based on positive validations per contract. [EVIDENCE: `tests/promotion-positive-validation-semantics.vitest.ts`, combined run passed on 2026-03-04]
- [x] CHK-437 [P0] Learned-feedback scaling is applied exactly once across learned-feedback and Stage 2 fusion paths (T053). [EVIDENCE: T053 marked done in `tasks.md`; `tests/stage2-fusion.vitest.ts` covers single-weighting behavior]

### P1 Required (complete or approved deferral)

- [x] CHK-410 [P1] Runtime emits per-channel eval events when eval logging is enabled (or docs explicitly scope why not). [EVIDENCE: `handlers/memory-search.ts` + `handlers/memory-context.ts` call `logChannelResult`; validated by `tests/memory-search-eval-channels.vitest.ts` and `tests/memory-context-eval-channels.vitest.ts`]
- [x] CHK-411 [P1] `memory_search.limit` contract is consistent across schema, runtime behavior, and docs. [EVIDENCE: `schemas/tool-input-schemas.ts` (`positiveIntMax(100)`), `handlers/memory-search.ts` runtime clamp (`Math.min(..., 100)`), `tool-schemas.ts` (`minimum:1, maximum:100`), `tests/tool-input-schema.vitest.ts` limit 100/101 contract tests]
- [x] CHK-412 [P1] `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature-catalog/feature_catalog.md` parity sweep completed for pipeline fallback, MPAB placement, normalization semantics, and lifecycle checkpoint behavior. [EVIDENCE: canonical + snippets updated in `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature-catalog/feature_catalog.md`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature-catalog/01-retrieval/04-hybrid-search-pipeline.md`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature-catalog/14-pipeline-architecture/02-mpab-chunk-to-memory-aggregation.md`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature-catalog/02-mutation/01-memory-indexing-memorysave.md`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature-catalog/05-lifecycle/01-checkpoint-creation-checkpointcreate.md`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature-catalog/05-lifecycle/03-checkpoint-restore-checkpointrestore.md`]
- [x] CHK-413 [P1] Evaluation/graph sections match code for metric count, edge-density denominator, graph-cache invalidation, and community-runtime wiring. [EVIDENCE: metric count aligned to 11 and density denominator aligned to `total_edges/total_memories` in canonical + snippets; community docs now state Stage 2 consumes precomputed assignments and does not auto-run detect/store helpers]
- [x] CHK-414 [P1] Governance and telemetry sections match code for active flags/knobs, caps, and logging semantics. [EVIDENCE: governance text aligned to process targets + 23 active `is*` helpers in `search-flags.ts`; eval logging semantics updated to fail-safe sync writes and precise channel coverage]
- [x] CHK-415 [P1] Full 5-agent re-audit over groups 01-18 reports no unresolved HIGH findings. [EVIDENCE: `scratch/t069-audit-agent-1-planck.md`, `scratch/t069-audit-agent-2-ampere.md`, `scratch/t069-audit-agent-3-gauss.md`, `scratch/t069-audit-agent-4-nash.md`, `scratch/t069-audit-agent-5-aristotle.md`, `scratch/t069-audit-summary.md`]
- [x] CHK-438 [P1] Targeted regression coverage exists for Phase 6 code fixes T050-T057 (T058). [EVIDENCE: T058 marked done in `tasks.md`; targeted suites under `mcp_server/tests/` cover trigger limit, ablation isolation, shadow semantics, weighting, delete flow, promotion semantics, channel logging, and schema contracts]
- [x] CHK-439 [P1] Phase folder closure evidence for T050-T069 is synchronized across `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` (T070). [EVIDENCE: T070 marked done in `tasks.md`; closure evidence and scratch audit pointers present in all four phase docs]

### Memory Quality Gates

- [x] CHK-430 [P1] Content-aware slug generation produces task-based filenames instead of generic folder-name slugs. [EVIDENCE: `slug-utils.ts` created with `generateContentSlug()`, integrated in `workflow.ts:581`]
- [x] CHK-431 [P1] Empty/template-only content is rejected before file write (200-char minimum after stripping boilerplate). [EVIDENCE: `validateContentSubstance()` added to `file-writer.ts`, called in `writeFilesAtomically()`]
- [x] CHK-432 [P1] Duplicate content detected via SHA-256 hash comparison before file write. [EVIDENCE: `checkForDuplicateContent()` added to `file-writer.ts`, checks existing *.md files in memory dir]

### P2 Nice-to-Have

- [x] CHK-420 [P2] Phase snippet docs contain no stale line-count/call-site attribution claims and all source metadata points to canonical `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature-catalog/feature_catalog.md`. [EVIDENCE: stale `~550 lines` + stale `line ~...` call-site references removed; `rg` over 034-feature-catalog confirms no legacy summary-source references and canonical metadata consistency]
<!-- /ANCHOR:phase-6-parity -->

<!-- ANCHOR:phase-7-carry-over -->
## Phase 7: Boundary Remediation Carry-Over Verification (Merged from Former 030)

### P0 Blockers (must resolve)

- [x] CHK-500 [P0] `npx tsc --noEmit` passes after Phase 7 import and constant-ownership migrations. [EVIDENCE: 2026-03-06 final verification run passed: `npx tsc --noEmit`]
- [x] CHK-501 [P0] `npm run check --workspace=scripts` passes with updated allowlist and no new forbidden-direction imports. [EVIDENCE: 2026-03-06 final verification run passed: `npm run check --workspace=scripts` and `npm run check:ast --workspace=scripts`; targeted import-policy rules vitest also passed]
- [x] CHK-502 [P0] CI-level boundary enforcement is mandatory and blocks PR merge on violation. [EVIDENCE: `.github/workflows/system-spec-kit-boundary-enforcement.yml` configured for pull requests with required boundary check + AST check stages]

### P1 Required (complete or approved deferral)

- [x] CHK-510 [P1] `scripts/core/memory-indexer.ts` uses API/shared imports for migrated concerns, and resolved allowlist entries are removed. [EVIDENCE: `memory-indexer.ts` imports `vectorIndex` from `@spec-kit/mcp-server/api/search` and `DB_UPDATED_FILE` from `@spec-kit/shared/config`; memory-indexer allowlist exceptions removed]
- [x] CHK-511 [P1] `scripts/memory/reindex-embeddings.ts` import audit is completed with per-import migration disposition. [EVIDENCE: `reindex-embeddings.ts` now imports only `@spec-kit/mcp-server/api/indexing` after safe API surface expansion]
- [x] CHK-512 [P1] Retained allowlist exceptions are justified, owned, and time-bounded (`lastReviewedAt`/`expiresAt`). [EVIDENCE: retained wildcard exceptions are eval-only and include governance metadata; `lastReviewedAt` updated to `2026-03-05`]
- [x] CHK-513 [P1] `.opencode/skill/system-spec-kit/ARCHITECTURE_BOUNDARIES.md` current-exceptions table matches allowlist state exactly. [EVIDENCE: exceptions table updated to match current allowlist entries after Phase 7 migrations]
- [x] CHK-514 [P1] `implementation-summary.md` captures Phase 7 outcomes, retained risks, and enforcement status. [EVIDENCE: implementation summary includes explicit "Phase 7 Closure (2026-03-06)" section with migration and verification evidence]

### P2 Nice-to-Have

- [ ] CHK-520 [P2] Optional local pre-commit boundary hook exists and mirrors CI checks. [EVIDENCE: pending]
- [ ] CHK-521 [P2] Boundary enforcement runtime remains within target budget after Phase 7 changes. [EVIDENCE: pending]
- [ ] CHK-522 [P2] API-surface expansion decisions include explicit encapsulation rationale in decision docs. [EVIDENCE: pending]
<!-- /ANCHOR:phase-7-carry-over -->

<!-- ANCHOR:phase-8-strict-pass -->
## Phase 8: Strict-Pass Remediation Verification

### P0 Blockers (must resolve)

- [x] CHK-530 [P0] Boundary-adjacent README files no longer drift from canonical policy docs for ownership, allowed imports, and operator guidance. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/README.md`, `.opencode/skill/system-spec-kit/mcp_server/scripts/README.md`, `.opencode/skill/system-spec-kit/shared/README.md`, and `.opencode/skill/system-spec-kit/mcp_server/hooks/README.md` updated to align with `.opencode/skill/system-spec-kit/ARCHITECTURE_BOUNDARIES.md` and current operator guidance]
- [x] CHK-531 [P0] Boundary policy explicitly distinguishes source-of-truth docs from generated `dist/` outputs and states the allowed role of `dist/` references. [EVIDENCE: `.opencode/skill/system-spec-kit/ARCHITECTURE_BOUNDARIES.md` now states that `dist/` is generated build output, not source-of-truth content expected in a fresh checkout, and makes test-placement/policy language explicit]
- [x] CHK-532 [P0] All retained `dist/` references are reconciled with current build/runtime behavior, and stale references are removed or redirected to canonical source docs. [EVIDENCE: retained `dist/` references were reconciled across `.opencode/skill/system-spec-kit/ARCHITECTURE_BOUNDARIES.md`, `.opencode/skill/system-spec-kit/mcp_server/README.md`, `.opencode/skill/system-spec-kit/mcp_server/scripts/README.md`, `.opencode/skill/system-spec-kit/shared/README.md`, and `.opencode/skill/system-spec-kit/mcp_server/hooks/README.md` to the same generated-build policy]

### P1 Required (complete or approved deferral)

- [x] CHK-540 [P1] README drift fixes cite the exact files updated and the canonical documents they now align to. [EVIDENCE: exact README files updated were `.opencode/skill/system-spec-kit/mcp_server/README.md`, `.opencode/skill/system-spec-kit/mcp_server/scripts/README.md`, `.opencode/skill/system-spec-kit/shared/README.md`, and `.opencode/skill/system-spec-kit/mcp_server/hooks/README.md`; they now align to `.opencode/skill/system-spec-kit/ARCHITECTURE_BOUNDARIES.md` and the documented wrapper/operator policy]
- [x] CHK-541 [P1] Verification evidence for strict-pass remediation is captured in this checklist with command/file evidence for each completed Phase 8 item. [EVIDENCE: `tasks.md` records T091-T099 closure notes; this checklist records CHK-530 through CHK-550 evidence; `implementation-summary.md` includes a dedicated "Phase 8 Closure (2026-03-06)" section with outcome and verification details]
- [x] CHK-542 [P1] Spec validation is re-run after Phase 8 remediation and recorded here with final exit code and any warnings. [EVIDENCE: `python3 .opencode/skill/sk-doc/scripts/validate_document.py` passed for the edited README files; `.opencode/skill/system-spec-kit/scripts/spec/validate.sh "specs/02--system-spec-kit/022-hybrid-rag-fusion/012-architecture-audit"` rerun completed with exit code 0 and no warnings]

### P2 Nice-to-Have

- [x] CHK-550 [P2] Dist-reference reconciliation includes a short inventory of intentionally retained generated-artifact references for future drift checks. [EVIDENCE: retained generated-artifact references are limited to `.opencode/skill/system-spec-kit/ARCHITECTURE_BOUNDARIES.md`, `.opencode/skill/system-spec-kit/mcp_server/README.md`, `.opencode/skill/system-spec-kit/mcp_server/scripts/README.md`, `.opencode/skill/system-spec-kit/shared/README.md`, and `.opencode/skill/system-spec-kit/mcp_server/hooks/README.md`; each now states the same generated-build-output policy]
<!-- /ANCHOR:phase-8-strict-pass -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Notes |
|----------|-------|----------|-------|
| P0 Items (Phases 0-3) | 8 | 8/8 | All original P0 items verified |
| P1 Items (Phases 0-3) | 17 | 17/17 | Includes Phase 2b doc backfill checks CHK-433 through CHK-435 |
| P2 Items (Phases 0-3) | 4 | 4/4 | CHK-023, CHK-042, CHK-103, CHK-112 completed |
| P0 Items (Phase 4 Review) | 4 | 4/4 | All P0 blockers resolved |
| P1 Items (Phase 4 Review) | 12 | 12/12 | All P1 should-fix items resolved |
| P2 Items (Phase 4 Review) | 7 | 7/7 | Includes ADR-003 documentation backfill check CHK-436 |
| P0 Items (Phase 5 Enforcement) | 3 | 3/3 | CHK-300 through CHK-302 completed |
| P1 Items (Phase 5 Enforcement) | 2 | 2/2 | CHK-303 and CHK-304 completed |
| P0 Items (Phase 6 Parity) | 6 | 6/6 | Includes learned-feedback single-weighting verification (CHK-437) |
| P1 Items (Phase 6 Parity) | 11 | 11/11 | Includes required parity checks CHK-410-415, quality gates CHK-430-432, and closure backfills CHK-438-439 |
| P2 Items (Phase 6 Parity) | 1 | 1/1 | Stale implementation-detail + metadata consistency checks complete |
| P0 Items (Phase 7 Carry-Over) | 3 | 3/3 | Final verification and CI enforcement completed on 2026-03-06 |
| P1 Items (Phase 7 Carry-Over) | 5 | 5/5 | Migration, exception governance, and docs synchronization completed |
| P2 Items (Phase 7 Carry-Over) | 3 | 0/3 | Intentionally left optional and pending |
| P0 Items (Phase 8 Strict-Pass) | 3 | 3/3 | README drift, boundary/dist policy, and dist-reference reconciliation verified |
| P1 Items (Phase 8 Strict-Pass) | 3 | 3/3 | Evidence capture and post-remediation validation recorded |
| P2 Items (Phase 8 Strict-Pass) | 1 | 1/1 | Retained-reference inventory captured for future drift checks |

**Original Verification Date**: 2026-03-04
**Review Findings Added**: 2026-03-04
**Phase 4 Remediation Completed**: 2026-03-04
**Phase 6 Parity Plan Added**: 2026-03-04
**Phase 6 P0 Code Fixes Completed**: 2026-03-04
**Phase 6 Parity Closure Completed**: 2026-03-04
**Spec 030 Merge Date**: 2026-03-05
**Phase 7 Closure Completed**: 2026-03-06
**Phase 8 Planning Added**: 2026-03-06
**Phase 8 Closure Completed**: 2026-03-06
<!-- /ANCHOR:summary -->
