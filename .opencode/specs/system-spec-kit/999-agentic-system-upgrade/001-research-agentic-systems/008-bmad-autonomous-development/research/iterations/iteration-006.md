# Iteration 006 — Model Tiering By Stage

## Research question
How does BAD use `MODEL_STANDARD` versus `MODEL_QUALITY`, and should `system-spec-kit` adopt a comparable quality-tier split in its autonomous workflows?

## Hypothesis
BAD's cost/quality split is portable because local workflows already centralize model selection in YAML assets, but they currently default to one premium model for most long-running work.

## Method
Read BAD's configuration table and per-step model assignments, then compared them to local deep-research, deep-review, and implement workflow assets.

## Evidence
- BAD assigns `MODEL_STANDARD` to Phase 0, Step 1, Step 2, Step 4, and auto-merge, while reserving `MODEL_QUALITY` specifically for Step 3 code review. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:51-64]
- BAD's pipeline instructions explicitly bind Step 1/2/4 to `MODEL_STANDARD` and Step 3 to `MODEL_QUALITY`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:105-107]
- BAD's later steps keep the same split, including review on `MODEL_QUALITY` and merge/cleanup on `MODEL_STANDARD`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:255-352]
- Local deep-research auto config uses a single `opus` model for the agent loop. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:66-75]
- Local deep-review confirm config also uses a single `opus` model. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:69-78]
- Local autonomous implementation uses `opus` for single-agent and orchestrator/worker multi-agent modes instead of differentiating routine vs quality-sensitive stages. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:167-186]

## Analysis
BAD's model split is pragmatic rather than fancy: spend more where judgement quality matters most, and keep routine coordination, setup, and PR mechanics on a cheaper/faster tier. Local automation assets already isolate model configuration in a way that makes this easy to adopt incrementally. The main missing piece is a concept of "quality-critical stage" in the YAML contracts. This is lower risk than adopting BAD's scheduler or worktree policy because it mostly changes configuration structure, not workflow ownership.

## Conclusion
confidence: high

finding: BAD's clearest near-term win for `system-spec-kit` is stage-aware model tiering. Long-running autonomous flows should stop paying premium-model cost for every step when only review, synthesis, or contradiction resolution truly require that quality level.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define canonical `model_standard` and `model_quality` keys and mirror them across sibling assets
- **Priority:** must-have

## Counter-evidence sought
I looked for existing local YAML fields that already separate routine and high-quality models across deep-research, deep-review, or implement workflows; current assets use a single premium model in the cited sections.

## Follow-up questions for next iteration
How much extra value does BAD gain from its PR/CI repair loop after the main review step?
Would model tiering be enough on its own, or does it need staged pipeline checkpoints to matter?
Can local parity tests protect model-tier fields from drifting across command assets?
