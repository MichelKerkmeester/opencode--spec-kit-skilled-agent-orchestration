# Iteration 15: Build-Config Validation + F40 Vocabulary Unification Mapping

## Focus

Two-track iteration:

1. **Build-config validation of iter-14's delete plan.** Inspect `package.json`, `vitest.config.ts`, `tsconfig.json`, schema barrels, and CI/shell scripts for any references to promotion modules that would silently break or surface new delete-plan rows.
2. **Second-order finding (chosen: F40 vocabulary unification).** Iter-3 cataloged 5 competing state vocabularies (V1-V5) and 4 surface divergences but stopped at "this is structural, not string-replace." Iter-15 closes that gap with a concrete unification mapping table: which name wins per axis, migration cost, and the file:line touchpoints.

F40 was chosen over F41 (HMAC rotation edge case) and F43 (instrumentation namespace design) because: (a) F40 is the highest-leverage refactor lever for the remaining advisor work — it gates 4 handler surfaces and a 333-line startup-brief; (b) iter-3 already has the catalog, so this iteration delivers the actionable mapping rather than re-discovery; (c) F41 and F43 can be follow-up packets once F40 lands.

## Findings

### F68. Build-config validation: iter-14 delete plan is **almost complete** — one new row + two cross-checks

**Validated clean (no references to promotion modules):**

- `mcp_server/package.json:24-32` — test scripts (`test`, `test:core`, `test:file-watcher`, `test:hydra:phase1`) and bench scripts (`bench:safety`, `bench:watcher`) are **path-stable**. The `bench:safety` script literally hardcodes `node dist/skill-advisor/bench/safety-bench.js` — that file imports `runShadowCycle` from `../lib/promotion/shadow-cycle.js` (verified: `safety-bench.ts:9-10`). After delete, this script will fail at runtime with a `MODULE_NOT_FOUND`. **Action: remove the `bench:safety` script row from `package.json` as part of the delete plan.** [SOURCE: `mcp_server/package.json:30-31` + `mcp_server/skill-advisor/bench/safety-bench.ts:9-10`]
- `mcp_server/tsconfig.json:13-14,20-29` — only path mapping is `@spec-kit/shared/*` → `../shared/*`. No path mapping references `lib/promotion/*` or `schemas/promotion-cycle.ts`. The `include`/`exclude` globs use `**/*.ts` and exclude `node_modules`/`dist`/specific test files; the deleted promotion files are silently dropped from the include set without surface impact. [SOURCE: `mcp_server/tsconfig.json:13-29`]
- `mcp_server/vitest.config.ts:17-26` — `include` glob `mcp_server/skill-advisor/tests/**/*.{vitest,test}.ts` will silently stop matching `tests/promotion/promotion-gates.vitest.ts` after delete (no manual config update needed; vitest globs are file-system driven). The `exclude` list does NOT mention promotion. **Clean drop.** [SOURCE: `mcp_server/vitest.config.ts:17-26`]
- `mcp_server/skill-advisor/schemas/` — barrel-export check: there is no `index.ts` aggregator in this directory (verified: `ls schemas/` shows 5 `.ts` files + a `README.md`, no `index.ts`). So `promotion-cycle.ts` is imported by direct path (`../schemas/promotion-cycle.js` from bench files), not via a barrel. After delete, the only consumers are the 3 bench files already on the delete list. [SOURCE: `ls mcp_server/skill-advisor/schemas/` returned `advisor-tool-schemas.ts daemon-status.ts generation-metadata.ts promotion-cycle.ts skill-derived-v2.ts README.md tool-input-schemas.ts` — note `tool-input-schemas.ts` is the closest thing to a barrel, but it has zero `promotion` token matches]
- `mcp_server/schemas/tool-input-schemas.ts` — grep `promotion` returned zero matches. **Clean.** [SOURCE: `grep -n "promotion\|Promotion" mcp_server/schemas/tool-input-schemas.ts → 0 matches`]
- `.github/workflows/` — directory does not exist. No CI workflow files. The repo has no GitHub Actions surface that would reference promotion test/bench scripts. [SOURCE: `find .github/workflows -name "*.yml" -o -name "*.yaml" → 0 results`]
- `scripts/` shell scripts (20 files) — grep `promotion\|promote` against the entire `scripts/` tree returned zero matches in `.sh` files. The only hits are documentary references inside `scripts/optimizer/promote.cjs` and `scripts/optimizer/optimizer-manifest.json` — both of which are an **unrelated subsystem**, see F69. [SOURCE: `grep -rln "promotion\|promote" .opencode/skill/system-spec-kit/scripts/`]

**New delete-plan row required:**

- **`mcp_server/package.json:30` — remove the `"bench:safety": "node dist/skill-advisor/bench/safety-bench.js"` script line.** Without this, `npm run bench:safety` will exit non-zero post-delete with a confusing `MODULE_NOT_FOUND` referencing the already-deleted `lib/promotion/shadow-cycle.js`. **Severity: P1** (broken script in a published package.json).

### F69. False-positive: `scripts/optimizer/promote.cjs` is an UNRELATED subsystem and stays

`scripts/optimizer/promote.cjs` is an "Advisory Promotion Gate (T007)" for the **routing/ranking optimizer** (file header: "Evaluates candidates against baseline and produces advisory-only promotion reports"). It uses different vocabulary (`PROMOTION_PREREQUISITES`, `PROMOTION_DECISIONS = {ADVISORY_ACCEPT, ADVISORY_REJECT, BLOCKED}`, an audit dir under `scripts/optimizer/audit/promotion-reports`) and is governed by `optimizer-manifest.json:129` (`"promotionMode": "advisory-only"`).

**Cross-check evidence this is NOT the skill-advisor promotion subsystem:**

- Different schema shape: no `PromotionCycle`, `runShadowCycle`, `gate-bundle`, `weight-delta-cap` tokens.
- Different decision enum: `'advisory-accept'|'advisory-reject'|'blocked'` vs skill-advisor's `Promote|Reject|Quarantine`-style cycle.
- Different audit directory: `scripts/optimizer/audit/promotion-reports` vs skill-advisor's bench reports under `mcp_server/skill-advisor/bench/`.
- Different language: `.cjs` (CommonJS, scripts workspace) vs skill-advisor's ESM TypeScript.
- The "promotion" word here is borrowed terminology from the routing-evaluator literature; the subsystems do not import each other.

**Verdict: leave `scripts/optimizer/promote.cjs` and `optimizer-manifest.json:129,136` untouched.** Document the namespace overlap as a future-rename candidate (low priority — the optimizer subsystem is internally consistent and renaming would invalidate audit history). [SOURCE: `scripts/optimizer/promote.cjs:1-40` + `scripts/optimizer/optimizer-manifest.json:129,136`]

### F70. STOP_READY signal: delete plan is now complete with 1 new row

After F68 + F69, the iter-14 delete plan is ratified with **one addition** (the `package.json` `bench:safety` script row). No other build-config surface produces silent failure. The cross-packet preflight from iter-14 + this build-config validation closes the iter-15 ratification objective. **Recommend STOP_READY.**

Updated delete-plan rollup (iter-14 + F68):

| Layer | File | LOC | Change |
| --- | --- | --- | --- |
| Code | `lib/promotion/gate-bundle.ts` | 184 | DELETE |
| Code | `lib/promotion/rollback.ts` | 87 | DELETE |
| Code | `lib/promotion/semantic-lock.ts` | 39 | DELETE |
| Code | `lib/promotion/shadow-cycle.ts` | 203 | DELETE |
| Code | `lib/promotion/two-cycle-requirement.ts` | 50 | DELETE |
| Code | `lib/promotion/weight-delta-cap.ts` | 72 | DELETE |
| Code | `tests/promotion/promotion-gates.vitest.ts` | 316 | DELETE |
| Code | `schemas/promotion-cycle.ts` | 82 | DELETE |
| Code | `bench/corpus-bench.ts` | (partial) | EDIT (remove promotion imports) or DELETE |
| Code | `bench/holdout-bench.ts` | (partial) | EDIT or DELETE |
| Code | `bench/safety-bench.ts` | full file | DELETE (promotion-only) |
| Build | **`mcp_server/package.json:30` `bench:safety` script** | 1 line | **REMOVE — F68 NEW** |
| Doc | 12 markdown files in feature_catalog/manual_testing_playbook | various | DELETE or rewrite |

### F71. F40 deep-dive: the 5 vocabularies + a unification mapping table

Iter-3 cataloged the five vocabularies (V1-V5) but explicitly ruled out "single-source fix." This iteration produces the missing **unification mapping** with migration cost and file touchpoints.

**The 5 vocabularies (recap with line citations):**

| ID | Name | Values | Source |
| --- | --- | --- | --- |
| V1 | `GraphFreshness` (ensure-ready) | `'fresh'\|'stale'\|'empty'` | `code-graph/lib/ensure-ready.ts:22` |
| V2 | `GraphFreshness` (ops-hardening) | `'fresh'\|'stale'\|'empty'\|'error'` | `code-graph/lib/ops-hardening.ts:7` |
| V3 | `StartupBriefResult.graphState` | `'ready'\|'stale'\|'empty'\|'missing'` | `code-graph/lib/startup-brief.ts:43` |
| V4 | `StructuralReadiness` (canonical) | `'ready'\|'stale'\|'missing'` | `code-graph/lib/readiness-contract.ts:43` (re-exported) |
| V5 | `SharedPayloadTrustState` (3-val subset) | `'live'\|'stale'\|'absent'` (extended ad-hoc to `'unavailable'` in S2 context.ts) | `code-graph/lib/readiness-contract.ts:103-116` + `handlers/context.ts:224-229` |

**Proposed unification — winners per axis:**

The right move is **NOT to collapse 5 → 1**, but to **explicitly canonicalize each axis** so callers know which vocabulary belongs at which boundary. Three layers:

| Layer | Canonical type | Values | Replaces |
| --- | --- | --- | --- |
| **L1 — Storage / source-of-truth** | `GraphFreshness` (V2 wins) | `'fresh'\|'stale'\|'empty'\|'error'` | V1 (drop `ensure-ready.GraphFreshness`; reuse V2) |
| **L2 — Readiness contract** | `StructuralReadiness` (V4) | `'ready'\|'stale'\|'missing'` | unchanged; already canonical |
| **L3 — Caller-facing trust** | `SharedPayloadTrustState` (V5) **widened** | `'live'\|'stale'\|'absent'\|'unavailable'` | V5 + the ad-hoc `'unavailable'` injection in S2 |

**Why these winners:**

1. **V2 over V1 at L1.** V2 is a strict superset of V1 (`fresh|stale|empty + 'error'`). The `'error'` case is real (`ops-hardening.ts:7` exposes it because storage failures must be observable). Dropping V1 in favor of V2 is a one-line type alias swap in `ensure-ready.ts:22` — but consumers of `ensure-ready.GraphFreshness` (the `assertNever` exhaustiveness check in `readiness-contract.canonicalReadinessFromFreshness`) must add an `'error'` arm. **Migration cost: ~4 sites** (see touchpoint table below).
2. **V3 → V4 + V2 mapping at L2.** `StartupBriefResult.graphState` (V3) duplicates V2's value set with a name change (`fresh→ready`, identical `stale|empty`, plus `missing` for "not queryable"). Canonical: keep V4 for ready-state semantics; fold the `'missing'` distinction (db-not-queryable) into V2's `'error'`. The `'ready'/'fresh'` name-rotation between L1 and L2 is **kept on purpose** — it signals the boundary crossing (storage layer says `'fresh'`, contract layer says `'ready'`).
3. **V5 widened to 4-val at L3.** `handlers/context.ts:224-229` already injects `'unavailable'` ad-hoc. Make it official: extend `SharedPayloadTrustState` to `'live'|'stale'|'absent'|'unavailable'` and update `buildReadinessBlock` to return all four values. This eliminates the silent type-widening and the asymmetry between S2 (uses `'unavailable'`) and S3 (drops trust state on crash).

**Migration touchpoint table — file:line:**

| Step | File | Line(s) | Edit |
| --- | --- | --- | --- |
| 1 | `code-graph/lib/ensure-ready.ts` | `22` | Replace local `GraphFreshness` type with `import type { GraphFreshness } from './ops-hardening.js'` (or move the canonical type to a new `code-graph/lib/types.ts`) |
| 2 | `code-graph/lib/readiness-contract.ts` | (canonicalReadinessFromFreshness branch) | Add `case 'error': return 'missing';` arm to the switch; remove the `assertNever` default-throw risk |
| 3 | `code-graph/lib/startup-brief.ts` | `43,213,240,247` | Map `freshness === 'error'` → `graphState: 'missing'`; remove the duplicate `'missing'` branch at line 247 (now redundant once V2 carries `'error'`) |
| 4 | `code-graph/lib/shared-payload.ts` (or wherever `SharedPayloadTrustState` lives — `lib/context/shared-payload.ts` per `startup-brief.ts:11-16` import) | type def + `buildReadinessBlock` | Widen union to 4 values; emit `'unavailable'` when freshness is `'error'` |
| 5 | `code-graph/handlers/context.ts` | `224-229` | Remove the manual `trustState: 'unavailable' as const` injection (now produced canonically by buildReadinessBlock) |
| 6 | `code-graph/handlers/query.ts` | `623-780` | Add a parallel `'unavailable'` trust-state path on readiness-crash to match S2 (closes S2/S3 asymmetry) |
| 7 | `code-graph/handlers/status.ts` | `35` (the `else` branch in the `reason` string) | Replace V4-vocabulary `'graph is missing'` literal with a switch on the now-unified V2 freshness enum |
| 8 | (gap from iter-3) `code-graph/lib/context/shared-payload.ts` | the `trustStateFromGraphState` helper (imported at `startup-brief.ts:11-16`, NOT `format-highlights.js` as iter-3 noted — **erratum**) | Update mapper to handle the widened 4-val union |

**Migration cost summary:** ~8 file edits, ~30 lines changed, all within `code-graph/`. **No cross-package impact** (the skill-advisor delete in F70 is orthogonal to this refactor — the two can be sequenced in either order). Estimated 2-3 hour packet.

**Risk:** the `assertNever` exhaustiveness check in `readiness-contract.canonicalReadinessFromFreshness` will catch step 2 if the new `'error'` arm is forgotten — TypeScript does the work for us. **Failure mode is loud, not silent.**

**Iter-3 erratum corrected:** the `trustStateFromGraphState` helper is imported from `'../../lib/context/shared-payload.ts'` (per `startup-brief.ts:11-16`), not `'./format-highlights.js'` as iter-3 stated. The latter file does not exist under `code-graph/lib/`. This was a misread of the import line in iter-3 — corrected here for the future packet. [SOURCE: `code-graph/lib/startup-brief.ts:11-16` + `find code-graph/lib -name "format-highlights*" → 0 results`]

## Ruled Out

- **F41 INV-F5-V2 prompt-cache stale-after-rebuild deep-dive.** Deferred. The packet exists (`mcp_server/skill-advisor/lib/prompt-cache.ts`) but the question requires reading the cache key construction logic + the graph-scan trigger points — at least 2 file reads beyond the budget. Will fit better as a focused iter in a follow-up packet on cache invariants.
- **F43 instrumentation namespace design.** Deferred. Would produce a metric-name catalog that is more useful AFTER the F40 unification lands (the metric names should reflect canonical vocabulary). Premature today.
- **Re-running cross-packet preflight.** Iter-14 already produced PASSED preflight. No code changed since. Re-running would burn tool calls without new information.

## Dead Ends

- None this iteration. Both tracks (build-config + F40) produced concrete deliverables.

## Sources Consulted

- `.opencode/skill/system-spec-kit/mcp_server/package.json:1-72` (full read)
- `.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts:1-42` (full read)
- `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json:1-31` (full read)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/` (ls + structural inspection)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/safety-bench.ts:9-10` (promotion import confirmation)
- `.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:1-40` + `optimizer-manifest.json:129,136` (false-positive disambiguation)
- `find .opencode/skill/system-spec-kit/scripts -type f \( -name "*.sh" -o -name "*.yml" \)` (CI surface check — no GitHub Actions)
- `.opencode/specs/.../research/iterations/iteration-003.md:120-320` (V1-V5 catalog reload + erratum source)
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts:11-16,43,213,240,247` (V3 + import-path erratum verification)

## Assessment

- **New information ratio:** 0.55. F68 + F69 + F70 produce a ratified delete plan with 1 new row (the `package.json` bench script). F71 produces the unification mapping table that iter-3 explicitly deferred. F71 is genuinely new structural work; F68/F70 are confirmations + a 1-line addendum; F69 is a false-positive disambiguation that prevents a future regression. Calculation: 4 fully-new findings (F68, F69, F70, F71's mapping table) of 4 = 1.0 raw; discounted to 0.55 because F70 mostly ratifies iter-14 (the new `package.json` row is the only delta), and F71 builds heavily on iter-3's catalog (but the mapping table is genuinely novel). Plus simplicity bonus +0.10 for resolving the iter-3 explicit gap (`format-highlights.js` erratum + `trustStateFromGraphState` correct location).
- **Questions addressed:** RQ-Build-Config-Validation (closed); RQ-08 partial (vocabulary unification mapping); STOP_READY classification.
- **Questions answered:** Build-config validation complete with 1 new delete-plan row (F68); F40 unification mapping closed with 8-step migration plan (F71); iter-3 erratum corrected (F71 footnote).
- **Questions remaining:** F41 prompt-cache stale-after-rebuild race condition (deferred, follow-up packet); F43 instrumentation namespace design (deferred, post-F40-landing).

## Reflection

- **What worked and why:** Reading the actual `package.json` scripts section caught the `bench:safety` line-30 reference — the iter-14 plan's "delete safety-bench.ts (promotion-only)" implicitly required a corresponding `package.json` edit that was never spelled out. Cross-checking the false-positive `scripts/optimizer/promote.cjs` early prevented a 12-doc-file write from being wrongly flagged. The F40 mapping table came together quickly because iter-3 had done the catalog work — the iteration just needed to apply judgment ("V2 wins L1, V4 wins L2, V5 widened wins L3") and trace migration touchpoints.
- **What did not work and why:** Initial assumption that `tool-input-schemas.ts` might be a barrel re-export turned out wrong — it's a Zod input-schema aggregator with zero promotion references. One Read tool call could have been saved by checking `head -5` first to see the file's purpose. Minor inefficiency, not a wrong path.
- **What I would do differently:** When validating delete plans across build configs, start with `package.json scripts` first — it's the most likely surface for hardcoded paths. Then sweep tsconfig/vitest/CI in parallel.

## Recommended Next Focus

**Strong recommendation: STOP_READY.** The delete plan (iter-14 + F68) is now complete with build-config validation done. Iter-15 also produced a usable F40 unification mapping table that is ready for a follow-up packet to actuate.

If iter-16 must run (per remaining budget), allocate it to **synthesis** — reduce iter-1 through iter-15 into a single `research.md` with: (a) the ratified delete plan (one rollup table), (b) the F40 unification 8-step migration, (c) deferred items (F41 prompt-cache race, F43 instrumentation namespace) listed as recommended follow-up packets with one-line scoping for each. **Do NOT** open a new investigation track — the convergence signal is strong (iter-13 → iter-14 → iter-15 each ratified prior decisions; no contradictions surfaced).
