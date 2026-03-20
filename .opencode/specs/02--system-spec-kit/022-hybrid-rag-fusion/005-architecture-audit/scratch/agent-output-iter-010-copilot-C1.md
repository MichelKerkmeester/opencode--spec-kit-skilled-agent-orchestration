● skill(sk-code--review)

I’m doing a final evidence-gathering sweep now: I’ll inspect the requested hotspots, dependency/config surfaces, and review baselines in parallel, then consolidate them into a severity-ranked top 10.

● Read security_checklist.md
  │ .agents/skills/sk-code--review/references/security_checklist.md
  └ 206 lines read

● Read code_quality_checklist.md
  │ .agents/skills/sk-code--review/references/code_quality_checklist.md
  └ 162 lines read

● Read tsconfig.json
  │ .opencode/skill/system-spec-kit/tsconfig.json
  └ 23 lines read

● Read quick_reference.md
  │ .agents/skills/sk-code--review/references/quick_reference.md
  └ 151 lines read

● Read package.json
  │ .opencode/skill/system-spec-kit/package.json
  └ 44 lines read

● Read package.json
  │ .opencode/skill/system-spec-kit/mcp_server/package.json
  └ 59 lines read

● Read solid_checklist.md
  │ .agents/skills/sk-code--review/references/solid_checklist.md
  └ 114 lines read

● Read tsconfig.json
  │ .opencode/skill/system-spec-kit/mcp_server/tsconfig.json
  └ 25 lines read

● Search (glob)
  │ ".opencode/skill/system-spec-kit/{nodes,constitutional,templates}/**/*"
  └ 86 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/scripts/migrations/*.ts"
  └ 2 files found

● Create session plan file (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && mkdir -p
  │ '/Users/michelkerkmeester/.copilot/session-state/e8d72b95-5e98-4d46-9c8d-a25ad45e0825' && cat
  │ >
  │ '/Users/michelkerkmeester/.copilot/session-state/e8d72b95-5e98-4d46-9c8d-a25ad45e0825/plan.md'
  │ <<'EOF'…
  └ 10 lines...

I’ve loaded the review rubric and workspace metadata. Next I’m drilling into the requested hotspots and the template/constitutional surfaces to extract concrete, high-impact issues with file evidence.

● Read shared-spaces.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts
  └ 1 line read

● Read job-queue.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts
  └ 1 line read

● Read file-watcher.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts
  └ 416 lines read

● Read pagerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/manage/pagerank.ts
  └ 141 lines read

● Read README.md
  │ .opencode/skill/system-spec-kit/constitutional/README.md
  └ 773 lines read

● Read vector-store.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/interfaces/vector-store.ts
  └ 48 lines read

● Read create-checkpoint.ts
  │ .opencode/skill/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts
  └ 257 lines read

● Read phase-system.md
  │ .opencode/skill/system-spec-kit/nodes/phase-system.md
  └ 107 lines read

● Read README.md
  │ .opencode/skill/system-spec-kit/templates/examples/README.md
  └ 62 lines read

● Read README.md
  │ .opencode/skill/system-spec-kit/templates/README.md
  └ 107 lines read

● Read gate-enforcement.md
  │ .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md
  └ 106 lines read

● Read layer-definitions.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts
  └ 237 lines read

● Read restore-checkpoint.ts
  │ .opencode/skill/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts
  └ 234 lines read

● Read README.md
  │ .opencode/skill/system-spec-kit/templates/core/README.md
  └ 75 lines read

I’ve got the first-pass file reads. I’m now narrowing onto the highest-risk seams: concurrency/authorization in the large modules, plus whether the declared dependencies and TS settings are justified by actual usage.

● Search (grep)
  │ "TODO|FIXME|HACK|catch|console\.|throw new Error|queue|retry|backoff|setTimeout|Promise|abort|ca
  │ ncel|drain|shutdown|concurrency|pending|active"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts)
  └ 81 lines found

● Search (grep)
  │ "skipLibCheck|allowJs|moduleResolution|module|target|declarationMap|composite|references|exclude
  │ " in **/tsconfig*.json (.opencode/skill/system-spec-kit)
  └ 18 lines found

● Search (grep)
  │ "TODO|FIXME|HACK|catch|console\.|throw new
  │ Error|membership|tenant|sharedSpace|killSwitch|rollout|role|access|INSERT|DELETE|UPDATE|SELECT"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts)
  └ 5 lines found

● Search (grep)
  │ "@huggingface/transformers|onnxruntime-common|node-llama-cpp|sqlite-vec|chokidar|zod|better-sqli
  │ te3|@modelcontextprotocol/sdk" in **/*.{ts,js,json} (.opencode/skill/system-spec-kit)
  └ 5 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/**/tsconfig*.json"
  └ 4 files found

● Explore Audit shared spaces and queue
  │ Search (grep)
  │   │ "\.includes\(|\.find\(|\.some\(|\.filter\("
  │   │ (.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts)
  │   └ 2 lines found
  └ Search (grep)
      │ "global|static|module-level"
      │ (.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts)
      └ No matches found

● Explore Audit docs and config
  │ Check if AGENTS.md exists (shell)
  │   │ find /Users/michelkerkmeester/MEGA/Development/Opencode\
  │   │ Env/Public/.opencode/skill/system-spec-kit -name "AGENTS.md" -type f
  │   └ 1 line...
  └ Check exports from importance-tiers (shell)
      │ grep -rn "^import\|^export" /Users/michelkerkmeester/MEGA/Development/Opencode\
      │ Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts | head
       -10
      └ 11 lines...

I have two strong candidate clusters already: auth/concurrency issues in the runtime code, and contract drift in docs/config. I’m validating the exact surrounding code now so the final top 10 stays evidence-backed rather than speculative.

● Read tsconfig.json
  │ .opencode/skill/system-spec-kit/shared/tsconfig.json
  └ 10 lines read

● Read tsconfig.json
  │ .opencode/skill/system-spec-kit/scripts/tsconfig.json
  └ 31 lines read

● Read shared-spaces.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts
  └ L430:620 (178 lines read)

● Read job-queue.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts
  └ L280:740 (449 lines read)

● Search (grep)
  │ "from 'sqlite-vec'|from '@huggingface/transformers'|from 'node-llama-cpp'|from
  │ 'onnxruntime-common'|from 'chokidar'|from 'zod'|from 'better-sqlite3'|from
  │ '@modelcontextprotocol/sdk'" in **/*.{ts,js} (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "shouldAlwaysSurface\(|MAX_CONSTITUTIONAL_TOKENS|TOKENS_PER_MEMORY|includeConstitutional|isConst
  │ itutional" in **/*.{ts,js,md,json} (.opencode/skill/system-spec-kit)
  └ 5 lines found

I’ve validated the big concurrency paths. I’m doing one last pass on dependency wiring and a few “looks-correct-but-isn’t-enforced” contracts so the final top 10 doesn’t miss the subtle but expensive issues.

● Search (grep)
  │ "sqlite-vec|@huggingface/transformers|node-llama-cpp|onnxruntime-common|chokidar|zod|better-sqli
  │ te3|@modelcontextprotocol/sdk" (.opencode/skill/system-spec-kit/mcp_server/package.json)
  └ 9 lines found

● Read importance-tiers.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts
  └ L130:180 (51 lines read)

● Read vector-index-store.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts
  └ L480:525 (45 lines read)

● Read vector-index-store.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts
  └ L1:40 (40 lines read)

● Search (grep)
  │ "from 'sqlite-vec'" in **/*.{ts,js} (.opencode/skill/system-spec-kit)
  └ 2 lines found

● Search (grep)
  │ "from '@huggingface/transformers'" in **/*.{ts,js} (.opencode/skill/system-spec-kit)
  └ No matches found

● Search (grep)
  │ "from 'node-llama-cpp'" in **/*.{ts,js} (.opencode/skill/system-spec-kit)
  └ No matches found

● Search (grep)
  │ "computePageRank\(" in **/*.{ts,js} (.opencode/skill/system-spec-kit)
  └ 14 lines found

● Search (grep)
  │ "from 'better-sqlite3'" in **/*.{ts,js} (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "from 'chokidar'" in **/*.{ts,js} (.opencode/skill/system-spec-kit)
  └ No matches found

● Search (grep)
  │ "from 'onnxruntime-common'" in **/*.{ts,js} (.opencode/skill/system-spec-kit)
  └ No matches found

● Search (grep)
  │ "shouldAlwaysSurface\(" in **/*.{ts,js} (.opencode/skill/system-spec-kit)
  └ 6 lines found

● Search (grep)
  │ "from 'zod'" in **/*.{ts,js} (.opencode/skill/system-spec-kit)
  └ 3 lines found

● Search (grep)
  │ "from '@modelcontextprotocol/sdk'" in **/*.{ts,js} (.opencode/skill/system-spec-kit)
  └ No matches found

● Search (grep)
  │ "AGENTS\.md|gates\.md|Gate 3|spec-folder" in **/*.{md,ts,json} (.opencode/skill/system-spec-kit)
  └ 5 lines found

A couple of the “big” findings just changed shape: `shouldAlwaysSurface()` isn’t fully dead because it’s test-covered, but it still isn’t wired into production retrieval. I’m tightening the dependency evidence now to distinguish truly unused packages from dynamically loaded ones.

● Read job-queue.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts
  └ L100:140 (41 lines read)

● Read file-watcher.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts
  └ L47:62 (16 lines read)

✗ Search (grep)
  │ "Gate 3|spec folder FIRST|Option E|spec-folder choice" in **/*.md
  │ (.opencode/skill/system-spec-kit/{constitutional,templates,nodes})
  └ rg: /Users/michelkerkmeester/MEGA/Development/Opencode
    Env/Public/.opencode/skill/system-spec-kit/{constitutional,templates,nodes}: IO error for
    operation on /Users/michelkerkmeester/MEGA/Development/Opencode
    Env/Public/.opencode/skill/system-spec-kit/{constitutional,templates,nodes}: No such file or
    directory (os error 2)

✗ Search (grep)
  │ "AGENTS\.md" in **/*.md (.opencode/skill/system-spec-kit/{constitutional,templates,nodes})
  └ rg: /Users/michelkerkmeester/MEGA/Development/Opencode
    Env/Public/.opencode/skill/system-spec-kit/{constitutional,templates,nodes}: IO error for
    operation on /Users/michelkerkmeester/MEGA/Development/Opencode
    Env/Public/.opencode/skill/system-spec-kit/{constitutional,templates,nodes}: No such file or
    directory (os error 2)

● Search (grep)
  │ "onnxruntime" in **/*.{ts,js,json,md} (.opencode/skill/system-spec-kit)
  └ 64 lines found

● Search (grep)
  │ "layer-definitions|getLayerPrefix|getRecommendedLayers|LAYER_DEFINITIONS" in **/*.{ts,js,md}
  │ (.opencode/skill/system-spec-kit)
  └ 72 lines found

● Search (grep)
  │ "llama" in **/*.{ts,js,json,md} (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "transformers" in **/*.{ts,js,json,md} (.opencode/skill/system-spec-kit)
  └ 5 lines found

The dependency picture is getting clearer: some packages are genuinely active, some are only transitively justified, and a few manifest choices create risk even if they “work.” I’m checking the shared workspace now so I don’t mislabel a package as unused when it’s actually consumed there.

● Read tsconfig.json
  │ .opencode/skill/system-spec-kit/mcp_server/tsconfig.json
  └ L17:24 (8 lines read)

● Read package.json
  │ .opencode/skill/system-spec-kit/shared/package.json
  └ 14 lines read

● Search (grep)
  │ "exclude": \[.*layer-definitions|dead-code-regression|chunk-thinning"
  │ (.opencode/skill/system-spec-kit/mcp_server/tsconfig.json)
  └ 2 lines found

● Read hf-local.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings/providers/hf-local.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "@huggingface/transformers|onnxruntime-common" in **/*.{ts,js,json}
  │ (.opencode/skill/system-spec-kit/shared)
  └ 1 line found

● Search (grep)
  │ "from 'hono'|from 'tar'|from 'sqlite-vec-darwin-arm64'" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit)
  └ No matches found

I’ve confirmed the HF/ONNX packages are actually exercised through the shared embeddings provider. The optional `node-llama-cpp` path still looks like dead/underdocumented surface area, so I’m verifying whether it’s code-backed or just manifest noise.

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L40:90 (51 lines read)

● Read memory-context.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
  └ L740:790 (50 lines read)

● Search (grep)
  │ "phase complexity score|Documentation level >= 3|user decides the final count"
  │ (.opencode/skill/system-spec-kit/nodes/phase-system.md)
  └ 2 lines found

● Read vector-store.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/interfaces/vector-store.ts
  └ 48 lines read

● Search (grep)
  │ "Gate 3|AGENTS\.md" in **/*.md (.opencode/skill/system-spec-kit/constitutional)
  └ 10 lines found

● Search (grep)
  │ "Gate 3|Option E|spec-folder choice|phase child" in **/*.md
  │ (.opencode/skill/system-spec-kit/templates)
  └ 9 lines found

● Search (grep)
  │ "allowJs" in **/*.{js,ts,json} (.opencode/skill/system-spec-kit/mcp_server)
  └ 1 line found

● Search (grep)
  │ "IVectorStore|VectorStoreInterface" in **/*.{ts,js} (.opencode/skill/system-spec-kit)
  └ 22 lines found

● Search (grep)
  │ "node-llama-cpp|llama-cpp|llama" in **/*.{ts,js,json,md} (.opencode/skill/system-spec-kit)
  └ 5 lines found

I’ve finished source inspection. I’m running the existing workspace verification commands now—not to validate a code change, but to catch architectural problems that only show up under the project’s own build/type/test paths.

● Run workspace typecheck (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit' && npm run -s typecheck
  └ 1 line...

● Run workspace tests (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit' && npm test
  └ 6 lines...

I found a couple of high-value documentation contract mismatches: the always-surfaced constitutional rules don’t agree with the templates that depend on them. I’m grabbing the exact lines now because those are the kinds of issues that create real operator mistakes.

● Read README.md
  │ .opencode/skill/system-spec-kit/templates/README.md
  └ L74:95 (22 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/templates/level_2/README.md
  └ L72:88 (17 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/templates/level_3/README.md
  └ L76:88 (13 lines read)

● Read phase-system.md
  │ .opencode/skill/system-spec-kit/nodes/phase-system.md
  └ L12:19 (8 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/templates/level_3+/README.md
  └ L78:90 (13 lines read)

● Read gate-enforcement.md
  │ .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md
  └ L62:69 (7 lines read)

I’ve got enough source-level evidence; one last check is the full test run, since failing or hanging baseline tests often expose the highest-effort pain points in a system like this.

● Read shell output Waiting up to 10 seconds for command output
  └ 6 lines...

● Read shell output Waiting up to 20 seconds for command output
  └ 11 lines...

The test run failed, which is useful here: I’m pulling the failing tail and error signatures now so I can tell whether they reinforce the source-level findings or are just environment noise.

● Read copilot-tool-output-1774015103062-l1mjxz.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774015103062-l1mjxz.txt
  └ L1:120 (120 lines read)

● Read copilot-tool-output-1774015103062-l1mjxz.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774015103062-l1mjxz.txt
  └ L-120:end (413 lines read)

● Search (grep)
  │ "FAIL|Error:|AssertionError|TypeError|ReferenceError|expected|failed|not ok|ELIFECYCLE"
  │ (/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774015103062-l1mjxz.txt)
  └ 5 lines found

The failing baseline test isn’t random noise—it’s a documentation contract test. I’m pulling the exact assertion so I can decide whether it belongs in the final top 10 (it probably does).

● Read feature-flag-reference-docs.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts
  └ L1:220 (130 lines read)

● Search (grep)
  │ "NEW-125|manual playbook|default-on|opt-out|AssertionError|expected .* to"
  │ (/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774015103062-l1mjxz.txt)
  └ 4 lines found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/**/NEW-125*"
  └ No matches found

That confirms one of the most actionable documentation problems: the project’s own contract test is failing on the manual playbook. I’m locating the referenced docs so I can include the exact drift, not just the failing test name.

● Search (grep)
  │ "NEW-125|default-on unless explicitly opted out|capabilities\.graphUnified:true|phase:\\"shared-
  │ rollout\\"|SPECKIT_HYDRA_GRAPH_UNIFIED=false|capabilities\.graphUnified:false" in **/*.md
  │ (.opencode/skill/system-spec-kit/manual_testing_playbook)
  └ 18 lines found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/manual_testing_playbook/**/*.md"
  └ 5 files found

I’ve got enough for the top 10. I’m doing one narrow current-data check on the declared packages so I can separate “manifest risk” from “known vulnerable version” in the final write-up.

● Web Search As of 2026, are there known published security vulnerabilities affecting these npm pac…
  └ {"type":"text","text":{"value":"Based on available vulnerability databases, a...

The security check came back cleaner than I expected: no confirmed published CVEs on the pinned package versions I checked. That strengthens the case that the dependency concerns here are mostly about architecture and platform risk, not known public advisories.

● Search (grep)
  │ "new IVectorStore\(|extends IVectorStore" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 4 lines found

● Search (grep)
  │ "node-llama-cpp" in **/*.{ts,js,json,md} (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "sqlite-vec-darwin-arm64" in **/*.{ts,js,json,md} (.opencode/skill/system-spec-kit)
  └ 15 lines found

One manifest assumption needed correction: the docs say `sqlite-vec` is allowed to degrade gracefully, so I’m checking the implementation before I treat that as a hard packaging bug.

● Read vector-index-store.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts
  └ L640:760 (121 lines read)

● Read vector-index-store.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts
  └ L80:180 (101 lines read)

● Search (grep)
  │ "sqliteVec|loadSqliteVec|vec0|degrad|fallback|non-vector|isAvailable"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts)
  └ 5 lines found

● Read vector-index-store.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts
  └ L596:626 (31 lines read)

● Read vector-index-store.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts
  └ L780:796 (17 lines read)

The sqlite fallback is real, so I’m downgrading that from “packaging bug” to “operator/platform risk.” I’m doing one last pass on `node-llama-cpp` and the checkpoint scripts, because those still look like the best remaining candidates for the lower half of the top 10.

● Read restore-checkpoint.ts
  │ .opencode/skill/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts
  └ L145:186 (42 lines read)

● Read create-checkpoint.ts
  │ .opencode/skill/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts
  └ L145:205 (61 lines read)

● Search (grep)
  │ "copyFileSync|wal_checkpoint|journal_mode = WAL|getSchemaVersion|verifySqliteFile|backupPath" in
  │ *.ts (.opencode/skill/system-spec-kit/mcp_server/scripts/migrations)
  └ 15 lines found

● Search (grep)
  │ "VACUUM INTO|backup\(|sqlite backup|wal" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 71 lines found

● Search (grep)
  │ "node-llama-cpp" in **/*.{ts,js,json,md} (.opencode/skill/system-spec-kit)
  └ 5 lines found

The checkpoint scripts are indeed more fragile than they look: they rely on raw file copies even though the runtime is explicitly in WAL mode. I’m narrowing `node-llama-cpp` to source files only now so I can decide whether that’s a real cleanup target or just a documented future path.

● Read pagerank.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/pagerank.vitest.ts
  └ L1:40 (40 lines read)

● Search (grep)
  │ "computePageRank\(|Graph momentum scoring|PageRank" in **/*.{ts,js,md}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 55 lines found

● Search (grep)
  │ "node-llama-cpp|llama-cpp" in **/*.{ts,js,md,json} (.opencode/skill/system-spec-kit)
  └ 5 lines found

I’ve got the lower-half candidates now. The last meaningful one is the test-blocking manual playbook drift, and I want the exact mismatched lines before I lock the final ranking.

● Read feature-flag-reference-docs.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts
  └ L108:129 (22 lines read)

● Read 125-hydra-roadmap-capability-flags.md
  │ .opencode/skill/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/125-hydra-roa
  │ dmap-capability-flags.md
  └ L24:31 (8 lines read)

● Read manual_testing_playbook.md
  │ .opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
  └ L2476:2484 (9 lines read)

I found the real cause of the failing docs test: it points at the wrong playbook path, not just a wording mismatch. I’m doing one last source-only sweep for `node-llama-cpp`/`onnxruntime-common` so the package recommendations are crisp and don’t conflate “unused” with “documented but future-facing.”

● Search (grep)
  │ "node-llama-cpp|llama-cpp" in **/*.{ts,js,md} (.opencode/skill/system-spec-kit)
  └ 50 lines found

● Search (grep)
  │ "onnxruntime-common" in **/*.{ts,js,md} (.opencode/skill/system-spec-kit)
  └ 2 lines found

● Search (grep)
  │ "@huggingface/transformers" in **/*.{ts,js,md} (.opencode/skill/system-spec-kit)
  └ 7 lines found

`npm run -s typecheck` passes. `npm test` currently fails on a docs-contract test, not a compiler/runtime crash. I also checked current package advisories: I did **not** find confirmed published CVEs for the pinned versions reviewed; the dependency risk here is mostly architecture/platform risk.

## TOP 10 Improvements

1. **Harden shared-space authorization end-to-end** — Impact: **HIGH**, Effort: **MEDIUM**.  
   `mcp_server/lib/collab/shared-spaces.ts:440-557,566-606` mixes a broad membership scan for reads with an unguarded `recordSharedConflict()` write path. I’d make access checks role-aware and single-query, then require `editor`/`owner` before conflict/audit writes.

2. **Replace raw SQLite file copies with SQLite-native checkpoint/restore** — Impact: **HIGH**, Effort: **MEDIUM**.  
   `scripts/migrations/create-checkpoint.ts:149,184-186`, `restore-checkpoint.ts:170-175`, and runtime WAL mode in `lib/search/vector-index-store.ts:620` are a risky combo. Use SQLite backup/`VACUUM INTO` semantics and explicitly handle `-wal`/`-shm` files during restore.

3. **Fix the broken NEW-125 playbook contract that currently fails `npm test`** — Impact: **HIGH**, Effort: **LOW**.  
   `mcp_server/tests/feature-flag-reference-docs.vitest.ts:110-129` looks for `manual_testing_playbook/02--new-features/125-hydra-roadmap-capability-flags.md`, but the real file lives under `manual_testing_playbook/19--feature-flag-reference/...`. This is the current baseline test failure.

4. **Make Gate 3’s canonical options match the template system** — Impact: **HIGH**, Effort: **LOW**.  
   `constitutional/gate-enforcement.md:66-68` still says Gate 3 is only A/B/C/D, while `templates/README.md:87-90` and the level READMEs rely on **Option E** for phase-child work. The always-surfaced constitutional rule and the templates must not disagree.

5. **Resolve the phase-rule contradiction between nodes and templates** — Impact: **MEDIUM**, Effort: **LOW**.  
   `nodes/phase-system.md:14-19` says phases apply only when `documentation level >= 3`, but `templates/level_2/README.md:78-83` actively recommends phase decomposition for Level 2. That’s operator-facing drift in a core workflow.

6. **Move constitutional surfacing and token budgeting to one config-driven path** — Impact: **MEDIUM**, Effort: **MEDIUM**.  
   `lib/scoring/importance-tiers.ts:153-166` already exposes `shouldAlwaysSurface()`/`getMaxTokens()`, but production retrieval still hardcodes `'constitutional'` and `TOKENS_PER_MEMORY = 100` in `lib/search/vector-index-store.ts:485-503`. This should be enforced from the tier config, with real token accounting instead of a magic per-memory slice.

7. **Tighten the TypeScript gate instead of typechecking a curated subset** — Impact: **MEDIUM**, Effort: **MEDIUM**.  
   Root `tsconfig.json:8` uses `skipLibCheck`, and `mcp_server/tsconfig.json:18-23` excludes regression-focused tests (`chunk-thinning`, `layer-definitions`, `dead-code-regression`) from the TS project. For a system this metadata-heavy, those are exactly the places where drift hides.

8. **Fix workspace dependency ownership and remove manifest ambiguity** — Impact: **MEDIUM**, Effort: **MEDIUM**.  
   `shared/embeddings/providers/hf-local.ts:111` runtime-imports `@huggingface/transformers`, but `shared/package.json:1-14` declares no dependencies; meanwhile root `package.json:35-42` and `mcp_server/package.json:39-50` duplicate ownership, and `onnxruntime-common` appears manifest-only in source review. I’d declare runtime deps in the workspace that actually imports them and drop direct deps that aren’t directly consumed.

9. **Upgrade the ingest queue from a single in-memory dispatcher to an idempotent, scalable queue** — Impact: **MEDIUM**, Effort: **MEDIUM**.  
   `lib/ops/job-queue.ts:105-108,651-697` is explicitly one-worker-at-a-time and dedupes with `pendingQueue.includes()`. That creates head-of-line blocking and O(n) enqueue checks; a `Set`-backed queue with bounded concurrency would improve both correctness and throughput.

10. **Either wire PageRank into runtime scoring or retire it from the architecture story** — Impact: **MEDIUM**, Effort: **LOW**.  
   `lib/manage/pagerank.ts:60` and `tests/pagerank.vitest.ts:5` show a well-tested PageRank module, but source search only finds runtime usage in tests/docs, not in production scoring. Right now it adds conceptual weight without affecting behavior.

If you want, I can turn this into a stricter P0/P1/P2 severity list next.

