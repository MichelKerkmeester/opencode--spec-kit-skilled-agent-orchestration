---
# SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2
title: "Decision Record: Code Graph and Skill Advisor Refinement Research"
description: "Decision record for the research methodology and scope choices governing packet 015."
trigger_phrases:
  - "code graph advisor refinement decisions"
  - "026/009/015 decision record"
  - "015 adr"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "scaffold-pass"
    recent_action: "Created decision-record.md with ADR-001"
    next_safe_action: "Run /spec_kit:deep-research:auto for 20 iterations"
    blockers: []
    key_files: ["decision-record.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session-015"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Decision Record: Code Graph and Skill Advisor Refinement Research

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use `/spec_kit:deep-research:auto` for All 20 Iterations

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-24 |
| **Deciders** | User (packet owner) |

---

<!-- ANCHOR:adr-001-context -->
### Context

This research initiative requires 20 investigation iterations across two complex systems. We needed to choose between running iterations manually (ad hoc file reads and notes), managing state in a custom script, or using the skill-owned `/spec_kit:deep-research:auto` workflow. The choice affects auditability, convergence detection, context isolation between iterations, and alignment with the Gate 4 policy that governs iterative investigation loops of this scale.

### Constraints

- Gate 4 policy (CLAUDE.md §2 Gate 4) mandates skill-owned workflow for any iterative investigation loop greater than 5 iterations
- Each iteration must run with fresh context to avoid context contamination across 20 iterations
- Findings must be externalized in a machine-readable format (`deep-research-state.jsonl`, `findings-registry.json`) for convergence detection
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Use `/spec_kit:deep-research:auto` as the canonical entry point for all 20 iterations, with the `research/` subfolder created and managed by the skill's state machine.

**How it works**: The user invokes `/spec_kit:deep-research:auto` targeting this spec folder. The skill's state machine manages `deep-research-state.jsonl`, dispatches `@deep-research` leaf agents one iteration at a time (each with fresh context), tracks delta findings in `findings-registry.json`, and detects convergence. The research strategy is read from the deep-research-strategy file which the skill auto-creates on first invocation, seeded by the research questions in this packet's `spec.md`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`/spec_kit:deep-research:auto`** | Skill-owned state, convergence detection, Gate 4 compliant, per-iteration fresh context, auditable JSONL trail | Requires skill invocation; no inline ad hoc pivots | 9/10 |
| Manual ad hoc iterations | Maximum flexibility, no overhead | No convergence detection, no state machine, context contamination across iters, not Gate 4 compliant | 3/10 |
| Custom script with `/tmp` state | Some automation | Gate 4 explicitly forbids manually managing iteration state outside skill's `research/` folder | 1/10 |

**Why this one**: Gate 4 policy eliminates the manual and custom-script options. The skill-owned workflow is the only compliant path and also provides the best operational properties (fresh context, convergence detection, machine-readable state).
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Full auditability: every iteration produces a markdown file and a JSONL delta entry
- Convergence detection prevents wasted iterations if findings plateau before iteration 20
- Fresh context per iteration prevents the research agent from anchoring on early conclusions

**What it costs**:
- Cannot pivot mid-loop without stopping and restarting the skill; research questions must be well-framed before invocation. Mitigation: the spec.md §5 research questions are written precisely enough to guide the loop without mid-loop changes.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Research questions too broad for 20 iterations | M | Phase structure (Discovery / Deep-Dive / Synthesis) channels iteration focus |
| Convergence detected early (before iter 20) | L | Remaining budget spent on synthesis quality rather than new questions |
| Loop exits on max-iterations without full convergence | M | Manual review of `findings-registry.json`; extend with a follow-up batch if needed |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Gate 4 policy mandates skill-owned workflow for >5 iteration loops |
| 2 | **Beyond Local Maxima?** | PASS | Three options considered; manual alternatives explicitly excluded by Gate 4 |
| 3 | **Sufficient?** | PASS | The skill handles state, convergence, and context isolation — no gaps |
| 4 | **Fits Goal?** | PASS | Research synthesis is exactly what the deep-research skill is designed to produce |
| 5 | **Open Horizons?** | PASS | Follow-up iteration batches are possible if 20 iters leave gaps |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- User invokes `/spec_kit:deep-research:auto` after this spec folder is validated
- The skill auto-creates `research/` with deep-research-strategy.md, deep-research-state.jsonl, findings-registry.json, and per-iteration markdown files

**How to roll back**: If the loop produces unhelpful output after the first few iterations, stop the loop, review research/iterations/ from the earliest iteration through the latest, and either refine the research questions in `spec.md` and restart, or switch to a manual synthesis pass using the iteration files already produced.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
