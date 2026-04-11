---
title: "013-fsrs-memory-decay-study: Study FSRS Decay Defaults"
description: "Measures whether Modus-inspired FSRS default changes are justified before Public changes decay or review-queue behavior."
---

# 013-fsrs-memory-decay-study: Study FSRS Decay Defaults

## 1. Scope
This sub-phase investigates whether Public should change any FSRS-related decay defaults or multipliers after the current `memory_review` work settles. It focuses on measurement, not immediate tuning: the packet must compare today's classification-based decay against any Modus-inspired adjustments and define what evidence is required before changing defaults. It does not ship a due-state model or review queue.

## 2. Research Sources
- `001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-026.md:4111-4155`
- `001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-038.md:16-20`
- `001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-040.md:21-21`
- `001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-040.md:40-40`

## 3. Architecture Constraints
- `memory_review` remains the first required operator control surface before any due-state or queue work advances.
- Current FSRS decay is authoritative until measurements prove a better default.
- Any study must keep write-on-read opt-in and must not invent a due queue as a side effect of tuning decay.

## 4. Investigation Questions
- Are the current context-type and importance-tier stability multipliers already sufficient, or do specific memory classes under- or over-decay?
- Which baseline should a study compare: current scheduler defaults, Modus-style fact lifecycle behavior, or candidate multiplier variants?
- What judged-retrieval, review-burden, and drift metrics should block any default change?
- Should future due-state behavior store `next_review_at`, derive it at query time, or remain out of scope until `memory_review` data exists?

## 5. Success Criteria
- The packet defines baseline datasets, measurement windows, and decision metrics for FSRS decay tuning.
- The packet ties any future tuning to `memory_review` evidence rather than speculative defaults.
- The packet ends with a clear exit condition: keep current defaults, prototype a specific tuning study, or reject further change.

## 6. Out of Scope
- Shipping `memory_due`.
- Changing decay defaults in code during this packet.
- Enabling write-on-read reinforcement by default.
