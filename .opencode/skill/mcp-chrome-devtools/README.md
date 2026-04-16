---
title: "mcp-chrome-devtools"
description: "Chrome DevTools orchestrator providing intelligent routing between CLI (bdg) and MCP (Code Mode) approaches. CLI is prioritized for speed and token efficiency, with MCP as a fallback for multi-tool integration scenarios."
trigger_phrases:
  - "chrome devtools"
  - "browser debugging"
  - "bdg"
  - "browser-debugger-cli"
  - "CDP"
  - "terminal browser automation"
  - "screenshot without puppeteer"
---

# mcp-chrome-devtools

> Browser debugging and automation for Chrome via two complementary approaches: CLI (bdg) for speed and token efficiency, MCP (Code Mode) for multi-tool integration.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

1. [OVERVIEW](#1-overview)
2. [QUICK START](#2-quick-start)
3. [FEATURES](#3-features)
   - 3.1 [FEATURE HIGHLIGHTS](#31-feature-highlights)
   - 3.2 [FEATURE REFERENCE](#32-feature-reference)
4. [STRUCTURE](#4-structure)
5. [CONFIGURATION](#5-configuration)
6. [USAGE EXAMPLES](#6-usage-examples)
7. [TROUBLESHOOTING](#7-troubleshooting)
8. [FAQ](#8-faq)
9. [RELATED DOCUMENTS](#9-related-documents)
<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This skill orchestrates Chrome browser access through two distinct approaches. The primary path is the `browser-debugger-cli` (bdg) tool, a lightweight npm-installable CLI that connects directly to Chrome's DevTools Protocol. bdg gives terminal users immediate access to 300+ CDP methods across 53 domains without any framework overhead. The fallback path is the MCP approach via Code Mode, which registers Chrome DevTools as an external MCP server and calls it through `call_tool_chain()`. The MCP path trades some speed for the ability to chain browser operations with other Code Mode tools in a single TypeScript block.

The skill's routing logic scores incoming requests against five intent signals (CLI, MCP, INSTALL, TROUBLESHOOT, AUTOMATION) and loads only the reference documents relevant to the detected intent. This keeps token usage low on routine tasks. When CLI is detected as available (`command -v bdg`), it is always preferred. MCP is selected when Code Mode infrastructure is already in use or when parallel isolated browser instances are needed.

The skill covers the full spectrum of browser automation tasks that belong in a terminal workflow: capturing screenshots and PDFs, exporting HAR network traces, reading and writing cookies, querying the DOM by CSS selector, executing JavaScript expressions, monitoring console output, and running performance metric collection. Three production-ready shell scripts in the `examples/` directory demonstrate performance baselining, animation testing, and multi-viewport visual regression testing.

For browser work tied back to a Spec Kit packet, `/spec_kit:resume` remains the canonical recovery surface. Continuity still rebuilds from `handover.md`, then `_memory.continuity`, then the remaining spec docs, while generated memory artifacts stay secondary.

### Key Statistics

| Attribute | Value |
| --- | --- |
| Version | 1.0.7.0 |
| CDP domains covered (bdg) | 53 |
| CDP methods accessible (bdg) | 300+ |
| MCP isolated instances (parallel) | Unlimited (register as many as needed) |
| Session startup time target | < 5 seconds |
| Screenshot capture time target | < 2 seconds |
| Console log retrieval target | < 1 second |
| Supported platforms (CLI) | macOS, Linux, WSL (Windows) |

### How This Compares

| Approach | Setup | Token Cost | CDP Access | Best For |
| --- | --- | --- | --- | --- |
| CLI (bdg) | `npm install -g browser-debugger-cli@alpha` | Lowest (self-documenting) | 300+ methods, 53 domains | Debugging, inspection, CI scripts |
| MCP (Code Mode) | MCP config + `--isolated=true` server | Medium | MCP-exposed subset | Multi-tool workflows, parallel testing |
| Puppeteer / Playwright | Heavy dependencies | Highest (verbose) | Full but complex | Complex UI testing, cross-browser |

### Key Features

| Feature | CLI Command | MCP Tool |
| --- | --- | --- |
| Navigate to URL | `bdg <url>` | `navigate_page` |
| Capture screenshot | `bdg dom screenshot <path>` | `take_screenshot` |
| Export HAR trace | `bdg network har <path>` | N/A |
| Read console logs | `bdg console --list` | `list_console_messages` |
| Query DOM | `bdg dom query "<selector>"` | N/A |
| Execute JavaScript | `bdg dom eval "<expression>"` | `fill`, `click` |
| Get cookies | `bdg network getCookies` | N/A |
| Set cookies | `bdg cdp Network.setCookie` | N/A |
| Discover CDP methods | `bdg cdp --list`, `--describe`, `--search` | `search_tools()` |
| Set viewport size | `bdg cdp Emulation.setDeviceMetricsOverride` | `resize_page` |
| Close session | `bdg stop` | `close_page` |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

**Step 1: Install bdg (CLI path)**

```bash
npm install -g browser-debugger-cli@alpha
bdg --version 2>&1
```

**Step 2: Start a session and verify it is active**

```bash
bdg https://example.com 2>&1
bdg status 2>&1 | jq '.state'
# Expected output: "active"
```

**Step 3: Run operations and always capture stderr**

```bash
# Capture a screenshot
bdg dom screenshot output.png 2>&1

# Export console logs and filter for errors
bdg console --list 2>&1 | jq '.[] | select(.level=="error")'

# Export a HAR network trace
bdg network har trace.har 2>&1
```

**Step 4: Stop the session to release browser resources**

```bash
bdg stop 2>&1
```

For unattended scripts, register a trap so cleanup runs even on errors:

```bash
trap "bdg stop 2>&1" EXIT INT TERM
```

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

The defining characteristic of bdg is progressive method disclosure. Before executing any CDP command, you run `bdg cdp --list` to see all available domains, `bdg cdp --describe <Domain>` to enumerate methods in a specific domain, and `bdg cdp --search <keyword>` to find methods by use case. This replaces guesswork with a documented discovery step. Method names are case-normalized, so `bdg cdp page.capturescreenshot` works the same as `bdg cdp Page.captureScreenshot`. Hardcoding method names is treated as an anti-pattern by this skill because CDP method signatures change between Chrome versions.

For common operations, bdg provides high-level helper commands that wrap the underlying CDP calls. `bdg dom screenshot` captures a full-page PNG in one command. `bdg dom query` runs `querySelector` without building JSON manually. `bdg dom eval` executes a JavaScript expression and returns the result. `bdg network getCookies`, `bdg network har`, and `bdg console --list` each produce clean output suitable for piping to `jq` or `grep`. This Unix composability is a core design goal: bdg output flows through standard shell pipelines without transformation.

The MCP path adds a capability the CLI cannot provide on its own: parallel isolated browser instances. Each entry in `.utcp_config.json` that uses `--isolated=true` starts a completely independent browser process. You can register `chrome_devtools_1` and `chrome_devtools_2` (or more) and operate them simultaneously inside a single `call_tool_chain()` TypeScript block. This makes side-by-side comparison testing possible, for example loading production and staging in parallel and capturing both screenshots before either tab changes state.

Session cleanup is treated as a hard requirement by this skill. Orphaned browser processes consume memory and can cause `"Another session already active"` errors on the next run. The CLI approach uses `bdg stop 2>&1` after each operation set, combined with a `trap` handler in scripts. The MCP approach wraps all browser operations in a `try/finally` block that calls `close_page` even when an error is thrown. Both patterns are enforced as ALWAYS rules in the skill and as written examples in the reference files.

The three example scripts in `examples/` represent production patterns for CI/CD integration. `performance-baseline.sh` captures a timestamped snapshot of metrics, HAR trace, screenshot, console logs, and DOM statistics. `animation-testing.sh` applies configurable thresholds to layout count, style recalc count, and task duration, returning exit code 1 on any assertion failure. `multi-viewport-test.sh` iterates over five device profiles (desktop 1920x1080 down to mobile 375x667) and checks for console errors at each viewport. All three scripts follow the trap-based cleanup pattern and can be chained together in a CI pipeline with `set -e`.

### 3.2 FEATURE REFERENCE

**CLI Helper Commands**

| Command | Description | Output |
| --- | --- | --- |
| `bdg <url>` | Start browser session at URL | Session confirmation |
| `bdg status` | Check current session state | JSON with `state` field |
| `bdg stop` | End current session | Session stopped |
| `bdg dom screenshot <path>` | Save full-page PNG | PNG file at path |
| `bdg dom query "<selector>"` | Query DOM elements | JSON array of matching nodes |
| `bdg dom eval "<expression>"` | Execute JavaScript | JSON with result value |
| `bdg console --list` | Read console messages | JSON array with level and text |
| `bdg network getCookies` | List all cookies | JSON cookie array |
| `bdg network har <path>` | Export HAR network trace | HAR file at path |
| `bdg network headers` | Show response headers | JSON headers object |
| `bdg cdp --list` | List all CDP domains | Domain names |
| `bdg cdp --describe <Domain>` | Show domain methods | Method list with signatures |
| `bdg cdp --search <keyword>` | Find methods by keyword | Matching method names |
| `bdg cdp <Domain.Method> '<json>'` | Call raw CDP method | JSON CDP response |

**MCP Tools (Code Mode)**

| Tool Name | Description | CLI Equivalent |
| --- | --- | --- |
| `navigate_page` | Navigate to a URL | `bdg <url>` |
| `take_screenshot` | Capture screenshot | `bdg dom screenshot` |
| `list_console_messages` | Read console logs | `bdg console --list` |
| `resize_page` | Set viewport size | `bdg cdp Emulation.setDeviceMetricsOverride` |
| `click` | Click element | `bdg cdp Input.dispatchMouseEvent` |
| `fill` | Fill form field | `bdg dom eval "...value = ..."` |
| `hover` | Hover over element | `bdg cdp Input.dispatchMouseEvent` |
| `press_key` | Send key event | `bdg cdp Input.dispatchKeyEvent` |
| `wait_for` | Wait for condition | N/A (scripting) |
| `new_page` | Open new tab | N/A |
| `close_page` | Close page and cleanup | `bdg stop` |
| `select_page` | Switch to a tab | N/A |

**CDP Domain Coverage (selected)**

| Domain | Key Methods | Use Case |
| --- | --- | --- |
| Page | navigate, captureScreenshot, printToPDF, reload, getLayoutMetrics | Navigation, screenshots, PDF export |
| DOM | getDocument, querySelector, querySelectorAll, getOuterHTML, setAttributeValue | DOM inspection and modification |
| Network | enable, getCookies, setCookie, deleteCookies, clearBrowserCache, setRequestInterception | Cookie management, HAR, request blocking |
| Runtime | evaluate, callFunctionOn, getProperties | JavaScript execution, object inspection |
| Performance | enable, getMetrics | Performance metric collection |
| Emulation | setDeviceMetricsOverride | Viewport and mobile emulation |
| HeapProfiler | takeHeapSnapshot, startSampling, collectGarbage | Memory profiling |
| Tracing | start, end, getCategories | Timeline recording |

**Intent Routing Weights**

| Intent | Score Weight | Trigger Keywords | Resources Loaded |
| --- | --- | --- | --- |
| CLI | 4 | bdg, browser-debugger-cli, terminal, cli | cdp_patterns.md, session_management.md |
| MCP | 4 | mcp, code mode, multi-tool, parallel sessions | session_management.md, cdp_patterns.md |
| INSTALL | 4 | install, setup, not installed, command -v bdg | troubleshooting.md |
| TROUBLESHOOT | 4 | error, failed, troubleshoot, session issue | troubleshooting.md |
| AUTOMATION | 3 | ci, pipeline, automation, production | examples/README.md |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```
mcp-chrome-devtools/
  SKILL.md                       # Skill definition, routing logic, rules
  README.md                      # This file
  INSTALL_GUIDE.md               # Step-by-step installation for bdg and MCP
  examples/
    README.md                    # Guide to example scripts and CI integration
    animation-testing.sh         # Animation performance assertions with exit codes
    multi-viewport-test.sh       # Visual testing across 5 device viewports
    performance-baseline.sh      # Full baseline capture (metrics, HAR, screenshot)
  references/
    cdp_patterns.md              # CDP domain examples and Unix composability patterns
    session_management.md        # Session lifecycle, retry logic, cleanup patterns
    troubleshooting.md           # Error code reference, diagnostic sequence, fixes
  scripts/
    install.sh                   # Automated installation script for bdg
```

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

**CLI (bdg): No configuration file required.** Install the package globally and use the `bdg` command directly.

```bash
npm install -g browser-debugger-cli@alpha
```

Optional environment variables for the CLI:

| Variable | Default | Purpose |
| --- | --- | --- |
| `CHROME_PATH` | Auto-detected | Path to Chrome or Chromium executable |
| `CHROME_DEBUGGING_PORT` | 9222 | CDP debugging port |
| `CHROME_HEADLESS` | false | Run Chrome without a display (useful on Linux/WSL) |
| `BDG_TIMEOUT` | 30000 | Session start timeout in milliseconds |
| `BDG_LOG_LEVEL` | info | Log verbosity (set to `debug` for verbose output) |
| `DEBUG` | (unset) | Set to `bdg:*` for full trace logging |

**MCP (Code Mode): Register in `.utcp_config.json`.** Each entry creates one isolated browser instance. Use multiple entries for parallel testing.

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
            "args": ["chrome-devtools-mcp@latest", "--isolated=true"],
            "env": {}
          }
        }
      }
    }
  ]
}
```

Verify the MCP registration is present:

```bash
cat .utcp_config.json | jq '.manual_call_templates[] | select(.name | startswith("chrome_devtools"))'
```

Tool invocation pattern inside `call_tool_chain()`:

```
{manual_name}.{manual_name}_{tool_name}()
```

Example: `chrome_devtools_1.chrome_devtools_1_take_screenshot({})`

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

**Example 1: Console error audit with CLI**

```bash
#!/bin/bash
# Audit a page for console errors and exit non-zero if any are found
set -euo pipefail
trap "bdg stop 2>&1" EXIT INT TERM

command -v bdg || { echo "Install: npm install -g browser-debugger-cli@alpha"; exit 1; }

TARGET_URL="${1:-https://example.com}"

bdg "$TARGET_URL" 2>&1
bdg status 2>&1 | jq -e '.state == "active"' > /dev/null || { echo "Session failed"; exit 1; }

bdg cdp Runtime.enable 2>&1 > /dev/null
ERROR_COUNT=$(bdg console --list 2>&1 | jq '[.[] | select(.level=="error")] | length')

echo "Console errors found: $ERROR_COUNT"
[ "$ERROR_COUNT" -eq 0 ] || exit 1
```

**Example 2: Parallel site comparison with MCP**

```typescript
await call_tool_chain({
  code: `
    // Load production and staging in parallel isolated instances
    await chrome_devtools_1.chrome_devtools_1_navigate_page({
      url: "https://example.com"
    });
    await chrome_devtools_2.chrome_devtools_2_navigate_page({
      url: "https://staging.example.com"
    });

    try {
      const prod = await chrome_devtools_1.chrome_devtools_1_take_screenshot({});
      const staging = await chrome_devtools_2.chrome_devtools_2_take_screenshot({});
      return { production: prod, staging: staging };
    } finally {
      await chrome_devtools_1.chrome_devtools_1_close_page({});
      await chrome_devtools_2.chrome_devtools_2_close_page({});
    }
  `,
  timeout: 60000
});
```

**Example 3: Cookie-based authentication test with CLI**

```bash
#!/bin/bash
# Set an auth cookie, navigate to a protected route, and screenshot the result
set -euo pipefail
trap "bdg stop 2>&1" EXIT INT TERM

bdg https://example.com 2>&1
bdg cdp Network.enable 2>&1 > /dev/null

bdg cdp Network.setCookie '{
  "name": "auth_token",
  "value": "secret-token-123",
  "domain": "example.com",
  "path": "/",
  "secure": true,
  "httpOnly": true,
  "sameSite": "Strict"
}' 2>&1

bdg cdp Page.navigate '{"url":"https://example.com/dashboard"}' 2>&1
sleep 2
bdg dom screenshot dashboard-auth.png 2>&1
echo "Screenshot saved: dashboard-auth.png"
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

Run these five diagnostic checks before investigating further:

```bash
command -v bdg || echo "Not installed"
bdg --version 2>&1
bdg status 2>&1
which google-chrome chromium-browser chromium 2>/dev/null
node --version && npm --version
```

---

**Issue: `bash: bdg: command not found`**

What you see: Running any `bdg` command returns a "command not found" error.

Common causes: The package is not installed globally, or the npm global bin directory is not in `$PATH`.

Fix:
```bash
# Install
npm install -g browser-debugger-cli@alpha

# If bdg still not found, fix PATH
NPM_BIN=$(npm config get prefix)/bin
echo 'export PATH="$PATH:'"$NPM_BIN"'"' >> ~/.zshrc
source ~/.zshrc
```

---

**Issue: `Error: Could not find Chrome/Chromium executable`**

What you see: bdg starts but immediately exits with a browser-not-found error.

Common causes: Chrome or Chromium is not installed, or it is installed in a non-standard location that bdg cannot auto-detect.

Fix:
```bash
# macOS: set the path explicitly
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Linux: install Chromium
sudo apt-get install chromium-browser   # Debian/Ubuntu
sudo yum install chromium               # RHEL/CentOS

# WSL: point to Windows Chrome
export CHROME_PATH="/mnt/c/Program Files/Google/Chrome/Application/chrome.exe"
```

---

**Issue: `Error: Method not found: Page.screenshot`**

What you see: A CDP command fails because the method name is wrong.

Common causes: Guessing method names instead of using discovery. CDP method names do not always match intuition from the domain name.

Fix: Use discovery commands to find the correct name before executing.
```bash
# Find screenshot-related methods
bdg cdp --search screenshot
# Returns: Page.captureScreenshot

# Verify signature before executing
bdg cdp --describe Page.captureScreenshot
bdg cdp Page.captureScreenshot 2>&1
```

---

**Issue: `Error: Another session already active`**

What you see: A new `bdg <url>` call fails because a previous session was not stopped.

Common causes: A prior script exited without running `bdg stop`, or a `trap` handler was not registered.

Fix:
```bash
# Stop the existing session
bdg stop 2>&1

# If bdg stop does not work, kill the specific bdg process
kill "$(pgrep -f 'node.*browser-debugger-cli')" 2>/dev/null

# For future scripts, always register a trap
trap "bdg stop 2>&1" EXIT INT TERM
```

---

**Issue: `jq` parse error on bdg output**

What you see: Piping bdg output to `jq` produces `parse error: Invalid numeric literal`.

Common causes: Stderr messages are not being redirected and are contaminating the stdout JSON stream.

Fix: Always append `2>&1` to bdg commands before piping to `jq`.
```bash
# Correct
bdg status 2>&1 | jq '.state'

# When stderr and stdout must be separated
bdg status 2>errors.log 1>status.json
jq '.state' status.json
```

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: When should I use the CLI path versus the MCP path?**

A: Use the CLI path (bdg) by default. It installs in one command, has lower token cost, and gives access to more CDP methods. Switch to MCP when you are already inside a `call_tool_chain()` block using other Code Mode tools (Figma, Webflow, etc.) and want to chain browser operations with them, or when you need two or more browsers running in parallel for side-by-side comparison testing. The skill's routing logic detects both cases automatically based on keyword signals in the request.

**Q: How do I prevent browser processes from accumulating across multiple script runs?**

A: Register a trap at the top of every script with `trap "bdg stop 2>&1" EXIT INT TERM`. This runs the cleanup command when the script exits normally, when it is interrupted with Ctrl+C, or when it receives a TERM signal. For MCP sessions, wrap all browser operations in a `try/finally` block and call `close_page` in the `finally` clause. Never rely on the browser shutting down on its own when your process ends.

**Q: Can bdg run in a Docker container or CI environment with no display?**

A: Yes. Set `CHROME_HEADLESS=true` in the environment before running bdg. On Linux, you may also need to handle the Chrome sandbox with `CHROME_DEVEL_SANDBOX=/dev/null` (only acceptable in isolated CI containers, not production systems). The `animation-testing.sh`, `multi-viewport-test.sh`, and `performance-baseline.sh` scripts in `examples/` are written for this use case and return semantic exit codes for pipeline integration.

**Q: What happens if a CDP method name changes between Chrome versions?**

A: Never hardcode method names in scripts. Use `bdg cdp --search <keyword>` to find the current name each time you add a new method to a script. bdg normalizes method name casing, so the lookup is case-insensitive. Method signatures can also change, so run `bdg cdp --describe <Domain.Method>` to confirm the expected parameters before executing.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

**This skill**

| File | Description |
| --- | --- |
| `SKILL.md` | Full skill definition: routing logic, rules, quick reference |
| `INSTALL_GUIDE.md` | Step-by-step installation for bdg CLI and MCP server |
| `examples/README.md` | Guide to the three production example scripts |

**References**

| File | Description |
| --- | --- |
| `references/cdp_patterns.md` | CDP domain patterns, complete workflows, Unix pipe examples |
| `references/session_management.md` | Session lifecycle, retry logic, state persistence, cleanup |
| `references/troubleshooting.md` | Diagnostic sequence, error code table, platform-specific fixes |

**Related skills**

| Skill | Relationship |
| --- | --- |
| `mcp-code-mode` | Required for the MCP fallback path and `call_tool_chain()` execution |
| `sk-code-web` | Uses bdg for Phase 3 browser verification in web implementation workflows |
| `sk-doc` | Used to create and maintain this skill's documentation |

**External resources**

| Resource | URL |
| --- | --- |
| Chrome DevTools Protocol | https://chromedevtools.github.io/devtools-protocol/ |
| browser-debugger-cli (GitHub) | https://github.com/szymdzum/browser-debugger-cli |
| Node.js (required runtime, 14.x+) | https://nodejs.org/ |

<!-- /ANCHOR:related-documents -->
