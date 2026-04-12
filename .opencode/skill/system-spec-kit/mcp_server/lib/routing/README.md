---
title: "Routing"
description: "Content-router logic for canonical continuity saves."
trigger_phrases:
  - "content router"
  - "canonical routing"
---

# Routing

## 1. OVERVIEW

`lib/routing/` contains the routing logic that decides where canonical continuity content should land.

- `content-router.ts` - classifies content into canonical save categories and targets.
- `routing-prototypes.json` - prototype examples and prompts used by the router.

The router sits between raw save input and merge execution.

## 2. RELATED

- `../merge/README.md`
- `../continuity/README.md`
