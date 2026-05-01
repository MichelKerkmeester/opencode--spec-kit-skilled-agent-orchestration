# Iteration 2 - Q2: Coder Dispatch Modes

## Focus

This iteration validated coder-side implementation modes for the proposed expanded `.opencode/agent/code.md`. The target was a drop-in mode-selection table mirroring `@review` section 4, but from the implementation side: what dispatch wording selects the mode, what the coder may skip from the standard six-step workflow, and what return signals the orchestrator receives.

## Actions Taken

1. Read `.opencode/agent/review.md:101-111` to mirror the four-column mode-selection structure used by `@review`: Mode, Trigger, Focus, Output.
2. Read `.opencode/agent/write.md:206-217` to compare another write-capable LEAF agent's mode table and completion threshold rule.
3. Read `.opencode/agent/debug.md:95-105` to reuse the Fast Path and Context Package pattern for safe workflow compression.
4. Read `.opencode/skill/sk-code/SKILL.md:50-62` to bind every implementation mode to the Phase 0-3 lifecycle and the Iron Law.
5. Synthesized and validated the seven proposed coder modes against those sources.

## Findings

- F-iter002-001 (P1): `@code` should expose explicit implementation modes rather than relying on prose-only dispatch interpretation - citation: `.opencode/agent/review.md:101-111` - evidence: `@review` uses a compact mode-selection table with Trigger, Focus, and Output, giving orchestrators predictable dispatch and return shapes.
- F-iter002-002 (P1): The coder mode table should mirror the `@write` pattern of mode-specific key steps and per-mode validation expectations - citation: `.opencode/agent/write.md:206-217` - evidence: `@write` has four documentation modes, each selected by trigger and tied to different steps and delivery thresholds.
- F-iter002-003 (P1): Mode-specific skips must be limited to compression, not skipping `sk-code`, quality gates, verification, or return reporting - citation: `.opencode/skill/sk-code/SKILL.md:50-62` - evidence: `sk-code` owns Phase 1 implementation, Phase 1.5 quality gate, Phase 2 debugging, Phase 3 verification, and the Iron Law against completion claims without fresh verification evidence.
- F-iter002-004 (P2): The debug agent provides the safest precedent for skips: low-complexity work may compress formal phases, and a Context Package may skip memory/context reconstruction, but the agent still performs the work and reports results - citation: `.opencode/agent/debug.md:95-101` - evidence: the Fast Path compresses methodology into one pass and Context Package dispatch skips Layer 1 memory checks only.
- F-iter002-005 (P1): Keep the seven suggested modes, with minor naming normalization. None are redundant enough to collapse because each changes either the skipped workflow surface or the orchestrator's expected RETURN signals.

## Questions Answered

Q2 is resolved. The seven-mode set is valid when defined as dispatch/return modes, not as permission to bypass the standard workflow. The recommended drop-in table is:

```markdown
## 4. IMPLEMENTATION MODES

### Mode Selection

| Mode | Trigger | Focus | Skips From Standard Workflow | RETURN Signals |
| --- | --- | --- | --- | --- |
| **1: Full Implementation** | "Implement/build/add feature...", multi-file behavior change, new workflow, or task with acceptance criteria spanning code and tests. | Complete requested behavior using `sk-code` Phase 0-3 as needed. | Skips nothing. If complexity is low, Phase 0 can be brief, but RECEIVE, READ PACKET, INVOKE `sk-code`, IMPLEMENT, VERIFY, and RETURN all remain required. | `DONE` or `BLOCKED`; changed files; behavior implemented; acceptance criteria covered; quality-gate result; exact verification commands/results; unresolved P1/P2 follow-ups. |
| **2: Surgical Fix** | "Fix this bug/error/failing check...", narrow failing path, named function/file, or orchestrator-provided diagnosis. | Minimal corrective edit with regression protection. | Skips broad Phase 0 research and unrelated packet expansion when the dispatch includes a structured context package. Does not skip targeted read, `sk-code`, implementation, verification, or return evidence. | `DONE` or `BLOCKED`; root cause in one sentence; files changed; regression test/check added or reason omitted; failing command before/after when available; verification evidence. |
| **3: Refactor Only** | "Refactor/restructure/clean up this area without behavior change..." with explicit no-behavior-change constraint. | Preserve behavior while improving structure, readability, ownership boundaries, or duplication. | Skips new feature design and product acceptance expansion. Skips behavior changes unless required to preserve existing contracts. Does not skip caller/contract reads or verification. | `DONE` or `BLOCKED`; files changed; behavior-preservation statement; compatibility/caller notes; tests or equivalence checks run; any intentionally unchanged rough edges. |
| **4: Test Add** | "Add coverage/test for...", "write regression test...", "cover this case..." where production behavior is intended to stay stable. | Add or adjust tests, fixtures, and minimal test support only. | Skips production implementation unless the test exposes a verified bug or needs a tiny in-scope test seam. Skips broad refactor and feature work. | `DONE` or `BLOCKED`; tests added/changed; scenario covered; production files touched, if any, with reason; exact test command/result; failure explanation if the new test exposes an existing bug. |
| **5: Scaffold New File** | "Create/scaffold a new module/file/command/component..." with expected shape but limited behavior. | Create the requested file structure and minimal integration points following `sk-code` stack conventions. | Skips full feature completion beyond the requested scaffold. Skips broad caller migration unless explicitly requested. Does not skip template/pattern reads or syntax verification. | `DONE` or `BLOCKED`; new files; integration hooks added; placeholders/TODOs only if requested or locally conventional; syntax/build check; remaining implementation surface. |
| **6: Rename/Move** | "Rename/move this file/symbol/path..." with behavior intended unchanged. | Mechanical relocation plus import/reference updates. | Skips behavior implementation, new tests, and refactor opportunism. Does not skip reference search, dependent import updates, or verification. | `DONE` or `BLOCKED`; old -> new path/name map; references updated; compatibility shims if any; commands proving references/build/tests pass; unresolved external references if blocked. |
| **7: Dependency Bump** | "Bump/update/upgrade dependency..." including lockfile, config, or compatibility task. | Update dependency metadata and handle required compatibility changes. | Skips unrelated feature work and broad modernization. Skips source edits unless required by the dependency change. Does not skip changelog/API check when needed or verification. | `DONE` or `BLOCKED`; package/version changes; lockfile/config changes; compatibility edits; install/build/test/security command results; breaking-change notes and rollback risk. |

**Mode invariant:** Modes change how much discovery and implementation surface the coder takes on. They never remove the obligation to invoke `sk-code`, respect scope, run the relevant quality gate, collect fresh verification evidence, and return an explicit status.
```

## Questions Remaining

- Q3 - Pre/During/Post-implementation checklists: universal items plus stack-aware items through `sk-code`
- Q4 - Output verification protocol and coder-side Iron Law
- Q5 - Adversarial self-check
- Q6 - Coder-specific anti-patterns
- Q7 - Confidence levels
- Q8 - RETURN contract refinement
- Q9 - Skill loading precedence
- Q10 - ASCII summary box

## Next Focus

Q3 - Coder checklists. Build Pre-Implementation, During-Implementation, and Pre-Return checklists that stay codebase-agnostic while delegating stack-specific checks to `sk-code`.
