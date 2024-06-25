import { forwardRef, Fragment } from "react"
import { Listbox, Transition } from "@headlessui/react"
import { InputLabel } from "./Input"
import { Typography } from "components/Typography"
import { ArrowDropDownIcon, CheckIcon } from "@icons/index"
import { useTranslation } from "react-i18next"
import { splitErrorText } from "utils/FormUtil"
interface OptionListProps {
  value: number | string | null | boolean
  display: number | string
  unavailable?: boolean
}

interface SelectProps {
  label?: string
  id: string
  helperText?: string
  errorText?: string
  defaultValue?: OptionListProps
  value?: OptionListProps
  options: OptionListProps[]
  onChange?: (value: OptionListProps) => void
  size?: "small" | "medium"
  gutter?: boolean
  multiple?: boolean
  placeholder?: string
  disabled?: boolean
  isError?: boolean
}

type SelectRef = HTMLSelectElement

const Select = forwardRef<SelectRef, SelectProps>(
  (
    {
      label,
      id,
      helperText,
      errorText,
      defaultValue,
      value,
      options = [],
      onChange,
      size,
      gutter = true,
      multiple = false,
      placeholder,
      disabled = false,
      isError,
    }: SelectProps,
    ref,
  ) => {
    const defaultOption: OptionListProps = {
      value: null,
      display: "---",
      unavailable: multiple,
    }
    // for controlled select
    // const [selected, setSelected] = useState(people[0])
    // add value={selected} onChange={setSelected} in Listbox

    const { t } = useTranslation("validation")
    const formattedErrorText = splitErrorText(errorText)
    return (
      <div>
        {label && <InputLabel id={id} label={label} />}
        <Listbox
          ref={ref}
          name={id}
          defaultValue={defaultValue}
          value={multiple ? value || [] : value}
          by={"value"}
          onChange={onChange}
          multiple={multiple}
          disabled={disabled}
        >
          <div className={`relative ${label ? "mt-1" : ""}`}>
            <Listbox.Button
              className={`relative w-full cursor-default border rounded-sm bg-white ${size == "small" ? "py-1.5" : "py-2"} pl-3 pr-10 text-left focus:outline-0 focus:border-purpleHeart-500 focus:ring-purpleHeart-500 focus:ring-2 ${isError ? "border-cinnabar-500 ring-cinnabar-500 ring-2" : "border-fuscousGray-700"}`}
            >
              {({ value }) => {
                const displayValue = multiple
                  ? value.length > 0 &&
                    value?.map((e: OptionListProps) => e.display)?.join(", ")
                  : value?.display
                const isNotEmptyValue = multiple ? value.length > 0 : value

                return (
                  <>
                    <Typography
                      variant={size == "small" ? "body3" : "body1"}
                      className={`truncate ${value ? "" : "text-fuscousGray-300"}`}
                    >
                      {isNotEmptyValue
                        ? displayValue
                        : placeholder
                          ? placeholder
                          : "---"}
                    </Typography>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                      <ArrowDropDownIcon
                        className="fill-outerSpace-950"
                        aria-hidden="true"
                      />
                    </span>
                  </>
                )
              }}
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded bg-white py-1 shadow focus:outline-none focus:min-w-full focus:w-auto">
                {[defaultOption, ...options].map((option, optionId) => (
                  <Listbox.Option
                    key={optionId}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active
                          ? "bg-purpleHeart-100 text-purpleHeart-900"
                          : "text-fuscousGray-900"
                      }`
                    }
                    value={option}
                    disabled={option?.unavailable}
                  >
                    {({ selected }) => (
                      <>
                        <Typography
                          variant={
                            selected
                              ? size == "small"
                                ? "mediumBody3"
                                : "mediumBody2"
                              : size == "small"
                                ? "body3"
                                : "body2"
                          }
                          className={`truncate ${option?.unavailable ? "opacity-75" : ""}`}
                        >
                          {option.display}
                        </Typography>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                            <CheckIcon
                              className="fill-purpleHeart-600 w-5 h-5"
                              aria-hidden="true"
                            />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
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

export default Select
