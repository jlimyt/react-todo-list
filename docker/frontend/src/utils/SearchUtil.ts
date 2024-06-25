import { type TableColumnsSortingProps } from "components/Table"
import { type BaseModel } from "../models/BaseModel"
import { type SearchCriteria } from "../models/SearchCriteria"
import {
  DataOption,
  Operation,
  type Operation as OperationType,
} from "./constants"

interface FormData {
  [key: string]: {
    value: string | boolean | number
    operation: { display: string; value: OperationType }
  }
  // Allow nested objects
}

export function generateSearchCriteria<T extends BaseModel<T>>(
  formData: FormData,
  model: T,
): T {
  const searchCriterias: SearchCriteria[] = []

  for (let [key, values] of Object.entries(formData)) {
    searchCriterias.push({
      key: key.split("_").join("."),
      value: values?.value ?? null,
      operation: values?.operation?.value ?? Operation.LIKE,
    })
  }
  model.dataOption = model.dataOption ?? DataOption.AND
  model.searchCriterias = model.searchCriterias ?? searchCriterias
  return model
}

export function formatSortingString(sort: TableColumnsSortingProps[]) {
  var sortingString = ""
  sort?.map(
    s =>
      (sortingString = sortingString.concat(
        `&sort=${s.key},${s.sortingOrder}`,
      )),
  )
  return sortingString
}
