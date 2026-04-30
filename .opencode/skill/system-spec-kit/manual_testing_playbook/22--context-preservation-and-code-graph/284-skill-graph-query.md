---
title: "284 -- Skill graph query"
description: "Manual scenario for validating skill_graph_query relationship reads."
---

# 284 -- Skill graph query

## 1. OVERVIEW

Validate that `skill_graph_query` can read relationship data from the live skill
graph.

## 2. SCENARIO CONTRACT

- **Objective**: Confirm a bounded skill graph query returns structured results.
- **Prerequisites**: Run `skill_graph_scan({})` if status reports stale or absent graph data.
- **Prompt**: `Call skill_graph_query({"queryType":"hub_skills","minInbound":1,"limit":10}) and verify the response is structured and bounded. Return pass/fail with evidence.`
- **Expected signals**: Tool response includes query type metadata and no more than 10 result rows.
- **Pass/fail criteria**: PASS when the query succeeds and result count respects `limit`.

