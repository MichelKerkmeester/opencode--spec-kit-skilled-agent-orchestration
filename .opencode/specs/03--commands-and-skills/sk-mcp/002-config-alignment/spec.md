---
title: "Spec: Figma MCP Configuration Alignment [002-config-alignment/spec]"
description: "The Figma MCP configuration across the codebase was using deprecated package names and outdated environment variable references. This caused inconsistency between documentation ..."
trigger_phrases:
  - "spec"
  - "figma"
  - "mcp"
  - "configuration"
  - "alignment"
  - "014"
  - "config"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 1 -->

<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Spec: Figma MCP Configuration Alignment

> **Status:** ✅ Complete | **Level:** 1 | **LOC:** ~200

---

<!-- ANCHOR:problem -->
## Problem Statement

The Figma MCP configuration across the codebase was using deprecated package names and outdated environment variable references. This caused inconsistency between documentation and actual configuration.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## Scope

Update all Figma MCP references to use:
- Package: `figma-developer-mcp` (replacing `mcp-figma`)
- Env var: `FIGMA_API_KEY` (replacing `FIGMA_PERSONAL_ACCESS_TOKEN`)
- Args: Add `--stdio` flag

Additionally, improve security by using `${VAR}` substitution in `.utcp_config.json`.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:success-criteria -->
## Success Criteria

- [x] All config files use new package name
- [x] All documentation uses new env var name
- [x] All examples include `--stdio` flag
- [x] `.utcp_config.json` uses `${VAR}` substitution for all API keys
- [x] No duplicate Figma entries in `opencode.json`
- [x] Grep verification shows no old references

<!-- /ANCHOR:success-criteria -->

---

## Out of Scope

- Testing Figma MCP functionality (requires valid API key)
- Syncing changes to Public repo (separate task)

---

## Files Changed

See `memory/01-01-26_15-02__config-alignment.md` for complete list.
