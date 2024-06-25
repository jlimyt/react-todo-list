import { type Operation, type DataOption, type DataType } from "@util/constants"

export class SearchCriteria {
  key?: string
  operation?: Operation
  value?: string | boolean | number | string[] | number[]
  dataOption?: DataOption
  searchCriterias?: SearchCriteria[]
  dataType?: DataType
}
