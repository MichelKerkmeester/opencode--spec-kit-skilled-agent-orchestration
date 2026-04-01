---
title: "Tasks: Memory Save Quality Pipeline [023/012]"
description: "6 tasks fixing JSON-mode memory save quality. 253 LOC across 9 files."
---
# Tasks: Phase 012 — Memory Save Quality Pipeline

## Wave 1 — Foundation

- [x] Rec 1: Wire JSON data through normalization (~64 LOC)
  - [x] 1a: Add `filesChanged?: string[]` to CollectedDataBase in session-types.ts
  - [x] 1b: Add `filesChanged`/`files_changed` to RawInputData + KNOWN_RAW_INPUT_FIELDS in input-normalizer.ts, map to FILES
  - [x] 1c: Add filesChanged validation in validateInputData()
  - [x] 1d: Call normalizeInputData() for preloaded JSON data at workflow.ts:615
  - Evidence: preloaded data now normalized — sessionSummary → userPrompts, keyDecisions → _manualDecisions

## Wave 2 — Message Synthesis

- [x] Rec 2: Build messages from JSON when transcripts are empty (~88 LOC)
  - [x] 2a: Add extractFromJsonPayload() function in conversation-extractor.ts
  - [x] 2b: Insert JSON-mode branch before primary loop (userPrompts.length === 0 && sessionSummary)
  - [x] 2c: Mark messages with User + Assistant roles (no _synthetic flag needed)
  - [x] 2d: Ensure at least 1 User-role message is created
  - [x] 2e: Guard existing fallback (line 324) with !jsonModeHandled
  - Evidence: JSON save produces User+Assistant messages from sessionSummary, keyDecisions, nextSteps

## Wave 3 — Output Quality

- [x] Rec 3: Derive title and description from sessionSummary (~23 LOC)
  - [x] 3a: Use sessionSummary as SUMMARY in collect-session-data.ts (>20 chars, capped at 500)
  - [x] 3b: Derive TITLE from sessionSummary first clause (80 chars, sentence boundary)
  - Evidence: Title reflects session content, no "Session focused on..." boilerplate

- [x] Rec 4: Fix decision rendering + key_files scoping (~10 LOC)
  - [x] 4a: Set OPTIONS[0].DESCRIPTION='' for plain-string decisions in decision-extractor.ts
  - [x] 4b: Set CONTEXT='' when no manualObj and no rationaleFromInput
  - [x] 4c: Add 'iterations' to ignoredDirs in listSpecFolderKeyFiles
  - [x] 4d: Cap filesystem enumeration at 20 files, filter research/review iterations
  - Evidence: No 4x decision repetition, key_files capped at 20

## Wave 4 — Safety & Scoring

- [x] Rec 5: Relax V8 for same-parent phase references (~58 LOC)
  - [x] 5a: Build sibling phase allowlist from parent spec child directories
  - [x] 5b: Add sibling phase names + display names to V8 allowedIds set
  - [x] 5c: Skip scattered foreign spec detection for inputMode=structured
  - [x] 5d: Accept source parameter in validateMemoryQualityContent
  - Evidence: No CONTAMINATION_GATE_ABORT for cross-phase refs within same parent

- [x] Rec 6: Add JSON-mode quality floor (~24 LOC)
  - [x] 6a: Compute JSON floor from 6 dimensions (triggers, topics, files, content, html, observations)
  - [x] 6b: Apply floor when all dimensions contribute > 0 AND >= 4/6 pass thresholds
  - [x] 6c: Floor damped by 0.85x and hard-capped at 0.70
  - [x] 6d: Contamination penalties at lines 286+ apply after floor and can override it
  - Evidence: JSON save with rich data scores >= 50/100
