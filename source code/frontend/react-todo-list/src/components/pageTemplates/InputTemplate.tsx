import { Form, FormSpy } from "react-final-form"
import Button from "components/form/Button"
import { useLocation, useNavigate } from "react-router-dom"
import useNavigationDialog from "components/confirmationDialog/NavigationDialog"
import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import arrayMutators from "final-form-arrays"
import { useTranslation } from "react-i18next"

export interface inputFormFn {
  setValue?: () => void
  values?: { [key: string]: any }
}

interface InputTemplateProps {
  initialValues: any
  inputForm: (inputFormFn: inputFormFn) => ReactNode
  formatBody: (formDatas: { [key: string]: any }) => Object
  createAction: any
  createResponse: any
  editAction: any
  editResponse: any
  id?: string
  editOnly?: boolean
  isLoading?: boolean
}

function InputTemplate({
  initialValues,
  inputForm,
  formatBody,
  createAction,
  createResponse,
  editAction,
  editResponse,
  id,
  editOnly = false,
  isLoading,
}: InputTemplateProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const mode = location.pathname.includes("/create") ? "create" : "edit"
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [isFormSubmitSucceeded, setIsFormSubmitSucceeded] = useState(false)

  async function onSubmit(formDatas: { [key: string]: any }) {
    console.info("Entered create")
    for (const formData in formDatas) {
      if (!(formDatas[formData] instanceof Array)) {
        if (typeof formDatas[formData] == "object") {
          if (formDatas[formData]?.value == null) {
            delete formDatas[formData]
          }
        }
      } else {
        formDatas[formData] =
          formDatas[formData].filter(
            (value: any) => Object.keys(value || {}).length !== 0,
          ) ?? null
      }
    }

    const formattedFormData = formatBody(formDatas)

    if (mode === "create") {
      createAction({ body: formattedFormData })
    } else {
      editAction({
        body: {
          id,
          ...formattedFormData,
        },
      })
    }
  }

  useNavigationDialog(isFormDirty, isFormSubmitSucceeded)

  useEffect(() => {
    if (createResponse) {
      const { isSuccess, isError } = createResponse

      if (isSuccess) {
        navigate(-1)
      }
      if (isError) {
        console.error("createResponse (error) = ", createResponse.error)
      }
    }
  }, [createResponse])

  useEffect(() => {
    const { isSuccess, isError } = editResponse

    // if there aren't any createAction, refresh current page instead
    if (isSuccess) {
      if (createAction || editOnly) {
        navigate(-1)
      } else {
        window.location.reload()
      }
    }
    if (isError) {
      console.error("editResponse (error) = ", editResponse.error)
    }
  }, [editResponse])

  const { t } = useTranslation(["input", "common"])

  return (
    <div className="p-6">
      {isLoading ? (
        <div className={`animate-pulse space-x-4 flex`}>
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="h-6 bg-fuscousGray-200 rounded-sm"></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-12 bg-fuscousGray-200 rounded-sm col-span-2"></div>
              <div className="h-12 bg-fuscousGray-200 rounded-sm col-span-1"></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-12 bg-fuscousGray-200 rounded-sm col-span-1"></div>
              <div className="h-12 bg-fuscousGray-200 rounded-sm col-span-2"></div>
            </div>
            <div className="h-12 bg-fuscousGray-200 rounded-sm"></div>
          </div>
        </div>
      ) : (
        <Form
          initialValues={initialValues}
          onSubmit={onSubmit}
          mutators={{
            ...arrayMutators,
            setValue: ([field, value], state, { changeValue }) => {
              changeValue(state, field, () => value)
            },
          }}
          render={({
            handleSubmit,
            form: {
              mutators: { setValue },
            },
            values,
          }) => (
            <form onSubmit={handleSubmit}>
              {inputForm({ setValue, values })}
              <div className="flex justify-end gap-x-4">
                <Button
                  label={t("cancel")}
                  onClick={() => {
                    navigate(-1)
                  }}
                  color="fuscousGray"
                  variant="tonal"
                />
                <Button
                  disabled={!isFormDirty}
                  label={mode === "create" ? t("create-new-record") : t("save")}
                  type="submit"
                />
              </div>
              <FormSpy
                subscription={{ dirty: true, submitSucceeded: true }}
                onChange={props => {
                  if (props.dirty) {
                    setIsFormDirty(true)
                  }
                  if (props.submitSucceeded) {
                    setIsFormSubmitSucceeded(true)
                  }
                }}
              />
            </form>
          )}
        />
      )}
    </div>
  )
}

export default InputTemplate
