---
title: "Implementation Summary: Merge sk-code-web + sk-code-full-stack into sk-code"
description: "Created umbrella sk-code skill, smart-routing by detected stack. Web stack live; non-web stacks scaffolded as placeholders pointing at preserved sk-code-full-stack."
trigger_phrases: ["sk-code merger summary", "054 implementation summary", "054-sk-code-merger continuity"]
importance_tier: "high"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/054-sk-code-merger"
    last_updated_at: "2026-04-30T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Phases 1-6 complete; advisor rebuilt, 5 trigger tests pass"
    next_safe_action: "Run web smoke test or proceed with Tiers 3/5/6 cosmetic updates"
    blockers: []
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Suffix: bare sk-code"
      - "Spec folder: 054-sk-code-merger"
      - "Placeholders: empty templated stubs"
      - "Deprecation: additive frontmatter, no rename"
---
# Implementation Summary: Merge sk-code-web + sk-code-full-stack into sk-code

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 054-sk-code-merger |
| **Completed** | 2026-04-30 (75% — validation pending) |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now route every code prompt through one umbrella skill. The new `sk-code` smart-routes by detected stack: a Webflow project loads full live content carried verbatim from `sk-code-web`; a React, Node.js, Go, Swift, or React Native project surfaces a placeholder pointer that directs you to canonical content preserved in `sk-code-full-stack`. The advisor's tie-break between the two old skills is gone, and both legacy skills remain on disk untouched (additive frontmatter deprecation only).

### sk-code skill (LIVE)

`.opencode/skill/sk-code/` (68 files). The advisor lists it with full description; live web smoke test pending.

The router runs in three steps inside `SKILL.md`: stack detection (Webflow markers → go.mod → Package.swift → app.json+expo → next.config.* → package.json+react → package.json+nodejs → UNKNOWN), intent classification across 12 categories (web's TASK_SIGNALS extended with TESTING/DATABASE/API), then tiered resource loading (MINIMAL/DEBUGGING/FOCUSED/STANDARD).

### Universal namespace (tightly scoped)

`references/universal/` holds only stack-agnostic content: `error_recovery.md` (decision tree), `code_quality_standards.md` (P0/P1/P2 severity model), `code_style_guide.md` (language-agnostic principles), `multi_agent_research.md` (10-agent methodology). `debugging_workflows.md` and `verification_workflows.md` deliberately stayed inside `references/web/` because they assume DOM/console/page-load semantics — promoting them would have smuggled browser assumptions into non-web routes.

### Placeholder pointers

`references/{react,nodejs,go,react-native,swift}/_placeholder.md` and `assets/{...}/_placeholder.md` — 10 pointer files total. Each carries `canonical_source` and `source_version: sk-code-full-stack@1.1.0` frontmatter so future drift is detectable. The full migration steps are documented inline.

### Advisor scoring retargeted

`skill_advisor.py`, `lib/scorer/lanes/explicit.ts`, `lib/scorer/lanes/lexical.ts`, and `tests/lane-attribution.test.ts` got `replace_all "sk-code-web" → "sk-code"` plus `"sk-code-full-stack" → "sk-code"`. Every boost-table entry now points at the umbrella. The hand-tuned weights survive — only the right-hand-side skill name changed.

### Legacy skills preserved (deprecated frontmatter only)

`sk-code-web/SKILL.md` and `sk-code-full-stack/SKILL.md` got three additive YAML keys: `deprecated: true`, `superseded_by: sk-code`, `advisor_weight: 0`, plus a deprecation_note. Bodies, references, assets, and scripts are unchanged. Live verification: the advisor list now shows both with `[DEPRECATED — superseded by sk-code on 2026-04-30 via 054-sk-code-merger]` prefix in their descriptions.

### Cross-repo reference updates

7 graph-metadata.json files updated (legacy skills marked deprecated; siblings/enhances retargeted on sk-code-review, sk-code-opencode, mcp-chrome-devtools, mcp-figma, advisor). 3 root files updated (CLAUDE.md, AGENTS.md, AGENTS_example_fs_enterprises.md routing tables retargeted; AGENTS_Barter.md already aligned to bare sk-code). Spec folder `054-sk-code-merger/` populated with full Level 3 docs.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation followed the approved plan in `~/.claude/plans/merge-users-michelkerkmeester-mega-devel-crispy-rabin.md` across 7 phases. Phase 1 (spec folder) and Phase 2 (skill scaffold + SKILL.md authoring) ran sequentially because Phase 2 blocked everything downstream. Phase 3 (web content migration) used bulk `cp -R` since scripts were verified as CWD-relative — no path edits required. Phase 4 (placeholder scaffolding) authored 10 pointer files. Phase 5 (cross-repo updates) ran tier-by-tier: Tier 1 (advisor scoring) was surgical with `replace_all` for both legacy skill names; Tier 2 (graph metadata) was per-file Edit; Tier 4 (root instructions) was per-line Edit; Tier 7 (legacy frontmatter) added 3 YAML keys per file. Tiers 3 (sister SKILL.md), 5 (agent definitions), and 6 (READMEs) are deferred — they update narrative text only and do not affect routing.

The Plan agent's three risk warnings (universal/ scope, scripts paths, advisor re-amplification) were each addressed: universal scope was tightened during authoring, scripts were audited and confirmed CWD-relative, and the deprecation strategy combined frontmatter flags with full boost-table retargeting (the optional `DEPRECATED_SKILLS` code-level guard remains available if validation surfaces residual amplification).

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Stack-detection FIRST, intent classification SECOND (ADR-001) | Intent words like "test", "performance", "build" mean different things across stacks. Web's intent-only model only worked because it implicitly assumed browser. Stack must gate intent. |
| Bare `sk-code` name (ADR-002) | User-directed. Cleanest umbrella for the code skill family alongside sibling sk-code-opencode and sk-code-review. Boost tables use exact-name keys, so siblings remain disambiguated. |
| Empty templated stubs for non-web stacks (ADR-003) | User explicitly asked for "empty placeholder references, assets". Single `_placeholder.md` per stack folder honors the directive without per-file stub clutter. canonical_source + source_version frontmatter enables future drift detection. |
| Code-level exclusion list deferred; rely on additive frontmatter + retargeted boost tables (ADR-004) | "Don't overwrite the 2 skills" forced a non-invasive deprecation. Adding 3 YAML keys preserves all body content and is reversible. The DEPRECATED_SKILLS Python/TS guard is documented as an optional follow-up if amplification recurs after `doctor:skill-advisor :confirm`. |
| Tightly-scoped universal/ namespace (ADR-005) | Plan-agent flagged debugging_workflows.md and verification_workflows.md as browser-coupled. Promoting them to universal/ would have surfaced wrong guidance to Go/Swift users. They stay in web/. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `python3 -m py_compile skill_advisor.py` | PASS |
| `bash validate.sh` on 054-sk-code-merger (non-strict) | PASS WITH WARNINGS (4 non-blocking warnings: AI_PROTOCOL section, SECTION_COUNTS acceptance scenarios, EVIDENCE_CITED items, ANCHORS_VALID custom anchors) |
| `bash validate.sh --strict` | FAILED (strict treats warnings as failures; non-strict is the operational gate) |
| `skill_graph_compiler.py --export-json` | PASS — skill-graph.json regenerated (skill_count=22, sk-code in adjacency, sk-code is hub skill) |
| `advisor_rebuild` MCP tool | PASS — SQLite skill-graph.sqlite rebuilt; skillCount=23, indexedNodes=9, indexedEdges=77 |
| `npm run build` (TypeScript) | PASS — explicit.ts + lexical.ts changes compiled to dist/ |
| `npx vitest run lane-attribution.test.ts` | PASS (1/1 tests green) |
| Trigger test: "fix Webflow animation flicker" | sk-code (conf=0.937) ✓ |
| Trigger test: "Add a React component to my Next.js app" | sk-code (conf=0.905) ✓ |
| Trigger test: "implement a Go service handler" | sk-code (conf=0.937) ✓ |
| Trigger test: "audit OpenCode plugin loader" | sk-code-review (conf=0.937), sk-code-opencode (conf=0.899) — acceptable; "audit" strongly biases review |
| Trigger test: "review this PR" | sk-code-review (conf=0.950) ✓ |
| Advisor lifecycle gate | PASS — sk-code-web and sk-code-full-stack filtered (lifecycle_status: deprecated) |
| Advisor list shows `[DEPRECATED — superseded by sk-code]` prefix | PASS (verified live in advisor brief output) |
| Web smoke test (minify-webflow.mjs from new vs legacy location) | PENDING (requires Webflow project context to run) |
| Cross-repo regrep returns only intentional refs | PARTIAL (Tier 3, 5, 6 deferred — cosmetic narrative updates; ~7 sister SKILL.md + 3 agent defs + ~10 docs still mention legacy names) |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Validation suite not yet executed**. Run `/doctor:skill-advisor :confirm`, then 5 trigger-test prompts, lane-attribution test, and the web smoke test. Each is documented in the §6 Verification section of `plan.md`.

2. **Tiers 3, 5, 6 deferred — narrative-only updates**. 7 sister SKILL.md cross-refs, 3 deep-review agent definitions, and ~10 README/doc files still mention legacy skill names in narrative text. These do NOT affect routing (Tier 1 + 2 already retarget). Recommended approach: per-file `replace_all "sk-code-web" → "sk-code"` and `"sk-code-full-stack" → "sk-code"` with manual review for edge cases.

3. **`skill-graph.json` is stale**. The auto-generated file at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` still lists `sk-code-web` and `sk-code-full-stack` in its families/adjacency/signals sections. Will be regenerated by `doctor:skill-advisor :confirm`.

4. **DEPRECATED_SKILLS code-level guard not added**. Defensive measure deferred. If `doctor:skill-advisor :confirm` re-amplifies legacy skills despite frontmatter flags, add `DEPRECATED_SKILLS = frozenset({"sk-code-web", "sk-code-full-stack"})` early-return guard in `skill_advisor.py` and `explicit.ts`. This was the architectural option in ADR-004.

5. **Implementation-summary.md and decision-record.md frontmatter strings were initially too narrative** and tripped the SPECDOC_FRONTMATTER_004 validator. Compacted in this revision.

<!-- /ANCHOR:limitations -->
