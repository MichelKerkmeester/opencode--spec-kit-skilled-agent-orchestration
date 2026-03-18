# Agent Template - Specialist Agent Structure

> Template for creating OpenCode agent files with proper frontmatter, permissions, and behavioral structure. Updated to reflect current agent patterns (v2.0).

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Agents are specialized AI personas with defined authorities, tool permissions, and behavioral rules. Unlike skills (which provide knowledge and workflows), agents have **authority** to act and **tools** to execute.

### Key Characteristics

| Aspect          | Agent                                   | Skill                        |
| --------------- | --------------------------------------- | ---------------------------- |
| **Purpose**     | Persona with authority to act           | Knowledge/workflow bundle    |
| **Location**    | `.opencode/agent/`                      | `.opencode/skill/`           |
| **Invocation**  | `@agent-name` or automatic routing      | `skill("name")` or automatic |
| **Has Tools**   | Yes (permission object)                 | No (uses agent's tools)      |
| **Frontmatter** | name, mode, temperature, permission     | name, allowed-tools          |

### When to Create an Agent

Create an agent when you need:
- **Specific tool permissions** - Fine-grained control over which tools are available
- **Behavioral constraints** - Rules that govern how the agent operates
- **Delegation capability** - Ability to spawn sub-agents (orchestrator pattern)
- **Specialized persona** - A distinct role with defined authority

**Do NOT create an agent when:**
- You only need knowledge/workflows → Create a skill instead
- You need templates/standards → Create a skill instead
- The task doesn't require tool restrictions → Use existing agents

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:frontmatter-reference -->
## 2. FRONTMATTER REFERENCE

### Required Fields (v1.1.1+ Format)

```yaml
---
name: agent-name                    # REQUIRED: Identifier (must match filename)
description: One-line description   # REQUIRED: Purpose statement
mode: subagent                      # REQUIRED: subagent | agent | all
temperature: 0.1                    # REQUIRED: 0.0-1.0 (lower = deterministic)
permission:                         # REQUIRED: Unified permission object (v1.1.1+)
  read: allow
  write: allow
  edit: allow
  bash: allow
  grep: allow
  glob: allow
  webfetch: deny
  memory: allow
  chrome_devtools: deny
  task: deny                        # deny for sub-agents, allow for orchestrators
  list: allow
  patch: deny
  external_directory: allow
---
```

> **Note:** The separate `tools:` object is deprecated as of OpenCode v1.1.1. Use the unified `permission:` object with `allow`/`deny`/`ask` values instead.

### Field Reference

| Field         | Type   | Required | Description                                         |
| ------------- | ------ | -------- | --------------------------------------------------- |
| `name`        | string | Yes      | Agent identifier (used in `@name` invocation)       |
| `description` | string | Yes      | One-line purpose description                        |
| `mode`        | string | Yes      | `subagent` (dispatched), `agent` (primary), `all`   |
| `temperature` | float  | Yes      | 0.0-1.0, lower = more deterministic                 |
| `permission`  | object | Yes      | Unified tool & action permissions (allow/deny/ask)  |

### Mode Reference

| Mode       | Use Case                                      | task Permission |
| ---------- | --------------------------------------------- | --------------- |
| `subagent` | Specialized agents dispatched by orchestrator | deny            |
| `agent`    | Primary agents that orchestrate others        | allow           |
| `all`      | Can operate in any mode                       | varies          |

### Permission Reference

| Permission          | Purpose                             | Typical Setting      |
| ------------------- | ----------------------------------- | -------------------- |
| `read`              | Read files                          | allow                |
| `write`             | Create files                        | allow                |
| `edit`              | Modify files                        | allow                |
| `bash`              | Execute commands                    | allow (caution)      |
| `grep`              | Search content                      | allow                |
| `glob`              | Find files                          | allow                |
| `webfetch`          | Fetch URLs                          | deny (unless needed) |
| `memory`            | Spec Kit Memory                     | allow                |
| `chrome_devtools`   | Browser debugging                   | deny (unless needed) |
| `task`              | Delegate to sub-agents              | deny (subagents)     |
| `list`              | List directory contents             | allow                |
| `patch`             | Apply patches                       | deny (unless needed) |
| `external_directory`| Access files outside project        | allow                |

### Permission Values

| Value   | Behavior                                    |
| ------- | ------------------------------------------- |
| `allow` | Automatically approve (no prompt)           |
| `deny`  | Automatically reject (blocked)              |
| `ask`   | Prompt the user for approval each time      |

---

<!-- /ANCHOR:frontmatter-reference -->
<!-- ANCHOR:required-sections -->
## 3. REQUIRED SECTIONS

Every agent file MUST include these sections in order:

### Section 1: Core Workflow

```markdown
## 1. CORE WORKFLOW

### [Workflow Name]

1. **STEP** → Description
2. **STEP** → Description
3. **STEP** → Description

**Key Principle**: [Summary of critical workflow behavior]
```

### Section 2: Capability Scan

```markdown
## 2. CAPABILITY SCAN

### Skills

| Skill | Domain | Use When | Key Features |
| ----- | ------ | -------- | ------------ |
| ...   | ...    | ...      | ...          |

### Tools

| Tool | Purpose | When to Use |
| ---- | ------- | ----------- |
| ...  | ...     | ...         |
```

### Section N-2: Output Verification (NEW - MANDATORY)

```markdown
## N. OUTPUT VERIFICATION

**CRITICAL**: Before claiming completion, you MUST verify output against actual evidence.

### Pre-Delivery Verification Checklist

\`\`\`
[DOMAIN]-SPECIFIC VERIFICATION (MANDATORY):
□ [Check 1 specific to agent domain]
□ [Check 2 specific to agent domain]
□ [Check 3 specific to agent domain]

EVIDENCE VALIDATION (MANDATORY):
□ All claims have citations (file:line OR URL OR explicit "CITATION: NONE")
□ Cited files exist (verify with Read or Glob)
□ No placeholder content ("[TODO]", "[TBD]")
\`\`\`

### Self-Validation Protocol

**Run BEFORE claiming completion:**

\`\`\`
SELF-CHECK (N questions):
1. Did I [verification step]? (YES/NO)
2. Did I [verification step]? (YES/NO)
3. Did I [verification step]? (YES/NO)

If ANY answer is NO → DO NOT CLAIM COMPLETION
Fix verification gaps first
\`\`\`

### The Iron Law

> **NEVER CLAIM COMPLETION WITHOUT VERIFICATION EVIDENCE**
```

### Section N-1: Anti-Patterns

```markdown
## N. ANTI-PATTERNS

❌ **Never [anti-pattern]**
- [Reason why this is problematic]

❌ **Never [anti-pattern]**
- [Reason why this is problematic]
```

### Section N: Related Resources

```markdown
## N. RELATED RESOURCES

### Commands

| Command | Purpose | Path |
| ------- | ------- | ---- |
| ...     | ...     | ...  |

### Skills

| Skill | Purpose |
| ----- | ------- |
| ...   | ...     |

### Agents

| Agent | Purpose |
| ----- | ------- |
| ...   | ...     |
```

### Final Section: Summary (RECOMMENDED)

```markdown
## N. SUMMARY

\`\`\`
┌─────────────────────────────────────────────────────────────────────────┐
│                    THE [ROLE]: [SUBTITLE]                               │
├─────────────────────────────────────────────────────────────────────────┤
│  AUTHORITY                                                              │
│  ├─► [Authority 1]                                                      │
│  ├─► [Authority 2]                                                      │
│  └─► [Authority 3]                                                      │
│                                                                         │
│  WORKFLOW                                                               │
│  ├─► 1. [Step]                                                          │
│  ├─► 2. [Step]                                                          │
│  └─► 3. [Step]                                                          │
│                                                                         │
│  LIMITS                                                                 │
│  ├─► [Limitation 1]                                                     │
│  └─► [Limitation 2]                                                     │
└─────────────────────────────────────────────────────────────────────────┘
\`\`\`
```

---

<!-- /ANCHOR:required-sections -->
<!-- ANCHOR:optional-sections -->
## 4. OPTIONAL SECTIONS

Include these sections based on agent type:

### For Orchestrator Agents (task: allow)

```markdown
## N. AGENT CAPABILITY MAP

[Description of available sub-agents and their roles]

## N. TASK DECOMPOSITION FORMAT

[Template for structuring delegated tasks]

## N. PARALLEL VS SEQUENTIAL

[Guidelines for parallel vs sequential execution]

## N. FAILURE HANDLING

[Retry → Reassign → Escalate protocol]
```

### For Specialist Agents

```markdown
## N. [DOMAIN] ROUTING

[Decision tree for handling different request types]

## N. OUTPUT FORMAT

[Standard output format for deliverables]

## N. RESPONSE FORMATS

### Success Response
[Template for successful completion]

### Blocked Response
[Template for when blocked]

### Escalation Response
[Template for escalation]
```

### For Sub-Agents (mode: subagent)

```markdown
## N. CONTEXT HANDOFF FORMAT

[Expected input format when dispatched]

## N. ESCALATION PROTOCOL

[When and how to escalate to orchestrator]
```

---

<!-- /ANCHOR:optional-sections -->
<!-- ANCHOR:intro-paragraph-patterns -->
## 5. INTRO PARAGRAPH PATTERNS

After the H1 title, include 1-2 sentence description followed by critical statements:

```markdown
# The [Role Name]: [Subtitle]

[1-2 sentence description of the agent's purpose and authority.]

**CRITICAL**: [Most important behavioral constraint - what defines this agent's core behavior]

**IMPORTANT**: [Secondary constraint or codebase-agnostic note]

---
```

**Examples from production agents:**

```markdown
# The Researcher: Technical Investigation Specialist

Technical investigation specialist for evidence gathering, pattern analysis, and research documentation.

**CRITICAL**: Focus on INVESTIGATION, not implementation. Output is research documentation (research.md), not code changes.

**IMPORTANT**: This agent is codebase-agnostic. Works with any project structure.
```

```markdown
# The Reviewer: Code Quality Guardian

Code review specialist with full authority over pattern validation, quality scoring, and standards enforcement.

**CRITICAL**: You have READ-ONLY file access. You CANNOT modify files - only analyze, score, and report.

**IMPORTANT**: This agent is codebase-agnostic. Quality standards are loaded dynamically.
```

---

<!-- /ANCHOR:intro-paragraph-patterns -->
<!-- ANCHOR:complete-template -->
## 6. COMPLETE TEMPLATE

Copy this template to create a new agent:

```markdown
---
name: [agent-name]
description: [One-line description of agent purpose and authority]
mode: subagent
temperature: 0.1
permission:
  read: allow
  write: allow
  edit: allow
  bash: allow
  grep: allow
  glob: allow
  webfetch: deny
  memory: allow
  chrome_devtools: deny
  task: deny
  list: allow
  patch: deny
  external_directory: allow
---

# The [Role Name]: [Subtitle]

[1-2 sentence description of the agent's purpose and authority.]

**CRITICAL**: [Most important behavioral constraint]

**IMPORTANT**: This agent is codebase-agnostic. [Adaptability statement]

---

## 1. CORE WORKFLOW

### [N]-Step [Domain] Process

1. **RECEIVE** → Parse request, identify intent
2. **ANALYZE** → Gather context, check constraints
3. **EXECUTE** → Perform task using permitted tools
4. **VALIDATE** → Verify output meets requirements
5. **DELIVER** → Present results in structured format

**Key Principle**: [Summary of critical workflow behavior]

---

## 2. CAPABILITY SCAN

### Skills

| Skill          | Domain   | Use When            | Key Features   |
| -------------- | -------- | ------------------- | -------------- |
| `[skill-name]` | [Domain] | [Trigger condition] | [Key features] |

### Tools

| Tool          | Purpose   | When to Use |
| ------------- | --------- | ----------- |
| `[tool-name]` | [Purpose] | [Condition] |

---

## 3. [DOMAIN] ROUTING

\`\`\`
[Request Type]
    │
    ├─► [Condition 1]
    │   └─► [Action/Mode]
    │
    ├─► [Condition 2]
    │   └─► [Action/Mode]
    │
    └─► [Default]
        └─► [Action/Mode]
\`\`\`

---

## 4. RULES

### ✅ ALWAYS

- [Rule 1]
- [Rule 2]
- [Rule 3]

### ❌ NEVER

- [Rule 1]
- [Rule 2]
- [Rule 3]

### ⚠️ ESCALATE IF

- [Condition 1]
- [Condition 2]

---

## 5. OUTPUT FORMAT

### [Output Type] Report

\`\`\`markdown
## [Output Title]: [Topic]

### Summary
[2-3 sentence overview]

### Key Findings
1. [Finding with evidence citation]
2. [Finding with evidence citation]

### [Domain-Specific Section]
[Content]

### Next Steps
→ [Recommended action]
\`\`\`

---

## 6. OUTPUT VERIFICATION

**CRITICAL**: Before claiming completion, you MUST verify output against actual evidence.

### Pre-Delivery Verification Checklist

\`\`\`
[DOMAIN] VERIFICATION (MANDATORY):
□ [Domain-specific check 1]
□ [Domain-specific check 2]
□ [Domain-specific check 3]

EVIDENCE VALIDATION (MANDATORY):
□ All claims have citations (file:line OR URL OR "CITATION: NONE")
□ Cited files verified to exist
□ No placeholder content ("[TODO]", "[TBD]")
□ Output follows structured format
\`\`\`

### Self-Validation Protocol

**Run BEFORE claiming completion:**

\`\`\`
SELF-CHECK:
1. Did I complete all workflow steps? (YES/NO)
2. Did I verify evidence for all claims? (YES/NO)
3. Does output follow required format? (YES/NO)
4. Are all placeholders replaced with content? (YES/NO)

If ANY answer is NO → DO NOT CLAIM COMPLETION
Fix verification gaps first
\`\`\`

### The Iron Law

> **NEVER CLAIM COMPLETION WITHOUT VERIFICATION EVIDENCE**

---

## 7. ANTI-PATTERNS

❌ **Never [anti-pattern 1]**
- [Reason why this is problematic]

❌ **Never [anti-pattern 2]**
- [Reason why this is problematic]

❌ **Never [anti-pattern 3]**
- [Reason why this is problematic]

---

## 8. RELATED RESOURCES

### Commands

| Command     | Purpose           | Path                         |
| ----------- | ----------------- | ---------------------------- |
| [/command]  | [Purpose]         | `.opencode/command/.../`     |

### Skills

| Skill          | Purpose                |
| -------------- | ---------------------- |
| [skill-name]   | [Purpose]              |

### Agents

| Agent       | Purpose                     |
| ----------- | --------------------------- |
| orchestrate | Delegates tasks             |
| [related]   | [Relationship description]  |

---

## 9. SUMMARY

\`\`\`
┌─────────────────────────────────────────────────────────────────────────┐
│                    THE [ROLE]: [SUBTITLE]                               │
├─────────────────────────────────────────────────────────────────────────┤
│  AUTHORITY                                                              │
│  ├─► [Authority 1]                                                      │
│  ├─► [Authority 2]                                                      │
│  └─► [Authority 3]                                                      │
│                                                                         │
│  WORKFLOW ([N] Steps)                                                   │
│  ├─► 1. [Step] → [Output]                                               │
│  ├─► 2. [Step] → [Output]                                               │
│  ├─► 3. [Step] → [Output]                                               │
│  └─► N. [Step] → [Output]                                               │
│                                                                         │
│  OUTPUT                                                                 │
│  ├─► [Primary deliverable]                                              │
│  └─► [Secondary deliverable]                                            │
│                                                                         │
│  LIMITS                                                                 │
│  ├─► [Limitation 1]                                                     │
│  └─► [Limitation 2]                                                     │
└─────────────────────────────────────────────────────────────────────────┘
\`\`\`
```

---

<!-- /ANCHOR:complete-template -->
<!-- ANCHOR:production-examples -->
## 7. PRODUCTION EXAMPLES

### Current Production Agents

| Agent           | File               | Type       | Key Patterns                                                                                |
| --------------- | ------------------ | ---------- | ------------------------------------------------------------------------------------------- |
| @context        | context.md         | Subagent   | Context retrieval, active dispatch (@explore + @deep-research), structured Context Package output |
| @debug          | debug.md           | Subagent   | 4-phase methodology, structured handoff                                                          |
| @general        | (built-in)         | Agent      | Implementation, complex tasks, full tool access                                                  |
| @handover       | handover.md        | Subagent   | Session continuation, context preservation                                                       |
| @deep-research  | deep-research.md   | Subagent   | Iterative research loop, externalized state, convergence detection                               |
| @review         | review.md          | Subagent   | Quality rubric, orchestrator integration                                                         |
| @speckit        | speckit.md         | Subagent   | Template-first, level-based documentation                                                        |
| @write          | write.md           | Subagent   | DQI scoring, template alignment                                                                  |
| orchestrate     | orchestrate.md     | Primary    | Task decomposition, circuit breaker                                                              |

### Key Patterns by Agent Type

**Research/Investigation Agents:**
- Evidence quality rubric (A/B/C/D/F grades)
- Tool selection decision tree
- Parallel investigation thresholds
- Memory integration for context preservation

**Review/Validation Agents:**
- Quality scoring rubric (100 points, 5 dimensions)
- Gate validation protocol (pass/fail threshold)
- Structured issue categorization (P0/P1/P2)
- Circuit breaker interaction

**Debug/Fix Agents:**
- Structured context handoff (no conversation history)
- Multi-phase methodology (Observe/Analyze/Hypothesize/Fix)
- Escalation protocol (3 failures → escalate)
- Response formats (Success/Blocked/Escalation)

### Examine Existing Agents

```bash
# View deep-research pattern (iterative evidence-based investigation)
head -100 .opencode/agent/deep-research.md

# View review pattern (quality scoring)
head -100 .opencode/agent/review.md

# View debug pattern (structured handoff)
head -100 .opencode/agent/debug.md
```

---

<!-- /ANCHOR:production-examples -->
<!-- ANCHOR:validation-checklist -->
## 8. VALIDATION CHECKLIST

Before deploying an agent, verify:

**Frontmatter:**
- [ ] `name` matches filename (without .md)
- [ ] `description` is one-line, specific
- [ ] `mode` is `subagent`, `agent`, or `all`
- [ ] `temperature` is 0.0-1.0 (typically 0.1 for determinism)
- [ ] `permission` object has all tool/action settings (v1.1.1+ format)
- [ ] `task: deny` for subagents, `task: allow` for orchestrators

**Structure:**
- [ ] H1 title follows "# The [Role]: [Subtitle]" pattern
- [ ] Intro has **CRITICAL** and **IMPORTANT** statements
- [ ] Section 1 is "CORE WORKFLOW"
- [ ] Has "CAPABILITY SCAN" section
- [ ] Has "OUTPUT VERIFICATION" section (mandatory)
- [ ] Has "ANTI-PATTERNS" section
- [ ] Has "SUMMARY" section (recommended)
- [ ] Last numbered section is "RELATED RESOURCES"
- [ ] All H2 sections have number and ALL CAPS name

**Content:**
- [ ] Core workflow has numbered steps with verbs
- [ ] Skills and tools tables are populated
- [ ] Output verification has domain-specific checks
- [ ] Anti-patterns explain WHY (not just WHAT)
- [ ] Summary ASCII box captures authority, workflow, limits
- [ ] Related resources link to actual files

---

<!-- /ANCHOR:validation-checklist -->
<!-- ANCHOR:related-resources -->
## 9. RELATED RESOURCES

### Templates

| Template               | Purpose            | Path                                       |
| ---------------------- | ------------------ | ------------------------------------------ |
| `skill_md_template.md` | SKILL.md structure | `sk-doc/assets/skill/` |
| `command_template.md`  | Command files      | `sk-doc/assets/agents/` |

### Agent Files

| Agent          | Location                              | Purpose                                   |
| -------------- | ------------------------------------- | ----------------------------------------- |
| context        | `.opencode/agent/context.md`          | Context retrieval & exploration dispatch  |
| debug          | `.opencode/agent/debug.md`            | Fresh perspective debugging               |
| general        | (built-in)                            | Implementation, complex tasks             |
| handover       | `.opencode/agent/handover.md`         | Session continuation & context preservation |
| orchestrate    | `.opencode/agent/orchestrate.md`      | Task decomposition & delegation           |
| deep-research  | `.opencode/agent/deep-research.md`    | Iterative technical investigation         |
| review         | `.opencode/agent/review.md`           | Code quality validation                   |
| speckit        | `.opencode/agent/speckit.md`          | Spec folder documentation                 |
| write          | `.opencode/agent/write.md`            | Documentation creation                    |

### Documentation

| Document           | Location    | Purpose            |
| ------------------ | ----------- | ------------------ |
| AGENTS.md          | `AGENTS.md` | AI behavior config |
| AGENTS.md          | `AGENTS.md` | Project guidelines |
<!-- /ANCHOR:related-resources -->
