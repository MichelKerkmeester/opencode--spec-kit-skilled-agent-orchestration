---
title: "286 -- Coverage graph query"
description: "Manual scenario for validating deep_loop_graph_query read paths."
---

# 286 -- Coverage graph query

## 1. OVERVIEW

Validate that `deep_loop_graph_query` reads namespaced deep-loop coverage graph
state for research or review sessions.

## 2. SCENARIO CONTRACT


- Objective: Confirm coverage graph read queries are structured and namespace-bound.
- Real user request: `Please validate Coverage graph query against the documented validation surface and tell me whether the expected signals are present: Tool response includes coverage-gap results or a clean empty state.`
- RCAF Prompt: `As a context-and-code-graph validation operator, validate Coverage graph query against the documented validation surface. Verify Tool response includes coverage-gap results or a clean empty state. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Execute the documented validation request against the documented validation surface, capture the response and evidence, compare it against the expected signals, and return the pass/fail verdict.
- Expected signals: Tool response includes coverage-gap results or a clean empty state
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS when the handler returns a bounded structured response and does not cross namespaces.

