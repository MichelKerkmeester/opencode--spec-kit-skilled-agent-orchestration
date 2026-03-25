# Iteration 002 — Wave 1B: @orchestrate Agent Review

**Agent**: GPT-5.4 (high) via copilot CLI
**Status**: Complete
**Duration**: ~8 min

---

## Findings

### WAVE-1B-001
- **Severity**: P1
- **Dimension**: correctness
- **Files**: All 5 runtimes (orchestrate.md/.toml)
- **Finding**: Memory command surface still reduced to `/memory:save`. Missing 5 other commands (/memory:continue, /memory:analyze, /memory:manage, /memory:learn, /memory:shared). Resume routing still points to /spec_kit:resume instead of /memory:continue.
- **Evidence**: tool-schemas.ts: 33 tools. 012-command-alignment confirms 6-command live suite. .agents/commands/memory/ has all 6 command files.
- **Fix**: Update command suggestions and related-resources tables to include all 6 memory commands. Route resume cases to /memory:continue.

### WAVE-1B-002
- **Severity**: P1
- **Dimension**: traceability
- **Files**: All 5 runtimes (orchestrate.md/.toml)
- **Finding**: Prompt still names @explore as a LEAF and in illegal-chain examples, but @explore doesn't exist. All exploration routes through @context.
- **Evidence**: Each prompt says @context is exclusive exploration entry point, but still lists @explore in NDP/anti-pattern sections. Live runtime families: context, orchestrate, speckit, deep-review, deep-research, handover, review, debug, ultra-think, write — no explore.
- **Fix**: Remove @explore from LEAF inventories and examples. Use @context consistently.

### WAVE-1B-003
- **Severity**: P2
- **Dimension**: maintainability
- **Files**: All 5 runtimes (orchestrate.md/.toml)
- **Finding**: @deep-review exists in all runtime families but absent from priority dispatch table, task format, and agent-files list.
- **Evidence**: deep-review.md/.toml exists in all 5 runtimes. Orchestrate prompts never expose it as dispatch option.
- **Fix**: Add @deep-review to routing/delegation docs, or explicitly document it's only reachable via /spec_kit:deep-research:review.

### WAVE-1B-004
- **Severity**: P1
- **Dimension**: traceability
- **Files**: All 5 runtimes (orchestrate.md/.toml)
- **Finding**: Related-resources table references nonexistent `sk-code` path. Live skill surface uses sk-code--review plus stack overlays.
- **Evidence**: .opencode/skill/ contains sk-code--review, sk-code--opencode, sk-code--web, sk-code--full-stack. No sk-code/ directory.
- **Fix**: Replace sk-code references with sk-code--review for baseline.

## Summary

| Severity | Count |
|----------|-------|
| P0 | 0 |
| P1 | 3 |
| P2 | 1 |

**Overall Assessment**: NDP depth rules and @context-first exploration are consistent, but orchestrate docs are not aligned with post-022 memory command surface and current agent inventory. Biggest drift: stale routing/resource guidance.
