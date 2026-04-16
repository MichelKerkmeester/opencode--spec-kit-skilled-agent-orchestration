# Iteration 14: Handover And Drop Prototype Boundary

## Focus
Determine whether the prototype library helps disambiguate handover from drop, or whether it embeds the same operational-command overlap seen in the heuristic layer.

## Findings
1. The handover prototypes themselves contain the phrases that trigger or resemble drop logic. `HS-01`, `HS-03`, and `HS-04` explicitly mention `verify`, `git diff`, `commit`, `run the resume command`, and file-review instructions. Those are realistic handovers, but they sit close to drop-style operational chatter. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:83]
2. A packet-local nearest-neighbor scan shows `HS-04` is closest to `DR-01`, the conversation-transcript drop prototype, while `HS-03` is closest to the same drop example. That means the prototype corpus is not drawing a clean line between "resume plan" and "operator chatter with commands". [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:83] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:165] [INFERENCE: packet-local nearest-neighbor comparison over prototype token sets run during iteration 14]
3. The drop prototypes are better anchored on truly non-canonical signals such as timestamps, `assistant:`/`tool:` wrappers, table-of-contents scaffolding, truncation notes, and raw telemetry. That suggests the best phase-002 prototype change is not to rewrite correctly categorized drop examples, but to add or strengthen handover examples around stop-state language (`active files`, `current blocker`, `estimated remaining effort`, `next safe action`) without leading with command strings. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:165]
4. Phase `002` should treat `HS-02` and `HS-05` as the stronger handover templates and reduce reliance on `HS-04`-style command-first phrasing. The existing phase spec says not to reclassify correct drop prototypes, and that aligns with the evidence: the cleaner fix is to make handover prototypes more state-centric, not to weaken the drop prototypes that already capture wrappers and telemetry well. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/002-fix-handover-drop-confusion/spec.md:15] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:91]

## Ruled Out
- Rewriting the drop corpus as the main fix for handover/drop confusion.

## Dead Ends
- Treating command-first handover prose as harmless prototype decoration.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:83`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:91`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:165`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/002-fix-handover-drop-confusion/spec.md:15`

## Assessment
- New information ratio: 0.63
- Questions addressed: RQ-8, RQ-10
- Questions answered: none

## Reflection
- What worked and why: Prototype nearest-neighbor checks exposed a corpus-shape problem that the regex audit alone could not prove.
- What did not work and why: Prototype labels such as "handover" or "drop" were not meaningful enough by themselves; the actual chunk text carried the overlap.
- What I would do differently: Keep one explicit "state-first" prototype exemplar per fragile category to anchor future regression tests.

## Recommended Next Focus
Trace the Tier3 contract from the router into the save handler and determine exactly what code is missing to make the LLM path real in production.
