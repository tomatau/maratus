package initcmd

import (
	"maratus/cli/internal/config"
	"maratus/cli/internal/project"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"
)

func New(configFilePath func() string) *cobra.Command {
	yes := false

	cmd := &cobra.Command{
		Use:   "init",
		Short: "Initialize Maratus config",
		RunE: func(cmd *cobra.Command, args []string) error {
			cwd, err := os.Getwd()
			if err != nil {
				return err
			}
			cfg := defaultConfig()

			if !yes {
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

				cfg.SrcDir = srcDir
				cfg.ComponentsDir = componentsDir
				cfg.LibDir = libDir
				cfg.ThemeDir = themeDir
				cfg.Layout.Kind = config.LayoutKind(componentsLayout)
				cfg.Style = style
			}

			cfg, err = project.NormalizeConfigForPath(cwd, configFilePath(), cfg)
			if err != nil {
				return err
			}

			return SaveConfigWithFeedback(cmd, configFilePath(), cfg)
		},
	}

	cmd.Flags().BoolVarP(&yes, "yes", "y", false, "Save config with defaults without prompting")

	return cmd
}

func defaultConfig() config.Config {
	return config.Config{
		SrcDir:        "src",
		ComponentsDir: "components",
		LibDir:        "lib",
		ThemeDir:      "styles",
		FormatCommand: ":",
		Layout: config.LayoutConfig{
			Kind: config.DefaultLayoutKind(),
		},
		FileNames: config.FileNamesConfig{
			Lib:        config.DefaultFileNameKind(),
			Hooks:      config.DefaultFileNameKind(),
			Components: config.FileNameKindMatchExport,
		},
		Style: config.DefaultStyle(),
	}
}
