# Iteration 12: Phased Rollout and Promotion Gates

## Focus
Turn the accumulated findings into a repo-native rollout sequence with explicit phase boundaries and promotion conditions.

## Findings
1. Repo rules already imply a staged rollout. Gate 3, spec-folder governance, and hard verification requirements make uncontrolled "start editing now" behavior incompatible with normal operation. [SOURCE: AGENTS.md:179] [SOURCE: AGENTS.md:182] [SOURCE: AGENTS.md:200]
2. The existing recommendation still holds: start propose-only, then bounded auto-edit, then parity-aware expansion. That sequence matches both the external loop's narrow-boundary discipline and the repo's strong promotion gates. [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:89] [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:156] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:179]
3. Promotion to "done" already demands evidence-backed verification. System-spec-kit requires checklist verification for P0/P1 items before completion claims, which is the right model for moving from propose-only to mutation-capable phases. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:438] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:442]
4. The command system already knows how to route phased execution. Create commands distinguish mode routing, operation routing, and validation/completion phases, so an improvement loop can adopt explicit promotion gates instead of a monolithic run mode. [SOURCE: .opencode/command/create/sk-skill.md:239] [SOURCE: .opencode/command/create/sk-skill.md:263] [SOURCE: .opencode/command/create/sk-skill.md:267]

## Ruled Out
- Jumping directly from design to auto-editing is not compatible with the repo's current safety model. The first executable phase needs to score proposals without mutating canonical files. [SOURCE: AGENTS.md:14] [SOURCE: AGENTS.md:179] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:438]

## Dead Ends
- Treating rollout as a single "MVP vs later" distinction is too coarse. The repo's existing workflows are already phaseful, and the improvement loop should inherit that discipline.

## Sources Consulted
- AGENTS.md:179
- AGENTS.md:200
- .opencode/skill/system-spec-kit/SKILL.md:438
- .opencode/command/create/sk-skill.md:239

## Assessment
- New information ratio: 0.34
- Questions addressed: What should the MVP scope, boundaries, and success metric be for a new skill in this repo?
- Questions answered: None newly answered; this iteration turned the recommendation into promotion gates.

## Reflection
- What worked and why: Mapping our recommendation onto existing gate/checklist behavior produced a rollout plan that feels native to the repo rather than imported from the external benchmark loop.
- What did not work and why: The delegated pass again needed manual normalization because it surfaced the right source files but not a finished packet-ready summary.
- What I would do differently: The implementation packet should encode phase exit criteria in the control bundle itself so promotions are machine-checkable.

## Recommended Next Focus
Pressure-test the whole idea with an adversarial critique so the final recommendation includes explicit no-go triggers rather than only optimistic design advice.
