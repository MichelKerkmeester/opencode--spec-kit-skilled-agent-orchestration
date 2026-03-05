# Redaction Calibration Report (Phase 1.5)

## Inputs

- Source: `scratch/redaction-calibration-inputs/`
- Files processed: 50
- Total tokens (non-secret denominator): 2210

## Pattern Calibration

- Added exclusion heuristic for git SHA-1 hashes (`/^[0-9a-f]{40}$/`).
- Added exclusion heuristic for UUIDs (`/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i`).
- Tuned generic high-entropy pattern threshold from 32 to 40 characters.

## Results

- Total redactions: 40
- False positives: 0
- FP rate: 0.00%
- Hard gate (<= 15%): **PASS**

## Sample Breakdown (first 10 files)

| File | Tokens | Redactions | False Positives |
|------|--------|------------|-----------------|
| 01-git-status.txt | 103 | 4 | 0 |
| 02-git-branch.txt | 10 | 0 | 0 |
| 03-git-log.txt | 36 | 0 | 0 |
| 04-node---version.txt | 9 | 0 | 0 |
| 05-npm---version.txt | 9 | 0 | 0 |
| 06-python3---version.txt | 10 | 0 | 0 |
| 07-ls--la.txt | 217 | 0 | 0 |
| 08-ls--la.txt | 16 | 0 | 0 |
| 09-ls--la.txt | 16 | 2 | 0 |
| 10-ls--la.txt | 16 | 2 | 0 |

## Over-redaction Cases

- None detected after SHA/UUID exclusions and entropy threshold tuning.

