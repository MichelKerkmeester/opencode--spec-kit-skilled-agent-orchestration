# Cell S1 / cli-codex-1 — Score (v1.0.2)

## v1.0.1 Rubric (4 dims, 0-2 scale, 8 max)

| Dim | Score | Evidence |
|-----|-------|----------|
| 1 Correctness | 2 | Returns exact canonical spec folder `.../003-continuity-memory-runtime/004-memory-save-rewrite` with 3 anchored citations (spec.md L49 title, spec.md L161 REQ-001, decision-record.md L91 ADR-002). Matches expected outcome verbatim. |
| 2 Tool Selection | 1 | Used `rg` (grep) for the search. cli-codex has no MCP access (per dispatch matrix), so `rg` is the locally-optimal tool — but the scenario's "Target tools" was `memory_search` / `memory_match_triggers`, which cli-codex cannot reach. Suboptimal vs scenario expectation; optimal vs cli-codex's available toolkit. |
| 3 Latency (>300/60-300/<60s) | 2 | 36.1s wall-clock — well under the 60s threshold. |
| 4 Hallucination | 2 | All 3 citations verifiable: file paths resolve on disk; line numbers are specific (49, 161, 91); each citation has a quoted anchor or section header that matches the file. Zero fabricated content. |
| **Total** | **7/8** | |

## Fork-Telemetry Assertions (REQ-008 — applicable subset)

| REQ | Field | Expected | Observed | Result |
|-----|-------|----------|----------|--------|
| REQ-008 | `dedupedAliases` | populated if cocoindex used | cli-codex did not invoke cocoindex (used `rg`) | N-A |
| REQ-008 | `uniqueResultCount` | top-level metadata if cocoindex used | not applicable | N-A |
| REQ-008 | `rankingSignals` | per-result if cocoindex used | not applicable | N-A |
| REQ-008 | `source_realpath` | chunk-level if cocoindex used | not applicable | N-A |
| REQ-008 | `content_hash` | chunk-level if cocoindex used | not applicable | N-A |
| REQ-008 | `path_class` | chunk-level if cocoindex used | not applicable | N-A |
| REQ-008 | `raw_score` | per-result if cocoindex used | not applicable | N-A |

All N-A is expected — cli-codex has no MCP/cocoindex access per the dispatch matrix.

## Delta vs v1.0.1 Baseline

- **v1.0.1 baseline**: 7/10 (cli-codex per findings.md Per-Scenario Comparison row 23) → mapped to v1.0.1 rubric: ~7/8 (Token Efficiency dim dropped, Latency recalibrated)
- **v1.0.2 score**: 7/8
- **Delta**: 0
- **Classification**: **NEUTRAL-CEILING** — cli-codex was already at high quality on S1; no fork-specific contract field is reachable from cli-codex (no MCP access), so no measurable improvement was expected from packets 003-009. This is a healthy NEUTRAL: it confirms no regression, not a missed fix.

## Narrative

cli-codex on S1 behaves identically to v1.0.1: searches with `rg`, finds the canonical spec folder, cites three on-disk anchors with specific line numbers. The intermediate `nl -ba` step to verify exact section line numbers for `decision-record.md ADR-002` is a v1.0.1-equivalent diligence pattern. Latency stays within budget (36s, well under 60s). Token output remains heavy (~293k estimate ≈ 1.17 MB stdout, dominated by the codex reasoning trace and full file dumps it pulled during verification — same artifact-bloat pattern v1.0.1 documented). The spec packet identity returned (`003-continuity-memory-runtime/004-memory-save-rewrite`) is unchanged from v1.0.1; the carve-out + renumber earlier this session moved 006-014 from 003 to 011 but left 001-005 in 003, so this path remains canonical.

Per-packet attribution: this cell exercises packets 003 (memory_context not invoked), 004 (cocoindex not invoked), 007 (intent classification N-A for cli-codex's local routing). All N-A — cli-codex's tool-set sits outside the contract surfaces these packets touched.
