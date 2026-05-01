# Iteration 6: Section Gates, Manifest Evolution, and Edge-Case Stress Test

## Focus

DESIGN STRESS-TEST PASS 1 - section-profile depth, manifest evolution policy, and extreme-edge probing for the frozen C+F hybrid design.

The design remains C+F hybrid: kind plus capabilities drive author-owned scaffolding and validation, while command-owned, agent-owned, and workflow-owned artifacts remain lazy or workflow-owned. This iteration adds precision around inline gates, version evolution, and failure modes that were not fully challenged in iterations 3-5.

## Actions Taken

- Read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-005.md` first, preserving the Q10 decision for inline gates.
- Loaded `.opencode/skill/sk-deep-research/SKILL.md` to preserve the LEAF iteration contract and artifact expectations.
- Read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deep-research-state.jsonl` to preserve prior ratios, executor shape, and graph-event style.
- Read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deltas/iter-005.jsonl` to match finding and graph-event JSONL conventions.
- Read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-004.md` to preserve the manifest schema axes, preset matrix, and golden-test assumptions.
- Stress-tested the frozen C+F hybrid against inline-gate grammar, capability evolution, conflict handling, phase-parent capability placement, workflow subfolders, capability granularity, and deletion safety.

## Findings

### Inline-Gate Grammar (EBNF)

Inline gates should use a dedicated TypeScript renderer, not a sed pipeline and not ad hoc runtime stripping inside each validator. The new module should live at `.opencode/skill/system-spec-kit/mcp_server/lib/templates/inline-gates.ts`, with a tiny shell wrapper callable from `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh`. The same renderer should be used by scaffolding, `check-template-headers.sh`, and section validation fixtures so every consumer sees the same post-gate document.

Canonical syntax:

```md
<!-- IF capability:architecture-decisions -->
## Decision Records
<!-- /IF -->
```

Formal grammar:

```ebnf
gate-open      ::= "<!--" ws "IF" ws expr ws "-->"
gate-close     ::= "<!--" ws "/IF" ws "-->"
expr           ::= or-expr
or-expr        ::= and-expr { ws "OR" ws and-expr }
and-expr       ::= unary-expr { ws "AND" ws unary-expr }
unary-expr     ::= [ "NOT" ws ] primary
primary        ::= atom | "(" ws expr ws ")"
atom           ::= axis ":" ident
axis           ::= "capability" | "kind" | "preset"
ident          ::= lower { lower | digit | "-" }
ws             ::= { " " | "\t" }
lower          ::= "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z"
digit          ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
```

Precedence is `NOT` before `AND` before `OR`. Parentheses are allowed. Nested gates are allowed, but the renderer must enforce balanced pairs, reject unknown axes, and ignore gate markers inside fenced code blocks.

Negation is permitted only as `NOT <atom-or-parenthesized-expression>`. There is no `ELSE` syntax. Alternatives should use sibling gates:

```md
<!-- IF capability:qa-verification -->
## Verification Protocol
<!-- /IF -->

<!-- IF NOT capability:qa-verification -->
## Smoke Check
<!-- /IF -->
```

Mutual exclusion is not a template-syntax concern. It belongs in the manifest as capability compatibility metadata, because the failure is semantic rather than textual. The renderer should receive an already validated active contract; if it sees contradictory gates, that is a manifest-loader failure, not a markdown-rendering choice.

Mid-section gates are permitted only when they wrap complete markdown blocks. A gated bullet item is allowed because it is a complete list item:

```md
- Always present.
<!-- IF capability:security-review -->
- Threat model reviewed.
<!-- /IF -->
```

Gates are forbidden inside heading text, inline prose, table rows, blockquote continuations, and fenced code blocks. This keeps stripped output valid enough for anchor extraction, section counting, and markdown rendering. If a capability needs a table row, the whole table should be capability-specific or the table should move to an authored doc.

Same-section de-duplication should happen before rendering. The manifest loader should build sets of active `sectionProfile` IDs, `requiredAnchors`, and validation rules. If two capabilities activate the same profile ID, the duplicate collapses. If two distinct profile IDs produce the same canonical anchor with incompatible rules, manifest validation fails with a conflict error. Template gates should use `OR` only when a single shared section is intentionally activated by multiple capabilities.

Validator interaction:

- `.opencode/skill/system-spec-kit/scripts/rules/check-sections.sh` should validate only post-gate active anchors.
- `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh` should compare generated docs against post-gate template headers.
- `.opencode/skill/system-spec-kit/scripts/rules/check-section-counts.sh` should consume active `sectionProfile.minimumCounts`, if present.
- A stripped inactive section is not missing. A declared active section that fails to render is a hard error.

Design clarification added by this stress test: inline gates are a shared parser-renderer contract owned by the manifest loader, not a string filter embedded in `create.sh`.

### Manifest Evolution Policy + 5-Row Scenario Table

The manifest should carry `manifestVersion`, not overload JSON Schema identity. Iteration 4 used `schemaVersion`; in the greenfield implementation, that should become:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "manifestVersion": "1.0.0"
}
```

The JSON Schema file still has its own `$id`. The manifest data contract uses SemVer:

- Patch: wording, template copy, comments, examples, or validator diagnostics that do not change resolved file or section contracts.
- Minor: additive capability, additive preset, additive optional doc, or additive section profile that applies only to new packet contracts.
- Major: removing or renaming a capability, changing required docs for an existing kind, or changing validation semantics for an existing section profile.

The important robustness clarification is that each scaffolded packet should record a resolved template contract snapshot in `.opencode/specs/<packet>/graph-metadata.json`, under `derived.templateContract`. The snapshot should include at least:

```json
{
  "manifestVersion": "1.0.0",
  "preset": "arch-change",
  "kind": "implementation",
  "capabilities": ["qa-verification", "architecture-decisions"],
  "requiredDocs": ["spec.md", "plan.md", "tasks.md", "implementation-summary.md", "checklist.md", "decision-record.md", "description.json", "graph-metadata.json"],
  "sectionProfiles": ["implementation-core", "qa-verification", "architecture-decisions"],
  "validationRules": ["required-files", "required-sections", "template-headers"]
}
```

Validators should prefer the packet snapshot when present. The current manifest is used to scaffold new packets and to resolve packets that intentionally refresh their contract. This prevents manifest v2 from retroactively requiring new sections in packets scaffolded under manifest v1.

Forward-compat guarantee: a packet saved under manifest v1 and read by manifest v2 remains valid against its recorded `templateContract` if its required files and sections still exist in the packet. New v2 capabilities do not affect it unless the packet explicitly opts into them.

Capability deprecation should be soft first. A deprecated capability stays resolvable with a `deprecatedSince`, `replacement`, and diagnostic. Hard-error is reserved for new scaffolds that request an unknown capability or for a major-version manifest that has intentionally removed the capability. Silent-drop is unsafe because it can hide missing authored docs.

Presets should stay inside `.opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json`, not in a sibling file. A preset is just a named `kind + capabilities` bundle. To prevent name sprawl, add a preset namespace with `namespace: "core"` as the default and make the canonical identity `core:simple-change`. The CLI can accept `simple-change` only when the name is unique across namespaces.

Adding a section to an existing capability should not retroactively require that section from existing packets. It affects new packet snapshots and refreshed snapshots only. If the team wants a global rule change, that is a migration, not a manifest edit.

| Scenario | Impact | Mitigation | Validator behavior |
|---|---|---|---|
| Add capability | Existing packets that do not declare the capability should be unchanged. New packets can opt in through a preset or explicit capability list. | Add the capability in a minor manifest version. Include `supportsKinds`, `addsAuthoredDocs`, `addsSectionProfiles`, `addsValidationRules`, and tests. | Existing snapshot-backed packets ignore it. New packets validate it normally when declared. |
| Remove capability | Packets that declared the capability can lose the resolver needed to explain their authored docs and sections. | Deprecate first with `deprecatedSince` and `replacement`. Remove only in a major manifest version after migration or keep enough snapshot data for validation. | Snapshot-backed packets validate from the snapshot and warn that the capability is deprecated or orphaned. New scaffolds hard-error on removed capabilities. |
| Rename capability | A rename is remove plus add; blind rename breaks presets and packet metadata. | Add the new capability, mark the old one deprecated with `replacement`, and provide an explicit migration command that updates `templateContract`. | Old snapshots warn but continue. New presets use the new ID. Unknown old IDs without snapshots hard-error. |
| Add section to existing capability | Without snapshots, existing packets would suddenly fail `check-sections.sh`. | Treat this as a minor manifest addition for new snapshots only. Existing packets keep their recorded `sectionProfiles`. | Existing packets are unchanged. Refreshed packets and new packets require the new section. |
| Remove section from existing capability | Existing packets may retain extra sections that are no longer part of the current template. | Mark the section profile deprecated first. Do not delete user content automatically. Optional prune/archive tooling can remove stale sections later. | Existing snapshots keep validating their old section set. Current-manifest validation warns on deprecated profile, not hard-errors. |

Design clarification added by this stress test: packet metadata must store a resolved template contract, not only `templatePreset`, `templateKind`, and `templateCapabilities`.

### Extreme-Edge Probe Results

#### Cross-capability conflict

Scenario: capability A says section X is required, while capability B says section X is forbidden.

This can break C+F if capabilities are treated as pure additive sets. The mitigation is to make conflicts explicit in the manifest loader:

```json
{
  "id": "security-review",
  "supportsKinds": ["implementation", "investigation"],
  "conflictsWith": ["minimal-runtime-only"],
  "addsSectionProfiles": ["security-review"]
}
```

The design should avoid a general `forbiddenSections` feature unless a real use case proves it is necessary. Negative requirements make composition hard. The safer rule is additive capabilities plus explicit `conflictsWith`; unsatisfiable combinations are hard errors before scaffolding or validation. No capability silently wins.

Verdict: breaks naive additive C+F; mitigated by `conflictsWith` and loader-time hard errors.

#### Phase-parent with capabilities

Scenario: a `kind: phase-parent` packet also declares `architecture-decisions`.

This should not be allowed by default. A phase parent is a manifest and routing packet; implementation decisions belong in child phase packets where the work and verification live. The mitigation is `supportsKinds` on every capability. `architecture-decisions.supportsKinds` should include `implementation` and possibly `investigation`, but not `phase-parent`.

If a parent needs to expose architecture context, use a parent-compatible section profile such as `phase-architecture-index` inside `.opencode/specs/<phase-parent>/spec.md`, pointing to child `decision-record.md` files. The decision records themselves live in child folders such as `.opencode/specs/<phase-parent>/001-design-baseline/decision-record.md`.

Verdict: does not break C+F if capability compatibility is enforced. Full `architecture-decisions` is child-only; parent gets index sections, not authored ADR docs.

#### Workflow-owned packet inside investigation

Scenario: investigation packets need a `research/` subfolder, while the manifest currently models files more directly than directories.

This reveals a real manifest gap. The design needs directory entries, not only `docTemplates`. Add a `directories` or `requiredDirectories` axis with the same ownership and absence behavior model:

```json
{
  "path": "research/iterations",
  "owner": "workflow",
  "creationTrigger": "/spec_kit:deep-research",
  "absenceBehavior": "silent-skip"
}
```

For `kind=investigation`, the scaffold can create `.opencode/specs/<packet>/research/`, `.opencode/specs/<packet>/research/iterations/`, and `.opencode/specs/<packet>/research/deltas/` with `.gitkeep` files while leaving `.opencode/specs/<packet>/research/research.md` workflow-owned. Validators should distinguish required directories from required docs.

Verdict: breaks the file-only manifest shape; mitigated by adding directory entries with owner, trigger, and absence semantics.

#### Capability granularity

Scenario: the user wants only part of `qa-verification`, such as `checklist.md` without strict validator checks.

This does not require a new architecture, but it argues against oversized capabilities. Capabilities should be independently useful units. The manifest should split coarse behavior into smaller capabilities when users have plausible partial needs:

- `qa-checklist-doc` adds `.opencode/specs/<packet>/checklist.md`.
- `qa-section-validation` adds required checklist sections.
- `qa-strict-completion-gate` adds strict completion validator behavior.
- Preset `validated-change` composes all three for the common path.

The design should not add arbitrary sub-capability booleans. That recreates levels under another name. If part of a capability can reasonably stand alone, make it a capability and let presets bundle it.

Verdict: does not break C+F; mitigated by capability splitting and preset composition.

#### Deletion safety

Scenario: a packet was scaffolded with capability X, then the user removes X from packet frontmatter. The orphaned file, such as `decision-record.md`, remains on disk.

The design should not auto-delete authored files. Removing a capability changes desired validation, but deletion of authored content needs an explicit prune/archive action.

Rules:

- If frontmatter capabilities and `graph-metadata.json.derived.templateContract.capabilities` disagree, validator reports template contract drift.
- If an authored doc exists but is no longer required by the active desired contract, validator emits an orphan warning, not a hard error.
- If the orphan doc has non-placeholder content, the warning should recommend explicit archive, not deletion.
- A future prune command may move orphan authored docs to `.opencode/specs/<packet>/z_archive/template-orphans/<timestamp>/`, but ordinary validation must not do that automatically.

Verdict: does not break C+F if the source of truth is explicit. It needs drift diagnostics and no automatic deletion.

## Questions Answered

- Inline-gate syntax is now formal enough to implement: `IF`, `NOT`, `AND`, `OR`, parentheses, `capability`, `kind`, and `preset` atoms.
- Inline gates should be rendered by a shared TypeScript module called from scaffolding and validators.
- Mid-section gates are allowed only around complete markdown blocks; gated list items are allowed, inline gates are forbidden.
- Same-section collisions are resolved by manifest-loader set semantics and conflict checks, not by duplicated template output.
- Manifest evolution needs `manifestVersion` plus a packet-local resolved `templateContract` snapshot.
- New capabilities and presets are additive; capability removal and rename require deprecation or migration.
- Existing packets do not retroactively inherit new sections added to a capability.
- Cross-capability conflicts require manifest-level `conflictsWith`.
- Phase parents should only accept capabilities explicitly marked as parent-compatible.
- Investigation workflows need directory entries in the manifest, not only doc templates.
- Capability splitting handles partial QA needs without reviving levels.
- Deletion safety is warning-first and never auto-deletes authored docs.

## Questions Remaining

- Iteration 7 should read the current `.opencode/skill/system-spec-kit/scripts/spec/create.sh`, `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh`, and `.opencode/skill/system-spec-kit/scripts/rules/check-sections.sh` sources and produce concrete diffs for the manifest-driven refactor.
- The implementation plan should decide the exact JSON Schema spelling for `templateContract`, `directories`, `supportsKinds`, `conflictsWith`, and preset namespaces.
- The final synthesis should decide whether `schemaVersion` from iteration 4 is replaced by `manifestVersion` or kept as a short-lived alias during implementation. Greenfield preference is `manifestVersion`.

## Next Focus

Iteration 7 should do INTEGRATION PROBE: read `.opencode/skill/system-spec-kit/scripts/spec/create.sh`, `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh`, `.opencode/skill/system-spec-kit/scripts/rules/check-sections.sh`, `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh`, and `.opencode/skill/system-spec-kit/scripts/rules/check-section-counts.sh`, then produce concrete diffs for the proposed C+F manifest integration.
