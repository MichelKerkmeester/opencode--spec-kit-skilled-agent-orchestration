---
title: "Decision Record: 013 - Deprecate Skill Graph and [001-deprecated-skill-graph-experiment/decision-record]"
description: "The previous phase removed most SGQS/readme-indexing behavior, but completion still required proof that target surfaces were fully clear. Leaving any residual references in sour..."
trigger_phrases:
  - "decision"
  - "record"
  - "013"
  - "deprecate"
  - "skill"
  - "decision record"
  - "001"
  - "deprecated"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: 013 - Deprecate Skill Graph and README/Skill-Ref Indexing (Completion Pass 2)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Complete Removal of SGQS and README/Skill-Ref Indexing Contract Surfaces

<!-- ANCHOR:adr-001-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-21 |
| **Deciders** | Phase 013 implementation owner |

### Context

The previous phase removed most SGQS/readme-indexing behavior, but completion still required proof that target surfaces were fully clear. Leaving any residual references in source or workflow assets keeps contract ambiguity and maintenance drag.

### Constraints

- Removal evidence must cover command/skill/agent/mcp_server target paths.
- Completion proof must include compile and full-suite test gates.
- Documentation artifacts must remain scoped to this `013` folder.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: to treat this pass as strict completion closure and require evidence-backed confirmation that SGQS/readme-indexing/skill-ref contract surfaces are gone.

**How it works**: run source sweeps and quality gates, then capture exact results in checklist/spec/summary artifacts. Deprecation claims are accepted only when evidence is explicit.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Evidence-backed closure (chosen)** | High confidence, auditable, low ambiguity | More documentation work | 9/10 |
| Implicit closure from prior phase | Faster | Leaves residual risk and unclear release state | 4/10 |
| Partial spot checks only | Less effort | Easy to miss stale references | 5/10 |

**Why this one**: completion for a cross-cutting deprecation needs explicit proof, not inferred state.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Release status becomes auditable and reproducible.
- Deprecated surfaces are less likely to reappear via stale docs or scripts.

**What it costs**:

- Additional completion documentation overhead. Mitigation: use standardized Level 3 templates.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hidden reference missed by pattern list | M | Use multiple terms and path families in scans |
| Test gate varies by env | M | Document stable command context used for pass proof |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Completion proof was explicitly requested |
| 2 | **Beyond Local Maxima?** | PASS | Compared implicit vs explicit closure |
| 3 | **Sufficient?** | PASS | Evidence + validation fully closes phase |
| 4 | **Fits Goal?** | PASS | Directly supports deprecation completion |
| 5 | **Open Horizons?** | PASS | Lowers long-term contract drift |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- Recorded compile/test gates and forbidden-term scan outputs.
- Recorded command cleanup, README TOC anchors, and residual MCP rename cleanup.
- Created full Level 3 completion artifact set.

**How to roll back**: if evidence is invalidated, reopen the phase, update source/doc cleanup, and rerun all verification commands.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Preserve Causal Graph Features While Deprecating SGQS and README/Skill-Ref Indexing

<!-- ANCHOR:adr-002-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-21 |
| **Deciders** | Phase 013 implementation owner |

### Context

The deprecation targets SGQS and README/skill-ref/workflows asset indexing, not the core causal graph capabilities used in supported retrieval paths. Removing too broadly would regress active functionality.

### Constraints

- Keep causal edge and causal retrieval pathways intact.
- Remove only deprecated SGQS/readme-indexing/skill-ref surfaces.
- Clarify boundary in final documentation.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: to explicitly preserve causal graph features and only deprecate SGQS/readme-indexing/skill-ref surfaces.

**How it works**: completion docs and scans focus on removed terms and pathways, while ADR language and symbol checks confirm causal graph support remains.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Targeted deprecation with causal retention (chosen)** | Meets scope exactly, avoids functional regression | Requires careful boundary wording | 9/10 |
| Remove all graph-related functionality | Simplifies surface area | Breaks supported causal features | 2/10 |
| Keep SGQS but hide docs references | Lower immediate churn | Contract remains inconsistent | 3/10 |

**Why this one**: it is the only option that satisfies deprecation scope without damaging supported behavior.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:

- Deprecated SGQS/readme-indexing paths are fully retired.
- Supported causal graph behavior remains stable and intentional.

**What it costs**:

- Boundary checks add review overhead. Mitigation: explicit ADR + checklist evidence.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future contributors conflate SGQS and causal graph | M | Keep explicit distinction in spec/ADR/checklist |
| Overly broad future cleanup proposals | M | Require boundary statement in future deprecation specs |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Required to avoid accidental feature removal |
| 2 | **Beyond Local Maxima?** | PASS | Considered broader removal and rejected it |
| 3 | **Sufficient?** | PASS | Boundary is clear and verifiable |
| 4 | **Fits Goal?** | PASS | Matches explicit scope statement |
| 5 | **Open Horizons?** | PASS | Reduces deprecation regression risk |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:

- Added explicit boundary language to completion artifacts.
- Recorded symbol-level evidence for `MemoryGraphLike` cleanup without SGQS residue.
- Aligned checklist acceptance with retained causal functionality.

**How to roll back**: remove ADR boundary only if product direction changes and a new approved spec replaces current scope.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Keep Dist Runtime Assets in Place for Test Stability

<!-- ANCHOR:adr-003-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-21 |
| **Deciders** | Phase 013 implementation owner |

### Context

After mcp_server dist rebuild, tests rely on runtime assets under `dist/database` and `dist/configs/search-weights.json`. Missing assets can cause false-negative test behavior that is unrelated to deprecation correctness.

### Constraints

- Preserve test runtime parity.
- Keep evidence traceable to concrete file paths.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: to keep required dist runtime assets restored and record that state in completion evidence.

**How it works**: verification captures directory/file existence in checklist evidence alongside compile/test outcomes.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Restore and verify required dist assets (chosen)** | Stable tests, clear proof | Minor asset maintenance overhead | 8/10 |
| Ignore dist asset state | Less work now | Risk of flaky/invalid test outcomes | 3/10 |
| Remove dist dependency from tests immediately | Long-term clean | Out of scope for this completion pass | 5/10 |

**Why this one**: it gives reliable completion verification within current scope.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:

- Test results are meaningful for closure.
- Runtime expectations are explicit in docs.

**What it costs**:

- Dist artifacts must be tracked during completion. Mitigation: include direct path evidence.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Asset drift between environments | M | Record explicit path checks in checklist |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Required for stable tests |
| 2 | **Beyond Local Maxima?** | PASS | Considered ignoring assets and rejected |
| 3 | **Sufficient?** | PASS | Path existence checks cover the need |
| 4 | **Fits Goal?** | PASS | Supports completion verification |
| 5 | **Open Horizons?** | PASS | Documents reproducibility expectations |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:

- Documented that `dist/database` and `dist/configs/search-weights.json` are restored.
- Linked asset state to checklist and implementation summary.

**How to roll back**: if future architecture removes dist runtime dependency, supersede this ADR in a new phase.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
