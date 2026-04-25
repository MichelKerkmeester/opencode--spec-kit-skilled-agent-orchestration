# Deep Research Prompt: Content Routing Classification Accuracy

Use this prompt to launch the research via the sk-deep-research workflow.

## Invocation

```
/spec_kit:deep-research:auto "Content routing tier1/tier2/tier3 classification accuracy and threshold optimization" --max-iterations=15 --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/002-content-routing-accuracy
```

## Research Charter (for strategy.md initialization)

**Topic:** Investigate the accuracy, escalation rates, and threshold sensitivity of the 3-tier content router that classifies incoming saves into 8 routing categories and selects merge modes.

**Constraints:**
- No historical save data available (old memories deprecated). Generate synthetic payloads from current spec-doc content.
- Do NOT modify any source files. Read-only analysis only.
- Focus on classification accuracy, confusion pairs, escalation rates, and merge-mode correctness.

**Key Files (read these first):**
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts` - full 3-tier router, thresholds, confidence bands
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json` - Tier2 prototype vectors (if exists)
- `.opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts` - 5 merge modes
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` - router integration with save handler
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts` - existing test coverage
- `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts` - CROSS_ANCHOR_CONTAMINATION rule

**Research Questions (6):**
1. What is the classification accuracy of Tier1 hard rules? Which fire most often, any false positives?
2. What is the Tier1->Tier2 escalation rate? What triggers escalation?
3. What are the confusion pairs between the 8 categories?
4. Are the 0.70/0.70/0.50 thresholds optimal?
5. What merge modes succeed vs fail for each category?
6. How does the routeAs override interact with natural classification?

**Iteration Focus Suggestions:**
- Iter 1-3: Extract and document all 7 Tier1 rules, Tier2 prototypes, Tier3 prompt
- Iter 4-6: Analyze escalation logic, map decision paths, identify edge cases
- Iter 7-9: Study merge-mode selection per category, trace anchor-merge operation logic
- Iter 10-12: Analyze test coverage gaps, identify untested categories/modes
- Iter 13-15: Synthesize into threshold recommendations and confusion matrix

**Convergence Signal:** Research converges when all 6 questions have evidence-backed answers, a confusion matrix is documented, and threshold adjustment recommendations include expected accuracy impact.
