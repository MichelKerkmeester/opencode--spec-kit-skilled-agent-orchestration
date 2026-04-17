# Iteration 5 — Cross-Cutting Clusters + P0 Recurrence Re-verification

## Dispatcher

- iteration: 5 of 7
- dispatcher: task-tool / @deep-review / claude-opus-4-7
- session_id: 2026-04-17T120827Z-016-phase017-review
- timestamp: 2026-04-17T13:15:00Z

## Files Reviewed

- `.opencode/skill/system-spec-kit/mcp_server/tests/p0-a-cross-runtime-tempdir-poisoning.vitest.ts` (full re-read)
- `.opencode/skill/system-spec-kit/mcp_server/tests/p0-b-reconsolidation-composite.vitest.ts` (full re-read)
- `.opencode/skill/system-spec-kit/mcp_server/tests/p0-d-toctou-cleanup-regression.vitest.ts` (full re-read)
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts` (full re-read)
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-integration.vitest.ts` (full re-read)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:220-300`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:484-604, 872-932`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/*/description.json` (16 sibling phase folders, timestamp sweep)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/*/graph-metadata.json` (16 sibling phase folders, timestamp sweep)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/opencode/` (glob: no files found — OpenCode hook directory does not exist)

## Investigation Thread

Iteration 5 pivoted to three cross-cutting tasks, per the iter 4 recommendation:

### A. Cluster consolidation

**Cluster A — Scope-normalization drift** (R1-P1-001 + R4-P1-001):
- Re-read `executeConflict` CAS flow in full. The guard path is: `baselineRow` + `isArchivedRow` → `capturePredecessorSnapshot` → transaction {`currentRow` → `hasScopeRetagged` → `hasPredecessorChanged` → UPDATE-guard}.
- `hasScopeRetagged` (reconsolidation.ts:918-923) uses `getOptionalString` (reconsolidation.ts:872-875) which collapses empty-string to `undefined`, then `?? null`. `normalizeScopeValue` in reconsolidation-bridge.ts:228-234 collapses empty-string to `null` directly. For all input forms tested (`undefined`, `null`, `""`, `"  "`, non-string types), the two normalizers produce semantically equivalent output.
- Conclusion: **Cluster A does NOT escalate to P0**. The 5-way duplication is a latent drift surface (P1 stands from iter 4), but the current normalizers agree on semantics. Both sides of the CAS comparison currently normalize empty → null, which means the CAS guard *does* protect against scope bypass. R1-P1-001's narrowing from iter 2 holds.

**Cluster B — Canonical-save-surface hygiene** (R3-P1-002 + R3-P2-001 + R3-P2-002 + R4-P1-002):
- Sampled all 16 sibling phase folders in `026-graph-and-context-optimization/`. Result: **0/16 have fresh `description.json.lastUpdated`**. 11/16 are stale (descr `lastUpdated` < graph `last_save_at`), 4/16 have NO `lastUpdated` field in description.json at all (007-010), and 1/16 has no graph-metadata timestamp (015). This is NOT a one-packet issue — it is a 100% miss rate across the 026 tree. Combined with R4-P1-002's finding that no auto-repair exists, this escalates from "one-packet drift" to "structural invariant violation across an entire spec tree."
- New finding this iteration: **R5-P1-001** (systemic description.json staleness across 026 tree).

**Cluster C — ASCII-only sanitization** (R2-P1-002 + R2-P2-001 + R3-P2-003):
- Already well-characterized. Checked whether other hardening layers in Phase 017 share the same ASCII-only assumption. `gate-3-classifier.ts` (iter 2 P1) + `sanitizeRecoveredPayload` (iter 2 P2) + `p0-a` regression test (iter 3 P2 reinforcement) are the three known instances. Grep for other `/^\s*(?:[a-z]+)\s*:/i` style regexes in Phase 017 added surfaces turned up no additional instances. Cluster C is bounded; no new finding.

### B. P0 attack-scenario re-verification

**P0-A test (`p0-a-cross-runtime-tempdir-poisoning.vitest.ts`)**:
- Test imports `handleClaudeStartup` (line 9) + `handleGeminiCompact` (line 11). **Zero OpenCode imports**. `.opencode/skill/system-spec-kit/mcp_server/hooks/opencode/` does not exist as a directory — there is no OpenCode-specific hook module to import. The `it()` name claim of "Claude, Gemini, and OpenCode consumers" is **factually incorrect** at the name level: OpenCode has no distinct hook module; coverage is by tmpdir-path-schema extension only, not by exercising a specific OpenCode code path. R3-P2-003 correctly flagged this but under-stated the issue — the "OpenCode coverage" is structural (schema-shared) but there is literally no OpenCode code artifact to import. This is not a new finding (R3-P2-003 stands) but is worth noting: if Claude/Gemini/OpenCode ever diverge in hook-state access (e.g., OpenCode grows its own prime/compact module), the test has zero coverage against that regression by construction.

**P0-B test (`p0-b-reconsolidation-composite.vitest.ts`)**:
- 3 independent `it()` blocks, each mapping 1:1 to B1 (CAS conflict-stale-predecessor), B2 (complement window TOCTOU), B3 (batched governed-scope read). Coverage is phase-accurate and each phase is a distinct test, not a compound. **Pass — no new finding.**

**P0-D test (`p0-d-toctou-cleanup-regression.vitest.ts`)**:
- Test uses `vi.spyOn(fs, 'openSync')` to inject a replacement-mid-read (line 89-95). The spy triggers a fresh `saveState(sessionId, freshState)` call during the `cleanStaleStates` sequence — this IS an actual race simulation, not a sequential with timing. The assertion `replacedDuringCleanup === true` at line 101 confirms the mock-driven race fired. The cleanup outcome `skipped: 1` + `reason: 'identity_changed_before_cleanup'` (lines 103-108) matches the TOCTOU mitigation contract. **Pass — no new finding.**

**P0-C coverage (graph-metadata-schema.vitest.ts + graph-metadata-integration.vitest.ts)**:
- `graph-metadata-schema.vitest.ts` has 21 tests covering the full laundering chain: malformed JSON rejection (line 210-222), schema_version drift rejection, **legacy line-based fallback** (line 225-256 — explicitly exercises the legacy regex fallback), migrated marker preservation, preserved-error chaining (line 258-273 — asserts both `current schema` AND `legacy fallback` errors present).
- `graph-metadata-integration.vitest.ts` has 6 tests covering ranking behavior: **line 140-151 proves clean graph_metadata candidates get boosted** (`expect(boosted[0]?.score).toBeGreaterThan(0.4)`), **line 153-169 proves migrated candidates get penalized** (`expect(reranked[0]?.score).toBeLessThan(0.4)`). The inversion — boost turned to penalty for migrated data — IS directly exercised by the test.
- Chain coverage is complete: malformed JSON → legacy fallback → preserved errors → migrated marker → ranking inversion. **Pass — no new finding. P0-C is well-protected.**

### C. Finding interaction effects

**R2-P1-001 (session_resume cross-session leakage) + R3-P1-002 (research folder metadata missing)**:
- R2-P1-001 finding: `getCachedSessionSummaryDecision` in session-resume can surface another session's cached summary when producer identity changes across runtimes.
- R3-P1-002 finding: research folder at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/016-foundational-runtime-deep-review/` has no `description.json` or `graph-metadata.json`.
- Interaction analysis: R2-P1-001 leaks a *cached* session summary from state file to a cross-runtime consumer. R3-P1-002 affects memory-graph discoverability of the research folder. These two surfaces do not intersect — the session-resume flow reads hook-state (tmpdir, per-session), not the packet metadata graph. No session-discovery attack is created by the combination. **No upgrade.**

**R1-P1-001 (empty-string scope CAS bypass) + R4-P1-001 (5x scope duplication) + R4-P2-002 (no exhaustiveness checks)**:
- As shown in Cluster A above, the two currently-extant scope normalizers (reconsolidation-bridge + reconsolidation lib) produce semantically equivalent output for all tested inputs. The CAS guard does protect against scope bypass in the current codepath. R4-P2-002 (no `satisfies never` / `assertNever`) affects typed-union consumers (OnIndexSkipReason, EnrichmentStepStatus, etc.) but NOT the scope-normalizer contract.
- The compound "CAS never actually protects anything" claim is **refuted by evidence**. The CAS guard works today. The P1 concern of R4-P1-001 is about future-drift sustainability, not current correctness. No upgrade.

### D. Systemic vs local: the 026-tree description.json staleness pattern

A genuinely new systemic finding surfaced during Cluster B analysis: **all 16 sibling phase folders in `026-graph-and-context-optimization/` have stale or missing `description.json.lastUpdated`**. This is not just an R3-P2-001 repeat — it is evidence that the drift R3-P2-001 observed is endemic to the entire tree, across multiple Phase NN stages, not a one-off from this packet.

- 007-010 (release-alignment-revisits, cleanup-and-audit, playbook-and-remediation, search-and-routing-tuning) have NO `lastUpdated` field at all.
- 001-006, 011-014, 016 are all stale (description `lastUpdated` older than graph `last_save_at` by ≥1 day in most cases; worst drift: 001-003 are 2 days stale).
- 015 (implementation-deep-review) has NO graph-metadata `last_save_at`.
- **0/16 folders are fresh**.

This reinforces R4-P1-002 (no auto-repair) as a **P1 structural invariant violation** that has silently persisted across multiple completed phases. Classifying this as **R5-P1-001** because (a) it is a systemic signal distinct from R3-P2-001's single-packet report, (b) it is direct evidence that the canonical-save-surface hygiene gap is not a hypothetical future risk but a present-day invariant violation across every packet in this tree, and (c) the memory-search/skill-advisor consumers that read description.json metadata are currently seeing a stale picture of every 026-tree packet.

Adversarial self-check on R5-P1-001:
- Hunter: "16/16 stale description.json across a tree is a big deal — surely this should be P0?" Evidence: it degrades memory-search ranking quality and packet-graph traversal freshness, but does not cause correctness/security failure or data loss. Consumers still get valid data, just stale data. No crash, no wrong answer. **Not P0.**
- Skeptic: "Is this really distinct from R3-P2-001 and R4-P1-002?" R3-P2-001 was a single-packet observation (P2). R4-P1-002 was a root-cause inference (P1: no mechanism exists). R5-P1-001 is the systemic consequence at scale — it proves R4-P1-002's prediction is not hypothetical. It is a separate empirical observation worth its own ID. The tree-wide miss rate of 100% is new information, not a rediscovery.
- Referee: **Keep as R5-P1-001 at P1**. Evidence-backed, distinct from prior findings, escalates the maintainability-side concern to a measurable-and-persistent correctness-of-metadata concern.

## Findings

### P0 Findings

None. Cluster analysis confirms no P0 escalation. R1-P1-001's iter 2 narrowing holds; the CAS guard works for current inputs; P0-A/B/C/D regression tests cover the attack chains adequately (P0-A's OpenCode claim is structural-coverage-only but no OpenCode code path exists to test distinctly).

### P1 Findings

1. **Systemic description.json `lastUpdated` staleness across every phase folder in `026-graph-and-context-optimization/`** — `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/description.json`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-cache-warning-hooks/description.json`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-remediation/description.json`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-agent-execution-guardrails/description.json`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/description.json`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates/description.json`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-release-alignment-revisits/description.json`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/description.json`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-playbook-and-remediation/description.json`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/description.json`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/description.json`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-command-graph-consolidation/description.json`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-advisor-phrase-booster-tailoring/description.json`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-memory-save-rewrite/description.json`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-implementation-deep-review/description.json`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review/description.json` — Every one of 16 sibling phase folders in the 026 tree has `description.json.lastUpdated` either missing (4 folders: 007, 008, 009, 010) or stale relative to `graph-metadata.json.derived.last_save_at` (11 folders: 001-006, 011-014, 016). The 015 folder has a description lastUpdated but missing graph-metadata last_save_at. Fresh count: 0/16. This is the empirical proof that R4-P1-002's prediction ("drift is structurally inevitable absent auto-repair") has already materialized across an entire spec tree silently. Memory-search and skill-advisor consumers that read `description.json` as authority for current packet state see a stale picture for every 026-tree packet. The oldest drift is 001-003 at ≥2 days stale; the freshest drift (this packet, 016) is 14 hours stale; 007-010 have no `lastUpdated` to drift from. Classified P1 because (a) it affects every packet in a whole spec tree, not a single packet, (b) it proves R4-P1-002's infrastructure gap has already caused observable degradation, and (c) it must be remediated in Phase 017 scope or permanently declared non-scope — treating it as ambient noise is not viable when canonical search surfaces depend on it.

    ```json
    {
      "type": "claim-adjudication",
      "claim": "All 16 sibling phase folders in .opencode/specs/system-spec-kit/026-graph-and-context-optimization/ have description.json.lastUpdated either missing (4 folders) or stale relative to graph-metadata.json.derived.last_save_at (11 folders) or without graph timestamp (1 folder); 0/16 are fresh. The drift predicted in R4-P1-002 has already materialized as a 100% miss rate across the 026 spec tree.",
      "evidenceRefs": [
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/description.json (2 days stale)",
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-release-alignment-revisits/description.json (no lastUpdated field)",
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-implementation-deep-review/description.json (no graph-metadata last_save_at to compare)",
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review/description.json (14h stale)",
        "16/16 sweep results documented in iteration-005 investigation thread section D"
      ],
      "counterevidenceSought": "Checked whether the 4 folders missing lastUpdated (007-010) are archived/legacy folders that might be exempt — their graph-metadata.json timestamps are 2026-04-13 (current generation) so they are not archived. Checked whether the stale folders have been intentionally frozen — git log shows active code changes in recent weeks against all of them. Checked whether memory-search consumers ignore description.json.lastUpdated in favor of graph-metadata — no, system-spec-kit SKILL.md treats both files as canonical, and graph-metadata.json.authoritativeSources explicitly cites description.json.",
      "alternativeExplanation": "The team may consider description.json.lastUpdated a reference timestamp rather than a live-state field. However, (a) no documentation declares this, (b) the field is named 'lastUpdated' not 'authoredAt' or 'createdAt', and (c) the presence of the field in some folders but not others is inconsistent with any intentional policy.",
      "finalSeverity": "P1",
      "confidence": 0.92,
      "downgradeTrigger": "If generate-context.js is amended to write description.json.lastUpdated during canonical saves and a sweep re-runs, 0/16 → 16/16 fresh resolves this. OR if CLAUDE.md / system-spec-kit SKILL.md is amended to declare description.json.lastUpdated non-authoritative, this downgrades to P3/documentation. OR if the 4 missing-field folders are demonstrated to be a separate migration gap from the 11 stale folders, split into two findings."
    }
    ```

### P2 Findings

1. **`p0-a-cross-runtime-tempdir-poisoning.vitest.ts` OpenCode coverage is zero because no OpenCode hook module exists to import** — `.opencode/skill/system-spec-kit/mcp_server/hooks/opencode/` (glob result: no files), `.opencode/skill/system-spec-kit/mcp_server/tests/p0-a-cross-runtime-tempdir-poisoning.vitest.ts:11,67,152-154` — This refines R3-P2-003 with a concrete structural observation: the test's `it()` name claims "Claude, Gemini, and OpenCode consumers" but glob for `hooks/opencode/*.ts` returns zero files. There is no distinct OpenCode hook module to import or assert against. OpenCode coverage is purely structural-by-extension (OpenCode consumers of hook-state share the same tmpdir path schema as Claude/Gemini). If OpenCode ever gains its own `hooks/opencode/session-prime.ts` module, the test will have zero coverage against it by construction — the name promise cannot be honored because the thing it promises to test does not exist. Classified P2 because the current cross-runtime tmpdir schema IS shared (so the test coverage is structurally sound for today's codebase), but the test name overclaims and the overclaim is now anchored to a real absence, not a typo. Recommended action for a future iteration: either rename the test to "Claude and Gemini consumers" + note that OpenCode inherits coverage by schema-share, OR create a minimal OpenCode hook stub so the assertion can be literal. Reinforces R3-P2-003 without re-flagging it.

    ```json
    {
      "type": "claim-adjudication",
      "claim": "The P0-A regression test names three consumers (Claude, Gemini, OpenCode) but no OpenCode hook module exists under .opencode/skill/system-spec-kit/mcp_server/hooks/opencode/, so OpenCode coverage is by schema-share only, not by explicit assertion.",
      "evidenceRefs": [
        ".opencode/skill/system-spec-kit/mcp_server/hooks/opencode/ (glob: no matches)",
        ".opencode/skill/system-spec-kit/mcp_server/tests/p0-a-cross-runtime-tempdir-poisoning.vitest.ts:9,11 (only Claude+Gemini imports)",
        ".opencode/skill/system-spec-kit/mcp_server/tests/p0-a-cross-runtime-tempdir-poisoning.vitest.ts:67 (test name claims 3 runtimes)"
      ],
      "counterevidenceSought": "Searched for any hooks/opencode/*.ts file — none. Searched for an OpenCode-specific handleStartup or handleCompact export in the shared/ directory — none. Searched the Phase 017 commit log for 'opencode/session-prime' or 'opencode/hook' — no commits match.",
      "alternativeExplanation": "The team may have intentionally decided OpenCode uses the Claude path directly (shared runtime). If documented, renaming the test would suffice. No such documentation was found in CLAUDE.md, system-spec-kit SKILL.md, or closing-pass-notes.md.",
      "finalSeverity": "P2"
    }
    ```

## Clusters

Cross-iteration mapping of related findings to root-cause themes:

### Cluster A — Scope-normalization drift
- **Members**: R1-P1-001 (empty-string scope CAS bypass, iter 2 narrowed to P2-ish), R4-P1-001 (5-way scope normalizer duplication).
- **Root cause**: canonical `normalizeScopeContext` under-adopted; four disconnected local normalizers reinvented in reconsolidation-bridge, lineage-state, types.ts, preflight.
- **Current exposure**: **None** — iter 5 verified that the two extant normalizers (`normalizeScopeValue` in reconsolidation-bridge + `getOptionalString` in reconsolidation lib) produce semantically equivalent output for all tested inputs (undefined, null, empty, whitespace, non-string). CAS guard protects correctly.
- **Future exposure**: latent. Any future author who modifies one of the 5 normalizers without the others re-introduces R1-P1-001-class drift.
- **Recommended synthesis action**: collapse 4 reinvented normalizers to imports of `normalizeScopeContext`; classify as P1 maintainability with correctness implications.

### Cluster B — Canonical-save-surface hygiene
- **Members**: R3-P1-002 (research folder missing description.json + graph-metadata.json), R3-P2-001 (single-packet description.json stale), R3-P2-002 (95% malformed checklist evidence-marker closures), R4-P1-002 (no auto-repair infrastructure for description.json), R5-P1-001 (16/16 sibling 026 folders stale or missing lastUpdated).
- **Root cause**: canonical-save pipeline is not self-healing. `generate-context.js` never writes `description.json.lastUpdated`; git has no hooks; no linter validates evidence markers; manual-dispatch saves produce deep-research artifacts but not packet metadata files.
- **Current exposure**: **Severe and measurable** — 0/16 folders fresh, 4/16 missing field entirely, research folder missing both required files, 95% of evidence markers malformed.
- **Recommended synthesis action**: single synthesized P1 remediation bundle (a) amend `generate-context.js` to write description.json.lastUpdated, (b) add packet-metadata backfill for research folders, (c) add evidence-marker lint to spec validation, (d) re-run canonical save across all 016/026 folders after (a)-(c) land.

### Cluster C — ASCII-only sanitization
- **Members**: R2-P1-002 (gate-3-classifier no unicode/NFKC contract), R2-P2-001 (sanitizeRecoveredPayload ASCII-only regex), R3-P2-003 (p0-a test OpenCode overclaim — reinforcing evidence for ASCII-only test coverage), iter 5 refinement R5-P2-001 (OpenCode hook module does not exist, so cross-runtime claim is structural-only).
- **Root cause**: multiple Phase 017 string-matching surfaces share the ASCII-only assumption without a shared character-set contract. No `.normalize('NFKC')` applied anywhere in the Phase 017 sanitizer/classifier chain.
- **Current exposure**: same-UID homoglyph injection requires attacker-writable hook-state file (bounded by 0o600 perms). Cross-runtime OpenCode test coverage is structural-by-schema-share (bounded by "no OpenCode hook module exists yet to test").
- **Recommended synthesis action**: document the ASCII-only character-set contract explicitly in `gate-3-classifier.ts`, `sanitizeRecoveredPayload`, and `p0-a` test header; or introduce NFKC normalization layer; classify as P1 (contract gap, not bug).

### P0 attack-scenario re-verification summary
- **P0-A**: test covers Claude + Gemini explicitly; OpenCode is structural-share coverage only (cluster C). Attack-scenario block is genuine. **Pass with test-name caveat**.
- **P0-B**: 3 `it()` blocks map 1:1 to B1/B2/B3 phases, each an independent test. **Pass**.
- **P0-C**: graph-metadata-schema covers malformed JSON + legacy fallback + preserved errors + migrated marker; graph-metadata-integration covers ranking-inversion (boost→penalty for migrated data). **Pass**.
- **P0-D**: test actually races two concurrent writers via `fs.openSync` spy that triggers a mid-cleanup `saveState` call. **Pass**.

## Traceability Checks

- **Cluster consolidation**: pass — A, B, C clusters mapped to root-cause themes; 1 new P1 (R5-P1-001) and 1 new P2 (R5-P2-001) surface from Cluster B and Cluster C analysis.
- **P0-A attack re-verification**: partial — test covers Claude + Gemini explicitly; OpenCode coverage is structural-only because no OpenCode hook module exists.
- **P0-B attack re-verification**: pass — 3 phase-specific tests confirmed.
- **P0-C attack re-verification**: pass — full laundering chain covered (malformed → legacy fallback → preserved errors → ranking inversion).
- **P0-D attack re-verification**: pass — real race simulation via fs.openSync spy.
- **Finding interaction effects**: pass — no compound finding escalates. R1-P1-001 + R4-P1-001 does NOT create "CAS never protects"; R2-P1-001 + R3-P1-002 surfaces do not intersect.
- **Systemic vs local for description.json drift**: fail — 16/16 folders stale/missing; previously-single-packet finding is tree-wide.

## Confirmed-Clean Surfaces

- **P0-B test structure** (3 independent it() blocks, 1:1 phase mapping).
- **P0-C test coverage** (schema + integration, full laundering chain, ranking inversion asserted).
- **P0-D test is a real race** (fs.openSync spy triggers mid-cleanup write; not sequential-with-timing).
- **Cluster A scope-normalizer semantic equivalence** — `normalizeScopeValue` and `getOptionalString` produce the same output for all tested empty/whitespace/non-string inputs; current CAS guard is not bypassed.
- **Finding interaction effects** — no compound P1 escalates to P0; no cross-finding amplification observed.

## Confirmed Already-Known (cross-reference)

- **R1-P1-001** — verified current normalizers equivalent; iter 2 narrowing holds; future-drift risk is exactly R4-P1-001's concern. No change.
- **R3-P1-002** — research-folder missing metadata; still P1; now cluster-member with R5-P1-001 (systemic).
- **R3-P2-001** — single-packet drift; now escalated via R5-P1-001 (tree-wide evidence).
- **R3-P2-003** — p0-a OpenCode overclaim; refined via R5-P2-001 (structural observation: no OpenCode hook module exists).
- **R4-P1-002** — no auto-repair infrastructure; P1 confirmed materialized via R5-P1-001 (100% staleness evidence).

## Convergence Signal

- Novel findings this iteration: 2 (1 P1, 1 P2).
- Severity-weighted new findings: (1 × 5.0) + (1 × 1.0) = 6.0.
- Cumulative severity-weighted total (iter 1 + iter 2 + iter 3 + iter 4 + iter 5): 13.0 + 13.0 + 13.0 + 14.0 + 6.0 = 59.0.
- newFindingsRatio = 6.0 / 59.0 = **0.102**.
- No P0 override (no new P0 this iteration; cluster analysis refuted compound P0 candidates).
- Convergence trend: iter 1 (1.00) → iter 2 (0.50) → iter 3 (0.333) → iter 4 (0.264) → iter 5 (**0.102**). **Just above the 0.10 convergence threshold**. Sharp deceleration consistent with cross-reference iteration producing fewer net-new findings.
- Overlap with prior iterations: R5-P1-001 is a cluster-B systemic escalation — it is strictly new evidence (tree-wide sweep, not rediscovered) but it amplifies R4-P1-002's infrastructure gap. R5-P2-001 is a refinement of R3-P2-003 with concrete structural detail (no OpenCode hook module exists) but was classified as refined-P2 not fully-new; counted at P2 weight.
- ruledOut this iteration: ["Cluster A escalation to P0 (refuted — CAS guard works for current inputs)", "Cluster B is a one-packet issue (refuted — systemic 16/16)", "Cluster C has additional undiscovered members (bounded — no new surfaces found)", "R2-P1-001 + R3-P1-002 compound (refuted — surfaces do not intersect)", "R1-P1-001 + R4-P1-001 + R4-P2-002 compound P0 (refuted — typed-union exhaustiveness is orthogonal to scope-normalizer)", "P0-B sequential-test-not-race suspicion (refuted — 3 independent it() blocks, distinct phase coverage)", "P0-D timing-only-test suspicion (refuted — fs.openSync spy is a real race mock)", "P0-C coverage gap in ranking inversion (refuted — graph-metadata-integration test asserts both boost and penalty)"]

## Next Iteration Angle

Iteration 6 should pivot to **RECOVERY / final sweep**:

1. Re-check confirmed-clean surfaces from iter 1-4 with cross-iteration synthesis in mind — did any "clean" finding get amplified by later iterations?
2. Verify no P0 was hidden in the 5 iterations of "no new P0" claim. Specifically re-examine:
   - `runPostInsertEnrichment` god function (iter 4 P2 #1) — does any of its 5 domains have a hidden correctness bug under the try/catch veneer?
   - `executeConflict` duplicate transaction blocks (iter 4 P2 #3) — do both branches actually implement the same checks, or is there a drift already?
   - CP-001 (context.ts readiness fail-open) and CP-003 (entity-linker whole-corpus) — iter 3 confirmed still OPEN; iter 6 should re-examine whether they should upgrade to P0 or P1 given cumulative evidence.
3. Examine `graph-metadata-integration.vitest.ts:140-151` and confirm the boost/penalty deltas match `stage1-candidate-gen.ts` production values (not just "greater than" / "less than").
4. Sample the remaining 9 focus files not yet read: response-builder.ts, opencode-transport.ts, checkpoints.ts, memory-search.ts, skill_graph_compiler.py, spec_kit_plan_auto.yaml, spec_kit_complete_auto.yaml, spec_kit_deep-research_auto.yaml, spec_kit_plan_confirm.yaml.

Iteration 7 is the **synthesis pass** producing the final report with consolidated clusters + recommendations.

## Assessment

- Iteration 5 achieved its primary goal: **convergence signal 0.102, just above the 0.10 threshold**. Cluster analysis confirmed that prior iterations found the full set of latent concerns; new findings are overwhelmingly refinements and systemic amplifications, not wholly new categories.
- **Single critical discovery**: R5-P1-001 elevates the "canonical-save-surface hygiene" theme from "one-packet drift" to "tree-wide invariant violation." The 16/16 miss rate is the empirical proof that R4-P1-002's infrastructure gap is not a future-risk prediction but a present-day observed failure across every packet in the 026 tree.
- **Zero P0 escalations**: all cluster compounds were refuted with evidence. The CAS guard works. P0 regression tests adequately cover their respective attack chains. No hidden P0 emerged from cross-reference.
- **Remaining risk profile** after iter 5:
  - 0 P0 findings
  - 9 P1 findings: R1-P1-001 (narrowed-P2-or-P1), R1-P1-002, R2-P1-001, R2-P1-002, R3-P1-001, R3-P1-002, R4-P1-001, R4-P1-002, R5-P1-001
  - 17 P2 findings accumulated across iter 1-5
- **Cluster B is the single largest remediation surface**: R3-P1-002 + R3-P2-001 + R3-P2-002 + R4-P1-002 + R5-P1-001 share root cause (no auto-repair; manual-dispatch path bypasses `generate-context.js`). Recommending a single Phase 017 follow-on to address all five together.
- Preparing for iter 6 recovery sweep and iter 7 synthesis.
