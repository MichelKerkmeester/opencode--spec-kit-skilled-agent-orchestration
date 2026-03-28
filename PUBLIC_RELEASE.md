# OpenCode Dev Environment - Public Release

The **Public repo** is the source of truth for the OpenCode framework. Projects like your-project.com consume it via a `.opencode/` symlink — edits to `.opencode/` affect all linked projects instantly.

---

## 1. ARCHITECTURE

```text
Public Repo (source of truth)
  .opencode/                    ← Framework: skills, agents, commands, scripts
     skill/
     agent/
     command/
     scripts/
     specs/                     ← Project specs (subfolders gitignored per-project)
     ...
  .claude/                      ← Claude Code runtime adapter (agents, mcp.json)
  .gemini/                      ← Gemini CLI runtime adapter (agents, commands, skills, settings.json)

your-project.com (consumer project)
  .opencode -> Public/.opencode  ← SYMLINK (entire framework + specs)
  .opencode-local/               ← Project-specific runtime data
    database/
      context-index.sqlite
  opencode.json                  ← MCP config (sets SPEC_KIT_DB_DIR)
  AGENTS.md                      ← Project-specific AI instructions
```

### Key Design Decision: `SPEC_KIT_DB_DIR`

When `.opencode/` is a symlink, Node.js `__dirname` in CommonJS resolves to the **real path** (Public), not the symlink path (project). The `SPEC_KIT_DB_DIR` environment variable in `opencode.json` overrides the database path to keep each project's database isolated in `.opencode-local/database/`.

---

## 2. REPOSITORY LOCATIONS

| Location                    | Path/URL                                                         |
| --------------------------- | ---------------------------------------------------------------- |
| **Public Release (local)**  | `~/your-project/` |
| **Public Release (GitHub)** | https://github.com/MichelKerkmeester/opencode-spec-kit-framework |

---

## 3. SHARED VS PROJECT-SPECIFIC

### Shared (via symlink — lives in Public repo)

| Component      | Path                          |
| -------------- | ----------------------------- |
| Skills         | `.opencode/skill/`            |
| Commands       | `.opencode/command/`          |
| Install Guides | `.opencode/install_guides/`   |
| Scripts        | `.opencode/scripts/`          |
| Agents         | `.opencode/agent/`            |

### Project-Specific (gitignored per-subfolder in Public)

| Component                   | Location                   | Reason                           |
| --------------------------- | -------------------------- | -------------------------------- |
| `.opencode/specs/NNN-*/`    | Through symlink            | Project-specific documentation   |
| `.opencode-local/database/` | Project root               | Per-project SQLite databases     |
| `opencode.json`             | Project root               | MCP config with SPEC_KIT_DB_DIR  |
| `.utcp_config.json`         | Project root               | Code Mode configuration          |
| `AGENTS.md`               | Project root               | Project-specific AI instructions |
| `src/`                      | Project root               | Project source code              |

---

## 4. RELEASE WORKFLOW

Since `.opencode/` is a symlink, the old "sync" step is eliminated. Changes to the framework are made directly in the Public repo.

### Workflow Overview

```text
Changes Made in Public/.opencode/
         │
         ▼
┌─────────────────────┐
│  PHASE 1: CLASSIFY  │ ─── Determine release type
└──────────┬──────────┘
           │
      ┌────┴────┐
      │ Release │
      │  Type?  │
      └────┬────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
No Release   Full Release
(commit)          │
    │        ┌────┴─────┐
    │        │ PHASE 2  │ ─── Release notes + CHANGELOGs
    │        │ DOCUMENT │
    │        └────┬─────┘
    │             │
    └──────┬──────┘
           │
    ┌──────┴──────┐
    │   PHASE 3   │ ─── Show changes, get approval
    │   REVIEW    │<--- STOP: User approval required
    └──────┬──────┘
           │
    ┌──────┴──────┐
    │   PHASE 4   │ ─── git add, commit, push
    │   COMMIT    │
    └──────┬──────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
  Done       ┌────┴─────┐
             │ PHASE 5  │ ─── Tag, GitHub release
             │ PUBLISH  │
             └────┬─────┘
                  │
                  ▼
                Done
         (Full Release)
```

### Phase 1: CLASSIFY

| Change Type                          | Release Type    | Version Impact |
| ------------------------------------ | --------------- | -------------- |
| Typo fixes, minor doc updates        | **No Release**  | None           |
| Bug fixes within current series      | **Patch**       | `x.x.x.+1`    |
| New feature or thematic changes      | **Series**      | `x.x.+1.0`    |
| Breaking changes requiring migration | **Major**       | `x.+1.0.0`    |

### Phase 2: DOCUMENT (Full Release Only)

1. **Draft release notes** using template in Section 7
2. **Create version changelog** — Write `changelog/vX.X.X.X.md` using release notes template (Section 7)
3. **Update Skill CHANGELOGs** (`Public/.opencode/skill/*/CHANGELOG.md`) if applicable
4. **Determine version number** using Section 8

### Phase 3: REVIEW

> **HARD STOP:** Do NOT proceed without user approval.

```bash
cd ~/your-project/
git status
git diff --stat
```

### Phase 4: COMMIT

```bash
cd ~/your-project/
git add -A
git commit -m "vX.X.X.X: [Release title]"
git push origin main
```

### Phase 5: PUBLISH (Full Release Only)

```bash
cd ~/your-project/

# 1. Create annotated tag
git tag -a vX.X.X.X -m "vX.X.X.X: Release description"

# 2. Push tag
git push origin vX.X.X.X

# 3. Create GitHub release (MANDATORY — tags alone do NOT appear as releases)
gh release create vX.X.X.X \
  --title "vX.X.X.X — Release Title" \
  --notes "$(cat <<'EOF'
## Summary
<release notes body — see Section 7 for format>

## Highlights
...

## Upgrade
...

Full changelog: [changelog/<component>/vX.X.X.X.md](link)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

> **CRITICAL**: `git push origin vX.X.X.X` only pushes the tag — it does NOT create a GitHub Release. You MUST run `gh release create` to make the release visible on the GitHub Releases page with formatted notes and downloadable assets.

---

## 5. CURRENT RELEASE

| Field              | Value                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------- |
| **Version**        | v3.0.0.2                                                                               |
| **Release Date**   | 2026-03-28                                                                             |
| **GitHub**         | https://github.com/MichelKerkmeester/opencode-spec-kit-framework                       |
| **Latest Release** | https://github.com/MichelKerkmeester/opencode-spec-kit-framework/releases/latest       |
| **Release Notes**  | https://github.com/MichelKerkmeester/opencode-spec-kit-framework/releases/tag/v3.0.0.2 |

### Release Notes

Release notes for each version are stored as individual files in `.opencode/changelog/00--opencode-environment/vX.X.X.X.md`, formatted per the template in Section 7. For GitHub publishing, use an extracted body that excludes the local changelog wrapper (`# v...`, `> Part of ...`, `## [**x.x.x.x**] - date`).

**Latest**: See `.opencode/changelog/01--system-spec-kit/v3.0.0.2.md`

---

## 6. ADDING A NEW PROJECT

To connect a new project to the shared OpenCode framework:

```bash
# 1. Create symlink to shared framework
ln -s ~/your-project/.opencode .opencode

# 2. Create project-local directory for database
mkdir -p .opencode-local/database

# 3. Copy opencode.json (already has SPEC_KIT_DB_DIR set)
cp ~/your-project/opencode.json .

# 4. Create specs directory and first spec folder
mkdir -p .opencode/specs

# 5. Add spec subfolder to Public .gitignore (each project gets its own entry)
# Edit Public/.gitignore and add: .opencode/specs/NNN-your-project/

# 6. Add to project .gitignore
echo ".opencode" >> .gitignore
echo ".opencode-local/" >> .gitignore
```

---

## 7. RELEASE NOTES TEMPLATE

GitHub release notes format optimized for scannability. Uses H2/H3 structure with category headers.

### 7.1 Format

```markdown
Short summary (1-2 sentences) with **bold key stats** like counts, percentages, or spec numbers.

## Highlights

### Category: Fixes
- **Feature name**: Description of what it does
- **Another feature**: More details here
- **Path format**: `old/path` → `new/path` (use arrows for changes)

### Category: Documentation
- **Item one**: Description
- **Item two**: Description with `code` references

## Files Changed
- `file1.yaml` · `file2.yaml` (use middle dots for inline lists)
- `file3.yaml`

## Upgrade
1. **Step one** — Description of upgrade step
2. **Step two** — Another step if needed

Or for simple patches: "No action required. Pull latest to get [description]."
```

### 7.2 Rules

> **Note:** Category headers are used for GitHub release notes and local changelog files should stay plain text.

**Structure:**
- 1-2 sentence summary with **bold** key stats (counts, percentages, spec numbers)
- `## Highlights` as main H2 section
- `### Category: <Title>` for H3 category headers
- Bullet points with **bold label**: description
- `## Files Changed` section listing affected files
- `## Upgrade` section (always last)

**GitHub release body hygiene:**
- Never include local changelog wrapper lines in GitHub release notes:
  - `# vX.X.X.X`
  - `> Part of ...`
  - `## [**X.X.X.X**] - YYYY-MM-DD`
- GitHub release notes must start with the summary paragraph and then `## Highlights`

**Category vocabulary for H3 headers:**
- `Fixes` - repairs, patches
- `Architecture` - structure changes
- `Documentation` - templates
- `Testing` - validation
- `Commands` - workflows
- `Features` - new items
- `Breaking Changes` - compatibility impacts

**Inline formatting:**
- `·` (middle dot) for compact file lists: `file1.yaml` · `file2.yaml`
- `→` (arrow) for before/after: `old_name` → `new_name`
- **Bold** for feature names and stats
- `code` for file names, paths, commands

### 7.3 Checklist

Before publishing:
- [ ] 1-2 sentence summary with **bold** key stats
- [ ] GitHub notes body excludes local changelog wrapper header block
- [ ] `## Highlights` H2 section present
- [ ] `### Category: <Title>` H3 headers for categories
- [ ] Bullet points use **bold label**: description format
- [ ] `## Files Changed` section listing affected files
- [ ] `## Upgrade` section last
- [ ] Category labels are consistent and plain text

---

## 8. VERSIONING SCHEME

Releases use a 4-part versioning scheme: `MAJOR.MINOR.SERIES.PATCH`

| Part       | Meaning                                    | Example   |
| ---------- | ------------------------------------------ | --------- |
| **MAJOR**  | Breaking changes requiring migration       | `2.0.0.0` |
| **MINOR**  | New features (backward compatible)         | `1.1.0.0` |
| **SERIES** | Thematic grouping (e.g., Narsil migration) | `1.0.1.0` |
| **PATCH**  | Bug fixes within a series                  | `1.0.1.2` |

### Series History

| Series    | Range       | Theme                                    |
| --------- | ----------- | ---------------------------------------- |
| `1.0.0.x` | 1.0.0.0-8   | Initial release (LEANN-based)            |
| `1.0.1.x` | 1.0.1.0-7   | Narsil migration (unified code intel)    |
| `1.0.2.x` | 1.0.2.0-9   | Skill audit + Figma MCP                  |
| `1.1.0.x` | 1.1.0.0-1   | Cognitive Memory + Agent System          |
| `1.2.0.x` | 1.2.0.0-3   | Causal Memory & Command Consolidation    |
| `1.2.1.x` | 1.2.1.0     | workflows-code--opencode + Narsil removal |
| `1.2.2.x` | 1.2.2.0-2   | Coding Analysis Lenses + MCP bug fixes   |
| `1.2.3.x` | 1.2.3.0     | Ecosystem remediation + schema unification |
| `1.2.4.x` | 1.2.4.0-1   | Orchestrate agent Context Window Budget  |
| `1.2.5.x` | 1.2.5.0     | workflows-code--opencode Phase 17 alignment |
| `1.3.0.x` | 1.3.0.0     | Agent fleet overhaul + @context            |
| `1.3.1.x` | 1.3.1.0     | @context prompt compression                |
| `1.3.2.x` | 1.3.2.0     | @speckit exclusivity + governance rules    |
| `1.3.3.x` | 1.3.3.0     | Claude Code subagents + orchestrate.md improvements |
| `2.0.0.x` | 2.0.0.0-7   | JS→TS migration, Spec Kit script automation, architectural refactoring |
| `2.0.1.x` | 2.0.1.0-5   | Documentation alignment, security fixes & optimization (specs 008, 111-118) |
| `2.0.2.x` | 2.0.2.0-3   | Agent routing compliance + changelog reorganization (spec 014) |
| `2.1.0.x` | 2.1.0.0     | Spec-doc indexing highlight promotion                          |
| `2.1.1.x` | 2.1.1.0     | Aggregate unreleased framework changes                         |
| `2.1.2.x` | 2.1.2.0     | Gate enforcement + skill reference indexing (Source #6)        |
| `2.1.3.x` | 2.1.3.0-6   | Agent model upgrade to Sonnet 4.6 + MCP recovery hardening + release-doc clarifications |
| `2.1.4.x` | 2.1.4.0     | HVR integration across documentation templates                                          |
| `2.2.0.x` | 2.2.0.0-2   | System Spec Kit verification hardening + release-doc refresh (deferred-suite activation, CHK-336 closure, README/metadata sync) |
| `2.2.1.x` | 2.2.1.0     | Context overload prevention for orchestrator agents                                     |
| `2.2.2.x` | 2.2.2.0     | Gemini CLI agent fleet + TOML commands + MCP server config                              |
| `2.3.0.x` | 2.3.0.0     | Gemini CLI full provider integration (4th runtime: agents, commands, skills, MCP)        |
| `2.4.0.x` | 2.4.0.0-3   | SpecKit/Review/Agents consolidation + @ultra-think agent + sk-git commit logic           |
| `3.0.0.x` | 3.0.0.0-2   | Hybrid RAG Fusion platform release: 5-channel retrieval, review mode, 23 README rewrites, 4 CLI skills, 57 component releases |

---

## 9. NOTES

- **Source of truth**: Public repo contains the authoritative OpenCode framework
- **Symlink model**: Projects consume the framework via `.opencode/` symlink
- **Database isolation**: Each project has its own database in `.opencode-local/database/`
- **Never shared**: Database files (`*.sqlite`) and project-specific spec subfolders (`.opencode/specs/NNN-*/` gitignored per-project)
- **Instant propagation**: Framework changes in Public are immediately available to all linked projects
