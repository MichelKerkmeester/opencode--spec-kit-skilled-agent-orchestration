# T069 Audit Agent 2 (Ampere)

Date: 2026-03-04
Scope: groups 05-08

## Reported Findings
- CRITICAL: ablation flag-off documented as no-op, handler actually rejects call.
- HIGH: co-activation fan-divisor described as active hot-path behavior.
- MEDIUM: `memory_drift_why` response field documented as `max_depth_reached`.
- LOW: graph channel fix described as "4-channel" engine.
- LOW: learning-history classification group mismatch.

## Resolution Status
- Fixed in current pass: CRITICAL/HIGH/MEDIUM/LOW (graph-channel wording).
- Remaining accepted LOW: learning-history grouped under Analysis in catalog hierarchy while tool layer tag is Maintenance.
