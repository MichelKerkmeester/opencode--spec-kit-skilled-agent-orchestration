# Iteration 2: Q1 Continuation - Canonical Contract Manifest and Propagation Workflow

## Focus
Design the exact canonical review-mode contract manifest, define ownership boundaries for generated vs mixed-authored artifacts, and specify the drift-detection checks that should protect YAML workflows, agent docs, quick reference, README, and playbooks.

## Findings
1. The canonical source should be a neutral manifest file owned by `sk-deep-research`, not a workflow YAML or prose doc, because the current contract is split across workflow inputs and appendix constants, agent JSONL instructions, state-format tables, quick-reference tables, README capability bullets, and command docs. A manifest should therefore normalize the contract into four top-level domains: `meta`, `contract`, `render`, and `validation`. This is the closest fit to the repo's existing "source components -> composed outputs -> verify drift" pattern in `system-spec-kit`. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:28-35] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:650-682] [SOURCE: .opencode/agent/deep-review.md:225-258] [SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:536-575] [SOURCE: .opencode/skill/sk-deep-research/references/quick_reference.md:253-296] [SOURCE: .opencode/skill/sk-deep-research/README.md:47-55] [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:49-70] [SOURCE: .opencode/skill/system-spec-kit/scripts/templates/compose.sh:6-12] [SOURCE: .opencode/skill/system-spec-kit/scripts/templates/compose.sh:17-20]

   Proposed manifest path and shape:

   ```yaml
   manifestVersion: 1
   contractId: sk-deep-research.review-mode
   meta:
     ownerSkill: .opencode/skill/sk-deep-research
     reviewModeVersion: 1
     generatedNotice: "<!-- GENERATED: review-mode-contract; DO NOT EDIT -->"
     sourceOfTruth: "contract-only"
   contract:
     targetTypes: {}
     dimensions: {}
     severities: {}
     verdicts: {}
     qualityGuards: {}
     convergence: {}
     crossReferenceProtocols: {}
     outputs: {}
     jsonl: {}
   render:
     artifacts: []
   validation:
     schemaVersion: 1
     checks: []
   ```

2. The exact contract payload should use stable IDs and ordered arrays so generators can render both machine-oriented consumers and human tables without hand-written ordering rules. The schema below covers every duplicated review-mode concept visible today: target types, 7 dimensions, P0/P1/P2 severities, 4 verdicts, 5 quality guards, convergence defaults and weights, 6 cross-reference protocols, 11 report sections, strategy/dashboard section mappings, and JSONL field contracts. This is an inference from the currently duplicated runtime and docs surfaces. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:29-35] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:511-559] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:656-682] [SOURCE: .opencode/agent/deep-review.md:228-258] [SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:538-575] [SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:626-687] [SOURCE: .opencode/skill/sk-deep-research/references/quick_reference.md:255-296] [SOURCE: .opencode/skill/sk-deep-research/README.md:48-55]

   Proposed `contract` schema:

   ```yaml
   contract:
     targetTypes:
       default: spec-folder
       items:
         - id: spec-folder
           cliValue: spec-folder
           label: Spec Folder
           description: Review one spec folder and its tracked artifacts
         - id: skill
           cliValue: skill
           label: Skill
         - id: agent
           cliValue: agent
           label: Agent
         - id: track
           cliValue: track
           label: Track
         - id: files
           cliValue: files
           label: Files
     dimensions:
       order:
         - correctness
         - security
         - spec-alignment
         - completeness
         - cross-ref-integrity
         - patterns
         - documentation-quality
       items:
         - id: correctness
           priority: 1
           label: Correctness
           checks: Logic, state flow, edge cases, error handling
           requiredForSeverityCoverage: true
         - id: security
           priority: 2
           label: Security
           checks: Auth, input/output safety, data exposure, permissions
           requiredForSeverityCoverage: true
         - id: spec-alignment
           priority: 3
           label: Spec Alignment
           checks: Spec/plan/tasks/checklist claims vs shipped reality
         - id: completeness
           priority: 4
           label: Completeness
           checks: Required files, sections, tests, checklist coverage
         - id: cross-ref-integrity
           priority: 5
           label: Cross-Ref Integrity
           checks: IDs, links, root-to-snippet alignment, runtime anchors
         - id: patterns
           priority: 6
           label: Patterns
           checks: Baseline and overlay compliance, template shape, conventions
         - id: documentation-quality
           priority: 7
           label: Documentation Quality
           checks: Current-reality honesty, operator clarity
     severities:
       order: [P0, P1, P2]
       items:
         - id: P0
           weight: 10.0
           label: Blocker
           requiresFileLineEvidence: true
         - id: P1
           weight: 5.0
           label: Required
           requiresFileLineEvidence: true
         - id: P2
           weight: 1.0
           label: Suggestion
           requiresFileLineEvidence: false
     verdicts:
       order: [FAIL, CONDITIONAL, PASS WITH NOTES, PASS]
       items:
         - id: FAIL
           when: activeP0 > 0 OR compositeScore < 70
           nextCommand: /spec_kit:plan
         - id: CONDITIONAL
           when: activeP0 == 0 AND activeP1 > 0
           nextCommand: /spec_kit:plan
         - id: PASS WITH NOTES
           when: activeP0 == 0 AND activeP1 == 0 AND activeP2 > 0
           nextCommand: /create:changelog
         - id: PASS
           when: activeP0 == 0 AND activeP1 == 0 AND activeP2 == 0
           nextCommand: /create:changelog
     qualityGuards:
       items:
         - id: evidence-completeness
           rule: Every P0/P1 has file:line citation
         - id: scope-alignment
           rule: Findings stay within declared review scope
         - id: no-inference-only
           rule: No P0/P1 based only on inference
         - id: severity-coverage
           rule: Security and Correctness dimensions reviewed
         - id: cross-reference
           rule: At least one cross-reference pass in long reviews
     convergence:
       defaults:
         maxIterations: 7
         convergenceThreshold: 0.10
         stuckThreshold: 2
       signals:
         - id: rolling-average
           weight: 0.30
         - id: mad-noise-floor
           weight: 0.25
         - id: dimension-coverage
           weight: 0.45
       severityMath:
         refinementMultiplier: 0.5
         p0OverrideMinRatio: 0.50
         noFindingsRatio: 0.0
     crossReferenceProtocols:
       items:
         - id: spec-vs-code
           check: Spec vs Code
           source: spec.md claims
           target: implementation
         - id: checklist-vs-evidence
           check: Checklist vs Evidence
           source: "[x] items"
           target: cited evidence
         - id: skill-vs-agent
           check: SKILL.md vs Agent
           source: skill contracts
           target: agent files
         - id: agent-cross-runtime
           check: Agent Cross-Runtime
           source: .claude agents
           target: .codex/.opencode/.agents/.gemini agents
         - id: feature-catalog-vs-code
           check: Feature Catalog vs Code
           source: catalog claims
           target: implementation
         - id: playbook-vs-capability
           check: Playbook vs Capability
           source: scenario preconditions
           target: actual capability
     outputs:
       reviewReport:
         fileName: review-report.md
         sections:
           - { id: executive-summary, order: 1, title: Executive Summary }
           - { id: score-breakdown, order: 2, title: Score Breakdown }
           - { id: p0-findings, order: 3, title: P0 Findings (Blockers) }
           - { id: p1-findings, order: 4, title: P1 Findings (Required) }
           - { id: p2-findings, order: 5, title: P2 Findings (Suggestions) }
           - { id: cross-reference-results, order: 6, title: Cross-Reference Results }
           - { id: coverage-map, order: 7, title: Coverage Map }
           - { id: positive-observations, order: 8, title: Positive Observations }
           - { id: convergence-report, order: 9, title: Convergence Report }
           - { id: remediation-priority, order: 10, title: Remediation Priority }
           - { id: release-readiness-verdict, order: 11, title: Release Readiness Verdict }
       strategy:
         requiredSections:
           - Review Dimensions (remaining)
           - Completed Dimensions
           - Running Findings
           - Cross-Reference Status
           - Files Under Review
           - Review Boundaries
       jsonl:
         iterationRecord:
           required:
             - type
             - mode
             - run
             - status
             - focus
             - findingsCount
             - newFindingsRatio
             - noveltyJustification
             - ruledOut
             - timestamp
           optional:
             - dimension
             - severityCounts
             - filesReviewed
             - dimensionScores
             - newFindings
             - upgrades
             - resolved
             - findingRefs
             - coverage
             - focusTrack
             - durationMs
         synthesisEvent:
           required:
             - type
             - event
             - mode
             - totalIterations
             - verdict
             - findingsActive
   ```

3. Existing review-mode artifacts should be split into two ownership classes: mixed authored/generated surfaces for human-oriented files, and fully generated helper artifacts for render-time verification. The repo already uses both patterns: fully generated files carry a visible "DO NOT EDIT GENERATED FILES" banner, while the template system keeps source inputs separate from outputs and verifies drift via regeneration. Recommended ownership matrix:

   | Artifact | Ownership | Why |
   |---|---|---|
   | `spec_kit_deep-research_review_auto.yaml` | Mixed | Workflow steps remain authored; replace only contract-dependent enum/input/appendix blocks |
   | `spec_kit_deep-research_review_confirm.yaml` | Mixed | Same as auto workflow |
   | `agent/deep-review.md` and runtime variants | Mixed | Persona/process prose stays authored; JSONL schema, formulas, dimension/verdict/protocol blocks generated |
   | `references/quick_reference.md` | Mixed | Keep manual intro material; generate full `review-mode` anchor block |
   | `README.md` | Mixed | Keep quick-start/history prose manual; generate one current-contract summary block only |
   | Maintained playbooks | Mixed | Scenario narrative stays manual; generate "Contract Assertions" appendix blocks |
   | `generated/review-mode-contract.snapshot.yaml` | Fully generated | Expanded canonical snapshot for audits/tests |
   | `generated/review-mode-contract.hash` or `.hashes` entry | Fully generated | Cheap drift sentinel for CI/pre-commit |

   This means the manifest owns all normative enumerations, formulas, rule text, section catalogs, and next-command mappings, while authored files only own narrative, examples, and workflow-specific prose. Historical changelog/version-history text should remain manual and non-canonical, otherwise contract updates would incorrectly rewrite release history. [SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:15] [SOURCE: .opencode/skill/system-spec-kit/templates/README.md:57] [SOURCE: .opencode/skill/system-spec-kit/scripts/templates/compose.sh:38-49] [SOURCE: .opencode/skill/system-spec-kit/scripts/templates/compose.sh:890-907] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:6-15] [SOURCE: .opencode/agent/deep-review.md:225-258] [SOURCE: .opencode/skill/sk-deep-research/references/quick_reference.md:253-296] [SOURCE: .opencode/skill/sk-deep-research/README.md:47-55] [SOURCE: .opencode/skill/sk-deep-research/README.md:334-342]

4. The propagation workflow should mirror `compose.sh`: edit only the canonical manifest, run a single renderer, then verify that every downstream artifact matches the rendered contract. A concrete workflow is:
   1. Edit `review_mode_contract.yaml`.
   2. Run `render-review-contract` to emit fully generated snapshots plus replace generated blocks in mixed files.
   3. Run `render-review-contract --verify` in pre-commit/CI.
   4. Fail if any tracked artifact changes, any required marker is missing, or any file contains stale contract literals outside allowed generated regions.

   The renderer should treat the manifest's `render.artifacts[]` array as the routing table. Each entry should declare `path`, `ownership`, `format`, `markers`, and `sections` so the generator knows exactly which contract fragments belong in each target. [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:49-70] [SOURCE: .opencode/skill/system-spec-kit/scripts/templates/compose.sh:13-20] [SOURCE: .opencode/skill/system-spec-kit/scripts/templates/compose.sh:38-49] [SOURCE: .opencode/skill/system-spec-kit/scripts/templates/compose.sh:890-907]

   Recommended `render.artifacts[]` shape:

   ```yaml
   render:
     artifacts:
       - id: workflow-auto
         path: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml
         ownership: mixed
         format: yaml
         markers:
           - { start: "# BEGIN GENERATED: review-input-enums", end: "# END GENERATED: review-input-enums" }
           - { start: "# BEGIN GENERATED: review-reference-appendix", end: "# END GENERATED: review-reference-appendix" }
         sections:
           - contract.targetTypes
           - contract.dimensions
           - contract.verdicts
           - contract.convergence
           - contract.crossReferenceProtocols
           - contract.outputs.reviewReport.sections
       - id: agent-opencode
         path: .opencode/agent/deep-review.md
         ownership: mixed
         format: markdown
         markers:
           - { start: "<!-- BEGIN GENERATED: review-jsonl -->", end: "<!-- END GENERATED: review-jsonl -->" }
           - { start: "<!-- BEGIN GENERATED: review-taxonomy -->", end: "<!-- END GENERATED: review-taxonomy -->" }
         sections:
           - contract.jsonl
           - contract.dimensions
           - contract.severities
           - contract.convergence
           - contract.crossReferenceProtocols
       - id: quick-reference-review-mode
         path: .opencode/skill/sk-deep-research/references/quick_reference.md
         ownership: mixed
         format: markdown
         markers:
           - { start: "<!-- BEGIN GENERATED: review-mode -->", end: "<!-- END GENERATED: review-mode -->" }
         sections:
           - contract.dimensions
           - contract.verdicts
           - contract.qualityGuards
           - contract.convergence
           - contract.outputs.reviewReport.sections
       - id: review-contract-snapshot
         path: .opencode/skill/sk-deep-research/generated/review-mode-contract.snapshot.yaml
         ownership: generated
         format: yaml
         sections:
           - contract
   ```

5. Drift detection should be validator-first, not review-playbook-first. The minimal CI/pre-commit contract should check six classes of drift: schema validity, render parity, marker integrity, duplicate literals, runtime parity, and playbook parity. These checks are directly motivated by the repo's existing verify workflow and by the specific drift incidents already found in review-mode docs. [SOURCE: .opencode/skill/system-spec-kit/scripts/templates/compose.sh:889-907] [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/research/iterations/iteration-001.md:12-14]

   Recommended validator checklist:

   | Check | What it verifies | Target surfaces |
   |---|---|---|
   | `schema` | Manifest matches JSON Schema / required keys / stable IDs / no duplicate `id`s | manifest only |
   | `render-verify` | Re-rendered output is byte-equal to committed mixed/generated artifacts | YAML, agent docs, quick reference, README, playbooks, snapshots |
   | `marker-integrity` | Every mixed file has exactly one start/end marker pair per declared block | YAML, agent docs, quick reference, README, playbooks |
   | `enum-parity` | Workflow `review_target_type`, `review_dimensions`, verdict text, and section counts match manifest | review YAML + command doc snippets |
   | `jsonl-parity` | Agent JSONL example and state-format tables match manifest fields and formulas | agent docs + `state_format.md` |
   | `duplicate-literal-lint` | No hard-coded dimension/verdict/protocol/report-section lists outside generated or allowlisted historical blocks | README, quick reference, playbooks, command docs |
   | `runtime-coverage` | Every declared runtime agent file has a render target entry | `.opencode`, `.codex`, `.gemini`, `.claude`, ChatGPT variants |
   | `playbook-assertions` | Generated playbook appendix/fixture matches current target types, verdicts, and cross-reference protocol names | maintained playbooks |

   The duplicate-literal lint is the key extra safeguard. `compose.sh --verify` catches stale generated outputs, but it does not catch a maintainer manually adding a conflicting dimension list elsewhere in README or a playbook. For review mode, the validator should therefore allowlist true historical release notes and otherwise ban normative taxonomy copies outside declared generated blocks. [SOURCE: .opencode/skill/system-spec-kit/scripts/templates/compose.sh:890-907] [SOURCE: .opencode/skill/sk-deep-research/README.md:334-342]

6. Q1 can now be treated as answered. The exact contract should live in a neutral manifest with stable IDs, generated-block routing metadata, and validator rules; the repo should preserve authored workflow prose around generated contract blocks instead of trying to regenerate whole human-oriented files; and CI should enforce `--verify`-style parity plus duplicate-literal linting. This resolves the remaining gap left open in iteration 1. [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/research/iterations/iteration-001.md:13-14] [SOURCE: .opencode/skill/system-spec-kit/scripts/templates/compose.sh:890-907]

## Ruled Out
- Full-file generation for `README.md`, agent docs, or playbooks is the wrong default. Those files contain surrounding narrative, examples, and history that should remain authored; generated blocks are a better fit than replacing whole documents. [SOURCE: .opencode/agent/deep-review.md:262-289] [SOURCE: .opencode/skill/sk-deep-research/README.md:57-80] [SOURCE: .opencode/skill/sk-deep-research/README.md:330-343]
- Keeping version history or changelog entries as canonical contract replicas is also the wrong fit, because canonical contract updates would mutate historical descriptions instead of only updating current-state surfaces. [SOURCE: .opencode/skill/sk-deep-research/README.md:330-343]

## Dead Ends
- CocoIndex again added no useful evidence for this markdown-and-config-heavy task; exact line reads and repo-pattern inspection were the productive path.

## Sources Consulted
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml`
- `.opencode/command/spec_kit/deep-research.md`
- `.opencode/agent/deep-review.md`
- `.opencode/skill/sk-deep-research/references/state_format.md`
- `.opencode/skill/sk-deep-research/references/loop_protocol.md`
- `.opencode/skill/sk-deep-research/references/quick_reference.md`
- `.opencode/skill/sk-deep-research/README.md`
- `.opencode/skill/system-spec-kit/references/templates/template_guide.md`
- `.opencode/skill/system-spec-kit/scripts/templates/compose.sh`
- `.opencode/skill/system-spec-kit/templates/context_template.md`
- `.opencode/skill/system-spec-kit/templates/README.md`
- `.opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/research/iterations/iteration-001.md`

## Assessment (newInfoRatio, questions addressed/answered)
- `newInfoRatio`: `0.63`
- Addressed: `Q1`
- Answered this iteration: `Q1` is now fully answered. Iteration 1 mapped where drift lives and recommended a neutral manifest. This iteration adds the missing operational details: exact schema keys, per-artifact ownership boundaries, render routing metadata, and CI/pre-commit validation rules.

## Reflection (what worked/failed and why)
- Worked: reading the exact contract-bearing lines in workflow YAML, agent docs, state_format, quick reference, and README made it possible to derive a normalized schema instead of proposing abstract "single source of truth" language.
- Worked: `system-spec-kit` provided two concrete precedents that translate directly: generated-file banners and `--verify` drift detection after composition.
- Failed: CocoIndex was still low-yield here because the contract is spread across prose/config assets rather than implementation code.

## Recommended Next Focus
Q2: collapse the current review taxonomy to a minimum viable concept set. The next iteration should test whether the 7 dimensions, 5 guards, 4 verdicts, and 6 cross-reference protocols can be reduced into a smaller operator-facing model without losing audit rigor or machine-verifiable outputs.
