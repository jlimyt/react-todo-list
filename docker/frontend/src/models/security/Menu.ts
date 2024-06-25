import { BaseModel } from "../BaseModel"
import { type Priv } from "./Priv"

export class Menu extends BaseModel<number> {
  title?: string
  seq?: number
  parent?: Menu
  subMenus?: Menu[]
  priv?: Priv
  requiredPriv?: string | undefined
}
