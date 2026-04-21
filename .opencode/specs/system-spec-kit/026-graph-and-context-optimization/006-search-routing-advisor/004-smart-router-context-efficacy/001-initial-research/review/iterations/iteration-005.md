# Iteration 005 - Correctness

## Focus

OpenCode plugin proposal acceptance criteria.

## Files Reviewed

- `../spec.md`
- `research/research.md`
- `research/research-validation.md`
- `research/iterations/iteration-014.md`
- `research/iterations/iteration-019.md`

## Findings

### DR-P1-004 - Plugin proposal omits explicit manifest and concrete hook registration detail required by REQ-010

Severity: P1

REQ-010 requires package shape, manifest, hook registration, and install flow (`../spec.md:103`). The validation proposal lists plugin files (`research/research-validation.md:22` to `research/research-validation.md:26`), settings, and fail-open behavior (`research/research-validation.md:28` to `research/research-validation.md:33`), then says to enable the plugin through OpenCode configuration (`research/research-validation.md:51` to `research/research-validation.md:56`). It does not specify a manifest artifact or exact hook registration contract.

Impact: A follow-up implementer gets a useful concept, but not the full acceptance artifact promised by the parent spec.

## Delta

New findings: P1=1. New findings ratio: 0.25.

