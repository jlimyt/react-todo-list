import dayjs from "dayjs"
import {
  EMAIL_PATTERN,
  PASSWORD_PATTERN
} from "./constants"
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat)

export function formatMultipleArray(
  originalArr: any[],
  data: any[],
  childKey: (e: any) => void,
) {
  let resultArr: any[] = []
  originalArr?.forEach(e1 => {
    data?.forEach(e2 => {
      if (e1.value == childKey(e2)) {
        resultArr.push(e1)
      }
    })
  })
  return resultArr
}

//Form validation
export const required = (value: any) => (value ? undefined : "Required")

export const confirmPassword = (_: any, allValues: any) => (allValues.password == allValues.confirmPassword ? undefined : "Does not match" )

export const singleDropdownRequired = (value: any) =>
  value?.value != null ? undefined : "Required"

export const multipleDropdownRequired = (value: any) =>
  value?.length > 0 ? undefined : "Required"

export const minCharacterLength = (min: number) => (value: string) =>
  value.length >= min ? undefined : `The minimum character length is|${min}`

export const maxCharacterLength = (max: number) => (value: string) =>
  value.length <= max ? undefined : `The maximum character length is|${max}`

export const withinCharacterLength =
  (min: number, max: number) => (value: string) =>
    value.length <= max && value.length >= min
      ? undefined
      : `The character length should be between|${min} - ${max}`

export const matchPattern = (pattern: RegExp) => (value: string) =>
  pattern.test(value) ? undefined : `Incorrect format`

export const validEmail = (value: string) =>
  EMAIL_PATTERN.test(value) ? undefined : `Incorrect email format`

export const validPassword = (value: string) =>
  PASSWORD_PATTERN.test(value) ? undefined : `Incorrect password format`

export const composeValidators =
  (...validators: any[]) =>
  (value: any, allValues: any) =>
    validators.reduce(
      (error, validator) => error || validator(value, allValues),
      undefined,
    )

export function splitErrorText(errorText?: string) {
  if (errorText?.includes("|")) {
    var errorArr = errorText.split("|")
    return {
      errorMsg: errorArr[0],
      variable: " " + errorArr[1],
    }
  }

  return {
    errorMsg: errorText,
    variable: "",
  }
}
