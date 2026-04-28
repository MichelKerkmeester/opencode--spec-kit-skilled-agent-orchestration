# Executive Summary

**Verdict: CONDITIONAL.** Active findings: P0=0, P1=2, P2=2. `hasAdvisories: true`.

Scope covered one single-pass review of the Copilot file-based hook parity remediation across D1 correctness, D2 security, D3 traceability, and D4 maintainability. The managed-block merge is idempotent for the normal one-writer path, and diagnostics avoid prompt/stdout/stderr leakage. The release claim does not hold cleanly in the current checkout because the live Copilot hook config no longer routes `userPromptSubmitted` through the Spec Kit writer, and the global home-level custom-instructions block has no cleanup or scoping contract across sessions.

Convergence reason: single-pass requested by prompt, with all four requested review dimensions covered.

# Planning Trigger

Route this packet to remediation planning before treating the Copilot parity work as release-ready. The blocker is not the Copilot hook-output limitation itself; that limitation is correctly documented. The issue is that the current repository wiring and cleanup contract do not support the claimed file-based behavior reliably.

# Active Finding Registry

## P1-001: Current Copilot `userPromptSubmitted` wiring does not invoke the Spec Kit writer

**Severity:** P1  
**Dimension:** D1 Correctness / D3 Traceability  
**Status:** active  
**Evidence:** [.github/hooks/superset-notify.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.github/hooks/superset-notify.json:18), [.github/hooks/superset-notify.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.github/hooks/superset-notify.json:21), [implementation-summary.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/002-copilot-hook-parity-remediation/implementation-summary.md:72), [copilot-hook-wiring.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/copilot-hook-wiring.vitest.ts:26)

The implementation summary claims `.github/hooks/scripts/user-prompt-submitted.sh` routes `userPromptSubmitted` through the compiled writer before Superset notification. In the current checkout, `.github/hooks/` contains only `superset-notify.json`, and that JSON routes `userPromptSubmitted` to `/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh userPromptSubmitted`. The focused wiring test still expects `.github/hooks/scripts/user-prompt-submitted.sh`, but that script is absent. This means the custom-instructions writer can pass its direct unit tests while live Copilot prompts never refresh `$HOME/.copilot/copilot-instructions.md` through repo hook wiring.

**Concrete fix:** make one source of truth for Copilot hook installation. Either restore the repo-local `user-prompt-submitted.sh` wrapper and make `.github/hooks/superset-notify.json` point at it, or patch the Superset wrapper generator so the generated hook command invokes `dist/hooks/copilot/user-prompt-submit.js` before notification. Add a regression test that fails when the generated/checked-in hook config points only at Superset notification.

**Claim adjudication packet:**

| Role | Assessment |
|------|------------|
| Hunter | The release claim says the repository hook refreshes custom instructions; current config points somewhere else and the claimed script is missing. |
| Skeptic | A user-level Superset hook could invoke the writer internally. |
| Referee | Admit as P1. The reviewed repository cannot prove that external Superset behavior, while its own implementation summary and test name the missing repo-local wrapper as the integration point. |

## P1-002: The global custom-instructions block persists across sessions without a cleanup or scoping guard

**Severity:** P1  
**Dimension:** D2 Security / D4 Maintainability  
**Status:** active  
**Evidence:** [custom-instructions.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts:55), [custom-instructions.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts:58), [custom-instructions.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts:139), [custom-instructions.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts:140), [.github/hooks/superset-notify.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.github/hooks/superset-notify.json:11)

The writer defaults to `$HOME/.copilot/copilot-instructions.md` and writes the managed Spec Kit block there. That file is a global Copilot input, not a repo-local session cache. No reviewed path removes the managed block on `sessionEnd`, scopes it to the current workspace, adds an expiry guard, or prevents a later Copilot session in another repo from seeing stale startup/advisor context from the previous repo. Diagnostics are prompt-safe, but the managed file itself remains a durable cross-session artifact.

**Concrete fix:** add an explicit retention model. Reasonable options: write to a repo-scoped custom-instructions directory and wire `COPILOT_CUSTOM_INSTRUCTIONS_DIRS`, include workspace identity plus TTL and ignore stale/mismatched blocks, or add a Copilot `sessionEnd` cleanup command that removes only the managed block while preserving human instructions.

**Claim adjudication packet:**

| Role | Assessment |
|------|------------|
| Hunter | Home-level custom instructions are model-visible in later Copilot sessions and the writer has no cleanup path. |
| Skeptic | The block contains generated context, not raw prompt text; persistence is part of the workaround. |
| Referee | Admit as P1. The risk is stale/cross-repo context exposure and maintainability debt, not raw prompt leakage. The review prompt explicitly asked what the writer leaves between sessions. |

## P2-001: Custom-instructions writes are read-modify-write without locking or atomic replacement

**Severity:** P2  
**Dimension:** D1 Correctness  
**Status:** active  
**Evidence:** [custom-instructions.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts:119), [custom-instructions.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts:129), [custom-instructions.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts:140), [session-prime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:229), [user-prompt-submit.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:213)

`writeCopilotCustomInstructions()` reads the current file, renders a new block, merges, then writes the full file back. Both session-start and user-prompt paths can call the same writer. A late session-start write can overwrite a fresher user-prompt advisor block with the advisor fallback, and simultaneous writers can lose human edits made between read and write. The normal idempotency path is fine; concurrent mutation is unguarded.

**Concrete fix:** use a per-target lock plus atomic temp-file rename, or serialize writes through a small queue. Add a test that interleaves session-start and user-prompt writes and asserts the newest advisor block wins while human content remains intact.

## P2-002: Traceability evidence cites smoke outcomes without durable file:line artifacts, while validation remains red

**Severity:** P2  
**Dimension:** D3 Traceability  
**Status:** active  
**Evidence:** [checklist.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/002-copilot-hook-parity-remediation/checklist.md:41), [checklist.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/002-copilot-hook-parity-remediation/checklist.md:45), [implementation-summary.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/002-copilot-hook-parity-remediation/implementation-summary.md:120), [implementation-summary.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/002-copilot-hook-parity-remediation/implementation-summary.md:123)

The live Copilot smoke is recorded as prose, but there is no durable transcript path or file:line citation for the smoke itself. The same completion evidence also records target strict validation as failed. That is acceptable as a known limitation, but it weakens release-readiness traceability because a reviewer cannot replay or inspect the live-smoke evidence from the packet alone.

**Concrete fix:** add a redacted smoke transcript under `review/` or `scratch/` and cite it from checklist and summary. Keep validation failures separated into accepted documentation debt versus functional release gates.

# Remediation Workstreams

1. **Hook wiring repair:** restore or regenerate a Copilot `userPromptSubmitted` command that invokes `dist/hooks/copilot/user-prompt-submit.js`, then re-run focused wiring tests and a live/sandbox temp-file smoke.
2. **Persistence and cleanup:** define whether Copilot context is global, repo-scoped, TTL-scoped, or session-cleaned. Implement the chosen policy and document the operator behavior.
3. **Write robustness:** add locking or atomic write semantics around custom-instructions updates and cover concurrent session-start/user-prompt updates.
4. **Evidence hardening:** preserve smoke transcripts and reclassify validation failures so release claims cite durable artifacts.

# Spec Seed

Add or revise requirements in this packet:

- `REQ-010`: Copilot hook wiring must invoke the Spec Kit writer from the live hook config generated or checked into the repository.
- `REQ-011`: The managed Copilot custom-instructions block must have an explicit retention/scoping policy that prevents stale cross-repo context from persisting indefinitely.
- `REQ-012`: Custom-instructions writes must be safe under overlapping session-start and user-prompt hook execution.
- `REQ-013`: Live Copilot smoke evidence must be stored as a redacted artifact and cited from checklist evidence.

# Plan Seed

1. Inspect the current Superset wrapper generator and decide whether repository config or generator output owns Copilot hook wiring.
2. Patch the chosen wiring path so `userPromptSubmitted` runs the Spec Kit writer before Superset notification.
3. Add a focused test that parses the actual generated hook config and executes the resolved command with `SPECKIT_COPILOT_INSTRUCTIONS_PATH` pointed at a temp file.
4. Implement retention/scoping for the managed block, preferably with workspace identity and TTL or a session-end cleanup command.
5. Add concurrency tests around `writeCopilotCustomInstructions()`.
6. Capture a redacted smoke transcript and update `checklist.md` / `implementation-summary.md` evidence.

# Traceability Status

| Requirement / Check | Status | Notes |
|---------------------|--------|-------|
| REQ-001 extension surface research | Pass | ADR and research references are present. |
| REQ-002 decision matrix | Pass | ADR-003 contains the required matrix. |
| REQ-003 explicit A/B/C decision | Pass | Outcome B is accepted. |
| REQ-004 Claude regression | Partial | Claimed as passed; not re-run here because `npx vitest` attempted network access and failed before execution. |
| REQ-005 Copilot tests | Partial | Tests exist, but current repo hook config contradicts `copilot-hook-wiring.vitest.ts`. |
| REQ-006 cli-copilot docs | Pass with caveat | Docs explain file-based next-prompt behavior. They should add retention/cleanup details. |
| REQ-007 parent summary | Pass | Packet records outcome and limitations. |
| REQ-008 shell wrapper workaround | Pass | `cli-copilot/assets/shell_wrapper.md` exists and documents `cpx()`. |
| REQ-009 reusable investigation | Pass | Research folders exist and are cited. |

# Deferred Items

- Package-wide lint remains outside this review scope; the packet already records unrelated unused-variable failures.
- ACP client wrapper retirement path is deferred by ADR-003. That remains reasonable, but it needs a trigger condition such as "revisit when Copilot supports prompt-mutating customer hooks or stable ACP context injection."
- Spec validation remains red. Treat that as documentation-system debt, not proof that the hook writer works.

# Audit Appendix

## Dimension Coverage

| Dimension | Coverage |
|-----------|----------|
| D1 Correctness | Reviewed managed-block merge, live hook wiring, direct tests, session-start/user-prompt writer paths, and concurrency behavior. |
| D2 Security | Reviewed diagnostics schema, prompt-free logging, durable metrics path hashing, and managed file persistence. |
| D3 Traceability | Reviewed REQ mapping, checklist evidence, implementation-summary verification, and live-smoke citation quality. |
| D4 Maintainability | Reviewed ADR cleanup/retirement story, ACP deferral, docs, and release cleanup path. |

## Commands Attempted

- `npx vitest run .opencode/skill/system-spec-kit/mcp_server/tests/copilot-hook-wiring.vitest.ts --runInBand` did not execute tests. `npx` attempted to reach `https://registry.npmjs.org/vitest` and failed with `ENOTFOUND` under restricted network.

## Files Reviewed

- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `decision-record.md`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/copilot-hook-wiring.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/metrics.ts`
- `.github/hooks/superset-notify.json`
- `.claude/settings.local.json`
- `.opencode/skill/cli-copilot/SKILL.md`
- `.opencode/skill/cli-copilot/assets/shell_wrapper.md`

## Planning Packet

Recommended next packet: `003-copilot-hook-wiring-cleanup-and-retention`.

**Objective:** restore live Copilot writer wiring and make the file-based workaround safe to carry across sessions/releases.

**Acceptance gates:**

- Live `userPromptSubmitted` hook path refreshes a temp `SPECKIT_COPILOT_INSTRUCTIONS_PATH` file in a test and in one manual smoke.
- The global managed block has a documented retention/scoping policy and implementation.
- Concurrent writer test covers session-start plus prompt-submit overlap.
- Checklist evidence cites durable smoke artifacts by file:line.

**Release decision after remediation:** PASS when no active P1 findings remain; PASS with advisories is acceptable if only P2 concurrency hardening remains and the single-writer lifecycle is explicitly documented.
