# Iteration 029 — Redesign the End-to-End Feature Journey

Date: 2026-04-10

## Research question
How much friction does a normal "add a feature" journey accumulate in `system-spec-kit`, and does Relay suggest a better end-to-end operator path?

## Hypothesis
Public's current journey optimizes for control and auditability but asks the operator to traverse too many explicit stages for common work.

## Method
Walked the documented Public feature flow across Gate 3, `plan`, `implement`, `complete`, `resume`, `handover`, and save-context steps, then compared it with Relay's point-person and workflow-runner model.

## Evidence
- The root quick reference still teaches file modification as `Gate 3 -> Gate 1 -> Gate 2 -> Load memory context -> Execute`. [SOURCE: AGENTS.md:132-149]
- `plan` is a 7-step workflow that produces planning artifacts and tells the operator to continue with `/spec_kit:implement`. [SOURCE: .opencode/command/spec_kit/plan.md:173-221]
- `implement` is a 9-step workflow that includes preflight, postflight, save-context, and optional handover checks. [SOURCE: .opencode/command/spec_kit/implement.md:173-225]
- `complete` is a 14-step end-to-end workflow that still includes separate planning, implementation, save-context, and handover phases. [SOURCE: .opencode/command/spec_kit/complete.md:175-228] [SOURCE: .opencode/command/spec_kit/complete.md:311-315]
- `resume` then teaches another recovery path with its own session-detection, context-sufficiency, and command-chain logic. [SOURCE: .opencode/command/spec_kit/resume.md:248-310] [SOURCE: .opencode/command/spec_kit/resume.md:404-423]
- Relay's workflow docs pitch a much shorter flow: the app or lead agent handles the user conversation, Relay escalation invokes `runWorkflow()`, and the workflow runner handles retries, verification, and handoffs. [SOURCE: external/packages/sdk/src/workflows/README.md:70-121]
- Relay's plugin presents the same idea at the operator layer through `/relay-team`, `/relay-fanout`, `/relay-pipeline`, or natural language. [SOURCE: external/docs/plugin-claude-code.md:27-63]

## Analysis
Public currently makes almost every internal lifecycle concern explicit: documentation gating, planning, implementation, learning capture, context save, and handover. That is excellent for auditability but heavy for common feature work. Relay suggests a better experience model: one lead path for the user, with escalation into workflow machinery only when the task actually requires it.

## Conclusion
confidence: high
finding: Public should redesign the end-to-end journey around a smaller "lead mode plus escalation" experience, so the user can start with one intent and let the system choose whether planning, implementation, deep research, or recovery stages need to surface.

## Adoption recommendation for system-spec-kit
- **Target file or module:** top-level workflow docs and command wrappers around `plan`, `implement`, `complete`, `resume`, `handover`
- **Change type:** end-to-end UX redesign
- **Blast radius:** very high
- **Prerequisites:** decide which lifecycle stages become internal defaults versus explicit user checkpoints
- **Priority:** should-have (prototype later)

## UX / System Design Analysis

- **Current system-spec-kit surface:** A normal feature can touch gate selection, spec creation, planning, implementation, verification, save-context, resume, and handover as distinct documented steps.
- **External repo's equivalent surface:** Relay keeps the user in a lead-agent or workflow-runner path and escalates into specialized execution shapes only when needed.
- **Friction comparison:** Public creates more file artifacts and asks more lifecycle questions before and after execution. Relay reduces cognitive load by keeping the front door centered on the task, not the lifecycle map.
- **What system-spec-kit could DELETE to improve UX:** Delete the expectation that every common feature journey must be taught as a chain of separate named command stages.
- **What system-spec-kit should ADD for better UX:** Add one lead-mode journey that can internally invoke plan, implement, review, save, or resume logic as needed.
- **Net recommendation:** REDESIGN

## Counter-evidence sought
Looked for a concise Public feature path already abstracting this ladder away; the current docs still foreground the multi-command workflow chain and stage breakdowns.

## Follow-up questions for next iteration
- Which checkpoints truly need explicit user approval in normal feature work?
- Can evidence capture and save-context happen automatically unless the user asks to inspect them?
- Where should the system intentionally pause rather than silently continue?
