# Plan: 017 — Agent Alignment

## Overview

Sync 18 stale agent files across 2 runtimes (Claude, Gemini) with canonical `.opencode/agent/` definitions. ~18 files, body-content sync with frontmatter preservation.

---

## Phases

### Phase 0: Diff Analysis
- Read all 9 canonical agent files
- Read all 9 Claude agent files — identify frontmatter to preserve and body drift
- Read all 9 Gemini agent files — identify frontmatter to preserve and body drift
- Produce per-file change report

### Phase 1: Claude Runtime Sync (9 files)
For each of the 9 agents in `.claude/agents/`:
1. Extract and preserve Claude-specific frontmatter (`tools:`, `model:`, `mcpServers:`)
2. Copy body content from canonical `.opencode/agent/X.md`
3. Update path convention directive to `.claude/agents/`
4. Write updated file

### Phase 2: Gemini Runtime Sync (9 files)
For each of the 9 agents in `.gemini/agents/`:
1. Extract and preserve Gemini-specific frontmatter (`kind:`, `model:`, `tools:`, `max_turns:`, `timeout_mins:`)
2. Copy body content from canonical `.opencode/agent/X.md`
3. Update path convention directive to `.gemini/agents/`
4. Write updated file

### Phase 3: Verification
- Verify body content parity across all 3 variants (canonical, Claude, Gemini)
- Verify frontmatter integrity per runtime
- Spot-check ChatGPT and Codex remain in sync
- File size sanity check

---

## Architecture Decisions

1. **Body-only sync:** Copy everything after YAML frontmatter (the `---` delimiters) from canonical. Frontmatter is runtime-specific and must be preserved per-runtime.
2. **Path convention directive:** Each runtime's agent files contain a line like `Use only .opencode/agent/*.md as the canonical runtime path reference`. This must be updated to match the runtime's own path.
3. **No content changes:** This is a mechanical sync. No behavioral modifications, no refactoring, no improvements.
4. **Frontmatter preservation rules:**
   - Claude: `tools:` (list), `model:` (sonnet/opus), `mcpServers:` (includes code_mode)
   - Gemini: `kind: local`, `model: gemini-3.1-pro-preview`, `tools:` (Gemini-style names), `max_turns:`, `timeout_mins:`

---

## Delegation Strategy

Per the plan, delegation uses single-hop agents at depth 1. However, since this is a mechanical sync operation with well-defined inputs/outputs, direct execution is more efficient than multi-agent coordination. The spec files document the delegation strategy for reference, but implementation proceeds with direct file operations.

---

## Risk Assessment

| Risk | Impact | Mitigation |
| ---- | ------ | ---------- |
| Frontmatter corruption | High — agent won't load | Read frontmatter carefully, preserve exact format |
| Path directive mismatch | Medium — wrong file refs | Pattern-match and replace per runtime |
| Missing agent file | Low — all 9 exist in all runtimes | Verify count before and after |
