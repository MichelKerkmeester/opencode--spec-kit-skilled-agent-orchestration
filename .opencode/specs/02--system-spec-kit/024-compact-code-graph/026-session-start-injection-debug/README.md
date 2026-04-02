# Phase 026: Startup Context Injection — Cross-Runtime

Fix startup priming across all 4 runtimes (Claude Code, Gemini CLI, Codex CLI, Copilot CLI) to inject code graph outline and last-session state at session start.

## Problem

`handleStartup()` in both Claude and Gemini hooks emits only a static tool listing. MCP `PrimePackage` for hookless runtimes lacks structural context. Every fresh session starts blind.

## Solution

Shared `buildStartupBrief()` function reads code graph DB + hook state directly (no MCP round-trip). Wired into hooks (Claude + Gemini) and MCP (Codex + Copilot).

## Files

| File | Purpose |
|------|---------|
| `spec.md` | Problem, requirements, cross-runtime gap analysis |
| `plan.md` | Architecture, shared function + transport adapters |
| `tasks.md` | 15 tasks across 5 phases |
| `checklist.md` | L2 verification (P0/P1/P2) |
