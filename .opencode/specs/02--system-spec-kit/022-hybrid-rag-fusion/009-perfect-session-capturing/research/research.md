---
title: "Deep Research: Perfect Session [02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research]"
description: "Canonical synthesis of the deep-research audit for phases 001-017, covering spec truth vs runtime truth, remaining proof gaps, and design risks."
trigger_phrases:
  - "deep"
  - "research"
  - "perfect"
  - "session"
  - "009"
importance_tier: "normal"
contextType: "research"
---
# Deep Research: Perfect Session Capturing Truth Reconciliation

## Executive Summary

This deep-research pass found that the **runtime is materially ahead of the published docs**. The most urgent problem is not that the core save pipeline is still broadly broken; it is that the parent `009-perfect-session-capturing` pack still publishes a historical 16-phase clean-closure story that is no longer true after phase `014-stateless-quality-gates` and the latest runtime changes.

The audit converged on three top conclusions:

1. The parent pack, phase `016`, and phase `017` need documentation reconciliation before they can be trusted as current truth.
2. The runtime contract is stronger than the current docs say: structured-input modes (`--stdin`, `--json`) already exist and are the cleaner path than stateless direct mode.
3. “Works flawlessly with every CLI” is **not yet a fully supportable claim** because the proof is still mostly fixture/mock-based and because some stateless soft-fail saves can still be written without being semantically indexed.

## Validation Snapshot

Current local verification used during this research pass:

- targeted stateless/CLI suites: `55/55` passed
- focused phase-016 parity lane: `42/42` passed
- focused phase-017 stateless lane: `39/39` passed
- full scripts suite: `398/398` passed
- `npm run typecheck`: passed
- `npm run build`: passed
- MCP core suite: `283/283` files passed with `7790` tests passed, `11` skipped, `28` todo
- MCP file-watcher suite: `20/20` passed

At the same time, the parent pack is not closure-clean today:

- strict recursive validation currently detects `17` phases, not `16`
- current failures are concentrated in the parent pack plus phases `016` and `017`

## Phase-By-Phase Truth Table

| Phase | Intended problem | Actual shipped status | Remaining issue | Recommendation |
|------|-------------------|-----------------------|-----------------|----------------|
| `001` | Unify quality-score contract and scorer ownership | Shipped and stable | Low risk; only parent-pack drift | `keep` |
| `002` | Strengthen contamination detection and scoring penalties | Shipped and stable | Low risk; later source-aware tuning is separate | `keep` |
| `003` | Stop normalization/data loss | Shipped and stable | Low | `keep` |
| `004` | Consolidate canonical shared types | Shipped and stable | Low | `keep` |
| `005` | Calibrate decision confidence semantics | Shipped and stable | Low | `keep` |
| `006` | Improve description quality and scoring | Shipped and stable | Proof gap on “high-value every time” rendering | `keep` |
| `007` | Stabilize phase classification | Shipped and stable | Low | `keep` |
| `008` | Normalize signal extraction | Shipped and stable | Low | `keep` |
| `009` | Make embeddings/index prep structure-aware | Shipped and stable | Proof gap on fresh full weighting reruns in this pass | `keep` |
| `010` | Prove end-to-end save/write/index path | Shipped and stable | Passing E2E still emits template-data warnings | `keep` |
| `011` | Validate native session-source capture across CLIs | Shipped and stable | Fresh live retained proof per CLI not rerun in this pass | `add verification` |
| `012` | Keep template/validator compliance closed | Phase itself validates, but later phases drifted again | Compliance does not stay closed automatically | `add verification` |
| `013` | Fix auto-detection and spec targeting | Shipped and stable | Low | `keep` |
| `014` | Make per-folder description + filename/index infra reliable | Shipped and stable | Same-minute collision/index parity not freshly rerun across all modes | `add verification` |
| `015` | Normalize outsourced-agent handback across CLIs | Shipped and stable | Fresh live parity not rerun in this pass | `add verification` |
| `016` | Prove shipped multi-CLI parity | Runtime is shipped and directly tested | Docs are broken: stale successor and bad template refs | `fix docs` |
| `017` | Fix stateless quality gates and structured-input parity | Runtime is shipped and directly tested | Docs still read like a draft implementation plan | `fix docs` |

## Findings By Class

### Runtime Bugs Or Design Risks

1. **Saved-but-not-always-indexed stateless soft-fails**
   - V10-only stateless saves can warn and still write a memory file, but semantic indexing still requires `qualityValidation.valid === true`.
   - Result: some saves are operationally successful without being “perfectly indexable every time.”

2. **Claude-only contamination exception is overfit**
   - Source-aware contamination currently downgrades the `tool title with path` rule only for `claude-code-capture`.
   - That likely encodes transcript-shape policy in the wrong place and should evolve into typed source capabilities.

3. **Abort semantics are split across multiple owners**
   - `HARD_BLOCK_RULES` is useful but not the sole source of truth.
   - Template-contract aborts, sufficiency aborts, contamination aborts, hard-block rules, and quality-threshold aborts are still distributed across workflow and validation layers.

4. **Description quality is valid but still heuristic**
   - Per-folder descriptions remain short heading/problem/first-line extractions.
   - Frontmatter can still fall back to generic continuation text, which is acceptable but not ideal for indexing quality.

### Proof Gaps

1. Fresh retained live proof across all CLIs has not been re-established for the current contract, especially across:
   - direct mode
   - stateless direct mode
   - `--stdin`
   - `--json`

2. Same-minute collision/index parity for memory filenames has not been freshly proven across all save modes in this pass.

3. “Perfectly formatted every time” is not fully proven because passing workflow tests still emit template-data warnings in successful flows.

### Documentation Drift

1. The parent pack still claims:
   - strict recursive validation `0/0`
   - strict completion `43/43`
   - all `16` child phases complete
   - a final closure model that no longer matches the current tree

2. Phase `016` still presents itself as the final phase and contains bad template-path references.

3. Phase `017` runtime is shipped, but its docs do not yet read like current shipped truth.

4. The real runtime contract for `_source`, CLI-target precedence, stateless soft-save semantics, and indexability is spread across code and tests rather than one authoritative document.

## Answers To The High-Impact Design Questions

### Should stateless mode become rarer?
Yes. The preferred path should be structured capture via `--stdin` and `--json` whenever a CLI can provide enough native session structure. Direct stateless mode should remain available as a fallback and convenience path, not the default “smart” path.

### Is Claude-only contamination downgrading the right long-term boundary?
No. `_source` should remain authoritative, but policy should move from source-name exceptions to typed source capabilities such as transcript format or whether tool-title-with-path is expected.

### Are `HARD_BLOCK_RULES` sufficient as the ownership boundary?
Not as the final design. They are useful today, but durable ownership belongs in a first-class validation-rule metadata model with fields such as severity, block-on-save, block-on-index, and applicable sources.

### Is memory rendering always template-clean and indexable?
Not yet. The current contract is closer to:
- “many saves are valid and render correctly”
- “some soft-fail stateless saves still write without semantic indexing”
- “template-data warnings can still appear in successful flows”

### Should spec/description metadata become stricter?
Yes, but only once the docs and proof model are reconciled. Generic description fallback should be treated as indexability debt, not as the target steady state.

### Should live CLI proof be required before claiming “flawless across every CLI”?
Yes. Fixture-backed proof is necessary but not sufficient.

## Recommended Remediation Sequence

1. **Fix spec-pack truth drift first**
   - Reconcile the parent pack to a 17-phase reality.
   - Fix phase `016` successor linkage and bad references.
   - Rewrite phase `017` docs to reflect shipped runtime truth and current proof limits.

2. **Publish the runtime contract clearly**
   - Document direct mode, stateless mode, `--stdin`, `--json`, `_source`, and indexability behavior in one authoritative place.

3. **Close the proof gaps**
   - Add fresh retained live artifacts for each CLI.
   - Add cross-mode parity proof for direct/stateless/`--stdin`/`--json`.
   - Re-run same-minute collision/index parity tests and retain the artifacts.

4. **Address the remaining design risks**
   - Decide whether stateless soft-fail saves should remain writeable when not indexable.
   - Replace Claude-only contamination severity branching with typed source-capability policy.
   - Consolidate abort/index semantics into validator-owned rule metadata.

## Stop Reason

This research session converged in the first iteration because both independent deep-research branches returned the same answer: the next highest-value action is not more discovery, but documentation reconciliation and proof-hardening based on the current runtime truth.
