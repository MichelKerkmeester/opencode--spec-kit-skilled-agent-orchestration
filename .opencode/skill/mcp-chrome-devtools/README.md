---
title: "mcp-chrome-devtools"
description: "Chrome DevTools orchestrator with intelligent routing between CLI (bdg) and MCP (Code Mode) approaches."
trigger_phrases:
  - "chrome devtools"
  - "browser debugging"
  - "bdg"
---

# mcp-chrome-devtools

> Chrome DevTools orchestrator with intelligent routing between CLI (bdg) and MCP (Code Mode) approaches.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->
- [MCP-CHROME-DEVTOOLS](#mcp-chrome-devtools)
  - [TABLE OF CONTENTS](#table-of-contents)
  - [1. OVERVIEW](#1--overview)
  - [2. QUICK START](#2--quick-start)
  - [3. STRUCTURE](#3--structure)
  - [4. FEATURES](#4--features)
  - [5. CONFIGURATION](#5-️-configuration)
  - [6. EXAMPLES](#6--examples)
  - [7. TROUBLESHOOTING](#7-️-troubleshooting)
  - [8. RELATED](#8--related)
<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

This skill provides browser debugging and automation through two complementary approaches: a CLI tool (`browser-debugger-cli` / `bdg`) prioritized for speed and token efficiency, and an MCP fallback via Code Mode for multi-tool integration scenarios.

The orchestrator automatically detects which approach is available and routes accordingly. CLI is always preferred when `bdg` is installed, offering access to 300+ CDP methods across 50+ domains with full Unix pipe composability. When CLI is unavailable, the MCP approach provides browser control through isolated Chrome DevTools instances configured in `.utcp_config.json`.

Typical use cases include screenshot capture, console log analysis, DOM inspection, cookie manipulation, network monitoring (HAR export) and JavaScript execution in the browser. All of this works from the terminal or through MCP tool chains.

<!-- /ANCHOR:overview -->

---

## 2. QUICK START
<!-- ANCHOR:quick-start -->

**Check availability and install:**

```bash
# Check if CLI is installed
command -v bdg || echo "Install: npm install -g browser-debugger-cli@alpha"

# Install
npm install -g browser-debugger-cli@alpha

# Verify
bdg --version 2>&1
```

**Basic workflow:**

```bash
bdg https://example.com 2>&1    # Start session
bdg dom screenshot page.png 2>&1 # Take screenshot
bdg console --list 2>&1          # Get console logs
bdg stop 2>&1                    # Cleanup
```

**MCP alternative** (when CLI unavailable): Configure `chrome_devtools` in `.utcp_config.json` with `--isolated=true`, then use `call_tool_chain()` with the naming pattern `{instance}.{instance}_{tool_name}`.

<!-- /ANCHOR:quick-start -->

---

## 3. STRUCTURE
<!-- ANCHOR:structure -->

```
mcp-chrome-devtools/
├── SKILL.md                 # Entry point: routing logic, rules, full reference
├── README.md                # This file
├── INSTALL_GUIDE.md         # Detailed installation instructions
├── references/
│   ├── cdp_patterns.md      # CDP domain patterns, Unix composability
│   ├── session_management.md # Session lifecycle, multi-session, recovery
│   └── troubleshooting.md   # Installation issues, browser errors, platform fixes
└── examples/
    ├── README.md            # Comprehensive usage guide, CI/CD patterns
    ├── performance-baseline.sh  # Performance testing workflow
    ├── animation-testing.sh     # Animation validation with thresholds
    └── multi-viewport-test.sh   # Responsive testing across 5 viewports
```

<!-- /ANCHOR:structure -->

---

## 4. FEATURES
<!-- ANCHOR:features -->

**Smart Routing**
- Automatic detection: CLI available? Use it. Otherwise fall back to MCP.
- Decision tree in SKILL.md Section 2 covers all routing paths.

**CLI (bdg), Primary Approach**
- Self-documenting: `--list`, `--describe`, `--search` for method discovery
- 300+ CDP methods across 53 domains
- Unix pipe composability (pipe to `jq`, `grep`, etc.)
- Session management with trap-based cleanup
- Lowest token cost of any browser debugging approach

**MCP (Code Mode), Fallback Approach**
- Isolated browser instances via `--isolated=true`
- Parallel multi-instance testing (e.g., production vs. staging)
- Type-safe TypeScript invocation through `call_tool_chain()`
- Chains with other MCP tools (Webflow, Figma, etc.)

**Common Operations**
- Screenshots, console logs, DOM queries, cookie management
- JavaScript execution, HAR network export
- Performance baselines, animation testing, multi-viewport testing

<!-- /ANCHOR:features -->

---

## 5. CONFIGURATION
<!-- ANCHOR:configuration -->

**CLI**: No configuration needed beyond installation. Set `CHROME_PATH` if Chrome is not auto-detected.

**MCP**: Add entries to `.utcp_config.json`:

```json
{
  "manual_call_templates": [
    {
      "name": "chrome_devtools_1",
      "call_template_type": "mcp",
      "config": {
        "mcpServers": {
          "chrome_devtools_1": {
            "transport": "stdio",
            "command": "npx",
            "args": ["chrome-devtools-mcp@latest", "--isolated=true"]
          }
        }
      }
    }
  ]
}
```

Register additional instances (`chrome_devtools_2`, etc.) for parallel testing.

**Platform support**: macOS (native), Linux (native), Windows (WSL only).

<!-- /ANCHOR:configuration -->

---

## 6. EXAMPLES
<!-- ANCHOR:usage-examples -->

**Screenshot capture (CLI):**
```bash
bdg https://example.com 2>&1
bdg dom screenshot example.png 2>&1
bdg stop 2>&1
```

**Console error filtering (CLI):**
```bash
bdg https://example.com 2>&1
bdg console --list 2>&1 | jq '.[] | select(.level=="error")'
bdg stop 2>&1
```

**Screenshot via MCP:**
```typescript
await call_tool_chain({
  code: `
    await chrome_devtools_1.chrome_devtools_1_navigate_page({
      url: "https://example.com"
    });
    const screenshot = await chrome_devtools_1.chrome_devtools_1_take_screenshot({});
    return screenshot;
  `,
  timeout: 30000
});
```

See `examples/` for production-ready scripts (performance baselines, animation testing, multi-viewport).

<!-- /ANCHOR:usage-examples -->

---

## 7. TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

| Issue                  | Solution                                                             |
| ---------------------- | -------------------------------------------------------------------- |
| `bdg` not found        | `npm install -g browser-debugger-cli@alpha`                          |
| Chrome not detected    | Set `CHROME_PATH` environment variable                               |
| Session fails to start | Check `bdg status 2>&1`. Ensure no stale sessions (`bdg stop 2>&1`). |
| Windows support        | WSL required. PowerShell/Git Bash not supported.                     |
| MCP tools not found    | Verify `.utcp_config.json` entries. Run `search_tools("chrome")`.    |
| Resource leaks         | Always use `trap "bdg stop 2>&1" EXIT` or try/finally in MCP         |

For detailed troubleshooting, see `references/troubleshooting.md`.

<!-- /ANCHOR:troubleshooting -->

---

## 8. RELATED
<!-- ANCHOR:related -->

- **SKILL.md**: Full routing logic, rules (ALWAYS/NEVER), success criteria
- **INSTALL_GUIDE.md**: Step-by-step installation for all platforms
- **mcp-code-mode skill**: Required for the MCP fallback approach
- **mcp-figma skill**: Common pairing for design-to-browser verification workflows
- **sk-code--web skill**: Phase 3 browser verification integration
- **references/cdp_patterns.md**: Advanced CDP domain patterns
- **references/session_management.md**: Multi-session and recovery patterns

<!-- /ANCHOR:related -->
