import { useEffect, useState } from "react"
import type { Dispatch, SetStateAction } from "react"
import { Typography } from "./Typography"
import {
  SortIcon,
  LeftNavigationIcon,
  RightNavigationIcon,
  CheckboxCheckedIcon,
  CheckboxUnCheckedIcon,
  EditIcon,
  SortAscendIcon,
  SortDescendIcon,
  CheckIcon,
  CloseIcon,
} from "@icons/index"
import Select from "./form/Select"
import Chip from "./Chip"
import "./layout.css"
import { useTranslation } from "react-i18next"

export interface TableColumnsProps {
  title: string
  key: string
  type?: "text" | "number" | "boolean" | "list" | "chip"
  variant?: "outlined" | "filled"
  chipColor?: (row: any) => string
  sortable?: boolean
  valueRender?: (row: any) => string
  color?: string
}

export interface TableColumnsSortingProps {
  key: String
  sortingOrder: string
}
interface TableProps {
  rows: any[]
  columns: TableColumnsProps[]
  totalPages?: number
  selectedRows?: number[]
  setSelectedRows?: Dispatch<SetStateAction<number[]>>
  setEdit?: (id: number) => void
  fetchApi?: any
  payload?: any
  page?: number
  setPage?: Dispatch<SetStateAction<number>>
  isLoading?: boolean
  permission?: "all" | "edit" | "read"
  mode?: "server" | "client"
  enablePagination?: boolean
}

interface PaginationProps {
  pageSize: number
  setPageSize: Dispatch<SetStateAction<number>>
  page: number
  setPage: Dispatch<SetStateAction<number>>
  totalPages: number
}

export const Pagination = ({
  pageSize,
  setPageSize,
  page,
  setPage,
  totalPages,
}: PaginationProps) => {
  const pageSizeOptions = [
    { value: 10, display: 10 },
    { value: 20, display: 20 },
    { value: 50, display: 50 },
  ]
  const pageOptions = Array.from({ length: totalPages }).map((_e, i) => ({
    value: i,
    display: i + 1,
  }))

  const { t } = useTranslation("table")

  return (
    <div className="flex justify-between">
      <div className="flex gap-2 items-center">
        <Typography variant="body3">{t("rows-per-page")}</Typography>
        <div className="w-20">
          <Select
            id={"page-size"}
            options={pageSizeOptions}
            value={pageSizeOptions.find(x => x.value == pageSize)}
            onChange={e => {
              setPageSize(+(e.value || 0))
              setPage(0)
            }}
            size="small"
            gutter={false}
          />
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <button
          onClick={() => {
            if (page > 0) {
              setPage(page - 1)
            }
          }}
          className="rounded-full p-2 hover:bg-purpleHeart-300/50 active:bg-purpleHeart-300/75"
        >
          <LeftNavigationIcon className="fill-outerSpace-950" />
        </button>
        <div className="w-20">
          <Select
            id={"page-number"}
            options={pageOptions}
            value={pageOptions.find(x => x.value == page)}
            onChange={e => setPage(+(e.value || 0))}
            size="small"
            gutter={false}
          />
        </div>
        <Typography variant="body3">
          {t("of-total-pages", { totalPages: totalPages })}
        </Typography>
        <button
          onClick={() => {
            if (page < totalPages - 1) {
              setPage(page + 1)
            }
          }}
          className="rounded-full p-2 hover:bg-purpleHeart-300/50 active:bg-purpleHeart-300/75"
        >
          <RightNavigationIcon className="fill-outerSpace-950" />
        </button>
      </div>
    </div>
  )
}

function Table({
  rows,
  columns,
  totalPages,
  selectedRows,
  setSelectedRows,
  setEdit,
  fetchApi,
  payload,
  page,
  setPage,
  isLoading,
  permission = "edit",
  mode = "server",
  enablePagination = true,
}: TableProps) {
  const [pageSize, setPageSize] = useState(10)
  const [sort, setSort] = useState<TableColumnsSortingProps[]>([])

  useEffect(() => {
    if (mode === "server" && fetchApi) {
      fetchApi({
        body: payload || {},
        query: { page: page, size: pageSize },
        sort: sort,
      })
    }
    setSelectedRows && setSelectedRows([])
  }, [page, pageSize, payload, sort])

  const isAllRowsSelected =
    rows.length > 0 && rows?.every(r => selectedRows?.includes(r.id))

  function selectRows(rowsToBeSelected: any) {
    if (selectedRows && setSelectedRows) {
      switch (typeof rowsToBeSelected) {
        case "string": {
          const rowIds = rows.map(r => r.id)
          const nonOverlappingRows = selectedRows.filter(
            s => !rowIds.includes(s),
          )
          if (!isAllRowsSelected) {
            // select all rows

            // avoid duplicate selection
            setSelectedRows(rowIds.concat(nonOverlappingRows))
          } else {
            // deselect all rows
            setSelectedRows(nonOverlappingRows)
          }
          break
        }
        case "number": {
          if (!selectedRows.includes(rowsToBeSelected)) {
            setSelectedRows(selectedRows.concat(rowsToBeSelected))
          } else {
            setSelectedRows(selectedRows.filter(s => s !== rowsToBeSelected))
          }
          break
        }
      }
    }
  }

  function generateClickBox(
    triggerState: boolean,
    mode: string | number,
    checkBoxColor: string,
  ) {
    return (
      <button
        disabled={rows.length === 0}
        onClick={() => {
          selectRows(mode)
        }}
      >
        {triggerState ? (
          <CheckboxCheckedIcon className={checkBoxColor} />
        ) : (
          <CheckboxUnCheckedIcon className={checkBoxColor} />
        )}
      </button>
    )
  }

  function sortRows(column: String) {
    const sortingItem = sort.find(s => s.key === column)
    if (sortingItem) {
      switch (sortingItem.sortingOrder) {
        case "asc":
          setSort(
            sort?.map(s =>
              s.key === sortingItem.key ? { ...s, sortingOrder: "desc" } : s,
            ),
          )
          break
        case "desc":
          setSort(sort.filter(s => s.key !== column))
          break
      }
    } else {
      setSort(sort.concat({ key: column, sortingOrder: "asc" }))
    }
  }

  const editPermission = ["all", "edit"]

  return (
    <>
      <div className={`${isLoading ? "fade-out" : "fade-in"}`}>
        {rows.length > 0 ? (
          <>
            <div className="overflow-auto fade-in">
              <table
                className={`table-auto w-full h-full cell-border strip-table-hover`}
              >
                <thead>
                  <tr className=" text-left">
                    {columns.map((column, columnIndex) => (
                      <th key={column.key} className={`py-2 px-3`}>
                        <div className="flex justify-between items-center gap-2">
                          <div className="flex gap-3 items-center w-full">
                            {columnIndex === 0 && permission === "all" ? (
                              <>
                                {generateClickBox(
                                  isAllRowsSelected,
                                  "all",
                                  "fill-outerSpace-950",
                                )}
                                <button disabled>
                                  <EditIcon />
                                </button>
                              </>
                            ) : null}
                            <Typography
                              variant="mediumBody4"
                              className={`w-full ${column.type == "number" ? "text-right" : ""}`}
                            >
                              {column.title}
                            </Typography>
                          </div>
                          {column.sortable && (
                            <button
                              disabled={rows.length === 0}
                              onClick={() => {
                                sortRows(column.key)
                              }}
                            >
                              {sort.find(s => s.key === column.key) ? (
                                sort.find(s => s.key === column.key)
                                  ?.sortingOrder === "asc" ? (
                                  <SortAscendIcon className="fill-outerSpace-950 " />
                                ) : (
                                  <SortDescendIcon className="fill-outerSpace-950 " />
                                )
                              ) : (
                                <SortIcon className="fill-outerSpace-950 " />
                              )}
                            </button>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr
                      className="border-t border-fuscousGray-100"
                      key={rowIndex + "_row"}
                    >
                      {columns.map((column, columnIndex) => {
                        const variant = column?.variant ?? "outlined"
                        var value = column.key.split(".").reduce(function (
                          a,
                          c,
                        ) {
                          return (a || {})[c]
                        }, row)
                        return (
                          <td
                            className={`py-2 px-3 h-full ${columnIndex === 0 ? "flex items-center gap-3" : ""}`}
                            key={columnIndex + "_column"}
                          >
                            {columnIndex === 0 ? (
                              <>
                                {permission === "all" &&
                                  generateClickBox(
                                    selectedRows?.includes(row?.id) || false,
                                    row?.id,
                                    "fill-fuscousGray-950",
                                  )}
                                {editPermission.includes(permission) && (
                                  <button
                                    disabled={rows.length === 0}
                                    onClick={() => {
                                      setEdit && setEdit(row.id)
                                    }}
                                  >
                                    <EditIcon className="fill-fuscousGray-950" />
                                  </button>
                                )}
                              </>
                            ) : null}
                            {column.type == "boolean" ? (
                              <div className="w-full flex justify-center">
                                {value ? (
                                  <CheckIcon className="fill-bilbao-500 w-5 h-5" />
                                ) : (
                                  <CloseIcon className="fill-cinnabar-500 w-5 h-5" />
                                )}
                              </div>
                            ) : column.type == "list" ? (
                              typeof value == "object" &&
                              value?.map((item: any) => {
                                return (
                                  <Chip
                                    label={
                                      column.valueRender
                                        ? column.valueRender(item)
                                        : ""
                                    }
                                    color={
                                      column?.chipColor
                                        ? column?.chipColor(item)
                                        : `#D9D9D9`
                                    }
                                    variant={variant}
                                  />
                                )
                              })
                            ) : column.type == "chip" ? (
                              <Chip
                                label={
                                  column.valueRender
                                    ? column.valueRender(value)
                                    : ""
                                }
                                color={
                                  column?.chipColor
                                    ? column?.chipColor(value)
                                    : `#D9D9D9`
                                }
                                variant={variant}
                              />
                            ) : (
                              <Typography
                                variant="body3"
                                className={`w-full ${column.type == "number" ? "text-right" : ""}`}
                              >
                                {column.valueRender
                                  ? column?.valueRender(value)
                                  : value}
                              </Typography>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <br />
            {enablePagination &&
              page !== undefined &&
              setPage !== undefined &&
              totalPages !== undefined && (
                <Pagination
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                  page={page}
                  setPage={setPage}
                  totalPages={totalPages}
                />
              )}
          </>
        ) : (
          <div>{/* TODO add loading placeholder */}</div>
        )}
      </div>
    </>
  )
}

export default Table
