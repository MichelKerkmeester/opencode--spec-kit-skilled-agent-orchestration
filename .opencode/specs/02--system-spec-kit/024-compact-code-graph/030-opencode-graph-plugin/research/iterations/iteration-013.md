# Research Iteration 013: OpenCode Adapter Boundary Refinement

## Focus

Use `opencode-lcm` to sharpen the architecture boundary for a future OpenCode adapter plugin: what belongs in the adapter versus what should stay in the current memory/code-graph runtime.

## Findings

### The Adapter Should Be A Transport Facade Only

In `opencode-lcm`, the plugin layer mostly wires lifecycle hooks and tools to store-owned methods, while:

- retrieval policy
- compaction-note building
- archive operations
- status/repair/export logic

live below the plugin. [SOURCE: `external/opencode-lcm-master/src/index.ts:8-18`] [SOURCE: `external/opencode-lcm-master/src/index.ts:19-309`] [SOURCE: `external/opencode-lcm-master/src/index.ts:311-326`]

That suggests our adapter should call runtime-owned composers instead of embedding retrieval logic.

### Retrieval Policy Belongs In The Runtime

`opencode-lcm` keeps scope order, quotas, stop rules, filtering, and query construction in the store/options layer. [SOURCE: `external/opencode-lcm-master/src/store.ts:2937-3162`]

We should keep:

- ranking
- budgeting
- provenance
- graph/memory blending

inside the runtime, and let the adapter pass turn descriptors plus budgets.

### The Adapter Contract Should Be Additive And Idempotent

The plugin preserves the base prompt and appends compact context only when needed. [SOURCE: `external/opencode-lcm-master/tests/options-plugin.test.mjs:102-175`]

That gives a better boundary than "plugin owns recovery":

- adapter injects typed blocks
- adapter dedupes repeated blocks
- adapter does not become a second recovery authority

### Operational Tools Should Stay In The Runtime

Our runtime already organizes lifecycle and graph operations into coherent tool families. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:45-84`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:17-85`]

So a future adapter should not clone:

- `status`
- `doctor`
- `snapshot`
- graph query tools

into plugin-local tools.

### Binding-Based Core Modules Are A Better Port Than Feature Copying

`opencode-lcm` snapshot logic is written against explicit bindings rather than hardwiring everything inside the plugin. [SOURCE: `external/opencode-lcm-master/src/store-snapshot.ts:121-146`] [SOURCE: `external/opencode-lcm-master/src/store-snapshot.ts:148-218`]

That is the stronger porting lesson for future graph doctor/export/import work.

## Recommendations

1. Put hook registration, request shaping, injection, provenance tags, and dedupe in the adapter.
2. Keep retrieval policy, composition, diagnostics, and export/import in the runtime.
3. Introduce one adapter-facing runtime contract like `composeOpenCodeContext(turn, budget, mode)`.
4. Reuse a binding-based module pattern for future graph ops rather than plugin-local feature copies.

## Duplication Check

This is new relative to earlier packet research because it refines the contract:

- adapter = lifecycle marshalling + additive injection only
- runtime = retrieval policy + composition + diagnostics/ops
- future graph ops should borrow the binding-based module pattern, not just the plugin feature list
