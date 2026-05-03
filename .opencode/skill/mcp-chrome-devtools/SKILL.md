---
name: mcp-chrome-devtools
description: "Chrome DevTools orchestrator providing intelligent routing between CLI (bdg) and MCP (Code Mode) approaches. CLI prioritized for speed and token efficiency; MCP fallback for multi-tool integration scenarios."
allowed-tools: [Bash, Edit, Glob, Grep, mcp__code_mode__call_tool_chain, Read, Write]
version: 1.0.7.0
---

<!-- Keywords: chrome-devtools, cdp, browser-debugger-cli, bdg, browser-automation, terminal-debugging, screenshot-capture, network-monitoring, mcp-code-mode, orchestrator -->

# Chrome DevTools Orchestrator - CLI + MCP Integration

Browser debugging and automation through two complementary approaches: CLI (bdg) for speed and token efficiency, MCP for multi-tool integration.

## 1. WHEN TO USE

### Activation Triggers

**Use when**:
- User mentions "browser debugging", "Chrome DevTools", "CDP" explicitly
- User asks to inspect, test, or automate browser tasks with lightweight CLI approach
- User wants screenshots, HAR files, console logs, or network inspection via terminal
- User mentions "bdg" or "browser-debugger-cli" explicitly
- User needs quick DOM queries, cookie manipulation, or JavaScript execution in browser
- User wants terminal-based browser automation with Unix pipe composability
- User needs production-ready automation scripts for CI/CD browser testing

**Automatic Triggers**:
- "bdg", "browser-debugger-cli" mentioned explicitly
- "lightweight browser debugging" or "quick CDP access"
- "terminal-based browser automation"
- "screenshot without Puppeteer"

### When NOT to Use

**Do not use for**:
- Complex UI testing suites requiring sophisticated frameworks (use Puppeteer/Playwright)
- Heavy multi-step automation workflows better suited for frameworks
- Cross-browser testing (bdg supports Chrome/Chromium/Edge only)
- Visual regression testing or complex test frameworks
- When user explicitly requests Puppeteer, Playwright, or Selenium

---

## 2. SMART ROUTING


### Resource Loading Levels

| Level       | When to Load             | Resources                       |
| ----------- | ------------------------ | ------------------------------- |
| ALWAYS      | Every skill invocation   | Core CDP pattern reference      |
| CONDITIONAL | If intent signals match  | CLI/MCP/session/troubleshooting |
| ON_DEMAND   | Only on explicit request | Full diagnostics set            |

### Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/cdp_patterns.md"

INTENT_SIGNALS = {
    "CLI": {"weight": 4, "keywords": ["bdg", "browser-debugger-cli", "terminal", "cli"]},
    "MCP": {"weight": 4, "keywords": ["mcp", "code mode", "multi-tool", "parallel sessions"]},
    "INSTALL": {"weight": 4, "keywords": ["install", "setup", "not installed", "command -v bdg"]},
    "TROUBLESHOOT": {"weight": 4, "keywords": ["error", "failed", "troubleshoot", "session issue"]},
    "AUTOMATION": {"weight": 3, "keywords": ["ci", "pipeline", "automation", "production"]},
}

RESOURCE_MAP = {
    "CLI": ["references/cdp_patterns.md", "references/session_management.md"],
    "MCP": ["references/session_management.md", "references/cdp_patterns.md"],
    "INSTALL": ["references/troubleshooting.md"],
    "TROUBLESHOOT": ["references/troubleshooting.md"],
    "AUTOMATION": ["examples/README.md"],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full troubleshooting", "full session guide", "all patterns", "capture a har", "console errors", "routing dashboard", "staging", "devtools"],
    "ON_DEMAND": ["references/troubleshooting.md", "references/session_management.md"],
}

def _task_text(task) -> str:
    parts = [
        str(getattr(task, "text", "")),
        str(getattr(task, "query", "")),
        " ".join(getattr(task, "keywords", []) or []),
    ]
    return " ".join(parts).lower()

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    docs.extend(p for p in (SKILL_ROOT / "examples").rglob("*.md") if (SKILL_ROOT / "examples").exists())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def score_intents(task) -> dict[str, float]:
    """Weighted intent scoring from request text and capability signals."""
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    if getattr(task, "cli_available", False):
        scores["CLI"] += 5
    if getattr(task, "code_mode_configured", False):
        scores["MCP"] += 4
    if getattr(task, "has_error", False):
        scores["TROUBLESHOOT"] += 4
    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["CLI"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def route_chrome_devtools_resources(task):
    inventory = discover_markdown_resources()
    scores = score_intents(task)
    intents = select_intents(scores, ambiguity_delta=1.0)
    loaded = []
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    for relative_path in LOADING_LEVELS["ALWAYS"]:
        load_if_available(relative_path)

    if max(scores.values() or [0]) < 0.5:
        return {
            "routing_key": "chrome-devtools",
            "intents": intents,
            "intent_scores": scores,
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": ["Confirm CLI vs MCP path", "Confirm target browser/session", "Provide one error, URL, or task goal"],
            "resources": loaded,
        }

    matched_intents = []
    for intent in intents:
        before_count = len(loaded)
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)
        if len(loaded) > before_count:
            matched_intents.append(intent)

    text = _task_text(task)
    if any(keyword in text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    if not loaded:
        load_if_available(DEFAULT_RESOURCE)

    result = {"routing_key": "chrome-devtools", "intents": intents, "intent_scores": scores, "resources": loaded}
    if not matched_intents:
        result["notice"] = f"No knowledge base found for intent(s): {', '.join(intents)}"
    return result
```

---

## 3. HOW IT WORKS

### Tool Comparison

| Feature        | CLI (bdg)                          | MCP (Code Mode)      | Puppeteer/Playwright |
| -------------- | ---------------------------------- | -------------------- | -------------------- |
| **Setup**      | `npm install -g browser-debugger-cli@alpha` | MCP config + server  | Heavy dependencies   |
| **Discovery**  | `--list`, `--describe`, `--search` | `search_tools()`     | API docs required    |
| **Token Cost** | Lowest (self-doc)                  | Medium (progressive) | Highest (verbose)    |
| **CDP Access** | 300+ methods across 53 domains     | MCP-exposed subset   | Full but complex     |
| **Best For**   | Debugging, inspection              | Multi-tool workflows | Complex UI testing   |

### CLI Approach (Priority) - browser-debugger-cli (bdg)

#### Installation & Verification

```bash
# Check if installed
command -v bdg || echo "Install: npm install -g browser-debugger-cli@alpha"

# Installation
npm install -g browser-debugger-cli@alpha

# Verify
bdg --version 2>&1
```

### MCP Approach (Fallback) - Chrome DevTools via Code Mode

When CLI unavailable or multi-tool integration needed.

#### Prerequisites

1. Code Mode configured in `.utcp_config.json`
2. Chrome DevTools MCP server registered with `--isolated=true`

#### Isolated Instances

**Key Feature**: MCP uses `--isolated=true` flag for independent browser instances.

**Benefits of isolated instances:**
- Each instance runs in its own browser process
- Multiple parallel browser sessions possible
- No session conflicts between instances
- Register multiple instances for parallel testing (e.g., `chrome_devtools_1`, `chrome_devtools_2`)

**Configuration example** (`.utcp_config.json`):
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
    },
    {
      "name": "chrome_devtools_2",
      "call_template_type": "mcp",
      "config": {
        "mcpServers": {
          "chrome_devtools_2": {
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

#### Configuration Check

```bash
cat .utcp_config.json | jq '.manual_call_templates[] | select(.name | startswith("chrome_devtools"))'
```

#### Invocation Pattern

Tool naming: `{manual_name}.{manual_name}_{tool_name}`

**Single instance example:**
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

**Parallel instances example** (comparing two pages):
```typescript
await call_tool_chain({
  code: `
    // Instance 1: Production site
    await chrome_devtools_1.chrome_devtools_1_navigate_page({
      url: "https://example.com"
    });

    // Instance 2: Staging site (parallel)
    await chrome_devtools_2.chrome_devtools_2_navigate_page({
      url: "https://staging.example.com"
    });

    // Capture both screenshots
    const prod = await chrome_devtools_1.chrome_devtools_1_take_screenshot({});
    const staging = await chrome_devtools_2.chrome_devtools_2_take_screenshot({});

    return { production: prod, staging: staging };
  `,
  timeout: 60000
});
```

#### Available MCP Tools

| Tool                    | Purpose            | CLI Equivalent                                     |
| ----------------------- | ------------------ | -------------------------------------------------- |
| `navigate_page`         | Navigate to URL    | `bdg <url>`                                        |
| `take_screenshot`       | Capture screenshot | `bdg dom screenshot`                               |
| `list_console_messages` | Get console logs   | `bdg console --list`                               |
| `resize_page`           | Set viewport size  | N/A (use cdp)                                      |
| `click`                 | Click on element   | `bdg cdp Input.dispatchMouseEvent`                 |
| `fill`                  | Fill form field    | `bdg dom eval "document.querySelector(...).value = ..."` |
| `hover`                 | Hover over element | `bdg cdp Input.dispatchMouseEvent`                 |
| `press_key`             | Press keyboard key | `bdg cdp Input.dispatchKeyEvent`                   |
| `wait_for`              | Wait for condition | N/A (scripting)                                    |
| `new_page`              | Open new page      | N/A                                                |
| `close_page`            | Close page         | `bdg stop`                                         |
| `select_page`           | Switch to page     | N/A                                                |

**Note**: Tool names use underscores (e.g., `take_screenshot`) not camelCase.

**Full invocation pattern**: `{manual_name}.{manual_name}_{tool_name}()`
- Example: `chrome_devtools_1.chrome_devtools_1_take_screenshot({})`

#### When to Prefer MCP

- Already using Code Mode for other tools (Webflow, Figma, etc.)
- Need to chain browser operations with other MCP tools
- **Parallel browser testing** - compare multiple sites/viewports simultaneously
- Complex multi-step automation in TypeScript
- Type-safe tool invocation required

#### MCP Limitations

- Higher token cost than CLI
- Requires Code Mode infrastructure
- Subset of CDP methods (CLI has 300+ methods across 53 domains)
- Less self-documenting than CLI's `--list`, `--describe`

### MCP Session Cleanup

**Important**: Always close browser instances when done to prevent resource leaks.

```typescript
// Cleanup pattern for MCP sessions
await call_tool_chain({
  code: `
    try {
      // Your browser operations
      await chrome_devtools_1.chrome_devtools_1_navigate_page({
        url: "https://example.com"
      });
      const screenshot = await chrome_devtools_1.chrome_devtools_1_take_screenshot({});
      return screenshot;
    } finally {
      // Always close the page when done
      await chrome_devtools_1.chrome_devtools_1_close_page({});
    }
  `,
  timeout: 30000
});

// For multi-instance cleanup
await call_tool_chain({
  code: `
    try {
      // Operations on multiple instances...
    } finally {
      // Close all instances
      await chrome_devtools_1.chrome_devtools_1_close_page({});
      await chrome_devtools_2.chrome_devtools_2_close_page({});
    }
  `,
  timeout: 30000
});
```

**Best Practice**: Wrap browser operations in try/finally to ensure cleanup even on errors.

---

## 4. RULES

### ✅ ALWAYS Rules

**ALWAYS do these without asking:**

1. **ALWAYS check CLI availability first**
   - Run `command -v bdg` before any operation
   - Prefer CLI over MCP when available

2. **ALWAYS verify bdg installation** before first use
   - `command -v bdg || echo "Install: npm install -g browser-debugger-cli@alpha"`

3. **ALWAYS use discovery commands** when exploring
   - Start with `--list`, `--describe`, `--search`
   - Document how you found the method

4. **ALWAYS verify session status** before CDP commands
   - `bdg status 2>&1 | jq '.state'`

5. **ALWAYS capture stderr** with `2>&1`
   - Essential for error handling
   - All bdg commands should include this

6. **ALWAYS stop sessions** after operations
   - `bdg stop 2>&1` or use trap pattern

7. **ALWAYS use jq** for JSON processing
   - Avoid string manipulation on JSON output

### ❌ NEVER Rules

**NEVER do these:**

1. **NEVER execute CDP commands without verifying session**
   - Session must be `active` state first

2. **NEVER hardcode CDP method lists**
   - Use self-discovery instead
   - Methods change between versions

3. **NEVER skip error handling**
   - Always use `2>&1` pattern
   - Check exit codes in scripts

4. **NEVER leave sessions running**
   - Cleanup with `bdg stop` or trap
   - Browser processes consume resources

5. **NEVER assume method names**
   - Verify with `--describe` first
   - Method signatures vary

6. **NEVER use on Windows without WSL**
   - PowerShell/Git Bash not supported

### ⚠️ ESCALATE IF

**Ask user when:**

1. **ESCALATE IF bdg not installed on Windows**
   - WSL required for Windows support
   - Ask if they have WSL configured

2. **ESCALATE IF Chrome/Chromium not found**
   - May need `CHROME_PATH` environment variable
   - Ask user to specify browser location

3. **ESCALATE IF session fails after 3 retries**
   - May indicate deeper issue
   - Ask about browser permissions/sandbox

4. **ESCALATE IF task requires cross-browser testing**
   - bdg is Chrome-only
   - Suggest Puppeteer/Playwright for cross-browser

5. **ESCALATE IF complex UI testing needed**
   - May be better suited for Puppeteer/Playwright
   - Ask about test framework preferences

---

## 5. SUCCESS CRITERIA

### Browser Debugging Completion Checklist

**Workflow complete when:**

- ✅ CLI vs MCP approach selected based on availability
- ✅ bdg installation verified (or MCP configured)
- ✅ Session started successfully (`active` state)
- ✅ CDP operations executed (exit code 0, valid JSON)
- ✅ Required data captured (screenshot, logs, cookies, etc.)
- ✅ Session stopped and cleaned up
- ✅ Output provided to user
- ✅ Error handling implemented (stderr captured)
- ✅ Method discovery documented

### Quality Targets

- **Session startup**: < 5 seconds
- **Screenshot capture**: < 2 seconds
- **Console log retrieval**: < 1 second
- **Error rate**: 0% (all errors handled gracefully)

---

## 6. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in [AGENTS.md](../../../AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py`
- **Tool Routing**: Per AGENTS.md Section 6 decision tree
- **Memory**: Context preserved via Spec Kit Memory MCP

### Related Skills

**mcp-code-mode**: Required for MCP fallback approach
- When CLI unavailable, Code Mode provides alternative
- Tool naming: `{manual_name}.{manual_name}_{tool_name}`

**sk-code**: Phase 3 browser testing integration
- Use bdg for verification during implementation
- Example integration pattern:
  ```bash
  npm run dev &
  sleep 5
  bdg http://localhost:3000 2>&1
  bdg dom screenshot verification.png 2>&1
  bdg console --list 2>&1 > console.json
  bdg stop 2>&1
  ```

### Tool Usage Guidelines

**Bash**: All bdg commands, session management, error handling
**Read**: Load reference files when detailed guidance needed
**Grep**: Filter command output, search logs
**Glob**: Find screenshot files, locate HAR exports

### External Tools

**browser-debugger-cli (bdg)**:
- Installation: `npm install -g browser-debugger-cli@alpha`
- Purpose: Primary CLI for browser debugging
- Fallback: Use MCP via Code Mode if unavailable

**Chrome/Chromium**:
- Installation: System package manager or direct download
- Purpose: Browser runtime for CDP connection
- Fallback: Set `CHROME_PATH` if not auto-detected

---

## 7. QUICK REFERENCE

### Essential CLI Commands

```bash
# Discovery
bdg cdp --list                # List domains
bdg cdp --describe Page       # Domain methods
bdg cdp --search screenshot   # Find methods

# Session
bdg <url>                     # Start
bdg status                    # Check
bdg stop                      # Stop

# Helpers
bdg dom screenshot <path>     # Screenshot
bdg console --list            # Console
bdg network getCookies        # Cookies
bdg dom query "<sel>"         # DOM query
bdg dom eval "<expr>"         # Execute JS
bdg network har <path>        # HAR export
```

### MCP Tools (Isolated Instances)

```typescript
// Tool naming: {instance}.{instance}_{tool_name}
// Each instance runs isolated browser (--isolated=true)

// Instance 1
chrome_devtools_1.chrome_devtools_1_navigate_page({ url: "..." })
chrome_devtools_1.chrome_devtools_1_take_screenshot({})
chrome_devtools_1.chrome_devtools_1_list_console_messages({})

// Instance 2 (parallel testing)
chrome_devtools_2.chrome_devtools_2_navigate_page({ url: "..." })
chrome_devtools_2.chrome_devtools_2_take_screenshot({})
```

### Error Handling Pattern

```bash
#!/bin/bash
trap "bdg stop 2>&1" EXIT INT TERM
command -v bdg || { echo "Install bdg first"; exit 1; }
bdg "$URL" 2>&1 || exit 1
# ... operations ...
```
