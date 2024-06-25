import { ArrowRightIcon } from "@icons/index"
import { Typography } from "./Typography"
import { useLocation, NavLink } from "react-router-dom"
import { useTranslation } from "react-i18next"

export default function Breadcrumb() {
  const location = useLocation()
  const { t } = useTranslation("url")

  function formatLocationPath() {
    let locationArr = location.pathname
      .split("/")
      .filter(e => !/^[0-9]+$/.test(e))

    return locationArr.map((e, i) => {
      if (i == 2) {
        return (
          <NavLink
            to={locationArr.slice(0, i + 1).join("/")}
            className={() =>
              "hover:underline underline-offset-2 decoration-fuscousGray-600"
            }
          >
            <Typography variant="mediumBody1" className="text-fuscousGray-600">
              {t(e)}
            </Typography>
          </NavLink>
        )
      } else if (i == locationArr.length - 1) {
        return (
          <>
            <ArrowRightIcon className="fill-fuscousGray-600" />
            <Typography variant="body1" className="text-fuscousGray-600">
              {t(e)}
            </Typography>
          </>
        )
      } else if (i > 2) {
        return (
          <>
            <ArrowRightIcon className="fill-fuscousGray-600" />
            <NavLink
              to={locationArr.slice(0, i + 1).join("/")}
              className={() =>
                "hover:underline underline-offset-2 decoration-fuscousGray-600"
              }
            >
              <Typography
                variant="mediumBody1"
                className="text-fuscousGray-600"
              >
                {t(e)}
              </Typography>
            </NavLink>
          </>
        )
      }
    })
  }

  return <div className="flex gap-4 items-center">{formatLocationPath()}</div>
}
