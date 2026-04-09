# Iteration 30 — Hook lane: overlap check with packet 008

## Focus
Determine whether Graphify's PreToolUse hook pattern can belong in the new packet without duplicating the existing `008` graph-first routing-nudge scope.

## Findings

### Finding 1 — The PreToolUse nudge overlaps packet 008 and should be deferred there
Source: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify/research/research.md:76-76] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-graph-first-routing-nudge/spec.md:20-24] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-graph-first-routing-nudge/spec.md:58-67] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify/research/research.md:744-746]
What it does: Graphify proposes a Grep/Glob nudge toward structural tools, while `008` already owns advisory structural hints on startup, resume, compact, and response surfaces and the later Graphify translation explicitly says Public should layer the nudge across those surfaces instead of copying a single hook.
Why it matters for Public's Code Graph MCP: The new code-graph-upgrade packet should not claim any routing-surface or hook-surface nudge work, because `008` already owns that seam.
Evidence type: source-confirmed
Recommendation: reject or defer to packet `008`
Affected Public surface: graph-first runtime hint ownership
Risk/cost: overlap

## Recommended Next Focus
Salvage the non-overlapping user-facing breadcrumb idea from CodeSight's hot-file ranking so the new packet still improves graph-local UX without stepping into `008`.

## Metrics
- newInfoRatio: 0.53
- findingsCount: 1
- focus: "iteration 30: overlap check with packet 008"
- status: insight
