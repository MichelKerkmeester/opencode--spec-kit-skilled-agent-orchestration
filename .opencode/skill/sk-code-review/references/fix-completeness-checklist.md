---
title: Fix Completeness Checklist
description: Checklist for turning review findings into complete fixes across same-class producers, consumers, algorithms, matrices, and hostile environments.
---

# Fix Completeness Checklist

## 1. Overview

Use this checklist when turning review findings into complete fixes. It keeps the proof focused on sibling producers, consumers, changed algorithms, matrix coverage, and hostile runtime state.

## 2. Classification

State one class for every actionable finding:

| Class | Use When | Required Proof |
|-------|----------|----------------|
| `instance-only` | One cited site and grep proves no siblings or consumers | Exact grep command and result |
| `class-of-bug` | Same field/string/helper/error pattern can appear at sibling sites | Same-class producer inventory |
| `cross-consumer` | Changed policy/helper/field is observed by other handlers, status, DB, docs, or tests | Consumer inventory |
| `algorithmic` | Regex/parser/path/resolver/security logic is being changed | Invariant plus adversarial table tests |
| `matrix/evidence` | Env/default/per-call, full/incremental, fresh/stale, root shape, runtime, or doc evidence axes exist | Full row table and SHA/range pin |
| `test-isolation` | Env/global-state/singleton behavior is tested | Capture/restore proof and hostile env variant |

### Instance-Only Opt-Out

A finding may use the narrow fix path only when all are true:

- It is not P0/P1 security, path, auth/authz, sandboxing, env precedence, schema, persistence, or public-response behavior.
- `rg` proves no same-class producer or consumer.
- Verification is local and cheap: one focused test, one doc row, or one static audit command.
- The fix response includes the exact command evidence for the opt-out.

Otherwise, run the full fix completeness checklist.

## 3. Required Inventories

Same-class producers:

```bash
rg -n '<field|string|helper|literal|error-pattern>' <changed-files-or-module>
rg -n 'errors\.push|warnings\.push|throw new Error|JSON.stringify|return \{.*error|message:' <changed-files-or-module>
```

Consumers:

```bash
rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'
```

Algorithm smell:

```bash
rg -n '\.replace\(|new RegExp|startsWith\(|includes\(|split\(' <changed-files>
```

Matrix/evidence:

```bash
rg -n 'it\.each|test\.each|describe\.each|REQ-|source:' <changed-tests-and-packet-docs>
git rev-parse --verify HEAD
git diff --name-only <FIX_SHA>^..<FIX_SHA>
```

Hostile env/global state:

```bash
env <RELEVANT_ENV>=true <focused-test-command>
env -u <RELEVANT_ENV> <focused-test-command>
rg -n '<ENV_OR_GLOBAL_NAME>|original.*Env|afterEach|finally|reset\(' <changed-test-files>
```

## 4. Completion Output

The fix response must include:

- Changed files.
- Finding class table.
- Same-class producer inventory.
- Consumer inventory.
- Matrix rows added or verified.
- Hostile env command when relevant.
- Previously closed gates rechecked.
- Intentionally unchanged siblings/consumers with evidence.
