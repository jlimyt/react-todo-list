import { useState } from "react"
import Login from "./authentication/Login"
import { RegistrationModal, RegistrationResponseDialog } from "./authentication/Registration"

export default function LandingPage() {
  const [isOpenRegistration, setIsOpenRegistration] = useState(false)
  const [isOpenRegistrationDialog, setIsOpenRegistrationDialog] = useState(false)
  const [content, setContent] = useState("")

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
