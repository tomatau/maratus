import { defineConfig } from '@playwright/experimental-ct-react'
import react from '@vitejs/plugin-react'

export function createPlaywrightCTConfig(testDir: string) {
  return defineConfig({
    testDir,
    testMatch: ['**/*.spec.{ts,tsx}'],
    use: {
      ctTemplateDir: '../../tools/playwright/template',
      ctViteConfig: {
        plugins: [react()],
        build: {
          emptyOutDir: true,
        },
      },
    },
  })
}
