import { BaseModel } from "./BaseModel"
import { type Todo } from "./Todo"
import { type LoginUser } from "./security/LoginUser"

export class TodoUser extends BaseModel<number> {
  loginUser?: LoginUser
  todo?: Todo
  readAt?: Date
  completedAt?: Date
}
