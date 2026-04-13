---
title: "Research: Content Routing Classification Accuracy"
status: complete
level: 3
type: research
parent: 010-continuity-research
predecessor: 001-search-fusion-tuning
branch: main
created: 2026-04-13
---

# Research: Content Routing Classification Accuracy

Investigate whether the 3-tier content router (Tier1 keyword heuristic, Tier2 prototype similarity, Tier3 LLM classification) correctly classifies saves into the 8 routing categories. No historical save data needed - uses synthetic payloads against the current router code.

## Background

The content router has 4 hardcoded thresholds and 8 categories:

**Thresholds:**
- Tier1 confidence floor: 0.70
- Tier2 similarity floor: 0.70
- Tier3 LLM floor: 0.50
- Tier2 fallback penalty: 0.15 (applied when Tier3 unavailable)

**Routing categories (8):**
`narrative_progress`, `narrative_delivery`, `decision`, `handover_state`, `research_finding`, `task_update`, `metadata_only`, `drop`

**Confidence bands:**
- silent: >= 0.90 (no logging)
- audit: 0.70-0.90 (logged for review)
- warn: 0.50-0.70 (user-visible warning)
- refuse: < 0.50 (rejected, manual review required)

**Tier3 config:**
- Model: gpt-5.4, reasoning: low, temperature: 0, timeout: 2s, max tokens: 200

## Research Questions

1. **RQ-1:** What is the classification accuracy of Tier1 hard rules alone? Which of the 7 rules fire most often, and do any produce false positives?
2. **RQ-2:** What is the Tier1->Tier2 escalation rate? What types of content trigger escalation (top1 below threshold, narrow margin, mixed signals)?
3. **RQ-3:** What are the confusion pairs between categories? (e.g., does `narrative_progress` get confused with `task_update`?)
4. **RQ-4:** Are the 0.70/0.70/0.50 thresholds optimal, or would different values reduce escalation without losing accuracy?
5. **RQ-5:** What merge modes succeed vs fail for each category? Are there categories where the default merge mode is wrong?
6. **RQ-6:** How does the `routeAs` override interact with natural classification? Does override produce better or worse outcomes?

## Key Files to Investigate

- `mcp_server/lib/routing/content-router.ts` - full router implementation, tier logic, prototype scoring
- `mcp_server/lib/routing/routing-prototypes.json` - prototype vectors for Tier2
- `mcp_server/lib/merge/anchor-merge-operation.ts` - 5 merge modes
- `mcp_server/handlers/memory-save.ts` - how router integrates with save handler
- `mcp_server/lib/validation/spec-doc-structure.ts` - CROSS_ANCHOR_CONTAMINATION rule
- `mcp_server/tests/content-router.vitest.ts` - existing test coverage

## Research Approach

1. Read the router code and extract the 7 Tier1 rules, Tier2 prototype definitions, and Tier3 prompt
2. Generate 100 synthetic save payloads across the 8 categories (using current spec-doc content as source material)
3. Trace each payload through the 3 tiers, recording: which tier decided, confidence score, category chosen
4. Build a confusion matrix
5. Test threshold sensitivity: what happens at 0.60/0.80/0.90 for each tier?
6. Analyze merge-mode outcomes for each category

No historical saves needed. Synthetic payloads can be constructed from current spec-doc content (spec.md summaries, implementation-summary progress, decision-record entries, handover notes).

## Exit Criteria

- Confusion matrix across all 8 categories
- Tier escalation rates measured
- Threshold sensitivity analysis with recommendations
- Merge-mode success/failure rates per category
- Implementation-ready threshold adjustments documented
