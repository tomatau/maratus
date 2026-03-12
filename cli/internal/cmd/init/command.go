package initcmd

import (
	"arachne/cli/internal/config"

	"github.com/spf13/cobra"
)

func New(configFilePath func() string) *cobra.Command {
	return &cobra.Command{
		Use:   "init",
		Short: "Initialize Arachne config",
		RunE: func(cmd *cobra.Command, args []string) error {
			srcDir, err := AskSourceDir(cmd)
			if err != nil {
				return err
			}
			componentsDir, err := AskComponentsDir(cmd, srcDir)
			if err != nil {
				return err
			}
			componentsLayout, err := AskComponentsLayout(cmd)
			if err != nil {
				return err
			}
			style, err := AskStyle(cmd)
			if err != nil {
				return err
			}

			return SaveConfigWithFeedback(cmd, configFilePath(), config.Config{
				SrcDir:           srcDir,
				ComponentsDir:    componentsDir,
				ComponentsLayout: componentsLayout,
				Style:            style,
			})
		},
	}
}
