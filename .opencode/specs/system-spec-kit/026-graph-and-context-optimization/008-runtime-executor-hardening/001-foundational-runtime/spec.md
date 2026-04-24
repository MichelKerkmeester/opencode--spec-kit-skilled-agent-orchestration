---
title: "Featur [system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/001-foundational-runtime/spec]"
description: "Merged packet covering the foundational runtime arc: 50-iter research charter (ex-016) plus 27 remediation tasks across 4 Phase-017 sub-phases. Five sub-phases preserve history: 001-initial-research, 002-infrastructure-primitives, 003-cluster-consumers, 004-rollout-sweeps, 005-p2-maintainability."
trigger_phrases:
  - "foundational runtime remediation"
  - "phase 017 remediation"
  - "017 review findings"
  - "h-56-1 canonical save fix"
  - "cluster d code-graph asymmetry"
  - "cluster e copilot observability"
  - "50-iter foundational research"
importance_tier: "critical"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/001-foundational-runtime"
    last_updated_at: "2026-04-18T16:30:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Packet consolidation: ex-016 research charter + ex-017 remediation merged into one arc"
    next_safe_action: "Cross-reference updates swept across repo"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Foundational Runtime (merged)

> **Consolidation note (2026-04-18).** This packet merges the former Phase 016 research charter (50-iter) with the former Phase 017 remediation work into one foundational-runtime arc. The 50-iter research charter now lives in `001-initial-research/`. The four Phase 017 remediation child phases are preserved as `002-infrastructure-primitives/`, `003-cluster-consumers/`, `004-rollout-sweeps/`, `005-p2-maintainability/`. Top-level narrative below describes the shipped remediation surface.

---

# Feature Specification: Phase 017 Review-Findings Remediation

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (10 original + 9 new P1 findings) + P2 (14 maintainability) |
| **Status** | Spec Ready, Awaiting Plan/Implement Approval |
| **Created** | 2026-04-17 |
| **Updated** | 2026-04-17 |
| **Branch** | `main` |
| **Review Source** | `../review/016-foundational-runtime-pt-01/review-report.md` (413 lines, 7-iteration deep-review, CONDITIONAL verdict) |
| **Research Source (seg-1)** | `../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md` (1537 lines, 50-iter Opus synthesis) |
| **Research Source (seg-2)** | `../research/016-foundational-runtime-pt-01/segment-2-synthesis.md` (332 lines, 7-iter Opus synthesis) |
| **Effort Estimate** | ~105h total / ~60h critical-path / 6 working days at 1 engineer |
| **Wave Structure** | Wave A (20h infrastructure) → Wave B (30h consumers, parallel 3 lanes) → Wave C (15h rollout) → Wave D (40h P2s, deferrable) |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Predecessor** | None |
| **Successor** | ../002-sk-deep-cli-runtime-execution/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 017 (27 `fix(016)` commits landing P0-A/B/C/D, S1-S7 structural refactors, M3-M13 medium refactors, 21 quick wins, 34 test migrations) completed the remediation scoped from the 50-iteration Phase 016 research. A 7-iteration deep-review then meta-audited Phase 017 and produced verdict **CONDITIONAL** with 10 P1 + 18 P2 findings across 3 clusters (A scope-normalization, B canonical-save-surface, C ASCII-only sanitization) + 4 standalone P1s. A subsequent 7-iteration deep-research segment (iters 51-57) extended that inventory by 14 new findings (9 P1, 5 P2), confirmed 3 compound-hypothesis attack chains, refuted all 5 P2→P1 upgrade candidates, and ruled out P0 escalation under expanded threat models.

The dominant finding is **H-56-1** (compound P1, confidence 0.93): the default `/memory:save` canonical-save path is a **structural metadata-freshness no-op**. Composed from three existing conditions:

1. `scripts/core/workflow.ts:1259` hardcodes `const ctxFileWritten = false`, making the per-folder `description.json` update block (lines 1261-1331) **unreachable dead code**.
2. `scripts/core/workflow.ts:1333` gates `refreshGraphMetadata` on `plannerMode === 'full-auto'`.
3. `scripts/memory/generate-context.ts:415` defaults to `plannerMode = 'plan-only'`.

Net effect: every default `/memory:save` invocation writes **zero** metadata to `description.json.lastUpdated` and `graph-metadata.json.derived.*`. The review-surfaced symptom "0 of 16 sibling folders have fresh `description.json.lastUpdated`" (R5-P1-001) is not drift over time — it is the **deterministic output** of a default code path that never writes. Every `/memory:save` invocation since this code shipped has been a metadata no-op.

Two additional clusters the review didn't fully capture:

- **Cluster D — code-graph sibling asymmetry** (R52-P1-001): Phase 017 hardened `handlers/code-graph/query.ts` with `canonicalReadiness` + `trustState` + `lastPersistedAt` (T-CGQ-09/10/11/12), but 6 sibling handlers (`scan.ts`, `status.ts`, `context.ts`, `ccc-status.ts`, `ccc-reindex.ts`, `ccc-feedback.ts`) emit **zero** such tokens. The review captured only 1 of the 6 (`context.ts` as R6-P1-001).
- **Cluster E — runtime-specific observability gap** (R52-P1-002): The Copilot hook runtime is missing both `compact-cache.ts` (absent file) and `shared.ts` (absent file). Its `session-prime.ts` does not read `payloadContract?.provenance.trustState`. Copilot-driven sessions lose trust provenance across compaction — directly impacting Phase 017's autonomous-execution plan (Copilot-fallback runtime limited to 3 parallel dispatches per `feedback_copilot_concurrency_override` (user memory)).

### Purpose

Define the remediation charter that closes **all 27 consolidated tasks** across four sequenced waves:

- Close 10 original P1 findings from the deep-review (R1-P1-001, R1-P1-002, R2-P1-001, R2-P1-002, R3-P1-001, R3-P1-002, R4-P1-001, R4-P1-002, R5-P1-001, R6-P1-001).
- Close 9 new P1 findings from segment-2 research (R51-P1-001/002/003, R52-P1-001/002, R53-P1w-001, R56-P1-upgrade-001, R56-P1-NEW-002, R56-P1-NEW-003).
- Close 5 new P2 findings (R51-P2-001, R52-P2-001/002, R55-P2-002/003/004 — tracked but deferred to Wave D).
- Address 3 CONFIRMED compound hypotheses (H-56-1, H-56-4, H-56-5).
- Respect file-collision and test-coupling constraints via atomic-ship grouping.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### 3.1 In-Scope — 27 Remediation Tasks

**From review-report §5 (19 tasks)**:
- Cluster A: T-SCP-01 (collapse 4 normalizers), T-SCP-02 (lint rule)
- Cluster B: T-CNS-01 (generate-context.js lastUpdated), T-CNS-02 (research backfill), T-CNS-03 (16-folder sweep), T-CGC-01 (context.ts parity), T-CGC-02 (error branch), T-EVD-01 (evidence-marker lint), T-RBD-03 (design-intent comments)
- Cluster C: T-SAN-01 (Gate 3 NFKC), T-SAN-02 (sanitizeRecoveredPayload NFKC), T-SAN-03 (test renames + unicode cases)
- Standalone P1: T-PIN-RET-01 (retry-exhaustion), T-SRS-BND-01 (session-ID auth), T-CPN-01 (stale CP-002), T-YML-CP4-01 (typed predicate)
- Standalone P2: T-EXH-01 (assertNever), T-PIN-GOD-01 (god-function extract), T-RCB-DUP-01 (transaction dedup)

**From segment-2 research (8 new tasks)**:
- Cluster B extensions: T-W1-CNS-04 (plan-only default flip), T-W1-CNS-05 (continuity-freshness validator)
- Cluster D: T-W1-CGC-03 (5-sibling readiness propagation)
- Cluster E: T-W1-HOK-01 (Copilot compact-cache), T-W1-HOK-02 (shared-provenance extraction)
- Standalone: T-W1-MCX-01 (memory-context readiness rename), T-W1-PIN-02 (OnIndexSkipReason satisfies), T-W1-HST-02 (Docker deployment note)

### 3.2 Out-of-Scope

- Re-auditing the 4 P0 composites (A/B/C/D) — already verified with genuine regression coverage in review iter 5.
- Investigating P0 escalation under threat models outside iter 53's expanded set (multi-UID POSIX, Docker shared-tmp, NFS, Windows, MCP injection, prototype pollution, supply-chain, sibling cache poisoning — all ruled out).
- Upgrading P2-masking findings to P1 — iter 55 confirmed all 5 candidates stay P2.
- Refactoring `../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md` or segment-2-synthesis.md content.
- Phase 015 or Phase 016 findings not covered by the review.

### 3.3 Closed Hypotheses (iter 56)

- **CONFIRMED (addressed in this spec)**: H-56-1 canonical-save paralysis, H-56-4 Copilot silent-failure cluster, H-56-5 research-iteration folders invisible to memory layer.
- **REFUTED (explicitly not in scope)**: H-56-2 cross-handler observability attack.
- **PARTIAL (scoped to hook-state only, not SQLite CAS)**: H-56-3 multi-container scope-confusion.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 3.5 FUNCTIONAL REQUIREMENTS

The Functional Requirements (FC-1..FC-8) are canonically listed in §4.1 (Success Criteria). This anchor points to that authoritative list.

Summary of requirements:
- FC-1: Every `/memory:save` writes `description.json.lastUpdated` + refreshes `graph-metadata.json.derived.*`
- FC-2: All 16 sibling folders have fresh `lastUpdated` ≤10m from `last_save_at`
- FC-3: Every research iteration folder has metadata or is flagged auto-invisible
- FC-4: All 6 code-graph sibling handlers emit 3-field readiness vocabulary
- FC-5: `hooks/copilot/compact-cache.ts` exists and is wired into session-prime
- FC-6: `normalizePrompt` applies NFKC + zero-width stripping
- FC-7: `handleSessionResume` binds sessionId to MCP transport identity
- FC-8: `partial_causal_link_unresolved` has retry-exhaustion counter
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 4. SUCCESS CRITERIA

### 4.1 Functional

- **FC-1**: Every `/memory:save` invocation (any `plannerMode`) writes `description.json.lastUpdated` and refreshes `graph-metadata.json.derived.*` on the target spec folder.
- **FC-2**: All 16 sibling folders under `026-graph-and-context-optimization/` have `description.json.lastUpdated ≥ graph-metadata.json.derived.last_save_at - 10m`.
  Follow-up note: the 10-minute divergence limit is a heuristic one-sided policy budget pending telemetry calibration, not an empirically measured same-save latency bound, and date-only timestamps need precision-aware normalization before they can participate in strict freshness checks.
- **FC-3**: Every research iteration folder (`research/NNN-*/iterations/`) either has `description.json` + `graph-metadata.json` or is explicitly flagged as auto-invisible.
- **FC-4**: `handlers/code-graph/{scan,status,context,ccc-status,ccc-reindex,ccc-feedback}.ts` emit `canonicalReadiness` + `trustState` + `lastPersistedAt` via shared `lib/code-graph/readiness-contract.ts`.
- **FC-5**: `hooks/copilot/compact-cache.ts` exists and writes `trustState: 'cached'`; `hooks/copilot/session-prime.ts` reads `payloadContract?.provenance.trustState`.
- **FC-6**: `shared/gate-3-classifier.ts:normalizePrompt` applies `.normalize('NFKC')` + strips `[\u00AD\u200B-\u200F\uFEFF]` zero-width/soft-hyphen characters.
- **FC-7**: `handleSessionResume` binds `args.sessionId` to the caller's MCP-transport-layer session identity.
- **FC-8**: `partial_causal_link_unresolved` outcomes have a retry-exhaustion counter keyed on `(memoryId, step, reason)`.

### 4.2 Non-Functional

- **NF-1**: Zero new P0 findings introduced by remediation commits (verified by `/spec_kit:deep-review :auto` ×7 per `feedback_phase_018_autonomous` (user memory)).
- **NF-2**: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict` on the 017 spec folder exits 0 with 0 warnings after implementation completes.
- **NF-3**: Wave A + Wave B atomic-ship constraints respected (no transient inconsistency windows in `description.json` vs `graph-metadata.json` or in `code-graph/*` handler vocabulary).
- **NF-4**: All 170/179 completed CHK evidence markers in the 016 `checklist.md` rewrapped to canonical `]` closer BEFORE T-EVD-01 lint activates in `--strict` mode.

### 4.3 Contract

- Same-UID filesystem trust model documented in deployment docs; Docker `-v /tmp:/tmp` flagged as anti-pattern.
- `description.json.lastUpdated` and `graph-metadata.json.derived.last_save_at` MUST remain ≤10m divergent across all canonical save paths.
- The 10-minute continuity threshold is a heuristic one-sided policy budget pending telemetry calibration; it is not a measured same-pass latency guarantee.
- `trustState` vocabulary remains `'live' | 'stale' | 'absent' | 'unavailable'` — no new values added.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:cluster-inventory -->
## 5. CLUSTER INVENTORY + FINDING CROSSWALK

### Cluster A — Scope-normalization drift (2 findings, 2 tasks)

| Finding | Severity | Task | Extends |
|---------|----------|------|---------|
| R1-P1-001 | P1 (narrowed) | T-SCP-01 | — |
| R4-P1-001 | P1 (latent) | T-SCP-01 + T-SCP-02 | — |

### Cluster B — Canonical-save-surface hygiene (11 findings, 7 tasks — HIGHEST PRIORITY)

| Finding | Severity | Task | Source |
|---------|----------|------|--------|
| R3-P1-002 | P1 | T-CNS-02 | review |
| R3-P2-001 | P2 | T-CNS-01 + T-W1-CNS-04 | review |
| R3-P2-002 | P2 | T-EVD-01 | review |
| R4-P1-002 | P1 | T-CNS-01 | review |
| R5-P1-001 | P1 | T-CNS-03 | review |
| R6-P1-001 | P1 (upgrade) | T-CGC-01 + T-CGC-02 | review |
| R6-P2-001 | P2 | T-RBD-03 | review |
| R51-P1-001 | P1 | T-CNS-01 | segment-2 |
| R51-P1-002 | P1 | T-W1-CNS-04 | segment-2 |
| R51-P1-003 | P1 | T-W1-CNS-05 | segment-2 |
| R56-P1-upgrade-001 | P1 (compound) | T-CNS-01 + T-W1-CNS-04 | segment-2 |
| R56-P1-NEW-003 | P1 (compound) | T-CNS-02 | segment-2 |

### Cluster C — ASCII-only sanitization (4 findings, 3 tasks)

| Finding | Severity | Task | Source |
|---------|----------|------|--------|
| R2-P1-002 | P1 | T-SAN-01 + T-SAN-03 | review |
| R2-P2-001 | P2 | T-SAN-02 | review |
| R3-P2-003 | P2 | T-SAN-03 | review |
| R5-P2-001 | P2 | T-SAN-03 | review |

### Cluster D — Code-graph sibling asymmetry (1 finding, 1 task — NEW)

| Finding | Severity | Task | Source |
|---------|----------|------|--------|
| R52-P1-001 | P1 | T-W1-CGC-03 | segment-2 |

### Cluster E — Runtime-specific observability gap (3 findings, 2 tasks — NEW)

| Finding | Severity | Task | Source |
|---------|----------|------|--------|
| R52-P1-002 | P1 | T-W1-HOK-01 | segment-2 |
| R52-P2-001 | P2 | T-W1-HOK-02 | segment-2 |
| R56-P1-NEW-002 | P1 (compound) | T-W1-HOK-01 + T-W1-HOK-02 | segment-2 |

### Standalone findings (8 findings, 8 tasks)

| Finding | Severity | Task | Source |
|---------|----------|------|--------|
| R1-P1-002 | P1 | T-PIN-RET-01 | review |
| R2-P1-001 | P1 | T-SRS-BND-01 | review |
| R3-P1-001 | P1 | T-CPN-01 | review |
| R53-P1w-001 | P1-worsened | T-W1-HST-02 | segment-2 |
| R4-P2-001 | P2 | T-PIN-GOD-01 | review |
| R4-P2-002 | P2 | T-EXH-01 | review |
| R4-P2-003 | P2 | T-RCB-DUP-01 | review |
| CP-004 / R4-P2-005 | P2 | T-YML-CP4-01 | review |
| R51-P2-001 | P2 | T-W1-PIN-02 | segment-2 |
| R52-P2-002 | P2 | T-W1-MCX-01 | segment-2 |

### Findings refuted (no tasks — tracked for audit trail)

- R4-P2-001 god-function hidden bug — refuted iter 55
- R4-P2-003 transaction divergence — refuted iter 55 (preconditions shared by design; R55-P2-003 logged as DRY P2)
- R4-P2-004 predicate drift — refuted iter 55 (R55-P2-002 logged as underused-helper P2)
- R3-P2-002 tool-authored corruption — refuted iter 55 (no programmatic writer; still-listed for lint-only remediation via T-EVD-01)
- R2-P2-002 scalarsEqual active bug — refuted iter 55 (R55-P2-004 logged as evolution-gap P2)
- H-56-2 cross-handler cache poisoning — refuted iter 56
<!-- /ANCHOR:cluster-inventory -->

---

<!-- ANCHOR:dependencies -->
## 6. TASK DEPENDENCIES + ATOMIC-SHIP CONSTRAINTS

### Critical path (7 nodes, ~50h sequential)

```
T-CNS-01 → T-W1-CNS-04 → T-CNS-02 → T-CGC-01 → T-W1-CGC-03 → T-W1-CNS-05 → T-CNS-03
  (M/4h)    (merged PR)    (M/4h)     (M/4h)     (L/16h)        (M/4h)        (L/16h)
```

### File-collision groups (MUST atomic-ship)

1. **`scripts/core/workflow.ts`**: T-CNS-01 + T-W1-CNS-04 share the file. Must land in one PR.
2. **`lib/code-graph/readiness-contract.ts`** (new): T-CGC-01 creates the module; T-W1-CGC-03 consumes it. Atomic-ship OR staged with `trustState: 'unavailable'` stubs.
3. **`hooks/*/shared.ts` + `hooks/copilot/*`**: T-W1-HOK-02 (extract shared-provenance.ts) MUST precede T-W1-HOK-01 (Copilot compact-cache). Reverse order re-inlines `wrapRecoveredCompactPayload` as 3rd duplicate.
4. **`shared/gate-3-classifier.ts` + tests**: T-SAN-01 + T-SAN-03 MUST land together (SAN-03 tests fail until SAN-01 lands).
5. **`.opencode/skill/system-spec-kit/scripts/spec/validate.sh`**: T-EVD-01 + T-SCP-02 batch into one lint-addition PR. T-EVD-01 `--strict` mode MUST NOT activate until 016 checklist.md rewrap completes.

### Rollout hazards

| Hazard | Mitigation |
|--------|------------|
| Transient `description.json` vs `graph-metadata.json` divergence window | Atomic ship T-CNS-01 + T-W1-CNS-04 |
| Naive `trustState !== undefined` consumers mid-rollout | Atomic ship T-CGC-01 + T-W1-CGC-03 OR emit `trustState: 'unavailable'` stub |
| Third-duplicate `wrapRecoveredCompactPayload` in Copilot | Order T-W1-HOK-02 BEFORE T-W1-HOK-01 |
| Red repo between SAN-01 and SAN-03 commits | Land together |
| 170/179 CHK marker lint failure | Rewrap 016 checklist.md BEFORE T-EVD-01 --strict |
| Full 16-folder sweep on un-verified writers | T-CNS-03 runs 1 test folder first, verifies, then 15 |
| Lint first before normalizer collapse | Order T-SCP-01 (collapse) before T-SCP-02 (lint) in same PR |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:verdict -->
## 7. VERDICT FRAMING

**Input verdict** (from review-report.md): CONDITIONAL
**Extended verdict** (after segment-2 research): **CONDITIONAL-extended**

No severity escalation — no P1 elevated to P0, no new P0 findings. However:
- Scope expanded from 19 review tasks → 27 consolidated tasks (+42%)
- Effort estimate: ~80h review → ~105h total (+31%)
- 2 new clusters identified (D, E)
- 1 headline compound P1 confirmed (H-56-1)

Phase 017 ship decision: ship after Wave A + Wave B critical path completes. Wave D deferrable across multiple phases without blocking ship.

**Copilot-primary autonomous execution blocker**: Per `feedback_copilot_concurrency_override` (user memory) and `feedback_phase_018_autonomous` (user memory), Phase 017 plans to use cli-copilot as the Codex-fallback runtime. Cluster E (T-W1-HOK-01 + T-W1-HOK-02) MUST land before autonomous Copilot iteration launches — otherwise H-56-4 observability blind spot activates during Phase 017 itself.
<!-- /ANCHOR:verdict -->

---

<!-- ANCHOR:risks -->
## 7.5 RISKS

Full risk matrix lives in `plan.md` §7. Summary of highest-impact risks:

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-------------|
| Wave A regression in canonical save | Low | High | Vitest coverage + ×7 deep-review gate |
| T-CGC-01 + T-W1-CGC-03 split mid-rollout | Medium | Medium | Atomic-ship OR stub-rollout strategy |
| T-CNS-03 corrupts folder | Medium | High | 1-folder smoke test + per-folder commits + pre-sweep stash |
| Copilot runtime breaks on T-W1-HOK-01 | Low | Medium | Parallel Claude/Gemini coverage via shared-provenance |
| Phase 017 autonomous triggers H-56-4 | Medium | Medium | Cluster E MUST land BEFORE Copilot iteration |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7.6 OPEN QUESTIONS

Cleared during segment-2 research (refuted / ruled-out — see segment-2-synthesis.md §8). None remain open at spec-approval time. Parking-lot items for Phase 019+:

- KQ-51-6 (pre-flight for W1-CNS-04 default-flip): any 026 folders with custom `manual.*` fields an aggressive refresh might wipe?
- KQ-51-7 (test-coverage audit for 8 new Wave-1 tasks): existing suite coverage vs regression scenarios?
- Cross-finding invariant audit: do P1 remediation commits introduce new coupling creating future regression risk?
- Runtime-behavior gap analysis: are there behaviors not covered by the 152-finding registry at all?
- R55-P2-002/003/004 non-blocker maintainability parking-lot (Wave D deferral acceptable)

If any question becomes blocking during implementation, escalate via `/spec_kit:deep-research [focused-topic]`.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:phase-map -->
## 7.7 PHASE DOCUMENTATION MAP

Phase 017 has been decomposed into 4 child phases corresponding to the 4 waves. Each child owns its wave's detailed spec/plan/tasks/checklist.

| Child | Wave | Scope | Effort | Status | Depends on | Path |
|-------|------|-------|--------|--------|------------|------|
| **001-infrastructure-primitives** | A (critical) | 5 tasks — canonical save fix (H-56-1), readiness-contract extract, shared-provenance extract, normalizer collapse, evidence-marker prep | 20h | ready_for_implementation | — (first wave) | [`001-infrastructure-primitives/`](./001-infrastructure-primitives/) |
| **002-cluster-consumers** | B (parallel 3 lanes) | 9 tasks — Lane B1 Cluster B consumers (4), Lane B2 Cluster D+E (2), Lane B3 Cluster A+C+standalone (3) | 30h | ready_for_implementation | 001 | [`002-cluster-consumers/`](./002-cluster-consumers/) |
| **003-rollout-sweeps** | C (rollout) | 5 tasks — evidence-marker lint, 16-folder sweep, CP-002 amend, readiness rename, session-resume auth | 15h | ready_for_implementation | 001, 002 | [`003-rollout-sweeps/`](./003-rollout-sweeps/) |
| **004-p2-maintainability** | D (deferrable) | 6 tasks — assertNever, god-function extract, txn dedup, YAML predicate, Docker note, satisfies clause; + 3 parking-lot P2s | 40h | ready_for_implementation (deferrable) | — (no strict dep) | [`004-p2-maintainability/`](./004-p2-maintainability/) |

### Phase execution order

```
001 (Wave A, 20h, critical path)
  ↓
002 (Wave B, 30h, 3 parallel lanes B1 + B2 + B3)
  ↓
003 (Wave C, 15h, sequential w/ T-CNS-03 sweep)

004 (Wave D, 40h, deferrable — land anytime after 001 merged)
```

### Navigation

Each child folder is self-contained. Run `/spec_kit:implement` targeting a specific child, or `/spec_kit:plan --phase-folder=<child-path>` to re-plan a specific child.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:next-steps -->
## 8. NEXT STEPS

- [ ] Human review of this spec (or `:auto` mode skips approval per CLAUDE.md feedback_stop_over_confirming)
- [ ] Populate `plan.md` with full 4-wave execution plan (already scaffolded in §6)
- [ ] Populate `tasks.md` with all 27 tasks including acceptance criteria and evidence-file citations
- [ ] Populate `checklist.md` with P0/P1/P2 verification items (canonical `]` closers only)
- [ ] Run `/spec_kit:deep-review :auto` ×7 gate per `feedback_phase_018_autonomous` (user memory) after each wave code-complete
- [ ] Refresh `description.json.lastUpdated` + `graph-metadata.json.derived.*` via T-CNS-01 + T-W1-CNS-04 (ironically blocked on its own fix — initial save uses manual backfill)
<!-- /ANCHOR:next-steps -->

---

<!-- ANCHOR:references -->
## 9. REFERENCES

- Review report: `../review/016-foundational-runtime-pt-01/review-report.md`
- Segment-1 synthesis: `../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md`
- Segment-2 synthesis: `../research/016-foundational-runtime-pt-01/segment-2-synthesis.md`
- Segment-2 iterations: `../research/016-foundational-runtime-pt-01/iterations/iteration-{051..057}.md`
- Phase 016 implementation summary: `../001-initial-research/implementation-summary.md`
- Operator feedback: `feedback_copilot_concurrency_override` (user memory), `feedback_phase_018_autonomous` (user memory), `feedback_stop_over_confirming` (user memory)
<!-- /ANCHOR:references -->
