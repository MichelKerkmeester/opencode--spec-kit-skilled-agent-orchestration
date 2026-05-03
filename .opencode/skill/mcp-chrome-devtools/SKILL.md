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

- Pattern 1: Runtime Discovery - `discover_markdown_resources()` recursively scans `references/` and `assets/`.
- Pattern 2: Existence-Check Before Load - `load_if_available()` uses `_guard_in_skill()`, `inventory`, and `seen`.
- Pattern 3: Extensible Routing Key - CLI/MCP/install/troubleshoot/automation intents select browser-debugging resources.
- Pattern 4: Multi-Tier Graceful Fallback - `UNKNOWN_FALLBACK` requests CLI/MCP/session disambiguation and missing intent routes return a "no knowledge base" notice.

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
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def score_intents(task) -> dict[str, float]:
    """Weighted intent scoring from request text and routing signals."""
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

Prefer CLI (`bdg`) for fast, low-token browser inspection. Use MCP via Code Mode when browser work must be chained with other tools or parallel isolated sessions.

### CLI Approach (Priority) - browser-debugger-cli (bdg)

#### Installation & Verification

Check with `command -v bdg`, install with `npm install -g browser-debugger-cli@alpha`, then verify `bdg --version 2>&1`.

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

Configure one or more Chrome DevTools MCP entries in `.utcp_config.json` with `--isolated=true` when parallel browser sessions are needed.

#### Configuration Check

```bash
cat .utcp_config.json | jq '.manual_call_templates[] | select(.name | startswith("chrome_devtools"))'
```

#### Invocation Pattern

Tool naming is `{manual_name}.{manual_name}_{tool_name}`. Run MCP browser operations inside `call_tool_chain()` and close pages in a `finally` block.

#### Available MCP Tools

Common MCP tools include navigation, screenshots, console messages, viewport resize, clicks, form fill, hover, keyboard, waits, page creation/selection/close. Use underscores in tool names and confirm exact names with Code Mode discovery.

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

Always close browser instances when done. Wrap Code Mode browser operations in `try/finally` so cleanup runs even on errors.

---

## 4. RULES

### ✅ ALWAYS Rules

1. Check CLI availability first and prefer CLI when it fits.
2. Use discovery commands before CDP methods.
3. Verify session status before CDP commands.
4. Capture stderr with `2>&1`.
5. Stop sessions after operations.
6. Use `jq` for JSON processing.

### ❌ NEVER Rules

1. Execute CDP commands without an active session.
2. Hardcode CDP method lists.
3. Skip error handling or exit-code checks.
4. Leave sessions running.
5. Assume method names without discovery.
6. Use on Windows without WSL.

### ⚠️ ESCALATE IF

1. Chrome/Chromium cannot be found.
2. Sessions fail after 3 retries.
3. Cross-browser testing is required.
4. Complex UI testing needs a heavier framework.
5. Windows use lacks WSL.

---

## 5. SUCCESS CRITERIA

### Browser Debugging Completion Checklist

Workflow is complete when CLI/MCP path is selected, installation or config is verified, session is active, CDP operations exit 0 with valid JSON, requested data is captured, sessions are cleaned up, and discovery/error handling are documented.

### Quality Targets

Quality targets are fast session startup, quick screenshot/console capture, and handled errors.

---

## 6. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in [AGENTS.md](../../../AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py`
- **Tool Routing**: Per AGENTS.md Section 6 decision tree
- **Memory**: Context preserved via Spec Kit Memory MCP

### Tool Usage Guidelines

Use Bash for `bdg`, Read for references, Grep for logs/output, and Glob for screenshots/HAR exports. Chrome/Chromium is the runtime; set `CHROME_PATH` if auto-detection fails.

---

## 7. QUICK REFERENCE

### Essential CLI Commands

Use `bdg cdp --list`, `bdg cdp --describe <domain>`, `bdg cdp --search <term>`, `bdg <url>`, `bdg status`, `bdg stop`, `bdg dom screenshot <path>`, `bdg console --list`, `bdg dom query`, `bdg dom eval`, and `bdg network har <path>`. In shell scripts, install a trap so `bdg stop 2>&1` runs on exit.

---

## 8. REFERENCES AND RELATED RESOURCES

The router discovers reference, asset, and script docs dynamically. Start with `references/cdp_patterns.md`, `references/session_management.md`, `references/troubleshooting.md`, then load task-specific resources from `references/`, templates from `assets/`, and automation from `scripts/` when present.

Scripts: `scripts/install.sh`.

Related skills: `mcp-code-mode` for MCP fallback and `sk-code` for browser verification in application-code workflows.

Install guide: [INSTALL_GUIDE.md](INSTALL_GUIDE.md).
