# Iteration 002 - Security

## Scope

Same three production/test files as iteration 001. This pass focused on untrusted classifier output and target routing safety.

## Verification

- Git log checked for the scoped files.
- Scoped Vitest command: PASS, 30 tests.

## Findings

### F-002 - P1 Security - Tier 3 target_doc and target_anchor are trusted without a whitelist or traversal guard

Tier 3 responses are normalized only by type. `validateTier3Response` copies arbitrary strings into `target_doc` and `target_anchor` at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:859` and `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:860`.

If confidence clears the floor, `makeDecisionFromTier3` uses those strings directly as the final routing target at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:687` and `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:688`.

Behavior probe with an injected Tier 3 classifier:

```json
{"category":"narrative_progress","target":{"docPath":"../../outside.md","anchorId":"../bad-anchor","mergeMode":"append-as-paragraph"},"tierUsed":3,"refusal":false}
```

That violates the prompt contract's "Never invent a new doc or anchor" instruction at runtime. A model, test double, or future external classifier can route outside the canonical target set unless downstream writers independently block it.

## Delta

New finding: F-002.
