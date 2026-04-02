# Phase 026: Startup Context Injection Debug — Hook Runtime + Sibling Handoff

Fix startup priming for hook-capable runtimes (Claude Code + Gemini CLI) by injecting a compact structural brief and last-session continuity at startup.

## Problem

`handleStartup()` in both Claude and Gemini hooks emitted only a static tool listing, which left fresh sessions without structural context. Hookless runtime bootstrap contract work belongs to Phase 027 and should stay separate from this startup-injection phase.

## Solution

Shared `buildStartupBrief()` reads code graph DB + hook state directly (no MCP round-trip) and is wired into Claude/Gemini startup hooks. Packet ownership is explicitly split so hookless structural bootstrap contract work stays in `027-opencode-structural-priming`.

## Files

| File | Purpose |
|------|---------|
| `spec.md` | Problem, requirements, cross-runtime gap analysis |
| `plan.md` | Architecture, shared function + transport adapters |
| `tasks.md` | 15 tasks across 5 phases |
| `checklist.md` | L2 verification (P0/P1/P2) |
| `implementation-summary.md` | Delivered implementation + verification evidence |
| `review/` | 10-iteration deep-review artifacts and verdict |
