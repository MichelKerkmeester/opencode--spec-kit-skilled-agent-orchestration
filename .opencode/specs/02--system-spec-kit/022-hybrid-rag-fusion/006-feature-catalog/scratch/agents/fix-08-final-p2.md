● skill(sk-doc)

I’m gathering the target docs plus the backing source references so I can make tight, evidence-based edits in one pass. After that I’ll patch the files, validate them, and show the diffs.

● Read feature_catalog_in_simple_terms.md
  │ .opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md
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
  │ feature_catalog_in_simple_terms.md" --threshold 0.8
  └ 43 lines...

● skill(system-spec-kit)

I found the target snippets and the likely source drift points. Next I’m checking the related code/file references, then I’ll patch the docs and validate the changed markdown.

● Edit
  └ Create ~/.copilot/session-state/b145fbc5-10f9-4324-ad29-bc2f90a4ec49/plan.md

● Read feature_catalog_in_simple_terms.md
  │ .opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md
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

