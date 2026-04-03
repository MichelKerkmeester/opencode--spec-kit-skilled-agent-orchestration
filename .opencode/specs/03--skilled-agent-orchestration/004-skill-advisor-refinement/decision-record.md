---
title: "Decision Record: Skill Advisor Refinement [template:level_3/decision-record.md]"
description: "Architecture and policy decisions for routing quality and performance refinements in skill advisor workflow."
trigger_phrases:
  - "skill advisor adr"
  - "confidence override"
  - "command bridge ranking"
  - "runtime cache"
importance_tier: "critical"
contextType: "planning"
---
# Decision Record: Skill Advisor Refinement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep uncertainty guard by default and add explicit confidence-only override

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-03 |
| **Deciders** | @speckit, skill advisor maintainers |

---

<!-- ANCHOR:adr-001-context -->
### Context

<!-- Voice guide: State the problem directly. "We needed to choose between X and Y because Z"
     not "A decision was required regarding the selection of an appropriate approach." -->

Explicit threshold use currently risks silently downgrading uncertainty safeguards. That behavior can over-route ambiguous prompts and reduce trust in Gate 2 decisions.

### Constraints

- Must keep backward-compatible CLI behavior for existing one-shot invocations.
- Must preserve clear operator escape hatch for advanced workflows.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Dual-threshold filtering remains the default in all normal invocations, and confidence-only behavior requires explicit `--confidence-only`.

**How it works**: The filter pipeline always evaluates confidence and uncertainty unless override flag is set. `--threshold` sets confidence cut-off but does not disable uncertainty guard. `--confidence-only` is the single opt-in switch for bypassing uncertainty.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Default dual-threshold + explicit override (chosen)** | Safe by default, explicit intent, auditable behavior | Adds one new flag to document | 9/10 |
| Threshold implies confidence-only | Simple mental model for some users | Hidden safety loss, higher ambiguous routing errors | 4/10 |

**Why this one**: It keeps default safety strong and still supports power-user control without ambiguity.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Fewer overconfident recommendations on ambiguous prompts.
- Clear policy contract between default mode and override mode.

**What it costs**:
- Slightly stricter default pass rate. Mitigation: provide clear CLI help and docs for `--confidence-only`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Users miss new override semantics | M | Update README and `--help` examples |
| Mis-implementation of flag precedence | H | Add regression cases for mode combinations |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Addresses safety regression risk directly |
| 2 | **Beyond Local Maxima?** | PASS | Compared implicit and explicit override designs |
| 3 | **Sufficient?** | PASS | One explicit flag is minimal change |
| 4 | **Fits Goal?** | PASS | Core requirement in optimization audit |
| 5 | **Open Horizons?** | PASS | Policy scales to future calibration tuning |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Modify filtering mode logic in `.opencode/skill/scripts/skill_advisor.py`.
- Add regression assertions for default and confidence-only behavior.

**How to roll back**: Revert filtering flag changes and restore prior mode selection branch; rerun baseline regression.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---


### ADR-002: Separate command bridges from real skills in ranking

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-03 |
| **Deciders** | @speckit, skill advisor maintainers |

---

### Context

Command bridges (`command-spec-kit`, `command-memory-save`) currently compete directly with real skills and can incorrectly outrank richer capabilities on natural-language prompts.

### Constraints

- Slash-command intent must still be supported quickly.
- Existing command bridge names should remain stable for compatibility.

---

### Decision

**We chose**: Model command bridges as a separate recommendation class and prefer real skills unless slash-command intent is explicit.

**How it works**: The scorer computes real-skill and command-bridge pools independently. Ranking merge applies real-skill priority unless input contains explicit slash command markers.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Separate pools with explicit slash exception (chosen)** | Better semantic routing, controllable fallback | Slightly more ranking logic | 9/10 |
| Keep single pool with minor penalties | Lower implementation effort | Hard to prevent edge mis-rankings | 6/10 |

**Why this one**: It makes intent handling explicit and testable.

---

### Consequences

**What improves**:
- Real skills rank first for plain-language requests.
- Slash-command prompts still route correctly.

**What it costs**:
- Additional classifier branch. Mitigation: small helper function plus regression fixtures.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Incorrect slash-intent detection | H | Add explicit and negative slash-intent fixtures |

---

### Implementation

**What changes**:
- Add bridge/real-skill classification metadata in runtime model.
- Update ranking merge logic and tests.

**How to roll back**: Revert pool separation and restore prior rank merge, then rerun regression baseline.


---



### ADR-003: Add per-process cache with mtime invalidation and precomputed metadata

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-03 |
| **Deciders** | @speckit, skill advisor maintainers |

---

### Context

Each request currently rescans skills and reprocesses metadata. This increases warm-call latency and adds repeated CPU cost.

### Constraints

- Cache must never serve stale data after SKILL.md edits.
- Keep implementation stdlib-only.

---

### Decision

**We chose**: Implement per-process cache keyed by file paths and mtimes, plus precomputed normalized metadata per skill.

**How it works**: Discovery runs once, stores skill records and normalized tokens. Each call checks mtimes and rebuilds only when changes are detected.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **In-process cache with mtime checks (chosen)** | Fast warm path, simple invalidation | Requires careful cache lifecycle | 9/10 |
| No cache | Simplest state model | Poor repeated-call latency | 3/10 |
| Persistent external cache | Fastest potential | Extra dependency and complexity | 5/10 |

**Why this one**: It meets latency goals without adding external systems.

---

### Consequences

**What improves**:
- Warm-call latency and throughput improve significantly.
- Scoring path avoids repeated normalization work.

**What it costs**:
- Cache invalidation logic maintenance. Mitigation: regression test with mtime mutation.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Missed invalidation after updates | H | Force mtime comparison each invocation |

---

### Implementation

**What changes**:
- Add `.opencode/skill/scripts/skill_advisor_runtime.py` for cache helpers.
- Update advisor load path to use cache API.

**How to roll back**: Bypass runtime cache module and restore direct discovery path.


---



### ADR-004: Add structural mode and permanent quality-performance harnesses

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-03 |
| **Deciders** | @speckit, skill advisor maintainers |

---

### Context

Repeated subprocess startup is expensive for bulk routing and there is no permanent measurable gate for preventing routing or latency regressions.

### Constraints

- Keep one-shot mode as backward-compatible default.
- Add verifiable metrics outputs suitable for local and CI use.

---

### Decision

**We chose**: Add structural mode (`--batch` and/or persistent mode) and ship dedicated regression plus benchmark scripts with fixed pass criteria.

**How it works**: Structural mode processes multiple prompts in one process lifecycle. Harness scripts run fixed datasets and emit machine-readable reports used by checklist gates.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Structural mode + harness scripts (chosen)** | Tangible performance gains and enforceable quality gates | More scripts to maintain | 9/10 |
| One-shot only + manual checks | Minimal implementation | No durable gate against regressions | 4/10 |

**Why this one**: It directly satisfies the audit requirement for measurable long-term quality and latency controls.

---

### Consequences

**What improves**:
- Throughput improves for repeated calls.
- Routing quality and performance become continuously measurable.

**What it costs**:
- Additional harness maintenance. Mitigation: keep fixtures compact and versioned.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Benchmark instability from environment noise | M | Use multi-run median and p95; compare relative deltas |

---

### Implementation

**What changes**:
- Extend advisor CLI for structural mode operation.
- Add `skill_advisor_regression.py` and `skill_advisor_bench.py` with dataset fixtures.

**How to roll back**: Remove structural mode flags and harness scripts, restore one-shot-only contract.


<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
