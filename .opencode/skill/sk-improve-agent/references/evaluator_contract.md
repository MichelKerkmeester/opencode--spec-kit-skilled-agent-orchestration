---
title: Evaluator Contract
description: Deterministic scoring and benchmark contract for target-profiled agent-improver experiments.
---

# Evaluator Contract

Contract for how `sk-improve-agent` scores candidates and benchmarks packet-local outputs. Use it when you need the exact evaluator inputs, outputs, rubric dimensions, and hard rejection behavior.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Defines the input and output contract for the prompt-surface scorer and the output benchmark runner so agent-improver runs remain deterministic enough for bounded local experimentation.

### When to Use

Use this reference when:
- Updating scoring logic or benchmark rules
- Explaining why a candidate was kept, rejected, or marked infra-failure
- Adding a new target profile that needs evaluator support

### Core Principle

Weak candidates and infrastructure failures must be distinguishable. The contract exists so a broken tool path is not mistaken for a bad prompt and vice versa.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:evaluated-surfaces -->
## 2. EVALUATED SURFACES

### Static Profiles (legacy)

- `handover`: `.opencode/agent/handover.md`, hardcoded keyword and structure checks
- `context-prime`: `.opencode/agent/context-prime.md`, hardcoded keyword and structure checks

### Dynamic Profiles (any agent)

Any agent file in `.opencode/agent/*.md` can be evaluated using `--dynamic` mode. The scorer generates a profile on the fly from the agent's own structure, rules, and permissions using `generate-profile.cjs`.

---

<!-- /ANCHOR:evaluated-surfaces -->
<!-- ANCHOR:input-contract -->
## 3. INPUT CONTRACT

### Legacy Mode (prompt-surface)

The prompt scorer expects:
- `--candidate=PATH`
- `--baseline=PATH` optional
- `--manifest=PATH` optional
- `--target=PATH` optional
- `--profile=ID` optional
- `--output=PATH` optional

### Dynamic Mode (5-dimension)

The scorer accepts `--dynamic` to enable integration-aware evaluation:
- `--candidate=PATH` required (path to the agent .md file)
- `--dynamic` flag to enable 5-dimension scoring
- `--output=PATH` optional

The benchmark runner expects:
- `--profile=ID`
- `--outputs-dir=PATH`
- `--output=PATH`
- `--label=STRING` optional
- `--state-log=PATH` optional

---

<!-- /ANCHOR:input-contract -->
<!-- ANCHOR:output-contract -->
## 4. OUTPUT CONTRACT

The scorer emits JSON with:
- `status`
- `profileId`
- `family`
- `target`
- `candidate`
- `baseline`
- `totals`
- `delta`
- `recommendation`
- `checks`
- `reasons`

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

### Dynamic Mode Output (additional fields)

When `--dynamic` is used, the scorer additionally emits:
- `evaluationMode`: `"dynamic-5d"`
- `dimensions`: array of 5 dimension objects, each with `name`, `score`, `weight`, `details`
- `legacyScore`: legacy scorer result (only for handover/context-prime targets)
- `recommendation`: `"candidate-acceptable"` or `"needs-improvement"` (based on weighted score >= 70)

---

<!-- /ANCHOR:output-contract -->
<!-- ANCHOR:rubric -->
## 5. RUBRIC

### 5-Dimension Rubric (dynamic mode)

| Dimension | Weight | What It Checks |
| --- | --- | --- |
| Structural Integrity | 0.20 | Agent template compliance (CORE WORKFLOW, OUTPUT VERIFICATION, ANTI-PATTERNS, CAPABILITY SCAN, RULES, RELATED RESOURCES sections) |
| Rule Coherence | 0.25 | ALWAYS/NEVER/ESCALATE IF rules align with workflow steps and instructions; keyword match against the agent's own stated rules |
| Integration Consistency | 0.25 | Runtime mirrors in sync, commands reference agent, skills reference agent; scored via `scan-integration.cjs` (mirror 60%, command 20%, skill 20%) |
| Output Quality | 0.15 | Output verification checklist items present in instructions; no placeholder content ([TODO], [TBD], [YOUR_VALUE_HERE]) |
| System Fitness | 0.15 | Permission-capability alignment (no tools listed but denied); resource references valid (commands and skills exist); frontmatter completeness (name, mode, permission) |

### Legacy Prompt-Surface Rubric (static profiles)

| Dimension | Weight | What It Checks |
| --- | --- | --- |
| Structure | 0.30 | Required sections and target-specific prompt anchors |
| Safety | 0.25 | Read-only or no-fabrication rules, no nested dispatch, bounded scope |
| Scope | 0.20 | Candidate stays inside the declared target and manifest boundary |
| Operability | 0.15 | Concrete instructions, explicit source reads, and reusable operator-facing sections such as verification or related resources |
| Simplicity | 0.10 | Avoids redundant or conflicting directives |

### Benchmark Rubric

| Dimension | Weight | What It Checks |
| --- | --- | --- |
| Structure | 0.45 | Required headings or sections appear in the output |
| Grounding | 0.35 | Required file, command, or context references appear |
| Cleanliness | 0.20 | Placeholders and forbidden patterns are absent |
| Integration | optional | Mirror parity, command alignment, skill coverage (via `--integration-report`) |

---

<!-- /ANCHOR:rubric -->
<!-- ANCHOR:rejection-and-failure -->
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

<!-- /ANCHOR:rejection-and-failure -->
<!-- ANCHOR:related-resources -->
## 7. RELATED RESOURCES

- `benchmark_operator_guide.md`
- `promotion_rules.md`
- `no_go_conditions.md`
- `../scripts/score-candidate.cjs`
- `../scripts/scan-integration.cjs`
- `../scripts/generate-profile.cjs`

<!-- /ANCHOR:related-resources -->
