---
title: "Plan: Figma MCP Configuration Alignment [002-config-alignment/plan]"
description: "1. Search for all old references using grep"
trigger_phrases:
  - "plan"
  - "figma"
  - "mcp"
  - "configuration"
  - "alignment"
  - "014"
  - "config"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Plan: Figma MCP Configuration Alignment

> **Spec:** [spec.md](./spec.md) | **Status:** ✅ Complete

---

<!-- ANCHOR:summary -->
## Approach

1. Search for all old references using grep
2. Update each file systematically
3. Verify no old references remain
4. Document changes in memory file

<!-- /ANCHOR:summary -->

---

## Execution Log

### Phase 1: Discovery
- Searched for `FIGMA_PERSONAL_ACCESS_TOKEN` → Found in multiple files
- Searched for `mcp-figma` → Found in config and docs
- Searched for `@modelcontextprotocol/server-figma` → Found in opencode.json

### Phase 2: Configuration Updates
- Updated `.utcp_config.json` with new package, env var, and ${VAR} substitution
- Removed duplicate Figma HTTP entry from `opencode.json`

### Phase 3: Documentation Updates
- Updated mcp-figma skill files (SKILL.md, README.md, quick_start.md)
- Updated mcp-code-mode references and assets
- Updated install guides and scripts

### Phase 4: Verification
- Grep confirmed no old references remain
- All files use consistent new configuration

---

## Outcome

All Figma MCP references aligned to use:
- Package: `figma-developer-mcp`
- Env var: `FIGMA_API_KEY`
- Args: `["-y", "figma-developer-mcp", "--stdio"]`

Security improved with `${VAR}` substitution for all API keys in `.utcp_config.json`.
