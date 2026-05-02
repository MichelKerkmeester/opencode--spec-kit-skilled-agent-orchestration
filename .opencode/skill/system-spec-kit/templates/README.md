---
title: "Templates"
description: "Spec Kit template system: how the manifest, resolver, renderer and scaffolder work together to produce packet documents for any Level. Read this first if you are new to the directory."
trigger_phrases:
  - "templates"
  - "template system"
  - "spec kit templates"
  - "template render flow"
  - "IF gate"
  - "level contract"
---

# Templates

> Source of truth for every document that create.sh writes into a new spec folder. Contains template files, the manifest that describes which documents each Level needs, rendered examples and maintainer guides.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. FEATURES](#3--features)
  - [3.1 HOW IT WORKS](#31-how-it-works)
  - [3.2 TEMPLATE ANATOMY](#32-template-anatomy)
  - [3.3 IF-GATE GRAMMAR](#33-if-gate-grammar)
  - [3.4 MANIFEST REFERENCE](#34-manifest-reference)
  - [3.5 RESOLVER REFERENCE](#35-resolver-reference)
  - [3.6 VOCABULARY DISCIPLINE](#36-vocabulary-discipline)
- [4. STRUCTURE](#4--structure)
- [5. CONFIGURATION](#5--configuration)
- [6. USAGE EXAMPLES](#6--usage-examples)
- [7. TROUBLESHOOTING](#7--troubleshooting)
- [8. FAQ](#8--faq)
- [9. RELATED DOCUMENTS](#9--related-documents)

---

## 1. OVERVIEW

### What is This Directory?

This directory is the source of truth for every document that `create.sh` writes into a new spec folder. It contains the template files, the manifest that describes which documents each Level needs, rendered examples and maintainer guides. If you are trying to understand where a `spec.md` or `plan.md` came from, you are in the right place.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Template files | 12 | One `*.md.tmpl` per document type in `manifest/` |
| Document types | 9 | spec.md, plan.md, tasks.md, implementation-summary.md, checklist.md, decision-record.md, handover.md, debug-delegation.md, research.md |
| Public Levels | 4 | Level 1, Level 2, Level 3, Level 3+ (plus phase-parent) |
| Maintainer guides | 3 | README.md, EXTENSION_GUIDE.md, MIGRATION.md in `manifest/` |

### How This Compares

| Capability | Without the manifest system | With the manifest system |
|------------|---------------------------|-------------------------|
| Level-to-docs mapping | Drift between scaffolder and validator | One `spec-kit-docs.json` file, both tools read it |
| Template changes | Manually update every level folder | Edit one `.tmpl` file, IF gates control inclusion |
| Adding a doc type | Touch 4+ files across 3 tools | 5 steps in one JSON file + one template |
| Section validation | Validator hard-codes what each Level needs | Resolver returns section gates from the manifest |

### Key Features

| Feature | Description |
|---------|-------------|
| **Single source of truth** | `spec-kit-docs.json` defines what every Level requires. The scaffolder and validator share one definition. |
| **IF-gate system** | Each template covers all Levels in one file. The renderer strips sections that do not belong to the requested Level. |
| **Level-contract resolver** | One function returns the complete contract for a Level. Both `create.sh` and `validate.sh` call it. |
| **Anchor markers** | Stable section identifiers that the memory-frontmatter parser uses to locate content. |
| **Two vocabulary tiers** | Public vocabulary for users and AI agents. Private vocabulary for maintainer tooling. A test file enforces the boundary. |

### Requirements

| Requirement | Minimum |
|-------------|---------|
| Node.js | 18+ |
| The scaffolder, validator and renderer are all bash-callable. No extra install steps needed beyond the workspace. |

---

## 2. QUICK START

### Scaffold a Packet

```bash
bash .opencode/skill/system-spec-kit/scripts/spec/create.sh \
  --level 3 \
  --path specs/123-my-feature \
  --name "my-feature"
```

### Verify the Output

```bash
# Check what was written
ls specs/123-my-feature/

# Expected output (Level 3):
# spec.md  plan.md  tasks.md  implementation-summary.md  checklist.md  decision-record.md  description.json  graph-metadata.json
```

### Validate the Packet

```bash
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/123-my-feature --strict
```

### Find What a Level Requires

Read `manifest/spec-kit-docs.json` and look at `levels["3"].requiredCoreDocs` and `requiredAddonDocs`. Or call `resolveLevelContract("3")` from the resolver module.

---

## 3. FEATURES

### 3.1 HOW IT WORKS

The template system is like an assembly line. You hand it a Level number and a target path. Three pieces execute in sequence: the resolver reads the manifest and returns a contract, the renderer reads each template and strips the sections that do not belong to the requested Level, and the scaffolder writes the result to disk.

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
    that do not match level "3", keeps the rest
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

The validator reads the same `resolveLevelContract()` output to know what sections to check. This means the scaffolder and validator share one definition of "what Level 3 requires" and cannot drift apart.

---

### 3.2 TEMPLATE ANATOMY

#### 3.2.1 STRUCTURE OF A .MD.TMPL FILE

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

---

#### 3.2.2 ANCHOR MARKERS

The `<!-- ANCHOR:metadata -->` markers stay in the rendered file. They are stripped by the renderer only when they appear inside a gate block that was removed. When kept, they serve as stable identifiers that the memory-frontmatter parser uses to locate sections.

---

### 3.3 IF-GATE GRAMMAR

Gates are HTML comments that the renderer understands. The basic form is:

```
<!-- IF level:N --> ... content ... <!-- /IF -->
```

**Single-level gate:** Include this block only for Level 2.

```
<!-- IF level:2 -->
This section only appears in Level 2 packets.
<!-- /IF -->
```

**Multi-level gate:** Include this block for Level 3 and Level 3+.

```
<!-- IF level:3,3+ -->
This section appears in Level 3 and Level 3+ packets.
<!-- /IF -->
```

**Logical operators:** The renderer supports AND, OR and NOT.

```
<!-- IF level:3 OR level:3+ -->
Same result as level:3,3+ above.
<!-- /IF -->

<!-- IF NOT level:1 -->
Appears in every Level except Level 1.
<!-- /IF -->
```

**Nesting:** Gates can be nested. The outer gate must be active for the inner gate to be evaluated.

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

| Case | Behavior |
|------|----------|
| Empty gate body (`<!-- IF level:2 --><!-- /IF -->` on one line) | Silently dropped. No blank line emitted. |
| Gates inside fenced code blocks | Treated as literal text. Not interpreted. |
| Whitespace after removal | Normalized. No runs of blank lines where removed blocks used to be. |

The renderer source lives at `.opencode/skill/system-spec-kit/scripts/templates/inline-gate-renderer.ts`. Valid level values are `1`, `2`, `3`, `3+` and `phase`.

---

### 3.4 MANIFEST REFERENCE

`manifest/spec-kit-docs.json` is the single source of truth for everything the template system knows. The scaffolder reads it to decide what to write and the validator reads it to decide what to check.

**Top-level keys:**

| Key | What it contains |
|-----|-----------------|
| `manifestVersion` | Schema version of this file. Used by the resolver to detect incompatible manifest formats. |
| `versions` | Template version for each `.md.tmpl` file. Written into `SPECKIT_TEMPLATE_SOURCE` comments in rendered output. Example: `"spec.md.tmpl": "v2.2"`. |
| `privateTaxonomy` | Internal classification data (kinds, capabilities, presets). Used only by maintainer tooling. Never appears in output files, validator messages or user-facing docs. |
| `documents` | One entry per document type. Each entry records the template filename, who owns it (author/command/agent/workflow), what triggers its creation and what the validator does when it is absent. |
| `levels` | One entry per public Level (1, 2, 3, 3+, phase). Each entry lists required core docs, required add-on docs, lazy add-on docs and section gates. |

**Document entry fields:**

| Field | Purpose |
|-------|---------|
| `template` | Which `.md.tmpl` file to render |
| `owner` | Who is responsible (author, command, agent, workflow) |
| `creationTrigger` | When the file is created (scaffold, memory-save, deep-research) |
| `absenceBehavior` | What `validate.sh` does if the file is missing. `hard-error` means the packet fails validation. `warn` produces a warning but does not fail. `silent-skip` means the file is optional and the validator says nothing. |

**Level entry example (Level 2):**

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

`lazyAddonDocs` are files that are not scaffolded by default. They are created on demand by specific commands or agents. For example, `handover.md` is written by `/memory:save`, not by `create.sh`.

---

### 3.5 RESOLVER REFERENCE

The resolver is a TypeScript module at `.opencode/skill/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts`. Its public API is one function:

```typescript
resolveLevelContract(level: SpecKitLevel): LevelContract
```

Hand it a Level string and you get back a `LevelContract` object:

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

The contract describes exactly what a packet at that Level contains and what sections the validator expects to find. Both `create.sh` and `validate.sh` call the same function. If you add a required doc to Level 2 in `spec-kit-docs.json`, both tools pick it up immediately with no additional code changes.

The resolver caches the manifest in memory after the first read. Set `SPECKIT_VERBOSE_RESOLVER=1` to see stack traces on resolution errors.

---

### 3.6 VOCABULARY DISCIPLINE

The template system uses two vocabularies: a public one for users and AI agents and a private one for maintainers.

**Public vocabulary:** Appears in command output, validator messages, user docs, AI agent prompts and every surface an end user or AI reads.

- Level 1, Level 2, Level 3, Level 3+
- phase-parent

**Private vocabulary:** Appears only inside `manifest/spec-kit-docs.json`, the resolver source and the three maintainer guides in `manifest/`.

- `kinds` (document classification)
- `presets` (level-to-capability mappings)
- `capabilities` (qa-verification, architecture-decisions, governance-expansion)

**Why the separation exists:** AI agents read user-facing surfaces literally. If an agent sees `kind: implementation` in a README and then reads "Level 1 uses the implementation kind" in validator output, it might try to pass `kind` as a flag to `create.sh`. The public API has no such flag. Keeping private terms out of public surfaces prevents that class of confusion.

A test file (`workflow-invariance.vitest.ts`) scans all non-allowlisted files on every commit and fails if private terms appear where they should not. The allowlisted files that CAN use private vocabulary are:

- `templates/manifest/README.md`
- `templates/manifest/EXTENSION_GUIDE.md`
- `templates/manifest/MIGRATION.md`
- `templates/manifest/spec-kit-docs.json`
- `templates/README.md` (this file)
- `mcp_server/lib/templates/level-contract-resolver.ts`

---

## 4. STRUCTURE

```
templates/
├── manifest/                   # Source of truth: templates + JSON manifest
│   ├── spec.md.tmpl            #   Feature specification template
│   ├── plan.md.tmpl            #   Implementation plan template
│   ├── tasks.md.tmpl           #   Task breakdown template
│   ├── implementation-summary.md.tmpl  # Implementation summary template
│   ├── checklist.md.tmpl       #   Verification checklist template
│   ├── decision-record.md.tmpl #   Architecture decisions template
│   ├── handover.md.tmpl        #   Session handover template
│   ├── debug-delegation.md.tmpl#   Debug delegation template
│   ├── research.md.tmpl        #   Research document template
│   ├── resource-map.md.tmpl    #   Resource map template
│   ├── spec-kit-docs.json      #   Manifest: level contracts, doc registry, versions
│   ├── README.md               #   Maintainer notes
│   ├── EXTENSION_GUIDE.md      #   How to add a new document type
│   └── MIGRATION.md            #   Legacy v2.1 marker handling
├── examples/                   # Pre-rendered reference packets
│   ├── level-1/                #   Level 1 packet example
│   ├── level-2/                #   Level 2 packet example
│   ├── level-3/                #   Level 3 packet example
│   ├── level-3-plus/           #   Level 3+ packet example
│   └── phase-parent/           #   Phase parent packet example
├── changelog/                  # Historical record of template changes
├── stress_test/                # Findings rubric for deep loops (maintainers only)
└── scratch/                    # Local debugging workspace (gitignored, always empty)
```

### Key Files

| File | Purpose |
|------|---------|
| `manifest/spec-kit-docs.json` | Single source of truth for the entire template system |
| `manifest/*.md.tmpl` | One template per document type. IF gates control section inclusion by Level. |
| `manifest/EXTENSION_GUIDE.md` | Step-by-step guide for adding a new document type |
| `manifest/MIGRATION.md` | Legacy format handling and backward compatibility policy |
| `examples/level-*/` | Pre-rendered packets showing finished output for each Level |

---

## 5. CONFIGURATION

The template system's configuration lives in `manifest/spec-kit-docs.json`. There are no environment variables or config files to set up. The manifest is the only knob.

### Template Versions

Each template has a version tracked in `spec-kit-docs.json.versions`:

| Template | Current Version |
|----------|----------------|
| `spec.md.tmpl` | v2.2 |
| `plan.md.tmpl` | v2.2 |
| `tasks.md.tmpl` | v2.2 |
| `implementation-summary.md.tmpl` | v2.2 |
| `checklist.md.tmpl` | v2.2 |
| `decision-record.md.tmpl` | v2.2 |
| `handover.md.tmpl` | v2.2 |
| `debug-delegation.md.tmpl` | v2.2 |
| `research.md.tmpl` | v2.2 |
| `resource-map.md.tmpl` | v2.2 |

The scaffolder writes the current version into each rendered file as:

```
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
```

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `SPECKIT_VERBOSE_RESOLVER` | Set to `1` to see stack traces on resolver errors |

---

## 6. USAGE EXAMPLES

### Example 1: Render a Template by Hand

```bash
# Render spec.md.tmpl for Level 1
bash .opencode/skill/system-spec-kit/scripts/templates/inline-gate-renderer.sh \
  --level 1 \
  --template templates/manifest/spec.md.tmpl
```

**Result:** The Level 1 version of spec.md, with all higher-Level IF blocks stripped.

---

### Example 2: Find What Sections the Validator Checks

```bash
# Query the manifest directly for Level 2 section gates on spec.md
jq '.levels["2"].sectionGates["spec.md"]' \
  .opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json
```

**Result:** A JSON array of section IDs that the validator expects to find in spec.md at Level 2.

---

### Example 3: Add a New Document Type

These five steps add a document to the manifest so that `create.sh` scaffolds it and `validate.sh` checks it. Read `manifest/EXTENSION_GUIDE.md` for the full details including the version bump policy and test checklist.

1. **Write the template.** Create `templates/manifest/your-doc.md.tmpl`. Use `<!-- IF level:N -->...<!-- /IF -->` to gate sections by Level.

2. **Register the document.** Add an entry to `spec-kit-docs.json.documents` with `template`, `owner`, `creationTrigger` and `absenceBehavior` fields.

3. **Add a version entry.** Add `"your-doc.md.tmpl": "v1.0"` (or the current manifest version) to `spec-kit-docs.json.versions`.

4. **Add to Level rows.** Put the document name in `requiredCoreDocs`, `requiredAddonDocs` or `lazyAddonDocs` for each Level that needs it.

5. **Add section gates.** Under `levels.<level>.sectionGates.<your-doc-name>`, list the anchor IDs and which Levels each should appear in.

After these changes, run `npm test`. The resolver tests and golden snapshot tests will tell you if anything is misaligned.

---

## 7. TROUBLESHOOTING

### Common Issues

#### Handover.md Does Not Appear After create.sh

**What you see:** You scaffolded a packet and expected `handover.md` to appear, but it is missing.

**Common causes:** `handover.md` is a `lazyAddonDoc` with `creationTrigger: "memory-save"`. `create.sh` does not write lazy docs.

**Fix:** Run `/memory:save` to create `handover.md`. It is written by the memory-save workflow, not by the scaffolder.

---

#### Validator Reports Missing Sections in a Legacy Packet

**What you see:** `validate.sh` complains about missing sections in a packet that was created before the current manifest system.

**Common causes:** Legacy packets have markers like `<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.1 -->`. The resolver reads these to identify the template version. The system derives the document list from files on disk for packets that do not have manifest-aware metadata.

**Fix:** This derived list is read-only compatibility data. Do not rewrite old packets to normalize markers. The policy is indefinite read support for legacy formats plus current-version writes for new scaffolds.

---

#### Template Changes Not Showing in Scaffolded Output

**What you see:** You edited a `.md.tmpl` file but the scaffolded packet still looks the same.

**Common causes:** You might be editing the wrong template or the wrong IF-gate block. The renderer only includes sections whose gate matches the requested Level.

**Fix:** Check that the IF gate on your section includes the Level you are scaffolding with. Use `inline-gate-renderer.sh` to preview the rendered output before scaffolding.

```bash
bash .opencode/skill/system-spec-kit/scripts/templates/inline-gate-renderer.sh \
  --level 3 \
  --template templates/manifest/spec.md.tmpl
```

---

## 8. FAQ

### General Questions

**Q: Which docs does Level 3 require?**

A: Read `manifest/spec-kit-docs.json` and look at `levels["3"].requiredCoreDocs` (spec.md, plan.md, tasks.md, implementation-summary.md) plus `requiredAddonDocs` (checklist.md, decision-record.md).

---

**Q: What does a finished Level 2 packet look like?**

A: Look at `examples/level-2/`. It contains pre-rendered reference packets for every Level.

---

**Q: What sections does the validator expect in spec.md at Level 2?**

A: Check `manifest/spec-kit-docs.json` under `levels["2"].sectionGates["spec.md"]`. It lists the anchor IDs and which Levels each should appear in.

---

### Technical Questions

**Q: What is the current template version for plan.md?**

A: Check `manifest/spec-kit-docs.json` under `versions["plan.md.tmpl"]`. As of the current manifest it is `v2.2`.

---

**Q: What does ANCHOR:metadata do?**

A: It is a stable section identifier read by the memory-frontmatter parser. Anchors survive rendering and are not stripped. They let the parser locate specific sections without knowing line numbers.

---

**Q: How do I render a template by hand?**

A: Use `scripts/templates/inline-gate-renderer.ts` or the shell wrapper `inline-gate-renderer.sh`. See Usage Example 1 in §6.

---

**Q: What does the resolver return for a given Level?**

A: Call `resolveLevelContract(level)` from the resolver module or read `manifest/spec-kit-docs.json` directly.

---

**Q: What are lazyAddonDocs?**

A: Files not scaffolded by default. They are created on demand by specific commands or agents. `handover.md` is written by `/memory:save`. `debug-delegation.md` is written by the `@debug` agent. `research/research.md` is written by `/spec_kit:deep-research`.

---

**Q: How are legacy v2.1 markers handled?**

A: The resolver reads them to identify the template version. Readers must accept any marker version they encounter. There is no planned sunset date for legacy marker support. See `manifest/MIGRATION.md` for details.

---

## 9. RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [Manifest (single source of truth)](./manifest/spec-kit-docs.json) | Defines level contracts, document registry and template versions |
| [Extension Guide](./manifest/EXTENSION_GUIDE.md) | How to add a new document type to the manifest |
| [Migration Guide](./manifest/MIGRATION.md) | Legacy v2.1 marker handling and backward compatibility policy |
| [Maintainer Notes](./manifest/README.md) | Internal notes for template system maintainers |
| [Resolver](./../mcp_server/lib/templates/level-contract-resolver.ts) | TypeScript module that resolves a Level string to a LevelContract |
| [Renderer (TypeScript)](./../scripts/templates/inline-gate-renderer.ts) | IF-gate renderer implementation |
| [Renderer (shell)](./../scripts/templates/inline-gate-renderer.sh) | Shell wrapper for the renderer |
| [Scaffolder](./../scripts/spec/create.sh) | Creates spec folder packets from templates |
| [Validator](./../scripts/spec/validate.sh) | Validates spec folder structure and content |

### External References

| Resource | Description |
|----------|-------------|
| [SKILL.md](../SKILL.md) | Parent system-spec-kit skill documentation |
| [Spec folder workflow](./../SKILL.md) | Template system role in the spec folder workflow |

---

*Documentation version: 2.2 | Last updated: 2026-05-02*