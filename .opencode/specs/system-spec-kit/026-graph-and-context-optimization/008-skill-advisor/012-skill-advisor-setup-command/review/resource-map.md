---
title: "Resource Map: 012-skill-advisor-setup-command Deep Review"
description: "File path index for files audited and findings produced by the 7-iteration cli-copilot deep-review loop."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: resource-map-core | v2.2 -->"
trigger_phrases:
  - "012-skill-advisor-setup-command resource map"
  - "skill advisor setup command review resources"
importance_tier: "important"
contextType: "review"
---
# Resource Map: 012-skill-advisor-setup-command Deep Review

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: resource-map-core | v2.2 -->

---

## 1. Review Target Files (audited)

### Spec folder packet
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/plan.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/tasks.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/checklist.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/graph-metadata.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/description.json`

### Implementation files (out-of-folder)
- `.opencode/command/spec_kit/skill-advisor.md`
- `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml`
- `.opencode/command/spec_kit/README.txt`
- `.opencode/install_guides/SET-UP - Skill Advisor.md`
- `.opencode/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/README.md`

### Parent doc updates
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/context-index.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/tasks.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/changelog/changelog-008-012-skill-advisor-setup-command.md`

### Parity references (read for cross-checking)
- `.opencode/command/spec_kit/resume.md`
- `.opencode/command/spec_kit/plan.md`
- `.opencode/command/spec_kit/deep-review.md`
- `.opencode/skill/sk-doc/assets/agents/command_template.md`
- `.opencode/skill/sk-doc/references/global/hvr_rules.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/lexical.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/derived.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/weights-config.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/projection.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/text.ts`
- `.opencode/skill/system-spec-kit/graph-metadata.json` (sample real metadata for schema comparison)

---

## 2. Review Output Artifacts

### Top-level
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/review-report.md` (this report's companion)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/resource-map.md` (this file)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/deep-review-config.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/deep-review-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/deep-review-state.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/runner.sh`

### Iteration artifacts
- `review/iterations/iteration-001.md`
- `review/iterations/iteration-002.md`
- `review/iterations/iteration-003.md` (recovered post-loop from log)
- `review/iterations/iteration-004.md`
- `review/iterations/iteration-005.md`
- `review/iterations/iteration-006.md` (recovered post-loop from log)
- `review/iterations/iteration-007.md`

### Delta JSON
- `review/deltas/iteration-001.json`
- `review/deltas/iteration-002.json`
- `review/deltas/iteration-004.json`
- `review/deltas/iteration-005.json`
- `review/deltas/iteration-007.json`
- (iter 003 + 006 deltas remain log-embedded; see F-CONV-001)

### Per-iteration prompts
- `review/prompts/iteration-{001..007}.md`

### Dispatch logs
- `review/logs/iteration-{001..007}.log`
- `review/logs/runner.log`

---

## 3. File-to-Finding Index (P1 only)

| File | Findings touching this file |
|---|---|
| `.opencode/command/spec_kit/skill-advisor.md` | F-CORR-001, F-CORR-002, F-CORR-003, F-SEC-001, F-SEC-003, F-SEC-005, F-MAINT-001 |
| `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml` | F-CORR-003, F-CORR-005, F-CORR-006, F-CORR-007, F-CORR-008, F-SEC-001, F-SEC-002, F-SEC-003, F-SEC-005 |
| `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml` | F-CORR-010, F-CORR-011, F-CORR-012, F-CORR-013, F-SEC-001, F-SEC-002 |
| `.opencode/install_guides/SET-UP - Skill Advisor.md` | F-SEC-003, F-SEC-005 |
| `.opencode/README.md` | F-TRACE-004 |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | F-MAINT-002 |
| Spec folder packet docs | F-TRACE-001, F-TRACE-002 |
| Parent docs (context-index, spec, tasks) | F-TRACE-003 |
| `008-skill-advisor/changelog/changelog-008-012-*.md` | F-TRACE-005, F-TRACE-006 |
| `review/runner.sh` | F-SEC-004 |
| `review/iterations/iteration-003.md` + `iteration-006.md` | F-CONV-001 (resolved) |

---

## 4. Verification Commands

Reproduce key checks from the review:

```bash
# DQI for command + install guide
python3 .opencode/skill/sk-doc/scripts/extract_structure.py .opencode/command/spec_kit/skill-advisor.md
python3 .opencode/skill/sk-doc/scripts/extract_structure.py '.opencode/install_guides/SET-UP - Skill Advisor.md'

# HVR check
grep -niE 'leverage|robust|seamless|ecosystem|utilize|holistic|curate|harness|elevate|foster|empower|landscape|groundbreaking|cutting-edge|delve|illuminate|innovative|remarkable' \
  .opencode/command/spec_kit/skill-advisor.md \
  '.opencode/install_guides/SET-UP - Skill Advisor.md' \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/implementation-summary.md \
  .opencode/skill/system-spec-kit/mcp_server/README.md

# README count verification (F-TRACE-004)
find .opencode/command -type f -name '*.md' | wc -l                                      # claimed 23
find .opencode/command/spec_kit -maxdepth 1 -type f -name '*.md' | wc -l                  # claimed 10
find .opencode/command -type f \( -name '*.yaml' -o -name '*.yml' \) | wc -l              # claimed 31
find .opencode/command/spec_kit/assets -maxdepth 1 -type f \( -name '*.yaml' -o -name '*.yml' \) | wc -l

# Strict spec validation
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command --strict

# YAML parse check
python3 -c "import yaml; yaml.safe_load(open('.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml'))"
python3 -c "import yaml; yaml.safe_load(open('.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml'))"
```

---

## 5. Run Provenance

| Field | Value |
|---|---|
| Trigger | User instruction: "Let cli-copilot gpt 5.5 high run 7 deep review iterations on work done" |
| Command | `/spec_kit:deep-review:auto <packet> --max-iterations=7 --convergence=0.10 --executor=cli-copilot --model=gpt-5.5 --reasoning-effort=high` |
| Started | 2026-04-25T16:54:40Z |
| Completed | 2026-04-25T17:17:19Z |
| Duration | 22m39s |
| Executor binary | `/Users/michelkerkmeester/.superset/bin/copilot` v1.0.36 |
| Concurrency | sequential within packet (cli-copilot 3-concurrent cap not exercised) |
| Background bash task ID | bzwe4v816 |
