---
title: "Eval Scripts"
description: "Evaluation, benchmark, calibration and architecture-boundary checks for Spec Kit memory quality."
trigger_phrases:
  - "eval scripts"
  - "run benchmarks"
  - "import policy"
  - "architecture boundaries"
---

# Eval Scripts

> CLI utilities for measuring memory quality, benchmark behavior and scripts-to-runtime boundaries.

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

`scripts/evals/` contains evaluation runners and policy checks for Spec Kit memory behavior. The tools cover search baselines, channel ablation, performance checks, redaction calibration, import boundaries and evaluation dataset mapping.

Current state:

- TypeScript scripts run with `npx tsx` from the scripts workspace.
- Import policy checks prefer public MCP server API modules over internal runtime paths.
- Allowlisted exceptions are tracked in `import-policy-allowlist.json`.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:package-topology -->
## 2. PACKAGE TOPOLOGY

```text
scripts/evals/
+-- check-allowlist-expiry.ts          # Import exception expiry checks
+-- check-architecture-boundaries.ts   # Architecture boundary checks
+-- check-handler-cycles-ast.ts        # Handler cycle detection
+-- check-no-mcp-lib-imports*.ts       # Internal runtime import checks
+-- import-policy-rules.ts             # Shared import policy rules
+-- map-ground-truth-ids.ts            # Evaluation ID mapping helper
+-- run-*.ts                           # Benchmark, ablation and calibration runners
+-- import-policy-allowlist.json       # Managed import exceptions
`-- README.md
```

Allowed import surfaces:

- `../../mcp_server/api`
- `../../mcp_server/api/*`
- `../../shared/`

Restricted import surfaces:

- `@spec-kit/mcp-server/lib*`
- `@spec-kit/mcp-server/core*`
- `@spec-kit/mcp-server/handlers*`
- Relative imports into `../../mcp_server/{lib,core,handlers}`

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:key-files -->
## 3. KEY FILES

| File | Responsibility |
|---|---|
| `run-ablation.ts` | Measures retrieval channel contribution and reports Recall@K impact. |
| `run-bm25-baseline.ts` | Runs BM25 baseline comparisons for search behavior. |
| `run-performance-benchmarks.ts` | Measures memory operation performance with allowlisted runtime access. |
| `run-redaction-calibration.ts` | Calibrates sensitive-content redaction thresholds. |
| `collect-redaction-calibration-inputs.ts` | Collects data used by redaction calibration runs. |
| `map-ground-truth-ids.ts` | Maps ground-truth identifiers after evaluation database changes. |
| `check-no-mcp-lib-imports-ast.ts` | Enforces restricted import policy with AST traversal. |
| `check-architecture-boundaries.ts` | Checks shared neutrality and wrapper-only boundaries. |
| `import-policy-allowlist.json` | Stores temporary approved exceptions with owner and expiry metadata. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:commands -->
## 4. COMMANDS

Run from `.opencode/skill/system-spec-kit/scripts` unless a command uses a repository-root path.

```bash
npx tsx evals/check-no-mcp-lib-imports-ast.ts
```

Expected result: exits zero when eval scripts avoid restricted runtime imports or use valid allowlist entries.

```bash
npx tsx evals/check-allowlist-expiry.ts
```

Expected result: warns on near-expiry exceptions and fails on expired exceptions.

```bash
npx tsx evals/run-bm25-baseline.ts
```

Expected result: prints BM25 baseline metrics for the configured evaluation data.

```bash
npx tsx evals/run-ablation.ts
```

Expected result: prints channel ablation results when evaluation prerequisites are available.

<!-- /ANCHOR:commands -->

---

<!-- ANCHOR:boundaries -->
## 5. BOUNDARIES

| Boundary | Rule |
|---|---|
| Public API | Eval scripts should use MCP server API exports rather than internal runtime modules. |
| Exceptions | Internal runtime access requires an allowlist entry with owner, reason and expiry. |
| Data | Benchmark scripts may read evaluation databases and fixtures but should not rewrite production memory stores unless a command documents that behavior. |
| Reporting | Evaluation output should state when prerequisites are missing or results are investigation-only. |

<!-- /ANCHOR:boundaries -->

---

<!-- ANCHOR:validation -->
## 6. VALIDATION

Run the README validator after editing this file:

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/scripts/evals/README.md
```

Run policy checks after changing eval scripts:

```bash
cd .opencode/skill/system-spec-kit/scripts
npx tsx evals/check-no-mcp-lib-imports-ast.ts
npx tsx evals/check-allowlist-expiry.ts
```

Expected result: both policy checks exit zero or report a documented exception that needs review.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 7. RELATED

- [`../README.md`](../README.md)
- [`../core/README.md`](../core/README.md)
- [`../../ARCHITECTURE.md`](../../ARCHITECTURE.md)
- [`import-policy-allowlist.json`](./import-policy-allowlist.json)

<!-- /ANCHOR:related -->
