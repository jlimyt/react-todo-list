import { closeConfirmation } from "../commonSlice"
import { useAppDispatch } from "app/hooks"
import { handleConfirmation } from "components/commonSlice"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useBlocker } from "react-router-dom"

function useNavigationDialog(
  isFormDirty: boolean,
  isFormSubmitSucceeded: boolean,
) {
  const dispatch = useAppDispatch()

  let blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isFormDirty &&
      !isFormSubmitSucceeded &&
      currentLocation.pathname !== nextLocation.pathname,
  )

  const { t } = useTranslation(["dialog", "common"])

  useEffect(() => {
    if (blocker.state === "blocked") {
      dispatch(
        handleConfirmation({
          title: t("leave-title"),
          content: t("leave-content"),
          confirmLabel: t("leave"),
          reject: () => {
            dispatch(closeConfirmation())
            blocker.state === "blocked" && blocker.reset()
          },
          resolve: () => {
            blocker.state === "blocked" && blocker.proceed()
          },
        }),
      )
    }
  }, [blocker])
}

export default useNavigationDialog
