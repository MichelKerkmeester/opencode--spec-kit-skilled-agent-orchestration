# Iteration 2 - Correctness: Auto YAML Workflow + Mutation Boundaries

## Summary

The autonomous workflow has the expected five named phases (`phase_0_discovery` through `phase_4_verify`) and the three concrete scorer source paths referenced by `scoring_sources` exist on disk. The major correctness risks are in the workflow contract rather than YAML syntax: graph-metadata field names do not match the real schema/projection reader, mutation-boundary enforcement is declared but not represented as a concrete pre-write step, graph-scan recovery semantics conflict, and confidence/scope rules are not fully wired into the phase gates.

Iteration 1 already recorded the command/YAML dry-run mismatch as F-CORR-003, including `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:135` and `:151`. This iteration does not duplicate that finding; it treats dry-run as covered unless additional YAML-only contradictions are found.

## Findings

### P0 (Blockers)

- None.

### P1 (Required)

- F-CORR-005: The auto workflow names graph-metadata fields that do not match real skill `graph-metadata.json` files or the advisor projection reader.
  - Evidence: `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:73`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:74`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:75`, `.opencode/skill/system-spec-kit/graph-metadata.json:44`, `.opencode/skill/system-spec-kit/graph-metadata.json:45`, `.opencode/skill/system-spec-kit/graph-metadata.json:59`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/projection.ts:234`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/projection.ts:235`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/projection.ts:236`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/projection.ts:237`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/projection.ts:238`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/projection.ts:239`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/projection.ts:240`
  - Impact: Phase 1 says it extracts `derived.triggers` and `derived.keywords`, and Phase 2/3 would propose/update those names, but the real metadata uses `derived.trigger_phrases` and `derived.key_topics`, with projection also deriving phrases from `entities`, `key_files`, and `source_docs`. The workflow can therefore produce no-op or schema-drifting metadata edits.
  - Remediation: Replace `derived.triggers` / `derived.keywords` with the actual field names used by graph metadata and projection loading, preferably `derived.trigger_phrases` and `derived.key_topics`, and state whether `entities`, `key_files`, and `source_docs` are read-only enrichment sources.

- F-CORR-006: Mutation-boundary enforcement is declared, but Phase 3 has no concrete allowlist/denylist validation step before writes.
  - Evidence: `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:49`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:50`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:54`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:58`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:132`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:136`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:137`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:138`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:146`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:147`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:148`
  - Impact: The YAML says Phase 3 "MUST refuse writes to forbidden_targets", but the Phase 3 activities jump directly into editing explicit, lexical, and graph-metadata files. The only fail-fast entries cover build/edit failures after an edit is attempted, not a pre-write target-resolution check, so proposal entries outside `allowed_targets` are not explicitly blocked by the workflow contract.
  - Remediation: Add a blocking first activity in Phase 3 that resolves every `proposal_diff` target to a repo-relative path, verifies it matches exactly one `allowed_targets` pattern, verifies it matches no `forbidden_targets` pattern, and aborts before any write if validation fails.

- F-CORR-007: Graph-scan failure handling is internally contradictory between the hard post-verify gate, Phase 4 fail handling, and `error_recovery`.
  - Evidence: `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:181`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:183`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:186`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:188`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:165`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:167`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:221`
  - Impact: `post_phase_4` is a hard gate requiring `graph_scan completed`, and Phase 4 fail handling says graph-scan failure exits `STATUS=FAIL`; `error_recovery.graph_scan_unavailable` instead says to continue with a warning and mark verification partial. Operators cannot tell whether graph-scan unavailability blocks the autonomous run.
  - Remediation: Pick one contract. If graph scan is required for this command, remove the partial-recovery entry; if partial verification is allowed, downgrade the quality gate and Phase 4 fail handling to an explicit `STATUS=PARTIAL` path.

- F-CORR-008: The confidence framework is not connected to proposal outputs or the pre-apply quality gate, so its thresholds cannot be enforced.
  - Evidence: `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:201`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:202`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:203`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:204`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:205`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:206`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:125`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:126`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:127`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:128`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:176`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:177`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:178`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:179`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:230`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:231`
  - Impact: The workflow says high/medium/low confidence determine apply/skip behavior, but `proposal_diff` and `proposal_stats` do not include per-skill confidence, and `pre_phase_3` checks only non-empty diff, unresolved collisions, and scope filtering. The autonomous rule to skip low-confidence proposals has no data dependency in the declared outputs.
  - Remediation: Add `confidence_by_skill` or `proposal_confidence` to Phase 2 outputs and require `pre_phase_3` to block any low-confidence proposal from Phase 3, with medium-confidence proposals explicitly logged.

### P2 (Suggestions)

- F-CORR-009: Scope filtering is asserted in Phase 2, quality gates, and rules, but Phase 3 activities are written as unconditional edits across all lanes.
  - Evidence: `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:40`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:41`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:42`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:43`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:44`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:123`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:136`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:137`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:138`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:179`, `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:250`
  - Impact: The intent is likely that Phase 2 filters the diff and Phase 3 applies only non-empty scoped deltas, but the Phase 3 wording still instructs edits to explicit, lexical, and derived metadata in every run. That weakens the scope flag contract and makes partial-scope executions harder to audit.
  - Remediation: Rewrite Phase 3 activities as conditional lane-specific steps, for example "If scoped proposal contains explicit changes..." and "If scoped proposal contains derived changes...", and include the active scope in `files_modified`.

## Cross-References to Iteration 1

- F-CORR-001 and F-CORR-002 are command-markdown setup/entrypoint contradictions; this pass did not re-open them.
- F-CORR-003 already covers the dry-run contract disagreement between command markdown and the auto YAML, including the Phase 3 dry-run branch and Phase 4 jump. No new dry-run finding is added here to avoid duplication.
- F-CORR-004 covers rollback wording in the command markdown; this pass did not add rollback-specific findings for the auto YAML.

## Non-Findings / Confirmed Correct

- Five-phase structure is present as Discovery, Analysis, Proposal, Apply, Verify via `phase_0_discovery`, `phase_1_analysis`, `phase_2_proposal`, `phase_3_apply`, and `phase_4_verify`.
- `skip_tests` is opt-in and defaults to false in both `user_inputs` and `field_handling`; Phase 4 only skips tests when `skip_tests = FALSE` is not true.
- Concrete source files referenced by `scoring_sources.explicit_ts`, `scoring_sources.lexical_ts`, and `scoring_sources.weights_config_ts` exist at the stated paths.

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/deep-review-strategy.md:1-103`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/iterations/iteration-001.md:1-48`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/deltas/iteration-001.json:1-48`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/deep-review-state.jsonl:1-3`
- `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml:1-259`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts:1-198`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/lexical.ts:1-92`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/weights-config.ts:1-50`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/derived.ts:1-68`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:1-368`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/projection.ts:1-283`
- `.opencode/skill/system-spec-kit/graph-metadata.json:1-157`

## Convergence Signals

- new findings this iteration: 5
- total findings to date: 9
- newFindingsRatio: 0.5556
- dimensionsCovered: ["correctness"]
