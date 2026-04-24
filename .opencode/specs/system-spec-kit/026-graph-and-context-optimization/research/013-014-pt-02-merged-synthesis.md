# 013/014 pt-02 Merged Research Synthesis

## Summary

- Total unique findings across `013` / `014` / zero-calls: `20`
- By severity: `P0: 1`, `P1: 12`, `P2: 7`
- Cross-cutting themes count: `4`
- Overall recommendation: treat `013-ZC-F-001` as the immediate priority because it is the only `P0`, then sequence the remaining `013` and `014` `P1` work around one shared objective: make hook/runtime contracts explicit, observable, and test-enforced. No exact cross-packet duplicates required collapse; the zero-calls packet folds into the `013` lane as a dedicated query-resolution subsection.

## Cross-Cutting Themes

### T-001 Shared Contract Leakage

- Severity: `P1`
- Underlying issue: both lanes build richer internal contracts than they transport at runtime. Code-graph builds a structured startup payload that adapters flatten back to text, while skill-advisor still keeps OpenCode and Codex on branch-specific prompt paths with different threshold/render behavior [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts:230-245; .opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts:155-176; .opencode/plugins/spec-kit-skill-advisor.js:27-29; .opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs:112-143,191-197,231-239; .opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:180-241].
- Architectural fix: centralize shared builder/render/transport behavior behind one adapter contract per subsystem, then make adapter-level parity tests assert the structured contract instead of text-only or branch-local behavior.
- Contributing findings: `013-F-005`, `014-F-001`, `014-F-002`, `014-F-003`

### T-002 Operator Surfaces Under-Specify Effective State

- Severity: `P1`
- Underlying issue: public/operator surfaces regularly expose a degraded view of the system state. In code-graph, persisted detector/enrichment summaries and ambiguous subject choice are not surfaced clearly enough for operators; in skill-advisor, workspace selection, threshold semantics, and live weight state remain asymmetric or opaque [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:226-259,652-692; .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/status.ts:13-47; .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:144-161,165-190; .opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts:66-92; .opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:231-243; .opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts:120-129].
- Architectural fix: promote effective state into first-class public schemas and status outputs by surfacing selected candidate metadata, effective thresholds, explicit workspace inputs, and live-vs-default state markers.
- Contributing findings: `013-F-004`, `013-ZC-F-002`, `014-F-004`, `014-F-005`, `014-F-008`

### T-003 Telemetry And Feedback Are Not Durable Enough

- Severity: `P1`
- Underlying issue: both lanes retain useful internal signals without turning them into durable feedback loops. Code-graph can leave stale enrichment metadata behind and does not surface its quality summaries to operators, while skill-advisor keeps health data in stderr/in-memory collectors and never records accepted/corrected/ignored outcomes [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:239-242; .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:243-259; .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:41-52,263-309; .opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:88-101].
- Architectural fix: add durable, prompt-safe diagnostic sinks plus operator-facing health summaries, and make the persisted signal lifecycle explicit so new scans/events can overwrite or clear stale state safely.
- Contributing findings: `013-F-003`, `013-F-004`, `014-F-006`, `014-F-007`

### T-004 Tests Still Protect Incidental Behavior

- Severity: `P1`
- Underlying issue: several regressions are sustained by test shape rather than code alone. Code-graph tests do not lock in blocked-full-scan behavior and currently preserve first-candidate CALLS selection; skill-advisor parity remains incomplete because shared-builder behavior is not asserted across every runtime/doc surface [.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts:98-130,278-299; .opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts:56-104; .opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:64-81; .opencode/skill/system-spec-kit/mcp_server/tests/codex-session-start-hook.vitest.ts:46-68; .opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:12-14].
- Architectural fix: rewrite regression coverage around desired contract outcomes, not current branch-local behavior, and align docs/tests so transport, bridge-path, and ambiguity behavior are all asserted from the same source-of-truth.
- Contributing findings: `013-F-001`, `013-F-005`, `013-ZC-F-003`, `014-F-002`, `014-F-003`, `014-F-010`

## 013 Code-Graph Findings

### pt-02 general improvements

#### P1

- `013-F-001` `correctness` — read-path handlers keep executing after `ensureCodeGraphReady()` reports `full_scan` while inline full scans are disabled, so callers can receive partial or misleading graph answers instead of an explicit blocked-until-scan contract [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:595-599,613-727; .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:103-106,168-178; .opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts:98-130; .opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts:56-104]. Target files: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts`.
- `013-F-002` `correctness` — the CocoIndex bridge drops semantic `score`, `snippet`, and rich range semantics before graph resolution, then reorders seeds by local graph confidence, which can mis-anchor semantic search results [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/seed-resolver.ts:19-25,86-92,185-246,275-290]. Target files: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/seed-resolver.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts`.
- `013-F-003` `freshness` — scan-time edge-enrichment metadata can remain stale because null-summary scans do not clear the persisted summary, leaving later observability surfaces with outdated state [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:187-188,239-242; .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:243-259; .opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-scan.vitest.ts:91-138]. Target files: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-scan.vitest.ts`.

#### P2

- `013-F-004` `observability` — detector-provenance and enrichment summaries are persisted but still write-only for operators because `getStats()`, `code_graph_status`, and startup readers do not consume them [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:226-259,652-692; .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/status.ts:13-47; .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts:131-169]. Target files: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/status.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts`, `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`.
- `013-F-005` `cross-runtime` — `buildStartupBrief()` creates a structured `sharedPayload`, but Claude, Gemini, Copilot, and Codex adapters still emit text-only startup surfaces and adapter tests only assert text output [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts:230-245; .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:235-285; .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:170-219; .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:171-219; .opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts:155-176; .opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:64-81; .opencode/skill/system-spec-kit/mcp_server/tests/codex-session-start-hook.vitest.ts:46-68]. Target files: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/codex-session-start-hook.vitest.ts`.
- `013-F-006` `ergonomics` — `code_graph_context` still exposes only a partial bounded-work contract because the handler never sets `deadlineMs`, only `impact` mode enforces elapsed-time limits, and truncated output is unlabeled [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts:13-21,73-95,189-240,281-327; .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:168-176]. Target files: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts`.

### pt-03 zero-calls regression

Root cause: the reported zero-edge result did not come from failed CALLS extraction. It came from ambiguous subject resolution in `code_graph_query`, which selected the `handlers/index.ts` lazy re-export node instead of the real `handleMemoryContext` implementation node in `handlers/memory-context.ts` [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:115-126,165-190; .opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:310-311; .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1196-1205].

Fix path: make CALLS-oriented subject resolution operation-aware, surface selected-candidate metadata, and replace the current deterministic-first ambiguity test with a wrapper-vs-function regression fixture [.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts:278-299].

#### P0

- `013-ZC-F-001` `correctness` — the wrong graph node was queried: the prior symbol ID mapped to a lazy re-export in `handlers/index.ts`, while the real implementation function currently has persisted CALLS edges [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/code-graph-zero-calls-investigation.md:11-21; .opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:310-311; .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1196-1205; .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:115-126,165-190]. Target files: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`.

#### P1

- `013-ZC-F-002` `observability` — ambiguity warnings only expose generic messaging plus symbol IDs, so operators cannot see that a CALLS query selected a wrapper/export node instead of the actual function [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:144-161,165-190]. Target files: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`.
- `013-ZC-F-003` `correctness` — the current ambiguity regression test explicitly codifies deterministic first-candidate selection for `calls_from`, so the suite does not protect against wrapper-node shadowing [.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts:278-299]. Target files: `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`.

#### P2

- `013-ZC-F-004` `cross-runtime` — the bad-subject pattern is broader than one symbol because `handlers/index.ts` and similar index files mass-produce same-name wrapper nodes that shadow real implementations across the MCP surface [.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:212-320; .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:612; .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:540; .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/index.ts:5; .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:586]. Target files: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`.

## 014 Skill-Advisor Findings

#### P1

- `014-F-001` `cross-runtime` — OpenCode still has route-specific threshold drift because native mode ignores configured `thresholdConfidence` while fallback/shared mode applies it [.opencode/plugins/spec-kit-skill-advisor.js:27-29; .opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs:191-197,231-239]. Target files: `.opencode/plugins/spec-kit-skill-advisor.js`, `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts`, `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`.
- `014-F-002` `cross-runtime` — OpenCode native mode bypasses the shared renderer, so ambiguity and prompt-boundary brief behavior can drift from the shared hook contract [.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs:112-143; .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts:123-137]. Target files: `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`.
- `014-F-003` `cross-runtime` — Codex still preserves a bespoke native fast path ahead of the shared builder, so prompt policy, cache behavior, and shared payload semantics remain runtime-branch dependent [.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:180-241; .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:339-467]. Target files: `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts`.
- `014-F-004` `ergonomics` — the public MCP surface is asymmetric because `advisor_status` requires `workspaceRoot`, while `advisor_recommend` and `advisor_validate` infer workspace implicitly from process state [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts:66-92; .opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:24-33; .opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:44-58]. Target files: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md`.
- `014-F-005` `correctness` — `advisor_validate` uses `0.7` aggregate thresholds for corpus and holdout slices even though package docs describe stricter promotion gates and prompt-time routing uses `0.8/0.35` thresholds [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:231-243; .opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md:150-158; .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:120-135]. Target files: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md`.
- `014-F-006` `observability` — hook telemetry is still effectively stderr plus an in-memory collector, so durable recommendation-health diagnostics do not exist [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:263-309; .opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:88-101]. Target files: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts`.
- `014-F-007` `observability` — telemetry and validation surfaces do not capture accepted/corrected/ignored outcomes, so recommendation quality still cannot learn from live routing behavior [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:41-52; .opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:321-369]. Target files: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`.

#### P2

- `014-F-008` `observability` — `advisor_status` reports default `laneWeights`, and the schema is literal-locked, so the public surface cannot represent live or candidate weight drift today [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts:120-129; .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/weights-config.ts:30-42]. Target files: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/weights-config.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`.
- `014-F-009` `docs` — two-cycle promotion docs promise restart-persistent state through telemetry, but implementation remains helper-plus-callback logic with no built-in durable store [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/05--promotion-gates/04-two-cycle.md:29-32; .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/two-cycle-requirement.ts:30-49; .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/rollback.ts:31-72]. Target files: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/05--promotion-gates/04-two-cycle.md`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/two-cycle-requirement.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/rollback.ts`.
- `014-F-010` `docs` — operator docs and playbooks still point to the old `.opencode/plugins` bridge path even though compat tests use `.opencode/plugin-helpers` [.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:133-140; .opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/07--hooks-and-plugin/05-opencode-plugin-bridge.md:29; .opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/005-opencode-plugin-bridge.md:30; .opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:12-14]. Target files: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/07--hooks-and-plugin/05-opencode-plugin-bridge.md`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/005-opencode-plugin-bridge.md`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`.

## Master Findings Table (all P0 + P1)

| ID | Severity | Packet | Category | Summary | Evidence | Recommended Fix |
| --- | --- | --- | --- | --- | --- | --- |
| `013-ZC-F-001` | `P0` | `013-code-graph-zero-calls-pt-03` | `correctness` | Wrong subject node selected for `handleMemoryContext` CALLS queries. | `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:115-126,165-190`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1196-1205` | Make resolver operation-aware so CALLS prefers callable implementations. |
| `013-F-001` | `P1` | `013-code-graph-hook-improvements-pt-02` | `correctness` | Read paths continue after `full_scan` is required but suppressed. | `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:595-599`; `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:103-106` | Add an explicit blocked-full-scan contract and tests. |
| `013-F-002` | `P1` | `013-code-graph-hook-improvements-pt-02` | `correctness` | CocoIndex seed fidelity is lost before graph resolution and re-ranking. | `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/seed-resolver.ts:19-25,86-92`; `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/seed-resolver.ts:185-246` | Preserve semantic score/snippet/range and blend with graph confidence. |
| `013-F-003` | `P1` | `013-code-graph-hook-improvements-pt-02` | `freshness` | Null-summary scans leave stale edge-enrichment metadata behind. | `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:239-242`; `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:243-259` | Clear persisted summaries on null-summary scans and cover overwrite-then-clear. |
| `013-ZC-F-002` | `P1` | `013-code-graph-zero-calls-pt-03` | `observability` | Ambiguity warnings do not reveal selected wrapper/export candidates. | `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:144-161,165-190` | Extend warning payloads with candidate kind/file/line and selected candidate data. |
| `013-ZC-F-003` | `P1` | `013-code-graph-zero-calls-pt-03` | `correctness` | Existing test suite preserves deterministic first-candidate CALLS selection. | `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts:278-299` | Add wrapper-vs-function ambiguity regressions for `calls_from` and `calls_to`. |
| `014-F-001` | `P1` | `014-skill-advisor-hook-improvements-pt-02` | `cross-runtime` | OpenCode native/fallback branches apply different threshold logic. | `.opencode/plugins/spec-kit-skill-advisor.js:27-29`; `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs:191-197,231-239` | Unify threshold config and expose the effective threshold. |
| `014-F-002` | `P1` | `014-skill-advisor-hook-improvements-pt-02` | `cross-runtime` | OpenCode native mode bypasses the shared renderer. | `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs:112-143`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts:123-137` | Route native mode through the shared render contract or port its invariants explicitly. |
| `014-F-003` | `P1` | `014-skill-advisor-hook-improvements-pt-02` | `cross-runtime` | Codex fast path still diverges from the shared builder. | `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:180-241`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:339-467` | Remove or normalize the native fast path behind one shared source. |
| `014-F-004` | `P1` | `014-skill-advisor-hook-improvements-pt-02` | `ergonomics` | Advisor MCP tools do not expose workspace selection consistently. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts:66-92`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:44-58` | Accept explicit `workspaceRoot` across public tools and test the semantics. |
| `014-F-005` | `P1` | `014-skill-advisor-hook-improvements-pt-02` | `correctness` | Validator thresholds do not align cleanly with documented promotion/runtime thresholds. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:231-243`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:120-135` | Publish explicit aggregate-vs-runtime threshold semantics and align thresholds where intended. |
| `014-F-006` | `P1` | `014-skill-advisor-hook-improvements-pt-02` | `observability` | Hook diagnostics are ephemeral because they live in stderr plus memory. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:263-309`; `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:88-101` | Add a durable prompt-safe sink and operator-facing health surface. |
| `014-F-007` | `P1` | `014-skill-advisor-hook-improvements-pt-02` | `observability` | No accepted/corrected/ignored outcome signal exists for live recommendation tuning. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:41-52`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:321-369` | Add outcome events and connect them to validation or a dedicated analysis surface. |

## Remediation Roadmap for Downstream spec_kit:plan

### Bucket A: 013-code-graph-hook-improvements plan inputs

Findings to address in `plan.md`:
- `013-F-001`, `013-F-002`, `013-F-003`, `013-F-004`, `013-F-005`, `013-F-006`, `013-ZC-F-001`, `013-ZC-F-002`, `013-ZC-F-003`, `013-ZC-F-004`

Tasks to generate:
- `CG-T1` Resolver correctness and blocked-read contract: address `013-ZC-F-001`, `013-ZC-F-003`, and `013-F-001` by making relationship queries operation-aware and by hardening read-path behavior when readiness requires a full scan.
- `CG-T2` Query/result observability: address `013-ZC-F-002`, `013-ZC-F-004`, and `013-F-002` by surfacing selected-candidate metadata and preserving semantic seed fidelity through resolution and ranking.
- `CG-T3` Scan metadata lifecycle: address `013-F-003` and `013-F-004` by letting scans clear stale summaries and by exposing graph-quality summaries in status/startup surfaces.
- `CG-T4` Startup/context contract parity: address `013-F-005` and `013-F-006` by choosing one startup payload contract, enforcing bounded-work deadlines consistently, and labeling partial output.

Success criteria:
- `calls_from` and `calls_to` choose callable implementation nodes over wrapper/export nodes for ambiguous `handle*` names, with regression coverage.
- Query/context handlers return an explicit blocked or degraded contract when `full_scan` is required but suppressed.
- Scan metadata can be overwritten and cleared without leaving stale enrichment summaries behind.
- Operators can see graph-quality summary state and startup/context responses explicitly communicate transport and partial-output behavior.

### Bucket B: 014-skill-advisor-hook-improvements plan inputs

Findings to address in `plan.md`:
- `014-F-001`, `014-F-002`, `014-F-003`, `014-F-004`, `014-F-005`, `014-F-006`, `014-F-007`, `014-F-008`, `014-F-009`, `014-F-010`

Tasks to generate:
- `SA-T1` Threshold unification: address `014-F-001` and `014-F-005` by moving OpenCode/native/shared routing and validator outputs onto one explicit effective-threshold story.
- `SA-T2` Runtime brief parity: address `014-F-002` and `014-F-003` by collapsing OpenCode and Codex onto the shared build/render contract or by porting those invariants into their native paths with parity tests.
- `SA-T3` Public MCP surface normalization: address `014-F-004` and `014-F-008` by standardizing `workspaceRoot`, validator controls, and live-vs-default status reporting across advisor tools.
- `SA-T4` Durable telemetry and outcome learning: address `014-F-006` and `014-F-007` by adding a durable prompt-safe sink plus accepted/corrected/ignored outcome events.
- `SA-T5` Docs and promotion-contract cleanup: address `014-F-009` and `014-F-010` by either implementing the promised persistence/path behavior or narrowing the docs until the implementation exists.

Success criteria:
- OpenCode, Codex, Claude, Gemini, and Copilot all expose the same effective brief-building and threshold semantics for equivalent prompts.
- Advisor MCP tools accept explicit workspace context and publish the thresholds/state they actually use.
- Recommendation-health diagnostics survive process boundaries and include live outcome signals.
- Documentation, tests, and bridge-path examples all match the shipped runtime behavior.

## Plan Dispatch Hints

- `013` recommended level: `3`
- `013` recommended scope focus: query-resolution correctness, blocked-read readiness contracts, graph-quality summary lifecycle, and startup/context parity tests.
- `013` out-of-scope callouts: no CALLS-extractor rewrite, no broad storage-engine redesign, and no reopening of already-closed CF-009 / CF-010 / CF-014 issues.
- `014` recommended level: `3`
- `014` recommended scope focus: threshold unification, shared runtime brief parity, public MCP schema normalization, durable telemetry, and doc/runtime alignment.
- `014` out-of-scope callouts: no broad hook-engine redesign, no CF-019 re-investigation absent a new regression, and no implementation work unrelated to skill-advisor surfaces under investigation.
- Dependencies between `013` and `014`: no hard blocker. Both can plan independently, but any shared parity-testing conventions for runtime adapters should use one vocabulary for effective state, degraded/partial output, and operator-visible metadata so the two plans do not drift.

## References

### Source Research Packets

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/research/013-code-graph-hook-improvements-pt-02/research.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/research/013-code-graph-hook-improvements-pt-02/findings-registry.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/research/014-skill-advisor-hook-improvements-pt-02/research.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/research/014-skill-advisor-hook-improvements-pt-02/findings-registry.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/research/013-code-graph-zero-calls-pt-03/research.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/research/013-code-graph-zero-calls-pt-03/findings-registry.json`

### Code-Graph Paths Cited

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/code-graph-zero-calls-investigation.md`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/seed-resolver.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-scan.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/codex-session-start-hook.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`

### Skill-Advisor Paths Cited

- `.opencode/plugins/spec-kit-skill-advisor.js`
- `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs`
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/weights-config.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/05--promotion-gates/04-two-cycle.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/07--hooks-and-plugin/05-opencode-plugin-bridge.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/005-opencode-plugin-bridge.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/two-cycle-requirement.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/rollback.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`
