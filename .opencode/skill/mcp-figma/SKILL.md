---
name: mcp-figma
description: "Figma design file access via MCP providing 18 tools for file retrieval, image export, component/style extraction, team management, and collaborative commenting. Accessed via Code Mode for token-efficient workflows."
allowed-tools: [Read, mcp__code_mode__call_tool_chain, mcp__code_mode__list_tools, mcp__code_mode__search_tools, mcp__code_mode__tool_info]
version: 1.0.7.0
---

<!-- Keywords: figma, mcp-figma, design-files, components, styles, images, export, design-tokens, design-system, collaboration, comments, team-projects -->

# Figma MCP - Design File Access

Programmatic access to Figma design files through 18 specialized tools covering file retrieval, image export, component/style extraction, and collaboration. Accessed **via Code Mode** for token-efficient on-demand access.

**Core Principle**: Design-to-code bridge - Figma MCP enables AI assistants to read and understand design files.

### Two Options Available

| Option | Name | Type | Best For |
|--------|------|------|----------|
| **A** | Official Figma MCP | HTTP (mcp.figma.com) | Simplicity - no install, OAuth login |
| **B** | Framelink (3rd-party) | stdio (local) | Code Mode integration, API key auth |

**Recommendation:** Start with **Option A** (Official) - zero installation, OAuth login, works immediately. See [Install Guide](./INSTALL_GUIDE.md) for setup details.

## 1. WHEN TO USE

### Activation Triggers

**Use when**:
- Retrieving Figma design file structure or content
- Exporting design elements as images (PNG, SVG, PDF)
- Extracting components for design system documentation
- Getting design tokens (colors, typography, effects)
- Managing team projects and files
- Reading or posting design review comments

**Keyword Triggers**:
- Files: "figma file", "design file", "get design", "figma document"
- Images: "export image", "export png", "export svg", "render node"
- Components: "figma components", "design system", "component library"
- Styles: "design tokens", "figma styles", "colors", "typography"
- Teams: "team projects", "project files", "figma team"
- Comments: "design comments", "review comments", "figma feedback"

### Use Cases

#### Design File Access
- Get complete Figma file structure
- Retrieve specific nodes by ID
- Access file version history
- Navigate page and frame hierarchy

#### Asset Export
- Export nodes as PNG, JPG, SVG, or PDF
- Control scale factor (0.01-4x)
- Get URLs for embedded images
- Batch export multiple nodes

#### Design System Documentation
- List all components in a file
- Extract component metadata
- Get team-wide component libraries
- Document component sets

#### Design Token Extraction
- Get color styles (fills)
- Get typography styles (text)
- Get effect styles (shadows, blurs)
- Get grid styles

#### Collaboration
- Read comments on designs
- Post review feedback
- Reply to existing comments
- Delete comments

### When NOT to Use

**Do not use for**:
- Creating or editing Figma designs → Use Figma directly
- Real-time collaboration → Use Figma's native features
- File storage/backup → Use Figma's version history
- Design prototyping → Use Figma's prototyping tools

---

## 2. SMART ROUTING


### Resource Loading Levels

| Level       | When to Load             | Resources                    |
| ----------- | ------------------------ | ---------------------------- |
| ALWAYS      | Every skill invocation   | Quick start baseline         |
| CONDITIONAL | If intent signals match  | Tool and category references |
| ON_DEMAND   | Only on explicit request | Full-reference materials     |

### Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

- Pattern 1: Runtime Discovery - `discover_markdown_resources()` recursively scans `references/` and `assets/`.
- Pattern 2: Existence-Check Before Load - `load_if_available()` uses `_guard_in_skill()`, `inventory`, and `seen`.
- Pattern 3: Extensible Routing Key - quick-start/tool-reference signals route by setup, token, export, component, style, comment, and file intent.
- Pattern 4: Multi-Tier Graceful Fallback - `UNKNOWN_FALLBACK` asks for target/action disambiguation and missing intent routes return a "no knowledge base" notice.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/quick_start.md"

INTENT_SIGNALS = {
    "QUICK_START": {"weight": 4, "keywords": ["first use", "setup", "verify", "token", "getting started"]},
    "TOOL_REFERENCE": {"weight": 4, "keywords": ["which tool", "all tools", "parameters", "components", "styles", "comments", "export"]},
}

RESOURCE_MAP = {
    "QUICK_START": ["references/quick_start.md"],
    "TOOL_REFERENCE": ["references/tool_reference.md", "assets/tool_categories.md"],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full reference", "deep dive", "all figma tools", "figma design", "component screenshots", "main frame", "dashboard component", "scorecard component"],
    "ON_DEMAND": ["references/tool_reference.md", "assets/tool_categories.md"],
}

def _task_text(task) -> str:
    parts = [
        str(getattr(task, "query", "")),
        str(getattr(task, "text", "")),
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
    """Weighted intent scoring from request text and signals."""
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    if getattr(task, "is_first_use", False):
        scores["QUICK_START"] += 4
    if getattr(task, "needs_tool_discovery", False) or getattr(task, "needs_full_reference", False):
        scores["TOOL_REFERENCE"] += 4
    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["QUICK_START"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def route_figma_resources(task):
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
            "routing_key": "figma",
            "intents": intents,
            "intent_scores": scores,
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": ["Confirm quick start vs tool reference", "Confirm file/node/team/comment target", "Provide the Figma URL or node id if available"],
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

    result = {"routing_key": "figma", "intents": intents, "intent_scores": scores, "resources": loaded}
    if not matched_intents:
        result["notice"] = f"No knowledge base found for intent(s): {', '.join(intents)}"
    return result
```

---

## 3. HOW IT WORKS

### Code Mode Invocation

Figma MCP is accessed via Code Mode's `call_tool_chain()` for token efficiency.

**Naming Convention**:
```
figma.figma_{tool_name}
```

Process flow: discover tools with `search_tools()`/`tool_info()`, execute via `call_tool_chain()` with `figma.figma_{tool_name}({params})`, then parse and present results.

### Tool Invocation Examples

Use `search_tools({ task_description: "figma design components" })`, inspect with `tool_info({ tool_name: "figma.figma_get_file" })`, then call `figma.figma_get_file`, `figma.figma_get_image`, or `figma.figma_get_file_components` inside Code Mode.

### Finding Your File Key

The file key is in your Figma URL:
```
https://www.figma.com/file/ABC123xyz/My-Design
                           └─────────┘
                           This is fileKey
```

---

## 4. RULES

### ✅ ALWAYS

1. Use Code Mode for Figma invocation.
2. Use full tool names: `figma.figma_{tool_name}`.
3. Verify file keys from Figma URLs.
4. Handle pagination for team queries.
5. Check the API key before operations.

### ❌ NEVER

1. **NEVER skip the `figma_` prefix in tool names**
   - Wrong: `await figma.get_file({})`
   - Right: `await figma.figma_get_file({})`

2. **NEVER hardcode Figma tokens**
   - Use environment variables
   - Store in `.env` file

3. **NEVER assume node IDs are stable**
   - Node IDs can change when designs are edited
   - Re-fetch if operations fail

4. **NEVER ignore rate limits**
   - Figma API has rate limits
   - Add delays for batch operations

### ⚠️ ESCALATE IF

1. **ESCALATE IF authentication fails repeatedly**
   - Token may be expired
   - Regenerate in Figma settings

2. **ESCALATE IF file not found**
   - Verify file key from URL
   - Check file permissions

3. **ESCALATE IF rate limited**
   - Wait before retrying
   - Reduce request frequency

---

## 5. SUCCESS CRITERIA

### File Access Complete

**File access complete when**:
- ✅ `get_file` returns file structure
- ✅ File name and pages accessible
- ✅ Node hierarchy navigable

### Image Export Complete

**Image export complete when**:
- ✅ `get_image` returns image URLs
- ✅ URLs are accessible and valid
- ✅ Format and scale as requested

### Component Extraction Complete

**Component extraction complete when**:
- ✅ `get_file_components` returns component list
- ✅ Component names and keys accessible
- ✅ Node IDs available for further queries

### Style Extraction Complete

**Style extraction complete when**:
- ✅ `get_file_styles` returns style list
- ✅ Style types categorized (FILL, TEXT, EFFECT, GRID)
- ✅ Style names and keys accessible

### Validation Checkpoints

| Checkpoint         | Validation                           |
| ------------------ | ------------------------------------ |
| `tools_discovered` | `search_tools()` returns Figma tools |
| `auth_verified`    | `check_api_key()` confirms token     |
| `file_accessible`  | `get_file()` returns file data       |
| `export_working`   | `get_image()` returns URLs           |

---

## 6. INTEGRATION POINTS

### Prerequisites

Before using this skill, ensure `mcp-code-mode` is available, Figma is configured in `.utcp_config.json`, and the Figma access token is present in `.env`.

### Code Mode Dependency (REQUIRED)

> **⚠️ CRITICAL**: This skill REQUIRES `mcp-code-mode`. Figma tools are NOT accessible without Code Mode.

`opencode.json` configures Code Mode, and Code Mode reads `.utcp_config.json`, where the Figma provider and token substitution are configured.

Configure the Figma provider in `.utcp_config.json` with the `figma-developer-mcp` stdio package and `FIGMA_API_KEY` environment substitution.

> **⚠️ CRITICAL: Prefixed Environment Variables**
>
> Code Mode prefixes all environment variables with `{manual_name}_`. For the config above with `"name": "figma"`, your `.env` file must use:
> ```bash
> figma_FIGMA_API_KEY=figd_your_token_here
> ```
> **NOT** `FIGMA_API_KEY=figd_...` (this will cause "Variable not found" errors)

### Related Skills

`mcp-code-mode` is required because Figma is accessed through Code Mode's `call_tool_chain()`.

### Cross-Tool Workflows

Common Code Mode chains include Figma to ClickUp task creation and Figma image export to Webflow/CMS updates.

---

## 7. QUICK REFERENCE

### Essential Commands

Common tools: `get_file`, `get_image`, `get_file_components`, `get_file_styles`, `get_comments`, and `post_comment`, all invoked as `figma.figma_<tool>({ ... })`.

### Common Patterns

Use Code Mode for file structure reads, multi-node PNG export, component metadata extraction, style inventory, and comments. Keep examples in task-local notes rather than in this router.

### Troubleshooting

Regenerate invalid tokens, verify file keys from URLs, add delays for rate limits, re-fetch files when node IDs change, and confirm whether components are published.

---

## 8. RELATED RESOURCES

### references/ and assets/

Runtime discovery loads markdown from `references/` and `assets/`; keep reference details there rather than duplicating static inventories in this file.

### External Resources

Use the Figma API docs, official Figma MCP docs, and `figma-developer-mcp` package docs for provider-specific details.

### Related Skills

See `mcp-code-mode` for tool orchestration and `INSTALL_GUIDE.md` for setup.
