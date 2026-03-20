---
title: Deep Research Strategy
description: Iterative deep-research strategy for the perfect-session-capturing truth-reconciliation audit.
---

# Research Strategy

## Topic
Rigorous deep-research audit of 010-perfect-session-capturing and all sub-phases: reconcile spec truth vs runtime truth, identify remaining bugs, proof gaps, and design risks, and determine what is required for flawless multi-CLI context saving with less stateless fallback and consistently formatted, useful, indexable memories.

## Key Questions (remaining)
None remaining.

## Answered Questions
- [x] Which phases `001` through `017` are now fully shipped, which are doc-drifted, and which remain materially risky?
  - Phases `001` through `015` remain functionally shipped; the current truth drift is concentrated in the parent pack plus phases `016` and `017`.
- [x] What current runtime contract actually governs direct mode, stateless mode, `--stdin`, and `--json`, and where does that differ from the published phase docs?
  - Direct mode is still the native/stateless capture path; `--stdin` and `--json` are structured-input paths that force `_source = 'file'`; explicit CLI target outranks payload `specFolder`.
- [x] What proof is still missing for "works flawlessly with every CLI", especially for live same-day evidence and cross-mode parity?
  - Fresh retained live parity across all CLIs and across direct/stateless/`--stdin`/`--json` modes is still missing.
- [x] Which remaining risks are documentation drift, which are proof gaps, and which are real runtime/design defects that still merit code changes?
  - Documentation drift: parent pack plus phases `016` and `017`; proof gaps: live parity and same-minute filename/index proof; runtime/design risks: saved-but-unindexed stateless soft-fails and Claude-only contamination policy.
- [x] What concrete remediation sequence best reduces stateless dependence while improving memory usefulness, formatting correctness, and indexing consistency?
  - First fix the parent/phase doc truth, then publish the runtime contract, then close live-proof gaps, then refine validator/source-policy design.

## What Worked
- Historical multi-agent audits in `research/` and `scratch/` already map earlier code risks and remediation themes; they are useful as prior context rather than fresh truth.
- Current local verification has already shown runtime progress beyond the March 17 parent closure narrative.
- Running two independent deep-research branches in parallel converged quickly: both identified the same parent/phase truth drift and the same remaining runtime/proof caveats.

## What Failed
- Treating the parent pack as the current source of truth failed immediately because it still claims a 16-phase clean closure while `017-stateless-quality-gates` exists and the pack no longer validates cleanly.
- Treating passing fixture coverage as enough to claim “flawless across every CLI” also failed; live retained proof and indexability semantics still need clearer closure criteria.

## Exhausted Approaches (do not retry)
None yet.

## Next Focus
Apply the synthesized findings to reconcile the parent pack plus phases `016` and `017`, then rerun strict recursive validation and the key proof lanes.

## Known Context
- Existing research corpus in `research/` includes a 25-agent audit, 20 implemented fixes across 9 source files, and a remediation manifest that still lists remaining quality-gate, relevance-filtering, prompt-pairing, and renderer risks.
- The parent spec currently drifts from runtime truth: it still presents a 16-phase closure story, while the tree contains `017-stateless-quality-gates`.
- Current local verification already confirmed that runtime/test truth is ahead of the docs:
  - targeted stateless/CLI suites: 55/55 passed
  - full scripts suite: 398/398 passed
  - typecheck: passed
  - build: passed
  - MCP suites: 283/283 passed plus file-watcher 20/20 passed
- Recursive strict validation currently fails because of documentation integrity and template-shape drift, especially in phase `016` and the parent phase map.

## Research Boundaries
- Max iterations: 10
- Convergence threshold: 0.05
- Progressive synthesis: true (default)
- research.md ownership: workflow-owned canonical synthesis output
- Reference-only modes: `:restart`, segment partitioning, wave pruning, checkpoint commits, alternate `claude -p` dispatch
- Current segment: 1
- Started: 2026-03-18T19:31:52Z
