---
title: "Cognitive"
description: "Memory lifecycle, attention decay, co-activation, and pressure-aware retrieval helpers for Spec Kit Memory."
trigger_phrases:
  - "cognitive memory"
  - "FSRS decay"
  - "memory classification"
  - "working memory"
---

# Cognitive

Memory lifecycle and attention logic for Spec Kit Memory. This folder turns memory metadata, session activity, and temporal signals into bounded retrieval state.

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. FLOW](#3--flow)
- [4. ALLOWED DEPENDENCY DIRECTION](#4--allowed-dependency-direction)
- [5. KEY CONTRACTS](#5--key-contracts)
- [6. RELATED FILES](#6--related-files)

## 1. OVERVIEW

Use this folder when code needs to classify memories, decay attention, spread activation, track session working memory, or monitor context pressure. It supports retrieval decisions, but canonical recovery still starts with `/spec_kit:resume` and the continuity chain in spec documents.

## 2. STRUCTURE

| File | Role |
| --- | --- |
| `fsrs-scheduler.ts` | FSRS retrievability, stability updates, and classification-based decay. |
| `tier-classifier.ts` | HOT, WARM, COLD, DORMANT, and EVIDENCE state classification. |
| `attention-decay.ts` | Composite attention scoring and memory activation updates. |
| `prediction-error-gate.ts` | Duplicate, linked-memory, and contradiction decisions before save. |
| `co-activation.ts` | Related-memory activation spread with fan-effect dampening. |
| `working-memory.ts` | Session-scoped attention state and cleanup. |
| `temporal-contiguity.ts` | Time-window neighbors, boosted search rows, and timelines. |
| `pressure-monitor.ts` | Token pressure checks for context-window policy. |
| `rollout-policy.ts` | Feature-flag rollout helpers. |

## 3. FLOW

```text
╭──────────────╮
│ Memory input │
╰──────┬───────╯
       ▼
┌───────────────────────┐
│ Prediction error gate │
└───────────┬───────────┘
            ▼
┌───────────────────────┐
│ FSRS and tier state   │
└───────────┬───────────┘
            ▼
┌───────────────────────┐
│ Attention scoring     │
└───────────┬───────────┘
            ▼
┌───────────────────────┐
│ Working memory update │
└───────────┬───────────┘
            ▼
┌───────────────────────┐
│ Co-activation spread  │
└───────────┬───────────┘
            ▼
╭──────────────────────╮
│ Ranked memory state  │
╰──────────────────────╯
```

## 4. ALLOWED DEPENDENCY DIRECTION

```text
╭────────────────────╮
│ MCP tool handlers  │
╰─────────┬──────────╯
          ▼
┌────────────────────╮
│ Search and memory  │
│ orchestration      │
└─────────┬──────────┘
          ▼
┌────────────────────╮
│ cognitive/         │
└─────────┬──────────┘
          ▼
┌────────────────────╮
│ Storage, scoring,  │
│ config, utilities  │
└────────────────────┘
```

Allowed imports point inward to shared storage, scoring, configuration, and utilities. This folder should not import MCP tool handlers, command dispatch, or spec-document authoring workflows.

## 5. KEY CONTRACTS

| Contract | Rule |
| --- | --- |
| State classification | Use classifier thresholds rather than ad hoc state labels. |
| Score bounds | Clamp attention and activation scores to the documented range before return. |
| Save decisions | Run prediction-error checks before adding similar memory content. |
| Session state | Keep working-memory updates scoped to a session identifier. |
| Continuity | Treat cognitive scores as retrieval evidence, not the source of resume truth. |

## 6. RELATED FILES

| Path | Why it matters |
| --- | --- |
| `../search/` | Calls cognitive helpers during retrieval and ranking. |
| `../scoring/` | Provides composite scoring inputs used by attention logic. |
| `../config/memory-types.ts` | Defines memory type and half-life settings. |
| `../storage/` | Owns persistence for memory rows and related state. |
