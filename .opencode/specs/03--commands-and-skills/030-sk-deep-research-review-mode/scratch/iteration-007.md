# Iteration 7: Q6 `@deep-review` Agent Architecture

## Focus
Determine which architectural changes would make `@deep-review` more effective, with emphasis on write boundaries, tool budget, dispatch context, adversarial self-check design, and cross-runtime consistency. [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/deep-research-strategy.md:31-32] [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/deep-research-strategy.md:125-127]

## Current Architecture Snapshot
1. The OpenCode canonical `@deep-review` definition says the agent "does NOT modify" reviewed code and may write only `scratch/` artifacts, but its machine-level permission block still grants broad `write`, `edit`, `bash`, and `external_directory` access. That means the real enforcement boundary is weaker than the prose contract. [SOURCE: .opencode/agent/deep-review.md:6-19] [SOURCE: .opencode/agent/deep-review.md:30-32] [SOURCE: .opencode/agent/deep-review.md:366-370]
2. The review loop dispatch already sends dimension, scope files, prior severity counts, cross-reference targets, rubric, and a generic 9/12/13 budget contract, then leaves both the iteration-level and final adversarial checks to prose guidance rather than a typed handoff. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:343-373] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:501-508]
3. `@deep-review` is derived from the `@deep-research` loop shell, but the two agents have different operating needs: `@deep-research` is allowed to write `research.md` and use `WebFetch`, while `@deep-review` is verification-heavy, scratch-only, and depends on stronger skepticism before findings influence convergence. [SOURCE: .claude/agents/deep-research.md:23-27] [SOURCE: .claude/agents/deep-research.md:93-104] [SOURCE: .opencode/agent/deep-review.md:30-32] [SOURCE: .opencode/agent/deep-review.md:143-146]

## Findings
### 1. Tighten machine-enforced write permissions, not the read-only contract
The right change is fewer effective write permissions to reviewed content, not more. Today the OpenCode runtime grants workspace-level mutation powers even though the body says writes must be limited to `scratch/iteration-NNN.md`, `scratch/deep-review-strategy.md`, and `scratch/deep-research-state.jsonl`. That gap is big enough that accidental or convenience edits to review targets are prevented only by instruction-following, not by the runtime boundary. [SOURCE: .opencode/agent/deep-review.md:6-19] [SOURCE: .opencode/agent/deep-review.md:366-370]

Recommended architecture:
- Keep review targets strictly read-only.
- Restrict writable paths to an explicit scratch allowlist.
- Prefer one new structured output file per iteration, such as `scratch/iteration-NNN.findings.json`, then let the orchestrator own JSONL append and cumulative strategy mutation.
- Remove `external_directory: allow` from the canonical runtime unless a concrete review workflow requires it.

[INFERENCE: Moving cumulative state mutation one layer up reduces accidental corruption and makes the review agent closer to an evidence-collector than a mini-orchestrator.]

### 2. A single universal 9-12 tool-call budget is too blunt
The current review agent says 9-12 target, hard max 13, while the research loop config for this session still carries a 12-call maximum and `@deep-research` itself uses the lighter 8-11 target, hard max 12 pattern. That inconsistency is already a contract smell, and it also hides that review iterations are not all the same cost. Cross-runtime integrity and adversarial re-checks are structurally more expensive than a simple dimension scan. [SOURCE: .opencode/agent/deep-review.md:115-115] [SOURCE: .opencode/agent/deep-review.md:291-298] [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/deep-research-config.json:3-8] [SOURCE: .claude/agents/deep-research.md:104-104] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:368-369]

Recommended architecture:
- Replace the single budget with `budgetProfile`.
- `scan`: 9-11 total calls for ordinary dimension discovery.
- `verify`: 11-13 total calls for cross-runtime or cross-reference checks.
- `adjudicate`: 8-10 total calls for skepticism-only follow-up on carried findings.
- Make the orchestrator choose the profile and pass it in dispatch context.

[INFERENCE: The real problem is not "too many calls"; it is that discovery, verification, and adjudication are currently forced into the same cost envelope.]

### 3. The dispatch template needs richer state, not just more prose
The YAML dispatch already sends scope and rubric context, but it does not send the most decision-shaping review metadata: which files were already covered, which open findings are still disputed, which exhausted approaches must be avoided, what runtime capability differences exist, or what schema version the agent should write against. Without that, each iteration has to rediscover too much context from scratch files or infer hidden constraints. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:343-373] [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/deep-research-strategy.md:99-127]

Recommended dispatch additions:
- `reviewContractVersion`
- `budgetProfile`
- `allowedWritablePaths`
- `filesAlreadyReviewed` and `filesRemaining`
- `activeFindingsForDimension`
- `contestedFindingRefs`
- `exhaustedApproaches`
- `requiredEvidenceQuorum` for gate-relevant findings
- `runtimeCapabilityProfile` for cross-runtime checks
- `expectedOutputs` including optional structured finding packet

### 4. The adversarial self-check should become a typed claim-validation protocol
The current design improves on raw review by requiring Hunter/Skeptic/Referee for P0, compact skeptic/referee for gate-relevant P1, and a final orchestrator self-check during synthesis. The weakness is timing and structure: the same iteration still records findings before any independent typed adjudication boundary, and the final whole-run self-check happens late, after low-confidence findings may already have influenced strategy and convergence. [SOURCE: .opencode/agent/deep-review.md:143-146] [SOURCE: .opencode/agent/deep-review.md:374-395] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:501-508]

Recommended architecture:
- Require every new P0/P1 to emit a claim packet with `claim`, `evidenceRefs`, `counterevidenceSought`, `alternativeExplanation`, `finalSeverity`, `confidence`, and `downgradeTrigger`.
- Add an immediate post-iteration orchestrator adjudication step for new P0/P1 before convergence math uses them.
- Treat synthesis-time adversarial review as a second-pass audit, not the first durable adjudication boundary.
- Keep P2 lightweight, but still require a brief "why not higher severity" note when evidence is weak.

[INFERENCE: The important improvement is not adding more skepticism text inside the agent; it is externalizing skeptical evidence in a form the orchestrator can validate early.]

### 5. Cross-runtime prose is aligned, but capability metadata still drifts
The four runtime copies are very close in body text, which is good. The main drift is in capability metadata and lineage:
- Claude lists explicit core tools plus `spec_kit_memory`, but the review body assumes `memory_search` is available through MCP. [SOURCE: .claude/agents/deep-review.md:4-13] [SOURCE: .claude/agents/deep-review.md:89-99]
- Gemini lists file/shell tools only, but the body still refers to `memory_search`, so its declared capability surface is under-specified. [SOURCE: .gemini/agents/deep-review.md:4-15] [SOURCE: .gemini/agents/deep-review.md:92-100]
- Codex marks itself as converted from `.opencode/agent/chatgpt/deep-review.md`, not from `.opencode/agent/deep-review.md`, which makes the generation lineage ambiguous even though the body content currently matches. [SOURCE: .codex/agents/deep-review.toml:1-5] [SOURCE: .opencode/agent/chatgpt/deep-review.md:1-24]
- OpenCode keeps the broadest permission surface of the set. [SOURCE: .opencode/agent/deep-review.md:6-19]

Recommended architecture:
- Generate runtime front matter from one agent-capability manifest, not by manually copying headers.
- Separate `body contract` drift from `capability contract` drift in validation.
- Add a cross-runtime parity check that specifically compares writable scope, memory availability, and canonical-source lineage.

### 6. `@deep-review` should specialize as an evidence packet author, not a mini synthesizer
`@deep-research` legitimately writes progressive research artifacts and can broaden scope with WebFetch because its job is discovery. Review mode is different: the orchestrator already owns final deduplication, report compilation, and final adversarial self-check. The more `@deep-review` is asked to perform synthesis-like cumulative bookkeeping itself, the more iteration cost and drift risk it accumulates. [SOURCE: .claude/agents/deep-research.md:27-27] [SOURCE: .claude/agents/deep-research.md:93-104] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:481-559]

Recommended specialization split:
- Agent: gather evidence, classify findings, emit structured finding packet, suggest next focus.
- Orchestrator: update cumulative state, dedupe, adjudicate new P0/P1, manage convergence, compile report.
- Final synthesis: build planner-facing report from deduped registry plus traceability state.

## Recommended Changes
1. Narrow canonical runtime permissions to scratch-only writes and remove unnecessary workspace-wide mutation powers.
2. Replace the one-size-fits-all 9-12 budget with explicit `scan`, `verify`, and `adjudicate` budget profiles.
3. Expand the dispatch template with structured state: contested findings, exhausted approaches, reviewed-file coverage, runtime capability profile, and expected output schema.
4. Convert adversarial self-check from prose guidance into a typed claim packet plus immediate orchestrator adjudication for new P0/P1.
5. Add automated cross-runtime parity checks for front matter/tooling, not just body-text similarity.
6. Reposition `@deep-review` as a scratch-output evidence agent while the orchestrator owns cumulative mutation and synthesis.

## Ruled Out
- Granting `@deep-review` broader permission to edit review targets directly.
- Keeping one universal 9-12 budget for all review iteration types.
- Relying on same-iteration Hunter/Skeptic/Referee as the only durable validation boundary for P0/P1.
- Treating cross-runtime consistency as "solved" just because the markdown bodies are nearly identical.

## Sources Consulted
- `.opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/deep-research-config.json`
- `.opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/deep-research-state.jsonl`
- `.opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/deep-research-strategy.md`
- `.opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/iteration-006.md`
- `.opencode/agent/deep-review.md`
- `.opencode/agent/chatgpt/deep-review.md`
- `.claude/agents/deep-review.md`
- `.claude/agents/deep-research.md`
- `.codex/agents/deep-review.toml`
- `.gemini/agents/deep-review.md`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml`
- `.opencode/skill/sk-deep-research/references/loop_protocol.md`

## Assessment
- `newInfoRatio`: `0.39`
- Addressed: `Q6`
- Answered this iteration: `Q6`. This iteration added concrete architectural proposals around permission hardening, budget profiles, dispatch-state enrichment, typed adversarial adjudication, and cross-runtime capability parity that were not present in prior iterations.

## Reflection
- Worked: comparing runtime front matter separately from shared body text exposed the real consistency risk much faster than body-only diffing.
- Worked: comparing `@deep-review` against `@deep-research` clarified that review mode needs stronger validation boundaries, not just the same loop with severity labels added.
- Failed: the current dispatch prompt is informative but still too prose-heavy to expose contested findings or writable-boundary intent as machine-checkable inputs.
- Caution: if the repo adopts a canonical agent manifest from Q1, review-agent capability generation and parity validation should piggyback on that same pipeline instead of becoming a second independent generator.

## Recommended Next Focus
Q7: decide how `@deep-review` should integrate with the existing `@review` agent and `sk-code--review` skill so the review loop reuses the severity/rubric logic without duplicating contracts or drifting from the baseline reviewer behavior.
