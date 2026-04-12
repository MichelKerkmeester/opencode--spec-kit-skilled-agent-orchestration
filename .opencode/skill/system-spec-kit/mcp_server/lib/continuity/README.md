---
title: "Continuity"
description: "Thin continuity record parsing, validation, and frontmatter helpers."
trigger_phrases:
  - "thin continuity"
  - "continuity record"
---

# Continuity

## 1. OVERVIEW

`lib/continuity/` currently provides the thin continuity record contract used for `_memory.continuity` frontmatter.

- `thin-continuity-record.ts` validates bounded continuity fields, enforces byte limits, and reads or writes the compact continuity record used by packet-local recovery.

## 2. RELATED

- `../resume/README.md`
- `../routing/README.md`
