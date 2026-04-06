package cmd

import (
	"bytes"
	"encoding/json"
	addcmd "maratus/cli/internal/cmd/add"
	"maratus/cli/internal/config"
	"maratus/cli/internal/project"
	"os"
	"path/filepath"
	"reflect"
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
	transitiveLibDependencyName  = "transitive-lib-dependency"
	rewriteInternalImportsExport = "rewriteInternalPackageImports"
	rewriteRelativeImportsExport = "rewriteRelativeImports"
)

func TestAddCSSFilesCopiesBuiltSourceGraph(t *testing.T) {
	wd := t.TempDir()
	writeRegistryFixture(t, wd, componentOnlyFixture(componentOnlyName))
	writeRegistryFixture(t, wd, componentWithHookFixture(componentWithHookName))
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "layout": {
    "kind": "flat"
  }
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
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", "use-component.ts"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", componentWithHookName+".css"))
	assertFileContains(
		t,
		filepath.Join(wd, "tmp", "src", "components", "use-component.ts"),
		`import './`+componentTypeName(componentWithHookName)+`.css'`,
	)
}

func TestAddCSSModulesCopiesBuiltSourceGraph(t *testing.T) {
	wd := t.TempDir()
	writeRegistryFixture(t, wd, componentWithHookFixture(componentWithHookName))
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "layout": {
    "kind": "flat"
  }
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
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", "use-component.ts"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", componentWithHookName+".module.css"))
	assertFileContains(
		t,
		filepath.Join(wd, "tmp", "src", "components", "use-component.ts"),
		`import styles from './`+componentTypeName(componentWithHookName)+`.module.css'`,
	)
}

func TestAddTailwindCSSCopiesBuiltSourceGraph(t *testing.T) {
	wd := t.TempDir()
	writeRegistryFixture(t, wd, componentWithHookFixture(componentWithHookName))
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "layout": {
    "kind": "flat"
  }
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
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", "use-component.ts"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", componentWithHookName+".css"))
	assertFileContains(
		t,
		filepath.Join(wd, "tmp", "src", "components", "use-component.ts"),
		`import './`+componentTypeName(componentWithHookName)+`.css'`,
	)
}

func TestAddNestedLayoutPreservesRelativeFiles(t *testing.T) {
	wd := t.TempDir()
	writeRegistryFixture(t, wd, componentWithHookFixture(componentWithHookName))
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "layout": {
    "kind": "nested"
  }
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
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", componentWithHookName, "use-component.ts"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", componentWithHookName, componentWithHookName+".css"))
}

func TestAddMultipleComponentsCSSFiles(t *testing.T) {
	wd := t.TempDir()
	writeRegistryFixture(t, wd, componentOnlyFixture(componentOnlyName))
	writeRegistryFixture(t, wd, componentWithHookFixture(componentWithHookName))
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "layout": {
    "kind": "flat"
  }
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
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", "use-component.ts"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", componentWithHookName+".css"))
}

func TestAddInConsumerModeInstallsRequiredPackagesAndCopiesComponent(t *testing.T) {
	wd := t.TempDir()
	writeInstalledRegistryFixture(t, wd, componentOnlyFixture(componentOnlyName))
	writeInstalledManifest(
		t,
		wd,
		componentOnlyName,
		"@maratus-registry/"+componentOnlyName,
		"0.3.0",
	)
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "layout": {
    "kind": "flat"
  }
}`)

	var actualRootDir string
	var actualCommand []string
	restore := project.SetPackageInstallExecutorForTesting(
		func(rootDir string, commandArgs []string) error {
			actualRootDir = rootDir
			actualCommand = append([]string(nil), commandArgs...)
			return nil
		},
	)
	t.Cleanup(restore)

	root := NewRootCmd()
	root.SetArgs([]string{"add", componentOnlyName, "--style", "css-files"})
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
		t.Fatalf("execute add in consumer mode: %v", err)
	}

	actualRootDirEval, err := filepath.EvalSymlinks(actualRootDir)
	if err != nil {
		t.Fatalf("eval install rootDir: %v", err)
	}
	wdEval, err := filepath.EvalSymlinks(wd)
	if err != nil {
		t.Fatalf("eval temp dir: %v", err)
	}
	if actualRootDirEval != wdEval {
		t.Fatalf("install rootDir = %q, want %q", actualRootDirEval, wdEval)
	}
	expectedCommand := []string{
		"npm",
		"install",
		"--no-save",
		"--no-package-lock",
		"@maratus-registry/componentonly@0.3.0",
		"@maratus-codemod/rewrite-internal-imports@0.1.0",
		"@maratus-codemod/rewrite-relative-imports@0.1.0",
	}
	if !reflect.DeepEqual(actualCommand, expectedCommand) {
		t.Fatalf("install command = %#v, want %#v", actualCommand, expectedCommand)
	}

	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", componentTypeName(componentOnlyName)+".tsx"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", componentOnlyName+".css"))
}

func TestAddUsesKebabCaseComponentFilenameWhenConfigured(t *testing.T) {
	wd := t.TempDir()
	writeRegistryFixture(t, wd, componentOnlyFixture(componentOnlyName))
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "layout": {
    "kind": "flat"
  },
  "filenames": {
    "lib": "kebab-case",
    "components": "kebab-case"
  }
}`)

	root := NewRootCmd()
	root.SetArgs([]string{"add", componentOnlyName, "--style", "css-files"})
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
		t.Fatalf("execute add kebab-case component filename: %v", err)
	}

	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", componentOnlyName+".tsx"))
}

func TestAddUsesMatchExportComponentCSSFilenameAndImportWhenConfigured(t *testing.T) {
	wd := t.TempDir()
	writeRegistryFixture(t, wd, componentWithHookFixture(componentWithHookName))
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "layout": {
    "kind": "flat"
  },
  "filenames": {
    "lib": "kebab-case",
    "components": "match-export"
  }
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
		t.Fatalf("execute add match-export component css filename: %v", err)
	}

	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", componentTypeName(componentWithHookName)+".tsx"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", "use-component.ts"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", componentTypeName(componentWithHookName)+".css"))
	assertFileContains(
		t,
		filepath.Join(wd, "tmp", "src", "components", "use-component.ts"),
		`import './`+componentTypeName(componentWithHookName)+`.css'`,
	)
}

func TestAddUsesKebabCaseForAllComponentSourceFilesWhenConfigured(t *testing.T) {
	wd := t.TempDir()
	writeRegistryFixture(t, wd, componentWithHookFixture(componentWithHookName))
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "layout": {
    "kind": "flat"
  },
  "filenames": {
    "lib": "kebab-case",
    "components": "kebab-case"
  }
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
		t.Fatalf("execute add kebab-case component source files: %v", err)
	}

	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", componentWithHookName+".tsx"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", "use-component.ts"))
	assertFileContains(
		t,
		filepath.Join(wd, "tmp", "src", "components", componentWithHookName+".tsx"),
		`from './use-component'`,
	)
}

func TestAddSkipsComponentBarrelWhenBarrelsDisabled(t *testing.T) {
	wd := t.TempDir()
	fixture := componentOnlyFixture(componentOnlyName)
	fixture.cssFiles["index.ts"] = `export { Componentonly } from './Componentonly'` + "\n"
	fixture.cssModules["index.ts"] = `export { Componentonly } from './Componentonly'` + "\n"
	fixture.tailwindCSS["index.ts"] = `export { Componentonly } from './Componentonly'` + "\n"
	writeRegistryFixture(t, wd, fixture)
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "layout": {
    "kind": "nested",
    "barrel": false
  }
}`)

	root := NewRootCmd()
	root.SetArgs([]string{"add", componentOnlyName, "--style", "css-files"})
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
		t.Fatalf("execute add without component barrel: %v", err)
	}

	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", componentOnlyName, componentTypeName(componentOnlyName)+".tsx"))
	assertFileMissing(t, filepath.Join(wd, "tmp", "src", "components", componentOnlyName, "index.ts"))
}

func TestAddKeepsComponentBarrelWhenNestedAndEnabled(t *testing.T) {
	wd := t.TempDir()
	fixture := componentOnlyFixture(componentOnlyName)
	fixture.cssFiles["index.ts"] = `export { Componentonly } from './Componentonly'` + "\n"
	fixture.cssModules["index.ts"] = `export { Componentonly } from './Componentonly'` + "\n"
	fixture.tailwindCSS["index.ts"] = `export { Componentonly } from './Componentonly'` + "\n"
	writeRegistryFixture(t, wd, fixture)
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "layout": {
    "kind": "nested",
    "barrel": true
  }
}`)

	root := NewRootCmd()
	root.SetArgs([]string{"add", componentOnlyName, "--style", "css-files"})
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
		t.Fatalf("execute add with component barrel: %v", err)
	}

	assertFileExists(t, filepath.Join(wd, "tmp", "src", "components", componentOnlyName, "index.ts"))
	assertFileContains(
		t,
		filepath.Join(wd, "tmp", "src", "components", componentOnlyName, "index.ts"),
		`from './Componentonly'`,
	)
}

func TestInstallComponentDiscoversInternalDependencies(t *testing.T) {
	wd := t.TempDir()
	writeRegistryFixture(t, wd, registryFixture{
		name:         componentWithHookName,
		dependencies: map[string]string{"@maratus/" + singleLevelLibDependencyName: "0.0.0", "react": "^19.0.0"},
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
  "layout": {
    "kind": "flat",
    "barrel": true
  }
}`)

	proj, err := project.Open(wd, "maratus.json")
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
		dependencies: map[string]string{"@maratus/" + singleLevelLibDependencyName: "0.0.0"},
		cssFiles: map[string]string{
			componentTypeName(componentWithHookName) + ".tsx": "import { dependency } from '@maratus/" + singleLevelLibDependencyName + "'\nexport function " + componentTypeName(componentWithHookName) + "() { dependency(); return null }\n",
		},
		cssModules: map[string]string{
			componentTypeName(componentWithHookName) + ".tsx": "import { dependency } from '@maratus/" + singleLevelLibDependencyName + "'\nexport function " + componentTypeName(componentWithHookName) + "() { dependency(); return null }\n",
		},
		tailwindCSS: map[string]string{
			componentTypeName(componentWithHookName) + ".tsx": "import { dependency } from '@maratus/" + singleLevelLibDependencyName + "'\nexport function " + componentTypeName(componentWithHookName) + "() { dependency(); return null }\n",
		},
	})
	writeFile(t, filepath.Join(wd, "lib", singleLevelLibDependencyName, "src", "index.ts"), "export * from './dependency'\n")
	writeFile(t, filepath.Join(wd, "lib", singleLevelLibDependencyName, "src", "dependency.ts"), "export function dependency() { return null }\n")
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "libDir": "lib",
  "layout": {
    "kind": "flat",
    "barrel": true
  }
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

func TestAddCopiesTransitiveInternalDependenciesToLibDir(t *testing.T) {
	wd := t.TempDir()
	writeRegistryFixture(t, wd, registryFixture{
		name:         componentWithHookName,
		dependencies: map[string]string{"@maratus/" + singleLevelLibDependencyName: "0.0.0"},
		cssFiles: map[string]string{
			componentTypeName(componentWithHookName) + ".tsx": "import { dependency } from '@maratus/" + singleLevelLibDependencyName + "'\nexport function " + componentTypeName(componentWithHookName) + "() { dependency(); return null }\n",
		},
		cssModules: map[string]string{
			componentTypeName(componentWithHookName) + ".tsx": "import { dependency } from '@maratus/" + singleLevelLibDependencyName + "'\nexport function " + componentTypeName(componentWithHookName) + "() { dependency(); return null }\n",
		},
		tailwindCSS: map[string]string{
			componentTypeName(componentWithHookName) + ".tsx": "import { dependency } from '@maratus/" + singleLevelLibDependencyName + "'\nexport function " + componentTypeName(componentWithHookName) + "() { dependency(); return null }\n",
		},
	})
	writeFile(
		t,
		filepath.Join(wd, "lib", singleLevelLibDependencyName, "package.json"),
		"{\n  \"name\": \"@maratus/"+singleLevelLibDependencyName+"\",\n  \"dependencies\": {\n    \"@maratus/"+transitiveLibDependencyName+"\": \"workspace:*\"\n  }\n}\n",
	)
	writeFile(t, filepath.Join(wd, "lib", singleLevelLibDependencyName, "src", "index.ts"), "export * from './dependency'\n")
	writeFile(
		t,
		filepath.Join(wd, "lib", singleLevelLibDependencyName, "src", "dependency.ts"),
		"import { transitiveDependency } from '@maratus/"+transitiveLibDependencyName+"'\nexport function dependency() { return transitiveDependency() }\n",
	)
	writeFile(
		t,
		filepath.Join(wd, "lib", transitiveLibDependencyName, "package.json"),
		"{\n  \"name\": \"@maratus/"+transitiveLibDependencyName+"\"\n}\n",
	)
	writeFile(t, filepath.Join(wd, "lib", transitiveLibDependencyName, "src", "index.ts"), "export * from './transitiveDependency'\n")
	writeFile(
		t,
		filepath.Join(wd, "lib", transitiveLibDependencyName, "src", "transitiveDependency.ts"),
		"export function transitiveDependency() { return null }\n",
	)
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "libDir": "lib",
  "layout": {
    "kind": "flat",
    "barrel": true
  }
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
		t.Fatalf("execute add with transitive dependency: %v", err)
	}

	assertFileExists(t, filepath.Join(wd, "tmp", "src", "lib", singleLevelLibDependencyName, "index.ts"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "lib", singleLevelLibDependencyName, "dependency.ts"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "lib", transitiveLibDependencyName, "index.ts"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "lib", transitiveLibDependencyName, "transitive-dependency.ts"))
}

func TestAddDedupesInternalDependenciesWithinSingleInvocation(t *testing.T) {
	wd := t.TempDir()
	writeRegistryFixture(t, wd, registryFixture{
		name:         componentOnlyName,
		dependencies: map[string]string{"@maratus/" + singleLevelLibDependencyName: "0.0.0"},
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
		dependencies: map[string]string{"@maratus/" + singleLevelLibDependencyName: "0.0.0"},
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
  "layout": {
    "kind": "flat",
    "barrel": true
  }
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

func TestAddUsesMatchExportLibFilenamesWhenConfigured(t *testing.T) {
	wd := t.TempDir()
	writeRegistryFixture(t, wd, registryFixture{
		name:         componentWithHookName,
		dependencies: map[string]string{"@maratus/" + singleLevelLibDependencyName: "0.0.0"},
		cssFiles: map[string]string{
			componentTypeName(componentWithHookName) + ".tsx": "import { dependency } from '@maratus/" + singleLevelLibDependencyName + "'\nexport function " + componentTypeName(componentWithHookName) + "() { dependency(); return null }\n",
		},
		cssModules: map[string]string{
			componentTypeName(componentWithHookName) + ".tsx": "import { dependency } from '@maratus/" + singleLevelLibDependencyName + "'\nexport function " + componentTypeName(componentWithHookName) + "() { dependency(); return null }\n",
		},
		tailwindCSS: map[string]string{
			componentTypeName(componentWithHookName) + ".tsx": "import { dependency } from '@maratus/" + singleLevelLibDependencyName + "'\nexport function " + componentTypeName(componentWithHookName) + "() { dependency(); return null }\n",
		},
	})
	writeFile(t, filepath.Join(wd, "lib", singleLevelLibDependencyName, "src", "index.ts"), "export * from './dependency'\n")
	writeFile(t, filepath.Join(wd, "lib", singleLevelLibDependencyName, "src", "dependency.ts"), "export function dependency() { return null }\n")
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "libDir": "lib",
  "layout": {
    "kind": "flat",
    "barrel": true
  },
  "filenames": {
    "lib": "match-export",
    "components": "match-export"
  }
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
		t.Fatalf("execute add match-export lib filenames: %v", err)
	}

	assertFileExists(t, filepath.Join(wd, "tmp", "src", "lib", singleLevelLibDependencyName, "index.ts"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "lib", singleLevelLibDependencyName, "dependency.ts"))
	assertFileContains(
		t,
		filepath.Join(wd, "tmp", "src", "components", componentTypeName(componentWithHookName)+".tsx"),
		`from '../lib/`+singleLevelLibDependencyName+`'`,
	)
}

func TestAddUsesKebabCaseLibFilenamesWhenConfigured(t *testing.T) {
	wd := t.TempDir()
	writeRegistryFixture(t, wd, registryFixture{
		name:         componentWithHookName,
		dependencies: map[string]string{"@maratus/" + singleLevelLibDependencyName: "0.0.0"},
		cssFiles: map[string]string{
			componentTypeName(componentWithHookName) + ".tsx": "import { dependency } from '@maratus/" + singleLevelLibDependencyName + "'\nexport function " + componentTypeName(componentWithHookName) + "() { dependency(); return null }\n",
		},
		cssModules: map[string]string{
			componentTypeName(componentWithHookName) + ".tsx": "import { dependency } from '@maratus/" + singleLevelLibDependencyName + "'\nexport function " + componentTypeName(componentWithHookName) + "() { dependency(); return null }\n",
		},
		tailwindCSS: map[string]string{
			componentTypeName(componentWithHookName) + ".tsx": "import { dependency } from '@maratus/" + singleLevelLibDependencyName + "'\nexport function " + componentTypeName(componentWithHookName) + "() { dependency(); return null }\n",
		},
	})
	writeFile(t, filepath.Join(wd, "lib", singleLevelLibDependencyName, "src", "index.ts"), "export * from './useDependencyHook'\n")
	writeFile(t, filepath.Join(wd, "lib", singleLevelLibDependencyName, "src", "useDependencyHook.ts"), "export function useDependencyHook() { return null }\n")
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "libDir": "lib",
  "layout": {
    "kind": "flat",
    "barrel": true
  },
  "filenames": {
    "lib": "kebab-case",
    "components": "match-export"
  }
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
		t.Fatalf("execute add kebab-case lib filenames: %v", err)
	}

	assertFileExists(t, filepath.Join(wd, "tmp", "src", "lib", singleLevelLibDependencyName, "index.ts"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "lib", singleLevelLibDependencyName, "use-dependency-hook.ts"))
}

func TestAddRewritesRelativeImportsWithinLibSourcesWhenKebabCaseConfigured(t *testing.T) {
	wd := t.TempDir()
	writeRegistryFixture(t, wd, registryFixture{
		name:         componentWithHookName,
		dependencies: map[string]string{"@maratus/" + singleLevelLibDependencyName: "0.0.0"},
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
	writeFile(t, filepath.Join(wd, "lib", singleLevelLibDependencyName, "src", "index.ts"), "export * from './useDependencyFeature'\n")
	writeFile(
		t,
		filepath.Join(wd, "lib", singleLevelLibDependencyName, "src", "useDependencyFeature.ts"),
		"import { useDependencyHook } from './useDependencyHook'\nexport function useDependencyFeature() { return useDependencyHook() === 'ready' }\n",
	)
	writeFile(
		t,
		filepath.Join(wd, "lib", singleLevelLibDependencyName, "src", "useDependencyHook.ts"),
		"export function useDependencyHook() { return 'ready' }\n",
	)
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "libDir": "lib",
  "layout": {
    "kind": "nested",
    "barrel": false
  },
  "filenames": {
    "lib": "kebab-case",
    "components": "kebab-case"
  }
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
		t.Fatalf("execute add with kebab-case lib relative imports: %v", err)
	}

	assertFileContains(
		t,
		filepath.Join(wd, "tmp", "src", "lib", singleLevelLibDependencyName, "use-dependency-feature.ts"),
		`from './use-dependency-hook'`,
	)
}

func TestAddSkipsLibBarrelWhenBarrelsDisabled(t *testing.T) {
	wd := t.TempDir()
	writeRegistryFixture(t, wd, registryFixture{
		name:         componentWithHookName,
		dependencies: map[string]string{"@maratus/" + singleLevelLibDependencyName: "0.0.0"},
		cssFiles: map[string]string{
			componentTypeName(componentWithHookName) + ".tsx": "import { dependency } from '@maratus/" + singleLevelLibDependencyName + "'\nexport function " + componentTypeName(componentWithHookName) + "() { dependency(); return null }\n",
		},
		cssModules: map[string]string{
			componentTypeName(componentWithHookName) + ".tsx": "import { dependency } from '@maratus/" + singleLevelLibDependencyName + "'\nexport function " + componentTypeName(componentWithHookName) + "() { dependency(); return null }\n",
		},
		tailwindCSS: map[string]string{
			componentTypeName(componentWithHookName) + ".tsx": "import { dependency } from '@maratus/" + singleLevelLibDependencyName + "'\nexport function " + componentTypeName(componentWithHookName) + "() { dependency(); return null }\n",
		},
	})
	writeFile(t, filepath.Join(wd, "lib", singleLevelLibDependencyName, "src", "index.ts"), "export * from './dependency'\n")
	writeFile(t, filepath.Join(wd, "lib", singleLevelLibDependencyName, "src", "dependency.ts"), "export function dependency() { return null }\n")
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "libDir": "lib",
  "layout": {
    "kind": "flat",
    "barrel": false
  }
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
		t.Fatalf("execute add without lib barrel: %v", err)
	}

	assertFileMissing(t, filepath.Join(wd, "tmp", "src", "lib", singleLevelLibDependencyName, "index.ts"))
	assertFileExists(t, filepath.Join(wd, "tmp", "src", "lib", singleLevelLibDependencyName, "dependency.ts"))
	assertFileContains(
		t,
		filepath.Join(wd, "tmp", "src", "components", componentTypeName(componentWithHookName)+".tsx"),
		`from '../lib/`+singleLevelLibDependencyName+`/dependency'`,
	)
}

func TestAddKeepsLibBarrelWhenBarrelsEnabled(t *testing.T) {
	wd := t.TempDir()
	writeRegistryFixture(t, wd, registryFixture{
		name:         componentWithHookName,
		dependencies: map[string]string{"@maratus/" + singleLevelLibDependencyName: "0.0.0"},
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
  "layout": {
    "kind": "flat",
    "barrel": true
  }
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
		t.Fatalf("execute add with lib barrel: %v", err)
	}

	assertFileExists(t, filepath.Join(wd, "tmp", "src", "lib", singleLevelLibDependencyName, "index.ts"))
	assertFileContains(
		t,
		filepath.Join(wd, "tmp", "src", "lib", singleLevelLibDependencyName, "index.ts"),
		`export * from './dependency'`,
	)
}

func TestAddNoArgsInNonInteractiveModeReturnsError(t *testing.T) {
	wd := t.TempDir()
	writeRegistryFixture(t, wd, componentOnlyFixture(componentOnlyName))
	writeConfig(t, wd, `{
  "srcDir": "./tmp/src",
  "componentsDir": "components",
  "layout": {
    "kind": "flat"
  }
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
	path := filepath.Join(wd, "maratus.json")
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
	writeFixtureRepoConfig(t, wd)
	writeFixtureManifest(t, wd)
}

func writeFixtureRepoConfig(t *testing.T, wd string) {
	t.Helper()

	writeFile(t, filepath.Join(wd, "repo.yml"), `workspaces:
  registry:
    path: registry
  packages:
    path: packages
`)
}

func writeFixtureManifest(t *testing.T, wd string) {
	t.Helper()

	entries, err := os.ReadDir(filepath.Join(wd, "registry"))
	if err != nil {
		t.Fatalf("read fixture registry: %v", err)
	}

	lines := []string{
		"{",
		"  \"version\": 1,",
		"  \"components\": {",
	}

	componentNames := make([]string, 0, len(entries))
	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}
		componentNames = append(componentNames, entry.Name())
	}
	sort.Strings(componentNames)

	for index, componentName := range componentNames {
		manifestPath := filepath.Join(wd, "registry", componentName, "package.json")
		data, err := os.ReadFile(manifestPath)
		if err != nil {
			t.Fatalf("read fixture package manifest: %v", err)
		}

		var manifest struct {
			Name    string `json:"name"`
			Version string `json:"version"`
		}
		if err := json.Unmarshal(data, &manifest); err != nil {
			t.Fatalf("unmarshal fixture package manifest: %v", err)
		}

		suffix := ","
		if index == len(componentNames)-1 {
			suffix = ""
		}

		lines = append(
			lines,
			"    \""+componentName+"\": {",
			"      \"name\": \""+componentName+"\",",
			"      \"package\": \""+manifest.Name+"\",",
			"      \"version\": \""+manifest.Version+"\"",
			"    }"+suffix,
		)
	}

	lines = append(
		lines,
		"  },",
		"  \"codemods\": {",
		"    \"rewrite-internal-imports\": {",
		"      \"category\": \"modify-package-imports\",",
		"      \"exportName\": \""+rewriteInternalImportsExport+"\",",
		"      \"package\": \"@maratus-codemod/rewrite-internal-imports\",",
		"      \"version\": \"0.1.0\"",
		"    },",
		"    \"rewrite-relative-imports\": {",
		"      \"category\": \"modify-file-imports\",",
		"      \"exportName\": \""+rewriteRelativeImportsExport+"\",",
		"      \"package\": \"@maratus-codemod/rewrite-relative-imports\",",
		"      \"version\": \"0.1.0\"",
		"    }",
		"  }",
		"}",
	)

	writeFile(
		t,
		filepath.Join(wd, "packages", "maratus-manifest", "dist", "index.json"),
		strings.Join(lines, "\n")+"\n",
	)
}

func writeInstalledManifest(
	t *testing.T,
	wd string,
	componentName string,
	packageName string,
	version string,
) {
	t.Helper()

	writeFile(
		t,
		filepath.Join(wd, "node_modules", "@maratus", "manifest", "dist", "index.json"),
		strings.Join([]string{
			"{",
			"  \"version\": 1,",
			"  \"components\": {",
			"    \"" + componentName + "\": {",
			"      \"name\": \"" + componentName + "\",",
			"      \"package\": \"" + packageName + "\",",
			"      \"version\": \"" + version + "\"",
			"    }",
			"  },",
			"  \"codemods\": {",
			"    \"rewrite-internal-imports\": {",
			"      \"category\": \"modify-package-imports\",",
			"      \"exportName\": \"" + rewriteInternalImportsExport + "\",",
			"      \"package\": \"@maratus-codemod/rewrite-internal-imports\",",
			"      \"version\": \"0.1.0\"",
			"    },",
			"    \"rewrite-relative-imports\": {",
			"      \"category\": \"modify-file-imports\",",
			"      \"exportName\": \"" + rewriteRelativeImportsExport + "\",",
			"      \"package\": \"@maratus-codemod/rewrite-relative-imports\",",
			"      \"version\": \"0.1.0\"",
			"    }",
			"  }",
			"}",
		}, "\n")+"\n",
	)
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
		"  \"name\": \"@maratus/" + fixture.name + "\",",
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

func writeInstalledRegistryFixture(t *testing.T, wd string, fixture registryFixture) {
	t.Helper()

	componentRootDir := filepath.Join(
		wd,
		"node_modules",
		"@maratus-registry",
		fixture.name,
	)
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
		buildInstalledRegistryPackageJSON(fixture),
	)
	writeStyleFiles(t, cssFileDir, fixture.cssFiles)
	writeStyleFiles(t, cssModulesDir, fixture.cssModules)
	writeStyleFiles(t, tailwindDir, fixture.tailwindCSS)
}

func buildInstalledRegistryPackageJSON(fixture registryFixture) string {
	lines := []string{
		"{",
		"  \"name\": \"@maratus-registry/" + fixture.name + "\",",
		"  \"version\": \"0.3.0\"",
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

func assertFileMissing(t *testing.T, path string) {
	t.Helper()
	if _, err := os.Stat(path); !os.IsNotExist(err) {
		t.Fatalf("expected file %s to be missing, got err=%v", path, err)
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

	parts := strings.Split(name, "-")
	var builder strings.Builder
	for _, part := range parts {
		if part == "" {
			continue
		}

		builder.WriteString(strings.ToUpper(part[:1]))
		if len(part) > 1 {
			builder.WriteString(part[1:])
		}
	}

	return builder.String()
}
