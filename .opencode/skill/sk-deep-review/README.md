---
title: sk-deep-review
description: Autonomous iterative code review and quality auditing loop with severity-weighted findings, dimension coverage, convergence detection, and release readiness verdicts.
---

# sk-deep-review

> Automated iterative code review and quality auditing loop that runs multiple review cycles with fresh context per iteration, file-based state continuity, and severity-weighted convergence detection for release readiness verdicts.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. FEATURES](#3--features)
- [4. STRUCTURE](#4--structure)
- [5. CONFIGURATION](#5--configuration)
- [6. USAGE EXAMPLES](#6--usage-examples)
- [7. TROUBLESHOOTING](#7--troubleshooting)
- [8. FAQ](#8--faq)
- [9. RELATED DOCUMENTS](#9--related-documents)

---

## 1. OVERVIEW

### What This Skill Does

`sk-deep-review` runs autonomous, multi-iteration code quality audits on targets that require more than a single review pass to assess thoroughly. Each iteration dispatches a fresh `@deep-review` agent with no prior context, using file-based state (JSONL log, strategy file, iteration notes) to carry findings forward without degrading the context window. When new findings drop below a configurable threshold across multiple consecutive iterations, a 3-signal composite convergence algorithm stops the loop and triggers final synthesis, producing a `{spec_folder}/review/review-report.md` with a binary release readiness verdict.

The agent reads code using Read and Grep only. It never modifies, creates, or deletes files inside the review target. All state lives in a dedicated `{spec_folder}/review/` packet. Findings are mapped to four review dimensions (Correctness, Security, Traceability, Maintainability), weighted by severity, and validated through three binary quality gates before convergence is allowed.

All continuity across iterations comes from disk, not agent memory. The orchestrating command reads JSONL state, checks convergence, and dispatches the next agent with the current strategy file as its only context. This approach eliminates context window exhaustion for long review sessions and makes state fully inspectable, resumable, and recoverable.

When the review hands control back to general packet work, `/spec_kit:resume` stays canonical. Recovery should rebuild from `handover.md`, then `_memory.continuity`, then the remaining spec docs, while generated memory artifacts stay secondary.

### Key Statistics

| Metric                        | Value                                                                                     |
| ----------------------------- | ----------------------------------------------------------------------------------------- |
| Default max iterations        | 7                                                                                         |
| Default convergence threshold | 0.10                                                                                      |
| Stuck threshold               | 3 consecutive no-progress iterations                                                      |
| Review dimensions             | 4 (Correctness, Security, Traceability, Maintainability)                                  |
| Finding severities            | P0 (critical), P1 (important), P2 (minor)                                                 |
| Quality gates                 | 3 binary (evidence, scope, coverage)                                                      |
| Verdicts                      | PASS, CONDITIONAL, FAIL                                                                   |
| State files                   | 7 primary (config, JSONL, findings registry, strategy, dashboard, pause sentinel, report) |
| Tool budget per iteration     | 9-12 (max 13)                                                                             |
| Output document               | `{spec_folder}/review/review-report.md` (9-section findings-first report)                 |

### When to Use

Use `sk-deep-review` when:

- A spec folder, skill package, or agent requires a release gate before shipping
- Prior single-pass reviews have missed edge cases or cross-reference drift
- A P0 finding must be confirmed or ruled out with adversarial verification
- Coverage of all four review dimensions with file:line evidence is required

Do not use `sk-deep-review` when:

- A quick informal check is sufficient (use `@review` agent directly)
- The target is a research topic, not a code artifact (use `sk-deep-research`)
- No spec folder is available to anchor review state

### How This Compares

| sk-code-review (single-pass)           | sk-deep-review (iterative multi-pass)                |
| --------------------------------------- | ---------------------------------------------------- |
| One review cycle                        | Multiple iterations until convergence                |
| Context window shared across all checks | Fresh context per iteration, state on disk           |
| No convergence or coverage tracking     | 3-signal convergence with dimension coverage vote    |
| No adversarial self-check on findings   | Adversarial Hunter/Skeptic/Referee check on every P0 |
| No release readiness verdict            | Three-way verdict: PASS, CONDITIONAL, FAIL           |
| Best for quick feedback                 | Best for release gates and thorough audits           |

---

## 2. QUICK START

Invoke via the dedicated command. Append `:auto` for unattended runs or `:confirm` for approval gates between iterations.

```bash
# Autonomous review of a skill package
/spec_kit:deep-review:auto "skill sk-my-skill"

# Interactive review of a spec folder with approval at each step
/spec_kit:deep-review:confirm "specs/03--commands-and-skills/030-sk-deep-review/"

# Autonomous review of all spec folders in a track
/spec_kit:deep-review:auto "track 03--commands-and-skills"
```

After the loop completes, confirm the verdict in the review report:

```bash
grep "Release Readiness Verdict" {spec_folder}/review/review-report.md
```

---

## 3. FEATURES

### Iterative Multi-Pass Review with Dimension Coverage

Each iteration focuses on one or more of the four review dimensions (Correctness, Security, Traceability, Maintainability). The dimension coverage signal contributes 0.45 weight to the convergence vote. Convergence cannot fire until all required dimensions are covered and at least one stabilization pass confirms no new dimension findings.

### Severity-Weighted Convergence

New findings are not counted equally. A new P0 finding contributes weight 10.0 to the `newFindingsRatio`, P1 contributes 5.0, and P2 contributes 1.0. Refinements of existing findings (e.g., severity upgrades) contribute 0.5 times those weights. This prevents convergence on iterations that appear low-yield in count but are high-severity in impact.

### P0 Override Blocks Stop

Any new P0 finding sets `newFindingsRatio >= 0.50` regardless of other signals. This single-rule override ensures that even one new critical finding forces at least one more iteration. Convergence resumes only after a full stabilization pass confirms no further P0 activity.

### Adversarial Self-Check on P0 Findings

Before a P0 finding is recorded to JSONL, the agent runs an internal adversarial self-check using three roles: Hunter (argues the finding is real), Skeptic (challenges the evidence and severity classification), and Referee (decides admission, rejection, or severity downgrade). Only findings that survive the Referee decision enter the active finding registry.

### Binary Quality Gates

Three binary gates are evaluated after the convergence math votes STOP. All three must pass before the loop terminates:

- **Evidence gate:** Every active finding must be backed by concrete file:line evidence. Inference-only findings fail this gate.
- **Scope gate:** Reviewed files, targets, and conclusions must stay inside the declared review scope.
- **Coverage gate:** Required dimensions and required cross-reference protocols must be completed before STOP is allowed.

### Graph-Aware Legal-Stop Checks

When `graphEvents` are present in review iteration records, the convergence system can incorporate structural graph signals into legal-stop evaluation. This adds graph-backed dimension and evidence coverage to the existing review stop gates so a stable-looking review still cannot stop early if the graph shows unresolved coverage gaps.

### 9-Section Review Report with PASS/CONDITIONAL/FAIL Verdict

Synthesis produces `{spec_folder}/review/review-report.md` with nine sections: executive summary, planning trigger, active finding registry, remediation workstreams, spec seed, plan seed, traceability status, deferred items, and audit appendix. The verdict logic is: FAIL when any active P0 exists, CONDITIONAL when active P1 exists with no P0, PASS when neither P0 nor P1 is active. A PASS verdict includes `hasAdvisories: true` when active P2 findings remain.

### Semantic Coverage Graph

Each review iteration emits `graphEvents` in its JSONL record, building a coverage graph with review-specific node types (DIMENSION, FILE, FINDING, EVIDENCE, REMEDIATION) and edge types (COVERS, EVIDENCE_FOR, IN_DIMENSION, IN_FILE, CONTRADICTS, RESOLVES, CONFIRMS). The graph provides structural awareness of which files and dimensions have been examined, enabling graph-based convergence guards that complement the Phase 1 composite stop score.

### Fail-Closed Corruption Handling

The reducer refuses to write derived files (registry, strategy, dashboard) when JSONL state corruption is detected. In non-lenient mode, `reduceReviewState()` throws a structured error with corruption details before any output is produced. This prevents silently propagating incorrect state.

### Terminal Stop Metadata and Claim Adjudication

The reducer parses `synthesis_complete` events to derive authoritative stop reason and legal-stop outcome for the dashboard. Claim-adjudication packets carry `finalSeverity` that overrides original severity in the findings registry, and stale STOP vetos are automatically cleared when all active P0/P1 findings resolve.

### Fresh Context Per Iteration

Each `@deep-review` agent dispatch gets a clean context window. No compaction or memory degradation across iterations. Knowledge transfers through the strategy file and JSONL state on disk.

### Externalized State

All review state persists in `{spec_folder}/review/`: an immutable config JSON, an append-only JSONL iteration log, a mutable strategy file, and write-once per-iteration markdown files. State is fully inspectable without running the loop.

### Auto-Resume from Prior State

Re-invoking on a spec folder that has existing review state triggers auto-resume from the last completed iteration. Prior iterations are not re-run. The loop continues from the current strategy and JSONL log.

### Lifecycle Modes

| Mode                       | Effect                                                                                                                                                                  |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new`                      | First run against the spec folder. No prior state.                                                                                                                      |
| `resume`                   | Continue the same review lineage, keep the current `sessionId` and generation. Appends a typed `resumed` JSONL event.                                                   |
| `restart`                  | Archive the existing `review/` tree under `review_archive/{timestamp}/`, mint a fresh `sessionId`, increment `generation`, and append a typed `restarted` JSONL event. |
| `fork` (deferred)          | Reserved. Earlier drafts described a child review branch; the workflow no longer exposes this option.                                                                  |
| `completed-continue` (deferred) | Reserved. Earlier drafts described snapshotting `review-report-v{generation}.md` and reopening; not runtime-wired.                                                 |

See `references/loop_protocol.md §Lifecycle Branches (current release)` for the canonical event contract. Review lineage metadata lives in `deep-review-config.json` and every iteration record: `sessionId`, `parentSessionId`, `lineageMode`, `generation`, `continuedFromRun`, and `releaseReadinessState`.

### Release Readiness States

| State              | Meaning                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------- |
| `in-progress`      | Review is still accumulating findings or coverage is incomplete                             |
| `converged`        | All dimensions are covered and the latest stabilization pass produced no new P0/P1 findings |
| `release-blocking` | Unresolved P0 findings remain active                                                        |

---

## 4. STRUCTURE

### Skill Package

```
sk-deep-review/
├── SKILL.md
├── README.md
├── references/
│   └── quick_reference.md
├── assets/
│   ├── deep_review_config.json
│   ├── deep_review_strategy.md
│   ├── deep_review_dashboard.md
│   └── review_mode_contract.yaml
└── manual_testing_playbook/
    ├── 01--entry-points-and-modes/
    ├── 02--initialization-and-state-setup/
    ├── 03--iteration-execution-and-state-discipline/
    ├── 04--convergence-and-recovery/
    ├── 05--pause-resume-and-fault-tolerance/
    └── 06--synthesis-save-and-guardrails/
```

### Review Runtime State

Created in `{spec_folder}/review/` during initialization. All files are scoped to this packet; the review target is never written to.

```
{spec_folder}/review/
├── deep-review-config.json         # Immutable after init: loop parameters + lineage metadata
├── deep-review-state.jsonl         # Append-only structured log of all iterations
├── deep-review-findings-registry.json  # Reducer-owned canonical findings state
├── deep-review-strategy.md         # Mutable: dimensions, findings, next focus
├── deep-review-dashboard.md        # Auto-generated after each iteration
├── .deep-review-pause              # Pause sentinel: create to halt, delete to resume
├── review-report.md                # 9-section findings-first synthesis with verdict
# `review-report-v{generation}.md` is reserved for the deferred completed-continue
# lifecycle mode and is not written by the current runtime.
└── iterations/
    └── iteration-NNN.md            # Write-once per-iteration detailed findings
```

### Agent Definitions

| Runtime            | Agent Path                       |
| ------------------ | -------------------------------- |
| OpenCode / Copilot | `.opencode/agent/deep-review.md` |
| Claude             | `.claude/agents/deep-review.md`  |
| Codex              | `.codex/agents/deep-review.toml` |
| Gemini             | `.gemini/agents/deep-review.md`  |

---

## 5. CONFIGURATION

### Command Parameters

| Parameter          | Default       | Description                                                                                             |
| ------------------ | ------------- | ------------------------------------------------------------------------------------------------------- |
| `--max-iterations` | 7             | Hard cap on review loop iterations                                                                      |
| `--convergence`    | 0.10          | Stop when severity-weighted newFindingsRatio falls below this value for required consecutive iterations |
| `--spec-folder`    | auto-detected | Target spec folder for state and output files                                                           |
| `--dimensions`     | all           | Comma-separated list to restrict active review dimensions                                               |

### Review Dimensions

| Priority | ID                | Label           | Checks                                                                                      |
| -------- | ----------------- | --------------- | ------------------------------------------------------------------------------------------- |
| 1        | `correctness`     | Correctness     | Logic errors, off-by-one, wrong return types, broken invariants, edge cases                 |
| 2        | `security`        | Security        | Injection, auth bypass, secrets exposure, unsafe deserialization, trust boundary violations |
| 3        | `traceability`    | Traceability    | Spec/code alignment, checklist evidence, cross-reference integrity                          |
| 4        | `maintainability` | Maintainability | Codebase patterns, documentation quality, clarity, safe follow-on change cost               |

Additional dimensions available in config: `spec-alignment`, `completeness`, `cross-ref-integrity`, `patterns`, `documentation-quality`. These map into the four primary dimensions during synthesis.

### Target Types

| Type          | Description                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------- |
| `spec-folder` | Review a single spec folder and its referenced implementation, tests, and release artifacts       |
| `skill`       | Review a skill package including SKILL.md, references, assets, scripts, and runtime integrations  |
| `agent`       | Review a named agent across runtime-specific definitions and capability parity surfaces           |
| `track`       | Review a spec track spanning multiple child spec folders and shared coordination artifacts        |
| `files`       | Review an explicit file set plus immediate cross-references required to evaluate shipped behavior |

### Tuning Guide

| Goal                    | Adjustment                                                           |
| ----------------------- | -------------------------------------------------------------------- |
| Deeper audit            | Lower `--convergence` to 0.05, raise `--max-iterations` to 10        |
| Faster gate check       | Raise `--convergence` to 0.15, lower `--max-iterations` to 4         |
| Security-focused audit  | Pass `--dimensions correctness,security` to restrict dimension scope |
| Full traceability audit | Use default dimensions and default max iterations                    |

### Pause and Resume

Create a file at `{spec_folder}/review/.deep-review-pause` during a running review loop to halt between iterations. Delete the file to resume. Auto-resume detects existing JSONL state on re-invocation and continues from the last completed iteration without re-running prior work.

---

## 6. USAGE EXAMPLES

### Example 1: Skill Review

Run a full autonomous audit of a skill package across all four dimensions with a release readiness verdict.

```bash
/spec_kit:deep-review:auto "skill sk-deep-review"
```

Expected progression:

- Init discovers all files in the skill package across all runtimes
- Iteration 1 (inventory): maps artifact structure, identifies cross-reference targets
- Iterations 2-5: Correctness, Security, Traceability, Maintainability passes
- Iteration 6: stabilization pass confirms no new findings across all dimensions
- Convergence: all dimensions covered, binary gates pass, stabilization requirement met
- Synthesis produces `{spec_folder}/review/review-report.md` with verdict PASS or CONDITIONAL

### Example 2: Spec Folder Audit

Run an interactive audit of a spec folder with approval gates between iterations. Useful when findings should be reviewed before the loop continues.

```bash
/spec_kit:deep-review:confirm "specs/03--commands-and-skills/030-sk-deep-review/"
```

Expected progression:

- Init creates `config.json`, `strategy.md` with review dimensions and scope boundaries
- User approves each iteration before dispatch
- Each iteration focuses on one dimension, updating strategy and JSONL state on completion
- User reviews dashboard before approving synthesis step
- Synthesis produces report; user approves or triggers remediation via `/spec_kit:plan`

### Example 3: Track-Wide Review

Run an autonomous audit across all spec folders in a named track. The loop discovers child spec folders and reviews each one, producing a `review-report.md` per folder.

```bash
/spec_kit:deep-review:auto "track 03--commands-and-skills"
```

Expected progression:

- Init resolves all child spec folders in the track
- Each child is reviewed in sequence using the default iteration budget
- Coverage and finding summaries are aggregated into a track-level summary
- Any FAIL verdict on a child folder sets the track verdict to FAIL

---

## 7. TROUBLESHOOTING

| What you see                                   | Common causes                                                                        | Fix                                                                                                                                                                                            |
| ---------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Review stuck on one dimension                  | Agent strategy.md next-focus not advancing after the dimension completes             | Check that the agent marked the dimension complete in strategy.md. If not, manually update the completed-dimensions section and re-run.                                                        |
| P0 findings blocking convergence               | Real P0 findings that survive adversarial check, or misclassified P1s elevated to P0 | Read the adversarial self-check output in the relevant `iteration-NNN.md`. If the finding was misclassified, manually downgrade severity in the JSONL entry and re-run convergence evaluation. |
| `review-report.md` missing sections            | Synthesis step interrupted before all 9 sections were written                        | Re-run synthesis step manually. The JSONL state is intact; synthesis reads from it without re-running iterations.                                                                              |
| Loop runs to max iterations without converging | Convergence threshold too low, or target has genuine structural issues               | Raise `--convergence` to 0.15 and re-run with auto-resume. If findings keep appearing, the target likely needs remediation before review can converge.                                         |
| Agent dispatches a sub-agent                   | LEAF constraint violated in agent definition                                         | Verify the `@deep-review` agent definition contains `task: deny` in its allowed-tools list.                                                                                                    |
| Review finds no issues on known-bad code       | Scope too narrow or files not discovered                                             | Confirm scope includes all relevant files. Check dimension coverage in `{spec_folder}/review/deep-review-dashboard.md`.                                                                        |
| Verdict appears wrong                          | P0 finding severity misclassified or active-findings count incorrect                 | Confirm adversarial self-check ran on the P0 finding in the relevant iteration file. Check JSONL synthesis event `activeP0` field for accuracy.                                                |

---

## 8. FAQ

**Q: How is this different from sk-code-review?**
A: `sk-code-review` is a single-pass review. `sk-deep-review` is iterative: it runs multiple review cycles until convergence, tracks dimension coverage, runs adversarial self-checks on P0 findings, and produces a structured `review-report.md` with a three-way verdict. Use `sk-code-review` for quick feedback; use `sk-deep-review` for release gates.

**Q: Can I review individual files?**
A: Yes. Specify target type as `files` and pass the explicit file list at invocation. The review loop scopes all findings and cross-reference checks to the declared file set plus their immediate cross-references.

**Q: What triggers a P0 override?**
A: Any new P0 finding within an iteration sets `newFindingsRatio >= 0.50` regardless of other signals. This forces at least one more iteration. The override cannot be suppressed — it is a hard convergence guard.

**Q: Does the review modify the target code?**
A: No. The `@deep-review` agent is strictly read-only with respect to the review target. It writes only to the dedicated `{spec_folder}/review/` packet: strategy, JSONL state, dashboard, iteration files, and the final report.

**Q: What happens after review finds P0 issues?**
A: The verdict is FAIL and release is blocked. Run `/spec_kit:plan` to create a remediation plan from the findings in `{spec_folder}/review/review-report.md`, implement the fixes, then re-run `sk-deep-review` to confirm resolution.

**Q: What does CONDITIONAL mean?**
A: CONDITIONAL means active P0 is zero but active P1 findings remain. The code can proceed to planning and remediation but should not be released until P1 findings are resolved. Run `/spec_kit:plan` with the review report as input.

**Q: Can I pause a running autonomous review?**
A: Yes. Create a file at `{spec_folder}/review/.deep-review-pause` during the loop. The orchestrator checks for this sentinel between iterations and halts cleanly. Delete the file to continue.

**Q: How do I extend the review after convergence?**
A: Raise `--max-iterations` above the number of completed iterations and re-invoke. Auto-resume detects existing JSONL state and continues without repeating prior iterations.

---

## 9. RELATED DOCUMENTS

### Shared References

| Document        | Path                                                           | Purpose                                                                  |
| --------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Loop protocol   | `.opencode/skill/sk-deep-review/references/loop_protocol.md`   | 4-phase lifecycle plus lineage-aware review branches                     |
| State format    | `.opencode/skill/sk-deep-review/references/state_format.md`    | Config, JSONL, reducer registry, strategy, dashboard, and report schemas |
| Convergence     | `.opencode/skill/sk-deep-review/references/convergence.md`     | Stop algorithms, stuck recovery, signal math, and graph-aware legal-stop checks |
| Quick reference | `.opencode/skill/sk-deep-review/references/quick_reference.md` | One-page cheat sheet including lifecycle states and packet files         |
| Graph playbook  | `.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/021-graph-convergence-review.md` | Operator test case for graph-backed legal-stop behavior |

### Skill-Local References

| Document                 | Path                                                           | Purpose                                                    |
| ------------------------ | -------------------------------------------------------------- | ---------------------------------------------------------- |
| Quick reference (review) | `.opencode/skill/sk-deep-review/references/quick_reference.md` | Review-only cheat sheet for commands, dimensions, verdicts |

### Agent Definitions

| Runtime            | Path                             |
| ------------------ | -------------------------------- |
| OpenCode / Copilot | `.opencode/agent/deep-review.md` |
| Claude             | `.claude/agents/deep-review.md`  |
| Codex              | `.codex/agents/deep-review.toml` |
| Gemini             | `.gemini/agents/deep-review.md`  |

### Commands

| Command                 | Purpose                                                            |
| ----------------------- | ------------------------------------------------------------------ |
| `/spec_kit:deep-review` | Primary invocation point for review-only mode                      |
| `/spec_kit:plan`        | Next step when review verdict is FAIL or CONDITIONAL               |
| `/memory:save`          | Manual context preservation (deep review auto-saves on completion) |

### Related Skills

| Skill              | Relationship                                                                                              |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| `sk-deep-research` | Shares loop architecture, state format, and convergence algorithm. Use for investigation, not code audit. |
| `sk-code-review`  | Single-pass review baseline. Use for quick checks; use `sk-deep-review` for release gates.                |

### Workflow YAMLs

| File                                | Purpose                                              |
| ----------------------------------- | ---------------------------------------------------- |
| `spec_kit_deep-review_auto.yaml`    | Autonomous review mode workflow                      |
| `spec_kit_deep-review_confirm.yaml` | Interactive review mode workflow with approval gates |

### Canonical Reference Table

| Surface           | Canonical value                                                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Config file       | `review/deep-review-config.json`                                                                                                     |
| State log         | `review/deep-review-state.jsonl`                                                                                                     |
| Findings registry | `review/deep-review-findings-registry.json`                                                                                          |
| Pause sentinel    | `review/.deep-review-pause`                                                                                                          |
| Lifecycle modes   | Runtime: `new`, `resume`, `restart`. Deferred (reserved, not emitted): `fork`, `completed-continue`. See `references/loop_protocol.md §Lifecycle Branches`. |
| Release readiness | `in-progress`, `converged`, `release-blocking`                                                                                       |
| Runtime mirrors   | `.opencode/agent/deep-review.md`, `.claude/agents/deep-review.md`, `.codex/agents/deep-review.toml`, `.gemini/agents/deep-review.md` |
