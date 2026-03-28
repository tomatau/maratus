set export := true

TMP_DIR := "./tmp"
TMP_SRC_DIR := TMP_DIR + "/src"
TMP_BIN_DIR := TMP_DIR + "/bin"
CLI_BIN := TMP_BIN_DIR + "/arachne"
TMP_CONFIG_FILE := env("ARACHNE_CONFIG_FILE", TMP_DIR + "/arachne.json")

default:
  @just --list

cli-test:
  go -C cli test ./...

cli-build:
  go -C cli build -o ../{{CLI_BIN}} .

test workspace='' package='':
  @if [ -n "{{workspace}}" ] && [ -n "{{package}}" ]; then \
    bun run --filter "$(just _package-name {{workspace}} {{package}})" test; \
  elif [ -z "{{workspace}}" ] && [ -z "{{package}}" ]; then \
    bun run --filter '*' test; \
  else \
    echo "expected both workspace and package" >&2; \
    exit 1; \
  fi

test-unit workspace='' package='':
  @if [ -n "{{workspace}}" ] && [ -n "{{package}}" ]; then \
    bun run --filter "$(just _package-name {{workspace}} {{package}})" test:unit; \
  elif [ -z "{{workspace}}" ] && [ -z "{{package}}" ]; then \
    bun run --filter '*' test:unit; \
  else \
    echo "expected both workspace and package" >&2; \
    exit 1; \
  fi

# workspace=artifacts|codemod
build workspace='' package='':
  @if [ -z "{{workspace}}" ]; then \
    just _build-package tools build build:artifacts && \
    just _build-filter '@arachne-codemod/*'; \
  elif [ "{{workspace}}" = "artifacts" ]; then \
    just _build-package tools build build:artifacts; \
  elif [ "{{workspace}}" != "codemod" ]; then \
    echo "unsupported build workspace: {{workspace}}" >&2; \
    exit 1; \
  elif [ -n "{{package}}" ]; then \
    just _build-package codemods {{package}}; \
  else \
    just _build-filter '@arachne-codemod/*'; \
  fi

clear-tmp-src:
  rm -rf {{TMP_SRC_DIR}}/

cli consumer command='' *args:
  {{CLI_BIN}} -cf="$(just _consumer-config-file {{consumer}})" {{command}} {{args}}

cli-tmp command='' *args:
  {{CLI_BIN}} -cf={{TMP_CONFIG_FILE}} {{command}} {{args}}

_package-name workspace package:
  @bun --print "require('./{{workspace}}/{{package}}/package.json').name"

_consumer-config-file name:
  @echo "consumers/{{name}}/arachne.json"

_build-filter filter command='build':
  bun run --filter "{{filter}}" {{command}}

_build-package workspace package command='build':
  just _build-filter "$(just _package-name {{workspace}} {{package}})" {{command}}
