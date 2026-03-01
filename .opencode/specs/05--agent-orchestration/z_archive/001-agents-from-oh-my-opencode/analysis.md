# Agent Architecture Analysis: oh-my-opencode

> Comprehensive analysis of agent implementations from the oh-my-opencode repository to inform agent development for the anobel.com Webflow project.

---

<!-- ANCHOR:executive-summary -->
## Executive Summary

oh-my-opencode is a production-tested agent system with **$24,000+ in testing investment** and **3K+ GitHub stars**. It implements a **hierarchical orchestration architecture** with:

- **1 Primary Orchestrator** (Sisyphus - Claude Opus 4.5)
- **6 Specialized Sub-agents** (Oracle, Librarian, Explore, Frontend UI/UX, Document Writer, Multimodal Looker)
- **Multi-model strategy** leveraging Claude, GPT, Gemini, and Grok for different task types
- **Background agent dispatch** for parallel execution
- **Tool restriction patterns** preventing agent chaos

**Key Insight:** The system's success comes from **intentional constraints** - each agent has a narrow focus with explicit tool restrictions, not from giving agents maximum capability.

---

<!-- /ANCHOR:executive-summary -->


<!-- ANCHOR:oh-my-opencode-agent-inventory -->
## oh-my-opencode Agent Inventory

| Agent | Model | Role | Mode | Key Constraint |
|-------|-------|------|------|----------------|
| **Sisyphus** | Claude Opus 4.5 | Primary orchestrator | primary | Full tool access, coordinates all work |
| **Oracle** | GPT-5.2 | Strategic advisor | subagent | Read-only, no file changes, no delegation |
| **Librarian** | Claude Sonnet 4.5 | External research | subagent | Read-only, no background tasks |
| **Explore** | Grok | Fast codebase search | subagent | Read-only, structured output format |
| **Frontend UI/UX** | Gemini 3 Pro | Visual development | subagent | Can write, no background tasks |
| **Document Writer** | Gemini 3 Flash | Technical writing | subagent | Can write, no background tasks |
| **Multimodal Looker** | Gemini 3 Flash | Media analysis | subagent | Read-only, highly constrained |

---

<!-- /ANCHOR:oh-my-opencode-agent-inventory -->


<!-- ANCHOR:detailed-agent-analysis -->
## Detailed Agent Analysis

### Sisyphus (Primary Orchestrator)

**Purpose:** Main orchestrator that coordinates all other agents. Named after the Greek mythological figure, emphasizing relentless work ethic.

**System Prompt Philosophy:**
- "SF Bay Area engineer. Work, delegate, verify, ship. No AI slop."
- Code should be "indistinguishable from a senior engineer's"
- Never starts implementing unless explicitly requested

**Phase-Based Workflow:**
1. **Phase 0 - Intent Gate**: Classifies requests (Trivial, Explicit, Exploratory, Open-ended, GitHub Work, Ambiguous)
2. **Phase 1 - Codebase Assessment**: Evaluates project maturity
3. **Phase 2A - Exploration**: Tool selection with cost awareness
4. **Phase 2B - Implementation**: Frontend delegation gate, verification requirements
5. **Phase 2C - Failure Recovery**: 3-strike rule, mandatory revert
6. **Phase 3 - Completion**: Verification checklist, background task cleanup

**Key Behavioral Rules:**
- **Frontend Gate**: Visual changes MUST delegate to frontend-ui-ux-engineer
- **Todo Obsession**: Create todos BEFORE starting, mark progress IMMEDIATELY
- **Oracle Escalation**: Consult after 2+ failed fix attempts
- **No Announcements**: Just start working, no "I'm on it" messages

**Delegation Prompt Structure (MANDATORY 7 sections):**
1. TASK
2. EXPECTED OUTCOME
3. REQUIRED SKILLS
4. REQUIRED TOOLS
5. MUST DO
6. MUST NOT DO
7. CONTEXT

---

### Oracle (Strategic Advisor)

**Purpose:** Senior engineering consultant for complex decisions. Read-only, advisory role.

**Expertise Areas:**
- Codebase dissection and pattern understanding
- Concrete, implementable recommendations
- Architecture solutions and refactoring roadmaps
- Root cause analysis for intricate issues

**Decision Framework (Pragmatic Minimalism):**
- Bias toward simplicity
- Leverage existing code over new components
- One clear path (mention alternatives only with different trade-offs)

**Effort Estimation Tags:**
- Quick (<1h), Short (1-4h), Medium (1-2d), Large (3d+)

**Tool Restrictions:** `write: false, edit: false, task: false, background_task: false`

**Invocation Triggers:**
- Complex architecture design
- After 2+ failed fix attempts
- Unfamiliar code patterns
- Security/performance concerns

---

### Librarian (External Research)

**Purpose:** Specialized for external research - official docs, GitHub examples, open-source implementations.

**Request Classification:**
| Type | Trigger | Tools |
|------|---------|-------|
| TYPE A: Conceptual | "How do I use X?" | context7 + websearch_exa (parallel) |
| TYPE B: Implementation | "Show me source of Z" | gh clone + read + blame |
| TYPE C: Context | "Why was this changed?" | gh issues/prs + git log/blame |
| TYPE D: Comprehensive | Complex/ambiguous | ALL tools in parallel |

**Parallel Execution Requirements:**
- TYPE A: 3+ parallel calls
- TYPE B: 4+ parallel calls
- TYPE C: 4+ parallel calls
- TYPE D: 6+ parallel calls

**Citation Format:** Every claim MUST include a GitHub permalink with commit SHA.

**Tool Restrictions:** `write: false, edit: false, background_task: false`

---

### Explore (Fast Codebase Search)

**Purpose:** "Contextual grep for codebases" - fast file and code discovery.

**Mandatory Deliverables:**
1. **Intent Analysis** (in `<analysis>` tags)
2. **Parallel Execution**: 3+ tools simultaneously on first action
3. **Structured Results** (in `<results>` tags with `<files>`, `<answer>`, `<next_steps>`)

**Success Criteria:**
- ALL paths must be absolute
- Find ALL relevant matches
- Caller can proceed without follow-up questions

**Tool Restrictions:** `write: false, edit: false, background_task: false`

**Model Choice:** Grok - "Free, fast, plenty smart for file traversal"

---

### Frontend UI/UX Engineer

**Purpose:** "A designer-turned-developer who crafts stunning UI/UX even without design mockups."

**Design Process:**
1. Purpose: What problem does this solve?
2. Tone: Pick an extreme (brutally minimal, maximalist chaos, retro-futuristic, etc.)
3. Constraints: Technical requirements
4. Differentiation: ONE memorable thing

**Anti-Patterns (NEVER):**
- Generic fonts (Arial/Inter/Roboto/System/Space Grotesk)
- Purple gradients on white (labeled "AI slop")
- Predictable layouts
- Cookie-cutter designs

**Tool Restrictions:** `background_task: false` (can read/write files)

---

### Document Writer

**Purpose:** Technical writer for README files, API docs, architecture docs, and user guides.

**Code of Conduct:**
1. Diligence & Integrity: Complete what is asked, no shortcuts
2. Continuous Learning: Study before writing
3. Precision & Standards: Follow exact specifications
4. Verification-Driven: Always verify code examples
5. Transparency: Announce each step

**Tool Restrictions:** `background_task: false`

---

### Multimodal Looker

**Purpose:** Analyze media files (PDFs, images, diagrams) that require interpretation beyond raw text.

**Capabilities:**
- PDFs: extract text, structure, tables
- Images: describe layouts, UI elements, diagrams
- Diagrams: explain relationships, flows, architecture

**Tool Restrictions:** `write: false, edit: false, bash: false, background_task: false` (most constrained)

---

<!-- /ANCHOR:detailed-agent-analysis -->


<!-- ANCHOR:communication-delegation-patterns -->
## Communication & Delegation Patterns

### Delegation Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SISYPHUS (Orchestrator)                       │
│                    Claude Opus 4.5 - Full Access                 │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│    Oracle     │   │   Librarian   │   │    Explore    │
│   GPT-5.2     │   │ Claude Sonnet │   │     Grok      │
│  (Advisory)   │   │  (Research)   │   │   (Search)    │
│  READ-ONLY    │   │  READ-ONLY    │   │  READ-ONLY    │
└───────────────┘   └───────────────┘   └───────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ Frontend UI/UX│   │ Doc Writer    │   │ Multimodal    │
│  Gemini Pro   │   │ Gemini Flash  │   │ Gemini Flash  │
│  (Creative)   │   │  (Writing)    │   │  (Vision)     │
│  CAN WRITE    │   │  CAN WRITE    │   │  READ-ONLY    │
└───────────────┘   └───────────────┘   └───────────────┘
```

### Key Pattern: Tool Restriction Inheritance

Sub-agents have `background_task: false` - **only the orchestrator can spawn background tasks**, preventing recursive delegation chains.

### Parallel vs Sequential Execution

**Parallel is DEFAULT** for explore/librarian:
```
// CORRECT: Always background, always parallel
background_task(agent="explore", prompt="Find auth implementations...")
background_task(agent="explore", prompt="Find error handling patterns...")
background_task(agent="librarian", prompt="Find JWT best practices...")
// Continue working immediately
```

**Sequential only** when output depends on prior results.

### Message Format (7-Section Delegation)

```
1. TASK: Atomic, specific goal
2. EXPECTED OUTCOME: Concrete deliverables
3. REQUIRED SKILLS: Which skill to invoke
4. REQUIRED TOOLS: Explicit tool whitelist
5. MUST DO: Exhaustive requirements
6. MUST NOT DO: Forbidden actions
7. CONTEXT: File paths, patterns, constraints
```

---

<!-- /ANCHOR:communication-delegation-patterns -->


<!-- ANCHOR:architectural-patterns -->
## Architectural Patterns

### 1. Factory Pattern for Agent Creation
Each agent uses a factory function allowing model override and consistent structure.

### 2. Mode-Based Hierarchy
- **primary**: Main orchestrator, always active
- **subagent**: Specialists invoked by primary

### 3. Model-Specific Reasoning
```typescript
if (isGptModel(model)) {
  return { reasoningEffort: "medium" }
}
return { thinking: { budgetTokens: 32000 } }
```

### 4. Environment Context Injection
Explicit date awareness: "NEVER search for 2024 - It is NOT 2024 anymore"

### 5. Configuration Override System
Agents support deep merging with user overrides including `prompt_append`.

---

<!-- /ANCHOR:architectural-patterns -->


<!-- ANCHOR:current-environment-comparison -->
## Current Environment Comparison

### What We Have

| Capability | oh-my-opencode | anobel.com |
|------------|----------------|------------|
| Orchestrator | Sisyphus (Claude Opus) | AGENTS.md (single agent) |
| Sub-agents | 6 specialized agents | None (skills only) |
| Background dispatch | Yes | No |
| Model selection | Per-agent | Implicit |
| Tool restrictions | Per-agent | Global |
| Gate system | Phase-based | 7-gate workflow |
| Memory | Todo-driven | Spec Kit Memory MCP |
| Skills | N/A | 8 specialized skills |

### Gap Analysis

| Gap | Impact | Priority |
|-----|--------|----------|
| No multi-agent dispatch | Serial processing, no parallelism | P0 |
| No background agents | Can't explore while implementing | P0 |
| No model selection matrix | Suboptimal model usage | P1 |
| No specialized CSS agent | CSS debugging is manual | P1 |
| No visual QA agent | Manual browser verification | P1 |
| No Webflow CMS agent | CMS operations lack specialization | P1 |

---

<!-- /ANCHOR:current-environment-comparison -->


<!-- ANCHOR:key-insights-for-implementation -->
## Key Insights for Implementation

### 1. Specialization Trumps Generalization
Each agent has a clear, narrow purpose with explicit tool restrictions.

### 2. Tool Restrictions Prevent Chaos
By disabling certain tools per agent, the system prevents unintended changes and infinite delegation loops.

### 3. Prompts as Operational Manuals
Comprehensive guides with phase-based workflows, decision tables, and anti-patterns.

### 4. Multi-Model Orchestration
Right model for right task: Claude for orchestration, GPT for logic, Gemini for creative/visual, Grok for speed.

### 5. Background Agents as Workers
Async patterns dramatically improve throughput.

### 6. Verification as First-Class Citizen
Every agent emphasizes verification with lsp_diagnostics, code testing, and evidence requirements.

### 7. Anti-Slop Design
Explicit warnings against generic AI outputs, empty acknowledgments, and cookie-cutter solutions.

---

<!-- /ANCHOR:key-insights-for-implementation -->


<!-- ANCHOR:best-practices-summary-from-industry-research -->
## Best Practices Summary (from Industry Research)

### Architecture Patterns

| Pattern | When to Use |
|---------|-------------|
| **Prompt Chaining** | Predictable sequential tasks |
| **Routing** | Distinct task categories |
| **Parallelization** | Independent subtasks |
| **Orchestrator-Workers** | Complex, unpredictable workflows |
| **Evaluator-Optimizer** | Quality-critical output |
| **Hierarchical** | Large-scale coordination |

### Agent Specialization Guidelines

- **3-5 agents** for most tasks (Anthropic recommendation)
- **More than 7** becomes difficult to coordinate
- **Start minimal**, add agents only when measured improvement

### Anti-Patterns to Avoid

| Don't | Do Instead |
|-------|------------|
| Build complex systems for simple tasks | Start simple, add complexity when needed |
| Use vague role definitions | Specific role + goal + backstory |
| Skip tool documentation | Invest in ACI as much as HCI |
| Let agents run autonomously | Include human checkpoints |
| Accumulate unlimited context | Summarize, retrieve selectively |

---

<!-- /ANCHOR:best-practices-summary-from-industry-research -->


<!-- ANCHOR:sources -->
## Sources

1. oh-my-opencode repository: https://github.com/code-yeongyu/oh-my-opencode
2. Anthropic. "Building Effective Agents." Dec 2024
3. OpenAI. "Practices for Governing Agentic AI Systems." Dec 2023
4. Microsoft AutoGen Documentation
5. CrewAI Documentation

---

<!-- /ANCHOR:sources -->


<!-- ANCHOR:part-2-model-agnostic-agent-design-for-anobelcom -->
## Part 2: Model-Agnostic Agent Design for anobel.com

> Refined analysis based on user requirements: 4 agents + improved orchestrator, all model-agnostic, leveraging existing skills and commands.

### Design Principles

#### 1. Model Agnostic Architecture

**Key principle:** Agents define WHAT they do, not WHICH model does it.

| Traditional Approach | Model-Agnostic Approach |
|---------------------|------------------------|
| `model: "gemini-pro"` | No model field |
| "Use GPT for logic" | "Use for logical reasoning tasks" |
| Model-specific prompts | Capability-focused prompts |

**Benefits:**
- Works with any configured model
- No vendor lock-in
- Easier maintenance
- User controls model selection globally

#### 2. Skill-First Design

Agents are **thin wrappers** that:
1. Know WHEN to invoke a skill
2. Know HOW to pass context to the skill
3. Know HOW to interpret skill output
4. Add agent-specific behavior on top

**Relationship:**
```
Agent (WHO) → invokes → Skill (HOW) → uses → Tools (WHAT)
```

#### 3. Command Integration

Agents leverage existing commands rather than duplicating functionality:
- `/memory:*` commands for context
- `/create:*` commands for documentation
- `/spec_kit:*` commands for workflows
- `/search:*` commands for discovery

---

### Existing Infrastructure Analysis

#### Skills Available

| Skill | Purpose | Agent Integration |
|-------|---------|-------------------|
| **sk-doc** | 4 modes: Document Quality, Skill Creation, Flowcharts, Install Guides | Documentation Writer invokes this |
| **mcp-chrome-devtools** | CLI (bdg) + MCP browser debugging | Front-end Debug Agent invokes this |
| **system-spec-kit** | Spec folders, memory, templates | Librarian uses for planning |
| **mcp-leann** | Semantic code search | Librarian uses for research |
| **mcp-narsil** | Structural queries, security scanning | Front-end Debug Agent uses for analysis |
| **mcp-code-mode** | External MCP orchestration | Webflow MCP Agent uses for Webflow API |

#### Commands Available

| Category | Commands | Agent Usage |
|----------|----------|-------------|
| **Documentation** | `/create:skill`, `/create:skill_reference`, `/create:skill_asset`, `/create:folder_readme`, `/create:install_guide` | Documentation Writer |
| **Memory/Research** | `/memory:save`, `/memory:search`, `/memory:checkpoint`, `/spec_kit:research` | Librarian |
| **Planning** | `/spec_kit:plan`, `/spec_kit:complete`, `/spec_kit:implement` | Librarian (replaces default planning) |
| **Debug** | `/spec_kit:debug`, `/search:code` | Front-end Debug Agent |

#### MCP Tools Available

| MCP | Tools | Agent Usage |
|-----|-------|-------------|
| **Webflow** (via Code Mode) | 30+ tools: sites, collections, pages, elements, styles | Webflow MCP Agent |
| **Chrome DevTools** (via Code Mode) | 26 tools per instance: navigate, screenshot, console, DOM | Front-end Debug Agent |
| **LEANN** (native) | search, ask, build, list | Librarian |
| **Spec Kit Memory** (native) | search, save, checkpoint, validate | Librarian |
| **Narsil** (via Code Mode) | 76 tools: security, symbols, call graphs | Front-end Debug Agent |

---

### The 4 Agents + Orchestrator

#### Agent 1: Webflow MCP Agent

**Purpose:** All Webflow platform operations via the Webflow MCP

**Skills:** None (direct MCP access via Code Mode)

**Tools:**
- Webflow MCP (via `call_tool_chain()`)
- Chrome DevTools MCP (for verification)
- Read (for context)

**Triggers:**
- Keywords: `webflow`, `cms`, `collection`, `site`, `page`, `publish`
- Patterns: CMS operations, site management, content updates

**Capabilities:**
- Site listing and management
- CMS collection CRUD operations
- Page metadata and content updates
- Publishing to domains
- Designer API operations (when Companion App open)

**Restrictions:**
- No file writes outside Webflow context
- Must verify changes via Chrome DevTools
- Cannot spawn background agents

**Invocation Pattern:**
```typescript
// Always start with sites_list
const sites = await call_tool_chain([
  { tool: "webflow.webflow_sites_list", args: {} }
]);
// Then chain operations
```

---

#### Agent 2: Documentation Writer

**Purpose:** Generate and maintain documentation using sk-doc skill

**Skills:** `sk-doc`

**Tools:**
- Read, Write, Edit
- LEANN (for codebase understanding)
- Spec Kit Memory (for prior documentation)

**Triggers:**
- Keywords: `document`, `readme`, `skill`, `flowchart`, `guide`, `install`
- Commands: `/create:skill`, `/create:folder_readme`, `/create:install_guide`

**Capabilities:**
- Mode 1: Document Quality (DQI scoring, structure enforcement)
- Mode 2: Skill Creation (9-step workflow)
- Mode 3: ASCII Flowcharts (7 patterns)
- Mode 4: Install Guides (5-phase template)

**Workflow:**
1. Classify document type (README, SKILL, Knowledge, Spec, etc.)
2. Run `extract_structure.py` for JSON analysis
3. Evaluate DQI components
4. Apply fixes based on checklist failures
5. Re-validate and verify improvement

**Restrictions:**
- Must follow DQI scoring standards
- Must use templates from `assets/` folder
- Cannot generate llms.txt without user approval
- Escalate if document type is ambiguous

---

#### Agent 3: Front-end Debug Agent

**Purpose:** Browser-based debugging using mcp-chrome-devtools skill

**Skills:** `mcp-chrome-devtools`

**Tools:**
- Chrome DevTools MCP (both instances)
- Read, Grep (for code context)
- Narsil (via Code Mode) for structural analysis

**Triggers:**
- Keywords: `debug`, `console`, `error`, `inspect`, `screenshot`, `browser`
- Patterns: Console errors, DOM issues, network problems, visual bugs

**Capabilities:**
- Console error analysis and categorization
- DOM inspection and queries
- Network debugging (cookies, HAR export)
- Screenshot capture and comparison
- Performance metrics collection
- Visual regression detection

**Workflow:**
1. Check CLI availability: `command -v bdg`
2. If available: Use CLI (faster, lower token cost)
3. If not: Use MCP via Code Mode
4. Always cleanup sessions (trap pattern)

**CLI Priority Pattern:**
```bash
bdg https://example.com 2>&1
bdg console logs 2>&1 | jq '.[] | select(.level=="error")'
bdg screenshot evidence.png 2>&1
bdg stop 2>&1
```

**Restrictions:**
- Read-only for code (advisory role)
- Must cleanup browser sessions
- Cannot modify files directly (reports findings)

---

#### Agent 4: Librarian (Replaces Default Planning)

**Purpose:** Research and context gathering that INFORMS planning

**Skills:** `system-spec-kit`, `mcp-leann`

**Tools:**
- LEANN (semantic code search)
- Spec Kit Memory MCP (prior work, decisions)
- Narsil (via Code Mode) for structural queries
- Read, Grep, Glob, WebFetch

**Triggers:**
- Keywords: `research`, `find`, `explore`, `prior`, `pattern`, `plan`
- Gate 3 Option B (new spec folder)
- `/spec_kit:research` command

**Capabilities:**
- Semantic code search (what code DOES)
- Memory search (prior decisions, context)
- Structural queries (symbols, call graphs)
- External documentation lookup
- Evidence-based planning

**The Librarian-First Paradigm:**

**Old workflow:**
```
Request → Plan (in vacuum) → Execute
```

**New workflow:**
```
Request → Librarian researches → Evidence-based plan → Execute
```

**Output Format:**
```markdown
## Research Findings

### Prior Work
- [Memory: 005-auth] - Auth uses JWT pattern
- [Memory: 007-forms] - Forms use Zod validation

### Existing Patterns
- [src/utils/validation.js] - Validation utility exists
- [src/components/Form/] - Form components follow X pattern

### Related Code
- [src/auth/login.js:45-67] - Similar functionality

### External References
- [Webflow Docs: CMS Limits] - 100 item limit applies

### Recommendations
- Reuse existing validation utility
- Follow established Form component pattern
```

**Restrictions:**
- Read-only (no file modifications)
- Must cite sources for all findings
- Cannot skip research for "simple" tasks

---

### Improved Orchestrator

**New capabilities:**

1. **Gate 2.5: Agent Routing**
   - After skill routing, check for agent-appropriate tasks
   - Route to specialized agents when complexity indicators match

2. **Librarian-First Planning**
   - Gate 3 Option B triggers Librarian dispatch
   - Research BEFORE creating spec folder
   - Evidence-based planning

3. **Agent Dispatch Protocol**
   - Simplified 4-section format (vs oh-my-opencode's 7-section)
   - Clear context passing
   - Result integration

**Agent Dispatch Format:**
```markdown
## Agent Dispatch: [AGENT_NAME]

### Task
[Specific, atomic goal]

### Context
[Relevant files, decisions, constraints]

### Expected Output
[What the agent should return]

### Constraints
- [What NOT to do]
- [Boundaries]
```

**New Routing Logic:**
```
TASK RECEIVED
    │
    ├─► Gate 2: Skill Routing (existing)
    │
    ├─► Gate 2.5: Agent Routing (NEW)
    │   ├─► Webflow keywords → Webflow MCP Agent
    │   ├─► Documentation keywords → Documentation Writer
    │   ├─► Debug keywords → Front-end Debug Agent
    │   └─► Research/planning → Librarian
    │
    ├─► Gate 3: Spec Folder Question
    │   └─► Option B → Librarian-first planning
    │
    └─► Continue existing gates...
```

---

### Key Differences from oh-my-opencode

| Aspect | oh-my-opencode | anobel.com |
|--------|----------------|------------|
| **Model selection** | Per-agent (Opus, GPT, Gemini, Grok) | Model-agnostic |
| **Agent count** | 7 agents | 4 agents + orchestrator |
| **Skill integration** | None (agents are standalone) | Agents invoke existing skills |
| **Command integration** | None | Agents leverage existing commands |
| **Planning approach** | Phase-based in orchestrator | Librarian-first paradigm |
| **Delegation format** | 7-section mandatory | 4-section simplified |
| **Tool restrictions** | Per-agent tool disabling | Per-agent via skill constraints |

---

### Implementation Priority

1. **Librarian** - Enables evidence-based planning (highest impact)
2. **Front-end Debug Agent** - Leverages existing chrome-devtools skill
3. **Documentation Writer** - Leverages existing documentation skill
4. **Webflow MCP Agent** - Specialized Webflow operations
5. **Orchestrator improvements** - Gate 2.5, Librarian-first planning

<!-- /ANCHOR:part-2-model-agnostic-agent-design-for-anobelcom -->
