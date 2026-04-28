---
title: "Verification Checklist: Dead-Code & Disconnected-Code Audit"
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2"
description: "P0/P1/P2 quality gates the audit must clear before dead-code-audit-report.md is treated as authoritative for downstream pruning work."
trigger_phrases:
  - "003-dead-code-audit checklist"
  - "dead-code audit checklist"
importance_tier: "important"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-dead-code-audit"
    last_updated_at: "2026-04-28T08:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored checklist.md"
    next_safe_action: "T001 verify tooling"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Verification Checklist: Dead-Code & Disconnected-Code Audit

<!-- ANCHOR:checklist -->

## P0 — Hard Blocking Gates

- [ ] **C-P0-001** Audit scope honored: every audited path starts with `.opencode/skill/system-spec-kit/`. **Evidence**: per-finding file paths.
- [ ] **C-P0-002** `dead-code-audit-report.md` exists at packet root, non-empty. **Evidence**: file size > 0; renders.
- [ ] **C-P0-003** All 4 categories populated (or explicit "none found"). **Evidence**: report sections.
- [ ] **C-P0-004** Reachability anchors enumerated (REQ-004): MCP tools, CLI scripts, hooks, agent/command md, api/ barrels, test imports. **Evidence**: report's anchor section + `audit-state.jsonl`.
- [ ] **C-P0-005** Every finding cites verifiable file:line. **Evidence**: sample-verify ≥10 random findings → 10/10 resolve on disk.
- [ ] **C-P0-006** Zero fabrications. **Evidence**: spot-check via `rg`.

## P1 — Strong Quality Gates

- [ ] **C-P1-001** Each `dead`/`disconnected` finding has a recommended action (`delete` / `wire-in` / `keep-with-rationale`). **Evidence**: 100% coverage in report.
- [ ] **C-P1-002** Each finding has a safety ranking (`high-confidence-delete` / `needs-investigation` / `keep`). **Evidence**: 100% coverage.
- [ ] **C-P1-003** Dynamic-load patterns explicitly handled: any finding touched by template-string `import()`, runtime `require(...)`, `child_process.spawn(...)`, hook glob loader is auto-`needs-investigation`. **Evidence**: REQ-007 audit step.
- [ ] **C-P1-004** Per-directory summary table covers ≥7 directories per SC-007. **Evidence**: report table.
- [ ] **C-P1-005** Top-of-file barrel exports cross-checked: ts-prune false-positives on barrel re-exports flagged and downgraded. **Evidence**: report classification notes.
- [ ] **C-P1-006** Cross-runtime symbol references checked: `.opencode/agent/`, `.opencode/command/`, `.claude/agents/`, `.codex/agents/`, `.gemini/agents/`. **Evidence**: T104 grep results.

## P2 — Recommended Quality Gates

- [ ] **C-P2-001** Tooling + replication appendix present (SC-008). **Evidence**: report final section with exact commands + versions.
- [ ] **C-P2-002** Stale-`dist/` candidates documented separately. **Evidence**: report has dedicated subsection or table column.
- [ ] **C-P2-003** Stale-test candidates flagged. **Evidence**: report subsection.
- [ ] **C-P2-004** Files where ALL exports are dead (Q-004) flagged as strong "delete this whole file" signal. **Evidence**: report dedicated subsection.
- [ ] **C-P2-005** `validate.sh --strict` on packet: Errors=0 (SPEC_DOC_INTEGRITY accepted noise). **Evidence**: validate output.
- [ ] **C-P2-006** `implementation-summary.md` populated with audit summary stats. **Evidence**: filled implementation-summary.

<!-- /ANCHOR:checklist -->
