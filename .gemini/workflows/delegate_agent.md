---
description: Delegate to an OpenCode sub-agent by adopting its persona, strict constraints, and quality gates for the duration of a task.
argument-hint: "<agent_name> <task_description>"
---

> ⚠️ **EXECUTION PROTOCOL — READ FIRST**
>
> This command seamlessly delegates execution to a specialized sub-agent by having you **adopt** its exact persona and rules.
>
> **YOUR FIRST ACTION:** Identify the requested agent from the user input and read its `.md` identity file from the Gemini runtime directory first: `.gemini/agents/`. If runtime guidance is insufficient and you need authoring-family context, then consult `.opencode/agent/` as a supporting source.

## CONSTRAINTS

- **DO NOT** execute the task using your default assumptions. You must strictly follow the target agent's `CORE WORKFLOW`.
- **DO NOT** use tools explicitly denied by the agent's `permission` block (e.g., if `bash: deny`, do not run commands).
- **DO NOT** violate any `ILLEGAL NESTING` or `HARD BLOCK` rules defined in the agent's file.
- **CRITICAL:** You must run all required validation scripts or quality gates (like `validate_document.py`) before claiming completion.

---

## 0. UNIFIED DELEGATION WORKFLOW

**STATUS: BLOCKED UNTIL IDENTITY ADOPTED**

EXECUTE PROMPT AND WORKFLOW:

1. CHECK inputs for `<agent_name>` and `<task_description>`.
   - IF missing -> Prompt user: "Which agent should I delegate to, and what is the task?"
   - WAIT for user response.

2. LOCATE and READ the agent's identity file:
   - Check `.gemini/agents/<agent_name>.md`
   - If additional authoring context is needed, check `.opencode/agent/<agent_name>.md`
   - If additional authoring context is needed, check `.opencode/agent/<agent_name>.md`

// turbo 3. ADOPT IDENTITY:

- Extract `role` and `description`.
- Extract `permission` boundaries.
- Extract `CORE WORKFLOW` and `QUALITY GATES`.

4. EXECUTE the `<task_description>` by strictly adhering to the exact workflow, templates, and validation scripts defined in the agent's identity markdown file.

// turbo 5. VERIFY COMPLETION:

- Run any validation scripts mandated by the agent's documentation.
- Fix any failing validation checks before proceeding.

6. DELIVER result in the exact format specified by the agent's identity file.

**Workflow Output:**

- `<agent_name> persona adopted` | `task executed` | `validation passed` | `STATUS=<OK|FAIL>`
