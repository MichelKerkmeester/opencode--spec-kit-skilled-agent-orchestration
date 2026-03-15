# Legacy Memory Quarantine

This directory contains memory files that were quarantined during the
022-hybrid-rag-fusion corpus remediation (2026-03-15).

## Why quarantined

These files exhibit one or more non-compliance issues:
- **Leaked Mustache syntax** — literal `{{#TRIGGER_PHRASES}}` template tokens in output
- **Malformed frontmatter** — missing or corrupted YAML front matter
- **Generic trigger phrases** — hardcoded defaults instead of session-specific phrases
- **Low signal** — insufficient substantive content for retrieval value

## Status

- **Excluded from active indexing** — these files are not picked up by `memory_index_scan`
- **Preserved for archival** — some files contain useful historical context
- **Do not move back to `memory/`** without first repairing the specific issues

## Remediation date

2026-03-15 — automated corpus audit + historical remediation pass
