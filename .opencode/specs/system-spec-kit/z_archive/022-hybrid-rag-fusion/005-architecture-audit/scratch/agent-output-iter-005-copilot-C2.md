I’m digging through the workflow and ops paths first, then I’ll map where manual work, missing automation, and weak self-healing show up.

● Search (glob)
  │ "**/SKILL.md"
  └ 19 files found

● Explore Survey workflow automation
  │ Find deferred processing patterns (shell)
  │   │ grep -n "deferred\|batched\|queued.*process\|next.*trigger"
  │   │ "/Users/michelkerkmeester/MEGA/Development/Opencode
  │   │ Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts" | head -30
  │   └ 1 line...
  └ Read memory-ingest.ts
      │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts
      └ L220:280 (61 lines read)

I found a strong first pass. Now I’m spot-checking the exact code paths so the audit is grounded in the implementation, not just surface behavior.

● Search (grep)
  │ "ensureIndexFresh|needsRefresh|getUnindexedDocuments|RETRY_THRESHOLD|pending|retry|partial"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts)
  └ 129 lines found

● Search (grep)
  │ "workerActive|resetIncompleteJobsToQueued|queued|failed|retry|forecast|processNext|cancelIngestJ
  │ ob" (.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts)
  └ 5 lines found

● Search (grep)
  │ "MAX_CONCURRENT_REINDEX|DEFAULT_DEBOUNCE_MS|console\.warn|schedule|reindex|metrics|watch"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts)
  └ 5 lines found

● Search (grep)
  │ "auto-save|save|memory|spec|workflow|generate|context|step|manual|run"
  │ (.opencode/skill/system-spec-kit/SKILL.md)
  └ 5 lines found

● Search (grep)
  │ "memory_ingest_start|paths|job|enqueue|duplicate|dedup|indexed|unchanged|skip"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts)
  └ 5 lines found

● Search (grep)
  │ "shouldIndexMemory|QUALITY_ABORT_THRESHOLD|writeFilesAtomically|metadata\.json|trigger_phrases|e
  │ xtractTriggerPhrases|write_skip_index|sufficiency"
  │ (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 5 lines found

I’ve narrowed it to a few hotspots: index refresh, watcher/queue behavior, workflow save/index decisions, and the user-facing manual loop in `SKILL.md`. I’m pulling the exact ranges now so the final audit is specific and actionable.

● Create session plan (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/80168725-c202-40c9-a7ca-cb1d1d08529a/plan.md'
  │ <<'EOF'
  │ # Plan
  │ - Inspect workflow, watcher, queue, index-refresh, and ingest paths.…
  └ 5 lines...

● Count target file lines (shell)
  │ wc -l \
  │ '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts' \
  │ '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts' \…
  └ 28 lines...

● Search (grep)
  │ "shouldIndexMemory|write_skip_index|QUALITY_ABORT_THRESHOLD|writeFilesAtomically|metadata\.json|
  │ extractTriggerPhrases|renderTriggerPhrasesYaml"
  │ (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 5 lines found

● Search (grep)
  │ "wrap|template|anchor|skip|directory|overwrite|manual"
  │ (.opencode/skill/system-spec-kit/scripts/wrap-all-templates.ts)
  └ 105 lines found

● Search (grep)
  │ "startIngestJob|paths|enqueue|validate|duplicate|dedup|unchanged|skip|job"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts)
  └ 5 lines found

● Search (grep)
  │ "mkdir|create|template|description.json|overwrite|exists|manual|TODO"
  │ (.opencode/skill/system-spec-kit/scripts/spec-folder/directory-setup.ts)
  └ 32 lines found

● Search (grep)
  │ "generateContext|detect.*folder|resolve.*folder|scan|readdir|find|fallback|cache|watch"
  │ (.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts)
  └ 83 lines found

● Search (grep)
  │ "readdir|scan|cache|fallback|closest|detect|find|depth|parent|description.json"
  │ (.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts)
  └ 5 lines found

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L150:210 (61 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1965:2045 (81 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1825:1905 (81 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2295:2355 (61 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2125:2205 (81 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L220:260 (41 lines read)

● Read index-refresh.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts
  └ L1:208 (208 lines read)

● Read file-watcher.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts
  └ L1:220 (220 lines read)

● Read file-watcher.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts
  └ L220:416 (197 lines read)

● Read job-queue.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts
  └ L520:728 (209 lines read)

● Read job-queue.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts
  └ L260:520 (261 lines read)

● Read job-queue.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts
  └ L1:260 (260 lines read)

● Read memory-ingest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts
  └ L1:332 (332 lines read)

● Read wrap-all-templates.ts
  │ .opencode/skill/system-spec-kit/scripts/wrap-all-templates.ts
  └ L1:156 (156 lines read)

● Read generate-context.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts
  └ L460:550 (91 lines read)

● Read directory-setup.ts
  │ .opencode/skill/system-spec-kit/scripts/spec-folder/directory-setup.ts
  └ L1:115 (115 lines read)

I’ve confirmed the biggest issues in code: refresh detection without healing, watcher warnings without escalation, strictly sequential ingest, and several “tell the user to rerun/fix it manually” loops. I’m checking folder detection and `SKILL.md` now to tie those back to the actual workflow users follow.

● Read folder-detector.ts
  │ .opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts
  └ L640:760 (121 lines read)

● Read folder-detector.ts
  │ .opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts
  └ L880:980 (100 lines read)

● Search (grep)
  │ "function .*detect|findChildFolderSync|readdirSync|readdir\(|description\.json|cache|Map<|closes
  │ t|ancestor|recursive" (.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts)
  └ 112 lines found

● Search (grep)
  │ "save|context|memory|spec
  │ folder|rebuild|retry|manual|run|Step|generate|index|watch|template|create"
  │ (.opencode/skill/system-spec-kit/SKILL.md)
  └ 5 lines found

● Read SKILL.md
  │ .opencode/skill/system-spec-kit/SKILL.md
  └ L1:220 (220 lines read)

● Read SKILL.md
  │ .opencode/skill/system-spec-kit/SKILL.md
  └ L220:520 (300 lines read)

● Read SKILL.md
  │ .opencode/skill/system-spec-kit/SKILL.md
  └ L520:847 (287 lines read)

● Search (grep)
  │ "memory_save|memory_index_scan|save memory|index|watch|spec
  │ folder|specs/|generate-context|rebuild|retry|Step" (.opencode/skill/system-spec-kit/SKILL.md)
  └ 5 lines found

I’ve got the user-facing side too: `SKILL.md` explicitly tells operators to run create/save/index/validate steps by hand in several places, which lines up with the code paths that currently stop at “detect and warn” rather than “repair and continue.”

● Read SKILL.md
  │ .opencode/skill/system-spec-kit/SKILL.md
  └ L802:847 (46 lines read)

● Read folder-detector.ts
  │ .opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts
  └ L1107:1260 (154 lines read)

● Read folder-detector.ts
  │ .opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts
  └ L1398:1450 (53 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2195:2285 (91 lines read)

● Search (grep)
  │ "persistIndexingStatus|description.json|regenerate|corrupt|rebuild|retry later|Run \"npm run
  │ rebuild\"" (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 112 lines found

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2278:2294 (17 lines read)

● Search (grep)
  │ "ensureIndexFresh\(|getIndexStats\(|getWatcherMetrics\(|memory_index_scan|memory_save\(|updateMe
  │ tadataEmbeddingStatus" in **/*.{ts,md} (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "getWatcherMetrics\(" in **/*.ts (.opencode/skill/system-spec-kit)
  └ 44 lines found

● Search (grep)
  │ "ensureIndexFresh\(" in **/*.ts (.opencode/skill/system-spec-kit)
  └ 11 lines found

● Search (grep)
  │ "getIndexStats\(" in **/*.ts (.opencode/skill/system-spec-kit)
  └ 17 lines found

● Search (grep)
  │ "updateMetadataEmbeddingStatus" in **/*.ts (.opencode/skill/system-spec-kit)
  └ 41 lines found

● Read job-queue.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts
  └ L244:286 (43 lines read)

## Findings

### 1. Frequent manual steps are still part of the happy path

- `SKILL.md:355-375, 497-505, 600-603, 663-668, 806-812` still tells users/operators to manually run `create.sh`, `generate-context.js`, `memory_index_scan()`/`memory_save()`, `validate.sh`, alignment verification, completeness checks, and even a shell pipeline to find the next spec number.

- `scripts/spec-folder/directory-setup.ts:68-88` auto-creates only the `memory/` subdir. If the spec folder is missing, it stops and tells the user to create it first.

- `scripts/core/workflow.ts:2352-2354` explicitly falls back to a manual retry path: `Run "npm run rebuild" to retry indexing later`.

- `scripts/wrap-all-templates.ts:89-156` is a standalone maintenance script; nothing here auto-runs it when templates change.

### 2. Self-healing exists, but it is uneven and stops too early

Already good:

- `scripts/memory/generate-context.ts:477-548` tries to recover bad spec-folder input by resolving child folders and deep-scanning for matches.

- `scripts/core/workflow.ts:2204-2245` regenerates missing/corrupt `description.json` and retries a lost-update race once.

- `mcp_server/lib/ops/job-queue.ts:703-714` resets incomplete jobs to `queued` on startup and re-enqueues them.

Missing:

- `mcp_server/lib/storage/index-refresh.ts:189-197` only detects stale index state; it does **not** trigger repair.

- `mcp_server/lib/ops/file-watcher.ts:241-243, 379-381` only logs watcher/reindex failures with `console.warn`; there is no escalation, restart, or quarantine flow.

### 3. Strong batch-operation opportunities are visible

- `mcp_server/lib/ops/job-queue.ts:586-593` even labels an `embedding` phase as a placeholder for batch preprocessing, but the worker still processes files one-by-one (`649-695`).

- `mcp_server/handlers/memory-ingest.ts:131-199` validates paths individually, and `job-queue.ts:251-252` only trims paths; it does not deduplicate them before enqueue.

- `scripts/wrap-all-templates.ts:100-130` processes every template serially.

- `scripts/spec-folder/folder-detector.ts:642-679, 888-980` repeatedly walks directory trees; this is a good candidate for shared inventory batching/caching.

### 4. Scheduling is the biggest missing automation layer

- Incremental maintenance is event-driven only: `file-watcher.ts:370-378` reacts to `add/change/unlink`.

- Backlog healing is not scheduled: `index-refresh.ts:103-115, 189-197` can identify `pending/retry/partial` rows, but there is no timer/cron/off-peak sweep to fix them.

- `SKILL.md:600-603` confirms the gap operationally: after `generate-context.js`, users are told to manually run `memory_index_scan()` or `memory_save()` for immediate visibility.

### 5. Monitoring gaps: the system knows things, but doesn’t surface them well

- `file-watcher.ts:47-62` and `index-refresh.ts:66-98` expose watcher/index stats, but I did not find runtime usage outside module/tests.

- Failures mostly become log lines: `file-watcher.ts:243, 381`, `job-queue.ts:628, 693-694`.

- There is no visible stale-index alarm, queue-depth alarm, repeated-failure threshold, or “watcher unhealthy” state.

### 6. Index maintenance is partially automatic, not fully automatic

- Automatic: watched markdown changes are reindexed on add/change/remove (`file-watcher.ts:251-378`).

- Manual/stubbed: non-success backlog recovery is unfinished (`index-refresh.ts:187-197`), and the user docs still rely on manual scan/save follow-ups (`SKILL.md:600-603`).

So the answer is: **automatic for live watched changes, manual for backlog recovery and catch-up**.

### 7. Cache invalidation is mixed

- Good: watcher hash invalidation looks correct within a running process. Same-content changes are skipped, adds can force reindex, and deletes clear cached hashes (`file-watcher.ts:319-340, 350-366, 370-378`).

- Weak: there is no broader invalidation/recovery loop for index states like `pending/retry/partial` (`index-refresh.ts:121-138, 189-197`).

- `folder-detector.ts:1403-1415` caches autodetect candidates only per detection call, which avoids stale long-lived cache bugs, but also means repeated rescans instead of maintained inventory.

## Highest-value automation wins

1. Turn `ensureIndexFresh()` into an actual repair scheduler.

2. Auto-run index follow-up after `generate-context.js` succeeds.

3. Promote watcher/index/queue stats into a health endpoint/tool with alert thresholds.

4. Batch ingest embedding work and deduplicate input paths before enqueue.

5. Replace manual spec-number / missing-folder workflows with one idempotent scaffold command.

