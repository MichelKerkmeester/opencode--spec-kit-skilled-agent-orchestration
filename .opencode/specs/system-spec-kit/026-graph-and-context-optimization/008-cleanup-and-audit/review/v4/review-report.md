# Review Report - v4 Remediation Closure Audit

## 1. Executive Summary

This fresh v4 deep review did **not** validate the remediation as complete. Four prior findings from the v3 packet remain open as release-blocking P0s, one new P1 traceability defect surfaced in the broader `create` command family, and one P2 maintainability advisory remains open. The runtime correctness and security guardrails still hold, but the surrounding documentation and workflow surfaces are still not uniformly aligned with the shipped continuity contract.

## 2. Scope and Method

- Packet path: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/review/v4/`
- Iterations completed: 10 of 10
- Dimensions covered: correctness, security, traceability, maintainability
- Review mode: fresh packet, no state read from `review/`, `review/v2/`, or `review/v3/`
- Audited scope included:
  - `.opencode/skill/system-spec-kit/mcp_server/**`
  - `.opencode/skill/system-spec-kit/scripts/**`
  - `.opencode/skill/system-spec-kit/manual_testing_playbook/**`
  - `.opencode/skill/system-spec-kit/feature_catalog/**`
  - `.opencode/command/**`
  - `.opencode/agent/**`, `.claude/agents/**`, `.codex/agents/**`, `.gemini/agents/**`
  - `.opencode/changelog/01--system-spec-kit/v3.4.0.0.md`
  - `001-remove-shared-memory/spec.md` and `checklist.md`

## 3. Verdict

**FAIL**

Severity counts:

| Severity | Count |
|---|---:|
| P0 | 4 |
| P1 | 1 |
| P2 | 1 |

Stop reason: max iterations reached with active release-blocking findings still open.

## 4. Prior Finding Closure Status

| Finding | Status | Notes |
|---|---|---|
| F001 | **Closed** | Runtime still rejects retired `specs/**/memory/*.md` inputs at save/parser entry points, and the helper comment did not change behavior. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2080] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:955] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1538] |
| F002 | **Open** | This closure depended on F005, and F005 is still open because the changelog still describes a first-launch effect instead of every-startup retry semantics. [SOURCE: .opencode/changelog/01--system-spec-kit/v3.4.0.0.md:94] [SOURCE: .opencode/changelog/01--system-spec-kit/v3.4.0.0.md:258] |
| F003 | **Closed** | Cross-runtime deep-review manuals remain aligned on the single-iteration contract and `review/` write boundary. [SOURCE: .opencode/agent/deep-review.md:29] [SOURCE: .claude/agents/deep-review.md:29] [SOURCE: .codex/agents/deep-review.toml:22] [SOURCE: .gemini/agents/deep-review.md:29] |
| F004 | **Open** | Lifecycle playbooks still tell operators to refresh or verify indexed support artifacts instead of only canonical spec docs and `_memory.continuity`. [SOURCE: .opencode/command/spec_kit/plan.md:351] [SOURCE: .opencode/command/spec_kit/handover.md:260] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:593] [SOURCE: .opencode/command/spec_kit/complete.md:349] |
| F005 | **Open** | Spec/checklist/helper align on every-startup idempotent retry, but the changelog still says SQLite 3.35+ installs shed the column on first launch. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/001-remove-shared-memory/spec.md:47] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/001-remove-shared-memory/checklist.md:53] [SOURCE: .opencode/changelog/01--system-spec-kit/v3.4.0.0.md:94] [SOURCE: .opencode/changelog/01--system-spec-kit/v3.4.0.0.md:258] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1534] |
| F006 | **Open** | `memory/save.md` still uses generated continuity-support-artifact framing even though canonical spec docs are now the only valid continuity surface. [SOURCE: .opencode/command/memory/save.md:242] [SOURCE: .opencode/command/memory/save.md:573] [SOURCE: .opencode/command/memory/save.md:623] |
| F007 | **Open** | `spec_kit_complete_auto.yaml` and `spec_kit_complete_confirm.yaml` still reference retired `memory/*.md` checks and generated support artifacts. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:1036] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:1046] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:1048] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1117] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1133] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1135] |
| F008 | **Closed** | Feature catalog and runtime discovery now agree on the three-source pipeline: constitutional files, canonical spec docs, and `graph-metadata.json`. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md:22] [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:649] |
| NF001 | **Closed** | `create_agent_*` YAMLs correctly route to `implementation-summary.md` and explicitly reject standalone `memory/*.md` save targets. [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:568] [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:577] [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:579] [SOURCE: .opencode/command/create/assets/create_agent_confirm.yaml:649] [SOURCE: .opencode/command/create/assets/create_agent_confirm.yaml:665] [SOURCE: .opencode/command/create/assets/create_agent_confirm.yaml:667] |
| NF002 | **Open** | This closure depended on F006/F007; both remain open. [SOURCE: .opencode/command/memory/save.md:242] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:1046] |
| NF003 | **Closed** | The active context-server tests do not reintroduce a retired `findMemoryFiles` mock seam. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1088] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1220] |

## 5. New Findings

### P1

- **F010 - broader create-command continuity drift**: the `create_folder_readme_*` workflows still save context to retired `[SPEC_FOLDER]/memory/*.md` paths, and adjacent create-command docs still ask users to load "memory files" when working against existing specs. That contract disagrees with runtime validation, which only accepts canonical spec documents. [SOURCE: .opencode/command/create/assets/create_folder_readme_auto.yaml:652] [SOURCE: .opencode/command/create/assets/create_folder_readme_auto.yaml:661] [SOURCE: .opencode/command/create/assets/create_folder_readme_confirm.yaml:647] [SOURCE: .opencode/command/create/assets/create_folder_readme_confirm.yaml:663] [SOURCE: .opencode/command/create/assets/create_folder_readme_auto.yaml:1108] [SOURCE: .opencode/command/create/assets/create_folder_readme_auto.yaml:1117] [SOURCE: .opencode/command/create/assets/create_folder_readme_confirm.yaml:1196] [SOURCE: .opencode/command/create/assets/create_folder_readme_confirm.yaml:1212] [SOURCE: .opencode/command/create/agent.md:103] [SOURCE: .opencode/command/create/agent.md:125] [SOURCE: .opencode/command/create/testing-playbook.md:87] [SOURCE: .opencode/command/create/testing-playbook.md:111]

### P2

- **F009 - stale test comment**: `memory-save-pipeline-enforcement.vitest.ts` still says `isMemoryFile` checks a `specs/*/memory/` pattern even though the runtime now classifies canonical spec documents instead. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:396]

## 6. Dimension Coverage Summary

| Dimension | Result | Notes |
|---|---|---|
| Correctness | PASS with blockers elsewhere | Runtime still rejects retired paths and the helper comment did not alter execution semantics. |
| Security | PASS | No new trust-boundary regression or traversal exposure surfaced. |
| Traceability | FAIL | Spec/changelog/commands/workflows/playbooks still disagree on the shipped continuity contract. |
| Maintainability | PASS with advisory | No dead mock seam resurfaced; one stale inline comment remains. |

## 7. Regression Checks

- **Vector-index helper comment**: no runtime behavior change was detected; the helper body still no-ops on already-clean schemas and swallows unsupported `DROP COLUMN` failures for older SQLite builds. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1534]
- **Workflow replace_all regression risk**: `spec_kit_complete_*` still carries stale memory-path/support-artifact text, so the remediation did not fully propagate across the workflow family. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:1046] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1133] |

## 8. Recommendations

1. Fix F005 by updating both changelog statements to the every-startup, idempotent retry-on-bootstrap contract.
2. Fix F004/F006/F007 by removing all remaining "support artifact" and `memory/*.md` continuity wording from spec-kit playbooks, memory command docs, and complete-mode workflows.
3. Fix F010 by moving `create_folder_readme_*` and neighboring create-command docs onto canonical spec-document save targets and removing prompts that ask about legacy memory files.
4. Fix F009 by updating the stale inline test comment to describe the current canonical-spec-document classification logic.

## 9. Convergence and Final State

- Convergence decision: **STOP_ALLOWED by max-iteration ceiling only; not release-ready**
- Final release-readiness state: `release-blocking`
- Review packet state:
  - `deep-review-config.json`
  - `deep-review-state.jsonl`
  - `deep-review-findings-registry.json`
  - `deep-review-strategy.md`
  - `deep-review-dashboard.md`
  - `iterations/iteration-001.md` through `iteration-010.md`

Final report path: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/review/v4/review-report.md`
