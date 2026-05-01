---
title: "Chec [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/004-compaction-checkpointing/checklist]"
description: "checklist document for 004-compaction-checkpointing."
trigger_phrases:
  - "chec"
  - "checklist"
  - "004"
  - "compaction"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: 004-compaction-checkpointing

## P0
- [ ] Compaction preservation is fail-open.
- [ ] `experimental.session.compacting` is the only hook surface named.
- [ ] `generate-context.js` remains the capture authority.

## P1
- [ ] Dedupe rules are documented.
- [ ] Blocking or periodic hook behavior is rejected.

