---
title: "...kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/001-initial-research/plan]"
description: "Dispatch plan for the six Tier 1 iterations. Contains the copy-paste-ready /spec_kit:deep-research :confirm and /spec_kit:deep-review :confirm blocks per iteration."
trigger_phrases:
  - "019 research wave plan"
  - "019 tier 1 dispatch plan"
  - "research wave dispatch blocks"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/001-initial-research"
    last_updated_at: "2026-04-18T17:15:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Plan scaffolded with dispatch blocks for all 6 Tier 1 iterations"
    next_safe_action: "Record scratch-doc SHA; begin dispatch (SSK-RR-2 first per ADR-001)"
    key_files: ["plan.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
# Implementation Plan: 019 Initial Research Wave

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + canonical spec-kit skill-owned commands |
| **Framework** | Spec Kit Level 3 child packet + `/spec_kit:deep-{research,review}` workflows |
| **Storage** | `../../research/019-system-hardening-001-initial-research/` and `../../review/019-system-hardening-001-initial-research/` |
| **Testing** | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <folder> --strict` |

### Overview

This plan coordinates the wave-ordered dispatch of six sub-packets (`001-006/`), each running one canonical `/spec_kit:deep-research :auto` or `/spec_kit:deep-review :auto` invocation. Individual dispatch commands live in each sub-packet's `plan.md §4.1`. This parent plan handles wave gating (Wave 1 → Wave 2 → Wave 3), scratch-doc SHA recording, and consolidated findings propagation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Parent packet charter approved.
- [x] Six dispatch blocks transcribed into this plan.
- [ ] Scratch-doc commit hash recorded in `implementation-summary.md §Dispatch Log`.
- [ ] Executor default (`cli-codex gpt-5.4 high fast`) confirmed available.

### Definition of Done

- [ ] All six iterations reach convergence, documented defer, or partial convergence.
- [ ] Findings registry written to `implementation-summary.md §Findings Registry`.
- [ ] Strict validation passes on the packet.
- [ ] Parent packet `../implementation-summary.md` updated with wave outcome.
<!-- /ANCHOR:quality-gates -->

---

### AI Execution Protocol

### Pre-Task Checklist

- Record the scratch-doc commit hash before first dispatch.
- Confirm executor availability (cli-codex; fallback to native if unavailable).
- Respect the Copilot 3-concurrent dispatch cap if any iteration routes to cli-copilot (documented in CLAUDE.md auto-memory).

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-DISPATCH-001 | All iterations use `/spec_kit:deep-research :confirm` or `/spec_kit:deep-review :confirm` | Gate 4 HARD-block |
| AI-DISPATCH-002 | SSK-RR-2 dispatches first per ADR-001 | Infrastructure-integrity findings surface early, allowing wave-wide adjustment if canonical-save contracts are broken |
| AI-DISPATCH-003 | DR-1 dispatches alongside SSK-RR-2 as the first parallel pair | DR-1 is a review against shipped code; it doesn't depend on other Tier 1 items |
| AI-DISPATCH-004 | RR-1 and RR-2 dispatch after SSK-RR-2 confirms pipeline integrity | Avoids wasted iterations if canonical-save is broken |
| AI-DISPATCH-005 | SSK-RR-1 and SSK-DR-1 dispatch last | Both touch skill-wide invariants; benefit from evidence produced by earlier iterations |
| AI-REGISTRY-001 | Every iteration completion writes exactly one registry entry | No silent drops; `NO-ACTION-REQUIRED` is a valid entry |

### Status Reporting Format

- Start state: which iteration is being dispatched, its iteration budget, its executor
- Work state: current iteration count + convergence signal
- End state: findings count + severity breakdown + proposed cluster

### Blocked Task Protocol

1. If an iteration exceeds budget without convergence, escalate for scope narrowing or extension.
2. If SSK-RR-2 surfaces a canonical-save integrity P0, pause subsequent dispatches until addressed.
3. If executor cli-codex is unavailable and native fallback can't meet schedule, pause the wave until resolved.

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One child packet dispatching six iterations through two canonical command surfaces.

### Key Components

- **Dispatch blocks (this file)**: six copy-paste-ready commands
- **Research iteration tree**: `../../research/019-system-hardening-001-initial-research/iterations/` directory (iteration-NNN markdown files produced per round)
- **Review iteration tree**: `../../review/019-system-hardening-001-initial-research/iterations/` directory (iteration-NNN markdown files produced per round)
- **State files**: `deep-research-state.jsonl`, `deep-review-state.jsonl` (canonical, skill-owned)
- **Findings registry**: `implementation-summary.md §Findings Registry`

### Dispatch Strategy

Wave dispatch order (per AI-DISPATCH-002 through AI-DISPATCH-005):

1. **Wave 1 (infrastructure surfacing)**: SSK-RR-2 + DR-1 in parallel.
2. **Wave 2 (026-scoped research)**: RR-1 + RR-2 after SSK-RR-2 confirms pipeline integrity.
3. **Wave 3 (skill-wide audits)**: SSK-RR-1 + SSK-DR-1 last.

Each wave can parallelize to saturation of executor capacity (cli-codex is the default; no concurrency cap mentioned). If any wave surfaces a P0, the parent packet can interrupt and redirect.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Scaffold packet docs.
- [ ] Record scratch-doc SHA at dispatch time.
- [ ] Confirm executor availability.

### Phase 2: Wave 1 — Infrastructure Surfacing

- [ ] Dispatch SSK-RR-2 (canonical-save pipeline invariant research).
- [ ] Dispatch DR-1 (delta-review 015's 243 findings).
- [ ] Converge both; record registry entries.

### Phase 3: Wave 2 — 026-Scoped Research

- [ ] Dispatch RR-1 (Q4 NFKC robustness).
- [ ] Dispatch RR-2 (description.json regen strategy).
- [ ] Converge both; record registry entries.

### Phase 4: Wave 3 — Skill-Wide Audits

- [ ] Dispatch SSK-RR-1 (Gate 3 + skill-advisor routing accuracy).
- [ ] Dispatch SSK-DR-1 (template v2.2 + validator joint audit).
- [ ] Converge both; record registry entries.

### Phase 5: Consolidation

- [ ] Consolidate all six iteration outputs into the findings registry.
- [ ] Classify severity + proposed cluster per finding.
- [ ] Update parent packet `../implementation-summary.md` with wave outcome.
- [ ] Run `validate.sh --strict` on packet + parent.
<!-- /ANCHOR:phases -->

---

### 4.1 Sub-Packet Dispatch References

Each sub-packet's `plan.md §4.1` holds its canonical dispatch command. This parent does not duplicate them; it coordinates wave sequencing only.

| Wave | Sub-packet | Command file | Tier 1 |
|------|-----------|--------------|--------|
| 1 | `001-canonical-save-invariants/` | `001-canonical-save-invariants/plan.md §4.1` | SSK-RR-2 |
| 1 | `002-delta-review-015/` | `002-delta-review-015/plan.md §4.1` | DR-1 |
| 2 | `003-q4-nfkc-robustness/` | `003-q4-nfkc-robustness/plan.md §4.1` | RR-1 |
| 2 | `004-description-regen-strategy/` | `004-description-regen-strategy/plan.md §4.1` | RR-2 |
| 3 | `005-routing-accuracy/` | `005-routing-accuracy/plan.md §4.1` | SSK-RR-1 |
| 3 | `006-template-validator-audit/` | `006-template-validator-audit/plan.md §4.1` | SSK-DR-1 |

All commands use identical executor flags: `--executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --executor-timeout=1800`.

### 4.2 Wave Dispatch Protocol

**Wave 1** (dispatches in parallel after scratch-doc SHA recorded):
1. Navigate to `001-canonical-save-invariants/`, run its dispatch command.
2. In parallel (or sequentially): navigate to `002-delta-review-015/`, run its dispatch command.
3. Monitor both dashboards (the deep-research-dashboard output + the deep-review-dashboard output) for convergence.
4. If sub-packet 001 surfaces a canonical-save P0, halt and escalate before Wave 2.

**Wave 2** (after Wave 1 convergence):
1. Dispatch `003-q4-nfkc-robustness/` and `004-description-regen-strategy/` in parallel.
2. Converge both.

**Wave 3** (after Wave 2 convergence):
1. Dispatch `005-routing-accuracy/` and `006-template-validator-audit/` in parallel.
2. Converge both.

### 4.3 Legacy — Original Embedded Dispatch Blocks

Originally, this plan held all 6 `/spec_kit:deep-research :confirm` and `/spec_kit:deep-review :confirm` blocks inline (see repo history pre-2026-04-18). They were removed in favor of sub-packet delegation per ADR-003 below, because canonical sk-deep-research / sk-deep-review workflows own one `deep-research-state.jsonl` per spec folder — running all 6 dispatches under this single packet would collide state.

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural validation | This packet | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh 019-system-hardening/001-initial-research --strict` |
| Convergence check | Each iteration | Skill-owned state machine (deep-research-state.jsonl, deep-review-state.jsonl) |
| Registry audit | `implementation-summary.md §Findings Registry` | Manual review + optional JSON mirror |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `/spec_kit:deep-research :confirm` command | Internal | Green | Gate 4 mandates canonical dispatch |
| `/spec_kit:deep-review :confirm` command | Internal | Green | Gate 4 mandates canonical dispatch |
| `cli-codex gpt-5.4 high fast` executor | External | Green (per user memory `feedback_codex_cli_fast_mode`) | Fallback to native |
| Scratch doc | Internal | Green | Authoritative source for Tier 1 scope |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: SSK-RR-2 surfaces a P0 that invalidates in-flight iterations, or executor infrastructure fails broadly.
- **Procedure**: Pause all pending dispatches. Preserve completed iteration evidence. Record a partial registry with completed items. Escalate to the parent packet for wave-level decision (hotfix child vs. defer remaining items).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Setup
        |
        v
Wave 1: SSK-RR-2 + DR-1 (parallel)
        |
        v
Wave 2: RR-1 + RR-2 (parallel, after Wave 1 confirms pipeline integrity)
        |
        v
Wave 3: SSK-RR-1 + SSK-DR-1 (parallel, last)
        |
        v
Consolidation into findings registry
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Charter approval | All waves |
| Wave 1 | Setup | Wave 2 (conditional on SSK-RR-2 integrity check) |
| Wave 2 | Wave 1 | Wave 3 |
| Wave 3 | Wave 2 | Consolidation |
| Consolidation | All waves | Parent packet closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.25 day |
| Wave 1 (SSK-RR-2 + DR-1) | Medium-High | 3-4 days wall clock |
| Wave 2 (RR-1 + RR-2) | Medium-High | 3-4 days wall clock |
| Wave 3 (SSK-RR-1 + SSK-DR-1) | Medium | 2-3 days wall clock |
| Consolidation | Low-Medium | 0.5 day |
| **Total** |  | **~8-11 days wall clock** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Dispatch blocks verified verbatim from scratch doc
- [x] Executor default confirmed
- [ ] Scratch-doc SHA recorded

### Rollback Procedure
1. Pause all in-flight iterations via the canonical command surface.
2. Preserve completed iteration evidence under `research/` and `review/`.
3. Write a partial registry entry for each paused item with reason.
4. Escalate to parent packet for wave-level decision.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. Research + review outputs only.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
scratch/deep-review-research-suggestions.md (Tier 1 candidates)
       |
       v
Dispatch blocks (this plan)
       |
       +--> Wave 1 (SSK-RR-2 + DR-1)
       |        |
       |        v
       +--> Wave 2 (RR-1 + RR-2)
       |        |
       |        v
       +--> Wave 3 (SSK-RR-1 + SSK-DR-1)
       |
       v
Findings registry (implementation-summary.md)
       |
       v
Parent packet closeout + sibling implementation children
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| `plan.md` dispatch blocks | Scratch doc | Canonical invocation text | Wave execution |
| Wave 1 | Dispatch blocks, executor availability | Infrastructure-integrity verdict | Wave 2 |
| Wave 2 | Wave 1 | 026-scoped findings | Wave 3 |
| Wave 3 | Wave 2 | Skill-wide findings | Consolidation |
| Findings registry | All waves | Cluster-to-child mapping | Parent packet closeout |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Record scratch-doc SHA** — short — CRITICAL (blocks audit reconciliation)
2. **Wave 1 convergence (SSK-RR-2 + DR-1)** — medium-high — CRITICAL
3. **Wave 2 convergence (RR-1 + RR-2)** — medium-high — CRITICAL
4. **Wave 3 convergence (SSK-RR-1 + SSK-DR-1)** — medium — CRITICAL
5. **Registry consolidation** — short — CRITICAL

**Total Critical Path**: approximately 8-11 days wall clock.

**Parallel Opportunities**: iterations within each wave dispatch in parallel subject to executor capacity. Registry skeleton can be authored while Wave 3 finishes.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Dispatch ready | Scratch-doc SHA recorded, executor confirmed | Day 1 |
| M2 | Wave 1 converged | SSK-RR-2 + DR-1 registry entries written | Day 3-4 |
| M3 | Wave 2 converged | RR-1 + RR-2 registry entries written | Day 6-8 |
| M4 | Wave 3 converged | SSK-RR-1 + SSK-DR-1 registry entries written | Day 9-11 |
| M5 | Registry consolidated | All six entries classified with severity + cluster | Within 1 day of M4 |
| M6 | Parent closeout signal | `../implementation-summary.md` updated with wave outcome | Within 1 day of M5 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for ADRs covering dispatch strategy and findings registry schema.
