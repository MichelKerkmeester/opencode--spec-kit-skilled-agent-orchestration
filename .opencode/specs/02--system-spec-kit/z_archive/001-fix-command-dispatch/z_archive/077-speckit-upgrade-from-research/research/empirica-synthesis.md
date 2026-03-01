# Empirica Framework Analysis Synthesis

> **Source:** [github.com/Nubaeon/empirica](https://github.com/Nubaeon/empirica)
> **Original Research:** Archived during consolidation (source folder not present in this repository snapshot)
> **Analysis Date:** 2026-01-15
> **Confidence:** HIGH (0.92)

---

## Executive Summary

Empirica is an **epistemic self-awareness framework** that prevents AI "confident ignorance" through explicit uncertainty tracking. The core innovation is treating **uncertainty as separate from confidence**—you can be 80% confident about your answer while still having 60% uncertainty about what you don't know. This dual-threshold approach, combined with PREFLIGHT/POSTFLIGHT measurement patterns, enables quantified learning verification.

---

## Key Patterns Identified

| Pattern | Description | Applicability |
|---------|-------------|---------------|
| **Explicit Uncertainty** | Separate meta-layer tracking doubt (0.0-1.0) | ADOPT - Critical gap in current system |
| **Dual-Threshold Gates** | know >= 0.70 AND uncertainty <= 0.35 | ADOPT - Prevents overconfident execution |
| **CASCADE Workflow** | PREFLIGHT → CHECK → POSTFLIGHT loop | ADOPT - Enables learning measurement |
| **Bayesian Calibration** | Self-correction factors from 995 observations | ADAPT - Use completion bias (+0.54) |
| **Learning Delta Tracking** | Δknow, Δuncertainty stored per session | ADOPT - Compounds across sessions |
| **13 Epistemic Vectors** | Full taxonomy across 4 tiers | SIMPLIFY - 4-5 core vectors sufficient |
| **Git Notes Persistence** | Distributed memory via native git | DEFER - P2 priority enhancement |
| **Multi-AI Architecture** | CANONICAL_CORE for different models | SKIP - Claude-only system |

---

## The Uncertainty Problem Explained

### Why Confidence Alone Fails

**Scenario:** Agent reports 85% confidence on implementation task.

**Hidden Problem:** Agent doesn't know what it doesn't know.
- Confident about syntax? Yes.
- Aware of edge cases? Unknown.
- Understanding of system constraints? Unknown.

**Result:** "Confident ignorance"—high confidence masking knowledge gaps.

### Empirica's Solution: Dual Tracking

| Metric | Question | Measures |
|--------|----------|----------|
| **Confidence** | "How sure am I about my answer?" | Certainty about what you know |
| **Uncertainty** | "What don't I know that I don't know?" | Awareness of knowledge boundaries |

**The Key Insight:** You can be confident about your answer (80%) while having high uncertainty about the problem space (60%). Both matter.

### Threshold Logic

```
READINESS GATE:
├─ know >= 0.70 (sufficient domain knowledge)
├─ uncertainty <= 0.35 (bounded unknowns)
└─ BOTH must pass for file modification
```

**Gate Outcomes:**
- know: 0.85, uncertainty: 0.30 → **PASS** (informed and bounded)
- know: 0.90, uncertainty: 0.50 → **FAIL** (confident but unbounded)
- know: 0.60, uncertainty: 0.20 → **FAIL** (bounded but uninformed)

---

## PREFLIGHT/POSTFLIGHT Pattern Detail

### Purpose

Capture epistemic state **before** investigation and **after** completion to measure actual learning.

### Workflow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                      CASCADE WORKFLOW                         │
└──────────────────────────────────────────────────────────────┘

TASK RECEIVED
     │
     ▼
┌─────────────┐
│  PREFLIGHT  │  Capture baseline BEFORE investigation
│  know: 0.45 │  "What do I know now?"
│  uncert: 0.60│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   NOETIC    │  High-entropy investigation phase
│(Investigate)│  Research, read files, gather context
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    CHECK    │───────────────┐
│  (Gate)     │               │ FAIL → Loop back to NOETIC
│ know>=0.70? │               │ (max 3 loops before escalation)
│uncert<=0.35?│◄──────────────┘
└──────┬──────┘
       │ PASS
       ▼
┌─────────────┐
│   PRAXIC    │  Low-entropy execution phase
│  (Execute)  │  Implement with bounded uncertainty
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ POSTFLIGHT  │  Capture state AFTER completion
│  know: 0.85 │  "What did I learn?"
│  uncert: 0.15│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   DELTA     │  Δknow: +0.40, Δuncert: -0.45
│ CALCULATION │  Store for session compounding
└─────────────┘
```

### Implementation Insight

- PREFLIGHT captures what you know **before looking**
- CHECK gates ensure you've learned enough to proceed
- POSTFLIGHT proves learning actually occurred
- Deltas compound across sessions for trend analysis

---

## Bayesian Calibration Data

From 995 observations of AI self-assessment:

| Vector | Bias | Correction | Interpretation |
|--------|------|------------|----------------|
| `know` | -0.10 | **+0.10** | AI underestimates knowledge |
| `uncertainty` | +0.14 | **-0.14** | AI overestimates doubt |
| `completion` | -0.54 | **+0.54** | AI substantially underestimates progress |
| `change` | -0.23 | **+0.23** | AI downplays transformation effects |

### Actionable Calibration

For spec-kit integration, the **completion bias (+0.54)** is most actionable:
- When estimating "50% done" → likely closer to 100%
- Apply correction: `adjusted_completion = raw_estimate + 0.50`
- Prevents premature "I need more investigation" loops

---

## Applicability Assessment

### High-Value Adoptions (P0)

| Pattern | Current Gap | Implementation Path |
|---------|-------------|---------------------|
| Explicit uncertainty tracking | None exists | Add to confidence framework |
| Dual-threshold gates | Single confidence % | know >= 0.70 AND uncertainty <= 0.35 |
| PREFLIGHT baseline | No measurement | Add to Gate 1 |
| POSTFLIGHT delta | No learning tracking | Add to completion verification |

### Medium-Value Adoptions (P1)

| Pattern | Current Gap | Implementation Path |
|---------|-------------|---------------------|
| Claude Code hooks | Manual save/restore | pre-compact, session-start hooks |
| Session lifecycle MCP tools | Implicit sessions | session_create, session_show |
| Learning history storage | No delta persistence | New schema tables |

### Patterns to Skip

| Pattern | Reason |
|---------|--------|
| Full 13-vector system | 4-5 vectors capture 90% of value |
| Multi-AI architecture | Claude-only system |
| Qdrant vector database | sqlite-vec handles current scale |
| Moon phase notation | Simpler grounding sufficient |
| CLI breadcrumb commands | generate-context.js exists |

---

## Implementation Recommendations

### 1. Immediate: Add Uncertainty to Confidence Framework

**Current (AGENTS.md Section 4):**
```markdown
- 80-100% HIGH → Proceed
- 40-79% MEDIUM → Caution
- 0-39% LOW → Ask
```

**Proposed Enhancement:**
```markdown
- Confidence >= 70% AND Uncertainty <= 35% → PROCEED
- Confidence >= 70% AND Uncertainty > 35% → INVESTIGATE MORE
- Confidence < 70% → ASK (regardless of uncertainty)
```

### 2. Add PREFLIGHT to Gate Workflow

**At Gate 1, capture baseline:**
```markdown
PREFLIGHT CAPTURE:
- know: [0.0-1.0] current domain understanding
- uncertainty: [0.0-1.0] current doubt level
- (stored for later delta calculation)
```

### 3. Add POSTFLIGHT to Completion Verification

**When claiming "done":**
```markdown
POSTFLIGHT:
- Reassess know, uncertainty
- Calculate: Δknow = POST.know - PRE.know
- Calculate: Δuncert = POST.uncert - PRE.uncert
- Store learning record
```

### 4. Apply Completion Calibration

**Add to AGENTS.md Section 4:**
```markdown
CALIBRATION NOTE:
When estimating completion, add +0.50 to raw estimate.
(AI consistently underestimates progress by -0.54)
```

---

## Core Vectors for Spec-Kit (Simplified)

From Empirica's 13 vectors, these 5 capture most value:

| Vector | Threshold | Question |
|--------|-----------|----------|
| `know` | >= 0.70 | How well do I understand the domain? |
| `uncertainty` | <= 0.35 | What's my knowledge boundary awareness? |
| `context` | >= 0.60 | Do I have sufficient codebase context? |
| `clarity` | >= 0.70 | Is the request unambiguous? |
| `completion` | (calibrated) | How close to done? (+0.50 correction) |

---

## References

**Primary Source:**
- Empirica Repository: https://github.com/Nubaeon/empirica

**Key Documents Analyzed:**
- `empirica/core/schemas/epistemic_assessment.py` - Vector definitions
- `empirica/core/thresholds.py` - Dual-threshold logic
- `empirica/core/bayesian_beliefs.py` - Calibration factors
- `docs/architecture/NOETIC_PRAXIC_FRAMEWORK.md` - CASCADE workflow
- `docs/architecture/SENTINEL_ARCHITECTURE.md` - Gate enforcement

**Original Research:**
- `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/research/empirica-synthesis.md`
- Methodology: 10 parallel Opus 4.5 agents with ultrathink analysis

---

*Synthesis created: 2026-01-22*
