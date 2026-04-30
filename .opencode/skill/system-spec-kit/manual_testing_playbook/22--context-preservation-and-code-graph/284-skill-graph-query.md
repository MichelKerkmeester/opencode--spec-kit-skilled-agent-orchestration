---
title: "284 -- Skill graph query"
description: "Manual scenario for validating skill_graph_query relationship reads."
---

# 284 -- Skill graph query

## 1. OVERVIEW

Validate that `skill_graph_query` can read relationship data from the live skill
graph.

## 2. SCENARIO CONTRACT


- Objective: Confirm a bounded skill graph query returns structured results.
- Real user request: `Please validate Skill graph query against the documented validation surface and tell me whether the expected signals are present: Tool response includes query type metadata and no more than 10 result rows.`
- RCAF Prompt: `As a context-and-code-graph validation operator, validate Skill graph query against the documented validation surface. Verify Tool response includes query type metadata and no more than 10 result rows. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Execute the documented validation request against the documented validation surface, capture the response and evidence, compare it against the expected signals, and return the pass/fail verdict.
- Expected signals: Tool response includes query type metadata and no more than 10 result rows
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS when the query succeeds and result count respects `limit`.

