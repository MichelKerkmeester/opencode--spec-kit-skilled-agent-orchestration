# Changelog & Release Notes Template

This file defines the two formats used for global component changelogs and GitHub release notes. Nested packet-local changelogs use the Spec Kit templates in `.opencode/skill/system-spec-kit/templates/changelog/`.

**Authoritative source for writing style rules:** `PUBLIC_RELEASE.md` Section 7

---

## 1. CHANGELOG FILE FORMAT

Global component changelog files live at `.opencode/changelog/{NN--component}/v{VERSION}.md`. This is the local file format -- it includes wrapper lines that are stripped for GitHub releases.

### Compact Format (for releases with fewer than 10 changes)

```markdown
# v{VERSION}

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## [**{VERSION}**] - {YYYY-MM-DD}

{One-paragraph summary explaining what this release does and why it matters.}

> Spec folder: `{path}` (Level {N})

---

## What Changed

### {Category Name}

- **{Feature/Fix name}** -- {What was broken or missing}. {What we did}. {Why it matters}.

## Files Changed

| File           | What changed      |
| -------------- | ----------------- |
| `path/to/file` | Brief description |

## Upgrade

No migration required.
```

### Expanded Format (for releases with 10+ changes or major releases)

Use this format when individual fixes need full explanation -- typically for audit results, major refactors, or releases where understanding the "why" behind each change matters.

```markdown
# v{VERSION}

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## [**{VERSION}**] - {YYYY-MM-DD}

{One-paragraph summary explaining what this release does and why it matters. Include the scope (how many fixes), the test impact, and one sentence about the approach.}

> Spec folder: `{path}` (Level {N})

---

## {Category Name} ({count})

{Optional 1-2 sentence introduction for the category.}

### {Short heading}

**Problem:** {Explain what was broken or missing in plain English. Write for a smart person who is not a developer. Use analogies if they help. No unexplained jargon -- first use of a technical term includes a parenthetical definition like "BM25 (exact word matching)" or "CTE (a reusable SQL subquery)."}

**Fix:** {Explain what was done to fix it. Focus on the behavior change, not the implementation details. What does the system do differently now? What does the user experience? Technical specifics (file paths, function names, SQL syntax) go in the Files Changed table, not here.}

### {Next heading}

**Problem:** {Same pattern...}

**Fix:** {Same pattern...}

---

## Test Impact

| Metric            | Before | After |
| ----------------- | ------ | ----- |
| Tests passing     | {N}    | {N}   |
| Test files        | {N}    | {N}   |
| TypeScript errors | 0      | 0     |

{One sentence about new tests added and existing tests updated.}

---

## Schema Changes (if applicable)

| Change         | Details                         |
| -------------- | ------------------------------- |
| Schema version | {old} to {new}                  |
| New indexes    | {count} ({list})                |
| New columns    | {name} on {table} for {purpose} |

{One sentence confirming backward compatibility.}

---

<details>
<summary>Technical Details: Files Changed ({total} total)</summary>

### Source ({count} files)

| File           | Changes                                                  |
| -------------- | -------------------------------------------------------- |
| `path/to/file` | {What changed -- function names, behaviors, SQL queries} |

### Tests ({count} files)

{One sentence about test coverage.}

### Documentation ({count} files)

{One sentence about doc updates.}

</details>

---

## Upgrade

{Migration instructions or "No migration required."}

{List any behavioral changes users should be aware of.}
```

---

## 2. GITHUB RELEASE NOTES FORMAT

GitHub release notes are derived from the changelog file by stripping the local wrapper lines. The `gh release create` body must NOT include:

- `# v{VERSION}` (the first H1 line)
- `> Part of [OpenCode Dev Environment](...)`
- `## [**{VERSION}**] - {YYYY-MM-DD}`

The release body starts directly with the summary paragraph.

At the end, append:

```
Full changelog: `.opencode/changelog/{component}/v{VERSION}.md`
```

---

## 3. WRITING STYLE RULES

These rules apply to both changelog files and GitHub release notes. See `PUBLIC_RELEASE.md` Section 7 for the authoritative version.

### Voice

- Write like you are explaining to **a smart person who is not a developer**
- Lead with **WHY** this release matters, not technical stats
- Every fix explained as: **what was broken**, **what we did**, **why it matters**

### Jargon

- No jargon without explanation
- First use includes parenthetical definition: "BM25 (exact word matching)", "CTE (a reusable SQL subquery)"
- Technical details (file paths, line numbers, function names) go in Files Changed, not in descriptions

### Structure

- **Analogies welcome** when they help understanding
- **Short bullet points** (1-3 sentences each) in compact format
- **Full Problem/Fix paragraphs** in expanded format
- **Short sub-headings** in expanded format: 2-5 words, easy to scan, not sentence-length
- **No numbered item titles** in expanded format unless the content truly depends on sequence
- **No metrics soup** -- do not pack 10 numbers into one sentence

### Category vocabulary (use plain names)

- `Search` -- search behavior, ranking, matching
- `Saving Memories` -- memory save, context preservation
- `Security` -- access control, input validation
- `Documentation` -- templates, guides, READMEs
- `Testing` -- test suites, validation
- `Commands` -- CLI workflows, user-facing commands
- `New Features` -- newly added capabilities
- `Bug Fixes` -- repairs, patches, corrections
- `Architecture` -- structural changes, refactoring
- `Breaking Changes` -- compatibility impacts, migration required

---

## 4. FORMAT SELECTION GUIDE

| Release Type                  | Format   | When to Use                                           |
| ----------------------------- | -------- | ----------------------------------------------------- |
| Hotfix (1-3 changes)          | Compact  | Quick bug fix, typo correction                        |
| Feature release (4-9 changes) | Compact  | New feature, small refactor                           |
| Major release (10+ changes)   | Expanded | Audit results, major refactor, multi-sprint work      |
| Breaking change               | Expanded | Any release requiring migration or behavioral changes |

---

## 5. REAL EXAMPLES

### Compact format reference

See: `.opencode/changelog/04--commands/v3.0.1.4.md`

### Expanded format reference

See: `.opencode/changelog/01--system-spec-kit/v3.0.1.3.md` (28 fixes, full Problem/Fix paragraphs)
See: `.opencode/changelog/01--system-spec-kit/v3.0.1.0.md` (117 fixes, full Problem/Fix paragraphs)

## 6. NESTED PACKET-LOCAL CHANGELOGS

Nested packet-local changelogs are a separate output mode for spec folders and phase children.

- Root spec folders write to `changelog/changelog-<packet>-root.md`
- Phase child folders write to `../changelog/changelog-<packet>-<phase-folder>.md`
- Canonical templates:
  - `.opencode/skill/system-spec-kit/templates/changelog/root.md`
  - `.opencode/skill/system-spec-kit/templates/changelog/phase.md`
- Canonical generator:
  - `node .opencode/skill/system-spec-kit/scripts/dist/spec-folder/nested-changelog.js <spec-folder> --write`

Do not reuse the global component versioning rules for nested packet changelogs.
