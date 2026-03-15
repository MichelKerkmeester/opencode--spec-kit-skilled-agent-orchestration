#!/usr/bin/env bash
set -euo pipefail

/bin/turso_stress --nr-threads 2 --nr-iterations 10000 --vfs io_uring
