# Iteration 004 — Waves 3-5 Consolidated: Cross-Agent Pattern Analysis

**Method**: Direct grep analysis across all 50 agent files (all 5 runtimes × 10 agents)
**Status**: Complete
**Agents Covered**: @deep-research, @handover, @review, @debug, @ultra-think, @write

---

## Cross-Agent Findings

### CROSS-001
- **Severity**: P1
- **Dimension**: traceability
- **Agents Affected**: @orchestrate (all 5 runtimes)
- **Finding**: `@explore` referenced in LEAF lists and NDP examples across all 5 orchestrate runtimes, but no `explore.md`/`explore.toml` exists in any runtime family.
- **Evidence**:
  - `.opencode/agent/orchestrate.md:112,142,747`
  - `.opencode/agent/chatgpt/orchestrate.md:127,157,779`
  - `.claude/agents/orchestrate.md:107,137,742`
  - `.codex/agents/orchestrate.toml:119,149,771`
  - `.agents/agents/orchestrate.md:107,137,742`
- **Fix**: Replace `@explore` with `@context` in all LEAF lists and NDP examples.

### CROSS-002
- **Severity**: P1
- **Dimension**: traceability
- **Agents Affected**: @orchestrate (all 5 runtimes)
- **Finding**: `@general` referenced in LEAF lists across orchestrate agents, but no `general.md`/`general.toml` exists in any runtime family.
- **Evidence**: `@general` appears in orchestrate LEAF list at same locations as @explore. Also referenced in speckit, debug, and context agents (8 files total across base and chatgpt runtimes).
- **Fix**: Remove `@general` from LEAF lists or add it as an actual agent definition.

### CROSS-003
- **Severity**: P1
- **Dimension**: correctness
- **Agents Affected**: @review (all 5 runtimes)
- **Finding**: All review agents reference `sk-code` as a baseline skill to load, but `.opencode/skill/sk-code/` does not exist. The actual skill is `sk-code--review`.
- **Evidence**:
  - `.opencode/agent/review.md:32,48,75,221,285` — "load sk-code baseline"
  - `.opencode/agent/chatgpt/review.md:32,48,77,223,287`
  - `.claude/agents/review.md:26,42,69,215,279`
  - `.codex/agents/review.toml:19,35,64,210,274`
  - `.agents/agents/review.md:26,42,69,215,279`
  - `.opencode/skill/sk-code--review/` exists; `.opencode/skill/sk-code/` does NOT
- **Fix**: Replace `sk-code` with `sk-code--review` as the baseline. Update the overlay detection pattern.

### CROSS-004
- **Severity**: P2
- **Dimension**: maintainability
- **Agents Affected**: ALL agents (all runtimes)
- **Finding**: No agent file across any runtime references `/memory:shared`. The 6-command memory surface is underdocumented.
- **Evidence**: `grep -r "/memory:shared" .opencode/agent/ .claude/agents/ .codex/agents/ .agents/agents/` returns 0 matches.
- **Fix**: Add /memory:shared to command surface enumerations where memory commands are listed.

### CROSS-005
- **Severity**: P2
- **Dimension**: correctness
- **Agents Affected**: @deep-research, @handover, @debug, @ultra-think, @write (all runtimes)
- **Finding**: These agents have no specific content drift from 022-hybrid-rag-fusion. Their core behavioral instructions, state protocols, and permission boundaries are aligned with current system. The missing /memory:shared reference is the only cross-cutting issue.
- **Evidence**: Behavioral instructions (LEAF constraints, write permissions, state formats) match current system protocols. Core tools (memory_context, memory_search) are correctly referenced where needed.
- **Fix**: No agent-specific fixes needed beyond CROSS-004.

## Summary

| Severity | Count |
|----------|-------|
| P0 | 0 |
| P1 | 3 |
| P2 | 2 |

**Convergence Assessment**: Strong convergence. The same 3 P1 patterns (@explore stale, @general stale, sk-code dead path) account for all material drift. The remaining 7 agents (waves 3-5) show no agent-specific alignment issues beyond the cross-cutting /memory:shared gap.
