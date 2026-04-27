---
title: "Implementation Plan: Memory→Behavioral Phrasing Audit [system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/plan]"
description: "Sequenced PR plan for modernizing operator-facing 'memory' phrasing to concrete behavioral language across docs, MCP tool descriptions, and runtime output strings — without renaming any frozen identifier (REQ-001). Dispatched as 5 primary PRs (PR1-PR5) plus 4 corrective follow-on PRs surfaced by deep-review and operator feedback."
trigger_phrases:
  - "phrasing audit plan"
  - "PR sequence memory terminology"
  - "REQ-001 scope freeze"
  - "spec-doc record vocabulary plan"
  - "deep-review remediation plan"
  - "Q4 setup-prompt plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology"
    last_updated_at: "2026-04-27T11:40:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Retroactively created Level 3 plan.md after PR1-PR5 + 4 follow-on PRs shipped"
    next_safe_action: "Cross-reference plan.md against tasks.md and implementation-summary.md once those land"
    blockers: []
    key_files:
      - "spec.md"
      - "phrasing-audit.md"
      - "review/review-report.md"
---

# Implementation Plan: Memory→Behavioral Phrasing Audit

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

A docs-only phrasing audit that replaces abstract operator-facing "memory" / "memories" nouns with concrete behavioral language ("spec-doc record", "indexed continuity", "constitutional rule", "packet", "causal-graph node") across `.opencode/skill/system-spec-kit/` plus runtime mirrors in `.claude/`, `.gemini/`, `.codex/`, while preserving all frozen identifiers (21 `memory_*` MCP tools, 4 `/memory:*` slash commands, `_memory:` frontmatter, `memory_*` SQL tables, 17 `memory-*.ts` handler filenames, `references/memory/` + `scripts/dist/memory/` folders, all `MEMORY_*` constants, and cognitive-science loanwords FSRS / Miller / Collins-Loftus).

### Approach

9 PRs landed sequentially:
- **PR1-PR5** (initial wave): five surface classes touched in parallel agent dispatch
- **PR3-extra** (corrective): cross-runtime mirror gap closure surfaced by user audit
- **REQ-004 bulk-substitution** (post-iter-1): 396 substitutions across 148 files
- **REQ-008 anchor-fix** (post-iter-3): 154 README/TOC files corrected from `#N--anchor` to `#N-anchor` GitHub style
- **Q4 setup-prompt** (post-deep-review, surfaced by operator running /spec_kit:plan): 23 edits across 8 command files
- **gate-tool-routing indexing** (post-skill-graph-rebuild): 6 ANCHOR markers + Code References table
- **/memory:search empty-results template** (operator-surfaced): canonical fallback prescribing "Trigger-matched spec-doc records"
- **skill_id alignment** (post-skill-graph-scan): hyphen→underscore fix in 2 graph-metadata.json files

<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

The 8 spec.md REQs serve as quality gates. iter-5 closure (PASS hasAdvisories=true) verified all 8 PASS. See checklist.md for the full P0/P1/P2 ledger.

<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Pure documentation work — no architectural change. The phrasing audit is structurally a search-and-replace operation across markdown + TypeScript description strings, layered with cross-runtime mirror-parity discipline. The "architecture" element is the freeze list (REQ-001) which encodes a contract between docs and runtime.

<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1 — Initial Surface Wave (PR1-PR5)

| PR | Surface | Files | Risk |
|---|---|---|---|
| PR1 | Top-level skill prose | SKILL.md, README.md, config/README.md, references/{memory,debugging,validation}/, constitutional/README.md | Low — pure prose |
| PR2 | Feature catalog + manual testing playbook | feature_catalog.md (parent + 4 sister mirrors), MANUAL_TESTING_PLAYBOOK.md | Medium — dense prose, mirror parity |
| PR3 | Slash commands + agent definitions | .opencode/command/memory/{save,search,learn,manage}.md, .opencode/agent/context.md, .claude/agents/context.md | Medium — 4 frozen `/memory:*` commands referenced inline |
| PR4 | MCP schema descriptions | mcp_server/tool-schemas.ts (38 edits across 17 tools) | Medium — vitest snapshot risk |
| PR5 | Cognitive subsystem JSDoc | mcp_server/lib/cognitive/{fsrs-scheduler,prediction-error-gate,temporal-contiguity,adaptive-ranking}.ts | High — literature loanwords MUST survive (FSRS / Miller / Collins-Loftus / spreading activation) |

### Phase 2 — Corrective Wave (PR3-extra)

User audit revealed gaps in cross-runtime mirrors:
- `.gemini/agents/context.md` — never received any PR3 edits
- `.codex/agents/context.toml` — never on the original scope list
- `.gemini/commands/memory/*.toml` — out-of-sync with `.opencode/command/memory/*.md`
- Display labels in `/memory:search` and `/memory:manage` (`Memory #<id>`, `Loaded N memories`) survived because they didn't match the headline-pattern grep

Fix: 6 vocabulary edits per file × 4 files + .gemini toml regeneration + display label sweep.

### Phase 3 — Deep-Review Loop (5 cli-copilot iterations)

Iter 1 (correctness) → P1-001 (REQ-004 grep returns 13 hits) + P1-002 (REQ-005 Note: callout missing from 2 READMEs)
Iter 2 (security) → PASS, both P1s closed by orchestrator
Iter 3 (traceability) → P1-003 (README TOC double-hyphen anchors broken) + P2-001 (substitution polish drift)
Iter 4 (maintainability) → P0-004 (P2-001 incomplete closure) + P2-002 (advisory)
Iter 5 (closure) → PASS with `hasAdvisories=true`

Final verdict: PASS, releaseReadinessState=ready.

### Phase 4 — Post-Convergence Operator Surfaces

Three additional gaps surfaced after the initial 5 commits landed:
1. `/memory:search` empty-results case (assistant invented "Auto-triggered memories" when search returned 0 + triggers > 0)
2. `gate-tool-routing.md` constitutional rule rejected by `memory_index_scan` (template-contract sufficiency gate)
3. `Q4. Memory Context` setup-prompt label across `/spec_kit:{plan,complete,implement}`, `/create:{sk-skill,feature-catalog}`, plus retired `memory/` folder references in setup-step descriptions

Fixed in commits `f44b6a870`, `83ba5cd86`, `12622debb` respectively.

### Phase 5 — Index + Graph Optimization

User-requested maintenance pass after all docs converged:
- `memory_index_scan({incremental: true})` — 820 → 2574 records (+1753 catch-up indexing)
- `code_graph_scan` — 1472 files / 33,338 nodes / 17,242 edges, fresh
- `skill_graph_scan` — 22 nodes / 79 edges, validated (after fixing skill_id mismatch)
- `memory_causal_stats` — 2509 edges, 86.09% coverage (target 60%, exceeded)
- `memory_health` — healthy, 0 alias conflicts, embedding provider responsive

<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Verification ran via the deep-review loop (5 iterations, cli-copilot/gpt-5.5/high) plus 6 grep checks post-Q4 modernization plus live `/spec_kit:plan` invocation. No vitest tests were touched (REQ-006 contract: runtime output strings preserved verbatim with operator-doc parenthetical citations).

<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

### Frozen Identifier Contract (REQ-001)

The plan's correctness hinges on NEVER renaming:
- 21 `memory_*` MCP tool names (defined in `mcp_server/tool-schemas.ts`)
- 4 `/memory:*` slash command directories (`.opencode/command/memory/`)
- `_memory:` frontmatter key (across 1950+ spec docs)
- All `memory_*` SQL tables incl. `working_memory` (cognitive subsystem)
- 17 `memory-*.ts` handler filenames in `mcp_server/handlers/`
- Folder names `references/memory/`, `scripts/dist/memory/`
- All `MEMORY_*` constants
- Cognitive-science loanwords: `FSRS_*`, `Free Spaced Repetition Scheduler`, `Miller`, `working_memory`, `Collins-Loftus`, `spreading activation`

Any rename = automatic P0 finding in deep-review.

### External Reference Files

- `phrasing-audit.md` — vocabulary key + hard no-touch list + grid (sibling to spec.md)
- `references/intake-contract.md §5` — already-modern positive example (Q4+. Relationship Entries)
- `.opencode/command/spec_kit/resume.md:112` — already-modern positive example (Q4. Recovery Depth)
- `commit 053fa931b` (026.013 v3.4.1.0 cutover) — retired the per-packet `memory/` write path that several setup prompts still referenced

### Build Order

PR1 → PR2 → PR3 → PR4 → PR5 (parallel-safe, dispatched as 5 agents simultaneously). Phase 2 corrective wave depends on Phase 1 output. Phase 3 deep-review depends on Phase 1+2 land. Phase 4 follow-ons depend on Phase 3 convergence. Phase 5 indexing depends on all prior phases.

<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All 6 ship commits are linear on main. Rollback would be `git revert e6226da7d..12622debb` (or per-commit selective revert). No DB migrations, no schema changes — pure docs + JSON metadata fixes. Risk of rollback: low; the freeze list (REQ-001) means rollback restores legacy phrasing without breaking any runtime caller.

<!-- /ANCHOR:rollback -->

<!-- ANCHOR:l3-architecture-decision-record -->
### L3: Architecture Decision Record (Reference)

See `decision-record.md` for the full 7-ADR ledger. Each ADR captures a real choice point during the work with rationale and rejected alternatives.

<!-- /ANCHOR:l3-architecture-decision-record -->

<!-- ANCHOR:risks -->
### Risks (Reference)

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Accidental rename of frozen `memory_*` identifier | Low | P0 — runtime breaks | spec.md REQ-001 + deep-review iter-1 identifier audit |
| Cognitive loanword substitution (FSRS / Miller / Collins-Loftus) | Low | P0 — algorithm citations broken | spec.md REQ-007 + iter-1 cognitive carve-out validation |
| vitest snapshot test breakage from runtime output string drift | Medium | P1 — CI failure | spec.md REQ-006 + manual-fallback for runtime emissions; preserve via "(runtime string preserved verbatim)" parenthetical |
| Cross-runtime mirror divergence | Medium | P1 — operator confusion | Phase 2 corrective wave + iter-2 cross_runtime_audit |
| Bulk substitution false positives (TypeScript class names, frozen identifiers) | High | P2 — polish drift | targeted residual sweeps + iter-4 P2-001/P2-002 cleanup |
| Anchor integrity (TOC double-hyphen vs single-hyphen) | Medium | P1 — REQ-008 fail | iter-3 P1-003 + 154 README TOC fixes |
| Operator-facing setup prompts missed by bulk regex | Low (surfaced) | P2 — workflow confusion | This phase's Q4 setup-prompt fix |

<!-- /ANCHOR:risks -->

<!-- ANCHOR:success-criteria -->
### Success Criteria (Reference — derived from spec.md REQs)

All 8 spec.md acceptance criteria PASS:

- **REQ-001** zero identifier renames — VERIFIED (21 tools, 17 handlers, 4 commands, `_memory:`, SQL tables, folder names intact)
- **REQ-002** vocabulary substitutions accurate — VERIFIED (concrete behavioral language in MCP tool descriptions and operator-facing prose)
- **REQ-003** skill prose modernized — VERIFIED (SKILL.md, README.md, references/, constitutional/ all use modernized vocabulary)
- **REQ-004** REQ-004 grep zero-out — VERIFIED (0 hits across `.opencode/skill/system-spec-kit/**/*.md` + CLAUDE.md + AGENTS.md)
- **REQ-005** Anthropic/MCP `Note:` callout — VERIFIED (both READMEs carry the disambiguation paragraph)
- **REQ-006** mirror parity — VERIFIED (4 context agents + 12 commands all in parity)
- **REQ-007** cognitive carve-out preserved — VERIFIED (FSRS, Miller, Collins-Loftus, working_memory, spreading activation all preserved)
- **REQ-008** no broken anchors/links — VERIFIED (TOC anchors fixed across 154 README files; same-file anchor scan returns 0 broken links in `.md` scope)

Plus operator-feedback closures:
- `/memory:search` empty-results fallback template added (Step 4b)
- `gate-tool-routing.md` indexed (id 2574, qualityScore 1.0)
- `Q4. Memory Context` → `Q4. Prior Work Context` across 8 command files

<!-- /ANCHOR:success-criteria -->
