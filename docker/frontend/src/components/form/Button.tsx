import type { ReactNode } from "react"
import { Typography } from "../Typography"
interface ButtonProps {
  label?: string
  color?: string
  fixedColor?: string
  onClick?: () => void | undefined
  disabled?: boolean
  variant?: "filled" | "outlined" | "text" | "tonal"
  type?: "button" | "submit" | "reset"
  mode?: "public" | "admin"
  icon?: ReactNode
  iconPosition?: "start" | "end"
  fullWidth?: boolean
}

function Button({
  label,
  color = "purpleHeart",
  fixedColor = "",
  disabled,
  onClick,
  variant,
  type = "button",
  mode = "admin",
  icon,
  fullWidth = false,
  iconPosition = "start",
}: ButtonProps) {
  let variantStyleMap = ""
  switch (variant) {
    default:
    case "filled":
      variantStyleMap = disabled
        ? "border-2 text-white [&_svg]:fill-white cursor-not-allowed bg-fuscousGray-400 border-fuscousGray-400 opacity-60"
        : `border-2 text-white bg-${fixedColor ? fixedColor : `${color}-500`} border-${fixedColor ? fixedColor : `${color}-500`} hover:bg-${fixedColor ? fixedColor : `${color}-400`} hover:border-${fixedColor ? fixedColor : `${color}-400`} active:bg-${fixedColor ? fixedColor : `${color}-600`} active:border-${fixedColor ? fixedColor : `${color}-600`}`
      break
    case "outlined":
      variantStyleMap = disabled
        ? "border-2 text-fuscousGray-400 [&_svg]:fill-fuscousGray-400 cursor-not-allowed border-fuscousGray-400 opacity-60"
        : `border-2 text-${fixedColor ? fixedColor : `${color}-400`} border-${fixedColor ? fixedColor : `${color}-400`} hover:text-${fixedColor ? fixedColor : `${color}-800`} hover:border-${fixedColor ? fixedColor : `${color}-800`} active:text-${fixedColor ? fixedColor : `${color}-500`} active:border-${fixedColor ? fixedColor : `${color}-500`}`
      break
    case "text":
      variantStyleMap = disabled
        ? "border-2 border-transparent text-fuscousGray-400 [&_svg]:fill-fuscousGray-400 cursor-not-allowed opacity-60"
        : `border-2 border-transparent text-${fixedColor ? fixedColor : `${color}-500`} [&_svg]:fill-${fixedColor ? fixedColor : `${color}-500`} hover:text-${fixedColor ? fixedColor : `${color}-400`} active:text-${fixedColor ? fixedColor : `${color}-600`} [&_svg]:hover:fill-${fixedColor ? fixedColor : `${color}-400`} [&_svg]:active:fill-${fixedColor ? fixedColor : `${color}-600`}`
      break
    case "tonal":
      variantStyleMap = disabled
        ? "border-2 text-fuscousGray-950 [&_svg]:fill-fuscousGray-950 cursor-not-allowed bg-fuscousGray-100 border-fuscousGray-100 opacity-60"
        : `border-2 text-${fixedColor ? fixedColor : `${color}-800`} [&_svg]:fill-${fixedColor ? fixedColor : `${color}-800`} bg-${fixedColor ? fixedColor : `${color}-200`} border-${fixedColor ? fixedColor : `${color}-200`} hover:bg-${color}-100 hover:border-${color}-100 active:bg-${fixedColor ? fixedColor : `${color}-800`} active:border-${fixedColor ? fixedColor : `${color}-800`}`
      break
  }

  const horizontalPadding = label
    ? icon
      ? iconPosition == "end"
        ? "pl-6 pr-4"
        : "pl-4 pr-6"
      : "px-6"
    : mode == "admin"
      ? "px-1"
      : "px-2"

  return (
    <button
      className={`${mode == "admin" ? "rounded py-1" : "rounded-full py-2"} ${horizontalPadding} ${fullWidth ? "w-full justify-center" : "w-fit"} ${variantStyleMap} gap-2 flex items-center`}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      type={type}
    >
      {iconPosition == "start" && icon}
      {label && <Typography variant="mediumBody2">{label}</Typography>}
      {iconPosition == "end" && icon}
    </button>
  )
}

export default Button
