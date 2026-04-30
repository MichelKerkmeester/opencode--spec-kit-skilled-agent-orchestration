---
title: "283 -- Skill graph status"
description: "Manual scenario for validating skill_graph_status health output."
---

# 283 -- Skill graph status

## 1. OVERVIEW

Validate that `skill_graph_status` reports live skill graph totals, staleness,
families, categories, schema versions, validation, and DB status.

## 2. SCENARIO CONTRACT


- Objective: Confirm the status tool returns a non-error health payload.
- Real user request: `` Please validate Skill graph status against the documented validation surface and tell me whether the expected signals are present: Tool response includes `totalSkills`, `totalEdges`, and `dbStatus`. ``
- RCAF Prompt: `` As a context-and-code-graph validation operator, validate Skill graph status against the documented validation surface. Verify Tool response includes `totalSkills`, `totalEdges`, and `dbStatus`. Return a concise pass/fail verdict with the main reason and cited evidence. ``
- Expected execution process: Execute the documented validation request against the documented validation surface, capture the response and evidence, compare it against the expected signals, and return the pass/fail verdict.
- Expected signals: Tool response includes `totalSkills`, `totalEdges`, and `dbStatus`
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS when status fields are present and no handler error occurs.

