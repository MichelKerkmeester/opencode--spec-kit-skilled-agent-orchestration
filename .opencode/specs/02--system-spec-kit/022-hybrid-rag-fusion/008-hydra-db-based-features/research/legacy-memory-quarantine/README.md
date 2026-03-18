# Legacy Memory Quarantine

> Archived historical memory artifacts retained for traceability and remediation notes after reclassification from `scratch/` to `research/`.

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. WHY QUARANTINED](#2--why-quarantined)
- [3. STATUS](#3--status)
- [4. REMEDIATION DATE](#4--remediation-date)

## 1. OVERVIEW

This directory contains memory files that were quarantined during the
`022-hybrid-rag-fusion` corpus remediation on 2026-03-15.

## 2. WHY QUARANTINED

These files exhibit one or more non-compliance issues:
- **Leaked Mustache syntax** — literal `{{#TRIGGER_PHRASES}}` template tokens in output
- **Malformed frontmatter** — missing or corrupted YAML front matter
- **Generic trigger phrases** — hardcoded defaults instead of session-specific phrases
- **Low signal** — insufficient substantive content for retrieval value

## 3. STATUS

- **Excluded from active indexing** — these files are not picked up by `memory_index_scan`
- **Preserved for archival** — some files contain useful historical context and should remain in `research/`
- **Do not move back to `memory/`** without first repairing the specific issues

## 4. REMEDIATION DATE

2026-03-15 — automated corpus audit + historical remediation pass
