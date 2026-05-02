# Iteration 1: Correctness Contracts On Review Loop Runtime

## Focus
This pass reviewed correctness on the live deep-review execution path, with emphasis on whether the canonical agent instructions, YAML workflow, and reducer parser still agree on the iteration contract. I concentrated on the review loop surfaces most likely to produce false PASS/CONTINUE outcomes: the agent output schema, legal-stop gating, and state-log serialization.

## Scorecard
- Dimensions covered: [correctness, traceability]
- Files reviewed: 12
- New findings: P0=0 P1=2 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Findings

### P0 — Blocker
- None.

### P1 — Required
- **F001**: Canonical deep-review agent still emits an unparseable iteration schema — `.opencode/agent/deep-review.md:147` — The live agent contract tells the LEAF reviewer to write `# Review Iteration [N]: ...` plus findings like `### P0-NNN:` with freeform bullets, but the reducer only extracts `- **FNNN**:` bullets inside `### P0` / `### P1` / `### P2` subsections from `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:137-206`. A run that follows the canonical agent file can therefore surface zero findings into the registry and dashboard even when the markdown contains substantive defects.
- **F002**: Claim-adjudication is documented as a hard stop gate but never participates in STOP eligibility — `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:574` — `step_post_iteration_claim_adjudication` sets `claim_adjudication_passed=false` and states that STOP must stay blocked until the packet is present, but `step_check_convergence` only evaluates convergence, dimension coverage, P0 resolution, evidence density, and hotspot saturation at `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:388-429`; no branch reads `claim_adjudication_passed`. The loop can therefore stop and synthesize after a P0/P1 iteration whose required adjudication packet failed validation.

### P2 — Suggestion
- **F003**: Review config JSONL collapses requested dimensions into one string element — `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:260` — The init record writes `\"reviewDimensions\":[\"{review_dimensions}\"]` even though the same workflow says dimensions should be normalized before writing at `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:240-241`; the confirm mirror repeats the same shape at `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:259`. Consumers reading the state log get `["correctness,security"]` or `["all"]` instead of discrete dimensions, which weakens replay/debug tooling and any future reducer migration that trusts the JSONL contract.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail | hard | `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/spec.md:150` | Success criterion 6 requires no prose-vs-runtime drift, but the canonical deep-review agent contract still diverges from the reducer parser used on the live path. |
| workflow_runtime | fail | hard | `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:574` | Claim-adjudication is described as STOP-blocking state, yet the legal-stop decision tree never consults the flag it sets. |
| state_schema | partial | soft | `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:240` | The workflow comments promise normalized review dimensions, but the emitted JSONL config row still serializes them as a single string element. |

## Assessment
- New findings ratio: 1.0
- Dimensions addressed: [correctness, traceability]
- Novelty justification: First iteration of the session, so all three findings are net-new. Two hit release-relevant live-path correctness contracts, and one identifies schema drift in the persisted review state.

## Ruled Out
- Graph upsert missing from the visible review path: Not supported by the code — `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:604` and `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:649` both wire `mcp__spec_kit_memory__deep_loop_graph_upsert`.
- Code Graph tool-budget drift on the review path: Not supported by the code — `.opencode/command/spec_kit/deep-review.md:4` and `.opencode/agent/deep-review.md:15-16` both provision `code_graph_query` and `code_graph_context`.

## Dead Ends
- Coverage-graph score parity: No correctness defect surfaced in this pass because the handler emits a canonical numeric score and the reducer consumes a named score path before falling back to averaging.

## Recommended Next Focus
Security, with emphasis on session scoping and fail-closed behavior across the coverage-graph handlers, read helpers, and review/research reducer corruption paths. If that stays clean, rotate into traceability across the confirm YAML mirrors and reference docs.
