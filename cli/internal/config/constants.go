package config

type Style string

const (
	ComponentsLayoutNested = "nested"
	ComponentsLayoutFlat   = "flat"

	StyleCSSFiles      Style = "css-files"
	StyleInlineCSSVars Style = "inline-css-vars"
	StyleTailwindCSS   Style = "tailwind-css"
)

func DefaultComponentsLayout() string {
	return ComponentsLayoutNested
}

func DefaultStyle() Style {
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

func ParseStyle(style string) (Style, bool) {
	parsed := Style(style)
	if !parsed.IsValid() {
		return "", false
	}

	return parsed, true
}

func (style Style) IsValid() bool {
	switch style {
	case StyleCSSFiles, StyleInlineCSSVars, StyleTailwindCSS:
		return true
	default:
		return false
	}
}
