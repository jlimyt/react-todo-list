export const DATE_FORMAT = "DD/MM/YYYY"
export const TIME_FORMAT = "HH:mm"

export const DATE_PATTERN = new RegExp(/\d{2}\/\d{2}\/\d{4}/)

export const DATE_PATTERN_STRING = "\\d{2}/\\d{2}/\\d{4}"

export const TIME_PATTERN = new RegExp(
  /^\b([0-1][0-9]|[2][0-3])\b:\b([0-5][0-9])\b$/,
)
export const TIME_PATTERN_STRING =
  "^\\b([0-1][0-9]|[2][0-3])\\b:\\b([0-5][0-9])\\b$"

export const DATE_TIME_PATTERN = new RegExp(
  /^\d{2}\/\d{2}\/\d{4}\s\b([0-1][0-9]|[2][0-3])\b:\b([0-5][0-9])\b$/,
)

export const EMAIL_PATTERN = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)

export const PASSWORD_PATTERN = new RegExp(
  /(?=(?=.*[0-9])(?=.*[A-z])(?=.*[a-z]).{8,24}$)(?!^[_-].+)(?!.+[_-]$)(?!.*[_-]{2,})[^<>[\]{}|\\\/^~%# :;,$%?+*&()_=+'"!.@`\-\0-\cZ]+$/,
)

export enum DataOption {
  AND = "AND",
  OR = "OR",
}

export enum DataType {
  DATE = "DATE",
  DATE_TIME = "DATE_TIME",
  TIME = "TIME",
  STRING = "STRING",
  NUMBER = "NUMBER",
  BOOLEAN = "BOOLEAN",
  STRING_ARRAY = "STRING_ARRAY",
  NUMBER_ARRAY = "NUMBER_ARRAY",
}

export const categoryList = [
  { id: 1, value: "GENERAL", display: "General", color: "#BC5090" },
  { id: 2, value: "INTERNAL", display: "Internal", color: "#FC696D" },
  { id: 3, value: "EXTERNAL", display: "External", color: "#F6C324" },
  { id: 4, value: "MEETING", display: "Meeting", color: "#6F975C" },
  { id: 5, value: "FOLLOWUP", display: "Follow-up", color: "#483C32" },
  { id: 6, value: "OTHER", display: "Other", color: "#717171" },
]

export enum Operation {
  LIKE = "LIKE",
  EQUAL = "EQUAL",
  NOT_EQUAL = "NOT_EQUAL",
  IS_NULL = "IS_NULL",
  NOT_NULL = "NOT_NULL",
  GREATER_THAN = "GREATER_THAN",
  GREATER_THAN_OR_EQUAL = "GREATER_THAN_OR_EQUAL",
  LESS_THAN = "LESS_THAN",
  LESS_THAN_OR_EQUAL = "LESS_THAN_OR_EQUAL",
  ANY_MATCH_LIKE = "ANY_MATCH_LIKE",
  EXACT_MATCH_LIKE = "EXACT_MATCH_LIKE",
  IN = "IN",
}

export const Operations = Object.entries(Operation).map(([key, value]) => ({
  value: value.toString(),
  display: key,
}))

export enum Language {
  EN = "EN",
  zh_TW = "zh-TW",
}

export const ADMIN_BASE_PATH = "/admin"

export const formatDropdown = (data: { id: string; code: string }[]) => {
  if (data?.length > 0) {
    return data?.map((item: { id: string; code: string }) => ({
      value: item.id,
      display: item.code,
    }))
  } else {
    return []
  }
}

export const formatLoginUserDropdown = (
  data: { id: string; displayName: string }[],
) => {
  if (data?.length > 0) {
    return data?.map((item: { id: string; displayName: string }) => ({
      value: item.id.toString(),
      display: item.displayName,
    }))
  } else {
    return []
  }
}

export const booleanDropdownField = [
  { value: true, display: "True" },
  { value: false, display: "False" },
]

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
