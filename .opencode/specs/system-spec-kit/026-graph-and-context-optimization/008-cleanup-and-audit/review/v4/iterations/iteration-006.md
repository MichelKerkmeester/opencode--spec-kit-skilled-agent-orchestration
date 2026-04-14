# Iteration 006: Lifecycle playbooks and cross-runtime agent parity

## Focus
Traceability review of the remaining lifecycle playbooks and runtime agent mirrors to re-verify F003/F004 and adjacent continuity-contract parity.

## Findings
### P0 - Blocker
- **F004**: The lifecycle-playbook remediation is not fully closed. Multiple spec-kit command docs and assets still tell operators to refresh or verify an indexed "support artifact" under `memory/`, which conflicts with the canonical-doc continuity contract and reopens the playbook drift. [SOURCE: .opencode/command/spec_kit/plan.md:345] [SOURCE: .opencode/command/spec_kit/plan.md:351] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:593] [SOURCE: .opencode/command/spec_kit/handover.md:260]

## Adversarial Self-Check
- Re-read representative lifecycle-playbook surfaces after the first hit. They still explicitly say "support artifact" and `memory/`, so this is an active contract mismatch rather than an isolated wording quirk. [SOURCE: .opencode/command/spec_kit/plan.md:351] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:593] [SOURCE: .opencode/command/spec_kit/handover.md:260]

## Ruled Out
- F003 remains closed: the four runtime `deep-review` agent manuals still agree on the single-iteration contract and the rule that only `review/` artifacts are writable inside the active spec folder. [SOURCE: .opencode/agent/deep-review.md:29] [SOURCE: .opencode/agent/deep-review.md:33] [SOURCE: .claude/agents/deep-review.md:29] [SOURCE: .claude/agents/deep-review.md:33] [SOURCE: .codex/agents/deep-review.toml:22] [SOURCE: .codex/agents/deep-review.toml:26] [SOURCE: .gemini/agents/deep-review.md:29] [SOURCE: .gemini/agents/deep-review.md:33]

## Dead Ends
- The agent-tree continuity search returned no `memory/*.md` or "support artifact" hits, so the residual drift in this pass is concentrated in spec-kit command playbooks rather than runtime agent manuals.

## Recommended Next Focus
Switch dimensions: run a security pass across the runtime gating and save/search entry points to ensure the documentation drift did not mask a trust-boundary or path-acceptance regression.
