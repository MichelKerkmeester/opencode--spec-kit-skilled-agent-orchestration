---
title: "Cross-AI Orchestration Patterns"
description: "Proven patterns for orchestrating Gemini CLI from any AI assistant session, including implementation templates and practical considerations."
---

# Cross-AI Orchestration Patterns: Calling AI + Gemini CLI

Proven patterns for orchestrating Gemini CLI from any AI assistant session.

---

## 1. OVERVIEW

### Core Principle

The calling AI acts as the orchestrator (planner, validator, integrator) while Gemini CLI executes targeted tasks. The value comes from combining different model perspectives, not from redundant execution.

### Purpose

Each pattern documented here includes the rationale, implementation template, and practical considerations for combining the calling AI with Gemini CLI effectively.

### When to Use

- You need a second AI perspective on generated code, architecture, or security
- Gemini's strengths (speed via Flash models, 1M+ context window, native web search) complement the calling AI's strengths
- You want to run parallel AI tasks while the calling AI continues working
- Complex workflows benefit from structured, multi-stage generation and validation

## 2. GENERATE-REVIEW-FIX CYCLE

**The most reliable cross-AI pattern.** One AI generates, the other reviews, then the original fixes.

### Flow

```
Calling AI (plan) --> Gemini CLI (generate) --> Calling AI (review) --> Gemini CLI (fix)
```

### Implementation

```bash
# Step 1: Gemini generates the code
echo "Create a rate limiter middleware for Express with sliding window algorithm. \
Output only the code, no explanation." | gemini -o text -m gemini-3.1-pro-preview > /tmp/rate-limiter.ts

# Step 2: Calling AI reviews (done within the calling AI session)
# Read /tmp/rate-limiter.ts, identify issues, write review to /tmp/review.md

# Step 3: Gemini fixes based on review
echo "Fix these issues in the rate limiter: $(cat /tmp/review.md)" | \
  gemini -o text -m gemini-3.1-pro-preview @/tmp/rate-limiter.ts > /tmp/rate-limiter-v2.ts
```

### When to Use

- Code generation tasks where a second perspective catches edge cases
- Complex algorithms where verification matters more than speed
- Architecture decisions that benefit from adversarial review

### Considerations

- Always validate the final output yourself (neither AI is infallible)
- Keep the review focused: bullet points of specific issues, not general feedback
- Limit to 2 cycles maximum; diminishing returns beyond that

## 3. JSON OUTPUT PROCESSING

**Extract structured data from Gemini for programmatic use in the calling AI's workflows.**

### Implementation

```bash
# Get structured analysis as JSON
echo "Analyze src/auth.ts and return JSON with: \
{functions: [{name, params, returnType, complexity}], \
issues: [{line, severity, description}]}" | gemini -o json > /tmp/analysis.json

# Parse with jq
jq '.response | fromjson | .issues[] | select(.severity == "high")' /tmp/analysis.json

# Parse with Node.js
node -e "
const data = require('/tmp/analysis.json');
const parsed = JSON.parse(data.response);
parsed.issues.filter(i => i.severity === 'high').forEach(i => {
  console.log(\`Line \${i.line}: \${i.description}\`);
});
"
```

### Response Schema (from -o json)

```json
{
  "response": "string (may contain embedded JSON if requested)",
  "toolCalls": [
    {
      "name": "tool_name",
      "args": {},
      "result": "string"
    }
  ],
  "stats": {
    "totalInputTokens": 0,
    "totalOutputTokens": 0,
    "totalTurns": 0,
    "toolCallCount": 0,
    "duration": "0.0s"
  }
}
```

### When to Use

- Extracting metrics, function signatures, or dependency lists
- Feeding Gemini analysis into the calling AI's decision logic
- Building automated pipelines that branch on structured output

### Considerations

- The `response` field is a string; if you asked for JSON, you must parse it from within the string
- Use `stream-json` for long-running tasks where you want incremental updates
- Validate the JSON structure before relying on it; LLM JSON is not guaranteed well-formed

## 4. BACKGROUND EXECUTION

**Run Gemini tasks in parallel while the calling AI continues working.**

### Implementation

```bash
# Launch multiple Gemini tasks in background
echo "Review src/api/ for security vulnerabilities" | \
  gemini -o json -m gemini-3.1-pro-preview > /tmp/security-review.json 2>&1 &
PID1=$!

echo "Generate unit tests for src/utils.ts" | \
  gemini -o text -m gemini-3.1-pro-preview > /tmp/generated-tests.ts 2>&1 &
PID2=$!

# Calling AI continues other work...
# ... then checks results when needed

# Wait for specific task
wait $PID1
echo "Security review complete: $(cat /tmp/security-review.json | head -20)"

# Wait for all
wait $PID1 $PID2
echo "All Gemini tasks complete"
```

### Monitoring

```bash
# Check if still running
kill -0 $PID1 2>/dev/null && echo "Still running" || echo "Complete"

# Check output size (proxy for progress)
wc -c /tmp/security-review.json

# Tail streaming output
tail -f /tmp/generated-tests.ts
```

### When to Use

- Independent tasks that do not depend on each other
- Long-running analysis while the calling AI handles quick edits
- Generating multiple artifacts simultaneously (tests, docs, types)

### Considerations

- Always redirect stderr: `2>&1` to capture errors
- Set reasonable timeouts: `timeout 120 gemini ...` to prevent hung processes
- Background processes share rate limits; add delays between launches to avoid 429s
- Do not background tasks that modify files YOLO-style (race conditions)

## 5. MODEL SELECTION STRATEGY

**`gemini-3.1-pro-preview` is the only supported model. Use it for all tasks.**

### Implementation

```bash
# All tasks use the same model
echo "Review the authentication architecture" | gemini -m gemini-3.1-pro-preview -o json
echo "Write tests for utils.ts" | gemini -m gemini-3.1-pro-preview -o text
echo "Does src/ use the singleton pattern? Answer yes or no." | \
  gemini -m gemini-3.1-pro-preview -o text
```

### When to Use

- Always specify `-m gemini-3.1-pro-preview` explicitly in scripts for predictability.
- Omitting `-m` will use the CLI default, which may change across versions.

## 6. RATE LIMIT HANDLING

**Gracefully handle rate limits in automated workflows.**

### Automatic Retry (built-in)

Gemini CLI automatically retries with exponential backoff on 429 responses. No configuration needed for interactive use.

### Manual Strategies for Scripts

```bash
# Strategy 1: Sequential with delays
for file in src/*.ts; do
  echo "Review $file for issues" | gemini -o json -m gemini-3.1-pro-preview > "/tmp/review-$(basename $file).json"
  sleep 2  # Prevent rate limit bursts
done

# Strategy 2: Retry with delay on rate limit
review_file() {
  local result
  result=$(echo "Review $1" | gemini -o json -m gemini-3.1-pro-preview 2>&1)
  if echo "$result" | grep -q "429"; then
    echo "Rate limited, retrying after delay" >&2
    sleep 5
    result=$(echo "Review $1" | gemini -o json -m gemini-3.1-pro-preview 2>&1)
  fi
  echo "$result"
}

# Strategy 3: Batch operations (combine multiple small requests)
echo "Review these files for issues. Respond with JSON array of {file, issues}:
$(for f in src/utils.ts src/auth.ts src/api.ts; do echo "--- $f ---"; cat "$f"; done)" | \
  gemini -o json -m gemini-3.1-pro-preview > /tmp/batch-review.json
```

### Rate Limit Quick Reference

| Tier | Requests/min | Requests/day | Strategy |
|------|-------------|--------------|----------|
| Free (OAuth) | 60 | 1,000 | Batch requests, add delays |
| Free (API Key) | 60 | 1,000 | Same as OAuth |
| Paid | Higher | Higher | Less concern, still batch for efficiency |

## 7. CONTEXT ENRICHMENT

**Provide Gemini with rich context for better results.**

### File References with @

```bash
# Single file context
echo "Refactor to use the repository pattern" | gemini @src/database.ts

# Multiple files for cross-file understanding
echo "These files have a circular dependency. Fix it." | \
  gemini @src/auth.ts @src/user.ts @src/session.ts

# Glob patterns for broad context
echo "Review test coverage gaps" | gemini @src/**/*.test.ts @src/**/*.ts
```

### Project Context via GEMINI.md

Create a `GEMINI.md` in the project root to persist context across all Gemini invocations:

```markdown
# Project Context

## Architecture
- Express.js REST API with TypeScript
- PostgreSQL with Prisma ORM
- JWT authentication with refresh tokens

## Conventions
- Use functional style, avoid classes
- Error handling via Result<T, E> pattern
- All public functions must have JSDoc

## Do Not
- Do not modify prisma/schema.prisma without explicit request
- Do not add new dependencies without justification
```

### Explicit Context Injection

```bash
# Inject the calling AI's analysis as context
CLAUDE_ANALYSIS="The bug is in the token refresh logic. The refresh token
is not being rotated on use, allowing token replay attacks."

echo "Fix this security issue. Context from prior analysis: $CLAUDE_ANALYSIS" | \
  gemini @src/auth/tokens.ts -m gemini-3.1-pro-preview
```

### When to Use

- Always provide relevant file context; Gemini performs significantly better with it
- Use GEMINI.md for project-wide conventions that apply to every request
- Inject the calling AI's findings when Gemini is doing follow-up work

## 8. VALIDATION PIPELINE

**Multi-stage validation of Gemini-generated output.**

### Implementation

```bash
# Stage 1: Generate
echo "Create a webhook handler for Stripe events" | \
  gemini -o text -m gemini-3.1-pro-preview > /tmp/webhook.ts

# Stage 2: Syntax check
npx tsc --noEmit /tmp/webhook.ts 2>/tmp/syntax-errors.txt
if [ $? -ne 0 ]; then
  echo "Fix these TypeScript errors: $(cat /tmp/syntax-errors.txt)" | \
    gemini -o text @/tmp/webhook.ts > /tmp/webhook-fixed.ts
  cp /tmp/webhook-fixed.ts /tmp/webhook.ts
fi

# Stage 3: Security scan
echo "Audit this code for security issues. Focus on: input validation, \
injection attacks, authentication bypasses. Return JSON: \
{issues: [{severity, line, description, fix}]}" | \
  gemini -o json @/tmp/webhook.ts -m gemini-3.1-pro-preview > /tmp/security-scan.json

# Stage 4: Functional check (calling AI reviews the result)
# Read /tmp/webhook.ts and /tmp/security-scan.json within the calling AI

# Stage 5: Style check
echo "Reformat to match project conventions. Use functional style, \
Result<T,E> error handling, JSDoc on exports." | \
  gemini -o text @/tmp/webhook.ts > /tmp/webhook-final.ts
```

### Pipeline Stages (Recommended Order)

| Stage | Purpose | Tool |
|-------|---------|------|
| 1. Generate | Create initial artifact | Gemini (`gemini-3.1-pro-preview`) |
| 2. Syntax | Verify it compiles/parses | Language toolchain (tsc, eslint) |
| 3. Security | Check for vulnerabilities | Gemini (`gemini-3.1-pro-preview`) or dedicated scanner |
| 4. Functional | Verify correctness | Calling AI review or tests |
| 5. Style | Match project conventions | Gemini (`gemini-3.1-pro-preview`) or formatter |

### When to Use

- Any generated code that will be committed to the repository
- Security-sensitive code (auth, payments, data handling)
- Code that lacks test coverage

## 9. INCREMENTAL REFINEMENT

**Build complex artifacts in stages, verifying each stage before proceeding.**

### Implementation

```bash
# Stage 1: Skeleton
echo "Create the type definitions and function signatures for a task queue \
system. Types only, no implementation. Export all types." | \
  gemini -o text -m gemini-3.1-pro-preview > src/task-queue/types.ts

# Verify stage 1
npx tsc --noEmit src/task-queue/types.ts

# Stage 2: Core implementation
echo "Implement the core TaskQueue class using these types. \
Handle enqueue, dequeue, retry with exponential backoff." | \
  gemini -o text @src/task-queue/types.ts -m gemini-3.1-pro-preview > src/task-queue/queue.ts

# Verify stage 2
npx tsc --noEmit src/task-queue/queue.ts

# Stage 3: Tests
echo "Write comprehensive tests for the TaskQueue. \
Cover: enqueue, dequeue, retry logic, concurrency limits, error handling." | \
  gemini -o text @src/task-queue/types.ts @src/task-queue/queue.ts \
  -m gemini-3.1-pro-preview > src/task-queue/__tests__/queue.test.ts

# Verify stage 3
npx jest src/task-queue/__tests__/queue.test.ts
```

### Stage Progression Rules

1. Never proceed to the next stage if the current stage has errors
2. Each stage gets the output of all previous stages as context
3. Keep stages small enough that they can be fully reviewed
4. Use `gemini-3.1-pro-preview` for all stages

### When to Use

- Building new modules or subsystems from scratch
- Complex features with multiple interacting components
- When you want to maintain control over architectural decisions at each step

## 10. CROSS-VALIDATION WITH CLAUDE

**Use both AIs to validate each other's work, leveraging different strengths.**

### Claude Generates, Gemini Reviews

```bash
# Calling AI generates code (within the session)
# Then Gemini reviews it:
echo "Review this code for: correctness, edge cases, performance issues, \
and adherence to SOLID principles. Be critical." | \
  gemini -o json @src/newly-generated-module.ts -m gemini-3.1-pro-preview > /tmp/gemini-review.json
```

### Gemini Generates, Claude Reviews

```bash
# Gemini generates
echo "Create a caching layer with TTL support and LRU eviction" | \
  gemini -o text -m gemini-3.1-pro-preview > /tmp/cache.ts

# Calling AI reviews within the session (read /tmp/cache.ts and analyze)
```

### Strength Comparison for Task Routing

| Strength Area | Calling AI | Gemini CLI |
|---------------|-------------|------------|
| Codebase context | Deep (built-in tools) | Good (with @ references) |
| Web search | Via tool | Native google_web_search |
| Multi-file refactoring | Strong | Strong |
| Architecture reasoning | Strong | Strong |
| Speed (simple tasks) | Standard | Standard |
| Long context window | 200K tokens | 1M+ tokens |
| Image understanding | Strong | Strong |
| Real-time information | Via web search tool | Native web search |

### Cross-Validation Strategies

| Strategy | Flow | Best For |
|----------|------|----------|
| **Adversarial review** | A generates, B critiques | Security-critical code |
| **Consensus check** | Both solve independently, compare | Architectural decisions |
| **Specialist routing** | Route by strength (table above) | Efficiency optimization |
| **Red team** | A writes, B tries to break | Auth, payments, data access |

## 11. SESSION CONTINUITY

**Maintain context across multiple Gemini invocations for complex, multi-turn tasks.**

### Session Management

```bash
# List existing sessions
gemini --list-sessions

# Start a task that will need follow-up
echo "Analyze the authentication flow and identify improvement areas" | gemini -o text
# Note the session ID from the output

# Resume later with follow-up
gemini -r <session-id>
# Then in REPL: "Now implement the first improvement you identified"

# Delete old sessions
gemini --delete-session <session-id>
```

### Multi-Turn Scripted Workflow

```bash
# Turn 1: Analysis
SESSION=$(echo "Analyze src/auth/ architecture. List 5 improvements." | \
  gemini -o json -m gemini-3.1-pro-preview | jq -r '.sessionId // empty')

# Turn 2: Implement first improvement (in same session)
if [ -n "$SESSION" ]; then
  gemini -r "$SESSION" <<< "Implement improvement #1 from your analysis"
fi
```

### When to Use

- Multi-step refactoring that builds on previous analysis
- Tasks where Gemini needs to remember decisions from earlier turns
- When the same context (loaded via @) should persist across interactions

### Considerations

- Sessions consume storage; clean up with `--delete-session` when done
- Session context has limits; very long sessions may lose early context
- For cross-AI orchestration, it is often simpler to re-provide context than manage sessions

## 12. ANTI-PATTERNS

**What NOT to do when orchestrating Gemini CLI from the calling AI.**

### 1. Expecting Immediate Execution with YOLO

```bash
# BAD: Trusting YOLO for destructive operations
echo "Clean up the codebase" | gemini -y  # May delete files unexpectedly

# GOOD: Review plan first, then execute specific steps
echo "List files that could be cleaned up. Do not delete anything." | gemini -o text
# Review the list, then selectively approve
```

### 2. Ignoring Rate Limits in Loops

```bash
# BAD: Rapid-fire requests
for file in $(find src -name "*.ts"); do
  echo "Review $file" | gemini -o json  # Will hit 429 quickly
done

# GOOD: Batch or throttle
echo "Review all these files: $(find src -name '*.ts' | head -20)" | gemini -o json
```

### 3. Trusting Output Blindly

```bash
# BAD: Direct pipe to production
echo "Generate migration SQL" | gemini -o text | psql production_db

# GOOD: Generate, review, test, then apply
echo "Generate migration SQL" | gemini -o text > /tmp/migration.sql
# Review /tmp/migration.sql
# Test on staging
# Then apply
```

### 4. Over-Specifying in a Single Prompt

```bash
# BAD: Everything at once
echo "Create a complete REST API with auth, CRUD for users/posts/comments, \
rate limiting, caching, logging, monitoring, tests, and deployment config" | gemini

# GOOD: Incremental (Pattern 8)
echo "Create type definitions for a blog API: User, Post, Comment" | gemini
# Then build on top incrementally
```

### 5. Forgetting Context Limits

```bash
# BAD: Dumping entire codebase
echo "Review everything" | gemini @src/**/*  # May exceed context window

# GOOD: Targeted context
echo "Review the auth module" | gemini @src/auth/*.ts @src/types/auth.ts
```

### 6. Mixing Concerns in Background Tasks

```bash
# BAD: Background tasks that write to the same files
echo "Fix auth" | gemini -y &
echo "Fix auth tests" | gemini -y &  # Race condition on shared files

# GOOD: Background only for independent, read-only analysis
echo "Review auth" | gemini -o json > /tmp/auth-review.json &
echo "Review payments" | gemini -o json > /tmp/pay-review.json &
wait
```

