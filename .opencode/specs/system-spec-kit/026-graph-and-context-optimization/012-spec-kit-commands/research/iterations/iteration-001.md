# Iteration 001 — Focus: Q2 Prior Art in Spec-Driven Systems

## Focus
Investigate how established spec-driven and decision-driven systems handle intake before planning, then compare that with local packet precedents so `/spec_kit:start` does not inherit avoidable UX or mutation risks.

## Findings
1. GitHub Spec Kit keeps intake and planning as separate phases: first principles, then a user-facing spec focused on "what and why", then a technical plan. The clarification loop belongs inside spec authoring, not inside a generic pre-plan wizard. Local packet `037-cmd-merge-spec-kit-phase` follows the same design instinct by merging extra setup only when a specific optional mode is requested, not by bloating the default plan path. This supports making `/start` a narrow artifact-creation ritual that hands off cleanly to `/plan`, rather than a replacement for planning. [SOURCE: https://github.com/github/spec-kit/blob/main/README.md] [SOURCE: .opencode/specs/skilled-agent-orchestration/037-cmd-merge-spec-kit-phase/spec.md:40-43] [SOURCE: .opencode/specs/skilled-agent-orchestration/037-cmd-merge-spec-kit-phase/plan.md:61-78]
2. Thin CLI intake is the strongest precedent among comparable tooling. `adr-tools` uses `adr init` to establish the decision log, then `adr new <title>` to create a numbered Markdown record and immediately hands detail capture to the user's editor. `cargo-generate` similarly scaffolds from a template source rather than conducting a long interview. In this repo, the only nearby "intake" phrasing is a lightweight checklist reference, not a conversational workflow. That combination suggests `/start` should ask only for irreducible inputs, then materialize them into `spec.md`, `description.json`, and `graph-metadata.json` where the richer thinking can continue. [SOURCE: https://github.com/npryce/adr-tools/blob/master/README.md] [SOURCE: https://github.com/cargo-generate/cargo-generate/blob/main/README.md] [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/17-temporal-structural-coherence-scoring.md:13]
3. RFC-style processes front-load scope, legitimacy, and review state rather than implementation detail. The IETF works through charters, calls for adoption, working-group documents, and iterative revision before publication; the RFC Editor likewise treats publication as a staged process after Internet-Draft maturation. The useful analogy for `/start` is: create the scoped artifact early, make open questions explicit, and preserve an auditable progression into later phases. The wrong analogy would be to let research auto-rewrite the user's intent as though consensus had already been reached. [SOURCE: https://www.ietf.org/process/wgs/] [SOURCE: https://www.ietf.org/process/rfcs/] [SOURCE: https://www.rfc-editor.org/pubprocess.html]
4. This repo already has a concrete precedent for delegated pre-workflows with strict gating: the `037-cmd-merge-spec-kit-phase` packet absorbs phase setup into `plan` and `complete`, but only asks phase-specific questions when `:with-phases` is present and otherwise preserves the existing path. That is directly relevant to `/spec_kit:start`: delegation should trigger only on the empty-folder or unresolved-placeholder path, and the parent commands should stay quiet when `spec.md` already exists. The anti-pattern to avoid is always-on intake expansion that turns every `plan` or `complete` run into a surprise interview. [SOURCE: .opencode/specs/skilled-agent-orchestration/037-cmd-merge-spec-kit-phase/spec.md:52-75] [SOURCE: .opencode/specs/skilled-agent-orchestration/037-cmd-merge-spec-kit-phase/spec.md:92-114] [SOURCE: .opencode/specs/skilled-agent-orchestration/037-cmd-merge-spec-kit-phase/spec.md:126-126]
5. The highest-risk copy-proofing targets are silent mutation and concurrent state corruption. Prior `sk-deep-research` refinement work already flagged self-referential looping, tool-budget discipline, and append-only/write-once state protection, then proposed explicit lock files to prevent concurrent JSONL and strategy races. GitHub Spec Kit's README also frames specification as a thing to clarify and review, not something to accept uncritically on the first pass. For this packet, that translates into visible delegation, anchor-bounded appends, idempotency checks, and no background full-rewrite behavior in `spec.md`. [SOURCE: .opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/spec.md:146-158] [SOURCE: .opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/scratch/improvement-proposals-v3.md:188-198] [SOURCE: https://github.com/github/spec-kit/blob/main/README.md]

## Ruled Out
- Copying GitHub Spec Kit's current phase model literally. Its precedent is useful, but it does not expose a standalone intake command analogous to `/spec_kit:start`.
- Copying `adr-tools` literally as a title-only command. Our command has to emit three linked artifacts, so it needs slightly more structure than `adr new`.
- Treating deep-research write-back as permission to rewrite user-authored `spec.md` sections wholesale.

## Dead Ends
- `rg -n "interview|intake" .opencode/command/ .opencode/skill/` produced almost no direct command-surface precedent, so local evidence was indirect rather than a ready-made pattern.
- A quick `MEMORY.md` keyword pass did not return extra hits beyond the sibling packets already named in the strategy file.
- I could not retrieve a reliable primary source for `rfcs/rfcs` or "OpenRFC" within this iteration budget, so RFC evidence here leans on IETF and RFC Editor primary process pages instead.

## Sources Consulted
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/deep-research-config.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/deep-research-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/deep-research-state.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md`
- `.opencode/specs/skilled-agent-orchestration/037-cmd-merge-spec-kit-phase/spec.md`
- `.opencode/specs/skilled-agent-orchestration/037-cmd-merge-spec-kit-phase/plan.md`
- `.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/spec.md`
- `.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/scratch/improvement-proposals-v3.md`
- `.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/17-temporal-structural-coherence-scoring.md`
- `https://github.com/github/spec-kit/blob/main/README.md`
- `https://github.com/npryce/adr-tools/blob/master/README.md`
- `https://github.com/cargo-generate/cargo-generate/blob/main/README.md`
- `https://www.ietf.org/process/wgs/`
- `https://www.ietf.org/process/rfcs/`
- `https://www.rfc-editor.org/pubprocess.html`

## Assessment (newInfoRatio 0.0–1.0, questions addressed, questions answered)
- `newInfoRatio`: `0.75`
- Questions addressed: `Q2`, `Q4`, `Q7`
- Questions answered: `Q2`

## Reflection (what worked / what failed / what to do differently)
- What worked: pairing external prior art with local sibling packet evidence made the conclusions concrete instead of generic.
- What failed: this repo has very little explicit intake vocabulary at the command layer, so raw grep alone was not enough to answer Q2.
- What to do differently: next pass should inspect command/YAML mutation boundaries directly and verify how much of `/start` can be delegated without introducing hidden coupling.

## Recommended Next Focus
Q6 — determine the safest post-synthesis `spec.md` write-back contract: anchor-bounded append, fenced addendum, or constrained anchor updates, using local command/YAML evidence plus document-mutator precedents.
