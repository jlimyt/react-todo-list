import { type DataOption } from "@util/constants"
import { type SearchCriteria } from "./SearchCriteria"

export class BaseModel<T> {
  id?: T | number
  createdBy?: number
  modifiedBy?: number
  createdAt?: Date
  modifiedAt?: Date
  active?: boolean
  searchDate?: Date
  searchDateFrom?: Date
  searchDateTo?: Date
  searchCriterias?: SearchCriteria[]
  dataOption?: DataOption
}
