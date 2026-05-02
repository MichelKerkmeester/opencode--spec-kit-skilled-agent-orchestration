<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
---
title: "Implementation Plan: 060/002 — Stress-Test Implementation"
description: "5-stage plan: scaffold + design fixture, author scenarios, apply diffs, run multi-round stress tests, produce test-report."
trigger_phrases:
  - "060/002 plan"
  - "stress test implementation plan"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation"
    last_updated_at: "2026-05-02T11:42:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Phase plan authored"
    next_safe_action: "User approval; then begin Stage 1"
    blockers: []
    key_files: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

# Implementation Plan: 060/002 — Stress-Test Implementation

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Five stages, executed sequentially. Test-first ordering per ADR-2: scenarios + fixture come before source-file diffs so the verification gates exist before the changes they verify.

| Stage | Output | Wall-time est |
|---|---|---|
| 1. Scaffold + fixture design | 8 markdown + 2 JSON; fixture-target spec | ~30 min |
| 2. Author 6 CP-XXX scenarios | 6 playbook files + root index updates | ~45 min (cli-codex authoring) |
| 3. Apply 5 P0 + 1 P1 diff sketches | 5+1 source files modified + 4-runtime mirror | ~30 min |
| 4. Multi-round stress runs | R0 baseline + R1 stress (+ R2/R3 if needed) | ~30-60 min cli-copilot |
| 5. Test-report.md + close-out | test-report.md + implementation-summary update | ~20 min |

**Total:** ~3 hours wall-time est (some parallelizable via cli-codex for stage 2).
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:phase-1 -->
## 2. STAGE 1 — SCAFFOLD + FIXTURE DESIGN

1. Author 8 markdown files at `002-stress-test-implementation/` (this stage in progress)
2. Bootstrap `description.json` + `graph-metadata.json` via `generate-context.js`
3. Strict-validate the spec folder
4. Read `001/research/research.md` §6 fully — extract fixture-target requirements
5. Decide fixture path (likely `.opencode/skill/sk-improve-agent/test-fixtures/060-stress-test/`)
6. Author fixture spec doc inside the fixture folder (what flaws, what scoring rubric expectations)

**Stage 1 acceptance:** strict-validate exits 0 (or fails only on known template-shape errors); fixture-target design doc exists.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## 3. STAGE 2 — AUTHOR 6 CP-XXX SCENARIOS

Use cli-codex (gpt-5.5 high fast) to author the 6 scenarios in parallel-friendly fashion. Pattern from 059: dispatch a single codex call with the full scenario spec list and have codex author all 6 files.

Files to create (using next available CP numbers under `04--agent-routing/`):

- `013-skill-load-not-protocol.md` (CP-040)
- `014-proposal-only-boundary.md` (CP-041)
- `015-active-critic-overfit.md` (CP-042)
- `016-legal-stop-gate-bundle.md` (CP-043)
- `017-improvement-gate-delta.md` (CP-044)
- `018-benchmark-completed-boundary.md` (CP-045)

Update root index (`manual_testing_playbook.md` §10 + §16) for the 6 new entries.

**Stage 2 acceptance:** 6 files exist with CP-027-format compliance (frontmatter, Overview, Why This Matters, Scenario Contract, Test Execution sections); root index updated.

**Pre-answer Gate 3 in codex prompt** per memory rule (`Gate 3: Option D — skip` to avoid the spec-folder refusal that bit packet 059's first dispatch).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## 4. STAGE 3 — APPLY DIFF SKETCHES

Apply diffs in order of dependency (per 001/research §1 ordered evidence chain):

### Sub-stage 3a: Mirror inventory truth (P1 first to ground integration scoring)
- `scan-integration.cjs` — fix `.gemini/agents` mirror path constant

### Sub-stage 3b: Baseline/delta truth (P0)
- `score-candidate.cjs` — actually consume `--baseline`, emit `delta` field

### Sub-stage 3c: Benchmark/legal-stop emissions (P0)
- `improve_improve-agent_auto.yaml` + `confirm.yaml` — emit `legal_stop_evaluated` with 5-gate bundle
- (also add `benchmark_completed` event if 001/research §3 RQ-3 specifies)

### Sub-stage 3d: Active CRITIC pass (P0)
- `improve-agent.md` — add §6.5 CRITIC PASS bullets per 001/research §5
- Mirror to `.claude/agents/`, `.gemini/agents/`, `.codex/agents/` (4-runtime sync)

### Sub-stage 3e: Skill-load clarification (P0)
- `SKILL.md` — add explicit clarification that `Read(SKILL.md)` is never proof of protocol execution

**Stage 3 acceptance:** all 6 changes in place; grep verifies each anchor; 4-runtime mirror parity for agent edits.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## 5. STAGE 4 — MULTI-ROUND STRESS RUNS

Mirror 059's R0 → R1 → R2 progression.

### R0 — Multi-model baseline
- Run 1 scenario (CP-040 SKILL_LOAD_NOT_PROTOCOL) across cli-copilot under gpt-5.5 + opus-4.7 (and sonnet-4.6 if budget allows)
- Verify the structural envelope renders cross-model
- Output: 2-3 transcripts; envelope-compliance verdict

### R1 — Full stress run
- Run all 6 scenarios (CP-040..CP-045) sequentially via cli-copilot gpt-5.5
- Capture grep-checkable signals (RETURN fields, sandbox diffs, tripwire diffs, journal events)
- Output: 6 PASS/PARTIAL/FAIL verdicts

### R2/R3 — Targeted fixes (if R1 surfaces gaps)
- For each PARTIAL or FAIL, apply targeted edits to the related triad/script section
- Re-run only the affected scenarios
- Repeat until score reaches 6/0/0 OR R3 documents honest remaining gaps

**Stage 4 acceptance:** R0 + R1 transcripts on disk; if R2/R3 needed, score progression documented; final score reaches target OR honest gaps documented for follow-on packet.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## 6. STAGE 5 — TEST-REPORT.MD + CLOSE-OUT

1. Author `002-stress-test-implementation/test-report.md` mirroring 059's structure:
   - Frontmatter with `_memory.continuity`
   - 11 sections matching 059's anchors (executive summary, methodology, R0-R3 narratives, total damage, lessons, artifacts, next steps)
   - Transcript pull-quotes at the turn-around moments (per 059 §9 L2 wisdom)
2. Update `implementation-summary.md` with final score + RQ-by-RQ outcomes
3. Update `handover.md` with packet close-out + any follow-on packet hand-off
4. Run `/memory:save` to refresh continuity surfaces
5. Optionally commit + push if user directs

**Stage 5 acceptance:** test-report.md exists; implementation-summary updated to completion_pct=100.
<!-- /ANCHOR:phase-5 -->
