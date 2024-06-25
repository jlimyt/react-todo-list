import { useEffect, useRef, useState } from "react"
import type { MouseEvent } from "react"
import Input, { InputLabel } from "./Input"
import dayjs from "dayjs"
import type { Dayjs } from "dayjs"
import { CalendarIcon, ArrowLeftIcon, ArrowRightIcon } from "@icons/index"
import customParseFormat from "dayjs/plugin/customParseFormat"
import { Typography } from "components/Typography"
import { DATE_FORMAT } from "@util/constants"
import type { FocusEvent } from "react"
import type { FieldInputProps } from "react-final-form"
import { useOutsideClick } from "utils/LayoutUtil"

type Props = Partial<FieldInputProps<any, HTMLElement>>

interface DatePickerProps extends Props {
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

function DatePicker({
  label,
  id,
  placeholder,
  helperText,
  errorText,
  minDate,
  maxDate,
  defaultValue = "",
  inputFormFn,
  gutter = true,
  isError,
  ...input
}: DatePickerProps) {
  dayjs.extend(customParseFormat)

  const dayArr = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const monthArr = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const startingYear = minDate ? minDate.get("year") : "2020"
  const yearLimit = maxDate
    ? maxDate.diff(minDate || dayjs().startOf("year"), "year") + 1
    : 20

  const initDate = defaultValue
    ? dayjs(defaultValue, DATE_FORMAT)
    : input.value
      ? dayjs(input.value, DATE_FORMAT)
      : dayjs()
  const [date, setDate] = useState(initDate)
  const [displayDate, setDisplayDate] = useState(initDate)
  const startOfMonth = displayDate.startOf("M").day()
  const dateArr = Array.from({ length: displayDate.endOf("M").date() }).map(
    (_e, i) => displayDate.startOf("M").add(i, "day").unix(),
  )
  const yearArr = Array.from({ length: yearLimit }).map(
    (_e, i) => i + +startingYear,
  )

  const [view, setView] = useState<"DAY" | "MONTH" | "YEAR">("DAY")

  const handleClickOutside = () => {
    closeDatePicker()
  }

  const ref = useOutsideClick(handleClickOutside)

  let textInput = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (textInput.current) {
      if (defaultValue == "" && input.value != textInput.current.value) {
        inputFormFn?.setValue(id, defaultValue)
        textInput.current.value = defaultValue
      } else {
        inputFormFn?.setValue(id, date.format(DATE_FORMAT))
        textInput.current.value = date.format(DATE_FORMAT)
      }
    }
  }, [date])

  function handleSelectDate(e: number) {
    const finalDate = dayjs.unix(e).clone().startOf("day")
    if (
      (minDate && finalDate.isBefore(minDate.startOf("day"))) ||
      (maxDate && finalDate.isAfter(maxDate.startOf("day")))
    ) {
      return
    }
    setDate(finalDate)
    setDisplayDate(finalDate)
    closeDatePicker()
  }

  function handleSelectMonth(e: number, event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation()
    setView("DAY")
    setDisplayDate(displayDate.set("month", e))
  }

  function handleSelectYear(e: number, event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation()
    setView("DAY")
    setDisplayDate(displayDate.set("year", e))
  }

  function handleNextMonth(event: { stopPropagation: () => void }) {
    event.stopPropagation()
    if (
      !(
        displayDate.year() == yearArr[yearArr.length - 1] &&
        displayDate.month() == 11
      )
    ) {
      setDisplayDate(displayDate.add(1, "month"))
    }
  }

  function handlePreviousMonth(event: { stopPropagation: () => void }) {
    event.stopPropagation()
    if (!(displayDate.year() == yearArr[0] && displayDate.month() == 0)) {
      setDisplayDate(displayDate.subtract(1, "month"))
    }
  }

  function handleOpenMonthView(event: { stopPropagation: () => void }) {
    event.stopPropagation()
    setView("MONTH")
  }

  function handleOpenYearView(event: { stopPropagation: () => void }) {
    event.stopPropagation()
    setView("YEAR")
  }

  function closeDatePicker() {
    setView("DAY")
    if (ref.current) {
      ref.current.style.display = "none"
    }
  }

  useEffect(() => {
    if (view == "YEAR") {
      document
        .getElementById("year-" + date.year())
        ?.scrollIntoView({ block: "nearest" })
    }
  }, [view])

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
            onBlur={(e: FocusEvent<HTMLInputElement>) => {
              if (e.target.validity.valid && e.target.value != "") {
                setDate(dayjs(e.target.value, DATE_FORMAT))
              }
              input.onBlur && input.onBlur(e)
            }}
            pattern={"\\d{2}/\\d{2}/\\d{4}"}
            errorText={errorText}
            helperText={helperText}
            defaultValue={defaultValue}
            ref={textInput}
            gutter={false}
            isError={isError}
          />
          <div className="absolute inset-y-0 right-0 flex mt-3">
            <CalendarIcon
              className="fill-outerSpace-950 mr-4 cursor-pointer"
              onClick={e => {
                e.stopPropagation()
                if (ref.current && ref.current.style.display == "none") {
                  if (
                    document.getElementsByClassName("date-picker-selection-box")
                      .length > 1
                  ) {
                    for (const element of document.getElementsByClassName(
                      "date-picker-selection-box",
                    ) as HTMLCollectionOf<HTMLElement>) {
                      if (element.style.display == "block") {
                        element.style.display = "none"
                      }
                    }
                  }
                  setDisplayDate(date)
                  ref.current.style.display = "block"
                } else {
                  closeDatePicker()
                }
              }}
            />
          </div>
        </div>
      </div>
      <div
        className={`text-outerSpace-950 bg-white rounded-sm shadow w-72 p-2 select-none absolute z-20 date-picker-selection-box`}
        style={{ display: "none" }}
        ref={ref}
      >
        <>
          <div className="flex px-1 py-1">
            <div className="absolute flex">
              <Typography
                variant="mediumBody2"
                className="cursor-pointer"
                onClick={handleOpenYearView}
              >
                {displayDate.year()}
              </Typography>
            </div>
            <div className="m-auto flex gap-2">
              <button onClick={handlePreviousMonth} type="button">
                <ArrowLeftIcon className="fill-outerSpace-950" />
              </button>
              <Typography
                variant="mediumBody2"
                className="w-9 cursor-pointer text-center"
                onClick={handleOpenMonthView}
              >
                {monthArr[displayDate.month()].substring(0, 3).toUpperCase()}
              </Typography>
              <button onClick={handleNextMonth} type="button">
                <ArrowRightIcon className="fill-outerSpace-950" />
              </button>
            </div>
          </div>
          {view == "YEAR" ? (
            <>
              <div className="h-56 overflow-auto date-picker-scrollbar">
                <div className="grid grid-cols-3 gap-1 m-1">
                  {yearArr.map(e => (
                    <Typography
                      variant="mediumBody3"
                      className={`cursor-pointer text-center py-3 rounded-sm ${
                        displayDate.year() == e
                          ? "bg-purpleHeart-300 hover:bg-purpleHeart-300/75"
                          : "hover:bg-purpleHeart-300/50"
                      }`}
                      id={"year-" + e}
                      key={"year-" + e}
                      onClick={event => handleSelectYear(e, event)}
                    >
                      {e}
                    </Typography>
                  ))}
                </div>
              </div>
            </>
          ) : view == "MONTH" ? (
            <>
              <div className="h-[12.25rem] overflow-auto scrollbar-hide">
                <div className="grid grid-cols-3 gap-1 m-1">
                  {monthArr.map((e, i) => (
                    <Typography
                      variant="mediumBody3"
                      className={`cursor-pointer text-center py-3 rounded-sm ${
                        displayDate.month() == i
                          ? "bg-purpleHeart-300 hover:bg-purpleHeart-300/75"
                          : "hover:bg-purpleHeart-300/50"
                      }`}
                      id={e}
                      key={e}
                      onClick={event => handleSelectMonth(i, event)}
                    >
                      {e}
                    </Typography>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div
              className={`grid grid-cols-7 gap-1 auto-rows-[theme(height.8)]`}
            >
              {dayArr.map(e => (
                <div className={`flex`} key={e + "_dayContainer"}>
                  <Typography
                    variant="body4"
                    className="m-auto text-fuscousGray-700"
                  >
                    {e.toUpperCase()}
                  </Typography>
                </div>
              ))}
              {dateArr.map((e, i) => {
                const dateLabel = dayjs.unix(e).date()
                const dateArrValue = dayjs.unix(e).clone().startOf("day")
                return (
                  <div
                    className={`${i == 0 ? "col-start-" + startOfMonth : ""} rounded-sm flex ${
                      date.startOf("date").unix() == e
                        ? "bg-purpleHeart-300 hover:bg-purpleHeart-300/75"
                        : "hover:bg-purpleHeart-300/50"
                    } ${
                      minDate && dateArrValue.isBefore(minDate.startOf("day"))
                        ? "text-fuscousGray-300 cursor-not-allowed hover:bg-transparent"
                        : ""
                    } ${
                      maxDate && dateArrValue.isAfter(maxDate.startOf("day"))
                        ? "text-fuscousGray-300 cursor-not-allowed hover:bg-transparent"
                        : ""
                    }`}
                    id={e + "_date"}
                    key={e + "_date"}
                    onClick={() => handleSelectDate(e)}
                  >
                    <Typography variant="body4" className="m-auto">
                      {dateLabel}
                    </Typography>
                  </div>
                )
              })}
            </div>
          )}
        </>
      </div>
      {gutter && <br />}
    </div>
  )
}

export default DatePicker
