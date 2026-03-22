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

build-artifacts:
  bun run --cwd tools/build build:artifacts

package-name workspace package:
  @bun --print "require('./{{workspace}}/{{package}}/package.json').name"

consumer-config-file name:
  @echo "consumers/{{name}}/arachne.json"

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
  rm -rf {{TMP_SRC_DIR}}/

cli name command='' *args:
  {{CLI_BIN}} -cf="$(just consumer-config-file {{name}})" {{command}} {{args}}

cli-tmp command='' *args:
  {{CLI_BIN}} -cf={{TMP_CONFIG_FILE}} {{command}} {{args}}
