# Iteration 11: Workflow Invariance Locks

## Focus

LOCK IN WORKFLOW INVARIANCE. Write ADR-005, define the invariant-safe `resolve_level_contract(level)` API, revise iteration-007 diffs so public and AI-facing surfaces stay level-only, and identify synthesis language that must change from "levels disappear" to "level folders disappear."

## Actions Taken

- Read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-010.md` first, preserving the reopened invariant constraints and four unresolved questions.
- Re-read the workflow rules in `.opencode/skill/sk-deep-research/SKILL.md` for this single leaf iteration.
- Re-read the iteration-007 concrete diffs and searched for public leakage of `preset`, `capability`, `kind`, and `manifest` vocabulary.
- Re-read line-numbered synthesis excerpts in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/research.md`.
- Checked the iteration-010 delta format before writing this iteration's narrative and delta records.

## Findings

### ADR-005 Draft (full)

#### ADR-005. Workflow-Invariant Level Contract

**Status:** Accepted

**Date:** 2026-05-01

**Deciders:** Spec Kit maintainer, workflow-invariant constraint owner, deep-research iteration 11

**Context:** On 2026-05-01 the user added a workflow invariant: AI behavior, Gate 3 behavior, user conversation flow, command syntax, authored packet markers, and user-visible validator output must remain level-based. The C+F manifest design can still remove duplicated template source folders, but it must not introduce a new public taxonomy. Iteration 10 found that earlier iteration-007 and iteration-009 wording leaked `preset`, `capability`, and `kind` into public CLI help, validator messages, metadata, and synthesis language.

**Decision:** Level vocabulary remains the sole public and AI-facing contract. `Level 1`, `Level 2`, `Level 3`, `Level 3+`, and phase-parent remain the user-facing taxonomy in `CLAUDE.md`, `AGENTS.md`, command markdown, skill text, generated packet markers, validator output, and CLI help. Preset, capability, and kind names are strictly internal to `.opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json`, the TypeScript resolver, and the scaffolder internals. The public bridge is `resolveLevelContract(level)`.

**Specific bans:**

- No public `--preset X` flag. Drop it from `create.sh --help`, examples, slash-command docs, and AI-facing skill text. If test-only fixture generation needs a non-level selector, it must be private, undocumented, and unable to appear in normal help or logs.
- No mention of `preset`, `capability`, or `kind` in `CLAUDE.md`, `AGENTS.md`, `SKILL.md`, `.opencode/command/*.md`, `.opencode/agent/*.md`, `.opencode/skill/system-spec-kit/SKILL.md`, validator error messages, validator remediation text, scaffolder log lines, or frontmatter exposed to the AI.
- Keep `--level N`, `<!-- SPECKIT_LEVEL: N -->`, `level: N` frontmatter where already supported, `spec_level` metadata, and the `Level 1/2/3/3+` taxonomy in user-facing docs.

**Implementation:** Iteration 11 replaces the iteration-007 public `--preset` proposal with level-only public diffs. New canonical API: `.opencode/skill/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts::resolveLevelContract(level)`. Shell bridge: `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh::resolve_level_contract <level>`. `create.sh` keeps `DOC_LEVEL`, `--level`, `DOC_LEVEL` JSON, and Level-shaped logs. Validator rules consume the resolved contract internally but emit only Level-shaped or taxonomy-neutral messages.

**Consequences:**

- Improves workflow invariance: existing AI prompts, slash commands, Gate 3 behavior, and user muscle memory remain stable.
- Improves implementation maintainability: duplicated `templates/level_N/` source folders can disappear after parity, while level semantics are resolved from one manifest row.
- Costs one adapter layer: implementers must route through `resolveLevelContract(level)` instead of calling manifest internals directly.
- Reduces taxonomy flexibility: v1 cannot expose arbitrary named presets without a future ADR that reopens the public workflow contract.
- Mitigates leakage risk: graph metadata and generated docs must not store or display raw internal taxonomy fields.

**Five Checks evaluation:**

- Workflow invariance: PASS. Public input, output, markers, and docs stay level-only.
- Simplicity: PASS. One resolver centralizes the level-to-internal mapping.
- Maintainability: PASS. The manifest owns internal composition while callers keep the stable level contract.
- Scope discipline: PASS. This narrows ADR-004; it does not supersede or rewrite unrelated manifest decisions.
- Verification readiness: PASS. Iteration 12 can probe every user-visible scaffolder and validator output for banned terms.

### resolve_level_contract API spec

The public TypeScript file must avoid manifest, preset, capability, and kind in its filename and exported API. It may query `spec-kit-docs.json` internally.

```ts
// .opencode/skill/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts

export type PublicSpecLevel = '1' | '2' | '3' | '3+' | 'phase';

export type LevelContract = {
  requiredCoreDocs: string[];
  requiredAddonDocs: string[];
  lazyAddonDocs: string[];
  sectionGates: Map<string, PublicSpecLevel[]>;
  frontmatterMarkerLevel: number;
};

export function resolveLevelContract(level: PublicSpecLevel): LevelContract {
  const normalizedLevel = normalizePublicSpecLevel(level);
  const manifest = readSpecKitDocsManifest();
  const internalRow = resolveInternalRowForLevel(manifest, normalizedLevel);
  const internalFeatures = resolveInternalFeatures(manifest, internalRow);

  return {
    requiredCoreDocs: resolveRequiredCoreDocs(internalRow, internalFeatures),
    requiredAddonDocs: resolveRequiredAddonDocs(internalFeatures),
    lazyAddonDocs: resolveLazyAddonDocs(internalFeatures),
    sectionGates: resolveSectionGatesByLevel(internalFeatures),
    frontmatterMarkerLevel: frontmatterMarkerLevelFor(normalizedLevel),
  };
}
```

Contract details:

- Signature is exactly `resolveLevelContract(level: '1' | '2' | '3' | '3+' | 'phase'): LevelContract`.
- `requiredCoreDocs[]` contains the baseline authored docs for the requested public level. For normal implementation levels this starts with `spec.md`, `plan.md`, and `tasks.md`; phase parent resolves to `spec.md`.
- `requiredAddonDocs[]` contains level-required authored docs beyond the core, such as `checklist.md` for Level 2+ and `decision-record.md` for Level 3+.
- `lazyAddonDocs[]` contains command-owned, agent-owned, workflow-owned, or optional docs that are known to the template system but not scaffolded by default.
- `sectionGates` is keyed by stable section IDs and returns the public levels where each section is active. Callers must not expose internal feature names.
- `frontmatterMarkerLevel` is numeric for marker compatibility. `3+` maps to `3`; `phase` maps to `0` only for internal comparison and must render as phase-parent wording, not `Level 0`.
- Internal traversal is allowed to read `spec-kit-docs.json`, follow the level row to internal composition data, and collect docs/sections. The caller never receives internal row names or feature IDs.
- Internal resolver exceptions must be caught at shell and validator boundaries and remapped to `Internal template contract could not be resolved for Level N`.

Shell wrapper sketch:

```sh
# .opencode/skill/system-spec-kit/scripts/lib/template-utils.sh

resolve_level_contract() {
    local level="$1"
    node "$REPO_ROOT/.opencode/skill/system-spec-kit/scripts/dist/templates/level-contract-resolver-cli.js" "$level"
}
```

The wrapper returns JSON on stdout with only these public fields:

```json
{
  "requiredCoreDocs": ["spec.md", "plan.md", "tasks.md"],
  "requiredAddonDocs": ["checklist.md", "decision-record.md"],
  "lazyAddonDocs": ["handover.md", "debug-delegation.md", "research/research.md", "resource-map.md", "context-index.md"],
  "sectionGates": {
    "verification-protocol": ["2", "3", "3+"],
    "architecture-decisions": ["3", "3+"]
  },
  "frontmatterMarkerLevel": 3
}
```

### Revised Iter-7 Diffs

`create.sh` revision:

- Replace iteration-007 line `+PRESET="simple-change"  # Default manifest preset` with `DOC_LEVEL=1  # Default to Level 1 (Baseline)`.
- Drop the entire public `--preset)` parser branch proposed at iteration-007 lines 49-64.
- Keep `--level` validation as the public selector and set `DOC_LEVEL="$next_arg"`, not `PRESET="$(legacy_level_to_preset "$next_arg")"`.
- Replace iteration-007 help text `Creates a new spec folder from a manifest preset.` with `Creates a new spec folder with templates based on documentation level.`
- Remove iteration-007 help text `--preset NAME       Manifest preset, e.g. simple-change, validated-change, arch-change`.
- Replace iteration-007 help text `--level N           Legacy alias mapped to the nearest manifest preset` with `--level N           Documentation level: 1, 2, 3, or 3+ (extended)`.
- Replace iteration-007 examples using `--preset validated-change` and `--preset arch-change` with `--level 2` and `--level 3`.
- Rename internal shell variables at the boundary from `preset_name` and `capabilities` to `level` and `level_contract`. Internal Node snippets may still traverse the manifest, but shell logs and JSON output must not print internal taxonomy names.
- Replace `template_contract_for_preset "$manifest_path" "$preset_name"` with `resolve_level_contract "$DOC_LEVEL"`.
- Replace scaffolder logs such as `PRESET: $PRESET` with `DOC_LEVEL: Level $DOC_LEVEL` and `Level $DOC_LEVEL Documentation`.
- Replace `Warning: --sharded flag is not supported by preset $PRESET. Ignoring --sharded.` with `Warning: --sharded flag is only supported with --level 3 or 3+. Ignoring --sharded.`
- Graph metadata creation must not write `derived.template_contract.preset`, `derived.template_contract.kind`, or `derived.template_contract.capabilities`. Either derive the contract from `SPECKIT_LEVEL` at validation time or persist only a level-shaped snapshot such as `derived.level_contract`.

`check-files.sh` revision:

- Replace iteration-007 `RULE_MESSAGE="All required files present for manifest contract"` with `RULE_MESSAGE="All required files present for Level $level"`.
- Replace `RULE_MESSAGE="${#RULE_DETAILS[@]} optional manifest file warning(s)"` with `RULE_MESSAGE="${#RULE_DETAILS[@]} optional workflow file warning(s)"`.
- Replace `Use the active manifest preset templates.` with `Use templates for Level $level from .opencode/skill/system-spec-kit/templates/`.
- Missing file details must be file-only or level-shaped. Preferred message: `Level 3 packet missing required file: decision-record.md`.
- Internal resolver failures become `Internal template contract could not be resolved for Level $level`; stderr must not include raw `Unknown preset`, `Ambiguous preset`, `Capability X`, or `kind Y`.

`check-sections.sh` revision:

- The implementation can call `resolve_level_contract "$level"` and validate active section gates.
- Public messages remain taxonomy-neutral, for example `Missing required section in decision-record.md: Decision`.
- If the level contract cannot be resolved, emit `Internal template contract could not be resolved for Level $level`.
- Do not print section gate origins such as `capability:architecture-decisions` or `kind:implementation`.

`check-template-headers.sh` revision:

- Keep the helper boundary but rename public-facing commands from `compare-manifest` to a level-shaped command such as `compare-level-contract`.
- Error details should say `Template header mismatch for Level $level file: checklist.md`.
- Do not report active internal profile names.

`check-section-counts.sh` revision:

- Replace iteration-007 warnings `expected at least ... for active manifest profiles` with `expected at least ... for Level $declared_level`.
- Replace `Section counts below active manifest profile expectations` with `Section counts below Level $declared_level expectations`.
- Replace `Expand spec content or choose a lighter manifest preset` with `Expand spec content or use the appropriate documentation level for this packet`.
- Replace `Section counts appropriate for active manifest profiles` with `Section counts appropriate for Level $declared_level`.

Strings to enforce in tests:

- Allowed: `Creates a new spec folder with templates based on documentation level.`
- Allowed: `--level N           Documentation level: 1, 2, 3, or 3+ (extended)`
- Allowed: `DOC_LEVEL:    Level 3`
- Allowed: `Level 3 Documentation`
- Allowed: `All required files present for Level 3`
- Allowed: `Level 3 packet missing required file: decision-record.md`
- Allowed: `Internal template contract could not be resolved for Level 3`
- Allowed: `Section counts below Level 3 expectations`
- Banned: `--preset NAME`
- Banned: `active manifest preset`, `active manifest profiles`, `capability=`, `kind=`, `Unknown preset`, `Ambiguous preset`

### Synthesis Language Revisions

The synthesis must not be edited in this iteration because the prompt says `research.md` will be addended in iteration 14. These are the exact lines that need the language fix:

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/research.md:5` says the manifest drives `presets`; revise so presets are internal rows and levels are the public API.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/research.md:7` says `levels disappear`; revise to `duplicated on-disk templates/level_N/ folders disappear`.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/research.md:21` says `user-facing presets`; revise to `internal level contracts`.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/research.md:25` says `Levels eliminated`; revise to `Level folders eliminated; level workflow preserved`.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/research.md:50` says the design removes the level taxonomy and keeps user-friendly presets; revise to say the public taxonomy remains levels and only the implementation source changes.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/research.md:84` says implementation presets add docs; revise to level contracts add docs.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/research.md:85` says levels become capabilities; revise to levels map internally to composition data.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/research.md:87` says memory does not care about numeric levels and `SPECKIT_LEVEL` need not be preserved; revise to preserve `SPECKIT_LEVEL`, `level`, and `spec_level` as public/backward-readable markers.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/research.md:91` lists a v1 public preset catalog; revise to private level rows or remove from public synthesis.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/research.md:363` says replace primary `--level` with `--preset`; revise to keep `--level` and route through `resolveLevelContract(level)`.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/research.md:455-489` stores raw `preset`, `kind`, and `capabilities` in packet metadata; revise to no raw internal taxonomy in AI-readable packet metadata.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/research.md:517-563` dry-run tables expose `preset`, `kind`, and `capabilities`; revise to show only public level, required docs, and validation behavior.

Workflow Invariance Addendum to insert near the top of `research.md`:

> **Workflow Invariance Addendum (2026-05-01):** The public and AI-facing workflow remains level-based. `--level N`, `Level 1/2/3/3+`, phase-parent wording, `<!-- SPECKIT_LEVEL: N -->`, `level: N`, and `spec_level` remain the stable contract. What disappears is the duplicated on-disk `templates/level_N/` source tree, not the level vocabulary or user-facing API. Internally, the scaffolder and validators may resolve a level through `resolveLevelContract(level)` and read the manifest, but preset, capability, and kind names must not appear in CLI help, command docs, skill text, validator messages, generated frontmatter, or AI-readable packet metadata.

### 4 Open Questions Resolved

1. `graph-metadata.json` contract scope: do not persist raw internal taxonomy. Preferred v1 behavior is to derive the contract from `SPECKIT_LEVEL` and public level metadata at validation time. If a snapshot is needed for parity or performance, store only `derived.level_contract` with public fields from `LevelContract`.
2. Field shape: allowed shape is `required_core_docs`, `required_addon_docs`, `lazy_addon_docs`, `section_gates`, and `frontmatter_marker_level`, plus optional `public_level`. Banned fields in AI-readable metadata are `preset`, `kind`, `capabilities`, `manifestVersion`, and internal profile IDs unless wrapped in a private non-prompted cache that resume never surfaces.
3. `--preset` ban scope: ban it from public CLI help, command markdown, skill text, examples, normal logs, JSON output, validator output, generated docs, and AI-facing frontmatter. A hidden test-only environment variable is acceptable only if undocumented and never emitted.
4. ADR-004 amendment: ADR-005 narrows ADR-004. ADR-004 can keep the single-frontmatter principle, but its raw `template_contract` shape must be changed to a public level-shaped marker or removed in favor of runtime derivation.

## Questions Answered

1. Can C+F remain viable under the invariant?
   Yes. The internal manifest model survives if `resolveLevelContract(level)` is the only public-to-internal bridge and all public surfaces stay level-only.

2. Does `--preset` survive?
   No as a public interface. It may exist only as private test plumbing, and even that is optional.

3. What replaces the iteration-007 helper names?
   `resolveLevelContract` in TypeScript and `resolve_level_contract` in shell. The names intentionally avoid manifest/preset/capability/kind vocabulary.

4. What exactly disappears?
   The duplicated on-disk `templates/level_N/` folders disappear after parity. The public `--level N` workflow stays.

## Questions Remaining

1. Should the private manifest schema still call its internal rows `presets`, or should implementation use a less leak-prone term internally?
2. Should `manifestVersion` be excluded from all AI-readable packet metadata, or allowed inside a private cache file that resume and skill prompts never read?
3. What exact generated tests should fail the build if banned vocabulary appears in public surfaces?

## Next Focus

Iteration 12 should re-run the validator/scaffolder integration probe with the workflow-invariant lens against the actual current source code, not only proposed diffs. Verify every user-visible output remains level-only: `create.sh --help`, normal stdout, JSON stdout, sharded warnings, phase-parent logs, `check-files.sh`, `check-sections.sh`, `check-template-headers.sh`, `check-section-counts.sh`, helper stderr remapping, generated `spec.md` markers, `description.json`, and `graph-metadata.json`.
