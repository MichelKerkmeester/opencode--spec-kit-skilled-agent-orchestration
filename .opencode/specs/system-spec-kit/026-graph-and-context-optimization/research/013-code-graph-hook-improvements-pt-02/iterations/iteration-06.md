## Iteration 06

### Focus

This round traced the startup graph payload from the builder into runtime adapters and tests. The question was whether the structured startup payload survives transport or whether only the text rendering is currently real.

### Context Consumed

- `iterations/iteration-05.md`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/codex-session-start-hook.vitest.ts`

### Findings

- `buildStartupBrief()` still creates a structured `sharedPayload` with `kind`, `sections`, and provenance metadata including `trustState`, `generatedAt`, `lastUpdated`, and `sourceRefs` [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts:230-245].
- The Claude, Gemini, Copilot, and Codex startup adapters consume only `startupSurface`, `graphOutline`, and optional `sessionContinuity`; none forwards `sharedPayload` or any compact structured derivative into runtime-visible output [.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:235-285; .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:170-219; .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:171-219; .opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts:155-176].
- Builder-level tests assert `sharedPayload` exists, but adapter-level tests assert only textual sections or `additionalContext`, so the structured transport path can regress without tripping runtime hook coverage [.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:64-81; .opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:257-268; .opencode/skill/system-spec-kit/mcp_server/tests/codex-session-start-hook.vitest.ts:46-68].

### Evidence

```ts
createSharedPayloadEnvelope({
  kind: 'startup',
  sections,
  provenance: { producer: 'startup_brief' },
});
```

```ts
const startupSurface = startupBrief?.startupSurface
  ? rewriteStartupMemoryLine(startupBrief.startupSurface, Boolean(sessionContinuity), rejectionReason)
  : buildFallbackStartupSurface(Boolean(sessionContinuity), rejectionReason);
const sections: OutputSection[] = [
  { title: 'Session Context', content: startupSurface },
```

```ts
expect(brief.sharedPayload?.kind).toBe('startup');
expect(brief.sharedPayload?.provenance.producer).toBe('startup_brief');
expect(output).toEqual({
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
```

### Negative Knowledge

- The builder itself is not the failing component here; it already constructs the structured payload and builder tests prove that much.
- This is not limited to one runtime adapter. The same text-only pattern appears across Claude, Gemini, Copilot, and Codex.
- The gap is not purely theoretical because the test harness also encodes the text-only expectation, which makes the builder's structured path easy to forget or delete.

### New Questions

- `Cross-Runtime` — Should runtime adapters forward `sharedPayload` directly, or should the builder emit a smaller transport-safe derivative?
- `Verification` — Which adapter tests should assert a machine-readable contract so builder/runtime drift cannot recur?
- `Design` — If startup is intentionally text-only, should `sharedPayload` be removed from the builder to avoid a ghost contract?

### Status

`converging`
