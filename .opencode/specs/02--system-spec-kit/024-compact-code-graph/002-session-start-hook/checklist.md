# Checklist: Phase 2 — SessionStart Hook

## P0
- [ ] SessionStart hook registered in settings.local.json
- [ ] Source routing works for all 4 sources (startup, resume, clear, compact)
- [ ] `profile: "resume"` passed for compact brief format
- [ ] Output includes constitutional memories on all paths
- [ ] startup/resume output ≤ 2000 tokens
- [ ] compact output ≤ 4000 tokens
- [ ] Script completes in < 3 seconds
- [ ] Graceful fallback when MCP unavailable

## P1
- [ ] Resume path surfaces prior work and last spec folder
- [ ] Startup path includes recent spec folder overview
- [ ] Clear path outputs minimal (constitutional only)
- [ ] No code duplication with Phase 1 compact path
- [ ] `/spec_kit:resume` command updated to pass `profile: "resume"` (fix gap from iter 012)

## P2
- [ ] Token pressure awareness (reduce output when context window filling)
- [ ] Spec folder auto-detected from project context
- [ ] Working memory attention signals included
