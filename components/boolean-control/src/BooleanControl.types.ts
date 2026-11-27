import type {
  FieldContextValue,
  FieldControlRenderProps,
  UseFieldControlOptions,
  ValidityHandlerProps,
} from '@maratus-component/field'
import type { ReactNode } from 'react'

export type BooleanControlMode = keyof BooleanControlModes

export type BooleanControlRole = 'checkbox' | 'switch'

// The native root is the default, so only a custom root names its mode.
type BooleanControlModes = {
  custom: {
    options: Omit<UseFieldControlOptions, 'aria-checked'> & {
      checked: boolean
      disabled?: boolean
      mode: 'custom'
      role: BooleanControlRole
    }
    result: UseCustomBooleanControlResult
  }
  native: {
    options: Omit<UseFieldControlOptions<HTMLInputElement>, 'aria-checked'> & {
      checked?: boolean
      disabled?: boolean
      mode?: 'native'
      role?: BooleanControlRole
    }
    result: UseNativeBooleanControlResult
  }
}

export type UseBooleanControlOptions<
  TMode extends BooleanControlMode = 'native',
> = BooleanControlModes[TMode]['options'] & { mode?: TMode }

export type UseBooleanControlResult<
  TMode extends BooleanControlMode = 'native',
> = BooleanControlModes[TMode]['result']

export type BooleanControlRootProps = FieldControlRenderProps &
  ValidityHandlerProps

export type NativeBooleanControlRenderProps = Omit<
  BooleanControlRootProps,
  'aria-checked' | 'aria-disabled' | 'aria-required'
> & {
  checked?: boolean
  disabled?: true
  name: string
  required?: true
  role?: 'switch'
  type: 'checkbox'
}

export type UseNativeBooleanControlResult = {
  booleanControlProps: NativeBooleanControlRenderProps
}

export type CustomBooleanControlRenderProps = BooleanControlRootProps & {
  'aria-checked': boolean
  'aria-labelledby': string
  role: BooleanControlRole
}

export type UseCustomBooleanControlResult = {
  booleanControlProps: CustomBooleanControlRenderProps
}

export type BooleanControlProps<TMode extends BooleanControlMode = 'native'> =
  UseBooleanControlOptions<TMode> & {
    children: (props: UseBooleanControlResult<TMode>) => ReactNode
  }

type BooleanControlInput = {
  controlProps: BooleanControlRootProps
  field: FieldContextValue
  isInteractionDisabled: boolean
}

export type NativeBooleanControlInput = BooleanControlInput & {
  checked?: boolean
  role?: BooleanControlRole
}

export type CustomBooleanControlInput = BooleanControlInput & {
  checked: boolean
  role: BooleanControlRole
}
