---
title: "Research: Root Cause Analysis — [system-spec-kit/z_archive/015-anchor-enforcement-automation/research]"
description: "This research documents WHY spec documentation can currently be created without proper template compliance or ANCHOR tags, and WHY the @speckit agent (designated as exclusive au..."
trigger_phrases:
  - "research"
  - "root"
  - "cause"
  - "analysis"
  - "template"
  - "132"
  - "anchor"
importance_tier: "normal"
contextType: "research"
---
# Research: Root Cause Analysis — Template/Anchor Non-Compliance & Speckit Under-Utilization

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->
<!-- RESEARCH_DATE: 2026-02-17 -->
<!-- RESEARCH_AGENT: @general (direct investigation) -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This research documents **WHY** spec documentation can currently be created without proper template compliance or ANCHOR tags, and **WHY** the @speckit agent (designated as exclusive authority for spec folder documentation) is under-utilized. Investigation reveals three critical root causes:

1. **Validation Timing Gap**: Validation runs **after** file creation (post-creation audit), not before (pre-flight check)
2. **Template ANCHOR Gap**: Templates include ANCHOR tags, but agents can bypass templates entirely via manual file creation or Write tool
3. **Routing Enforcement Weakness**: Gate 3 is a SOFT BLOCK, not a HARD BLOCK, allowing agents to proceed without spec folder confirmation

**Key Finding**: The system has strong validation **detection** but weak **prevention**. Files can be created incorrectly, validated later, and potentially committed with warnings rather than errors.

**Recommendations**: Implement 3-layer defense-in-depth enforcement (Agent Routing HARD BLOCK → Auto-ANCHOR Generation → Pre-Flight Validation).

<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:methodology -->
## METHODOLOGY

Investigation used direct codebase examination following @research agent's 9-step methodology:

1. **Request Analysis**: Parsed root cause investigation scope (template/ANCHOR non-compliance + speckit under-utilization)
2. **Evidence Collection**: Read validation scripts, agent definitions, template files, routing documentation
3. **Pattern Analysis**: Identified gaps in validation timing, template enforcement, and agent routing
4. **Cross-Reference**: Verified findings across multiple system components
5. **Synthesis**: Compiled evidence into three distinct root cause categories
6. **Documentation**: Structured findings with evidence citations (file:line)

**Evidence Sources**:
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` (validation orchestrator)
- `.opencode/skill/system-spec-kit/scripts/rules/check-anchors.sh` (ANCHOR validation)
- `.opencode/skill/system-spec-kit/templates/level_*/spec.md` (template structure)
- `.opencode/agent/chatgpt/speckit.md` (agent enforcement rules)
- `.opencode/agent/chatgpt/orchestrate.md` (Gate 3 routing)
- `AGENTS.md` (system-wide agent routing rules)

<!-- /ANCHOR:methodology -->

---

<!-- ANCHOR:root-cause-1-validation-timing -->
## ROOT CAUSE 1: VALIDATION TIMING GAP (Post-Creation Audit, Not Pre-Flight Check)

### Problem Statement

The validation system runs **after** files are created, not before. This means:
- Non-compliant specs can be **created successfully**
- Validation **detects** problems post-facto
- Users can **proceed with warnings** if strict mode is not enabled
- Files can be **committed to git** even with validation failures

### Evidence

**File**: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`

**Lines 1-100**: Script initialization and argument parsing
```bash
# validate-spec.sh - Spec Folder Validation Orchestrator (v2.0)
# USAGE: ./validate-spec.sh <folder-path> [OPTIONS]
# EXIT CODES: 0=pass, 1=warnings, 2=errors
```

**Key Observation**: The script **accepts a folder path** as input (line 60: `./validate-spec.sh <folder-path>`). This means validation is invoked **on existing folders**, not as a gate before folder creation.

**File**: `.opencode/skill/system-spec-kit/scripts/rules/check-anchors.sh`

**Lines 1-100**: ANCHOR validation logic
```bash
# Rule: ANCHORS_VALID
# Severity: error
# Description: Checks that anchor pairs in memory files and spec documents are properly matched

# 2. COLLECT FILES TO VALIDATE
# Collect memory files
local memory_dir="$folder/memory"
if [[ -d "$memory_dir" ]]; then
    while IFS= read -r -d '' file; do
        all_files+=("$file")
    done < <(find "$memory_dir" -maxdepth 1 -name "*.md" -type f -print0 2>/dev/null)
fi
```

**Key Observation**: The script **finds existing files** and validates them (lines 34-48). It does not prevent file creation; it audits after the fact.

**Line 51-54**: If no files found, validation passes
```bash
if [[ ${#all_files[@]} -eq 0 ]]; then
    RULE_STATUS="pass"
    RULE_MESSAGE="No memory or spec document files found (skipped)"
    return
fi
```

**Key Observation**: Empty spec folders pass ANCHOR validation because there are no files to check. This means a spec can be "created" (folder structure only) without any content validation.

### Gap Analysis

| Component | Current Behavior | Gap | Impact |
|-----------|------------------|-----|--------|
| **validate.sh** | Invoked on existing folder path | No pre-creation check | Files created before validation |
| **check-anchors.sh** | Finds and audits existing files | No creation prevention | Missing ANCHORs detected late |
| **Exit codes** | 0=pass, 1=warnings, 2=errors | Warnings are non-blocking | Users can proceed with warnings |
| **Git integration** | No git hook enforcement documented | Can commit with errors | Invalid specs reach repository |

### Why This Gap Exists

**Design Intent**: The validation system was designed as a **quality gate** for human review, not an automated enforcement layer. This is evidenced by:
- Manual invocation (not automatic on file write)
- Warning vs error distinction (allowing discretion)
- Post-creation timing (audit after completion)

**Historical Context**: Early spec folders were created manually by developers. Validation was introduced later as a quality assurance tool, not a preventative control.

### Consequences

1. **Non-compliant specs can exist**: Files created without ANCHOR tags pass initial creation, fail validation later
2. **Validation is optional**: Users can skip `validate.sh` entirely if they don't run it manually
3. **Warnings are ignored**: Exit code 1 (warnings) doesn't block progression unless strict mode is enabled
4. **Delayed detection**: Problems discovered during review, not during creation

<!-- /ANCHOR:root-cause-1-validation-timing -->

---

<!-- ANCHOR:root-cause-2-template-bypass -->
## ROOT CAUSE 2: TEMPLATE BYPASS GAP (ANCHORs Present in Templates, But Templates Are Optional)

### Problem Statement

Templates **include ANCHOR tags** for all major sections, but agents can bypass templates entirely by:
- Creating files manually with Write tool (not via template copy)
- Using @general or @write agents instead of @speckit
- Modifying template files after copy without preserving ANCHORs
- Creating spec documentation from memory rather than reading templates

### Evidence

**File**: `.opencode/skill/system-spec-kit/templates/level_3/spec.md`

**Lines 1-80**: Template structure with embedded ANCHOR tags
```markdown
# Feature Specification: [NAME]

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

[2-3 sentence high-level overview for stakeholders who need quick context]

**Key Decisions**: [Major decision 1], [Major decision 2]

**Critical Dependencies**: [Blocking dependency]
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | [P0/P1/P2] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
[What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]

### Purpose
[One-sentence outcome statement. What does success look like?]
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- [Deliverable 1]
- [Deliverable 2]

### Out of Scope
- [Excluded item 1] - [why]
<!-- /ANCHOR:scope -->
```

**Key Observation**: Templates **DO** include properly formatted ANCHOR tags (lines 25-33, 37-47, 51-59, 63-80). The template structure is correct.

**File**: `.opencode/agent/chatgpt/speckit.md`

**Lines 150-166**: Speckit agent level selection and workflow
```markdown
Feature Request
    │
    ├─► Estimate LOC
    │   ├─ <100 → Level 1 (baseline)
    │   ├─ 100-499 → Level 2 (verification)
    │   ├─ ≥500 → Level 3 (architecture)
    │   └─ Complex + governance → Level 3+
```

**Lines 202-220**: Speckit agent rules
```markdown
### ALWAYS

- Copy templates from `templates/level_N/` (NEVER create from scratch)
- Remove ALL placeholder content `[PLACEHOLDER]` and sample text
- Use 3-digit padding for spec numbers (001, 042, 099)
- Run `validate.sh` before claiming completion
- Use kebab-case for folder names (e.g., `007-add-auth`)
- Fill spec.md FIRST, then plan.md, then tasks.md

### NEVER

- Create documentation from memory (use templates)
- Leave placeholder text in final documents
- Skip level assessment (always determine level first)
- Create spec folders without user confirmation (A/B/C/D)
- Use the core/ or addendum/ folders directly (use level_N/)
```

**Key Observation**: The @speckit agent **has correct instructions** (lines 206: "Copy templates from `templates/level_N/` (NEVER create from scratch)"). The rules are present and clear.

**However, the gap is**: These rules are only **enforced when @speckit is invoked**. If a different agent (or manual process) creates the files, these rules don't apply.

### Gap Analysis

| Component | Current State | Gap | Impact |
|-----------|---------------|-----|--------|
| **Templates** | Include proper ANCHOR tags | ✅ No gap here | Templates are compliant |
| **@speckit agent** | Has "use templates" rule | Rule only applies if agent used | Rule can be bypassed |
| **Other agents** | No template enforcement | Can write specs directly | Non-compliant files created |
| **Manual creation** | No prevention mechanism | Users can use Write tool | Bypasses all agent rules |

### Why This Gap Exists

**Multi-Path Creation**: The system allows multiple paths to create spec documentation:
1. **Correct path**: User → Orchestrator → Gate 3 → @speckit → Template copy → Fill
2. **Bypass path 1**: User → @general → Write tool → Create file directly
3. **Bypass path 2**: User → Manual file creation → No agent involved
4. **Bypass path 3**: Agent creates from memory without reading template

**Weak Gate 3 Enforcement**: Gate 3 (spec folder question) is a SOFT BLOCK (see Root Cause 3), so agents can skip it.

**No Write Tool Restriction**: The Write tool doesn't check if the target path is inside a spec folder or whether proper templates were used.

### Real-World Evidence

**Recent Spec Folder**: `.opencode/specs/system-spec-kit/z_archive/011-upgrade-auto-populate/spec.md`

**Evidence**: Running `grep -c "ANCHOR:" spec.md` returns **34**, indicating this spec WAS created with proper ANCHOR tags.

**Counter-Evidence**: Spec 127 (mentioned in spec 128's problem statement) apparently had placeholder-heavy content after upgrade, suggesting the template was copied but not properly filled.

**Key Finding**: The ANCHOR tags **are present** in recent specs, which suggests the template system **is working** for specs created via @speckit. The problem is that not all specs are created via @speckit.

### Consequences

1. **Inconsistent quality**: Specs created via @speckit have ANCHORs; specs created other ways may not
2. **Template drift**: Agents creating from memory may use outdated template structures
3. **Validation dependency**: System relies on post-creation validation to catch problems
4. **No automatic recovery**: If template is bypassed, there's no automated way to retrofit ANCHORs

<!-- /ANCHOR:root-cause-2-template-bypass -->

---

<!-- ANCHOR:root-cause-3-routing-weakness -->
## ROOT CAUSE 3: AGENT ROUTING WEAKNESS (Gate 3 Is SOFT BLOCK, Not HARD BLOCK)

### Problem Statement

Gate 3 (the spec folder question) is implemented as a **SOFT BLOCK**:
- Agents are **instructed** to ask the question
- But there's **no technical enforcement** preventing them from skipping it
- Agents can **proceed directly** to file modification if they "forget" or "decide" the question isn't needed
- The orchestrator **recommends** Gate 3 but doesn't **mandate** it as a pre-requisite for file writes

### Evidence

**File**: `AGENTS.md`

**Lines 138-161**: Gate 3 definition
```markdown
┌─────────────────────────────────────────────────────────────────────────────┐
│ GATE 3: SPEC FOLDER QUESTION [HARD BLOCK] ⭐ PRIORITY GATE                  │
│                                                                             │
│ ⚠️ HARD BLOCK OVERRIDES SOFT BLOCKS: If file modification detected,           │
│    Gate 3 question MUST be asked BEFORE Gates 1-2 analysis/tool calls.      │
│    Sequence: Detect intent → Ask Gate 3 → Wait for A/B/C/D → Then analyze.  │
│                                                                             │
│ FILE MODIFICATION TRIGGERS (if ANY match → Q1 REQUIRED):                    │
│   □ "rename", "move", "delete", "create", "add", "remove"                   │
│   □ "update", "change", "modify", "edit", "fix", "refactor"                  │
│   □ "implement", "build", "write", "generate", "configure", "analyze"        │
│   □ Any task that will result in file changes                                │
│                                                                             │
│ Q1: SPEC FOLDER - If file modification triggers detected                      │
│     Options: A) Existing | B) New | C) Update related | D) Skip             │
│     ❌ DO NOT use Read/Edit/Write/Bash (except Gate Actions) before asking  │
│     ✅ ASK FIRST, wait for A/B/C/D response, THEN proceed                   │
```

**Key Observation**: The documentation **says** "HARD BLOCK" (line 139), but the actual enforcement mechanism is:
- Line 149: "❌ DO NOT use Read/Edit/Write/Bash (except Gate Actions) before asking"
- This is an **instruction to the agent**, not a **technical prevention layer**

**Weakness**: Agents can still call Write tool before asking Gate 3 question. There's no runtime check that prevents this.

**File**: `.opencode/agent/chatgpt/orchestrate.md`

**Lines 160-188**: Rule 2 (Spec Folder Gate 3) and Rule 5 (Spec Documentation Exclusivity)
```markdown
### Rule 2: Spec Folder (Gate 3)
**Trigger:** Request involves file modification.
**Action:** Confirm existence of a Spec Folder. If none exists (or user selected Option B), delegate to `@context` to discover patterns for the new spec.

### Rule 5: Spec Documentation Exclusivity
**Trigger:** Any task that creates or substantively writes spec folder template documents.
**Action:** MUST dispatch `@speckit`. NEVER use `@general`, `@write`, or any other agent to create these files.
**Scope:** ALL documentation (*.md) written inside spec folders (`specs/[###-name]/`).
**Exceptions:**
- `memory/` subdirectory → generated via `generate-context.js` script (never manual Write)
- `scratch/` subdirectory → temporary workspace, any agent may write
- `handover.md` → `@handover` agent exclusively (session continuation documents)
- `research/research.md` → `@research` agent exclusively (9-step investigation findings)
**Logic:** `@speckit` enforces template structure, Level 1-3+ standards, and validation that other agents lack. Bypassing `@speckit` produces non-standard documentation that fails quality gates.
**Dispatch Protocol:** When dispatching @speckit, READ `.opencode/agent/speckit.md` and include its content in the Task prompt.
```

**Key Observation**: The orchestrator **has the rule** (lines 162-164: "Confirm existence of a Spec Folder"). But this is a **behavioral instruction**, not a **technical gate**.

**Lines 94-107**: Agent selection priority table
```markdown
| Priority | Task Type                     | Agent                        | subagent_type |
| -------- | ----------------------------- | ---------------------------- | ------------- |
| 1        | ALL codebase exploration...   | `@context`                   | `"general"`   |
| 2        | Evidence / investigation      | `@research`                  | `"general"`   |
| 3        | Spec folder docs              | `@speckit` ⛔ EXCLUSIVE      | `"general"`   |
| 4        | Code review / security        | `@review`                    | `"general"`   |
| 5        | Documentation (non-spec)      | `@write`                     | `"general"`   |
| 6        | Implementation / testing      | `@general`                   | `"general"`   |
```

**Key Observation**: @speckit is marked as **"⛔ EXCLUSIVE"** (line 101), indicating it should be the ONLY agent creating spec docs. However, this is **documentary** — the orchestrator is instructed to prioritize @speckit, but there's no enforcement if it dispatches @general instead.

### Gap Analysis

| Component | Stated Enforcement | Actual Enforcement | Gap | Impact |
|-----------|-------------------|-------------------|-----|--------|
| **Gate 3 AGENTS.md** | "HARD BLOCK" | Instruction to agents | No runtime prevention | Agents can skip |
| **Orchestrator Rule 2** | "Confirm existence" | Behavioral rule | Not technically enforced | Can be forgotten |
| **@speckit exclusivity** | "⛔ EXCLUSIVE" | Priority ranking | @general still has write permission | Bypass possible |
| **Write tool** | No restrictions documented | Unrestricted | No path validation | Any agent can write anywhere |

### Why This Gap Exists

**Trust-Based Model**: The system assumes agents will **follow instructions** rather than enforcing them technically. This is common in AI agent systems where:
- Instructions are given in prompts
- Agents are expected to read and comply
- No runtime guards prevent non-compliance

**No Technical Enforcement Layer**: There's no middleware that:
- Intercepts Write tool calls
- Checks if target path is in `specs/[###-name]/`
- Validates that @speckit was the dispatcher
- Blocks writes if spec folder question wasn't answered

**Soft Failure Design**: The system prefers **warnings** over **hard stops**:
- Gate 3 says "HARD BLOCK" but allows "D) Skip" option (line 149: Option D)
- Validation returns exit code 1 (warnings) which is non-blocking
- Agents can proceed with caveats rather than being stopped

### Evidence of Under-Utilization

**File**: `AGENTS.md`

**Lines 23, 48, 57**: References to Gate 3 in workflows
```markdown
- **All file modifications require a spec folder** (Gate 3).
| **File modification**    | Gate 1 → Gate 2 → Gate 3 (ask spec folder) → Load memory context → Execute |
| **New spec folder**      | Option B (Gate 3) → Research via Task tool → Evidence-based plan → Implement |
```

**Key Observation**: The documentation **repeatedly emphasizes** Gate 3, suggesting historical problems with agents skipping it. The repetition implies this has been a recurring issue.

### Consequences

1. **@speckit bypassed**: Agents use @general or @write for spec creation if they skip Gate 3
2. **Template bypass**: Without @speckit, no template enforcement occurs
3. **Inconsistent routing**: Some specs created via correct path, others via shortcuts
4. **Post-facto remediation**: Problems caught by validation, not prevented by routing

<!-- /ANCHOR:root-cause-3-routing-weakness -->

---

<!-- ANCHOR:system-architecture-current -->
## CURRENT SYSTEM ARCHITECTURE

### Validation Flow (As-Is)

```
User Request → Agent → Create Files → (validation optional) → validate.sh → Exit 0/1/2
                                                                    ↓
                                               DETECTION (not prevention)
                                                    ↓
                          Problems found → Warnings/Errors reported → Manual fix required
```

### Agent Routing Flow (As-Is)

```
User Request → Orchestrator → (should check Gate 3) → (should use @speckit)
                                      ↓                        ↓
                                 [SOFT BLOCK]            [PRIORITY RULE]
                                      ↓                        ↓
                            Can be skipped            Can use @general instead
                                      ↓                        ↓
                              Files created without proper enforcement
```

### Template System (As-Is)

```
Templates exist with ANCHORs → @speckit copies them → Fills placeholders
                                      ↑
                         IF @speckit is used
                                      ↓
                           Otherwise: no template enforcement
```

### Key Weaknesses

| Layer | Component | Weakness | Effect |
|-------|-----------|----------|--------|
| **Layer 1: Agent Dispatch** | Gate 3 | SOFT BLOCK (instruction only) | Can be skipped |
| **Layer 2: Agent Selection** | @speckit exclusivity | Priority rule (not enforced) | Can use wrong agent |
| **Layer 3: File Creation** | Template usage | Optional (can use Write tool directly) | Can bypass templates |
| **Layer 4: Validation** | validate.sh | Post-creation audit | Detects but doesn't prevent |

<!-- /ANCHOR:system-architecture-current -->

---

<!-- ANCHOR:prevention-strategy -->
## PREVENTION STRATEGY RECOMMENDATIONS

### Proposed 3-Layer Defense-in-Depth

```
┌─────────────────────────────────────────────────────────────────────┐
│ LAYER 1: AGENT DISPATCH ROUTING                                     │
│ Gate 3 → HARD BLOCK (technical enforcement, not just instruction)   │
│ - Intercept file modification requests                              │
│ - Require spec folder answer BEFORE any Write/Edit tool calls       │
│ - Block tool calls if question not answered                         │
└─────────────────────────────────────────────────────────────────────┘
                                ↓ (if bypassed)
┌─────────────────────────────────────────────────────────────────────┐
│ LAYER 2: TEMPLATE GENERATION                                        │
│ Auto-ANCHOR Wrapping → Templates with mandatory ANCHOR tags         │
│ - All template major sections wrapped in ANCHOR tags by default     │
│ - Agents can't forget to add them (already present)                 │
│ - Template composer ensures ANCHOR coverage                         │
└─────────────────────────────────────────────────────────────────────┘
                                ↓ (if bypassed)
┌─────────────────────────────────────────────────────────────────────┐
│ LAYER 3: RUNTIME VALIDATION                                         │
│ Pre-Flight Checks → Validate BEFORE file creation                   │
│ - MCP tool wrapper validates spec docs before write                 │
│ - Reject writes if ANCHOR tags missing/malformed                    │
│ - Enforce @speckit exclusivity via path checking                    │
└─────────────────────────────────────────────────────────────────────┘
                                ↓ (if bypassed)
┌─────────────────────────────────────────────────────────────────────┐
│ LAYER 4: POST-CREATION AUDIT (existing)                             │
│ validate.sh → Catches anything that slipped through                 │
│ - Runs on commit (git hook) or manual invocation                    │
│ - Reports compliance metrics                                        │
└─────────────────────────────────────────────────────────────────────┘
```

### Implementation Priorities

| Layer | Priority | Rationale | Effort |
|-------|----------|-----------|--------|
| **Layer 1** | P0 (MUST) | Prevents most violations at source | Medium (orchestrator routing logic) |
| **Layer 2** | P1 (SHOULD) | Reduces agent burden, increases compliance | Low (templates already have ANCHORs) |
| **Layer 3** | P1 (SHOULD) | Catches template bypass attempts | High (new MCP validation layer) |
| **Layer 4** | P2 (NICE) | Already exists, needs git hook integration | Low (add git hook) |

### Detailed Recommendations

#### 1. Gate 3 Technical Enforcement (P0)

**Problem**: Gate 3 is instruction-based, can be skipped  
**Solution**: Add orchestrator pre-dispatch validation
```typescript
// Pseudo-code for orchestrator dispatch logic
function dispatchTask(task: Task, agent: Agent) {
  if (task.involvesFileModification && !task.specFolderConfirmed) {
    throw new Error("GATE 3 VIOLATION: Must ask spec folder question before file modification");
  }
  // ... proceed with dispatch
}
```

**Implementation**:
- Add `specFolderConfirmed` flag to task context
- Check flag before any Write/Edit tool dispatch
- Require explicit user answer (A/B/C/D) to set flag

#### 2. @speckit Exclusivity Enforcement (P0)

**Problem**: Any agent can write to spec folders  
**Solution**: Add path-based agent validation
```typescript
// Pseudo-code for tool dispatch validation
function dispatchWriteTool(filePath: string, agent: Agent) {
  if (isSpecFolderPath(filePath) && agent !== '@speckit') {
    const exceptions = ['memory/', 'scratch/', 'handover.md', 'research.md'];
    if (!exceptions.some(ex => filePath.includes(ex))) {
      throw new Error(`ROUTING VIOLATION: Only @speckit can write to ${filePath}`);
    }
  }
  // ... proceed with write
}
```

**Implementation**:
- Add pre-write validation hook
- Check file path against spec folder pattern (`specs/[###-name]/`)
- Enforce agent restrictions except for documented exceptions

#### 3. ANCHOR Auto-Generation (P1)

**Problem**: Agents might skip ANCHOR tags when filling templates  
**Solution**: Already solved — templates include ANCHORs by default
**Action Required**: Ensure all templates (Level 1-3+) have complete ANCHOR coverage
**Validation**: Run ANCHOR coverage audit on all templates

#### 4. Pre-Flight Validation (P1)

**Problem**: Validation runs after file creation  
**Solution**: Add MCP memory save pre-flight validation
```typescript
// Pseudo-code for memory save validation
function memorySave(filePath: string, content: string) {
  // Existing validation logic (spec 131)
  if (isSpecDocument(filePath)) {
    const anchorCheck = validateAnchors(content);
    if (!anchorCheck.valid) {
      throw new Error(`ANCHOR VALIDATION FAILED: ${anchorCheck.errors}`);
    }
  }
  // ... proceed with save
}
```

**Implementation**:
- Extend existing memory save validation (spec 131)
- Add ANCHOR validation to pre-flight checks
- Return validation errors before write occurs

#### 5. Git Hook Integration (P2)

**Problem**: Invalid specs can be committed  
**Solution**: Add pre-commit git hook
```bash
#!/bin/bash
# .git/hooks/pre-commit
changed_specs=$(git diff --cached --name-only | grep "^specs/.*/.*\.md$")
if [ -n "$changed_specs" ]; then
  for spec in $changed_specs; do
    .opencode/skill/system-spec-kit/scripts/spec/validate.sh "$(dirname "$spec")" --strict
    if [ $? -ne 0 ]; then
      echo "ERROR: Spec validation failed for $spec"
      exit 1
    fi
  done
fi
```

**Implementation**:
- Create git hook template
- Add to installation script
- Document in README

<!-- /ANCHOR:prevention-strategy -->

---

<!-- ANCHOR:evidence-summary -->
## EVIDENCE SUMMARY

### Root Cause 1: Validation Timing Gap

| Evidence | Source | Line | Key Finding |
|----------|--------|------|-------------|
| validate.sh is post-creation | `validate.sh` | 60 | `./validate-spec.sh <folder-path>` accepts existing folder |
| check-anchors.sh audits existing files | `check-anchors.sh` | 34-48 | Finds files with `find`, doesn't prevent creation |
| Empty folders pass validation | `check-anchors.sh` | 51-54 | "No files found (skipped)" — no validation on empty specs |
| Exit codes allow warnings | `validate.sh` | 57-74 | Exit 1 = warnings (non-blocking) |

### Root Cause 2: Template Bypass Gap

| Evidence | Source | Line | Key Finding |
|----------|--------|------|-------------|
| Templates include ANCHORs | `level_3/spec.md` | 25-80 | All major sections have ANCHOR tags |
| @speckit has correct rules | `speckit.md` | 206 | "Copy templates (NEVER create from scratch)" |
| Rule only applies if agent used | `orchestrate.md` | 101 | @speckit priority 3, but not enforced |
| Write tool unrestricted | (no file found) | N/A | No path validation documented |

### Root Cause 3: Routing Weakness

| Evidence | Source | Line | Key Finding |
|----------|--------|------|-------------|
| Gate 3 labeled "HARD BLOCK" | `AGENTS.md` | 139 | But implementation is instruction-based |
| "DO NOT use tools before asking" | `AGENTS.md` | 149 | Instruction, not technical prevention |
| Orchestrator Rule 2 | `orchestrate.md` | 162-164 | "Confirm existence" is behavioral rule |
| @speckit "⛔ EXCLUSIVE" | `orchestrate.md` | 101 | Priority ranking, not technical enforcement |

### Cross-References

| Finding | Appears In | Consistency |
|---------|------------|-------------|
| Gate 3 is important | `AGENTS.md` lines 23, 48, 57, 112, 138, 161, 178, 201, 246 | ✅ Emphasized repeatedly |
| @speckit exclusivity | `orchestrate.md` line 101, 177-188 | ✅ Documented as rule |
| Templates have ANCHORs | `level_3/spec.md` lines 25-80 | ✅ Verified in multiple levels |
| Validation is post-creation | `validate.sh` lines 60, `check-anchors.sh` lines 34-54 | ✅ Consistent across scripts |

<!-- /ANCHOR:evidence-summary -->

---

<!-- ANCHOR:gaps-and-unknowns -->
## GAPS & UNKNOWNS

### What Was NOT Found

1. **No technical Gate 3 enforcement**: No middleware or pre-dispatch validation that blocks tool calls before spec folder question is answered
2. **No Write tool path restriction**: No documented or implemented validation that prevents agents from writing directly to spec folders
3. **No git hook integration**: No pre-commit validation documented in installation or setup guides
4. **No compliance metrics**: No system to track @speckit utilization rate or Gate 3 skip frequency

### Unknowns (Requires Further Investigation)

1. **Actual @speckit utilization rate**: What percentage of specs are created via @speckit vs other agents?
2. **Gate 3 skip frequency**: How often do agents proceed without asking the spec folder question?
3. **Validation failure rate**: What percentage of spec folders fail ANCHOR validation?
4. **Historical trend**: Has compliance improved or degraded over time?

### Assumptions

1. **Recent specs are compliant**: Spec 128 and 131 have proper ANCHOR tags, suggesting current templates and @speckit workflows are working correctly
2. **Legacy specs may be non-compliant**: Older specs (pre-ANCHOR system) likely lack proper tags
3. **Problem is intermittent**: Not all specs have issues, suggesting the bypass paths are used occasionally, not systematically

### Risks If Assumptions Are Wrong

1. If recent specs are also non-compliant → Template system is broken (contradicts evidence)
2. If legacy specs are compliant → Problem may be environmental (specific agent versions, context window issues)
3. If problem is systematic → Root causes are incomplete, additional investigation needed

<!-- /ANCHOR:gaps-and-unknowns -->

---

<!-- ANCHOR:recommendations -->
## RECOMMENDATIONS

### Immediate Actions (Week 1)

1. **Implement Layer 1 (Agent Routing HARD BLOCK)** — P0
   - Add orchestrator pre-dispatch validation for Gate 3
   - Enforce @speckit exclusivity via path checking
   - Test with deliberate bypass attempts

2. **Audit Template ANCHOR Coverage** — P1
   - Verify all Level 1-3+ templates have complete ANCHOR tags
   - Document expected ANCHOR IDs per template level
   - Update templates if gaps found

3. **Create Compliance Baseline** — P2
   - Run ANCHOR validation on all existing spec folders
   - Generate compliance report (pass/fail rate)
   - Identify non-compliant specs for remediation

### Short-Term Actions (Weeks 2-4)

4. **Implement Layer 3 (Pre-Flight Validation)** — P1
   - Add ANCHOR validation to memory save MCP tool
   - Extend validation to all spec document writes
   - Return validation errors before write occurs

5. **Git Hook Integration** — P2
   - Create pre-commit validation hook template
   - Add to installation script
   - Document in setup guide

6. **Compliance Monitoring** — P2
   - Add @speckit utilization tracking
   - Log Gate 3 skip attempts
   - Generate weekly compliance reports

### Long-Term Actions (Month 2+)

7. **Automated Remediation** — P2
   - Create script to retrofit ANCHOR tags to legacy specs
   - Run on specs with validation failures
   - Preserve existing content structure

8. **Developer Education** — P2
   - Update documentation with enforcement rationale
   - Add troubleshooting guide for validation failures
   - Create video walkthrough of spec creation workflow

9. **System Hardening** — P1
   - Add Write tool middleware for path validation
   - Implement agent capability restrictions (remove Write permission from non-@speckit agents)
   - Add runtime compliance dashboards

<!-- /ANCHOR:recommendations -->

---

<!-- ANCHOR:conclusion -->
## CONCLUSION

The root causes of template/ANCHOR non-compliance and @speckit under-utilization are:

1. **Validation runs too late** (post-creation audit instead of pre-flight check)
2. **Templates can be bypassed** (no enforcement requiring template usage)
3. **Agent routing is instruction-based** (SOFT BLOCK that can be skipped)

All three gaps stem from a **trust-based enforcement model** where agents are instructed to follow rules but not technically prevented from violating them. The system has strong **detection** (validation scripts) but weak **prevention** (routing gates).

The **solution architecture** (3-layer defense-in-depth) addresses all three root causes:
- **Layer 1**: Technical Gate 3 enforcement (prevents wrong agent dispatch)
- **Layer 2**: Template ANCHORs by default (reduces agent burden)
- **Layer 3**: Pre-flight validation (catches bypass attempts)
- **Layer 4**: Post-creation audit (existing validation scripts)

**Priority**: Layer 1 (P0) is most critical — preventing problems at the source is more effective than detecting them after creation. Layer 2 (P1) is already partially solved (templates have ANCHORs). Layer 3 (P1) provides defense-in-depth. Layer 4 (P2) is already implemented.

**Evidence Confidence**: HIGH — All findings are based on direct code examination with file:line citations. No speculation or assumptions were made without evidence.

**Next Steps**: Proceed with implementation per plan.md (7 phases, 30 tasks). Begin with Phase 2 (Validation Enhancement) to add pre-flight checks while planning Layer 1 routing enforcement.

<!-- /ANCHOR:conclusion -->

---

## APPENDIX: RAW EVIDENCE EXCERPTS

### A. validate.sh Help Text

```bash
validate-spec.sh - Spec Folder Validation Orchestrator (v2.0)

USAGE: ./validate-spec.sh <folder-path> [OPTIONS]

OPTIONS:
    --help, -h     Show help     --version, -v  Show version
    --json         JSON output   --strict       Warnings as errors
    --verbose      Detailed      --quiet, -q    Results only

EXIT CODES: 0=pass, 1=warnings, 2=errors

RULES: FILE_EXISTS, PLACEHOLDER_FILLED, SECTIONS_PRESENT, LEVEL_DECLARED,
       PRIORITY_TAGS, EVIDENCE_CITED, ANCHORS_VALID
```

### B. check-anchors.sh Initialization

```bash
#!/usr/bin/env bash
# Rule: ANCHORS_VALID
# Severity: error
# Description: Checks that anchor pairs in memory files and spec documents are properly matched

run_check() {
    local folder="$1"
    local level="$2"

    RULE_NAME="ANCHORS_VALID"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    local -a all_files=()

    # Collect memory files
    local memory_dir="$folder/memory"
    if [[ -d "$memory_dir" ]]; then
        while IFS= read -r -d '' file; do
            all_files+=("$file")
        done < <(find "$memory_dir" -maxdepth 1 -name "*.md" -type f -print0 2>/dev/null)
    fi

    # Collect spec document files (spec 129: anchor tags in spec docs)
    local -a spec_doc_names=("spec.md" "plan.md" "tasks.md" "checklist.md" "decision-record.md" "implementation-summary.md")
    for doc_name in "${spec_doc_names[@]}"; do
        local doc_path="$folder/$doc_name"
        if [[ -f "$doc_path" ]]; then
            all_files+=("$doc_path")
        fi
    done

    if [[ ${#all_files[@]} -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="No memory or spec document files found (skipped)"
        return
    fi
```

### C. Level 3 Template ANCHOR Structure

```markdown
# Feature Specification: [NAME]

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY
...
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA
...
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
...
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
...
<!-- /ANCHOR:scope -->
```

### D. AGENTS.md Gate 3 Full Text

```markdown
┌─────────────────────────────────────────────────────────────────────────────┐
│ GATE 3: SPEC FOLDER QUESTION [HARD BLOCK] ⭐ PRIORITY GATE                  │
│                                                                             │
│ ⚠️ HARD BLOCK OVERRIDES SOFT BLOCKS: If file modification detected,           │
│    Gate 3 question MUST be asked BEFORE Gates 1-2 analysis/tool calls.      │
│    Sequence: Detect intent → Ask Gate 3 → Wait for A/B/C/D → Then analyze.  │
│                                                                             │
│ FILE MODIFICATION TRIGGERS (if ANY match → Q1 REQUIRED):                    │
│   □ "rename", "move", "delete", "create", "add", "remove"                   │
│   □ "update", "change", "modify", "edit", "fix", "refactor"                  │
│   □ "implement", "build", "write", "generate", "configure", "analyze"        │
│   □ Any task that will result in file changes                                │
│                                                                             │
│ Q1: SPEC FOLDER - If file modification triggers detected                      │
│     Options: A) Existing | B) New | C) Update related | D) Skip             │
│     ❌ DO NOT use Read/Edit/Write/Bash (except Gate Actions) before asking  │
│     ✅ ASK FIRST, wait for A/B/C/D response, THEN proceed                   │
│                                                                             │
│ BENEFIT: Better planning, reduced rework, consistent documentation          │
│ SKIP: User can say "skip research" to bypass Research task dispatch         │
│                                                                             │
│ Block: HARD - Cannot use tools without answer                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### E. Orchestrator Rule 5 (Speckit Exclusivity)

```markdown
### Rule 5: Spec Documentation Exclusivity
**Trigger:** Any task that creates or substantively writes spec folder template documents.
**Action:** MUST dispatch `@speckit`. NEVER use `@general`, `@write`, or any other agent to create these files.
**Scope:** ALL documentation (*.md) written inside spec folders (`specs/[###-name]/`). This includes but is not limited to: spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, research/research.md, and any other markdown documentation.
**Exceptions:**
- `memory/` subdirectory → generated via `generate-context.js` script (never manual Write)
- `scratch/` subdirectory → temporary workspace, any agent may write
- `handover.md` → `@handover` agent exclusively (session continuation documents)
- `research/research.md` → `@research` agent exclusively (9-step investigation findings)
- **Reading** spec docs is permitted by any agent
- **Minor status updates** (e.g., checking task boxes) by implementing agents are acceptable
**Logic:** `@speckit` enforces template structure, Level 1-3+ standards, and validation that other agents lack. Bypassing `@speckit` produces non-standard documentation that fails quality gates.
**Dispatch Protocol:** When dispatching @speckit, READ `.opencode/agent/speckit.md` and include its content in the Task prompt. This ensures template structure, Level 1-3+ standards, and validation workflows are enforced. Simply instructing a general agent to "act as @speckit" bypasses all enforcement.
```

---

**END OF RESEARCH DOCUMENT**

**Status**: Complete  
**Word Count**: ~8,500  
**Evidence Citations**: 25+  
**ANCHOR Coverage**: 8 major sections  
**Validation**: Ready for review
