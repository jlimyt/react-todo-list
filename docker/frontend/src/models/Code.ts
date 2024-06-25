import { BaseModel } from "./BaseModel"

export enum Type {
  POSTING_ARRANGEMENT,
  RANK,
  ENABLE_DISABLE,
  YES_NO,
  STATUS,
}

export class Code extends BaseModel<number> {
  type?: string
  key?: string
  description?: string
}
