# Results: Context Agent Model Comparison

**Spec**: 012-context-model-comparison
**Test Date**: 2026-02-14
**Platform**: Claude Code
**Evaluator**: Claude Opus 4.6 (automated via Task tool)

---

## Pre-Test State

- **Codebase**: Opencode Env/Public — commit: af302c4
- **Memory count**: N/A (no MCP memory tools in this codebase)
- **Agent resolution**: `@context-haiku` confirmed | `@context-sonnet` confirmed

---

## TQ-1: File Existence Check (Quick Mode)

### Execution

| | Haiku | Sonnet |
|---|---|---|
| **Execution order** | parallel | parallel |
| **Latency** | ~12s | ~20s |
| **Tool calls** | 7 | 5 |
| **Dispatches** | 0 | 0 |

### Structural Checks

| Check | Haiku | Sonnet |
|-------|-------|--------|
| S-01: Sections present | FAIL (4/6: missing Pattern Analysis, Dispatched Analyses) | PASS (6/6) |
| S-02: Output size | PASS (~250 tokens) | PASS (~350 tokens) |
| S-03: Evidence citations | PASS (file paths cited) | PASS (file paths cited) |
| S-04: Memory-first | FAIL (Glob first, no memory check) | PASS (noted "No memory check performed — quick mode") |
| S-05: Dispatch limits | PASS (0 dispatches) | PASS (0 dispatches) |
| S-06: Read-only | PASS | PASS |

### Substantive Scores

| Metric | Haiku | Sonnet |
|--------|-------|--------|
| Q-01: Pattern precision | 3/5 | 3/5 |
| Q-02: File selection | 3/5 | 4/5 |
| Q-03: Gap detection | 3/5 | 4/5 |
| Q-04: Cross-reference | 3/5 | 3/5 |
| Q-05: Recommendation | 3/5 | 3/5 |
| Q-06: Evidence density | 3/5 | 3/5 |
| **Average** | **3.00/5** | **3.33/5** |

### TQ-1 Verdict

**Verdict**: Equivalent

**Notes**: Both agents correctly identified contact.html in the Webflow export and correctly noted the absence of form CSS/SCSS and form/validate JS in project source directories. Sonnet found additional contact-related files (JSON performance data, heading guide) and had slightly more nuanced gap detection. Haiku's output missed 2 of 6 Context Package sections (S-01 FAIL) — a structural concern even though substantive quality was adequate. The 0.33-point substantive difference falls within the Equivalent threshold (<=0.5). Haiku used more tool calls (7 vs 5) due to initial node_modules noise requiring a refined search.

---

## TQ-2: Form Handling Patterns (Medium Mode)

### Execution

| | Haiku | Sonnet |
|---|---|---|
| **Execution order** | parallel | parallel |
| **Latency** | ~37s | ~52s |
| **Tool calls** | ~15 | ~12 |
| **Dispatches** | 0 | 0 |

### Structural Checks

| Check | Haiku | Sonnet |
|-------|-------|--------|
| S-01: Sections present | PASS (6/6) | PASS (6/6) |
| S-02: Output size | FAIL (well over 2K token budget) | FAIL (well over 2K token budget) |
| S-03: Evidence citations | PASS (extensive path:line citations) | PASS (precise path:line citations) |
| S-04: Memory-first | PASS (memory context referenced) | PASS (memory section present) |
| S-05: Dispatch limits | PASS (0 dispatches) | PASS (0 dispatches) |
| S-06: Read-only | PASS | PASS |

### Substantive Scores

| Metric | Haiku | Sonnet |
|--------|-------|--------|
| Q-01: Pattern precision | 5/5 | 5/5 |
| Q-02: File selection | 5/5 | 5/5 |
| Q-03: Gap detection | 4/5 | 4/5 |
| Q-04: Cross-reference | 4/5 | 5/5 |
| Q-05: Recommendation | 4/5 | 5/5 |
| Q-06: Evidence density | 5/5 | 5/5 |
| **Average** | **4.50/5** | **4.83/5** |

### TQ-2 Verdict

**Verdict**: Equivalent

**Notes**: Both agents produced exceptional form pattern analysis. Haiku discovered the 500-line form-submission-analysis.md with complete attribute inventory (Formspark, Botpoison, persistence, custom select, file upload) — an outstanding find. Sonnet found validation_patterns.js with the ContactForm class and BotpoisonProtection, plus validation_patterns.ts for TypeScript patterns. Both exceeded output size budgets significantly (S-02 FAIL for both). Sonnet had slightly better cross-referencing (connecting React vs vanilla JS conventions) and recommendation quality (stack-specific action items). Difference of 0.33 points is within Equivalent threshold.

---

## TQ-3: Video System Architecture (Medium Mode)

### Execution

| | Haiku | Sonnet |
|---|---|---|
| **Execution order** | parallel | parallel |
| **Latency** | ~18s | ~53s |
| **Tool calls** | ~14 | ~12 |
| **Dispatches** | 0 | 0 |

### Structural Checks

| Check | Haiku | Sonnet |
|-------|-------|--------|
| S-01: Sections present | PASS (6/6) | PASS (6/6) |
| S-02: Output size | FAIL (exceeds 2K budget) | FAIL (exceeds 2K budget) |
| S-03: Evidence citations | PASS (path:line citations) | PASS (precise line ranges) |
| S-04: Memory-first | PASS (memory section present) | PASS (memory section present) |
| S-05: Dispatch limits | PASS (0 dispatches) | PASS (0 dispatches) |
| S-06: Read-only | PASS | PASS |

### Substantive Scores

| Metric | Haiku | Sonnet |
|--------|-------|--------|
| Q-01: Pattern precision | 4/5 | 5/5 |
| Q-02: File selection | 4/5 | 5/5 |
| Q-03: Gap detection | 4/5 | 4/5 |
| Q-04: Cross-reference | 3/5 | 5/5 |
| Q-05: Recommendation | 4/5 | 4/5 |
| Q-06: Evidence density | 4/5 | 5/5 |
| **Average** | **3.83/5** | **4.67/5** |

### TQ-3 Verdict

**Verdict**: Haiku Acceptable

**Notes**: Sonnet significantly outperformed on file discovery and cross-referencing. Sonnet found CSS video classes in the Webflow stylesheet (lines 8846-9069), inline CSS state machines in HTML files (13 sections covering animations, placeholder states, play/pause, loading, fullscreen, mobile), and actual HTML video elements across 3 pages (locatie.html, detail_blog.html, blog.html). Sonnet identified 3 distinct component types (background, player, hover) with their data-attribute patterns. Haiku found the core JS patterns (hls_patterns.js, wait_patterns.js, performance_patterns.js) but missed the CSS and HTML-level implementations entirely, noting CSS as a gap. Difference: 0.83 points (Haiku 0.83 below Sonnet, Haiku avg >= 3.0 = Acceptable).

---

## TQ-4: Navigation System Full Context (Thorough Mode)

### Execution

| | Haiku | Sonnet |
|---|---|---|
| **Execution order** | parallel | parallel |
| **Latency** | ~28s | ~51s |
| **Tool calls** | ~14 | ~10 |
| **Dispatches** | 0 | 0 |

### Structural Checks

| Check | Haiku | Sonnet |
|-------|-------|--------|
| S-01: Sections present | PASS (6/6) | PASS (6/6) |
| S-02: Output size | FAIL (exceeds 4K budget) | FAIL (exceeds 4K budget) |
| S-03: Evidence citations | PASS (line references) | PASS (extensive line references) |
| S-04: Memory-first | PASS | PASS |
| S-05: Dispatch limits | PASS (0 dispatches) | PASS (0 dispatches) |
| S-06: Read-only | PASS | PASS |

### Substantive Scores

| Metric | Haiku | Sonnet |
|--------|-------|--------|
| Q-01: Pattern precision | 4/5 | 5/5 |
| Q-02: File selection | 4/5 | 5/5 |
| Q-03: Gap detection | 4/5 | 4/5 |
| Q-04: Cross-reference | 4/5 | 5/5 |
| Q-05: Recommendation | 4/5 | 4/5 |
| Q-06: Evidence density | 4/5 | 5/5 |
| **Average** | **4.00/5** | **4.67/5** |

### TQ-4 Verdict

**Verdict**: Haiku Acceptable

**Notes**: Both agents produced comprehensive navigation system analysis. Sonnet excelled by cross-referencing the navigation system with the spec 031 performance analysis (identifying that nav_mobile_menu.js had 11 forced reflows that were subsequently optimized). Sonnet also mapped the complete z-index hierarchy from CSS design tokens (navigation-section: 995, navigation-bar: 996) across multiple responsive breakpoints with exact line numbers. Haiku covered the same ground well but with less depth — it found the HTML structure, CSS patterns, and JavaScript integration points but didn't cross-reference with other spec findings. Sonnet's "research-deeper" recommendation verdict was more calibrated than Haiku's "proceed". Difference: 0.67 points (Acceptable range).

---

## TQ-5: Agent System Architecture (Thorough Mode, Meta)

### Execution

| | Haiku | Sonnet |
|---|---|---|
| **Execution order** | parallel | parallel |
| **Latency** | ~17s | ~42s |
| **Tool calls** | ~10 | ~8 |
| **Dispatches** | 0 | 0 |

### Structural Checks

| Check | Haiku | Sonnet |
|-------|-------|--------|
| S-01: Sections present | PASS (6/6) | PASS (6/6) |
| S-02: Output size | FAIL (exceeds 4K budget) | FAIL (exceeds 4K budget) |
| S-03: Evidence citations | PASS (detailed file references) | PASS (section-level references) |
| S-04: Memory-first | PASS | PASS (referenced memory files) |
| S-05: Dispatch limits | PASS (0 dispatches) | PASS (0 dispatches) |
| S-06: Read-only | PASS | PASS |

### Substantive Scores

| Metric | Haiku | Sonnet |
|--------|-------|--------|
| Q-01: Pattern precision | 5/5 | 5/5 |
| Q-02: File selection | 5/5 | 5/5 |
| Q-03: Gap detection | 4/5 | 4/5 |
| Q-04: Cross-reference | 5/5 | 5/5 |
| Q-05: Recommendation | 5/5 | 5/5 |
| Q-06: Evidence density | 5/5 | 5/5 |
| **Average** | **4.83/5** | **4.83/5** |

### TQ-5 Verdict

**Verdict**: Equivalent

**Notes**: Both agents produced outstanding architecture analysis. Haiku mapped all 8 agent files with permission matrices, dispatch routing (8-tier priority), temperature intentionality (0.1 vs 0.2 for debug), and agent-to-agent relationships. Sonnet found the same agent files and additionally cross-referenced with memory files from prior sessions (spec 005 recommendations, spec 003 implementation), identified the naming inconsistency (@documentation-writer vs @write), and documented CWB/TCB/PDR patterns with specific section references (Section 23, 26, 15, 17). Both achieved near-perfect scores. The meta-query nature (asking about agents in a codebase that IS about agents) played to both models' strengths equally.

---

## Summary

### Verdict Overview

| Query | Mode | Verdict |
|-------|------|---------|
| TQ-1 | quick | Equivalent |
| TQ-2 | medium | Equivalent |
| TQ-3 | medium | Haiku Acceptable |
| TQ-4 | thorough | Haiku Acceptable |
| TQ-5 | thorough | Equivalent |

### Aggregate Scores

| | Haiku Average | Sonnet Average | Difference |
|---|---|---|---|
| All queries | 4.03/5 | 4.47/5 | -0.44 |
| Quick only | 3.00/5 | 3.33/5 | -0.33 |
| Medium only | 4.17/5 | 4.75/5 | -0.58 |
| Thorough only | 4.42/5 | 4.75/5 | -0.33 |

### Operational Comparison

| Metric | Haiku Total | Sonnet Total |
|--------|-------------|--------------|
| Total latency | ~112s | ~218s |
| Total tool calls | ~60 | ~47 |
| Total dispatches | 0 | 0 |

---

## Decision

**Decision Matrix Result**: GO

**Rationale**:
5/5 queries are OK (3 Equivalent + 2 Haiku Acceptable, 0 Degraded). This exceeds the "4/5 OK" threshold for GO. No queries showed Haiku Degraded results.

Key observations:
- **Haiku strengths**: Faster execution (~112s vs ~218s total), more tool calls but quicker overall. Excellent on meta/architectural queries (TQ-5: 4.83/5). Found unique high-value resources (TQ-2: 500-line form-submission-analysis.md).
- **Sonnet strengths**: Consistently deeper cross-referencing across all queries. Better at finding CSS/HTML implementations alongside JS patterns (TQ-3: found inline CSS state machines that Haiku missed). More precise line-range citations.
- **Both models' weakness**: S-02 output size compliance failed for 8/10 runs — both models consistently exceed token budgets. This is a systemic issue with the context agent prompt, not a model-specific problem.
- **Structural concern**: Haiku produced only 4/6 Context Package sections in TQ-1 (S-01 FAIL). This is a minor concern for quick mode but would be more significant if it recurred in medium/thorough modes. It did not recur.
- **Operational trade-off**: Haiku is ~2x faster but uses ~28% more tool calls. Sonnet is more efficient per-tool-call but takes longer overall.

**Monitoring notes for GO decision**:
- Watch for S-01 section completeness in quick mode (Haiku missed 2 sections in TQ-1)
- Medium mode queries show the widest gap (-0.58 average difference) — monitor this category
- Consider prompt refinement to address S-02 output size compliance (affects both models)

**Actions Taken**:
- [ ] Variant agents deleted
- [ ] Production agent updated (if needed)
- [ ] Spec 011 Phase 1 status updated
- [ ] Results saved to memory
