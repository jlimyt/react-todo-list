import { forwardRef } from "react"
import { InputLabel } from "./Input"
import type { FieldRenderProps } from "react-final-form"
import { useTranslation } from "react-i18next"
import { splitErrorText } from "utils/FormUtil"

type Props = Pick<Partial<FieldRenderProps<string, any>>, "input" | "meta">

interface TextareaProps extends Props {
  label?: string
  id: string
  placeholder?: string
  helperText?: string
  errorText?: string
  defaultValue?: string
  rows?: number
  gutter?: boolean
  isError?: boolean
}

type TextareaRef = HTMLTextAreaElement

const Textarea = forwardRef<TextareaRef, TextareaProps>(
  (
    {
      label,
      id,
      placeholder,
      helperText,
      errorText,
      defaultValue,
      rows,
      gutter = true,
      meta,
      isError,
      ...rest
    }: TextareaProps,
    ref,
  ) => {
    const { t } = useTranslation("validation")
    const formattedErrorText = splitErrorText(errorText)
    return (
      <div>
        {label ? <InputLabel id={id} label={label} /> : null}
        <textarea
          {...rest}
          name={null || id}
          id={id}
          key={id}
          placeholder={placeholder}
          className={`peer block w-full rounded-sm bg-transparent placeholder-current focus:outline-0 focus:border-purpleHeart-500 focus:ring-purpleHeart-500 focus:ring-2 ${isError ? "border-cinnabar-500 ring-cinnabar-500 ring-2" : "border-fuscousGray-700"}`}
          style={{
            fontWeight: "normal",
            fontSize: "1.125rem",
            lineHeight: "1.75rem",
          }}
          defaultValue={defaultValue}
          autoComplete="off"
          rows={rows}
          ref={ref}
        />
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

export default Textarea
