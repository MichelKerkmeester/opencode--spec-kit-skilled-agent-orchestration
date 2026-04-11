# Checklist: 004-compaction-checkpointing

## P0
- [ ] Compaction preservation is fail-open.
- [ ] `experimental.session.compacting` is the only hook surface named.
- [ ] `generate-context.js` remains the capture authority.

## P1
- [ ] Dedupe rules are documented.
- [ ] Blocking or periodic hook behavior is rejected.

