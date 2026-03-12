package cmd

import (
	addcmd "arachne/cli/internal/cmd/add"
	helpcmd "arachne/cli/internal/cmd/help"
	initcmd "arachne/cli/internal/cmd/init"
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
	root := newRootCommand()
	configFilePath := setupConfigFileFlag(root)
	helpcmd.ConfigureRoot(root)
	root.AddCommand(initcmd.New(configFilePath))
	root.AddCommand(addcmd.New(configFilePath))
	return root
}

func newRootCommand() *cobra.Command {
	return &cobra.Command{
		Use:   "arachne",
		Short: helpcmd.RootShort,
		RunE: func(cmd *cobra.Command, args []string) error {
			return cmd.Help()
		},
	}
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
