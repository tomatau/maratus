import { describe, expect, test } from 'bun:test'
import { render } from '@testing-library/react'
import { Link } from './Link'

describe(Link, () => {
  test('renders a native element', () => {
    const { container } = render(<Link />)

    expect(container.querySelector('a')).not.toBeNull()
  })
})
