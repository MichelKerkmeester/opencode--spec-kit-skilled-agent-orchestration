---
title: sk-agent-improver Manual Testing Playbook
description: Operator-facing validation matrix for the sk-agent-improver skill covering integration scanning, dynamic profiling, 5-dimension scoring, benchmark integration, reducer dimensions, end-to-end loop execution, and runtime truth validation.
version: 1.0.0
---

# sk-agent-improver Manual Testing Playbook

Manual validation matrix for the holistic agent evaluation framework. Each scenario has an exact command, expected output signals, and pass/fail criteria.

---

## 1. OVERVIEW

### Purpose

Validates that the sk-agent-improver skill correctly discovers integration surfaces, generates dynamic profiles, scores agents across 5 dimensions, integrates with benchmarks, tracks dimensional progress, and runs end-to-end loops.

### Scope

| Category | Scenarios | Focus |
| --- | --- | --- |
| 01 Integration Scanner | 4 | Surface discovery, mirror sync, missing agents, JSON output |
| 02 Profile Generator | 4 | Rule extraction, permission parsing, capability mismatches, edge cases |
| 03 5-Dimension Scorer | 5 | Dynamic mode, legacy mode, dimension breakdown, backward compat, error handling |
| 04 Benchmark Integration | 3 | Integration report flag, backward compat without flag, scoring formula |
| 05 Reducer Dimensions | 3 | Dimensional tracking, dashboard rendering, plateau stop |
| 06 End-to-End Loop | 5 | Full pipeline, any-agent support, mutation coverage, trade-offs, lineage |
| 07 Runtime Truth | 7 | Stop-reason taxonomy, journal audit, resume, legal-stop gates, benchmark stability, trajectory, parallel opt-in |

### Prerequisites

- Node.js available (v18+)
- Working directory is the repo root
- All 8 `.cjs` scripts in `.opencode/skill/sk-agent-improver/scripts/` parse without errors
- `package_skill.py --check` passes for sk-agent-improver

### How to Execute

Run each scenario command from the repo root. Compare output against expected signals. Record verdict (PASS/FAIL) with evidence.

---

## 2. TEST MATRIX

### 01 Integration Scanner

| ID | Scenario | Command | Expected Signals | Pass Criteria |
| --- | --- | --- | --- | --- |
| 01-001 | Scan known agent (handover) | `node scripts/scan-integration.cjs --agent=handover` | `status: "complete"`, `mirrors: [...aligned...]`, `commandCount > 0`, `skillCount > 0` | All mirrors aligned, non-zero command and skill counts |
| 01-002 | Scan agent with no mirrors | `node scripts/scan-integration.cjs --agent=nonexistent` | `status: "complete"`, canonical `exists: false`, mirrors all `missing` | Script completes without error, reports missing surfaces |
| 01-003 | Scan diverse agent (debug) | `node scripts/scan-integration.cjs --agent=debug` | `totalSurfaces >= 20`, mirrors aligned | Finds surfaces across commands, skills, global docs |
| 01-004 | JSON output to file | `node scripts/scan-integration.cjs --agent=handover --output=/tmp/scan-test.json` | File written, valid JSON, same content as stdout | File exists and parses as JSON |

### 02 Profile Generator

| ID | Scenario | Command | Expected Signals | Pass Criteria |
| --- | --- | --- | --- | --- |
| 02-001 | Profile with ALWAYS/NEVER rules | `node scripts/generate-profile.cjs --agent=.opencode/agent/handover.md` | `ruleCoherence` array has rules with type `always` and `never` | At least 3 always + 2 never rules extracted |
| 02-002 | Profile with OUTPUT VERIFICATION | `node scripts/generate-profile.cjs --agent=.opencode/agent/debug.md` | `outputChecks` array non-empty | At least 5 output checklist items extracted |
| 02-003 | Agent with no dedicated RULES section | `node scripts/generate-profile.cjs --agent=.opencode/agent/debug.md` | Falls back to inline NEVER extraction | At least 1 never-rule extracted from body scan |
| 02-004 | Output to file | `node scripts/generate-profile.cjs --agent=.opencode/agent/review.md --output=/tmp/profile-test.json` | File written, valid JSON | File exists, has `id`, `derivedChecks`, `agentMeta` |

### 03 5-Dimension Scorer

| ID | Scenario | Command | Expected Signals | Pass Criteria |
| --- | --- | --- | --- | --- |
| 03-001 | Dynamic mode on handover | `node scripts/score-candidate.cjs --candidate=.opencode/agent/handover.md --dynamic` | `evaluationMode: "dynamic-5d"`, 5 dimensions, `legacyScore` present | All 5 dimensions scored, weighted score >= 70 |
| 03-002 | Dynamic mode on arbitrary agent | `node scripts/score-candidate.cjs --candidate=.opencode/agent/orchestrate.md --dynamic` | `evaluationMode: "dynamic-5d"`, `profileId` matches agent name | Produces valid score without hardcoded profile |
| 03-003 | Legacy mode unchanged | `node scripts/score-candidate.cjs --candidate=.opencode/agent/handover.md --profile=handover --target=.opencode/agent/handover.md` | `evaluationMode: "prompt-surface"`, no `dimensions` field | Score identical to pre-refactor behavior |
| 03-004 | Dimension breakdown meaningful | `node scripts/score-candidate.cjs --candidate=.opencode/agent/handover.md --dynamic` | Each dimension has `details` array with individual checks | Details show which checks passed/failed per dimension |
| 03-005 | Missing candidate file | `node scripts/score-candidate.cjs --candidate=nonexistent.md --dynamic` | `status: "infra_failure"`, exit code 1 | Graceful error, not crash |

### 04 Benchmark Integration

| ID | Scenario | Command | Expected Signals | Pass Criteria |
| --- | --- | --- | --- | --- |
| 04-001 | Existing benchmark without integration | `node scripts/run-benchmark.cjs --profile=handover --outputs-dir=/tmp/bench-test --output=/tmp/bench-out.json` | No `integrationScore` field in output | Backward compatible, no integration fields |
| 04-002 | Benchmark with integration report | (Requires integration-report JSON) | `integrationScore` present, `integrationDetails` with mirrorScore, commandScore, skillScore | Integration score is weighted average |
| 04-003 | Existing fixtures still pass | `node scripts/run-benchmark.cjs --profile=handover --outputs-dir=... --output=...` | Existing handover fixtures produce expected scores | No regression from pre-refactor behavior |

### 05 Reducer Dimensions

| ID | Scenario | Command | Expected Signals | Pass Criteria |
| --- | --- | --- | --- | --- |
| 05-001 | Records without dimensions | (Feed JSONL without dimensions field) | Dashboard renders normally, no dimension table | Backward compatible, no errors |
| 05-002 | Records with dimensions | (Feed JSONL with dimensions array) | Dashboard includes "Dimensional Progress" table | Shows Latest, Best, Trend per dimension |
| 05-003 | Plateau detection | (Feed 3+ identical dimension scores) | `stopOnDimensionPlateau` triggers | Stop status reports "All dimensions plateaued" |

### 06 End-to-End Loop

| ID | Scenario | Command | Expected Signals | Pass Criteria |
| --- | --- | --- | --- | --- |
| 06-001 | Full pipeline handover | `/improve:agent-improver ".opencode/agent/handover.md" :confirm --spec-folder={spec}` | Init creates runtime, scan runs, candidate generated, scored with dimensions | All phases complete without error |
| 06-002 | Any-agent pipeline | `/improve:agent-improver ".opencode/agent/debug.md" :confirm --spec-folder={spec}` | Dynamic profile generated, 5-dimension scores produced | Non-hardcoded agent evaluates successfully |
| 06-003 | Mutation coverage graph | `/improve:agent ".opencode/agent/handover.md" :confirm --spec-folder={spec} --iterations=3` | Coverage graph with improvement namespace, dimension nodes, exhausted mutations | Graph isolated to improvement namespace |
| 06-004 | Trade-off detection | `/improve:agent ".opencode/agent/handover.md" :confirm --spec-folder={spec} --iterations=3` | Trade-off detected on cross-dimension regression, candidate not auto-promoted | Trade-off event fired, promotion blocked |
| 06-005 | Candidate lineage | `/improve:agent ".opencode/agent/handover.md" :confirm --spec-folder={spec} --iterations=3` | Lineage graph with parent-child references, session-id, wave-index | Lineage traversable root to leaf |

### 07 Runtime Truth

| ID | Scenario | Command | Expected Signals | Pass Criteria |
| --- | --- | --- | --- | --- |
| 07-001 | Stop-reason taxonomy | `/improve:agent ".opencode/agent/handover.md" :confirm --spec-folder={spec} --iterations=2` | `session_ended` event with valid `stopReason` and `sessionOutcome` | Both values from frozen taxonomy enums |
| 07-002 | Audit journal emission | `/improve:agent ".opencode/agent/handover.md" :confirm --spec-folder={spec} --iterations=1` | Journal contains `session_start`, `candidate_generated`, `candidate_scored`, `gate_evaluation`, `session_end` | All 5 lifecycle events present |
| 07-003 | Resume continuation | `/improve:agent ... --resume` | `continuedFromIteration` set, journal has 2 `session_start` events | Continues from last completed iteration |
| 07-004 | Legal-stop gates | `/improve:agent ... --iterations=5` | `legal_stop_evaluated` with 5 gate bundles, `blocked_stop` on failure | `blockedStop` recorded when gates fail |
| 07-005 | Benchmark stability | `node benchmark-stability.cjs` (unit) | Mean, stddev, coefficient per dimension, `isStable()` result | Stable=true for low variance, false for high |
| 07-006 | Dimension trajectory | `node mutation-coverage.cjs` (unit) | Trajectory recorded, convergence requires 3+ stable points | Convergence rejected <3 points, accepted when stable |
| 07-007 | Parallel candidates opt-in | Config check + default session | `parallelWaves.enabled: false`, single candidate per iteration | No parallel wave behavior with defaults |

---

## 3. REVIEW PROTOCOL

### Evidence Collection

For each scenario:
1. Run the command
2. Capture stdout (or output file)
3. Record: scenario ID, verdict (PASS/FAIL), captured output excerpt, tester, date

### Failure Triage

| Failure Type | Action |
| --- | --- |
| Script parse error | Check Node.js version, run `node -c script.cjs` |
| Missing fields in output | Check if script was refactored correctly, compare against expected JSON shape |
| Wrong score values | Check dimension weights sum to 1.0, check profile generation logic |
| Integration scanner finds 0 surfaces | Check `--agent` argument matches the agent filename (no extension) |
| Profile generator extracts 0 rules | Check agent uses standard RULES/ALWAYS/NEVER section structure |

### Regression Indicators

- Legacy mode (`--profile`) produces different scores than before refactor
- Benchmark fixtures that previously passed now fail
- Scanner misses known mirror files
- JSON output shape changes break downstream consumers

---

## 4. FEATURE FILES

| Category | Files |
| --- | --- |
| `01--integration-scanner/` | 001-scan-known-agent, 002-scan-missing-agent, 003-scan-diverse-agent, 004-json-output-file |
| `02--profile-generator/` | 005-rules-extraction, 006-output-checks, 007-inline-rules-fallback, 008-file-output |
| `03--5d-scorer/` | 009-dynamic-handover, 010-dynamic-arbitrary, 011-legacy-unchanged, 012-dimension-details, 013-missing-candidate |
| `04--benchmark-integration/` | 014-without-integration, 015-with-integration, 016-fixture-regression |
| `05--reducer-dimensions/` | 017-no-dimensions, 018-with-dimensions, 019-plateau-detection |
| `06--end-to-end-loop/` | 020-full-pipeline, 021-any-agent, 022-mutation-coverage-graph-tracking, 023-trade-off-detection, 024-candidate-lineage |
| `07--runtime-truth/` | 025-stop-reason-taxonomy, 026-audit-journal-emission, 027-resume-continuation, 028-legal-stop-gates, 029-benchmark-stability, 030-dimension-trajectory, 031-parallel-candidates-opt-in |

---

## 5. RELATED RESOURCES

- `SKILL.md` — Skill router and 5-dimension framework
- `references/evaluator_contract.md` — Scoring rubric
- `references/integration_scanning.md` — Scanner documentation
- `references/quick_reference.md` — Command examples
