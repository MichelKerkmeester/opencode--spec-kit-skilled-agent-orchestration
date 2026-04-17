# Iteration 4 — Maintainability

## Dispatcher

- iteration: 4 of 7
- dispatcher: task-tool / @deep-review / claude-opus-4-7
- session_id: 2026-04-17T120827Z-016-phase017-review
- timestamp: 2026-04-17T12:27:00Z

## Files Reviewed

- `.opencode/skill/system-spec-kit/shared/predicates/boolean-expr.ts` (full read)
- `.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts` (full read)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:1-160` + grep for schemaVersion
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:290-490`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts` (full structural read)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:220-300`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:340-353`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:480-610`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:190-220`
- `.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:430-460`
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:140-180`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:120-140`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:120-140` (reasonMap check)
- `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` (grep for lastUpdated — zero hits)
- `.git/hooks/` (listing — zero active hooks, all `.sample` only)

## Investigation Thread

Maintainability pass covering 7 tracks from the iteration brief:

1. **Code clarity of hardening layers** — `boolean-expr.ts` is exceptionally well-commented: 6-section structure (Types / Constants / Parsers / Evaluator / Prose-Bleed Detector / Helpers), grammar documented inline (`parseBooleanExprString` comment lines 104-115), `scalarsEqual` helper explains its own TRUE/FALSE coercion shim (lines 372-378), and the `PROSE_BLEED_TOKENS` array has a docstring explaining *why* timing-prose is rejected. `gate-3-classifier.ts` is similarly strong: trigger categories explained with rationale (lines 109-127 explains why `analyze` is a read-only disqualifier, not a positive trigger), decision-order algorithm documented in comment lines 168-179. `reconsolidation.ts` CAS logic (lines 505-550) has good inline comments on atomicity but the `importance_tier != 'deprecated'` guard appears 4+ times without a shared symbol/comment explaining *why* this predicate is the deprecation contract. `graph-lifecycle.ts` `OnIndexSkipReason` type is well-docstring'd (lines 123-132). `hook-state.ts` HookStateSchema is co-located with the `HookState` type (lines 54-76). Overall clarity: **high on new layers, weaker on long-lived files that accumulated drift**.

2. **Duplication check** — Five separate implementations of essentially the same "trim string; return null if empty" helper exist across the codebase:
   - `reconsolidation-bridge.ts:228` — module-local `normalizeScopeValue(value: unknown): string | null`
   - `lineage-state.ts:198` — module-local `normalizeScopeValue(value: unknown): string | null` (identical implementation)
   - `types.ts:348` — exported `normalizeScopeMatchValue(value?: string | null): string | null` (different signature; stricter input type)
   - `preflight.ts:440` — inline closure `const normalizeScopeValue = (value?: string) => …` inside `checkForDuplicates()`
   - `scope-governance.ts:155` — canonical `normalizeScopeContext(input)` calling `normalizeId` (a helper)
   
   Callers of the canonical `normalizeScopeContext`: `checkpoints.ts`, `memory-search.ts`, `scope-governance.ts` itself. Callers of the four disconnected reinvented versions: `reconsolidation-bridge.ts`, `lineage-state.ts`, `create-record.ts`, `dedup.ts`, `preflight.ts`. The canonical helper exists but is not consistently adopted. Iteration 2 confirmed the `reconsolidation-bridge` and `types.ts` helpers are semantically identical; this iteration confirms the duplication count is actually 5, not 2.

3. **YAML predicate grammar doc↔runtime parity** — `boolean-expr.ts` explicitly documents the grammar in header comments (lines 1-24) including the object vs. string form, the `after:` escape hatch for prose timing, and the related task IDs. The parser enforces the grammar (lines 117-169). Error messages are clear (`"unable to parse predicate string; expected '<field> <op> <value>' with op in [==, !=, in, not_in]"` line 147). BUT the runtime enforces the grammar ONLY when a YAML is fed through `parseWhenField()` — there is no static validator that rejects a malformed YAML at load time. Quiet acceptance of a malformed `when:` depends on the runner calling `parseWhenField()` vs treating the field as an arbitrary string. Iter 3 already flagged CP-004 in `complete_confirm.yaml:1099` as an instance of a prose `when:` that escaped the grammar. The parser is sound; the governance is inconsistent.

4. **File/function length hygiene** — LOC check on heavily-refactored files:
   - `reconsolidation.ts`: **1,147 lines** (largest). `executeConflict()` spans roughly 100 lines (484-583). Two near-identical transaction blocks (lines 507-550 and 558-600+): both do the same currentRow+archived+scope+predecessor checks then an UPDATE+changes guard. Prime candidate for extraction into `runAtomicReconsolidationTxn(op: 'deprecate' | 'content-update', …)`.
   - `hook-state.ts`: **864 lines**.
   - `reconsolidation-bridge.ts`: **863 lines**.
   - `session-stop.ts`: **646 lines**. Main handler function is very long (runs from ~250 to ~520).
   - `graph-lifecycle.ts`: **679 lines**.
   - `post-insert.ts`: **405 lines**, BUT `runPostInsertEnrichment()` alone is **~243 lines (133-376)** handling 5 enrichment domains (causal links, entity extraction, summaries, entity linking, graph lifecycle). Each domain uses identical boilerplate: `if enabled { try { … enrichmentStatus.domain = { status: 'ran' } } catch { enrichmentStatus.domain = { status: 'failed', reason: '…_exception', warnings: [message] } } } else { enrichmentStatus.domain = makeSkipped('feature_disabled') }`. Five near-copies of the same try/catch shape. Extractable into a `runEnrichmentStep(config)` helper.

5. **`description.json` drift auto-repair** — **confirmed ZERO auto-repair mechanism exists.** Evidence:
   - `.git/hooks/` contains only `.sample` files; no active pre-commit, post-commit, pre-push, or post-merge hook.
   - No `.husky/`, `.githooks/`, or `lint-staged` config anywhere.
   - `grep -n 'lastUpdated' .opencode/skill/system-spec-kit/scripts/dist/memory/*.js` returns **zero matches** across all 9 dist scripts (`ast-parser.js`, `backfill-frontmatter.js`, `cleanup-orphaned-vectors.js`, `generate-context.js`, `migrate-trigger-phrase-residual.js`, `rank-memories.js`, `rebuild-auto-entities.js`, `reindex-embeddings.js`, `validate-memory-quality.js`). `generate-context.js` refreshes `graph-metadata.json` (per comments) but never touches `description.json.lastUpdated`.
   - The drift observed in R3-P2-001 (description.json `lastUpdated: 2026-04-16T21:45:00Z`, graph-metadata.json `last_save_at: 2026-04-17T11:20:00Z`) is the predictable outcome of an infrastructure gap, not a one-off hygiene lapse.

6. **Type exhaustiveness** — `grep -n 'satisfies never|exhaustiveCheck|assertNever'` returns **zero hits** across the entire `mcp_server` directory. No compile-time exhaustiveness-checking pattern is used anywhere. Typed unions that benefit from it:
   - `OnIndexSkipReason` (4 states): consumed via `reasonMap: Record<string, EnrichmentSkipReason>` object lookup at `post-insert.ts:302-306` with a 3-entry map + a manual branch for `onindex_exception`. If a 5th reason is added, the map stays silent — no compile error, runtime falls through to `reasonMap[key] ?? 'graph_lifecycle_no_op'` which is semantically wrong for a new distinct reason.
   - `TrustState` / `SharedPayloadTrustState`: iteration 1 asserted 4-state switches were exhaustive, but the codebase uses `trustStateFromGraphState` / `trustStateFromStructuralStatus` / `trustStateFromCache` producers and consumes the state via conditional branches, NOT `switch` statements. No explicit `switch (trustState)` exists in the reviewed call sites; consumers use if-else chains that silently accept unknown trust-state values by falling through.
   - `ConflictAbortStatus` (2 states): consumed via single assignment; any new state needs manual propagation through `buildConflictAbortResult`.
   - `EnrichmentStepStatus` (5 states): consumed via `.status === 'ran'` / `.status === 'failed'` / `.status === 'partial'` string compares. Adding a new status is silently accepted.

7. **Magic numbers and strings** —
   - `[EVIDENCE:]` marker format: **zero code constants defined anywhere in `mcp_server/`** (1 hit total across the mcp_server, in a README). The marker is pure convention enforced only by the evidence-citation pattern in docs and checklist.md. R3-P2-002 documented the 170/179 malformed closures; with no code-level marker constant, there is no parser or linter that can statically validate the format.
   - `ASSISTIVE_RECOMMENDATION_THRESHOLD` rename audit: `grep -n` finds **zero residual references to the old name** `ASSISTIVE_AUTO_MERGE_THRESHOLD` across the codebase. All three hits for the old name are inside Phase 016 documentation (`phase-4-quick-wins-summary.md` x2, `checklist.md` x1) where they serve as historical context in "renamed from X to Y" text. Runtime code has fully migrated. **T-RCB-02 rename is clean.**
   - Trigger vocab lists in `gate-3-classifier.ts`: centralized via `FILE_WRITE_TRIGGERS`, `MEMORY_SAVE_TRIGGERS`, `RESUME_TRIGGERS`, `READ_ONLY_DISQUALIFIERS` exports + `GATE_3_VOCABULARY` aggregate. Strong central definition.

Adversarial self-check: P0 candidate screening produced zero hits (no maintainability gap destroys correctness). Gate-relevant P1 candidates: (a) scope-normalization duplication, (b) description.json auto-repair infrastructure gap. I ran a compact skeptic pass on each:
- Scope duplication Skeptic: "Is the duplication actually harmful or just ugly?" — Evidence for harm: 5 divergent signatures (`unknown`, `string | undefined`, `string | null`), inconsistent empty-string handling semantics, and the canonical `normalizeScopeContext` exists as the Schelling point but is unevenly adopted. A future drift in the canonical version would silently desync from the four reinvented versions. Harm is real. **Kept P1.**
- Auto-repair Skeptic: "Is this really Phase 017's problem, or was it ever scoped?" — Evidence: R3-P2-001 flagged the drift; the drift was predicted in closing-pass-notes in the same spec folder. Phase 016 explicitly targeted canonical-packet hygiene. An infrastructure gap that makes R3-P2-001 *structurally inevitable* is a Phase 017 scope issue, not a forever-backlog item. **Kept P1.**

## Findings

### P0 Findings

None. No maintainability gap rises to P0. Every concern is a drift/duplication/missing-pattern issue with no immediate correctness or security impact.

### P1 Findings

1. **Scope-normalization helper duplicated in 5 locations with divergent signatures; canonical `normalizeScopeContext` is under-adopted** — `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:228-234`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:198-204`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:348-352`, `.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:440-444`, `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:155-162` — The canonical `normalizeScopeContext(input)` (scope-governance.ts:155) is the intended Schelling point for scope-identifier trimming and is correctly consumed by `checkpoints.ts`, `memory-search.ts`, and `scope-governance.ts`. But four OTHER callers reinvented local versions with subtly divergent signatures: `normalizeScopeValue(value: unknown): string | null` in reconsolidation-bridge and lineage-state (identical implementations); `normalizeScopeMatchValue(value?: string | null): string | null` in types.ts (exported); and an inline closure `const normalizeScopeValue = (value?: string) => …` inside preflight.ts's `checkForDuplicates`. All five have the same core semantic (typeof string-check + trim + empty-to-null collapse) but their input-type annotations differ (`unknown`, `string | null`, `string | undefined`) which means a future change to one does not propagate. Iteration 2 already confirmed the bridge and types.ts versions are semantically equivalent (symmetric normalization is the reason R1-P1-001 empty-string exposure was narrowed). The P1 concern here is the **sustainability** of the symmetry — any future author who modifies one of the five copies without finding the others will re-introduce R1-P1-001-class drift. Classified P1 because it is a latent correctness landmine (sync drift) wearing maintainability clothing; the canonical helper exists, so the fix is collapse-to-one-import rather than a new design.

    ```json
    {
      "type": "claim-adjudication",
      "claim": "The scope-normalization helper is duplicated in 5 locations with divergent type signatures and empty-string handling, even though the canonical `normalizeScopeContext` exists in scope-governance.ts; the duplication is a latent drift surface that could silently re-introduce R1-P1-001-class empty-string exposure if one copy is modified and the others are not.",
      "evidenceRefs": [
        ".opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:228-234",
        ".opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:198-204",
        ".opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:348-352",
        ".opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:440-444",
        ".opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:155-162"
      ],
      "counterevidenceSought": "Checked whether the divergent signatures are intentional — they are not; types.ts and reconsolidation-bridge agree semantically per iter 2 R2-P1-001 adjudication. Checked whether the canonical normalizeScopeContext handles the unknown-input case — it does (via normalizeId helper that gates on typeof 'string'), so reconsolidation-bridge's `unknown` signature could be satisfied by the canonical form.",
      "alternativeExplanation": "Author may have chosen local-file helpers to avoid import cycles between save/handlers and lib/governance. However, handlers/save/dedup.ts already imports normalizeScopeContext transitively via memory-search.ts, so no cycle blocks adoption.",
      "finalSeverity": "P1",
      "confidence": 0.85,
      "downgradeTrigger": "If a future refactor collapses the 4 local copies to imports of normalizeScopeContext OR if a README explains the intentional divergence with rationale, this becomes P2 polish."
    }
    ```

2. **`description.json.lastUpdated` has no auto-refresh mechanism; the drift observed in R3-P2-001 is the predictable outcome of an infrastructure gap, not a one-off lapse** — `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` (grep: zero `lastUpdated` references), `.git/hooks/` (all `.sample`, zero active), `.opencode/skill/system-spec-kit/scripts/dist/memory/*.js` (zero hits across all 9 dist scripts) — R3-P2-001 documented the drift between `description.json.lastUpdated: 2026-04-16T21:45:00Z` and `graph-metadata.json.last_save_at: 2026-04-17T11:20:00Z`. This iteration confirms the **root cause**: no code path in `generate-context.js` writes `lastUpdated`, no git hook refreshes either file on commit, and the `.githooks`/`.husky` directories do not exist. The drift is guaranteed to recur every time a spec folder's code lands but the corresponding `/memory:save` is not explicitly run. Because `description.json` is cited in `graph-metadata.json.authoritativeSources` and is consumed by `memory_search` / `skill_advisor` / continuity recovery flows, any consumer that reads `description.json` as its source-of-truth for "current folder state" gets a stale snapshot whenever the auto-save cadence falls behind commit cadence. Classified P1 because this is the direct maintainability root cause of an already-flagged P2 traceability finding AND because the fix requires new infrastructure (a post-commit hook or a `lastUpdated` writer in `generate-context.js`), not just a one-line docs tweak. Reinforces the R3 theme that canonical-save-surface hygiene is inconsistent.

    ```json
    {
      "type": "claim-adjudication",
      "claim": "description.json.lastUpdated has no automated refresh path: generate-context.js never writes it, no git pre-commit or post-commit hook touches it, and there is no husky/lint-staged/nightly job. The drift R3-P2-001 observed is structurally inevitable rather than a one-off hygiene failure.",
      "evidenceRefs": [
        ".opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js (zero lastUpdated hits)",
        ".opencode/skill/system-spec-kit/scripts/dist/memory/*.js (zero lastUpdated hits across 9 scripts)",
        ".git/hooks/ (all 14 entries are .sample; zero active)",
        "no .husky/ or .githooks/ directory",
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review/description.json:37 (stale lastUpdated)",
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review/graph-metadata.json:162 (fresh last_save_at)"
      ],
      "counterevidenceSought": "Checked whether generate-context.js has a lastUpdated-writing helper under a different name (e.g., refreshDescriptionMetadata) — no such helper exists; the file is 571 lines and none of its functions reference the string 'lastUpdated'. Checked whether /memory:save is documented as the exclusive path for keeping description.json fresh — CLAUDE.md §3 says 'description.json and graph-metadata.json are auto-generated/refreshed by generate-context.js during canonical saves' but this is only accurate for graph-metadata.json, not description.json.",
      "alternativeExplanation": "The team may consider description.json.lastUpdated a manual-edit field (like a README). However, description.json is a machine-parsed canonical surface cited in graph-metadata.json.authoritativeSources — treating it as manually maintained while citing it as authoritative is contradictory. No documented policy in CLAUDE.md or system-spec-kit SKILL.md declares manual-maintenance as the intent.",
      "finalSeverity": "P1",
      "confidence": 0.90,
      "downgradeTrigger": "If generate-context.js is updated to refresh lastUpdated during canonical saves, OR if a git post-commit hook is added, OR if CLAUDE.md is amended to state description.json.lastUpdated is manually maintained, this resolves."
    }
    ```

### P2 Findings

1. **`runPostInsertEnrichment()` is a 243-line god function with 5 near-identical try/catch enrichment blocks** — `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:133-376` — The function orchestrates 5 enrichment domains (causal links, entity extraction, summaries, entity linking, graph lifecycle). Each domain follows the same pattern:
    ```
    if (isXEnabled()) {
      try {
        const result = runX(...);
        // domain-specific success logging
        enrichmentStatus.X = { status: 'ran' };
      } catch (err: unknown) {
        const message = toErrorMessage(err);
        console.warn(`[memory-save] X failed: ${message}`);
        enrichmentStatus.X = { status: 'failed', reason: '<X>_exception', warnings: [message] };
      }
    } else {
      enrichmentStatus.X = makeSkipped('feature_disabled');
    }
    ```
   Five copies of this structure, each ~30-50 lines. The causal-links branch is more complex (partial status handling at lines 158-170); graph-lifecycle branch has typed `OnIndexSkipReason` plumbing (302-317). Extractable into `runEnrichmentStep(name, isEnabled, runner, options)` with per-domain hooks. The rollup at lines 344-369 then operates on a uniform `enrichmentStatus` map. Reduces function length to ~80 lines and makes adding a 6th domain a 1-line change. Classified P2 because the function works correctly and is well-commented; this is pure sustainability.

2. **No compile-time exhaustiveness checks (`satisfies never` / `assertNever`) anywhere in `mcp_server/`** — `.opencode/skill/system-spec-kit/mcp_server/` (grep: zero hits for `satisfies never`, `exhaustiveCheck`, `assertNever`) — Typed unions like `OnIndexSkipReason` (4 states), `EnrichmentStepStatus` (5 states), `EnrichmentSkipReason` (10 states), `EnrichmentFailureReason` (7 states), `ConflictAbortStatus` (2 states), `HookStateLoadFailureReason` (7 states), `SharedPayloadTrustState`, and `TriggerCategory` benefit from compile-time exhaustiveness when consumed. Consumers of these unions use string-compare (`.status === 'ran'`) or object-lookup (`reasonMap: Record<string, …>`) instead of `switch` with `default: const _exhaustive: never = value; throw …`. Concrete impact at `post-insert.ts:302-306`: the `reasonMap: Record<string, EnrichmentSkipReason>` has 3 entries (`graph_refresh_disabled`, `entity_linking_disabled`, `empty_content`) but `OnIndexSkipReason` has 4 members. The 4th (`onindex_exception`) is handled manually at lines 307-313 with a comment. If a 5th `OnIndexSkipReason` is added, the map silently falls through to `reasonMap[key] ?? 'graph_lifecycle_no_op'` — the new distinct reason is collapsed to a generic fallback with no compile error. Adding `const _exhaustive: never = indexResult.skipReason` inside the else branch would catch this at compile time. Classified P2 because current behavior is defensible (fallback is semantically reasonable); the gap is a preventable class of future bugs, not a current one.

3. **`executeConflict()` has two near-duplicate transaction blocks (deprecate-path at lines 507-550 and content-update-path at 558-600+) sharing identical precondition checks** — `.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:507-600` — Both transaction blocks perform the same 3 precondition checks in the same order: (a) re-fetch `currentRow` + archived check, (b) `hasScopeRetagged(predecessorSnapshot, currentRow)` → abort `scope_retagged`, (c) `hasPredecessorChanged(predecessorSnapshot, currentRow)` → abort `conflict_stale_predecessor`. Then they diverge: one does UPDATE-to-deprecated+insertSupersedesEdge, the other does UPDATE-content+optional-embedding-update. Both end with the same `if (updateResult.changes === 0)` guard → abort `conflict_stale_predecessor`. Extractable as `runAtomicReconsolidationTxn(predecessorSnapshot, op: 'deprecate' | 'content-update', ops)` with a shared preamble and a branch-specific body. Current duplication risks one branch fixing a predecessor-check bug while the other stays broken. Classified P2 because the code is correct today; the duplication is a preventable drift surface. Reinforces finding #1 (scope-normalization) as part of a theme: **R1-P1-001-style near-miss patterns exist as maintainability debt**.

4. **`importance_tier != 'deprecated'` is the de facto deprecation predicate, repeated inline in 6+ SQL statements without a shared symbol or helper** — `.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:527, 580` (sampled; additional instances present) — The deprecation contract is encoded as the string literal `'deprecated'` compared against `importance_tier` inline. No exported constant (e.g. `DEPRECATED_TIER = 'deprecated' as const`) centralizes the value; no helper (e.g. `isLiveRow(row)` / `isDeprecatedRow(row)`) captures the predicate. The `isArchivedRow(baselineRow)` helper exists at line 494 and is used (checks archived status separately), but there is no equivalent `isLiveRow()` or `importanceTier.isDeprecated()` abstraction. If the deprecation vocabulary is extended (e.g. `'deprecated' | 'superseded' | 'tombstoned'`), every inline comparison must be hunted individually. Classified P2 — current behavior is correct; the gap is a search-and-replace brittleness. Recommended fix: extract a `LIVE_ROW_CLAUSE` SQL fragment constant or an `isLiveTier(tier: string)` predicate.

## Traceability Checks

- **Code clarity on new hardening layers**: partial pass — boolean-expr.ts and gate-3-classifier.ts are exemplary; long-lived files (reconsolidation.ts) have inline code but under-extracted shared vocabulary.
- **Duplication check (scope normalization)**: fail — 5 divergent copies vs. the canonical `normalizeScopeContext`.
- **YAML grammar doc↔runtime parity**: partial — `boolean-expr.ts` parser is sound; governance is inconsistent (CP-004-class escape hatches persist).
- **File/function length hygiene**: partial — `runPostInsertEnrichment()` at ~243 lines, `executeConflict()` at ~100 lines with duplicate transaction blocks.
- **description.json auto-repair**: fail — zero infrastructure; git hooks inactive; `generate-context.js` never writes `lastUpdated`.
- **Type exhaustiveness**: fail — zero `satisfies never`/`assertNever` usage; typed unions consumed via object-lookup + string-compare.
- **Magic strings (evidence marker, threshold rename)**: partial — ASSISTIVE_RECOMMENDATION_THRESHOLD rename is clean; `[EVIDENCE:]` has no code constant; gate-3 vocabulary is well-centralized.

## Confirmed-Clean Surfaces

- `boolean-expr.ts` — exceptional documentation and structural clarity; grammar self-documenting; prose-bleed rationale explained.
- `gate-3-classifier.ts` — well-structured 5-section module; trigger vocabularies centrally exported; decision-order algorithm explicitly documented in comment lines 168-179; `GATE_3_SCHEMA_VERSION` export permits forward-compatible JSON snapshot.
- `HookStateSchema` co-location — schema, types (`HookState`, `PersistedHookState`), and migration gates (`CURRENT_HOOK_STATE_SCHEMA_VERSION`) are all in `hook-state.ts`; no cross-file type↔schema drift.
- **`ASSISTIVE_RECOMMENDATION_THRESHOLD` rename cleanness** — grep for old name `ASSISTIVE_AUTO_MERGE_THRESHOLD` returns 3 hits total, all inside Phase 016 historical documentation (`phase-4-quick-wins-summary.md` x2, `checklist.md` x1). Runtime code has zero residual references. T-RCB-02 rename is atomically complete.
- `OnIndexSkipReason` enum definition — well-docstring'd at `graph-lifecycle.ts:123-132` with rationale for typed vs boolean shape.
- `reasonMap` pattern in `session-prime.ts:123-136` — uses rejection-reason `Record<string, string>` with explicit fallback; well-contained maintainability pattern.

## Confirmed Already-Known (cross-reference to iterations 1 + 2 + 3)

- **R1-P1-001** (empty-string scope CAS bypass) — finding #1 this iteration (scope normalization duplication) IS the maintainability-side root cause of how R1-P1-001 became possible in the first place. 5 disconnected normalizers = 5 chances for the empty-string-to-null collapse to drift.
- **R3-P2-001** (description.json drift) — finding #2 this iteration (no auto-repair infrastructure) IS the maintainability-side root cause. The traceability surface observed the drift; this iteration identifies the missing mechanism.
- **R1-P1-002** (partial_causal_link_unresolved retry pairing) — out of scope; carried forward.
- **R2-P1-001** (session_resume cross-session leakage) — out of scope; carried forward.
- **R2-P1-002** (gate-3 unicode bypass) — reinforced indirectly: gate-3-classifier.ts is well-structured on the vocabulary axis but the character-set contract gap observed in iter 2 + iter 3 is not a clarity problem; it is a missing scope. No new finding here.
- **CP-004** (complete_confirm.yaml untyped DSL) — noted in track 3 above; boolean-expr.ts's parser is sound, the governance is inconsistent.

## Convergence Signal

- Novel findings this iteration: 6 (2 P1, 4 P2)
- Severity-weighted new findings: (2 × 5.0) + (4 × 1.0) = 14.0
- Cumulative severity-weighted total (iter 1 + iter 2 + iter 3 + iter 4): 13.0 + 13.0 + 13.0 + 14.0 = 53.0
- newFindingsRatio = 14.0 / 53.0 = **0.264**
- No P0 override (no new P0 this iteration).
- Convergence trend: iter 1 (1.00) → iter 2 (0.50) → iter 3 (0.333) → iter 4 (0.264). Steady deceleration but not yet crossing 0.10. Maintainability surfaced **more** findings than predicted (6 vs the forecasted "≤ 0.10 if surfacing P2s only"), because 2 findings promoted to P1 on the "latent correctness landmine" argument. Iteration 5 cross-reference/synthesis is likely the point where ratio drops below threshold as overlaps consolidate.
- Overlap with prior iterations: findings #1 and #2 are net-new observations that ALSO serve as maintainability-side root-cause explanations for prior findings (R1-P1-001 and R3-P2-001 respectively); they are not rediscoveries but reinforcing evidence of the sustainability axis.
- ruledOut this iteration: ["ASSISTIVE_RECOMMENDATION_THRESHOLD has stale old-name references in runtime code (clean)", "gate-3-classifier trigger vocab is not centralized (pass — well-centralized)", "HookStateSchema co-location with type (pass)", "boolean-expr.ts grammar documentation (pass)", "reasonMap pattern in session-prime.ts (pass)", "sanitizeRecoveredPayload vs escapeProvenanceField duplication (not re-reviewed; iter 2 R2-P2-001 addressed from security angle)"]

## Next Iteration Angle

Iteration 5 should pivot to **CROSS-REFERENCE / SYNTHESIS** (as planned):

- Consolidate root-cause clusters:
  - **Cluster A (Scope-normalization drift)**: R1-P1-001 + R4-P1-001. Five normalizers + the empty-string bypass that the symmetric-normalizer partially plugged. Shared root: canonical helper under-adopted. Ask in synthesis: should R4-P1-001 upgrade R1-P1-001 back to P1 from the iter 2 P2 downgrade? (My read: no; iter 2's narrowing of R1-P1-001 stands, but the maintainability finding proves the structural risk remains.)
  - **Cluster B (Canonical-save-surface hygiene)**: R3-P1-002 + R3-P2-001 + R3-P2-002 + R4-P1-002. Four findings all pointing at "the canonical-save pipeline is not self-healing." Candidate for a single synthesized P1 recommendation: add lastUpdated writer to generate-context.js + add packet-metadata backfill for research folders + add evidence-marker lint.
  - **Cluster C (Ascii-only sanitization theme)**: R2-P1-002 + R2-P2-001 + R3-P2-003-supporting-evidence. Already flagged.
- Revisit the iter 2 downgrade recommendation for R1-P1-001.
- Assess whether any P1 should upgrade to P0 given cumulative evidence (my preliminary read: no; all P1s remain P1).
- Revisit R3-P1-001 (CP-002 staleness in closing-pass-notes): should the audit doc be amended, or is it a read-only historical snapshot?

Iteration 6 should do a **RECOVERY / final sweep**:

- Re-check any confirmed-clean surface from iter 1-4 to see if synthesis cross-reference surfaces anything missed.
- Verify no P0 was hidden in the "no new P0" claim across 5 iterations.

Iteration 7 is the **synthesis pass** producing the final report.

## Assessment

- Maintainability of Phase 017 remediation is **asymmetric**: new hardening layers (boolean-expr.ts, gate-3-classifier.ts, HookStateSchema) are well-documented and well-structured. Long-lived files that absorbed heavy refactoring (reconsolidation.ts, post-insert.ts, session-stop.ts) accumulated god-function and duplication drift.
- The two P1 findings are each the **maintainability-side root cause** of a previously-flagged finding:
  - Finding #1 (5-way scope-normalizer duplication) is the structural enabler of R1-P1-001-class drift.
  - Finding #2 (no description.json auto-repair infrastructure) is the structural enabler of R3-P2-001 drift.
- The four P2 findings (god function, missing exhaustiveness checks, CAS-transaction duplication, deprecation-string magic literal) are sustainability debt. Collectively they make the codebase's "one-line change" budget smaller over time but do not threaten current correctness.
- The exhaustiveness-check gap (P2 #2) is the most impactful of the P2s because it converts every future union-extension into a silent runtime-fallback risk rather than a compile-time error. Iteration 5 should consider whether to upgrade this to P1 given the number of unions it would cover (7+).
- Cumulative theme across iter 1-4: **"Phase 017 closed the immediate correctness/security holes; the structural patterns that allowed those holes to emerge are only partially addressed."** Synthesis in iter 5 should surface this explicitly.
- No new P0 findings. newFindingsRatio 0.264 — continuing decreasing trend, not yet converged.
