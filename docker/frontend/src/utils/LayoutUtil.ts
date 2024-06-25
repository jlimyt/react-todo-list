import { useRef, useEffect } from "react"

export const useOutsideClick = (callback: { (): void; (): void }) => {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClick = (event: { target: any }) => {
      if (ref.current && !ref.current.contains(event.target)) {
        const modal = document.getElementById("modal")
        if (modal != null) {
          if (!modal.contains(event.target)) {
            callback()
          }
        } else {
          callback()
        }
      }
    }

    document.addEventListener("click", handleClick, true)

    return () => {
      document.removeEventListener("click", handleClick)
    }
  }, [ref])

  return ref
}
