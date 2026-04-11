#!/usr/bin/env bash

set -euo pipefail

: "${MOON_BASE:?MOON_BASE is required}"
: "${MOON_HEAD:?MOON_HEAD is required}"

affected=$(moon query affected --downstream deep)
projects=$(moon query projects)

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
  while IFS=$'\t' read -r project source; do
    [ -n "$project" ] || continue
    [ -n "$source" ] || continue

    if [[ "$source" != "$path/"* ]] && [[ "$source" != "$path" ]]; then
      continue
    fi

    package_json="$source/package.json"
    if [ ! -f "$package_json" ]; then
      continue
    fi

    name=$(sed -n 's/^  "name": "\(.*\)",$/\1/p' "$package_json" | head -n1)
    [ -n "$name" ] || continue

    echo "- $name ($source)"
    found=true
  done < <(
    jq -r '.projects | keys[]' <<<"$affected" \
      | while IFS= read -r project; do
          [ -n "$project" ] || continue

          source=$(jq -r --arg project "$project" '
            .projects[]
            | select(.id == $project)
            | .source
          ' <<<"$projects")

          [ -n "$source" ] || continue
          printf '%s\t%s\n' "$project" "$source"
        done
  )
done

if [ "$found" = false ]; then
  exit 0
fi
