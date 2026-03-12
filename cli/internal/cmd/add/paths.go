package addcmd

import (
	"strings"
)

func ComponentSourceFileName(componentName string) string {
	if componentName == "" {
		return ".tsx"
	}
	return strings.ToUpper(componentName[:1]) + componentName[1:] + ".tsx"
}
