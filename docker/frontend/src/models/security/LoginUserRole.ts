import { BaseModel } from "../BaseModel"
import { type LoginUser } from "./LoginUser"
import { type Role } from "./Role"

export class LoginUserRole extends BaseModel<number> {
  loginUser?: LoginUser
  role?: Role
}
