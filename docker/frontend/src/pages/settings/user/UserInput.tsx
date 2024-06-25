import Input from "components/form/Input"
import InputTemplate from "components/pageTemplates/InputTemplate"
import { useParams } from "react-router-dom"
import { skipToken } from "@reduxjs/toolkit/query"
import { Field } from "react-final-form"
import { useEffect, useMemo } from "react"
import {
  useCreateUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
} from "./userApiSlice"
import { useGetRoleDropdownMutation } from "../role/roleApiSlice"
import {
  composeValidators,
  formatMultipleArray,
  multipleDropdownRequired,
  required,
  validEmail,
  validPassword,
} from "utils/FormUtil"
import { useTranslation } from "react-i18next"
import SectionTitle from "components/form/SectionTitle"
import Select from "components/form/Select"
import { formatDropdown } from "@util/constants"

export default function UserInput() {
  const { t } = useTranslation(["common"])

  const formFieldList: { [key: string]: string } = {
    username: t("username"),
    displayName: t("display-name"),
    password: t("password"),
    email: t("email"),
    loginUserRoles: t("user-roles"),
  }

  const { id } = useParams()

  const { data, isLoading } = useGetUserQuery(id ? id : skipToken, {
    refetchOnMountOrArgChange: true,
  })

  const [createUser, createUserResponse] = useCreateUserMutation()
  const [updateUser, updateUserResponse] = useUpdateUserMutation()

  const [getRoleDropdown, getRoleDropdownResponse] =
    useGetRoleDropdownMutation()
  const roleDropdownList = getRoleDropdownResponse.data || []

  useEffect(() => {
    getRoleDropdown({})
  }, [])

  function formatBody(formDatas: { [key: string]: any }) {
    const body = {
      username: formDatas.username,
      displayName: formDatas.displayName,
      loginUserRoles: formDatas.loginUserRoles?.map((e: { value: string }) => ({
        id: data?.loginUserRoles?.find((r:any) => r.role.id === e.value)?.id,
        role: { id: e.value },
      })).concat(data?.loginUserRoles?.filter?.((r:any) => !formDatas.loginUserRoles?.map((e: { value: string }) => 
        e.value).includes(r.role.id)).map((r:any) => {
          var temp = Object.assign({}, r);
          temp.active = false;
          return temp;
        })),
      password: formDatas.password,
      phoneNo: formDatas.phoneNo,
      email: formDatas.email,
      active: true,
      enable: true,
    }

    return body
  }

  const initialValues = useMemo(
    () => ({
      loginUserRoles: formatMultipleArray(
        formatDropdown(roleDropdownList),
        data?.loginUserRoles,
        e => e.role.id.toString(),
      ),
      username: data?.username,
      displayName: data?.displayName,
      password: data?.password,
      phoneNo: data?.phoneNo,
      email: data?.email,
    }),
    [data, roleDropdownList],
  )

  function inputForm() {
    return (
      <>
        <SectionTitle />
        <div>
          <Field
            name="email"
            validate={composeValidators(required, validEmail)}
          >
            {({ input, meta }) => (
              <Input
                id="email"
                label={formFieldList["email"]}
                isError={meta.error && meta.touched}
                errorText={meta.error}
                {...input}
              />
            )}
          </Field>
        </div>
        <div>
          <Field name="displayName" validate={required}>
            {({ input, meta }) => (
              <Input
                id="displayName"
                label={formFieldList["displayName"]}
                isError={meta.error && meta.touched}
                errorText={meta.error}
                {...input}
              />
            )}
          </Field>
        </div>
        <div>
          <Field name="username" validate={required}>
            {({ input, meta }) => (
              <Input
                id="username"
                label={formFieldList["username"]}
                isError={meta.error && meta.touched}
                errorText={meta.error}
                {...input}
              />
            )}
          </Field>
        </div>
        {!id && (
          <div>
            <Field
              name="password"
              validate={composeValidators(required, validPassword)}
            >
              {({ input, meta }) => (
                <Input
                  id="password"
                  label={formFieldList["password"]}
                  isError={meta.error && meta.touched}
                  errorText={meta.error}
                  {...input}
                />
              )}
            </Field>
          </div>
        )}
        <div>
          <Field name="loginUserRoles" validate={multipleDropdownRequired}>
            {({ input, meta }) => {
              return (
                <Select
                  id={"loginUserRoles"}
                  options={formatDropdown(roleDropdownList)}
                  label={formFieldList["loginUserRoles"]}
                  multiple
                  isError={meta.error && meta.touched}
                  errorText={meta.error}
                  {...input}
                />
              )
            }}
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
      createAction={createUser}
      createResponse={createUserResponse}
      editAction={updateUser}
      editResponse={updateUserResponse}
      id={id}
    />
  )
}
