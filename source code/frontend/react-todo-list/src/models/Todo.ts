import { BaseModel } from "./BaseModel"
import { type TodoComment } from "./TodoComment"
import { type TodoUser } from "./TodoUser"
import { type LoginUser } from "./security/LoginUser"
import { type Role } from "./security/Role"

export enum Type {
  ALL,
  ROLE,
  USER,
}

export enum Category {
  GENERAL,
  INTERNAL,
  EXTERNAL,
  MEETING,
  FOLLOWUP,
  OTHER
}

export enum Priority {
  NA,
  LOW,
  MEDIUM,
  HIGH,
  URGENT
}

export enum SearchMode {
  PENDING,
  COMPLETED,
}

export class Todo extends BaseModel<number> {
  completedAt?: Date
  priority?: Priority
  title?: string
  requiredAllCompleted?: boolean
  deadlineAt?: Date
  type?: Type
  category?: Category
  owner?: LoginUser
  role?: Role
  content?: string
  todoUsers?: TodoUser[]
  todoComments?: TodoComment[]
}
