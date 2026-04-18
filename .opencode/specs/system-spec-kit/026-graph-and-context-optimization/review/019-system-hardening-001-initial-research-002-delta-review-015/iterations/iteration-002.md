# Iteration 002

## Focus

Batch-audit the next P1 clusters most likely touched by phase 016/017/018 primitives: path-boundary enforcement, code-graph sibling readiness asymmetry, canonical-save freshness drift, and Unicode/NFKC sanitization.

## Actions Taken

1. Re-read the 015 source report cluster anchors in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/015-deep-review-and-remediation/review-report.md`, focusing on the path-boundary, code-graph, canonical-save, reconsolidation, and Gate 3 findings (`review-report.md:72-75`, `:116-120`, `:1164-1186`, `:1351-1384`).
2. Verified current-main implementations in `core/config.ts`, `handlers/skill-graph/scan.ts`, `shared/gate-3-classifier.ts`, `hooks/shared-provenance.ts`, `handlers/code-graph/*.ts`, `scripts/validation/continuity-freshness.ts`, and `lib/graph/graph-metadata-parser.ts`.
3. Queried post-2026-04-16 history with `git log --oneline -S <term>` for `sanitizeRecoveredPayload`, `foldUnicodeConfusablesToAscii`, `buildQueryGraphMetadata`, `derived.last_save_at`, `findScopeFilteredCandidates`, and `canonicalReadinessFromFreshness`.
4. Compared the current code-graph sibling handlers against the shared readiness contract to determine whether the 015 asymmetry findings are now eliminated or merely hidden by docs.
5. Re-checked the current `resolveDatabasePaths()` implementation against the original 015 claims instead of assuming the surrounding comment block means the boundary issues are fixed.

## Findings Batch-Audited

- `6 x P1 / code-graph sibling asymmetry cluster`  
  Classification: `ADDRESSED`  
  Addressing commits: `f253194bf7 fix(017): T-W1-CGC-03 — propagate readiness contract to 5 code-graph siblings`, `4a154c5559 fix(017): T-CGC-01 — extract lib/code-graph/readiness-contract.ts`, `175ad87c98 fix(016): M8 trust-state vocabulary expansion`  
  Current-main evidence: the sibling handlers now import the shared readiness contract instead of carrying local readiness/trust logic (`handlers/code-graph/context.ts:10,181-185`, `scan.ts:12,263`, `status.ts:8,15`, `ccc-status.ts:9,17`, `ccc-reindex.ts:10,22`, `ccc-feedback.ts:9,24`), and the runtime README now names `lib/code-graph/readiness-contract.ts` as the shared surface for query, scan, status, context, and CCC handlers (`mcp_server/README.md:534,1186`).

- `3 x P1 / canonical-save freshness + metadata drift cluster`  
  Classification: `SUPERSEDED`  
  Replacement primitive: phase 017 H-56-1 canonical-save metadata refresh plus continuity freshness validation  
  Addressing commit: `32a180bba fix(017): T-W1-CNS-05 — validate continuity freshness`  
  Current-main evidence: canonical saves are now documented to refresh `description.json.lastUpdated` and `graph-metadata.json.derived.*` on every save (`system-spec-kit/README.md:170,268,1306`), and the strict validator now compares `_memory.continuity.last_updated_at` against `graph-metadata.json.derived.last_save_at` (`continuity-freshness.ts:153-245`).

- `2 x P1 / Unicode-NFKC sanitization cluster`  
  Classification: `ADDRESSED`  
  Addressing commits: `77da3013af fix(017): T-W1-HOK-02 — extract hooks/shared-provenance.ts`, `a131c2193 fix(018): harden Unicode folding and readiness exhaustiveness`  
  Current-main evidence: recovered payload sanitization now normalizes text, strips hidden characters, folds confusables, and removes injected role/instruction lines in the shared hook helper (`hooks/shared-provenance.ts:25-96`), and the Gate 3 classifier now normalizes prompts through `foldUnicodeConfusablesToAscii()` before token matching (`shared/gate-3-classifier.ts:14-15,148-187`).

- `2 x P1 / resolveDatabasePaths boundary cluster`  
  Classification: `STILL_OPEN`  
  Current reproduction: the function comment says it uses `realpathSync` to handle symlink escapes, but the guarded path is still computed with `path.resolve(databaseDir)` (`core/config.ts:54-56`), and the exported `DATABASE_DIR` / `DATABASE_PATH` / `DB_UPDATED_FILE` constants are still captured from `const resolvedDatabasePaths = resolveDatabasePaths();` at module load (`core/config.ts:75-78`), so the "realpath-based escape check" and "late env override support" findings still reproduce on current main.

- `1 x P1 / skill_graph_scan workspace escape finding`  
  Classification: `UNVERIFIED`  
  Evidence needed: current main now rejects `skillsRoot` values outside `cwd` (`handlers/skill-graph/scan.ts:28-35`), but I did not find a matching post-2026-04-16 commit tying that guard to the 016/017/018 hardening wave, so this delta review cannot yet credit the target phases with closing it.

- `2 x P1 / validateMergeLegality + validatePostSaveFingerprint absolute-path steering findings`  
  Classification: `UNVERIFIED`  
  Evidence needed: the current validators still derive their target files through `resolveTargetPath(folder, ...)` (`spec-doc-structure.ts:634,919`), but this iteration did not re-read the helper itself or find a post-2026-04-16 commit that proves the absolute-path steering bug was closed. These two findings need a direct helper audit before they can move out of `UNVERIFIED`.

- `2 x P1 / graph-metadata key-file absolute-path extraction cluster`  
  Classification: `UNVERIFIED`  
  Evidence needed: current main clearly rejects absolute candidates and `../` escapes in both `keepKeyFile()` and `resolveKeyFileCandidate()` (`graph-metadata-parser.ts:545-558,760-770`), but I did not locate a post-2026-04-16 addressing commit in the 016/017/018 wave, so the delta review cannot yet classify these as target-wave `ADDRESSED`.

- `1 x P1 / Gate 3 prose-drift finding`  
  Classification: `SUPERSEDED`  
  Replacement primitive: machine-contract Gate 3 classifier shared across runtime docs and command entry surfaces  
  Current-main evidence: the current classifier explicitly declares itself the authoritative Gate 3 contract for `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `CODEX.md`, and spec-kit entry docs (`shared/gate-3-classifier.ts:1-15`), so the old prose-only drift is no longer the runtime source of truth.

- `1 x P1 / trigger-phrase sanitizer residual from the NFKC cluster`  
  Classification: `UNVERIFIED`  
  Evidence needed: this iteration verified hook payload sanitization and Gate 3 normalization, but did not re-audit the current trigger-phrase sanitizer path directly. That residual finding still needs a direct read of the active sanitizer implementation plus a post-2026-04-16 commit match.

## Tally Progress

- Source report baseline remains `242` deduplicated findings (`1 P0 / 114 P1 / 133 P2`).
- Audited in this iteration: `20` P1 findings.
- Cumulative audited after iteration 002: `31 / 242`.
- Iteration-2 delta: `ADDRESSED=8`, `STILL_OPEN=2`, `SUPERSEDED=4`, `UNVERIFIED=6`.
- Cumulative tally: `ADDRESSED=10`, `STILL_OPEN=2`, `SUPERSEDED=5`, `UNVERIFIED=14`.
- Remaining unaudited findings after this pass: `211`.

## Questions Answered

- `Q1` partial: the cumulative raw tally is now narrowed to `10 ADDRESSED / 2 STILL_OPEN / 5 SUPERSEDED / 14 UNVERIFIED` across the `31` findings reviewed so far.
- `Q3` partial: the code-graph sibling asymmetry cluster is genuinely closed by the 016/017 shared readiness-contract work, while the `resolveDatabasePaths()` cluster is not.
- `Q5` partial: the residual backlog is now narrower. The first confirmed current-main carryovers are the two `resolveDatabasePaths()` boundary findings; the validator path-steering and graph-metadata key-file findings remain attribution-blocked, not cleared.

## Questions Remaining

- `Q1`: `211` findings still need classification to finish the full `242`-finding delta tally.
- `Q3`: the remaining P1 backlog still needs direct audits for `resolveTargetPath()`, the trigger-phrase sanitizer, resume handlers, and any non-readiness cross-cutting drift not covered by the shared contract.
- `Q4`: the `133` P2 findings have not been sampled in this run yet.
- `Q5`: the restart backlog still cannot be finalized until the remaining path-boundary and graph-metadata residuals move from `UNVERIFIED` to either `ADDRESSED` or `STILL_OPEN`.

## Next Focus

Read `resolveTargetPath()` and the current resume-handler stack (`handlers/session-resume.ts`, `lib/resume/resume-ladder.ts`) so iteration 003 can finish the remaining path-boundary/resume P1s, then start the first P2 sample with the reconsolidation and graph-metadata residuals that already have narrowed evidence.
