---
title: "Iteration 001: trigger_phrases duplication across memories"
description: "Phase 6 deep-research iteration 001 — trigger_phrases duplication across memories duplication landscape and proposed remediation"
trigger_phrases:
  - "phase 6 iteration 001"
  - "trigger_phrases duplication across memories"
  - "memory duplication trigger_phrases duplication across memories"
importance_tier: important
contextType: "research"
---

# Iteration 001: trigger_phrases duplication across memories

## Question
Which trigger-phrase duplicates in the current recent memory corpus are useful discovery anchors versus low-signal noise, and which current code surfaces most likely preserve or reintroduce that duplication after Phase 1-5?

## Method
- Files sampled: 52 total. 50 most-recent `.opencode/specs/**/memory/*.md` files plus 2 files from `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/memory/`.
- Detection technique: frontmatter-only trigger extraction; exact-match counting across files and within spec-folder clusters; normalized grouping for hyphen/space/article/plural variance; title/path overlap check; targeted code inspection of trigger generation, filtering, sanitizer, and frontmatter-migration surfaces.
- Bounding rule: "discovery redundancy" means a repeated phrase still helps distinguish a continuation chain or spec-folder family; "noise dup" means the phrase is generic, path-derived, title/path-echoing, or repeated so broadly that it adds retrieval collisions without adding specificity.

## Findings
- `F001.1` Pattern: packet/path scaffold phrases repeated across sibling memories.
  Frequency: `graph and context optimization` in 8 sampled files, `tree thinning` in 8, `system spec kit` in 6, `deep research config` in 5, `deep research strategy` in 5, `kit/026` in 5.
  Examples: `graph and context optimization`, `tree thinning`, `kit/026`, `optimization/001`, `research` in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/memory/08-04-26_08-18__extended-the-005-claudest-deep-research-packet.md`; same cluster also appears in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador/memory/08-04-26_08-11__extended-the-003-contextador-deep-research-packet.md` and `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/memory/06-04-26_17-14__created-level-3-speckit-folder-002-implement.md`.
  Cause hypothesis: the workflow still injects `specFolderName` into trigger extraction source and then appends sanitized folder tokens afterward, so parent-packet identity is repeated into many sibling memories even when the title/manual phrases already carry that context.
  Severity: HIGH. This is not random duplication; it is cluster-wide retrieval noise that makes sibling memories look more alike than they are.

- `F001.2` Pattern: generic single-word survivors are present in the corpus, but the current short-token allowlist is not the main culprit.
  Frequency: `and` in 6 sampled files, `graph` in 6, `research` in 6.
  Examples: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/memory/08-04-26_08-10__extended-the-002-codesight-deep-research-packet.md` contains `graph`, `and`, `research`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/memory/07-04-26_14-55__spec-documentation-perfection-task-used-cli.md` contains `graph`, `and`, `research`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/memory/08-04-26_08-18__extended-the-005-claudest-deep-research-packet.md` contains the same set.
  Cause hypothesis: this looks more like stale or manually refined corpus data being preserved than a fresh PR-5 allowlist leak. Current sanitizer code explicitly blocks standalone `and` and `graph`, while `frontmatter-migration.ts` preserves existing memory triggers verbatim. Some of the noisiest April 8 memories also carry manual-refinement notes, which lowers confidence that every survivor came from a fresh live run.
  Severity: MEDIUM. The corpus is noisy today, but owner confidence is split between stale-data preservation and current generation paths.

- `F001.3` Pattern: title/path overlap and formatting variants create redundant near-duplicates.
  Frequency: 12 of the 52 sampled files had at least one trigger phrase that duplicated the title or path stem. Near-duplicate groups were mostly formatting variants, not real semantic variants: `codex-cli-compact` + `codex cli compact`, `tree-sitter` + `tree sitter`, `implementation-summary` + `implementation summary`.
  Examples: `.opencode/specs/system-spec-kit/024-compact-code-graph/memory/29-03-26_10-28__deep-research-evaluating-codex-cli-compact-dual.md` includes both `codex-cli-compact` and `codex cli compact`, plus both `tree-sitter` and `tree sitter`; `.opencode/specs/system-spec-kit/024-compact-code-graph/memory/01-04-26_08-14__retroactive-level-3-spec-kit-compliance-audit-and.md` includes `implementation-summary`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/memory/08-04-26_08-18__extended-the-005-claudest-deep-research-packet.md` overlaps its title/path with `research` and `claudest`.
  Cause hypothesis: current normalization deduplicates case and whitespace, but not hyphen-vs-space variants or title/path-contained aliases. For memories, `frontmatter-migration.ts` keeps existing triggers instead of re-normalizing them.
  Severity: MEDIUM. This is smaller than the packet-level scaffold repetition, but it is clean, reproducible redundancy.

- Useful redundancy observed: continuation-anchor phrases within the same spec folder are often beneficial.
  Frequency: `claude optimization settings` appears in 3 memories under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings`; `graphify research` appears in 2 memories under the `004-graphify` leaf.
  Examples: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_12-05__deep-research-run-8-iterations-via-cli-copilot.md`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/07-04-26_16-18__this-session-closed-out-the-research-only-level-3.md`.
  Cause hypothesis: these phrases preserve lineage and make continuation runs discoverable inside a dense sibling cluster.
  Severity: LOW and acceptable. This is the "discovery redundancy" bucket, not the cleanup target.

## Negative Cases
- I did not find a meaningful cluster of case-only duplicates like `Memory Save` vs `memory save`. Near-duplicate groups were dominated by hyphen/space formatting, not casing drift.
- I did not find a strong singular/plural or article-only family such as `memory save` / `memory saves` / `the memory save` in the sampled recent corpus.
- The Claude project memory store did not show an active duplication problem in scope: it had only `MEMORY.md` plus one feedback note without trigger-phrase frontmatter.
- Additional `memory/` directories discovered from repo root were mostly templates, scripts, command docs, or test fixtures, not active recent-memory stores. I excluded them from the corpus on purpose to avoid contaminating the Phase 6 baseline.

## Proposed Remediation
- For `F001.1`
  Owner file:line: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1248-1253` and `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1313-1328`
  Patch shape: code change plus one-time migration
  Risk: MEDIUM. Over-pruning parent-packet anchors could make sibling memories harder to discover if the title is weak.
  Mitigation: keep one cluster anchor only when it adds new information beyond the title/manual triggers; do not append raw folder tokens when the title/manual set already covers the same parent packet.
  Verification: replay a small fixture set from the `001-research-graph-context-systems` cluster and confirm `claude optimization settings`/`graphify research` survive while `graph and context optimization`, `kit/026`, and `optimization/001` no longer appear everywhere.

- For `F001.2`
  Owner file:line: `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:46-69`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:141-165`, and `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:966-972`
  Patch shape: one-time migration first, then targeted code/test hardening if replay still reproduces
  Risk: MEDIUM. A broader generic-word blocklist could remove genuinely useful domain terms.
  Mitigation: treat `and`/`graph`/`research` differently: `and` and `graph` should already be blocked, so first clean preserved stale triggers and add regression coverage; only consider blocking `research` if corpus replay proves it is mostly noise.
  Verification: run a bounded migration/re-sanitization against the sampled files and confirm `and`/`graph` disappear from frontmatter while short allowlisted products like `api`, `cli`, and `mcp` remain intact.

- For `F001.3`
  Owner file:line: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:131-167`, `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:83-140`, and `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:966-972`
  Patch shape: code change plus migration
  Risk: LOW to MEDIUM. Normalizing hyphen/space variants is safe; dropping title/path overlaps needs care because some leaf names are useful anchors.
  Mitigation: canonicalize hyphen and space to the same dedup key, then only drop title/path-contained phrases when another surviving phrase already carries the same leaf identity.
  Verification: confirm one canonical form survives for `codex-cli-compact`, `tree-sitter`, and `implementation-summary`, and confirm leaf identifiers like `codesight` or `claudest` are kept only once per file when they still add discovery value.

## Confidence
0.84. The duplication landscape is well-supported by frontmatter-only counts across 52 recent files, and the owner lines for folder injection and stale-trigger preservation are clear. Confidence is lower than 0.9 because some of the April 8 memories were manually refined after generation, so not every noisy survivor can be attributed with certainty to a fresh live save path.

## Convergence Signal
Actionable HIGH/MEDIUM items exist. I consider the duplication landscape converged enough for implementation planning, but a replay-focused follow-up would still help separate stale-corpus preservation from live-generator behavior for the generic unigram survivors.
