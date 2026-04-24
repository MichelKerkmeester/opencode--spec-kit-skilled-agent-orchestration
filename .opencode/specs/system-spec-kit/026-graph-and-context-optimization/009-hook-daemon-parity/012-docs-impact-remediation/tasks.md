---
title: "Tasks [system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/012-docs-impact-remediation/tasks]"
description: "One task per flagged file, in plan.md phase order. Each task lists the specific change required and the sub-packet(s) driving it."
trigger_phrases:
  - "docs impact remediation tasks"
  - "026/009/012 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/012-docs-impact-remediation"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: Documentation Impact Remediation for 009 Hook/Daemon Parity

<!-- SPECKIT_LEVEL: 2 -->

Each task ID maps to a REQ in `spec.md §4` and a phase in `plan.md §2`. `[009/NN]` markers in the Rationale column name the flagging sub-packet(s) from `../impact-analysis/merged-impact-report.md`.

---

## Phase 1 — Canonical Runtime Contracts

| ID | Task | Priority | Rationale |
|---|---|---|---|
| T-001 | Rewrite runtime matrix + cross-runtime fallback prose in `.opencode/skill/system-spec-kit/references/config/hook_system.md`: Codex native `SessionStart` (post-05), Claude `UserPromptSubmit` in four-event example, OpenCode plugin bridge, Copilot `.claude/settings.local.json` wrappers | P0 | [009/01, 04, 05, 06, 07, 10] — top hotspot, 6 sub-packets flagged |
| T-002 | Update top-level `AGENTS.md`: Gate 2 hook-brief primary + `skill_advisor.py` fallback; Codex SessionStart parity note; OpenCode plugin ESM exemption in `sk-code-opencode` language table | P0 | [009/01, 05, 09] |
| T-003 | Update `.opencode/skill/system-spec-kit/SKILL.md` startup/recovery: Claude four-event + `UserPromptSubmit`; Codex post-05 native `SessionStart`; Copilot `.claude/settings.local.json` startup surface | P0 | [009/01, 03, 04, 06, 10] |
| T-004 | Update `.opencode/skill/system-spec-kit/ARCHITECTURE.md`: Copilot file-based transport (`custom-instructions.ts` writing to `$HOME/.copilot/copilot-instructions.md`); OpenCode plugin bridge ESM default-export entrypoint + per-instance state / dedup / cap/eviction | P0 | [009/04, 08, 09] |

---

## Phase 2 — Package-Level READMEs

| ID | Task | Priority | Rationale |
|---|---|---|---|
| T-005 | Update `.opencode/README.md`: Gate 2 prose (hook brief primary, script fallback), directory-structure (advisor surface in `mcp_server/skill-advisor/`) | P0 | [009/01, 02, 07] |
| T-006 | Update `.opencode/skill/system-spec-kit/README.md`: hook-primary Skill Advisor section; `scripts/` module profile corrected to ESM (per 02's validator flip); Copilot runtime-hooks summary; prompt-vs-lifecycle distinction | P0 | [009/01, 02, 03, 04] |
| T-007 | Update `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md` (and any sibling runtime hook READMEs with stale Copilot examples): replace `.github/hooks/scripts/*.sh` example with `.claude/settings.local.json` wrapper contract; note Claude nested commands coexist with top-level Copilot fields | P0 | [009/01, 10] |

---

## Phase 3 — Install / Reference / Supporting Docs

| ID | Task | Priority | Rationale |
|---|---|---|---|
| T-008 | Update `.opencode/install_guides/SET-UP - AGENTS.md`: Gate 2 hook-first path, script fallback, native-tool/bootstrap verification, `--force-native` / `--force-local` / disable-flag notes | P0 | [009/02, 07] |
| T-009 | Update `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`: add `advisor_recommend` / `advisor_status` / `advisor_validate` to verification step; Copilot row → merged `.claude/settings.local.json` wrapper execution + top-level `type`/`bash`/`timeoutSec` contract + writer wiring | P0 | [009/02, 10] |
| T-010 | Update `feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md`: Copilot fallback entry names `.claude/settings.local.json` + top-level writer commands | P0 | [009/10] |

---

## Phase 4 — MED Surfaces

| ID | Task | Priority | Rationale |
|---|---|---|---|
| T-011 | Update `manual_testing_playbook/22--context-preservation-and-code-graph/252-cross-runtime-fallback.md`: Copilot scenario inspects `.claude/settings.local.json` top-level fields/commands + smokes managed-block refresh via that path | P1 | [009/10] |
| T-012 | Add `SPECKIT_CODEX_HOOK_TIMEOUT_MS` entry to `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` (default, scope, timeout-fallback behavior) | P1 | [009/03] |
| T-013 | Add hook-surface summary + cross-links to runtime hook READMEs and hook reference docs in `.opencode/skill/system-spec-kit/mcp_server/README.md` | P1 | [009/01] |

---

## Phase 5 — Graph Metadata & Validation

| ID | Task | Priority | Rationale |
|---|---|---|---|
| T-014 | Add `system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/012-docs-impact-remediation` to 009 parent's `graph-metadata.json` `children_ids` | P0 | Parent must recognize child for graph traversal |
| T-015 | Run `validate.sh --strict` on this packet; address errors, document warnings | P0 | §SC-006 |
| T-016 | Generate / refresh `description.json` and this packet's `graph-metadata.json` via canonical memory save so derived fields stay aligned | P0 | System-spec-kit governance rule |
| T-017 | Optional P2: reconcile every mention of "Codex has no lifecycle hook" in updated files with post-05 native SessionStart description | P2 | [009/05] — drift prevention |

---

## Dependencies

- T-001 (hook_system.md) should land before T-002, T-003, T-004 so cross-linked docs can reference the fresh matrix.
- T-002, T-003, T-004 should land before Phase 2 so READMEs can cross-link to canonical text.
- T-005, T-006, T-007 can proceed in parallel once Phase 1 is complete.
- Phase 3 and Phase 4 can proceed in parallel once Phase 2 is complete.
- T-014, T-015, T-016 are the closing gate.

---

## Evidence Logging

Every completed task must record:
1. The specific file path and line range or section edited.
2. The `[009/NN]` citation(s) from the Rationale column.
3. Evidence the change addresses the flagging reason — either a quoted before/after or a pointer to the merged report row.

Record in `implementation-summary.md §Work Log` at completion time.
