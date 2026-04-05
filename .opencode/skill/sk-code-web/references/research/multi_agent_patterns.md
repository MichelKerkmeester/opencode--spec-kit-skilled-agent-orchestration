---
title: Multi-Agent Research Patterns
description: 10-agent specialization model for comprehensive codebase analysis and performance audits.
---

# Multi-Agent Research Patterns

10-agent specialization model for comprehensive codebase analysis and performance audits.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

For complex codebase analysis, parallel agent execution provides comprehensive coverage that would take significantly longer with sequential investigation. This document describes the 10-agent specialization model proven effective in performance optimization research.

### Key Benefits

- **Comprehensive coverage** - No blind spots from specialized focus areas
- **Parallel execution** - Faster than sequential investigation
- **Cross-cutting insights** - Synthesis reveals patterns single agents miss

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:when-to-use-multi-agent-research -->
## 2. WHEN TO USE MULTI-AGENT RESEARCH

### Good Candidates

- Performance audits (many interacting factors)
- Architecture reviews (cross-cutting concerns)
- Security audits (multiple attack vectors)
- Migration planning (comprehensive inventory)
- Unfamiliar large codebases

### Not Recommended

- Simple bug fixes
- Single-file changes
- Clear, isolated tasks
- Time-critical hotfixes

---

<!-- /ANCHOR:when-to-use-multi-agent-research -->
<!-- ANCHOR:the-10-agent-specialization-model -->
## 3. THE 10-AGENT SPECIALIZATION MODEL

### Agent Assignments

| Agent | Focus Area | Key Questions |
|-------|------------|---------------|
| 1 | HTML Loading Strategy | Script order? Critical path? Blocking resources? |
| 2 | JavaScript Bundle Inventory | File count? Total size? Dependencies? |
| 3 | Third-Party Scripts | External resources? Impact? Necessity? |
| 4 | CSS Performance | File sizes? Critical CSS? Unused styles? |
| 5 | LCP/Images Analysis | LCP element? Image optimization? Lazy loading? |
| 6 | Above-Fold Resources | Critical resources? Render blocking? |
| 7 | Animation Performance | Library usage? GPU layers? Repaints? |
| 8 | Initialization Patterns | Event handlers? Polling? Race conditions? |
| 9 | External Libraries | Usage vs size? Tree-shaking potential? |
| 10 | Network Waterfall | Request timing? Blocking chains? Priorities? |

---

<!-- /ANCHOR:the-10-agent-specialization-model -->
<!-- ANCHOR:agent-focus-details -->
## 4. AGENT FOCUS DETAILS

### Agent 1: HTML Loading Strategy

- Analyze script loading order in HTML
- Identify render-blocking resources
- Map the critical rendering path
- Check for proper defer/async usage

### Agent 2: JavaScript Bundle Inventory

- Count and size all JS files
- Map dependencies between files
- Identify bundling opportunities
- Calculate total payload

### Agent 3: Third-Party Scripts

- Inventory external scripts (CDNs, analytics, etc.)
- Measure performance impact
- Identify unnecessary scripts
- Check loading strategies

### Agent 4: CSS Performance

- Count and size all CSS files
- Identify critical CSS candidates
- Find unused styles
- Check for duplicates

### Agent 5: LCP/Images Analysis

- Identify LCP element
- Check image optimization
- Verify lazy loading implementation
- Find missing dimensions

### Agent 6: Above-Fold Resources

- Map resources needed for initial render
- Identify critical vs non-critical
- Check preload usage
- Find optimization opportunities

### Agent 7: Animation Performance

- Inventory animation libraries
- Check for GPU-accelerated properties
- Identify forced reflows
- Find CSS animation alternatives

### Agent 8: Initialization Patterns

- Count event handlers (DOMContentLoaded, load)
- Identify polling patterns
- Find race conditions
- Check initialization order

### Agent 9: External Libraries

- Compare usage vs bundle size
- Identify tree-shaking opportunities
- Find lighter alternatives
- Check version currency

### Agent 10: Network Waterfall

- Analyze request timing
- Identify blocking chains
- Check resource priorities
- Find parallelization opportunities

---

<!-- /ANCHOR:agent-focus-details -->
<!-- ANCHOR:coordination-pattern -->
## 5. COORDINATION PATTERN

### Dispatch Phase

```
1. Define the research question/goal
2. Dispatch all 10 agents in parallel
3. Each agent works independently
4. Set reasonable timeout (10-15 minutes)
```

### Synthesis Phase

```
1. Collect all agent outputs
2. Identify cross-cutting findings
3. Resolve any contradictions
4. Prioritize findings by impact
5. Create unified report
```

### Output Template

Each agent should return:

```markdown
## Agent N: [Focus Area]

### Key Findings
1. Finding with evidence
2. Finding with evidence

### Metrics
- Relevant numbers/measurements

### Recommendations
- Actionable items

### Files Analyzed
- List of files examined
```

---

<!-- /ANCHOR:coordination-pattern -->
<!-- ANCHOR:example-performance-optimization -->
## 6. EXAMPLE: PERFORMANCE OPTIMIZATION

From example.com (024-performance-optimization):

**Root Cause Identified:** Page hidden until hero JS completes
**Discovery Agent:** Agent 5 (LCP/Images)
**Supporting Evidence:** Agents 1, 6, 8

**Finding Chain:**
1. Agent 5 found LCP was 20.2s (video element)
2. Agent 1 found page uses `.page-ready` class for visibility
3. Agent 6 found hero animation must complete before reveal
4. Agent 8 found Motion.dev polling + HLS loading delays

**Solution:** 3-second safety timeout to force page visibility

---

<!-- /ANCHOR:example-performance-optimization -->
<!-- ANCHOR:scaling-considerations -->
## 7. SCALING CONSIDERATIONS

| Agents | Use Case | Trade-off |
|--------|----------|-----------|
| 3-5 | Focused analysis | Faster, less comprehensive |
| 10 | Full audit | Comprehensive, higher token usage |
| 10+ | Enterprise | Diminishing returns, coordination overhead |

---

<!-- /ANCHOR:scaling-considerations -->
<!-- ANCHOR:model-selection -->
## 8. MODEL SELECTION

| Agent Type | Recommended Model | Reason |
|------------|-------------------|--------|
| Analysis agents | Opus | Deep reasoning needed |
| Synthesis | Opus | Cross-referencing findings |
| Simple inventory | Sonnet | Faster, sufficient for listing |

---

<!-- /ANCHOR:model-selection -->
<!-- ANCHOR:related-resources -->
## 9. RELATED RESOURCES

### Internal References

- [../performance/cwv_remediation.md](../performance/cwv_remediation.md) - Core Web Vitals optimization patterns
- [../verification/performance_checklist.md](../verification/performance_checklist.md) - Verification protocol

### External Documentation

- [Anthropic Multi-Agent Patterns](https://docs.anthropic.com/) - Best practices for agent coordination
<!-- /ANCHOR:related-resources -->
