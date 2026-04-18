---
iteration: 9
dimension: recovery-sweep
dispatcher: claude-opus-4.7-1m (manual exec)
branch: main
cwd: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
created_at: 2026-04-17T21:30:00Z
convergence_candidate: true
---

# Iteration 009 — Recovery Sweep

## Scope

Audit files not yet reviewed in iters 1–8 (disk shows only 001–006
exist). Spot-check residual focus files, spec-folder metadata, and
the T-CNS-03 sweep claim. Read-only.

## 1. Coverage reconciliation

Iter 1–6 "Files reviewed" sections aggregated. 38 focus files total.

Covered across iter 1–6:

- caller-context.ts, retry-budget.ts, readiness-contract.ts
- shared-provenance.ts, copilot/compact-cache.ts, copilot/session-prime.ts
- session-resume.ts, context-server.ts:400-430,900-1010
- scripts/core/workflow.ts:1240-1400
- code-graph/scan.ts, status.ts, context.ts, ccc-status.ts, ccc-reindex.ts, ccc-feedback.ts
- scope-governance.ts:140-180 (partial)
- save/types.ts:340-360, save/reconsolidation-bridge.ts:280-340 (partial)
- claude/shared.ts:100-112, gemini/shared.ts:10-16 (re-exports only)
- gate-3-classifier.ts (full), evidence-marker-audit.ts:200-500
- reconsolidation.ts:505-965 (via F3 analysis)
- exhaustiveness.ts (via assertNever cross-ref in iter 4)
- post-insert.ts (via runEnrichmentStep cross-ref)

Unreviewed residual (spot-checked this iter):

- **scripts/memory/backfill-research-metadata.ts** (full)
- **scripts/validation/continuity-freshness.ts** (full)
- **scripts/validation/evidence-marker-lint.ts** (full)
- **scripts/rules/check-normalizer-lint.sh** (full)
- **scripts/spec/validate.sh** (size check only — 40 KB)
- **handlers/code-graph/query.ts** (not opened; 30 KB — deferred)
- **handlers/memory-context.ts** (not opened; 58 KB — deferred)
- **handlers/save/response-builder.ts** (head only, assertNever site confirmed)
- **lib/storage/lineage-state.ts** (size only — 46 KB)
- **lib/validation/preflight.ts** (size only — 28 KB)
- **lib/context/shared-payload.ts** (cross-ref only via iter 4)
- **command/spec_kit/assets/spec_kit_complete_confirm.yaml** (size only — 67 KB)
- **T-CNS-03 sibling description.json timestamps** (all 17 in 026-tree)

True unreviewed coverage ≈ 8/38 (21%) remain end-to-end unread.
Iters 1–6 covered ~79% fully or substantially.

## 2. New findings from uncovered territory

### F1 — P2 — `continuity-freshness.ts` reuses `'invalid_frontmatter'` code discriminant for BOTH `fail` and `warn` statuses

`continuity-freshness.ts:30,141,171` — the `code` union lists `'invalid_frontmatter'` once, but two call sites produce it:

- Line 141 — `buildFail(...)` (triggered by `graphTimestampResult.error`) uses hardcoded `code: 'invalid_frontmatter'` with status `fail` (exit 2)
- Line 171 — `buildWarn('invalid_frontmatter', ...)` (triggered by `parseError` from `readContinuityTimestamp`) with status `warn` (exit 1 under --strict)

A JSON consumer that only keys off `result.code` cannot distinguish "graph-metadata.json unreadable (fail)" from "implementation-summary frontmatter malformed (warn)". Both are different remediation paths. Severity P2 — surfaces in validate.sh aggregated reporting where `code` is the machine-readable discriminator.

Recommended: rename the `buildFail` case to `'invalid_graph_metadata'` or split the union.

### F2 — P1 — T-CNS-03 "16-folder sibling sweep" was NOT uniform; timestamps bifurcate into two batches separated by 1h03m

The prior iters and closing-pass claimed T-CNS-03 refreshed all 16 026-tree sibling `description.json.lastUpdated` to a uniform value. Direct inspection shows a **split sweep**:

- Batch A (6 folders at `2026-04-17T14:42:34.216Z..302Z`): `011`, `012`, `014`, `015`, `016`, `017`
- Batch B (11 folders at `2026-04-17T15:45:19.000Z`): `001`, `002`, `003`, `004`, `005`, `006`, `007`, `008`, `009`, `010`, `013`

The 1h03m gap indicates two separate runs. The `.000Z` truncation on Batch B suggests a manual `touch`-style rewrite (most JSON writers emit millisecond precision; `.000Z` is the signature of `toISOString()` from a `Date` constructed from a seconds-only input or from `mtime.setMilliseconds(0)`). Batch A's microsecond-variant timestamps look like natural `new Date().toISOString()` bursts from the canonical-save script.

Impact: the claim of a uniform T-CNS-03 sweep is inaccurate in method (two passes) and provenance (Batch B appears manually backfilled). Does NOT necessarily indicate data loss — both batches ARE fresh — but the closing-pass statement conflicts with disk truth. Traceability regression.

Severity P1 (traceability/provenance) because the closing-pass/changelog text names T-CNS-03 as a single coherent sweep; the disk evidence contradicts it, and future `/spec_kit:resume` on a sibling folder may misread which commit actually touched the file.

### F3 — P2 — 017's description.json stub is NOT unique; at least 6 sibling 026-tree folders have description.json < 550 bytes

Iter 5 flagged the meta-irony of 017's own `description.json` being a 556-byte stub. Direct size inspection of all 17 026-tree siblings shows the stub pattern is WIDESPREAD:

- `008-cleanup-and-audit/description.json` — 238 bytes (smallest)
- `010-search-and-routing-tuning/description.json` — 245 bytes
- `007-release-alignment-revisits/description.json` — 264 bytes
- `009-playbook-and-remediation/description.json` — 265 bytes
- `015-packets-009-014-audit/description.json` — 538 bytes
- `014-memory-save-rewrite/description.json` — 533 bytes

Full-fidelity siblings (`001`, `003`, `004`, `005`, `012`) sit at 1000–1600 bytes. The minimum-information threshold iter 5 applied to 017 (556 bytes = stub) flags 6 additional folders as sub-threshold. Memory-indexing visibility is proportionally degraded across those 6 folders.

Severity P2 (process/maintainability) — the closing pass claimed 017-specific stub; the broader pattern was not surfaced. Recommend a bulk `generate-description.js` sweep across the 026-tree.

### F4 — P2 — `backfill-research-metadata.ts` `writeGraphMetadataFile` has unreachable `fs.unlinkSync` swallow in `finally` — noisy but not broken

`backfill-research-metadata.ts:105-118` — the rename pattern is correct (`writeFile` to tmp, `renameSync` to final), but the `finally` unconditionally calls `fs.unlinkSync(tempPath)` which fails with ENOENT on the success path because `renameSync` moved the file. The try/catch swallow is correct; net behaviour is safe. However the pattern is noisier than needed — `fs.rmSync(tempPath, { force: true })` accomplishes the same without the fabricated exception path. Minor style. Severity P2 (maintainability). Related: no pre-existing test covers the tmp-cleanup branch; `backfill-research-metadata.vitest.ts` is listed as a regression test but was not opened this iter.

## 3. Sample of well-reviewed areas (pass)

Confirmed via cross-ref with iter 1–6 that these are genuinely well-covered:

- **`caller-context.ts`** — full read by iter 1, iter 2, iter 5; AsyncLocalStorage isolation verified empirically.
- **`retry-budget.ts`** — iter 1 P2 + iter 2 ruled-out + iter 4 P2 consolidated; DoS / cross-caller / API-surface dimensions all addressed.
- **`shared-provenance.ts`** — iter 2 P1 homoglyph finding + iter 5 compound H1 confirm Greek-only fold is the canonical gap; no new angle.
- **`gate-3-classifier.ts`** — iter 1 full + iter 2 NFKC adversarial + iter 5 C2 compound; well-covered.
- **`exhaustiveness.ts`** — 20-line module, cross-referenced from every switch site in iter 4 F1.
- **`session-resume.ts`** — iter 2 P1 + iter 6 refutation establish the correct trust-boundary framing.

## Hypotheses evaluated (evidence-based)

- H-9-1 (T-CNS-03 sweep uniformity) — CONFIRMED split into 2 batches (F2).
- H-9-2 (017 stub unique) — REFUTED; 6+ siblings are sub-stub (F3).
- H-9-3 (continuity-freshness code collision) — CONFIRMED (F1).
- H-9-4 (EVIDENCE rewrap over-rewrote non-spec folders) — NOT PROBED this iter; defer to iter 10 or spot-check via git.
- H-9-5 (test-file adequacy) — NOT PROBED end-to-end; regression tests listed but not opened.

## Traceability Checks

```json
{
  "summary": {"required": 3, "executed": 3, "pass": 1, "partial": 0, "fail": 2, "blocked": 0, "notApplicable": 0, "gatingFailures": 0},
  "results": [
    {"protocolId": "spec_code_tcns03_sweep_uniformity", "status": "fail", "gateClass": "advisory", "applicable": true, "counts": {"pass": 0, "partial": 0, "fail": 1}, "evidence": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/*/description.json:lastUpdated"], "findingRefs": ["R9-P1-001"], "summary": "T-CNS-03 was 2 batches 1h03m apart, not a uniform sweep."},
    {"protocolId": "spec_code_017_stub_uniqueness", "status": "fail", "gateClass": "advisory", "applicable": true, "counts": {"pass": 0, "partial": 0, "fail": 1}, "evidence": ["026-graph-and-context-optimization/008,010,007,009,015,014/description.json sizes"], "findingRefs": ["R9-P2-001"], "summary": "017 stub is one of 6+ sub-threshold description.json files."},
    {"protocolId": "spec_code_continuity_code_collision", "status": "fail", "gateClass": "advisory", "applicable": true, "counts": {"pass": 0, "partial": 0, "fail": 1}, "evidence": ["scripts/validation/continuity-freshness.ts:30,141,171"], "findingRefs": ["R9-P2-002"], "summary": "code 'invalid_frontmatter' reused for fail+warn statuses."}
  ]
}
```

## Ruled Out

- EVIDENCE rewrap over-reach: not probed this iteration; no new evidence surfaced in 8 tool calls.
- `check-normalizer-lint.sh` shell-injection: reviewed — env var `SPECKIT_NORMALIZER_LINT_TARGET` quoted at line 10 and used only as path arg to `grep` with `set -euo pipefail` and explicit `--include`/`--exclude-dir`. No injection surface. Pass.
- `exhaustiveness.ts` itself: 20 LOC, `throw new Error` only, no state, no brittleness. Pass.

## New Findings Ratio

- findingsCount: 4 (0 × P0 + 1 × P1 + 3 × P2)
- severity-weighted new = (1 × 5.0) + (3 × 1.0) = **8.0**
- cumulative adjudicated severity (iter 1–6 per iter 6 reconciliation): **35.0**
- cumulative + iter 9 = 43.0
- newFindingsRatio iter 9 = 8.0 / 43.0 = **0.186**
- convergence threshold = 0.08 — **not converged** (ratio above threshold despite recovery-sweep design expectation of lower yield)
- novelty note: F2 is net-new (traceability regression on a named task); F3 refines iter 5's 017-specific claim into a pattern; F1/F4 are net-new code-level findings in previously unreviewed scripts.

## Convergence Assessment

Recovery sweep surfaces 4 findings from 8/38 unreviewed residual files — **6.25 findings per uncovered file when extrapolated**, far above discovery-iter yield. This suggests the remaining 8 files likely harbor additional latent findings. Iter 10 SHOULD prioritize:

- `handlers/memory-context.ts` (58 KB, unreviewed)
- `handlers/code-graph/query.ts` (30 KB, unreviewed)
- `lib/storage/lineage-state.ts` (46 KB, unreviewed)
- `command/spec_kit/assets/spec_kit_complete_confirm.yaml` (67 KB, unreviewed)

OR declare convergence on grounds that P0/P1 surface is exhausted (only F2 is P1, and it is a traceability issue, not a code bug). Severity-mix suggests iter 10 final-gate can close.

- toolCallsUsed: 11 (under budget)
- convergedThisIter: **false** (ratio 0.186 > 0.08)
- recommendation: iter 10 as adversarial-self-check or final-synthesis with explicit coverage-gap declaration for the 4 deferred files above.

## Follow-up Questions

1. Should F2 (T-CNS-03 non-uniform sweep) be raised against the closing-pass text to trigger a documentation amendment, or accepted as acceptable process variance?
2. F3 (6+ stub descriptions across 026-tree) — is a bulk `generate-description.js` sweep in scope for the remediation phase, or does it belong in a separate maintenance phase?
3. Should iter 10 spend its budget on the 4 large deferred files (memory-context.ts, query.ts, lineage-state.ts, confirm.yaml) or on final synthesis?
