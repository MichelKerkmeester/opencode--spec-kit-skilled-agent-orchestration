# Iteration 008 - Q10 ASCII Summary Box

## Focus

Q10 - Produce the coder-side analog of `@review.md` section 13: a bordered four-quadrant ASCII summary box that distills the entire `@code` agent.

## Actions

1. Read the canonical `@review` summary box and its line structure.
2. Read the write-capable LEAF precedents in `@write` and `@debug`.
3. Read the current `@code` authority, workflow, scope, and return contract.
4. Synthesized a coder-side section 13 summary box with four quadrants: AUTHORITY, IMPLEMENTATION MODES, WORKFLOW, LIMITS.

## Findings

### f-iter008-001 - The canonical mirror target is a compact four-quadrant summary box

`@review` section 13 establishes the desired shape: fenced box, title line, `AUTHORITY`, mode/output quadrant, `WORKFLOW`, and `LIMITS`, with short imperative lines under each heading (`.opencode/agent/review.md:452`, `.opencode/agent/review.md:456`, `.opencode/agent/review.md:462`, `.opencode/agent/review.md:466`, `.opencode/agent/review.md:472`). The coder-side box should preserve that visible structure rather than invent a prose conclusion.

### f-iter008-002 - Write-capable LEAF analogs support direct limits language

`@write` and `@debug` show that write-capable LEAF agents can use the same summary format while naming hard constraints directly: no spec-folder docs, no skipped validation, no nested dispatch, and no resolved claim without evidence (`.opencode/agent/write.md:394`, `.opencode/agent/write.md:395`, `.opencode/agent/write.md:397`, `.opencode/agent/debug.md:501`, `.opencode/agent/debug.md:502`, `.opencode/agent/debug.md:504`). The code-agent summary should carry the same directness for spec-doc boundaries, LEAF status, Bash bypass limits, and verification evidence.

### f-iter008-003 - The `@code` summary must center orchestrator authority, `sk-code`, and fail-closed verification

The actual `@code` definition says it is a stack-aware application-code implementer that delegates stack detection to `sk-code` and verifies through stack-appropriate gates (`.opencode/agent/code.md:24`). It is orchestrator-only by convention (`.opencode/agent/code.md:28`), LEAF-only with no nested dispatch (`.opencode/agent/code.md:36`, `.opencode/agent/code.md:38`), implements only after packet reads and `sk-code` routing (`.opencode/agent/code.md:49`, `.opencode/agent/code.md:51`, `.opencode/agent/code.md:52`), and must return fail-closed verification status to the orchestrator (`.opencode/agent/code.md:53`, `.opencode/agent/code.md:80`, `.opencode/agent/code.md:91`).

### f-iter008-004 - Synthesized Q10 box

Recommended section 13 content:

```
┌─────────────────────────────────────────────────────────────────────────┐
│             THE CODE AGENT: STACK-AWARE IMPLEMENTATION LEAF             │
├─────────────────────────────────────────────────────────────────────────┤
│  AUTHORITY                                                              │
│  ├─► Stack-aware application-code implementation via sk-code            │
│  ├─► Scope-locked edits from orchestrator packet and target files       │
│  ├─► Structured RETURN with verification and escalation state           │
│  └─► Orchestrator-only dispatch under D3 convention                     │
│                                                                         │
│  IMPLEMENTATION MODES                                                   │
│  ├─► Full implementation, surgical fix, and refactor-only changes       │
│  ├─► Test-add, scaffold-new-file, rename-move, dependency-bump          │
│  └─► Escalate UNKNOWN stack, scope conflict, or low confidence          │
│                                                                         │
│  WORKFLOW                                                               │
│  ├─► 1. RECEIVE scope, success criteria, and spec-folder context        │
│  ├─► 2. READ packet docs, invoke sk-code, and load routed guidance      │
│  ├─► 3. IMPLEMENT with Builder → Critic → Verifier discipline           │
│  └─► 4. VERIFY fail-closed, then RETURN evidence to orchestrator        │
│                                                                         │
│  LIMITS                                                                 │
│  ├─► No spec-folder doc writes; application-code files only             │
│  ├─► LEAF-only: no sub-agent dispatch or nested task creation           │
│  ├─► No Bash write bypass outside scope or verification discipline      │
│  └─► No completion claim without stack-appropriate verification         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Questions Answered

- Q10 answered: the coder-side section 13 ASCII summary box is ready and mirrors the structural template from the review, write, and debug precedents.

## Questions Remaining

NONE - all 10 Stream-04 questions are resolved.

## Next Focus

Phase 3 synthesis: parent authors `research.md` from the resolved Q1-Q10 evidence set.
