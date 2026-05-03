---
description: Create or improve AI prompts using proven frameworks, DEPTH thinking, and CLEAR scoring via sk-improve-prompt, with optional fresh-context agent dispatch for complex cases
argument-hint: "<prompt_or_topic> [$mode] [:auto|:confirm]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, mcp__cocoindex_code__search
---

> ⚠️ **EXECUTION PROTOCOL — READ FIRST**
>
> This command runs a structured workflow. Only dispatch `@improve-prompt` when the resolved dispatch mode is Agent.
>
> **YOUR FIRST ACTION:**
> 1. Run Phase 0: @general agent self-verification (below)
> 2. Run Setup Phase: consolidated prompt to gather inputs
> 3. Determine execution mode from user input (`:auto` or `:confirm`)
> 4. Resolve dispatch mode (Inline or Agent)
> 5. Execute the workflow steps defined in INSTRUCTIONS
>
> This command is **general-agent based**. In Agent mode, `@general` dispatches `@improve-prompt` after setup.

---

# 🚨 PHASE 0: @GENERAL AGENT VERIFICATION

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS AUTOMATIC SELF-CHECK (NOT A USER QUESTION):

SELF-CHECK: Are you operating as the @general agent?
│
├─ INDICATORS that you ARE @general agent:
│   ├─ You were invoked without @general-only constraints
│   ├─ You can orchestrate Read/Write/Edit/Bash workflow execution
│   ├─ You can load skill references and execute defined logic
│
├─ IF YES (all indicators present):
│   └─ general_agent_verified = TRUE → Continue to Setup Phase
│
└─ IF NO or UNCERTAIN:
    │
    ├─ ⛔ HARD BLOCK - DO NOT PROCEED
    │
    ├─ DISPLAY to user:
    │   ┌────────────────────────────────────────────────────────────┐
    │   │ ⛔ GENERAL AGENT REQUIRED                                  │
    │   │                                                            │
    │   │ This command orchestrates sk-improve-prompt skill         │
    │   │ invocation and optional @improve-prompt dispatch.         │
    │   │                                                            │
    │   │ To proceed, restart with:                                  │
    │   │   /improve:prompt [arguments]                              │
    │   └────────────────────────────────────────────────────────────┘
    │
    └─ RETURN: STATUS=FAIL ERROR="General agent required"
```

**Phase Output:**
- `general_agent_verified = ________________`

---

# 🔒 UNIFIED SETUP PHASE

**STATUS: ☐ BLOCKED**

**🚨 SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION**

This workflow uses a SINGLE consolidated prompt to gather ALL required inputs in ONE user interaction.

**Round-trip optimization:** This workflow requires only 1 user interaction for setup.

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK for mode suffix in $ARGUMENTS or command invocation:
   ├─ ":auto" suffix detected → execution_mode = "AUTONOMOUS" (pre-set, omit Q3)
   ├─ ":confirm" suffix detected → execution_mode = "INTERACTIVE" (pre-set, omit Q3)
   └─ No suffix → execution_mode = "ASK" (include Q3 in prompt)

2. CHECK if $ARGUMENTS contains a mode prefix ($text, $improve, $refine, etc.):
   ├─ IF present and valid → enhancement_mode = detected value, omit Q1
   └─ IF missing → include Q1 in prompt

3. CHECK if $ARGUMENTS contains prompt text (after stripping prefix/suffix):
   ├─ IF present → prompt_input = extracted text, omit Q0
   └─ IF missing or empty → include Q0 in prompt

4. CHECK dispatch-mode defaults:
   ├─ IF `complexity_hint >= 7` is present in caller context or arguments → dispatch_mode = "AGENT" (pre-set, omit Q4)
   ├─ IF user explicitly requests isolation, fresh context, or parallelism → dispatch_mode = "AGENT" (pre-set, omit Q4)
   └─ OTHERWISE → dispatch_mode = "ASK" (include Q4 in prompt)

5. Search for related spec folders:
   $ ls -d specs/*/ 2>/dev/null | tail -10

6. ASK user with SINGLE consolidated prompt (include only applicable questions):

   ┌────────────────────────────────────────────────────────────────┐
   │ **Before proceeding, please answer:**                          │
   │                                                                │
   │ **Q0. Prompt Input** (if not provided in command):             │
   │    What prompt would you like to create or improve?            │
   │    (paste prompt text, describe a topic, or specify a goal)    │
   │                                                                │
   │ **Q1. Enhancement Mode** (if no $mode prefix detected):         │
   │    A) Auto-detect from content (Recommended)                   │
   │    B) $improve — Standard enhancement (10 DEPTH rounds)        │
   │    C) $short — Quick refinement (3 DEPTH rounds)                │
   │    D) $refine — Maximum optimization (10 deep rounds)           │
   │    E) $raw — Skip DEPTH, format only                           │
   │                                                                │
   │ **Q2. Save Location** (required):                              │
   │    A) Save to existing spec folder: [list if found]            │
   │    B) Save to new spec folder                                  │
   │    C) Save to specific path                                     │
   │    D) Skip — keep in conversation only                         │
   │                                                                │
   │ **Q3. Execution Mode** (if no :auto/:confirm suffix):            │
   │    A) Autonomous — run end-to-end (Recommended)                │
   │    B) Interactive — confirm at each DEPTH phase                 │
   │                                                                │
   │ **Q4. Dispatch Mode** (if not auto-selected):                  │
   │    A) Inline skill — direct, in-context (default)              │
   │    B) Agent — fresh context, structured return                 │
   │                                                                │
   │ Reply format: "A, A, D, A, A" or                               │
   │ "my prompt text here, B, A, A, B"                              │
   └────────────────────────────────────────────────────────────────┘

7. WAIT for user response (DO NOT PROCEED)

8. Parse response and store ALL results:
   - prompt_input = [from Q0 or $ARGUMENTS]
   - enhancement_mode = [auto|text|improve|refine|short|json|yaml|raw from Q1 or prefix]
   - save_choice = [A/B/C/D from Q2]
   - save_path = [derived path from Q2 choice, or null if D]
   - execution_mode = [AUTONOMOUS/INTERACTIVE from suffix or Q3]
   - dispatch_mode = [INLINE/AGENT from Q4 or auto-selection]

9. Execute background operations based on choices:
   - IF save_choice == A: Validate spec folder exists
   - IF save_choice == B: Find next number and create: specs/[NNN]-[topic]/
   - IF save_choice == C: Validate custom path exists

10. SET STATUS: ✅ PASSED

**STOP HERE** - Wait for user to answer ALL applicable questions before continuing.

⛔ HARD STOP: DO NOT proceed until user explicitly answers
⛔ NEVER infer prompt text from context, screenshots, or conversation history
⛔ NEVER auto-select save location without user confirmation
⛔ NEVER split these questions into multiple prompts
⛔ NEVER assume what the user wants based on open files or recent activity
```

**Phase Output:**
- `general_agent_verified = ________________`
- `prompt_input = ________________`
- `enhancement_mode = ________________`
- `save_choice = ___` | `save_path = ________________`
- `execution_mode = ________________`
- `dispatch_mode = ________________`

---

## PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL values are set:**

| FIELD                  | REQUIRED      | YOUR VALUE | SOURCE                  |
| ---------------------- | ------------- | ---------- | ----------------------- |
| general_agent_verified | ✅ Yes         | ______     | Automatic check         |
| prompt_input           | ✅ Yes         | ______     | Q0 or $ARGUMENTS        |
| enhancement_mode       | ✅ Yes         | ______     | Q1 or $mode prefix      |
| save_choice            | ✅ Yes         | ______     | Q2                      |
| save_path              | ○ Conditional | ______     | Derived from Q2 (A/B/C) |
| execution_mode         | ✅ Yes         | ______     | Suffix or Q3            |
| dispatch_mode          | ✅ Yes         | ______     | Q4 or auto-selection    |

```
VERIFICATION CHECK:
├─ ALL required fields have values?
│   ├─ YES → Proceed to "INSTRUCTIONS" section below
│   └─ NO  → Re-prompt for missing values only
```

---

## INSTRUCTIONS

After Phase 0 and Setup Phase pass, execute the following workflow steps:

---

> **📚 REFERENCE CONTEXT** — The sections below define the workflow steps and provide reference information. Execute them in order.

---

## CONSTRAINTS

- **DO NOT** dispatch unrelated agents from this document
- **DO NOT** infer prompt text from context, screenshots, or conversation history
- **DO NOT** save to a spec folder without explicit user choice from Q2
- **ONLY** dispatch `@improve-prompt` when `dispatch_mode = AGENT`
- **FIRST ACTION** is always: run Phase 0, run Setup, then execute steps below

---

# Improve Prompt

Create or improve AI prompts by invoking the **sk-improve-prompt** skill. Transforms vague requests into structured, scored prompts using 7 proven frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT), DEPTH thinking methodology, and CLEAR quality scoring.

---

## 1. PURPOSE

This command provides a streamlined entry point for prompt engineering via the `sk-improve-prompt` skill. Instead of manually loading the skill and navigating its pipeline, users invoke `/improve:prompt` with their text and receive either an inline enhancement or a fresh-context `@improve-prompt` result — with the option to save it to a spec folder's `prompts/` directory.

**When to use:**
- Enhancing a vague or basic AI prompt
- Creating a new prompt from a topic description
- Evaluating prompt quality with CLEAR scoring
- Applying a specific framework (RCAF, COSTAR, CRAFT, etc.) to a prompt
- Building a library of enhanced prompts in spec folders

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` — Prompt text or topic, optional mode prefix, optional execution mode, optional complexity hints
**Outputs:** Enhanced prompt + CLEAR score + transparency report + optional file save + `STATUS=<OK|FAIL|CANCELLED>`

### User Input

```text
$ARGUMENTS
```

---

## 3. MODE REFERENCE

### Enhancement Mode Routing

| Mode        | Prefix            | Energy Level | DEPTH Phases        | Max Rounds | Scoring |
| ----------- | ----------------- | ------------ | ------------------- | ---------- | ------- |
| Interactive | (default)         | Standard     | D-E-P-T-H (all 5)   | 10         | CLEAR   |
| Text        | `$text` / `$t`    | Standard     | D-E-P-T-H (all 5)   | 10         | CLEAR   |
| Improve     | `$improve` / `$i` | Standard     | D-E-P-T-H (all 5)   | 10         | CLEAR   |
| Refine      | `$refine` / `$r`  | Deep         | D(extended)-E-P-T-H | 10         | CLEAR   |
| Short       | `$short` / `$s`   | Quick        | D-P-H (3 phases)    | 3          | CLEAR   |
| JSON        | `$json` / `$j`    | Standard     | D-E-P-T-H (all 5)   | 10         | CLEAR   |
| YAML        | `$yaml` / `$y`    | Standard     | D-E-P-T-H (all 5)   | 10         | CLEAR   |
| Raw         | `$raw`            | Raw          | None (passthrough)  | 0          | None    |

### Mode Detection Tree

```
enhancement_mode (from Setup Phase)
    │
    ├─► "auto" (Q1=A or no prefix)
    │   └─► Analyze prompt_input characteristics → auto-select mode
    │       ├─ Short prompt (<50 words) + simple topic → SHORT
    │       ├─ API/code context detected → IMPROVE
    │       ├─ "refine" or "optimize" in text → REFINE
    │       └─ Default → INTERACTIVE (guided)
    │
    ├─► Explicit mode from prefix or Q1
    │   └─► Use as-is
    │
    └─► "raw" (Q1=E or $raw prefix)
        └─► Skip DEPTH, format only
```

---

## 4. WORKFLOW STEPS

### Step 1: Load sk-improve-prompt Skill

- Read the skill definition:
  ```
  Read(".opencode/skill/sk-improve-prompt/SKILL.md")
  ```

- Based on `enhancement_mode`, load conditional references:
  - **TEXT/IMPROVE/REFINE/SHORT**: Load `references/depth_framework.md` + `references/patterns_evaluation.md`
  - **INTERACTIVE/auto**: Use the interactive behavior reference below (Section 4a)
  - **JSON**: Additionally load `assets/format_guide_json.md`
  - **YAML**: Additionally load `assets/format_guide_yaml.md`
  - **RAW**: No additional references needed

### Step 1b: Resolve Dispatch Mode

- **Inline mode**: default for ordinary interactive prompt work
- **Agent mode**: recommended when complexity is `>= 7/10`, when the caller explicitly wants isolation or parallelism, or when compliance/security constraints make a fresh context window safer
- The command and the CLI mirror-card pipeline share the same escalation surface: `@improve-prompt`

### Step 1a: Interactive Behavior (INTERACTIVE/auto modes only)

When `execution_mode = INTERACTIVE` or the mode is auto-detected, apply these conversation patterns:

**Response Templates:**

Use when prompting the user for framework or complexity choices during INTERACTIVE mode pauses:

```markdown
# Framework Choice (Complexity 5-6)
**Complexity Level: [5-6]/10**

I can optimise your prompt using different frameworks:
**Option A: RCAF** - 92% success | General tasks, clarity focus | Baseline tokens
**Option B: COSTAR** - 94% success | Content creation, audience-specific | +5% tokens
**Option C: TIDD-EC** - 93% success | Precision-critical tasks | +8% tokens

Your choice? (A, B, or C)
```

```markdown
# Simplification Choice (Complexity 7+)
**High Complexity Detected (Level [X]/10)**

**Option A: Streamline** - Simplify to core essentials, clearer focused result
**Option B: Comprehensive** - Keep all complexity, detailed but longer

Your preference? (A or B)
```

**Error Recovery:**

| Situation | Response |
|---|---|
| No prompt provided | "I need a prompt or request to enhance. What would you like me to improve?" |
| Ambiguous intent | "Are you looking to improve an existing prompt, or create a new one from scratch?" |
| Invalid command | "Available commands: $text, $improve, $refine, $short, $json, $yaml, $raw" |
| Pasted content, no context | "What should I do with this? Improve clarity, restructure, change format, or full enhancement?" |
| Conflicting signals | "You mentioned both [A] and [B]. Which mode should I use?" |

**Smart Defaults** (when context is missing after max interactions):

| Missing | Default | Override |
|---|---|---|
| Energy Level | Standard | $raw, $deep, $short |
| Format | Standard Markdown | $json, $yaml, $markdown |
| Framework | RCAF (92% success) | Complexity 5-6: choice |
| Perspectives | 3-5 (std), 0 (raw) | Per energy level |

**Formatting Rules:**
- Use markdown dashes `-` for bullets (never emoji bullets)
- Each bullet on separate line (never compress to single line)
- Bold headers followed by content: **Header:**
- No emojis in questions
- Defaults in brackets: [default: Markdown]

**Maximum Question Interactions:**
- Standard flow: Max 3 interactions (welcome + framework/simplification + format)
- Command flow: Max 1 interaction (format question)
- Raw mode: 0 interactions (enhance immediately)
- After max interactions: use smart defaults, flag assumptions in output

---

### Step 2: Execute Enhancement Pipeline

Follow the branch selected by `dispatch_mode`:

**If `dispatch_mode = AGENT`:**
1. Dispatch `Task(subagent_type="improve-prompt")` with:
   - `raw_task = prompt_input`
   - `task_type = best-fit task family`
   - `complexity_hint = inferred or supplied complexity`
   - `constraints = execution mode, output needs, compliance or audience notes`
2. Capture the structured return block:
   - `FRAMEWORK`
   - `CLEAR_SCORE`
   - `RATIONALE`
   - `ENHANCED_PROMPT`
   - `ESCALATION_NOTES`
3. Use the returned `ENHANCED_PROMPT` as the command result and optional saved artifact.

**If `dispatch_mode = INLINE`:**
Follow the inline `sk-improve-prompt` pipeline for the resolved mode:

**For Standard/Deep energy levels (TEXT, IMPROVE, REFINE, INTERACTIVE):**
1. **Discover**: Analyze prompt from 3-5 perspectives, audit assumptions, select framework
   - Evaluate prompt characteristics: complexity (1-10), urgency, audience, creative, precision
   - Score frameworks and select best match (RCAF default, 92% success rate)
2. **Engineer**: Generate 8+ optimization approaches, select best, apply constraint reversal
3. **Prototype**: Build enhanced prompt using selected framework structure
4. **Test**: Score with CLEAR (target: 40+/50). If below threshold, iterate (max 3 cycles)
5. **Harmonize**: Final polish, verify perspectives addressed, prepare output metadata

**For Quick energy level (SHORT):**
1. **Discover**: Quick 1-2 perspective analysis, select framework
2. **Prototype**: Build enhanced prompt
3. **Harmonize**: Polish and score

**For Raw (RAW):**
- Pass through without DEPTH processing. Format only.

**EXECUTION mode behavior:**
- **AUTONOMOUS**: Execute all phases without pausing. Only stop if CLEAR score fails after 3 iterations.
- **INTERACTIVE**: Pause after Discover phase to confirm framework selection. Pause after Prototype to show draft. Pause after Test to show score.

### Step 3: Score and Validate

Apply CLEAR scoring to the enhanced prompt:

| Dimension       | Max | Floor | Measures                         |
| --------------- | --- | ----- | -------------------------------- |
| **C**orrectness | 10  | 7     | Accuracy, no contradictions      |
| **L**ogic       | 10  | 7     | Reasoning flow, coherence        |
| **E**xpression  | 15  | 10    | Clarity, specificity             |
| **A**rrangement | 10  | 7     | Structure, hierarchy             |
| **R**eusability | 5   | 3     | Adaptability, template potential |

- **Pass** (40+/50, all floors met): Proceed to delivery
- **Revision needed** (30-39): Return to Prototype, iterate (max 3 cycles)
- **Rejected** (<30): Restart from Engineer phase

### Step 4: Deliver Enhanced Prompt

Present the enhanced prompt with:

1. **The enhanced prompt** — formatted per resolved mode (markdown default, JSON, or YAML)
2. **Transparency report:**
   ```
   Framework: [SELECTED]
   Mode: $[MODE] | Energy: [LEVEL]
   Dispatch: [INLINE|AGENT]
   DEPTH Rounds: [N]
   Perspectives: [COUNT] ([LIST])
   CLEAR Score: [TOTAL]/50
     C: [X]/10 | L: [X]/10 | E: [X]/15 | A: [X]/10 | R: [X]/5
   ```

### Step 5: Save Prompt (if save_choice ≠ D)

**Execute save based on `save_choice` from Setup Phase:**

**If A (existing spec folder):**
1. Confirm the selected spec folder exists
2. Create `prompts/` directory if it doesn't exist: `mkdir -p specs/[folder]/prompts/`
3. Generate descriptive filename from prompt topic (hyphen-case, e.g., `api-auth-documentation.md`)
4. Write enhanced prompt file with frontmatter (see format below)
5. Confirm: `Saved to: specs/[folder]/prompts/[filename].md`

**If B (new spec folder):**
1. Find next available number: `ls -d specs/*/ | sort | tail -1`
2. Create spec folder: `mkdir -p specs/[NNN]-[topic]/prompts/`
3. Write enhanced prompt file with frontmatter
4. Confirm: `Saved to: specs/[NNN]-[topic]/prompts/[filename].md`

**If C (specific path):**
1. Create parent directory if needed: `mkdir -p [custom-path]/`
2. Write enhanced prompt file with frontmatter
3. Confirm: `Saved to: [custom-path]/[filename].md`

**If D (skip):** No file written. Prompt remains in conversation only.

**Saved prompt file format:**
```markdown
---
title: "[Descriptive title of the prompt]"
framework: "[RCAF|COSTAR|CRAFT|...]"
mode: "[MODE used]"
clear_score: [N]/50
created: [YYYY-MM-DD]
---

[Enhanced prompt content]
```

### Step 6: Return Status

- If completed without save: `STATUS=OK SCORE=[N]/50 FRAMEWORK=[NAME]`
- If prompt saved: `STATUS=OK SCORE=[N]/50 FRAMEWORK=[NAME] SAVED=[path]`
- If user cancels: `STATUS=CANCELLED`
- If skill not found: `STATUS=FAIL ERROR="sk-improve-prompt skill not found at .opencode/skill/sk-improve-prompt/SKILL.md"`
- If CLEAR score fails after max iterations: `STATUS=FAIL ERROR="CLEAR score below threshold after 3 iterations: [SCORE]/50"`

---

## 5. EXAMPLE USAGE

### Basic Prompt Improvement

```
/improve:prompt "Write a blog post about AI"
```
→ Setup asks Q1 (mode), Q2 (save location), Q3 (execution mode), Q4 (dispatch mode)

### With Mode Prefix and Auto Mode

```
/improve:prompt $improve "Help users understand our API authentication flow" :auto
```
→ Skips Q1 and Q3; still resolves Q2 and Q4 as needed

### Quick Enhancement

```
/improve:prompt $short "Generate test data for user registration"
```
→ Quick 3-round DEPTH (D-P-H only), fast enhancement

### JSON Format Output

```
/improve:prompt $json "Create a customer support chatbot system prompt"
```
→ Full DEPTH processing, outputs as JSON-structured prompt

### Raw Passthrough

```
/improve:prompt $raw "Analyze the sentiment of customer reviews and categorize them"
```
→ No DEPTH processing, formats only

### Interactive with Confirmation

```
/improve:prompt "Design a prompt for code review automation" :confirm
```
→ Pauses at each DEPTH phase for user approval

### Save to Spec Folder

```
/improve:prompt $improve "Build a system prompt for onboarding new developers"
```
→ User selects Q2=A → Saved to `specs/012-onboarding/prompts/developer-onboarding-system-prompt.md`

---

## 6. EXAMPLE OUTPUT

```
Enhanced Prompt (RCAF Framework):
─────────────────────────────────

Role: You are an expert technical writer specializing in API documentation.

Context: A developer team needs clear, actionable API authentication documentation
for their REST API using OAuth 2.0 with JWT tokens. The audience ranges from
junior to senior developers.

Action: Create comprehensive API authentication documentation that covers:
1. OAuth 2.0 flow diagram with step-by-step explanation
2. JWT token structure and validation rules
3. Code examples in Python, JavaScript, and cURL
4. Common error scenarios with troubleshooting steps
5. Security best practices and token rotation strategy

Format: Structured markdown with code blocks, tables for error codes,
and a quick-start section for developers who want to start immediately.

─────────────────────────────────
Transparency Report:
  Framework: RCAF (selected for clarity + moderate complexity)
  Mode: $improve | Energy: Standard
  DEPTH Rounds: 5
  Perspectives: 4 (Prompt Engineering, AI Interpretation, User Clarity, Token Efficiency)
  CLEAR Score: 44/50
    C: 9/10 | L: 9/10 | E: 13/15 | A: 9/10 | R: 4/5

Saved to: specs/012-onboarding/prompts/api-auth-documentation.md

STATUS=OK SCORE=44/50 FRAMEWORK=RCAF SAVED=specs/012-onboarding/prompts/api-auth-documentation.md
```

---

## 7. NOTES

- **Skill dependency**: Requires `sk-improve-prompt` at `.opencode/skill/sk-improve-prompt/`
- **Prompt saving**: Setup Phase Q2 determines save behavior upfront. Saved prompts include frontmatter with framework, mode, and CLEAR score metadata.
- **Prompts directory**: Saved prompts go to `specs/[folder]/prompts/[descriptive-name].md`. The `prompts/` directory is created automatically if it doesn't exist.
- **Framework selection**: RCAF is the default (92% success rate). For complex prompts (7+ complexity), CRAFT or TIDD-EC is auto-selected.
- **Scoring threshold**: CLEAR score must reach 40/50 with all dimension floors met. Below-threshold results trigger automatic re-iteration.
- **Token efficiency**: SHORT mode ($short) uses only 3 DEPTH rounds for faster results when quality requirements are lower.

---

## 8. RELATED COMMANDS

| Command                   | Purpose                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------ |
| `/create:sk-skill ... full-create` | Create a new OpenCode skill (if the enhanced prompt should become a skill) |
| `/create:sk-skill ... reference-only` | Create reference documentation (if prompt engineering patterns should be documented) |
| `/create:folder_readme`   | Create supporting documentation artifact (if prompt results should be packaged)      |

---

## 9. VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**

**Phase Violations:**
- Executed workflow without @general agent verification
- Started executing steps before all Setup Phase fields are set
- Asked questions in MULTIPLE separate prompts instead of ONE consolidated prompt
- Proceeded without asking user for prompt text when not in $ARGUMENTS
- Inferred prompt text from context, screenshots, or conversation history
- Auto-selected save location without user confirmation in Q2

**Workflow Violations (Steps 1-6):**
- Skipped DEPTH processing (unless $raw mode)
- Delivered without CLEAR scoring (unless $raw mode)
- Failed to load sk-improve-prompt SKILL.md before enhancement
- Saved to a spec folder when user selected Q2=D (skip)
- Did not save when user selected Q2=A/B/C

**VIOLATION RECOVERY PROTOCOL:**
```
FOR PHASE VIOLATIONS:
1. STOP immediately - do not continue current action
2. STATE: "I asked questions separately instead of consolidated. Correcting now."
3. PRESENT the single consolidated prompt with ALL applicable questions
4. WAIT for user response
5. RESUME only after all fields are set

FOR WORKFLOW VIOLATIONS:
1. STOP immediately
2. STATE: "I skipped STEP [X] by [specific action]. Correcting now."
3. RETURN to the skipped step
4. COMPLETE all activities for that step
5. VERIFY outputs exist
6. CONTINUE to next step in sequence
```

**If ANY violation:** STOP → State violation → Return to correct step → Complete properly
