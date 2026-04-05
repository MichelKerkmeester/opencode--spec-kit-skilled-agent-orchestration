# Wave 1 Slice A01 - Agent 01 Notes

Date: 2026-02-16
Scope: docs-only updates for three target files plus this scratch note.

## Files Updated

1) `.opencode/install_guides/README.md`
2) `.opencode/install_guides/install_scripts/README.md`
3) `.opencode/skill/README.md`

## What Was Updated

### 1) `.opencode/install_guides/README.md`

- Corrected guide count from 9 to 10 in Key Statistics.
  - New detail: 5 MCP guides, 4 setup guides, 1 index guide.
- Updated skill version matrix under "Current Skills (9 total)" to match implemented `SKILL.md` versions.
  - `mcp-code-mode`: v1.0.4.0
  - `mcp-figma`: v1.0.2.0
  - `system-spec-kit`: v2.2.9.0
  - `workflows-chrome-devtools`: v1.0.1.0
  - `workflows-code--opencode`: v1.0.5.0
  - `workflows-code--web-dev`: v1.0.5.0
  - `sk-documentation`: v1.0.6.0
  - `workflows-git`: v1.0.2.0
- Replaced stale/ambiguous `workflows-code` references with existing skill paths.
  - Project type matrix now points to `workflows-code--web-dev` or `workflows-code--full-stack` as appropriate.
  - Learning resources now reference real files:
    - `.opencode/skill/workflows-code--web-dev/SKILL.md`
    - `.opencode/skill/workflows-code--full-stack/SKILL.md`
- Kept wording concise and factual; no cross-file scope expansion.

### 2) `.opencode/install_guides/install_scripts/README.md`

- Retitled document from "MCP Install Scripts" to "Component Install Scripts" for factual coverage.
- Updated overview wording to cover MCP servers and related tooling.
- Corrected script count in Key Statistics from 5 to 6.
  - Clarified breakdown: 5 component installers + 1 master installer.
- Updated install-time wording from "Per MCP" to "Per component".
- Updated "Available Scripts" table:
  - Column renamed from `MCP` to `Component`.
  - Clarified component types:
    - Core scripts labeled as MCP components
    - Chrome installer labeled as Chrome DevTools CLI
    - Figma installer labeled as Figma MCP
- Updated FAQ item from "all 5 MCPs" to "all 5 component installers" and corrected core/optional wording.

### 3) `.opencode/skill/README.md`

- Updated `system-spec-kit` version to v2.2.9.0.
- Verified the remaining eight listed skill versions already matched current `SKILL.md` files.
- No structural rewrites; kept existing section flow.

## Validation and Evidence Used

- Verified directory inventories directly:
  - `.opencode/install_guides/`
  - `.opencode/install_guides/install_scripts/`
  - `.opencode/skill/`
- Verified all skill versions from each skill frontmatter in:
  - `.opencode/skill/*/SKILL.md`
- Verified `_utils.sh` function count is 36 via function-definition pattern match.

## Scope Compliance

- No edits were made outside requested documentation files and this required scratch note.
- No code files or configuration files were modified.

## Tool Budget

- Completed within the 12-call budget.
