# Iteration 018 — Project Orientation Should Stay Read-Only and Branch-Aware

Date: 2026-04-10

## Research question
If `system-spec-kit` wants some of Xethryon's ambient project orientation, what is the right architecture: durable repo-global memory, or a lighter read-only orientation surface?

## Hypothesis
The correct move is a read-only, branch-aware orientation surface layered on top of current state and recent artifacts. Durable repo-global memory is the wrong shape because it blurs time-sensitive workspace facts with long-lived knowledge.

## Method
I re-examined Xethryon's auto-memory path rules and compared them with Spec Kit's memory guidance and bootstrap/resume surface design.

## Evidence
- Xethryon's auto-memory directory is keyed to a sanitized project root and is intentionally shared across worktrees of the same repo. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/paths.ts:92-129]
- Xethryon's own memory guidance says not to save code patterns, git history, or project structure because those are derivable from current state. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/memoryTypes.ts:183-202]
- Spec Kit already distinguishes durable memory from current-state recovery surfaces: startup/recovery uses `session_bootstrap()` and `session_resume()`, while memory guidance explicitly warns that memories can drift and should be verified against current state before acting. [SOURCE: .opencode/skill/system-spec-kit/README.md:93-99] [SOURCE: .opencode/skill/system-spec-kit/README.md:170-179] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:103-105] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/memoryTypes.ts:197-202]
- Spec Kit's current save contract keeps durable memory scoped and explicit rather than silently promoting current workspace facts into long-lived memory. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:75-84]

## Analysis
Xethryon's ambient orientation works because the system always starts from a project-root memory namespace. But that same choice makes worktree and branch distinctions much easier to blur. Spec Kit already has the healthier conceptual split: current-state orientation belongs in bootstrap/resume, while durable memory should capture decisions and context worth preserving. The right simplification is therefore not "repo-global memory," but "faster current-state orientation."

## Conclusion
confidence: high

finding: Spec Kit should prototype a branch-aware orientation surface that is generated from current state and recent artifacts, not auto-saved as durable memory. This keeps the useful feel of ambient continuity without weakening memory hygiene.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** durable memories are explicit and scoped; current-state awareness is handled by resume/bootstrap and direct reads.
- **External repo's approach:** repo-global project memory provides ambient orientation, even across worktrees.
- **Why the external approach might be better:** it gives immediate orientation at the start of every session with little operator effort.
- **Why system-spec-kit's approach might still be correct:** current-state orientation and durable memory are different concerns. Mixing them increases drift and branch contamination risk.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** add a read-only orientation block to bootstrap/resume that summarizes active branch, dirty state, recent spec folder, and latest relevant implementation summary or research output without writing any new durable memory.
- **Blast radius of the change:** medium
- **Migration path:** start with bootstrap/resume display only; do not change memory save behavior.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define branch-aware fields and freshness rules so the orientation block stays read-only and current-state based
- **Priority:** should-have

## Counter-evidence sought
I looked for evidence that Xethryon's repo-global memory cleanly separated current-state orientation from durable long-lived knowledge. I did not find that separation.

## Follow-up questions for next iteration
- Does the amount of machinery in Spec Kit's Level 1/2/3 + validation system still look justified after comparing it with Xethryon's lighter documentation posture?
