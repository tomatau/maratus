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

export type ChoiceControlMode = keyof ChoiceControlModes

type ChoiceControlModes = {
  listbox: {
    options: UseFieldControlOptions
    result: UseListboxControlResult
  }
  'radio-items': {
    options: UseFieldControlOptions
    result: UseRadioItemsControlResult
  }
  radios: {
    options: UseFieldControlOptions<HTMLInputElement>
    result: UseRadiosControlResult
  }
  select: {
    options: UseFieldControlOptions<HTMLSelectElement>
    result: UseSelectControlResult
  }
}

export type ChoiceControlDisabledBehavior = 'focusable' | 'native'

export type UseChoiceControlOptions<
  TMode extends ChoiceControlMode = ChoiceControlMode,
> = ChoiceControlModes[TMode]['options'] & {
  disabledBehavior?: ChoiceControlDisabledBehavior
  mode: TMode
}

export type UseChoiceControlResult<
  TMode extends ChoiceControlMode = ChoiceControlMode,
> = ChoiceControlModes[TMode]['result']

export type ChoiceControlBuilder<TMode extends ChoiceControlMode> = (input: {
  disabledBehavior: ChoiceControlDisabledBehavior
  field: FieldContextValue
  fieldControl: UseFieldControlResult
}) => UseChoiceControlResult<TMode>

export type RadiosControlRenderProps = FieldControlRenderProps & {
  'aria-labelledby': string
  role: 'radiogroup'
}

export type RadioInputOptions = Omit<
  ComponentPropsWithRef<'input'>,
  | 'aria-disabled'
  | 'disabled'
  | 'name'
  | 'readOnly'
  | 'required'
  | 'type'
  | 'value'
  | keyof ValidityHandlerProps
> & {
  disabled?: boolean
  value: string
}

export type RadioInputRenderProps = ComponentPropsWithRef<'input'> &
  ValidityHandlerProps & {
    'aria-disabled'?: true
    disabled?: true
    name: string
    required?: true
    type: 'radio'
    value: string
  }

export type UseRadiosControlResult = {
  choiceControlProps: RadiosControlRenderProps
  getChoiceInputProps: (options: RadioInputOptions) => RadioInputRenderProps
}

export type RadioItemsControlRenderProps = FieldControlRenderProps &
  ValidityHandlerProps & {
    'aria-labelledby': string
    role: 'radiogroup'
  }

export type RadioItemOptions = Omit<
  CustomItemProps,
  'aria-checked' | 'aria-disabled' | 'aria-required' | 'role'
> & {
  disabled?: boolean
  isSelected: boolean
}

export type RadioItemRenderProps = CustomItemRenderProps & {
  'aria-checked': boolean
  'aria-disabled'?: true
  role: 'radio'
}

export type UseRadioItemsControlResult = {
  choiceControlProps: RadioItemsControlRenderProps
  getChoiceItemProps: (options: RadioItemOptions) => RadioItemRenderProps
}

export type SelectControlRenderProps = Omit<
  FieldControlRenderProps,
  'aria-disabled' | 'aria-required'
> &
  ValidityHandlerProps & {
    disabled?: true
    name: string
    required?: true
  }

export type UseSelectControlResult = {
  choiceControlProps: SelectControlRenderProps
}

export type ListboxControlRenderProps = FieldControlRenderProps &
  ValidityHandlerProps & {
    'aria-labelledby': string
    role: 'listbox'
  }

export type ListboxOptionOptions = Omit<
  CustomItemProps,
  'aria-disabled' | 'aria-selected' | 'role'
> & {
  disabled?: boolean
  isSelected: boolean
}

export type ListboxOptionRenderProps = CustomItemRenderProps & {
  'aria-disabled'?: true
  'aria-selected': boolean
  role: 'option'
}

export type UseListboxControlResult = {
  choiceControlProps: ListboxControlRenderProps
  getChoiceItemProps: (
    options: ListboxOptionOptions,
  ) => ListboxOptionRenderProps
}

export type ChoiceControlProps<
  TMode extends ChoiceControlMode = ChoiceControlMode,
> = UseChoiceControlOptions<TMode> & {
  children: (props: UseChoiceControlResult<TMode>) => ReactNode
}
