You are running iteration 11 of 12 in a deep-research loop on code-graph resilience.

# Iteration 11 — Self-Healing Implementation Strategy

## Goal

Iteration 7 defined the self-healing safety boundary: auto partial re-scan only for bounded soft-stale states. Iteration 11 designs the actual code path that implements this safely inside `ensureCodeGraphReady()`.

## Research Questions
- Q14A: What is the current branch structure of `ensureCodeGraphReady()` and which path handles selective reindex today?
- Q14B: How does `allowInlineIndex` / `allowInlineFullScan` gating work? Where is each consulted?
- Q14C: What is the current 10-second timeout guard around auto-index and how is it implemented?
- Q14D: What additional invariants need to be checked before triggering an auto partial re-scan? (gold-query floor, edge-drift floor, etc.)
- Q14E: How should the self-healing decision be observable to operators? (logs, status field, telemetry event?)

## Required reads
1. `research/iterations/iteration-007.md` — self-healing boundary definition
2. `assets/staleness-model.md` — fresh/soft-stale/hard-stale tiers
3. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts` — full readiness flow (especially lines 38-51, 102-187, 189-379)
4. `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts` — example of `allowInlineIndex:false` blocking (lines 245-264)
5. `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts` — what's already exposed

## What to look for
- The exact decision tree in `ensureCodeGraphReady` for stale → action mapping
- Where the gold-query floor would plug in (call site)
- Where the edge-drift signal would plug in (call site)
- What logging/telemetry the readiness path already emits
- Whether status.ts can surface a `lastSelfHealAt` field cleanly

## Outputs (MANDATORY)

### 1. Iteration markdown
Path: `research/iterations/iteration-011.md`

Required sections:
- **Summary**
- **Current Readiness Flow** (decision tree + file:line citations)
- **Proposed Self-Heal Branch** (pseudocode + invariant checklist)
- **Gold-Query Floor Plug-in** (where to call the harness, what threshold)
- **Edge-Drift Floor Plug-in** (where to compute, what threshold)
- **Observability Surface** (logs + new status field + telemetry)
- **Patch Surface** (file:line per change, minimum 5 patch points)
- **Failure-Path Coverage** (what happens when self-heal fails mid-run)
- **Files Reviewed**
- **Convergence Signals**

### 2. Delta JSON
Path: `research/deltas/iteration-011.json`. `research_questions_answered: ["Q14A".."Q14E"]`, `iteration: 11`, `focus: "self-healing implementation strategy"`.

### 3. State log append.

## Constraints
- Read-only.
- Self-heal must NEVER trigger silently on read-only impact paths (`detect_changes` blocks; do not break that contract).
- Minimum 8 distinct file:line citations.
