---
title: Prompt Templates
description: Copy-paste ready prompt templates for common Copilot CLI tasks organized by category with placeholders and examples.
---

# Prompt Templates - Copilot CLI

Copy-paste ready prompt templates for common Copilot CLI tasks. Replace `[placeholders]` with your values.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

This asset provides structured, copy-paste ready prompt templates for invoking Copilot CLI across common development tasks. Each template includes the full command with flags, placeholder variables, and a concrete example.

### Usage

1. Find the template category matching your task
2. Copy the command
3. Replace `[placeholders]` with actual values
4. Run in your terminal or via Bash tool

### Flag Reference

| Flag | Purpose |
|------|---------|
| `-p "prompt"` | Non-interactive mode (required for cross-AI delegation) |
| `--allow-all-tools` | Grant permission for all tool executions (required for autonomy) |
| `--model [name]` | Select specific model (Claude, GPT, or Gemini) |
| `--mode plan` | Read-only planning mode for architecture and analysis |
| `--agent [name]` | Route request to a specialized sub-agent |
| `--output-format text/json` | Set the response format |
| `@./path` | Include file or directory context |

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:code_generation -->

## 2. CODE GENERATION

### Single-File Module

Generate a complete single-file component or backend module.

```bash
copilot -p "Create a [language] [type] for [description]. Requirements: [requirements]. Follow patterns in @./[reference-file]. Output complete code with imports, types, and error handling." \
  --model claude-sonnet --allow-all-tools 2>&1
```

**Example:**

```bash
copilot -p "Create a TypeScript utility for advanced date formatting. Requirements: support for multiple timezones, relative time calculation, and ISO validation. Follow patterns in @./src/utils/math.ts. Output complete code with imports, types, and error handling." \
  --model claude-sonnet --allow-all-tools 2>&1
```

### Feature Implementation

Generate coordinated files for a new feature.

```bash
copilot -p "Implement [feature] in [language]. Create necessary files: [file list]. Follow project patterns in @./[reference-dir]. Ensure full type safety and exports." \
  --model gpt-5.3-codex --allow-all-tools 2>&1
```

**Example:**

```bash
copilot -p "Implement a file upload service in Node.js. Create necessary files: service, validator, and route handler. Follow project patterns in @./src/services/base.ts. Ensure full type safety and exports." \
  --model gpt-5.3-codex --allow-all-tools 2>&1
```

<!-- /ANCHOR:code_generation -->
<!-- ANCHOR:code_review -->

## 3. CODE REVIEW

### Security Audit

```bash
copilot -p "Security review of @./[file]. Scan for: OWASP Top 10, hardcoded secrets, and insecure dependencies. Rate findings by severity." \
  --mode plan --model gemini-3.1-pro-preview --allow-all-tools 2>&1
```

**Example:**

```bash
copilot -p "Security review of @./src/api/auth.ts. Scan for: OWASP Top 10, hardcoded secrets, and insecure dependencies. Rate findings by severity." \
  --mode plan --model gemini-3.1-pro-preview --allow-all-tools 2>&1
```

### Performance Review

```bash
copilot -p "Analyze performance of @./[file]. Identify bottlenecks, O(n) complexity issues, and memory leaks. Suggest optimizations." \
  --agent review --mode plan --model claude-opus --allow-all-tools 2>&1
```

<!-- /ANCHOR:code_review -->
<!-- ANCHOR:planning -->

## 4. PLANNING (PLAN MODE)

### Architecture Proposal

```bash
copilot -p "Propose an architecture for [system]. Consider: [constraints]. Compare 3 different approaches and recommend the best one." \
  --mode plan --model claude-opus --allow-all-tools 2>&1
```

**Example:**

```bash
copilot -p "Propose an architecture for a real-time collaborative editor. Consider: websocket latency, conflict resolution, and horizontal scaling. Compare 3 different approaches and recommend the best one." \
  --mode plan --model claude-opus --allow-all-tools 2>&1
```

### Migration Plan

```bash
copilot -p "Create a step-by-step plan to migrate @./[dir] from [old-stack] to [new-stack]. Identify risks and rollback strategies." \
  --mode plan --model gpt-5.4 --allow-all-tools 2>&1
```

<!-- /ANCHOR:planning -->
<!-- ANCHOR:bug_fixing -->

## 5. BUG FIXING

### Root Cause & Fix

```bash
copilot -p "Fix [issue] in @./[file]. Error: [error message]. Reproduce the failure first, then apply the minimal fix." \
  --model gpt-5.3-codex --allow-all-tools 2>&1
```

**Example:**

```bash
copilot -p "Fix memory leak in @./src/workers/processor.ts. Error: Heap out of memory after 2 hours. Reproduce the failure first, then apply the minimal fix." \
  --model gpt-5.3-codex --allow-all-tools 2>&1
```

### Regression Analysis

```bash
copilot -p "Investigate why [feature] stopped working after recent changes in @./[dir]. Check git history and identify the breaking commit." \
  --agent debug --model claude-sonnet --allow-all-tools 2>&1
```

<!-- /ANCHOR:bug_fixing -->
<!-- ANCHOR:test_generation -->

## 6. TEST GENERATION

### Unit Test Suite

```bash
copilot -p "Generate Vitest unit tests for @./[file]. Aim for 90%+ coverage. Mock external dependencies as seen in @./[example-test]." \
  --model gpt-5.3-codex --allow-all-tools 2>&1
```

### E2E Scenario

```bash
copilot -p "Create a Playwright E2E test for the [user flow]. Test files: @./[relevant-files]. Include setup and teardown steps." \
  --model claude-sonnet --allow-all-tools 2>&1
```

<!-- /ANCHOR:test_generation -->
<!-- ANCHOR:documentation -->

## 7. DOCUMENTATION

### Technical Spec

```bash
copilot -p "Write a technical specification for @./[dir]. Include: data models, API signatures, and sequence diagrams in Mermaid format." \
  --agent write --model claude-opus --allow-all-tools 2>&1
```

### Documentation Sync

```bash
copilot -p "Update documentation in @./docs to match code changes in @./src. Ensure all examples are functional." \
  --model gemini-3.1-pro-preview --allow-all-tools 2>&1
```

<!-- /ANCHOR:documentation -->
<!-- ANCHOR:code_transformation -->

## 8. CODE TRANSFORMATION

### Modernization

```bash
copilot -p "Convert @./[file] to use [modern-syntax]. Update dependencies and ensure all tests pass." \
  --model gpt-5.3-codex --allow-all-tools 2>&1
```

**Example:**

```bash
copilot -p "Convert @./src/legacy/db.js to use ESM modules and top-level await. Update dependencies and ensure all tests pass." \
  --model gpt-5.3-codex --allow-all-tools 2>&1
```

### CSS to Tailwind

```bash
copilot -p "Transform styles in @./[component] from CSS Modules to Tailwind classes. Maintain exact visual fidelity." \
  --model gpt-5.3-codex --allow-all-tools 2>&1
```

<!-- /ANCHOR:code_transformation -->
<!-- ANCHOR:structured_analysis -->

## 9. STRUCTURED ANALYSIS

### Dependency Graph

```bash
copilot -p "Map all internal dependencies for @./[dir]. Output as a JSON object showing import relationships." \
  --output-format json --mode plan --model gemini-3.1-pro-preview --allow-all-tools 2>&1
```

### API Surface Analysis

```bash
copilot -p "Extract all public API methods from @./[dir]. Include types, descriptions, and deprecation status." \
  --output-format json --mode plan --model claude-sonnet --allow-all-tools 2>&1
```

<!-- /ANCHOR:structured_analysis -->
<!-- ANCHOR:cloud_delegation -->

## 10. CLOUD DELEGATION

### Infra-as-Code Generation

```bash
copilot -p "Generate Terraform modules for [cloud-resource]. Requirements: [specs]. Follow security best practices for [provider]." \
  --model claude-opus --allow-all-tools 2>&1
```

**Example:**

```bash
copilot -p "Generate Terraform modules for an AWS EKS cluster. Requirements: private subnets, OIDC enabled, and managed node groups. Follow security best practices for AWS." \
  --model claude-opus --allow-all-tools 2>&1
```

### CI/CD Pipeline

```bash
copilot -p "Create a GitHub Action workflow for [project-type]. Include: linting, testing, and deployment to [environment]." \
  --model gpt-5.4 --allow-all-tools 2>&1
```

<!-- /ANCHOR:cloud_delegation -->
<!-- ANCHOR:specialized_tasks -->

## 11. SPECIALIZED TASKS

### Multi-Agent Strategy

```bash
copilot -p "Execute a complex refactor of @./[dir]. Use @context to map dependencies, @debug to fix errors, and @review to verify quality." \
  --agent orchestrate --model claude-opus --allow-all-tools 2>&1
```

### Session Handover

```bash
copilot -p "Summarize progress for the current task. List: completed files, remaining work, and context for the next developer." \
  --agent handover --model gemini-3.1-pro-preview --allow-all-tools 2>&1
```

<!-- /ANCHOR:specialized_tasks -->
<!-- ANCHOR:memory_epilogue -->

## 12. MEMORY EPILOGUE

### Purpose

Append this epilogue to any delegated prompt when the calling AI needs structured session memory back from Copilot CLI. The agent will include the delimited section in its output, enabling the calling AI to extract, parse, and save it via `generate-context.js`.

### Epilogue Template

Append the following text to the end of any Copilot CLI prompt:

```text
When you finish, include a session memory section in your output using EXACTLY this format:

<!-- MEMORY_HANDBACK_START -->
## Session Memory

### Summary
[1-3 sentences: what was accomplished]

### Files Modified
- path/to/file.ts

### Decisions
- Decision and rationale

### Next Steps
- Remaining work

### Spec Folder
[spec-folder-name, e.g. 014-outsourced-agent-memory]
<!-- MEMORY_HANDBACK_END -->
```

### Extraction by Calling AI

After receiving agent output, the calling AI extracts the handback section:

```javascript
const match = output.match(/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/);
```

Then constructs JSON and saves via:

```bash
# Redact or scrub secrets before writing the JSON payload
# Write extracted data to JSON
cat > /tmp/save-context-data.json << 'JSONEOF'
{
  "sessionSummary": "<extracted summary>",
  "filesModified": ["<extracted paths>"],
  "keyDecisions": ["<extracted decisions>"],
  "nextSteps": ["<extracted remaining work>"],
  "specFolder": "<extracted or provided by calling AI>",
  "triggerPhrases": ["<auto-derived from task>"]
}
JSONEOF

# Save via generate-context.js JSON mode
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json [spec-folder]
```

Accepted next-step field names: `nextSteps` or `next_steps`. Persistence behavior: the first item becomes `Next: ...` and sets `NEXT_ACTION`; additional items become `Follow-up: ...`.

If `/tmp/save-context-data.json` is passed explicitly and cannot be loaded, `generate-context.js` fails with `EXPLICIT_DATA_FILE_LOAD_FAILED: ...`. Do not fall back to OpenCode capture for that error.

<!-- /ANCHOR:memory_epilogue -->
