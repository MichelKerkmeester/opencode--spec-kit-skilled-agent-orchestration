---
title: "Spec 120: Node Modules Relocation [120-node-modules-relocation/spec]"
description: "Move node_modules from system-spec-kit/node_modules/ (workspace-hoisted) into mcp_server/node_modules/ where dependencies actually belong."
trigger_phrases:
  - "spec"
  - "120"
  - "node"
  - "modules"
  - "relocation"
importance_tier: "important"
contextType: "decision"
---
# Spec 120: Node Modules Relocation

<!-- ANCHOR:metadata -->
## Goal
Move node_modules from `system-spec-kit/node_modules/` (workspace-hoisted) into `mcp_server/node_modules/` where dependencies actually belong.

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## Rationale
Dependencies are primarily consumed by the MCP server. Having them at the workspace root is confusing — they should live next to the package.json that declares them.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## Approach
- Add `.npmrc` with `install-strategy=nested` to disable hoisting
- Remove redundant root-level `better-sqlite3` dependency
- Reinstall with nested strategy so each workspace member gets its own `node_modules/`
- Update all documentation, source code, and install script references
- Rebuild TypeScript and verify MCP server starts

<!-- /ANCHOR:scope -->

<!-- ANCHOR:what-built -->
## Files Changed
- `.opencode/skill/system-spec-kit/.npmrc` (NEW)
- `.opencode/skill/system-spec-kit/package.json`
- `.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts`
- `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`
- `.opencode/skill/system-spec-kit/mcp_server/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/core/README.md`
- `.opencode/install_guides/README.md`
- `.opencode/install_guides/install_scripts/install-spec-kit-memory.sh`
- `.opencode/skill/system-spec-kit/scripts/setup/check-native-modules.sh`
- `.opencode/skill/system-spec-kit/scripts/setup/rebuild-native-modules.sh`
- `.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js`

<!-- /ANCHOR:what-built -->
