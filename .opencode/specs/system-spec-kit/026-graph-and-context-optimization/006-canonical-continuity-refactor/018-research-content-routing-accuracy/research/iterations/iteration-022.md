# Iteration 22: Handover Pattern Map

## Focus
Separate the exact handover language that should stay routable from the specific drop cues that are currently too strong.

## Findings
1. The direct heuristic collision is narrow and explicit: `RULE_CUES.drop` and the hard drop floor both include `git diff`, while the handover prototypes `HS-01` and `HS-03` both use `git diff` as part of next-session instructions. That makes `git diff` the clearest phrase that is simultaneously valid handover language and a current hard drop signal. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:369] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:877] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:138] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:154]
2. The second collision is prototype-shaped, not regex-shaped. `HS-04` says `To resume, run the resume command and then review ... files in order`, which is close to the generic recovery boilerplate in `DR-02` about `run resume`, `list memories`, and `force re-index`. This overlap can bias Tier 2 even when the Tier 1 hard drop heuristic does not fire. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:162] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:314]
3. The live handover floor is too small for the state-first language already present in the prototypes. Today it only boosts `recent action`, `next safe action`, `current state`, and `resume`, but the strongest handover-specific phrases are `active files`, `current blockers`, `remaining effort`, `immediate next session work`, and `fresh session before closure`. Those phrases appear in `HS-02`, `HS-03`, and `HS-05` and should be part of the handover floor. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:868] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:146] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:170]
4. The exact heuristic split for phase `002` is:
   - keep hard drop wrappers as `/\b(conversation transcript|generic recovery hints|tool telemetry|table of contents|raw tool|repository state)\b/` plus `/\bassistant:|user:|tool:|recovery scenarios|diagnostic commands\b/`
   - move softer operational commands into a lower-weight branch such as `/\b(git diff|list memories|force re-index)\b/`
   - expand the handover floor with `/\b(active files?|current blockers?|remaining effort|immediate next session work|fresh session|restart (?:the )?mcp server)\b/`
   This keeps transcript-like boilerplate hard-dropped while letting state-heavy handover notes survive ordinary operator commands. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:369] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:877] [INFERENCE: derived from the current heuristic split and the prototype wording]

## Ruled Out
- Removing all command language from handover guidance. Real handover notes legitimately contain commands; the fix is to demote the soft ones, not ban them.

## Dead Ends
- Treating resume-command language as the same thing as transcript or wrapper boilerplate.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:369`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:877`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:138`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:314`

## Assessment
- New information ratio: 0.31
- Questions addressed: RQ-8
- Questions answered: RQ-8

## Reflection
- What worked and why: Matching individual handover prototype sentences against the live drop regex separated the hard heuristic problem from the softer Tier 2 overlap.
- What did not work and why: Looking only at the heuristic tables would have missed the resume-command overlap living in the prototype corpus.
- What I would do differently: Keep a direct "hard conflict" versus "prototype conflict" split earlier in future routing audits.

## Recommended Next Focus
Estimate the true wiring work for Tier 3, including the missing cache and runtime integration seams, not just the constructor callsite.
