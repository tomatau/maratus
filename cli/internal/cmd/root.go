package cmd

import (
	"os"
	"strings"

	"github.com/spf13/cobra"
)

const (
	configFileFlagName = "config-file"
	configFileAlias    = "-cf"
	configFileEnvVar   = "ARACHNE_CONFIG_FILE"
)

func NewRootCmd() *cobra.Command {
	registerTemplateFuncs()
	root := newRootCommand()
	configFilePath := setupConfigFileFlag(root)
	configureRootHelp(root)
	root.AddCommand(newInitCmd(configFilePath))
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

func setupConfigFileFlag(root *cobra.Command) func() string {
	defaultConfigFile := "arachne.json"
	if envValue := os.Getenv(configFileEnvVar); envValue != "" {
		defaultConfigFile = envValue
	}

	var configFile string
	root.PersistentFlags().StringVar(
		&configFile,
		configFileFlagName,
		defaultConfigFile,
		"Config file path (alias: -cf)",
	)
	return func() string {
		return configFile
	}
}

func RewriteAliasArgs(args []string) []string {
	rewritten := make([]string, len(args))
	copy(rewritten, args)

	longFlag := "--" + configFileFlagName
	for i, arg := range rewritten {
		if arg == configFileAlias {
			rewritten[i] = longFlag
			continue
		}

		if strings.HasPrefix(arg, configFileAlias+"=") {
			rewritten[i] = longFlag + "=" + strings.TrimPrefix(arg, configFileAlias+"=")
		}
	}

	return rewritten
}
