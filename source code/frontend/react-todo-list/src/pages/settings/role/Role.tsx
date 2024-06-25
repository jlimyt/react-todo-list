import Input from "../../../components/form/Input"
import type { TableColumnsProps } from "components/Table"
import { useDeleteRoleMutation, useSearchRoleMutation } from "./roleApiSlice"
import { Field } from "react-final-form"
import SearchTemplate from "components/pageTemplates/SearchTemplate"
import type { SearchFieldList } from "components/pageTemplates/SearchTemplate"
import { useTranslation } from "react-i18next"
import { Role } from "models/security/Role"

export default function RolePage() {
  const { t } = useTranslation(["common"])
  const searchFieldList: SearchFieldList = {
    code: t("code"),
    description: t("description.normal"),
  }

  const [searchRole, { data, isLoading }] = useSearchRoleMutation()
  const [deleteRole, deleteRoleResponse] = useDeleteRoleMutation()

  const columns: TableColumnsProps[] = [
    {
      title: t("code"),
      key: "code",
      sortable: true,
    },
    {
      title: t("description.normal"),
      key: "description",
      sortable: true,
    },
  ]

  function formatBody(formDatas: { [key: string]: any }) {
    const body: any = {
      code: formDatas?.code,
      description: formDatas?.description,
    }
    return body
  }

  function filterForm() {
    return (
      <>
        <div>
          <Field name="code">
            {({ input }) => (
              <Input id="code" label={searchFieldList["code"]} {...input} />
            )}
          </Field>
        </div>
        <div>
          <Field name="description">
            {({ input }) => (
              <Input
                id="description"
                label={searchFieldList["description"]}
                {...input}
              />
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
      fetchAction={searchRole}
      deleteAction={deleteRole}
      deleteResponse={deleteRoleResponse}
      searchFieldList={searchFieldList}
      filterForm={filterForm}
      formatBody={formatBody}
      type={Role}
    />
  )
}
