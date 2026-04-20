---
title: "027/003 — Checklist"
description: "Acceptance verification for native advisor core."
importance_tier: "high"
contextType: "implementation"
---
# 027/003 Checklist

## P0 (HARD BLOCKER)
- [ ] 5-lane fusion with initial weights 0.45/0.30/0.15/0.10/0.00 (named constants + Zod config)
- [ ] Semantic-shadow lane scored but contributes 0.00 live
- [ ] Lifecycle-normalized inputs from 027/002 consumed (Y3 prerequisite)
- [ ] Python↔TS parity harness exists; 200/200 per-prompt top-1 + pass-threshold match
- [ ] Ablation protocol callable + documents per-lane impact
- [ ] All new code under `mcp_server/skill-advisor/lib/` (NOT `mcp_server/lib/skill-advisor/`)
- [ ] 11 lib/skill-advisor/*.ts files migrated; existing 65-test baseline still green

## P1 (Required)
- [ ] Skill projection layer (project-not-copy memory fields)
- [ ] Bounded skill_edges traversal (depth + breadth caps)
- [ ] Ambiguity via top-2-within-0.05
- [ ] Attribution in brief metadata (which lanes contributed)
- [ ] Cache-hit p95 ≤50ms; uncached deterministic p95 ≤60ms

## P2 (Suggestion)
- [ ] Lane-specific tracing (debug)
- [ ] `--lane-ablation` CLI flag

## Integration / Regression
- [ ] Full vitest suite green
- [ ] 200-prompt corpus parity green
- [ ] TS build clean
- [ ] No regressions in 4-runtime hook adapters
- [ ] Advisor brief render unchanged from post-025 baseline

## Research conformance
- [ ] C1 reuses memory-MCP primitives (hybrid, causal, tier); no reinvention
- [ ] C2 project skill metadata; no memory lifecycle leakage
- [ ] C3 causal traversal over skill_edges (not memory_causal_link storage)
- [ ] C4 analytical fusion with caps + attribution + ablation
- [ ] C5 ambiguity + causal tiebreaker
- [ ] C7 200-prompt corpus frozen benchmark
- [ ] G1 initial weights 0.45/0.30/0.15/0.10/0.00
- [ ] G2 ablation protocol with corpus/holdout/parity/safety/latency slices
- [ ] G3 parity definition: exact per-prompt top-1 + pass-threshold/abstain
- [ ] G4 parity harness owned here (shared fixtures factored to _support)
- [ ] Y2 compatible with 027/001 single-writer freshness
- [ ] Y3 consumes 027/002 lifecycle-normalized inputs
