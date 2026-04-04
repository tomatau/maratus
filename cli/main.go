package main

import (
	"fmt"
	"os"

	"maratus/cli/internal/cmd"
)

func main() {
	root := cmd.NewRootCmd()
	root.SetArgs(cmd.RewriteAliasArgs(os.Args[1:]))

	if err := root.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
