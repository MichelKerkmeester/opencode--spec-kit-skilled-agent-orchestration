# Iteration 005 — One-Pass Self-Reflection

Date: 2026-04-09

## Research question
Can Xethryon's one-pass self-reflection gate improve `system-spec-kit` deep-research quality without importing hidden runtime behavior?

## Hypothesis
The exact runtime hook is too application-specific to port directly, but the underlying pattern of a single cheap critique pass should transfer well to the deep-research synthesis workflow.

## Method
I traced Xethryon's reflection module and its reinjection point in the prompt loop, then compared that to the current Spec Kit deep-research command/agent workflow.

## Evidence
- Xethryon's reflection system is constrained to one pass, only for turns with tool calls, and disabled for subagents and hidden agents. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/reflection.ts:4-13] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/reflection.ts:34-53]
- The reflection prompt is built from the last user request plus assistant text and tool outputs, and the parser collapses the verdict to `pass` or `revise`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/reflection.ts:69-148]
- The main loop runs reflection only when a response is otherwise finished, and on `revise` it injects a synthetic `<self-reflection>` user message before allowing exactly one more pass. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/prompt.ts:1383-1431]
- Spec Kit's deep-research auto workflow emphasizes externalized state, convergence detection, and progressive file outputs, but it does not define a separate critique or revise gate before publication. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:20-23] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:94-116] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:212-260]
- The `@deep-research` agent already requires source-backed findings and includes a human-style reflection section, but that reflection is descriptive rather than an explicit pass/fail publication gate. [SOURCE: .opencode/agent/deep-research.md:113-120] [SOURCE: .opencode/agent/deep-research.md:145-156]

## Analysis
Xethryon's strongest reflection idea is not the hidden extra loop itself; it is the discipline of allowing exactly one bounded critique pass with a narrow remit. That pattern maps cleanly onto Spec Kit's deep-research workflow because research synthesis already has an explicit file-based boundary: before `research/research.md` is finalized, the workflow can run one structured self-check against evidence density, contradiction handling, and claim verification. Unlike Xethryon's live-chat loop, Spec Kit can make this step visible and auditable in the packet artifacts.

## Conclusion
confidence: high

finding: `system-spec-kit` should adopt the "one bounded critique pass" pattern, but as an explicit research-publication gate rather than a hidden runtime loop. The best target is the deep-research workflow, where an evidence-verification pass can improve output quality without surprising the user or undermining governance.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- **Change type:** architectural shift
- **Blast radius:** medium
- **Prerequisites:** define a compact verdict schema for `pass | revise` and decide where the critique is recorded
- **Priority:** should-have

## Counter-evidence sought
I looked for an existing explicit publication-quality gate in the deep-research workflow beyond convergence checks and source requirements. I found reflection-style narrative sections, but not a separate bounded revise decision before synthesis is accepted.

## Follow-up questions for next iteration
- Does Spec Kit already expose enough git context that a Xethryon-style live prompt injection would be redundant?
- Can Xethryon's autonomy role-switch heuristics improve local orchestrator prompts without introducing unsafe autonomy?
- Which parts of Xethryon's swarm/task-board model overlap with packet `002` versus genuinely adding new phase `009` value?
