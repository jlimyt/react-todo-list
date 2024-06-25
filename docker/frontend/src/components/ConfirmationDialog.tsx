import { useEffect } from "react"
import Modal from "./Modal"
import {
  clearConfirmation,
  closeConfirmation,
  selectConfirmation,
} from "./commonSlice"
import Button from "./form/Button"
import { Typography } from "./Typography"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { useTranslation } from "react-i18next"

function ConfirmationDialog() {
  const dispatch = useAppDispatch()
  const { content, open, resolve, reject } = useAppSelector(selectConfirmation)

  const { t } = useTranslation(["dialog", "common"])

  // DEFAULT display
  const submitLabel = "Confirm"
  const cancelLabel = t("cancel")

  useEffect(() => {
    if (open === false) {
      setTimeout(() => {
        dispatch(clearConfirmation())
      }, 500)
    }
  }, [open])

  function handleClose() {
    dispatch(closeConfirmation())
  }
  function handleConfirm() {
    if (resolve) resolve()
    handleClose()
  }
  function handleCancel() {
    if (reject) reject()
    handleClose()
  }

  return (
    <>
      <Modal
        isOpen={open}
        title={content?.title}
        content={
          <>
            <Typography variant="body1">{content?.content}</Typography>
            <div className="flex justify-between gap-x-8 float-right">
              {reject ? (
                <button onClick={handleCancel}>
                  {content?.cancelLabel || cancelLabel}
                </button>
              ) : null}
              {resolve ? (
                <Button
                  onClick={handleConfirm}
                  label={content?.confirmLabel || submitLabel}
                  color="cinnabar"
                />
              ) : null}
            </div>
          </>
        }
      />
    </>
  )
}

export default ConfirmationDialog
