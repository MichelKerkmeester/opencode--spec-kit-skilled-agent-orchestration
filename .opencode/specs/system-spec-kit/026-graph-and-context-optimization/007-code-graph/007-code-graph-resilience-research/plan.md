---
title: "Implementation Plan: Code Graph Resilience Research [system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/plan]"
description: "Research-loop plan: 7 iterations of /spec_kit:deep-research:auto investigating code-graph staleness, error resilience, exclude-rule confidence, and recovery playbooks. Outputs feed Phase B of the 006 doctor packet."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
trigger_phrases:
  - "code graph resilience research plan"
  - "007-code-graph-resilience-research plan"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research"
    last_updated_at: "2026-04-25T20:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Created plan.md"
    next_safe_action: "Create remaining packet docs"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0260000000007007000000000000000000000000000000000000000000000001"
      session_id: "007-code-graph-resilience-research"
      parent_session_id: "026-graph-and-context-optimization"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Code Graph Resilience Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Type** | Research packet (deep-research loop target) |
| **Loop runner** | `/spec_kit:deep-research:auto` |
| **Executor (recommended)** | cli-codex gpt-5.4 high (or cli-copilot gpt-5.5 high) |
| **Iteration budget** | 7 (default for deep-research) |
| **Convergence threshold** | 0.10 (default) |
| **Outputs location** | `<packet>/assets/` (4 files) + `<packet>/research/research.md` + decision-record.md (output) |

### Overview

Run a 7-iteration deep-research loop targeting four concrete deliverables:
1. **Verification battery** — assets/code-graph-gold-queries.json (output) (≥20 queries, expected shapes)
2. **Staleness model** — assets/staleness-model.md (output) (3+ thresholds with action mapping)
3. **Recovery playbook** — assets/recovery-playbook.md (output) (3+ failure-mode procedures)
4. **Exclude-rule confidence** — assets/exclude-rule-confidence.json (output) (high/medium/low tiers, ≥5 patterns each)

Plus the loop-driven research/research.md (output) (progressive findings) and decision-record.md (output) (synthesized decisions).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Spec.md research questions list is concrete (10 questions)
- [ ] Acceptance scenarios for the 4 outputs are testable
- [ ] Iteration plan in this doc maps each iteration to specific questions

### Definition of Done
- [ ] Deep-research loop converges (newFindingsRatio < 0.10) OR runs 7 iterations
- [ ] All 4 asset files exist and meet acceptance criteria from spec REQ-001..REQ-004
- [ ] research.md aggregates findings with file:line citations
- [ ] decision-record.md captures threshold + tier choices with rationale
- [ ] Strict spec validation passes 0/0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Deep-research loop with externalized JSONL state + iterative agent dispatch (mirrors the patterns in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/`).

### Key Components

- **Strategy file** (research/deep-research-strategy.md (loop file)): research charter, scope, iteration plan
- **Config file** (`research/deep-research-config.json`): executor config + iteration budget
- **State log** (`research/deep-research-state.jsonl`): per-iteration records
- **Per-iteration prompts** (research/prompts/iteration-NNN.md (loop file)): each iteration claims specific research questions
- **Per-iteration findings** (research/iterations/iteration-NNN.md (loop file)): markdown findings
- **Per-iteration deltas** (`research/deltas/iteration-NNN.json`): structured findings
- **Final research.md** (research/research.md (output)): aggregated synthesis
- **Final decision-record.md** (research/decision-record.md (output) or root decision-record.md (output)): committed decisions

### Iteration Plan

| Iter | Focus | Research Questions | Expected Output Contribution |
|------|-------|-------------------|------------------------------|
| 1 | Failure-mode survey | Q3 | Catalog of scan-failure patterns from existing logs |
| 2 | Staleness signals | Q1, Q2 | Signal taxonomy + threshold candidates |
| 3 | SQLite recovery | Q4 | Recovery playbook procedures (corruption, partial-scan) |
| 4 | Verification battery seeds | Q5 | Initial gold-query list with expected shapes |
| 5 | Exclude-rule confidence | Q6 | Tier definitions + rationale per pattern |
| 6 | Edge weight + symbol resolution | Q7, Q8 | Drift detection + resolver-failure documentation |
| 7 | Synthesis + self-healing | Q9, Q10 | Final decision-record, confidence-floor signaling, self-healing boundaries |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Create research packet docs (this packet's spec, plan, tasks, checklist)
- [ ] Create description.json + graph-metadata.json
- [ ] Update parent `007-code-graph/{context-index, spec, tasks}.md` with 007-code-graph-resilience-research entry

### Phase 2: Run Deep-Research Loop
- [ ] Invoke `/spec_kit:deep-research:auto` against this packet with the 7-iteration plan above
- [ ] Per iteration: produce research/iterations/iteration-NNN.md (loop file) + delta JSON + state log entry
- [ ] Monitor convergence; stop early if newFindingsRatio < 0.10

### Phase 3: Synthesize Outputs
- [ ] Aggregate research/research.md (output) from all iteration findings
- [ ] Write decision-record.md (output) with threshold + tier choices + rationale
- [ ] Materialize assets/code-graph-gold-queries.json (output) (≥20 queries)
- [ ] Materialize assets/staleness-model.md (output) (3+ thresholds with action mapping)
- [ ] Materialize assets/recovery-playbook.md (output) (3+ procedures)
- [ ] Materialize assets/exclude-rule-confidence.json (output) (high/medium/low, ≥5 patterns each)

### Phase 4: Verification
- [ ] Run synthetic regression test against verification battery (drop a canonical symbol via exclude rule, confirm battery catches it)
- [ ] Validate JSON outputs parse cleanly
- [ ] Run strict spec validation
- [ ] Hand off to 006 doctor packet for Phase B implementation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Convergence | Deep-research loop reaches stop condition | newFindingsRatio threshold |
| Coverage | All 10 research questions answered with evidence | Audit research.md citations |
| Verification | Battery catches synthetic regression | Drop a canonical symbol, run battery, expect failure |
| Manual | Recovery playbook executable end-to-end | Synthetic SQLite corruption + follow procedures |
| Format | JSON outputs parse + match schema expectations | `python3 -c "import json; json.load(open(...))"` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `/spec_kit:deep-research:auto` workflow | Internal | Green | Cannot run iteration loop |
| `code_graph_status`, `code_graph_query`, `detect_changes` MCP tools | Internal | Green | Reduces evidence quality (synthetic only) |
| Existing code_graph_scan implementation under mcp_server/ | Internal | Green | Read-only investigation target |
| Existing deep-research iteration logs (010-graph-impact-and-affordance-uplift/008-deep-research-review/) | Internal | Green | Failure-pattern survey corpus |
| 006 sibling packet | Internal | In Progress | This packet feeds 006 Phase B; 006 Phase A unblocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Research loop produces conflicting recommendations across iterations OR synthetic regression test fails to detect dropped symbols
- **Procedure**:
  1. Mark this packet as research_partial in decision-record.md (output)
  2. Document the gaps in research/research.md (output) "Unresolved" section
  3. Block 006 Phase B with explicit reference to the unresolved gaps
  4. Re-run a focused 3-iteration loop on the unresolved questions only (instead of fresh 7-iteration)
- **Audit trail**: All iteration markdown + delta JSON files preserved under `research/`; rollback does not delete history
<!-- /ANCHOR:rollback -->
