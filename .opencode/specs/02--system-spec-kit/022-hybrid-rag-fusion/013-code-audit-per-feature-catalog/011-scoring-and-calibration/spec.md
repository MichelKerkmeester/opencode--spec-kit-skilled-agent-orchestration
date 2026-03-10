# Phase 011-scoring-and-calibration — Scoring and Calibration Code Audit

## Overview

Feature-centric code audit of the **Scoring and Calibration** category from the Spec Kit Memory MCP feature catalog.

## Scope

- **Feature catalog:** `feature_catalog/11--scoring-and-calibration/`
- **Features:** 17
- **Complexity:** CRITICAL
- **Agent:** G2

## Features

1. score normalization
2. cold start novelty boost
3. interference scoring
4. classification based decay
5. folder level relevance scoring
6. embedding cache
7. double intent weighting investigation
8. rrf k value sensitivity analysis
9. negative feedback confidence signal
10. auto promotion on validation
11. scoring and ranking corrections
12. stage 3 effectivescore fallback chain
13. scoring and fusion corrections
14. local gguf reranker via node llama cpp
15. tool level ttl cache
16. access driven popularity scoring
17. temporal structural coherence scoring

## Audit Criteria

1. Code correctness — logic bugs, off-by-one, null/undefined, error paths
2. Standards alignment — sk-code--opencode TypeScript checklist
3. Behavior match — code matches feature catalog "Current Reality"
4. Test coverage — tests exist and cover described behavior
5. Playbook mapping — NEW-050..065+

## Acceptance Criteria

- [ ] All 17 features audited with structured findings
- [ ] Each feature has Status (PASS/WARN/FAIL), code issues, standards violations
- [ ] Test gaps documented
- [ ] Playbook scenarios mapped or gaps noted
