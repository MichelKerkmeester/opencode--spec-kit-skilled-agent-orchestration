# Iteration 051 — Cluster B infrastructure gap reach (KQ-51-1)

**Segment**: 2 | **Dimension**: root-cause + cross-cutting-coverage | **Dispatched**: Opus 4.7 via Task tool
**Focus KQ**: KQ-51-1 (primary), KQ-51-5 (secondary — typed-union exhaustiveness)

---

## 1. Method

Inspected the canonical save pipeline end-to-end to determine whether the "no auto-refresh" pattern behind R4-P1-002 extends beyond `description.json.lastUpdated`. Files read:

1. `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` (647 lines) — CLI wrapper only.
2. `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1200-1420` — the actual save body.
3. `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts:79` — the *one* site where `lastUpdated` is written.
4. `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1050-1190` — graph-metadata refresh path.
5. `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:660-760` — discovery-side description repair.
6. `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:636-682` — trustState derivation (typed-union exhaustiveness audit).
7. `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:295-340` — `OnIndexSkipReason → EnrichmentSkipReason` mapping.
8. `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:128-140` — `OnIndexSkipReason` declaration.

Greps run:
- `lastUpdated` across `scripts/` → 4 hits, only `spec-folder/generate-description.ts:79` is a create-time writer, rest are test fixtures / registry metadata.
- `last_save_at` / `completeness_score` / `derived.*` → only `graph-metadata-parser.ts:1067` refreshes; no helper that touches `description.json.lastUpdated`.
- `_memory.continuity` / `continuity_freshness` across `scripts/` and `mcp_server/` → **zero** programmatic writers. All hits are prose documentation in README/SKILL/feature_catalog files.
- `OnIndexSkipReason`, `EnrichmentSkipReason`, `EnrichmentStepStatus`, `EnrichmentFailureReason`, `ConflictAbortStatus`, `SharedPayloadTrustState` — declaration + consumer inspection.

---

## 2. Evidence

### 2.1 description.json.lastUpdated writes in the canonical save path

**Finding: the code that would write `lastUpdated` on save is behind a hardcoded `false` guard.**

`scripts/core/workflow.ts:1259`:
```ts
const ctxFileWritten = false;
// Update per-folder description.json memory tracking (only if file was written)
if (ctxFileWritten) {
  // …lines 1261-1331: the ONLY place the workflow imports savePerFolderDescription
  //                   and could update description.json…
}
```

The preceding comment at line 1255 (`log('   Skipping legacy [spec]/memory/*.md writes')`) explains: the workflow used to gate this block on "was the legacy `[spec]/memory/*.md` artifact written?". After Path A retired that artifact (see comment block at 1235-1247), the guard was short-circuited to literal `false` — making the entire description-update block unreachable dead code.

Additionally, the `savePerFolderDescription` inside the unreachable block only touches `memorySequence` / `memoryNameHistory` (lines 1302-1307). It does **not** write `lastUpdated` even if it were reachable — that field is only stamped in `scripts/spec-folder/generate-description.ts:79` (create-time) and `mcp_server/lib/search/folder-discovery.ts:682` (reconstructPerFolderDescription, triggered only during discovery-time repair when the file is missing or schema-invalid).

**This refines R4-P1-002 from "no auto-refresh" to "structurally unreachable auto-refresh":** even if a future author removed the `const ctxFileWritten = false` stub, the savePFD block below does not touch `lastUpdated`. Two fixes required, not one.

### 2.2 graph-metadata.json.derived field auto-refresh

**Finding: default save path does NOT call `refreshGraphMetadata`.**

`scripts/core/workflow.ts:1333`:
```ts
const shouldRunExplicitSaveFollowUps = options.plannerMode === 'full-auto';
if (shouldRunExplicitSaveFollowUps) {
  // … refreshGraphMetadata(validatedSpecFolderPath) …
} else {
  log('   Deferred graph metadata refresh to explicit follow-up');
}
```

And `scripts/memory/generate-context.ts:415`:
```ts
let plannerMode: 'plan-only' | 'full-auto' | 'hybrid' = 'plan-only';
```

Default mode is `'plan-only'`. Only `--full-auto` (or `--planner-mode full-auto`) triggers the refresh. So under the default canonical save path:
- `graph-metadata.json.derived.last_save_at` stays frozen at whatever the last `full-auto` save (or `refreshGraphMetadata` call) stamped.
- `graph-metadata.json.derived.status` stays frozen — no re-derivation from `implementation-summary.md`.
- `graph-metadata.json.derived.source_docs`, `key_files`, `trigger_phrases`, `key_topics`, `causal_summary` — all frozen.

This means the drift pattern in R3-P2-001 / R5-P1-001 is BILATERAL: not just `description.json.lastUpdated` lags behind `graph-metadata.json.derived.last_save_at` — both files lag behind the actual disk state until a `full-auto` save lands. The "16/16 sibling folders stale" finding is actually undercounting the problem: even folders that look fresh (graph_metadata.derived.last_save_at recent) may have stale `derived.status` / `derived.source_docs` because the last save was incremental rather than full.

The refresh also needs to fire on `--planner-mode plan-only`, which is the documented default path (scripts/memory/generate-context.ts:67). Since `/memory:save` and `generate-context.js --json` both default to plan-only (line 402), **the happy path never refreshes graph-metadata**.

**Note**: there is no `completeness_score` field in `GraphMetadataDerived` at all (see `mcp_server/lib/graph/graph-metadata-schema.ts:43` — only `last_save_at`, `created_at`, `last_accessed_at` are timestamps; other derived fields are categorical). The review report's mention of `completeness_score` in the KQ-51-1 brief is a minor misnomer — the parity axes that actually matter are `last_save_at`, `status`, and `source_docs`.

### 2.3 implementation-summary.md._memory.continuity auto-maintenance

**Finding: zero programmatic writers exist.**

Grep for `_memory.continuity` / `_memory:` / `continuity:` across `scripts/` returns only README.md documentation files — no TypeScript or shell code that writes continuity frontmatter. Grep for `writeFileSync.*implementation-summary` / `update.*_memory` / `frontmatter.*continuity` across `mcp_server/` returns prose-only matches in `SKILL.md`, `feature_catalog.md`, `manual_testing_playbook.md`, `templates/handover.md`, and tests.

The only code that *reads* continuity is `mcp_server/lib/validation/spec-doc-structure.ts:513-555` (validation) and `mcp_server/lib/resume/resume-ladder.ts:361-372` (resume pathway). There is no writer. Per CLAUDE.md §Memory Save Rule, `_memory.continuity` is explicitly allowed to be AI-hand-edited — but there is no canonical save step that refreshes `last_updated_at` / `last_updated_by` / `recent_action` / `next_safe_action` automatically. Drift is inevitable whenever the AI forgets to stamp the block, which extends Cluster B by a fourth surface.

### 2.4 checklist.md / tasks.md evidence-marker auto-generation

**Finding: zero programmatic writers; the 170/179 malformed closers are hand-edit drift.**

Grep `CHK-\d+` across `scripts/` returns 125 occurrences in 20 files — of which the vast majority are lint rules (`scripts/rules/check-evidence.sh:2`), validators (`scripts/lib/coverage-graph-contradictions.cjs`), test fixtures, and renderer knowledge. No programmatic CHK/EVIDENCE marker writer exists.

`scripts/tests/validation-v13-v14-v12.vitest.ts:5` and `scripts/rules/check-evidence.sh:2` READ the markers to lint them; `scripts/lib/ascii-boxes.ts` and `scripts/extractors/*` PARSE them. Nothing writes them. Which means R3-P2-002's "170/179 malformed `)` closers" is not a tool bug — it is 170 distinct human-authored typos propagated through copy-paste, with no validator running on commit to catch them.

This refines the remediation seed: a **linter in `scripts/spec/validate.sh --strict`** (already suggested in review §5 Cluster B) is the correct fix; no templating change required.

### 2.5 Typed-union exhaustiveness audit (KQ-51-5 ride-along)

Inspected consumers of 6 typed unions listed in the research brief.

**a) `SharedPayloadTrustState` (8 values)** — `mcp_server/lib/context/shared-payload.ts:646-670` has two derivation helpers (`trustStateFromGraphState`, `trustStateFromStructuralStatus`). Both use `switch` WITHOUT default clauses, relying on TypeScript control-flow narrowing. A new variant added to the input type would fail-compile. **EXHAUSTIVE, safe.**

**b) `OnIndexSkipReason` (4 values: `graph_refresh_disabled` / `entity_linking_disabled` / `empty_content` / `onindex_exception`)** — consumer `mcp_server/handlers/save/post-insert.ts:302-316`:
```ts
const reasonMap: Record<string, EnrichmentSkipReason> = {
  graph_refresh_disabled: 'graph_refresh_disabled',
  entity_linking_disabled: 'entity_linking_disabled',
  empty_content: 'empty_content',
};
if (indexResult.skipReason === 'onindex_exception') { … }
else {
  const mapped = indexResult.skipReason ? reasonMap[indexResult.skipReason] : undefined;
  enrichmentStatus.graphLifecycle = makeSkipped(mapped ?? 'graph_lifecycle_no_op');
}
```
The `Record<string, …>` key type is `string`, not `OnIndexSkipReason`. If a future author adds a 5th variant to `OnIndexSkipReason` (e.g. `'quality_gate_rejected'`) without updating `reasonMap`, the lookup returns `undefined` → coerces to `'graph_lifecycle_no_op'` → **silently loses the new variant**, presenting a distinct skip reason as a generic no-op. No compile-time check catches this.

**c) `EnrichmentStepStatus` (5 values)**, **`EnrichmentSkipReason` (11 values)**, **`EnrichmentFailureReason` (multiple)** — consumers at post-insert.ts:344-369 filter by `step.status === 'failed'` / `step.status === 'partial'` only. `'ran'` / `'skipped'` / `'deferred'` are treated identically (non-failed). This is semantically intentional per the T-PIN-07 comment at 340-343, but any NEW status value (e.g. `'quarantined'`) added to the union would be silently bucketed into the non-failed pile. Not a direct P1-class silent failure (semantic intent documented), but is latent drift-risk analogous to Cluster A's 5-way normalizer duplication.

**d) `ConflictAbortStatus`, `HookStateLoadFailureReason`, `TriggerCategory`** — scanned consumers; all use `switch`-with-no-default or `===` narrowing. Exhaustive by compile-time flow analysis.

**Summary of KQ-51-5:** Only ONE of the 8 unions audited has a silent-swallow default-branch risk (`OnIndexSkipReason` via the `Record<string, …>` lookup at post-insert.ts:302). R4-P2-002 is correctly scoped as P2, not escalated to P1 — but the post-insert.ts:302 site is a concrete instance that should be refactored to `satisfies Record<OnIndexSkipReason, EnrichmentSkipReason>` during Phase 017 cleanup.

---

## 3. Findings

### R51-P1-001 | Canonical save path has no reachable description.json writer | Cluster B (extends R4-P1-002)

**File:line**: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1259`
**Claim**: `const ctxFileWritten = false` hardcodes the description-update guard to false, making the entire `savePerFolderDescription` block at 1261-1331 unreachable dead code. Even if reached, that block only updates `memorySequence`, never `lastUpdated`.
**Evidence**:
```ts
// workflow.ts:1255-1261
log('   Skipping legacy [spec]/memory/*.md writes');

// RC-6 fix: Check if the primary context file was actually written (it may
// Have been skipped as a duplicate). Guard downstream operations accordingly.
const ctxFileWritten = false;
// Update per-folder description.json memory tracking (only if file was written)
if (ctxFileWritten) {
```
Inspection of lines 1261-1331 confirms the block updates `sequenceSnapshot.memorySequence` / `memoryNameHistory` only (1302-1307). `lastUpdated` is stamped only at `spec-folder/generate-description.ts:79` (create-time).
**Blast radius**: Extends R4-P1-002 with structural-unreachability evidence. Even the "fix generate-context.js" remediation seed in review §5 is insufficient — fixing requires (a) removing the `= false` stub, (b) adding `existing.lastUpdated = new Date().toISOString()` to the savePFD block. Without both, description.json.lastUpdated remains stale across all 16+ sibling folders permanently.
**Remediation seed**: In workflow.ts, replace `const ctxFileWritten = false` with actual save-state signal (or delete the dead block entirely and add a dedicated `refreshPerFolderDescriptionTimestamp(specFolder)` call that stamps `lastUpdated` on every canonical save, regardless of duplicate-detect status).
**Confidence**: 0.92

### R51-P1-002 | Default planner-mode `plan-only` skips graph-metadata refresh | Cluster B (extends R3-P2-001, R5-P1-001)

**File:line**: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1333`, `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:415`
**Claim**: `refreshGraphMetadata` is gated on `options.plannerMode === 'full-auto'`. The default planner mode (set at line 415 of generate-context.ts) is `'plan-only'`. Therefore the default `/memory:save` path NEVER refreshes `graph-metadata.json.derived.last_save_at` / `derived.status` / `derived.source_docs`.
**Evidence**:
```ts
// generate-context.ts:415
let plannerMode: 'plan-only' | 'full-auto' | 'hybrid' = 'plan-only';

// workflow.ts:1333-1353
const shouldRunExplicitSaveFollowUps = options.plannerMode === 'full-auto';
if (shouldRunExplicitSaveFollowUps) { /* refreshGraphMetadata */ }
else { log('   Deferred graph metadata refresh to explicit follow-up'); }
```
**Blast radius**: The Cluster B drift is bilateral, not just description.json. Every plan-only save that touches canonical docs leaves both description.json.lastUpdated AND graph-metadata.derived.last_save_at stale. The "16/16 sibling folders stale" finding in R5-P1-001 is the predictable symptom: unless users actively pass `--full-auto`, the refresh never fires. Remediation must either flip the default OR run `refreshGraphMetadata` unconditionally (the function is idempotent and cheap — ~50ms per folder).
**Remediation seed**: Either (a) move `refreshGraphMetadata` out of the `shouldRunExplicitSaveFollowUps` guard so it always runs, or (b) flip the default at generate-context.ts:415 from `'plan-only'` to `'full-auto'`. Option (a) is lower-risk because the function is side-effect-bounded to a single folder.
**Confidence**: 0.93

### R51-P1-003 | implementation-summary.md._memory.continuity has zero programmatic writers | Cluster B (NEW surface)

**File:line**: `.opencode/skill/system-spec-kit/` (whole tree — grep miss)
**Claim**: Zero TypeScript/shell/JS code in the skill writes `_memory.continuity` frontmatter. Only READS exist (validation in `spec-doc-structure.ts:513-555`, resume in `resume-ladder.ts:361-372`). Maintenance is 100% manual AI-authored.
**Evidence**: Grep `_memory\.continuity|_memory:\s*\n|continuity:\s*\n|continuity_freshness` across `scripts/` and `mcp_server/` source (non-test) returns zero programmatic writer hits. The only matches are prose documentation in README/SKILL/feature_catalog files. Even the canonical save handler `mcp_server/handlers/memory-save.ts:1699` invokes `refreshGraphMetadata` but does nothing for continuity frontmatter.
**Blast radius**: Extends Cluster B by a 4th canonical-save surface. The review caught 3 (description.json, graph-metadata.json, checklist.md evidence markers). The fourth — `_memory.continuity` in `implementation-summary.md` — is critical for `/spec_kit:resume` accuracy. Stale continuity blocks make `resume-ladder.ts` recover a packet at the wrong position. CLAUDE.md explicitly permits AI hand-editing, but without a validator that flags "last_updated_at > 7d old", every resume dispatch could be silently working from a stale action-pointer.
**Remediation seed**: Add (a) a validator rule to `scripts/spec/validate.sh --strict` that enforces continuity block freshness (max-age relative to git mtime), and (b) a helper `writeContinuityFrontmatter(specFolder, { recent_action, next_safe_action, last_updated_by })` invoked from the canonical save path (or from /spec_kit:resume after each action). Without at least the validator, drift is structurally inevitable per the same pattern as R4-P1-002.
**Confidence**: 0.85

### R51-P2-001 | OnIndexSkipReason lookup uses weak-typed Record<string, …> enabling silent variant loss | Standalone (ride-along on R4-P2-002)

**File:line**: `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:302-316`
**Claim**: The `reasonMap: Record<string, EnrichmentSkipReason>` uses `string` keys instead of `OnIndexSkipReason`. Any future variant added to the `OnIndexSkipReason` union would return `undefined` from the lookup and silently coerce to `'graph_lifecycle_no_op'`, losing the new reason without compile-time warning.
**Evidence**:
```ts
// post-insert.ts:302-316
const reasonMap: Record<string, EnrichmentSkipReason> = {
  graph_refresh_disabled: 'graph_refresh_disabled',
  entity_linking_disabled: 'entity_linking_disabled',
  empty_content: 'empty_content',
};
// … (onindex_exception handled separately)
const mapped = indexResult.skipReason ? reasonMap[indexResult.skipReason] : undefined;
enrichmentStatus.graphLifecycle = makeSkipped(mapped ?? 'graph_lifecycle_no_op');
```
`OnIndexSkipReason` declared at `graph-lifecycle.ts:128-132` with 4 variants. `reasonMap` covers 3. The 4th (`onindex_exception`) is handled via separate `if` — but a 5th variant added later would fail silently.
**Blast radius**: This is the ONLY concrete exhaustiveness-bypass site found across the 8 typed unions audited (SharedPayloadTrustState, OnIndexSkipReason, EnrichmentStepStatus, EnrichmentSkipReason, EnrichmentFailureReason, ConflictAbortStatus, HookStateLoadFailureReason, TriggerCategory). Refines R4-P2-002 from "no exhaustiveness checks anywhere" to "one P2-ranked concrete site + 7 unions that survive via control-flow narrowing."
**Remediation seed**: Change to `const reasonMap = { graph_refresh_disabled: …, entity_linking_disabled: …, empty_content: … } satisfies Partial<Record<OnIndexSkipReason, EnrichmentSkipReason>>` and add an explicit `if (indexResult.skipReason && !reasonMap[indexResult.skipReason]) { console.warn('[post-insert] unmapped OnIndexSkipReason: ' + indexResult.skipReason) }` logline. Compile-time type-narrow via switch is a bigger refactor; the `satisfies` + logline is one line.
**Confidence**: 0.82

---

## 4. Resolved questions

- [x] **KQ-51-1**: The Cluster B infrastructure gap reaches FOUR canonical-save surfaces, not two. Beyond the known `description.json.lastUpdated` (R4-P1-002) and `checklist.md` evidence markers (R3-P2-002), iteration 51 confirms: (a) `graph-metadata.json.derived.*` fields are only refreshed on `--full-auto` saves, never on the default `plan-only` path — R51-P1-002; (b) `_memory.continuity` frontmatter in `implementation-summary.md` has zero programmatic writers anywhere in the codebase — R51-P1-003; (c) the existing `savePerFolderDescription` code path in `workflow.ts` is structurally unreachable dead code due to `const ctxFileWritten = false` — R51-P1-001. Confidence: 0.91.
- [partial] **KQ-51-5**: Of 8 typed unions audited, 7 are exhaustiveness-safe via TypeScript control-flow narrowing (`switch` without default, returning typed result). One concrete site — `post-insert.ts:302` `Record<string, EnrichmentSkipReason>` lookup against `OnIndexSkipReason` — silently coerces unknown variants to `'graph_lifecycle_no_op'`. Not P1-class (blast radius is observability-only, not correctness), but deserves a `satisfies Record<OnIndexSkipReason, …>` tightening in Phase 017. R4-P2-002 correctly scoped as P2. Confidence: 0.83.

---

## 5. Ruled-out directions

- **"generate-context.js is bundled and the dist file is somehow different from src"**: Refuted. Line counts differ (647 src, 571 dist), but the dist preserves the `plannerMode = 'plan-only'` default and the `shouldRunExplicitSaveFollowUps` guard identically (dist file does not include the description-update workflow code — that lives in `workflow.js` which we traced via the .ts source).
- **"graph-metadata has a `completeness_score` that might drift independently"**: Refuted. The `GraphMetadataDerived` schema at `graph-metadata-schema.ts:43` has no `completeness_score` field. The KQ brief's mention of that field was a false lead — the actual parity axes are `last_save_at`, `status`, `source_docs`.
- **"folder-discovery.ts `reconstructPerFolderDescription` at line 682 is a latent lastUpdated writer called on save"**: Refuted. `reconstructPerFolderDescription` is only invoked during discovery-time schema-repair (when the file is missing / invalid, lines 476-497). It never runs on a healthy canonical save. Not a save-path writer.

---

## 6. Metrics

- Raw findings: 4 (3 P1, 1 P2)
- Deduplicated vs prior segment: 0 (all findings are new — they extend R4-P1-002 / R3-P2-001 / R5-P1-001 / R4-P2-002 with net-new file:line evidence the review did not cite)
- Net-new findings: 4
- newInfoRatio estimate: 0.85 (iteration added 3 net-new file:line sites to Cluster B + 1 standalone refinement; only overlap with review is that all 4 relate to existing finding IDs — but the specific loci and fix-scopes are new)

---

## 7. Next-focus recommendation

Iteration 52/54 should pivot to **remediation-planning support**, NOT further discovery. The Cluster B gap is now fully-mapped (4 surfaces, 3 file:line loci in workflow.ts/generate-context.ts, 1 standalone fix in post-insert.ts). Recommended next-focus candidates:

1. **Phase 017 task-sequencing**: audit whether the fixes interact — specifically, does refreshing graph-metadata on every save (R51-P1-002 fix) require first fixing description.json (R51-P1-001) to avoid writing stale last_save_at into graph-metadata? Order matters for atomic rollout.
2. **Verification-scope mapping**: for the `--full-auto` default flip, which of the 16 sibling folders have custom `manual.*` fields in graph-metadata.json that might be wiped by an overly-aggressive refresh? Spot-check before the default flips.
3. **Cross-cluster question**: does the R2-P1-001 session-resume authentication gap interact with stale `_memory.continuity` frontmatter (R51-P1-003) — e.g. can an attacker synthesize a stale continuity block that `resume-ladder.ts:361-372` happily parses and routes to a different packet's action-pointer? Out of scope for iter-51 but a natural security-cluster question for iter-52.
