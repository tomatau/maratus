package helpcmd

import (
	"arachne/cli/internal/style"
	"fmt"
	"strings"

	"github.com/spf13/cobra"
	"github.com/spf13/pflag"
)

const RootShort = "Arachne CLI tool for installing accessible React components"

const rootHelpTemplate = `{{violet "Arachne"}} CLI tool for installing accessible React components

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

func ConfigureRoot(root *cobra.Command) {
	registerTemplateFuncs()
	root.CompletionOptions.DisableDefaultCmd = true
	root.SetHelpCommand(&cobra.Command{Hidden: true})
	root.SilenceUsage = true
	root.SilenceErrors = true
	root.SetHelpTemplate(rootHelpTemplate)
}

func registerTemplateFuncs() {
	cobra.AddTemplateFunc("blue", style.Blue)
	cobra.AddTemplateFunc("violet", style.Violet)
	cobra.AddTemplateFunc("aqua", style.Aqua)
	cobra.AddTemplateFunc("gray", style.Muted)
	cobra.AddTemplateFunc("aquaBold", style.AquaBold)
	cobra.AddTemplateFunc("section", style.Bold)
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
			style.SoftFlag(fmt.Sprintf("--%-14s", flag.Name)),
			style.Muted(fmt.Sprintf("%-8s", flag.Value.Type())),
			style.Muted(formatUsage(flag)),
		)
	})

	return strings.TrimRight(b.String(), "\n")
}
