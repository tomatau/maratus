package config

const (
	ComponentsLayoutNested = "nested"
	ComponentsLayoutFlat   = "flat"

	StyleCSSFiles      = "css-files"
	StyleInlineCSSVars = "inline-css-vars"
)

func DefaultComponentsLayout() string {
	return ComponentsLayoutNested
}

func DefaultStyle() string {
	return StyleInlineCSSVars
}

func IsValidComponentsLayout(layout string) bool {
	switch layout {
	case ComponentsLayoutNested, ComponentsLayoutFlat:
		return true
	default:
		return false
	}
}

func IsValidStyle(style string) bool {
	switch style {
	case StyleCSSFiles, StyleInlineCSSVars:
		return true
	default:
		return false
	}
}
