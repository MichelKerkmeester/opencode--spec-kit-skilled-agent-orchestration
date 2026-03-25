● skill(sk-code--review)

I’m going to cross-check the 12 catalog files against the actual `mcp_server` and `scripts` code, and I’ll use a parallel review pass plus direct spot-checking so the final alignment report is grounded in the code.

● Review Reviewing catalogs
  └ Agent started in background with agent_id: catalog-alignment. You can use rea...

● Create review tracking table (sql)
  │ CREATE TABLE IF NOT EXISTS catalog_review (file TEXT PRIMARY KEY, status TEXT, n…
  └ Schema operation completed successfully.

● Read feature_catalog.md
  │ .opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md
  └ 1 line read

● Read feature_catalog_in_simple_terms.md
  │ .opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md
  └ 1 line read

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/*.
  │ md"
  └ 1 file found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/*.md"
  └ 8 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/*.md"
  └ 1 file found

I’ve got the exact file set now. Next I’m reading the category files directly, then I’ll verify their claims against actual feature flags, tool exports, and scripts behavior.

● Read 01-1-search-pipeline-features-speckit.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-
  │ features-speckit.md
  └ 1 line read

● Read 02-2-session-and-cache.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/02-2-session-and-cach
  │ e.md
  └ 44 lines read

● Read 03-3-mcp-configuration.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/03-3-mcp-configuratio
  │ n.md
  └ 40 lines read

● Read 04-4-memory-and-storage.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/04-4-memory-and-stora
  │ ge.md
  └ 41 lines read

● Read 05-5-embedding-and-api.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/05-5-embedding-and-ap
  │ i.md
  └ 39 lines read

● Read 06-6-debug-and-telemetry.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/06-6-debug-and-teleme
  │ try.md
  └ 46 lines read

● Read 07-7-ci-and-build-informational.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/07-7-ci-and-build-inf
  │ ormational.md
  └ 39 lines read

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

● Search (grep)
  │ "^## " (.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md)
  └ 22 lines found

● Search (grep)
  │ "^## " (.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md)
  └ 22 lines found

● Search (grep)
  │ "^#|^##|^###" (.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-s
  │ earch-pipeline-features-speckit.md)
  └ 6 lines found

● Search (grep)
  │ "^\| `|^\| Name " (.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01
  │ -1-search-pipeline-features-speckit.md)
  └ 5 lines found

● Read feature_catalog.md
  │ .opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md
  └ L1:80 (79 lines read)

● Read feature_catalog.md
  │ .opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md
  └ L4368:4525 (77 lines read)

● Read feature_catalog_in_simple_terms.md
  │ .opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md
  └ L1:80 (79 lines read)

● Read feature_catalog_in_simple_terms.md
  │ .opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md
  └ L1023:1120 (29 lines read)

I’ve confirmed both master indexes still expose 21 top-level sections. Now I’m validating the specific feature-flag claims and command/tool counts against the real code so the per-file statuses aren’t just doc-to-doc comparisons.

● Read 01-1-search-pipeline-features-speckit.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-
  │ features-speckit.md
  └ L21:155 (72 lines read)

● Search (grep)
  │ "allowed-tools:" (.opencode/command/memory)
  └ 6 lines found

● Search (grep)
  │ "process\.env\.[A-Z0-9_]+|getEnv[A-Za-z]*\(['\"]([A-Z0-9_]+)['\"]|parse[A-Za-z]*Env\(['\"]([A-Z0
  │ -9_]+)['\"]" in *.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "process\.env\.[A-Z0-9_]+|getEnv[A-Za-z]*\(['\"]([A-Z0-9_]+)['\"]|parse[A-Za-z]*Env\(['\"]([A-Z0
  │ -9_]+)['\"]" in *.{ts,js,sh,py} (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

