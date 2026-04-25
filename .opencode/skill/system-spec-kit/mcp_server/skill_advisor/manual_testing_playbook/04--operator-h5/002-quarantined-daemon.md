---
title: "OP-002 Quarantined Daemon"
description: "H5 operator playbook for malformed SKILL.md quarantine detection, repair, and revert."
trigger_phrases:
  - "op-002"
  - "quarantined daemon"
  - "quarantined"
---

# OP-002 Quarantined Daemon

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate the quarantine path for malformed skill metadata without damaging the live repo.

---

## 2. SETUP

- Run in a temporary copy of the repository.
- The daemon watcher is active for that copy.
- The operator can restore the copied malformed file.

---

## 3. STEPS

1. Copy repo to a temporary workspace.
2. Introduce a malformed `SKILL.md` frontmatter in the temporary copy only.
3. Wait for the watcher debounce window.
4. Detect:

```text
advisor_status({"workspaceRoot":"/tmp/path-to-copy"})
```

5. Inspect quarantine table or daemon logs for the offending skill path.
6. Fix or revert the malformed temporary file.
7. Re-run status and confirm quarantine count returns to zero.

---

## 4. EXPECTED

- Daemon state reports quarantined behavior or explicit malformed-source diagnostics.
- The offending file path is discoverable.
- Reverting the malformed temporary file clears quarantine after re-scan.
- Live repository files remain untouched.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Live repo modified | `git status --short` in real repo shows the malformed change | Restore immediately and mark scenario failed. |
| Quarantine not visible | Malformed file exists but status remains live without diagnostics | Inspect watcher scope and quarantine DB. |
| Quarantine never clears | Repaired file still reported | Run scan, inspect parse error, then restart daemon if needed. |

---

## 6. RELATED

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/daemon-status.ts`
