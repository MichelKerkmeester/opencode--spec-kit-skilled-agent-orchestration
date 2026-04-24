## Iteration 08

### Focus

This round checked the surrounding docs and runtime ergonomics surfaces to see whether they reinforce the same text-only and loosely bounded contracts the code currently implements. The aim was to decide whether the remaining gaps are purely internal or already visible to operators and maintainers.

### Context Consumed

- `iterations/iteration-07.md`
- `.opencode/skill/system-spec-kit/references/config/hook_system.md`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/codex-session-start-hook.vitest.ts`

### Findings

- The hook system reference still describes SessionStart as a cross-runtime shared capability, but the runtime matrix and fallback prose do not describe any structured startup graph payload contract, which leaves the builder's `sharedPayload` path undocumented at the transport layer [.opencode/skill/system-spec-kit/references/config/hook_system.md:35-45,64-78].
- The Codex runtime README smoke check only asserts that stdout contains non-empty `hookSpecificOutput.additionalContext` with `Session Context`, reinforcing a text-only validation target for startup behavior [.opencode/skill/system-spec-kit/mcp_server/hooks/codex/README.md:27-35].
- Copilot's custom-instructions writer accepts only `startupSurface` and `advisorBrief` strings, so even if the builder emitted structured startup context, the current Copilot transport intentionally drops it at the writer boundary [.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts:15-20,61-87].

### Evidence

```md
3. **SessionStart** — Fires on session start. Routes by source:
  - `compact`: Reads cached PreCompact payload, injects via stdout
  - `startup`: Primes with Spec Kit Memory overview
  - `resume`: Loads prior session state
```

```md
Expected stdout contains non-empty `hookSpecificOutput.additionalContext`
including `Session Context`.
```

```ts
export interface CopilotCustomInstructionsContext {
  readonly startupSurface?: string | null;
  readonly advisorBrief?: string | null;
  readonly generatedAt?: string;
}
```

### Negative Knowledge

- This is not a contradiction where docs claim structured startup payloads already work; rather, the docs simply never describe that builder-level structure as a runtime contract.
- Copilot's text-only writer is not a hidden regression; it is the documented implementation choice, which means structured payload transport would require deliberate redesign there.
- The docs/runtime drift here reinforces the transport gap rather than creating an independent correctness defect.

### New Questions

- `Cross-Runtime` — Should the documentation elevate structured startup payloads into the runtime contract, or explicitly retire them from the builder surface?
- `Ergonomics` — For Copilot, is a text-only summary sufficient, or should a structured sidecar file exist alongside the managed instruction block?
- `Verification` — Which smoke checks should move beyond "contains Session Context" to guard graph trust metadata?

### Status

`converging`
