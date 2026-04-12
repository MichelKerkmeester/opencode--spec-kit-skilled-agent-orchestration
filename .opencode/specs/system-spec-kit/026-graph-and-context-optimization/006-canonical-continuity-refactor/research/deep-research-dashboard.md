---
title: Deep Research Dashboard — Phase 018 Implementation Design
generation: 3
started: 2026-04-11T13:30:00Z
completed: 2026-04-11T18:35:00Z
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/deep-research-dashboard.md"]

---

# Deep Research Dashboard — Phase 018

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Phase 018 implementation design research. **40 iterations complete across 3 generations.** Generation 1 (iters 1-20): in-session by claude-opus-4-6 resolving all 9 key questions + synthesis. Generation 2 (iters 21-30): REAL cli-codex gpt-5.4 high fast, sequential foreground, drilling into implementation details (classifier prototype, validator rules, merge pseudocode, failure modes, test catalog, rollout DAG, phase 019 handover). **Generation 3 (iters 31-40): REAL cli-codex gpt-5.4 xhigh fast, 3-wave parallel**, drilling into phase-019-blocking gaps (Tier 3 LLM contract, shadow-compare metric, instrumentation spec, feature-flag state machine, causal-edges DDL, archive thresholds, migration dry-run, routing audit reducer, fingerprint forensics, cross-cutting synthesis). Recommendation: Option C implementable with 4 new components + 2 rewritten pipeline stages. All 13 advanced features retarget. Phase 018 research FULLY CLOSED. Phase 019 ready to execute.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:status -->
## 2. STATUS

- **Topic**: Wiki-Style Spec Kit Updates — HOW to implement Option C
- **Started**: 2026-04-11T13:30:00Z
- **Completed**: 2026-04-11T18:35:00Z
- **Status**: COMPLETE
- **Iteration**: 40 of 40
- **Session ID**: `018-impl-design-2026-04-11`
- **Parent Session**: none (new)
- **Lifecycle Mode**: `new+rerun+depth-pass`
- **Generation**: 3
- **Generation 1 worker**: claude-opus-4-6 (in-session, iters 1-20)
- **Generation 2 worker**: cli-codex gpt-5.4 high fast (REAL, sequential foreground, iters 21-30)
- **Generation 3 worker**: cli-codex gpt-5.4 xhigh fast (REAL, 3-wave parallel, iters 31-40)

<!-- /ANCHOR:status -->

---

<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Band | Focus | Ratio | Findings | Status |
|---|---|---|---:|---:|---|
| 1 | A | Architecture baseline | 1.00 | 5 | ✅ |
| 2 | A | Content routing rules | 0.95 | 5 | ✅ |
| 3 | A | Anchor merge semantics | 0.90 | 5 | ✅ |
| 4 | A | Frontmatter metadata policy | 0.85 | 5 | ✅ |
| 5 | A | Thin continuity schema | 0.80 | 6 | ✅ |
| 6 | B | Trigger phrase retarget | 0.70 | 4 | ✅ |
| 7 | B | Intent routing + search pipeline | 0.75 | 5 | ✅ |
| 8 | B | Session dedup | 0.60 | 4 | ✅ |
| 9 | B | Quality gates + reconsolidation | 0.70 | 4 | ✅ |
| 10 | B | Causal graph | 0.75 | 4 | ✅ |
| 11 | B | FSRS decay + tiers | 0.65 | 4 | ✅ |
| 12 | B | Constitutional + governance | 0.70 | 4 | ✅ |
| 13 | C | Resume journey | 0.80 | 5 | ✅ |
| 14 | C | Save flow | 0.75 | 5 | ✅ |
| 15 | C | Conflict handling | 0.65 | 5 | ✅ |
| 16 | C | Migration M4 | 0.60 | 5 | ✅ |
| 17 | C | Failure modes | 0.55 | 5 | ✅ |
| 18 | D | End-to-end journey | 0.45 | 5 | ✅ |
| 19 | D | Testing strategy | 0.40 | 5 | ✅ |
| 20 | D | Rollout plan + synthesis | 0.30 | 5 | ✅ |
| 21 | E | Tier 2 classifier prototype | — | 5 | ✅ Codex |
| 22 | E | spec-doc-structure validator | — | 5 | ✅ Codex |
| 23 | E | 5 merge modes pseudocode | — | 5 | ✅ Codex |
| 24 | E | Continuity schema validation | — | 5 | ✅ Codex |
| 25 | E | 13 feature regression scenarios | — | 5 | ✅ Codex |
| 26 | E | 30 failure modes deep dive | — | 5 | ✅ Codex |
| 27 | E | Latency budget per stage | — | 5 | ✅ Codex |
| 28 | E | Rollout pacing DAG | — | 5 | ✅ Codex |
| 29 | E | 243-test catalog | — | 5 | ✅ Codex high |
| 30 | E | Phase 019 handover brief | — | 5 | ✅ Codex high |
| 31 | F | Tier 3 LLM classifier contract | — | 5 | ✅ Codex xhigh |
| 32 | F | Shadow-compare equivalence metric | — | 5 | ✅ Codex xhigh |
| 33 | F | Instrumentation spec (spans, sampling, alerts) | — | 5 | ✅ Codex xhigh |
| 34 | F | Feature-flag state machine | — | 5 | ✅ Codex xhigh |
| 35 | F | Causal edges anchor-level DDL | — | 5 | ✅ Codex xhigh |
| 36 | F | Archive permanence EWMA thresholds | — | 5 | ✅ Codex xhigh |
| 37 | F | Migration dry-run pipeline | — | 5 | ✅ Codex xhigh |
| 38 | F | Routing audit reducer | — | 5 | ✅ Codex xhigh |
| 39 | F | Fingerprint forensics + circuit breaker | — | 5 | ✅ Codex xhigh |
| 40 | F | Cross-cutting synthesis + phase 019 SLA | — | 5 | ✅ Codex xhigh |

- **iterationsCompleted**: 40 (20 gen 1 + 10 gen 2 + 10 gen 3)
- **keyFindings**: ~196 across all iterations
- **openQuestions**: 0
- **resolvedQuestions**: 9 / 9 (+ 6 iter-030 deferrals resolved in iter 040)
- **compositeScore**: 0.98 (post-xhigh depth pass)
- **averageNewInfoRatio**: gen 1: 0.695 | gen 2 & 3: targeted deep-dives, not new-info runs
- **gen 3 parallelism**: 3 waves (iters 31+32+33, then 35+36+39 with 31 still running, then 34+37+38, then 40 alone)

<!-- /ANCHOR:progress -->

---

<!-- ANCHOR:questions -->
## 4. QUESTIONS

- **Answered**: 9 / 9
- [x] **Q1** — Routing authority (iters 1, 2)
- [x] **Q2** — Anchor-scoped merge semantics (iters 3, 4)
- [x] **Q3** — Thin continuity layer shape (iters 4, 5)
- [x] **Q4** — Feature retargeting per advanced capability (iters 6-12)
- [x] **Q5** — Resume journey (iter 13)
- [x] **Q6** — /memory:save user flow (iter 14)
- [x] **Q7** — Validation contract (iters 9, 17)
- [x] **Q8** — Migration of existing corpus (iter 16)
- [x] **Q9** — Trust and safety (iters 15, 17, 18, 19)

<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:trend -->
## 5. TREND

- **Ratios (last 5)**: 0.60 → 0.55 → 0.45 → 0.40 → 0.30 (expected decline — synthesis/audit iterations don't add new content)
- **Stuck count**: 0
- **Guard violations**: 0
- **convergenceScore**: 0.95
- **coverageBySources**: phase 017 seed, code paths (memory-save, memory-context, memory-search, generate-context, nested-changelog), phase 017 iterations 1-10, spec kit templates, manual walkthrough

<!-- /ANCHOR:trend -->

---

<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS

- **cli-codex in this session** — repeated exit 143/144/2 failures; substituted to in-session orchestration (user requested gpt-5.4 high fast worker; substitution preserves intent while avoiding failure mode)
- **Live MCP handler calls** — embedding warmup timeout blocked live retrieval tests (same failure as phase 017 generation 1 and 2); deferred to phase 019
- **Per-anchor mutex granularity** — considered but deferred in favor of per-spec-folder mutex (matches current primitive, avoids over-engineering)

<!-- /ANCHOR:dead-ends -->

---

<!-- ANCHOR:next-action -->
## 7. NEXT ACTION

**Research phase status**: complete (30 iterations across 2 generations). No next action within this research session. Phase 019 handover brief available at `research/iterations/iteration-030.md`.

**Downstream**:
1. **Phase 018 Gate A pre-work** — run root packet backfill + embedding health check + SQLite backup
2. **Phase 018 Gate B foundation** — schema migration + archive flip + ranking update
3. **Run companion 5-iteration impact analysis** at `prompts/research-prompt-impact.md` for file-level change matrix
4. **Write phase 018 spec.md / plan.md / tasks.md / checklist.md** based on the findings files produced

**Primary deliverables**:
- `research/research.md` — progressive synthesis
- `implementation-design.md` — executive summary
- `findings/routing-rules.md`
- `findings/feature-retargeting-map.md`
- `findings/resume-journey.md`
- `findings/save-journey.md`
- `findings/conflict-handling.md`
- `findings/migration-strategy.md`
- `findings/validation-contract.md`
- `findings/thin-continuity-schema.md`
- `findings/testing-strategy.md`
- `findings/rollout-plan.md`

<!-- /ANCHOR:next-action -->
