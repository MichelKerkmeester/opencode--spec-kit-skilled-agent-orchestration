# Fix Report F13 (search files A-F partition)

## Scope
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/context-budget.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/encoding-intent.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts`

## Applied fixes
1. **Catch typing / narrowing rule**
   - Updated bare catch blocks to typed unknown catches:
     - `auto-promotion.ts`: `catch {}` -> `catch (_error: unknown) {}`
     - `folder-discovery.ts`: all bare `catch {}` blocks changed to `catch (_error: unknown) {}` (including nested catch block with `_nestedError`).
   - Existing catches already using `catch (error: unknown)` with `instanceof Error` narrowing were left unchanged.

2. **Missing exported return types**
   - Reviewed exported functions across all scoped files.
   - No missing explicit return type annotations were found that required modification.

## Validation
- Baseline typecheck (before edits) was already failing in test code unrelated to this change:
  - `mcp_server/tests/folder-discovery-integration.vitest.ts:661` (`TS2345`)
- Changes are type-only and logic-preserving; no logic/import/export behavior was altered.
