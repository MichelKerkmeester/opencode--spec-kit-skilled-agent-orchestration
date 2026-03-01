---
title: "Research: Oh My Opencode Agent System (2026 Analysis) [005-agent-system-improvements/research]"
description: "Research ID: OMO-AGENT-2026-01"
trigger_phrases:
  - "research"
  - "opencode"
  - "agent"
  - "system"
  - "2026"
  - "005"
importance_tier: "normal"
contextType: "research"
---
# Research: Oh My Opencode Agent System (2026 Analysis)

**Research ID**: OMO-AGENT-2026-01
**Status**: Complete
**Date**: 2026-01-27
**Researcher**: Claude (Research Agent)
**Source**: https://github.com/code-yeongyu/oh-my-opencode (commit 9d66b807, branch: dev)

---

<!-- ANCHOR:executive-summary -->
## 1. EXECUTIVE SUMMARY

Oh My Opencode is an advanced multi-agent orchestration system for OpenCode with **10 specialized agents**, **32 lifecycle hooks**, and **20+ tools**. The system implements hierarchical orchestration with category-based task delegation and skill injection.

### Key Architecture Findings

| Component | Count | Purpose |
|-----------|-------|---------|
| **Agents** | 10 | Specialized AI workers with model-specific configurations |
| **Categories** | 7 | Domain-optimized model selection for task delegation |
| **Skills** | 11+ | Injected expertise domains for agent enhancement |
| **Hooks** | 32 | Lifecycle event handlers for workflow customization |
| **Tools** | 20+ | LSP, AST, delegation, background execution |

### Confidence Assessment

| Finding | Confidence | Evidence |
|---------|------------|----------|
| Agent structure patterns | HIGH | [SOURCE: src/agents/*.ts] |
| Delegation routing logic | HIGH | [SOURCE: src/tools/delegate-task/] |
| Category configurations | HIGH | [SOURCE: src/tools/delegate-task/constants.ts] |
| Skill injection mechanism | HIGH | [SOURCE: src/agents/utils.ts] |

---

<!-- /ANCHOR:executive-summary -->


<!-- ANCHOR:agent-structure-and-organization -->
## 2. AGENT STRUCTURE AND ORGANIZATION

### 2.1 File Structure

```
oh-my-opencode/
├── src/
│   ├── agents/
│   │   ├── AGENTS.md                    # Agent knowledge base documentation
│   │   ├── types.ts                     # Core type definitions
│   │   ├── utils.ts                     # Agent factory utilities
│   │   ├── index.ts                     # Barrel exports
│   │   ├── dynamic-agent-prompt-builder.ts  # Dynamic prompt generation
│   │   │
│   │   ├── sisyphus.ts                  # Primary orchestrator
│   │   ├── atlas.ts                     # Master orchestrator (todo holder)
│   │   ├── oracle.ts                    # Strategic advisor (GPT-5.2)
│   │   ├── librarian.ts                 # Multi-repo research
│   │   ├── explore.ts                   # Fast contextual grep
│   │   ├── multimodal-looker.ts         # Media analyzer
│   │   ├── prometheus-prompt.ts         # Planning agent (1196 lines)
│   │   ├── metis.ts                     # Pre-planning analysis
│   │   ├── momus.ts                     # Plan reviewer
│   │   └── sisyphus-junior.ts           # Category-spawned executor
│   │
│   ├── tools/
│   │   └── delegate-task/
│   │       ├── tools.ts                 # Delegation implementation
│   │       ├── types.ts                 # Delegation types
│   │       └── constants.ts             # Categories, prompts
│   │
│   ├── config/
│   │   └── schema.ts                    # Zod configuration schema
│   │
│   └── features/
│       ├── builtin-skills/
│       │   └── skills.ts                # Skill definitions (1729 lines)
│       └── background-agent/
│           └── manager.ts               # Task lifecycle (1377 lines)
```

### 2.2 Agent Inventory (10 Agents)

| Agent | Model | Temperature | Purpose | Tool Restrictions |
|-------|-------|-------------|---------|-------------------|
| **Sisyphus** | claude-opus-4-5 | 0.1 | Primary orchestrator | Full access |
| **Atlas** | claude-opus-4-5 | 0.1 | Master orchestrator (holds todo) | Full access |
| **Oracle** | gpt-5.2 | 0.1 | Consultation, debugging | No write/edit/task/delegate |
| **Librarian** | opencode/big-pickle | 0.1 | Docs, GitHub search | No write/edit/task/delegate/call_omo_agent |
| **Explore** | opencode/gpt-5-nano | 0.1 | Fast contextual grep | No write/edit/task/delegate/call_omo_agent |
| **Multimodal-looker** | gemini-3-flash | 0.1 | PDF/image analysis | Allowlist: read only |
| **Prometheus** | claude-opus-4-5 | 0.1 | Strategic planning | Planning only |
| **Metis** | claude-sonnet-4-5 | 0.3 | Pre-planning analysis | Gap detection |
| **Momus** | claude-sonnet-4-5 | 0.1 | Plan validation | Ruthless fault-finding |
| **Sisyphus-Junior** | claude-sonnet-4-5 | 0.1 | Category-spawned executor | No task/delegate |

---

<!-- /ANCHOR:agent-structure-and-organization -->


<!-- ANCHOR:agent-definition-format -->
## 3. AGENT DEFINITION FORMAT

### 3.1 Type Definitions

```typescript
// From src/agents/types.ts
import type { AgentConfig } from "@opencode-ai/sdk"

export type AgentFactory = (model: string) => AgentConfig

export type AgentCategory = "exploration" | "specialist" | "advisor" | "utility"
export type AgentCost = "FREE" | "CHEAP" | "EXPENSIVE"

export interface DelegationTrigger {
  domain: string    // e.g., "Architecture decisions"
  trigger: string   // e.g., "Multi-system tradeoffs, unfamiliar patterns"
}

export interface AgentPromptMetadata {
  category: AgentCategory
  cost: AgentCost
  triggers: DelegationTrigger[]
  useWhen?: string[]
  avoidWhen?: string[]
  dedicatedSection?: string
  promptAlias?: string
  keyTrigger?: string
}

export type BuiltinAgentName =
  | "sisyphus" | "oracle" | "librarian" | "explore"
  | "multimodal-looker" | "metis" | "momus" | "atlas"

export type AgentOverrideConfig = Partial<AgentConfig> & {
  prompt_append?: string
  variant?: string
}
```

### 3.2 Agent Factory Pattern

Every agent follows the factory pattern:

```typescript
// Example: Oracle Agent (src/agents/oracle.ts)
import type { AgentConfig } from "@opencode-ai/sdk"
import type { AgentPromptMetadata } from "./types"
import { isGptModel } from "./types"
import { createAgentToolRestrictions } from "../shared/permission-compat"

// 1. Export metadata for dynamic prompt building
export const ORACLE_PROMPT_METADATA: AgentPromptMetadata = {
  category: "advisor",
  cost: "EXPENSIVE",
  promptAlias: "Oracle",
  triggers: [
    { domain: "Architecture decisions", trigger: "Multi-system tradeoffs" },
    { domain: "Self-review", trigger: "After completing significant implementation" },
    { domain: "Hard debugging", trigger: "After 2+ failed fix attempts" },
  ],
  useWhen: [
    "Complex architecture design",
    "2+ failed fix attempts",
    "Security/performance concerns",
  ],
  avoidWhen: [
    "Simple file operations",
    "First attempt at any fix",
    "Trivial decisions",
  ],
}

// 2. System prompt as const string
const ORACLE_SYSTEM_PROMPT = `You are a strategic technical advisor...`

// 3. Factory function creating AgentConfig
export function createOracleAgent(model: string): AgentConfig {
  // Tool restrictions using shared utility
  const restrictions = createAgentToolRestrictions([
    "write", "edit", "task", "delegate_task",
  ])

  const base = {
    description: "Read-only consultation agent...",
    mode: "subagent" as const,
    model,
    temperature: 0.1,
    ...restrictions,
    prompt: ORACLE_SYSTEM_PROMPT,
  } as AgentConfig

  // Model-specific configuration
  if (isGptModel(model)) {
    return { ...base, reasoningEffort: "medium", textVerbosity: "high" }
  }

  return { ...base, thinking: { type: "enabled", budgetTokens: 32000 } }
}
```

### 3.3 Agent Registration

Agents are registered in `src/agents/utils.ts`:

```typescript
const agentSources: Record<BuiltinAgentName, AgentSource> = {
  sisyphus: createSisyphusAgent,
  oracle: createOracleAgent,
  librarian: createLibrarianAgent,
  explore: createExploreAgent,
  "multimodal-looker": createMultimodalLookerAgent,
  metis: createMetisAgent,
  momus: createMomusAgent,
  atlas: createAtlasAgent as unknown as AgentFactory,
}

const agentMetadata: Partial<Record<BuiltinAgentName, AgentPromptMetadata>> = {
  oracle: ORACLE_PROMPT_METADATA,
  librarian: LIBRARIAN_PROMPT_METADATA,
  explore: EXPLORE_PROMPT_METADATA,
  "multimodal-looker": MULTIMODAL_LOOKER_PROMPT_METADATA,
}
```

---

<!-- /ANCHOR:agent-definition-format -->


<!-- ANCHOR:prompt-template-patterns -->
## 4. PROMPT TEMPLATE PATTERNS

### 4.1 Sisyphus Primary Orchestrator Structure

The main orchestrator uses a sophisticated multi-section prompt:

```markdown
<Role>
You are "Sisyphus" - Powerful AI Agent with orchestration capabilities...

**Identity**: SF Bay Area engineer. Work, delegate, verify, ship. No AI slop.

**Core Competencies**:
- Parsing implicit requirements from explicit requests
- Adapting to codebase maturity (disciplined vs chaotic)
- Delegating specialized work to the right subagents
- Parallel execution for maximum throughput
</Role>

<Behavior_Instructions>
## Phase 0 - Intent Gate (EVERY message)
### Key Triggers (check BEFORE classification)
[Dynamic section built from agent metadata]

### Step 1: Classify Request Type
| Type | Signal | Action |
|------|--------|--------|
| Trivial | Single file, known location | Direct tools only |
| Explicit | Specific file/line | Execute directly |
| Exploratory | "How does X work?" | Fire explore (1-3) + tools |
| Open-ended | "Improve", "Refactor" | Assess codebase first |
| Ambiguous | Unclear scope | Ask ONE clarifying question |

## Phase 1 - Codebase Assessment
### State Classification
| State | Signals | Behavior |
|-------|---------|----------|
| Disciplined | Consistent patterns | Follow existing style |
| Transitional | Mixed patterns | Ask which to follow |
| Legacy/Chaotic | No consistency | Propose conventions |
| Greenfield | New/empty | Apply best practices |

## Phase 2A - Exploration & Research
[Tool selection table, explore section, librarian section]

## Phase 2B - Implementation
[Category + Skills delegation guide]

## Phase 2C - Failure Recovery
[3-strike rule, revert protocol]

## Phase 3 - Completion
[Verification checklist, background cleanup]
</Behavior_Instructions>

<Oracle_Usage>
[When to consult, when not to]
</Oracle_Usage>

<Task_Management>
[Todo creation rules, enforcement]
</Task_Management>

<Tone_and_Style>
[Concise, no flattery, no status updates]
</Tone_and_Style>

<Constraints>
[Hard blocks, anti-patterns]
</Constraints>
```

### 4.2 Specialized Agent Prompt Patterns

#### Explore Agent (Contextual Grep)
```markdown
You are a codebase search specialist. Your job: find files and code, return actionable results.

## CRITICAL: What You Must Deliver

### 1. Intent Analysis (Required)
<analysis>
**Literal Request**: [What they literally asked]
**Actual Need**: [What they're really trying to accomplish]
**Success Looks Like**: [Result that lets them proceed immediately]
</analysis>

### 2. Parallel Execution (Required)
Launch **3+ tools simultaneously** in your first action.

### 3. Structured Results (Required)
<results>
<files>
- /absolute/path/to/file1.ts — [why relevant]
</files>
<answer>
[Direct answer to their actual need]
</answer>
<next_steps>
[What they should do with this information]
</next_steps>
</results>

## Constraints
- **Read-only**: Cannot create, modify, or delete files
- **No emojis**: Keep output clean and parseable
```

#### Librarian Agent (External Research)
```markdown
# THE LIBRARIAN

## PHASE 0: REQUEST CLASSIFICATION (MANDATORY FIRST STEP)

| Type | Trigger Examples | Tools |
|------|------------------|-------|
| TYPE A: CONCEPTUAL | "How do I use X?" | Doc Discovery + context7 |
| TYPE B: IMPLEMENTATION | "How does X implement Y?" | gh clone + read + blame |
| TYPE C: CONTEXT | "Why was this changed?" | gh issues/prs + git log |
| TYPE D: COMPREHENSIVE | Complex requests | ALL tools |

## PHASE 0.5: DOCUMENTATION DISCOVERY
1. Find Official Documentation: websearch("library-name official docs")
2. Version Check: If version specified, find versioned docs
3. Sitemap Discovery: webfetch(docs_url + "/sitemap.xml")
4. Targeted Investigation: Fetch specific doc pages

## MANDATORY CITATION FORMAT
**Claim**: [Assertion]
**Evidence** ([source](permalink)):
```code
// The actual code
```

## PERMALINK CONSTRUCTION
https://github.com/<owner>/<repo>/blob/<commit-sha>/<filepath>#L<start>-L<end>
```

---

<!-- /ANCHOR:prompt-template-patterns -->


<!-- ANCHOR:agent-routingselection-mechanisms -->
## 5. AGENT ROUTING/SELECTION MECHANISMS

### 5.1 Category-Based Delegation

Categories provide domain-optimized model selection:

```typescript
// src/tools/delegate-task/constants.ts
export const DEFAULT_CATEGORIES: Record<string, CategoryConfig> = {
  "visual-engineering": { model: "google/gemini-3-pro" },
  "ultrabrain": { model: "openai/gpt-5.2-codex", variant: "xhigh" },
  "artistry": { model: "google/gemini-3-pro", variant: "max" },
  "quick": { model: "anthropic/claude-haiku-4-5" },
  "unspecified-low": { model: "anthropic/claude-sonnet-4-5" },
  "unspecified-high": { model: "anthropic/claude-opus-4-5", variant: "max" },
  "writing": { model: "google/gemini-3-flash" },
}

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "visual-engineering": "Frontend, UI/UX, design, styling, animation",
  "ultrabrain": "Deep logical reasoning, complex architecture decisions",
  "artistry": "Highly creative/artistic tasks, novel ideas",
  "quick": "Trivial tasks - single file changes, typo fixes",
  "unspecified-low": "Tasks that don't fit other categories, low effort",
  "unspecified-high": "Tasks that don't fit other categories, high effort",
  "writing": "Documentation, prose, technical writing",
}
```

### 5.2 Category Prompt Appends

Each category injects behavioral context:

```typescript
export const VISUAL_CATEGORY_PROMPT_APPEND = `<Category_Context>
You are working on VISUAL/UI tasks.

Design-first mindset:
- Bold aesthetic choices over safe defaults
- Unexpected layouts, asymmetry, grid-breaking elements
- Distinctive typography (avoid: Arial, Inter, Roboto)
- High-impact animations with staggered reveals
</Category_Context>`

export const QUICK_CATEGORY_PROMPT_APPEND = `<Category_Context>
You are working on SMALL / QUICK tasks.
</Category_Context>

<Caller_Warning>
THIS CATEGORY USES A LESS CAPABLE MODEL (claude-haiku-4-5).

Your prompt MUST be:
**EXHAUSTIVELY EXPLICIT** - Leave NOTHING to interpretation:
1. MUST DO: List every required action as atomic steps
2. MUST NOT DO: Explicitly forbid likely mistakes
3. EXPECTED OUTPUT: Describe exact success criteria
</Caller_Warning>`
```

### 5.3 Delegate Task Tool Interface

```typescript
// src/tools/delegate-task/tools.ts
export function createDelegateTask(options: DelegateTaskToolOptions): ToolDefinition {
  return tool({
    description: `Spawn agent task with category-based or direct agent selection.

MUTUALLY EXCLUSIVE: Provide EITHER category OR subagent_type, not both.

- load_skills: ALWAYS REQUIRED. Pass skill names (e.g., ["playwright"], ["git-master"])
- category: Use predefined category → Spawns Sisyphus-Junior
- subagent_type: Use specific agent directly (e.g., "oracle", "explore")
- run_in_background: true=async (returns task_id), false=sync (waits)
- session_id: Existing Task session to continue`,

    args: {
      load_skills: tool.schema.array(tool.schema.string()).describe("Skill names to inject"),
      description: tool.schema.string().describe("Short task description (3-5 words)"),
      prompt: tool.schema.string().describe("Full detailed prompt"),
      run_in_background: tool.schema.boolean().describe("true=async, false=sync"),
      category: tool.schema.string().optional(),
      subagent_type: tool.schema.string().optional(),
      session_id: tool.schema.string().optional(),
    },

    async execute(args, toolContext) { ... }
  })
}
```

### 5.4 Selection Logic Flow

```
User Request
    │
    ├─► Skill Match? → Invoke skill tool IMMEDIATELY
    │
    ├─► Trivial? → Direct tools only
    │
    ├─► Exploratory? → Fire explore (background, parallel)
    │
    ├─► External library? → Fire librarian (background)
    │
    ├─► Architecture/debugging? → Consult oracle
    │
    └─► Implementation? → delegate_task(category=..., load_skills=[...])
            │
            ├─► visual-engineering → gemini-3-pro + visual prompt
            ├─► ultrabrain → gpt-5.2-codex + strategic prompt
            ├─► quick → claude-haiku-4-5 + explicit prompt
            └─► ...
```

---

<!-- /ANCHOR:agent-routingselection-mechanisms -->


<!-- ANCHOR:skill-injection-mechanism -->
## 6. SKILL INJECTION MECHANISM

### 6.1 Skill Definition Structure

```typescript
// Skills are loaded and injected into agent prompts
export interface AvailableSkill {
  name: string
  description: string
  location: "user" | "project" | "plugin"
}
```

### 6.2 Built-in Skills

| Skill | Domain | Usage |
|-------|--------|-------|
| playwright | Browser automation | MUST USE for browser tasks |
| frontend-ui-ux | UI/UX design | Stunning UI without mockups |
| git-master | Git operations | commits, rebase, squash |
| agent-browser | Browser automation | Web testing |
| dev-browser | Persistent browser state | Automation |
| typescript-programmer | TypeScript code | Production code |
| python-programmer | Python code | Production code |
| svelte-programmer | Svelte components | Components |
| golang-tui-programmer | Go TUI | Charmbracelet |
| python-debugger | Python debugging | Interactive debug |
| data-scientist | Data processing | DuckDB/Polars |
| prompt-engineer | Prompt optimization | AI prompts |

### 6.3 Skill Resolution

```typescript
// From src/agents/utils.ts
if (agentWithCategory.skills?.length) {
  const { resolved } = resolveMultipleSkills(
    agentWithCategory.skills,
    { gitMasterConfig, browserProvider }
  )
  if (resolved.size > 0) {
    const skillContent = Array.from(resolved.values()).join("\n\n")
    base.prompt = skillContent + (base.prompt ? "\n\n" + base.prompt : "")
  }
}
```

---

<!-- /ANCHOR:skill-injection-mechanism -->


<!-- ANCHOR:dynamic-prompt-building -->
## 7. DYNAMIC PROMPT BUILDING

### 7.1 Prompt Builder Functions

The system generates prompts dynamically from agent metadata:

```typescript
// src/agents/dynamic-agent-prompt-builder.ts

export function buildKeyTriggersSection(
  agents: AvailableAgent[],
  skills: AvailableSkill[]
): string {
  const keyTriggers = agents
    .filter((a) => a.metadata.keyTrigger)
    .map((a) => `- ${a.metadata.keyTrigger}`)
  // Returns formatted trigger section
}

export function buildToolSelectionTable(
  agents: AvailableAgent[],
  tools: AvailableTool[],
  skills: AvailableSkill[]
): string {
  // Returns formatted tool/agent selection table
  // Sorted by cost: FREE → CHEAP → EXPENSIVE
}

export function buildCategorySkillsDelegationGuide(
  categories: AvailableCategory[],
  skills: AvailableSkill[]
): string {
  // Returns category + skill selection protocol
}

export function buildDelegationTable(
  agents: AvailableAgent[]
): string {
  // Returns domain → agent → trigger mapping
}
```

### 7.2 Sisyphus Prompt Generation

```typescript
// src/agents/sisyphus.ts
function buildDynamicSisyphusPrompt(
  availableAgents: AvailableAgent[],
  availableTools: AvailableTool[],
  availableSkills: AvailableSkill[],
  availableCategories: AvailableCategory[]
): string {
  const keyTriggers = buildKeyTriggersSection(availableAgents, availableSkills)
  const toolSelection = buildToolSelectionTable(availableAgents, availableTools, availableSkills)
  const exploreSection = buildExploreSection(availableAgents)
  const librarianSection = buildLibrarianSection(availableAgents)
  const categorySkillsGuide = buildCategorySkillsDelegationGuide(availableCategories, availableSkills)
  const delegationTable = buildDelegationTable(availableAgents)
  const oracleSection = buildOracleSection(availableAgents)
  const hardBlocks = buildHardBlocksSection()
  const antiPatterns = buildAntiPatternsSection()

  return `<Role>...</Role>
<Behavior_Instructions>
${keyTriggers}
${toolSelection}
${exploreSection}
${librarianSection}
${categorySkillsGuide}
${delegationTable}
...
</Behavior_Instructions>
${oracleSection}
<Constraints>
${hardBlocks}
${antiPatterns}
</Constraints>`
}
```

---

<!-- /ANCHOR:dynamic-prompt-building -->


<!-- ANCHOR:configuration-schema -->
## 8. CONFIGURATION SCHEMA

### 8.1 Agent Override Configuration

```typescript
// src/config/schema.ts
export const AgentOverrideConfigSchema = z.object({
  model: z.string().optional(),
  variant: z.string().optional(),
  category: z.string().optional(),
  skills: z.array(z.string()).optional(),
  temperature: z.number().min(0).max(2).optional(),
  top_p: z.number().min(0).max(1).optional(),
  prompt: z.string().optional(),
  prompt_append: z.string().optional(),
  tools: z.record(z.string(), z.boolean()).optional(),
  disable: z.boolean().optional(),
  description: z.string().optional(),
  mode: z.enum(["subagent", "primary", "all"]).optional(),
  maxTokens: z.number().optional(),
  thinking: z.object({
    type: z.enum(["enabled", "disabled"]),
    budgetTokens: z.number().optional(),
  }).optional(),
  reasoningEffort: z.enum(["low", "medium", "high", "xhigh"]).optional(),
})
```

### 8.2 Category Configuration

```typescript
export const CategoryConfigSchema = z.object({
  description: z.string().optional(),
  model: z.string().optional(),
  variant: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().optional(),
  thinking: z.object({
    type: z.enum(["enabled", "disabled"]),
    budgetTokens: z.number().optional(),
  }).optional(),
  reasoningEffort: z.enum(["low", "medium", "high", "xhigh"]).optional(),
  tools: z.record(z.string(), z.boolean()).optional(),
  prompt_append: z.string().optional(),
  is_unstable_agent: z.boolean().optional(),
})
```

---

<!-- /ANCHOR:configuration-schema -->


<!-- ANCHOR:key-patterns-to-adopt -->
## 9. KEY PATTERNS TO ADOPT

### 9.1 Agent Definition Pattern

```typescript
// 1. Export metadata for dynamic discovery
export const MY_AGENT_METADATA: AgentPromptMetadata = {
  category: "specialist",
  cost: "CHEAP",
  triggers: [{ domain: "...", trigger: "..." }],
  useWhen: ["..."],
  avoidWhen: ["..."],
}

// 2. Define system prompt as const
const MY_AGENT_SYSTEM_PROMPT = `...`

// 3. Factory function with model parameter
export function createMyAgent(model: string): AgentConfig {
  const restrictions = createAgentToolRestrictions([...])

  return {
    description: "...",
    mode: "subagent",
    model,
    temperature: 0.1,
    ...restrictions,
    prompt: MY_AGENT_SYSTEM_PROMPT,
  }
}
```

### 9.2 Tool Restriction Pattern

```typescript
// Read-only agent (no file modifications)
const restrictions = createAgentToolRestrictions([
  "write", "edit", "task", "delegate_task"
])

// No delegation chain
const restrictions = createAgentToolRestrictions([
  "write", "edit", "task", "delegate_task", "call_omo_agent"
])

// Allowlist pattern (strictest)
const allowlist = createAgentToolAllowlist(["read"])
```

### 9.3 Delegation Prompt Structure (MANDATORY 7 Sections)

```markdown
1. TASK: Atomic, specific goal (one action per delegation)
2. EXPECTED OUTCOME: Concrete deliverables with success criteria
3. REQUIRED SKILLS: Which skill to invoke
4. REQUIRED TOOLS: Explicit tool whitelist
5. MUST DO: Exhaustive requirements - leave NOTHING implicit
6. MUST NOT DO: Forbidden actions - anticipate rogue behavior
7. CONTEXT: File paths, existing patterns, constraints
```

### 9.4 Parallel Execution Pattern

```typescript
// CORRECT: Always background, always parallel for exploration
delegate_task(subagent_type="explore", run_in_background=true, load_skills=[],
              prompt="Find auth implementations...")
delegate_task(subagent_type="explore", run_in_background=true, load_skills=[],
              prompt="Find error handling patterns...")
delegate_task(subagent_type="librarian", run_in_background=true, load_skills=[],
              prompt="Find JWT best practices...")

// Continue working immediately. Collect with background_output when needed.
```

### 9.5 Session Continuation Pattern

```typescript
// Resume previous agent with full context preserved
delegate_task(
  resume="session_id",
  prompt="fix: [specific error]"  // or "also check [additional query]"
)
```

---

<!-- /ANCHOR:key-patterns-to-adopt -->


<!-- ANCHOR:anti-patterns-to-avoid -->
## 10. ANTI-PATTERNS TO AVOID

| Category | Forbidden | Why |
|----------|-----------|-----|
| Type Safety | `as any`, `@ts-ignore` | Breaks type guarantees |
| Error Handling | Empty catch blocks | Hides errors |
| Testing | Deleting failing tests | Masks problems |
| Search | Agents for single-line typos | Wasteful |
| Delegation | `load_skills=[]` without justification | Suboptimal output |
| Agent Calls | Sequential delegation | Use parallel background |
| Trust | Agent self-reports | ALWAYS verify outputs |
| Temperature | >0.3 for code agents | Unpredictable output |

---

<!-- /ANCHOR:anti-patterns-to-avoid -->


<!-- ANCHOR:recommendations -->
## 11. RECOMMENDATIONS

### For Adoption in anobel.com

1. **Implement Category-Based Delegation**
   - Define domain-specific categories (webflow, documentation, debugging)
   - Map categories to optimal models
   - Inject domain-specific prompts

2. **Adopt Skill Injection Pattern**
   - Create modular skill files
   - Resolve and inject skills at delegation time
   - Allow skill composition

3. **Dynamic Prompt Building**
   - Generate sections from metadata
   - Keep agent configurations data-driven
   - Enable runtime customization

4. **Enforce Tool Restrictions**
   - Read-only agents for exploration/consultation
   - Explicit tool allowlists/denylists
   - Prevent delegation chains where inappropriate

5. **Session Continuation**
   - Preserve context across multi-turn agent interactions
   - Resume failed tasks with full history
   - Save tokens through continuation

---

<!-- /ANCHOR:recommendations -->


<!-- ANCHOR:sources -->
## 12. SOURCES

| Source | Type | Evidence |
|--------|------|----------|
| `src/agents/types.ts` | Code | Type definitions |
| `src/agents/utils.ts` | Code | Agent factory utilities |
| `src/agents/oracle.ts` | Code | Agent implementation example |
| `src/agents/explore.ts` | Code | Explore agent pattern |
| `src/agents/librarian.ts` | Code | Librarian agent pattern |
| `src/agents/sisyphus.ts` | Code | Primary orchestrator |
| `src/agents/dynamic-agent-prompt-builder.ts` | Code | Prompt generation |
| `src/tools/delegate-task/constants.ts` | Code | Categories and prompts |
| `src/tools/delegate-task/tools.ts` | Code | Delegation implementation |
| `src/config/schema.ts` | Code | Configuration schema |
| `AGENTS.md` | Documentation | Root knowledge base |
| `src/agents/AGENTS.md` | Documentation | Agent-specific knowledge |
| `sisyphus-prompt.md` | Documentation | Generated prompt reference |

---

**Research Complete**: 2026-01-27
**Next Steps**: Use findings to inform agent system improvements in `/spec_kit:plan`

<!-- /ANCHOR:sources -->
