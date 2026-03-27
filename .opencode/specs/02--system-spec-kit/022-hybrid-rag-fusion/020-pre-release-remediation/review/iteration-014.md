# Iteration 014 -- Maintainability: broken installer path and packet-local README drift

**Agent:** GPT-5.4 (Codex main run)
**Dimension:** maintainability
**Status:** insight
**Timestamp:** 2026-03-27T17:11:00+01:00

## Findings

No new findings. This pass strengthened `HRF-DR-004`.

## Evidence Reinforced
- `.opencode/install_guides/install_scripts/install-cocoindex-code.sh` still points to `../../skill/mcp-cocoindex-code/scripts/install.sh`, which no longer exists.
- `004-ux-hooks-automation/README.md:2,14` still labels itself `007` and says MCP smoke validation confirms `28 tools`, which is stale against the current 33-tool server surface.

## Next Adjustment
- Sweep remaining root planning-surface hygiene before synthesis.
