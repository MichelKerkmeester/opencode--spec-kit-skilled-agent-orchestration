---
title: "Research Charter: SKILL.md Smart-Router Section Efficacy"
description: "Investigate whether the §Smart Routing section inside each SKILL.md (INTENT_SIGNALS + RESOURCE_MAP + ALWAYS/CONDITIONAL/ON_DEMAND loading tiers) actually reduces AI context load, or if AIs load full skill trees regardless of the tier directives."
trigger_phrases:
  - "021 002 skill md smart router"
  - "skill-md intent router efficacy"
  - "resource loading tier effectiveness"
importance_tier: "important"
contextType: "research-charter"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/021-smart-router-context-efficacy/002-skill-md-intent-router-efficacy"
    last_updated_at: "2026-04-19T18:55:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Charter scaffolded — corrected scope per user clarification"
    next_safe_action: "Dispatch cli-codex 20-iter deep-research"
    dispatch_policy: "cli-codex gpt-5.4 high fast"

---
# Research Charter: SKILL.md Smart-Router Section Efficacy

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Sibling Research** | ../001-initial-research/ (advisor-hook efficacy — not this scope) |
| **Research Budget** | 20 iterations |
| **Executor** | cli-codex gpt-5.4 high fast |

---

## 1. WHAT IS "SMART ROUTING" IN THIS CONTEXT

Every `.opencode/skill/*/SKILL.md` contains a `## SMART ROUTING` section with a standardized pattern:

- **INTENT_SIGNALS** — dict mapping intent (GENERATION, REVIEW, RESEARCH, etc.) to weight + keyword list
- **RESOURCE_MAP** — dict mapping intent → list of reference/asset files to load
- **LOADING_LEVELS**:
  - `ALWAYS` — baseline files loaded every invocation (typically `cli_reference.md` + `prompt_quality_card.md`)
  - `CONDITIONAL` — intent-mapped resources loaded only when intent matches
  - `ON_DEMAND` — loaded only when explicit keywords appear in user prompt
- **`route_codex_resources(task)`** (or similar) — Python pseudocode routing function that scores intents and returns loaded-resource list

**The explicit hypothesis** the pattern asserts: AIs should follow these tiers and load ONLY the resources the router returns, avoiding full SKILL tree preload.

**The untested claim**: does the AI actually follow? Or does it load the full reference/assets tree anyway?

---

## 2. RESEARCH QUESTIONS (V1-V10)

- **V1 Static inventory** — catalog every `.opencode/skill/*/SKILL.md` with a Smart Routing section. How many skills? What's the shape variation (all use same INTENT_SIGNALS keys, or is the vocabulary fragmented)?
- **V2 Resource budget baseline** — per skill, measure: total tree bytes, ALWAYS-subset bytes, CONDITIONAL bytes (per-intent), ON_DEMAND bytes. What's the max savings a compliant AI could achieve?
- **V3 Behavioral signal** — scan existing AI iteration/research logs in this repo for evidence AIs follow the tiers. Look for: "Loading references/foo.md" events, "Read" tool calls against skill subfolders, any mentions of specific references/assets.
- **V4 Intent classification accuracy** — given the pseudocode's keyword-weight scoring, does it route common prompts correctly? Use a small labeled sample to check.
- **V5 Compliance gap** — does the AI actually respect the loading levels, or does it always read full SKILL.md + references/* regardless? Evidence-based.
- **V6 ALWAYS bloat** — is the ALWAYS tier itself minimal, or does it already contain large files that dwarf the intended savings?
- **V7 ON_DEMAND keyword coverage** — do AI prompts typically contain the ON_DEMAND keywords needed to unlock the right resource? Are there missed-trigger patterns?
- **V8 UNKNOWN_FALLBACK safety** — when no intent matches (zero-score), does the fallback behavior (`["GENERATION"]` default) cause confusion or silent mis-routing?
- **V9 Enforcement mechanism** — is there ANY runtime enforcement (hook, wrapper, tool-filter) that prevents AI from reading ON_DEMAND files without the keyword? Or is it pure advisory?
- **V10 Measurement plan** — design an empirical harness: instrumented AI session that logs every Read tool call, compared against the Smart Routing prediction for the same prompt. Count over/under-load.

---

## 3. NON-GOALS

- The Phase 020 advisor hook (that's 021/001)
- Changing any SKILL.md content
- Proposing a new routing system (this phase is MEASUREMENT + DIAGNOSIS, not design)

---

## 4. STOP CONDITIONS

- Rolling 3-iter newInfoRatio < 0.05 across V1-V10
- All V1-V10 answered with evidence
- 20 iterations completed

---

## 5. EXPECTED ARTIFACTS

- `research/research.md` — 17-section synthesis
- `research/research-validation.md` — per-V findings + decisions (adopt-now / prototype-later / reject)
- `research/iterations/iteration-NNN.md` — 1-20
- `research/findings-registry.json` — indexed findings
- `research/deep-research-state.jsonl` — state log

---

## RELATED DOCUMENTS

- Parent: `../spec.md`
- Sibling: `../001-initial-research/` (advisor-hook efficacy)
- Reference skills (sample): cli-codex, sk-doc, sk-code-opencode, mcp-* skills under `.opencode/skill/*/SKILL.md`
