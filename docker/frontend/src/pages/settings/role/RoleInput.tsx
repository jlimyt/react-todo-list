import Input from "components/form/Input"
import InputTemplate from "components/pageTemplates/InputTemplate"
import { useParams } from "react-router-dom"
import { skipToken } from "@reduxjs/toolkit/query"
import { Field } from "react-final-form"
import { useMemo } from "react"
import {
  useCreateRoleMutation,
  useGetRoleQuery,
  useUpdateRoleMutation,
} from "./roleApiSlice"
import { required } from "utils/FormUtil"
import { useTranslation } from "react-i18next"
import SectionTitle from "components/form/SectionTitle"

export default function RoleInput() {
  const { t } = useTranslation(["common"])
  const formFieldList: { [key: string]: string } = {
    code: t("code"),
    description: t("description.normal"),
  }

  const { id } = useParams()

  const { data, isLoading } = useGetRoleQuery(id ? id : skipToken, {
    refetchOnMountOrArgChange: true,
  })

  const [createRole, createRoleResponse] = useCreateRoleMutation()
  const [updateRole, updateRoleResponse] = useUpdateRoleMutation()

  function formatBody(formDatas: { [key: string]: any }) {
    const body = {
      code: formDatas.code,
      description: formDatas.description,
    }

    return body
  }

  const initialValues = useMemo(
    () => ({
      code: data?.code,
      description: data?.description,
    }),
    [data],
  )

  function inputForm() {
    return (
      <>
        <SectionTitle />
        <div>
          <Field name="code" validate={required}>
            {({ input, meta }) => (
              <Input
                id="code"
                label={formFieldList["code"]}
                isError={meta.error && meta.touched}
                errorText={meta.error}
                {...input}
              />
            )}
          </Field>
        </div>
        <div>
          <Field name="description" validate={required}>
            {({ input, meta }) => (
              <Input
                id="description"
                label={formFieldList["description"]}
                isError={meta.error && meta.touched}
                errorText={meta.error}
                {...input}
              />
            )}
          </Field>
        </div>
      </>
    )
  }

  return (
    <InputTemplate
      isLoading={isLoading}
      initialValues={initialValues}
      inputForm={inputForm}
      formatBody={formatBody}
      createAction={createRole}
      createResponse={createRoleResponse}
      editAction={updateRole}
      editResponse={updateRoleResponse}
      id={id}
    />
  )
}
