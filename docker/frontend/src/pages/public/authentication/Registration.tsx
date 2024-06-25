import Modal, { type ModalProps } from "components/Modal"
import { Typography } from "components/Typography"
import Button from "components/form/Button"
import Input from "components/form/Input"
import { useRegisterLoginUserMutation } from "pages/settings/loginUser/loginUserApiSlice"
import { type Dispatch, type SetStateAction, useState, useEffect } from "react"
import { Field, Form } from "react-final-form"
import { useTranslation } from "react-i18next"
import { required, confirmPassword, composeValidators, validPassword } from "utils/FormUtil"
interface RegistrationModalProps {
  isOpen?: boolean
  setIsOpen?: Dispatch<SetStateAction<boolean>>
  setIsOpenRegistrationDialog: Dispatch<SetStateAction<boolean>>
  setContent: Dispatch<SetStateAction<string>>
}

// function randomRGB() {
//   return `${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)}`
// }

// function genVerificationCode(length: number) {
//   let result = ""
//   const characters =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
//   const charactersLength = characters.length
//   let counter = 0
//   while (counter < length) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength))
//     counter += 1
//   }
//   return result
// }

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
            {NormalRegistrationForm(handleCancel, setIsOpenRegistrationDialog, setContent, setIsOpen)}
          </>
        }
      />
    </>
  )
}

function NormalRegistrationForm(
  handleCancel: () => void,
  setIsOpenRegistrationDialog: Dispatch<SetStateAction<boolean>>,
  setContent: Dispatch<SetStateAction<string>>,
  setIsOpen?: Dispatch<SetStateAction<boolean>>) {
  // const [bgColor, setBgColor] = useState(randomRGB())
  // const [textColor, setTextColor] = useState(randomRGB())
  // const [targetVerificationCode, setTargetVerificationCode] = useState(
  //   genVerificationCode(5),
  // )
  const { t } = useTranslation(["common"])

  const sectionTitle: { [key: string]: string } = {
    account: t("account")
  }
  
  const formFieldList: { [key: string]: string } = {
    email: t("email"),
    password: t("password"),
    confirmPassword: t("confirm-password"),
    // verificationCode: "驗證碼",
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

              {/* <div className="flex gap-2">
                <div>
                  <Field name="verification_code">
                    {({ input }) => (
                      <Input
                        type="text"
                        id="registration_verification_code"
                        label={formFieldList["verificationCode"]}
                        {...input}
                      />
                    )}
                  </Field>
                </div>
                <div
                  className="self-center indent-4"
                  style={{ letterSpacing: "1rem" }}
                >
                  <Typography
                    variant="body3"
                    className="h-11 select-none mix-blend-difference rounded-sm grid items-center w-36"
                    style={{
                      backgroundColor: `rgb(${bgColor})`,
                      color: `rgb(${textColor}`,
                    }}
                  >
                    {targetVerificationCode}
                  </Typography>
                </div>
                <button
                  onClick={() => {
                    setTargetVerificationCode(genVerificationCode(5))
                    setBgColor(randomRGB())
                    setTextColor(randomRGB())
                  }}
                >
                  <div className="self-center">
                    <RefreshIcon className="fill-outerSpace-950" />
                  </div>
                </button>
              </div> */}

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
  )
}

export default RegistrationModal
