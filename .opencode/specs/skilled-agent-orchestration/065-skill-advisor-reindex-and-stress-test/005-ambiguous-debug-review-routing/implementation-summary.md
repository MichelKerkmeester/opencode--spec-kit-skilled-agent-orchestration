---
title: "Implementation Summary: 065/005 - ambiguous debug review routing"
description: "Completed phase summary for ambiguous debug/review route calibration."
trigger_phrases: ["065/005 implementation summary"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/005-ambiguous-debug-review-routing"
    last_updated_at: "2026-05-03T12:09:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed CP-100 ambiguous route calibration"
    next_safe_action: "root_final_validation"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Summary: 065/005 - ambiguous debug review routing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status:** Complete

<!-- ANCHOR:metadata -->
## 1. METADATA
| Sub-phase | 065/005 |
| Status | Complete |
| Completion | 100% |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT
Added an ambiguous code-problem signal for prompts that ask to figure out, find, diagnose, or debug what is wrong with code.

The calibration moves those prompts toward review/debug candidates:

- `sk-code-review` gets the primary boost.
- `sk-deep-review` gets a smaller supporting boost.
- broad `sk-code` is dampened only for ambiguous problem-diagnosis language.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED
The native TypeScript scorer and Python fallback were both updated. Regression tests cover the ambiguous CP-100 prompt and a clear implementation control so review/debug routing does not steal build requests.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS
- Keep the route calibrated rather than overconfident.
- Prefer `sk-code-review` for ordinary "what's wrong with my code" language.
- Preserve `sk-code` for clear implementation requests.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION
- CP-100 direct probe: `sk-code-review` top-1 at confidence 0.82.
- Clear implementation control: `sk-code` top-1 at confidence 0.95.
- Focused tests: 23 tests passed.
- Full advisor tests: 40 files and 297 tests passed.
- Typecheck and build passed.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS
The signal is intentionally phrased for problem-diagnosis language. Other vague code prompts may still need separate calibration if future stress campaigns expose misses.
<!-- /ANCHOR:limitations -->
