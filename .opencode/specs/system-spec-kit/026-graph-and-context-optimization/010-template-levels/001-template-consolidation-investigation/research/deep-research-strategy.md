---
title: Deep Research Strategy — Template System Consolidation
description: Runtime strategy for the 010-template-levels deep-research session. Tracks topic, key questions, non-goals, stop conditions, and reducer-owned progress sections.
session_id: 2026-05-01-07-55-00-template-consolidation
spec_folder: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels
---

# Deep Research Strategy — Template System Consolidation

## 1. OVERVIEW

### Purpose
Persistent strategy file for the autonomous deep-research loop investigating whether the system-spec-kit templates folder (83 .md files / ~13K LOC) can be consolidated by eliminating the per-level output directories (`level_1/` … `level_3+/`) and replacing them with an on-demand generator that composes from `core/` + `addendum/` + a level-rules manifest at spec-folder creation time.

### Usage
- **Init:** This file populated at session start with topic, key questions, non-goals, stop conditions, and known context.
- **Per iteration:** Each iteration's @deep-research / cli-codex agent reads §11 NEXT FOCUS, performs investigation, writes evidence to `iterations/iteration-NNN.md`, and the reducer refreshes machine-owned sections (§3, §6-§11).
- **Mutability:** Analyst-owned sections (§1, §2, §4, §5, §12, §13) stay stable; reducer-owned sections (§3, §6-§11) are rewritten after each iteration.

---

## 2. TOPIC

Investigate consolidating the system-spec-kit templates folder: can we remove the per-level output directories (level_1, level_2, level_3, level_3+) and replace them with on-demand generation from core/ + addendum/ manifests, while preserving the validator (check-files.sh), ~800 existing spec folders that contain SPECKIT_TEMPLATE_SOURCE markers, the phase_parent lean trio, ANCHOR-tag semantics consumed by memory-frontmatter parsers, and cross-cutting templates (handover.md, debug-delegation.md, research.md, resource-map.md, context-index.md). Output a concrete recommendation (CONSOLIDATE / PARTIAL / STATUS QUO) with refactor steps, risk mitigations, file-count and LOC deltas, generator design choice (extend compose.sh / TS rewrite / JSON-driven), and a backward-compatibility path.

---

## 3. KEY QUESTIONS (remaining)
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
[None yet]

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Do NOT investigate `templates/phase_parent/` lean-trio system — preserved as-is, evaluated only for co-location
- Do NOT investigate cross-cutting templates (`handover.md`, `debug-delegation.md`, `research.md`, `resource-map.md`, `context-index.md`) for consolidation — they are not level-specific
- Do NOT touch `templates/{changelog,examples,stress_test,scratch}/` and `.hashes/` — out of scope
- Do NOT actually perform the refactor in this packet — the deliverable is a recommendation + concrete plan, not a code change
- Do NOT migrate existing spec folders' `SPECKIT_TEMPLATE_SOURCE` markers in this packet — that's a follow-on packet step

---

## 5. STOP CONDITIONS

- Convergence: ratio of new-findings-per-iteration drops below 0.05 (default convergenceThreshold)
- Stuck: 3 consecutive iterations with no new findings or no question progress (stuckThreshold)
- Max iterations: 10
- All key questions (Q1-Q10) answered with cited evidence (source paths or grep results)
- Final recommendation produced with: (a) chosen direction, (b) file/LOC deltas, (c) generator design choice with trade-off rationale, (d) backward-compat strategy, (e) refactor plan or close-out justification

---

## 6. ANSWERED QUESTIONS
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

## 8. WHAT FAILED
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

## 9. EXHAUSTED APPROACHES (do not retry)
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

## 10. RULED OUT DIRECTIONS
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

## 11. NEXT FOCUS
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Prior research from packet spec (010-template-levels/001-template-consolidation-investigation/spec.md)

- Templates folder: 83 .md files / ~13K LOC
- Architecture: CORE + ADDENDUM v2.2 (already composable)
- 4 CORE files: `core/{spec-core,plan-core,tasks-core,impl-summary-core}.md`
- 4 ADDENDUM folders: `addendum/{level2-verify,level3-arch,level3-plus-govern,phase}/`
- 4 materialized output directories: `level_1/`, `level_2/`, `level_3/`, `level_3+/` (~60 files duplicating CORE+ADDENDUM)
- Composer: `scripts/templates/compose.sh` (build-time, writes level outputs to disk)
- Anchor wrapper: `scripts/templates/wrap-all-templates.{ts,sh}` (ANCHOR injection for memory-frontmatter parsers)
- Primary consumer: `scripts/spec/create.sh` (lines ~538-661) → `scripts/lib/template-utils.sh::copy_template` (cp from `level_N/`)
- Validator: `scripts/rules/check-files.sh` (level required-file rules)
- Cross-cutting: `handover.md`, `debug-delegation.md`, `research.md`, `resource-map.md`, `context-index.md` (preserved)
- Phase parent: `templates/phase_parent/` lean trio detection via `isPhaseParent()` (preserved)
- Real spec folders (sample 005-memory-indexer-invariants) contain `<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->` markers + `template_source` YAML field

### Relevant prior packets (none found in 026/ specifically about templates)

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05
- Stuck threshold: 3
- Per-iteration budget: 12 tool calls, 15 minutes
- Per-iteration timeout: 900s (15 min)
- Max session duration: 240 min (4 hours hard cap)
- Progressive synthesis: true
- Executor: cli-codex / gpt-5.5 / reasoning=high / service-tier=fast / sandbox=workspace-write (default)
- Lifecycle: new (live); resume/restart on recovery
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- research.md ownership: workflow-owned canonical synthesis output
- Session ID: 2026-05-01-07-55-00-template-consolidation
- Generation: 1
- Started: 2026-05-01T07:55:00Z
