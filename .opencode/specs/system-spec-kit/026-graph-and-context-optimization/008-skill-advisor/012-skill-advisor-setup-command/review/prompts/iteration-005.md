You are running iteration 5 of 7 in a deep-review loop.

# Iteration 5 — Traceability: Packet Identity, Cross-Refs, Parent Doc Sync

## Focus
Audit traceability across the packet:
- packet_id consistency in graph-metadata.json + description.json + frontmatter title
- Cross-references in spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md (paths must resolve)
- Parent doc updates: `008-skill-advisor/{context-index.md, spec.md, tasks.md}` (counts and entries match)
- Nested changelog at `008-skill-advisor/changelog/changelog-008-012-*.md` matches implementation-summary
- `.opencode/README.md` Section 5 + Current Counts table (10 spec_kit, 23 commands, 31 YAML assets)
- `.opencode/command/spec_kit/README.txt` table + structure tree

## Required reads
1. Strategy + prior iterations
2. All in-folder packet docs (spec, plan, tasks, checklist, implementation-summary, graph-metadata, description)
3. `008-skill-advisor/{context-index.md, spec.md, tasks.md}`
4. `008-skill-advisor/changelog/changelog-008-012-skill-advisor-setup-command.md`
5. `.opencode/README.md`
6. `.opencode/command/spec_kit/README.txt`

## What to look for
- packet_id in graph-metadata.json matches spec_folder string in description.json
- All `.md` references in packet docs use full repo-rooted paths and resolve
- Parent context-index.md has new 012 row, summary entry, and open-items entry
- Parent spec.md PHASE DOCUMENTATION MAP table has 12-row entry
- Parent tasks.md has T013 entry referencing the new packet
- `.opencode/README.md` commands count = 23, YAML assets count = 31, spec_kit count = 10 — verify against `ls`/`find`
- `.opencode/command/spec_kit/README.txt` table includes skill-advisor row, structure tree shows new files

## Outputs (MANDATORY)
Same three artifacts pattern with `iteration-005` suffix. ID prefix `F-TRACE-`.

## Constraints
- Read-only.
- Where a count is given, verify it via `ls` / `find` / `grep -c` and report actual vs claimed.
- Cite file:line for every finding.
