---
title: "Feature Specification [system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/007-relay-main/spec]"
description: "Completed read-only research phase on the bundled Agent Relay repository. The phase now includes both transport adoption findings and Phase 2 architecture, simplification, and UX judgments for system-spec-kit."
trigger_phrases:
  - "007-relay-main research spec"
  - "relay main phase spec"
  - "agent relay transport research"
  - "system spec kit relay study"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: 007-relay-main Research Phase

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase `007-relay-main` is a read-only research packet that studies the bundled Agent Relay repository as a source of transport, workflow, continuity, and UX patterns that could improve `system-spec-kit`. Phase 1 focused on transport-oriented adoption opportunities. Phase 2 expanded the scope to ask harder refactor, pivot, simplification, architecture, and user-experience questions about Public's own design choices.

**Key Decisions**: Keep all writes inside this phase folder; treat `external/` as read-only; preserve Public's phase-002 orchestration boundary; add explicit non-goals alongside adoption recommendations.

**Critical Dependencies**: `phase-research-prompt.md`; the bundled Agent Relay checkout under `external/`; Public comparison surfaces under `.opencode/agent/`, `.opencode/command/`, and `.opencode/skill/`; strict validation via `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-10 |
| **Branch** | `main` |
| **Phase Folder** | `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/007-relay-main/` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`Code_Environment/Public` already has strong orchestration, packet governance, validation, and memory systems, but it does not yet have an evidence-backed answer for which Relay ideas should be adopted, which should be prototyped later, and which should be rejected because they duplicate or distort existing Public architecture. The Phase 2 expansion also asks whether some current Public subsystems are overbuilt or poorly factored when compared with Agent Relay's lighter workflow, continuity, and mode-first surfaces.

### Purpose

Produce a 20-iteration evidence-backed research record that preserves Phase 1 transport findings, adds Phase 2 architecture judgments, and maps every meaningful recommendation or rejection to a concrete `system-spec-kit` file, subsystem, or operational surface.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The bundled Agent Relay repository under `external/`, especially:
  - `external/README.md`
  - `external/ARCHITECTURE.md`
  - `external/docs/introduction.md`
  - `external/packages/sdk/src/transport.ts`
  - `external/packages/sdk/src/relay.ts`
  - `external/packages/sdk/src/workflows/`
  - `external/packages/sdk/src/cli-registry.ts`
  - `external/tests/continuity.rs`
  - `external/tests/integration/broker/*.test.ts`
- Comparison against Public surfaces:
  - `.opencode/agent/orchestrate.md`
  - `.opencode/command/spec_kit/deep-research.md`
  - `.opencode/command/spec_kit/deep-review.md`
  - `.opencode/skill/sk-deep-research/`
  - `.opencode/skill/sk-deep-review/`
  - `.opencode/skill/system-spec-kit/scripts/memory/`
  - `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
  - `.opencode/skill/cli-codex/`, `.opencode/skill/cli-gemini/`, `.opencode/skill/cli-copilot/`
- Research artifacts:
  - `research/iterations/iteration-001.md` through `research/iterations/iteration-020.md`
  - `research/deep-research-state.jsonl`
  - `research/deep-research-dashboard.md`
  - `research/research.md`
  - `implementation-summary.md`

### Out of Scope
- Editing anything under `external/`
- Editing Public source code outside this phase folder
- Replacing phase 002 orchestration ownership with a Relay broker
- Replacing the Level 1/2/3+ lifecycle
- Replacing specialized deep loops with Relay's generic workflow DSL
- Commits, publishing, or memory writes outside this phase packet

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create/Modify | Phase contract, scope, and completion bar |
| `plan.md` | Create/Modify | Execution plan and verification flow |
| `tasks.md` | Create/Modify | Phase tracking for research and closeout |
| `checklist.md` | Create/Modify | Verification and evidence checklist |
| `decision-record.md` | Create/Modify | ADRs for scope and recommendation boundaries |
| `implementation-summary.md` | Create/Modify | Completed-phase closeout summary |
| `research/iterations/iteration-011.md` to `research/iterations/iteration-020.md` | Create | Phase 2 research iterations |
| `research/deep-research-state.jsonl` | Append | Phase 2 iteration records with `phase: 2` |
| `research/deep-research-dashboard.md` | Overwrite | Combined 20-iteration dashboard |
| `research/research.md` | Overwrite | Combined Phase 1 + Phase 2 synthesis |
| `phase-research-prompt.md` | Modify | Fix packet-local markdown references so the spec packet validates cleanly |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve all Phase 1 findings while extending the packet through iterations 011-020 | `research/research.md` includes combined totals and a full registry spanning both phases |
| REQ-002 | Add ten new iteration artifacts without overwriting iterations 001-010 | `research/iterations/iteration-011.md` through `research/iterations/iteration-020.md` exist and earlier files remain untouched |
| REQ-003 | At least four of the new iterations explicitly evaluate refactor, pivot, simplification, architecture, or UX questions | Phase 2 iteration files include `## Refactor / Pivot Analysis` and the dashboard reports verdict totals |
| REQ-004 | Append Phase 2 state rows with `phase: 2` and keep the JSONL valid | `research/deep-research-state.jsonl` contains 20 parseable rows with ten Phase 2 entries |
| REQ-005 | The updated synthesis distinguishes adopt-now work from architecture spikes and explicit non-goals | `research/research.md` contains a priority queue plus rejected recommendations |
| REQ-006 | Every nontrivial recommendation maps to a concrete Public subsystem or file | Iterations and synthesis name exact `.opencode/...` targets |
| REQ-007 | The packet validates successfully under strict mode after the Phase 2 write pass | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "<phase>" --strict` exits 0 |
| REQ-008 | All edits remain inside this phase folder | Post-work verification shows no writes outside `007-relay-main/` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | The merged report continues finding IDs from Phase 1's last finding ID | Phase 2 findings start at `F-010` |
| REQ-010 | The combined report adds a dedicated refactor/pivot recommendations section | `research/research.md` contains a `## Refactor / Pivot Recommendations` section |
| REQ-011 | The dashboard includes all 20 iterations and aggregated totals | `research/deep-research-dashboard.md` reflects combined counts |
| REQ-012 | Missing Level 3 packet docs are restored so the phase is structurally complete | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` all exist |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** the Phase 2 write pass is complete, **Then** iterations `011` through `020` exist and do not overwrite Phase 1 artifacts.
- **SC-002**: **Given** the merged report is complete, **Then** it records 17 actionable findings and 3 rejected recommendations.
- **SC-003**: **Given** Phase 2 verdicts are summarized, **Then** REFACTOR, PIVOT, SIMPLIFY, and KEEP totals are explicit.
- **SC-004**: **Given** the synthesis spans both phases, **Then** it preserves transport-first lessons while adding architecture and UX judgments.
- **SC-005**: **Given** the packet repair is finished, **Then** strict packet validation passes after the write pass.
- **SC-006**: **Given** the research closed out successfully, **Then** the work remains read-only with respect to `external/`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `phase-research-prompt.md` | Wrong framing would blur phase ownership | Keep the prompt aligned and packet-local references valid |
| Dependency | Agent Relay repo snapshot under `external/` | Missing or moved files would weaken evidence quality | Use direct file reads and exact line-numbered citations |
| Risk | Phase 2 repeats Phase 1 instead of extending it | Weak new signal | Read and build on the prior report before drafting new iterations |
| Risk | Refactor findings overreach into phase 002 or 005 | Recommendation churn | Explicitly record non-goals and overlap boundaries |
| Risk | Validation fails because packet docs are incomplete | Closeout blocked | Restore Level 3 docs and repair broken packet-local references |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Research should stay evidence-focused and use targeted reads rather than unnecessary whole-repo reconstruction.

### Security
- **NFR-S01**: The external Agent Relay checkout remains strictly read-only.

### Reliability
- **NFR-R01**: The JSONL state file remains parseable and sequential across all 20 iterations.

---

## 8. EDGE CASES

### Data Boundaries
- If a cited external path does not exist in this snapshot, the finding must be revised or rejected.
- If Phase 1 and Phase 2 totals drift from the state log, the synthesis is incomplete and must be corrected.

### Error Scenarios
- Strict validation failure: patch only this phase packet and rerun validation.
- Missing external evidence for a pivot claim: downgrade to `prototype later` or reject.
- Three consecutive no-signal iterations: early stop becomes allowed after iteration 015, but only if the minimum-five-new-iterations condition is satisfied.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | 20 total iterations, multiple external subsystems, multiple Public comparison seams |
| Risk | 16/25 | Recommendation quality matters; architecture judgments can mislead later packets |
| Research | 18/20 | Deep static comparison across transport, workflows, continuity, validation, and UX |
| Multi-Agent | 0/15 | User explicitly disallowed sub-agents |
| Coordination | 12/15 | Combined synthesis, JSONL append, dashboard parity, and strict validation must stay aligned |
| **Total** | **66/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Architecture recommendations over-copy Relay into the wrong subsystem | H | M | Preserve explicit KEEP and reject outcomes |
| R-002 | Packet validation fails because docs and research artifacts drift | M | M | Validate after writing and repair packet-local links |
| R-003 | Phase 2 totals drift from the appended JSONL | M | M | Parse the JSONL and cross-check dashboard/report counts |

---

## 11. USER STORIES

### US-001: Packet owner needs a combined Relay report (Priority: P0)

**As a** maintainer planning follow-on system-spec-kit work, **I want** one report that combines the Phase 1 transport findings with Phase 2 architecture judgments, **so that** I can separate adopt-now work from structural refactors and explicit non-goals.

**Acceptance Criteria**:
1. **Given** the completed packet, **When** I read `research/research.md`, **Then** I can see both Phase 1 and Phase 2 findings in one registry.
2. **Given** the dashboard, **When** I inspect the totals, **Then** I can verify combined must/should/nice/rejected counts and Phase 2 verdict counts.
3. **Given** the merged registry, **When** I scan the Phase 2 entries, **Then** each new finding continues the numbering from Phase 1 and maps to a concrete Public subsystem or file.
4. **Given** the report's priority queue, **When** I compare adopt-now work against architecture spikes, **Then** explicit non-goals and rejected recommendations are called out rather than implied.

### US-002: Operator needs structurally valid phase docs (Priority: P1)

**As a** packet maintainer, **I want** the missing Level 3 docs restored, **so that** the phase validates cleanly and future continuation work does not start from a structurally broken packet.

**Acceptance Criteria**:
1. **Given** the phase folder, **When** strict validation runs, **Then** required docs exist and packet-local markdown references resolve.
2. **Given** `phase-research-prompt.md`, **When** I follow the markdown references, **Then** they point to packet-local `external/...` paths instead of stale bare links.
3. **Given** the restored packet docs, **When** a future operator resumes work, **Then** the scope, decisions, tasks, and verification bar are discoverable without reconstructing missing context.

### US-003: Research operator needs explicit architecture verdicts (Priority: P1)

**As a** system-spec-kit operator evaluating Relay patterns, **I want** the refactor and pivot judgments separated from incremental adoption ideas, **so that** I can plan low-regret simplifications without accidentally greenlighting the wrong architectural rewrite.

**Acceptance Criteria**:
1. **Given** a refactor-heavy iteration such as `research/iterations/iteration-012.md` or `research/iterations/iteration-015.md`, **When** I read it, **Then** it contains a `## Refactor / Pivot Analysis` section with a verdict and migration path.
2. **Given** the final synthesis, **When** I review the architecture section, **Then** Phase 2 verdict totals for REFACTOR, PIVOT, SIMPLIFY, and KEEP are explicit.
3. **Given** the rejected findings, **When** I compare them with the actionable queue, **Then** I can tell which Relay ideas were intentionally not adopted and why.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should the eventual implementation packet tackle the provider-registry/doc-generation work before the deep-loop kernel refactor, or keep them in separate waves?
- Should the two-lane continuity-versus-memory pivot land inside phase 009 memory work or as a shared cross-phase design packet?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Canonical Report**: See `research/research.md`
- **Phase Dashboard**: See `research/deep-research-dashboard.md`
- **Closeout Summary**: See `implementation-summary.md`
