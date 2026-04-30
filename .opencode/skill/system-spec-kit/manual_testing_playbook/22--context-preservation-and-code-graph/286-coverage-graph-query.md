---
title: "286 -- Coverage graph query"
description: "Manual scenario for validating deep_loop_graph_query read paths."
---

# 286 -- Coverage graph query

## 1. OVERVIEW

Validate that `deep_loop_graph_query` reads namespaced deep-loop coverage graph
state for research or review sessions.

## 2. SCENARIO CONTRACT

- **Objective**: Confirm coverage graph read queries are structured and namespace-bound.
- **Prerequisites**: A packet with deep-loop graph records, or a controlled test namespace.
- **Prompt**: `Call deep_loop_graph_query with a known specFolder, loopType, sessionId, queryType:"coverage_gaps", and limit:10. Verify the response is structured and bounded.`
- **Expected signals**: Tool response includes coverage-gap results or a clean empty state.
- **Pass/fail criteria**: PASS when the handler returns a bounded structured response and does not cross namespaces.

