import { Dispatch, SetStateAction, useState } from "react"
import Login from "./authentication/Login"
import { RegistrationModal } from "./authentication/Registration"
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { Typography } from "components/Typography"
import { useTranslation } from "react-i18next"

interface DialogProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  content: string
}

export default function LandingPage() {
  const [isOpenRegistration, setIsOpenRegistration] = useState(false)
  const [isOpenRegistrationDialog, setIsOpenRegistrationDialog] = useState(false)
  const [content, setContent] = useState("")
  const { t } = useTranslation(["common"])

  function RegistrationResponseDialog({isOpen, setIsOpen, content}: DialogProps) {
  
    return (
      <>
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <DialogPanel className="max-w-lg space-y-4 shadow-xl rounded-lg bg-white p-12">
              <DialogTitle className="font-bold">{t("registration")}</DialogTitle>
              <Typography variant="mediumBody2">{content}</Typography>
              <div className="flex gap-4">
                <button onClick={() => setIsOpen(false)}>{t("confirm")}</button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </>
    )
  }
  return (
    <>
      <RegistrationModal
        isOpen={isOpenRegistration}
        setIsOpen={setIsOpenRegistration}
        setIsOpenRegistrationDialog={setIsOpenRegistrationDialog}
        setContent={setContent}
      />
      <RegistrationResponseDialog
        isOpen={isOpenRegistrationDialog}
        setIsOpen={setIsOpenRegistrationDialog}
        content={content}
      />
      <div className="w-full flex items-center">
        <div className="w-3/4 p-8 shadow m-32 rounded-lg">
          <Login setIsOpenRegistration={setIsOpenRegistration} />
        </div>
      </div>
    </>
  )
}
