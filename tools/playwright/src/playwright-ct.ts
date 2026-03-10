import { defineConfig } from "@playwright/experimental-ct-react"
import react from "@vitejs/plugin-react"

export function createPlaywrightCTConfig(testDir: string) {
  return defineConfig({
    testDir,
    use: {
      ctTemplateDir: "../../tools/playwright/template",
      ctCacheDir: "playwright/.cache",
      ctViteConfig: {
        plugins: [react()],
      },
    },
  })
}
