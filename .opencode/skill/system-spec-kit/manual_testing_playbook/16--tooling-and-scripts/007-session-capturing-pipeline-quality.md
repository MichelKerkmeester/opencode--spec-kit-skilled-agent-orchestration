---
title: "M-007 -- Session Capturing Pipeline Quality"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-007`."
---

# M-007 -- Session Capturing Pipeline Quality

## 1. OVERVIEW

This snippet preserves the canonical memory/spec-kit operator workflow for `M-007`.

---

## 2. CURRENT REALITY

This scenario remains prose-first because it carries compound operator logic, supplemental checks, or shared closure rules that are clearer than a single-row matrix.

---

## 3. TEST EXECUTION

- Prompt: `Run full closure verification for spec 010-perfect-session-capturing, including JSON authority, stateless enrichment, the full native fallback chain (OpenCode, Claude, Codex, Copilot, Gemini), Phase 017 stateless quality-gate behavior, numeric quality calibration, and indexing readiness. Return a concise user-facing pass/fail verdict with the main reason.`
- Canonical workspace rule:
  - Native capture targets the repo-local `.opencode` workspace identity.
  - Backend-native repo-root, `.opencode`, and git-root path forms count as equivalent only when they normalize to the same workspace.
- Shared durability rule:
  - Save success now requires more than discovery and alignment.
  - The generated memory must preserve enough durable evidence to pass the shared semantic sufficiency contract.
  - Thin aligned saves are expected to fail with `INSUFFICIENT_CONTEXT_ABORT`.
- Render quality rule:
  - Successful saves must also satisfy the shared rendered-memory template contract.
  - Generated memory files must preserve ANCHOR comments through cleanup.
  - Missing mandatory anchors or HTML ids, raw Mustache leakage, and duplicate top-of-body separators must hard-fail before indexing.
  - Frontmatter `trigger_phrases` must come from session-specific extraction and never fall back to generic placeholders.
- Scenario set:
  - `M-007a` JSON authority and successful indexing
  - `M-007b` Thin JSON insufficiency rejection and lower-score behavior
  - `M-007c` Explicit-CLI mis-scoped stateless warning and overlap-block path
  - `M-007d` Spec-folder and git-context enrichment presence
  - `M-007e` OpenCode precedence
  - `M-007f` Claude fallback
  - `M-007g` Codex fallback
  - `M-007h` Copilot fallback
  - `M-007i` Gemini fallback
  - `M-007j` Final `NO_DATA_AVAILABLE` hard-fail
  - `M-007k` V10-only stateless save warns and proceeds
  - `M-007l` V8/V9 stateless contamination still aborts
  - `M-007m` `--stdin` structured JSON with explicit CLI target precedence
  - `M-007n` `--json` structured JSON with payload-target fallback
  - `M-007o` Claude tool-path downgrade vs non-Claude capped path
  - `NEW-133` cross-reference for MCP `memory_save` dry-run and insufficiency preview
  - `NEW-149` cross-reference for rendered-memory contract enforcement and historical remediation
- Latest automated baseline refresh:
  - On 2026-03-17, root `typecheck`, scripts `check` and `build`, `test-scripts-modules.js` (`384` passed, `5` skipped, `389` total), and `test-extractors-loaders.js` (`307` passing) reran cleanly.
  - On 2026-03-17, the focused proof lanes reran cleanly as separate canonical checks: `task-enrichment.vitest.ts` (`47` tests), `runtime-memory-inputs.vitest.ts` (`29` tests), the phase-016 parity lane (`45` tests), the phase-010 integration lane (`70` tests across `test-integration.vitest.ts` and `workflow-e2e.vitest.ts`), and the phase-011 session-source lane (`66` tests).
  - On 2026-03-17, package-clean MCP `lint`/`build`/full `test` reran cleanly with the MCP package suite at `7822` total tests, and the focused MCP save-quality lane remained part of that refreshed package-clean verification stack.
  - The latest alignment-drift support run remains the 2026-03-16 snapshot with `229` scanned files and `0` findings; it was not part of the March 17 rerun set.
  - This automated baseline is not sufficient evidence by itself for "all five CLIs proven live"; verify the retained artifact at `research/live-cli-proof-2026-03-17.json` and its March 17, 2026 per-CLI records before making that claim, and refresh equivalent primary evidence for any future live-proof assertion.
  - On 2026-03-18, the affected Phase 017 scripts lane reran cleanly with `4` files and `39` passing tests: `workflow-e2e.vitest.ts`, `generate-context-cli-authority.vitest.ts`, `contamination-filter.vitest.ts`, and `quality-scorer-calibration.vitest.ts`.
- Commands:
  - Part I hardening spot checks:
    - `grep -n 'crypto.randomBytes' .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts`
    - `grep -n 'qualityAbortThreshold' .opencode/skill/system-spec-kit/scripts/core/workflow.ts .opencode/skill/system-spec-kit/scripts/core/config.ts`
    - `grep -n 'claude-code-capture\|codex-cli-capture\|copilot-cli-capture\|gemini-cli-capture' .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts`
    - `grep -n 'INSUFFICIENT_CONTEXT_ABORT\|evaluateMemorySufficiency' .opencode/skill/system-spec-kit/scripts/core/workflow.ts .opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts`
    - `grep -n 'WORKFLOW_HTML_COMMENT_RE\|stripWorkflowHtmlOutsideCodeFences' .opencode/skill/system-spec-kit/scripts/core/workflow.ts`
    - `grep -n 'SYSTEM_SPEC_KIT_CAPTURE_SOURCE\|trigger_phrases' .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts .opencode/skill/system-spec-kit/templates/context_template.md`
  - Targeted automated closure suite:
    - `cd .opencode/skill/system-spec-kit/scripts && npm run check`
    - `cd .opencode/skill/system-spec-kit/scripts && npm run build`
    - `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/spec-affinity.vitest.ts tests/claude-code-capture.vitest.ts tests/codex-cli-capture.vitest.ts tests/copilot-cli-capture.vitest.ts tests/gemini-cli-capture.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/runtime-memory-inputs.vitest.ts tests/stateless-enrichment.vitest.ts tests/task-enrichment.vitest.ts tests/memory-render-fixture.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/memory-sufficiency.vitest.ts tests/memory-template-contract.vitest.ts tests/historical-memory-remediation.vitest.ts`
  - JS verification suites:
    - `cd .opencode/skill/system-spec-kit/scripts/tests && node test-extractors-loaders.js`
    - `cd .opencode/skill/system-spec-kit/scripts/tests && node test-bug-fixes.js`
    - `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/test-integration.vitest.ts tests/workflow-e2e.vitest.ts`
    - `cd .opencode/skill/system-spec-kit/scripts/tests && node test-memory-quality-lane.js`
    - `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/workflow-e2e.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/contamination-filter.vitest.ts tests/quality-scorer-calibration.vitest.ts`
  - Standards checks:
    - `cd .opencode/skill/system-spec-kit/mcp_server && npm run lint`
    - `cd .opencode/skill/system-spec-kit/mcp_server && npm run build`
    - `cd .opencode/skill/system-spec-kit/mcp_server && npm run test:core -- tests/handler-memory-save.vitest.ts tests/recovery-hints.vitest.ts tests/quality-loop.vitest.ts tests/save-quality-gate.vitest.ts tests/preflight.vitest.ts tests/integration-save-pipeline.vitest.ts`
    - `cd .opencode/skill/system-spec-kit/mcp_server && npm run test`
    - `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit/scripts`
    - `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing`
  - Manual/e2e scenarios:
    - `M-007a` Rich JSON-mode save: run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js <json-data-file> 010-perfect-session-capturing` with a populated synthetic or sandbox JSON file and verify `qualityValidation.valid === true`, indexing succeeds, and a memory ID is returned.
    - `M-007a` Rich JSON-mode save: use the documented snake_case JSON contract or camelCase equivalent, then verify `qualityValidation.valid === true`, indexing succeeds, and a memory ID is returned.
    - `M-007b` Thin JSON insufficiency: rerun `generate-context.js` with intentionally thin JSON input using the documented snake_case contract and verify it now fails `INSUFFICIENT_CONTEXT_ABORT` before file write, with a materially lower diagnostic score than `M-007a`.
    - `M-007c` Explicit-CLI mis-scoped stateless warning: run a same-workspace stateless save whose prompts, tool metadata, and file hints do not contain any target-spec anchor and verify it emits `ALIGNMENT_WARNING`. If the file-path overlap remains below the hard threshold, verify the run still fails `ALIGNMENT_BLOCK`.
    - `M-007d` Git/spec-folder enrichment and render quality: inspect generated output and confirm provenance-tagged observations/files from both git and spec-folder enrichment are present, ANCHOR comments remain in the rendered file, frontmatter `trigger_phrases` no longer contain `memory dashboard`, `session summary`, or `context template`, and the rendered-memory contract remains valid.
    - `M-007e` OpenCode precedence: when a usable OpenCode session exists, verify the loader selects OpenCode first. If the session is same-workspace but off-spec, discovery may still succeed, but the run must still pass the later alignment, contamination, sufficiency, and quality gates before indexing.
    - `M-007f` Claude fallback: temporarily force the OpenCode path empty and run direct mode with `SYSTEM_SPEC_KIT_CAPTURE_SOURCE=claude`, then verify a matching Claude transcript is selected when its stored repo-root or `.opencode` path resolves to the same workspace identity. After selection, the save outcome must be driven by the later gates: missing spec anchors should warn when the CLI target is explicit, low file-path overlap may still `ALIGNMENT_BLOCK`, foreign-spec-dominated output may still `QUALITY_GATE_ABORT` via `V8`, and sufficiently rich aligned output may index.
    - `M-007g` Codex fallback: temporarily force OpenCode and Claude empty and run direct mode with `SYSTEM_SPEC_KIT_CAPTURE_SOURCE=codex`, then verify a matching Codex transcript is selected when `session_meta.payload.cwd` resolves to the same workspace identity. For an aligned tool-rich transcript, verify the run no longer false-fails `V7` and may validate/index if it is otherwise sufficient.
    - `M-007h` Copilot fallback: temporarily force OpenCode, Claude, and Codex empty and run direct mode with `SYSTEM_SPEC_KIT_CAPTURE_SOURCE=copilot`, then verify a matching Copilot workspace/session is selected when `cwd` or `git_root` resolves to the same workspace identity. The save must then follow the normal later gates: thin sessions fail `INSUFFICIENT_CONTEXT_ABORT`, while sufficiently rich aligned sessions may validate/index.
    - `M-007i` Gemini fallback: temporarily force all earlier native backends empty and run direct mode with `SYSTEM_SPEC_KIT_CAPTURE_SOURCE=gemini`, then verify a matching Gemini session is selected when `.project_root` resolves to the same workspace identity. The save must then follow the normal later gates: thin sessions fail `INSUFFICIENT_CONTEXT_ABORT`, while sufficiently rich aligned sessions may validate/index.
    - `M-007j` Full hard-fail: ensure no usable JSON input or native backend is available and verify the loader returns explicit `NO_DATA_AVAILABLE` rather than partial or contaminated output.
    - `M-007k` V10-only stateless quality warning: verify a stateless capture whose only failed validation rule is V10 now continues with `QUALITY_GATE_WARN` and can still complete the save path.
    - `M-007l` V8/V9 hard-block retention: verify a stateless capture with foreign-spec contamination still aborts with `QUALITY_GATE_ABORT`.
    - `M-007m` `--stdin` structured input: pipe valid structured JSON into `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin 017-stateless-quality-gates` and confirm the explicit CLI target wins over any payload `specFolder`.
    - `M-007n` `--json` structured input: run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>'` and confirm the payload target is used when no explicit CLI target is provided.
    - `M-007o` Claude contamination downgrade: compare a Claude structured/stateless capture containing `tool title with path` content against a non-Claude source with the same text and verify Claude avoids the old 0.60 cap while the non-Claude path remains capped.
- Expected:
  - Part I hardening remains active.
  - Stateless enrichment remains active.
  - Native fallback ordering behaves deterministically across all five configured capture backends.
  - Direct-mode caller preference can reorder the first attempt without changing JSON authority or the rest of the fallback chain.
  - Native discovery uses canonical `.opencode` workspace identity rather than raw path equality.
  - Same-workspace generic infrastructure activity is not sufficient evidence for saving into a specific spec folder.
  - Explicit CLI targeting can warn on missing same-workspace spec anchors without bypassing later hard overlap, contamination, sufficiency, or quality checks.
  - Rich saves score materially above thin saves.
  - Thin aligned saves fail explicitly with `INSUFFICIENT_CONTEXT_ABORT`.
  - V10-only stateless validation failures warn and continue, while V8/V9 hard-block contamination still aborts.
  - `--stdin` and `--json` preserve file-mode structured-input semantics with the documented target-authority rules.
  - Claude `tool title with path` content no longer forces the 0.60 cap, while non-Claude sources still follow the capped path.
  - Rendered files preserve ANCHOR tags and frontmatter trigger phrases are session-specific.
  - Indexing succeeds when validation passes.
- Evidence:
  - Grep output for crypto IDs, quality abort threshold, five-backend loader wiring, caller-aware source preference wiring, ANCHOR cleanup regex, trigger-phrase template wiring, and sufficiency-gate wiring.
  - Passing `npm test` targeted Vitest output.
  - Passing JS suite summaries from `scripts/tests/`.
  - Passing `mcp_server` lint/build/targeted/full-test output for the package-clean closure bar.
  - Passing alignment drift output.
  - Passing `spec/validate.sh` output.
  - Inspection of `research/live-cli-proof-2026-03-17.json`, confirming the retained artifact path and same-day entries for OpenCode, Claude Code, Codex CLI, Copilot CLI, and Gemini CLI.
  - `generate-context.js` output or capture logs showing results for `M-007a` through `M-007j`.
  - `generate-context.js` output or targeted Vitest evidence showing results for `M-007k` through `M-007o`.
- Pass:
  - All automated commands pass.
  - Package-clean MCP verification passes alongside the scripts-side closure suite.
  - `M-007a` validates and indexes successfully.
  - `M-007b` proves thin aligned JSON now fails `INSUFFICIENT_CONTEXT_ABORT` with lower diagnostic quality than `M-007a` and with no new memory file written.
  - `M-007c` proves the explicit-CLI same-workspace stateless run warns on missing anchors and still hard-fails `ALIGNMENT_BLOCK` when file overlap is too low.
  - `M-007d` shows provenance-tagged enrichment.
  - `M-007d` also proves ANCHOR preservation, rendered-memory contract compliance, and frontmatter trigger-phrase quality.
  - `M-007e` proves OpenCode precedence does not override the later save-path gates.
  - `M-007f` through `M-007i` prove per-backend native capture selection and save-gate behavior under canonical `.opencode` workspace identity, the direct-mode caller hint, and the tightened alignment plus insufficiency gates without malformed trigger rendering or `V5` corruption. They are not, by themselves, full Hydra end-to-end proof for those CLIs.
  - `M-007j` proves final `NO_DATA_AVAILABLE` behavior.
  - `M-007k` through `M-007o` prove the Phase 017 stateless soft-warning vs hard-block split, structured-input authority, and Claude-only contamination downgrade.
- Fail triage:
  - Check `data-loader.ts` fallback ordering.
  - Check project-matching logic inside the relevant native extractor.
  - Check `shared/parsing/memory-sufficiency.ts` evidence counting rules.
  - Check `quality-scorer.ts` scoring heuristics versus sufficiency and boolean validation.
  - Check `workflow.ts` abort/alignment/insufficiency thresholds.
  - Check test fixtures for backend-specific transcript assumptions and stateless-input coverage.

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/12-session-capturing-pipeline-quality.md](../../feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: M-007
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/007-session-capturing-pipeline-quality.md`
