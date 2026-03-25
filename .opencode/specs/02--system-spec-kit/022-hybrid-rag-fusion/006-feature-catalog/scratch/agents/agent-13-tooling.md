● skill(sk-code--review)

I’m mapping the 18 catalog files against the actual `mcp_server` and `scripts` implementations, then I’ll turn that into a per-file alignment report with severity counts.

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/*.md"
  └ 18 files found

● memory_context
  └ {"summary":"Context retrieved via focused mode (focused strategy) [truncated ...

● Run skill advisor and create session plan (shell)
  │ python3 '.opencode/skill/scripts/skill_advisor.py' 'Review ALL .md files in
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts against
  │ .opencode/skill/system-spec-kit/mcp_server and .opencode/skill/system-spec-kit/scripts; for
  │ each file read it, search for described features in both codebases, and report mismatches with
  │ ALIGNED/MISALIGNED/PARTIAL and P0/P1/P2 summary.' --threshold 0.8 && cat > …
  └ 53 lines...

● skill(sk-code--opencode)

● skill(system-spec-kit)

I’ve got the inventory. Next I’m splitting the catalog into two review batches so I can compare each document’s claims against both source trees efficiently and then reconcile the results.

● General-purpose Review first tooling batch
  └ Agent started in background with agent_id: tooling-catalog-batch-a. You can u...

● General-purpose Review second tooling batch
  └ Agent started in background with agent_id: tooling-catalog-batch-b. You can u...

● Read (General-purpose agent — Review first tooling batch)
  └ Running

● Read (General-purpose agent — Review second tooling batch)
  └ Running

While the batch reviewers run, I’m doing a quick independent pass over the catalog itself so I can spot-check their conclusions against the docs’ own claimed source references.

● Extract titles and referenced paths from tooling catalog docs (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ root = Path('.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts')
  │ for path in sorted(root.glob('*.md')):
  │ text = path.read_text()…
  └ 166 lines...

● Read (General-purpose agent — Review first tooling batch)
  └ Running

● Read (General-purpose agent — Review second tooling batch)
  └ Running

I’m also building a quick evidence matrix from the repo itself so I can verify any borderline cases instead of just trusting the batch reviewers’ summaries.

● List directory .opencode/skill/system-spec-kit/mcp_server
  └ 33 files found

● List directory .opencode/skill/system-spec-kit/scripts
  └ 34 files found

● Search (grep)
  │ "applyTreeThinning|progressive-validate|check-architecture-boundaries|check-source-dist-alignmen
  │ t|generate-context|memory:learn|chokidar|template-structure|MODULE_MAP\.md" in *.{ts,js,sh,md}
  │ (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Read copilot-tool-output-1774459005292-kcpnmr.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774459005292-kcpnmr.txt
  └ L1:220 (89 lines read)

I’ve identified a few likely drift hotspots from the catalog metadata itself, so I’m spot-checking those directly in source before I finalize statuses.

● Read 05-code-standards-alignment.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/05-code-standards-alignm
  │ ent.md
  └ 125 lines read

● Read 11-feature-catalog-code-references.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-
  │ references.md
  └ 56 lines read

● Read 13-constitutional-memory-manager-command.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/13-constitutional-memory
  │ -manager-command.md
  └ 70 lines read

● Read 15-module-boundary-map.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/15-module-boundary-map.m
  │ d
  └ 58 lines read

● Read 17-json-primary-deprecation-posture.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecat
  │ ion-posture.md
  └ 96 lines read

● Read 18-template-compliance-contract-enforcement.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/18-template-compliance-c
  │ ontract-enforcement.md
  └ 61 lines read

● Read MODULE_MAP.md
  │ .opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md
  └ L1:220 (220 lines read)

● Read learn.md
  │ .opencode/command/memory/learn.md
  └ 523 lines read

● Read generate-context.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts
  └ L1:220 (220 lines read)

● Read template-structure.js
  │ .opencode/skill/system-spec-kit/scripts/utils/template-structure.js
  └ L1:260 (260 lines read)

● Compute catalog comment coverage and lib subdir count (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ root = Path('.opencode/skill/system-spec-kit')
  │ # Feature catalog comment coverage…
  └ 61 lines...

● Search (grep)
  │ "Direct positional mode|reject|structured-input|stdin|--json|dataFile|collectSessionData\(|loadC
  │ ollectedData\(|positional|Direct CLI target rule"
  │ (.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts)
  └ 41 lines found

● Search (grep)
  │ "validate\.sh --strict|fix loop|3
  │ attempts|template_compliance_contract|loadTemplateContract|SECTION_COUNTS|content minimum" in
  │ *.{md,ts,js,sh,toml} (.opencode/skill/system-spec-kit)
  └ 62 lines found

● Check speckit agent defs for embedded compliance contract cues (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ from collections import Counter
  │ base = Path('.opencode/skill/system-spec-kit')
  │ files = [base/'.claude/agents/speckit.md', base/'.opencode/agent/speckit.md', …
  └ 17 lines...

I found one concrete drift already: the raw feature-catalog annotation coverage is materially lower than the document claims, so I’m tightening a few more source checks around command behavior and agent-contract references.

● Read generate-context.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts
  └ L395:435 (41 lines read)

● List migration checkpoint scripts (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ p = Path('.opencode/skill/system-spec-kit/mcp_server/scripts/migrations')
  │ print('exists', p.exists())
  │ if p.exists():…
  └ 7 lines...

● Count module map inventory entries (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ p = Path('.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md')
  │ text = p.read_text()
  │ count = sum(1 for line in text.splitlines() if line.startswith('### `') and …
  └ 10 lines...

● Check external speckit agent definitions for compliance contract (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ paths = [
  │ Path('.claude/agents/speckit.md'),
  │ Path('.opencode/agent/speckit.md'),…
  └ 28 lines...

● Listing background agents

● Read (Explore agent — Auditing feature alignment)
  └ idle

● Read speckit.md
  │ .gemini/agents/speckit.md
  └ L1:220 (219 lines read)

● Read speckit.md
  │ .opencode/agent/speckit.md
  └ L1:220 (220 lines read)

● Search (grep)
  │ "AI-(WHY|TRACE|GUARD)|purposeful-comment|MODULE:|COMPONENT:|SECTION_COUNTS|validate\.sh
  │ --strict|3 attempts|anchor-to-H2|required anchors" (.opencode/agent/speckit.md)
  └ 5 lines found

● Search (grep)
  │ "AI-(WHY|TRACE|GUARD)|purposeful-comment|MODULE:|COMPONENT:|SECTION_COUNTS|validate\.sh
  │ --strict|3 attempts|anchor-to-H2|required anchors" (.agents/skills/sk-code--opencode/SKILL.md)
  └ 2 lines found

● Read speckit.md
  │ .opencode/agent/speckit.md
  └ L300:390 (91 lines read)

● Search (grep)
  │ "required anchors|ANCHOR:|H2|header hierarchy|Level 1.*spec\.md|spec\.md.*required"
  │ (.opencode/agent/speckit.md)
  └ 9 lines found

● Search (grep)
  │ "required anchors|ANCHOR:|H2|header hierarchy|Level 1.*spec\.md|spec\.md.*required"
  │ (.gemini/agents/speckit.md)
  └ 14 lines found

● Search (grep)
  │ "##\s+3\.|##\s+4\.|##\s+5\.|Feature Catalog|Dependency Directions|Canonical Locations"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md)
  └ 12 lines found

● Search (grep)
  │ "191 of 257|74%|Feature catalog:" (.opencode/skill/system-spec-kit/feature_catalog/16--tooling-a
  │ nd-scripts/11-feature-catalog-code-references.md)
  └ 6 lines found

● Search (grep)
  │ "Feature catalog:" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 files found

● Search (grep)
  │ "Feature catalog:" in *.ts (.opencode/skill/system-spec-kit/shared)
  └ 9 files found

● Read 12-session-capturing-pipeline-quality.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pip
  │ eline-quality.md
  └ 1 line read

● Read 10-schema-compatibility-validation.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/10-schema-compatibility-
  │ validation.md
  └ 52 lines read

● Read 14-source-dist-alignment-enforcement.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/14-source-dist-alignment
  │ -enforcement.md
  └ 53 lines read

● Read 16-json-mode-hybrid-enrichment.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enri
  │ chment.md
  └ 184 lines read

● Read 12-session-capturing-pipeline-quality.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pip
  │ eline-quality.md
  └ L1:220 (220 lines read)

● Read 12-session-capturing-pipeline-quality.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pip
  │ eline-quality.md
  └ L221:420 (55 lines read)

● Search (grep)
  │ "direct positional saves now exit non-zero|sole save contract|file-backed
  │ JSON|sessionSummary|toolCalls|exchanges|decision_count|post-save
  │ review|memory_learn_command_docs|validateBackwardCompatibility|check-source-dist-alignment" in
  │ *.{ts,md,sh,js} (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "allowlist|owner|date|reason|dist/lib|lib/.*\.ts|orphan"
  │ (.opencode/skill/system-spec-kit/scripts/evals/check-source-dist-alignment.ts)
  └ 27 lines found

● Search (grep)
  │ "validateBackwardCompatibility|schema_version|memory_index|memory_history|checkpoints|memory_con
  │ flicts|warning" (.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts)
  └ 5 lines found

● Search (grep)
  │ "toolCalls|exchanges|sessionSummary|triggerPhrases|keyDecisions|contextType|getEmbeddingRetrySta
  │ ts|embeddingRetry|git_changed_file_count|pre-save overlap|SHA1" in *.{ts,js}
  │ (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Read copilot-tool-output-1774459157863-hsns7c.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774459157863-hsns7c.txt
  └ L1:160 (87 lines read)

● Search (grep)
  │ "startFileWatcher|getWatcherMetrics|RETRY_DELAYS_MS|DEFAULT_DEBOUNCE_MS|unlink|chokidar"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts)
  └ 11 lines found

● Search (grep)
  │ "isRsfEnabled|isShadowScoringEnabled|fuseResultsRsf|rsfShadow|_s4shadow|specFolderLocks\b" in
  │ *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 6 lines found

● Search (grep)
  │ "applyTreeThinning\(|mergeThreshold|memoryThinThreshold|max.*children|overflow" in *.ts
  │ (.opencode/skill/system-spec-kit/scripts/core)
  └ 10 lines found

● Search (grep)
  │ "check-architecture-boundaries|shared/ must not import|wrapper|scripts/dist|child_process|50
  │ substantive" in *.{ts,md} (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

● Read copilot-tool-output-1774459177777-9pkpte.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774459177777-9pkpte.txt
  └ L1:160 (92 lines read)

