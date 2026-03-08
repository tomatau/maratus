package cmd

import (
	"encoding/json"
	"os"
	"path/filepath"

	"arachne/cli/internal/cmd/initflow"
	"github.com/spf13/cobra"
)

func newInitCmd(configFilePath func() string) *cobra.Command {
	return &cobra.Command{
		Use:   "init",
		Short: "Initialize Arachne config",
		RunE: func(cmd *cobra.Command, args []string) error {
			srcDir, err := initflow.AskSourceDir(cmd)
			if err != nil {
				return err
			}
			componentsDir, err := initflow.AskComponentsDir(cmd, srcDir)
			if err != nil {
				return err
			}
			componentsLayout, err := initflow.AskComponentsLayout(cmd)
			if err != nil {
				return err
			}

			path := configFilePath()
			if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
				return err
			}

			payload, err := json.MarshalIndent(struct {
				SrcDir           string `json:"srcDir"`
				ComponentsDir    string `json:"componentsDir"`
				ComponentsLayout string `json:"componentsLayout"`
			}{
				SrcDir:           srcDir,
				ComponentsDir:    componentsDir,
				ComponentsLayout: componentsLayout,
			}, "", "  ")
			if err != nil {
				return err
			}

			return os.WriteFile(path, append(payload, '\n'), 0o644)
		},
	}
}
