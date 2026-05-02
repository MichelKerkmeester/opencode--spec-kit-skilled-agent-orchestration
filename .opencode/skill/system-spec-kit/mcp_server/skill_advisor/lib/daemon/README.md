---
title: "Daemon Library: Advisor Watcher Lifecycle"
description: "Lease, lifecycle, state mutation and watcher orchestration helpers for the skill-advisor daemon path."
trigger_phrases:
  - "advisor daemon"
  - "watcher orchestrator"
  - "daemon lease"
---

# Daemon Library: Advisor Watcher Lifecycle

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

`lib/daemon/` contains helpers for the skill-advisor daemon and watcher path. It keeps leases, lifecycle state, state mutation and watcher orchestration separate from scorer and rendering modules.

Current state:

- Tracks daemon lease behavior and lifecycle state.
- Owns watcher orchestration and low-level watcher helpers.
- Keeps mutation helpers close to daemon state management.

---

## 2. DIRECTORY TREE

```text
daemon/
+-- lease.ts                  # Daemon lease helper
+-- lifecycle.ts              # Daemon lifecycle state helpers
+-- state-mutation.ts         # State mutation helpers
+-- watcher-orchestrator.ts   # Watcher orchestration path
+-- watcher.ts                # Low-level watcher helper
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `lease.ts` | Manages daemon lease state. |
| `lifecycle.ts` | Encodes daemon lifecycle transitions and status. |
| `state-mutation.ts` | Applies controlled daemon state updates. |
| `watcher-orchestrator.ts` | Coordinates watcher behavior across daemon inputs. |
| `watcher.ts` | Implements the watcher helper used by the orchestrator. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Keep daemon state helpers in this folder or shared runtime utilities. |
| Exports | Export daemon lifecycle and watcher helpers only. |
| Ownership | Put daemon behavior here. Put compatibility probes in `../compat/` and status schemas in `../../schemas/`. |

Main flow:

```text
daemon startup or file change
  -> lease and lifecycle check
  -> watcher orchestration
  -> controlled state mutation
  -> caller reads updated advisor status
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `watcher-orchestrator.ts` | TypeScript module | Coordinates watcher work. |
| `watcher.ts` | TypeScript module | Low-level watcher behavior. |
| `lifecycle.ts` | TypeScript module | Daemon lifecycle helpers. |
| `lease.ts` | TypeScript module | Lease state helpers. |

---

## 6. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/README.md
```

Expected result: exit code `0`.

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../compat/README.md`](../compat/README.md)
- [`../../schemas/README.md`](../../schemas/README.md)
