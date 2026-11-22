// Declared in this module only, so consumers need no Node type definitions.
// Bundlers replace process.env.NODE_ENV. Without a bundler or a process
// global, stay silent rather than warn in production.
declare const process: { env: { NODE_ENV?: string } } | undefined

export function isDevelopment(): boolean {
  return typeof process !== 'undefined' && process.env.NODE_ENV !== 'production'
}
