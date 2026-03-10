import type { StyleSpec } from "@arachne/build"

export const styleSpec: StyleSpec = {
  className: "arachne-separator",
  vars: {
    "--arachne-separator-color": "var(--arachne-border-color-subtle)",
    "--arachne-separator-thickness": "var(--arachne-border-width-x1)",
    "--arachne-separator-margin": "var(--arachne-space-x1) 0",
  },
  declarations: {
    "border-top-color": "var(--arachne-separator-color)",
    "border-top-width": "var(--arachne-separator-thickness)",
    margin: "var(--arachne-separator-margin)",
  },
}
