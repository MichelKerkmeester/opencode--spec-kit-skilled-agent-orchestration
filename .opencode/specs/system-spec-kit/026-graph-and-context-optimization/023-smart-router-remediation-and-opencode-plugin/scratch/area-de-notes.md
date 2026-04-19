# Area D + E Notes

## Scope

- Agent beta owns Area D static smart-router check and Area E observe-only telemetry harness.
- Files touched stay inside the requested beta boundary, plus the permitted `.gitignore` telemetry state entry.

## Area D

- Kept the CI-facing script name as `check-smart-router.sh`.
- Implemented parsing with an embedded `python3` runner because multiline pseudocode and router variants are more reliable to parse in Python than in shell.
- The script scans top-level `.opencode/skill/*/SKILL.md` files only.
- JSON output uses the requested `{errors, warnings}` shape.
- Bloat warnings include `SKILL.md` in both ALWAYS bytes and loadable-tree bytes. Missing resources remain the only failing condition.
- Current-tree run result: exit 0 with 0 missing paths. The expected stale mcp-code-mode/sk-improve-agent paths were already absent by the time beta verified.
- Current-tree bloat warnings: mcp-chrome-devtools, mcp-clickup, mcp-coco-index, mcp-figma, sk-code-review.

## Area E

- Added observe-only JSONL telemetry at `.opencode/skill/.smart-router-telemetry/compliance.jsonl`.
- Added `SPECKIT_SMART_ROUTER_TELEMETRY_DIR` as a directory override so tests do not write to the real telemetry state directory. The current harness also supports `SPECKIT_SMART_ROUTER_TELEMETRY_PATH`.
- `classifyCompliance` accepts optional tier prefixes (`always:`, `conditional:`, `on_demand:`, `expected:`). Unprefixed resources are treated as `always`; `expected:` marks a resource as required for `missing_expected`.
- Unsafe newline/control characters in resource paths are sanitized before persistence; telemetry write failures are swallowed to preserve observe-only behavior.
- Verification: `npx vitest run smart-router-telemetry` passed from the MCP server workspace (2 files, 16 tests).
