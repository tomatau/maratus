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

package-name workspace package:
  @bun --print "require('./{{workspace}}/{{package}}/package.json').name"

test workspace='' package='':
  @if [ -n "{{workspace}}" ] && [ -n "{{package}}" ]; then \
    bun run --filter "$(just package-name {{workspace}} {{package}})" test; \
  elif [ -z "{{workspace}}" ] && [ -z "{{package}}" ]; then \
    bun run --filter '*' test; \
  else \
    echo "expected both workspace and package" >&2; \
    exit 1; \
  fi

test-unit workspace='' package='':
  @if [ -n "{{workspace}}" ] && [ -n "{{package}}" ]; then \
    bun run --filter "$(just package-name {{workspace}} {{package}})" test:unit; \
  elif [ -z "{{workspace}}" ] && [ -z "{{package}}" ]; then \
    bun run --filter '*' test:unit; \
  else \
    echo "expected both workspace and package" >&2; \
    exit 1; \
  fi

clear-tmp-src:
  rm -rf ./tmp/src/

cli-run command='' *args:
  ./tmp/bin/arachne -cf={{TMP_CONFIG_FILE}} {{command}} {{args}}
