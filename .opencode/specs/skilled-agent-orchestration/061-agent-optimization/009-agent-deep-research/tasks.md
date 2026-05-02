---
title: "Tasks: @deep-research Agent Optimization"
description: "Sub-phase under 061-agent-optimization applying validated sk-improve-agent v2 substrate to @deep-research."
trigger_phrases:
  - "009-agent-deep-research"
  - "deep-research optimization"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/061-agent-optimization/009-agent-deep-research"
    last_updated_at: "2026-05-02T17:30:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Mark T-001 in_progress when work starts"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-061-2026-05-02"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: @deep-research Agent Optimization

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

- `[ ]` = pending; `[~]` = in-progress; `[x]` = done
- Phase 1 = profile + dispatch; Phase 2 = score/benchmark/promote; Phase 3 = mirror+verify
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

### T-001: Read target + scan integration surface
- `cat .opencode/agent/deep-research.md`
- `node .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs --agent=deep-research --output=<packet>/integration.json`

### T-002: Generate dynamic 5-dimension profile
- `node .opencode/skill/sk-improve-agent/scripts/generate-profile.cjs --agent=.opencode/agent/deep-research.md --output=<packet>/profile.json`

### T-003: Dispatch /improve:agent
- `/improve:agent .opencode/agent/deep-research.md :auto --spec-folder=specs/skilled-agent-orchestration/061-agent-optimization/009-agent-deep-research`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

### T-004: Score + benchmark
- `node .opencode/skill/sk-improve-agent/scripts/score-candidate.cjs --candidate=<packet>/candidate.md --target=.opencode/agent/deep-research.md --manifest=<packet>/profile.json`
- `node .opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs --profile=deep-research --outputs-dir=<packet>/benchmark-outputs --output=<packet>/benchmark.json`

### T-005: Legal-stop gate verification
- `node .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs <packet>`
- Verify `legal_stop_evaluated.details.gateResults` shows 5/5 pass

### T-006: Promote candidate
- `node .opencode/skill/sk-improve-agent/scripts/promote-candidate.cjs --candidate=<packet>/candidate.md --target=.opencode/agent/deep-research.md --score=<packet>/score.json --approve`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

### T-007: Mirror sync to 3 runtimes
- Sync to `.claude/agents/deep-research.md`, `.gemini/agents/deep-research.md`, `.codex/agents/deep-research.toml`
- Verify byte-alignment

### T-008: Smoke-test + diff + commit
- Re-run representative scenario from sk-improve-agent's manual_testing_playbook
- Diff vs pre-promote baseline
- Update implementation-summary.md
- Commit
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

All T-001..T-008 marked `[x]`. graph-metadata.json shows status=complete, pct=100. Score delta documented.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- spec.md — full goal + scope
- plan.md — phase breakdown + rollback
- implementation-summary.md — fills post-implementation
- Parent: `../spec.md`
- Methodology source: `../../060-sk-agent-improver-test-report-alignment/`
<!-- /ANCHOR:cross-refs -->
