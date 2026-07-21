#!/usr/bin/env bash
# Fail if legacy/non-semantic design patterns appear in src/components (excluding StyleLab).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET="${ROOT}/src/components"
EXCLUDE='!**/StyleLab/**'

failures=0

report() {
  echo "FAIL: $1"
  echo "$2"
  echo
  failures=$((failures + 1))
}

if [[ ! -d "$TARGET" ]]; then
  echo "Directory not found: $TARGET"
  exit 1
fi

# Forbidden: raw gray Tailwind scales
matches=$(rg -n 'bg-gray-' "$TARGET" --glob "$EXCLUDE" 2>/dev/null || true)
if [[ -n "$matches" ]]; then
  report "Found bg-gray-* classes" "$matches"
fi

# Forbidden: hardcoded brand green text
matches=$(rg -n 'text-\[#149353\]' "$TARGET" --glob "$EXCLUDE" 2>/dev/null || true)
if [[ -n "$matches" ]]; then
  report "Found text-[#149353]" "$matches"
fi

# Forbidden: shadow-sm on card surfaces (bg-card / rounded card containers)
matches=$(rg -n 'shadow-sm' "$TARGET" --glob "$EXCLUDE" 2>/dev/null | rg 'bg-card|rounded-xl|rounded-2xl' || true)
if [[ -n "$matches" ]]; then
  report "Found shadow-sm on card-like elements" "$matches"
fi

if [[ "$failures" -gt 0 ]]; then
  echo "${failures} design-token check(s) failed."
  exit 1
fi

echo "Design token checks passed."
