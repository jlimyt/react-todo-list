import { BaseModel } from "../BaseModel"
import { type LoginUserRole } from "./LoginUserRole"

export enum Type {
  PUBLIC,
  INSTRUCTOR,
  STAFF,
}

export class LoginUser extends BaseModel<number> {
  username?: string
  password?: string
  displayName?: string
  loginUserRoles?: LoginUserRole[]
  phoneNo?: string
  email?: string
  dropdownDisplay?: string
  enable?: boolean
}
