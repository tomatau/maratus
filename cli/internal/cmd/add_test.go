package cmd

import (
	"bytes"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestAddSeparatorCSSFiles(t *testing.T) {
	wd := t.TempDir()
	writeSeparatorArtifacts(t, wd)
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "componentsLayout": "flat"
}`)

	root := NewRootCmd()
	root.SetArgs([]string{"add", "separator", "--style", "css-files"})
	root.SetOut(&bytes.Buffer{})
	root.SetErr(&bytes.Buffer{})

	previous, err := os.Getwd()
	if err != nil {
		t.Fatalf("getwd: %v", err)
	}
	t.Cleanup(func() { _ = os.Chdir(previous) })

	if err := os.Chdir(wd); err != nil {
		t.Fatalf("chdir temp dir: %v", err)
	}

	if err := root.Execute(); err != nil {
		t.Fatalf("execute add separator: %v", err)
	}

	componentPath := filepath.Join(wd, "tmp", "src", "components", "Separator.tsx")
	cssPath := filepath.Join(wd, "tmp", "src", "components", "separator.css")

	componentContent, err := os.ReadFile(componentPath)
	if err != nil {
		t.Fatalf("read component file: %v", err)
	}
	if !strings.Contains(string(componentContent), `import "./separator.css"`) {
		t.Fatalf("expected component to import separator.css, got:\n%s", componentContent)
	}
	if _, err := os.Stat(cssPath); err != nil {
		t.Fatalf("expected css file: %v", err)
	}
}

func TestAddSeparatorCSSFilesNestedLayout(t *testing.T) {
	wd := t.TempDir()
	writeSeparatorArtifacts(t, wd)
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "componentsLayout": "nested"
}`)

	root := NewRootCmd()
	root.SetArgs([]string{"add", "separator", "--style", "css-files"})
	root.SetOut(&bytes.Buffer{})
	root.SetErr(&bytes.Buffer{})

	previous, err := os.Getwd()
	if err != nil {
		t.Fatalf("getwd: %v", err)
	}
	t.Cleanup(func() { _ = os.Chdir(previous) })

	if err := os.Chdir(wd); err != nil {
		t.Fatalf("chdir temp dir: %v", err)
	}

	if err := root.Execute(); err != nil {
		t.Fatalf("execute add separator: %v", err)
	}

	componentPath := filepath.Join(wd, "tmp", "src", "components", "separator", "Separator.tsx")
	cssPath := filepath.Join(wd, "tmp", "src", "components", "separator", "separator.css")

	if _, err := os.Stat(componentPath); err != nil {
		t.Fatalf("expected nested component file: %v", err)
	}
	if _, err := os.Stat(cssPath); err != nil {
		t.Fatalf("expected nested css file: %v", err)
	}
}

func TestAddMultipleComponentsCSSFiles(t *testing.T) {
	wd := t.TempDir()
	writeSeparatorArtifacts(t, wd)
	writeComponentArtifacts(t, wd, "button")
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "componentsLayout": "flat"
}`)

	root := NewRootCmd()
	root.SetArgs([]string{"add", "separator", "button", "--style", "css-files"})
	root.SetOut(&bytes.Buffer{})
	root.SetErr(&bytes.Buffer{})

	previous, err := os.Getwd()
	if err != nil {
		t.Fatalf("getwd: %v", err)
	}
	t.Cleanup(func() { _ = os.Chdir(previous) })

	if err := os.Chdir(wd); err != nil {
		t.Fatalf("chdir temp dir: %v", err)
	}

	if err := root.Execute(); err != nil {
		t.Fatalf("execute add multiple: %v", err)
	}

	if _, err := os.Stat(filepath.Join(wd, "tmp", "src", "components", "Separator.tsx")); err != nil {
		t.Fatalf("expected separator component file: %v", err)
	}
	if _, err := os.Stat(filepath.Join(wd, "tmp", "src", "components", "Button.tsx")); err != nil {
		t.Fatalf("expected button component file: %v", err)
	}
}

func TestAddNoArgsInNonInteractiveModeReturnsError(t *testing.T) {
	wd := t.TempDir()
	writeSeparatorArtifacts(t, wd)
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "componentsLayout": "flat"
}`)

	root := NewRootCmd()
	root.SetArgs([]string{"add"})
	root.SetIn(strings.NewReader(""))
	root.SetOut(&bytes.Buffer{})
	root.SetErr(&bytes.Buffer{})

	previous, err := os.Getwd()
	if err != nil {
		t.Fatalf("getwd: %v", err)
	}
	t.Cleanup(func() { _ = os.Chdir(previous) })

	if err := os.Chdir(wd); err != nil {
		t.Fatalf("chdir temp dir: %v", err)
	}

	err = root.Execute()
	if err == nil {
		t.Fatal("expected add with no args in non-interactive mode to error")
	}
	if !strings.Contains(err.Error(), "no components provided") {
		t.Fatalf("expected no components provided error, got: %v", err)
	}
}

func TestAddSeparatorInlineCSSVars(t *testing.T) {
	wd := t.TempDir()
	writeSeparatorArtifacts(t, wd)
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "componentsLayout": "flat"
}`)

	root := NewRootCmd()
	root.SetArgs([]string{"add", "separator", "--style", "inline-css-vars"})
	root.SetOut(&bytes.Buffer{})
	root.SetErr(&bytes.Buffer{})

	previous, err := os.Getwd()
	if err != nil {
		t.Fatalf("getwd: %v", err)
	}
	t.Cleanup(func() { _ = os.Chdir(previous) })

	if err := os.Chdir(wd); err != nil {
		t.Fatalf("chdir temp dir: %v", err)
	}

	if err := root.Execute(); err != nil {
		t.Fatalf("execute add separator: %v", err)
	}

	componentPath := filepath.Join(wd, "tmp", "src", "components", "Separator.tsx")
	cssPath := filepath.Join(wd, "tmp", "src", "components", "separator.css")

	componentContent, err := os.ReadFile(componentPath)
	if err != nil {
		t.Fatalf("read component file: %v", err)
	}
	if !strings.Contains(string(componentContent), "StyledSeparator") {
		t.Fatalf("expected styled wrapper in inline output, got:\n%s", componentContent)
	}
	if _, err := os.Stat(cssPath); !os.IsNotExist(err) {
		t.Fatalf("expected no css file, got err=%v", err)
	}
}

func writeConfig(t *testing.T, wd string, config string) {
	t.Helper()
	path := filepath.Join(wd, "arachne.json")
	if err := os.WriteFile(path, []byte(config+"\n"), 0o644); err != nil {
		t.Fatalf("write config: %v", err)
	}
}

func writeSeparatorArtifacts(t *testing.T, wd string) {
	t.Helper()
	writeComponentArtifacts(t, wd, "separator")
}

func writeComponentArtifacts(t *testing.T, wd string, name string) {
	t.Helper()
	cssFileDir := filepath.Join(wd, "registry", "separator", "css-files")
	cssVarsDir := filepath.Join(wd, "registry", "separator", "inline-css-vars")
	if name != "separator" {
		cssFileDir = filepath.Join(wd, "registry", name, "css-files")
		cssVarsDir = filepath.Join(wd, "registry", name, "inline-css-vars")
	}

	if err := os.MkdirAll(cssFileDir, 0o755); err != nil {
		t.Fatalf("mkdir css-files dir: %v", err)
	}
	if err := os.MkdirAll(cssVarsDir, 0o755); err != nil {
		t.Fatalf("mkdir inline-css-vars dir: %v", err)
	}

	if err := os.WriteFile(
		filepath.Join(cssFileDir, componentTypeName(name)+".tsx"),
		[]byte("import \"./"+name+".css\"\nexport function "+componentTypeName(name)+"() { return <hr /> }\n"),
		0o644,
	); err != nil {
		t.Fatalf("write css-file component: %v", err)
	}
	if err := os.WriteFile(
		filepath.Join(cssFileDir, name+".css"),
		[]byte(".arachne-separator { margin: 0; }\n"),
		0o644,
	); err != nil {
		t.Fatalf("write css-file css: %v", err)
	}
	if err := os.WriteFile(
		filepath.Join(cssVarsDir, componentTypeName(name)+".tsx"),
		[]byte("function Styled"+componentTypeName(name)+"() { return <hr /> }\nexport { Styled"+componentTypeName(name)+" as "+componentTypeName(name)+" }\n"),
		0o644,
	); err != nil {
		t.Fatalf("write css-vars component: %v", err)
	}
}

func componentTypeName(name string) string {
	if name == "" {
		return ""
	}
	return strings.ToUpper(name[:1]) + name[1:]
}
