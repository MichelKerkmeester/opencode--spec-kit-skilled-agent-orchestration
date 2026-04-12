---
title: "Cross-AI Orchestration Patterns: Calling AI + Codex CLI"
description: "Proven patterns for orchestrating Codex CLI from any AI assistant session, including implementation templates and practical considerations."
---

# Cross-AI Orchestration Patterns: Calling AI + Codex CLI

Proven patterns for orchestrating Codex CLI from any AI assistant session.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Core Principle

The calling AI acts as the orchestrator (planner, validator, integrator) while Codex CLI executes targeted tasks. The value comes from combining different model perspectives and leveraging Codex's sandbox-controlled execution, not from redundant work.

### Purpose

Each pattern documented here includes the rationale, implementation template, and practical considerations for combining the calling AI with Codex CLI effectively.

### When to Use

- You need a second AI perspective on generated code, architecture, or security
- Codex's strengths (sandbox isolation, `xhigh` reasoning, web search via `--search`) complement the calling AI's strengths
- You want to run parallel AI tasks while the calling AI continues working
- Complex workflows benefit from structured, multi-stage generation and validation
- You need controlled file modification with sandbox-enforced safety boundaries

<!-- /ANCHOR:overview -->

<!-- ANCHOR:generate-review-fix-cycle -->

## 2. GENERATE-REVIEW-FIX CYCLE

**The most reliable cross-AI pattern.** One AI generates, the other reviews, then the original fixes.

### Flow

```
Calling AI (plan) --> Codex CLI (generate) --> Calling AI (review) --> Codex CLI (fix)
```

### Implementation

```bash
# Step 1: Codex generates the code
codex exec \
  "Create a rate limiter middleware for Express with sliding window algorithm. Output only the code, no explanation." \
  --sandbox workspace-write --model gpt-5.3-codex > /tmp/rate-limiter.ts

# Step 2: Calling AI reviews (done within the calling AI session)
# Read /tmp/rate-limiter.ts, identify issues, write review to /tmp/review.md

# Step 3: Codex fixes based on review
codex exec \
  "@/tmp/rate-limiter.ts Fix these issues: $(cat /tmp/review.md)" \
  --sandbox workspace-write --model gpt-5.3-codex > /tmp/rate-limiter-v2.ts
```

### When to Use

- Code generation tasks where a second perspective catches edge cases
- Complex algorithms where verification matters more than speed
- Architecture decisions that benefit from adversarial review

### Considerations

- Always validate the final output yourself (neither AI is infallible)
- Keep the review focused: bullet points of specific issues, not general feedback
- Limit to 2 fix cycles maximum; diminishing returns beyond that

<!-- /ANCHOR:generate-review-fix-cycle -->

<!-- ANCHOR:json-output-processing -->

## 3. JSON OUTPUT PROCESSING

**Extract structured data from Codex for programmatic use in the calling AI's workflows.**

### Implementation

```bash
# Request JSON explicitly in the prompt (Codex has no --output json flag)
codex exec \
  "Analyze src/auth.ts and return JSON with: {functions: [{name, params, returnType, complexity}], issues: [{line, severity, description}]}" \
  --sandbox read-only --model gpt-5.3-codex > /tmp/analysis.json

# Parse with jq
jq '.issues[] | select(.severity == "high")' /tmp/analysis.json

# Parse with Node.js
node -e "
const fs = require('fs');
const raw = fs.readFileSync('/tmp/analysis.json', 'utf8');
// Codex outputs plain text; extract JSON from markdown code blocks if present
const jsonMatch = raw.match(/\`\`\`json\n([\s\S]*?)\n\`\`\`/) || raw.match(/(\{[\s\S]*\})/);
if (jsonMatch) {
  const parsed = JSON.parse(jsonMatch[1]);
  parsed.issues.filter(i => i.severity === 'high').forEach(i => {
    console.log(\`Line \${i.line}: \${i.description}\`);
  });
}
"
```

### Output Notes

Unlike Gemini CLI (which has a native `--output json` wrapper), Codex outputs plain text to stdout. When requesting JSON:

- The model may wrap JSON in a markdown code block (` ```json ... ``` `)
- Strip the code fence before parsing with `jq` or `JSON.parse`
- Use explicit prompt instructions: "Return only raw JSON with no explanation or code fences."

```bash
# Prompt that avoids code fences
codex exec \
  "Analyze src/auth.ts. Return ONLY raw JSON (no markdown, no explanation): {issues: [{line, severity, description}]}" \
  --sandbox read-only --model gpt-5.3-codex > /tmp/analysis.json

jq '.issues' /tmp/analysis.json
```

### When to Use

- Extracting metrics, function signatures, or dependency lists
- Feeding Codex analysis into the calling AI's decision logic
- Building automated pipelines that branch on structured output

<!-- /ANCHOR:json-output-processing -->

<!-- ANCHOR:background-execution -->

## 4. BACKGROUND EXECUTION

**Run Codex tasks in parallel while the calling AI continues working.**

### Implementation

```bash
# Launch multiple Codex tasks in background
codex exec "Review src/api/ for security vulnerabilities. Return JSON." \
  --sandbox read-only --model gpt-5.3-codex > /tmp/security-review.txt 2>&1 &
PID1=$!

codex exec "Generate unit tests for src/utils.ts" \
  --sandbox workspace-write --model gpt-5.3-codex > /tmp/generated-tests.ts 2>&1 &
PID2=$!

# Calling AI continues other work...

# Wait for specific task
wait $PID1
echo "Security review complete"
cat /tmp/security-review.txt | head -20

# Wait for all
wait $PID1 $PID2
echo "All Codex tasks complete"
```

### Monitoring

```bash
# Check if still running
kill -0 $PID1 2>/dev/null && echo "Still running" || echo "Complete"

# Check output size (proxy for progress)
wc -c /tmp/security-review.txt

# Tail streaming output
tail -f /tmp/generated-tests.ts
```

### When to Use

- Independent tasks that do not depend on each other
- Long-running analysis while the calling AI handles quick edits
- Generating multiple artifacts simultaneously (tests, docs, types)

### Considerations

- Always redirect stderr: `2>&1` to capture errors alongside output
- Set reasonable timeouts: `timeout 120 codex exec ...` to prevent hung processes
- Do not background tasks with `--sandbox workspace-write` or higher that write to the same files (race conditions)
- Background `--sandbox read-only` tasks are safe to parallelize freely

### False-Completion Trap When Launching from Another AI's Bash Tool

When an orchestrating AI (Claude Code, Copilot, etc.) uses its `Bash` tool to launch `codex exec ... &`, the shell command returns exit 0 immediately because the `&` backgrounds the process and the parent shell exits. The orchestrating AI's task system reports "completed" even though the codex process is still running.

**Symptom:** All 5 parallel codex sessions "complete" in under 2 seconds. Output files are empty or missing.

**Root cause:** The Bash tool wraps the command in a subshell. `codex exec ... &` forks the process, the subshell exits, and the task system sees exit 0.

```bash
# BAD: Reports instant "completion" to the orchestrator
codex exec "..." --full-auto -o /tmp/result.txt &
echo "PID: $!"
# Shell exits immediately. Orchestrator thinks task is done.

# GOOD: Let the Bash tool wait for codex to finish
codex exec "..." --full-auto -o /tmp/result.txt
# Bash tool blocks until codex completes. Use run_in_background on the Bash call itself.
```

**Correct pattern for parallel codex from an orchestrating AI:**
1. Launch each `codex exec` as a separate `Bash` call (no `&` suffix)
2. Set `run_in_background: true` on each Bash tool call — this backgrounds the *tool call*, not the shell process
3. The orchestrator gets notified when each codex process genuinely finishes
4. Verify output files exist and have content before reading results

<!-- /ANCHOR:background-execution -->

<!-- ANCHOR:model-selection-strategy -->

## 5. MODEL SELECTION STRATEGY

**Codex CLI supports 2 models. Choose based on task type.**

### Decision Matrix

| Task Type | Recommended Model | Flag | Rationale |
|-----------|-------------------|------|-----------|
| Architecture analysis | `gpt-5.4` | `--model gpt-5.4` | Frontier reasoning for complex analysis |
| Security audit | `gpt-5.4` | `--model gpt-5.4` | Deep reasoning catches subtle patterns |
| Complex planning | `gpt-5.4` | `--model gpt-5.4` | Multi-strategy evaluation |
| Research synthesis | `gpt-5.4` | `--model gpt-5.4` | Better synthesis of findings |
| Code generation | `gpt-5.3-codex` | `--model gpt-5.3-codex` | Optimized for code output |
| Standard review | `gpt-5.3-codex` | `--model gpt-5.3-codex` | Efficient pattern-based review |
| Implementation | `gpt-5.3-codex` | `--model gpt-5.3-codex` | Code-focused with xhigh reasoning |
| Test generation | `gpt-5.3-codex` | `--model gpt-5.3-codex` | Better test structure output |
| Documentation | `gpt-5.3-codex` | `--model gpt-5.3-codex` | Efficient structured generation |

### Strength Comparison

| Dimension | GPT-5.4 | GPT-5.3-Codex |
|-----------|---------|---------------|
| Reasoning depth | Frontier (configurable via `-c model_reasoning_effort`) | High (xhigh fixed) |
| Code generation | Strong | Optimized |
| Architecture analysis | Best choice | Good |
| Security reasoning | Best choice | Good |
| Speed | Slower (deeper reasoning) | Faster |
| Cost | Higher | Lower |

### Implementation

```bash
# GPT-5.4 for reasoning-heavy tasks
codex exec "Review the authentication architecture for security gaps" \
  --sandbox read-only --model gpt-5.4

codex exec "Plan the migration from REST to GraphQL" \
  --sandbox read-only --model gpt-5.4

# GPT-5.3-Codex for code-focused tasks
codex exec "Write tests for utils.ts" \
  --sandbox workspace-write --model gpt-5.3-codex

codex exec "Generate a rate limiter middleware" \
  --sandbox workspace-write --model gpt-5.3-codex

# Mixed workflow: analyze with 5.4, implement with 5.3-Codex
codex exec "Analyze src/ for N+1 query patterns" \
  --sandbox read-only --model gpt-5.4 > /tmp/analysis.txt

codex exec "Fix the N+1 patterns identified: $(cat /tmp/analysis.txt)" \
  --sandbox workspace-write --model gpt-5.3-codex
```

### Why Explicit Model Specification Matters

- Omitting `--model` relies on the CLI default, which may change across Codex CLI versions
- Explicit specification ensures reproducible behavior in scripts and CI/CD pipelines
- The model can also be set in `.codex/config.toml` as a project-level default

```toml
# .codex/config.toml — sets default for all invocations
model = "gpt-5.3-codex"
model_reasoning_effort = "xhigh"
```

<!-- /ANCHOR:model-selection-strategy -->

<!-- ANCHOR:sandbox-strategy -->

## 6. SANDBOX STRATEGY

**Choose the least-permissive sandbox that allows the task to succeed.**

### Decision Flow

```
Task type?
  |
  +-- Analysis / review / exploration --> read-only
  |
  +-- Code generation / refactoring --> workspace-write
  |
  +-- System operations / migrations --> danger-full-access
                                          (+ --ask-for-approval untrusted)
```

### Implementation by Task Type

```bash
# Analysis: read-only
codex exec "Identify all N+1 query patterns in src/" \
  --sandbox read-only --model gpt-5.3-codex

# Code generation: workspace-write
codex exec "Add retry logic to all API calls in src/api/" \
  --sandbox workspace-write --model gpt-5.3-codex

# System migration: danger-full-access with explicit approval
codex exec "Migrate the database schema from v1 to v2" \
  --sandbox danger-full-access \
  --ask-for-approval untrusted \
  --model gpt-5.3-codex

# Preview before committing: read-only first, workspace-write after review
codex exec "List all files that would be changed by the auth refactor" \
  --sandbox read-only --model gpt-5.3-codex > /tmp/files-to-change.txt
# Review /tmp/files-to-change.txt, then proceed:
codex exec "@/tmp/files-to-change.txt Apply the auth refactor to these files" \
  --sandbox workspace-write --model gpt-5.3-codex
```

### Sandbox Combinations to Avoid

| Combination | Risk | Better Approach |
|-------------|------|-----------------|
| `danger-full-access` + `never` approval | Unrestricted, unreviewed changes | Pair with `untrusted` approval |
| `workspace-write` + blind background | Parallel writes to same files | Use `read-only` for parallel background tasks |
| `workspace-write` for pure analysis | Unnecessary permissions | Use `read-only`; it's sufficient for analysis |

<!-- /ANCHOR:sandbox-strategy -->

<!-- ANCHOR:context-enrichment -->

## 7. CONTEXT ENRICHMENT

**Provide Codex with rich context for better results.**

### @file References

```bash
# Single file context
codex exec "@src/database.ts Refactor to use the repository pattern" \
  --sandbox workspace-write --model gpt-5.3-codex

# Multiple files for cross-file understanding
codex exec "@src/auth.ts @src/user.ts @src/session.ts These files have a circular dependency. Fix it." \
  --sandbox workspace-write --model gpt-5.3-codex
```

### Project Context via instructions.md

Create `.codex/instructions.md` to persist context across all Codex sessions:

```markdown
# Project Context

## Architecture
- TypeScript monorepo, Express.js + PostgreSQL (Prisma ORM)
- JWT authentication with refresh token rotation

## Conventions
- Functional style; avoid classes except for Error types
- All public exports must have JSDoc
- Use Result<T, E> pattern for error handling

## Do Not
- Modify prisma/schema.prisma without explicit instruction
- Add npm dependencies without justification
```

### Explicit Context Injection

```bash
# Inject the calling AI's analysis as context
CLAUDE_ANALYSIS="The bug is in the token refresh logic. The refresh token
is not being rotated on use, allowing token replay attacks."

codex exec \
  "@src/auth/tokens.ts Fix this security issue. Context from prior analysis: $CLAUDE_ANALYSIS" \
  --sandbox workspace-write --model gpt-5.3-codex
```

### Web Search for Current Information

```bash
# Enable live web browsing with --search
codex exec --search \
  "Research the current best practices for refresh token rotation in Express.js. Implement the recommended pattern in src/auth/tokens.ts" \
  --sandbox workspace-write --model gpt-5.3-codex
```

<!-- /ANCHOR:context-enrichment -->

<!-- ANCHOR:validation-pipeline -->

## 8. VALIDATION PIPELINE

**Multi-stage validation of Codex-generated output.**

### Implementation

```bash
# Stage 1: Generate
codex exec "Create a webhook handler for Stripe events" \
  --sandbox workspace-write --model gpt-5.3-codex > /tmp/webhook.ts

# Stage 2: Syntax check
npx tsc --noEmit /tmp/webhook.ts 2>/tmp/syntax-errors.txt
if [ $? -ne 0 ]; then
  codex exec \
    "@/tmp/webhook.ts Fix these TypeScript errors: $(cat /tmp/syntax-errors.txt)" \
    --sandbox workspace-write --model gpt-5.3-codex > /tmp/webhook-fixed.ts
  cp /tmp/webhook-fixed.ts /tmp/webhook.ts
fi

# Stage 3: Security scan
codex exec \
  "@/tmp/webhook.ts Audit this code for security issues. Focus on: input validation, injection attacks, authentication bypasses. Return JSON: {issues: [{severity, line, description, fix}]}" \
  --sandbox read-only --model gpt-5.3-codex > /tmp/security-scan.txt

# Stage 4: Functional check (calling AI reviews the result)
# Read /tmp/webhook.ts and /tmp/security-scan.txt within the calling AI

# Stage 5: Style alignment
codex exec \
  "@/tmp/webhook.ts Reformat to match project conventions. Functional style, Result<T,E> error handling, JSDoc on exports." \
  --sandbox workspace-write --model gpt-5.3-codex > /tmp/webhook-final.ts
```

### Pipeline Stages (Recommended Order)

| Stage | Purpose | Tool |
|-------|---------|------|
| 1. Generate | Create initial artifact | Codex (`gpt-5.3-codex`, `workspace-write`) |
| 2. Syntax | Verify it compiles/parses | Language toolchain (tsc, eslint, etc.) |
| 3. Security | Check for vulnerabilities | Codex (`gpt-5.3-codex`, `read-only`) |
| 4. Functional | Verify correctness | Calling AI review or tests |
| 5. Style | Match project conventions | Codex (`gpt-5.3-codex`, `workspace-write`) |

### When to Use

- Any generated code that will be committed to the repository
- Security-sensitive code (auth, payments, data handling)
- Code that lacks test coverage

<!-- /ANCHOR:validation-pipeline -->

<!-- ANCHOR:incremental-refinement -->

## 9. INCREMENTAL REFINEMENT

**Build complex artifacts in stages, verifying each stage before proceeding.**

### Implementation

```bash
# Stage 1: Type definitions (read-only analysis + workspace-write output)
codex exec \
  "Create the type definitions and function signatures for a task queue system. Types only, no implementation. Export all types." \
  --sandbox workspace-write --model gpt-5.3-codex > src/task-queue/types.ts

# Verify stage 1
npx tsc --noEmit src/task-queue/types.ts

# Stage 2: Core implementation
codex exec \
  "@src/task-queue/types.ts Implement the core TaskQueue class using these types. Handle enqueue, dequeue, retry with exponential backoff." \
  --sandbox workspace-write --model gpt-5.3-codex > src/task-queue/queue.ts

# Verify stage 2
npx tsc --noEmit src/task-queue/queue.ts

# Stage 3: Tests
codex exec \
  "@src/task-queue/types.ts @src/task-queue/queue.ts Write comprehensive tests for the TaskQueue. Cover: enqueue, dequeue, retry logic, concurrency limits, error handling." \
  --sandbox workspace-write --model gpt-5.3-codex > src/task-queue/__tests__/queue.test.ts

# Verify stage 3
npx jest src/task-queue/__tests__/queue.test.ts
```

### Stage Progression Rules

1. Never proceed to the next stage if the current stage has errors.
2. Each stage gets the output of all previous stages as `@file` context.
3. Keep stages small enough that they can be fully reviewed.
4. Use `gpt-5.3-codex` for all stages.

### When to Use

- Building new modules or subsystems from scratch
- Complex features with multiple interacting components
- When you want to maintain control over architectural decisions at each step

<!-- /ANCHOR:incremental-refinement -->

<!-- ANCHOR:cross-validation-with-claude -->

## 10. CROSS-VALIDATION WITH CLAUDE

**Use both AIs to validate each other's work, leveraging different strengths.**

### Claude Generates, Codex Reviews

```bash
# Calling AI generates code (within the session)
# Then Codex reviews it:
codex exec \
  "@src/newly-generated-module.ts Review this code for: correctness, edge cases, performance issues, and adherence to SOLID principles. Be critical. Return findings as JSON." \
  --sandbox read-only --model gpt-5.3-codex > /tmp/codex-review.txt
```

### Codex Generates, Claude Reviews

```bash
# Codex generates
codex exec "Create a caching layer with TTL support and LRU eviction" \
  --sandbox workspace-write --model gpt-5.3-codex > /tmp/cache.ts

# Calling AI reviews within the session (read /tmp/cache.ts and analyze)
```

### Strength Comparison for Task Routing

| Strength Area | Calling AI | Codex CLI |
|---------------|-------------|-----------|
| Codebase context | Deep (built-in tools, spec-kit memory) | Good (with @file references) |
| Web search | Via web search tool | Via `--search` flag |
| Multi-file refactoring | Strong | Strong |
| Architecture reasoning | Strong | Strong (xhigh reasoning) |
| Sandbox-isolated execution | No (direct file access) | Yes (enforced by sandbox mode) |
| Session continuity | Built-in (conversation context) | Via `codex resume` / `codex fork` |
| Spec-kit memory | Native | Not available |
| Real-time information | Via web search tool | Via `--search` flag |

### Cross-Validation Strategies

| Strategy | Flow | Best For |
|----------|------|----------|
| **Adversarial review** | A generates, B critiques | Security-critical code |
| **Consensus check** | Both solve independently, compare | Architectural decisions |
| **Specialist routing** | Route by strength (table above) | Efficiency optimization |
| **Red team** | A writes, B tries to break | Auth, payments, data access |
| **Sandbox isolation** | Codex generates in sandboxed environment | Risky migrations or system changes |

<!-- /ANCHOR:cross-validation-with-claude -->

<!-- ANCHOR:session-continuity -->

## 11. SESSION CONTINUITY

**Maintain context across multiple Codex invocations for complex, multi-turn tasks.**

### Session Operations

```bash
# Resume a previous session (interactive TUI)
codex resume

# Resume a specific session by ID
codex resume <session-id>

# Fork a session before a risky operation (creates a branch)
codex fork <session-id>

# Non-interactive resume and continue
codex exec --session-id <id> \
  "Continue implementing the rate limiter from where we left off" \
  --model gpt-5.3-codex
```

### Multi-Turn Scripted Workflow

```bash
# Turn 1: Analysis — capture session ID from output if available
codex exec "Analyze src/auth/ architecture. List 5 improvements." \
  --sandbox read-only --model gpt-5.3-codex > /tmp/analysis.txt
# Note the session ID displayed in TUI or output

# Turn 2: Implement first improvement (in same session)
SESSION_ID="<id-from-turn-1>"
codex exec --session-id "$SESSION_ID" \
  "Implement improvement #1 from your analysis" \
  --sandbox workspace-write --model gpt-5.3-codex

# Fork before trying a risky approach
codex fork "$SESSION_ID"
FORK_ID="<fork-id>"
codex exec --session-id "$FORK_ID" \
  "Attempt the aggressive refactor approach" \
  --sandbox workspace-write --model gpt-5.3-codex
```

### When to Use Each Operation

| Operation | When to Use |
|-----------|-------------|
| `resume` | Continue a multi-step task with existing Codex context |
| `fork` | Try a different approach without losing the original session state |
| New session | Fresh context; prior session is not relevant |
| `codex exec` (stateless) | One-shot tasks; simpler to re-provide context than manage sessions |

### Considerations

- For cross-AI orchestration, it is often simpler to re-provide context via `@file` references than to manage session IDs across multiple `codex exec` calls.
- Use sessions when the task genuinely builds on prior Codex reasoning that would be costly to re-establish.
- Fork before any operation that could leave the session in a broken state.

<!-- /ANCHOR:session-continuity -->

<!-- ANCHOR:anti-patterns -->

## 12. ANTI-PATTERNS

**What NOT to do when orchestrating Codex CLI from the calling AI.**

### 1. Using --full-auto Without Review

```bash
# BAD: Full-auto on destructive operations
codex exec "Clean up the codebase" --full-auto  # May delete or alter files unexpectedly

# GOOD: Review plan first, then execute specific steps
codex exec "List files that could be cleaned up. Do not delete anything." \
  --sandbox read-only --model gpt-5.3-codex
# Review the list, then selectively execute
```

### 2. Using danger-full-access Without Approval

```bash
# BAD: Unrestricted access with no human checkpoint
codex exec "Migrate the database" \
  --sandbox danger-full-access --ask-for-approval never --model gpt-5.3-codex

# GOOD: Full access with explicit approval required
codex exec "Migrate the database" \
  --sandbox danger-full-access --ask-for-approval untrusted --model gpt-5.3-codex
```

### 3. Trusting Output Blindly

```bash
# BAD: Direct pipe to production
codex exec "Generate migration SQL" --sandbox read-only --model gpt-5.3-codex \
  | psql production_db

# GOOD: Generate, review, test, then apply
codex exec "Generate migration SQL" --sandbox read-only --model gpt-5.3-codex \
  > /tmp/migration.sql
# Review /tmp/migration.sql
# Test on staging: psql staging_db -f /tmp/migration.sql
# Then apply to production
```

### 4. Over-Specifying in a Single Prompt

```bash
# BAD: Everything at once
codex exec "Create a complete REST API with auth, CRUD for users/posts/comments, \
  rate limiting, caching, logging, monitoring, tests, and deployment config" \
  --model gpt-5.3-codex

# GOOD: Incremental (Pattern 9)
codex exec "Create type definitions for a blog API: User, Post, Comment" \
  --sandbox workspace-write --model gpt-5.3-codex
# Then build on top incrementally
```

### 5. Background Tasks Writing the Same Files

```bash
# BAD: Parallel writes to overlapping files
codex exec "Fix auth" --sandbox workspace-write --model gpt-5.3-codex &
codex exec "Fix auth tests" --sandbox workspace-write --model gpt-5.3-codex &
# Race condition: both modify src/auth/ simultaneously

# GOOD: Background only for independent, read-only analysis
codex exec "Review src/auth/" --sandbox read-only --model gpt-5.3-codex \
  > /tmp/auth-review.txt &
codex exec "Review src/payments/" --sandbox read-only --model gpt-5.3-codex \
  > /tmp/pay-review.txt &
wait
```

### 6. Using --oss for Production Workflows

```bash
# BAD: OSS models in automated pipelines (unpredictable quality)
codex exec "Fix the authentication bug" --oss --model gpt-5.3-codex

# GOOD: Use --oss only for local experimentation
# For production workflows, always use gpt-5.3-codex with API key or OAuth
codex exec "Fix the authentication bug" --model gpt-5.3-codex
```

### 7. Backgrounding codex exec Inside Shell Scripts Called by Another AI

```bash
# BAD: & inside the shell command — orchestrator sees instant exit 0
codex exec "Deep review all phases" --full-auto -o /tmp/result.txt 2>&1 &
echo "PID: $!"
# The Bash tool reports "completed" in <2 seconds. Codex is still running.

# GOOD: No & — use the orchestrator's own background mechanism instead
# In Claude Code: Bash(command="codex exec ...", run_in_background=true)
# In Copilot: background delegation
# The orchestrator waits for the actual codex process to finish.
codex exec "Deep review all phases" --full-auto -o /tmp/result.txt 2>&1
```

This is the most common false-completion trap in cross-AI orchestration. The orchestrating AI reads empty output files and either hallucinates results or reports stale data from a prior run.

### 8. Forgetting Context in Stateless exec Calls

```bash
# BAD: Follow-up without re-providing context
codex exec "Analyze src/auth.ts" --model gpt-5.3-codex  # Turn 1
codex exec "Now fix the issue you found" --model gpt-5.3-codex  # Turn 2: Codex has no memory of Turn 1

# GOOD: Re-provide context or use session resume
codex exec "Analyze src/auth.ts" --model gpt-5.3-codex > /tmp/analysis.txt
codex exec "@src/auth.ts Fix the issues identified: $(cat /tmp/analysis.txt)" \
  --sandbox workspace-write --model gpt-5.3-codex
```

<!-- /ANCHOR:anti-patterns -->
