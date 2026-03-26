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

- Prompt: `Run full closure verification for spec 009-perfect-session-capturing, including JSON authority, shipped structured-summary fields (`toolCalls`, `exchanges`), file-backed JSON authority, the full native fallback chain (OpenCode, Claude, Codex, Copilot, Gemini), Phase 018 output-quality hardening, numeric quality calibration, and indexing readiness. Return a concise user-facing pass/fail verdict with the main reason.`
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
  - `M-007c` Explicit-CLI mis-scoped captured-session warning and overlap-block path
  - `M-007d` Spec-folder and git-context enrichment presence
  - `M-007e` OpenCode precedence
  - `M-007f` Claude fallback
  - `M-007g` Codex fallback
  - `M-007h` Copilot fallback
  - `M-007i` Gemini fallback
  - `M-007j` Final `NO_DATA_FILE` hard-fail
  - `M-007k` V10-only captured-session save warns and proceeds
  - `M-007l` V8/V9 captured-session contamination still aborts
  - `M-007m` `--stdin` structured JSON with explicit CLI target precedence
  - `M-007n` `--json` structured JSON with payload-target fallback
  - `M-007o` Claude tool-path downgrade vs non-Claude capped path
  - `M-007p` Structured-summary JSON coverage and file-backed authority
  - `M-007q` Phase 018 output-quality hardening
  - `133` cross-reference for MCP `memory_save` dry-run and insufficiency preview
  - `149` cross-reference for rendered-memory contract enforcement
- Latest automated baseline refresh:
  - Re-run the commands in this scenario during the current verification window and capture fresh output; do not rely on historical totals or dated rerun counts.
  - Treat the scripts-side baseline as `npm run check`, `npm run build`, the focused Vitest lanes in this scenario, and `npm run test:legacy` after build.
  - Treat the MCP-side baseline as the targeted save-quality lanes plus package-level `npm run check`.
  - Require the source/dist alignment lane to report zero violations for both `mcp_server/dist/lib` and `scripts/dist`.
  - Automated parity is not, by itself, proof that every supported CLI has been exercised live. Universal live-proof claims require fresh per-CLI and per-save-mode artifacts generated during this run.
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
    - `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/spec-affinity.vitest.ts tests/claude-code-capture.vitest.ts tests/codex-cli-capture.vitest.ts tests/copilot-cli-capture.vitest.ts tests/gemini-cli-capture.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/runtime-memory-inputs.vitest.ts tests/session-enrichment.vitest.ts tests/task-enrichment.vitest.ts tests/memory-render-fixture.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/memory-sufficiency.vitest.ts tests/memory-template-contract.vitest.ts`
  - JS verification suites:
    - `cd .opencode/skill/system-spec-kit/scripts && npm run test:legacy`
    - `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/test-integration.vitest.ts tests/workflow-e2e.vitest.ts`
    - `cd .opencode/skill/system-spec-kit/scripts/tests && node test-memory-quality-lane.js`
    - `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/workflow-e2e.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/contamination-filter.vitest.ts tests/quality-scorer-calibration.vitest.ts`
  - Standards checks:
    - `cd .opencode/skill/system-spec-kit/mcp_server && npm run lint`
    - `cd .opencode/skill/system-spec-kit/mcp_server && npm run build`
    - `cd .opencode/skill/system-spec-kit/mcp_server && npm run test:core -- tests/handler-memory-save.vitest.ts tests/recovery-hints.vitest.ts tests/quality-loop.vitest.ts tests/save-quality-gate.vitest.ts tests/preflight.vitest.ts tests/integration-save-pipeline.vitest.ts`
    - `cd .opencode/skill/system-spec-kit/mcp_server && npm run test`
    - `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit/scripts`
    - `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing`
  - Manual/e2e scenarios:
    - `M-007a` Rich JSON-mode save: run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js <json-data-file> 009-perfect-session-capturing` with a populated synthetic or sandbox JSON file and verify `qualityValidation.valid === true`, indexing succeeds, and a memory ID is returned.
    - `M-007a` Rich JSON-mode save: use the documented snake_case JSON contract or camelCase equivalent, then verify `qualityValidation.valid === true`, indexing succeeds, and a memory ID is returned.
    - `M-007b` Thin JSON insufficiency: rerun `generate-context.js` with intentionally thin JSON input using the documented snake_case contract and verify it now fails `INSUFFICIENT_CONTEXT_ABORT` before file write, with a materially lower diagnostic score than `M-007a`.
    - `M-007c` Explicit-CLI mis-scoped captured-session warning: run a same-workspace captured-session save whose prompts, tool metadata, and file hints do not contain any target-spec anchor and verify it emits `ALIGNMENT_WARNING`. If the file-path overlap remains below the hard threshold, verify the run still fails `ALIGNMENT_BLOCK`.
    - `M-007d` Git/spec-folder enrichment and render quality: inspect generated output and confirm provenance-tagged observations/files from both git and spec-folder enrichment are present, ANCHOR comments remain in the rendered file, frontmatter `trigger_phrases` no longer contain `memory dashboard`, `session summary`, or `context template`, and the rendered-memory contract remains valid.
    - `M-007e` OpenCode precedence: when a usable OpenCode session exists, verify the loader selects OpenCode first. If the session is same-workspace but off-spec, discovery may still succeed, but the run must still pass the later alignment, contamination, sufficiency, and quality gates before indexing.
    - `M-007f` Claude fallback: temporarily force the OpenCode path empty and run direct mode with `SYSTEM_SPEC_KIT_CAPTURE_SOURCE=claude`, then verify a matching Claude transcript is selected when its stored repo-root or `.opencode` path resolves to the same workspace identity. After selection, the save outcome must be driven by the later gates: missing spec anchors should warn when the CLI target is explicit, low file-path overlap may still `ALIGNMENT_BLOCK`, foreign-spec-dominated output may still `QUALITY_GATE_ABORT` via `V8`, and sufficiently rich aligned output may index.
    - `M-007g` Codex fallback: temporarily force OpenCode and Claude empty and run direct mode with `SYSTEM_SPEC_KIT_CAPTURE_SOURCE=codex`, then verify a matching Codex transcript is selected when `session_meta.payload.cwd` resolves to the same workspace identity. For an aligned tool-rich transcript, verify the run no longer false-fails `V7` and may validate/index if it is otherwise sufficient.
    - `M-007h` Copilot fallback: temporarily force OpenCode, Claude, and Codex empty and run direct mode with `SYSTEM_SPEC_KIT_CAPTURE_SOURCE=copilot`, then verify a matching Copilot workspace/session is selected when `cwd` or `git_root` resolves to the same workspace identity. The save must then follow the normal later gates: thin sessions fail `INSUFFICIENT_CONTEXT_ABORT`, while sufficiently rich aligned sessions may validate/index.
    - `M-007i` Gemini fallback: temporarily force all earlier native backends empty and run direct mode with `SYSTEM_SPEC_KIT_CAPTURE_SOURCE=gemini`, then verify a matching Gemini session is selected when `.project_root` resolves to the same workspace identity. The save must then follow the normal later gates: thin sessions fail `INSUFFICIENT_CONTEXT_ABORT`, while sufficiently rich aligned sessions may validate/index.
    - `M-007j` Full hard-fail: ensure no usable JSON input or native backend is available and verify the loader returns explicit `NO_DATA_FILE` rather than partial or contaminated output.
    - `M-007k` V10-only captured-session quality warning: verify a captured-session save whose only failed validation rule is V10 now continues with `QUALITY_GATE_WARN` and can still complete the save path.
    - `M-007l` V8/V9 hard-block retention: verify a captured-session save with foreign-spec contamination still aborts with `QUALITY_GATE_ABORT`.
    - `M-007m` `--stdin` structured input: pipe valid structured JSON into `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin <target-spec-folder>` and confirm the explicit CLI target wins over any payload `specFolder`, while `toolCalls` and `exchanges` survive into the generated output.
    - `M-007n` `--json` structured input: run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>'` and confirm the payload target is used when no explicit CLI target is provided, while file-backed JSON remains on the authoritative structured path instead of entering runtime-derived reconstruction.
    - `M-007o` Claude contamination downgrade: compare a Claude structured/captured-session input containing `tool title with path` content against a non-Claude source with the same text and verify Claude avoids the old 0.60 cap while the non-Claude path remains capped.
    - `M-007p` Structured-summary and file-authority verification: run a rich structured JSON save and confirm `toolCalls` and `exchanges` are accepted and preserved, then verify a file-backed payload remains on the structured path rather than reopening the runtime-derived enrichment branch. Also run a structured JSON save with a legacy payload that omits `toolCalls` and `exchanges` entirely and confirm it still succeeds through backward-compatible defaults.
    - `M-007q` Phase 018 output-quality hardening: inspect a generated memory or targeted regression evidence and confirm decision fields are no longer duplicated, completion status can recover from normalized `Next Steps`, blocker extraction ignores generic failure words, trigger/code-pattern filler is suppressed, `key_files` parsing accepts em dash/en dash/colon separators, tree thinning uses the `150`-token and `3`-child safeguards, and structured-data conversation synthesis adds assistant content when prompts are sparse.
- Expected:
  - Part I hardening remains active.
  - Native fallback ordering behaves deterministically across all five configured capture backends.
  - Direct-mode caller preference can reorder the first attempt without changing JSON authority or the rest of the fallback chain.
  - Native discovery uses canonical `.opencode` workspace identity rather than raw path equality.
  - Same-workspace generic infrastructure activity is not sufficient evidence for saving into a specific spec folder.
  - Explicit CLI targeting can warn on missing same-workspace spec anchors without bypassing later hard overlap, contamination, sufficiency, or quality checks.
  - Rich saves score materially above thin saves.
  - Thin aligned saves fail explicitly with `INSUFFICIENT_CONTEXT_ABORT`.
  - V10-only captured-session validation failures warn and continue, while V8/V9 hard-block contamination still aborts.
  - `--stdin` and `--json` preserve file-mode structured-input semantics with the documented target-authority rules, including `toolCalls` / `exchanges` preservation.
  - File-backed JSON remains on the authoritative structured path and does not reopen the abandoned hybrid-enrichment branch.
  - Claude `tool title with path` content no longer forces the 0.60 cap, while non-Claude sources still follow the capped path.
  - Phase 018 output-quality fixes keep decision rendering distinct, status recovery accurate, blocker detection specific, trigger/code-pattern noise lower, separator parsing broader, tree thinning bounded, and structured-data conversation output richer.
  - Direct positional saves exit non-zero with clear migration guidance to the structured JSON contract.
  - Rendered files preserve ANCHOR tags and frontmatter trigger phrases are session-specific.
  - Indexing succeeds when validation passes.
- Evidence:
  - Grep output for crypto IDs, quality abort threshold, five-backend loader wiring, caller-aware source preference wiring, ANCHOR cleanup regex, trigger-phrase template wiring, and sufficiency-gate wiring.
  - Passing `npm test` targeted Vitest output.
  - Passing JS suite summaries from `scripts/tests/`.
  - Passing `mcp_server` lint/build/targeted/full-test output for the package-clean closure bar.
  - Passing alignment drift output.
  - Passing `spec/validate.sh` output.
  - Fresh per-CLI transcripts or artifacts generated during this run for OpenCode, Claude Code, Codex CLI, Copilot CLI, and Gemini CLI whenever a universal live-proof claim is made.
  - `generate-context.js` output or capture logs showing results for `M-007a` through `M-007j`.
  - `generate-context.js` output or targeted Vitest evidence showing results for `M-007k` through `M-007q`.
- Pass:
  - All automated commands pass.
  - Package-clean MCP verification passes alongside the scripts-side closure suite.
  - `M-007a` validates and indexes successfully.
  - `M-007b` proves thin aligned JSON now fails `INSUFFICIENT_CONTEXT_ABORT` with lower diagnostic quality than `M-007a` and with no new memory file written.
  - `M-007c` proves the explicit-CLI same-workspace captured-session run warns on missing anchors and still hard-fails `ALIGNMENT_BLOCK` when file overlap is too low.
  - `M-007d` shows provenance-tagged enrichment.
  - `M-007d` also proves ANCHOR preservation, rendered-memory contract compliance, and frontmatter trigger-phrase quality.
  - `M-007e` proves OpenCode precedence does not override the later save-path gates.
  - `M-007f` through `M-007i` prove per-backend native capture selection and save-gate behavior under canonical `.opencode` workspace identity, the direct-mode caller hint, and the tightened alignment plus insufficiency gates without malformed trigger rendering or `V5` corruption. They are not, by themselves, full Hydra end-to-end proof for those CLIs.
  - `M-007j` proves final `NO_DATA_FILE` behavior.
  - `M-007k` through `M-007q` prove the Phase 017 captured-session soft-warning vs hard-block split, structured-input authority, shipped `toolCalls` / `exchanges` support, file-backed JSON authority, Claude-only contamination downgrade, and the Phase 018 output-quality hardening.
- Fail triage:
  - Check `data-loader.ts` fallback ordering.
  - Check project-matching logic inside the relevant native extractor.
  - Check `shared/parsing/memory-sufficiency.ts` evidence counting rules.
  - Check `quality-scorer.ts` scoring heuristics versus sufficiency and boolean validation.
  - Check `workflow.ts` abort/alignment/insufficiency thresholds.
  - Check test fixtures for backend-specific transcript assumptions and captured-session input coverage.

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/12-session-capturing-pipeline-quality.md](../../feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: M-007
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/007-session-capturing-pipeline-quality.md`
