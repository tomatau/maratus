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
	cobra.AddTemplateFunc("blue", styleBlue)
	cobra.AddTemplateFunc("violet", styleViolet)
	cobra.AddTemplateFunc("aqua", styleAqua)
	cobra.AddTemplateFunc("gray", styleMuted)
	cobra.AddTemplateFunc("aquaBold", styleAquaBold)
	cobra.AddTemplateFunc("section", styleBold)
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

func localFlagsFor(cmd *cobra.Command) string {
	var b strings.Builder
	cmd.LocalFlags().VisitAll(func(flag *pflag.Flag) {
		fmt.Fprintf(&b, "  --%-10s %-8s %s\n", flag.Name, flag.Value.Type(), formatUsage(flag))
	})
	return strings.TrimRight(b.String(), "\n")
}

func persistentFlagsFor(cmd *cobra.Command) string {
	var b strings.Builder

	cmd.PersistentFlags().VisitAll(func(flag *pflag.Flag) {
		fmt.Fprintf(
			&b,
			"  %s %s %s\n",
			styleSoftFlag(fmt.Sprintf("--%-14s", flag.Name)),
			styleMuted(fmt.Sprintf("%-8s", flag.Value.Type())),
			styleMuted(formatUsage(flag)),
		)
	})

	return strings.TrimRight(b.String(), "\n")
}
