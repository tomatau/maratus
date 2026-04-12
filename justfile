set export := true

TMP_DIR := "./tmp"
TMP_SRC_DIR := TMP_DIR + "/src"
TMP_BIN_DIR := TMP_DIR + "/bin"
CLI_BIN := TMP_BIN_DIR + "/maratus"
TMP_CONFIG_FILE := env("MARATUS_CONFIG_FILE", TMP_DIR + "/maratus.json")

default:
  @just --list

[group('release')]
changeset command *args:
  bun run changeset {{command}} {{args}}

[group('cli')]
[group('build')]
cli-build output=CLI_BIN:
  go -C cli build -o ../{{output}} .

[group('cli')]
[group('build')]
cli-build-prod output=CLI_BIN:
  go -C cli build -o ../{{output}} -ldflags="-s -w" .

[group('cli')]
[group('build')]
cli-stage-platform package goos goarch binary='maratus':
  GOOS={{goos}} \
  GOARCH={{goarch}} \
  just cli-build-prod "$(just _platform-cli-bin-path {{package}} {{binary}})"

[group('test')]
test workspace='' package='':
  @if [ -n "{{workspace}}" ] && [ -n "{{package}}" ]; then \
    just _test-package {{workspace}} {{package}}; \
  elif [ -n "{{workspace}}" ] && [ -z "{{package}}" ]; then \
    just _run-workspace test "$(just _workspace-filter {{workspace}})"; \
  elif [ -z "{{workspace}}" ] && [ -z "{{package}}" ]; then \
    just _run-workspace test; \
  else \
    echo "expected workspace" >&2; \
    exit 1; \
  fi

[group('test')]
test-unit workspace='' package='':
  @if [ -n "{{workspace}}" ] && [ -n "{{package}}" ]; then \
    just _test-package {{workspace}} {{package}} test:unit; \
  elif [ -n "{{workspace}}" ] && [ -z "{{package}}" ]; then \
    just _run-workspace test:unit "$(just _workspace-filter {{workspace}})"; \
  elif [ -z "{{workspace}}" ] && [ -z "{{package}}" ]; then \
    just _run-workspace test:unit; \
  else \
    echo "expected workspace" >&2; \
    exit 1; \
  fi

[group('test')]
test-integration workspace='' package='':
  @if [ "{{workspace}}" = "cli" ] && [ -z "{{package}}" ]; then \
    go -C cli test ./...; \
  elif [ -n "{{workspace}}" ] && [ -n "{{package}}" ]; then \
    just _test-package {{workspace}} {{package}} test:integration; \
  elif [ -z "{{workspace}}" ] && [ -z "{{package}}" ]; then \
    go -C cli test ./...; \
    just _run-workspace test:integration; \
  else \
    echo "expected workspace" >&2; \
    exit 1; \
  fi

# workspace=registry|codemods|packages
[group('build')]
build workspace='' package='':
  @if [ -z "{{workspace}}" ]; then \
    just _build-package tools build-registry build && \
    just _run-workspace build "$(just _workspace-filter packages)" && \
    just _run-workspace build "$(just _workspace-filter codemods)"; \
  elif [ "{{workspace}}" = "registry" ]; then \
    just _build-package tools build-registry build; \
  elif [ -n "{{package}}" ]; then \
    just _build-package {{workspace}} {{package}}; \
  else \
    just _run-workspace build "$(just _workspace-filter {{workspace}})"; \
  fi

[group('tmp')]
clear-tmp-src:
  rm -rf {{TMP_SRC_DIR}}/

[group('cli')]
cli consumer command='' *args:
  {{CLI_BIN}} -cf="$(just _consumer-config-file {{consumer}})" {{command}} {{args}}

[group('cli')]
[group('tmp')]
cli-tmp command='' *args:
  {{CLI_BIN}} -cf={{TMP_CONFIG_FILE}} {{command}} {{args}}

@_package-name workspace package:
  bun --print "require('./{{workspace}}/{{package}}/package.json').name"

_consumer-config-file name:
  echo "consumers/{{name}}/maratus.json"

@_platform-cli-bin-path package binary='maratus':
  echo "packages/{{package}}/bin/{{binary}}"

_run-workspace command workspace='"*"':
  bunx bun-workspaces run {{command}} {{workspace}}

_workspace-scope workspace:
  @if [ "{{workspace}}" = "codemods" ]; then \
    echo "@maratus-codemod/"; \
  elif [ "{{workspace}}" = "registry" ]; then \
    echo "@maratus-registry/"; \
  elif [ "{{workspace}}" = "components" ]; then \
    echo "@maratus-component/"; \
  elif [ "{{workspace}}" = "consumers" ]; then \
    echo "@maratus-consumer/"; \
  elif [ "{{workspace}}" = "lib" ]; then \
    echo "@maratus-lib/"; \
  else \
    echo "@maratus/"; \
  fi

@_workspace-filter workspace:
  echo "$(just _workspace-scope {{workspace}})*"

@_run-package command workspace package:
  just _run-workspace {{command}} "$(just _package-name {{workspace}} {{package}})"

@_build-package workspace package command='build':
  just _run-package {{command}} {{workspace}} {{package}}

@_test-package workspace package command='test':
  just _run-package {{command}} {{workspace}} {{package}}
