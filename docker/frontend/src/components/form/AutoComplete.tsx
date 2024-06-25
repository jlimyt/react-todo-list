import { Fragment, useState } from "react"
import { Combobox, Transition } from "@headlessui/react"
import { ArrowDropDownIcon, CheckIcon } from "@icons/index"
import { InputLabel } from "./Input"
import { Typography } from "components/Typography"
import { useTranslation } from "react-i18next"
import { splitErrorText } from "utils/FormUtil"

interface AutoCompleteList {
  id: number
  value: string
}

interface AutoCompleteProps {
  label?: string
  id: string
  placeholder?: string
  helperText?: string
  errorText?: string
  defaultValue?: AutoCompleteList
  options?: AutoCompleteList[]
}

function AutoComplete({
  label,
  id,
  placeholder,
  helperText,
  errorText,
  defaultValue,
  options,
}: AutoCompleteProps) {
  const [selected, setSelected] = useState(defaultValue)
  const [query, setQuery] = useState("")
  const { t } = useTranslation("validation")

  const filteredOptions =
    query === ""
      ? options
      : options?.filter(option =>
          option.value
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, "")),
        )

  const formattedErrorText = splitErrorText(errorText)

  return (
    <div>
      <InputLabel id={id} label={label} />
      <Combobox
        defaultValue={defaultValue}
        value={selected}
        onChange={setSelected}
        name={id}
      >
        <div className="relative mt-1">
          <div className="relative w-full cursor-default rounded-sm bg-white text-left">
            <Combobox.Input
              className="w-full py-2 pl-3 pr-10 border-fuscousGray-700 rounded-sm text-outerSpace-950 focus:outline-0 focus:border-purpleHeart-500 focus:ring-purpleHeart-500 focus:ring-2"
              displayValue={(option: AutoCompleteList) => option?.value}
              onChange={event => setQuery(event.target.value)}
              style={{
                fontWeight: "normal",
                fontSize: "1.125rem",
                lineHeight: "1.75rem",
              }}
              placeholder={placeholder}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-4">
              <ArrowDropDownIcon
                className="fill-fuscousGray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-sm bg-white py-1 shadow focus:outline-none">
              {filteredOptions?.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-fuscousGray-700">
                  Nothing found.
                </div>
              ) : (
                filteredOptions?.map(person => (
                  <Combobox.Option
                    key={person.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active
                          ? "bg-purpleHeart-100 text-purpleHeart-900"
                          : "text-fuscousGray-900"
                      }`
                    }
                    value={person}
                  >
                    {({ selected }) => (
                      <>
                        <Typography
                          variant={selected ? "mediumBody1" : "body1"}
                          className="truncate"
                        >
                          {person.value}
                        </Typography>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-2`}
                          >
                            <CheckIcon
                              className="fill-purpleHeart-600"
                              aria-hidden="true"
                            />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      {errorText && (
        <p
          key={id + "_errorText"}
          className={
            "hidden peer-invalid:text-cinnabar-500 peer-invalid:block mt-1"
          }
          style={{
            fontWeight: "normal",
            fontSize: "1rem",
            lineHeight: "1.5rem",
          }}
        >
          {t(formattedErrorText.errorMsg) + formattedErrorText.variable}
        </p>
      )}

      {helperText && (
        <p
          key={id + "_helperText"}
          className={"block text-fuscousGray-700 peer-invalid:hidden mt-1"}
          style={{
            fontWeight: "normal",
            fontSize: "1rem",
            lineHeight: "1.5rem",
          }}
        >
          {helperText}
        </p>
      )}
    </div>
  )
}

export default AutoComplete
