default:
  @just --list

cli-test:
  go -C cli test ./...

cli-build:
  go -C cli build -o ../bin/arachne .
