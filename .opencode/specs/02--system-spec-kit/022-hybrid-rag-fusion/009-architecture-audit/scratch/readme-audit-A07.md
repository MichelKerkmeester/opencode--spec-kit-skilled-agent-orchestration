# README Audit Report: A07 -- scripts/kpi/

**Auditor:** Claude Opus 4.6
**Date:** 2026-03-08
**Scope:** `.opencode/skill/system-spec-kit/scripts/kpi/`

---

## Status: CREATED

The `kpi/` folder had no README. One was created from scratch.

## Source Files Reviewed

| File | Lines | Notes |
| --- | --- | --- |
| `quality-kpi.sh` | 101 | Bash wrapper around inline Node script. Scans memory markdown for four defect classes. |

## README Coverage

| Section | Present | Accurate |
| --- | --- | --- |
| YAML frontmatter (title, description, trigger_phrases) | Yes | Yes |
| TOC with anchors | Yes | Yes |
| OVERVIEW | Yes | Yes |
| STRUCTURE (file table) | Yes | Yes |
| USAGE (commands + output description) | Yes | Yes |
| METRICS (detection rules) | Yes | Yes |
| RELATED DOCUMENTS | Yes | Yes |

## Compliance Notes

- Follows the YAML frontmatter + numbered ALL CAPS section pattern used by sibling READMEs (`ops/`, `memory/`).
- ANCHOR comments match sibling conventions.
- File table has one entry (only one file exists in the folder).
- No HVR-banned words used.
- No em dashes, no semicolons, no Oxford commas.
- Active voice throughout.

## Observations

1. The `kpi/` folder contains a single shell script. The README is intentionally concise.
2. The script embeds Node.js inline via a heredoc rather than calling an external `.js` or `.ts` file. This is noted in the file table description.
3. The script has no compiled dist counterpart (unlike the TypeScript-based scripts in `memory/`). It runs directly as a bash executable.
4. The parent `scripts/README.md` already lists `kpi/` with a brief description. No parent update was needed.
