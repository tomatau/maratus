package cmd

import "github.com/spf13/cobra"

func newHelloCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "hello",
		Short: `Say "Hello, world!"`,
		RunE: func(cmd *cobra.Command, args []string) error {
			_, err := cmd.OutOrStdout().Write([]byte("Hello, world!\n"))
			return err
		},
	}
}
