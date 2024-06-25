import { forwardRef } from "react"
import type { FocusEvent, HTMLInputTypeAttribute, ReactNode } from "react"
import type { FieldRenderProps } from "react-final-form"
import { useTranslation } from "react-i18next"
import { splitErrorText } from "utils/FormUtil"

type Props = Pick<Partial<FieldRenderProps<string, any>>, "input" | "meta">

interface InputProps extends Props {
  label?: string
  id: string
  type?: HTMLInputTypeAttribute
  placeholder?: string
  pattern?: string
  helperText?: string
  errorText?: string
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void
  defaultValue?: string
  gutter?: boolean
  disabled?: boolean
  prefix?: ReactNode
  isError?: boolean
}

type InputRef = HTMLInputElement

interface InputLabelProps {
  id: string
  label?: string
}

export const InputLabel = ({ id, label }: InputLabelProps) => {
  return (
    <label
      htmlFor={id}
      className="block text-fuscousGray-700 mb-1"
      style={{
        fontWeight: "500",
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
      }}
    >
      {label}
    </label>
  )
}

const Input = forwardRef<InputRef, InputProps>(
  (
    {
      label,
      id,
      type = "text",
      placeholder,
      pattern,
      helperText,
      errorText,
      onBlur,
      defaultValue,
      gutter = true,
      meta,
      disabled = false,
      prefix,
      isError,
      ...rest
    }: InputProps,
    ref,
  ) => {
    const { t } = useTranslation("validation")
    const formattedErrorText = splitErrorText(errorText)

    return (
      <div>
        {label ? <InputLabel id={id} label={label} /> : null}
        <div className="relative">
          <div className="absolute ml-2 h-full content-center">
            {prefix && prefix}
          </div>
          <input
            {...rest}
            type={type}
            name={null || id}
            id={id}
            key={id}
            pattern={pattern}
            placeholder={placeholder}
            className={`${prefix ? "pl-8" : ""} block w-full rounded-sm bg-transparent placeholder-current focus:outline-0 focus:border-purpleHeart-500 focus:ring-purpleHeart-500 focus:ring-2 ${isError ? "border-cinnabar-500 ring-cinnabar-500 ring-2" : "border-fuscousGray-700"}`}
            style={{
              fontWeight: "normal",
              fontSize: "1.125rem",
              lineHeight: "1.75rem",
            }}
            defaultValue={defaultValue}
            onBlur={onBlur}
            autoComplete="off"
            ref={ref}
            disabled={disabled}
          />
        </div>
        {isError
          ? errorText && (
              <p
                key={id + "_errorText"}
                className={"text-cinnabar-500 block mt-1"}
                style={{
                  fontWeight: "normal",
                  fontSize: "1rem",
                  lineHeight: "1.5rem",
                }}
              >
                {t(formattedErrorText.errorMsg) + formattedErrorText.variable}
              </p>
            )
          : helperText && (
              <p
                key={id + "_helperText"}
                className={"block text-fuscousGray-700 mt-1"}
                style={{
                  fontWeight: "normal",
                  fontSize: "1rem",
                  lineHeight: "1.5rem",
                }}
              >
                {helperText}
              </p>
            )}
        {gutter && <br />}
      </div>
    )
  },
)

export default Input
