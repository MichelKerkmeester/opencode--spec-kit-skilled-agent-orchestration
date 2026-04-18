# Iteration 009

## Focus

Q8: Wave-D deferred P2 coupling risk (`R55-P2-002/003/004`). Inspect whether the deferred helper/DRY/YAML-evolution items are still truly isolated, or whether any now couple directly to the Copilot/Phase-019 hardening gaps uncovered here.

## Actions Taken

1. Read the active deep-loop context in `deep-research-strategy.md`, `findings-registry.json`, and `iterations/iteration-008.md` to anchor the question against the already-confirmed Copilot gaps.
2. Read the parent Phase 017 remediation packet in `016-foundational-runtime/spec.md` plus the Wave D child packet in `004-p2-maintainability/spec.md`, `implementation-summary.md`, and `graph-metadata.json` to confirm what was intentionally deferred versus what Wave D actually shipped.
3. Read the live Phase 019 contract in `017-cli-runtime-executors/002-runtime-matrix/spec.md`, `decision-record.md`, `implementation-summary.md`, `spec_kit_deep-research_auto.yaml`, and `tests/deep-loop/cli-matrix.vitest.ts` to verify which Copilot hardening gaps are still active in checked-in code.
4. Read the current implementation surfaces behind the deferred items in `mcp_server/lib/scoring/importance-tiers.ts`, `mcp_server/lib/parsing/memory-parser.ts`, and `mcp_server/lib/storage/reconsolidation.ts` to determine whether the parking-lot items would force edits in the same runtime paths as the Phase 019 follow-up work.

## Findings

### P1. `R55-P2-004` is no longer fully isolated: the broader YAML-evolution parking-lot now overlaps the same command-asset family as the unresolved Copilot prompt-size hardening gap

Reproduction path:
- Read `004-p2-maintainability/spec.md` and note Q-D-03 plus the parking-lot entry for `R55-P2-004`.
- Read `017-cli-runtime-executors/002-runtime-matrix/spec.md` REQ-010 / edge cases and `decision-record.md` ADR-008.
- Read `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` and `tests/deep-loop/cli-matrix.vitest.ts`.

Evidence:
- Wave D explicitly scoped the CP-004 fix to one call site and left the "broader migration" of prose `when:` cleanup as `R55-P2-004` parking-lot work.
- Phase 019 simultaneously documents a Copilot `@path` fallback as the mitigation for large prompts, but the shipped deep-research branch still uses only `copilot -p "$(cat ...)"`, and the matrix test mirrors only that positional shape.
- Both concerns live in the command/YAML asset layer rather than the memory-storage or parser layer.

Why this matters:
- `R55-P2-004` is still logically maintainability work, but it is no longer operationally isolated from Phase 019 follow-up. A broad YAML-evolution sweep performed together with the Copilot `@path` fix would expand the same change surface, same validation surface, and same review burden.
- The coupling is strongest at the file-family level, not because YAML evolution caused the Copilot bug, but because the unresolved Copilot hardening work now needs edits in the exact command-dispatch layer that `R55-P2-004` wants to normalize.

Risk-ranked remediation candidates:
- P1: keep the Copilot `@path` fallback / prompt-size hardening as a narrowly scoped fix in the deep-loop YAMLs and tests first.
- P2: treat `R55-P2-004` as a separate follow-on cleanup across command assets after the Copilot branch is hardened and re-verified.

### P2. `R55-P2-002` still looks isolated from the Phase 019 Copilot gaps; it is parser/scoring metadata hygiene, not executor hardening

Reproduction path:
- Read `004-p2-maintainability/spec.md` parking-lot note for `R55-P2-002`.
- Read `mcp_server/lib/scoring/importance-tiers.ts`.
- Read `mcp_server/lib/parsing/memory-parser.ts`.

Evidence:
- The deferred item is described as an "underused `importance-tier` helper" with inline duplicates left untouched.
- The canonical helper that is still actively used today is `getDefaultTierForDocumentType()` in `importance-tiers.ts`, consumed by `memory-parser.ts` during memory parsing/defaulting.
- None of the active Copilot hardening gaps from Iteration 008 live in this tier/defaulting path; they live in runtime capability docs, executor dispatch YAMLs, and CLI preflight/audit constraints.

Why this matters:
- Carrying `R55-P2-002` into Phase 019 would widen the metadata/save review surface, but it would not close the known Copilot gaps faster and would not reduce their failure modes.
- This remains a low-coupling maintainability item unless a future phase simultaneously rewrites save-time metadata normalization.

Risk-ranked remediation candidates:
- P2: leave `R55-P2-002` deferred unless a save-path refactor is already opening the same parser/scoring files for another reason.
- P3: when it is eventually addressed, batch it with other memory-tier normalization cleanups rather than executor/runtime work.

### P2. `R55-P2-003` also remains largely isolated: `executeConflict` DRY work lives in reconsolidation/storage code, not the Phase 019 executor matrix

Reproduction path:
- Read `004-p2-maintainability/spec.md` parking-lot note for `R55-P2-003`.
- Read `mcp_server/lib/storage/reconsolidation.ts` around `executeConflict()`.
- Compare with `017-cli-runtime-executors/002-runtime-matrix/implementation-summary.md` "Files Touched" and the deep-loop YAML branches.

Evidence:
- The deferred item is explicitly framed as an `executeConflict` precondition-block DRY opportunity.
- `executeConflict()` is in `reconsolidation.ts` and duplicates the two transaction modes around `executeAtomicReconsolidationTxn(...)`; this is save/reconsolidation internals.
- Phase 019's shipped surfaces are executor config, deep-loop YAML dispatch branches, skill docs, and CLI matrix tests. They do not touch reconsolidation/storage code.

Why this matters:
- `R55-P2-003` shares the broader "save system" neighborhood with other Phase 017 work, but it does not materially couple to the current Copilot hardening debt.
- The main risk of dragging it into Phase 019 is opportunistic scope creep, not hidden runtime dependency.

Risk-ranked remediation candidates:
- P2: keep `R55-P2-003` out of a Copilot hardening packet unless a separate reconsolidation bug or correctness concern reopens `reconsolidation.ts`.
- P3: if revisited, pair it with save-path regression tests, not deep-loop executor validation.

## Questions Answered

- Q8. What's the coupling risk of Wave-D deferred P2 items (`R55-P2-002/003/004`) being carried forward into Phase 019?
  Mostly answered. The three deferred items are not equally coupled:
  - `R55-P2-004` now has meaningful coupling because the unresolved Copilot `@path` fallback work and the broader YAML-evolution cleanup both want the same command-asset family.
  - `R55-P2-002` remains low-coupling parser/scoring metadata hygiene.
  - `R55-P2-003` remains low-coupling reconsolidation/storage DRY cleanup.
  The practical takeaway is that only the YAML-evolution parking-lot item should be considered "adjacent risk" to Phase 019 hardening, and even there the safer move is sequencing, not bundling.

## Questions Remaining

- Should the Copilot prompt-size hardening packet explicitly mark `R55-P2-004` as "blocked pending hardening merge" so future YAML cleanup does not silently piggyback on the same review?
- Is there any other checked-in command asset outside the deep-loop YAML quartet where a prose-`when:` cleanup would materially affect executor behavior, or is the remaining `R55-P2-004` surface broader in theory than in practice?

## Next Focus

Q9: Evidence-marker bracket-depth lint false positives. Inspect whether nested fences, mismatched code blocks, or delimiter-heavy prose can trigger false positives in the current marker-depth checks.
