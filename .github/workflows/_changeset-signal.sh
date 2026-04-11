#!/usr/bin/env bash

set -euo pipefail

: "${MOON_BASE:?MOON_BASE is required}"
: "${MOON_HEAD:?MOON_HEAD is required}"

affected=$(moon query affected --downstream deep)

mapfile -t release_paths < <(
  yq -r '
    .workspaces
    | to_entries[]
    | select(.value.consumption != "none")
    | .value.path
  ' repo.yml
)

found=false

for path in "${release_paths[@]}"; do
  while IFS= read -r project; do
    [ -n "$project" ] || continue

    if [[ "$project" != "$path/"* ]]; then
      continue
    fi

    package_json="$project/package.json"
    if [ ! -f "$package_json" ]; then
      continue
    fi

    name=$(sed -n 's/^  "name": "\(.*\)",$/\1/p' "$package_json" | head -n1)
    [ -n "$name" ] || continue

    echo "- $name ($project)"
    found=true
  done < <(jq -r '.projects | keys[]' <<<"$affected")
done

if [ "$found" = false ]; then
  exit 0
fi
