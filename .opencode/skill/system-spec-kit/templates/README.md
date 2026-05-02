---
title: "Templates"
description: "Spec Kit template system: how the manifest, resolver, renderer, and scaffolder work together to produce packet documents for any Level. Read this first if you're new to the directory."
trigger_phrases:
  - "templates"
  - "template system"
  - "spec kit templates"
  - "template render flow"
  - "IF gate"
  - "level contract"
---

# Templates

This directory is the source of truth for every document that `create.sh` writes into a new spec folder. It contains the template files, the manifest that describes which documents each Level needs, rendered examples, and maintainer guides. If you are trying to understand where a `spec.md` or `plan.md` came from, you are in the right place.

---

## 1. The Five Subdirectories

| Path | Audience | Purpose |
|------|----------|---------|
| `manifest/` | Maintainers | Source of truth. Holds 12 `*.md.tmpl` author templates, `spec-kit-docs.json`, and three maintainer guides. Nothing here is read by end users directly; the scaffolder and validator read it on demand. |
| `examples/` | Anyone | Pre-rendered reference packets showing finished output for each Level. Read these when you want to see what a real spec folder looks like without scaffolding one yourself. |
| `changelog/` | Maintainers | Historical record of template changes, version bumps, and architecture decisions. Useful when you need to understand why a section was added or removed. |
| `stress_test/` | Maintainers | Findings rubric and templates used by deep-research and deep-review loops to grade spec-kit outputs. Not part of normal scaffold workflows. |
| `scratch/` | Anyone | Temporary local debugging workspace. Always empty in the checked-in state. Put throwaway renders here; they are gitignored. |

`manifest/` is the only subdirectory you need to understand to work with the template system. The others support specific workflows described in their own READMEs.

---

## 2. The Render Flow, End to End

When you run `create.sh`, three pieces execute in sequence: the resolver reads the manifest and returns a contract, the renderer reads each template and strips the sections that don't belong to the requested Level, and the scaffolder writes the result to disk.

```
bash .opencode/skill/system-spec-kit/scripts/spec/create.sh \
  --level 3 \
  --path specs/123-my-feature \
  --name "my-feature"
           |
           v
[1] resolveLevelContract("3")
    reads: .opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json
    returns: LevelContract {
      requiredCoreDocs: ["spec.md", "plan.md", "tasks.md", "implementation-summary.md"],
      requiredAddonDocs: ["checklist.md", "decision-record.md"],
      lazyAddonDocs: ["handover.md", "debug-delegation.md", "research/research.md"],
      sectionGates: Map<section-id, levels-where-active>,
      templateVersions: { "spec.md.tmpl": "v2.2", ... }
    }
           |
           v
[2] for each doc in requiredCoreDocs + requiredAddonDocs:
    reads: templates/manifest/<doc>.md.tmpl
    passes level "3" to inline-gate-renderer
           |
           v
[3] inline-gate-renderer strips <!-- IF level:N --> blocks
    that don't match level "3", keeps the rest
           |
           v
[4] writes rendered output to:
    specs/123-my-feature/spec.md
    specs/123-my-feature/plan.md
    specs/123-my-feature/tasks.md
    specs/123-my-feature/implementation-summary.md
    specs/123-my-feature/checklist.md
    specs/123-my-feature/decision-record.md
           |
           v
[5] writes metadata:
    specs/123-my-feature/description.json
    specs/123-my-feature/graph-metadata.json
```

The validator (`validate.sh`) reads the same `resolveLevelContract()` output to know what sections to check. This means the scaffolder and validator share one definition of "what Level 3 requires" and cannot drift apart.

---

## 3. What a `.md.tmpl` File Looks Like Inside

Each template file covers every Level in one document. The renderer decides at scaffold time which sections to keep. Here is a real excerpt from `manifest/spec.md.tmpl`:

```markdown
<!-- IF level:1 -->
---
title: "Feature Specification: [NAME] [template:level_1/spec.md]"
description: "[What is broken, missing, or inefficient?]"
importance_tier: "normal"
---
# Feature Specification: [NAME]

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | [P0/P1/P2] |
| **Status** | [Draft/In Progress/Review/Complete] |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
[What is broken, missing, or inefficient?]
<!-- /ANCHOR:problem -->
<!-- /IF -->

<!-- IF level:2 -->
---
title: "Feature Specification: [NAME] [template:level_2/spec.md]"
...
<!-- /IF -->
```

When you run `create.sh --level 1`, the renderer keeps the `<!-- IF level:1 -->...<!-- /IF -->` block and discards the `<!-- IF level:2 -->` block entirely. The output is a clean markdown file with no gate comments in it.

The `<!-- ANCHOR:metadata -->` markers stay in the rendered file. They are stripped by the renderer only when they appear inside a gate block that was removed. When kept, they serve as stable identifiers that the memory-frontmatter parser uses to locate sections.

---

## 4. The IF-Gate Grammar

Gates are HTML comments that the renderer understands. The basic form is:

```
<!-- IF level:N --> ... content ... <!-- /IF -->
```

**Single-level gate** -- include this block only for Level 2:

```
<!-- IF level:2 -->
This section only appears in Level 2 packets.
<!-- /IF -->
```

**Multi-level gate** -- include this block for Level 3 and Level 3+:

```
<!-- IF level:3,3+ -->
This section appears in Level 3 and Level 3+ packets.
<!-- /IF -->
```

**Logical operators** -- the renderer supports AND, OR, and NOT:

```
<!-- IF level:3 OR level:3+ -->
Same result as level:3,3+ above.
<!-- /IF -->

<!-- IF NOT level:1 -->
Appears in every Level except Level 1.
<!-- /IF -->
```

**Nesting** -- gates can be nested. The outer gate must be active for the inner gate to be evaluated:

```
<!-- IF level:3,3+ -->
## Architecture Decisions
This section appears at Level 3 and above.

<!-- IF level:3+ -->
### Governance Sign-Offs
This sub-section only appears at Level 3+.
<!-- /IF -->

<!-- /IF -->
```

**Edge cases to know:**

- An empty gate body (`<!-- IF level:2 --><!-- /IF -->` on one line) is silently dropped. The renderer recognizes this pattern and does not emit a blank line.
- Gates that appear inside fenced code blocks are treated as literal text. The renderer only interprets gate comments at the start of a line outside of code fences.
- Whitespace is normalized after removal so the rendered file does not have runs of blank lines where removed blocks used to be.

The renderer source lives at `.opencode/skill/system-spec-kit/scripts/templates/inline-gate-renderer.ts`. Valid level values are `1`, `2`, `3`, `3+`, and `phase`.

---

## 5. The Manifest (`spec-kit-docs.json`) Explained

`manifest/spec-kit-docs.json` is the single source of truth for everything the template system knows. The scaffolder reads it to decide what to write, and the validator reads it to decide what to check.

Top-level keys:

| Key | What it contains |
|-----|-----------------|
| `manifestVersion` | Schema version of this file. Used by the resolver to detect incompatible manifest formats. |
| `versions` | Template version for each `.md.tmpl` file. Written into `SPECKIT_TEMPLATE_SOURCE` comments in rendered output. Example: `"spec.md.tmpl": "v2.2"`. |
| `privateTaxonomy` | Internal classification data (kinds, capabilities, presets). Used only by maintainer tooling. Never appears in output files, validator messages, or user-facing docs. |
| `documents` | One entry per document type. Each entry records the template filename, who owns it (author/command/agent/workflow), what triggers its creation, and what the validator does when it is absent. |
| `levels` | One entry per public Level (1, 2, 3, 3+, phase). Each entry lists required core docs, required add-on docs, lazy add-on docs, and section gates. |

Here is a shortened `documents` entry showing all four fields:

```json
"checklist.md": {
  "template": "checklist.md.tmpl",
  "owner": "author",
  "creationTrigger": "scaffold",
  "absenceBehavior": "hard-error"
}
```

`absenceBehavior` controls what `validate.sh` does when a file is missing. `hard-error` means the packet fails validation. `warn` produces a warning but does not fail. `silent-skip` means the file is optional and the validator says nothing.

Here is a shortened `levels` entry for Level 2:

```json
"2": {
  "requiredCoreDocs": ["spec.md", "plan.md", "tasks.md", "implementation-summary.md"],
  "requiredAddonDocs": ["checklist.md"],
  "lazyAddonDocs": ["handover.md", "debug-delegation.md", "research/research.md"],
  "sectionGates": {
    "spec.md": {
      "metadata": ["1", "2", "3", "3+"],
      "problem":  ["1", "2", "3", "3+"]
    }
  }
}
```

`lazyAddonDocs` are files that are not scaffolded by default. They are created on demand by specific commands or agents (for example, `handover.md` is written by `/memory:save`, not by `create.sh`).

---

## 6. The Resolver -- What It Returns

The resolver is a small TypeScript module at `.opencode/skill/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts`. Its public API is one function:

```typescript
resolveLevelContract(level: SpecKitLevel): LevelContract
```

Hand it a Level string, get back a `LevelContract` object:

```typescript
interface LevelContract {
  requiredCoreDocs: string[];        // Files create.sh always writes
  requiredAddonDocs: string[];       // Level-specific add-on files
  lazyAddonDocs: string[];           // On-demand files (not scaffolded)
  sectionGates: Map<string, string[]>;            // section-id -> levels-where-active
  sectionGatesByDocument: Map<string, Map<string, string[]>>; // per-document version
  templateVersions: Record<string, string>;       // template filename -> version
  frontmatterMarkerLevel: number;    // Numeric Level value for frontmatter markers
}
```

In plain language: the contract describes exactly what a packet at that Level contains and what sections the validator expects to find. Both `create.sh` and `validate.sh` call the same function. If you add a required doc to Level 2 in `spec-kit-docs.json`, both tools pick it up immediately, with no additional code changes.

The resolver caches the manifest in memory after the first read. Set `SPECKIT_VERBOSE_RESOLVER=1` to see stack traces on resolution errors.

---

## 7. Vocabulary Discipline (ADR-005)

The template system uses two vocabularies: a public one for users and AI agents, and a private one for maintainers.

**Public vocabulary** -- appears in command output, validator messages, user docs, AI agent prompts, and every surface an end user or AI reads:

- Level 1, Level 2, Level 3, Level 3+
- phase-parent

**Private vocabulary** -- appears only inside `manifest/spec-kit-docs.json`, the resolver source, and the three maintainer guides in `manifest/`:

- `kinds` (document classification)
- `presets` (level-to-capability mappings)
- `capabilities` (qa-verification, architecture-decisions, governance-expansion)

The reason for the separation: AI agents read user-facing surfaces literally. If an agent sees "kind: implementation" in a README and then reads "Level 1 uses the implementation kind" in validator output, it might try to pass `kind` as a flag to `create.sh`. The public API has no such flag. Keeping private terms out of public surfaces prevents that class of confusion.

A test file (`workflow-invariance.vitest.ts`) scans all non-allowlisted files on every commit and fails if private terms appear where they should not. The allowlisted files that CAN use private vocabulary are:

- `templates/manifest/README.md`
- `templates/manifest/EXTENSION_GUIDE.md`
- `templates/manifest/MIGRATION.md`
- `templates/manifest/spec-kit-docs.json`
- `templates/README.md` (this file)
- `mcp_server/lib/templates/level-contract-resolver.ts`

---

## 8. Where to Look for What

| Question | Where to look |
|----------|--------------|
| Which docs does Level 3 require? | `manifest/spec-kit-docs.json` -- `levels["3"].requiredCoreDocs` and `requiredAddonDocs` |
| What does a finished Level 2 packet look like? | `examples/level-2/` |
| How do I render a template by hand? | `scripts/templates/inline-gate-renderer.ts` or `inline-gate-renderer.sh` |
| What sections does the validator expect in `spec.md` at Level 2? | `manifest/spec-kit-docs.json` -- `levels["2"].sectionGates["spec.md"]` |
| What is the current template version for `plan.md`? | `manifest/spec-kit-docs.json` -- `versions["plan.md.tmpl"]` |
| How do I add a new document type? | `manifest/EXTENSION_GUIDE.md` |
| How are legacy v2.1 markers handled? | `manifest/MIGRATION.md` |
| What does `ANCHOR:metadata` do? | It is a stable section identifier read by the memory-frontmatter parser. Anchors survive rendering and are not stripped. |
| Why does `handover.md` not appear after `create.sh`? | It is a `lazyAddonDoc` with `creationTrigger: "memory-save"`. Run `/memory:save` to create it. |
| What does the resolver return for a given Level? | Call `resolveLevelContract(level)` or read `manifest/spec-kit-docs.json` directly. |

---

## 9. Adding a New Document Type

These five steps add a document to the manifest so that `create.sh` scaffolds it and `validate.sh` checks it. Read `manifest/EXTENSION_GUIDE.md` for the full details, including the version bump policy and test checklist.

1. **Write the template.** Create `templates/manifest/your-doc.md.tmpl`. Use `<!-- IF level:N -->...<!-- /IF -->` to gate sections by Level.

2. **Register the document.** Add an entry to `spec-kit-docs.json.documents` with `template`, `owner`, `creationTrigger`, and `absenceBehavior` fields.

3. **Add a version entry.** Add `"your-doc.md.tmpl": "v1.0"` (or the current manifest version) to `spec-kit-docs.json.versions`.

4. **Add to Level rows.** Put the document name in `requiredCoreDocs`, `requiredAddonDocs`, or `lazyAddonDocs` for each Level that needs it.

5. **Add section gates.** Under `levels.<level>.sectionGates.<your-doc-name>`, list the anchor IDs and which Levels each should appear in.

After these changes, run `npm test`. The resolver tests and golden snapshot tests will tell you if anything is misaligned.

---

## 10. Migration and Backward Compatibility

Legacy spec folders created before the current manifest system carry markers like:

```
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.1 -->
```

The resolver reads these markers to identify the template version of a file. Readers must accept any marker version they encounter, including v2.1. There is no planned sunset date for legacy marker support.

When a legacy packet does not have manifest-aware metadata, the system derives its document list from files on disk: always include the four core docs if present, include add-ons when present, and for phase parents use the lean trio (`spec.md`, `description.json`, `graph-metadata.json`). This derived list is read-only compatibility data. Do not rewrite old packets to normalize markers.

New template writes always emit the current version from `spec-kit-docs.json.versions`. The policy is indefinite read support for legacy formats plus current-version writes for new scaffolds.

---

## 11. Related

| What | Path |
|------|------|
| Manifest (single source of truth) | `templates/manifest/spec-kit-docs.json` |
| Template files (one per doc-type) | `templates/manifest/*.md.tmpl` |
| Resolver | `mcp_server/lib/templates/level-contract-resolver.ts` |
| Renderer (TypeScript) | `scripts/templates/inline-gate-renderer.ts` |
| Renderer (shell wrapper) | `scripts/templates/inline-gate-renderer.sh` |
| Scaffolder | `scripts/spec/create.sh` |
| Validator | `scripts/spec/validate.sh` and `scripts/rules/` |
| Extension guide | `templates/manifest/EXTENSION_GUIDE.md` |
| Migration guide | `templates/manifest/MIGRATION.md` |
| Maintainer notes | `templates/manifest/README.md` |
