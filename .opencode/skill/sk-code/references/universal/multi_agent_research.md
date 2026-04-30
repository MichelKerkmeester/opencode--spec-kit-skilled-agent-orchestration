---
title: Multi-Agent Research Patterns
description: 10-agent specialization model for comprehensive codebase analysis and performance audits.
---

# Multi-Agent Research Patterns

Parallel-agent specialization model for comprehensive codebase analysis when sequential investigation would be too slow or miss cross-cutting patterns.

---

## 1. OVERVIEW

### Purpose

Codifies a 10-agent specialization model proven effective in performance optimization research. Parallel agent execution provides comprehensive coverage of complex codebases that would take significantly longer with sequential investigation, and surfaces cross-cutting patterns that single agents miss.

### Core Principle

Comprehensive coverage through specialization + parallel execution + synthesis pass = findings that single-threaded investigation would miss.

### When to Use

**Good candidates:**

- Performance audits (many interacting factors).
- Architecture reviews (cross-cutting concerns).
- Security audits (multiple attack vectors).
- Migration planning (comprehensive inventory).
- Unfamiliar large codebases.

**Not recommended:**

- Simple bug fixes.
- Single-file changes.
- Clear, isolated tasks.
- Time-critical hotfixes.

### Key Sources

- Phase 0 (Research) entry point in the sk-code lifecycle: `references/router/phase_lifecycle.md`.
- Per-stack performance refs under `references/{webflow,nextjs,go}/performance/` (when available).

---

## 2. THE 10-AGENT SPECIALIZATION MODEL

### Agent assignments

| Agent | Focus area                  | Key questions                                              |
| ----- | --------------------------- | ---------------------------------------------------------- |
| 1     | HTML Loading Strategy       | Script order? Critical path? Blocking resources?           |
| 2     | JavaScript Bundle Inventory | File count? Total size? Dependencies?                      |
| 3     | Third-Party Scripts         | External resources? Impact? Necessity?                     |
| 4     | CSS Performance             | File sizes? Critical CSS? Unused styles?                   |
| 5     | LCP / Images Analysis       | LCP element? Image optimization? Lazy loading?             |
| 6     | Above-Fold Resources        | Critical resources? Render blocking?                       |
| 7     | Animation Performance       | Library usage? GPU layers? Repaints?                       |
| 8     | Initialization Patterns     | Event handlers? Polling? Race conditions?                  |
| 9     | External Libraries          | Usage vs size? Tree-shaking potential?                     |
| 10    | Network Waterfall           | Request timing? Blocking chains? Priorities?               |

---

## 3. AGENT FOCUS DETAILS

### Agent 1: HTML Loading Strategy

- Analyze script loading order in HTML.
- Identify render-blocking resources.
- Map the critical rendering path.
- Check for proper defer / async usage.

### Agent 2: JavaScript Bundle Inventory

- Count and size all JS files.
- Map dependencies between files.
- Identify bundling opportunities.
- Calculate total payload.

### Agent 3: Third-Party Scripts

- Inventory external scripts (CDNs, analytics, etc.).
- Measure performance impact.
- Identify unnecessary scripts.
- Check loading strategies.

### Agent 4: CSS Performance

- Count and size all CSS files.
- Identify critical CSS candidates.
- Find unused styles.
- Check for duplicates.

### Agent 5: LCP / Images Analysis

- Identify the LCP element.
- Check image optimization.
- Verify lazy loading implementation.
- Find missing dimensions.

### Agent 6: Above-Fold Resources

- Map resources needed for initial render.
- Identify critical vs non-critical.
- Check preload usage.
- Find optimization opportunities.

### Agent 7: Animation Performance

- Inventory animation libraries.
- Check for GPU-accelerated properties.
- Identify forced reflows.
- Find CSS animation alternatives.

### Agent 8: Initialization Patterns

- Count event handlers (`DOMContentLoaded`, `load`).
- Identify polling patterns.
- Find race conditions.
- Check initialization order.

### Agent 9: External Libraries

- Compare usage vs bundle size.
- Identify tree-shaking opportunities.
- Find lighter alternatives.
- Check version currency.

### Agent 10: Network Waterfall

- Analyze request timing.
- Identify blocking chains.
- Check resource priorities.
- Find parallelization opportunities.

---

## 4. COORDINATION PATTERN

### Dispatch phase

1. Define the research question / goal.
2. Dispatch all 10 agents in parallel.
3. Each agent works independently.
4. Set a reasonable timeout (10-15 minutes).

### Synthesis phase

1. Collect all agent outputs.
2. Identify cross-cutting findings.
3. Resolve any contradictions.
4. Prioritize findings by impact.
5. Create a unified report.

### Output template

Each agent should return a section with these subsections: Key Findings (with evidence), Metrics (numbers / measurements), Recommendations (actionable items), Files Analyzed (list of files examined).

---

## 5. EXAMPLE — PERFORMANCE OPTIMIZATION

A WEBFLOW project's performance audit illustrates how cross-cutting findings emerge from agent synthesis.

**Root cause identified:** Page hidden until hero JS completes.
**Discovery agent:** Agent 5 (LCP / Images).
**Supporting evidence:** Agents 1, 6, 8.

**Finding chain:**

1. Agent 5 found LCP was 20.2s (video element).
2. Agent 1 found the page uses a `.page-ready` class for visibility.
3. Agent 6 found the hero animation must complete before reveal.
4. Agent 8 found motion polling plus HLS loading delays.

**Solution:** 3-second safety timeout to force page visibility.

The cross-cutting nature of the finding — visibility gating tied to LCP, animation, and init timing — is exactly the pattern parallel agents surface that a single-threaded investigation typically misses.

---

## 6. SCALING CONSIDERATIONS

| Agents | Use case          | Trade-off                                  |
| ------ | ----------------- | ------------------------------------------ |
| 3-5    | Focused analysis  | Faster, less comprehensive                 |
| 10     | Full audit        | Comprehensive, higher token usage          |
| 10+    | Enterprise        | Diminishing returns, coordination overhead |

---

## 7. MODEL SELECTION

| Agent type        | Recommended model | Reason                                |
| ----------------- | ----------------- | ------------------------------------- |
| Analysis agents   | Opus              | Deep reasoning required               |
| Synthesis         | Opus              | Cross-referencing findings            |
| Simple inventory  | Sonnet            | Faster, sufficient for listing tasks  |

---

## 8. RELATED RESOURCES

- `references/router/phase_lifecycle.md` - Phase 0 Research position in the sk-code lifecycle.
- `references/universal/code_quality_standards.md` - severity tiers for findings reported by agents.
- `references/universal/error_recovery.md` - decision tree when agent investigation hits a dead end.
- `references/webflow/performance/cwv_remediation.md` and `references/webflow/performance/resource_loading.md` - per-stack performance refs (mirror these when populating NEXTJS / GO performance).
