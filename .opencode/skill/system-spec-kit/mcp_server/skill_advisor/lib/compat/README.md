---
title: "Compatibility Library: Advisor Status And Redirect Probes"
description: "Compatibility helpers for reading advisor status, probing daemon availability and normalizing redirect metadata."
trigger_phrases:
  - "advisor compatibility"
  - "daemon probe"
  - "redirect metadata"
---

# Compatibility Library: Advisor Status And Redirect Probes

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES AND FLOW](#4--boundaries-and-flow)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

---

## 1. OVERVIEW

`lib/compat/` contains compatibility helpers for advisor status reading, daemon probing and redirect metadata. These modules keep adapter-facing checks separate from the scorer and prompt rendering path.

Current state:

- Reads advisor status data for compatibility checks.
- Probes daemon state without mixing that behavior into scorer modules.
- Normalizes redirect metadata and compatibility contracts.

---

## 2. DIRECTORY TREE

```text
compat/
+-- advisor-status-reader.ts   # Reads advisor status payloads
+-- contract.ts                # Compatibility contract helpers
+-- daemon-probe.ts            # Daemon availability probe
+-- redirect-metadata.ts       # Redirect metadata normalization
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `advisor-status-reader.ts` | Reads and shapes advisor status data. |
| `contract.ts` | Holds compatibility contract helpers. |
| `daemon-probe.ts` | Checks advisor daemon availability. |
| `redirect-metadata.ts` | Normalizes lifecycle redirect metadata. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | May import schema contracts and local status helpers. |
| Exports | Export compatibility and probe helpers only. |
| Ownership | Put compatibility probes here. Put daemon runtime helpers in `../daemon/` and status schemas in `../../schemas/`. |

Main flow:

```text
status or compatibility request
  -> reader, contract helper or daemon probe
  -> normalized compatibility result
  -> caller renders status or redirect metadata
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `advisor-status-reader.ts` | TypeScript module | Reads advisor status state. |
| `daemon-probe.ts` | TypeScript module | Probes daemon availability. |
| `redirect-metadata.ts` | TypeScript module | Normalizes redirect metadata. |
| `contract.ts` | TypeScript module | Compatibility contract helpers. |

---

## 6. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/compat/README.md
```

Expected result: exit code `0`.

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../../schemas/README.md`](../../schemas/README.md)
