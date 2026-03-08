default:
  @just --list

cli-test:
  go -C cli test ./...

cli-build:
  go -C cli build -o ../bin/arachne .

cli-run command='' *args:
  @case "{{command}}" in \
    ''|hello|init) ;; \
    *) echo "Unknown command: {{command}}"; \
       echo "Available commands: hello, init"; \
       exit 1 ;; \
  esac
  ARACHNE_CONFIG_FILE="${ARACHNE_CONFIG_FILE:-./tmp/arachne.json}" ./bin/arachne {{command}} {{args}}
