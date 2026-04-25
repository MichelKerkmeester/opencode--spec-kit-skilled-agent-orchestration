---
title: "Changelog: Skill Advisor Setup Command [008-skill-advisor/012-skill-advisor-setup-command]"
description: "Chronological changelog for the Skill Advisor Setup Command phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-25

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor`

### Summary

You can now run /doctor:skill-advisor to interactively analyze every skill in your repo, propose optimized advisor scoring (TOKEN_BOOSTS, PHRASE_BOOSTS, derived triggers, CATEGORY_HINTS), apply approved changes, re-index the skill graph, and validate with the existing 220-test advisor suite. Before this packet, the only way to tune advisor routing was to hand-edit explicit.ts / lexical.ts / per-skill graph-metadata.json files and remember to rebuild dist plus run tests. Now the workflow is one command.

### Added

- [P] Create .opencode/command/doctor/skill-advisor.md — command markdown with frontmatter, argument-hint, allowed-tools, execution protocol header, consolidated prompt phase
- [P] Create doctor_skill-advisor_auto.yaml — autonomous workflow definition with discovery, analysis, proposal, apply, verify phases (.opencode/command/doctor/assets/doctor_skill-advisor_auto.yaml)
- [P] Create doctor_skill-advisor_confirm.yaml — interactive workflow with approval gates between phases (.opencode/command/doctor/assets/doctor_skill-advisor_confirm.yaml)
- Update README.txt — add skill-advisor row to command table, update structure tree, add usage example (.opencode/command/spec_kit/README.txt)
- Create SET-UP - Skill Advisor.md — user-facing install guide with AI-first prompt, prerequisite check, interactive flow, troubleshooting (.opencode/install_guides/SET-UP - Skill Advisor.md)
- Update parent .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/context-index.md — add 012 row to child phase map and key implementation summary

### Changed

- Validate YAML workflow syntax — parse both YAML files, check for required keys (operating_mode, workflow steps)
- Run parent strict validation (bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh)
- All tasks marked [x]
- No [B] blocked tasks remaining
- Command file exists at .opencode/command/doctor/skill-advisor.md
- Both YAML assets exist in assets/

### Fixed

- Validate command markdown loads correctly — check frontmatter parsing, argument-hint, allowed-tools format
- CHK-012 Command frontmatter has correct allowed-tools and argument-hint
- CHK-022 Interactive mode approval gates work correctly

### Verification

- Both YAML workflows parse with python3 -c "import yaml; yaml.safe_load(...)" - PASS
- Command markdown frontmatter parses (description, argument-hint, allowed-tools) - PASS
- Command appears in runtime skill list as doctor:skill-advisor - PASS — visible in <system-reminder> skills list after creation
- Strict spec-folder validation on 012-skill-advisor-setup-command/ - PASS — 0 errors, 0 warnings
- description.json generated via generate-description.js - PASS
- graph-metadata.json written with parent_id, related_to, derived entities - PASS
- Acceptance scenarios count >= 4 for Level 2 - PASS — 5 scenarios with Given/When/Then markers
- All 12 child-packet tasks marked [x] - PASS — see tasks.md

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/command/doctor/skill-advisor.md` | Created | Command markdown definition (frontmatter + protocol + reference) |
| `.opencode/command/doctor/assets/doctor_skill-advisor_auto.yaml` | Created | Autonomous 5-phase workflow (no approval gates) |
| `.opencode/command/doctor/assets/doctor_skill-advisor_confirm.yaml` | Created | Interactive 5-phase workflow with per-phase + per-skill approval |
| `.opencode/command/spec_kit/README.txt` | Modified | Added skill-advisor row to commands table, structure tree, and usage example |
| `.opencode/install_guides/SET-UP - Skill Advisor.md` | Created (was broken symlink) | User-facing setup guide with AI-first prompt and rollback procedure |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/context-index.md` | Modified | Added 012 child phase row, summary, and open-items entry |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/spec.md` | Modified | Added 012 row to phase documentation map |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/tasks.md` | Modified | Added T013 entry tracking the new child phase |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/spec.md` | Modified | Acceptance scenarios reformatted to validator pattern; cross-refs use full paths; template_source_hint moved up in frontmatter |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/plan.md` | Modified | Cross-refs use full paths; template_source_hint repositioned |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/tasks.md` | Modified | Cross-refs use full paths; template_source_hint repositioned |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/checklist.md` | Modified | template_source_hint repositioned for validator visibility |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/graph-metadata.json` | Created | Packet graph metadata (parent_id, related_to, derived entities, key files) |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/description.json` | Created | Packet description metadata via generate-description.js |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/implementation-summary.md` | Created | Post-implementation summary with verification table and known limitations |

### Follow-Ups

- Parent spec folder still fails strict TEMPLATE_SOURCE check. The parent 008-skill-advisor/ has 4 files (spec.md, plan.md, tasks.md, implementation-summary.md) with template_source_hint: past line 20 of frontmatter, invisible to the validator's head -n 20 sample. Same systemic bug as this child had before fixing. Out of scope for this packet; would require a repo-wide frontmatter normalization pass.
- Test suite execution is deferred to first real run. This packet ships the command + YAML workflows + install guide but does not modify the live scoring tables (explicit.ts, lexical.ts, graph-metadata.json files). The 220-test advisor suite passes against the existing baseline; the first time a user runs /doctor:skill-advisor:auto the suite will run against actual proposed mutations.
- No automatic rollback on test failure. If the command applies mutations and the test suite fails, the user receives a STATUS=FAIL plus a git checkout HEAD -- rollback hint, but the rollback is manual. A future enhancement could auto-rollback on regression.
- Token-collision detection is per-pair, not transitive. Phase 2 cross-checks each proposed token against existing TOKEN_BOOSTS for OTHER skills. It does not detect three-way collisions where two newly-proposed tokens for different skills would themselves collide. In practice this is rare because Phase 2 generates proposals one skill at a time.
- Dry-run output writes to /tmp, not to a versioned scratch path. /tmp/skill-advisor-proposal-{timestamp}.md survives only until the next reboot. Users wanting to retain dry-run output should redirect or copy the file before exiting the session.
