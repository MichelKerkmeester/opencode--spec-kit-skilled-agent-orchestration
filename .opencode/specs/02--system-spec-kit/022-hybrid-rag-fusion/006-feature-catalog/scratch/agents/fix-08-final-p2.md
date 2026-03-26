● skill(sk-doc)

I’m gathering the target docs plus the backing source references so I can make tight, evidence-based edits in one pass. After that I’ll patch the files, validate them, and show the diffs.

● Read FEATURE_CATALOG_IN_SIMPLE_TERMS.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md
  └ 1 line read

● Read 06-cross-document-entity-linking.md
  │ .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/06-cross-document-ent
  │ ity-linking.md
  └ 57 lines read

● Read 07-tier-2-fallback-channel-forcing.md
  │ .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/07-tier-2-fallback-ch
  │ annel-forcing.md
  └ 46 lines read

● Read 03-observer-effect-mitigation.md
  │ .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/03-observer-effec
  │ t-mitigation.md
  └ 53 lines read

● Read 12-test-quality-improvements.md
  │ .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/12-test-quality-i
  │ mprovements.md
  └ 60 lines read

● memory_match_triggers
  └ {"summary":"Matched 3 memories via trigger phrases","data":{"matchType":"trig...

● Read 14-cross-ai-validation-fixes.md
  │ .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/14-cross-ai-valid
  │ ation-fixes.md
  └ 72 lines read

● Read 08-audit-phase-020-mapping-note.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/08-audit-phase-020-ma
  │ pping-note.md
  └ 10 lines read

● Read 01-category-stub.md
  │ .opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/01-category-stub.md
  └ 14 lines read

● Read 01-category-stub.md
  │ .opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/01-
  │ category-stub.md
  └ 13 lines read

● Run skill advisor (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Documentation remediation for system-spec-kit
  │ feature catalog files: trim over-broad source file lists, fix unverifiable claims and drift, add
  │ minimal H2 scaffold to category stubs and mapping note, strengthen links in
  │ FEATURE_CATALOG_IN_SIMPLE_TERMS.md" --threshold 0.8
  └ 43 lines...

● skill(system-spec-kit)

I found the target snippets and the likely source drift points. Next I’m checking the related code/file references, then I’ll patch the docs and validate the changed markdown.

● Edit
  └ Create ~/.copilot/session-state/b145fbc5-10f9-4324-ad29-bc2f90a4ec49/plan.md

● Read FEATURE_CATALOG_IN_SIMPLE_TERMS.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md
  └ L40:60 (21 lines read)

● Search (grep)
  │ "runEntityLinking|createEntityLinks|findCrossDocumentMatches|buildEntityCatalog" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 72 lines found

● Search (grep)
  │ "forceAllChannels" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 11 lines found

● Search (grep)
  │ "eval-logger|eval logger|EvalLogger|logShadowComparison|runShadowScoring" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 39 lines found

● Search (grep)
  │ "parent\.parent_id IS NULL|AND parent_id IS NULL|cache lookup moved before embedding readiness
  │ gate|embedding readiness gate|cache lookup|cache key" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 33 lines found

● Search (glob)
  │ "**/*{entity-linker,hybrid-search,eval-logger,post-insert,vector-index-queries,memory-search}*.{
  │ ts,js}" in .opencode/skill/system-spec-kit/mcp_server
  └ 17 files found

● Search (grep)
  │ "18\+ files updated|7027|7003|Test count adjusted|Additional fixes" in **/*.{md,ts,js}
  │ (.opencode/skill/system-spec-kit)
  └ 2 lines found

I’ve narrowed the remaining work to a few concrete doc drifts: one source-file list for entity linking, one for fallback forcing, the eval-logger scope, and two wording mismatches in the cross-AI fixes note. I’m checking the exact file-level evidence now so the edits stay minimal.

● Read post-insert.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts
  └ L1:220 (194 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L780:850 (71 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1400:1435 (36 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1884:1905 (22 lines read)

● Read eval-logger.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts
  └ L1:260 (252 lines read)

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L560:650 (91 lines read)

● Read vector-index-queries.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts
  └ L1348:1372 (25 lines read)

● Search (grep)
  │ "runEntityLinking|post-insert|entity linking" in **/*.vitest.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 20 lines found

● Search (grep)
  │ "forceAllChannels: true|Tier-2|fallback" in **/*.{vitest.ts,ts}
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 5 lines found

● Search (grep)
  │ "logSearchQuery|logChannelResult|logFinalResult|eval-logger" in **/*.vitest.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 73 lines found

● Search (grep)
  │ "forceAllChannels: true"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts)
  └ 1 line found

● Search (grep)
  │ "C138-P0-FB-T2|forceAllChannels: true"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts)
  └ 2 lines found

● Search (grep)
  │ "runEntityLinking|density guard skips entity linking|cross-doc links"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts)
  └ 5 lines found

● Search (grep)
  │ "runPostInsertEnrichment|entityLinking|runEntityLinking"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts)
  └ 4 lines found

● Search (grep)
  │ "cacheEnabled|cachedPayload|toolCache.get|waitForEmbeddingModel|isEmbeddingModelReady"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts)
  └ No matches found

I’ve confirmed the concrete anchors: `post-insert.ts` really is the save-time entity-linking entry point, Tier-2 forcing is centered in `hybrid-search.ts` with one directly related eval-reporting handoff, observer-effect logging lives in `eval-logger.ts`, and the cross-AI wording drift is exactly in `handlers/memory-search.ts` plus `parent.parent_id IS NULL` in `vector-index-queries.ts`. I’m patching the docs now.● Request failed due to a transient API error. Retrying...

I’ve got enough evidence to patch cleanly now. I’m updating only the listed docs, keeping the changes tight to the requested P2 cleanup and scaffold fixes.● Request failed due to a transient API error. Retrying...

● Read deferred-features-integration.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts
  └ L288:332 (44 lines read)

● Read hybrid-search.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts
  └ L760:920 (161 lines read)

● Read handler-eval-reporting.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts
  └ L292:312 (21 lines read)

● Search (grep)
  │ "cache|cached|bypassCache|toolCache|get<SearchCachePayload>|waitForEmbeddingModel|isEmbeddingMod
  │ elReady" in **/memory-search*.vitest.ts (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 14 lines found

● Search (grep)
  │ "parent\.parent_id IS NULL|orphaned chunk|orphaned_chunks|find_orphaned_chunks" in
  │ **/*.{vitest.ts,ts} (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ No matches found

● Read memory-search-ux-hooks.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts
  └ L1:220 (179 lines read)

● Read memory-search-eval-channels.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts
  └ L1:120 (119 lines read)

I’ve got enough evidence to patch cleanly now. I’m keeping the edits narrow: trimming the source/test lists, correcting the two drift notes, adding the missing H2 scaffolds, and converting the audit-phase prose into direct links.

● Edit
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/06-cross-documen
  │ t-entity-linking.md
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/07-tier-2-fallba
  │ ck-channel-forcing.md
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/03-observer-
  │ effect-mitigation.md
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/12-test-qual
  │ ity-improvements.md
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/14-cross-ai-
  │ validation-fixes.md
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/08-audit-phase-0
  │ 20-mapping-note.md
  │ Edit
  │ .opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/01-category-stub.md
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-feature
  │ s/01-category-stub.md
  └ Edit .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md

The patches are in. I’m doing a final verification pass now: checking the rendered markdown structure with the doc validator, then I’ll pull focused diffs so you can see exactly what changed.

● Show git diff for edited docs (shell)
  │ git --no-pager diff -- .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhanceme
  │ nts/06-cross-document-entity-linking.md .opencode/skill/system-spec-kit/feature_catalog/15--re
  │ trieval-enhancements/07-tier-2-fallback-channel-forcing.md .opencode/skill/system-spec-kit/fea
  │ ture_catalog/09--evaluation-and-measurement/03-observer-effect-mitigation.md .opencode/skill/s
  │ ystem-spec-kit/feature_catalog/09--evaluation-and-measurement/12-test-quality-improvements.md …
  └ 220 lines...

● Validate edited markdown files (shell)
  │ python3 .agents/skills/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/fea
  │ ture_catalog/15--retrieval-enhancements/06-cross-document-entity-linking.md
  │ >/tmp/validate_06.txt 2>&1; python3 .agents/skills/sk-doc/scripts/validate_document.py
  │ .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/07-tier-2-fallback-
  │ channel-forcing.md >/tmp/validate_07.txt 2>&1; python3 …
  └ 193 lines...

● Show diff 07-tier-2-fallback-channel-forcing.md
  │
  │ 25
  │ 26     | File | Layer | Role |
  │ 27     |------|-------|------|
  │ 28 -   | `mcp_server/lib/search/hybrid-search.ts` | Lib | Tiered fallback orchestration, sets
  │        `forceAllChannels: true` during Tier-2 degradation |
  │ 29 -   | `mcp_server/lib/search/channel-enforcement.ts` | Lib | Channel enforcement |
  │ 30 -   | `mcp_server/lib/search/channel-representation.ts` | Lib | Channel min-representation |
  │ 28 +  | `mcp_server/lib/search/hybrid-search.ts` | Lib | Tiered fallback orchestration that sets
  │        `forceAllChannels: true` during Tier-2 degradation for simple-routed queries |
  │ 29
  │ 30     ### Tests
  │ 31
  │ 32     | File | Focus |
  │ 33     |------|-------|
  │ 34     | `mcp_server/tests/hybrid-search.vitest.ts` | Regression `C138-P0-FB-T2` for Tier-2
  │        forced-channel fallback |
  │ 37 -   | `mcp_server/tests/channel-enforcement.vitest.ts` | Channel enforcement tests |
  │ 38 -   | `mcp_server/tests/channel-representation.vitest.ts` | Channel representation tests |
  │ 35
  │ 36     ---
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/07-tier-2-fallback-ch
    annel-forcing.md

● Show diff 06-cross-document-entity-linking.md
  │
  │ 35
  │ 36     | File | Layer | Role |
  │ 37     |------|-------|------|
  │ 38 -   | `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
  │ 39 -   | `mcp_server/lib/search/entity-linker.ts` | Lib | Cross-document entity linking |
  │ 40 -   | `mcp_server/lib/search/search-flags.ts` | Lib | Feature flag registry |
  │ 38 +   | `mcp_server/lib/search/entity-linker.ts` | Lib | Builds the entity catalog, finds
  │        cross-document matches, and creates `supports` edges with density-guard enforcement |
  │ 39 +  | `mcp_server/handlers/save/post-insert.ts` | Handler | Save-time enrichment path that
  │       invokes entity linking after entity extraction succeeds |
  │ 40
  │ 41     ### Tests
  │ 42
  │ 43     | File | Focus |
  │ 44     |------|-------|
  │ 46 -   | `mcp_server/tests/entity-linker.vitest.ts` | Entity linking tests |
  │ 47 -   | `mcp_server/tests/hybrid-search-flags.vitest.ts` | Hybrid search flag behavior |
  │ 48 -   | `mcp_server/tests/rollout-policy.vitest.ts` | Rollout policy tests |
  │ 49 -   | `mcp_server/tests/search-flags.vitest.ts` | Feature flag behavior |
  │ 45 +  | `mcp_server/tests/entity-linker.vitest.ts` | Unit coverage for catalog build, match
  │       discovery, link creation, and density-guard behavior |
  │ 46 +   | `mcp_server/tests/deferred-features-integration.vitest.ts` | End-to-end entity-linking
  │        integration through `runEntityLinking()` |
  │ 47
  │ 48     ---
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/06-cross-document-ent
    ity-linking.md

● Show diff 03-observer-effect-mitigation.md
  │
  │ 15
  │ 16     ## 2. CURRENT REALITY
  │ 17
  │ 18 -  Measurement infrastructure is implemented as fail-safe and best-effort rather than
  │       SLO-enforced runtime monitoring. The eval database and shadow-scoring helpers are designed
  │        so evaluation paths do not block production query flow, and shadow scoring write paths
  │       are disabled (`runShadowScoring` returns `null`, `logShadowComparison` returns `false`).
  │
  │ 18 +  Evaluation logging is implemented as fail-safe and best-effort rather than SLO-enforced
  │       runtime monitoring. The `eval-logger` hooks no-op unless `SPECKIT_EVAL_LOGGING=true` and
  │       degrade to non-fatal warnings on write failures, so evaluation paths do not block
  │       production query flow.
  │ 19
  │ 20    A formal p95 latency comparison (eval logging enabled vs disabled) and an automated ">10%
  │       overhead" alert are not implemented in the current code. Observer-effect control currently
  │        relies on fail-safe degradation and non-fatal handling in evaluation and observability
  │       paths.
  │ 21
  │ ────────────────────────────────────────────────────────────────────────────────────────────────
  │ 27
  │ 28     | File | Layer | Role |
  │ 29     |------|-------|------|
  │ 30 -   | `mcp_server/lib/eval/eval-db.ts` | Lib | Evaluation database |
  │ 31 -   | `mcp_server/lib/eval/shadow-scoring.ts` | Lib | Shadow scoring system |
  │ 30 +  | `mcp_server/lib/eval/eval-logger.ts` | Lib | Non-fatal evaluation logging hooks for
  │       query, per-channel, and final-result events |
  │ 31
  │ 32     ### Tests
  │ 33
  │ 34     | File | Focus |
  │ 35     |------|-------|
  │ 37 -   | `mcp_server/tests/eval-db.vitest.ts` | Eval database operations |
  │ 38 -   | `mcp_server/tests/scoring.vitest.ts` | General scoring tests |
  │ 39 -   | `mcp_server/tests/shadow-scoring.vitest.ts` | Shadow scoring tests |
  │ 36 +  | `mcp_server/tests/eval-logger.vitest.ts` | Disabled/no-op behavior plus non-fatal
  │       logging-path coverage |
  │ 37
  │ 38     ---
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/03-observer-effec
    t-mitigation.md

● Show diff 12-test-quality-improvements.md
  │
  │  1     ---
  │  2     title: "Test quality improvements"
  │  3 -  description: "Covers four targeted test quality fixes (timeout hardening, handle leak
  │       prevention, tautological test rewrites and duplicate removal) plus 18+ test file updates
  │       for changed source behavior."
  │  3 +  description: "Covers four targeted test quality fixes (timeout hardening, handle leak
  │       prevention, tautological test rewrites and duplicate removal) plus a specific
  │       test-alignment cleanup in `memory-parser.ts`."
  │  4     ---
  │  5
  │  6     # Test quality improvements
  │  7
  │  8     ## 1. OVERVIEW
  │  9
  │ 10 -  Covers four targeted test quality fixes (timeout hardening, handle leak prevention,
  │       tautological test rewrites and duplicate removal) plus 18+ test file updates for changed
  │       source behavior.
  │ 10 +  Covers four targeted test quality fixes (timeout hardening, handle leak prevention,
  │       tautological test rewrites and duplicate removal) plus a specific test-alignment cleanup
  │       in `memory-parser.ts`.
  │ 11
  │ 12    Tests are supposed to catch bugs, but some of these tests had their own problems. A few
  │       would pass even when the thing they tested was broken, others would leak resources and
  │       some were testing the wrong thing entirely. This round of fixes made the tests themselves
  │       more trustworthy, because a test suite you cannot trust is worse than no tests at all.
  │ 13
  │ ────────────────────────────────────────────────────────────────────────────────────────────────
  │ 25
  │ 26    **P2d:** A duplicate T007 test block was identified as pre-resolved (not present in
  │       current file).
  │ 27
  │ 28 -  **Additional fixes:** `memory-parser.ts` gained a `/z_archive/` exclusion in
  │       `isMemoryFile()` spec doc detection. 18+ test files were updated to match changed source
  │       behavior (reconsolidation, five-factor-scoring, working-memory, session-cleanup, channel
  │       tests, entity tests, extraction-adapter, intent-routing and others). Test count adjusted
  │       from 7,027 to 7,003 (24 tests for removed dead-code features were deleted).
  │ 28 +  **Additional fixes:** `memory-parser.ts` gained a `/z_archive/` exclusion in
  │       `isMemoryFile()` spec doc detection during the same test-alignment work.
  │ 29
  │ 30     ---
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/12-test-quality-i
    mprovements.md

● Show diff 14-cross-ai-validation-fixes.md
  │
  │ 20     - **CR-P0-1:** Test suite false-pass patterns. 21 silent-return guards converted to
  │        `it.skipIf()`, fail-fast imports with throw on required handler/vectorIndex missing.
  │ 21    - **CR-P1-1:** Deletion exception propagation. Causal edge cleanup errors in single-delete
  │        now propagate (previously swallowed).
  │ 22     - **CR-P1-2:** Re-sort after feedback mutations before top-K slice in Stage 2 fusion.
  │ 23 -   - **CR-P1-3:** Dedup queries gained `AND parent_id IS NULL` to exclude chunk rows.
  │ 23 +   - **CR-P1-3:** Dedup/orphan queries gained parent-scoped filters, including `AND
  │        parent.parent_id IS NULL`, to exclude chunk rows.
  │ 24     - **CR-P1-4:** Session dedup `id != null` guards against undefined collapse.
  │ 25     - **CR-P1-5:** Cache lookup moved before embedding readiness gate in search handler.
  │ 26     - **CR-P1-6:** Partial-update DB mutations wrapped inside transaction.
  │ ────────────────────────────────────────────────────────────────────────────────────────────────
  │ 39     | File | Layer | Role |
  │ 40     |------|-------|------|
  │ 41    | `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Lib | Re-sort behavior after
  │       feedback mutations before top-K slicing |
  │ 42 -  | `mcp_server/lib/search/vector-index-queries.ts` | Lib | Dedup query hardening with
  │       `parent_id IS NULL` filters |
  │ 42 +  | `mcp_server/lib/search/vector-index-queries.ts` | Lib | Dedup/orphan query hardening
  │       with `parent.parent_id IS NULL` filters |
  │ 43    | `mcp_server/lib/search/evidence-gap-detector.ts` | Lib | `Number.isFinite` guards for
  │       score safety |
  │ 44    | `mcp_server/lib/eval/reporting-dashboard.ts` | Lib | Dashboard row-limit configurability
  │        (`SPECKIT_DASHBOARD_LIMIT`) |
  │ 45    | `mcp_server/lib/storage/transaction-manager.ts` | Lib | Transaction safety for
  │       partial-update mutation paths |
  │ 46    | `mcp_server/lib/storage/causal-edges.ts` | Lib | Deletion-path error propagation
  │       hardening |
  │ 47 -   | `mcp_server/lib/search/hybrid-search.ts` | Lib | Search-handler flow fixes including
  │        cache-path ordering remediation |
  │ 47 +  | `mcp_server/handlers/memory-search.ts` | Handler | Search-handler flow fix moving cache
  │       lookup ahead of the embedding-readiness wait |
  │ 48
  │ 49     ### Tests
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/14-cross-ai-valid
    ation-fixes.md

● Show diff 08-audit-phase-020-mapping-note.md
  │
  │  5
  │  6     # Audit phase mapping note (020 feature-flag-reference)
  │  7
  │  8 +   ## 1. OVERVIEW
  │  9 +
  │ 10     Audit phase `020-feature-flag-reference` maps to this category by slug
  │        (`feature-flag-reference`).
  │ 11
  │ 12 +   ---
  │ 13 +
  │ 14 +   ## 2. CURRENT REALITY
  │ 15 +
  │ 16     The numeric prefixes are not the contract; matching is slug-based.
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/08-audit-phase-020-ma
    pping-note.md

● Show diff 01-category-stub.md
  │
  │  5
  │  6     # Remediation and revalidation (audit phase mapping)
  │  7
  │  8 +   ## 1. OVERVIEW
  │  9 +
  │ 10    This folder maps audit phase `021-remediation-revalidation`. No standalone feature entries
  │        are needed here because remediation features are covered as cross-category records:
  │
  │ 11
  │ 12    - [08--bug-fixes-and-data-integrity/06-guards-and-edge-cases.md](../08--bug-fixes-and-data
  │       -integrity/06-guards-and-edge-cases.md)
  │ 13    - [14--pipeline-architecture/07-search-pipeline-safety.md](../14--pipeline-architecture/07
  │       -search-pipeline-safety.md)
  │ 14    - [16--tooling-and-scripts/05-code-standards-alignment.md](../16--tooling-and-scripts/05-c
  │       ode-standards-alignment.md)
  │ 15
  │ 16 +   ---
  │ 17 +
  │ 18 +   ## 2. CURRENT REALITY
  │ 19 +
  │ 20     See the master catalog's **Audit Phase Coverage Notes** table for the full mapping.
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/01-category-stub.md

● Show diff 01-category-stub.md
  │
  │  5
  │  6     # Implement and remove deprecated features (audit phase mapping)
  │  7
  │  8 +   ## 1. OVERVIEW
  │  9 +
  │ 10    This folder maps audit phase `022-implement-and-remove-deprecated-features`. No standalone
  │        feature entries are needed here because implementation and deprecation features are
  │       covered by closure records:
  │ 11
  │ 12    - [16--tooling-and-scripts/04-dead-code-removal.md](../16--tooling-and-scripts/04-dead-cod
  │       e-removal.md)
  │ 13    - [17--governance/02-feature-flag-sunset-audit.md](../17--governance/02-feature-flag-sunse
  │       t-audit.md)
  │ 14
  │ 15 +   ---
  │ 16 +
  │ 17 +   ## 2. CURRENT REALITY
  │ 18 +
  │ 19     See the master catalog's **Audit Phase Coverage Notes** table for the full mapping.
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/01-
    category-stub.md

● Show diff FEATURE_CATALOG_IN_SIMPLE_TERMS.md
  │
  │ 45
  │ 46     | Audit phase | Where to find it |
  │ 47     |---|---|
  │ 48 -   | `020-feature-flag-reference` | Covered by `19--feature-flag-reference/` (slug match) |
  │ 49 -  | `021-remediation-revalidation` | Spread across bug-fix, pipeline-safety, and
  │       code-standards categories |
  │ 50 -   | `022-implement-and-remove-deprecated-features` | Covered by dead-code-removal and
  │        feature-flag-sunset entries |
  │ 48 +  | `020-feature-flag-reference` | [`19--feature-flag-reference/08-audit-phase-020-mapping-n
  │       ote.md`](./19--feature-flag-reference/08-audit-phase-020-mapping-note.md) |
  │ 49 +  | `021-remediation-revalidation` | [`20--remediation-revalidation/01-category-stub.md`](./
  │       20--remediation-revalidation/01-category-stub.md) plus the linked bug-fix,
  │       pipeline-safety, and code-standards records |
  │ 50 +  | `022-implement-and-remove-deprecated-features` |
  │       [`21--implement-and-remove-deprecated-features/01-category-stub.md`](./21--implement-and-r
  │       emove-deprecated-features/01-category-stub.md) plus the linked dead-code-removal and
  │       feature-flag-sunset records |
  │ 51
  │ 52     ### Command-Surface Contract
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md

Done. I remediated all 9 requested docs in `.opencode/skill/system-spec-kit/feature_catalog/`:

- Trimmed over-broad source/test lists in the entity-linking, tier-2 fallback, and observer-effect docs.
- Removed the unverifiable `18+ files` / `7027 -> 7003` claims while keeping the specific fix notes.
- Corrected the cross-AI drift to `handlers/memory-search.ts` and `parent.parent_id IS NULL`.
- Added minimal numbered H2 scaffolds to the three orphan docs.
- Added direct links from `FEATURE_CATALOG_IN_SIMPLE_TERMS.md` to the audit-phase stub docs.

I also showed the diffs above. Validation ran, but the doc validator reports pre-existing TOC/anchor-policy issues in these catalog files.

