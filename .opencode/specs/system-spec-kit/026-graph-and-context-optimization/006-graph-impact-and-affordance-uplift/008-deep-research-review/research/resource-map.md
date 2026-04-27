---
title: "Resource Map: 008-deep-research-review"
description: "Provenance ledger mapping each finding D1-D18 to the files, lines, and tests that prove or disprove it."
trigger_phrases:
  - "008 resource map"
  - "010 deep-research resource map"
importance_tier: "important"
contextType: "reference"
---
# Resource Map — 008-deep-research-review

This document maps every finding from the 10-iteration deep-research review to the files, line ranges, and tests that prove or disprove it. Use as the canonical lookup when triaging the findings into the recommended `010/008` and `010/009` follow-up sub-phases.

---

## D1 — `detect_changes` mixed-header path-containment bypass (P1)

| Path | Lines | Role |
|---|---|---|
| `mcp_server/code_graph/handlers/detect-changes.ts` | 118-124 | Comment declares diff paths untrusted; states `../../etc/passwd` and absolute `/etc/passwd` must be refused |
| `mcp_server/code_graph/handlers/detect-changes.ts` | 141-156 | `resolveCandidatePath` validates only the chosen path; pre-image path skipped |
| `mcp_server/code_graph/tests/detect-changes.test.ts` | 185-196 | Existing both-side-escape test |
| `mcp_server/code_graph/tests/detect-changes.test.ts` | 175-230 | 011-added adversarial suite — does NOT cover mixed-header case |

**Fix targets:** `resolveCandidatePath` to validate both `oldPath` and `newPath` independently (skip only `/dev/null`); add 2 mixed-header regression tests.

---

## D2 — Diff path byte-safety contract (P2 DEFER)

| Path | Lines | Role |
|---|---|---|
| `mcp_server/code_graph/handlers/detect-changes.ts` | 143-156 | Path normalization+containment, no character-class validation |
| `mcp_server/code_graph/lib/diff-parser.ts` | 171-182 | Header paths trimmed + git-prefix-stripped, no character validation |
| `mcp_server/code_graph/tests/detect-changes.test.ts` | 175-230 | No NUL/control/backslash/long-path coverage |

---

## D3 — phase-runner exported-API runtime key validation (P2 DEFER)

| Path | Lines | Role |
|---|---|---|
| `mcp_server/code_graph/lib/phase-runner.ts` | 31-35 | TS-only field types (erased at runtime) |
| `mcp_server/code_graph/lib/phase-runner.ts` | 69-71 | `outputKey` returns `phase.output ?? phase.name` without runtime check |
| `mcp_server/code_graph/lib/phase-runner.ts` | 103-115 | duplicate-output check uses raw key |
| `mcp_server/code_graph/lib/phase-runner.ts` | 233-235 | output map write uses `outputs[outputKey(phase)]` |

---

## D4 — phase-runner duplicate-output regression test (P2 ADOPT 010/009)

| Path | Lines | Role |
|---|---|---|
| `mcp_server/code_graph/lib/phase-runner.ts` | 97-115 | duplicate-output rejection implemented |
| `mcp_server/code_graph/lib/phase-runner.ts` | 117-134 | output/name collision rejection implemented |
| `mcp_server/code_graph/tests/phase-runner.test.ts` | 38-54 | Only duplicate phase NAMES tested |
| `mcp_server/code_graph/tests/phase-runner.test.ts` | 98-105, 172-180 | Custom output keys tested only on accepted path |

**Fix targets:** Add 2 tests — duplicate output keys + output/name collision rejection.

---

## D5 — 010/001 license docs stale claims (P2 ADOPT 010/008)

| Path | Lines | Role |
|---|---|---|
| `010/007-review-remediation/spec.md` | ~95 | Claims LICENSE quote resolved by scrub |
| `010/001-clean-room-license-audit/spec.md` | 85-88 | Original spec still requires reading + quoting `external/LICENSE` |
| `010/001-clean-room-license-audit/decision-record.md` | 45-85 | ADR labels canonical PolyForm block as "verbatim", references Yoyodyne example |
| `010/001-clean-room-license-audit/implementation-summary.md` | 46-48 | Adds post-scrub caveat |
| `001-research-and-baseline/007-external-project/external/LICENSE` | 17-22 | Actual notice line |

---

## D6 — Hunk completeness + rename/copy diff handling (P2 DEFER)

| Path | Lines | Role |
|---|---|---|
| `mcp_server/code_graph/lib/diff-parser.ts` | 109-220 | Per-side counters bound greed but don't validate hunk completeness |
| `mcp_server/code_graph/lib/diff-parser.ts` | (rename detection) | Rename/copy headers fall through to misparse |

---

## D7 — Malformed metadata JSON / sanitizer call-site coverage (P2 ADOPT 010/008)

| Path | Lines | Role |
|---|---|---|
| `mcp_server/code_graph/lib/code-graph-db.ts` | 778-805 | `sanitizeEdgeMetadataString` + `rowToEdge` JSON parse path |
| `mcp_server/code_graph/handlers/query.ts` | ~614-635 | `edgeMetadataOutput` site (re-validates) |
| `mcp_server/code_graph/lib/code-graph-context.ts` | ~287-320 | `formatContextEdge` site |
| `mcp_server/code_graph/tests/edge-metadata-sanitize.test.ts` | All 8 cases | Tests sanitizer fn directly; does NOT assert all 3 call sites invoke it |

---

## D8 — R-007-P2-4 `limit + 1` overflow detection (P2 ADOPT 010/008)

| Path | Lines | Role |
|---|---|---|
| `010/007-review-remediation/implementation-summary.md` | T-F R-007-P2-4 row | Claims `limit + 1` SQL request mechanism |
| `mcp_server/code_graph/handlers/query.ts` | ~859-897 | `computeBlastRadius` SQL/traversal — actual mechanism does not match documented `limit + 1` |
| `mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts` | (overflow tests) | Tests do not pin the mechanism |

**Decision needed:** wire true `limit + 1` SQL request, OR correct doc to describe actual mechanism.

---

## D9 — `riskLevel` depth-one count 10 undocumented (P2 ADOPT 010/008)

| Path | Lines | Role |
|---|---|---|
| `mcp_server/code_graph/handlers/query.ts` | (riskLevel derivation) | Hard-coded threshold count of 10 |
| `010/003/spec.md` + `implementation-summary.md` | (riskLevel section) | Threshold count not documented |
| `manual_testing_playbook/06--analysis/026-...md` | (Block A) | Threshold not stated |

---

## D10 — failureFallback.code + minConfidence handler tests (P2 ADOPT 010/009)

| Path | Lines | Role |
|---|---|---|
| `mcp_server/code_graph/handlers/query.ts` | 1121-1135 + sites for 5 codes | All 5 codes implemented in code |
| `mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts` | (existing) | 4/5 codes tested; minConfidence schema-tested only |
| `mcp_server/tests/tool-input-schema.vitest.ts` | (boundary cases) | Schema validation tests for `minConfidence` 0/1 boundaries |

---

## D11 — Obfuscated prompt-injection variants (P2 ADAPT)

| Path | Lines | Role |
|---|---|---|
| `mcp_server/skill_advisor/lib/affordance-normalizer.ts` | 59-73 | Denylist (TS) — synonyms / direction / role markers |
| `mcp_server/skill_advisor/scripts/skill_graph_compiler.py` | 78-101 | Denylist (PY) |
| `mcp_server/skill_advisor/tests/__shared__/affordance-injection-fixtures.json` | All entries | 28 injection / 11 benign / 4 privacy phrases |

---

## D12 — `conflicts_with` reject TS/PY parity (P2 ADOPT 010/008)

| Path | Lines | Role |
|---|---|---|
| `mcp_server/skill_advisor/scripts/skill_graph_compiler.py` | 45-78 | `AFFORDANCE_RELATION_FIELDS` excludes `conflicts_with` |
| `mcp_server/skill_advisor/scripts/skill_graph_compiler.py` | (validate_derived_affordances) | Reserved-field rejection (Python only) |
| `mcp_server/skill_advisor/lib/affordance-normalizer.ts` | (TS normalize) | Does NOT enforce `conflicts_with` rejection |
| `mcp_server/skill_advisor/tests/python/test_skill_advisor.py` | (R-007-8 test) | Python-only |
| `manual_testing_playbook/11--scoring-and-calibration/199-...md` | (claim) | Implies parity but TS coverage absent |

---

## D13 — Debug counter value tests + `dropped_unsafe` permanently zero (P2 ADAPT 010/008)

| Path | Lines | Role |
|---|---|---|
| `mcp_server/skill_advisor/lib/affordance-normalizer.ts` | 153-157 | Counter declaration + reset/getter |
| `mcp_server/skill_advisor/scripts/skill_graph_compiler.py` | 407 | Python counter dict |
| (no value tests) | — | Counters not value-tested |

---

## D14 — Trust-badge partial overlay + age boundary tests (P2 ADOPT 010/009)

| Path | Lines | Role |
|---|---|---|
| `mcp_server/formatters/search-results.ts` | 235-360 | Merge-per-field + sanitizeAgeLabel |
| `mcp_server/tests/memory/trust-badges.test.ts` | 91, 166, 178 | No partial overlay test; no age boundary cases |

---

## D15 — R-007-13 SQL test count claim (P2 ADOPT 010/008)

| Path | Lines | Role |
|---|---|---|
| `010/007-review-remediation/implementation-summary.md` | (T-E section) | Claims "3/3 SQL pipeline tests pass" |
| `mcp_server/tests/memory/trust-badges.test.ts` | 115, 150, 167 | Actually 2 SQL + 1 formatter pass-through |

---

## D16 — Tool-count canonicalization sweep (P2 ADOPT 010/008)

| Path | Lines | Role |
|---|---|---|
| `mcp_server/tool-schemas.ts` | TOOL_DEFINITIONS | Canonical = 51 |
| `README.md` (root) | 7, 56, 1261, 1281, 1301, 677 | Synced to 51/60 |
| `.opencode/skill/system-spec-kit/SKILL.md` | (drift) | Still claims 48/47 in places |
| `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | (drift) | Still claims 43 |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | (detail section) | Omits 11 of 51 entries |
| `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md` | (command-surface paragraph) | Still says 43 |

---

## D17 — R-007-12 cache-key end-to-end test (P2 ADOPT 010/009)

| Path | Lines | Role |
|---|---|---|
| `mcp_server/lib/storage/causal-edges.ts` | 159-171 | Generation counter |
| `mcp_server/lib/search/search-utils.ts` | (CacheArgsInput) | Generation gated by enableCausalBoost |
| `mcp_server/handlers/memory-search.ts` | (read+thread) | Generation read site |
| `mcp_server/tests/causal-edges-unit.vitest.ts` | (R-007-12 cases × 6) | Tests counter increments only — not cache-key change at memory_search level |

---

## D18 — Fixture corpus near-duplicate pairs (P2 DEFER)

| Path | Lines | Role |
|---|---|---|
| `mcp_server/scripts/tests/fixtures/manual-playbook-fixture.ts` | (graph-rollout-diagnostics + checkpoint-rollback corpus) | Differentiated in 011, but other pairs may still trip 92% threshold |

---

## Summary table — distinct findings by owner

| Owner | Distinct findings |
|---|---|
| `010/008-closure-integrity-and-pathfix-remediation` | D1, D5, D7, D8, D9, D12, D13, D15, D16 (9) |
| `010/009-test-rig-adversarial-coverage` | D4, D10, D14, D17 (4) |
| Future hardening | D2, D3, D6, D11 (4) |
| Polish backlog | D18 (1) |

**Total: 18 distinct findings.**
