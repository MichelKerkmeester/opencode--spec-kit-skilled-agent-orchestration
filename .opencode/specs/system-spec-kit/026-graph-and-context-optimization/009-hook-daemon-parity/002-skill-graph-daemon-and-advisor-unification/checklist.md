---
title: "Phase 027 — Checklist"
description: "Acceptance verification for research convergence."
importance_tier: "high"
contextType: "research"
---

# Phase 027 Checklist

## Research Convergence (r01)

- [ ] 40 iteration files in `research/iterations/`
- [ ] Each iteration file has required sections: Question / Evidence / Analysis / Verdict / Dependencies / Follow-ups / Metrics
- [ ] Each of 31 sub-questions (A1-A8, B1-B7, C1-C8, D1-D8) has a verdict
- [ ] 4 cross-track coherence iters (iters 32-35) completed
- [ ] 5 synthesis-intermediate iters (iters 36-40) completed
- [ ] `research/research.md` exists + sk-doc DQI ≥ 85
- [ ] `research/research-registry.json` exists + JSON valid + all 31 questions covered
- [ ] `research/deep-research-state.jsonl` has `completed` event

## Research Output Quality

- [ ] Architectural sketch (R2) shows unified A+B+C+D data flow
- [ ] Implementation roadmap (R3) has ≥3 sub-packets with deps + effort
- [ ] Risk register (R4) has ≥5 risks + mitigations
- [ ] Measurement plan (R5) has metrics + targets + test harness
- [ ] All verdicts cite ≥2 evidence sources (file:line or external refs)

## Scope Discipline

- [ ] No code changes in research phase
- [ ] No reopening of Phase 020-026 architecture
- [ ] No work on out-of-scope items (cross-repo skill, LLM-as-matcher)
