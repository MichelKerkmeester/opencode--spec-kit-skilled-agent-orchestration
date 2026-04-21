---
title: "Iteration 033 — Instrumentation spec: spans, sampling, cardinality, alerts"
iteration: 33
band: F
timestamp: 2026-04-11T13:05:14Z
worker: cli-codex gpt-5.4 xhigh fast
scope: q5_q6_q9_instrumentation
status: complete
focus: "Turn the iter 027 latency budget and iter 017 dashboard metrics into a canonical instrumentation contract: exact span names, required tags, sampling rates, cardinality budget, alert thresholds tied to gate close criteria."
maps_to_questions: [Q5, Q6, Q9]
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-033.md"]

---

# Iteration 033 — Instrumentation Spec

## 1. Goal

Iteration 027 named the latency hooks and stage budgets, iteration 017 named the operator-facing health metrics, and iteration 020 tied those signals to rollout gates. What phase 019 still lacks is a canonical contract for how instrumentation is emitted so the runtime, dashboards, and gate reviews all talk about the same thing.

This iteration fixes four ambiguities:

1. Exact span names, not provisional `write.stage.*` or handler-local `latency_ms` fields.
2. Exact tags, including which ones are required, which ones are optional, and which ones must be bucketized.
3. Exact sampling rules so search/trigger telemetry does not explode cost while save/resume/error paths remain trustworthy.
4. Exact alert ownership so gate C through F close on measured evidence rather than ad hoc dashboard interpretation.

The phase-019 contract below assumes save and resume are always observable, search and trigger are sampled but statistically stable, shadow comparison is a first-class migration surface during gate C and gate E, and planned emitter files are marked as `(planned)` where the packet has named the module but phase 019 has not implemented it yet.

One grounding caveat matters: the packet does not currently contain an `iteration-032.md` file. The shadow-compare spans in this contract are therefore grounded in the generation-3 backlog note in `research/deep-research-state.jsonl`, the gate-C dual-write/shadow requirements in `findings/rollout-plan.md`, the phase-019 handover in `research/iterations/iteration-030.md`, and the prompt requirement for shadow-read comparison.

## 2. Span naming convention

Canonical format:

`<subsystem>.<operation>.<phase>`

Examples:

- `save.router.plan`
- `merge.apply.writeback`
- `resume.ladder.handover_read`
- `search.shadow.diff`
- `validator.post_save.fingerprint`

Rules:

1. `subsystem` must be one of `save`, `search`, `resume`, `index`, `router`, `merge`, or `validator`.
2. All segments are lowercase ASCII with dots as separators.
3. No dynamic values are allowed in span names. Packet slugs, file names, anchor IDs, route categories, and error codes belong in tags.
4. `operation` is the stable verb or noun phrase for the action, not the implementation detail. Example: use `classify`, not `call_llm_api`.
5. `phase` is the stable step or artifact. Example: `handover_read`, `fingerprint`, `vector`, `ledger`.
6. Rollup spans end with `.total` only for whole-path timing. There is exactly one rollup span per top-level path: `save.path.total`, `search.path.total`, `resume.path.total`.
7. Shadow instrumentation uses `.shadow.*` even when dual-write is on the save path; the span names stay stable after canary because the metric source does not change.
8. Retry and rollback are explicit. Do not bury them inside parent spans. Use `save.retry.external_edit`, `validator.rollback.validation`, and `validator.rollback.fingerprint`.

Legacy-to-canonical rename map:

| Prototype name from iter 027 | Canonical span family |
|---|---|
| `write_path_ms` | `save.path.total` |
| `read_path_ms` | `search.path.total` |
| `resume_path_ms` | `resume.path.total` |
| `write.stage.route_ms` | `router.classify.*` plus `save.router.plan` |
| `write.stage.lock_wait_ms` | `save.lock.wait` |
| `write.stage.merge_write_ms` | `merge.apply.writeback` |
| `read.stage.vector_ms` | `search.gather.vector` |
| `resume.stage.fallback_ms` | `resume.ladder.fallback` |

Cardinality classes used below:

- `LOW`: <=16 distinct tag values per day per span.
- `MED`: 17-256 distinct values per day per span after normalization.
- `HIGH`: >256 distinct values per day per span unless bucketized or sampled.

## 3. Canonical span table

Interpretation rules:

- `owning_file` is the current emitter when it already exists in the MCP server.
- When the packet has named the emitter but phase 019 still needs to build it, the path is marked `(planned)`.
- `owning_gate` is the primary rollout gate that depends on the span for close criteria, even if the same span continues to be useful later.
- `required_tags` are emitted on every sample for that span.
- `optional_tags` are emitted only if they stay within the budgets in section 4.

### Save, Router, Merge, Validator, Index

| span_name | subsystem | stage | required_tags | optional_tags | sampling_strategy | cardinality_class | owning_file | owning_gate |
|---|---|---|---|---|---|---|---|---|
| `save.path.total` | save | write total | `spec_folder,result_kind` | `packet_level,confidence_tier` | always | LOW | `mcp_server/handlers/memory-save.ts` | C/E |
| `save.command.collect_context` | save | write: command entry + session context collection | `spec_folder,result_kind` | `packet_level` | always | LOW | `scripts/memory/generate-context.ts` | C |
| `router.extract.chunks` | router | write: chunk extraction | `spec_folder,result_kind` | `doc_path` | always | MED | `scripts/memory/generate-context.ts` | C |
| `router.classify.tier1` | router | write: Tier 1 rule classification | `spec_folder,tier_used,confidence_tier,result_kind` | `query_class` | always | MED | `mcp_server/lib/routing/content-router.ts (planned)` | C |
| `router.classify.tier2` | router | write: Tier 2 prototype similarity | `spec_folder,tier_used,confidence_tier,result_kind` | `query_class` | head-based 100% | MED | `mcp_server/lib/routing/content-router.ts (planned)` | C |
| `router.classify.tier3` | router | write: Tier 3 LLM escalation | `spec_folder,tier_used,confidence_tier,result_kind` | `query_class,error_code` | head-based 100% | MED | `mcp_server/lib/routing/content-router.ts (planned)` | C |
| `router.classify.refuse` | router | write: low-confidence refusal | `spec_folder,tier_used,confidence_tier,result_kind` | `query_class,error_code` | always | MED | `mcp_server/lib/routing/content-router.ts (planned)` | C |
| `save.router.plan` | save | write: routing plan build + confidence arbitration | `spec_folder,result_kind,confidence_tier` | `query_class` | always | MED | `mcp_server/handlers/memory-save.ts` | C |
| `save.lock.wait` | save | write: spec-folder mutex acquisition | `spec_folder,result_kind` | `doc_path` | always | MED | `mcp_server/handlers/save/spec-folder-mutex.ts` | C/E |
| `merge.read.targets` | merge | write: read touched docs + locate anchors | `spec_folder,doc_path,anchor_id,result_kind` | `packet_level` | always | HIGH | `mcp_server/lib/writing/anchor-merge.ts (planned)` | C |
| `merge.apply.writeback` | merge | write: merge + atomic writeback | `spec_folder,doc_path,anchor_id,merge_mode,result_kind` | `confidence_tier` | always | HIGH | `mcp_server/lib/writing/anchor-merge.ts (planned)` | C |
| `validator.anchor_integrity.check` | validator | write: post-merge anchor/frontmatter validation | `spec_folder,doc_path,anchor_id,result_kind` | `error_code` | always | HIGH | `mcp_server/lib/validation/spec-doc-structure.ts (planned)` | C |
| `save.continuity.refresh` | save | write: `_memory.continuity` refresh | `spec_folder,doc_path,result_kind` | `anchor_id` | always | MED | `mcp_server/handlers/memory-save.ts` | C |
| `validator.post_save.fingerprint` | validator | write: post-save re-read + fingerprint verification | `spec_folder,doc_path,result_kind` | `error_code` | always | MED | `mcp_server/handlers/memory-save.ts` | C/E |
| `index.sync.fts` | index | write: FTS sync | `spec_folder,result_kind` | `doc_path` | always | MED | `mcp_server/handlers/memory-save.ts` | B/C |
| `index.sync.vector` | index | write: vector sync | `spec_folder,result_kind` | `doc_path` | always | MED | `mcp_server/handlers/memory-save.ts` | B/C |
| `index.sync.ledger` | index | write: ledger / continuity row sync | `spec_folder,result_kind,is_archived` | `doc_path` | always | MED | `mcp_server/handlers/memory-save.ts` | B/C |
| `save.response.render` | save | write: response build + telemetry flush | `spec_folder,result_kind` | `confidence_tier,query_class` | always | LOW | `mcp_server/handlers/save/response-builder.ts` | C/E |

### Search and Trigger Fast Path

| span_name | subsystem | stage | required_tags | optional_tags | sampling_strategy | cardinality_class | owning_file | owning_gate |
|---|---|---|---|---|---|---|---|---|
| `search.path.total` | search | read total | `spec_folder,result_kind,is_archived` | `query_class` | rate 1/100 | MED | `mcp_server/handlers/memory-search.ts` | D/E |
| `search.query.normalize` | search | read: query normalize + intent routing | `spec_folder,result_kind` | `query_class` | rate 1/100 | LOW | `mcp_server/handlers/memory-context.ts` | D |
| `search.trigger.precheck` | search | read: trigger precheck / fast-path probe | `spec_folder,result_kind` | `query_class` | rate 1/100 | LOW | `mcp_server/handlers/memory-context.ts` | D |
| `search.gather.vector` | search | read: vector candidate generation | `spec_folder,result_kind,is_archived` | `query_class` | rate 1/100 | MED | `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | D |
| `search.gather.lexical` | search | read: lexical gather | `spec_folder,result_kind,is_archived` | `query_class` | rate 1/100 | MED | `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | D |
| `search.gather.graph` | search | read: graph / causal enrichment | `spec_folder,result_kind,is_archived` | `query_class` | rate 1/100 | MED | `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | D |
| `search.rank.fusion` | search | read: fusion | `spec_folder,result_kind,is_archived` | `query_class` | rate 1/100 | MED | `mcp_server/lib/search/pipeline/stage2-fusion.ts` | D |
| `search.rank.rerank` | search | read: rerank | `spec_folder,result_kind,is_archived` | `query_class` | rate 1/100 | MED | `mcp_server/lib/search/pipeline/stage3-rerank.ts` | D |
| `search.filter.shape` | search | read: filter / dedup / constitutional inject / session shaping | `spec_folder,result_kind,is_archived` | `query_class` | rate 1/100 | MED | `mcp_server/lib/search/pipeline/stage4-filter.ts` | D |
| `search.fallback.archived` | search | read: archived fallback path | `spec_folder,result_kind,is_archived` | `query_class,fast_path_source` | tail-based | MED | `mcp_server/handlers/memory-search.ts` | D/F |
| `search.materialize.anchors` | search | read: anchor reassembly / doc materialization | `spec_folder,doc_path,anchor_id,result_kind` | `query_class` | rate 1/100 | HIGH | `mcp_server/handlers/memory-search.ts` | D |
| `search.response.render` | search | read: response envelope + telemetry flush | `spec_folder,result_kind,is_archived` | `query_class` | rate 1/100 | MED | `mcp_server/handlers/memory-search.ts` | D/E |
| `search.trigger.lookup` | search | trigger-only: cache lookup + phrase match | `spec_folder,result_kind` | `query_class` | rate 1/1000 | LOW | `mcp_server/lib/parsing/trigger-matcher.ts` | D/E |
| `search.trigger.scope_enrich` | search | trigger-only: scope filter + cognitive enrich | `spec_folder,result_kind` | `query_class` | rate 1/1000 | LOW | `mcp_server/handlers/memory-triggers.ts` | D/E |
| `search.trigger.format` | search | trigger-only: result formatting | `spec_folder,result_kind` | `query_class` | rate 1/1000 | LOW | `mcp_server/handlers/memory-triggers.ts` | D/E |

### Resume

| span_name | subsystem | stage | required_tags | optional_tags | sampling_strategy | cardinality_class | owning_file | owning_gate |
|---|---|---|---|---|---|---|---|---|
| `resume.path.total` | resume | resume total | `spec_folder,result_kind,is_archived` | `fast_path_source` | always | MED | `mcp_server/handlers/session-resume.ts` | D/E |
| `resume.command.parse` | resume | resume: command start + arg parse | `spec_folder,result_kind` | `packet_level` | always | LOW | `mcp_server/handlers/session-resume.ts` | D |
| `resume.wrapper.bootstrap` | resume | resume: wrapper / bootstrap orchestration | `spec_folder,result_kind` | `packet_level` | always | LOW | `mcp_server/handlers/session-bootstrap.ts` | D |
| `resume.ladder.pointer_resolve` | resume | resume: packet pointer resolution | `spec_folder,result_kind` | `fast_path_source,error_code` | always | LOW | `mcp_server/lib/session/resume-ladder.ts (planned)` | D |
| `resume.ladder.handover_read` | resume | resume: read `handover.md` | `spec_folder,doc_path,result_kind` | `fast_path_source` | always | MED | `mcp_server/lib/session/resume-ladder.ts (planned)` | D |
| `resume.ladder.continuity_read` | resume | resume: read `_memory.continuity` | `spec_folder,doc_path,anchor_id,result_kind` | `fast_path_source` | always | MED | `mcp_server/lib/session/resume-ladder.ts (planned)` | D |
| `resume.ladder.synthesize` | resume | resume: synthesize recovery package | `spec_folder,result_kind,fast_path_source` | `packet_level` | always | LOW | `mcp_server/lib/session/resume-ladder.ts (planned)` | D |
| `resume.ladder.fallback` | resume | resume: spec-doc or archived fallback ladder | `spec_folder,result_kind,is_archived` | `fast_path_source,error_code` | tail-based | MED | `mcp_server/lib/session/resume-ladder.ts (planned)` | D/F |
| `resume.response.render` | resume | resume: render output + next actions | `spec_folder,result_kind,fast_path_source` | `packet_level` | always | LOW | `mcp_server/handlers/session-resume.ts` | D/E |
| `resume.telemetry.flush` | resume | resume: telemetry publish | `spec_folder,result_kind` | `fast_path_source` | always | LOW | `mcp_server/lib/session/context-metrics.ts` | D/E |

### Shadow, Retry, Rollback

| span_name | subsystem | stage | required_tags | optional_tags | sampling_strategy | cardinality_class | owning_file | owning_gate |
|---|---|---|---|---|---|---|---|---|
| `save.shadow.dual_write` | save | phase-019 canary: dual-write legacy + canonical | `spec_folder,result_kind` | `shadow_result,query_class` | head-based 100% during gate C, then rate 1/10 | MED | `mcp_server/handlers/memory-save.ts` | C |
| `save.shadow.compare_write` | save | phase-019 canary: compare dual-write outputs | `spec_folder,result_kind,shadow_result` | `doc_path,error_code` | head-based 100% during gate C, then tail-based | HIGH | `mcp_server/handlers/memory-save.ts` | C |
| `search.shadow.read_legacy` | search | phase-019 canary: read legacy substrate | `spec_folder,result_kind,is_archived` | `query_class` | rate 1/20, 100% on mismatch | MED | `mcp_server/handlers/memory-search.ts` | C/E |
| `search.shadow.read_canonical` | search | phase-019 canary: read canonical substrate | `spec_folder,result_kind,is_archived` | `query_class` | rate 1/20, 100% on mismatch | MED | `mcp_server/handlers/memory-search.ts` | C/E |
| `search.shadow.diff` | search | phase-019 canary: compare ranked outputs | `spec_folder,result_kind,shadow_result` | `query_class,error_code` | tail-based | MED | `mcp_server/lib/telemetry/shadow-compare.ts (planned)` | C/E |
| `search.shadow.emit` | search | phase-019 canary: publish divergence metric | `spec_folder,shadow_result,result_kind` | `query_class` | tail-based | LOW | `mcp_server/lib/telemetry/shadow-compare.ts (planned)` | C/E |
| `save.retry.external_edit` | save | write: mtime drift retry path | `spec_folder,doc_path,result_kind` | `error_code` | always | MED | `mcp_server/handlers/memory-save.ts` | C/E |
| `validator.rollback.validation` | validator | write: rollback after validation failure | `spec_folder,doc_path,result_kind` | `anchor_id,error_code` | always | HIGH | `mcp_server/handlers/memory-save.ts` | C/E |
| `validator.rollback.fingerprint` | validator | write: rollback after fingerprint mismatch | `spec_folder,doc_path,result_kind` | `anchor_id,error_code` | always | HIGH | `mcp_server/handlers/memory-save.ts` | C/E |

Subsystem note: the writer path is intentionally more verbose than the reader path because gate C and gate E close on safety, not just latency; search splits vector, lexical, graph, fusion, rerank, and filter because iteration 027 concluded that end-to-end p95 alone is too coarse; shadow spans stay separate because they are migration evidence, not steady-state latency source-of-truth.

## 4. Required tag semantics

These tags matter because they are the minimum needed to explain gate behavior without turning the metrics store into a second search index.

| tag | meaning | allowed values / normalization | cardinality budget | overflow action |
|---|---|---|---|---|
| `spec_folder` | normalized packet or phase slug driving the operation | relative slug only, never absolute path | max 250 distinct/day | collapse to packet root; then `other` |
| `doc_path` | canonical doc family touched or read | relative path bucket: `implementation-summary.md`, `handover.md`, `research/research.md`, `tasks.md`, `decision-record.md`, `spec.md`, `plan.md`, `other` | max 64 distinct/day/span | bucketize to doc family, then `*` |
| `anchor_id` | target anchor or continuity field bucket | raw anchor only if in allowlist; otherwise prefix bucket such as `phase-*`, `adr-*`, `finding-*`, `_memory.continuity`, `other` | max 128 distinct/day/span | replace with anchor family, then `*` |
| `merge_mode` | write merge strategy | exactly 5 values: `append-as-paragraph`, `insert-new-adr`, `append-table-row`, `update-in-place`, `append-section` | fixed at 5 | do not emit invalid values |
| `confidence_tier` | operator-facing certainty band | `high`, `audit`, `warn`, `refuse` | fixed at 4 | coerce unknown to `warn` |
| `is_archived` | whether the returned row came from archived memory | `0` or `1` | fixed at 2 | drop tag if source is not retrieval |
| `tier_used` | classifier tier actually used | `none`, `tier1`, `tier2`, `tier3` | fixed at 4 | coerce unknown to `none` |
| `result_kind` | user-visible outcome shape | `hit`, `miss`, `refuse`, `fallback` | fixed at 4 | never omit |

Supporting optional tags allowed on bounded surfaces only:

| tag | use | budget | note |
|---|---|---|---|
| `query_class` | search / shadow dashboard breakdown | max 12 values | examples: `resume`, `search`, `trigger`, `archived`, `ambiguity`, `shadow` |
| `fast_path_source` | resume hit/fallback breakdown | max 5 values | `handover`, `continuity`, `spec_doc`, `archived`, `none` |
| `shadow_result` | shadow compare verdict | max 3 values | `match`, `mismatch`, `degraded` |
| `packet_level` | L1/L2/L3 runtime segmentation | max 4 values | `l1`, `l2`, `l3`, `packet` |
| `error_code` | bounded failure family | max 64 values/day | use normalized codes, never free-form messages |

Tag rules:

1. `spec_folder` is mandatory on all save/search/resume spans because every gate is packet-scoped first and global second.
2. `doc_path` is allowed only where the operation materially touches or reads a doc. Never attach it to rollup spans.
3. `anchor_id` is forbidden on sampled high-volume search spans unless the span already has `doc_path` and the path is bucketized.
4. Fingerprints, session IDs, query text, raw content, and full exception messages are never tags.

## 5. Sampling strategy

Sampling policy is split by operational trust requirement, not by implementation convenience.

| span family | default policy | exact rate | why |
|---|---|---|---|
| `save.*` | always-on | 100% | low volume; gate C and E need exact safety evidence |
| `resume.*` | always-on | 100% | low volume; fast-path miss analysis is otherwise guesswork |
| `validator.*` | always-on | 100% | failures are gate-blocking and often rare |
| `index.*` | always-on | 100% | schema/index drift is a foundation concern, not a sampled concern |
| `search.*` main path | rate-limited | 1 in 100 | enough volume for p95 and query-class trend without index blow-up |
| `search.trigger.*` | rate-limited | 1 in 1000 | trigger path is extremely hot and low-latency by design |
| `router.classify.tier2` | head-based | 100% | prototype-rescue behavior is a correctness edge |
| `router.classify.tier3` | head-based | 100% | LLM escalation is rare and must be fully auditable |
| `*.shadow.*` | mixed | 1 in 20 on match; 100% on mismatch | canary proof requires all divergences, not all matches |

Tail-based overrides:

- capture 100% of spans with `result_kind=refuse`;
- capture 100% of spans with `result_kind=fallback`;
- capture 100% of spans whose latency exceeds the current p99 target for that span family;
- capture 100% of spans with `shadow_result!=match`;
- capture 100% of spans carrying `error_code`;
- capture 100% of `save.lock.wait` samples above 200ms even if a future rate policy is added.

Sampling decisions phase 019 should implement:

1. Search sampling key should be stable for a short window so repeated identical queries do not all vanish or all flood.
2. Trigger sampling must happen after lookup success/failure is known so misses and hits stay proportionally visible.
3. Tail overrides win over rate limits.
4. During gate C canary week 1, `save.shadow.*` can stay at 100% if daily volume is below 10k save attempts. After that, move to the mixed policy above.

## 6. Cardinality budget

The telemetry store must tolerate phase-019 migration volume without becoming its own outage source.

Working estimate for phase 019:

| budget item | current estimate | soft budget | hard budget |
|---|---:|---:|---:|
| active spec folders per 24h | 80-120 | 150 | 250 |
| distinct doc buckets per 24h | 8-12 | 16 | 64 |
| distinct anchor buckets per 24h | 40-90 | 96 | 128 |
| total unique span/tag series per 24h | 11k-14k | 18k | 25k |
| total unique series during gate-C shadow | 14k-17k | 20k | 30k |

Contract:

- The system is healthy when total unique series stays below the soft budget and no single span exceeds its tag budget.
- The system is degraded when total unique series crosses the soft budget or one high-cardinality span consumes more than 10% of the daily series budget.
- The system is in a gate-blocking state when the hard budget is crossed, because at that point dashboards become materially less trustworthy.

Per-span limits:

| span class | warn | crit | automatic mitigation |
|---|---|---|---|
| LOW | >50 series/day | >100 series/day | drop optional tags |
| MED | >500 series/day | >1000 series/day | bucketize `spec_folder` or `anchor_id` |
| HIGH | >1500 series/day | >2500 series/day | bucketize `doc_path`, then replace offending label with `*` |

Mitigation order:

1. bucketize `doc_path` to doc family;
2. bucketize `anchor_id` to anchor family;
3. collapse `spec_folder` to packet root;
4. drop optional tags in this order: `error_code`, `query_class`, `packet_level`, `fast_path_source`;
5. if still over budget, replace the offending label value with `*` and emit a single cardinality-overflow event.

This budget is acceptable because save and resume are always-on but low volume, search is the only structurally high-volume path and is sampled 1/100, trigger is sampled 1/1000, and shadow spans are temporary migration scaffolding rather than permanent baseline telemetry.

## 7. Alert thresholds

These alerts are the operator-facing gate contract. If a metric is not in this table, it may be useful for diagnosis but it does not close a rollout gate by itself.

| metric | window | warn threshold | crit threshold | owning_gate | playbook link |
|---|---|---|---|---|---|
| `save.path.total p95` | 5m rolling plus benchmark runs | `>2000ms` for 2 consecutive windows or `budget_burn > 1.2` for 3 runs | `>5000ms` once or `>2x` 7-run baseline on 2 runs | C/E | `findings/save-journey.md` |
| `search.path.total p95` | 5m rolling plus benchmark runs | `>300ms` for 2 consecutive windows or `budget_burn > 1.2` for 3 runs | `>1000ms` once or `>2x` 7-run baseline on 2 runs | D/E | `findings/testing-strategy.md` |
| `resume.path.total p95` | 5m rolling plus benchmark runs | `>500ms` for 2 consecutive windows or fast-path miss rate `>15%` daily | `>1000ms` once or `>2x` 7-run baseline on 2 runs | D/E | `findings/resume-journey.md` |
| `archived_hit_rate` | 24h rolling plus phase checkpoint review | `>10%` after week 2 or rising 7-day trend after week 4 | `>20%` anytime in gate D or `>10%` at gate-E week-4 review | D/F | `findings/rollout-plan.md` |
| `classifier_refusal_rate` | 1h rolling | `>2%` | `>10%` | C/E | `findings/save-journey.md` |
| `search.shadow.diff divergence rate` | 1h rolling during canary | `>1%` mismatches or any sustained class-specific drift | `>3%` mismatches or any correctness-loss mismatch | C/E | `research/iterations/iteration-030.md` |
| `save.lock.wait p99` | 15m rolling | `>200ms` for 3 windows | `>500ms` for 2 windows | C/E | `findings/conflict-handling.md` |
| `validator.rollback.fingerprint rate` | 1h rolling | any non-zero in canary or staging | any non-zero after default flip, or `>=2` events/hour at any time | C/E | `findings/validation-contract.md` |
| `save.retry.external_edit rate` | 1h rolling | `>0.5%` of saves or `>3` affected packets/hour | `>2%` of saves or sustained `>0.5%` for 24h | C/E | `findings/conflict-handling.md` |

Alert interpretation rules: a critical alert blocks gate closure immediately; a warning becomes blocking if it persists longer than 24 hours without a named owner; fingerprint mismatch alerts are correctness alerts first and latency alerts second; shadow divergence only gates while shadow comparison is enabled.

## 8. Metric deprecation path

Phase 019 should keep a short alias window so dashboards and test harnesses can migrate without ambiguity, but the canonical names above become source-of-truth on day 1.

| pre-phase-019 / provisional metric | canonical replacement | alias period | retirement trigger |
|---|---|---|---|
| `write_path_ms` | `save.path.total` | gate C through gate E | remove after gate E closes |
| `read_path_ms` | `search.path.total` | gate D through gate E | remove after gate E closes |
| `resume_path_ms` | `resume.path.total` | gate D through gate E | remove after gate E closes |
| `write.stage.*` prototypes | exact `save.*`, `router.*`, `merge.*`, `index.*`, `validator.*` spans | gate C only | remove when gate C parity dashboard is green |
| `read.stage.*` prototypes | exact `search.*` spans | gate D only | remove when gate D closes |
| `resume.stage.*` prototypes | exact `resume.*` spans | gate D only | remove when gate D closes |
| handler-local `latency_ms` fields | keep as debug payload only, never as alert source | gate C through E | hide from dashboards immediately; delete after gate E |
| ad hoc `shadow_mismatch_rate` counters | derive from `search.shadow.diff` spans only | gate C through E | remove old counter once canonical panel is live |

Deprecation policy: alias metrics point one-way to canonical spans, dashboards switch to canonical queries immediately, tests may assert both names only during the alias period, and phase 020 removes alias emitters unless gate F explicitly extends compatibility.

## 9. Dashboard panel contract

Phase 019 must provision these panels on day 1. If a panel is missing, the related gate does not have a trustworthy close signal.

| panel | primary series | required breakdown | minimum contract |
|---|---|---|---|
| Save latency per stage | `save.path.total`, `save.lock.wait`, `merge.apply.writeback`, `save.continuity.refresh`, `index.sync.*` | by `spec_folder` and `merge_mode` | must show p50, p95, p99 and budget burn |
| Search latency per stage | `search.path.total`, `search.gather.*`, `search.rank.*`, `search.filter.shape`, `search.materialize.anchors` | by `query_class` | must show gather stages separately, not as one blob |
| Resume path hit/fallback breakdown | `resume.path.total`, `resume.ladder.*` | by `fast_path_source` and `result_kind` | must show handover vs continuity vs fallback percentages |
| Shadow-compare per query class | `search.shadow.read_*`, `search.shadow.diff` | by `query_class` and `shadow_result` | must show divergence rate and absolute mismatch count |
| Classifier tier breakdown | `router.classify.tier1`, `router.classify.tier2`, `router.classify.tier3`, `router.classify.refuse` | by `tier_used` and `confidence_tier` | must show share of routed content by tier |
| Archive hit rate trend | derived `archived_hit_rate` plus `search.fallback.archived` count | by day and `query_class` | must show 7-day and 30-day trend lines |
| Concurrent-edit detection trend | `save.retry.external_edit` count and rate | by `spec_folder` | must show packet hotspots, not just total count |
| Mutex wait trend | `save.lock.wait` | by `spec_folder` | must show p95 and p99, not average only |
| Error classification | `validator.*`, `save.retry.external_edit`, `router.classify.refuse`, `search.shadow.diff` | by `error_code` and span family | must separate correctness failures from performance failures |

Panel rules: all panels use canonical spans as source-of-truth even during alias periods; `query_class` panels must label the sample rate; `doc_path` and `anchor_id` panels must use bucketized labels only; shadow panels are required only while the feature flag is active.

## 10. Ruled Out

The following telemetry ideas were considered and rejected because they add more noise or cardinality than operational value:

| rejected telemetry | why rejected | replacement |
|---|---|---|
| raw query text as a tag | unbounded cardinality and privacy risk | `query_class` |
| full absolute `doc_path` tags | path explosion and machine-specific noise | normalized doc family buckets |
| raw `anchor_id` everywhere | anchor churn would dominate the series budget | anchor family buckets only on targeted spans |
| fingerprint hash as a tag | every save becomes a new series | keep fingerprint in logs or forensic payloads only |
| session ID or user ID as a tag | near-unbounded cardinality | use sampled logs, not metrics |
| full exception message as a tag | cardinality and wording instability | bounded `error_code` |
| per-result memory/spec row IDs | metrics become a second search index | use trace logs when needed |
| prototype similarity floats as tags | useless for dashboards and expensive | keep numerical detail in sampled debug payloads |
| full shadow diff payloads in metrics | too large and too noisy | `shadow_result` plus sampled structured diff log |

Ruled-out naming patterns:

- dynamic span names such as `resume.packet.026-...`;
- mixed separators such as `save_stage_merge`;
- implementation-leaking names such as `router.call_openai`;
- per-doc rollup spans like `search.handover.total`.

This is the canonical instrumentation contract phase 019 should implement against. If code, dashboards, or alert rules drift from these names or budgets, the code should change to match the contract rather than the contract being silently reinterpreted in the dashboard layer.
