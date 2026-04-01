---
title: "Tasks: Hookless Priming Optimization [024/024]"
description: "10 tasks implementing research 106-110 recommendations."
---
# Tasks: Phase 024 — Hookless Priming Optimization

## Immediate (Items 1-3)

- [x] Item 1: Reframe @context-prime as best-effort in orchestrate.md — Evidence: orchestrate.md updated with "(best-effort — skip if user message is urgent or time-sensitive)"
- [x] Item 2: Slim @context-prime from 4 calls to session_resume() + session_health() — Evidence: context-prime.md rewritten with 2-step workflow, copied to 4 runtime dirs
- [x] Item 3: Add urgency detection — skip blocking prime for urgent first messages — Evidence: "Urgency Detection" section added to context-prime.md

## Near-Term (Items 4-6)

- [x] Item 4: Enrich buildServerInstructions() with session recovery digest — Evidence: context-server.ts buildServerInstructions() now imports getSessionSnapshot and appends recovery section
- [x] Item 5: Create shared session-snapshot.ts helper — Evidence: lib/session/session-snapshot.ts created (~95 lines) with SessionSnapshot interface and getSessionSnapshot()
- [x] Item 6: Strengthen tool descriptions with recovery affordances — Evidence: tool-schemas.ts updated for memory_context, session_health, session_resume descriptions

## Medium-Term (Items 7-9)

- [x] Item 7: Create session_bootstrap() composite tool — Evidence: handlers/session-bootstrap.ts created, registered in tool-schemas.ts, tool-input-schemas.ts, lifecycle-tools.ts, handlers/index.ts, layer-definitions.ts
- [x] Item 8: Add minimal mode to session_resume — Evidence: minimal?: boolean added to SessionResumeArgs, skips handleMemoryContext when true, schema updated
- [x] Item 9: Add bootstrap telemetry to context-metrics — Evidence: recordBootstrapEvent() added to context-metrics.ts, wired into session-resume.ts and memory-surface.ts primeSessionIfNeeded()

## Prerequisite

- [x] Item 10: Resolve Gemini hook/detection mismatch — Evidence: runtime-detection.ts now dynamically checks .gemini/settings.json for hooks/hooksConfig blocks
