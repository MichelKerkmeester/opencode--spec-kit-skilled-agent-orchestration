● skill(sk-code--review)

I’m mapping the catalog structure first, then I’ll cross-check sampled features and tool names against the MCP server so the final report is evidence-backed.

● Search (grep)
  │ "^#|^##|^###" (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ 5 lines found

● Read review_core.md
  │ .agents/skills/sk-code--review/references/review_core.md
  └ L1:220 (98 lines read)

● Read review_ux_single_pass.md
  │ .agents/skills/sk-code--review/references/review_ux_single_pass.md
  └ L1:220 (82 lines read)

● Search (glob)
  │ "**/*" in .opencode/skill/system-spec-kit/mcp_server
  └ 5 files found

I’ve got the review rubric loaded. Next I’m indexing the catalog categories and the MCP tool registry so I can sample each section consistently instead of cherry-picking.

● Search (glob)
  │ "**/*" in .opencode/skill/system-spec-kit/feature_catalog
  └ 5 files found

● Search (grep)
  │ "^#{1,6} .*" (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ 5 lines found

● Search (grep)
  │ "server\.tool\(|registerTool\(|tool\(|name:\s*['\"]" in *.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 41 files found

● Search (grep)
  │ "feature_catalog_code|feature catalog" in *.md
  └ 5 lines found

● Read tool-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
  └ L1:260 (257 lines read)

● Search (glob)
  │ "*.md" in .opencode/skill/system-spec-kit/feature_catalog
  └ 5 files found

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L1:260 (259 lines read)

I’ve confirmed the MCP server registers tools through `tool-schemas.ts`. Now I’m extracting the catalog’s category map so each spot-check is tied to a specific claim, not just a filename.

● Create review tracking tables (sql)
  │ CREATE TABLE IF NOT EXISTS category_checks (category TEXT PRIMARY KEY, claimed_s…
  └ Executed 2 statement(s)

✗ Read README.md
  │ .opencode/skill/system-spec-kit/feature_catalog/README.md
  └ Path does not exist

● Parse catalog headings and files (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog')…
  └ 23 lines...

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L1:260 (190 lines read)

● Find category headings in catalog (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ master = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md')…
  └ 7 lines...

● Summarize category files (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog')…
  └ 15 lines...

● Search (glob)
  │ "**/*.md" in .opencode/skill/system-spec-kit/feature_catalog
  └ 5 files found

● Find top-level numbered sections (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ master = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md')…
  └ 28 lines...

● List feature headings from master (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ master = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md')…
  └ 230 lines...

The master catalog structure is clear now: 21 top-level sections with feature headings inside each. I’m switching from structure mapping to evidence collection so each category gets 2–3 code-backed spot checks.

● Search (grep)
  │ "TOOL_DEFINITIONS|export const TOOL_DEFINITIONS|const TOOL_DEFINITIONS"
  │ (.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts)
  └ 1 line found

● Search (grep)
  │ "33 tools|exposes \*\*33 tools\*\*|Key tools:" in **/*.{md,ts} (.opencode/skill/system-spec-kit)
  └ 16 lines found

● List feature catalog subdirs (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog')
  │ for path in sorted(root.iterdir()):…
  └ 27 lines...

I found the actual review scope the user meant: the numbered category folders `01--retrieval` through `21--implement-and-remove-deprecated-features`, not just the master section numbers. I’m sampling directly from those source files now, then validating each sampled claim against code.

● Read 01-unified-context-retrieval-memorycontext.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memor
  │ ycontext.md
  └ L1:220 (220 lines read)

✗ Read 18-feature-catalog-code-references.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/18-feature-catalog-code-
  │ references.md
  └ Path does not exist

● List sample feature files per category (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog')…
  └ 124 lines...

● Read 01-category-stub.md
  │ .opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/01-category-stub.md
  └ L1:220 (10 lines read)

● Search (grep)
  │ "\b(implemented|planned|deferred)\b" in **/*.md
  │ (.opencode/skill/system-spec-kit/feature_catalog)
  └ 5 lines found

● Read 01-category-stub.md
  │ .opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/01-
  │ category-stub.md
  └ L1:220 (10 lines read)

I have the category list and a sampling plan. I’m now doing two parallel checks: one for cataloged tool names vs the MCP registry, and one for feature evidence in code so the final report can distinguish “exists” from “documented only.”

● Read tool-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
  └ L580:626 (46 lines read)

● Search (glob)
  │ "*.md" in .opencode/command/memory
  └ 6 files found

● Compare catalog tool names to schema (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ catalog = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md').read_text()…
  └ 17 lines...

● Read manage.md
  │ .opencode/command/memory/manage.md
  └ L1:120 (120 lines read)

● Read analyze.md
  │ .opencode/command/memory/analyze.md
  └ L1:120 (120 lines read)

● Compare command allowed tools to schema (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ cmd_dir = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/command/memory')…
  └ 22 lines...

To keep this high-signal, I’m delegating three bounded scan passes over the category folders while I continue validating the tool registry locally. That gives me independent coverage without slowing down the final synthesis.

● Explore Check categories 01-07
  └ Agent started in background with agent_id: traceability-01-07. You can use re...

● Explore Check categories 08-14
  └ Agent started in background with agent_id: traceability-08-14. You can use re...

● Explore Check categories 15-21
  └ Agent started in background with agent_id: traceability-15-21. You can use re...

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/README.md
  └ L250:340 (91 lines read)

● Reconcile command and schema tools (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ cmd_dir = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/command/memory')…
  └ 22 lines...

I’ve already confirmed one important baseline: the command files and `tool-schemas.ts` agree on all 33 exported MCP tools, so any traceability issues are more likely to be feature/status drift than missing registrations.

● Read (Explore agent — Check categories 01-07)
  └ Running

● Read (Explore agent — Check categories 08-14)
  └ Running

● Read (Explore agent — Check categories 15-21)
  └ Running

The remaining uncertainty is mostly in the non-tool categories and the audit-stub buckets. I’m reading those source files directly now so I can separate true coverage from “documented by cross-reference only.”

● Read 01-1-search-pipeline-features-speckit.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-
  │ features-speckit.md
  └ L1:220 (91 lines read)

● Read 02-architecture-boundary-enforcement.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/02-architecture-boundary
  │ -enforcement.md
  └ L1:220 (46 lines read)

✗ Read 10-migration-checkpoint-scripts.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/10-migration-checkpoint-
  │ scripts.md
  └ Path does not exist

● Read 01-feature-flag-governance.md
  │ .opencode/skill/system-spec-kit/feature_catalog/17--governance/01-feature-flag-governance.md
  └ L1:220 (38 lines read)

● Read 01-shared-post-mutation-hook-wiring.md
  │ .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/01-shared-post-mutation-hook-wiring
  │ .md
  └ L1:220 (111 lines read)

● List tooling-and-scripts files (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ cat = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts')
  │ for p in sorted(cat.glob('*.md')):…
  └ 21 lines...

● List ux-hooks files (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ cat = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks')
  │ for p in sorted(cat.glob('*.md')):…
  └ 22 lines...

One of the three delegated scans finished, so I’m folding that evidence in now while the other two keep running.

● Read (Explore agent — Check categories 08-14)
  └ idle

The second delegated pass just landed too. I’m pulling that in now, then I’ll only be waiting on the 01–07 scan before final synthesis.

● Read (Explore agent — Check categories 15-21)
  └ idle

● Read memory-surface.ts
  │ .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts
  └ L180:220 (41 lines read)

● Read mutation-hooks.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts
  └ L1:220 (106 lines read)

● Read session-manager.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts
  └ L165:185 (21 lines read)

● Read (Explore agent — Check categories 01-07)
  └ idle

All three scan passes are in. I’m doing a last sanity pass on a handful of cited code locations before I write the review so the final findings are grounded, not just aggregated.

● Read memory-tools.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts
  └ L1:120 (77 lines read)

● Read checkpoint-tools.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tools/checkpoint-tools.ts
  └ L1:80 (37 lines read)

● Read memory-context.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
  └ L895:930 (36 lines read)

● Read graph-search-fn.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts
  └ L1:110 (110 lines read)

● Read eval-db.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts
  └ L35:110 (75 lines read)

● Read query-classifier.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts
  └ L1:70 (70 lines read)

✗ Memory stored tool registry
  └ Spec Kit Memory exposes 33 MCP tools; `.opencode/command/memory/*.md` allowed-to…

I’ve got one weak spot left in the evidence set: a couple of “infrastructure/process” claims that need a concrete code anchor or a justified `NOT FOUND`. I’m tightening those up now so the report doesn’t overstate certainty.

● Read 02-startup-runtime-compatibility-guards.md
  │ .opencode/skill/system-spec-kit/feature_catalog/04--maintenance/02-startup-runtime-compatibility
  │ -guards.md
  └ L1:200 (51 lines read)

● Search (grep)
  │ "detectNodeVersionMismatch|checkSqliteVersion|validateConfiguredEmbeddingsProvider" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 29 lines found

● Read 02-feature-flag-sunset-audit.md
  │ .opencode/skill/system-spec-kit/feature_catalog/17--governance/02-feature-flag-sunset-audit.md
  └ L1:200 (38 lines read)

● Search (grep)
  │ "isPipelineV2Enabled|isShadowScoringEnabled|isRsfEnabled" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 3 lines found

● Read 04-dead-code-removal.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/04-dead-code-removal.md
  └ L1:160 (140 lines read)

● Read 02-2-session-and-cache.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/02-2-session-and-cach
  │ e.md
  └ L1:120 (44 lines read)

● Search (grep)
  │ "SESSION_MAX_ENTRIES|DISABLE_SESSION_DEDUP|SESSION_DEDUP_DB_UNAVAILABLE_MODE"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
  └ 3 lines found

● Search (grep)
  │ "SPECKIT_CONSUMPTION_LOG|SPECKIT_EAGER_WARMUP|SPECKIT_PIPELINE_V2" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 21 lines found

I found a potentially important drift in the flag-reference category: the catalog says `SPECKIT_CONSUMPTION_LOG` is inert, but the current code still appears to gate behavior on it. I’m verifying that now before I call it a finding.

● Read consumption-logger.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts
  └ L1:140 (139 lines read)

● Read 01-1-search-pipeline-features-speckit.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-
  │ features-speckit.md
  └ L47:54 (8 lines read)

● Search (grep)
  │ "isConsumptionLogEnabled\(|SPECKIT_CONSUMPTION_LOG" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 19 lines found

● Read eval-logger.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts
  └ L1:120 (120 lines read)

I’ve confirmed a real drift now: one flag in the catalog is documented as inert, but the runtime still uses it to gate telemetry. I’m getting the exact supporting lines so I can report it precisely and keep the rest of the catalog marked as aligned.

● Read startup-checks.ts
  │ .opencode/skill/system-spec-kit/mcp_server/startup-checks.ts
  └ L75:150 (76 lines read)

● Read dead-code-regression.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/dead-code-regression.vitest.ts
  └ L1:40 (40 lines read)

● Read pipeline-v2.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts
  └ L284:294 (11 lines read)

● Read consumption-logger.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts
  └ L80:140 (60 lines read)

The last category-specific gap is the audit-stub coverage buckets. I’m reading the cross-referenced feature records they point to so categories 20 and 21 can be reported with concrete evidence instead of just “stub exists.”

● Read 06-guards-and-edge-cases.md
  │ .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/06-guards-and-e
  │ dge-cases.md
  └ L1:220 (56 lines read)

● Read 05-code-standards-alignment.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/05-code-standards-alignm
  │ ent.md
  └ L1:200 (125 lines read)

● Search (grep)
  │ "guard|edge case|allowPartialUpdate|confirmed|confirmName" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "eslint|lint|typecheck|npm run -s check|code standards" in **/*.{md,json,ts}
  │ (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Read spec-folder-mutex.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts
  └ L1:35 (29 lines read)

● Read temporal-contiguity.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts
  └ L1:80 (79 lines read)

● Read extraction-adapter.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts
  └ L250:320 (70 lines read)

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L744:758 (14 lines read)

