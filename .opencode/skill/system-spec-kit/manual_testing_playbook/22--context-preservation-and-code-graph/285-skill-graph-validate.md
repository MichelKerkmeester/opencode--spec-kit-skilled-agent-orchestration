---
title: "285 -- Skill graph validate"
description: "Manual scenario for validating skill_graph_validate diagnostics."
---

# 285 -- Skill graph validate

## 1. OVERVIEW

Validate that `skill_graph_validate` reports schema, edge, relation-weight,
symmetry, and cycle diagnostics for the live skill graph.

## 2. SCENARIO CONTRACT


- Objective: Confirm validation diagnostics are operator-readable.
- Real user request: `Please validate Skill graph validate against the documented validation surface and tell me whether the expected signals are present: Tool response reports validation categories and pass/warn/error state.`
- RCAF Prompt: `As a context-and-code-graph validation operator, validate Skill graph validate against the documented validation surface. Verify Tool response reports validation categories and pass/warn/error state. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Execute the documented validation request against the documented validation surface, capture the response and evidence, compare it against the expected signals, and return the pass/fail verdict.
- Expected signals: Tool response reports validation categories and pass/warn/error state
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS when diagnostics are present without an unhandled exception.

