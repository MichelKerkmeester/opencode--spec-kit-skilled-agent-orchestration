---
title: "...ization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/001-executor-feature/implementation-summary]"
description: "Post-ship summary for Phase 018: executor-selection feature shipped to sk-deep-research + sk-deep-review with native (default) and cli-codex (new) dispatch branches. YAML owns state/convergence/lifecycle unchanged. 22 files touched, 40/40 vitest green, tsc clean. Verdict: PASS."
trigger_phrases:
  - "018 implementation summary"
  - "deep-loop executor shipped"
  - "phase 018 verdict"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/001-executor-feature"
    last_updated_at: "2026-04-18T10:45:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Phase H shipped: feature complete, 40/40 tests green, tsc clean"
    next_safe_action: "Track 2: Run /spec_kit:deep-research :auto with cli-codex on Phase 017 refinements"
    blockers: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Deep-Loop CLI Executor Selection for Iterative Skills

---

<!-- ANCHOR:metadata -->
## 1. Metadata

| Field | Value |
|-------|-------|
| **Packet** | `system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/001-executor-feature` |
| **Verdict** | **PASS** |
| **Shipped** | 2026-04-18 |
| **Effort (actual)** | ~2 hours wall-clock (parallel cli-codex gpt-5.4 high fast dispatches) |
| **Effort (planned)** | ~35 hours / ~25h critical-path |
| **Delivery mode** | Single-session build via cli-codex dogfooding — this feature built itself using the cli-codex integration we were shipping |
| **Test coverage** | 40/40 vitest pass; 4 unit test suites (executor-config, prompt-pack, post-dispatch-validate, executor-audit) |
| **Type-check** | `tsc --noEmit` clean across all new + modified TypeScript |
| **Atomic-ship** | All YAML + config + template + test + doc changes sit in one logical batch |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. What Was Built

### 2.1 Headline

Executor selection for both iterative skills (`sk-deep-research` + `sk-deep-review`), implemented as a branch INSIDE the existing YAML `step_dispatch_iteration` — NOT as a loop replacement. Preserves every skill-owned invariant (state ownership, reducer exclusivity, convergence detection, lifecycle events) while enabling `codex exec` dispatch with `gpt-5.4 + reasoning-effort=high + service-tier=fast`.

### 2.2 Architectural primitives introduced

Four TypeScript modules under `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/`:

1. **`executor-config.ts`** — Zod schema + validator. Exports `ExecutorConfig`, `ExecutorKind`, `parseExecutorConfig`, `resolveExecutorConfig`, `ExecutorNotWiredError`, `ExecutorConfigError`. Rejects unwired kinds (cli-copilot/gemini/claude-code) with spec-pointer error; rejects cli-codex without model.
2. **`prompt-pack.ts`** — Template renderer with `renderPromptPack(templatePath, variables)` and `validatePromptPackTemplate`. Substitutes `{var}` tokens; throws `PromptPackError` on unbound variables. Executor-agnostic (same output feeds agent context OR CLI stdin).
3. **`post-dispatch-validate.ts`** — Invariant checker. Asserts iteration file exists and is non-empty, JSONL delta appended, delta contains required fields. Returns `PostDispatchValidateResult`; `validateOrThrow` throws `PostDispatchValidationError` on failure.
4. **`executor-audit.ts`** — Appends `executor: {kind, model, reasoningEffort, serviceTier}` to the iteration's JSONL record when executor kind ≠ native. `appendExecutorAuditToLastRecord` reads the state log, merges the audit block into the last line, writes back.

### 2.3 YAML dispatch refactor (4 files)

All four YAMLs — `spec_kit_deep-research_auto.yaml`, `..._confirm.yaml`, `spec_kit_deep-review_auto.yaml`, `..._confirm.yaml` — had their `step_dispatch_iteration` block replaced with a two-branch structure:

```yaml
step_dispatch_iteration:
  resolve_executor: (calls parseExecutorConfig)
  pre_dispatch:
    render_prompt_pack: (calls renderPromptPack)
  branch_on: "config.executor.kind"
  if_native:
    dispatch: { agent: deep-research|deep-review, model: opus, context_source: "rendered_prompt_pack" }
  if_cli_codex:
    command: codex exec --model X -c ... --sandbox workspace-write - < {prompt-path}
  post_dispatch_validate: (calls validateIterationOutputs)
  record_executor_audit: (calls appendExecutorAuditToLastRecord, skipped for native)
```

The `if_native` branch preserves the original `agent: deep-*` + `model: opus` dispatch EXACTLY — zero behavior change for default-path users.

### 2.4 Prompt-pack templates (2 files)

Executor-agnostic markdown templates at:
- `.opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl`
- `.opencode/skill/sk-deep-review/assets/prompt_pack_iteration.md.tmpl`

Extracted from the inline YAML `context:` blocks. Variables use `{name}` syntax. Same rendered output whether consumed by `@deep-*` agent (via `context_source: rendered_prompt_pack`) or `codex exec` stdin. Explicit output contract documented: iteration-NNN.md + JSONL delta both required.

### 2.5 Config schema additions (2 files)

Both `deep_research_config.json` and `deep_review_config.json` gained an `executor` block:

```json
"executor": {
  "kind": "native",
  "model": null,
  "reasoningEffort": null,
  "serviceTier": null,
  "sandboxMode": null,
  "timeoutSeconds": 900
}
```

### 2.6 Command setup flags (2 files)

`.opencode/command/spec_kit/deep-research.md` and `the review command doc` setup phase parser now recognizes:
- `--executor=<kind>` → `config.executor.kind`
- `--model=<id>` → `config.executor.model`
- `--reasoning-effort=<level>` → `config.executor.reasoningEffort`
- `--service-tier=<tier>` → `config.executor.serviceTier`
- `--executor-timeout=<seconds>` → `config.executor.timeoutSeconds`

Precedence: CLI flag > config file > schema default.

### 2.7 Contract documentation (4 files)

Replaced SKILL.md:61 (research) and SKILL.md:63 (review) forward-looking notes with full **Executor Selection Contract** sections documenting: supported kinds table (native + cli-codex shipped; cli-copilot/gemini/claude-code reserved), invariants, failure modes, JSONL audit field format, template paths, config surface.

Added **Executor Resolution** subsection to both skill loop-protocol docs at `.opencode/skill/sk-deep-research/references/loop_protocol.md` §3 and `.opencode/skill/sk-deep-review/references/loop_protocol.md` §3, documenting how branch resolution interacts with existing `schema_mismatch` → `stuck_recovery` path.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:files -->
## 3. Files Touched (22)

### 3.1 Created (10)

| File | LOC | Purpose |
|------|-----|---------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` | 93 | Zod schema + parse/resolve |
| `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/prompt-pack.ts` | ~90 | Template renderer + validator |
| `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts` | ~80 | Invariant checker |
| `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts` | ~60 | JSONL audit merger |
| `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/executor-config.vitest.ts` | ~120 | 16 unit tests |
| `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/prompt-pack.vitest.ts` | ~140 | 11 unit tests |
| `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/post-dispatch-validate.vitest.ts` | ~100 | 8 unit tests |
| `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/executor-audit.vitest.ts` | ~90 | 5 unit tests |
| `.opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl` | 43 | Research iteration template |
| `.opencode/skill/sk-deep-review/assets/prompt_pack_iteration.md.tmpl` | 68 | Review iteration template |

### 3.2 Modified (12)

| File | Purpose |
|------|---------|
| `.opencode/skill/sk-deep-research/assets/deep_research_config.json` | Added executor block |
| `.opencode/skill/sk-deep-review/assets/deep_review_config.json` | Added executor block |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | 2-branch dispatch |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | 2-branch dispatch |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | 2-branch dispatch |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | 2-branch dispatch |
| `.opencode/command/spec_kit/deep-research.md` | Setup flag parsing |
| `.opencode/command/spec_kit/the review command doc` | Setup flag parsing |
| `.opencode/skill/sk-deep-research/SKILL.md` | CONTRACT section |
| `.opencode/skill/sk-deep-review/SKILL.md` | CONTRACT section |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Executor Resolution §3 |
| `.opencode/skill/sk-deep-review/references/loop_protocol.md` | Executor Resolution §3 |
<!-- /ANCHOR:files -->

---

<!-- ANCHOR:how-delivered -->
## 4. How It Was Delivered

### 4.1 Delegation pattern (dogfooding)

This feature was built using `cli-codex gpt-5.4 -c model_reasoning_effort="high" -c service_tier="fast" -c approval_policy=never --sandbox workspace-write` as the primary executor — the exact CLI surface the feature itself exposes. Five codex dispatches:

| Phase | Prompt size | Files touched | Result |
|-------|-------------|---------------|--------|
| A (config + loader) | ~10KB prompt | 4 files | 16 tests, tsc clean |
| B (templates + renderer) | ~8KB prompt | 2 files (+ 2 templates I wrote manually due to sandbox scope) | 11 tests, tsc clean |
| C (research YAML + validator + audit) | ~11KB prompt | 6 files | 13 tests, tsc clean |
| D (review YAML mirror) | ~5KB prompt | 2 files | still 40/40 |
| E+F (bundled docs) | ~9KB prompt | 6 files | still 40/40 |

### 4.2 Interventions needed

Three manual corrections during the run:

1. **Spec folder scaffolding** (Phase 0): I wrote spec.md/plan.md/tasks.md/checklist.md/decision-record.md/description.json/graph-metadata.json myself before any codex dispatch. `validate.sh` passes with 0 errors after frontmatter trim (the SPECKIT_TEMPLATE_SOURCE header was outside `head -n 30` window until I shortened the `_memory.continuity` block).
2. **Prompt-pack templates** (Phase B): Codex's sandbox was scoped to its cwd subtree and couldn't write outside `mcp_server/`. I wrote the two `.tmpl` files manually. Fix: future codex dispatches run from repo root to widen the sandbox.
3. **Template title-case** (Phase B): Codex's generated test expected `Dimension: traceability` (title case) but my review template had `DIMENSION: traceability` (uppercase). Fixed by adjusting the template; the test's expectation was the canonical form.

### 4.3 Phase 017 patterns respected

- **Atomic-ship groups**: config + YAML + templates + tests all ship together (per tasks.md §Atomic-Ship Groups).
- **Symmetric implementation**: bit-identical `executor` block structure across research/review configs; identical two-branch YAML structure across 4 YAMLs; parallel CONTRACT sections in both SKILL.md files.
- **Invariant preservation**: `if_native` branch preserves `agent: deep-*` + `model: opus` dispatch exactly.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 5. Decisions Respected

See `decision-record.md` for the five ADRs that drove this implementation:
- **ADR-001**: Dispatch-branch in YAML, not loop replacement (honored).
- **ADR-002**: Config block lives in per-skill `deep_*_config.json`, not `runtime_capabilities.json` (honored).
- **ADR-003**: Ship cli-codex; stub cli-copilot/gemini/claude-code (honored).
- **ADR-004**: Stdin piping for codex exec (honored — YAML emits `- < {prompt-path}`).
- **ADR-005**: Co-ship sk-deep-review symmetry in same batch (honored).
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 6. Verification

### 5.1 Type check
```
cd .opencode/skill/system-spec-kit/mcp_server
npx tsc --noEmit --composite false -p tsconfig.json
# → clean (no output)
```

### 5.2 Unit tests
```
npx vitest run tests/deep-loop/
# → Test Files  4 passed (4)
# → Tests  40 passed (40)
```

### 5.3 YAML structure grep
```
grep -n "if_native\|if_cli_codex\|branch_on\|post_dispatch_validate\|record_executor_audit" \
  .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml \
  .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml \
  .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml \
  .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml
# → 5 markers present in all 4 files
```

### 5.4 Spec-folder validation
```
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/001-executor-feature
# → Errors: 0, Warnings: 5 (non-blocking)
# → RESULT: PASSED WITH WARNINGS
```

### 5.5 What's NOT verified yet (follow-ups)

- **Live cli-codex smoke run** on a throwaway spec folder: `/spec_kit:deep-research :auto "test" --max-iterations=1 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast`. Integration verified via unit tests + YAML structure; live run deferred to Track 2 which IS the first real cli-codex invocation against a real topic (Phase 017 refinements research).
- **Native-path bit-identical byte-diff** against pre-feature baseline: visually inspected that `if_native` preserves exact dispatch; no automated byte-diff harness was built. Low risk because the branch's content is unchanged from pre-feature.
- **`cli-codex-dispatch.int.vitest.ts`** full integration test with mocked codex exec: DEFERRED. Unit-test coverage for each shared module is thorough (40 tests). Integration test can be added as post-ship follow-up without blocking Track 2.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

1. **Integration test gap**: no end-to-end `cli-codex-dispatch.int.vitest.ts` that actually runs codex exec mocked. Unit coverage is strong (40 tests); integration deferred. Risk: YAML schema fields like `context_source: "rendered_prompt_pack"` are interpretative — the YAML runtime must honor them. Track 2's live run will surface any gap.
2. **`record_executor_audit` is file-replacing**: merges the audit block into the last JSONL line by reading the file, mutating, and rewriting. If the state log is being written concurrently by another process during the brief read-mutate-write window, the last record could be lost. Acceptable risk: iteration dispatch is sequential within a run; concurrent writers don't exist in the current architecture.
3. **Sandbox scope during codex dispatch**: codex's `--sandbox workspace-write` was scoped to its cwd subtree. Work requiring edits outside that subtree (e.g., the two `.tmpl` files) needed manual intervention. For future codex dispatches, invoke from repo root to widen sandbox.
4. **Non-strict validate.sh**: strict mode requires `implementation-summary.md` + AI_PROTOCOL scaffolding. This doc lands now; AI_PROTOCOL is Level 3+ scope and intentionally omitted.
5. **Template metadata tokens**: the templates must avoid `{placeholder}` patterns in prose (e.g., "Tokens use {variable_name} syntax") because the renderer would try to substitute them. Fixed mid-session; documented in the templates themselves.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deferred -->
## 7. DEFERRED TO PHASE 019 OR FOLLOW-UP

| Item | Reason | Deferred to |
|------|--------|-------------|
| `cli-codex-dispatch.int.vitest.ts` full integration test | Unit coverage is strong; integration test can ship post-hoc | Phase 019 or standalone follow-up |
| `cli-copilot`, `cli-gemini`, `cli-claude-code` wiring | Out of scope per ADR-003 (scope: cli-codex only) | Separate spec packets per CLI |
| Parallel executor dispatches (3-concurrent cli-copilot per `feedback_copilot_concurrency_override`) | Current skills are sequential; parallelization is architectural | Separate spec |
| Native-path bit-identical byte-diff harness | Visual inspection suffices for this pass; automated diff needs fixture storage | Phase 019 if regressions appear |
| `executor.configProfile` support (`-p, --profile`) | Not in initial P1 set | Phase 019 P2 |
<!-- /ANCHOR:deferred -->

---

<!-- ANCHOR:handoff -->
## 8. HANDOFF — TRACK 2

Track 2 of the approved plan ( `/Users/michelkerkmeester/.claude/plans/research-and-refinements-improvements-cheerful-scott.md`) is the 30-iteration deep-research pass on Phase 017 refinements using the newly-shipped cli-codex executor.

### Invocation recipe

```bash
/spec_kit:deep-research :auto "Post-Phase-017 refinement, improvement, bug, and follow-up surface under .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/001-foundational-runtime/. Investigate: metadata-freshness regen stability (H-56-1 aftermath + description.json auto-regen preserve-field gaps), code-graph readiness vocabulary completeness across the 7 sibling handlers, NFKC/evidence-marker/lint false-positive surfaces, retry-budget policy calibration (N=3 empirical basis), AsyncLocalStorage caller-context propagation edge cases, Copilot autonomous-execution hardening preconditions, Wave-D deferred P2 coupling risk (R55-P2-002/003/004), and 16-folder canonical-save sweep ordering invariants. Deliverable: Phase-019 scoping document with prioritized findings (P0/P1/P2), reproduction paths, and risk-ranked remediation candidates." \
  --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/001-executor-feature/ \
  --max-iterations=30 \
  --convergence=0.05 \
  --executor=cli-codex \
  --model=gpt-5.4 \
  --reasoning-effort=high \
  --service-tier=fast \
  --executor-timeout=900
```

### Artifact locations (per approved plan)

Track-root research variant: artifacts land at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/017-sk-deep-cli-runtime-execution/001-executor-feature/research/017-sk-deep-cli-runtime-execution-pt-01/` (the track root's `research/` folder + matching subfolder name).

### Success criteria

- 30 iterations produce both iteration markdown AND valid JSONL delta with `executor` audit field on every record.
- Convergence detected OR max iterations exhausted with `answered_ratio > 0.7`.
- The research synthesis document (auto-generated by the deep-research command) includes a Phase-019 scoping table with prioritized findings.
- Dashboard shows no `schema_mismatch` events or unresolved `blocked_stop`.
<!-- /ANCHOR:handoff -->

---

<!-- ANCHOR:verdict -->
## 9. VERDICT

**PASS (with advisories for deferred items in §7)**

The executor-selection feature ships with full unit-test coverage, symmetric across both iterative skills, preserves all YAML-owned invariants per SKILL.md:46-52, and honors the user's architectural principle: *"CLI executor runs INSIDE the command's workflow, not as a replacement."*

Track 2 (30-iter cli-codex research) is unblocked and ready to run.
<!-- /ANCHOR:verdict -->
