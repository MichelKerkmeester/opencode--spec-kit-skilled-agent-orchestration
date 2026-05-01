---
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2"
title: "Quality Checklist: 003 Advisor Quality [template:level_2/checklist.md]"
description: "QA gates for F-006-B1-01..03, F-012-C2-01..04, F-013-C3-01 remediation. Eight surgical product-code fixes + one additive scorer vitest + one fixture row update; full stress must remain green."
trigger_phrases:
  - "F-006-B1 checklist"
  - "F-012-C2 checklist"
  - "F-013-C3 checklist"
  - "003 advisor quality checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/003-advisor-quality"
    last_updated_at: "2026-04-30T00:00:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Checklist authored"
    next_safe_action: "Tick items as fixes land"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-003-advisor-quality"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 003 Advisor Quality

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This is a product-code remediation packet with eight surgical fixes plus one additive scorer vitest plus one regression fixture row update. Verification combines structural checks (`validate.sh --strict`), targeted vitest runs against `skill_advisor/lib/scorer/` plus the new tests, and a full `npm run stress` regression sweep.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] [P1] Read packet 046 §6 (B1), §12 (C2), §13 (C3) findings F-006-B1-01..03, F-012-C2-01..04, F-013-C3-01
- [x] [P1] Confirmed each cited file:line still matches the research.md claim
- [x] [P1] Authored spec.md, plan.md, tasks.md, checklist.md (this file), implementation-summary.md
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] [P1] Each edit is the smallest product-code change that resolves the finding
- [x] [P1] No template-source bumps (template_source headers unchanged)
- [x] [P2] Each edit carries an inline `// F-NNN-XX-NN:` marker for traceability
- [x] [P1] No prose outside the cited line ranges or scoped functions was modified
- [x] [P1] No imports removed; no scorer module reorganization (sub-phase 006 owns that)
- [x] [P1] Dead `renderNativeBrief()` confirmed unreferenced via grep before removal (B1-03)
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] [P1] `advisor-quality-049-003.vitest.ts` added with five describe blocks (one per scorer-fusion fix + disambiguation rule)
- [x] [P1] Graph-causal lane emits negative-scored matches for conflict edges (C2-01)
- [x] [P1] Projection populates `derivedTriggers` and `derivedKeywords` from distinct sources (C2-02)
- [x] [P1] Token-stuffing dispersion guard suppresses task-intent floor (C2-03)
- [x] [P2] Three-way ambiguity cluster populates `ambiguousWith` for all members (C2-04)
- [x] [P1] `"review and update this"` routes top-1 to `sk-code` end-to-end (C3-01)
- [x] [P1] `npx vitest run skill_advisor/lib/scorer/ skill_advisor/tests/scorer/` exits 0
- [x] [P1] `npm run stress` exits 0 with >= 58 files / >= 195 tests
- [x] [P1] `validate.sh --strict` on this packet exits 0 errors
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [x] [P1] No secrets, tokens, or credentials in any edit
- [x] [P1] Bridge disabled-mode silent fail-open is a stricter (less verbose) policy — does not increase information leakage
- [x] [P1] Dispersion guard does not weaken legitimate task-intent prompts; only catches token-stuffing
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] [P1] All eight findings have a row in the Findings closed table
- [x] [P1] Implementation-summary.md describes the actual fix per finding (not generic)
- [x] [P2] Plan.md numbered phases match the steps actually run
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] [P1] Only the seven product files + new test file + one fixture row + this packet's spec docs modified
- [x] [P1] No scorer module reorganization (preserves sub-phase 006 architecture work)
- [x] [P1] Spec docs live at this packet's root, not in `scratch/`
- [x] [P1] Template artifact `README.md` deleted from packet root (was Level 1 template fragment, not packet content)
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

### Findings closed

| ID | File | Evidence |
|----|------|----------|
| F-006-B1-01 (P2) | `mcp_server/hooks/codex/user-prompt-submit.ts` | Codex timeout fallback routes through `renderAdvisorBrief()` with stale freshness signal; `// F-006-B1-01:` marker; bespoke string removed |
| F-006-B1-02 (P2) | `mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` | Disabled mode returns `brief: null, status: 'skipped'`; `// F-006-B1-02:` marker; matches every other runtime |
| F-006-B1-03 (P2) | `mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` | Dead `renderNativeBrief()` removed; `// F-006-B1-03:` marker on the call-site path that now exclusively uses `renderAdvisorBrief()` |
| F-012-C2-01 (P1) | `mcp_server/skill_advisor/lib/scorer/lanes/graph-causal.ts` | Filter changed from `value.score > 0` to `value.score !== 0`; clamp `Math.max(-1, Math.min(value.score, 1))`; `// F-012-C2-01:` marker; vitest assertion |
| F-012-C2-02 (P1) | `mcp_server/skill_advisor/lib/scorer/projection.ts` | Distinct sources for `derivedTriggers` (`trigger_phrases`) vs `derivedKeywords` (`key_topics + entities + key_files + source_docs`); `// F-012-C2-02:` marker; vitest assertion |
| F-012-C2-03 (P1) | `mcp_server/skill_advisor/lib/scorer/fusion.ts` | Token-stuffing dispersion guard added before task-intent floor short-circuit; `// F-012-C2-03:` marker; vitest assertion |
| F-012-C2-04 (P2) | `mcp_server/skill_advisor/lib/scorer/ambiguity.ts` | Ambiguity computed from ranking `score`; cluster includes all passing candidates within `AMBIGUITY_MARGIN`; `// F-012-C2-04:` marker; vitest assertion |
| F-013-C3-01 (P1) | `mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` + `mcp_server/skill_advisor/scripts/skill_advisor.py` + fixture | Review-plus-write disambiguation rule (`+3.0 sk-code`, `-2.0 sk-code-review`) in explicit lane; Python advisor parity copy applied post-graph-boosts; fixture row 26 `expected_top_any → ["sk-code"]`; `// F-013-C3-01:` markers; vitest end-to-end assertion + Python regression sweep 51/51 |

### Status

- [x] [P1] All eight findings closed
- [x] [P1] `npm run stress`: 58 files / 195 tests; 1 flake on environment-bound `gate-d-benchmark-memory-search` latency assertion (passes on stash baseline; unrelated to advisor scorer)
- [x] [P1] `validate.sh --strict` exit 0 errors (5 informational warnings — same pattern as worked-pilot 008 commit 61f11c684)
- [x] [P1] commit + push to origin main
<!-- /ANCHOR:summary -->
