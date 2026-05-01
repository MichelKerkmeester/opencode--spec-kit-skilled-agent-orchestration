# Iteration 010 — Guard Claims And Overlap Boundaries

## Research question
Is there a real BAD orchestrator guard or `PreToolUse`-style enforcement mechanism in the repo snapshot, and what should `system-spec-kit` do with that claim?

## Hypothesis
BAD documents a strict coordinator rule, but the snapshot does not contain a concrete hook implementation proving the rule is technically enforced.

## Method
Reviewed BAD's coordinator contract, setup asset, and manifest packaging for any guard artifact, then compared those results to the local constitutional enforcement and tool-routing surfaces.

## Evidence
- BAD repeatedly states that the coordinator never reads files or writes code and should delegate all operational work. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:16-25]
- BAD's setup asset detects harness directories and writes configuration/help files, but it does not create a hook, guard manifest, or permission policy that would technically enforce coordinator-only behavior. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module-setup.md:24-38]
- BAD's bundled manifest only registers the plugin and skill path; it does not advertise a hook or guard surface. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/.claude-plugin/marketplace.json:22-32]
- Local constitutional routing explicitly maps which retrieval tool to use for which class of problem. [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:31-55]
- Local constitutional gate guidance explicitly names Gate 3 as a hard block and cross-references continuation/memory rules, so there is at least a real documented enforcement surface in this repo even when runtime hooks are absent. [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:58-103]

## Analysis
I found no BAD artifact equivalent to a concrete `PreToolUse` hook. The repo snapshot supports the coordinator boundary as a documented operating principle, not as an implementation-enforced permission barrier. That matters because phase 003 is already researching hook/workflow enforcement more directly, while phase 005 covers broader multi-agent/worktree architecture. Phase 008 should therefore keep ownership of the sprint-automation lesson, but it should tag any hard-guard recommendation as overlap rather than claiming BAD proved it.

## Conclusion
confidence: high

finding: BAD's coordinator guard is unverified in this snapshot. `system-spec-kit` should not copy the claim as fact. If the project wants stronger orchestration enforcement, it should prototype it from real local hook-capable surfaces and treat BAD only as evidence that the boundary is worth articulating, not that the mechanism already exists.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md`
- **Change type:** rejected
- **Blast radius:** small
- **Prerequisites:** real hook/runtime support would be needed before upgrading this from documentation to enforcement
- **Priority:** rejected

## Counter-evidence sought
I looked for any BAD hook file, manifest-level permission stanza, or generated enforcement artifact. None appeared in the bundled snapshot, so the claim remains documentary only.

## Follow-up questions for next iteration
None. This iteration closes the open evidence gap and tags the phase-003/phase-005 overlap explicitly.
