import { BaseModel } from "../BaseModel"
import { type RolePriv } from "./RolePriv"

export enum UserRoleCode {
  ADMIN,
  USER,
}

export class Role extends BaseModel<number> {
  code?: string
  description?: string
  rolePrivs?: RolePriv[]
}
