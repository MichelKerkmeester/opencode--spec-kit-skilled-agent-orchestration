# Learning history (memory_get_learning_history)

## Current Reality

Retrieves learning records for a spec folder with optional filtering by session ID and completion status. Each record shows the preflight scores, postflight scores, computed deltas and Learning Index.

The summary statistics are where this tool earns its keep. Across all completed tasks in a spec folder, you see the average Learning Index, maximum and minimum LI, average knowledge gain, average uncertainty reduction and average context improvement. Trend interpretation maps the average LI to a human-readable assessment: above 15 is a strong learning trend, 7-15 is positive, 0-7 is slight, zero is neutral and below zero is regression.

Pass `onlyComplete: true` to restrict results to tasks where both preflight and postflight were recorded. This gives you clean data for trend analysis without incomplete records skewing the averages. Records are ordered by `updated_at` descending so the most recent learning cycles appear first.

---

## Source Metadata

- Group: Analysis
- Source feature title: Learning history (memory_get_learning_history)
- Summary match found: No
- Current reality source: feature_catalog.md
