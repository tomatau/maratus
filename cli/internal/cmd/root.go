package cmd

import (
	"github.com/spf13/cobra"
)

const (
	rootShort        = "Arachne CLI tool for installing accessible React components"
	rootHelpTemplate = `{{violet "Arachne"}} CLI tool for installing accessible React components

Usage: {{violet "arachne"}} {{aqua "[command]"}} {{gray "[...flags]"}} {{gray "[...args]"}}

{{section "Commands:"}}
{{- range .Commands }}
{{- if .IsAvailableCommand }}
  {{aquaBold (rpad .Name 12)}} {{.Short}}
{{- end }}
{{- end }}
`
)

func NewRootCmd() *cobra.Command {
	registerTemplateFuncs()
	root := newRootCommand()
	configureRootHelp(root)
	root.AddCommand(newHelloCmd())
	return root
}

func newRootCommand() *cobra.Command {
	return &cobra.Command{
		Use:   "arachne",
		Short: rootShort,
		RunE: func(cmd *cobra.Command, args []string) error {
			return cmd.Help()
		},
	}
}

func configureRootHelp(root *cobra.Command) {
	root.CompletionOptions.DisableDefaultCmd = true
	root.SetHelpCommand(&cobra.Command{Hidden: true})
	root.SilenceUsage = true
	root.SilenceErrors = true
	root.SetHelpTemplate(rootHelpTemplate)
}

func registerTemplateFuncs() {
	blue := func(s string) string { return "\x1b[34m" + s + "\x1b[0m" }
	violet := func(s string) string { return "\x1b[38;5;183m" + s + "\x1b[0m" }
	aqua := func(s string) string { return "\x1b[36m" + s + "\x1b[0m" }
	gray := func(s string) string { return "\x1b[90m" + s + "\x1b[0m" }
	aquaBold := func(s string) string { return "\x1b[1;36m" + s + "\x1b[0m" }
	section := func(s string) string { return "\x1b[1m" + s + "\x1b[0m" }

	cobra.AddTemplateFunc("blue", blue)
	cobra.AddTemplateFunc("violet", violet)
	cobra.AddTemplateFunc("aqua", aqua)
	cobra.AddTemplateFunc("gray", gray)
	cobra.AddTemplateFunc("aquaBold", aquaBold)
	cobra.AddTemplateFunc("section", section)
}
