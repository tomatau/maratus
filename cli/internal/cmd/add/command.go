package addcmd

import (
	"arachne/cli/internal/config"
	"arachne/cli/internal/project"
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

func New(configFilePath func() string) *cobra.Command {
	style := ""

	cmd := &cobra.Command{
		Use:   "add [components...]",
		Short: "Add a component",
		Args:  cobra.ArbitraryArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			cwd, err := os.Getwd()
			if err != nil {
				return err
			}
			proj, err := project.Open(cwd, configFilePath())
			if err != nil {
				return err
			}

			selectedStyle := style
			if selectedStyle == "" {
				selectedStyle = proj.Config.Style
			}

			if !config.IsValidStyle(selectedStyle) {
				return fmt.Errorf("unsupported style: %s", selectedStyle)
			}

			components := args
			if len(components) == 0 {
				components, err = PromptComponents(cmd, proj.RegistryRoot)
				if err != nil {
					return err
				}
			}

			results, err := installWithFeedback(cmd, proj, components, selectedStyle)
			if err != nil {
				return err
			}
			printInstallSummary(cmd, results)

			return nil
		},
	}

	cmd.Flags().StringVar(
		&style,
		"style",
		"",
		"Style mode: "+config.StyleCSSFiles+" or "+config.StyleInlineCSSVars,
	)

	return cmd
}
