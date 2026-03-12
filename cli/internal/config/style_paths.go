package config

import "fmt"

func SourceStyleDirFor(style string) (string, error) {
	switch style {
	case StyleCSSFiles:
		return StyleCSSFiles, nil
	case StyleInlineCSSVars:
		return StyleInlineCSSVars, nil
	default:
		return "", fmt.Errorf("unsupported style: %s", style)
	}
}
