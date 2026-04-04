package codemods

type SupportedCodemod struct {
	Name        string
	PackageName string
	ExportName  string
}

const (
	RewriteInternalImportsName = "rewrite-internal-imports"
	RewriteRelativeImportsName = "rewrite-relative-imports"
)

var supportedCodemods = map[string]SupportedCodemod{
	RewriteInternalImportsName: {
		Name:        RewriteInternalImportsName,
		PackageName: "@maratus-codemod/rewrite-internal-imports",
		ExportName:  "rewriteInternalPackageImports",
	},
	RewriteRelativeImportsName: {
		Name:        RewriteRelativeImportsName,
		PackageName: "@maratus-codemod/rewrite-relative-imports",
		ExportName:  "rewriteRelativeImports",
	},
}

func Supported() []SupportedCodemod {
	return []SupportedCodemod{
		supportedCodemods[RewriteInternalImportsName],
		supportedCodemods[RewriteRelativeImportsName],
	}
}

func MustGet(name string) SupportedCodemod {
	codemod, ok := supportedCodemods[name]
	if !ok {
		panic("unsupported codemod: " + name)
	}

	return codemod
}
