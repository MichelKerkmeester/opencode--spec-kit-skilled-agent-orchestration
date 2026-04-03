# Global Quality Sweep Pattern (Agent 3)

**Reference source:** `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/global-quality-sweep.md`

## Purpose and Scope
- The precedent document enforces a mandatory closure protocol that spans every change delivered under the spec folder and makes completion conditional on executing the sweep defined herein.
- Adaptation: Tailor the scope statement to cover the command/skill refinements under `.opencode/specs/03--commands-and-skills/018-sk-code-opencode-refinement`, explicitly listing the subsystems (command behaviors, skill training guides, documentation updates) so reviewers know whether the sweep applies.
- State upfront that the sweep is triggered for any completion claim in this spec, mirroring the universal coverage noted in the reference.

## Mandatory Closure Protocol

### 1) Global Testing Round (Required)
- Observation: The prior sweep required a consolidated testing round covering retrieval/fusion, graph contracts, cognitive scoring, session flows, CRUD consistency, parser/index invariants, storage recovery, telemetry governance, and operational automation.
- Adaptation: Replace the tech-specific checklist with coverage tailored to command+skill changes (e.g., command parsing pipelines, skill invocation guards, CLI automation, policy validators). Enumerate key test suites, linting configs, and targeted scripts that demonstrate coverage of the revamped command/skill paths.
- Always capture commands executed plus a summary result and link each to where the log resides.

### 2) Global Bug Detection Sweep (Required)
- Observation: Sweep enforces a defect log with severity/owner/state and blocks closure unless `P0=0` and `P1=0`.
- Adaptation: Reproduce the same defect logging discipline, documenting every issue discovered during the final sweep, the triage outcome, and whether it stays open (should be zero for P0/P1). Pull in any prior evidence bundles or regression logs as artifacts.
- Include a short note if tooling scans (e.g., secret/key scans) produced zero matches on the impacted paths.

### 3) `sk-code--opencode` Compliance Audit (Required)
- Observation: Compliance audit consolidates lint/test results and a focused scan of changed paths, with explicit evidence supporting the gate.
- Adaptation: Define the compliance checklist specific to this spec (style guides for skill docs, automation scripts, safe defaults). Document which lint/test/scan outputs were used and cite artifacts verifying no violations on the touched files.

### 4) Conditional Standards Update Pathway (Conditional)
- Observation: Triggered only when architecture/implementation evidence shows a standards mismatch; otherwise mark `N/A` with rationale.
- Adaptation: Evaluate whether the command/skill changes require new standards (e.g., new policy for command deformation or new automation guard). If not triggered, clearly record `N/A` plus evidence (e.g., architecture review notes). If triggered, describe the mismatch, modifications to `sk-code--opencode`, and why this change is warranted.

## Evidence Table
- Observation: The table lists Evidence ID, Protocol Step, Command / Check, Result Summary, Artifact / Link, Defects, Owner, and Status, with specific entries (EVT-001 to EVT-004) documenting each protocol step.
- Adaptation: Mirror this schema and generate entries for the command/skill sweep. Suggested approach:
  - Assign IDs (e.g., EVT-001 for testing, EVT-002 for defect sweep).
  - For each entry, include the exact commands run, a concise pass/fail summary, and the file(s) or logs supporting the outcome.
  - Capture defect counts next to each row; mark the owner (usually the spec closure lead) and status (`Closed`, `Blocked`).
  - Include links to scratch artifacts (e.g., `.opencode/specs/.../scratch/final-quality-evidence-<date>.md`).
- Ensure every protocol step has at least one evidence row before closure.

## Closure Gate
- Observation: The gate enumerates requirements (testing round, bug sweep, compliance audit, standards pathway) and the date (`2026-02-22`) to record when they were satisfied, followed by a final decision statement.
- Adaptation: Keep the same checklist (with checkboxes) for the new spec, referencing the new evidence IDs and the new completion date. The concluding statement should assert whether all required steps were closed and confirm `P0`/`P1` counts.
- Maintain a final summary line like `Closure Gate Decision: SATISFIED` when the conditions are met.

## Evidence Collection Checklist
- Derive a reusable checklist for the current spec that covers:
  1. Running the consolidated testing round (name suites/commands + gather logs).
  2. Performing the global bug sweep (issue log, severity tally, closure state).
  3. Conducting the compliance audit (lint/tests/scan outputs, focus scope).
  4. Verifying if a standards update is needed (trigger decision + rationale).
  5. Capturing artifacts and linking them in the evidence table (include scratch docs, runbook outputs, scans).
- Include explicit places to record defect counts (`P0`, `P1`, `P2`) and owners.

## Suggested Acceptance Criteria
- Every mandatory protocol step has a corresponding evidence entry with commands, results, and artifact references.
- Defect log shows `P0=0` and `P1=0`; any `P2` are noted with owners/status.
- Compliance audit artifacts confirm no new lint/test/scan violations on files touched by the spec.
- Standards update pathway is either executed with documented changes or marked `N/A` with rationale before claiming closure.
- Closure gate checklist is fully checked and dated, culminating in a clear `Closure Gate Decision` statement.
