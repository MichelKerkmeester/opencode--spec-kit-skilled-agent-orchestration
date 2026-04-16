# Iteration 003: Memory command-doc traceability check

## Focus
Traceability re-verification of `memory/save.md`, `memory/manage.md`, and `memory/README.txt` against the runtime scan contract and canonical-document save surface.

## Findings
### P0 - Blocker
- **F006**: `memory/save.md` still uses retired continuity-artifact framing. The command still says the save script produces "continuity artifacts" and "standalone continuity artifacts" instead of limiting operator-facing outputs to canonical packet docs and `_memory.continuity`. [SOURCE: .opencode/command/memory/save.md:302] [SOURCE: .opencode/command/memory/save.md:547] [SOURCE: .opencode/command/memory/save.md:602]

### P1 - Required
- **NF002**: the command-doc slice is only partially closed. `manage.md` now documents the runtime's 3-source scan pipeline, but `README.txt` still describes scan in "continuity artifacts + canonical spec docs" terms and omits `graph-metadata.json` as a scanned source in troubleshooting text. [SOURCE: .opencode/command/memory/README.txt:157] [SOURCE: .opencode/command/memory/README.txt:212] [SOURCE: .opencode/command/memory/README.txt:304] [SOURCE: .opencode/command/memory/README.txt:318] [SOURCE: .opencode/command/memory/manage.md:262] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:213]

## Closure Checks
- The old `/memory:manage` 4-source claim is closed: `manage.md` now matches runtime with constitutional files, spec documents, and graph metadata as the three scanned sources. [SOURCE: .opencode/command/memory/manage.md:262-270] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:213-215]
- The reviewed command-doc scope no longer advertises `/memory:manage shared`; nearby references limit manage to database, checkpoint, and ingest operations. [SOURCE: .opencode/command/memory/save.md:536-539] [SOURCE: .opencode/command/memory/README.txt:63-66]
- `README.txt` structure text is otherwise updated correctly for the current memory command family layout. [SOURCE: .opencode/command/memory/README.txt:111-120]

## Ruled Out
- `manage.md` is not the remaining mismatch; its retired `memory/*.md` rejection and 3-source scan description are runtime-aligned. [SOURCE: .opencode/command/memory/manage.md:50] [SOURCE: .opencode/command/memory/manage.md:262-270]
- No nearby reviewed scope reintroduced the old shared-member/manage-shared guidance. [SOURCE: .opencode/command/memory/save.md:536-539] [SOURCE: .opencode/command/memory/README.txt:63-66]

## Dead Ends
- This pass did not re-audit workflow YAMLs or non-scoped command files, so only the command-doc slice of NF002 was adjudicated here.

## Recommended Next Focus
Verify the remaining workflow and playbook surfaces tied to F007 and the broader NF002 contract so the packet can tell whether the residual drift is now isolated to command docs only.
