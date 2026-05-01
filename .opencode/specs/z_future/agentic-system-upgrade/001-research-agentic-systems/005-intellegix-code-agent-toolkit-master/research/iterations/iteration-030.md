# Iteration 030 — Keep Hidden Automation, Reject Copying External Minimalism Literally

Date: 2026-04-10

## Research question
Should `system-spec-kit` broadly delete hooks, memory integration, and spec artifacts just to mimic the external repo's simpler operator surface?

## Hypothesis
No. The external repo's simplicity is partly a function of narrower scope. `system-spec-kit` should thin its surface aggressively, but preserve the hidden automation and context systems that solve a broader problem.

## Method
I compared the external repo's narrower orchestration contract with the local hook-driven context, session continuity, and spec-packet machinery. I looked for which complexity is avoidable surface area versus which complexity is solving real product requirements.

## Evidence
- `[SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/005-intellegix-code-agent-toolkit-master/external/agents/orchestrator.md:130-146]` The external repo keeps project memory and standards in a lighter home-directory pattern system, reflecting a narrower operational scope.
- `[SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/005-intellegix-code-agent-toolkit-master/external/commands/orchestrator.md:26-33]` The external single-loop model intentionally rejects decomposition and concurrent public modes for the main path.
- `[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:129-170]` The local startup hook can already inject memory status, code-graph state, recovery tools, structural context, and continuity hints.
- `[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:60-105]` The local stop hook can already auto-save bounded context through `generate-context.js`.
- `[SOURCE: .opencode/skill/system-spec-kit/SKILL.md:30-38]` The local platform explicitly targets file modification workflows across code, docs, configs, templates, and tooling files.
- `[SOURCE: .opencode/skill/system-spec-kit/SKILL.md:61-73]` It also carries strong spec-folder exclusivity and artifact ownership constraints that the external repo does not try to match.

## Analysis
The external repo's simplicity is a useful design pressure, but not a full replacement model. `system-spec-kit` owns stricter documentation, broader context preservation, deeper packet workflows, and stronger recovery guarantees. Those things require more internal machinery. Deleting that machinery would not create a better version of the local system; it would create a narrower different product.

So the correct Phase 3 endpoint is surgical: delete friction at the shell, not capability in the core. Keep hooks, keep memory, keep spec packets, keep specialized loops where they solve real problems. The redesign target is operator perception and entry cost, not a full mechanical downgrade to the external repo's scope.

## Conclusion
confidence: high

finding: `system-spec-kit` should reject broad deletion of hooks, memory integration, and spec artifacts in pursuit of external-style minimalism. Thin the shell, keep the capabilities.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `CLAUDE.md`, `.opencode/skill/system-spec-kit/SKILL.md`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
- **Change type:** rejected
- **Blast radius:** architectural
- **Prerequisites:** none
- **Priority:** rejected

## UX / System Design Analysis

- **Current system-spec-kit surface:** The shell is too heavy, but it sits on top of meaningful automation, context, and packet capabilities.
- **External repo's equivalent surface:** The external repo is simpler because it solves a narrower orchestration problem.
- **Friction comparison:** The local surface is worse today, but the local core is materially stronger for governed, context-rich workflows.
- **What system-spec-kit could DELETE to improve UX:** Delete exposed ceremony and duplicated explanatory text, not the underlying automation stack.
- **What system-spec-kit should ADD for better UX:** Add a thinner generated shell that lets the stronger internals stay mostly invisible.
- **Net recommendation:** KEEP

## Counter-evidence sought
I looked for evidence that the external repo's lighter surface also provides equivalent context recovery, packet governance, and artifact ownership guarantees. I did not find those equivalents.

## Follow-up questions for next iteration
- Which internal capabilities are truly essential and should be non-negotiable in future simplification work?
- Can the system expose a "simple mode" without creating a second divergent product?
- What should be measured first after shell simplification to confirm the UX actually improved?
