<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
---
title: "Phase Parent Spec: 062 — Deep-Loop Command-Flow Stress Tests"
description: "Phase-parent root spec. Apply the 060/004 command-flow stress methodology (proven PASS 6/0/0 against @improve-agent) to @deep-research and @deep-review. These are LEAF agents whose discipline lives in their command orchestrators (`/spec_kit:deep-research`, `/spec_kit:deep-review`) — same architecture as @improve-agent, flagged in 060/spec.md as same-architecture follow-on candidates."
trigger_phrases:
  - "062 root"
  - "062 phase parent"
  - "deep-loop stress tests"
  - "deep-research command-flow stress"
  - "deep-review command-flow stress"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/062-deep-loop-command-flow-stress-tests"
    last_updated_at: "2026-05-02T19:30:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Scaffolded 4-phase parent + per-agent sub-phases"
    next_safe_action: "Pick a sub-phase and dispatch CP-scenario authoring"
    blockers: []
    key_files:
      - .opencode/specs/skilled-agent-orchestration/062-deep-loop-command-flow-stress-tests/spec.md
    completion_pct: 0
    open_questions:
      - "Run sub-phases sequentially (research first, then review) or in parallel?"
      - "Use cli-copilot like 060/004, or try cli-codex for variance?"
    answered_questions: []
---

# Phase Parent Spec: 062 — Deep-Loop Command-Flow Stress Tests

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_PHASE_PARENT: true -->

---

<!-- ANCHOR:purpose -->
## ROOT PURPOSE

In packet 060/004 we proved that `@improve-agent`'s discipline lives in its command orchestrator (`/improve:agent`), not in the agent body. The 060/002 same-task A/B prepend-body stress scored **0/2/4** because we tested the wrong layer. Restructuring to per-CP layer partition (some scenarios test command-flow, some body-level) produced final composite **PASS 6 / PARTIAL 0 / FAIL 0** by R3.

**`@deep-research` and `@deep-review` have the SAME ARCHITECTURE as `@improve-agent`**:
- Each is a LEAF agent dispatched ONLY by its command (`/spec_kit:deep-research`, `/spec_kit:deep-review`)
- The command orchestrator owns iteration state, convergence detection, journal events, gate evaluation, and stop reasons
- The agent body is intentionally thin — executes one iteration, writes findings, returns

This packet applies the proven 060/004 methodology to both agents. Per 060/spec.md open questions, this was flagged as a same-architecture follow-on:

> "Should @deep-research and @deep-review get their own command-flow stress packets? (Same architecture as @improve-agent — flagged in 003 research §6)"
<!-- /ANCHOR:purpose -->

---

<!-- ANCHOR:phases -->
## PHASES

| # | Folder | Target | Purpose | Status |
|---|---|---|---|---|
| **001** | `001-deep-research-cp-scenarios/` | `/spec_kit:deep-research` + `@deep-research` | Author 6 CP-XXX scenarios for `@deep-research` command flow + author per-CP signal contracts (per the 13-question authoring preflight from 060/003) | planned |
| **002** | `002-deep-research-stress-runs/` | Same | Run R1 stress against authored scenarios; iterate to PASS using 060/004's R1→R2→R3 pattern | planned |
| **003** | `003-deep-review-cp-scenarios/` | `/spec_kit:deep-review` + `@deep-review` | Same as 001 but for `@deep-review` | planned |
| **004** | `004-deep-review-stress-runs/` | Same | Same as 002 but for `@deep-review` | planned |

**Reference packets:**
- `../060-sk-agent-improver-test-report-alignment/004-improve-agent-command-flow-stress-tests/` — methodology source (PASS 6/0/0 final)
- `../060-sk-agent-improver-test-report-alignment/003-followup-research/research/research.md` §7 — 11-dimension rubric + 13-question authoring preflight
- `../060-sk-agent-improver-test-report-alignment/003-followup-research/research/research.md` §6 — meta-agent audit classifying @deep-research + @deep-review as same-architecture
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:approach -->
## APPROACH (per agent — applies to both 001-002 and 003-004 pairs)

Adapted from 060/004 + 060/005 patterns:

### Sub-phase A (CP-scenario authoring)

1. **Read 060/003 §7** — apply the 13-question authoring preflight to the new agent's command surface
2. **Author 6 CP-XXX scenarios** — mix of command-flow (most) + body-level (where applicable). Each scenario is a self-contained `.md` in `.opencode/skill/sk-deep-{review,research}/manual_testing_playbook/0X--*/`
3. **Define per-CP signal contracts** — what file:line / journal event / artifact must exist after each scenario runs
4. **Sandbox helper** — `setup-cp-sandbox.sh` per agent, builds isolated `/tmp/cp-NNN-sandbox/` with command-capable temp project root
5. **Validation gates** — like 060/004 had 5 verification gates A-E, define equivalents

### Sub-phase B (stress-run iteration)

6. **R1 stress** — extract bash blocks from each CP-XXX, run sequentially, score grep-only (per-field-counts file pattern)
7. **Triage results** into 5 buckets (PASS / PARTIAL / FAIL with each subcategory)
8. **R2 with targeted edits** between rounds (per ADR-4 score-progression discipline from 060/004)
9. **R3 if needed** — final composite target: PASS 6 / PARTIAL 0 / FAIL 0
10. **Test report** mirroring 060/004/test-report.md structure
<!-- /ANCHOR:approach -->

---

<!-- ANCHOR:scope -->
## SCOPE

### In Scope
- 4 sub-phases (CP authoring + stress runs for each of 2 agents)
- New CP-XXX scenarios in sk-deep-review and sk-deep-research manual_testing_playbook
- Per-agent setup-cp-sandbox.sh helpers
- Per-agent test reports
- Updates to sk-deep-research and sk-deep-review SKILL.md if findings reveal documented contract gaps

### Out of Scope
- Body-only improvements to `@deep-research` and `@deep-review` agent files (already done in 061/008 + 061/009 promotion)
- Changes to the `improve-agent` substrate (locked at 060/005 wiring)
- Cross-cutting enhancements to other agents (each has its own packet path)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:success-criteria -->
## SUCCESS CRITERIA

- Both 001 and 003 produce 6 well-formed CP-XXX scenarios passing the 13-question authoring preflight
- Both 002 and 004 reach final composite PASS 6 / PARTIAL 0 / FAIL 0 within 3 rounds (R1→R2→R3)
- Per-agent test-report.md authored with same structure as 060/004
- Any documented contract gaps in sk-deep-research / sk-deep-review SKILL.md filled with concrete fixes
- All 4 sub-phases report `status=complete` `pct=100` in graph-metadata
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:reference -->
## REFERENCE PACKETS

- **060-sk-agent-improver-test-report-alignment** — methodology source. Re-read 060/004's spec, plan, tasks, test-report before starting each sub-phase.
- **060/003-followup-research/research/research.md** — 11-dim rubric + 13-question authoring preflight + meta-agent audit
- **060/004-improve-agent-command-flow-stress-tests** — concrete CP-040..045 scenarios that prove the methodology
- **061-agent-optimization/008-agent-deep-review** + **061/009-agent-deep-research** — recently-promoted body improvements that this packet's stress tests should respect
<!-- /ANCHOR:reference -->

---

<!-- ANCHOR:expected-results -->
## EXPECTED RESULT (campaign hypothesis)

If the 060/004 finding generalizes correctly, this packet should produce:

- **Per-CP layer partition** that 002 R1 surfaces as a real signal: command-flow scenarios will pass with substrate; body-level scenarios may show gaps that don't touch the body but instead reflect command-orchestrator wiring
- **Final composite PASS 6 / PARTIAL 0 / FAIL 0** for both agents, mirroring 060/004's R3 result
- **Reusable artifacts** worth promoting back to 060's reusable-artifacts list:
  - Updated 11-dim rubric tuned for autonomous-loop agents
  - Refined 13-question authoring preflight extending to deep-loop families
  - Cross-architecture audit (compare command-flow stress signals across @improve-agent / @deep-research / @deep-review)
<!-- /ANCHOR:expected-results -->
