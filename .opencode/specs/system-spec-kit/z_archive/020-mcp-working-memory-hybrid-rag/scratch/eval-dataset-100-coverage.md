# Phase 0 Dataset Coverage

- Total queries: 100
- Intent buckets: 5
- Queries per intent: 20 each (`add_feature`, `fix_bug`, `refactor`, `understand`, `find_spec`)
- Baseline ranks: top-10 proxy ranking stored per query in `eval-dataset-100.json`
- Human-reviewed sample: 10 queries (10%) marked `humanReviewed: true`

Result: coverage gate satisfied (>=5 queries per required intent).
