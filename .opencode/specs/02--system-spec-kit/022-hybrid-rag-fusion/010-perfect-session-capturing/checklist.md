# Checklist: Perfect Session Capturing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:evidence -->
## 1. Evidence Snapshot

- `npm run lint` in `.opencode/skill/system-spec-kit/scripts` passed on 2026-03-15. [Evidence: `tsc --noEmit` exited `0`.]
- `npm run build` in `.opencode/skill/system-spec-kit/scripts` passed on 2026-03-15. [Evidence: `tsc --build` exited `0`.]
- Targeted closure Vitest passed on 2026-03-15. [Evidence: `11` files, `87` tests passed.]
- `node test-extractors-loaders.js` passed on 2026-03-15. [Evidence: `288` passed, `0` failed, `0` skipped.]
- `node test-bug-fixes.js` passed on 2026-03-15. [Evidence: `16` passed, `0` failed, `10` skipped.]
- `node test-integration.js` passed on 2026-03-15. [Evidence: `26` passed, `0` failed, `2` skipped.]
- `node test-memory-quality-lane.js` passed on 2026-03-15. [Evidence: `test-memory-quality-lane: PASS`.]
- Alignment drift verification passed on 2026-03-15. [Evidence: `219` files scanned, `0` findings.]
- Final spec validation passed on 2026-03-15. [Evidence: `spec/validate.sh` returned `0` errors and `0` warnings.]
<!-- /ANCHOR:evidence -->

---

<!-- ANCHOR:p0 -->
## 2. P0 Checks

- [x] [P0] JSON-mode remains the authoritative input path. [Evidence: `runtime-memory-inputs.vitest.ts` still asserts explicit invalid or missing data files fail immediately without falling through to native capture.]
- [x] [P0] Loader fallback ordering is `OpenCode -> Claude -> Codex -> Copilot -> Gemini -> NO_DATA_AVAILABLE`. [Evidence: `data-loader.ts` implements this order and `runtime-memory-inputs.vitest.ts` covers each step.]
- [x] [P0] Native matcher acceptance uses canonical `.opencode` workspace identity. [Evidence: `workspace-identity.vitest.ts` plus the backend parser suites cover repo-root and `.opencode` equivalence and foreign-workspace rejection.]
- [x] [P0] Codex native capture is loader-reachable. [Evidence: `codex-cli-capture.vitest.ts` passed and `runtime-memory-inputs.vitest.ts` returns `_source === 'codex-cli-capture'` when Codex is the first usable fallback.]
- [x] [P0] Copilot native capture is loader-reachable. [Evidence: `copilot-cli-capture.vitest.ts` passed and `runtime-memory-inputs.vitest.ts` returns `_source === 'copilot-cli-capture'` when Copilot is the first usable fallback.]
- [x] [P0] Gemini native capture is loader-reachable. [Evidence: `gemini-cli-capture.vitest.ts` passed and `runtime-memory-inputs.vitest.ts` returns `_source === 'gemini-cli-capture'` when Gemini is the only usable fallback.]
- [x] [P0] Reasoning and thought-only content are excluded from native captures. [Evidence: `claude-code-capture.vitest.ts`, `codex-cli-capture.vitest.ts`, and `gemini-cli-capture.vitest.ts` all pass while asserting reasoning/thought stripping behavior.]
- [x] [P0] Out-of-workspace file hints are removed from native captures. [Evidence: backend-specific Vitest fixtures include foreign paths that are stripped from tool inputs before normalization.]
- [x] [P0] Stateless tool-rich sparse-file captures do not false-fail `V7`. [Evidence: `memory-render-fixture.vitest.ts` now proves rendered output keeps non-zero `tool_count` from native tool evidence without file entries.]
- [x] [P0] The spec folder is internally consistent and validation-clean. [Evidence: post-doc `spec/validate.sh` rerun passed with zero errors and zero warnings.]
<!-- /ANCHOR:p0 -->

---

<!-- ANCHOR:p1 -->
## 3. P1 Checks

- [x] [P1] `DataSource` covers the full native support matrix. [Evidence: `scripts/utils/input-normalizer.ts` includes `claude-code-capture`, `codex-cli-capture`, `copilot-cli-capture`, and `gemini-cli-capture`.]
- [x] [P1] The shared capture transform remains the only stateless normalization path. [Evidence: `transformOpencodeCapture()` still normalizes every native backend through one shared path while now preserving safe prompt fallback and native tool-call evidence.]
- [x] [P1] Loader accepts tool-call-only native captures as usable content. [Evidence: `data-loader.ts` now checks exchanges or tool calls before rejecting a native capture.]
- [x] [P1] Foreign-spec prompt fallback no longer re-enters generated output. [Evidence: `stateless-enrichment.vitest.ts` now proves foreign-spec-only prompt sets are dropped instead of reintroduced wholesale.]
- [x] [P1] New extractor modules build into dist and are verifiable from JS. [Evidence: `test-extractors-loaders.js` now passes additional checks for Codex, Copilot, Gemini, and extractor-barrel exports.]
- [x] [P1] Canonical docs reflect the `.opencode` workspace-identity contract and the five-backend matrix. [Evidence: spec `010`, feature-catalog entry `NEW-139`, and `M-007` were rewritten in this pass to describe the final identity and precedence model.]
- [x] [P1] Earlier numeric quality calibration remains part of the shipped feature truth. [Evidence: `quality-scorer-calibration.vitest.ts` remains in the targeted closure suite and passed.]
<!-- /ANCHOR:p1 -->

---

<!-- ANCHOR:p2 -->
## 4. P2 Closure

- [x] [P2] Canonical `010` docs no longer describe a path-equality-based matcher model. [Evidence: spec, plan, tasks, decision record, and implementation summary all describe canonical `.opencode` workspace identity and stateless validation drift fixes.]
- [x] [P2] Manual verification guidance matches actual repo commands. [Evidence: `M-007` uses `npm test` for Vitest, direct `node` commands from `scripts/tests/`, and the final `spec/validate.sh` invocation.]
- [x] [P2] Verification counts in spec `010` are current. [Evidence: targeted-suite and alignment counts were refreshed to the 2026-03-15 rerun results.]
- [x] [P2] No deferred native-capture work remains in canonical docs for this feature. [Evidence: canonical markdown now treats the support matrix as finished rather than partially deferred.]
<!-- /ANCHOR:p2 -->
