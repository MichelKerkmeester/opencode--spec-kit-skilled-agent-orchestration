---
title: "Setup Scripts"
description: "Prerequisite, environment, and native-module checks for Spec Kit script workflows."
trigger_phrases:
  - "setup scripts"
  - "check prerequisites"
  - "native module checks"
---

# Setup Scripts

> Shell and Node.js utilities for checking spec-folder readiness and local runtime prerequisites.

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. PACKAGE TOPOLOGY](#2--package-topology)
- [3. KEY FILES](#3--key-files)
- [4. COMMANDS](#4--commands)
- [5. BOUNDARIES](#5--boundaries)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`scripts/setup/` contains preflight utilities for Spec Kit workflows. These scripts check whether a target spec folder has the required documents, whether native Node.js modules are loadable, and whether the recorded Node.js runtime has changed.

Current state:

- Shell entrypoints are run directly from source.
- Node.js helpers run from the scripts workspace.
- Full spec-folder validation delegates to `scripts/spec/validate.sh` when requested.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:package-topology -->
## 2. PACKAGE TOPOLOGY

```text
scripts/setup/
+-- check-prerequisites.sh       # Spec-folder readiness checks
+-- check-native-modules.sh      # Native module availability checks
+-- rebuild-native-modules.sh    # Native module rebuild helper
+-- record-node-version.js       # Node.js version recorder
`-- README.md
```

Allowed direction:

- Setup scripts may call `scripts/spec/validate.sh` for strict spec-folder validation.
- Native-module scripts may inspect package-local dependencies.
- Callers may parse `--json` or `--paths-only` output from `check-prerequisites.sh`.

Disallowed direction:

- Setup scripts should not create or edit spec documents.
- Setup scripts should not import generated `dist/` modules unless a command explicitly checks built output.
- Runtime callers should not depend on human-readable output when a machine flag exists.

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:key-files -->
## 3. KEY FILES

| File | Responsibility |
|---|---|
| `check-prerequisites.sh` | Checks spec-folder presence, required docs, optional task docs and validation status. |
| `check-native-modules.sh` | Verifies native modules required by the scripts workspace can load. |
| `rebuild-native-modules.sh` | Rebuilds native modules after Node.js or dependency changes. |
| `record-node-version.js` | Records the active Node.js version for rebuild checks. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:commands -->
## 4. COMMANDS

Run from the repository root unless noted.

```bash
.opencode/skill/system-spec-kit/scripts/setup/check-prerequisites.sh
```

Expected result: prints `FEATURE_DIR` and available supporting documents for the active spec folder.

```bash
.opencode/skill/system-spec-kit/scripts/setup/check-prerequisites.sh --json --validate-strict
```

Expected result: emits JSON and exits non-zero if strict spec validation fails.

```bash
.opencode/skill/system-spec-kit/scripts/setup/check-native-modules.sh
```

Expected result: exits zero when native dependencies load in the current Node.js runtime.

```bash
.opencode/skill/system-spec-kit/scripts/setup/rebuild-native-modules.sh
```

Expected result: rebuilds native modules for the current Node.js runtime.

<!-- /ANCHOR:commands -->

---

<!-- ANCHOR:boundaries -->
## 5. BOUNDARIES

| Boundary | Rule |
|---|---|
| Scope | These scripts report readiness. They do not repair spec folders or choose implementation work. |
| Output | Use `--json` for automation and default output for terminal checks. |
| Validation | `--validate` and `--validate-strict` delegate to the spec validator instead of duplicating its rules. |
| Dependencies | Native-module checks stay limited to package health and rebuild guidance. |

<!-- /ANCHOR:boundaries -->

---

<!-- ANCHOR:validation -->
## 6. VALIDATION

Run the README validator after editing this file:

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/scripts/setup/README.md
```

Run command checks after changing setup scripts:

```bash
.opencode/skill/system-spec-kit/scripts/setup/check-prerequisites.sh --json
.opencode/skill/system-spec-kit/scripts/setup/check-native-modules.sh
```

Expected result: each command exits zero in a configured workspace.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 7. RELATED

- [`../README.md`](../README.md)
- [`../spec/README.md`](../spec/README.md)
- [`../rules/README.md`](../rules/README.md)
- [`../../README.md`](../../README.md)

<!-- /ANCHOR:related -->
