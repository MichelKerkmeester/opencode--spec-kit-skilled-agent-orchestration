---
title: "006-doctor-debug-overlay: Add Compact Diagnostics"
description: "Defines a compact doctor/debug overlay that summarizes existing health, validation, and routing evidence without creating a new repair authority."
---

# 006-doctor-debug-overlay: Add Compact Diagnostics

## 1. Scope
This sub-phase scopes a compact diagnostics surface for operators and agents. It covers summarized health hints, repair posture, dry-run/preflight surfacing, and routing-oriented debug output. It does not create a second repair tool or automated rebuild authority.

## 2. Research Sources
- `001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-040.md:13-18`
- `001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-039.md:23-29`
- `001-research-hybrid-rag-fusion-systems/005-mempalace/research/iterations/iteration-040.md:40-46`

## 3. Architecture Constraints
The overlay must stay subordinate to `memory_health`, `memory_save`, and existing routing state. It can summarize, redact, and guide, but it cannot become an uncontrolled auto-repair lane, raw-content log, or a new maintenance authority.

## 4. Success Criteria
- The phase identifies a compact diagnostics surface over current health and save evidence.
- The phase names real handler files that already expose the underlying signals.
- The phase keeps observability bounded, metadata-first, and fail-open.

## 5. Out of Scope
- Full rebuild automation as the main product surface.
- Raw content logging.
- A new independent repair authority outside current health/save handlers.
