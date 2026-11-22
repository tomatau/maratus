import { isDevelopment } from './isDevelopment'

export function warnInDevelopment(message: string): void {
  if (isDevelopment()) console.warn(message)
}
