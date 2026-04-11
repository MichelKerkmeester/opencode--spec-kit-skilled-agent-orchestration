---
title: "Feature Specification: Gate F — Archive Permanence [template:level_2/spec.md]"
description: "Gate F turns the 180-day archive observation window into a permanent decision. It defines how `archived_hit_rate` is evaluated, when humans must intervene, and which conditional code changes are allowed if the archive is retired."
trigger_phrases:
  - "gate f"
  - "archive permanence"
  - "archived_hit_rate"
  - "ewma alpha 0.1"
  - "retire keep investigate"
importance_tier: "important"
contextType: "general"
---
# Feature Specification: Gate F — Archive Permanence

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-11 |
| **Branch** | `018-canonical-continuity-refactor` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Gate B introduced the bounded archive and started the 180-day observation window, but the packet still needs a final permanence decision that can survive audit and rollback review. Without a strict Gate F rulebook, the team could retire the archive on a quiet stretch, keep it forever on weak evidence, or hide intent-level dependence behind a calm global average.

### Purpose
Use iter 036's EWMA and stability rules to classify the archived tier as RETIRE, KEEP, INVESTIGATE, or ESCALATE with a complete evidence package and only the minimum conditional code follow-up.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Pull the full 180-day `archived_hit_rate` daily series that started at the Gate B archive flip.
- Apply iter 036 exactly: eligibility floors, weekly seasonality correction, EWMA `alpha=0.1`, variance bounds, slope guard, and decision ladder.
- Record the outcome and evidence package in `implementation-summary.md`, including top archive-only queries, fresh-doc comparisons, and cost notes.
- If and only if RETIRE is supported, prepare the small retirement code path and phase 021 follow-up.

### Out of Scope
- Starting a new observation window - Gate F consumes the existing 180-day window.
- Broad routing redesign - investigate outcomes only file a follow-up.
- Hard-deleting archived source data - iter 036 requires logical retirement first and snapshot safety before any irreversible cleanup.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/006-gate-f-archive-permanence/spec.md` | Modify | Define the Gate F decision contract and scope boundaries. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/006-gate-f-archive-permanence/plan.md` | Modify | Document execution order, dependencies, and rollback posture. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/006-gate-f-archive-permanence/tasks.md` | Modify | Capture evaluation, evidence, and conditional follow-up tasks. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/006-gate-f-archive-permanence/checklist.md` | Modify | Encode the exit gate and conditional verification rules. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/006-gate-f-archive-permanence/implementation-summary.md` | Modify | Pre-build the decision evidence shell to fill after evaluation. |
| `mcp_server/lib/search/stage1-candidate-gen.ts` | Modify if RETIRE | Remove archived rows from live candidate generation. |
| `mcp_server/lib/storage/incremental-index.ts` | Modify if RETIRE | Stop reindexing archived rows into the live tier. |
| `scripts/memory/retirement-018.ts` | Create if RETIRE | Snapshot archived rows into a read-only recovery artifact. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Gate F uses iter 036 as the authoritative permanence rulebook. | Decision logic references daily slot-share `archived_hit_rate`, EWMA `alpha=0.1`, weekly seasonality correction, eligible-day floors, and the retire/keep/investigate ladder. |
| REQ-002 | Stability is defined, not inferred. | The evaluation checks 30 consecutive eligible days, rolling 30-day standard deviation, max raw-rate spike guard, 14-day EWMA slope, and anomaly-day handling before any decision is recorded. |
| REQ-003 | Ambiguous or unsafe outcomes stop automation. | Any missing telemetry, mixed-band streak, or intent-slice dependence above the iter 036 guardrails produces an escalation package instead of a silent auto-decision. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The evidence package is complete enough for human review. | `implementation-summary.md` captures trend data, query-class breakdown, top 20 archive-only queries, fresh-doc comparisons, and keep-vs-retire cost notes. |
| REQ-005 | Retirement work stays conditional and small. | Runtime code edits are scoped only to `stage1-candidate-gen.ts`, `incremental-index.ts`, and `scripts/memory/retirement-018.ts`, and only after RETIRE is justified. |
| REQ-006 | Non-retire outcomes produce the right follow-up artifact. | KEEP closes with documented rationale and no code changes; INVESTIGATE or ESCALATE opens a routing-refinement or human-review follow-up instead of retiring the tier. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reviewer can rerun the same 180-day dataset through the iter 036 rulebook and reach the same Gate F classification.
- **SC-002**: The evidence package explains whether archive demand is global noise, intent-local dependency, or true long-tail value.
- **SC-003**: If RETIRE is chosen, the live search path stops serving archived rows while rollback readiness remains intact through a cold snapshot.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `research/iterations/iteration-036.md` | Gate F has no defensible stability definition without it. | Treat iter 036 as the binding rulebook and cite it throughout the decision package. |
| Dependency | `memory_stats` `archived_hit_rate` daily series from Gate B onward | No metric series means no permanence decision. | Halt at ESCALATE and package the telemetry gap instead of substituting approximate data. |
| Dependency | `resource-map.md` Gate F execution order | Missing the overlap note would incorrectly restart the observation window. | Preserve the parent note that the 180-day window started at Gate B, not at Gate F kickoff. |
| Risk | Global averages look calm while one intent slice still depends on archive hits. | High | Break down the metric by intent and spec-family, and escalate if any slice exceeds iter 036's investigate guardrail. |
| Risk | A short holiday dip or outage creates a false retirement streak. | Medium | Exclude ineligible and anomaly days from the 30-day streak, and show them in the evidence package. |
| Risk | Retirement is treated as hard deletion instead of logical removal. | High | Require snapshot readiness, restore rehearsal, and Option F phase 021 follow-up before any irreversible cleanup. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Only days with `presented_slots >= 1000` and `unique_queries >= 100` count toward the permanence streak.
- **NFR-P02**: The evidence package must include the 90-day trend view plus the top 20 archive-only query comparison set without truncating the decision-critical samples.

### Security
- **NFR-S01**: No retirement path may destroy archived source data on first decision; snapshot storage remains mandatory.
- **NFR-S02**: Human sign-off is required before any RETIRE_CANDIDATE becomes a live retirement action.

### Reliability
- **NFR-R01**: Telemetry gaps longer than 3 consecutive days invalidate an automatic retirement streak.
- **NFR-R02**: If more than 20% of days in the candidate window are ineligible or anomalous, the phase escalates instead of auto-deciding.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty or partial window: stop at ESCALATE; Gate F requires the full 180-day history.
- Low-volume day: chart it, but do not count it toward the 30-day permanence streak.
- Weekday skew: apply iter 036 day-of-week correction only when the trailing 56-day index is supported and meaningfully separated.

### Error Scenarios
- Telemetry outage: mark anomaly days, include them in the evidence package, and block retirement.
- Mixed-band behavior: if the streak crosses retire and keep thresholds inside the same window, escalate to humans.
- Missing fresh-doc comparison data: do not infer archive-only demand from query text alone; package the gap as unresolved evidence.

### State Transitions
- RETIRE: logical removal first, snapshot preserved, then phase 021 Option F follow-up opens.
- KEEP: retain the thin archive layer permanently and close without code edits.
- INVESTIGATE: keep the archive live, file routing refinement work, and avoid retirement changes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Five phase docs now, plus at most three small runtime files if RETIRE is justified. |
| Risk | 19/25 | The decision affects long-term retrieval behavior and must remain rollback-safe. |
| Research | 11/20 | The rulebook exists, but the live 180-day evidence still has to be assembled and interpreted. |
| **Total** | **46/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None at authoring time. The remaining unknown is the measured 180-day classification, which Gate F resolves from live data rather than additional design debate.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
