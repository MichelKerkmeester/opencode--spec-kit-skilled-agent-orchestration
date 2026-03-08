# README Audit A06 -- Shared Sub-Folder READMEs

**Date:** 2026-03-08
**Scope:** Three sub-folders under `shared/` in `system-spec-kit`
**Status:** Complete

---

## Folders Addressed

| # | Folder | Files Read | README Created |
| - | ------ | ---------- | -------------- |
| 1 | `shared/parsing/` | `quality-extractors.ts`, `quality-extractors.test.ts` | Yes |
| 2 | `shared/embeddings/providers/` | `hf-local.ts`, `openai.ts`, `voyage.ts` | Yes |
| 3 | `shared/mcp_server/database/` | `.db-updated` (metadata only) | Yes (minimal) |

## Format Compliance

All three READMEs follow the established pattern from existing READMEs (`shared/embeddings/README.md`, `shared/utils/README.md`):

- YAML frontmatter with `title`, `description`, `trigger_phrases`
- Numbered ALL CAPS H2 sections with `<!-- ANCHOR -->` wrappers
- Table of contents with anchor links
- File listing tables
- No HVR-banned words
- No em dashes, no semicolons, no Oxford commas
- Active voice throughout

## Key Decisions

1. **parsing/README.md** -- Documented the T040 acceptance criteria (body text must not be parsed as metadata) since it is the primary behavioral contract.
2. **providers/README.md** -- Included a provider comparison table since the three files are direct alternatives. Documented REQ-032 retry behavior shared by OpenAI and Voyage.
3. **database/README.md** -- Kept minimal since the folder contains no source code. Focused on explaining the path resolution mechanism (`config.ts`, `paths.ts`) and the per-profile naming convention.

## Files Created

```
.opencode/skill/system-spec-kit/shared/parsing/README.md
.opencode/skill/system-spec-kit/shared/embeddings/providers/README.md
.opencode/skill/system-spec-kit/shared/mcp_server/database/README.md
```
