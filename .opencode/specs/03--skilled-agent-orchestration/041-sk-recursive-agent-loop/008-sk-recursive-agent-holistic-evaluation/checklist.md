# Checklist: Phase 008 — Holistic Agent Evaluation

## P0 — Hard Blockers

### Pre-Implementation
- [x] Existing `score-candidate.cjs` read and understood
- [x] Existing `run-benchmark.cjs` read and understood
- [x] Existing `reduce-state.cjs` read and understood
- [x] check-mirror-drift.cjs discovery logic reviewed for reuse

### Code Quality
- [x] `scan-integration.cjs` parses correctly (no runtime errors)
- [x] `generate-profile.cjs` produces valid JSON for any agent .md
- [x] `score-candidate.cjs` backward compatible (existing handover profile scores unchanged)
- [x] `score-candidate.cjs --dynamic` produces 5-dimension output
- [x] `run-benchmark.cjs` existing fixture tests still pass
- [x] `reduce-state.cjs` handles new dimensional data without breaking existing ledger
- [x] All 8 .cjs scripts have sk-code--opencode box headers and section separators

### Testing
- [x] scan-integration finds all surfaces for handover agent (27 surfaces, all aligned)
- [x] scan-integration finds all surfaces for debug agent (25 surfaces)
- [x] scan-integration handles nonexistent agent gracefully
- [x] generate-profile produces valid profile from handover.md (9 rules)
- [x] generate-profile produces valid profile from debug.md (1 rule, 8 output checks)
- [x] generate-profile produces valid profile from review.md

### Documentation
- [x] SKILL.md passes `package_skill.py --check` (PASS)
- [x] Agent file has correct v1.1.1 frontmatter with `permission:` object
- [x] Command file matches prompt.md quality standard (Phase 0, Setup, violations)

## P1 — Required

### Testing
- [x] 5-dimension scores have correct weights summing to 1.0
- [x] Integration dimension uses scanner output for mirror/command/skill scoring
- [x] Rule coherence dimension cross-checks rules against content
- [x] Dynamic profile detects capability-permission mismatches
- [x] Reducer dashboard shows per-dimension progress (Dimensional Progress table)
- [x] Reducer stop rules respect per-dimension plateaus (stopOnDimensionPlateau)

### Documentation
- [x] evaluator_contract.md documents 5-dimension rubric + dynamic mode output
- [x] integration_scanning.md documents scanner behavior with example output
- [x] loop_protocol.md includes integration scan, dimensional scoring, dynamic profile
- [x] quick_reference.md updated with new commands and dimension weights
- [x] All 11 references enriched with Phase 008 content
- [x] improvement_config.json has dimension weights and plateau stop
- [x] target_manifest.jsonc supports dynamic profile flag with JSONC comments
- [x] improvement_config_reference.md created (field-level config docs)
- [x] README.md expanded to 416 lines, HVR compliant, 12 sections

### Integration
- [x] Runtime mirrors synced (Claude, Codex, .agents, Gemini agents + commands)
- [x] YAML workflows rewritten to spec_kit gold standard (user_inputs, field_handling, context_loading)
- [x] Command accepts any agent path with dynamic profiling
- [x] improve/ README.txt created in all 4 runtimes

### Rename
- [x] Skill renamed: sk-recursive-agent -> sk-agent-improver (0 old refs)
- [x] Agent renamed: recursive-agent -> agent-improver (all 5 runtimes)
- [x] Command renamed: /spec_kit:recursive-agent -> /improve:agent
- [x] YAMLs renamed: spec_kit_recursive-agent -> improve_agent-improver
- [x] Fresh sub-agent audit: 25/25 checks pass, 0 failures

### Manual Testing Playbook
- [x] 21 per-feature test files with global sequential numbering (001-021)
- [x] Correct dimension names in all test files
- [x] Copy-pasteable commands with verification one-liners
- [x] Root MANUAL_TESTING_PLAYBOOK.md with test matrix

## P2 — Optional

- [x] All 12 create command YAMLs aligned with spec_kit gold standard
- [x] Stale "Recursive Agent" headings fixed in .agents and .gemini command mirrors
- [x] Root 041 spec.md and implementation-summary.md updated with Phase 8
- [x] Phase 008 spec docs updated with complete session coverage
