---
title: "OpenCode CLI - Prompt Templates"
description: "Copy-paste ready prompt templates for the three documented use cases plus specialized agent dispatch, parallel detached sessions, ablation suites, worker farms, cross-AI handback, and Memory Epilogue."
---

# OpenCode CLI - Prompt Templates

Copy-paste templates for `opencode run` dispatches. Each template names the use case it serves, the framework it applies, and the canonical invocation shape.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The cli-opencode skill ships templates for the three documented use cases (per ADR-002) plus specialized dispatches for agent routing, parallel research, ablation, worker farms, and cross-AI handback. Every template ends with the Memory Epilogue when the calling AI needs to preserve session context.

Templates are numbered for cross-reference from `references/integration_patterns.md` and `SKILL.md`.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:template-1 -->
## 2. Template 1 — External Runtime to OpenCode (Use Case 1)

**Framework:** RCAF
**Calling runtime:** Claude Code, Codex, Copilot, Gemini, raw shell

```text
You are dispatching from <calling-runtime> into a fresh OpenCode session via cli-opencode.

Goal: <one-sentence goal>

Context:
- Spec folder: <path> (pre-approved, skip Gate 3)
- Plugins / skills required: <list>
- MCP tools required: <list>

Constraints:
- <list>

Success criteria:
- <list>

Memory Epilogue:
At the end of your response, include a structured handback inside delimiters:

<!-- MEMORY_HANDBACK_START -->
{
  "specFolder": "<path>",
  "sessionSummary": "<one-paragraph summary>",
  "user_prompts": ["<verbatim prompt>"],
  "observations": ["<key finding 1>", "<key finding 2>"],
  "recent_context": ["<recent change 1>"],
  "FILES": [
    {"path": "<path>", "DESCRIPTION": "<change description>", "ACTION": "<verb>", "MODIFICATION_MAGNITUDE": "<small|medium|large>"}
  ],
  "nextSteps": ["<next safe action>"]
}
<!-- MEMORY_HANDBACK_END -->
```

```bash
opencode run \
  --model anthropic/claude-opus-4-7 \
  --agent general \
  --variant high \
  --format json \
  --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public \
  "<prompt-from-template>" 2>&1
```

<!-- /ANCHOR:template-1 -->

<!-- ANCHOR:template-2 -->
## 3. Template 2 — In-OpenCode Parallel Detached Session (Use Case 2)

**Framework:** CIDI
**Calling runtime:** OpenCode itself (TUI / web / serve / acp)

```text
You are spawning a parallel detached OpenCode session for <purpose>.

Goal: <one-sentence goal — must mention "parallel detached", "ablation suite", "worker farm", or "share URL">

Context:
- Spec folder: <path> (pre-approved, skip Gate 3)
- Iteration N of <total>
- State file: <path>

Constraints:
- This session must NOT modify the parent session's state.
- Write results to <state file path>.
- Publish a share URL only if the operator confirmed (CHK-033).
- Do NOT delegate the same prompt back to OpenCode (cycle protection).

Success criteria:
- <list>
```

```bash
opencode run \
  --share \
  --port 4096 \
  --model anthropic/claude-opus-4-7 \
  --agent deep-research \
  --variant high \
  --format json \
  --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public \
  "<prompt-from-template>" 2>&1
```

<!-- /ANCHOR:template-2 -->

<!-- ANCHOR:template-3 -->
## 4. Template 3 — Cross-AI Orchestration Handback (Use Case 3)

**Framework:** RCAF + TIDD-EC
**Calling runtime:** Codex, Copilot, Gemini

```text
You are dispatching from <calling-runtime> into OpenCode for a spec-kit-specific workflow.

Goal: <one-sentence goal>

Context:
- Spec folder: <path> (pre-approved, skip Gate 3)
- Subsystem: <spec-kit | memory | code-graph | advisor>
- Operation: <save | search | query | scan | validate>

Do's:
- Load the system-spec-kit skill before any spec-folder write.
- Route MCP calls through the project's local MCP servers.
- Cite file:line evidence for every claim.

Don'ts:
- Do not modify files outside the named spec folder.
- Do not skip the strict spec-folder validation.

Success criteria:
- <list>

Memory Epilogue: include MEMORY_HANDBACK delimiters as in Template 1.
```

```bash
opencode run \
  --model anthropic/claude-opus-4-7 \
  --agent general \
  --variant high \
  --format json \
  --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public \
  "<prompt-from-template>" 2>&1
```

<!-- /ANCHOR:template-3 -->

<!-- ANCHOR:template-4 -->
## 5. Template 4 — Specialized Agent Dispatch

**Framework:** RCAF
**Use case:** Any (1, 2, or 3)

Dispatch a task to a specific agent slug. See `../references/agent_delegation.md` for the full routing matrix.

```bash
opencode run \
  --model anthropic/claude-opus-4-7 \
  --agent <slug> \
  --variant high \
  --format json \
  --dir /repo \
  "<prompt>" 2>&1
```

Common slugs: `general`, `context`, `orchestrate`, `write`, `review`, `debug`, `deep-research`, `deep-review`, `ultra-think`, `improve-agent`.

<!-- /ANCHOR:template-4 -->

<!-- ANCHOR:template-5 -->
## 6. Template 5 — Code Review

**Framework:** TIDD-EC
**Agent:** `review`
**Use case:** 1 or 3

```text
As @review:

Task: Review <files> for <issue type>.

Instructions:
- Cite file:line evidence for every finding.
- Surface P0 / P1 / P2 separately.
- Map findings to the closest sk-code-review check item.

Do's:
- Apply the project's sk-code-review baseline.
- Layer the appropriate stack-specific overlay (sk-code-opencode / sk-code-web / sk-code-full-stack).

Don'ts:
- Do not propose fixes — leave that for a follow-up dispatch.
- Do not modify files (READ-ONLY).

Examples: <if available>

Context: Spec folder: <path> (pre-approved, skip Gate 3).
```

```bash
opencode run \
  --model anthropic/claude-opus-4-7 \
  --agent review \
  --variant high \
  --format json \
  --dir /repo \
  "<prompt>" 2>&1
```

<!-- /ANCHOR:template-5 -->

<!-- ANCHOR:template-6 -->
## 7. Template 6 — Iterative Deep Research

**Framework:** CRISPE
**Agent:** `deep-research`
**Use case:** 2 (parallel detached) or 1 (single iteration from external runtime)

```text
Run iteration N of the deep-research loop on packet <packet-id>.

State file: <path to iteration-N.jsonl>
Strategy file: <path to strategy.md>

Capacity: leaf-agent execution — single iteration only, no nested dispatches.
Insight: <what the prior iteration converged on>
Statement: <hypothesis for this iteration>
Personality: rigorous, evidence-first, no speculation.
Experiment: <list of files to read and queries to run>
```

```bash
opencode run \
  --share \
  --port 4096 \
  --model anthropic/claude-opus-4-7 \
  --agent deep-research \
  --variant high \
  --format json \
  --dir /repo \
  "<prompt>" 2>&1
```

<!-- /ANCHOR:template-6 -->

<!-- ANCHOR:template-7 -->
## 8. Template 7 — Ablation Suite

**Framework:** CIDI
**Agent:** `general` or `orchestrate`
**Use case:** 2 (parallel detached)

```text
Spawn a parallel detached session to run an ablation suite on <subsystem>.

Context: <one-paragraph context>
Instructions:
- For each ablation in <ablation list>, run <experiment>.
- Capture results in <state file path>.
- Compare against the baseline at <baseline path>.

Details:
- Ablation 1: <description>
- Ablation 2: <description>
- ...

Input: <input data path>
```

```bash
opencode run \
  --share \
  --port 4097 \
  --model anthropic/claude-opus-4-7 \
  --agent general \
  --variant high \
  --format json \
  --dir /repo \
  "<prompt>" 2>&1
```

<!-- /ANCHOR:template-7 -->

<!-- ANCHOR:template-8 -->
## 9. Template 8 — Worker Farm Dispatch

**Framework:** CIDI
**Agent:** `general`
**Use case:** 2 (parallel detached)

Spawn N parallel detached sessions in a loop, each with a distinct port and state file.

```text
You are worker N of <total> in a parallel farm. Spec folder: <path>.

Goal: <one-sentence goal scoped to your shard>

Constraints:
- Read input from <input shard path for worker N>.
- Write output to <output shard path for worker N>.
- Do NOT touch other workers' state.
```

```bash
# Dispatch loop — note the </dev/null redirect (see integration_patterns.md §6)
for n in $(seq 1 8); do
  port=$((4100 + n))
  opencode run \
    --share \
    --port "$port" \
    --model anthropic/claude-opus-4-7 \
    --agent general \
    --variant high \
    --format json \
    --dir /repo \
    "Worker $n: <prompt>" > "logs/worker-$n.log" 2>&1 </dev/null &
done
wait
```

<!-- /ANCHOR:template-8 -->

<!-- ANCHOR:template-9 -->
## 10. Template 9 — Spec Kit Memory Search via OpenCode

**Framework:** RCAF
**Agent:** `general`
**Use case:** 3 (cross-AI handback) or 1 (external runtime)

```text
Search the project's Spec Kit Memory database for <query>.

Spec folder context: <path> (pre-approved, skip Gate 3).

Action:
- Call memory_search with the query.
- Filter results to importance_tier in [critical, important].
- Return the top 5 hits with their packet pointers.

Format: structured JSON event stream. Memory Epilogue at the end.
```

```bash
opencode run \
  --model anthropic/claude-opus-4-7 \
  --agent general \
  --variant high \
  --format json \
  --dir /repo \
  "<prompt>" 2>&1
```

<!-- /ANCHOR:template-9 -->

<!-- ANCHOR:template-10 -->
## 11. Template 10 — Multi-Strategy Planning via @ultra-think

**Framework:** CRAFT
**Agent:** `ultra-think`
**Use case:** 1 or 3

```text
Plan the <feature / refactor> using multi-strategy comparison.

Context: <one-paragraph context>
Role: planning architect — no file modifications.
Action: generate three distinct strategies, score each across the 5-dimension rubric, synthesize the optimal plan.
Format: structured JSON plus a summary paragraph.
Target: an implementation-ready plan that another agent can execute.
```

```bash
opencode run \
  --model anthropic/claude-opus-4-7 \
  --agent ultra-think \
  --variant high \
  --format json \
  --dir /repo \
  "<prompt>" 2>&1
```

<!-- /ANCHOR:template-10 -->

<!-- ANCHOR:template-11 -->
## 12. Template 11 — Doc Generation via @write

**Framework:** RCAF
**Agent:** `write`
**Use case:** 1

```text
Generate a <doc type> for <subject>.

Context: Spec folder: <path> (pre-approved, skip Gate 3).
Action: load the appropriate sk-doc template, fill it, run the DQI score, surface any HIGH issues for manual patching.
Format: markdown.
```

```bash
opencode run \
  --model anthropic/claude-opus-4-7 \
  --agent write \
  --variant high \
  --format json \
  --dir /repo \
  "<prompt>" 2>&1
```

<!-- /ANCHOR:template-11 -->

<!-- ANCHOR:template-12 -->
## 13. Template 12 — Self-Invocation Refusal Surface

**Use case:** Refusal path

When the smart router refuses (per ADR-001), the calling AI surfaces this exact message to the operator:

```text
ERROR: cli-opencode self-invocation refused.

You are already inside OpenCode (signal: <env|ancestry|lockfile> tripped).
Asking cli-opencode to delegate this exact prompt back to OpenCode would create
a circular dispatch.

Options:
1. Use a sibling cli-* skill (cli-claude-code, cli-codex, cli-copilot, cli-gemini)
   to dispatch a different model.
2. Open a fresh shell session (no OpenCode parent) and re-run from there.
3. If you wanted a parallel detached session (different session id, separate
   state directory), restate the request with explicit "parallel detached" /
   "ablation suite" / "worker farm" / "share URL" keywords — that triggers
   use case 2 instead of refusal.
```

This template is NOT an `opencode run` invocation — it is the user-facing message the calling AI prints when the router refuses dispatch.

<!-- /ANCHOR:template-12 -->

<!-- ANCHOR:template-13 -->
## 14. Template 13 — Memory Epilogue (Reusable Tail)

Append this block to any prompt that produces evidence the calling AI wants to save through Spec Kit Memory.

```text
Memory Epilogue:

At the end of your response, include a structured handback inside delimiters:

<!-- MEMORY_HANDBACK_START -->
{
  "specFolder": "<path>",
  "sessionSummary": "<one-paragraph summary, 2-4 sentences>",
  "user_prompts": ["<verbatim caller prompt>"],
  "observations": ["<key finding 1>", "<key finding 2>"],
  "recent_context": ["<recent change 1>", "<recent change 2>"],
  "FILES": [
    {
      "path": "<absolute or repo-rooted path>",
      "DESCRIPTION": "<one sentence describing the change>",
      "ACTION": "<verb: created | modified | deleted | reviewed>",
      "MODIFICATION_MAGNITUDE": "<small | medium | large>",
      "_provenance": "<short cite>"
    }
  ],
  "keyDecisions": ["<decision 1 with rationale>"],
  "nextSteps": ["<next safe action>", "<follow-up 1>"],
  "triggerPhrases": ["<phrase 1>", "<phrase 2>"]
}
<!-- MEMORY_HANDBACK_END -->

The calling AI extracts this block via regex
/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/
and feeds it to generate-context.js.
```

<!-- /ANCHOR:template-13 -->

<!-- ANCHOR:related -->
## 15. RELATED RESOURCES

- `../references/cli_reference.md` - Full subcommand and flag reference
- `../references/integration_patterns.md` - Three use cases and decision tree
- `../references/agent_delegation.md` - Agent routing matrix
- `../references/opencode_tools.md` - Unique value props
- `./prompt_quality_card.md` - Framework selection and CLEAR check
- `../SKILL.md` - Smart router pseudocode

<!-- /ANCHOR:related -->
