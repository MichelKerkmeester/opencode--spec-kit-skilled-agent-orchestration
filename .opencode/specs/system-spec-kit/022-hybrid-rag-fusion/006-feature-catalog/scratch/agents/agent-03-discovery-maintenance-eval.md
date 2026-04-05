I’m auditing the seven feature-catalog docs against the actual `system-spec-kit` scripts and tool surfaces, then I’ll summarize exact mismatches per file.

● memory_match_triggers
  └ {"summary":"Matched 3 memories via trigger phrases","data":{"matchType":"trig...

● Run skill advisor (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Review ALL .md files in
  │ .opencode/skill/system-spec-kit/feature_catalog/03--discovery/, 04--maintenance/, and
  │ 07--evaluation/ for alignment against .opencode/skill/system-spec-kit/scripts/ source code. Flag
  │ mismatches in described tool/feature names and parameters." --threshold 0.8
  └ 51 lines...

I’ve got the target folders and I’m switching from broad setup into a file-by-file evidence pass against the actual script/tool definitions.

● skill(sk-code-review)

I’m pulling the seven catalog entries and the relevant script/tool definitions together so I can compare each doc against the real interface instead of spot-checking.

● Search (grep)
  │ "memory_(search|quick_search|match_triggers|index_scan|health|stats|get_learning_history|ingest_
  │ start|ingest_status|ingest_cancel|save|list|delete|update|validate|bulk_delete)|task_(preflight|
  │ postflight)|eval_(run_ablation|reporting_dashboard)" in **/*.{ts,js,py,json,jsonc,md}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 9 lines found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/07--evaluation/*.md"
  └ 2 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/03--discovery/*.md"
  └ 3 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/04--maintenance/*.md"
  └ 2 files found

● search feature catalog docs for discovery maintenance evaluation tools and the source code that d…
  └ {"success":true,"results":[],"total_returned":0,"offset":0,"message":null}

● Read 01-memory-browser-memorylist.md
  │ .opencode/skill/system-spec-kit/feature_catalog/03--discovery/01-memory-browser-memorylist.md
  └ 52 lines read

● Read 02-system-statistics-memorystats.md
  │ .opencode/skill/system-spec-kit/feature_catalog/03--discovery/02-system-statistics-memorystats.m
  │ d
  └ 57 lines read

● Read 03-health-diagnostics-memoryhealth.md
  │ .opencode/skill/system-spec-kit/feature_catalog/03--discovery/03-health-diagnostics-memoryhealth
  │ .md
  └ 59 lines read

● Read 01-workspace-scanning-and-indexing-memoryindexscan.md
  │ .opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexi
  │ ng-memoryindexscan.md
  └ 228 lines read

● Read 02-startup-runtime-compatibility-guards.md
  │ .opencode/skill/system-spec-kit/feature_catalog/04--maintenance/02-startup-runtime-compatibility
  │ -guards.md
  └ 51 lines read

● Read 01-ablation-studies-evalrunablation.md
  │ .opencode/skill/system-spec-kit/feature_catalog/07--evaluation/01-ablation-studies-evalrunablati
  │ on.md
  └ 68 lines read

● Read 02-reporting-dashboard-evalreportingdashboard.md
  │ .opencode/skill/system-spec-kit/feature_catalog/07--evaluation/02-reporting-dashboard-evalreport
  │ ingdashboard.md
  └ 63 lines read

I’ve read the catalog entries; now I’m checking the handler and schema code directly to verify the documented parameters, modes, and behaviors line-by-line.

● Read tool-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
  └ 1 line read

● Search (grep)
  │ "memory_list|memory_stats|memory_health|memory_index_scan|eval_run_ablation|eval_reporting_dashb
  │ oard|reportMode|includeChunks|folderRanking|excludePatterns|includeScores|includeArchived|autoRe
  │ pair|confirmed|mode|channels|queries|groundTruthQueryIds|recallK|storeResults|includeFormattedRe
  │ port|sprintFilter|channelFilter|metricFilter|format|limit" in **/*.{ts,js,json,jsonc}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "startup-checks|node-version-marker|SQLite|sqlite_version|3\.35\.0|EX-035" in
  │ **/*.{ts,js,json,jsonc,md} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Read tool-input-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
  └ 1 line read

● Search (grep)
  │ "memory_list|memory_stats|memory_health|memory_index_scan|eval_run_ablation|eval_reporting_dashb
  │ oard" (.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts)
  └ 7 lines found

● Search (grep)
  │ "memory_list|memory_stats|memory_health|memory_index_scan|eval_run_ablation|eval_reporting_dashb
  │ oard" (.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts)
  └ 12 lines found

● Search (grep)
  │ "startup-checks|node-version-marker|3\.35\.0|sqlite_version\(|EX-035"
  │ (.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts)
  └ 6 lines found

● Search (grep)
  │ "memory_list|memory_stats|memory_health|memory_index_scan|eval_run_ablation|eval_reporting_dashb
  │ oard" (.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts)
  └ 6 lines found

● Search (grep)
  │ "memory_list|memory_stats|memory_health|memory_index_scan|eval_run_ablation|eval_reporting_dashb
  │ oard" (.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts)
  └ 4 lines found

● Read tool-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
  └ L215:280 (66 lines read)

● Read tool-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
  └ L495:575 (81 lines read)

● Read tool-input-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
  └ L1:180 (180 lines read)

● Read tool-input-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
  └ L180:360 (181 lines read)

● Read tool-input-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
  └ L360:520 (161 lines read)

● Read startup-checks.ts
  │ .opencode/skill/system-spec-kit/mcp_server/startup-checks.ts
  └ L1:220 (161 lines read)

I’ve verified the public tool schemas. I’m now checking the handlers for the behavioral claims that the docs make, so the final statuses reflect both parameter alignment and real runtime behavior.

● Read memory-crud-health.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts
  └ L1:360 (360 lines read)

● Read memory-crud-list.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts
  └ L1:260 (187 lines read)

● Read memory-crud-stats.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts
  └ L1:320 (320 lines read)

● Read memory-index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts
  └ L1:420 (420 lines read)

● Read eval-reporting.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts
  └ L1:360 (354 lines read)

● Search (grep)
  │ "function handleMemoryHealth|status:
  │ |embeddingRetry|autoRepair|confirmed|divergentAliasGroups|provider|uptime|version"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts)
  └ 47 lines found

● Search (grep)
  │ "debug.*INDEX_SCAN|SPECKIT_DEBUG_INDEX_SCAN|mtimeUpdates|aliasConflicts|divergenceReconcile|trig
  │ ger matcher|runPostMutationHooks|setLastScanTime"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts)
  └ 25 lines found

● Search (grep)
  │ "getEvalDb|initEvalDb|SPECKIT_DASHBOARD_LIMIT|isHigherBetter|sprintLabel|eval_channel_results|ev
  │ al_metric_snapshots"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts)
  └ 17 lines found

● Search (grep)
  │ "try\s*\{|sign test|binomial|storeAblationResults|eval_metric_snapshots|token|SPECKIT_ABLATION|g
  │ roundTruthQueryIds|queries"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts)
  └ 74 lines found

✗ Search (grep)
  │ "context-server|startup checks|detectNodeVersionMismatch|checkSqliteVersion"
  │ (.opencode/skill/system-spec-kit/mcp_server/{context-server.ts,cli.ts})
  └ rg: /Users/michelkerkmeester/MEGA/Development/Opencode
    Env/Public/.opencode/skill/system-spec-kit/mcp_server/{context-server.ts,cli.ts}: IO error for
    operation on /Users/michelkerkmeester/MEGA/Development/Opencode
    Env/Public/.opencode/skill/system-spec-kit/mcp_server/{context-server.ts,cli.ts}: No such file
    or directory (os error 2)

● Read memory-crud-health.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts
  └ L343:610 (259 lines read)

● Read memory-index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts
  └ L420:640 (221 lines read)

● Read reporting-dashboard.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts
  └ L1:520 (520 lines read)

● Search (glob)
  │ "**/{context-server.ts,cli.ts,modularization.vitest.ts,startup-checks.vitest.ts}" in
  │ .opencode/skill/system-spec-kit/mcp_server
  └ 4 files found

● Search (grep)
  │ "detectNodeVersionMismatch|checkSqliteVersion|startup-checks" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 33 lines found

● Read ablation-framework.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts
  └ L200:260 (61 lines read)

● Read ablation-framework.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts
  └ L300:620 (320 lines read)

● Read k-value-analysis.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts
  └ L1:260 (260 lines read)

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L760:950 (191 lines read)

● Read cli.ts
  │ .opencode/skill/system-spec-kit/mcp_server/cli.ts
  └ L470:500 (31 lines read)

● Search (grep)
  │ "partial" in **/vector-index*.ts (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 13 lines found

● Search (grep)
  │ "get_status_counts|getStatusCounts|get_stats\(|getStats\(" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 10 lines found

● Search (grep)
  │ "findSpecDocuments|spec\.md|plan\.md|tasks\.md|checklist\.md|decision-record\.md|implementation-
  │ summary\.md|research\.md|handover\.md|\.opencode/specs"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts)
  └ 15 lines found

● Search (grep)
  │ "function findMemoryFiles|findMemoryFiles\(|memory/.*\.md|\.opencode/specs|specs/\*\*/memory"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts)
  └ 2 lines found

● Read memory-index-discovery.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts
  └ L1:130 (130 lines read)

● Read memory-parser.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts
  └ L839:940 (80 lines read)

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/api/{eval.ts,index.ts}"
  └ 2 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/tests/{handler-memory-list-edge.vitest.ts,handler-me
  │ mory-crud.vitest.ts,memory-crud-extended.vitest.ts,handler-memory-stats-edge.vitest.ts,handler-m
  │ emory-health-edge.vitest.ts,handler-memory-index-cooldown.vitest.ts,handler-memory-index.vitest.
  │ ts,ablation-framework.vitest.ts,handler-eval-reporting.vitest.ts,k-value-optimization.vitest.ts,
  │ reporting-dashboard.vitest.ts,startup-checks.vitest.ts,modularization.vitest.ts,context-server.v
  │ itest.ts}"
  └ 14 files found

● Read mutation-hooks.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts
  └ L1:260 (106 lines read)

● Search (grep)
  │ "refreshTriggerCache|trigger
  │ cache|runPostMutationHooks\('scan'|mutation-feedback|memory-surface" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 54 lines found

● Read mutation-feedback.ts
  │ .opencode/skill/system-spec-kit/mcp_server/hooks/mutation-feedback.ts
  └ L1:260 (61 lines read)

● Search (grep)
  │ "CRITICAL|HARMFUL|negligible|verdict|classification"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts)
  └ 7 lines found

● Search (grep)
  │ "formattedReport|recommendation|critical|harmful|negligible"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts)
  └ 6 lines found

● Read reporting-dashboard.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts
  └ L520:660 (141 lines read)

● Read ablation-framework.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts
  └ L640:770 (131 lines read)

Quick note: the catalog entries don’t map to `scripts/` definitions directly; the authoritative implementations and schemas live in `mcp_server`, so I’m using those for the alignment check and treating `scripts/` as non-authoritative references.

● Search (grep)
  │ "excludePatterns" (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts)
  └ 8 lines found

● Search (grep)
  │ "memory_list|memory_stats|memory_health|memory_index_scan|eval_run_ablation|eval_reporting_dashb
  │ oard" in **/*.{ts,js,py,md,json,jsonc} (.opencode/skill/system-spec-kit/scripts)
  └ 1 line found

● Search (grep)
  │ "specs/\*\*/memory/\*\.md|memory/\*\.md|Workspace scanning and indexing" (.opencode/skill/system
  │ -spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md)
  └ 4 lines found

Note: `scripts/` only had incidental mentions for these surfaces; the authoritative tool definitions/handlers are in `mcp_server`, which I used for alignment.

`01-memory-browser-memorylist.md | ALIGNED | `memory_list` exists; params `limit, offset, specFolder, sortBy, includeChunks` and fallback/clamp behavior match schema + handler.`

`02-system-statistics-memorystats.md | PARTIAL | `memory_stats` exists with documented params, but `excludePatterns` is described as regex-based while the handler does case-insensitive substring matching, not regex.`

`03-health-diagnostics-memoryhealth.md | ALIGNED | `memory_health` exists; params `reportMode, limit, specFolder, autoRepair, confirmed` and both payload modes match.`

`01-workspace-scanning-and-indexing-memoryindexscan.md | PARTIAL | `memory_index_scan` exists with documented params, but the doc narrows discovery to `specs/**/memory/*.md`; source scans both `specs` and `.opencode/specs` memory folders and accepts `.txt` too.`

`02-startup-runtime-compatibility-guards.md | ALIGNED | Feature behavior matches: `.node-version-marker` guard, SQLite `3.35.0+` warning-only check, and startup wiring in `context-server.ts`/`cli.ts`.`

`01-ablation-studies-evalrunablation.md | ALIGNED | `eval_run_ablation` exists; params `mode, channels, queries, groundTruthQueryIds, recallK, storeResults, includeFormattedReport` and dual-mode behavior match.`

`02-reporting-dashboard-evalreportingdashboard.md | ALIGNED | `eval_reporting_dashboard` exists; params `sprintFilter, channelFilter, metricFilter, limit, format` and read-only dashboard behavior match.`

`SUMMARY: total=7, aligned=5, misaligned=0, partial=2, P0=0, P1=1, P2=1.`

