# Iteration 028 — Redesign The Gate And Hook Surface Into A Thin Operator Contract

Date: 2026-04-10

## Research question
Does the external repo achieve usable autonomy with less gate and rule machinery, and does that mean `system-spec-kit` should redesign how its gate, hook, and `CLAUDE.md` system is exposed?

## Hypothesis
Yes. The local gate and hook stack has real value, but too much of that machinery is surfaced directly to the operator. The system should keep the internals while publishing a much thinner operator contract.

## Method
I compared the local `CLAUDE.md`, constitutional gate memories, and start/stop hooks with the external repo's lighter activation contracts. I focused on what the human is asked to understand, not just what the runtime can enforce.

## Evidence
- `[SOURCE: CLAUDE.md:107-141]` The local runtime-level contract exposes Gate 1, Gate 2, Gate 3, and the consolidated-question protocol directly in the main operator instructions.
- `[SOURCE: CLAUDE.md:147-165]` Memory-save and completion-verification rules are also surfaced as explicit hard blocks in the same document.
- `[SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:31-40]` Tool-routing constitutional memory adds another always-surfaced decision layer for search and retrieval.
- `[SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:58-68]` Gate-enforcement constitutional memory cross-references the gate stack again and reiterates Gate 3 precedence.
- `[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:111-170]` The startup hook already knows how to inject session context, recovery tools, structural context, and stale-graph guidance automatically.
- `[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:60-105]` The stop hook already knows how to auto-save context from lightweight session state when the needed signals exist.
- `[SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/005-intellegix-code-agent-toolkit-master/external/commands/orchestrator.md:36-43]` The external orchestrator exposes a much thinner persistent mode model to the operator.
- `[SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/005-intellegix-code-agent-toolkit-master/external/agents/orchestrator.md:60-68]` The external repo keeps several constraints real without surfacing a large constitutional stack at the public boundary.

## Analysis
The local system has already paid for sophisticated automation: startup context injection, stop-time autosave, structural readiness hints, tool-routing guidance, and gate enforcement. Yet the operator still sees a giant wall of behavior rules. That is a design mismatch. The system is acting like a powerful runtime with a weak shell instead of a powerful runtime with a strong shell.

The external repo is simpler partly because it has less governance. But it also demonstrates a better separation between policy and operator contract. `system-spec-kit` should keep the policy stack and the hooks, but generate a concise operator brief from them instead of surfacing every rule directly in `CLAUDE.md`.

## Conclusion
confidence: high

finding: `system-spec-kit` should redesign its gate and hook exposure into a thin operator contract, keeping the current policy internals and automation machinery but moving most of the rule detail out of the default operator-facing surface.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `CLAUDE.md`, `.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md`, `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
- **Change type:** must-have
- **Blast radius:** operator-surface
- **Prerequisites:** define the concise operator brief and the hidden policy source of truth it is generated from
- **Priority:** must-have

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators read a large constitutional and gate-heavy surface even though hooks and policy modules already automate much of the behavior.
- **External repo's equivalent surface:** The external repo gives the operator a thinner role contract while keeping important constraints in the background.
- **Friction comparison:** The local system is safer and more capable, but it feels heavier than it needs to because too much policy is directly exposed.
- **What system-spec-kit could DELETE to improve UX:** Delete most operator-facing exposure of detailed gate internals and constitutional routing rules.
- **What system-spec-kit should ADD for better UX:** Add a generated concise runtime brief that explains only what the operator needs to know right now.
- **Net recommendation:** REDESIGN

## Counter-evidence sought
I looked for evidence that the current `CLAUDE.md` scale and repeated constitutional surfacing are necessary for operator comprehension now that hooks already inject context and recovery guidance. I did not find a strong justification for keeping that much detail in the default shell.

## Follow-up questions for next iteration
- Which rules must remain operator-visible because they genuinely require human choice?
- Can startup and continuation profiles automatically suppress irrelevant gate prose?
- Should constitutional memories remain always surfaced for maintainers only, with a thinner user brief above them?
