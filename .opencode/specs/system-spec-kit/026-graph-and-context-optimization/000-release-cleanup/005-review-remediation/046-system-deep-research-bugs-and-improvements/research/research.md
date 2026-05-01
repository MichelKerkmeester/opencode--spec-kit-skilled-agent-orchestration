# Deep Research: System Bugs and Improvements (20 iterations)

<!-- ANCHOR:research-sources -->
Source: [iteration-001.md](iterations/iteration-001.md) through [iteration-020.md](iterations/iteration-020.md).
<!-- /ANCHOR:research-sources -->

## §1 Executive Summary

Twenty cli-codex `gpt-5.5` high-reasoning iterations audited system-spec-kit bugs and improvements across production code, wiring/automation, refinement opportunities, and architecture. The run produced 82 findings: 0 P0, 31 P1, and 51 P2. The highest-impact findings cluster around daemon/code-graph concurrency, unsafe fallback state in deep-loop workflows, advisor routing correctness, stale/fresh code-graph decisions, and schema/path validation gaps. No P0 was surfaced, but several P1s can directly leave operators with incorrect state, wrong routing, failed workflow recovery, or misleading validation.

## §2 Charter Recap

| Angle | Iteration | One-line description |
|---|---:|---|
| A1 daemon concurrency edge cases | 001 | Audit advisor daemon leases, watcher flushes, shutdown, and generation publication races. |
| A2 code-graph SQLite contention | 002 | Audit code-graph SQLite write/read consistency under concurrent scan/query. |
| A3 resource leaks across mcp_server | 003 | Audit watcher handles, unbounded memory growth, subprocess and cleanup paths. |
| A4 silent error recovery patterns | 004 | Audit broad catch/fallback paths that can hide corrupt persisted state. |
| A5 schema validation gaps | 005 | Audit public MCP validation, JSON parsing, casts, and path boundary handling. |
| B1 hook contract drift across runtimes | 006 | Compare advisor hook rendering and fallback behavior across runtimes. |
| B2 CLI orchestrator skill correctness | 007 | Audit CLI skill docs/templates for dispatch, model, effort, and approval drift. |
| B3 Memory MCP round-trip integrity | 008 | Trace memory save, indexing, search/context, continuity, and causal-link preservation. |
| B4 spec-kit validator correctness | 009 | Audit spec validators for false positives/false negatives. |
| B5 workflow command auto-routing | 010 | Audit `/spec_kit` YAML state machines, flags, lock handling, and fallback records. |
| C1 search-quality W3-W13 latency and accuracy | 011 | Identify measurable tuning levers for search/rerank/citation quality. |
| C2 scorer fusion accuracy on edge cases | 012 | Audit skill-advisor scoring under ambiguity, conflicts, duplicate projections, and adversarial prompts. |
| C3 skill advisor recommendation quality | 013 | Audit regression corpus expectations and local scorer false positives. |
| C4 code-graph staleness detection accuracy | 014 | Audit fresh/stale detection, missed files, broad Git HEAD triggers, and doctor integration. |
| C5 test suite reliability and flake patterns | 015 | Audit tests for env, cwd, timing, temp-dir, and host-dependent flakes. |
| D1 mcp_server/lib boundary discipline | 016 | Audit module ownership and cross-boundary imports. |
| D2 module dependency graph health | 017 | Map import cycles, hot spots, dead exports, and chain depth. |
| D3 type/schema duplication | 018 | Audit duplicated Zod schemas, TS unions, runtime guards, and MCP schemas. |
| D4 spec-kit folder topology sustainability | 019 | Audit nested spec topology, parent metadata drift, and phase-parent scaling. |
| D5 build/dist/runtime separation | 020 | Audit checked-in dist, runtime entrypoints, generated artifacts, and source JS boundaries. |

## §3 Method

Each iteration was dispatched as an independent cli-codex run using `gpt-5.5` with high reasoning. Findings were classified as P0/P1/P2 using practical severity: P0 for data loss/security/complete workflow breakage, P1 for concrete correctness or reliability failures, and P2 for maintainability, drift, performance, or lower-risk reliability issues. Evidence required a specific file and line or line range, plus a concrete description and recommended remediation. Synthesis deduplicated by `file:line` and behavior similarity; no true duplicate findings were collapsed, though several themes recur across adjacent subsystems.

## §4 Coverage Map

| Angle | Iteration | Findings | Top severity |
|---|---:|---:|---|
| A1 daemon concurrency edge cases | 001 | 4 | P1 |
| A2 code-graph SQLite contention | 002 | 3 | P1 |
| A3 resource leaks across mcp_server | 003 | 3 | P1 |
| A4 silent error recovery patterns | 004 | 4 | P1 |
| A5 schema validation gaps | 005 | 6 | P1 |
| B1 hook contract drift across runtimes | 006 | 3 | P2 |
| B2 CLI orchestrator skill correctness | 007 | 6 | P1 |
| B3 Memory MCP round-trip integrity | 008 | 2 | P1 |
| B4 spec-kit validator correctness | 009 | 5 | P1 |
| B5 workflow command auto-routing | 010 | 4 | P1 |
| C1 search-quality W3-W13 latency and accuracy | 011 | 5 | P1 |
| C2 scorer fusion accuracy on edge cases | 012 | 4 | P1 |
| C3 skill advisor recommendation quality | 013 | 1 | P1 |
| C4 code-graph staleness detection accuracy | 014 | 4 | P1 |
| C5 test suite reliability and flake patterns | 015 | 6 | P1 |
| D1 mcp_server/lib boundary discipline | 016 | 8 | P2 |
| D2 module dependency graph health | 017 | 3 | P2 |
| D3 type/schema duplication | 018 | 4 | P2 |
| D4 spec-kit folder topology sustainability | 019 | 3 | P1 |
| D5 build/dist/runtime separation | 020 | 4 | P2 |

## §5 Findings — Production Code Bugs (Category A)

### Skill advisor daemon and freshness

- `F-001-A1-01`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:361-368`, P1: watcher enqueue can start overlapping `flushPending()` runs. Serialize flushes with a watcher-local mutex/drain promise.
- `F-001-A1-02`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lifecycle.ts:85-94`, P1: shutdown can publish `unavailable`, then pending watcher flush can republish `live`. Close/flush first or suppress generation publication during shutdown, then publish one terminal state.
- `F-001-A1-03`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts:71-80`, P1: stale generation-lock reclamation is not owner-safe. Store a unique lock token and release/delete only when ownership still matches.
- `F-001-A1-04`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts:123-127`, P2: cache invalidation can arrive out of order after lock release. Emit while locked or make invalidation state/listeners monotonic.
- `F-003-A3-01`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:336-343`, P1: target refresh adds new watched paths but never unwatches removed ones. Add `unwatch` support or recreate the watcher on target shrink.
- `F-003-A3-02`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:321`, P2: diagnostics array grows for process lifetime. Replace with a bounded ring buffer plus aggregate counters.
- `F-004-A4-01`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/projection.ts:237-240`, P1: SQLite projection failures silently fall back to filesystem projection. Emit diagnostics or fail open with explicit stale/unavailable state.
- `F-004-A4-04`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:155-172`, P2: malformed `graph-metadata.json` silently drops derived key-file watch targets. Record a diagnostic or quarantine malformed metadata.
- `F-005-A5-01`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts:92-95`, P1: advisor `workspaceRoot` accepts arbitrary non-empty strings. Resolve/realpath and bound to the current workspace or an explicit allowlist.
- `F-005-A5-02`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-validate.ts:116-135`, P1: corpus/regression JSONL rows are cast without schema validation. Add strict row schemas and line-numbered validation errors.
- `F-005-A5-03`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-validate.ts:220-238`, P2: Python stdout top-skill output is parsed without shape/length validation. Validate as `Array<string|null>` with exact input-row length.

### Code graph and shared MCP server

- `F-002-A2-01`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:271`, P1: per-file persistence spans multiple independent write phases. Wrap stage-file, nodes, edges, and finalize-file in one atomic write unit.
- `F-002-A2-02`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:159`, P1: SQLite lacks explicit contention policy for shared graph DB writes. Add busy timeout/retry and reserve writers with `BEGIN IMMEDIATE` or file-lock scan serialization.
- `F-002-A2-03`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1089`, P2: logical graph queries use multiple SELECTs without a consistent snapshot. Wrap query reads in short read transactions or use a completed generation marker.
- `F-003-A3-03`, `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:223-232`, P2: file-watcher backpressure queue is unbounded. Coalesce by path, cap queue depth, and abort queued work on close.
- `F-004-A4-02`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-context.ts:501-526`, P2: subject resolution swallows DB failures as unresolved subject. Return typed unavailable/error metadata.
- `F-004-A4-03`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:253-296`, P2: malformed metadata JSON collapses to `null`, including verification-gate state. Distinguish absent, corrupt, and invalid-shape records.
- `F-005-A5-04`, `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:807-808`, P2: generic JSON parsing can emit non-`string[]` trigger phrases. Use typed array validation.
- `F-005-A5-05`, `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:513-543`, P2: description metadata bypasses the existing `perFolderDescriptionSchema`. Reuse the schema and surface path-aware errors.
- `F-005-A5-06`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1568-1578`, P2: checkpoint restore casts snapshots after minimal array checks. Add a snapshot schema and reject/quarantine malformed rows.

## §6 Findings — Wiring/Automation Bugs (Category B)

### Runtime hooks and OpenCode plugin bridge

- `F-006-B1-01`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:194`, P2: Codex timeout fallback emits a bespoke advisor brief. Move it behind the shared renderer or version/document it as Codex-only.
- `F-006-B1-02`, `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs:316`, P2: OpenCode disabled mode is model-visible while other runtimes fail open silently. Align disabled behavior or document it as runtime-specific status.
- `F-006-B1-03`, `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs:117`, P2: dead alternate bridge renderer can drift from the shared format. Remove it or assert bridge output only uses `renderAdvisorBrief()`.

### CLI orchestrator skills

- `F-007-B2-01`, `.opencode/skill/cli-opencode/SKILL.md:292-294`, P1: cli-opencode says subagents are not directly invokable, then later directly invokes them. Pick one dispatch contract and update roster/examples.
- `F-007-B2-02`, `.opencode/skill/cli-opencode/references/agent_delegation.md:202-205`, P1: OpenCode references/templates bypass command-owned deep-loop routing. Route through parent commands or narrowly document approved leaf-only invocation.
- `F-007-B2-03`, `.opencode/skill/cli-copilot/SKILL.md:280`, P1: Copilot effort flag and default-effort docs contradict the CLI reference. Confirm live CLI support and update SKILL.md or reference accordingly.
- `F-007-B2-04`, `.opencode/skill/cli-codex/assets/prompt_templates.md:52-55`, P2: Codex templates omit required model/effort/tier pins and misdescribe `--full-auto`. Align templates to SKILL.md semantics.
- `F-007-B2-05`, `.opencode/skill/cli-claude-code/assets/prompt_templates.md:52-55`, P2: Claude Code templates omit explicit `--model`. Add `--model claude-sonnet-4-6` to default templates.
- `F-007-B2-06`, `.opencode/skill/cli-gemini/assets/prompt_templates.md:45-47`, P2: Gemini write templates embed `--yolo` without approval preconditions. Split safe templates from explicitly approved write templates.

### Memory, validators, and spec-kit workflows

- `F-008-B3-01`, `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:872`, P1: causal-link parser claims `causal_links` but only matches `causalLinks`. Accept both keys through shared frontmatter/YAML parsing.
- `F-008-B3-02`, `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:405`, P1: causal-link insert count increments even when storage returns `null`. Count only real row IDs and report skipped reasons.
- `F-009-B4-01`, `.opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh:63`, P1: Markdown link extraction mishandles angle-bracket links and misses reference definitions. Use a Markdown-aware parser or explicit format coverage.
- `F-009-B4-02`, `.opencode/skill/system-spec-kit/scripts/rules/check-evidence.sh:78`, P1: evidence check treats same-line second checkbox as evidence. Require semantic evidence markers or structured evidence fields.
- `F-009-B4-03`, `.opencode/skill/system-spec-kit/scripts/rules/check-evidence.sh:57`, P2: evidence check does not share priority parsing with priority-tag rule. Reuse one parser or recognize all accepted priority formats.
- `F-009-B4-04`, `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh:73`, P1: template header wrapper ignores middle-of-structure extra headers. Preserve helper `extra_header` results and classify by position.
- `F-009-B4-05`, `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh:91`, P2: checklist guard misses uppercase `[X]`. Match checkbox classes used by the rest of the validator.
- `F-010-B5-01`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:179-182`, P1: deep-research lock is acquired before classification but not released on halt/cancel paths. Add finally cleanup or acquire after terminal-state classification.
- `F-010-B5-02`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:851-853`, P1: deep-research fallback record uses `run` and omits required iteration fields. Emit canonical error iteration records or non-counted failure events.
- `F-010-B5-03`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:812-814`, P1: deep-review has the same malformed fallback record problem. Align fallback schema or use non-iteration failure events.
- `F-010-B5-04`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:235-249`, P2: `--no-resource-map` is parsed in markdown then overwritten by YAML config creation. Pass the flag into YAML config for research and review modes.

## §7 Findings — Refinement/Improvement (Category C)

### Search quality and reranking

- `F-011-C1-01`, `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/metrics.ts:10`, P2: W3-W13 summary lacks NDCG/MRR. Add rank-sensitive metrics such as NDCG@3 and NDCG@10.
- `F-011-C1-02`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:42`, P1: rerank is blocked for fewer than four candidates, including ambiguous three-candidate cases. Lower the floor for weak-margin/disagreement triggers or overfetch before Stage 3.
- `F-011-C1-03`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:31`, P1: provider `maxDocuments` is declared but not enforced. Apply a top-N candidate window before provider calls and merge the untouched tail.
- `F-011-C1-04`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts:47`, P2: duplicate-density overfetch is telemetry-only. Graduate bounded adaptive overfetch behind latency/recall guardrails.
- `F-011-C1-05`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1270`, P2: learned Stage 2 scoring remains shadow-only despite quality gains. Promote as a small guarded blend after stable deltas.

### Skill advisor quality

- `F-012-C2-01`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/graph-causal.ts:89-90`, P1: graph conflict evidence is filtered out when score is negative. Preserve negative graph contributions or add post-fusion conflict penalties.
- `F-012-C2-02`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/projection.ts:146-147`, P1: SQLite projection duplicates derived triggers as derived keywords. Keep fields distinct or dedupe before scoring.
- `F-012-C2-03`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:120-124`, P1: task-intent confidence floor lets token-stuffed prompts pass many unrelated skills. Add dispersion/ambiguity guards before thresholding.
- `F-012-C2-04`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/ambiguity.ts:9-12`, P2: ambiguity compares only top-two confidence, not effective ranking score or larger tie clusters. Compute ambiguity from ranking score and include all tied candidates.
- `F-013-C3-01`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl:26`, P1: fixture expects `sk-code-review` for `review and update this`, a write/edit prompt. Change expectation to `sk-code` or ambiguous and add a review-plus-edit disambiguation rule.

### Code graph and tests

- `F-014-C4-01`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:457-459`, P2: timestamp-only changes force stale status before content-hash comparison. Hash on mtime drift before declaring normal-sized files stale.
- `F-014-C4-02`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:156-183`, P2: raw Git HEAD drift triggers full scans for non-graph-affecting changes. Filter diffs through index scope before full reindex.
- `F-014-C4-03`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:166-196`, P1: new untracked indexable files are invisible while HEAD is unchanged. Persist/compare a candidate manifest or run bounded candidate discovery.
- `F-014-C4-04`, `.opencode/command/doctor/assets/doctor_code-graph_auto.yaml:100-104`, P1: doctor asks `detect_changes({})` for stale/missed files the handler does not produce. Add a dedicated index-health primitive or redefine workflow around existing outputs.
- `F-015-C5-01`, `.opencode/skill/system-spec-kit/mcp_server/stress_test/session/gate-d-resume-perf.vitest.ts:15`, P1: stress test hard-codes a developer checkout path. Capture/restore original cwd and remove absolute local paths.
- `F-015-C5-02`, `.opencode/skill/system-spec-kit/mcp_server/stress_test/session/gate-d-benchmark-session-resume.vitest.ts:176-195`, P2: CI-facing stress test asserts absolute latency budgets. Split correctness from benchmark-only performance telemetry.
- `F-015-C5-03`, `.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:305-319`, P2: unit tests sleep with real timers and assert elapsed time. Inject deterministic times or use local fake timers with cleanup.
- `F-015-C5-04`, `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts:141-152`, P1: env opt-out test can leak `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED`. Restore env snapshots in `afterEach`.
- `F-015-C5-05`, `.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-flags.vitest.ts:58-76`, P2: `SPECKIT_MMR` mutation is not restored. Use env snapshot helpers.
- `F-015-C5-06`, `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:33-35`, P2: repo-local temp fixtures can collide and remain after crashes. Use per-test `os.tmpdir()` mkdtemp roots.

## §8 Findings — Architecture/Organization (Category D)

### Boundary discipline and dependency graph

- `F-016-D1-01`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:13`, P2: core skill-graph storage imports advisor freshness internals. Move SQLite integrity checks to neutral storage/utils.
- `F-016-D1-02`, `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:9`, P2: shared context contract imports advisor renderer sanitization. Move sanitization to a neutral payload utility.
- `F-016-D1-03`, `.opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts:9`, P2: lib resume code imports handler-level spec discovery. Extract discovery to lib and have handlers depend inward.
- `F-016-D1-04`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/compat/daemon-probe.ts:8`, P2: compat lib imports handler status reader. Move status reading into advisor lib and keep handler as wrapper.
- `F-016-D1-05`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/rebuild-from-source.ts:7`, P2: freshness rebuild imports busy retry from daemon watcher. Extract retry utility to neutral storage/advisor utils.
- `F-016-D1-06`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:9`, P2: watcher owns watching, indexing, provenance, freshness, and generation publishing. Split watcher service from injected reindex/generation orchestration.
- `F-016-D1-07`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/derived.ts:5`, P2: scorer lane and lifecycle age policy are conceptually entangled. Move age decay into scorer policy or pass primitive metadata.
- `F-016-D1-08`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/corpus/df-idf.ts:6`, P2: corpus math imports lifecycle filtering. Let callers pass eligible docs or inject a predicate.
- `F-017-D2-01`, `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:9`, P2: value-level cycle between session snapshot and memory-surface hooks. Extract priming state or bootstrap-contract builder.
- `F-017-D2-02`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-summaries.ts:8`, P2: community detection/storage/summary types form a cycle. Extract shared community types.
- `F-017-D2-03`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:300`, P2: dead exported non-test symbols lack internal non-test use. Remove/make private or mark as external compatibility exports.

### Schema duplication

- `F-018-D3-01`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/trust-state.ts:38`, P2: trust-state literals are redefined across schemas, metrics, and guards. Export one canonical values tuple and derive schemas/types from it.
- `F-018-D3-02`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/types.ts:10`, P2: lifecycle status union and runtime schemas can drift. Move values to one tuple/schema and infer TS types.
- `F-018-D3-03`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/skill-advisor-brief.ts:47`, P2: advisor runtime/outcome labels are split across unions, tuples, Zod, and guards. Define each values tuple once and reuse.
- `F-018-D3-04`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:50`, P2: MCP JSON Schema, Zod inputs, handler checks, and allowed-parameter lists duplicate tool contracts. Generate public/schema/allowed lists from one source.

### Spec topology and build boundary

- `F-019-D4-01`, `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:419-425`, P1: child saves update only parent last-active pointer, leaving parent children metadata stale. Refresh parent graph metadata or update `children_ids` and key files during child save.
- `F-019-D4-02`, `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:56-61`, P2: workflow docs describe two-level phase paths while runtime supports deeper packet trees. Define explicit topology grammar and update workflow docs/tests.
- `F-019-D4-03`, `.opencode/skill/system-spec-kit/mcp_server/lib/spec/is-phase-parent.ts:23-38`, P2: large phase parents have no topology health warning. Add threshold-based health checks and summarized manifests.
- `F-020-D5-01`, `.opencode/plugins/spec-kit-skill-advisor.js:40`, P2: plugin cache signature watches `dist/skill-advisor` but runtime imports `dist/skill_advisor`. Fix path or derive from runtime module URL.
- `F-020-D5-02`, `.opencode/skill/system-spec-kit/scripts/evals/check-source-dist-alignment.ts:95`, P2: dist alignment checker excludes runtime-critical outputs. Scan all relevant `mcp_server/dist/**/*.js` with documented exceptions.
- `F-020-D5-03`, `.opencode/skill/system-spec-kit/mcp_server/dist/tests/search-quality/harness.js:11`, P2: stale compiled test artifacts remain after source moved. Delete orphaned outputs and make checker catch them.
- `F-020-D5-04`, `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs:150`, P2: source-of-truth runtime MJS bridge is outside TS boundary and undocumented. Document and smoke-test it, or migrate to TS.

## §9 P0 Triage

| ID | Location | Remediation path |
|---|---|---|
| None | n/a | No P0 findings were reported across the 20 iterations. |

## §10 P1 Triage

| ID | Location | Concrete remediation path |
|---|---|---|
| F-001-A1-01 | `skill_advisor/lib/daemon/watcher.ts:361-368` | Add single-flight watcher flush and drain queued events serially. |
| F-001-A1-02 | `skill_advisor/lib/daemon/lifecycle.ts:85-94` | Reorder shutdown: quiesce watcher, then publish final unavailable state. |
| F-001-A1-03 | `skill_advisor/lib/freshness/generation.ts:71-80` | Add owner-token generation lock semantics. |
| F-002-A2-01 | `code_graph/lib/ensure-ready.ts:271` | Make per-file graph persistence atomic. |
| F-002-A2-02 | `code_graph/lib/code-graph-db.ts:159` | Add SQLite busy policy and early writer reservation/serialization. |
| F-003-A3-01 | `skill_advisor/lib/daemon/watcher.ts:336-343` | Unwatch removed target paths and prune file-hash state. |
| F-004-A4-01 | `skill_advisor/lib/scorer/projection.ts:237-240` | Stop silent SQLite-to-filesystem projection fallback. |
| F-005-A5-01 | `skill_advisor/schemas/advisor-tool-schemas.ts:92-95` | Bound advisor `workspaceRoot` to workspace/allowlist. |
| F-005-A5-02 | `skill_advisor/handlers/advisor-validate.ts:116-135` | Schema-validate corpus and regression JSONL rows. |
| F-007-B2-01 | `cli-opencode/SKILL.md:292-294` | Resolve direct-agent versus orchestrated-agent contract. |
| F-007-B2-02 | `cli-opencode/references/agent_delegation.md:202-205` | Remove deep-loop command bypass examples. |
| F-007-B2-03 | `cli-copilot/SKILL.md:280` | Reconcile Copilot effort flag/default documentation with live CLI. |
| F-008-B3-01 | `lib/parsing/memory-parser.ts:872` | Parse both `causal_links` and `causalLinks`. |
| F-008-B3-02 | `handlers/causal-links-processor.ts:405` | Count only actual causal-edge insertions. |
| F-009-B4-01 | `scripts/rules/check-spec-doc-integrity.sh:63` | Replace fragile Markdown link extraction. |
| F-009-B4-02 | `scripts/rules/check-evidence.sh:78` | Remove checkbox-as-evidence false negative. |
| F-009-B4-04 | `scripts/rules/check-template-headers.sh:73` | Fail/warn on extra headers before required structure completes. |
| F-010-B5-01 | `spec_kit_deep-research_auto.yaml:179-182` | Release lock on all post-acquisition halt/cancel paths. |
| F-010-B5-02 | `spec_kit_deep-research_auto.yaml:851-853` | Emit schema-valid failure state or non-counted failure events. |
| F-010-B5-03 | `spec_kit_deep-review_auto.yaml:812-814` | Apply the same schema-valid failure handling to deep-review. |
| F-011-C1-02 | `lib/search/rerank-gate.ts:42` | Allow rerank for small ambiguous sets or overfetch first. |
| F-011-C1-03 | `lib/search/cross-encoder.ts:31` | Enforce provider candidate limits. |
| F-012-C2-01 | `scorer/lanes/graph-causal.ts:89-90` | Carry graph conflict penalties into fusion. |
| F-012-C2-02 | `scorer/projection.ts:146-147` | Stop double-counting derived phrases. |
| F-012-C2-03 | `scorer/fusion.ts:120-124` | Add broad-pass/dispersion guard for token-stuffed prompts. |
| F-013-C3-01 | `skill_advisor_regression_cases.jsonl:26` | Correct mixed review/edit fixture and add disambiguation rule. |
| F-014-C4-03 | `code_graph/lib/ensure-ready.ts:166-196` | Detect new indexable files without waiting for HEAD changes. |
| F-014-C4-04 | `doctor_code-graph_auto.yaml:100-104` | Replace wrong `detect_changes({})` dependency with index-health primitive. |
| F-015-C5-01 | `gate-d-resume-perf.vitest.ts:15` | Remove hard-coded checkout path and restore original cwd. |
| F-015-C5-04 | `opencode-plugin-bridge-stress.vitest.ts:141-152` | Add env snapshot restore for plugin-disabled test. |
| F-019-D4-01 | `scripts/memory/generate-context.ts:419-425` | Refresh parent graph metadata during child saves. |

## §11 P2 Triage

| ID | Location | Concrete remediation path |
|---|---|---|
| F-001-A1-04 | `skill_advisor/lib/freshness/generation.ts:123-127` | Make cache invalidation monotonic or emit while locked. |
| F-002-A2-03 | `code_graph/handlers/query.ts:1089` | Use read transactions or generation-stable reads. |
| F-003-A3-02 | `skill_advisor/lib/daemon/watcher.ts:321` | Cap diagnostics with ring buffer/counters. |
| F-003-A3-03 | `lib/ops/file-watcher.ts:223-232` | Cap/coalesce reindex queue. |
| F-004-A4-02 | `code_graph/lib/code-graph-context.ts:501-526` | Surface DB errors distinctly from unresolved subjects. |
| F-004-A4-03 | `code_graph/lib/code-graph-db.ts:253-296` | Preserve corrupt metadata state. |
| F-004-A4-04 | `skill_advisor/lib/daemon/watcher.ts:155-172` | Diagnose malformed metadata key-file parsing. |
| F-005-A5-03 | `advisor-validate.ts:220-238` | Validate Python stdout array shape and length. |
| F-005-A5-04 | `formatters/search-results.ts:807-808` | Replace generic parse with typed `string[]` validation. |
| F-005-A5-05 | `lib/parsing/memory-parser.ts:513-543` | Reuse description schema. |
| F-005-A5-06 | `lib/storage/checkpoints.ts:1568-1578` | Add checkpoint snapshot schema. |
| F-006-B1-01 | `hooks/codex/user-prompt-submit.ts:194` | Centralize timeout brief rendering. |
| F-006-B1-02 | `plugin_bridges/spec-kit-skill-advisor-bridge.mjs:316` | Align disabled-mode visibility. |
| F-006-B1-03 | `plugin_bridges/spec-kit-skill-advisor-bridge.mjs:117` | Remove dead local renderer. |
| F-007-B2-04 | `cli-codex/assets/prompt_templates.md:52-55` | Pin model/effort/tier and fix `--full-auto` prose. |
| F-007-B2-05 | `cli-claude-code/assets/prompt_templates.md:52-55` | Add explicit default model to templates. |
| F-007-B2-06 | `cli-gemini/assets/prompt_templates.md:45-47` | Gate `--yolo` templates with explicit approval language. |
| F-009-B4-03 | `scripts/rules/check-evidence.sh:57` | Share priority parsing. |
| F-009-B4-05 | `scripts/rules/check-template-headers.sh:91` | Match uppercase completed checkboxes. |
| F-010-B5-04 | `spec_kit_deep-research_auto.yaml:235-249` | Preserve `--no-resource-map` in YAML config. |
| F-011-C1-01 | `stress_test/search-quality/metrics.ts:10` | Add NDCG/MRR harness metrics. |
| F-011-C1-04 | `lib/search/cocoindex-calibration.ts:47` | Graduate bounded adaptive overfetch. |
| F-011-C1-05 | `pipeline/stage2-fusion.ts:1270` | Canary learned score blend. |
| F-012-C2-04 | `scorer/ambiguity.ts:9-12` | Compute ambiguity from effective ranking and tie clusters. |
| F-014-C4-01 | `code_graph/lib/code-graph-db.ts:457-459` | Hash on mtime drift before stale classification. |
| F-014-C4-02 | `code_graph/lib/ensure-ready.ts:156-183` | Replace raw HEAD trigger with graph-affecting diff. |
| F-015-C5-02 | `gate-d-benchmark-session-resume.vitest.ts:176-195` | Move latency budgets to benchmark-only mode. |
| F-015-C5-03 | `tests/envelope.vitest.ts:305-319` | Replace real sleeps with deterministic timing. |
| F-015-C5-05 | `tests/hybrid-search-flags.vitest.ts:58-76` | Restore env mutations. |
| F-015-C5-06 | `tests/memory-save-pipeline-enforcement.vitest.ts:33-35` | Use mkdtemp fixture roots. |
| F-016-D1-01 | `lib/skill-graph/skill-graph-db.ts:13` | Extract neutral SQLite integrity utility. |
| F-016-D1-02 | `lib/context/shared-payload.ts:9` | Extract neutral payload sanitizer. |
| F-016-D1-03 | `lib/resume/resume-ladder.ts:9` | Extract spec document discovery to lib. |
| F-016-D1-04 | `skill_advisor/lib/compat/daemon-probe.ts:8` | Move status reader into advisor lib. |
| F-016-D1-05 | `skill_advisor/lib/freshness/rebuild-from-source.ts:7` | Extract busy retry utility. |
| F-016-D1-06 | `skill_advisor/lib/daemon/watcher.ts:9` | Split watcher from reindex/generation orchestration. |
| F-016-D1-07 | `scorer/lanes/derived.ts:5` | Move age decay into scorer policy. |
| F-016-D1-08 | `corpus/df-idf.ts:6` | Inject lifecycle eligibility instead of importing it. |
| F-017-D2-01 | `lib/session/session-snapshot.ts:9` | Break session/memory-surface value cycle. |
| F-017-D2-02 | `lib/graph/community-summaries.ts:8` | Extract community types. |
| F-017-D2-03 | `context-server.ts:300` | Remove/private/comment dead exports. |
| F-018-D3-01 | `trust-state.ts:38` | Derive all trust-state schemas from one tuple. |
| F-018-D3-02 | `scorer/types.ts:10` | Derive lifecycle status type/schema from one source. |
| F-018-D3-03 | `skill-advisor-brief.ts:47` | Derive runtime/outcome schemas from one source. |
| F-018-D3-04 | `tool-schemas.ts:50` | Generate MCP schemas and allowed params from one contract. |
| F-019-D4-02 | `spec_kit_implement_auto.yaml:56-61` | Define nested topology grammar. |
| F-019-D4-03 | `lib/spec/is-phase-parent.ts:23-38` | Add topology health checks. |
| F-020-D5-01 | `.opencode/plugins/spec-kit-skill-advisor.js:40` | Fix watched dist path. |
| F-020-D5-02 | `scripts/evals/check-source-dist-alignment.ts:95` | Expand dist alignment coverage. |
| F-020-D5-03 | `dist/tests/search-quality/harness.js:11` | Delete stale orphaned dist artifacts and guard against recurrence. |
| F-020-D5-04 | `plugin_bridges/spec-kit-skill-advisor-bridge.mjs:150` | Document/smoke-test or migrate source MJS bridge. |

## §12 Cross-Iteration Themes

1. Concurrency hygiene: iterations 001, 002, 003, 008, and 010 found missing serialization, unsafe lock ownership, unbounded queues, and invalid failure-state writes.
2. Silent degradation: iterations 004, 005, 006, 009, and 014 found paths where failure collapses into normal fallback or misleading operator output.
3. Contract drift: iterations 006, 007, 010, 018, 019, and 020 found duplicated contracts across runtimes, docs, schemas, YAML, and dist.
4. Advisor quality and ambiguity: iterations 011, 012, and 013 show ranking and skill routing still need guardrails around small candidate sets, conflict evidence, duplicate triggers, and mixed-intent prompts.
5. Test and topology sustainability: iterations 015, 016, 017, 019, and 020 identify cleanup needed to keep the system maintainable as packets, modules, and generated artifacts grow.

## §13 Convergence Notes

Findings expanded across categories rather than converging to one single subsystem. The strongest convergence was around contract drift: the same failure mode appears in hook rendering, CLI skill templates, YAML workflow flags, schema duplication, spec topology docs, and dist alignment. Concurrency and state publication issues also recur in daemon watcher, code-graph persistence, memory causal edges, and deep-loop fallback records. Direct duplicates were low; adjacent iterations often found different manifestations of the same class rather than the same `file:line` bug. Coverage confidence is high for the selected 20 angles, but not exhaustive for all DB JSON columns, all MCP tool contracts, all external CLI live versions, or all dist/generated artifact policies.

## §14 Remediation Backlog

- Packet 047: test failures already in flight; include C5 env/cwd/timer/temp-dir cleanup where it overlaps.
- Packet 048: iter-001 daemon concurrency already done; verify it covers watcher single-flight, shutdown ordering, and owner-token lock semantics.
- Packet 049: code-graph consistency and staleness remediation, covering A2 and C4.
- Packet 050: deep-loop workflow state-machine remediation, covering B5 lock cleanup, failure records, and resource-map flags.
- Packet 051: advisor contract and quality remediation, covering B1, C2, C3, and trust-state/schema duplication where user-visible.
- Packet 052: spec validation and memory round-trip remediation, covering B3/B4.
- Packet 053: architecture cleanup, covering D1/D2/D3 shared utilities and contract generation.
- Packet 054: topology and build-boundary cleanup, covering D4/D5.

## §15 Open Questions

- Does the deployed MCP topology allow multiple Node/CLI processes to touch the same code-graph SQLite DB concurrently?
- Should advisor routing for mixed review/edit prompts prefer implementation by default or return ambiguity unless review-only terms are present?
- Should performance thresholds ever fail normal CI, or should they be benchmark telemetry only?
- What direct-child threshold should trigger a spec topology warning: 20, 30, or 40?
- Should checked-in `dist/` remain comprehensive, or should release cleanup keep only runtime entrypoints needed by installed hooks/plugins?

## §16 Method Notes

Heuristics used: exact file/line evidence from each iteration; priority preserved from source iterations; deduplication by behavior and location; category grouping by the original A/B/C/D charter; remediation phrased as implementation-ready actions. Files consulted were the 20 iteration markdown files under `research/iterations/iteration-001.md` through `iteration-020.md`, plus the packet research directory listing and the deep-research skill instructions. Files not consulted were the product source files themselves, compiled outputs beyond paths quoted in findings, JSONL deltas, logs, prompts, and external CLI/runtime documentation; this synthesis intentionally preserves the iteration evidence rather than re-auditing it.

## §17 Appendix: Per-Iteration Summary

Iteration 001 ([iteration-001.md](iterations/iteration-001.md)) audited daemon concurrency and found four findings. The main risks were non-serialized watcher flushes, shutdown publication ordering, unsafe generation-lock ownership, and out-of-order cache invalidation.

Iteration 002 ([iteration-002.md](iterations/iteration-002.md)) audited code-graph SQLite contention and found three findings. It showed per-file persistence is not atomic, write contention lacks policy, and logical graph reads are not snapshot-stable.

Iteration 003 ([iteration-003.md](iterations/iteration-003.md)) audited resource leaks and found three findings. The concrete issues were stale chokidar watches, unbounded daemon diagnostics, and an unbounded file-watcher reindex queue.

Iteration 004 ([iteration-004.md](iterations/iteration-004.md)) audited silent error recovery and found four findings. Projection fallback, subject resolution, metadata JSON parsing, and watcher metadata parsing can hide corrupt state as normal absence.

Iteration 005 ([iteration-005.md](iterations/iteration-005.md)) audited schema validation gaps and found six findings. The strongest issues were arbitrary advisor workspace roots, unvalidated validation fixtures, loose Python stdout parsing, generic search-result JSON parsing, metadata schema bypass, and weak checkpoint restore validation.

Iteration 006 ([iteration-006.md](iterations/iteration-006.md)) audited hook contract drift and found three findings. Normal advisor rendering is mostly shared, but timeout, disabled, and dead local renderer paths drift.

Iteration 007 ([iteration-007.md](iterations/iteration-007.md)) audited CLI orchestrator skill correctness and found six findings. OpenCode direct-agent semantics, Copilot effort flags, and model/approval template drift need cleanup.

Iteration 008 ([iteration-008.md](iterations/iteration-008.md)) audited memory MCP round-trip integrity and found two findings. Snake-case causal links are dropped, and failed causal-edge insertions are reported as inserted.

Iteration 009 ([iteration-009.md](iterations/iteration-009.md)) audited validator correctness and found five findings. Markdown link extraction, evidence enforcement, priority parsing, header ordering, and uppercase checkbox handling all have gaps.

Iteration 010 ([iteration-010.md](iterations/iteration-010.md)) audited workflow command auto-routing and found four findings. Deep-research lock cleanup, research/review fallback records, and resource-map flag propagation are the key failures.

Iteration 011 ([iteration-011.md](iterations/iteration-011.md)) audited search-quality tuning and found five findings. Rerank gating, cross-encoder candidate windows, adaptive overfetch, learned fusion, and rank-sensitive metrics are the main levers.

Iteration 012 ([iteration-012.md](iterations/iteration-012.md)) audited scorer fusion edge cases and found four findings. Negative conflict evidence, duplicated derived phrases, token-stuffed prompts, and ambiguity ranking all need guardrails.

Iteration 013 ([iteration-013.md](iterations/iteration-013.md)) audited advisor regression quality and found one finding. The corpus encodes a bad `review and update this` expectation that should be implementation-oriented or ambiguous.

Iteration 014 ([iteration-014.md](iterations/iteration-014.md)) audited code-graph staleness and found four findings. Timestamp-only false-stale, HEAD-only false-stale, new-file false-fresh, and doctor workflow contract mismatch are the major cases.

Iteration 015 ([iteration-015.md](iterations/iteration-015.md)) audited test flake patterns and found six findings. Hard-coded checkout paths, absolute latency budgets, real sleeps, env leaks, and repo-local temp fixtures need suite-level helpers.

Iteration 016 ([iteration-016.md](iterations/iteration-016.md)) audited module boundary discipline and found eight findings. Most are extractable utility/boundary issues across storage, payload sanitization, resume discovery, status reading, busy retry, watcher orchestration, lifecycle decay, and corpus filtering.

Iteration 017 ([iteration-017.md](iterations/iteration-017.md)) audited dependency graph health and found three findings. It identified one value-level cycle, one type-level community cycle, and two undocumented dead exports.

Iteration 018 ([iteration-018.md](iterations/iteration-018.md)) audited type/schema duplication and found four findings. Trust-state, lifecycle status, advisor runtime/outcome, and MCP tool input contracts all have duplicated sources of truth.

Iteration 019 ([iteration-019.md](iterations/iteration-019.md)) audited spec-kit folder topology and found three findings. Parent graph metadata drifts during child saves, workflow docs underspecify nested topology, and large phase parents lack health warnings.

Iteration 020 ([iteration-020.md](iterations/iteration-020.md)) audited build/dist/runtime separation and found four findings. Plugin cache path drift, incomplete dist alignment checks, stale compiled test artifacts, and undocumented source MJS bridge boundaries need release cleanup.
