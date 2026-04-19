---
title: "Implementation Summary: SKILL.md Smart-Router Section Efficacy"
description: "Completed 20-iteration deep research packet on the efficacy of intra-skill Smart Routing sections."
trigger_phrases:
  - "021 002 smart router summary"
  - "skill md router efficacy complete"
importance_tier: "important"
contextType: "implementation-summary"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/021-smart-router-context-efficacy/002-skill-md-intent-router-efficacy"
    last_updated_at: "2026-04-19T19:45:00Z"
    last_updated_by: "codex"
    recent_action: "Completed research and validation artifacts"
    next_safe_action: "Prototype observe-only Smart Routing read telemetry harness"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/research-validation.md"
      - "research/findings-registry.json"
    session_dedup:
      fingerprint: "sha256:021002smartroutercomplete"
      session_id: "021-002-r01"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which runtime should host observe-only telemetry first?"
    answered_questions:
      - "V1-V10 research questions answered"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-skill-md-intent-router-efficacy |
| **Completed** | 2026-04-19 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Completed 20 iterations of deep research on whether Smart Routing sections inside `.opencode/skill/*/SKILL.md` files actually reduce AI resource loading. The research concluded that the pattern has a strong static savings ceiling but no runtime enforcement, so live tier compliance must be measured with a harness before claims are made.

### Research Packet

The packet now contains 20 iteration records, a final synthesis, a per-question validation matrix, and a machine-readable findings registry. The Level 2 scaffolding records scope, plan, task completion, validation evidence, and this delivery summary.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/iterations/iteration-001.md` through `research/iterations/iteration-020.md` | Created | Deep-research iteration records |
| `research/deep-research-state.jsonl` | Updated | Externalized loop state and completion record |
| `research/research.md` | Created | 17-section synthesis |
| `research/research-validation.md` | Created | Per-V validation matrix |
| `research/findings-registry.json` | Created | Indexed machine-readable findings |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md` | Created/Updated | Level 2 packet scaffolding |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work used deterministic local scans for V1, V2, V6, V7, V8, and V9, plus observational artifact scans for V3 and V5. V4 used a deterministic prompt-corpus sample, and V10 produced a harness design because live Read-call telemetry was unavailable in this packet.

Key metrics:

- Skills with Smart Routing: 20
- ALWAYS tier median bytes: 15,296
- Median `SKILL.md + ALWAYS` bytes: 41,009
- Median ALWAYS share of `SKILL.md + loadable resource tree`: 23.7%
- Research iteration files scanned: 1,014
- Tier compliance estimate: `needs-harness`
- ON_DEMAND keyword hit rate: 5.5%
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep Smart Routing as a declarative manifest | The static savings ceiling is strong, but no runtime enforcement was found. |
| Do not claim enforced runtime savings today | Existing logs are observational proxies, not raw Read telemetry. |
| Build observe-only telemetry before enforcement | A harness can measure compliance without changing assistant behavior first. |
| Fix stale paths and tune ON_DEMAND phrases first | Enforcement would otherwise punish route metadata issues and under-triggered keyword design. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| JSON syntax | PASS for config, registry, description, and graph metadata artifacts |
| JSONL state | PASS with 23 valid records |
| Iteration count | PASS with 20 `research/iterations/iteration-*.md` files |
| Scope | PASS: runtime code and skill files were not modified |
| Strict spec validation | Rerun after packet repair |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live Read-call telemetry.** Tier compliance remains `needs-harness`.
2. **Corpus labels target skill choice.** V4 maps those labels onto intra-skill routing as a proxy.
3. **Artifact logs are indirect.** V3 and V5 show resource citation behavior, not every runtime read.
<!-- /ANCHOR:limitations -->
