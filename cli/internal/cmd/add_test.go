package cmd

import (
	addcmd "arachne/cli/internal/cmd/add"
	"arachne/cli/internal/config"
	"arachne/cli/internal/project"
	"bytes"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"testing"
)

type registryFixture struct {
	name            string
	dependencies    map[string]string
	themeTokens     []string
	componentTokens [][2]string
	cssFiles        map[string]string
	cssModules      map[string]string
	tailwindCSS     map[string]string
}

const (
	componentOnlyName            = "componentonly"
	componentWithHookName        = "componentwithhook"
	singleLevelLibDependencyName = "single-level-lib-dependency"
)

func TestAddCSSFilesCopiesBuiltSourceGraph(t *testing.T) {
	wd := t.TempDir()
	writeRegistryFixture(t, wd, componentOnlyFixture(componentOnlyName))
	writeRegistryFixture(t, wd, componentWithHookFixture(componentWithHookName))
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "componentsLayout": "flat"
}`)

	root := NewRootCmd()
	root.SetArgs([]string{"add", componentWithHookName, "--style", "css-files"})
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
		t.Fatalf("execute add component-with-hook css-files: %v", err)
	}

	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", componentTypeName(componentWithHookName)+".tsx"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", "useComponent.ts"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", componentWithHookName+".css"))
	assertFileContains(
		t,
		filepath.Join(wd, "tmp", "src", "components", "useComponent.ts"),
		`import './`+componentWithHookName+`.css'`,
	)
}

func TestAddCSSModulesCopiesBuiltSourceGraph(t *testing.T) {
	wd := t.TempDir()
	writeRegistryFixture(t, wd, componentWithHookFixture(componentWithHookName))
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "componentsLayout": "flat"
}`)

	root := NewRootCmd()
	root.SetArgs([]string{"add", componentWithHookName, "--style", "css-modules"})
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
		t.Fatalf("execute add component-with-hook css-modules: %v", err)
	}

	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", componentTypeName(componentWithHookName)+".tsx"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", "useComponent.ts"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", componentWithHookName+".module.css"))
	assertFileContains(
		t,
		filepath.Join(wd, "tmp", "src", "components", "useComponent.ts"),
		`import styles from './`+componentWithHookName+`.module.css'`,
	)
}

func TestAddTailwindCSSCopiesBuiltSourceGraph(t *testing.T) {
	wd := t.TempDir()
	writeRegistryFixture(t, wd, componentWithHookFixture(componentWithHookName))
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "componentsLayout": "flat"
}`)

	root := NewRootCmd()
	root.SetArgs([]string{"add", componentWithHookName, "--style", "tailwind-css"})
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
		t.Fatalf("execute add component-with-hook tailwind-css: %v", err)
	}

	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", componentTypeName(componentWithHookName)+".tsx"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", "useComponent.ts"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", componentWithHookName+".css"))
	assertFileContains(
		t,
		filepath.Join(wd, "tmp", "src", "components", "useComponent.ts"),
		`import './`+componentWithHookName+`.css'`,
	)
}

func TestAddNestedLayoutPreservesRelativeFiles(t *testing.T) {
	wd := t.TempDir()
	writeRegistryFixture(t, wd, componentWithHookFixture(componentWithHookName))
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "componentsLayout": "nested"
}`)

	root := NewRootCmd()
	root.SetArgs([]string{"add", componentWithHookName, "--style", "css-files"})
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
		t.Fatalf("execute add component-with-hook nested css-files: %v", err)
	}

	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", componentWithHookName, componentTypeName(componentWithHookName)+".tsx"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", componentWithHookName, "useComponent.ts"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", componentWithHookName, componentWithHookName+".css"))
}

func TestAddMultipleComponentsCSSFiles(t *testing.T) {
	wd := t.TempDir()
	writeRegistryFixture(t, wd, componentOnlyFixture(componentOnlyName))
	writeRegistryFixture(t, wd, componentWithHookFixture(componentWithHookName))
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "componentsLayout": "flat"
}`)

	root := NewRootCmd()
	root.SetArgs([]string{"add", componentOnlyName, componentWithHookName, "--style", "css-files"})
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

	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", componentTypeName(componentOnlyName)+".tsx"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", componentOnlyName+".css"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", componentTypeName(componentWithHookName)+".tsx"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", "useComponent.ts"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", componentWithHookName+".css"))
}

func TestInstallComponentDiscoversInternalDependencies(t *testing.T) {
	wd := t.TempDir()
	writeRegistryFixture(t, wd, registryFixture{
		name:         componentWithHookName,
		dependencies: map[string]string{"@arachne/" + singleLevelLibDependencyName: "0.0.0", "react": "^19.0.0"},
		cssFiles: map[string]string{
			componentTypeName(componentWithHookName) + ".tsx": "export function " + componentTypeName(componentWithHookName) + "() { return null }\n",
		},
		cssModules: map[string]string{
			componentTypeName(componentWithHookName) + ".tsx": "export function " + componentTypeName(componentWithHookName) + "() { return null }\n",
		},
		tailwindCSS: map[string]string{
			componentTypeName(componentWithHookName) + ".tsx": "export function " + componentTypeName(componentWithHookName) + "() { return null }\n",
		},
	})
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "libDir": "lib",
  "componentsLayout": "flat"
}`)

	proj, err := project.Open(wd, "arachne.json")
	if err != nil {
		t.Fatalf("open project: %v", err)
	}

	result, err := addcmd.InstallComponent(proj, componentWithHookName, config.StyleCSSFiles)
	if err != nil {
		t.Fatalf("install component: %v", err)
	}

	if len(result.Dependencies) != 1 {
		t.Fatalf("expected 1 internal dependency, got %d (%v)", len(result.Dependencies), result.Dependencies)
	}
	if result.Dependencies[0] != singleLevelLibDependencyName {
		t.Fatalf("expected dependency to be %s, got %q", singleLevelLibDependencyName, result.Dependencies[0])
	}
}

func TestAddCopiesOneLevelInternalDependenciesToLibDir(t *testing.T) {
	wd := t.TempDir()
	writeRegistryFixture(t, wd, registryFixture{
		name:         componentWithHookName,
		dependencies: map[string]string{"@arachne/" + singleLevelLibDependencyName: "0.0.0"},
		cssFiles: map[string]string{
			componentTypeName(componentWithHookName) + ".tsx": "import { dependency } from '@arachne/" + singleLevelLibDependencyName + "'\nexport function " + componentTypeName(componentWithHookName) + "() { dependency(); return null }\n",
		},
		cssModules: map[string]string{
			componentTypeName(componentWithHookName) + ".tsx": "import { dependency } from '@arachne/" + singleLevelLibDependencyName + "'\nexport function " + componentTypeName(componentWithHookName) + "() { dependency(); return null }\n",
		},
		tailwindCSS: map[string]string{
			componentTypeName(componentWithHookName) + ".tsx": "import { dependency } from '@arachne/" + singleLevelLibDependencyName + "'\nexport function " + componentTypeName(componentWithHookName) + "() { dependency(); return null }\n",
		},
	})
	writeFile(t, filepath.Join(wd, "lib", singleLevelLibDependencyName, "src", "index.ts"), "export * from './dependency'\n")
	writeFile(t, filepath.Join(wd, "lib", singleLevelLibDependencyName, "src", "dependency.ts"), "export function dependency() { return null }\n")
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "libDir": "lib",
  "componentsLayout": "flat"
}`)

	root := NewRootCmd()
	root.SetArgs([]string{"add", componentWithHookName, "--style", "css-files"})
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
		t.Fatalf("execute add with dependency: %v", err)
	}

	assertFileExists(t, filepath.Join(wd, "tmp", "src", "lib", singleLevelLibDependencyName, "index.ts"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "lib", singleLevelLibDependencyName, "dependency.ts"))
	assertFileContains(
		t,
		filepath.Join(wd, "tmp", "src", "components", componentTypeName(componentWithHookName)+".tsx"),
		`from '../lib/`+singleLevelLibDependencyName+`'`,
	)
}

func TestAddDedupesInternalDependenciesWithinSingleInvocation(t *testing.T) {
	wd := t.TempDir()
	writeRegistryFixture(t, wd, registryFixture{
		name:         componentOnlyName,
		dependencies: map[string]string{"@arachne/" + singleLevelLibDependencyName: "0.0.0"},
		cssFiles: map[string]string{
			componentTypeName(componentOnlyName) + ".tsx": "export function " + componentTypeName(componentOnlyName) + "() { return null }\n",
		},
		cssModules: map[string]string{
			componentTypeName(componentOnlyName) + ".tsx": "export function " + componentTypeName(componentOnlyName) + "() { return null }\n",
		},
		tailwindCSS: map[string]string{
			componentTypeName(componentOnlyName) + ".tsx": "export function " + componentTypeName(componentOnlyName) + "() { return null }\n",
		},
	})
	writeRegistryFixture(t, wd, registryFixture{
		name:         componentWithHookName,
		dependencies: map[string]string{"@arachne/" + singleLevelLibDependencyName: "0.0.0"},
		cssFiles: map[string]string{
			componentTypeName(componentWithHookName) + ".tsx": "export function " + componentTypeName(componentWithHookName) + "() { return null }\n",
		},
		cssModules: map[string]string{
			componentTypeName(componentWithHookName) + ".tsx": "export function " + componentTypeName(componentWithHookName) + "() { return null }\n",
		},
		tailwindCSS: map[string]string{
			componentTypeName(componentWithHookName) + ".tsx": "export function " + componentTypeName(componentWithHookName) + "() { return null }\n",
		},
	})
	writeFile(t, filepath.Join(wd, "lib", singleLevelLibDependencyName, "src", "index.ts"), "export * from './dependency'\n")
	writeFile(t, filepath.Join(wd, "lib", singleLevelLibDependencyName, "src", "dependency.ts"), "export function dependency() { return null }\n")
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "libDir": "lib",
  "componentsLayout": "flat"
}`)

	root := NewRootCmd()
	root.SetArgs([]string{"add", componentOnlyName, componentWithHookName, "--style", "css-files"})
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
		t.Fatalf("execute add with duplicate dependency: %v", err)
	}

	assertFileExists(t, filepath.Join(wd, "tmp", "src", "lib", singleLevelLibDependencyName, "index.ts"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "lib", singleLevelLibDependencyName, "dependency.ts"))
}

func TestAddNoArgsInNonInteractiveModeReturnsError(t *testing.T) {
	wd := t.TempDir()
	writeRegistryFixture(t, wd, componentOnlyFixture(componentOnlyName))
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

func componentOnlyFixture(name string) registryFixture {
	return registryFixture{
		name:        name,
		themeTokens: []string{"--ara-color-content-detail"},
		componentTokens: [][2]string{
			{"--ara-component-detail", "--ara-color-content-detail"},
		},
		cssFiles: map[string]string{
			componentTypeName(name) + ".tsx": "import './" + name + ".css'\nexport function " + componentTypeName(name) + "() { return null }\n",
			name + ".css":                    ".component { margin: 0; }\n",
		},
		cssModules: map[string]string{
			componentTypeName(name) + ".tsx": "import styles from './" + name + ".module.css'\nexport function " + componentTypeName(name) + "() { return <div className={styles.component} /> }\n",
			name + ".module.css":             ".component { margin: 0; }\n",
		},
		tailwindCSS: map[string]string{
			componentTypeName(name) + ".tsx": "import './" + name + ".css'\nexport function " + componentTypeName(name) + "() { return null }\n",
			name + ".css":                    "@reference 'tailwindcss';\n@layer components { .component { margin: 0; } }\n",
		},
	}
}

func componentWithHookFixture(name string) registryFixture {
	return registryFixture{
		name:        name,
		themeTokens: []string{"--ara-color-control-bg"},
		componentTokens: [][2]string{
			{"--ara-component-bg", "--ara-color-control-bg"},
		},
		cssFiles: map[string]string{
			componentTypeName(name) + ".tsx": "import { useComponent } from './useComponent'\nexport function " + componentTypeName(name) + "() { useComponent(); return null }\n",
			"useComponent.ts":                "import './" + name + ".css'\nexport function useComponent() { return null }\n",
			name + ".css":                    ".component { margin: 0; }\n",
		},
		cssModules: map[string]string{
			componentTypeName(name) + ".tsx": "import { useComponent } from './useComponent'\nexport function " + componentTypeName(name) + "() { useComponent(); return null }\n",
			"useComponent.ts":                "import styles from './" + name + ".module.css'\nexport function useComponent() { return styles.component }\n",
			name + ".module.css":             ".component { margin: 0; }\n",
		},
		tailwindCSS: map[string]string{
			componentTypeName(name) + ".tsx": "import { useComponent } from './useComponent'\nexport function " + componentTypeName(name) + "() { useComponent(); return null }\n",
			"useComponent.ts":                "import './" + name + ".css'\nexport function useComponent() { return null }\n",
			name + ".css":                    "@reference 'tailwindcss';\n@layer components { .component { margin: 0; } }\n",
		},
	}
}

func writeConfig(t *testing.T, wd string, config string) {
	t.Helper()
	path := filepath.Join(wd, "arachne.json")
	if err := os.WriteFile(path, []byte(config+"\n"), 0o644); err != nil {
		t.Fatalf("write config: %v", err)
	}
}

func writeRegistryFixture(t *testing.T, wd string, fixture registryFixture) {
	t.Helper()

	componentRootDir := filepath.Join(wd, "registry", fixture.name)
	cssFileDir := filepath.Join(componentRootDir, "css-files")
	cssModulesDir := filepath.Join(componentRootDir, "css-modules")
	tailwindDir := filepath.Join(componentRootDir, "tailwind-css")

	for _, dir := range []string{componentRootDir, cssFileDir, cssModulesDir, tailwindDir} {
		if err := os.MkdirAll(dir, 0o755); err != nil {
			t.Fatalf("mkdir %s: %v", dir, err)
		}
	}

	writeFile(t, filepath.Join(componentRootDir, "meta.json"), buildMetaJSON(fixture))
	writeFile(
		t,
		filepath.Join(componentRootDir, "package.json"),
		buildPackageJSON(fixture),
	)
	writeStyleFiles(t, cssFileDir, fixture.cssFiles)
	writeStyleFiles(t, cssModulesDir, fixture.cssModules)
	writeStyleFiles(t, tailwindDir, fixture.tailwindCSS)
}

func buildMetaJSON(fixture registryFixture) string {
	lines := []string{
		"{",
		"  \"themeTokens\": [",
	}
	for index, token := range fixture.themeTokens {
		suffix := ","
		if index == len(fixture.themeTokens)-1 {
			suffix = ""
		}
		lines = append(lines, "    \""+token+"\""+suffix)
	}
	lines = append(lines, "  ],", "  \"componentTokens\": [")
	for index, mapping := range fixture.componentTokens {
		suffix := ","
		if index == len(fixture.componentTokens)-1 {
			suffix = ""
		}
		lines = append(
			lines,
			"    {",
			"      \"component\": \""+mapping[0]+"\",",
			"      \"theme\": \""+mapping[1]+"\"",
			"    }"+suffix,
		)
	}
	lines = append(lines, "  ]", "}")
	return strings.Join(lines, "\n") + "\n"
}

func buildPackageJSON(fixture registryFixture) string {
	lines := []string{
		"{",
		"  \"name\": \"@arachne/" + fixture.name + "\",",
		"  \"version\": \"0.0.0\"",
	}

	if len(fixture.dependencies) > 0 {
		lines[len(lines)-1] += ","
		lines = append(lines, "  \"dependencies\": {")

		keys := make([]string, 0, len(fixture.dependencies))
		for key := range fixture.dependencies {
			keys = append(keys, key)
		}
		sort.Strings(keys)

		for index, key := range keys {
			suffix := ","
			if index == len(keys)-1 {
				suffix = ""
			}
			lines = append(lines, `    "`+key+`": "`+fixture.dependencies[key]+`"`+suffix)
		}
		lines = append(lines, "  }")
	}

	lines = append(lines, "}")
	return strings.Join(lines, "\n") + "\n"
}

func writeStyleFiles(t *testing.T, dir string, files map[string]string) {
	t.Helper()
	for relativePath, content := range files {
		writeFile(t, filepath.Join(dir, relativePath), content)
	}
}

func writeFile(t *testing.T, path string, content string) {
	t.Helper()
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		t.Fatalf("mkdir parent: %v", err)
	}
	if err := os.WriteFile(path, []byte(content), 0o644); err != nil {
		t.Fatalf("write file %s: %v", path, err)
	}
}

func assertFileExists(t *testing.T, path string) {
	t.Helper()
	if _, err := os.Stat(path); err != nil {
		t.Fatalf("expected file %s: %v", path, err)
	}
}

func assertFileContains(t *testing.T, path string, expected string) {
	t.Helper()
	content, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("read file %s: %v", path, err)
	}
	if !strings.Contains(string(content), expected) {
		t.Fatalf("expected %s to contain %q, got:\n%s", path, expected, content)
	}
}

func componentTypeName(name string) string {
	if name == "" {
		return ""
	}
	return strings.ToUpper(name[:1]) + name[1:]
}
