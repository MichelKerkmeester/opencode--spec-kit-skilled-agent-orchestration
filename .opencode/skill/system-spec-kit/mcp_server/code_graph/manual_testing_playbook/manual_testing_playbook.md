---
title: "Code Graph: Manual Testing Playbook"
description: "Operator validation package for the code_graph runtime catalog, covering read-path freshness, scan/status/verify, detect_changes, context retrieval, coverage graph tools, MCP dispatch, CCC integration, and doctor-code-graph policy."
trigger_phrases:
  - "code_graph manual testing playbook"
  - "code graph validation"
  - "code_graph runtime playbook"
importance_tier: "important"
---
# Code Graph: Manual Testing Playbook

This playbook validates the runtime-package code graph surface at `.opencode/skill/system-spec-kit/mcp_server/code_graph/`. The package mirrors `skill_advisor/manual_testing_playbook/`: the root file is the operator index, and numbered category folders hold deterministic scenario entries.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. GLOBAL PRECONDITIONS](#2--global-preconditions)
- [3. GLOBAL EVIDENCE REQUIREMENTS](#3--global-evidence-requirements)
- [4. COMMAND NOTATION](#4--command-notation)
- [5. REVIEW RULES](#5--review-rules)
- [6. READ-PATH FRESHNESS](#6--read-path-freshness)
- [7. MANUAL SCAN / VERIFY / STATUS](#7--manual-scan-verify-status)
- [8. DETECT CHANGES](#8--detect-changes)
- [9. CONTEXT RETRIEVAL](#9--context-retrieval)
- [10. COVERAGE GRAPH](#10--coverage-graph)
- [11. MCP TOOL SURFACE](#11--mcp-tool-surface)
- [12. CCC INTEGRATION](#12--ccc-integration)
- [13. DOCTOR CODE GRAPH](#13--doctor-code-graph)
- [14. FEATURE CATALOG CROSS-REFERENCE](#14--feature-catalog-cross-reference)

---

## 1. OVERVIEW

The playbook contains 15 scenarios across 8 groups. It targets the current reality map: read-path checks are bounded and half-auto, full scan/verify/status are operator actions, detect_changes is read-only and blocks on stale state, CCC tools are direct/manual, and coverage graph automation is limited to deep-loop command YAML.

| Group | Scenario Files |
| --- | --- |
| Read-path freshness | [01--read-path-freshness](./01--read-path-freshness/) |
| Manual scan / verify / status | [02--manual-scan-verify-status](./02--manual-scan-verify-status/) |
| Detect changes | [03--detect-changes](./03--detect-changes/) |
| Context retrieval | [04--context-retrieval](./04--context-retrieval/) |
| Coverage graph | [05--coverage-graph](./05--coverage-graph/) |
| MCP tool surface | [06--mcp-tool-surface](./06--mcp-tool-surface/) |
| CCC integration | [07--ccc-integration](./07--ccc-integration/) |
| Doctor code graph | [08--doctor-code-graph](./08--doctor-code-graph/) |

## 2. GLOBAL PRECONDITIONS

1. Working directory is the repository root.
2. Build the MCP server before handler-level checks: `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`.
3. Use disposable workspace copies for file mutation, stale graph, scan, and doctor apply scenarios.
4. Capture stdout, stderr, exit code, and MCP JSON payload excerpts.

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Scenario ID and file path.
- Exact command or MCP call used.
- JSON fields that prove readiness, action, status, or output shape.
- PASS, FAIL, or SKIP verdict with one reason.

## 4. COMMAND NOTATION

- Shell commands are fenced `bash`.
- MCP calls are shown as text, for example `code_graph_status({})`.
- Slash-command scenarios cite the command and the YAML path; run them in a disposable workspace.

## 5. REVIEW RULES

A scenario passes only when the expected fields appear and the transcript shows no hidden full scan, unrequested mutation, or missing readiness block.


---

## 6. READ-PATH FRESHNESS

| ID | Scenario | File |
| --- | --- | --- |
| 001 | ensure-ready selective reindex | [001-ensure-ready-selective-reindex.md](./01--read-path-freshness/001-ensure-ready-selective-reindex.md) |
| 002 | query self-heal stale file | [002-query-self-heal-stale-file.md](./01--read-path-freshness/002-query-self-heal-stale-file.md) |

---

## 7. MANUAL SCAN / VERIFY / STATUS

| ID | Scenario | File |
| --- | --- | --- |
| 003 | code_graph_scan incremental | [003-code-graph-scan-incremental.md](./02--manual-scan-verify-status/003-code-graph-scan-incremental.md) |
| 004 | code_graph_scan full | [004-code-graph-scan-full.md](./02--manual-scan-verify-status/004-code-graph-scan-full.md) |
| 005 | code_graph_verify blocked on stale | [005-code-graph-verify-blocked-on-stale.md](./02--manual-scan-verify-status/005-code-graph-verify-blocked-on-stale.md) |
| 006 | code_graph_status readonly | [006-code-graph-status-readonly.md](./02--manual-scan-verify-status/006-code-graph-status-readonly.md) |

---

## 8. DETECT CHANGES

| ID | Scenario | File |
| --- | --- | --- |
| 007 | detect_changes no inline index | [007-detect-changes-no-inline-index.md](./03--detect-changes/007-detect-changes-no-inline-index.md) |

---

## 9. CONTEXT RETRIEVAL

| ID | Scenario | File |
| --- | --- | --- |
| 008 | code_graph_context readiness block | [008-code-graph-context-readiness-block.md](./04--context-retrieval/008-code-graph-context-readiness-block.md) |

---

## 10. COVERAGE GRAPH

| ID | Scenario | File |
| --- | --- | --- |
| 009 | deep_loop_graph_convergence yaml fire | [009-deep-loop-graph-convergence-yaml-fire.md](./05--coverage-graph/009-deep-loop-graph-convergence-yaml-fire.md) |
| 010 | deep_loop_graph_upsert conditional | [010-deep-loop-graph-upsert-conditional.md](./05--coverage-graph/010-deep-loop-graph-upsert-conditional.md) |

---

## 11. MCP TOOL SURFACE

| ID | Scenario | File |
| --- | --- | --- |
| 011 | tool call shape validation | [011-tool-call-shape-validation.md](./06--mcp-tool-surface/011-tool-call-shape-validation.md) |

---

## 12. CCC INTEGRATION

| ID | Scenario | File |
| --- | --- | --- |
| 012 | ccc_reindex binary shell out | [012-ccc-reindex-binary-shell-out.md](./07--ccc-integration/012-ccc-reindex-binary-shell-out.md) |
| 013 | ccc_feedback jsonl append | [013-ccc-feedback-jsonl-append.md](./07--ccc-integration/013-ccc-feedback-jsonl-append.md) |
| 014 | ccc_status availability probe | [014-ccc-status-availability-probe.md](./07--ccc-integration/014-ccc-status-availability-probe.md) |

---

## 13. DOCTOR CODE GRAPH

| ID | Scenario | File |
| --- | --- | --- |
| 015 | doctor apply mode policy | [015-doctor-apply-mode-policy.md](./08--doctor-code-graph/015-doctor-apply-mode-policy.md) |


---

## 14. FEATURE CATALOG CROSS-REFERENCE

Each scenario maps to the runtime catalog at [../feature_catalog/feature_catalog.md](../feature_catalog/feature_catalog.md).

