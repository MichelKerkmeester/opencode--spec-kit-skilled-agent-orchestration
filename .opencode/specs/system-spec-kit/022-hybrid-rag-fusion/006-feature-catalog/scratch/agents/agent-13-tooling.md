● skill(sk-code-review)

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

● skill(sk-code-opencode)

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
  │ --strict|3 attempts|anchor-to-H2|required anchors" (.agents/skills/sk-code-opencode/SKILL.md)
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

● Search (grep)
  │ "runStats|runBulkDelete|runReindex|runSchemaDowngrade|--dry-run|--skip-checkpoint|--confirm|crea
  │ teCheckpoint|schema-downgrade" (.opencode/skill/system-spec-kit/mcp_server/cli.ts)
  └ 20 lines found

● Search (grep)
  │ "validateBackwardCompatibility|validate_backward_compatibility"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts)
  └ 4 lines found

● Search (grep)
  │ "list\)|edit <filename>|remove <filename>|budget|memory_save\(|memory_search\(|importanceTier:
  │ constitutional|always-surface" (.opencode/command/memory/learn.md)
  └ 31 lines found

● Listing background agents

● Read vector-index-schema.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts
  └ L1173:1248 (76 lines read)

● Search (grep)
  │ "INSUFFICIENT_CONTEXT_ABORT|abort_write|write_skip_index|write_and_index|toolCalls|exchanges|ses
  │ sionSummary|triggerPhrases|keyDecisions|contextType" in *.ts
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

● Search (grep)
  │ "memory_search\(|importanceTier: constitutional|document_type =
  │ 'constitutional'|includeConstitutional|boost|never decay|constitutional" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "3 attempts|up to 3|three attempts|fix all errors before proceeding|required ANCHOR IDs"
  │ (.claude/agents/speckit.md)
  └ 2 lines found

● Search (grep)
  │ "3 attempts|up to 3|three attempts|fix all errors before proceeding|required ANCHOR IDs"
  │ (.codex/agents/speckit.toml)
  └ 1 line found

● Search (grep)
  │ "3 attempts|up to 3|three attempts|fix all errors before proceeding|required ANCHOR IDs"
  │ (.gemini/agents/speckit.md)
  └ 1 line found

● Search (grep)
  │ "3 attempts|up to 3|three attempts|fix all errors before proceeding|required ANCHOR IDs"
  │ (.opencode/agent/chatgpt/speckit.md)
  └ 2 lines found

● Read (General-purpose agent — Review first tooling batch)
  └ Running

● Read (General-purpose agent — Review second tooling batch)
  └ Running

I’ve got enough direct repo evidence now; I’m just filling a couple of remaining proof points for the JSON-mode docs so the final matrix is grounded in source, not inference.

● Search (grep)
  │ "validateBackwardCompatibility|memory_history table missing|checkpoints table
  │ missing|memory_conflicts table missing"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts)
  └ 6 lines found

● Search (grep)
  │ "toolCalls|exchanges|sessionSummary|triggerPhrases|keyDecisions|contextType|git_changed_file_cou
  │ nt|computeReviewScorePenalty|getEmbeddingRetryStats|embeddingRetry" in *.ts
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

● Search (grep)
  │ "getEmbeddingRetryStats|embeddingRetry" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 20 lines found

● Read copilot-tool-output-1774459253931-wpiv2n.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774459253931-wpiv2n.txt
  └ L1:200 (103 lines read)

● Search (grep)
  │ "Feature catalog:|MODULE:|header"
  │ (.opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py)
  └ 5 lines found

● Compute current non-test TS coverage metrics (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ root = Path('.opencode/skill/system-spec-kit')
  │ files=[]
  │ for base in [root/'mcp_server', root/'shared']:…
  └ 16 lines...

● Search (grep)
  │ "AI-(WHY|TRACE|GUARD)|MODULE:"
  │ (.opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py)
  └ 3 lines found

● Search (grep)
  │ "AI-(WHY|TRACE|GUARD):" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ No matches found

● Search (grep)
  │ "AI-(WHY|TRACE|GUARD)|purposeful comments|MODULE:" (.agents/skills/sk-code-opencode/SKILL.md)
  └ 3 lines found

Reviewed all 18 files against both `.opencode/skill/system-spec-kit/mcp_server/` and `.opencode/skill/system-spec-kit/scripts/`.

- `01-tree-thinning-for-spec-folder-consolidation.md | ALIGNED |` Implemented in `scripts/core/tree-thinning.ts` and integrated in `scripts/core/workflow.ts:1029`; mcp_server only has related test/docs surfaces, which matches the catalog.
- `02-architecture-boundary-enforcement.md | ALIGNED |` `scripts/evals/check-architecture-boundaries.ts` enforces GAP A/B; `scripts/tests/architecture-boundary-enforcement.vitest.ts` covers wrapper/neutrality cases; no separate mcp_server runtime expected.
- `03-progressive-validation-for-spec-documents.md | ALIGNED |` `scripts/spec/progressive-validate.sh` implements the 4-level wrapper; `mcp_server/tests/progressive-validation.vitest.ts` verifies behavior.
- `04-dead-code-removal.md | ALIGNED |` Removed runtime symbols are absent from mcp_server code; remaining `_s4shadow` is only metadata passthrough in `lib/search/hybrid-search.ts`; no scripts-side mismatch found.
- `05-code-standards-alignment.md | PARTIAL |` `SPEC_FOLDER_LOCKS` and `MODULE:` headers are real, but **P1**: the doc’s “26 AI-intent comment conversions at HEAD” is stale. Current `mcp_server` has no `AI-WHY/AI-TRACE/AI-GUARD` matches, and current `sk-code-opencode`/`verify_alignment_drift.py` enforce purposeful comments + `MODULE:`, not AI-intent prefixes.
- `06-real-time-filesystem-watching-with-chokidar.md | ALIGNED |` `mcp_server/lib/ops/file-watcher.ts` has `chokidar`, `DEFAULT_DEBOUNCE_MS = 2000`, retry delays `[1000,2000,4000]`, and `getWatcherMetrics()`; scripts side only supplies supporting docs/tests.
- `07-standalone-admin-cli.md | ALIGNED |` `mcp_server/cli.ts` implements `stats`, `bulk-delete`, `reindex`, and `schema-downgrade` with checkpoint safety; no scripts-side duplicate runtime expected.
- `08-watcher-delete-rename-cleanup.md | ALIGNED |` `mcp_server/lib/ops/file-watcher.ts` handles `unlink` and rename lifecycle; scripts tree has no conflicting implementation.
- `09-migration-checkpoint-scripts.md | ALIGNED |` `mcp_server/scripts/migrations/create-checkpoint.ts` and `restore-checkpoint.ts` exist and are tested; no scripts-tree counterpart expected.
- `10-schema-compatibility-validation.md | ALIGNED |` `mcp_server/lib/search/vector-index-schema.ts:1173+` implements non-throwing `validateBackwardCompatibility` with hard-required tables/columns and warning-only optional tables; no scripts-side runtime version.
- `11-feature-catalog-code-references.md | PARTIAL |` **P1**: `MODULE:` headers are universal (raw scan: `280/280` non-test TS files), but feature-catalog comments are not at the documented coverage/contract level. Raw scan found `192/280` files with `// Feature catalog:` and `verify_alignment_drift.py` checks `MODULE:` only, not feature-comment presence. scripts files mostly follow header convention, not this annotation convention.
- `12-session-capturing-pipeline-quality.md | PARTIAL |` Most pipeline features exist across scripts+mcp_server, but **P1**: the doc overstates save-path posture. `scripts/memory/generate-context.ts` still accepts positional JSON file input (`dataFile` path), so `--stdin` / `--json` are not literally the only supported paths.
- `13-constitutional-memory-manager-command.md | ALIGNED |` `.opencode/command/memory/learn.md` defines create/list/edit/remove/budget flows; scripts has `memory-learn-command-docs.vitest.ts`; mcp_server has constitutional-tier indexing/retrieval support.
- `14-source-dist-alignment-enforcement.md | ALIGNED |` `scripts/evals/check-source-dist-alignment.ts` scans `dist/lib` -> `lib`, supports typed allowlist fields (`reason`, `owner`, `date`), and reports orphans; no mcp_server duplicate expected.
- `15-module-boundary-map.md | ALIGNED |` `mcp_server/lib/MODULE_MAP.md` exists with `28` module inventory entries plus feature mapping, dependency directions, and canonical locations; scripts tree has no conflicting implementation.
- `16-json-mode-hybrid-enrichment.md | ALIGNED |` Claimed structured fields/hardening are present across `scripts/types/session-types.ts`, `collect-session-data.ts`, `post-save-review`, and mcp_server embedding-retry health surfaces (`retry-manager.ts`, `memory-crud-health.ts`).
- `17-json-primary-deprecation-posture.md | PARTIAL |` **P1**: direct spec-folder mode is rejected in `generate-context.ts:419-424`, but positional JSON file mode still works (`HELP_TEXT` + `dataFile: primaryArg` at `427-430`). The doc headline says routine saves require only `--json`/`--stdin`, which overstates the current contract.
- `18-template-compliance-contract-enforcement.md | PARTIAL |` Core pieces exist (`references/validation/template_compliance_contract.md`, `scripts/utils/template-structure.js`, runtime agent defs with anchor/H2 scaffolds and `validate.sh --strict`), but **P2**: the doc’s exact “up to 3 attempts” post-write fix-loop is not present in the inspected agent definitions.

**SUMMARY:** total=`18`, aligned=`13`, partial=`5`, misaligned=`0`, P0=`0`, P1=`4`, P2=`1`.

The extra verification task finished too, so I’m checking whether it changes any of the alignment calls I already reported.

● Read (Task agent — Running audit tests)
  └ idle

I found an unintended side effect from a validation subtask: it changed one source file even though this was a review-only request. I’m verifying that diff now and cleaning it up if it’s only the stray lint fix.

● Check for unintended file changes and diff (shell)
  │ git --no-pager status --short && echo '---DIFF---' && git --no-pager diff --
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts
  └ 19 lines...

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts
  └ L190:215 (26 lines read)

● Edit
  └ Edit .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts

I reverted the stray lint-only rename, so the review stays non-invasive. I’m doing one quick check to make sure only the pre-existing unrelated workspace changes remain.

● Verify unintended checkpoint edit was reverted (shell)
  │ git --no-pager status --short && echo '---CHECKPOINTS DIFF---' && git --no-pager diff --
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts
  └ 6 lines...

Quick follow-up: the validation runner came back clean for the reviewed features (`scripts/check`, `mcp_server/check`, and the targeted watcher/CLI/progressive-validation/tree-thinning suites all passed).

One subtask had made an unintended lint-only rename in `mcp_server/lib/storage/checkpoints.ts`; I reverted that immediately, so this remained a review-only pass.

My original audit stands unchanged:

`total=18`, `aligned=13`, `partial=5`, `misaligned=0`, `P0=0`, `P1=4`, `P2=1`.

Batch B finished, so I’m checking whether its deeper pass found any evidence that should tighten or correct the review summary I already gave you.

● Read (General-purpose agent — Review second tooling batch)
  └ idle

I found a couple of meaningful corrections from the deeper Batch B pass, so I’m reconciling those before I leave you with a definitive summary.

● Listing background agents

Correction to my prior audit based on the deeper Batch B review:

- `14-source-dist-alignment-enforcement.md | PARTIAL | P2 |` Script exists, but it scans both `mcp_server/dist/lib` **and** `scripts/dist`, broader than the doc states.
- `17-json-primary-deprecation-posture.md | MISALIGNED | P0 |` Core claim is false: positional JSON file saves still work in `scripts/memory/generate-context.ts` and `scripts/loaders/data-loader.ts`.
- `18-template-compliance-contract-enforcement.md | PARTIAL | P1 |` Core pieces exist, but agent-embedded scaffold details drift from the canonical contract, and `SECTION_COUNTS` is warning-level, not hard-blocking.
- `11-feature-catalog-code-references.md` is better graded as `PARTIAL | P2`.

**Revised SUMMARY:** total `18`, aligned `12`, partial `5`, misaligned `1`, P0 `1`, P1 `3`, P2 `2`.

