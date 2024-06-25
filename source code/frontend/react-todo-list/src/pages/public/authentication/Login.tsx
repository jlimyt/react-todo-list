import { useAppDispatch } from "app/hooks"
import Modal, { type ModalProps } from "components/Modal"
import { Typography } from "components/Typography"
import Button from "components/form/Button"
import Input from "components/form/Input"
import {
  saveUserData,
  useLoginMutation,
} from "pages/public/authentication/authApiSlice"
import { useEffect, type Dispatch, type SetStateAction } from "react"
import { Field, Form } from "react-final-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

interface LoginModalProps extends ModalProps {
  setIsOpenRegistration: Dispatch<SetStateAction<boolean>>
}

interface LoginProps {
  setIsOpen?: Dispatch<SetStateAction<boolean>>
  setIsOpenRegistration: Dispatch<SetStateAction<boolean>>
}

interface LoginFormProps {
  username: string
  password: string
}

export function LoginModal({
  isOpen = false,
  setIsOpen,
  setIsOpenRegistration,
}: LoginModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title=""
      content={
        <Login
          setIsOpen={setIsOpen}
          setIsOpenRegistration={setIsOpenRegistration}
        />
      }
    />
  )
}

export function Login({ setIsOpen, setIsOpenRegistration }: LoginProps) {
  const { t } = useTranslation(["common"])
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [login, loginResponse] = useLoginMutation()
  
  // Constants for localization
  const title = t('login-now')
  const registrationBtnLabel = t('register-now')
  const connector = t('or')
  const defaultPlaceholderPrefix = t('input-prefix')
  const loginBtnLabel = t('login')

  const formFieldList: { [key: string]: string } = {
    username: t('username'),
    password: t('password'),
  }

  function navigateRegistration() {
    if (setIsOpen) {
      setIsOpen(false)
    }
    setIsOpenRegistration(true)
  }

  useEffect(() => {
    const { data, isLoading, isSuccess, isError, error } = loginResponse
    if (isLoading) {
      console.info("login loading")
    }

    if (isError) {
      console.error("login error", error)
    }

    if (isSuccess) {
      console.info("login success", data)
      dispatch(saveUserData(data))
      navigate("/admin/management/todo")
    }
  }, [loginResponse, dispatch])

  async function onSubmit(values: LoginFormProps) {
    await login(values)
  }

  return (
    <>
      <Typography
        variant="heading3"
        className="text-purpleHeart-400 text-center mb-4"
      >
        {title}
      </Typography>
      <Button
        onClick={() => {
          navigateRegistration()
        }}
        label={registrationBtnLabel}
        variant="outlined"
        fullWidth
        mode="public"
      />
      <Typography
        variant="body3"
        className="text-fuscousGray-600 text-center my-6"
      >
        {connector}
      </Typography>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="flex gap-6 flex-wrap">
              <div className="w-full">
                <Field name="username">
                  {({ input }) => (
                    <Input
                      id="username"
                      label={formFieldList["username"]}
                      placeholder={
                        defaultPlaceholderPrefix + formFieldList["username"]
                      }
                      {...input}
                    />
                  )}
                </Field>
              </div>
              <div className="w-full">
                <Field name="password">
                  {({ input }) => (
                    <Input
                      id="password"
                      label={formFieldList["password"]}
                      placeholder={
                        defaultPlaceholderPrefix + formFieldList["password"]
                      }
                      type="password"
                      {...input}
                    />
                  )}
                </Field>
              </div>
              <Button
                label={loginBtnLabel}
                type="submit"
                fullWidth
                mode="public"
              />
            </div>
          </form>
        )}
      />
    </>
  )
}

export default Login
