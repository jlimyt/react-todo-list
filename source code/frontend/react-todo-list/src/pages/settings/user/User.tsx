import Input from "../../../components/form/Input"
import type { TableColumnsProps } from "components/Table"
import { useDeleteUserMutation, useSearchUserMutation } from "./userApiSlice"
import { useGetRoleDropdownMutation } from "../role/roleApiSlice"
import { Field } from "react-final-form"
import SearchTemplate from "components/pageTemplates/SearchTemplate"
import type { SearchFieldList } from "components/pageTemplates/SearchTemplate"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"

export default function UserPage() {
  const { t } = useTranslation(["common"])

  const searchFieldList: SearchFieldList = {
    username: t("username"),
    displayName: t("display-name"),
    phoneNo: t("phone-number"),
    email: t("email"),
    loginUserRoles: t("user-roles"),
  }

  const [searchUser, { data, isLoading }] = useSearchUserMutation()
  const [deleteUser, deleteUserResponse] = useDeleteUserMutation()

  const columns: TableColumnsProps[] = [
    {
      title: t("username"),
      key: "username",
      sortable: true,
    },
    {
      title: t("display-name"),
      key: "displayName",
      sortable: true,
    },
    {
      title: t("email"),
      key: "email",
      sortable: true,
    },
    {
      title: t("user-roles"),
      key: "loginUserRoles",
      type: "list",
      valueRender: item => item?.role?.description,
    },
  ]

  function formatBody(formDatas: { [key: string]: any }) {
    const body: any = {
      username: formDatas?.username,
      displayName: formDatas?.displayName,
      email: formDatas?.email
    }
    return body
  }

  function filterForm() {
    return (
      <>
        <div>
          <Field name="username">
            {({ input }) => (
              <Input
                id="username"
                label={searchFieldList["username"]}
                {...input}
              />
            )}
          </Field>
        </div>
        <div>
          <Field name="displayName">
            {({ input }) => (
              <Input
                id="displayName"
                label={searchFieldList["displayName"]}
                {...input}
              />
            )}
          </Field>
        </div>
        <div>
          <Field name="email">
            {({ input }) => (
              <Input id="email" label={searchFieldList["email"]} {...input} />
            )}
          </Field>
        </div>
      </>
    )
  }

  return (
    <SearchTemplate
      data={data}
      isLoading={isLoading}
      columns={columns}
      fetchAction={searchUser}
      deleteAction={deleteUser}
      deleteResponse={deleteUserResponse}
      searchFieldList={searchFieldList}
      filterForm={filterForm}
      formatBody={formatBody}
      type={{}}
    />
  )
}
