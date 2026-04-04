# Maratus CLI

Minimal Go CLI for Maratus.

## Commands

- `hello` - print hello output
- `init` - create `maratus.json`

## Flags

- `--config-file <path>` - config file path used by commands
- `-cf <path>` - alias for `--config-file`

## Env Vars

- `MARATUS_CONFIG_FILE` - default value for `--config-file` when the flag is not provided

## Dev

- Test: `go test ./...`
- Build: `go build -o ../bin/maratus .`
- Run: `../bin/maratus`
