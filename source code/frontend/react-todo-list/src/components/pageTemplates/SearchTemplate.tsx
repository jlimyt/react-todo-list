import Table from "components/Table"
import { CloseIcon, AddIcon, DeleteIcon, FilterIcon } from "@icons/index"
import Button from "components/form/Button"
import { Typography } from "components/Typography"
import { useSearchParams, useLocation, useNavigate } from "react-router-dom"
import { useAppDispatch } from "app/hooks"
import { closeConfirmation, handleConfirmation } from "components/commonSlice"
import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { Form } from "react-final-form"
import Modal from "components/Modal"
import type { TableColumnsProps } from "components/Table"
import type { inputFormFn } from "./InputTemplate"
import { useTranslation } from "react-i18next"

export type SearchFieldList = { [key: string]: string }

interface SearchTemplateProps {
  data: any
  columns: TableColumnsProps[]
  fetchAction: any
  deleteAction: any
  deleteResponse: any
  searchFieldList: SearchFieldList
  filterForm: (inputFormFn: inputFormFn) => ReactNode
  formatBody: (formDatas: { [key: string]: any }) => Object
  type: Object
  isLoading?: boolean
  permission?: "all" | "edit" | "read"
  mode?: "server" | "client"
  enablePagination?: boolean
}

function SearchTemplate({
  data,
  columns,
  fetchAction,
  deleteAction,
  deleteResponse,
  searchFieldList,
  filterForm,
  formatBody,
  type,
  isLoading,
  permission = "all",
  mode = "server",
  enablePagination = true,
}: SearchTemplateProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [payload, setPayload] = useState<typeof type | null>(null)
  const [isOpenFilter, setIsOpenFilter] = useState(false)
  const [page, setPage] = useState(0)

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const rows = data?.content || []
  const totalPages = data?.totalPages || 0

  const searchParamsQuery = JSON.parse(searchParams.get("query") || "{}")

  function handleCreate() {
    navigate(location.pathname + "/create")
  }
  function handleEdit(id: number) {
    navigate(location.pathname + "/edit/" + id)
  }

  const { t } = useTranslation(["search", "common"])

  function handleDelete() {
    dispatch(
      handleConfirmation({
        title: t("delete-title", { ns: "dialog", count: selectedRows.length }),
        content: t("delete-content", {
          ns: "dialog",
          count: selectedRows.length,
        }),
        confirmLabel: t("delete"),
        reject: () => {
          dispatch(closeConfirmation())
        },
        resolve: () => {
          deleteAction({ body: selectedRows })
        },
      }),
    )
  }

  useEffect(() => {
    if (deleteResponse?.isSuccess) {
      setPage(0)
      fetchAction({
        body: {},
        query: { page: 0, size: 10 },
      })
      setSelectedRows([])
    }
  }, [deleteResponse])

  useEffect(() => {
    onSubmit(searchParamsQuery)
  }, [])

  async function onSubmit(formDatas: { [key: string]: any }) {
    for (const formData in formDatas) {
      if (typeof formDatas[formData] == "object") {
        if (formDatas[formData].value == null && !formDatas[formData].length) {
          delete formDatas[formData]
        }
      } else if (typeof formDatas[formData] == "string") {
        if (formDatas[formData] == "") {
          delete formDatas[formData]
        }
      }
    }
    setSearchParams({ query: JSON.stringify(formDatas) })
    const body = formatBody(formDatas)
    setPayload(body)
    setIsOpenFilter(false)
  }

  function modifyQuery(key: string) {
    delete searchParamsQuery[key]
    onSubmit(searchParamsQuery)
  }

  function handleOpenFilter() {
    setIsOpenFilter(true)
  }

  return (
    <div>
      <Modal
        isOpen={isOpenFilter}
        setIsOpen={setIsOpenFilter}
        title={t("filter")}
        content={
          <Form
            initialValues={searchParamsQuery}
            onSubmit={onSubmit}
            mutators={{
              setValue: ([field, value], state, { changeValue }) => {
                changeValue(state, field, () => value)
              },
            }}
            render={({
              handleSubmit,
              form: {
                mutators: { setValue },
              },
              form,
              values,
              pristine,
            }) => (
              <form onSubmit={handleSubmit}>
                {filterForm({ setValue, values })}
                <br />
                <div className="flex justify-between">
                  <Button
                    label={t("reset")}
                    onClick={() => form.initialize({})}
                    color="cinnabar"
                    variant="tonal"
                    type="reset"
                    disabled={pristine}
                  />
                  <Button label={t("search")} type="submit" />
                </div>
              </form>
            )}
          />
        }
      />
      <div className="mx-4 mt-4 mb-2 flex justify-between">
        <div className="flex gap-1 items-center">
          {permission === "all" && (
            <>
              <Button
                label={t("create")}
                variant="text"
                icon={<AddIcon />}
                onClick={handleCreate}
              />
              <div className="border-l h-4 border-fuscousGray-800"></div>
              <Button
                label={t("delete")}
                variant="text"
                icon={<DeleteIcon />}
                color="cinnabar"
                onClick={handleDelete}
                disabled={selectedRows.length <= 0}
              />
            </>
          )}
        </div>
        <div>
          <Button
            label={t("filter")}
            variant={
              Object.keys(searchParamsQuery).length > 0 ? "tonal" : "text"
            }
            icon={<FilterIcon />}
            color="fuscousGray"
            onClick={handleOpenFilter}
          />
        </div>
      </div>
      {Object.keys(searchParamsQuery).length > 0 && (
        <>
          <hr className="text-fuscousGray-100" />
          <div className="flex gap-4 mx-4 my-3">
            {Object.keys(searchParamsQuery).map(queryItem => {
              return (
                <div
                  className="rounded-sm bg-fuscousGray-100 flex gap-2 py-1 px-2"
                  key={queryItem}
                >
                  <button onClick={() => modifyQuery(queryItem)}>
                    <CloseIcon className="fill-outerSpace-950 w-4 h-4" />
                  </button>
                  <Typography variant="mediumBody3">
                    {searchFieldList[queryItem]}
                  </Typography>
                </div>
              )
            })}
          </div>
        </>
      )}
      <div className="mx-4">
        <Table
          rows={rows}
          columns={columns}
          totalPages={totalPages}
          fetchApi={fetchAction}
          payload={payload}
          setSelectedRows={setSelectedRows}
          selectedRows={selectedRows}
          setEdit={handleEdit}
          page={page}
          setPage={setPage}
          permission={permission}
          mode={mode}
          enablePagination={enablePagination}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default SearchTemplate
