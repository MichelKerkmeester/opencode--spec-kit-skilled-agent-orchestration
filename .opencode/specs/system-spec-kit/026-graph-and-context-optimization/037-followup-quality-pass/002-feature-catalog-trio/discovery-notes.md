---
title: "Discovery Notes: 037/002 feature-catalog-trio"
description: "Catalog and template discovery notes for the packet 037/002 feature catalog refresh."
trigger_phrases:
  - "037-002-feature-catalog-trio"
  - "catalog discovery"
  - "feature catalog locations"
importance_tier: "important"
contextType: "general"
---
# Discovery Notes: 037/002 feature-catalog-trio

## 1. Commands Run

Requested discovery commands were run from the repository root. The filename-specific searches targeted the root catalog filename and the generic features filename requested in the packet prompt.

```bash
find .opencode/skill -type d -name 'feature_catalog*' -or -type d -name 'feature-catalog*'
find .opencode/skill -type f -name '*feature*catalog*'
find .opencode/skill/sk-doc -name '*feature*catalog*'
```

Additional targeted search was run for code graph paths because no standalone `code_graph` catalog appeared in the requested discovery output.

---

## 2. Catalog Locations Found

| Catalog | Path | Action |
|---|---|---|
| system-spec-kit | `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog` root file | Updated |
| skill_advisor | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/feature_catalog` root file | Updated |
| sk-improve-agent | `.opencode/skill/sk-improve-agent/feature_catalog/feature_catalog` root file | Not in packet scope |
| sk-deep-research | `.opencode/skill/sk-deep-research/feature_catalog/feature_catalog` root file | Not in packet scope |
| sk-deep-review | `.opencode/skill/sk-deep-review/feature_catalog/feature_catalog` root file | Not in packet scope |

No files named `features dot md` were found under `.opencode/skill`.

---

## 3. Template Locations Found

| Template | Path | Use |
|---|---|---|
| Feature catalog creation guide | `.opencode/skill/sk-doc/references/specific/feature_catalog_creation.md` | Format conventions |
| Root catalog template | `.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_template.md` | Root catalog structure |
| Per-feature snippet template | `.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_snippet_template.md` | Per-feature file structure |

Format conventions confirmed:
- root catalogs use frontmatter, an H1 intro, unnumbered `TABLE OF CONTENTS`, and numbered H2 sections
- per-feature files use frontmatter plus `OVERVIEW`, `CURRENT REALITY`, `SOURCE FILES`, and `SOURCE METADATA`
- existing system-spec-kit catalogs preserve local lowercase `feature_catalog` root naming rather than uppercase `FEATURE_CATALOG` naming

---

## 4. code_graph Catalog Gap

No standalone code_graph feature catalog was found at any of these searched locations:

| Search | Result |
|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/**/feature_catalog*` | No matches |
| `.opencode/skill/system-spec-kit/mcp_server/**/code_graph*feature*` | No matches |
| repo-wide feature-catalog path search for code_graph-specific catalog | No standalone catalog |

The live code graph documentation surface is `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md`, and existing catalog entries live inside the system-spec-kit catalog under `22--context-preservation-and-code-graph/`.

Action taken: no standalone code_graph catalog was fabricated. The existing system-spec-kit code-graph readiness entry was updated with the packet 032 read-path/manual freshness contract and packet 035 matrix status note.

---

## 5. Packet 036 Status

Packet 036 is present. The adapter runner files exist under `.opencode/skill/system-spec-kit/mcp_server/matrix-runners/`, including:

- `adapter-cli-codex.ts`
- `adapter-cli-copilot.ts`
- `adapter-cli-gemini.ts`
- `adapter-cli-claude-code.ts`
- `adapter-cli-opencode.ts`
- `run-matrix.ts`
- `matrix-manifest.json`

The CLI adapter catalog entry was therefore added with real source references.
