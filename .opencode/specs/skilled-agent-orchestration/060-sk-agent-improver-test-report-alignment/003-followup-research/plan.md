<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
---
title: "Plan: 060/003 — Followup Research"
description: "2-stage plan: (1) scaffold + state files; (2) 10-iter cli-copilot loop + synthesis."
trigger_phrases: ["060/003 plan"]
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research"
    last_updated_at: "2026-05-02T13:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Phase plan authored"
    next_safe_action: "Bootstrap state files; dispatch loop"
    blockers: []
    key_files: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

# Plan: 060/003 — Followup Research

<!-- SPECKIT_LEVEL: 3 -->

## 1. OVERVIEW

Two stages. Stage 1 scaffolds spec + state files. Stage 2 runs 10 cli-copilot iterations + synthesis. Total wall-time ~30-45 min.

## 2. STAGE 1 — SCAFFOLD + STATE

1. Author 8 markdown files at packet root
2. Bootstrap description.json + graph-metadata.json via generate-context.js
3. Update phase parent's graph-metadata.json children_ids to include 003
4. Set up research/{deep-research-config.json, deep-research-state.jsonl, deep-research-strategy.md, findings-registry.json, prompts/, iterations/, deltas/}
5. Reuse v2 iteration runner pattern from 060/001 (absolute-path prompts to avoid the relative-path bug)

## 3. STAGE 2 — 10-ITER LOOP + SYNTHESIS

1. Dispatch v2 runner (cli-copilot --model gpt-5.5; high reasoning via settings.json)
2. Each iteration reads prior iteration summaries, focuses on under-evidenced RQs, writes to absolute path
3. Convergence detection: 3 consecutive `convergence_signal: yes` → stop
4. After loop: dispatch cli-codex synthesis to produce `research/research.md`
5. Update implementation-summary.md + handover.md
