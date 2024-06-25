import { forwardRef } from "react"
import type { ReactNode } from "react"
import { Field, type FieldRenderProps } from "react-final-form"
import Checkbox from "./Checkbox"
import { Typography } from "components/Typography"

type Props = Pick<Partial<FieldRenderProps<boolean, any>>, "input" | "meta">

interface CheckboxFieldProps {
  id: string
  value: string
  description: ReactNode
  color?: string
}

interface CheckboxGroupProps extends Props {
  name: string
  title: string
  list: CheckboxFieldProps[]
  disabled?: boolean
  variant?: "checkbox" | "box"
}

type CheckboxType = HTMLInputElement[]

const CheckboxGroup = forwardRef<CheckboxType, CheckboxGroupProps>(
  ({
    name,
    title,
    list,
    disabled = false,
    variant = "checkbox",
  }: CheckboxGroupProps) => {
    let divClassNameMap = ""
    switch (variant) {
      case "checkbox": {
        divClassNameMap = "flex flex-wrap gap-2"
        break
      }
      case "box": {
        divClassNameMap = "inline-flex gap-2 mt-2"
        break
      }
    }
    return (
      <div>
        <Typography variant="mediumBody3" className="text-fuscousGray-700 mb-1">
          {title}
        </Typography>
        <div className={divClassNameMap}>
          {list.map(x => {
            return (
              <Field name={name} type="checkbox" value={x.value}>
                {({ input }) => (
                  <Checkbox
                    id={x.id}
                    description={x.description}
                    disabled={disabled}
                    {...input}
                    variant={variant}
                    color={x.color}
                  />
                )}
              </Field>
            )
          })}
        </div>
      </div>
    )
  },
)

export default CheckboxGroup
