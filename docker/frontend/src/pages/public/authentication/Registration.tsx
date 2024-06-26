import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import Modal from "components/Modal"
import { Typography } from "components/Typography"
import Button from "components/form/Button"
import Input from "components/form/Input"
import { useRegisterLoginUserMutation } from "pages/settings/loginUser/loginUserApiSlice"
import { type Dispatch, type SetStateAction, useEffect } from "react"
import { Field, Form } from "react-final-form"
import { useTranslation } from "react-i18next"
import { required, confirmPassword, composeValidators, validPassword } from "utils/FormUtil"

interface RegistrationModalProps {
  isOpen?: boolean
  setIsOpen?: Dispatch<SetStateAction<boolean>>
  setIsOpenRegistrationDialog: Dispatch<SetStateAction<boolean>>
  setContent: Dispatch<SetStateAction<string>>
}

interface DialogProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  content: string
}

export function RegistrationResponseDialog({isOpen, setIsOpen, content}: DialogProps) {
  const { t } = useTranslation(["common"])

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

export function RegistrationModal({
  isOpen = false,
  setIsOpen,
  setIsOpenRegistrationDialog,
  setContent
}: RegistrationModalProps) {
  const { t } = useTranslation(["common"])
  const title = t("registration")

  function handleCancel() {
    if (setIsOpen) {
      setIsOpen(false)
    }
  }

  
  const sectionTitle: { [key: string]: string } = {
    account: t("account")
  }
  
  const formFieldList: { [key: string]: string } = {
    email: t("email"),
    password: t("password"),
    confirmPassword: t("confirm-password"),
    username: t("username"),
    displayName: t("display-name"),
  }
  
  const cancelBtnLabel = t("cancel")
  const submitBtnLabel = t("submit")
  
  function genPlaceholder(inputType: string, fieldName: string) {
    const defaultPrefix = inputType == "input" ?  t("input-prefix") : ""
    return defaultPrefix + fieldName
  }

  const [registerUser, registerUserResponse] = useRegisterLoginUserMutation()
  async function onSubmit(formDatas: { [key: string]: any }) {
    for (const formData in formDatas) {
      if (typeof formDatas[formData] == "object") {
        if (formDatas[formData].value == null) {
          delete formDatas[formData]
        }
      }
    }
    registerUser({ body: formDatas })
  }

  useEffect(() => {
    const { isSuccess, error } = registerUserResponse
    if(isSuccess){
      setIsOpen && setIsOpen(false)
      setIsOpenRegistrationDialog(true)
      setContent(t("register-success-message"))
    }
    if(error){
      setIsOpen && setIsOpen(false)
      setIsOpenRegistrationDialog(true)
      setContent(t("register-fail-message"))
    }
  },[registerUserResponse])


  return (
    <>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onClose={() => {
          if (setIsOpen) {
            setIsOpen(false)
          }
        }}
        title={
          <Typography variant="heading3" className="text-purpleHeart-400">
            {title}
          </Typography>
        }
        content={
          <>
            <Form
              onSubmit={onSubmit}
              render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-4">
                    <Typography
                      variant="mediumBody1"
                      className="text-outerSpace-950 mt-6"
                    >
                      {sectionTitle["account"]}
                    </Typography>
                    <div>
                      <div className="w-1/2 pr-2.5">
                        <Field name="email">
                          {({ input }) => (
                            <Input
                              type="email"
                              id="registration_email"
                              label={formFieldList["email"]}
                              placeholder={genPlaceholder(
                                "input",
                                formFieldList["email"],
                              )}
                              {...input}
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="flex-auto w-0">
                        <Field name="username" validate={required}>
                          {({ input, meta }) => (
                            <Input
                              id="username"
                              label={formFieldList["username"]}
                              placeholder={genPlaceholder(
                                "input",
                                formFieldList["username"],
                              )}
                              isError={meta.error && meta.touched}
                              errorText={meta.error}
                              {...input}
                            />
                          )}
                        </Field>
                      </div>
                      <div className="flex-auto w-0">
                        <Field name="displayName" validate={required}>
                          {({ input, meta }) => (
                            <Input
                              id="displayName"
                              label={formFieldList["displayName"]}
                              placeholder={genPlaceholder(
                                "input",
                                formFieldList["displayName"],
                              )}
                              isError={meta.error && meta.touched}
                              errorText={meta.error}
                              {...input}
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="flex-auto w-0">
                        <Field name="password" validate={composeValidators(required, validPassword, confirmPassword)}>
                          {({ input, meta }) => (
                            <Input
                              type="text"
                              id="password"
                              label={formFieldList["password"]}
                              placeholder={genPlaceholder(
                                "input",
                                formFieldList["password"],
                              )}
                              isError={meta.error && meta.touched}
                              errorText={meta.error}
                              {...input}
                            />
                          )}
                        </Field>
                      </div>
                      <div className="flex-auto w-0">
                        <Field name="confirmPassword" validate={composeValidators(required, validPassword, confirmPassword)}>
                          {({ input, meta }) => (
                            <Input
                              type="text"
                              id="confirmPassword"
                              label={formFieldList["confirmPassword"]}
                              placeholder={genPlaceholder(
                                "input",
                                formFieldList["confirmPassword"],
                              )}
                              isError={meta.error && meta.touched}
                              errorText={meta.error}
                              {...input}
                            />
                          )}
                        </Field>
                      </div>
                    </div>

                    <div className="flex justify-between gap-x-8 float-right">
                      <Button
                        onClick={() => {
                          handleCancel()
                        }}
                        label={cancelBtnLabel}
                        variant="outlined"
                        fullWidth
                        mode="public"
                      />
                      <Button
                        label={submitBtnLabel}
                        type="submit"
                        fullWidth
                        mode="public"
                      />
                    </div>
                  </div>
                </form>
              )}
            />
          </>
        }
      />
    </>
  )
}

export default RegistrationModal
