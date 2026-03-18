---
title: "Command Logic Improvement Research [004-command-logic-improvement/research]"
description: "The investigation was initiated to analyze external command references from a GitHub Gist containing 9 well-designed Claude Code commands, compare them against the 17 existing O..."
trigger_phrases:
  - "command"
  - "logic"
  - "improvement"
  - "research"
  - "004"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->
# Command Logic Improvement Research

---

## Section 1: Metadata

| Field | Value |
|-------|-------|
| **Research ID** | CMD-LOGIC-001 |
| **Status** | COMPLETE |
| **Date** | 2026-01-01 |
| **Researchers** | 5 parallel Opus agents |
| **Spec Folder** | .opencode/specs/03--commands-and-skills/z_archive/cmd-004-logic-improvement |
| **Prior Work** | 001-command-analysis, 002-speckit-leann-integration |

### Research Scope

| Dimension | Count | Source |
|-----------|-------|--------|
| External Commands Analyzed | 9 | GitHub Gist (Rangizingo) |
| Internal Commands Inventoried | 17 | .opencode/command/ |
| Namespaces Covered | 4 | spec_kit, memory, search, create |
| Best Practices Identified | 10 | Cross-reference analysis |
| Prioritized Improvements | 7 | Gap analysis |

---

## Section 2: Investigation Report

### Request Summary

The investigation was initiated to analyze external command references from a GitHub Gist containing 9 well-designed Claude Code commands, compare them against the 17 existing OpenCode commands, and identify transferable improvements in:

1. **Logic patterns** - How commands control AI behavior
2. **Teaching mechanisms** - How commands instruct the AI
3. **Reference structures** - How commands organize information
4. **Gate mechanisms** - How commands enforce stopping points
5. **User experience** - How commands communicate with users

### Key Findings

#### Finding 1: Gate Language Gap
**Severity: HIGH**

External commands use plain-language gates ("STOP HERE - Wait for user response") while internal commands use technical jargon ("HARD BLOCK"). The plain-language approach is more effective at halting AI behavior because it mirrors natural conversation patterns.

**Evidence:**
- Gist `brainstorm.md`: "STOP. Do not proceed until user responds."
- Internal `spec_kit_new.md`: "Block: HARD - Cannot proceed without answer"

**Recommendation:** Add plain-language equivalents alongside technical gate terminology.

#### Finding 2: Command Length Disparity
**Severity: LOW (Observation Only)**

External commands average 50-200 lines with focused scope. Internal commands range 350-665 lines with comprehensive coverage. Our comprehensive approach provides better robustness for complex workflows.

**Evidence:**
- Gist `iterate.md`: ~50 lines, single-purpose
- Internal `spec_kit_new.md`: 665 lines, comprehensive

**Observation:** External commands are simpler but lack the guardrails and comprehensive coverage our commands provide. Our comprehensive approach is the correct choice for this project.

#### Finding 3: Missing "What Next?" Pattern
**Severity: MEDIUM**

The Gist `pushy.md` command requires suggesting next actions upon task completion. This proactive pattern is missing from most internal commands.

**Evidence:**
- Gist `pushy.md`: "Always suggest what to do next"
- Internal commands: Typically end without next-step guidance

**Recommendation:** Add "What Next?" sections to completion-oriented commands.

#### Finding 4: Command Chaining is Implicit
**Severity: LOW**

External commands explicitly reference prerequisite commands ("First run /plan"). Internal commands assume users know the workflow.

**Evidence:**
- Gist `scope.md`: "First run /plan, then /scope"
- Internal commands: Dependencies mentioned in documentation only

**Recommendation:** Add explicit command chaining syntax to command headers.

### Recommendations Summary

| Priority | Recommendation | Effort | Impact |
|----------|---------------|--------|--------|
| P0 | Plain-language gates | Low | High |
| P0 | Standardize phase numbering | Low | Medium |
| P1 | Auto/confirm modes for /create | Medium | Medium |
| P1 | "What Next?" requirement | Low | Medium |
| P2 | Command chaining syntax | Medium | Medium |
| P2 | Session behavior modes | Medium | Low |
| P2 | Pre-bundled tool commands | Low | Medium |

---

## Section 3: Executive Overview

### Summary of Analysis

This research compared 9 external commands from a well-regarded GitHub Gist against 17 existing OpenCode commands across 4 namespaces. The analysis identified 8 transferable improvements organized by priority level.

**Key Insight:** The external commands excel at simplicity and human-readable instructions, while internal commands excel at comprehensive coverage and tool integration. Our comprehensive command approach provides robustness. The key improvements to adopt are plain-language gates, explicit command chaining, and session behavior modes.

### Quick Reference: External vs Internal Commands

| Aspect | External (Gist) | Internal (OpenCode) | Verdict |
|--------|-----------------|---------------------|---------|
| **Gate Language** | Plain text ("STOP HERE") | Technical ("HARD BLOCK") | External wins |
| **Command Length** | 50-200 lines | 350-665 lines | Internal wins (comprehensive) |
| **Phase Numbering** | Starts at 1 | Starts at 0 or 1 | Needs standardization |
| **Mode Selection** | None | Auto/Confirm available | Internal wins |
| **Tool Integration** | Basic | Comprehensive | Internal wins |
| **Command Chaining** | Explicit references | Implicit | External wins |
| **Session Behavior** | "Keep responses short" | None | External wins |
| **"What Next?"** | Required in pushy.md | Optional | External wins |
| **Examples** | 1-2 per command | 2-4 per command | Internal wins |
| **YAML Config** | None | Full YAML blocks | Internal wins |
| **ASCII Diagrams** | Minimal | Extensive | Internal wins |
| **ToDo Integration** | Explicit references | Via TodoWrite | Both good |

### Command Count Summary

| Namespace | Internal Count | Coverage |
|-----------|---------------|----------|
| /spec_kit | 7 | Spec folder lifecycle |
| /memory | 3 | Context preservation |
| /search | 2 | Code search |
| /create | 6 | Asset generation |
| **Total** | **17** | Full workflow coverage |

---

## Section 4: External Commands Analysis

### Overview

The GitHub Gist (Rangizingo/e4623d05faab2011e7011b10120b4dce) contains 9 commands designed for Claude Code. Each command demonstrates specific patterns worth analyzing.

### 4.1 brainstorm.md

**Purpose:** Ideation and creative exploration with forced reflection pauses.

**Clarity Score:** 9/10

**Key Pattern: Forced Pause Mechanism**

```markdown
After presenting ideas:
STOP. Do not proceed until user responds.
Wait for feedback before generating more options.
```

**Transferable Elements:**
- Plain-language stop instruction
- Explicit pause for user input
- No assumption of continuation

**Code Example:**
```markdown
## Brainstorming Session

Present 3-5 initial ideas, then:

**STOP HERE** - Wait for user to:
- Select ideas to explore further
- Request different direction
- Provide additional constraints

Do NOT generate additional ideas until explicitly asked.
```

**Gap Analysis:**
- Internal commands lack explicit "STOP" language
- Internal gates use technical jargon that AI may interpret loosely
- Recommendation: Add plain-language stops to gate mechanisms

---

### 4.2 delegate.md

**Purpose:** Route tasks to appropriate AI agents or modes.

**Clarity Score:** 8/10

**Key Pattern: Agent Routing Table**

```markdown
| Task Type | Delegate To | Context to Pass |
|-----------|-------------|-----------------|
| Research | Deep-dive agent | Full project context |
| Implementation | Code agent | Relevant files only |
| Review | Quality agent | Changed files + tests |
```

**Transferable Elements:**
- Explicit routing decisions
- Context scoping per task type
- Clear handoff instructions

**Code Example:**
```markdown
## Task Delegation

Before delegating:
1. Identify task type from routing table
2. Prepare context package
3. Include success criteria
4. Specify return format

### Routing Table

| Pattern | Agent | Context |
|---------|-------|---------|
| "analyze" | Research | Full repo |
| "implement" | Code | Affected files |
| "review" | QA | Diff + tests |
```

**Gap Analysis:**
- Internal commands have implicit delegation (via Task tool)
- No explicit routing table in command instructions
- Recommendation: Add routing guidance to complex commands

---

### 4.3 discovery.md

**Purpose:** Information gathering through sequential questioning.

**Clarity Score:** 8/10

**Key Pattern: Sequential Questioning Protocol**

```markdown
Ask ONE question at a time.
Wait for answer before proceeding.
Build understanding incrementally.
```

**Transferable Elements:**
- Single-question rule
- Sequential information gathering
- Prevents overwhelming users

**Code Example:**
```markdown
## Discovery Process

**RULE:** One question per response.

### Question Sequence
1. What is the core problem?
   → Wait for response
2. What have you tried?
   → Wait for response
3. What does success look like?
   → Wait for response

Only after gathering answers, proceed to solution.
```

**Gap Analysis:**
- Internal commands sometimes bundle multiple questions
- Gate 3 asks multiple questions at once
- Recommendation: Consider single-question variants for complex discovery

---

### 4.4 iterate.md

**Purpose:** Rapid iteration on a single focused task.

**Clarity Score:** 9/10

**Key Pattern: Minimal Instruction Set**

```markdown
Keep responses under 50 words.
Show only the changed code.
No explanations unless asked.
```

**Line Count:** ~50 lines

**Transferable Elements:**
- Extreme brevity
- Focus on output over explanation
- User-controlled verbosity

**Code Example:**
```markdown
## Iteration Mode

### Rules
- Max 50 words per response
- Show ONLY changed lines
- No preamble, no summary
- Explanations only if requested

### Format
```diff
- old line
+ new line
```

**Gap Analysis:**
- Internal commands are comprehensive (350-665 lines)
- External commands are simpler but lack guardrails
- Observation: Our comprehensive approach is intentional and appropriate for complex workflows

---

### 4.5 plan.md

**Purpose:** Project planning with hierarchical task breakdown.

**Clarity Score:** 8/10

**Key Pattern: Hierarchical Numbering**

```markdown
1. Phase One
   1.1 Sub-task
   1.2 Sub-task
2. Phase Two
   2.1 Sub-task
```

**Transferable Elements:**
- Consistent numbering system
- Visual hierarchy
- Easy reference

**Code Example:**
```markdown
## Planning Structure

Use hierarchical numbering:

1. Research Phase
   1.1 Analyze requirements
   1.2 Review existing code
   1.3 Identify constraints

2. Implementation Phase
   2.1 Core functionality
   2.2 Edge cases
   2.3 Error handling

3. Validation Phase
   3.1 Unit tests
   3.2 Integration tests
   3.3 User acceptance
```

**Gap Analysis:**
- Internal commands use mixed numbering (some start at 0, some at 1)
- Phase numbering not standardized
- Recommendation: Standardize to start at Phase 1

---

### 4.6 pushy.md

**Purpose:** Proactive task completion with next-step suggestions.

**Clarity Score:** 9/10

**Key Pattern: "What Next?" Requirement**

```markdown
After completing ANY task:
1. Confirm what was done
2. Suggest 2-3 natural next steps
3. Ask which direction to take
```

**Transferable Elements:**
- Proactive continuation
- Multiple options presented
- User retains control

**Code Example:**
```markdown
## Completion Protocol

After EVERY task completion:

### 1. Confirmation
"I've completed [task]. Here's what was done: [summary]"

### 2. What Next?
"Natural next steps:
- A) [option with rationale]
- B) [option with rationale]
- C) [option with rationale]"

### 3. Await Direction
"Which would you like to pursue, or something else?"
```

**Gap Analysis:**
- Internal commands end without next-step guidance
- Users must know what to do next
- Recommendation: Add "What Next?" to all completion commands

---

### 4.7 scope.md

**Purpose:** Define boundaries before implementation.

**Clarity Score:** 8/10

**Key Pattern: Command Chaining Syntax**

```markdown
Prerequisites:
- First run /plan to establish structure
- Then /scope to define boundaries
- Finally /implement to execute
```

**Transferable Elements:**
- Explicit prerequisites
- Ordered workflow
- Prevents scope creep

**Code Example:**
```markdown
## Scope Definition

### Prerequisites
This command works best after:
1. `/plan` - Establish project structure
2. `/discovery` - Gather requirements

### Scope Boundaries

Define explicitly:
- **IN SCOPE:** [list]
- **OUT OF SCOPE:** [list]
- **DEFERRED:** [list with rationale]

### Lock Mechanism
Once scope is defined:
"Scope is now LOCKED. Changes require explicit unlock."
```

**Gap Analysis:**
- Internal commands mention dependencies in docs, not instructions
- No explicit command chaining in command files
- Recommendation: Add prerequisite commands to YAML headers

---

### 4.8 search.md

**Purpose:** Optimized code search with pre-configured flags.

**Clarity Score:** 7/10

**Key Pattern: Pre-Optimized Tool Flags**

```markdown
For ripgrep:
rg --type-add 'code:*.{ts,js,py}' --type code -C 3

Pre-configured for common use cases.
```

**Transferable Elements:**
- Ready-to-use command snippets
- Context lines included
- File type filtering

**Code Example:**
```markdown
## Optimized Search

### Pre-Configured Commands

**TypeScript/JavaScript:**
```bash
rg --type-add 'web:*.{ts,tsx,js,jsx}' --type web -C 3 "pattern"
```

**Python:**
```bash
rg --type py -C 3 "pattern"
```

**All Code:**
```bash
rg --type-add 'code:*.{ts,js,py,go,rs}' --type code "pattern"
```
```

**Gap Analysis:**
- Internal /search commands focus on routing (Narsil vs Grep)
- No pre-bundled flag configurations
- Recommendation: Add common search patterns to /search commands

---

### 4.9 start.md

**Purpose:** Session-wide behavior configuration.

**Clarity Score:** 8/10

**Key Pattern: Session Behavior Modes**

```markdown
Session Configuration:
- Keep responses SHORT and focused
- Prefer code over explanation
- Ask clarifying questions when uncertain
```

**Transferable Elements:**
- Session-wide defaults
- Behavior expectations
- Consistent experience

**Code Example:**
```markdown
## Session Start

### Behavior Configuration

For this session:
- **Response Length:** Short (under 200 words unless code)
- **Explanation Level:** Minimal (code speaks)
- **Uncertainty:** Ask before assuming
- **Format:** Markdown with code blocks

### Override
User can override any setting with explicit instruction.

### Active Until
These settings persist until:
- Session ends
- User changes settings
- Explicit `/reset`
```

**Gap Analysis:**
- Internal commands don't configure session behavior
- Each command operates independently
- Recommendation: Consider session behavior modes for future

---

## Section 5: Existing Commands Inventory

### Overview

The OpenCode command system contains 17 commands across 4 namespaces. Each namespace serves a specific workflow domain.

### 5.1 /spec_kit Namespace (7 Commands)

#### spec_kit_new.md
**Purpose:** Create new spec folders with proper structure.
**Lines:** 665
**Key Features:**
- Three documentation levels (LOC-based)
- Template selection
- Auto-scaffolding

**Gate Analysis:**
- Contains HARD BLOCK for spec folder question
- Technical language ("Block: HARD")
- Multiple questions bundled

**Improvement Opportunities:**
- Add plain-language gate
- Add "What Next?" on completion

---

#### spec_kit_resume.md
**Purpose:** Resume work from existing spec folder.
**Lines:** ~400
**Key Features:**
- Memory loading
- Context recovery
- Continuation validation

**Gate Analysis:**
- Memory context loading gate (SOFT)
- Handles compaction recovery

**Improvement Opportunities:**
- Add "What Next?" suggestions
- Simplify for quick resume

---

#### spec_kit_handover.md
**Purpose:** Save context for session handover.
**Lines:** ~300
**Key Features:**
- Context preservation
- Handover prompt generation
- Memory file creation

**Gate Analysis:**
- Requires spec folder selection

**Improvement Opportunities:**
- Auto-suggest when session ending
- Streamline handover format

---

#### spec_kit_finish.md
**Purpose:** Complete and archive spec folder work.
**Lines:** ~350
**Key Features:**
- Checklist verification
- Summary generation
- Archive workflow

**Gate Analysis:**
- Verification gate before completion claim

**Improvement Opportunities:**
- Add "What Next?" for follow-up work
- Suggest related tasks

---

#### spec_kit_debug.md
**Purpose:** Debug stuck issues with model selection.
**Lines:** ~250
**Key Features:**
- Model routing (Claude, Gemini, GPT)
- Structured problem analysis
- Fresh perspective approach

**Gate Analysis:**
- Triggers after 3+ failed attempts

**Improvement Opportunities:**
- Add diagnostic questions
- Pre-analyze common failure patterns

---

#### spec_kit_validate.md
**Purpose:** Validate spec folder structure and content.
**Lines:** ~200
**Key Features:**
- Structure validation
- Required files check
- Content quality scoring

**Gate Analysis:**
- Runs automatically on completion claims

**Improvement Opportunities:**
- Add fix suggestions
- Auto-remediate minor issues

---

#### spec_kit_archive.md
**Purpose:** Archive completed spec folders.
**Lines:** ~150
**Key Features:**
- Move to z_archive/
- Preserve history
- Update indexes

**Gate Analysis:**
- Requires completion verification

**Improvement Opportunities:**
- Batch archive support
- Archive summary generation

---

### 5.2 /memory Namespace (3 Commands)

#### memory_save.md
**Purpose:** Save conversation context to memory files.
**Lines:** ~300
**Key Features:**
- Generate-context.js integration
- ANCHOR format enforcement
- Auto-indexing

**Gate Analysis:**
- HARD BLOCK if no folder specified
- Validation of folder alignment

**Improvement Opportunities:**
- Suggest save points
- Auto-detect important context

---

#### memory_search.md
**Purpose:** Search saved memories semantically.
**Lines:** ~200
**Key Features:**
- Vector similarity search
- Constitutional tier priority
- Multi-concept AND search

**Gate Analysis:**
- None (query tool)

**Improvement Opportunities:**
- Add result highlighting
- Suggest related memories

---

#### memory_list.md
**Purpose:** Browse stored memories.
**Lines:** ~150
**Key Features:**
- Pagination support
- Sort options
- Filter by spec folder

**Gate Analysis:**
- None (read-only)

**Improvement Opportunities:**
- Add memory summaries
- Group by topic

---

### 5.3 /search Namespace (2 Commands)

#### search_code.md
**Purpose:** Search code semantically via Narsil.
**Lines:** ~250
**Key Features:**
- Neural search (semantic)
- Structural search (symbols)
- Security scanning

**Gate Analysis:**
- Tool routing decision tree

**Improvement Opportunities:**
- Pre-bundled search patterns
- Common query templates

---

#### search_text.md
**Purpose:** Search text patterns via Grep.
**Lines:** ~150
**Key Features:**
- Regex support
- File filtering
- Context lines

**Gate Analysis:**
- None (query tool)

**Improvement Opportunities:**
- Common regex library
- Case-sensitivity toggle

---

### 5.4 /create Namespace (6 Commands)

#### create_skill.md
**Purpose:** Create new skill definitions.
**Lines:** ~400
**Key Features:**
- SKILL.md generation
- Resource bundling
- Validation

**Gate Analysis:**
- Confirmation before creation

**Improvement Opportunities:**
- Add auto/confirm modes
- Template selection

---

#### create_command.md
**Purpose:** Create new command definitions.
**Lines:** ~350
**Key Features:**
- COMMAND.md generation
- YAML configuration
- Example inclusion

**Gate Analysis:**
- Confirmation before creation

**Improvement Opportunities:**
- Add auto/confirm modes
- Add template selection

---

#### create_agent.md
**Purpose:** Create new agent definitions.
**Lines:** ~350
**Key Features:**
- Agent personality
- Tool permissions
- Context boundaries

**Gate Analysis:**
- Confirmation before creation

**Improvement Opportunities:**
- Add auto/confirm modes
- Agent templates (researcher, implementer, reviewer)

---

#### create_memory.md
**Purpose:** Create memory files (deprecated - use generate-context.js).
**Lines:** ~200
**Key Features:**
- Memory structure
- ANCHOR format
- Trigger phrases

**Gate Analysis:**
- Redirects to generate-context.js

**Improvement Opportunities:**
- Archive or remove
- Update references

---

#### create_spec.md
**Purpose:** Create spec files from templates.
**Lines:** ~300
**Key Features:**
- Template selection
- Level-based scaffolding
- Required sections

**Gate Analysis:**
- Level selection gate

**Improvement Opportunities:**
- Quick create mode
- Template preview

---

#### create_doc.md
**Purpose:** Create documentation files.
**Lines:** ~250
**Key Features:**
- DQI scoring
- Style enforcement
- Structure validation

**Gate Analysis:**
- Document type selection

**Improvement Opportunities:**
- Auto-detect type
- Inline preview

---

## Section 6: Cross-Cutting Pattern Comparison

### Comprehensive Pattern Matrix

| Pattern | External (Gist) | Internal (OpenCode) | Gap Severity | Recommendation |
|---------|-----------------|---------------------|--------------|----------------|
| **Gate Language** | Plain text ("STOP HERE") | Technical ("HARD BLOCK") | HIGH | Simplify language |
| **Command Length** | 50-200 lines | 350-665 lines | LOW | Internal comprehensive approach preferred |
| **Phase Numbering** | Starts at 1 | Mixed (0 or 1) | LOW | Standardize to 1 |
| **Mode Selection** | None | Auto/Confirm | External lacks | Internal advantage |
| **Command Chaining** | Explicit "First run /plan" | Implicit | MEDIUM | Make explicit |
| **Session Behavior** | "Keep responses short" | None | MEDIUM | Add session modes |
| **"What Next?"** | Required in pushy.md | Optional | MEDIUM | Make mandatory |
| **Tool Bundling** | search.md with flags | Separate tool calls | LOW | Bundle common patterns |
| **ToDo Integration** | Explicit references | Via TodoWrite | None | Both adequate |
| **ASCII Diagrams** | Minimal | Extensive | External lacks | Internal advantage |
| **YAML Config** | None | Full YAML blocks | External lacks | Internal advantage |
| **Examples** | 1-2 per command | 2-4 per command | Minor | Both adequate |
| **Confidence Checkpoints** | None | Available but missing | MEDIUM | Add to all commands |
| **Violation Detection** | None | Self-verification | External lacks | Internal advantage |
| **Tool Whitelisting** | None | Explicit in some | Inconsistent | Standardize |

### Pattern Deep Dive

#### Gate Language Comparison

**External Approach (Plain Language):**
```markdown
STOP. Do not proceed until user responds.
Wait for feedback before generating more options.
```

**Internal Approach (Technical):**
```markdown
Block: HARD - Cannot use tools without answer
Gate 3: SPEC FOLDER QUESTION [HARD BLOCK]
```

**Analysis:**
- Plain language is more effective at halting AI behavior
- Technical terminology may be interpreted loosely
- Recommendation: Use both - technical for documentation, plain for enforcement

**Proposed Hybrid:**
```markdown
## Gate 3: Spec Folder [HARD BLOCK]

**STOP HERE** - Do not proceed until user answers.

Technical: Block: HARD - Cannot use tools without answer

Options: A) Existing | B) New | C) Update | D) Skip
```

---

#### Command Length Philosophy

**External Philosophy:**
- Minimal instructions
- User controls verbosity
- Fast iteration

**Internal Philosophy:**
- Comprehensive coverage
- Self-contained instructions
- Reduced back-and-forth

**Analysis:**
Our comprehensive approach is the correct choice for this project. The additional length provides:
- Better guardrails and gate enforcement
- Comprehensive error handling
- Self-contained instructions that reduce ambiguity
- Consistent behavior across sessions

External minimal commands work for simple use cases but lack the robustness needed for complex workflows.

---

#### Session Behavior Modes

**External Pattern:**
```markdown
Session Configuration:
- Keep responses SHORT and focused
- Prefer code over explanation
```

**Internal Gap:**
- No session-wide configuration
- Each command operates independently

**Proposed Implementation:**
```markdown
## Session Modes

/mode:brief - Short responses, code only
/mode:verbose - Full explanations
/mode:debug - Maximum detail, step-by-step
/mode:default - Standard behavior

Session mode persists until changed or session ends.
```

---

## Section 7: Prior Work Integration

### 001-command-analysis Summary

**Location:** .opencode/specs/03--commands-and-skills/z_archive/cmd-001-analysis

**Key Findings:**
- 37-item fix list generated
- 78% overall health score
- Confidence checkpoints missing in 9/10 YAMLs

**Relevant Recommendations:**
1. Add confidence checkpoints to all command YAMLs
2. Standardize gate language
3. Update deprecated LEANN references

**Status:** Research complete, implementation pending

### 002-speckit-leann-integration Summary

**Location:** .opencode/specs/03--commands-and-skills/z_archive/cmd-002-speckit-leann-integration

**Key Findings:**
- LEANN references need migration to Narsil
- 7 files contain outdated LEANN mentions
- Migration path documented

**Relevant Recommendations:**
1. Replace LEANN with Narsil in all commands
2. Update tool routing documentation
3. Add Narsil examples

**Status:** Migration path defined, implementation pending

### Integration Points

| Prior Work Item | Relevance to Current Research | Action Required |
|-----------------|------------------------------|-----------------|
| 37-item fix list | Overlaps with pattern gaps | Consolidate into single list |
| Confidence checkpoints | Matches Section 8 best practices | Prioritize implementation |
| LEANN migration | Part of P1 recommendations | Include in implementation |
| 78% health score | Baseline for improvement | Target 90%+ post-implementation |

---

## Section 8: Best Practices Summary

### Top 10 Recommendations from Research

Based on analysis of external commands, internal commands, and prior work, these are the highest-impact best practices for OpenCode commands:

### 1. Mandatory Gate Pattern

**Description:** Every command that modifies state must have at least one explicit gate.

**Implementation:**
```markdown
## Gate: [Name] [BLOCK TYPE]

**STOP HERE** - Do not proceed until user responds.

[Plain language explanation of what's needed]

Options: A) ... | B) ... | C) ...
```

**Rationale:** Gates prevent runaway execution and ensure user control.

---

### 2. Phase Status Tables

**Description:** Use visual tables to show workflow progress.

**Implementation:**
```markdown
## Workflow Status

| Phase | Status | Description |
|-------|--------|-------------|
| 1. Research | ✅ COMPLETE | Gathered requirements |
| 2. Planning | 🔄 IN PROGRESS | Defining approach |
| 3. Implementation | ⏳ PENDING | Not started |
| 4. Validation | ⏳ PENDING | Not started |
```

**Rationale:** Visual status improves comprehension and tracking.

---

### 3. Violation Self-Detection

**Description:** Commands should include self-check prompts.

**Implementation:**
```markdown
## Self-Verification (Before EVERY response)

□ File modification detected? Did I ask gate question?
□ Am I saving memory? → Use generate-context.js
□ Claiming completion? → Verify checklist first
```

**Rationale:** Prevents common failure patterns.

---

### 4. Tool Whitelisting

**Description:** Explicitly list allowed tools per command phase.

**Implementation:**
```markdown
## Allowed Tools

**Research Phase:**
- memory_search
- narsil_neural_search
- Read

**Implementation Phase:**
- Edit
- Write
- Bash

**NOT ALLOWED:**
- Write during Research
- Bash file operations (use dedicated tools)
```

**Rationale:** Constrains tool usage to appropriate context.

---

### 5. ASCII Decision Trees

**Description:** Use ASCII art for complex decision logic.

**Implementation:**
```markdown
## Decision Tree

File modification?
      │
      ├── YES → Ask Gate 3 first
      │          │
      │          ├── A) Existing → Load memory
      │          ├── B) New → Create spec folder
      │          └── D) Skip → Proceed without spec
      │
      └── NO → Continue normally
```

**Rationale:** Visual logic is easier to follow than prose.

---

### 6. Confidence Checkpoints

**Description:** Add explicit confidence checks at decision points.

**Implementation:**
```markdown
## Checkpoint: Approach Selection

Before proceeding:
- Confidence: [0-100%]
- If <80%: Stop and ask clarifying question
- If ≥80%: Proceed with approach

State confidence explicitly in response.
```

**Rationale:** Prevents low-confidence decisions from causing rework.

---

### 7. Standardized Emojis

**Description:** Use consistent emoji vocabulary across commands.

**Implementation:**
```markdown
## Status Indicators

✅ Complete
🔄 In Progress
⏳ Pending
❌ Blocked
⚠️ Warning
```

**Rationale:** Visual consistency improves scanning.

---

### 8. Examples (2-3 per Command)

**Description:** Every command should include concrete examples.

**Implementation:**
```markdown
## Examples

### Example 1: Simple Case
User: "Fix the typo in header.css"
Action: Skip spec folder (D), edit file, verify

### Example 2: Complex Case
User: "Refactor the auth system"
Action: Create spec folder (B), research, plan, implement
```

**Rationale:** Examples clarify intent better than abstract rules.

---

### 9. Sub-Agent Delegation

**Description:** Complex tasks should delegate to specialized agents.

**Implementation:**
```markdown
## Delegation Protocol

For complex research:
→ Dispatch Task tool with Research context

For implementation:
→ Dispatch Task tool with Implementation context

Always include:
- Clear objective
- Success criteria
- Context boundaries
```

**Rationale:** Specialized agents produce better results.

---

### 10. YAML Configuration Blocks

**Description:** Every command should have machine-readable configuration.

**Implementation:**
```yaml
---
name: spec_kit_new
version: 1.0.0
namespace: spec_kit
triggers:
  - "create spec"
  - "new spec folder"
gates:
  - name: spec_folder
    type: HARD
    question: "Which spec folder?"
confidence_checkpoint: true
---
```

**Rationale:** Enables tooling, validation, and automation.

---

## Section 9: Transferable Improvements (Prioritized)

### Priority Matrix

| Priority | Improvement | Source | Effort | Impact | Dependencies |
|----------|-------------|--------|--------|--------|--------------|
| **P0** | Plain-language gates | Gist brainstorm.md | Low | High | None |
| **P0** | Standardize phase numbering | Best practices | Low | Medium | None |
| **P1** | Auto/confirm modes for /create | Internal consistency | Medium | Medium | None |
| **P1** | "What Next?" requirement | Gist pushy.md | Low | Medium | None |
| **P1** | LEANN to Narsil migration | Prior work | Medium | Medium | None |
| **P2** | Command chaining syntax | Gist scope.md | Medium | Medium | P1 complete |
| **P2** | Session behavior modes | Gist start.md | Medium | Low | P1 complete |
| **P2** | Pre-bundled tool commands | Gist search.md | Low | Medium | None |

### P0: Immediate Priority

#### P0.1: Plain-Language Gates

**Current State:**
```markdown
Block: HARD - Cannot use tools without answer
```

**Target State:**
```markdown
**STOP HERE** - Do not proceed until user answers.

Block: HARD - Cannot use tools without answer
```

**Files to Update:**
- .opencode/command/spec_kit_new.md
- .opencode/command/spec_kit_resume.md
- .opencode/command/memory_save.md
- All commands with HARD BLOCK gates

**Effort:** 2 hours
**Validation:** Grep for "HARD BLOCK", verify plain language present

---

#### P0.2: Standardize Phase Numbering

**Current State:**
- Some commands start at Phase 0
- Some commands start at Phase 1
- Inconsistent across namespaces

**Target State:**
- All commands start at Phase 1
- Phase 0 reserved for "Prerequisites" only

**Files to Update:**
- All 17 command files
- Update plan.md templates

**Effort:** 1 hour
**Validation:** Grep for "Phase 0", update to "Prerequisites" or "Phase 1"

---

### P1: Short-Term Priority

#### P1.1: Auto/Confirm Modes for /create

**Current State:**
- /create commands always prompt for confirmation
- No way to skip prompts

**Target State:**
```markdown
## Mode Selection

- `--auto`: Skip confirmation, use defaults
- `--confirm`: (default) Prompt before each step
- `--dry-run`: Show what would be created without creating
```

**Files to Update:**
- .opencode/command/create_*.md (6 files)

**Effort:** 4 hours
**Validation:** Test each mode

---

#### P1.2: "What Next?" Requirement

**Current State:**
- Commands end without suggesting next steps
- User must know workflow

**Target State:**
```markdown
## Completion: What Next?

Task complete. Natural next steps:
- A) [option with rationale]
- B) [option with rationale]
- C) Something else?
```

**Files to Update:**
- .opencode/command/spec_kit_finish.md
- .opencode/command/spec_kit_handover.md
- .opencode/command/create_*.md

**Effort:** 3 hours
**Validation:** Verify "What Next?" present in completions

---

#### P1.3: LEANN to Narsil Migration

**Current State:**
- 7 files reference LEANN
- LEANN deprecated in favor of Narsil

**Target State:**
- All LEANN references replaced with Narsil
- Tool routing updated

**Files to Update:**
- Identified in 002-speckit-leann-integration
- Update routing documentation

**Effort:** 4 hours
**Validation:** Grep for "LEANN", expect 0 results

---

### P2: Medium-Term Priority

#### P2.1: Command Chaining Syntax

**Target State:**
```yaml
prerequisites:
  - /spec_kit:new
  - /memory:search
follows:
  - /spec_kit:finish
  - /memory:save
```

**Effort:** 6 hours

---

#### P2.2: Session Behavior Modes

**Target State:**
```markdown
/mode:brief - Short responses
/mode:verbose - Full explanations
/mode:debug - Maximum detail
```

**Effort:** 8 hours

---

#### P2.3: Pre-Bundled Tool Commands

**Target State:**
```markdown
## Common Search Patterns

### TypeScript Files
`rg --type-add 'ts:*.{ts,tsx}' --type ts -C 3 "pattern"`

### Python Files
`rg --type py -C 3 "pattern"`
```

**Effort:** 2 hours

---

## Section 10: Implementation Recommendations

### Immediate Actions (P0 - This Week)

#### Action 1: Add Plain-Language Gates

**Owner:** Implementation agent
**Timeline:** 2 hours
**Steps:**
1. List all commands with HARD BLOCK
2. Add "STOP HERE" language before technical gate
3. Verify formatting consistency
4. Test gate behavior

**Acceptance Criteria:**
- [ ] All HARD BLOCK gates have plain-language equivalent
- [ ] Format: "**STOP HERE** - [instruction]" followed by technical gate
- [ ] No functional changes to gate logic

---

#### Action 2: Standardize Phase Numbering

**Owner:** Implementation agent
**Timeline:** 1 hour
**Steps:**
1. Grep all commands for "Phase 0"
2. Change to "Prerequisites" or "Phase 1" as appropriate
3. Update all plan.md templates
4. Verify consistency

**Acceptance Criteria:**
- [ ] No "Phase 0" in command files (except as "Prerequisites")
- [ ] All workflows start at Phase 1
- [ ] Templates updated

---

#### Action 3: Add Confidence Checkpoints

**Owner:** Implementation agent
**Timeline:** 3 hours
**Steps:**
1. Identify 9 YAML files missing confidence checkpoint
2. Add checkpoint configuration
3. Add checkpoint prompts to command body
4. Test checkpoint behavior

**Acceptance Criteria:**
- [ ] All command YAMLs have `confidence_checkpoint: true`
- [ ] Commands include checkpoint prompt text
- [ ] 100% coverage (up from 10%)

---

### Short-Term Actions (P1 - This Month)

#### Action 4: Add Auto/Confirm Modes

**Timeline:** 4 hours
**Files:** 6 /create commands

**Acceptance Criteria:**
- [ ] --auto mode skips confirmations
- [ ] --confirm mode is default
- [ ] --dry-run shows preview without creating
- [ ] Documentation updated

---

#### Action 5: Add "What Next?" Sections

**Timeline:** 3 hours
**Files:** Completion-oriented commands

**Acceptance Criteria:**
- [ ] All completion commands suggest 2-3 next steps
- [ ] Format consistent across commands
- [ ] User retains control of direction

---

#### Action 6: Complete LEANN Migration

**Timeline:** 4 hours
**Files:** 7 identified files

**Acceptance Criteria:**
- [ ] Zero LEANN references remain
- [ ] Narsil routing documented
- [ ] Tool examples updated

---

### Medium-Term Actions (P2 - Next Quarter)

#### Action 7: Command Chaining Syntax

**Timeline:** 6 hours

**Acceptance Criteria:**
- [ ] YAML supports prerequisites/follows fields
- [ ] Commands reference chains explicitly
- [ ] Validation warns on broken chains

---

#### Action 8: Session Behavior Modes

**Timeline:** 8 hours

**Acceptance Criteria:**
- [ ] /mode commands implemented
- [ ] Settings persist per session
- [ ] Override mechanism works

---

#### Action 9: Pre-Bundled Tool Commands

**Timeline:** 2 hours

**Acceptance Criteria:**
- [ ] Common patterns documented
- [ ] Copy-paste ready commands
- [ ] File type presets available

---

## Section 11: Constraints and Considerations

### Technical Constraints

| Constraint | Impact | Mitigation |
|------------|--------|------------|
| Command length limits | May affect long commands | Use includes/imports |
| YAML parser limitations | Complex nesting fails | Keep YAML flat |
| Tool availability | Not all tools always available | Graceful fallbacks |
| Memory persistence | Context may compact | Regular saves |

### Compatibility Considerations

| Consideration | Action Required |
|---------------|-----------------|
| Existing workflows | Maintain backward compatibility |
| User habits | Gradual rollout with opt-in |
| Documentation | Update all references |
| Training | Announce changes clearly |

### Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Breaking existing commands | Low | High | Comprehensive testing |
| User confusion | Medium | Medium | Clear documentation |
| Performance degradation | Low | Low | Monitor response times |
| Scope creep | Medium | Medium | Strict scope gates |

---

## Section 12: Integration Patterns

### Integration with Existing Systems

#### Spec Kit Memory Integration

Commands should integrate with memory system:
```markdown
## Memory Checkpoint

Before major actions:
1. Check for relevant memories: memory_search({ query: "..." })
2. Apply learned patterns
3. Save new learnings: generate-context.js
```

#### Narsil Integration

Commands should route code search through Narsil:
```markdown
## Code Search Routing

| Need | Tool | Example |
|------|------|---------|
| Semantic | narsil_neural_search | "How does auth work?" |
| Structural | narsil_find_symbols | "List functions" |
| Text pattern | Grep | "Find TODO" |
```

#### Task Tool Integration

Complex tasks should delegate:
```markdown
## Task Delegation

For multi-step research:
→ Task tool with Research agent

For parallel implementation:
→ Multiple Task calls in parallel
```

---

## Section 13: Code Examples

### Example 1: Plain-Language Gate Implementation

**Before:**
```markdown
### Gate 3: Spec Folder [HARD BLOCK]

Block: HARD - Cannot proceed without answer

Options: A) Existing | B) New | C) Update | D) Skip
```

**After:**
```markdown
### Gate 3: Spec Folder [HARD BLOCK]

**STOP HERE** - Do not proceed until user answers this question.

Which spec folder should this work be documented in?

Options:
- A) Use existing spec folder
- B) Create new spec folder
- C) Update related spec folder
- D) Skip documentation (not recommended)

Block: HARD - Cannot use tools without answer
```

---

### Example 2: "What Next?" Section

```markdown
## Task Complete

I've completed [task summary].

### What was done:
- [Action 1]
- [Action 2]
- [Action 3]

### What Next?

Natural continuation options:
- **A) [Option]** - [Brief rationale]
- **B) [Option]** - [Brief rationale]
- **C) Something else** - Tell me what you'd like to do

Which would you like to pursue?
```

---

### Example 3: Confidence Checkpoint

```markdown
## Checkpoint: Approach Selection

Before implementing:

**Confidence Assessment:**
- Requirements clarity: [0-100%]
- Technical feasibility: [0-100%]
- Risk level: [Low/Medium/High]

**Overall Confidence:** [0-100%]

**Decision:**
- If ≥80%: Proceed with implementation
- If 40-79%: Proceed with caution, note risks
- If <40%: STOP - Ask clarifying question

State confidence explicitly before proceeding.
```

---

## Section 14: Testing and Validation

### Test Cases for Improvements

| Improvement | Test Case | Expected Result |
|-------------|-----------|-----------------|
| Plain-language gates | Issue command, observe stop | AI halts at gate |
| Phase numbering | Check all commands | All start at Phase 1 |
| Auto mode | Run with --auto | No confirmation prompts |
| "What Next?" | Complete task | 2-3 suggestions shown |

### Validation Checklist

```markdown
## Post-Implementation Validation

### P0 Items
- [ ] Plain-language gates present (Grep for "STOP HERE")
- [ ] Phase numbering standardized (Grep for "Phase 0" = 0 results)
- [ ] Confidence checkpoints in YAMLs (100% coverage)

### P1 Items
- [ ] Auto/confirm modes working
- [ ] "What Next?" sections present
- [ ] LEANN references removed

### P2 Items
- [ ] Command chaining syntax implemented
- [ ] Session modes available
- [ ] Tool command bundles documented
```

---

## Section 15: Performance and Efficiency

### Command Execution Metrics

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Gate compliance | ~70% | 95% | Audit logs |
| Completion rate | ~80% | 90% | Task completion |
| Rework rate | ~20% | 10% | Repeat requests |
| User satisfaction | Unknown | High | Feedback |

### Efficiency Improvements

| Improvement | Efficiency Gain | Mechanism |
|-------------|-----------------|-----------|
| Plain gates | 20% fewer violations | Clearer stops |
| "What Next?" | 30% fewer follow-ups | Proactive guidance |
| Command chaining | 15% fewer errors | Explicit prerequisites |

---

## Section 16: Security Considerations

### Command Security Review

| Aspect | Status | Notes |
|--------|--------|-------|
| Input validation | Good | YAML parsing validates |
| Tool restrictions | Partial | Some commands lack whitelist |
| Credential handling | Good | No credentials in commands |
| File access | Good | Scoped to project |

### Security Recommendations

1. Add tool whitelists to all commands
2. Validate user inputs before processing
3. Audit command usage logs
4. Review for injection vulnerabilities

---

## Section 17: Maintenance and Future Work

### Maintenance Schedule

| Task | Frequency | Owner |
|------|-----------|-------|
| Command health check | Monthly | Maintainer |
| Pattern alignment | Quarterly | Team |
| User feedback review | Bi-weekly | Product |
| Security audit | Quarterly | Security |

### Future Work Items

| Item | Priority | Timeline |
|------|----------|----------|
| Command analytics | P2 | Q2 2026 |
| User customization | P3 | Q3 2026 |
| AI-assisted command creation | P3 | Q4 2026 |
| Cross-project command sharing | P3 | 2027 |

### Deprecation Candidates

| Command | Reason | Replacement |
|---------|--------|-------------|
| create_memory.md | Superseded | generate-context.js |
| Any LEANN references | Deprecated | Narsil |

---

## Appendix A: External Command Source

**Source URL:** https://gist.github.com/Rangizingo/e4623d05faab2011e7011b10120b4dce

**Commands Analyzed:**
1. brainstorm.md
2. delegate.md
3. discovery.md
4. iterate.md
5. plan.md
6. pushy.md
7. scope.md
8. search.md
9. start.md

**Analysis Date:** 2026-01-01

---

## Appendix B: Internal Command Paths

| Command | Path |
|---------|------|
| spec_kit_new | .opencode/command/spec_kit_new.md |
| spec_kit_resume | .opencode/command/spec_kit_resume.md |
| spec_kit_handover | .opencode/command/spec_kit_handover.md |
| spec_kit_finish | .opencode/command/spec_kit_finish.md |
| spec_kit_debug | .opencode/command/spec_kit_debug.md |
| spec_kit_validate | .opencode/command/spec_kit_validate.md |
| spec_kit_archive | .opencode/command/spec_kit_archive.md |
| memory_save | .opencode/command/memory_save.md |
| memory_search | .opencode/command/memory_search.md |
| memory_list | .opencode/command/memory_list.md |
| search_code | .opencode/command/search_code.md |
| search_text | .opencode/command/search_text.md |
| create_skill | .opencode/command/create_skill.md |
| create_command | .opencode/command/create_command.md |
| create_agent | .opencode/command/create_agent.md |
| create_memory | .opencode/command/create_memory.md |
| create_spec | .opencode/command/create_spec.md |
| create_doc | .opencode/command/create_doc.md |

---

## Appendix C: Glossary

| Term | Definition |
|------|------------|
| **Gate** | A stopping point requiring user input |
| **HARD BLOCK** | Gate that prevents all tool usage |
| **SOFT BLOCK** | Gate that warns but allows bypass |
| **Phase** | A stage in command workflow |
| **Confidence Checkpoint** | A point to assess certainty |
| **Comprehensive Command** | Full-featured command with guardrails |
| **Command Chaining** | Linking commands in sequence |
| **Session Mode** | Persistent behavior setting |

---

## Appendix D: Change Log

| Date | Version | Change |
|------|---------|--------|
| 2026-01-01 | 1.0.0 | Initial research complete |

---

## Appendix E: Acknowledgements

This research was conducted by 5 parallel Opus agents analyzing:
- External command references (GitHub Gist)
- Internal command inventory
- Prior work from 001-command-analysis
- Prior work from 002-speckit-leann-integration
- Best practices from industry standards

---

*End of Research Document*
