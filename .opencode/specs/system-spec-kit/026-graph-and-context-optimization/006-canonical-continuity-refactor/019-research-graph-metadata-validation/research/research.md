# Research: Graph Metadata Quality and Relationship Validation

## Scope and Method
This research loop scanned every `graph-metadata.json` file under `.opencode/specs/` excluding `z_archive` and `node_modules`, read the runtime schema/parser/backfill code, and cross-checked representative packet docs. The investigation stayed read-only outside this packet's `research/` folder.

### Runtime Baseline
- Corpus size: 344 graph-metadata files. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
- Legacy-format files: 35, all still runtime-loadable through the parser's legacy fallback. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:96-203] [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
- Backfill already expects review-worthy ambiguity around status, summary quality, and prose relationships. [SOURCE: .opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:111-136]

## Research Answers

### RQ-1: Depends-On Integrity
Only four declared `depends_on` edges exist in the live corpus, and all four resolve to real spec folders. Broken-edge rate: 0.0%. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/013-dead-code-and-architecture-audit/graph-metadata.json:7-15] [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]

Interpretation:
The current graph is relationship-sparse rather than relationship-broken.

### RQ-2: Dependency Cycles
No cycles were found in the resolved dependency graph. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]

Interpretation:
This is a low-confidence sign of graph health because the graph contains only four declared dependency edges.

### RQ-3: Children IDs
`children_ids` serialize specs-root-relative paths generated from direct numeric child directories. With that same path base, all 290 child links resolve. Ghost-child rate: 0.0%. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:388-393] [SOURCE: .opencode/specs/00--ai-systems/001-global-shared/graph-metadata.json:6-12] [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]

Interpretation:
The obvious ghost-child failures appear only when scanners incorrectly join `dirname` with values that are already full specs-root-relative identifiers.

### RQ-4: Key File Existence
`deriveKeyFiles()` pulls backticked file references from packet docs, prefers `implementation-summary.md`, appends canonical doc names, and truncates the final list to 20 entries. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:463-471]

Corpus result:
- Total key-file entries: 5,298
- Resolved under a three-base heuristic (`repo root`, `spec-relative`, `skill-relative`): 3,172 (59.87%)
- Missing: 2,126 (40.13%)
- Repo-root-only resolution: 21.78%

Dominant miss classes:
- Bare tokens: 1,203
- Path-like misses: 628
- Dot-relative or cross-root references: 193
- Version-like tokens: 55
- Title-like tokens: 47

Interpretation:
Key-file quality is the largest concrete path-quality problem in the corpus. Many stored values are not canonical paths at all.

### RQ-5: Entity Duplicate Noise
`deriveEntities()` seeds the entity map from every key-file path using `path.basename()`, then adds extracted doc entities, and truncates to 16 entries. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:418-446]

Corpus result:
- Basename-only duplicate entities: 2,020
- Folders affected: 270 of 344 (78.49%)
- Entity-cap hits at 16: 291 folders (84.59%)

Representative noise:
- Canonical-path basename duplicates like `spec.md` alongside `.opencode/specs/.../spec.md`
- Command-derived entity names
- Newline-bearing or section-label-bearing entities such as `Problem Statement\nThe Global Shared` [SOURCE: .opencode/specs/00--ai-systems/001-global-shared/graph-metadata.json:95-120]

Interpretation:
Entity quality is downstream of key-file quality, and both are currently too noisy for high-confidence graph/search enrichment.

### RQ-6: Status Accuracy
`deriveStatus()` reads frontmatter scalars only and does not inspect markdown metadata tables. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:346-353] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:498-510]

Corpus result:
- Stored status distribution: `planned` 302, `complete` 39, `Complete` 1, `In Progress` 1, `review` 1
- Folders with `implementation-summary.md` present: 301
- Folders still marked `planned` despite `implementation-summary.md`: 259

Representative mismatch:
`00--ai-systems/001-global-shared/spec.md` shows `In Progress` only in a markdown table while `implementation-summary.md` lacks frontmatter `status`, so the graph metadata remains `planned`. [SOURCE: .opencode/specs/00--ai-systems/001-global-shared/spec.md:15-23] [SOURCE: .opencode/specs/00--ai-systems/001-global-shared/implementation-summary.md:1-20] [SOURCE: .opencode/specs/00--ai-systems/001-global-shared/graph-metadata.json:43-50]

Interpretation:
Status drift is primarily a derivation-policy problem, not just inconsistent packet authoring.

### RQ-7: Distribution and Limits
Corpus distributions show sustained pressure at or beyond current limits.

- Trigger phrases over 12: 216 folders (62.79%)
- Highest trigger count observed: 33
- Key-file lists at cap 20: 159 folders (46.22%)
- Entity lists at cap 16: 291 folders (84.59%)

Interpretation:
The current caps are either too low for the source material or are being fed too much noisy content. For entities and triggers, the stronger issue is likely quality before quantity.

### RQ-8: Stale `last_save_at`
130 folders have `last_save_at` older than the newest canonical-doc mtime in the same packet. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]

Important nuance:
Legacy fallback parsing synthesizes timestamp fields instead of preserving historical save times, so stale-timestamp counts mix true freshness gaps with compatibility-artifact gaps. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:122-160]

Interpretation:
Timestamp freshness is useful as a signal, but it should be split into native-JSON freshness versus legacy-compatibility freshness before driving automation.

## Cross-Corpus Patterns

### What Is Healthy
- Relationship integrity is strong on the small amount of structured relationship data currently present.
- `children_ids` and parent-child structure are internally consistent when interpreted correctly.
- The runtime can still load legacy text metadata, which reduces immediate breakage risk.

### What Is Weak
- Key-file canonicality is poor.
- Entity derivation amplifies key-file noise.
- Status derivation under-reports real packet progress.
- Trigger/entity caps are saturated too often to be treated as edge cases.
- Legacy compatibility preserves loadability but weakens timestamps and entity coverage.

## Recommendations
1. Normalize legacy text files to canonical JSON so timestamp, entity, and relationship behavior is consistent across the full corpus.
2. Strengthen `deriveStatus()` with a fallback that recognizes implementation-summary presence and optionally normalized packet-table status when frontmatter is absent.
3. Sanitize `key_files` before storage: reject obvious commands, MIME types, version tokens, and non-canonical cross-root references.
4. De-duplicate entities against canonical path basenames before insertion, not only after extraction.
5. Enforce or explicitly re-specify trigger-phrase limits, because the current implementation stores far more than the packet contract suggests.
6. Separate relationship integrity from relationship coverage in future dashboards so a sparse-but-valid graph is not mistaken for a complete graph.

## Priority Order
1. Status derivation
2. Key-file sanitization and canonicalization
3. Entity duplicate suppression
4. Legacy-file normalization
5. Trigger-phrase cap enforcement
6. Timestamp freshness split by format class

## Wave 2: Remediation Design Investigation (Iterations 11-20)

### Update Note
The live corpus changed between the original 10-iteration discovery wave and this remediation-design wave. On 2026-04-13 the active `.opencode/specs/` tree contains 360 `graph-metadata.json` files, and all of them are valid JSON. The earlier “35 legacy text files” result is now a historical snapshot rather than current active-state truth.

### FQ-1: Status Derivation Fix
`deriveStatus()` still only reads frontmatter scalars from the canonical packet docs and falls back straight to `planned`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:498-510]

Live corpus result:
- Stored `planned` statuses: 340
- `planned` with `implementation-summary.md`: 282
- `planned` with both `implementation-summary.md` and `COMPLETE` checklist: 180
- `planned` with `implementation-summary.md` and no checklist: 39

Minimal patch:
- After the ranked frontmatter check, return `complete` when `implementation-summary.md` exists.
- Smallest code surface: `deriveStatus()` only. No schema or backfill logic needs to change.

Safer patch:
- Explicit frontmatter status wins.
- If `checklist.md` exists and Spec Kit completion rules say `COMPLETE`, return `complete`.
- Else if `implementation-summary.md` exists and no checklist exists, return `complete`.
- Else keep `planned` (or normalize to `in_progress` in a later pass).

Interpretation:
The pure implementation-summary rule flips 282 folders immediately, but it also hides 63 folders where a checklist exists and is not complete. The safer precedence is slightly larger than the phase-001 one-liner, but it better matches the existing packet contract.

### FQ-2: Key-File Sanitization
`extractReferencedFilePaths()` currently excludes only URLs, `./research/`, `../`, wildcards, and `...`. Everything else survives into `deriveKeyFiles()`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:320-334] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:463-471]

Live corpus result after spec-relative resolution:
- Missing `key_files`: 2,195
- Narrow command/version/MIME/title filter catches 106 missing entries across 64 specs
- Bare non-canonical filename rule catches 1,402 missing entries across 298 specs
- Combined filter catches 1,489 missing entries across 276 specs (67.8% of current misses)

Recommended helper:
- Keep canonical packet docs: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `research.md`, `research/research.md`, `handover.md`
- Reject command-shaped strings: `node ...`, `npx ...`, `pnpm ...`, `python...`, `bash ...`, `vitest ...`, `jest ...`
- Reject obvious non-file tokens: version literals like `v0.200`, MIME types, `_memory.continuity`, colon-delimited pseudo-fields, bare title fragments
- Reject non-canonical bare filenames unless they are on the allowed packet-doc list

Placement:
- Filter referenced values before `normalizeUnique(...)` in `deriveKeyFiles()`.
- Keep `docs.map((doc) => doc.relativePath)` as the canonical tail so packet docs always survive the filter.

### FQ-3: Entity De-Duplication
`deriveEntities()` currently keys the map by full `filePath` for key-file-derived entities, then keys extracted entities by normalized text. That means basename duplicates survive whenever the paths differ. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:418-446]

Live corpus result:
- Entity rows stored: 5,674
- Redundant duplicate-name slots: 794
- Folders affected: 234
- Folders already capped at 16 entities: 349

Sample collision:
- `spec.md` alongside `.opencode/specs/.../spec.md`
- `plan.md` alongside `.opencode/specs/.../plan.md`
- `implementation-summary.md` alongside `.opencode/specs/.../implementation-summary.md`

Exact insertion point:
- The basename check must run before `entities.set(...)` in the key-files loop.
- The same name check should also guard the extracted-entity loop.

Interpretation:
If the check is added only for extracted entities, many of the current duplicates remain, because the duplicate slots are already created while seeding from `key_files`.

### FQ-4: Legacy Normalization
The parser still supports plaintext fallback, and the backfill script still refreshes every spec folder. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:82-160] [SOURCE: .opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:139-177]

Current live result:
- Active legacy text files: 0
- All-spec legacy text files (including archive): 0

Implication:
Phase `004-normalize-legacy-files` is stale against the active tree. The current branch no longer needs a bulk conversion run for live data.

Safest future-proof implementation:
- Add a flag such as `--rewrite-legacy-only` or `--normalize-legacy-only` to `backfill-graph-metadata.ts`
- Under that flag, inspect the raw file first; only rewrite files that fail JSON parsing but still load via `loadGraphMetadata()`
- If no such files exist, return a no-op summary instead of rewriting the whole tree

### FQ-5: Trigger-Phrase Cap Enforcement
The trigger cap is not enforced in graph-metadata generation. `deriveGraphMetadata()` builds `triggerPhrases` with `normalizeUnique(...)` and writes the full array into `derived.trigger_phrases`. The schema also has no max-length constraint. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:523-545] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:29-39]

Live corpus result:
- Folders over 12 trigger phrases: 185
- Maximum trigger count: 33
- Excess trigger phrases above the cap: 949

Minimal patch:
- `const triggerPhrases = normalizeUnique(docs.flatMap((doc) => doc.triggerPhrases)).slice(0, 12);`

Interpretation:
This is a direct omission, not a disputed contract. `key_topics` already slices to 12, so the trigger overflow is specific to `trigger_phrases`.

### Sub-Phase Alignment
- `001-fix-status-derivation`: still aligned, but should explicitly note the checklist-precedence tradeoff if the implementation goes beyond the one-line fix.
- `002-sanitize-key-files`: still aligned, and the combined filter now has concrete corpus evidence.
- `003-deduplicate-entities`: still aligned, but the basename check belongs in the key-file seeding path first.
- `004-normalize-legacy-files`: now stale for the active branch because the corpus no longer contains legacy text metadata.

### Recommended Implementation Order
1. Patch `deriveStatus()` first, using either the literal phase-001 one-liner or the safer checklist-aware fallback.
2. Add `isLikelyKeyFilePath()` inside `deriveKeyFiles()` and re-run corpus verification to confirm the 1,489-entry reduction holds after regeneration.
3. Add basename-aware de-duplication inside `deriveEntities()` before both `entities.set(...)` callsites.
4. Re-scope or close phase `004-normalize-legacy-files` unless legacy text files reappear on another branch.
5. Add the missing `trigger_phrases.slice(0, 12)` guard as a low-risk cleanup while the parser is already under test.

## Wave 3: Convergence and Implementation-Ready Patch Map (Iterations 21-25)

### CQ-1: Exact `key_files` Predicate
Wave 3 turned the earlier “combined structural-plus-regex filter” into one explicit implementation predicate:

```ts
const CANONICAL_PACKET_DOC_RE =
  /^(spec\.md|plan\.md|tasks\.md|checklist\.md|decision-record\.md|implementation-summary\.md|research\.md|research\/research\.md|handover\.md)$/;
const KEY_FILE_NOISE_RE =
  /^(node |npx |pnpm |npm |yarn |bun |python([0-9]+(\.[0-9]+)*)? |bash |sh |vitest |jest |mocha |tsx |ts-node )|^v[0-9]+\.[0-9]+(\.[0-9]+)?$|^[a-z]+\/[a-z0-9+-]+$|^_memory\.continuity$|^[A-Za-z][A-Za-z0-9_-]*:\s.+$|^console\.warn(\(|$)/;
const BARE_FILE_RE = /^[^/]+\.[A-Za-z0-9._-]+$/;

function keepKeyFile(candidate: string): boolean {
  if (KEY_FILE_NOISE_RE.test(candidate)) return false;
  if (BARE_FILE_RE.test(candidate) && !CANONICAL_PACKET_DOC_RE.test(candidate)) return false;
  return true;
}
```

Live bash + jq rerun over the current 360-file corpus:
- Unresolved `key_files`: 2,207
- Regex-only junk-token removals: 108
- Structural bare-filename removals: 1,412
- Combined removals: 1,498 (67.9%)

Important nuance:
This explicit rerun is slightly higher than the earlier `1,489 / 2,195` headline. The implementation should preserve the predicate itself, not the older aggregate count. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:318-334] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:463-471] [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]

Placement:
- Filter `referenced` and `fallbackRefs`
- Append `docs.map((doc) => doc.relativePath)` after filtering
- Keep `normalizeUnique(...).slice(0, 20)` as the existing final shape

### CQ-2: Exact `deriveEntities()` Code Path
Wave 2 correctly identified the two write sites, but Wave 3 found one more subtlety: canonical packet-doc paths must beat non-canonical collisions.

Current write sites:
- `entities.set(filePath, ...)` in the key-files loop. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:421-428]
- `entities.set(normalizedName, ...)` in the extracted-entity loop. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:430-442]

Representative live collision:
- `system-spec-kit/023-hybrid-rag-fusion-refinement/graph-metadata.json` stores `name: "spec.md"` with `path: "specs/system-spec-kit/023-hybrid-rag-fusion-refinement/spec.md"` even though plain `spec.md` is also present in `derived.key_files`. [SOURCE: .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/graph-metadata.json]

Implementation-ready shape:
- Create `canonicalDocPaths = new Set(docs.map((doc) => doc.relativePath))`
- Normalize a `nameKey` once per candidate
- Replace both direct `entities.set(...)` calls with `upsertEntityByName(candidate)`
- When a collision happens, replace the existing row only if the incoming `path` is canonical and the existing `path` is not

Interpretation:
The de-duplication helper belongs inside `deriveEntities()`, but it must do more than “keep first” if the goal is to keep canonical packet docs. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:418-446] [SOURCE: .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/graph-metadata.json]

### CQ-3: Safer `deriveStatus()` Pseudo-Code
The safer patch is now precise enough to implement directly:

```ts
function deriveStatus(docs: ParsedSpecDoc[], override?: string | null): string {
  if (override?.trim()) return override.trim();

  const frontmatterStatus = selectFirstValue([
    docs.find((doc) => doc.relativePath === 'implementation-summary.md')?.status,
    docs.find((doc) => doc.relativePath === 'checklist.md')?.status,
    docs.find((doc) => doc.relativePath === 'tasks.md')?.status,
    docs.find((doc) => doc.relativePath === 'plan.md')?.status,
    docs.find((doc) => doc.relativePath === 'spec.md')?.status,
  ], '');
  if (frontmatterStatus) return frontmatterStatus;

  const hasImplementationSummary = docs.some((doc) => doc.relativePath === 'implementation-summary.md');
  const checklistDoc = docs.find((doc) => doc.relativePath === 'checklist.md');
  const checklistState = checklistDoc ? evaluateChecklistCompletion(checklistDoc.content) : null;

  if (checklistState === 'COMPLETE') return 'complete';
  if (!checklistDoc && hasImplementationSummary) return 'complete';
  return 'planned';
}
```

Why this shape matters:
- `340` folders are currently `planned`
- `282` of those already have `implementation-summary.md`
- `180` also have a `COMPLETE` checklist
- `39` have no checklist
- `63` have a checklist that is not complete and should not be promoted automatically

The safer patch therefore protects the `63` checklist-backed false positives while still fixing the high-confidence `180 + 39` subset. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:498-510] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:204-235] [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]

### CQ-4: Trigger-Cap Ownership
Wave 3 closed the open ownership question:
- Parser: no cap; `triggerPhrases` is written unsliced. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:523-545]
- Schema: no cap; `trigger_phrases` is just `z.array(z.string().min(1))`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:32-44]
- Backfill: no cap; it only delegates to `deriveGraphMetadata()` or `refreshGraphMetadataForSpecFolder()`. [SOURCE: .opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:139-177]

Implementation owner:

```ts
const triggerPhrases = normalizeUnique(docs.flatMap((doc) => doc.triggerPhrases)).slice(0, 12);
```

Live impact remains:
- 185 folders over cap
- 949 excess trigger phrases
- maximum stored trigger count 33

Interpretation:
The minimal fix belongs in the parser. A schema `.max(12)` can follow later as a validation guard after regenerated metadata proves clean. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]

### CQ-5: Child-Phase Line Map
Phase-by-phase implementation handoff:

`001-fix-status-derivation`
- Keep the override path at `deriveStatus()` lines 498-500.
- Preserve ranked frontmatter selection at lines 503-509.
- Add a checklist-evaluation helper adjacent to `deriveStatus()`.
- Only use `implementation-summary.md` as a completion signal when `checklist.md` is absent or complete.

`002-sanitize-key-files`
- Add the exact `KEY_FILE_NOISE_RE`, `BARE_FILE_RE`, and canonical-doc allowlist near `extractReferencedFilePaths()`.
- Filter `referenced` and `fallbackRefs` before line 470.
- Append `docs.map((doc) => doc.relativePath)` after filtering so canonical packet docs always survive.

`003-deduplicate-entities`
- Replace direct `entities.set(filePath, ...)` writes with a local `upsertEntityByName(...)` helper.
- Call the same helper before the extracted-entity `entities.set(normalizedName, ...)` site.
- Prefer canonical packet-doc paths over non-canonical collision paths.

`004-normalize-legacy-files`
- Active-branch runtime work is currently stale because there are zero legacy text files in the live tree.
- If the phase remains open, rewrite it as a guarded helper in `backfill-graph-metadata.ts`:
  inspect raw file contents before line 158, rewrite only when raw content fails JSON parsing but still loads through legacy compatibility, otherwise emit a no-op summary.

Adjacent cleanup not yet phase-owned:
- Patch `deriveGraphMetadata()` lines 532-540 to slice `triggerPhrases` to 12.
- Decide whether that should live in a tiny new child phase or ride with the existing parser-touch phases.

## Final Recommendation
No further discovery pass is needed before implementation. The remaining work is execution:
1. Implement phase `001` with the safer checklist-aware fallback.
2. Implement phase `002` with the exact predicate frozen above.
3. Implement phase `003` with canonical-preference entity upserts.
4. Retire or rewrite phase `004` instead of shipping a no-op “legacy normalization” patch against a zero-legacy corpus.
5. Land the trigger-cap slice as an adjacent parser cleanup and then re-run corpus/backfill verification.
