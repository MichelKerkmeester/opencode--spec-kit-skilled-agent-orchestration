# Resource Map Scripts

> CommonJS helper for turning review or research evidence into a resource map ledger.

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

`scripts/resource-map/` owns the CommonJS helper that turns deep review or deep research evidence into a `resource-map.md` ledger.

Current state:

- `extract-from-evidence.cjs` exports `emitResourceMap`.
- The helper accepts review and research evidence shapes.
- Output is a markdown resource ledger grouped by repo file category.

---

## 2. OWNERSHIP

This directory belongs to the System Spec Kit script layer. Keep it usable from CommonJS callers and avoid runtime dependencies that complicate script execution.

---

## 3. TREE AND KEY FILES

```text
scripts/resource-map/
+-- README.md
`-- extract-from-evidence.cjs
```

| File | Role |
|---|---|
| `extract-from-evidence.cjs` | Exports `emitResourceMap({ shape, deltas, packet, scope, createdAt })` |

---

## 4. BOUNDARIES

- Accept only `review` and `research` shapes unless callers are updated first.
- Emit repo-relative paths only.
- Reject traversal-style paths during normalization.
- Keep category output deterministic.

---

## 5. VALIDATION

```bash
node - <<'NODE'
const { emitResourceMap } = require('./.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs')
console.log(emitResourceMap({ shape: 'research', deltas: [{ sources: ['README.md'] }], scope: 'smoke' }).includes('README.md'))
NODE
```

Expected result: `true`.

---

## 6. RELATED

- [`../`](../) - System Spec Kit scripts.
- [`../../templates/level_contract_optional_resource-map.md`](../../templates/level_contract_optional_resource-map.md) - Optional resource map contract.
