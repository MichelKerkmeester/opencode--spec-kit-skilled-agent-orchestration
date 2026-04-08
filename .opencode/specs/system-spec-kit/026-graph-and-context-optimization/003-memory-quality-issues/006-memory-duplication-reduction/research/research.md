---
title: "Phase 6 Research: Memory File Duplication Landscape & Remediation"
description: "Synthesized output of 5 parallel deep-research iterations on residual memory duplication after Phases 1-5 fixed D1-D8"
trigger_phrases:
  - "phase 6 research"
  - "memory duplication research"
  - "residual duplication remediation"
importance_tier: important
contextType: "research"
---

# Phase 6 Research: Memory File Duplication Landscape & Remediation

<!-- ANCHOR:summary -->
## 1. EXECUTIVE SUMMARY

Five parallel Phase 6 iterations converged on 16 total findings across the residual duplication surface: 3 HIGH, 7 MEDIUM, and 6 LOW. Each iteration reviewed the same bounded recent-memory surface from a different angle, which let the packet distinguish live generator/template duplication from historical-only residue and acceptable continuity anchors. [SOURCE: `research/iterations/iteration-001.md:17-20`] [SOURCE: `research/iterations/iteration-002.md:17-20`] [SOURCE: `research/iterations/iteration-003.md:17-20`] [SOURCE: `research/iterations/iteration-004.md:17-20`] [SOURCE: `research/iterations/iteration-005.md:17-20`]

The top three remediation candidates are: `F005.2` frontmatter-to-`MEMORY METADATA` mirroring across the live generated corpus, `F001.1` packet/path scaffold trigger injection that makes sibling memories look artificially alike, and `F002.1` blank-title observation headings that serialize as repeated `### OBSERVATION: Observation` blocks. These are the highest-value fixes because they are current-output defects, widely visible, and map cleanly to concrete owner lines. [SOURCE: `research/iterations/iteration-005.md:29-33`] [SOURCE: `research/iterations/iteration-001.md:23-27`] [SOURCE: `research/iterations/iteration-002.md:23-27`]

Convergence was reached after the five approved dimensions all produced a stable answer: nine code-side H/M items belong in `PR-12`, one bounded migration/hardening item belongs in optional `PR-13`, and the remaining LOW items are historical, audit-only, or not worth live-path risk in Phase 6. A sixth iteration would expand examples, not change the remediation shape. [SOURCE: `research/iterations/iteration-001.md:78-79`] [SOURCE: `research/iterations/iteration-002.md:69-70`] [SOURCE: `research/iterations/iteration-003.md:61-62`] [SOURCE: `research/iterations/iteration-004.md:93-94`] [SOURCE: `research/iterations/iteration-005.md:81-82`]
<!-- /ANCHOR:summary -->

<!-- ANCHOR:scope -->
## 2. SCOPE & METHOD

The research wave sampled the active recent-memory surface rather than the full historical backlog. Iterations 1, 2, and 5 reviewed 52 artifacts each: the 50 most recent `.opencode/specs/**/memory/*.md` files plus 2 files under `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/memory/`. Iterations 3 and 4 reviewed 51 artifacts each: the same 50 recent repo files plus the single relevant Claude-project file that matched the dimension. Archives, quarantine folders, `external/` trees, and scratch data were treated as negative controls or excluded unless needed to prove a historical-only edge case. [SOURCE: `research/iterations/iteration-001.md:17-20`] [SOURCE: `research/iterations/iteration-002.md:17-20`] [SOURCE: `research/iterations/iteration-003.md:17-20`] [SOURCE: `research/iterations/iteration-004.md:17-20`] [SOURCE: `research/iterations/iteration-005.md:17-20`]

Detection methods were dimension-specific: frontmatter trigger extraction and normalized grouping for trigger duplication, regex and lexical overlap scans for observations and decisions, path/topic parsing for `FILES` and `key_topics`, normalized narrative comparison for `OVERVIEW`/`SUMMARY`/`Last:` repetition, and structural scans for anchors plus mirrored metadata surfaces. Each iteration paired corpus evidence with owner tracing into the relevant workflow, extractor, template, reviewer, or migration file. [SOURCE: `research/iterations/iteration-001.md:18-20`] [SOURCE: `research/iterations/iteration-002.md:19-20`] [SOURCE: `research/iterations/iteration-003.md:19-20`] [SOURCE: `research/iterations/iteration-004.md:19-20`] [SOURCE: `research/iterations/iteration-005.md:19-20`]

For Phase 6, "duplication" means repeated content that carries no new retrieval or human meaning: path-derived trigger noise, repeated proposition restatement, repeated closure guidance, or duplicate machine-facing fields. "Valid repetition" means continuity anchors and compressed provenance that still add discovery value, such as same-folder continuation phrases (`claude optimization settings`, `graphify research`) or tree-thinning carrier rows that keep one canonical `FILE_PATH` while summarizing merged files. [SOURCE: `research/iterations/iteration-001.md:20-20`] [SOURCE: `research/iterations/iteration-003.md:20-20`] [SOURCE: `research/iterations/iteration-001.md:41-45`] [SOURCE: `research/iterations/iteration-003.md:23-29`]
<!-- /ANCHOR:scope -->

<!-- ANCHOR:findings -->
## 3. FINDINGS BY DIMENSION

### 3.1 Trigger Phrases (Iteration 1)

- `F001.1`: "Pattern: packet/path scaffold phrases repeated across sibling memories." Severity: HIGH. [SOURCE: `research/iterations/iteration-001.md:23-27`]
- `F001.2`: "Pattern: generic single-word survivors are present in the corpus, but the current short-token allowlist is not the main culprit." Severity: MEDIUM. [SOURCE: `research/iterations/iteration-001.md:29-33`]
- `F001.3`: "Pattern: title/path overlap and formatting variants create redundant near-duplicates." Severity: MEDIUM. [SOURCE: `research/iterations/iteration-001.md:35-39`]

### 3.2 Observations & Decisions (Iteration 2)

- `F002.1`: "Live generic observation placeholder leak." Severity: HIGH. [SOURCE: `research/iterations/iteration-002.md:23-27`]
- `F002.2`: "Decision title, outcome bullet, and rationale often restate the same proposition." Severity: MEDIUM. [SOURCE: `research/iterations/iteration-002.md:28-32`]

### 3.3 Key Topics & FILES Table (Iteration 3)

- `F003.1`: "Tree-thinning carrier rows create apparent FILES duplication without duplicate `FILE_PATH` rows." Severity: MEDIUM. [SOURCE: `research/iterations/iteration-003.md:23-29`]

### 3.4 OVERVIEW & SUMMARY Narrative (Iteration 4)

- `F004.1`: "Completed-packet closure guidance is echoed across three sections in the same memory." Severity: MEDIUM. [SOURCE: `research/iterations/iteration-004.md:23-39`]
- `F004.2`: "A separate `Last:` resume-context truncation path still produces repeated ellipsis-trimmed fragments." Severity: MEDIUM. [SOURCE: `research/iterations/iteration-004.md:41-51`]

### 3.5 Structural Duplication (Iteration 5)

- `F005.1`: "Pattern: section identity is emitted as a three-part scaffold in every current generated memory file." Severity: MEDIUM. [SOURCE: `research/iterations/iteration-005.md:23-27`]
- `F005.2`: "Pattern: frontmatter fields are still mirrored into the bottom `MEMORY METADATA` block, so Phase 2 fixed the importance-tier mismatch but not the broader duplicate-write design." Severity: HIGH. [SOURCE: `research/iterations/iteration-005.md:29-33`]

LOW-only items are explicitly deferred out of the Phase 6 implementation wave: `F002.3`, `F002.4`, `F003.2`, `F004.3`, `F005.3`, and `F005.4`. Those findings are historical-only, audit-only, or low-value compared to the live-path H/M set. [SOURCE: `research/iterations/iteration-002.md:33-42`] [SOURCE: `research/iterations/iteration-003.md:30-36`] [SOURCE: `research/iterations/iteration-004.md:53-58`] [SOURCE: `research/iterations/iteration-005.md:35-45`]
<!-- /ANCHOR:findings -->

<!-- ANCHOR:remediation-matrix -->
## 4. UNIFIED REMEDIATION MATRIX

| ID | Dimension | Severity | Owner File:Line | Patch Shape | Risk | Verification | Phase 6 Sub-PR |
|----|-----------|----------|-----------------|-------------|------|--------------|----------------|
| F001.1 | Trigger phrases | HIGH | `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1248-1253; 1313-1328` | Remove unconditional parent-packet token append; preserve only one cluster anchor when it adds new information beyond title/manual triggers | MEDIUM | Replay the `001-research-graph-context-systems` cluster and prove `claude optimization settings` / `graphify research` survive while `graph and context optimization`, `kit/026`, and `optimization/001` stop appearing everywhere | PR-12 |
| F001.3 | Trigger phrases | MEDIUM | `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:131-167; .opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:83-140; .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:966-972` | Canonicalize hyphen-vs-space dedupe keys and drop title/path-contained aliases when another surviving phrase already carries the same identity | MEDIUM | Confirm one canonical form survives for `codex-cli-compact`, `tree-sitter`, and `implementation-summary` without removing useful leaf identifiers | PR-12 |
| F002.1 | Observations and decisions | HIGH | `.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:337-364; .opencode/skill/system-spec-kit/templates/context_template.md:380-389` | Suppress or rewrite blank/generic non-decision observation titles before render so repeated `### OBSERVATION: Observation` headings cannot ship | LOW | Replay a fixture with multiple blank-title observations and prove zero generic headings while distinct narratives remain visible | PR-12 |
| F002.2 | Observations and decisions | MEDIUM | `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:852-857; .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:214-222; 285-348` | Deduplicate proposition restatement across `Key Outcomes`, decision titles, and fallback rationale without removing explicit authored rationale | MEDIUM | Replay `005-claudest` and `001-claude-optimization-settings` fixtures and prove each proposition appears once while real rationale stays intact | PR-12 |
| F003.1 | Key topics and FILES | MEDIUM | `.opencode/skill/system-spec-kit/scripts/core/alignment-validator.ts:151-178` | Keep one carrier row per canonical `FILE_PATH` but move verbose `Merged from ...` provenance out of retrieval-facing `DESCRIPTION` text | LOW | Replay tree-thinned saves and prove carrier rows remain, no duplicate paths appear, and descriptions no longer contain 2+ `Merged from` clauses | PR-12 |
| F004.1 | OVERVIEW and SUMMARY | MEDIUM | `.opencode/skill/system-spec-kit/templates/context_template.md:208` | Collapse completed-session closure guidance to one authoritative surface instead of repeating the same closeout message in `Pending Work`, `Next:`, and `Next Action` | MEDIUM | Snapshot one completed and one in-progress memory; completed output keeps one closure instruction, in-progress output keeps concrete pending-task guidance | PR-12 |
| F004.2 | OVERVIEW and SUMMARY | MEDIUM | `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:619` | Replace hard 80-character `Last:` clipping with word-boundary or sentence-aware trim, or suppress low-information fragments | LOW | Replay long-observation fixtures and confirm `Last:` never ends in clipped clauses like `became a...` or `documentation...` | PR-12 |
| F005.1 | Structural duplication | MEDIUM | `.opencode/skill/system-spec-kit/templates/context_template.md:187-188; 736-737; .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:274-278; .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:343-345` | Remove one redundant section-identity system and align reviewer/indexer expectations to the surviving anchor contract | MEDIUM | Render representative memories and prove TOC links still resolve, `extractAnchorIds()` still returns expected ids, and the reviewer no longer expects a triplet scaffold | PR-12 |
| F005.2 | Structural duplication | HIGH | `.opencode/skill/system-spec-kit/templates/context_template.md:1-6; 755-836; .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1027-1087; .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:666-673` | Establish one single source of truth for `contextType/context_type` and `trigger_phrases` so frontmatter and `MEMORY METADATA` stop mirroring the same classification payload | MEDIUM | Replay representative saves and prove frontmatter parsing, metadata parsing, and search/indexing resolve the same effective classification and trigger set without duplicate writes | PR-12 |
| F001.2 | Trigger phrases | MEDIUM | `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:46-69; .opencode/skill/system-spec-kit/scripts/core/workflow.ts:141-165; .opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:966-972` | Run a bounded corpus migration/re-sanitization first; only add targeted code hardening if replay proves live generator leakage still exists after cleanup | MEDIUM | Re-sanitize the sampled files and prove `and` / `graph` disappear while short useful anchors like `api`, `cli`, and `mcp` stay intact | PR-13 |

Post-Phase-6 deferrals: `F002.3`, `F002.4`, `F003.2`, `F004.3`, `F005.3`, and `F005.4` stay outside `PR-12`/`PR-13` because they are historical-only, optional migration cleanups, or low-severity shape issues that do not justify more live-path complexity in this phase. [SOURCE: `research/iterations/iteration-002.md:33-42`] [SOURCE: `research/iterations/iteration-003.md:30-36`] [SOURCE: `research/iterations/iteration-004.md:53-58`] [SOURCE: `research/iterations/iteration-005.md:35-45`]
<!-- /ANCHOR:remediation-matrix -->

<!-- ANCHOR:risks -->
## 5. RISKS & MITIGATIONS

1. Over-pruning packet-level trigger anchors could hurt sibling-memory discoverability.
Mitigation: keep one cluster anchor only when it adds information not already present in the title/manual trigger set, and verify against the `001-research-graph-context-systems` fixture cluster. [SOURCE: `research/iterations/iteration-001.md:57-59`]

2. Collapsing decision/outcome/rationale repetition could erase explicit rationale text that is semantically distinct from the title.
Mitigation: dedupe only when normalized propositions match and preserve any authored `rationale`, `reasoning`, or evidence fields. [SOURCE: `research/iterations/iteration-002.md:56-59`]

3. Completed-session closure cleanup could accidentally weaken active resume guidance if the gating logic applies too broadly.
Mitigation: snapshot-test completed and in-progress session shapes separately and keep the full resume block for in-progress states only. [SOURCE: `research/iterations/iteration-004.md:66-72`]

4. Removing mirrored metadata surfaces could break downstream readers that currently rely on both frontmatter and `MEMORY METADATA`.
Mitigation: choose one single source of truth deliberately, then verify frontmatter parsing, metadata parsing, and memory search/indexing still resolve the same classification and trigger set. [SOURCE: `research/iterations/iteration-005.md:60-65`]

5. Moving tree-thinning provenance out of `FILES` descriptions could reduce auditability if the replacement carrier is too thin.
Mitigation: keep carrier-row selection unchanged and preserve a short merged summary while relocating verbose provenance to a safer surface. [SOURCE: `research/iterations/iteration-003.md:45-50`]
<!-- /ANCHOR:risks -->

<!-- ANCHOR:verification -->
## 6. VERIFICATION STRATEGY

Phase 6 should verify the remediation set with replay fixtures rather than live corpus edits first. The fixture set needs five buckets: trigger-phrase cluster replays for `F001.1`/`F001.3`, blank-title observation payloads plus proposition-overlap decision payloads for `F002.1`/`F002.2`, tree-thinning carrier-row payloads for `F003.1`, completed-versus-in-progress closeout payloads plus long `Last:` narratives for `F004.1`/`F004.2`, and structural render/parser fixtures for `F005.1`/`F005.2`. [SOURCE: `research/iterations/iteration-001.md:59-73`] [SOURCE: `research/iterations/iteration-002.md:54-64`] [SOURCE: `research/iterations/iteration-003.md:49-56`] [SOURCE: `research/iterations/iteration-004.md:72-88`] [SOURCE: `research/iterations/iteration-005.md:58-70`]

Reviewer coverage should be tied back to the existing Phase 1-5 guardrail vocabulary, but `CHECK-D3` and `CHECK-D6` alone are not sufficient for the residual-duplication surface. They cover trigger/title-path duplication pressure, but they do not detect blank observation headings, completed-session tri-echo closure text, clipped `Last:` fragments, section-identity triplets, or frontmatter-to-metadata mirror writes. Phase 6 therefore needs new residual-duplication reviewer assertions in addition to existing `CHECK-D3` and `CHECK-D6`, ideally one each for: generic observation headings, decision proposition triple-restatement, tree-thinning description inflation, completed-session closure triplication, clipped `Last:` fragments, redundant section-identity scaffolding, and frontmatter-vs-metadata mirror drift. [SOURCE: `research/iterations/iteration-002.md:23-32`] [SOURCE: `research/iterations/iteration-003.md:23-29`] [SOURCE: `research/iterations/iteration-004.md:23-27`] [SOURCE: `research/iterations/iteration-004.md:41-51`] [SOURCE: `research/iterations/iteration-005.md:23-33`] [SOURCE: `../research/research.md:1357-1377`]

The final verification pass for Phase 6 should combine replay tests, reviewer assertions, and packet-level validation:

- replay snapshots for each `PR-12` row and the bounded `PR-13` migration sample,
- reviewer assertions mapped to the finding ids above,
- `CHECK-D1..D8` continuity checks to prove no Phase 1-5 defect class regresses while Phase 6 dedupe fixes land,
- `validate.sh --strict` for this phase packet after spec/plan/tasks/checklist alignment.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:convergence -->
## 7. CONVERGENCE

Convergence was reached because each approved Phase 6 dimension returned a bounded, owner-traceable answer and the cross-iteration synthesis did not surface a hidden sixth defect family. The remaining disagreement is not about what to fix in Phase 6; it is only about how much historical migration is worth doing alongside the live-path code fixes. That is why the final plan caps the work at `PR-12` plus optional `PR-13` and explicitly defers the low-severity historical backlog to post-Phase-6 follow-up if the team wants to reopen it later. [SOURCE: `research/iterations/iteration-001.md:78-79`] [SOURCE: `research/iterations/iteration-002.md:69-70`] [SOURCE: `research/iterations/iteration-003.md:61-62`] [SOURCE: `research/iterations/iteration-004.md:93-94`] [SOURCE: `research/iterations/iteration-005.md:81-82`]
<!-- /ANCHOR:convergence -->
