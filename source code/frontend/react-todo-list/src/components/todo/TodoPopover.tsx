import { FilterIcon, ReadMoreIcon, RefreshIcon } from "@icons/index"
import Button from "components/form/Button"
import { Typography } from "components/Typography"
import { Fragment, useEffect, useState } from "react"
import { PopoverPanel, Transition } from "@headlessui/react"
import Chip from "components/Chip"
import { useSearchTodoMutation } from "pages/management/todo/todoApiSlice"
import { useNavigate } from "react-router-dom"
import Modal from "components/Modal"
import { Field, Form } from "react-final-form"
import { categoryList } from "@util/constants"
import type { Todo } from "models/Todo"
import type { SearchFieldList } from "components/pageTemplates/SearchTemplate"
import { useTranslation } from "react-i18next"
import Select from "components/form/Select"

interface TodoPopoverProps {
  open: boolean
}

function TodoPopover({
  open
}: TodoPopoverProps) {
  const { t } = useTranslation(["todo", "common", "search"])

  const todoPopoverTitle = t("latest-todo")
  const todoDefaultDisplayMsg = t("default-display-message")
  const todoReadMoreHint = t("read-more-hint")

  const searchFieldList: SearchFieldList = {
    priority: t("priority", { ns: "common" }),
    category: t("category", { ns: "common" }),
  } 

  const priorityList = [
    { value: "NA", display: "N/A" },
    { value: "LOW", display: "Low" },
    { value: "MEDIUM", display: "Medium" },
    { value: "HIGH", display: "High" },
    { value: "URGENT", display: "Urgent" }
  ]

  const [isOpenFilter, setIsOpenFilter] = useState(false)

  function fetchLatestTodoData(payloadBody: any) {
    searchTodo({
      body: payloadBody || {},
      query: { page: 0, size: 5 },
      sort: [{ key: "sentAt", sortingOrder: "desc" }],
    })
  }

  useEffect(() => {
    if (open) {
      fetchLatestTodoData(filter)
    }
  }, [open])

  const navigate = useNavigate()

  const [filter, setFilter] = useState({
    priority: null,
    category: null,
  })

  const [searchTodo, { data: todoItem }] = useSearchTodoMutation()


  function handleReadMore() {
    navigate(`/admin/management/todo?query=${JSON.stringify(filter)}`)
  }

  function handleEdit(id: number) {
    if (id) {
      navigate(`/admin/management/todo/edit/${id}`)
    }
  }

  function handleOpenFilter() {
    setIsOpenFilter(true)
  }

  function formatBody(formDatas: { [key: string]: any }) {
    const body: Todo = {
      category: formDatas.category?.value,
      priority: formDatas?.priority?.value,
    }
    
    setFilter({
      category: formDatas.category?.value,
      priority: formDatas?.priority?.value,
    })
    return body
  }

  function filterForm() {
    return (
      <>
        <div>
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
        </div>
      </>
    )
  }

  async function onSubmit(formDatas: { [key: string]: any }) {
    const body = formatBody(formDatas)
    fetchLatestTodoData(body)
    setIsOpenFilter(false)
  }

  return (
    <>
      <Modal
        isOpen={isOpenFilter}
        setIsOpen={setIsOpenFilter}
        title={t("filter", { ns: "search" })}
        content={
          <Form
            onSubmit={onSubmit}
            mutators={{
              setValue: ([field, value], state, { changeValue }) => {
                changeValue(state, field, () => value)
              },
            }}
            render={({ handleSubmit, form }) => (
              <form onSubmit={handleSubmit}>
                {filterForm()}
                <br />
                <div className="flex justify-between">
                  <Button
                    label={t("reset", { ns: "search" })}
                    onClick={() => form.initialize({})}
                    color="cinnabar"
                    variant="tonal"
                    type="reset"
                  />
                  <Button label={t("search", { ns: "search" })} type="submit" />
                </div>
              </form>
            )}
          />
        }
      />
      <Transition
        show={open}
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-0"
        enterTo="opacity-100 translate-y-1"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-1"
        leaveTo="opacity-0 translate-y-0"
      >
        <PopoverPanel className="absolute z-10 h-[80vh] w-72 right-0 mt-4">
          <div>
            <div className="overflow-y h-[80vh] shadow rounded bg-white">
              <div className="p-4 flex flex-col h-full overflow-y-auto">
                <div className="flex justify-between">
                  <div className="flex gap-1 items-center">
                    <Typography variant={"heading4"}>
                      {todoPopoverTitle}
                    </Typography>
                    <Button
                      label={""}
                      variant={"text"}
                      // Object.keys(searchParamsQuery).length > 0 ? "tonal" : "text"
                      icon={<FilterIcon />}
                      color="fuscousGray"
                      onClick={handleOpenFilter}
                    />
                  </div>

                  <div>
                    <Button
                      label={""}
                      variant={"text"}
                      icon={<RefreshIcon />}
                      color="outerSpace"
                      onClick={() => {fetchLatestTodoData(filter)}}
                    />
                  </div>
                </div>

                <div className="grow">
                  {todoItem?.content?.map((todoItem: any) => {
                    const category = categoryList.find(
                      cat => cat.value == todoItem?.category?.toString(),
                    )

                    return (
                      <>
                        <button
                          className="inline-flex relative w-full"
                          onClick={() => {
                            handleEdit(todoItem?.id)
                          }}
                        >
                          <div
                            className="w-full h-[108px] border-2 rounded my-2 border-purpleHeart-300"
                          >
                            <div className="flex flex-col p-2 h-full">
                              <Chip
                                label={category?.display ?? ""}
                                color={category?.color}
                                variant={"filled"}
                              />
                              <Typography
                                variant="body4"
                                className="h-8 text-left text-ellipsis line-clamp-1 pt-1 pb-3 break-words text-outerSpace-950"
                              >
                                {todoItem?.title}
                              </Typography>
                              <Typography
                                variant="body4"
                                className="h-8 text-left text-ellipsis line-clamp-1 pt-1 pb-3 break-words text-furcousGray-600"
                              >
                                {todoItem?.content}
                              </Typography>
                              <div className="flex justify-between mt-auto">
                                <Typography
                                  variant="body4"
                                  className="text-fuscousGray-600"
                                >
                                  {todoItem?.owner?.displayName}
                                </Typography>
                                <Typography
                                  variant="body4"
                                  className="text-fuscousGray-600"
                                >
                                  {todoItem?.sentAt?.toString()}
                                </Typography>
                              </div>
                            </div>
                          </div>

                          {!todoItem?.read && (
                            <span className="absolute flex h-3 w-3 mt-1 -right-1">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cinnabar-400 opacity-75"></span>
                              <span className="inline-flex rounded-full h-3 w-3 bg-cinnabar-500"></span>
                            </span>
                          )}
                        </button>
                      </>
                    )
                  }) ?? todoDefaultDisplayMsg}
                </div>

                <div className="self-center">
                  <Button
                    label={todoReadMoreHint}
                    variant={"text"}
                    icon={<ReadMoreIcon />}
                    color="fuscousGray"
                    onClick={handleReadMore}
                  />
                </div>
              </div>
            </div>
          </div>
        </PopoverPanel>
      </Transition>
    </>
  )
}

export default TodoPopover
