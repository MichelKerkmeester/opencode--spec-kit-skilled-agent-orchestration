---
title: "Query Library: Query Plan Telemetry"
description: "Builds telemetry-only query plans that explain intent, complexity, authority and channel choices."
trigger_phrases:
  - "query plan telemetry"
  - "query intelligence plan"
---

# Query Library: Query Plan Telemetry

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. ENTRYPOINTS](#4--entrypoints)
- [5. BOUNDARIES](#5--boundaries)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

## 1. OVERVIEW

This folder contains query-plan builders for explaining how query intelligence surfaces interpreted a request. Plans describe intent, complexity, artifact class, authority need, selected channels, skipped channels and fallback policy.

## 2. DIRECTORY TREE

```text
query/
+-- query-plan.ts  # Telemetry-only query plan builders and types
`-- README.md      # Folder orientation
```

## 3. KEY FILES

| File | Role |
|---|---|
| `query-plan.ts` | Creates and merges query-plan objects without making routing decisions. |

## 4. ENTRYPOINTS

- `buildComplexityQueryPlan(input)` records complexity classification evidence.
- `buildIntentQueryPlan(input)` records normalized intent and authority need.
- `buildRoutingQueryPlan(input)` records channel selection and fallback policy.
- `mergeQueryPlans(...plans)` combines telemetry from multiple query surfaces.

## 5. BOUNDARIES

- Builders in this folder must remain telemetry-only.
- Routing decisions belong to callers that already selected channels.
- Query plans should explain behavior without mutating memory, graph or index state.

## 6. VALIDATION

Run from the repository root:

```bash
npm test -- --runInBand
```

## 7. RELATED

- `../memory/`
- `../routing/`
- `../complexity/`
