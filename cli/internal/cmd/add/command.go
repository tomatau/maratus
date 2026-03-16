package addcmd

import (
	"arachne/cli/internal/config"
	"arachne/cli/internal/project"
	"arachne/cli/internal/registry"
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

func New(configFilePath func() string) *cobra.Command {
	styleFlag := ""

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

			selectedStyle := proj.Config.Style
			if styleFlag != "" {
				parsedStyle, ok := config.ParseStyle(styleFlag)
				if !ok {
					return fmt.Errorf("unsupported style: %s", styleFlag)
				}
				selectedStyle = parsedStyle
			}

			if !selectedStyle.IsValid() {
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
			if err := updateComponentsManifest(proj, results, selectedStyle); err != nil {
				return err
			}
			themeFilePath := ""
			themeFileStatus := ""
			if selectedStyle == config.StyleTailwindCSS || selectedStyle == config.StyleCSSFiles {
				path, created, err := updateThemeFile(proj)
				if err != nil {
					return err
				}
				themeFilePath = path
				if created {
					themeFileStatus = "created"
				} else {
					themeFileStatus = "updated"
				}
			}
			printInstallSummary(cmd, results, themeFilePath, themeFileStatus)

			return nil
		},
	}

	cmd.Flags().StringVar(
		&styleFlag,
		"style",
		"",
		"Style mode: "+
			string(config.StyleCSSFiles)+
			", or "+
			string(config.StyleTailwindCSS),
	)

	return cmd
}

func updateComponentsManifest(
	proj project.Project,
	results []InstallResult,
	selectedStyle config.Style,
) error {
	manifest, err := project.LoadComponentsManifest(proj.ConfigPath)
	if err != nil {
		return err
	}

	for _, result := range results {
		meta, err := registry.LoadComponentMeta(proj.RegistryRoot, result.Component)
		if err != nil {
			return err
		}
		pkg, err := registry.LoadPackageManifest(proj.RegistryRoot, result.Component)
		if err != nil {
			return err
		}

		manifest.Components[result.Component] = project.InstalledComponent{
			Package:         pkg.Name,
			Version:         pkg.Version,
			Style:           selectedStyle,
			ThemeTokens:     meta.ThemeTokens,
			ComponentTokens: meta.ComponentTokens,
		}
	}

	return project.SaveComponentsManifest(proj.ConfigPath, manifest)
}

func updateThemeFile(proj project.Project) (string, bool, error) {
	manifest, err := project.LoadComponentsManifest(proj.ConfigPath)
	if err != nil {
		return "", false, err
	}

	return project.UpdateThemeFile(proj.ConfigPath, proj.Config, manifest)
}
