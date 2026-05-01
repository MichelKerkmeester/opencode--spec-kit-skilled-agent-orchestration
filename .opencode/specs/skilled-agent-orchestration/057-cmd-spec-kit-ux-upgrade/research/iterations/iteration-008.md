# Focus

Risk + edge cases for the ranked SPAR-Kit adoption backlog: sync triad, hook contracts, advisor scoring, `validate.sh`, and migration risk across the existing spec folder corpus. Identify reject-with-rationale candidates.

# Actions Taken

1. Read the active strategy, state-log tail, findings registry, and iteration 7 ranking. The registry is still empty, so this pass used iteration 7 plus direct source evidence as the working backlog.
2. Read SPAR installer surfaces: `external/lib/repo-bootstrap.mjs`, `external/lib/install-engine.mjs`, and `external/install-root/targets/{default,codex,opencode}.json`.
3. Read internal contract surfaces: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`, and `.opencode/skill/system-spec-kit/scripts/lib/shell-common.sh`.
4. Scanned advisor scoring and command-mode surfaces for thresholds, suffixes, and mode/scope contracts; counted the current spec corpus with `find`.
5. Checked nearby instruction roots. Public and Barter instruction roots are visible; no `fs-enterprises` instruction root appeared in the searched `Code_Environment` depth, so full sync-triad validation remains incomplete.

# Findings

1. `061-declarative-ownership-manifest` is still high-value, but adopting SPAR managed blocks as an installer behavior is too risky for our instruction files. SPAR's `repo-bootstrap.mjs` has one block namespace, strips all SPAR pairs, preserves existing files by prepending when no marker exists, and leaves malformed marker cases unchanged with a warning. That is reasonable for SPAR's compact generated `AGENTS.md`, but our Public `AGENTS.md` and `.codex/AGENTS.md` contain hard gates, memory rules, validation policy, and runtime-specific precedence. Adoption should be a manifest and lint policy first, with generated blocks limited to clearly owned regions. Reject any broad "installer owns AGENTS.md" direction.

2. `060-command-surface-matrix` should not be framed as a 2-axis collapse. Internal command docs explicitly treat `:auto` and `:confirm` as execution modes, while `:with-research` and `:with-phases` are feature flags that modify the base workflow. Deep research and deep review also require attached command suffixes and executor config. A safer taxonomy is lifecycle copy over the current commands plus separate axes for execution mode, feature flags, lifecycle phase, and executor. Reject replacing command semantics with Specify/Plan/Act/Retain; adapt SPAR as navigation language only.

3. `062-tool-discovery-ledger` must stay diagnostic, not authoritative. SPAR seeds `.spar-kit/.local/tools.yaml` once, which works for a small CLI prerequisite list. Internally, the Skill Advisor hook uses live/stale/absent/unavailable freshness, fail-open behavior, prompt-safe diagnostics, and default `0.8 / 0.35` confidence/uncertainty thresholds. Advisor code also exposes lane attribution and threshold semantics. A static ledger can improve operator inspection, but must never feed routing, threshold overrides, or MCP capability truth without an explicit reconciliation layer.

4. `063-template-inventory-and-manifest` and `069-template-compression-boundary` carry migration risk because the current corpus is large and validator-sensitive. Current counts from this workspace: 736 `spec.md` files and 478 numbered spec-like directories, not the approximate 800 sometimes cited in discussion. `validate.sh --strict` promotes warnings to blocking failures, phase-parent detection is structural, and the validator expects metadata and required docs to line up with packet shape. Any template manifest work needs inventory, dry-run validation, legacy grandfathering rules, and no consumer artifact deletion.

5. `064-runtime-target-manifest` should follow ownership semantics, not lead them. SPAR's target configs map payload entries to runtime paths with `replace`, `seed_if_missing`, `managed_block`, and `replace_managed_children`. Our runtime reality includes prompt hooks, plugin bridges, `.opencode`, `.codex`, `.claude`, `.gemini`, native MCP, and command-owned YAML workflows. A target manifest without an ownership manifest risks making placement look solved while behavior contracts remain unsynchronized.

6. Persona adoption remains safest as evaluation fixtures. SPAR personas are useful for testing whether command UX is legible to different operator types. Putting named personas into runtime prompts would conflict with the existing senior-engineer voice, role-specific agents, and hard-gate instruction style. Keep `065-persona-evaluation-fixtures`; reject named persona injection in `068-runtime-persona-boundary`.

# Questions Answered

- Q1 is partially answered: the smallest viable managed-block subset is "manifest + lint + tiny generated block budgets", not installer-owned instruction rewrites. Full triad validation still lacks the `fs-enterprises` path.
- Q2 is answered enough to update the ranking: a 2-axis mode x scope collapse is unsafe. Use a 4-axis taxonomy or SPAR lifecycle copy over existing semantics.
- Q5 is answered at the authority boundary: a SPAR-style ledger improves operator inventory only if live hooks, MCP schemas, and advisor scoring remain authoritative.
- Q8 is updated: thin evidence remains around `fs-enterprises`, exact corpus migration failure modes, and the concrete command taxonomy for `/create`, `/doctor`, `/improve`, and `/memory`.

# Questions Remaining

- Where is the real `fs-enterprises` instruction root, and does it share the same generated-block constraints as Public and Barter?
- Which of the 736 current `spec.md` files fail strict validation today, before any template manifest or metadata migration?
- Should `060-command-surface-matrix` become a lifecycle navigation packet, or split into two packets: command taxonomy first, UX copy second?
- Who owns the diagnostic tool ledger if adopted: `/doctor`, install/init, or memory-backed status surfaces?

# Next Focus

Iteration 9 should close the command taxonomy and migration-readiness gaps: build the concrete command/suffix/flag/executor matrix across `/spec_kit`, `/create`, `/memory`, `/doctor`, and `/improve`; then sample strict validation failure modes from the existing spec corpus before synthesis.
