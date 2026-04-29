---
title: "Code Graph: Feature Catalog"
description: "Runtime-package feature inventory for the code_graph subsystem, covering read-path freshness, manual scan/status/verify, detect_changes, context retrieval, coverage graph tools, MCP registration, CCC integration, and doctor-code-graph policy."
trigger_phrases:
  - "code_graph feature catalog"
  - "code_graph runtime catalog"
  - "code graph inventory"
  - "code_graph manual testing playbook"
importance_tier: "important"
---
# Code Graph: Feature Catalog

This catalog is the runtime-package inventory for `.opencode/skill/system-spec-kit/mcp_server/code_graph/`. It mirrors the `skill_advisor/feature_catalog/` package shape while keeping the code graph reality map precise: read-path checks are half-automated, maintenance tools are manual, CCC tools are manual, and deep-loop graph automation is limited to the command-owned YAML paths documented below.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. READ-PATH FRESHNESS](#2--read-path-freshness)
- [3. MANUAL SCAN / VERIFY / STATUS](#3--manual-scan-verify-status)
- [4. DETECT-CHANGES PREFLIGHT](#4--detect-changes-preflight)
- [5. CONTEXT RETRIEVAL](#5--context-retrieval)
- [6. COVERAGE GRAPH](#6--coverage-graph)
- [7. MCP TOOL SURFACE](#7--mcp-tool-surface)
- [8. CCC INTEGRATION](#8--ccc-integration)
- [9. DOCTOR CODE GRAPH](#9--doctor-code-graph)

---

## 1. OVERVIEW

The catalog covers 17 runtime features across 8 groups. Per-feature files carry the implementation surface, trigger path, reality classification, fallback, and cross-references.

| Group | Count | Scope |
| --- | ---: | --- |
| [01--read-path-freshness](./01--read-path-freshness/) | 2 | Read-path freshness |
| [02--manual-scan-verify-status](./02--manual-scan-verify-status/) | 3 | Manual scan / verify / status |
| [03--detect-changes](./03--detect-changes/) | 1 | Detect-changes preflight |
| [04--context-retrieval](./04--context-retrieval/) | 2 | Context retrieval |
| [05--coverage-graph](./05--coverage-graph/) | 4 | Coverage graph |
| [06--mcp-tool-surface](./06--mcp-tool-surface/) | 1 | MCP tool surface |
| [07--ccc-integration](./07--ccc-integration/) | 3 | CCC integration |
| [08--doctor-code-graph](./08--doctor-code-graph/) | 1 | Doctor code graph |

Reality classification source: the current automation map classifies code graph freshness as half-auto, CCC as manual, deep-loop convergence as auto, deep-loop upsert as half, and deep-loop query/status as manual. Matrix coverage treats code graph query and scan/verify as conditional local/native validation surfaces, not fully covered external-executor cells.


---

## 2. READ-PATH FRESHNESS

| Feature | File |
| --- | --- |
| Ensure code graph ready | [01--read-path-freshness/01-ensure-code-graph-ready.md](./01--read-path-freshness/01-ensure-code-graph-ready.md) |
| Query self-heal | [01--read-path-freshness/02-query-self-heal.md](./01--read-path-freshness/02-query-self-heal.md) |

---

## 3. MANUAL SCAN / VERIFY / STATUS

| Feature | File |
| --- | --- |
| code_graph_scan | [02--manual-scan-verify-status/01-code-graph-scan.md](./02--manual-scan-verify-status/01-code-graph-scan.md) |
| code_graph_verify | [02--manual-scan-verify-status/02-code-graph-verify.md](./02--manual-scan-verify-status/02-code-graph-verify.md) |
| code_graph_status | [02--manual-scan-verify-status/03-code-graph-status.md](./02--manual-scan-verify-status/03-code-graph-status.md) |

---

## 4. DETECT-CHANGES PREFLIGHT

| Feature | File |
| --- | --- |
| detect_changes preflight | [03--detect-changes/01-detect-changes-preflight.md](./03--detect-changes/01-detect-changes-preflight.md) |

---

## 5. CONTEXT RETRIEVAL

| Feature | File |
| --- | --- |
| code_graph_context | [04--context-retrieval/01-code-graph-context.md](./04--context-retrieval/01-code-graph-context.md) |
| Context handler | [04--context-retrieval/02-context-handler.md](./04--context-retrieval/02-context-handler.md) |

---

## 6. COVERAGE GRAPH

| Feature | File |
| --- | --- |
| deep_loop_graph_query | [05--coverage-graph/01-deep-loop-graph-query.md](./05--coverage-graph/01-deep-loop-graph-query.md) |
| deep_loop_graph_status | [05--coverage-graph/02-deep-loop-graph-status.md](./05--coverage-graph/02-deep-loop-graph-status.md) |
| deep_loop_graph_upsert | [05--coverage-graph/03-deep-loop-graph-upsert.md](./05--coverage-graph/03-deep-loop-graph-upsert.md) |
| deep_loop_graph_convergence | [05--coverage-graph/04-deep-loop-graph-convergence.md](./05--coverage-graph/04-deep-loop-graph-convergence.md) |

---

## 7. MCP TOOL SURFACE

| Feature | File |
| --- | --- |
| Tool registrations | [06--mcp-tool-surface/01-tool-registrations.md](./06--mcp-tool-surface/01-tool-registrations.md) |

---

## 8. CCC INTEGRATION

| Feature | File |
| --- | --- |
| ccc_reindex | [07--ccc-integration/01-ccc-reindex.md](./07--ccc-integration/01-ccc-reindex.md) |
| ccc_feedback | [07--ccc-integration/02-ccc-feedback.md](./07--ccc-integration/02-ccc-feedback.md) |
| ccc_status | [07--ccc-integration/03-ccc-status.md](./07--ccc-integration/03-ccc-status.md) |

---

## 9. DOCTOR CODE GRAPH

| Feature | File |
| --- | --- |
| Doctor apply mode | [08--doctor-code-graph/01-doctor-apply-mode.md](./08--doctor-code-graph/01-doctor-apply-mode.md) |
