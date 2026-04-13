# Iteration 020: Final stabilization / synthesis preparation

## Focus
D1/D2/D3/D4 stabilization - rebuild the canonical findings registry from all iteration files `001-019`, dedupe repeated and recheck-only entries, adversarially confirm the active P0 set, and freeze the final verdict for synthesis.

## Scorecard
- Dimensions covered: D1 Correctness, D2 Security, D3 Traceability, D4 Maintainability
- Iteration files read: 19 on disk (`001-019`)
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.00

## Inventory Basis
- `review/iterations/` is the source of truth for this final registry. The packet contains iteration files `001-019`, including the late stabilization passes in `014`-`019`.
- `deep-review-state.jsonl` is still imperfect for synthesis purposes: it duplicates runs 3 and 13 and still treats `F160`-`F163` as standalone `findingRefs` even though they are only P0 recheck aliases. This final pass therefore used the iteration markdown plus direct source rereads for adjudication.
- Repeated IDs were normalized as follows:
  - `F080` and `F081` were re-observed in iterations 009 and 013 with no severity change, so each remains one active registry row.
  - `F160`-`F163` are adversarial recheck aliases for `F020`, `F021`, `F022`, and `F060` only; they are not separate active findings.
  - `F051` folds into `F021` because both describe the same 20-vs-21 skill-count contradiction, with `F021` as the canonical top-level blocker.

## Findings

### P0 - Blocker
- None new.

### P1 - Required
- None new.

### P2 - Suggestion
- None new.

## Deduplication / Final Adjudication
- **F001** stays active. Iteration 019 re-confirmed that no same-pass graph-compounding defect exists, which leaves F001 as the only still-open ordering defect on the `analyze_request()` pipeline surface.
- **F051** is merged into **F021**. Both findings reduce to the same contract failure: packet and artifact surfaces disagree on whether the graph represents 20 or 21 skills. `F021` remains the canonical blocker because it captures the top-level contract breach; `F051` is only a phase-local duplicate expression.
- **F080** and **F081** remain active single rows. Iteration 013 re-confirmed the exact same off-band edge-weight drift first recorded in iteration 009 and did not introduce a new severity transition.
- **F160** / **F161** / **F162** / **F163** are revalidation aliases only. They confirm the stability of `F020` / `F021` / `F022` / `F060` and should not appear as standalone synthesis rows.

## Adversarial P0 Recheck
1. **F020** remains P0. The packet still says `schema_version` is always `1`, while the compiler accepts schema versions `1` and `2` and a live compiled input (`skill-advisor/graph-metadata.json`) is on schema `2`.
2. **F021** remains P0. The packet and compiled example still promise a 20-skill graph while the compiler still emits `skill_count: 21`; iteration 008 already limited the impact to artifact/contract drift rather than a live routing ghost, but the contradiction itself is still real.
3. **F022** remains P0. The packet still records the compiled graph as 1950 bytes / under 2KB, while packet-local continuity already recorded a relaxed 4KB target and the current checked-in artifact measures 4667 bytes.
4. **F060** remains P0. Phase 005 still claims a zero-match grep across the broader `011-skill-advisor-graph/` root, but `handover.md` inside that root still contains legacy non-`scripts/` `skill-advisor` paths.

## Final Findings Registry

### Active P0 registry (4)
- **F020** — **P0** — top-level packet schema-version contract is false (`schema_version` no longer "always 1"). First seen: 003. Revalidated: 017.
- **F021** — **P0** — top-level packet and compiled graph sample still claim a 20-skill graph while the live artifact publishes `skill_count: 21`. First seen: 003. Revalidated: 017.
- **F022** — **P0** — top-level packet still claims a 1950-byte / sub-2KB compiled graph even though packet-local continuity and the live artifact are far larger. First seen: 003. Revalidated: 017.
- **F060** — **P0** — Phase 005 still marks root-scope path-migration closure complete even though `handover.md` keeps forbidden legacy paths. First seen: 007. Revalidated: 017.

### Active P1 registry (17)
- **F001** — **P1** — `_apply_graph_conflict_penalty()` still runs before current-pass `passes_threshold` values are recomputed, so conflict penalties remain inert whenever non-empty conflicts are eventually defined. First seen: 001. Reconfirmed: 019.
- **F010** — **P1** — derived metadata validation accepts traversal-shaped paths outside the intended roots. First seen: 002.
- **F023** — **P1** — checklist / implementation-summary hub-skill evidence is stale against the current algorithm and artifact. First seen: 003.
- **F030** — **P1** — relation semantics are duplicated across compiler/advisor code paths instead of one source of truth. First seen: 004.
- **F040** — **P1** — validator does not enforce edge-type-specific weight bands. First seen: 005.
- **F041** — **P1** — symmetry validation ignores reciprocal weight parity. First seen: 005.
- **F050** — **P1** — Phase 001 still scopes itself as fixing all five P1 issues even though deferred P1 work remains. First seen: 006.
- **F052** — **P1** — Phase 003 still anchors provenance to a stale pre-remediation review artifact. First seen: 006.
- **F061** — **P1** — Phase 004 CHK-014 cites packet-metadata evidence files that are not actually serialized. First seen: 007.
- **F080** — **P1** — live `skill-advisor` metadata ships twenty off-band `enhances` edges at `0.8`. First seen: 009. Reconfirmed: 013.
- **F081** — **P1** — live `skill-advisor` <-> `mcp-coco-index` dependency pair is underweighted at `0.4` relative to the packet contract. First seen: 009. Reconfirmed: 013.
- **F090** — **P1** — the packet claim that three regression expectations were corrected is not traceable from preserved repository evidence. First seen: 010.
- **F110** — **P1** — health check leaves top-level `status: ok` and conflates missing vs corrupt graph failures. First seen: 012.
- **F130** — **P1** — CHK-031 freezes a stale confidence number (`0.92`) for the `mcp-code-mode` dependency pull-up example. First seen: 014.
- **F131** — **P1** — CHK-032 cites a family-affinity example prompt that no longer reproduces. First seen: 014.
- **F150** — **P1** — feature-catalog schema reference still documents schema-v1 current reality while the compiler and live corpus are schema-v2 aware. First seen: 016.
- **F170** — **P1** — the parent `tasks.md` no longer reflects packet-owned deferred and remediation work recorded by child task ledgers, so it presents a false "all work complete" execution story. First seen: 018.

### Active P2 registry (2)
- **F011** — **P2** — the advisor trusts syntactically valid but structurally malformed graph payloads too readily. First seen: 002.
- **F031** — **P2** — derived metadata uses mixed path conventions across fields, increasing authoring fragility. First seen: 004.

### Non-active / deduped registry entries
- **F051** — final severity **P1**, disposition **merged into F021**. Keep the top-level blocker (`F021`) as canonical rather than carrying a second row for the same 20-vs-21 contradiction.
- **F160** / **F161** / **F162** / **F163** — disposition **recheck aliases only** for `F020` / `F021` / `F022` / `F060`.

## Final Gate Status
- `spec_code`: **fail** — `F020`, `F021`, `F022`, and `F060` remain unresolved packet/code contradictions.
- `checklist_evidence`: **fail** — the packet still contains stale blocker-level proof points plus checklist/task-ledger drift (`F023`, `F130`, `F131`, `F170`).
- `playbook_capability`: **pass** — iterations 011 and 015 confirmed the migrated playbook commands and graph-evidence guardrails still execute against live `scripts/` surfaces.
- `feature_catalog_code`: **fail** — `F150` remains active.

## Verdict
**FAIL.** The active registry is stable enough for synthesis, but four active P0 findings remain (`F020`, `F021`, `F022`, `F060`), so release readiness stays `release-blocking`.

## Recommended Next Focus
Synthesize `review-report.md` directly from the canonical registry above and route remediation planning around four blocker lanes: schema-version contract repair, 20-vs-21 graph-count contract repair, compiled-graph size/evidence repair, and Phase 005 handover/path-migration cleanup. The remaining active P1/P2 findings can then be grouped under runtime/validator hardening, packet evidence drift, and packet-maintenance/documentation drift.
