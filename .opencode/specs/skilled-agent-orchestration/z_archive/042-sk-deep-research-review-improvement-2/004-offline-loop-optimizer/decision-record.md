---
title: "Decis [skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer/decision-record]"
description: "Accepted architecture decision for the offline replay optimizer and its advisory promotion boundary."
trigger_phrases:
  - "042.004"
  - "decision record"
  - "offline loop optimizer"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["decision-record.md"]
---
# Decision Record: Offline Loop Optimizer

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Ship deterministic offline config optimization first and keep promotion advisory-only

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-11 |
| **Deciders** | Packet 042 closeout |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed a safe way to improve deep-loop runtime configs using real traces, but the repo did not yet have the replay fixtures, behavioral suites, or multi-family corpus coverage needed for broad prompt or meta-optimization. The phase had to produce real value now without pretending the wider optimizer vision was already safe, and it had to stop the optimizer from mutating locked contract fields or applying production config changes directly.

### Constraints

- Production configs could not be mutated directly by the new optimizer.
- Prompt optimization could not edit canonical agent markdown files directly.
- Promotion had to fail closed when prerequisite replay or behavior evidence was missing.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: deliver Phase 4a as a deterministic offline config optimizer now, keep Phase 4b prompt/meta optimization explicitly deferred, and bound all current promotion output to advisory-only candidate patches or reports.

**How it works**: Phase 4a focuses on corpus extraction, rubric scoring, deterministic replay, bounded numeric search, audit output, and advisory patch generation. Search can mutate only optimizer-managed numeric fields declared in the manifest, and promotion refuses direct production mutation until stronger replay and behavioral gates exist and pass.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Deterministic config optimization now with advisory-only promotion** | Delivers real value with a clear safety envelope | Leaves some ambitious optimization ideas intentionally deferred and still requires human review | 9/10 |
| Build prompt and meta optimization immediately | Bigger theoretical upside | Unsafe without replay fixtures, behavioral suites, and multi-family data | 3/10 |
| Direct production mutation after replay score improvement | Fastest path to applied tuning | Too risky without stronger replay and behavioral validation | 2/10 |

**Why this one**: It captures the part of the optimizer story that is already supportable by repo evidence while keeping the rest clearly fenced off.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The packet gets a realistic replay-based improvement loop immediately.
- Candidate tuning remains reviewable, explainable, and rollback-friendly.
- Non-tunable contract fields are protected by an explicit manifest boundary.

**What it costs**:
- Phase 4b remains visibly deferred and humans still need to review accepted candidates. Mitigation: keep the prerequisites and audit outputs explicit.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Deferred scope is mistaken for unfinished delivery | M | Keep Phase 4a and Phase 4b language explicit in all phase docs |
| Replay-based tuning is over-trusted without broader validation | H | Keep outputs advisory only until stronger gates exist |
| Search tries to mutate locked fields | H | Enforce the manifest boundary in both search and promotion |
| Advisory candidates are treated as production-ready anyway | H | Make advisory-only status explicit across spec, plan, tasks, checklist, and implementation summary |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The phase needed a safe near-term optimizer story |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives include immediate broader optimization and direct production mutation |
| 3 | **Sufficient?** | PASS | Deterministic config tuning with advisory output is enough for the current phase |
| 4 | **Fits Goal?** | PASS | The decision stays aligned with offline replay and advisory maintenance work |
| 5 | **Open Horizons?** | PASS | Phase 4b remains documented for later expansion once prerequisites exist |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Build replay corpus, rubric, replay runner, search, promotion, and manifest surfaces for deterministic config tuning
- Keep prompt/meta work documented as deferred future scope
- Emit advisory reports and patch artifacts with full replay and rubric context

**How to roll back**: Stop using the optimizer outputs, refuse all promotion output, keep canonical configs unchanged, and preserve advisory reports for audit/debugging.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
