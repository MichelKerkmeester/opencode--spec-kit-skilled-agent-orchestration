---
title: "Post-task learning measurement (task_postflight)"
description: "Covers the postflight tool that computes a Learning Index by comparing post-task epistemic state against the preflight baseline."
---

# Post-task learning measurement (task_postflight)

## 1. OVERVIEW

Covers the postflight tool that computes a Learning Index by comparing post-task epistemic state against the preflight baseline.

After finishing a task, this tool takes the "after" measurement and compares it against the "before" baseline. It calculates a score that tells you how much you learned. A high score means you gained real new understanding. A low score means you mostly applied what you already knew. A negative score means you discovered that what you thought was true turned out to be wrong.

---

## 2. CURRENT REALITY

After completing implementation work, this tool captures the post-task epistemic state and computes a Learning Index by comparing against the preflight baseline. The formula weights three deltas: `LI = (KnowledgeDelta * 0.4) + (UncertaintyReduction * 0.35) + (ContextImprovement * 0.25)`.

The uncertainty delta is inverted (pre minus post) so that reduced uncertainty counts as a positive learning signal. If you started at 70% uncertainty and finished at 20%, that is a +50 uncertainty reduction contributing +17.5 to the Learning Index.

Interpretation bands give the score meaning. 40 or above signals significant learning (you understood something that changed your approach). 15-39 is moderate learning. 5-14 is incremental. 0-4 is an execution-focused session where you applied existing knowledge without gaining new understanding. Below zero indicates knowledge regression, which usually means the task revealed that prior assumptions were wrong.

You can track gaps closed during the task and new gaps discovered. Both are stored as JSON arrays alongside the scores. The phase updates from "preflight" to "complete" after postflight runs. Calling postflight without a matching preflight record throws an error.

The handler also supports re-correction runs. It accepts both "preflight" and already-"complete" records, so you can call `task_postflight` again for the same task to recompute the deltas and overwrite the stored postflight values after refining your assessment.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `mcp_server/handlers/session-learning.ts` | Session learning handler: postflight delta computation, Learning Index formula, re-correction support |
| `mcp_server/lib/learning/corrections.ts` | Learning corrections logic |
| `mcp_server/core/db-state.ts` | Database state management for `session_learning` table |
| `mcp_server/lib/response/envelope.ts` | MCP success/error envelope helpers |
| `mcp_server/schemas/tool-input-schemas.ts` | Zod input schemas for `task_postflight` arguments |
| `mcp_server/tool-schemas.ts` | MCP-visible JSON schema for `task_postflight` |
| `mcp_server/tools/lifecycle-tools.ts` | Lifecycle tool dispatcher for learning tools |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/handler-session-learning.vitest.ts` | Session learning handler validation |
| `mcp_server/tests/corrections.vitest.ts` | Learning corrections tests |

---

## 4. MANUAL PLAYBOOK COVERAGE

| Scenario | Role |
|----------|------|
| `EX-024` | Direct manual validation for postflight closeout and Learning Index persistence |

---

## 5. SOURCE METADATA

- Group: Analysis
- Source feature title: Post-task learning measurement (task_postflight)
- Current reality source: FEATURE_CATALOG.md
