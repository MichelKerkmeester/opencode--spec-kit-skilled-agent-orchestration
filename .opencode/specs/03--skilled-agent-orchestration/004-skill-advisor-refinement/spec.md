---
title: "Feature Specification: Skill Advisor Refinement [template:level_3/spec.md]"
description: "Refine skill advisor routing quality and runtime performance in .opencode/skill/scripts/skill_advisor.py and adjacent script-level support files."
trigger_phrases:
  - "skill advisor"
  - "routing quality"
  - "confidence uncertainty"
  - "intent normalization"
  - "latency benchmark"
# <!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
importance_tier: "critical"
contextType: "implementation"
---
# <!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

This spec defines a focused refinement of the skill advisor workflow to improve recommendation correctness, preserve uncertainty safety by default, and reduce runtime overhead in repeated calls. The work is limited to `.opencode/skill/scripts/skill_advisor.py` plus adjacent script-level support files that provide caching, benchmarking, and regression gates.

**Key Decisions**: Keep dual-threshold filtering as the safe default even when `--threshold` is provided; treat slash-command bridges as a separate class from real skills and rank them lower unless slash-command intent is explicit.

**Critical Dependencies**: Existing SKILL.md frontmatter consistency and stable Python 3 runtime.

---

---


## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Implementation Complete |
| **Created** | 2026-03-03 |
| **Branch** | `03--commands-and-skills/skill-advisor` |
| **Spec Folder** | `.opencode/specs/03--commands-and-skills/004-advisor-refinement/` |

---


---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The current advisor mixes command bridges and real skills in a single ranking path, applies confidence-only behavior when `--threshold` is explicitly passed, and performs repeated expensive discovery/parsing work per process. This causes avoidable routing errors in ambiguous prompts and unnecessary latency during repeated Gate 2 calls.

### Purpose

Deliver a safer and faster skill advisor that improves top-ranked routing quality while preserving conservative uncertainty handling by default.

---
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Implement all nine approved refinements inside the skill advisor workflow:
  1. Preserve default uncertainty guard even when `--threshold` is explicitly provided.
  2. Add explicit `--confidence-only` override mode.
  3. Separate command bridges (`kind: command`) and deprioritize unless slash intent is explicit.
  4. Add cached discovery with mtime invalidation.
  5. Add fast frontmatter-only parsing.
  6. Add precomputed normalized metadata for hot-path matching.
  7. Add margin-aware and ambiguity-aware confidence calibration.
  8. Add structural batch mode (`--batch-file`, `--batch-stdin`).
  9. Add permanent regression and benchmark harnesses with quality/performance gates.
- Create/update script-level support files required for benchmark and regression execution.
- Update usage documentation for new flags and benchmark commands in `.opencode/skill/scripts/README.md` and `.opencode/skill/scripts/SET-UP_GUIDE.md`.

### Out of Scope

- Editing AGENTS policy text, Gate threshold policy, or global orchestration logic outside advisor scripts.
- Refactoring unrelated skills, SKILL.md content rewrites, or directory reorganization.
- Any non-script codebase changes outside `.opencode/skill/scripts/`.
- UI/CLI styling changes unrelated to advisor output semantics.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/scripts/skill_advisor.py` | Modify | Core routing logic, filtering defaults, scoring, intent normalization, structural mode hooks |
| `.opencode/skill/scripts/skill_advisor_runtime.py` | Create | Cache and metadata helpers for discovery, mtime invalidation, normalized metadata |
| `.opencode/skill/scripts/skill_advisor_regression.py` | Create | Permanent regression harness with measurable quality gates |
| `.opencode/skill/scripts/skill_advisor_bench.py` | Create | Latency and throughput benchmark runner |
| `.opencode/skill/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Create | Versioned regression dataset with expected routing outcomes |
| `.opencode/skill/scripts/README.md` | Modify | CLI examples for override flag, structural mode, benchmark and regression commands |
| `.opencode/skill/scripts/SET-UP_GUIDE.md` | Modify | Setup/runbook guidance aligned with implemented flags, modes, and benchmark workflow |

---
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Uncertainty guard remains active by default even when `--threshold` is set. | `python3 .opencode/skill/scripts/skill_advisor.py "ambiguous prompt" --threshold 0.8` still applies uncertainty filtering unless explicit override flag is provided; verified by regression case IDs `U001-U004`. |
| REQ-002 | Confidence-only behavior is available through explicit override flag. | `--confidence-only` bypasses uncertainty gating and is documented in `README.md` and SET-UP_GUIDE.md; regression harness asserts behavior delta against default mode. |
| REQ-003 | Command bridges are ranked separately and deprioritized relative to real skills unless slash-command intent is explicit. | Dataset cases `C001-C010` pass: real skills rank first for plain-language intents, command bridges rank first only for explicit `/spec_kit` or `/memory:save` prompts. |
| REQ-004 | Per-process skill discovery cache with mtime invalidation is implemented. | Warm-call p95 latency improves at least 35% vs baseline in benchmark report and invalidation test confirms changed SKILL.md is reloaded. |
| REQ-005 | Fast frontmatter-only parsing is used in discovery. | Runtime parsing avoids full SKILL.md reads and frontmatter extraction remains stable across the fixture set. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Precomputed normalized metadata is used during scoring. | Runtime helper precomputes normalized fields and advisor matching path reuses them in warm runs. |
| REQ-007 | Margin-aware confidence and ambiguity-aware adjustment improve ranking stability. | Regression report achieves `top1_accuracy: 1.0` and `command_bridge_fp_rate: 0.0`. |
| REQ-008 | Structural batch mode reduces subprocess overhead. | Benchmark report shows `throughput_multiplier: 25.8538x`. |
| REQ-009 | Permanent regression and benchmark harnesses are runnable in CI/local. | Harness commands produce machine-readable artifacts in `.opencode/skill/scripts/out/` with `overall_pass: true`. |

---
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Routing quality improves to top-1 accuracy >= 92% on the permanent regression dataset and does not regress any existing protected cases.
- **SC-002**: Warm-call latency p95 is <= 20 ms and cold-call latency p95 is <= 55 ms on local benchmark profile.
- **SC-003**: Ambiguous intent false-positive rate for command bridges is <= 5% for non-slash prompts.
- **SC-004**: Structural mode (`--batch` or persistent mode) delivers >= 2.0x throughput vs repeated subprocess invocations.

---
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | SKILL.md frontmatter consistency across skills | Incomplete metadata weakens ranking | Add parser fallback defaults and include malformed fixture coverage |
| Dependency | Python runtime compatibility | Script mode features may behave differently by environment | Keep to stdlib and add explicit CLI integration tests |
| Risk | Over-calibration could suppress legitimate recommendations | High | Guard with margin floor, add protected high-confidence cases |
| Risk | Cache invalidation misses changed skills | High | Compare mtimes each request in cache layer; include invalidation regression case |
| Risk | Structural mode complexity introduces maintenance cost | Medium | Keep API small (`analyze_once`, `analyze_batch`), document invocation contract |

---
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: One-shot mode latency p95 <= 55 ms cold and <= 20 ms warm for dataset size <= 200 prompts.
- **NFR-P02**: Batch/persistent mode throughput >= 2.0x over one-shot subprocess baseline.

### Security

- **NFR-S01**: No shell execution, dynamic import, or external network access introduced in advisor runtime path.

### Reliability

- **NFR-R01**: Regression harness pass rate must remain 100% for P0 cases on every run.
- **NFR-R02**: Parser failures degrade gracefully and never crash `--health` or analysis calls.

---


---


## 8. EDGE CASES

### Data Boundaries

- Empty input: return empty result list with exit code 0.
- Very long prompt (>10k chars): tokenize safely, cap normalization work, no crash.
- Missing or malformed frontmatter: skill record loads with default values and warning path.

### Error Scenarios

- Skills directory missing: `--health` reports error state without traceback.
- Mtime read failure: cache path falls back to uncached discovery for that cycle.
- Structural mode malformed batch payload: returns structured validation error and non-zero exit.

---


---


## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: 5-6, LOC delta expected 500+, runtime + harness + docs |
| Risk | 21/25 | Routing quality regression risk and default filtering semantics |
| Research | 15/20 | Calibration tuning and ambiguity behavior validation |
| Multi-Agent | 5/15 | Single implementation agent, no parallel sub-agents |
| Coordination | 10/15 | Benchmark and regression gates must align with CLI behavior |
| **Total** | **73/100** | **Level 3** |

---


---


## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Default filtering behavior accidentally changed | H | M | Regression assertions on default vs `--confidence-only` modes |
| R-002 | Command bridges over-selected for plain prompts | H | M | Intent classifier check for slash explicitness plus ranking bias to real skills |
| R-003 | Cache staleness after SKILL.md edits | H | L | Mtime invalidation test with forced file touch and re-run |
| R-004 | Benchmark noise obscures true improvements | M | M | Fixed dataset, multiple runs, median and p95 reporting |
| R-005 | Structural mode adds complexity without adoption | M | M | Keep backward-compatible one-shot default and minimal additional flags |

---


---


## 11. USER STORIES

### US-001: Safe default gating (Priority: P0)

**As an** orchestrator using Gate 2, **I want** uncertainty guarding to remain active by default, **so that** ambiguous prompts do not trigger overconfident skill routing.

**Acceptance Criteria**:
1. **Given** a prompt with confidence >= threshold but uncertainty > 0.35, when run without override, then result is rejected.
2. **Given** the same prompt with `--confidence-only`, when run, then result can pass based on confidence alone.

---

### US-002: Real-skill preference (Priority: P0)

**As a** user issuing natural-language requests, **I want** real skills ranked above command bridges, **so that** recommendations align with substantive capabilities.

**Acceptance Criteria**:
1. **Given** non-slash prompt "create spec for feature", when analyzed, then `system-spec-kit` appears above `command-spec-kit`.
2. **Given** explicit `/spec_kit:plan` prompt, when analyzed, then command bridge may rank first.

---

### US-003: Faster repeated routing (Priority: P1)

**As an** operator running repeated advisor calls, **I want** cached discovery and precomputed metadata, **so that** warm calls are materially faster.

**Acceptance Criteria**:
1. **Given** unchanged SKILL.md mtimes, warm p95 latency improves >=35% versus baseline.
2. **Given** modified SKILL.md mtime, cache invalidates and new metadata is loaded.

---

### US-004: Sustainable quality gates (Priority: P1)

**As a** maintainer, **I want** permanent regression and benchmark scripts, **so that** routing quality and latency remain measurable over time.

**Acceptance Criteria**:
1. **Given** a regression run, command output includes pass/fail summary and exits non-zero on gate failure.
2. **Given** a benchmark run, command output includes before/after metrics including p50, p95, and throughput.

---

### US-005: Structural mode for lower overhead (Priority: P1)

**As an** orchestrator invoking advisor repeatedly in one process, **I want** batch or persistent mode, **so that** subprocess overhead is reduced.

**Acceptance Criteria**:
1. **Given** a batch of prompts, when run in structural mode, then throughput is >=2.0x baseline one-shot invocation.
2. **Given** invalid batch payload, then command returns validation error without crash.

---


---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None blocking. Default assumption is to implement a `--confidence-only` explicit override and keep current CLI behavior backward compatible for existing one-shot usage.

---
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3 SPEC (~165 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->


---
