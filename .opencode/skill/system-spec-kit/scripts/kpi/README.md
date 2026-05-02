---
title: "KPI Scripts"
description: "Quality KPI reporter for generated continuity support artifacts under spec memory folders."
trigger_phrases:
  - "quality kpi"
  - "memory quality rates"
  - "placeholder rate"
  - "contamination check"
---

<!-- markdownlint-disable MD025 -->

# KPI Scripts

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. PACKAGE TOPOLOGY](#2-package-topology)
- [3. ENTRYPOINTS](#3-entrypoints)
- [4. VALIDATION](#4-validation)
- [5. RELATED](#5-related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`scripts/kpi/` reports defect rates for generated continuity support
artifacts. It scans markdown under spec `memory/` directories and emits JSON
metrics plus a concise stderr summary.

Boundary:

- Resume source of truth remains
  `handover.md -> _memory.continuity -> spec docs`.
- Generated memory artifacts are supporting evidence only.
- Defect rates are reported, not enforced; callers decide thresholds.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:package-topology -->
## 2. PACKAGE TOPOLOGY

```text
scripts/kpi/
+-- quality-kpi.sh  # Shell wrapper with inline Node.js scanner
`-- README.md
```

Flow:

```text
quality-kpi.sh -> .opencode/specs/**/memory/*.md -> JSON rates + summary
```

Metrics:

| Metric | Flags |
| --- | --- |
| Placeholder rate | `[TBD]`, `[Not assessed]`, `[N/A]` |
| Fallback rate | Generic fallback phrases in generated content |
| Contamination rate | AI process leakage such as "Let me analyze" |
| Empty trigger phrase rate | Frontmatter with no `trigger_phrases` entries |

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:entrypoints -->
## 3. ENTRYPOINTS

Run from the repository root:

```bash
bash .opencode/skill/system-spec-kit/scripts/kpi/quality-kpi.sh
bash .opencode/skill/system-spec-kit/scripts/kpi/quality-kpi.sh \
  "system-spec-kit/022-hybrid-rag-fusion"
```

The optional argument is a spec-folder path relative to `.opencode/specs/`.

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 4. VALIDATION

Use repository-root commands:

```bash
bash .opencode/skill/system-spec-kit/scripts/kpi/quality-kpi.sh >/tmp/spec-kit-kpi.json
node -e "const fs=require('fs'); \
JSON.parse(fs.readFileSync('/tmp/spec-kit-kpi.json','utf8')); \
console.log('valid json')"
```

Expected behavior: the first command exits `0`, writes JSON to stdout and
prints a `KPI Summary:` line to stderr.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 5. RELATED

- [`../README.md`](../README.md)
- [`../memory/README.md`](../memory/README.md)
- [`../evals/README.md`](../evals/README.md)
- [`../tests/README.md`](../tests/README.md)

<!-- /ANCHOR:related -->
