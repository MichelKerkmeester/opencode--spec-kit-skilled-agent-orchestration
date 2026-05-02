<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
---
title: "Implementation Plan: 060 — sk-improve-agent Test-Report Alignment"
description: "Two-phase plan: (1) scaffold + bootstrap spec metadata; (2) dispatch 10-iter deep-research via cli-copilot/gpt-5.5. Phase 3 (implementation) is signposted but explicitly out of scope, deferred to packet 061."
trigger_phrases:
  - "060 plan"
  - "sk-improve-agent research plan"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/001-deep-research-recommendations"
    last_updated_at: "2026-05-02T10:50:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Phase plan authored"
    next_safe_action: "Bootstrap JSON metadata; strict-validate; dispatch deep-research"
    blockers: []
    key_files: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

# Implementation Plan: 060 — sk-improve-agent Test-Report Alignment

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This packet has two execution phases. **Phase 1** is scaffolding: write the 8 markdown files, bootstrap the 2 JSON metadata files, and pass strict-validate. **Phase 2** is the actual research: dispatch `/spec_kit:deep-research:auto` and let it run to convergence or 10 iterations. **Phase 3** is explicitly *not* part of 060 — it is the implementation work that becomes packet 061.

Total wall time estimate: **15-25 minutes** (Phase 1 ≈ 2 min, Phase 2 ≈ 8-15 min, plus monitoring + post-synthesis update).
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1 — SPEC SCAFFOLD + METADATA BOOTSTRAP

### Steps

1. **Create 8 markdown files** at `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/`:
   - `spec.md` (this packet's authority)
   - `plan.md` (this file)
   - `tasks.md`
   - `checklist.md`
   - `decision-record.md`
   - `implementation-summary.md` (placeholder per memory rule)
   - `handover.md`
   - `resource-map.md`

2. **Bootstrap JSON metadata** via `generate-context.js`:
   ```bash
   node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
     --json '{"specFolder":"specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/001-deep-research-recommendations","sessionId":"..."}' \
     specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment
   ```
   Produces: `description.json`, `graph-metadata.json`. Also writes a memory entry pointing at the new packet.

3. **Strict-validate**:
   ```bash
   bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
     specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment --strict
   ```
   Expected: exit 0.

### Outputs

- 8 markdown files at packet root
- 2 JSON metadata files (description.json, graph-metadata.json)
- Strict-validate green

### Phase 1 acceptance

✓ Files present, strict-validate exits 0, frontmatter parses, ANCHOR pairs balanced.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2 — DEEP-RESEARCH DISPATCH

### Steps

1. **Pre-flight verify** `~/.copilot/settings.json` has `effortLevel: "high"` (already confirmed in plan-mode pre-flight).

2. **Dispatch the deep-research workflow**:
   ```bash
   /spec_kit:deep-research:auto \
     --spec-folder=specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment \
     --executor=cli-copilot \
     --model=gpt-5.5 \
     --max-iterations=10
   ```

   **Topic body** (passed during setup phase or pre-bound via spec.md research questions):
   > Research how to improve the sk-improve-agent triad — `.opencode/skill/sk-improve-agent/SKILL.md`, `.opencode/agent/improve-agent.md`, `.opencode/command/improve/agent.md` — by applying the testing methodology from packet 059 (`@code` stress-test campaign documented in `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/test-report.md`). Use the 7 research questions in this packet's spec.md §5 as the iteration anchors. Target output: `research/research.md` with gap analysis, sketched stress-test scenarios in CP-XXX format, prioritized diff sketches, and a recommended fixture-target design for the eventual implementation packet (061).

3. **Monitor convergence** by watching:
   - `research/iterations/iteration-NNN.md` files appearing
   - `research/deep-research-state.jsonl` for convergence signal
   - `research/deep-research-dashboard.md` for live status
   - Intervene only on dispatch errors (not per-iteration content quality — convergence handles that)

4. **Verify synthesis** — once the workflow completes, `research/research.md` should exist with the section structure listed in spec.md §6.

### Phase 2 acceptance

✓ research/research.md exists with all sections from spec.md §6, ✓ at least 1 iteration ran (ideally 5-10 before convergence), ✓ no dispatch errors in logs.

### Why these flags (cross-ref decision-record ADRs 1-2)

- `--executor=cli-copilot` — matches 059's known-good executor
- `--model=gpt-5.5` — same model that ran CP-026 through CP-034
- `--max-iterations=10` — convergence will short-circuit if findings stabilize earlier
- `--reasoning-effort` and `--service-tier` **OMITTED** — they fail `parseExecutorConfig` for cli-copilot. Reasoning is set via `~/.copilot/settings.json:effortLevel`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3 — OUT OF SCOPE (Signposted Only)

After 060's `research/research.md` converges, packet **061** will:

- Apply the diff recommendations to the 3 target files (SKILL.md, improve-agent.md, improve/agent.md)
- Promote the sketched CP-XXX scenarios to real playbook entries under `.opencode/skill/cli-copilot/manual_testing_playbook/`
- Run multi-round stress tests against the improved triad (target: PASS/PARTIAL/FAIL score progression, 059-style)
- Produce `test-report.md` for sk-improve-agent in 061's spec folder

**Nothing from this list is in 060's scope.** This signpost exists so the research findings know what their downstream consumer looks like.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:post-execution -->
## 5. POST-EXECUTION

After Phase 2 converges:

1. Update `implementation-summary.md`:
   - completion_pct = 100
   - recent_action = "Research synthesis complete; X iterations run; recommendations cited"
   - next_safe_action = "Hand off to packet 061 for implementation"
2. Update `handover.md` with the continuation prompt for packet 061
3. Run `/memory:save` to refresh continuity surfaces
4. (Optional) Commit + push to main if user directs
<!-- /ANCHOR:post-execution -->
