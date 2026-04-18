import type { ComponentPropsWithoutRef } from 'react'
import { afterEach, describe, expect, test } from 'bun:test'
import { cleanup, render, screen } from '@testing-library/react'
import { Button } from './Button'

afterEach(() => {
  cleanup()
})

function AnchorRoot(props: ComponentPropsWithoutRef<'a'>) {
  return (
    <a
      href="/settings"
      {...props}
    />
  )
}

describe(Button, () => {
  test('supports custom component roots through as', () => {
    render(<Button as={AnchorRoot}>Settings</Button>)

    const root = screen.getByRole('button', { name: 'Settings' })

    expect(root.tagName).toBe('A')
    expect(root).toHaveAttribute('href', '/settings')
    expect(root).toHaveAttribute('role', 'button')
    expect(root).toHaveAttribute('tabindex', '0')
  })
})
