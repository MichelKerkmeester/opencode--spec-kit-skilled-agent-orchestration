---
title: "Cross-AI Orchestration Patterns: External AI + Claude Code CLI"
description: "Proven patterns for orchestrating Claude Code CLI from external AI sessions, with reversed conductor/executor model."
---

# Cross-AI Orchestration Patterns: External AI + Claude Code CLI

Proven patterns for orchestrating Claude Code CLI from external AI sessions (Gemini, Codex, Copilot, etc.).

---

## 1. OVERVIEW

### Core Principle

The calling AI acts as the orchestrator (planner, validator, integrator) while Claude Code CLI executes targeted tasks. This is the **reverse** of the cli-gemini and cli-codex skills where Claude Code conducts. Here, Claude Code is the executor.

### Purpose

Each pattern documented here includes the rationale, implementation template, and practical considerations for combining an external AI with Claude Code CLI effectively.

### When to Use

- You need Claude Code's deep reasoning or extended thinking for a specific subtask
- Schema-validated structured output is needed for pipeline integration
- Surgical code editing through Claude Code's Edit tool
- Cross-AI validation where a second perspective catches blind spots
- Cost-controlled execution with `--max-budget-usd`
- Read-only exploration with guaranteed safety via `--permission-mode plan`

## 2. GENERATE-REVIEW-FIX CYCLE

**The most reliable cross-AI pattern.** The calling AI generates, Claude Code reviews, the calling AI fixes.

### Flow

```
Calling AI (generate) --> Claude Code (review) --> Calling AI (fix)
```

### Implementation

```bash
# Step 1: Calling AI generates code, saves to /tmp/generated.ts

# Step 2: Claude Code reviews (read-only)
claude -p "Review @/tmp/generated.ts for bugs, security issues, and style violations. Be specific about line numbers and severity." \
  --permission-mode plan --output-format text 2>&1 > /tmp/review.md

# Step 3: Calling AI reads review, applies fixes to /tmp/generated.ts
```

### When to Use

- Code generation tasks where a second perspective catches edge cases
- Security-sensitive code where independent review adds confidence
- Architecture decisions that benefit from adversarial review

### Considerations

- Use `--permission-mode plan` for the review step (guaranteed read-only)
- Keep the review prompt focused: request specific findings, not general feedback
- Limit to 2 fix cycles maximum; diminishing returns beyond that

## 3. DEEP REASONING DELEGATION

**Leverage extended thinking for complex decisions.** Delegate tasks requiring multi-dimensional analysis to Claude Code's Opus model with extended thinking.

### Flow

```
Calling AI (identify decision) --> Claude Code (deep analysis) --> Calling AI (implement decision)
```

### Implementation

```bash
# Architecture decision
claude -p "We need to choose between event sourcing and CRUD for order management. Analyze trade-offs across: data consistency, query performance, team learning curve, operational complexity, and future scalability. Recommend with confidence level." \
  --model claude-opus-4-6 --effort high --permission-mode plan --output-format text 2>&1 > /tmp/analysis.md

# Algorithm design
claude -p "Design a rate limiting algorithm that supports: per-user limits, sliding window, burst allowance, and distributed operation. Analyze time/space complexity for each approach." \
  --model claude-opus-4-6 --effort high --permission-mode plan --output-format text 2>&1 > /tmp/algorithm.md

# Root cause analysis
claude -p "Intermittent 500 errors on POST /api/orders. Error logs show: [paste logs]. Analyze @src/api/orders.ts and @src/services/order.ts. Identify all possible root causes ranked by likelihood." \
  --model claude-opus-4-6 --effort high --agent debug --output-format text 2>&1 > /tmp/rca.md
```

### When to Use

- Architecture decisions with 4+ competing concerns
- Algorithm design requiring correctness analysis
- Root cause analysis where surface-level debugging failed
- Technical decisions that will be hard to reverse

### Considerations

- Use `claude-opus-4-6` with `--effort high` for maximum reasoning depth
- Use `--permission-mode plan` when analysis doesn't need file writes
- Opus is expensive — reserve for genuinely complex decisions
- Sonnet with `--effort high` is a good middle ground for moderately complex tasks

## 4. STRUCTURED OUTPUT PROCESSING

**Extract structured data from Claude Code for programmatic use.**

### Implementation

```bash
# Function analysis with schema validation
claude -p "Analyze all exported functions in @src/utils.ts" \
  --json-schema '{"type":"object","properties":{"functions":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"params":{"type":"array","items":{"type":"string"}},"returnType":{"type":"string"},"complexity":{"type":"string","enum":["low","medium","high"]}},"required":["name","returnType"]}}}}' \
  --output-format json 2>&1 > /tmp/analysis.json

# Parse with jq
jq '.result.functions[] | select(.complexity == "high")' /tmp/analysis.json

# Security findings with structured severity
claude -p "Audit @src/auth/ for security vulnerabilities" \
  --json-schema '{"type":"object","properties":{"findings":{"type":"array","items":{"type":"object","properties":{"severity":{"type":"string","enum":["critical","high","medium","low"]},"file":{"type":"string"},"line":{"type":"number"},"description":{"type":"string"},"fix":{"type":"string"}},"required":["severity","description"]}},"summary":{"type":"string"}}}' \
  --output-format json 2>&1 > /tmp/audit.json
```

### When to Use

- Pipeline integration requiring guaranteed JSON structure
- Batch analysis producing machine-readable results
- Data extraction that feeds into automated workflows
- Comparative analysis across multiple files

### Considerations

- Always specify `--output-format json` alongside `--json-schema`
- Keep schemas focused — complex schemas increase failure probability
- Test schema with a small prompt before batch operations
- Parse with `jq '.result'` to extract the content from the JSON wrapper

## 5. BACKGROUND EXECUTION

**Run Claude Code tasks in parallel while the calling AI continues working.**

### Implementation

```bash
# Start background task
claude -p "Generate comprehensive tests for @src/services/" \
  --max-budget-usd 0.50 --output-format text 2>&1 > /tmp/tests-output.txt &
CLAUDE_PID=$!

# Calling AI continues with other work...

# Check if done
if kill -0 $CLAUDE_PID 2>/dev/null; then
    echo "Still running..."
else
    echo "Done. Output in /tmp/tests-output.txt"
fi

# Wait for completion
wait $CLAUDE_PID
```

### When to Use

- Long-running analysis or generation tasks
- Parallel processing of independent subtasks
- Documentation generation while working on code

### Considerations

- Always use `--max-budget-usd` for background tasks to prevent runaway costs
- Redirect output to a file (`> /tmp/output.txt`) for later retrieval
- Use `$!` to capture the PID for status checking
- Background tasks compete for API rate limits

## 6. MODEL SELECTION STRATEGY

**Choose the right model tier for each delegated task.**

### Decision Matrix

| Task Complexity | Model | Flag | Cost Tier |
|----------------|-------|------|-----------|
| Trivial (classify, format) | Haiku | `--model claude-haiku-4-5-20251001` | Low |
| Standard (review, generate) | Sonnet | `--model claude-sonnet-4-6` | Medium |
| Complex (architecture, debug) | Opus | `--model claude-opus-4-6 --effort high` | High |

### Implementation

```bash
# Tier 1: Haiku for fast, cheap tasks
claude -p "Classify these error messages by type: [errors]" \
  --model claude-haiku-4-5-20251001 --output-format text 2>&1

# Tier 2: Sonnet for standard tasks (default)
claude -p "Review @src/auth.ts for security issues" \
  --permission-mode plan --output-format text 2>&1

# Tier 3: Opus for complex reasoning
claude -p "Design the data migration strategy for moving from MongoDB to PostgreSQL" \
  --model claude-opus-4-6 --effort high --permission-mode plan --output-format text 2>&1
```

### Cost Optimization

```bash
# Quick triage with Haiku, then deep dive with Opus on critical items
TRIAGE=$(claude -p "List the 3 most critical security issues in @src/auth/" \
  --model claude-haiku-4-5-20251001 --output-format text 2>&1)

DEEP_ANALYSIS=$(claude -p "Deep analysis of these security issues: $TRIAGE" \
  --model claude-opus-4-6 --effort high --permission-mode plan --output-format text 2>&1)
```

## 7. CONTEXT ENRICHMENT

**Provide rich context to Claude Code for better results.**

### CLAUDE.md Context

Claude Code automatically loads CLAUDE.md files. Place project context there for consistent behavior:

```
~/.claude/CLAUDE.md           → Global preferences
PROJECT_ROOT/CLAUDE.md        → Project conventions, architecture
SUBDIR/CLAUDE.md              → Module-specific context
```

### File References

Use `@` prefix to include file contents in prompts:

```bash
# Single file
claude -p "Review @src/auth.ts" --permission-mode plan --output-format text 2>&1

# Multiple files
claude -p "Review @src/auth.ts and @src/middleware/auth.ts for consistency" \
  --permission-mode plan --output-format text 2>&1

# Combining context with task
claude -p "Given the patterns in @src/middleware/auth.ts, create similar middleware for rate limiting" \
  --output-format text 2>&1
```

### System Prompt Enhancement

```bash
# Append context to system prompt
claude -p "Review this code" \
  --append-system-prompt "Project uses Express.js 4.x, TypeScript strict mode, and Jest for testing. Follow OWASP Top 10 guidelines." \
  --permission-mode plan --output-format text 2>&1
```

## 8. VALIDATION PIPELINE

**Multi-stage validation using Claude Code at different levels.**

### 5-Stage Pipeline

```bash
# Stage 1: Syntax check (calling AI or local tools)
npx tsc --noEmit src/feature.ts

# Stage 2: Security review (Claude Code, read-only)
claude -p "Security audit of @src/feature.ts. Check OWASP Top 10." \
  --agent review --permission-mode plan --output-format text 2>&1 > /tmp/security.md

# Stage 3: Architecture review (Claude Code, read-only)
claude -p "Does @src/feature.ts follow the patterns in @src/services/? Check coupling, error handling, typing." \
  --agent review --permission-mode plan --output-format text 2>&1 > /tmp/arch.md

# Stage 4: Test coverage analysis (Claude Code, read-only)
claude -p "Analyze @src/feature.ts and suggest comprehensive test cases. Identify edge cases and error paths." \
  --permission-mode plan --output-format text 2>&1 > /tmp/test-plan.md

# Stage 5: Final integration review (calling AI)
# Read all review outputs and make final decision
```

### When to Use

- Pre-merge quality gates
- Complex feature development requiring multiple review dimensions
- Security-sensitive changes requiring independent validation

## 9. CROSS-VALIDATION

**Use multiple AIs to validate the same artifact.**

### Implementation

```bash
# Calling AI generates code, saves to /tmp/feature.ts

# Claude Code reviews
CLAUDE_REVIEW=$(claude -p "Review @/tmp/feature.ts for bugs and security issues" \
  --permission-mode plan --output-format text 2>&1)

# Gemini CLI reviews (if available)
GEMINI_REVIEW=$(gemini -p "Review the code in /tmp/feature.ts for bugs and security issues" 2>&1)

# Codex CLI reviews (if available)
CODEX_REVIEW=$(codex exec "Review @/tmp/feature.ts for bugs and security issues" \
  --sandbox read-only --model gpt-5.3-codex 2>&1)

# Calling AI synthesizes all reviews
# Compare findings, prioritize issues found by multiple AIs
```

### When to Use

- High-stakes code changes (auth, payments, data handling)
- Architecture decisions that are hard to reverse
- Security audits where coverage matters more than speed

### Considerations

- Cross-validation is expensive (3x cost) — reserve for critical code
- Focus on disagreements between AIs as areas needing human review
- Weight each AI's strengths: Claude for reasoning, Gemini for web context, Codex for sandbox safety

## 10. SESSION CONTINUITY

**Continue conversations across invocations.**

### Implementation

```bash
# Initial analysis
claude -p "Analyze the auth module architecture" --output-format json 2>&1 > /tmp/session1.json

# Extract session info for resumption
SESSION_ID=$(jq -r '.session_id' /tmp/session1.json)

# Continue the conversation
claude -p "Now suggest improvements to the auth flow you identified" \
  --continue --output-format text 2>&1

# Or resume a specific session
claude -p "Apply the suggested improvements" \
  --resume "$SESSION_ID" --output-format text 2>&1
```

### When to Use

- Multi-step analysis where each step builds on the previous
- Iterative refinement of complex outputs
- Long-running investigations that span multiple invocations

### Considerations

- `--continue` always continues the most recent session
- `--resume SESSION_ID` is more reliable for specific conversations
- Session context accumulates — watch for growing token usage and costs
- Use `--max-budget-usd` to cap cumulative session costs

## 11. ANTI-PATTERNS

### Don't Do These

| Anti-Pattern | Problem | Better Approach |
|-------------|---------|-----------------|
| **Delegating trivial tasks** | CLI overhead > task cost | Handle simple tasks locally |
| **Skipping validation** | AI output can be wrong | Always validate before integrating |
| **Nesting Claude Code** | Undefined behavior when `$CLAUDECODE` is set | Check env var; use different terminal |
| **Ignoring costs** | Background tasks can accumulate | Always use `--max-budget-usd` |
| **Broad prompts** | "Review the whole project" overwhelms context | Target specific files with `@` |
| **Wrong model for task** | Opus for classification wastes money | Match model tier to complexity |
| **Skipping `2>&1`** | Lose error messages | Always capture stderr |
| **Trusting blindly** | Any AI can produce incorrect output | Cross-reference with codebase |
| **Rapid sequential calls** | Hit rate limits | Batch operations or add delays |
| **Using `bypassPermissions`** | Dangerous auto-approve | Always get explicit user approval |

### Cost Awareness

```
Approximate cost comparison (per 1K input + 1K output tokens):
  Haiku:  ~$0.001 (cheapest)
  Sonnet: ~$0.01  (10x haiku)
  Opus:   ~$0.05  (50x haiku)

Rule of thumb:
  - Haiku for batch/simple: $0.01-0.05 per task
  - Sonnet for standard: $0.05-0.25 per task
  - Opus for complex: $0.25-2.00 per task

Always use --max-budget-usd for batch operations.
```

