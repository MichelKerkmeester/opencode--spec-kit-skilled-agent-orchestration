<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
---
title: "Tasks: 060 — sk-improve-agent Test-Report Alignment"
description: "8 tasks across 2 phases. Phase 1 (T-001..T-003) scaffolds the spec packet. Phase 2 (T-004..T-008) dispatches the 10-iter deep-research and processes its output."
trigger_phrases:
  - "060 tasks"
  - "sk-improve-agent research tasks"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/001-deep-research-recommendations"
    last_updated_at: "2026-05-02T10:50:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Authored tasks"
    next_safe_action: "Run T-002 generate-context.js"
    blockers: []
    key_files: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

# Tasks: 060 — sk-improve-agent Test-Report Alignment

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:phase-1-tasks -->
## Phase 1 — Scaffold + Metadata Bootstrap

### T-001: Scaffold spec folder with 8 markdown files

- **Files:** spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, handover.md, resource-map.md
- **Path:** `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/`
- **Acceptance:** All 8 files present, frontmatter parses, ANCHOR pairs balanced
- **Status:** [in-progress]

### T-002: Bootstrap description.json + graph-metadata.json

- **Tool:** `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`
- **Acceptance:** Both JSON files exist; description.json has trigger_phrases populated; graph-metadata.json has derived.last_active_child_id (or null) and lowercase status
- **Status:** [pending]

### T-003: Strict-validate spec folder

- **Tool:** `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment --strict`
- **Acceptance:** exit code 0
- **Status:** [pending]
<!-- /ANCHOR:phase-1-tasks -->

---

<!-- ANCHOR:phase-2-tasks -->
## Phase 2 — Deep-Research Dispatch + Synthesis

### T-004: Dispatch /spec_kit:deep-research:auto

- **Command:**
  ```
  /spec_kit:deep-research:auto \
    --spec-folder=specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment \
    --executor=cli-copilot \
    --model=gpt-5.5 \
    --max-iterations=10
  ```
- **Pre-flight:** `~/.copilot/settings.json` has `effortLevel: "high"` (verified)
- **Acceptance:** Workflow starts, no parse errors on flags
- **Status:** [pending]

### T-005: Monitor iteration convergence

- **Watch:** `research/iterations/iteration-NNN.md` files, `research/deep-research-state.jsonl`, `research/deep-research-dashboard.md`
- **Intervene only on:** dispatch errors, executor crashes, schema rejections
- **Do NOT intervene on:** per-iteration content quality (convergence detection handles that)
- **Acceptance:** Workflow runs to convergence OR 10 iterations
- **Status:** [pending]

### T-006: Verify research/research.md synthesis output

- **Required sections** (per spec.md §6):
  - Gap Analysis (per RQ-1..RQ-7)
  - Scenario Sketches (≥6 in CP-XXX format)
  - Diff Sketches (per target file, with section anchors)
  - Fixture-Target Recommendation
  - Lessons Learned (mirroring 059 §9 structure)
  - Hand-off Notes for Packet 061
- **Acceptance:** All 6 sections present; each RQ addressed with evidence citations
- **Status:** [pending]

### T-007: Update implementation-summary.md with synthesis findings

- **Edits:**
  - completion_pct → 100
  - recent_action → "Research synthesis complete; N iterations run"
  - next_safe_action → "Hand off to packet 061 for implementation"
  - Add findings summary section
- **Acceptance:** No remaining `[###-feature-name]` placeholders in summary section
- **Status:** [pending]

### T-008: Memory save + handoff prompt for packet 061

- **Tool:** `/memory:save` against this spec folder
- **Outputs:** Updated `_memory.continuity` blocks; refreshed description.json + graph-metadata.json
- **Handoff:** handover.md continuation prompt for packet 061 cites `research/research.md` as input
- **Acceptance:** Memory save returns OK; handover.md updated
- **Status:** [pending]
<!-- /ANCHOR:phase-2-tasks -->

---

<!-- ANCHOR:dependencies -->
## Task Dependencies

```
T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008
```

Strictly sequential. T-001 produces the markdown that T-002 reads. T-003 verifies T-001+T-002 output before T-004 dispatches. T-005 depends on T-004 having started. T-006/T-007/T-008 depend on T-005 completion.
<!-- /ANCHOR:dependencies -->
