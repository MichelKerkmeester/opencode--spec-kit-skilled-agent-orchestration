# Focus

Resolve the `save_lineage` runtime/persist mismatch from the built layer actually used by `codex exec`, classify the live 026 packet roots `007` through `010`, and turn iteration 4's validator draft into implementation-ready rules with grandfathering and blast-radius estimates.

# Actions

1. Read the built workflow caller in `.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:1163-1167`.
2. Re-read the source parser/schema in:
   - `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1060-1075`
   - `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1175-1182`
   - `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:11-13`
   - `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:36-47`
3. Read the built parser/schema in:
   - `.opencode/skill/system-spec-kit/mcp_server/dist/lib/graph/graph-metadata-parser.js:848-860`
   - `.opencode/skill/system-spec-kit/mcp_server/dist/lib/graph/graph-metadata-parser.js:936-960`
   - `.opencode/skill/system-spec-kit/mcp_server/dist/lib/graph/graph-metadata-schema.js:27-39`
4. Read the 026 parent phase map in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md:112-145` and its packet-root contract in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md:131-132,217`.
5. Inspected packet-root contents plus `description.json` for:
   - `007-release-alignment-revisits`
   - `008-cleanup-and-audit`
   - `009-playbook-and-remediation`
   - `010-search-and-routing-tuning`
6. Re-ran a narrow 026 inventory script to estimate current validator blast radius for the five proposed assertions.

# save_lineage Root Cause

## Conclusion

`save_lineage` is not being coerced to `null` by Zod. The live problem is a **built-dist/runtime mismatch**:

- The built workflow caller does not pass any lineage/options object at all:
  - `.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:1163-1167`
  - It imports `refreshGraphMetadata` and calls `refreshGraphMetadata(validatedSpecFolderPath)` with only the folder path.
- The built graph parser also no longer serializes `save_lineage` into `derived`:
  - `.opencode/skill/system-spec-kit/mcp_server/dist/lib/graph/graph-metadata-parser.js:848-860`
  - `derived` includes `trigger_phrases`, `key_topics`, `importance_tier`, `status`, `key_files`, `entities`, `causal_summary`, `created_at`, `last_save_at`, `last_accessed_at`, and `source_docs`, but no `save_lineage`.
- The built graph schema omits the field entirely:
  - `.opencode/skill/system-spec-kit/mcp_server/dist/lib/graph/graph-metadata-schema.js:27-39`
  - `graphMetadataDerivedSchema` has `last_save_at`, then jumps directly to `last_accessed_at` and `source_docs`; there is no `save_lineage` member.

## Why the source read looked correct in iteration 4

The source TypeScript still expresses the intended invariant:

- Allowed values include `same_pass`:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:11-13`
- The source schema explicitly allows the field:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:36-47`
  - Exact Zod definition: `save_lineage: z.enum(SAVE_LINEAGE_VALUES).optional(),`
- The source parser explicitly writes it:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1060-1075`
  - Exact assignment: `save_lineage: options.saveLineage,`
- The source refresh path still defaults missing options to `graph_only`:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1175-1180`

## Answer to the schema question

No. The schema is **not** the culprit in source, and it does **not** coerce `'same_pass'` to `null`.

- Source behavior: accepts `'same_pass'`.
- Built behavior: the field is absent from the compiled schema and absent from the compiled serializer, so the runtime cannot preserve it from that path.

## Best root-cause statement

The runtime bundle used by `codex exec` is stale/incomplete relative to source:

1. built workflow caller drops the second argument,
2. built parser does not serialize `save_lineage`,
3. built schema does not define `save_lineage`.

That is enough to classify the issue as a **P0 shipped dist parity bug**, not a source-only bug and not a Zod-null-default bug.

## Remaining nuance: `null` vs omitted

This iteration explains why fresh built-path writes cannot persist `same_pass`, but it does not fully prove why observed files are still `null` instead of simply missing the field. The most likely explanation is mixed historical write paths during the rollout window. What is now clear is that the currently shipped built path cannot write a non-null lineage value.

# 008/009 Disposition

## Per-packet evidence

| Packet | Parent phase map status | Root docs present? | `description.json.type` | `git log -- <packet>/spec.md` | Disposition |
|--------|--------------------------|--------------------|-------------------------|-------------------------------|-------------|
| `007-release-alignment-revisits` | Active child, marked Complete in parent map | No `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, or `implementation-summary.md` | `coordination-parent` | empty | Active coordination-parent shell missing canonical root docs |
| `008-cleanup-and-audit` | Active child, marked Complete in parent map | No root canonical docs | `coordination-parent` | empty | Same bucket as 007 |
| `009-playbook-and-remediation` | Active child, marked Complete in parent map | No root canonical docs | `coordination-parent` | empty | Same bucket as 007 |
| `010-search-and-routing-tuning` | Active child, marked Complete in parent map | No root canonical docs | `coordination-parent` | empty | Same bucket as 007 |

## Decision

`007`, `008`, `009`, and `010` are in the **same P0 bucket**.

They are **not** best explained as archived packets:

- the 026 root spec still lists them as active live children (`spec.md:112-145`),
- their `description.json` files were refreshed on `2026-04-17`,
- each root is explicitly typed as a live `coordination-parent`.

They are also **not** best explained as "spec.md accidentally deleted":

- `git log -- <packet>/spec.md` is empty for all four roots,
- which strongly suggests they never had a root `spec.md` tracked in git.

They are also **not** legitimate under the current 026 contract:

- the parent spec explicitly says local directories do not become packet phases unless they contain a valid root `spec.md` (`spec.md:131-132`),
- the risks section repeats that folders without a root `spec.md` should not be treated as live phases (`spec.md:217`).

## Remediation category

The right classification is:

**Active coordination-parent packet roots that were promoted without canonical root docs.**

That means the remediation is the same for all four roots:

1. Either add minimal root packet docs so they become valid live packet roots.
2. Or formally demote them from live-packet status by removing them from the active phase map and treating only the numbered child folders as canonical.

Based on the current 026 phase map and the fact that all four roots still act as coordination parents, the stronger recommendation is **repair, not archive**.

# Validator Implementation Points

## Validator surface note

The exact `scripts/spec/rules/` folder does not exist in the current tree. The closest existing rule surfaces are:

- `.opencode/skill/system-spec-kit/scripts/validation/continuity-freshness.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts`

So the paths below should be read as **proposed new rule modules** under the requested `scripts/spec/rules/` namespace, with wiring into the current validator entrypoints after extraction.

## 1. `CANONICAL_SAVE_ROOT_SPEC_REQUIRED`

- Proposed file: `scripts/spec/rules/CANONICAL_SAVE_ROOT_SPEC_REQUIRED.ts`
- Severity enum: `error`
- Trigger expression:

```ts
if (
  packet.isOutside(['research', 'review']) &&
  (exists('description.json') || exists('graph-metadata.json')) &&
  !exists('spec.md')
) {
  error('Packet root has canonical metadata but no canonical root spec.');
}
```

- Migration strategy:
  - Grandfather existing offenders only through an explicit temporary allowlist keyed by packet path.
  - Remove each allowlist entry once the root docs are created or the packet is demoted from the active phase map.
- Current blast radius:
  - `4 / 95` on this iteration's stricter re-scan.
  - This matches iteration 4's `4 / 96` broad inventory on the actual failing roots.

## 2. `CANONICAL_SAVE_SOURCE_DOCS_REQUIRED`

- Proposed file: `scripts/spec/rules/CANONICAL_SAVE_SOURCE_DOCS_REQUIRED.ts`
- Severity enum: `error`
- Trigger expression:

```ts
if (
  packet.isOutside(['research', 'review']) &&
  exists('graph-metadata.json') &&
  Array.isArray(graph.derived?.source_docs) &&
  graph.derived.source_docs.length === 0
) {
  error('Active packet graph metadata has no source_docs.');
}
```

- Migration strategy:
  - Same temporary allowlist as Rule 1.
  - Only enable as hard error for packets that remain in the parent phase map as active/live.
- Current blast radius:
  - `4 / 95` on the stricter re-scan.
  - Same failing set as Rule 1.

## 3. `CANONICAL_SAVE_LINEAGE_REQUIRED`

- Proposed file: `scripts/spec/rules/CANONICAL_SAVE_LINEAGE_REQUIRED.ts`
- Severity enum: `error`
- Trigger expression:

```ts
const cutoffIso = config.canonicalSaveLineageCutoffIso;
if (
  exists('graph-metadata.json') &&
  graph.derived?.last_save_at >= cutoffIso &&
  !['description_only', 'graph_only', 'same_pass'].includes(graph.derived?.save_lineage)
) {
  error('Recent graph save is missing save_lineage.');
}
```

- Migration strategy:
  - Do **not** hard-enable until the dist parity bug is fixed and the built artifacts are rebuilt.
  - After the fix, set `canonicalSaveLineageCutoffIso` to the first shipped post-fix timestamp and run a targeted backfill across active packets.
  - This should be a **cutoff gate**, not a filesystem mtime heuristic, because the canonical data already stores `derived.last_save_at`.
- Grandfathering cutoff logic:
  - Best cutoff = a validator config constant set to the first release/build that contains:
    - rebuilt `scripts/dist/core/workflow.js`,
    - rebuilt `mcp_server/dist/lib/graph/graph-metadata-parser.js`,
    - rebuilt `mcp_server/dist/lib/graph/graph-metadata-schema.js`,
    - one canonical backfill pass for active packets.
  - Before that release: warning-only or disabled.
- Current blast radius:
  - Ungated today: `95 / 95` on the stricter re-scan, `96 / 96` under iteration 4's broader inventory.
  - Properly gated post-fix: `0` immediate historical breakage, then only fresh post-cutoff regressions fail.

## 4. `CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED`

- Proposed file: `scripts/spec/rules/CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED.ts`
- Severity enum: `warning` initially, then `error` after a one-time normalization sweep
- Trigger expression:

```ts
const ids = normalizeDefined([
  description.specFolder,
  graph.spec_folder,
  continuity.packet_pointer,
]);
if (new Set(ids.map(normalizePacketIdentity)).size > 1) {
  warning('Canonical save surfaces disagree on packet identity.');
}
```

- Migration strategy:
  - Start warning-only because live drift still exists in already-shipped packets.
  - After a normalization sweep, raise to `error` only for packets with `description.lastUpdated` or `graph.derived.last_save_at` at/after `canonicalIdentityCutoffIso`.
- Grandfathering cutoff logic:
  - Use a second explicit config timestamp (`canonicalIdentityCutoffIso`) rather than packet-level permanent opt-outs.
  - Packet-level opt-out should exist only as a short-lived escape hatch for a known migration batch.
- Current blast radius:
  - `12 / 95` on the stricter re-scan.
  - Known examples include `013`, `015`, and multiple `016` descendants.

## 5. `CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS`

- Proposed file: `scripts/spec/rules/CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS.ts`
- Severity enum: `warning` initially
- Trigger expression:

```ts
const maxSkewMs = 5 * 60 * 1000;
if (
  description.lastUpdated &&
  graph.derived?.last_save_at &&
  Date.parse(description.lastUpdated) - Date.parse(graph.derived.last_save_at) > maxSkewMs &&
  mostRecentTimestamp(packet) >= config.canonicalFreshnessCutoffIso
) {
  warning('Description freshness is materially newer than graph freshness.');
}
```

- Migration strategy:
  - Warning-only first, because this detects partial follow-up asymmetry rather than structural invalidity.
  - Escalate to `error` only if a future save contract explicitly guarantees same-pass freshness for both files in all modes.
- Grandfathering cutoff logic:
  - Use `canonicalFreshnessCutoffIso` tied to the same rollout that fixes the dist parity path and revalidates the canonical save contract.
  - Do not fail older packets whose timestamps predate the repaired behavior.
- Current blast radius:
  - `7 / 95` on the stricter re-scan.
  - Known examples include `007`, `008`, `009`, `010`, `012`, and `013`.

## Backward-compatibility summary

| Rule | If enforced today | Safe rollout recommendation |
|------|-------------------|-----------------------------|
| `CANONICAL_SAVE_ROOT_SPEC_REQUIRED` | breaks 4 packet roots | enable after a targeted repair/demotion batch |
| `CANONICAL_SAVE_SOURCE_DOCS_REQUIRED` | breaks the same 4 packet roots | enable with the same batch as Rule 1 |
| `CANONICAL_SAVE_LINEAGE_REQUIRED` | breaks almost the whole tree (`95-96` packets depending on inventory scope) | ship only after dist rebuild + backfill + cutoff |
| `CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED` | warns on 12 packets today | warning-only first, then cutoff-based escalation |
| `CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS` | warns on 7 packets today | warning-only first, then reassess after save-contract repair |

# Next Focus

1. Live-repro the dist parity bug end to end by rebuilding the `system-spec-kit` bundles and re-running one canonical save against a disposable packet, confirming whether `save_lineage` appears as `same_pass` after the rebuild.
2. Decide the 026 repair shape for `007` through `010`: minimal root packet docs vs formal demotion from the active phase map.
3. If implementation starts next, land Rule 1 and Rule 2 first, keep Rules 4 and 5 warning-only, and hold Rule 3 behind the post-fix cutoff.
