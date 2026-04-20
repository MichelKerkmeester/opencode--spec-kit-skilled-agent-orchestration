---
title: "Phase 027 — Plan"
description: "Research-first plan: 40-iter deep-research converges, then follow-on implementation sub-packets per roadmap."
importance_tier: "high"
contextType: "research"
---

# Plan: Phase 027

## Phase Sequence

```
Phase 027 (this packet, research)
  |
  +-- r01 research: 40-iter cli-codex deep-research (converges)
  |     |
  |     +-- produces: research.md, research-registry.json, 40 iteration files
  |
  +-- Post-research scaffolding: 027/001, 027/002, ... (per roadmap in research.md)
  |
  +-- Each sub-packet: own impl + review + remediation cycle
```

## Research Phase (this)

- Driver: `/tmp/run-deep-research-027.sh`
- Executor: cli-codex gpt-5.4 high fast
- Iterations: 40 (31 question iters + 4 cross-track + 5 synthesis intermediates)
- Synthesis: 1 final cli-codex pass produces research.md + research-registry.json
- Wall time: ~2-3 hours (40 × 2-3min/iter + synthesis)

## Post-Research Phase (future)

Will be scaffolded as sub-packets after r01 converges:
- 027/001: scope TBD by research roadmap
- 027/002+: additional sub-packets per research

## Verification

- All 31 sub-questions answered with adopt/prototype/reject verdict + evidence
- research.md sk-doc DQI ≥ 85
- research-registry.json validates as JSON + covers all 31 questions
- 40 iteration files present with correct structure
