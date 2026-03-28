package config

type Style string
type LayoutKind string
type FileNameKind string

const (
	LayoutKindNested LayoutKind = "nested"
	LayoutKindFlat   LayoutKind = "flat"

	FileNameKindKebabCase   FileNameKind = "kebab-case"
	FileNameKindMatchExport FileNameKind = "match-export"

	StyleCSSFiles    Style = "css-files"
	StyleCSSModules  Style = "css-modules"
	StyleTailwindCSS Style = "tailwind-css"
)

func DefaultStyle() Style {
	return StyleCSSFiles
}

func DefaultLayoutKind() LayoutKind {
	return LayoutKindNested
}

func DefaultFileNameKind() FileNameKind {
	return FileNameKindKebabCase
}

func (kind LayoutKind) IsValid() bool {
	switch kind {
	case LayoutKindNested, LayoutKindFlat:
		return true
	default:
		return false
	}
}

func (kind FileNameKind) IsValid() bool {
	switch kind {
	case FileNameKindKebabCase, FileNameKindMatchExport:
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
	case StyleCSSFiles, StyleCSSModules, StyleTailwindCSS:
		return true
	default:
		return false
	}
}
