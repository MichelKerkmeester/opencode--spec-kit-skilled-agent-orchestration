---
title: "Implementation Plan: Template System Consolidation — Levels and Addendum to Generator"
description: "Investigation-only packet. Phase 0 runs the deep-research loop; Phases 1-N are TBD pending convergence. The deep-research synthesis will populate downstream phases (refactor design, migration script, validator updates, rollout)."
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
trigger_phrases:
  - "template consolidation plan"
  - "template generator plan"
  - "spec-kit refactor plan"
  - "compose.sh refactor"
importance_tier: "high"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-template-levels"
    last_updated_at: "2026-05-01T07:34:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Plan skeleton; downstream phases populated post-research"
    next_safe_action: "Wait for /spec_kit:deep-research:auto convergence"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-01-template-consolidation-investigation"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Generator design (extend compose.sh / TS rewrite / JSON-driven)?"
      - "Backward-compat strategy for ~800 existing spec folders?"
    answered_questions: []
---
# Implementation Plan: Template System Consolidation — Levels and Addendum to Generator

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash + TypeScript (existing `compose.sh` + `wrap-all-templates.ts`) |
| **Framework** | Node.js for TS scripts; pure shell for orchestration |
| **Storage** | Filesystem only (`.opencode/skill/system-spec-kit/templates/`) |
| **Testing** | Byte-diff comparison against current `level_N/` outputs; existing `validate.sh --strict` |

### Overview
This packet is **investigation-only**. Phase 0 (research) runs the autonomous deep-research loop and produces a synthesized recommendation in `research/research.md`. Phases 1 through N are intentionally left as TBD placeholders — they will be populated by the deep-research synthesis once it converges, with the actual refactor work landing in a follow-on packet (e.g., `011-template-consolidation-implementation/` or similar).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md` §2-3)
- [x] Success criteria measurable (`spec.md` §5)
- [x] Dependencies identified (`spec.md` §6)
- [x] Deep-research config dispatched

### Definition of Done
- [x] `research/research.md` contains a converged recommendation: **PARTIAL** (29.7K, 17 sections, converged at iter 10 newInfoRatio 0.04)
- [x] `decision-record.md` ADR-001 finalized: PARTIAL with 4-phase gated plan, 5/5 Five Checks PASS
- [x] Risk register populated (in `research/research.md` §11; `spec.md` retains framing-only register)
- [x] Phases 1-N populated with concrete refactor steps (see Phase Breakdown below)
- [ ] `validate.sh --strict` exits 0 or 1 (final pass after these edits)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Investigation packet — no production architecture yet. The deep-research loop iterates over the candidate design space:
- **Option A**: Eliminate `level_N/` entirely; on-demand generator at `create.sh` time
- **Option B**: Keep `level_N/` as build artifacts but generate on demand from a single JSON manifest (hybrid)
- **Option C**: Status quo — keep current `compose.sh` + materialized outputs

### Key Components (under investigation)
- **Source of truth**: `core/` (4 files) + `addendum/` (4 manifests) + level-rules JSON
- **Generator**: extends or replaces `compose.sh` / `wrap-all-templates.ts`
- **Consumer**: `create.sh::copy_template` (refactored to call generator instead of `cp`)
- **Validator**: `check-files.sh` reads same level-rules JSON as generator

### Data Flow (proposed, subject to research)
```
[CORE files] + [ADDENDUM manifests] + [level-rules JSON]
       │
       ▼
   generator (on demand at create.sh time)
       │
       ▼
   spec folder/ (final composed .md files)
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Deep Research ✅ COMPLETE
- [x] Spec folder scaffolded
- [x] `research/deep-research-config.json` dispatched (10 iter, cli-codex gpt-5.5 high fast, convergence 0.05)
- [x] Loop converged at iteration 10 (newInfoRatio 0.04)
- [x] `research/research.md` synthesized (29.7K, 17 sections)
- [x] Decision-record ADR-001 finalized: **PARTIAL**

### Phase 1: Byte-Equivalence Repair (follow-on packet `011-template-consolidation-impl/`)
- [ ] Extend `.opencode/skill/system-spec-kit/scripts/templates/compose.sh` with `SPECKIT_TEMPLATE_OUT_ROOT` env or `--out-root` flag for non-mutating temp output
- [ ] Repair legacy `_memory.continuity` frontmatter blocks in source so generated output omits them
- [ ] Preserve committed ANCHOR span shapes (verify via byte-diff)
- [ ] Preserve metadata-level quirks (numeric anchor ordering, blank-line normalization)
- [ ] Repair decision-record metadata to match committed shape
- [ ] Add golden parity tests (`scripts/tests/template-byte-parity.vitest.ts` or similar)
- **GATE**: generated output byte-identical to checked-in `templates/level_N/` goldens (READMEs excluded by policy). No-go if any runtime doc / ANCHOR span / frontmatter block differs.

### Phase 2: Resolver Introduction
- [ ] Add TypeScript resolver `mcp_server/lib/templates/resolver.ts` with three modes: `path`, `content`, `metadata`
- [ ] Add shell wrapper functions in `scripts/lib/template-utils.sh`: `ensure_template_level_dir`, `get_template_path`, `get_template`
- [ ] Generated cache preserves `templates/level_N/` path shape inside the cache dir
- [ ] Checked-in `templates/level_N/` dirs remain as fallback (until Phase 4)
- [ ] Add resolver path/content/metadata tests
- **GATE**: `template-structure.js` reads through resolver content mode; `create.sh` temp-workspace tests pass from BOTH generated cache AND checked-in fallback; diagnostics preserve `templates/level_N/` path shape.

### Phase 3: Consumer Migration
- [ ] Migrate `scripts/lib/template-utils.sh` to invoke resolver instead of direct `cp`
- [ ] Migrate `scripts/spec/create.sh` (lines ~538-661) to call resolver
- [ ] Migrate `scripts/utils/template-structure.js` to read via resolver content mode
- [ ] Migrate `scripts/spec/check-template-staleness.sh`
- [ ] Migrate active tests under `scripts/tests/` and `mcp_server/tests/`
- [ ] Update command YAMLs that reference `templates/level_N/` literal paths
- [ ] Update runtime agent docs (`agent/*.md`)
- [ ] Update `AGENTS.md` and `CLAUDE.md` template references
- **GATE**: root tests pass + strict validation samples match generated and checked-in behavior. No-go if fallback is still required for active runtime consumers.

### Phase 4 (OPTIONAL): Delete Rendered Level Directories
- [ ] Delete `templates/level_1/`, `templates/level_2/`, `templates/level_3/`, `templates/level_3+/` — measured **25 markdown files / 4,087 LOC**
- [ ] Remove fallback branches from resolver (strict mode only)
- [ ] Final end-to-end verification: scaffold a new packet at each level, run `validate.sh --strict`
- **GATE**: `rg "templates/level_"` shows no active consumers outside historical fixtures or explicitly legacy docs; resolver strict mode passes in CI; one-commit `git revert` rollback verified.
- **NOTE**: Phase 4 is OPTIONAL. PARTIAL recommendation explicitly allows stopping after Phase 3 if parity stays expensive.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Byte-diff | Generator output vs current `level_N/*.md` files | `diff` in CI |
| Integration | `create.sh --level N` end-to-end | `validate.sh --strict` |
| Regression | Existing spec folders continue to validate | Loop over all `.opencode/specs/` packets, run `validate.sh` |
| Manual | New spec folder created, sections render correctly | Visual review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Deep-research loop convergence | Internal | In Progress | Blocks all downstream phases |
| `compose.sh` ANCHOR semantics doc | Internal | Available | Required for generator design |
| Level-rules JSON schema design | Internal | TBD | Blocks Phase 1 |
| ~800 existing spec folder audit | Internal | TBD | Blocks Phase 2 backward-compat |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `validate.sh --strict` fails on existing spec folders after consolidation, OR new spec folders fail to scaffold correctly
- **Procedure**: `git revert` the consolidation commit; restore `level_N/` directories from git history; consumers (`create.sh`, `check-files.sh`) revert with the same commit
- **Recovery time**: <5 minutes (single `git revert` + branch push); no data migration to undo since this is filesystem-only
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 0 (Research) ──► Phase 1 (Schema + Generator) ──► Phase 2 (Consumer wiring) ──► Phase 3 (Cleanup)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Research | None | All |
| Schema + Generator | Research | Consumer wiring |
| Consumer wiring | Schema + Generator | Cleanup |
| Cleanup | Consumer wiring | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Research | High | 10 iterations × 5-15min each (autonomous) |
| Schema + Generator | Med | 4-8 hours (follow-on packet) |
| Consumer wiring | Med | 3-6 hours (follow-on packet) |
| Cleanup | Low | 1-2 hours (follow-on packet) |
| **Total (this packet)** | | **Research-only — hours of autonomous loop** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist (for follow-on packet)
- [ ] Existing spec folder snapshot taken (git tag)
- [ ] Byte-diff CI gate green for all levels
- [ ] All `.opencode/`, `.claude/`, `.codex/` configs audited for hardcoded paths

### Rollback Procedure
1. `git revert <consolidation-commit>` — restores `level_N/` directories
2. `git push origin main` — same commit reverts validator + consumer changes
3. `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict --all-packets` — confirms recovery
4. No notification needed — internal tooling, no user-facing surface

### Data Reversal
- **Has data migrations?** No — filesystem only
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────┐     ┌─────────────────────┐     ┌──────────────────────┐     ┌──────────────┐
│   Phase 0       │────►│   Phase 1           │────►│   Phase 2            │────►│   Phase 3    │
│   Deep Research │     │   Schema+Generator  │     │   Consumer Wiring    │     │   Cleanup    │
└─────────────────┘     └─────────────────────┘     └──────────────────────┘     └──────────────┘
         │                                                    │
         │                                                    ▼
         │                                          ┌──────────────────────┐
         │                                          │   Migration Script   │
         └─────────────────────────────────────────►│   (if needed)        │
                                                    └──────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Deep Research | None | Recommendation + ADR | All |
| Level-rules JSON schema | Research | Schema spec | Generator, Validator |
| Generator | Schema | Composed level outputs | Consumer wiring |
| Validator update | Schema | Required-file rules | Cleanup |
| Migration script | Research (backward-compat decision) | Updated marker comments | Cleanup |
| Cleanup | Generator + Validator + Migration | Smaller templates/ | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 0 (Deep Research)** — hours (autonomous loop) — CRITICAL
2. **Phase 1 (Schema + Generator)** — 4-8 hours — CRITICAL
3. **Phase 2 (Consumer wiring + byte-diff CI)** — 3-6 hours — CRITICAL
4. **Phase 3 (Cleanup + delete `level_N/`)** — 1-2 hours — CRITICAL

**Total Critical Path**: deep-research duration + ~8-16 hours of follow-on engineering

**Parallel Opportunities**:
- Migration script (if needed) can develop in parallel with consumer wiring
- Documentation updates (`SKILL.md`, `CLAUDE.md`) can run alongside Phase 2
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Deep-research convergence | `research/research.md` produced with recommendation | Within 10 iterations |
| M2 | ADR-001 finalized | `decision-record.md` reflects chosen direction with rationale | Immediately post-research |
| M3 | Follow-on packet scoped | `011-template-consolidation-impl/` (or STATUS QUO close-out) | Same session as M2 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Template System Consolidation Direction (PENDING RESEARCH)

**Status**: Proposed (will be Accepted or Rejected after deep-research convergence)

**Context**: 83 templates / ~13K LOC; CORE+ADDENDUM v2.2 already exists but level outputs duplicated to disk; two drift surfaces.

**Decision**: TBD — one of {CONSOLIDATE, PARTIAL, STATUS QUO} — populated by deep-research synthesis

**Consequences**: Populated post-research

**Alternatives Rejected**: Populated post-research
