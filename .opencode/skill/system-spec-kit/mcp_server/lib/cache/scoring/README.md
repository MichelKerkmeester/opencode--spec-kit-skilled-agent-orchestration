---
title: "Cache Scoring"
description: "Compatibility folder for cache scoring imports that points callers to canonical scoring modules."
trigger_phrases:
  - "cache scoring"
  - "composite scoring re-export"
---

# Cache Scoring

This folder is a compatibility boundary. Scoring logic lives in `lib/scoring/`, not under `lib/cache/scoring/`.

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. FLOW](#3--flow)
- [4. ALLOWED DEPENDENCY DIRECTION](#4--allowed-dependency-direction)
- [5. RELATED FILES](#5--related-files)

## 1. OVERVIEW

Use this README to route maintainers away from adding cache-local scoring logic. Cache code may consume scoring decisions, but the scoring modules own ranking formulas and weights.

## 2. STRUCTURE

| Path | Role |
| --- | --- |
| `./` | Empty compatibility folder. |
| `../../scoring/` | Canonical scoring implementation. |

## 3. FLOW

```text
╭──────────────╮
│ Cache caller │
╰──────┬───────╯
       ▼
┌──────────────────────┐
│ Needs score context  │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│ Import lib/scoring/  │
└──────────┬───────────┘
           ▼
╭──────────────────────╮
│ Cache stores result  │
╰──────────────────────╯
```

## 4. ALLOWED DEPENDENCY DIRECTION

```text
╭────────────────────╮
│ cache/             │
╰─────────┬──────────╯
          ▼
┌────────────────────╮
│ scoring/           │
└────────────────────┘
```

Cache code may import from `lib/scoring/`. Scoring code should not import from cache folders, because scoring must remain deterministic and independent of cache state.

## 5. RELATED FILES

| Path | Why it matters |
| --- | --- |
| `../../scoring/composite-scoring.ts` | Main composite scoring logic. |
| `../../scoring/folder-scoring.ts` | Folder recency scoring. |
| `../../scoring/importance-tiers.ts` | Tier weights and tier metadata. |
| `../../scoring/interference-scoring.ts` | Interference penalty logic. |
