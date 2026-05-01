---
title: "Template System: Before & After (Plain Language)"
description: "How the spec-kit template system used to work, how it works now, and why we changed it. Written for non-maintainers — no jargon."
trigger_phrases:
  - "template before after"
  - "template system explained"
  - "spec-kit templates plain language"
---

# Template System: Before & After

> Plain-language walkthrough of what changed in the spec-kit template system after the 010-template-levels refactor (Apr-May 2026). No jargon. If you're a maintainer who needs the schema, see `templates/manifest/EXTENSION_GUIDE.md`.

---

## 1. The Story In One Paragraph

The spec-kit creates standardized folders for every piece of work — a "spec folder" with `spec.md`, `plan.md`, `tasks.md`, etc. Before the refactor, those template files lived in **four parallel copies** on disk (one per Level), and you had to run a build script every time you edited any of them. After the refactor, there's **one source of truth** for each template, and the system figures out which sections to include based on the requested Level. Same packets come out, same validators check them, but the maintenance burden dropped from "edit 4 files + run a build" to "edit 1 file."

---

## 2. Before: The Old System

### 2.1 What was on disk

```
templates/
├── core/                       # The "shared" version of each doc
│   ├── spec.md
│   ├── plan.md
│   ├── tasks.md
│   └── implementation-summary.md
├── addendum/                   # Level-specific extra sections
│   ├── level2-verify/
│   ├── level3-arch/
│   └── level3-plus-govern/
├── level_1/                    # ← Pre-built copy for Level 1
│   ├── spec.md
│   ├── plan.md
│   ├── tasks.md
│   └── implementation-summary.md
├── level_2/                    # ← Pre-built copy for Level 2 (slightly more)
├── level_3/                    # ← Pre-built copy for Level 3 (more again)
├── level_3+/                   # ← Pre-built copy for Level 3+ (the most)
├── phase_parent/               # Phase parent special case
├── handover.md                 # Cross-cutting docs (one each)
├── debug-delegation.md
├── research.md
├── resource-map.md
└── context-index.md
```

About **80 files**, total ~13,000 lines.

### 2.2 How it worked

When someone ran `create.sh --level 3 --name foo`, the scaffolder did the simplest possible thing: it copied files from `templates/level_3/` into the new spec folder. Same for Level 1, 2, and 3+ — each level had its own pre-built directory, and the scaffolder just `cp`'d.

But where did `templates/level_3/` come from? A separate build script called `compose.sh` glued together `core/spec.md` + the Level 3 extra sections from `addendum/level3-arch/` and wrote the combined file into `templates/level_3/`. The maintainer had to run `compose.sh` after every edit to `core/` or `addendum/`.

### 2.3 What was painful about it

1. **Two sources of truth, easy to drift.** You edit `core/spec.md` (the source). You forget to run `compose.sh`. Now `templates/level_3/spec.md` (the copy) is stale. The next person to scaffold a Level 3 spec gets the OLD version. Bugs land in production-like artifacts because the build step was skipped.

2. **Every edit = touch 4 files.** A wording change in the "What Was Built" section? You edit `core/implementation-summary.md`, run `compose.sh`, then commit FIVE files (the source + 4 regenerated levels). Five files for a one-line edit.

3. **80 files to wade through.** New maintainers had to learn the relationship between `core/`, `addendum/`, `level_N/`, and `compose.sh` before they could safely change anything.

4. **No way for validators and the scaffolder to share knowledge.** The scaffolder knew "Level 3 needs these 8 files" because it saw them in `level_3/`. The validator knew the same thing because it had its own hardcoded list. Two separate hardcoded lists. Add a doc in one place, forget the other, validation breaks.

5. **Phase-specific templates were squirrelled away** in `addendum/phase/phase-parent-section.md` and `phase-child-header.md` — easy to miss when reading the system end-to-end.

---

## 3. After: The New System

### 3.1 What's on disk now

```
templates/
├── manifest/                   # ← Single source of truth
│   ├── spec-kit-docs.json     # Master config: which docs per Level, which sections, versions
│   ├── spec.md.tmpl           # ONE template per doc-type, with Level gates inside
│   ├── plan.md.tmpl
│   ├── tasks.md.tmpl
│   ├── implementation-summary.md.tmpl
│   ├── checklist.md.tmpl
│   ├── decision-record.md.tmpl
│   ├── handover.md.tmpl
│   ├── debug-delegation.md.tmpl
│   ├── research.md.tmpl
│   ├── resource-map.md.tmpl
│   ├── context-index.md.tmpl
│   ├── phase-parent.spec.md.tmpl
│   ├── README.md              # Maintainer notes
│   ├── EXTENSION_GUIDE.md     # How to add a new doc-type
│   └── MIGRATION.md           # Legacy marker compatibility
├── README.md                   # ← Top-level orientation (this directory)
├── changelog/                  # Historical record of template changes
├── examples/                   # Reference packets per Level
└── stress_test/                # Findings rubric for stress testing
```

About **15 files** in `manifest/` (down from ~80).

The `core/`, `addendum/`, `level_1/`, `level_2/`, `level_3/`, `level_3+/`, and `phase_parent/` directories are **gone**. So is `compose.sh`. So is the `wrap-all-templates` build helper. The root cross-cutting docs (`handover.md`, `debug-delegation.md`, etc.) moved into `manifest/` as templates.

### 3.2 How it works now

Three pieces talk to each other at scaffold time:

```
create.sh --level 3 --name foo
   |
   v
[1] resolveLevelContract(3)
   reads spec-kit-docs.json
   returns { requiredCoreDocs, requiredAddonDocs, lazyAddonDocs, sectionGates, templateVersions }
   |
   v
[2] for each doc the contract says Level 3 needs:
   reads templates/manifest/<doc>.md.tmpl
   pipes through inline-gate-renderer
   |
   v
[3] inline-gate-renderer
   keeps blocks marked <!-- IF level:3 --> ... <!-- /IF -->
   removes blocks marked for other levels
   writes the result to specs/foo/<doc>.md
```

**The resolver** (`mcp_server/lib/templates/level-contract-resolver.ts`): a small TypeScript module. Hand it a Level number, get back a "contract" — a structured description of what that Level needs. The contract object has a few fields: which docs are required, which are optional, what sections each doc should have. The validator and the scaffolder both consume the SAME contract from the SAME function, so they can't drift apart.

**The renderer** (`scripts/templates/inline-gate-renderer.{ts,sh}`): a small parser for `<!-- IF level:N -->...<!-- /IF -->` markers. Hand it a template file and a Level number, get back the file with only the sections relevant to that Level. Whitespace is preserved cleanly so the rendered file looks hand-written.

**The manifest** (`templates/manifest/spec-kit-docs.json`): the single source of truth. Lists every document type, which Levels need it, what sections it should have, and the current template version. Maintainers edit this file when they want to change what's required for any Level.

### 3.3 What's better

| Pain point | Before | After |
|------------|--------|-------|
| Sources of truth | Two (source + composed copies) | One (manifest + templates) |
| Files touched per edit | ~5 (source + regenerated levels) | 1 (the template) |
| Build step required | Yes (`compose.sh`) | No (rendered on demand at scaffold) |
| Total template files | ~80 | ~15 |
| Drift between scaffolder and validator | Possible | Impossible (same function returns the contract) |
| Add a new doc type | Edit ~6 places | Edit 2 (manifest entry + new template file) |

### 3.4 What stays the same (on purpose)

- **Public vocabulary unchanged.** Everyone — users, AI agents, docs — still talks about Level 1, Level 2, Level 3, Level 3+, and phase-parent packets. The internal taxonomy in `spec-kit-docs.json` (kinds, presets, capabilities) is private and never appears in any user-facing surface. A test (`workflow-invariance.vitest.ts`) enforces this on every commit.
- **`create.sh --level N` flag works the same.** No new flags users have to learn.
- **Existing 868 spec folders still validate.** Their `<!-- SPECKIT_TEMPLATE_SOURCE: spec | v2.2 -->` markers are still recognized; the migration policy guarantees indefinite read support for older marker versions.
- **Validator behavior is unchanged from a user's perspective.** Same error messages. Same Level wording. Same exit-code categories (with one improvement — see below).

---

## 4. New Capabilities Added Along The Way

Beyond the headline refactor, four side benefits landed:

### 4.1 Faster scaffolds and validations
- **Scaffold a Level 3 packet:** ~1 second (down from ~11 seconds).
- **Strict-validate a Level 3 packet:** ~108 ms (down from several seconds; achieved by replacing per-rule Node process launches with a single orchestrator).
- The default scaffold path now skips full post-create validation (use `SPECKIT_POST_VALIDATE=1` to opt in for strict workflows).

### 4.2 Hardened against path traversal
Before: `create.sh --path "../etc/passwd" --name foo` would have happily written outside the repository. After: rejected with a clear error before any filesystem write happens.

### 4.3 Standardized exit codes
Before: every script had its own exit-code conventions, often just `1` for everything. After:
- `0` — success
- `1` — user error (bad flags, invalid input)
- `2` — validation error (the spec doesn't pass strict checks)
- `3` — system error (file I/O, missing manifest, etc.)

CI scripts and human callers can now distinguish "I made a typo" from "the system is broken."

### 4.4 Better safety on parallel scaffolds
A `mkdir`-based advisory lock now protects `description.json` + `graph-metadata.json` writes during canonical save. Two parallel `/memory:save` calls for the same packet no longer race; one waits politely.

---

## 5. What If I Just Want To Use It?

Nothing changes for users. Run the same commands you ran before:

```bash
# Create a new spec folder
bash .opencode/skill/system-spec-kit/scripts/spec/create.sh --level 3 --path specs/123-my-feature --name "my-feature"

# Validate it
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/123-my-feature --strict
```

If you previously copied templates by hand from `templates/level_3/`, that won't work anymore (the directory is gone). Use `create.sh` instead — it does the same thing.

---

## 6. What If I'm A Maintainer Adding A New Document?

Read `.opencode/skill/system-spec-kit/templates/manifest/EXTENSION_GUIDE.md`. The five-minute version:

1. Drop a `your-doc.md.tmpl` file into `templates/manifest/`. Use `<!-- IF level:N -->...<!-- /IF -->` markers to gate sections per Level.
2. Add an entry in `spec-kit-docs.json.documents` listing your new doc.
3. Add the version (`"your-doc.md.tmpl": "v1.0"`) to `spec-kit-docs.json.versions`.
4. Add the doc name to whichever Level rows need it (`requiredCoreDocs`, `requiredAddonDocs`, or `lazyAddonDocs`).
5. Add per-document section anchors under `levels.<level>.sectionGates.<doc-name>`.
6. Run `npm test` (the resolver + golden snapshot tests will tell you if anything's wrong).

That's it. No `compose.sh`. No editing four files. No copying anything between directories.

---

## 7. Where The Pieces Live

| What | Path |
|------|------|
| Manifest (single source of truth) | `templates/manifest/spec-kit-docs.json` |
| Templates (one per doc-type) | `templates/manifest/*.md.tmpl` |
| Resolver | `mcp_server/lib/templates/level-contract-resolver.ts` |
| Renderer (TypeScript) | `scripts/templates/inline-gate-renderer.ts` |
| Renderer (shell wrapper) | `scripts/templates/inline-gate-renderer.sh` |
| Scaffolder | `scripts/spec/create.sh` |
| Validator | `scripts/spec/validate.sh` + rules under `scripts/rules/` |
| Validation orchestrator (perf) | `mcp_server/lib/validation/orchestrator.ts` |
| Maintainer docs | `templates/manifest/{README,EXTENSION_GUIDE,MIGRATION}.md` |
| User docs | `templates/README.md`, `system-spec-kit/README.md` |

---

## 8. Why It Took So Long

Not because the refactor was hard — the manifest+resolver+renderer code itself is under 500 lines. It took time because:

- **868 existing spec folders** had to keep working. Every change had to be checked against a sample of them.
- **Workflow invariance was a hard constraint** (ADR-005): the user-facing experience had to stay byte-identical. Renaming a path in one README that an AI agent reads literally would have broken the AI workflow. So we audited every public surface — agents, commands, references, assets, READMEs, CLAUDE.md, AGENTS.md, feature catalog, manual playbook — and cleaned out vocabulary leaks before letting the refactor merge.
- **Three rounds of deep review** (10 cli-codex agents per round, 30 reviewers total). Each round found real issues. Each round was followed by remediation.
- **One follow-up packet** (`004-deferred-followups/`) implemented 10 deferred items + 5 architectural decisions that didn't fit the contained-remediation budget of round 3.

Total session: ~6.5 hours of autonomous codex execution, supervised by a single human asking for status updates.

---

## 9. Related Documents

- `001-template-consolidation-investigation/` — the original 10-iteration deep research (PARTIAL recommendation, rejected by user)
- `002-template-greenfield-redesign/` — the 14-iteration redesign loop that produced the C+F hybrid + 5 ADRs
- `003-template-greenfield-impl/` — the 6-phase implementation packet with checklist Gates 1-7
- `004-deferred-followups/` — orchestrator + exit codes + version field + 5 more ADRs
- `templates/manifest/EXTENSION_GUIDE.md` — maintainer guide
- `templates/manifest/MIGRATION.md` — legacy marker compatibility
- `templates/README.md` — top-level template-system orientation
