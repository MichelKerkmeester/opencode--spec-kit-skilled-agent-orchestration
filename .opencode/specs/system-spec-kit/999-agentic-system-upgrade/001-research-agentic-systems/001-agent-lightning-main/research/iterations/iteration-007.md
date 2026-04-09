# Iteration 007 — Framework Wrappers Versus Session Hooks

Date: 2026-04-10

## Research question
Do Agent Lightning's zero-code-change framework wrappers provide a pattern that `system-spec-kit` should merge into its existing hook system?

## Hypothesis
Agent Lightning's wrappers likely instrument live agent execution, while Public's hooks likely exist for session continuity. If that difference is real, directly merging the two would be a layering mistake.

## Method
I reviewed Agent Lightning's zero-code-change positioning, its Claude Code example, and the `LitAgent` contract to understand what its wrappers actually wrap. I then compared those patterns against Public's documented hook system and its stated purpose.

## Evidence
- Agent Lightning describes its core proposition as near-zero-code-change optimization: agents keep running as usual while emit helpers or tracers capture prompts, tool calls, and rewards into the store. [SOURCE: external/README.md:20-23] [SOURCE: external/README.md:65-69]
- The Claude Code example wraps an existing agent experience with a Lightning Store, an LLM proxy, and a controller, then persists raw trace streams and optional converted datasets as output artifacts. [SOURCE: external/examples/claude_code/README.md:5-12] [SOURCE: external/examples/claude_code/README.md:37-43] [SOURCE: external/examples/claude_code/README.md:105-112]
- `LitAgent` confirms the wrapped runtime contract: the runner/trainer infrastructure manages orchestration, tracing, and persistence around the agent's rollout methods. [SOURCE: external/agentlightning/litagent/litagent.py:45-50] [SOURCE: external/agentlightning/litagent/litagent.py:181-203]
- Public's hook system is documented very differently. It exists to automate context preservation at runtime lifecycle boundaries, and the reference explicitly says hooks are transport reliability for the same retrieval primitives used elsewhere. [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:3-6]
- Public's hook lifecycle covers `PreCompact`, `SessionStart`, and async `Stop`, all centered on cached context, prior session state, and transcript-derived metrics rather than on runtime execution tracing. [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:21-35]
- The same reference states the cross-runtime fallback path as `session_bootstrap()` and `session_resume()`, again confirming that hook scope is recovery and context delivery, not agent instrumentation. [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:48-57]

## Analysis
The two systems operate at different layers. Agent Lightning's wrappers surround live execution so traces and rewards can be observed and optimized. Public's hooks exist to move context into and out of runtime sessions reliably. Both are "hooks" in a broad sense, but they are not substitutable mechanisms.

That means a direct adoption would be harmful. If Public folded execution-observability wrappers into the existing hook system, it would blur the contract of a subsystem that is currently intentionally narrow and understandable. The better lesson is architectural separation: if Public ever experiments with execution telemetry, it should do so in a new observability module rather than by overloading the session-hook layer.

## Conclusion
confidence: high

finding: Agent Lightning's framework wrappers should not be merged into Public's existing hook system. The external repo's wrappers instrument execution; Public's hooks preserve context across runtime lifecycle boundaries. Treating them as the same layer would create conceptual and operational drift inside `system-spec-kit`.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/references/config/hook_system.md`
- **Change type:** rejected
- **Blast radius:** medium
- **Prerequisites:** none for the rejection itself; if future telemetry work is proposed, it should start as a separate observability packet
- **Priority:** rejected

## Counter-evidence sought
I looked for evidence that Public's hooks already capture runtime execution traces or evaluator signals and did not find it. I also looked for evidence that Agent Lightning's wrappers were merely startup or transport glue, but the Claude Code example and `LitAgent` contract show they wrap live rollout execution.

## Follow-up questions for next iteration
- Which operational metrics from Agent Lightning would most improve Public's deep-research and deep-review dashboards?
- Should Public adopt any of Agent Lightning's resource versioning ideas for templates or prompts?
- How should this phase explicitly separate RL-specific value from the generic multi-agent loop work already scoped to phase 005?
