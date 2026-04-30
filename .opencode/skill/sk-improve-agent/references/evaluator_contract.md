---
title: Evaluator Contract
description: Deterministic scoring and benchmark contract for target-profiled improve-agent experiments.
---

# Evaluator Contract

Contract for how `sk-improve-agent` scores candidates and benchmarks packet-local outputs. Use it when you need the exact evaluator inputs, outputs, rubric dimensions, and hard rejection behavior.

---

## 1. OVERVIEW

### Purpose

Defines the input and output contract for the prompt-surface scorer and the output benchmark runner so improve-agent runs remain deterministic enough for bounded local experimentation.

### When to Use

Use this reference when:
- Updating scoring logic or benchmark rules
- Explaining why a candidate was kept, rejected, or marked infra-failure
- Adding a new target profile that needs evaluator support

### Core Principle

Weak candidates and infrastructure failures must be distinguishable. The contract exists so a broken tool path is not mistaken for a bad prompt and vice versa.

---

## 2. EVALUATED SURFACES

### Dynamic Profiles (only mode)

Every agent file in `.opencode/agent/*.md` is evaluated using dynamic mode. The scorer generates a profile on the fly from the agent's own structure, rules, and permissions using `generate-profile.cjs`. No static profiles are shipped; dynamic mode is the sole scoring path.

---

## 3. INPUT CONTRACT

### Dynamic Mode (5-dimension, only mode)

The scorer runs dynamic 5-dimension evaluation by default:
- `--candidate=PATH` required (path to the agent .md file)
- `--target=PATH` optional (defaults to candidate path)
- `--manifest=PATH` optional
- `--weights=JSON` optional (override default dimension weights)
- `--output=PATH` optional

The benchmark runner expects:
- `--profile=ID`
- `--outputs-dir=PATH`
- `--output=PATH`
- `--label=STRING` optional
- `--state-log=PATH` optional

---

## 4. OUTPUT CONTRACT

The scorer emits JSON with:
- `status`
- `profileId`
- `family`
- `evaluationMode` (always `"dynamic-5d"`)
- `target`
- `candidate`
- `score` (weighted dynamic score)
- `dimensions` (array of 5 dimension objects)
- `recommendation`
- `failureModes`
- `legacyScore` (always `null`; retained for schema compatibility)

The benchmark runner emits JSON with:
- `status`
- `profileId`
- `family`
- `label`
- `aggregateScore`
- `maxScore`
- `recommendation`
- `fixtures`
- `failureModes`

### Dimension Details

Each entry in the `dimensions` array contains `name`, `score`, `weight`, and `details`. The recommendation is `"candidate-acceptable"` when the weighted score is at least 70, otherwise `"needs-improvement"`.

---

## 5. RUBRIC

### 5-Dimension Rubric (dynamic mode)

| Dimension | Weight | What It Checks |
| --- | --- | --- |
| Structural Integrity | 0.20 | Agent template compliance (CORE WORKFLOW, OUTPUT VERIFICATION, ANTI-PATTERNS, CAPABILITY SCAN, RULES, RELATED RESOURCES sections) |
| Rule Coherence | 0.25 | ALWAYS/NEVER/ESCALATE IF rules align with workflow steps and instructions; keyword match against the agent's own stated rules |
| Integration Consistency | 0.25 | Runtime mirrors in sync, commands reference agent, skills reference agent; scored via `scan-integration.cjs` (mirror 60%, command 20%, skill 20%) |
| Output Quality | 0.15 | Output verification checklist items present in instructions; no placeholder content ([TODO], [TBD], [YOUR_VALUE_HERE]) |
| System Fitness | 0.15 | Permission-capability alignment (no tools listed but denied); resource references valid (commands and skills exist); frontmatter completeness (name, mode, permission) |

### Benchmark Rubric

| Dimension | Weight | What It Checks |
| --- | --- | --- |
| Structure | 0.45 | Required headings or sections appear in the output |
| Grounding | 0.35 | Required file, command, or context references appear |
| Cleanliness | 0.20 | Placeholders and forbidden patterns are absent |
| Integration | optional | Mirror parity, command alignment, skill coverage (via `--integration-report`) |

---

## 6. REJECTION AND INFRA FAILURE

Reject immediately when:
- required target-profile sources are missing
- the candidate omits the target's mandatory contract anchors
- nested delegation is allowed where forbidden
- placeholders dominate the body
- the manifest marks the surface as forbidden or fixed
- a benchmark run drops below the profile minimum fixture or aggregate score

Use `infra_failure` only when the scorer or benchmark runner cannot read files, parse the manifest or profile, or load the fixture or output set.

---

## 7. RELATED RESOURCES

- `benchmark_operator_guide.md`
- `promotion_rules.md`
- `no_go_conditions.md`
- `../scripts/score-candidate.cjs`
- `../scripts/scan-integration.cjs`
- `../scripts/generate-profile.cjs`

