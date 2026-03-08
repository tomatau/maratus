package cmd

import (
	"fmt"
	"strings"

	"github.com/spf13/cobra"
	"github.com/spf13/pflag"
)

const (
	rootShort        = "Arachne CLI tool for installing accessible React components"
	rootHelpTemplate = `{{violet "Arachne"}} CLI tool for installing accessible React components

Usage: {{violet "arachne"}} {{aqua "[command]"}} {{gray "[...flags]"}} {{gray "[...args]"}}

{{section "Commands:"}}
{{- range .Commands }}
{{- if .IsAvailableCommand }}
  {{aquaBold (rpad .Name 21)}} {{.Short}}
{{- $flags := flagsFor . }}
{{- if $flags }}
{{ gray $flags }}
{{- end }}
{{- end }}
{{- end }}

{{section "Global Flags:"}}
{{ persistentFlagsFor . }}
`
)

func registerTemplateFuncs() {
	cobra.AddTemplateFunc("blue", ansi("\x1b[34m"))
	cobra.AddTemplateFunc("violet", ansi("\x1b[38;5;183m"))
	cobra.AddTemplateFunc("aqua", ansi("\x1b[36m"))
	cobra.AddTemplateFunc("gray", ansi("\x1b[90m"))
	cobra.AddTemplateFunc("aquaBold", ansi("\x1b[1;36m"))
	cobra.AddTemplateFunc("section", ansi("\x1b[1m"))
	cobra.AddTemplateFunc("flagsFor", localFlagsFor)
	cobra.AddTemplateFunc("persistentFlagsFor", persistentFlagsFor)
}

func formatUsage(flag *pflag.Flag) string {
	usage := flag.Usage
	if flag.DefValue != "" {
		usage = fmt.Sprintf("%s (default %q)", usage, flag.DefValue)
	}
	return usage
}

func ansi(open string) func(string) string {
	return func(s string) string {
		return open + s + "\x1b[0m"
	}
}

func localFlagsFor(cmd *cobra.Command) string {
	var b strings.Builder
	cmd.LocalFlags().VisitAll(func(flag *pflag.Flag) {
		fmt.Fprintf(&b, "  --%-10s %-8s %s\n", flag.Name, flag.Value.Type(), formatUsage(flag))
	})
	return strings.TrimRight(b.String(), "\n")
}

func persistentFlagsFor(cmd *cobra.Command) string {
	var b strings.Builder
	softFlag := ansi("\x1b[38;5;110m")
	muted := ansi("\x1b[90m")

	cmd.PersistentFlags().VisitAll(func(flag *pflag.Flag) {
		fmt.Fprintf(
			&b,
			"  %s %s %s\n",
			softFlag(fmt.Sprintf("--%-14s", flag.Name)),
			muted(fmt.Sprintf("%-8s", flag.Value.Type())),
			muted(formatUsage(flag)),
		)
	})

	return strings.TrimRight(b.String(), "\n")
}
