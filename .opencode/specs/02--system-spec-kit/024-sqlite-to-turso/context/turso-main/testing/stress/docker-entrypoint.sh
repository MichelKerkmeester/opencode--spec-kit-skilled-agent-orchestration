#!/usr/bin/env bash
set -euo pipefail

echo '{"antithesis_setup": { "status": "complete", "details": null }}' > $ANTITHESIS_OUTPUT_DIR/sdk.jsonl

set -Eeuo pipefail

exec "$@"
