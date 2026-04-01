# Iteration 10: Opt-In Feature Assessment -- Should They Be Enabled by Default?

## Focus
The user's primary request is "make sure all features (except shared memory) are enabled by default." From iteration 1, six features are currently opt-in or OFF by default:

1. **SPECKIT_MEMORY_RECONSOLIDATION** (reconsolidation-on-save)
2. **SPECKIT_FILE_WATCHER** (real-time file watching)
3. **RERANKER_LOCAL** (local GGUF reranker)
4. **SPECKIT_QUALITY_LOOP** (verify-fix-verify quality loop)
5. **SPECKIT_NOVELTY_BOOST** (cold-start novelty boost)
6. **SPECKIT_MEMORY_ADAPTIVE_RANKING** (adaptive ranking)

This iteration investigates each feature's purpose, risk profile, and whether it should be enabled by default.

## Findings

### Finding 1: SPECKIT_NOVELTY_BOOST is permanently disabled (INERT) -- no action needed

The `calculateNoveltyBoost()` function in `composite-scoring.ts:529` always returns `0`, regardless of the env var setting. The code comment reads: "Eval complete. Marginal value confirmed. SPECKIT_NOVELTY_BOOST env var is inert. Always returns 0." The constants (`NOVELTY_BOOST_MAX=0.15`, `NOVELTY_BOOST_HALF_LIFE_HOURS=12`, `NOVELTY_BOOST_SCORE_CAP=0.95`) are retained only for test compatibility.

**Verdict**: No action needed. The feature was evaluated, found to have marginal value, and permanently disabled at the code level. Setting the env var to `true` would have zero effect.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:522-531`]

### Finding 2: SPECKIT_MEMORY_RECONSOLIDATION -- RECOMMEND ENABLE with checkpoint prerequisite

**What it does**: TM-06 reconsolidation-on-save. After embedding generation during `memory_save`, searches top-3 most similar memories in the same spec folder:
- Similarity >= 0.88: MERGE (duplicate content merged, importance_weight boosted)
- Similarity 0.75-0.88: CONFLICT (supersedes prior memory via causal edge)
- Similarity < 0.75: COMPLEMENT (stored unchanged)

**Why opt-in**: The module header states "REQUIRES: checkpoint created before first enable." This is a safety measure -- reconsolidation can merge or supersede existing memories, which is destructive. A checkpoint provides rollback capability.

**Risk of enabling by default**: MEDIUM. The feature modifies existing memories on save. Without a checkpoint, merged/superseded memories cannot be recovered. However, the thresholds are conservative (0.88 for merge is very high similarity), and the feature dramatically reduces memory bloat over time.

**Note**: There is also `SPECKIT_ASSISTIVE_RECONSOLIDATION` which IS already graduated to default-ON (`search-flags.ts:554`). This is a lighter version (reconsolidation-bridge.ts line 58: "Default: ON (graduated)"). The full reconsolidation adds deeper similarity-based merge/conflict routing.

**Recommendation**: ENABLE by default, but with auto-checkpoint creation on first activation. The assistive variant is already ON, so the full version is a natural progression.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:1-14`]
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:158-163`]
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:40-58`]

### Finding 3: SPECKIT_FILE_WATCHER -- KEEP OPT-IN (external dependency)

**What it does**: P1-7 real-time file watcher using chokidar. Monitors markdown files for changes and triggers automatic reindexing.

**Why opt-in**: The flag check at `search-flags.ts:298` has a double gate: first checks the env var explicitly (`!== 'true'` returns false), then also checks `isFeatureEnabled('SPECKIT_FILE_WATCHER')` for rollout policy. This requires the chokidar npm package, which is a native dependency that may not be available in all environments.

**Risk of enabling by default**: HIGH. Chokidar requires native binaries, starts background file system watchers consuming resources, and may conflict with other file watchers in the user's environment. The README confirms (`README.md:1137`): "Enable chokidar-based auto re-indexing" with default `false`.

**Recommendation**: KEEP OPT-IN. This requires an external native dependency (chokidar) that isn't guaranteed to be installed, consumes background resources (file descriptors, CPU for polling), and may cause issues in CI/container environments. Users who want it should explicitly opt in.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:293-299`]
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:1137`]

### Finding 4: RERANKER_LOCAL -- KEEP OPT-IN (heavy native dependency + RAM requirement)

**What it does**: P1-5 local GGUF reranker using `node-llama-cpp` with `bge-reranker-v2-m3.Q4_K_M.gguf` model. Provides cross-encoder-quality reranking without API calls.

**Why opt-in**: The flag check at `search-flags.ts:308` uses the same double-gate as FILE_WATCHER. The implementation at `local-reranker.ts:209-213` states: "operator opts in with `RERANKER_LOCAL=true`, has enough total RAM, and the runtime/model guards pass." The module includes explicit RAM checks before loading the model.

**Risk of enabling by default**: VERY HIGH. Requires:
1. `node-llama-cpp` native dependency (not standard)
2. A downloaded GGUF model file (hundreds of MB)
3. Sufficient RAM (the module checks available memory)
4. The graceful degradation fallback (returns unchanged ordering) would mask the fact that it's silently not working

**Recommendation**: KEEP OPT-IN. This is a heavyweight optional enhancement that requires specific hardware and software prerequisites. Enabling it by default would cause startup warnings/errors for most users.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:5-6, 209-213, 275`]
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:303-309`]

### Finding 5: SPECKIT_QUALITY_LOOP -- RECOMMEND ENABLE (pure algorithmic, no dependencies)

**What it does**: T008 verify-fix-verify quality loop for memory saves. Computes a quality score on memory content, attempts auto-fix if below threshold (0.6), rejects after maxRetries (2) failures. Checks for anchor format, trigger phrase quality, and content structure.

**Why opt-in**: The code comment at `quality-loop.ts:569` says "Gated behind SPECKIT_QUALITY_LOOP env var." The implementation is pure algorithmic with no external dependencies. Retry attempts are "deterministic local transforms" with "immediate retries" (no delay/backoff). The loop is "tightly bounded" within a single request cycle.

**Risk of enabling by default**: LOW. The quality loop is:
- Deterministic (same input always produces same output)
- Bounded (max 2 retries, no network calls)
- Non-destructive (only affects new saves, not existing memories)
- Predictable latency (immediate retries, local transforms only)

The only potential issue: it could reject saves that previously would have succeeded with low-quality content. But this is actually desirable behavior -- it prevents low-quality memories from entering the index.

**Recommendation**: ENABLE by default. Pure algorithmic, bounded, deterministic, non-destructive. Prevents low-quality memory saves. No external dependencies.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:566-589`]
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:314-317`]

### Finding 6: SPECKIT_MEMORY_ADAPTIVE_RANKING -- KEEP OFF (roadmap/shadow feature, not ready)

**What it does**: Adaptive ranking with feedback-driven weight adjustment. The `getAdaptiveMode()` function at `adaptive-ranking.ts:333` resolves to three modes: 'disabled' (default), 'shadow' (compute but don't apply), 'promoted' (active). When enabled without explicit mode, it defaults to 'shadow' mode only.

**Why OFF by default**: This is explicitly a roadmap feature in the feature graduation pipeline (as confirmed in iteration 2): roadmap -> shadow -> promoted -> default-on. It uses `isAdaptiveFlagEnabled()` which checks both `SPECKIT_MEMORY_ADAPTIVE_RANKING` and `SPECKIT_HYDRA_ADAPTIVE_RANKING` via `capability-flags.ts:58,67`. The capability flags system (`capability-flags.ts`) treats this as a roadmap feature that hasn't been promoted yet.

**Risk of enabling by default**: LOW in shadow mode (compute overhead only, no ranking change). MEDIUM in promoted mode (changes ranking behavior based on feedback data that may be sparse).

**Recommendation**: KEEP OFF until the feature graduation process promotes it. Even if enabled, it defaults to shadow mode which is non-functional for end users. The feature needs more evaluation data before promotion.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:321-337`]
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:58,67`]

### Finding 7: Summary Recommendation Table

| Feature | Current | Recommended | Risk | Rationale |
|---------|---------|-------------|------|-----------|
| SPECKIT_NOVELTY_BOOST | OFF (inert) | NO ACTION | None | Code always returns 0. Eval showed marginal value. Env var is dead code. |
| SPECKIT_RECONSOLIDATION | OFF (opt-in) | **ENABLE** | Medium | Auto-dedup on save. Assistive variant already ON. Add auto-checkpoint guard. |
| SPECKIT_FILE_WATCHER | OFF (opt-in) | KEEP OFF | High | Requires chokidar native dep. Background resource consumption. Not portable. |
| RERANKER_LOCAL | OFF (opt-in) | KEEP OFF | Very High | Requires node-llama-cpp + GGUF model + RAM. Heavy native dependency. |
| SPECKIT_QUALITY_LOOP | OFF (opt-in) | **ENABLE** | Low | Pure algorithmic, bounded, deterministic. Prevents low-quality saves. |
| SPECKIT_MEMORY_ADAPTIVE_RANKING | OFF (roadmap) | KEEP OFF | Low-Medium | Roadmap feature. Shadow mode only when enabled. Needs graduation. |

**Net recommendation**: Enable 2 of 6 features by default (RECONSOLIDATION, QUALITY_LOOP). Keep 3 opt-in (FILE_WATCHER, RERANKER_LOCAL, ADAPTIVE_RANKING). 1 is already inert (NOVELTY_BOOST).

## Ruled Out
- Enabling FILE_WATCHER by default -- requires chokidar native dependency not guaranteed available
- Enabling RERANKER_LOCAL by default -- requires node-llama-cpp + GGUF model + sufficient RAM
- Treating NOVELTY_BOOST as actionable -- code permanently returns 0, env var is inert
- Forcing ADAPTIVE_RANKING to promoted mode -- roadmap feature needs graduation process

## Dead Ends
- None. All 6 features investigated successfully with clear verdicts.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts` (flag definitions, lines 158-318)
- `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts` (novelty boost, lines 510-531)
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts` (reconsolidation module, lines 1-50)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts` (assistive recon, lines 40-58)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts` (quality loop, lines 566-589)
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts` (local reranker, lines 5-275)
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts` (adaptive ranking, lines 310-337)
- `.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts` (capability flags, lines 58-67)
- `.opencode/skill/system-spec-kit/mcp_server/README.md` (file watcher docs, line 1137)

## Assessment
- New information ratio: 0.64
- Questions addressed: opt-in feature assessment (all 6 features)
- Questions answered: Complete verdict on all 6 opt-in features with enable/keep-off recommendation

## Reflection
- What worked and why: Reading the flag implementation code in search-flags.ts gave definitive understanding of the gating mechanism for each feature. The double-gate pattern (explicit env check + isFeatureEnabled rollout) for FILE_WATCHER and RERANKER_LOCAL immediately signaled these have external dependency concerns. The NOVELTY_BOOST code returning constant 0 was the fastest resolution.
- What did not work and why: N/A -- all features investigated successfully.
- What I would do differently: Could have read the local-reranker.ts full RAM-check logic for a more detailed risk assessment, but the module header and flag code were sufficient for the recommendation.

## Recommended Next Focus
Implementation plan: Draft the specific code changes needed to enable RECONSOLIDATION and QUALITY_LOOP by default, including the auto-checkpoint guard for reconsolidation. This would be the actionable output of this research for spec folder work.
