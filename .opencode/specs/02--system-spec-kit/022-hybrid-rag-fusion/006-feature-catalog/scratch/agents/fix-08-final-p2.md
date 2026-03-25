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

