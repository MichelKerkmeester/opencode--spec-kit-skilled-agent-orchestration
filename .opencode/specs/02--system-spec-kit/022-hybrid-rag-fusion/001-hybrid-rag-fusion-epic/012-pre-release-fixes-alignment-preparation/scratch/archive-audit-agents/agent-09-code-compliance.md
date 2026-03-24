Files audited: 190

Per language:
- JavaScript: 34/34 pass
- Python: 22/27 pass
- Shell: 73/76 pass
- JSON/JSONC: 53/53 pass

VIOLATIONS:
- `MEDIUM` [.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md):16 `Primary audit target in the request is stale; the live memory MCP server is under system-spec-kit/mcp_server, not .opencode/mcp/memory-mcp-server/src.` Evidence: the install guide points to `.opencode/skill/system-spec-kit/mcp_server`, and the runtime entry is published from [.opencode/skill/system-spec-kit/mcp_server/package.json](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/package.json):5.
- `MEDIUM` [.opencode/skill/mcp-code-mode/scripts/validate_config.py](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/mcp-code-mode/scripts/validate_config.py):375 `CLI script manually parses sys.argv instead of using argparse.` Evidence: positional parsing at lines 375-383 with a hand-rolled `--check-env` branch.
- `LOW` [.opencode/skill/sk-doc/scripts/init_skill.py](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/sk-doc/scripts/init_skill.py):405 `CLI script manually parses sys.argv instead of using argparse.` Evidence: direct index access via `sys.argv[1]` and `sys.argv[3]` at lines 405-419.
- `LOW` [.opencode/skill/sk-doc/scripts/package_skill.py](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/sk-doc/scripts/package_skill.py):501 `CLI script manually parses sys.argv instead of using argparse.` Evidence: ad hoc flag extraction and positional filtering at lines 501-517.
- `LOW` [.opencode/skill/sk-doc/scripts/quick_validate.py](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/sk-doc/scripts/quick_validate.py):120 `CLI script manually parses sys.argv instead of using argparse.` Evidence: manual `--json` detection and positional filtering at lines 120-132.
- `LOW` [.opencode/skill/sk-doc/scripts/extract_structure.py](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/sk-doc/scripts/extract_structure.py):1235 `CLI script manually parses sys.argv instead of using argparse.` Evidence: direct positional access at lines 1235-1241.
- `LOW` [.opencode/skill/mcp-coco-index/scripts/common.sh](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/mcp-coco-index/scripts/common.sh):1 `Shell helper has the correct bash shebang but never enables set -euo pipefail.` Evidence: lines 1-30 begin executing readonly/path setup without any strict-mode declaration.
- `LOW` [.opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh):63 `Strict mode is present, but not near the top of the script.` Evidence: `set -euo pipefail` is deferred until line 63 after a long header block.
- `LOW` [.opencode/skill/system-spec-kit/scripts/templates/compose.sh](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/templates/compose.sh):52 `Strict mode is present, but not near the top of the script.` Evidence: `set -euo pipefail` appears at line 52 after the full usage/spec banner.

SUMMARY:
The requested standards are mostly in good shape. JavaScript passed cleanly on `'use strict'`, CommonJS/ESM separation, and I did not find a clear unhandled async path in the reviewed risky entrypoints; the many `console.log` calls were in test runners or intentional CLI/stdout emitters, so I did not count them as logging violations. Python’s main gap is consistent CLI argument handling, Shell’s main gap is strict-mode placement or absence in a few scripts, and all audited JSON/JSONC parsed successfully with no syntax or trailing-comma failures.

One important readiness note: the requested `.opencode/mcp/memory-mcp-server/src/` target does not exist in the current tree. The live memory MCP implementation is under `.opencode/skill/system-spec-kit/mcp_server`, and its runtime is TypeScript-based, so any follow-up audit that needs the actual memory server logic should pivot there explicitly.
