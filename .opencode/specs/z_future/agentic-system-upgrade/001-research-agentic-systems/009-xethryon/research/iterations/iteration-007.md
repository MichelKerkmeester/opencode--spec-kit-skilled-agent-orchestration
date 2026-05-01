# Iteration 007 — Role-Switch Heuristics Without Full Autonomy

Date: 2026-04-09

## Research question
Should `system-spec-kit` adopt Xethryon's explicit role-switch trigger matrix even if it does not adopt Xethryon's autonomy toggle and `switch_agent` runtime?

## Hypothesis
The safe, transferable piece is likely the trigger clarity rather than the live mode-switch tool.

## Method
I compared Xethryon's autonomy prompt and `switch_agent` tool rules with Spec Kit's orchestrator routing table and deep-research role instructions.

## Evidence
- Xethryon's autonomy prompt enumerates a compact mapping from task types to modes, plus a mandatory post-task checklist. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/autonomy.ts:35-77]
- `switch_agent.ts` reinforces that prompt with a literal trigger matrix: "plan" routes to architect, "explore" to recon, "verify" to validator, and only coordinator should spawn teams. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/tool/switch_agent.ts:39-68]
- Xethryon's prompt loop injects autonomy instructions alongside memory and git context only when autonomy is enabled. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/prompt.ts:1574-1585]
- Spec Kit's orchestrator already has a detailed routing table and strong single-hop constraints, but it expresses them as a capability matrix rather than a short trigger heuristic. [SOURCE: .opencode/agent/orchestrate.md:89-106] [SOURCE: .opencode/agent/orchestrate.md:108-127]
- The deep-research agent similarly defines a clear single-iteration workflow, but not a compact "if the work changes shape, switch mental mode this way" shortcut. [SOURCE: .opencode/agent/deep-research.md:46-60] [SOURCE: .opencode/agent/deep-research.md:99-120]

## Analysis
Spec Kit already has the safety-critical parts that Xethryon had to invent: explicit agent roles, leaf constraints, and subagent boundaries. What it lacks is the compressed, operator-friendly trigger matrix that nudges the model toward the right role without reading a full routing table every time. That is a prompt-authoring opportunity, not a runtime-architecture opportunity. In other words, Xethryon's value here is rhetorical compression: a short, memorable set of triggers that makes the correct role transition easier to follow inside existing governance.

## Conclusion
confidence: high

finding: `system-spec-kit` should adopt Xethryon-style role-switch heuristics as prompt copy, not as an autonomy subsystem. The local orchestrator is already safer and more explicit than Xethryon's runtime tool; it just lacks the concise trigger language that makes good routing feel automatic.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/orchestrate.md`
- **Change type:** modified existing
- **Blast radius:** small
- **Prerequisites:** keep the new trigger matrix aligned with the existing agent-routing table so it never becomes a second, drifting truth source
- **Priority:** should-have

## Counter-evidence sought
I looked for an existing short trigger table in Spec Kit that said, in effect, "when the user asks X, switch mental mode to Y." I found the comprehensive routing matrix, but not the compact version.

## Follow-up questions for next iteration
- Does Xethryon's autonomous skill invocation conflict with Spec Kit's user-consent and Gate 3 model?
- Could swarm-style task boards help orchestrated research without requiring live mailbox IPC?
- Should the deep-research workflow inherit a shorter role-transition cheat sheet from the orchestrator?
