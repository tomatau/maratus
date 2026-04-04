package initcmd

import (
	"fmt"

	"maratus/cli/internal/style"

	"github.com/spf13/cobra"
)

func printSelectedValue(cmd *cobra.Command, value string) {
	_, _ = fmt.Fprintf(cmd.OutOrStdout(), "%s%s\n", style.PromptCursor(), style.PromptActive(value))
}

func printSelectedOption(cmd *cobra.Command, label string, description string) {
	_, _ = fmt.Fprintf(
		cmd.OutOrStdout(),
		"%s%s  %s\n",
		style.PromptCursor(),
		style.PromptActive(label),
		style.PromptHint(description),
	)
}
