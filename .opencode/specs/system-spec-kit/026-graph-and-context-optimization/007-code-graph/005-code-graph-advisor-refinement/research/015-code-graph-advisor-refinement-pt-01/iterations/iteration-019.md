# Iteration 19: Per-PR Rollback Plans + Monitoring + Revert SLO + Implementation Comms

## Focus

Risk-review pass on the iter-18 master roadmap. For each of the 10 default PRs, deliver:
pre-merge sanity checks, post-merge monitoring, exact revert procedure, revert SLO, canary
strategy, and rollback blockers. Plus a milestone-keyed `implementation-summary.md` comms
plan for `015-code-graph-advisor-refinement` (after batches A, B, C).

This is a **synthesis iteration** — no new external evidence; all PR shapes are recovered
from iter-18 F83 + iter-18 delta JSONL. Value-add is risk surface mapping + revert
operational detail + monitoring discipline that the executor needs but iter-18 deliberately
deferred.

## Inputs (recovered)

- Iter-18 F83 master roadmap (10 default PRs + PR 11 contingent), iter-18 delta JSONL
  (per-PR scope + LOC deltas + dependencies + risk text)
- Iter-16 F73 metric catalog (14 canonical metrics, label cardinality bounds)
- Iter-17 F77-F82 prompt-cache race + 5-LOC patch site
- Iter-15 F71 vocabulary mapping (5 surfaces × 4 modules)
- Iter-14 cross-packet preflight (zero importers verified for promotion subsystem)

## Findings

### F86 — Per-PR Rollback + Monitoring Plan

Format: per-PR card. SLO categories:
- **15min** = blast radius is dev-only, advisor brief, or pre-prod tooling — revert directly on main
- **1hr** = production-runtime instrumented surface, observable regression — revert within next on-call window
- **next-business-day** = bench/test-only surface, no runtime impact — schedule fix-forward or revert in regular cadence

#### PR 1 — corpus-path bench wiring fix (P0, 4 LOC, S)

- **Pre-merge sanity**:
  - `tsc --noEmit` clean
  - `vitest run skill-advisor/bench/scorer-bench.ts` produces non-zero corpus rows (was previously failing silently with empty corpus)
  - `node -e "require('./package.json').bench"` resolves the new `corpusPath` if added
- **Post-merge monitoring**: 24h watch on CI bench-job exit code. No runtime telemetry needed
  (bench is dev-only).
- **Revert procedure**: `git revert <sha>` on the single 4-line commit. No downstream cleanup.
  Restored LOC: 4.
- **Revert SLO**: **next-business-day**. Bench-only; zero production blast radius.
- **Canary**: none needed.
- **Rollback blockers**: none. PR 3 (delete sweep) explicitly depends on PR 1 landing first
  for blame-history hygiene, but PR 1 is structurally independent of PR 3 — reverting PR 1
  does not break PR 3 if PR 3 has already landed (the deleted bench files no longer exist
  to re-introduce the bug).

#### PR 2 — `.claude/settings.local.json` rewrite (P0, -31 LOC, S)

- **Pre-merge sanity**:
  - JSON validity: `jq . .claude/settings.local.json`
  - Schema match: file conforms to Claude Code `settings.local.json` shape (single-array
    `hooks.UserPromptSubmit`)
  - Smoke test: launch Claude Code session locally, prompt arbitrary text, capture
    Read-tool log to verify single advisor brief renders (per iter-18 PR 2 mitigation)
- **Post-merge monitoring**: First 1h watch on user-reported absent-or-duplicate advisor
  brief in any operator channel. (No telemetry surface — Claude Code is closed-source.)
- **Revert procedure**: `git revert <sha>`. Restores 31 LOC of broken parallel-hook block.
  Restored LOC: 31. No downstream cleanup unless PR 7 already landed (see Rollback blockers).
- **Revert SLO**: **15min**. User-facing dev tooling regression; revert directly on main if
  any operator reports the advisor brief disappeared.
- **Canary**: none — settings file is per-machine; user can locally override before merge.
- **Rollback blockers**:
  - **If PR 7 has landed**, the new test asserts the post-PR-2 shape; reverting PR 2 will
    fail PR 7's parity test. Mitigation: revert PR 2 + PR 7 together, or temporarily skip
    the parity test with `.skip` and log a TODO.
  - The user maintains AGENTS.md triad (per-user instruction); if the triad references
    the new settings shape in prose, those docs must also be reverted/patched.

#### PR 3 — promotion subsystem DELETE sweep (P1, -1311 LOC, M) — **HIGHEST REVERT COST**

- **Pre-merge sanity** (rigor matches blast radius):
  - `tsc --noEmit` clean across full repo (verifies zero importers post-delete; iter-14
    preflight asserted this, but pre-merge re-run is mandatory)
  - `vitest run` full suite passes (deleted tests should not orphan any helper imports)
  - `git grep -l 'lib/promotion\|promotion-cycle\|promotion-orchestrate' -- '*.md' '*.ts' '*.json'`
    returns ZERO matches (doc scrub verification)
  - `git grep -l 'corpus-bench\|safety-bench\|holdout-bench' -- '*.json' '*.md'` returns ZERO
    matches (package.json + docs)
  - Sibling-spec doc grep: no stale references in `002-skill-graph-daemon-and-advisor-unification`
    or `042-sk-deep-research-review-improvement-2`
- **Post-merge monitoring**:
  - 48h watch on CI test/bench job failures
  - 48h watch on operator reports of "feature missing" (none expected — iter-14 verified
    zero callers — but the long monitor window guards against an undocumented external
    consumer)
  - Watch sibling-spec authors' git activity for stale-link follow-ups
- **Revert procedure** (the load-bearing case):
  - **Single-commit revert**: `git revert <sha>` if PR 3 was landed as one commit. Git
    revert restores all 1116 code LOC + 195 doc LOC = 1311 LOC. The revert commit is the
    same size as the original delete commit, so review burden on the revert PR is
    proportional.
  - **Cherry-pick if multi-commit**: if PR 3 landed as a branch with multiple commits
    (recommended for review burden), `git revert -m 1 <merge-sha>` reverts the merge.
    Restored LOC: 1311 (full).
  - **Selective revert** (if only one file's deletion turned out wrong): `git checkout
    <sha-before-delete> -- path/to/file` then re-commit; restores partial LOC. Use this
    path if a single sibling spec turns out to import a deleted module after merge.
  - **Downstream cleanup needed if PRs 4, 5 have already landed**:
    - PR 4 (vocabulary unification) does NOT touch promotion code — no conflict
    - PR 5 (metrics scaffold) explicitly omits promotion metrics — no conflict
    - PR 6, 7, 8, 9, 10 do not touch promotion code — no conflict
    - **NO downstream cleanup needed if any of PRs 4-10 land before revert.** This is the
      intentional consequence of the iter-18 "disposal before related metric design"
      ordering principle.
  - **AGENTS.md triad sync** (per-user standing instruction): revert any AGENTS.md /
    AGENTS_Barter.md / AGENTS_example_fs_enterprises.md edits made in the same PR.
- **Revert SLO**: **1hr**. The DELETE is invasive but reversible without data loss
  (everything is in git). Operator must triage within one on-call window — if a hidden
  consumer surfaces 48h+ later, by then enough fix-forward options exist that revert is
  no longer the right tool.
- **Canary**: NOT APPLICABLE — deletion is binary; cannot canary "fewer files exist for
  some users". Rolled out to everyone or no one.
- **Rollback blockers** (this is what makes PR 3 the highest-revert-cost PR):
  - **Schema migrations**: NONE — promotion subsystem had no DB tables in scope
  - **Data writes**: NONE — promotion was never wired to a runtime emission path
  - **The size of the revert PR itself** (1311 LOC) is the operational blocker: reviewing
    a 1311-LOC revert is non-trivial. Mitigation: keep the original PR 3 single-commit so
    `git revert -m 1` restores cleanly; require reviewers to validate by file count and
    diff symmetry rather than line-by-line review of the revert.
  - **Sibling-spec doc updates that reference "promotion subsystem deleted"** become
    stale on revert. Mitigate by tagging all PR 3 doc-scrub commits with a
    `delete-sweep-doc-scrub` git trailer so a reverse grep can find them all.
  - **iter-13 F37-CLOSURE memo** asserts Option A was ratified; reverting PR 3 implicitly
    re-opens the question. Operator must explicitly re-document the rollback decision in
    `decision-record.md` (Level 3 doc) to avoid future re-litigation.

#### PR 4 — state-vocabulary unification (P1, ~30 LOC, M) — **MIGRATION RISK**

- **Pre-merge sanity**:
  - `tsc --noEmit` clean (catches type-narrowing breaks; iter-18 risk note flagged this)
  - `vitest run` full suite passes
  - **Manual spot-check on 4 surfaces** (per iter-18 mitigation):
    - `code_graph_status` returns canonical state value
    - `code_graph_context` returns canonical state value in payload
    - `code_graph_query` (any mode) returns canonical state value
    - Startup brief renders canonical state value in human-readable form
  - **Deprecation alias check**: `git grep -l 'GraphFreshness\|TrustState'` to confirm
    legacy aliases still re-export for one-release deprecation window
- **Post-merge monitoring**:
  - 24h watch on advisor-brief renderer error rate (PR 5 metric `advisor.brief.error_rate`
    will be live by then if PR 5 has merged; otherwise watch error logs)
  - **Migration consumer check**: grep external consumers (Barter, fs-enterprises) for
    field names like `freshness`, `state`, `payloadTrust`, `readinessState` — if any
    consumer was reading a deprecated field name, this is where it breaks
- **Revert procedure**: `git revert <sha>`. Restores 30 LOC across 4 files. Downstream
  cleanup: re-add the 5 V1-V5 alias type-exports if any downstream consumer started
  using the canonical name (search `git log -p -- code-graph/lib/readiness-contract.ts`
  for any consumer-side commits that reference the canonical name).
- **Revert SLO**: **1hr**. Vocabulary changes are silent-failure-prone; if a consumer
  starts seeing `undefined` for a renamed field, fast revert is the right call.
- **Canary**: shadow-only feasible — emit BOTH old and new field names in the response
  payload for one release, with a deprecation warning header. Not strictly necessary if
  the iter-15 F71 mapping confirms 4 surfaces only and consumer audit is clean, but
  recommended for migration safety.
- **Rollback blockers**:
  - **Consumer reading deprecated field name**: this is the primary migration risk. The
    iter-15 F71 mapping enumerates internal sites only (5 surfaces × 4 modules); it does
    NOT cover external consumers. **Pre-merge mitigation**: grep AGENTS.md triad +
    sibling-spec docs for any prose mentioning V1-V5 names; grep external Barter +
    fs-enterprises for the same.
  - **Discriminated-union narrowing**: if the new `TrustState` is a literal-discriminated
    union, downstream callers that previously used `string` may now fail type-check.
    Revert restores the looser contract but leaves the new type-only callers broken until
    they update — non-blocking for runtime.
  - **PR 5 dependency**: PR 5 (metrics) uses canonical state vocabulary in label values.
    If PR 5 has landed and PR 4 reverts, metric label values stop matching expected
    enums. Mitigation: revert PR 4 + PR 5 together, OR revert PR 4 standalone and accept
    24-48h of "unknown_state" label values until PR 5's label mapping is patched.

#### PR 5 — instrumentation namespace scaffold (P1, +150 LOC, L) — **SCHEMA VERSION RISK**

- **Pre-merge sanity**:
  - `tsc --noEmit` + `vitest run` clean
  - **Cardinality dry-run**: spin up a local 1-hour load test, count distinct
    `(metric, label-tuple)` combinations; assert ≤ 14 metrics × bounded labels (4 runtimes
    × 8 languages × 2 outcomes × bucketed values). Hard cap: 14 × 4 × 8 × 2 × 10 = 8,960
    distinct series. Anything above suggests a label leak (unbounded user input as label).
  - **Snake_case audit**: `git grep '"speckit\.' mcp_server/skill-advisor/lib/metrics.ts`
    returns ZERO (dotted names are doc-only per iter-16 F74; on-disk emission must be
    snake_case)
  - **Bucket-boundary verification**: `nodes_bucket` boundaries match the iter-16 F73
    catalog (e.g., 0-100, 100-1k, 1k-10k, 10k+); `near_dup_distance_bucket` matches the
    iter-3 hash-distance buckets
  - **Promotion-metric absence**: `git grep -i promotion mcp_server/skill-advisor/lib/metrics.ts`
    returns ZERO (per iter-16 F73 footer)
- **Post-merge monitoring**:
  - **First 24h: CARDINALITY WATCH** — emit `metrics_unique_series_count` as a meta-metric
    (single gauge); alert if > 9000 series in any 5-minute window. This is the single most
    important PR-5-specific monitoring signal.
  - **First 48h**: per-metric emission rate (asserts every metric is being emitted at all;
    catches "metric defined but never emitted" bugs)
  - **First 7 days**: scorer fusion + attribution outputs unchanged (the metric emission
    sites in `fusion.ts:172-230` and `attribution.ts:10-31` should be observation-only;
    any logic mutation here would silently corrupt scores)
- **Revert procedure**: `git revert <sha>`. Restores `lib/metrics.ts` to its 473-LOC
  baseline; removes 8 emission-site call additions. **Persistence schema concern**: if
  PR 5 introduced a new on-disk metrics file format (new fields in the JSONL output of
  `lib/metrics.ts`), revert truncates downstream metrics-collector consumers. Mitigation:
  PR 5 must NOT bump the persistence schema version — it must extend the existing
  schema additively. If a schema version bump is unavoidable, ship the bump in a separate
  PR 5a with its own revert plan (out of scope for this iter-19 plan).
- **Revert SLO**: **1hr** for cardinality/perf regressions; **next-business-day** for
  metric-name typos or missing emissions (those are fix-forward). Cardinality blowup
  manifests as collector ingestion lag → operator-visible within minutes.
- **Canary**: **percentage rollout RECOMMENDED** — gate metric emission behind a
  `SPECKIT_METRICS_ENABLED` env var, default off; flip on for 10% of dev sessions for
  24h, then 50%, then 100%. The 14-metric extension is the largest emission-surface
  expansion in this roadmap and warrants the strictest canary discipline.
- **Rollback blockers**:
  - **Persistence schema version bump** (the single hardest-to-revert thing). PR 5 must
    use additive-only schema changes; verify pre-merge that no existing metric record is
    re-shaped. If a bump is unavoidable, isolate it.
  - **Downstream metrics-collector that started indexing new metrics**: if a Prometheus
    scrape config or similar pulls the new metrics, revert leaves the scrape config
    pointing at metrics that no longer emit. Cleanup: revert the scrape config in the
    same PR.
  - **Iter-16 F77 signal-only metric for prompt-cache race**: PR 6 fixes the underlying
    race. If PR 5 reverts and PR 6 has landed, the signal-only metric disappears but the
    fix is still in place — operationally fine, just loses observability.
  - **PR 8/9/10 benches consume PR 5 metrics**: if any of PR 8/9/10 have landed before
    revert, those benches will produce zeros for the reverted metrics. Cleanup: revert
    PR 8/9/10 OR mark their thresholds as "skip while PR 5 reverted".

#### PR 6 — prompt-cache invalidation listener wireup (P1, +5 LOC, S)

- **Pre-merge sanity**:
  - `tsc --noEmit` + `vitest run` clean (the iter-17 F81 patch shape is 5 lines; should
    not introduce type errors)
  - **Listener uniqueness assertion**: add a unit test asserting only one listener is
    registered per process (catches "listener registered per-request" bug from iter-18
    risk note)
  - **Patch-site verification**: confirm site is `skill-advisor-brief.ts` module-init
    scope, not request-handler scope
- **Post-merge monitoring**:
  - 24h watch on PR-5 signal-only metric `advisor.prompt_cache.invalidation_received`
    (should fire once per upstream cache-invalidation event)
  - 24h watch on `advisor.prompt_cache.clear_count` (should match the invalidation count
    1:1; mismatch indicates the listener is not wired)
  - Listener-uniqueness check via log-grep for "listener registered" line; should appear
    once at process start
- **Revert procedure**: `git revert <sha>`. Restores 5 LOC. No downstream cleanup. Cache
  reverts to the iter-17 F77 stale-state behavior (signal-only metric continues to fire,
  alerting that the race is back).
- **Revert SLO**: **1hr**. Cache staleness is observable but not catastrophic; revert if
  duplicate-clear log-spam is excessive (per iter-18 risk note).
- **Canary**: none — 5 LOC, single listener registration; canary adds no signal.
- **Rollback blockers**: none material. PR 4 dependency means PR 6 references the
  canonical `TrustState` type; reverting PR 4 + PR 6 together is the clean path if
  PR 4 needs revert.

#### PR 7 — settings-driven-invocation-parity test (P1, +150 LOC, M)

- **Pre-merge sanity**:
  - `vitest run mcp_server/skill-advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts`
    passes
  - **Schema-mock brittleness check** (per iter-18 risk): test should assert ONLY
    `hooks.UserPromptSubmit[0].command` shape; should NOT assert env vars, matchers, or
    other fields that may legitimately change
  - **Claude-only assertion**: test must include a runtime check that skips on
    non-Claude environments (per iter-10 F51 retraction)
- **Post-merge monitoring**: 24h watch on CI test-job pass rate. No runtime telemetry —
  test-only.
- **Revert procedure**: `git revert <sha>`. Restores test removal (deletes the new file).
  Restored LOC: 150 (test file). No downstream cleanup.
- **Revert SLO**: **next-business-day**. Test-only; no runtime impact. Revert if test is
  flaky or over-specified.
- **Canary**: none.
- **Rollback blockers**: none. Test depends on PR 2's settings shape — if PR 2 reverts,
  PR 7 fails; revert both together (see PR 2 rollback blockers).

#### PR 8 — `bench/code-graph-parse-latency.bench.ts` (P2, +80 LOC, S)

- **Pre-merge sanity**:
  - Bench runs to completion (`vitest bench` or whatever the project bench runner is)
  - Asserts non-zero sample count per language (per iter-18 mitigation)
  - Emits PR 5 metric `speckit_graph_parse_duration_ms` — verify metric appears in
    collector output
- **Post-merge monitoring**: 48h watch on CI bench-job exit code. Single P2 bench; low
  impact.
- **Revert procedure**: `git revert <sha>`. Restores 80 LOC removal (deletes the new
  file). No downstream cleanup.
- **Revert SLO**: **next-business-day**. Bench-only.
- **Canary**: none.
- **Rollback blockers**: none. Depends on PR 5; if PR 5 reverts, PR 8 emits no metrics;
  revert together or mark thresholds skip.

#### PR 9 — `bench/code-graph-query-latency.bench.ts` (P2, +100 LOC, M)

- **Pre-merge sanity**:
  - Bench runs to completion across all 3 modes (outline, blast_radius, relationship)
  - **Pinned corpus snapshot** (per iter-18 mitigation): bench must pin corpus to a
    hashed snapshot; assert percentile DELTA vs baseline JSON, not absolute thresholds
  - Baseline JSON committed alongside bench
- **Post-merge monitoring**: 7d watch on CI bench percentile drift; alert on > 20% p99
  delta vs baseline.
- **Revert procedure**: `git revert <sha>`. Restores 100 LOC. Also revert the baseline
  JSON file. No downstream cleanup.
- **Revert SLO**: **next-business-day**.
- **Canary**: none.
- **Rollback blockers**: none. Depends on PR 5.

#### PR 10 — `bench/hook-brief-signal-noise.bench.ts` (P2, +80 LOC, S-M)

- **Pre-merge sanity**:
  - Bench runs across all 4 runtimes (claude, codex, gemini, copilot)
  - **Iter-4 7-axis matrix as ground-truth** (per iter-18 mitigation): bench must use the
    iter-4 matrix as fixture for "load-bearing axis = signal; decorative axis = noise"
  - Asserts non-zero signal count per runtime
- **Post-merge monitoring**: 7d watch on signal-noise ratio per runtime; alert on
  > 30% drop vs baseline.
- **Revert procedure**: `git revert <sha>`. Restores 80 LOC. No downstream cleanup.
- **Revert SLO**: **next-business-day**.
- **Canary**: none.
- **Rollback blockers**: none. Depends on PR 5 + PR 7.

### F87 — Risk-tier summary

| PR # | Title | Severity | Effort | Revert SLO | Canary | Highest Risk |
|------|-------|----------|--------|------------|--------|--------------|
| 1 | corpus-path | P0 | S | next-business-day | none | bench-job failure |
| 2 | settings rewrite | P0 | S | 15min | none | advisor brief absent/duplicate |
| 3 | DELETE sweep | P1 | M | **1hr** | NOT APPLICABLE | hidden importer + 1311-LOC revert burden |
| 4 | vocabulary | P1 | M | **1hr** | shadow-only recommended | consumer reading deprecated field |
| 5 | metrics scaffold | P1 | L | **1hr** | **percentage rollout** | cardinality blowup + schema version bump |
| 6 | cache listener | P1 | S | 1hr | none | duplicate-clear log spam |
| 7 | settings test | P1 | M | next-business-day | none | brittle schema mock |
| 8 | parse-latency bench | P2 | S | next-business-day | none | parser failures masked |
| 9 | query-latency bench | P2 | M | next-business-day | none | corpus drift flakiness |
| 10 | signal-noise bench | P2 | S-M | next-business-day | none | subjective signal definition |

The three "1hr SLO" PRs (3, 4, 5, 6) are the operationally-load-bearing set. Everything
else is dev-tooling or test-only with relaxed SLO.

### F88 — Cross-PR rollback-ordering invariants

If multiple PRs need revert in a short window, follow this order to avoid mid-revert
state corruption:

1. **Reverse-of-merge-order is the default**: revert the most recent PR first.
2. **Exception 1**: if PR 2 needs revert and PR 7 has landed, revert PR 7 first (to
   un-skip the broken-shape test), then PR 2.
3. **Exception 2**: if PR 4 needs revert and PR 5 has landed, evaluate label-mismatch
   tolerance:
   - If "unknown_state" label values are tolerable for 24-48h → revert PR 4 standalone +
     patch PR 5 label mapping in a fix-forward
   - If not → revert PR 4 + PR 5 together
4. **Exception 3**: if PR 3 needs revert, NO downstream PR cleanup is needed (per
   iter-18 ordering principle "disposal before related metric design"). Revert PR 3
   standalone is always safe.
5. **AGENTS.md triad sync**: any revert that touched the triad must also revert the
   triad edits in the same revert PR (per user standing instruction).

## Ruled Out

- **Per-PR feature flags as universal canary mechanism**: only PR 5 has emission surface
  large enough to warrant a feature flag (`SPECKIT_METRICS_ENABLED`). Adding a flag for
  every PR is over-engineering and adds revert paths (flag-on + code-on + flag-off +
  code-off matrix). Kept canary only where blast-radius justifies it.
- **Database-migration revert plans**: NONE of the 10 PRs touch a database; all state is
  files-on-disk. Including a "DB rollback" section per PR would be busywork. Mentioned
  only in PR 5 because metrics-collector PERSISTENCE schema is the closest analogue.
- **15-minute SLO for PR 3**: tempting because of blast radius, but operationally
  unrealistic — a 1311-LOC revert PR cannot be reviewed and merged in 15min. 1hr matches
  on-call response cadence and gives reviewers time to validate.
- **Shadow-mode for PR 3**: deletion is binary; "shadow delete" is not a thing.

## Dead Ends

(None new — all dead ends inherited from iters 13/14/16/17.)

## Sources Consulted

- `research/015-code-graph-advisor-refinement-pt-01/iterations/iteration-018.md` (F83
  master roadmap, F84 dependency graph, F85 ordering principles, F86 risk-mitigation
  notes per PR)
- `research/015-code-graph-advisor-refinement-pt-01/deltas/iter-018.jsonl` (per-PR
  scope + LOC deltas + dependency edges + executor hints)
- Iter-16 F73 metric catalog (referenced for PR 5 cardinality bound calculation)
- Iter-17 F77-F82 prompt-cache race chain (referenced for PR 6 listener-uniqueness)
- Iter-15 F71 vocabulary-mapping table (referenced for PR 4 4-surface migration)
- Iter-14 cross-packet preflight memo (referenced for PR 3 hidden-importer risk)

## Assessment

- **New information ratio: 0.30** (synthesis iteration; F86 per-PR rollback table + F87
  risk-tier summary + F88 cross-PR ordering invariants are derivative but provide a new
  operational layer the iter-18 roadmap deliberately deferred. Raw novelty ~0.20 +
  simplification bonus 0.10 for collapsing per-PR risk into a single table + ordering
  invariant set, total 0.30.)
- **Questions addressed**: "What is the rollback / monitoring / SLO discipline per PR?"
  + "What state should `implementation-summary.md` record at each milestone?"
- **Questions answered**: 10 per-PR rollback cards delivered; 1 risk-tier summary table;
  1 cross-PR ordering invariant set; 1 milestone-keyed comms plan (see F89 in delta).

## Reflection

- **What worked and why**: Treating each PR as a single rollback card with a fixed
  template (sanity / monitor / revert procedure / SLO / canary / blockers) made the
  per-PR risk surface comparable across all 10 PRs and surfaced the F87 risk-tier
  pattern (P0 dev-tooling = next-business-day; P1 production-runtime = 1hr; P2
  bench-only = next-business-day). The pattern would have been hard to see if I'd
  written prose per PR instead of tabular cards.
- **What did not work and why**: Initial draft tried to enumerate "what telemetry tells
  us PR 5 caused cardinality blowup" purely abstractly. Concretizing it as a
  `metrics_unique_series_count` meta-metric with a numeric threshold (8,960 series upper
  bound = 14 metrics × bounded labels) forced precision. Without the bound calculation,
  the monitoring criterion would have been unfalsifiable.
- **What I would do differently**: For a future risk-review iteration, I would lead with
  the F87 tier-summary table FIRST and then expand each row, rather than producing
  prose cards and synthesizing the table at the end. Top-down would have surfaced
  cross-PR invariants (F88) earlier in the iteration.

## Recommended Next Focus (iter 20)

Iter-20 (final iter): cross-packet impact map. Audit AGENTS.md triad (Barter symlink +
fs-enterprises) for any prose mentioning the deleted promotion subsystem or V1-V5 state
vocabulary. Iter-14 verified zero importers within the spec; iter-19 verified zero
internal rollback blockers; iter-20 should verify zero EXTERNAL rollback blockers in the
sibling repos. If iter-20 confirms triad is clean, STOP_READY_CONFIRMED becomes
SHIP_READY_CONFIRMED.
