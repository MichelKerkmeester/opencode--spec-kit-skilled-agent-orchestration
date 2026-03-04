# Feature flag governance

## Current Reality

The program introduces many new scoring signals and pipeline stages. Without governance, flags accumulate until nobody knows what is enabled.

A governance framework caps active flags at six, enforces a 90-day lifespan per flag and requires a monthly sunset audit. Each sprint exit includes a formal review: flags with positive metrics are permanently enabled, flags with negative metrics are removed and inconclusive flags receive a 14-day extension with a hard deadline.

The B8 signal ceiling limits active scoring signals to 12 until automated evaluation (R13) is mature enough to validate new signals reliably.

## Source Metadata

- Group: Governance
- Source feature title: Feature flag governance
- Summary match found: Yes
- Summary source feature title: Feature flag governance
- Current reality source: feature_catalog.md
