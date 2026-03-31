# Iteration 017: D4 Maintainability Re-verification

## Focus

Re-verify maintainability findings `F014` through `F019` against the current code-graph helpers, structural indexer defaults, token-count synchronization path, and manual recovery documentation surfaces.

## Scope

- Reviewed review state: `deep-research-config.json`, `deep-research-state.jsonl`, `deep-review-strategy.md`
- Reviewed target files:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts`
  - `CLAUDE.md`
  - `.claude/CLAUDE.md`
- Spot-checked adjacent runtime consumers and evidence:
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/hooks-ux-feedback.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts`

## Scorecard

- Verdict: `CONDITIONAL`
- Re-verified findings: 6
- Status changes: 1 (`F018` narrowed)
- New findings: 0
- Confidence: High

## Re-verification Matrix

### F014 - CONFIRMED

- **Finding:** `seed-resolver.ts` still converts graph-DB failures into low-confidence placeholder anchors instead of surfacing an infrastructure error.
- **Evidence:** `resolveManualSeed()` and `resolveGraphSeed()` still catch DB access failures and fall through to `file_anchor` placeholders.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:83-128][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:131-165] `resolveSeed()` does the same for the generic file/line path, using the same `file_anchor` resolution both for legitimate no-match cases and DB-unavailable cases.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:168-239] `buildContext()` still accepts those anchors as ordinary resolved input and degrades into file-outline behavior instead of surfacing resolver failure to the caller.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:51-63][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:80-89]
- **Assessment:** The current code still makes "graph DB unavailable" operationally indistinguishable from "seed did not resolve to a symbol", so debugging and downstream maintenance cost remain unchanged.
- **Severity:** P2 unchanged

### F015 - CONFIRMED

- **Finding:** `structural-indexer.ts` still carries a dead per-file `TESTED_BY` branch even though the actual cross-file heuristic lives later in `indexFiles()`.
- **Evidence:** `extractEdges()` still tries to derive `TESTED_BY` edges by grouping only the current file's nodes and looking for a sibling tested module path inside that same per-file node map.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:315-340] `indexFiles()` still performs the real cross-file pass afterwards by correlating results across the entire indexed file set and appending `TESTED_BY` edges there.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:428-470]
- **Assessment:** The duplicate ownership point remains. Future maintainers still have to reason about two `TESTED_BY` implementations even though only the later cross-file pass is meaningfully effective for normal test/module pairs.
- **Severity:** P2 unchanged

### F016 - CONFIRMED

- **Finding:** `excludeGlobs` is still exposed as a scan option but never consulted by the structural walker.
- **Evidence:** `handleCodeGraphScan()` still merges caller-provided `excludeGlobs` into the config before calling `indexFiles(config)`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:35-39] `findFiles()` still receives an `excludeGlobs` parameter, but the recursive walker never checks it; it only hard-codes directory skips for `node_modules`, `dist`, and `.git` plus extension and size filtering.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:393-424] `indexFiles()` still passes `config.excludeGlobs` into that unused parameter path.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:432-435]
- **Assessment:** The public contract still advertises exclusion control that the implementation does not honor, so follow-on maintenance still has to reconcile a dead option surface with the actual walker behavior.
- **Severity:** P2 unchanged

### F017 - CONFIRMED

- **Finding:** `indexer-types.ts` still claims `.zsh` support while the default include globs never discover `.zsh` files.
- **Evidence:** `detectLanguage()` still maps `.zsh` to `bash`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:80-95] `getDefaultConfig()` still seeds discovery with `**/*.ts`, `**/*.js`, `**/*.mjs`, `**/*.py`, and `**/*.sh`, with no `**/*.zsh` include pattern.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:97-105]
- **Assessment:** The default configuration still overclaims shipped language discovery, so the maintainability cost remains: language support and file discovery continue to drift apart unless callers know to override the defaults manually.
- **Severity:** P2 unchanged

### F018 - CHANGED

- **Finding:** Recovery guidance still lacks one clear canonical owner, but the drift is narrower than iteration 010 described.
- **Evidence:** The root guide currently presents a generic resume workflow that advertises `/spec_kit:resume` or a direct `memory_context(...)` call as parallel entry points.[SOURCE: CLAUDE.md:48-51] The Claude-specific guide still gives hook-aware manual recovery steps for post-compaction and `/clear`, both of which route first to `memory_context(...)` and then back to the root guide.[SOURCE: .claude/CLAUDE.md:5-18] The live SessionStart hook still reinforces the Claude-specific path: compact fallback, startup priming, and resume messaging all point users to `memory_context(...)`, not `/spec_kit:resume`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:40-61][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:88-99][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:140-152]
- **Assessment:** This is no longer best described as two fully separate hook-aware recovery playbooks. The remaining issue is duplicated authority: the root guide still exposes a generic dual-entry recovery surface while the Claude-specific guide and SessionStart runtime funnel users toward `memory_context(...)`. Future recovery changes still require synchronized edits across overlapping docs, but the contradiction is narrower than the original wording suggested.
- **Severity:** P2 unchanged

### F019 - CONFIRMED

- **Finding:** `hooks/response-hints.ts` and `lib/response/envelope.ts` still duplicate token-count synchronization logic.
- **Evidence:** `context-server.ts` still imports `syncEnvelopeTokenCount()` and `serializeEnvelopeWithTokenCount()` from the hook-layer barrel and uses that path for final envelope mutation after auto-surface hints and token-budget enforcement.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:397-433] `response-hints.ts` still owns its own convergence loop and serializer with a five-attempt cap.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:30-57] The shared envelope layer still owns a second convergence loop with a three-attempt cap and uses it during initial envelope creation.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:99-119][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:148-179] The two paths also retain separate regression contracts in the hook UX tests and envelope tests.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hooks-ux-feedback.vitest.ts:63-97][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:251-300]
- **Assessment:** The duplication remains active, and the two convergence loops have already drifted in operational detail (five iterations versus three). Even though both paths now rely on the same shared char/4 estimator, token-count ownership is still split across two maintenance surfaces.
- **Severity:** P2 unchanged

## New Maintainability Issues

No additional D4 maintainability findings were confirmed in this pass.

## Verified Healthy Deltas

- Both token-count paths now rely on the same shared `estimateTokenCount()` implementation, so the remaining risk is duplicate synchronization ownership rather than conflicting token math.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/formatters/token-metrics.ts:34-36][SOURCE: .opencode/skill/system-spec-kit/shared/utils/token-estimate.ts:9-14]
- The root guide no longer restates a dedicated post-compaction hook sequence in the reviewed section; that is why `F018` narrows from "divergent recovery playbooks" to the smaller problem of overlapping manual-recovery authority.[SOURCE: CLAUDE.md:48-51][SOURCE: .claude/CLAUDE.md:5-18]

## Summary

- `F014`, `F015`, `F016`, `F017`, and `F019` remain confirmed with no severity change.
- `F018` stays open, but its current shape is narrower: duplicated authority around recovery entry points, not a wholly separate hook-specific contract.
- No new D4 findings were added in this pass, so the maintainability verdict remains `CONDITIONAL`.
