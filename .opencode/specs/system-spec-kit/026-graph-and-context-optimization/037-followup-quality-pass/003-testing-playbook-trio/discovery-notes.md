---
title: "Discovery Notes: Testing Playbook Trio"
description: "Actual manual testing playbook paths discovered before packet 037/003 edits."
trigger_phrases:
  - "037-003 discovery notes"
  - "manual testing playbook discovery"
importance_tier: "normal"
contextType: "implementation"
---

# Discovery Notes: Testing Playbook Trio

## 1. DISCOVERY COMMANDS

Commands run from the repository root:

```bash
find .opencode/skill -type d -name 'manual_testing_playbook*' -or -type d -name 'manual-testing-playbook*'
find .opencode/skill -type f -name '*playbook*'
find .opencode/skill/sk-doc -name '*playbook*'
```

---

## 2. ACTUAL PLAYBOOK PATHS

Relevant paths found:

| Surface | Path | Notes |
|---------|------|-------|
| system-spec-kit | `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Root manual testing playbook for Spec Kit Memory/system-spec-kit. |
| skill_advisor | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/manual_testing_playbook.md` | Nested Skill Advisor native-first playbook. |
| code_graph | `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/` | No standalone code_graph playbook directory was found; current code_graph coverage lives in this system-spec-kit category. |
| sk-doc template | `.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_template.md` | Root playbook template. |
| sk-doc creation reference | `.opencode/skill/sk-doc/references/specific/manual_testing_playbook_creation.md` | Authoring workflow and validation guidance. |
| cli-opencode reference package | `.opencode/skill/cli-opencode/manual_testing_playbook/` | Existing numbered category pattern with per-feature files. |

Other playbook directories found included `cli-codex`, `cli-copilot`, `cli-gemini`, `cli-claude-code`, `mcp-code-mode`, `mcp-clickup`, `mcp-chrome-devtools`, `mcp-coco-index`, `sk-deep-research`, `sk-deep-review`, and `sk-improve-agent`.

---

## 3. FORMAT REFERENCES READ

| File | Purpose |
|------|---------|
| `.opencode/skill/sk-doc/references/specific/manual_testing_playbook_creation.md` | Canonical package shape and validation workflow. |
| `.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_template.md` | Required root and per-feature contract fields. |
| `.opencode/skill/cli-opencode/manual_testing_playbook/01--cli-invocation/001-base-non-interactive-invocation.md` | Per-feature scenario format with 9-column contract. |
| `.opencode/skill/cli-opencode/manual_testing_playbook/02--external-dispatch/003-self-invocation-refusal.md` | Safety-focused scenario with variants and triage. |

---

## 4. PACKET EVIDENCE ANCHORS

| Packet | Evidence Used |
|--------|---------------|
| 032 | `../../032-code-graph-watcher-retraction/spec.md`, `plan.md`, and `implementation-summary.md` document read-path/manual freshness. |
| 033 | `../../033-memory-retention-sweep/spec.md` and MCP README document `memory_retention_sweep`. |
| 034 | `../../034-half-auto-upgrades/spec.md` and Skill Advisor handlers document diagnostic `advisor_status` plus explicit `advisor_rebuild`. |
| 035 | `035-full-matrix-execution-validation/logs/feature-runs/F5-code-graph-query.log`, `F6-code-graph-verify.log`, `F7-causal-graph.log`, `F8-cocoindex-calibration.log`, plus F5-F8 JSONL result files. |
| 036 | `.opencode/skill/system-spec-kit/mcp_server/matrix-runners/README.md`, `matrix-manifest.json`, adapters, and matrix adapter tests. |

---

## 5. DISCOVERY CONCLUSION

The requested three surfaces are real, with one topology caveat: code_graph has subsystem coverage inside the system-spec-kit manual testing playbook rather than a standalone `code_graph/manual_testing_playbook` directory. The packet therefore adds code_graph entries to `22--context-preservation-and-code-graph/` and records that as the actual path.
