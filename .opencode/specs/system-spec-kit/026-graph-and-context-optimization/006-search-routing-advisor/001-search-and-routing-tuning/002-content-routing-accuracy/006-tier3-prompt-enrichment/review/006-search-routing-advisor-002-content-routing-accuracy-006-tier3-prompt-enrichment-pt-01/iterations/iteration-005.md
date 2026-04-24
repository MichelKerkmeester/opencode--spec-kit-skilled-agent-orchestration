# Iteration 005: Correctness re-check of metadata_only targeting

## Focus
Correctness re-review of `metadata_only` targeting across the prompt, router classification contract, and save-handler host resolution.

## Files Reviewed
- `spec.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`

## Findings
### P1 - Required
- **F006**: The packet closes `metadata_only -> implementation-summary.md` only after handler resolution, not at the router contract layer itself — `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:197` — The prompt and packet describe `implementation-summary.md` as the canonical target, but the router still emits the abstract `spec-frontmatter` doc path and the tests pin that alias, so the packet's closure depends on downstream translation in `memory-save.ts`. Supporting evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:663`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1144`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1157`, `spec.md:23`, `spec.md:25`.

### P2 - Suggestion
None.

## Ruled Out
- `spec-frontmatter` is not a broken path by itself; the save handler correctly resolves it to `implementation-summary.md` when that file exists and to `spec.md` otherwise.

## Dead Ends
- Treating the alias split as a save-path bug did not hold up once `resolveMetadataHostDocPath()` was inspected.

## Recommended Next Focus
Run a security stability pass to confirm the advisory disclosure finding stays low-risk and does not escalate once the full refusal path is considered.

## Assessment
- Dimensions addressed: correctness
- New findings ratio: 0.14
- Convergence: Continue. No blocker appeared, but the packet still carries unresolved P1 drift at the public contract layer.
