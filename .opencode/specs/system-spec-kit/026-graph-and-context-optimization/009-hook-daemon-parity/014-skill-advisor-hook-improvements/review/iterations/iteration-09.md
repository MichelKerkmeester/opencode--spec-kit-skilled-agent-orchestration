## Iteration 09

### Focus
Privacy and prompt-safety stabilization pass across hook output, diagnostics, and wrapper surfaces.

### Files Audited
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts:55-70`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:134-187`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:111-113`
- `.opencode/skill/system-spec-kit/mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts:80-84`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-privacy.vitest.ts:88-110`

### Findings

### Evidence
```ts
// render.ts
if (!singleLine || INSTRUCTION_LABEL_PATTERN.test(singleLine)) {
  return null;
}
```

```ts
// metrics.ts
const FORBIDDEN_DIAGNOSTIC_FIELDS = new Set([
  'prompt',
  'promptFingerprint',
  'promptExcerpt',
  'stdout',
  'stderr',
]);
```

Negative knowledge:
- This pass did not uncover a new prompt-text leak beyond the telemetry corruption issue already logged in iteration 06.
- Sanitization and prompt-safe diagnostics remain consistent across the inspected privacy surfaces.

### Recommended Fix
- No new fix from this pass.

### Status
converging
