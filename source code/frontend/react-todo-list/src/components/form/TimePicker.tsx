import { useEffect, useRef, useState } from "react"
import Input, { InputLabel } from "./Input"
import dayjs from "dayjs"
import type { Dayjs } from "dayjs"
import { AccessTimeIcon } from "@icons/index"
import customParseFormat from "dayjs/plugin/customParseFormat"
import { Typography } from "components/Typography"
import { TIME_PATTERN, TIME_PATTERN_STRING } from "@util/constants"
import type { FocusEvent } from "react"
import type { FieldInputProps } from "react-final-form"
import { useOutsideClick } from "utils/LayoutUtil"

type Props = Partial<FieldInputProps<any, HTMLElement>>

interface TimePickerProps extends Props {
  label?: string
  id: string
  placeholder?: string
  helperText?: string
  errorText?: string
  minDate?: Dayjs
  maxDate?: Dayjs
  defaultValue?: string
  inputFormFn?: any
  gutter?: boolean
  isError?: boolean
}

function TimePicker({
  label,
  id,
  placeholder,
  helperText,
  errorText,
  defaultValue = "",
  inputFormFn,
  gutter = true,
  isError,
  ...input
}: TimePickerProps) {
  dayjs.extend(customParseFormat)

  const hourArr = Array.from({ length: 24 }).map((_e, i) =>
    String(i).padStart(2, "0"),
  )
  const minuteArr = Array.from({ length: 60 }).map((_e, i) =>
    String(i).padStart(2, "0"),
  )

  const initTime = defaultValue
    ? defaultValue
    : input.value
      ? input.value
      : "00:00"
  const [time, setTime] = useState(initTime)

  const handleClickOutside = () => {
    closeTimePicker()
  }

  const ref = useOutsideClick(handleClickOutside)

  let textInput = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (textInput.current) {
      if (defaultValue == "" && input.value != textInput.current.value) {
        inputFormFn?.setValue(id, defaultValue)
        textInput.current.value = defaultValue
      } else {
        inputFormFn?.setValue(id, time)
        textInput.current.value = time
      }
    }
  }, [time])

  function closeTimePicker() {
    if (ref.current) {
      ref.current.style.display = "none"
    }
  }

  function changeTime(unit: "HOUR" | "MINUTE", value: string) {
    if (textInput.current) {
      switch (unit) {
        case "HOUR":
          if (TIME_PATTERN.test(textInput.current.value)) {
            setTime(textInput.current.value.replace(/\S{2}/, value))
          } else {
            setTime(value + ":00")
          }
          break
        case "MINUTE":
          if (TIME_PATTERN.test(textInput.current.value)) {
            setTime(textInput.current.value.replace(/\S{2}$/, value))
          } else {
            setTime("00:" + value)
          }
          break
        default:
          break
      }
    }
  }

  return (
    <div className="relative">
      <div>
        <InputLabel id={id} label={label} />
        <div className="relative rounded-sm">
          <Input
            {...input}
            type={"text"}
            id={id}
            placeholder={placeholder}
            pattern={TIME_PATTERN_STRING}
            onBlur={(e: FocusEvent<HTMLInputElement>) => {
              if (e.target.validity.valid && e.target.value != "") {
                setTime(e.target.value)
              }
              input.onBlur && input.onBlur(e)
            }}
            errorText={errorText}
            helperText={helperText}
            defaultValue={defaultValue}
            ref={textInput}
            gutter={false}
            isError={isError}
          />
          <div className="absolute inset-y-0 right-0 flex mt-3">
            <AccessTimeIcon
              className="fill-outerSpace-950 mr-4 cursor-pointer"
              onClick={e => {
                e.stopPropagation()
                if (ref.current && ref.current.style.display == "none") {
                  if (
                    document.getElementsByClassName("time-picker-selection-box")
                      .length > 1
                  ) {
                    for (const element of document.getElementsByClassName(
                      "time-picker-selection-box",
                    ) as HTMLCollectionOf<HTMLElement>) {
                      if (element.style.display == "block") {
                        element.style.display = "none"
                      }
                    }
                  }
                  ref.current.style.display = "block"
                  document
                    .getElementById("hour-" + time.split(":")[0])
                    ?.scrollIntoView({ block: "nearest" })
                  document
                    .getElementById("minute-" + time.split(":")[1])
                    ?.scrollIntoView({ block: "nearest" })
                } else {
                  closeTimePicker()
                }
              }}
            />
          </div>
        </div>
      </div>
      <div
        className={`text-outerSpace-950 bg-white rounded-sm shadow w-48 p-2 select-none absolute z-20 time-picker-selection-box`}
        style={{ display: "none" }}
        ref={ref}
      >
        <>
          <div className="flex">
            <div className="h-[12.25rem] overflow-auto w-1/2 border-r border-fuscousGray-300">
              {hourArr.map(e => {
                return (
                  <div
                    key={"hour-" + e}
                    id={"hour-" + e}
                    onClick={() => changeTime("HOUR", e)}
                    className={`text-center m-1 rounded-sm p-1 ${time.split(":")[0] == e ? "bg-purpleHeart-300 hover:bg-purpleHeart-300/75" : "hover:bg-purpleHeart-300/50"}`}
                  >
                    <Typography
                      variant="mediumBody2"
                      className="m-auto text-fuscousGray-700"
                    >
                      {e}
                    </Typography>
                  </div>
                )
              })}
            </div>
            <div className="h-[12.25rem] overflow-auto w-1/2">
              {minuteArr.map(e => {
                return (
                  <div
                    key={"minute-" + e}
                    id={"minute-" + e}
                    onClick={() => changeTime("MINUTE", e)}
                    className={`text-center m-1 rounded-sm p-1 ${time.split(":")[1] == e ? "bg-purpleHeart-300 hover:bg-purpleHeart-300/75" : "hover:bg-purpleHeart-300/50"}`}
                  >
                    <Typography
                      variant="mediumBody2"
                      className="m-auto text-fuscousGray-700"
                    >
                      {e}
                    </Typography>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      </div>
      {gutter && <br />}
    </div>
  )
}

export default TimePicker
