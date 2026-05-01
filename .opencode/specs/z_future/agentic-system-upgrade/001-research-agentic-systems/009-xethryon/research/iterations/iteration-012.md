# Iteration 012 — Feature Claims Need Verification Mapping, Not Just CI Presence

Date: 2026-04-10

## Research question
Should `system-spec-kit` require deep-research findings to map feature claims to explicit verification artifacts instead of treating the existence of CI and tests as sufficient evidence?

## Hypothesis
Yes. README claims can look credible in a repo with healthy CI, but unless a researcher maps each flagship claim to tests or an explicit coverage gap, CI presence creates false confidence.

## Method
I compared Xethryon's feature claims with its CI workflow, package-level test entrypoints, and the visible test tree. I then compared that evidence discipline with Spec Kit's current deep-research contract.

## Evidence
- Xethryon's README makes concrete product claims about persistent memory, self-reflection, git-aware context, autonomy mode, autonomous skill invocation, and swarm orchestration. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/README.md:11-18] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/README.md:27-64]
- CI runs `bun turbo test` for unit tests and a separate app e2e suite, but the workflow does not disclose a feature-by-feature verification map for Xethryon's flagship additions. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/.github/workflows/test.yml:48-55] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/.github/workflows/test.yml:104-109]
- The package-level test script is generic: `bun test --timeout 30000`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/package.json:8-12]
- A direct `rg` sweep over `external/packages/opencode/test` returned no hits for `xethryon`, `autodream`, `switch_agent`, `invoke_skill`, `team_create`, `swarm`, `reflection`, or `memoryHook`, while the visible test tree is dominated by generic `util/`, `file/`, `plugin/`, `server/`, and provider suites. [INFERENCE: exact-name coverage for flagship Xethryon surfaces was not visible in the test tree even though CI is healthy]
- Spec Kit's deep-research workflow requires citations and reducer-owned outputs, but it does not currently force the researcher to attach a verification source to each material external claim. [SOURCE: .opencode/agent/deep-research.md:113-120] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:328-359]

## Analysis
Phase 1's claim-status ledger solved only half the problem: it forces a verdict, but not the basis of confidence. Xethryon shows the remaining gap clearly. A repo can have mature CI and still leave the reader unable to tell whether a claimed flagship behavior is directly exercised, indirectly covered, or not obviously tested at all. Research packets need to make that difference explicit. Otherwise "there are tests" gets mistaken for "this claim is well verified."

## Conclusion
confidence: high

finding: Spec Kit should extend deep-research outputs with a verification-evidence field per major external claim. For each claim, the researcher should record either a direct test/source, indirect supporting evidence, or an explicit absence-of-coverage note.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/deep-research.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** pair this with Phase 1's claim-status ledger so each claim records both verdict and verification basis
- **Priority:** must-have

## Counter-evidence sought
I looked for an obvious test suite or README section that mapped Xethryon's advertised features to concrete verification artifacts. I found CI and generic tests, but not a clear claim-to-verification bridge.

## Follow-up questions for next iteration
- If Xethryon uses prompt-authored markdown memory to keep the UX simple, does that simplicity reveal a better memory architecture for Spec Kit, or does it only hide risk?
