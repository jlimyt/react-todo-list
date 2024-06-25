import { forwardRef } from "react"
import type { ReactNode } from "react"

interface RadioProps {
  id: string
  name: string
  value: string
  description: ReactNode
  defaultChecked?: boolean
  gutter?: boolean
}

type RadioType = HTMLInputElement

const Radio = forwardRef<RadioType, RadioProps>(
  (
    { id, name, value, description, defaultChecked, gutter = true }: RadioProps,
    ref,
  ) => {
    return (
      <div>
        <div className="flex items-center">
          <input
            id={id}
            name={name}
            value={value}
            type="radio"
            defaultChecked={defaultChecked}
            ref={ref}
            className="text-purpleHeart-500 bg-fuscousGray-50 border-fuscousGray-300 focus:ring-purpleHeart-500 focus:ring-2"
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
        {gutter && <br />}
      </div>
    )
  },
)

export default Radio
