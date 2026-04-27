---
title: "QA Checklist: Memory→Behavioral Phrasing Audit [system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/checklist]"
description: "QA validation checklist for the phrasing-audit packet. All P0/P1 items verified post-flight; deep-review-supplied evidence cited per row."
trigger_phrases:
  - "phrasing audit checklist"
  - "REQ-001 verification"
  - "REQ-004 grep zero out"
  - "REQ-007 cognitive carveout"
  - "REQ-008 anchor integrity"
  - "deep-review P0 P1 closure"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology"
    last_updated_at: "2026-04-27T11:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Restructured checklist.md to match v2.2 template section headers (Verification Protocol, Pre-Implementation, Code Quality, Testing, Security, Documentation, File Organization, Verification Summary)"
    next_safe_action: "Validate via scripts/spec/validate.sh --strict"
    blockers: []
    key_files:
      - "review/review-report.md"
      - "review/deep-review-state.jsonl"
---

# Verification Checklist: Memory→Behavioral Phrasing Audit

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

> **Note:** All items verified post-flight against the deep-review-state.jsonl iter-5 closure record (verdict PASS, releaseReadinessState=ready) and the review-report.md synthesis. Evidence cited per row.

---

<!-- ANCHOR:verification-protocol -->

## Verification Protocol

P0 = blockers (must pass before ship). P1 = required. P2 = advisory (non-blocking). All P0/P1 items verified via the deep-review loop (5 iterations, cli-copilot/gpt-5.5/high) with claim adjudication, plus operator-surfaced fixes for follow-on gaps. P2-2 deferred per ADR-007.

<!-- /ANCHOR:verification-protocol -->

<!-- ANCHOR:pre-implementation -->

## Pre-Implementation

Freeze list (REQ-001) — these identifiers must NOT be renamed:

- [x] 21 `memory_*` MCP tool names enumerated and frozen — Evidence: `mcp_server/tool-schemas.ts`
- [x] 4 `/memory:*` slash command directories enumerated — Evidence: `.opencode/command/memory/`
- [x] `_memory:` frontmatter key locked across 1950+ files
- [x] `memory_*` SQL tables incl. `working_memory` listed
- [x] 17 `memory-*.ts` handler filenames enumerated in `mcp_server/handlers/`
- [x] Folder paths `references/memory/`, `scripts/dist/memory/` listed
- [x] All `MEMORY_*` constants enumerated
- [x] Cognitive loanwords listed (FSRS, Free Spaced Repetition Scheduler, Miller, Collins-Loftus, spreading activation, working_memory)

<!-- /ANCHOR:pre-implementation -->

<!-- ANCHOR:code-quality -->

## Code Quality

P0 — Identifier preservation (REQ-001):

- [x] **P0-1** Zero identifier renames across the freeze list
  - **Evidence:** iter-1 identifier audit + iter-3 spec_code traceability
  - 21 `memory_*` MCP tools intact in `mcp_server/tool-schemas.ts`
  - 17 `memory-*.ts` handler filenames in `mcp_server/handlers/`
  - 4 `/memory:*` slash command directories present in `.opencode/command/memory/`
  - 1950+ files retain `_memory:` frontmatter
  - SQL tables `memory_*` (incl. `working_memory`) preserved in `mcp_server/lib/storage/`
  - Folder paths `references/memory/`, `scripts/dist/memory/` preserved
  - `MEMORY_*` constants intact

- [x] **P0-2** Cognitive-science loanwords preserved verbatim (REQ-007)
  - **Evidence:** iter-1 cognitive carve-out validation
  - `FSRS` + `Free Spaced Repetition Scheduler` in `fsrs-scheduler.ts:5-11` (33 occurrences)
  - Miller's Law in `mcp_server/lib/cognitive/working-memory.ts:29`
  - `working_memory` SQL identifier preserved in `working-memory.ts:46`
  - `Collins-Loftus`, `spreading activation` preserved in `temporal-contiguity.ts`

- [x] **P0-3** No P0 deep-review findings remain open
  - **Evidence:** review-report.md §3 Active Finding Registry — P0: 0 active
  - P0-004 (P2-001 closure regression) closed in iter-5

<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->

## Testing

P0 — Runtime safety (REQ-006):

- [x] **P0-4** Runtime output strings don't break vitest snapshot tests
  - **Evidence:** iter-2 runtime_output_string_audit
  - `causal-graph.ts:586-587` `'Memory ID that is the cause/source'` preserved verbatim
  - Operator docs cite these via `(runtime string preserved verbatim)` parenthetical
  - No non-causal-graph handler emits modernized 'Memory' strings

P1 — Cross-runtime mirror parity (REQ-006):

- [x] **P1-3** Cross-runtime mirror parity verified
  - **Evidence:** iter-2 + iter-3 agent_cross_runtime + command_cross_runtime checks
  - 4 context agents (.opencode/.claude/.gemini/.codex) all have spec-doc-record=5, Record-#[ID]=2, strict-legacy=0
  - .opencode/command/memory/{save,manage}.md md5-identical to .claude mirrors (symlink-synced)
  - .gemini/commands/memory/*.toml `spec-doc record` counts ≥ corresponding .md counts (regenerated)

P1 — Anchor + cross-doc link integrity (REQ-008):

- [x] **P1-4** No broken anchors/links
  - **Evidence:** iter-3 P1-003 closure
  - 154 README/TOC files corrected from `#N--anchor` to `#N-anchor` (single-hyphen GitHub-style)
  - Same-file anchor scan in `.md` scope returns 0 broken links
  - Recursive grep returns 0 (modulo binary SQLite false positives)

<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->

## Security

No security-relevant changes (docs-only audit). REQ-001 freeze contract ensures no auth, permission, or data-exposure boundary moved.

- [x] No new auth surfaces introduced
- [x] No permission boundaries changed
- [x] No data-exposure paths modified
- [x] All edits are operator-facing prose; no code paths altered

<!-- /ANCHOR:security -->

<!-- ANCHOR:documentation -->

## Documentation

P1 — Vocabulary modernization (REQ-002 / REQ-003 / REQ-004 / REQ-005 / REQ-007):

- [x] **P1-1** REQ-004 grep zero-out across `.md` scope
  - **Evidence:** iter-5 closure verification + post-iter-1 bulk substitution wave
  - `grep -niE "(your|the|a|an|each|every)\s+memor(y|ies)" .opencode/skill/system-spec-kit/**/*.md CLAUDE.md AGENTS.md` returns 0 hits outside cognitive/

- [x] **P1-2** REQ-005 Anthropic/MCP `Note:` callout in both READMEs
  - **Evidence:** iter-2 verification + iter-3 traceability
  - `.opencode/skill/system-spec-kit/README.md:58` begins `Note:` and names both Anthropic Claude Memory and MCP reference `memory` server
  - `.opencode/skill/system-spec-kit/mcp_server/README.md:53` same

- [x] **P1-5** /memory:search empty-results fallback template
  - **Evidence:** commit `f44b6a870`
  - Step 4b added to `.opencode/command/memory/search.md` prescribing `Trigger-matched spec-doc records` and `Constitutional rules` labels
  - Explicitly forbids ad-hoc labels (`Auto-triggered memories`, `Triggered memories`, `Memories`)

- [x] **P1-6** Q4 setup-prompt label modernization (operator-surfaced gap)
  - **Evidence:** commit `12622debb`
  - `Q4. Memory Context` → `Q4. Prior Work Context` across `spec_kit/{plan,complete,implement}.md`, `create/{sk-skill,feature-catalog}.md`
  - Stale per-packet `memory/` folder references replaced with concrete canonical doc names
  - Resume.md Q2 prose modernized

- [x] **P1-7** gate-tool-routing.md indexed as constitutional rule
  - **Evidence:** commit `83ba5cd86` + memory_save dryRun + actual save
  - File now has 6 ANCHOR markers + Code References table
  - Indexed as id 2574, qualityScore 1.0, embedding success
  - Manual-fallback save mode satisfied (3+ support evidence items + ≥1 anchor)

<!-- /ANCHOR:documentation -->

<!-- ANCHOR:file-organization -->

## File Organization

- [x] Spec packet contains all required Level 3 docs: spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, description.json, graph-metadata.json
- [x] Deep-review packet at `review/` contains: review-report.md + 5 iteration narratives + 5 delta files + state log + findings registry + strategy + dashboard
- [x] research_archive/ retains the pre-pivot rename-shaped 10-iteration deep research for audit
- [x] phrasing-audit.md sibling holds the vocabulary key + grid

<!-- /ANCHOR:file-organization -->

<!-- ANCHOR:verification-summary -->

## Verification Summary

P2 — Substitution polish drift (advisory, non-blocking):

- [x] **P2-1** Substitution polish drift cleanup
  - **Evidence:** iter-3 P2-001 closure + iter-4 P0-004 closure
  - 144 adjective-prefixed substitutions across 57 files (existing/new/older/old/similar/stored/aligned/...)
  - 2 `spec-doc record record` duplicates removed

- [ ] **P2-2** Local mixed-vocabulary polish in 2 catalog entries (DEFERRED per ADR-007)
  - **Evidence:** review-report.md §3 P2 active findings
  - `feature_catalog/02--mutation/03-single-and-folder-delete-memorydelete.md:24` mixes `spec-doc record` with `single-memory`, `bulk folder`, `all memories in the folder`
  - `mcp_server/tool-schemas.ts:222` description blends modernized + legacy nouns
  - Disposition: DEFERRED — non-blocking polish for follow-on cleanup pass

| Severity | Open | Closed | Disposition |
|---|---|---|---|
| P0 | 0 | 4 | All resolved |
| P1 | 0 | 7 | All resolved |
| P2 | 1 | 1 | P2-2 deferred (advisory) |

**Verdict:** PASS with `hasAdvisories=true`. Release-readiness state: ready.

**Source-of-truth:** `review/review-report.md` (deep-review synthesis)

<!-- /ANCHOR:verification-summary -->
