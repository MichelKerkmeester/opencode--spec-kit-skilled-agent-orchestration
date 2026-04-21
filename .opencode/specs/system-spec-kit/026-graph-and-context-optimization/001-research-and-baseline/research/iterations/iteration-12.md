# Iteration 12 — Per-iter report

## Method
- Adversarial stress-test of all 3 combos
- New external reads: `18`

## Survival summary
| Combo | Verdict | Top failure mode |
|---|---|---|
| 1 | weakened | Warm-start summary drops too much session state, so graph-first routing can start from the wrong premise. |
| 2 | survives | The ledger still looks precise when unknown models and some token classes are filled by defaults or heuristics. |
| 3 | falsified | The combo collapses incompatible confidence semantics and already overlabels regex-heavy Go extraction as `ast`. |

## Surprises
- Combo 1 did not fail on topology; it failed on summary fidelity and freshness coherence between startup state and the live graph. [SOURCE: 005-claudest/external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/summarizer.py:251-274] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:539-543]
- Combo 2 was more durable than expected because its parts still compose cleanly if they are framed as governance rails, not as immediate ledger truth. [SOURCE: research/iterations/q-f-killer-combos.md:35-41]
- Combo 3 broke faster than iter-7 implied because the two confidence systems do not mean the same thing even before packaging. [SOURCE: 002-codesight/external/src/types.ts:54-65] [SOURCE: 004-graphify/external/graphify/validate.py:4-7]
- Public's current Q-A blockers remain load-bearing in a destructive pass: estimate-based token counts, opt-in telemetry, and thin consumption rows all limit what can be honestly published. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:116-138] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:271-274] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:26-37]

## Handoff to iter-13
- iter-13 will deep-inventory Public's existing infrastructure.
- The hidden prerequisites from this pass should drive that inventory: summary-fidelity guarantees, graph freshness at startup, provider-counted token availability, telemetry contract completeness, and any schema split needed between detection provenance, evidence confidence, and artifact freshness.
