# Review Report — 012-copilot-target-authority-helper

> **Reviewer:** GitHub Copilot CLI 1.0.36 — `gpt-5.5` model, `--effort high`
> **Dispatch:** `copilot -p ... --model gpt-5.5 --effort high --allow-all-tools --no-ask-user`
> **Date:** 2026-04-27
> **Mode:** Read-only critical code review (no files modified by reviewer)
> **Premium requests consumed:** 7.5 (4m 0s wall, 632.4k↑ / 12.6k↓ tokens, 505.3k cached)

---

## Executive Verdict

**APPROVE WITH CHANGES**

The core helper (`buildCopilotPromptArg`, `buildTargetAuthorityPreamble`, `buildMissingAuthorityGate3Prompt`) implements the research-mandated 3-branch matrix correctly and is byte-stable for callers that omit `targetAuthority`. The behavior matrix passes. However, four P1 issues block clean merge: (1) the `@PROMPT_PATH` wrapper file is not authority-prefixed, leaving an override surface for large prompts; (2) the YAML guards accept malformed/unresolved `{spec_folder}` values as approved authority; (3) success-criterion SC-004 (zero-mutation replay) lacks a corresponding test; (4) the working tree carries out-of-scope packet 013–015 + code-graph edits that must be isolated before merge.

---

## Per-Check Findings

| Check | Status | Severity | Finding |
|-------|--------|----------|---------|
| 1 Plan adherence | PARTIAL | P1 | Core helper matches research §3.3–§3.4, but wrapper-mode authority is not written into `prompts/iteration-NNN.md`, conflicting with §3.5's file-level criterion. |
| 2 Behavior matrix | PASS | none | All three helper branches (`approved`, `missing`+no-write, `missing`+write) match the required matrix. |
| 3 Override resistance | PASS | none | No code path lets recovered context (memory, bootstrap, prompt-body, graph `last_active_child_id`) override an approved `targetAuthority.specFolder`; authority comes only from YAML `{spec_folder}`. |
| 4 @PROMPT_PATH wrapper | PARTIAL | P1 | Preamble survives the inline wrapper arg, but the referenced prompt file remains unmodified. Recovered folder mentions inside the `@path` file can still dominate if Copilot prioritizes that content. |
| 5 Test coverage | PARTIAL | P1 | research.md §3.5 bullet 4 (I1-style zero-mutation replay) has no corresponding test. Argv/preamble unit tests do not falsify the actual mutation outcome the packet fixes. |
| 6 Regression risk | PARTIAL | P1 | `resolveCopilotPromptArg` is byte-stable for legacy callers, but unresolved `{spec_folder}` (template-resolution failure) is treated as approved authority rather than safe-failing to Gate 3. |
| 7 Scope discipline | FAIL | P1 | Working tree includes packet 013–015 docs, code-graph handler changes, and a code-graph degraded-sweep vitest outside packet 012 scope. Parent phase `spec.md`/`description.json`/`graph-metadata.json` reference 013–015. |
| 8 Security/correctness | PARTIAL | P2 | Raw `{spec_folder}` interpolation into both inline Node scripts and the preamble template is not validated/escaped; quote/newline/control-char values can corrupt authority semantics or inject prompt instructions. |
| 9 Self-flagged limitations | PASS | none | `_confirm.yaml` deferral is risk-acceptable: the v1.0.2 failure surface (score.md I1 cli-copilot-1) was `_auto`, not `_confirm`. |

---

## Detailed Findings

### P1 — Unresolved or malformed `{spec_folder}` becomes "approved" authority

- **Files:**
  - `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:619-623`
  - `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:682-686`
- **What's wrong:** The current guard only rejects empty/`null`. A literal `{spec_folder}` placeholder, whitespace, `undefined`, or other malformed injected values are truthy and become `{ kind: 'approved', specFolder }`, preserving `--allow-all-tools`.
- **Why it matters:** The packet's safe-fail claim (`spec.md` SC-002) says missing authority must force Gate 3. A template-resolution failure can silently bypass that and produce an "approved" dispatch with write capability against a malformed folder identifier.
- **Recommended fix:** Normalize and validate the rendered folder before approval — trim, reject `{...}` placeholders / `null` / `undefined` / control chars, and enforce the expected spec-folder path pattern (e.g. `^\.opencode/specs/.*[0-9]{3}-[a-z0-9-]+/?$`). Add tests for the unresolved placeholder and malformed-folder cases.

### P1 — Large-prompt authority is inline-only, not in the `@PROMPT_PATH` file

- **Files:**
  - `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:213-227`
  - `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:604-605`
  - `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:675-676`
- **What's wrong:** The helper documents that the referenced `@PROMPT_PATH` prompt file contains the unmodified prompt body, and only the inline arg carries the `## TARGET AUTHORITY` preamble.
- **Why it matters:** research.md §3.5 (line ~95) requires the approved folder to be regex-matchable inside `prompts/iteration-NNN.md`. If Copilot loads / prioritizes the `@path` file, recovered or bootstrap folder mentions inside that file can still dominate the agent's anchoring decision — exactly the failure mode the packet aims to fix.
- **Recommended fix:** For approved large prompts, write the authority-prefixed body to the prompt file (preamble + original body), or expose a separate `promptFileBody` from the helper so callers can persist the prefixed version before dispatch. Add a test on the file contents (not only the inline wrapper string).

### P1 — No test covers the I1-style zero-mutation success criterion

- **Files:**
  - research.md §3.5 bullet 4 — `.opencode/specs/.../011-post-stress-followup-research/research/research.md:95-98`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/executor-config-copilot-target-authority.vitest.ts:37-243`
  - `.opencode/specs/.../012-copilot-target-authority-helper/implementation-summary.md:136`
- **What's wrong:** Tests cover prompt/argv transformations and the 3 behavior branches, but research §3.5 bullet 4 requires an I1-style replay through `cli-copilot` to demonstrate **zero file mutations** when authority is missing + write intent is true. The implementation summary explicitly defers live-dispatch verification as a known limitation.
- **Why it matters:** This packet fixes a mutation bug. Argv-only unit tests prove the helper transforms inputs correctly but do not falsify the actual mutation outcome the v1.0.2 stress test surfaced.
- **Recommended fix:** Add a temp-dir/stub-copilot replay test that uses the I1 "save context" prompt and asserts (a) no write-capable flag is present in argv when authority is missing, and (b) no files in the temp dir mutate. Alternatively, gate merge on a manual live-dispatch verification log captured into `010-stress-test-rerun-v1-0-2/runs/`.

### P1 — Out-of-scope changes present in the working tree

- **Files (out of packet 012 scope):**
  - `.opencode/specs/.../011-mcp-runtime-stress-remediation/spec.md:114-116` (parent references 013–015)
  - `.opencode/specs/.../011-mcp-runtime-stress-remediation/description.json` and `graph-metadata.json`
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:31-40`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-degraded-sweep.vitest.ts:1-3`
  - `.opencode/specs/.../013-graph-degraded-stress-cell/spec.md:1-4` (and 014/015 packet docs)
- **What's wrong:** The working tree includes code-graph handler changes, a new code-graph degraded-sweep vitest, and packet 013–015 docs beyond the allowed packet 012 files (`executor-config.ts`, the 2 `_auto.yaml` files, the new vitest, and the 7 packet 012 docs). Reviewer did not see direct edits inside 003–009 or 010/011 child packet folders, but the parent phase 011 metadata was modified to reference the new sub-packets.
- **Why it matters:** Packet 012 should land as a focused, isolated change. Co-merging unrelated remediation packets and code-graph behavior changes makes review/rollback harder and violates the packet's stated scope.
- **Recommended fix:** Split packet 012 into its own commit/PR. Either revert/stash 013–015 and code-graph changes, or document in implementation-summary.md that this PR is a multi-packet bundle and which sibling packets are intentionally co-shipped.

### P2 — Raw spec-folder interpolation is prompt-injection fragile

- **Files:**
  - `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:152-157`
  - `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:619`
  - `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:682`
- **What's wrong:** `specFolder` is interpolated directly into JavaScript string literals (in the YAML inline Node scripts) and into the prompt preamble template. Quotes, newlines, or control characters in the folder string could break the inline Node script or inject prompt instructions.
- **Why it matters:** Existing spec-folder naming conventions probably prevent this in normal use, but the helper itself does not enforce that invariant. Defense-in-depth matters because the failure mode is silent corruption of agent authority.
- **Recommended fix:** Validate `specFolder` in `buildTargetAuthorityPreamble` (or before constructing `targetAuthority`); reject newlines, control chars, quotes, and characters outside the expected `[a-zA-Z0-9._/-]` set. Pair with the P1 placeholder-rejection fix into a single shared validator.

---

## Recommendations (P0 → P1 → P2)

No P0 blockers.

**P1 — must address before merge:**
1. Add strict `specFolder` normalization/validation in both YAML call sites (or via a shared helper), including unresolved-placeholder rejection. Add tests for the malformed-folder cases.
2. Change large-prompt handling so the referenced `@PROMPT_PATH` content includes the authority preamble — or explicitly adjust research §3.5 bullet 4 and add compensating tests on the inline wrapper string only.
3. Add an I1-style zero-mutation replay/stub test for `kind:"missing"` + `writeIntent:true`. Alternatively, document live-dispatch verification as a required pre-merge step and capture a log.
4. Isolate packet 012 from out-of-scope packet 013–015 and code-graph changes before merge (separate commits/PRs), or document the multi-packet bundle.

**P2 — should fix when convenient:**
5. Add tests covering quote/newline/control-character `specFolder` values (folds into recommendation 1's shared validator).

---

## Approval Conditions

This packet ships once the four P1 items above are resolved (or explicitly accepted with risk sign-off in `decision-record.md`). The core helper logic, behavior matrix, override resistance, byte-stability for legacy callers, and `_confirm` deferral judgment are all sound — the residual risk is concentrated in (a) untrusted folder-string handling, (b) wrapper-mode parity, (c) test coverage of the actual mutation outcome, and (d) PR scope hygiene.
