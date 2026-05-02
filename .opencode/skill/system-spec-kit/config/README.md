---
title: "Config: System Spec Kit Runtime Settings"
description: "Current configuration files for memory, search and content filtering behavior."
trigger_phrases:
  - "system spec kit config"
  - "memory configuration"
  - "content filter settings"
---

# Config: System Spec Kit Runtime Settings

> Runtime settings for Spec Kit memory, search and content filtering.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. OWNERSHIP](#2--ownership)
- [3. TREE AND KEY FILES](#3--tree-and-key-files)
- [4. BOUNDARIES](#4--boundaries)
- [5. VALIDATION](#5--validation)
- [6. RELATED](#6--related)

---

## 1. OVERVIEW

`config/` owns JSONC settings read by Spec Kit memory, search and filtering code. These files are operator-editable configuration, not source modules.

Current state:

- `config.jsonc` defines memory index, semantic search, trigger surfacing, decay, tiers, hybrid search, checkpoint and template settings.
- `filters.jsonc` defines the content filtering pipeline used by memory ingest helpers.
- Config files are loaded by runtime code on process startup or script execution.

---

## 2. OWNERSHIP

This directory belongs to the `system-spec-kit` skill. Changes should stay compatible with the loaders under `scripts/core/` and `scripts/lib/`.

---

## 3. TREE AND KEY FILES

```text
config/
+-- README.md       # Directory orientation
+-- config.jsonc    # Main memory, search and template settings
`-- filters.jsonc   # Content filter pipeline settings
```

| File | Role |
|---|---|
| `config.jsonc` | Shared runtime settings for memory retrieval and spec workflow support |
| `filters.jsonc` | Thresholds and scoring weights for content filtering |

---

## 4. BOUNDARIES

- Keep files valid JSONC.
- Do not add code, generated state or packet notes here.
- Add new settings only when a loader or script reads them.
- Keep defaults in code aligned with documented keys.

---

## 5. VALIDATION

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/config/README.md
```

Run the consumer script or test that reads any changed setting before claiming behavior changes.

---

## 6. RELATED

- [`../scripts/core/config.ts`](../scripts/core/config.ts) - Main config loader.
- [`../scripts/lib/content-filter.ts`](../scripts/lib/content-filter.ts) - Filter config consumer.
- [`../references/memory/memory_system.md`](../references/memory/memory_system.md) - Memory behavior reference.
