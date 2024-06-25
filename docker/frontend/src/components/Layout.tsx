import type { ReactNode } from "react"
import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { Typography } from "./Typography"
import {
  CollaspeIcon,
  ExpandIcon,
  ManagementIcon,
  SettingIcon,
} from "@icons/index"
import { useAppSelector } from "app/hooks"
import { selectDisplaySideBar } from "./commonSlice"
import { ADMIN_BASE_PATH } from "@util/constants"
import { useTranslation } from "react-i18next"
interface LayoutTypes {
  children: ReactNode
}

export const PublicLayout = ({ children }: LayoutTypes) => {
  return <section className="bg-white text-outerSpace-950">{children}</section>
}

export const AdminLayout = ({ children }: LayoutTypes) => {
  return (
    <section
      className="bg-fuscousGray-50 flex text-outerSpace-950 p-2 gap-2"
      style={{ height: "calc( 100vh - 80px )" }}
    >
      {children}
    </section>
  )
}

interface NavLinkProps {
  label: string
  url: string
  icon?: ReactNode
}

interface NestedNavLinkProps {
  child: NavLinkProps[]
}

const formatAdminNavLink = (
  label: string,
  url: string,
  icon?: ReactNode,
  child?: NavLinkProps[],
) => ({
  label,
  url: ADMIN_BASE_PATH + url,
  icon,
  child,
})

const SingleLevelNavLinkContainer = (props: NavLinkProps) => {
  return (
    <NavLink
      to={props.url}
      className={({ isActive, isPending }) =>
        isActive
          ? " bg-purpleHeart-300 rounded-sm hover:bg-purpleHeart-300/75 transition-colors"
          : isPending
            ? ""
            : "hover:bg-purpleHeart-300/50 rounded-sm transition-colors"
      }
    >
      <div className="flex gap-2 px-2 py-2">
        {props.icon ? props.icon : null}
        <Typography variant="mediumBody2">{props.label}</Typography>
      </div>
    </NavLink>
  )
}

const MultiLevelNavLinkContainer = (
  props: NestedNavLinkProps & NavLinkProps,
) => {
  const location = useLocation()
  let childSelected = false
  for (const childItem of props.child) {
    if (childItem.url == location.pathname) {
      childSelected = true
    }
  }
  const [expandSubMenu, setExpandSubMenu] = useState(childSelected)

  return (
    <div className={`grid gap-2`}>
      <NavLink
        to={"#"}
        className="flex justify-between cursor-pointer hover:bg-purpleHeart-300/50 transition-colors rounded-sm items-center"
        onClick={() => setExpandSubMenu(!expandSubMenu)}
      >
        <div className="flex gap-2 px-2 py-2">
          {props.icon ? props.icon : null}
          <Typography variant="mediumBody2">{props.label}</Typography>
        </div>
        {expandSubMenu ? (
          <CollaspeIcon className="mr-2 fill-outerSpace-950" />
        ) : (
          <ExpandIcon className="mr-2 fill-outerSpace-950" />
        )}
      </NavLink>
      {expandSubMenu && (
        <div className="grid gap-2">
          {props.child?.map(childProps => (
            <NavLink
              key={"childNavLink_" + childProps.label}
              to={childProps.url}
              className={({ isActive, isPending }) =>
                isActive
                  ? " bg-purpleHeart-300 rounded-sm mx-2 hover:bg-purpleHeart-300/75 transition-colors"
                  : isPending
                    ? ""
                    : "hover:bg-purpleHeart-300/50 mx-2 rounded-sm transition-colors"
              }
            >
              <div className="pl-8 pr-2 py-2">
                <Typography variant="body3">{childProps.label}</Typography>
              </div>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export const SideBar = () => {
  const { t } = useTranslation(["sidebar", "common"])
  const navLinkList = [
    formatAdminNavLink(
      t("management"),
      "/management",
      <ManagementIcon className="fill-outerSpace-950" />,
      [formatAdminNavLink(t("todo"), "/management/todo")],
    ),
    formatAdminNavLink(
      t("setting"),
      "/setting",
      <SettingIcon className="fill-outerSpace-950" />,
      [
        formatAdminNavLink(t("role"), "/setting/role"),
        formatAdminNavLink(t("user"), "/setting/user"),
      ],
    ),
  ]

  const displaySideBar = useAppSelector(selectDisplaySideBar)

  return (
    <nav
      className="h-auto transition-all"
      style={{ marginLeft: displaySideBar ? "0px" : "-312px" }}
    >
      <div
        style={{ width: "304px", maxHeight: "calc( 100vh - 80px - 1rem )" }}
        className="bg-white gap-4 flex flex-col px-2 py-4 rounded overflow-y-auto"
      >
        {navLinkList.map((e, i) => {
          if (e.child !== null && e.child !== undefined) {
            return (
              <MultiLevelNavLinkContainer
                {...(e as NestedNavLinkProps & NavLinkProps)}
                key={"nestedNav_" + i}
              />
            )
          } else {
            return <SingleLevelNavLinkContainer {...e} key={"singleNav_" + i} />
          }
        })}
      </div>
    </nav>
  )
}
