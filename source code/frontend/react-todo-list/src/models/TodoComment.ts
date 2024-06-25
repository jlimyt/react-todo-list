import { BaseModel } from "./BaseModel"
import { type Todo } from "./Todo"
import { type LoginUser } from "./security/LoginUser"

export class TodoComment extends BaseModel<number> {
  todo?: Todo
  loginUser?: LoginUser
  commentedAt?: Date
  comment?: string
}
