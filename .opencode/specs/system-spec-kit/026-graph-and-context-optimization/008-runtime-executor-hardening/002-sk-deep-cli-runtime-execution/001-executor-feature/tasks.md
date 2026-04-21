---
title: "Tasks: Deep-Loop CLI Executor Selection for Iterative Skills"
description: "Task breakdown for Phase 018: 23 tasks across 3 standard phases (Setup / Implementation / Verification). Internally grouped into 8 sub-waves (A-H) with acceptance criteria + file paths + atomic-ship markers."
trigger_phrases: ["018 tasks", "deep-loop executor tasks", "executor kind tasks"]
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/001-executor-feature"
    last_updated_at: "2026-04-18T00:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Begin T-CFG-01 (Phase 1 Setup / Sub-wave A)"
    blockers: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Deep-Loop CLI Executor Selection for Iterative Skills

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable with sibling tasks in the same sub-wave |
| `[B]` | Blocked on another task |
| `[A]` | Member of an atomic-ship group (must ship together) |

**Task ID format**: `T-<CAT>-NN` where CAT ∈ {CFG, PPT, YMR, YMV, FLG, DOC, TST, VAL, SUM}.

**Sub-wave mapping** (internal structure within each standard phase):
- Phase 1 (Setup) = Sub-waves A (Config) + B (Prompt-pack templates)
- Phase 2 (Implementation) = Sub-waves C (Research YAML) + D (Review YAML) + E (Setup flags) + F (Contract docs)
- Phase 3 (Verification) = Sub-waves G (Tests) + H (Finalization)
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Sub-wave A — Config Schema (REQ-001, REQ-015)

- [ ] **T-CFG-01** [A] Extend `deep_research_config.json` with `executor` block.
  - File: `.opencode/skill/sk-deep-research/assets/deep_research_config.json`
  - Add: `executor: { kind: "native", model: null, reasoningEffort: null, serviceTier: null, sandboxMode: null, timeoutSeconds: 900 }`
  - Accept: `kind` enum {native, cli-codex, cli-copilot, cli-gemini, cli-claude-code}; kind!=native requires model
  - Acceptance: Zod schema validates; default loads as native.
- [ ] **T-CFG-02** [A] Mirror to `deep_review_config.json`.
  - File: `.opencode/skill/sk-deep-review/assets/deep_review_config.json`
  - Same schema.
  - Acceptance: diff vs. deep_research executor block is zero (bit-identical).
- [ ] **T-CFG-03** [P] Create shared executor-config loader + validator.
  - File: `mcp_server/lib/deep-loop/executor-config.ts` (NEW)
  - Zod schema, load function, validation function, precedence resolver (CLI > file > defaults).
  - Reject unwired kinds (cli-copilot/gemini/claude-code) with message pointing to future spec.
  - Reject cli-codex when model is null.
  - Acceptance: unit tests in T-TST-01 green.

### Sub-wave B — Prompt-Pack Templates (REQ-010, REQ-022)

- [ ] **T-PPT-01** [A] Create `prompt_pack_iteration.md.tmpl` for sk-deep-research.
  - File: `.opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl` (NEW)
  - Extract content from current `spec_kit_deep-research_auto.yaml:477-497` `context:` field.
  - Variables: `{state_summary}`, `{research_topic}`, `{iteration}`, `{max_iterations}`, `{focus}`, `{remaining_questions}`, `{last_3_summaries}`, `{state_paths_*}`.
  - Must include: LEAF constraint, 3-5 actions, 12 tool-call budget, output contract (iteration-NNN.md + JSONL delta), `graphEvents` optional.
  - Acceptance: renders with bound variables; matches agent-context semantics.
- [ ] **T-PPT-02** [A] Create `prompt_pack_iteration.md.tmpl` for sk-deep-review.
  - File: `.opencode/skill/sk-deep-review/assets/prompt_pack_iteration.md.tmpl` (NEW)
  - Mirror structure; review-flavored (dimension focus instead of research focus).
  - Acceptance: structural diff vs. research template shows only content-domain changes, no structural divergence.
- [ ] **T-PPT-03** [P] Create template renderer.
  - File: `mcp_server/lib/deep-loop/prompt-pack.ts` (NEW)
  - Function `renderPromptPack(templatePath, variables): string`. Substitutes `{varname}` tokens. Throws on unbound variables.
  - Acceptance: unit tests in T-TST-02 green.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Sub-wave C — Research YAML Dispatch Branch (REQ-002, REQ-003, REQ-005, REQ-014, REQ-016)

- [ ] **T-YMR-01** [A] Refactor `spec_kit_deep-research_auto.yaml:465-498` into two-branch dispatch.
  - Remove hardcoded `model: opus` at line 469; replace with branch selector based on `config.executor.kind`.
  - `if_native` branch: existing `dispatch: { agent: deep-research, model: opus, context: {rendered-prompt} }`.
  - `if_cli_codex` branch: `command: codex exec --model {M} -c model_reasoning_effort="{E}" -c service_tier="{T}" --sandbox workspace-write - < {prompt-path}`.
  - Both branches share pre_dispatch (prompt render) and post_dispatch (validate + audit).
  - Acceptance: native-path regression (T-VAL-01) passes bit-identical.
- [ ] **T-YMR-02** [A] Mirror refactor into `spec_kit_deep-research_confirm.yaml:527-560`.
  - Same structure; preserve confirm-mode pauses.
  - Acceptance: diff vs. auto shows only confirm-pause lines differ.
- [ ] **T-YMR-03** [P] Create post-dispatch validator.
  - File: `mcp_server/lib/deep-loop/post-dispatch-validate.ts` (NEW)
  - Function `validateIterationOutputs(iterationFile, stateLogPath): Result<OK | SchemaMismatch>`.
  - Assertions: iteration file exists + non-empty; JSONL delta appended since last iteration; delta has `newInfoRatio`, `status`, `focus`.
  - On failure: emit canonical `schema_mismatch` conflict event (use existing reducer path).
  - Acceptance: unit tests pass; integration tests pass.
- [ ] **T-YMR-04** [A] Wire `record_executor_audit` step into YAML after post_dispatch_validate.
  - Appends `executor: {kind, model, reasoningEffort, serviceTier}` to the iteration's JSONL delta.
  - No-op when executor.kind == native (audit unnecessary for default).
  - Acceptance: JSONL audit field tests pass (T-TST-04).

### Sub-wave D — Review YAML Dispatch Branch (REQ-006)

- [ ] **T-YMV-01** [A] Mirror Phase C changes into `spec_kit_deep-review_auto.yaml:575-608` dispatch block.
  - Same two-branch structure as T-YMR-01.
  - Substitute `sk-deep-review/assets/prompt_pack_iteration.md.tmpl` path.
  - Acceptance: review iteration tests pass unchanged with native default.
- [ ] **T-YMV-02** [A] Mirror into `spec_kit_deep-review_confirm.yaml`.
  - Acceptance: structural parity with T-YMR-02.

### Sub-wave E — Setup Flag Parsing (REQ-011)

- [ ] **T-FLG-01** Add flag parsing to `.opencode/command/spec_kit/deep-research.md` setup phase.
  - File: `.opencode/command/spec_kit/deep-research.md`
  - New flags: `--executor=<kind>`, `--model=<id>`, `--reasoning-effort=<level>`, `--service-tier=<tier>`, `--executor-timeout=<sec>`.
  - Precedence: CLI flag > config file > default.
  - Consolidated setup prompt: include executor question only when unset in all sources AND no user hint in topic.
  - Acceptance: setup parses all flags into `config.executor.*`; parses nothing when no flags (uses defaults).
- [ ] **T-FLG-02** Mirror to `.opencode/command/spec_kit/deep-review.md`.
  - Acceptance: parity with research.

### Sub-wave F — Contract Documentation (REQ-012, REQ-013)

- [ ] **T-DOC-01** Replace `sk-deep-research/SKILL.md:61` forward-looking note with CONTRACT section.
  - Documents: supported executor kinds, invariants, failure modes, JSONL audit field, template path.
  - DQI score target: ≥ 0.85 via `validate_document.py`.
  - Acceptance: DQI met; manual review confirms contract matches implementation.
- [ ] **T-DOC-02** Mirror to `sk-deep-review/SKILL.md:63`.
- [ ] **T-DOC-03** [P] Add Executor Resolution subsection to `.opencode/skill/sk-deep-research/references/loop_protocol.md` §3 Dispatch Agent.
  - Documents: branch resolution, post_dispatch_validate interaction, stuck_recovery path.
- [ ] **T-DOC-04** [P] Mirror to `.opencode/skill/sk-deep-review/references/loop_protocol.md` §3.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Sub-wave G — Test Suites (REQ-001 through REQ-016)

- [ ] **T-TST-01** [A] Write `__tests__/deep-loop/executor-config.vitest.ts`.
  - Cases: accept native, accept cli-codex with model, reject cli-codex without model, reject unwired kinds with spec-pointer error, precedence CLI > file > default, timeout default 900.
- [ ] **T-TST-02** [A] Write `__tests__/deep-loop/prompt-pack-render.vitest.ts`.
  - Cases: render with all vars, unbound variable throws, idempotent rendering (same input → same output), both templates (research + review) load.
- [ ] **T-TST-03** [A] Write `__tests__/deep-loop/dispatch-branch.vitest.ts`.
  - Cases: config.kind==native → if_native branch selected; config.kind==cli-codex → if_cli_codex branch; malformed config rejected before branch.
- [ ] **T-TST-04** [A] Write `__tests__/deep-loop/jsonl-audit-field.vitest.ts`.
  - Cases: audit field appended on cli-codex path; no audit field on native path; backward-compat (JSONL without audit field still parses).
- [ ] **T-TST-05** [A] Write `__tests__/deep-loop/cli-codex-dispatch.int.vitest.ts` (integration).
  - Mock `codex exec` to write valid iteration + JSONL delta.
  - End-to-end: 1 iteration, verify reducer picks it up, verify audit field in JSONL, verify post_dispatch_validate passes.
  - Failure path: mock failure scenarios (missing file, missing JSONL, missing required fields) → assert `schema_mismatch` emitted.

### Sub-wave H — Finalization

- [ ] **T-VAL-01** Native-path regression smoke.
  - Run 1 iteration on temp spec folder with no executor flags.
  - Capture output bytes; diff vs. pre-feature baseline (stored under scratch/ for the duration of the packet).
  - Acceptance: bit-identical.
- [ ] **T-VAL-02** cli-codex smoke on temp spec folder.
  - Invoke `/spec_kit:deep-research :auto "test topic" --max-iterations=1 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast` on throwaway folder.
  - Acceptance: produces valid iteration-001.md + JSONL delta + executor audit field.
- [ ] **T-VAL-03** Review smoke parity (both native and cli-codex).
  - Same pattern on `/spec_kit:deep-review :auto`.
- [ ] **T-VAL-04** `validate.sh --strict` on 018 packet.
  - Run: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/001-executor-feature --strict`
  - Acceptance: exits 0.
- [ ] **T-SUM-01** Populate the packet implementation-summary document with shipped state.
  - Capture: commits, files touched, LOC, test counts, verdict.
- [ ] **T-SUM-02** Refresh `description.json` + `graph-metadata.json`.
  - Invoke `generate-context.js` with session context JSON.
  - Acceptance: both files regenerated; memory index includes 018 packet.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 23 tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All P0 acceptance criteria from spec.md §4 verified
- [ ] P1 criteria verified OR deferred with user approval
- [ ] `tsc --noEmit` clean
- [ ] All vitest suites green
- [ ] `validate.sh --strict` on 018 exits 0
- [ ] Native-path regression confirmed bit-identical
- [ ] cli-codex smoke confirmed end-to-end
- [ ] Review parity verified
- [ ] Docs DQI ≥ 0.85

### Atomic-Ship Groups (Single PR)

- **Group 1 — Config + YAML + Templates** [A]: T-CFG-01, T-CFG-02, T-PPT-01, T-PPT-02, T-YMR-01, T-YMR-02, T-YMR-04, T-YMV-01, T-YMV-02
- **Group 2 — Tests** [A]: T-TST-01 through T-TST-05
- **Group 3 — Shared libs** [P]: T-CFG-03, T-PPT-03, T-YMR-03 (parallelizable internally; all three gate Group 1)

Recommended ship: Group 3 first (libs + unit tests), then Groups 1+2 together (YAML+config+templates+integration tests), then docs (Phase F) separately.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification**: `checklist.md`
- **Decision Records**: `decision-record.md`
- **Parent**: `../` (026 root)
- **Predecessor**: `../001-foundational-runtime/`
- **Session Plan**: `/Users/michelkerkmeester/.claude/plans/research-and-refinements-improvements-cheerful-scott.md`
<!-- /ANCHOR:cross-refs -->
