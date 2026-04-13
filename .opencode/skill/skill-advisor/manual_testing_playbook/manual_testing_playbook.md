---
title: "Skill Advisor & Graph: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review and orchestration guidance, execution expectations, and per-feature validation files for the skill-advisor routing and graph pipeline."
---

# Skill Advisor & Graph: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed for real - not mocked, not stubbed, not classified as "unautomatable". AI agents executing these scenarios must run the actual commands, inspect real files, call real handlers, and verify real outputs. The only acceptable classifications are PASS, FAIL, or SKIP (with a specific sandbox blocker documented). "UNAUTOMATABLE" is not a valid status.

This document combines the full manual-validation contract for the `skill-advisor` package into a single reference. The root playbook acts as the operator directory, review protocol, and orchestration guide: it explains how realistic user-driven tests should be run, how evidence should be captured, how results should be graded, and where each per-feature validation file lives. The per-feature files provide the deeper execution contract for each scenario, including the user request, operator prompt, execution process, source anchors, and validation criteria.

---

This playbook package adopts the Feature Catalog split-document pattern for canonical Skill Advisor validation. The root document acts as the directory, review surface, and orchestration guide, while per-feature execution detail lives in the numbered category folders at the playbook root.

Canonical source artifacts:
- `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md`
- `.opencode/skill/skill-advisor/manual_testing_playbook/01--routing-accuracy/`
- `.opencode/skill/skill-advisor/manual_testing_playbook/02--graph-boosts/`
- `.opencode/skill/skill-advisor/manual_testing_playbook/03--compiler/`
- `.opencode/skill/skill-advisor/manual_testing_playbook/04--regression-safety/`

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. GLOBAL PRECONDITIONS](#2--global-preconditions)
- [3. GLOBAL EVIDENCE REQUIREMENTS](#3--global-evidence-requirements)
- [4. DETERMINISTIC COMMAND NOTATION](#4--deterministic-command-notation)
- [5. REVIEW PROTOCOL AND RELEASE READINESS](#5--review-protocol-and-release-readiness)
- [6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING](#6--sub-agent-orchestration-and-wave-planning)
- [7. ROUTING ACCURACY (`RA-001..RA-008`)](#7--routing-accuracy-ra-001ra-008)
- [8. GRAPH BOOSTS (`GB-001..GB-007`)](#8--graph-boosts-gb-001gb-007)
- [9. COMPILER (`CP-001..CP-005`)](#9--compiler-cp-001cp-005)
- [10. REGRESSION SAFETY (`RS-001..RS-004`)](#10--regression-safety-rs-001rs-004)
- [11. AUTOMATED TEST CROSS-REFERENCE](#11--automated-test-cross-reference)
- [12. FEATURE CATALOG CROSS-REFERENCE INDEX](#12--feature-catalog-cross-reference-index)

---

## 1. OVERVIEW

This playbook provides 24 deterministic scenarios across 4 categories validating the `skill-advisor` routing and graph pipeline. Each feature keeps its original ID and links to a dedicated feature file with the full execution contract.

Coverage note (2026-04-13): all 24 scenario files now follow the split-document playbook contract, the 02/03/04 category stubs were rewritten to the sk-doc snippet shape, and the package uses the live `.opencode/skill/skill-advisor/` paths instead of the retired shared routing-script location.

### Realistic Test Model

1. A realistic user request is given to an operator or orchestrator.
2. The operator executes the deterministic command sequence exactly as written.
3. The operator captures both the execution process and the user-visible outcome.
4. The scenario passes only when the workflow is sound and the returned result would satisfy a real user.

### What The Feature Files Should Explain

- The realistic user request that should trigger the behavior
- The operator-facing prompt that should drive the test
- The exact command sequence and expected signals
- The source anchors that justify the scenario
- The pass/fail criteria and failure triage steps

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is the repository root.
2. Python 3 is available in the execution environment.
3. `.opencode/skill/skill-advisor/scripts/skill-graph.json` exists or can be regenerated before graph-sensitive checks.
4. The 21 skill folders with `graph-metadata.json` are present in `.opencode/skill/`.
5. Terminal transcript capture is enabled so JSON output, compiler warnings, and exit statuses are preserved.
6. This playbook has no destructive scenarios. Parallel execution is allowed except when a run regenerates `.opencode/skill/skill-advisor/scripts/skill-graph.json`, which should be isolated to one worker.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Command transcript
- User request used
- Operator-facing prompt used
- Full JSON output or the relevant excerpt
- Graph or compiler reason excerpts when applicable
- Exit status for compiler and regression commands
- Final scenario verdict with rationale

---

## 4. DETERMINISTIC COMMAND NOTATION

- CLI commands are written exactly as they should be pasted into the terminal.
- One-line Python inspection commands must be captured verbatim, including their inline JSON parsing.
- `->` separates ordered sequential steps when a feature file needs more than one command.
- If a command emits JSON, preserve raw output before summarizing it in the verdict.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual_testing_playbook.md`
2. Referenced per-feature files under `manual_testing_playbook/NN--category-name/`
3. Scenario execution evidence
4. Triage notes for all non-pass outcomes
5. Any regenerated graph artifact if the run rebuilt `.opencode/skill/skill-advisor/scripts/skill-graph.json`

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied.
2. Prompt and command sequence were executed as written.
3. Expected signals are present.
4. Evidence is complete and readable.
5. Outcome rationale is explicit.

Scenario verdict:
- `PASS`: all acceptance checks true
- `FAIL`: expected behavior missing, contradictory output, or a critical check failed
- `SKIP`: execution blocked by a specific environment issue that is captured in the evidence

### Feature Verdict Rules

- `PASS`: the mapped scenario passes
- `FAIL`: the mapped scenario fails
- `SKIP`: the mapped scenario was not executable because of a documented blocker

Hard rule:
- Any failed compiler or regression-safety scenario makes the package `NOT READY`.

### Release Readiness Rule

Release is `READY` only when:

1. No scenario verdict is `FAIL`.
2. All compiler and regression-safety scenarios are `PASS`.
3. Coverage is 100% of the 24 scenario files linked in this root document.
4. No unresolved blocker remains after triage.
5. No retired script-directory path references remain anywhere under `manual_testing_playbook/`.

Rule: keep global verdict logic in the root playbook. Put feature-specific acceptance caveats in the matching per-feature files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for the Skill Advisor manual testing package. It is not a runtime support matrix by itself.

### Operational Rules

1. Reserve one coordinator to keep the verdict ledger and evidence log coherent.
2. Run routing-accuracy scenarios as one wave, graph boosts as a second wave, compiler checks as a third wave, and regression safety as a fourth wave.
3. If the graph must be rebuilt, do that before running graph boosts or regression safety.
4. Do not mix graph-regeneration commands with read-only inspection commands in the same parallel wave.
5. Capture every FAIL with the matching per-feature file path and the exact command output that triggered it.
6. Re-run only the affected scenario after a targeted fix rather than rerunning the whole playbook by default.

### What Belongs In Per-Feature Files

- Real user request
- Operator prompt following the role -> action -> target -> verify contract
- Expected command output and ranking signals
- Feature-specific failure triage
- Source anchors for the implementation and regression surface

---

## 7. ROUTING ACCURACY (`RA-001..RA-008`)

These scenarios validate the top-1 routing result for the core skill families and confirm that adjacent graph behavior does not pollute the direct route.

| ID | Scenario | Prompt | Expected Top-1 | File |
|---|---|---|---|---|
| RA-001 | Git workflow routing | `"create a pull request on github"` | sk-git | [001-git-routing.md](01--routing-accuracy/001-git-routing.md) |
| RA-002 | Code review routing | `"security code review for regressions"` | sk-code-review | [002-code-review-routing.md](01--routing-accuracy/002-code-review-routing.md) |
| RA-003 | Figma MCP routing | `"export figma components as images"` | mcp-figma | [003-figma-routing.md](01--routing-accuracy/003-figma-routing.md) |
| RA-004 | CLI delegation routing | `"delegate to codex for code generation"` | cli-codex | [004-cli-delegation-routing.md](01--routing-accuracy/004-cli-delegation-routing.md) |
| RA-005 | Spec/memory routing | `"save this conversation context to memory"` | system-spec-kit | [005-spec-memory-routing.md](01--routing-accuracy/005-spec-memory-routing.md) |
| RA-006 | Deep review routing | `"deep review loop for release readiness"` | sk-deep-review | [006-deep-review-routing.md](01--routing-accuracy/006-deep-review-routing.md) |
| RA-007 | Prompt improvement routing | `"improve this prompt with COSTAR framework"` | sk-improve-prompt | [007-prompt-improvement-routing.md](01--routing-accuracy/007-prompt-improvement-routing.md) |
| RA-008 | Semantic search routing | `"find code that handles auth"` | mcp-coco-index | [008-semantic-search-routing.md](01--routing-accuracy/008-semantic-search-routing.md) |

---

## 8. GRAPH BOOSTS (`GB-001..GB-007`)

These scenarios validate the graph-derived routing layer, including dependency pull-up, overlay boosts, family affinity guards, confidence penalties, and compiled prerequisite edges.

| ID | Scenario | Prompt | Expected Behavior | File |
|---|---|---|---|---|
| GB-001 | Dependency pull-up | `"use figma to export designs"` | mcp-code-mode appears via `!graph:depends` without displacing mcp-figma | [001-dependency-pullup.md](02--graph-boosts/001-dependency-pullup.md) |
| GB-002 | Enhances overlay | `"review opencode typescript module"` | sk-code-review and sk-code-opencode both appear with `!graph:enhances` evidence | [002-enhances-overlay.md](02--graph-boosts/002-enhances-overlay.md) |
| GB-003 | Ghost candidate prevention | `"build something"` | No result appears from graph evidence alone | [003-ghost-prevention.md](02--graph-boosts/003-ghost-prevention.md) |
| GB-004 | Family affinity guard | `"use codex cli for generation"` | CLI siblings do not appear from `!graph:family(cli)` alone | [004-family-affinity.md](02--graph-boosts/004-family-affinity.md) |
| GB-005 | Evidence separation | `"review web code"` | Graph-heavy results receive the expected confidence discount | [005-evidence-separation.md](02--graph-boosts/005-evidence-separation.md) |
| GB-006 | Hub skill edges | `"spec folder documentation"` | system-spec-kit and sk-doc both appear with graph-linked evidence | [006-hub-skill-edges.md](02--graph-boosts/006-hub-skill-edges.md) |
| GB-007 | Prerequisite_for compiled | `"inspect compiled prerequisite_for adjacency for mcp-code-mode"` | Compiled adjacency includes prerequisite_for entries for mcp-figma, mcp-clickup, and mcp-chrome-devtools | [007-prerequisite-for.md](02--graph-boosts/007-prerequisite-for.md) |

---

## 9. COMPILER (`CP-001..CP-005`)

These scenarios validate the graph compiler and the advisor health surface that depends on its output.

| ID | Scenario | Command | Expected | File |
|---|---|---|---|---|
| CP-001 | Schema validation | `python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only` | 21 metadata files discovered, zero validation errors, exit 0 | [001-schema-validation.md](03--compiler/001-schema-validation.md) |
| CP-002 | Zero-edge warnings | `python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only` | Orphan skills warned without failing validation | [002-zero-edge-warnings.md](03--compiler/002-zero-edge-warnings.md) |
| CP-003 | Compiled output includes signals | `python3 -c "...skill-graph.json..."` | `signals` field present and populated | [003-compiled-signals.md](03--compiler/003-compiled-signals.md) |
| CP-004 | Size target enforcement | `python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py` | Compiler prints the byte count and warning state that matches the 4096-byte threshold | [004-size-target.md](03--compiler/004-size-target.md) |
| CP-005 | Health check integration | `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --health` | `skill_graph_loaded: true`, `skill_graph_skill_count: 21`, status `ok` | [005-health-check.md](03--compiler/005-health-check.md) |

---

## 10. REGRESSION SAFETY (`RS-001..RS-004`)

These scenarios validate the permanent regression harness and the abstain guardrails that keep routing changes safe.

| ID | Scenario | Command | Expected | File |
|---|---|---|---|---|
| RS-001 | Full regression suite | `python3 .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | `overall_pass: true`, `failed_cases: 0`, all gates green | [001-full-regression.md](04--regression-safety/001-full-regression.md) |
| RS-002 | P0 cases untouched | Same harness + canonical dataset | `p0_total: 12`, `p0_passed: 12`, `p0_pass_rate: 1.0` | [002-p0-cases.md](04--regression-safety/002-p0-cases.md) |
| RS-003 | Graph-specific cases | Filtered regression harness output | P1-GRAPH-001/002/003 absent from failures | [003-graph-cases.md](04--regression-safety/003-graph-cases.md) |
| RS-004 | Abstain on noise | Three direct advisor invocations | `[]` for `"help"`, `"hello"`, and `"thanks"` | [004-abstain-noise.md](04--regression-safety/004-abstain-noise.md) |

---

## 11. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `.opencode/skill/skill-advisor/scripts/skill_advisor_regression.py` | Suite metrics, gates, and failures list | RS-001, RS-002, RS-003 |
| `.opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Stable routing, graph, and abstain fixtures | RA-001, RA-005, GB-001, GB-002, RS-001..RS-004 |
| `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py` | Schema validation, warning emission, compiled graph generation, size reporting | CP-001, CP-002, CP-003, CP-004, GB-007 |
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py --health` | Runtime graph diagnostics and cache reporting | CP-005 |

---

## 12. FEATURE CATALOG CROSS-REFERENCE INDEX

Skill Advisor ships a live feature catalog rooted at [`../feature_catalog/feature_catalog.md`](../feature_catalog/feature_catalog.md). Use that catalog for the current-state inventory, and use this playbook package for operator prompts, execution steps, evidence capture, and verdict criteria.

| Feature ID | Feature Name | Category | Feature File | Catalog Reference |
|---|---|---|---|---|
| RA-001 | Git workflow routing | Routing Accuracy | [RA-001](01--routing-accuracy/001-git-routing.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| RA-002 | Code review routing | Routing Accuracy | [RA-002](01--routing-accuracy/002-code-review-routing.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| RA-003 | Figma MCP routing | Routing Accuracy | [RA-003](01--routing-accuracy/003-figma-routing.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| RA-004 | CLI delegation routing | Routing Accuracy | [RA-004](01--routing-accuracy/004-cli-delegation-routing.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| RA-005 | Spec/memory routing | Routing Accuracy | [RA-005](01--routing-accuracy/005-spec-memory-routing.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| RA-006 | Deep review routing | Routing Accuracy | [RA-006](01--routing-accuracy/006-deep-review-routing.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| RA-007 | Prompt improvement routing | Routing Accuracy | [RA-007](01--routing-accuracy/007-prompt-improvement-routing.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| RA-008 | Semantic search routing | Routing Accuracy | [RA-008](01--routing-accuracy/008-semantic-search-routing.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| GB-001 | Dependency pull-up | Graph Boosts | [GB-001](02--graph-boosts/001-dependency-pullup.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| GB-002 | Enhances overlay | Graph Boosts | [GB-002](02--graph-boosts/002-enhances-overlay.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| GB-003 | Ghost candidate prevention | Graph Boosts | [GB-003](02--graph-boosts/003-ghost-prevention.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| GB-004 | Family affinity guard | Graph Boosts | [GB-004](02--graph-boosts/004-family-affinity.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| GB-005 | Evidence separation | Graph Boosts | [GB-005](02--graph-boosts/005-evidence-separation.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| GB-006 | Hub skill edges | Graph Boosts | [GB-006](02--graph-boosts/006-hub-skill-edges.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| GB-007 | Prerequisite_for compiled | Graph Boosts | [GB-007](02--graph-boosts/007-prerequisite-for.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| CP-001 | Schema validation | Compiler | [CP-001](03--compiler/001-schema-validation.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| CP-002 | Zero-edge warnings | Compiler | [CP-002](03--compiler/002-zero-edge-warnings.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| CP-003 | Compiled output includes signals | Compiler | [CP-003](03--compiler/003-compiled-signals.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| CP-004 | Size target enforcement | Compiler | [CP-004](03--compiler/004-size-target.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| CP-005 | Health check integration | Compiler | [CP-005](03--compiler/005-health-check.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| RS-001 | Full regression suite | Regression Safety | [RS-001](04--regression-safety/001-full-regression.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| RS-002 | P0 cases untouched | Regression Safety | [RS-002](04--regression-safety/002-p0-cases.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| RS-003 | Graph-specific cases | Regression Safety | [RS-003](04--regression-safety/003-graph-cases.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| RS-004 | Abstain on noise | Regression Safety | [RS-004](04--regression-safety/004-abstain-noise.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
