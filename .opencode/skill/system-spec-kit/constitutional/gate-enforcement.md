---
title: "GATE ENFORCEMENT - Edge Cases & Cross-Reference"
importanceTier: constitutional
contextType: decision
triggerPhrases:
  # File modification → Gate 3 (HARD BLOCK)
  - fix
  - implement
  - create
  - modify
  - update
  - change
  - edit
  - refactor
  - write
  - add
  - remove
  - delete
  - rename
  - move
  - build
  - generate
  - configure
  - spec folder
  # Continuation (Behavioral)
  - continue
  - left off
  - continuation
  - handover
  - resume
  - where we left
  - pick up where
  - attempt
  # Compaction (Edge Case)
  - compaction
  - context lost
  - context compaction
  # Completion (Behavioral)
  - done
  - complete
  - finished
  - works
  - completed
  - all done
  # Memory Save
  - save context
  - save memory
  - memory save
---

# GATE ENFORCEMENT - Edge Cases & Cross-Reference

> Lean constitutional memory. Full gate definitions live in **AGENTS.md Section 2**.
> This file adds: compaction recovery, continuation validation, and trigger-based surfacing.

<!-- ANCHOR:gate-cross-reference -->

## Gate Cross-Reference

Full definitions: **AGENTS.md § 2 — MANDATORY GATES**

| Gate       | Type           | One-Line Summary                                          |
| ---------- | -------------- | --------------------------------------------------------- |
| **Gate 1** | SOFT           | Understanding + context surfacing on each user message    |
| **Gate 2** | REQUIRED       | Skill routing via `skill_advisor.py` or user direction    |
| **Gate 3** | **HARD BLOCK** | Spec folder A/B/C/D/E question before ANY file modification |

**Critical:** Gate 3 overrides Gates 1-2. If file modification detected → ask spec folder FIRST, analyze after.

<!-- /ANCHOR:gate-cross-reference -->

<!-- ANCHOR:continuation-validation -->

## Continuation Validation

**TRIGGER:** User message contains "CONTINUATION - Attempt" pattern.

**ACTION:**
1. Parse handoff for: Spec folder path, Last Action, Next Action
2. Validate against most recent memory file in spec folder
3. IF mismatch → Report and ask:
   - A) Trust handoff message
   - B) Trust memory file
   - C) Investigate both
4. IF validated → Proceed with "Continuation validated"

**RATIONALE:** Handoff messages may be stale or from a different branch. Always cross-check against memory.

<!-- /ANCHOR:continuation-validation -->

<!-- ANCHOR:gate-quick-reference -->

## Quick Reference

| Rule                    | Trigger                     | Source        |
| ----------------------- | --------------------------- | ------------- |
| Gates 1-3               | See above                   | AGENTS.md § 2 |
| First Message Protocol  | First msg + file mod intent | AGENTS.md § 2 |
| Memory Save Rule        | "save context/memory"       | AGENTS.md § 2 |
| Completion Verification | "done/complete/finished"    | AGENTS.md § 2 |
| Compaction Recovery     | Context loss / compaction   | **This file** |
| Continuation Validation | "CONTINUATION - Attempt"    | **This file** |

<!-- /ANCHOR:gate-quick-reference -->

*Constitutional Memory — Always surfaces at top of search results*
