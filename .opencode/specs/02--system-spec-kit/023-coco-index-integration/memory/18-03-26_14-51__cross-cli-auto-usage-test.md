---
title: "Cross-CLI CocoIndex Auto-Usage Test Results"
description: "Empirical test proving all 3 working CLIs (Claude Code, Gemini, Copilot) auto-discover and use CocoIndex MCP search tool for semantic queries without agent routing changes. Codex blocked by billing. Copilot MCP reliability issue found."
trigger_phrases:
  - "cocoindex auto usage"
  - "cross-cli cocoindex test"
  - "cocoindex test results"
  - "does cocoindex get used"
  - "phase 2 agent routing"
  - "copilot mcp reliability"
  - "cocoindex copilot issue"
key_topics:
  - cocoindex auto-discovery
  - cross-cli validation
  - mcp tool selection
  - copilot mcp reliability
  - phase 2 deprioritization
importance_tier: "important"
contextType: "testing"
---

# Cross-CLI CocoIndex Auto-Usage Test (2026-03-18)

## Task
Sent 3 semantic code-search prompts to 4 CLIs (Claude Code, Codex, Gemini, Copilot) to determine whether AI models spontaneously use the CocoIndex MCP `search` tool without explicit agent routing.

## Results Matrix

| CLI | P1 (implicit) | P2 (explicit) | P3 (trigger) |
|-----|---------------|---------------|--------------|
| Claude Code | USED_COCOINDEX | USED_COCOINDEX | USED_COCOINDEX |
| Codex | ERROR (billing) | ERROR (billing) | ERROR (billing) |
| Gemini | USED_COCOINDEX | USED_COCOINDEX | USED_COCOINDEX |
| Copilot | USED_COCOINDEX* | USED_COCOINDEX | USED_COCOINDEX* |

*Copilot MCP search returned 0 results for P1/P3; fell back to Grep + ccc CLI.

## Key Findings

1. All 3 working CLIs auto-discover CocoIndex from the MCP tool description alone.
2. Phase 2 agent routing (@context integration) may be unnecessary -- models choose CocoIndex spontaneously.
3. Gemini is most CocoIndex-native (exclusive use in 2/3 prompts, minimal tokens).
4. Copilot MCP reliability issue: `search` returns 0 results for implicit queries but works for explicit. Same daemon serves Gemini/Claude Code successfully.
5. Codex cannot be evaluated (OpenAI billing limit).

## Decisions

- Deprioritize Phase 2 @context agent routing based on auto-discovery evidence.
- Copilot MCP reliability warrants a separate investigation (query serialization or transport issue).

## Artifacts

- Full test results: `scratch/cross-cli-auto-usage-test-results.md`
- Log files: `/tmp/cocoindex-test-{codex,gemini,copilot}-{p1,p2,p3}.log`

## Next Steps

- Retest Codex when billing resolved
- Debug Copilot MCP 0-result issue (separate spec or scratch investigation)
- Update implementation-summary.md with Phase 2 deprioritization rationale
