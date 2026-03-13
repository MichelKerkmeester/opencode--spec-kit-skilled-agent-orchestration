---
title: Config Quality Standards
description: Quality gates for JSON/JSONC configuration files in OpenCode, including comment policy, KISS/DRY, and SOLID-aligned boundary checks.
---

# Config Quality Standards

Quality gates for JSON/JSONC configuration files used by OpenCode system tooling.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Define deterministic configuration quality checks so config updates stay parseable, low-noise, and maintainable across mixed-language workflows.

### Scope

- JSON files (`.json`) with no comments.
- JSONC files (`.jsonc`) with bounded purposeful comments.
- Feature flags, thresholds, ranking constants, and runtime behavior controls.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:p0-hard-blockers -->
## 2. P0 - HARD BLOCKERS

### Syntax and Parse Safety

- JSON/JSONC must parse cleanly.
- No duplicate keys.
- No trailing commas in strict JSON files.

### Header and Section Invariant

- JSONC uses numbered ALL-CAPS section headers for major blocks.
- Do not convert header style to sentence case or unnumbered variants.
- Header style checks are manual/checklist gates (not hard-failed by `verify_alignment_drift.py`).

### Deterministic Defaults

- Feature flags and fallback values must be explicit.
- If default-on behavior is used, opt-out semantics must be documented inline.
<!-- /ANCHOR:p0-hard-blockers -->

---

<!-- ANCHOR:p1-required -->
## 3. P1 - REQUIRED

### KISS for Config

- Keep keys and nesting minimal for current behavior needs.
- Avoid speculative branches for hypothetical future toggles.

### DRY for Config

- Repeated literals and thresholds should be centralized once and referenced consistently.
- Avoid copy-paste constants across sibling sections.

### SOLID-Aligned Boundary Checks

- **SRP**: each config section should control one behavior domain.
- **OCP**: add new behavior through new section entries before editing stable defaults.
- **LSP/ISP/DIP**: section consumers should not require special-case type branching due to inconsistent shape.

### Comment Policy (JSONC Only)

- Maximum 3 comments per 10 lines.
- Comments should explain WHY, not WHAT. No narrative comments.
- This policy is a P1 manual/checklist gate (not hard-failed by `verify_alignment_drift.py`).
<!-- /ANCHOR:p1-required -->

---

<!-- ANCHOR:p2-recommended -->
## 4. P2 - RECOMMENDED

- Add `REQ-###` markers for high-impact rules.
- Keep key ordering stable (`$schema`, core flags, behavior config, advanced settings).
- Include value constraints in comments for opaque numbers.
<!-- /ANCHOR:p2-recommended -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

```bash
# JSON and JSONC parse checks
python -m json.tool config.json
grep -v '^\s*//' config.jsonc | python -m json.tool

# Header and comment policy spot-checks (JSONC, manual review support)
rg -n "^// [0-9]+\\. [A-Z0-9 ()/:-]+$" .opencode/skill/sk-code--opencode/references/config
```
<!-- /ANCHOR:verification -->
