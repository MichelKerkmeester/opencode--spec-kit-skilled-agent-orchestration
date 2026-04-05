# Research Iteration 118: Fix Options Matrix for the OpenCode Plugin

## Focus

Evaluate the practical fix options for packet 030, ordered by confidence and blast radius.

## Option Matrix

### Option A — Disable `messages.transform`, keep `system.transform` + `session.compacting`
- **Confidence:** High
- **Risk:** Low
- **Expected effect:** Strong chance of removing the invalid-prompt error quickly
- **Tradeoff:** loses per-turn retrieved-context injection
- **Why it is attractive:** both surviving surfaces only append strings, which are much less likely to violate `ModelMessage[]`. [SOURCE: `.opencode/plugins/spec-kit-compact-code-graph.js:303-374`]

### Option B — Keep `messages.transform`, but only mutate existing host-owned parts
- **Confidence:** Medium
- **Risk:** Medium
- **Expected effect:** may preserve current-turn enrichment with lower schema risk
- **Tradeoff:** depends on finding a stable target part shape in all relevant conversations
- **Reference pattern:** archived working-memory plugin mutates existing tool-part state, not synthetic part insertion. [SOURCE: `z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/index.ts:1657-1693`]

### Option C — Reintroduce synthetic parts only through a schema-aware SDK path
- **Confidence:** Medium-Low
- **Risk:** Medium-High
- **Expected effect:** closest parity with `opencode-lcm`
- **Tradeoff:** requires a runtime-safe way to align with `@opencode-ai/sdk Part` shape
- **Reference pattern:** `opencode-lcm` centralizes mutation in a `Part[]`-typed store path. [SOURCE: `030-opencode-graph-plugin/external/opencode-lcm-master/src/store.ts:2901-2922`]

### Option D — Move bounded retrieved context into `system.transform` only
- **Confidence:** Medium
- **Risk:** Low-Medium
- **Expected effect:** keeps context injection, but at startup/system level only
- **Tradeoff:** weaker turn-specific targeting and higher risk of system-prompt bloat
- **Reference:** current startup digest already uses the safe string surface. [SOURCE: `.opencode/plugins/spec-kit-compact-code-graph.js:303-324`]

## Recommendation

Option A is the best immediate corrective move for packet 030. It is the cleanest proving step and the best way to separate "transport works" from "message mutation breaks prompt assembly." If packet 030 later needs richer turn-time injection, evaluate Option B before Option C.

## Ruled Out Directions

- Jumping straight to a complex SDK-alignment refactor before proving the local fault
- Leaving the current `messages.transform` in place while only adding more diagnostics
