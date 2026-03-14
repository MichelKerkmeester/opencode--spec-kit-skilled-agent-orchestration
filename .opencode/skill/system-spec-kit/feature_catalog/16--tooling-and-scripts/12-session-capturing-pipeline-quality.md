# Session capturing pipeline quality

## 1. OVERVIEW

Session capturing pipeline quality covers the 20 P0-P3 fixes applied to `generate-context.js` and its supporting extractors during the Part I audit and remediation of spec 010-perfect-session-capturing. These fixes harden session ID generation, atomic writes, contamination filtering, extraction correctness, and configurability across the memory-save pipeline.

The pipeline processes raw session data (observations, tool calls, file modifications) into structured memory files. Before these fixes, the pipeline had security gaps (predictable session IDs, partial write failures), quality gaps (false learning deltas, contaminated slugs), and configurability gaps (hardcoded limits). The remediation brought all critical and high-severity findings to closure.

---

## 2. CURRENT REALITY

The session capturing pipeline enforces the following quality properties:

1. **Crypto session IDs** — `session-extractor.ts` uses `crypto.randomBytes()` instead of `Math.random()` for session ID generation.
2. **Atomic batch writes** — `file-writer.ts` uses random temp-file suffixes and rolls back previously written files when a later batch write fails.
3. **Contamination filtering** — `contamination-filter.ts` contains 30+ denylist patterns covering orchestration chatter, self-reference, filler, and tool scaffolding.
4. **Quality abort threshold** — `workflow.ts` hard-aborts at score 15 (configurable via `config.ts`) to prevent low-quality memory output.
5. **Alignment blocking** — `workflow.ts` enforces pre-enrichment (15%) and post-enrichment (10%) file-path overlap thresholds against the active spec folder.
6. **File action semantics** — `file-extractor.ts` preserves Created/Modified/Deleted/Read/Renamed through the extraction pipeline.
7. **Configurable pipeline constants** — `config.ts` exposes tool output limits, timestamp tolerance, workflow limits, learning weights, and quality thresholds.
8. **Slug contamination rejection** — `slug-utils.ts` rejects 6 pattern classes of generic tool-derived titles as memory-name candidates.
9. **Descriptive observation titles** — `input-normalizer.ts` derives file paths, search patterns, or command descriptions instead of generic `Tool: X` labels.
10. **Safe postflight deltas** — `collect-session-data.ts` computes learning deltas only when all six score fields pass `Number.isFinite()`.

Status: Implemented and verified via node test suite (278 passed), vitest boundary tests (40/40), and alignment drift checks (0 findings).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `scripts/extractors/session-extractor.ts` | Script | Crypto session IDs, zero-tool RESEARCH classification, live-over-synthetic snapshot preference |
| `scripts/core/file-writer.ts` | Script | Random temp-file suffixes, batch write rollback |
| `scripts/extractors/contamination-filter.ts` | Script | 30+ denylist patterns for non-semantic content removal |
| `scripts/core/workflow.ts` | Script | Quality abort threshold, alignment blocking, code-fence-aware HTML stripping, memoryId null check |
| `scripts/core/config.ts` | Script | Configurable pipeline constants (tool output, timestamps, limits, weights, thresholds) |
| `scripts/extractors/file-extractor.ts` | Script | Richer duplicate descriptions, expanded file action normalization |
| `scripts/extractors/collect-session-data.ts` | Script | Safe postflight delta computation with Number.isFinite() guard |
| `scripts/extractors/opencode-capture.ts` | Script | Config-backed truncation and timestamp matching |
| `scripts/utils/input-normalizer.ts` | Script | Descriptive tool observation titles, spec-folder relevance filtering |
| `scripts/utils/slug-utils.ts` | Script | Slug contamination pattern rejection |
| `scripts/extractors/decision-extractor.ts` | Script | Evidence-based confidence defaults |

### Tests

| File | Focus |
|------|-------|
| `scripts/tests/stateless-enrichment.vitest.ts` | Relevance filtering, sparse-spec extraction, git scoping, live-over-synthetic snapshots |
| `scripts/tests/task-enrichment.vitest.ts` | Slug contamination, task enrichment, quality validation, memory template rendering |
| `scripts/tests/test-extractors-loaders.js` | Full extractor/loader suite (278 tests) |

---

## 4. SOURCE METADATA

- Group: Tooling and scripts
- Source feature title: Session capturing pipeline quality
- Current reality source: spec 010-perfect-session-capturing
