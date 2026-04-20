---
title: "Skill Advisor & Graph: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review and orchestration guidance, execution expectations, and per-feature validation files for the skill-advisor routing and graph pipeline."
---

# Skill Advisor & Graph: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed for real - not mocked, not stubbed, not classified as "unautomatable". AI agents executing these scenarios must run the actual commands, inspect real files, call real handlers, and verify real outputs. The only acceptable classifications are PASS, FAIL, or SKIP (with a specific sandbox blocker documented). "UNAUTOMATABLE" is not a valid status.

This document combines the full manual-validation contract for the `skill-advisor` package into a single reference. The root playbook acts as the operator directory, review protocol, and orchestration guide: it explains how realistic user-driven tests should be run, how evidence should be captured, how results should be graded, and where each deeper execution contract lives. Categories `01--` through `07--` use per-feature validation files. The plugin-path, measurement-run, and live-session telemetry categories remain root-only scenario tables in this document until split-doc follow-ups are added.

---

This playbook package uses a mixed structure for canonical Skill Advisor validation. The root document acts as the directory, review surface, and orchestration guide. Categories `01--` through `07--` keep per-feature execution detail in numbered category folders at the playbook root, while `PP-*`, `MR-*`, and `LT-*` remain inline root-only scenarios in this document.

Canonical source artifacts:
- `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md`
- `.opencode/skill/skill-advisor/manual_testing_playbook/01--routing-accuracy/`
- `.opencode/skill/skill-advisor/manual_testing_playbook/02--graph-boosts/`
- `.opencode/skill/skill-advisor/manual_testing_playbook/03--compiler/`
- `.opencode/skill/skill-advisor/manual_testing_playbook/04--regression-safety/`
- `.opencode/skill/skill-advisor/manual_testing_playbook/05--sqlite-graph/`
- `.opencode/skill/skill-advisor/manual_testing_playbook/06--hook-routing/`
- `.opencode/skill/skill-advisor/manual_testing_playbook/07--native-compat/`

Root-only scenario surfaces:
- `PP-001..PP-005` in [Section 13](#13--plugin-path-pp-001pp-005)
- `MR-001..MR-003` in [Section 14](#14--measurement-run-mr-001mr-003)
- `LT-001..LT-004` in [Section 15](#15--live-session-telemetry-lt-001lt-004)

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
- [11. SQLITE GRAPH (`SG-001..SG-004`)](#11--sqlite-graph-sg-001sg-004)
- [12. HOOK ROUTING (`HR-001..HR-006`)](#12--hook-routing-hr-001hr-006)
- [13. NATIVE COMPAT (`NC-001..NC-005`)](#13--native-compat-nc-001nc-005)
- [14. PLUGIN PATH (`PP-001..PP-005`)](#14--plugin-path-pp-001pp-005)
- [15. MEASUREMENT RUN (`MR-001..MR-003`)](#15--measurement-run-mr-001mr-003)
- [16. LIVE-SESSION TELEMETRY (`LT-001..LT-004`)](#16--live-session-telemetry-lt-001lt-004)
- [17. AUTOMATED TEST CROSS-REFERENCE](#17--automated-test-cross-reference)
- [18. FEATURE CATALOG CROSS-REFERENCE INDEX](#18--feature-catalog-cross-reference-index)

---

## 1. OVERVIEW

This playbook provides deterministic scenarios across 10 categories validating the `skill-advisor` routing, graph pipeline, Phase 020 prompt-time hook surface, plugin path, native compat migration, static measurement harness, and live telemetry workflow. Each feature keeps its original ID and links to its execution contract, whether that contract lives in a per-feature file or in an inline root section.

Coverage note (2026-04-20): categories `01--` through `06--` use per-feature files. `PP-*`, `MR-*`, and `LT-*` currently ship as inline root-only scenarios and should be executed directly from this document.

### Realistic Test Model

1. A realistic user request is given to an operator or orchestrator.
2. The operator executes the deterministic command sequence exactly as written.
3. The operator captures both the execution process and the user-visible outcome.
4. The scenario passes only when the workflow is sound and the returned result would satisfy a real user.

### What The Scenario Contracts Should Explain

- The realistic user request that should trigger the behavior
- The operator-facing prompt that should drive the test
- The exact command sequence and expected signals
- The source anchors that justify the scenario
- The pass/fail criteria and failure triage steps
- Whether the execution contract lives in a per-feature file or in the root playbook

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is the repository root.
2. Python 3 is available in the execution environment.
3. `.opencode/skill/system-spec-kit/mcp_server/database/skill-graph.sqlite` exists or can be regenerated before SQLite graph checks.
4. `.opencode/skill/skill-advisor/scripts/skill-graph.json` exists or can be regenerated before JSON fallback checks.
5. The current set of skill folders with `graph-metadata.json` is present in `.opencode/skill/`; treat the inventory as live discovery data rather than a fixed count.
6. The system-spec-kit MCP server is running for `SG-001`, `SG-002`, and `SG-003`.
7. The MCP server has been built before native compat checks: `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`.
8. Terminal transcript capture is enabled so JSON output, compiler warnings, exit statuses, and MCP tool responses are preserved.
9. This playbook includes one controlled destructive scenario, `SG-004`, which temporarily renames `skill-graph.sqlite`. Run that scenario in isolation and restore the database file before parallel execution resumes.

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
- MCP tool invocations are written as `tool_name({...})` and should be executed through the active runtime's MCP client without rewriting arguments.
- One-line Python inspection commands must be captured verbatim, including their inline JSON parsing.
- `->` separates ordered sequential steps when a feature file needs more than one command.
- If a command emits JSON, preserve raw output before summarizing it in the verdict.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual_testing_playbook.md`
2. Referenced per-feature files under `manual_testing_playbook/NN--category-name/` for categories `01--` through `07--`
3. Inline root sections for `PP-*`, `MR-*`, and `LT-*`
4. Scenario execution evidence
5. Triage notes for all non-pass outcomes
6. Any regenerated graph artifact if the run rebuilt `.opencode/skill/skill-advisor/scripts/skill-graph.json`
7. Proof that `SG-004` restored `skill-graph.sqlite` after fallback validation

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
- A failed `SG-004` restore also makes the package `NOT READY` until `skill-graph.sqlite` is back in place.

### Release Readiness Rule

Release is `READY` only when:

1. No scenario verdict is `FAIL`.
2. All compiler and regression-safety scenarios are `PASS`.
3. Coverage is 100% of the scenarios linked in this root document.
4. No unresolved blocker remains after triage.
5. No retired script-directory path references remain anywhere under `manual_testing_playbook/`.
6. `skill-graph.sqlite` has been restored after any JSON fallback run.

Rule: keep global verdict logic in the root playbook. Put feature-specific acceptance caveats in the matching per-feature files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for the Skill Advisor manual testing package. It is not a runtime support matrix by itself.

### Operational Rules

1. Reserve one coordinator to keep the verdict ledger and evidence log coherent.
2. Run routing-accuracy scenarios as one wave, graph boosts as a second wave, compiler checks as a third wave, regression safety as a fourth wave, and SQLite graph scenarios as a fifth wave.
3. If the graph must be rebuilt, do that before running graph boosts, regression safety, SQLite graph checks, or hook-routing stale-graph checks.
4. Do not mix graph-regeneration commands, watcher-driven metadata edits, or the `SG-004` database rename with read-only inspection commands in the same parallel wave.
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
| CP-001 | Schema validation | `python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only` | All current metadata files discovered, zero validation errors, exit 0 | [001-schema-validation.md](03--compiler/001-schema-validation.md) |
| CP-002 | Zero-edge warnings | `python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only` | Orphan skills warned without failing validation | [002-zero-edge-warnings.md](03--compiler/002-zero-edge-warnings.md) |
| CP-003 | Compiled output includes signals | `python3 -c "...skill-graph.json..."` | `signals` field present and populated | [003-compiled-signals.md](03--compiler/003-compiled-signals.md) |
| CP-004 | Size target enforcement | `python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py` | Compiler prints the byte count and warning state that matches the 4096-byte threshold | [004-size-target.md](03--compiler/004-size-target.md) |
| CP-005 | Health check integration | `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --health` | `skill_graph_loaded: true`, nonzero discovery counts, `skill_graph_skill_count` matches the current graph inventory, and `status` is `ok` only when graph, cache, source metadata, and inventory parity are healthy | [005-health-check.md](03--compiler/005-health-check.md) |

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

## 11. SQLITE GRAPH (`SG-001..SG-004`)

These scenarios validate the live SQLite graph store, the MCP graph tools, watcher-driven reindexing, and the advisor's JSON fallback path.

| ID | Scenario | Command | Expected | File |
|---|---|---|---|---|
| SG-001 | SQLite startup scan | `ls .opencode/skill/system-spec-kit/mcp_server/database/skill-graph.sqlite -> skill_graph_status({})` | Database file exists and `totalSkills` reports 21 | [001-sqlite-startup-scan.md](05--sqlite-graph/001-sqlite-startup-scan.md) |
| SG-002 | MCP query tools | `skill_graph_query({queryType:"depends_on",skillId:"mcp-figma"})` | `mcp-code-mode` returned as the outbound dependency | [002-mcp-query-tools.md](05--sqlite-graph/002-mcp-query-tools.md) |
| SG-003 | Auto reindex | `edit graph-metadata.json -> wait 3s -> skill_graph_query({queryType:"depends_on",skillId:"mcp-figma"})` | Updated edge weight appears without running the compiler | [003-auto-reindex.md](05--sqlite-graph/003-auto-reindex.md) |
| SG-004 | JSON fallback | `mv skill-graph.sqlite ... -> python3 .../skill_advisor.py "test" --health` | Advisor reports `skill_graph_source: "json"` while SQLite is absent | [004-json-fallback.md](05--sqlite-graph/004-json-fallback.md) |

---

## 12. HOOK ROUTING (`HR-001..HR-006`)

These scenarios validate the Phase 020 hook surface that now acts as the primary advisor invocation path. Run them after the MCP server bundle has been built and after runtime hook registration has been checked against the [Skill Advisor Hook Reference](../../system-spec-kit/references/hooks/skill-advisor-hook.md).

| ID | Scenario | Command or Action | Expected | File |
|---|---|---|---|---|
| HR-001 | Runtime registration check | Inspect Claude, Gemini, Copilot, and Codex hook config surfaces | Each active runtime points to the compiled advisor hook or documented wrapper fallback | [001-hook-routing-smoke.md](06--hook-routing/001-hook-routing-smoke.md) |
| HR-002 | Work-intent prompt emits brief | Send `"implement a TypeScript hook"` through each registered runtime | Model-visible output contains `Advisor: ...` when freshness allows emission | [001-hook-routing-smoke.md](06--hook-routing/001-hook-routing-smoke.md) |
| HR-003 | Help prompt suppresses brief | Send `"/help"` through each registered runtime | No advisor brief is emitted and output is `{}` or no wrapper rewrite | [001-hook-routing-smoke.md](06--hook-routing/001-hook-routing-smoke.md) |
| HR-004 | Disable flag bypass | Set `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` and repeat one hook smoke | Producer is not called and runtime output is `{}` or no wrapper rewrite | [001-hook-routing-smoke.md](06--hook-routing/001-hook-routing-smoke.md) |
| HR-005 | Stale graph still emits stale badge | Make skill sources newer than `skill-graph.sqlite`, then send a work-intent prompt | Brief still emits with `Advisor: stale` when a recommendation passes threshold | [001-hook-routing-smoke.md](06--hook-routing/001-hook-routing-smoke.md) |
| HR-006 | Diagnostic privacy spot-check | Inspect hook JSONL/diagnostic output after the smoke run | Forbidden fields `prompt`, `promptFingerprint`, `promptExcerpt`, `stdout`, and `stderr` are absent | [001-hook-routing-smoke.md](06--hook-routing/001-hook-routing-smoke.md) |

---

## 13. NATIVE COMPAT (`NC-001..NC-005`)

These scenarios validate the 027/005 compatibility migration: `skill_advisor.py` probes native `advisor_recommend`, falls back to Python, the plugin bridge delegates to native, lifecycle redirect metadata renders prompt-safely, and H5 operator states are actionable.

| ID | Scenario | Command or Action | Expected | File |
|---|---|---|---|---|
| NC-001 | Native CLI path | `python3 .../skill_advisor.py --force-native "save this conversation context to memory"` | Legacy JSON array with top `system-spec-kit` and `source: "native"` | [001-native-shim-and-plugin.md](07--native-compat/001-native-shim-and-plugin.md) |
| NC-002 | Python fallback path | `python3 .../skill_advisor.py --force-local "help me commit my changes"` | Python scorer returns top `sk-git` | [001-native-shim-and-plugin.md](07--native-compat/001-native-shim-and-plugin.md) |
| NC-003 | `--stdin` regression | Pipe a prompt into `skill_advisor.py --force-native --stdin` | Native route returns JSON and does not echo prompt text | [001-native-shim-and-plugin.md](07--native-compat/001-native-shim-and-plugin.md) |
| NC-004 | Plugin bridge delegation | Run `spec-kit-skill-advisor-bridge.mjs` with JSON stdin | `metadata.route: "native"` and prompt-safe `Advisor:` brief | [001-native-shim-and-plugin.md](07--native-compat/001-native-shim-and-plugin.md) |
| NC-005 | Redirect/lifecycle status | Run `redirect-metadata.vitest.ts` | Superseded, archived, future, and rolled-back surfaces render correctly | [001-native-shim-and-plugin.md](07--native-compat/001-native-shim-and-plugin.md) |

---

## 14. PLUGIN PATH (`PP-001..PP-005`)

These scenarios cover the Phase 023 Area F `spec-kit-skill-advisor` OpenCode plugin + its bridge process. Run them after the plugin has been enabled in the OpenCode runtime config and the MCP server bundle has been built.

| ID | Scenario | Command or Action | Expected | File |
|---|---|---|---|---|
| PP-001 | Plugin loads on session start | Start an OpenCode session with the plugin enabled | Plugin initializes session cache; no errors in session log | [Root playbook §14](#14--plugin-path-pp-001pp-005) |
| PP-002 | Plugin emits brief on user prompt | Send a work-intent prompt with the plugin active | Plugin bridge returns rendered brief, delivered as `additionalContext` | [Root playbook §14](#14--plugin-path-pp-001pp-005) |
| PP-003 | Status tool prompt-safety | Invoke the plugin's status tool during a session | Output contains counters/status only — no raw prompts, no fingerprints, no stdout/stderr | [Root playbook §14](#14--plugin-path-pp-001pp-005) |
| PP-004 | Env opt-out | Set `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` and restart | Plugin initializes disabled; no bridge invocation per user prompt; `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED=1` remains accepted as a legacy alias | [Root playbook §14](#14--plugin-path-pp-001pp-005) |
| PP-005 | Config opt-out | Set `enabled: false` in plugin config and restart | Same as PP-004: bridge never invoked | [Root playbook §14](#14--plugin-path-pp-001pp-005) |

---

## 15. MEASUREMENT RUN (`MR-001..MR-003`)

These scenarios cover the Phase 024 Track 2 static corpus measurement harness. Run locally when validating advisor accuracy baselines or after significant advisor / smart-router changes.

| ID | Scenario | Command or Action | Expected | File |
|---|---|---|---|---|
| MR-001 | Full 200-prompt corpus run | Execute `cd .opencode/skill/system-spec-kit/scripts && npx tsx observability/smart-router-measurement.ts` end-to-end against 019/004 corpus | `smart-router-measurement-report.md` regenerated; `smart-router-measurement-results.jsonl` has 200 records; optional static compliance telemetry writes `.opencode/reports/smart-router-static/compliance.jsonl`; summary reports per-skill accuracy + savings | [Root playbook §15](#15--measurement-run-mr-001mr-003) |
| MR-002 | Advisor accuracy baseline | Inspect the generated report's summary line | Current baseline: 56.00% (112/200). Regressions below this warrant investigation | [Root playbook §15](#15--measurement-run-mr-001mr-003) |
| MR-003 | UNKNOWN-fallback rate | Check report's UNKNOWN row | Should be ≤ 18.5% (baseline); higher means routing vocabulary regressed | [Root playbook §15](#15--measurement-run-mr-001mr-003) |

---

## 16. LIVE-SESSION TELEMETRY (`LT-001..LT-004`)

These scenarios cover the Phase 024 Track 3 live-session wrapper + Track 4 analyzer workflow. Run by the operator who owns the runtime session to collect real compliance data.

| ID | Scenario | Command or Action | Expected | File |
|---|---|---|---|---|
| LT-001 | Wrapper registration per runtime | Follow [`LIVE_SESSION_WRAPPER_SETUP.md`](../../system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md) for the target runtime | Wrapper registered through the runtime-specific surface; Copilot uses callback wrapping rather than a generic settings-file model | [Root playbook §16](#16--live-session-telemetry-lt-001lt-004) |
| LT-002 | Read-tool telemetry accumulates | Run a session, exercise the active runtime normally, then call `finalizeSmartRouterPrompt(promptId)` once when that prompt completes | `.opencode/skill/.smart-router-telemetry/compliance.jsonl` gains one new aggregate line per finalized prompt with compliance classification | [Root playbook §16](#16--live-session-telemetry-lt-001lt-004) |
| LT-003 | Analyzer produces report | Run `cd .opencode/skill/system-spec-kit/scripts && npx tsx observability/smart-router-analyze.ts` against the JSONL | Timestamped markdown report emitted with compliance distribution + over/under-load rates + ON_DEMAND trigger rate | [Root playbook §16](#16--live-session-telemetry-lt-001lt-004) |
| LT-004 | Empty-state handling | Run analyzer with no JSONL content | Report says "no data yet; run live-session wrapper first" without failing | [Root playbook §16](#16--live-session-telemetry-lt-001lt-004) |

---

## 17. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `.opencode/skill/skill-advisor/scripts/skill_advisor_regression.py` | Suite metrics, gates, and failures list | RS-001, RS-002, RS-003 |
| `.opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Stable routing, graph, and abstain fixtures | RA-001, RA-005, GB-001, GB-002, RS-001..RS-004 |
| `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py` | Schema validation, warning emission, compiled graph generation, size reporting | CP-001, CP-002, CP-003, CP-004, GB-007 |
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py --health` | Runtime graph diagnostics and cache reporting | CP-005 |
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts` | SQLite schema, hash-aware indexing, and scan summaries | SG-001, SG-003 |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/{scan,query,status,validate}.ts` | Live MCP skill graph scans, queries, health, and validation | SG-001, SG-002, SG-003 |
| `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | Startup scan and watcher-driven auto-reindex behavior | SG-001, SG-003 |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts` | Runtime transport parity for Claude, Gemini, Copilot, Codex, and the OpenCode plugin | HR-001, HR-002, PP-002 |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-privacy.vitest.ts` | Prompt privacy constraints across hook surfaces | HR-006 |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/*.vitest.ts` | Native shim, plugin bridge, daemon-probe, and redirect metadata compat coverage | NC-001..NC-005 |

---

## 18. FEATURE CATALOG CROSS-REFERENCE INDEX

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
| SG-001 | SQLite startup scan | SQLite Graph | [SG-001](05--sqlite-graph/001-sqlite-startup-scan.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| SG-002 | MCP query tools | SQLite Graph | [SG-002](05--sqlite-graph/002-mcp-query-tools.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| SG-003 | Auto reindex | SQLite Graph | [SG-003](05--sqlite-graph/003-auto-reindex.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| SG-004 | JSON fallback | SQLite Graph | [SG-004](05--sqlite-graph/004-json-fallback.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| HR-001 | Runtime registration check | Hook Routing | [HR-001](06--hook-routing/001-hook-routing-smoke.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| HR-002 | Work-intent prompt emits brief | Hook Routing | [HR-002](06--hook-routing/001-hook-routing-smoke.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| HR-003 | Help prompt suppresses brief | Hook Routing | [HR-003](06--hook-routing/001-hook-routing-smoke.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| HR-004 | Disable flag bypass | Hook Routing | [HR-004](06--hook-routing/001-hook-routing-smoke.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| HR-005 | Stale graph still emits stale badge | Hook Routing | [HR-005](06--hook-routing/001-hook-routing-smoke.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| HR-006 | Diagnostic privacy spot-check | Hook Routing | [HR-006](06--hook-routing/001-hook-routing-smoke.md) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| PP-001 | Plugin loads on session start | Plugin Path | [Root playbook §13](#13--plugin-path-pp-001pp-005) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| PP-002 | Plugin emits brief on user prompt | Plugin Path | [Root playbook §13](#13--plugin-path-pp-001pp-005) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| PP-003 | Status tool prompt-safety | Plugin Path | [Root playbook §13](#13--plugin-path-pp-001pp-005) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| PP-004 | Env opt-out | Plugin Path | [Root playbook §13](#13--plugin-path-pp-001pp-005) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| PP-005 | Config opt-out | Plugin Path | [Root playbook §13](#13--plugin-path-pp-001pp-005) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| MR-001 | Full 200-prompt corpus run | Measurement Run | [Root playbook §14](#14--measurement-run-mr-001mr-003) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| MR-002 | Advisor accuracy baseline | Measurement Run | [Root playbook §14](#14--measurement-run-mr-001mr-003) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| MR-003 | UNKNOWN-fallback rate | Measurement Run | [Root playbook §14](#14--measurement-run-mr-001mr-003) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| LT-001 | Wrapper registration per runtime | Live-Session Telemetry | [Root playbook §15](#15--live-session-telemetry-lt-001lt-004) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| LT-002 | Read-tool telemetry accumulates | Live-Session Telemetry | [Root playbook §15](#15--live-session-telemetry-lt-001lt-004) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| LT-003 | Analyzer produces report | Live-Session Telemetry | [Root playbook §15](#15--live-session-telemetry-lt-001lt-004) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
| LT-004 | Empty-state handling | Live-Session Telemetry | [Root playbook §15](#15--live-session-telemetry-lt-001lt-004) | [Root feature catalog](../feature_catalog/feature_catalog.md) |
