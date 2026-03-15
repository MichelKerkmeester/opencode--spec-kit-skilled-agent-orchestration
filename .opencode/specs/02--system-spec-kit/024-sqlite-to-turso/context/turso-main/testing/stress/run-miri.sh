#!/usr/bin/env bash
set -euo pipefail


MIRIFLAGS="-Zmiri-disable-isolation -Zmiri-disable-stacked-borrows" cargo +nightly miri run -p turso_stress -- "$@"
