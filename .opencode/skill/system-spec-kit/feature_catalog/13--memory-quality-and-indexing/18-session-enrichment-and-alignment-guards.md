---
title: "Stateless enrichment and alignment guards"
description: "Stateless enrichment and alignment guards enrich thin OpenCode session data with spec-folder and git context while blocking saves that belong to a different task."
---

# Stateless enrichment and alignment guards

## 1. OVERVIEW

Stateless enrichment and alignment guards enrich thin OpenCode session data with spec-folder and git context while blocking saves that belong to a different task.

When a memory is saved with minimal context, the system fills in the gaps by pulling relevant details from the project folder and recent changes. At the same time, it checks that the memory actually belongs to the project it claims to be part of and blocks saves that clearly belong somewhere else. Think of it as an assistant who fills out missing form fields for you but refuses to file the form in the wrong cabinet.

---

## 2. CURRENT REALITY

Captured-session `generate-context.js` saves now enrich thin OpenCode-derived session data with spec-folder and git context before rendering, while keeping contamination defenses in place.

Current behavior is enforced in three slices:
1. `transformOpencodeCapture()` normalizes snake_case OpenCode metadata and filters prompts, exchanges and tool calls by spec relevance using both slug-form and natural-language keyword variants.
2. `enrichCapturedSessionData()` appends `_provenance: 'spec-folder'` and `_provenance: 'git'` signals after the contamination-cleaning pass and before downstream extraction.
3. Pre- and post-enrichment alignment gates allow captured-session saves only when captured file paths overlap with the target spec's declared work surface. The overlap check now uses both spec-folder keywords and files declared in the spec's files-to-change table, which prevents false blocks for legitimate code paths like `scripts/core/workflow.ts`.

Git enrichment no longer scopes only to the spec folder path itself. It uses files declared by the spec to detect recent committed and uncommitted changes, commit observations retain only the scope-filtered touched file list for downstream reasoning, and the extractor now exposes an explicit repository snapshot through `headRef`, `commitRef`, `repositoryState`, and `isDetachedHead`. The workflow still hard-aborts on `ALIGNMENT_BLOCK`, `POST_ENRICHMENT_ALIGNMENT_BLOCK`, or failed captured-session validation rules when the capture clearly belongs to another task.

Git extraction also preserves uncommitted file context in freshly initialized repositories that do not have a `HEAD` commit yet, survives detached-HEAD saves without dropping commit identity, and parses multi-commit history without leaking similarly named foreign spec folders into the target result.

Downstream session snapshots now prefer live observations over synthetic spec/git enrichment when deriving `activeFile`, `lastAction`, `nextAction` and blocker summaries. That keeps provenance-enrichment useful for context without letting epoch-timestamped synthetic entries masquerade as the user's most recent action.

Status: Implemented and covered by targeted Vitest regressions.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `scripts/utils/input-normalizer.ts` | Script | Captured-session relevance filtering and snake_case/camelCase OpenCode normalization |
| `scripts/extractors/spec-folder-extractor.ts` | Script | Structured extraction of files, trigger phrases, decisions, and progress from spec docs |
| `scripts/extractors/git-context-extractor.ts` | Script | Git status, diff, and commit enrichment scoped by spec-declared file targets |
| `scripts/core/workflow.ts` | Script | Captured-session enrichment orchestration plus pre/post alignment guard enforcement |
| `scripts/extractors/file-extractor.ts` | Script | Preserves `ACTION` semantics from enriched file entries |

### Tests

| File | Focus |
|------|-------|
| `scripts/tests/session-enrichment.vitest.ts` | Relevance filtering, sparse-spec extraction, git snapshot metadata, multi-commit scoping/fallbacks, unborn-HEAD repo handling, live-over-synthetic snapshot behavior, and extractor barrel exports |
| `scripts/tests/task-enrichment.vitest.ts` | Workflow seam coverage proving captured-session saves are allowed when captured files match spec-declared code paths |
| `scripts/tests/memory-render-fixture.vitest.ts` | Render-path validation and quality gate regression coverage for captured-session memory output |

---

## 4. SOURCE METADATA

- Group: Memory quality and indexing
- Source feature title: Stateless enrichment and alignment guards
- Current reality source: spec 009-perfect-session-capturing / archived phase 014 quality gates
