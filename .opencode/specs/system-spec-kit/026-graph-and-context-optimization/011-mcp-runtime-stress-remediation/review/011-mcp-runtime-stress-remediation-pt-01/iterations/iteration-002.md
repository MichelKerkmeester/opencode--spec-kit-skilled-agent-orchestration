# Iteration 2 — Security

## Dimension

Security. Focus: cli-copilot Gate 3 target-authority binding, prompt-file authority placement, missing-authority safe-fail, recovered-context resistance, and high-level security checks across remediation packets 003-009.

## Files Reviewed

- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `.opencode/skill/system-spec-kit/mcp_server/tests/executor-config-copilot-target-authority.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/indexer.py`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/protocol.py`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/daemon.py`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/server.py`
- `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/cli.py`
- `003-memory-context-truncation-contract/implementation-summary.md`
- `004-cocoindex-overfetch-dedup/implementation-summary.md`
- `006-causal-graph-window-metrics/implementation-summary.md`
- `007-intent-classifier-stability/implementation-summary.md`
- `008-mcp-daemon-rebuild-protocol/implementation-summary.md`
- `008-mcp-daemon-rebuild-protocol/references/mcp-rebuild-restart-protocol.md`
- `008-mcp-daemon-rebuild-protocol/references/live-probe-template.md`
- `009-memory-search-response-policy/implementation-summary.md`

## Findings — P0

None.

The P0 cli-copilot Gate 3 fix proposal is not broken in the reviewed implementation. Authority is bound from the workflow `{spec_folder}` at the auto-loop dispatch site, normalized inside the helper before prompt composition, and missing/malformed authority on write-intent dispatch safe-fails into Gate 3 without `--allow-all-tools`.

## Findings — P1

None.

## Findings — P2

None new in this iteration. The two active P2 advisories from iteration 1 remain cumulative but are not re-flagged here.

## Traceability Checks

| Check | Result | Evidence |
|-------|--------|----------|
| S1.1 authority insertion point binds to workflow-approved spec folder | PASS | `spec_kit_deep-review_auto.yaml:678-686` and `spec_kit_deep-research_auto.yaml:615-623` set `specFolderRaw = '{spec_folder}'` and pass it as `targetAuthority`. `executor-config.ts:275-284` revalidates and stores only the validated folder as approved authority. |
| S1.2 missing/malformed write authority enforces plan-only | PASS | `executor-config.ts:238-258` rejects empty/template/sentinel/control-character values; `executor-config.ts:275-298` coerces invalid approved authority to missing write intent; `executor-config.ts:338-340` strips `--allow-all-tools`. Tests assert Gate-3 replacement and flag stripping at `executor-config-copilot-target-authority.vitest.ts:119-162` and malformed safe-fail at `:269-347`. |
| S1.3 TARGET AUTHORITY preamble reaches inline and large-prompt paths | PASS | Inline path prefixes `promptBody` at `executor-config.ts:292-294`. Large prompt path writes `promptFileBody` at `executor-config.ts:318-321`; both auto YAML call sites write it to `promptPath` before dispatch at `spec_kit_deep-review_auto.yaml:704-713` and `spec_kit_deep-research_auto.yaml:641-654`. |
| S1.4 recovered/bootstrap context cannot override approved folder | PASS | The preamble states recovered context cannot override authority at `executor-config.ts:161-166`; tests put a competing folder later in the prompt and assert approved authority appears first at `executor-config-copilot-target-authority.vitest.ts:165-196`. |
| S1.5 helper test coverage covers required cases | PASS | Happy path: `executor-config-copilot-target-authority.vitest.ts:37-88`; missing-folder safe-fail: `:119-162`; recovered-context mention attack: `:165-196`; large-prompt wrapper: `:206-267`; I1 replay safe-fail: `:349-444`. |
| S1.6 bare `@promptPath` Copilot read semantics | PARTIAL | Tests model the contract and file write ordering (`cli-matrix.vitest.ts:335-406`), and the YAML notes the dependency. Local `copilot --help` could not run because the CLI failed before help with `SecItemCopyMatching failed -50`, so no live CLI semantic probe was possible in this iteration. |
| S2 daemon rebuild + restart contract | PASS | `mcp-rebuild-restart-protocol.md:23-33` requires source paths, targeted tests, dist verification, runtime restart, and live probe before final completion; `:58-69` sequences build, dist grep, restart, then live probe. The stale-build window is documented as the central anti-pattern at `:86-91`, not hidden. |
| S3 memory_search refusal contract | PARTIAL | Source builds `citationPolicy`/`responsePolicy` types at `search-results.ts:206-214`; weak results receive `do_not_cite_results` and policy in tests at `empty-result-recovery.vitest.ts:152-190`; good results omit responsePolicy at `:193-245`. The implementation summary admits the live probe exercised only the `cite_results` branch and deferred the weak 006/I2 repro. |
| S4 memory_context truncation bypass | PASS | `enforceTokenBudget()` captures `preEnforcementTokens` before truncation at `memory-context.ts:463-466`, short-circuits under budget at `:468-478`, preserves low-utilization payloads at `:487-497`, and emits fallback reason/count fields at `:861-877`. The call site enforces after context injection at `:1718-1720`; no streaming variant was found in the reviewed surface. |
| S5 CocoIndex fork dedup and telemetry | PASS | Ingest stores `source_realpath`, `content_hash`, and `path_class` at `indexer.py:219-242`; query over-fetches `limit * 4` at `query.py:282-290`, dedups by `source_realpath` or content-hash fallback at `query.py:158-173` and `:220-250`, then passes `dedupedAliases`, `uniqueResultCount`, `raw_score`, `path_class`, and `rankingSignals` through protocol/daemon/server/CLI surfaces. Existing cached rows still get query-time hash fallback, while path-class metadata quality requires the documented reindex. |
| S6 causal-graph cap/telemetry | PASS | Caps are env-configurable at `causal-edges.ts:49-50`, enforced in direct insert, batch, and bulk paths at `:340-342`, `:423-452`, and `:490-511`. Production tuning can raise the cap intentionally, but `memory_causal_stats` still exposes skew telemetry via `deltaByRelation`, `dominantRelationShare`, `balanceStatus`, and `remediationHint` at `causal-graph.ts:134-168` and response lines `:792-830`. |
| S7 intent classifier ordering injection | PASS | `deriveParaphraseGroup()` lowercases, tokenizes, filters stopwords, sorts tokens, and joins at `intent-classifier.ts:609-617`; adversarial ordering does not change the group key. This is telemetry only, not a security boundary; v2 embedding paraphrase remains correctly deferred. |

Summary: required 12, executed 12, pass 10, partial 2, fail 0, blocked 0, not applicable 0, gating failures 0.

## Resource Map Coverage

Coverage gate remains active because `resource-map.md` exists. This iteration did not add a new resource-map finding. The iteration-1 P2 still stands: the parent map is stale relative to children 012-018, but that is a traceability/documentation issue rather than a security bypass.

## Claim Adjudication Packets

### CA-007 — P0 cli-copilot Gate 3 bypass fix

Claim: `buildCopilotPromptArg` prevents recovered/bootstrap context from overriding the workflow-approved spec folder and safe-fails missing/malformed write authority to Gate 3.

Adjudication: Supported. The workflow auto-loop call sites pass only `{spec_folder}` into `targetAuthority` (`spec_kit_deep-review_auto.yaml:685-701`, `spec_kit_deep-research_auto.yaml:622-638`). The helper revalidates that value before any prompt composition (`executor-config.ts:275-284`), prefixes approved prompts with a target-authority block (`executor-config.ts:292-294`), replaces missing write-intent prompts with a Gate-3 question (`executor-config.ts:295-298`), and strips `--allow-all-tools` when plan-only is enforced (`executor-config.ts:338-340`). Large prompts write the authority-prefixed file body before dispatch (`executor-config.ts:318-321`; YAML write-before-dispatch at `spec_kit_deep-review_auto.yaml:704-713` and `spec_kit_deep-research_auto.yaml:641-654`). The required helper tests are present and passed in this iteration.

Residual evidence limit: the actual `copilot` binary could not be probed locally because it failed with `SecItemCopyMatching failed -50` before help output. Existing tests cover the contract shape and wrapper file content, but not a live authenticated Copilot dispatch.

### CA-008 — Daemon rebuild + restart contract

Claim: packet 008 prevents stale-daemon phantom fixes.

Adjudication: Supported as a documentation contract. The protocol requires build, dist marker grep, client/runtime restart, and live MCP probe before final completion (`mcp-rebuild-restart-protocol.md:23-33`, `:58-69`). It explicitly calls stale daemon reuse an anti-pattern (`:86-91`). It does not automate restart, but that is documented as client-owned lifecycle rather than an implementation bypass.

### CA-009 — memory_search weak-retrieval refusal

Claim: weak `memory_search` retrieval can no longer license canonical path claims.

Adjudication: Source/test supported; live refuse-path evidence still partial. The formatter owns `citationPolicy` and `responsePolicy` shape (`search-results.ts:206-214`), recovery expands action vocabulary (`recovery-payload.ts:29-36`), and tests assert weak results get `do_not_cite_results` plus `noCanonicalPathClaims:true` (`empty-result-recovery.vitest.ts:152-190`). The packet's live evidence only exercised the good `cite_results` branch, so the weak branch remains a live-probe follow-up, not a code-level P1.

### CA-010 — truncation and intent security surface

Claim: memory_context token-budget and intent telemetry changes do not expose a bypass.

Adjudication: Supported. Token telemetry is computed before and after enforcement (`memory-context.ts:463-478`, `:806-877`), and the budget is applied after context assembly (`memory-context.ts:1718-1720`). Intent paraphrase grouping is order-insensitive by construction (`intent-classifier.ts:609-617`) and is not used as an authorization gate.

### CA-011 — CocoIndex dedup/rerank security surface

Claim: fork v0.2.3+spec-kit-fork.0.2.0 prevents alias over-fetch and passes telemetry through.

Adjudication: Supported with a reindex caveat. Ingest writes canonical metadata for fresh rows (`indexer.py:219-242`), but dedup enforcement itself is query-time (`query.py:158-173`, `:220-250`). That still protects old cached rows because missing `content_hash` falls back to hashing `content`; however, the richer `path_class` rerank and metadata quality require the documented `ccc reset && ccc index` outside the sandbox.

## Verdict

PASS for security iteration 2, with evidence-limit partials.

No new P0, P1, or P2 findings. The P0 cli-copilot Gate 3 fix appears correctly inserted, authority-bound, safe-failing, and covered by targeted tests. Cumulative findings remain P0=0, P1=0, P2=2 from iteration 1.

Targeted verification run:

```text
cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/executor-config-copilot-target-authority.vitest.ts tests/deep-loop/cli-matrix.vitest.ts tests/empty-result-recovery.vitest.ts tests/intent-paraphrase-stability.vitest.ts tests/causal-edges.vitest.ts
Test Files 5 passed
Tests 143 passed
```

## Next Dimension

Iteration 3 should review traceability. Prioritize the active resource-map P2, downstream packet checklist/evidence alignment, live-probe claim consistency, and cross-reference drift across 003-009 plus 012.
