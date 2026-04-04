---
title: Agent Improvement Strategy Template
description: Runtime strategy template for proposal-only agent improvement sessions.
---

# Agent Improvement Strategy

## 1. Target
Primary canonical benchmark target: `.opencode/agent/handover.md`
Bounded candidate-only profile: `.opencode/agent/context-prime.md`

## 1.1 Target Profile
Packet-level run covering `handover` as the benchmark seed and `context-prime` as the second structured profile.

## 2. Goal
Prove that the agent-improver engine can benchmark outputs, score prompt candidates, and report multi-target evidence without weakening the single-canonical promotion guard.

## 3. Constraints
- Promotion allowed only for the single canonical handover target
- Candidate-only targets must never be promoted
- Runtime mirrors excluded from benchmark truth
- No promotion without explicit later-phase gate
- Stop when no-go or repeatability rules fail

## 4. Current Hypothesis
Prompt-only scoring is no longer enough. The fuller skill needs deterministic fixture benchmarking, per-target profile metadata, and reporting that separates benchmark truth from packaging follow-up.

## 5. Candidate Focus
- Reject a weak handover prompt that tries to skip real context reads.
- Reject a weak context-prime prompt that violates the read-only bootstrap contract.

## 5.1 Benchmark Focus
- Protect repeatable high-scoring handover outputs across two identical baseline runs.
- Prove that context-prime can be benchmarked with its own Prime Package fixture set.

<!-- MACHINE-OWNED: START -->
## 6. What Improved
- Added benchmark runner plus fixture catalogs for `handover` and `context-prime`.
- Added target-profile metadata and profile-aware reducer reporting.
- Proved handover repeatability with identical aggregate scores across two runs.

## 7. What Failed
- Weak handover outputs failed structure, grounding, and cleanliness checks.
- Weak context-prime outputs failed both prompt and benchmark contracts.

## 8. Best Known State
- `handover`: baseline prompt score `100`, best benchmark score `100`
- `context-prime`: baseline prompt score `100`, best benchmark score `100`

## 9. Next Recommendation
Hold promotion. Fix repeated benchmark failures before broadening scope or considering any canonical mutation.

## 10. Packaging Follow-Up
Keep mirror-sync as downstream packaging only. Use `mirror-drift-report.md` to track parity without counting it as benchmark evidence.
<!-- MACHINE-OWNED: END -->
