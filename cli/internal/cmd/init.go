package cmd

import (
	"os"

	"github.com/spf13/cobra"
)

func newInitCmd(configFilePath func() string) *cobra.Command {
	return &cobra.Command{
		Use:   "init",
		Short: "Initialize Arachne config",
		RunE: func(cmd *cobra.Command, args []string) error {
			path := configFilePath()
			return os.WriteFile(path, []byte("{}\n"), 0644)
		},
	}
}
