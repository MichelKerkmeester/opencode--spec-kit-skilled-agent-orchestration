---
title: "Deep Research Iteration 001"
description: "Phase-by-phase truth table and runtime contract audit for perfect-session-capturing."
---

# Iteration 001: Truth Reconciliation And Runtime Contract Audit

## Focus
Build a phase-by-phase truth table for phases `001` through `017`, then verify the current runtime contract for direct mode, stateless mode, `--stdin`, `--json`, hard-block vs soft-warning quality gates, source-aware contamination, and description/indexability behavior.

## Findings

### Shared convergence result

Both deep-research branches converged on the same top-level conclusion:

- runtime and targeted tests are ahead of the published docs
- the main current failures are documentation drift in the parent pack plus phase `016` and `017`
- the main remaining runtime/design caveat is that some stateless soft-fail saves can still be written without being semantically indexed

### Key findings

1. The parent pack is no longer truthful as a closure document. It still claims a 16-phase clean completion story even though the tree now has `17` phases and strict recursive validation no longer passes.
2. Phase `016` runtime behavior is shipped and directly proven, but the docs are structurally broken: successor linkage is stale and several markdown references point at non-existent template paths.
3. Phase `017` runtime behavior is also shipped and test-backed, but its docs still read like an implementation plan instead of a reconciled shipped-state record.
4. The runtime contract is stronger than the docs imply:
   - direct mode is still the native/stateless capture path
   - `--stdin` and `--json` are authoritative structured-input paths
   - explicit CLI target outranks payload `specFolder`
   - `_source` remains authoritative
   - `HARD_BLOCK_RULES` only governs one part of the broader abort chain
5. “Flawless across every CLI” is not proven yet because current proof is still mostly fixture/mock-based, not fresh retained live parity across all modes and CLIs.

## Assessment

### New information ratio
0.86

### Questions addressed

- Which phases `001` through `017` are fully shipped, doc-drifted, or still risky?
- What current runtime contract governs direct mode, stateless mode, `--stdin`, and `--json`?
- What proof is still missing for “works flawlessly with every CLI”?
- Which remaining issues are documentation drift, proof gaps, or real runtime/design risks?
- What remediation sequence best reduces stateless dependence while improving memory usefulness and indexability?

### Questions answered

- The only clearly doc-broken phases are `016` and `017`, with the parent pack also out of sync.
- The runtime contract already supports the preferred structured-input path, but the docs do not describe it coherently.
- Cross-CLI live retained proof is still the biggest proof gap.
- The top runtime/design risk is “saved but not always indexed” stateless soft-fail behavior, plus a Claude-only contamination exception that should probably evolve into typed source capabilities.

## Recommended next focus
Synthesize the findings into `research.md`, then reconcile the parent pack plus phases `016` and `017` to match current runtime truth and current proof limits.
