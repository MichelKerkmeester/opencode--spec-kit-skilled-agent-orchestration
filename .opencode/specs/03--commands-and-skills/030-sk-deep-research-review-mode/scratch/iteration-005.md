# Review Iteration 5: Output Format, Synthesis & Integration

## Focus
Q5: What should the review-report.md output look like and how does review mode integrate with commands?

## Findings

### 1. review-report.md Format

`review-report.md` should be the workflow-owned canonical output for `mode=review`, exactly parallel to how `research.md` is owned today.

1. **Executive Summary**: purpose is immediate release posture. Structure: 1-row summary table plus a one-sentence recommendation. Example: `FAIL | 64/100 | NEEDS REVISION | P0:1 P1:3 P2:5 | 14/14 files, 5/5 dimensions`. Source: config target/scope, aggregate scorecard, active finding registry, JSONL stop reason.
2. **Score Breakdown**: purpose is reproducible rubric scoring. Structure: 5-row table for Correctness, Security, Patterns, Maintainability, Performance with score, band, driver. Example: `Security | 18/25 | Weak | path traversal in download handler`. Source: per-file latest scorecards aggregated from iteration metadata.
3. **P0 Findings (Blockers)**: purpose is stop-ship evidence. Structure: numbered finding cards with ID, file:line, evidence, impact, why P0, fix, iteration refs. Example: `P0-001 src/server/download.ts:88 arbitrary file read via unsanitized path`. Source: confirmed active P0 registry entries from iteration files plus referee check.
4. **P1 Findings (Required Fixes)**: purpose is must-fix-before-pass issues. Structure: same as P0, but scoped to required fixes. Example: `P1-004 src/cache/index.ts:141 stale invalidation path can serve outdated auth state`. Source: confirmed active P1 registry.
5. **P2 Findings (Suggestions)**: purpose is advisory follow-up. Structure: compact cards with file:line, suggestion, rationale. Example: `P2-009 src/logger.ts:52 extract repeated redaction list to shared constant`. Source: active P2 registry.
6. **Cross-Reference Results**: purpose is verify spec/code/checklist/alignment. Structure: table `Check | Result | Evidence | Status`. Example: `AC-004 retry on timeout | Implemented | src/retry.ts:41 | PASS`. Source: cross-reference iteration outputs, checklist/spec reads, contradiction log.
7. **Coverage Map**: purpose is show what was and was not reviewed. Structure: summary line plus table `File | Dimensions Reviewed | Last Iteration | Gaps`. Example: `src/auth/policy.ts | C,S,P,M,Perf | 4 | none`. Source: strategy `Files Under Review` plus iteration coverage metadata.
8. **Positive Observations**: purpose is balanced reporting, matching the review agent contract. Structure: short bullets. Example: `Role checks are consistently performed before data fetches in auth policy paths.` Source: positive-observation entries from iteration files.
9. **Convergence Report**: purpose is explain why the loop stopped and how confidence evolved. Structure: metrics block plus iteration trend table. Example: `new findings trend: 6 -> 3 -> 1; stop reason: low_new_info_with_full_coverage`. Source: JSONL state log and final strategy state.
10. **Remediation Priority**: purpose is actionable sequencing. Structure: ordered table `Priority | Action | Finding IDs | Release Impact`. Example: `1 | Fix traversal guard in download path | P0-001 | blocks release`. Source: active findings sorted by severity and dependency.
11. **Release Readiness Verdict**: purpose is final disposition. Structure: single verdict label plus rationale and next command. Example: `CONDITIONAL: no P0 findings remain, but 2 P1 issues still block release readiness.` Source: aggregate findings, score threshold, cross-reference status.

Representative top-of-file format:

```md
# Review Report

## Executive Summary
| Verdict | Score | Band | P0 | P1 | P2 | Scope |
|---|---:|---|---:|---:|---:|---|
| FAIL | 64/100 | NEEDS REVISION | 1 | 3 | 5 | 14/14 files, 5/5 dimensions |

Recommendation: Block release until P0-001 and all P1 items are fixed.

## Score Breakdown
| Dimension | Score | Driver |
|---|---:|---|
| Correctness | 22/30 | Null handling gap in sync pipeline |
| Security | 18/25 | Path traversal risk in download handler |
| Patterns | 12/20 | Two deviations from project retry contract |
| Maintainability | 8/15 | Cross-module branching is hard to reason about |
| Performance | 4/10 | Repeated sync disk reads in hot path |
```

### 2. Progressive Synthesis Protocol

1. Maintain a workflow-owned `finding registry` keyed by `findingId`, with `status=active|duplicate|upgraded|downgraded|contested|resolved_false_positive`.
2. Deduplicate by "same finding, same place": default key should be `file:line + normalized title/rule`. If only `file:line` matches and the issue description is materially the same, merge and keep the highest severity.
3. Severity upgrades are monotonic until adjudicated. If iteration 1 logs `P2` and iteration 3 proves user-impact or contract breakage, the finding becomes `P1`, keeps the same ID, appends evidence, and logs a severity transition.
4. Contradictions should not silently delete findings. If iteration 2 says `P1` and iteration 4 says "not an issue," mark the finding `contested`, require a referee pass, and only then resolve to `confirmed`, `downgraded`, or `resolved_false_positive`. This aligns well with the existing Hunter/Skeptic/Referee review contract in review.md.
5. Running totals in strategy should count only `active` findings: `P0`, `P1`, `P2`, plus deltas for `new`, `upgraded`, and `resolved` this iteration.
6. Progressive synthesis should refresh `review-report.md` after every verified iteration when `progressiveSynthesis=true`, but force an immediate refresh when a new P0 appears, any severity is upgraded, a contradiction is resolved, or cross-reference status changes. Final synthesis must always rebuild from all iteration files, not trust the last progressive draft.
7. Keep `newInfoRatio` in review mode as "net-new active findings introduced this iteration / review items examined this iteration," but require separate coverage guards before STOP so "reviewed cleanly" still counts as progress.

Minimal iteration metadata needed in JSONL:

```json
{
  "type": "iteration",
  "mode": "review",
  "run": 4,
  "focus": "security pass on auth and download paths",
  "filesReviewed": ["src/auth/policy.ts", "src/server/download.ts"],
  "dimensionScores": {"correctness": 24, "security": 18, "patterns": 16, "maintainability": 12, "performance": 7},
  "newFindings": {"P0": 1, "P1": 1, "P2": 0},
  "upgrades": [{"id": "F-003", "from": "P2", "to": "P1"}],
  "resolved": ["F-001"],
  "findingRefs": ["F-003", "F-008"],
  "coverage": {"filesReviewed": 11, "filesTotal": 14, "dimensionsComplete": ["correctness", "security", "patterns"]},
  "newInfoRatio": 0.12,
  "status": "complete"
}
```

### 3. Command Interface Design

| Option | Pros | Cons | Impact |
|---|---|---|---|
| A. Mode flag on existing command | Maximum engine reuse; one command family; preserves current deep-research mental model | "Research" is a weak user-facing verb for release review; `:review:auto` is syntactically noisy; setup prompt becomes overloaded | Medium: change existing command parser, setup questions, YAML branching, docs |
| B. Separate command `/spec_kit:deep-review:auto` | Best UX clarity; preserves existing deep-research engine internally; avoids breaking current research behavior; easy docs | Adds one new command entrypoint | Low-medium: add thin wrapper command, reuse existing YAML/skill internals with `mode=review` |
| C. New top-level `/spec_kit:review` | Short and discoverable | Too ambiguous with one-shot `@review` and existing review/gate workflows; higher naming collision risk | High: larger docs/process ambiguity, more orchestration overlap |

**Recommendation: Option B.** Public UX should be `/spec_kit:deep-review[:auto|:confirm] "target"`, but internally it should still run the same loop engine with `mode=review`. That gives the clearest user intent while keeping backward compatibility high.

### 4. Config Adaptations

| Field | Status | Default | Why |
|---|---|---:|---|
| `mode` | new | `"research"` | Preserves current behavior by default |
| `reviewTarget` | new | required in review mode | Names what is being reviewed |
| `reviewTargetType` | new | `"spec-folder"` | Needed to derive scope and coverage rules reliably |
| `reviewDimensions` | new | all five dimensions | Matches the existing reviewer rubric |
| `severityThreshold` | new | `"P2"` | Keeps suggestions by default; users can raise to `P1` for quieter reports |
| `crossReference` | new | `{ "spec": true, "checklist": true, "agentConsistency": true }` | Review mode needs spec/code/checklist consistency, not just code scanning |
| `qualityGateThreshold` | new | `70` | Aligns with gate-validation PASS/FAIL in review.md |
| `topic` | reused | `"Review of <target>"` | Keeps existing display/report plumbing intact |
| `maxIterations` | reused | `7` in review mode | Review scopes are finite and converge faster than open-ended research |
| `convergenceThreshold` | reused | `0.10` in review mode | Diminishing returns should trigger sooner once coverage is broad |
| `progressiveSynthesis` | reused | `true` | Reuses the existing workflow-owned progressive synthesis model |

Keep the existing scratch filenames unchanged for compatibility: `scratch/deep-research-config.json`, `scratch/deep-research-state.jsonl`, `scratch/deep-research-strategy.md`, `scratch/deep-research-dashboard.md`. The mode switch should change behavior, not the storage layout.

### 5. Strategy Template Adaptation

| Research Section | Review Section | Change |
|---|---|---|
| Key Questions | Review Dimensions | Checkbox list for Correctness, Security, Patterns, Maintainability, Performance |
| Answered Questions | Completed Dimensions | Record completion plus score summary per dimension |
| What Worked | Effective Review Approaches | Note which passes found real issues |
| What Failed | Unproductive Approaches | Note dead-end scans and false-positive patterns |
| Next Focus | Next Dimension/Focus | Single next pass target |
| Active Risks | Active Risks | Reframe around release blockers and coverage gaps |
| NEW | Running Findings | `P0/P1/P2`, deltas, upgrades, resolved |
| NEW | Cross-Reference Status | Spec alignment, checklist status, contradiction resolution |
| NEW | Files Under Review | Per-file coverage state and gaps |

Example fragment:

```md
## Review Dimensions
- [x] Correctness
- [x] Security
- [ ] Patterns
- [ ] Maintainability
- [ ] Performance

## Running Findings
- Active: P0 0 | P1 3 | P2 4
- Iteration 4 delta: +0/+1/+0
- Upgraded: 1
- Resolved false positives: 2

## Files Under Review
| File | State | Dimensions | Last Iteration | Gaps |
|---|---|---|---:|---|
| src/auth/policy.ts | complete | C,S,P,M,Perf | 4 | none |
| src/server/download.ts | partial | C,S | 4 | patterns, maintainability, performance |
```

### 6. Dashboard Adaptation

Keep the same auto-generated, overwrite-each-iteration pattern from loop_protocol.md, but change the sections to fit review mode:

1. **Status**: target, iteration, provisional verdict, score band.
2. **Findings Summary**: active `P0/P1/P2`, new this iteration, upgrades, resolved.
3. **Progress Table**: add files touched, dimensions covered, `new P0/P1/P2`, score, ratio, status.
4. **Coverage**: files reviewed/total, dimensions complete/total, cross-reference checks complete.
5. **Trend**: score trend, severity trend, new-findings trend.
6. **Resolved / Ruled Out**: disproved findings and dead-end review paths.
7. **Next Focus**: next file/dimension/lens.
8. **Active Risks**: blockers, missing coverage, unresolved contradictions.

Example:

```md
## Findings Summary
- Verdict preview: CONDITIONAL
- Score: 78/100 (ACCEPTABLE)
- Active findings: P0 0 | P1 2 | P2 5
- Coverage: 11/12 files | 5/5 dimensions | cross-ref 2/3

## Progress
| # | Focus | Files | Dimensions | New P0/P1/P2 | Score | Ratio | Status |
|---|---|---:|---|---|---:|---:|---|
| 4 | auth security | 3 | C,S | 0/1/0 | 78 | 0.12 | complete |
```

### 7. Post-Review Workflow

Correction to the proposed verdicts: do not allow `PASS` with active `P1` items, because the review contract says unresolved `P1` fixes must be fixed before a pass recommendation.

| Result | Action | Next Command |
|---|---|---|
| Active `P0` or score `<70` | `FAIL`, block release | `/spec_kit:plan "Remediate blockers from review-report.md"` |
| No `P0`, active `P1` remain | `CONDITIONAL`, not release-ready yet | `/spec_kit:plan "Remediate required fixes from review-report.md"` |
| Only `P2` remain | `PASS WITH NOTES` | `/create:changelog` or log backlog notes |
| No active findings | `PASS` | `/create:changelog` |

Workflow recommendations:
1. Do **not** auto-create a remediation plan by default. Review and implementation should remain separate unless the user opts in.
2. Do allow an opt-in post-synthesis step in confirm mode: `A) Finish`, `B) Generate remediation plan`, `C) Skip memory save`.
3. Reuse the same spec folder when the review is for an active feature spec; create a new remediation spec or child phase only when fixes are cross-cutting or outside the current feature scope.
4. Feed `review-report.md` directly into `/spec_kit:plan`, which should translate `P0/P1` entries into scoped remediation tasks. After fixes, rerun `/spec_kit:deep-review:auto`.

### 8. Ruled Out Approaches

- **Separate state files for review mode**: rejected because it duplicates the proven deep-research loop and hurts backward compatibility.
- **Final-only synthesis with no progressive report**: rejected because confirm mode and long-running review need observability, just like current deep research.
- **Score-only convergence**: rejected because a "good score" can still hide untouched files or unchecked dimensions.
- **Public `/spec_kit:review`**: rejected because it is too easy to confuse with single-pass `@review`.
- **Silent contradiction dropping**: rejected because it will cause unstable counts and unreliable release verdicts.

**Net recommendation**: expose `/spec_kit:deep-review[:auto|:confirm]` as a thin wrapper over the current deep-research engine, keep the existing scratch/state architecture, add `mode=review`, synthesize to `review-report.md`, and make coverage plus contradiction resolution first-class quality guards before the loop can stop.

## Assessment
newFindingsRatio: 1.0 (first iteration for this question, all findings new)

## Recommended Next Focus
Convergence synthesis -- all five research questions have now been investigated. The next step should compile the cross-question findings into a unified design document, resolving any contradictions between shard recommendations and producing the final spec artifacts (spec.md, plan.md, tasks.md).
