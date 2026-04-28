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

- [x] **C-P0-001** Audit scope honored: every audited path starts with `.opencode/skill/system-spec-kit/`. [EVIDENCE: per-finding file paths in `dead-code-audit-report.md`]
- [x] **C-P0-002** `dead-code-audit-report.md` exists at packet root, non-empty. [EVIDENCE: file was authored and strict validation scanned 7 files]
- [x] **C-P0-003** All 4 categories populated (or explicit "none found"). [EVIDENCE: report sections cover `dead`, `disconnected` ("none found"), `dynamic-only-reference`, and `false-positive`]
- [x] **C-P0-004** Reachability anchors enumerated (REQ-004): MCP tools, CLI scripts, hooks, agent/command md, api/ barrels, test imports. [EVIDENCE: report anchor section + `audit-state.jsonl`]
- [x] **C-P0-005** Every finding cites verifiable file:line. [EVIDENCE: sample-verify 10/10 resolved with `sed -n NUMp`]
- [x] **C-P0-006** Zero fabrications. [EVIDENCE: 5 exact dead declarations checked with `rg -nF`; strict validation passed]

## P1 — Strong Quality Gates

- [x] **C-P1-001** Each `dead`/`disconnected` finding has a recommended action (`delete` / `wire-in` / `keep-with-rationale`). [EVIDENCE: 100% coverage in report tables]
- [x] **C-P1-002** Each finding has a safety ranking (`high-confidence-delete` / `needs-investigation` / `keep`). [EVIDENCE: 100% coverage in report tables]
- [x] **C-P1-003** Dynamic-load patterns explicitly handled: any finding touched by template-string `import()`, runtime `require(...)`, `child_process.spawn(...)`, hook glob loader is auto-`needs-investigation`. [EVIDENCE: hook entrypoints classified `dynamic-only-reference` / `needs-investigation`]
- [x] **C-P1-004** Per-directory summary table covers ≥7 directories per SC-007. [EVIDENCE: report table covers 11 directories]
- [x] **C-P1-005** Top-of-file barrel exports cross-checked: ts-prune false-positives on barrel re-exports flagged and downgraded. [EVIDENCE: API and hook/tool barrels classified as `false-positive`]
- [x] **C-P1-006** Cross-runtime symbol references checked: `.opencode/agent/`, `.opencode/command/`, `.claude/agents/`, `.codex/agents/`, `.gemini/agents/`. [EVIDENCE: report anchor section and tooling appendix]

## P2 — Recommended Quality Gates

- [x] **C-P2-001** Tooling + replication appendix present (SC-008). [EVIDENCE: report final section with exact commands + versions]
- [x] **C-P2-002** Stale-`dist/` candidates documented separately. [EVIDENCE: report records `scripts/dist` 0 / 244 stale]
- [x] **C-P2-003** Stale-test candidates flagged. [EVIDENCE: report records 0 real stale-test imports after resolver correction]
- [x] **C-P2-004** Files where ALL exports are dead (Q-004) flagged as strong "delete this whole file" signal. [EVIDENCE: no whole source file met the high-confidence delete threshold; only local declarations/imports were reported]
- [x] **C-P2-005** `validate.sh --strict` on packet: Errors=0 (SPEC_DOC_INTEGRITY accepted noise). [EVIDENCE: strict validation exit 0, Errors 0, Warnings 0]
- [x] **C-P2-006** `implementation-summary.md` populated with audit summary stats. [EVIDENCE: filled implementation-summary]

<!-- /ANCHOR:checklist -->
