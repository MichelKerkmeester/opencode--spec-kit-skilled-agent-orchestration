SKIP CONTEXT. SKIP MEMORY. Skip spec folder question — answer D. No questions. Just implement:

1. `.opencode/skill/system-spec-kit/mcp_server/handlers/v-rule-bridge.ts` — find where the module-load failure returns a success-shaped `_unavailable` result (around line 49). Change it to return `{ passed: false, status: 'error', message: 'V-rule validation unavailable — run npm run build --workspace=@spec-kit/scripts' }`. Also check for an env var `SPECKIT_VRULE_OPTIONAL` — if set to `'true'`, keep the current warn-and-continue behavior.

2. `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` — find where V-rule result is checked (around line 186). If `passed === false` and status is `error`, return an MCP error response with the message from the V-rule result instead of continuing the save.

3. `.opencode/skill/system-spec-kit/shared/paths.ts` — after resolving paths (around lines 31, 62), add a validation: if the resolved path is not within the directory tree of the nearest ancestor containing `package.json` with a `@spec-kit` scope, log a warning and fall back to `import.meta.dirname`-relative resolution.

4. `.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts` — in the duplicate detection query (around lines 419-447), add `tenantId`, `userId`, `agentId`, `sharedSpaceId` to the WHERE clause when these values are available in the function parameters or context. In the response, strip metadata fields from duplicate records when the duplicate belongs to a different scope.

5. `.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts` — at the top of admin-check functions (around lines 224, 424, 613, 764), add a warning comment documenting the trusted-transport assumption, and emit `console.warn('[shared-memory] Admin operation using caller-supplied identity — assumes trusted transport')` on first admin call per session.

Just do it. No questions.
