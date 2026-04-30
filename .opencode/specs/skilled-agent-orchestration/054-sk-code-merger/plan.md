---
title: "Implementation Plan: Merge sk-code-web + sk-code-full-stack into sk-code"
description: "Stack-detection-first router skill consolidating web + multi-stack code orchestration; web content carried verbatim, non-web stacks placeholder stubs; legacy skills preserved on disk via additive frontmatter deprecation."
trigger_phrases: ["sk-code merger plan", "054 plan", "sk-code implementation plan"]
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/054-sk-code-merger"
    last_updated_at: "2026-04-30T08:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored implementation plan referencing ~/.claude/plans approved file"
    next_safe_action: "Begin Phase 2: scaffold sk-code/ directory structure"
    blockers: []
    completion_pct: 0
---
# Implementation Plan: Merge sk-code-web + sk-code-full-stack into sk-code

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

> **Authoritative plan:** This packet's full implementation plan was approved at `/Users/michelkerkmeester/.claude/plans/merge-users-michelkerkmeester-mega-devel-crispy-rabin.md`. This file mirrors the structure and adds spec-folder anchors required by Level 3 templates.

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python (skill_advisor.py), TypeScript (lane scorers, MCP server), Markdown (skills + spec docs), JSON (graph metadata), Shell (validation scripts), JS/MJS (web build scripts) |
| **Framework** | OpenCode skill system, system-spec-kit v2.2 templates, Spec Kit Memory MCP |
| **Storage** | Filesystem only (no DB writes) — generate-context.js refreshes JSON metadata |
| **Testing** | Manual trigger tests (5 prompts), `lane-attribution.test.ts` (Vitest/Jest), `validate.sh --strict`, `doctor:skill-advisor :confirm` |

### Overview
Create a new umbrella skill `sk-code` that smart-routes by detected stack. Web stack is the only LIVE branch (full content copied verbatim from `sk-code-web`); React, Node.js, Go, Swift, React Native are placeholder skeletons that mirror `sk-code-full-stack`'s 1:1 layout and explicitly point users to the legacy skill's authoritative content. Legacy skills are preserved on disk untouched (additive frontmatter deprecation only) and removed from advisor routing via a code-level `DEPRECATED_SKILLS` exclusion list. ~40 active cross-repo references retarget to `sk-code`; ~268 archival references in `specs/` and `observability/` remain untouched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md §2-3)
- [x] Success criteria measurable (spec.md §5)
- [x] Dependencies identified (spec.md §6)
- [x] Plan reviewed by Plan agent (cross-validated 2026-04-30)
- [x] User-approved decisions captured (name=sk-code, folder=054, placeholders=templated stubs)

### Definition of Done
- [ ] All P0 acceptance criteria met (REQ-001 through REQ-007)
- [ ] `bash validate.sh --strict` exits 0 for spec folder
- [ ] `lane-attribution.test.ts` passes
- [ ] 5 trigger-test prompts route correctly (3× sk-code, 1× sk-code-opencode, 1× sk-code-review)
- [ ] Web smoke test (minify-webflow.mjs from new location) produces identical output
- [ ] Regrep returns only intentional `sk-code-(web|full-stack)` mentions
- [ ] checklist.md items marked `[x]` with evidence
- [ ] implementation-summary.md authored with continuity frontmatter
- [ ] /memory:save executed for session continuity
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
**Smart router with stack-detection-first ordering and tiered resource loading.**

### Key Components

- **Stack detector**: marker-file precedence (Webflow signals → go.mod → Package.swift → app.json+expo → next.config → package.json+react → package.json fallback → UNKNOWN). First match wins.
- **Intent classifier**: TASK_SIGNALS scoring (VERIFICATION, DEBUGGING, CODE_QUALITY, IMPLEMENTATION, ANIMATION, FORMS, VIDEO, DEPLOYMENT, PERFORMANCE) extended with full-stack additions (TESTING, DATABASE, API).
- **Load level selector**: MINIMAL / DEBUGGING / FOCUSED / STANDARD (preserves full-stack tiered loading model).
- **Resource resolver**: maps (stack, intent, load_level) → file paths to read. WEB returns full live content; non-web returns placeholder + canonical pointer.
- **Deprecation gate**: `DEPRECATED_SKILLS` frozenset in `skill_advisor.py` + `explicit.ts` short-circuits scoring for legacy skill names regardless of boost tables or keyword headers.

### Data Flow

```
User prompt
   │
   ▼
[Skill advisor]
   │  ├─ DEPRECATED_SKILLS guard (sk-code-web, sk-code-full-stack → score 0)
   │  ├─ PHRASE_BOOSTS / TOKEN_BOOSTS (retargeted to sk-code)
   │  └─ Lane scoring (explicit.ts)
   ▼
sk-code recommended (score > threshold)
   │
   ▼
[sk-code SKILL.md routing]
   │  ├─ Stack detection (cwd marker files)
   │  ├─ Intent classification (TASK_SIGNALS)
   │  └─ Load level selection
   ▼
Resource set:
  • Always: SKILL.md guidance + references/universal/
  • WEB: references/web/{relevant} + assets/web/{relevant} + scripts/
  • REACT/NODEJS/GO/RN/SWIFT: references/<stack>/_placeholder.md + canonical pointer
  • UNKNOWN: hint message + stack-marker examples
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Spec folder (in progress)
- [x] Create 054-sk-code-merger/ with spec.md, plan.md, tasks.md, checklist.md, decision-record.md
- [ ] Generate description.json + graph-metadata.json (manual write or generate-context.js)

### Phase 2: New skill scaffold + content
- [ ] Create `.opencode/skill/sk-code/` directory tree
- [ ] Author SKILL.md (merged routing pseudocode + Webflow markers prepended to full-stack stack detection + extended TASK_SIGNALS)
- [ ] Author README.md (modeled on sk-code-web/README.md)
- [ ] Author CHANGELOG.md (1.0.0 baseline)
- [ ] Author `_router/` extracted reference docs (4 files)
- [ ] Generate graph-metadata.json + description.json

### Phase 3: Web content migration
- [ ] Copy `sk-code-web/references/{implementation,debugging,verification,deployment,performance,standards}/` → `sk-code/references/web/`
- [ ] Copy `sk-code-web/assets/{checklists,patterns,integrations}/` → `sk-code/assets/web/`
- [ ] Copy `sk-code-web/scripts/*.mjs` → `sk-code/scripts/` (no path edits — confirmed CWD-relative)
- [ ] Curate universal namespace: copy + strip browser-context bits from selected web references

### Phase 4: Placeholder stubs (5 stacks × 2 namespaces)
- [ ] react/, nodejs/, go/, react-native/, swift/ — references/ and assets/ each
- [ ] Generate `_placeholder.md` per stack with canonical pointer
- [ ] Generate empty stub files (frontmatter only) mirroring sk-code-full-stack 1:1 layout

### Phase 5: Cross-repo reference updates (Tiers 1-7)
- [ ] Tier 1: skill_advisor.py + explicit.ts + lexical.ts + lane-attribution.test.ts (DEPRECATED_SKILLS guard + boost retargeting)
- [ ] Tier 2: 8 graph-metadata.json files
- [ ] Tier 3: 7 sister SKILL.md cross-refs
- [ ] Tier 4: 4 root instruction files (AGENTS.md, CLAUDE.md, AGENTS_example_fs_enterprises.md, AGENTS_Barter.md)
- [ ] Tier 5: 3 deep-review agent definitions
- [ ] Tier 6: ~10 README/doc files
- [ ] Tier 7: 2 legacy SKILL.md frontmatter additions (additive only)

### Phase 6: Verification
- [ ] `bash validate.sh --strict` on spec folder
- [ ] `doctor:skill-advisor :confirm` re-tunes scoring
- [ ] 5 trigger-test prompts route correctly
- [ ] `lane-attribution.test.ts` passes
- [ ] Regrep for stale references (excluding archival paths)
- [ ] Web smoke test (minify-webflow.mjs from new location)

### Phase 7: Finalization
- [ ] implementation-summary.md authored with continuity frontmatter
- [ ] checklist.md items P0/P1/P2 marked with evidence
- [ ] /memory:save for session continuity
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Lane scorer attribution (after explicit.ts rewrite) | Vitest (lane-attribution.test.ts) |
| Integration | Skill advisor end-to-end scoring | `doctor:skill-advisor :confirm` + manual trigger prompts |
| Manual | 5 representative prompts → expected skill routing | Direct skill_advisor.py invocation or fresh advisor brief |
| Smoke | Web build script portability | `node scripts/minify-webflow.mjs` from new vs legacy skill location, diff outputs |
| Spec validation | Spec folder structure conformance | `bash validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `skill_advisor.py` PHRASE_BOOSTS / TOKEN_BOOSTS structure | Internal | Green | Routing degrades; mitigation: reference 053 packet for proven patterns |
| `explicit.ts` lane mapping format | Internal | Green | Lane scoring breaks; mitigation: model after existing entries |
| `generate-context.js` | Internal | Green | description.json/graph-metadata.json fallback to manual write |
| `validate.sh` Level 3 strict mode | Internal | Green | Without it, no automated spec verification; mitigation: manual review against templates |
| Existing `sk-code-web` content stability | Internal | Green | If user edits sk-code-web mid-merge, copy gets stale; mitigation: do migration in single pass |
| `doctor:skill-advisor` re-tuning | Internal | Green | If broken, manual boost tuning required |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Advisor regressions surface (web prompts no longer route correctly), web smoke test fails, or user observes wrong stack detection
- **Procedure**:
  1. Remove entries from `DEPRECATED_SKILLS` in skill_advisor.py + explicit.ts → legacy skills resume routing
  2. Revert PHRASE_BOOSTS / TOKEN_BOOSTS edits via git → original boost tables restored
  3. Revert legacy SKILL.md frontmatter edits via git → deprecation flags removed
  4. Optional: delete `.opencode/skill/sk-code/` if a clean rollback is wanted (legacy folders are untouched, so this is safe)
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Spec) ──► Phase 2 (Skill scaffold) ──► Phase 3 (Web migration)
                                                    │
                                                    ▼
                                                Phase 4 (Placeholders)
                                                    │
                                                    ▼
                                                Phase 5 (Cross-repo refs) ──► Phase 6 (Verify) ──► Phase 7 (Finalize)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (Spec) | None | Phase 2 |
| Phase 2 (Skill scaffold) | Phase 1 | Phase 3 |
| Phase 3 (Web migration) | Phase 2 | Phase 4, Phase 5 (Tier 1) |
| Phase 4 (Placeholders) | Phase 2 | Phase 6 |
| Phase 5 (Cross-repo refs) | Phase 2 | Phase 6 |
| Phase 6 (Verify) | Phase 3, 4, 5 | Phase 7 |
| Phase 7 (Finalize) | Phase 6 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (Spec) | Low | 30 min |
| Phase 2 (Skill scaffold + SKILL.md) | High | 2-3 hours |
| Phase 3 (Web migration) | Low | 30 min (cp + frontmatter checks) |
| Phase 4 (Placeholders) | Medium | 1 hour (~35 stub files) |
| Phase 5 (Cross-repo refs) | High | 3-4 hours (40 file edits across 7 tiers) |
| Phase 6 (Verify) | Medium | 1 hour |
| Phase 7 (Finalize) | Low | 30 min |
| **Total** | | **~10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Approved plan saved at `~/.claude/plans/merge-users-michelkerkmeester-mega-devel-crispy-rabin.md`
- [ ] Working tree clean before phase 5 advisor edits (or known-deltas tracked)
- [x] Both legacy skills' content untouched (verified by spec scope policy)

### Rollback Procedure
1. Remove `DEPRECATED_SKILLS` entries → legacy skills resume routing immediately
2. `git diff` the advisor files; revert with `git checkout HEAD -- <path>` if scoped revert needed
3. Smoke-test legacy skills route correctly: "sk-code-web minify" should return sk-code-web with weight back to original
4. (Optional) Delete `.opencode/skill/sk-code/` for clean rollback — legacy content is intact

### Data Reversal
- **Has data migrations?** No (filesystem only)
- **Reversal procedure**: git revert / git checkout — no DB or external state involved
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Phase 1    │────►│  Phase 2    │────►│  Phase 3    │     │  Phase 4    │
│  Spec       │     │  Scaffold   │     │  Web migr.  │     │ Placeholders│
└─────────────┘     └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
                           │                    │                    │
                           ▼                    └──────┬─────────────┘
                    ┌─────────────┐                    │
                    │  Phase 5    │◄───────────────────┘
                    │  X-repo refs│
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐     ┌─────────────┐
                    │  Phase 6    │────►│  Phase 7    │
                    │  Verify     │     │  Finalize   │
                    └─────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Spec docs | None | spec/plan/tasks/checklist/DR | Skill scaffold |
| Skill SKILL.md | Spec docs | Routing contract | Web migration, Tier 1-3 cross-refs |
| Web content migration | SKILL.md | Live web branch | Tier 1 advisor, Phase 6 verify |
| Placeholders | SKILL.md | Stub scaffolding | Phase 6 verify |
| Tier 1 advisor | SKILL.md, Web migration | Routing live | Phase 6 verify |
| Tier 2-7 cross-refs | SKILL.md | External ref consistency | Phase 6 verify |
| Verification | All above | Pass/fail signals | Finalization |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 2: Author SKILL.md** — 1-2 hours — CRITICAL (blocks all downstream)
2. **Phase 3: Web migration** — 30 min — CRITICAL (Tier 1 depends on web/ existing)
3. **Phase 5 Tier 1: Advisor scoring** — 1 hour — CRITICAL (gates verification)
4. **Phase 6: Verification** — 1 hour — CRITICAL (gates finalization)

**Total Critical Path**: ~4-5 hours of focused critical work; ~10 hours total including non-critical parallel work.

**Parallel Opportunities**:
- Phase 4 (Placeholders) can run after Phase 2 — does not need Phase 3 web migration
- Tier 2-7 (graph metadata + sister refs + root files + agents + READMEs + deprecation) can interleave with Tier 1 work after SKILL.md is stable
- README/doc updates (Tier 6) can be batched and dispatched to a cli-codex agent for parallel execution if context window is tight
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Spec folder live | spec/plan/tasks/checklist/DR + JSON metadata; validate.sh --strict passes | End of Phase 1 |
| M2 | New skill skeleton + SKILL.md authored | Stack detection + intent classification + phase lifecycle complete; routing pseudocode reviewable | End of Phase 2 |
| M3 | All content migrated + placeholders scaffolded | sk-code/references/{web,universal,react,nodejs,go,react-native,swift}/ + assets/ + scripts/ all present | End of Phase 4 |
| M4 | Cross-repo references retargeted | Regrep returns only intentional refs; lane-attribution test passes | End of Phase 5 |
| M5 | Verification complete | All 5 trigger tests pass; web smoke test passes; spec validate passes | End of Phase 6 |
| M6 | Packet finalized | implementation-summary.md authored; memory saved; checklist items marked with evidence | End of Phase 7 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

> Full ADRs live in `decision-record.md`. Summary entries:

- **ADR-001**: Stack-detection-first ordering (vs. intent-first) — accepted; documented rationale.
- **ADR-002**: Bare `sk-code` name (vs. suffixed) — user-directed; rationale captured.
- **ADR-003**: Empty templated stubs for non-web stacks (vs. full content copy or symlinks) — user-directed; alignment with "preserve as reference" intent.
- **ADR-004**: Code-level `DEPRECATED_SKILLS` exclusion list (vs. SKILL.md rename) — accepted; non-invasive, reversible, respects "don't overwrite" directive.
- **ADR-005**: Tightly-scoped `universal/` namespace (vs. broad lift from web) — accepted per Plan-agent critique; debugging_workflows + verification_workflows stay in web/ to avoid smuggling browser assumptions.

---

<!--
LEVEL 3 PLAN — full content authored 2026-04-30
Cross-references: spec.md, tasks.md, checklist.md, decision-record.md
Approved plan source: ~/.claude/plans/merge-users-michelkerkmeester-mega-devel-crispy-rabin.md
-->
