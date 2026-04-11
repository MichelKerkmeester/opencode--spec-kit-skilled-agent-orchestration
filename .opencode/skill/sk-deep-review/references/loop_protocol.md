---
title: Deep Review Loop Protocol
description: Complete lifecycle specification for the autonomous deep review loop — initialization, iteration, convergence, synthesis, and save phases.
---

# Deep Review Loop Protocol

Complete lifecycle specification for the autonomous deep review loop.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The deep review loop has 4 phases: initialization, iteration (repeated), synthesis, and save. The YAML workflow manages the lifecycle; the `@deep-review` agent (LEAF-only, no WebFetch) executes individual review iterations with fresh context each time.

```
┌──────────────┐     ┌───────────────────────────────┐     ┌───────────────┐     ┌──────────┐
│  INIT        │────>│  LOOP                         │────>│  SYNTHESIS    │────>│  SAVE    │
│              │     │  ┌─────────────────────────┐  │     │               │     │          │
│ Scope        │     │  │ Read State              │  │     │ Finding       │     │ Memory   │
│ Discovery    │     │  │ Check Convergence       │  │     │ Registry      │     │ Context  │
│ Dimension    │     │  │ Check Pause Sentinel    │  │     │ Dedup         │     │ Save     │
│ Ordering     │     │  │ Generate State Summary  │  │     │               │     │          │
│ Traceability │     │  │ Dispatch @deep-review   │  │     │ Severity      │     │          │
│ Planning     │     │  │ Evaluate Results        │  │     │ Reconcile     │     │          │
│ State Files  │     │  │ Claim Adjudication      │  │     │               │     │          │
│              │     │  │ Dashboard Generation    │  │     │ Replay        │     │          │
│              │     │  │ Loop Decision           │  │     │ Validation    │     │          │
│              │     │  └────────┬────────────────┘  │     │               │     │          │
│              │     │           │ repeat            │     │ review-report │     │          │
│              │     │           │                   │     │ (9 sections)  │     │          │
└──────────────┘     └───────────────────────────────┘     └───────────────┘     └──────────┘
```

### Core Innovation

Each agent dispatch gets a fresh context window. State continuity comes from files on disk, not in-context memory. This eliminates context degradation in long review sessions where accumulated findings would otherwise bias subsequent dimensions.

### Key References

| Resource | Path | Purpose |
|----------|------|---------|
| Review contract | `assets/review_mode_contract.yaml` | Dimensions, verdicts, gates, protocols |
| Auto workflow | `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Unattended review loop |
| Confirm workflow | `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Step-by-step review with approval gates |
| Agent | `@deep-review` (LEAF) | Single iteration executor; no sub-agents, no WebFetch |
| Memory save | `generate-context.js` | Context preservation script |

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:phase-initialization -->
## 2. PHASE 1: INITIALIZATION

### Purpose

Set up all state files for a new review session. Discover the scope, order dimensions by risk priority, establish the traceability protocol plan, and create the review state packet.

### Steps

1. **Classify session state before writing**:
   - `fresh`: no config/state/strategy files exist
   - `resume`: config + state + strategy all exist and agree
   - `completed-session`: consistent prior state with `config.status == "complete"`
   - `invalid-state`: partial or contradictory artifacts

2. **Create spec folder** (if needed): `mkdir -p {spec_folder}/review/iterations`

3. **Scope discovery**: Resolve the review target into a concrete file list using one of 5 target types:

   | Target Type | CLI Value | Resolution Strategy |
   |-------------|-----------|---------------------|
   | **Spec Folder** | `spec-folder` | Read `spec.md`, `plan.md`, implementation files listed in `tasks.md` |
   | **Skill** | `skill` | Read `SKILL.md`, `references/`, `assets/`, `scripts/`, find agent definitions and command entry points |
   | **Agent** | `agent` | Find agent definitions across all runtimes, compare for consistency |
   | **Track** | `track` | List all child spec folders under the track, read `spec.md` + `checklist.md` for each |
   | **Files** | `files` | Expand glob patterns, validate existence, discover cross-references |

   Store the resolved file list in strategy.md "Files Under Review".

4. **Dimension ordering**: Order the 4 review dimensions for iteration based on risk priority:

   | Priority | Dimension | Rationale |
   |----------|-----------|-----------|
   | 1 | Correctness | Logic errors have the highest blast radius |
   | 2 | Security | Vulnerabilities require immediate attention |
   | 3 | Traceability | Spec/code alignment ensures completeness |
   | 4 | Maintainability | Patterns and documentation quality (lowest immediate risk) |

   Default order: D1 Correctness, D2 Security, D3 Traceability, D4 Maintainability. This order is configurable but the default prioritizes highest-impact dimensions first.

5. **Traceability protocol planning**: Partition the 6 cross-reference protocols into core vs overlay, and schedule only applicable overlays for the target type:

   | Level | Protocol | Applies To | Gate Class | Purpose |
   |-------|----------|------------|------------|---------|
   | Core | `spec_code` | all targets | hard | Verify normative claims resolve to shipped behavior |
   | Core | `checklist_evidence` | all targets | hard | Verify checked completion claims have evidence |
   | Overlay | `skill_agent` | skill | advisory | Verify SKILL.md and runtime agents agree |
   | Overlay | `agent_cross_runtime` | agent | advisory | Verify runtime agent parity |
   | Overlay | `feature_catalog_code` | skill, spec-folder, track, files | advisory | Verify catalog claims match capability |
   | Overlay | `playbook_capability` | skill, agent, spec-folder | advisory | Verify playbook scenarios match executable reality |

   Only schedule overlay protocols that apply to the resolved target type.

6. **Write config**: `{spec_folder}/review/deep-review-config.json` with `mode: "review"`, lineage metadata (`sessionId`, `parentSessionId`, `lineageMode`, `generation`, `continuedFromRun`, `releaseReadinessState`), and review-specific fields including target, target type, dimensions, protocol plan, and release-readiness state.

7. **Initialize state log**: First line of `{spec_folder}/review/deep-review-state.jsonl` with config record including `mode: "review"` and the lineage fields.

8. **Initialize reducer state**: Create `{spec_folder}/review/deep-review-findings-registry.json` with empty `openFindings`, `resolvedFindings`, `repeatedFindings`, `dimensionCoverage`, `findingsBySeverity`, and `convergenceScore`.

9. **Initialize strategy**: `{spec_folder}/review/deep-review-strategy.md` from review template with:
   - Topic (review target description)
   - Review Dimensions checklist
   - Files Under Review table
   - Cross-Reference Status table grouped by core vs overlay
   - Known Context from `memory_context()` results (if any)
   - Review Boundaries from config

10. **Validate review charter**:
   - Verify strategy.md contains Non-Goals and Stop Conditions sections (may be empty but must exist)
   - In **confirm mode**: present the charter (target, dimensions, scope, non-goals) for user review before proceeding
   - In **auto mode**: accept automatically and continue

11. **Resume only if config, JSONL, strategy, and findings registry agree**; otherwise halt for repair instead of guessing.

### Outputs

| File | Location | Purpose |
|------|----------|---------|
| Config | `{spec_folder}/review/deep-review-config.json` | Review parameters (immutable after init) |
| State | `{spec_folder}/review/deep-review-state.jsonl` | Iteration log (1 initial line) |
| Registry | `{spec_folder}/review/deep-review-findings-registry.json` | Reducer-owned findings state |
| Strategy | `{spec_folder}/review/deep-review-strategy.md` | Dimensions, findings, next focus |

---

<!-- /ANCHOR:phase-initialization -->
<!-- ANCHOR:phase-iteration-loop -->
## 3. PHASE 2: ITERATION LOOP

### Loop Steps (repeated until convergence)

#### Step 1: Read State

- Read `deep-review-state.jsonl` -- count iterations, extract `newFindingsRatio`, `findingsSummary`, `findingsNew`, `traceabilityChecks`, and lineage data
- Read `deep-review-findings-registry.json` -- extract `dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, and `convergenceScore`
- Read `{spec_folder}/review/deep-review-strategy.md` -- get next focus dimension/files, remaining dimensions, and protocol gaps

Reducer contract for every loop refresh:

| Reducer Part | Canonical Value | Notes |
|--------------|-----------------|-------|
| Inputs | `latestJSONLDelta`, `newIterationFile`, `priorReducedState` | The reducer replays only the newest JSONL delta plus the latest iteration artifact against the prior reduced state. |
| Outputs | `findingsRegistry`, `dashboardMetrics`, `strategyUpdates` | The same refresh pass updates the canonical registry, refreshes dashboard metrics, and applies strategy updates. |
| Metrics | `dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, `convergenceScore` | These metrics drive convergence decisions, dashboard summaries, and synthesis readiness. |

#### Step 2: Check Convergence

Run `shouldContinue_review()` (see `../sk-deep-research/references/convergence.md` Section 10.3):

- Max iterations reached? `STOP`
- Stuck count `>= 2` using `noProgressThreshold = 0.05`? `STUCK_RECOVERY`
- Composite convergence votes `STOP` only after:
  - Rolling average uses `rollingStopThreshold = 0.08`
  - Dimension coverage reaches 100% across the 4-dimension model
  - Coverage has aged through `minStabilizationPasses >= 1`
  - Required traceability protocols are covered
  - Evidence, scope, and coverage gates pass
- Otherwise: `CONTINUE`

If convergence math or a hard-stop candidate points to STOP, the workflow must run the review legal-stop decision tree before actually stopping. That decision tree records five review-specific gates: `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, and `hotspotSaturationGate`. If any gate fails, the loop does **not** stop. Instead it emits a first-class `blocked_stop` JSONL event with:

- `blockedBy`: array of the failed review gate names
- `gateResults`: per-gate pass/fail payloads using the review gate names above
- `recoveryStrategy`: one-line hint describing the next review action

The blocked-stop event is append-only evidence that legal-stop blocked the run; the loop then continues with the recovery or next-focus path rather than synthesizing.

Convergence signals and weights:

| Signal | Weight | Description |
|--------|--------|-------------|
| Rolling Average | 0.30 | Last 2 severity-weighted `newFindingsRatio` values average below `rollingStopThreshold` |
| MAD Noise Floor | 0.25 | Latest ratio within noise floor derived from historical ratios |
| Dimension Coverage | 0.45 | All 4 dimensions plus required traceability protocols covered, with stabilization |

**P0 override**: Any new P0 finding sets `newFindingsRatio >= 0.50`, blocking convergence regardless of composite score.

#### Step 2a: Check Pause Sentinel

Before dispatching, check for a pause sentinel file:

1. Check if `review/.deep-review-pause` exists (note: the file name uses the shared `-pause` suffix)
2. If present:
   - Log event to JSONL: `{"type":"event","event":"userPaused","mode":"review","stopReason":"userPaused","reason":"sentinel file detected"}`
   - Halt the loop with message:
     ```
     Review paused. Delete review/.deep-review-pause to resume.
     Current state: Iteration {N}, {reviewed}/{total} dimensions complete, {P0}/{P1}/{P2} findings.
     ```
   - Do NOT exit to synthesis -- the loop is suspended, not stopped
3. On resume (file deleted and loop restarted):
   - Log event: `{"type":"event","event":"resumed","fromIteration":N}`
   - Continue from step_read_state

**Use case**: In autonomous mode, this provides the only graceful intervention mechanism short of killing the process. Users can create the sentinel file at any time to pause review between iterations.

Normalization rule: if the runtime first observes a raw `paused` condition or a raw `stuck_recovery` condition, it MUST rewrite the emitted JSONL event names to `userPaused` and `stuckRecovery` before appending them. Persisted review JSONL should never contain raw `paused` or raw `stuck_recovery` rows after emission.

#### Step 2b: Generate State Summary

Generate a compact state summary (~200 tokens) for injection into the dispatch prompt:

```
STATE SUMMARY (auto-generated, review mode):
Iteration: {N} of {max} | Mode: review
Target: {config.reviewTarget} ({config.reviewTargetType})
Dimensions: {reviewed}/{total} complete | Next: {nextDimension}
Findings: P0:{count} P1:{count} P2:{count} active
Traceability: core={core_status} overlay={overlay_status}
Last 2 ratios: {ratio_N-1} -> {ratio_N} | Stuck count: {stuck_count}
Provisional verdict: {PASS|CONDITIONAL|FAIL|PENDING} | hasAdvisories={hasAdvisories}
Next focus: {strategy.nextFocus}
```

This summary is prepended to the dispatch context (Step 3) to ensure the agent has baseline context even if detailed strategy.md reading fails or is incomplete.

#### Step 3: Dispatch Agent

Dispatch `@deep-review` with review-specific context:

```
{state_summary}  // Auto-generated (Step 2b)

Review Target: {config.reviewTarget}
Review Mode: {config.reviewTargetType}
Iteration: {N} of {maxIterations}
Focus Dimension: {strategy.nextFocus.dimension}
Focus Files: {strategy.nextFocus.files}
Remaining Dimensions: {strategy.remainingDimensions}
Traceability Protocols:
  - Core: {core_protocols}
  - Overlay: {overlay_protocols}
Active Findings: {findingsSummary}
State Files:
  - Config: {spec_folder}/review/deep-review-config.json
  - State: {spec_folder}/review/deep-review-state.jsonl
  - Registry: {spec_folder}/review/deep-review-findings-registry.json
  - Strategy: {spec_folder}/review/deep-review-strategy.md
Output: Write findings to {spec_folder}/review/iterations/iteration-{NNN}.md
CONSTRAINT: LEAF agent -- do NOT dispatch sub-agents
CONSTRAINT: Target files are READ-ONLY -- never modify code under review
```

**Agent constraints**:
- `@deep-review` is LEAF-only: it cannot dispatch sub-agents
- No WebFetch: review is code-only and read-only
- Target 8-11 tool calls per iteration (max 12); breadth over depth per cycle
- Tools available: Read, Grep, Glob, Edit (state files only), mcp__cocoindex_code__search

#### Step 3a: Cross-Reference Protocol Execution

During iterations focused on the Traceability dimension, the agent executes applicable cross-reference protocols. Each protocol produces a structured result appended to the JSONL `traceabilityChecks.results[]` array.

| Protocol | Execution | Expected Output |
|----------|-----------|-----------------|
| `spec_code` | Compare normative claims in spec.md against shipped implementation | Pass/partial/fail per claim with file:line evidence |
| `checklist_evidence` | Verify every `[x]` mark in checklist.md has supporting evidence | Pass/partial/fail per checked item |
| `skill_agent` | Compare SKILL.md contracts against runtime agent definitions | Agreement/drift/disagreement per capability |
| `agent_cross_runtime` | Compare agent definitions across runtimes (.opencode, .claude, .codex, .gemini) | Parity/drift/divergence per runtime pair |
| `feature_catalog_code` | Compare catalog claims against discoverable implementation | Match/stale/missing per feature |
| `playbook_capability` | Validate playbook scenarios against executable reality | Executable/needs-update/impossible per scenario |

Each protocol result includes:
- `protocolId`: Protocol identifier
- `status`: `pass`, `partial`, or `fail`
- `gateClass`: `hard` or `advisory`
- `applicable`: Whether the protocol applies to this target type
- `counts`: `{ pass, partial, fail, skipped }`
- `evidence`: Array of file:line citations
- `findingRefs`: Array of finding IDs generated from this protocol
- `summary`: Human-readable summary text

#### Step 4: Evaluate Results

After agent completes:

1. Verify `{spec_folder}/review/iterations/iteration-{NNN}.md` was created
2. Verify JSONL was appended with review iteration fields:
   - `dimensions` (array of dimensions covered)
   - `filesReviewed` (array of file paths)
   - `findingsSummary` (cumulative P0/P1/P2 counts)
   - `findingsNew` (this iteration's new findings)
   - `traceabilityChecks` (protocol results if applicable)
3. Verify strategy.md was updated (dimension progress, findings count, protocol status)
4. Extract `newFindingsRatio` from JSONL record
5. Update stuck tracking using `noProgressThreshold = 0.05`:
   - Skip if `status == "thought"` (no change)
   - Reset to 0 if `status == "insight"` (breakthrough counts as progress)
   - Increment if `newFindingsRatio < noProgressThreshold`
   - Reset otherwise

#### Step 4a: Claim Adjudication

Before the next convergence pass, the orchestrator adjudicates every new P0/P1 finding with a **typed claim-adjudication packet**. This step prevents false positives from inflating severity and distorting convergence, AND acts as a hard STOP gate: `step_post_iteration_claim_adjudication` appends a `claim_adjudication` event to `deep-review-state.jsonl`, and the next iteration's `step_check_convergence` legal-stop decision tree consults that event via `claimAdjudicationGate` (gate `f`). A missing or failing packet vetoes STOP even when every other gate passes.

Each new P0/P1 must carry a typed packet with the following required fields (see `state_format.md` §9 for the full schema and a worked example):

| Field | Type | Description |
|-------|------|-------------|
| `findingId` | string | Matches the finding ID in the iteration body |
| `claim` | string | The single assertion the finding makes |
| `evidenceRefs` | string[] | `file:line` or `file:range` citations (≥ 1) |
| `counterevidenceSought` | string | Where the orchestrator looked for contradicting evidence |
| `alternativeExplanation` | string | An alternative explanation, even if rejected |
| `finalSeverity` | `"P0"` \| `"P1"` \| `"P2"` | Severity after adjudication |
| `confidence` | number `[0, 1]` | Orchestrator confidence in `finalSeverity` |
| `downgradeTrigger` | string | Concrete condition that would cause a future downgrade |
| `transitions` | object[] | Optional; required when `finalSeverity` differs from the originally asserted severity |

**Protocol**:

1. Re-read the cited evidence at the referenced file:line locations.
2. Seek counterevidence in adjacent code, docs, or prior iteration history.
3. Record an alternative explanation even if it is rejected.
4. Confirm or downgrade severity before the finding becomes convergence-visible.
5. Emit the typed packet inside the iteration file so `step_post_iteration_claim_adjudication` can parse it.

**Failure semantics**: when any new P0/P1 finding is missing a packet or a required field, the workflow records `{"event":"claim_adjudication","passed":false,"missingPackets":[...]}` in `deep-review-state.jsonl`. On the next loop, `step_check_convergence` step 0 (universal pre-check) routes STOP to `BLOCKED` with `blockedBy: ["claimAdjudicationGate"]` until a follow-up iteration rewrites the packet. Downgraded findings have their `finalSeverity` updated; the original severity is preserved in the iteration file for audit trail.

#### Step 4b: Generate Dashboard

Generate `{spec_folder}/review/deep-review-dashboard.md` with review-specific sections:

| Section | Content |
|---------|---------|
| Status | Provisional verdict (`PASS`/`CONDITIONAL`/`FAIL`/`PENDING`) and `hasAdvisories` flag |
| Findings Summary | P0/P1/P2 counts with deltas from previous iteration |
| Progress Table | Iteration number, focus dimension, `newFindingsRatio`, findings count, status |
| Coverage | Files reviewed, dimensions completed, traceability protocol status |
| Trend | Last 3 `newFindingsRatio` values with direction indicator (ascending/descending/flat) |
| Active Risks | Guard violations, stuck count, budget warnings |

Dashboard behavior:
- Auto-generated only -- never manually edited
- Overwritten each iteration (not appended)
- Non-blocking: if generation fails, log a warning and continue the loop
- In **confirm mode**: displayed to the user at each iteration approval gate
- In **auto mode**: written silently for post-hoc review

#### Step 5: Loop Decision

- If convergence check returns STOP: exit to synthesis
- If STUCK_RECOVERY: apply review-specific recovery strategies (see Section 3a), reset stuck count, continue
- Otherwise: increment iteration counter, go to Step 1

### Stuck Recovery (Review-Specific)

**Threshold:** 2 consecutive no-progress iterations (`noProgressThreshold = 0.05`).

| Failure Mode | Detection | Recovery Strategy |
|-------------|-----------|-------------------|
| Same dimension stuck | Last 2 iterations reviewed the same dimension with ratios `< 0.05` | **Change granularity**: if reviewing at file level, zoom into functions; if reviewing functions, zoom out to module level |
| Traceability plateau | Required protocols remain partial while ratios stay `< 0.05` | **Protocol-first replay**: re-run the unresolved traceability protocol directly against the conflicting artifacts |
| Low-value advisory churn | Last 2 iterations found only P2 work | **Escalate severity review**: explicitly search for P0/P1 patterns or downgrade unsupported severity claims |

**Selection logic**:

```
function selectReviewRecoveryStrategy(stuckIterations, state, config):
  lastFocuses = [i.focus for i in stuckIterations[-2:]]

  // Same dimension stuck? Change granularity
  if len(set(lastFocuses)) <= 1:
    return { strategy: "change_granularity", dimension: lastFocuses[0] }

  // Required protocol plateau?
  if hasRequiredProtocolPlateau(state.traceabilityChecks):
    return { strategy: "protocol_first_replay" }

  // Default: escalate severity
  return { strategy: "escalate_severity_review" }
```

**Recovery evaluation**:
- If recovery iteration finds any new P0/P1 or materially advances required traceability coverage: recovery successful. Reset stuck count. Continue.
- If recovery iteration finds only P2 or nothing: recovery failed. If all dimensions are already covered, exit to synthesis. Otherwise, move to the next unreviewed dimension.

---

<!-- /ANCHOR:phase-iteration-loop -->
<!-- ANCHOR:phase-synthesis -->
## 4. PHASE 3: SYNTHESIS

### Purpose

Compile all iteration findings into the final `{spec_folder}/review/review-report.md`. The synthesis phase owns the canonical review report output.

### Steps

#### Step 1: Finding Registry Deduplication

Consolidate findings across all iterations:

1. Read all iteration files: `{spec_folder}/review/iterations/iteration-*.md`
2. Group findings by file + line range + root cause
3. Merge duplicates, keeping the highest severity and all evidence
4. Assign final finding IDs: `F001`, `F002`, ...
5. Preserve the audit trail: note which iterations contributed to each merged finding

#### Step 2: Severity Reconciliation

Use adjudicated `finalSeverity` for any P0/P1 that was downgraded during claim adjudication (Step 4a of the iteration loop). The original severity from the iteration file is preserved in the audit appendix.

#### Step 3: Replay Validation

Recompute the convergence outcome from JSONL state before finalizing the report:

1. Read `deep-review-state.jsonl` and select review-mode iteration records in run order
2. Recompute `newFindingsRatio`, rolling-average votes, MAD votes, and coverage votes from stored JSONL fields only
3. Recompute `traceabilityChecks.summary` and confirm required protocol statuses match the recorded coverage vote
4. Re-run the evidence, scope, and coverage gates against stored findings and scope data
5. Compare the replayed decision and stop reason to the recorded synthesis event

Replay passes only when the recomputed decision, thresholds, and gate outcomes agree with the persisted result. If replay fails, log a warning in the audit appendix but proceed with synthesis.

#### Step 4: Compile review-report.md

Generate the 9-section review report (defined in `review_mode_contract.yaml` under `outputs.reviewReport`):

| # | Section | Purpose |
|---|---------|---------|
| 1 | Executive Summary | Verdict, active P0/P1/P2 counts, scope, `hasAdvisories` metadata |
| 2 | Planning Trigger | Why the verdict routes to planning or changelog follow-up |
| 3 | Active Finding Registry | Deduplicated active findings with evidence and final severity |
| 4 | Remediation Workstreams | Grouped action lanes derived from active findings |
| 5 | Spec Seed | Minimal spec delta derived from review results |
| 6 | Plan Seed | Action-ready plan starter for remediation |
| 7 | Traceability Status | Core vs overlay protocol status and unresolved gaps |
| 8 | Deferred Items | P2 advisories, blocked checks, and follow-up items |
| 9 | Audit Appendix | Coverage, replay validation, convergence evidence |

#### Step 5: Verdict Determination

Apply the verdict contract from `review_mode_contract.yaml`:

| Verdict | Condition | Next Command |
|---------|-----------|--------------|
| **FAIL** | Active P0 remains OR any required binary gate fails | `/spec_kit:plan` for remediation |
| **CONDITIONAL** | No active P0, but active P1 remains | `/spec_kit:plan` for fixes |
| **PASS** | No active P0/P1 | `/create:changelog` |

When `PASS` verdict is issued and active P2 findings remain, set `hasAdvisories = true` in the report metadata.

#### Step 6: Finalize State

1. Update config status: Set `status: "complete"` in `deep-review-config.json`
2. Write final JSONL entry:
   ```json
   {
     "type": "event",
     "event": "synthesis_complete",
     "mode": "review",
     "totalIterations": N,
     "verdict": "PASS|CONDITIONAL|FAIL",
     "activeP0": N,
     "activeP1": N,
     "activeP2": N,
     "dimensionCoverage": X,
     "stopReason": "...",
     "timestamp": "..."
   }
   ```

---

<!-- /ANCHOR:phase-synthesis -->
<!-- ANCHOR:phase-save -->
## 5. PHASE 4: SAVE

### Purpose

Preserve review context to the memory system for future session recovery and cross-session continuity.

### Steps

1. **Generate context**: Run the memory save script with the spec folder:
   ```bash
   node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js {spec_folder}
   ```

2. **No extra indexing step in the live contract**: `generate-context.js` is the supported save boundary for this workflow.

3. **Verify**: Confirm `memory/*.md` file was created with proper anchors.

### On Save Failure

If memory save fails:
- Preserve the current `review/` packet as backup (the disk state is the ground truth)
- Log the error
- The review results remain intact in `{spec_folder}/review/review-report.md` regardless of memory save status

---

<!-- /ANCHOR:phase-save -->
<!-- ANCHOR:auto-resume-protocol -->
## 6. AUTO-RESUME PROTOCOL

### Purpose

Enable review sessions to resume seamlessly from prior state when interrupted by context compaction, process termination, or intentional pause.

### Resume Detection

If state files already exist from a prior session:

1. **Verify agreement**: Confirm config, JSONL, findings registry, and strategy all exist and agree on target/spec folder
2. **Count progress**: Read JSONL, count iteration records, determine last completed iteration
3. **Read strategy**: Load current dimension progress, findings, and next focus from `deep-review-strategy.md`
4. **Set counter**: Set iteration counter to last completed + 1
5. **Log resume**: Append resume event to JSONL with lineage metadata:
   ```json
   {"type":"event","event":"resumed","lineageMode":"resume","sessionId":"rvw-...","generation":1,"fromIteration":N}
   ```
6. **Continue**: Enter the iteration loop from step_read_state

### Lifecycle Branches

| Mode | Contract |
|------|----------|
| `resume` | Continue the same `sessionId` and generation. |
| `restart` | Archive current review state, start a new `sessionId`, increment generation, and set `parentSessionId`. |
| `fork` | Copy current state as baseline, create a new `sessionId`, preserve ancestry, and continue on a new branch. |
| `completed-continue` | Snapshot `review-report-v{generation}.md`, record `completedAt`/`reopenedAt`, and continue with amendment-only additions. |

### State Validation on Resume

| Condition | Classification | Action |
|-----------|---------------|--------|
| Config + JSONL + strategy all exist and agree | `resume` | Continue from last iteration + 1 |
| All exist, config says `status: "complete"` | `completed-session` | Report completion, ask user if re-review desired |
| Partial files or contradictions | `invalid-state` | Halt for repair; do not guess |
| No files exist | `fresh` | Start new initialization |

### State Recovery Cascade

When state files are missing or corrupted, apply this priority cascade:

| Priority | Condition | Recovery Action |
|----------|-----------|----------------|
| 1 | JSONL exists and parseable | Normal operation |
| 2 | JSONL exists, strategy.md missing | Reconstruct strategy from JSONL: extract dimensions, findings, coverage |
| 3 | JSONL missing, iteration files exist | Scan `review/iterations/iteration-*.md`, reconstruct JSONL with `status: "reconstructed"` |
| 4 | Only config.json remains | Restart from initialization phase |
| 5 | Config.json also missing | Cannot recover. Report error and halt. |

Each priority level is attempted in order. If a level fails, fall through to the next.

---

<!-- /ANCHOR:auto-resume-protocol -->
<!-- ANCHOR:pause-resume -->
## 7. PAUSE/RESUME

### Pause Sentinel Behavior

The pause sentinel provides graceful loop suspension in autonomous mode without killing the process.

### Creating a Pause

Create the sentinel file at any time:

```bash
touch {spec_folder}/review/.deep-review-pause
```

The orchestrator checks for this file between iterations (Step 2a). When detected:
- The current iteration is allowed to complete
- The loop halts before dispatching the next iteration
- A paused event is logged to JSONL
- The user is notified with current state (iteration count, dimensions covered, findings)

### Resuming After Pause

Delete the sentinel file and restart the workflow:

```bash
rm {spec_folder}/review/.deep-review-pause
```

On the next invocation:
- The auto-resume protocol (Section 6) detects the existing state
- A resumed event is logged to JSONL
- The loop continues from the next iteration

### Confirm Mode Approval Gates

In confirm mode (`spec_kit_deep-review_confirm.yaml`), the workflow adds explicit approval gates instead of relying on the pause sentinel:

| Gate Location | Behavior |
|---------------|----------|
| After initialization | Show config, strategy, and scope. Wait for approval |
| After each iteration | Show iteration findings, dashboard, and convergence status. Options: Continue, Adjust Focus, Stop |
| Before synthesis | Show summary of all iterations. Wait for approval to synthesize |
| After synthesis | Show final review-report.md summary. Approve or request revisions |

---

<!-- /ANCHOR:pause-resume -->
<!-- ANCHOR:state-transitions -->
## 8. STATE TRANSITIONS

```
[INITIALIZED] --> config + strategy + state created, scope discovered
    |
[ITERATING] --> @deep-review agent dispatched, executing review cycle
    |
[EVALUATING] --> iteration complete, checking convergence
    |
    |-- newFindingsRatio >= threshold --> [ITERATING]
    |-- stuck_count >= 2 --> [STUCK_RECOVERY]
    |-- converged + gates pass --> [SYNTHESIZING]
    |-- max_iterations reached --> [SYNTHESIZING]
    |
[STUCK_RECOVERY] --> change granularity / protocol replay / escalate severity
    |
    |-- recovered (new P0/P1 or coverage advance) --> [ITERATING]
    |-- still stuck + dimensions covered --> [SYNTHESIZING] (gaps documented)
    |-- still stuck + dimensions remaining --> [ITERATING] (next dimension)
    |
[PAUSED] --> sentinel detected, loop suspended
    |
    |-- sentinel removed --> [ITERATING] (resume)
    |
[SYNTHESIZING] --> finding dedup, severity reconcile, replay validate, compile report
    |
[SAVING] --> memory context preservation via generate-context.js
    |
[COMPLETE] --> all artifacts created, loop finished
```

### Iteration Status Enum

`complete | timeout | error | stuck | insight`

- `complete`: Normal iteration with findings processed
- `timeout`: Iteration exceeded budget limits
- `error`: Iteration failed with unrecoverable error
- `stuck`: Iteration produced no meaningful new findings
- `insight`: Low `newFindingsRatio` but important finding that changes the verdict trajectory

---

<!-- /ANCHOR:state-transitions -->
<!-- ANCHOR:error-handling -->
## 9. ERROR HANDLING

| Error | Phase | Action |
|-------|-------|--------|
| Agent dispatch timeout | Loop | Retry once with reduced scope. If second timeout, mark iteration as "timeout" and continue |
| State file missing | Init/Loop | Apply state recovery cascade (Section 6) |
| JSONL malformed | Loop | Skip malformed lines, reconstruct from valid entries |
| 3+ consecutive failures | Loop | Halt loop, enter synthesis with partial findings |
| Agent dispatch failure (API overload, timeout) | Loop | Escalate through recovery tiers in order |
| Memory save fails | Save | Preserve the current `review/` packet as backup, then log the error |
| Iteration file not written | Loop | Mark iteration as failed, log error, continue to next |

### Tiered Error Recovery

Five escalating tiers, attempted in order:

| Tier | Trigger | Action | Max Attempts |
|------|---------|--------|-------------|
| 1 | Tool/source failure | Retry with alternative source or broader pattern | 2 per source |
| 2 | Focus exhaustion (2+ low-value iterations on same focus) | Pivot to different dimension or file set | 2 pivots |
| 3 | State corruption | Reconstruct JSONL from iteration files | 1 attempt |
| 4 | Agent dispatch failure | Direct mode fallback (reference-only unless runtime supports it) | 1 attempt |
| 5 | Repeated systemic failure | Escalate to user with diagnostic summary | 1 attempt |

---

<!-- /ANCHOR:error-handling -->
<!-- ANCHOR:review-quality-gates -->
## 10. REVIEW QUALITY GATES

Three binary gates must pass before a STOP decision is finalized. These gates are defined in `review_mode_contract.yaml` under `qualityGates` and are evaluated after the composite convergence score exceeds the `compositeStopScore` threshold.

### Gate Definitions

| Gate | Rule | Fail Action |
|------|------|-------------|
| **Evidence** | Every active finding has concrete `file:line` evidence and is not inference-only | Block STOP, log `guard_violation`, continue loop |
| **Scope** | Findings and reviewed files stay within the declared review scope | Block STOP, log `guard_violation`, continue loop |
| **Coverage** | Configured dimensions and required traceability protocols must be covered before STOP is allowed | Block STOP, log `guard_violation`, continue loop |

### Gate Evaluation Pseudocode

```
function checkReviewQualityGates(state, config, coverage):
  violations = []

  // Evidence gate
  for f in state.findings where f.status == "active":
    if not f.hasFileLineCitation or f.evidenceType == "inference-only":
      violations.push({ gate: "evidence", findingId: f.id,
                        detail: "Active finding lacks evidence or is inference-only" })

  // Scope gate
  reviewScope = resolveReviewScope(config.reviewTarget, config.reviewTargetType)
  for f in state.findings where f.status == "active":
    if f.filePath not in reviewScope:
      violations.push({ gate: "scope", findingId: f.id,
                        detail: "Finding outside declared review scope" })

  // Coverage gate
  if coverage.dimensionCoverage < 1.0:
    violations.push({ gate: "coverage",
                      detail: "Not all configured review dimensions are covered" })
  if not coverage.requiredProtocolsCovered:
    violations.push({ gate: "coverage",
                      detail: "Required traceability protocols are incomplete" })

  if len(violations) > 0:
    return { passed: false, violations }
  return { passed: true }
```

When any gate fails, the STOP is overridden to CONTINUE and each violation is logged:

```json
{"type":"event","event":"guard_violation","gate":"<name>","iteration":N,"detail":"<reason>"}
```

---

<!-- /ANCHOR:review-quality-gates -->
<!-- ANCHOR:related-resources -->
## 11. RELATED RESOURCES

### Shared Protocol Documentation

Protocol documents from `sk-deep-research` are cross-referenced, not duplicated:

| Document | Path | Purpose |
|----------|------|---------|
| Loop Protocol (research) | `../sk-deep-research/references/loop_protocol.md` | Research loop lifecycle (this file adapts Section 9) |
| State Format | `../sk-deep-research/references/state_format.md` | JSONL, strategy, and config schemas |
| Convergence | `../sk-deep-research/references/convergence.md` | `shouldContinue_review()` (Section 10), stuck recovery, quality guards |

### Review-Specific Resources

| Resource | Path | Purpose |
|----------|------|---------|
| Review Contract | `assets/review_mode_contract.yaml` | Single source of truth for dimensions, verdicts, gates, protocols |
| Quick Reference | `references/quick_reference.md` | One-page review cheat sheet |
| Strategy Template | `assets/deep_review_strategy.md` | Template for review strategy files |
| Config Template | `assets/deep_review_config.json` | Template for review config files |
| Dashboard Template | `assets/deep_review_dashboard.md` | Template for auto-generated dashboard |

### Workflow Files

| Mode | Path |
|------|------|
| Auto (unattended) | `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` |
| Confirm (step-by-step) | `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` |

### Agent

| Agent | Path Pattern | Constraint |
|-------|-------------|------------|
| `@deep-review` | `{runtime_dir}/deep-review.{ext}` | LEAF-only, no sub-agents, no WebFetch, target files read-only |

Runtime paths:
- OpenCode / Copilot: `.opencode/agent/deep-review.md`
- Claude: `.claude/agents/deep-review.md`
- Codex: `.codex/agents/deep-review.toml`
- Gemini: `.gemini/agents/deep-review.md`

---

<!-- /ANCHOR:related-resources -->
