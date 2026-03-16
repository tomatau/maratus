package config

import "fmt"

func SourceStyleDirFor(style Style) (string, error) {
	switch style {
	case StyleCSSFiles:
		return string(StyleCSSFiles), nil
	case StyleCSSModules:
		return string(StyleCSSModules), nil
	case StyleTailwindCSS:
		return string(StyleTailwindCSS), nil
	default:
		return "", fmt.Errorf("unsupported style: %s", style)
	}
}
