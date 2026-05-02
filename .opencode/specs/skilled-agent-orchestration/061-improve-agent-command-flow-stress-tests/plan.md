<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
---
title: "Plan: 061 — Command-Flow Stress Tests"
description: "5-stage plan: scaffold + temp-root helper, restructure CP-040/043/044/045, ensure CP-041/042 inputs, run R1 + R2 if needed, test-report."
trigger_phrases: ["061 plan"]
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/061-improve-agent-command-flow-stress-tests"
    last_updated_at: "2026-05-02T15:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Phase plan authored"
    next_safe_action: "Dispatch cli-codex stages 1-3"
    blockers: []
    key_files: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

# Plan: 061 — Command-Flow Stress Tests

<!-- SPECKIT_LEVEL: 3 -->

## 1. OVERVIEW

5 stages. Total wall-time est: 1-2 hours autonomous (codex implements stages 1-3 + 5; stress runs are stage 4 cli-copilot loop).

| Stage | Output | Time |
|---|---|---|
| 1. Scaffold + temp-root setup helper | spec metadata + `/tmp/cp-061-sandbox-setup.sh` | ~10 min |
| 2. Restructure CP-040/043/044/045 to command-flow | 4 playbook files modified | ~15 min |
| 3. Ensure CP-041/042 body-level inputs materialized | 2 playbook files modified | ~10 min |
| 4. R1 stress run (cli-copilot) + R2 if needed | 6 verdict files + transcripts | ~30-60 min |
| 5. test-report.md + close-out | test-report mirroring 059 + summary update | ~15 min |

## 2. STAGE 1 — SCAFFOLD + TEMP-ROOT HELPER
1. Author 8 markdown files at packet root + 2 JSON stubs
2. Author `/tmp/cp-061-sandbox-setup.sh` that creates `/tmp/cp-061-sandbox/` with: `.opencode/command/improve/` (recursive copy), `.opencode/skill/sk-improve-agent/` (recursive copy), `.opencode/agent/cp-improve-target.md` (fixture), `.claude/agents/cp-improve-target.md` + `.gemini/agents/cp-improve-target.md` + `.codex/agents/cp-improve-target.toml` (mirrors), profile + fixture assets

## 3. STAGE 2 — COMMAND-FLOW DISPATCH IN CP-040/043/044/045
For each of CP-040, CP-043, CP-044, CP-045: replace the `Call B = prepend agent body` block with:
```bash
/tmp/cp-061-sandbox-setup.sh
cd /tmp/cp-061-sandbox
copilot -p "/improve:agent \".opencode/agent/cp-improve-target.md\" :auto --spec-folder=/tmp/cp-061-spec --iterations=1" --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-061-sandbox --add-dir /tmp/cp-061-spec 2>&1 | tee /tmp/cp-NNN-B-command.txt
```
Update expected-signal grep contracts to look for command-flow evidence (already mostly done by 062's stage 6).

## 4. STAGE 3 — CP-041/042 BODY-LEVEL INPUTS
For CP-041 + CP-042: keep body-prepend Call B but ensure the 5 required runtime/control inputs (charter copy, manifest, target file, integration scan report, profile) are seeded in the sandbox before Call B dispatches. Without these, the agent halts on the §3 self-validation halt rule.

## 5. STAGE 4 — R1 STRESS + R2 IF NEEDED
Run all 6 scenarios sequentially via cli-copilot. Triage. If R1 surfaces gaps, R2 with targeted edits between rounds (per ADR-4 score-progression discipline).

## 6. STAGE 5 — TEST-REPORT + CLOSE-OUT
Mirror 059's 11-section ANCHOR structure. Document R1/R2 narratives with transcript pull-quotes. Update implementation-summary + handover. Optionally commit + push.
