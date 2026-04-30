---
title: "Cross-AI Orchestration Patterns: External AI + Copilot CLI"
description: "Proven patterns for orchestrating GitHub Copilot CLI from external AI sessions, using a conductor/executor model."
---

# Cross-AI Orchestration Patterns: External AI + Copilot CLI

Proven patterns for orchestrating GitHub Copilot CLI from external AI sessions (Gemini, Claude, Codex, etc.).

---

## 1. OVERVIEW

### Core Principle

The calling AI acts as the orchestrator (planner, validator, integrator) while Copilot CLI executes targeted tasks. The calling AI provides the strategy, and Copilot CLI leverages its deep integration with the GitHub ecosystem and local codebase to perform the work.

### Purpose

Each pattern documented here includes the rationale, implementation template, and practical considerations for combining an external AI with Copilot CLI effectively.

### When to Use

- You need Copilot's specific multi-model reasoning (GPT-5.4, Claude Opus 4.6, Gemini 3.1 Pro, etc.)
- You want to offload long-running tasks to GitHub's cloud agents via delegation
- You require surgical code editing with automatic tool execution via `--allow-all-tools`
- You need to enrich context using Copilot's repository-wide symbol indexing
- Cross-AI validation is required to ensure high-stakes code quality

## 2. GENERATE-REVIEW-FIX CYCLE

**The most reliable cross-AI pattern.** The calling AI generates, Copilot reviews, the calling AI fixes.

### Flow

```
Calling AI (generate) --> Copilot CLI (review) --> Calling AI (fix)
```

### Implementation

```bash
# Step 1: Calling AI generates code, saves to /tmp/generated.ts

# Step 2: Copilot CLI reviews
copilot -p "Review the code in /tmp/generated.ts for bugs, security issues, and style violations. Provide findings as a bulleted list with line numbers." \
  --allow-all-tools 2>&1 > /tmp/review.md

# Step 3: Calling AI reads review, applies fixes to /tmp/generated.ts
```

### When to Use

- Critical code paths where a second perspective catches edge cases
- Enforcing project-specific style guides across generated code
- Architecture-heavy tasks that benefit from adversarial review

## 3. CLOUD DELEGATION

**Offload heavy lifting to GitHub's cloud infrastructure.** Use delegation to handle tasks that would otherwise consume local context or compute.

### Flow

```
Calling AI (identifies heavy task) --> Copilot CLI (delegate to cloud) --> Cloud Agent (executes)
```

### Implementation

```bash
# Delegate a complex refactor to the cloud agent
copilot -p "/delegate Refactor the entire @src/legacy/ module to use the new @src/api/v2/ patterns. Ensure all tests pass." \
  --allow-all-tools 2>&1
```

### When to Use

- Massive refactors spanning dozens of files
- Complex migrations (e.g., JS to TS conversion)
- Generating exhaustive test suites for large modules

## 4. PLAN-THEN-EXECUTE

**Separate reasoning from action.** Force Copilot into a planning phase before allowing any file modifications.

### Flow

```
Calling AI (requests plan) --> Copilot (proposes changes) --> Calling AI (approves) --> Copilot (executes)
```

### Implementation

```bash
# Step 1: Request a plan
copilot -p "I need to implement a new caching layer in @src/services/db.ts. Propose a detailed plan including which files will change and what the new architecture looks like. DO NOT modify any files yet." \
  --allow-all-tools 2>&1 > /tmp/plan.md

# Step 2: Calling AI reviews /tmp/plan.md, then triggers execution
copilot -p "Execute the plan described in /tmp/plan.md" \
  --allow-all-tools 2>&1
```

### When to Use

- Complex features where the implementation path is ambiguous
- Changes involving sensitive configurations or database schemas
- Collaborative workflows where the calling AI needs to verify intent

## 5. MULTI-MODEL STRATEGY

**Pick the best model for the task.** Copilot CLI supports 5 recommended models across 3 providers.

### Decision Matrix

| Task Complexity | Recommended Model | Flag |
|----------------|-------------------|------|
| Fast Coding/Review | Claude Sonnet 4.6 | `--model claude-sonnet-4.6` |
| Advanced Code Generation | GPT-5.3-Codex | `--model gpt-5.3-codex` |
| Complex Logic/Reasoning | GPT-5.4 | `--model gpt-5.4` |
| Deep Architecture/Refactor | Claude Opus 4.6 | `--model claude-opus-4.6` |
| Large Context Analysis | Gemini 3.1 Pro | `--model gemini-3.1-pro-preview` |

### Implementation

```bash
# Use GPT-5.4 for complex logic
copilot -p "Solve this performance bottleneck in the recursive tree-walking algorithm: [code]" \
  --model gpt-5.4 --allow-all-tools 2>&1

# Use Sonnet for standard review
copilot -p "Review @src/utils/ for idiomatic TypeScript usage" \
  --model claude-sonnet-4.6 --allow-all-tools 2>&1
```

## 6. STRUCTURED OUTPUT PROCESSING

**Extract machine-readable data for programmatic pipelines.**

### Implementation

```bash
# Extract API endpoints as JSON
copilot -p "Extract all REST API endpoints from @src/routes/ and return them as a valid JSON object with keys: method, path, description." \
  --allow-all-tools 2>&1 > /tmp/api.json

# Extract security vulnerabilities
copilot -p "Audit @src/auth/ and return a JSON array of findings with keys: severity, file, line, description." \
  --allow-all-tools 2>&1 > /tmp/vulns.json
```

### When to Use

- Generating documentation or OpenAPI specs automatically
- Feeding analysis results into other CLI tools (e.g., `jq`)
- Automated security scanning in CI/CD pipelines

## 7. BACKGROUND EXECUTION

**Run Copilot tasks in parallel while the calling AI continues other work.**

### Implementation

```bash
# Start long-running documentation task
copilot -p "Generate JSDoc comments for every function in the @src/ folder" \
  --allow-all-tools 2>&1 > /tmp/docs_log.txt &
COPILOT_PID=$!

# Calling AI continues with other work...

# Wait for completion
wait $COPILOT_PID
```

### When to Use

- Generating large volumes of boilerplate or documentation
- Running deep repository audits while the user/AI focuses on a specific file
- Parallelizing independent feature implementations

## 8. CONTEXT ENRICHMENT

**Leverage repository-wide knowledge.** Use Copilot's ability to reference symbols and files to provide the "full picture."

### Implementation

```bash
# Reference specific files and symbols
copilot -p "Using the patterns established in @src/services/UserService.ts, implement a new @src/services/ProductService.ts. Ensure it implements the IService interface." \
  --allow-all-tools 2>&1

# Search across the codebase
copilot -p "Find all instances where we use the legacy 'Logger' class and propose a migration to the new 'StructuredLogger'." \
  --allow-all-tools 2>&1
```

### When to Use

- Ensuring consistency with existing patterns
- Discovering dependencies before making a change
- Debugging errors that involve multiple service layers

## 9. VALIDATION PIPELINE

**Multi-stage quality gates using Copilot as a specialized validator.**

### Implementation

```bash
# Stage 1: Build check
npm run build

# Stage 2: Copilot Logic Validation
copilot -p "Perform a logic check on the changes in @src/auth/. Ensure there are no race conditions in the token refresh flow." \
  --allow-all-tools 2>&1 > /tmp/logic_check.md

# Stage 3: Copilot Test Generation
copilot -p "Generate unit tests for the edge cases identified in /tmp/logic_check.md" \
  --allow-all-tools 2>&1
```

### When to Use

- Pre-commit hooks or PR preparation
- Verifying complex logic that unit tests might miss
- Automating the "Trust but Verify" workflow for AI-generated code

## 10. CROSS-VALIDATION

**Use multiple AIs to reach consensus on critical code.**

### Implementation

```bash
# Calling AI (e.g. Gemini) generates a solution
# ... saved to /tmp/solution.ts ...

# Copilot CLI (Model A: GPT-5.4) reviews
copilot -p "Critique @/tmp/solution.ts for security" --model gpt-5.4 --allow-all-tools 2>&1 > /tmp/review_1.md

# Copilot CLI (Model B: Claude Opus 4.6) reviews
copilot -p "Critique @/tmp/solution.ts for performance" --model claude-opus-4.6 --allow-all-tools 2>&1 > /tmp/review_2.md

# Calling AI synthesizes both reviews to produce the final version
```

### When to Use

- High-stakes security modules (encryption, auth)
- Core architectural components
- Performance-critical hot paths

## 11. ANTI-PATTERNS

### Don't Do These

| Anti-Pattern | Problem | Better Approach |
|-------------|---------|-----------------|
| **Blind `--allow-all-tools`** | May perform destructive actions without oversight | Use a Plan-Then-Execute flow for sensitive tasks |
| **Vague Prompts** | "Fix the app" leads to context explosion and hallucinations | Target specific files/symbols with `@` |
| **Nesting Invocations** | Running `copilot` inside a `copilot` shell | Keep orchestrator (Calling AI) and executor (CLI) separate |
| **Ignoring Model Tiers** | Using GPT-5.4 for simple formatting | Use Claude Sonnet 4.6 for fast tasks to save cost/latency |
| **Missing `2>&1`** | Errors are sent to stderr and may be lost in logs | Always capture stderr to diagnose tool failures |
| **Context Overload** | Passing too many files at once | Focus on the minimal set of files required for the task |
| **Skipping Local Checks** | Trusting AI over compiler errors | Always run local build/lint/test alongside AI checks |

