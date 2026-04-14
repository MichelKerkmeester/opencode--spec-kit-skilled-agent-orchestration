---
name: cli-gemini
description: "Gemini CLI orchestrator enabling any AI assistant to invoke Google's Gemini CLI for supplementary AI tasks including code generation, web research via Google Search, codebase architecture analysis, cross-AI validation, and parallel task processing."
allowed-tools: [Bash, Read, Glob, Grep]
version: 1.2.3
---

<!-- Keywords: gemini, gemini-cli, google, cross-ai, web-search, codebase-investigator, code-generation, code-review, second-opinion, agent-delegation -->

# Gemini CLI Orchestrator - Cross-AI Task Delegation

Orchestrate Google's Gemini CLI for tasks that benefit from a second AI perspective, real-time web search via Google Search grounding, deep codebase architecture analysis, or parallel code generation.

**Core Principle**: Use Gemini for what it does best. Delegate, validate, integrate. The calling AI stays the conductor.

---

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Triggers

**Cross-AI Validation** - Use when:
- Code review needs a second perspective after writing code
- Security audit benefits from alternative analysis
- Bug detection where fresh eyes help

**Google Search Grounding** - Use when:
- Questions require current internet information
- Checking latest library versions, API changes, documentation
- Finding community solutions or recent best practices

**Codebase Architecture Analysis** - Use when:
- Onboarding to an unfamiliar codebase
- Mapping cross-file dependencies and component relationships
- Creating architecture documentation from existing code

**Parallel Task Processing** - Use when:
- Offloading generation tasks while continuing other work
- Running multiple code generations simultaneously
- Background documentation or test generation

**Agent-Delegated Tasks** - Use when:
- Task matches a specialized Gemini agent's expertise
- Deep investigation benefits from Gemini's 1M+ token context
- Multi-strategy planning needs an independent perspective

**Specialized Generation** - Use when:
- User explicitly requests Gemini operations
- Test suite generation for entire modules
- Code translation between languages
- Batch documentation generation (JSDoc, README, API docs)

### When NOT to Use

- **Self-invocation guard**: If you ARE Gemini CLI (running natively inside a Gemini CLI session), do NOT use this skill. You already have direct access to all capabilities described here — google_web_search, codebase_investigator, save_memory, and your agent system. Delegating to yourself via CLI is circular and wasteful. This skill is for EXTERNAL AIs (Claude Code, Codex, Copilot) to delegate TO Gemini CLI.
- Simple, quick tasks where CLI overhead is not worth it
- Tasks requiring immediate response (rate limits may cause delays)
- Context already loaded and understood by the current agent
- Interactive refinement requiring multi-turn conversation
- Tasks where Gemini CLI is not installed

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Prerequisite Detection

```bash
# Verify Gemini CLI is available before routing
command -v gemini || echo "Not installed. Run: npm install -g @google/gemini-cli"
```

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Verify Gemini CLI installed
    +- STEP 1: Score intents (top-2 when ambiguity is small)
    +- Phase 1: Construct prompt with agent routing
    +- Phase 2: Execute via Bash tool
    +- Phase 3: Validate and integrate output
```

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/` and then applies intent scoring from `INTENT_SIGNALS`.

```text
references/cli_reference.md          — CLI flags, commands, config
references/integration_patterns.md   — Cross-AI orchestration patterns
references/gemini_tools.md           — Built-in tools (google_web_search, codebase_investigator)
references/agent_delegation.md       — Gemini agent routing and invocation
assets/prompt_templates.md           — Copy-paste ready templates
assets/prompt_quality_card.md        — Framework-per-task selector, CLEAR 5-check, escalation triggers
```

### Resource Loading Levels

| Level       | When to Load            | Resources                      |
| ----------- | ----------------------- | ------------------------------ |
| ALWAYS      | Every skill invocation  | `references/cli_reference.md`, `assets/prompt_quality_card.md` |
| CONDITIONAL | If intent signals match | Intent-mapped reference docs   |
| ON_DEMAND   | Only on explicit request| Extended templates and patterns |

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/cli_reference.md"

INTENT_SIGNALS = {
    "GENERATION":        {"weight": 4, "keywords": ["generate", "create", "build", "write code", "gemini create"]},
    "REVIEW":            {"weight": 4, "keywords": ["review", "audit", "security", "bug", "second opinion", "cross-validate"]},
    "RESEARCH":          {"weight": 4, "keywords": ["search", "latest", "current", "what's new", "google search", "web research"]},
    "ARCHITECTURE":      {"weight": 3, "keywords": ["architecture", "codebase", "investigate", "dependencies", "analyze project"]},
    "AGENT_DELEGATION":  {"weight": 4, "keywords": ["delegate", "agent", "background", "parallel", "offload", "gemini agent"]},
    "TEMPLATES":         {"weight": 3, "keywords": ["template", "prompt", "how to ask", "gemini prompt"]},
    "PATTERNS":          {"weight": 3, "keywords": ["pattern", "workflow", "orchestrate"]},
}

RESOURCE_MAP = {
    "GENERATION":        ["references/cli_reference.md", "assets/prompt_templates.md"],
    "REVIEW":            ["references/integration_patterns.md", "references/agent_delegation.md"],
    "RESEARCH":          ["references/gemini_tools.md", "assets/prompt_templates.md"],
    "ARCHITECTURE":      ["references/gemini_tools.md", "references/agent_delegation.md"],
    "AGENT_DELEGATION":  ["references/agent_delegation.md", "references/integration_patterns.md"],
    "TEMPLATES":         ["assets/prompt_templates.md", "references/cli_reference.md"],
    "PATTERNS":          ["references/integration_patterns.md", "references/cli_reference.md"],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE, "assets/prompt_quality_card.md"],
    "ON_DEMAND_KEYWORDS": ["full reference", "all templates", "deep dive", "complete guide"],
    "ON_DEMAND": ["references/gemini_tools.md", "assets/prompt_templates.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Is the user asking about Gemini CLI specifically?",
    "Does the task benefit from a second AI perspective?",
    "Is real-time web information needed?",
    "Would codebase-wide analysis help?",
]

def _task_text(task) -> str:
    return " ".join([
        str(getattr(task, "text", "")),
        str(getattr(task, "query", "")),
        " ".join(getattr(task, "keywords", []) or []),
    ]).lower()

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
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["GENERATION"]  # zero-score fallback
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def route_gemini_resources(task):
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

    # 1. ALWAYS load baseline + fast-path prompt-quality asset
    for relative_path in LOADING_LEVELS["ALWAYS"]:
        load_if_available(relative_path)

    # 2. UNKNOWN FALLBACK: no keywords matched at all
    if max(scores.values()) == 0:
        load_if_available("references/cli_reference.md")
        return {
            "intents": ["GENERATION"],
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    # 3. CONDITIONAL: intent-mapped resources
    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    # 4. ON_DEMAND: explicit keyword triggers
    text = _task_text(task)
    if any(keyword in text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    # 5. Safety net
    if not loaded:
        load_if_available(DEFAULT_RESOURCE)

    return {"intents": intents, "intent_scores": scores, "resources": loaded}
```

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

### Prerequisites

Gemini CLI must be installed and authenticated:

```bash
# Verify installation
command -v gemini || echo "Not installed. Run: npm install -g @google/gemini-cli"

# First-time authentication (interactive)
gemini
```

**Authentication options**: Google OAuth (free tier: 60 req/min, 1000 req/day), API key (`export GEMINI_API_KEY=key`), or Vertex AI (enterprise).

### Core Invocation Pattern

All Gemini CLI calls follow this pattern:

```bash
gemini "[prompt]" -o text 2>&1
```

| Flag | Purpose |
|------|---------|
| `-o text` | Human-readable output (default for most tasks) |
| `-o json` | Structured output with stats (for programmatic processing) |
| `-m model` | Model selection: use `gemini-3.1-pro-preview` (only supported model) |
| `--yolo` or `-y` | Auto-approve all tool calls — **requires explicit user approval** |

### Model Selection

| Model | Use Case |
|-------|----------|
| `gemini-3.1-pro-preview` | All tasks (default and only model) |

### Gemini Agent Delegation

The calling AI acts as the **conductor** that delegates tasks to Gemini CLI. Gemini CLI has specialized agents in `.gemini/agents/` that provide domain expertise. Route tasks to the right agent for best results.

**Agent Routing Table:**

| Task Type | Gemini Agent | Invocation Pattern |
|-----------|-------------|-------------------|
| Code review / security audit | `@review` | `gemini "As @review agent: Review @./src/auth.ts for security issues" -o text` |
| Architecture exploration | `@context` | `gemini "As @context agent: Analyze the architecture of this project" -o text` |
| Technical research | `@deep-research` | `gemini "As @deep-research agent: Research latest Express.js security advisories" -o text` |
| Documentation generation | `@write` | `gemini "As @write agent: Generate README for this project" -o text` |
| Fresh-perspective debugging | `@debug` | `Task tool -> @debug`, then run the Gemini CLI prompt with the packaged context |
| Multi-strategy planning | `@ultra-think` | `gemini "As @ultra-think agent: Plan the authentication redesign" -m gemini-3.1-pro-preview -o text` |

**Orchestration principle**: The calling AI decides WHAT to delegate. The Gemini agent definition shapes HOW Gemini processes it. The calling AI always validates and integrates the output.

See [agent_delegation.md](./references/agent_delegation.md) for complete agent roster and invocation patterns.

### Unique Gemini Capabilities

These tools are available only through Gemini CLI:

| Tool | Purpose | Invocation |
|------|---------|------------|
| `google_web_search` | Real-time Google Search grounding | "Use Google Search to find..." |
| `codebase_investigator` | Deep architecture analysis | "Use codebase_investigator to..." |
| `save_memory` | Cross-session persistent context | "Remember that..." |

### Essential Commands

```bash
# Code generation
gemini "Create [description] with [features]. Output complete file." --yolo -o text

# Code review (second opinion)
gemini "Review [file] for bugs and security issues" -o text

# Web research (Google Search grounding)
gemini "What's new in [topic]? Use Google Search." -o text

# Architecture analysis
gemini "Use codebase_investigator to analyze this project" -o text

# Background execution
gemini "[long task]" --yolo -o text 2>&1 &

# Explicit model (only supported model)
gemini "[prompt]" -m gemini-3.1-pro-preview -o text
```

### Error Handling

| Issue | Solution |
|-------|----------|
| CLI not installed | `npm install -g @google/gemini-cli` |
| Rate limit exceeded | Wait for auto-retry or reduce request frequency |
| Auth expired | Run `gemini` interactively to re-authenticate |
| Context too large | Use `.geminiignore` or specify files explicitly |

---

<!-- /ANCHOR:how-it-works -->
<!-- ANCHOR:rules -->
## 4. RULES

### ✅ ALWAYS

**ALWAYS do these without asking:**

1. **ALWAYS verify Gemini CLI is installed** before first invocation
   - Run `command -v gemini` and handle missing installation gracefully

2. **ALWAYS use `-o text` for human-readable output** unless programmatic processing needed
   - Use `-o json` only when parsing stats or extracting structured data

3. **ALWAYS validate Gemini-generated code** before applying to the project
   - Check for security vulnerabilities (XSS, injection, eval)
   - Verify functionality matches requirements
   - Run syntax checks (`node --check`, `tsc --noEmit`, etc.)

4. **ALWAYS capture stderr** with `2>&1` to catch rate limit messages and errors

5. **ALWAYS use `gemini-3.1-pro-preview`** as the model — it is the only supported model
   - Invoke with `-m gemini-3.1-pro-preview` when explicit model selection is needed

6. **ALWAYS route to the appropriate Gemini agent** when the task matches an agent specialization
   - See agent routing table in Section 3

7. **ALWAYS pass the spec folder to the delegated agent** in the prompt
   - If the calling AI has an active spec folder (from Gate 3), include it in the prompt: `Spec folder: <path> (pre-approved, skip Gate 3)`
   - If the calling AI does NOT have a spec folder, it MUST ask the user for one BEFORE delegating — the delegated agent cannot answer Gate 3 interactively
   - This prevents the delegated agent from halting at the Gate 3 spec folder question in non-interactive mode
   - Example prompt suffix: `\n\nSpec folder: .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/022-spec-doc-indexing-bypass/ (pre-approved, skip Gate 3)`

8. **ALWAYS load `assets/prompt_quality_card.md` before building any dispatch prompt**
   - Apply the CLEAR 5-question check from the card
   - Tag the selected framework in the Bash invocation comment
   - If complexity is `>= 7/10` or compliance/security signals appear, dispatch `@improve-prompt` via the Task tool instead of loading `sk-improve-prompt` inline
   - Use the returned `ENHANCED_PROMPT` as the final Gemini prompt

### ❌ NEVER

**NEVER do these:**

1. **NEVER use `--yolo` on production codebases** without explicit user approval
   - `--yolo` auto-approves file writes and shell commands; this can cause damage

2. **NEVER trust Gemini output blindly** for security-sensitive code
   - Always review for XSS, injection, hardcoded secrets, and eval() calls

3. **NEVER send sensitive data** (API keys, passwords, credentials) in prompts
   - Gemini CLI transmits prompts to Google's API

4. **NEVER hammer the API** with rapid sequential calls
   - Respect rate limits; use batch operations or background execution

5. **NEVER use Gemini for tasks where context is already loaded**
   - If the current agent already understands the code, direct action is faster

6. **NEVER assume Gemini output is correct** without verification
   - Cross-reference with the codebase and project standards

7. **NEVER invoke this skill from within Gemini CLI itself**
   - If you ARE Gemini CLI, you already have native access to all capabilities — do not self-delegate via CLI
   - Self-invocation creates a circular, wasteful loop; use your native tools directly instead

### ⚠️ ESCALATE IF

**Ask user when:**

1. **ESCALATE IF Gemini CLI is not installed** and user has not acknowledged
   - Provide installation command: `npm install -g @google/gemini-cli`

2. **ESCALATE IF rate limits are persistently exceeded**
   - Suggest API key setup or model fallback strategy

3. **ESCALATE IF Gemini output conflicts with existing code patterns**
   - Present both perspectives and let user decide

4. **ESCALATE IF task requires `--yolo` on sensitive files**
   - Describe risks and get explicit user approval

### Memory Handback Protocol

When the calling AI needs to preserve session context from a Gemini CLI delegation:

1. **Include epilogue**: Append the Memory Epilogue template (see `assets/prompt_templates.md` §13) to the delegated prompt
2. **Extract section**: After receiving agent output, extract the `MEMORY_HANDBACK` section using: `/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/`
3. **Parse to structured JSON**: Build a payload anchored on the current structured contract: `specFolder`, `user_prompts`, `observations`, and `recent_context`, with optional `toolCalls`, `exchanges`, `preflight`, and `postflight` when you have them. Convenience fields such as `sessionSummary`, `filesModified`, `keyDecisions`, `triggerPhrases`, and `nextSteps` are still accepted and normalized, and documented snake_case keys such as `session_summary`, `files_modified`, `trigger_phrases`, `recent_context`, and `next_steps` also work.
4. **Redact and scrub**: Remove secrets, tokens, credentials, and any unnecessary sensitive values before sending the JSON payload to the save script
5. **Choose a structured-input mode**: Prefer `--stdin` when you already have the JSON in memory, use `--json` for a compact inline payload, or write a temp JSON file for larger handbacks
6. **Invoke generate-context.js**: `printf '%s' "$JSON_PAYLOAD" | node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin [spec-folder]`
7. **Index**: Run `memory_index_scan({ specFolder })` for immediate MCP visibility

**Missing delimiter handling**: If agent output lacks `MEMORY_HANDBACK` delimiters, the calling AI manually constructs the structured JSON payload from the agent output and saves it through the same structured-input flow. The save flow normalizes `nextSteps` or `next_steps`; the first entry persists as `Next: ...` and drives `NEXT_ACTION`, and remaining entries persist as `Follow-up: ...`.

**Target precedence**: When both the payload and the CLI specify a spec folder, the explicit CLI target wins. Use the CLI argument whenever the calling AI already knows the correct destination.

**Structured-input failures**: If an explicit temp file cannot be loaded, `generate-context.js` stops with `EXPLICIT_DATA_FILE_LOAD_FAILED: ...`. Surface the error and fix the file path or payload before retrying.

**Save gates**: Valid JSON can still be rejected after normalization. Thin payloads fail with `INSUFFICIENT_CONTEXT_ABORT`, and cross-spec payloads fail with `CONTAMINATION_GATE_ABORT`.

**Minimum payload guidance**: Include a specific summary, at least one meaningful `recent_context` entry, at least one useful observation, and rich `FILES` entries with a descriptive `DESCRIPTION`. Add `ACTION`, `MODIFICATION_MAGNITUDE`, `_provenance`, and `toolCalls` when known so the saved memory carries durable evidence instead of bare filenames.

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:references -->
## 5. REFERENCES

### Core References

- [cli_reference.md](./references/cli_reference.md) - Complete CLI command, flag, and slash command reference
- [integration_patterns.md](./references/integration_patterns.md) - Cross-AI orchestration patterns and workflows
- [gemini_tools.md](./references/gemini_tools.md) - Built-in tools documentation (google_web_search, codebase_investigator, save_memory)
- [agent_delegation.md](./references/agent_delegation.md) - Gemini agent roster, routing table, and invocation patterns

### Templates and Assets

- [prompt_templates.md](./assets/prompt_templates.md) - Copy-paste ready prompt templates for common tasks

### Reference Loading Notes

- Load only references needed for current intent
- Keep Smart Routing (Section 2) as the single routing authority
- `cli_reference.md` is ALWAYS loaded as baseline

---

<!-- /ANCHOR:references -->
<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

### Task Completion

- Gemini CLI invoked with correct flags and model selection
- Output captured, validated, and integrated appropriately
- No security vulnerabilities introduced from generated code
- Rate limits handled gracefully (retry or model fallback)
- Appropriate Gemini agent routed for specialized tasks

### Skill Quality

- SKILL.md under 5000 words with progressive disclosure
- All 8 sections present with proper anchor comments
- Smart routing covers all intent signals with UNKNOWN_FALLBACK
- Reference files provide deep-dive content without duplication

---

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:integration-points -->
## 7. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in [AGENTS.md](../../../AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py`
- **Tool Routing**: Per AGENTS.md Section 6 decision tree
- **Memory**: Context preserved via Spec Kit Memory MCP

### Tool Usage

| Tool | Purpose |
|------|---------|
| **Bash** | Execute `gemini` CLI commands |
| **Read** | Examine Gemini output files |
| **Glob** | Find generated files |
| **Grep** | Search within generated output |

### Related Skills

| Skill | Integration |
|-------|-------------|
| **sk-code-web** | Use Gemini for code review during web development |
| **sk-code-full-stack** | Delegate test generation or architecture analysis to Gemini |
| **mcp-code-mode** | Gemini CLI is independent; does not require Code Mode |

### External Tools

**Gemini CLI** (required):
- Installation: `npm install -g @google/gemini-cli`
- Purpose: Core execution engine for all delegated tasks
- Fallback: Skill informs user of installation steps if missing

---

<!-- /ANCHOR:integration-points -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

### Reference Files
- [cli_reference.md](./references/cli_reference.md) - CLI flags, commands, and configuration
- [integration_patterns.md](./references/integration_patterns.md) - Cross-AI orchestration patterns
- [gemini_tools.md](./references/gemini_tools.md) - Built-in tools (google_web_search, codebase_investigator)
- [agent_delegation.md](./references/agent_delegation.md) - Agent routing and invocation

### Templates
- [prompt_templates.md](./assets/prompt_templates.md) - Copy-paste ready prompt templates

### Related Skills
- `sk-doc` - Documentation generation that Gemini can supplement
- `sk-code-web` - Web development where Gemini provides second opinions
- `sk-code-full-stack` - Full-stack tasks with Gemini architecture analysis

### External
- [Gemini CLI GitHub](https://github.com/google-gemini/gemini-cli) - Official repository
- [Google AI Studio](https://aistudio.google.com/apikey) - API key management

---

<!-- /ANCHOR:related-resources -->
