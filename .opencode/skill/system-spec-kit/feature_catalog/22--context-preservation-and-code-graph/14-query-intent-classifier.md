---
title: "Query-intent classifier"
description: "Heuristic pre-classifier that routes queries to the optimal retrieval backend: structural (code graph), semantic (CocoIndex), or hybrid (both)."
---

# Query-intent classifier

## 1. OVERVIEW

Heuristic pre-classifier that routes queries to the optimal retrieval backend: structural (code graph), semantic (CocoIndex), or hybrid (both).

Keyword-dictionary scoring classifies queries into three intents: structural (symbol/relationship queries routed to code graph), semantic (conceptual/discovery queries routed to CocoIndex), and hybrid (mixed queries that merge results from both). Confidence scores and matched keywords are returned alongside the intent classification. Integrated into memory_context handler for automatic query-intent routing.

---

## 2. CURRENT REALITY

The classifier exposes its output through a normalized `IntentTelemetry` envelope so consumers (`memory_context`, `memory_search`) see the same shape across both classification sites. The envelope carries `taskIntent.classificationKind` and `backendRouting.classificationKind` markers identifying which heuristic produced each label (the two classification sites are the task-intent classifier and the backend-routing classifier; `classificationKind` is the third site marker for downstream telemetry that needs to disambiguate them). It also carries a stable `paraphraseGroup` token so paraphrased queries map to the same group across sessions: identical paraphrase groups receive identical routing without re-running the classifier. Confidence scores and matched keywords are still returned alongside the classification.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/code_graph/lib/query-intent-classifier.ts` | Lib | Keyword-based intent classification with confidence scoring |
| `mcp_server/handlers/memory-context.ts` | Handler | Consumer: routes queries based on classified intent |

---

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `22--context-preservation-and-code-graph/14-query-intent-classifier.md`
