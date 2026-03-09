# QA10-C20 Remediation Plan

Source basis: `audit-QA10-O19-reconciliation.md` is treated as the authority for which findings are confirmed, while `audit-QA10-O18-opus-synthesis.md` supplies the most concrete fix notes and line-level context. Ordering is P0 first, then P1 fixes biased toward highest impact per unit effort, with one confirmed P2 hardening item reserved for Sprint 3.

## Sprint 1 — P0 + quick P1 wins

### 1. O08-P0-1 / C03-P0-1 — ConversationCapture/OpencodeCapture field-name mismatch
- **Description:** Snake_case `ConversationCapture` fields do not align with camelCase consumer expectations, causing silent loss of session title/id/capture timestamp data.
- **Files / lines:** `opencode-capture.ts:79-95`; consumer touchpoints noted in `data-loader.ts:160` and `input-normalizer.ts:527-528`.
- **Specific fix recommendation:** Normalize the contract in one place: either rename the exported capture interface to camelCase fields or add an explicit mapping layer before any consumer reads the object; then remove the unsafe cast path that currently hides the mismatch.
- **Effort:** M
- **Risk of regression:** Medium — this changes a core ingest boundary used by downstream stateless-mode transforms.
- **Dependencies:** None; do this before the other `opencode-capture.ts` fixes.

### 2. O17-P1-3 / C01-P0-1 — Git enrichment leaks cross-spec data
- **Description:** Git status/log/diff enrichment runs at repository scope and can inject unrelated files and commits into the target spec's memory output.
- **Files / lines:** `git-context-extractor.ts:117-187`; `workflow.ts:496-520`.
- **Specific fix recommendation:** Thread `specFolderHint` into `extractGitContext(...)`, filter git status/log/diff candidates to the target spec path (or its derived keywords), and refuse enrichment when no scoped match remains.
- **Effort:** M
- **Risk of regression:** Medium — scoping bugs could hide legitimate git evidence if filtering is too aggressive.
- **Dependencies:** Best done before contamination-filter and git-error-handling changes in the same extractor.

### 3. O03-P1-01 / C03-P1-2 — `SPEC_FOLDER` silently dropped during normalization
- **Description:** The normalizer accepts camelCase `specFolder` but drops uppercase `SPEC_FOLDER`, which creates inconsistent ingestion from upstream producers.
- **Files / lines:** `input-normalizer.ts:233-235`.
- **Specific fix recommendation:** Map `data.SPEC_FOLDER` into the same normalized field path as `data.specFolder`, with a deterministic precedence rule when both are present.
- **Effort:** S
- **Risk of regression:** Low — localized mapping fix with clear expected behavior.
- **Dependencies:** None.

### 4. O02-P2-04 / C02-P1-1 — `continuationCount || 1` corrupts valid zero values
- **Description:** A legitimate `0` continuation count is coerced to `1`, silently changing session numbering.
- **Files / lines:** `collect-session-data.ts:580`.
- **Specific fix recommendation:** Replace `continuationCount || 1` with `continuationCount ?? 1` and add a regression test that exercises `0`, `undefined`, and positive counts.
- **Effort:** S
- **Risk of regression:** Low.
- **Dependencies:** None.

### 5. O02-P1-01 — Learning-weight coefficients are swapped
- **Description:** The learning index formula multiplies uncertainty delta by the context weight and context delta by the uncertainty weight.
- **Files / lines:** `collect-session-data.ts:201-204`.
- **Specific fix recommendation:** Swap the terms so uncertainty uses `CONFIG.LEARNING_WEIGHTS.uncertainty` and context uses `CONFIG.LEARNING_WEIGHTS.context`; keep the formula shape otherwise unchanged.
- **Effort:** S
- **Risk of regression:** Low — formula correction, but existing snapshots/tests may need re-baselining.
- **Dependencies:** None.

### 6. O10-P1-03 / C10-P1-2 — Anchor IDs are non-deterministic
- **Description:** `Date.now()` is part of the hash input, so identical decision content generates different anchor IDs on each run.
- **Files / lines:** `anchor-generator.ts:94`; `decision-extractor.ts:152,365-368`.
- **Specific fix recommendation:** Remove `Date.now()` from the hash seed and replace it with deterministic context (for example spec folder + section title + stable decision index) so reruns are idempotent.
- **Effort:** S
- **Risk of regression:** Medium — changing IDs can affect existing anchor references and dedup behavior.
- **Dependencies:** None, but pair with a regression test for repeated runs over identical input.

### 7. C04-P1-2 / O04-implicit — Git actions are not normalized in file extraction
- **Description:** `normalizeFileAction` misses common git action labels such as `add`, `modify`, and `delete`, leading to incomplete action attribution.
- **Files / lines:** `file-extractor.ts:76-86`.
- **Specific fix recommendation:** Extend the action mapping table to normalize git-originated verbs into the canonical file-action enum used by the rest of the extractor.
- **Effort:** S
- **Risk of regression:** Low.
- **Dependencies:** None.

### 8. O11-P1-1 / C11-P1-1 — `learningWeights` config is never validated
- **Description:** The config loader validates outer objects but not the `learningWeights` sub-object, so malformed weights can reach runtime math.
- **Files / lines:** `config.ts:162-167,210,252`.
- **Specific fix recommendation:** Validate presence, type, and numeric bounds for `knowledge`, `context`, and `uncertainty`; fail fast on malformed configs instead of accepting partial objects.
- **Effort:** S
- **Risk of regression:** Low to Medium — invalid existing configs will start failing loudly.
- **Dependencies:** None; complementary to the learning-weight swap fix.

### 9. O10-P1-01 / C10-P2-1 — Decision confidence is not clamped
- **Description:** Regex-derived confidence can exceed 100, creating invalid downstream scoring.
- **Files / lines:** `decision-extractor.ts:262`.
- **Specific fix recommendation:** Clamp the computed confidence to an allowed range (for example `0..100`) at the extraction boundary and keep downstream code assuming sanitized values.
- **Effort:** S
- **Risk of regression:** Low.
- **Dependencies:** None.

## Sprint 2 — remaining P1 fixes

### 10. O01-F01 / C01-P1-1 / C13-P1-1 — `isStatelessMode` and `_source` semantics diverge
- **Description:** Stateless-mode gating and alignment checks are driven by overlapping but non-equivalent signals, so sparse payloads with FILES but no observations can take inconsistent workflow paths.
- **Files / lines:** `workflow.ts:439,582-592`.
- **Specific fix recommendation:** Collapse the gating logic onto a single authoritative stateless-mode predicate, then make the alignment guard explicitly cover FILES-only payloads so mode detection and guard behavior cannot diverge.
- **Effort:** M
- **Risk of regression:** Medium to High — this affects top-level workflow branching in stateless mode.
- **Dependencies:** None, but it should land before follow-on cleanup in the same workflow module.

### 11. O17-P1-1 / C12-P1-1 — Contamination filtering only covers `userPrompts`
- **Description:** Enrichment data such as git commit messages, summaries, and synthetic observations bypasses contamination filtering entirely.
- **Files / lines:** `workflow.ts:736-748`; git-derived content introduced from `git-context-extractor.ts`.
- **Specific fix recommendation:** Apply `filterContamination()` at the point enrichment strings are created (especially git commit subjects/bodies and other synthetic text), not only when rendering raw user prompts.
- **Effort:** M
- **Risk of regression:** Medium — aggressive filtering could remove legitimate technical content if not scoped carefully.
- **Dependencies:** Prefer after or alongside the git-scoping fix so both changes operate on the same enrichment surface.

### 12. O06-P2-2 / O17-P1-1 / C01-P1-2 — Enrichment `.catch(() => null)` hides failures
- **Description:** Workflow enrichment failures are silently discarded, making data-loss and debugging problems much harder to diagnose.
- **Files / lines:** `workflow.ts:443-445`.
- **Specific fix recommendation:** Replace the silent catch with explicit error capture/logging that preserves failure reason and source stage while still allowing the workflow to degrade gracefully.
- **Effort:** S
- **Risk of regression:** Low to Medium — behavior should stay non-fatal, but output/log shape will change.
- **Dependencies:** None.

### 13. O12-P1-01 / O14-F01 / C12-P1-2 — `SessionData` index signature hides undeclared runtime fields
- **Description:** Dozens of fields are spread into `SessionData` at runtime but remain invisible to TypeScript because a broad `[key: string]: unknown` index signature absorbs them.
- **Files / lines:** `session-types.ts:215`; runtime spread points documented at `collect-session-data.ts:810-831`.
- **Specific fix recommendation:** Replace the broad index signature with explicit composition/intersection types that include the spread-in interfaces, then update consumers to use typed fields instead of `unknown`.
- **Effort:** L
- **Risk of regression:** High — this will surface latent type issues across multiple modules.
- **Dependencies:** Best after workflow/collector mutation semantics are stabilized.

### 14. O06-P2-2 / C06-P1-2 — Top-level git extractor catch discards error context
- **Description:** The outer catch path throws away the underlying git error detail, preventing diagnosis of repo-state failures.
- **Files / lines:** `git-context-extractor.ts:184-186`.
- **Specific fix recommendation:** Preserve the original error message/stdout/stderr in the returned diagnostic or wrapped error so callers can distinguish empty-repo, command-failure, and parse-failure cases.
- **Effort:** S
- **Risk of regression:** Low.
- **Dependencies:** Naturally pairs with the other git extractor fixes but is not blocked by them.

### 15. O06-P1-1 / C04-P1-3 — Rename parsing keeps brace-wrapped paths verbatim
- **Description:** Git rename paths that use brace expansion syntax are captured literally instead of being normalized into the real old/new paths.
- **Files / lines:** `git-context-extractor.ts:89-93`.
- **Specific fix recommendation:** Update rename parsing to expand brace-wrapped path fragments into concrete source/destination paths before scoring or downstream normalization.
- **Effort:** S
- **Risk of regression:** Low to Medium — rename parsing can be finicky across git output formats.
- **Dependencies:** None; ideally landed in the same PR as the other git extractor fixes.

### 16. O09-P2-04 / C09-P1-1 — Tool counting misses modern tool names
- **Description:** The session extractor undercounts tool usage because newer tool names are not included in its matcher.
- **Files / lines:** `session-extractor.ts:251-278`.
- **Specific fix recommendation:** Expand the recognized tool-name set to cover the current tool taxonomy and keep the matching logic centralized so future additions are easier.
- **Effort:** S
- **Risk of regression:** Low.
- **Dependencies:** None.

### 17. O01-F04 / C01-implicit — `enrichStatelessData` mutates `collectedData` in place
- **Description:** The workflow mutates caller-owned session data without documenting that side effect, which makes downstream behavior order-dependent.
- **Files / lines:** `workflow.ts:433-527`.
- **Specific fix recommendation:** Return a new enriched object (or clone before mutation) and document the contract so downstream stages cannot observe partial in-place edits.
- **Effort:** M
- **Risk of regression:** Medium — copy-vs-mutate changes can alter object identity and timing-sensitive code.
- **Dependencies:** Prefer after the stateless-mode gating fix, since both touch the same enrichment path.

### 18. O01-F03 / C17-implicit — `TOOL_COUNT` patch uses an unsafe `any` cast
- **Description:** The workflow patches `TOOL_COUNT` through an `any` cast, bypassing the type system instead of fixing the shape mismatch.
- **Files / lines:** `workflow.ts:729-731`.
- **Specific fix recommendation:** Replace the `any` cast with a typed helper or correct upstream typing so `TOOL_COUNT` can be patched through a validated interface.
- **Effort:** S
- **Risk of regression:** Low to Medium — depends on how many callers currently rely on the loose shape.
- **Dependencies:** Easier after the `SessionData` typing cleanup is designed.

### 19. O09-P1-01 / C09-implicit — Negative session duration is unguarded
- **Description:** If the first timestamp sorts after the last timestamp, duration can go negative and corrupt downstream metrics.
- **Files / lines:** `session-extractor.ts:290-292`.
- **Specific fix recommendation:** Guard against inverted or invalid timestamps by clamping to zero (or returning null) and emitting a diagnostic when ordering is invalid.
- **Effort:** S
- **Risk of regression:** Low.
- **Dependencies:** None.

### 20. O05-P1-1 / C05-implicit — Observation capping drops progress/checklist content silently
- **Description:** The spec-folder extractor truncates observations without preserving higher-value structural content such as progress and checklist state.
- **Files / lines:** `spec-folder-extractor.ts:275`.
- **Specific fix recommendation:** Change the capping strategy so structural artifacts are prioritized or summarized instead of being silently discarded when the cap is reached.
- **Effort:** M
- **Risk of regression:** Medium — output ordering/size may change.
- **Dependencies:** None.

### 21. O05-P1-2 / C05-P1 — `parseFrontmatter` corrupts mixed scalar/list fields
- **Description:** A scalar frontmatter value is overwritten when list items for the same key follow, corrupting parsed metadata.
- **Files / lines:** `spec-folder-extractor.ts:54-65`.
- **Specific fix recommendation:** Make the frontmatter parser preserve the initial scalar or explicitly reject scalar-plus-list reuse for the same key, rather than silently overwriting state.
- **Effort:** M
- **Risk of regression:** Medium — malformed or edge-case frontmatter may start parsing differently.
- **Dependencies:** None.

### 22. O16-P1-01 / C07-P2-1 — Semantic file enhancement strips provenance markers
- **Description:** When semantic descriptions are added, provenance markers are dropped, so downstream consumers cannot tell synthetic file context from original evidence.
- **Files / lines:** `file-extractor.ts:238-242,262-268`.
- **Specific fix recommendation:** Preserve `_provenance` / `_synthetic` metadata when matching and enriching files, and ensure merge logic carries those fields forward.
- **Effort:** M
- **Risk of regression:** Medium — output payload shape grows and may require downstream tolerance.
- **Dependencies:** None.

### 23. O08-P1-2 / C08-P1-3 — Timestamp matching can propagate `NaN`
- **Description:** Missing or malformed timestamps in OpenCode capture can produce `NaN` during exchange matching, corrupting ordering logic.
- **Files / lines:** `opencode-capture.ts:472-475`.
- **Specific fix recommendation:** Guard timestamp parsing before arithmetic, skip or default invalid timestamps explicitly, and keep comparisons operating only on validated numeric values.
- **Effort:** S
- **Risk of regression:** Low to Medium — malformed records will now be handled explicitly instead of implicitly.
- **Dependencies:** Best after the P0 capture-interface fix so the ingest contract is stable.

### 24. O08-P1-3 / C08-P1-1 — `buildExchanges` uses greedy first-match prompt pairing
- **Description:** Prompt/response pairing can attach the wrong prompt when multiple candidates exist, producing inaccurate exchange reconstruction.
- **Files / lines:** `opencode-capture.ts:460-501`.
- **Specific fix recommendation:** Track consumed prompts (or use nearest-valid chronological matching) so each response is paired deterministically with the correct unmatched prompt.
- **Effort:** M
- **Risk of regression:** Medium — pairing logic changes can shift reconstructed transcript output.
- **Dependencies:** Best after the P0 capture-interface fix.

## Sprint 3 — P2 hardening

### 25. O06-P2-1 / C06-P2-1 / C14-P2 — Git extractor should use `execFileSync` instead of shell command strings
- **Description:** Git commands are executed through shell-style command construction instead of argumentized process execution, increasing fragility and security risk.
- **Files / lines:** `git-context-extractor.ts` command invocation sites called out in the reconciliation matrix.
- **Specific fix recommendation:** Replace `execSync` shell command strings with `execFileSync('git', [...args])`, keep timeouts/error capture, and centralize git invocation in a single helper.
- **Effort:** M
- **Risk of regression:** Medium — command output formatting and quoting behavior can change across all git paths.
- **Dependencies:** Bundle with the other git extractor fixes once behavior is covered by regression tests.

## Recommended implementation order across sprints

1. **Stabilize ingest contracts first:** fix the P0 capture-interface mismatch, then land the `SPEC_FOLDER`, continuation-count, learning-weight, and anchor-id quick wins.
2. **Contain enrichment contamination next:** scope git enrichment to the active spec, then add contamination filtering and stop swallowing git/enrichment errors.
3. **Harden parser/type integrity after behavior settles:** address `SessionData` typing, mutation semantics, frontmatter parsing, observation capping, and provenance preservation once the runtime data shape is stable.
4. **Reserve command-execution hardening for Sprint 3:** move to `execFileSync` after the git extractor logic is otherwise stable, to avoid mixing semantic and transport-level changes in one pass.
