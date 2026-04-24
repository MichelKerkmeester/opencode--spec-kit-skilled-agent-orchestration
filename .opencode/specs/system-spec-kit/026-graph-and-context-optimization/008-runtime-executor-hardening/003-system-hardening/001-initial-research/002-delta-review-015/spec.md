---
title: "...text-optimization/008-runtime-executor-hardening/003-system-hardening/001-initial-research/002-delta-review-015/spec]"
description: "Deep-review sub-packet covering the DR-1 Tier 1 item. Re-audit all 243 findings from 015-deep-review-and-remediation against current main post-016/017/018 ship. Classify each as ADDRESSED / STILL_OPEN / SUPERSEDED / UNVERIFIED. Wave 1 dispatch per ADR-001 of 019/001."
trigger_phrases:
  - "delta review 015 findings"
  - "dr-1 delta review"
  - "243 findings delta audit"
  - "015 remediation scope narrowing"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/001-initial-research/002-delta-review-015"
    last_updated_at: "2026-04-18T17:45:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Deep-review packet scaffolded"
    next_safe_action: "Dispatch /spec_kit:deep-review :auto"
    blockers: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
---
# Feature Specification: Delta-Review of 015's 243 Findings

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Originating Source** | ../../../scratch/deep-review-research-suggestions.md §3 DR-1 |
| **Wave** | 1 (infrastructure surfacing) |
| **Dispatch** | `/spec_kit:deep-review :auto` |

Packet 015-deep-review-and-remediation shipped its 120-iteration review producing 243 findings (1 P0, 114 P1, 133 P2) but never executed the remediation workstreams. Meanwhile, phases 016/017/018 shipped ten architectural primitives (readiness-contract, shared-provenance, retry-budget, caller-context, etc.) that likely addressed a non-trivial subset of those P1 findings incidentally. Without a delta-review, any Workstream 0 restart risks redoing work that already landed.

This packet runs the canonical sk-deep-review workflow to re-audit all 243 findings against current `main`, classifying each as ADDRESSED (with commit evidence), STILL_OPEN (with current reproduction evidence), SUPERSEDED (replaced by a different design), or UNVERIFIED (evidence is gone, needs fresh look). Output: a narrowed residual backlog that grounds future 015 remediation scope.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (release-readiness input for the 015 P0 blocker reconsolidation fix) |
| **Status** | Spec Ready, Awaiting Dispatch |
| **Created** | 2026-04-18 |
| **Branch** | `main` |
| **Parent Packet** | `../` (019-system-hardening/001-initial-research) |
| **Source Findings** | the 015 review-report file (1535 lines, 120 iterations, 243 findings) |
| **Iteration Budget** | 7-10 |
| **Executor** | cli-codex gpt-5.4 high fast (timeout 1800s) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 015 review produced 243 findings with verdict CONDITIONAL, gating any release on 1 P0 + 114 P1 triage. Since then, phases 016/017/018 shipped substantial architectural changes to the exact surfaces 015 reviewed (handlers/save/, handlers/code-graph/, hooks/, lib/). Examples of likely incidental addressing:

- 015 P0 reconsolidation-bridge.ts:208-250 cross-scope merge — phase 016 introduced Zod HookStateSchema + predecessor CAS + 4-state TrustState + per-subcommand COMMAND_BRIDGES. Some of these may collapse the P0 finding's root cause.
- Path-boundary P1 cluster (5 findings) — phase 016's shared-provenance + readiness-contract modules reshape the validator surface.
- Code-graph sibling asymmetry P1 — phase 016's T-CGQ-09/10/11/12 + Cluster D remediation should have addressed R6-P1-001 and similar.

Without a systematic re-audit, the 015 Workstream 0+ remediation plan would include phantom fixes. The scratch doc §3 DR-1 identifies this as the highest-leverage Tier 1 item because it directly unblocks 015 closure.

### Purpose

Systematically re-verify each of the 243 findings against current main, produce a delta classification per finding, and output a narrowed residual STILL_OPEN backlog as the actual starting point for any 015 remediation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### 3.1 In Scope

- Re-audit all 243 findings from the 015 review-report file.
- For each finding: verify the cited file:line still reproduces the defect OR confirm it was addressed by an interim commit (link to commit hash).
- Classify: ADDRESSED / STILL_OPEN / SUPERSEDED / UNVERIFIED.
- Produce delta report at the 015 delta-report file with counts per class and links to addressing commits.
- Narrow STILL_OPEN backlog to the actual Workstream 0+ starting scope.
- Review dimensions: correctness, security, contracts, documentation.

### 3.2 Out of Scope

- Re-running the original 120-iteration 015 review. This packet is a delta-audit, not a re-review.
- Remediation of STILL_OPEN findings. That belongs to a 015 Workstream 0+ restart after this delta.
- Evaluating findings outside 015's packet set (009/010/012/014). Out-of-015 findings are parent-registry scope.

### 3.3 Files to Read (review inputs)

- the 015 review-report file (primary source: 243 findings)
- the 015 plan.md file (11-workstream structure, Phase 0 P0, Phase 0b path-boundary)
- Current `main` state at cited file paths from each finding
- `git log` for commits since 015 shipped (2026-04-16 onward) with scope hints touching 009/010/012/014
- Phase 016/017/018 `implementation-summary.md` to cross-reference which commits addressed which 015 findings
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 243 findings must have a delta classification | Output delta report row count matches 015 review count |
| REQ-002 | ADDRESSED classifications must cite the addressing commit hash | Every ADDRESSED row has a non-empty commit reference |
| REQ-003 | 015 P0 reconsolidation-bridge finding must be explicitly verified | Review report §P0 Verification section confirms or refutes the fix |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | STILL_OPEN backlog must be actionable for remediation scoping | Each STILL_OPEN row has current file:line evidence |
| REQ-005 | SUPERSEDED findings must cite the replacement design | SUPERSEDED rows reference the 016/017/018 ADR or primitive that replaced the original approach |
| REQ-006 | UNVERIFIED findings must have a proposed re-audit path | UNVERIFIED rows note what evidence would be needed to classify |
<!-- /ANCHOR:requirements -->

---

### Acceptance Scenarios

**Given** a finding cited a specific file:line, **when** the delta review runs, **then** the current state of that file:line is cited verbatim in the classification.

**Given** a finding was ADDRESSED by an interim commit, **when** the delta report is written, **then** the commit hash + message is included as evidence.

**Given** the 015 P0 reconsolidation-bridge issue is audited, **when** the review converges, **then** either the P0 is confirmed still reproducible on main OR specific architectural primitives (e.g., 4-state TrustState, predecessor CAS) are credited for addressing it.

**Given** a finding's evidence is gone (file renamed, function removed), **when** classified as UNVERIFIED, **then** the classification row proposes a specific next step.

**Given** the delta report is written, **when** counts are tallied, **then** they sum to 243 without gaps.

**Given** STILL_OPEN findings are narrowed, **when** the parent 019/001 registry receives them, **then** they map to a proposed remediation cluster suitable for a 015 Workstream 0+ implementation child.

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Delta report exists at the 015 delta-report file with all 243 rows classified.
- **SC-002**: 015 P0 verification section explicitly confirms or refutes the reconsolidation-bridge fix.
- **SC-003**: STILL_OPEN residual backlog is < 243 (the whole point of the delta is to shrink the actionable set).
- **SC-004**: Findings propagated to parent `019/001/implementation-summary.md §Findings Registry` with cluster assignment.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `/spec_kit:deep-review :auto` command | High | Gate 4 |
| Dependency | 015 review-report.md source | High | Pre-existing; read-only input |
| Risk | 243 findings exceed 7-10 iteration budget | Medium | Iteration can batch-process findings; accept PARTIAL convergence if budget lapses |
| Risk | 015 P0 found to be unfixed | High | REQ-003 + P0 escalation via parent continuity blockers |
<!-- /ANCHOR:risks -->

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability

- **NFR-R01**: Delta report is append-only during iteration; final consolidation produces a single clean version.
- **NFR-R02**: Every classification cites current evidence; no inferred classifications without source.

### Security

- **NFR-S01**: Review outputs stay local to `review/` tree.

---

## L2: EDGE CASES

- If a 015 finding cited a file that no longer exists, classify as SUPERSEDED if the feature was replaced or UNVERIFIED if the surrounding scope is simply gone.
- If multiple 015 findings collapse into one under current main, group them in the delta report with a unified classification + cross-refs.

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | 243 findings to re-audit |
| Risk | 14/25 | Could surface P0 still unfixed |
| Research | 16/20 | Deep-review workflow; evidence-gathering |
| Multi-Agent | 4/15 | Single executor |
| Coordination | 8/15 | Parent-child plus 015 packet cross-reference |
| **Total** | **60/100** | **Level 2 appropriate** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **Q-001**: Should findings that appear partially addressed (e.g., fix landed for one call site but others remain) be classified as STILL_OPEN or SUPERSEDED? Convention to set during first iteration.
- **Q-002**: Should delta report classifications apply at finding-level or cluster-level? Finding-level is more granular but verbose.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md` (dispatch command)
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Packet**: `../spec.md`
- **Scratch Source**: `../../../scratch/deep-review-research-suggestions.md` §3 Tier 1 DR-1
- **Upstream Findings**: the 015 review-report file
