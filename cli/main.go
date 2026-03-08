package main

import (
	"fmt"
	"os"

	"arachne/cli/internal/cmd"
)

func main() {
	root := cmd.NewRootCmd()

	if err := root.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
