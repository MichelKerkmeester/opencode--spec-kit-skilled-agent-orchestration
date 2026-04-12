# Iteration 009 — Config Surface And Contract Drift

## Research question
What does BAD's packaging/config surface reveal about module safety, and how should `system-spec-kit` guard against similar path drift?

## Hypothesis
BAD's repo has a real config-path inconsistency, and the strongest local response is to keep expanding contract-parity tests around multi-file command/skill surfaces.

## Method
Read BAD's skill activation, setup asset, README, docs index, module manifest, and looked for actual config files in the snapshot. Compared that to the local deep-research contract-parity test pattern.

## Evidence
- BAD activation checks `{project-root}/_bmad/config.yaml` for a `bad` section, but its Configuration section says startup loads base values from `_bmad/bad/config.yaml`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:10-14]
- BAD setup writes shared config to `{project-root}/_bmad/config.yaml`, user overrides to `_bmad/config.user.yaml`, and registers help entries separately. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module-setup.md:9-17]
- BAD setup also re-checks `_bmad/config.yaml` for the `bad` section, reinforcing that path. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module-setup.md:18-23]
- BAD's public README and docs index both claim the module stores settings in `_bmad/bad/config.yaml`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:61-74]
- BAD's checked-in docs do not self-resolve the conflict: setup writes `_bmad/config.yaml`, while public docs keep telling users to expect `_bmad/bad/config.yaml`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module-setup.md:9-23] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:61-74]
- Local `deep-research-contract-parity` tests already assert canonical artifact names across primary docs, runtime mirrors, and command assets, which is exactly the kind of guard BAD needed here. [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:24-84]

## Analysis
BAD's mismatch is not subtle: the skill and public docs disagree with the setup asset about where canonical config lives. Because the repo snapshot is mostly documentation and setup logic, this kind of inconsistency is particularly dangerous; users will follow whichever document they see first. `system-spec-kit` already has a strong response pattern in its contract-parity tests. The adoption opportunity is to treat every future multi-file automation surface the same way: declare canonical paths once, then fail tests when docs and assets drift.

## Conclusion
confidence: high

finding: BAD's config-path inconsistency is a concrete example of why parity tests matter. `system-spec-kit` should keep scaling its contract-test approach whenever it adds new command/agent/asset bundles, especially if those bundles introduce runtime-specific paths or setup-time file writes.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts`
- **Change type:** new module
- **Blast radius:** small
- **Prerequisites:** define canonical path ownership for any new sprint-automation assets before writing the parity assertions
- **Priority:** should-have

## Counter-evidence sought
I searched the external snapshot for an actual `config.yaml` that would settle the path question and found none, so I treated the conflict as unresolved rather than guessing which doc was right.

## Follow-up questions for next iteration
Is BAD's claimed orchestrator guard backed by any real hook or manifest-level enforcement?
How does that compare to local constitutional routing and gate memory?
Which findings belong partly to phase 003 or 005 rather than staying phase-008-owned?
