import Input from "components/form/Input"
import type { TableColumnsProps } from "components/Table"
import { useDeleteTodoMutation, useSearchTodoMutation } from "./todoApiSlice"
import SearchTemplate from "components/pageTemplates/SearchTemplate"
import type { SearchFieldList } from "components/pageTemplates/SearchTemplate"
import {
  booleanDropdownField,
  categoryList,
  formatLoginUserDropdown,
} from "@util/constants"
import { Field } from "react-final-form"
import Select from "components/form/Select"
import { useEffect } from "react"
import { Todo } from "models/Todo"
import { useGetInternalLoginUserMutation } from "../../settings/loginUser/loginUserApiSlice"
import { useTranslation } from "react-i18next"
import Textarea from "components/form/Textarea"

const typeList = [
  { value: "ALL", display: "All" },
  { value: "ROLE", display: "Role" },
  { value: "USER", display: "User" },
]

export default function TodoPage() {
  const { t } = useTranslation(["todo", "common"])

  const searchFieldList: SearchFieldList = {
    requiredAllCompleted: t("all-assignees-must-complete"),
    type: t("type", { ns: "common" }),
    category: t("category", { ns: "common" }),
    priority: t("priority", { ns: "common" }),
    owner: t("owner"),
    role: t("role"),
    title: t("title"),
    todoUsers: t("assignees"),
    content: t("content"),
    deadlineAt: t("deadline"),
  }

  const priorityList = [
    { value: "NA", display: "N/A" },
    { value: "LOW", display: "Low" },
    { value: "MEDIUM", display: "Medium" },
    { value: "HIGH", display: "High" },
    { value: "URGENT", display: "Urgent" }
  ]

  const [searchTodo, { data, isLoading }] = useSearchTodoMutation()
  const [deleteTodo, deleteTodoResponse] = useDeleteTodoMutation()

  const [getLoginUserDropdown, getInternalLoginUserDropdownResponse] =
    useGetInternalLoginUserMutation()

  const loginUserDropdownList = getInternalLoginUserDropdownResponse.data || []

  useEffect(() => {
    getLoginUserDropdown({})
  }, [])

  const columns: TableColumnsProps[] = [
    {
      title: t("category", { ns: "common" }),
      key: "category",
      type: "chip",
      variant: "filled",
      chipColor: row =>
        categoryList?.find(
          (c: any) => c.value === row.toString(),
        )?.color ?? "",
      valueRender: row =>
        categoryList?.find(
          (c: any) => c.value === row.toString(),
        )?.display ?? "",
    },
    {
      title: t("owner"),
      key: "owner.username"
    },
    {
      title: t("type", { ns: "common" }),
      key: "type",
      sortable: true,
    },
    {
      title: t("priority"),
      key: "priority",
      sortable: true,
    },
    {
      title: t("role"),
      key: "role.description"
    },
    {
      title: t("title"),
      key: "title",
      sortable: true,
    },
    {
      title: t("content"),
      key: "content",
      sortable: true,
    },
    {
      title: t("assignees"),
      key: "todoUsers",
      type: "list",
      valueRender: row => row?.loginUser?.displayName,
    },
    {
      title: t("all-assignees-must-complete"),
      key: "requiredAllCompleted",
      type: "boolean",
      sortable: true,
    },
    {
      title: t("deadline"),
      key: "deadlineAt",
      type: "number",
      sortable: true,
    },
  ]

  function formatBody(formDatas: { [key: string]: any }) {
    const body: Todo = {
      category: formDatas.category?.value,
      owner: formDatas?.owner?.value,
      type: formDatas?.type?.value,
      priority: formDatas?.priority?.value,
      title: formDatas?.title,
      content: formDatas?.content,
      requiredAllCompleted: !!formDatas?.requiredAllCompleted,
      deadlineAt: formDatas?.deadlineAt
    }
    return body
  }

  function filterForm() {
    return (
      <>
        <div>
          <Field name="type">
            {({ input }) => (
              <Select
                id={"type"}
                options={typeList}
                label={searchFieldList["type"]}
                {...input}
              />
            )}
          </Field>
        </div>
        <div>
          <Field name="category">
            {({ input }) => (
              <Select
                id={"category"}
                options={categoryList}
                label={searchFieldList["category"]}
                {...input}
              />
            )}
          </Field>
        </div>
        <div>
          <Field name="owner">
            {({ input }) => (
              <Select
                id={"owner"}
                options={formatLoginUserDropdown(loginUserDropdownList)}
                label={searchFieldList["owner"]}
                {...input}
              />
            )}
          </Field>
        </div>
        <div>
          <Field name="priority">
            {({ input }) => (
              <Select
                id={"priority"}
                options={priorityList}
                label={searchFieldList["priority"]}
                {...input}
                multiple
              />
            )}
          </Field>
        </div>
        <div>
          <Field name="title">
            {({ input }) => (
              <Input
                id="title"
                label={searchFieldList["title"]}
                {...input}
              />
            )}
          </Field>
        </div>
        <div>
          <Field name="content">
            {({ input }) => (
              <Textarea
                id="content"
                label={searchFieldList["content"]}
                {...input}
              />
            )}
          </Field>
        </div>
        <div>
          <Field name="deadlineAt">
            {({ input }) => (
              <Input
                id="deadlineAt"
                label={searchFieldList["deadlineAt"]}
                placeholder="DD/MM/YYYY HH:MM"
                {...input}
              />
            )}
          </Field>
        </div>
        <div>
          <Field name="requiredAllCompleted">
            {({ input }) => (
              <Select
                id={"requiredAllCompleted"}
                options={booleanDropdownField}
                label={searchFieldList["requiredAllCompleted"]}
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
      type={Todo}
      data={data}
      isLoading={isLoading}
      columns={columns}
      fetchAction={searchTodo}
      deleteAction={deleteTodo}
      deleteResponse={deleteTodoResponse}
      searchFieldList={searchFieldList}
      filterForm={filterForm}
      formatBody={formatBody}
    />
  )
}
