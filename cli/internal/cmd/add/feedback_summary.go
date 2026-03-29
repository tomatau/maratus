package addcmd

import (
	"arachne/cli/internal/style"
	"fmt"

	"github.com/spf13/cobra"
)

func printInstallSummary(
	cmd *cobra.Command,
	results []InstallResult,
	dependencyResults []DependencyInstallResult,
	themeFilePath string,
	themeFileStatus string,
) {
	if len(results) == 0 && len(dependencyResults) == 0 {
		return
	}
	if len(results) > 0 {
		_, _ = fmt.Fprintf(cmd.OutOrStdout(), "\n%s\n", style.PromptTitle("Installed components"))
		for _, result := range results {
			label := result.Component
			if result.InstalledAs != "" {
				label = result.InstalledAs
			}
			_, _ = fmt.Fprintf(
				cmd.OutOrStdout(),
				"%s%s\n",
				style.PromptCursor(),
				style.PromptActive(label),
			)
			for _, file := range result.Files {
				_, _ = fmt.Fprintf(
					cmd.OutOrStdout(),
					"  %s%s\n",
					style.PromptHint("• "),
					style.PromptHint(file),
				)
			}
		}
	}

	if len(dependencyResults) > 0 {
		_, _ = fmt.Fprintf(cmd.OutOrStdout(), "\n%s\n", style.PromptTitle("Installed lib dependencies"))
		for _, result := range dependencyResults {
			_, _ = fmt.Fprintf(
				cmd.OutOrStdout(),
				"%s%s\n",
				style.PromptCursor(),
				style.PromptActive(result.Package),
			)
			for _, file := range result.Files {
				_, _ = fmt.Fprintf(
					cmd.OutOrStdout(),
					"  %s%s\n",
					style.PromptHint("• "),
					style.PromptHint(file),
				)
			}
		}
	}

	if themeFilePath != "" {
		title := "Theme file updated"
		if themeFileStatus == "created" {
			title = "Theme file created"
		}
		_, _ = fmt.Fprintf(cmd.OutOrStdout(), "\n%s\n", style.PromptTitle(title))
		_, _ = fmt.Fprintf(
			cmd.OutOrStdout(),
			"%s%s\n",
			style.PromptCursor(),
			style.PromptHint(themeFilePath),
		)
		if themeFileStatus == "created" {
			_, _ = fmt.Fprintf(
				cmd.OutOrStdout(),
				"\nAdd an @import for the `arachne-theme.css` file in your stylesheet entrypoint.\n",
			)
		}
	}
}
