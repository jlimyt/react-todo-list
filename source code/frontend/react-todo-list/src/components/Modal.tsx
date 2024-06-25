import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import type { Dispatch, SetStateAction, ReactNode } from "react"
import { Typography } from "./Typography"
import { CloseIcon } from "@icons/index"
import { closeConfirmation } from "./commonSlice"
import { useAppDispatch } from "app/hooks"

export interface ModalProps {
  isOpen: boolean
  setIsOpen?: Dispatch<SetStateAction<boolean>>
  onClose?: any
  title?: string | ReactNode
  content?: ReactNode
}

function Modal({
  isOpen = false,
  setIsOpen,
  onClose,
  title,
  content,
}: ModalProps) {
  const dispatch = useAppDispatch()

  function closeModal() {
    if (setIsOpen) {
      setIsOpen(false)
    } else {
      dispatch(closeConfirmation())
    }

    if (onClose) {
      onClose()
    }
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={closeModal}
          id="modal"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="div" className="flex justify-between">
                    {typeof title === "string" ? (
                      <Typography variant="heading4">{title}</Typography>
                    ) : (
                      title
                    )}
                    <button
                      onClick={() => {
                        closeModal()
                      }}
                    >
                      <CloseIcon className="fill-outerSpace-950" />
                    </button>
                  </Dialog.Title>
                  <br />
                  {content}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default Modal
