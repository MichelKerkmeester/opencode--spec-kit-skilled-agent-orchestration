---
title: "Verification Checklist: Dead-Code Pruning"
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2"
description: "P0/P1/P2 quality gates the pruning packet must clear before being treated as final."
trigger_phrases:
  - "004-dead-code-pruning checklist"
  - "dead-code pruning checklist"
importance_tier: "important"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/004-dead-code-pruning"
    last_updated_at: "2026-04-28T09:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored checklist.md"
    next_safe_action: "Validate packet"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Verification Checklist: Dead-Code Pruning

<!-- ANCHOR:checklist -->

## P0 — Hard Blocking Gates

- [x] **C-P0-001** All 13 high-confidence deletes from `../003-dead-code-audit/dead-code-audit-report.md` Category: `dead` are applied (or explicitly skipped with documented reason). [EVIDENCE: implementation-summary.md per-finding table]
- [x] **C-P0-002** Normal `tsc --noEmit` exits 0 on the post-delete tree. [EVIDENCE: typecheck output captured EXIT=0]
- [x] **C-P0-003** Strict `tsc --noUnusedLocals --noUnusedParameters` exits 0 on the post-delete tree. [EVIDENCE: pre-delete had 13 diagnostics → post-delete had 0 + 2 cascade orphans → after cascade cleanup, 0]
- [x] **C-P0-004** Full `vitest run` passes on the post-delete tree (no regression). [EVIDENCE: vitest output captured]
- [x] **C-P0-005** Scope honored: only files under `.opencode/skill/system-spec-kit/mcp_server/` modified by deletes (plus this packet's own docs). [EVIDENCE: git status / find . -newer]
- [x] **C-P0-006** No sibling packets (`001/`, `002/`, `003/`) modified. [EVIDENCE: per-folder check; sibling files unchanged]

## P1 — Strong Quality Gates

- [x] **C-P1-001** Each delete removes ONLY the cited symbol (and any cascade orphans). No "while we're here" cleanup outside the audit's scope. [EVIDENCE: per-finding diff review]
- [x] **C-P1-002** Cascade orphans (symbols whose only consumer was a listed delete) cleaned up in same packet. [EVIDENCE: 2 cascade items documented in implementation-summary]
- [x] **C-P1-003** Stale comment references trimmed where they would otherwise name a removed function inline. [EVIDENCE: checkpoints.ts comment block reviewed]
- [x] **C-P1-004** Per-finding outcome documented (applied / skipped) in implementation-summary. [EVIDENCE: implementation-summary findings table]
- [x] **C-P1-005** Cross-runtime mirrors not directly modified (only `.opencode/skill/system-spec-kit/` source-of-truth tree touched). [EVIDENCE: edits all under `.opencode/skill/system-spec-kit/`]

## P2 — Recommended Quality Gates

- [x] **C-P2-001** Tooling appendix present in implementation-summary (commands run + tool versions). [EVIDENCE: implementation-summary tooling table]
- [x] **C-P2-002** Pre-delete vs post-delete strict-unused diagnostics counts captured. [EVIDENCE: 13 → 0 after cascade cleanup]
- [x] **C-P2-003** `validate.sh --strict` on packet: Errors=0 (SPEC_DOC_INTEGRITY accepted noise). [EVIDENCE: validate output Exit 0]
- [x] **C-P2-004** `implementation-summary.md` fully populated with per-finding stats. [EVIDENCE: filled implementation-summary]

<!-- /ANCHOR:checklist -->
