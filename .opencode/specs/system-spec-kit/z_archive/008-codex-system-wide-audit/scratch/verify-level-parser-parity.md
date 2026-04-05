# Verification: Level Parser Parity

**Date:** 2026-02-16
**Scope:** `upgrade-level.sh`, `validate.sh`, `check-level-match.sh`

## Evidence

1. Parser contract alignment implemented for canonical declaration forms:
   - `<!-- SPECKIT_LEVEL: X -->`
   - `| **Level** | X |`
   - anchored inline fallback (`## Level`)
2. `bash tests/test-validation.sh`
   - Result: PASS (55 passed, 0 failed)
   - Level declaration tests cover explicit/inferred/invalid declarations and rule behavior.

## Checklist Mapping

- CHK-104: `check-level-match.sh` parses marker and table declarations correctly.
- CHK-105: upgrade and validation level detection remain consistent on shared fixtures.
