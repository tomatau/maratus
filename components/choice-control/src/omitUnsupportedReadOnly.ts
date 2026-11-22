import { omitPropWithWarning } from '@maratus-lib/props'

// HTML readonly does not apply to select, radio, or checkbox controls.
export function omitUnsupportedReadOnly<TProps extends object>(
  control: string,
  props: TProps,
): Omit<TProps, 'readOnly'> {
  return omitPropWithWarning(
    props,
    'readOnly',
    `${control}: HTML readonly does not apply to this control. Use FieldRoot isReadOnly instead.`,
  )
}
