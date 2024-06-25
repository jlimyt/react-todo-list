import { Typography } from "components/Typography"
import { forwardRef } from "react"
import type { ChangeEvent, ReactNode } from "react"
import type { FieldInputProps } from "react-final-form"

type Props = Partial<FieldInputProps<any, HTMLElement>>

interface CheckboxProps extends Props {
  id: string
  name?: string
  value: string
  description: ReactNode
  defaultChecked?: boolean
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  gutter?: boolean
  disabled?: boolean
  variant?: "checkbox" | "box"
  color?: string
}

type CheckboxType = HTMLInputElement

const Checkbox = forwardRef<CheckboxType, CheckboxProps>(
  (
    {
      id,
      name,
      value,
      description,
      defaultChecked,
      onChange,
      gutter = true,
      meta,
      disabled = false,
      variant = "checkbox",
      color,
      ...rest
    }: CheckboxProps,
    ref,
  ) => {
    return (
      <div>
        {variant === "checkbox" && (
          <div className="flex items-center">
            <input
              disabled={disabled}
              {...rest}
              id={id}
              name={name || id}
              value={value}
              type="checkbox"
              onChange={onChange}
              defaultChecked={defaultChecked}
              ref={ref}
              className="w-5 h-5 text-purpleHeart-500 bg-fuscousGray-50 border-fuscousGray-300 rounded-sm focus:ring-purpleHeart-500 focus:ring-2"
            />
            <label
              htmlFor={id}
              className="ms-2 block text-fuscousGray-700"
              style={{
                fontWeight: "normal",
                fontSize: "1rem",
                lineHeight: "1.5rem",
              }}
            >
              {description}
            </label>
          </div>
        )}
        {variant === "box" && (
          <label>
            <Typography
              variant="mediumBody3"
              className="rounded-sm px-2 py-1 flex w-fit text-white"
              style={{ backgroundColor: rest?.checked ? color : "#D9D9D9" }}
            >
              {description}
            </Typography>
            <input
              disabled={disabled}
              {...rest}
              id={id}
              name={name || id}
              value={value}
              type="checkbox"
              onChange={onChange}
              defaultChecked={defaultChecked}
              ref={ref}
              className={`w-5 h-5 hidden checked:bg-${color} checked:text-white rounded-sm px-2 py-1 flex w-fit`}
            />
          </label>
        )}
        {gutter && <br />}
      </div>
    )
  },
)

export default Checkbox
