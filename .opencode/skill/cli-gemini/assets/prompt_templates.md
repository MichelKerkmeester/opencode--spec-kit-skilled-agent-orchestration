---
title: Prompt Templates
description: Copy-paste ready prompt templates for common Gemini CLI tasks organized by category with placeholders and examples.
---

# Prompt Templates - Gemini CLI

Copy-paste ready prompt templates for common Gemini CLI tasks. Replace `[placeholders]` with your values.

---

## 1. OVERVIEW

### Purpose

This asset provides structured, copy-paste ready prompt templates for invoking Gemini CLI across common development tasks. Each template includes the full command with flags, placeholder variables, and a concrete example.

### Usage

1. Find the template category matching your task
2. Copy the command
3. Replace `[placeholders]` with actual values
4. Run in your terminal or via Bash tool

### Flag Reference

| Flag | Purpose |
|------|---------|
| `--yolo` or `-y` | Auto-approve all tool calls (file writes, shell commands) |
| `-o text` | Human-readable output (default for most tasks) |
| `-o json` | Structured output with stats |
| `-m model` | Model selection: use `gemini-3.1-pro-preview` (only supported model) |
| `@./path` | Include file content in prompt |

---

## 2. CODE GENERATION

### Single-File Application

Framework: RCAF

Generate a complete single-file application from a description.

```bash
gemini "Create a [description] application in [language]. Requirements: [requirements]. Output a single complete file with all imports, error handling, and comments. Start immediately." --yolo -o text
```

**Example:**

```bash
gemini "Create a REST API server application in TypeScript. Requirements: Express framework, CRUD endpoints for a 'tasks' resource, input validation with Zod, error middleware, health check endpoint. Output a single complete file with all imports, error handling, and comments. Start immediately." --yolo -o text
```

### Multi-File Project

Framework: RCAF

Generate a multi-file project structure with coordinated files.

```bash
gemini "Create a [description] project in [language] with the following structure: [features]. Generate all files including entry point, modules, configuration, and package manifest. Write files to [directory]. Start immediately." --yolo -o text
```

**Example:**

```bash
gemini "Create a CLI tool project in TypeScript with the following structure: command parser with yargs, config loader from YAML, logger module with levels, and main entry point. Generate all files including entry point, modules, configuration, and package manifest. Write files to ./src/cli-tool/. Start immediately." --yolo -o text
```

### Component / Module

Framework: RCAF

Generate a single component or module that fits into an existing codebase.

```bash
gemini "Create a [language] [format] for [description]. Follow the patterns used in @./[file]. Include types, exports, error handling, and JSDoc comments. Output only the code." -o text
```

**Example:**

```bash
gemini "Create a TypeScript module for rate-limiting middleware with sliding window algorithm. Follow the patterns used in @./src/middleware/auth.ts. Include types, exports, error handling, and JSDoc comments. Output only the code." -o text
```

---

## 3. CODE REVIEW

### Comprehensive Review

Framework: TIDD-EC

Full code review covering correctness, style, maintainability, and performance.

```bash
gemini "Review @./[file] thoroughly. Check for: 1) Logic errors and edge cases, 2) Code style and naming consistency, 3) Error handling completeness, 4) Performance issues, 5) Maintainability concerns. For each issue found, provide the line reference, severity (critical/warning/info), and a suggested fix." -o text
```

### Security-Focused Review

Framework: TIDD-EC

Review focused on security vulnerabilities and attack surfaces.

```bash
gemini "Perform a security audit of @./[file]. Check for: 1) Injection vulnerabilities (SQL, XSS, command injection), 2) Authentication and authorization flaws, 3) Sensitive data exposure (hardcoded secrets, logging PII), 4) Input validation gaps, 5) Insecure dependencies or patterns, 6) eval() or dynamic code execution. Rate each finding as critical/high/medium/low severity." -o text
```

### Performance Review

Framework: TIDD-EC

Review focused on performance bottlenecks and optimization opportunities.

```bash
gemini "Analyze @./[file] for performance issues. Check for: 1) Unnecessary re-renders or recomputations, 2) Memory leaks (unclosed handles, growing collections), 3) N+1 query patterns, 4) Missing caching opportunities, 5) Blocking operations in async contexts, 6) Algorithmic complexity concerns. Suggest concrete optimizations with expected impact." -o text
```

---

## 4. BUG FIXING

### Fix Identified Bugs

Framework: RCAF + TIDD-EC

Fix a known bug with description and reproduction context.

```bash
gemini "Fix this bug in @./[file]: [description]. The expected behavior is [requirements]. The actual behavior is [description]. Apply the minimal fix without refactoring unrelated code. Explain the root cause and the fix. Start immediately." --yolo -o text
```

### Auto-Detect and Fix

Framework: RCAF + TIDD-EC

Let Gemini scan a file for potential bugs and apply fixes.

```bash
gemini "Scan @./[file] for bugs. Look for: null/undefined access, off-by-one errors, race conditions, unhandled promise rejections, incorrect type coercions, resource leaks, and logic errors. For each bug found: describe the issue, show the fix, and explain why it is a bug. Apply all fixes. Start immediately." --yolo -o text
```

---

## 5. TEST GENERATION

### Unit Tests

Framework: RCAF

Generate unit tests for a specific file or module.

```bash
gemini "Generate comprehensive [framework] unit tests for @./[file]. Cover: 1) Happy path for each exported function, 2) Edge cases (empty input, null, boundary values), 3) Error conditions and thrown exceptions, 4) Mock external dependencies. Use describe/it blocks with descriptive names. Output a complete test file." --yolo -o text
```

**Example (Jest):**

```bash
gemini "Generate comprehensive Jest unit tests for @./src/utils/validator.ts. Cover: 1) Happy path for each exported function, 2) Edge cases (empty input, null, boundary values), 3) Error conditions and thrown exceptions, 4) Mock external dependencies. Use describe/it blocks with descriptive names. Output a complete test file." --yolo -o text
```

### Integration Tests

Framework: RCAF

Generate integration tests that test multiple components working together.

```bash
gemini "Generate [framework] integration tests for the [description] workflow. Test files involved: @./[file]. Cover: 1) End-to-end happy path, 2) Error propagation across layers, 3) Database/API interaction patterns, 4) Setup and teardown for test isolation. Write the complete test file." --yolo -o text
```

---

## 6. DOCUMENTATION

### JSDoc / TSDoc Generation

Framework: RCAF

Add inline documentation to source code.

```bash
gemini "Add complete JSDoc documentation to @./[file]. For every exported function, class, method, and type: add description, @param with types and descriptions, @returns, @throws, and @example where useful. Preserve all existing code unchanged. Apply changes to the file. Start immediately." --yolo -o text
```

### README Generation

Framework: RCAF

Generate a project or module README from source code.

```bash
gemini "Generate a comprehensive README.md for the project in [directory]. Analyze the source code and include: 1) Project title and description, 2) Installation instructions, 3) Usage examples with code snippets, 4) API reference for public interfaces, 5) Configuration options, 6) Contributing guidelines placeholder. Output as markdown." -o text
```

### API Documentation

Framework: RCAF

Generate API documentation from route definitions or endpoint handlers.

```bash
gemini "Generate API documentation for @./[file]. For each endpoint: document the HTTP method, path, request parameters, request body schema, response schema with status codes, authentication requirements, and provide a curl example. Output as markdown." -o text
```

---

## 7. CODE TRANSFORMATION

### Refactoring

Framework: RCAF + TIDD-EC

Refactor code for improved structure without changing behavior.

```bash
gemini "Refactor @./[file] to [description]. Requirements: 1) Preserve all existing behavior exactly, 2) Improve [requirements], 3) Add no new dependencies. Show the complete refactored file. Apply changes. Start immediately." --yolo -o text
```

### Language Translation

Framework: RCAF + TIDD-EC

Translate code from one language to another.

```bash
gemini "Translate @./[file] from [language] to [language]. Requirements: 1) Preserve all logic and behavior, 2) Use idiomatic [language] patterns, 3) Translate types and error handling to [language] equivalents, 4) Include equivalent imports/dependencies. Output the complete translated file." -o text
```

### Framework Migration

Framework: RCAF + TIDD-EC

Migrate code from one framework to another.

```bash
gemini "Migrate @./[file] from [framework] to [framework]. Requirements: 1) Preserve all functionality, 2) Use idiomatic [framework] patterns, 3) Update lifecycle methods and hooks, 4) Translate state management approach, 5) List any new dependencies needed. Output the complete migrated file." -o text
```

---

## 8. WEB RESEARCH

### Current Information

Framework: CRISPE

Fetch up-to-date information using Google Search grounding.

```bash
gemini "Use Google Search to find current information about [topic] as of [date]. Provide: 1) Latest version or status, 2) Recent changes or announcements, 3) Links to official sources. Cite your sources." -o text
```

### Library / API Research

Framework: CRISPE

Research a specific library, API, or technology.

```bash
gemini "Use Google Search to research [topic]. Find: 1) Current stable version and release date, 2) Installation instructions, 3) Key API changes in recent versions, 4) Known issues or deprecations, 5) Community adoption and alternatives. Cite official documentation." -o text
```

### Comparison Research

Framework: CRISPE

Compare technologies, libraries, or approaches.

```bash
gemini "Use Google Search to compare [topic] vs [topic] as of [date]. Compare on: 1) Performance benchmarks, 2) Bundle size and dependencies, 3) Community support and maintenance activity, 4) Feature set differences, 5) Migration effort from one to the other. Cite sources for all claims." -o text
```

---

## 9. ARCHITECTURE ANALYSIS

### Project Analysis

Framework: CRAFT

Analyze overall project architecture and structure.

```bash
gemini "Use codebase_investigator to analyze the project in [directory]. Provide: 1) High-level architecture overview, 2) Key modules and their responsibilities, 3) Dependency graph between major components, 4) Entry points and data flow, 5) Technology stack summary. Output as structured markdown." -o text
```

### Dependency Analysis

Framework: CRAFT

Map dependencies and identify coupling issues.

```bash
gemini "Use codebase_investigator to analyze dependencies in [directory]. Identify: 1) Direct and transitive dependency chains, 2) Circular dependencies, 3) Tightly coupled modules, 4) Unused imports or dead code paths, 5) Dependency inversion violations. Suggest concrete decoupling strategies." -o text
```

---

## 10. SPECIALIZED TASKS

### Git Commit Message

Framework: RCAF

Generate a commit message from staged changes.

```bash
gemini "Based on the following git diff, write a commit message following Conventional Commits format (type(scope): description). Include a body explaining why the change was made. Diff: $(git diff --cached)" -m gemini-3.1-pro-preview -o text
```

### Code Explanation

Framework: CRAFT

Get a detailed explanation of unfamiliar code.

```bash
gemini "Explain @./[file] in detail. Cover: 1) What the code does at a high level, 2) Key algorithms or patterns used, 3) How data flows through the functions, 4) Why certain design decisions were likely made, 5) Any non-obvious behavior or gotchas. Write for a developer unfamiliar with this codebase." -o text
```

### Error Diagnosis

Framework: TIDD-EC

Diagnose an error message with full context.

```bash
gemini "Diagnose this error: [description]. It occurs when running [description] in @./[file]. Stack trace: [description]. Provide: 1) Root cause analysis, 2) Step-by-step fix, 3) How to prevent this error in the future." -o text
```

---

## 11. TEMPLATE VARIABLES

All placeholders used across templates in this file:

| Variable | Description | Example Values |
|----------|-------------|----------------|
| `[file]` | Relative file path | `src/utils/validator.ts`, `lib/api.py` |
| `[directory]` | Project or module directory | `./src/`, `./packages/core/` |
| `[description]` | Free-text description of intent or behavior | `"rate-limiting middleware"`, `"Cannot read property of null"` |
| `[features]` | List of features or capabilities | `"auth, logging, caching"` |
| `[requirements]` | Specific requirements or constraints | `"must handle 1000 req/s"`, `"readability and testability"` |
| `[framework]` | Framework name | `React`, `Vue`, `Express`, `FastAPI`, `Jest`, `Vitest` |
| `[language]` | Programming language | `TypeScript`, `Python`, `Go`, `Rust` |
| `[format]` | Code format or structure type | `module`, `class`, `component`, `middleware` |
| `[date]` | Date for time-sensitive queries | `March 2026`, `2026-03-17` |
| `[topic]` | Research subject or technology name | `Next.js 15`, `Bun vs Deno`, `React Server Components` |

### Placeholder Conventions

- **Single value**: `[file]` - replace with one value
- **List value**: `[features]` - replace with comma-separated list
- **Free text**: `[description]` - replace with natural language
- **Compound**: Some templates use the same placeholder multiple times for different values (e.g., `[language]` for source and target in translation). Replace each occurrence independently.

---

## 12. RELATED RESOURCES

### Parent

- [SKILL.md](../SKILL.md) - Main skill instructions and invocation patterns

### References

- [cli_reference.md](../references/cli_reference.md) - Complete CLI flag and command reference
- [integration_patterns.md](../references/integration_patterns.md) - Cross-AI orchestration patterns
- [gemini_tools.md](../references/gemini_tools.md) - Built-in tools (google_web_search, codebase_investigator)

## 13. MEMORY EPILOGUE

### Purpose

Append this epilogue to any delegated prompt when the calling AI needs structured session memory back from Gemini CLI. The agent will include the delimited section in its output, enabling the calling AI to extract, parse, and save it via `generate-context.js`.

### Epilogue Template

Append the following text to the end of any Gemini CLI prompt:

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
# Redact or scrub secrets before sending the JSON payload
JSON_PAYLOAD=$(cat <<'JSONEOF'
{
  "specFolder": "<extracted or provided by calling AI>",
  "sessionSummary": "<extracted summary>",
  "filesModified": [
    {
      "path": "<extracted path>",
      "action": "modify",
      "description": "<what changed and why it matters>"
    }
  ],
  "FILES": [
    {
      "FILE_PATH": "<extracted path when known>",
      "DESCRIPTION": "<what changed and why it matters>",
      "ACTION": "modify",
      "MODIFICATION_MAGNITUDE": "small",
      "_provenance": "tool"
    }
  ],
  "keyDecisions": [
    {
      "decision": "<extracted decision>",
      "rationale": "<why it was chosen>"
    }
  ],
  "nextSteps": ["<extracted remaining work>"],
  "triggerPhrases": ["<auto-derived from task>"],
  "user_prompts": [
    {
      "prompt": "<delegated ask>",
      "timestamp": "<ISO-8601>"
    }
  ],
  "observations": [
    {
      "type": "implementation",
      "title": "Delegation summary",
      "narrative": "<high-signal summary of what happened>",
      "timestamp": "<ISO-8601>",
      "files": ["<extracted path>"],
      "facts": ["<durable fact or verification result>"]
    }
  ],
  "recent_context": [
    {
      "request": "<user goal or delegated ask>",
      "learning": "<durable implementation detail or verification result>",
      "completed": "<what finished>",
      "date": "<ISO-8601>"
    }
  ],
  "recentContext": [
    {
      "request": "<compatibility alias for callers still emitting camelCase>",
      "learning": "<same semantics as recent_context>"
    }
  ],
  "toolCalls": [
    {
      "tool": "gemini",
      "inputSummary": "<prompt summary>",
      "outputSummary": "<result summary>",
      "status": "success"
    }
  ]
}
JSONEOF
)

# Preferred: structured stdin mode
printf '%s' "$JSON_PAYLOAD" | node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin [spec-folder]

# Also valid for compact payloads
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json "$JSON_PAYLOAD" [spec-folder]

# Also valid for larger payloads that are easier to stage on disk
printf '%s\n' "$JSON_PAYLOAD" > /tmp/save-context-data-<session-id>.json
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data-<session-id>.json [spec-folder]
```

The structured contract prefers `specFolder`, `user_prompts`, `observations`, `recent_context`, and optional `toolCalls`, `exchanges`, `preflight`, and `postflight`. Convenience fields such as `sessionSummary`, `filesModified`, `keyDecisions`, `triggerPhrases`, and `nextSteps` are still accepted and normalized. Documented snake_case equivalents such as `session_summary`, `files_modified`, `trigger_phrases`, `recent_context`, and `next_steps` also work. Persistence behavior for next-step fields: the first item becomes `Next: ...` and sets `NEXT_ACTION`; additional items become `Follow-up: ...`.

If both the payload and the CLI specify a spec folder, the explicit CLI target wins.

If `/tmp/save-context-data-<session-id>.json` is passed explicitly and cannot be loaded, `generate-context.js` fails with `EXPLICIT_DATA_FILE_LOAD_FAILED: ...`. Surface the error and fix the path or payload before retrying.

Valid JSON can still be rejected after normalization. Thin payloads fail with `INSUFFICIENT_CONTEXT_ABORT`, and cross-spec payloads fail with `CONTAMINATION_GATE_ABORT`.

Minimum viable payload: include a specific summary, at least one meaningful `recent_context` entry, at least one useful observation, and `FILES` entries with a descriptive `DESCRIPTION`. Add `ACTION`, `MODIFICATION_MAGNITUDE`, `_provenance`, and `toolCalls` when known.

