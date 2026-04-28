# Iteration 1 — Correctness + Inventory

## Dimension

D1 Correctness, with the required inventory pass.

## Files Reviewed

Reviewed 24 files directly and checked the full 35-path scope inventory for existence.

- Spec/state docs: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `decision-record.md`, `deep-review-strategy.md`, `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`.
- Runtime focus: `handlers/save/pe-orchestration.ts`, `handlers/memory-index.ts`, `handlers/memory-save.ts`, `lib/utils/index-scope.ts`, `lib/search/vector-index-mutations.ts`, `lib/storage/checkpoints.ts`, `handlers/memory-index-discovery.ts`, `lib/parsing/memory-parser.ts`, `lib/config/spec-doc-paths.ts`.
- Tests: `tests/pe-orchestration.vitest.ts`, `tests/handler-memory-index.vitest.ts`, `tests/index-scope.vitest.ts`, `tests/memory-save-index-scope.vitest.ts`, `tests/memory-crud-update-constitutional-guard.vitest.ts`, `tests/checkpoint-restore-invariant-enforcement.vitest.ts`, `tests/exclusion-ssot-unification.vitest.ts`, `tests/symlink-realpath-hardening.vitest.ts`.

## Findings — P0 (Blockers)

None.

## Findings — P1 (Required)

### P1-001 — Constitutional README can survive storage-layer restore/update as constitutional

The parser and discovery code treat `constitutional/README.md` as non-indexable, but the shared storage predicates do not encode that edge. `isConstitutionalPath()` only checks for a `constitutional` segment, and `EXCLUDED_FOR_MEMORY` does not exclude README files. Storage-layer mutation paths then trust that broad predicate: checkpoint restore accepts any path passing `shouldIndexForMemory()` and preserves `importance_tier='constitutional'` whenever `isConstitutionalPath()` is true; SQL update uses the same broad path test before deciding whether to downgrade.

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:25` excludes `z_future`, `external`, and `z_archive`, but not constitutional README paths.
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:50` implements `isConstitutionalPath()` as a segment-only check.
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:967` shows intended behavior by requiring constitutional markdown files to have `basename !== 'readme.md'`.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:223` applies the same README exclusion during constitutional file discovery.
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1313` rejects only `shouldIndexForMemory()` failures, then `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1335` downgrades only when `!isConstitutionalPath(resolvedPath)`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:449` uses `canonical_file_path || file_path` with `!isConstitutionalPath(guardPath)` as the downgrade gate.

Impact: a poisoned checkpoint or existing DB row at `.../.opencode/skill/<skill>/constitutional/README.md` can remain indexed as constitutional even though normal parser/discovery entry points exclude that file. This breaks the documented constitutional README invariant at the storage boundary.

Fix: move the README distinction into the shared SSOT, for example `isIndexableConstitutionalMemoryPath()`, and use it in parser, discovery, checkpoint restore, SQL update guards, and save-time tier validation. Add regressions for checkpoint restore and `memory_update` with `constitutional/README.md` fixtures.

## Findings — P2 (Suggestions)

### P2-001 — Review strategy artifact map has stale runtime paths

The strategy lists three runtime paths that do not exist at those locations:

- `mcp_server/code-graph/lib/structural-indexer.ts`
- `mcp_server/code-graph/lib/indexer-types.ts`
- `mcp_server/handlers/memory-parser.ts`

The live files are under `mcp_server/code_graph/lib/...` and `mcp_server/lib/parsing/memory-parser.ts`. Evidence: `deep-review-strategy.md:147`, `deep-review-strategy.md:148`, and `deep-review-strategy.md:150`.

### P2-002 — Checklist evidence is not resolvable as file:line citations

Inventory check found 62 `CHK-*` items in `checklist.md` and zero file-line citations in the requested resolvable form. The checklist mostly cites files, commands, or sections narratively, for example `checklist.md:63` and `checklist.md:80`, so a replay tool cannot validate the evidence map without manual interpretation.

Fix: add at least one concrete `path:line` citation to each completed `CHK-*` item, or add a machine-readable evidence table that maps each `CHK-*` to concrete file-line anchors.

## Traceability Checks

| Check | Result | Notes |
| --- | --- | --- |
| Scope file existence | fail | 32/35 prompt-listed paths resolved exactly; three stale strategy paths use `code-graph` or `handlers/memory-parser.ts` instead of live paths. |
| Checklist evidence replay | fail | 62/62 `CHK-*` items lack concrete `file:line` evidence. |
| ADR implementation mapping | pass | ADR-001 through ADR-012 have corresponding implementation surfaces in reviewed files. |
| A2 PE downgrade | pass | `UPDATE` and `REINFORCE` post-filter to `CREATE` on canonical-path mismatch; null `canonical_file_path` falls back to `file_path`. |
| B2 `fromScan` propagation | pass | `memory_index_scan` sets `fromScan: true`; direct `indexSingleFile()` omits it; `memory-save` resolves omitted origin to `direct`. |
| SSOT predicate edge cases | fail | `external`, `z_archive`, `z_future`, trailing segment boundaries are covered; constitutional README is not encoded in the shared predicate. |
| SQL-layer downgrade arithmetic | pass | Tier change, audit attempt, embedding/vector status, projection refresh, and cache invalidation run inside `update_memory_tx`. |
| Checkpoint atomic restore | partial | Excluded rows are validated before clear/insert inside the restore transaction, but the constitutional README predicate gap remains. |
| Focused regression coverage | partial | A2 and B2 are well-covered; storage-layer README poisoning is not covered. |

## Claim Adjudication Packets

### P1-001

```json
{
  "claim": "Constitutional README can survive storage-layer checkpoint restore or SQL update as a constitutional memory even though parser/discovery exclude README files.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:25",
    ".opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:50",
    ".opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:967",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:223",
    ".opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1313",
    ".opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1335",
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:449"
  ],
  "counterevidenceSought": "Looked for README-specific exclusion in index-scope.ts, checkpoint restore validation, vector-index update guard, and focused tests. Parser/discovery have the exclusion, but storage-layer guards and tests do not.",
  "alternativeExplanation": "The team may intentionally rely on parser/discovery to prevent README rows. That does not cover restore/update paths, which operate on already-materialized database/checkpoint rows.",
  "finalSeverity": "P1",
  "confidence": 0.86,
  "downgradeTrigger": "Downgrade to P2 if checkpoint restore and memory_update are explicitly declared out-of-scope for constitutional README invariants, or if an unseen DB constraint rejects those rows before these functions run."
}
```

## Verdict

CONDITIONAL for D1. No P0 found. A2, B2, SQL update transaction shape, and restore rollback mechanics look directionally correct. One required correctness fix remains around constitutional README invariants at storage-layer mutation boundaries, plus two inventory cleanup items.

## Next Dimension

D2 Security. Prioritize symlink/realpath bypasses, cleanup CLI transaction safety and audit durability, walker DoS caps under adversarial trees, and tier-promotion paths that can bypass governed ingestion.
