---
title: Deep Research Strategy
description: Session tracking for phase 004 agent-governance-and-commands deep research.
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Track the focused questions, answered gaps, and next actions for the phase-local deep-research pass on agent governance and command drift.

### Usage

- Init and state were created directly in the phase-local `research/` packet to match the requested output directory.
- Iterations 01-10 progressively narrowed from runtime-file parity to command-surface and governance-contract drift.
- Final synthesis is published in `research.md`, with the dashboard and registry derived from the same evidence base.

## 2. TOPIC

command-surface drift, agent-definition inconsistencies across runtimes, runtime-directory gaps, and governance rule enforcement

## 3. KEY QUESTIONS (remaining)

- [x] Are runtime-specific agent references consistent with the live filesystem and each runtime's path convention?
- [x] Do command invocation docs use one stable syntax across AGENTS, skills, quick references, and command cards?
- [x] Does the deep-research packet layout contract match the live resolver and executor artifact paths?
- [x] Are distributed-governance rules enforced by the workflow, or only described in docs?
- [x] Do packet-level completion claims still match the live runtime surfaces after cleanup?

## 4. NON-GOALS

- Re-implementing or fixing the command/agent stack in this research pass.
- Re-auditing unrelated memory, hook, or code-graph packets outside evidence needed for phase 004.
- Reviewing archived historical packets except where current phase docs explicitly depend on them.

## 5. STOP CONDITIONS

- Stop after 10 iterations unless two consecutive `newInfoRatio` values fall below `0.05`.
- Stop early only if the same contract contradiction repeats with no new actionable drift.
- End with a phase-local synthesis, findings registry, and dashboard that downstream tooling can consume.

## 6. ANSWERED QUESTIONS

- Runtime-path drift is concentrated in active Codex surfaces plus stale multi-runtime READMEs (iterations 01-03).
- Command invocation and convergence docs disagree on both syntax and stop-math values (iterations 04-05).
- Deep-research packet layout is internally split between phase-local and root-level artifacts, with prompt files bypassing the root resolver (iterations 06-07).
- Distributed governance is documented broadly but not encoded as a hard workflow gate for deep-research writes (iterations 08-09).
- Phase 002 cleanup claims are ahead of the current live tree, so completion evidence should not be treated as fully current (iteration 10).

## 7. WHAT WORKED

- Reading the root packet plus both nested sub-packets first made it easier to separate intended architecture from live-tree drift (iterations 01-02).
- Cross-runtime line-by-line comparison exposed Codex-only path issues quickly because the OpenCode, Claude, and Gemini copies were clean controls (iterations 01 and 09).
- Comparing command cards, quick references, and governance docs side by side surfaced syntax and convergence disagreements that would be easy to miss in isolation (iterations 04-05).
- Inspecting the live YAML resolver and `review-research-paths.cjs` clarified that the artifact-path issue is a runtime behavior problem, not just a documentation typo (iterations 06-07).

## 8. WHAT FAILED

- CocoIndex semantic search could not be relied on in this session, so the investigation had to fall back to targeted `rg` and line-numbered reads for repo evidence.
- Packet closeout prose alone was not trustworthy for current-state conclusions; live runtime docs still needed to be re-checked after reading the implementation summary.

## 9. EXHAUSTED APPROACHES (do not retry)

### Packet-only reasoning -- BLOCKED (iteration 10, 2 attempts)

- What was tried: relying on `002-command-graph-consolidation` spec/checklist/summary claims without re-reading the current runtime files.
- Why blocked: the live tree still contains stale README and Codex path surfaces, so packet-local closeout evidence is insufficient by itself.
- Do NOT retry: completion-status judgments without checking the active runtime files.

### Cross-runtime table diffing -- PRODUCTIVE (iteration 1)

- What worked: comparing OpenCode, Claude, Gemini, and Codex agent tables for the same section.
- Prefer for: future runtime-parity investigations where only one runtime appears to be drifting.

## 10. RULED OUT DIRECTIONS

- Purely historical `@handover`/`@speckit` archive references were ruled out as primary evidence because the phase topic is about active runtime surfaces, not archived snapshots (iteration 02).
- Deep-review-specific lifecycle behavior was ruled out as the main cause of the research-path problem because the contradiction is already present inside deep-research docs, YAML, and shared path resolver code (iterations 06-07).

## 11. NEXT FOCUS

Research complete. Use the synthesis to drive fixes in this order: unify child-phase artifact routing, normalize Codex runtime path references, then collapse command syntax and convergence docs onto one authoritative surface.

## 12. KNOWN CONTEXT

- Phase root `004-agent-governance-and-commands` is a flattened parent packet whose child packets are `001-agent-execution-guardrails/` and `002-command-graph-consolidation/`.
- Phase 002 says cleanup is complete, but the current tree still needs live verification because packet closeout and active runtime surfaces can drift apart.
- The requested output directory for this pass is the child phase's local `research/` folder, not the track-root research archive.

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- `research/research.md` ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` live; `fork`, `completed-continue` deferred
- Started: 2026-04-23T21:03:42Z
