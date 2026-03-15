# Checklist: Perfect Session Capturing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:evidence -->
## 1. Evidence Snapshot

- `npm run check` in `.opencode/skill/system-spec-kit/scripts` passed on 2026-03-15. [Evidence: check pipeline exited `0`.]
- `npm run build` in `.opencode/skill/system-spec-kit/scripts` passed on 2026-03-15. [Evidence: `tsc --build` exited `0`.]
- Targeted scripts Vitest passed on 2026-03-15. [Evidence: `14` files, `125` tests passed.]
- `cd .opencode/skill/system-spec-kit/scripts/tests && node test-extractors-loaders.js` passed on 2026-03-15. [Evidence: `288` passed, `0` failed, `0` skipped.]
- `cd .opencode/skill/system-spec-kit/scripts/tests && node test-bug-fixes.js` passed on 2026-03-15. [Evidence: `27` passed, `0` failed, `0` skipped.]
- `cd .opencode/skill/system-spec-kit/scripts/tests && node test-integration.js` passed on 2026-03-15. [Evidence: `36` passed, `0` failed, `0` skipped.]
- `cd .opencode/skill/system-spec-kit/scripts/tests && node test-memory-quality-lane.js` passed on 2026-03-15. [Evidence: `test-memory-quality-lane: PASS`.]
- `npm run lint` in `.opencode/skill/system-spec-kit/mcp_server` passed on 2026-03-15. [Evidence: package-wide MCP lint exited `0`.]
- Targeted MCP save-quality Vitest passed on 2026-03-15. [Evidence: `6` files, `298` tests passed.]
- `npm run build` in `.opencode/skill/system-spec-kit/mcp_server` passed on 2026-03-15. [Evidence: `tsc --build` exited `0`.]
- `npm run test` in `.opencode/skill/system-spec-kit/mcp_server` passed on 2026-03-15. [Evidence: full MCP package suite exited `0`.]
- Alignment drift verification passed on 2026-03-15. [Evidence: `226` files scanned, `0` findings.]
- Final spec validation passed on 2026-03-15. [Evidence: `spec/validate.sh` returned `0` errors and `0` warnings.]
<!-- /ANCHOR:evidence -->

Scratch audit artifacts in `scratch/` are historical research only. Canonical closure evidence for spec `010` is limited to this checklist, the rest of the canonical markdown set, and the rerun commands recorded here.

---

<!-- ANCHOR:p0 -->
## 2. P0 Checks

- [x] [P0] JSON-mode remains the authoritative input path. [Evidence: `runtime-memory-inputs.vitest.ts` still asserts explicit invalid or missing data files fail immediately without falling through to native capture.]
- [x] [P0] Loader fallback ordering is `OpenCode -> Claude -> Codex -> Copilot -> Gemini -> NO_DATA_AVAILABLE`. [Evidence: `data-loader.ts` implements this order and `runtime-memory-inputs.vitest.ts` covers the precedence chain.]
- [x] [P0] Native matcher acceptance uses canonical `.opencode` workspace identity. [Evidence: `workspace-identity.vitest.ts` plus backend parser suites cover repo-root and `.opencode` equivalence and foreign-workspace rejection.]
- [x] [P0] Same-workspace off-spec stateless captures hard-fail before indexing. [Evidence: `task-enrichment.vitest.ts` proves same-workspace but off-spec captures throw `ALIGNMENT_BLOCK`, and the live OpenCode-first runtime rerun on 2026-03-15 produced that exact block against the unrelated media-editor session.]
- [x] [P0] Aligned but under-evidenced saves hard-fail with `INSUFFICIENT_CONTEXT_ABORT`. [Evidence: `memory-sufficiency.vitest.ts` covers the evaluator contract, `task-enrichment.vitest.ts` rejects thin explicit JSON saves, and `handler-memory-save.vitest.ts` rejects insufficient saves before embedding.]
- [x] [P0] `memory_save({ dryRun:true })` surfaces insufficiency without side effects. [Evidence: `handler-memory-save.vitest.ts` now asserts `dryRun` returns `rejectionCode`, sufficiency reasons, and no indexing behavior.]
- [x] [P0] `force:true` does not bypass insufficiency. [Evidence: `handler-memory-save.vitest.ts` now rejects insufficient saves even when `force: true` is provided.]
- [x] [P0] Reasoning and thought-only content are excluded from native captures. [Evidence: `claude-code-capture.vitest.ts`, `codex-cli-capture.vitest.ts`, and `gemini-cli-capture.vitest.ts` all pass while asserting reasoning/thought stripping behavior.]
- [x] [P0] Out-of-workspace file hints are removed from native captures. [Evidence: backend-specific Vitest fixtures include foreign paths that are stripped from tool inputs before normalization.]
- [x] [P0] Stateless tool-rich sparse-file captures do not false-fail `V7`. [Evidence: `memory-render-fixture.vitest.ts` proves rendered output keeps non-zero `tool_count` from native tool evidence without file entries.]
- [x] [P0] ANCHOR tags survive post-render HTML comment cleanup. [Evidence: `memory-render-fixture.vitest.ts` now directly exercises `stripWorkflowHtmlOutsideCodeFences()` and proves ANCHOR comments survive while non-ANCHOR comments are stripped.]
- [x] [P0] Frontmatter trigger_phrases use session-specific extracted content. [Evidence: `memory-render-fixture.vitest.ts` verifies frontmatter and trailing metadata both render one valid YAML list from `TRIGGER_PHRASES_YAML`, leak no raw `{{#TRIGGER_PHRASES}}` tags, and fall back to `trigger_phrases: []` when no trigger phrases are available.]
- [x] [P0] Explicit JSON mode accepts the documented snake_case contract. [Evidence: `runtime-memory-inputs.vitest.ts` proves `user_prompts`, `recent_context`, and `trigger_phrases` survive normalization without falling through to native capture, and the live rich snake_case JSON rerun on 2026-03-15 indexed memory `#4347`.]
- [x] [P0] Thin aligned saves abort before file write. [Evidence: `task-enrichment.vitest.ts` rejects thin JSON with `INSUFFICIENT_CONTEXT_ABORT`, and the live thin snake_case JSON rerun on 2026-03-15 returned that exact rejection with no new memory file written.]
- [x] [P0] The spec folder is internally consistent and validation-clean. [Evidence: post-doc `spec/validate.sh` rerun passed with zero errors and zero warnings.]
<!-- /ANCHOR:p0 -->

---

<!-- ANCHOR:p1 -->
## 3. P1 Checks

- [x] [P1] `DataSource` covers the full native support matrix. [Evidence: `scripts/utils/input-normalizer.ts` includes `claude-code-capture`, `codex-cli-capture`, `copilot-cli-capture`, and `gemini-cli-capture`.]
- [x] [P1] One shared semantic sufficiency evaluator exists and is reused. [Evidence: `shared/parsing/memory-sufficiency.ts` now feeds both `scripts/core/workflow.ts` and `mcp_server/handlers/memory-save.ts`.]
- [x] [P1] The shared capture transform remains the only stateless normalization path. [Evidence: `transformOpencodeCapture()` still normalizes every native backend through one shared path while now preserving safe prompt fallback and native tool-call evidence.]
- [x] [P1] Direct-path mode can prefer the calling CLI without weakening JSON authority. [Evidence: `runtime-memory-inputs.vitest.ts` covers `SYSTEM_SPEC_KIT_CAPTURE_SOURCE` ordering, `data-loader.ts` resumes the documented fallback chain after a preferred-source miss, and explicit JSON tests still prove file input never falls through to native capture.]
- [x] [P1] Foreign-spec or anchorless prompt fallback no longer re-enters generated output. [Evidence: `stateless-enrichment.vitest.ts` proves foreign-spec-only prompt sets are dropped, and generic same-workspace prompts are no longer rescued when no target-spec anchor exists.]
- [x] [P1] Diagnostic quality output reflects insufficiency explicitly. [Evidence: `test-memory-quality-lane.js` proves v2 quality adds `has_insufficient_context` and lowers the score when the sufficiency contract fails, while `scripts/core/quality-scorer.ts` caps the legacy score.]
- [x] [P1] Quality-loop fixes do not invent semantic evidence. [Evidence: `memory-save.ts` now runs quality-loop first, then shared sufficiency, and `handler-memory-save.vitest.ts` proves thin saves still reject after the loop path.]
- [x] [P1] Recovery hints mention insufficiency remediation clearly. [Evidence: `recovery-hints.vitest.ts` now asserts `MEMORY_SAVE_FAILED` guidance includes `INSUFFICIENT_CONTEXT_ABORT` and concrete next steps.]
- [x] [P1] Canonical docs reflect the workspace-identity and insufficiency contract. [Evidence: spec `010`, feature-catalog entry `NEW-139`, memory-quality feature docs, and manual playbook scenarios `M-007` and `NEW-133` were refreshed in this pass.]
<!-- /ANCHOR:p1 -->

---

<!-- ANCHOR:p2 -->
## 4. P2 Closure

- [x] [P2] Canonical `010` docs now describe discovery, alignment, insufficiency, and contamination as separate gates. [Evidence: spec, plan, tasks, decision record, and implementation summary all distinguish those stages explicitly.]
- [x] [P2] Manual verification guidance matches actual repo commands. [Evidence: `M-007` now uses `scripts/tests` for the JS suites, includes scripts `check`/build, and records the package-clean MCP lint/build/test bar; `NEW-133` documents `memory_save` dry-run and insufficiency behavior.]
- [x] [P2] Verification counts in spec `010` are current. [Evidence: targeted scripts suite (`14` files, `125` tests), targeted MCP suite (`6` files, `298` tests), JS suites, and alignment counts were refreshed to the 2026-03-15 rerun results.]
- [x] [P2] Package-clean MCP closure evidence is part of the canonical bar. [Evidence: the canonical spec set, feature catalog, and `M-007` now record `mcp_server` lint/build/full-test verification rather than relying only on the targeted save suite.]
- [x] [P2] Live manual `M-007` evidence matches the final written contract. [Evidence: 2026-03-15 manual reruns produced `#4347` for rich snake_case JSON, `#4348` for Copilot, `#4349` for Gemini, `#4351` for Claude, `#4353` for Codex, `ALIGNMENT_BLOCK` for OpenCode off-spec direct mode, and `NO_DATA_AVAILABLE` for the empty-home run.]
- [x] [P2] No deferred save-quality or native-capture work remains in canonical docs for this feature. [Evidence: canonical markdown now treats workspace identity, spec affinity, and cross-platform sufficiency as shipped behavior rather than pending work.]
<!-- /ANCHOR:p2 -->

---

<!-- ANCHOR:remediation -->
## 5. Remediation Pass: GPT-5.4 Review Findings

- [x] [P0] Inner-symlink tests prove the canonicalization bug and its fix. [Evidence: 4 new tests in `spec-folder-canonicalization.vitest.ts` create a symlink inside `/specs/` that aliases a spec folder name; naive regex returns `"current"` (wrong), `extractSpecFolder` returns `"02--domain/010-feature"` (correct).]
- [x] [P1] Migration runs once via schema v23, not on every startup. [Evidence: `SCHEMA_VERSION` bumped to 23; `normalizeStoredSpecFolders()` removed from `create_schema`; migration v23 runs re-canonicalization inside `run_migrations` transaction.]
- [x] [P1] SQL guard replaced with JS-side normalized filter. [Evidence: migration v23 selects all rows then filters with `normalized.includes('/specs/')` instead of SQL `LIKE '%/specs/%'`.]
- [x] [P1] `session_state.spec_folder` migrated via old→new mapping. [Evidence: `migrateSessionStateSpecFolders()` added and called from migration v23; skips ambiguous 1:N mappings safely.]
- [x] [P2] Error handling narrowed to ENOENT/ENOTDIR for parent-walk. [Evidence: `isMissingPathError()` helper added; ELOOP test passes with real circular symlinks returning resolved path without parent-walk.]
- [x] [P2] Fallback uses canonicalized `normalizedPath`. [Evidence: `memory-parser.ts:311` changed from `filePath` to `normalizedPath`; backslash test confirms forward-slash output.]
- [x] [P2] TypeScript compiles cleanly after remediation. [Evidence: `npx tsc --noEmit` in `mcp_server` — zero errors.]
- [x] [P2] All canonicalization tests pass including 7 new tests. [Evidence: `npx vitest run tests/spec-folder-canonicalization.vitest.ts` — 20 tests, 0 failures.]
- [x] [P2] Full MCP suite passes with zero regressions. [Evidence: `npx vitest run` — 282 files, 7,787 tests passed, 0 failures.]
<!-- /ANCHOR:remediation -->
