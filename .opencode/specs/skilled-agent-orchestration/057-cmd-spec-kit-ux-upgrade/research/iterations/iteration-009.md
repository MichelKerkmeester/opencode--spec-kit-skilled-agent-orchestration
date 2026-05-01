# Focus

Convergence check: re-validate the ranked SPAR-Kit adoption findings against direct external and internal source paths, fill evidence gaps, and answer the remaining charter questions before final synthesis.

# Actions Taken

1. Read the active strategy, config, state log, empty registry, and iterations 6-8. The registry still has no reducer-populated findings, so the prior iteration narratives remain the working source of truth.
2. Re-checked SPAR source paths for installer policy, lifecycle framing, tool discovery, question-budget recommendations, and persona coverage: `external/install-root/targets/*.json`, `external/lib/repo-bootstrap.mjs`, `external/install-root/.spar-kit/.local/tools.yaml`, `external/README.md`, `external/install-root/skills/spar-*`, and `external/Research/Personas/Personas.md`.
3. Re-checked internal source paths for command taxonomy, hook contracts, Gate 3, template architecture, validator sensitivity, and runtime voice boundaries: `.opencode/command/**`, `.opencode/skill/system-spec-kit/**`, `.opencode/skill/mcp-code-mode/SKILL.md`, `AGENTS.md`, `.codex/AGENTS.md`, and `.opencode/agent/**`.
4. Searched for the unresolved `fs-enterprises` instruction root and recounted the current `.opencode/specs` corpus. No `fs-enterprises` path was found under the searched `Code_Environment` depth. The current local corpus has 736 `spec.md` files and 750 numbered spec-like directories under `.opencode/specs`, so migration risk is broader than the earlier active-only count.

# Findings

## F-iter009-001: Gate copy and question budget is the strongest low-risk adoption

Verdict: `adapt`
Follow-on: `058-gate-copy-and-question-budget`

External evidence is strong. SPAR's planning retrospective recommends a hard question cap, separates `Key Follow-Up Questions` from `Optional Follow-Ups`, and says optional questions should only appear when the budget allows. SPAR Plan also already distinguishes material blockers from refinements in its follow-up behavior.

Internal evidence is also strong. `AGENTS.md` already requires consolidated questions, `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml` already caps clarification to high-impact items, and command setup flows already gather required inputs before dispatch. This is copy and intake ergonomics, not command semantics.

Risk: low. The only constraint is preserving machine-readable Gate 3 answer options when the copy changes.

## F-iter009-002: Phase-boundary copy is adoptable, but command collapse is not

Verdict: `adapt`
Follow-on: `059-phase-boundary-copy-pass`

External evidence is strong. SPAR's README and four phase skills make Specify, Plan, Act, and Retain legible as boundaries: Specify clarifies intent without implementation, Plan stabilizes execution, Act implements against the plan, and Retain closes out durable memory.

Internal evidence supports a copy pass but rejects behavioral collapse. `.opencode/command/spec_kit/README.txt` lists plan, implement, deep-research, deep-review, resume, intake-only plan, and complete; the command docs and YAML assets encode mode, feature flags, executor settings, validation rules, and lifecycle behavior that SPAR's four verbs do not represent.

Risk: low for boundary language; medium if a later packet tries to remove existing command distinctions.

## F-iter009-003: The command surface needs a four-axis taxonomy, not a two-axis matrix

Verdict: `adapt`
Follow-on: `060-command-taxonomy-and-compatibility-matrix`

Q2 is now answered. A simple mode x scope model would break or obscure existing contracts. Internal sources show at least four independent dimensions:

- Execution mode: `:auto`, `:confirm`, and doctor-specific `:apply` / `:apply-confirm`.
- Feature flags or workflow modifiers: `:with-phases`, `:with-research`, `--intake-only`, `--scope`, `--dry-run`, `--skip-tests`, and tier/scope flags.
- Lifecycle intent: plan, implement, complete, resume, deep-research, deep-review, create, doctor, improve, memory.
- Executor/provenance: deep-research supports native and CLI executor config with model, reasoning effort, service tier, and timeout.

External SPAR lifecycle copy can sit above this taxonomy, but it cannot replace it.

Risk: medium. Skill-advisor examples, Gate 3 matching, command README syntax, YAML start conditions, and docs all need synchronized edits.

## F-iter009-004: Declarative ownership manifest remains high-value as policy, not installer behavior

Verdict: `adapt`
Follow-on: `061-declarative-ownership-manifest`

External evidence is strong. SPAR target configs use `replace`, `seed_if_missing`, `managed_block`, and `replace_managed_children`; `repo-bootstrap.mjs` centralizes those policies and applies target-specific payloads after the default target.

Internal evidence supports the need but constrains the adoption. `AGENTS.md`, `.codex/AGENTS.md`, `.opencode/command`, `.opencode/agent`, `.opencode/skill/system-spec-kit/templates`, and runtime hook docs all define cross-runtime ownership in prose instead of one policy manifest.

Risk: medium-high. The manifest should start as inventory plus lint. It should not mutate AGENTS-like instruction files except inside explicitly owned generated blocks.

## F-iter009-005: Tool ledger should be diagnostic and operator-visible

Verdict: `adapt`
Follow-on: `062-tool-discovery-ledger`

External evidence is strong. SPAR seeds `.spar-kit/.local/tools.yaml` with machine-readable CLI checks, purpose fields, installed booleans, reasons, and a `checked_at` timestamp; `spar-init` updates the file in place.

Internal evidence rejects static authority. Skill Advisor hook docs, Spec Kit Memory MCP schemas, Code Mode discovery, and doctor commands are live routing and capability surfaces. A ledger helps users inspect expected tools and stale health state, but routing truth must remain in live hooks and MCP/tool schemas.

Risk: medium. The ledger needs an explicit authority boundary and probably belongs under `/doctor` or explicit refresh, not write-on-read startup behavior.

## F-iter009-006: Template manifest work should classify source roles, not delete consumer artifacts

Verdict: `adapt-narrowly`
Follow-on: `063-template-inventory-and-manifest`

External evidence is clear: SPAR's template contract is intentionally small, with authored `spec.md` and `plan.md` templates plus package prep for install assets. Internal evidence is materially different. system-spec-kit has CORE + ADDENDUM composition, level folders, phase-parent templates, required metadata, `implementation-summary.md`, `checklist.md`, `decision-record.md`, and strict validation hooks.

Q3 is therefore answered with a boundary: compress and manifest the source layer; keep validation-critical consumer artifacts.

Risk: medium. A file-by-file inventory is required before any manifest becomes executable.

## F-iter009-007: Runtime target manifest should follow ownership semantics

Verdict: `adapt`
Follow-on: `064-runtime-target-manifest`

External evidence is strong. SPAR's install targets map payloads to Codex, OpenCode, Claude, Cursor, Gemini, Copilot, Windsurf, and general layouts using a compact target config.

Internal evidence says placement is not enough. Runtime directories, hook contracts, plugins, native MCP, prompt-time advisor delivery, and YAML command workflows all have behavior attached to them. A target manifest without an ownership manifest would make placement look solved while behavior remains unsynchronized.

Risk: medium-high. Keep this after `061-*`.

## F-iter009-008: Personas belong in evaluation fixtures and audience maps

Verdict: `adapt`
Follow-on: `065-persona-evaluation-fixtures`

External evidence has six personas, not five: Vibe Vera, Promptwright Pete, Terminal Tess, Manager Maya, Maintainer Max, and Consultant Cass. This corrects the original charter wording.

Internal evidence supports persona use as testing material. `.codex/AGENTS.md` defines the senior-engineer voice; `.opencode/agent/*.md` define role contracts. Personas can test whether docs and commands work for different operators, but should not become runtime identities.

Risk: low. Keep personas outside execution prompts.

## F-iter009-009: Static tools.yaml as routing authority should be rejected

Verdict: `reject-with-rationale` plus `take-inspiration`
Follow-on: `066-tool-discovery-authority-boundary`

SPAR's static ledger fits a small CLI prerequisite list. It does not fit dynamic MCP, Code Mode, skill-advisor hooks, graph freshness states, or runtime-provided tool exposure. The internal system should borrow the operator inventory UX and reject static routing authority.

Risk: low if documented before `062-*` implementation.

## F-iter009-010: Hard 60-line instruction caps should be rejected

Verdict: `reject-with-rationale` plus `adapt-narrowly`
Follow-on: `067-generated-block-budget`

External evidence is specific to SPAR's tiny boot pointer model: `spar-init` recommends trimming `AGENTS.md` when it exceeds 60 lines, and the installed `AGENTS.md` / `CLAUDE.md` files are brief.

Internal evidence is incompatible with a hard global cap. Public and Codex instruction files carry hard gates, memory save behavior, code-search routing, validation, runtime precedence, and voice policy. The portable pattern is a budget for generated managed blocks, not a cap on human-authored instruction files.

Risk: low if framed as lint guidance.

## F-iter009-011: Named personas inside runtime prompts should be rejected

Verdict: `reject-with-rationale`
Follow-on: `068-runtime-persona-boundary`

SPAR's persona research is useful product design input. Internal runtime prompts already have a deliberate voice and role model. Injecting Vera, Pete, Tess, Maya, Max, or Cass into command execution prompts would add a competing identity layer and weaken terse, calibrated senior-engineer behavior.

Risk: low. Use the personas in test fixtures, docs review, and onboarding audits only.

## F-iter009-012: Two-template consumer architecture should be rejected

Verdict: `reject-with-rationale` plus `adapt-narrowly`
Follow-on: `069-template-compression-boundary`

External evidence supports SPAR's small artifact model. Internal evidence does not. `validate.sh --strict`, phase-parent detection, graph metadata refresh, continuity anchors, and Level 1-3+ docs all depend on richer consumer artifacts.

Risk: medium. Template source compression is viable; consumer artifact deletion is not.

## F-iter009-013: npm installer distribution should not lead internal adoption

Verdict: `reject-for-now` plus `take-inspiration`
Follow-on: fold into `064-runtime-target-manifest`

Q6 is answered. SPAR's `npx @spar-kit/install --target` pattern is good UX for a public package. The internal system's cross-runtime hook reality, private/local skill installation, MCP setup, and command-owned YAML workflows make npm distribution a maintenance multiplier right now. The useful adoption is target manifest clarity, not public installer mechanics.

Risk: low if deferred explicitly.

# Questions Answered

- Q1: Partially answered. The smallest safe managed-block subset is manifest + lint + generated-block budgets, not installer-owned instruction rewrites. Full triad validation remains blocked by the missing `fs-enterprises` path.
- Q2: Answered. A two-axis mode x scope matrix is unsafe; use execution mode + feature flags + lifecycle intent + executor/provenance.
- Q3: Answered with a boundary. A declarative manifest can compress source-layer ownership, but the 99-template tree cannot collapse into SPAR's two-template consumer model without breaking validation and recovery contracts.
- Q4: Answered. SPAR personas translate cleanly as evaluation fixtures and audience maps. Terminal Tess, Maintainer Max, and Manager Maya map closest to internal operator needs; Vera, Pete, and Cass are useful onboarding and portability tests. None should become runtime identities.
- Q5: Answered. SPAR's seed/update ledger improves discoverability when treated as diagnostic inventory. It should not replace skill-advisor or MCP discovery.
- Q6: Answered. The npm installer pattern is not worth leading with internally. Runtime target manifests and ownership semantics should come first.
- Q7: Answered. SPAR's Key vs Optional split should become Required To Proceed vs Optional Refinements in gate and planning copy, with optional questions omitted when the budget is tight.
- Q8: Answered. Evidence is now strong across all six axes; thin areas are concrete `fs-enterprises` path validation, baseline strict-validation failure sampling across the corpus, and final ownership of the proposed diagnostic ledger.

# Questions Remaining

- Locate the real `fs-enterprises` instruction root before claiming full Public + Barter + fs-enterprises sync-triad coverage.
- Run a sampled or automated strict-validation baseline against the current spec corpus before `063-*` or `069-*` changes. The current local corpus count is 736 `spec.md` files and 750 numbered spec-like directories under `.opencode/specs`.
- Decide ownership for the diagnostic tool ledger: `/doctor`, install/init, memory-backed status, or explicit refresh command.

# Next Focus

Iteration 10 should synthesize the final ranked adoption backlog and convergence decision. Keep the ranked order from this iteration unless a final check uncovers a blocker, and call out the three residual gaps as follow-on prerequisites rather than blockers to the research conclusion.
