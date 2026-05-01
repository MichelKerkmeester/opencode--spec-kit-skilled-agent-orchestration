---
title: "Decision Record: Template Backend Greenfield Redesign — C+F Hybrid Manifest-Driven"
description: "ADR-001 finalized: C+F hybrid manifest-driven greenfield. 86 → 15 source files. Levels eliminated. Lazy command-owned addons. Plus ADR-002/003/004 from synthesis open items."
template_source: "SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2"
trigger_phrases:
  - "template greenfield decision"
  - "C+F hybrid ADR"
  - "kill levels ADR"
importance_tier: "high"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign"
    last_updated_at: "2026-05-01T12:20:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "ADR-001 finalized post-convergence; ADR-002/003/004 from synthesis open items"
    next_safe_action: "Trigger follow-on implementation packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-01-11-00-template-greenfield"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Decision Record: Template Backend Greenfield Redesign — C+F Hybrid Manifest-Driven

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: C+F Hybrid Manifest-Driven Greenfield Template System

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-01 |
| **Deciders** | michelkerkmeester (final), `/spec_kit:deep-research:auto` 9-iter loop (converged at 0.06 < 0.10), cli-copilot gpt-5.5 cross-validation |
| **Synthesis source** | `research/research.md` (40.9 KB, 17 sections) |

---

<!-- ANCHOR:adr-001-context -->
### Context

The current spec-kit template system encodes documentation shape as Level 1/2/3/3+ + phase-parent. That looks simple at the command surface but the implementation spreads level meaning across template folders, shell validators, TypeScript validation, README documentation, generated metadata, and phase-parent special cases. 86 source files / ~13K LOC. The level scalar conflates two independent concerns: (a) which doc files a packet needs, (b) which sections within those docs apply. Addon docs (handover.md, debug-delegation.md, research.md, resource-map.md, context-index.md) are scaffolded as starter templates today, but several are written exclusively by automation (handover by /memory:save, research by /spec_kit:deep-research, debug-delegation by @debug agent). Scaffolding them creates stale empty stubs.

### Constraints

- Greenfield — backward-compat with 868 existing folders is OUT OF SCOPE (they're immutable git history; provenance markers are descriptive comments)
- Memory parsers + deep-research reducer + resume ladder must keep working (parser-contract probe iter 1 documented exact requirements)
- ANCHOR + frontmatter conventions preserved (memory parsers depend on them)
- Phase-parent semantics preserved (lean-trio detection)
- Authoring ergonomics: maintainers edit markdown templates, not code/JSON
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: **C+F hybrid manifest-driven greenfield**. 86 → 15 source files. Levels eliminated. Lazy command-owned addons. Single manifest drives scaffolder + validator. Inline-gate sections.

**How it works**: 
- **Three orthogonal axes** replace the level scalar: `kind` (mutually exclusive: implementation/investigation/documentation/phase-parent) + `capabilities` (additive: qa-verification/architecture-decisions/governance-expansion/...) + `presets` (UX shorthand: simple-change/validated-change/arch-change/governed-change/phase-parent/investigation).
- **Lifecycle ownership per addon doc**: each doc declares `owner` (author/command/agent/workflow), `creationTrigger` (scaffold/`/memory:save`/`@debug`/`/spec_kit:deep-research`), `absenceBehavior` (hard-error/warn/silent-skip).
- **Inline section gates** (`<!-- IF capability:architecture-decisions -->...<!-- /IF -->`) preserve whole-document markdown authoring while letting validators compare post-gate active sections. Formal EBNF grammar in research.md §7.
- **Single manifest** (`templates/manifest/spec-kit-docs.json`, ~80-150 lines) drives scaffolder (`create.sh` + `template-utils.sh::scaffold_from_manifest`) AND validator (`check-files.sh`, `check-sections.sh`, `check-template-headers.sh`, `check-section-counts.sh`) AND TS validation (`mcp_server/lib/templates/manifest-loader.ts`). Drift becomes structurally impossible.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Design F (minimal scaffold + all addons lazy) | Smallest source surface | Conflates all addon lifecycles; can't reproduce level matrix with capabilities | 16/35 |
| **Design C+F hybrid (CHOSEN)** | Capabilities replace levels cleanly; addon lifecycle ownership explicit; single manifest drives both scaffold + validator; inline gates preserve markdown-authoring | Requires inline-gate renderer + manifest-loader infrastructure | **Winner** |
| Design B (single manifest + full-doc templates) | Simplest mental model | Scaffolds command-owned docs as stale starters; violates lifecycle table | 24/35 |
| Design D (section-fragment library + composer) | Maximum reuse | Second source-of-truth (manifest + filesystem); weaker markdown-editing ergonomics | 26/35 |
| Design G (schema-first, TS data → markdown) | Cleanest typed contracts | Violates markdown-authoring requirement; moves authoring to code | 31/35 |

**Why C+F hybrid**: It's the only design that admits the docs aren't all the same kind of thing — author docs get scaffolded, command/agent/workflow-owned docs stay lazy. It eliminates the level taxonomy without losing validator power (capability flags reproduce today's level matrix totally + minimally). Single manifest closes the scaffold/validator drift loophole. Inline gates keep markdown editing direct without forcing fragment-file indirection.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- 86 source files → 15 (5.7× reduction). Concrete deletions: 4 `level_N/` dirs, `addendum/` tree, build-time-composed level outputs, redundant README helpers
- Level concept eliminated as source of truth. Capability flags express intent directly
- Addon lifecycle ownership explicit. No more stale `handover.md`/`research.md`/`debug-delegation.md` empty stubs in fresh packets
- Single manifest = single source of truth. Scaffolder and validator structurally cannot drift
- Adding a new capability = edit manifest + add 1 template file (NFR-M01 satisfied)
- New section in arch packets = 1 inline gate edit in `spec.md.tmpl`. No multi-file synchronization

**What it costs**:
- Inline-gate renderer (small TS module ~100 LOC). Mitigation: simple EBNF, well-tested grammar
- Manifest-loader infrastructure (TS + shell wrapper). Mitigation: ~200 LOC total, behind a clean API
- Initial migration touches all major scaffold/validator files at once. Mitigation: phased implementation in follow-on packet (Phase 1 = manifest + loader; Phase 2 = scaffolder; Phase 3 = validators; Phase 4 = delete legacy)

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Inline-gate renderer bug strips wrong sections | H | EBNF formalized iter 6; golden tests at scaffold time (5 preset snapshots from iter 4) |
| Single-manifest drift between TS and shell consumers | M | Both load via same canonical loader (manifest-loader.ts + shell sources its compiled JS); CI test asserts both produce identical scaffold output |
| Phase-parent + capabilities edge case | L | Iter 6 mitigation: `kind=phase-parent` ignores capabilities (warn, don't error); decision-record.md if needed lives in children |
| Capability removal cleanup (orphan files) | M | Iter 6 mitigation: validator warns on orphan files declaring removed capability; auto-archive opt-in |
| Manifest version evolution | M | Iter 6 5-row scenario table: ADR-003 says greenfield requires exact `manifestVersion` match until first real migration |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Level taxonomy demonstrably fails: conflates 2 concerns, can't express addon lifecycle, requires hardcoded matrix in N validators. Iter 1 + 2 found the actual constraints. |
| 2 | **Beyond Local Maxima?** | PASS | 5 candidate designs scored on 7-criterion rubric (iter 3); 4 rejected with explicit reasoning. Cross-validated by independent cli-copilot gpt-5.5 analysis. |
| 3 | **Sufficient?** | PASS | Iter 8 dry-ran 3 preset shapes through full pipeline end-to-end; broken steps flagged + fixed; no design hole remains. |
| 4 | **Fits Goal?** | PASS | Aligned with parent 026 theme (graph + context optimization); reduces source surface 5.7×; eliminates a major drift surface. |
| 5 | **Open Horizons?** | PASS | Capability model extensible (add new capability = manifest edit + 1 template); presets versioned; manifest evolution policy defined (iter 6). |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes** (full diffs in `research/iterations/iteration-007.md` with real line numbers):
- ADD: `templates/manifest/spec-kit-docs.json` — single manifest with kinds/capabilities/presets
- ADD: `templates/manifest/{spec,plan,tasks,implementation-summary,checklist,decision-record,phase-parent.spec,resource-map,context-index,handover,debug-delegation,research}.md.tmpl` — 12 markdown templates with inline gates
- ADD: `mcp_server/lib/templates/manifest-loader.ts` — TS loader (loads manifest, exposes resolveTemplate, getRequiredDocs, etc.)
- ADD: `scripts/lib/template-utils.sh::scaffold_from_manifest()` — shell wrapper sourcing the loader's compiled JS
- ADD: `scripts/templates/inline-gate-renderer.ts` — strips ungated sections per EBNF
- MODIFY: `scripts/spec/create.sh` — replace `--level N` switch with `--preset X` resolution via manifest (~30-line diff)
- MODIFY: `scripts/rules/check-files.sh` — replace level→files matrix with manifest read (~20-line diff)
- MODIFY: `scripts/rules/check-sections.sh`, `check-template-headers.sh`, `check-section-counts.sh` — read addsSectionProfiles from manifest, render gates before assertions
- DELETE: `templates/{level_1,level_2,level_3,level_3+,addendum,phase_parent}/` — entire trees go away
- DELETE: `templates/scripts/templates/compose.sh` — composer obsolete (manifest-driven, no build step)

**How to roll back**: `git revert <impl-commit-hash>` — single commit restores all deleted dirs + reverts modified files. No data migration to undo (filesystem only).

**Phasing** (lives in follow-on packet's plan.md):
- Phase 1: ADD manifest + loader + renderer + 12 templates (additive, nothing breaks yet)
- Phase 2: MODIFY create.sh to consume manifest (old --level N flag aliased to --preset X)
- Phase 3: MODIFY validators to consume manifest
- Phase 4: DELETE legacy template dirs + composer
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Manifest version policy — exact match for greenfield

**Status**: Accepted (2026-05-01)

**Context**: Iter 8 flagged: should manifest validation support older `manifestVersion` values via adapters, or require exact match?

**Decision**: **Greenfield requires exact `manifestVersion` match.** Any packet whose declared `manifestVersion` doesn't match the current `spec-kit-docs.json` version is rejected with a clear "version mismatch — re-scaffold or migrate" error. Adapter machinery is deferred until the FIRST real migration scenario exists. YAGNI applies.

**Consequences**: Simpler implementation. No speculative adapter code. When a real migration happens, design the adapter then with full knowledge of what changed.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Template-contract frontmatter location — spec.md only

**Status**: Accepted (2026-05-01)

**Context**: Iter 8 flagged: should EVERY authored doc carry the template-contract frontmatter, or only `spec.md`?

**Decision**: **Only `spec.md` carries the template-contract block.** Every other authored doc inherits context from spec.md (resume ladder reads spec.md as fallback per iter 1). Duplicating the contract block in plan/tasks/checklist/decision-record/impl-summary creates 5× the drift surface for zero gain.

**Consequences**: Cleaner continuity surface. spec.md is the canonical packet identity. Other docs stay focused on their content.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Phase-parent scaffolding — parent only, children added separately

**Status**: Accepted (2026-05-01)

**Context**: Iter 8 flagged: should `--preset phase-parent` also create child phase definitions, or only the parent?

**Decision**: **Parent only.** Child phases are created via subsequent `create.sh --subfolder <parent>` invocations. This keeps the `phase-parent` preset minimal and matches today's UX (separate command for phase creation).

**Consequences**: User explicitly creates children. Parent is created once; children are added incrementally as the work decomposes. Matches existing mental model.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Workflow-invariant — `Level 1/2/3/3+` is the SOLE public/AI-facing vocabulary

**Status**: Accepted (2026-05-01)

### Context

User constraint surfaced post-convergence (iter 9): the actual workflow is **AI-driven, not user-driven**. The user talks to the AI (or invokes a slash command). The AI runs Gate 3 classification, asks spec-folder questions, picks a level from conversation context, invokes `create.sh` under the hood, authors docs from conversation. The user NEVER sees `--level N`, `--preset X`, capability names, or any vocabulary from this packet's design. The constraint: **AI behavior + user conversation flow must remain byte-identical to today.** If implementing the C+F hybrid design forces a single change to AI behavior, conversation text, validator output, or Gate 3 classifier behavior, the design is wrong.

5 iterations (10-14) re-evaluated the converged design under this constraint. **The design survives** with explicit mitigations.

### Decision

**`Level 1/2/3/3+ + phase-parent` is the SOLE vocabulary on every public/AI-facing surface.** The internal manifest taxonomy (`kind`, `capabilities`, `presets`) is STRICTLY private. Specifically:

**MUST keep level vocabulary on:**
- `--level N` flag in `create.sh` (the public CLI flag)
- `<!-- SPECKIT_LEVEL: N -->` markers in every authored doc
- `level: N` frontmatter field in every authored doc
- Validator error messages ("Level 3 packet missing required file: decision-record.md")
- Scaffolder log lines ("scaffolding Level 3 spec folder")
- `description.json` and `graph-metadata.json` `level` fields
- AI-facing skill text (CLAUDE.md, AGENTS.md, SKILL.md, command markdown, agent markdown)
- Generated doc placeholder text — fix the 2 leaks identified iter 12 (`[capability]` → `[applicable]`; "Sub-phase manifest" → "Sub-phase list")

**MUST NOT mention** `preset`, `capability`, `kind`, or `manifest` on any of those surfaces.

**MAY use** preset/capability/kind vocabulary ONLY in:
- `templates/manifest/spec-kit-docs.json` (the private manifest)
- `mcp_server/lib/templates/level-contract-resolver.ts` (the resolver implementation)
- `scripts/lib/template-utils.sh::resolve_level_contract` (shell wrapper)
- Developer/maintainer docs explaining the internal architecture (not user-facing)
- This decision-record.md (because it documents the internal design)

### Internal API: `resolveLevelContract(level)`

```typescript
// File: mcp_server/lib/templates/level-contract-resolver.ts (new, PRIVATE)
function resolveLevelContract(
  level: '1' | '2' | '3' | '3+' | 'phase'
): LevelContract;

interface LevelContract {
  requiredCoreDocs: string[];      // e.g., ['spec.md', 'plan.md', 'tasks.md', 'impl-summary.md']
  requiredAddonDocs: string[];     // e.g., ['decision-record.md'] for Level 3
  lazyAddonDocs: string[];         // e.g., ['handover.md', 'debug-delegation.md', 'research.md']
  sectionGates: Map<string, string[]>;  // section-id → levels where it appears
  frontmatterMarkerLevel: number;
}
```

Caller hands in a level number; gets back a contract. Caller never sees the words `preset`, `capability`, or `kind`. Internal implementation queries `spec-kit-docs.json` to derive the contract.

Shell wrapper: `bash get_template_path <level>`, `bash resolve_level_contract <level>` returning JSON via stdout.

### Drop `--preset` from public CLI

The internal preset/capability/kind decomposition exists for maintainer convenience inside `spec-kit-docs.json` ONLY. The public `create.sh --help` lists ONLY `--level N`. No `--preset X` flag exposed to users or AI.

### Workflow-invariance CI test

Add `scripts/tests/workflow-invariance.vitest.ts` to Phase 1. Test scope:
- Grep every public surface (CLI help text, log lines, validator error messages, generated doc content, AI-facing markdown) for banned vocabulary: `\b(preset|capabilit(y|ies)|\bkind\b|manifest)\b` (case-insensitive, word-boundary)
- Fail the build if any banned token appears
- Allowlist: developer/maintainer docs (decision-record, research.md, ADR text)
- Single test (decided iter 13)

Existing fixtures under `scripts/tests/fixtures/` are rewritten as part of Phase 1 (decided iter 13).

### Consequences

**What improves**:
- Zero new vocabulary for users/AI to learn
- Conversation flow byte-identical to today
- AI prompts/skills unchanged
- Gate 3 classifier behavior unchanged
- 868 existing folders' `<!-- SPECKIT_LEVEL: N -->` markers + `level: N` frontmatter remain semantically valid
- `--level 3` keeps working forever as the canonical public flag

**What it costs**:
- Maintainers learn TWO vocabularies — public (level) + private (preset/capability/kind). Mitigation: developer docs explain the mapping; CI test catches accidental leakage.
- `spec-kit-docs.json` cannot be casually shown to users. Mitigation: it's a system file users never need to look at.

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Maintainer adds preset/capability vocabulary to a public surface during a refactor | M | Workflow-invariance CI test fails the build |
| Future feature requires user to declare a capability directly | L | Add a level (e.g., Level 4) instead, OR re-evaluate the constraint at that point |
| Internal vocabulary leaks via error messages from `resolveLevelContract` itself | L | Wrap caller with try/catch that translates internal errors to "Level N packet failed contract validation: ..." |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | User explicitly requested it 2026-05-01; all-AI-driven workflow = users must NEVER see new vocab |
| 2 | **Beyond Local Maxima?** | PASS | Iters 10-13 audited 11 surfaces + 5 conversation scenarios; alternative (expose presets to users) explicitly rejected |
| 3 | **Sufficient?** | PASS | Iter 13 dry-run confirmed all 5 conversation scenarios pass workflow-invariance under this ADR |
| 4 | **Fits Goal?** | PASS | Aligns with C+F hybrid (ADR-001) — adds the public/private boundary that ADR-001 implied but didn't formalize |
| 5 | **Open Horizons?** | PASS | If future requirements need new capabilities, they're added to manifest internally; level taxonomy can evolve to Level 4 if needed without breaking the boundary |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes** (in addition to ADR-001/002/003/004 implementation):
- ADD: `scripts/tests/workflow-invariance.vitest.ts` (CI test, ~50 LOC)
- ADD: `mcp_server/lib/templates/level-contract-resolver.ts` (the API above; replaces vague iter-7 "manifest-loader.ts" naming)
- MODIFY: `create.sh --help` text — remove any reference to `--preset` (was never user-exposed in iter-7 diffs but lock it in)
- MODIFY: validator error messages — confirm level vocabulary across `check-files.sh`, `check-sections.sh`, `check-template-headers.sh`, `check-section-counts.sh` (iter-12 audit found these already say "Level N")
- FIX 2 leaks: replace `[capability]` placeholder text in level_3/level_3+ generated docs; replace "Sub-phase manifest" wording in phase-parent generated spec.md

**How to roll back**: `git revert <impl-commit>`. The workflow-invariance test belongs in the same commit; reverting removes both the test and the leak fixes atomically.
<!-- /ANCHOR:adr-005 -->

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
