package tui

import (
	"os"

	"github.com/spf13/cobra"
)

func IsInteractiveSession(cmd *cobra.Command) bool {
	inFile, ok := cmd.InOrStdin().(*os.File)
	if !ok {
		return false
	}
	outFile, ok := cmd.OutOrStdout().(*os.File)
	if !ok {
		return false
	}

	inStat, err := inFile.Stat()
	if err != nil {
		return false
	}
	outStat, err := outFile.Stat()
	if err != nil {
		return false
	}

	return (inStat.Mode()&os.ModeCharDevice) != 0 && (outStat.Mode()&os.ModeCharDevice) != 0
}
