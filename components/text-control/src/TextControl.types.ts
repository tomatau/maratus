import type {
  FieldControlRenderProps,
  WithValidity,
} from '@maratus-component/field'
import type { ReactNode } from 'react'

export type TextControlRole = 'combobox' | 'searchbox' | 'textbox'

export type TextControlRenderProps = FieldControlRenderProps & {
  disabled?: boolean
  name?: string
  readOnly?: boolean
  required?: boolean
  role?: TextControlRole
}

export type TextControlRenderArgs = {
  textControlProps: TextControlRenderProps
  withValidity: WithValidity
}

export type UseTextControlOptions = Omit<
  TextControlRenderProps,
  | 'aria-describedby'
  | 'aria-busy'
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
  | 'readOnly'
  | 'required'
  | 'role'
> & {
  role?: TextControlRole
}

export type UseTextControlResult = {
  textControlProps: TextControlRenderProps
  withValidity: WithValidity
}

export type TextControlProps = UseTextControlOptions & {
  children: (props: TextControlRenderArgs) => ReactNode
}
