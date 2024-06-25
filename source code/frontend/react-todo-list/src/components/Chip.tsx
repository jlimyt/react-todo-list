import { Typography } from "./Typography"

interface ChipProps {
  label: string
  color?: string
  variant?: "filled" | "outlined"
}

function Chip({ label, color, variant = "outlined" }: ChipProps) {
  let divClassNameMap = ""
  let divStyleMap = {}
  let textStyleMap = ""

  switch (variant) {
    default:
    case "filled":
      divClassNameMap = `rounded-sm px-2 py-1 flex w-fit`
      divStyleMap = { backgroundColor: color }
      textStyleMap = `text-white`
      break
    case "outlined":
      divClassNameMap = `border rounded-sm px-2 py-1 flex ${`border-${color}`} w-fit`
      textStyleMap = `text-${color}`
      break
  }

  return (
    <div className={divClassNameMap} style={divStyleMap}>
      <Typography variant="mediumBody3" className={textStyleMap}>
        {label}
      </Typography>
    </div>
  )
}

export default Chip
