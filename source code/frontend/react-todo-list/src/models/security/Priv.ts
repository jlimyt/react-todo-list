import { BaseModel } from "../BaseModel"
import { type Menu } from "./Menu"
import { type RolePriv } from "./RolePriv"

export enum Type {
  READ,
  READ_WRITE,
  NONE,
}

export class Priv extends BaseModel<number> {
  privType?: Type
  code?: string
  description?: string
  rolePrivs?: RolePriv[]
  menus?: Menu[]
}
