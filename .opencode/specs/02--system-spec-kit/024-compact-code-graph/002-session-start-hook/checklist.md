---
title: "Checklist: Phase 2 — SessionStart Hook [02--system-spec-kit/024-compact-code-graph/002-session-start-hook/checklist]"
description: "checklist document for 002-session-start-hook."
trigger_phrases:
  - "checklist"
  - "phase"
  - "sessionstart"
  - "hook"
  - "002"
  - "session"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: Phase 2 — SessionStart Hook

## P0
- [x] SessionStart hook registered in settings.local.json
- [x] Source routing works for all 4 sources (startup, resume, clear, compact)
- [x] `profile: "resume"` passed for compact brief format
- [x] Output includes constitutional memories on all paths
- [x] startup/resume output ≤ 2000 tokens
- [x] compact output ≤ 4000 tokens
- [x] Script completes in < 3 seconds
- [x] Graceful fallback when MCP unavailable

## P1
- [x] Resume path surfaces prior work and last spec folder
- [x] Startup path includes recent spec folder overview
- [x] Clear path outputs minimal (constitutional only)
- [x] No code duplication with Phase 1 compact path
- [x] `/spec_kit:resume` command updated to pass `profile: "resume"` (fix gap from iter 012)

## P2
- [ ] Token pressure awareness (reduce output when context window filling)
- [ ] Spec folder auto-detected from project context
- [ ] Working memory attention signals included
