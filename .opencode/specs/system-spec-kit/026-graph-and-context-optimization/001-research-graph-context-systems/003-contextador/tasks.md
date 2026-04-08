---
title: "Tasks: Contextador Research Phase (003-contextador)"
description: "Task list for the 003-contextador research packet covering scaffolding, deep-research loop, synthesis, and memory save."
trigger_phrases:
  - "contextador tasks"
  - "deep research tasks"
  - "phase 003 tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Contextador Research Phase

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phase folder pre-approval and skip Gate 3 (003-contextador/)
- [x] T002 Read phase-research-prompt.md and identify reading order, deliverables, completion bar
- [x] T003 [P] Verify cli-codex CLI availability and gpt-5.4 high routing
- [x] T004 Run validate.sh --strict baseline pass (expected to fail until scaffold lands)
- [x] T005 Scaffold Level 3 spec.md (003-contextador/spec.md)
- [x] T006 Scaffold Level 3 plan.md (003-contextador/plan.md)
- [x] T007 Scaffold Level 3 tasks.md (003-contextador/tasks.md) <!-- this file -->
- [x] T008 Scaffold Level 3 checklist.md (003-contextador/checklist.md)
- [x] T009 Scaffold Level 3 decision-record.md (003-contextador/decision-record.md)
- [x] T010 Re-run validate.sh --strict and confirm clean exit (or only documented warnings)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- Implementation phase = the deep research loop. The "implementation" here is research execution per phase prompt scope. -->
### Phase 2: Deep Research Loop

- [x] T011 Load prior context via `memory_context` for the research topic
- [x] T012 Initialize sk-deep-research state files (config.json, state.jsonl, strategy.md, findings-registry.json)
- [x] T013 Iteration 1 - read external/src/mcp.ts and trace `server.tool(...)` registrations (cli-codex gpt-5.4 high)
- [x] T014 Iteration 2 - trace query routing in headmaster.ts, hierarchy readers, pointer extraction, stats tracking
- [x] T015 Iteration 3 - trace self-healing loop in feedback.ts, janitor.ts, generator.ts, enrichFromFeedback
- [x] T016 Iteration 4 - trace Mainframe in bridge.ts, client.ts, rooms.ts, dedup.ts, summarizer.ts
- [x] T017 Iteration 5 - read package.json, README, TROUBLESHOOTING, LICENSE-COMMERCIAL for setup, claims, licensing
- [x] T018 Iteration 6 - compare against current Public retrieval surfaces (CocoIndex, Code Graph MCP, Spec Kit Memory)
- [x] T019 [P] Run reduce-state.cjs after each iteration to refresh registry/dashboard/strategy
- [x] T020 Convergence check after each iteration; stop early if convergence is reached
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- Verification phase = synthesis, checklist verification, summary, and memory save. -->
### Phase 3: Synthesis and Save

- [x] T021 Compile research/research.md with at least 5 findings using the minimum schema
- [x] T022 Append the convergence report appendix to research/research.md
- [x] T023 Update checklist.md with evidence and final marks
- [x] T024 Create implementation-summary.md
- [x] T025 Run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js 003-contextador`
- [x] T026 Verify memory artifact exists in 003-contextador/memory/
- [x] T027 Re-run validate.sh --strict for final compliance
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] research/research.md cites real source paths for every finding
- [x] checklist.md verification summary completed
- [x] memory/*.md present
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Phase Prompt**: See `scratch/phase-research-prompt.md`
- **Final Output**: See research/research.md (populated during synthesis)
<!-- /ANCHOR:cross-refs -->
