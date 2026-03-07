import { afterAll, expect, test } from "bun:test"
import { mkdirSync, rmSync } from "node:fs"
import { dirname, join } from "node:path"

const outFile = join(import.meta.dir, "..", "tmp-test", "arachne")

afterAll(() => {
  rmSync(join(import.meta.dir, "..", "tmp-test"), {
    recursive: true,
    force: true,
  })
})

test("compiled binary prints Hello, world", async () => {
  mkdirSync(dirname(outFile), { recursive: true })

  const build = Bun.spawn(
    ["bun", "build", "src/index.ts", "--compile", "--outfile", outFile],
    {
      cwd: join(import.meta.dir, ".."),
      stdout: "pipe",
      stderr: "pipe",
    },
  )

  const buildExit = await build.exited
  expect(buildExit).toBe(0)

  const run = Bun.spawn([outFile], {
    cwd: join(import.meta.dir, ".."),
    stdout: "pipe",
    stderr: "pipe",
  })

  const stdout = await new Response(run.stdout).text()
  const runExit = await run.exited

  expect(runExit).toBe(0)
  expect(stdout.trim()).toBe("Hello, world")
})
