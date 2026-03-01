---
title: "Research: Memory File Quality and Usefulness Audit [136-mcp-working-memory-hybrid-rag/research]"
description: "I audited generated memory markdown quality for .opencode/specs/02--system-spec-kit/**/memory/*.md using a 50-file sample and corpus-level cross-checks."
trigger_phrases:
  - "research"
  - "memory"
  - "file"
  - "quality"
  - "and"
  - "136"
  - "mcp"
importance_tier: "normal"
contextType: "research"
---
# Research: Memory File Quality and Usefulness Audit

## Executive Summary

I audited generated memory markdown quality for `.opencode/specs/02--system-spec-kit/**/memory/*.md` using a 50-file sample and corpus-level cross-checks.

- Population size is 187 memory files, with heavy archive concentration (162 in `z_archive`, 25 active/non-archive).
- The sampled files show moderate-to-low operational usefulness: high template/boilerplate consistency, but weak extraction fidelity and low actionability.
- Most severe gaps are unresolved placeholders, generic decision fallback text, sparse indexing fields (`trigger_phrases`, `key_topics`), and malformed migrated metadata in a minority of files.

Confidence: **Medium-High** for prevalence estimates (sample + population cross-check), **Medium** for root-cause attribution where migration tooling is not directly traceable.

---

## Methodology (Sampling Approach, Scoring Dimensions)

### Scope

- Target path: `.opencode/specs/02--system-spec-kit/**/memory/*.md`
- Total files discovered: **187**
- Sample analyzed: **50** files

### Sampling Approach

To avoid overfitting to archive-only behavior, I used a stratified sample:

- 35 files from `z_archive`
- 15 files from active/non-archive folders
- deterministic random seed (`136`) for reproducibility

Representativeness note: the real population is 86.6% archive-heavy (162/187), so this sample intentionally over-represents active files for diagnostic value.

### Scoring Dimensions

Each sampled file was evaluated on two quality targets:

1. **Memory extraction quality** (how faithfully session signals were captured)
   - unresolved placeholders (`[TBD]`, `unknown`, `[N/A]`)
   - contamination from orchestration chatter
   - decision extraction quality (real decisions vs fallback sentence)

2. **Final memory markdown content quality** (how useful the saved artifact is)
   - semantic indexing completeness (`trigger_phrases`, `key_topics`)
   - actionability (`Next Action` quality)
   - structural validity (anchor consistency, path fields, malformed metadata)

I also applied a heuristic quality band model (A/B/C/D) with weighted penalties for missing semantic signals, placeholders, and boilerplate-only outcomes.

---

## Quantitative Findings (Counts, Rates, Quality Bands)

### Population Context (N=187)

- Archive vs active split: 162 archive / 25 active
- Files containing legacy path references (`003-memory-and-spec-kit`): 104/187 (55.6%)
- Files with migration marker comment: 39/187 (20.9%)

### Sample Results (n=50)

| Metric | Count | Rate |
|---|---:|---:|
| Files with `[TBD]` | 20 | 40.0% |
| Files with `unknown` values | 3 | 6.0% |
| Files with `[N/A]` placeholders | 30 | 60.0% |
| Empty `trigger_phrases` block | 17 | 34.0% |
| Empty `key_topics` block | 5 | 10.0% |
| `message_count: 0` | 6 | 12.0% |
| `tool_count: 0` | 29 | 58.0% |
| Generic decisions fallback sentence present | 33 | 66.0% |
| "I'll execute this step by step" artifact present | 9 | 18.0% |
| Migration marker present | 5 | 10.0% |

### Quality Bands (Heuristic)

| Band | Definition (operational) | Count | Rate |
|---|---|---:|---:|
| A | High signal, low placeholders, actionable | 15 | 30.0% |
| B | Generally useful, minor noise | 10 | 20.0% |
| C | Usable with significant cleanup needed | 23 | 46.0% |
| D | Low utility / malformed or mostly boilerplate | 2 | 4.0% |

Interpretation: 50.0% (C+D) are below an acceptable "production memory" bar without cleanup.

---

## Qualitative Findings (With Concrete Examples)

### 1) Placeholder leakage is common and directly harms retrieval usefulness

- `[TBD]` appears in preflight and postflight fields in active files, reducing factual density. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/020-mcp-working-memory-hybrid-rag/memory/18-02-26_08-44__mcp-working-memory-hybrid-rag.md:56]
- `[TBD]` also appears in readiness and confidence fields that should be either computed or omitted. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/004-script-audit-comprehensive/memory/15-02-26_11-06__script-audit-comprehensive.md:66]

### 2) Boilerplate fallback dominates decision sections

- A generic sentence appears repeatedly even in files containing concrete decision-like content. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/030-gate3-enforcement/memory/implementation-summary.md:220]
- This behavior is directly templated as the no-decisions fallback. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/templates/context_template.md:518]

### 3) Semantic indexing blocks are often empty or low-signal

- Some files have empty `key_topics` and `trigger_phrases`, reducing matchability. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/030-gate3-enforcement/memory/implementation-summary.md:365]
- Similar empty trigger lists appear in migrated test files. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/044-speckit-test-suite/memory/e2e-test-memory.md:307]

### 4) Metadata/path corruption exists in a small but severe subset

- A malformed gate prompt string is persisted into `Spec Folder` and YAML fields. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/030-gate3-enforcement/memory/constitutional-gate-rules.md:12]
- Markdown-formatted spec paths are embedded in machine fields, breaking canonical path consistency. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/030-gate3-enforcement/memory/handover.md:356]

### 5) Extraction contamination from assistant process chatter is present

- Non-semantic orchestration text is captured as primary narrative. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/020-mcp-working-memory-hybrid-rag/memory/18-02-26_08-44__mcp-working-memory-hybrid-rag.md:112]
- The same artifact repeats in other files, indicating systemic extraction behavior. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/004-script-audit-comprehensive/memory/15-02-26_11-06__script-audit-comprehensive.md:195]

### Positive Pattern (Not all files are poor)

- Some memories include specific outcomes, file roles, and decision records with confidence values. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/012-handover-triggers/memory/17-12-25_16-19__handover-triggers.md:136]

---

## Root Cause Analysis

### RC1: Placeholder defaults are intentionally emitted when data is missing

- The collector emits `[Not assessed]` and `[TBD]` defaults by design. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:145]
- This guarantees structural completeness, but not information completeness.

### RC2: Template-level fallback inserts low-information decision text

- Decision fallback sentence is hardcoded in the context template when no decisions resolve. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/templates/context_template.md:516]

### RC3: Decision extraction relies on narrow signals

- Decision extractor depends on `_manualDecisions` or observations tagged as `type === 'decision'`; otherwise output can collapse to fallback behavior. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:41]

### RC4: Legacy migration normalization is incomplete

- Many files carry migration markers and legacy path conventions; malformed variants exist.
- Migration script provenance (`migrate-memory-v22.mjs`) is referenced in files but not directly inspectable in this workspace, reducing root-cause confidence for specific migration defects. [CITATION: NONE - script artifact not located in repository during this audit]

### RC5: Quality gating is weak at write time

- Invalid/malformed values (e.g., markdown in machine fields, gate prompt strings) can pass through to final files, implying absence of strict schema+content post-render validation.

---

## Recommendations Prioritized (P0/P1/P2) with Acceptance Metrics

### P0 - Blockers (must fix first)

1. **Add post-render hard validation gate for memory files**
   - Enforce: no `[TBD]`, no raw `unknown` for required machine fields, valid `spec_folder` format, no markdown syntax in machine fields.
   - Acceptance metrics:
     - placeholder leakage rate <= 2% in new files over 14 days
     - malformed `spec_folder` incidence = 0 in CI checks

2. **Block low-signal fallback-only outputs**
   - If decisions are empty, omit section or include machine-readable `decision_count: 0` without boilerplate sentence.
   - Acceptance metrics:
     - generic fallback sentence prevalence in newly generated files <= 10%

3. **Add contamination filters before summary/key-topic extraction**
   - Remove orchestration phrases (e.g., "I'll execute this step by step") from narrative and trigger candidates.
   - Acceptance metrics:
     - contamination phrase occurrence in new files <= 1%

### P1 - Important improvements

1. **Strengthen decision extraction signals**
   - Expand extraction beyond strict `type === 'decision'` using lexical/rule cues from assistant and user turns.
   - Acceptance metrics:
     - files with at least one concrete decision (when session includes design choices) >= 70%

2. **Improve semantic field backfill strategy**
   - Ensure minimum non-empty `trigger_phrases` and `key_topics` using weighted fallback from changed files + dominant nouns.
   - Acceptance metrics:
     - empty `trigger_phrases` <= 5% on new files
     - empty `key_topics` <= 5% on new files

3. **Introduce a quality score in metadata and indexing pipeline**
   - Persist `quality_score` and `quality_flags` per memory.
   - Acceptance metrics:
     - 100% of new memories include score and flags
     - retrieval can filter by quality threshold

### P2 - Optimization and debt reduction

1. **Progressive template compactness by confidence/quality**
   - Short form for sparse sessions; full form for high-signal sessions.
   - Acceptance metrics:
     - median memory length reduced by >= 25% with no retrieval MRR degradation (>0.98x baseline)

2. **Legacy remediation batch**
   - Re-normalize or archive low-value migrated files and exclude test fixtures from production relevance tiers.
   - Acceptance metrics:
     - legacy-path references reduced from 55.6% to <= 10% in active tier

---

## Proposed Implementation Sequence (Phased)

### Phase 0 - Baseline and Test Harness (1-2 days)

- Create deterministic quality benchmark suite from known bad/good examples.
- Add regression fixtures for malformed `spec_folder`, empty semantic blocks, and contamination phrases.

### Phase 1 - Quality Gates (2-3 days)

- Implement post-render schema/content validator in generation workflow.
- Fail generation (or downgrade to temporary memory) when P0 quality checks fail.

### Phase 2 - Extraction Quality Upgrade (3-5 days)

- Expand decision extraction and contamination filtering.
- Add semantic-field backfill logic and minimum quality constraints.

### Phase 3 - Legacy Cleanup and Reindex (2-4 days)

- Batch normalize legacy path fields and malformed machine metadata.
- Re-index cleaned memories; isolate fixture/test memories from operational ranking.

### Phase 4 - Observability and Rollout (ongoing)

- Track quality KPIs daily: placeholder leakage, empty semantic fields, fallback prevalence, contamination rate.
- Roll out with canary thresholding and rollback on KPI regression.

---

## Risks / Trade-offs

1. **Stricter gates may reduce memory creation throughput**
   - Trade-off: fewer memories vs higher trustworthiness.

2. **Aggressive filtering can remove useful context**
   - Mitigation: preserve raw transcript in hidden section while indexing only cleaned text.

3. **Legacy cleanup may shift retrieval behavior**
   - Mitigation: run shadow retrieval comparison before and after reindex.

4. **Template compaction can reduce debugging traceability**
   - Mitigation: dual-mode output (compact operational + optional verbose forensic).

---

## Uncertainty and Limitations

- This is a **sample-based review** with targeted stratification; prevalence estimates are strong directionally but not exact for all subfolders.
- I did not run retrieval outcome experiments (e.g., query relevance/MRR) in this task, so usefulness is inferred from artifact quality proxies.
- Migration root-cause confidence is limited because referenced migration script artifacts are not directly available in this repository snapshot.

---

## Evidence Ledger (Grade A/B/C)

- **Grade A (primary code/file evidence):** memory file line references and template/extractor source lines cited above.
- **Grade B (derived quantitative evidence):** counts/rates computed from local file scan scripts over repository files.
- **Grade C (inference):** migration-defect mechanism details where script source could not be inspected.
