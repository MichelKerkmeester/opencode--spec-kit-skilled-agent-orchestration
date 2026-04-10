# Iteration 015 — Orchestrator Prompt Decomposition

Date: 2026-04-10

## Research question
Does the external repo's separation of orchestrator command, runtime guard, and agent prompt suggest that `system-spec-kit`'s current orchestrator profile is too monolithic?

## Hypothesis
Yes. The local orchestrator prompt currently carries too much routing, policy, budget, verification, and loading logic in one place. The external repo spreads equivalent concerns across smaller surfaces, which looks easier to maintain and easier to enforce.

## Method
I compared the local `orchestrate.md` profile with the external orchestrator agent, orchestrator command, and orchestrator guard. I focused on the number of responsibilities each surface carries and how much of the enforcement model depends on one very large prompt.

## Evidence
- `[SOURCE: .opencode/agent/orchestrate.md:24-36]` The local orchestrator owns task decomposition, delegation, evaluation, conflict resolution, synthesis, and a command-level prohibition on direct exploration.
- `[SOURCE: .opencode/agent/orchestrate.md:49-60]` Its core workflow spans receiving, gate checks, capability scans, decomposition, budgeting, delegation, evaluation, failure handling, synthesis, and delivery.
- `[SOURCE: .opencode/agent/orchestrate.md:93-118]` Routing tables and leaf-agent tiering also live inside the same prompt.
- `[SOURCE: .opencode/agent/orchestrate.md:158-166]` Agent-loading policy is also encoded in that prompt.
- `[SOURCE: .opencode/agent/orchestrate.md:191-210]` Even task-dispatch message shape is hard-coded in the same file.
- `[SOURCE: external/agents/orchestrator.md:15-23]` The external orchestrator agent has a smaller role definition centered on loop management.
- `[SOURCE: external/agents/orchestrator.md:52-67]` Its non-goals are also narrow and explicit.
- `[SOURCE: external/agents/orchestrator.md:69-109]` The operational flow is simple and single-purpose.
- `[SOURCE: external/commands/orchestrator.md:1-18]` Command-level behavior is documented separately from the agent prompt.
- `[SOURCE: external/hooks/orchestrator-guard.py:130-175]` Enforcement logic is handled in code rather than squeezed into the prompt itself.

## Analysis
The local orchestrator is sophisticated because it is trying to be routing brain, policy manual, prompt template, budget scheduler, and quality gate all at once. That works, but it also means every change to orchestration policy risks touching a huge prompt surface. The external repo demonstrates a cleaner split: the agent prompt describes role, the command describes workflow, and the hook enforces the boundary. No single file has to carry the entire system.

For `system-spec-kit`, the best move is not to shrink orchestration ambition. It is to move some of that ambition out of the prompt. Routing tables, budget thresholds, and dispatch schemas should become machine-readable policy or smaller supporting references. The orchestrator prompt can then focus on judgment and synthesis instead of acting as a giant storage layer for operational rules.

## Conclusion
confidence: high

finding: `system-spec-kit` should refactor the orchestrator into a leaner decision prompt backed by machine-readable routing, budget, and enforcement policy. The current prompt is carrying too much system weight.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/orchestrate.md`, `.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md`, future orchestration policy manifests
- **Change type:** refactor existing
- **Blast radius:** large
- **Prerequisites:** identify which orchestration policies need to become data, hooks, or support references
- **Priority:** should-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** The orchestrator prompt itself encodes role, routing tables, nesting rules, dispatch schemas, budget policy, and review protocol.
- **External repo's approach:** The agent prompt, command workflow, and runtime guard are distinct surfaces with clearer ownership.
- **Why the external approach might be better:** It reduces prompt bloat, lowers maintenance risk, and makes policy easier to enforce mechanically.
- **Why system-spec-kit's approach might still be correct:** Keeping policy close to the prompt can improve auditability in runtimes with weak external enforcement.
- **Verdict:** REFACTOR
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Move routing tables, budget thresholds, and dispatch schemas into structured policy files; keep `orchestrate.md` as the judgment layer that references those policies.
- **Blast radius of the change:** large
- **Migration path:** Extract one concern at a time, starting with routing tables and dispatch schema, then move budget and verification policies after parity tests confirm no regression.

## Counter-evidence sought
I looked for smaller helper manifests that already own the orchestrator's policy tables. I found supporting references, but the prompt still appears to be the main storage site for many operational rules.

## Follow-up questions for next iteration
- Which orchestration policy is easiest to extract first without destabilizing behavior?
- Would a machine-readable routing manifest also help the gate-profile work from iteration 014?
- How much of the current orchestrator budget logic should remain prompt-level versus runtime-level?
