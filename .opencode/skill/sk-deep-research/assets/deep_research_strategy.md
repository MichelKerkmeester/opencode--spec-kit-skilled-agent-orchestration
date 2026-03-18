---
title: Deep Research Strategy Template
description: Strategy file template copied to scratch/ during initialization to track research progress across iterations.
---

# Research Strategy

## Topic
[Research topic from config -- set during initialization]

## Key Questions (remaining)
- [ ] [Question 1 -- identified during initialization or iteration 1]
- [ ] [Question 2]
- [ ] [Question 3]

## Answered Questions
[None yet -- populated as iterations answer questions]

## What Worked
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it worked] (iteration N)

## What Failed
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it failed] (iteration N)

## Exhausted Approaches (do not retry)
[Populated when an approach has been tried from multiple angles without success]

### [Category Name] -- BLOCKED (iteration N, N attempts)
- What was tried: [specific approaches attempted]
- Why blocked: [root cause of exhaustion]
- Do NOT retry: [explicit prohibition]

### [Category Name] -- PRODUCTIVE (iteration N)
- What worked: [successful approaches in this category]
- Prefer for: [related questions where this category may help]

## Next Focus
[Recommended focus area for the next iteration -- updated at end of each iteration]

## Known Context
[Populated during initialization from memory_context() results, if any prior work exists]

## Research Boundaries
- Max iterations: [from config]
- Convergence threshold: [from config]
- Progressive synthesis: true (default)
- research.md ownership: workflow-owned canonical synthesis output
- Reference-only modes: `:restart`, segment partitioning, wave pruning, checkpoint commits, alternate `claude -p` dispatch
- Current segment: 1
- Started: [timestamp]
