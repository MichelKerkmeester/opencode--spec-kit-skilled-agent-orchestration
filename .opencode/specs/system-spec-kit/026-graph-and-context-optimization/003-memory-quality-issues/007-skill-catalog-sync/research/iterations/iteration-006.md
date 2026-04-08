---
title: "Review Iteration 006: system-spec-kit templates"
description: "Phase 7 drift audit of level templates against the post-Phase-6 anchor and memory-save baseline"
trigger_phrases:
  - "phase 7 review iteration 006"
  - "system-spec-kit templates drift"
  - "template anchor contract audit"
importance_tier: important
contextType: "research"
---

# Review Iteration 006: system-spec-kit templates

## Surface Audited
- `.opencode/skill/system-spec-kit/templates/level_1/`
- `.opencode/skill/system-spec-kit/templates/level_2/`
- `.opencode/skill/system-spec-kit/templates/level_3/`
- `.opencode/skill/system-spec-kit/templates/level_3+/`

## Findings

No P0, P1, or P2 drift findings were identified in the sampled level-template surface.

The sampled templates use comment-based `<!-- ANCHOR:... -->` markers without reintroducing `<a id>` scaffolding, and the sampled README guidance continues to reference the correct level folders and quick-start copy paths.

## Negative Cases (confirmed still accurate)
- `.opencode/skill/system-spec-kit/templates/level_2/spec.md:20-30` uses comment-based anchor markers and does not reintroduce HTML id scaffolding.
- `.opencode/skill/system-spec-kit/templates/level_3+/README.md:65-68` still points operators at the correct `templates/level_3+/` copy path.

## Confidence
**0.92** — Audited the live level folders directly and ran contract greps for `<a id>`, `generate-context.ts`, and stale anchor names. No actionable drift surfaced in the level-template surface.

## Cross-Surface Notes
- Template drift was contained to test fixtures outside the level folders, not to the live level templates themselves.
