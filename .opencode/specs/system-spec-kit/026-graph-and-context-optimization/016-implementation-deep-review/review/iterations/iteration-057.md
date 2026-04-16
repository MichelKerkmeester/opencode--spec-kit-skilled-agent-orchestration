# Iteration 57 - traceability - agent-skill-alignment

## Dispatcher
- iteration: 57 of 70
- dispatcher: cli-copilot gpt-5.4 high (operational doc review)
- timestamp: 2026-04-16T06:56:25.102Z

## Files Reviewed
- `.gemini/agents/improve-prompt.md`
- `.gemini/agents/orchestrate.md`
- `.gemini/agents/review.md`
- `.gemini/agents/ultra-think.md`
- `.gemini/agents/write.md`
- `.opencode/agent/context.md`
- `.opencode/agent/debug.md`
- `.opencode/agent/deep-research.md`
- `.opencode/agent/deep-review.md`
- `.opencode/agent/improve-agent.md`
- `.opencode/agent/improve-prompt.md`
- `.opencode/agent/orchestrate.md`
- `.opencode/agent/review.md`
- `.opencode/agent/ultra-think.md`
- `.opencode/agent/write.md`

## Findings - New
### P0 Findings
- None.

### P1 Findings
- **Gemini orchestrator still tells the Gemini runtime to load OpenCode agent definitions** — `.gemini/agents/orchestrate.md` declares `.gemini/agents/*.md` as the canonical runtime path, but its mandatory loading protocol, agent table, prompt templates, and enforcement text all hard-code `.opencode/agent/*.md` instead (`.gemini/agents/orchestrate.md:30`, `.gemini/agents/orchestrate.md:153-156`, `.gemini/agents/orchestrate.md:166-171`, `.gemini/agents/orchestrate.md:191`, `.gemini/agents/orchestrate.md:213`, `.gemini/agents/orchestrate.md:741`). That breaks runtime traceability: a Gemini orchestrator following its own contract will load the wrong mirror and can miss Gemini-specific permissions or wording drift. As a counterexample, `.gemini/agents/write.md` correctly keeps its agent-file routing on `.gemini/agents/*.md` (`.gemini/agents/write.md:26`, `.gemini/agents/write.md:234`).

```json
{
  "claim": "The Gemini orchestrator's agent-loading contract is stale because it instructs the runtime to read `.opencode/agent/*.md` even though the same file defines `.gemini/agents/*.md` as the canonical runtime surface.",
  "evidenceRefs": [
    ".gemini/agents/orchestrate.md:30",
    ".gemini/agents/orchestrate.md:153-156",
    ".gemini/agents/orchestrate.md:166-171",
    ".gemini/agents/orchestrate.md:191",
    ".gemini/agents/orchestrate.md:213",
    ".gemini/agents/orchestrate.md:741",
    ".gemini/agents/write.md:26",
    ".gemini/agents/write.md:234"
  ],
  "counterevidenceSought": "Checked other reviewed Gemini runtime docs for whether `.opencode/agent/*.md` is intentionally treated as the canonical load surface; the reviewed write agent instead keeps agent-file routing on `.gemini/agents/*.md`.",
  "alternativeExplanation": "The author may have intended `.opencode/agent/*.md` to be a shared upstream source of truth, but that explanation conflicts with the file's own path-convention rule and with the Gemini write agent's runtime-local routing.",
  "finalSeverity": "P1",
  "confidence": 0.98,
  "downgradeTrigger": "Downgrade if Gemini runtime dispatch is explicitly documented elsewhere to always load `.opencode/agent/*.md` and the `.gemini/agents/*.md` path-convention text is updated to match."
}
```

- **Review/orchestration docs require a baseline skill name that is not present in the shipped skill catalog** — both runtime review agents and both orchestrators tell callers to load `sk-code` as the baseline (`.gemini/agents/review.md:31`, `.gemini/agents/review.md:47`, `.gemini/agents/review.md:76-77`, `.opencode/agent/review.md:31`, `.opencode/agent/review.md:47`, `.opencode/agent/review.md:76-77`, `.gemini/agents/orchestrate.md:96`, `.gemini/agents/orchestrate.md:767-768`, `.gemini/agents/orchestrate.md:786-787`, `.opencode/agent/orchestrate.md:96`, `.opencode/agent/orchestrate.md:767-768`, `.opencode/agent/orchestrate.md:786-787`). The actual skill inventory exposes `sk-code-review` as the review baseline and lists the four concrete `sk-code-*` skills with no `sk-code` skill surface (`.opencode/skill/README.md:59`, `.opencode/skill/README.md:132`, `.opencode/skill/README.md:161-164`, `.opencode/skill/README.md:464`, `.opencode/skill/README.md:489-490`). An agent following the contract literally cannot resolve `sk-code`, so the skill-loading instructions are no longer traceable to the shipped assets.

```json
{
  "claim": "The reviewed orchestrator/review agent contracts are stale because they require loading a `sk-code` baseline even though the shipped skill catalog exposes `sk-code-review` as the baseline and does not publish a `sk-code` skill surface.",
  "evidenceRefs": [
    ".gemini/agents/review.md:31",
    ".gemini/agents/review.md:47",
    ".gemini/agents/review.md:76-77",
    ".opencode/agent/review.md:31",
    ".opencode/agent/review.md:47",
    ".opencode/agent/review.md:76-77",
    ".gemini/agents/orchestrate.md:96",
    ".gemini/agents/orchestrate.md:767-768",
    ".gemini/agents/orchestrate.md:786-787",
    ".opencode/agent/orchestrate.md:96",
    ".opencode/agent/orchestrate.md:767-768",
    ".opencode/agent/orchestrate.md:786-787",
    ".opencode/skill/README.md:59",
    ".opencode/skill/README.md:132",
    ".opencode/skill/README.md:161-164",
    ".opencode/skill/README.md:464",
    ".opencode/skill/README.md:489-490"
  ],
  "counterevidenceSought": "Checked the shipped skill inventory for an actual `sk-code` surface or alias; the catalog names `sk-code-review` plus the three concrete overlays, and no reviewed runtime doc exposes a resolver rule that turns `sk-code` into a supported runtime alias.",
  "alternativeExplanation": "The docs may be using `sk-code` as shorthand for the `sk-code-review` baseline, but that shorthand is not exposed as an actual skill surface in the catalog the agents are told to load from.",
  "finalSeverity": "P1",
  "confidence": 0.90,
  "downgradeTrigger": "Downgrade if the runtime skill loader or skill catalog documents `sk-code` as an accepted alias for `sk-code-review`."
}
```

### P2 Findings
- None.

## Traceability Checks
- **Cross-runtime consistency:** OpenCode runtime docs consistently self-reference `.opencode/agent/*.md`; the reviewed Gemini set is mostly aligned, but `.gemini/agents/orchestrate.md` still hard-codes OpenCode agent-definition paths and therefore breaks runtime-local mirror traceability.
- **Skill ↔ code alignment:** `improve-prompt`, `improve-agent`, `context`, `debug`, `deep-research`, `deep-review`, `ultra-think`, and `write` all point at shipped command/skill surfaces that match their documented responsibilities. The drift is concentrated in the review baseline naming, where docs say `sk-code` but the shipped catalog exposes `sk-code-review`.
- **Command ↔ implementation alignment:** Reviewed command references remain on the `.opencode/command/...` tree, which matches the repo's command surface conventions. No additional command-path drift surfaced in this subset beyond the two contract issues above.

## Confirmed-Clean Surfaces
- `.gemini/agents/improve-prompt.md`
- `.gemini/agents/ultra-think.md`
- `.gemini/agents/write.md`
- `.opencode/agent/context.md`
- `.opencode/agent/debug.md`
- `.opencode/agent/deep-research.md`
- `.opencode/agent/deep-review.md`
- `.opencode/agent/improve-agent.md`
- `.opencode/agent/improve-prompt.md`
- `.opencode/agent/ultra-think.md`
- `.opencode/agent/write.md`

## Next Focus
- Check the remaining runtime mirrors and command entry points for the same two traceability drifts: runtime-local agent-path selection and stale `sk-code` baseline naming/aliasing.
