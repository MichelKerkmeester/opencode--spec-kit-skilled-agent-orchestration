# Iteration 9: Repo Guardrails and Evaluator Independence Constraints

## Focus
Identify the strongest safety constraints and workflow boundaries that would govern any autonomous improvement loop in this repo.

## Findings
1. The top-level safety model is explicit and hard-blocking: read before edit, stay inside approved scope, verify before claiming completion, halt on uncertainty, and never mutate files without a spec folder. [SOURCE: AGENTS.md:12] [SOURCE: AGENTS.md:13] [SOURCE: AGENTS.md:14] [SOURCE: AGENTS.md:15] [SOURCE: AGENTS.md:25]
2. Gate 3 prevents opportunistic mutation. If file modification is in play, the spec-folder question overrides other work and phase-boundary re-evaluation is mandatory. [SOURCE: AGENTS.md:179] [SOURCE: AGENTS.md:182] [SOURCE: AGENTS.md:183]
3. The writable markdown surface in spec folders is intentionally narrow. `@speckit` owns most spec docs, while `research/research.md`, `handover.md`, memory generation, and a few other files are tightly scoped exceptions. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:63] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:67] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:70]
4. Completion and persistence already require evidence-based procedures. P0/P1 checklist items must be verified before "done" claims, and memory saves must use `generate-context.js` rather than direct writes. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:438] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:442] [SOURCE: AGENTS.md:200] [SOURCE: AGENTS.md:204]
5. Reviewer independence is part of the architecture. `@review` is read-only, must verify claims against real evidence, and explicitly must not review its own output. [SOURCE: .opencode/agent/review.md:24] [SOURCE: .opencode/agent/review.md:315] [SOURCE: .opencode/agent/review.md:422]

## Ruled Out
- A self-grading improvement loop is incompatible with the repo's existing reviewer boundary. Mutation and scoring need separate roles or separate phases. [SOURCE: .opencode/agent/review.md:24] [SOURCE: .opencode/agent/review.md:422]

## Dead Ends
- Broad spec-doc mutation is a non-starter for the MVP because it would collide immediately with `@speckit` exclusivity and Gate 3 rules. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:63] [SOURCE: AGENTS.md:179]

## Sources Consulted
- AGENTS.md:12
- AGENTS.md:179
- .opencode/skill/system-spec-kit/SKILL.md:63
- .opencode/agent/review.md:24

## Assessment
- New information ratio: 0.22
- Questions addressed: What capabilities are missing if we want a reliable `sk-agent-improver` rather than a one-off research packet?
- Questions answered: None newly answered; this iteration turned repo rules into explicit design constraints.

## Reflection
- What worked and why: Reading the repo's safety and documentation rules directly turned vague "be careful" guidance into concrete architecture requirements.
- What did not work and why: Looking only at agent files understates the strength of the surrounding workflow constraints.
- What I would do differently: Treat evaluator independence as a first-class design requirement from day one rather than an implementation detail.

## Recommended Next Focus
Translate those constraints into the repo-native package shape for a future `sk-agent-improver` skill and its workflow surface.
