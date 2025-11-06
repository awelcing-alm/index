#!/usr/bin/env bash
set -euo pipefail

# Find large text-like files and optionally delete safe generated ones
# Usage:
#   scripts/cleanup-large-text.sh [--threshold <bytes|100k|1M>] [--delete-known]
# Examples:
#   scripts/cleanup-large-text.sh --threshold 100k        # report files >= 100 KB
#   scripts/cleanup-large-text.sh --delete-known          # delete *.tsbuildinfo and logs/*.log

threshold="50k"
do_delete_known=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --threshold)
      threshold="${2:-100k}"; shift 2;;
    --delete-known)
      do_delete_known=1; shift;;
    *)
      echo "Unknown arg: $1" >&2; exit 1;;
  esac
done

# Convert threshold to -size format for find
# Accepts plain bytes (e.g. 102400) or human K/M suffix
size_arg="+${threshold}"
if [[ "$threshold" =~ ^[0-9]+$ ]]; then
  # bytes -> find uses c for bytes
  size_arg="+${threshold}c"
fi

root_dir="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root_dir"

# Patterns considered text-like
exts=(
  "*.json" "*.md" "*.txt" "*.ts" "*.tsx" "*.js" "*.mjs" "*.cjs" \
  "*.css" "*.scss" "*.yaml" "*.yml" "*.csv" "*.log"
)

# Build -name clause
name_clause=()
for e in "${exts[@]}"; do
  name_clause+=( -name "$e" -o )
done
# Remove trailing -o
unset 'name_clause[${#name_clause[@]}-1]'

# Report
echo "Scanning for large text files (threshold: $threshold)..." >&2
find . \
  -not -path './node_modules/*' \
  -not -path './.next/*' \
  -not -path './.git/*' \
  \( "${name_clause[@]}" \) \
  -type f -size "$size_arg" \
  -printf '%10s\t%p\n' | sort -nr | sed 's#^./##'

if [[ $do_delete_known -eq 1 ]]; then
  echo
  echo "Deleting known generated/ephemeral large files..."
  # Delete TypeScript build info (already ignored by .gitignore)
  find . -type f -name '*.tsbuildinfo' -print -delete || true
  # Delete logs
  find logs -type f -name '*.log' -print -delete 2>/dev/null || true
  echo "Done."
fi
