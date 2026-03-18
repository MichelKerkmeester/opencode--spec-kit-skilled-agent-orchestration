# Scoring Rubric: Context Agent Model Comparison

**Spec**: 012-context-model-comparison
**Created**: 2026-02-14

---

## 1. Structural Checks (Pass/Fail)

These are binary — the output either meets the requirement or it doesn't.

| Check | Requirement | Pass Criteria |
|-------|-------------|---------------|
| S-01: Section completeness | All 6 Context Package sections present | All headers exist (Memory, Codebase, Patterns, Dispatched, Gaps, Recommendation) |
| S-02: Output size compliance | Within thoroughness level budget | quick: ~500 tokens, medium: ~2K tokens, thorough: ~4K tokens (20% tolerance) |
| S-03: Evidence citations | Every finding cites a source | File paths use `path:line` format; memory references include IDs |
| S-04: Memory-first protocol | Memory check happens before codebase scan | Tool call order shows memory tools before Glob/Grep/Read |
| S-05: Dispatch limits | Agent dispatches within mode limits | quick: 0, medium: <=1, thorough: <=2 |
| S-06: Read-only compliance | No write/edit/create operations attempted | Zero mutation tool calls |

---

## 2. Substantive Metrics (1-5 Scale)

Score each metric independently. Use the scale definitions below.

### Q-01: Pattern Precision

How accurately does the agent identify and describe code patterns?

| Score | Description |
|-------|-------------|
| 1 | Patterns described are wrong or irrelevant to the query |
| 2 | Some patterns identified but with significant inaccuracies |
| 3 | Core patterns identified correctly; minor gaps or imprecisions |
| 4 | All major patterns identified accurately with specific references |
| 5 | Comprehensive pattern identification with nuanced distinctions and cross-references |

### Q-02: File Selection Quality

How well does the agent select relevant files from the codebase?

| Score | Description |
|-------|-------------|
| 1 | Selected files are irrelevant or critical files missed entirely |
| 2 | Some relevant files found but major omissions |
| 3 | Most relevant files found; 1-2 notable omissions |
| 4 | All key files found with good coverage; minor omissions only |
| 5 | Comprehensive file discovery with excellent prioritization of most relevant files |

### Q-03: Gap Detection

How well does the agent identify and communicate what it did NOT find?

| Score | Description |
|-------|-------------|
| 1 | No gaps section or claims "nothing missing" when gaps clearly exist |
| 2 | Gaps section exists but is generic or misses obvious unknowns |
| 3 | Key gaps identified; some lesser unknowns missed |
| 4 | Thorough gap identification with specific descriptions of what's missing |
| 5 | Excellent gap analysis including risk assessment and suggested investigation paths |

### Q-04: Cross-Reference Quality

How well does the agent connect findings across different sources (memory, files, patterns)?

| Score | Description |
|-------|-------------|
| 1 | No cross-referencing; findings presented as isolated facts |
| 2 | Minimal connections; mostly lists of unrelated findings |
| 3 | Some cross-references between files or between memory and codebase |
| 4 | Good integration across sources with explicit connections noted |
| 5 | Excellent synthesis showing how findings relate, contradict, or complement each other |

### Q-05: Recommendation Quality

How actionable and well-reasoned is the final recommendation?

| Score | Description |
|-------|-------------|
| 1 | No recommendation or recommendation contradicts findings |
| 2 | Generic recommendation ("proceed") without rationale |
| 3 | Reasonable recommendation with basic rationale |
| 4 | Well-reasoned recommendation with specific next steps tied to findings |
| 5 | Excellent recommendation with prioritized actions, risk-aware reasoning, and clear rationale |

### Q-06: Evidence Density

How well-supported are the findings with concrete evidence?

| Score | Description |
|-------|-------------|
| 1 | Claims without any file paths, line numbers, or memory references |
| 2 | Some evidence but many unsupported claims |
| 3 | Most findings supported; some claims lack specific evidence |
| 4 | Strong evidence throughout with consistent `path:line` and memory ID citations |
| 5 | Every finding has precise evidence; no unsupported claims; evidence quality is exemplary |

---

## 3. Operational Metrics (Measured)

Capture these from session logs. No scoring — raw measurement only.

| Metric | How to Measure | Unit |
|--------|---------------|------|
| OP-01: Latency | Time from prompt to final output | Seconds |
| OP-02: Tool call count | Total tool invocations | Count |
| OP-03: Agent dispatches | Number of @explore/@research dispatches | Count (0-2) |
| OP-04: Token usage | Input + output tokens (if available from logs) | Token count |
| OP-05: Dispatch quality | Were dispatches necessary and productive? | Qualitative note |

---

## 4. Per-Query Verdict Scale

After scoring both variants on a query, assign one verdict:

| Verdict | Criteria | Implication |
|---------|----------|-------------|
| **Equivalent** | Average substantive score difference <= 0.5 points | No meaningful quality difference |
| **Haiku Acceptable** | Haiku 0.5-1.5 points below Sonnet AND Haiku average >= 3.0 | Quality loss is tolerable |
| **Haiku Degraded** | Haiku 1.5+ points below Sonnet OR Haiku average < 3.0 | Quality loss is NOT acceptable |
| **Haiku Superior** | Haiku 0.5+ points above Sonnet | Haiku actually outperforms |

**Calculating average**: Sum all 6 Q-scores, divide by 6. Compare Haiku average vs Sonnet average.

---

## 5. Go/No-Go Decision Matrix

| Query Verdicts | Decision | Action |
|---------------|----------|--------|
| 5/5 Equivalent or Superior | **GO** | Keep Haiku as production model |
| 4/5 OK (Equivalent/Acceptable/Superior), 1 Degraded | **GO** | Keep Haiku, add monitoring note |
| 3/5 OK, 2 Degraded (both in thorough mode) | **CONDITIONAL** | Keep Haiku but evaluate Option C (hybrid routing) |
| 2+ Degraded in medium mode queries | **NO-GO** | Revert to Sonnet immediately |
| Any Degraded in quick mode (TQ-1) | **NO-GO** | Revert to Sonnet immediately |

**Tie-breaking**: If the matrix doesn't clearly match (e.g., 3/5 OK with 1 medium + 1 thorough degraded), default to the more conservative decision.

---

## 6. Non-Determinism Acknowledgment

With N=5 queries and single runs per variant, statistical significance is not achievable. This test provides directional evidence, not proof. Mitigations:

- Use clear rubric to reduce evaluator subjectivity
- Require 2+ point differences for "meaningful" gaps
- Supplement quantitative scores with qualitative notes
- If CONDITIONAL, run 3 additional queries before final decision
