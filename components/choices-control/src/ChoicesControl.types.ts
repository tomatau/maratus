import type {
  FieldContextValue,
  FieldControlRenderProps,
  UseFieldControlOptions,
  UseFieldControlResult,
  ValidityHandlerProps,
} from '@maratus-component/field'
import type {
  ComponentPropsWithRef,
  HTMLAttributes,
  ReactNode,
  Ref,
  RefCallback,
} from 'react'

// Custom items can be any element and pass a consumer ref through.
// The getter turns it into a callback that fits any element.
type CustomItemProps = HTMLAttributes<HTMLElement> & {
  ref?: Ref<HTMLElement>
}

type CustomItemRenderProps = HTMLAttributes<HTMLElement> & {
  ref?: RefCallback<HTMLElement>
}

export type ChoicesControlMode = keyof ChoicesControlModes

type ChoicesControlModes = {
  'checkbox-items': {
    options: UseFieldControlOptions
    result: UseCheckboxItemsControlResult
  }
  checkboxes: {
    options: UseFieldControlOptions<HTMLInputElement>
    result: UseCheckboxesControlResult
  }
  listbox: {
    options: UseFieldControlOptions
    result: UseMultiListboxControlResult
  }
}

export type UseChoicesControlOptions<
  TMode extends ChoicesControlMode = ChoicesControlMode,
> = ChoicesControlModes[TMode]['options'] & { mode: TMode }

export type UseChoicesControlResult<
  TMode extends ChoicesControlMode = ChoicesControlMode,
> = ChoicesControlModes[TMode]['result']

export type ChoicesControlBuilder<TMode extends ChoicesControlMode> = (input: {
  field: FieldContextValue
  fieldControl: UseFieldControlResult
}) => UseChoicesControlResult<TMode>

export type GroupControlRenderProps = Omit<
  FieldControlRenderProps,
  'aria-errormessage' | 'aria-invalid' | 'aria-readonly' | 'aria-required'
> & {
  'aria-labelledby': string
  role: 'group'
}

export type CheckboxInputOptions = Omit<
  ComponentPropsWithRef<'input'>,
  | 'aria-readonly'
  | 'disabled'
  | 'readOnly'
  | 'type'
  | 'value'
  | keyof ValidityHandlerProps
> & {
  isDisabled?: boolean
  value: string
}

export type CheckboxInputRenderProps = ComponentPropsWithRef<'input'> &
  ValidityHandlerProps & {
    'aria-readonly'?: true
    disabled?: true
    name: string
    type: 'checkbox'
    value: string
  }

export type UseCheckboxesControlResult = {
  choicesControlProps: GroupControlRenderProps
  getChoicesInputProps: (
    options: CheckboxInputOptions,
  ) => CheckboxInputRenderProps
}

export type CheckboxItemOptions = Omit<
  CustomItemProps,
  'aria-checked' | 'aria-disabled' | 'aria-readonly' | 'aria-required' | 'role'
> & {
  isDisabled?: boolean
  isSelected: boolean
}

export type CheckboxItemRenderProps = CustomItemRenderProps & {
  'aria-checked': boolean
  'aria-disabled'?: true
  'aria-readonly'?: true
  role: 'checkbox'
}

export type UseCheckboxItemsControlResult = {
  choicesControlProps: GroupControlRenderProps & ValidityHandlerProps
  getChoicesItemProps: (options: CheckboxItemOptions) => CheckboxItemRenderProps
}

export type MultiListboxControlRenderProps = FieldControlRenderProps &
  ValidityHandlerProps & {
    'aria-labelledby': string
    'aria-multiselectable': true
    role: 'listbox'
  }

export type ListboxOptionOptions = Omit<
  CustomItemProps,
  'aria-disabled' | 'aria-selected' | 'role'
> & {
  isDisabled?: boolean
  isSelected: boolean
}

export type ListboxOptionRenderProps = CustomItemRenderProps & {
  'aria-disabled'?: true
  'aria-selected': boolean
  role: 'option'
}

export type UseMultiListboxControlResult = {
  choicesControlProps: MultiListboxControlRenderProps
  getChoicesItemProps: (
    options: ListboxOptionOptions,
  ) => ListboxOptionRenderProps
}

export type ChoicesControlProps<
  TMode extends ChoicesControlMode = ChoicesControlMode,
> = UseChoicesControlOptions<TMode> & {
  children: (props: UseChoicesControlResult<TMode>) => ReactNode
}
