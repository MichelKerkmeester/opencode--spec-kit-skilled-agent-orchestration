# Checklist: Phase 4 — Cross-Runtime Fallback

## P0
- [ ] CLAUDE.md compaction recovery enhanced with `memory_context({ mode: "resume", profile: "resume" })`
- [ ] Codex CLI compaction recovery tested and working (tool-based)
- [ ] No regression in existing Gate system
- [ ] `memory_match_triggers` fires reliably post-compaction
- [ ] Runtime detection produces both `runtime` and `hookPolicy`

## P1
- [ ] `.claude/CLAUDE.md` created with Claude-specific recovery (closes Gap B)
- [ ] CODEX.md updated with recovery instructions
- [ ] Copilot runtime tested (tool fallback by policy)
- [ ] Gemini runtime tested (tool fallback by policy)
- [ ] Cross-runtime behavior documented
- [ ] 7-scenario test matrix from iter 015 implemented

## P2
- [ ] MCP-level compaction detection (time gap analysis)
- [ ] `SPECKIT_AUTO_COMPACT_DETECT` feature flag
- [ ] Runtime fixture contract (iter 015) as reusable test harness
- [ ] Copilot/Gemini hook adapters planned for v2
