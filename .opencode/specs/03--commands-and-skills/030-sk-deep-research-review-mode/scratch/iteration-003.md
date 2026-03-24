# Iteration 3: Q2 Minimum Viable Review Taxonomy

## Focus
Determine the smallest review taxonomy that still preserves audit rigor, using the current sk-deep-research review-mode contract plus comparison points from established review tools.

## Findings
1. The current review taxonomy is carrying the same concern in multiple layers. `spec-alignment`, `completeness`, and `cross-ref-integrity` are all traceability checks about whether claims, required artifacts, and evidence line up; `patterns` and `documentation-quality` both evaluate maintainability and operator clarity; and cross-reference logic appears both as its own dimension and again as a quality guard and a 6-protocol appendix. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:664-682] [SOURCE: .opencode/skill/sk-deep-research/references/quick_reference.md:262-280]
2. The current model is already leaking cognitive overhead into the docs. The runtime/state docs still say review mode evaluates "all 7" dimensions, while the quick reference says the score breakdown is based on "5-dimension scores," which is a concrete sign that the conceptual model is harder to keep synchronized than it should be. [SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:539-542] [SOURCE: .opencode/skill/sk-deep-research/references/quick_reference.md:286-287] [SOURCE: .opencode/skill/sk-deep-research/README.md:47-54]
3. Mature review tools usually separate a small "issue type" taxonomy from severity and gating rather than making every enforcement concept first-class. SonarQube uses three issue types (Bug, Vulnerability, Code Smell), a severity scale, and a lifecycle/status model; it does not expose a parallel operator taxonomy for evidence rules or protocol catalogs. [SOURCE: https://docs.sonarsource.com/sonarqube-server/10.3/user-guide/issues/:115-165]
4. Semgrep follows the same pattern: findings are organized around a compact concern model such as security, performance, correctness, and best-practice rulesets, while severity is a separate field with only three levels for Semgrep Code. Qlty similarly keeps issue categories compact (`Duplication`, `Structure`, `Vulnerabilities`) and then layers a simple high/medium/low level system on top. [SOURCE: https://semgrep.dev/docs/running-rules:103-132] [SOURCE: https://dev2.semgrep.dev/docs/kb/rules/understand-severities:49-59] [SOURCE: https://docs.qlty.sh/cloud/maintainability/metrics:93-108]
5. The minimum viable scored dimension set for review mode is 4 dimensions, not 7:
   - `correctness`: logic, state flow, error handling, edge cases
   - `security`: auth, permissions, data exposure, unsafe flows
   - `traceability`: merges `spec-alignment` + `completeness` + `cross-ref-integrity`
   - `maintainability`: merges `patterns` + `documentation-quality`

   This preserves the repo's two highest-risk lanes as explicit dimensions (`correctness`, `security`) while collapsing the three "does the artifact graph line up?" dimensions into one and the two maintainability/documentation lenses into one. That matches the external-tool pattern of using a few stable concern buckets plus separate severity/gate logic. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:664-682] [SOURCE: .opencode/skill/sk-deep-research/README.md:47-54] [SOURCE: https://docs.sonarsource.com/sonarqube-server/10.3/user-guide/issues/:117-130] [SOURCE: https://docs.qlty.sh/cloud/maintainability/metrics:95-107]
6. Quality guards should collapse from 5 named concepts to 3 binary gates:
   - `evidence`: combines `evidence-completeness` + `no-inference-only`
   - `scope`: keeps `scope-alignment`
   - `coverage`: combines `severity-coverage` + cross-reference applicability

   In this model, cross-reference is no longer a peer taxonomy next to dimensions; it becomes a required verification method inside `traceability` when the target contains claim-bearing artifacts. This keeps rigor but removes the need for operators to track guards and protocols as separate mental systems. [SOURCE: .opencode/skill/sk-deep-research/references/quick_reference.md:262-270] [SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:624-637]
7. Verdicts can be reduced from 4 to 3 top-level states without losing information:
   - `FAIL`: any active P0, or a hard gate failure
   - `CONDITIONAL`: no P0, but active P1 remains
   - `PASS`: no active P0/P1

   `PASS WITH NOTES` should become `PASS` plus advisory metadata (`hasAdvisories: true`, or non-zero P2 count) instead of a fourth verdict. This keeps the current release semantics while shrinking operator-facing branching. The same general pattern appears in GitHub code scanning and Sonar quality gates, where severity thresholds determine pass/fail behavior and extra metadata rides alongside the gate result rather than becoming a new verdict family. [SOURCE: .opencode/skill/sk-deep-research/references/quick_reference.md:253-260] [SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:678-687] [SOURCE: https://docs.github.com/en/code-security/how-tos/manage-security-alerts/manage-code-scanning-alerts/triaging-code-scanning-alerts-in-pull-requests?learn=security_alerts&learnProduct=code-security:551-559] [SOURCE: https://docs.github.com/en/code-security/how-tos/manage-security-alerts/manage-code-scanning-alerts/triaging-code-scanning-alerts-in-pull-requests?learn=security_alerts&learnProduct=code-security:573-573]
8. Numeric composite scoring should be demoted from gate logic to reporting-only telemetry. The current contract still includes an overall score threshold and score breakdown alongside severity-driven verdict rules, which creates two competing decision systems. External tools more often use issue categories + severity + pass/fail conditions than a single blended score, and that is a better fit here because it avoids "documentation quality" offsetting a correctness or security blocker. Recommended scoring concept:
   - Verdicts come from severity + binary gates
   - Dimension scores are optional summary telemetry for dashboards and trend reporting
   - Convergence reduces to 3 operational concepts: `novelty` (rolling severity-weighted ratio), `coverage` (required dimensions complete), and `stability` (no new P0/P1 plus low-change repeat). The P0 override stays, but as a hard blocker rather than a weighted signal. [SOURCE: .opencode/skill/sk-deep-research/references/quick_reference.md:255-280] [SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:540-542] [SOURCE: https://docs.sonarsource.com/sonarqube-server/10.3/user-guide/issues/:157-165] [SOURCE: https://docs.qlty.sh/cloud/maintainability/metrics:105-111]

### Proposed Simplified Taxonomy

| Layer | Proposed minimum viable model | Notes |
|---|---|---|
| Review dimensions | `correctness`, `security`, `traceability`, `maintainability` | Only operator-facing scored dimensions |
| Severity | `P0`, `P1`, `P2` | Keep unchanged |
| Gates | `evidence`, `scope`, `coverage` | Binary release guards |
| Verdicts | `FAIL`, `CONDITIONAL`, `PASS` | `PASS WITH NOTES` becomes PASS + advisory metadata |
| Protocols | protocol IDs as tagged checks under `traceability` | Keep catalog, remove from core taxonomy |
| Convergence | `novelty`, `coverage`, `stability` | Operational logic, not user-facing taxonomy |

### Old-to-New Migration Map

| Old concept | New home |
|---|---|
| `correctness` | `correctness` |
| `security` | `security` |
| `spec-alignment` | `traceability` |
| `completeness` | `traceability` |
| `cross-ref-integrity` | `traceability` |
| `patterns` | `maintainability` |
| `documentation-quality` | `maintainability` |
| `evidence-completeness` | `evidence` gate |
| `no-inference-only` | `evidence` gate |
| `scope-alignment` | `scope` gate |
| `severity-coverage` | `coverage` gate |
| `cross-reference` guard | `coverage` gate + `traceability` protocol execution |
| `PASS WITH NOTES` | `PASS` + `hasAdvisories: true` |
| `rolling-average` + `mad-noise-floor` | `novelty` / `stability` |
| `dimension-coverage` | `coverage` |
| `p0_override` | hard blocker, not weighted signal |
| 6 cross-reference protocols | protocol catalog invoked under `traceability` when applicable |

## Ruled Out
- Keeping all 7 dimensions as the operator-facing core taxonomy. The overlap is too high, and the doc surface is already showing synchronization strain. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:664-682] [SOURCE: .opencode/skill/sk-deep-research/references/quick_reference.md:286-287]
- Using the numeric composite score as the primary release gate. It creates a second decision system that can conflict with severity-based blocking logic. [SOURCE: .opencode/skill/sk-deep-research/references/quick_reference.md:255-280] [SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:678-687]
- Treating the 6 cross-reference protocols as a peer taxonomy beside dimensions, guards, and verdicts. They are better modeled as verification methods under `traceability`, with deeper restructuring deferred to Q4. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:674-682] [SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:624-637]

## Dead Ends
- CocoIndex semantic search again did not help much on this markdown/config-heavy problem; exact reads plus external product docs carried most of the signal this round.
- Code Climate itself was a weak comparison source because its current documentation surface has largely shifted to Qlty, so Qlty was the more useful current official reference.

## Sources Consulted
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml`
- `.opencode/skill/sk-deep-research/references/quick_reference.md`
- `.opencode/skill/sk-deep-research/references/loop_protocol.md`
- `.opencode/skill/sk-deep-research/references/state_format.md`
- `.opencode/skill/sk-deep-research/README.md`
- `https://docs.sonarsource.com/sonarqube-server/10.3/user-guide/issues/`
- `https://semgrep.dev/docs/running-rules`
- `https://dev2.semgrep.dev/docs/kb/rules/understand-severities`
- `https://docs.qlty.sh/cloud/maintainability/metrics`
- `https://docs.github.com/en/code-security/how-tos/manage-security-alerts/manage-code-scanning-alerts/triaging-code-scanning-alerts-in-pull-requests?learn=security_alerts&learnProduct=code-security`

## Assessment (newInfoRatio, questions addressed/answered)
- `newInfoRatio`: `0.58`
- Addressed: `Q2`
- Answered this iteration: `Q2`. The minimum viable operator model is now concrete: 4 dimensions, 3 gates, 3 verdicts, unchanged severities, and protocol IDs demoted to tagged verification methods instead of a separate taxonomy.

## Reflection
- Worked: comparing the repo's current taxonomy against SonarQube, Semgrep, Qlty, and GitHub made the right abstraction boundary much clearer. The common pattern is "small concern taxonomy + severity + gate," not many peer taxonomies.
- Worked: checking exact current repo lines surfaced a real symptom of overload, not just a theoretical one: the docs already disagree on whether review scoring is 5-dimensional or 7-dimensional.
- Failed: semantic search still had low value on this doc-heavy topic, so this iteration depended more on targeted line reads and official product docs than code-search tooling.
- Caution: the protocol catalog likely still needs redesign, but doing that inside Q2 would blur into Q4. For now the cleaner move is to remove protocols from the operator-facing taxonomy, not redesign all 6.

## Recommended Next Focus
Q3: validate the simplified model against convergence behavior. Specifically:
1. Test whether the reduced taxonomy changes the meaning of `newFindingsRatio`, stuck detection, and dimension-coverage stop logic.
2. Build a small simulation or replay method over prior review iterations to compare old vs proposed stop decisions.
3. Decide which thresholds should be re-fit once `PASS WITH NOTES` and score-driven gating are simplified.
