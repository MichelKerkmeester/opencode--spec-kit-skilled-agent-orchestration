# Focus

Cross-cut synthesis over iterations 1-5. Pull together the highest-impact adoption candidates, identify coverage gaps, and normalize adoption tags before the final ranking pass.

# Actions Taken

1. Read the active strategy, state log tail, and findings registry. The state log contains iterations 1-5, while `findings-registry.json` is still empty, so this pass used the written iteration narratives as source-of-truth.
2. Read `iteration-001.md` through `iteration-005.md` to extract cross-axis findings from installer/distribution, instruction files, template architecture, tool discovery, and personas/tone.
3. Checked internal suffix/mode references for `:auto`, `:confirm`, `:with-phases`, and `:with-research` across `.opencode/command`, `.opencode/skill/system-spec-kit`, and the packet docs.
4. Searched for the unresolved `fs-enterprises` instruction-root evidence and symlink-related instruction context. The broad result set reinforced that symlinked framework consumption is real, but did not resolve a concrete `fs-enterprises` path.

# Findings

## F-011: Highest-impact adaptation is a declarative ownership manifest, not a SPAR-style public installer

Adoption tag: `adapt`

SPAR's reusable pattern appears in three axes at once: target install configs, managed instruction blocks, and asset-policy template handling. Iteration 1 found the target-config installer model more portable than npm distribution. Iteration 2 found the marker-bounded `managed_block` policy safer than full-file replacement. Iteration 3 found the same policy vocabulary useful around the existing CORE + ADDENDUM composer.

The internal adoption should be a manifest that states ownership and materialization policy: `managed_block` for generated instruction sections, `replace_managed_children` for skill/command payloads, `replace` for generated artifacts, and `seed_if_missing` for local/operator-owned files. That manifest should explain what the framework owns before it installs or syncs anything.

Risk: medium-high. The manifest must describe hooks, commands, agents, memory, tools, templates, and symlinked deployments without pretending all runtimes are equivalent.

Follow-on: `058-declarative-ownership-manifest`.

## F-012: Use SPAR's Specify -> Plan -> Act -> Retain lifecycle as navigation copy, not as a command collapse

Adoption tag: `adapt`

SPAR's phase verbs are strong because they give users a small mental map. The internal system should borrow that as an overlay: intake/specify, plan, implement/act, complete/retain, recover/resume, investigate/review. It should not delete or flatten the existing command set.

The extra suffix check in this iteration found the mode/scope problem is broader than the original SPAR comparison. `:auto` and `:confirm` appear across `/spec_kit`, `/create`, `/doctor`, and `/improve`; `:with-phases` is a scope modifier on plan/complete phase workflows; `:with-research` is documented as a complete-only research dispatch path. A two-axis matrix may still be right, but it needs a dedicated compatibility pass against command docs, YAML assets, gate-3 classification, and skill-advisor hook expectations.

Risk: medium. A lifecycle overlay can reduce first-use friction; a premature command collapse can hide execution mode, scope, and lifecycle differences.

Follow-on: `059-command-surface-matrix`.

## F-013: Add operator-visible ledgers, but keep live systems authoritative

Adoption tag: `adapt`

SPAR's local `tools.yaml` works because it answers a narrow operator question: what does this repo expect this machine to have, and what was found last time? Iteration 4 showed the same UX gap exists internally, but the internal system has dynamic sources of truth: skill-advisor hooks, native Spec Kit Memory schemas, Code Mode discovery, CocoIndex status, and runtime-specific CLI availability.

The portable pattern is therefore a repo-local dashboard, not a static registry. It can summarize tool families, health, stale/live status, and setup guidance. It must point back to live discovery APIs instead of mirroring every MCP tool.

Risk: medium. If the ledger becomes authoritative, it will drift. If it is clearly diagnostic, it improves discoverability without weakening the routing systems.

Follow-on: `060-tool-discovery-ledger`.

## F-014: Adopt SPAR's question-budget discipline; reject named personas inside runtime prompts

Adoption tag: `adapt` plus `reject-with-rationale`

Iteration 5 found the clearest immediate UX win: split follow-ups into `Required To Proceed` and `Optional Refinements`. This fits the existing consolidated-question protocol and the internal cap on high-impact clarification, while making gate asks feel less like one undifferentiated wall of questions.

The persona work is useful as evaluation material, not as runtime identity. Terminal Tess, Maintainer Max, and Manager Maya map well to internal priorities; Vibe Vera and Promptwright Pete are useful friction tests; Consultant Cass needs to be included because the source now has six personas, not five. But injecting named personas into `/spec_kit:*` command prompts would compete with the senior-engineer voice, hard gates, and role-based agent contracts.

Risk: low for question budgeting; medium for tone changes around Gate 3 because softened copy must not hide machine-readable reply requirements.

Follow-on: `061-gate-copy-and-question-budget` and `062-persona-evaluation-fixtures`.

## F-015: Reject hard minimalism; adapt source-layer compression only

Adoption tag: `reject-with-rationale` plus `adapt-narrowly`

Two SPAR simplifications should not be copied literally: a full-file 60-line instruction cap and a two-template consumer architecture. The internal system carries hard gates, memory rules, validation contracts, phase-parent behavior, checklists, decision records, and resume expectations. Removing those consumer-facing artifacts would trade visible complexity for hidden coupling.

The useful compression target is the source layer. Keep composed templates and required docs where validators and operators need them. Reduce duplication behind them through manifests, composer checks, generated-block budgets, and optional asset sync.

Risk: low if framed as source-layer cleanup; high if framed as deleting required command/spec surfaces.

Follow-on: fold into `058-declarative-ownership-manifest` and a later template-inventory packet.

# Questions Answered

- Q8 is now answered in cross-cut form: the thinnest evidence remains Q2's mode/scope compatibility, Q1's unresolved `fs-enterprises` instruction path, and the exact internal classification of template files by source/generated/example/optional asset role.
- The top adoption candidates so far are stable enough to group into follow-on packets: declarative ownership manifest, command surface matrix, tool discovery ledger, gate copy/question budget, and persona evaluation fixtures.

# Questions Remaining

- Q1: Resolve the actual `fs-enterprises` instruction-file root before finalizing the managed-block subset against the full Public + Barter + fs-enterprises triad.
- Q2: Build a real suffix/mode/scope matrix for `/spec_kit`, `/create`, `/doctor`, `/improve`, and `/memory` instead of inferring from SPAR's four-phase model.
- Q3: Classify internal templates into source inputs, generated outputs, examples, optional assets, and validation-critical consumer artifacts.
- Q5: Decide whether the future tool ledger is command-owned (`/doctor:tools`), install/init-owned, or explicit-save-only to avoid write-on-read behavior.
- Q7: Decide whether `:auto` and `:confirm` need different optional-question budgets, or whether `Required To Proceed` / `Optional Refinements` should be global.

# Next Focus

Iteration 7 should focus on Q2. Build the command suffix and mode matrix from actual command docs and YAML assets, then decide whether SPAR's lifecycle vocabulary can be mapped to `mode x scope x lifecycle` without breaking skill-advisor hooks, Gate 3 classification, or existing command semantics.
