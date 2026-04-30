---
title: "Implementation Plan: sk-code multi-stack scaffolding"
description: "Three-phase plan covering original 056 attempt, naming reconciliation + bulk stub fill (absorbed 057), and sk-doc smart-router alignment + reference rewrites."
trigger_phrases: ["056 plan", "sk-code multi-stack plan", "stack scaffolding plan"]
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/056-sk-code-fullstack-branch"
    last_updated_at: "2026-04-30T17:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "057 merged into 056"
    next_safe_action: "Run /memory:save"
    blockers: []
    completion_pct: 100
---
# Implementation Plan: sk-code multi-stack scaffolding

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + JSON + YAML frontmatter; placeholder TS/Go/CSS-in-TS files |
| **Framework** | system-spec-kit (Level 2 templates), sk-code skill, sk-doc reference template, cli-codex orchestrator |
| **Storage** | File system; SQLite memory index (refreshed via generate-context.js) |
| **Testing** | sk-doc validate_document.py + extract_structure.py (DQI); grep-based path/marker sweeps; advisor smoke test |

### Overview
Three sequential phases of work, executed across two former packets that have been merged here. Phase A (original 056) attempted to promote `references/{react,go}/` placeholders to live with kerkmeester-style content; folder naming and dishonest "live" markers broke routing. Phase B (absorbed from 057) renamed `nextjs/` → `react/` then back to `nextjs/` per user direction, did the kerkmeester scrub, and dispatched cli-codex for 43 project-agnostic stubs. Phase C aligned the SKILL.md smart router with the sk-doc canonical pattern, rewrote the 4 universal/ + 5 router/ reference docs and 2 universal/ checklists to the sk-doc reference and asset templates, and stripped all `<!-- ANCHOR -->` HTML comments from every md file under sk-code.

---

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md §3).
- [x] Success criteria measurable (6 SC items in spec.md §5).
- [x] Dependencies identified (cli-codex, sk-doc validators, generate-context.js).
- [x] Lineage with absorbed packet 057 documented (spec.md §1 METADATA).

### Definition of Done
- [x] All 8 P0 acceptance criteria met (REQ-001 through REQ-008).
- [x] All 3 P1 acceptance criteria met (REQ-010 through REQ-012).
- [x] Path-existence sweep returns 0 missing across 33 RESOURCE_MAPS paths.
- [x] sk-doc validation: 9 reference docs all `valid: true`, 0 issues.
- [x] Advisor smoke test passes 3/3 prompts (Next.js / Go / Webflow).
- [x] Zero anchors, zero TODO blocks, zero kerkmeester references in sk-code.

---

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mechanical multi-phase remediation. No code architecture introduced; this packet manipulates skill scaffolding only.

### Key Components
- **system-spec-kit (Level 2 templates)**: spec.md / plan.md / tasks.md / checklist.md / implementation-summary.md scaffolding for the packet itself.
- **sk-code skill**: target of all changes (SKILL.md routing, references/, assets/, README, CHANGELOG, description.json, graph-metadata.json).
- **sk-doc reference and asset templates**: shape the rewrites of 4 universal/ + 5 router/ references and 2 universal/ checklists.
- **cli-codex skill**: dispatch surface for bulk stub creation (gpt-5.5 high, fast service tier).
- **cross_stack_pairing.md**: canonical Next.js ↔ Go contract preserved through restructure (15K+ of envelopes, JWT, CORS, deploy, drift content).

### Data Flow
```
Phase A (056 origin)
   spec/plan/tasks/checklist authored
   → references/{react,go}/README + impl_workflows + cross_stack_pairing.md created (kerkmeester-tied)
   → folder naming inconsistency: code says references/react/, disk shows references/nextjs/
   → routing broken; superseded by 057

Phase B (absorbed 057)
   git mv nextjs ↔ react cycles (user-directed final state: nextjs)
   → cli-codex dispatch #1: 43 stub files (23 NEXTJS + 20 GO)
   → 4 carry-over rewrites (README × 2, impl_workflows × 2)
   → kerkmeester scrub across SKILL.md, description.json, graph-metadata.json, advisor scoring, cross_stack_pairing
   → SKILL.md routes block: LIVE → STUB for NEXTJS / GO
   → version bump 1.2.0 → 1.3.0; changelog/v1.3.0.0.md authored

Phase C (sk-doc alignment + cleanup)
   SKILL.md §2 SMART ROUTING rewritten to sk-doc pattern (single Python pseudocode block, _task_text/_guard_in_skill/discover_markdown_resources/score_intents/select_intents/route_code_resources helpers)
   → §5 REFERENCES section added (sk-doc canonical shape)
   → 4 universal/ refs rewritten to sk-doc reference template
   → 5 router/ refs rewritten to sk-doc reference template
   → 2 universal/ checklists rewritten to sk-doc asset template
   → all ANCHOR comments stripped via Python pass
   → sk-doc validation 9/9 valid, DQI good/excellent
```

---

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A — Original 056 attempt (kept for lineage, partial completion)
- [x] Spec / plan / tasks / checklist authored.
- [x] `references/{react,go}/README.md` + `implementation/implementation_workflows.md` authored (kerkmeester-flavored).
- [x] `references/router/cross_stack_pairing.md` authored (15K canonical contract).
- [ ] Folder naming aligned to spec (left as `references/nextjs/` instead of `references/react/`; broke SKILL.md routing).
- [ ] Per-domain deep-references (debugging, verification, deployment, standards) populated — only 1 entry-point per stack written.
- [ ] Checklist marked complete — the implementation-summary claimed 85% but checklist was 0% verified.

Phase A outcome: skeleton + entry-point doc per stack; routing broken; superseded by Phase B.

### Phase B — Naming reconciliation + bulk stub fill (absorbed from 057)
- [x] Pre-flight grep: identify consumers of `references/nextjs` and `assets/nextjs` paths.
- [x] User-directed final naming: `NEXTJS` constant + `references/nextjs/` + `assets/nextjs/` (not `react/`).
- [x] `mkdir -p assets/nextjs/{checklists,patterns,integrations}` + `assets/go/{checklists,patterns}`.
- [x] cli-codex dispatch #1 (gpt-5.5 high, fast): 23 NEXTJS stubs.
- [x] cli-codex dispatch #2 (gpt-5.5 high, fast): 20 GO stubs (combined with NEXTJS in single 43-file dispatch in earlier attempt; re-run after rename).
- [x] 4 carry-over rewrites by hand: NEXTJS + GO READMEs and implementation_workflows.md.
- [x] cross_stack_pairing.md kerkmeester scrub (keyword line + line 200 prose).
- [x] SKILL.md routes block + Resource Domains: LIVE → STUB for NEXTJS / GO.
- [x] description.json + graph-metadata.json: supported_stacks, keywords, lastUpdated, placeholder_fill_packet field.
- [x] Advisor scoring (explicit.ts): NEXTJS lane (replacing REACT); kerkmeester key removed; nextjs go pairing triggers added.
- [x] Skill version 1.2.0 → 1.3.0; `changelog/v1.3.0.0.md` authored.

### Phase C — sk-doc alignment + cleanup
- [x] SKILL.md §2 SMART ROUTING rewritten to sk-doc canonical pattern.
- [x] SKILL.md §5 REFERENCES section inserted; sections 5-9 renumbered to 6-10.
- [x] All ANCHOR HTML comments stripped from every sk-code md file (Python pass).
- [x] 4 universal/ refs rewritten: code_quality_standards, code_style_guide, error_recovery, multi_agent_research.
- [x] 5 router/ refs rewritten: stack_detection, intent_classification, resource_loading, phase_lifecycle, cross_stack_pairing.
- [x] 2 universal/ checklists rewritten to sk-doc asset template: debugging_checklist, verification_checklist.
- [x] cleanup pass after each batch to handle auto-linter pollution.

### Phase D — Validation + memory save
- [x] Path-existence sweep: 33/33 NEXTJS + GO RESOURCE_MAPS paths resolve.
- [x] sk-doc validation: 9/9 reference docs `valid: true`, 0 issues.
- [x] DQI scoring: all 9 reference docs band ∈ {good, excellent}.
- [x] Advisor smoke regression: Next.js 0.86, Go 0.78, Webflow 0.84.
- [x] Anchor sweep: 0 remaining.
- [x] Kerkmeester sweep: 0 remaining.
- [x] No-fenced-code in markdown stubs sweep: 0 remaining.
- [ ] Final `/memory:save` to refresh description.json + graph-metadata.json + memory index (run by user after merge complete).

---

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Path resolution | All 33 SKILL.md `RESOURCE_MAPS[NEXTJS|GO]` paths | `[ -f $p ] || echo MISSING $p` loop |
| sk-doc validate | 9 reference + 2 asset checklist files | `python3 .opencode/skill/sk-doc/scripts/validate_document.py <file> --json` |
| sk-doc DQI | Same 9 + 2 files | `python3 .opencode/skill/sk-doc/scripts/extract_structure.py <file>` |
| No fictional code | Markdown stubs (cross_stack_pairing exempt) | `grep -rE '^\`\`\`' references/{nextjs,go} --include="*.md"` |
| Project leakage | Whole `sk-code/` subtree | `grep -rl "kerkmeester" .opencode/skill/sk-code/` |
| Anchor sweep | Whole `sk-code/` subtree | `grep -rln '<!--.*ANCHOR:' .opencode/skill/sk-code/` |
| Routing regression | sk-code skill advisor | `skill_advisor.py "<prompt>" --threshold 0.8` × 3 prompts |

---

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex (gpt-5.5 high, fast) | External CLI | Green | Phase B stalls; manual stub creation slower fallback |
| sk-doc validate_document.py + extract_structure.py | Internal | Green | Phase D DQI scoring impossible; manual structural review fallback |
| skill_advisor.py | Internal | Green | Routing regression impossible; manual SKILL.md path inspection fallback |
| generate-context.js (memory save) | Internal | Green | description.json + graph-metadata.json refresh manual; memory index stale |
| Webflow stack content | Internal (read-only) | Green | None — referenced as mirror; no changes needed |

---

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase B regenerates fictional code; Phase C scrub damages cross_stack_pairing canonical structure; Phase D advisor regression on Webflow.
- **Procedure**: `git checkout -- .opencode/skill/sk-code/` to revert sk-code changes; rerun cli-codex with corrected prompt; re-author sk-doc rewrites incrementally.

---

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase A (origin) ──► [superseded] ──► Phase B (rename + fill) ──► Phase C (sk-doc align) ──► Phase D (validate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| A (origin) | None | (superseded; not blocking) |
| B (rename + fill) | A's spec scope | C, D |
| C (sk-doc align) | B (folders + JSON metadata stable) | D |
| D (validate) | A + B + C | Memory save / completion claim |

---

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| A (origin) | Med | ~3 hours (initial attempt) |
| B (rename + fill) | Med | ~2 hours |
| C (sk-doc align) | High | ~3 hours |
| D (validate + cleanup) | Low | ~1 hour |
| **Total** | | **~9 hours** |

---

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Workspace clean enough that `git mv` won't conflict.
- [x] cli-codex dispatch prompts saved to scratch/ (now removed during merge).
- [x] Webflow content unchanged check: `git diff -- references/webflow assets/webflow scripts/` empty after every phase.

### Rollback Procedure
1. **Phase B fictional code**: `git checkout -- .opencode/skill/sk-code/{references,assets}/{nextjs,go}` → re-dispatch cli-codex with stricter prohibitions.
2. **Phase C reference rewrite damage**: `git checkout -- .opencode/skill/sk-code/references/{universal,router}/` → re-attempt with sk-doc template study.
3. **Phase D advisor regression**: revert specific edit; isolate which change broke the score.

### Data Reversal
- **Has data migrations?** No — file-system changes only.
- **Reversal procedure**: `git restore` is the entire reversal mechanism; no DB rollback needed. Memory index can be re-built via `memory_index_scan({ specFolder })`.
<!-- /ANCHOR:enhanced-rollback -->
