---
title: "Decision Record: Template System Consolidation — Levels and Addendum to Generator"
description: "ADR-001 stub: investigation initiated. Final decision (CONSOLIDATE / PARTIAL / STATUS QUO) populated post deep-research convergence."
template_source: "SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2"
trigger_phrases:
  - "template consolidation decision"
  - "spec-kit template ADR"
  - "compose.sh decision"
importance_tier: "high"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-template-levels"
    last_updated_at: "2026-05-01T07:34:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "ADR-001 stub created; awaiting deep-research synthesis"
    next_safe_action: "Wait for deep-research convergence, then finalize ADR-001"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-01-template-consolidation-investigation"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "CONSOLIDATE / PARTIAL / STATUS QUO — pending research"
    answered_questions: []
---
# Decision Record: Template System Consolidation — Levels and Addendum to Generator

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Direction for Template System Consolidation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-01 |
| **Deciders** | michelkerkmeester (final), `/spec_kit:deep-research:auto` loop (10 iterations, converged at newInfoRatio 0.04) |
| **Synthesis source** | `research/research.md` (29.7K, 17 sections) |

---

<!-- ANCHOR:adr-001-context -->
### Context

The spec-kit templates folder ships 83 .md files / ~13K LOC across `core/`, `addendum/{level2-verify,level3-arch,level3-plus-govern,phase}/`, and four materialized output directories (`level_1/`, `level_2/`, `level_3/`, `level_3+/`). The CORE + ADDENDUM v2.2 architecture was designed to be composable, but `compose.sh` writes composition results back to disk and consumers (`create.sh`) read those materialized outputs — creating two independent drift surfaces and ~60 redundant files. We need to decide whether to collapse the level outputs into an on-demand generator, accept a partial consolidation, or keep the status quo.

### Constraints

- ~800 existing spec folders contain `<!-- SPECKIT_TEMPLATE_SOURCE -->` markers that may reference deprecated paths after consolidation
- `check-files.sh` validator currently knows required files per level via inspection of `level_N/` directories
- `wrap-all-templates.ts` ANCHOR injection must be preserved bit-for-bit (memory-frontmatter parsers depend on it)
- `phase_parent/` lean-trio detection (`isPhaseParent()`) must continue working
- Cross-cutting templates (`handover.md`, `debug-delegation.md`, `research.md`, `resource-map.md`, `context-index.md`) are out of scope and must be preserved
- Generator latency added to `create.sh` must stay <500ms (NFR-P01)
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: **PARTIAL consolidation** — separate source-of-truth consolidation from immediate physical deletion of rendered `templates/level_N` directories.

**How it works**: Adopt the 4-Phase plan from `research/research.md`:
- **Phase 1**: Extend `compose.sh` with non-mutating output-root support (`SPECKIT_TEMPLATE_OUT_ROOT`); repair byte-equivalence drift (legacy `_memory.continuity` blocks, ANCHOR span preservation, decision-record metadata); add golden parity tests. Gate: generated output byte-identical to checked-in goldens (READMEs excluded by policy).
- **Phase 2**: Add TypeScript resolver with `path` / `content` / `metadata` modes + shell wrapper (`ensure_template_level_dir`, `get_template_path`, `get_template`). Generated cache preserves `templates/level_N` path shape; checked-in dirs stay as fallback. Gate: `template-structure.js` reads through resolver content mode; `create.sh` temp-workspace tests pass from both generated cache and fallback.
- **Phase 3**: Migrate consumers — `template-utils.sh`, `create.sh`, `template-structure.js`, `check-template-staleness.sh`, active tests, command YAMLs, runtime agent docs, AGENTS.md, CLAUDE.md. Gate: root tests pass + strict validation samples match generated and checked-in behavior.
- **Phase 4** (optional, gated): delete the 4 rendered `templates/level_N` directories — measured at exactly **25 markdown files / 4,087 LOC**. Gate: `rg "templates/level_"` shows no active consumers outside historical fixtures + resolver strict mode passes in CI + one-commit rollback verified.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| A: Full CONSOLIDATE (eliminate `level_N/` immediately, on-demand generator only) | Single source of truth; ~25 fewer files / 4,087 LOC; zero drift surface | Generator NOT byte-identical to checked-in goldens today (iter 3 finding); `template-structure.js` + command YAMLs + tests + governance docs all reference `templates/level_N/` paths; would break ~868 existing spec folders' provenance trail | 4/10 |
| **B: PARTIAL** (separate SoT consolidation from physical deletion; 4-phase gated plan) | Resolver migration improves the system without breaking active consumers; byte-parity gates catch regressions before deletion; tolerant marker parsing keeps 868 existing folders valid; deletion is Phase 4 only after parity proven | Carries `templates/level_N/` as committed goldens through Phase 3; deletion deferred (may never happen if parity stays expensive) | **9/10 (chosen)** |
| C: STATUS QUO (keep current `compose.sh` + materialized outputs, no resolver) | Zero migration risk; battle-tested | Two-surface drift continues forever; every CORE/ADDENDUM edit still requires re-running `compose.sh` and committing regenerated outputs; no path forward to consolidation | 3/10 |

**Why PARTIAL (B)**: The deep-research loop revealed that the rendered `templates/level_N/` are NOT just generated artifacts — they are runtime contracts read by `template-structure.js`, command YAMLs, tests, and governance docs. Today's `compose.sh` is deterministic against itself but NOT byte-equivalent to the committed goldens (iter 3). Full immediate deletion (option A) would break the contract; status quo (option C) leaves the dual-drift surface forever. The 4-phase gated plan in option B fixes the source-of-truth duplication via byte-parity repair + resolver migration, while keeping the goldens as a fallback through Phase 3 and making Phase 4 deletion gated on strict-mode CI green.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves** (if CONSOLIDATE):
- Single source of truth — every conceptual section lives in exactly one file
- Drift surface eliminated — output cannot diverge from source because output is computed
- ~60 fewer files in `templates/`; estimated ~7K LOC reduction (subject to research validation)

**What it costs** (if CONSOLIDATE):
- Generator complexity (shell vs TS vs JSON-driven). Mitigation: extend existing `compose.sh` to minimize new code surface
- Backward-compat work for ~800 spec folders. Mitigation: keep `SPECKIT_TEMPLATE_SOURCE` markers as descriptive comments; migration script only if marker semantics change

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| ANCHOR-tag semantics regression breaks memory-frontmatter parsers | H | Byte-diff generator output against current `level_N/` files in CI |
| Validator silently breaks for new spec folders | H | Refactor validator to read same JSON manifest the generator uses |
| External tools / configs hardcode `templates/level_N/` paths | M | Audit `.opencode/`, `.claude/`, `.codex/` configs before deletion |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Drift surface IS real: every CORE/ADDENDUM edit requires rerunning `compose.sh` AND committing regenerated outputs; iter 3 proved current generator NOT byte-equivalent to committed goldens (semantic divergence, not cosmetic) |
| 2 | **Beyond Local Maxima?** | PASS | 3 options scored (A: 4/10, B: 9/10, C: 3/10); generator implementation alternatives (extend compose.sh / TS rewrite / JSON-driven) also evaluated iter 7 |
| 3 | **Sufficient?** | PASS | 4-phase plan with gated transitions; Phase 1 byte-parity repair eliminates root cause (drift); Phase 4 (optional) eliminates duplicate file surface entirely |
| 4 | **Fits Goal?** | PASS | Aligned with parent `026-graph-and-context-optimization` theme; reduces both maintenance friction and disk footprint by 25 files / 4,087 LOC at Phase 4 |
| 5 | **Open Horizons?** | PASS | Resolver API (path/content/metadata modes) enables future template extensibility (new levels, new addendums) without re-materializing per-level output dirs |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**: PENDING — populated post-research. If CONSOLIDATE, expected changes:
- Add: `templates/level-rules.json` (single source for required-file rules per level)
- Modify: `scripts/templates/compose.sh` (or rewrite as TS) to consume `level-rules.json`
- Modify: `scripts/lib/template-utils.sh::copy_template` to invoke generator
- Modify: `scripts/rules/check-files.sh` to read from `level-rules.json`
- Delete: `templates/level_1/`, `templates/level_2/`, `templates/level_3/`, `templates/level_3+/`

**How to roll back**: `git revert <consolidation-commit>` (single commit restores all level directories, validator, and consumer). No data migration to undo since this is filesystem-only.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
