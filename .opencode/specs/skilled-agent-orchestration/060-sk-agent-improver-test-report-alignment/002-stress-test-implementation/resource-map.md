<!-- SPECKIT_TEMPLATE_SOURCE: resource-map-core | v2.2 -->
---
title: "Resource Map: 060/002 — Stress-Test Implementation"
description: "Lean path ledger for phase 002."
trigger_phrases:
  - "060/002 resource map"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation"
    last_updated_at: "2026-05-02T11:42:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Authored resource map"
    next_safe_action: "Begin T-001"
    blockers: []
    key_files: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

# Resource Map: 060/002 — Stress-Test Implementation

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:source-of-truth -->
## Source of Truth (read-only this packet's planning phase)

| Path | Role |
|---|---|
| `../001-deep-research-recommendations/research/research.md` | 854-line synthesis — diff sketches (§5), scenario sketches (§4), fixture-target (§6), hand-off notes (§8) |
| `../001-deep-research-recommendations/implementation-summary.md` | Top-3 recommendations + handoff highlights |
| `../../059-agent-implement-code/test-report.md` | Structural template for 002's eventual test-report.md (570 lines, §9 lessons-learned) |
<!-- /ANCHOR:source-of-truth -->

---

<!-- ANCHOR:files-to-modify -->
## Files to Modify (Stage 3)

### Triad agent file (mirrored across 4 runtimes per ADR-3)

| Path | Stage | Diff |
|---|---|---|
| `.opencode/agent/improve-agent.md` | 3d | Add §6.5 CRITIC PASS bullets |
| `.claude/agents/improve-agent.md` | 3d | Mirror |
| `.gemini/agents/improve-agent.md` | 3d | Mirror |
| `.codex/agents/improve-agent.toml` | 3d | Mirror (toml-wrapped) |

### Skill + command + helpers

| Path | Stage | Diff |
|---|---|---|
| `.opencode/skill/sk-improve-agent/SKILL.md` | 3e | Skill-load ≠ protocol-execution clarification |
| `.opencode/command/improve/assets/improve_improve-agent_auto.yaml` | 3c | Emit `legal_stop_evaluated` 5-gate bundle |
| `.opencode/command/improve/assets/improve_improve-agent_confirm.yaml` | 3c | Same |
| `.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs` | 3b | Consume `--baseline`, emit `delta` |
| `.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs` | 3a | Fix `.gemini/agents` constant |
<!-- /ANCHOR:files-to-modify -->

---

<!-- ANCHOR:files-to-create -->
## Files to Create

### Stage 2 — Playbook scenarios

| Path | Scenario |
|---|---|
| `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/013-skill-load-not-protocol.md` | CP-040 |
| `.../04--agent-routing/014-proposal-only-boundary.md` | CP-041 |
| `.../04--agent-routing/015-active-critic-overfit.md` | CP-042 |
| `.../04--agent-routing/016-legal-stop-gate-bundle.md` | CP-043 |
| `.../04--agent-routing/017-improvement-gate-delta.md` | CP-044 |
| `.../04--agent-routing/018-benchmark-completed-boundary.md` | CP-045 |

### Stage 1 — Fixture-target

| Path (TBD pending T-005) | Role |
|---|---|
| `.opencode/skill/sk-improve-agent/test-fixtures/060-stress-test/` (suggested) | Fixture-target home |
| `<fixture>/README.md` | Fixture spec, intentional flaws documented |
| `<fixture>/<fixture-files>` | The actual fixture content |

### Stage 5 — Test report

| Path | Role |
|---|---|
| `002-stress-test-implementation/test-report.md` | Final narrative mirroring 059's structure |
<!-- /ANCHOR:files-to-create -->

---

<!-- ANCHOR:tooling -->
## Tooling

| Tool | Stage | Purpose |
|---|---|---|
| `cli-codex --model=gpt-5.5 --reasoning-effort=high --service-tier=fast` | 2 | Author CP-040..CP-045 in one parallel-friendly dispatch |
| `cli-copilot --model=gpt-5.5 --allow-all-tools --no-ask-user --add-dir <sandbox>` | 4 | Run R0..R3 stress dispatches |
| `node generate-context.js` | 1, 5 | Bootstrap + refresh JSON metadata + memory continuity |
| `bash validate.sh --strict` | 1, 5 | Verify spec folder shape |
| `/memory:save` | 5 | Refresh continuity surfaces |
<!-- /ANCHOR:tooling -->

---

<!-- ANCHOR:transcripts-and-evidence -->
## Transcripts and Evidence (filled during execution)

### R0 baseline transcripts
- `/tmp/cp-040-{A,B}-gpt55.txt`
- `/tmp/cp-040-{A,B}-opus.txt`
- (optionally `/tmp/cp-040-{A,B}-sonnet.txt`)

### R1 stress transcripts
- `/tmp/cp-{040..045}-{A,B}-gpt55.txt`
- `/tmp/cp-{040..045}-B-field-counts.txt`
- `/tmp/cp-{040..045}-B-sandbox-diff.txt`
- `/tmp/cp-{040..045}-tripwire.diff`

### R2/R3 (if needed)
- `/tmp/cp-rerun-results/cp-{XXX}.{sh,out}`
<!-- /ANCHOR:transcripts-and-evidence -->
