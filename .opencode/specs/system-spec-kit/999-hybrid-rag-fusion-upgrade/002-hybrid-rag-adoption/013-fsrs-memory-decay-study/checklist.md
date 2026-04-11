# Checklist: 013-fsrs-memory-decay-study

## P0
- [ ] The packet treats current FSRS defaults as authoritative until measurement says otherwise.
- [ ] The packet defines baseline and candidate variants for decay evaluation.
- [ ] The packet explicitly keeps `memory_due` out of scope.

## P1
- [ ] The packet names the real scheduler, search, and test files for future work.
- [ ] The packet ends with a clear keep/prototype/reject gate.
