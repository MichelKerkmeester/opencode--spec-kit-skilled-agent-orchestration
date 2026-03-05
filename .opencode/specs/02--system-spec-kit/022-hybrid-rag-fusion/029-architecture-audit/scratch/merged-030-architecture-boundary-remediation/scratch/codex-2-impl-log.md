# Codex-2 Implementation Log (T020 + T021)

Date: 2026-03-05
Agent: Codex-2 (Phase 0 Evasion + Expiry)
Spec: `030-architecture-boundary-remediation` (archived under `029-architecture-audit/scratch/merged-030-architecture-boundary-remediation`)

## Scope

- T020: Create `decision-record.md` for spec 030 with ADR-001 on regex evasion vector acceptance.
- T021: Create allowlist expiry checker in `scripts/evals/` (30-day warning, exit 1 on expired).

## Changes Made

1. Created `decision-record.md` at:
   `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/029-architecture-audit/scratch/merged-030-architecture-boundary-remediation/decision-record.md`
   - Followed 029 decision-record structure and metadata style.
   - Added `ADR-001: Regex Evasion Vector Acceptance`.
   - Status set to **Proposed**.
   - Documented 5 bypass vectors from cross-AI review:
     - template literal imports
     - block-comment same-line bypass
     - 1-hop transitive limit
     - `core/*` unblocked scenario
     - dynamic imports undetected scenario
   - Decision captured: accept short-term risk with explicit P2 AST upgrade timeline.

2. Created `check-allowlist-expiry.ts` at:
   `.opencode/skill/system-spec-kit/scripts/evals/check-allowlist-expiry.ts`
   - Loads `import-policy-allowlist.json`.
   - Parses `expiresAt` values in `YYYY-MM-DD` format.
   - Warns when expiry is within 30 days.
   - Exits with code `1` when any entry is expired.
   - Exits with code `2` on invalid/malformed `expiresAt` values or parse/file errors.
   - Exits `0` when no expired entries are found.

## Verification

1. Type check:
   - Command: `npx tsc --noEmit --project scripts/tsconfig.json --pretty false`
   - Result: PASS (exit code `0`)

2. Runtime execution:
   - `npx tsx scripts/evals/check-allowlist-expiry.ts` was unavailable (`tsx: command not found` in this environment).
   - Fallback validation:
     - Compiled script with `tsc` to temp output.
     - Copied `import-policy-allowlist.json` beside compiled file.
     - Executed with `node`.
   - Result: PASS, output:
     - `Allowlist expiry check passed: no entries expiring within 30 days and no expired entries found.`

3. Expired-entry enforcement check:
   - Built synthetic allowlist fixture with `expiresAt: 2026-01-01` (expired as of 2026-03-05).
   - Executed compiled checker with fixture.
   - Result: script emitted failure details and returned `EXIT:1`.
