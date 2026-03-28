package initcmd

import (
	"arachne/cli/internal/config"
	"arachne/cli/internal/project"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"
)

func New(configFilePath func() string) *cobra.Command {
	return &cobra.Command{
		Use:   "init",
		Short: "Initialize Arachne config",
		RunE: func(cmd *cobra.Command, args []string) error {
			cwd, err := os.Getwd()
			if err != nil {
				return err
			}
			configRoot := filepath.Dir(project.ResolveConfigPath(cwd, configFilePath()))

			srcDir, err := AskSourceDir(cmd, configRoot)
			if err != nil {
				return err
			}
			componentsDir, err := AskComponentsDir(cmd, configRoot, srcDir)
			if err != nil {
				return err
			}
			libDir, err := AskLibDir(cmd, configRoot, srcDir)
			if err != nil {
				return err
			}
			themeDir, err := AskThemeDir(cmd, configRoot, srcDir)
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

			cfg, err := project.NormalizeConfigForPath(cwd, configFilePath(), config.Config{
				SrcDir:        srcDir,
				ComponentsDir: componentsDir,
				LibDir:        libDir,
				ThemeDir:      themeDir,
				Layout: config.LayoutConfig{
					Kind: config.LayoutKind(componentsLayout),
				},
				FileNames: config.FileNamesConfig{
					Lib:        config.DefaultFileNameKind(),
					Components: config.FileNameKindMatchExport,
				},
				Style: style,
			})
			if err != nil {
				return err
			}

			return SaveConfigWithFeedback(cmd, configFilePath(), cfg)
		},
	}
}
