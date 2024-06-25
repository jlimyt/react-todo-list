import { BaseModel } from "../BaseModel"
import { type LoginUser } from "./LoginUser"

export enum Type {
  FORGOT_PASSWORD,
  USER_ACTIVATION,
}

export class LoginUserToken extends BaseModel<number> {
  type?: Type
  loginUser?: LoginUser
  expiredAt?: Date
  completedAt?: Date
  newPasswords?: string
}
