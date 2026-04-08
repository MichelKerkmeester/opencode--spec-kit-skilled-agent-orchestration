---
title: "Implementation Summary: Detector Provenance and Regression Floor"
description: "Packet 007 closeout for detector provenance guardrails, frozen regression floor coverage, and the floor-versus-outcome boundary."
trigger_phrases:
  - "007-detector-provenance-and-regression-floor"
  - "implementation"
  - "summary"
  - "detector regression floor"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-detector-provenance-and-regression-floor |
| **Completed** | 2026-04-08 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Packet `007` shipped the bounded fallback the spec allows when no concrete AST-overclaim labels exist in `lib/search`: explicit provenance guardrails for the audited detector modules, a frozen regression floor that locks their current structural output, and a contract README section that keeps detector-floor success separate from user-visible quality claims.

### Audit Outcome

The audit did not find any live `parserProvenance: "ast"` assignments or equivalent AST-overclaim output labels inside the scoped `lib/search/` detector surfaces. I audited `evidence-gap-detector.ts`, `deterministic-extractor.ts`, `query-surrogates.ts`, `anchor-metadata.ts`, `retrieval-directives.ts`, and the `graph-lifecycle.ts` call site before taking the fallback path.

### Shipped Guardrails

`evidence-gap-detector.ts` now exports typed provenance metadata that labels both `predictGraphCoverage` and `detectEvidenceGap` as `heuristic`, with basis notes that describe the actual token-matching and statistical logic. `deterministic-extractor.ts` now exports typed provenance metadata that labels the save-time heading, alias, relation-phrase, and code-fence extractors as `regex`, which matches the implementation reality.

### Frozen Regression Floor

The new floor harness lives in `scripts/tests/detector-regression-floor.vitest.ts.test.ts`. It freezes small inline samples for the audited detectors and asserts two things together: the provenance label stays honest, and the detector output stays structurally stable. That gives successor packets a reusable regression floor without conflating the harness with broader structural-context quality.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

I started by re-reading the packet docs, the R6 recommendation, the current shared-payload contract from packets `005` and `006`, and the existing `.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md` wording. The code audit confirmed that `lib/search/` was missing honest, reusable provenance markers more than it was carrying concrete AST labels, so I kept the runtime change bounded: add typed provenance descriptors to the audited detector modules, freeze their current behavior in one scripts-side Vitest harness, and append the floor-versus-outcome boundary to `.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md`.

That approach preserved packet `005`'s certainty contract and packet `006`'s structural-trust axes without widening scope into new routing, dashboards, or detector subsystems. I then re-ran mcp-server typecheck, the new detector floor harness, and the `005`/`006` regression suites before closing the packet docs.

Successor handoff is explicit in the shipped docs: later packets may reuse this floor for detector integrity only, and they still need separate outcome evaluation before making user-visible structural-quality claims. No parent-tracker update was required because packet `007` is independent inside the `026` train, and this closeout left the packet-local `memory/` and `scratch/` directories untouched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Take the fallback path instead of inventing an AST bug | The audit found no concrete `ast` provenance labels in the scoped detector files, so the honest packet move was to prevent future overclaims and freeze current behavior rather than fabricate a label rewrite. |
| Export typed provenance descriptors from the detector modules | That gives packet `007` a real runtime artifact that downstream code and tests can read, while keeping the labels aligned to the implementation reality (`heuristic` or `regex`). |
| Keep the floor harness separate from outcome claims | R6 explicitly says frozen fixtures are a regression floor, not proof of user-visible structural quality, so the README and summary both keep that boundary explicit. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skill/system-spec-kit/mcp_server && TMPDIR=./.tmp/tsc-tmp npm run typecheck` | PASS |
| `cd .opencode/skill/system-spec-kit/scripts && TMPDIR=./.tmp/vitest-tmp npx vitest run tests/detector-regression-floor.vitest.ts` | PASS (`1` file, `2` tests) |
| `cd .opencode/skill/system-spec-kit/mcp_server && TMPDIR=./.tmp/vitest-tmp npx vitest run tests/shared-payload-certainty.vitest.ts tests/structural-trust-axis.vitest.ts` | PASS (`2` files, `9` tests) |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-detector-provenance-and-regression-floor` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No concrete AST overclaims were present in the audited `lib/search/` files.** This packet therefore ships explicit provenance guards and a frozen regression floor instead of behavior changes to nonexistent `ast` labels.
2. **The frozen floor is not an outcome benchmark.** It proves detector integrity for the covered regex and heuristic lanes only; successor packets still need separate user-visible quality evaluation.
3. **The scripts workspace needs a runnable suffix for plain Vitest discovery.** The harness keeps the requested `detector-regression-floor.vitest.ts` stem but uses the file name `detector-regression-floor.vitest.ts.test.ts` so `npx vitest run tests/detector-regression-floor.vitest.ts` resolves under the default scripts-side runner.
<!-- /ANCHOR:limitations -->
