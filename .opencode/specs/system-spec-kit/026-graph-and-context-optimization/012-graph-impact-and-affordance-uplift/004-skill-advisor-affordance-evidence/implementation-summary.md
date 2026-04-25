---
title: "Implementation Summary: Skill Advisor Affordance Evidence (012/004)"
speckit_template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2"
description: "Implemented allowlisted Skill Advisor affordance evidence through existing derived_generated and graph_causal lanes, with privacy-preserving attribution and compiler support."
trigger_phrases:
  - "012/004 implementation summary"
  - "skill advisor affordance implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/012-graph-impact-and-affordance-uplift/004-skill-advisor-affordance-evidence"
    last_updated_at: "2026-04-25T14:03:00+02:00"
    last_updated_by: "copilot-gpt-5.5"
    recent_action: "Completed affordance evidence"
    next_safe_action: "Review local commit"
    completion_pct: 100
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
---
# Implementation Summary: Skill Advisor Affordance Evidence (012/004)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-skill-advisor-affordance-evidence |
| **Completed** | 2026-04-25 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Skill Advisor can now use sanitized tool and resource affordance hints without expanding its graph vocabulary or leaking raw phrases. The change keeps affordance evidence narrow: all scoring flows through `derived_generated` and `graph_causal`.

### Affordance Allowlist

Allowed fields:

| Field | Use |
|-------|-----|
| `skillId` / `skill_id` | Owning skill target for scoring |
| `name` | Sanitized derived trigger |
| `triggers[]` | Sanitized derived triggers |
| `category` | Sanitized derived trigger |
| `dependsOn[]` / `depends_on[]` | Existing `depends_on` graph-causal relation |
| `enhances[]` | Existing `enhances` graph-causal relation |
| `siblings[]` | Existing `siblings` graph-causal relation |
| `prerequisiteFor[]` / `prerequisite_for[]` | Existing `prerequisite_for` graph-causal relation |
| `conflictsWith[]` / `conflicts_with[]` | Existing `conflicts_with` graph-causal relation |

Disallowed free-form fields such as `description` do not become triggers. URLs, email addresses, token-shaped fragments, control characters, and instruction-shaped strings are stripped or dropped before scoring.

### Implementation Surface

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/affordance-normalizer.ts` | Created | Normalize structured affordance inputs |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/types.ts` | Modified | Add raw affordance scorer option |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts` | Modified | Normalize affordances before lane scoring |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/derived.ts` | Modified | Add low-weight sanitized evidence under `derived_generated` |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/graph-causal.ts` | Modified | Add request-local affordance edges with existing multipliers |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py` | Modified | Compile `derived.affordances[]` into existing signals and adjacency |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/affordance-normalizer.test.ts` | Created | Cover allowlist and privacy behavior |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/lane-attribution.test.ts` | Created | Cover no-new-lane attribution |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/routing-fixtures.affordance.test.ts` | Created | Cover recall lift and explicit precedence |
| `.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/24-skill-advisor-affordance-evidence.md` | Created | Document current feature behavior |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/199-skill-advisor-affordance-evidence.md` | Created | Document manual validation scenario |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation first added normalization and tests, then connected the normalized output to the existing TypeScript scorer lanes and Python graph compiler. Final verification focused on packet-owned behavior and recorded full-directory test failures that came from unrelated local hook and graph metadata drift.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use only `derived_generated` and `graph_causal` | This preserves the packet rule that affordances must not create a new scoring lane. |
| Ignore free-form `description` as a trigger source | Descriptions are the highest-risk prompt-stuffing input. Structured fields are safer and easier to test. |
| Emit stable `affordance:<skillId>:<index>` evidence labels | Stable labels let traces cite affordance influence without exposing raw matched phrases. |
| Skip unknown affordance relation types | Skipping avoids an implicit fallback relation that could behave like a new relation type. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build` from `.opencode/skill/system-spec-kit` | PASS |
| `npm run typecheck` from `.opencode/skill/system-spec-kit/mcp_server` | PASS |
| Focused Skill Advisor Vitest affordance/native scorer tests | PASS: 4 files, 20 tests |
| Python Skill Advisor suite | PASS: 53 pass, 0 fail |
| Static `ALLOWED_ENTITY_KINDS` scan | PASS: `{"skill", "agent", "script", "config", "reference"}` |
| Static `EDGE_MULTIPLIER` scan | PASS: `enhances`, `siblings`, `depends_on`, `prerequisite_for`, `conflicts_with` |
| sk-doc DQI for feature catalog entry | PASS: 87 |
| sk-doc DQI for manual playbook entry | PASS: 91 |
| Full `vitest run skill_advisor/tests/` | FAIL: 6 unrelated failures from checked-in `.claude/settings.local.json` repo-root drift and `mcp-code-mode` metadata referencing a missing `mcp_server/package.json` |
| Strict spec validation | PASS after template normalization |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Full Skill Advisor directory is not green in this checkout.** The failing files are outside 012/004 scope: `.claude/settings.local.json` points at `/Code_Environment/Public`, and `mcp-code-mode/graph-metadata.json` references a missing package file. The packet-owned tests pass.
2. **Affordance evidence is intentionally weak.** It improves candidate recall, but it does not force a top-skill recommendation without stronger prompt evidence.
<!-- /ANCHOR:limitations -->

---
