import {
  MenuIcon,
  AccountCircleIcon,
  AlertIcon,
  IncompleteActionIcon,
  UnreadIcon,
} from "@icons/index"
import { Typography } from "./Typography"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { handleSideBarDisplay } from "./commonSlice"
import { logout, selectUserData } from "pages/public/authentication/authApiSlice"
import { Transition, Menu, Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { Fragment, useEffect, useMemo, useState } from "react"
import Button from "./form/Button"
import { LoginModal } from "pages/public/authentication/Login"
import { RegistrationModal, RegistrationResponseDialog } from "pages/public/authentication/Registration"
import { useTranslation } from "react-i18next"
import { useGetTodoStatisticsMutation } from "pages/management/todo/todoApiSlice"
// import type { Todo } from "models/Todo"
import TodoPopover from "./todo/TodoPopover"
import { Role } from "models/security/Role"

export const AdminHeader = () => {
  const { i18n, t } = useTranslation(["common"])
  const dispatch = useAppDispatch()

  const userData = useAppSelector(selectUserData)

  const [getTodoStatistics, getTodoStatisticsResponse] =
    useGetTodoStatisticsMutation({}, { refetchOnMountOrArgChange: true })

  const todoStatisticsData: any = useMemo(
    () => ({
      incompleteCount: getTodoStatisticsResponse?.data?.incompleteCount,
      unreadCount: getTodoStatisticsResponse?.data?.unreadCount,
    }),
    [getTodoStatisticsResponse.data],
  )

  useEffect(() => {
    getTodoStatistics({})
    const interval = setInterval(() => getTodoStatistics({}), 5000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const todoUnreadCount = todoStatisticsData.unreadCount ?? 0
  const todoIncompleteCount = todoStatisticsData.incompleteCount ?? 0

  return (
    <header
      style={{ height: "80px" }}
      className="flex bg-white items-center justify-between text-outerSpace-950"
    >
      <div className="flex items-center ml-6 gap-6">
        <button
          onClick={() => {
            dispatch(handleSideBarDisplay())
          }}
          className="rounded-full p-2 hover:bg-purpleHeart-300/50 active:bg-purpleHeart-300/75"
        >
          <MenuIcon className="fill-outerSpace-950" />
        </button>
        <div>
          {t('todo-title')}
        </div>
      </div>
      <div className="flex items-center mr-6 gap-6">
        <div>
          <button
            onClick={() => {
              i18n.changeLanguage("en")
              localStorage.setItem("locale", "en")
            }}
          >
            ENG
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              i18n.changeLanguage("zh_tw")
              localStorage.setItem("locale", "zh_tw")
            }}
          >
            中文 (繁體)
          </button>
        </div>
        <Popover>
          {({ open }) => (
            <>
          <PopoverButton className="focus:outline-none">
            <span className="inline-flex relative">
              <Button
                variant="text"
                icon={<AlertIcon />}
                color="outerSpace"
                fixedColor="outerSpace-950"
              />
              {todoUnreadCount > 0 && (
                <span className="absolute flex h-3 w-3 m-1.5 right-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cinnabar-400 opacity-75"></span>
                  <span className="inline-flex rounded-full h-3 w-3 bg-cinnabar-500"></span>
                </span>
              )}
            </span>
          </PopoverButton>
          <PopoverPanel>
            <TodoPopover
              open={open}
            />
          </PopoverPanel>
          </>
          )}
        </Popover>
        <div className="flex gap-2">
          <UnreadIcon />
          <Typography variant="body2">{todoUnreadCount}</Typography>
        </div>
        <div className="flex gap-2">
          <IncompleteActionIcon />
          <Typography variant="body2" className="min-w-1">
            {todoIncompleteCount}
          </Typography>
        </div>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex w-full justify-center rounded px-4 py-2 hover:bg-purpleHeart-300/50 active:bg-purpleHeart-300/75 focus:outline-none">
              <div className="flex gap-2">
                <AccountCircleIcon className="fill-outerSpace-950" />
                <div className="text-left">
                  <Typography variant="mediumBody1">{userData?.name ?? "Username"}</Typography>
                  <Typography variant="body3" className="text-fuscousGray-700">
                    {userData?.roles?.map((val: Role) => { return val?.code }) ?? "Role(s)"}
                  </Typography>
                </div>
              </div>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="z-10 absolute right-0 mt-2 w-56 origin-top-right rounded bg-white shadow focus:outline-none">
              <div className="px-1 py-1">
                <Menu.Item>
                  {() => (
                    <button
                      onClick={() => {
                        dispatch(logout())
                      }}
                      className="w-full p-2 transition duration-150 ease-in-out hover:bg-purpleHeart-300/50 focus:outline-none focus-visible:ring focus-visible:ring-purpleHeart-500/50"
                    >
                      <div className="text-left">
                        <Typography variant="mediumBody2">
                          {t('logout')}
                        </Typography>
                      </div>
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  )
}

export const PublicHeader = () => {
  const [isOpenLogin, setIsOpenLogin] = useState(false)
  const [isOpenRegistration, setIsOpenRegistration] = useState(false)
  const [isOpenRegistrationDialog, setIsOpenRegistrationDialog] = useState(false)
  const [content, setContent] = useState("")
  const { i18n, t } = useTranslation(["common"])

  return (
    <header
      style={{ height: "80px" }}
      className="flex bg-white items-center justify-between"
    >
      <LoginModal
        isOpen={isOpenLogin}
        setIsOpen={setIsOpenLogin}
        setIsOpenRegistration={setIsOpenRegistration}
      />
      <RegistrationModal
        isOpen={isOpenRegistration}
        setIsOpen={setIsOpenRegistration}
        setIsOpenRegistrationDialog={setIsOpenRegistrationDialog}
        setContent={setContent}
      />
      <RegistrationResponseDialog
        isOpen={isOpenRegistrationDialog}
        setIsOpen={setIsOpenRegistrationDialog}
        content={content}
      />
      <div className="flex items-center ml-12 gap-6">
        <div>
          {t('todo-title')}
        </div>
      </div>
      <div className="flex items-center mr-12 gap-6">
        <div>
          <button
            onClick={() => {
              i18n.changeLanguage("en")
              localStorage.setItem("locale", "en")
            }}
          >
            ENG
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              i18n.changeLanguage("zh_tw")
              localStorage.setItem("locale", "zh_tw")
            }}
          >
            中文 (繁體)
          </button>
        </div>
        <div className="border border-fuscousGray-300 h-8"></div>
        <Button
          onClick={() => {
            setIsOpenRegistration(true)
          }}
          label={t('registration')}
          mode="public"
          variant="outlined"
        />
        <Button
          onClick={() => {
            setIsOpenLogin(true)
          }}
          label={t('login')}
          mode="public"
          variant="filled"
        />
      </div>
    </header>
  )
}
