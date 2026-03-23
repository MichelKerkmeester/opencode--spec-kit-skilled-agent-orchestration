# Checklist

## P0 (Hard Blockers)
- [x] All CRITICAL findings addressed
- [x] Score clamping: session + causal boost can no longer exceed [0,1]
- [x] NaN propagation guarded in MMR, fusion-lab normalizers
- [x] MMR no longer drops non-embedded rows
- [x] Documentation counts match live filesystem (233 playbook, 222 catalog)
- [x] Full test suite passes (0 failures)

## P1 (Required)
- [x] All HIGH findings addressed (25 findings)
- [x] Eval infrastructure bugs fixed (ablation adapter, ground-truth parser, DB indexes)
- [x] Stage 2 deep-clone prevents timeout-fallback race condition
- [x] Score alias syncing happens immediately after mutations
- [x] Promise.allSettled for fail-open fan-out in Stage 1
- [x] Per-branch scope filtering restored in reform/HyDE paths
- [x] VectorIndexError class with typed error codes
- [x] Import ordering fixed across all reviewed files
- [x] TSDoc added to public functions in 16+ files
- [x] Pre-existing test failures resolved (135 → 0)

## P2 (Optional)
- [x] Modularization test limit updated for context-server.js
- [x] Retrieval telemetry scope dimension count updated
- [ ] Module splitting for SRP violations (deferred)
- [ ] Feature catalog ↔ playbook backlink repair (deferred)
