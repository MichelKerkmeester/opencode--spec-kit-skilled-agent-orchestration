# Evaluation database and schema

## Current Reality

A separate SQLite database (`speckit-eval.db`) stores retrieval quality data in five tables: `eval_queries`, `eval_channel_results`, `eval_final_results`, `eval_ground_truth` and `eval_metric_snapshots`. Keeping evaluation data in its own database is a deliberate security decision. The main search database should never carry evaluation artifacts that could leak into production results.

Logging hooks in the search, context and trigger handlers record every retrieval event asynchronously without blocking the response path. Every tuning decision from Sprint 1 onward is backed by data from this schema, which makes it the single most consequential piece of infrastructure in the program.

## Source Metadata

- Group: Evaluation and measurement
- Source feature title: Evaluation database and schema
- Summary match found: Yes
- Summary source feature title: Evaluation database and schema
- Current reality source: feature_catalog.md
