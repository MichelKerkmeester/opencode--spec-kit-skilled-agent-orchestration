# Smart Router Test Suite

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. WHAT IT TESTS](#what-it-tests)
- [3. FILES](#files)
- [4. RUN](#run)
- [5. BENCHMARK](#benchmark)

## 1. OVERVIEW

This scratch suite validates Smart Router marker compliance and recursive discovery behavior, including unlisted nested folders.

## What it tests

- Scans immediate `*/SKILL.md` files under both configured skill roots.
- Verifies required markers in every `SKILL.md`:
  - scoped guard
  - recursive discovery
  - weighted scoring
  - ambiguity handling
- Verifies banned phrases are absent.
- Enforces `activation-detection-absent`: fails if `### Activation Detection` appears.
- Enforces `smart-routing-required-h3`: SMART ROUTING must include `### Smart Router Pseudocode`.
- Enforces `smart-router-pseudocode-single`: exactly one authoritative `### Smart Router Pseudocode` H3 per SMART ROUTING section.
- Validates recursive crawler behavior using fixture directories with nested/unlisted folders.
- Checks real `references/` and `assets/` subdirectories for unlisted folders and enforces recursive discovery marker when needed.
- Validates ambiguity scenario fixtures (`ambiguity-close-score.json`, `ambiguity-multi-symptom.json`) and checks required routing pattern coverage for mapped skills.

## Files

- `router-rules.json` - marker phrases, banned phrases, roots, fixture expectations, and report path.
- `run-smart-router-tests.mjs` - executable test runner.
- `benchmark-smart-router.mjs` - ambiguity fixture coverage benchmark.
- `fixtures/` - nested/unlisted discovery and ambiguity scenario fixture data.
- `reports/latest-report.json` - machine-readable latest run report.

## Run

```bash
node .opencode/specs/03--commands-and-skills/001-smart-router-v2/scratch/smart-router-tests/run-smart-router-tests.mjs
```

Exit code is `0` when all checks pass, non-zero when any check fails.

## Benchmark

```bash
node .opencode/specs/03--commands-and-skills/001-smart-router-v2/scratch/smart-router-tests/benchmark-smart-router.mjs
```

Writes benchmark output to `reports/benchmark-latest.json`.
