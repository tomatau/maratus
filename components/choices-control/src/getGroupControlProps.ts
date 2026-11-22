import type { GroupControlRenderProps } from './ChoicesControl.types'
import type {
  FieldContextValue,
  FieldControlRenderProps,
} from '@maratus-component/field'

// ARIA 1.2 deprecates aria-invalid and aria-errormessage on group, and axe
// rejects aria-required and aria-readonly there, so the error id moves into
// aria-describedby and the rest is dropped.
export function getGroupControlProps(
  field: FieldContextValue,
  fieldControlProps: FieldControlRenderProps,
): GroupControlRenderProps {
  const groupProps = { ...fieldControlProps }

  delete groupProps['aria-errormessage']
  delete groupProps['aria-invalid']
  delete groupProps['aria-readonly']
  delete groupProps['aria-required']

  return {
    ...groupProps,
    'aria-describedby': getGroupDescribedBy(field, fieldControlProps),
    'aria-labelledby': field.labelId,
    role: 'group',
  }
}

function getGroupDescribedBy(
  field: FieldContextValue,
  fieldControlProps: FieldControlRenderProps,
): string | undefined {
  const errorId = field.visibleErrors.length > 0 ? field.errorId : undefined
  const ids = [fieldControlProps['aria-describedby'], errorId].filter(Boolean)

  return ids.length > 0 ? ids.join(' ') : undefined
}
