● skill(system-spec-kit)

I’m reviewing the six catalog entries against the actual implementation files first, then I’ll make tight doc-only edits and verify the diffs.

● memory_match_triggers
  └ {"summary":"Matched 3 memories via trigger phrases","data":{"matchType":"trig...

● Run skill advisor (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Fix P2 issues in six system-spec-kit feature
  │ catalog markdown files by trimming over-broad Source Files/Tests sections and adding one missing
  │ retrieval wiring file." --threshold 0.8
  └ 43 lines...

● Create session plan (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/cea6622b-c1ed-4baa-badc-253419f51391/plan.md'
  │ <<'EOF'
  │ # Plan
  │ 1. Read the six target feature catalog files and inspect their Source Files/Tests sections.…
  └ 7 lines...

● skill(sk-doc)

I’ve got the skill context loaded. Next I’m comparing each catalog entry to the actual implementation and tests so the trims stay conservative and grounded in code.

● Read 05-pre-storage-quality-gate.md
  │ .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/05-pre-storage-q
  │ uality-gate.md
  └ 121 lines read

● Read 06-reconsolidation-on-save.md
  │ .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/06-reconsolidati
  │ on-on-save.md
  └ 158 lines read

● Read 14-quality-gate-timer-persistence.md
  │ .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/14-quality-gate-
  │ timer-persistence.md
  └ 96 lines read

● Read 01-dual-scope-memory-auto-surface.md
  │ .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/01-dual-scope-memory-
  │ auto-surface.md
  └ 101 lines read

● Read 03-spec-folder-hierarchy-as-retrieval-structure.md
  │ .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/03-spec-folder-hierar
  │ chy-as-retrieval-structure.md
  └ 46 lines read

● Read 04-lightweight-consolidation.md
  │ .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/04-lightweight-consol
  │ idation.md
  └ 64 lines read

I’ve isolated the current catalog entries. Now I’m tracing the real wiring in `mcp_server` so I only keep files that clearly participate in each feature.

● Search (grep)
  │ "save-quality-gate|quality
  │ gate|INSUFFICIENT_CONTEXT_ABORT|memory-template-contract|memory-sufficiency" in **/*.{ts,tsx}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "reconsolidat" in **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server)
  └ 93 lines found

● Search (grep)
  │ "autoSurfaceMemories|autoSurfaceAtCompaction|memory-surface|retrieval-directives|trigger-matcher
  │ " in **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "spec-folder-hierarchy|buildHierarchyTree|queryHierarchyMemories|invalidateHierarchyCache" in
  │ **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server)
  └ 53 lines found

● Search (grep)
  │ "consolidation|CONSOLIDATION_INTERVAL_DAYS|n3lite|weight_history" in **/*.{ts,tsx}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

I’ve confirmed the hierarchy feature is wired through `graph-search-fn.ts`, which gives me the missing file to add. I’m doing one more focused pass on save-quality, auto-surface, and consolidation wiring before patching the docs.

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L430:570 (141 lines read)

● Read save-quality-gate.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts
  └ L1:260 (260 lines read)

● Read reconsolidation-bridge.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts
  └ L1:260 (260 lines read)

● Read reconsolidation.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts
  └ L1:220 (220 lines read)

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L1:260 (260 lines read)

● Read memory-surface.ts
  │ .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts
  └ L1:260 (260 lines read)

● Read spec-folder-hierarchy.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts
  └ L1:340 (299 lines read)

● Read graph-search-fn.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts
  └ L1:180 (180 lines read)

● Read consolidation.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts
  └ L1:320 (320 lines read)

● Search (grep)
  │ "runConsolidation|consolidat(e|ion)|CONSOLIDATION_INTERVAL_DAYS" in **/*.{ts,tsx}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Read consolidation.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts
  └ L320:520 (201 lines read)

● Read mutation-hooks.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts
  └ L1:260 (106 lines read)

I found the consolidation engine itself, but I still need the exact call site for the “runtime hook” so I can list the right wiring file instead of nearby storage modules.

● Search (grep)
  │ "runConsolidationCycleIfEnabled" in **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server)
  └ 11 lines found

● Search (grep)
  │ "registerAfterToolCallback\(|runPostMutationHooks\(" in **/*.{ts,tsx}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 20 lines found

● Search (grep)
  │ "autoSurfaceAtToolDispatch\(|autoSurfaceAtCompaction\(|autoSurfaceMemories\("
  │ (.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
  └ 3 lines found

● Read response-builder.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts
  └ L400:455 (49 lines read)

● Search (grep)
  │ "save-quality-gate|quality
  │ gate|qualityGateActivatedAt|isWarnOnlyMode|setActivationTimestamp|ACTIVATION_CONFIG_KEY" in
  │ **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 87 lines found

● Search (grep)
  │ "autoSurfaceAtToolDispatch|autoSurfaceAtCompaction|autoSurfaceMemories|extractContextHint|MEMORY
  │ _AWARE_TOOLS" in **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 5 lines found

● Search (grep)
  │ "queryHierarchyMemories|buildHierarchyTree|invalidateHierarchyCache|hierarchy"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts)
  └ 3 lines found

● Search (grep)
  │ "consolidation|runConsolidationCycleIfEnabled" in **/*.{ts,tsx}
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 5 lines found

I’ve got enough implementation evidence for the first five entries. I’m doing a quick test-file sweep so the “Tests” sections shrink with the same conservative standard as the source lists.

● Search (glob)
  │ "**/*memory-surface*.vitest.ts" in .opencode/skill/system-spec-kit/mcp_server/tests
  └ No matches found

● Search (glob)
  │ "**/*reconsolid*.vitest.ts" in .opencode/skill/system-spec-kit/mcp_server/tests
  └ 3 files found

● Search (glob)
  │ "**/*quality-gate*.vitest.ts" in .opencode/skill/system-spec-kit/mcp_server/tests
  └ 4 files found

● Search (glob)
  │ "**/*context-server*.vitest.ts" in .opencode/skill/system-spec-kit/mcp_server/tests
  └ 1 file found

● Search (glob)
  │ "**/*spec-folder-hierarchy*.vitest.ts" in .opencode/skill/system-spec-kit/mcp_server/tests
  └ 1 file found

● Search (glob)
  │ "**/*graph-search-fn*.vitest.ts" in .opencode/skill/system-spec-kit/mcp_server/tests
  └ 1 file found

● Search (glob)
  │ "**/*n3lite-consolidation*.vitest.ts" in .opencode/skill/system-spec-kit/mcp_server/tests
  └ 1 file found

● Search (grep)
  │ "autoSurfaceAtToolDispatch|autoSurfaceAtCompaction|autoSurfaceMemories|extractContextHint|MEMORY
  │ _AWARE_TOOLS" (.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts)
  └ 80 lines found

● Search (grep)
  │ "autoSurfaceAtToolDispatch|autoSurfaceAtCompaction|autoSurfaceMemories|extractContextHint|MEMORY
  │ _AWARE_TOOLS" in **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 5 lines found

● Search (grep)
  │ "runConsolidationCycleIfEnabled|N3-lite consolidation|consolidation" in **/*.{ts,tsx}
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 5 lines found

● Search (grep)
  │ "response-builder|N3-lite consolidation|runConsolidationCycleIfEnabled" in **/*.{ts,tsx}
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 14 lines found

● Search (glob)
  │ "**/*response-builder*.vitest.ts" in .opencode/skill/system-spec-kit/mcp_server/tests
  └ No matches found

I’ve got the final keep/remove sets. I’m patching the six docs now, keeping the edits surgical so only the relevant source/test rows change.

● Edit
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/05-pre-stor
  │ age-quality-gate.md
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/06-reconsol
  │ idation-on-save.md
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/14-quality-
  │ gate-timer-persistence.md
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/01-dual-scope-me
  │ mory-auto-surface.md
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/03-spec-folder-h
  │ ierarchy-as-retrieval-structure.md
  └ Edit .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/04-lightweight-c
    onsolidation.md

The patch is in. I’m doing a diff-only verification pass now to catch any formatting issues and make sure each table says exactly what I intended.

● Check whitespace and review diffs (shell)
  │ git --no-pager diff --check -- '.opencode/skill/system-spec-kit/feature_catalog/13--memory-qua
  │ lity-and-indexing/05-pre-storage-quality-gate.md' '.opencode/skill/system-spec-kit/feature_cat
  │ alog/13--memory-quality-and-indexing/06-reconsolidation-on-save.md' '.opencode/skill/system-sp
  │ ec-kit/feature_catalog/13--memory-quality-and-indexing/14-quality-gate-timer-persistence.md'
  │ '.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/01-dual-scope-memo…
  └ 17 lines...

● Read copilot-tool-output-1774462577272-0a6otn.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774462577272-0a6otn.txt
  └ L1:260 (249 lines read)

● Read copilot-tool-output-1774462577272-0a6otn.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774462577272-0a6otn.txt
  └ L247:360 (97 lines read)

Done. I trimmed the catalog entries to the files/tests that are clearly feature-specific and verified formatting with `git diff --check`.

1. `05-pre-storage-quality-gate.md`
Kept only `lib/validation/save-quality-gate.ts` and `handlers/memory-save.ts`; tests now only `save-quality-gate.vitest.ts` and `handler-memory-save.vitest.ts`.

2. `06-reconsolidation-on-save.md`
Reduced to `handlers/memory-save.ts`, `handlers/save/db-helpers.ts`, `handlers/save/reconsolidation-bridge.ts`, `lib/search/search-flags.ts`, `lib/storage/causal-edges.ts`, `lib/storage/reconsolidation.ts`; tests now only `reconsolidation.vitest.ts` and `search-flags.vitest.ts`.

3. `14-quality-gate-timer-persistence.md`
Reduced to `lib/validation/save-quality-gate.ts` and `save-quality-gate.vitest.ts`.

4. `01-dual-scope-memory-auto-surface.md`
Source Files now only `context-server.ts` and `hooks/memory-surface.ts`; Tests now only `context-server.vitest.ts`.

5. `03-spec-folder-hierarchy-as-retrieval-structure.md`
Added missing wiring file `lib/search/graph-search-fn.ts`.

6. `04-lightweight-consolidation.md`
Added runtime hook `handlers/save/response-builder.ts`; removed unrelated modules; kept `search-flags.ts`, `causal-edges.ts`, `consolidation.ts`; tests now only `n3lite-consolidation.vitest.ts` and `search-flags.vitest.ts`.

