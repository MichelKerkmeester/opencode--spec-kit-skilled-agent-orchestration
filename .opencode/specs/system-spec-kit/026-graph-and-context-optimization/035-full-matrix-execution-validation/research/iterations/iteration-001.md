# Iteration 001: Frozen Matrix Scope

## Scope Freeze

Source matrix: packet 030 corpus plan and executor guide. Freeze time: 2026-04-29T14:45:00Z. This list was frozen before aggregation. Status values here are applicability only: `applicable` means the cell is in the execution universe; `not_applicable_with_reason` means the cell is intentionally excluded from scoring. Runtime outcomes are recorded in `results/*.jsonl` and `findings.md`.

| Cell | Applicability | Reason |
|------|---------------|--------|
| F1-cli-codex | applicable | applicable: 030 corpus marks F1 applicable for cli-codex, cli-copilot, cli-opencode, native, inline; fixture-only unless write-approved for cli-gemini and cli-claude-code. |
| F1-cli-copilot | applicable | applicable: 030 corpus marks F1 applicable for cli-codex, cli-copilot, cli-opencode, native, inline; fixture-only unless write-approved for cli-gemini and cli-claude-code. |
| F1-cli-gemini | applicable | applicable: 030 corpus marks F1 applicable for cli-codex, cli-copilot, cli-opencode, native, inline; fixture-only unless write-approved for cli-gemini and cli-claude-code. |
| F1-cli-claude-code | applicable | applicable: 030 corpus marks F1 applicable for cli-codex, cli-copilot, cli-opencode, native, inline; fixture-only unless write-approved for cli-gemini and cli-claude-code. |
| F1-cli-opencode | applicable | applicable: 030 corpus marks F1 applicable for cli-codex, cli-copilot, cli-opencode, native, inline; fixture-only unless write-approved for cli-gemini and cli-claude-code. |
| F1-native | applicable | applicable: 030 corpus marks F1 applicable for cli-codex, cli-copilot, cli-opencode, native, inline; fixture-only unless write-approved for cli-gemini and cli-claude-code. |
| F1-inline | applicable | applicable: 030 corpus marks F1 applicable for cli-codex, cli-copilot, cli-opencode, native, inline; fixture-only unless write-approved for cli-gemini and cli-claude-code. |
| F2-cli-codex | applicable | applicable: 030 corpus marks F2 applicable for cli-codex, cli-copilot, cli-opencode, native, inline and adapter-simulation for cli-gemini/cli-claude-code. |
| F2-cli-copilot | applicable | applicable: 030 corpus marks F2 applicable for cli-codex, cli-copilot, cli-opencode, native, inline and adapter-simulation for cli-gemini/cli-claude-code. |
| F2-cli-gemini | applicable | applicable: 030 corpus marks F2 applicable for cli-codex, cli-copilot, cli-opencode, native, inline and adapter-simulation for cli-gemini/cli-claude-code. |
| F2-cli-claude-code | applicable | applicable: 030 corpus marks F2 applicable for cli-codex, cli-copilot, cli-opencode, native, inline and adapter-simulation for cli-gemini/cli-claude-code. |
| F2-cli-opencode | applicable | applicable: 030 corpus marks F2 applicable for cli-codex, cli-copilot, cli-opencode, native, inline and adapter-simulation for cli-gemini/cli-claude-code. |
| F2-native | applicable | applicable: 030 corpus marks F2 applicable for cli-codex, cli-copilot, cli-opencode, native, inline and adapter-simulation for cli-gemini/cli-claude-code. |
| F2-inline | applicable | applicable: 030 corpus marks F2 applicable for cli-codex, cli-copilot, cli-opencode, native, inline and adapter-simulation for cli-gemini/cli-claude-code. |
| F3-cli-codex | applicable | applicable: 030 corpus marks F3 applicable for cli-codex, cli-copilot, cli-opencode, native-command, inline-tool and fixture-only unless MCP is available for cli-gemini/cli-claude-code. |
| F3-cli-copilot | applicable | applicable: 030 corpus marks F3 applicable for cli-codex, cli-copilot, cli-opencode, native-command, inline-tool and fixture-only unless MCP is available for cli-gemini/cli-claude-code. |
| F3-cli-gemini | applicable | applicable: 030 corpus marks F3 applicable for cli-codex, cli-copilot, cli-opencode, native-command, inline-tool and fixture-only unless MCP is available for cli-gemini/cli-claude-code. |
| F3-cli-claude-code | applicable | applicable: 030 corpus marks F3 applicable for cli-codex, cli-copilot, cli-opencode, native-command, inline-tool and fixture-only unless MCP is available for cli-gemini/cli-claude-code. |
| F3-cli-opencode | applicable | applicable: 030 corpus marks F3 applicable for cli-codex, cli-copilot, cli-opencode, native-command, inline-tool and fixture-only unless MCP is available for cli-gemini/cli-claude-code. |
| F3-native | applicable | applicable: 030 corpus marks F3 applicable for cli-codex, cli-copilot, cli-opencode, native-command, inline-tool and fixture-only unless MCP is available for cli-gemini/cli-claude-code. |
| F3-inline | applicable | applicable: 030 corpus marks F3 applicable for cli-codex, cli-copilot, cli-opencode, native-command, inline-tool and fixture-only unless MCP is available for cli-gemini/cli-claude-code. |
| F4-cli-codex | applicable | applicable: 030 corpus marks F4 with the same executor reachability as F3. |
| F4-cli-copilot | applicable | applicable: 030 corpus marks F4 with the same executor reachability as F3. |
| F4-cli-gemini | applicable | applicable: 030 corpus marks F4 with the same executor reachability as F3. |
| F4-cli-claude-code | applicable | applicable: 030 corpus marks F4 with the same executor reachability as F3. |
| F4-cli-opencode | applicable | applicable: 030 corpus marks F4 with the same executor reachability as F3. |
| F4-native | applicable | applicable: 030 corpus marks F4 with the same executor reachability as F3. |
| F4-inline | applicable | applicable: 030 corpus marks F4 with the same executor reachability as F3. |
| F5-cli-codex | applicable | applicable: 030 corpus marks F5 with the same executor reachability as F3. |
| F5-cli-copilot | applicable | applicable: 030 corpus marks F5 with the same executor reachability as F3. |
| F5-cli-gemini | applicable | applicable: 030 corpus marks F5 with the same executor reachability as F3. |
| F5-cli-claude-code | applicable | applicable: 030 corpus marks F5 with the same executor reachability as F3. |
| F5-cli-opencode | applicable | applicable: 030 corpus marks F5 with the same executor reachability as F3. |
| F5-native | applicable | applicable: 030 corpus marks F5 with the same executor reachability as F3. |
| F5-inline | applicable | applicable: 030 corpus marks F5 with the same executor reachability as F3. |
| F6-cli-codex | applicable | applicable: 030 corpus marks F6 applicable for cli-codex, cli-copilot, cli-opencode, native-command, inline-shell and skip-if-unavailable for cli-gemini/cli-claude-code. |
| F6-cli-copilot | applicable | applicable: 030 corpus marks F6 applicable for cli-codex, cli-copilot, cli-opencode, native-command, inline-shell and skip-if-unavailable for cli-gemini/cli-claude-code. |
| F6-cli-gemini | applicable | applicable: 030 corpus marks F6 applicable for cli-codex, cli-copilot, cli-opencode, native-command, inline-shell and skip-if-unavailable for cli-gemini/cli-claude-code. |
| F6-cli-claude-code | applicable | applicable: 030 corpus marks F6 applicable for cli-codex, cli-copilot, cli-opencode, native-command, inline-shell and skip-if-unavailable for cli-gemini/cli-claude-code. |
| F6-cli-opencode | applicable | applicable: 030 corpus marks F6 applicable for cli-codex, cli-copilot, cli-opencode, native-command, inline-shell and skip-if-unavailable for cli-gemini/cli-claude-code. |
| F6-native | applicable | applicable: 030 corpus marks F6 applicable for cli-codex, cli-copilot, cli-opencode, native-command, inline-shell and skip-if-unavailable for cli-gemini/cli-claude-code. |
| F6-inline | applicable | applicable: 030 corpus marks F6 applicable for cli-codex, cli-copilot, cli-opencode, native-command, inline-shell and skip-if-unavailable for cli-gemini/cli-claude-code. |
| F7-cli-codex | applicable | applicable: 030 corpus marks F7 with the same executor reachability as F3. |
| F7-cli-copilot | applicable | applicable: 030 corpus marks F7 with the same executor reachability as F3. |
| F7-cli-gemini | applicable | applicable: 030 corpus marks F7 with the same executor reachability as F3. |
| F7-cli-claude-code | applicable | applicable: 030 corpus marks F7 with the same executor reachability as F3. |
| F7-cli-opencode | applicable | applicable: 030 corpus marks F7 with the same executor reachability as F3. |
| F7-native | applicable | applicable: 030 corpus marks F7 with the same executor reachability as F3. |
| F7-inline | applicable | applicable: 030 corpus marks F7 with the same executor reachability as F3. |
| F8-cli-codex | applicable | applicable: 030 corpus marks F8 skip-if-unavailable for every executor because CocoIndex/index availability is environment dependent. |
| F8-cli-copilot | applicable | applicable: 030 corpus marks F8 skip-if-unavailable for every executor because CocoIndex/index availability is environment dependent. |
| F8-cli-gemini | applicable | applicable: 030 corpus marks F8 skip-if-unavailable for every executor because CocoIndex/index availability is environment dependent. |
| F8-cli-claude-code | applicable | applicable: 030 corpus marks F8 skip-if-unavailable for every executor because CocoIndex/index availability is environment dependent. |
| F8-cli-opencode | applicable | applicable: 030 corpus marks F8 skip-if-unavailable for every executor because CocoIndex/index availability is environment dependent. |
| F8-native | applicable | applicable: 030 corpus marks F8 skip-if-unavailable for every executor because CocoIndex/index availability is environment dependent. |
| F8-inline | applicable | applicable: 030 corpus marks F8 skip-if-unavailable for every executor because CocoIndex/index availability is environment dependent. |
| F9-cli-codex | applicable | applicable: 030 corpus marks F9 applicable in sandbox for cli-codex/cli-copilot/cli-opencode, fixture-only for cli-gemini/cli-claude-code, native-command and inline-shell. |
| F9-cli-copilot | applicable | applicable: 030 corpus marks F9 applicable in sandbox for cli-codex/cli-copilot/cli-opencode, fixture-only for cli-gemini/cli-claude-code, native-command and inline-shell. |
| F9-cli-gemini | applicable | applicable: 030 corpus marks F9 applicable in sandbox for cli-codex/cli-copilot/cli-opencode, fixture-only for cli-gemini/cli-claude-code, native-command and inline-shell. |
| F9-cli-claude-code | applicable | applicable: 030 corpus marks F9 applicable in sandbox for cli-codex/cli-copilot/cli-opencode, fixture-only for cli-gemini/cli-claude-code, native-command and inline-shell. |
| F9-cli-opencode | applicable | applicable: 030 corpus marks F9 applicable in sandbox for cli-codex/cli-copilot/cli-opencode, fixture-only for cli-gemini/cli-claude-code, native-command and inline-shell. |
| F9-native | applicable | applicable: 030 corpus marks F9 applicable in sandbox for cli-codex/cli-copilot/cli-opencode, fixture-only for cli-gemini/cli-claude-code, native-command and inline-shell. |
| F9-inline | applicable | applicable: 030 corpus marks F9 applicable in sandbox for cli-codex/cli-copilot/cli-opencode, fixture-only for cli-gemini/cli-claude-code, native-command and inline-shell. |
| F10-cli-codex | applicable | applicable: 030 corpus marks F10 applicable via command executor for external/native surfaces and fixture-only for inline. |
| F10-cli-copilot | applicable | applicable: 030 corpus marks F10 applicable via command executor for external/native surfaces and fixture-only for inline. |
| F10-cli-gemini | applicable | applicable: 030 corpus marks F10 applicable via command executor for external/native surfaces and fixture-only for inline. |
| F10-cli-claude-code | applicable | applicable: 030 corpus marks F10 applicable via command executor for external/native surfaces and fixture-only for inline. |
| F10-cli-opencode | applicable | applicable: 030 corpus marks F10 applicable via command executor for external/native surfaces and fixture-only for inline. |
| F10-native | applicable | applicable: 030 corpus marks F10 applicable via command executor for external/native surfaces and fixture-only for inline. |
| F10-inline | applicable | applicable: 030 corpus marks F10 applicable via command executor for external/native surfaces and fixture-only for inline. |
| F11-cli-codex | applicable | applicable: 030 corpus marks F11 as adapter/plugin/runtime-hook surfaces; user scope calls out runtime reachability caveats. |
| F11-cli-copilot | applicable | applicable: 030 corpus marks F11 as adapter/plugin/runtime-hook surfaces; user scope calls out runtime reachability caveats. |
| F11-cli-gemini | not_applicable_with_reason | not_applicable_with_reason: Gemini prompt-hook behavior is adapter-only here; no reachable real cli-gemini hook cell was available in this Codex session. |
| F11-cli-claude-code | applicable | applicable: 030 corpus marks F11 as adapter/plugin/runtime-hook surfaces; user scope calls out runtime reachability caveats. |
| F11-cli-opencode | applicable | applicable: 030 corpus marks F11 as adapter/plugin/runtime-hook surfaces; user scope calls out runtime reachability caveats. |
| F11-native | applicable | applicable: 030 corpus marks F11 as adapter/plugin/runtime-hook surfaces; user scope calls out runtime reachability caveats. |
| F11-inline | applicable | applicable: 030 corpus marks F11 as adapter/plugin/runtime-hook surfaces; user scope calls out runtime reachability caveats. |
| F12-cli-codex | applicable | applicable: 030 corpus marks F12 applicable for cli-codex, cli-copilot, cli-opencode, native-command, inline-shell and fixture-only for cli-gemini/cli-claude-code. |
| F12-cli-copilot | applicable | applicable: 030 corpus marks F12 applicable for cli-codex, cli-copilot, cli-opencode, native-command, inline-shell and fixture-only for cli-gemini/cli-claude-code. |
| F12-cli-gemini | applicable | applicable: 030 corpus marks F12 applicable for cli-codex, cli-copilot, cli-opencode, native-command, inline-shell and fixture-only for cli-gemini/cli-claude-code. |
| F12-cli-claude-code | applicable | applicable: 030 corpus marks F12 applicable for cli-codex, cli-copilot, cli-opencode, native-command, inline-shell and fixture-only for cli-gemini/cli-claude-code. |
| F12-cli-opencode | applicable | applicable: 030 corpus marks F12 applicable for cli-codex, cli-copilot, cli-opencode, native-command, inline-shell and fixture-only for cli-gemini/cli-claude-code. |
| F12-native | applicable | applicable: 030 corpus marks F12 applicable for cli-codex, cli-copilot, cli-opencode, native-command, inline-shell and fixture-only for cli-gemini/cli-claude-code. |
| F12-inline | applicable | applicable: 030 corpus marks F12 applicable for cli-codex, cli-copilot, cli-opencode, native-command, inline-shell and fixture-only for cli-gemini/cli-claude-code. |
| F13-cli-codex | applicable | applicable: 030 corpus marks F13 applicable across executors but the stress-cycle runner was not present. |
| F13-cli-copilot | applicable | applicable: 030 corpus marks F13 applicable across executors but the stress-cycle runner was not present. |
| F13-cli-gemini | applicable | applicable: 030 corpus marks F13 applicable across executors but the stress-cycle runner was not present. |
| F13-cli-claude-code | applicable | applicable: 030 corpus marks F13 applicable across executors but the stress-cycle runner was not present. |
| F13-cli-opencode | applicable | applicable: 030 corpus marks F13 applicable across executors but the stress-cycle runner was not present. |
| F13-native | applicable | applicable: 030 corpus marks F13 applicable across executors but the stress-cycle runner was not present. |
| F13-inline | applicable | applicable: 030 corpus marks F13 applicable across executors but the stress-cycle runner was not present. |
| F14-cli-codex | applicable | applicable: 030 corpus marks F14 applicable for cli-codex, cli-copilot, cli-opencode, native-command, inline-tool and fixture-only unless MCP is available for cli-gemini/cli-claude-code. |
| F14-cli-copilot | applicable | applicable: 030 corpus marks F14 applicable for cli-codex, cli-copilot, cli-opencode, native-command, inline-tool and fixture-only unless MCP is available for cli-gemini/cli-claude-code. |
| F14-cli-gemini | applicable | applicable: 030 corpus marks F14 applicable for cli-codex, cli-copilot, cli-opencode, native-command, inline-tool and fixture-only unless MCP is available for cli-gemini/cli-claude-code. |
| F14-cli-claude-code | applicable | applicable: 030 corpus marks F14 applicable for cli-codex, cli-copilot, cli-opencode, native-command, inline-tool and fixture-only unless MCP is available for cli-gemini/cli-claude-code. |
| F14-cli-opencode | applicable | applicable: 030 corpus marks F14 applicable for cli-codex, cli-copilot, cli-opencode, native-command, inline-tool and fixture-only unless MCP is available for cli-gemini/cli-claude-code. |
| F14-native | applicable | applicable: 030 corpus marks F14 applicable for cli-codex, cli-copilot, cli-opencode, native-command, inline-tool and fixture-only unless MCP is available for cli-gemini/cli-claude-code. |
| F14-inline | applicable | applicable: 030 corpus marks F14 applicable for cli-codex, cli-copilot, cli-opencode, native-command, inline-tool and fixture-only unless MCP is available for cli-gemini/cli-claude-code. |

## Runner Discovery

Dedicated packet-030 Option C runners were not found as a complete runner tree or manifest. Focused feature-adjacent tests were available for F1-F12 and F14 local/native surfaces. No F13 stress-cycle runner was found. External executor adapters were incomplete.
