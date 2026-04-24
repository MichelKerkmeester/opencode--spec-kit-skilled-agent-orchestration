---
title: Prompt Templates
description: Copy-paste ready prompt templates for common Codex CLI tasks organized by category with placeholders and examples.
---

# Prompt Templates - Codex CLI

Copy-paste ready prompt templates for common Codex CLI tasks. Replace `[placeholders]` with your values.

---

<!-- ANCHOR:overview -->

## 1. OVERVIEW

### Purpose

This asset provides structured, copy-paste ready prompt templates for invoking Codex CLI across common development tasks. Each template includes the full command with flags, placeholder variables, and a concrete example.

### Usage

1. Find the template category matching your task
2. Copy the command
3. Replace `[placeholders]` with actual values
4. Run in your terminal or via Bash tool

### Flag Reference

> **Non-existent flags:** `--reasoning`, `--reasoning-effort` and `--quiet` do NOT exist in codex exec. Use `-c model_reasoning_effort="high"` for reasoning effort. Use `-o file.txt` to capture the last message to a file.

| Flag                           | Purpose                                                                             |
| ------------------------------ | ----------------------------------------------------------------------------------- |
| `--model gpt-5.5`              | Skill model — used for every delegation (code generation, review, architecture, research) |
| `-c model_reasoning_effort="<level>"` | Reasoning effort: `none`, `minimal`, `low`, `medium` (default), `high`, `xhigh` |
| `-c service_tier="fast"`        | Fast service tier — always pass explicitly for reproducible delegation              |
| `--sandbox read-only`          | Safe mode: read files, no writes or shell commands                                  |
| `--sandbox workspace-write`    | Allow file writes and build commands within workspace                               |
| `--sandbox danger-full-access` | Full shell access — **requires explicit user approval**                             |
| `--full-auto`                  | Low-friction mode (auto-approves all actions) — **requires explicit user approval** |
| `--search`                     | Enable live web browsing during execution                                           |
| `-i` / `--image`               | Attach an image file as visual input                                                |
| `@./path`                      | Include file content in prompt                                                      |

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:code_generation -->

## 2. CODE GENERATION

### Single-File Application

Framework: RCAF

Generate a complete single-file application from a description.

```bash
codex exec "Create a [description] application in [language]. Requirements: [requirements]. Output a single complete file with all imports, error handling, and comments. Start immediately." \
  --model gpt-5.5 --sandbox workspace-write
```

**Example:**

```bash
codex exec "Create a REST API server application in TypeScript. Requirements: Express framework, CRUD endpoints for a 'tasks' resource, input validation with Zod, error middleware, health check endpoint. Output a single complete file with all imports, error handling, and comments. Start immediately." \
  --model gpt-5.5 --sandbox workspace-write
```

### Multi-File Project

Framework: RCAF

Generate a multi-file project structure with coordinated files.

```bash
codex exec "Create a [description] project in [language] with the following structure: [features]. Generate all files including entry point, modules, configuration, and package manifest. Write files to [directory]. Start immediately." \
  --model gpt-5.5 --sandbox workspace-write
```

**Example:**

```bash
codex exec "Create a CLI tool project in TypeScript with the following structure: command parser with yargs, config loader from YAML, logger module with levels, and main entry point. Generate all files including entry point, modules, configuration, and package manifest. Write files to ./src/cli-tool/. Start immediately." \
  --model gpt-5.5 --sandbox workspace-write
```

### Component / Module

Framework: RCAF

Generate a single component or module that fits into an existing codebase.

```bash
codex exec "Create a [language] [format] for [description]. Follow the patterns used in @./[file]. Include types, exports, error handling, and JSDoc comments. Output only the code." \
  --model gpt-5.5 --sandbox workspace-write
```

**Example:**

```bash
codex exec "Create a TypeScript module for rate-limiting middleware with sliding window algorithm. Follow the patterns used in @./src/middleware/auth.ts. Include types, exports, error handling, and JSDoc comments. Output only the code." \
  --model gpt-5.5 --sandbox workspace-write
```

### Design-to-Code (with Image)

Framework: RCAF

Implement a UI component from a design mockup or screenshot.

```bash
codex exec "Implement a [language] [framework] component to match the attached design. Follow the patterns in @./[file]. Include all props, state management, and styling." \
  --model gpt-5.5 -i [design-file] --sandbox workspace-write
```

**Example:**

```bash
codex exec "Implement a React TypeScript component to match the attached design. Follow the patterns in @./src/components/Button.tsx. Include all props, state management, and CSS module styling." \
  --model gpt-5.5 -i ./designs/login-form.png --sandbox workspace-write
```

---

<!-- /ANCHOR:code_generation -->
<!-- ANCHOR:code_review -->

## 3. CODE REVIEW

### Comprehensive Review

Framework: TIDD-EC

Full code review covering correctness, style, maintainability, and performance.

```bash
codex exec "Review @./[file] thoroughly. Check for: 1) Logic errors and edge cases, 2) Code style and naming consistency, 3) Error handling completeness, 4) Performance issues, 5) Maintainability concerns. For each issue found, provide the line reference, severity (critical/warning/info), and a suggested fix." \
  --model gpt-5.5 --sandbox read-only
```

### Security-Focused Review

Framework: TIDD-EC

Review focused on security vulnerabilities and attack surfaces.

```bash
codex exec "Perform a security audit of @./[file]. Check for: 1) Injection vulnerabilities (SQL, XSS, command injection), 2) Authentication and authorization flaws, 3) Sensitive data exposure (hardcoded secrets, logging PII), 4) Input validation gaps, 5) Insecure dependencies or patterns, 6) eval() or dynamic code execution. Rate each finding as critical/high/medium/low severity." \
  --model gpt-5.5 --sandbox read-only
```

### Performance Review

Framework: TIDD-EC

Review focused on performance bottlenecks and optimization opportunities.

```bash
codex exec "Analyze @./[file] for performance issues. Check for: 1) Unnecessary re-renders or recomputations, 2) Memory leaks (unclosed handles, growing collections), 3) N+1 query patterns, 4) Missing caching opportunities, 5) Blocking operations in async contexts, 6) Algorithmic complexity concerns. Suggest concrete optimizations with expected impact." \
  --model gpt-5.5 --sandbox read-only
```

### Staged Changes Review (Interactive /review)

Framework: TIDD-EC

Review only the currently staged changes using the diff-aware `/review` command.

```bash
# Stage your changes first
git add [files]

# Start Codex TUI, then run /review
codex
# Inside TUI: /review
```

### Branch Comparison Review (Interactive /review)

Framework: TIDD-EC

Review all changes between two branches.

```bash
codex
# Inside TUI: /review [base-branch]..[feature-branch]
# Example: /review main..feature/auth
```

---

<!-- /ANCHOR:code_review -->
<!-- ANCHOR:bug_fixing -->

## 4. BUG FIXING

### Fix Identified Bugs

Framework: RCAF + TIDD-EC

Fix a known bug with description and reproduction context.

```bash
codex exec "Fix this bug in @./[file]: [description]. The expected behavior is [requirements]. The actual behavior is [description]. Apply the minimal fix without refactoring unrelated code. Explain the root cause and the fix. Start immediately." \
  --model gpt-5.5 --sandbox workspace-write
```

### Auto-Detect and Fix

Framework: RCAF + TIDD-EC

Let Codex scan a file for potential bugs and apply fixes.

```bash
codex exec "Scan @./[file] for bugs. Look for: null/undefined access, off-by-one errors, race conditions, unhandled promise rejections, incorrect type coercions, resource leaks, and logic errors. For each bug found: describe the issue, show the fix, and explain why it is a bug. Apply all fixes. Start immediately." \
  --model gpt-5.5 --sandbox workspace-write
```

### Fix from Screenshot

Framework: RCAF + TIDD-EC

Diagnose and fix a bug shown in a screenshot.

```bash
codex exec "This screenshot shows a bug in the application. Analyze @./[file] and identify the root cause. Apply the minimal fix. Explain what was wrong." \
  --model gpt-5.5 -i [screenshot] --sandbox workspace-write
```

---

<!-- /ANCHOR:bug_fixing -->
<!-- ANCHOR:test_generation -->

## 5. TEST GENERATION

### Unit Tests

Framework: RCAF

Generate unit tests for a specific file or module.

```bash
codex exec "Generate comprehensive [framework] unit tests for @./[file]. Cover: 1) Happy path for each exported function, 2) Edge cases (empty input, null, boundary values), 3) Error conditions and thrown exceptions, 4) Mock external dependencies. Use describe/it blocks with descriptive names. Output a complete test file." \
  --model gpt-5.5 --sandbox workspace-write
```

**Example (Jest):**

```bash
codex exec "Generate comprehensive Jest unit tests for @./src/utils/validator.ts. Cover: 1) Happy path for each exported function, 2) Edge cases (empty input, null, boundary values), 3) Error conditions and thrown exceptions, 4) Mock external dependencies. Use describe/it blocks with descriptive names. Output a complete test file." \
  --model gpt-5.5 --sandbox workspace-write
```

### Integration Tests

Framework: RCAF

Generate integration tests that test multiple components working together.

```bash
codex exec "Generate [framework] integration tests for the [description] workflow. Test files involved: @./[file]. Cover: 1) End-to-end happy path, 2) Error propagation across layers, 3) Database/API interaction patterns, 4) Setup and teardown for test isolation. Write the complete test file." \
  --model gpt-5.5 --sandbox workspace-write
```

### Test Coverage Analysis

Framework: RCAF

Identify missing test coverage in an existing test suite.

```bash
codex exec "Analyze @./[test-file] against the implementation in @./[source-file]. Identify: 1) Functions with no test coverage, 2) Edge cases not covered by existing tests, 3) Error paths not exercised. List gaps by priority (critical/high/medium) and suggest specific test cases to add." \
  --model gpt-5.5 --sandbox read-only
```

---

<!-- /ANCHOR:test_generation -->
<!-- ANCHOR:documentation -->

## 6. DOCUMENTATION

### JSDoc / TSDoc Generation

Framework: RCAF

Add inline documentation to source code.

```bash
codex exec "Add complete JSDoc documentation to @./[file]. For every exported function, class, method, and type: add description, @param with types and descriptions, @returns, @throws, and @example where useful. Preserve all existing code unchanged. Apply changes to the file. Start immediately." \
  --model gpt-5.5 --sandbox workspace-write
```

### README Generation

Framework: RCAF

Generate a project or module README from source code.

```bash
codex exec "Generate a comprehensive README.md for the project in [directory]. Analyze the source code and include: 1) Project title and description, 2) Installation instructions, 3) Usage examples with code snippets, 4) API reference for public interfaces, 5) Configuration options, 6) Contributing guidelines placeholder. Output as markdown." \
  --model gpt-5.5 --sandbox workspace-write
```

### API Documentation

Framework: RCAF

Generate API documentation from route definitions or endpoint handlers.

```bash
codex exec "Generate API documentation for @./[file]. For each endpoint: document the HTTP method, path, request parameters, request body schema, response schema with status codes, authentication requirements, and provide a curl example. Output as markdown." \
  --model gpt-5.5 --sandbox workspace-write
```

---

<!-- /ANCHOR:documentation -->
<!-- ANCHOR:code_transformation -->

## 7. CODE TRANSFORMATION

### Refactoring

Framework: RCAF + TIDD-EC

Refactor code for improved structure without changing behavior.

```bash
codex exec "Refactor @./[file] to [description]. Requirements: 1) Preserve all existing behavior exactly, 2) Improve [requirements], 3) Add no new dependencies. Show the complete refactored file. Apply changes. Start immediately." \
  --model gpt-5.5 --sandbox workspace-write
```

### Language Translation

Framework: RCAF + TIDD-EC

Translate code from one language to another.

```bash
codex exec "Translate @./[file] from [language] to [language]. Requirements: 1) Preserve all logic and behavior, 2) Use idiomatic [language] patterns, 3) Translate types and error handling to [language] equivalents, 4) Include equivalent imports/dependencies. Output the complete translated file." \
  --model gpt-5.5 --sandbox workspace-write
```

### Framework Migration

Framework: RCAF + TIDD-EC

Migrate code from one framework to another.

```bash
codex exec "Migrate @./[file] from [framework] to [framework]. Requirements: 1) Preserve all functionality, 2) Use idiomatic [framework] patterns, 3) Update lifecycle methods and hooks, 4) Translate state management approach, 5) List any new dependencies needed. Output the complete migrated file." \
  --model gpt-5.5 --sandbox workspace-write
```

---

<!-- /ANCHOR:code_transformation -->
<!-- ANCHOR:web_research -->

## 8. WEB RESEARCH

### Current Information

Framework: CRISPE

Fetch up-to-date information using web search.

```bash
codex exec "Search the web for current information about [topic] as of [date]. Provide: 1) Latest version or status, 2) Recent changes or announcements, 3) Links to official sources. Cite your sources." \
  --model gpt-5.5 --search --sandbox read-only
```

### Library / API Research

Framework: CRISPE

Research a specific library, API, or technology.

```bash
codex exec "Search the web to research [topic]. Find: 1) Current stable version and release date, 2) Installation instructions, 3) Key API changes in recent versions, 4) Known issues or deprecations, 5) Community adoption and alternatives. Cite official documentation." \
  --model gpt-5.5 --search --sandbox read-only
```

### Comparison Research

Framework: CRISPE

Compare technologies, libraries, or approaches with current data.

```bash
codex exec "Search the web to compare [topic] vs [topic] as of [date]. Compare on: 1) Performance benchmarks, 2) Bundle size and dependencies, 3) Community support and maintenance activity, 4) Feature set differences, 5) Migration effort from one to the other. Cite sources for all claims." \
  --model gpt-5.5 --search --sandbox read-only
```

### Security Advisory Research

Framework: CRISPE

Research security vulnerabilities for a specific package or technology.

```bash
codex exec "Search the web for security advisories and CVEs for [package]@[version] as of [date]. Provide: 1) Known CVE IDs and severity ratings, 2) Affected versions, 3) Patched versions, 4) Recommended mitigation steps. Cross-reference with NVD, GitHub Security Advisories, and official package changelogs." \
  --model gpt-5.5 --search --sandbox read-only
```

---

<!-- /ANCHOR:web_research -->
<!-- ANCHOR:architecture_analysis -->

## 9. ARCHITECTURE ANALYSIS

### Project Analysis

Framework: CRAFT

Analyze overall project architecture and structure.

```bash
codex exec "Analyze the project structure in [directory]. Provide: 1) High-level architecture overview, 2) Key modules and their responsibilities, 3) Dependency relationships between major components, 4) Entry points and data flow, 5) Technology stack summary. Output as structured markdown." \
  --model gpt-5.5 --sandbox read-only
```

### Dependency Analysis

Framework: CRAFT

Map dependencies and identify coupling issues.

```bash
codex exec "Analyze dependencies in [directory]. Identify: 1) Direct and transitive dependency chains, 2) Circular dependencies, 3) Tightly coupled modules, 4) Unused imports or dead code paths, 5) Dependency inversion violations. Suggest concrete decoupling strategies." \
  --model gpt-5.5 --sandbox read-only
```

### Impact Analysis

Framework: CRAFT

Assess the impact of a planned change before implementing it.

```bash
codex exec "Analyze the impact of [description of planned change] on @./[file]. Identify: 1) All files that import or depend on the affected code, 2) Functions or modules that would break, 3) Tests that would need updating, 4) Migration steps required. Rate the risk as low/medium/high." \
  --model gpt-5.5 --sandbox read-only
```

---

<!-- /ANCHOR:architecture_analysis -->
<!-- ANCHOR:specialized_tasks -->

## 10. SPECIALIZED TASKS

### Git Commit Message

Framework: RCAF

Generate a commit message from staged changes.

```bash
codex exec "Based on the following git diff, write a commit message following Conventional Commits format (type(scope): description). Include a body explaining why the change was made. Diff: $(git diff --cached)" \
  --model gpt-5.5 --sandbox read-only
```

### Code Explanation

Framework: CRAFT

Get a detailed explanation of unfamiliar code.

```bash
codex exec "Explain @./[file] in detail. Cover: 1) What the code does at a high level, 2) Key algorithms or patterns used, 3) How data flows through the functions, 4) Why certain design decisions were likely made, 5) Any non-obvious behavior or gotchas. Write for a developer unfamiliar with this codebase." \
  --model gpt-5.5 --sandbox read-only
```

### Error Diagnosis

Framework: TIDD-EC

Diagnose an error message with full context.

```bash
codex exec "Diagnose this error: [error message]. It occurs when running [description] in @./[file]. Stack trace: [stack trace]. Provide: 1) Root cause analysis, 2) Step-by-step fix, 3) How to prevent this error in the future." \
  --model gpt-5.5 --sandbox workspace-write
```

### Session-Based Multi-Step Task

Framework: CRAFT

Orchestrate a complex multi-step task across sessions.

```bash
# Step 1: Begin task, note session ID from output
codex exec "Begin implementing [feature]. Start with the interface design and data model. Stop before writing implementation. Describe the planned approach." \
  --model gpt-5.5 --sandbox workspace-write

# Step 2: Resume and continue
codex resume [session-id]
# Then in the resumed session, continue with next phase

# Or fork to explore an alternative approach
codex fork [session-id]
```

### Research-Then-Implement

Framework: CRISPE + RCAF

Research best practices, then apply them to the codebase.

```bash
# Phase 1: Research
codex exec "Search the web for current best practices for [topic] in [language/framework] as of [date]. Summarize the top 3 recommended approaches with pros and cons." \
  --model gpt-5.5 --search --sandbox read-only

# Phase 2: Implement (use session resume or new exec with research context)
codex exec "Based on best practices for [topic], implement [description] in @./[file]. Use the [approach] pattern. Preserve all existing behavior." \
  --model gpt-5.5 --sandbox workspace-write
```

### Agent-Delegated Ultra-Think

Framework: CRAFT

Use the ultra-think agent for multi-strategy planning.

```bash
codex exec -p ultra-think "Plan the implementation of [feature]. Generate and evaluate at least 3 different approaches. Score each on: correctness, maintainability, performance, and implementation effort. Recommend the best approach with detailed rationale." \
  --model gpt-5.5 -s read-only
```

---

<!-- /ANCHOR:specialized_tasks -->
<!-- ANCHOR:template_variables -->

## 11. TEMPLATE VARIABLES

All placeholders used across templates in this file:

| Variable           | Description                                 | Example Values                                                 |
| ------------------ | ------------------------------------------- | -------------------------------------------------------------- |
| `[file]`           | Relative file path                          | `src/utils/validator.ts`, `lib/api.py`                         |
| `[directory]`      | Project or module directory                 | `./src/`, `./packages/core/`                                   |
| `[description]`    | Free-text description of intent or behavior | `"rate-limiting middleware"`, `"Cannot read property of null"` |
| `[features]`       | List of features or capabilities            | `"auth, logging, caching"`                                     |
| `[requirements]`   | Specific requirements or constraints        | `"must handle 1000 req/s"`, `"readability and testability"`    |
| `[framework]`      | Framework name                              | `React`, `Vue`, `Express`, `FastAPI`, `Jest`, `Vitest`         |
| `[language]`       | Programming language                        | `TypeScript`, `Python`, `Go`, `Rust`                           |
| `[format]`         | Code format or structure type               | `module`, `class`, `component`, `middleware`                   |
| `[date]`           | Date for time-sensitive queries             | `March 2026`, `2026-03-02`                                     |
| `[topic]`          | Research subject or technology name         | `Next.js 15`, `Bun vs Deno`, `React Server Components`         |
| `[package]`        | NPM/Pip/Cargo package name                  | `lodash`, `express`, `django`                                  |
| `[version]`        | Package version specifier                   | `4.17.x`, `^5.0.0`                                             |
| `[error message]`  | Verbatim error text                         | `"Cannot read properties of undefined"`                        |
| `[stack trace]`    | Error stack trace                           | Multi-line stack trace text                                    |
| `[design-file]`    | Path to image mockup or design file         | `./designs/login.png`, `./mockups/dashboard.jpg`               |
| `[screenshot]`     | Path to screenshot image file               | `./screenshots/bug.png`                                        |
| `[session-id]`     | Codex session identifier                    | `abc123def456`                                                 |
| `[base-branch]`    | Git base branch for diff                    | `main`, `develop`                                              |
| `[feature-branch]` | Git feature branch for diff                 | `feature/auth`, `fix/login-bug`                                |

### Placeholder Conventions

- **Single value**: `[file]` - replace with one value
- **List value**: `[features]` - replace with comma-separated list
- **Free text**: `[description]` - replace with natural language
- **Compound**: Some templates use the same placeholder multiple times (e.g., `[language]` for source and target in translation). Replace each occurrence independently.

---

<!-- /ANCHOR:template_variables -->
<!-- ANCHOR:related_resources -->

## 12. RELATED RESOURCES

### Parent

- [SKILL.md](../SKILL.md) - Main skill instructions and invocation patterns

### References

- [cli_reference.md](../references/cli_reference.md) - Complete CLI subcommand and flag reference
- [integration_patterns.md](../references/integration_patterns.md) - Cross-AI orchestration patterns
- [codex_tools.md](../references/codex_tools.md) - Built-in capabilities (/review, --search, MCP, session management)

<!-- /ANCHOR:related_resources -->

<!-- ANCHOR:memory_epilogue -->

## 13. MEMORY EPILOGUE

### Purpose

Append this epilogue to any delegated prompt when the calling AI needs structured session memory back from Codex CLI. The agent will include the delimited section in its output, enabling the calling AI to extract, parse, and save it via `generate-context.js`.

### Epilogue Template

Append the following text to the end of any Codex CLI prompt:

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
[spec-folder-name, e.g. 015-outsourced-agent-handback]
<!-- MEMORY_HANDBACK_END -->
```

### Extraction by Calling AI

After receiving agent output, the calling AI extracts the handback section:

```javascript
const match = output.match(/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/);
```

Then constructs structured JSON and saves via:

```bash
# Redact or scrub secrets before writing the JSON payload
# Write extracted data to JSON
cat > /tmp/save-context-data-<session-id>.json << 'JSONEOF'
{
  "specFolder": "<extracted or provided by calling AI>",
  "user_prompts": [
    "<delegated task or user goal>"
  ],
  "observations": [
    {
      "type": "implementation",
      "title": "<short accomplishment>",
      "narrative": "<what changed and why it matters>",
      "facts": [
        "<verification or durable implementation detail>"
      ]
    }
  ],
  "recent_context": [
    {
      "request": "<delegated task or user goal>",
      "learning": "<durable implementation detail or verification result>"
    }
  ],
  "recentContext": [
    {
      "request": "<compatibility alias for callers still emitting camelCase>",
      "learning": "<same semantics as recent_context>"
    }
  ],
  "FILES": [
    {
      "FILE_PATH": "<extracted path when known>",
      "DESCRIPTION": "<what changed and why it matters>",
      "ACTION": "Modified",
      "MODIFICATION_MAGNITUDE": "small",
      "_provenance": "tool"
    }
  ],
  "sessionSummary": "<extracted summary>",
  "keyDecisions": ["<extracted decisions>"],
  "nextSteps": ["<extracted remaining work>"],
  "triggerPhrases": ["<auto-derived from task>"],
  "toolCalls": [
    {
      "tool": "Read",
      "inputSummary": "<what was inspected>",
      "outputSummary": "<important result>",
      "status": "success"
    }
  ],
  "exchanges": [
    {
      "userInput": "<delegated request>",
      "assistantResponse": "<high-signal response excerpt>",
      "timestamp": "<ISO-8601>"
    }
  ]
}
JSONEOF

# Save via generate-context.js JSON mode
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data-<session-id>.json [spec-folder]
```

Structured JSON is the required save path. You can pass the payload via temp file, `--stdin`, or `--json`; do not call `generate-context.js` with only a spec folder. If `[spec-folder]` is passed on the CLI, that explicit target overrides any payload `specFolder`.

Accepted field names still include documented compatibility aliases such as `sessionSummary` / `session_summary`, `nextSteps` / `next_steps`, `userPrompts` / `user_prompts`, and `recentContext` / `recent_context`. Use the canonical field names shown above for new payloads. Persistence behavior for next-step fields: the first item becomes `Next: ...` and sets `NEXT_ACTION`; additional items become `Follow-up: ...`.

If `/tmp/save-context-data-<session-id>.json` is passed explicitly and cannot be loaded, `generate-context.js` fails with `EXPLICIT_DATA_FILE_LOAD_FAILED: ...`. Do not fall back to OpenCode capture for that error.

Valid JSON can still be rejected after normalization. File-backed handbacks skip stateless alignment and `QUALITY_GATE_ABORT`, but thin payloads fail with `INSUFFICIENT_CONTEXT_ABORT` and cross-spec payloads fail with `CONTAMINATION_GATE_ABORT`.

Minimum viable payload: include a specific `sessionSummary`, at least one meaningful `recent_context` entry or equivalent observation, and `FILES` entries with a descriptive `DESCRIPTION`. Add `ACTION`, `MODIFICATION_MAGNITUDE`, and `_provenance` when known.

<!-- /ANCHOR:memory_epilogue -->

<!-- ANCHOR:model_selection -->

## 14. REASONING EFFORT SELECTION

All templates dispatch `--model gpt-5.5`. Tune `model_reasoning_effort` to the task.

### High Reasoning (architecture, security, planning)

Raise effort to `high` or `xhigh` for tasks that benefit from deeper analysis:

```bash
# Architecture analysis
codex exec "Analyze the architecture of this project. Identify coupling issues, circular dependencies, and scalability concerns." \
  --model gpt-5.5 -c model_reasoning_effort="high" --sandbox read-only

# Security audit
codex exec "Perform a thorough security audit of @./[file]. Check OWASP Top 10, auth bypasses, injection vectors, and cryptographic weaknesses." \
  --model gpt-5.5 -c model_reasoning_effort="high" --sandbox read-only

# Complex planning
codex exec -p ultra-think "Design 3 alternative caching strategies for this API. Score each on correctness, maintainability, and performance." \
  --model gpt-5.5 -c model_reasoning_effort="xhigh" -s read-only
```

### Medium Reasoning (default — code, review, docs)

`medium` is the skill default. Works for code generation, standard review, implementation, and documentation:

```bash
# Code generation
codex exec "Create a [description] in [language]. Requirements: [requirements]. Output complete file." \
  --model gpt-5.5 -c model_reasoning_effort="medium" --sandbox workspace-write

# Standard code review
codex exec "Review @./[file] for bugs, style issues, and edge cases." \
  --model gpt-5.5 -c model_reasoning_effort="medium" --sandbox read-only

# Test generation
codex exec "Generate comprehensive unit tests for @./[file]." \
  --model gpt-5.5 -c model_reasoning_effort="medium" --sandbox workspace-write
```

### Mixed Effort Workflow

Use `high` for analysis, then `medium` for implementation — same model, different depth:

```bash
# Step 1: Deep analysis at high reasoning
codex exec "Identify all security vulnerabilities in @./src/auth/" \
  --model gpt-5.5 -c model_reasoning_effort="high" --sandbox read-only > /tmp/security-findings.txt

# Step 2: Fix at medium reasoning
codex exec "Fix these security issues: $(cat /tmp/security-findings.txt)" \
  --model gpt-5.5 -c model_reasoning_effort="medium" --sandbox workspace-write
```

<!-- /ANCHOR:model_selection -->
