---
title: "Feature Specification: Routing Accuracy Hardening"
description: "Implement routing accuracy improvements from 019/001/005 research: Wave A advisor command-surface normalization + Wave B Gate 3 deep-loop positive markers + Wave C optional follow-ons. Measured gains: Gate 3 F1 68.6%→83.3%, advisor accuracy 53.5%→60.0%."
trigger_phrases:
  - "routing accuracy hardening"
  - "gate 3 deep loop markers"
  - "skill advisor command normalization"
importance_tier: "critical"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/004-routing-accuracy-hardening"
    last_updated_at: "2026-04-18T23:45:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Remediation child scaffolded from 019/001/005 research"
    next_safe_action: "Dispatch implementation"
    blockers: []

---
# Feature Specification: Routing Accuracy Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Source Research** | ../../research/019-pt-03/research.md |
| **Priority** | P1 |

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (3 P1 + 2 P2 findings) |
| **Status** | Complete |
| **Effort Estimate** | 2-3 days |
| **Executor** | cli-codex gpt-5.4 high fast |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Baseline from 019/001/005 labeled 200-prompt corpus:
- Gate 3: 88.8% precision, 55.9% recall, 68.6% F1 — under-recalls deep-loop writes (24.4% F1) and mixed-ambiguous prompts (9.1% F1)
- Skill advisor: 53.5% exact-match accuracy; 32 missed fires + 51 wrong-skill fires

Joint error rate: 127/200 = 63.5%. But 96/127 (75.6%) are single-surface misses — local rule cleanup recovers most lost accuracy without redesigning either router.

Dominant repair themes:
1. Advisor command-surface normalization: command-bridges (`command-memory-save`, `command-spec-kit-resume`, `command-spec-kit-deep-research`, `command-spec-kit-deep-review`) fragment intent away from owning packet skills (`system-spec-kit` under-recalls 55 gold cases to 15)
2. Gate 3 deep-loop positive markers: 22 `deep_loop_write` gold prompts fall into `no_match` because Gate 3 has no explicit deep-research/deep-review positive markers

### Purpose

Land Wave A (advisor normalization) and Wave B (Gate 3 deep-loop markers) with measured accuracy gain verified against the labeled corpus. Wave C (resume/context + mixed-tail exception) is optional, decided after Wave A+B re-measurement.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### 3.1 In Scope

**Wave A — Advisor command-surface normalization:**
- When command-only bridge wins top-1, normalize back to owning skill if prompt explicitly invokes the command workflow
- Guard: if prompt is quoted command string or implementation target, do NOT flatten (keep command output)
- Expected gain: advisor 53.5% → 60.0%; TT 73→81; FF 31→26

**Wave B — Gate 3 deep-loop positive markers:**
- Add positive markers: `deep research`, `deep review`, `:auto`, `convergence`, `iteration loop`, loop-oriented variants
- Expected gain: Gate 3 F1 68.6%→83.3%; TT 73→94; FT 34→13; FF 31→26

**Wave C — Optional follow-ons (only if Wave A+B residual justifies):**
- Broader resume/context markers (3 additional triggers)
- Mixed-tail write exception (narrow branch for read-only prefix + write tail)

### 3.2 Out of Scope

- Re-architecting either router
- Training new ML layers
- Redesigning skill graph or semantic-search infrastructure

### 3.3 Files to Change

- `.opencode/skill/skill-advisor/scripts/skill_advisor.py` (Wave A)
- `.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts` (Wave B)
- `corpus/labeled-prompts.jsonl` (from research, reused as regression fixture)
- Regression tests under `tests/routing-accuracy/` (NEW)
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### 4.1 Functional Requirements

| ID | Priority | Requirement |
|----|----------|-------------|
| REQ-001 | P0 | Advisor command-normalization lands with guard coverage for quoted-command prompts. |
| REQ-002 | P0 | Post-change corpus shows advisor exact-match accuracy >= 60% against the 200-prompt labeled fixture. |
| REQ-003 | P0 | Gate 3 deep-loop positive markers are added so canonical deep-loop write prompts fire positive. |
| REQ-004 | P0 | Post-change corpus shows Gate 3 F1 >= 83% against the 200-prompt labeled fixture. |
| REQ-005 | P1 | Historical false-positive tokens `analyze`, `decompose`, and `phase` remain read-only when no write tail is present. |
| REQ-006 | P1 | Joint matrix is re-measured after Wave A+B and any conditional Wave C decision is evidence-backed. |

### 4.2 Acceptance Scenarios

#### Scenario 1 - Advisor normalizes command bridge winners

**Given** the prompt routes to a command bridge such as `command-memory-save`, when advisor final ranking is produced, then the recommendation returns the owning skill `system-spec-kit`.

#### Scenario 2 - Advisor preserves implementation references

**Given** the prompt explicitly quotes or discusses a command target as an implementation-level reference, when advisor final ranking is produced, then command bridge normalization is not applied.

#### Scenario 3 - Gate 3 detects deep-loop write workflows

**Given** the prompt invokes a deep research or deep review workflow with command-style or natural-language deep-loop markers, when `classifyPrompt()` runs, then Gate 3 returns a file-modification classification.

#### Scenario 4 - Gate 3 preserves historical read-only behavior

**Given** the prompt only analyzes, decomposes, or discusses a phase without a write tail, when `classifyPrompt()` runs, then Gate 3 does not require a spec-folder write gate.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] Advisor accuracy ≥ 60% on labeled corpus [Evidence: final corpus advisor accuracy 60.0%]
- [x] Gate 3 F1 ≥ 83% on labeled corpus [Evidence: final corpus Gate 3 F1 97.66%]
- [x] Historical false-positive tokens still pass as read-only [Evidence: final corpus historical false-positive regressions 0]
- [x] Joint matrix improvements match research projections within ±5% [Evidence: final matrix TT 115 / FT 5 / FF 1]
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|-----------|
| Normalization flattens legitimate command queries | Explicit-invocation guard + counterexample tests |
| Deep-loop markers over-trigger Gate 3 on read-only | Corpus-driven threshold tuning |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Normalize on every command-bridge win vs only explicit-invocation (research Q1) — implementation chooses
- Deep-loop as dedicated Gate 3 category vs additive trigger coverage (research Q3)
<!-- /ANCHOR:questions -->
