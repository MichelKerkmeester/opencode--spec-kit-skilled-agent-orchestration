---
title: "Debug Delegation Checklist [002-debugger/checklist]"
description: "checklist document for 002-debugger."
trigger_phrases:
  - "debug"
  - "delegation"
  - "checklist"
  - "002"
  - "debugger"
importance_tier: "normal"
contextType: "implementation"
---
# Debug Delegation Checklist

## P0 - Must Complete
- [x] `/spec_kit:debug` command file created (591 lines at .opencode/command/spec_kit/debug.md)
- [x] Model selection phase is MANDATORY (Phase 2 with HARD STOP)
- [x] Sub-agent dispatch uses Task tool correctly (Step 3 with full prompt)
- [x] SKILL.md updated with debug workflow (Section 6, lines 514-585)
- [x] Command table updated (7 commands, line 77)

## P1 - Should Complete
- [x] Auto-suggestion logic implemented in SKILL.md (debug_triggers, lines 527-538)
- [x] Trigger keywords expanded (frustration, help requests, repeated failures)
- [x] README.md updated (lines 40, 714, 728, 807-825)
- [x] AGENTS.md (both) updated (lines 37, 357, 540 / lines 37, 351, 358)
- [x] implementation-phase.md updated (lines 25-27, 53-71)
- [x] template_guide.md updated (lines 636-714)

## P2 - Nice to Have
- [x] Memory database paths verified (clean, no issues)
- [ ] Example debug session documented
