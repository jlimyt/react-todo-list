import { Typography } from "components/Typography"
import Button from "components/form/Button"
import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from "react-router-dom"
import { PublicHeader } from "components/Header"
import { PublicLayout } from "components/Layout"
import { useTranslation } from "react-i18next"

export default function ErrorPage() {
  const error: unknown = useRouteError()
  console.error(error)
  const navigate = useNavigate()
  const { t } = useTranslation("error")

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      console.log(error)
      return (
        <>
          <PublicHeader />
          <PublicLayout>
            <div className="h-[calc(100dvh-80px)] flex flex-col items-center pt-[calc(35dvh-80px)]">
              <Typography
                variant="heading1"
                className="text-purpleHeart-500"
              >
                {t("oops")}
              </Typography>
              <Typography variant="mediumBody1" className="mt-6">
                {t("sorry.404")}
              </Typography>
              <Typography variant="body1" className="italic mb-6">
                {error.status} {error.statusText}
              </Typography>
              <Button
                label="Back to Home"
                variant="filled"
                onClick={() => {
                  navigate("/home")
                }}
              ></Button>
            </div>
          </PublicLayout>
        </>
      )
    }
  } else if (error instanceof Error) {
    return (
      <>
        <PublicLayout>
          <div className="h-full flex flex-col items-center pt-[calc(30dvh)]">
            <Typography variant="heading1" className="text-purpleHeart-500">
              {t("oops")}
            </Typography>
            <Typography variant="mediumBody1" className="mt-6">
              {t("sorry.unexpected")}
            </Typography>
            <Typography variant="body1" className="italic mb-6">
              {error.message}
            </Typography>
          </div>
        </PublicLayout>
      </>
    )
  }
}
