# Feature catalog code references

## 1. OVERVIEW

Feature catalog code references embed inline traceability comments in every source file, linking implementation code back to the feature catalog by name. Each file declares which catalog features it implements via `// Feature catalog: <feature-name>` comments near the top of the file.

This feature works like a label on a warehouse box — instead of tracking items by aisle number (which changes when shelves move), you write the product name directly on the box. Anyone can grep the codebase for a feature name and immediately find every file that implements it, without needing to know the folder structure or historical sprint/phase numbering.

---

## 2. CURRENT REALITY

Every non-test TypeScript file under `mcp_server/` and `shared/` carries one or more `// Feature catalog: <feature-name>` comments whose name must exactly match an H3 heading in `feature_catalog/feature_catalog.md`. Files implementing multiple catalog features list all applicable entries. Pure utility, type, and barrel-export files that do not map to any specific feature are exempt.

The `// MODULE: Name` header convention provides a standardized 3-line block at the top of every `.ts` file (separator → module name → separator) using box-drawing characters (`───`) in `mcp_server/` and dashes (`---`) in `shared/` and `scripts/`.

Stale references to "Sprint N", "Phase NNN", or "spec NNN" in non-test comments have been removed and replaced with name-only catalog references. The `verify_alignment_drift.py` script enforces `MODULE:` header presence across all non-test `.ts` files.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/**/*.ts` (228 files) | All layers | `// MODULE: Name` headers and `// Feature catalog:` annotations |
| `shared/**/*.ts` (25 files) | Shared | `// MODULE: Name` headers and `// Feature catalog:` annotations |
| `scripts/**/*.ts` (82 files) | Scripts | `// MODULE: Name` headers |

### Verification

| File | Focus |
|------|-------|
| `sk-code--opencode/scripts/verify_alignment_drift.py` | Enforces `MODULE:` header in first 40 lines of all non-test `.ts` files |

---

## 4. SOURCE METADATA

- Group: Tooling and scripts
- Source feature title: Feature catalog code references
- Current reality source: feature_catalog.md

---

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenarios NEW-135, NEW-136, NEW-137, NEW-138
