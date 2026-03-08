# Arachne CLI

Minimal Go CLI for Arachne.

## Commands

- `hello` - print hello output
- `init` - create `arachne.json`

## Flags

- `--config-file <path>` - config file path used by commands
- `-cf <path>` - alias for `--config-file`

## Env Vars

- `ARACHNE_CONFIG_FILE` - default value for `--config-file` when the flag is not provided

## Dev

- Test: `go test ./...`
- Build: `go build -o ../bin/arachne .`
- Run: `../bin/arachne`
