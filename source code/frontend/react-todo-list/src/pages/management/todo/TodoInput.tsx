import Input from "../../../components/form/Input"
import Select from "components/form/Select"
import {
  useGetTodoQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useCompleteTodoMutation,
  useCommentTodoMutation,
} from "./todoApiSlice"
import InputTemplate from "components/pageTemplates/InputTemplate"
import { useParams } from "react-router-dom"
import { skipToken } from "@reduxjs/toolkit/query"
import { Field, Form } from "react-final-form"
import {
  categoryList,
  formatDropdown,
  formatLoginUserDropdown,
} from "@util/constants"
import { useEffect, useMemo, useState } from "react"
import Checkbox from "components/form/Checkbox"
import { useGetRoleDropdownMutation } from "../../settings/role/roleApiSlice"
import { useGetInternalLoginUserMutation } from "../../settings/loginUser/loginUserApiSlice"
import Textarea from "components/form/Textarea"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { selectUserData } from "pages/public/authentication/authApiSlice"
import {
  multipleDropdownRequired,
  required,
  singleDropdownRequired,
  formatMultipleArray,
} from "utils/FormUtil"
import { useTranslation } from "react-i18next"
import Button from "components/form/Button"
import { closeConfirmation, handleConfirmation } from "components/commonSlice"
import { Typography } from "components/Typography"
import Modal from "../../../components/Modal"
import type { TableColumnsProps } from "components/Table"
import Table from "components/Table"

const typeList = [
  { value: "ALL", display: "All" },
  { value: "ROLE", display: "Role" },
  { value: "USER", display: "User" },
]

const priorityList = [
  { value: "NA", display: "N/A" },
  { value: "LOW", display: "Low" },
  { value: "MEDIUM", display: "Medium" },
  { value: "HIGH", display: "High" },
  { value: "URGENT", display: "Urgent" }
]


export default function TodoInput() {
  const { t } = useTranslation(["todo", "common"])

  const commentBtnLabel = t("comment")
  const completeBtnLabel = t("mark-as-complete")

  const formFieldList: { [key: string]: string } = {
    requiredAllCompleted: t("all-assignees-must-complete"),
    type: t("type", { ns: "common" }),
    category: t("category", { ns: "common" }),
    owner: t("owner"),
    role: t("role"),
    todoUsers: t("assignees"),
    priority: t("priority"),
    content: t("content"),
    deadlineAt: t("deadline"),
    title: t('title'),
  }
  const dispatch = useAppDispatch()
  const userData = useAppSelector(selectUserData)

  const { id } = useParams()

  const [isOpenComment, setIsOpenComment] = useState(false)

  const { data, isLoading } = useGetTodoQuery(id ? id : skipToken, {
    refetchOnMountOrArgChange: true,
  })

  const [createTodo, createTodoResponse] = useCreateTodoMutation()
  const [updateTodo, updateTodoResponse] = useUpdateTodoMutation()
  const [completeTodo, completeTodoResponse] = useCompleteTodoMutation()
  const [commentTodo, commentTodoResponse] = useCommentTodoMutation()

  const [getLoginUserDropdown, getInternalLoginUserDropdownResponse] =
    useGetInternalLoginUserMutation()

  const loginUserDropdownList = getInternalLoginUserDropdownResponse.data || []

  const [getRoleDropdown, getRoleDropdownResponse] =
    useGetRoleDropdownMutation()

  const roleDropdownList = getRoleDropdownResponse.data || []

  useEffect(() => {
    getRoleDropdown({})
    getLoginUserDropdown({})
  }, [])

  useEffect(() => {
    if (completeTodoResponse) {
      const { isSuccess, isError } = completeTodoResponse
      if (isSuccess) {
        window.location.reload()
      }
      if (isError) {
        console.error("Complete error")
      }
    }
    if (commentTodoResponse) {
      const { isSuccess, isError } = commentTodoResponse
      if (isSuccess) {
        window.location.reload()
      }
      if (isError) {
        console.error("Comment error")
      }
    }
  }, [completeTodoResponse, commentTodoResponse])

  const commentColumns: TableColumnsProps[] = [
    {
      title: t("username", { ns: "common" }),
      key: "loginUser.displayName",
    },
    {
      title: t("comment"),
      key: "comment",
    },
    {
      title: t("commented-at"),
      key: "commentedAt",
    },
  ]

  function formatBody(formDatas: { [key: string]: any }) {
    const body = {
      requiredAllCompleted: formDatas.requiredAllCompleted,
      type: formDatas.type.value,
      category: formDatas.category.value,
      priority: formDatas.priority.value,
      role:
        formDatas.type.value === "ROLE" ? { id: formDatas?.role?.value } : null,
      owner: { id: userData?.id },
      content: formDatas.content,
      todoUsers:
        formDatas.type.value === "USER"
          ? formDatas?.todoUsers?.map((e: { value: string }) => ({
              loginUser: { id: e.value },
            }))
          : null,
      title: formDatas.title,
      deadlineAt: formDatas.deadlineAt,
    }

    return body
  }

  const initialValues = useMemo(
    () => ({
      requiredAllCompleted: !!data?.requiredAllCompleted,
      type:
        typeList.find((c: any) => c.value === data?.type.toString()) ?? null,
      category:
        categoryList.find((c: any) => c.value === data?.category.toString()) ??
        null,
      priority:
        priorityList.find((c: any) => c.value === data?.priority.toString()) ??
        null,
      owner: userData?.name,
      role:
        formatDropdown(roleDropdownList).find(
          (c: any) => c.value == data?.role?.id,
        ) ?? null,
      content: data?.content,
      deadlineAt: data?.deadlineAt,
      title: data?.title,
      todoUsers: formatMultipleArray(
        formatLoginUserDropdown(loginUserDropdownList),
        data?.todoUsers,
        e => e.loginUser.id.toString(),
      ),
    }),
    [data, loginUserDropdownList, roleDropdownList],
  )

  function handleComment() {
    setIsOpenComment(true)
  }

  function handleComplete() {
    dispatch(
      handleConfirmation({
        title: t("mark-complete-modal-title"),
        content: t("mark-complete-modal-content"),
        confirmLabel: t("confirm"),
        reject: () => {
          dispatch(closeConfirmation())
        },
        resolve: () => {
          if (id) {
            completeTodo(id)
          }
        },
      }),
    )
  }

  async function onSubmitComment(values: any) {
    if (values?.comment && id) {
      await commentTodo({ id: id, body: values?.comment })
    }
  }

  function inputForm(inputFormFn: any) {
    return (
      <>
        <Modal
          isOpen={isOpenComment}
          setIsOpen={setIsOpenComment}
          title={t("comment")}
          content={
            <>
              <Form
                onSubmit={onSubmitComment}
                render={({ handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <div>
                      <Field name="comment">
                        {({ input }) => (
                          <Input id="comment" label={""} {...input} />
                        )}
                      </Field>
                    </div>
                    <div className="flex">
                      <div className="ml-auto">
                        <Button
                          label={t("add") + commentBtnLabel}
                          type="submit"
                        />
                      </div>
                    </div>
                  </form>
                )}
              />
            </>
          }
        />
        {id && (
          <div className="flex gap-2 mb-4 justify-between">
            <Button
              label={commentBtnLabel}
              variant={"filled"}
              color="lightningYellow"
              onClick={handleComment}
            />
            {!data?.completedAt ? (
              <Button
                label={completeBtnLabel}
                variant={"filled"}
                color="purpleHeart"
                onClick={handleComplete}
                disabled={data?.completedAt}
              />
            ) : (
              <div className="flex">
                <Typography
                  variant="mediumBody3"
                  className="ml-auto items-center"
                >
                  {t("completed-at") + data?.completedAt}
                </Typography>
              </div>
            )}
          </div>
        )}
        <div>
          <Field name="owner" disabled>
            {({ input }) => (
              <Input
                id="owner"
                label={formFieldList["owner"]}
                disabled
                {...input}
              />
            )}
          </Field>
        </div>
        <div>
          <Field
            name="type"
            validate={singleDropdownRequired}
            parse={value => {
              if (value.value !== "USER") {
                inputFormFn.setValue("todoUsers", undefined)
              }
              if (value.value !== "ROLE") {
                inputFormFn.setValue("role", undefined)
              }
              return value
            }}
            disabled={id}
          >
            {({ input, meta }) => (
              <Select
                id={"type"}
                options={typeList}
                label={formFieldList["type"]}
                isError={meta.error && meta.touched}
                errorText={meta.error}
                {...input}
                disabled={id !== undefined}
              />
            )}
          </Field>
        </div>
        <div>
          <Field
            name="category"
            disabled={id}
            validate={singleDropdownRequired}
          >
            {({ input, meta }) => (
              <Select
                id={"category"}
                options={categoryList}
                label={formFieldList["category"]}
                isError={meta.error && meta.touched}
                errorText={meta.error}
                {...input}
                disabled={id !== undefined}
              />
            )}
          </Field>
        </div>
        <div>
          <Field
            name="priority"
            disabled={id}
            validate={singleDropdownRequired}
          >
            {({ input, meta }) => (
              <Select
                id={"priority"}
                options={priorityList}
                label={formFieldList["priority"]}
                isError={meta.error && meta.touched}
                errorText={meta.error}
                {...input}
                disabled={id !== undefined}
              />
            )}
          </Field>
        </div>
        {inputFormFn.values?.type?.value === "ROLE" && (
          <div>
            <Field name="role" disabled={id} validate={singleDropdownRequired}>
              {({ input, meta }) => (
                <Select
                  id={"role"}
                  options={formatDropdown(roleDropdownList)}
                  label={formFieldList["role"]}
                  isError={meta.error && meta.touched}
                  errorText={meta.error}
                  {...input}
                  disabled={id !== undefined}
                />
              )}
            </Field>
          </div>
        )}
        {inputFormFn.values?.type?.value === "USER" && (
          <div>
            <Field
              name="todoUsers"
              disabled={id}
              validate={multipleDropdownRequired}
            >
              {({ input, meta }) => (
                <Select
                  id={"todoUsers"}
                  options={formatLoginUserDropdown(loginUserDropdownList)}
                  label={formFieldList["todoUsers"]}
                  isError={meta.error && meta.touched}
                  errorText={meta.error}
                  multiple
                  {...input}
                  disabled={id !== undefined}
                />
              )}
            </Field>
          </div>
        )}
        <div>
          <Field name="title" validate={required}>
            {({ input, meta }) => (
              <Input
                id="title"
                label={formFieldList["title"]}
                isError={meta.error && meta.touched}
                errorText={meta.error}
                {...input}
              />
            )}
          </Field>
        </div>
        <div>
          <Field name="content" validate={required}>
            {({ input, meta }) => (
              <Textarea
                id="content"
                label={formFieldList["content"]}
                isError={meta.error && meta.touched}
                errorText={meta.error}
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
                label={formFieldList["deadlineAt"]}
                placeholder="DD/MM/YYYY HH:MM"
                {...input}
              />
            )}
          </Field>
        </div>
        <div>
          <Field name="requiredAllCompleted" type="checkbox" disabled={id}>
            {({ input }) => (
              <Checkbox
                id={"requiredAllCompleted"}
                description={formFieldList["requiredAllCompleted"]}
                {...input}
                disabled={id !== undefined}
              />
            )}
          </Field>
        </div>
        {data?.todoComments && (
          <Table
            rows={data?.todoComments}
            columns={commentColumns}
            permission={"read"}
            enablePagination={false}
          />
        )}
      </>
    )
  }

  return (
    <InputTemplate
      isLoading={isLoading}
      initialValues={initialValues}
      inputForm={inputForm}
      formatBody={formatBody}
      createAction={createTodo}
      createResponse={createTodoResponse}
      editAction={updateTodo}
      editResponse={updateTodoResponse}
      id={id}
    />
  )
}
