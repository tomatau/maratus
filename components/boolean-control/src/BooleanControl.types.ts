import type {
  FieldControlRenderProps,
  ValidityHandlerProps,
} from '@maratus-component/field'
import type { AriaAttributes, ReactNode } from 'react'

export type BooleanControlRole = 'checkbox' | 'switch'

export type BooleanControlRenderProps = FieldControlRenderProps &
  ValidityHandlerProps & {
    'aria-checked'?: AriaAttributes['aria-checked']
    checked?: boolean
    disabled?: boolean
    name?: string
    required?: boolean
    role?: BooleanControlRole
    type?: 'checkbox'
  }

export type BooleanControlRenderArgs = {
  booleanControlProps: BooleanControlRenderProps
}

export type UseBooleanControlOptions = Omit<
  BooleanControlRenderProps,
  | 'aria-busy'
  | 'aria-checked'
  | 'aria-describedby'
  | 'aria-disabled'
  | 'aria-errormessage'
  | 'aria-invalid'
  | 'aria-readonly'
  | 'aria-required'
  | 'children'
  | 'data-loading'
  | 'disabled'
  | 'id'
  | 'name'
  | 'required'
  | 'role'
  | 'type'
  | keyof ValidityHandlerProps
> &
  Partial<ValidityHandlerProps> & {
    role?: BooleanControlRole
  }

export type UseBooleanControlResult = {
  booleanControlProps: BooleanControlRenderProps
}

export type BooleanControlProps = UseBooleanControlOptions & {
  children: (props: BooleanControlRenderArgs) => ReactNode
}
