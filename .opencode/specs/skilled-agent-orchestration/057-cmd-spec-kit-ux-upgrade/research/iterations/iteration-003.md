# Focus

Axis 4 template architecture: compare SPAR-Kit's two authored templates plus declarative install asset policies against system-spec-kit's CORE + ADDENDUM v2.2 template tree, composed level outputs, and validation contracts.

# Actions Taken

1. Read SPAR's authored templates at `external/templates/spec.md` and `external/templates/plan.md`, plus the installed skill copies under `install-root/skills/spar-*`.
2. Read SPAR target configs and repo bootstrap policy handling in `external/install-root/targets/default.json`, `external/install-root/targets/codex.json`, and `external/lib/repo-bootstrap.mjs`.
3. Read SPAR packaging sync behavior in `external/lib/pack-prep.mjs`, which copies the two top-level templates into skill assets when matching asset files exist.
4. Compared that with system-spec-kit's `templates/README.md`, `scripts/templates/compose.sh`, `scripts/templates/README.md`, the Level 3 composed spec template, and `references/validation/template_compliance_contract.md`.

# Findings

## F-003: Adapt SPAR's asset-policy vocabulary as a manifest layer, not as a replacement for our template system

SPAR's most portable pattern on Axis 4 is the policy vocabulary, not the minimal template count. The target configs declare per-entry ownership behavior with `replace`, `seed_if_missing`, `managed_block`, and `replace_managed_children`. `repo-bootstrap.mjs` then enforces those policies through a small switch that routes each entry to the correct write behavior. This is a clean declarative boundary between authored assets and user-owned repo state.

The internal system-spec-kit has a richer template contract: core fragments, addendum fragments, composed level outputs, phase-parent templates, cross-cutting templates, examples, changelog templates, stress-test templates, and validation references. A direct SPAR-style two-template collapse would lose required anchors, per-level document sets, checklist/ADR contracts, and resume/memory expectations.

Recommendation: adopt a SPAR-like manifest for template asset ownership and materialization behavior. Do not replace the CORE + ADDENDUM architecture with SPAR's two templates.

Verdict: adapt.

## F-004: The current internal composer is already the right bridge toward manifest-driven templates

`scripts/templates/compose.sh` already treats `core/` and `addendum/` as source-of-truth components and materializes ready-to-copy `level_1` through `level_3+` outputs. It has dry-run and verify modes, validates required sources, normalizes markers, strips addendum-only metadata, and detects drift.

That means the missing piece is not a new template architecture. It is a declarative manifest around the existing composer: which outputs are generated, which helper templates are copied directly, which files are seed-only, and which generated outputs are allowed to be replaced. SPAR's target config model gives useful vocabulary for that layer.

Verdict: take inspiration.

## F-005: Template compression is viable only at the source layer, not the runtime/consumer layer

SPAR can keep `spec.md` and `plan.md` tiny because its workflow asks the skill to preserve section order and fill a simple folder-local artifact. system-spec-kit validators require exact heading/anchor contracts for multiple document types and levels: `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `checklist.md`, and `decision-record.md`.

The internal tree currently has 86 files under `templates/`, 83 of them markdown. The important compression opportunity is reducing hand-maintained or duplicated source fragments, not removing composed outputs that validators, agents, and users consume directly.

Verdict: adapt narrowly.

## F-006: SPAR's package prep reveals a useful "sync optional assets only where present" rule

SPAR's `syncSkillAssetTemplates()` reads the two canonical templates and updates matching `assets/spec.md` or `assets/plan.md` inside each skill directory only when those files already exist. Missing optional asset files are allowed. This is a small but strong pattern: shared source templates can propagate without forcing every workflow skill to carry every artifact.

For system-spec-kit, the analog would be manifest entries such as `seed_if_missing` for optional cross-cutting templates, `replace` for generated level outputs, and "sync only if declared/present" for command or skill local assets. That would reduce accidental surface growth while keeping explicit ownership.

Verdict: adapt.

# Questions Answered

Q3 is partially answered. The 99-file figure in the charter appears stale for the current checkout; the live `templates/` tree contains 86 files, including 83 markdown files. The conclusion still holds: system-spec-kit should not compress to SPAR's two-template architecture at the consumer layer. It can compress and clarify the source/ownership layer through a manifest that sits beside `compose.sh`.

# Questions Remaining

- Which internal template files are true source inputs, generated outputs, examples, or optional install/copy assets? A manifest migration needs this classification before implementation.
- Should `compose.sh` remain the only generator while a new manifest only declares ownership, or should the manifest eventually drive composition order too?
- How much of SPAR's install-policy vocabulary should be shared with the managed instruction-file work from Iteration 2 so we avoid two similar policy languages?

# Next Focus

Axis 5 tool-discovery UX: compare SPAR's `.spar-kit/.local/tools.yaml` seed-once discovery surface with our skill-advisor hook, MCP routing, command catalog, and startup/resume briefs. Focus on sessions where the user does not already know which commands or tools exist.
