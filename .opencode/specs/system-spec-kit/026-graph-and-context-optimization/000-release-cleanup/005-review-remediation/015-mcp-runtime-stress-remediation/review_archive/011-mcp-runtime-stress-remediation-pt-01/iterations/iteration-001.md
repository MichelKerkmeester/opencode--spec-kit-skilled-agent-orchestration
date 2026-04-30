# Iteration 1 — Correctness + Inventory + V1.0.2 Verdict Validation

## Dimension

Correctness. Iteration 1 also performed the requested inventory pass and resource-map coverage check.

## Files Reviewed

- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/spec.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/resource-map.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/HANDOVER-deferred.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/spec.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/runs/preflight.log`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/runs/{Q3,I2,S2}/*/score.md` spot checks
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/research.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/deep-research-state.jsonl`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/deltas/iter-001.jsonl` through `iter-010.jsonl`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `.opencode/skill/system-spec-kit/mcp_server/tests/executor-config-copilot-target-authority.vitest.ts`
- Selected implementation summaries for packets 003, 005, and 009.
- Selected downstream packet docs for 012 and 017.

## Findings — P0 (Blockers)

None.

## Findings — P1 (Required)

None.

## Findings — P2 (Suggestions)

### F-001 — Parent `resource-map.md` is stale relative to the 18-child phase parent

Severity: P2

Evidence:
- `spec.md:112-119` lists children 011 through 018, including 012-018 downstream remediation packets.
- `resource-map.md:21-24` still reports 35 total references and scopes the map through the 010 v1.0.2 scaffold.
- `resource-map.md:63-64` lists only 010 and 011 after the original 001-009 set, and line 64 still describes 011 as scaffold-stage/pending.
- `resource-map.md:117-120` says the parent map covers all 9 children and future updates should append rows when post-cycle work lands.

Adjudication: The filesystem inventory shows parent + children 001-018 all have `description.json` and `graph-metadata.json`, so discovery metadata is intact. The gap is the resource-map coverage gate: 012-018 are absent from the parent path ledger, and 011's status is stale.

Concrete fix: update `resource-map.md` to include 012-018 rows, mark 011 complete, refresh totals/generated timestamp, and revise the "all 9 children" wording to 18 children.

### F-002 — Post-stress research convergence wording overclaims monotonic decay

Severity: P2

Evidence:
- `011-post-stress-followup-research/research/research.md:47` prints the trajectory `0.74 -> 0.58 -> 0.46 -> 0.41 -> 0.46 -> 0.38 -> 0.34 -> 0.46 -> 0.27 -> 0.22`, then calls it "Clean monotonic decay = converged."
- The same line contains the contradiction: iteration 5 rises from 0.41 to 0.46, and iteration 8 rises from 0.34 to 0.46.
- `research/deltas/iter-001.jsonl:1` and `research/deltas/iter-010.jsonl:1` confirm the endpoint claim of `0.74 -> 0.22`; the issue is the monotonic/no-oscillation wording, not the endpoint.

Adjudication: The loop still converged enough for patch planning: it hit 10/10 iterations, failed 0 iterations, and the endpoint decay matches the synthesis. The wording should say "overall downward trajectory with rebounds at iterations 5 and 8" rather than "monotonic/no oscillation."

Concrete fix: amend `research.md` loop-health wording and any downstream summaries that copy the monotonic claim.

## Traceability Checks

| Check | Result | Evidence |
|-------|--------|----------|
| Parent + 18 children have `description.json` | PASS | Filesystem inventory found parent and 001-018 all present. |
| Parent + 18 children have `graph-metadata.json` | PASS | Filesystem inventory found parent and 001-018 all present. |
| `010/findings.md` exists and carries 6/7 verdict | PASS | `findings.md:13-17`, `findings.md:67-78`. |
| `010/findings.md` carries 0 REGRESSION claim | PASS | `findings.md:14`, and the comparison table at `findings.md:43-51` has no negative deltas. |
| `010/findings.md` carries 83.8% aggregate | PASS | `findings.md:55-63`; this is a simple 30-cell mean, not a weighted aggregate. |
| Pre-flight daemon attestation documented as a hard gate | PASS | `010/spec.md:79`, `010/spec.md:124`, `010/spec.md:202`; `runs/preflight.log:75-80` documents GREEN/unblocked after recovery. |
| `011-post-stress-followup-research/research/` has 10 iterations and deltas | PASS | `deep-research-state.jsonl:4-24`; `research.md:39-45`. |
| `HANDOVER-deferred.md` enumerates the four still-open post-stress items | PASS | `HANDOVER-deferred.md:79-82` lists P0, P1, P2, and opportunity items. |
| Live-probe evidence exists in packet docs | PASS | Spot checks: `003/implementation-summary.md:108`, `005/implementation-summary.md:111`, `009/implementation-summary.md:105`. |
| Resource-map coverage for children 012-018 | PARTIAL | F-001. |
| Research convergence wording | PARTIAL | F-002. |

## Resource Map Coverage

Coverage gate active because `resource-map.md` exists. Result: PARTIAL.

All current phase children are present on disk and carry both required metadata files. The parent resource map, however, lags the current 18-child manifest. It still describes the parent as covering 9 children and only lists 010/011 after the original 001-009 set. It does not cover 012-018, even though the parent manifest lists them at `spec.md:113-119`.

## Claim Adjudication Packets

### CA-001 — V1.0.2 verdict validation

Claim: 6 of 7 remediation packets are PROVEN; packet 005 is not proven.

Adjudication: Supported. The packet verdict table records 003, 004, 006, 007, 008, and 009 as PROVEN, and 005 as NEUTRAL because the Q1 cells did not exercise `fallbackDecision` while graph state was healthy (`findings.md:69-77`). Spot checks support the distinction:
- Packet 003 Q3 evidence has partial-credit cells but no contradiction: Q3 codex 6/8 (`Q3/cli-codex-1/score.md:5-9`), Q3 copilot 6/8 and WIN (`Q3/cli-copilot-1/score.md:5-20`), Q3 opencode 7/8 and WIN (`Q3/cli-opencode-1/score.md:5-21`).
- Packet 004 S2/opencode is a clean 8/8 WIN with fork telemetry surfaced (`S2/cli-opencode-1/score.md:5-21`).
- Packet 009 I2/opencode is a 6/8 WIN with one hallucination partial-credit point due to a minor path typo, but still no catastrophic fabrication (`I2/cli-opencode-1/score.md:5-23`).

### CA-002 — 0 REGRESSION claim

Claim: No v1.0.2 cell scored lower than v1.0.1.

Adjudication: Supported within the provided frozen baseline table. `findings.md:43-51` shows all per-cell deltas are zero or positive. No independent v1.0.1 re-investigation was performed per instruction.

### CA-003 — 83.8% overall

Claim: v1.0.2 overall score is 83.8%.

Adjudication: Supported as a simple mean. `findings.md:57-63` reports the 30-cell overall average as 6.70/8 = 83.8%. No weighting scheme is documented because no weighting is used in that table.

### CA-004 — Pre-flight daemon attestation

Claim: Pre-flight gate was documented and passed.

Adjudication: Supported. `010/spec.md:79` defines the pre-flight attestation as in scope; `010/spec.md:124` makes captured preflight logs acceptance criteria; `010/spec.md:202` says the attestation MUST pass before dispatch; `runs/preflight.log:75-80` records GREEN/unblocked after one code-graph recovery.

### CA-005 — Post-stress research convergence and four proposals

Claim: 10-iteration research converged and produced four patch proposals.

Adjudication: Mostly supported, with F-002 wording correction. `research.md:15-25` summarizes the four proposals; `research.md:39-45` records 10/10 iterations and outputs; `deep-research-state.jsonl:4-24` records all 10 started/completed plus loop completion. The endpoint `0.74 -> 0.22` is supported, but the "monotonic/no oscillation" phrasing is not.

### CA-006 — P0 cli-copilot insertion point

Claim: The P0 target-authority fix belongs in `executor-config.ts` next to `resolveCopilotPromptArg`, with YAML call sites wrapping cli-copilot dispatch.

Adjudication: Supported. The research synthesis recommends that insertion point at `research.md:72-83`. The implementation now places `buildCopilotPromptArg` in `executor-config.ts:261-348`, normalizes authority before prompt composition at `executor-config.ts:266-287`, binds the preamble before the prompt at `executor-config.ts:292-294`, and rewrites large prompt files with the preamble before `@PROMPT_PATH` dispatch at `executor-config.ts:304-321`. The two auto YAML call sites route through the helper and write `promptFileBody` before dispatch (`spec_kit_deep-research_auto.yaml:622-653`, `spec_kit_deep-review_auto.yaml:685-713`). The test suite includes override-resistance and prompt-slot assertions (`executor-config-copilot-target-authority.vitest.ts:61-76`, `:165-196`, `:206-236`).

## Verdict

CONDITIONAL-PASS for correctness iteration 1.

No P0/P1 findings. The v1.0.2 verdict is broadly supported: 6/7 PROVEN is justified by the packet verdict table and score spot checks, 0 REGRESSION is supported by the frozen comparison table, and the P0 cli-copilot insertion point is correctly located and guarded. Two P2 documentation corrections remain: refresh the parent resource map for 012-018, and revise the research convergence wording.

## Next Dimension

Iteration 2 should review security, focused on the P0 cli-copilot Gate 3 fix proposal and implementation surface: authority-token binding, malformed `{spec_folder}` handling, large-prompt `@PROMPT_PATH` behavior, YAML write-before-dispatch ordering, and whether any remaining cli-copilot path can still mutate from recovered context.
