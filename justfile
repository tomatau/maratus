set export := true

TMP_CONFIG_FILE := env("ARACHNE_CONFIG_FILE", "./tmp/arachne.json")

default:
  @just --list

cli-test:
  go -C cli test ./...

cli-build:
  go -C cli build -o ../tmp/bin/arachne .

build-artifacts:
  bun run --cwd tools/build build:artifacts

clear-tmp-src:
  rm -rf ./tmp/src/

cli-run command='' *args:
  ./tmp/bin/arachne -cf={{TMP_CONFIG_FILE}} {{command}} {{args}}
