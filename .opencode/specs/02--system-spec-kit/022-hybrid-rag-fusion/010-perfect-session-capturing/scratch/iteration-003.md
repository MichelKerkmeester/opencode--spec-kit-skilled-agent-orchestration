---
title: "Deep Research v2 — Iteration 003"
focus: "Q3+Q4+Q5+Q6+Q10+Q11: P2 batch remediation, live proof, template warnings, quality distribution"
newInfoRatio: 0.58
timestamp: "2026-03-20T12:00:00Z"
---

# Iteration 003

## Q3: P2 Batch Remediation (A1 — ANSWERED)
6 root-cause groups identified from the 30 P2 items:
- G1: Heuristic parsing without canonical contracts (11/30)
- G2: Duplicate logic / drift between modules (7/30)
- G3: Type-contract erosion / broad casts (6/30)
- G4: Dedup semantics under-specified (3/30)
- G5: Micro-performance anti-patterns (2/30)
- G6: Low-impact polish (1/30)

**Re-prioritizations recommended:**
- Upgrade to P1: timestamp normalization, tool matching, relevance-filter misses, dedup correctness
- Downgrade to P3: regex micro-opts, sequential I/O, blocker false positives

## Q4: Live Proof Coverage Matrix (A2 — ANSWERED)
**0/16 post-contract cells filled.** Pre-contract proof (2026-03-17) exists but is pre-018/019.
Coverage matrix: 4 CLIs x 4 modes = 16 cells, all empty for post-contract proof.
MVP: 8 artifacts (4 CLIs x 2 critical modes: direct + stateless).

## Q5: Live Proof Date Analysis (A3 — ANSWERED)
**Verdict: PROVES_OLD_CONTRACT.** Proof captured 2026-03-17; phases 018/019 created 2026-03-18.
Proof does not reference dispositions, source capabilities, or structured preference.
5 additional proof types needed for current contract.
