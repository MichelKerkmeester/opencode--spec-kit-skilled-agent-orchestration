---
title: Promotion Rules
description: Keep, reject, and guarded promotion rules for improve-agent candidates.
---

# Promotion Rules

Policy reference for deciding whether a improve-agent candidate stays baseline-only, is rejected, or becomes promotion-eligible. Use it when score and benchmark evidence exist and you need the decision rule, not just the raw metrics.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Defines the difference between an interesting candidate, an acceptable candidate, and a promotable candidate.

### When to Use

Use this reference when:
- Reviewing score and benchmark outputs
- Explaining why a candidate tied, lost, or won
- Checking whether promotion prerequisites are actually satisfied

### Core Principle

Promotion stays intentionally narrower than scoring and benchmarking. A candidate can be promising without being safe to promote.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:current-posture -->
## 2. CURRENT PROMOTION POSTURE

All agent targets are evaluated via dynamic mode. Promotion is a per-target decision made under dynamic mode; there are no static, automatically promotion-eligible profiles.

When promotion is enabled, the shipped promotion script enforces:
- `candidate-acceptable` dynamic-mode 5-dimension scoring above `scoring.thresholdDelta`
- a matching `benchmark-pass` report (when benchmarks are configured for the target)
- a passing repeatability report
- explicit operator approval plus manifest boundary enforcement for the specific target

---

<!-- /ANCHOR:current-posture -->
<!-- ANCHOR:keep-reject -->
## 3. KEEP VS REJECT

Keep the baseline when:
- the candidate score is lower
- the candidate violates the manifest
- the candidate only adds noise

Reject the candidate when:
- hard rejection conditions fire
- the run is an infra failure
- the candidate broadens scope

Prefer the candidate only when:
- the candidate score is higher
- no hard rejection condition fired
- the delta is meaningful

---

<!-- /ANCHOR:keep-reject -->
<!-- ANCHOR:tie-break -->
## 4. TIE-BREAK

When scores tie, prefer the simpler option:
- fewer instructions
- less duplication
- clearer file-reading contract
- narrower scope language

---

<!-- /ANCHOR:tie-break -->
<!-- ANCHOR:prerequisites -->
## 5. PROMOTION PREREQUISITES

Promotion is allowed only when:
- artifact-level fixtures exist (or are waived for the specific target)
- repeatability is proven for the active benchmark set
- rollback steps are documented
- the explicit approval gate is passed
- the target is not classified `fixed` or `forbidden` in the manifest

---

<!-- /ANCHOR:prerequisites -->
<!-- ANCHOR:related-resources -->
## 6. RELATED RESOURCES

- `evaluator_contract.md`
- `rollback_runbook.md`
- `no_go_conditions.md`
- `../scripts/promote-candidate.cjs`

<!-- /ANCHOR:related-resources -->
