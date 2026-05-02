# Iteration 003 — Wave 2A: @speckit Agent Review

**Agent**: GPT-5.4 (high) via copilot CLI
**Status**: Complete
**Duration**: ~12 min

---

## Findings

### WAVE-2A-001
- **Severity**: P1
- **Dimension**: correctness
- **Files**: All 5 runtimes (speckit.md/.toml)
- **Finding**: Unqualified paths (`templates/level_N/`, `scripts/spec/create.sh`, `scripts/spec/validate.sh`, `scripts/templates/compose.sh`) that don't resolve from repo root and aren't the canonical locations.
- **Evidence**: Live assets at `.opencode/skill/system-spec-kit/templates/{level_1,level_2,level_3,level_3+}` and `.opencode/skill/system-spec-kit/scripts/spec/...`. Repo-root `templates/` and `scripts/spec/` do not exist.
- **Fix**: Replace with canonical repo-rooted paths or state paths are relative to skill root.

### WAVE-2A-002
- **Severity**: P1
- **Dimension**: security
- **Files**: All 5 runtimes (speckit.md/.toml)
- **Finding**: EXCLUSIVITY exception for `memory/` is too broad — permits inference that memory/ writes are generally exempt rather than enforcing generate-context.js only.
- **Evidence**: Files say "Files in memory/ (uses generate-context.js) ... are also excepted." Current command docs mandate memory files MUST be created via generate-context.js.
- **Fix**: Explicitly allow only /memory:save or generate-context.js, add hard prohibition on direct Write/Edit into memory/.

### WAVE-2A-003
- **Severity**: P2
- **Dimension**: traceability
- **Files**: All 5 runtimes (speckit.md/.toml)
- **Finding**: Memory-surface docs list only 5 commands, omit `/memory:shared`.
- **Evidence**: None mention /memory:shared. Current surface is 6 commands.
- **Fix**: Add /memory:shared to command surface enumeration.

### WAVE-2A-004
- **Severity**: P2
- **Dimension**: correctness
- **File**: `.codex/agents/speckit.toml` only
- **Finding**: Codex runtime labels /memory:learn as "Explicit learning" (stale post-constitutional refactor).
- **Evidence**: `.codex/agents/speckit.toml` ~536 says "Explicit learning" vs current "Constitutional Memory Manager".
- **Fix**: Rename to "Constitutional memory manager".

## Summary

| Severity | Count |
|----------|-------|
| P0 | 0 |
| P1 | 2 |
| P2 | 2 |

**Overall Assessment**: Level definitions aligned, but runtime docs need cleanup on canonical paths, memory-write governance, and post-022 memory command surface.
