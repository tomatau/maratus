import { useBooleanControl } from '.'

// GPRD-004 useBooleanControl returns named prop bags
export const RESULT_KEYS: Record<
  keyof ReturnType<typeof useBooleanControl>,
  true
> = {
  booleanControlProps: true,
}

// GPRD-003 useBooleanControl defaults to the native root
export const DEFAULT_MODE_TYPE = (): 'checkbox' =>
  useBooleanControl().booleanControlProps.type

// PRD-002 useBooleanControl takes an optional role on a native root
export const NATIVE_SWITCH = () => useBooleanControl({ role: 'switch' })

// PRD-002 useBooleanControl requires a role on a custom root
export const CUSTOM_ROOT = () =>
  useBooleanControl({ checked: false, mode: 'custom', role: 'checkbox' })

// PRD-002 rejects a custom root without a role
export const CUSTOM_ROOT_WITHOUT_ROLE = () =>
  // @ts-expect-error role is required on a custom root
  useBooleanControl({ checked: false, mode: 'custom' })

// PRD-005 rejects a custom root without a checked state
export const CUSTOM_ROOT_WITHOUT_CHECKED = () =>
  // @ts-expect-error checked is required on a custom root
  useBooleanControl({ mode: 'custom', role: 'checkbox' })
