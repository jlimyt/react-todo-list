import { BaseModel } from "../BaseModel"
import { type Priv } from "./Priv"
import { type Role } from "./Role"

export class RolePriv extends BaseModel<number> {
  role?: Role
  priv?: Priv
}
