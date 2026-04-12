---
title: "PR-11 Defer Rationale"
description: "Phase 5 rationale for deferring the D9 save-lock hardening PR."
trigger_phrases:
  - "pr11 defer rationale"
  - "d9 save lock defer"
  - "phase 5 concurrency rationale"
importance_tier: important
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/005-operations-tail-prs"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["pr11-defer-rationale.md"]

---
# PR-11 Defer Rationale

Phase 5 records PR-11 as deferred, not abandoned. Iteration 21 surfaced D9 as a real operational candidate, but the evidence stayed in the "latent concurrency risk" category rather than a live content-defect class that must ship in the core train. [SOURCE: ../research/iterations/iteration-021.md:49-55] [SOURCE: ../research/research.md:1524-1525]

## D9 Candidate

- Candidate: cross-process save-lock bypass on degraded filesystem locking.
- Symptom: simultaneous `--json` saves can proceed without strong cross-process serialization, which can make filename collision handling, indexing order, and post-save review timing non-deterministic.
- Trigger conditions: stale-lock metadata failures, unexpected lock-directory errors, or timeout while another process still owns `.workflow-lock`. [SOURCE: ../research/iterations/iteration-021.md:50-55]

## Why Defer

- The current workflow evidence does not show real concurrency pressure in normal operator use. Iteration 21 explicitly framed D9 as operational and low-frequency, not as a second hidden content-defect family. [SOURCE: ../research/iterations/iteration-021.md:59-66]
- The parent research recommendations say PR-11 should be promoted only if concurrent `--json` saves become a real workflow in CI or automation. [SOURCE: ../research/research.md:1422-1423] [SOURCE: ../research/research.md:1524-1525]
- Shipping speculative lock hardening would add risk to the single-process path without evidence that the common workflow needs it. [SOURCE: ../research/iterations/iteration-021.md:51-55]

## Reopen Triggers

Reopen PR-11 only if at least one of these happens:

1. We observe real multi-process `--json` saves in CI, automation, or parallel operator workflows.
2. A user or operator reports save collisions, non-deterministic ordering, or review timing drift tied to concurrent runs.
3. A dedicated D9 reproduction harness demonstrates the degraded-lock continuation on a workflow we actually intend to support.

## Phase 5 Decision

PR-11 status for Phase 5 is `deferred-with-rationale`. Packet closeout proceeds because the dry-run migration evidence, telemetry artifacts, release framing, and parent status updates satisfy the minimal operational closeout contract without speculative concurrency hardening. [SOURCE: ../research/research.md:1438-1443]
