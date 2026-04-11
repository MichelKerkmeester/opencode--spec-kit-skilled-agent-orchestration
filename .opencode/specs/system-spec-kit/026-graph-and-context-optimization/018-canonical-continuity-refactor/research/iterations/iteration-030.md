---
title: "Iteration 030 — Phase 019 runtime migration handover"
iteration: 30
band: D
timestamp: 2026-04-11T12:33:14Z
worker: codex-gpt-5
scope: phase_019_handover
status: complete
focus: "Translate the phase 018 research body into a practical starting brief for engineers beginning phase 019 runtime migration."
maps_to_questions: [Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q9]
---

# Iteration 030 — Phase 019 Runtime Migration Handover

## Goal
Give phase 019 a single forward-looking brief before runtime migration starts. This is not another design exploration. Option C is already chosen. Phase 019 should execute, verify, and monitor it.

## What phase 018 produced
Phase 018 produced a converged design package for canonical continuity:
- `implementation-design.md` is the executive summary.
- `research/research.md` is the design synthesis.
- `findings/` contains the actual implementation contracts.
- iterations 021-029 tightened tests, latency budgets, pacing, and edge cases.

The design assumptions phase 019 should treat as fixed unless runtime evidence disproves them:
1. Canonical narrative lives in spec docs, not new memory files.
2. `_memory.continuity` is embedded frontmatter, not a separate store.
3. Legacy memory survives as an archived fallback tier via `is_archived=1`.
4. Resume is doc-first and only falls to archived retrieval on miss.
5. Human edits beat agent edits.
6. Low-confidence routing refuses or warns; it does not silently invent truth.

Primary source artifacts already on disk:
- `findings/routing-rules.md`
- `findings/thin-continuity-schema.md`
- `findings/validation-contract.md`
- `findings/conflict-handling.md`
- `findings/resume-journey.md`
- `findings/save-journey.md`
- `findings/migration-strategy.md`
- `findings/testing-strategy.md`
- `findings/rollout-plan.md`

## State handed to phase 019
Phase 019 inherits design clarity, not runtime closure.
What is true now: the architecture is stable enough to implement, the high-risk seams are named, the runtime pacing is known, the manual playbook and dashboard expectations are known, and the companion 5-iteration impact analysis is still referenced as a required parallel track for file-level scope precision.
What is not yet proven: the schema/archive migration on a real copy, an end-to-end trusted `atomicIndexMemory`, a real save-path `contentRouter`, a live `resumeLadder` fast path, and command/agent/doc parity with the new truth.

## What phase 019 must build first
Before phase 019 touches commands, agents, or top-level docs, it should lock the three foundations below.

### 1. Schema and index substrate
Phase 019 needs the storage layer to be real, rehearsed, and reversible.
Minimum required outcomes:
- `memory_index.is_archived` exists and is populated correctly
- archived rows rank below fresh spec-doc rows
- continuity rows are indexed separately from `spec_doc` rows
- causal edges support anchor-level linkage where required
- backfill is sufficient for spec docs to participate without special cases

Required evidence before moving on: copy rehearsal, rollback proof, row-count validation, archived/fresh ranking proof, and visible `archived_hit_rate`.

### 2. `atomicIndexMemory`
This is the actual write-path hinge.
Phase 019 should treat it as the real cutover primitive, not a helper rename.
It must:
- keep `withSpecFolderLock`
- detect mtime drift from external human edits
- re-read and retry safely
- preserve failed writes in `scratch/pending-save-{timestamp}.md`
- refresh `_memory.continuity`
- verify post-save fingerprints
- keep the index and canonical docs synchronized

If this primitive is not trusted, phase 019 should not advance to runtime migration.

### 3. `contentRouter`
This is the classifier boundary between raw session output and canonical packet state.
Phase 019 should require:
- all 8 categories wired to concrete targets
- Tier 1 rule matching
- Tier 2 prototype similarity
- Tier 3 LLM escalation
- correct refusal behavior below threshold
- explicit override behavior
- warning-band visibility in save responses
- routing telemetry for audit and tuning

## Sequencing recommendation
Phase 019 should run contract-first, writer-first, reader-second, flip-last.

### Sequence A — freeze the contracts
Freeze continuity schema fields, the routing category-to-target map, merge modes, and the telemetry names the dashboard depends on. Do not let runtime surfaces depend on moving contracts.

### Sequence B — make the writer path real first
Implement and prove `atomicIndexMemory`, `contentRouter`, merge logic, validation hooks, continuity refresh, and shadow/dual-write comparison. This order matters because save-path mistakes are easier to spot before reader/runtime changes pile on, resume/search quality depends on canonical state being written correctly, and wrong routing into canonical docs is more expensive than a failed save.

### Sequence C — migrate readers and runtime surfaces second
Only after the writer path is green, wire `resumeLadder`, the `session-resume.ts` fast path, document-type retargeting in search/context, runtime command flows, agent protocol changes, and the docs that describe the new behavior.

### Sequence D — flip and observe
Do last: make the new path default, run manual playbooks, monitor the dashboard daily, and keep rollback live until the window is healthy.

## Open design questions phase 018 deferred
Phase 018 intentionally left a few questions open or postponed. Phase 019 should resolve the ones that affect migration safety and explicitly defer the rest.
1. `implementation-summary.md` timing: create it during `/spec_kit:plan`; do not carry first-save special casing longer than necessary.
2. first-save research targets: auto-create `research/research.md` on first valid research save.
3. per-anchor locking: do not reopen in phase 019 unless real contention data forces it.
4. narrative compaction: instrument in phase 019, solve policy in phase 020 unless operators complain.
5. archive fallback tuning: measure first, tune second; do not guess thresholds.
6. impact-analysis completion: confirm whether the companion impact analysis exists before broad runtime surface edits; if missing, open it immediately as a parallel dependency.

## Anticipated gotchas from the prior 29 iterations
The earlier iterations converged on the same traps repeatedly.
1. Root packets without canonical docs will distort archive analytics; verify blocker backfills before trusting the numbers.
2. Mutex alone is not safety; human edits outside the mutex path still require mtime detection and retry.
3. Refusal is safer than a clever wrong write; preserve the low-confidence bias toward explicit refusal.
4. Resume regressions usually mean fast-path misses caused by missing `handover.md`, malformed `_memory.continuity`, or too much archived fallback.
5. Stage budgets matter more than end-to-end p95 alone; watch lock wait, merge/write, continuity verification, index sync, vector gather, rerank/fusion, and resume fallback.
6. Tests must start at contract freeze; waiting until after implementation is how the schedule slips.
7. Operator polish is the safest thing to cut; rollback proof, shadow evidence, blocking tests, and continuity correctness are not.
8. The observation window is part of the schedule; start it as soon as the new path is safe enough to observe.
9. Route targets should exist before the first save; otherwise phase 019 drags first-write exceptions through the whole migration.
10. Override semantics must stay visible; accepted risk belongs in operator-facing output, not buried in logs only.

## Dashboard health metrics phase 019 should monitor
Phase 019 needs both outcome metrics and stage metrics.

### Core health metrics
`resume_latency_p95`, `save_latency_p95`, `search_latency_p95`, `trigger_match_latency_p95`, `archived_hit_rate`, `concurrent_edit_detections`, `resume.fast_path_miss`, `classifier_refusal_rate`, `fingerprint_mismatch_count`, `shadow_mismatch_rate`

### Stage-budget metrics
`write.stage.lock_wait_ms`, `write.stage.merge_write_ms`, `write.stage.continuity_verify_ms`, `write.stage.index_sync_ms`, `read.stage.vector_ms`, `read.stage.fusion_ms`, `read.stage.filter_ms`, `resume.stage.wrapper_ms`, `resume.stage.handover_ms`, `resume.stage.continuity_ms`, `resume.stage.fallback_ms`, `budget_burn`

### Healthy zone
resume p95 `<500ms`, save p95 `<2s`, search p95 `<300ms`, trigger match p95 `<10ms`, archived hit rate `<5%` during the phase-019 monitoring window, embedding warmup `<5s`

### Warning conditions
Raise a warning when a path misses target for 2 consecutive benchmark runs, a path regresses by more than 20% vs the rolling 7-run median, a stage exceeds 120% of budget for 3 consecutive runs, or resume fast-path miss rate exceeds 15%.

### Critical conditions
Treat as gate-blocking when `resume_latency_p95 > 1000ms`, `save_latency_p95 > 5000ms`, `search_latency_p95 > 1000ms`, `trigger_match_latency_p95 > 50ms`, a dominant stage exceeds 150% of budget, or fingerprint mismatches are non-zero while write latency is rising.

## Gates phase 019 must pass before phase 020
Phase 020 should not begin until phase 019 closes these gates.

### Gate 1 — foundation proof
schema migration rehearsed on a copy, rollback verified, archive/fresh ranking behavior validated, continuity and spec-doc rows coexist correctly in the index

### Gate 2 — writer-path safety
`atomicIndexMemory` is the real integrated save primitive, router/merge/continuity/validation run end-to-end, shadow comparison shows equivalent or better behavior, and no unresolved fingerprint mismatch issue remains

### Gate 3 — reader/runtime stability
`resumeLadder` is live, search/context retargeting is complete, archived fallback only triggers when expected, and fast-path miss rate is understood and within target

### Gate 4 — preservation contract
all 13 regression tests are green, blocking unit and integration suites are green, and manual playbooks pass

### Gate 5 — surface parity
commands reflect the new runtime truth, agents reflect the new runtime truth, workflow YAMLs are updated, and spec-kit references plus global docs no longer describe the old memory-file path as primary

### Gate 6 — healthy monitoring window
dashboard metrics stay in range throughout the observation window, archived hit rate remains below the phase-019 threshold, no critical operator UX complaint remains open, and rollback remains available but unused

## Execution posture for phase 019
Treat phase 019 as a migration and reliability phase, not a prose phase.
Prefer proof over explanation, substrate over wrappers, safe defaults over clever fallbacks, and observable behavior over hidden automation.
Avoid reopening Option C itself, polishing docs before runtime truth exists, or folding phase-020 cleanup into the phase-019 cutover.

## Phase 019 first day checklist
1. Read `implementation-design.md` and every `findings/*.md` contract, then write a local execution note listing what is design-only versus already implemented.
2. Confirm whether the companion impact analysis exists; if not, launch it immediately as a parallel prerequisite for file-level scope control.
3. Rehearse the schema/archive migration on a copy, prove rollback, and record the exact validation queries plus expected row counts.
4. Build or verify `atomicIndexMemory` and `contentRouter` behind a testable integration harness before touching commands, agents, or top-level docs.
5. Stand up the dashboard view for latency, archived-hit, fast-path-miss, concurrency, fingerprint, and shadow-parity metrics so phase 019 has real go/no-go signals from day 1.
